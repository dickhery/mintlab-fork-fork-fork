import Array "mo:core/Array";
import Int "mo:core/Int";
import Map "mo:core/Map";
import Nat64 "mo:core/Nat64";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Types "../types/transactions";

module {
  let MAX_TRANSACTIONS_PER_USER : Nat = 50;
  let DEFAULT_RECENT_LIMIT : Nat = 10;
  let MAX_RECENT_LIMIT : Nat = 25;

  public type TransactionState = {
    transactionsByUser : Map.Map<Principal, [Types.RecentTransaction]>;
    var nextId : Nat;
  };

  public type TransactionInput = {
    kind : Types.TransactionKind;
    direction : Types.TransactionDirection;
    status : Types.TransactionStatus;
    amountE8s : ?Nat64;
    feeE8s : ?Nat64;
    title : Text;
    detail : Text;
    blockIndex : ?Nat64;
    reference : ?Text;
  };

  public func newState() : TransactionState {
    {
      transactionsByUser = Map.empty<Principal, [Types.RecentTransaction]>();
      var nextId = 1;
    };
  };

  public func record(
    state : TransactionState,
    user : Principal,
    input : TransactionInput,
  ) : Types.RecentTransaction {
    let tx : Types.RecentTransaction = {
      id = state.nextId;
      kind = input.kind;
      direction = input.direction;
      status = input.status;
      amountE8s = input.amountE8s;
      feeE8s = input.feeE8s;
      title = input.title;
      detail = input.detail;
      occurredAt = nowNat64();
      blockIndex = input.blockIndex;
      reference = input.reference;
    };
    state.nextId += 1;
    putForUser(state, user, tx);
    tx;
  };

  public func recordOnce(
    state : TransactionState,
    user : Principal,
    dedupeReference : Text,
    input : TransactionInput,
  ) : ?Types.RecentTransaction {
    if (hasReference(state, user, dedupeReference)) {
      return null;
    };
    ?record(state, user, { input with reference = ?dedupeReference });
  };

  public func recentForUser(
    state : TransactionState,
    user : Principal,
    requestedLimit : ?Nat,
  ) : [Types.RecentTransaction] {
    let all = switch (Map.get(state.transactionsByUser, Principal.compare, user)) {
      case (?values) values;
      case null [];
    };
    let limit = normalizeLimit(requestedLimit);
    let count = if (all.size() < limit) all.size() else limit;
    Array.tabulate<Types.RecentTransaction>(
      count,
      func(i) {
        all[all.size() - 1 - i];
      },
    );
  };

  public func recentNFTForUser(
    state : TransactionState,
    user : Principal,
    requestedLimit : ?Nat,
  ) : [Types.RecentTransaction] {
    let all = switch (Map.get(state.transactionsByUser, Principal.compare, user)) {
      case (?values) values;
      case null [];
    };
    let limit = normalizeLimit(requestedLimit);
    var selected : [Types.RecentTransaction] = [];
    var index = all.size();
    while (index > 0 and selected.size() < limit) {
      index -= 1;
      let tx = all[index];
      if (isNFTTransaction(tx)) {
        selected := Array.concat<Types.RecentTransaction>(selected, [tx]);
      };
    };
    selected;
  };

  public func isNFTTransaction(tx : Types.RecentTransaction) : Bool {
    switch (tx.kind) {
      case (#Mint) true;
      case (#MarketplacePurchase) true;
      case (#MarketplaceSale) true;
      case (_) isNFTTransferActivity(tx);
    };
  };

  func isNFTTransferActivity(tx : Types.RecentTransaction) : Bool {
    if (tx.title == "NFT sent" or tx.title == "NFT received") {
      return true;
    };
    switch (tx.reference) {
      case (?reference) {
        Text.startsWith(reference, #text "nft-transfer:")
          or Text.startsWith(reference, #text "nft-vault-transfer:")
          or Text.startsWith(reference, #text "mock-nft-");
      };
      case null false;
    };
  };

  func putForUser(
    state : TransactionState,
    user : Principal,
    tx : Types.RecentTransaction,
  ) {
    let current = switch (Map.get(state.transactionsByUser, Principal.compare, user)) {
      case (?values) values;
      case null [];
    };
    let next = appendBounded(current, tx);
    Map.add(state.transactionsByUser, Principal.compare, user, next);
  };

  func appendBounded(
    current : [Types.RecentTransaction],
    tx : Types.RecentTransaction,
  ) : [Types.RecentTransaction] {
    if (current.size() >= MAX_TRANSACTIONS_PER_USER) {
      let shifted = Array.sliceToArray<Types.RecentTransaction>(
        current,
        1,
        current.size(),
      );
      return Array.concat<Types.RecentTransaction>(shifted, [tx]);
    };
    Array.concat<Types.RecentTransaction>(current, [tx]);
  };

  func hasReference(
    state : TransactionState,
    user : Principal,
    reference : Text,
  ) : Bool {
    switch (Map.get(state.transactionsByUser, Principal.compare, user)) {
      case null false;
      case (?transactions) {
        for (tx in transactions.values()) {
          switch (tx.reference) {
            case (?existing) {
              if (existing == reference) {
                return true;
              };
            };
            case null {};
          };
        };
        false;
      };
    };
  };

  func normalizeLimit(requestedLimit : ?Nat) : Nat {
    switch (requestedLimit) {
      case null DEFAULT_RECENT_LIMIT;
      case (?value) {
        if (value == 0) {
          DEFAULT_RECENT_LIMIT;
        } else if (value > MAX_RECENT_LIMIT) {
          MAX_RECENT_LIMIT;
        } else {
          value;
        };
      };
    };
  };

  func nowNat64() : Nat64 {
    Nat64.fromNat(Int.abs(Time.now()));
  };
};
