module {
  public type TransactionKind = {
    #ICPTransferOut;
    #Mint;
    #NFTTransferOut;
    #NFTTransferIn;
    #CollectionCreation;
    #CollectionCanisterTopUp;
    #AppCanisterTopUp;
    #MarketplacePurchase;
    #MarketplaceSale;
    #AuctionBid;
    #AuctionRefund;
    #DividendClaim;
  };

  public type TransactionDirection = {
    #In;
    #Out;
    #Neutral;
  };

  public type TransactionStatus = {
    #Pending;
    #Completed;
    #Failed;
  };

  public type RecentTransaction = {
    id : Nat;
    kind : TransactionKind;
    direction : TransactionDirection;
    status : TransactionStatus;
    amountE8s : ?Nat64;
    feeE8s : ?Nat64;
    title : Text;
    detail : Text;
    occurredAt : Nat64;
    blockIndex : ?Nat64;
    reference : ?Text;
  };
};
