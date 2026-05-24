import Array "mo:core/Array";
import Blob "mo:core/Blob";
import Error "mo:core/Error";
import AuthLib "../lib/auth";
import CollectionLib "../lib/collections";
import IcpLib "../lib/icp";
import MarketplaceLib "../lib/marketplace";
import MintLib "../lib/mint";
import WalletLib "../lib/wallet";
import CollectionTypes "../types/collections";
import CommonTypes "../types/common";
import WalletTypes "../types/wallet";
import Nat "mo:core/Nat";
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
    mintlab_nfts_of : (Principal, ?Nat, ?Nat) -> async [WalletChildMintlabNFT];
  };

  type WalletCollectionSyncResult = {
    newCount : Nat;
    errors : [Text];
    skipped : [WalletTypes.WalletSyncSkip];
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
    ignore MarketplaceLib.clearListingsForToken(marketplaceState, collectionId, canonicalTokenId);
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
        ignore MarketplaceLib.clearListingsForToken(marketplaceState, collectionId, canonicalTokenId);
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
          case (#ok(_)) {
            ignore MarketplaceLib.clearListingsForToken(marketplaceState, nft.collectionId, nft.tokenId);
          };
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
                case (#ok(_)) {
                  ignore MarketplaceLib.clearListingsForToken(marketplaceState, nft.collectionId, nft.tokenId);
                  #ok("Minted NFT transferred successfully");
                };
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
                case (#ok(_)) {
                  ignore MarketplaceLib.clearListingsForToken(marketplaceState, nft.collectionId, nft.tokenId);
                  #ok("Minted NFT transferred successfully");
                };
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
    let canonicalTokenId = WalletLib.canonicalTokenId(collection, tokenId);
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
          ignore MarketplaceLib.clearListingsForToken(marketplaceState, collectionId, canonicalTokenId);
          #ok(nft);
        };
      };
    } finally {
      MarketplaceLib.releaseListingTokenLock(marketplaceListingLockState, collectionId, canonicalTokenId);
    };
  };

  public query func getUserNFTs(user : Principal) : async [WalletTypes.WalletNFT] {
    walletVisibleNFTs(user);
  };

  public query func getNFTStats(user : Principal) : async WalletTypes.NFTStats {
    WalletLib.buildNFTStats(walletVisibleNFTs(user));
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
    await* syncUserNFTsInternal(caller);
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
    switch (await* syncUserNFTsInternal(caller)) {
      case (#err(message)) #err(message);
      case (#ok(result)) #ok({ newCount = result.newCount; errors = result.errors });
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
      1;
    } else if (maxCollections > 5) {
      5;
    } else {
      maxCollections;
    };
  };

  func syncOneWalletCollection(
    caller : Principal,
    collection : CollectionTypes.Collection,
    userAccountId : Blob,
    userAccountIdHex : Text,
  ) : async* WalletCollectionSyncResult {
    var newCount : Nat = 0;
    var errors : [Text] = [];
    var skipped : [WalletTypes.WalletSyncSkip] = [];

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
            if (indexedNFTs.size() > 0) {
              let registered = registerPreviewNFTs(caller, collection, indexedNFTs, #Registered);
              newCount += registered.newCount;
            } else if (WalletLib.isOwnerIndexMissingMessage(message)) {
              skipped := Array.concat<WalletTypes.WalletSyncSkip>(
                skipped,
                [
                  {
                    collectionId = collection.id;
                    collectionName = collection.name;
                    reason = "INDEX_REQUIRED";
                    message = "This collection does not expose an owner index. Run collection indexing or import the token ID directly.";
                  }
                ],
              );
            } else {
              errors := Array.concat<Text>(errors, [message]);
            };
          };
          case (#ok(nfts)) {
            let nftsToRegister = if (nfts.size() == 0 and indexedNFTs.size() > 0) {
              indexedNFTs;
            } else {
              nfts;
            };
            let registered = registerPreviewNFTs(caller, collection, nftsToRegister, #Registered);
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

  func syncMintedCollection(
    caller : Principal,
    collection : CollectionTypes.Collection,
    userAccountId : Blob,
  ) : async* { #ok : Nat; #err : Text } {
    if (not Principal.equal(collection.canisterId, canisterId)) {
      switch (await* syncMintlabChildCollection(caller, collection)) {
        case (#ok(count)) return #ok(count);
        case (#err(childMessage)) {
          let preview = await* WalletLib.previewUserOwnedNFTsFromOwnerIndex(
            collection,
            caller,
            userAccountId,
          );
          switch (preview) {
            case (#err(message)) {
              return #err(childMessage # ". Generic fallback also failed: " # message);
            };
            case (#ok(nfts)) {
              let registered = registerPreviewNFTs(caller, collection, nfts, #Minted);
              await* removeStaleOnChainNFTs(
                caller,
                collection,
                userAccountId,
                #Minted,
                registered.tokenIds,
              );
              return #ok(registered.newCount);
            };
          };
        };
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
      ignore MarketplaceLib.clearListingsForToken(marketplaceState, collection.id, tokenId);
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
    let pageSize : Nat = 100;
    var prev : ?Nat = null;
    var newCount : Nat = 0;
    var ownedTokenIds : [Text] = [];

    label paginate loop {
      let page = try {
        await child.mintlab_nfts_of(caller, prev, ?pageSize);
      } catch (error) {
        return #err(
          "Collection '" #
          collection.name #
          "': mintlab_nfts_of remote call failed: " #
          Error.message(error)
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
        ignore MarketplaceLib.clearListingsForToken(marketplaceState, collection.id, tokenId);
      };

      if (page.size() < pageSize) {
        break paginate;
      };
      prev := ?page[page.size() - 1].tokenId;
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
      ignore MarketplaceLib.clearListingsForToken(marketplaceState, collection.id, previewNFT.tokenId);
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

    let resolvedCollectionId = switch (collectionId) {
      case null return #err("Minted NFT collection not found");
      case (?value) value;
    };

    switch (MintLib.transferToken(mintState, tokenId, caller, recipient)) {
      case (#err(message)) #err(message);
      case (#ok(_)) {
        ignore MarketplaceLib.clearListingsForToken(
          marketplaceState,
          resolvedCollectionId,
          Nat.toText(tokenId),
        );
        #ok("Minted NFT transferred successfully");
      };
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
