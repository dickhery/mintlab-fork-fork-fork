import IcpLib "../lib/icp";
import MarketplaceLib "../lib/marketplace";
import TermsLib "../lib/terms";
import TransactionsLib "../lib/transactions";
import CommonTypes "../types/common";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Nat "mo:core/Nat";

mixin (
  marketplaceUserPaymentLockState : MarketplaceLib.MarketplaceUserPaymentLockState,
  icpWithdrawalState : IcpLib.WithdrawalState,
  transactionState : TransactionsLib.TransactionState,
  termsState : TermsLib.TermsState,
  canisterId : Principal,
) {

  /// Query the caller's ICP subaccount balance (on-chain ledger call)
  public shared ({ caller }) func getUserICPBalance() : async Nat64 {
    if (Principal.isAnonymous(caller)) Runtime.trap("You must be authenticated to do this.");
    let ledger = actor (IcpLib.LEDGER_CANISTER_ID) : IcpLib.Ledger;
    let sub = IcpLib.principalToSubaccount(caller);
    let account = IcpLib.accountIdentifier(canisterId, sub);
    await* IcpLib.getBalance(ledger, account);
  };

  /// Transfer ICP from the caller's subaccount to an external account identifier
  public shared ({ caller }) func transferICPOut(
    to : CommonTypes.AccountIdentifier,
    amount : Nat64,
  ) : async CommonTypes.TransferResult {
    await transferICPOutWithNonce(caller, to, amount, null);
  };

  public shared ({ caller }) func transferICPOutWithClientNonce(
    to : CommonTypes.AccountIdentifier,
    amount : Nat64,
    clientNonce : Nat64,
  ) : async CommonTypes.TransferResult {
    await transferICPOutWithNonce(caller, to, amount, ?clientNonce);
  };

  func transferICPOutWithNonce(
    caller : Principal,
    to : CommonTypes.AccountIdentifier,
    amount : Nat64,
    clientNonce : ?Nat64,
  ) : async CommonTypes.TransferResult {
    if (Principal.isAnonymous(caller)) Runtime.trap("You must be authenticated to do this.");
    TermsLib.requireCurrent(termsState, caller);
    let ledger = actor (IcpLib.LEDGER_CANISTER_ID) : IcpLib.Ledger;
    let feeE8s = await* IcpLib.getTransferFee(ledger);
    if (amount <= feeE8s) Runtime.trap("Amount must exceed the current transfer fee");
    if (not MarketplaceLib.acquireUserPaymentLock(marketplaceUserPaymentLockState, caller)) {
      Runtime.trap("Another ICP operation is already using your balance. Try again shortly.");
    };
    try {
      let sub = IcpLib.principalToSubaccount(caller);
      let preparedWithdrawal = IcpLib.beginWithdrawalWithClientNonce(icpWithdrawalState, caller, to, amount, clientNonce);
      let withdrawal = preparedWithdrawal.entry;
      switch (withdrawal.status) {
        case (#Completed) {
          switch (withdrawal.blockIndex) {
            case (?blockIndex) return #Ok(blockIndex);
            case null {};
          };
        };
        case (_) {};
      };
      let result = await* IcpLib.transferOutWithFeeAt(
        ledger,
        ?sub,
        to,
        amount,
        withdrawal.memo,
        feeE8s,
        withdrawal.createdAt,
      );
      switch (result) {
        case (#Ok(blockIndex)) {
          ignore IcpLib.markWithdrawalCompletedAtKey(icpWithdrawalState, preparedWithdrawal.key, withdrawal, blockIndex);
          recordICPWithdrawal(caller, withdrawal.id, amount, feeE8s, blockIndex);
          #Ok(blockIndex);
        };
        case (#Err(#TxDuplicate({ duplicate_of }))) {
          ignore IcpLib.markWithdrawalCompletedAtKey(icpWithdrawalState, preparedWithdrawal.key, withdrawal, duplicate_of);
          recordICPWithdrawal(caller, withdrawal.id, amount, feeE8s, duplicate_of);
          #Ok(duplicate_of);
        };
        case (#Err(error)) {
          ignore IcpLib.markWithdrawalFailedAtKey(
            icpWithdrawalState,
            preparedWithdrawal.key,
            withdrawal,
            IcpLib.transferErrorText(error),
          );
          #Err(error);
        };
      };
    } finally {
      MarketplaceLib.releaseUserPaymentLock(marketplaceUserPaymentLockState, caller);
    };
  };

  func recordICPWithdrawal(
    caller : Principal,
    withdrawalId : Nat,
    amount : Nat64,
    feeE8s : Nat64,
    blockIndex : Nat64,
  ) {
    ignore TransactionsLib.recordOnce(
      transactionState,
      caller,
      "icp-withdrawal:" # Nat.toText(withdrawalId),
      {
        kind = #ICPTransferOut;
        direction = #Out;
        status = #Completed;
        amountE8s = ?amount;
        feeE8s = ?feeE8s;
        title = "ICP sent";
        detail = "Transfer to external ICP account";
        blockIndex = ?blockIndex;
        reference = null;
      },
    );
  };
};
