import Array "mo:core/Array";
import Blob "mo:core/Blob";
import Error "mo:core/Error";
import Int "mo:core/Int";
import Map "mo:core/Map";
import AuthLib "../lib/auth";
import CollectionLib "../lib/collections";
import IcpLib "../lib/icp";
import MarketplaceLib "../lib/marketplace";
import MintLib "../lib/mint";
import NFTStandards "../lib/nft-standards";
import WalletLib "../lib/wallet";
import CollectionTypes "../types/collections";
import CommonTypes "../types/common";
import WalletTypes "../types/wallet";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Principal "mo:core/Principal";

mixin (
  walletState : WalletLib.WalletState,
  ownershipIndexState : WalletLib.OwnershipIndexState,
  collectionsState : CollectionLib.CollectionsState,
  marketplaceState : MarketplaceLib.MarketplaceState,
  marketplaceListingLockState : MarketplaceLib.MarketplaceListingLockState,
  mintState : MintLib.MintState,
  authState : AuthLib.AdminState,
  canisterId : Principal,
) {
  type WalletChildTransferResult = {
    #ok : Nat;
    #err : Text;
  };

  type WalletChildCollectionActor = actor {
    mintlab_transfer_from : (Principal, Principal, Nat) -> async WalletChildTransferResult;
  };

  type WalletChildMintlabNFT = {
    tokenId : Nat;
    metadata : WalletTypes.NFTMetadata;
  };

  type WalletChildCollectionSyncActor = actor {
    mintlab_token_ids : (?Nat, ?Nat) -> async [Nat];
    mintlab_nfts_of : (Principal, ?Nat, ?Nat) -> async [WalletChildMintlabNFT];
    mintlab_owner_of : ([Nat]) -> async [?NFTStandards.ICRC7Account];
  };

  type WalletCollectionSyncResult = {
    newCount : Nat;
    errors : [Text];
    skipped : [WalletTypes.WalletSyncSkip];
  };

  type WalletAutoIndexResult = {
    nfts : [WalletTypes.WalletNFT];
    errors : [Text];
    skip : ?WalletTypes.WalletSyncSkip;
    complete : Bool;
  };

  type WalletSelectedScanResult = {
    nfts : [WalletTypes.WalletNFT];
    errors : [Text];
    skip : ?WalletTypes.WalletSyncSkip;
    scannedThisRun : Nat;
    indexedThisRun : Nat;
    complete : Bool;
    status : ?WalletTypes.CollectionIndexStatus;
  };

  // Kept as stable fields for upgrade compatibility; sync uses the transient safe limits below.
  let AUTO_INDEX_PAGE_LIMIT : Nat = 40;
  let AUTO_INDEX_MAX_PAGES_PER_SYNC : Nat = 2;
  transient let SAFE_AUTO_INDEX_PAGE_LIMIT : Nat = 50;
  transient let SAFE_AUTO_INDEX_MAX_PAGES_PER_SYNC : Nat = 1;
  transient let SYNC_COLLECTION_PAGE_DEFAULT : Nat = 1;
  transient let SYNC_COLLECTION_PAGE_MAX : Nat = 3;
  transient let TARGET_SYNC_INDEX_PAGE_DEFAULT : Nat = 3;
  transient let TARGET_SYNC_INDEX_PAGE_MAX : Nat = 3;
  transient let TARGET_SYNC_TOKEN_HINT_MAX : Nat = 3;
  transient let EXT_SELECTED_REGISTRY_SYNC_MAX_ENTRIES : Nat = 2_000;
  transient let CHILD_NFT_SYNC_PAGE_SIZE : Nat = 25;
  transient let CHILD_TOKEN_SYNC_PAGE_SIZE : Nat = 25;
  transient let PUBLIC_PAGE_DEFAULT : Nat = 50;
  transient let PUBLIC_PAGE_MAX : Nat = 100;
  transient let WALLET_SYNC_COOLDOWN_NS : Int = 8_000_000_000; // 8 seconds
  transient let walletSyncLocks = Map.empty<Principal, Bool>();
  transient let walletSyncCooldowns = Map.empty<Principal, Int>();

  func acquireWalletSyncLock(caller : Principal) : Bool {
    switch (Map.get(walletSyncLocks, Principal.compare, caller)) {
      case (?_) false;
      case null {
        Map.add(walletSyncLocks, Principal.compare, caller, true);
        true;
      };
    };
  };

  func releaseWalletSyncLock(caller : Principal) {
    Map.remove(walletSyncLocks, Principal.compare, caller);
  };

  func appendUniqueTokenCandidate(values : [Text], value : Text) : [Text] {
    for (existing in values.values()) {
      if (existing == value) {
        return values;
      };
    };
    Array.concat<Text>(values, [value]);
  };

  func externalTokenCandidateIds(
    collection : CollectionTypes.Collection,
    tokenId : Text,
  ) : [Text] {
    let trimmed = Text.trim(tokenId, #char ' ');
    var candidates : [Text] = [WalletLib.canonicalTokenId(collection, trimmed)];
    switch (collection.standard) {
      case (#EXT) {
        switch (Nat.fromText(trimmed)) {
          case (?tokenIndex) {
            if (tokenIndex > 0) {
              candidates := appendUniqueTokenCandidate(
                candidates,
                WalletLib.canonicalTokenId(collection, Nat.toText(tokenIndex - 1)),
              );
            };
            if (tokenIndex < 4_294_967_295) {
              candidates := appendUniqueTokenCandidate(
                candidates,
                WalletLib.canonicalTokenId(collection, Nat.toText(tokenIndex + 1)),
              );
            };
          };
          case null {};
        };
      };
      case (_) {};
    };
    candidates;
  };

  func firstNonEmptyText(values : [Text]) : ?Text {
    for (value in values.values()) {
      if (Text.size(Text.trim(value, #char ' ')) > 0) {
        return ?value;
      };
    };
    null;
  };

  func tokenCandidateFailureMessage(
    tokenId : Text,
    candidates : [Text],
    errors : [Text],
  ) : Text {
    let hint = Text.trim(tokenId, #char ' ');
    let base = if (candidates.size() > 1) {
      "Could not verify token '" # hint # "' in the expected on-chain owner account. Mintlab also checked adjacent token IDs for 0/1 offset issues.";
    } else {
      "Could not verify token '" # hint # "' in the expected on-chain owner account.";
    };
    switch (firstNonEmptyText(errors)) {
      case (?message) base # " " # message;
      case null base;
    };
  };

  public shared ({ caller }) func registerNFT(
    collectionId : WalletTypes.CollectionId,
    tokenId : Text,
    metadata : WalletTypes.NFTMetadata,
  ) : async { #ok : WalletTypes.WalletNFT; #err : Text } {
    if (Principal.isAnonymous(caller)) {
      return #err("You must be logged in to register an NFT");
    };
    let collection = switch (CollectionLib.getCollection(collectionsState, collectionId)) {
      case null return #err("Collection not found");
      case (?value) value;
    };
    let canonicalTokenId = WalletLib.canonicalTokenId(collection, tokenId);

    let verifiedMetadata = switch (collection.kind) {
      case (#Minted) {
        if (Principal.equal(collection.canisterId, canisterId)) {
          let mintTokenId = switch (Nat.fromText(canonicalTokenId)) {
            case null return #err("Minted collection token IDs must be numeric");
            case (?value) value;
          };
          switch (MintLib.getToken(mintState, mintTokenId)) {
            case null return #err("Minted NFT not found");
            case (?token) {
              if (not Principal.equal(token.owner, caller)) {
                return #err("You do not own this minted NFT");
              };
              if (
                not MintLib.tokenBelongsToCollection(
                  token,
                  collection.id,
                  MintLib.getConfig(mintState).collectionId,
                )
              ) {
                return #err("This minted NFT does not belong to the selected collection");
              };
              WalletLib.mergeMetadata(MintLib.publicMetadata(token.metadata), metadata);
            };
          };
        } else {
          let userAccountId = IcpLib.accountIdentifier(caller, IcpLib.zeroSubaccount());
          let verification = await* WalletLib.verifyOwnedNFT(
            collection,
            caller,
            userAccountId,
            canonicalTokenId,
            #Minted,
          );
          switch (verification) {
            case (#err(message)) return #err(message);
            case (#ok(onChainMetadata)) WalletLib.mergeMetadata(onChainMetadata, metadata);
          };
        };
      };
      case (#External) {
        let userAccountId = IcpLib.accountIdentifier(caller, IcpLib.zeroSubaccount());
        let verification = await* WalletLib.verifyOwnedNFT(
          collection,
          caller,
          userAccountId,
          canonicalTokenId,
          #Registered,
        );
        switch (verification) {
          case (#err(message)) return #err(message);
          case (#ok(onChainMetadata)) WalletLib.mergeMetadata(onChainMetadata, metadata);
        };
      };
    };

    let nft = WalletLib.registerNFT(
      walletState,
      caller,
      collectionId,
      canonicalTokenId,
      verifiedMetadata,
      switch (collection.kind) {
        case (#Minted) #Minted;
        case (#External) #Registered;
      },
    );
    #ok(nft);
  };

  public shared ({ caller }) func prepareVaultDeposit(
    collectionId : WalletTypes.CollectionId,
    tokenId : Text,
  ) : async { #ok : Text; #err : Text } {
    if (Principal.isAnonymous(caller)) {
      return #err("You must be logged in to prepare a deposit");
    };
    let collection = switch (CollectionLib.getCollection(collectionsState, collectionId)) {
      case null return #err("Collection not found");
      case (?value) value;
    };
    if (collection.kind != #External) {
      return #err("Only external collections need a vault deposit");
    };
    let canonicalTokenId = WalletLib.canonicalTokenId(collection, tokenId);
    WalletLib.prepareDeposit(walletState, caller, collectionId, canonicalTokenId);
  };

  public shared ({ caller }) func claimVaultDeposit(
    collectionId : WalletTypes.CollectionId,
    tokenId : Text,
  ) : async { #ok : WalletTypes.WalletNFT; #err : Text } {
    if (Principal.isAnonymous(caller)) {
      return #err("You must be logged in to claim a deposit");
    };
    let collection = switch (CollectionLib.getCollection(collectionsState, collectionId)) {
      case null return #err("Collection not found");
      case (?value) value;
    };
    if (collection.kind != #External) {
      return #err("Only external collections can be deposited into the vault");
    };
    let canonicalTokenId = WalletLib.canonicalTokenId(collection, tokenId);
    switch (WalletLib.getPreparedDeposit(walletState, collectionId, canonicalTokenId)) {
      case null {
        return #err("Prepare this vault deposit before claiming it.");
      };
      case (?deposit) {
        if (not Principal.equal(deposit.user, caller)) {
          return #err("This deposit was prepared by another user");
        };
      };
    };
    switch (MarketplaceLib.findActiveEscrowedNFT(marketplaceState, collectionId, canonicalTokenId)) {
      case (?_) {
        return #err("This NFT is currently locked in a marketplace listing.");
      };
      case null {};
    };
    let vaultAccountId = IcpLib.accountIdentifier(canisterId, IcpLib.zeroSubaccount());
    let verification = await* WalletLib.verifyOwnedNFT(
      collection,
      canisterId,
      vaultAccountId,
      canonicalTokenId,
      #Vaulted,
    );
    switch (verification) {
      case (#err(message)) return #err(message);
      case (#ok(verifiedMetadata)) {
        let nft = WalletLib.registerNFT(
          walletState,
          caller,
          collectionId,
          canonicalTokenId,
          verifiedMetadata,
          #Vaulted,
        );
        WalletLib.clearPreparedDeposit(walletState, collectionId, canonicalTokenId);
        #ok(nft);
      };
    };
  };

  public shared ({ caller }) func sendNFT(
    nftId : WalletTypes.NFTId,
    recipient : Principal,
  ) : async { #ok : Text; #err : Text } {
    if (Principal.isAnonymous(caller)) {
      return #err("You must be logged in to send an NFT");
    };
    if (Principal.isAnonymous(recipient)) {
      return #err("Cannot send an NFT to the anonymous principal");
    };
    let nft = switch (WalletLib.getNFT(walletState, nftId)) {
      case null return sendLocalMintedNFT(caller, nftId, recipient);
      case (?value) value;
    };
    if (not Principal.equal(nft.owner, caller)) {
      return #err("You do not own this NFT");
    };
    let collection = switch (CollectionLib.getCollection(collectionsState, nft.collectionId)) {
      case null return #err("Collection not found");
      case (?value) value;
    };

    switch (nft.location) {
      case (#Registered) {
        #err(
          "This NFT is only registered from your external wallet. Deposit it into the app vault before sending it from inside the app."
        );
      };
      case (#Vaulted) {
        let result = await* WalletLib.sendVaultedNFT(
          walletState,
          nftId,
          caller,
          canisterId,
          recipient,
          collection,
        );
        switch (result) {
          case (#ok(_)) {};
          case (#err(_)) {};
        };
        result;
      };
      case (#Minted) {
        let mintTokenId = switch (Nat.fromText(nft.tokenId)) {
          case null return #err("Minted token IDs must be numeric");
          case (?value) value;
        };
        if (Principal.equal(collection.canisterId, canisterId)) {
          switch (MintLib.transferToken(mintState, mintTokenId, caller, recipient)) {
            case (#err(message)) #err(message);
            case (#ok(_)) {
              switch (WalletLib.transferManagedNFT(walletState, nftId, caller, recipient, #Minted)) {
                case (#err(message)) #err(message);
                case (#ok(_)) #ok("Minted NFT transferred successfully");
              };
            };
          };
        } else {
          let child : WalletChildCollectionActor = actor (collection.canisterId.toText());
          let transferResult = try {
            await child.mintlab_transfer_from(caller, recipient, mintTokenId);
          } catch (error) {
            return #err("Collection canister transfer failed: " # Error.message(error));
          };
          switch (transferResult) {
            case (#err(message)) #err(message);
            case (#ok(_)) {
              switch (WalletLib.transferManagedNFT(walletState, nftId, caller, recipient, #Minted)) {
                case (#err(message)) #err(message);
                case (#ok(_)) #ok("Minted NFT transferred successfully");
              };
            };
          };
        };
      };
    };
  };

  public shared ({ caller }) func syncExternalNFTOwner(
    collectionId : WalletTypes.CollectionId,
    tokenId : Text,
    owner : Principal,
  ) : async { #ok : WalletTypes.WalletNFT; #err : Text } {
    if (Principal.isAnonymous(caller)) {
      return #err("You must be logged in to sync an NFT owner");
    };
    if (Principal.isAnonymous(owner)) {
      return #err("Cannot sync an NFT to the anonymous principal");
    };
    let collection = switch (CollectionLib.getCollection(collectionsState, collectionId)) {
      case null return #err("Collection not found");
      case (?value) value;
    };
    if (collection.kind != #External) {
      return #err("Only imported external NFTs can be synced by owner");
    };
    let candidates = externalTokenCandidateIds(collection, tokenId);
    var errors : [Text] = [];
    for (canonicalTokenId in candidates.values()) {
      switch (await* syncExternalNFTOwnerCandidate(caller, collection, canonicalTokenId, owner)) {
        case (#ok(nft)) return #ok(nft);
        case (#err(message)) {
          errors := Array.concat<Text>(errors, [message]);
        };
      };
    };
    #err(tokenCandidateFailureMessage(tokenId, candidates, errors));
  };

  func syncExternalNFTOwnerCandidate(
    caller : Principal,
    collection : CollectionTypes.Collection,
    canonicalTokenId : Text,
    owner : Principal,
  ) : async* { #ok : WalletTypes.WalletNFT; #err : Text } {
    let collectionId = collection.id;
    let metadataFallback = switch (WalletLib.findByCollectionToken(walletState, collectionId, canonicalTokenId)) {
      case (?knownNFT) {
        if (
          not Principal.equal(owner, caller) and
          not AuthLib.isAdmin(authState, caller) and
          (
            not Principal.equal(knownNFT.owner, caller) or
            knownNFT.location != #Registered
          )
        ) {
          return #err("You can only sync NFTs to yourself unless you are transferring a registered NFT you own.");
        };
        ?knownNFT.metadata;
      };
      case null null;
    };
    if (metadataFallback == null and not Principal.equal(owner, caller) and not AuthLib.isAdmin(authState, caller)) {
      return #err("You can only sync NFTs to your own Internet Identity.");
    };
    if (not MarketplaceLib.acquireListingTokenLock(marketplaceListingLockState, collectionId, canonicalTokenId)) {
      return #err("This NFT is currently being listed. Try again shortly.");
    };
    try {
      switch (MarketplaceLib.findActiveEscrowedNFT(marketplaceState, collectionId, canonicalTokenId)) {
        case (?_) {
          return #err("This NFT is locked in an active marketplace listing. Cancel or settle the listing first.");
        };
        case null {};
      };

      let ownerAccountId = IcpLib.accountIdentifier(owner, IcpLib.zeroSubaccount());
      let verification = await* WalletLib.verifyKnownOwnedNFTWithFallback(
        collection,
        owner,
        ownerAccountId,
        canonicalTokenId,
        metadataFallback,
      );
      switch (verification) {
        case (#err(message)) #err(message);
        case (#ok(onChainMetadata)) {
          switch (MarketplaceLib.findActiveEscrowedNFT(marketplaceState, collectionId, canonicalTokenId)) {
            case (?_) {
              return #err("This NFT is locked in an active marketplace listing. Cancel or settle the listing first.");
            };
            case null {};
          };
          let nft = WalletLib.registerNFT(
            walletState,
            owner,
            collectionId,
            canonicalTokenId,
            onChainMetadata,
            #Registered,
          );
          #ok(nft);
        };
      };
    } finally {
      MarketplaceLib.releaseListingTokenLock(marketplaceListingLockState, collectionId, canonicalTokenId);
    };
  };

  public shared query ({ caller }) func getUserNFTs(user : Principal) : async [WalletTypes.WalletNFT] {
    walletVisibleNFTsForViewer(user, caller);
  };

  public shared query ({ caller }) func getUserNFTsPage(
    user : Principal,
    cursor : ?Nat,
    limit : ?Nat,
  ) : async WalletTypes.WalletNFTPage {
    let nfts = walletVisibleNFTsForViewer(user, caller);
    let start = switch (cursor) {
      case (?value) value;
      case null 0;
    };
    let pageSize = normalizePublicPageSize(limit);
    let page = sliceWalletNFTs(nfts, start, pageSize);
    let next = start + page.size();
    {
      nfts = page;
      nextCursor = if (next < nfts.size()) ?next else null;
      totalCount = nfts.size();
    };
  };

  public shared query ({ caller }) func getNFTStats(user : Principal) : async WalletTypes.NFTStats {
    WalletLib.buildNFTStats(walletVisibleNFTsForViewer(user, caller));
  };

  public shared query ({ caller }) func getUserAccountId() : async CommonTypes.AccountIdentifier {
    IcpLib.accountIdentifier(canisterId, IcpLib.principalToSubaccount(caller));
  };

  public shared query ({ caller }) func getVaultPrincipal() : async Principal {
    if (Principal.isAnonymous(caller)) {
      return canisterId;
    };
    canisterId;
  };

  public shared query ({ caller }) func getVaultAccountId() : async CommonTypes.AccountIdentifier {
    if (Principal.isAnonymous(caller)) {
      return IcpLib.accountIdentifier(canisterId, IcpLib.zeroSubaccount());
    };
    IcpLib.accountIdentifier(canisterId, IcpLib.zeroSubaccount());
  };

  public query func getCollectionIndexStatus(
    collectionId : WalletTypes.CollectionId
  ) : async ?WalletTypes.CollectionIndexStatus {
    WalletLib.getOwnershipIndexStatus(ownershipIndexState, collectionId);
  };

  public shared ({ caller }) func indexCollectionOwnershipPage(
    collectionId : WalletTypes.CollectionId,
    cursor : ?Text,
    limit : Nat,
  ) : async {
    #ok : WalletTypes.CollectionIndexPageResult;
    #err : Text;
  } {
    if (Principal.isAnonymous(caller)) {
      return #err("You must be logged in to index a collection");
    };
    if (not AuthLib.isAdmin(authState, caller)) {
      return #err("Unauthorized: admin only");
    };
    let collection = switch (CollectionLib.getCollection(collectionsState, collectionId)) {
      case null return #err("Collection not found");
      case (?value) value;
    };
    if (collection.kind != #External) {
      return #err("Only imported external collections need ownership indexing");
    };
    await* WalletLib.indexCollectionOwnershipPage(ownershipIndexState, collection, cursor, limit);
  };

  public shared ({ caller }) func syncUserNFTsV2() : async {
    #ok : WalletTypes.WalletSyncV2Result;
    #err : Text;
  } {
    if (Principal.isAnonymous(caller)) {
      return #err("You must be logged in to sync your wallet");
    };
    if (not acquireWalletSyncLock(caller)) {
      return #err("Wallet sync is already running. Wait for the current sync to finish.");
    };
    try {
      switch (enforceWalletSyncCooldown(caller)) {
        case (?message) return #err(message);
        case null {};
      };
      legacyWalletSyncPageResult(
        await* syncUserNFTsPageUnlocked(caller, null, SYNC_COLLECTION_PAGE_DEFAULT)
      );
    } finally {
      releaseWalletSyncLock(caller);
    };
  };

  public shared ({ caller }) func syncUserNFTsPage(
    cursor : ?Nat,
    maxCollections : Nat,
  ) : async {
    #ok : WalletTypes.WalletSyncPageResult;
    #err : Text;
  } {
    if (Principal.isAnonymous(caller)) {
      return #err("You must be logged in to sync your wallet");
    };
    if (not acquireWalletSyncLock(caller)) {
      return #err("Wallet sync is already running. Wait for the current sync to finish.");
    };
    try {
      switch (enforceWalletSyncCooldown(caller)) {
        case (?message) return #err(message);
        case null {};
      };
      await* syncUserNFTsPageUnlocked(caller, cursor, maxCollections);
    } finally {
      releaseWalletSyncLock(caller);
    };
  };

  public shared ({ caller }) func syncUserNFTsForCollection(
    collectionId : WalletTypes.CollectionId,
    maxIndexPages : Nat,
  ) : async {
    #ok : WalletTypes.WalletSyncPageResult;
    #err : Text;
  } {
    if (Principal.isAnonymous(caller)) {
      return #err("You must be logged in to sync your wallet");
    };
    if (not acquireWalletSyncLock(caller)) {
      return #err("Wallet sync is already running. Wait for the current sync to finish.");
    };
    try {
      switch (enforceWalletSyncCooldown(caller)) {
        case (?message) return #err(message);
        case null {};
      };
      let collection = switch (CollectionLib.getCollection(collectionsState, collectionId)) {
        case null return #err("Collection not found");
        case (?value) value;
      };
      let userAccountId = IcpLib.accountIdentifier(caller, IcpLib.zeroSubaccount());
      let userAccountIdHex = WalletLib.blobToHexPublic(userAccountId);
      let result = await* syncOneWalletCollectionWithIndexBudget(
        caller,
        collection,
        userAccountId,
        userAccountIdHex,
        normalizeTargetIndexPageBudget(maxIndexPages),
      );
      #ok({
        newCount = result.newCount;
        errors = result.errors;
        skipped = result.skipped;
        nextCursor = null;
        complete = result.errors.size() == 0 and result.skipped.size() == 0;
        checkedCollections = 1;
      });
    } finally {
      releaseWalletSyncLock(caller);
    };
  };

  public shared ({ caller }) func syncUserNFTsForCollectionV2(
    collectionId : WalletTypes.CollectionId,
    tokenHints : [Text],
    maxPages : Nat,
  ) : async {
    #ok : WalletTypes.WalletCollectionSyncProgress;
    #err : Text;
  } {
    if (Principal.isAnonymous(caller)) {
      return #err("You must be logged in to sync your wallet");
    };
    if (not acquireWalletSyncLock(caller)) {
      return #err("Wallet sync is already running. Wait for the current sync to finish.");
    };
    try {
      switch (enforceWalletSyncCooldown(caller)) {
        case (?message) return #err(message);
        case null {};
      };
      let collection = switch (CollectionLib.getCollection(collectionsState, collectionId)) {
        case null return #err("Collection not found");
        case (?value) value;
      };
      if (collection.kind != #External) {
        return #err("Selected sync is only needed for imported external collections");
      };
      if (not CollectionLib.isPubliclyVisible(collectionsState, collection)) {
        return #err("This community import is hidden or blocked while it is reviewed.");
      };
      if (not CollectionLib.collectionAllowsSync(collectionsState, collection)) {
        return #err("Automatic wallet sync is disabled for this collection.");
      };

      let userAccountId = IcpLib.accountIdentifier(caller, IcpLib.zeroSubaccount());
      let userAccountIdHex = WalletLib.blobToHexPublic(userAccountId);
      var newCount : Nat = 0;
      var errors : [Text] = [];
      var skipped : [WalletTypes.WalletSyncSkip] = [];
      var hintCount : Nat = 0;
      var verifiedHintCount : Nat = 0;

      label tokenHintLoop for (rawHint in tokenHints.values()) {
        if (hintCount >= TARGET_SYNC_TOKEN_HINT_MAX) {
          errors := Array.concat<Text>(
            errors,
            ["Only the first " # Nat.toText(TARGET_SYNC_TOKEN_HINT_MAX) # " token ID hints were checked."],
          );
          break tokenHintLoop;
        };
        let hint = Text.trim(rawHint, #char ' ');
        if (Text.size(hint) > 0) {
          hintCount += 1;
          switch (await* syncKnownExternalTokenHint(caller, collection, hint, userAccountId)) {
            case (#ok(wasNew)) {
              verifiedHintCount += 1;
              if (wasNew) {
                newCount += 1;
              };
            };
            case (#err(message)) {
              errors := Array.concat<Text>(errors, [message]);
            };
          };
        };
      };

      let initialStatus = WalletLib.getOwnershipIndexStatus(ownershipIndexState, collectionId);
      var scan : WalletSelectedScanResult = {
        nfts = [];
        errors = [];
        skip = null;
        scannedThisRun = 0;
        indexedThisRun = 0;
        complete = switch (initialStatus) {
          case (?value) value.complete;
          case null false;
        };
        status = initialStatus;
      };
      var shouldRunSelectedScan = verifiedHintCount == 0 and hintCount == 0;

      if (verifiedHintCount == 0 and hintCount == 0) {
        let indexedNFTs = WalletLib.indexedNFTsForOwner(
          ownershipIndexState,
          collection.id,
          caller,
          userAccountIdHex,
        );
        switch (await* WalletLib.previewUserOwnedNFTsFromOwnerIndex(collection, caller, userAccountId)) {
          case (#ok(nfts)) {
            let registered = registerPreviewNFTs(caller, collection, nfts, #Registered);
            newCount += registered.newCount;
            if (nfts.size() > 0) {
              shouldRunSelectedScan := false;
            };
          };
          case (#err(message)) {
            if (indexedNFTs.size() > 0) {
              let registered = registerPreviewNFTs(caller, collection, indexedNFTs, #Registered);
              newCount += registered.newCount;
            } else if (not WalletLib.isOwnerIndexMissingMessage(message)) {
              errors := Array.concat<Text>(errors, [message]);
            };
          };
        };

        if (shouldRunSelectedScan) {
          scan := await* autoScanSelectedCollectionForOwner(
            collection,
            caller,
            userAccountIdHex,
            normalizeTargetIndexPageBudget(maxPages),
          );
        };
      };

      let scanRegistered = registerPreviewNFTs(caller, collection, scan.nfts, #Registered);
      newCount += scanRegistered.newCount;
      errors := Array.concat<Text>(errors, scan.errors);
      switch (scan.skip) {
        case (?skip) skipped := Array.concat<WalletTypes.WalletSyncSkip>(skipped, [skip]);
        case null {};
      };

      let status = switch (scan.status) {
        case (?value) ?value;
        case null WalletLib.getOwnershipIndexStatus(ownershipIndexState, collectionId);
      };
      #ok({
        collectionId;
        newCount;
        errors;
        skipped;
        scannedThisRun = scan.scannedThisRun;
        indexedThisRun = scan.indexedThisRun;
        nextCursor = switch (status) {
          case (?value) value.cursor;
          case null null;
        };
        complete = hintCount > 0 or scan.complete;
        status;
      });
    } finally {
      releaseWalletSyncLock(caller);
    };
  };

  func syncKnownExternalTokenHint(
    caller : Principal,
    collection : CollectionTypes.Collection,
    tokenId : Text,
    userAccountId : Blob,
  ) : async* { #ok : Bool; #err : Text } {
    let candidates = externalTokenCandidateIds(collection, tokenId);
    var errors : [Text] = [];
    for (canonicalTokenId in candidates.values()) {
      switch (await* syncKnownExternalCanonicalTokenHint(caller, collection, canonicalTokenId, userAccountId)) {
        case (#ok(wasNew)) return #ok(wasNew);
        case (#err(message)) {
          errors := Array.concat<Text>(errors, [message]);
        };
      };
    };
    #err(tokenCandidateFailureMessage(tokenId, candidates, errors));
  };

  func syncKnownExternalCanonicalTokenHint(
    caller : Principal,
    collection : CollectionTypes.Collection,
    canonicalTokenId : Text,
    userAccountId : Blob,
  ) : async* { #ok : Bool; #err : Text } {
    if (not MarketplaceLib.acquireListingTokenLock(marketplaceListingLockState, collection.id, canonicalTokenId)) {
      return #err("This NFT is currently being listed. Try again shortly.");
    };
    try {
      switch (MarketplaceLib.findActiveEscrowedNFT(marketplaceState, collection.id, canonicalTokenId)) {
        case (?_) {
          return #err("This NFT is locked in an active marketplace listing. Cancel or settle the listing first.");
        };
        case null {};
      };
      let metadataFallback = switch (WalletLib.findByCollectionToken(walletState, collection.id, canonicalTokenId)) {
        case (?knownNFT) ?knownNFT.metadata;
        case null null;
      };
      switch (
        await* WalletLib.verifyKnownOwnedNFTWithFallback(
          collection,
          caller,
          userAccountId,
          canonicalTokenId,
          metadataFallback,
        )
      ) {
        case (#err(message)) #err(message);
        case (#ok(metadata)) {
          switch (MarketplaceLib.findActiveEscrowedNFT(marketplaceState, collection.id, canonicalTokenId)) {
            case (?_) {
              return #err("This NFT is locked in an active marketplace listing. Cancel or settle the listing first.");
            };
            case null {};
          };
          let existing = WalletLib.findByCollectionToken(walletState, collection.id, canonicalTokenId);
          let wasNew = countsAsNewWalletNFT(existing, caller);
          ignore WalletLib.registerNFT(
            walletState,
            caller,
            collection.id,
            canonicalTokenId,
            metadata,
            #Registered,
          );
          #ok(wasNew);
        };
      };
    } finally {
      MarketplaceLib.releaseListingTokenLock(marketplaceListingLockState, collection.id, canonicalTokenId);
    };
  };

  func syncUserNFTsPageUnlocked(
    caller : Principal,
    cursor : ?Nat,
    maxCollections : Nat,
  ) : async* {
    #ok : WalletTypes.WalletSyncPageResult;
    #err : Text;
  } {
    let collections = CollectionLib.getCollections(collectionsState);
    let start = switch (cursor) {
      case (?value) value;
      case null 0;
    };
    if (start >= collections.size()) {
      return #ok({
        newCount = 0;
        errors = [];
        skipped = [];
        nextCursor = null;
        complete = true;
        checkedCollections = 0;
      });
    };

    let pageSize = normalizeSyncPageSize(maxCollections);
    let userAccountId = IcpLib.accountIdentifier(caller, IcpLib.zeroSubaccount());
    let userAccountIdHex = WalletLib.blobToHexPublic(userAccountId);
    var position = start;
    var checkedCollections : Nat = 0;
    var newCount : Nat = 0;
    var errors : [Text] = [];
    var skipped : [WalletTypes.WalletSyncSkip] = [];

    while (position < collections.size() and checkedCollections < pageSize) {
      let result = await* syncOneWalletCollection(
        caller,
        collections[position],
        userAccountId,
        userAccountIdHex,
      );
      newCount += result.newCount;
      errors := Array.concat<Text>(errors, result.errors);
      skipped := Array.concat<WalletTypes.WalletSyncSkip>(skipped, result.skipped);
      checkedCollections += 1;
      position += 1;
    };

    #ok({
      newCount;
      errors;
      skipped;
      nextCursor = if (position < collections.size()) {
        ?position;
      } else {
        null;
      };
      complete = position >= collections.size();
      checkedCollections;
    });
  };

  public shared ({ caller }) func syncUserNFTs() : async {
    #ok : { newCount : Nat; errors : [Text] };
    #err : Text;
  } {
    if (Principal.isAnonymous(caller)) {
      return #err("You must be logged in to sync your wallet");
    };
    if (not acquireWalletSyncLock(caller)) {
      return #err("Wallet sync is already running. Wait for the current sync to finish.");
    };
    try {
      switch (enforceWalletSyncCooldown(caller)) {
        case (?message) return #err(message);
        case null {};
      };
      switch (await* syncUserNFTsPageUnlocked(caller, null, SYNC_COLLECTION_PAGE_DEFAULT)) {
        case (#err(message)) #err(message);
        case (#ok(result)) #ok({ newCount = result.newCount; errors = result.errors });
      };
    } finally {
      releaseWalletSyncLock(caller);
    };
  };

  func syncUserNFTsInternal(caller : Principal) : async* {
    #ok : WalletTypes.WalletSyncV2Result;
    #err : Text;
  } {
    if (Principal.isAnonymous(caller)) {
      return #err("You must be logged in to sync your wallet");
    };
    let collections = CollectionLib.getCollections(collectionsState);
    let userAccountId = IcpLib.accountIdentifier(caller, IcpLib.zeroSubaccount());
    let userAccountIdHex = WalletLib.blobToHexPublic(userAccountId);
    var newCount : Nat = 0;
    var errors : [Text] = [];
    var skipped : [WalletTypes.WalletSyncSkip] = [];

    for (collection in collections.values()) {
      let result = await* syncOneWalletCollection(
        caller,
        collection,
        userAccountId,
        userAccountIdHex,
      );
      newCount += result.newCount;
      errors := Array.concat<Text>(errors, result.errors);
      skipped := Array.concat<WalletTypes.WalletSyncSkip>(skipped, result.skipped);
    };

    #ok({ newCount; errors; skipped });
  };

  func normalizeSyncPageSize(maxCollections : Nat) : Nat {
    if (maxCollections == 0) {
      SYNC_COLLECTION_PAGE_DEFAULT;
    } else if (maxCollections > SYNC_COLLECTION_PAGE_MAX) {
      SYNC_COLLECTION_PAGE_MAX;
    } else {
      maxCollections;
    };
  };

  func normalizeTargetIndexPageBudget(maxIndexPages : Nat) : Nat {
    if (maxIndexPages == 0) {
      TARGET_SYNC_INDEX_PAGE_DEFAULT;
    } else if (maxIndexPages > TARGET_SYNC_INDEX_PAGE_MAX) {
      TARGET_SYNC_INDEX_PAGE_MAX;
    } else {
      maxIndexPages;
    };
  };

  func normalizeAutoIndexPageBudget(maxIndexPages : Nat) : Nat {
    if (maxIndexPages == 0) {
      SAFE_AUTO_INDEX_MAX_PAGES_PER_SYNC;
    } else if (maxIndexPages > TARGET_SYNC_INDEX_PAGE_MAX) {
      TARGET_SYNC_INDEX_PAGE_MAX;
    } else {
      maxIndexPages;
    };
  };

  func normalizePublicPageSize(limit : ?Nat) : Nat {
    switch (limit) {
      case null PUBLIC_PAGE_DEFAULT;
      case (?value) {
        if (value == 0) {
          1;
        } else if (value > PUBLIC_PAGE_MAX) {
          PUBLIC_PAGE_MAX;
        } else {
          value;
        };
      };
    };
  };

  func enforceWalletSyncCooldown(caller : Principal) : ?Text {
    let now = Time.now();
    switch (Map.get(walletSyncCooldowns, Principal.compare, caller)) {
      case (?lastStartedAt) {
        if (now > lastStartedAt and now - lastStartedAt < WALLET_SYNC_COOLDOWN_NS) {
          return ?("Wallet sync was just started. Wait a few seconds before syncing again.");
        };
      };
      case null {};
    };
    Map.add(walletSyncCooldowns, Principal.compare, caller, now);
    null;
  };

  func legacyWalletSyncPageResult(
    result : { #ok : WalletTypes.WalletSyncPageResult; #err : Text }
  ) : { #ok : WalletTypes.WalletSyncV2Result; #err : Text } {
    switch (result) {
      case (#err(message)) #err(message);
      case (#ok(page)) {
        let skipped = if (page.complete) {
          page.skipped;
        } else {
          Array.concat<WalletTypes.WalletSyncSkip>(
            page.skipped,
            [
              {
                collectionId = 0;
                collectionName = "Wallet sync";
                reason = "PAGED_SYNC_REQUIRED";
                message = "Mintlab checked one safe wallet sync page. Use the paged sync flow to continue checking the remaining collections.";
              }
            ],
          );
        };
        #ok({
          newCount = page.newCount;
          errors = page.errors;
          skipped;
        });
      };
    };
  };

  func syncOneWalletCollection(
    caller : Principal,
    collection : CollectionTypes.Collection,
    userAccountId : Blob,
    userAccountIdHex : Text,
  ) : async* WalletCollectionSyncResult {
    await* syncOneWalletCollectionWithIndexBudget(
      caller,
      collection,
      userAccountId,
      userAccountIdHex,
      SAFE_AUTO_INDEX_MAX_PAGES_PER_SYNC,
    );
  };

  func syncOneWalletCollectionWithIndexBudget(
    caller : Principal,
    collection : CollectionTypes.Collection,
    userAccountId : Blob,
    userAccountIdHex : Text,
    maxIndexPages : Nat,
  ) : async* WalletCollectionSyncResult {
    var newCount : Nat = 0;
    var errors : [Text] = [];
    var skipped : [WalletTypes.WalletSyncSkip] = [];

    if (not CollectionLib.isPubliclyVisible(collectionsState, collection)) {
      return {
        newCount;
        errors;
        skipped = [
          {
            collectionId = collection.id;
            collectionName = collection.name;
            reason = "COLLECTION_HIDDEN";
            message = "This community import is hidden or blocked while it is reviewed.";
          }
        ];
      };
    };

    if (not CollectionLib.collectionAllowsSync(collectionsState, collection)) {
      return {
        newCount;
        errors;
        skipped = [
          {
            collectionId = collection.id;
            collectionName = collection.name;
            reason = "SYNC_DISABLED";
            message = "Automatic wallet sync is disabled for this collection. Import a known token ID directly or wait for admin review.";
          }
        ];
      };
    };

    switch (collection.kind) {
      case (#Minted) {
        let synced = await* syncMintedCollection(caller, collection, userAccountId);
        switch (synced) {
          case (#err(message)) {
            errors := Array.concat<Text>(errors, [message]);
          };
          case (#ok(count)) {
            newCount += count;
          };
        };
      };
      case (#External) {
        let indexedNFTs = WalletLib.indexedNFTsForOwner(
          ownershipIndexState,
          collection.id,
          caller,
          userAccountIdHex,
        );
        let preview = await* WalletLib.previewUserOwnedNFTsFromOwnerIndex(
          collection,
          caller,
          userAccountId,
        );
        switch (preview) {
          case (#err(message)) {
            if (WalletLib.isOwnerIndexMissingMessage(message)) {
              let autoIndexed = await* autoIndexCollectionForWalletSync(
                collection,
                caller,
                userAccountIdHex,
                maxIndexPages,
              );
              let nftsToRegister = if (autoIndexed.nfts.size() > 0) {
                autoIndexed.nfts;
              } else {
                indexedNFTs;
              };
              let registered = registerPreviewNFTs(caller, collection, nftsToRegister, #Registered);
              newCount += registered.newCount;
              if (autoIndexed.complete) {
                await* removeStaleOnChainNFTs(
                  caller,
                  collection,
                  userAccountId,
                  #Registered,
                  registered.tokenIds,
                );
              };
              switch (autoIndexed.skip) {
                case (?skip) skipped := Array.concat<WalletTypes.WalletSyncSkip>(skipped, [skip]);
                case null {};
              };
              if (nftsToRegister.size() == 0) {
                errors := Array.concat<Text>(errors, autoIndexed.errors);
              };
            } else if (indexedNFTs.size() > 0) {
              let registered = registerPreviewNFTs(caller, collection, indexedNFTs, #Registered);
              newCount += registered.newCount;
            } else {
              errors := Array.concat<Text>(errors, [message]);
            };
          };
          case (#ok(nfts)) {
            let registered = registerPreviewNFTs(caller, collection, nfts, #Registered);
            newCount += registered.newCount;
            await* removeStaleOnChainNFTs(
              caller,
              collection,
              userAccountId,
              #Registered,
              registered.tokenIds,
            );
          };
        };
      };
    };

    { newCount; errors; skipped };
  };

  func autoIndexCollectionForWalletSync(
    collection : CollectionTypes.Collection,
    caller : Principal,
    userAccountIdHex : Text,
    maxIndexPages : Nat,
  ) : async* WalletAutoIndexResult {
    if (collectionNeedsSafeIndexSetup(collection)) {
      return {
        nfts = [];
        errors = [];
        skip = ?{
          collectionId = collection.id;
          collectionName = collection.name;
          reason = "INDEX_REQUIRED";
          message = "This collection needs token range setup before automatic wallet sync can scan it safely. " #
          "Add total supply and token offset in the collection import settings, or import a known token ID directly.";
        };
        complete = false;
      };
    };

    var pages : Nat = 0;
    var scanned : Nat = 0;
    var indexed : Nat = 0;
    var complete = false;
    var lastError : ?Text = null;
    let pageBudget = normalizeAutoIndexPageBudget(maxIndexPages);
    var found = WalletLib.indexedNFTsForOwner(
      ownershipIndexState,
      collection.id,
      caller,
      userAccountIdHex,
    );

    label autoIndex loop {
      if (pages >= pageBudget) {
        break autoIndex;
      };
      let status = WalletLib.getOwnershipIndexStatus(ownershipIndexState, collection.id);
      switch (status) {
        case (?value) {
          if (value.complete) {
            complete := true;
            break autoIndex;
          };
        };
        case null {};
      };
      let cursor = switch (status) {
        case (?value) value.cursor;
        case null null;
      };
      switch (
        await* WalletLib.indexCollectionOwnershipPage(
          ownershipIndexState,
          collection,
          cursor,
          SAFE_AUTO_INDEX_PAGE_LIMIT,
        )
      ) {
        case (#err(message)) {
          lastError := ?message;
          break autoIndex;
        };
        case (#ok(page)) {
          pages += 1;
          scanned += page.scanned;
          indexed += page.indexed;
          complete := page.complete;
          found := WalletLib.indexedNFTsForOwner(
            ownershipIndexState,
            collection.id,
            caller,
            userAccountIdHex,
          );
          if (page.complete or page.nextCursor == null) {
            break autoIndex;
          };
        };
      };
    };

    if (found.size() > 0 or complete) {
      return {
        nfts = found;
        errors = [];
        skip = if (not complete and pages > 0) {
          ?{
            collectionId = collection.id;
            collectionName = collection.name;
            reason = "INDEXING_IN_PROGRESS";
            message = "Mintlab is indexing this imported collection in safe pages. New NFTs appear as soon as they are found; click Sync again shortly to keep checking.";
          };
        } else {
          null;
        };
        complete;
      };
    };

    switch (lastError) {
      case (?message) {
        {
          nfts = [];
          errors = [];
          skip = ?{
            collectionId = collection.id;
            collectionName = collection.name;
            reason = "INDEX_REQUIRED";
            message = "Mintlab tried automatic ownership indexing, but this collection needs extra setup before new NFTs can be discovered automatically. " #
            "Known token IDs can still be imported directly. Details: " #
            message;
          };
          complete = false;
        };
      };
      case null {
        if (pages > 0) {
          {
            nfts = [];
            errors = [];
            skip = ?{
              collectionId = collection.id;
              collectionName = collection.name;
              reason = "INDEXING_IN_PROGRESS";
              message = "Mintlab indexed " #
              Nat.toText(scanned) #
              " tokens and saved " #
              Nat.toText(indexed) #
              " owner records automatically. New NFTs appear as soon as they are found; click Sync again shortly to continue checking this collection.";
            };
            complete = false;
          };
        } else {
          {
            nfts = [];
            errors = [];
            skip = null;
            complete = false;
          };
        };
      };
    };
  };

  func autoScanSelectedCollectionForOwner(
    collection : CollectionTypes.Collection,
    caller : Principal,
    userAccountIdHex : Text,
    maxIndexPages : Nat,
  ) : async* WalletSelectedScanResult {
    let existingStatus = WalletLib.getOwnershipIndexStatus(ownershipIndexState, collection.id);
    switch (existingStatus) {
      case (?status) {
        if (status.complete) {
          return {
            nfts = [];
            errors = [];
            skip = null;
            scannedThisRun = 0;
            indexedThisRun = 0;
            complete = true;
            status = existingStatus;
          };
        };
      };
      case null {};
    };

    switch (collection.standard) {
      case (#EXT) {
        if (not collectionHasBrowseRange(collection)) {
          switch (
            await* WalletLib.indexEXTRegistryForOwnerBounded(
              ownershipIndexState,
              collection,
              caller,
              userAccountIdHex,
              EXT_SELECTED_REGISTRY_SYNC_MAX_ENTRIES,
            )
          ) {
            case (#ok(page)) {
              let status = WalletLib.getOwnershipIndexStatus(ownershipIndexState, collection.id);
              let skip = switch (page.error) {
                case (?message) {
                  ?{
                    collectionId = collection.id;
                    collectionName = collection.name;
                    reason = "INDEX_REQUIRED";
                    message = "Mintlab checked this EXT collection registry, but one or more possible owner matches could not be verified before registration. " #
                    "If you know the token ID, enter it and run Sync selected. Details: " #
                    message;
                  };
                };
                case null null;
              };
              return {
                nfts = page.nfts;
                errors = [];
                skip;
                scannedThisRun = page.scanned;
                indexedThisRun = page.indexed;
                complete = page.complete;
                status;
              };
            };
            case (#err(message)) {
              return {
                nfts = [];
                errors = [];
                skip = ?{
                  collectionId = collection.id;
                  collectionName = collection.name;
                  reason = "INDEX_REQUIRED";
                  message = "Mintlab tried a bounded EXT registry lookup for this selected collection, but it could not complete within safe sync limits. " #
                  "If you know the token ID, enter it and run Sync selected, or add total supply/token range setup for automatic discovery. Details: " #
                  message;
                };
                scannedThisRun = 0;
                indexedThisRun = 0;
                complete = false;
                status = WalletLib.getOwnershipIndexStatus(ownershipIndexState, collection.id);
              };
            };
          };
        };
      };
      case (_) {};
    };

    if (collectionNeedsSafeIndexSetup(collection)) {
      return {
        nfts = [];
        errors = [];
        skip = ?{
          collectionId = collection.id;
          collectionName = collection.name;
          reason = "INDEX_REQUIRED";
          message = "This collection needs token range setup before selected wallet sync can scan it safely. " #
          "If you know the token ID, enter it and run Sync selected to verify that token directly.";
        };
        scannedThisRun = 0;
        indexedThisRun = 0;
        complete = false;
        status = WalletLib.getOwnershipIndexStatus(ownershipIndexState, collection.id);
      };
    };

    var pages : Nat = 0;
    var scanned : Nat = 0;
    var indexed : Nat = 0;
    var complete = false;
    var lastError : ?Text = null;
    var found : [WalletTypes.WalletNFT] = [];
    let pageBudget = normalizeAutoIndexPageBudget(maxIndexPages);

    label selectedScan loop {
      if (pages >= pageBudget) {
        break selectedScan;
      };
      let status = WalletLib.getOwnershipIndexStatus(ownershipIndexState, collection.id);
      switch (status) {
        case (?value) {
          if (value.complete) {
            complete := true;
            break selectedScan;
          };
        };
        case null {};
      };
      let cursor = switch (status) {
        case (?value) value.cursor;
        case null null;
      };
      switch (
        await* WalletLib.indexCollectionOwnershipPageForOwner(
          ownershipIndexState,
          collection,
          caller,
          userAccountIdHex,
          cursor,
          SAFE_AUTO_INDEX_PAGE_LIMIT,
        )
      ) {
        case (#err(message)) {
          lastError := ?message;
          break selectedScan;
        };
        case (#ok(page)) {
          pages += 1;
          scanned += page.scanned;
          indexed += page.indexed;
          found := Array.concat<WalletTypes.WalletNFT>(found, page.nfts);
          complete := page.complete;
          if (page.complete or page.nextCursor == null) {
            break selectedScan;
          };
        };
      };
    };

    let status = WalletLib.getOwnershipIndexStatus(ownershipIndexState, collection.id);
    let completeNow = complete or (switch (status) {
      case (?value) value.complete;
      case null false;
    });

    if (found.size() > 0 or completeNow) {
      return {
        nfts = found;
        errors = [];
        skip = if (not completeNow and pages > 0) {
          ?{
            collectionId = collection.id;
            collectionName = collection.name;
            reason = "INDEXING_IN_PROGRESS";
            message = "Mintlab scanned " #
            Nat.toText(scanned) #
            " more token positions in this collection. Matching NFTs appear as soon as they are found; click Sync selected again to continue.";
          };
        } else {
          null;
        };
        scannedThisRun = scanned;
        indexedThisRun = indexed;
        complete = completeNow;
        status;
      };
    };

    switch (lastError) {
      case (?message) {
        {
          nfts = [];
          errors = [];
          skip = ?{
            collectionId = collection.id;
            collectionName = collection.name;
            reason = "INDEX_REQUIRED";
            message = "Mintlab tried selected ownership scanning, but this collection needs extra setup before new NFTs can be discovered automatically. " #
            "Known token IDs can still be verified directly. Details: " #
            message;
          };
          scannedThisRun = scanned;
          indexedThisRun = indexed;
          complete = false;
          status;
        };
      };
      case null {
        if (pages > 0) {
          {
            nfts = [];
            errors = [];
            skip = ?{
              collectionId = collection.id;
              collectionName = collection.name;
              reason = "INDEXING_IN_PROGRESS";
              message = "Mintlab scanned " #
              Nat.toText(scanned) #
              " more token positions and saved " #
              Nat.toText(indexed) #
              " owner records for this collection. No matching NFT was found yet; click Sync selected again to continue, or enter a known token ID.";
            };
            scannedThisRun = scanned;
            indexedThisRun = indexed;
            complete = false;
            status;
          };
        } else {
          {
            nfts = [];
            errors = [];
            skip = null;
            scannedThisRun = 0;
            indexedThisRun = 0;
            complete = completeNow;
            status;
          };
        };
      };
    };
  };

  func syncMintedCollection(
    caller : Principal,
    collection : CollectionTypes.Collection,
    userAccountId : Blob,
  ) : async* { #ok : Nat; #err : Text } {
    if (not Principal.equal(collection.canisterId, canisterId)) {
      switch (await* syncMintlabChildCollection(caller, collection)) {
        case (#ok(count)) return #ok(count);
        case (#err(childMessage)) return #err(childMessage);
      };
    };

    var newCount : Nat = 0;
    var ownedTokenIds : [Text] = [];

    for (
      token in MintLib.ownerTokensForCollection(
        mintState,
        caller,
        collection.id,
        MintLib.getConfig(mintState).collectionId,
      ).values()
    ) {
      let tokenId = Nat.toText(token.tokenId);
      ownedTokenIds := Array.concat<Text>(ownedTokenIds, [tokenId]);
      let existing = WalletLib.findByCollectionToken(walletState, collection.id, tokenId);
      if (countsAsNewWalletNFT(existing, caller)) {
        newCount += 1;
      };
      ignore WalletLib.registerNFT(
        walletState,
        caller,
        collection.id,
        tokenId,
        MintLib.publicMetadata(token.metadata),
        #Minted,
      );
    };

    for (existing in WalletLib.getUserNFTs(walletState, caller).values()) {
      if (
        existing.collectionId == collection.id and
        existing.location == #Minted and
        not containsText(ownedTokenIds, existing.tokenId)
      ) {
        WalletLib.deleteNFT(walletState, existing.id);
      };
    };

    #ok(newCount);
  };

  func syncMintlabChildCollection(
    caller : Principal,
    collection : CollectionTypes.Collection,
  ) : async* { #ok : Nat; #err : Text } {
    let child : WalletChildCollectionSyncActor = actor (collection.canisterId.toText());
    let pageSize : Nat = CHILD_NFT_SYNC_PAGE_SIZE;
    var prev : ?Nat = null;
    var newCount : Nat = 0;
    var ownedTokenIds : [Text] = [];

    label paginate loop {
      let page = try {
        await child.mintlab_nfts_of(caller, prev, ?pageSize);
      } catch (error) {
        return await* syncMintlabChildCollectionByOwnerLookup(
          caller,
          collection,
          "Collection '" #
          collection.name #
          "': mintlab_nfts_of remote call failed: " #
          Error.message(error),
        );
      };

      if (page.size() == 0) {
        break paginate;
      };

      for (item in page.values()) {
        let tokenId = Nat.toText(item.tokenId);
        ownedTokenIds := Array.concat<Text>(ownedTokenIds, [tokenId]);
        let existing = WalletLib.findByCollectionToken(walletState, collection.id, tokenId);
        if (countsAsNewWalletNFT(existing, caller)) {
          newCount += 1;
        };
        ignore WalletLib.registerNFT(
          walletState,
          caller,
          collection.id,
          tokenId,
          item.metadata,
          #Minted,
        );
      };

      if (page.size() < pageSize) {
        break paginate;
      };
      let nextPrev = page[page.size() - 1].tokenId;
      switch (prev) {
        case (?previous) {
          if (nextPrev <= previous) {
            return #err(
              "Collection '" #
              collection.name #
              "': child pagination did not advance during wallet sync"
            );
          };
        };
        case null {};
      };
      prev := ?nextPrev;
    };

    for (existing in WalletLib.getUserNFTs(walletState, caller).values()) {
      if (
        existing.collectionId == collection.id and
        existing.location == #Minted and
        not containsText(ownedTokenIds, existing.tokenId)
      ) {
        WalletLib.deleteNFT(walletState, existing.id);
      };
    };

    #ok(newCount);
  };

  func syncMintlabChildCollectionByOwnerLookup(
    caller : Principal,
    collection : CollectionTypes.Collection,
    originalMessage : Text,
  ) : async* { #ok : Nat; #err : Text } {
    let child : WalletChildCollectionSyncActor = actor (collection.canisterId.toText());
    var prev : ?Nat = null;
    var newCount : Nat = 0;
    var ownedTokenIds : [Text] = [];

    label paginate loop {
      let tokenIds = try {
        await child.mintlab_token_ids(prev, ?CHILD_TOKEN_SYNC_PAGE_SIZE);
      } catch (error) {
        return #err(originalMessage # ". Token ID fallback also failed: " # Error.message(error));
      };
      if (tokenIds.size() == 0) {
        break paginate;
      };

      let owners = try {
        await child.mintlab_owner_of(tokenIds);
      } catch (error) {
        return #err(originalMessage # ". Owner lookup fallback also failed: " # Error.message(error));
      };

      var index : Nat = 0;
      for (tokenId in tokenIds.values()) {
        if (index < owners.size()) {
          switch (owners[index]) {
            case (?account) {
              if (Principal.equal(account.owner, caller)) {
                let metadata = await* childMetadataForOwnedToken(
                  child,
                  caller,
                  collection,
                  tokenId,
                );
                let tokenIdText = Nat.toText(tokenId);
                ownedTokenIds := Array.concat<Text>(ownedTokenIds, [tokenIdText]);
                let existing = WalletLib.findByCollectionToken(walletState, collection.id, tokenIdText);
                if (countsAsNewWalletNFT(existing, caller)) {
                  newCount += 1;
                };
                ignore WalletLib.registerNFT(
                  walletState,
                  caller,
                  collection.id,
                  tokenIdText,
                  metadata,
                  #Minted,
                );
              };
            };
            case null {};
          };
        };
        index += 1;
      };

      if (tokenIds.size() < CHILD_TOKEN_SYNC_PAGE_SIZE) {
        break paginate;
      };
      let nextPrev = tokenIds[tokenIds.size() - 1];
      switch (prev) {
        case (?previous) {
          if (nextPrev <= previous) {
            return #err(
              "Collection '" #
              collection.name #
              "': token ID fallback pagination did not advance during wallet sync"
            );
          };
        };
        case null {};
      };
      prev := ?nextPrev;
    };

    for (existing in WalletLib.getUserNFTs(walletState, caller).values()) {
      if (
        existing.collectionId == collection.id and
        existing.location == #Minted and
        not containsText(ownedTokenIds, existing.tokenId)
      ) {
        WalletLib.deleteNFT(walletState, existing.id);
      };
    };

    #ok(newCount);
  };

  func childMetadataForOwnedToken(
    child : WalletChildCollectionSyncActor,
    caller : Principal,
    collection : CollectionTypes.Collection,
    tokenId : Nat,
  ) : async* WalletTypes.NFTMetadata {
    let prev = if (tokenId == 0) {
      null;
    } else {
      ?Int.abs(Nat.toInt(tokenId) - 1);
    };
    let page = try {
      await child.mintlab_nfts_of(caller, prev, ?1);
    } catch (_) {
      [];
    };
    for (item in page.values()) {
      if (item.tokenId == tokenId) {
        return item.metadata;
      };
    };
    fallbackChildNFTMetadata(collection, tokenId);
  };

  func fallbackChildNFTMetadata(
    collection : CollectionTypes.Collection,
    tokenId : Nat,
  ) : WalletTypes.NFTMetadata {
    {
      name = ?(collection.name # " #" # Nat.toText(tokenId));
      description = if (collection.description == "") { null } else { ?collection.description };
      imageUrl = if (collection.imageUrl == "") { null } else { ?collection.imageUrl };
      attributes = [];
    };
  };

  func collectionNeedsSafeIndexSetup(collection : CollectionTypes.Collection) : Bool {
    switch (collection.standard) {
      case (#EXT) not collectionHasBrowseRange(collection);
      case (#DIP721) not collectionHasBrowseRange(collection);
      case (_) false;
    };
  };

  func collectionHasBrowseRange(collection : CollectionTypes.Collection) : Bool {
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

  func registerPreviewNFTs(
    caller : Principal,
    collection : CollectionTypes.Collection,
    nfts : [WalletTypes.WalletNFT],
    location : WalletTypes.WalletLocation,
  ) : { newCount : Nat; tokenIds : [Text] } {
    var newCount : Nat = 0;
    var tokenIds : [Text] = [];
    for (previewNFT in nfts.values()) {
      tokenIds := Array.concat<Text>(tokenIds, [previewNFT.tokenId]);
      let existing = WalletLib.findByCollectionToken(
        walletState,
        collection.id,
        previewNFT.tokenId,
      );
      if (countsAsNewWalletNFT(existing, caller)) {
        newCount += 1;
      };
      ignore WalletLib.registerNFT(
        walletState,
        caller,
        collection.id,
        previewNFT.tokenId,
        previewNFT.metadata,
        location,
      );
    };
    { newCount; tokenIds };
  };

  func removeStaleOnChainNFTs(
    caller : Principal,
    collection : CollectionTypes.Collection,
    userAccountId : Blob,
    location : WalletTypes.WalletLocation,
    previewTokenIds : [Text],
  ) : async* () {
    for (existing in WalletLib.getUserNFTs(walletState, caller).values()) {
      if (
        existing.collectionId == collection.id and
        existing.location == location and
        not containsText(previewTokenIds, existing.tokenId)
      ) {
        switch (
          await* WalletLib.isNFTCurrentlyOwnedBy(
            collection,
            caller,
            userAccountId,
            existing.tokenId,
          )
        ) {
          case (#ok(false)) WalletLib.deleteNFT(walletState, existing.id);
          case (#ok(true)) {};
          case (#err(_)) {};
        };
      };
    };
  };

  func sendLocalMintedNFT(
    caller : Principal,
    tokenId : Nat,
    recipient : Principal,
  ) : { #ok : Text; #err : Text } {
    let token = switch (MintLib.getToken(mintState, tokenId)) {
      case null return #err("NFT not found in your wallet");
      case (?value) value;
    };
    if (not Principal.equal(token.owner, caller)) {
      return #err("You do not own this NFT");
    };

    let config = MintLib.getConfig(mintState);
    var collectionId : ?CollectionTypes.CollectionId = null;
    for (collection in CollectionLib.getCollections(collectionsState).values()) {
      if (
        collection.kind == #Minted and
        Principal.equal(collection.canisterId, canisterId) and
        MintLib.tokenBelongsToCollection(token, collection.id, config.collectionId)
      ) {
        collectionId := ?collection.id;
      };
    };

    switch (collectionId) {
      case null return #err("Minted NFT collection not found");
      case (?_) {};
    };

    switch (MintLib.transferToken(mintState, tokenId, caller, recipient)) {
      case (#err(message)) #err(message);
      case (#ok(_)) #ok("Minted NFT transferred successfully");
    };
  };

  func containsText(values : [Text], target : Text) : Bool {
    for (value in values.values()) {
      if (value == target) return true;
    };
    false;
  };

  func countsAsNewWalletNFT(existing : ?WalletTypes.WalletNFT, user : Principal) : Bool {
    switch (existing) {
      case null true;
      case (?nft) not Principal.equal(nft.owner, user);
    };
  };

  func walletVisibleNFTs(user : Principal) : [WalletTypes.WalletNFT] {
    walletMergeDistinctNFTs(
      walletMergeDistinctNFTs(
        walletEnrichKnownMintedNFTs(WalletLib.getUserNFTs(walletState, user)),
        walletEnrichKnownMintedNFTs(MarketplaceLib.getActiveEscrowedNFTsBySeller(marketplaceState, user)),
      ),
      walletLocalMintedNFTs(user),
    );
  };

  func walletVisibleNFTsForViewer(
    user : Principal,
    viewer : Principal,
  ) : [WalletTypes.WalletNFT] {
    let isAdmin = AuthLib.isAdmin(authState, viewer);
    var visible : [WalletTypes.WalletNFT] = [];
    for (nft in walletVisibleNFTs(user).values()) {
      switch (CollectionLib.getCollection(collectionsState, nft.collectionId)) {
        case null {};
        case (?collection) {
          if (CollectionLib.canViewerSeeCollection(collectionsState, collection, viewer, isAdmin)) {
            visible := Array.concat<WalletTypes.WalletNFT>(visible, [nft]);
          };
        };
      };
    };
    visible;
  };

  func walletLocalMintedNFTs(user : Principal) : [WalletTypes.WalletNFT] {
    var nfts : [WalletTypes.WalletNFT] = [];
    for (collection in CollectionLib.getCollections(collectionsState).values()) {
      if (collection.kind == #Minted and Principal.equal(collection.canisterId, canisterId)) {
        for (
          token in MintLib.ownerTokensForCollection(
            mintState,
            user,
            collection.id,
            MintLib.getConfig(mintState).collectionId,
          ).values()
        ) {
          let tokenId = Nat.toText(token.tokenId);
          nfts := Array.concat<WalletTypes.WalletNFT>(
            nfts,
            [
              {
                id = token.tokenId;
                owner = user;
                collectionId = collection.id;
                tokenId;
                metadata = MintLib.publicMetadata(token.metadata);
                location = #Minted;
                registeredAt = 0;
              }
            ],
          );
        };
      };
    };
    nfts;
  };

  func walletEnrichKnownMintedNFTs(
    nfts : [WalletTypes.WalletNFT]
  ) : [WalletTypes.WalletNFT] {
    var enriched : [WalletTypes.WalletNFT] = [];
    for (nft in nfts.values()) {
      enriched := Array.concat<WalletTypes.WalletNFT>(enriched, [walletEnrichKnownMintedNFT(nft)]);
    };
    enriched;
  };

  func walletEnrichKnownMintedNFT(nft : WalletTypes.WalletNFT) : WalletTypes.WalletNFT {
    let collection = switch (CollectionLib.getCollection(collectionsState, nft.collectionId)) {
      case null return nft;
      case (?value) value;
    };
    if (collection.kind != #Minted or not Principal.equal(collection.canisterId, canisterId)) {
      return nft;
    };
    let tokenId = switch (Nat.fromText(nft.tokenId)) {
      case null return nft;
      case (?value) value;
    };
    let token = switch (MintLib.getToken(mintState, tokenId)) {
      case null return nft;
      case (?value) value;
    };
    if (
      not MintLib.tokenBelongsToCollection(
        token,
        collection.id,
        MintLib.getConfig(mintState).collectionId,
      )
    ) {
      return nft;
    };
    {
      nft with
      metadata = WalletLib.mergeMetadata(
        MintLib.publicMetadata(token.metadata),
        nft.metadata,
      );
    };
  };

  func walletMergeDistinctNFTs(
    primary : [WalletTypes.WalletNFT],
    secondary : [WalletTypes.WalletNFT],
  ) : [WalletTypes.WalletNFT] {
    var merged = primary;
    for (nft in secondary.values()) {
      if (not walletContainsCollectionToken(merged, nft.collectionId, nft.tokenId)) {
        merged := Array.concat<WalletTypes.WalletNFT>(merged, [nft]);
      };
    };
    merged;
  };

  func sliceWalletNFTs(
    nfts : [WalletTypes.WalletNFT],
    start : Nat,
    limit : Nat,
  ) : [WalletTypes.WalletNFT] {
    var page : [WalletTypes.WalletNFT] = [];
    var index : Nat = 0;
    var added : Nat = 0;
    for (nft in nfts.values()) {
      if (index < start) {
        index += 1;
      } else if (added < limit) {
        page := Array.concat<WalletTypes.WalletNFT>(page, [nft]);
        added += 1;
        index += 1;
      } else {
        return page;
      };
    };
    page;
  };

  func walletContainsCollectionToken(
    nfts : [WalletTypes.WalletNFT],
    collectionId : WalletTypes.CollectionId,
    tokenId : Text,
  ) : Bool {
    for (nft in nfts.values()) {
      if (nft.collectionId == collectionId and nft.tokenId == tokenId) {
        return true;
      };
    };
    false;
  };
};
