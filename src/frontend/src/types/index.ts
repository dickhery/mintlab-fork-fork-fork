// Re-export all backend types for use across the frontend
export type {
  Tokens,
  FixedListing,
  WalletNFT,
  NFTStandard,
  AuctionListing,
  AuctionBidStatus,
  AuctionEscrow,
  ActiveListing,
  ActiveListingDetail,
  MarketplaceFeeConfig,
  SettlementEscrowRepairKind,
  SettlementEscrowRepairQuote,
  SettlementEscrowTopUpReceipt,
  MintlabFeeRecoveryQuote,
  UserId,
  ListingId,
  Collection,
  CollectionDividendConfig,
  CollectionDividendInfo,
  CollectionBrowseCoverage,
  CollectionBrowseInfo,
  CollectionBrowseStats,
  TransferResult,
  AccountIdentifier,
  CollectionNFTPage,
  CollectionNFTLookupResult,
  CollectionIndexStatus,
  CollectionIndexPageResult,
  WalletSyncSkip,
  WalletSyncV2Result,
  NFTStats,
  NFTMetadata,
  MintConfig,
  ModerationCategorySettings,
  PublicModerationConfig,
  CollectionCreationQuote,
  CollectionCreationStatus,
  CollectionCreationRequestView,
  CollectionCreationDiagnostics,
  CollectionCanisterStatus,
  CollectionCanisterControllers,
  CollectionCycleTopUpQuote,
  AppCanisterHealth,
  AppCanisterKind,
  MintReceipt,
  CollectionCreationReceipt,
  CollectionCycleTopUpReceipt,
  AppCycleTopUpReceipt,
  DividendClaimReceipt,
  DividendDisbursementPreview,
  DividendDisbursementReceipt,
  DividendSyncReceipt,
  NFTDividend,
  CollectionKind,
  WalletLocation,
  CollectionId,
  TransferError,
  NFTId,
  backendInterface,
} from "../backend-client";

export { ListingStatus } from "../backend-client";

export type { Principal } from "@icp-sdk/core/principal";

export interface NavItem {
  label: string;
  href: string;
}

export type ViewMode = "grid" | "list";
