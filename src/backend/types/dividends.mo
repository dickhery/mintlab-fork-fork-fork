import CollectionTypes "collections";
import CommonTypes "common";
import WalletTypes "wallet";

module {
  public type CollectionDividendInfo = {
    collectionId : CollectionTypes.CollectionId;
    enabled : Bool;
    accountId : CommonTypes.AccountIdentifier;
    balanceE8s : Nat64;
    distributableBalanceE8s : Nat64;
    feeReserveE8s : Nat64;
    processedBalanceE8s : Nat64;
    pendingE8s : Nat64;
    nftCount : Nat;
  };

  public type NFTDividend = {
    nft : WalletTypes.WalletNFT;
    collection : CollectionTypes.Collection;
    claimableE8s : Nat64;
  };

  public type DividendSyncReceipt = {
    collectionId : CollectionTypes.CollectionId;
    depositedE8s : Nat64;
    distributedE8s : Nat64;
    shareE8s : Nat64;
    remainderE8s : Nat64;
    nftCount : Nat;
    balanceE8s : Nat64;
  };

  public type DividendClaimReceipt = {
    nft : WalletTypes.WalletNFT;
    collection : CollectionTypes.Collection;
    paidE8s : Nat64;
    feeE8s : Nat64;
    blockIndex : Nat64;
  };

  public type DividendDisbursementPreview = {
    collectionId : CollectionTypes.CollectionId;
    accountId : CommonTypes.AccountIdentifier;
    balanceE8s : Nat64;
    distributableBalanceE8s : Nat64;
    processedBalanceE8s : Nat64;
    pendingE8s : Nat64;
    projectedPendingE8s : Nat64;
    undistributedE8s : Nat64;
    shareE8s : Nat64;
    remainderE8s : Nat64;
    nftCount : Nat;
    transferCount : Nat;
    ledgerFeeE8s : Nat64;
    requiredNetworkFeeE8s : Nat64;
    feeReserveE8s : Nat64;
    feeShortfallE8s : Nat64;
    callerBalanceE8s : Nat64;
    callerFundingTransferFeeE8s : Nat64;
    callerTotalDebitE8s : Nat64;
    maxTransfersPerCall : Nat;
  };

  public type DividendDisbursementReceipt = {
    collectionId : CollectionTypes.CollectionId;
    synced : DividendSyncReceipt;
    paidCount : Nat;
    skippedCount : Nat;
    remainingCount : Nat;
    totalPaidE8s : Nat64;
    totalFeeE8s : Nat64;
    feeTopUpE8s : Nat64;
    feeTopUpBlockIndex : ?Nat64;
    feeReserveRemainingE8s : Nat64;
    failures : [Text];
  };
};
