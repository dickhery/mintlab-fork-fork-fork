import Array "mo:core/Array";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Text "mo:core/Text";

import CollectionsLib "lib/collections";
import CollectionTypes "types/collections";
import MarketplaceLib "lib/marketplace";
import MarketplaceTypes "types/marketplace";
import MintLib "lib/mint";
import MintTypes "types/mint";
import WalletTypes "types/wallet";
import WalletLib "lib/wallet";

module {
  type OldCollectionsState = {
    collections : Map.Map<CollectionTypes.CollectionId, CollectionTypes.Collection>;
    var nextId : Nat;
  };

  type OldMintState = {
    tokens : Map.Map<Nat, MintTypes.MintedToken>;
    pendingCollectionCreates : Map.Map<Principal, Bool>;
    var nextTokenId : Nat;
    var nextTransactionId : Nat;
    var config : MintTypes.StoredMintConfig;
    var collectionCanisterWasm : ?Blob;
  };

  type OldOwnershipIndexState = {
    records : Map.Map<Text, WalletTypes.OwnershipIndexRecord>;
    status : Map.Map<WalletTypes.CollectionId, WalletTypes.CollectionIndexStatus>;
  };

  type OldMarketplaceState = {
    fixedListings : Map.Map<MarketplaceTypes.ListingId, MarketplaceTypes.FixedListing>;
    auctionListings : Map.Map<MarketplaceTypes.ListingId, MarketplaceTypes.AuctionListing>;
    bids : Map.Map<MarketplaceTypes.ListingId, [MarketplaceTypes.Bid]>;
    escrowedNFTs : Map.Map<MarketplaceTypes.ListingId, WalletTypes.WalletNFT>;
    var nextId : Nat;
  };

  type OldMarketplacePaymentState = {
    auctionEscrows : Map.Map<MarketplaceTypes.ListingId, MarketplaceTypes.AuctionEscrow>;
    pendingRefunds : Map.Map<Nat, MarketplaceTypes.AuctionEscrow>;
    listingLocks : Map.Map<MarketplaceTypes.ListingId, Bool>;
    var nextEscrowId : Nat;
    var mintlabFeeRecipient : ?MarketplaceTypes.AccountIdentifier;
  };

  type OldMarketplaceSettlementState = {
    fixedPurchaseSettlements : Map.Map<MarketplaceTypes.ListingId, MarketplaceTypes.FixedPurchaseSettlement>;
    auctionSettlements : Map.Map<MarketplaceTypes.ListingId, MarketplaceTypes.AuctionSettlement>;
  };

  type OldNoBidAuctionReturnState = {
    returns : Map.Map<MarketplaceTypes.ListingId, MarketplaceTypes.NoBidAuctionReturnSettlement>;
  };

  type OldListingReturnState = {
    returns : Map.Map<MarketplaceTypes.ListingId, MarketplaceTypes.ListingReturnSettlement>;
  };

  type OldMarketplaceBidState = {
    pendingBidDeposits : Map.Map<MarketplaceTypes.ListingId, MarketplaceTypes.PendingBidDeposit>;
  };

  type MintTokenIndexes = {
    tokensByOwner : Map.Map<Principal, [Nat]>;
    tokensByCollection : Map.Map<MintTypes.CollectionId, [Nat]>;
    tokensByOwnerCollection : Map.Map<Text, [Nat]>;
  };

  type MarketplaceBidIndexes = {
    bidderStatuses : Map.Map<Text, MarketplaceTypes.BidderAuctionStatus>;
    bidSummaries : Map.Map<MarketplaceTypes.ListingId, MarketplaceTypes.AuctionBidSummary>;
  };

  public func migration(
    old : {
      collectionsState : OldCollectionsState;
      mintState : OldMintState;
      ownershipIndexState : OldOwnershipIndexState;
      marketplaceState : OldMarketplaceState;
      marketplacePaymentState : OldMarketplacePaymentState;
      marketplaceSettlementState : OldMarketplaceSettlementState;
      marketplaceNoBidAuctionReturnState : OldNoBidAuctionReturnState;
      marketplaceListingReturnState : OldListingReturnState;
      marketplaceBidState : OldMarketplaceBidState;
    }
  ) : {
    collectionsState : CollectionsLib.CollectionsState;
    mintState : MintLib.MintState;
    ownershipIndexState : WalletLib.OwnershipIndexState;
    marketplaceState : MarketplaceLib.MarketplaceState;
    marketplacePaymentState : MarketplaceLib.MarketplacePaymentState;
    marketplaceSettlementState : MarketplaceLib.MarketplaceSettlementState;
    marketplaceNoBidAuctionReturnState : MarketplaceLib.NoBidAuctionReturnState;
    marketplaceListingReturnState : MarketplaceLib.ListingReturnState;
    marketplaceBidState : MarketplaceLib.MarketplaceBidState;
  } {
    let mintTokenIndexes = buildMintTokenIndexes(old.mintState);
    let ownershipOwnerIndex = buildOwnershipOwnerIndex(old.ownershipIndexState);
    let marketplaceBidIndexes = buildMarketplaceBidIndexes(old.marketplaceState);
    let settlementStatusIndex = buildSettlementStatusIndex(old.marketplaceSettlementState);
    let noBidStatusIndex = buildNoBidStatusIndex(old.marketplaceNoBidAuctionReturnState);
    let listingReturnStatusIndex = buildListingReturnStatusIndex(old.marketplaceListingReturnState);
    let pendingBidIndex = buildPendingBidIndex(old.marketplaceBidState);
    let pendingRefundIndex = buildPendingRefundIndex(old.marketplacePaymentState);
    {
      collectionsState = {
        collections = old.collectionsState.collections;
        var importMetas = ?Map.empty<CollectionTypes.CollectionId, CollectionTypes.CollectionImportMeta>();
        var importsByUser = ?Map.empty<Principal, [CollectionTypes.CollectionId]>();
        var lastImportAtByUser = ?Map.empty<Principal, Int>();
        var nextId = old.collectionsState.nextId;
      };
      mintState = {
        tokens = old.mintState.tokens;
        var tokensByOwner = ?mintTokenIndexes.tokensByOwner;
        var tokensByCollection = ?mintTokenIndexes.tokensByCollection;
        var tokensByOwnerCollection = ?mintTokenIndexes.tokensByOwnerCollection;
        pendingCollectionCreates = old.mintState.pendingCollectionCreates;
        var nextTokenId = old.mintState.nextTokenId;
        var nextTransactionId = old.mintState.nextTransactionId;
        var config = old.mintState.config;
        var collectionCanisterWasm = old.mintState.collectionCanisterWasm;
      };
      ownershipIndexState = {
        records = old.ownershipIndexState.records;
        var recordsByOwner = ?ownershipOwnerIndex;
        status = old.ownershipIndexState.status;
      };
      marketplaceState = {
        fixedListings = old.marketplaceState.fixedListings;
        auctionListings = old.marketplaceState.auctionListings;
        bids = old.marketplaceState.bids;
        var bidderStatuses = ?marketplaceBidIndexes.bidderStatuses;
        var bidSummaries = ?marketplaceBidIndexes.bidSummaries;
        escrowedNFTs = old.marketplaceState.escrowedNFTs;
        var nextId = old.marketplaceState.nextId;
      };
      marketplacePaymentState = {
        auctionEscrows = old.marketplacePaymentState.auctionEscrows;
        pendingRefunds = old.marketplacePaymentState.pendingRefunds;
        var pendingRefundIdsByUser = ?pendingRefundIndex;
        listingLocks = old.marketplacePaymentState.listingLocks;
        var nextEscrowId = old.marketplacePaymentState.nextEscrowId;
        var mintlabFeeRecipient = old.marketplacePaymentState.mintlabFeeRecipient;
      };
      marketplaceSettlementState = {
        fixedPurchaseSettlements = old.marketplaceSettlementState.fixedPurchaseSettlements;
        auctionSettlements = old.marketplaceSettlementState.auctionSettlements;
        var statusListingIdsByUser = ?settlementStatusIndex;
      };
      marketplaceNoBidAuctionReturnState = {
        returns = old.marketplaceNoBidAuctionReturnState.returns;
        var statusListingIdsByUser = ?noBidStatusIndex;
      };
      marketplaceListingReturnState = {
        returns = old.marketplaceListingReturnState.returns;
        var statusListingIdsByUser = ?listingReturnStatusIndex;
      };
      marketplaceBidState = {
        pendingBidDeposits = old.marketplaceBidState.pendingBidDeposits;
        var pendingBidIdsByUser = ?pendingBidIndex;
      };
    };
  };

  func buildMintTokenIndexes(state : OldMintState) : MintTokenIndexes {
    let tokensByOwner = Map.empty<Principal, [Nat]>();
    let tokensByCollection = Map.empty<MintTypes.CollectionId, [Nat]>();
    let tokensByOwnerCollection = Map.empty<Text, [Nat]>();
    for ((_, token) in Map.entries(state.tokens)) {
      appendPrincipalNat(tokensByOwner, token.owner, token.tokenId);
      switch (MintLib.tokenCollectionId(token, state.config.collectionId)) {
        case (?collectionId) {
          appendNatBucket(tokensByCollection, collectionId, token.tokenId);
          appendTextNat(tokensByOwnerCollection, ownerCollectionKey(token.owner, collectionId), token.tokenId);
        };
        case null {};
      };
    };
    { tokensByOwner; tokensByCollection; tokensByOwnerCollection };
  };

  func buildOwnershipOwnerIndex(state : OldOwnershipIndexState) : Map.Map<Text, [Text]> {
    let index = Map.empty<Text, [Text]>();
    for ((recordKey, record) in Map.entries(state.records)) {
      appendTextValue(index, ownerIndexKey(record.collectionId, indexedOwnerKey(record.owner)), recordKey);
    };
    index;
  };

  func buildMarketplaceBidIndexes(state : OldMarketplaceState) : MarketplaceBidIndexes {
    let bidderStatuses = Map.empty<Text, MarketplaceTypes.BidderAuctionStatus>();
    let bidSummaries = Map.empty<MarketplaceTypes.ListingId, MarketplaceTypes.AuctionBidSummary>();
    for ((listingId, history) in Map.entries(state.bids)) {
      var lastBidAt : ?MarketplaceTypes.Timestamp = null;
      for (bid in history.values()) {
        lastBidAt := ?bid.placedAt;
        let key = bidderListingKey(bid.listingId, bid.bidder);
        let currentHighest = switch (Map.get(bidderStatuses, Text.compare, key)) {
          case (?status) status.myHighestBid;
          case null (0 : Nat64);
        };
        Map.add(
          bidderStatuses,
          Text.compare,
          key,
          {
            listingId = bid.listingId;
            bidder = bid.bidder;
            hasBid = true;
            myHighestBid = if (bid.amount > currentHighest) bid.amount else currentHighest;
            updatedAt = bid.placedAt;
          },
        );
      };
      switch (Map.get(state.auctionListings, Nat.compare, listingId)) {
        case (?listing) {
          switch (lastBidAt) {
            case (?updatedAt) {
              Map.add(
                bidSummaries,
                Nat.compare,
                listingId,
                {
                  listingId;
                  bidCount = history.size();
                  highestBid = listing.highestBid;
                  highestBidder = listing.highestBidder;
                  lastBidAt = updatedAt;
                },
              );
            };
            case null {};
          };
        };
        case null {};
      };
    };
    { bidderStatuses; bidSummaries };
  };

  func buildSettlementStatusIndex(
    state : OldMarketplaceSettlementState
  ) : Map.Map<Principal, [MarketplaceTypes.ListingId]> {
    let index = Map.empty<Principal, [MarketplaceTypes.ListingId]>();
    for ((_, settlement) in Map.entries(state.fixedPurchaseSettlements)) {
      appendPrincipalNat(index, settlement.buyer, settlement.listingId);
      appendPrincipalNat(index, settlement.seller, settlement.listingId);
    };
    for ((_, settlement) in Map.entries(state.auctionSettlements)) {
      appendPrincipalNat(index, settlement.winner, settlement.listingId);
      appendPrincipalNat(index, settlement.seller, settlement.listingId);
    };
    index;
  };

  func buildNoBidStatusIndex(
    state : OldNoBidAuctionReturnState
  ) : Map.Map<Principal, [MarketplaceTypes.ListingId]> {
    let index = Map.empty<Principal, [MarketplaceTypes.ListingId]>();
    for ((_, settlement) in Map.entries(state.returns)) {
      appendPrincipalNat(index, settlement.seller, settlement.listingId);
    };
    index;
  };

  func buildListingReturnStatusIndex(
    state : OldListingReturnState
  ) : Map.Map<Principal, [MarketplaceTypes.ListingId]> {
    let index = Map.empty<Principal, [MarketplaceTypes.ListingId]>();
    for ((_, settlement) in Map.entries(state.returns)) {
      appendPrincipalNat(index, settlement.seller, settlement.listingId);
    };
    index;
  };

  func buildPendingBidIndex(
    state : OldMarketplaceBidState
  ) : Map.Map<Principal, [MarketplaceTypes.ListingId]> {
    let index = Map.empty<Principal, [MarketplaceTypes.ListingId]>();
    for ((_, pending) in Map.entries(state.pendingBidDeposits)) {
      appendPrincipalNat(index, pending.bidder, pending.listingId);
    };
    index;
  };

  func buildPendingRefundIndex(
    state : OldMarketplacePaymentState
  ) : Map.Map<Principal, [Nat]> {
    let index = Map.empty<Principal, [Nat]>();
    for ((_, escrow) in Map.entries(state.pendingRefunds)) {
      appendPrincipalNat(index, escrow.bidder, escrow.escrowId);
    };
    index;
  };

  func ownerCollectionKey(owner : Principal, collectionId : Nat) : Text {
    owner.toText() # ":" # Nat.toText(collectionId);
  };

  func ownerIndexKey(collectionId : Nat, ownerKey : Text) : Text {
    Nat.toText(collectionId) # ":" # Text.toLower(ownerKey);
  };

  func indexedOwnerKey(owner : WalletTypes.IndexedOwner) : Text {
    switch (owner) {
      case (#Principal(p)) p.toText();
      case (#AccountIdText(account)) account;
      case (#Unknown) "unknown";
    };
  };

  func bidderListingKey(listingId : MarketplaceTypes.ListingId, bidder : Principal) : Text {
    Nat.toText(listingId) # ":" # bidder.toText();
  };

  func appendPrincipalNat(index : Map.Map<Principal, [Nat]>, user : Principal, value : Nat) {
    let current = switch (Map.get(index, Principal.compare, user)) {
      case (?values) values;
      case null [];
    };
    Map.add(index, Principal.compare, user, appendUniqueNat(current, value));
  };

  func appendNatBucket(index : Map.Map<Nat, [Nat]>, key : Nat, value : Nat) {
    let current = switch (Map.get(index, Nat.compare, key)) {
      case (?values) values;
      case null [];
    };
    Map.add(index, Nat.compare, key, appendUniqueNat(current, value));
  };

  func appendTextNat(index : Map.Map<Text, [Nat]>, key : Text, value : Nat) {
    let current = switch (Map.get(index, Text.compare, key)) {
      case (?values) values;
      case null [];
    };
    Map.add(index, Text.compare, key, appendUniqueNat(current, value));
  };

  func appendTextValue(index : Map.Map<Text, [Text]>, key : Text, value : Text) {
    let current = switch (Map.get(index, Text.compare, key)) {
      case (?values) values;
      case null [];
    };
    Map.add(index, Text.compare, key, appendUniqueText(current, value));
  };

  func appendUniqueNat(values : [Nat], value : Nat) : [Nat] {
    for (existing in values.values()) {
      if (existing == value) {
        return values;
      };
    };
    Array.concat<Nat>(values, [value]);
  };

  func appendUniqueText(values : [Text], value : Text) : [Text] {
    for (existing in values.values()) {
      if (existing == value) {
        return values;
      };
    };
    Array.concat<Text>(values, [value]);
  };
};
