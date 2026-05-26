import CollectionsLib "../lib/collections";
import AuthLib "../lib/auth";
import WalletLib "../lib/wallet";
import CollectionTypes "../types/collections";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";

mixin (
  collectionsState : CollectionsLib.CollectionsState,
  authState : AuthLib.AdminState,
  ownershipIndexState : WalletLib.OwnershipIndexState,
) {
  let IMPORT_INDEX_WARM_PAGE_LIMIT : Nat = 25;

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
    validateCollectionImage(imageUrl);
    validateBrowseInfo(browseInfo);
    switch (standard) {
      case (#Other(_)) Runtime.trap("Only EXT, DIP721, and ICRC-7 collections are supported");
      case (_) {};
    };
    let (collection, shouldWarmIndex) = switch (CollectionsLib.findExternalCollectionByCanister(collectionsState, canisterId, standard)) {
      case (?existing) {
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
        (
          CollectionsLib.addCollection(
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
          ),
          true,
        );
      };
    };
    if (shouldWarmIndex) {
      await* warmImportedCollectionIndex(collection);
    };
    collection;
  };

  /// Return all registered collections
  public query func listCollections() : async [CollectionTypes.Collection] {
    CollectionsLib.getCollections(collectionsState);
  };

  /// Return a single collection by id
  public query func getCollection(id : CollectionTypes.CollectionId) : async ?CollectionTypes.Collection {
    CollectionsLib.getCollection(collectionsState, id);
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
      case (?updated) #ok(updated);
    };
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
