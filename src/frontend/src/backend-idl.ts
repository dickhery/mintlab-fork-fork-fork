/* eslint-disable */

// @ts-nocheck

import { IDL } from "@icp-sdk/core/candid";

export const idlFactory = ({ IDL }) => {
  const ICRC7Value = IDL.Rec();
  const TokenMetadataValue = IDL.Rec();
  const NFTStandard = IDL.Variant({
    'EXT' : IDL.Null,
    'ICRC7' : IDL.Null,
    'DIP721' : IDL.Null,
    'Other' : IDL.Text,
  });
  const CollectionBrowseInfo = IDL.Record({
    'tokenIndexOffset' : IDL.Opt(IDL.Nat),
    'totalSupply' : IDL.Opt(IDL.Nat),
  });
  const CollectionId = IDL.Nat;
  const CollectionKind = IDL.Variant({
    'Minted' : IDL.Null,
    'External' : IDL.Null,
  });
  const CollectionDividendConfig = IDL.Record({ 'enabled' : IDL.Bool });
  const Collection = IDL.Record({
    'id' : CollectionId,
    'browseInfo' : IDL.Opt(CollectionBrowseInfo),
    'kind' : CollectionKind,
    'name' : IDL.Text,
    'description' : IDL.Text,
    'imageUrl' : IDL.Text,
    'standard' : NFTStandard,
    'symbol' : IDL.Text,
    'canisterId' : IDL.Principal,
    'dividendConfig' : IDL.Opt(CollectionDividendConfig),
  });
  const CollectionTrustStatus = IDL.Variant({
    'Verified' : IDL.Null,
    'Blocked' : IDL.Null,
    'SyncDisabled' : IDL.Null,
    'Hidden' : IDL.Null,
    'NeedsBrowseInfo' : IDL.Null,
    'Reported' : IDL.Null,
    'CommunityImported' : IDL.Null,
  });
  const CollectionImportMeta = IDL.Record({
    'collectionId' : CollectionId,
    'trustStatus' : CollectionTrustStatus,
    'reviewedAt' : IDL.Opt(IDL.Int),
    'createdAt' : IDL.Int,
    'lastReportReason' : IDL.Opt(IDL.Text),
    'lastReportedAt' : IDL.Opt(IDL.Int),
    'reportCount' : IDL.Nat,
    'importedBy' : IDL.Principal,
  });
  const CollectionImportMetaPage = IDL.Record({
    'metas' : IDL.Vec(CollectionImportMeta),
    'nextCursor' : IDL.Opt(IDL.Nat),
    'totalCount' : IDL.Nat,
  });
  const CollectionCanisterControllers = IDL.Record({
    'controllers' : IDL.Vec(IDL.Principal),
    'collectionId' : CollectionId,
    'appCanisterId' : IDL.Principal,
    'canisterId' : IDL.Principal,
  });
  const CollectionCreationReceipt = IDL.Record({
    'collection' : Collection,
    'paymentBlock' : IDL.Nat64,
  });
  const ListingId = IDL.Nat;
  const AccountIdentifier = IDL.Vec(IDL.Nat8);
  const SettlementEscrowRepairKind = IDL.Variant({
    'FixedPurchase' : IDL.Null,
    'Auction' : IDL.Null,
  });
  const MintlabFeeRecoveryQuote = IDL.Record({
    'escrowAccount' : AccountIdentifier,
    'ledgerFeeE8s' : IDL.Nat64,
    'mintlabFee' : IDL.Nat64,
    'expectedBeforeMintlabFeeDebit' : IDL.Nat64,
    'listingId' : ListingId,
    'kind' : SettlementEscrowRepairKind,
    'previousMintlabFeeCreatedAt' : IDL.Nat64,
    'shortfallBeforeMintlabFee' : IDL.Nat64,
    'expectedAfterMintlabFeeDebit' : IDL.Nat64,
    'escrowBalance' : IDL.Nat64,
    'escrowId' : IDL.Nat,
    'feeRecipient' : AccountIdentifier,
    'sellerProceeds' : IDL.Nat64,
  });
  const SettlementEscrowRepairQuote = IDL.Record({
    'escrowAccount' : AccountIdentifier,
    'topUpTransferFeeE8s' : IDL.Nat64,
    'ledgerFeeE8s' : IDL.Nat64,
    'topUpFromAccount' : AccountIdentifier,
    'mintlabFee' : IDL.Nat64,
    'listingId' : ListingId,
    'kind' : SettlementEscrowRepairKind,
    'topUpTotalDebit' : IDL.Nat64,
    'escrowBalance' : IDL.Nat64,
    'requiredDebit' : IDL.Nat64,
    'topUpFromBalance' : IDL.Nat64,
    'shortfall' : IDL.Nat64,
    'escrowId' : IDL.Nat,
    'sellerProceeds' : IDL.Nat64,
  });
  const NFTId = IDL.Nat;
  const UserId = IDL.Principal;
  const NFTMetadata = IDL.Record({
    'name' : IDL.Opt(IDL.Text),
    'description' : IDL.Opt(IDL.Text),
    'imageUrl' : IDL.Opt(IDL.Text),
    'attributes' : IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text)),
  });
  const Timestamp = IDL.Int;
  const WalletLocation = IDL.Variant({
    'Vaulted' : IDL.Null,
    'Minted' : IDL.Null,
    'Registered' : IDL.Null,
  });
  const WalletNFT = IDL.Record({
    'id' : NFTId,
    'tokenId' : IDL.Text,
    'collectionId' : CollectionId,
    'owner' : UserId,
    'metadata' : NFTMetadata,
    'registeredAt' : Timestamp,
    'location' : WalletLocation,
  });
  const SettlementStage = IDL.Variant({
    'NFTTransferPending' : IDL.Null,
    'MintlabFeePending' : IDL.Null,
    'PaymentPending' : IDL.Null,
    'SellerPaymentPending' : IDL.Null,
  });
  const FixedPurchaseSettlement = IDL.Record({
    'nft' : WalletNFT,
    'ledgerFeeE8s' : IDL.Nat64,
    'mintlabFee' : IDL.Nat64,
    'mintlabFeeCreatedAt' : IDL.Opt(IDL.Nat64),
    'nftDeliveredAt' : IDL.Opt(Timestamp),
    'listingId' : ListingId,
    'createdAt' : Timestamp,
    'paymentBlock' : IDL.Opt(IDL.Nat64),
    'seller' : UserId,
    'updatedAt' : Timestamp,
    'stage' : SettlementStage,
    'paymentEscrowId' : IDL.Nat,
    'paymentCreatedAt' : IDL.Nat64,
    'buyer' : UserId,
    'mintlabFeeBlock' : IDL.Opt(IDL.Nat64),
    'price' : IDL.Nat64,
    'sellerPaymentBlock' : IDL.Opt(IDL.Nat64),
    'feeRecipient' : IDL.Opt(AccountIdentifier),
    'sellerProceeds' : IDL.Nat64,
    'sellerPaymentCreatedAt' : IDL.Opt(IDL.Nat64),
  });
  const NoBidAuctionReturnStage = IDL.Variant({
    'CleanupPending' : IDL.Null,
    'NFTReturnPending' : IDL.Null,
    'WalletRegistrationPending' : IDL.Null,
  });
  const NoBidAuctionReturnSettlement = IDL.Record({
    'nft' : WalletNFT,
    'walletRegisteredAt' : IDL.Opt(Timestamp),
    'listingId' : ListingId,
    'createdAt' : Timestamp,
    'seller' : UserId,
    'updatedAt' : Timestamp,
    'stage' : NoBidAuctionReturnStage,
    'returnedAt' : IDL.Opt(Timestamp),
  });
  const AuctionEscrow = IDL.Record({
    'ledgerFeeE8s' : IDL.Nat64,
    'listingId' : ListingId,
    'createdAt' : Timestamp,
    'feeReserve' : IDL.Nat64,
    'depositedBlock' : IDL.Nat64,
    'escrowId' : IDL.Nat,
    'amount' : IDL.Nat64,
    'bidder' : UserId,
  });
  const PendingAuctionRefund = IDL.Record({
    'refundAmount' : IDL.Nat64,
    'createdAt' : Timestamp,
    'refundFeeE8s' : IDL.Nat64,
    'refundCreatedAt' : IDL.Nat64,
    'updatedAt' : Timestamp,
    'refundBlock' : IDL.Opt(IDL.Nat64),
    'escrow' : AuctionEscrow,
  });
  const PendingBidDeposit = IDL.Record({
    'ledgerFeeE8s' : IDL.Nat64,
    'listingId' : ListingId,
    'createdAt' : Timestamp,
    'paymentAttemptedAt' : IDL.Opt(Timestamp),
    'paymentBlock' : IDL.Opt(IDL.Nat64),
    'updatedAt' : Timestamp,
    'feeReserve' : IDL.Nat64,
    'paymentCreatedAt' : IDL.Nat64,
    'escrowId' : IDL.Nat,
    'escrowDeposit' : IDL.Nat64,
    'amount' : IDL.Nat64,
    'bidder' : UserId,
  });
  const AuctionSettlement = IDL.Record({
    'nft' : WalletNFT,
    'ledgerFeeE8s' : IDL.Nat64,
    'mintlabFee' : IDL.Nat64,
    'mintlabFeeCreatedAt' : IDL.Opt(IDL.Nat64),
    'nftDeliveredAt' : IDL.Opt(Timestamp),
    'listingId' : ListingId,
    'winningEscrowId' : IDL.Nat,
    'createdAt' : Timestamp,
    'winner' : UserId,
    'seller' : UserId,
    'updatedAt' : Timestamp,
    'stage' : SettlementStage,
    'winningEscrowDepositedBlock' : IDL.Nat64,
    'mintlabFeeBlock' : IDL.Opt(IDL.Nat64),
    'price' : IDL.Nat64,
    'sellerPaymentBlock' : IDL.Opt(IDL.Nat64),
    'feeRecipient' : IDL.Opt(AccountIdentifier),
    'sellerProceeds' : IDL.Nat64,
    'sellerPaymentCreatedAt' : IDL.Opt(IDL.Nat64),
  });
  const ListingReturnReason = IDL.Variant({
    'FixedCancel' : IDL.Null,
    'AuctionCancel' : IDL.Null,
  });
  const ListingReturnSettlement = IDL.Record({
    'nft' : WalletNFT,
    'refundEscrow' : IDL.Opt(AuctionEscrow),
    'walletRegisteredAt' : IDL.Opt(Timestamp),
    'listingId' : ListingId,
    'createdAt' : Timestamp,
    'seller' : UserId,
    'updatedAt' : Timestamp,
    'stage' : NoBidAuctionReturnStage,
    'returnedAt' : IDL.Opt(Timestamp),
    'reason' : ListingReturnReason,
  });
  const MarketplaceRecoverySnapshot = IDL.Record({
    'fixedSettlements' : IDL.Vec(FixedPurchaseSettlement),
    'activeListingLocks' : IDL.Vec(ListingId),
    'noBidReturns' : IDL.Vec(NoBidAuctionReturnSettlement),
    'activeListingTokenLocks' : IDL.Vec(IDL.Text),
    'pendingRefunds' : IDL.Vec(AuctionEscrow),
    'activeUserPaymentLocks' : IDL.Vec(UserId),
    'refundJournals' : IDL.Vec(PendingAuctionRefund),
    'pendingBids' : IDL.Vec(PendingBidDeposit),
    'auctionSettlements' : IDL.Vec(AuctionSettlement),
    'listingReturns' : IDL.Vec(ListingReturnSettlement),
  });
  const SettlementEscrowTopUpReceipt = IDL.Record({
    'feeE8s' : IDL.Nat64,
    'listingId' : ListingId,
    'quoteBefore' : SettlementEscrowRepairQuote,
    'blockIndex' : IDL.Nat64,
    'amount' : IDL.Nat64,
  });
  const EXTTokenIdentifier = IDL.Text;
  const EXTAccountIdentifier = IDL.Text;
  const EXTUser = IDL.Variant({
    'principal' : IDL.Principal,
    'address' : EXTAccountIdentifier,
  });
  const EXTBalanceRequest = IDL.Record({
    'token' : EXTTokenIdentifier,
    'user' : EXTUser,
  });
  const EXTBalance = IDL.Nat;
  const EXTCommonError = IDL.Variant({
    'InvalidToken' : EXTTokenIdentifier,
    'Other' : IDL.Text,
  });
  const EXTBalanceResponse = IDL.Variant({
    'ok' : EXTBalance,
    'err' : EXTCommonError,
  });
  const DividendClaimReceipt = IDL.Record({
    'nft' : WalletNFT,
    'collection' : Collection,
    'feeE8s' : IDL.Nat64,
    'blockIndex' : IDL.Nat64,
    'paidE8s' : IDL.Nat64,
  });
  const MarketplaceFeeConfig = IDL.Record({
    'ledgerFeeE8s' : IDL.Nat64,
    'mintlabFeeRecipient' : IDL.Opt(AccountIdentifier),
    'mintlabFeeBasisPoints' : IDL.Nat,
    'auctionBidFeeReserveE8s' : IDL.Nat64,
  });
  const ModerationCategorySettings = IDL.Record({
    'selfHarm' : IDL.Bool,
    'hateSymbols' : IDL.Bool,
    'hateOrHarassment' : IDL.Bool,
    'otherNsfw' : IDL.Bool,
    'explicitLanguage' : IDL.Bool,
    'illegalOrDangerous' : IDL.Bool,
    'nudityOrSexual' : IDL.Bool,
    'graphicViolence' : IDL.Bool,
  });
  const PublicModerationConfig = IDL.Record({
    'categories' : ModerationCategorySettings,
    'model' : IDL.Text,
    'apiKeyConfigured' : IDL.Bool,
    'userMessage' : IDL.Text,
    'enabled' : IDL.Bool,
  });
  const ListingStatus = IDL.Variant({
    'Sold' : IDL.Null,
    'Active' : IDL.Null,
    'Cancelled' : IDL.Null,
    'Settled' : IDL.Null,
  });
  const AuctionListing = IDL.Record({
    'id' : ListingId,
    'status' : ListingStatus,
    'highestBidder' : IDL.Opt(UserId),
    'endTime' : Timestamp,
    'createdAt' : Timestamp,
    'seller' : UserId,
    'highestBid' : IDL.Nat64,
    'nftId' : NFTId,
    'startingBid' : IDL.Nat64,
  });
  const MarketplaceBidResult = IDL.Variant({
    'ok' : AuctionListing,
    'err' : IDL.Text,
  });
  const MarketplaceActionResult = IDL.Variant({
    'ok' : IDL.Bool,
    'err' : IDL.Text,
  });
  const FixedListing = IDL.Record({
    'id' : ListingId,
    'status' : ListingStatus,
    'createdAt' : Timestamp,
    'seller' : UserId,
    'nftId' : NFTId,
    'price' : IDL.Nat64,
  });
  const DIP721Error = IDL.Variant({
    'UnauthorizedOperator' : IDL.Null,
    'SelfTransfer' : IDL.Null,
    'TokenNotFound' : IDL.Null,
    'UnauthorizedOwner' : IDL.Null,
    'ZeroAddress' : IDL.Null,
    'InvalidTokenId' : IDL.Null,
    'SelfApprove' : IDL.Null,
    'OperatorNotFound' : IDL.Null,
    'Unauthorized' : IDL.Null,
    'ExistedNFT' : IDL.Null,
    'OwnerNotFound' : IDL.Null,
    'Other' : IDL.Text,
  });
  const DIP721TokensResult = IDL.Variant({
    'Ok' : IDL.Vec(IDL.Nat),
    'Err' : DIP721Error,
  });
  TokenMetadataValue.fill(
    IDL.Variant({
      'Nat64Content' : IDL.Nat64,
      'BoolContent' : IDL.Bool,
      'Nat8Content' : IDL.Nat8,
      'IntContent' : IDL.Int,
      'NatContent' : IDL.Nat,
      'BlobContent' : IDL.Vec(IDL.Nat8),
      'NestedContent' : IDL.Vec(IDL.Tuple(IDL.Text, TokenMetadataValue)),
      'Principal' : IDL.Principal,
      'PrincipalContent' : IDL.Principal,
      'TextContent' : IDL.Text,
    })
  );
  const TokenMetadata = IDL.Record({
    'transferred_at' : IDL.Opt(IDL.Nat64),
    'transferred_by' : IDL.Opt(IDL.Principal),
    'owner' : IDL.Opt(IDL.Principal),
    'operator' : IDL.Opt(IDL.Principal),
    'approved_at' : IDL.Opt(IDL.Nat64),
    'approved_by' : IDL.Opt(IDL.Principal),
    'properties' : IDL.Vec(IDL.Tuple(IDL.Text, TokenMetadataValue)),
    'is_burned' : IDL.Bool,
    'token_identifier' : IDL.Nat,
    'burned_at' : IDL.Opt(IDL.Nat64),
    'burned_by' : IDL.Opt(IDL.Principal),
    'minted_at' : IDL.Nat64,
    'minted_by' : IDL.Principal,
  });
  const DIP721MetadataResult = IDL.Variant({
    'Ok' : TokenMetadata,
    'Err' : DIP721Error,
  });
  const DividendSyncReceipt = IDL.Record({
    'collectionId' : CollectionId,
    'shareE8s' : IDL.Nat64,
    'nftCount' : IDL.Nat,
    'distributedE8s' : IDL.Nat64,
    'depositedE8s' : IDL.Nat64,
    'balanceE8s' : IDL.Nat64,
    'remainderE8s' : IDL.Nat64,
  });
  const DividendDisbursementReceipt = IDL.Record({
    'failures' : IDL.Vec(IDL.Text),
    'feeTopUpBlockIndex' : IDL.Opt(IDL.Nat64),
    'collectionId' : CollectionId,
    'feeTopUpE8s' : IDL.Nat64,
    'totalPaidE8s' : IDL.Nat64,
    'feeReserveRemainingE8s' : IDL.Nat64,
    'skippedCount' : IDL.Nat,
    'paidCount' : IDL.Nat,
    'remainingCount' : IDL.Nat,
    'synced' : DividendSyncReceipt,
    'totalFeeE8s' : IDL.Nat64,
  });
  const EXTMetadataValue = IDL.Tuple(
    IDL.Text,
    IDL.Variant({
      'nat' : IDL.Nat,
      'blob' : IDL.Vec(IDL.Nat8),
      'nat8' : IDL.Nat8,
      'text' : IDL.Text,
    }),
  );
  const EXTMetadataContainer = IDL.Variant({
    'blob' : IDL.Vec(IDL.Nat8),
    'data' : IDL.Vec(EXTMetadataValue),
    'json' : IDL.Text,
  });
  const EXTMetadata = IDL.Variant({
    'fungible' : IDL.Record({
      'decimals' : IDL.Nat8,
      'metadata' : IDL.Opt(EXTMetadataContainer),
      'name' : IDL.Text,
      'symbol' : IDL.Text,
    }),
    'nonfungible' : IDL.Record({
      'thumbnail' : IDL.Text,
      'asset' : IDL.Text,
      'metadata' : IDL.Opt(EXTMetadataContainer),
      'name' : IDL.Text,
    }),
  });
  const EXTMetadataResult = IDL.Variant({
    'ok' : EXTMetadata,
    'err' : EXTCommonError,
  });
  const EXTMemo = IDL.Vec(IDL.Nat8);
  const EXTSubAccount = IDL.Vec(IDL.Nat8);
  const EXTTransferRequest = IDL.Record({
    'to' : EXTUser,
    'token' : EXTTokenIdentifier,
    'notify' : IDL.Bool,
    'from' : EXTUser,
    'memo' : EXTMemo,
    'subaccount' : IDL.Opt(EXTSubAccount),
    'amount' : EXTBalance,
  });
  const EXTTransferResponse = IDL.Variant({
    'ok' : EXTBalance,
    'err' : IDL.Variant({
      'CannotNotify' : EXTAccountIdentifier,
      'InsufficientBalance' : IDL.Null,
      'InvalidToken' : EXTTokenIdentifier,
      'Rejected' : IDL.Null,
      'Unauthorized' : EXTAccountIdentifier,
      'Other' : IDL.Text,
    }),
  });
  const ActiveListing = IDL.Variant({
    'Fixed' : FixedListing,
    'Auction' : AuctionListing,
  });
  const ActiveListingDetail = IDL.Record({
    'nft' : WalletNFT,
    'listing' : ActiveListing,
  });
  const ActiveListingDetailPage = IDL.Record({
    'totalCount' : IDL.Nat,
    'details' : IDL.Vec(ActiveListingDetail),
    'nextCursor' : IDL.Opt(IDL.Nat),
  });
  const ActiveListingPage = IDL.Record({
    'listings' : IDL.Vec(ActiveListing),
    'totalCount' : IDL.Nat,
    'nextCursor' : IDL.Opt(IDL.Nat),
  });
  const CollectionCreationStatus = IDL.Variant({
    'Started' : IDL.Null,
    'Failed' : IDL.Null,
    'CanisterCreated' : IDL.Null,
    'CyclesConverted' : IDL.Null,
    'AdminPayoutPending' : IDL.Null,
    'AdminPayoutSent' : IDL.Null,
    'CyclePaymentSent' : IDL.Null,
    'CollectionRegistered' : IDL.Null,
    'Installed' : IDL.Null,
  });
  const CollectionCreationRequestView = IDL.Record({
    'id' : IDL.Nat,
    'status' : CollectionCreationStatus,
    'collectionId' : IDL.Opt(CollectionId),
    'cyclePaymentBlock' : IDL.Opt(IDL.Nat64),
    'name' : IDL.Text,
    'createdAt' : IDL.Nat64,
    'childCanisterId' : IDL.Opt(IDL.Principal),
    'updatedAt' : IDL.Nat64,
    'lastError' : IDL.Opt(IDL.Text),
    'symbol' : IDL.Text,
  });
  const CollectionCreationRequestPage = IDL.Record({
    'totalCount' : IDL.Nat,
    'requests' : IDL.Vec(CollectionCreationRequestView),
    'nextCursor' : IDL.Opt(IDL.Nat),
  });
  const AppCanisterKind = IDL.Variant({
    'Frontend' : IDL.Null,
    'Backend' : IDL.Null,
  });
  const AppCanisterHealth = IDL.Record({
    'kind' : AppCanisterKind,
    'moduleInstalled' : IDL.Opt(IDL.Bool),
    'error' : IDL.Opt(IDL.Text),
    'cycles' : IDL.Opt(IDL.Nat),
    'freezingThresholdSeconds' : IDL.Opt(IDL.Nat),
    'idleCyclesBurnedPerDay' : IDL.Opt(IDL.Nat),
    'canisterId' : IDL.Principal,
  });
  const CollectionBrowseCoverage = IDL.Variant({
    'Full' : IDL.Null,
    'Partial' : IDL.Null,
  });
  const CollectionBrowseStats = IDL.Record({
    'collectionId' : CollectionId,
    'note' : IDL.Text,
    'totalCount' : IDL.Nat,
    'visibleCount' : IDL.Nat,
    'coverage' : CollectionBrowseCoverage,
  });
  const CollectionCreationDiagnostics = IDL.Record({
    'childTargetCycles' : IDL.Nat,
    'requiredBackendCycles' : IDL.Nat,
    'request' : CollectionCreationRequestView,
    'requestedCanisterCycles' : IDL.Nat,
    'totalCyclesToConvert' : IDL.Nat,
    'buildVersion' : IDL.Text,
    'backendCycles' : IDL.Nat,
    'canisterCreationFeeCycles' : IDL.Nat,
    'canCreateNow' : IDL.Bool,
    'createCallCycles' : IDL.Nat,
  });
  const DividendBalancePage = IDL.Record({
    'totalCount' : IDL.Nat,
    'nextCursor' : IDL.Opt(IDL.Nat),
    'balances' : IDL.Vec(IDL.Tuple(IDL.Text, IDL.Nat64)),
  });
  const CollectionDividendInfo = IDL.Record({
    'accountId' : AccountIdentifier,
    'collectionId' : CollectionId,
    'feeReserveE8s' : IDL.Nat64,
    'nftCount' : IDL.Nat,
    'enabled' : IDL.Bool,
    'balanceE8s' : IDL.Nat64,
    'processedBalanceE8s' : IDL.Nat64,
    'pendingE8s' : IDL.Nat64,
    'distributableBalanceE8s' : IDL.Nat64,
  });
  const CollectionIndexStatus = IDL.Record({
    'collectionId' : CollectionId,
    'cursor' : IDL.Opt(IDL.Text),
    'scanned' : IDL.Nat,
    'complete' : IDL.Bool,
    'updatedAt' : Timestamp,
    'lastError' : IDL.Opt(IDL.Text),
    'indexed' : IDL.Nat,
  });
  const CollectionNFTPage = IDL.Record({
    'nfts' : IDL.Vec(WalletNFT),
    'note' : IDL.Text,
    'totalCount' : IDL.Nat,
    'coverage' : CollectionBrowseCoverage,
    'nextCursor' : IDL.Opt(IDL.Text),
  });
  const MintConfig = IDL.Record({
    'collectionCreationPriceE8s' : IDL.Nat64,
    'collectionCreationPrimaryPayoutBasisPoints' : IDL.Nat,
    'collectionCreationEnabled' : IDL.Bool,
    'collectionId' : IDL.Opt(CollectionId),
    'collectionCreationSecondaryPayoutAccount' : IDL.Opt(AccountIdentifier),
    'payoutAccount' : IDL.Opt(AccountIdentifier),
    'mainMintEnabled' : IDL.Bool,
    'mainMintPriceE8s' : IDL.Nat64,
    'collectionCreationSecondaryPayoutBasisPoints' : IDL.Nat,
    'mintEnabled' : IDL.Bool,
    'mintPriceE8s' : IDL.Nat64,
    'collectionCreationPayoutAccount' : IDL.Opt(AccountIdentifier),
    'collectionCanisterWasmUploaded' : IDL.Bool,
    'mainMintPayoutAccount' : IDL.Opt(AccountIdentifier),
    'collectionCanisterCycles' : IDL.Nat,
  });
  const AuctionBidStatus = IDL.Record({
    'highestBidder' : IDL.Opt(UserId),
    'listingId' : ListingId,
    'myHighestBid' : IDL.Opt(IDL.Nat64),
    'highestBid' : IDL.Nat64,
    'hasBid' : IDL.Bool,
    'isWinning' : IDL.Bool,
  });
  const CollectionCanisterStatus = IDL.Record({
    'controllers' : IDL.Vec(IDL.Principal),
    'collectionId' : CollectionId,
    'moduleInstalled' : IDL.Bool,
    'appCanisterId' : IDL.Principal,
    'cycles' : IDL.Nat,
    'freezingThresholdSeconds' : IDL.Nat,
    'idleCyclesBurnedPerDay' : IDL.Nat,
    'canisterId' : IDL.Principal,
  });
  const NFTDividend = IDL.Record({
    'nft' : WalletNFT,
    'collection' : Collection,
    'claimableE8s' : IDL.Nat64,
  });
  const NFTDividendPage = IDL.Record({
    'totalCount' : IDL.Nat,
    'dividends' : IDL.Vec(NFTDividend),
    'nextCursor' : IDL.Opt(IDL.Nat),
  });
  const SettlementStatusKind = IDL.Variant({
    'NoBidAuctionReturn' : IDL.Null,
    'PendingAuctionRefund' : IDL.Null,
    'FixedPurchase' : IDL.Null,
    'Auction' : IDL.Null,
    'ListingReturn' : IDL.Null,
    'PendingBidDeposit' : IDL.Null,
  });
  const SettlementStatusRole = IDL.Variant({
    'Bidder' : IDL.Null,
    'Buyer' : IDL.Null,
    'Seller' : IDL.Null,
  });
  const SettlementStatus = IDL.Record({
    'listingId' : ListingId,
    'kind' : SettlementStatusKind,
    'role' : SettlementStatusRole,
    'updatedAt' : Timestamp,
    'stage' : IDL.Text,
    'message' : IDL.Text,
  });
  const SettlementStatusPage = IDL.Record({
    'statuses' : IDL.Vec(SettlementStatus),
    'nextCursor' : IDL.Opt(IDL.Nat),
    'totalCount' : IDL.Nat,
  });
  const PendingMintPaymentStatus = IDL.Variant({
    'Failed' : IDL.Null,
    'Minted' : IDL.Null,
    'PaymentSent' : IDL.Null,
    'PaymentPending' : IDL.Null,
  });
  const PendingMintPaymentView = IDL.Record({
    'id' : IDL.Nat,
    'status' : PendingMintPaymentStatus,
    'collectionId' : CollectionId,
    'createdAt' : IDL.Nat64,
    'paymentBlock' : IDL.Opt(IDL.Nat64),
    'updatedAt' : IDL.Nat64,
    'mintedTokenId' : IDL.Opt(IDL.Nat),
    'amountE8s' : IDL.Nat64,
    'lastError' : IDL.Opt(IDL.Text),
  });
  const NFTStats = IDL.Record({
    'totalCount' : IDL.Nat,
    'perCollection' : IDL.Vec(IDL.Tuple(CollectionId, IDL.Nat)),
  });
  const EXTTokenIndex = IDL.Nat32;
  const EXTMetadataLegacy = IDL.Variant({
    'fungible' : IDL.Record({
      'decimals' : IDL.Nat8,
      'metadata' : IDL.Opt(IDL.Vec(IDL.Nat8)),
      'name' : IDL.Text,
      'symbol' : IDL.Text,
    }),
    'nonfungible' : IDL.Record({ 'metadata' : IDL.Opt(IDL.Vec(IDL.Nat8)) }),
  });
  const WalletNFTPage = IDL.Record({
    'nfts' : IDL.Vec(WalletNFT),
    'totalCount' : IDL.Nat,
    'nextCursor' : IDL.Opt(IDL.Nat),
  });
  const HeaderField = IDL.Tuple(IDL.Text, IDL.Text);
  const AssetHttpRequest = IDL.Record({
    'url' : IDL.Text,
    'method' : IDL.Text,
    'body' : IDL.Vec(IDL.Nat8),
    'headers' : IDL.Vec(HeaderField),
  });
  const AssetHttpResponse = IDL.Record({
    'body' : IDL.Vec(IDL.Nat8),
    'headers' : IDL.Vec(HeaderField),
    'upgrade' : IDL.Bool,
    'status_code' : IDL.Nat16,
  });
  const SupportedStandard = IDL.Record({ 'url' : IDL.Text, 'name' : IDL.Text });
  const ICRC7Subaccount = IDL.Vec(IDL.Nat8);
  const ICRC7Account = IDL.Record({
    'owner' : IDL.Principal,
    'subaccount' : IDL.Opt(ICRC7Subaccount),
  });
  ICRC7Value.fill(
    IDL.Variant({
      'Int' : IDL.Int,
      'Map' : IDL.Vec(IDL.Tuple(IDL.Text, ICRC7Value)),
      'Nat' : IDL.Nat,
      'Blob' : IDL.Vec(IDL.Nat8),
      'Text' : IDL.Text,
      'Array' : IDL.Vec(ICRC7Value),
    })
  );
  const ICRC7TokenMetadata = IDL.Vec(IDL.Tuple(IDL.Text, ICRC7Value));
  const ICRC7TransferArg = IDL.Record({
    'to' : ICRC7Account,
    'token_id' : IDL.Nat,
    'memo' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'from_subaccount' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'created_at_time' : IDL.Opt(IDL.Nat64),
  });
  const ICRC7TransferError = IDL.Variant({
    'GenericError' : IDL.Record({
      'message' : IDL.Text,
      'error_code' : IDL.Nat,
    }),
    'Duplicate' : IDL.Record({ 'duplicate_of' : IDL.Nat }),
    'NonExistingTokenId' : IDL.Null,
    'Unauthorized' : IDL.Null,
    'CreatedInFuture' : IDL.Record({ 'ledger_time' : IDL.Nat64 }),
    'InvalidRecipient' : IDL.Null,
    'GenericBatchError' : IDL.Record({
      'message' : IDL.Text,
      'error_code' : IDL.Nat,
    }),
    'TooOld' : IDL.Null,
  });
  const ICRC7TransferResult = IDL.Variant({
    'Ok' : IDL.Nat,
    'Err' : ICRC7TransferError,
  });
  const CollectionIndexPageResult = IDL.Record({
    'collectionId' : CollectionId,
    'scanned' : IDL.Nat,
    'error' : IDL.Opt(IDL.Text),
    'complete' : IDL.Bool,
    'indexed' : IDL.Nat,
    'nextCursor' : IDL.Opt(IDL.Text),
  });
  const CollectionPage = IDL.Record({
    'totalCount' : IDL.Nat,
    'collections' : IDL.Vec(Collection),
    'nextCursor' : IDL.Opt(IDL.Nat),
  });
  const MintReceipt = IDL.Record({
    'nft' : WalletNFT,
    'paymentBlock' : IDL.Nat64,
  });
  const DividendDisbursementPreview = IDL.Record({
    'ledgerFeeE8s' : IDL.Nat64,
    'requiredNetworkFeeE8s' : IDL.Nat64,
    'accountId' : AccountIdentifier,
    'collectionId' : CollectionId,
    'shareE8s' : IDL.Nat64,
    'feeReserveE8s' : IDL.Nat64,
    'projectedPendingE8s' : IDL.Nat64,
    'nftCount' : IDL.Nat,
    'feeShortfallE8s' : IDL.Nat64,
    'undistributedE8s' : IDL.Nat64,
    'maxTransfersPerCall' : IDL.Nat,
    'balanceE8s' : IDL.Nat64,
    'remainderE8s' : IDL.Nat64,
    'processedBalanceE8s' : IDL.Nat64,
    'transferCount' : IDL.Nat,
    'pendingE8s' : IDL.Nat64,
    'callerFundingTransferFeeE8s' : IDL.Nat64,
    'callerTotalDebitE8s' : IDL.Nat64,
    'distributableBalanceE8s' : IDL.Nat64,
    'callerBalanceE8s' : IDL.Nat64,
  });
  const CollectionCycleTopUpQuote = IDL.Record({
    'cycleCostE8s' : IDL.Nat64,
    'ledgerFeeE8s' : IDL.Nat64,
    'rateTimestampSeconds' : IDL.Nat64,
    'xdrPermyriadPerIcp' : IDL.Nat64,
    'totalUserDebitE8s' : IDL.Nat64,
    'cyclesToTopUp' : IDL.Nat,
  });
  const CollectionCreationQuote = IDL.Record({
    'cycleCostE8s' : IDL.Nat64,
    'ledgerFeeE8s' : IDL.Nat64,
    'collectionCreationPriceE8s' : IDL.Nat64,
    'rateTimestampSeconds' : IDL.Nat64,
    'adminSecondaryPayoutE8s' : IDL.Nat64,
    'cycleTransferFeeE8s' : IDL.Nat64,
    'minimumCreationPriceE8s' : IDL.Nat64,
    'xdrPermyriadPerIcp' : IDL.Nat64,
    'factoryReserveCycles' : IDL.Nat,
    'adminPrimaryPayoutE8s' : IDL.Nat64,
    'totalCyclesToConvert' : IDL.Nat,
    'totalUserDebitE8s' : IDL.Nat64,
    'adminPayoutE8s' : IDL.Nat64,
    'adminPayoutFeeE8s' : IDL.Nat64,
    'collectionCanisterCycles' : IDL.Nat,
  });
  const WalletSyncSkip = IDL.Record({
    'collectionId' : CollectionId,
    'message' : IDL.Text,
    'collectionName' : IDL.Text,
    'reason' : IDL.Text,
  });
  const WalletSyncPageResult = IDL.Record({
    'skipped' : IDL.Vec(WalletSyncSkip),
    'errors' : IDL.Vec(IDL.Text),
    'checkedCollections' : IDL.Nat,
    'newCount' : IDL.Nat,
    'complete' : IDL.Bool,
    'nextCursor' : IDL.Opt(IDL.Nat),
  });
  const WalletCollectionSyncProgress = IDL.Record({
    'skipped' : IDL.Vec(WalletSyncSkip),
    'status' : IDL.Opt(CollectionIndexStatus),
    'errors' : IDL.Vec(IDL.Text),
    'indexedThisRun' : IDL.Nat,
    'collectionId' : CollectionId,
    'newCount' : IDL.Nat,
    'complete' : IDL.Bool,
    'nextCursor' : IDL.Opt(IDL.Text),
    'scannedThisRun' : IDL.Nat,
  });
  const WalletSyncV2Result = IDL.Record({
    'skipped' : IDL.Vec(WalletSyncSkip),
    'errors' : IDL.Vec(IDL.Text),
    'newCount' : IDL.Nat,
  });
  const EXTTime = IDL.Int;
  const EXTListing = IDL.Record({
    'locked' : IDL.Opt(EXTTime),
    'seller' : IDL.Principal,
    'price' : IDL.Nat64,
  });
  const EXTTokensExtResult = IDL.Variant({
    'ok' : IDL.Vec(
      IDL.Tuple(EXTTokenIndex, IDL.Opt(EXTListing), IDL.Opt(IDL.Vec(IDL.Nat8)))
    ),
    'err' : EXTCommonError,
  });
  const AppCycleTopUpReceipt = IDL.Record({
    'cycleCostE8s' : IDL.Nat64,
    'cycleBalance' : IDL.Opt(IDL.Nat),
    'cyclesRequested' : IDL.Nat,
    'paymentBlock' : IDL.Nat64,
    'totalUserDebitE8s' : IDL.Nat64,
    'cyclesMinted' : IDL.Nat,
    'canisterId' : IDL.Principal,
  });
  const CollectionCycleTopUpReceipt = IDL.Record({
    'cycleCostE8s' : IDL.Nat64,
    'collectionId' : CollectionId,
    'cycleBalance' : IDL.Opt(IDL.Nat),
    'cyclesRequested' : IDL.Nat,
    'paymentBlock' : IDL.Nat64,
    'totalUserDebitE8s' : IDL.Nat64,
    'cyclesMinted' : IDL.Nat,
    'canisterId' : IDL.Principal,
  });
  const DIP721NatResult = IDL.Variant({ 'Ok' : IDL.Nat, 'Err' : DIP721Error });
  const Tokens = IDL.Record({ 'e8s' : IDL.Nat64 });
  const TransferError = IDL.Variant({
    'TxTooOld' : IDL.Record({ 'allowed_window_nanos' : IDL.Nat64 }),
    'BadFee' : IDL.Record({ 'expected_fee' : Tokens }),
    'TxDuplicate' : IDL.Record({ 'duplicate_of' : IDL.Nat64 }),
    'TxCreatedInFuture' : IDL.Null,
    'InsufficientFunds' : IDL.Record({ 'balance' : Tokens }),
  });
  const TransferResult = IDL.Variant({
    'Ok' : IDL.Nat64,
    'Err' : TransferError,
  });
  const TransactionKind = IDL.Variant({
    'ICPTransferOut' : IDL.Null,
    'Mint' : IDL.Null,
    'CollectionCreation' : IDL.Null,
    'CollectionCanisterTopUp' : IDL.Null,
    'AppCanisterTopUp' : IDL.Null,
    'MarketplacePurchase' : IDL.Null,
    'MarketplaceSale' : IDL.Null,
    'AuctionBid' : IDL.Null,
    'AuctionRefund' : IDL.Null,
    'DividendClaim' : IDL.Null,
  });
  const TransactionDirection = IDL.Variant({
    'In' : IDL.Null,
    'Out' : IDL.Null,
    'Neutral' : IDL.Null,
  });
  const TransactionStatus = IDL.Variant({
    'Pending' : IDL.Null,
    'Completed' : IDL.Null,
    'Failed' : IDL.Null,
  });
  const RecentTransaction = IDL.Record({
    'id' : IDL.Nat,
    'kind' : TransactionKind,
    'direction' : TransactionDirection,
    'status' : TransactionStatus,
    'amountE8s' : IDL.Opt(IDL.Nat64),
    'feeE8s' : IDL.Opt(IDL.Nat64),
    'title' : IDL.Text,
    'detail' : IDL.Text,
    'occurredAt' : IDL.Nat64,
    'blockIndex' : IDL.Opt(IDL.Nat64),
    'reference' : IDL.Opt(IDL.Text),
  });
  const HttpHeader = IDL.Record({ 'value' : IDL.Text, 'name' : IDL.Text });
  const HttpRequestResult = IDL.Record({
    'status' : IDL.Nat,
    'body' : IDL.Vec(IDL.Nat8),
    'headers' : IDL.Vec(HttpHeader),
  });
  return IDL.Service({
    'addCollection' : IDL.Func(
        [
          IDL.Text,
          IDL.Text,
          IDL.Principal,
          NFTStandard,
          IDL.Text,
          IDL.Text,
          IDL.Opt(CollectionBrowseInfo),
        ],
        [Collection],
        [],
      ),
    'addCollectionCanisterController' : IDL.Func(
        [CollectionId, IDL.Principal],
        [
          IDL.Variant({
            'ok' : CollectionCanisterControllers,
            'err' : IDL.Text,
          }),
        ],
        [],
      ),
    'adminAttachExistingCanisterToCreationRequest' : IDL.Func(
        [IDL.Nat, IDL.Principal],
        [IDL.Variant({ 'ok' : CollectionCreationReceipt, 'err' : IDL.Text })],
        [],
      ),
    'adminBlockCollection' : IDL.Func(
        [CollectionId],
        [IDL.Variant({ 'ok' : CollectionImportMeta, 'err' : IDL.Text })],
        [],
      ),
    'adminDeleteCollectionCreationRequest' : IDL.Func(
        [IDL.Nat],
        [IDL.Variant({ 'ok' : IDL.Bool, 'err' : IDL.Text })],
        [],
      ),
    'adminDisableCollectionSync' : IDL.Func(
        [CollectionId],
        [IDL.Variant({ 'ok' : CollectionImportMeta, 'err' : IDL.Text })],
        [],
      ),
    'adminGetMintlabFeeRecoveryQuote' : IDL.Func(
        [ListingId],
        [MintlabFeeRecoveryQuote],
        [],
      ),
    'adminGetSettlementEscrowRepairQuote' : IDL.Func(
        [ListingId],
        [SettlementEscrowRepairQuote],
        [],
      ),
    'adminHideCollection' : IDL.Func(
        [CollectionId],
        [IDL.Variant({ 'ok' : CollectionImportMeta, 'err' : IDL.Text })],
        [],
      ),
    'adminListMarketplaceRecoveryState' : IDL.Func(
        [],
        [MarketplaceRecoverySnapshot],
        ['query'],
      ),
    'adminMarkCollectionNeedsBrowseInfo' : IDL.Func(
        [CollectionId],
        [IDL.Variant({ 'ok' : CollectionImportMeta, 'err' : IDL.Text })],
        [],
      ),
    'adminMarkMintlabFeeBalanceVerified' : IDL.Func(
        [ListingId],
        [MintlabFeeRecoveryQuote],
        [],
      ),
    'adminRecoverPaidCollectionCreation' : IDL.Func(
        [
          IDL.Principal,
          IDL.Nat64,
          IDL.Text,
          IDL.Text,
          IDL.Text,
          IDL.Text,
          IDL.Bool,
        ],
        [IDL.Variant({ 'ok' : CollectionCreationReceipt, 'err' : IDL.Text })],
        [],
      ),
    'adminReleaseDividendClaimLock' : IDL.Func(
        [CollectionId, IDL.Text],
        [IDL.Variant({ 'ok' : IDL.Bool, 'err' : IDL.Text })],
        [],
      ),
    'adminReleaseDividendDisbursementLock' : IDL.Func(
        [CollectionId],
        [IDL.Variant({ 'ok' : IDL.Bool, 'err' : IDL.Text })],
        [],
      ),
    'adminResetCollectionOwnershipIndex' : IDL.Func(
        [CollectionId],
        [IDL.Variant({ 'ok' : IDL.Bool, 'err' : IDL.Text })],
        [],
      ),
    'adminResetUnresolvedMintlabFeeAttempt' : IDL.Func(
        [ListingId],
        [MintlabFeeRecoveryQuote],
        [],
      ),
    'adminResolvePendingBid' : IDL.Func(
        [ListingId],
        [MarketplaceActionResult],
        [],
      ),
    'adminRetryAuctionSettlement' : IDL.Func(
        [ListingId],
        [MarketplaceActionResult],
        [],
      ),
    'adminRetryFixedPurchaseSettlement' : IDL.Func(
        [ListingId],
        [MarketplaceActionResult],
        [],
      ),
    'adminRetryListingReturn' : IDL.Func(
        [ListingId],
        [MarketplaceActionResult],
        [],
      ),
    'adminRetryNoBidAuctionReturn' : IDL.Func(
        [ListingId],
        [MarketplaceActionResult],
        [],
      ),
    'adminTopUpSettlementEscrow' : IDL.Func(
        [ListingId, IDL.Nat64],
        [SettlementEscrowTopUpReceipt],
        [],
      ),
    'adminVerifyCollection' : IDL.Func(
        [CollectionId],
        [IDL.Variant({ 'ok' : CollectionImportMeta, 'err' : IDL.Text })],
        [],
      ),
    'balance' : IDL.Func([EXTBalanceRequest], [EXTBalanceResponse], ['query']),
    'bootstrapAdmin' : IDL.Func([], [], []),
    'buyFixedListing' : IDL.Func(
        [ListingId],
        [MarketplaceActionResult],
        [],
      ),
    'cancelStalePendingBid' : IDL.Func(
        [ListingId],
        [MarketplaceActionResult],
        [],
      ),
    'cancelListing' : IDL.Func(
        [ListingId],
        [MarketplaceActionResult],
        [],
      ),
    'claimNFTDividend' : IDL.Func(
        [NFTId],
        [IDL.Variant({ 'ok' : DividendClaimReceipt, 'err' : IDL.Text })],
        [],
      ),
    'claimVaultDeposit' : IDL.Func(
        [CollectionId, IDL.Text],
        [IDL.Variant({ 'ok' : WalletNFT, 'err' : IDL.Text })],
        [],
      ),
    'configureMarketplaceFee' : IDL.Func(
        [IDL.Opt(AccountIdentifier), IDL.Nat],
        [MarketplaceFeeConfig],
        [],
      ),
    'configureMarketplaceFeeRecipient' : IDL.Func(
        [IDL.Opt(AccountIdentifier)],
        [MarketplaceFeeConfig],
        [],
      ),
    'configureMinting' : IDL.Func(
        [
          IDL.Text,
          IDL.Text,
          IDL.Text,
          IDL.Text,
          IDL.Opt(AccountIdentifier),
          IDL.Opt(AccountIdentifier),
          IDL.Nat,
          IDL.Nat,
          IDL.Nat64,
          IDL.Bool,
          IDL.Opt(AccountIdentifier),
          IDL.Nat64,
          IDL.Bool,
          IDL.Bool,
          IDL.Nat,
        ],
        [Collection],
        [],
      ),
    'configureModeration' : IDL.Func(
        [
          IDL.Bool,
          IDL.Opt(IDL.Text),
          IDL.Bool,
          IDL.Text,
          ModerationCategorySettings,
          IDL.Text,
        ],
        [PublicModerationConfig],
        [],
      ),
    'createAuctionListing' : IDL.Func(
        [NFTId, IDL.Nat64, IDL.Int],
        [AuctionListing],
        [],
      ),
    'createFixedListing' : IDL.Func([NFTId, IDL.Nat64], [FixedListing], []),
    'createUserCollection' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Text, IDL.Text, IDL.Bool],
        [IDL.Variant({ 'ok' : CollectionCreationReceipt, 'err' : IDL.Text })],
        [],
      ),
    'dip721_owner_token_identifiers' : IDL.Func(
        [IDL.Principal],
        [DIP721TokensResult],
        ['query'],
      ),
    'dip721_token_metadata' : IDL.Func(
        [IDL.Nat],
        [DIP721MetadataResult],
        ['query'],
      ),
    'disburseCollectionDividends' : IDL.Func(
        [CollectionId, IDL.Opt(IDL.Nat)],
        [IDL.Variant({ 'ok' : DividendDisbursementReceipt, 'err' : IDL.Text })],
        [],
      ),
    'ext_balance' : IDL.Func(
        [EXTBalanceRequest],
        [EXTBalanceResponse],
        ['query'],
      ),
    'ext_bearer' : IDL.Func(
        [EXTTokenIdentifier],
        [IDL.Variant({ 'ok' : EXTAccountIdentifier, 'err' : EXTCommonError })],
        ['query'],
      ),
    'ext_extensions' : IDL.Func([], [IDL.Vec(IDL.Text)], ['query']),
    'ext_metadata' : IDL.Func(
        [EXTTokenIdentifier],
        [EXTMetadataResult],
        ['query'],
      ),
    'ext_transfer' : IDL.Func([EXTTransferRequest], [EXTTransferResponse], []),
    'extdata_supply' : IDL.Func(
        [EXTTokenIdentifier],
        [IDL.Variant({ 'ok' : EXTBalance, 'err' : EXTCommonError })],
        ['query'],
      ),
    'extensions' : IDL.Func([], [IDL.Vec(IDL.Text)], ['query']),
    'getActiveListingDetails' : IDL.Func(
        [],
        [IDL.Vec(ActiveListingDetail)],
        ['query'],
      ),
    'getActiveListingDetailsPage' : IDL.Func(
        [IDL.Opt(IDL.Nat), IDL.Opt(IDL.Nat)],
        [ActiveListingDetailPage],
        ['query'],
      ),
    'getActiveListings' : IDL.Func([], [IDL.Vec(ActiveListing)], ['query']),
    'getActiveListingsPage' : IDL.Func(
        [IDL.Opt(IDL.Nat), IDL.Opt(IDL.Nat)],
        [ActiveListingPage],
        ['query'],
      ),
    'getAdminPrincipal' : IDL.Func([], [IDL.Opt(IDL.Principal)], ['query']),
    'getAllCollectionCreationRequests' : IDL.Func(
        [],
        [
          IDL.Variant({
            'ok' : IDL.Vec(CollectionCreationRequestView),
            'err' : IDL.Text,
          }),
        ],
        ['query'],
      ),
    'getAllCollectionCreationRequestsPage' : IDL.Func(
        [IDL.Opt(IDL.Nat), IDL.Opt(IDL.Nat)],
        [
          IDL.Variant({
            'ok' : CollectionCreationRequestPage,
            'err' : IDL.Text,
          }),
        ],
        ['query'],
      ),
    'getAppCanisterHealth' : IDL.Func(
        [IDL.Opt(IDL.Principal)],
        [IDL.Variant({ 'ok' : IDL.Vec(AppCanisterHealth), 'err' : IDL.Text })],
        [],
      ),
    'getCollection' : IDL.Func(
        [CollectionId],
        [IDL.Opt(Collection)],
        ['query'],
      ),
    'getCollectionImportMeta' : IDL.Func(
        [CollectionId],
        [IDL.Opt(CollectionImportMeta)],
        ['query'],
      ),
    'getCollectionBrowseStats' : IDL.Func(
        [CollectionId],
        [CollectionBrowseStats],
        [],
      ),
    'getCollectionCanisterControllers' : IDL.Func(
        [CollectionId],
        [
          IDL.Variant({
            'ok' : CollectionCanisterControllers,
            'err' : IDL.Text,
          }),
        ],
        [],
      ),
    'getCollectionCreationDiagnostics' : IDL.Func(
        [IDL.Nat],
        [
          IDL.Variant({
            'ok' : CollectionCreationDiagnostics,
            'err' : IDL.Text,
          }),
        ],
        ['query'],
      ),
    'getCollectionCreator' : IDL.Func(
        [CollectionId],
        [IDL.Opt(IDL.Principal)],
        ['query'],
      ),
    'getCollectionDividendAccountId' : IDL.Func(
        [CollectionId],
        [AccountIdentifier],
        ['query'],
      ),
    'getCollectionDividendBalances' : IDL.Func(
        [CollectionId],
        [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Nat64))],
        ['query'],
      ),
    'getCollectionDividendBalancesPage' : IDL.Func(
        [CollectionId, IDL.Opt(IDL.Nat), IDL.Opt(IDL.Nat)],
        [DividendBalancePage],
        ['query'],
      ),
    'getCollectionDividendInfo' : IDL.Func(
        [CollectionId],
        [IDL.Opt(CollectionDividendInfo)],
        [],
      ),
    'getCollectionIndexStatus' : IDL.Func(
        [CollectionId],
        [IDL.Opt(CollectionIndexStatus)],
        ['query'],
      ),
    'getCollectionNFT' : IDL.Func(
        [CollectionId, IDL.Text],
        [IDL.Opt(WalletNFT)],
        ['query'],
      ),
    'getCollectionNFTPage' : IDL.Func(
        [CollectionId, IDL.Opt(IDL.Text), IDL.Opt(IDL.Nat)],
        [CollectionNFTPage],
        [],
      ),
    'getCollectionNFTs' : IDL.Func([CollectionId], [IDL.Vec(WalletNFT)], []),
    'getMarketplaceFeeConfig' : IDL.Func([], [MarketplaceFeeConfig], []),
    'getMintConfig' : IDL.Func([], [MintConfig], ['query']),
    'getModerationConfig' : IDL.Func([], [PublicModerationConfig], ['query']),
    'getMyAuctionBidStatuses' : IDL.Func(
        [IDL.Vec(ListingId)],
        [IDL.Vec(AuctionBidStatus)],
        ['query'],
      ),
    'getMyCollectionCanisterStatuses' : IDL.Func(
        [],
        [IDL.Vec(CollectionCanisterStatus)],
        [],
      ),
    'getMyCollectionCreationRequests' : IDL.Func(
        [],
        [IDL.Vec(CollectionCreationRequestView)],
        ['query'],
      ),
    'getMyCollectionCreationRequestsPage' : IDL.Func(
        [IDL.Opt(IDL.Nat), IDL.Opt(IDL.Nat)],
        [CollectionCreationRequestPage],
        ['query'],
      ),
    'getMyCreatedCollections' : IDL.Func([], [IDL.Vec(Collection)], []),
    'getMyDividendNFTs' : IDL.Func([], [IDL.Vec(NFTDividend)], []),
    'getMyDividendNFTsPage' : IDL.Func(
        [IDL.Opt(IDL.Nat), IDL.Opt(IDL.Nat)],
        [NFTDividendPage],
        [],
      ),
    'getMyMarketplaceSettlementStatuses' : IDL.Func(
        [],
        [IDL.Vec(SettlementStatus)],
        ['query'],
      ),
    'getMyMarketplaceSettlementStatusesPage' : IDL.Func(
        [IDL.Opt(IDL.Nat), IDL.Opt(IDL.Nat)],
        [SettlementStatusPage],
        ['query'],
      ),
    'getMyPendingAuctionRefunds' : IDL.Func(
        [],
        [IDL.Vec(AuctionEscrow)],
        ['query'],
      ),
    'getMyPendingMintPayments' : IDL.Func(
        [],
        [IDL.Vec(PendingMintPaymentView)],
        ['query'],
      ),
    'getNFTStats' : IDL.Func([IDL.Principal], [NFTStats], ['query']),
    'getRegistry' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(EXTTokenIndex, EXTAccountIdentifier))],
        ['query'],
      ),
    'getTokens' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(EXTTokenIndex, EXTMetadataLegacy))],
        ['query'],
      ),
    'getUserAccountId' : IDL.Func([], [AccountIdentifier], ['query']),
    'getUserICPBalance' : IDL.Func([], [IDL.Nat64], []),
    'getMyRecentTransactions' : IDL.Func(
        [IDL.Opt(IDL.Nat)],
        [IDL.Vec(RecentTransaction)],
        ['query'],
      ),
    'getUserNFTs' : IDL.Func([IDL.Principal], [IDL.Vec(WalletNFT)], ['query']),
    'getUserNFTsPage' : IDL.Func(
        [IDL.Principal, IDL.Opt(IDL.Nat), IDL.Opt(IDL.Nat)],
        [WalletNFTPage],
        ['query'],
      ),
    'getVaultAccountId' : IDL.Func([], [AccountIdentifier], ['query']),
    'getVaultPrincipal' : IDL.Func([], [IDL.Principal], ['query']),
    'http_request' : IDL.Func(
        [AssetHttpRequest],
        [AssetHttpResponse],
        ['query'],
      ),
    'http_request_update' : IDL.Func(
        [AssetHttpRequest],
        [AssetHttpResponse],
        [],
      ),
    'icrc10_supported_standards' : IDL.Func(
        [],
        [IDL.Vec(SupportedStandard)],
        ['query'],
      ),
    'icrc7_atomic_batch_transfers' : IDL.Func(
        [],
        [IDL.Opt(IDL.Bool)],
        ['query'],
      ),
    'icrc7_balance_of' : IDL.Func(
        [IDL.Vec(ICRC7Account)],
        [IDL.Vec(IDL.Nat)],
        ['query'],
      ),
    'icrc7_collection_metadata' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Text, ICRC7Value))],
        ['query'],
      ),
    'icrc7_default_take_value' : IDL.Func([], [IDL.Opt(IDL.Nat)], ['query']),
    'icrc7_description' : IDL.Func([], [IDL.Opt(IDL.Text)], ['query']),
    'icrc7_logo' : IDL.Func([], [IDL.Opt(IDL.Text)], ['query']),
    'icrc7_max_memo_size' : IDL.Func([], [IDL.Opt(IDL.Nat)], ['query']),
    'icrc7_max_query_batch_size' : IDL.Func([], [IDL.Opt(IDL.Nat)], ['query']),
    'icrc7_max_take_value' : IDL.Func([], [IDL.Opt(IDL.Nat)], ['query']),
    'icrc7_max_update_batch_size' : IDL.Func([], [IDL.Opt(IDL.Nat)], ['query']),
    'icrc7_name' : IDL.Func([], [IDL.Text], ['query']),
    'icrc7_owner_of' : IDL.Func(
        [IDL.Vec(IDL.Nat)],
        [IDL.Vec(IDL.Opt(ICRC7Account))],
        ['query'],
      ),
    'icrc7_permitted_drift' : IDL.Func([], [IDL.Opt(IDL.Nat)], ['query']),
    'icrc7_supply_cap' : IDL.Func([], [IDL.Opt(IDL.Nat)], ['query']),
    'icrc7_symbol' : IDL.Func([], [IDL.Text], ['query']),
    'icrc7_token_metadata' : IDL.Func(
        [IDL.Vec(IDL.Nat)],
        [IDL.Vec(IDL.Opt(ICRC7TokenMetadata))],
        ['query'],
      ),
    'icrc7_tokens' : IDL.Func(
        [IDL.Opt(IDL.Nat), IDL.Opt(IDL.Nat)],
        [IDL.Vec(IDL.Nat)],
        ['query'],
      ),
    'icrc7_tokens_of' : IDL.Func(
        [ICRC7Account, IDL.Opt(IDL.Nat), IDL.Opt(IDL.Nat)],
        [IDL.Vec(IDL.Nat)],
        ['query'],
      ),
    'icrc7_total_supply' : IDL.Func([], [IDL.Nat], ['query']),
    'icrc7_transfer' : IDL.Func(
        [IDL.Vec(ICRC7TransferArg)],
        [IDL.Vec(IDL.Opt(ICRC7TransferResult))],
        [],
      ),
    'icrc7_tx_window' : IDL.Func([], [IDL.Opt(IDL.Nat)], ['query']),
    'indexCollectionOwnershipPage' : IDL.Func(
        [CollectionId, IDL.Opt(IDL.Text), IDL.Nat],
        [IDL.Variant({ 'ok' : CollectionIndexPageResult, 'err' : IDL.Text })],
        [],
      ),
    'isAdmin' : IDL.Func([], [IDL.Bool], ['query']),
    'isNFTInUserWallet' : IDL.Func(
        [CollectionId, IDL.Text, UserId],
        [IDL.Bool],
        ['query'],
      ),
    'listCollectionImportMetasPage' : IDL.Func(
        [IDL.Opt(IDL.Nat), IDL.Opt(IDL.Nat)],
        [CollectionImportMetaPage],
        ['query'],
      ),
    'listCollections' : IDL.Func([], [IDL.Vec(Collection)], ['query']),
    'listCollectionsPage' : IDL.Func(
        [IDL.Opt(IDL.Nat), IDL.Opt(IDL.Nat)],
        [CollectionPage],
        ['query'],
      ),
    'lookupCollectionNFT' : IDL.Func(
        [CollectionId, IDL.Text],
        [IDL.Variant({ 'ok' : IDL.Opt(WalletNFT), 'err' : IDL.Text })],
        [],
      ),
    'mintCollectionNFT' : IDL.Func(
        [CollectionId, NFTMetadata],
        [IDL.Variant({ 'ok' : WalletNFT, 'err' : IDL.Text })],
        [],
      ),
    'mintUserNFT' : IDL.Func(
        [NFTMetadata],
        [IDL.Variant({ 'ok' : MintReceipt, 'err' : IDL.Text })],
        [],
      ),
    'placeBid' : IDL.Func([ListingId, IDL.Nat64], [MarketplaceBidResult], []),
    'prepareVaultDeposit' : IDL.Func(
        [CollectionId, IDL.Text],
        [IDL.Variant({ 'ok' : IDL.Text, 'err' : IDL.Text })],
        [],
      ),
    'previewCollectionDividendDisbursement' : IDL.Func(
        [CollectionId],
        [IDL.Variant({ 'ok' : DividendDisbursementPreview, 'err' : IDL.Text })],
        [],
      ),
    'previewMyCollectionNFTs' : IDL.Func(
        [CollectionId],
        [IDL.Variant({ 'ok' : IDL.Vec(WalletNFT), 'err' : IDL.Text })],
        [],
      ),
    'quoteAppCanisterCycleTopUp' : IDL.Func(
        [IDL.Nat],
        [CollectionCycleTopUpQuote],
        [],
      ),
    'quoteCollectionCreationCost' : IDL.Func(
        [IDL.Nat, IDL.Nat64, IDL.Nat, IDL.Nat],
        [CollectionCreationQuote],
        [],
      ),
    'quoteCollectionCycleTopUp' : IDL.Func(
        [IDL.Nat],
        [CollectionCycleTopUpQuote],
        [],
      ),
    'recoverCollectionCreationRecord' : IDL.Func(
        [IDL.Nat],
        [
          IDL.Variant({
            'ok' : CollectionCreationRequestView,
            'err' : IDL.Text,
          }),
        ],
        [],
      ),
    'refreshCollectionDividendBalances' : IDL.Func(
        [CollectionId],
        [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Nat64))],
        [],
      ),
    'refreshCollectionDividendBalancesPage' : IDL.Func(
        [CollectionId, IDL.Opt(IDL.Nat), IDL.Opt(IDL.Nat)],
        [DividendBalancePage],
        [],
      ),
    'refreshMyDividendNFTs' : IDL.Func([], [IDL.Vec(NFTDividend)], []),
    'refreshMyDividendNFTsPage' : IDL.Func(
        [IDL.Opt(IDL.Nat), IDL.Opt(IDL.Nat)],
        [NFTDividendPage],
        [],
      ),
    'registerNFT' : IDL.Func(
        [CollectionId, IDL.Text, NFTMetadata],
        [IDL.Variant({ 'ok' : WalletNFT, 'err' : IDL.Text })],
        [],
      ),
    'removeCollection' : IDL.Func([CollectionId], [IDL.Bool], []),
    'removeCollectionCanisterController' : IDL.Func(
        [CollectionId, IDL.Principal],
        [
          IDL.Variant({
            'ok' : CollectionCanisterControllers,
            'err' : IDL.Text,
          }),
        ],
        [],
      ),
    'repairCollectionCreationRequest' : IDL.Func(
        [IDL.Nat],
        [
          IDL.Variant({
            'ok' : CollectionCreationRequestView,
            'err' : IDL.Text,
          }),
        ],
        [],
      ),
    'retryAuctionRefund' : IDL.Func(
        [IDL.Nat],
        [MarketplaceActionResult],
        [],
      ),
    'retryCollectionCreationRequest' : IDL.Func(
        [IDL.Nat],
        [IDL.Variant({ 'ok' : CollectionCreationReceipt, 'err' : IDL.Text })],
        [],
      ),
    'retryInstallCollectionCanister' : IDL.Func(
        [CollectionId],
        [IDL.Variant({ 'ok' : Collection, 'err' : IDL.Text })],
        [],
      ),
    'retryPendingBid' : IDL.Func([ListingId], [MarketplaceBidResult], []),
    'retryPendingMintPayment' : IDL.Func(
        [IDL.Nat],
        [IDL.Variant({ 'ok' : MintReceipt, 'err' : IDL.Text })],
        [],
      ),
    'sendNFT' : IDL.Func(
        [NFTId, IDL.Principal],
        [IDL.Variant({ 'ok' : IDL.Text, 'err' : IDL.Text })],
        [],
      ),
    'reportCollection' : IDL.Func(
        [CollectionId, IDL.Text],
        [IDL.Variant({ 'ok' : CollectionImportMeta, 'err' : IDL.Text })],
        [],
      ),
    'setCollectionCanisterWasm' : IDL.Func([IDL.Vec(IDL.Nat8)], [], []),
    'settleAuction' : IDL.Func(
        [ListingId],
        [MarketplaceActionResult],
        [],
      ),
    'supply' : IDL.Func(
        [EXTTokenIdentifier],
        [IDL.Variant({ 'ok' : EXTBalance, 'err' : EXTCommonError })],
        ['query'],
      ),
    'syncCollectionDividends' : IDL.Func(
        [CollectionId],
        [IDL.Variant({ 'ok' : DividendSyncReceipt, 'err' : IDL.Text })],
        [],
      ),
    'syncExternalNFTOwner' : IDL.Func(
        [CollectionId, IDL.Text, IDL.Principal],
        [IDL.Variant({ 'ok' : WalletNFT, 'err' : IDL.Text })],
        [],
      ),
    'syncUserNFTs' : IDL.Func(
        [],
        [
          IDL.Variant({
            'ok' : IDL.Record({
              'errors' : IDL.Vec(IDL.Text),
              'newCount' : IDL.Nat,
            }),
            'err' : IDL.Text,
          }),
        ],
        [],
      ),
    'syncUserNFTsPage' : IDL.Func(
        [IDL.Opt(IDL.Nat), IDL.Nat],
        [IDL.Variant({ 'ok' : WalletSyncPageResult, 'err' : IDL.Text })],
        [],
      ),
    'syncUserNFTsForCollection' : IDL.Func(
        [CollectionId, IDL.Nat],
        [IDL.Variant({ 'ok' : WalletSyncPageResult, 'err' : IDL.Text })],
        [],
      ),
    'syncUserNFTsForCollectionV2' : IDL.Func(
        [CollectionId, IDL.Vec(IDL.Text), IDL.Nat],
        [
          IDL.Variant({
            'ok' : WalletCollectionSyncProgress,
            'err' : IDL.Text,
          }),
        ],
        [],
      ),
    'syncUserNFTsV2' : IDL.Func(
        [],
        [IDL.Variant({ 'ok' : WalletSyncV2Result, 'err' : IDL.Text })],
        [],
      ),
    'tokens_ext' : IDL.Func(
        [EXTAccountIdentifier],
        [EXTTokensExtResult],
        ['query'],
      ),
    'topUpAppCanisterCycles' : IDL.Func(
        [IDL.Nat],
        [IDL.Variant({ 'ok' : AppCycleTopUpReceipt, 'err' : IDL.Text })],
        [],
      ),
    'topUpCanisterCycles' : IDL.Func(
        [IDL.Principal, IDL.Nat],
        [IDL.Variant({ 'ok' : AppCycleTopUpReceipt, 'err' : IDL.Text })],
        [],
      ),
    'topUpCollectionCanisterCycles' : IDL.Func(
        [CollectionId, IDL.Nat],
        [IDL.Variant({ 'ok' : CollectionCycleTopUpReceipt, 'err' : IDL.Text })],
        [],
      ),
    'transfer' : IDL.Func([IDL.Principal, IDL.Nat], [DIP721NatResult], []),
    'transferFromDip721' : IDL.Func(
        [IDL.Principal, IDL.Principal, IDL.Nat],
        [DIP721NatResult],
        [],
      ),
    'transferICPOut' : IDL.Func(
        [AccountIdentifier, IDL.Nat64],
        [TransferResult],
        [],
      ),
    'transferICPOutWithClientNonce' : IDL.Func(
        [AccountIdentifier, IDL.Nat64, IDL.Nat64],
        [TransferResult],
        [],
      ),
    'transformModerationResponse' : IDL.Func(
        [
          IDL.Record({
            'context' : IDL.Vec(IDL.Nat8),
            'response' : HttpRequestResult,
          }),
        ],
        [HttpRequestResult],
        ['query'],
      ),
    'updateCollectionBrowseInfo' : IDL.Func(
        [CollectionId, IDL.Opt(CollectionBrowseInfo)],
        [IDL.Variant({ 'ok' : Collection, 'err' : IDL.Text })],
        [],
      ),
    'upgradeCollectionCanister' : IDL.Func(
        [CollectionId],
        [IDL.Variant({ 'ok' : Collection, 'err' : IDL.Text })],
        [],
      ),
  });
};
export const init = ({ IDL }) => { return []; };

export const idlService = idlFactory({ IDL });
