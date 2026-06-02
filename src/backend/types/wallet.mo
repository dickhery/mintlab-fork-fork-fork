import CommonTypes "common";
import CollectionTypes "collections";

module {
  public type UserId = CommonTypes.UserId;
  public type CollectionId = CollectionTypes.CollectionId;
  public type AccountIdentifier = CommonTypes.AccountIdentifier;

  public type NFTId = Nat;
  public type WalletLocation = { #Registered; #Vaulted; #Minted };

  public type NFTMetadata = {
    name : ?Text;
    description : ?Text;
    imageUrl : ?Text;
    attributes : [(Text, Text)];
  };

  public type WalletNFT = {
    id : NFTId;
    owner : UserId;
    collectionId : CollectionId;
    tokenId : Text; // token identifier within the collection
    metadata : NFTMetadata;
    location : WalletLocation;
    registeredAt : CommonTypes.Timestamp;
  };

  public type NFTStats = {
    totalCount : Nat;
    perCollection : [(CollectionId, Nat)];
  };

  public type DepositPreparation = {
    user : UserId;
    collectionId : CollectionId;
    tokenId : Text;
    preparedAt : CommonTypes.Timestamp;
  };

  public type NFTReceiveInstructions = {
    principal : Principal;
    accountId : AccountIdentifier;
    accountKind : Text;
    standard : CollectionTypes.NFTStandard;
    warning : Text;
  };

  public type IndexedOwner = {
    #Principal : Principal;
    #AccountIdText : Text;
    #Unknown;
  };

  public type OwnershipIndexRecord = {
    collectionId : CollectionId;
    tokenId : Text;
    owner : IndexedOwner;
    metadata : NFTMetadata;
    indexedAt : CommonTypes.Timestamp;
  };

  public type CollectionIndexStatus = {
    collectionId : CollectionId;
    cursor : ?Text;
    scanned : Nat;
    indexed : Nat;
    complete : Bool;
    lastError : ?Text;
    updatedAt : CommonTypes.Timestamp;
  };

  public type CollectionIndexPageResult = {
    collectionId : CollectionId;
    scanned : Nat;
    indexed : Nat;
    nextCursor : ?Text;
    complete : Bool;
    error : ?Text;
  };

  public type WalletSyncSkip = {
    collectionId : CollectionId;
    collectionName : Text;
    reason : Text;
    message : Text;
  };

  public type WalletSyncV2Result = {
    newCount : Nat;
    errors : [Text];
    skipped : [WalletSyncSkip];
  };

  public type WalletSyncPageResult = {
    newCount : Nat;
    errors : [Text];
    skipped : [WalletSyncSkip];
    nextCursor : ?Nat;
    complete : Bool;
    checkedCollections : Nat;
  };

  public type WalletCollectionSyncProgress = {
    collectionId : CollectionId;
    newCount : Nat;
    errors : [Text];
    skipped : [WalletSyncSkip];
    scannedThisRun : Nat;
    indexedThisRun : Nat;
    nextCursor : ?Text;
    complete : Bool;
    directHintChecked : Bool;
    status : ?CollectionIndexStatus;
  };

  public type CollectionSyncReadiness = {
    collectionId : CollectionId;
    standard : CollectionTypes.NFTStandard;
    hasBrowseInfo : Bool;
    allowsSync : Bool;
    trustStatus : ?CollectionTypes.CollectionTrustStatus;
    indexStatus : ?CollectionIndexStatus;
    recommendedAction : Text;
  };

  public type WalletNFTPage = {
    nfts : [WalletNFT];
    nextCursor : ?Nat;
    totalCount : Nat;
  };
};
