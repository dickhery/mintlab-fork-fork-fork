import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import TransactionsLib "../lib/transactions";
import TransactionTypes "../types/transactions";

mixin (
  transactionState : TransactionsLib.TransactionState,
) {
  public shared query ({ caller }) func getMyRecentTransactions(
    limit : ?Nat
  ) : async [TransactionTypes.RecentTransaction] {
    if (Principal.isAnonymous(caller)) {
      Runtime.trap("Anonymous caller not allowed");
    };
    TransactionsLib.recentForUser(transactionState, caller, limit);
  };

  public shared query ({ caller }) func getMyRecentNFTTransactions(
    limit : ?Nat
  ) : async [TransactionTypes.RecentTransaction] {
    if (Principal.isAnonymous(caller)) {
      Runtime.trap("Anonymous caller not allowed");
    };
    TransactionsLib.recentNFTForUser(transactionState, caller, limit);
  };
};
