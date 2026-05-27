import Array "mo:core/Array";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Nat64 "mo:core/Nat64";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Types "../types/marketplace";
import WalletTypes "../types/wallet";

module {
  public let DEFAULT_MINTLAB_FEE_BASIS_POINTS : Nat = 200; // 2%
  public let MINTLAB_FEE_BASIS_POINTS : Nat = DEFAULT_MINTLAB_FEE_BASIS_POINTS;
  public let BASIS_POINTS_DENOMINATOR : Nat = 10_000;
  public let AUCTION_SETTLEMENT_TRANSFER_COUNT : Nat = 2;
  public let MIN_AUCTION_STARTING_BID_E8S : Nat64 = 1_000_000; // 0.01 ICP
  public let MIN_AUCTION_BID_INCREMENT_E8S : Nat64 = 1_000_000; // 0.01 ICP
  public let ANTI_SNIPE_THRESHOLD_NANOS : Int = 120_000_000_000; // 2 minutes
  public let ANTI_SNIPE_EXTENSION_NANOS : Int = 300_000_000_000; // 5 minutes

  public type MarketplaceState = {
    fixedListings : Map.Map<Types.ListingId, Types.FixedListing>;
    auctionListings : Map.Map<Types.ListingId, Types.AuctionListing>;
    bids : Map.Map<Types.ListingId, [Types.Bid]>;
    escrowedNFTs : Map.Map<Types.ListingId, WalletTypes.WalletNFT>;
    var nextId : Nat;
  };

  public type MarketplacePaymentState = {
    auctionEscrows : Map.Map<Types.ListingId, Types.AuctionEscrow>;
    pendingRefunds : Map.Map<Nat, Types.AuctionEscrow>;
    listingLocks : Map.Map<Types.ListingId, Bool>;
    var nextEscrowId : Nat;
    var mintlabFeeRecipient : ?Types.AccountIdentifier;
  };

  public type MarketplaceRefundState = {
    refundJournals : Map.Map<Nat, Types.PendingAuctionRefund>;
  };

  public type MarketplaceUserPaymentLockState = {
    userPaymentLocks : Map.Map<Principal, Bool>;
  };

  public type MarketplaceListingLockState = {
    listingTokenLocks : Map.Map<Text, Bool>;
  };

  public type MarketplaceSettlementState = {
    fixedPurchaseSettlements : Map.Map<Types.ListingId, Types.FixedPurchaseSettlement>;
    auctionSettlements : Map.Map<Types.ListingId, Types.AuctionSettlement>;
  };

  public type NoBidAuctionReturnState = {
    returns : Map.Map<Types.ListingId, Types.NoBidAuctionReturnSettlement>;
  };

  public type ListingReturnState = {
    returns : Map.Map<Types.ListingId, Types.ListingReturnSettlement>;
  };

  public type MarketplaceBidState = {
    pendingBidDeposits : Map.Map<Types.ListingId, Types.PendingBidDeposit>;
  };

  public type MarketplaceFeeState = {
    var mintlabFeeBasisPoints : Nat;
  };

  public func newState() : MarketplaceState {
    {
      fixedListings = Map.empty<Types.ListingId, Types.FixedListing>();
      auctionListings = Map.empty<Types.ListingId, Types.AuctionListing>();
      bids = Map.empty<Types.ListingId, [Types.Bid]>();
      escrowedNFTs = Map.empty<Types.ListingId, WalletTypes.WalletNFT>();
      var nextId = 1;
    };
  };

  public func newPaymentState() : MarketplacePaymentState {
    {
      auctionEscrows = Map.empty<Types.ListingId, Types.AuctionEscrow>();
      pendingRefunds = Map.empty<Nat, Types.AuctionEscrow>();
      listingLocks = Map.empty<Types.ListingId, Bool>();
      var nextEscrowId = 1;
      var mintlabFeeRecipient = null;
    };
  };

  public func newRefundState() : MarketplaceRefundState {
    {
      refundJournals = Map.empty<Nat, Types.PendingAuctionRefund>();
    };
  };

  public func newUserPaymentLockState() : MarketplaceUserPaymentLockState {
    {
      userPaymentLocks = Map.empty<Principal, Bool>();
    };
  };

  public func newListingLockState() : MarketplaceListingLockState {
    {
      listingTokenLocks = Map.empty<Text, Bool>();
    };
  };

  public func newSettlementState() : MarketplaceSettlementState {
    {
      fixedPurchaseSettlements = Map.empty<Types.ListingId, Types.FixedPurchaseSettlement>();
      auctionSettlements = Map.empty<Types.ListingId, Types.AuctionSettlement>();
    };
  };

  public func newNoBidAuctionReturnState() : NoBidAuctionReturnState {
    {
      returns = Map.empty<Types.ListingId, Types.NoBidAuctionReturnSettlement>();
    };
  };

  public func newListingReturnState() : ListingReturnState {
    {
      returns = Map.empty<Types.ListingId, Types.ListingReturnSettlement>();
    };
  };

  public func newBidState() : MarketplaceBidState {
    {
      pendingBidDeposits = Map.empty<Types.ListingId, Types.PendingBidDeposit>();
    };
  };

  public func newFeeState() : MarketplaceFeeState {
    {
      var mintlabFeeBasisPoints = DEFAULT_MINTLAB_FEE_BASIS_POINTS;
    };
  };

  public func getFeeConfig(
    state : MarketplacePaymentState,
    feeState : MarketplaceFeeState,
    ledgerFeeE8s : Nat64,
  ) : Types.MarketplaceFeeConfig {
    {
      mintlabFeeBasisPoints = feeState.mintlabFeeBasisPoints;
      mintlabFeeRecipient = state.mintlabFeeRecipient;
      ledgerFeeE8s;
      auctionBidFeeReserveE8s = auctionBidFeeReserve(ledgerFeeE8s);
    };
  };

  public func setMintlabFeeRecipient(
    state : MarketplacePaymentState,
    recipient : ?Types.AccountIdentifier,
  ) {
    state.mintlabFeeRecipient := recipient;
  };

  public func setMintlabFeeBasisPoints(
    state : MarketplaceFeeState,
    basisPoints : Nat,
  ) {
    state.mintlabFeeBasisPoints := basisPoints;
  };

  public func mintlabFee(state : MarketplaceFeeState, amount : Nat64) : Nat64 {
    Nat64.fromNat((Nat64.toNat(amount) * state.mintlabFeeBasisPoints) / BASIS_POINTS_DENOMINATOR);
  };

  public func sellerProceeds(state : MarketplaceFeeState, amount : Nat64) : Nat64 {
    amount - mintlabFee(state, amount);
  };

  public func auctionBidFeeReserve(ledgerFeeE8s : Nat64) : Nat64 {
    Nat64.fromNat(Nat64.toNat(ledgerFeeE8s) * AUCTION_SETTLEMENT_TRANSFER_COUNT);
  };

  public func auctionBidEscrowDeposit(amount : Nat64, ledgerFeeE8s : Nat64) : Nat64 {
    Nat64.fromNat(Nat64.toNat(amount) + Nat64.toNat(auctionBidFeeReserve(ledgerFeeE8s)));
  };

  public func totalBidderDebit(amount : Nat64, ledgerFeeE8s : Nat64) : Nat64 {
    Nat64.fromNat(Nat64.toNat(auctionBidEscrowDeposit(amount, ledgerFeeE8s)) + Nat64.toNat(ledgerFeeE8s));
  };

  public func nextMinimumAuctionBid(listing : Types.AuctionListing) : Nat64 {
    if (listing.highestBid == 0) {
      if (listing.startingBid < MIN_AUCTION_STARTING_BID_E8S) {
        MIN_AUCTION_STARTING_BID_E8S;
      } else {
        listing.startingBid;
      };
    } else {
      listing.highestBid + MIN_AUCTION_BID_INCREMENT_E8S;
    };
  };

  public func extendedAuctionEndTimeAfterBid(
    listing : Types.AuctionListing,
    bidObservedAt : Types.Timestamp,
  ) : Types.Timestamp {
    if (listing.endTime <= bidObservedAt) {
      listing.endTime;
    } else {
      let remaining = listing.endTime - bidObservedAt;
      if (remaining < ANTI_SNIPE_THRESHOLD_NANOS) {
        let extendedFromCurrentEnd = listing.endTime + ANTI_SNIPE_EXTENSION_NANOS;
        let extendedFromAcceptance = Time.now() + ANTI_SNIPE_EXTENSION_NANOS;
        if (extendedFromCurrentEnd >= extendedFromAcceptance) {
          extendedFromCurrentEnd;
        } else {
          extendedFromAcceptance;
        };
      } else {
        listing.endTime;
      };
    };
  };

  public func fixedPurchaseLedgerFeeCount(state : MarketplaceFeeState, amount : Nat64) : Nat64 {
    if (mintlabFee(state, amount) > 0) 2 else 1;
  };

  public func totalFixedBuyerDebit(state : MarketplaceFeeState, amount : Nat64, ledgerFeeE8s : Nat64) : Nat64 {
    Nat64.fromNat(
      Nat64.toNat(amount) + (Nat64.toNat(ledgerFeeE8s) * Nat64.toNat(fixedPurchaseLedgerFeeCount(state, amount)))
    );
  };

  public func fixedPurchaseEscrowDeposit(state : MarketplaceFeeState, amount : Nat64, ledgerFeeE8s : Nat64) : Nat64 {
    totalFixedBuyerDebit(state, amount, ledgerFeeE8s);
  };

  public func totalFixedEscrowBuyerDebit(state : MarketplaceFeeState, amount : Nat64, ledgerFeeE8s : Nat64) : Nat64 {
    Nat64.fromNat(
      Nat64.toNat(fixedPurchaseEscrowDeposit(state, amount, ledgerFeeE8s)) + Nat64.toNat(ledgerFeeE8s)
    );
  };

  public func peekNextEscrowId(state : MarketplacePaymentState) : Nat {
    state.nextEscrowId;
  };

  public func reserveEscrowId(state : MarketplacePaymentState) : Nat {
    let escrowId = state.nextEscrowId;
    state.nextEscrowId += 1;
    escrowId;
  };

  public func recordAuctionEscrow(
    state : MarketplacePaymentState,
    listingId : Types.ListingId,
    escrow : Types.AuctionEscrow,
  ) {
    if (escrow.escrowId >= state.nextEscrowId) {
      state.nextEscrowId := escrow.escrowId + 1;
    };
    Map.add(state.auctionEscrows, Nat.compare, listingId, escrow);
  };

  public func putFixedPurchaseSettlement(
    state : MarketplaceSettlementState,
    settlement : Types.FixedPurchaseSettlement,
  ) {
    Map.add(state.fixedPurchaseSettlements, Nat.compare, settlement.listingId, settlement);
  };

  public func getFixedPurchaseSettlement(
    state : MarketplaceSettlementState,
    listingId : Types.ListingId,
  ) : ?Types.FixedPurchaseSettlement {
    Map.get(state.fixedPurchaseSettlements, Nat.compare, listingId);
  };

  public func removeFixedPurchaseSettlement(
    state : MarketplaceSettlementState,
    listingId : Types.ListingId,
  ) : ?Types.FixedPurchaseSettlement {
    let current = Map.get(state.fixedPurchaseSettlements, Nat.compare, listingId);
    Map.remove(state.fixedPurchaseSettlements, Nat.compare, listingId);
    current;
  };

  public func putAuctionSettlement(
    state : MarketplaceSettlementState,
    settlement : Types.AuctionSettlement,
  ) {
    Map.add(state.auctionSettlements, Nat.compare, settlement.listingId, settlement);
  };

  public func getAuctionSettlement(
    state : MarketplaceSettlementState,
    listingId : Types.ListingId,
  ) : ?Types.AuctionSettlement {
    Map.get(state.auctionSettlements, Nat.compare, listingId);
  };

  public func removeAuctionSettlement(
    state : MarketplaceSettlementState,
    listingId : Types.ListingId,
  ) : ?Types.AuctionSettlement {
    let current = Map.get(state.auctionSettlements, Nat.compare, listingId);
    Map.remove(state.auctionSettlements, Nat.compare, listingId);
    current;
  };

  public func putNoBidAuctionReturn(
    state : NoBidAuctionReturnState,
    settlement : Types.NoBidAuctionReturnSettlement,
  ) {
    Map.add(state.returns, Nat.compare, settlement.listingId, settlement);
  };

  public func getNoBidAuctionReturn(
    state : NoBidAuctionReturnState,
    listingId : Types.ListingId,
  ) : ?Types.NoBidAuctionReturnSettlement {
    Map.get(state.returns, Nat.compare, listingId);
  };

  public func removeNoBidAuctionReturn(
    state : NoBidAuctionReturnState,
    listingId : Types.ListingId,
  ) : ?Types.NoBidAuctionReturnSettlement {
    let current = Map.get(state.returns, Nat.compare, listingId);
    Map.remove(state.returns, Nat.compare, listingId);
    current;
  };

  public func isNoBidAuctionReturning(
    state : NoBidAuctionReturnState,
    listingId : Types.ListingId,
  ) : Bool {
    switch (Map.get(state.returns, Nat.compare, listingId)) {
      case (?_) true;
      case null false;
    };
  };

  public func putListingReturn(
    state : ListingReturnState,
    settlement : Types.ListingReturnSettlement,
  ) {
    Map.add(state.returns, Nat.compare, settlement.listingId, settlement);
  };

  public func getListingReturn(
    state : ListingReturnState,
    listingId : Types.ListingId,
  ) : ?Types.ListingReturnSettlement {
    Map.get(state.returns, Nat.compare, listingId);
  };

  public func removeListingReturn(
    state : ListingReturnState,
    listingId : Types.ListingId,
  ) : ?Types.ListingReturnSettlement {
    let current = Map.get(state.returns, Nat.compare, listingId);
    Map.remove(state.returns, Nat.compare, listingId);
    current;
  };

  public func isListingReturning(
    state : ListingReturnState,
    listingId : Types.ListingId,
  ) : Bool {
    switch (Map.get(state.returns, Nat.compare, listingId)) {
      case (?_) true;
      case null false;
    };
  };

  public func isListingSettling(
    state : MarketplaceSettlementState,
    listingId : Types.ListingId,
  ) : Bool {
    switch (Map.get(state.fixedPurchaseSettlements, Nat.compare, listingId)) {
      case (?_) true;
      case null {
        switch (Map.get(state.auctionSettlements, Nat.compare, listingId)) {
          case (?_) true;
          case null false;
        };
      };
    };
  };

  public func getAuctionEscrow(
    state : MarketplacePaymentState,
    listingId : Types.ListingId,
  ) : ?Types.AuctionEscrow {
    Map.get(state.auctionEscrows, Nat.compare, listingId);
  };

  public func removeAuctionEscrow(
    state : MarketplacePaymentState,
    listingId : Types.ListingId,
  ) : ?Types.AuctionEscrow {
    let current = Map.get(state.auctionEscrows, Nat.compare, listingId);
    Map.remove(state.auctionEscrows, Nat.compare, listingId);
    current;
  };

  public func putPendingBidDeposit(
    state : MarketplaceBidState,
    pending : Types.PendingBidDeposit,
  ) {
    Map.add(state.pendingBidDeposits, Nat.compare, pending.listingId, pending);
  };

  public func getPendingBidDeposit(
    state : MarketplaceBidState,
    listingId : Types.ListingId,
  ) : ?Types.PendingBidDeposit {
    Map.get(state.pendingBidDeposits, Nat.compare, listingId);
  };

  public func removePendingBidDeposit(
    state : MarketplaceBidState,
    listingId : Types.ListingId,
  ) : ?Types.PendingBidDeposit {
    let current = Map.get(state.pendingBidDeposits, Nat.compare, listingId);
    Map.remove(state.pendingBidDeposits, Nat.compare, listingId);
    current;
  };

  public func queueAuctionRefund(
    state : MarketplacePaymentState,
    escrow : Types.AuctionEscrow,
  ) {
    Map.add(state.pendingRefunds, Nat.compare, escrow.escrowId, escrow);
  };

  public func removePendingRefund(
    state : MarketplacePaymentState,
    escrowId : Nat,
  ) : ?Types.AuctionEscrow {
    let current = Map.get(state.pendingRefunds, Nat.compare, escrowId);
    Map.remove(state.pendingRefunds, Nat.compare, escrowId);
    current;
  };

  public func getPendingRefund(
    state : MarketplacePaymentState,
    escrowId : Nat,
  ) : ?Types.AuctionEscrow {
    Map.get(state.pendingRefunds, Nat.compare, escrowId);
  };

  public func getPendingRefundJournal(
    state : MarketplaceRefundState,
    escrowId : Nat,
  ) : ?Types.PendingAuctionRefund {
    Map.get(state.refundJournals, Nat.compare, escrowId);
  };

  public func putPendingRefundJournal(
    state : MarketplaceRefundState,
    pending : Types.PendingAuctionRefund,
  ) {
    Map.add(state.refundJournals, Nat.compare, pending.escrow.escrowId, pending);
  };

  public func removePendingRefundJournal(
    state : MarketplaceRefundState,
    escrowId : Nat,
  ) : ?Types.PendingAuctionRefund {
    let current = Map.get(state.refundJournals, Nat.compare, escrowId);
    Map.remove(state.refundJournals, Nat.compare, escrowId);
    current;
  };

  public func findPendingAuctionEscrow(
    state : MarketplacePaymentState,
    listingId : Types.ListingId,
    bidder : Types.UserId,
    amount : Nat64,
  ) : ?Types.AuctionEscrow {
    for ((_, escrow) in Map.entries(state.pendingRefunds)) {
      if (
        escrow.listingId == listingId and
        Principal.equal(escrow.bidder, bidder) and
        escrow.amount == amount
      ) {
        return ?escrow;
      };
    };
    null;
  };

  public func getPendingRefundsByBidder(
    state : MarketplacePaymentState,
    bidder : Types.UserId,
  ) : [Types.AuctionEscrow] {
    var refunds : [Types.AuctionEscrow] = [];
    for ((_, escrow) in Map.entries(state.pendingRefunds)) {
      if (Principal.equal(escrow.bidder, bidder)) {
        refunds := Array.concat<Types.AuctionEscrow>(refunds, [escrow]);
      };
    };
    refunds;
  };

  public func listFixedPurchaseSettlements(
    state : MarketplaceSettlementState
  ) : [Types.FixedPurchaseSettlement] {
    var settlements : [Types.FixedPurchaseSettlement] = [];
    for ((_, settlement) in Map.entries(state.fixedPurchaseSettlements)) {
      settlements := Array.concat<Types.FixedPurchaseSettlement>(settlements, [settlement]);
    };
    settlements;
  };

  public func listAuctionSettlements(
    state : MarketplaceSettlementState
  ) : [Types.AuctionSettlement] {
    var settlements : [Types.AuctionSettlement] = [];
    for ((_, settlement) in Map.entries(state.auctionSettlements)) {
      settlements := Array.concat<Types.AuctionSettlement>(settlements, [settlement]);
    };
    settlements;
  };

  public func listNoBidAuctionReturns(
    state : NoBidAuctionReturnState
  ) : [Types.NoBidAuctionReturnSettlement] {
    var settlements : [Types.NoBidAuctionReturnSettlement] = [];
    for ((_, settlement) in Map.entries(state.returns)) {
      settlements := Array.concat<Types.NoBidAuctionReturnSettlement>(settlements, [settlement]);
    };
    settlements;
  };

  public func listListingReturns(
    state : ListingReturnState
  ) : [Types.ListingReturnSettlement] {
    var settlements : [Types.ListingReturnSettlement] = [];
    for ((_, settlement) in Map.entries(state.returns)) {
      settlements := Array.concat<Types.ListingReturnSettlement>(settlements, [settlement]);
    };
    settlements;
  };

  public func listPendingBidDeposits(
    state : MarketplaceBidState
  ) : [Types.PendingBidDeposit] {
    var deposits : [Types.PendingBidDeposit] = [];
    for ((_, pending) in Map.entries(state.pendingBidDeposits)) {
      deposits := Array.concat<Types.PendingBidDeposit>(deposits, [pending]);
    };
    deposits;
  };

  public func listPendingRefunds(
    state : MarketplacePaymentState
  ) : [Types.AuctionEscrow] {
    var refunds : [Types.AuctionEscrow] = [];
    for ((_, escrow) in Map.entries(state.pendingRefunds)) {
      refunds := Array.concat<Types.AuctionEscrow>(refunds, [escrow]);
    };
    refunds;
  };

  public func listRefundJournals(
    state : MarketplaceRefundState
  ) : [Types.PendingAuctionRefund] {
    var refunds : [Types.PendingAuctionRefund] = [];
    for ((_, pending) in Map.entries(state.refundJournals)) {
      refunds := Array.concat<Types.PendingAuctionRefund>(refunds, [pending]);
    };
    refunds;
  };

  public func listListingLocks(
    state : MarketplacePaymentState
  ) : [Types.ListingId] {
    var locks : [Types.ListingId] = [];
    for ((listingId, _) in Map.entries(state.listingLocks)) {
      locks := Array.concat<Types.ListingId>(locks, [listingId]);
    };
    locks;
  };

  public func listUserPaymentLocks(
    state : MarketplaceUserPaymentLockState
  ) : [Principal] {
    var locks : [Principal] = [];
    for ((user, _) in Map.entries(state.userPaymentLocks)) {
      locks := Array.concat<Principal>(locks, [user]);
    };
    locks;
  };

  public func listListingTokenLocks(
    state : MarketplaceListingLockState
  ) : [Text] {
    var locks : [Text] = [];
    for ((key, _) in Map.entries(state.listingTokenLocks)) {
      locks := Array.concat<Text>(locks, [key]);
    };
    locks;
  };

  public func acquireListingLock(
    state : MarketplacePaymentState,
    listingId : Types.ListingId,
  ) : Bool {
    switch (Map.get(state.listingLocks, Nat.compare, listingId)) {
      case (?_) false;
      case null {
        Map.add(state.listingLocks, Nat.compare, listingId, true);
        true;
      };
    };
  };

  public func releaseListingLock(
    state : MarketplacePaymentState,
    listingId : Types.ListingId,
  ) {
    Map.remove(state.listingLocks, Nat.compare, listingId);
  };

  public func acquireUserPaymentLock(
    state : MarketplaceUserPaymentLockState,
    user : Principal,
  ) : Bool {
    switch (Map.get(state.userPaymentLocks, Principal.compare, user)) {
      case (?_) false;
      case null {
        Map.add(state.userPaymentLocks, Principal.compare, user, true);
        true;
      };
    };
  };

  public func releaseUserPaymentLock(
    state : MarketplaceUserPaymentLockState,
    user : Principal,
  ) {
    Map.remove(state.userPaymentLocks, Principal.compare, user);
  };

  public func listingTokenLockKey(
    collectionId : WalletTypes.CollectionId,
    tokenId : Text,
  ) : Text {
    Nat.toText(collectionId) # ":" # tokenId;
  };

  public func acquireListingTokenLock(
    state : MarketplaceListingLockState,
    collectionId : WalletTypes.CollectionId,
    tokenId : Text,
  ) : Bool {
    let key = listingTokenLockKey(collectionId, tokenId);
    switch (Map.get(state.listingTokenLocks, Text.compare, key)) {
      case (?_) false;
      case null {
        Map.add(state.listingTokenLocks, Text.compare, key, true);
        true;
      };
    };
  };

  public func releaseListingTokenLock(
    state : MarketplaceListingLockState,
    collectionId : WalletTypes.CollectionId,
    tokenId : Text,
  ) {
    Map.remove(state.listingTokenLocks, Text.compare, listingTokenLockKey(collectionId, tokenId));
  };

  public func createFixedListing(
    state : MarketplaceState,
    seller : Types.UserId,
    escrowedNFT : WalletTypes.WalletNFT,
    price : Nat64,
  ) : Types.FixedListing {
    switch (findActiveEscrowedNFT(state, escrowedNFT.collectionId, escrowedNFT.tokenId)) {
      case (?_) Runtime.trap("This NFT is already listed");
      case null {};
    };
    let id = state.nextId;
    state.nextId += 1;
    let listing : Types.FixedListing = {
      id;
      seller;
      nftId = escrowedNFT.id;
      price;
      status = #Active;
      createdAt = Time.now();
    };
    Map.add(state.fixedListings, Nat.compare, id, listing);
    Map.add(state.escrowedNFTs, Nat.compare, id, escrowedNFT);
    listing;
  };

  public func createAuctionListing(
    state : MarketplaceState,
    seller : Types.UserId,
    escrowedNFT : WalletTypes.WalletNFT,
    startingBid : Nat64,
    endTime : Types.Timestamp,
  ) : Types.AuctionListing {
    switch (findActiveEscrowedNFT(state, escrowedNFT.collectionId, escrowedNFT.tokenId)) {
      case (?_) Runtime.trap("This NFT is already listed");
      case null {};
    };
    let id = state.nextId;
    state.nextId += 1;
    let listing : Types.AuctionListing = {
      id;
      seller;
      nftId = escrowedNFT.id;
      startingBid;
      endTime;
      highestBidder = null;
      highestBid = 0;
      status = #Active;
      createdAt = Time.now();
    };
    Map.add(state.auctionListings, Nat.compare, id, listing);
    Map.add(state.escrowedNFTs, Nat.compare, id, escrowedNFT);
    listing;
  };

  public func getActiveListings(state : MarketplaceState) : [Types.ActiveListing] {
    var listings : [Types.ActiveListing] = [];
    for ((_, listing) in Map.entries(state.fixedListings)) {
      if (listing.status == #Active) {
        listings := Array.concat<Types.ActiveListing>(listings, [#Fixed(listing)]);
      };
    };
    for ((_, listing) in Map.entries(state.auctionListings)) {
      if (listing.status == #Active) {
        listings := Array.concat<Types.ActiveListing>(listings, [#Auction(listing)]);
      };
    };
    listings;
  };

  public func getAvailableActiveListings(
    state : MarketplaceState,
    settlementState : MarketplaceSettlementState,
    noBidReturnState : NoBidAuctionReturnState,
    listingReturnState : ListingReturnState,
  ) : [Types.ActiveListing] {
    var listings : [Types.ActiveListing] = [];
    for ((listingId, listing) in Map.entries(state.fixedListings)) {
      if (
        listing.status == #Active and
        not isListingSettling(settlementState, listingId) and
        not isListingReturning(listingReturnState, listingId)
      ) {
        listings := Array.concat<Types.ActiveListing>(listings, [#Fixed(listing)]);
      };
    };
    for ((listingId, listing) in Map.entries(state.auctionListings)) {
      if (
        listing.status == #Active and
        not isListingSettling(settlementState, listingId) and
        not isNoBidAuctionReturning(noBidReturnState, listingId) and
        not isListingReturning(listingReturnState, listingId)
      ) {
        listings := Array.concat<Types.ActiveListing>(listings, [#Auction(listing)]);
      };
    };
    listings;
  };

  public func getActiveListingDetails(state : MarketplaceState) : [Types.ActiveListingDetail] {
    var listings : [Types.ActiveListingDetail] = [];
    for ((listingId, listing) in Map.entries(state.fixedListings)) {
      if (listing.status == #Active) {
        switch (Map.get(state.escrowedNFTs, Nat.compare, listingId)) {
          case (?nft) {
            listings := Array.concat<Types.ActiveListingDetail>(
              listings,
              [{ listing = #Fixed(listing); nft }],
            );
          };
          case null {};
        };
      };
    };
    for ((listingId, listing) in Map.entries(state.auctionListings)) {
      if (listing.status == #Active) {
        switch (Map.get(state.escrowedNFTs, Nat.compare, listingId)) {
          case (?nft) {
            listings := Array.concat<Types.ActiveListingDetail>(
              listings,
              [{ listing = #Auction(listing); nft }],
            );
          };
          case null {};
        };
      };
    };
    listings;
  };

  public func getAvailableActiveListingDetails(
    state : MarketplaceState,
    settlementState : MarketplaceSettlementState,
    noBidReturnState : NoBidAuctionReturnState,
    listingReturnState : ListingReturnState,
  ) : [Types.ActiveListingDetail] {
    var listings : [Types.ActiveListingDetail] = [];
    for ((listingId, listing) in Map.entries(state.fixedListings)) {
      if (
        listing.status == #Active and
        not isListingSettling(settlementState, listingId) and
        not isListingReturning(listingReturnState, listingId)
      ) {
        switch (Map.get(state.escrowedNFTs, Nat.compare, listingId)) {
          case (?nft) {
            listings := Array.concat<Types.ActiveListingDetail>(
              listings,
              [{ listing = #Fixed(listing); nft }],
            );
          };
          case null {};
        };
      };
    };
    for ((listingId, listing) in Map.entries(state.auctionListings)) {
      if (
        listing.status == #Active and
        not isListingSettling(settlementState, listingId) and
        not isNoBidAuctionReturning(noBidReturnState, listingId) and
        not isListingReturning(listingReturnState, listingId)
      ) {
        switch (Map.get(state.escrowedNFTs, Nat.compare, listingId)) {
          case (?nft) {
            listings := Array.concat<Types.ActiveListingDetail>(
              listings,
              [{ listing = #Auction(listing); nft }],
            );
          };
          case null {};
        };
      };
    };
    listings;
  };

  public func getAvailableActiveListingsPage(
    state : MarketplaceState,
    settlementState : MarketplaceSettlementState,
    noBidReturnState : NoBidAuctionReturnState,
    listingReturnState : ListingReturnState,
    cursor : Nat,
    limit : Nat,
  ) : Types.ActiveListingPage {
    let pageSize = if (limit == 0) 1 else limit;
    var listings : [Types.ActiveListing] = [];
    var totalCount : Nat = 0;
    var added : Nat = 0;

    for ((listingId, listing) in Map.entries(state.fixedListings)) {
      if (
        listing.status == #Active and
        not isListingSettling(settlementState, listingId) and
        not isListingReturning(listingReturnState, listingId)
      ) {
        if (totalCount >= cursor and added < pageSize) {
          listings := Array.concat<Types.ActiveListing>(listings, [#Fixed(listing)]);
          added += 1;
        };
        totalCount += 1;
      };
    };
    for ((listingId, listing) in Map.entries(state.auctionListings)) {
      if (
        listing.status == #Active and
        not isListingSettling(settlementState, listingId) and
        not isNoBidAuctionReturning(noBidReturnState, listingId) and
        not isListingReturning(listingReturnState, listingId)
      ) {
        if (totalCount >= cursor and added < pageSize) {
          listings := Array.concat<Types.ActiveListing>(listings, [#Auction(listing)]);
          added += 1;
        };
        totalCount += 1;
      };
    };

    let next = cursor + added;
    {
      listings;
      nextCursor = if (next < totalCount) ?next else null;
      totalCount;
    };
  };

  public func getAvailableActiveListingDetailsPage(
    state : MarketplaceState,
    settlementState : MarketplaceSettlementState,
    noBidReturnState : NoBidAuctionReturnState,
    listingReturnState : ListingReturnState,
    cursor : Nat,
    limit : Nat,
  ) : Types.ActiveListingDetailPage {
    let pageSize = if (limit == 0) 1 else limit;
    var details : [Types.ActiveListingDetail] = [];
    var totalCount : Nat = 0;
    var added : Nat = 0;

    for ((listingId, listing) in Map.entries(state.fixedListings)) {
      if (
        listing.status == #Active and
        not isListingSettling(settlementState, listingId) and
        not isListingReturning(listingReturnState, listingId)
      ) {
        switch (Map.get(state.escrowedNFTs, Nat.compare, listingId)) {
          case (?nft) {
            if (totalCount >= cursor and added < pageSize) {
              details := Array.concat<Types.ActiveListingDetail>(
                details,
                [{ listing = #Fixed(listing); nft }],
              );
              added += 1;
            };
            totalCount += 1;
          };
          case null {};
        };
      };
    };
    for ((listingId, listing) in Map.entries(state.auctionListings)) {
      if (
        listing.status == #Active and
        not isListingSettling(settlementState, listingId) and
        not isNoBidAuctionReturning(noBidReturnState, listingId) and
        not isListingReturning(listingReturnState, listingId)
      ) {
        switch (Map.get(state.escrowedNFTs, Nat.compare, listingId)) {
          case (?nft) {
            if (totalCount >= cursor and added < pageSize) {
              details := Array.concat<Types.ActiveListingDetail>(
                details,
                [{ listing = #Auction(listing); nft }],
              );
              added += 1;
            };
            totalCount += 1;
          };
          case null {};
        };
      };
    };

    let next = cursor + added;
    {
      details;
      nextCursor = if (next < totalCount) ?next else null;
      totalCount;
    };
  };

  public func settleFixedListing(
    state : MarketplaceState,
    listingId : Types.ListingId,
  ) : ?Types.FixedListing {
    switch (Map.get(state.fixedListings, Nat.compare, listingId)) {
      case null null;
      case (?listing) {
        if (listing.status != #Active) return null;
        let updated : Types.FixedListing = { listing with status = #Sold };
        Map.remove(state.fixedListings, Nat.compare, listingId);
        ?updated;
      };
    };
  };

  public func placeBidAt(
    state : MarketplaceState,
    listingId : Types.ListingId,
    bidder : Types.UserId,
    amount : Nat64,
    bidObservedAt : Types.Timestamp,
  ) : ?Types.AuctionListing {
    switch (Map.get(state.auctionListings, Nat.compare, listingId)) {
      case null null;
      case (?listing) {
        if (listing.status != #Active) return null;
        let minimum = nextMinimumAuctionBid(listing);
        if (amount < minimum) return null;
        let updatedEndTime = extendedAuctionEndTimeAfterBid(listing, bidObservedAt);
        let updated : Types.AuctionListing = {
          listing with
          highestBidder = ?bidder;
          highestBid = amount;
          endTime = updatedEndTime;
        };
        Map.add(state.auctionListings, Nat.compare, listingId, updated);
        let history = switch (Map.get(state.bids, Nat.compare, listingId)) {
          case (?existing) existing;
          case null [];
        };
        Map.add(
          state.bids,
          Nat.compare,
          listingId,
          Array.concat<Types.Bid>(
            history,
            [
              {
                listingId;
                bidder;
                amount;
                placedAt = bidObservedAt;
              },
            ],
          ),
        );
        ?updated;
      };
    };
  };

  public func placeBid(
    state : MarketplaceState,
    listingId : Types.ListingId,
    bidder : Types.UserId,
    amount : Nat64,
  ) : ?Types.AuctionListing {
    placeBidAt(state, listingId, bidder, amount, Time.now());
  };

  public func settleAuction(
    state : MarketplaceState,
    listingId : Types.ListingId,
  ) : ?Types.AuctionListing {
    switch (Map.get(state.auctionListings, Nat.compare, listingId)) {
      case null null;
      case (?listing) {
        if (listing.status != #Active or Time.now() < listing.endTime) return null;
        let updated : Types.AuctionListing = { listing with status = #Settled };
        Map.remove(state.auctionListings, Nat.compare, listingId);
        Map.remove(state.bids, Nat.compare, listingId);
        ?updated;
      };
    };
  };

  public func cancelListing(
    state : MarketplaceState,
    listingId : Types.ListingId,
  ) : ?Types.ActiveListing {
    switch (Map.get(state.fixedListings, Nat.compare, listingId)) {
      case (?listing) {
        if (listing.status != #Active) return null;
        let updated : Types.FixedListing = { listing with status = #Cancelled };
        Map.remove(state.fixedListings, Nat.compare, listingId);
        return ?#Fixed(updated);
      };
      case null {};
    };
    switch (Map.get(state.auctionListings, Nat.compare, listingId)) {
      case (?listing) {
        if (listing.status != #Active) return null;
        let updated : Types.AuctionListing = { listing with status = #Cancelled };
        Map.remove(state.auctionListings, Nat.compare, listingId);
        Map.remove(state.bids, Nat.compare, listingId);
        return ?#Auction(updated);
      };
      case null {};
    };
    null;
  };

  public func getFixedListing(
    state : MarketplaceState,
    listingId : Types.ListingId,
  ) : ?Types.FixedListing {
    Map.get(state.fixedListings, Nat.compare, listingId);
  };

  public func getAuctionListing(
    state : MarketplaceState,
    listingId : Types.ListingId,
  ) : ?Types.AuctionListing {
    Map.get(state.auctionListings, Nat.compare, listingId);
  };

  public func getAuctionBidStatus(
    state : MarketplaceState,
    listingId : Types.ListingId,
    bidder : Types.UserId,
  ) : ?Types.AuctionBidStatus {
    switch (Map.get(state.auctionListings, Nat.compare, listingId)) {
      case null null;
      case (?listing) {
        var hasBid = false;
        var myHighestBid : ?Nat64 = null;

        switch (Map.get(state.bids, Nat.compare, listingId)) {
          case null {};
          case (?history) {
            for (bid in history.values()) {
              if (Principal.equal(bid.bidder, bidder)) {
                hasBid := true;
                switch (myHighestBid) {
                  case null {
                    myHighestBid := ?bid.amount;
                  };
                  case (?current) {
                    if (bid.amount > current) {
                      myHighestBid := ?bid.amount;
                    };
                  };
                };
              };
            };
          };
        };

        let isWinning = switch (listing.highestBidder) {
          case null false;
          case (?winner) Principal.equal(winner, bidder);
        };

        ?{
          listingId;
          hasBid;
          isWinning;
          highestBidder = listing.highestBidder;
          highestBid = listing.highestBid;
          myHighestBid;
        };
      };
    };
  };

  public func getEscrowedNFT(
    state : MarketplaceState,
    listingId : Types.ListingId,
  ) : ?WalletTypes.WalletNFT {
    Map.get(state.escrowedNFTs, Nat.compare, listingId);
  };

  public func getActiveEscrowedNFTsBySeller(
    state : MarketplaceState,
    seller : Types.UserId,
  ) : [WalletTypes.WalletNFT] {
    var nfts : [WalletTypes.WalletNFT] = [];
    for ((listingId, listing) in Map.entries(state.fixedListings)) {
      if (listing.status == #Active and Principal.equal(listing.seller, seller)) {
        switch (Map.get(state.escrowedNFTs, Nat.compare, listingId)) {
          case (?nft) {
            nfts := Array.concat<WalletTypes.WalletNFT>(nfts, [nft]);
          };
          case null {};
        };
      };
    };
    for ((listingId, listing) in Map.entries(state.auctionListings)) {
      if (listing.status == #Active and Principal.equal(listing.seller, seller)) {
        switch (Map.get(state.escrowedNFTs, Nat.compare, listingId)) {
          case (?nft) {
            nfts := Array.concat<WalletTypes.WalletNFT>(nfts, [nft]);
          };
          case null {};
        };
      };
    };
    nfts;
  };

  public func getActiveEscrowedNFTsByCollection(
    state : MarketplaceState,
    collectionId : WalletTypes.CollectionId,
  ) : [WalletTypes.WalletNFT] {
    var nfts : [WalletTypes.WalletNFT] = [];
    for ((listingId, listing) in Map.entries(state.fixedListings)) {
      if (listing.status == #Active) {
        switch (Map.get(state.escrowedNFTs, Nat.compare, listingId)) {
          case (?nft) {
            if (nft.collectionId == collectionId) {
              nfts := Array.concat<WalletTypes.WalletNFT>(nfts, [nft]);
            };
          };
          case null {};
        };
      };
    };
    for ((listingId, listing) in Map.entries(state.auctionListings)) {
      if (listing.status == #Active) {
        switch (Map.get(state.escrowedNFTs, Nat.compare, listingId)) {
          case (?nft) {
            if (nft.collectionId == collectionId) {
              nfts := Array.concat<WalletTypes.WalletNFT>(nfts, [nft]);
            };
          };
          case null {};
        };
      };
    };
    nfts;
  };

  public func getActiveEscrowedNFTsBySellerAndCollection(
    state : MarketplaceState,
    seller : Types.UserId,
    collectionId : WalletTypes.CollectionId,
  ) : [WalletTypes.WalletNFT] {
    var nfts : [WalletTypes.WalletNFT] = [];
    for (nft in getActiveEscrowedNFTsBySeller(state, seller).values()) {
      if (nft.collectionId == collectionId) {
        nfts := Array.concat<WalletTypes.WalletNFT>(nfts, [nft]);
      };
    };
    nfts;
  };

  public func findActiveEscrowedNFT(
    state : MarketplaceState,
    collectionId : WalletTypes.CollectionId,
    tokenId : Text,
  ) : ?WalletTypes.WalletNFT {
    label searchFixed for ((listingId, listing) in Map.entries(state.fixedListings)) {
      if (listing.status != #Active) {
        continue searchFixed;
      };
      switch (Map.get(state.escrowedNFTs, Nat.compare, listingId)) {
        case (?nft) {
          if (nft.collectionId == collectionId and nft.tokenId == tokenId) {
            return ?nft;
          };
        };
        case null {};
      };
    };
    label searchAuction for ((listingId, listing) in Map.entries(state.auctionListings)) {
      if (listing.status != #Active) {
        continue searchAuction;
      };
      switch (Map.get(state.escrowedNFTs, Nat.compare, listingId)) {
        case (?nft) {
          if (nft.collectionId == collectionId and nft.tokenId == tokenId) {
            return ?nft;
          };
        };
        case null {};
      };
    };
    null;
  };

  public func takeEscrowedNFT(
    state : MarketplaceState,
    listingId : Types.ListingId,
  ) : ?WalletTypes.WalletNFT {
    let escrowedNFT = Map.get(state.escrowedNFTs, Nat.compare, listingId);
    switch (escrowedNFT) {
      case null null;
      case (?nft) {
        Map.remove(state.escrowedNFTs, Nat.compare, listingId);
        ?nft;
      };
    };
  };

  public func clearListingsForToken(
    state : MarketplaceState,
    collectionId : WalletTypes.CollectionId,
    tokenId : Text,
  ) : Nat {
    var listingIds : [Types.ListingId] = [];
    for ((listingId, nft) in Map.entries(state.escrowedNFTs)) {
      if (nft.collectionId == collectionId and nft.tokenId == tokenId) {
        let fixedActive = switch (Map.get(state.fixedListings, Nat.compare, listingId)) {
          case (?listing) listing.status == #Active;
          case null false;
        };
        let auctionActive = switch (Map.get(state.auctionListings, Nat.compare, listingId)) {
          case (?listing) listing.status == #Active;
          case null false;
        };
        if (not fixedActive and not auctionActive) {
          listingIds := appendListingId(listingIds, listingId);
        };
      };
    };
    for (listingId in listingIds.values()) {
      Map.remove(state.fixedListings, Nat.compare, listingId);
      Map.remove(state.auctionListings, Nat.compare, listingId);
      Map.remove(state.bids, Nat.compare, listingId);
      Map.remove(state.escrowedNFTs, Nat.compare, listingId);
    };
    listingIds.size();
  };

  func appendListingId(
    listingIds : [Types.ListingId],
    listingId : Types.ListingId,
  ) : [Types.ListingId] {
    for (existing in listingIds.values()) {
      if (existing == listingId) {
        return listingIds;
      };
    };
    Array.concat<Types.ListingId>(listingIds, [listingId]);
  };
};
