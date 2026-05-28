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

  type MarketplaceActionResult = {
    #ok : Bool;
    #err : Text;
  };

  type MarketplaceBidResult = {
    #ok : MarketplaceTypes.AuctionListing;
    #err : Text;
  };

  type MarketplaceNFTTransferResult = {
    #ok : WalletTypes.WalletLocation;
    #err : Text;
  };

  type MarketplaceBoolResult = {
    #ok : Bool;
    #err : Text;
  };

  type PendingBidResolutionMode = {
    #PublicRecovery;
    #AdminResolve;
  };

  type MarketplaceICRC7Account = {
    owner : Principal;
    subaccount : ?Blob;
  };

  type MarketplaceChildCollectionActor = actor {
    mintlab_transfer_from : (Principal, Principal, Nat) -> async MarketplaceChildTransferResult;
    mintlab_owner_of : ([Nat]) -> async [?MarketplaceICRC7Account];
  };

  let PENDING_BID_TIMEOUT_NS : Int = 5 * 60 * 1_000_000_000;

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

  func persistFixedPurchaseSettlementErr(
    settlement : MarketplaceTypes.FixedPurchaseSettlement,
    message : Text,
  ) : MarketplaceActionResult {
    MarketplaceLib.putFixedPurchaseSettlement(marketplaceSettlementState, settlement);
    #err(message);
  };

  func persistAuctionSettlementErr(
    settlement : MarketplaceTypes.AuctionSettlement,
    message : Text,
  ) : MarketplaceActionResult {
    MarketplaceLib.putAuctionSettlement(marketplaceSettlementState, settlement);
    #err(message);
  };

  func persistPendingBidDepositErr(
    pending : MarketplaceTypes.PendingBidDeposit,
    message : Text,
  ) : MarketplaceBidResult {
    MarketplaceLib.putPendingBidDeposit(marketplaceBidState, pending);
    #err(message);
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

  func auctionListingHasAcceptedBid(listing : MarketplaceTypes.AuctionListing) : Bool {
    if (listing.highestBid > 0) return true;
    switch (listing.highestBidder) {
      case (?_) true;
      case null false;
    };
  };

  func pendingBidAttemptReference(pending : MarketplaceTypes.PendingBidDeposit) : Int {
    switch (pending.paymentAttemptedAt) {
      case (?timestamp) timestamp;
      case null pending.createdAt;
    };
  };

  func pendingBidTimedOut(pending : MarketplaceTypes.PendingBidDeposit) : Bool {
    switch (pending.paymentBlock) {
      case (?_) false;
      case null {
        let attemptedAt = pendingBidAttemptReference(pending);
        let now = Time.now();
        now > attemptedAt and now - attemptedAt > PENDING_BID_TIMEOUT_NS;
      };
    };
  };

  func settlementPayoutDebit(amount : Nat64, mintlabFee : Nat64, ledgerFeeE8s : Nat64) : Nat64 {
    let transferCount : Nat = if (mintlabFee > 0) 2 else 1;
    Nat64.fromNat(Nat64.toNat(amount) + (Nat64.toNat(ledgerFeeE8s) * transferCount));
  };

  func settlementRepairShortfall(requiredDebit : Nat64, escrowBalance : Nat64) : Nat64 {
    if (escrowBalance >= requiredDebit) 0 else requiredDebit - escrowBalance;
  };

  func settlementRepairRequiredDebit(
    price : Nat64,
    mintlabFee : Nat64,
    mintlabFeeCreatedAt : ?Nat64,
    mintlabFeeBlock : ?Nat64,
    sellerProceeds : Nat64,
    sellerPaymentBlock : ?Nat64,
    currentFee : Nat64,
  ) : Nat64 {
    switch (sellerPaymentBlock) {
      case (?_) 0;
      case null {
        let sellerDebit = sellerProceeds + currentFee;
        if (mintlabFee > 0 and mintlabFeeBlock == null) {
          switch (mintlabFeeCreatedAt) {
            case (?_) Runtime.trap("Mintlab fee transfer is unresolved; inspect or reset Mintlab fee recovery before topping up escrow");
            case null settlementPayoutDebit(price, mintlabFee, currentFee);
          };
        } else {
          sellerDebit;
        };
      };
    };
  };

  func makeSettlementEscrowRepairQuote(
    ledger : IcpLib.Ledger,
    caller : Principal,
    listingId : MarketplaceTypes.ListingId,
    kind : MarketplaceTypes.SettlementEscrowRepairKind,
    escrowId : Nat,
    escrowAccount : MarketplaceTypes.AccountIdentifier,
    escrowBalance : Nat64,
    requiredDebit : Nat64,
    currentFee : Nat64,
    sellerProceeds : Nat64,
    mintlabFee : Nat64,
  ) : async* MarketplaceTypes.SettlementEscrowRepairQuote {
    let topUpFromSub = IcpLib.principalToSubaccount(caller);
    let topUpFromAccount = IcpLib.accountIdentifier(canisterId, topUpFromSub);
    let topUpFromBalance = await* IcpLib.getBalance(ledger, topUpFromAccount);
    let shortfall = settlementRepairShortfall(requiredDebit, escrowBalance);
    let topUpTotalDebit : Nat64 = if (shortfall == 0) 0 else shortfall + currentFee;
    {
      listingId;
      kind;
      escrowId;
      escrowAccount;
      escrowBalance;
      requiredDebit;
      shortfall;
      ledgerFeeE8s = currentFee;
      sellerProceeds;
      mintlabFee;
      topUpFromAccount;
      topUpFromBalance;
      topUpTransferFeeE8s = currentFee;
      topUpTotalDebit;
    };
  };

  func fixedSettlementEscrowRepairQuote(
    ledger : IcpLib.Ledger,
    caller : Principal,
    settlement : MarketplaceTypes.FixedPurchaseSettlement,
  ) : async* MarketplaceTypes.SettlementEscrowRepairQuote {
    switch (settlement.paymentBlock) {
      case null Runtime.trap("Purchase escrow payment is not recorded; retry fixed purchase settlement before topping up escrow");
      case (?_) {};
    };
    let currentFee = await* IcpLib.getTransferFee(ledger);
    let escrowSub = IcpLib.marketplacePurchaseEscrowSubaccount(settlement.paymentEscrowId);
    let escrowAccount = IcpLib.accountIdentifier(canisterId, escrowSub);
    let escrowBalance = await* IcpLib.getBalance(ledger, escrowAccount);
    let requiredDebit = settlementRepairRequiredDebit(
      settlement.price,
      settlement.mintlabFee,
      settlement.mintlabFeeCreatedAt,
      settlement.mintlabFeeBlock,
      settlement.sellerProceeds,
      settlement.sellerPaymentBlock,
      currentFee,
    );
    await* makeSettlementEscrowRepairQuote(
      ledger,
      caller,
      settlement.listingId,
      #FixedPurchase,
      settlement.paymentEscrowId,
      escrowAccount,
      escrowBalance,
      requiredDebit,
      currentFee,
      settlement.sellerProceeds,
      settlement.mintlabFee,
    );
  };

  func auctionSettlementEscrowRepairQuote(
    ledger : IcpLib.Ledger,
    caller : Principal,
    settlement : MarketplaceTypes.AuctionSettlement,
  ) : async* MarketplaceTypes.SettlementEscrowRepairQuote {
    let currentFee = await* IcpLib.getTransferFee(ledger);
    let escrowSub = IcpLib.marketplaceEscrowSubaccount(settlement.winningEscrowId);
    let escrowAccount = IcpLib.accountIdentifier(canisterId, escrowSub);
    let escrowBalance = await* IcpLib.getBalance(ledger, escrowAccount);
    let requiredDebit = settlementRepairRequiredDebit(
      settlement.price,
      settlement.mintlabFee,
      settlement.mintlabFeeCreatedAt,
      settlement.mintlabFeeBlock,
      settlement.sellerProceeds,
      settlement.sellerPaymentBlock,
      currentFee,
    );
    await* makeSettlementEscrowRepairQuote(
      ledger,
      caller,
      settlement.listingId,
      #Auction,
      settlement.winningEscrowId,
      escrowAccount,
      escrowBalance,
      requiredDebit,
      currentFee,
      settlement.sellerProceeds,
      settlement.mintlabFee,
    );
  };

  func getSettlementEscrowRepairQuoteForCaller(
    ledger : IcpLib.Ledger,
    caller : Principal,
    listingId : MarketplaceTypes.ListingId,
  ) : async* MarketplaceTypes.SettlementEscrowRepairQuote {
    switch (MarketplaceLib.getFixedPurchaseSettlement(marketplaceSettlementState, listingId)) {
      case (?settlement) {
        return await* fixedSettlementEscrowRepairQuote(ledger, caller, settlement);
      };
      case null {};
    };
    switch (MarketplaceLib.getAuctionSettlement(marketplaceSettlementState, listingId)) {
      case (?settlement) {
        return await* auctionSettlementEscrowRepairQuote(ledger, caller, settlement);
      };
      case null {};
    };
    Runtime.trap("Settlement not found for listing");
  };

  func makeMintlabFeeRecoveryQuote(
    listingId : MarketplaceTypes.ListingId,
    kind : MarketplaceTypes.SettlementEscrowRepairKind,
    escrowId : Nat,
    escrowAccount : MarketplaceTypes.AccountIdentifier,
    escrowBalance : Nat64,
    price : Nat64,
    sellerProceeds : Nat64,
    mintlabFee : Nat64,
    feeRecipient : MarketplaceTypes.AccountIdentifier,
    previousMintlabFeeCreatedAt : Nat64,
    currentFee : Nat64,
  ) : MarketplaceTypes.MintlabFeeRecoveryQuote {
    let expectedBeforeFee = settlementPayoutDebit(price, mintlabFee, currentFee);
    let expectedAfterFee = sellerProceeds + currentFee;
    {
      listingId;
      kind;
      escrowId;
      escrowAccount;
      escrowBalance;
      expectedBeforeMintlabFeeDebit = expectedBeforeFee;
      expectedAfterMintlabFeeDebit = expectedAfterFee;
      shortfallBeforeMintlabFee = settlementRepairShortfall(expectedBeforeFee, escrowBalance);
      sellerProceeds;
      mintlabFee;
      ledgerFeeE8s = currentFee;
      feeRecipient;
      previousMintlabFeeCreatedAt;
    };
  };

  func fixedMintlabFeeRecoveryQuote(
    ledger : IcpLib.Ledger,
    settlement : MarketplaceTypes.FixedPurchaseSettlement,
  ) : async* MarketplaceTypes.MintlabFeeRecoveryQuote {
    if (settlement.mintlabFee == 0) {
      Runtime.trap("Settlement does not include a Mintlab fee");
    };
    switch (settlement.paymentBlock) {
      case null Runtime.trap("Purchase escrow payment is not recorded; retry fixed purchase settlement first");
      case (?_) {};
    };
    switch (settlement.mintlabFeeBlock) {
      case (?_) Runtime.trap("Mintlab fee is already recorded");
      case null {};
    };
    switch (settlement.sellerPaymentBlock) {
      case (?_) Runtime.trap("Seller payment is already recorded");
      case null {};
    };
    let previousCreatedAt = switch (settlement.mintlabFeeCreatedAt) {
      case (?timestamp) timestamp;
      case null Runtime.trap("No unresolved Mintlab fee attempt is recorded for this settlement");
    };
    let feeRecipient = switch (settlement.feeRecipient) {
      case (?account) account;
      case null Runtime.trap("Mintlab sales fee account is missing from purchase settlement");
    };
    let currentFee = await* IcpLib.getTransferFee(ledger);
    let escrowSub = IcpLib.marketplacePurchaseEscrowSubaccount(settlement.paymentEscrowId);
    let escrowAccount = IcpLib.accountIdentifier(canisterId, escrowSub);
    let escrowBalance = await* IcpLib.getBalance(ledger, escrowAccount);
    makeMintlabFeeRecoveryQuote(
      settlement.listingId,
      #FixedPurchase,
      settlement.paymentEscrowId,
      escrowAccount,
      escrowBalance,
      settlement.price,
      settlement.sellerProceeds,
      settlement.mintlabFee,
      feeRecipient,
      previousCreatedAt,
      currentFee,
    );
  };

  func auctionMintlabFeeRecoveryQuote(
    ledger : IcpLib.Ledger,
    settlement : MarketplaceTypes.AuctionSettlement,
  ) : async* MarketplaceTypes.MintlabFeeRecoveryQuote {
    if (settlement.mintlabFee == 0) {
      Runtime.trap("Settlement does not include a Mintlab fee");
    };
    switch (settlement.mintlabFeeBlock) {
      case (?_) Runtime.trap("Mintlab fee is already recorded");
      case null {};
    };
    switch (settlement.sellerPaymentBlock) {
      case (?_) Runtime.trap("Seller payment is already recorded");
      case null {};
    };
    let previousCreatedAt = switch (settlement.mintlabFeeCreatedAt) {
      case (?timestamp) timestamp;
      case null Runtime.trap("No unresolved Mintlab fee attempt is recorded for this settlement");
    };
    let feeRecipient = switch (settlement.feeRecipient) {
      case (?account) account;
      case null Runtime.trap("Mintlab sales fee account is missing from auction settlement");
    };
    let currentFee = await* IcpLib.getTransferFee(ledger);
    let escrowSub = IcpLib.marketplaceEscrowSubaccount(settlement.winningEscrowId);
    let escrowAccount = IcpLib.accountIdentifier(canisterId, escrowSub);
    let escrowBalance = await* IcpLib.getBalance(ledger, escrowAccount);
    makeMintlabFeeRecoveryQuote(
      settlement.listingId,
      #Auction,
      settlement.winningEscrowId,
      escrowAccount,
      escrowBalance,
      settlement.price,
      settlement.sellerProceeds,
      settlement.mintlabFee,
      feeRecipient,
      previousCreatedAt,
      currentFee,
    );
  };

  func getMintlabFeeRecoveryQuote(
    ledger : IcpLib.Ledger,
    listingId : MarketplaceTypes.ListingId,
  ) : async* MarketplaceTypes.MintlabFeeRecoveryQuote {
    switch (MarketplaceLib.getFixedPurchaseSettlement(marketplaceSettlementState, listingId)) {
      case (?settlement) {
        return await* fixedMintlabFeeRecoveryQuote(ledger, settlement);
      };
      case null {};
    };
    switch (MarketplaceLib.getAuctionSettlement(marketplaceSettlementState, listingId)) {
      case (?settlement) {
        return await* auctionMintlabFeeRecoveryQuote(ledger, settlement);
      };
      case null {};
    };
    Runtime.trap("Settlement not found for listing");
  };

  func refundRemainingEscrowBalanceToUser(
    ledger : IcpLib.Ledger,
    escrowSub : Blob,
    recipient : Principal,
    memo : Nat64,
    context : Text,
  ) : async* MarketplaceActionResult {
    let escrowAccount = IcpLib.accountIdentifier(canisterId, escrowSub);
    let escrowBalance = await* IcpLib.getBalance(ledger, escrowAccount);
    let currentFee = await* IcpLib.getTransferFee(ledger);
    if (escrowBalance <= currentFee) {
      return #ok(true);
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
      case (#ok(_)) #ok(true);
      case (#badFee(_)) #err(context # " fee-reserve refund failed: ledger fee changed; retry settlement");
      case (#insufficientFunds(_)) #err(context # " fee-reserve refund failed: escrow balance changed; retry settlement");
      case (#tooOld) #err(context # " fee-reserve refund timestamp expired; retry settlement");
      case (#createdInFuture) #err(context # " fee-reserve refund timestamp was in the future; retry settlement");
    };
  };

  func cursorOrZero(cursor : ?Nat) : Nat {
    switch (cursor) {
      case (?value) value;
      case null 0;
    };
  };

  func normalizeMarketplacePageSize(limit : ?Nat) : Nat {
    switch (limit) {
      case null 25;
      case (?value) {
        if (value == 0) {
          1;
        } else if (value > 100) {
          100;
        } else {
          value;
        };
      };
    };
  };

  func settlementStatusPage(
    statuses : [MarketplaceTypes.SettlementStatus],
    start : Nat,
    limit : Nat,
  ) : MarketplaceTypes.SettlementStatusPage {
    var page : [MarketplaceTypes.SettlementStatus] = [];
    var index : Nat = 0;
    var added : Nat = 0;
    for (status in statuses.values()) {
      if (index < start) {
        index += 1;
      } else if (added < limit) {
        page := Array.concat<MarketplaceTypes.SettlementStatus>(page, [status]);
        added += 1;
        index += 1;
      } else {
        return {
          statuses = page;
          nextCursor = ?index;
          totalCount = statuses.size();
        };
      };
    };
    {
      statuses = page;
      nextCursor = null;
      totalCount = statuses.size();
    };
  };

  func sliceActiveListings(
    listings : [MarketplaceTypes.ActiveListing],
    start : Nat,
    limit : Nat,
  ) : [MarketplaceTypes.ActiveListing] {
    var page : [MarketplaceTypes.ActiveListing] = [];
    var index : Nat = 0;
    var added : Nat = 0;
    for (listing in listings.values()) {
      if (index < start) {
        index += 1;
      } else if (added < limit) {
        page := Array.concat<MarketplaceTypes.ActiveListing>(page, [listing]);
        added += 1;
        index += 1;
      } else {
        return page;
      };
    };
    page;
  };

  func sliceActiveListingDetails(
    details : [MarketplaceTypes.ActiveListingDetail],
    start : Nat,
    limit : Nat,
  ) : [MarketplaceTypes.ActiveListingDetail] {
    var page : [MarketplaceTypes.ActiveListingDetail] = [];
    var index : Nat = 0;
    var added : Nat = 0;
    for (detail in details.values()) {
      if (index < start) {
        index += 1;
      } else if (added < limit) {
        page := Array.concat<MarketplaceTypes.ActiveListingDetail>(page, [detail]);
        added += 1;
        index += 1;
      } else {
        return page;
      };
    };
    page;
  };

  func settlementStageText(stage : MarketplaceTypes.SettlementStage) : Text {
    switch (stage) {
      case (#PaymentPending) "payment pending";
      case (#NFTTransferPending) "NFT delivery pending";
      case (#MintlabFeePending) "marketplace fee pending";
      case (#SellerPaymentPending) "seller payout pending";
    };
  };

  func returnStageText(stage : MarketplaceTypes.NoBidAuctionReturnStage) : Text {
    switch (stage) {
      case (#NFTReturnPending) "NFT return pending";
      case (#WalletRegistrationPending) "wallet registration pending";
      case (#CleanupPending) "cleanup pending";
    };
  };

  func fixedSettlementStatus(
    settlement : MarketplaceTypes.FixedPurchaseSettlement,
    role : MarketplaceTypes.SettlementStatusRole,
  ) : MarketplaceTypes.SettlementStatus {
    {
      listingId = settlement.listingId;
      kind = #FixedPurchase;
      role;
      stage = settlementStageText(settlement.stage);
      message = settlementStatusMessage(role, settlement.stage);
      updatedAt = settlement.updatedAt;
    };
  };

  func auctionSettlementStatus(
    settlement : MarketplaceTypes.AuctionSettlement,
    role : MarketplaceTypes.SettlementStatusRole,
  ) : MarketplaceTypes.SettlementStatus {
    {
      listingId = settlement.listingId;
      kind = #Auction;
      role;
      stage = settlementStageText(settlement.stage);
      message = settlementStatusMessage(role, settlement.stage);
      updatedAt = settlement.updatedAt;
    };
  };

  func settlementStatusMessage(
    role : MarketplaceTypes.SettlementStatusRole,
    stage : MarketplaceTypes.SettlementStage,
  ) : Text {
    switch (role) {
      case (#Buyer) {
        switch (stage) {
          case (#PaymentPending) "Your ICP payment is being recorded. Please do not submit the purchase again.";
          case (#NFTTransferPending) "Your payment is recorded and Mintlab is delivering the NFT.";
          case (#MintlabFeePending) "You should have the NFT; marketplace settlement is finishing fee transfer.";
          case (#SellerPaymentPending) "You should have the NFT; seller payout is pending and can be retried.";
        };
      };
      case (#Seller) {
        switch (stage) {
          case (#PaymentPending) "A buyer payment is being recorded before your NFT is delivered.";
          case (#NFTTransferPending) "Buyer payment is recorded and NFT delivery is pending.";
          case (#MintlabFeePending) "The NFT was delivered; marketplace fee transfer is pending before seller payout.";
          case (#SellerPaymentPending) "The NFT was delivered; your ICP payout is pending and can be retried.";
        };
      };
      case (#Bidder) "Auction payment or refund is still being settled.";
    };
  };

  func noBidReturnStatus(
    settlement : MarketplaceTypes.NoBidAuctionReturnSettlement
  ) : MarketplaceTypes.SettlementStatus {
    {
      listingId = settlement.listingId;
      kind = #NoBidAuctionReturn;
      role = #Seller;
      stage = returnStageText(settlement.stage);
      message = "Auction ended without bids; Mintlab is returning the NFT to your wallet.";
      updatedAt = settlement.updatedAt;
    };
  };

  func listingReturnStatus(
    settlement : MarketplaceTypes.ListingReturnSettlement
  ) : MarketplaceTypes.SettlementStatus {
    {
      listingId = settlement.listingId;
      kind = #ListingReturn;
      role = #Seller;
      stage = returnStageText(settlement.stage);
      message = "Listing cancellation is returning the NFT to your wallet.";
      updatedAt = settlement.updatedAt;
    };
  };

  func pendingBidStatus(
    pending : MarketplaceTypes.PendingBidDeposit
  ) : MarketplaceTypes.SettlementStatus {
    {
      listingId = pending.listingId;
      kind = #PendingBidDeposit;
      role = #Bidder;
      stage = "bid pending recovery";
      message = "Your bid deposit is still being recorded. Retry the bid, or cancel it after 5 minutes if escrow is unfunded.";
      updatedAt = pending.updatedAt;
    };
  };

  func pendingRefundStatus(
    escrow : MarketplaceTypes.AuctionEscrow
  ) : MarketplaceTypes.SettlementStatus {
    {
      listingId = escrow.listingId;
      kind = #PendingAuctionRefund;
      role = #Bidder;
      stage = "refund pending";
      message = "A previous auction bid refund is pending and can be retried.";
      updatedAt = escrow.createdAt;
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

  public query func getActiveListingsPage(
    cursor : ?Nat,
    limit : ?Nat,
  ) : async MarketplaceTypes.ActiveListingPage {
    MarketplaceLib.getAvailableActiveListingsPage(
      marketplaceState,
      marketplaceSettlementState,
      marketplaceNoBidAuctionReturnState,
      marketplaceListingReturnState,
      cursorOrZero(cursor),
      normalizeMarketplacePageSize(limit),
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

  public query func getActiveListingDetailsPage(
    cursor : ?Nat,
    limit : ?Nat,
  ) : async MarketplaceTypes.ActiveListingDetailPage {
    MarketplaceLib.getAvailableActiveListingDetailsPage(
      marketplaceState,
      marketplaceSettlementState,
      marketplaceNoBidAuctionReturnState,
      marketplaceListingReturnState,
      cursorOrZero(cursor),
      normalizeMarketplacePageSize(limit),
    );
  };

  public shared query ({ caller }) func getMyMarketplaceSettlementStatuses() : async [MarketplaceTypes.SettlementStatus] {
    if (Principal.isAnonymous(caller)) {
      return [];
    };
    myMarketplaceSettlementStatuses(caller);
  };

  public shared query ({ caller }) func getMyMarketplaceSettlementStatusesPage(
    cursor : ?Nat,
    limit : ?Nat,
  ) : async MarketplaceTypes.SettlementStatusPage {
    if (Principal.isAnonymous(caller)) {
      return { statuses = []; nextCursor = null; totalCount = 0 };
    };
    settlementStatusPage(
      myMarketplaceSettlementStatuses(caller),
      cursorOrZero(cursor),
      normalizeMarketplacePageSize(limit),
    );
  };

  func myMarketplaceSettlementStatuses(caller : Principal) : [MarketplaceTypes.SettlementStatus] {
    let indexedStatuses = myMarketplaceSettlementStatusesFromIndexes(caller);
    if (indexedStatuses.size() > 0) {
      return indexedStatuses;
    };
    myMarketplaceSettlementStatusesByScan(caller);
  };

  func myMarketplaceSettlementStatusesFromIndexes(
    caller : Principal
  ) : [MarketplaceTypes.SettlementStatus] {
    var statuses : [MarketplaceTypes.SettlementStatus] = [];

    for (listingId in MarketplaceLib.getSettlementListingIdsByUser(marketplaceSettlementState, caller).values()) {
      switch (MarketplaceLib.getFixedPurchaseSettlement(marketplaceSettlementState, listingId)) {
        case (?settlement) {
          if (Principal.equal(settlement.buyer, caller)) {
            statuses := Array.concat<MarketplaceTypes.SettlementStatus>(statuses, [fixedSettlementStatus(settlement, #Buyer)]);
          };
          if (Principal.equal(settlement.seller, caller)) {
            statuses := Array.concat<MarketplaceTypes.SettlementStatus>(statuses, [fixedSettlementStatus(settlement, #Seller)]);
          };
        };
        case null {};
      };
      switch (MarketplaceLib.getAuctionSettlement(marketplaceSettlementState, listingId)) {
        case (?settlement) {
          if (Principal.equal(settlement.winner, caller)) {
            statuses := Array.concat<MarketplaceTypes.SettlementStatus>(statuses, [auctionSettlementStatus(settlement, #Buyer)]);
          };
          if (Principal.equal(settlement.seller, caller)) {
            statuses := Array.concat<MarketplaceTypes.SettlementStatus>(statuses, [auctionSettlementStatus(settlement, #Seller)]);
          };
        };
        case null {};
      };
    };

    for (listingId in MarketplaceLib.getNoBidReturnListingIdsByUser(marketplaceNoBidAuctionReturnState, caller).values()) {
      switch (MarketplaceLib.getNoBidAuctionReturn(marketplaceNoBidAuctionReturnState, listingId)) {
        case (?settlement) {
          if (Principal.equal(settlement.seller, caller)) {
            statuses := Array.concat<MarketplaceTypes.SettlementStatus>(statuses, [noBidReturnStatus(settlement)]);
          };
        };
        case null {};
      };
    };

    for (listingId in MarketplaceLib.getListingReturnIdsByUser(marketplaceListingReturnState, caller).values()) {
      switch (MarketplaceLib.getListingReturn(marketplaceListingReturnState, listingId)) {
        case (?settlement) {
          if (Principal.equal(settlement.seller, caller)) {
            statuses := Array.concat<MarketplaceTypes.SettlementStatus>(statuses, [listingReturnStatus(settlement)]);
          };
        };
        case null {};
      };
    };

    for (listingId in MarketplaceLib.getPendingBidIdsByUser(marketplaceBidState, caller).values()) {
      switch (MarketplaceLib.getPendingBidDeposit(marketplaceBidState, listingId)) {
        case (?pending) {
          if (Principal.equal(pending.bidder, caller)) {
            statuses := Array.concat<MarketplaceTypes.SettlementStatus>(statuses, [pendingBidStatus(pending)]);
          };
        };
        case null {};
      };
    };

    for (escrowId in MarketplaceLib.getPendingRefundIdsByUser(marketplacePaymentState, caller).values()) {
      switch (MarketplaceLib.getPendingRefund(marketplacePaymentState, escrowId)) {
        case (?refund) {
          if (Principal.equal(refund.bidder, caller)) {
            statuses := Array.concat<MarketplaceTypes.SettlementStatus>(statuses, [pendingRefundStatus(refund)]);
          };
        };
        case null {};
      };
    };

    statuses;
  };

  func myMarketplaceSettlementStatusesByScan(
    caller : Principal
  ) : [MarketplaceTypes.SettlementStatus] {
    var statuses : [MarketplaceTypes.SettlementStatus] = [];
    for (settlement in MarketplaceLib.listFixedPurchaseSettlements(marketplaceSettlementState).values()) {
      if (Principal.equal(settlement.buyer, caller)) {
        statuses := Array.concat<MarketplaceTypes.SettlementStatus>(
          statuses,
          [fixedSettlementStatus(settlement, #Buyer)],
        );
      };
      if (Principal.equal(settlement.seller, caller)) {
        statuses := Array.concat<MarketplaceTypes.SettlementStatus>(
          statuses,
          [fixedSettlementStatus(settlement, #Seller)],
        );
      };
    };
    for (settlement in MarketplaceLib.listAuctionSettlements(marketplaceSettlementState).values()) {
      if (Principal.equal(settlement.winner, caller)) {
        statuses := Array.concat<MarketplaceTypes.SettlementStatus>(
          statuses,
          [auctionSettlementStatus(settlement, #Buyer)],
        );
      };
      if (Principal.equal(settlement.seller, caller)) {
        statuses := Array.concat<MarketplaceTypes.SettlementStatus>(
          statuses,
          [auctionSettlementStatus(settlement, #Seller)],
        );
      };
    };
    for (settlement in MarketplaceLib.listNoBidAuctionReturns(marketplaceNoBidAuctionReturnState).values()) {
      if (Principal.equal(settlement.seller, caller)) {
        statuses := Array.concat<MarketplaceTypes.SettlementStatus>(
          statuses,
          [noBidReturnStatus(settlement)],
        );
      };
    };
    for (settlement in MarketplaceLib.listListingReturns(marketplaceListingReturnState).values()) {
      if (Principal.equal(settlement.seller, caller)) {
        statuses := Array.concat<MarketplaceTypes.SettlementStatus>(
          statuses,
          [listingReturnStatus(settlement)],
        );
      };
    };
    for (pending in MarketplaceLib.listPendingBidDeposits(marketplaceBidState).values()) {
      if (Principal.equal(pending.bidder, caller)) {
        statuses := Array.concat<MarketplaceTypes.SettlementStatus>(
          statuses,
          [pendingBidStatus(pending)],
        );
      };
    };
    for (refund in MarketplaceLib.getPendingRefundsByBidder(marketplacePaymentState, caller).values()) {
      statuses := Array.concat<MarketplaceTypes.SettlementStatus>(
        statuses,
        [pendingRefundStatus(refund)],
      );
    };
    statuses;
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

  public shared query ({ caller }) func getMyPendingAuctionRefunds() : async [MarketplaceTypes.AuctionEscrow] {
    if (Principal.isAnonymous(caller)) Runtime.trap("Anonymous caller not allowed");
    MarketplaceLib.getPendingRefundsByBidder(marketplacePaymentState, caller);
  };

  public shared ({ caller }) func retryAuctionRefund(escrowId : Nat) : async MarketplaceActionResult {
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
      case (#ok(_)) #ok(true);
      case (#err(message)) #err(message);
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
  ) : async MarketplaceActionResult {
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
      return await* continueFixedPurchaseSettlement(listingId);
    } finally {
      releaseMarketplaceUserPaymentLock(paymentLockOwner);
      MarketplaceLib.releaseListingLock(marketplacePaymentState, listingId);
    };
  };

  public shared ({ caller }) func adminRetryAuctionSettlement(
    listingId : MarketplaceTypes.ListingId
  ) : async MarketplaceActionResult {
    requireMarketplaceAdmin(caller);
    if (not MarketplaceLib.acquireListingLock(marketplacePaymentState, listingId)) {
      Runtime.trap("Auction is processing another payment. Try again shortly.");
    };
    try {
      return await* continueAuctionSettlement(listingId);
    } finally {
      MarketplaceLib.releaseListingLock(marketplacePaymentState, listingId);
    };
  };

  public shared ({ caller }) func adminRetryNoBidAuctionReturn(
    listingId : MarketplaceTypes.ListingId
  ) : async MarketplaceActionResult {
    requireMarketplaceAdmin(caller);
    if (not MarketplaceLib.acquireListingLock(marketplacePaymentState, listingId)) {
      Runtime.trap("Auction is processing another payment. Try again shortly.");
    };
    try {
      return await* continueNoBidAuctionReturnSettlement(listingId);
    } finally {
      MarketplaceLib.releaseListingLock(marketplacePaymentState, listingId);
    };
  };

  public shared ({ caller }) func adminRetryListingReturn(
    listingId : MarketplaceTypes.ListingId
  ) : async MarketplaceActionResult {
    requireMarketplaceAdmin(caller);
    if (not MarketplaceLib.acquireListingLock(marketplacePaymentState, listingId)) {
      Runtime.trap("Listing is processing another return. Try again shortly.");
    };
    try {
      return await* continueListingReturnSettlement(listingId);
    } finally {
      MarketplaceLib.releaseListingLock(marketplacePaymentState, listingId);
    };
  };

  public shared ({ caller }) func adminGetSettlementEscrowRepairQuote(
    listingId : MarketplaceTypes.ListingId
  ) : async MarketplaceTypes.SettlementEscrowRepairQuote {
    requireMarketplaceAdmin(caller);
    let ledger = actor (IcpLib.LEDGER_CANISTER_ID) : IcpLib.Ledger;
    await* getSettlementEscrowRepairQuoteForCaller(ledger, caller, listingId);
  };

  public shared ({ caller }) func adminGetMintlabFeeRecoveryQuote(
    listingId : MarketplaceTypes.ListingId
  ) : async MarketplaceTypes.MintlabFeeRecoveryQuote {
    requireMarketplaceAdmin(caller);
    let ledger = actor (IcpLib.LEDGER_CANISTER_ID) : IcpLib.Ledger;
    await* getMintlabFeeRecoveryQuote(ledger, listingId);
  };

  public shared ({ caller }) func adminResetUnresolvedMintlabFeeAttempt(
    listingId : MarketplaceTypes.ListingId
  ) : async MarketplaceTypes.MintlabFeeRecoveryQuote {
    requireMarketplaceAdmin(caller);
    if (not MarketplaceLib.acquireListingLock(marketplacePaymentState, listingId)) {
      Runtime.trap("Settlement is processing another payment. Try again shortly.");
    };
    try {
      let ledger = actor (IcpLib.LEDGER_CANISTER_ID) : IcpLib.Ledger;
      switch (MarketplaceLib.getFixedPurchaseSettlement(marketplaceSettlementState, listingId)) {
        case (?settlement) {
          let quote = await* fixedMintlabFeeRecoveryQuote(ledger, settlement);
          if (quote.escrowBalance < quote.expectedBeforeMintlabFeeDebit) {
            Runtime.trap("Escrow balance is below the before-fee debit; mark the Mintlab fee balance-verified only after confirming the fee transfer");
          };
          let updated = {
            settlement with
            ledgerFeeE8s = quote.ledgerFeeE8s;
            mintlabFeeCreatedAt = null;
            updatedAt = Time.now();
          };
          MarketplaceLib.putFixedPurchaseSettlement(marketplaceSettlementState, updated);
          return quote;
        };
        case null {};
      };
      switch (MarketplaceLib.getAuctionSettlement(marketplaceSettlementState, listingId)) {
        case (?settlement) {
          let quote = await* auctionMintlabFeeRecoveryQuote(ledger, settlement);
          if (quote.escrowBalance < quote.expectedBeforeMintlabFeeDebit) {
            Runtime.trap("Escrow balance is below the before-fee debit; mark the Mintlab fee balance-verified only after confirming the fee transfer");
          };
          let updated = {
            settlement with
            ledgerFeeE8s = quote.ledgerFeeE8s;
            mintlabFeeCreatedAt = null;
            updatedAt = Time.now();
          };
          MarketplaceLib.putAuctionSettlement(marketplaceSettlementState, updated);
          return quote;
        };
        case null {};
      };
      Runtime.trap("Settlement not found for listing");
    } finally {
      MarketplaceLib.releaseListingLock(marketplacePaymentState, listingId);
    };
  };

  public shared ({ caller }) func adminMarkMintlabFeeBalanceVerified(
    listingId : MarketplaceTypes.ListingId
  ) : async MarketplaceTypes.MintlabFeeRecoveryQuote {
    requireMarketplaceAdmin(caller);
    if (not MarketplaceLib.acquireListingLock(marketplacePaymentState, listingId)) {
      Runtime.trap("Settlement is processing another payment. Try again shortly.");
    };
    try {
      let ledger = actor (IcpLib.LEDGER_CANISTER_ID) : IcpLib.Ledger;
      switch (MarketplaceLib.getFixedPurchaseSettlement(marketplaceSettlementState, listingId)) {
        case (?settlement) {
          let quote = await* fixedMintlabFeeRecoveryQuote(ledger, settlement);
          if (quote.escrowBalance >= quote.expectedBeforeMintlabFeeDebit) {
            Runtime.trap("Escrow still has enough to retry the Mintlab fee transfer; reset the fee attempt instead");
          };
          let updated = {
            settlement with
            ledgerFeeE8s = quote.ledgerFeeE8s;
            mintlabFeeBlock = ?(0 : Nat64);
            stage = #SellerPaymentPending;
            updatedAt = Time.now();
          };
          MarketplaceLib.putFixedPurchaseSettlement(marketplaceSettlementState, updated);
          return quote;
        };
        case null {};
      };
      switch (MarketplaceLib.getAuctionSettlement(marketplaceSettlementState, listingId)) {
        case (?settlement) {
          let quote = await* auctionMintlabFeeRecoveryQuote(ledger, settlement);
          if (quote.escrowBalance >= quote.expectedBeforeMintlabFeeDebit) {
            Runtime.trap("Escrow still has enough to retry the Mintlab fee transfer; reset the fee attempt instead");
          };
          let updated = {
            settlement with
            ledgerFeeE8s = quote.ledgerFeeE8s;
            mintlabFeeBlock = ?(0 : Nat64);
            stage = #SellerPaymentPending;
            updatedAt = Time.now();
          };
          MarketplaceLib.putAuctionSettlement(marketplaceSettlementState, updated);
          return quote;
        };
        case null {};
      };
      Runtime.trap("Settlement not found for listing");
    } finally {
      MarketplaceLib.releaseListingLock(marketplacePaymentState, listingId);
    };
  };

  public shared ({ caller }) func adminTopUpSettlementEscrow(
    listingId : MarketplaceTypes.ListingId,
    amount : Nat64,
  ) : async MarketplaceTypes.SettlementEscrowTopUpReceipt {
    requireMarketplaceAdmin(caller);
    if (amount == 0) Runtime.trap("Top-up amount must be greater than zero");
    if (not MarketplaceLib.acquireListingLock(marketplacePaymentState, listingId)) {
      Runtime.trap("Settlement is processing another payment. Try again shortly.");
    };
    var paymentLockOwner : ?Principal = null;
    try {
      acquireUserPaymentLockOrTrap(caller);
      paymentLockOwner := ?caller;
      let ledger = actor (IcpLib.LEDGER_CANISTER_ID) : IcpLib.Ledger;
      let quote = await* getSettlementEscrowRepairQuoteForCaller(ledger, caller, listingId);
      if (quote.shortfall == 0) {
        Runtime.trap("Settlement escrow does not need a top-up");
      };
      if (amount != quote.shortfall) {
        Runtime.trap(
          "Top-up amount must equal the current settlement escrow shortfall of " #
          Nat64.toText(quote.shortfall) # " e8s"
        );
      };
      if (quote.topUpFromBalance < quote.topUpTotalDebit) {
        Runtime.trap(
          "Admin in-app ICP balance is too low for the escrow top-up. Required: " #
          Nat64.toText(quote.topUpTotalDebit) # " e8s, balance: " #
          Nat64.toText(quote.topUpFromBalance) # " e8s"
        );
      };
      let adminSub = IcpLib.principalToSubaccount(caller);
      let topUpResult = await* IcpLib.transferOutWithFeeAt(
        ledger,
        ?adminSub,
        quote.escrowAccount,
        amount,
        Nat64.fromNat(listingId),
        quote.topUpTransferFeeE8s,
        ledgerTimestampNow(),
      );
      let blockIndex = switch (transferBlockResult(topUpResult)) {
        case (#ok(block)) block;
        case (#badFee(expectedFee)) {
          Runtime.trap(
            "Escrow top-up failed: ledger fee changed to " #
            Nat64.toText(expectedFee) # " e8s; refresh the repair quote"
          );
        };
        case (#insufficientFunds(balance)) {
          Runtime.trap(
            "Escrow top-up failed: admin in-app ICP balance is " #
            Nat64.toText(balance) # " e8s"
          );
        };
        case (#tooOld) Runtime.trap("Escrow top-up timestamp expired; refresh the repair quote and retry");
        case (#createdInFuture) Runtime.trap("Escrow top-up timestamp was in the future; retry shortly");
      };
      {
        listingId;
        amount;
        feeE8s = quote.topUpTransferFeeE8s;
        blockIndex;
        quoteBefore = quote;
      };
    } finally {
      releaseMarketplaceUserPaymentLock(paymentLockOwner);
      MarketplaceLib.releaseListingLock(marketplacePaymentState, listingId);
    };
  };

  /// Buy a fixed-price listing; ICP first moves into marketplace escrow, then settlement can be retried safely.
  public shared ({ caller }) func buyFixedListing(listingId : MarketplaceTypes.ListingId) : async MarketplaceActionResult {
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
      return await* continueFixedPurchaseSettlement(listingId);
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

  func continueFixedPurchaseSettlement(listingId : MarketplaceTypes.ListingId) : async* MarketplaceActionResult {
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
            return persistFixedPurchaseSettlementErr(
              updated,
              "Purchase escrow transfer failed: ledger fee changed; retry purchase settlement",
            );
          };
          case (#Err(#InsufficientFunds({ balance }))) {
            ignore MarketplaceLib.removeFixedPurchaseSettlement(marketplaceSettlementState, listingId);
            return #err(
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
              ignore MarketplaceLib.removeFixedPurchaseSettlement(marketplaceSettlementState, listingId);
              return #err("Purchase escrow transfer timestamp expired and escrow is unfunded; retry purchase");
            };
          };
          case (#Err(#TxCreatedInFuture)) {
            let updated = {
              settlement with
              paymentCreatedAt = ledgerTimestampNow();
              updatedAt = Time.now();
            };
            return persistFixedPurchaseSettlementErr(
              updated,
              "Purchase escrow transfer timestamp was in the future; retry purchase settlement",
            );
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
      };
      case (?_) {};
    };

    switch (settlement.nftDeliveredAt) {
      case null {
        let deliveredLocation = switch (await* transferEscrowedNFTToRecipientResult(settlement.nft, settlement.buyer)) {
          case (#ok(location)) location;
          case (#err(message)) return #err(message);
        };
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
            case null return #err("Mintlab sales fee account is missing from purchase settlement");
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
              return persistFixedPurchaseSettlementErr(
                updated,
                "Mintlab sales fee transfer failed: ledger fee changed; retry settlement",
              );
            };
            case (#insufficientFunds(balance)) {
              let updated = {
                settlement with
                mintlabFeeCreatedAt = null;
                updatedAt = Time.now();
              };
              return persistFixedPurchaseSettlementErr(
                updated,
                "Mintlab sales fee transfer failed: escrow balance is too low (" #
                Nat64.toText(balance) # " e8s); request an admin repair quote"
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
                return persistFixedPurchaseSettlementErr(
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
                return #err("Mintlab sales fee transfer timestamp expired and escrow balance needs admin review");
              };
            };
            case (#createdInFuture) {
              let updated = {
                settlement with
                mintlabFeeCreatedAt = null;
                updatedAt = Time.now();
              };
              return persistFixedPurchaseSettlementErr(
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
              return #err(
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
            return persistFixedPurchaseSettlementErr(
              updated,
              "Seller ICP transfer failed: ledger fee changed; retry settlement",
            );
          };
          case (#insufficientFunds(balance)) {
            let updated = {
              settlement with
              sellerPaymentCreatedAt = null;
              updatedAt = Time.now();
            };
            return persistFixedPurchaseSettlementErr(
              updated,
              "Seller ICP transfer failed: settlement escrow needs top-up before payout. Balance: " #
              Nat64.toText(balance) # " e8s; request an admin repair quote"
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
                return persistFixedPurchaseSettlementErr(
                  updated,
                  "Seller ICP transfer timestamp expired; retry settlement with a fresh timestamp",
                );
              } else {
                return #err("Seller ICP transfer timestamp expired and escrow balance needs admin review");
              };
            };
          };
          case (#createdInFuture) {
            let updated = {
              settlement with
              sellerPaymentCreatedAt = null;
              updatedAt = Time.now();
            };
            return persistFixedPurchaseSettlementErr(
              updated,
              "Seller ICP transfer timestamp was in the future; retry settlement",
            );
          };
        };
      };
      case (?_) {};
    };

    switch (await* refundRemainingEscrowBalanceToUser(
      ledger,
      escrowSub,
      settlement.buyer,
      Nat64.fromNat(settlement.listingId),
      "Fixed purchase settlement",
    )) {
      case (#ok(_)) {};
      case (#err(message)) return #err(message);
    };

    ignore MarketplaceLib.settleFixedListing(marketplaceState, settlement.listingId);
    ignore MarketplaceLib.takeEscrowedNFT(marketplaceState, settlement.listingId);
    ignore MarketplaceLib.clearListingsForToken(marketplaceState, settlement.nft.collectionId, settlement.nft.tokenId);
    ignore MarketplaceLib.removeFixedPurchaseSettlement(marketplaceSettlementState, settlement.listingId);
    #ok(true);
  };

  /// Place a bid on an active auction listing
  public shared ({ caller }) func placeBid(
    listingId : MarketplaceTypes.ListingId,
    amount : Nat64,
  ) : async MarketplaceBidResult {
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
      var shouldStartBid = false;
      switch (MarketplaceLib.getPendingBidDeposit(marketplaceBidState, listingId)) {
        case null {
          shouldStartBid := true;
        };
        case (?pending) {
          let isCallerAdmin = AuthLib.isAdmin(authState, caller);
          if (not Principal.equal(pending.bidder, caller) and not isCallerAdmin) {
            switch (await* resolvePendingBidDeposit(listingId, #PublicRecovery)) {
              case (#ok(_)) {
                shouldStartBid := true;
              };
              case (#err(message)) {
                return #err(message);
              };
            };
          } else {
            if (pending.amount != amount and not isCallerAdmin) {
              Runtime.trap("Retry the pending bid with the same amount");
            };
            if (pending.paymentBlock == null) {
              acquireUserPaymentLockOrTrap(pending.bidder);
              paymentLockOwner := ?pending.bidder;
            };
          };
        };
      };
      if (shouldStartBid) {
        acquireUserPaymentLockOrTrap(caller);
        paymentLockOwner := ?caller;
        ignore await* startPendingBidDeposit(listingId, caller, amount);
      };
      return await* continuePendingBidDeposit(listingId);
    } finally {
      releaseMarketplaceUserPaymentLock(paymentLockOwner);
      MarketplaceLib.releaseListingLock(marketplacePaymentState, listingId);
    };
  };

  public shared ({ caller }) func retryPendingBid(
    listingId : MarketplaceTypes.ListingId
  ) : async MarketplaceBidResult {
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
      return await* continuePendingBidDeposit(listingId);
    } finally {
      releaseMarketplaceUserPaymentLock(paymentLockOwner);
      MarketplaceLib.releaseListingLock(marketplacePaymentState, listingId);
    };
  };

  public shared ({ caller }) func cancelStalePendingBid(
    listingId : MarketplaceTypes.ListingId
  ) : async MarketplaceActionResult {
    if (Principal.isAnonymous(caller)) Runtime.trap("Anonymous caller not allowed");
    if (not MarketplaceLib.acquireListingLock(marketplacePaymentState, listingId)) {
      Runtime.trap("Auction is processing another payment. Try again shortly.");
    };
    try {
      await* resolvePendingBidDeposit(listingId, #PublicRecovery);
    } finally {
      MarketplaceLib.releaseListingLock(marketplacePaymentState, listingId);
    };
  };

  public shared ({ caller }) func adminResolvePendingBid(
    listingId : MarketplaceTypes.ListingId
  ) : async MarketplaceActionResult {
    requireMarketplaceAdmin(caller);
    if (not MarketplaceLib.acquireListingLock(marketplacePaymentState, listingId)) {
      Runtime.trap("Auction is processing another payment. Try again shortly.");
    };
    try {
      await* resolvePendingBidDeposit(listingId, #AdminResolve);
    } finally {
      MarketplaceLib.releaseListingLock(marketplacePaymentState, listingId);
    };
  };

  func recoverFundedPendingBidDeposit(
    pending : MarketplaceTypes.PendingBidDeposit
  ) : async* MarketplaceActionResult {
    let updated = switch (pending.paymentBlock) {
      case (?_) pending;
      case null {
        {
          pending with
          paymentBlock = ?(0 : Nat64);
          updatedAt = Time.now();
        };
      };
    };
    MarketplaceLib.putPendingBidDeposit(marketplaceBidState, updated);
    switch (await* continuePendingBidDeposit(pending.listingId)) {
      case (#ok(_)) #ok(true);
      case (#err(message)) {
        #err("Pending bid escrow is funded, but recovery needs another retry: " # message);
      };
    };
  };

  func refundPartialStalePendingBidDeposit(
    ledger : IcpLib.Ledger,
    pending : MarketplaceTypes.PendingBidDeposit,
    escrowBalance : Nat64,
  ) : async* MarketplaceActionResult {
    let currentFee = await* IcpLib.getTransferFee(ledger);
    if (escrowBalance <= currentFee) {
      ignore MarketplaceLib.removePendingBidDeposit(marketplaceBidState, pending.listingId);
      return #ok(true);
    };

    let escrowSub = IcpLib.marketplaceEscrowSubaccount(pending.escrowId);
    let bidderSub = IcpLib.principalToSubaccount(pending.bidder);
    let bidderAccount = IcpLib.accountIdentifier(canisterId, bidderSub);
    let refundAmount = escrowBalance - currentFee;
    let refundResult = await* IcpLib.transferOutWithFeeAt(
      ledger,
      ?escrowSub,
      bidderAccount,
      refundAmount,
      Nat64.fromNat(pending.listingId),
      currentFee,
      ledgerTimestampNow(),
    );
    switch (transferBlockResult(refundResult)) {
      case (#ok(_)) {
        ignore MarketplaceLib.removePendingBidDeposit(marketplaceBidState, pending.listingId);
        #ok(true);
      };
      case (#badFee(expectedFee)) {
        #err(
          "Partial pending bid refund failed: ledger fee changed to " #
          Nat64.toText(expectedFee) # " e8s; retry admin pending bid resolution"
        );
      };
      case (#insufficientFunds(balance)) {
        if (balance == 0) {
          ignore MarketplaceLib.removePendingBidDeposit(marketplaceBidState, pending.listingId);
          #ok(true);
        } else {
          #err(
            "Partial pending bid refund failed: escrow balance changed to " #
            Nat64.toText(balance) # " e8s; retry admin pending bid resolution"
          );
        };
      };
      case (#tooOld) #err("Partial pending bid refund timestamp expired; retry admin pending bid resolution");
      case (#createdInFuture) #err("Partial pending bid refund timestamp was in the future; retry shortly");
    };
  };

  func resolvePendingBidDeposit(
    listingId : MarketplaceTypes.ListingId,
    mode : PendingBidResolutionMode,
  ) : async* MarketplaceActionResult {
    let pending = switch (MarketplaceLib.getPendingBidDeposit(marketplaceBidState, listingId)) {
      case null Runtime.trap("Pending bid deposit not found");
      case (?value) value;
    };

    switch (pending.paymentBlock) {
      case (?_) {
        return await* recoverFundedPendingBidDeposit(pending);
      };
      case null {};
    };

    let ledger = actor (IcpLib.LEDGER_CANISTER_ID) : IcpLib.Ledger;
    let escrowSub = IcpLib.marketplaceEscrowSubaccount(pending.escrowId);
    let escrowAccount = IcpLib.accountIdentifier(canisterId, escrowSub);
    let escrowBalance = await* IcpLib.getBalance(ledger, escrowAccount);

    if (escrowBalance >= pending.escrowDeposit) {
      return await* recoverFundedPendingBidDeposit(pending);
    };

    if (not pendingBidTimedOut(pending)) {
      return #err("Pending bid is not stale yet. Retry the bid or wait 5 minutes before cancelling an unfunded escrow.");
    };

    if (escrowBalance == 0) {
      ignore MarketplaceLib.removePendingBidDeposit(marketplaceBidState, listingId);
      return #ok(true);
    };

    switch (mode) {
      case (#PublicRecovery) {
        #err(
          "Pending bid escrow contains ICP but is below the required bid deposit. An admin must resolve this pending bid."
        );
      };
      case (#AdminResolve) {
        await* refundPartialStalePendingBidDeposit(ledger, pending, escrowBalance);
      };
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
  ) : async* MarketplaceBidResult {
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
        if (Time.now() >= listing.endTime) {
          switch (pending.paymentAttemptedAt) {
            case null {
              ignore MarketplaceLib.removePendingBidDeposit(marketplaceBidState, listingId);
              return #err("Auction ended before the bid escrow was funded");
            };
            case (?_) {};
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
            return persistPendingBidDepositErr(
              updated,
              "Bid escrow transfer failed: ledger fee changed; retry pending bid",
            );
          };
          case (#Err(#InsufficientFunds({ balance }))) {
            ignore MarketplaceLib.removePendingBidDeposit(marketplaceBidState, listingId);
            return #err(
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
              ignore MarketplaceLib.removePendingBidDeposit(marketplaceBidState, listingId);
              return #err("Bid escrow transfer timestamp expired and escrow is unfunded; place the bid again");
            };
          };
          case (#Err(#TxCreatedInFuture)) {
            let updated = {
              pending with
              paymentCreatedAt = ledgerTimestampNow();
              updatedAt = Time.now();
            };
            return persistPendingBidDepositErr(
              updated,
              "Bid escrow transfer timestamp was in the future; retry pending bid",
            );
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
          return #ok(currentListing);
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

    #ok(updated);
  };

  /// Settle an auction after its end time; NFT delivery happens before escrow payout and can be retried.
  public shared ({ caller }) func settleAuction(listingId : MarketplaceTypes.ListingId) : async MarketplaceActionResult {
    if (Principal.isAnonymous(caller)) Runtime.trap("Anonymous caller not allowed");
    if (MarketplaceLib.isListingReturning(marketplaceListingReturnState, listingId)) {
      Runtime.trap("Auction is being cancelled and cannot be settled");
    };
    if (not MarketplaceLib.acquireListingLock(marketplacePaymentState, listingId)) {
      Runtime.trap("Auction is processing another payment. Try again shortly.");
    };
    try {
      switch (MarketplaceLib.getPendingBidDeposit(marketplaceBidState, listingId)) {
        case null {};
        case (?_) {
          switch (await* resolvePendingBidDeposit(listingId, #PublicRecovery)) {
            case (#ok(_)) {};
            case (#err(message)) return #err(message);
          };
        };
      };
      switch (MarketplaceLib.getNoBidAuctionReturn(marketplaceNoBidAuctionReturnState, listingId)) {
        case (?_) {
          return await* continueNoBidAuctionReturnSettlement(listingId);
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
              return await* continueNoBidAuctionReturnSettlement(listingId);
            };
            case (?winner) {
              switch (await* ensureEscrowedNFTReadyResult(settledNFT)) {
                case (#ok(_)) {};
                case (#err(message)) return #err(message);
              };
              ignore await* startAuctionSettlement(listing, settledNFT, winner);
            };
          };
        };
        case (?_) {};
      };
      return await* continueAuctionSettlement(listingId);
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
  ) : async* MarketplaceActionResult {
    var settlement = switch (
      MarketplaceLib.getNoBidAuctionReturn(marketplaceNoBidAuctionReturnState, listingId)
    ) {
      case null Runtime.trap("No-bid auction return settlement not found");
      case (?value) value;
    };

    switch (settlement.returnedAt) {
      case null {
        let returnedLocation = switch (await* transferEscrowedNFTToRecipientResult(settlement.nft, settlement.seller)) {
          case (#ok(location)) location;
          case (#err(message)) return #err(message);
        };
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
    #ok(true);
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

  func continueAuctionSettlement(listingId : MarketplaceTypes.ListingId) : async* MarketplaceActionResult {
    let ledger = actor (IcpLib.LEDGER_CANISTER_ID) : IcpLib.Ledger;
    var settlement = switch (MarketplaceLib.getAuctionSettlement(marketplaceSettlementState, listingId)) {
      case null Runtime.trap("Auction settlement not found");
      case (?value) value;
    };
    let escrowSub = IcpLib.marketplaceEscrowSubaccount(settlement.winningEscrowId);

    switch (settlement.nftDeliveredAt) {
      case null {
        let deliveredLocation = switch (await* transferEscrowedNFTToRecipientResult(settlement.nft, settlement.winner)) {
          case (#ok(location)) location;
          case (#err(message)) return #err(message);
        };
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
            case null return #err("Mintlab sales fee account is missing from auction settlement");
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
              return persistAuctionSettlementErr(
                updated,
                "Mintlab sales fee transfer failed: ledger fee changed; retry settlement",
              );
            };
            case (#insufficientFunds(balance)) {
              let updated = {
                settlement with
                mintlabFeeCreatedAt = null;
                updatedAt = Time.now();
              };
              return persistAuctionSettlementErr(
                updated,
                "Mintlab sales fee transfer failed: escrow balance is too low (" #
                Nat64.toText(balance) # " e8s); request an admin repair quote"
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
                return persistAuctionSettlementErr(
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
                return #err("Mintlab sales fee transfer timestamp expired and escrow balance needs admin review");
              };
            };
            case (#createdInFuture) {
              let updated = {
                settlement with
                mintlabFeeCreatedAt = null;
                updatedAt = Time.now();
              };
              return persistAuctionSettlementErr(
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
              return #err(
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
            return persistAuctionSettlementErr(
              updated,
              "ICP transfer to seller failed: ledger fee changed; retry settlement",
            );
          };
          case (#insufficientFunds(balance)) {
            let updated = {
              settlement with
              sellerPaymentCreatedAt = null;
              updatedAt = Time.now();
            };
            return persistAuctionSettlementErr(
              updated,
              "ICP transfer to seller failed: settlement escrow needs top-up before payout. Balance: " #
              Nat64.toText(balance) # " e8s; request an admin repair quote"
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
                return persistAuctionSettlementErr(
                  updated,
                  "ICP transfer to seller timestamp expired; retry settlement with a fresh timestamp",
                );
              } else {
                return #err("ICP transfer to seller timestamp expired and escrow balance needs admin review");
              };
            };
          };
          case (#createdInFuture) {
            let updated = {
              settlement with
              sellerPaymentCreatedAt = null;
              updatedAt = Time.now();
            };
            return persistAuctionSettlementErr(
              updated,
              "ICP transfer to seller timestamp was in the future; retry settlement",
            );
          };
        };
      };
      case (?_) {};
    };

    switch (await* refundRemainingEscrowBalanceToUser(
      ledger,
      escrowSub,
      settlement.winner,
      Nat64.fromNat(settlement.listingId),
      "Auction settlement",
    )) {
      case (#ok(_)) {};
      case (#err(message)) return #err(message);
    };

    ignore MarketplaceLib.removeAuctionEscrow(marketplacePaymentState, settlement.listingId);
    ignore MarketplaceLib.removePendingRefund(marketplacePaymentState, settlement.winningEscrowId);
    ignore MarketplaceLib.removePendingRefundJournal(marketplaceRefundState, settlement.winningEscrowId);
    ignore MarketplaceLib.settleAuction(marketplaceState, settlement.listingId);
    ignore MarketplaceLib.takeEscrowedNFT(marketplaceState, settlement.listingId);
    ignore MarketplaceLib.clearListingsForToken(marketplaceState, settlement.nft.collectionId, settlement.nft.tokenId);
    ignore MarketplaceLib.removeAuctionSettlement(marketplaceSettlementState, settlement.listingId);
    #ok(true);
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
    switch (await* ensureEscrowedNFTReadyResult(nft)) {
      case (#ok(_)) {};
      case (#err(message)) Runtime.trap(message);
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
  ) : async* MarketplaceActionResult {
    var settlement = switch (MarketplaceLib.getListingReturn(marketplaceListingReturnState, listingId)) {
      case null Runtime.trap("Listing return settlement not found");
      case (?value) value;
    };

    switch (settlement.returnedAt) {
      case null {
        let returnedLocation = switch (await* transferEscrowedNFTToRecipientResult(settlement.nft, settlement.seller)) {
          case (#ok(location)) location;
          case (#err(message)) return #err(message);
        };
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
    #ok(true);
  };

  /// Cancel a listing; NFT returned from escrow; caller must be owner or admin
  public shared ({ caller }) func cancelListing(listingId : MarketplaceTypes.ListingId) : async MarketplaceActionResult {
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
          return await* continueListingReturnSettlement(listingId);
        } finally {
          MarketplaceLib.releaseListingLock(marketplacePaymentState, listingId);
        };
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
                    return #err("Listing has a funded purchase escrow; retry settlement before cancelling");
                  };
                  ignore MarketplaceLib.removeFixedPurchaseSettlement(marketplaceSettlementState, listingId);
                };
                case (?_) return #err("Listing is already settling and cannot be cancelled");
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
          return await* continueListingReturnSettlement(listingId);
        } finally {
          MarketplaceLib.releaseListingLock(marketplacePaymentState, listingId);
        };
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
            case (?_) return #err("Auction is already returning the NFT to the seller; retry settlement instead");
          };
          switch (MarketplaceLib.getAuctionSettlement(marketplaceSettlementState, listingId)) {
            case null {};
            case (?_) return #err("Auction is already settling and cannot be cancelled");
          };
          switch (MarketplaceLib.getPendingBidDeposit(marketplaceBidState, listingId)) {
            case null {};
            case (?_) {
              switch (await* resolvePendingBidDeposit(listingId, #PublicRecovery)) {
                case (#ok(_)) {};
                case (#err(message)) return #err(message);
              };
            };
          };
          let currentListing = switch (MarketplaceLib.getAuctionListing(marketplaceState, listingId)) {
            case null Runtime.trap("Auction listing not found");
            case (?value) value;
          };
          if (auctionListingHasAcceptedBid(currentListing)) {
            return #err("Auction cannot be cancelled after a bid has been placed");
          };
          switch (MarketplaceLib.getAuctionEscrow(marketplacePaymentState, listingId)) {
            case null {};
            case (?_) return #err("Auction cannot be cancelled after a bid has been placed");
          };
          let escrowedNFT = switch (MarketplaceLib.getEscrowedNFT(marketplaceState, listingId)) {
            case null Runtime.trap("Escrowed NFT not found for auction listing");
            case (?nft) nft;
          };
          ignore startListingReturnSettlement(
            listingId,
            currentListing.seller,
            escrowedNFT,
            #AuctionCancel,
            null,
          );
          return await* continueListingReturnSettlement(listingId);
        } finally {
          MarketplaceLib.releaseListingLock(marketplacePaymentState, listingId);
        };
      };
      case null {};
    };

    #err("Listing not found");
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
    switch (await* transferEscrowedNFTToRecipientResult(nft, to)) {
      case (#ok(location)) location;
      case (#err(message)) Runtime.trap(message);
    };
  };

  func transferEscrowedNFTToRecipientResult(
    nft : WalletTypes.WalletNFT,
    to : Principal,
  ) : async* MarketplaceNFTTransferResult {
    switch (nft.location) {
      case (#Minted) {
        switch (await* isMintedNFTOwnedByResult(nft, to)) {
          case (#ok(true)) return #ok(#Minted);
          case (#ok(false)) {};
          case (#err(message)) return #err(message);
        };
        switch (await* transferMintedNFTResult(nft, canisterId, to)) {
          case (#ok(_)) #ok(#Minted);
          case (#err(message)) #err(message);
        };
      };
      case (#Vaulted) {
        // Vaulted external NFTs stay in Mintlab custody during settlement.
        // The buyer receives the in-app wallet record and can later withdraw.
        ignore to;
        switch (await* ensureEscrowedNFTReadyResult(nft)) {
          case (#ok(_)) #ok(#Vaulted);
          case (#err(message)) #err(message);
        };
      };
      case (#Registered) {
        #err("Registered external NFTs are not escrowed by the marketplace");
      };
    };
  };

  func ensureEscrowedNFTReadyResult(nft : WalletTypes.WalletNFT) : async* MarketplaceActionResult {
    switch (nft.location) {
      case (#Minted) {
        switch (await* isMintedNFTOwnedByResult(nft, canisterId)) {
          case (#ok(true)) #ok(true);
          case (#ok(false)) #err("Escrowed minted NFT is not held by the app canister");
          case (#err(message)) #err(message);
        };
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
          case (#ok(true)) #ok(true);
          case (#ok(false)) #err("Escrowed external NFT is not held by the app vault");
          case (#err(message)) #err(message);
        };
      };
      case (#Registered) {
        #err("Registered external NFTs must be deposited into the app vault before listing");
      };
    };
  };

  func isMintedNFTOwnedBy(
    nft : WalletTypes.WalletNFT,
    owner : Principal,
  ) : async* Bool {
    switch (await* isMintedNFTOwnedByResult(nft, owner)) {
      case (#ok(owned)) owned;
      case (#err(message)) Runtime.trap(message);
    };
  };

  func isMintedNFTOwnedByResult(
    nft : WalletTypes.WalletNFT,
    owner : Principal,
  ) : async* MarketplaceBoolResult {
    let collection = mintedCollection(nft);
    let tokenId = switch (Nat.fromText(nft.tokenId)) {
      case null Runtime.trap("Minted token IDs must be numeric");
      case (?value) value;
    };
    if (Principal.equal(collection.canisterId, canisterId)) {
      switch (MintLib.getToken(mintState, tokenId)) {
        case null #ok(false);
        case (?token) {
          #ok(
            MintLib.tokenBelongsToCollection(
              token,
              collection.id,
              MintLib.getConfig(mintState).collectionId,
            ) and Principal.equal(token.owner, owner)
          )
        };
      };
    } else {
      let child : MarketplaceChildCollectionActor = actor (collection.canisterId.toText());
      let owners = try {
        await child.mintlab_owner_of([tokenId]);
      } catch (error) {
        return #err("Collection canister ownership check failed: " # Error.message(error));
      };
      if (owners.size() == 0) {
        return #ok(false);
      };
      switch (owners[0]) {
        case (?(account)) #ok(Principal.equal(account.owner, owner));
        case null #ok(false);
      };
    };
  };

  func transferMintedNFT(
    nft : WalletTypes.WalletNFT,
    from : Principal,
    to : Principal,
  ) : async* () {
    switch (await* transferMintedNFTResult(nft, from, to)) {
      case (#ok(_)) {};
      case (#err(message)) Runtime.trap(message);
    };
  };

  func transferMintedNFTResult(
    nft : WalletTypes.WalletNFT,
    from : Principal,
    to : Principal,
  ) : async* MarketplaceActionResult {
    let collection = mintedCollection(nft);
    let tokenId = switch (Nat.fromText(nft.tokenId)) {
      case null Runtime.trap("Minted token IDs must be numeric");
      case (?value) value;
    };
    if (Principal.equal(collection.canisterId, canisterId)) {
      ensureLocalMintedToken(collection, tokenId, from);
      switch (MintLib.transferToken(mintState, tokenId, from, to)) {
        case (#ok(_)) #ok(true);
        case (#err(message)) #err(message);
      };
    } else {
      let child : MarketplaceChildCollectionActor = actor (collection.canisterId.toText());
      let result = try {
        await child.mintlab_transfer_from(from, to, tokenId);
      } catch (error) {
        return #err("Collection canister transfer failed: " # Error.message(error));
      };
      switch (result) {
        case (#ok(_)) #ok(true);
        case (#err(message)) #err(message);
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
