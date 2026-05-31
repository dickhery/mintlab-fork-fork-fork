module {
  public type CollectionId = Nat;

  public type NFTStandard = { #EXT; #DIP721; #ICRC7; #Other : Text };
  public type CollectionKind = { #External; #Minted };
  public type CollectionTrustStatus = {
    #CommunityImported;
    #Verified;
    #Hidden;
    #Blocked;
    #SyncDisabled;
    #NeedsBrowseInfo;
    #Reported;
  };
  public type NFTReportStatus = {
    #Open;
    #AutoHidden;
    #Approved;
    #Hidden;
  };
  public type CollectionDividendConfig = {
    enabled : Bool;
  };
  public type CollectionBrowseInfo = {
    totalSupply : ?Nat;
    tokenIndexOffset : ?Nat;
  };

  public type Collection = {
    id : CollectionId;
    name : Text;
    description : Text;
    canisterId : Principal;
    standard : NFTStandard;
    imageUrl : Text;
    symbol : Text;
    kind : CollectionKind;
    browseInfo : ?CollectionBrowseInfo;
    dividendConfig : ?CollectionDividendConfig;
  };

  public type CollectionPage = {
    collections : [Collection];
    nextCursor : ?Nat;
    totalCount : Nat;
  };

  public type CollectionImportMeta = {
    collectionId : CollectionId;
    importedBy : Principal;
    trustStatus : CollectionTrustStatus;
    reportCount : Nat;
    createdAt : Int;
    reviewedAt : ?Int;
    lastReportedAt : ?Int;
    lastReportReason : ?Text;
  };

  public type CollectionImportMetaPage = {
    metas : [CollectionImportMeta];
    nextCursor : ?Nat;
    totalCount : Nat;
  };

  public type NFTReportMeta = {
    collectionId : CollectionId;
    tokenId : Text;
    status : NFTReportStatus;
    reportCount : Nat;
    createdAt : Int;
    lastReportedAt : ?Int;
    lastReportReason : ?Text;
    reviewedAt : ?Int;
    reviewedBy : ?Principal;
  };

  public type NFTReportMetaPage = {
    reports : [NFTReportMeta];
    nextCursor : ?Nat;
    totalCount : Nat;
  };
};
