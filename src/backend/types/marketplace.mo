import CommonTypes "common";
import WalletTypes "wallet";

module {
  public type ListingId = Nat;
  public type NFTId = WalletTypes.NFTId;
  public type UserId = CommonTypes.UserId;
  public type Timestamp = CommonTypes.Timestamp;
  public type AccountIdentifier = CommonTypes.AccountIdentifier;

  public type ListingStatus = { #Active; #Sold; #Cancelled; #Settled };

  public type FixedListing = {
    id : ListingId;
    seller : UserId;
    nftId : NFTId;
    price : Nat64; // in e8s (ICP smallest unit)
    status : ListingStatus;
    createdAt : Timestamp;
  };

  public type AuctionListing = {
    id : ListingId;
    seller : UserId;
    nftId : NFTId;
    startingBid : Nat64;
    endTime : Timestamp;
    highestBidder : ?UserId;
    highestBid : Nat64;
    status : ListingStatus;
    createdAt : Timestamp;
  };

  public type Bid = {
    listingId : ListingId;
    bidder : UserId;
    amount : Nat64;
    placedAt : Timestamp;
  };

  public type AuctionBidStatus = {
    listingId : ListingId;
    hasBid : Bool;
    isWinning : Bool;
    highestBidder : ?UserId;
    highestBid : Nat64;
    myHighestBid : ?Nat64;
  };

  public type AuctionEscrow = {
    escrowId : Nat;
    listingId : ListingId;
    bidder : UserId;
    amount : Nat64;
    feeReserve : Nat64;
    ledgerFeeE8s : Nat64;
    depositedBlock : Nat64;
    createdAt : Timestamp;
  };

  public type PendingBidDeposit = {
    listingId : ListingId;
    bidder : UserId;
    amount : Nat64;
    escrowId : Nat;
    escrowDeposit : Nat64;
    feeReserve : Nat64;
    ledgerFeeE8s : Nat64;
    paymentCreatedAt : Nat64;
    paymentAttemptedAt : ?Timestamp;
    paymentBlock : ?Nat64;
    createdAt : Timestamp;
    updatedAt : Timestamp;
  };

  public type SettlementStage = {
    #PaymentPending;
    #NFTTransferPending;
    #MintlabFeePending;
    #SellerPaymentPending;
  };

  public type FixedPurchaseSettlement = {
    listingId : ListingId;
    buyer : UserId;
    seller : UserId;
    nft : WalletTypes.WalletNFT;
    price : Nat64;
    sellerProceeds : Nat64;
    mintlabFee : Nat64;
    feeRecipient : ?AccountIdentifier;
    ledgerFeeE8s : Nat64;
    paymentEscrowId : Nat;
    paymentCreatedAt : Nat64;
    paymentBlock : ?Nat64;
    nftDeliveredAt : ?Timestamp;
    mintlabFeeCreatedAt : ?Nat64;
    mintlabFeeBlock : ?Nat64;
    sellerPaymentCreatedAt : ?Nat64;
    sellerPaymentBlock : ?Nat64;
    stage : SettlementStage;
    createdAt : Timestamp;
    updatedAt : Timestamp;
  };

  public type AuctionSettlement = {
    listingId : ListingId;
    seller : UserId;
    winner : UserId;
    nft : WalletTypes.WalletNFT;
    price : Nat64;
    sellerProceeds : Nat64;
    mintlabFee : Nat64;
    feeRecipient : ?AccountIdentifier;
    ledgerFeeE8s : Nat64;
    winningEscrowId : Nat;
    winningEscrowDepositedBlock : Nat64;
    nftDeliveredAt : ?Timestamp;
    mintlabFeeCreatedAt : ?Nat64;
    mintlabFeeBlock : ?Nat64;
    sellerPaymentCreatedAt : ?Nat64;
    sellerPaymentBlock : ?Nat64;
    stage : SettlementStage;
    createdAt : Timestamp;
    updatedAt : Timestamp;
  };

  public type MarketplaceFeeConfig = {
    mintlabFeeBasisPoints : Nat;
    mintlabFeeRecipient : ?AccountIdentifier;
    ledgerFeeE8s : Nat64;
    auctionBidFeeReserveE8s : Nat64;
  };

  public type ActiveListing = {
    #Fixed : FixedListing;
    #Auction : AuctionListing;
  };

  public type ActiveListingDetail = {
    listing : ActiveListing;
    nft : WalletTypes.WalletNFT;
  };
};
