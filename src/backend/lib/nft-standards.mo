import Blob "mo:core/Blob";
import Int "mo:core/Int";
import Nat64 "mo:core/Nat64";
import Principal "mo:core/Principal";

module {
  // ── EXT Standard ─────────────────────────────────────────────────────────

  public type TokenIdentifier = Text;
  public type SubAccount = Blob;
  // EXT on-chain canisters expect AccountIdentifier as a lowercase hex Text (64 chars)
  public type EXTAccountIdentifier = Text;
  public type TokenIndex = Nat32;

  public type AccountUser = {
    #principal : Principal;
    #address : EXTAccountIdentifier;
  };

  public type ExtTransferRequest = {
    from : AccountUser;
    to : AccountUser;
    token : TokenIdentifier;
    amount : Nat;
    fee : ?Nat;
    memo : Blob;
    notify : Bool;
    subaccount : ?SubAccount;
  };

  public type ExtTransferError = {
    #Unauthorized : EXTAccountIdentifier;
    #InsufficientBalance;
    #Rejected;
    #InvalidToken : TokenIdentifier;
    #CannotNotify : EXTAccountIdentifier;
    #Other : Text;
  };

  public type ExtTransferResponse = {
    #ok : Nat;
    #err : ExtTransferError;
  };

  public type CommonError = {
    #InvalidToken : TokenIdentifier;
    #Other : Text;
  };

  public type ExtBalanceRequest = {
    token : TokenIdentifier;
    user : AccountUser;
  };

  public type ExtBalanceResponse = {
    #ok : Nat;
    #err : CommonError;
  };

  // EXT metadata variant — collections may return different shapes
  public type ExtMetadataValue = {
    #text : Text;
    #blob : Blob;
    #nat : Nat;
    #nat8 : Nat8;
  };
  public type ExtMetadata = {
    #fungible : {
      name : Text;
      symbol : Text;
      decimals : Nat8;
      metadata : ?ExtMetadataValue;
    };
    #nonfungible : { metadata : ?ExtMetadataValue };
  };
  public type ExtMetadataContainerValue = {
    #text : Text;
    #blob : Blob;
    #nat : Nat;
    #nat8 : Nat8;
  };
  public type ExtMetadataContainerEntry = (
    Text,
    ExtMetadataContainerValue,
  );
  public type ExtMetadataContainer = {
    #blob : Blob;
    #data : [ExtMetadataContainerEntry];
    #json : Text;
  };
  public type ExtRichMetadata = {
    #fungible : {
      name : Text;
      symbol : Text;
      decimals : Nat8;
      metadata : ?ExtMetadataContainer;
    };
    #nonfungible : {
      asset : ?Text;
      assetlayers : ?[Nat64];
      metadata : ?ExtMetadataContainer;
      name : Text;
      thumbnail : ?Text;
    };
  };
  public type ExtRichMetadataResult = {
    #ok : ExtRichMetadata;
    #err : CommonError;
  };

  public type ExtListing = {
    locked : ?Int;
    price : Nat64;
    seller : Principal;
  };

  public type ExtTokensExtResult = {
    #ok : [(TokenIndex, ?ExtListing, ?Blob)];
    #err : CommonError;
  };

  public type ExtBearerResult = {
    #ok : EXTAccountIdentifier;
    #err : CommonError;
  };

  public type EXTActor = actor {
    transfer : (ExtTransferRequest) -> async ExtTransferResponse;
    ext_transfer : (ExtTransferRequest) -> async ExtTransferResponse;
    balance : shared query (ExtBalanceRequest) -> async ExtBalanceResponse;
    ext_balance : shared query (ExtBalanceRequest) -> async ExtBalanceResponse;
    // Query all token indices owned by an account identifier. Real EXT canisters
    // on ICP expect a hex-encoded Text (64 lowercase chars).
    tokens : shared query (accountId : EXTAccountIdentifier) -> async {
      #ok : [TokenIndex];
      #err : CommonError;
    };
    tokens_ext : shared query (accountId : EXTAccountIdentifier) -> async ExtTokensExtResult;
    // Legacy principal-only EXT-style collections enumerate tokens by principal.
    user_tokens : shared query (owner : Principal) -> async [TokenIndex];
    // Query collection-wide token ownership. Older EXT canisters such as
    // Motoko Ghosts expose this even when account-specific lookups are not
    // usable for wallet sync.
    getRegistry : shared query () -> async [(TokenIndex, EXTAccountIdentifier)];
    // Query metadata for a single token (some collections use this)
    metadata : shared query (tokenId : TokenIdentifier) -> async {
      #ok : ExtMetadata;
      #err : CommonError;
    };
    // Rich EXT metadata used by newer EXT-compatible collections.
    ext_metadata : shared query (tokenId : TokenIdentifier) -> async ExtRichMetadataResult;
    bearer : shared query (tokenId : TokenIdentifier) -> async ExtBearerResult;
    ext_bearer : shared query (tokenId : TokenIdentifier) -> async ExtBearerResult;
  };

  // ── DIP721 Standard ───────────────────────────────────────────────────────

  public type DIP721NatResult = {
    #Ok : Nat;
    #Err : DIP721Error;
  };

  public type DIP721Error = {
    #Unauthorized;
    #InvalidTokenId;
    #ZeroAddress;
    #Other : Text;
    #ExistedNFT;
    #SelfTransfer;
    #TokenNotFound;
    #OwnerNotFound;
    #OperatorNotFound;
    #SelfApprove;
    #UnauthorizedOwner;
    #UnauthorizedOperator;
  };

  public type TokenMetadataValue = {
    #IntContent : Int;
    #NatContent : Nat;
    #Nat64Content : Nat64;
    #Nat8Content : Nat8;
    #BoolContent : Bool;
    #BlobContent : Blob;
    #NestedContent : [(Text, TokenMetadataValue)];
    #Principal : Principal;
    #PrincipalContent : Principal;
    #TextContent : Text;
  };

  public type TokenMetadata = {
    transferred_at : ?Nat64;
    transferred_by : ?Principal;
    owner : ?Principal;
    operator : ?Principal;
    properties : [(Text, TokenMetadataValue)];
    is_burned : Bool;
    token_identifier : Nat;
    burned_at : ?Nat64;
    burned_by : ?Principal;
    approved_at : ?Nat64;
    approved_by : ?Principal;
    minted_at : Nat64;
    minted_by : Principal;
  };

  public type DIP721TokensResult = {
    #Ok : [Nat];
    #Err : DIP721Error;
  };

  public type DIP721MetadataResult = {
    #Ok : TokenMetadata;
    #Err : DIP721Error;
  };

  public type DIP721Actor = actor {
    transferFromDip721 : (from : Principal, to : Principal, tokenId : Nat) -> async DIP721NatResult;
    // Some implementations use 'transfer' or 'dip721_transfer' instead.
    transfer : (to : Principal, tokenId : Nat) -> async DIP721NatResult;
    dip721_transfer : (to : Principal, tokenId : Nat) -> async DIP721NatResult;
    // Query all token IDs owned by a principal
    dip721_owner_token_identifiers : shared query (
      owner : Principal
    ) -> async DIP721TokensResult;
    ownerTokenIdentifiers : shared query (owner : Principal) -> async DIP721TokensResult;
    // Query metadata for a single token
    dip721_token_metadata : shared query (
      token_id : Nat
    ) -> async DIP721MetadataResult;
    tokenMetadata : shared query (token_id : Nat) -> async DIP721MetadataResult;
    dip721_owner_of : shared query (token_id : Nat) -> async {
      #Ok : ?Principal;
      #Err : DIP721Error;
    };
    ownerOf : shared query (token_id : Nat) -> async {
      #Ok : ?Principal;
      #Err : DIP721Error;
    };
  };

  // ── ICRC-7 Standard ───────────────────────────────────────────────────────

  public type ICRC7Subaccount = Blob;

  public type ICRC7Account = {
    owner : Principal;
    subaccount : ?ICRC7Subaccount;
  };

  public type ICRC7Value = {
    #Blob : Blob;
    #Text : Text;
    #Nat : Nat;
    #Int : Int;
    #Array : [ICRC7Value];
    #Map : [(Text, ICRC7Value)];
  };

  public type ICRC7TokenMetadata = [(Text, ICRC7Value)];

  public type ICRC7TransferArg = {
    from_subaccount : ?Blob;
    to : ICRC7Account;
    token_id : Nat;
    memo : ?Blob;
    created_at_time : ?Nat64;
  };

  public type ICRC7TransferError = {
    #NonExistingTokenId;
    #InvalidRecipient;
    #Unauthorized;
    #TooOld;
    #CreatedInFuture : { ledger_time : Nat64 };
    #Duplicate : { duplicate_of : Nat };
    #GenericError : { error_code : Nat; message : Text };
    #GenericBatchError : { error_code : Nat; message : Text };
  };

  public type ICRC7TransferResult = {
    #Ok : Nat;
    #Err : ICRC7TransferError;
  };

  public type SupportedStandard = {
    name : Text;
    url : Text;
  };

  public type ICRC7Actor = actor {
    icrc7_collection_metadata : shared query () -> async [(Text, ICRC7Value)];
    icrc7_symbol : shared query () -> async Text;
    icrc7_name : shared query () -> async Text;
    icrc7_description : shared query () -> async ?Text;
    icrc7_logo : shared query () -> async ?Text;
    icrc7_total_supply : shared query () -> async Nat;
    icrc7_supply_cap : shared query () -> async ?Nat;
    icrc7_max_query_batch_size : shared query () -> async ?Nat;
    icrc7_max_update_batch_size : shared query () -> async ?Nat;
    icrc7_default_take_value : shared query () -> async ?Nat;
    icrc7_max_take_value : shared query () -> async ?Nat;
    icrc7_max_memo_size : shared query () -> async ?Nat;
    icrc7_atomic_batch_transfers : shared query () -> async ?Bool;
    icrc7_tx_window : shared query () -> async ?Nat;
    icrc7_permitted_drift : shared query () -> async ?Nat;
    icrc7_token_metadata : shared query (
      token_ids : [Nat]
    ) -> async [?ICRC7TokenMetadata];
    icrc7_owner_of : shared query (token_ids : [Nat]) -> async [?ICRC7Account];
    icrc7_balance_of : shared query ([ICRC7Account]) -> async [Nat];
    icrc7_tokens : shared query (prev : ?Nat, take : ?Nat) -> async [Nat];
    icrc7_tokens_of : shared query (
      account : ICRC7Account,
      prev : ?Nat,
      take : ?Nat,
    ) -> async [Nat];
    icrc7_transfer : ([ICRC7TransferArg]) -> async [?ICRC7TransferResult];
    icrc10_supported_standards : shared query () -> async [SupportedStandard];
  };
};
