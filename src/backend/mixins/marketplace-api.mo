import MarketplaceLib "../lib/marketplace";
import WalletLib "../lib/wallet";
import IcpLib "../lib/icp";
import MintLib "../lib/mint";
import AuthLib "../lib/auth";
import CollectionsLib "../lib/collections";
import MarketplaceTypes "../types/marketplace";
import WalletTypes "../types/wallet";
import CollectionTypes "../types/collections";
import CommonTypes "../types/common";
import Array "mo:core/Array";
import Blob "mo:core/Blob";
import Error "mo:core/Error";
import Int "mo:core/Int";
import Runtime "mo:core/Runtime";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Nat64 "mo:core/Nat64";

mixin (
  marketplaceState : MarketplaceLib.MarketplaceState,
  marketplacePaymentState : MarketplaceLib.MarketplacePaymentState,
  marketplaceRefundState : MarketplaceLib.MarketplaceRefundState,
  marketplaceUserPaymentLockState : MarketplaceLib.MarketplaceUserPaymentLockState,
  marketplaceListingLockState : MarketplaceLib.MarketplaceListingLockState,
  marketplaceSettlementState : MarketplaceLib.MarketplaceSettlementState,
  marketplaceNoBidAuctionReturnState : MarketplaceLib.NoBidAuctionReturnState,
  marketplaceListingReturnState : MarketplaceLib.ListingReturnState,
  marketplaceBidState : MarketplaceLib.MarketplaceBidState,
  marketplaceFeeState : MarketplaceLib.MarketplaceFeeState,
  walletState : WalletLib.WalletState,
  mintState : MintLib.MintState,
  collectionsState : CollectionsLib.CollectionsState,
  authState : AuthLib.AdminState,
  canisterId : Principal,
) {
  type MarketplaceChildTransferResult = {
    #ok : Nat;
    #err : Text;
  };

  type MarketplaceTransferBlockResult = {
    #ok : Nat64;
    #badFee : Nat64;
    #insufficientFunds : Nat64;
    #tooOld;
    #createdInFuture;
  };

  type MarketplaceICRC7Account = {
    owner : Principal;
    subaccount : ?Blob;
  };

  type MarketplaceChildCollectionActor = actor {
    mintlab_transfer_from : (Principal, Principal, Nat) -> async MarketplaceChildTransferResult;
    mintlab_owner_of : ([Nat]) -> async [?MarketplaceICRC7Account];
  };

  func requireMarketplaceAdmin(caller : Principal) {
    if (Principal.isAnonymous(caller)) Runtime.trap("Anonymous caller not allowed");
    if (not AuthLib.isAdmin(authState, caller)) Runtime.trap("Unauthorized: admin only");
  };

  func validateMarketplaceFeeRecipient(recipient : ?MarketplaceTypes.AccountIdentifier) {
    switch (recipient) {
      case (?account) {
        if (account.size() != 32) {
          Runtime.trap("Mintlab sales fee account must be a 32-byte ICP account identifier");
        };
      };
      case null {};
    };
  };

  func validateMintlabFeeBasisPoints(basisPoints : Nat) {
    if (basisPoints == 0 or basisPoints >= MarketplaceLib.BASIS_POINTS_DENOMINATOR) {
      Runtime.trap("Mintlab sales fee must be between 0.01% and 99.99%");
    };
  };

  func ensureMintlabFeeApplies(amount : Nat64, valueLabel : Text) {
    if (MarketplaceLib.mintlabFee(marketplaceFeeState, amount) == 0) {
      Runtime.trap(valueLabel # " is too low to apply the Mintlab marketplace fee");
    };
  };

  func configuredFeeRecipientForAmount(amount : Nat64) : ?MarketplaceTypes.AccountIdentifier {
    if (MarketplaceLib.mintlabFee(marketplaceFeeState, amount) == 0) {
      return null;
    };
    switch (marketplacePaymentState.mintlabFeeRecipient) {
      case null Runtime.trap("Mintlab sales fee account must be configured before marketplace sales are enabled");
      case (?account) ?account;
    };
  };

  func ledgerTimestampNow() : Nat64 {
    Nat64.fromNat(Int.abs(Time.now()));
  };

  func transferBlockResult(result : CommonTypes.TransferResult) : MarketplaceTransferBlockResult {
    switch (result) {
      case (#Ok(blockIndex)) #ok(blockIndex);
      case (#Err(#TxDuplicate({ duplicate_of }))) #ok(duplicate_of);
      case (#Err(#BadFee({ expected_fee }))) #badFee(expected_fee.e8s);
      case (#Err(#InsufficientFunds({ balance }))) #insufficientFunds(balance.e8s);
      case (#Err(#TxTooOld(_))) #tooOld;
      case (#Err(#TxCreatedInFuture)) #createdInFuture;
    };
  };

  func persistFixedPurchaseSettlementAndTrap(
    settlement : MarketplaceTypes.FixedPurchaseSettlement,
    message : Text,
  ) : async* () {
    try {
      Runtime.trap(message);
    } finally {
      MarketplaceLib.putFixedPurchaseSettlement(marketplaceSettlementState, settlement);
    };
  };

  func persistAuctionSettlementAndTrap(
    settlement : MarketplaceTypes.AuctionSettlement,
    message : Text,
  ) : async* () {
    try {
      Runtime.trap(message);
    } finally {
      MarketplaceLib.putAuctionSettlement(marketplaceSettlementState, settlement);
    };
  };

  func persistPendingBidDepositAndTrap(
    pending : MarketplaceTypes.PendingBidDeposit,
    message : Text,
  ) : async* () {
    try {
      Runtime.trap(message);
    } finally {
      MarketplaceLib.putPendingBidDeposit(marketplaceBidState, pending);
    };
  };

  func acquireUserPaymentLockOrTrap(user : Principal) {
    if (not MarketplaceLib.acquireUserPaymentLock(marketplaceUserPaymentLockState, user)) {
      Runtime.trap("Another ICP operation is already using this account balance. Try again shortly.");
    };
  };

  func releaseMarketplaceUserPaymentLock(lockOwner : ?Principal) {
    switch (lockOwner) {
      case null {};
      case (?user) {
        MarketplaceLib.releaseUserPaymentLock(marketplaceUserPaymentLockState, user);
      };
    };
  };

  func ensureNFTListableByCaller(nft : WalletTypes.WalletNFT, caller : Principal) {
    if (not Principal.equal(nft.owner, caller)) {
      Runtime.trap("Unauthorized: caller does not own this NFT");
    };
    if (nft.location == #Registered) {
      Runtime.trap("Only vaulted or in-app minted NFTs can be listed");
    };
  };

  func ensureNoActiveListingForNFT(nft : WalletTypes.WalletNFT) {
    switch (MarketplaceLib.findActiveEscrowedNFT(marketplaceState, nft.collectionId, nft.tokenId)) {
      case (?_) Runtime.trap("This NFT is already listed");
      case null {};
    };
  };

  func recheckWalletNFTForListing(
    nftId : MarketplaceTypes.NFTId,
    expectedNFT : WalletTypes.WalletNFT,
    caller : Principal,
  ) : WalletTypes.WalletNFT {
    let currentNFT = switch (WalletLib.getNFT(walletState, nftId)) {
      case null Runtime.trap("NFT is no longer available in your wallet");
      case (?value) value;
    };
    if (currentNFT.collectionId != expectedNFT.collectionId or currentNFT.tokenId != expectedNFT.tokenId) {
      Runtime.trap("NFT changed while listing was in progress");
    };
    ensureNFTListableByCaller(currentNFT, caller);
    currentNFT;
  };

  func minimumAuctionDurationNanos() : Int {
    3_600_000_000_000; // 1 hour
  };

  func maximumAuctionDurationNanos() : Int {
    30 * 86_400_000_000_000; // 30 days
  };

  func auctionDurationToleranceNanos() : Int {
    120_000_000_000; // allow 1-hour UI submissions to survive network latency
  };

  func validateAuctionEndTime(endTime : Int) {
    let now = Time.now();
    if (endTime <= now) Runtime.trap("End time must be in the future");
    if (endTime + auctionDurationToleranceNanos() < now + minimumAuctionDurationNanos()) {
      Runtime.trap("Auction duration must be at least 1 hour");
    };
    if (endTime > now + maximumAuctionDurationNanos()) {
      Runtime.trap("Auction duration cannot exceed 30 days");
    };
  };

  func auctionEscrowMatchesPending(
    escrow : MarketplaceTypes.AuctionEscrow,
    pending : MarketplaceTypes.PendingBidDeposit,
    depositedBlock : Nat64,
  ) : Bool {
    escrow.escrowId == pending.escrowId and
    escrow.listingId == pending.listingId and
    Principal.equal(escrow.bidder, pending.bidder) and
    escrow.amount == pending.amount and
    escrow.depositedBlock == depositedBlock;
  };

  func auctionListingHasPendingBid(
    listing : MarketplaceTypes.AuctionListing,
    pending : MarketplaceTypes.PendingBidDeposit,
  ) : Bool {
    if (listing.highestBid != pending.amount) return false;
    switch (listing.highestBidder) {
      case (?bidder) Principal.equal(bidder, pending.bidder);
      case null false;
    };
  };

  func settlementPayoutDebit(amount : Nat64, mintlabFee : Nat64, ledgerFeeE8s : Nat64) : Nat64 {
    let transferCount : Nat = if (mintlabFee > 0) 2 else 1;
    Nat64.fromNat(Nat64.toNat(amount) + (Nat64.toNat(ledgerFeeE8s) * transferCount));
  };

  func refundRemainingEscrowBalanceToUser(
    ledger : IcpLib.Ledger,
    escrowSub : Blob,
    recipient : Principal,
    memo : Nat64,
    context : Text,
  ) : async* () {
    let escrowAccount = IcpLib.accountIdentifier(canisterId, escrowSub);
    let escrowBalance = await* IcpLib.getBalance(ledger, escrowAccount);
    let currentFee = await* IcpLib.getTransferFee(ledger);
    if (escrowBalance <= currentFee) {
      return;
    };
    let recipientSub = IcpLib.principalToSubaccount(recipient);
    let recipientAccount = IcpLib.accountIdentifier(canisterId, recipientSub);
    let refundResult = await* IcpLib.transferOutWithFeeAt(
      ledger,
      ?escrowSub,
      recipientAccount,
      escrowBalance - currentFee,
      memo,
      currentFee,
      ledgerTimestampNow(),
    );
    switch (transferBlockResult(refundResult)) {
      case (#ok(_)) {};
      case (#badFee(_)) Runtime.trap(context # " fee-reserve refund failed: ledger fee changed; retry settlement");
      case (#insufficientFunds(_)) Runtime.trap(context # " fee-reserve refund failed: escrow balance changed; retry settlement");
      case (#tooOld) Runtime.trap(context # " fee-reserve refund timestamp expired; retry settlement");
      case (#createdInFuture) Runtime.trap(context # " fee-reserve refund timestamp was in the future; retry settlement");
    };
  };

  /// List an NFT at a fixed price; caller must own the NFT (escrow transfer happens here)
  public shared ({ caller }) func createFixedListing(
    nftId : MarketplaceTypes.NFTId,
    price : Nat64,
  ) : async MarketplaceTypes.FixedListing {
    if (Principal.isAnonymous(caller)) Runtime.trap("Anonymous caller not allowed");
    if (price == 0) Runtime.trap("Price must be greater than zero");
    ensureMintlabFeeApplies(price, "Price");
    ignore configuredFeeRecipientForAmount(price);
    let nft = switch (WalletLib.getNFT(walletState, nftId)) {
      case null Runtime.trap("NFT not found");
      case (?n) n;
    };
    ensureNFTListableByCaller(nft, caller);
    if (not MarketplaceLib.acquireListingTokenLock(marketplaceListingLockState, nft.collectionId, nft.tokenId)) {
      Runtime.trap("This NFT is already being listed. Try again shortly.");
    };
    try {
      ensureNoActiveListingForNFT(nft);
      await* prepareNFTForListing(nft, caller);
      let currentNFT = recheckWalletNFTForListing(nftId, nft, caller);
      ensureNoActiveListingForNFT(currentNFT);
      WalletLib.removeNFT(walletState, nftId, caller);
      MarketplaceLib.createFixedListing(marketplaceState, caller, currentNFT, price);
    } finally {
      MarketplaceLib.releaseListingTokenLock(marketplaceListingLockState, nft.collectionId, nft.tokenId);
    };
  };

  /// List an NFT for timed auction; caller must own the NFT (escrow transfer happens here)
  public shared ({ caller }) func createAuctionListing(
    nftId : MarketplaceTypes.NFTId,
    startingBid : Nat64,
    endTime : Int,
  ) : async MarketplaceTypes.AuctionListing {
    if (Principal.isAnonymous(caller)) Runtime.trap("Anonymous caller not allowed");
    if (startingBid < MarketplaceLib.MIN_AUCTION_STARTING_BID_E8S) {
      Runtime.trap("Starting bid must be at least 0.01 ICP");
    };
    ensureMintlabFeeApplies(startingBid, "Starting bid");
    ignore configuredFeeRecipientForAmount(startingBid);
    validateAuctionEndTime(endTime);
    let nft = switch (WalletLib.getNFT(walletState, nftId)) {
      case null Runtime.trap("NFT not found");
      case (?n) n;
    };
    ensureNFTListableByCaller(nft, caller);
    if (not MarketplaceLib.acquireListingTokenLock(marketplaceListingLockState, nft.collectionId, nft.tokenId)) {
      Runtime.trap("This NFT is already being listed. Try again shortly.");
    };
    try {
      ensureNoActiveListingForNFT(nft);
      await* prepareNFTForListing(nft, caller);
      let currentNFT = recheckWalletNFTForListing(nftId, nft, caller);
      ensureNoActiveListingForNFT(currentNFT);
      WalletLib.removeNFT(walletState, nftId, caller);
      MarketplaceLib.createAuctionListing(marketplaceState, caller, currentNFT, startingBid, endTime);
    } finally {
      MarketplaceLib.releaseListingTokenLock(marketplaceListingLockState, nft.collectionId, nft.tokenId);
    };
  };

  /// Return all currently active listings (fixed + auction)
  public query func getActiveListings() : async [MarketplaceTypes.ActiveListing] {
    MarketplaceLib.getAvailableActiveListings(
      marketplaceState,
      marketplaceSettlementState,
      marketplaceNoBidAuctionReturnState,
      marketplaceListingReturnState,
    );
  };

  public query func getActiveListingDetails() : async [MarketplaceTypes.ActiveListingDetail] {
    MarketplaceLib.getAvailableActiveListingDetails(
      marketplaceState,
      marketplaceSettlementState,
      marketplaceNoBidAuctionReturnState,
      marketplaceListingReturnState,
    );
  };

  public shared query ({ caller }) func getMyAuctionBidStatuses(
    listingIds : [MarketplaceTypes.ListingId]
  ) : async [MarketplaceTypes.AuctionBidStatus] {
    if (Principal.isAnonymous(caller)) Runtime.trap("Anonymous caller not allowed");

    var statuses : [MarketplaceTypes.AuctionBidStatus] = [];
    for (listingId in listingIds.values()) {
      switch (MarketplaceLib.getAuctionBidStatus(marketplaceState, listingId, caller)) {
        case null {};
        case (?status) {
          statuses := Array.concat<MarketplaceTypes.AuctionBidStatus>(statuses, [status]);
        };
      };
    };
    statuses;
  };

  public func getMarketplaceFeeConfig() : async MarketplaceTypes.MarketplaceFeeConfig {
    let ledger = actor (IcpLib.LEDGER_CANISTER_ID) : IcpLib.Ledger;
    let feeE8s = await* IcpLib.getTransferFee(ledger);
    MarketplaceLib.getFeeConfig(marketplacePaymentState, marketplaceFeeState, feeE8s);
  };

  public shared ({ caller }) func configureMarketplaceFee(
    recipient : ?MarketplaceTypes.AccountIdentifier,
    mintlabFeeBasisPoints : Nat,
  ) : async MarketplaceTypes.MarketplaceFeeConfig {
    requireMarketplaceAdmin(caller);
    validateMarketplaceFeeRecipient(recipient);
    validateMintlabFeeBasisPoints(mintlabFeeBasisPoints);
    MarketplaceLib.setMintlabFeeRecipient(marketplacePaymentState, recipient);
    MarketplaceLib.setMintlabFeeBasisPoints(marketplaceFeeState, mintlabFeeBasisPoints);
    await getMarketplaceFeeConfig();
  };

  public shared ({ caller }) func configureMarketplaceFeeRecipient(
    recipient : ?MarketplaceTypes.AccountIdentifier
  ) : async MarketplaceTypes.MarketplaceFeeConfig {
    requireMarketplaceAdmin(caller);
    validateMarketplaceFeeRecipient(recipient);
    MarketplaceLib.setMintlabFeeRecipient(marketplacePaymentState, recipient);
    await getMarketplaceFeeConfig();
  };

  public shared ({ caller }) func getMyPendingAuctionRefunds() : async [MarketplaceTypes.AuctionEscrow] {
    if (Principal.isAnonymous(caller)) Runtime.trap("Anonymous caller not allowed");
    MarketplaceLib.getPendingRefundsByBidder(marketplacePaymentState, caller);
  };

  public shared ({ caller }) func retryAuctionRefund(escrowId : Nat) : async Bool {
    if (Principal.isAnonymous(caller)) Runtime.trap("Anonymous caller not allowed");
    let escrow = switch (MarketplaceLib.getPendingRefund(marketplacePaymentState, escrowId)) {
      case null Runtime.trap("Pending refund not found");
      case (?value) value;
    };
    let isCallerAdmin = AuthLib.isAdmin(authState, caller);
    if (not Principal.equal(escrow.bidder, caller) and not isCallerAdmin) {
      Runtime.trap("Unauthorized: must be refund owner or admin");
    };
    let ledger = actor (IcpLib.LEDGER_CANISTER_ID) : IcpLib.Ledger;
    let feeE8s = await* IcpLib.getTransferFee(ledger);
    switch (await* refundAuctionEscrow(ledger, escrow, feeE8s)) {
      case (#ok(_)) true;
      case (#err(_)) false;
    };
  };

  public shared query ({ caller }) func adminListMarketplaceRecoveryState() : async MarketplaceTypes.MarketplaceRecoverySnapshot {
    requireMarketplaceAdmin(caller);
    {
      fixedSettlements = MarketplaceLib.listFixedPurchaseSettlements(marketplaceSettlementState);
      auctionSettlements = MarketplaceLib.listAuctionSettlements(marketplaceSettlementState);
      noBidReturns = MarketplaceLib.listNoBidAuctionReturns(marketplaceNoBidAuctionReturnState);
      listingReturns = MarketplaceLib.listListingReturns(marketplaceListingReturnState);
      pendingBids = MarketplaceLib.listPendingBidDeposits(marketplaceBidState);
      pendingRefunds = MarketplaceLib.listPendingRefunds(marketplacePaymentState);
      refundJournals = MarketplaceLib.listRefundJournals(marketplaceRefundState);
      activeListingLocks = MarketplaceLib.listListingLocks(marketplacePaymentState);
      activeUserPaymentLocks = MarketplaceLib.listUserPaymentLocks(marketplaceUserPaymentLockState);
      activeListingTokenLocks = MarketplaceLib.listListingTokenLocks(marketplaceListingLockState);
    };
  };

  public shared ({ caller }) func adminRetryFixedPurchaseSettlement(
    listingId : MarketplaceTypes.ListingId
  ) : async () {
    requireMarketplaceAdmin(caller);
    if (not MarketplaceLib.acquireListingLock(marketplacePaymentState, listingId)) {
      Runtime.trap("Listing is processing another payment. Try again shortly.");
    };
    var paymentLockOwner : ?Principal = null;
    try {
      let settlement = switch (MarketplaceLib.getFixedPurchaseSettlement(marketplaceSettlementState, listingId)) {
        case null Runtime.trap("Fixed purchase settlement not found");
        case (?value) value;
      };
      if (settlement.paymentBlock == null) {
        acquireUserPaymentLockOrTrap(settlement.buyer);
        paymentLockOwner := ?settlement.buyer;
      };
      await* continueFixedPurchaseSettlement(listingId);
    } finally {
      releaseMarketplaceUserPaymentLock(paymentLockOwner);
      MarketplaceLib.releaseListingLock(marketplacePaymentState, listingId);
    };
  };

  public shared ({ caller }) func adminRetryAuctionSettlement(
    listingId : MarketplaceTypes.ListingId
  ) : async () {
    requireMarketplaceAdmin(caller);
    if (not MarketplaceLib.acquireListingLock(marketplacePaymentState, listingId)) {
      Runtime.trap("Auction is processing another payment. Try again shortly.");
    };
    try {
      await* continueAuctionSettlement(listingId);
    } finally {
      MarketplaceLib.releaseListingLock(marketplacePaymentState, listingId);
    };
  };

  public shared ({ caller }) func adminRetryNoBidAuctionReturn(
    listingId : MarketplaceTypes.ListingId
  ) : async () {
    requireMarketplaceAdmin(caller);
    if (not MarketplaceLib.acquireListingLock(marketplacePaymentState, listingId)) {
      Runtime.trap("Auction is processing another payment. Try again shortly.");
    };
    try {
      await* continueNoBidAuctionReturnSettlement(listingId);
    } finally {
      MarketplaceLib.releaseListingLock(marketplacePaymentState, listingId);
    };
  };

  public shared ({ caller }) func adminRetryListingReturn(
    listingId : MarketplaceTypes.ListingId
  ) : async () {
    requireMarketplaceAdmin(caller);
    if (not MarketplaceLib.acquireListingLock(marketplacePaymentState, listingId)) {
      Runtime.trap("Listing is processing another return. Try again shortly.");
    };
    try {
      await* continueListingReturnSettlement(listingId);
    } finally {
      MarketplaceLib.releaseListingLock(marketplacePaymentState, listingId);
    };
  };

  /// Buy a fixed-price listing; ICP first moves into marketplace escrow, then settlement can be retried safely.
  public shared ({ caller }) func buyFixedListing(listingId : MarketplaceTypes.ListingId) : async () {
    if (Principal.isAnonymous(caller)) Runtime.trap("Anonymous caller not allowed");
    if (MarketplaceLib.isListingReturning(marketplaceListingReturnState, listingId)) {
      Runtime.trap("Listing is being cancelled and returned to the seller");
    };
    if (not MarketplaceLib.acquireListingLock(marketplacePaymentState, listingId)) {
      Runtime.trap("Listing is processing another payment. Try again shortly.");
    };
    var paymentLockOwner : ?Principal = null;
    try {
      switch (MarketplaceLib.getFixedPurchaseSettlement(marketplaceSettlementState, listingId)) {
        case null {
          acquireUserPaymentLockOrTrap(caller);
          paymentLockOwner := ?caller;
          ignore await* startFixedPurchaseSettlement(listingId, caller);
        };
        case (?settlement) {
          let isCallerAdmin = AuthLib.isAdmin(authState, caller);
          if (not Principal.equal(settlement.buyer, caller) and not isCallerAdmin) {
            Runtime.trap("This listing is already being settled by another buyer");
          };
          if (settlement.paymentBlock == null) {
            acquireUserPaymentLockOrTrap(settlement.buyer);
            paymentLockOwner := ?settlement.buyer;
          };
        };
      };
      await* continueFixedPurchaseSettlement(listingId);
    } finally {
      releaseMarketplaceUserPaymentLock(paymentLockOwner);
      MarketplaceLib.releaseListingLock(marketplacePaymentState, listingId);
    };
  };

  func startFixedPurchaseSettlement(
    listingId : MarketplaceTypes.ListingId,
    buyer : Principal,
  ) : async* MarketplaceTypes.FixedPurchaseSettlement {
    let listing = switch (MarketplaceLib.getFixedListing(marketplaceState, listingId)) {
      case null Runtime.trap("Listing not found");
      case (?l) l;
    };
    if (listing.status != #Active) Runtime.trap("Listing is not active");
    if (Principal.equal(listing.seller, buyer)) Runtime.trap("Seller cannot buy their own listing");
    let escrowedNFT = switch (MarketplaceLib.getEscrowedNFT(marketplaceState, listingId)) {
      case null Runtime.trap("Escrowed NFT not found for listing");
      case (?nft) nft;
    };
    await* ensureEscrowedNFTReady(escrowedNFT);

    let ledger = actor (IcpLib.LEDGER_CANISTER_ID) : IcpLib.Ledger;
    let ledgerFeeE8s = await* IcpLib.getTransferFee(ledger);
    let buyerSub = IcpLib.principalToSubaccount(buyer);
    let buyerAccount = IcpLib.accountIdentifier(canisterId, buyerSub);
    let requiredDebit = MarketplaceLib.totalFixedEscrowBuyerDebit(marketplaceFeeState, listing.price, ledgerFeeE8s);
    let buyerBalance = await* IcpLib.getBalance(ledger, buyerAccount);
    if (buyerBalance < requiredDebit) {
      Runtime.trap(
        "Insufficient ICP for purchase escrow and ledger fees. Required: " #
        Nat64.toText(requiredDebit) # " e8s"
      );
    };

    let mintlabFee = MarketplaceLib.mintlabFee(marketplaceFeeState, listing.price);
    let now = Time.now();
    let settlement : MarketplaceTypes.FixedPurchaseSettlement = {
      listingId;
      buyer;
      seller = listing.seller;
      nft = escrowedNFT;
      price = listing.price;
      sellerProceeds = MarketplaceLib.sellerProceeds(marketplaceFeeState, listing.price);
      mintlabFee;
      feeRecipient = configuredFeeRecipientForAmount(listing.price);
      ledgerFeeE8s;
      paymentEscrowId = MarketplaceLib.reserveEscrowId(marketplacePaymentState);
      paymentCreatedAt = ledgerTimestampNow();
      paymentBlock = null;
      nftDeliveredAt = null;
      mintlabFeeCreatedAt = null;
      mintlabFeeBlock = null;
      sellerPaymentCreatedAt = null;
      sellerPaymentBlock = null;
      stage = #PaymentPending;
      createdAt = now;
      updatedAt = now;
    };
    MarketplaceLib.putFixedPurchaseSettlement(marketplaceSettlementState, settlement);
    settlement;
  };

  func continueFixedPurchaseSettlement(listingId : MarketplaceTypes.ListingId) : async* () {
    let ledger = actor (IcpLib.LEDGER_CANISTER_ID) : IcpLib.Ledger;
    var settlement = switch (MarketplaceLib.getFixedPurchaseSettlement(marketplaceSettlementState, listingId)) {
      case null Runtime.trap("Fixed purchase settlement not found");
      case (?value) value;
    };
    let escrowSub = IcpLib.marketplacePurchaseEscrowSubaccount(settlement.paymentEscrowId);

    switch (settlement.paymentBlock) {
      case null {
        let buyerSub = IcpLib.principalToSubaccount(settlement.buyer);
        let escrowAccount = IcpLib.accountIdentifier(canisterId, escrowSub);
        let depositAmount = settlementPayoutDebit(settlement.price, settlement.mintlabFee, settlement.ledgerFeeE8s);
        var clearSettlementOnPaymentFailure = false;
        try {
          let paymentResult = await* IcpLib.transferOutWithFeeAt(
            ledger,
            ?buyerSub,
            escrowAccount,
            depositAmount,
            Nat64.fromNat(settlement.listingId),
            settlement.ledgerFeeE8s,
            settlement.paymentCreatedAt,
          );
          let paymentBlock = switch (paymentResult) {
            case (#Ok(blockIndex)) blockIndex;
            case (#Err(#TxDuplicate({ duplicate_of }))) duplicate_of;
            case (#Err(#BadFee({ expected_fee }))) {
              let updated = {
                settlement with
                ledgerFeeE8s = expected_fee.e8s;
                paymentCreatedAt = ledgerTimestampNow();
                updatedAt = Time.now();
              };
              await* persistFixedPurchaseSettlementAndTrap(
                updated,
                "Purchase escrow transfer failed: ledger fee changed; retry purchase settlement",
              );
              (0 : Nat64);
            };
            case (#Err(#InsufficientFunds({ balance }))) {
              clearSettlementOnPaymentFailure := true;
              Runtime.trap(
                "Purchase escrow transfer failed: insufficient ICP. Current balance: " #
                Nat64.toText(balance.e8s) # " e8s"
              );
            };
            case (#Err(#TxTooOld(_))) {
              let escrowBalance = await* IcpLib.getBalance(ledger, escrowAccount);
              if (escrowBalance >= depositAmount) {
                let updated = {
                  settlement with
                  paymentBlock = ?(0 : Nat64);
                  stage = #NFTTransferPending;
                  updatedAt = Time.now();
                };
                MarketplaceLib.putFixedPurchaseSettlement(marketplaceSettlementState, updated);
                settlement := updated;
                (0 : Nat64);
              } else {
                clearSettlementOnPaymentFailure := true;
                Runtime.trap("Purchase escrow transfer timestamp expired and escrow is unfunded; retry purchase");
              };
            };
            case (#Err(#TxCreatedInFuture)) {
              let updated = {
                settlement with
                paymentCreatedAt = ledgerTimestampNow();
                updatedAt = Time.now();
              };
              await* persistFixedPurchaseSettlementAndTrap(
                updated,
                "Purchase escrow transfer timestamp was in the future; retry purchase settlement",
              );
              (0 : Nat64);
            };
          };
          if (settlement.paymentBlock == null) {
            settlement := {
              settlement with
              paymentBlock = ?paymentBlock;
              stage = #NFTTransferPending;
              updatedAt = Time.now();
            };
            MarketplaceLib.putFixedPurchaseSettlement(marketplaceSettlementState, settlement);
          };
        } finally {
          if (clearSettlementOnPaymentFailure) {
            ignore MarketplaceLib.removeFixedPurchaseSettlement(marketplaceSettlementState, listingId);
          };
        };
      };
      case (?_) {};
    };

    switch (settlement.nftDeliveredAt) {
      case null {
        let deliveredLocation = await* transferEscrowedNFTToRecipient(settlement.nft, settlement.buyer);
        ignore WalletLib.registerNFT(
          walletState,
          settlement.buyer,
          settlement.nft.collectionId,
          settlement.nft.tokenId,
          settlement.nft.metadata,
          deliveredLocation,
        );
        settlement := {
          settlement with
          nftDeliveredAt = ?Time.now();
          stage = if (settlement.mintlabFee > 0) #MintlabFeePending else #SellerPaymentPending;
          updatedAt = Time.now();
        };
        MarketplaceLib.putFixedPurchaseSettlement(marketplaceSettlementState, settlement);
      };
      case (?_) {};
    };

    if (settlement.mintlabFee > 0) {
      switch (settlement.mintlabFeeBlock) {
        case null {
          let createdAt = switch (settlement.mintlabFeeCreatedAt) {
            case (?timestamp) timestamp;
            case null {
              let currentFee = await* IcpLib.getTransferFee(ledger);
              let timestamp = ledgerTimestampNow();
              settlement := {
                settlement with
                ledgerFeeE8s = currentFee;
                mintlabFeeCreatedAt = ?timestamp;
                updatedAt = Time.now();
              };
              MarketplaceLib.putFixedPurchaseSettlement(marketplaceSettlementState, settlement);
              timestamp;
            };
          };
          let feeRecipient = switch (settlement.feeRecipient) {
            case null Runtime.trap("Mintlab sales fee account is missing from purchase settlement");
            case (?account) account;
          };
          let feeResult = await* IcpLib.transferOutWithFeeAt(
            ledger,
            ?escrowSub,
            feeRecipient,
            settlement.mintlabFee,
            Nat64.fromNat(settlement.listingId),
            settlement.ledgerFeeE8s,
            createdAt,
          );
          switch (transferBlockResult(feeResult)) {
            case (#ok(feeBlock)) {
              settlement := {
                settlement with
                mintlabFeeBlock = ?feeBlock;
                stage = #SellerPaymentPending;
                updatedAt = Time.now();
              };
              MarketplaceLib.putFixedPurchaseSettlement(marketplaceSettlementState, settlement);
            };
            case (#badFee(expectedFee)) {
              let updated = {
                settlement with
                ledgerFeeE8s = expectedFee;
                mintlabFeeCreatedAt = null;
                updatedAt = Time.now();
              };
              await* persistFixedPurchaseSettlementAndTrap(
                updated,
                "Mintlab sales fee transfer failed: ledger fee changed; retry settlement",
              );
            };
            case (#insufficientFunds(balance)) {
              Runtime.trap(
                "Mintlab sales fee transfer failed: escrow balance is too low (" #
                Nat64.toText(balance) # " e8s)"
              );
            };
            case (#tooOld) {
              let escrowAccount = IcpLib.accountIdentifier(canisterId, escrowSub);
              let escrowBalance = await* IcpLib.getBalance(ledger, escrowAccount);
              let expectedBeforeFee = settlementPayoutDebit(
                settlement.price,
                settlement.mintlabFee,
                settlement.ledgerFeeE8s,
              );
              let expectedAfterFee = settlement.sellerProceeds + settlement.ledgerFeeE8s;
              if (escrowBalance >= expectedBeforeFee) {
                let updated = {
                  settlement with
                  mintlabFeeCreatedAt = null;
                  updatedAt = Time.now();
                };
                await* persistFixedPurchaseSettlementAndTrap(
                  updated,
                  "Mintlab sales fee transfer timestamp expired; retry settlement with a fresh timestamp",
                );
              } else if (escrowBalance >= expectedAfterFee) {
                settlement := {
                  settlement with
                  mintlabFeeBlock = ?(0 : Nat64);
                  stage = #SellerPaymentPending;
                  updatedAt = Time.now();
                };
                MarketplaceLib.putFixedPurchaseSettlement(marketplaceSettlementState, settlement);
              } else {
                Runtime.trap("Mintlab sales fee transfer timestamp expired and escrow balance needs admin review");
              };
            };
            case (#createdInFuture) {
              let updated = {
                settlement with
                mintlabFeeCreatedAt = null;
                updatedAt = Time.now();
              };
              await* persistFixedPurchaseSettlementAndTrap(
                updated,
                "Mintlab sales fee transfer timestamp was in the future; retry settlement",
              );
            };
          };
        };
        case (?_) {};
      };
    };

    switch (settlement.sellerPaymentBlock) {
      case null {
        let sellerTransfer = switch (settlement.sellerPaymentCreatedAt) {
          case (?timestamp) {
            {
              createdAt = timestamp;
              amount = settlement.sellerProceeds;
            };
          };
          case null {
            let currentFee = await* IcpLib.getTransferFee(ledger);
            let escrowAccount = IcpLib.accountIdentifier(canisterId, escrowSub);
            let escrowBalance = await* IcpLib.getBalance(ledger, escrowAccount);
            let expectedDebit = settlement.sellerProceeds + currentFee;
            if (escrowBalance < expectedDebit) {
              Runtime.trap(
                "Seller ICP transfer failed: settlement escrow needs top-up. Required: " #
                Nat64.toText(expectedDebit) # " e8s, balance: " # Nat64.toText(escrowBalance) # " e8s"
              );
            };
            let timestamp = ledgerTimestampNow();
            settlement := {
              settlement with
              ledgerFeeE8s = currentFee;
              sellerPaymentCreatedAt = ?timestamp;
              updatedAt = Time.now();
            };
            MarketplaceLib.putFixedPurchaseSettlement(marketplaceSettlementState, settlement);
            {
              createdAt = timestamp;
              amount = settlement.sellerProceeds;
            };
          };
        };
        let sellerSub = IcpLib.principalToSubaccount(settlement.seller);
        let sellerAccount = IcpLib.accountIdentifier(canisterId, sellerSub);
        let sellerResult = await* IcpLib.transferOutWithFeeAt(
          ledger,
          ?escrowSub,
          sellerAccount,
          sellerTransfer.amount,
          Nat64.fromNat(settlement.listingId),
          settlement.ledgerFeeE8s,
          sellerTransfer.createdAt,
        );
        switch (transferBlockResult(sellerResult)) {
          case (#ok(sellerBlock)) {
            settlement := {
              settlement with
              sellerPaymentBlock = ?sellerBlock;
              updatedAt = Time.now();
            };
            MarketplaceLib.putFixedPurchaseSettlement(marketplaceSettlementState, settlement);
          };
          case (#badFee(expectedFee)) {
            let updated = {
              settlement with
              ledgerFeeE8s = expectedFee;
              sellerPaymentCreatedAt = null;
              updatedAt = Time.now();
            };
            await* persistFixedPurchaseSettlementAndTrap(
              updated,
              "Seller ICP transfer failed: ledger fee changed; retry settlement",
            );
          };
          case (#insufficientFunds(balance)) {
            Runtime.trap(
              "Seller ICP transfer failed: settlement escrow needs top-up before payout. Balance: " #
              Nat64.toText(balance) # " e8s"
            );
          };
          case (#tooOld) {
            let escrowAccount = IcpLib.accountIdentifier(canisterId, escrowSub);
            let escrowBalance = await* IcpLib.getBalance(ledger, escrowAccount);
            if (escrowBalance == 0) {
              settlement := {
                settlement with
                sellerPaymentBlock = ?(0 : Nat64);
                updatedAt = Time.now();
              };
              MarketplaceLib.putFixedPurchaseSettlement(marketplaceSettlementState, settlement);
            } else {
              let currentFee = await* IcpLib.getTransferFee(ledger);
              let expectedDebit = settlement.sellerProceeds + currentFee;
              if (escrowBalance >= expectedDebit) {
                let updated = {
                  settlement with
                  ledgerFeeE8s = currentFee;
                  sellerPaymentCreatedAt = null;
                  updatedAt = Time.now();
                };
                await* persistFixedPurchaseSettlementAndTrap(
                  updated,
                  "Seller ICP transfer timestamp expired; retry settlement with a fresh timestamp",
                );
              } else {
                Runtime.trap("Seller ICP transfer timestamp expired and escrow balance needs admin review");
              };
            };
          };
          case (#createdInFuture) {
            let updated = {
              settlement with
              sellerPaymentCreatedAt = null;
              updatedAt = Time.now();
            };
            await* persistFixedPurchaseSettlementAndTrap(
              updated,
              "Seller ICP transfer timestamp was in the future; retry settlement",
            );
          };
        };
      };
      case (?_) {};
    };

    await* refundRemainingEscrowBalanceToUser(
      ledger,
      escrowSub,
      settlement.buyer,
      Nat64.fromNat(settlement.listingId),
      "Fixed purchase settlement",
    );

    ignore MarketplaceLib.settleFixedListing(marketplaceState, settlement.listingId);
    ignore MarketplaceLib.takeEscrowedNFT(marketplaceState, settlement.listingId);
    ignore MarketplaceLib.clearListingsForToken(marketplaceState, settlement.nft.collectionId, settlement.nft.tokenId);
    ignore MarketplaceLib.removeFixedPurchaseSettlement(marketplaceSettlementState, settlement.listingId);
  };

  /// Place a bid on an active auction listing
  public shared ({ caller }) func placeBid(
    listingId : MarketplaceTypes.ListingId,
    amount : Nat64,
  ) : async MarketplaceTypes.AuctionListing {
    if (Principal.isAnonymous(caller)) Runtime.trap("Anonymous caller not allowed");
    if (MarketplaceLib.isListingReturning(marketplaceListingReturnState, listingId)) {
      Runtime.trap("Auction is being cancelled and returned to the seller");
    };
    if (amount == 0) Runtime.trap("Bid amount must be greater than zero");
    ensureMintlabFeeApplies(amount, "Bid amount");
    ignore configuredFeeRecipientForAmount(amount);
    if (not MarketplaceLib.acquireListingLock(marketplacePaymentState, listingId)) {
      Runtime.trap("Auction is processing another payment. Try again shortly.");
    };
    var paymentLockOwner : ?Principal = null;
    try {
      switch (MarketplaceLib.getPendingBidDeposit(marketplaceBidState, listingId)) {
        case null {
          acquireUserPaymentLockOrTrap(caller);
          paymentLockOwner := ?caller;
          ignore await* startPendingBidDeposit(listingId, caller, amount);
        };
        case (?pending) {
          let isCallerAdmin = AuthLib.isAdmin(authState, caller);
          if (not Principal.equal(pending.bidder, caller) and not isCallerAdmin) {
            Runtime.trap("This auction already has a pending bid deposit being recovered");
          };
          if (pending.amount != amount and not isCallerAdmin) {
            Runtime.trap("Retry the pending bid with the same amount");
          };
          if (pending.paymentBlock == null) {
            acquireUserPaymentLockOrTrap(pending.bidder);
            paymentLockOwner := ?pending.bidder;
          };
        };
      };
      await* continuePendingBidDeposit(listingId);
    } finally {
      releaseMarketplaceUserPaymentLock(paymentLockOwner);
      MarketplaceLib.releaseListingLock(marketplacePaymentState, listingId);
    };
  };

  public shared ({ caller }) func retryPendingBid(
    listingId : MarketplaceTypes.ListingId
  ) : async MarketplaceTypes.AuctionListing {
    if (Principal.isAnonymous(caller)) Runtime.trap("Anonymous caller not allowed");
    let pending = switch (MarketplaceLib.getPendingBidDeposit(marketplaceBidState, listingId)) {
      case null Runtime.trap("Pending bid deposit not found");
      case (?value) value;
    };
    let isCallerAdmin = AuthLib.isAdmin(authState, caller);
    if (not Principal.equal(pending.bidder, caller) and not isCallerAdmin) {
      Runtime.trap("Unauthorized: must be bidder or admin");
    };
    if (not MarketplaceLib.acquireListingLock(marketplacePaymentState, listingId)) {
      Runtime.trap("Auction is processing another payment. Try again shortly.");
    };
    var paymentLockOwner : ?Principal = null;
    try {
      if (pending.paymentBlock == null) {
        acquireUserPaymentLockOrTrap(pending.bidder);
        paymentLockOwner := ?pending.bidder;
      };
      await* continuePendingBidDeposit(listingId);
    } finally {
      releaseMarketplaceUserPaymentLock(paymentLockOwner);
      MarketplaceLib.releaseListingLock(marketplacePaymentState, listingId);
    };
  };

  func startPendingBidDeposit(
    listingId : MarketplaceTypes.ListingId,
    bidder : Principal,
    amount : Nat64,
  ) : async* MarketplaceTypes.PendingBidDeposit {
    let bidObservedAt = Time.now();
    let listing = switch (MarketplaceLib.getAuctionListing(marketplaceState, listingId)) {
      case null Runtime.trap("Auction listing not found");
      case (?value) value;
    };
    if (listing.status != #Active) Runtime.trap("Auction is not active");
    if (bidObservedAt >= listing.endTime) Runtime.trap("Auction has ended");
    if (Principal.equal(listing.seller, bidder)) Runtime.trap("Seller cannot bid on their own auction");

    let minimum = MarketplaceLib.nextMinimumAuctionBid(listing);
    if (amount < minimum) {
      Runtime.trap("Bid must be at least 0.01 ICP above the current high bid");
    };

    let ledger = actor (IcpLib.LEDGER_CANISTER_ID) : IcpLib.Ledger;
    let ledgerFeeE8s = await* IcpLib.getTransferFee(ledger);
    let escrowDeposit = MarketplaceLib.auctionBidEscrowDeposit(amount, ledgerFeeE8s);
    let requiredDebit = MarketplaceLib.totalBidderDebit(amount, ledgerFeeE8s);
    let bidderSub = IcpLib.principalToSubaccount(bidder);
    let bidderAccount = IcpLib.accountIdentifier(canisterId, bidderSub);
    let bidderBalance = await* IcpLib.getBalance(ledger, bidderAccount);
    if (bidderBalance < requiredDebit) {
      Runtime.trap(
        "Insufficient ICP for bid escrow and ledger fees. Required: " #
        Nat64.toText(requiredDebit) # " e8s"
      );
    };
    let pending : MarketplaceTypes.PendingBidDeposit = {
      listingId;
      bidder;
      amount;
      escrowId = MarketplaceLib.reserveEscrowId(marketplacePaymentState);
      escrowDeposit;
      feeReserve = MarketplaceLib.auctionBidFeeReserve(ledgerFeeE8s);
      ledgerFeeE8s;
      paymentCreatedAt = ledgerTimestampNow();
      paymentAttemptedAt = ?bidObservedAt;
      paymentBlock = null;
      createdAt = bidObservedAt;
      updatedAt = bidObservedAt;
    };
    MarketplaceLib.putPendingBidDeposit(marketplaceBidState, pending);
    pending;
  };

  func continuePendingBidDeposit(
    listingId : MarketplaceTypes.ListingId
  ) : async* MarketplaceTypes.AuctionListing {
    let ledger = actor (IcpLib.LEDGER_CANISTER_ID) : IcpLib.Ledger;
    var pending = switch (MarketplaceLib.getPendingBidDeposit(marketplaceBidState, listingId)) {
      case null Runtime.trap("Pending bid deposit not found");
      case (?value) value;
    };
    let listing = switch (MarketplaceLib.getAuctionListing(marketplaceState, listingId)) {
      case null Runtime.trap("Auction listing not found");
      case (?value) value;
    };
    if (listing.status != #Active) Runtime.trap("Auction is not active");

    switch (pending.paymentBlock) {
      case null {
        var clearPendingAfterExpiredAuction = false;
        try {
          if (Time.now() >= listing.endTime) {
            switch (pending.paymentAttemptedAt) {
              case null {
                clearPendingAfterExpiredAuction := true;
                Runtime.trap("Auction ended before the bid escrow was funded");
              };
              case (?_) {};
            };
          };
        } finally {
          if (clearPendingAfterExpiredAuction) {
            ignore MarketplaceLib.removePendingBidDeposit(marketplaceBidState, listingId);
          };
        };

        switch (pending.paymentAttemptedAt) {
          case null {
            let now = Time.now();
            pending := {
              pending with
              paymentAttemptedAt = ?now;
              updatedAt = now;
            };
            MarketplaceLib.putPendingBidDeposit(marketplaceBidState, pending);
          };
          case (?_) {};
        };

        let bidderSub = IcpLib.principalToSubaccount(pending.bidder);
        let escrowSub = IcpLib.marketplaceEscrowSubaccount(pending.escrowId);
        let escrowAccount = IcpLib.accountIdentifier(canisterId, escrowSub);
        var clearPendingOnPaymentFailure = false;
        try {
          let depositResult = await* IcpLib.transferOutWithFeeAt(
            ledger,
            ?bidderSub,
            escrowAccount,
            pending.escrowDeposit,
            Nat64.fromNat(pending.listingId),
            pending.ledgerFeeE8s,
            pending.paymentCreatedAt,
          );
          let depositBlock = switch (depositResult) {
            case (#Ok(blockIndex)) blockIndex;
            case (#Err(#TxDuplicate({ duplicate_of }))) duplicate_of;
            case (#Err(#BadFee({ expected_fee }))) {
              let updated = {
                pending with
                ledgerFeeE8s = expected_fee.e8s;
                feeReserve = MarketplaceLib.auctionBidFeeReserve(expected_fee.e8s);
                escrowDeposit = MarketplaceLib.auctionBidEscrowDeposit(pending.amount, expected_fee.e8s);
                paymentCreatedAt = ledgerTimestampNow();
                updatedAt = Time.now();
              };
              await* persistPendingBidDepositAndTrap(
                updated,
                "Bid escrow transfer failed: ledger fee changed; retry pending bid",
              );
              (0 : Nat64);
            };
            case (#Err(#InsufficientFunds({ balance }))) {
              clearPendingOnPaymentFailure := true;
              Runtime.trap(
                "Bid escrow transfer failed: insufficient ICP. Current balance: " #
                Nat64.toText(balance.e8s) # " e8s"
              );
            };
            case (#Err(#TxTooOld(_))) {
              let escrowBalance = await* IcpLib.getBalance(ledger, escrowAccount);
              if (escrowBalance >= pending.escrowDeposit) {
                let updated = {
                  pending with
                  paymentBlock = ?(0 : Nat64);
                  updatedAt = Time.now();
                };
                MarketplaceLib.putPendingBidDeposit(marketplaceBidState, updated);
                pending := updated;
                (0 : Nat64);
              } else {
                clearPendingOnPaymentFailure := true;
                Runtime.trap("Bid escrow transfer timestamp expired and escrow is unfunded; place the bid again");
              };
            };
            case (#Err(#TxCreatedInFuture)) {
              let updated = {
                pending with
                paymentCreatedAt = ledgerTimestampNow();
                updatedAt = Time.now();
              };
              await* persistPendingBidDepositAndTrap(
                updated,
                "Bid escrow transfer timestamp was in the future; retry pending bid",
              );
              (0 : Nat64);
            };
          };
          if (pending.paymentBlock == null) {
            pending := {
              pending with
              paymentBlock = ?depositBlock;
              updatedAt = Time.now();
            };
            MarketplaceLib.putPendingBidDeposit(marketplaceBidState, pending);
          };
        } finally {
          if (clearPendingOnPaymentFailure) {
            ignore MarketplaceLib.removePendingBidDeposit(marketplaceBidState, listingId);
          };
        };
      };
      case (?_) {};
    };

    let depositedBlock = switch (pending.paymentBlock) {
      case null Runtime.trap("Pending bid is missing its payment block");
      case (?value) value;
    };
    let bidObservedAt = switch (pending.paymentAttemptedAt) {
      case (?timestamp) timestamp;
      case null pending.createdAt;
    };

    let previousEscrow = MarketplaceLib.getAuctionEscrow(marketplacePaymentState, listingId);
    switch (previousEscrow) {
      case (?escrow) {
        if (auctionEscrowMatchesPending(escrow, pending, depositedBlock)) {
          let currentListing = if (auctionListingHasPendingBid(listing, pending)) {
            listing
          } else {
            switch (MarketplaceLib.placeBidAt(marketplaceState, listingId, pending.bidder, pending.amount, bidObservedAt)) {
              case null Runtime.trap("Bid too low or listing not found");
              case (?value) value;
            }
          };
          ignore MarketplaceLib.removePendingBidDeposit(marketplaceBidState, listingId);
          return currentListing;
        };
      };
      case null {};
    };

    let updated = if (auctionListingHasPendingBid(listing, pending)) {
      listing
    } else {
      switch (MarketplaceLib.placeBidAt(marketplaceState, listingId, pending.bidder, pending.amount, bidObservedAt)) {
        case null Runtime.trap("Bid too low or listing not found");
        case (?value) value;
      }
    };

    let previousEscrowToRefund = switch (previousEscrow) {
      case null null;
      case (?escrow) ?escrow;
    };

    switch (previousEscrowToRefund) {
      case null {};
      case (?escrow) {
        MarketplaceLib.queueAuctionRefund(marketplacePaymentState, escrow);
      };
    };

    MarketplaceLib.recordAuctionEscrow(
      marketplacePaymentState,
      listingId,
      {
        escrowId = pending.escrowId;
        listingId;
        bidder = pending.bidder;
        amount = pending.amount;
        feeReserve = pending.feeReserve;
        ledgerFeeE8s = pending.ledgerFeeE8s;
        depositedBlock;
        createdAt = pending.createdAt;
      },
    );
    ignore MarketplaceLib.removePendingBidDeposit(marketplaceBidState, listingId);

    switch (previousEscrowToRefund) {
      case null {};
      case (?escrow) {
        switch (await* refundAuctionEscrow(ledger, escrow, pending.ledgerFeeE8s)) {
          case (#ok(_)) {};
          case (#err(_)) {};
        };
      };
    };

    updated;
  };

  /// Settle an auction after its end time; NFT delivery happens before escrow payout and can be retried.
  public shared ({ caller }) func settleAuction(listingId : MarketplaceTypes.ListingId) : async () {
    if (Principal.isAnonymous(caller)) Runtime.trap("Anonymous caller not allowed");
    if (MarketplaceLib.isListingReturning(marketplaceListingReturnState, listingId)) {
      Runtime.trap("Auction is being cancelled and cannot be settled");
    };
    if (not MarketplaceLib.acquireListingLock(marketplacePaymentState, listingId)) {
      Runtime.trap("Auction is processing another payment. Try again shortly.");
    };
    try {
      switch (MarketplaceLib.getNoBidAuctionReturn(marketplaceNoBidAuctionReturnState, listingId)) {
        case (?_) {
          await* continueNoBidAuctionReturnSettlement(listingId);
          return;
        };
        case null {};
      };
      switch (MarketplaceLib.getAuctionSettlement(marketplaceSettlementState, listingId)) {
        case null {
          let listing = switch (MarketplaceLib.getAuctionListing(marketplaceState, listingId)) {
            case null Runtime.trap("Auction listing not found");
            case (?l) l;
          };
          if (listing.status != #Active) Runtime.trap("Auction is not active");
          if (Time.now() < listing.endTime) Runtime.trap("Auction has not ended yet");
          let settledNFT = switch (MarketplaceLib.getEscrowedNFT(marketplaceState, listingId)) {
            case null Runtime.trap("Escrowed NFT missing while finalizing auction");
            case (?nft) nft;
          };

          switch (listing.highestBidder) {
            case null {
              ignore startNoBidAuctionReturnSettlement(listing, settledNFT);
              await* continueNoBidAuctionReturnSettlement(listingId);
              return;
            };
            case (?winner) {
              await* ensureEscrowedNFTReady(settledNFT);
              ignore await* startAuctionSettlement(listing, settledNFT, winner);
            };
          };
        };
        case (?_) {};
      };
      await* continueAuctionSettlement(listingId);
    } finally {
      MarketplaceLib.releaseListingLock(marketplacePaymentState, listingId);
    };
  };

  func startNoBidAuctionReturnSettlement(
    listing : MarketplaceTypes.AuctionListing,
    settledNFT : WalletTypes.WalletNFT,
  ) : MarketplaceTypes.NoBidAuctionReturnSettlement {
    let now = Time.now();
    let settlement : MarketplaceTypes.NoBidAuctionReturnSettlement = {
      listingId = listing.id;
      seller = listing.seller;
      nft = settledNFT;
      returnedAt = null;
      walletRegisteredAt = null;
      stage = #NFTReturnPending;
      createdAt = now;
      updatedAt = now;
    };
    MarketplaceLib.putNoBidAuctionReturn(marketplaceNoBidAuctionReturnState, settlement);
    settlement;
  };

  func continueNoBidAuctionReturnSettlement(
    listingId : MarketplaceTypes.ListingId
  ) : async* () {
    var settlement = switch (
      MarketplaceLib.getNoBidAuctionReturn(marketplaceNoBidAuctionReturnState, listingId)
    ) {
      case null Runtime.trap("No-bid auction return settlement not found");
      case (?value) value;
    };

    switch (settlement.returnedAt) {
      case null {
        let returnedLocation = await* transferEscrowedNFTToRecipient(settlement.nft, settlement.seller);
        let returnedAt = Time.now();
        settlement := {
          settlement with
          returnedAt = ?returnedAt;
          stage = #WalletRegistrationPending;
          updatedAt = returnedAt;
        };
        MarketplaceLib.putNoBidAuctionReturn(marketplaceNoBidAuctionReturnState, settlement);

        ignore WalletLib.registerNFT(
          walletState,
          settlement.seller,
          settlement.nft.collectionId,
          settlement.nft.tokenId,
          settlement.nft.metadata,
          returnedLocation,
        );
        let registeredAt = Time.now();
        settlement := {
          settlement with
          walletRegisteredAt = ?registeredAt;
          stage = #CleanupPending;
          updatedAt = registeredAt;
        };
        MarketplaceLib.putNoBidAuctionReturn(marketplaceNoBidAuctionReturnState, settlement);
      };
      case (?_) {};
    };

    switch (settlement.walletRegisteredAt) {
      case null {
        ignore WalletLib.registerNFT(
          walletState,
          settlement.seller,
          settlement.nft.collectionId,
          settlement.nft.tokenId,
          settlement.nft.metadata,
          returnedWalletLocation(settlement.nft),
        );
        let registeredAt = Time.now();
        settlement := {
          settlement with
          walletRegisteredAt = ?registeredAt;
          stage = #CleanupPending;
          updatedAt = registeredAt;
        };
        MarketplaceLib.putNoBidAuctionReturn(marketplaceNoBidAuctionReturnState, settlement);
      };
      case (?_) {};
    };

    ignore MarketplaceLib.settleAuction(marketplaceState, settlement.listingId);
    ignore MarketplaceLib.takeEscrowedNFT(marketplaceState, settlement.listingId);
    ignore MarketplaceLib.clearListingsForToken(
      marketplaceState,
      settlement.nft.collectionId,
      settlement.nft.tokenId,
    );
    ignore MarketplaceLib.removeNoBidAuctionReturn(
      marketplaceNoBidAuctionReturnState,
      settlement.listingId,
    );
  };

  func returnedWalletLocation(nft : WalletTypes.WalletNFT) : WalletTypes.WalletLocation {
    switch (nft.location) {
      case (#Minted) #Minted;
      case (#Vaulted) #Vaulted;
      case (#Registered) Runtime.trap("Registered external NFTs are not escrowed by the marketplace");
    };
  };

  func startAuctionSettlement(
    listing : MarketplaceTypes.AuctionListing,
    settledNFT : WalletTypes.WalletNFT,
    winner : Principal,
  ) : async* MarketplaceTypes.AuctionSettlement {
    let ledger = actor (IcpLib.LEDGER_CANISTER_ID) : IcpLib.Ledger;
    let winningEscrow = switch (resolveWinningEscrow(listing, winner)) {
      case null Runtime.trap("Winning bid escrow record is missing; cannot safely settle this auction");
      case (?escrow) escrow;
    };
    let ledgerFeeE8s = winningEscrow.ledgerFeeE8s;
    let escrowSub = IcpLib.marketplaceEscrowSubaccount(winningEscrow.escrowId);
    let escrowAccount = IcpLib.accountIdentifier(canisterId, escrowSub);
    let mintlabFee = MarketplaceLib.mintlabFee(marketplaceFeeState, listing.highestBid);
    let requiredDebit = settlementPayoutDebit(listing.highestBid, mintlabFee, ledgerFeeE8s);
    let escrowBalance = await* IcpLib.getBalance(ledger, escrowAccount);
    if (escrowBalance < requiredDebit) {
      Runtime.trap(
        "Winning bid escrow does not hold enough ICP to settle this auction. Required: " #
        Nat64.toText(requiredDebit) # " e8s"
      );
    };

    let now = Time.now();
    let settlement : MarketplaceTypes.AuctionSettlement = {
      listingId = listing.id;
      seller = listing.seller;
      winner;
      nft = settledNFT;
      price = listing.highestBid;
      sellerProceeds = MarketplaceLib.sellerProceeds(marketplaceFeeState, listing.highestBid);
      mintlabFee;
      feeRecipient = configuredFeeRecipientForAmount(listing.highestBid);
      ledgerFeeE8s;
      winningEscrowId = winningEscrow.escrowId;
      winningEscrowDepositedBlock = winningEscrow.depositedBlock;
      nftDeliveredAt = null;
      mintlabFeeCreatedAt = null;
      mintlabFeeBlock = null;
      sellerPaymentCreatedAt = null;
      sellerPaymentBlock = null;
      stage = #NFTTransferPending;
      createdAt = now;
      updatedAt = now;
    };
    MarketplaceLib.putAuctionSettlement(marketplaceSettlementState, settlement);
    settlement;
  };

  func continueAuctionSettlement(listingId : MarketplaceTypes.ListingId) : async* () {
    let ledger = actor (IcpLib.LEDGER_CANISTER_ID) : IcpLib.Ledger;
    var settlement = switch (MarketplaceLib.getAuctionSettlement(marketplaceSettlementState, listingId)) {
      case null Runtime.trap("Auction settlement not found");
      case (?value) value;
    };
    let escrowSub = IcpLib.marketplaceEscrowSubaccount(settlement.winningEscrowId);

    switch (settlement.nftDeliveredAt) {
      case null {
        let deliveredLocation = await* transferEscrowedNFTToRecipient(settlement.nft, settlement.winner);
        ignore WalletLib.registerNFT(
          walletState,
          settlement.winner,
          settlement.nft.collectionId,
          settlement.nft.tokenId,
          settlement.nft.metadata,
          deliveredLocation,
        );
        settlement := {
          settlement with
          nftDeliveredAt = ?Time.now();
          stage = if (settlement.mintlabFee > 0) #MintlabFeePending else #SellerPaymentPending;
          updatedAt = Time.now();
        };
        MarketplaceLib.putAuctionSettlement(marketplaceSettlementState, settlement);
      };
      case (?_) {};
    };

    if (settlement.mintlabFee > 0) {
      switch (settlement.mintlabFeeBlock) {
        case null {
          let createdAt = switch (settlement.mintlabFeeCreatedAt) {
            case (?timestamp) timestamp;
            case null {
              let currentFee = await* IcpLib.getTransferFee(ledger);
              let timestamp = ledgerTimestampNow();
              settlement := {
                settlement with
                ledgerFeeE8s = currentFee;
                mintlabFeeCreatedAt = ?timestamp;
                updatedAt = Time.now();
              };
              MarketplaceLib.putAuctionSettlement(marketplaceSettlementState, settlement);
              timestamp;
            };
          };
          let feeRecipient = switch (settlement.feeRecipient) {
            case null Runtime.trap("Mintlab sales fee account is missing from auction settlement");
            case (?account) account;
          };
          let feeResult = await* IcpLib.transferOutWithFeeAt(
            ledger,
            ?escrowSub,
            feeRecipient,
            settlement.mintlabFee,
            Nat64.fromNat(settlement.listingId),
            settlement.ledgerFeeE8s,
            createdAt,
          );
          switch (transferBlockResult(feeResult)) {
            case (#ok(feeBlock)) {
              settlement := {
                settlement with
                mintlabFeeBlock = ?feeBlock;
                stage = #SellerPaymentPending;
                updatedAt = Time.now();
              };
              MarketplaceLib.putAuctionSettlement(marketplaceSettlementState, settlement);
            };
            case (#badFee(expectedFee)) {
              let updated = {
                settlement with
                ledgerFeeE8s = expectedFee;
                mintlabFeeCreatedAt = null;
                updatedAt = Time.now();
              };
              await* persistAuctionSettlementAndTrap(
                updated,
                "Mintlab sales fee transfer failed: ledger fee changed; retry settlement",
              );
            };
            case (#insufficientFunds(balance)) {
              Runtime.trap(
                "Mintlab sales fee transfer failed: escrow balance is too low (" #
                Nat64.toText(balance) # " e8s)"
              );
            };
            case (#tooOld) {
              let escrowAccount = IcpLib.accountIdentifier(canisterId, escrowSub);
              let escrowBalance = await* IcpLib.getBalance(ledger, escrowAccount);
              let expectedBeforeFee = settlementPayoutDebit(
                settlement.price,
                settlement.mintlabFee,
                settlement.ledgerFeeE8s,
              );
              let expectedAfterFee = settlement.sellerProceeds + settlement.ledgerFeeE8s;
              if (escrowBalance >= expectedBeforeFee) {
                let updated = {
                  settlement with
                  mintlabFeeCreatedAt = null;
                  updatedAt = Time.now();
                };
                await* persistAuctionSettlementAndTrap(
                  updated,
                  "Mintlab sales fee transfer timestamp expired; retry settlement with a fresh timestamp",
                );
              } else if (escrowBalance >= expectedAfterFee) {
                settlement := {
                  settlement with
                  mintlabFeeBlock = ?(0 : Nat64);
                  stage = #SellerPaymentPending;
                  updatedAt = Time.now();
                };
                MarketplaceLib.putAuctionSettlement(marketplaceSettlementState, settlement);
              } else {
                Runtime.trap("Mintlab sales fee transfer timestamp expired and escrow balance needs admin review");
              };
            };
            case (#createdInFuture) {
              let updated = {
                settlement with
                mintlabFeeCreatedAt = null;
                updatedAt = Time.now();
              };
              await* persistAuctionSettlementAndTrap(
                updated,
                "Mintlab sales fee transfer timestamp was in the future; retry settlement",
              );
            };
          };
        };
        case (?_) {};
      };
    };

    switch (settlement.sellerPaymentBlock) {
      case null {
        let sellerTransfer = switch (settlement.sellerPaymentCreatedAt) {
          case (?timestamp) {
            {
              createdAt = timestamp;
              amount = settlement.sellerProceeds;
            };
          };
          case null {
            let currentFee = await* IcpLib.getTransferFee(ledger);
            let escrowAccount = IcpLib.accountIdentifier(canisterId, escrowSub);
            let escrowBalance = await* IcpLib.getBalance(ledger, escrowAccount);
            let expectedDebit = settlement.sellerProceeds + currentFee;
            if (escrowBalance < expectedDebit) {
              Runtime.trap(
                "ICP transfer to seller failed: settlement escrow needs top-up. Required: " #
                Nat64.toText(expectedDebit) # " e8s, balance: " # Nat64.toText(escrowBalance) # " e8s"
              );
            };
            let timestamp = ledgerTimestampNow();
            settlement := {
              settlement with
              ledgerFeeE8s = currentFee;
              sellerPaymentCreatedAt = ?timestamp;
              updatedAt = Time.now();
            };
            MarketplaceLib.putAuctionSettlement(marketplaceSettlementState, settlement);
            {
              createdAt = timestamp;
              amount = settlement.sellerProceeds;
            };
          };
        };
        let sellerSub = IcpLib.principalToSubaccount(settlement.seller);
        let sellerAccount = IcpLib.accountIdentifier(canisterId, sellerSub);
        let sellerResult = await* IcpLib.transferOutWithFeeAt(
          ledger,
          ?escrowSub,
          sellerAccount,
          sellerTransfer.amount,
          Nat64.fromNat(settlement.listingId),
          settlement.ledgerFeeE8s,
          sellerTransfer.createdAt,
        );
        switch (transferBlockResult(sellerResult)) {
          case (#ok(sellerBlock)) {
            settlement := {
              settlement with
              sellerPaymentBlock = ?sellerBlock;
              updatedAt = Time.now();
            };
            MarketplaceLib.putAuctionSettlement(marketplaceSettlementState, settlement);
          };
          case (#badFee(expectedFee)) {
            let updated = {
              settlement with
              ledgerFeeE8s = expectedFee;
              sellerPaymentCreatedAt = null;
              updatedAt = Time.now();
            };
            await* persistAuctionSettlementAndTrap(
              updated,
              "ICP transfer to seller failed: ledger fee changed; retry settlement",
            );
          };
          case (#insufficientFunds(balance)) {
            Runtime.trap(
              "ICP transfer to seller failed: settlement escrow needs top-up before payout. Balance: " #
              Nat64.toText(balance) # " e8s"
            );
          };
          case (#tooOld) {
            let escrowAccount = IcpLib.accountIdentifier(canisterId, escrowSub);
            let escrowBalance = await* IcpLib.getBalance(ledger, escrowAccount);
            if (escrowBalance == 0) {
              settlement := {
                settlement with
                sellerPaymentBlock = ?(0 : Nat64);
                updatedAt = Time.now();
              };
              MarketplaceLib.putAuctionSettlement(marketplaceSettlementState, settlement);
            } else {
              let currentFee = await* IcpLib.getTransferFee(ledger);
              let expectedDebit = settlement.sellerProceeds + currentFee;
              if (escrowBalance >= expectedDebit) {
                let updated = {
                  settlement with
                  ledgerFeeE8s = currentFee;
                  sellerPaymentCreatedAt = null;
                  updatedAt = Time.now();
                };
                await* persistAuctionSettlementAndTrap(
                  updated,
                  "ICP transfer to seller timestamp expired; retry settlement with a fresh timestamp",
                );
              } else {
                Runtime.trap("ICP transfer to seller timestamp expired and escrow balance needs admin review");
              };
            };
          };
          case (#createdInFuture) {
            let updated = {
              settlement with
              sellerPaymentCreatedAt = null;
              updatedAt = Time.now();
            };
            await* persistAuctionSettlementAndTrap(
              updated,
              "ICP transfer to seller timestamp was in the future; retry settlement",
            );
          };
        };
      };
      case (?_) {};
    };

    await* refundRemainingEscrowBalanceToUser(
      ledger,
      escrowSub,
      settlement.winner,
      Nat64.fromNat(settlement.listingId),
      "Auction settlement",
    );

    ignore MarketplaceLib.removeAuctionEscrow(marketplacePaymentState, settlement.listingId);
    ignore MarketplaceLib.removePendingRefund(marketplacePaymentState, settlement.winningEscrowId);
    ignore MarketplaceLib.removePendingRefundJournal(marketplaceRefundState, settlement.winningEscrowId);
    ignore MarketplaceLib.settleAuction(marketplaceState, settlement.listingId);
    ignore MarketplaceLib.takeEscrowedNFT(marketplaceState, settlement.listingId);
    ignore MarketplaceLib.clearListingsForToken(marketplaceState, settlement.nft.collectionId, settlement.nft.tokenId);
    ignore MarketplaceLib.removeAuctionSettlement(marketplaceSettlementState, settlement.listingId);
  };

  func resolveWinningEscrow(
    listing : MarketplaceTypes.AuctionListing,
    winner : Principal,
  ) : ?MarketplaceTypes.AuctionEscrow {
    let current = switch (MarketplaceLib.getAuctionEscrow(marketplacePaymentState, listing.id)) {
      case (?escrow) ?escrow;
      case null MarketplaceLib.findPendingAuctionEscrow(
        marketplacePaymentState,
        listing.id,
        winner,
        listing.highestBid,
      );
    };
    switch (current) {
      case null null;
      case (?escrow) {
        if (
          escrow.listingId != listing.id or
          not Principal.equal(escrow.bidder, winner) or
          escrow.amount != listing.highestBid
        ) {
          Runtime.trap("Winning bid escrow does not match the auction state");
        };
        ?escrow;
      };
    };
  };

  func ensureEscrowedNFTReady(nft : WalletTypes.WalletNFT) : async* () {
    switch (nft.location) {
      case (#Minted) {
        await* ensureMintedNFTReady(nft, canisterId);
      };
      case (#Vaulted) {
        let collection = externalCollection(nft);
        let vaultAccountId = IcpLib.accountIdentifier(canisterId, IcpLib.zeroSubaccount());
        switch (
          await* WalletLib.isNFTCurrentlyOwnedBy(
            collection,
            canisterId,
            vaultAccountId,
            nft.tokenId,
          )
        ) {
          case (#ok(true)) {};
          case (#ok(false)) Runtime.trap("Escrowed external NFT is not held by the app vault");
          case (#err(message)) Runtime.trap(message);
        };
      };
      case (#Registered) {
        Runtime.trap("Registered external NFTs must be deposited into the app vault before listing");
      };
    };
  };

  func startListingReturnSettlement(
    listingId : MarketplaceTypes.ListingId,
    seller : Principal,
    nft : WalletTypes.WalletNFT,
    reason : MarketplaceTypes.ListingReturnReason,
    refundEscrow : ?MarketplaceTypes.AuctionEscrow,
  ) : MarketplaceTypes.ListingReturnSettlement {
    let now = Time.now();
    let settlement : MarketplaceTypes.ListingReturnSettlement = {
      listingId;
      seller;
      nft;
      reason;
      refundEscrow;
      returnedAt = null;
      walletRegisteredAt = null;
      stage = #NFTReturnPending;
      createdAt = now;
      updatedAt = now;
    };
    MarketplaceLib.putListingReturn(marketplaceListingReturnState, settlement);
    settlement;
  };

  func continueListingReturnSettlement(
    listingId : MarketplaceTypes.ListingId
  ) : async* () {
    var settlement = switch (MarketplaceLib.getListingReturn(marketplaceListingReturnState, listingId)) {
      case null Runtime.trap("Listing return settlement not found");
      case (?value) value;
    };

    switch (settlement.returnedAt) {
      case null {
        let returnedLocation = await* transferEscrowedNFTToRecipient(settlement.nft, settlement.seller);
        let returnedAt = Time.now();
        settlement := {
          settlement with
          returnedAt = ?returnedAt;
          stage = #WalletRegistrationPending;
          updatedAt = returnedAt;
        };
        MarketplaceLib.putListingReturn(marketplaceListingReturnState, settlement);

        ignore WalletLib.registerNFT(
          walletState,
          settlement.seller,
          settlement.nft.collectionId,
          settlement.nft.tokenId,
          settlement.nft.metadata,
          returnedLocation,
        );
        let registeredAt = Time.now();
        settlement := {
          settlement with
          walletRegisteredAt = ?registeredAt;
          stage = #CleanupPending;
          updatedAt = registeredAt;
        };
        MarketplaceLib.putListingReturn(marketplaceListingReturnState, settlement);
      };
      case (?_) {};
    };

    switch (settlement.walletRegisteredAt) {
      case null {
        ignore WalletLib.registerNFT(
          walletState,
          settlement.seller,
          settlement.nft.collectionId,
          settlement.nft.tokenId,
          settlement.nft.metadata,
          returnedWalletLocation(settlement.nft),
        );
        let registeredAt = Time.now();
        settlement := {
          settlement with
          walletRegisteredAt = ?registeredAt;
          stage = #CleanupPending;
          updatedAt = registeredAt;
        };
        MarketplaceLib.putListingReturn(marketplaceListingReturnState, settlement);
      };
      case (?_) {};
    };

    switch (settlement.refundEscrow) {
      case null {};
      case (?escrow) {
        MarketplaceLib.queueAuctionRefund(marketplacePaymentState, escrow);
        ignore MarketplaceLib.removeAuctionEscrow(marketplacePaymentState, settlement.listingId);
      };
    };

    ignore MarketplaceLib.cancelListing(marketplaceState, settlement.listingId);
    ignore MarketplaceLib.takeEscrowedNFT(marketplaceState, settlement.listingId);
    ignore MarketplaceLib.clearListingsForToken(
      marketplaceState,
      settlement.nft.collectionId,
      settlement.nft.tokenId,
    );
    ignore MarketplaceLib.removeListingReturn(marketplaceListingReturnState, settlement.listingId);

    switch (settlement.refundEscrow) {
      case null {};
      case (?escrow) {
        let ledger = actor (IcpLib.LEDGER_CANISTER_ID) : IcpLib.Ledger;
        let feeE8s = await* IcpLib.getTransferFee(ledger);
        switch (await* refundAuctionEscrow(ledger, escrow, feeE8s)) {
          case (#ok(_)) {};
          case (#err(_)) {};
        };
      };
    };
  };

  /// Cancel a listing; NFT returned from escrow; caller must be owner or admin
  public shared ({ caller }) func cancelListing(listingId : MarketplaceTypes.ListingId) : async () {
    let isCallerAdmin = AuthLib.isAdmin(authState, caller);

    switch (MarketplaceLib.getListingReturn(marketplaceListingReturnState, listingId)) {
      case null {};
      case (?settlement) {
        if (not Principal.equal(settlement.seller, caller) and not isCallerAdmin) {
          Runtime.trap("Unauthorized: must be seller or admin");
        };
        if (not MarketplaceLib.acquireListingLock(marketplacePaymentState, listingId)) {
          Runtime.trap("Listing is processing another return. Try again shortly.");
        };
        try {
          await* continueListingReturnSettlement(listingId);
        } finally {
          MarketplaceLib.releaseListingLock(marketplacePaymentState, listingId);
        };
        return;
      };
    };

    // Check authorization before cancelling
    switch (MarketplaceLib.getFixedListing(marketplaceState, listingId)) {
      case (?listing) {
        if (listing.status != #Active) Runtime.trap("Listing is not active");
        if (not Principal.equal(listing.seller, caller) and not isCallerAdmin) {
          Runtime.trap("Unauthorized: must be seller or admin");
        };
        if (not MarketplaceLib.acquireListingLock(marketplacePaymentState, listingId)) {
          Runtime.trap("Listing is processing another payment. Try again shortly.");
        };
        try {
          switch (MarketplaceLib.getFixedPurchaseSettlement(marketplaceSettlementState, listingId)) {
            case null {};
            case (?settlement) {
              switch (settlement.paymentBlock) {
                case null {
                  let ledger = actor (IcpLib.LEDGER_CANISTER_ID) : IcpLib.Ledger;
                  let escrowSub = IcpLib.marketplacePurchaseEscrowSubaccount(settlement.paymentEscrowId);
                  let escrowAccount = IcpLib.accountIdentifier(canisterId, escrowSub);
                  let escrowBalance = await* IcpLib.getBalance(ledger, escrowAccount);
                  let depositAmount = settlementPayoutDebit(
                    settlement.price,
                    settlement.mintlabFee,
                    settlement.ledgerFeeE8s,
                  );
                  if (escrowBalance >= depositAmount) {
                    Runtime.trap("Listing has a funded purchase escrow; retry settlement before cancelling");
                  };
                  ignore MarketplaceLib.removeFixedPurchaseSettlement(marketplaceSettlementState, listingId);
                };
                case (?_) Runtime.trap("Listing is already settling and cannot be cancelled");
              };
            };
          };
          let escrowedNFT = switch (MarketplaceLib.getEscrowedNFT(marketplaceState, listingId)) {
            case null Runtime.trap("Escrowed NFT not found for fixed listing");
            case (?nft) nft;
          };
          ignore startListingReturnSettlement(
            listingId,
            listing.seller,
            escrowedNFT,
            #FixedCancel,
            null,
          );
          await* continueListingReturnSettlement(listingId);
        } finally {
          MarketplaceLib.releaseListingLock(marketplacePaymentState, listingId);
        };
        return;
      };
      case null {};
    };

    switch (MarketplaceLib.getAuctionListing(marketplaceState, listingId)) {
      case (?listing) {
        if (listing.status != #Active) Runtime.trap("Listing is not active");
        if (not Principal.equal(listing.seller, caller) and not isCallerAdmin) {
          Runtime.trap("Unauthorized: must be seller or admin");
        };
        if (not MarketplaceLib.acquireListingLock(marketplacePaymentState, listingId)) {
          Runtime.trap("Auction is processing another payment. Try again shortly.");
        };
        try {
          switch (MarketplaceLib.getNoBidAuctionReturn(marketplaceNoBidAuctionReturnState, listingId)) {
            case null {};
            case (?_) Runtime.trap("Auction is already returning the NFT to the seller; retry settlement instead");
          };
          switch (MarketplaceLib.getAuctionSettlement(marketplaceSettlementState, listingId)) {
            case null {};
            case (?_) Runtime.trap("Auction is already settling and cannot be cancelled");
          };
          switch (MarketplaceLib.getPendingBidDeposit(marketplaceBidState, listingId)) {
            case null {};
            case (?_) Runtime.trap("Auction has a pending bid deposit; retry or resolve it before cancelling");
          };
          let escrowedNFT = switch (MarketplaceLib.getEscrowedNFT(marketplaceState, listingId)) {
            case null Runtime.trap("Escrowed NFT not found for auction listing");
            case (?nft) nft;
          };
          let currentEscrow = MarketplaceLib.getAuctionEscrow(marketplacePaymentState, listingId);
          ignore startListingReturnSettlement(
            listingId,
            listing.seller,
            escrowedNFT,
            #AuctionCancel,
            currentEscrow,
          );
          await* continueListingReturnSettlement(listingId);
        } finally {
          MarketplaceLib.releaseListingLock(marketplacePaymentState, listingId);
        };
        return;
      };
      case null {};
    };

    Runtime.trap("Listing not found");
  };

  func refundAuctionEscrow(
    ledger : IcpLib.Ledger,
    escrow : MarketplaceTypes.AuctionEscrow,
    feeE8s : Nat64,
  ) : async* { #ok : Nat64; #err : Text } {
    let escrowSub = IcpLib.marketplaceEscrowSubaccount(escrow.escrowId);
    let bidderSub = IcpLib.principalToSubaccount(escrow.bidder);
    let bidderAccount = IcpLib.accountIdentifier(canisterId, bidderSub);
    var pending = switch (MarketplaceLib.getPendingRefundJournal(marketplaceRefundState, escrow.escrowId)) {
      case (?existing) existing;
      case null {
        let escrowAccount = IcpLib.accountIdentifier(canisterId, escrowSub);
        let escrowBalance = await* IcpLib.getBalance(ledger, escrowAccount);
        if (escrowBalance <= feeE8s) {
          return #err("Escrow balance is not enough to pay the refund ledger fee");
        };
        let now = Time.now();
        let created : MarketplaceTypes.PendingAuctionRefund = {
          escrow;
          refundAmount = escrowBalance - feeE8s;
          refundFeeE8s = feeE8s;
          refundCreatedAt = ledgerTimestampNow();
          refundBlock = null;
          createdAt = now;
          updatedAt = now;
        };
        MarketplaceLib.putPendingRefundJournal(marketplaceRefundState, created);
        created;
      };
    };
    let result = await* IcpLib.transferOutWithFeeAt(
      ledger,
      ?escrowSub,
      bidderAccount,
      pending.refundAmount,
      Nat64.fromNat(escrow.listingId),
      pending.refundFeeE8s,
      pending.refundCreatedAt,
    );
    switch (result) {
      case (#Ok(blockIndex)) {
        MarketplaceLib.putPendingRefundJournal(marketplaceRefundState, {
          pending with
          refundBlock = ?blockIndex;
          updatedAt = Time.now();
        });
        ignore MarketplaceLib.removePendingRefund(marketplacePaymentState, escrow.escrowId);
        ignore MarketplaceLib.removePendingRefundJournal(marketplaceRefundState, escrow.escrowId);
        #ok(blockIndex);
      };
      case (#Err(#TxDuplicate({ duplicate_of }))) {
        MarketplaceLib.putPendingRefundJournal(marketplaceRefundState, {
          pending with
          refundBlock = ?duplicate_of;
          updatedAt = Time.now();
        });
        ignore MarketplaceLib.removePendingRefund(marketplacePaymentState, escrow.escrowId);
        ignore MarketplaceLib.removePendingRefundJournal(marketplaceRefundState, escrow.escrowId);
        #ok(duplicate_of);
      };
      case (#Err(#BadFee({ expected_fee }))) {
        let escrowAccount = IcpLib.accountIdentifier(canisterId, escrowSub);
        let escrowBalance = await* IcpLib.getBalance(ledger, escrowAccount);
        if (escrowBalance <= expected_fee.e8s) {
          return #err("Escrow balance is not enough to pay the updated refund ledger fee");
        };
        pending := {
          pending with
          refundAmount = escrowBalance - expected_fee.e8s;
          refundFeeE8s = expected_fee.e8s;
          refundCreatedAt = ledgerTimestampNow();
          updatedAt = Time.now();
        };
        MarketplaceLib.putPendingRefundJournal(marketplaceRefundState, pending);
        #err("Ledger fee changed; retry refund with the updated fee");
      };
      case (#Err(#InsufficientFunds({ balance }))) {
        if (balance.e8s <= pending.refundFeeE8s) {
          return #err("Escrow balance is not enough to pay the refund ledger fee");
        };
        pending := {
          pending with
          refundAmount = balance.e8s - pending.refundFeeE8s;
          refundCreatedAt = ledgerTimestampNow();
          updatedAt = Time.now();
        };
        MarketplaceLib.putPendingRefundJournal(marketplaceRefundState, pending);
        #err("Refund amount adjusted to remaining escrow balance; retry refund");
      };
      case (#Err(#TxTooOld(_))) {
        let escrowAccount = IcpLib.accountIdentifier(canisterId, escrowSub);
        let escrowBalance = await* IcpLib.getBalance(ledger, escrowAccount);
        if (escrowBalance == 0) {
          ignore MarketplaceLib.removePendingRefund(marketplacePaymentState, escrow.escrowId);
          ignore MarketplaceLib.removePendingRefundJournal(marketplaceRefundState, escrow.escrowId);
          return #ok(0);
        };
        let currentFee = await* IcpLib.getTransferFee(ledger);
        if (escrowBalance <= currentFee) {
          return #err("Escrow balance is not enough to pay the refund ledger fee");
        };
        pending := {
          pending with
          refundAmount = escrowBalance - currentFee;
          refundFeeE8s = currentFee;
          refundCreatedAt = ledgerTimestampNow();
          updatedAt = Time.now();
        };
        MarketplaceLib.putPendingRefundJournal(marketplaceRefundState, pending);
        #err("Refund timestamp expired; retry refund with a fresh timestamp");
      };
      case (#Err(#TxCreatedInFuture)) {
        pending := {
          pending with
          refundCreatedAt = ledgerTimestampNow();
          updatedAt = Time.now();
        };
        MarketplaceLib.putPendingRefundJournal(marketplaceRefundState, pending);
        #err("Refund timestamp was in the future; retry refund");
      };
    };
  };

  func prepareNFTForListing(nft : WalletTypes.WalletNFT, owner : Principal) : async* () {
    switch (nft.location) {
      case (#Minted) {
        if (await* isMintedNFTOwnedBy(nft, canisterId)) {
          return;
        };
        await* transferMintedNFT(nft, owner, canisterId);
      };
      case (#Vaulted) {
        await* ensureEscrowedNFTReady(nft);
      };
      case (#Registered) {
        Runtime.trap("Deposit this external NFT into the app vault before listing it");
      };
    };
  };

  func transferEscrowedNFTToRecipient(
    nft : WalletTypes.WalletNFT,
    to : Principal,
  ) : async* WalletTypes.WalletLocation {
    switch (nft.location) {
      case (#Minted) {
        if (await* isMintedNFTOwnedBy(nft, to)) {
          return #Minted;
        };
        await* transferMintedNFT(nft, canisterId, to);
        #Minted;
      };
      case (#Vaulted) {
        ignore to;
        await* ensureEscrowedNFTReady(nft);
        #Vaulted;
      };
      case (#Registered) {
        Runtime.trap("Registered external NFTs are not escrowed by the marketplace");
      };
    };
  };

  func isMintedNFTOwnedBy(
    nft : WalletTypes.WalletNFT,
    owner : Principal,
  ) : async* Bool {
    let collection = mintedCollection(nft);
    let tokenId = switch (Nat.fromText(nft.tokenId)) {
      case null Runtime.trap("Minted token IDs must be numeric");
      case (?value) value;
    };
    if (Principal.equal(collection.canisterId, canisterId)) {
      switch (MintLib.getToken(mintState, tokenId)) {
        case null false;
        case (?token) {
          MintLib.tokenBelongsToCollection(
            token,
            collection.id,
            MintLib.getConfig(mintState).collectionId,
          ) and Principal.equal(token.owner, owner);
        };
      };
    } else {
      let child : MarketplaceChildCollectionActor = actor (collection.canisterId.toText());
      let owners = try {
        await child.mintlab_owner_of([tokenId]);
      } catch (error) {
        Runtime.trap("Collection canister ownership check failed: " # Error.message(error));
      };
      if (owners.size() == 0) {
        return false;
      };
      switch (owners[0]) {
        case (?(account)) Principal.equal(account.owner, owner);
        case null false;
      };
    };
  };

  func transferMintedNFT(
    nft : WalletTypes.WalletNFT,
    from : Principal,
    to : Principal,
  ) : async* () {
    let collection = mintedCollection(nft);
    let tokenId = switch (Nat.fromText(nft.tokenId)) {
      case null Runtime.trap("Minted token IDs must be numeric");
      case (?value) value;
    };
    if (Principal.equal(collection.canisterId, canisterId)) {
      ensureLocalMintedToken(collection, tokenId, from);
      switch (MintLib.transferToken(mintState, tokenId, from, to)) {
        case (#ok(_)) {};
        case (#err(message)) Runtime.trap(message);
      };
    } else {
      let child : MarketplaceChildCollectionActor = actor (collection.canisterId.toText());
      let result = try {
        await child.mintlab_transfer_from(from, to, tokenId);
      } catch (error) {
        Runtime.trap("Collection canister transfer failed: " # Error.message(error));
      };
      switch (result) {
        case (#ok(_)) {};
        case (#err(message)) Runtime.trap(message);
      };
    };
  };

  func ensureMintedNFTReady(
    nft : WalletTypes.WalletNFT,
    owner : Principal,
  ) : async* () {
    let collection = mintedCollection(nft);
    let tokenId = switch (Nat.fromText(nft.tokenId)) {
      case null Runtime.trap("Minted token IDs must be numeric");
      case (?value) value;
    };
    if (Principal.equal(collection.canisterId, canisterId)) {
      ensureLocalMintedToken(collection, tokenId, owner);
    } else {
      let child : MarketplaceChildCollectionActor = actor (collection.canisterId.toText());
      let owners = try {
        await child.mintlab_owner_of([tokenId]);
      } catch (error) {
        Runtime.trap("Collection canister ownership check failed: " # Error.message(error));
      };
      if (owners.size() == 0) {
        Runtime.trap("Collection canister returned no owner for this minted NFT");
      };
      switch (owners[0]) {
        case (?(account)) {
          if (not Principal.equal(account.owner, owner)) {
            Runtime.trap("Escrowed minted NFT is not held by the expected owner");
          };
        };
        case null Runtime.trap("Minted NFT not found on collection canister");
      };
    };
  };

  func mintedCollection(nft : WalletTypes.WalletNFT) : CollectionTypes.Collection {
    let collection = switch (CollectionsLib.getCollection(collectionsState, nft.collectionId)) {
      case null Runtime.trap("Collection not found for minted NFT");
      case (?value) value;
    };
    if (collection.kind != #Minted) {
      Runtime.trap("Minted wallet NFT does not belong to a Mintlab collection");
    };
    collection;
  };

  func externalCollection(nft : WalletTypes.WalletNFT) : CollectionTypes.Collection {
    let collection = switch (CollectionsLib.getCollection(collectionsState, nft.collectionId)) {
      case null Runtime.trap("Collection not found for external NFT");
      case (?value) value;
    };
    if (collection.kind != #External) {
      Runtime.trap("Vaulted wallet NFT does not belong to an external collection");
    };
    collection;
  };

  func ensureLocalMintedToken(
    collection : CollectionTypes.Collection,
    tokenId : Nat,
    owner : Principal,
  ) {
    switch (MintLib.getToken(mintState, tokenId)) {
      case null Runtime.trap("Minted token not found");
      case (?token) {
        if (
          not MintLib.tokenBelongsToCollection(
            token,
            collection.id,
            MintLib.getConfig(mintState).collectionId,
          )
        ) {
          Runtime.trap("This minted NFT does not belong to the selected collection");
        };
        if (not Principal.equal(token.owner, owner)) {
          Runtime.trap("You do not own this minted NFT");
        };
      };
    };
  };
};
