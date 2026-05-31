import CollectionsLib "../lib/collections";
import AuthLib "../lib/auth";
import WalletLib "../lib/wallet";
import CollectionTypes "../types/collections";
import Array "mo:core/Array";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Time "mo:core/Time";

mixin (
  collectionsState : CollectionsLib.CollectionsState,
  nftModerationState : CollectionsLib.NFTModerationState,
  authState : AuthLib.AdminState,
  ownershipIndexState : WalletLib.OwnershipIndexState,
) {
  let IMPORT_INDEX_WARM_PAGE_LIMIT : Nat = 25;
  let MAX_IMPORTS_PER_USER_PER_DAY : Nat = 5;
  let IMPORT_COOLDOWN_NS : Int = 60_000_000_000;
  let IMPORT_DAY_NS : Int = 86_400_000_000_000;
  let MAX_UNVERIFIED_COLLECTIONS_VISIBLE : Nat = 500;

  /// Public: import a supported external NFT collection into the shared app directory
  public shared ({ caller }) func addCollection(
    name : Text,
    description : Text,
    canisterId : Principal,
    standard : CollectionTypes.NFTStandard,
    imageUrl : Text,
    symbol : Text,
    browseInfo : ?CollectionTypes.CollectionBrowseInfo,
  ) : async CollectionTypes.Collection {
    if (Principal.isAnonymous(caller)) Runtime.trap("Anonymous caller not allowed");
    if (name == "") Runtime.trap("Collection name is required");
    if (symbol == "") Runtime.trap("Collection symbol is required");
    if (Principal.isAnonymous(canisterId)) Runtime.trap("Invalid collection canister");
    if (Text.size(name) > 80) Runtime.trap("Collection name is too long");
    if (Text.size(symbol) > 16) Runtime.trap("Collection symbol is too long");
    if (Text.size(description) > 2_000) Runtime.trap("Collection description is too long");
    validateCollectionImage(imageUrl);
    validateBrowseInfo(browseInfo);
    switch (standard) {
      case (#Other(_)) Runtime.trap("Only EXT, DIP721, and ICRC-7 collections are supported");
      case (_) {};
    };
    enforceImportRateLimits(caller);
    let (collection, shouldWarmIndex) = switch (CollectionsLib.findExternalCollectionByCanister(collectionsState, canisterId, standard)) {
      case (?existing) {
        ignore CollectionsLib.ensureImportMeta(
          collectionsState,
          existing.id,
          caller,
          #CommunityImported,
        );
        CollectionsLib.noteImportAttempt(collectionsState, caller, existing.id);
        let mergedBrowseInfo = mergeBrowseInfo(existing.browseInfo, browseInfo);
        if (mergedBrowseInfo == existing.browseInfo) {
          (existing, false);
        } else {
          let updatedCollection = switch (
            CollectionsLib.updateCollection(
              collectionsState,
              existing.id,
              existing.name,
              existing.description,
              existing.canisterId,
              existing.standard,
              existing.imageUrl,
              existing.symbol,
              mergedBrowseInfo,
              existing.dividendConfig,
            )
          ) {
            case (?updated) updated;
            case null existing;
          };
          (updatedCollection, true);
        };
      };
      case null {
        if (CollectionsLib.visibleUnverifiedCollectionCount(collectionsState) >= MAX_UNVERIFIED_COLLECTIONS_VISIBLE) {
          Runtime.trap("Community collection import is temporarily full. Ask an admin to verify or hide older imports first.");
        };
        let created = CollectionsLib.addCollection(
            collectionsState,
            name,
            description,
            canisterId,
            standard,
            imageUrl,
            symbol,
            #External,
            browseInfo,
            null,
          );
        ignore CollectionsLib.ensureImportMeta(
          collectionsState,
          created.id,
          caller,
          #CommunityImported,
        );
        (created, false);
      };
    };
    if (shouldWarmIndex and isVerifiedImport(collection.id)) {
      await* warmImportedCollectionIndex(collection);
    };
    collection;
  };

  /// Return all registered collections
  public shared query ({ caller }) func listCollections() : async [CollectionTypes.Collection] {
    let isAdmin = AuthLib.isAdmin(authState, caller);
    var collections : [CollectionTypes.Collection] = [];
    for (collection in CollectionsLib.getCollections(collectionsState).values()) {
      if (CollectionsLib.canViewerSeeCollection(collectionsState, collection, caller, isAdmin)) {
        collections := Array.concat<CollectionTypes.Collection>(collections, [collection]);
      };
    };
    collections;
  };

  public shared query ({ caller }) func listCollectionsPage(
    cursor : ?Nat,
    limit : ?Nat,
  ) : async CollectionTypes.CollectionPage {
    let isAdmin = AuthLib.isAdmin(authState, caller);
    let start = switch (cursor) {
      case (?value) value;
      case null 0;
    };
    let pageSize = normalizePublicCollectionPageLimit(limit);
    var page : [CollectionTypes.Collection] = [];
    var index : Nat = 0;
    var added : Nat = 0;
    for (collection in CollectionsLib.getCollections(collectionsState).values()) {
      if (CollectionsLib.canViewerSeeCollection(collectionsState, collection, caller, isAdmin)) {
        if (index < start) {
          index += 1;
        } else if (added < pageSize) {
          page := Array.concat<CollectionTypes.Collection>(page, [collection]);
          added += 1;
          index += 1;
        } else {
          index += 1;
        };
      };
    };
    let next = start + added;
    {
      collections = page;
      nextCursor = if (next < index) ?next else null;
      totalCount = index;
    };
  };

  public query func getCollectionImportMeta(
    collectionId : CollectionTypes.CollectionId
  ) : async ?CollectionTypes.CollectionImportMeta {
    CollectionsLib.getImportMeta(collectionsState, collectionId);
  };

  public query func listCollectionImportMetasPage(
    cursor : ?Nat,
    limit : ?Nat,
  ) : async CollectionTypes.CollectionImportMetaPage {
    CollectionsLib.getImportMetasPage(
      collectionsState,
      cursor,
      switch (limit) {
        case (?value) value;
        case null 0;
      },
    );
  };

  public shared ({ caller }) func reportCollection(
    collectionId : CollectionTypes.CollectionId,
    reason : Text,
  ) : async { #ok : CollectionTypes.CollectionImportMeta; #err : Text } {
    if (Principal.isAnonymous(caller)) {
      return #err("Anonymous caller not allowed");
    };
    if (Text.size(reason) > 500) {
      return #err("Report reason is too long");
    };
    switch (CollectionsLib.reportCollection(collectionsState, collectionId, reason)) {
      case (?meta) #ok(meta);
      case null #err("Collection not found");
    };
  };

  public shared ({ caller }) func reportNFT(
    collectionId : CollectionTypes.CollectionId,
    tokenId : Text,
    reason : Text,
  ) : async { #ok : CollectionTypes.NFTReportMeta; #err : Text } {
    if (Principal.isAnonymous(caller)) {
      return #err("Anonymous caller not allowed");
    };
    let normalizedTokenId = Text.trim(tokenId, #char ' ');
    if (normalizedTokenId == "") {
      return #err("Token ID is required");
    };
    if (Text.size(normalizedTokenId) > 256) {
      return #err("Token ID is too long");
    };
    if (Text.size(reason) > 500) {
      return #err("Report reason is too long");
    };
    switch (CollectionsLib.getCollection(collectionsState, collectionId)) {
      case null return #err("Collection not found");
      case (?_) {};
    };
    #ok(
      CollectionsLib.reportNFT(
        nftModerationState,
        collectionId,
        normalizedTokenId,
        caller,
        reason,
      )
    );
  };

  public shared query ({ caller }) func listNFTReportMetasPage(
    cursor : ?Nat,
    limit : ?Nat,
  ) : async CollectionTypes.NFTReportMetaPage {
    if (Principal.isAnonymous(caller) or not AuthLib.isAdmin(authState, caller)) {
      Runtime.trap("Unauthorized: admin only");
    };
    CollectionsLib.getNFTReportMetasPage(
      nftModerationState,
      cursor,
      switch (limit) {
        case (?value) value;
        case null 0;
      },
    );
  };

  public shared ({ caller }) func adminApproveNFTReport(
    collectionId : CollectionTypes.CollectionId,
    tokenId : Text,
  ) : async { #ok : CollectionTypes.NFTReportMeta; #err : Text } {
    adminSetNFTReportStatus(caller, collectionId, tokenId, #Approved);
  };

  public shared ({ caller }) func adminHideNFTReport(
    collectionId : CollectionTypes.CollectionId,
    tokenId : Text,
  ) : async { #ok : CollectionTypes.NFTReportMeta; #err : Text } {
    adminSetNFTReportStatus(caller, collectionId, tokenId, #Hidden);
  };

  public shared ({ caller }) func adminVerifyCollection(
    collectionId : CollectionTypes.CollectionId
  ) : async { #ok : CollectionTypes.CollectionImportMeta; #err : Text } {
    if (Principal.isAnonymous(caller)) {
      return #err("Anonymous caller not allowed");
    };
    if (not AuthLib.isAdmin(authState, caller)) {
      return #err("Unauthorized: admin only");
    };
    let collection = switch (CollectionsLib.getCollection(collectionsState, collectionId)) {
      case null return #err("Collection not found");
      case (?value) value;
    };
    let meta = switch (CollectionsLib.setCollectionTrustStatus(collectionsState, collectionId, #Verified)) {
      case (?value) value;
      case null return #err("Collection not found");
    };
    WalletLib.clearOwnershipIndexForCollection(ownershipIndexState, collectionId);
    await* warmImportedCollectionIndex(collection);
    #ok(meta);
  };

  public shared ({ caller }) func adminHideCollection(
    collectionId : CollectionTypes.CollectionId
  ) : async { #ok : CollectionTypes.CollectionImportMeta; #err : Text } {
    adminSetCollectionTrustStatus(caller, collectionId, #Hidden);
  };

  public shared ({ caller }) func adminBlockCollection(
    collectionId : CollectionTypes.CollectionId
  ) : async { #ok : CollectionTypes.CollectionImportMeta; #err : Text } {
    adminSetCollectionTrustStatus(caller, collectionId, #Blocked);
  };

  public shared ({ caller }) func adminDisableCollectionSync(
    collectionId : CollectionTypes.CollectionId
  ) : async { #ok : CollectionTypes.CollectionImportMeta; #err : Text } {
    adminSetCollectionTrustStatus(caller, collectionId, #SyncDisabled);
  };

  public shared ({ caller }) func adminMarkCollectionNeedsBrowseInfo(
    collectionId : CollectionTypes.CollectionId
  ) : async { #ok : CollectionTypes.CollectionImportMeta; #err : Text } {
    adminSetCollectionTrustStatus(caller, collectionId, #NeedsBrowseInfo);
  };

  /// Return a single collection by id
  public shared query ({ caller }) func getCollection(id : CollectionTypes.CollectionId) : async ?CollectionTypes.Collection {
    switch (CollectionsLib.getCollection(collectionsState, id)) {
      case null null;
      case (?collection) {
        if (CollectionsLib.canViewerSeeCollection(collectionsState, collection, caller, AuthLib.isAdmin(authState, caller))) {
          ?collection;
        } else {
          null;
        };
      };
    };
  };

  /// Admin only: update the token range Mintlab can use when a collection does not enumerate tokens reliably.
  public shared ({ caller }) func updateCollectionBrowseInfo(
    collectionId : CollectionTypes.CollectionId,
    browseInfo : ?CollectionTypes.CollectionBrowseInfo,
  ) : async { #ok : CollectionTypes.Collection; #err : Text } {
    if (Principal.isAnonymous(caller)) {
      return #err("Anonymous caller not allowed");
    };
    if (not AuthLib.isAdmin(authState, caller)) {
      return #err("Unauthorized: admin only");
    };
    validateBrowseInfo(browseInfo);
    let collection = switch (CollectionsLib.getCollection(collectionsState, collectionId)) {
      case null return #err("Collection not found");
      case (?value) value;
    };
    switch (
      CollectionsLib.updateCollection(
        collectionsState,
        collection.id,
        collection.name,
        collection.description,
        collection.canisterId,
        collection.standard,
        collection.imageUrl,
        collection.symbol,
        browseInfo,
        collection.dividendConfig,
      )
    ) {
      case null #err("Could not update collection browse settings");
      case (?updated) {
        WalletLib.clearOwnershipIndexForCollection(ownershipIndexState, collectionId);
        #ok(updated);
      };
    };
  };

  public shared ({ caller }) func adminResetCollectionOwnershipIndex(
    collectionId : CollectionTypes.CollectionId
  ) : async { #ok : Bool; #err : Text } {
    if (Principal.isAnonymous(caller)) {
      return #err("Anonymous caller not allowed");
    };
    if (not AuthLib.isAdmin(authState, caller)) {
      return #err("Unauthorized: admin only");
    };
    switch (CollectionsLib.getCollection(collectionsState, collectionId)) {
      case null return #err("Collection not found");
      case (?_) {};
    };
    WalletLib.clearOwnershipIndexForCollection(ownershipIndexState, collectionId);
    #ok(true);
  };

  /// Admin only: remove a collection by id
  public shared ({ caller }) func removeCollection(id : CollectionTypes.CollectionId) : async Bool {
    if (not AuthLib.isAdmin(authState, caller)) Runtime.trap("Unauthorized: admin only");
    CollectionsLib.removeCollection(collectionsState, id);
  };

  func warmImportedCollectionIndex(collection : CollectionTypes.Collection) : async* () {
    if (collection.kind != #External) {
      return;
    };
    switch (collection.standard) {
      case (#EXT) {
        if (not warmIndexHasBrowseRange(collection)) {
          return;
        };
      };
      case (#DIP721) {
        if (not warmIndexHasBrowseRange(collection)) {
          return;
        };
      };
      case (_) {};
    };
    let cursor = switch (WalletLib.getOwnershipIndexStatus(ownershipIndexState, collection.id)) {
      case (?status) {
        if (status.complete) {
          return;
        };
        status.cursor;
      };
      case null null;
    };
    ignore await* WalletLib.indexCollectionOwnershipPage(
      ownershipIndexState,
      collection,
      cursor,
      IMPORT_INDEX_WARM_PAGE_LIMIT,
    );
  };

  func adminSetCollectionTrustStatus(
    caller : Principal,
    collectionId : CollectionTypes.CollectionId,
    status : CollectionTypes.CollectionTrustStatus,
  ) : { #ok : CollectionTypes.CollectionImportMeta; #err : Text } {
    if (Principal.isAnonymous(caller)) {
      return #err("Anonymous caller not allowed");
    };
    if (not AuthLib.isAdmin(authState, caller)) {
      return #err("Unauthorized: admin only");
    };
    switch (CollectionsLib.setCollectionTrustStatus(collectionsState, collectionId, status)) {
      case (?meta) #ok(meta);
      case null #err("Collection not found");
    };
  };

  func adminSetNFTReportStatus(
    caller : Principal,
    collectionId : CollectionTypes.CollectionId,
    tokenId : Text,
    status : CollectionTypes.NFTReportStatus,
  ) : { #ok : CollectionTypes.NFTReportMeta; #err : Text } {
    if (Principal.isAnonymous(caller)) {
      return #err("Anonymous caller not allowed");
    };
    if (not AuthLib.isAdmin(authState, caller)) {
      return #err("Unauthorized: admin only");
    };
    let normalizedTokenId = Text.trim(tokenId, #char ' ');
    if (normalizedTokenId == "") {
      return #err("Token ID is required");
    };
    switch (CollectionsLib.getCollection(collectionsState, collectionId)) {
      case null return #err("Collection not found");
      case (?_) {};
    };
    switch (
      CollectionsLib.setNFTReportStatus(
        nftModerationState,
        collectionId,
        normalizedTokenId,
        status,
        caller,
      )
    ) {
      case (?meta) #ok(meta);
      case null #err("NFT report not found");
    };
  };

  func isVerifiedImport(collectionId : CollectionTypes.CollectionId) : Bool {
    switch (CollectionsLib.getImportMeta(collectionsState, collectionId)) {
      case (?meta) meta.trustStatus == #Verified;
      case null false;
    };
  };

  func enforceImportRateLimits(caller : Principal) {
    let now = Time.now();
    switch (CollectionsLib.lastImportAt(collectionsState, caller)) {
      case (?lastImportAt) {
        if (now - lastImportAt < IMPORT_COOLDOWN_NS) {
          Runtime.trap("Please wait one minute between collection imports");
        };
      };
      case null {};
    };
    let recent = CollectionsLib.recentImportCountForUser(
      collectionsState,
      caller,
      now - IMPORT_DAY_NS,
    );
    if (recent >= MAX_IMPORTS_PER_USER_PER_DAY) {
      Runtime.trap("Daily collection import limit reached");
    };
  };

  func warmIndexHasBrowseRange(collection : CollectionTypes.Collection) : Bool {
    switch (collection.browseInfo) {
      case null false;
      case (?browseInfo) {
        switch (browseInfo.totalSupply) {
          case null false;
          case (?_) true;
        };
      };
    };
  };

  func validateBrowseInfo(browseInfo : ?CollectionTypes.CollectionBrowseInfo) {
    switch (browseInfo) {
      case null {};
      case (?info) {
        switch (info.totalSupply) {
          case null {};
          case (?totalSupply) {
            if (totalSupply == 0) {
              Runtime.trap("Collection supply must be greater than zero when provided");
            };
          };
        };
      };
    };
  };

  func validateCollectionImage(imageUrl : Text) {
    if (imageUrl == "") {
      Runtime.trap("Collection image is required");
    };
    if (imageUrl.size() > 1_900_000) {
      Runtime.trap("Collection image is too large for on-chain storage");
    };
  };

  func normalizePublicCollectionPageLimit(limit : ?Nat) : Nat {
    switch (limit) {
      case null 25;
      case (?value) {
        if (value == 0) {
          25;
        } else if (value > 100) {
          100;
        } else {
          value;
        };
      };
    };
  };

  func mergeBrowseInfo(
    existing : ?CollectionTypes.CollectionBrowseInfo,
    incoming : ?CollectionTypes.CollectionBrowseInfo,
  ) : ?CollectionTypes.CollectionBrowseInfo {
    switch (existing, incoming) {
      case (null, null) null;
      case (?value, null) ?value;
      case (null, ?value) ?value;
      case (?current, ?next) {
        ?{
          totalSupply = switch (current.totalSupply) {
            case (?value) ?value;
            case null next.totalSupply;
          };
          tokenIndexOffset = switch (current.tokenIndexOffset) {
            case (?value) ?value;
            case null next.tokenIndexOffset;
          };
        };
      };
    };
  };
};
