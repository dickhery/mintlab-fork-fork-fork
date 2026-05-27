import CommonTypes "common";

module {
  public type AccountIdentifier = CommonTypes.AccountIdentifier;
  public type UserId = CommonTypes.UserId;
  public type Timestamp = CommonTypes.Timestamp;

  public type WithdrawalStatus = {
    #Pending;
    #Completed;
    #Failed;
  };

  public type WithdrawalJournalEntry = {
    id : Nat;
    caller : UserId;
    to : AccountIdentifier;
    amountE8s : Nat64;
    clientNonce : ?Nat64;
    memo : Nat64;
    createdAt : Nat64;
    updatedAt : Nat64;
    blockIndex : ?Nat64;
    status : WithdrawalStatus;
    lastError : ?Text;
  };
};
