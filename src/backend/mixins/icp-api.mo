import IcpLib "../lib/icp";
import MarketplaceLib "../lib/marketplace";
import CommonTypes "../types/common";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";

mixin (
  marketplaceUserPaymentLockState : MarketplaceLib.MarketplaceUserPaymentLockState,
  icpWithdrawalState : IcpLib.WithdrawalState,
  canisterId : Principal,
) {

  /// Query the caller's ICP subaccount balance (on-chain ledger call)
  public shared ({ caller }) func getUserICPBalance() : async Nat64 {
    if (Principal.isAnonymous(caller)) Runtime.trap("Anonymous caller not allowed");
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
    if (Principal.isAnonymous(caller)) Runtime.trap("Anonymous caller not allowed");
    let ledger = actor (IcpLib.LEDGER_CANISTER_ID) : IcpLib.Ledger;
    let feeE8s = await* IcpLib.getTransferFee(ledger);
    if (amount <= feeE8s) Runtime.trap("Amount must exceed the current transfer fee");
    if (not MarketplaceLib.acquireUserPaymentLock(marketplaceUserPaymentLockState, caller)) {
      Runtime.trap("Another ICP operation is already using your balance. Try again shortly.");
    };
    try {
      let sub = IcpLib.principalToSubaccount(caller);
      let withdrawal = IcpLib.beginWithdrawalWithClientNonce(icpWithdrawalState, caller, to, amount, clientNonce);
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
          ignore IcpLib.markWithdrawalCompleted(icpWithdrawalState, withdrawal, blockIndex);
          #Ok(blockIndex);
        };
        case (#Err(#TxDuplicate({ duplicate_of }))) {
          ignore IcpLib.markWithdrawalCompleted(icpWithdrawalState, withdrawal, duplicate_of);
          #Ok(duplicate_of);
        };
        case (#Err(error)) {
          ignore IcpLib.markWithdrawalFailed(
            icpWithdrawalState,
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
};
