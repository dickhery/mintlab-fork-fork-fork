import Array "mo:core/Array";
import Blob "mo:core/Blob";
import Error "mo:core/Error";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Nat64 "mo:core/Nat64";
import Principal "mo:core/Principal";
import AuthLib "../lib/auth";
import CollectionsLib "../lib/collections";
import DividendsLib "../lib/dividends";
import IcpLib "../lib/icp";
import MarketplaceLib "../lib/marketplace";
import MintLib "../lib/mint";
import NFTStandards "../lib/nft-standards";
import TermsLib "../lib/terms";
import TransactionsLib "../lib/transactions";
import WalletLib "../lib/wallet";
import CollectionTypes "../types/collections";
import CommonTypes "../types/common";
import DividendTypes "../types/dividends";
import WalletTypes "../types/wallet";

mixin (
  dividendsState : DividendsLib.DividendsState,
  dividendAccumulatorState : DividendsLib.DividendAccumulatorState,
  dividendFeeState : DividendsLib.DividendFeeState,
  collectionsState : CollectionsLib.CollectionsState,
  walletState : WalletLib.WalletState,
  marketplaceState : MarketplaceLib.MarketplaceState,
  marketplaceListingLockState : MarketplaceLib.MarketplaceListingLockState,
  marketplaceUserPaymentLockState : MarketplaceLib.MarketplaceUserPaymentLockState,
  mintState : MintLib.MintState,
  authState : AuthLib.AdminState,
  transactionState : TransactionsLib.TransactionState,
  termsState : TermsLib.TermsState,
  canisterId : Principal,
) {
  type ChildCollectionOwnerActor = actor {
    icrc7_owner_of : ([Nat]) -> async [?NFTStandards.ICRC7Account];
  };

  type ChildMintlabNFT = {
    tokenId : Nat;
    metadata : WalletTypes.NFTMetadata;
  };

  type DividendTokenIdPage = {
    tokenIds : [Text];
    nextCursor : ?Nat;
    totalCount : Nat;
  };

  type ChildCollectionDividendActor = actor {
    icrc7_total_supply : shared query () -> async Nat;
    mintlab_token_ids : (?Nat, ?Nat) -> async [Nat];
    mintlab_nfts_of : (Principal, ?Nat, ?Nat) -> async [ChildMintlabNFT];
    mintlab_owner_of : ([Nat]) -> async [?NFTStandards.ICRC7Account];
  };

  transient let CHILD_TOKEN_PAGE_SIZE : Nat = 100;
  transient let CHILD_NFT_PAGE_SIZE : Nat = 1;
  transient let DIVIDEND_IMAGE_TEXT_LIMIT : Nat = 96_000;
  transient let DIVIDEND_NAME_TEXT_LIMIT : Nat = 256;
  transient let DIVIDEND_DESCRIPTION_TEXT_LIMIT : Nat = 2_000;
  transient let DIVIDEND_ATTRIBUTE_LIMIT : Nat = 20;
  transient let DIVIDEND_ATTRIBUTE_KEY_LIMIT : Nat = 128;
  transient let DIVIDEND_ATTRIBUTE_VALUE_LIMIT : Nat = 512;
  transient let DIVIDEND_PAGE_DEFAULT : Nat = 50;
  transient let DIVIDEND_PAGE_MAX : Nat = 100;
  transient let DIVIDEND_LISTING_PAUSED_MESSAGE : Text =
    "Dividend collection is paused while this NFT is listed on the marketplace. The claimable balance stays attached to the NFT for the buyer or auction winner.";

  func recordDividendClaimTransaction(
    caller : Principal,
    collection : CollectionTypes.Collection,
    paidE8s : Nat64,
    feeE8s : Nat64,
    blockIndex : Nat64,
  ) {
    ignore TransactionsLib.recordOnce(
      transactionState,
      caller,
      "dividend-claim:" # Nat64.toText(blockIndex),
      {
        kind = #DividendClaim;
        direction = #In;
        status = #Completed;
        amountE8s = ?paidE8s;
        feeE8s = ?feeE8s;
        title = "Dividend collected";
        detail = collection.name;
        blockIndex = ?blockIndex;
        reference = null;
      },
    );
  };

  public shared func getCollectionDividendInfo(
    collectionId : CollectionTypes.CollectionId
  ) : async ?DividendTypes.CollectionDividendInfo {
    let collection = switch (CollectionsLib.getCollection(collectionsState, collectionId)) {
      case null return null;
      case (?value) value;
    };
    let accountId = collectionDividendAccountId(collectionId);
    let ledger = actor (IcpLib.LEDGER_CANISTER_ID) : IcpLib.Ledger;
    let balanceE8s = await* IcpLib.getBalance(ledger, accountId);
    let nftCount = await* mintedTokenCount(collectionId);
    let processedBalanceE8s = DividendsLib.processedBalance(dividendsState, collectionId);
    ?{
      collectionId;
      enabled = DividendsLib.collectionEnabled(collection);
      accountId;
      balanceE8s;
      distributableBalanceE8s = balanceE8s;
      feeReserveE8s = 0;
      processedBalanceE8s;
      pendingE8s = processedBalanceE8s;
      nftCount;
    };
  };

  public query func getCollectionDividendBalances(
    collectionId : CollectionTypes.CollectionId
  ) : async [(Text, Nat64)] {
    switch (CollectionsLib.getCollection(collectionsState, collectionId)) {
      case null [];
      case (?collection) {
        if (not DividendsLib.collectionEnabled(collection)) {
          [];
        } else {
          DividendsLib.collectionBalances(
            dividendsState,
            dividendAccumulatorState,
            collectionId,
            cachedMintedTokenIds(collectionId),
          );
        };
      };
    };
  };

  public query func getCollectionDividendBalancesPage(
    collectionId : CollectionTypes.CollectionId,
    cursor : ?Nat,
    limit : ?Nat,
  ) : async DividendTypes.DividendBalancePage {
    let balances = switch (CollectionsLib.getCollection(collectionsState, collectionId)) {
      case null [];
      case (?collection) {
        if (not DividendsLib.collectionEnabled(collection)) {
          [];
        } else {
          DividendsLib.collectionBalances(
            dividendsState,
            dividendAccumulatorState,
            collectionId,
            cachedMintedTokenIds(collectionId),
          );
        };
      };
    };
    dividendBalancePage(balances, dividendCursorOrZero(cursor), normalizeDividendPageSize(limit));
  };

  public shared func refreshCollectionDividendBalances(
    collectionId : CollectionTypes.CollectionId
  ) : async [(Text, Nat64)] {
    switch (CollectionsLib.getCollection(collectionsState, collectionId)) {
      case null [];
      case (?collection) {
        if (not DividendsLib.collectionEnabled(collection)) {
          [];
        } else {
          DividendsLib.collectionBalances(
            dividendsState,
            dividendAccumulatorState,
            collectionId,
            await* mintedTokenIds(collectionId),
          );
        };
      };
    };
  };

  public shared func refreshCollectionDividendBalancesPage(
    collectionId : CollectionTypes.CollectionId,
    cursor : ?Nat,
    limit : ?Nat,
  ) : async DividendTypes.DividendBalancePage {
    switch (CollectionsLib.getCollection(collectionsState, collectionId)) {
      case null {
        {
          balances = [];
          nextCursor = null;
          totalCount = 0;
        };
      };
      case (?collection) {
        if (not DividendsLib.collectionEnabled(collection)) {
          {
            balances = [];
            nextCursor = null;
            totalCount = 0;
          };
        } else {
          await* refreshedDividendBalancePage(collection, cursor, normalizeDividendPageSize(limit));
        };
      };
    };
  };

  public shared ({ caller }) func getMyDividendNFTs() : async [DividendTypes.NFTDividend] {
    await* refreshedDividendEntries(caller);
  };

  public shared ({ caller }) func refreshMyDividendNFTs() : async [DividendTypes.NFTDividend] {
    await* refreshedDividendEntries(caller);
  };

  public shared ({ caller }) func getMyDividendNFTsPage(
    cursor : ?Nat,
    limit : ?Nat,
  ) : async DividendTypes.NFTDividendPage {
    let dividends = await* refreshedDividendEntries(caller);
    nftDividendPage(dividends, dividendCursorOrZero(cursor), normalizeDividendPageSize(limit));
  };

  public shared ({ caller }) func refreshMyDividendNFTsPage(
    cursor : ?Nat,
    limit : ?Nat,
  ) : async DividendTypes.NFTDividendPage {
    let dividends = await* refreshedDividendEntries(caller);
    nftDividendPage(dividends, dividendCursorOrZero(cursor), normalizeDividendPageSize(limit));
  };

  func refreshedDividendEntries(caller : Principal) : async* [DividendTypes.NFTDividend] {
    if (Principal.isAnonymous(caller)) {
      return [];
    };
    let nfts = await* refreshedDividendNFTs(caller);
    dividendEntriesForNFTs(nfts);
  };

  func refreshedDividendNFTs(caller : Principal) : async* [WalletTypes.WalletNFT] {
    var nfts = userAndListedNFTs(caller);
    for (collection in CollectionsLib.getCollections(collectionsState).values()) {
      if (DividendsLib.collectionEnabled(collection)) {
        switch (collection.kind) {
          case (#Minted) {
            if (Principal.equal(collection.canisterId, canisterId)) {
              var owned : [WalletTypes.WalletNFT] = [];
              for (
                token in MintLib.ownerTokensForCollection(
                  mintState,
                  caller,
                  collection.id,
                  MintLib.getConfig(mintState).collectionId,
                ).values()
              ) {
                let tokenId = Nat.toText(token.tokenId);
                let registered = registerDividendNFT(
                  caller,
                  collection.id,
                  tokenId,
                  MintLib.publicMetadata(token.metadata),
                  #Minted,
                );
                owned := appendDistinctCollectionToken(
                  owned,
                  registered,
                );
              };
              nfts := replaceUnlistedCollectionNFTs(nfts, caller, collection.id, owned);
            } else {
              nfts := await* refreshMintlabChildDividendNFTs(caller, collection, nfts);
            };
          };
          case (#External) {
            nfts := await* refreshOnChainDividendNFTs(caller, collection, #Registered, nfts);
          };
        };
      };
    };
    nfts;
  };

  func refreshMintlabChildDividendNFTs(
    caller : Principal,
    collection : CollectionTypes.Collection,
    current : [WalletTypes.WalletNFT],
  ) : async* [WalletTypes.WalletNFT] {
    let child : ChildCollectionDividendActor = actor (collection.canisterId.toText());
    var prev : ?Nat = null;
    var owned : [WalletTypes.WalletNFT] = [];

    label paginate loop {
      let page = try {
        await child.mintlab_nfts_of(caller, prev, ?CHILD_NFT_PAGE_SIZE);
      } catch (_error) {
        switch (await* refreshOnChainDividendNFTsIfAny(caller, collection, #Minted, current)) {
          case (?fallback) return fallback;
          case null return current;
        };
      };
      if (page.size() == 0 and owned.size() == 0) {
        switch (await* refreshOnChainDividendNFTsIfAny(caller, collection, #Minted, current)) {
          case (?fallback) return fallback;
          case null return current;
        };
      } else if (page.size() == 0) {
        break paginate;
      };
      for (preview in page.values()) {
        let tokenId = Nat.toText(preview.tokenId);
        let registered = registerDividendNFT(
          caller,
          collection.id,
          tokenId,
          preview.metadata,
          #Minted,
        );
        owned := appendDistinctCollectionToken(
          owned,
          registered,
        );
      };
      if (page.size() < CHILD_NFT_PAGE_SIZE) {
        break paginate;
      };
      prev := ?page[page.size() - 1].tokenId;
    };

    if (owned.size() == 0) {
      return current;
    };
    replaceUnlistedCollectionNFTs(current, caller, collection.id, owned);
  };

  func refreshOnChainDividendNFTsIfAny(
    caller : Principal,
    collection : CollectionTypes.Collection,
    location : WalletTypes.WalletLocation,
    current : [WalletTypes.WalletNFT],
  ) : async* ?[WalletTypes.WalletNFT] {
    let accountId = IcpLib.accountIdentifier(caller, IcpLib.zeroSubaccount());
    switch (await* WalletLib.previewUserOwnedNFTs(collection, caller, accountId)) {
      case (#err(_)) {
        await* refreshPublicICRC7DividendNFTsIfAny(caller, collection, location, current);
      };
      case (#ok(previews)) {
        if (previews.size() == 0) {
          return await* refreshPublicICRC7DividendNFTsIfAny(caller, collection, location, current);
        };
        var owned : [WalletTypes.WalletNFT] = [];
        for (preview in previews.values()) {
          let registered = registerDividendNFT(
            caller,
            collection.id,
            preview.tokenId,
            preview.metadata,
            location,
          );
          owned := appendDistinctCollectionToken(
            owned,
            registered,
          );
        };
        ?replaceUnlistedCollectionNFTs(current, caller, collection.id, owned);
      };
    };
  };

  func refreshOnChainDividendNFTs(
    caller : Principal,
    collection : CollectionTypes.Collection,
    location : WalletTypes.WalletLocation,
    current : [WalletTypes.WalletNFT],
  ) : async* [WalletTypes.WalletNFT] {
    let accountId = IcpLib.accountIdentifier(caller, IcpLib.zeroSubaccount());
    switch (await* WalletLib.previewUserOwnedNFTs(collection, caller, accountId)) {
      case (#err(_)) {
        switch (await* refreshPublicICRC7DividendNFTsIfAny(caller, collection, location, current)) {
          case (?fallback) fallback;
          case null current;
        };
      };
      case (#ok(previews)) {
        if (previews.size() == 0) {
          return switch (await* refreshPublicICRC7DividendNFTsIfAny(caller, collection, location, current)) {
            case (?fallback) fallback;
            case null current;
          };
        };
        var owned : [WalletTypes.WalletNFT] = [];
        for (preview in previews.values()) {
          let registered = registerDividendNFT(
            caller,
            collection.id,
            preview.tokenId,
            preview.metadata,
            location,
          );
          owned := appendDistinctCollectionToken(
            owned,
            registered,
          );
        };
        replaceUnlistedCollectionNFTs(current, caller, collection.id, owned);
      };
    };
  };

  func refreshPublicICRC7DividendNFTsIfAny(
    caller : Principal,
    collection : CollectionTypes.Collection,
    location : WalletTypes.WalletLocation,
    current : [WalletTypes.WalletNFT],
  ) : async* ?[WalletTypes.WalletNFT] {
    if (collection.standard != #ICRC7) {
      return null;
    };

    let canister : NFTStandards.ICRC7Actor = actor (collection.canisterId.toText());
    let account : NFTStandards.ICRC7Account = {
      owner = caller;
      subaccount = null;
    };
    var prev : ?Nat = null;
    var owned : [WalletTypes.WalletNFT] = [];

    label paginate loop {
      let tokenIds = try {
        await canister.icrc7_tokens_of(account, prev, ?CHILD_TOKEN_PAGE_SIZE);
      } catch (_error) {
        return null;
      };
      if (tokenIds.size() == 0) {
        break paginate;
      };

      for (tokenId in tokenIds.values()) {
        let tokenText = Nat.toText(tokenId);
        let registered = registerDividendNFT(
          caller,
          collection.id,
          tokenText,
          fallbackDividendMetadata(collection, tokenText),
          location,
        );
        owned := appendDistinctCollectionToken(owned, registered);
      };

      if (tokenIds.size() < CHILD_TOKEN_PAGE_SIZE) {
        break paginate;
      };
      prev := ?tokenIds[tokenIds.size() - 1];
    };

    if (owned.size() == 0) {
      null;
    } else {
      ?replaceUnlistedCollectionNFTs(current, caller, collection.id, owned);
    };
  };

  func registerDividendNFT(
    owner : Principal,
    collectionId : CollectionTypes.CollectionId,
    tokenId : Text,
    metadata : WalletTypes.NFTMetadata,
    location : WalletTypes.WalletLocation,
  ) : WalletTypes.WalletNFT {
    let registered = WalletLib.registerNFT(
      walletState,
      owner,
      collectionId,
      tokenId,
      compactNFTMetadata(metadata),
      location,
    );
    registered;
  };

  func dividendEntriesForNFTs(
    nfts : [WalletTypes.WalletNFT]
  ) : [DividendTypes.NFTDividend] {
    var dividends : [DividendTypes.NFTDividend] = [];
    for (nft in nfts.values()) {
      switch (CollectionsLib.getCollection(collectionsState, nft.collectionId)) {
        case null {};
        case (?collection) {
          if (DividendsLib.collectionEnabled(collection)) {
            dividends := Array.concat<DividendTypes.NFTDividend>(
              dividends,
              [
                {
                  nft = compactDividendNFT(nft);
                  collection = compactDividendCollection(collection);
                  claimableE8s = DividendsLib.claimableFor(
                    dividendsState,
                    dividendAccumulatorState,
                    nft.collectionId,
                    nft.tokenId,
                  );
                }
              ],
            );
          };
        };
      };
    };
    dividends;
  };

  public shared ({ caller }) func syncCollectionDividends(
    collectionId : CollectionTypes.CollectionId
  ) : async { #ok : DividendTypes.DividendSyncReceipt; #err : Text } {
    if (Principal.isAnonymous(caller)) {
      return #err("You must be logged in to check collection dividends");
    };
    let collection = switch (CollectionsLib.getCollection(collectionsState, collectionId)) {
      case null return #err("Collection not found");
      case (?value) value;
    };
    if (not DividendsLib.collectionEnabled(collection)) {
      return #err("Dividends are not enabled for this collection");
    };
    if (collection.kind != #Minted) {
      return #err("Dividends are only available for Mintlab-created collections");
    };
    if (not DividendsLib.acquireCollectionOperation(dividendAccumulatorState, collectionId)) {
      return #err("This collection is already minting or checking dividend deposits. Try again in a moment.");
    };
    var syncLockAcquired = false;
    try {
      if (not DividendsLib.acquireSync(dividendAccumulatorState, collectionId)) {
        return #err("A dividend deposit check is already running for this collection");
      };
      syncLockAcquired := true;
      let nftCount = await* mintedTokenCount(collectionId);
      if (nftCount == 0) {
        return #err("This collection has no minted NFTs to distribute to yet");
      };
      let ledger = actor (IcpLib.LEDGER_CANISTER_ID) : IcpLib.Ledger;
      let balanceE8s = await* IcpLib.getBalance(ledger, collectionDividendAccountId(collectionId));
      let receipt = DividendsLib.distributeNewBalance(
        dividendsState,
        dividendAccumulatorState,
        collectionId,
        nftCount,
        balanceE8s,
      );
      DividendsLib.finalizePendingSyncMints(dividendAccumulatorState, collectionId);
      #ok(receipt);
    } finally {
      if (syncLockAcquired) {
        DividendsLib.releaseSync(dividendAccumulatorState, collectionId);
      };
      DividendsLib.releaseCollectionOperation(dividendAccumulatorState, collectionId);
    };
  };

  public shared ({ caller }) func previewCollectionDividendDisbursement(
    collectionId : CollectionTypes.CollectionId
  ) : async { #ok : DividendTypes.DividendDisbursementPreview; #err : Text } {
    if (Principal.isAnonymous(caller)) {
      return #err("You must be logged in to preview dividend disbursement costs");
    };
    ignore collectionId;
    #err("Batch dividend disbursement is disabled. NFT owners collect dividends individually.");
  };

  public shared ({ caller }) func disburseCollectionDividends(
    collectionId : CollectionTypes.CollectionId,
    maxTransfers : ?Nat,
  ) : async { #ok : DividendTypes.DividendDisbursementReceipt; #err : Text } {
    if (Principal.isAnonymous(caller)) {
      return #err("You must be logged in to disburse dividends");
    };
    switch (TermsLib.acceptanceError(termsState, caller)) {
      case (?message) return #err(message);
      case null {};
    };
    ignore collectionId;
    ignore maxTransfers;
    #err("Batch dividend disbursement is disabled. NFT owners must collect dividends individually.");
  };

  public shared ({ caller }) func adminReleaseDividendClaimLock(
    collectionId : CollectionTypes.CollectionId,
    tokenId : Text,
  ) : async { #ok : Bool; #err : Text } {
    if (Principal.isAnonymous(caller)) {
      return #err("Anonymous caller not allowed");
    };
    if (not AuthLib.isAdmin(authState, caller)) {
      return #err("Unauthorized: admin only");
    };
    let key = DividendsLib.nftKey(collectionId, tokenId);
    let wasLocked = DividendsLib.isClaimPending(dividendsState, key);
    DividendsLib.releaseClaim(dividendsState, key);
    #ok(wasLocked);
  };

  public shared ({ caller }) func adminReleaseDividendDisbursementLock(
    collectionId : CollectionTypes.CollectionId
  ) : async { #ok : Bool; #err : Text } {
    if (Principal.isAnonymous(caller)) {
      return #err("Anonymous caller not allowed");
    };
    if (not AuthLib.isAdmin(authState, caller)) {
      return #err("Unauthorized: admin only");
    };
    let wasLocked = DividendsLib.isDisbursementPending(dividendFeeState, collectionId);
    let wasSyncLocked = DividendsLib.isSyncPending(dividendAccumulatorState, collectionId);
    let wasOperationLocked = DividendsLib.isCollectionOperationPending(dividendAccumulatorState, collectionId);
    DividendsLib.releaseDisbursement(dividendFeeState, collectionId);
    DividendsLib.releaseSync(dividendAccumulatorState, collectionId);
    DividendsLib.releaseCollectionOperation(dividendAccumulatorState, collectionId);
    #ok(wasLocked or wasSyncLocked or wasOperationLocked);
  };

  public shared ({ caller }) func claimNFTDividend(
    nftId : WalletTypes.NFTId
  ) : async { #ok : DividendTypes.DividendClaimReceipt; #err : Text } {
    if (Principal.isAnonymous(caller)) {
      return #err("You must be logged in to collect dividends");
    };
    switch (TermsLib.acceptanceError(termsState, caller)) {
      case (?message) return #err(message);
      case null {};
    };
    let nft = switch (findDividendNFTCandidate(caller, nftId)) {
      case null return #err("NFT not found in the dividend index");
      case (?value) value;
    };
    let collection = switch (CollectionsLib.getCollection(collectionsState, nft.collectionId)) {
      case null return #err("Collection not found");
      case (?value) value;
    };
    if (not DividendsLib.collectionEnabled(collection)) {
      return #err("Dividends are not enabled for this collection");
    };
    if (isActiveMarketplaceListingNFT(nft)) {
      return #err(DIVIDEND_LISTING_PAUSED_MESSAGE);
    };
    let ledger = actor (IcpLib.LEDGER_CANISTER_ID) : IcpLib.Ledger;
    let feeE8s = await* IcpLib.getTransferFee(ledger);
    let verifiedNft = switch (await* verifyDividendClaimOwner(caller, collection, nft)) {
      case (#ok(value)) value;
      case (#err(message)) return #err(message);
    };
    let claimable = DividendsLib.claimableFor(
      dividendsState,
      dividendAccumulatorState,
      nft.collectionId,
      nft.tokenId,
    );
    if (claimable == 0) {
      return #err("No dividends are available for this NFT yet");
    };
    if (claimable <= feeE8s) {
      return #err(
        "Dividend balance must exceed the ICP transfer fee of " #
        Nat64.toText(feeE8s) #
        " e8s before it can be collected"
      );
    };
    let payoutE8s = claimable - feeE8s;
    let receiptNFT = compactDividendNFT(verifiedNft);
    let receiptCollection = compactDividendCollection(collection);

    let key = DividendsLib.nftKey(nft.collectionId, nft.tokenId);
    if (not DividendsLib.acquireClaim(dividendsState, key)) {
      return #err("A dividend claim is already processing for this NFT");
    };
    var listingLockAcquired = false;
    try {
      if (not MarketplaceLib.acquireListingTokenLock(marketplaceListingLockState, nft.collectionId, nft.tokenId)) {
        return #err("This NFT is being listed or settled. Try collecting dividends again after the marketplace action finishes.");
      };
      listingLockAcquired := true;
      if (isActiveMarketplaceListingNFT(nft)) {
        return #err(DIVIDEND_LISTING_PAUSED_MESSAGE);
      };

      let reservation = DividendsLib.reserveClaim(
        dividendsState,
        dividendAccumulatorState,
        nft.collectionId,
        nft.tokenId,
      );
      try {
        let userAccount = IcpLib.accountIdentifier(canisterId, IcpLib.principalToSubaccount(caller));
        let result = await* IcpLib.transferOutWithFee(
          ledger,
          ?IcpLib.collectionDividendSubaccount(nft.collectionId),
          userAccount,
          payoutE8s,
          Nat64.fromNat(nft.id),
          feeE8s,
        );
        switch (result) {
          case (#Ok(blockIndex)) {
            DividendsLib.reduceProcessedBalance(dividendsState, nft.collectionId, claimable);
            recordDividendClaimTransaction(caller, receiptCollection, payoutE8s, feeE8s, blockIndex);
            #ok({
              nft = receiptNFT;
              collection = receiptCollection;
              paidE8s = payoutE8s;
              feeE8s;
              blockIndex;
            });
          };
          case (#Err(error)) {
            ignore error;
            DividendsLib.restoreClaim(
              dividendsState,
              dividendAccumulatorState,
              nft.collectionId,
              nft.tokenId,
              reservation,
            );
            #err("ICP dividend transfer failed");
          };
        };
      } catch (e) {
        DividendsLib.restoreClaim(
          dividendsState,
          dividendAccumulatorState,
          nft.collectionId,
          nft.tokenId,
          reservation,
        );
        #err("ICP dividend transfer failed: " # Error.message(e));
      };
    } finally {
      if (listingLockAcquired) {
        MarketplaceLib.releaseListingTokenLock(marketplaceListingLockState, nft.collectionId, nft.tokenId);
      };
      DividendsLib.releaseClaim(dividendsState, key);
    };
  };

  func verifyDividendClaimOwner(
    caller : Principal,
    collection : CollectionTypes.Collection,
    nft : WalletTypes.WalletNFT,
  ) : async* { #ok : WalletTypes.WalletNFT; #err : Text } {
    if (collection.kind != #Minted or nft.location != #Minted) {
      if (isActiveListingSeller(caller, nft.id)) {
        return #err(DIVIDEND_LISTING_PAUSED_MESSAGE);
      };
      if (not Principal.equal(nft.owner, caller)) {
        return #err("You are not the current owner of this NFT");
      };
      if (nft.location == #Vaulted) {
        return #ok(nft);
      };
      let userAccountId = IcpLib.accountIdentifier(caller, IcpLib.zeroSubaccount());
      switch (await* WalletLib.isNFTCurrentlyOwnedBy(collection, caller, userAccountId, nft.tokenId)) {
        case (#ok(true)) {
          return #ok(repairDividendNFTOwner(caller, nft));
        };
        case (#ok(false)) {
          return #err("You are not the current on-chain owner of this NFT");
        };
        case (#err(message)) {
          return #err("Could not verify current NFT ownership: " # message);
        };
      };
    };

    let tokenNat = switch (Nat.fromText(nft.tokenId)) {
      case null return #err("Minted dividend token IDs must be numeric");
      case (?value) value;
    };

    if (Principal.equal(collection.canisterId, canisterId)) {
      switch (MintLib.getToken(mintState, tokenNat)) {
        case null return #err("Minted token not found");
        case (?token) {
          if (Principal.equal(token.owner, caller)) {
            return #ok(repairDividendNFTOwner(caller, nft));
          };
          if (Principal.equal(token.owner, canisterId) and isActiveListingSeller(caller, nft.id)) {
            return #err(DIVIDEND_LISTING_PAUSED_MESSAGE);
          };
          return #err("You are not the current owner of this NFT");
        };
      };
    };

    let owners = try {
      let child : ChildCollectionDividendActor = actor (collection.canisterId.toText());
      await child.mintlab_owner_of([tokenNat]);
    } catch (error) {
      let child : ChildCollectionOwnerActor = actor (collection.canisterId.toText());
      try {
        await child.icrc7_owner_of([tokenNat]);
      } catch (_fallbackError) {
        return #err("Could not verify current NFT ownership: " # Error.message(error));
      };
    };
    if (owners.size() == 0) {
      return #err("Collection canister returned no owner for this NFT");
    };
    switch (owners[0]) {
      case null #err("NFT not found in the collection canister");
      case (?account) {
        if (not isDividendDefaultSubaccount(account.subaccount)) {
          return #err("Dividend claims are only supported for NFTs held in the owner's default account");
        };
        if (Principal.equal(account.owner, caller)) {
          #ok(repairDividendNFTOwner(caller, nft));
        } else if (Principal.equal(account.owner, canisterId) and isActiveListingSeller(caller, nft.id)) {
          #err(DIVIDEND_LISTING_PAUSED_MESSAGE);
        } else {
          #err("You are not the current owner of this NFT");
        };
      };
    };
  };

  func repairDividendNFTOwner(
    caller : Principal,
    nft : WalletTypes.WalletNFT,
  ) : WalletTypes.WalletNFT {
    if (Principal.equal(nft.owner, caller)) {
      {
        nft with
        metadata = compactNFTMetadata(nft.metadata);
      };
    } else {
      let registered = registerDividendNFT(
        caller,
        nft.collectionId,
        nft.tokenId,
        nft.metadata,
        nft.location,
      );
      registered;
    };
  };

  func fallbackDividendMetadata(
    collection : CollectionTypes.Collection,
    tokenId : Text,
  ) : WalletTypes.NFTMetadata {
    {
      name = compactOptionalText(?(collection.name # " #" # tokenId), DIVIDEND_NAME_TEXT_LIMIT);
      description = compactOptionalText(nonEmptyText(collection.description), DIVIDEND_DESCRIPTION_TEXT_LIMIT);
      imageUrl = compactOptionalImageUrl(nonEmptyText(collection.imageUrl));
      attributes = [];
    };
  };

  func compactDividendNFT(nft : WalletTypes.WalletNFT) : WalletTypes.WalletNFT {
    {
      nft with
      metadata = compactNFTMetadata(nft.metadata);
    };
  };

  func compactDividendCollection(
    collection : CollectionTypes.Collection
  ) : CollectionTypes.Collection {
    {
      collection with
      description = if (collection.description.size() <= DIVIDEND_DESCRIPTION_TEXT_LIMIT) {
        collection.description
      } else {
        ""
      };
      imageUrl = switch (compactOptionalImageUrl(nonEmptyText(collection.imageUrl))) {
        case (?value) value;
        case null "";
      };
    };
  };

  func compactNFTMetadata(metadata : WalletTypes.NFTMetadata) : WalletTypes.NFTMetadata {
    var attributes : [(Text, Text)] = [];
    label copyAttributes for ((key, value) in metadata.attributes.values()) {
      if (attributes.size() >= DIVIDEND_ATTRIBUTE_LIMIT) {
        break copyAttributes;
      };
      if (
        key.size() <= DIVIDEND_ATTRIBUTE_KEY_LIMIT and
        value.size() <= DIVIDEND_ATTRIBUTE_VALUE_LIMIT
      ) {
        attributes := Array.concat<(Text, Text)>(attributes, [(key, value)]);
      };
    };

    {
      name = compactOptionalText(metadata.name, DIVIDEND_NAME_TEXT_LIMIT);
      description = compactOptionalText(metadata.description, DIVIDEND_DESCRIPTION_TEXT_LIMIT);
      imageUrl = compactOptionalImageUrl(metadata.imageUrl);
      attributes;
    };
  };

  func compactOptionalImageUrl(imageUrl : ?Text) : ?Text {
    switch (imageUrl) {
      case (?value) {
        if (value != "" and value.size() <= DIVIDEND_IMAGE_TEXT_LIMIT) {
          ?value
        } else {
          null
        };
      };
      case null null;
    };
  };

  func compactOptionalText(value : ?Text, limit : Nat) : ?Text {
    switch (value) {
      case (?text) {
        if (text != "" and text.size() <= limit) {
          ?text
        } else {
          null
        };
      };
      case null null;
    };
  };

  func nonEmptyText(value : Text) : ?Text {
    if (value == "") {
      null
    } else {
      ?value
    };
  };

  func isActiveListingSeller(caller : Principal, nftId : WalletTypes.NFTId) : Bool {
    for (listed in MarketplaceLib.getActiveEscrowedNFTsBySeller(marketplaceState, caller).values()) {
      if (listed.id == nftId) {
        return true;
      };
    };
    false;
  };

  func isActiveMarketplaceListingNFT(nft : WalletTypes.WalletNFT) : Bool {
    switch (MarketplaceLib.findActiveEscrowedNFT(marketplaceState, nft.collectionId, nft.tokenId)) {
      case (?_) true;
      case null false;
    };
  };

  func isDividendDefaultSubaccount(subaccount : ?Blob) : Bool {
    switch (subaccount) {
      case null true;
      case (?bytes) {
        for (byte in Blob.toArray(bytes).values()) {
          if (byte != 0) {
            return false;
          };
        };
        true;
      };
    };
  };

  public query func getCollectionDividendAccountId(
    collectionId : CollectionTypes.CollectionId
  ) : async CommonTypes.AccountIdentifier {
    collectionDividendAccountId(collectionId);
  };

  func collectionDividendAccountId(
    collectionId : CollectionTypes.CollectionId
  ) : CommonTypes.AccountIdentifier {
    IcpLib.accountIdentifier(canisterId, IcpLib.collectionDividendSubaccount(collectionId));
  };

  func cachedMintedTokenIds(collectionId : CollectionTypes.CollectionId) : [Text] {
    switch (CollectionsLib.getCollection(collectionsState, collectionId)) {
      case (?collection) {
        if (collection.kind == #Minted and not Principal.equal(collection.canisterId, canisterId)) {
          return indexedMintedTokenIds(collection.id);
        };
      };
      case null {};
    };
    localMintedTokenIds(collectionId);
  };

  func mintedTokenIds(collectionId : CollectionTypes.CollectionId) : async* [Text] {
    switch (CollectionsLib.getCollection(collectionsState, collectionId)) {
      case (?collection) {
        if (collection.kind == #Minted and not Principal.equal(collection.canisterId, canisterId)) {
          return await* childMintedTokenIds(collection);
        };
      };
      case null {};
    };
    localMintedTokenIds(collectionId);
  };

  func mintedTokenIdsPage(
    collection : CollectionTypes.Collection,
    cursor : ?Nat,
    limit : Nat,
  ) : async* DividendTokenIdPage {
    if (collection.kind == #Minted and not Principal.equal(collection.canisterId, canisterId)) {
      return await* childMintedTokenIdsPage(collection, cursor, limit);
    };
    localMintedTokenIdsPage(collection.id, cursor, limit);
  };

  func mintedTokenCount(collectionId : CollectionTypes.CollectionId) : async* Nat {
    switch (CollectionsLib.getCollection(collectionsState, collectionId)) {
      case (?collection) {
        if (collection.kind == #Minted and not Principal.equal(collection.canisterId, canisterId)) {
          return await* childMintedTokenCount(collection);
        };
      };
      case null {};
    };
    localMintedTokenCount(collectionId);
  };

  func refreshedDividendBalancePage(
    collection : CollectionTypes.Collection,
    cursor : ?Nat,
    limit : Nat,
  ) : async* DividendTypes.DividendBalancePage {
    let tokenPage = await* mintedTokenIdsPage(collection, cursor, limit);
    {
      balances = DividendsLib.collectionBalances(
        dividendsState,
        dividendAccumulatorState,
        collection.id,
        tokenPage.tokenIds,
      );
      nextCursor = tokenPage.nextCursor;
      totalCount = tokenPage.totalCount;
    };
  };

  func localMintedTokenIds(collectionId : CollectionTypes.CollectionId) : [Text] {
    var tokenIds : [Text] = [];
    for (
      token in MintLib.tokensForCollection(
        mintState,
        collectionId,
        MintLib.getConfig(mintState).collectionId,
      ).values()
    ) {
      tokenIds := Array.concat<Text>(tokenIds, [Nat.toText(token.tokenId)]);
    };
    tokenIds;
  };

  func localMintedTokenIdsPage(
    collectionId : CollectionTypes.CollectionId,
    cursor : ?Nat,
    limit : Nat,
  ) : DividendTokenIdPage {
    let page = MintLib.tokenIdsForCollectionPage(
      mintState,
      collectionId,
      MintLib.getConfig(mintState).collectionId,
      cursor,
      limit,
    );
    var tokenIds : [Text] = [];
    for (tokenId in page.tokenIds.values()) {
      tokenIds := Array.concat<Text>(tokenIds, [Nat.toText(tokenId)]);
    };
    {
      tokenIds;
      nextCursor = page.nextCursor;
      totalCount = page.totalCount;
    };
  };

  func localMintedTokenCount(collectionId : CollectionTypes.CollectionId) : Nat {
    MintLib.tokenCountForCollection(
      mintState,
      collectionId,
      MintLib.getConfig(mintState).collectionId,
    );
  };

  func childMintedTokenCount(collection : CollectionTypes.Collection) : async* Nat {
    let child : ChildCollectionDividendActor = actor (collection.canisterId.toText());
    try {
      await child.icrc7_total_supply();
    } catch (_error) {
      (await* childMintedTokenIds(collection)).size();
    };
  };

  func childMintedTokenIdsPage(
    collection : CollectionTypes.Collection,
    cursor : ?Nat,
    limit : Nat,
  ) : async* DividendTokenIdPage {
    let child : ChildCollectionDividendActor = actor (collection.canisterId.toText());
    let page = try {
      await child.mintlab_token_ids(cursor, ?limit);
    } catch (_error) {
      return localIndexedTokenIdsPage(collection.id, cursor, limit);
    };
    var tokenIds : [Text] = [];
    var lastTokenId : ?Nat = null;
    for (tokenId in page.values()) {
      tokenIds := appendUniqueText(tokenIds, Nat.toText(tokenId));
      lastTokenId := ?tokenId;
    };
    let totalCount = try {
      await child.icrc7_total_supply();
    } catch (_error) {
      localIndexedTokenIdsPage(collection.id, null, DIVIDEND_PAGE_MAX).totalCount;
    };
    {
      tokenIds;
      nextCursor = if (page.size() < limit) null else lastTokenId;
      totalCount;
    };
  };

  func localIndexedTokenIdsPage(
    collectionId : CollectionTypes.CollectionId,
    cursor : ?Nat,
    limit : Nat,
  ) : DividendTokenIdPage {
    let allTokenIds = indexedMintedTokenIds(collectionId);
    var tokenIds : [Text] = [];
    var totalCount : Nat = 0;
    var added : Nat = 0;
    var lastAdded : ?Nat = null;
    var hasMore = false;
    for (tokenIdText in allTokenIds.values()) {
      switch (Nat.fromText(tokenIdText)) {
        case (?tokenId) {
          totalCount += 1;
          if (isAfterTokenCursor(tokenId, cursor)) {
            if (added < limit) {
              tokenIds := Array.concat<Text>(tokenIds, [tokenIdText]);
              lastAdded := ?tokenId;
              added += 1;
            } else {
              hasMore := true;
            };
          };
        };
        case null {};
      };
    };
    {
      tokenIds;
      nextCursor = if (hasMore) lastAdded else null;
      totalCount;
    };
  };

  func childMintedTokenIds(collection : CollectionTypes.Collection) : async* [Text] {
    let child : ChildCollectionDividendActor = actor (collection.canisterId.toText());
    var prev : ?Nat = null;
    var tokenIds : [Text] = [];

    label paginate loop {
      let page = try {
        await child.mintlab_token_ids(prev, ?CHILD_TOKEN_PAGE_SIZE);
      } catch (_error) {
        return await* publicICRC7MintedTokenIdsOrIndexed(collection);
      };
      if (page.size() == 0) {
        break paginate;
      };
      for (tokenId in page.values()) {
        tokenIds := appendUniqueText(tokenIds, Nat.toText(tokenId));
      };
      if (page.size() < CHILD_TOKEN_PAGE_SIZE) {
        break paginate;
      };
      prev := ?page[page.size() - 1];
    };

    if (tokenIds.size() == 0) {
      await* publicICRC7MintedTokenIdsOrIndexed(collection);
    } else {
      tokenIds;
    };
  };

  func publicICRC7MintedTokenIdsOrIndexed(
    collection : CollectionTypes.Collection
  ) : async* [Text] {
    switch (await* publicICRC7MintedTokenIds(collection)) {
      case (?tokenIds) {
        if (tokenIds.size() == 0) {
          indexedMintedTokenIds(collection.id);
        } else {
          tokenIds;
        };
      };
      case null indexedMintedTokenIds(collection.id);
    };
  };

  func publicICRC7MintedTokenIds(
    collection : CollectionTypes.Collection
  ) : async* ?[Text] {
    let canister : NFTStandards.ICRC7Actor = actor (collection.canisterId.toText());
    var prev : ?Nat = null;
    var tokenIds : [Text] = [];

    label paginate loop {
      let page = try {
        await canister.icrc7_tokens(prev, ?CHILD_TOKEN_PAGE_SIZE);
      } catch (_error) {
        return null;
      };
      if (page.size() == 0) {
        break paginate;
      };
      for (tokenId in page.values()) {
        tokenIds := appendUniqueText(tokenIds, Nat.toText(tokenId));
      };
      if (page.size() < CHILD_TOKEN_PAGE_SIZE) {
        break paginate;
      };
      prev := ?page[page.size() - 1];
    };

    ?tokenIds;
  };

  func indexedMintedTokenIds(collectionId : CollectionTypes.CollectionId) : [Text] {
    var tokenIds : [Text] = [];
    for ((_, nft) in Map.entries(walletState.nfts)) {
      if (nft.collectionId == collectionId and nft.location == #Minted) {
        tokenIds := appendUniqueText(tokenIds, nft.tokenId);
      };
    };
    for (nft in MarketplaceLib.getActiveEscrowedNFTsByCollection(marketplaceState, collectionId).values()) {
      tokenIds := appendUniqueText(tokenIds, nft.tokenId);
    };
    tokenIds;
  };

  func appendUniqueText(values : [Text], value : Text) : [Text] {
    for (existing in values.values()) {
      if (existing == value) {
        return values;
      };
    };
    Array.concat<Text>(values, [value]);
  };

  func isAfterTokenCursor(tokenId : Nat, cursor : ?Nat) : Bool {
    switch (cursor) {
      case null true;
      case (?previous) tokenId > previous;
    };
  };

  func replaceUnlistedCollectionNFTs(
    current : [WalletTypes.WalletNFT],
    caller : Principal,
    collectionId : CollectionTypes.CollectionId,
    replacements : [WalletTypes.WalletNFT],
  ) : [WalletTypes.WalletNFT] {
    var nfts : [WalletTypes.WalletNFT] = [];
    for (nft in current.values()) {
      if (
        nft.collectionId != collectionId or
        nft.location == #Vaulted or
        isActiveListingSeller(caller, nft.id)
      ) {
        nfts := appendDistinctCollectionToken(nfts, nft);
      };
    };
    for (nft in replacements.values()) {
      nfts := appendDistinctCollectionToken(nfts, nft);
    };
    nfts;
  };

  func appendDistinctCollectionToken(
    nfts : [WalletTypes.WalletNFT],
    nft : WalletTypes.WalletNFT,
  ) : [WalletTypes.WalletNFT] {
    for (existing in nfts.values()) {
      if (existing.collectionId == nft.collectionId and existing.tokenId == nft.tokenId) {
        return nfts;
      };
    };
    Array.concat<WalletTypes.WalletNFT>(nfts, [nft]);
  };

  func userAndListedNFTs(caller : Principal) : [WalletTypes.WalletNFT] {
    var nfts = WalletLib.getUserNFTs(walletState, caller);
    for (listed in MarketplaceLib.getActiveEscrowedNFTsBySeller(marketplaceState, caller).values()) {
      if (not containsNFT(nfts, listed.id)) {
        nfts := Array.concat<WalletTypes.WalletNFT>(nfts, [listed]);
      };
    };
    nfts;
  };

  func dividendCursorOrZero(cursor : ?Nat) : Nat {
    switch (cursor) {
      case (?value) value;
      case null 0;
    };
  };

  func normalizeDividendPageSize(limit : ?Nat) : Nat {
    switch (limit) {
      case null DIVIDEND_PAGE_DEFAULT;
      case (?value) {
        if (value == 0) {
          1;
        } else if (value > DIVIDEND_PAGE_MAX) {
          DIVIDEND_PAGE_MAX;
        } else {
          value;
        };
      };
    };
  };

  func nftDividendPage(
    dividends : [DividendTypes.NFTDividend],
    start : Nat,
    limit : Nat,
  ) : DividendTypes.NFTDividendPage {
    var page : [DividendTypes.NFTDividend] = [];
    var index : Nat = 0;
    var added : Nat = 0;
    for (dividend in dividends.values()) {
      if (index < start) {
        index += 1;
      } else if (added < limit) {
        page := Array.concat<DividendTypes.NFTDividend>(page, [dividend]);
        added += 1;
        index += 1;
      } else {
        return {
          dividends = page;
          nextCursor = ?index;
          totalCount = dividends.size();
        };
      };
    };
    {
      dividends = page;
      nextCursor = null;
      totalCount = dividends.size();
    };
  };

  func dividendBalancePage(
    balances : [(Text, Nat64)],
    start : Nat,
    limit : Nat,
  ) : DividendTypes.DividendBalancePage {
    var page : [(Text, Nat64)] = [];
    var index : Nat = 0;
    var added : Nat = 0;
    for (balance in balances.values()) {
      if (index < start) {
        index += 1;
      } else if (added < limit) {
        page := Array.concat<(Text, Nat64)>(page, [balance]);
        added += 1;
        index += 1;
      } else {
        return {
          balances = page;
          nextCursor = ?index;
          totalCount = balances.size();
        };
      };
    };
    {
      balances = page;
      nextCursor = null;
      totalCount = balances.size();
    };
  };

  func findDividendNFTCandidate(caller : Principal, nftId : WalletTypes.NFTId) : ?WalletTypes.WalletNFT {
    switch (WalletLib.getNFT(walletState, nftId)) {
      case (?nft) {
        if (nft.location == #Minted) {
          return ?nft;
        };
        if (Principal.equal(nft.owner, caller)) {
          return ?nft;
        };
      };
      case null {};
    };
    for (listed in MarketplaceLib.getActiveEscrowedNFTsBySeller(marketplaceState, caller).values()) {
      if (listed.id == nftId) {
        return ?listed;
      };
    };
    null;
  };

  func containsNFT(nfts : [WalletTypes.WalletNFT], nftId : WalletTypes.NFTId) : Bool {
    for (nft in nfts.values()) {
      if (nft.id == nftId) {
        return true;
      };
    };
    false;
  };
};
