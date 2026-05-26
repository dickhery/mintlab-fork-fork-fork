import {
  Actor,
  type ActorConfig,
  type ActorSubclass,
  type Agent,
  HttpAgent,
  type HttpAgentOptions,
} from "@icp-sdk/core/agent";
import type { Principal } from "@icp-sdk/core/principal";
import { idlFactory } from "./backend-idl";

export interface Tokens {
  e8s: bigint;
}

export type AccountIdentifier = Uint8Array;
export type CollectionId = bigint;
export type ListingId = bigint;
export type NFTId = bigint;
export type Timestamp = bigint;
export type UserId = Principal;

export type NFTStandard =
  | { __kind__: "EXT"; EXT: null }
  | { __kind__: "DIP721"; DIP721: null }
  | { __kind__: "ICRC7"; ICRC7: null }
  | { __kind__: "Other"; Other: string };

export type CollectionKind = "External" | "Minted";

export type CollectionBrowseCoverage = "Full" | "Partial";

export type WalletLocation = "Minted" | "Registered" | "Vaulted";

export interface NFTMetadata {
  name?: string;
  description?: string;
  imageUrl?: string;
  attributes: Array<[string, string]>;
}

export interface WalletNFT {
  id: NFTId;
  tokenId: string;
  collectionId: CollectionId;
  owner: UserId;
  metadata: NFTMetadata;
  location: WalletLocation;
  registeredAt: Timestamp;
}

export interface NFTStats {
  totalCount: bigint;
  perCollection: Array<[CollectionId, bigint]>;
}

export interface CollectionBrowseInfo {
  totalSupply: bigint | null;
  tokenIndexOffset: bigint | null;
}

export interface CollectionDividendConfig {
  enabled: boolean;
}

export interface Collection {
  id: CollectionId;
  name: string;
  description: string;
  imageUrl: string;
  standard: NFTStandard;
  symbol: string;
  canisterId: Principal;
  kind: CollectionKind;
  browseInfo?: CollectionBrowseInfo;
  dividendConfig?: CollectionDividendConfig;
}

export interface CollectionBrowseStats {
  collectionId: CollectionId;
  totalCount: bigint;
  visibleCount: bigint;
  coverage: CollectionBrowseCoverage;
  note: string;
}

export interface CollectionNFTPage {
  nfts: Array<WalletNFT>;
  nextCursor?: string;
  totalCount: bigint;
  coverage: CollectionBrowseCoverage;
  note: string;
}

export interface WalletNFTPage {
  nfts: Array<WalletNFT>;
  nextCursor: bigint | null;
  totalCount: bigint;
}

export interface CollectionPage {
  collections: Array<Collection>;
  nextCursor: bigint | null;
  totalCount: bigint;
}

export interface WalletSyncSkip {
  collectionId: CollectionId;
  collectionName: string;
  reason: string;
  message: string;
}

export interface WalletSyncV2Result {
  errors: Array<string>;
  newCount: bigint;
  skipped: Array<WalletSyncSkip>;
}

export interface WalletSyncPageResult extends WalletSyncV2Result {
  nextCursor: bigint | null;
  complete: boolean;
  checkedCollections: bigint;
}

export interface CollectionIndexStatus {
  collectionId: CollectionId;
  cursor: string | null;
  scanned: bigint;
  indexed: bigint;
  complete: boolean;
  lastError: string | null;
  updatedAt: Timestamp;
}

export interface CollectionIndexPageResult {
  collectionId: CollectionId;
  scanned: bigint;
  indexed: bigint;
  nextCursor: string | null;
  complete: boolean;
  error: string | null;
}

export type CollectionNFTLookupResult =
  | { __kind__: "ok"; ok: WalletNFT | null }
  | { __kind__: "err"; err: string };

export interface FixedListing {
  id: ListingId;
  status: ListingStatus;
  createdAt: Timestamp;
  seller: UserId;
  nftId: NFTId;
  price: bigint;
}

export interface AuctionListing {
  id: ListingId;
  status: ListingStatus;
  highestBidder?: UserId;
  endTime: Timestamp;
  createdAt: Timestamp;
  seller: UserId;
  highestBid: bigint;
  nftId: NFTId;
  startingBid: bigint;
}

export interface AuctionBidStatus {
  listingId: ListingId;
  hasBid: boolean;
  isWinning: boolean;
  highestBidder?: UserId;
  highestBid: bigint;
  myHighestBid?: bigint;
}

export type ActiveListing =
  | { __kind__: "Fixed"; Fixed: FixedListing }
  | { __kind__: "Auction"; Auction: AuctionListing };

export interface ActiveListingDetail {
  listing: ActiveListing;
  nft: WalletNFT;
}

export interface ActiveListingPage {
  listings: Array<ActiveListing>;
  nextCursor: bigint | null;
  totalCount: bigint;
}

export interface ActiveListingDetailPage {
  details: Array<ActiveListingDetail>;
  nextCursor: bigint | null;
  totalCount: bigint;
}

export type SettlementStatusKind =
  | "FixedPurchase"
  | "Auction"
  | "NoBidAuctionReturn"
  | "ListingReturn"
  | "PendingBidDeposit"
  | "PendingAuctionRefund";

export type SettlementStatusRole = "Buyer" | "Seller" | "Bidder";

export interface SettlementStatus {
  listingId: ListingId;
  kind: SettlementStatusKind;
  role: SettlementStatusRole;
  stage: string;
  message: string;
  updatedAt: Timestamp;
}

export interface AuctionEscrow {
  amount: bigint;
  bidder: UserId;
  createdAt: Timestamp;
  depositedBlock: bigint;
  escrowId: bigint;
  feeReserve: bigint;
  ledgerFeeE8s: bigint;
  listingId: ListingId;
}

export interface MarketplaceFeeConfig {
  auctionBidFeeReserveE8s: bigint;
  ledgerFeeE8s: bigint;
  mintlabFeeBasisPoints: bigint;
  mintlabFeeRecipient: AccountIdentifier | null;
}

export type SettlementEscrowRepairKind = "FixedPurchase" | "Auction";

export interface SettlementEscrowRepairQuote {
  listingId: ListingId;
  kind: SettlementEscrowRepairKind;
  escrowId: bigint;
  escrowAccount: AccountIdentifier;
  escrowBalance: bigint;
  requiredDebit: bigint;
  shortfall: bigint;
  ledgerFeeE8s: bigint;
  sellerProceeds: bigint;
  mintlabFee: bigint;
  topUpFromAccount: AccountIdentifier;
  topUpFromBalance: bigint;
  topUpTransferFeeE8s: bigint;
  topUpTotalDebit: bigint;
}

export interface SettlementEscrowTopUpReceipt {
  listingId: ListingId;
  amount: bigint;
  feeE8s: bigint;
  blockIndex: bigint;
  quoteBefore: SettlementEscrowRepairQuote;
}

export interface MintlabFeeRecoveryQuote {
  listingId: ListingId;
  kind: SettlementEscrowRepairKind;
  escrowId: bigint;
  escrowAccount: AccountIdentifier;
  escrowBalance: bigint;
  expectedBeforeMintlabFeeDebit: bigint;
  expectedAfterMintlabFeeDebit: bigint;
  shortfallBeforeMintlabFee: bigint;
  sellerProceeds: bigint;
  mintlabFee: bigint;
  ledgerFeeE8s: bigint;
  feeRecipient: AccountIdentifier;
  previousMintlabFeeCreatedAt: bigint;
}

export enum ListingStatus {
  Sold = "Sold",
  Active = "Active",
  Cancelled = "Cancelled",
  Settled = "Settled",
}

export interface MintConfig {
  collectionId: CollectionId | null;
  payoutAccount: AccountIdentifier | null;
  mintPriceE8s: bigint;
  mintEnabled: boolean;
  collectionCreationPayoutAccount: AccountIdentifier | null;
  collectionCreationSecondaryPayoutAccount: AccountIdentifier | null;
  collectionCreationPrimaryPayoutBasisPoints: bigint;
  collectionCreationSecondaryPayoutBasisPoints: bigint;
  collectionCreationPriceE8s: bigint;
  collectionCreationEnabled: boolean;
  mainMintPayoutAccount: AccountIdentifier | null;
  mainMintPriceE8s: bigint;
  mainMintEnabled: boolean;
  collectionCanisterWasmUploaded: boolean;
  collectionCanisterCycles: bigint;
}

export interface ModerationCategorySettings {
  nudityOrSexual: boolean;
  graphicViolence: boolean;
  explicitLanguage: boolean;
  hateOrHarassment: boolean;
  hateSymbols: boolean;
  illegalOrDangerous: boolean;
  selfHarm: boolean;
  otherNsfw: boolean;
}

export interface PublicModerationConfig {
  enabled: boolean;
  apiKeyConfigured: boolean;
  model: string;
  categories: ModerationCategorySettings;
  userMessage: string;
}

export interface CollectionCreationQuote {
  collectionCanisterCycles: bigint;
  factoryReserveCycles: bigint;
  totalCyclesToConvert: bigint;
  cycleCostE8s: bigint;
  minimumCreationPriceE8s: bigint;
  collectionCreationPriceE8s: bigint;
  adminPayoutE8s: bigint;
  adminPrimaryPayoutE8s: bigint;
  adminSecondaryPayoutE8s: bigint;
  ledgerFeeE8s: bigint;
  cycleTransferFeeE8s: bigint;
  adminPayoutFeeE8s: bigint;
  totalUserDebitE8s: bigint;
  xdrPermyriadPerIcp: bigint;
  rateTimestampSeconds: bigint;
}

export type CollectionCreationStatus =
  | "Started"
  | "CyclePaymentSent"
  | "CyclesConverted"
  | "AdminPayoutPending"
  | "AdminPayoutSent"
  | "CanisterCreated"
  | "CollectionRegistered"
  | "Installed"
  | "Failed";

export interface CollectionCreationRequestView {
  id: bigint;
  name: string;
  symbol: string;
  status: CollectionCreationStatus;
  cyclePaymentBlock: bigint | null;
  childCanisterId: Principal | null;
  collectionId: CollectionId | null;
  lastError: string | null;
  createdAt: bigint;
  updatedAt: bigint;
}

export interface CollectionCreationRequestPage {
  requests: Array<CollectionCreationRequestView>;
  nextCursor: bigint | null;
  totalCount: bigint;
}

export interface CollectionCreationDiagnostics {
  request: CollectionCreationRequestView;
  requestedCanisterCycles: bigint;
  totalCyclesToConvert: bigint;
  childTargetCycles: bigint;
  createCallCycles: bigint;
  canisterCreationFeeCycles: bigint;
  backendCycles: bigint;
  requiredBackendCycles: bigint;
  canCreateNow: boolean;
  buildVersion: string;
}

export interface CollectionCanisterStatus {
  collectionId: CollectionId;
  canisterId: Principal;
  appCanisterId: Principal;
  controllers: Array<Principal>;
  cycles: bigint;
  moduleInstalled: boolean;
  freezingThresholdSeconds: bigint;
  idleCyclesBurnedPerDay: bigint;
}

export interface CollectionCanisterControllers {
  collectionId: CollectionId;
  canisterId: Principal;
  appCanisterId: Principal;
  controllers: Array<Principal>;
}

export interface CollectionCycleTopUpQuote {
  cyclesToTopUp: bigint;
  cycleCostE8s: bigint;
  ledgerFeeE8s: bigint;
  totalUserDebitE8s: bigint;
  xdrPermyriadPerIcp: bigint;
  rateTimestampSeconds: bigint;
}

export type AppCanisterKind = "Backend" | "Frontend";

export interface AppCanisterHealth {
  kind: AppCanisterKind;
  canisterId: Principal;
  cycles: bigint | null;
  moduleInstalled: boolean | null;
  freezingThresholdSeconds: bigint | null;
  idleCyclesBurnedPerDay: bigint | null;
  error: string | null;
}

export interface MintReceipt {
  nft: WalletNFT;
  paymentBlock: bigint;
}

export type PendingMintPaymentStatus =
  | "PaymentPending"
  | "PaymentSent"
  | "Minted"
  | "Failed";

export interface PendingMintPaymentView {
  id: bigint;
  collectionId: CollectionId;
  amountE8s: bigint;
  paymentBlock: bigint | null;
  mintedTokenId: bigint | null;
  status: PendingMintPaymentStatus;
  createdAt: bigint;
  updatedAt: bigint;
  lastError: string | null;
}

export interface CollectionCreationReceipt {
  collection: Collection;
  paymentBlock: bigint;
}

export interface CollectionCycleTopUpReceipt {
  collectionId: CollectionId;
  canisterId: Principal;
  cyclesRequested: bigint;
  cyclesMinted: bigint;
  cycleCostE8s: bigint;
  totalUserDebitE8s: bigint;
  paymentBlock: bigint;
  cycleBalance: bigint | null;
}

export interface AppCycleTopUpReceipt {
  canisterId: Principal;
  cyclesRequested: bigint;
  cyclesMinted: bigint;
  cycleCostE8s: bigint;
  totalUserDebitE8s: bigint;
  paymentBlock: bigint;
  cycleBalance: bigint | null;
}

export interface CollectionDividendInfo {
  collectionId: CollectionId;
  enabled: boolean;
  accountId: AccountIdentifier;
  balanceE8s: bigint;
  distributableBalanceE8s: bigint;
  feeReserveE8s: bigint;
  processedBalanceE8s: bigint;
  pendingE8s: bigint;
  nftCount: bigint;
}

export interface NFTDividend {
  nft: WalletNFT;
  collection: Collection;
  claimableE8s: bigint;
}

export interface NFTDividendPage {
  dividends: Array<NFTDividend>;
  nextCursor: bigint | null;
  totalCount: bigint;
}

export interface DividendBalancePage {
  balances: Array<[string, bigint]>;
  nextCursor: bigint | null;
  totalCount: bigint;
}

export interface DividendSyncReceipt {
  collectionId: CollectionId;
  depositedE8s: bigint;
  distributedE8s: bigint;
  shareE8s: bigint;
  remainderE8s: bigint;
  nftCount: bigint;
  balanceE8s: bigint;
}

export interface DividendClaimReceipt {
  nft: WalletNFT;
  collection: Collection;
  paidE8s: bigint;
  feeE8s: bigint;
  blockIndex: bigint;
}

export interface DividendDisbursementPreview {
  collectionId: CollectionId;
  accountId: AccountIdentifier;
  balanceE8s: bigint;
  distributableBalanceE8s: bigint;
  processedBalanceE8s: bigint;
  pendingE8s: bigint;
  projectedPendingE8s: bigint;
  undistributedE8s: bigint;
  shareE8s: bigint;
  remainderE8s: bigint;
  nftCount: bigint;
  transferCount: bigint;
  ledgerFeeE8s: bigint;
  requiredNetworkFeeE8s: bigint;
  feeReserveE8s: bigint;
  feeShortfallE8s: bigint;
  callerBalanceE8s: bigint;
  callerFundingTransferFeeE8s: bigint;
  callerTotalDebitE8s: bigint;
  maxTransfersPerCall: bigint;
}

export interface DividendDisbursementReceipt {
  collectionId: CollectionId;
  synced: DividendSyncReceipt;
  paidCount: bigint;
  skippedCount: bigint;
  remainingCount: bigint;
  totalPaidE8s: bigint;
  totalFeeE8s: bigint;
  feeTopUpE8s: bigint;
  feeTopUpBlockIndex: bigint | null;
  feeReserveRemainingE8s: bigint;
  failures: Array<string>;
}

export type TransferError =
  | {
      __kind__: "TxTooOld";
      TxTooOld: { allowed_window_nanos: bigint };
    }
  | {
      __kind__: "BadFee";
      BadFee: { expected_fee: Tokens };
    }
  | {
      __kind__: "TxDuplicate";
      TxDuplicate: { duplicate_of: bigint };
    }
  | {
      __kind__: "TxCreatedInFuture";
      TxCreatedInFuture: null;
    }
  | {
      __kind__: "InsufficientFunds";
      InsufficientFunds: { balance: Tokens };
    };

export type TransferResult =
  | {
      __kind__: "Ok";
      Ok: bigint;
    }
  | {
      __kind__: "Err";
      Err: TransferError;
    };

export class ExternalBlob {
  _blob?: Uint8Array<ArrayBuffer> | null;
  directURL: string;
  onProgress?: (percentage: number) => void = undefined;

  private constructor(directURL: string, blob: Uint8Array<ArrayBuffer> | null) {
    if (blob) {
      this._blob = blob;
    }
    this.directURL = directURL;
  }

  static fromURL(url: string): ExternalBlob {
    return new ExternalBlob(url, null);
  }

  static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob {
    const url = URL.createObjectURL(
      new Blob([new Uint8Array(blob)], {
        type: "application/octet-stream",
      }),
    );
    return new ExternalBlob(url, blob);
  }

  async getBytes(): Promise<Uint8Array<ArrayBuffer>> {
    if (this._blob) {
      return this._blob;
    }
    const response = await fetch(this.directURL);
    const blob = await response.blob();
    this._blob = new Uint8Array(await blob.arrayBuffer());
    return this._blob;
  }

  getDirectURL(): string {
    return this.directURL;
  }

  withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob {
    this.onProgress = onProgress;
    return this;
  }
}

export interface CreateActorOptions {
  agent?: Agent;
  agentOptions?: HttpAgentOptions;
  actorOptions?: ActorConfig;
  processError?: (error: unknown) => never;
}

export interface backendInterface {
  getAgent(): Agent;
  addCollection(
    name: string,
    description: string,
    canisterId: Principal,
    standard: NFTStandard,
    imageUrl: string,
    symbol: string,
    browseInfo: CollectionBrowseInfo | null,
  ): Promise<Collection>;
  bootstrapAdmin(): Promise<void>;
  buyFixedListing(listingId: ListingId): Promise<void>;
  cancelListing(listingId: ListingId): Promise<void>;
  claimVaultDeposit(
    collectionId: CollectionId,
    tokenId: string,
  ): Promise<
    { __kind__: "ok"; ok: WalletNFT } | { __kind__: "err"; err: string }
  >;
  configureMarketplaceFee(
    recipient: AccountIdentifier | null,
    mintlabFeeBasisPoints: bigint,
  ): Promise<MarketplaceFeeConfig>;
  configureMarketplaceFeeRecipient(
    recipient: AccountIdentifier | null,
  ): Promise<MarketplaceFeeConfig>;
  configureMinting(
    name: string,
    description: string,
    symbol: string,
    imageUrl: string,
    collectionCreationPayoutAccount: AccountIdentifier | null,
    collectionCreationSecondaryPayoutAccount: AccountIdentifier | null,
    collectionCreationPrimaryPayoutBasisPoints: bigint,
    collectionCreationSecondaryPayoutBasisPoints: bigint,
    collectionCreationPriceE8s: bigint,
    collectionCreationEnabled: boolean,
    mainMintPayoutAccount: AccountIdentifier | null,
    mainMintPriceE8s: bigint,
    mainMintEnabled: boolean,
    mainMintDividendsEnabled: boolean,
    collectionCanisterCycles: bigint,
  ): Promise<Collection>;
  configureModeration(
    enabled: boolean,
    apiKey: string | null,
    clearApiKey: boolean,
    model: string,
    categories: ModerationCategorySettings,
    userMessage: string,
  ): Promise<PublicModerationConfig>;
  adminRecoverPaidCollectionCreation(
    owner: Principal,
    cyclePaymentBlock: bigint,
    name: string,
    description: string,
    symbol: string,
    imageUrl: string,
    dividendsEnabled: boolean,
  ): Promise<
    | { __kind__: "ok"; ok: CollectionCreationReceipt }
    | { __kind__: "err"; err: string }
  >;
  adminDeleteCollectionCreationRequest(
    requestId: bigint,
  ): Promise<
    { __kind__: "ok"; ok: boolean } | { __kind__: "err"; err: string }
  >;
  adminGetSettlementEscrowRepairQuote(
    listingId: ListingId,
  ): Promise<SettlementEscrowRepairQuote>;
  adminGetMintlabFeeRecoveryQuote(
    listingId: ListingId,
  ): Promise<MintlabFeeRecoveryQuote>;
  adminResetUnresolvedMintlabFeeAttempt(
    listingId: ListingId,
  ): Promise<MintlabFeeRecoveryQuote>;
  adminMarkMintlabFeeBalanceVerified(
    listingId: ListingId,
  ): Promise<MintlabFeeRecoveryQuote>;
  adminRetryListingReturn(listingId: ListingId): Promise<void>;
  adminRetryNoBidAuctionReturn(listingId: ListingId): Promise<void>;
  adminRetryAuctionSettlement(listingId: ListingId): Promise<void>;
  adminRetryFixedPurchaseSettlement(listingId: ListingId): Promise<void>;
  adminTopUpSettlementEscrow(
    listingId: ListingId,
    amount: bigint,
  ): Promise<SettlementEscrowTopUpReceipt>;
  createAuctionListing(
    nftId: NFTId,
    startingBid: bigint,
    endTime: bigint,
  ): Promise<AuctionListing>;
  createUserCollection(
    name: string,
    description: string,
    symbol: string,
    imageUrl: string,
    dividendsEnabled: boolean,
  ): Promise<
    | { __kind__: "ok"; ok: CollectionCreationReceipt }
    | { __kind__: "err"; err: string }
  >;
  createFixedListing(nftId: NFTId, price: bigint): Promise<FixedListing>;
  quoteCollectionCreationCost(
    collectionCanisterCycles: bigint,
    collectionCreationPriceE8s: bigint,
    collectionCreationPrimaryPayoutBasisPoints: bigint,
    collectionCreationSecondaryPayoutBasisPoints: bigint,
  ): Promise<CollectionCreationQuote>;
  quoteCollectionCycleTopUp(
    cyclesToTopUp: bigint,
  ): Promise<CollectionCycleTopUpQuote>;
  quoteAppCanisterCycleTopUp(
    cyclesToTopUp: bigint,
  ): Promise<CollectionCycleTopUpQuote>;
  getAppCanisterHealth(
    frontendCanisterId: Principal | null,
  ): Promise<
    | { __kind__: "ok"; ok: Array<AppCanisterHealth> }
    | { __kind__: "err"; err: string }
  >;
  getAllCollectionCreationRequests(): Promise<
    | { __kind__: "ok"; ok: Array<CollectionCreationRequestView> }
    | { __kind__: "err"; err: string }
  >;
  getAllCollectionCreationRequestsPage(
    cursor: bigint | null,
    limit: bigint | null,
  ): Promise<
    | { __kind__: "ok"; ok: CollectionCreationRequestPage }
    | { __kind__: "err"; err: string }
  >;
  getCollectionCreationDiagnostics(
    requestId: bigint,
  ): Promise<
    | { __kind__: "ok"; ok: CollectionCreationDiagnostics }
    | { __kind__: "err"; err: string }
  >;
  claimNFTDividend(
    nftId: NFTId,
  ): Promise<
    | { __kind__: "ok"; ok: DividendClaimReceipt }
    | { __kind__: "err"; err: string }
  >;
  disburseCollectionDividends(
    collectionId: CollectionId,
    maxTransfers: bigint | null,
  ): Promise<
    | { __kind__: "ok"; ok: DividendDisbursementReceipt }
    | { __kind__: "err"; err: string }
  >;
  getActiveListingDetails(): Promise<Array<ActiveListingDetail>>;
  getActiveListingDetailsPage(
    cursor: bigint | null,
    limit: bigint | null,
  ): Promise<ActiveListingDetailPage>;
  getActiveListings(): Promise<Array<ActiveListing>>;
  getActiveListingsPage(
    cursor: bigint | null,
    limit: bigint | null,
  ): Promise<ActiveListingPage>;
  getMyMarketplaceSettlementStatuses(): Promise<Array<SettlementStatus>>;
  getMyAuctionBidStatuses(
    listingIds: Array<ListingId>,
  ): Promise<Array<AuctionBidStatus>>;
  getAdminPrincipal(): Promise<Principal | null>;
  getCollection(id: CollectionId): Promise<Collection | null>;
  getCollectionBrowseStats(
    collectionId: CollectionId,
  ): Promise<CollectionBrowseStats>;
  getCollectionCreator(collectionId: CollectionId): Promise<Principal | null>;
  getCollectionDividendAccountId(
    collectionId: CollectionId,
  ): Promise<AccountIdentifier>;
  getCollectionDividendBalances(
    collectionId: CollectionId,
  ): Promise<Array<[string, bigint]>>;
  getCollectionDividendBalancesPage(
    collectionId: CollectionId,
    cursor: bigint | null,
    limit: bigint | null,
  ): Promise<DividendBalancePage>;
  refreshCollectionDividendBalances(
    collectionId: CollectionId,
  ): Promise<Array<[string, bigint]>>;
  refreshCollectionDividendBalancesPage(
    collectionId: CollectionId,
    cursor: bigint | null,
    limit: bigint | null,
  ): Promise<DividendBalancePage>;
  getCollectionDividendInfo(
    collectionId: CollectionId,
  ): Promise<CollectionDividendInfo | null>;
  getCollectionIndexStatus(
    collectionId: CollectionId,
  ): Promise<CollectionIndexStatus | null>;
  getMyCollectionCanisterStatuses(): Promise<Array<CollectionCanisterStatus>>;
  getCollectionCanisterControllers(
    collectionId: CollectionId,
  ): Promise<
    | { __kind__: "ok"; ok: CollectionCanisterControllers }
    | { __kind__: "err"; err: string }
  >;
  addCollectionCanisterController(
    collectionId: CollectionId,
    controller: Principal,
  ): Promise<
    | { __kind__: "ok"; ok: CollectionCanisterControllers }
    | { __kind__: "err"; err: string }
  >;
  removeCollectionCanisterController(
    collectionId: CollectionId,
    controller: Principal,
  ): Promise<
    | { __kind__: "ok"; ok: CollectionCanisterControllers }
    | { __kind__: "err"; err: string }
  >;
  getCollectionNFT(
    collectionId: CollectionId,
    tokenId: string,
  ): Promise<WalletNFT | null>;
  lookupCollectionNFT(
    collectionId: CollectionId,
    tokenId: string,
  ): Promise<CollectionNFTLookupResult>;
  getCollectionNFTPage(
    collectionId: CollectionId,
    cursor: string | null,
    limit: bigint | null,
  ): Promise<CollectionNFTPage>;
  getCollectionNFTs(collectionId: CollectionId): Promise<Array<WalletNFT>>;
  getMarketplaceFeeConfig(): Promise<MarketplaceFeeConfig>;
  getMintConfig(): Promise<MintConfig>;
  getModerationConfig(): Promise<PublicModerationConfig>;
  getMyCollectionCreationRequests(): Promise<
    Array<CollectionCreationRequestView>
  >;
  getMyCollectionCreationRequestsPage(
    cursor: bigint | null,
    limit: bigint | null,
  ): Promise<CollectionCreationRequestPage>;
  getMyCreatedCollections(): Promise<Array<Collection>>;
  getMyDividendNFTs(): Promise<Array<NFTDividend>>;
  getMyDividendNFTsPage(
    cursor: bigint | null,
    limit: bigint | null,
  ): Promise<NFTDividendPage>;
  getMyPendingAuctionRefunds(): Promise<Array<AuctionEscrow>>;
  getMyPendingMintPayments(): Promise<Array<PendingMintPaymentView>>;
  refreshMyDividendNFTs(): Promise<Array<NFTDividend>>;
  refreshMyDividendNFTsPage(
    cursor: bigint | null,
    limit: bigint | null,
  ): Promise<NFTDividendPage>;
  getNFTStats(user: Principal): Promise<NFTStats>;
  getUserAccountId(): Promise<AccountIdentifier>;
  getUserICPBalance(): Promise<bigint>;
  getUserNFTs(user: Principal): Promise<Array<WalletNFT>>;
  getUserNFTsPage(
    user: Principal,
    cursor: bigint | null,
    limit: bigint | null,
  ): Promise<WalletNFTPage>;
  getVaultAccountId(): Promise<AccountIdentifier>;
  getVaultPrincipal(): Promise<Principal>;
  indexCollectionOwnershipPage(
    collectionId: CollectionId,
    cursor: string | null,
    limit: bigint,
  ): Promise<
    | { __kind__: "ok"; ok: CollectionIndexPageResult }
    | { __kind__: "err"; err: string }
  >;
  isAdmin(): Promise<boolean>;
  isNFTInUserWallet(
    collectionId: CollectionId,
    tokenId: string,
    user: UserId,
  ): Promise<boolean>;
  listCollections(): Promise<Array<Collection>>;
  listCollectionsPage(
    cursor: bigint | null,
    limit: bigint | null,
  ): Promise<CollectionPage>;
  mintCollectionNFT(
    collectionId: CollectionId,
    metadata: NFTMetadata,
  ): Promise<
    { __kind__: "ok"; ok: WalletNFT } | { __kind__: "err"; err: string }
  >;
  mintUserNFT(
    metadata: NFTMetadata,
  ): Promise<
    { __kind__: "ok"; ok: MintReceipt } | { __kind__: "err"; err: string }
  >;
  placeBid(listingId: ListingId, amount: bigint): Promise<AuctionListing>;
  retryPendingBid(listingId: ListingId): Promise<AuctionListing>;
  retryPendingMintPayment(
    paymentId: bigint,
  ): Promise<
    { __kind__: "ok"; ok: MintReceipt } | { __kind__: "err"; err: string }
  >;
  prepareVaultDeposit(
    collectionId: CollectionId,
    tokenId: string,
  ): Promise<{ __kind__: "ok"; ok: string } | { __kind__: "err"; err: string }>;
  previewCollectionDividendDisbursement(
    collectionId: CollectionId,
  ): Promise<
    | { __kind__: "ok"; ok: DividendDisbursementPreview }
    | { __kind__: "err"; err: string }
  >;
  previewMyCollectionNFTs(
    collectionId: CollectionId,
  ): Promise<
    { __kind__: "ok"; ok: Array<WalletNFT> } | { __kind__: "err"; err: string }
  >;
  registerNFT(
    collectionId: CollectionId,
    tokenId: string,
    metadata: NFTMetadata,
  ): Promise<
    { __kind__: "ok"; ok: WalletNFT } | { __kind__: "err"; err: string }
  >;
  removeCollection(id: CollectionId): Promise<boolean>;
  updateCollectionBrowseInfo(
    collectionId: CollectionId,
    browseInfo: CollectionBrowseInfo | null,
  ): Promise<
    { __kind__: "ok"; ok: Collection } | { __kind__: "err"; err: string }
  >;
  recoverCollectionCreationRecord(
    requestId: bigint,
  ): Promise<
    | { __kind__: "ok"; ok: CollectionCreationRequestView }
    | { __kind__: "err"; err: string }
  >;
  retryAuctionRefund(escrowId: bigint): Promise<boolean>;
  retryCollectionCreationRequest(
    requestId: bigint,
  ): Promise<
    | { __kind__: "ok"; ok: CollectionCreationReceipt }
    | { __kind__: "err"; err: string }
  >;
  repairCollectionCreationRequest(
    requestId: bigint,
  ): Promise<
    | { __kind__: "ok"; ok: CollectionCreationRequestView }
    | { __kind__: "err"; err: string }
  >;
  retryInstallCollectionCanister(
    collectionId: CollectionId,
  ): Promise<
    { __kind__: "ok"; ok: Collection } | { __kind__: "err"; err: string }
  >;
  topUpCollectionCanisterCycles(
    collectionId: CollectionId,
    cyclesToTopUp: bigint,
  ): Promise<
    | { __kind__: "ok"; ok: CollectionCycleTopUpReceipt }
    | { __kind__: "err"; err: string }
  >;
  topUpAppCanisterCycles(
    cyclesToTopUp: bigint,
  ): Promise<
    | { __kind__: "ok"; ok: AppCycleTopUpReceipt }
    | { __kind__: "err"; err: string }
  >;
  topUpCanisterCycles(
    targetCanister: Principal,
    cyclesToTopUp: bigint,
  ): Promise<
    | { __kind__: "ok"; ok: AppCycleTopUpReceipt }
    | { __kind__: "err"; err: string }
  >;
  upgradeCollectionCanister(
    collectionId: CollectionId,
  ): Promise<
    { __kind__: "ok"; ok: Collection } | { __kind__: "err"; err: string }
  >;
  sendNFT(
    nftId: NFTId,
    recipient: Principal,
  ): Promise<{ __kind__: "ok"; ok: string } | { __kind__: "err"; err: string }>;
  syncExternalNFTOwner(
    collectionId: CollectionId,
    tokenId: string,
    owner: Principal,
  ): Promise<
    { __kind__: "ok"; ok: WalletNFT } | { __kind__: "err"; err: string }
  >;
  setCollectionCanisterWasm(wasm: Uint8Array): Promise<void>;
  settleAuction(listingId: ListingId): Promise<void>;
  syncUserNFTs(): Promise<
    | { __kind__: "ok"; ok: { errors: Array<string>; newCount: bigint } }
    | { __kind__: "err"; err: string }
  >;
  syncUserNFTsV2(): Promise<
    | { __kind__: "ok"; ok: WalletSyncV2Result }
    | { __kind__: "err"; err: string }
  >;
  syncUserNFTsPage(
    cursor: bigint | null,
    maxCollections: bigint,
  ): Promise<
    | { __kind__: "ok"; ok: WalletSyncPageResult }
    | { __kind__: "err"; err: string }
  >;
  syncCollectionDividends(
    collectionId: CollectionId,
  ): Promise<
    | { __kind__: "ok"; ok: DividendSyncReceipt }
    | { __kind__: "err"; err: string }
  >;
  transferICPOut(
    to: AccountIdentifier,
    amount: bigint,
  ): Promise<TransferResult>;
}

type RawNFTStandard =
  | { EXT: null }
  | { DIP721: null }
  | { ICRC7: null }
  | { Other: string };
type RawCollectionKind = { External: null } | { Minted: null };
type RawCollectionBrowseCoverage = { Full: null } | { Partial: null };
type RawWalletLocation =
  | { Minted: null }
  | { Registered: null }
  | { Vaulted: null };
type RawListingStatus =
  | { Sold: null }
  | { Active: null }
  | { Cancelled: null }
  | { Settled: null };
type RawActiveListing =
  | { Fixed: RawFixedListing }
  | { Auction: RawAuctionListing };
type RawActiveListingDetail = { listing: RawActiveListing; nft: RawWalletNFT };
type RawActiveListingPage = {
  listings: Array<RawActiveListing>;
  nextCursor: [] | [bigint];
  totalCount: bigint;
};
type RawActiveListingDetailPage = {
  details: Array<RawActiveListingDetail>;
  nextCursor: [] | [bigint];
  totalCount: bigint;
};
type RawSettlementStatusKind =
  | { FixedPurchase: null }
  | { Auction: null }
  | { NoBidAuctionReturn: null }
  | { ListingReturn: null }
  | { PendingBidDeposit: null }
  | { PendingAuctionRefund: null };
type RawSettlementStatusRole =
  | { Buyer: null }
  | { Seller: null }
  | { Bidder: null };
type RawSettlementStatus = {
  listingId: ListingId;
  kind: RawSettlementStatusKind;
  role: RawSettlementStatusRole;
  stage: string;
  message: string;
  updatedAt: Timestamp;
};
type RawTransferError =
  | { TxTooOld: { allowed_window_nanos: bigint } }
  | { BadFee: { expected_fee: Tokens } }
  | { TxDuplicate: { duplicate_of: bigint } }
  | { TxCreatedInFuture: null }
  | { InsufficientFunds: { balance: Tokens } };
type RawTransferResult = { Ok: bigint } | { Err: RawTransferError };
type RawCollectionBrowseInfo = {
  totalSupply: [] | [bigint];
  tokenIndexOffset: [] | [bigint];
};
type RawCollectionDividendConfig = {
  enabled: boolean;
};
type RawCollectionBrowseStats = {
  collectionId: CollectionId;
  totalCount: bigint;
  visibleCount: bigint;
  coverage: RawCollectionBrowseCoverage;
  note: string;
};
type RawCollectionNFTPage = {
  nfts: Array<RawWalletNFT>;
  nextCursor: [] | [string];
  totalCount: bigint;
  coverage: RawCollectionBrowseCoverage;
  note: string;
};
type RawWalletNFTPage = {
  nfts: Array<RawWalletNFT>;
  nextCursor: [] | [bigint];
  totalCount: bigint;
};
type RawCollectionPage = {
  collections: Array<RawCollection>;
  nextCursor: [] | [bigint];
  totalCount: bigint;
};
type RawWalletSyncSkip = {
  collectionId: CollectionId;
  collectionName: string;
  message: string;
  reason: string;
};
type RawWalletSyncV2Result = {
  errors: Array<string>;
  newCount: bigint;
  skipped: Array<RawWalletSyncSkip>;
};
type RawWalletSyncPageResult = RawWalletSyncV2Result & {
  nextCursor: [] | [bigint];
  complete: boolean;
  checkedCollections: bigint;
};
type RawCollectionIndexStatus = {
  collectionId: CollectionId;
  complete: boolean;
  cursor: [] | [string];
  indexed: bigint;
  lastError: [] | [string];
  scanned: bigint;
  updatedAt: Timestamp;
};
type RawCollectionIndexPageResult = {
  collectionId: CollectionId;
  complete: boolean;
  error: [] | [string];
  indexed: bigint;
  nextCursor: [] | [string];
  scanned: bigint;
};
type RawCollectionNFTLookupResult =
  | { ok: [] | [RawWalletNFT] }
  | { err: string };
type RawMintConfig = {
  collectionId: [] | [CollectionId];
  payoutAccount: [] | [AccountIdentifier];
  mintPriceE8s: bigint;
  mintEnabled: boolean;
  collectionCreationPayoutAccount: [] | [AccountIdentifier];
  collectionCreationSecondaryPayoutAccount: [] | [AccountIdentifier];
  collectionCreationPrimaryPayoutBasisPoints: bigint;
  collectionCreationSecondaryPayoutBasisPoints: bigint;
  collectionCreationPriceE8s: bigint;
  collectionCreationEnabled: boolean;
  mainMintPayoutAccount: [] | [AccountIdentifier];
  mainMintPriceE8s: bigint;
  mainMintEnabled: boolean;
  collectionCanisterWasmUploaded: boolean;
  collectionCanisterCycles: bigint;
};
type RawModerationCategorySettings = {
  nudityOrSexual: boolean;
  graphicViolence: boolean;
  explicitLanguage: boolean;
  hateOrHarassment: boolean;
  hateSymbols: boolean;
  illegalOrDangerous: boolean;
  selfHarm: boolean;
  otherNsfw: boolean;
};
type RawPublicModerationConfig = {
  enabled: boolean;
  apiKeyConfigured: boolean;
  model: string;
  categories: RawModerationCategorySettings;
  userMessage: string;
};
type RawCollectionCreationQuote = {
  collectionCanisterCycles: bigint;
  factoryReserveCycles: bigint;
  totalCyclesToConvert: bigint;
  cycleCostE8s: bigint;
  minimumCreationPriceE8s: bigint;
  collectionCreationPriceE8s: bigint;
  adminPayoutE8s: bigint;
  adminPrimaryPayoutE8s: bigint;
  adminSecondaryPayoutE8s: bigint;
  ledgerFeeE8s: bigint;
  cycleTransferFeeE8s: bigint;
  adminPayoutFeeE8s: bigint;
  totalUserDebitE8s: bigint;
  xdrPermyriadPerIcp: bigint;
  rateTimestampSeconds: bigint;
};
type RawCollectionCreationStatus =
  | { Started: null }
  | { CyclePaymentSent: null }
  | { CyclesConverted: null }
  | { AdminPayoutPending: null }
  | { AdminPayoutSent: null }
  | { CanisterCreated: null }
  | { CollectionRegistered: null }
  | { Installed: null }
  | { Failed: null };
type RawCollectionCreationRequestView = {
  id: bigint;
  name: string;
  symbol: string;
  status: RawCollectionCreationStatus;
  cyclePaymentBlock: [] | [bigint];
  childCanisterId: [] | [Principal];
  collectionId: [] | [CollectionId];
  lastError: [] | [string];
  createdAt: bigint;
  updatedAt: bigint;
};
type RawCollectionCreationRequestPage = {
  requests: Array<RawCollectionCreationRequestView>;
  nextCursor: [] | [bigint];
  totalCount: bigint;
};
type RawCollectionCreationDiagnostics = {
  request: RawCollectionCreationRequestView;
  requestedCanisterCycles: bigint;
  totalCyclesToConvert: bigint;
  childTargetCycles: bigint;
  createCallCycles: bigint;
  canisterCreationFeeCycles: bigint;
  backendCycles: bigint;
  requiredBackendCycles: bigint;
  canCreateNow: boolean;
  buildVersion: string;
};
type RawCollectionCanisterStatus = {
  collectionId: CollectionId;
  canisterId: Principal;
  appCanisterId: Principal;
  controllers: Array<Principal>;
  cycles: bigint;
  moduleInstalled: boolean;
  freezingThresholdSeconds: bigint;
  idleCyclesBurnedPerDay: bigint;
};
type RawCollectionCanisterControllers = {
  collectionId: CollectionId;
  canisterId: Principal;
  appCanisterId: Principal;
  controllers: Array<Principal>;
};
type RawCollectionCycleTopUpQuote = {
  cyclesToTopUp: bigint;
  cycleCostE8s: bigint;
  ledgerFeeE8s: bigint;
  totalUserDebitE8s: bigint;
  xdrPermyriadPerIcp: bigint;
  rateTimestampSeconds: bigint;
};
type RawAppCanisterKind = { Backend: null } | { Frontend: null };
type RawAppCanisterHealth = {
  kind: RawAppCanisterKind;
  canisterId: Principal;
  cycles: [] | [bigint];
  moduleInstalled: [] | [boolean];
  freezingThresholdSeconds: [] | [bigint];
  idleCyclesBurnedPerDay: [] | [bigint];
  error: [] | [string];
};
type RawNFTMetadata = {
  name: [] | [string];
  description: [] | [string];
  imageUrl: [] | [string];
  attributes: Array<[string, string]>;
};
type RawWalletNFT = {
  id: NFTId;
  tokenId: string;
  collectionId: CollectionId;
  owner: UserId;
  metadata: RawNFTMetadata;
  location: RawWalletLocation;
  registeredAt: Timestamp;
};
type RawCollection = {
  id: CollectionId;
  name: string;
  description: string;
  imageUrl: string;
  standard: RawNFTStandard;
  symbol: string;
  canisterId: Principal;
  kind: RawCollectionKind;
  browseInfo: [] | [RawCollectionBrowseInfo];
  dividendConfig: [] | [RawCollectionDividendConfig];
};
type RawFixedListing = {
  id: ListingId;
  status: RawListingStatus;
  createdAt: Timestamp;
  seller: UserId;
  nftId: NFTId;
  price: bigint;
};
type RawAuctionListing = {
  id: ListingId;
  status: RawListingStatus;
  highestBidder: [] | [UserId];
  endTime: Timestamp;
  createdAt: Timestamp;
  seller: UserId;
  highestBid: bigint;
  nftId: NFTId;
  startingBid: bigint;
};
type RawAuctionBidStatus = {
  listingId: ListingId;
  hasBid: boolean;
  isWinning: boolean;
  highestBidder: [] | [UserId];
  highestBid: bigint;
  myHighestBid: [] | [bigint];
};
type RawAuctionEscrow = {
  amount: bigint;
  bidder: UserId;
  createdAt: Timestamp;
  depositedBlock: bigint;
  escrowId: bigint;
  feeReserve: bigint;
  ledgerFeeE8s: bigint;
  listingId: ListingId;
};
type RawMarketplaceFeeConfig = {
  auctionBidFeeReserveE8s: bigint;
  ledgerFeeE8s: bigint;
  mintlabFeeBasisPoints: bigint;
  mintlabFeeRecipient: [] | [AccountIdentifier];
};
type RawSettlementEscrowRepairKind =
  | { FixedPurchase: null }
  | { Auction: null };
type RawSettlementEscrowRepairQuote = {
  listingId: ListingId;
  kind: RawSettlementEscrowRepairKind;
  escrowId: bigint;
  escrowAccount: AccountIdentifier;
  escrowBalance: bigint;
  requiredDebit: bigint;
  shortfall: bigint;
  ledgerFeeE8s: bigint;
  sellerProceeds: bigint;
  mintlabFee: bigint;
  topUpFromAccount: AccountIdentifier;
  topUpFromBalance: bigint;
  topUpTransferFeeE8s: bigint;
  topUpTotalDebit: bigint;
};
type RawSettlementEscrowTopUpReceipt = {
  listingId: ListingId;
  amount: bigint;
  feeE8s: bigint;
  blockIndex: bigint;
  quoteBefore: RawSettlementEscrowRepairQuote;
};
type RawMintlabFeeRecoveryQuote = {
  listingId: ListingId;
  kind: RawSettlementEscrowRepairKind;
  escrowId: bigint;
  escrowAccount: AccountIdentifier;
  escrowBalance: bigint;
  expectedBeforeMintlabFeeDebit: bigint;
  expectedAfterMintlabFeeDebit: bigint;
  shortfallBeforeMintlabFee: bigint;
  sellerProceeds: bigint;
  mintlabFee: bigint;
  ledgerFeeE8s: bigint;
  feeRecipient: AccountIdentifier;
  previousMintlabFeeCreatedAt: bigint;
};
type RawMintReceipt = {
  nft: RawWalletNFT;
  paymentBlock: bigint;
};
type RawPendingMintPaymentStatus =
  | { PaymentPending: null }
  | { PaymentSent: null }
  | { Minted: null }
  | { Failed: null };
type RawPendingMintPaymentView = {
  id: bigint;
  collectionId: CollectionId;
  amountE8s: bigint;
  paymentBlock: [] | [bigint];
  mintedTokenId: [] | [bigint];
  status: RawPendingMintPaymentStatus;
  createdAt: bigint;
  updatedAt: bigint;
  lastError: [] | [string];
};
type RawCollectionCreationReceipt = {
  collection: RawCollection;
  paymentBlock: bigint;
};
type RawCollectionCycleTopUpReceipt = {
  collectionId: CollectionId;
  canisterId: Principal;
  cyclesRequested: bigint;
  cyclesMinted: bigint;
  cycleCostE8s: bigint;
  totalUserDebitE8s: bigint;
  paymentBlock: bigint;
  cycleBalance: [] | [bigint];
};
type RawAppCycleTopUpReceipt = {
  canisterId: Principal;
  cyclesRequested: bigint;
  cyclesMinted: bigint;
  cycleCostE8s: bigint;
  totalUserDebitE8s: bigint;
  paymentBlock: bigint;
  cycleBalance: [] | [bigint];
};
type RawCollectionDividendInfo = {
  collectionId: CollectionId;
  enabled: boolean;
  accountId: AccountIdentifier;
  balanceE8s: bigint;
  distributableBalanceE8s: bigint;
  feeReserveE8s: bigint;
  processedBalanceE8s: bigint;
  pendingE8s: bigint;
  nftCount: bigint;
};
type RawNFTDividend = {
  nft: RawWalletNFT;
  collection: RawCollection;
  claimableE8s: bigint;
};
type RawNFTDividendPage = {
  dividends: Array<RawNFTDividend>;
  nextCursor: [] | [bigint];
  totalCount: bigint;
};
type RawDividendBalancePage = {
  balances: Array<[string, bigint]>;
  nextCursor: [] | [bigint];
  totalCount: bigint;
};
type RawDividendSyncReceipt = {
  collectionId: CollectionId;
  depositedE8s: bigint;
  distributedE8s: bigint;
  shareE8s: bigint;
  remainderE8s: bigint;
  nftCount: bigint;
  balanceE8s: bigint;
};
type RawDividendClaimReceipt = {
  nft: RawWalletNFT;
  collection: RawCollection;
  paidE8s: bigint;
  feeE8s: bigint;
  blockIndex: bigint;
};
type RawDividendDisbursementPreview = {
  collectionId: CollectionId;
  accountId: AccountIdentifier;
  balanceE8s: bigint;
  distributableBalanceE8s: bigint;
  processedBalanceE8s: bigint;
  pendingE8s: bigint;
  projectedPendingE8s: bigint;
  undistributedE8s: bigint;
  shareE8s: bigint;
  remainderE8s: bigint;
  nftCount: bigint;
  transferCount: bigint;
  ledgerFeeE8s: bigint;
  requiredNetworkFeeE8s: bigint;
  feeReserveE8s: bigint;
  feeShortfallE8s: bigint;
  callerBalanceE8s: bigint;
  callerFundingTransferFeeE8s: bigint;
  callerTotalDebitE8s: bigint;
  maxTransfersPerCall: bigint;
};
type RawDividendDisbursementReceipt = {
  collectionId: CollectionId;
  synced: RawDividendSyncReceipt;
  paidCount: bigint;
  skippedCount: bigint;
  remainingCount: bigint;
  totalPaidE8s: bigint;
  totalFeeE8s: bigint;
  feeTopUpE8s: bigint;
  feeTopUpBlockIndex: [] | [bigint];
  feeReserveRemainingE8s: bigint;
  failures: Array<string>;
};

function fromRawOption<T>(value: [] | [T]): T | null {
  return value.length === 0 ? null : value[0];
}

function toRawOption<T>(value: T | null | undefined): [] | [T] {
  return value == null ? [] : [value];
}

function fromRawNFTStandard(value: RawNFTStandard): NFTStandard {
  if ("EXT" in value) return { __kind__: "EXT", EXT: null };
  if ("DIP721" in value) return { __kind__: "DIP721", DIP721: null };
  if ("ICRC7" in value) return { __kind__: "ICRC7", ICRC7: null };
  return { __kind__: "Other", Other: value.Other };
}

function toRawNFTStandard(value: NFTStandard): RawNFTStandard {
  if (value.__kind__ === "EXT") return { EXT: null };
  if (value.__kind__ === "DIP721") return { DIP721: null };
  if (value.__kind__ === "ICRC7") return { ICRC7: null };
  return { Other: value.Other };
}

function fromRawCollectionKind(value: RawCollectionKind): CollectionKind {
  if ("External" in value) return "External";
  return "Minted";
}

function fromRawCollectionBrowseCoverage(
  value: RawCollectionBrowseCoverage,
): CollectionBrowseCoverage {
  if ("Full" in value) return "Full";
  return "Partial";
}

function fromRawCollectionBrowseInfo(
  value: RawCollectionBrowseInfo,
): CollectionBrowseInfo {
  return {
    totalSupply: fromRawOption(value.totalSupply),
    tokenIndexOffset: fromRawOption(value.tokenIndexOffset),
  };
}

function toRawCollectionBrowseInfo(
  value: CollectionBrowseInfo,
): RawCollectionBrowseInfo {
  return {
    totalSupply: toRawOption(value.totalSupply),
    tokenIndexOffset: toRawOption(value.tokenIndexOffset),
  };
}

function fromRawCollectionDividendConfig(
  value: RawCollectionDividendConfig,
): CollectionDividendConfig {
  return {
    enabled: value.enabled,
  };
}

function fromRawWalletLocation(value: RawWalletLocation): WalletLocation {
  if ("Minted" in value) return "Minted";
  if ("Registered" in value) return "Registered";
  return "Vaulted";
}

function fromRawListingStatus(value: RawListingStatus): ListingStatus {
  if ("Sold" in value) return ListingStatus.Sold;
  if ("Cancelled" in value) return ListingStatus.Cancelled;
  if ("Settled" in value) return ListingStatus.Settled;
  return ListingStatus.Active;
}

function fromRawNFTMetadata(value: RawNFTMetadata): NFTMetadata {
  return {
    name: fromRawOption(value.name) ?? undefined,
    description: fromRawOption(value.description) ?? undefined,
    imageUrl: fromRawOption(value.imageUrl) ?? undefined,
    attributes: value.attributes,
  };
}

function toRawNFTMetadata(value: NFTMetadata): RawNFTMetadata {
  return {
    name: toRawOption(value.name),
    description: toRawOption(value.description),
    imageUrl: toRawOption(value.imageUrl),
    attributes: value.attributes,
  };
}

function fromRawWalletNFT(value: RawWalletNFT): WalletNFT {
  return {
    id: value.id,
    tokenId: value.tokenId,
    collectionId: value.collectionId,
    owner: value.owner,
    metadata: fromRawNFTMetadata(value.metadata),
    location: fromRawWalletLocation(value.location),
    registeredAt: value.registeredAt,
  };
}

function fromRawCollection(value: RawCollection): Collection {
  const browseInfo = fromRawOption(value.browseInfo);
  const dividendConfig = fromRawOption(value.dividendConfig);
  return {
    id: value.id,
    name: value.name,
    description: value.description,
    imageUrl: value.imageUrl,
    standard: fromRawNFTStandard(value.standard),
    symbol: value.symbol,
    canisterId: value.canisterId,
    kind: fromRawCollectionKind(value.kind),
    browseInfo:
      browseInfo == null ? undefined : fromRawCollectionBrowseInfo(browseInfo),
    dividendConfig:
      dividendConfig == null
        ? undefined
        : fromRawCollectionDividendConfig(dividendConfig),
  };
}

function fromRawCollectionBrowseStats(
  value: RawCollectionBrowseStats,
): CollectionBrowseStats {
  return {
    collectionId: value.collectionId,
    totalCount: value.totalCount,
    visibleCount: value.visibleCount,
    coverage: fromRawCollectionBrowseCoverage(value.coverage),
    note: value.note,
  };
}

function fromRawCollectionNFTPage(
  value: RawCollectionNFTPage,
): CollectionNFTPage {
  return {
    nfts: value.nfts.map(fromRawWalletNFT),
    nextCursor: fromRawOption(value.nextCursor) ?? undefined,
    totalCount: value.totalCount,
    coverage: fromRawCollectionBrowseCoverage(value.coverage),
    note: value.note,
  };
}

function fromRawWalletNFTPage(value: RawWalletNFTPage): WalletNFTPage {
  return {
    nfts: value.nfts.map(fromRawWalletNFT),
    nextCursor: fromRawOption(value.nextCursor),
    totalCount: value.totalCount,
  };
}

function fromRawCollectionPage(value: RawCollectionPage): CollectionPage {
  return {
    collections: value.collections.map(fromRawCollection),
    nextCursor: fromRawOption(value.nextCursor),
    totalCount: value.totalCount,
  };
}

function fromRawWalletSyncSkip(value: RawWalletSyncSkip): WalletSyncSkip {
  return {
    collectionId: value.collectionId,
    collectionName: value.collectionName,
    reason: value.reason,
    message: value.message,
  };
}

function fromRawWalletSyncV2Result(
  value: RawWalletSyncV2Result,
): WalletSyncV2Result {
  return {
    errors: value.errors,
    newCount: value.newCount,
    skipped: value.skipped.map(fromRawWalletSyncSkip),
  };
}

function fromRawWalletSyncPageResult(
  value: RawWalletSyncPageResult,
): WalletSyncPageResult {
  return {
    ...fromRawWalletSyncV2Result(value),
    nextCursor: fromRawOption(value.nextCursor),
    complete: value.complete,
    checkedCollections: value.checkedCollections,
  };
}

function fromRawCollectionIndexStatus(
  value: RawCollectionIndexStatus,
): CollectionIndexStatus {
  return {
    collectionId: value.collectionId,
    cursor: fromRawOption(value.cursor),
    scanned: value.scanned,
    indexed: value.indexed,
    complete: value.complete,
    lastError: fromRawOption(value.lastError),
    updatedAt: value.updatedAt,
  };
}

function fromRawCollectionIndexPageResult(
  value: RawCollectionIndexPageResult,
): CollectionIndexPageResult {
  return {
    collectionId: value.collectionId,
    scanned: value.scanned,
    indexed: value.indexed,
    nextCursor: fromRawOption(value.nextCursor),
    complete: value.complete,
    error: fromRawOption(value.error),
  };
}

function fromRawCollectionNFTLookupResult(
  value: RawCollectionNFTLookupResult,
): CollectionNFTLookupResult {
  if ("ok" in value) {
    const nft = fromRawOption(value.ok);
    return { __kind__: "ok", ok: nft == null ? null : fromRawWalletNFT(nft) };
  }
  return { __kind__: "err", err: value.err };
}

function fromRawFixedListing(value: RawFixedListing): FixedListing {
  return {
    id: value.id,
    status: fromRawListingStatus(value.status),
    createdAt: value.createdAt,
    seller: value.seller,
    nftId: value.nftId,
    price: value.price,
  };
}

function fromRawAuctionListing(value: RawAuctionListing): AuctionListing {
  return {
    id: value.id,
    status: fromRawListingStatus(value.status),
    highestBidder: fromRawOption(value.highestBidder) ?? undefined,
    endTime: value.endTime,
    createdAt: value.createdAt,
    seller: value.seller,
    highestBid: value.highestBid,
    nftId: value.nftId,
    startingBid: value.startingBid,
  };
}

function fromRawAuctionBidStatus(value: RawAuctionBidStatus): AuctionBidStatus {
  return {
    listingId: value.listingId,
    hasBid: value.hasBid,
    isWinning: value.isWinning,
    highestBidder: fromRawOption(value.highestBidder) ?? undefined,
    highestBid: value.highestBid,
    myHighestBid: fromRawOption(value.myHighestBid) ?? undefined,
  };
}

function fromRawAuctionEscrow(value: RawAuctionEscrow): AuctionEscrow {
  return {
    amount: value.amount,
    bidder: value.bidder,
    createdAt: value.createdAt,
    depositedBlock: value.depositedBlock,
    escrowId: value.escrowId,
    feeReserve: value.feeReserve,
    ledgerFeeE8s: value.ledgerFeeE8s,
    listingId: value.listingId,
  };
}

function fromRawMarketplaceFeeConfig(
  value: RawMarketplaceFeeConfig,
): MarketplaceFeeConfig {
  return {
    auctionBidFeeReserveE8s: value.auctionBidFeeReserveE8s,
    ledgerFeeE8s: value.ledgerFeeE8s,
    mintlabFeeBasisPoints: value.mintlabFeeBasisPoints,
    mintlabFeeRecipient: fromRawOption(value.mintlabFeeRecipient),
  };
}

function fromRawSettlementEscrowRepairKind(
  value: RawSettlementEscrowRepairKind,
): SettlementEscrowRepairKind {
  return "FixedPurchase" in value ? "FixedPurchase" : "Auction";
}

function fromRawSettlementEscrowRepairQuote(
  value: RawSettlementEscrowRepairQuote,
): SettlementEscrowRepairQuote {
  return {
    listingId: value.listingId,
    kind: fromRawSettlementEscrowRepairKind(value.kind),
    escrowId: value.escrowId,
    escrowAccount: value.escrowAccount,
    escrowBalance: value.escrowBalance,
    requiredDebit: value.requiredDebit,
    shortfall: value.shortfall,
    ledgerFeeE8s: value.ledgerFeeE8s,
    sellerProceeds: value.sellerProceeds,
    mintlabFee: value.mintlabFee,
    topUpFromAccount: value.topUpFromAccount,
    topUpFromBalance: value.topUpFromBalance,
    topUpTransferFeeE8s: value.topUpTransferFeeE8s,
    topUpTotalDebit: value.topUpTotalDebit,
  };
}

function fromRawSettlementEscrowTopUpReceipt(
  value: RawSettlementEscrowTopUpReceipt,
): SettlementEscrowTopUpReceipt {
  return {
    listingId: value.listingId,
    amount: value.amount,
    feeE8s: value.feeE8s,
    blockIndex: value.blockIndex,
    quoteBefore: fromRawSettlementEscrowRepairQuote(value.quoteBefore),
  };
}

function fromRawMintlabFeeRecoveryQuote(
  value: RawMintlabFeeRecoveryQuote,
): MintlabFeeRecoveryQuote {
  return {
    listingId: value.listingId,
    kind: fromRawSettlementEscrowRepairKind(value.kind),
    escrowId: value.escrowId,
    escrowAccount: value.escrowAccount,
    escrowBalance: value.escrowBalance,
    expectedBeforeMintlabFeeDebit: value.expectedBeforeMintlabFeeDebit,
    expectedAfterMintlabFeeDebit: value.expectedAfterMintlabFeeDebit,
    shortfallBeforeMintlabFee: value.shortfallBeforeMintlabFee,
    sellerProceeds: value.sellerProceeds,
    mintlabFee: value.mintlabFee,
    ledgerFeeE8s: value.ledgerFeeE8s,
    feeRecipient: value.feeRecipient,
    previousMintlabFeeCreatedAt: value.previousMintlabFeeCreatedAt,
  };
}

function fromRawActiveListing(value: RawActiveListing): ActiveListing {
  if ("Fixed" in value) {
    return { __kind__: "Fixed", Fixed: fromRawFixedListing(value.Fixed) };
  }
  return { __kind__: "Auction", Auction: fromRawAuctionListing(value.Auction) };
}

function fromRawActiveListingDetail(
  value: RawActiveListingDetail,
): ActiveListingDetail {
  return {
    listing: fromRawActiveListing(value.listing),
    nft: fromRawWalletNFT(value.nft),
  };
}

function fromRawActiveListingPage(
  value: RawActiveListingPage,
): ActiveListingPage {
  return {
    listings: value.listings.map(fromRawActiveListing),
    nextCursor: fromRawOption(value.nextCursor),
    totalCount: value.totalCount,
  };
}

function fromRawActiveListingDetailPage(
  value: RawActiveListingDetailPage,
): ActiveListingDetailPage {
  return {
    details: value.details.map(fromRawActiveListingDetail),
    nextCursor: fromRawOption(value.nextCursor),
    totalCount: value.totalCount,
  };
}

function fromRawSettlementStatusKind(
  value: RawSettlementStatusKind,
): SettlementStatusKind {
  if ("FixedPurchase" in value) return "FixedPurchase";
  if ("Auction" in value) return "Auction";
  if ("NoBidAuctionReturn" in value) return "NoBidAuctionReturn";
  if ("ListingReturn" in value) return "ListingReturn";
  if ("PendingBidDeposit" in value) return "PendingBidDeposit";
  return "PendingAuctionRefund";
}

function fromRawSettlementStatusRole(
  value: RawSettlementStatusRole,
): SettlementStatusRole {
  if ("Buyer" in value) return "Buyer";
  if ("Seller" in value) return "Seller";
  return "Bidder";
}

function fromRawSettlementStatus(value: RawSettlementStatus): SettlementStatus {
  return {
    listingId: value.listingId,
    kind: fromRawSettlementStatusKind(value.kind),
    role: fromRawSettlementStatusRole(value.role),
    stage: value.stage,
    message: value.message,
    updatedAt: value.updatedAt,
  };
}

function fromRawMintConfig(value: RawMintConfig): MintConfig {
  return {
    collectionId: fromRawOption(value.collectionId),
    payoutAccount: fromRawOption(value.payoutAccount),
    mintPriceE8s: value.mintPriceE8s,
    mintEnabled: value.mintEnabled,
    collectionCreationPayoutAccount: fromRawOption(
      value.collectionCreationPayoutAccount,
    ),
    collectionCreationSecondaryPayoutAccount: fromRawOption(
      value.collectionCreationSecondaryPayoutAccount,
    ),
    collectionCreationPrimaryPayoutBasisPoints:
      value.collectionCreationPrimaryPayoutBasisPoints,
    collectionCreationSecondaryPayoutBasisPoints:
      value.collectionCreationSecondaryPayoutBasisPoints,
    collectionCreationPriceE8s: value.collectionCreationPriceE8s,
    collectionCreationEnabled: value.collectionCreationEnabled,
    mainMintPayoutAccount: fromRawOption(value.mainMintPayoutAccount),
    mainMintPriceE8s: value.mainMintPriceE8s,
    mainMintEnabled: value.mainMintEnabled,
    collectionCanisterWasmUploaded: value.collectionCanisterWasmUploaded,
    collectionCanisterCycles: value.collectionCanisterCycles,
  };
}

function fromRawModerationCategories(
  value: RawModerationCategorySettings,
): ModerationCategorySettings {
  return {
    nudityOrSexual: value.nudityOrSexual,
    graphicViolence: value.graphicViolence,
    explicitLanguage: value.explicitLanguage,
    hateOrHarassment: value.hateOrHarassment,
    hateSymbols: value.hateSymbols,
    illegalOrDangerous: value.illegalOrDangerous,
    selfHarm: value.selfHarm,
    otherNsfw: value.otherNsfw,
  };
}

function toRawModerationCategories(
  value: ModerationCategorySettings,
): RawModerationCategorySettings {
  return {
    nudityOrSexual: value.nudityOrSexual,
    graphicViolence: value.graphicViolence,
    explicitLanguage: value.explicitLanguage,
    hateOrHarassment: value.hateOrHarassment,
    hateSymbols: value.hateSymbols,
    illegalOrDangerous: value.illegalOrDangerous,
    selfHarm: value.selfHarm,
    otherNsfw: value.otherNsfw,
  };
}

function fromRawPublicModerationConfig(
  value: RawPublicModerationConfig,
): PublicModerationConfig {
  return {
    enabled: value.enabled,
    apiKeyConfigured: value.apiKeyConfigured,
    model: value.model,
    categories: fromRawModerationCategories(value.categories),
    userMessage: value.userMessage,
  };
}

function fromRawCollectionCreationQuote(
  value: RawCollectionCreationQuote,
): CollectionCreationQuote {
  return {
    collectionCanisterCycles: value.collectionCanisterCycles,
    factoryReserveCycles: value.factoryReserveCycles,
    totalCyclesToConvert: value.totalCyclesToConvert,
    cycleCostE8s: value.cycleCostE8s,
    minimumCreationPriceE8s: value.minimumCreationPriceE8s,
    collectionCreationPriceE8s: value.collectionCreationPriceE8s,
    adminPayoutE8s: value.adminPayoutE8s,
    adminPrimaryPayoutE8s: value.adminPrimaryPayoutE8s,
    adminSecondaryPayoutE8s: value.adminSecondaryPayoutE8s,
    ledgerFeeE8s: value.ledgerFeeE8s,
    cycleTransferFeeE8s: value.cycleTransferFeeE8s,
    adminPayoutFeeE8s: value.adminPayoutFeeE8s,
    totalUserDebitE8s: value.totalUserDebitE8s,
    xdrPermyriadPerIcp: value.xdrPermyriadPerIcp,
    rateTimestampSeconds: value.rateTimestampSeconds,
  };
}

function fromRawCollectionCreationStatus(
  value: RawCollectionCreationStatus,
): CollectionCreationStatus {
  if ("Started" in value) return "Started";
  if ("CyclePaymentSent" in value) return "CyclePaymentSent";
  if ("CyclesConverted" in value) return "CyclesConverted";
  if ("AdminPayoutPending" in value) return "AdminPayoutPending";
  if ("AdminPayoutSent" in value) return "AdminPayoutSent";
  if ("CanisterCreated" in value) return "CanisterCreated";
  if ("CollectionRegistered" in value) return "CollectionRegistered";
  if ("Installed" in value) return "Installed";
  return "Failed";
}

function fromRawCollectionCreationRequestView(
  value: RawCollectionCreationRequestView,
): CollectionCreationRequestView {
  return {
    id: value.id,
    name: value.name,
    symbol: value.symbol,
    status: fromRawCollectionCreationStatus(value.status),
    cyclePaymentBlock: fromRawOption(value.cyclePaymentBlock),
    childCanisterId: fromRawOption(value.childCanisterId),
    collectionId: fromRawOption(value.collectionId),
    lastError: fromRawOption(value.lastError),
    createdAt: value.createdAt,
    updatedAt: value.updatedAt,
  };
}

function fromRawCollectionCreationRequestPage(
  value: RawCollectionCreationRequestPage,
): CollectionCreationRequestPage {
  return {
    requests: value.requests.map(fromRawCollectionCreationRequestView),
    nextCursor: fromRawOption(value.nextCursor),
    totalCount: value.totalCount,
  };
}

function fromRawCollectionCreationDiagnostics(
  value: RawCollectionCreationDiagnostics,
): CollectionCreationDiagnostics {
  return {
    request: fromRawCollectionCreationRequestView(value.request),
    requestedCanisterCycles: value.requestedCanisterCycles,
    totalCyclesToConvert: value.totalCyclesToConvert,
    childTargetCycles: value.childTargetCycles,
    createCallCycles: value.createCallCycles,
    canisterCreationFeeCycles: value.canisterCreationFeeCycles,
    backendCycles: value.backendCycles,
    requiredBackendCycles: value.requiredBackendCycles,
    canCreateNow: value.canCreateNow,
    buildVersion: value.buildVersion,
  };
}

function fromRawCollectionCanisterStatus(
  value: RawCollectionCanisterStatus,
): CollectionCanisterStatus {
  return {
    collectionId: value.collectionId,
    canisterId: value.canisterId,
    appCanisterId: value.appCanisterId,
    controllers: value.controllers,
    cycles: value.cycles,
    moduleInstalled: value.moduleInstalled,
    freezingThresholdSeconds: value.freezingThresholdSeconds,
    idleCyclesBurnedPerDay: value.idleCyclesBurnedPerDay,
  };
}

function fromRawCollectionCanisterControllers(
  value: RawCollectionCanisterControllers,
): CollectionCanisterControllers {
  return {
    collectionId: value.collectionId,
    canisterId: value.canisterId,
    appCanisterId: value.appCanisterId,
    controllers: value.controllers,
  };
}

function fromRawCollectionCycleTopUpQuote(
  value: RawCollectionCycleTopUpQuote,
): CollectionCycleTopUpQuote {
  return {
    cyclesToTopUp: value.cyclesToTopUp,
    cycleCostE8s: value.cycleCostE8s,
    ledgerFeeE8s: value.ledgerFeeE8s,
    totalUserDebitE8s: value.totalUserDebitE8s,
    xdrPermyriadPerIcp: value.xdrPermyriadPerIcp,
    rateTimestampSeconds: value.rateTimestampSeconds,
  };
}

function fromRawAppCanisterKind(value: RawAppCanisterKind): AppCanisterKind {
  return "Backend" in value ? "Backend" : "Frontend";
}

function fromRawAppCanisterHealth(
  value: RawAppCanisterHealth,
): AppCanisterHealth {
  return {
    kind: fromRawAppCanisterKind(value.kind),
    canisterId: value.canisterId,
    cycles: fromRawOption(value.cycles),
    moduleInstalled: fromRawOption(value.moduleInstalled),
    freezingThresholdSeconds: fromRawOption(value.freezingThresholdSeconds),
    idleCyclesBurnedPerDay: fromRawOption(value.idleCyclesBurnedPerDay),
    error: fromRawOption(value.error),
  };
}

function fromRawMintReceipt(value: RawMintReceipt): MintReceipt {
  return {
    nft: fromRawWalletNFT(value.nft),
    paymentBlock: value.paymentBlock,
  };
}

function fromRawPendingMintPaymentStatus(
  value: RawPendingMintPaymentStatus,
): PendingMintPaymentStatus {
  if ("PaymentPending" in value) return "PaymentPending";
  if ("PaymentSent" in value) return "PaymentSent";
  if ("Minted" in value) return "Minted";
  return "Failed";
}

function fromRawPendingMintPaymentView(
  value: RawPendingMintPaymentView,
): PendingMintPaymentView {
  return {
    id: value.id,
    collectionId: value.collectionId,
    amountE8s: value.amountE8s,
    paymentBlock: fromRawOption(value.paymentBlock),
    mintedTokenId: fromRawOption(value.mintedTokenId),
    status: fromRawPendingMintPaymentStatus(value.status),
    createdAt: value.createdAt,
    updatedAt: value.updatedAt,
    lastError: fromRawOption(value.lastError),
  };
}

function fromRawCollectionCreationReceipt(
  value: RawCollectionCreationReceipt,
): CollectionCreationReceipt {
  return {
    collection: fromRawCollection(value.collection),
    paymentBlock: value.paymentBlock,
  };
}

function fromRawCollectionCycleTopUpReceipt(
  value: RawCollectionCycleTopUpReceipt,
): CollectionCycleTopUpReceipt {
  return {
    collectionId: value.collectionId,
    canisterId: value.canisterId,
    cyclesRequested: value.cyclesRequested,
    cyclesMinted: value.cyclesMinted,
    cycleCostE8s: value.cycleCostE8s,
    totalUserDebitE8s: value.totalUserDebitE8s,
    paymentBlock: value.paymentBlock,
    cycleBalance: fromRawOption(value.cycleBalance),
  };
}

function fromRawAppCycleTopUpReceipt(
  value: RawAppCycleTopUpReceipt,
): AppCycleTopUpReceipt {
  return {
    canisterId: value.canisterId,
    cyclesRequested: value.cyclesRequested,
    cyclesMinted: value.cyclesMinted,
    cycleCostE8s: value.cycleCostE8s,
    totalUserDebitE8s: value.totalUserDebitE8s,
    paymentBlock: value.paymentBlock,
    cycleBalance: fromRawOption(value.cycleBalance),
  };
}

function fromRawCollectionDividendInfo(
  value: RawCollectionDividendInfo,
): CollectionDividendInfo {
  return {
    collectionId: value.collectionId,
    enabled: value.enabled,
    accountId: value.accountId,
    balanceE8s: value.balanceE8s,
    distributableBalanceE8s: value.distributableBalanceE8s,
    feeReserveE8s: value.feeReserveE8s,
    processedBalanceE8s: value.processedBalanceE8s,
    pendingE8s: value.pendingE8s,
    nftCount: value.nftCount,
  };
}

function fromRawNFTDividend(value: RawNFTDividend): NFTDividend {
  return {
    nft: fromRawWalletNFT(value.nft),
    collection: fromRawCollection(value.collection),
    claimableE8s: value.claimableE8s,
  };
}

function fromRawNFTDividendPage(value: RawNFTDividendPage): NFTDividendPage {
  return {
    dividends: value.dividends.map(fromRawNFTDividend),
    nextCursor: fromRawOption(value.nextCursor),
    totalCount: value.totalCount,
  };
}

function fromRawDividendBalancePage(
  value: RawDividendBalancePage,
): DividendBalancePage {
  return {
    balances: value.balances,
    nextCursor: fromRawOption(value.nextCursor),
    totalCount: value.totalCount,
  };
}

function fromRawDividendSyncReceipt(
  value: RawDividendSyncReceipt,
): DividendSyncReceipt {
  return {
    collectionId: value.collectionId,
    depositedE8s: value.depositedE8s,
    distributedE8s: value.distributedE8s,
    shareE8s: value.shareE8s,
    remainderE8s: value.remainderE8s,
    nftCount: value.nftCount,
    balanceE8s: value.balanceE8s,
  };
}

function fromRawDividendClaimReceipt(
  value: RawDividendClaimReceipt,
): DividendClaimReceipt {
  return {
    nft: fromRawWalletNFT(value.nft),
    collection: fromRawCollection(value.collection),
    paidE8s: value.paidE8s,
    feeE8s: value.feeE8s,
    blockIndex: value.blockIndex,
  };
}

function fromRawDividendDisbursementPreview(
  value: RawDividendDisbursementPreview,
): DividendDisbursementPreview {
  return {
    collectionId: value.collectionId,
    accountId: value.accountId,
    balanceE8s: value.balanceE8s,
    distributableBalanceE8s: value.distributableBalanceE8s,
    processedBalanceE8s: value.processedBalanceE8s,
    pendingE8s: value.pendingE8s,
    projectedPendingE8s: value.projectedPendingE8s,
    undistributedE8s: value.undistributedE8s,
    shareE8s: value.shareE8s,
    remainderE8s: value.remainderE8s,
    nftCount: value.nftCount,
    transferCount: value.transferCount,
    ledgerFeeE8s: value.ledgerFeeE8s,
    requiredNetworkFeeE8s: value.requiredNetworkFeeE8s,
    feeReserveE8s: value.feeReserveE8s,
    feeShortfallE8s: value.feeShortfallE8s,
    callerBalanceE8s: value.callerBalanceE8s,
    callerFundingTransferFeeE8s: value.callerFundingTransferFeeE8s,
    callerTotalDebitE8s: value.callerTotalDebitE8s,
    maxTransfersPerCall: value.maxTransfersPerCall,
  };
}

function fromRawDividendDisbursementReceipt(
  value: RawDividendDisbursementReceipt,
): DividendDisbursementReceipt {
  return {
    collectionId: value.collectionId,
    synced: fromRawDividendSyncReceipt(value.synced),
    paidCount: value.paidCount,
    skippedCount: value.skippedCount,
    remainingCount: value.remainingCount,
    totalPaidE8s: value.totalPaidE8s,
    totalFeeE8s: value.totalFeeE8s,
    feeTopUpE8s: value.feeTopUpE8s,
    feeTopUpBlockIndex: fromRawOption(value.feeTopUpBlockIndex),
    feeReserveRemainingE8s: value.feeReserveRemainingE8s,
    failures: value.failures,
  };
}

function fromRawTransferError(value: RawTransferError): TransferError {
  if ("TxTooOld" in value)
    return { __kind__: "TxTooOld", TxTooOld: value.TxTooOld };
  if ("BadFee" in value) return { __kind__: "BadFee", BadFee: value.BadFee };
  if ("TxDuplicate" in value)
    return { __kind__: "TxDuplicate", TxDuplicate: value.TxDuplicate };
  if ("TxCreatedInFuture" in value) {
    return { __kind__: "TxCreatedInFuture", TxCreatedInFuture: null };
  }
  return {
    __kind__: "InsufficientFunds",
    InsufficientFunds: value.InsufficientFunds,
  };
}

function fromRawTransferResult(value: RawTransferResult): TransferResult {
  if ("Ok" in value) return { __kind__: "Ok", Ok: value.Ok };
  return { __kind__: "Err", Err: fromRawTransferError(value.Err) };
}

function fromWalletResult(
  value: { ok: RawWalletNFT } | { err: string },
): { __kind__: "ok"; ok: WalletNFT } | { __kind__: "err"; err: string } {
  if ("ok" in value) {
    return { __kind__: "ok", ok: fromRawWalletNFT(value.ok) };
  }
  return { __kind__: "err", err: value.err };
}

function fromTextResult(
  value: { ok: string } | { err: string },
): { __kind__: "ok"; ok: string } | { __kind__: "err"; err: string } {
  if ("ok" in value) return { __kind__: "ok", ok: value.ok };
  return { __kind__: "err", err: value.err };
}

function fromMintResult(
  value: { ok: RawMintReceipt } | { err: string },
): { __kind__: "ok"; ok: MintReceipt } | { __kind__: "err"; err: string } {
  if ("ok" in value) {
    return { __kind__: "ok", ok: fromRawMintReceipt(value.ok) };
  }
  return { __kind__: "err", err: value.err };
}

function fromCollectionCreationResult(
  value: { ok: RawCollectionCreationReceipt } | { err: string },
):
  | { __kind__: "ok"; ok: CollectionCreationReceipt }
  | { __kind__: "err"; err: string } {
  if ("ok" in value) {
    return { __kind__: "ok", ok: fromRawCollectionCreationReceipt(value.ok) };
  }
  return { __kind__: "err", err: value.err };
}

function fromCollectionCreationRequestViewResult(
  value: { ok: RawCollectionCreationRequestView } | { err: string },
):
  | { __kind__: "ok"; ok: CollectionCreationRequestView }
  | { __kind__: "err"; err: string } {
  if ("ok" in value) {
    return {
      __kind__: "ok",
      ok: fromRawCollectionCreationRequestView(value.ok),
    };
  }
  return { __kind__: "err", err: value.err };
}

function fromCollectionCreationRequestPageResult(
  value: { ok: RawCollectionCreationRequestPage } | { err: string },
):
  | { __kind__: "ok"; ok: CollectionCreationRequestPage }
  | { __kind__: "err"; err: string } {
  if ("ok" in value) {
    return {
      __kind__: "ok",
      ok: fromRawCollectionCreationRequestPage(value.ok),
    };
  }
  return { __kind__: "err", err: value.err };
}

function fromCollectionCreationDiagnosticsResult(
  value: { ok: RawCollectionCreationDiagnostics } | { err: string },
):
  | { __kind__: "ok"; ok: CollectionCreationDiagnostics }
  | { __kind__: "err"; err: string } {
  if ("ok" in value) {
    return {
      __kind__: "ok",
      ok: fromRawCollectionCreationDiagnostics(value.ok),
    };
  }
  return { __kind__: "err", err: value.err };
}

function fromBooleanResult(
  value: { ok: boolean } | { err: string },
): { __kind__: "ok"; ok: boolean } | { __kind__: "err"; err: string } {
  if ("ok" in value) {
    return { __kind__: "ok", ok: value.ok };
  }
  return { __kind__: "err", err: value.err };
}

function fromCollectionCycleTopUpResult(
  value: { ok: RawCollectionCycleTopUpReceipt } | { err: string },
):
  | { __kind__: "ok"; ok: CollectionCycleTopUpReceipt }
  | { __kind__: "err"; err: string } {
  if ("ok" in value) {
    return { __kind__: "ok", ok: fromRawCollectionCycleTopUpReceipt(value.ok) };
  }
  return { __kind__: "err", err: value.err };
}

function fromAppCycleTopUpResult(
  value: { ok: RawAppCycleTopUpReceipt } | { err: string },
):
  | { __kind__: "ok"; ok: AppCycleTopUpReceipt }
  | { __kind__: "err"; err: string } {
  if ("ok" in value) {
    return { __kind__: "ok", ok: fromRawAppCycleTopUpReceipt(value.ok) };
  }
  return { __kind__: "err", err: value.err };
}

function fromAppCanisterHealthResult(
  value: { ok: Array<RawAppCanisterHealth> } | { err: string },
):
  | { __kind__: "ok"; ok: Array<AppCanisterHealth> }
  | { __kind__: "err"; err: string } {
  if ("ok" in value) {
    return {
      __kind__: "ok",
      ok: value.ok.map(fromRawAppCanisterHealth),
    };
  }
  return { __kind__: "err", err: value.err };
}

function fromCollectionResult(
  value: { ok: RawCollection } | { err: string },
): { __kind__: "ok"; ok: Collection } | { __kind__: "err"; err: string } {
  if ("ok" in value) {
    return { __kind__: "ok", ok: fromRawCollection(value.ok) };
  }
  return { __kind__: "err", err: value.err };
}

function fromCollectionCanisterControllersResult(
  value: { ok: RawCollectionCanisterControllers } | { err: string },
):
  | { __kind__: "ok"; ok: CollectionCanisterControllers }
  | { __kind__: "err"; err: string } {
  if ("ok" in value) {
    return {
      __kind__: "ok",
      ok: fromRawCollectionCanisterControllers(value.ok),
    };
  }
  return { __kind__: "err", err: value.err };
}

function fromDividendSyncResult(
  value: { ok: RawDividendSyncReceipt } | { err: string },
):
  | { __kind__: "ok"; ok: DividendSyncReceipt }
  | { __kind__: "err"; err: string } {
  if ("ok" in value) {
    return { __kind__: "ok", ok: fromRawDividendSyncReceipt(value.ok) };
  }
  return { __kind__: "err", err: value.err };
}

function fromDividendClaimResult(
  value: { ok: RawDividendClaimReceipt } | { err: string },
):
  | { __kind__: "ok"; ok: DividendClaimReceipt }
  | { __kind__: "err"; err: string } {
  if ("ok" in value) {
    return { __kind__: "ok", ok: fromRawDividendClaimReceipt(value.ok) };
  }
  return { __kind__: "err", err: value.err };
}

function fromDividendDisbursementPreviewResult(
  value: { ok: RawDividendDisbursementPreview } | { err: string },
):
  | { __kind__: "ok"; ok: DividendDisbursementPreview }
  | { __kind__: "err"; err: string } {
  if ("ok" in value) {
    return {
      __kind__: "ok",
      ok: fromRawDividendDisbursementPreview(value.ok),
    };
  }
  return { __kind__: "err", err: value.err };
}

function fromDividendDisbursementResult(
  value: { ok: RawDividendDisbursementReceipt } | { err: string },
):
  | { __kind__: "ok"; ok: DividendDisbursementReceipt }
  | { __kind__: "err"; err: string } {
  if ("ok" in value) {
    return {
      __kind__: "ok",
      ok: fromRawDividendDisbursementReceipt(value.ok),
    };
  }
  return { __kind__: "err", err: value.err };
}

function fromPreviewResult(
  value: { ok: Array<RawWalletNFT> } | { err: string },
): { __kind__: "ok"; ok: Array<WalletNFT> } | { __kind__: "err"; err: string } {
  if ("ok" in value) {
    return { __kind__: "ok", ok: value.ok.map(fromRawWalletNFT) };
  }
  return { __kind__: "err", err: value.err };
}

function fromSyncResult(
  value: { ok: { errors: Array<string>; newCount: bigint } } | { err: string },
):
  | { __kind__: "ok"; ok: { errors: Array<string>; newCount: bigint } }
  | { __kind__: "err"; err: string } {
  if ("ok" in value) {
    return { __kind__: "ok", ok: value.ok };
  }
  return { __kind__: "err", err: value.err };
}

function fromSyncV2Result(
  value: { ok: RawWalletSyncV2Result } | { err: string },
):
  | { __kind__: "ok"; ok: WalletSyncV2Result }
  | { __kind__: "err"; err: string } {
  if ("ok" in value) {
    return { __kind__: "ok", ok: fromRawWalletSyncV2Result(value.ok) };
  }
  return { __kind__: "err", err: value.err };
}

function fromSyncPageResult(
  value: { ok: RawWalletSyncPageResult } | { err: string },
):
  | { __kind__: "ok"; ok: WalletSyncPageResult }
  | { __kind__: "err"; err: string } {
  if ("ok" in value) {
    return { __kind__: "ok", ok: fromRawWalletSyncPageResult(value.ok) };
  }
  return { __kind__: "err", err: value.err };
}

function fromCollectionIndexPageResult(
  value: { ok: RawCollectionIndexPageResult } | { err: string },
):
  | { __kind__: "ok"; ok: CollectionIndexPageResult }
  | { __kind__: "err"; err: string } {
  if ("ok" in value) {
    return { __kind__: "ok", ok: fromRawCollectionIndexPageResult(value.ok) };
  }
  return { __kind__: "err", err: value.err };
}

const PUBLIC_LIST_PAGE_SIZE = 100n;
const ADMIN_LIST_PAGE_SIZE = 100n;

export class Backend implements backendInterface {
  constructor(
    private readonly actor: ActorSubclass<any>,
    _uploadFile: (file: ExternalBlob) => Promise<Uint8Array>,
    _downloadFile: (file: Uint8Array) => Promise<ExternalBlob>,
    private readonly agent: Agent,
    private readonly processError?: (error: unknown) => never,
  ) {
    void _uploadFile;
    void _downloadFile;
  }

  getAgent(): Agent {
    return this.agent;
  }

  private async run<T>(operation: () => Promise<T>): Promise<T> {
    if (!this.processError) {
      return operation();
    }
    try {
      return await operation();
    } catch (error) {
      this.processError(error);
      throw new Error("unreachable");
    }
  }

  async addCollection(
    name: string,
    description: string,
    canisterId: Principal,
    standard: NFTStandard,
    imageUrl: string,
    symbol: string,
    browseInfo: CollectionBrowseInfo | null,
  ): Promise<Collection> {
    return fromRawCollection(
      await this.run(() =>
        this.actor.addCollection(
          name,
          description,
          canisterId,
          toRawNFTStandard(standard),
          imageUrl,
          symbol,
          toRawOption(
            browseInfo == null ? null : toRawCollectionBrowseInfo(browseInfo),
          ),
        ),
      ),
    );
  }

  async bootstrapAdmin(): Promise<void> {
    return this.run(() => this.actor.bootstrapAdmin());
  }

  async buyFixedListing(listingId: ListingId): Promise<void> {
    return this.run(() => this.actor.buyFixedListing(listingId));
  }

  async cancelListing(listingId: ListingId): Promise<void> {
    return this.run(() => this.actor.cancelListing(listingId));
  }

  async claimVaultDeposit(
    collectionId: CollectionId,
    tokenId: string,
  ): Promise<
    { __kind__: "ok"; ok: WalletNFT } | { __kind__: "err"; err: string }
  > {
    return fromWalletResult(
      await this.run(() => this.actor.claimVaultDeposit(collectionId, tokenId)),
    );
  }

  async configureMarketplaceFeeRecipient(
    recipient: AccountIdentifier | null,
  ): Promise<MarketplaceFeeConfig> {
    return fromRawMarketplaceFeeConfig(
      await this.run(() =>
        this.actor.configureMarketplaceFeeRecipient(toRawOption(recipient)),
      ),
    );
  }

  async configureMarketplaceFee(
    recipient: AccountIdentifier | null,
    mintlabFeeBasisPoints: bigint,
  ): Promise<MarketplaceFeeConfig> {
    return fromRawMarketplaceFeeConfig(
      await this.run(() =>
        this.actor.configureMarketplaceFee(
          toRawOption(recipient),
          mintlabFeeBasisPoints,
        ),
      ),
    );
  }

  async configureMinting(
    name: string,
    description: string,
    symbol: string,
    imageUrl: string,
    collectionCreationPayoutAccount: AccountIdentifier | null,
    collectionCreationSecondaryPayoutAccount: AccountIdentifier | null,
    collectionCreationPrimaryPayoutBasisPoints: bigint,
    collectionCreationSecondaryPayoutBasisPoints: bigint,
    collectionCreationPriceE8s: bigint,
    collectionCreationEnabled: boolean,
    mainMintPayoutAccount: AccountIdentifier | null,
    mainMintPriceE8s: bigint,
    mainMintEnabled: boolean,
    mainMintDividendsEnabled: boolean,
    collectionCanisterCycles: bigint,
  ): Promise<Collection> {
    return fromRawCollection(
      await this.run(() =>
        this.actor.configureMinting(
          name,
          description,
          symbol,
          imageUrl,
          toRawOption(collectionCreationPayoutAccount),
          toRawOption(collectionCreationSecondaryPayoutAccount),
          collectionCreationPrimaryPayoutBasisPoints,
          collectionCreationSecondaryPayoutBasisPoints,
          collectionCreationPriceE8s,
          collectionCreationEnabled,
          toRawOption(mainMintPayoutAccount),
          mainMintPriceE8s,
          mainMintEnabled,
          mainMintDividendsEnabled,
          collectionCanisterCycles,
        ),
      ),
    );
  }

  async configureModeration(
    enabled: boolean,
    apiKey: string | null,
    clearApiKey: boolean,
    model: string,
    categories: ModerationCategorySettings,
    userMessage: string,
  ): Promise<PublicModerationConfig> {
    return fromRawPublicModerationConfig(
      await this.run(() =>
        this.actor.configureModeration(
          enabled,
          toRawOption(apiKey),
          clearApiKey,
          model,
          toRawModerationCategories(categories),
          userMessage,
        ),
      ),
    );
  }

  async adminRecoverPaidCollectionCreation(
    owner: Principal,
    cyclePaymentBlock: bigint,
    name: string,
    description: string,
    symbol: string,
    imageUrl: string,
    dividendsEnabled: boolean,
  ): Promise<
    | { __kind__: "ok"; ok: CollectionCreationReceipt }
    | { __kind__: "err"; err: string }
  > {
    return fromCollectionCreationResult(
      await this.run(() =>
        this.actor.adminRecoverPaidCollectionCreation(
          owner,
          cyclePaymentBlock,
          name,
          description,
          symbol,
          imageUrl,
          dividendsEnabled,
        ),
      ),
    );
  }

  async adminDeleteCollectionCreationRequest(
    requestId: bigint,
  ): Promise<
    { __kind__: "ok"; ok: boolean } | { __kind__: "err"; err: string }
  > {
    return fromBooleanResult(
      await this.run(() =>
        this.actor.adminDeleteCollectionCreationRequest(requestId),
      ),
    );
  }

  async adminGetSettlementEscrowRepairQuote(
    listingId: ListingId,
  ): Promise<SettlementEscrowRepairQuote> {
    return fromRawSettlementEscrowRepairQuote(
      await this.run(() =>
        this.actor.adminGetSettlementEscrowRepairQuote(listingId),
      ),
    );
  }

  async adminGetMintlabFeeRecoveryQuote(
    listingId: ListingId,
  ): Promise<MintlabFeeRecoveryQuote> {
    return fromRawMintlabFeeRecoveryQuote(
      await this.run(() =>
        this.actor.adminGetMintlabFeeRecoveryQuote(listingId),
      ),
    );
  }

  async adminResetUnresolvedMintlabFeeAttempt(
    listingId: ListingId,
  ): Promise<MintlabFeeRecoveryQuote> {
    return fromRawMintlabFeeRecoveryQuote(
      await this.run(() =>
        this.actor.adminResetUnresolvedMintlabFeeAttempt(listingId),
      ),
    );
  }

  async adminMarkMintlabFeeBalanceVerified(
    listingId: ListingId,
  ): Promise<MintlabFeeRecoveryQuote> {
    return fromRawMintlabFeeRecoveryQuote(
      await this.run(() =>
        this.actor.adminMarkMintlabFeeBalanceVerified(listingId),
      ),
    );
  }

  async adminRetryListingReturn(listingId: ListingId): Promise<void> {
    return this.run(() => this.actor.adminRetryListingReturn(listingId));
  }

  async adminRetryNoBidAuctionReturn(listingId: ListingId): Promise<void> {
    return this.run(() => this.actor.adminRetryNoBidAuctionReturn(listingId));
  }

  async adminRetryAuctionSettlement(listingId: ListingId): Promise<void> {
    return this.run(() => this.actor.adminRetryAuctionSettlement(listingId));
  }

  async adminRetryFixedPurchaseSettlement(listingId: ListingId): Promise<void> {
    return this.run(() =>
      this.actor.adminRetryFixedPurchaseSettlement(listingId),
    );
  }

  async adminTopUpSettlementEscrow(
    listingId: ListingId,
    amount: bigint,
  ): Promise<SettlementEscrowTopUpReceipt> {
    return fromRawSettlementEscrowTopUpReceipt(
      await this.run(() =>
        this.actor.adminTopUpSettlementEscrow(listingId, amount),
      ),
    );
  }

  async createAuctionListing(
    nftId: NFTId,
    startingBid: bigint,
    endTime: bigint,
  ): Promise<AuctionListing> {
    return fromRawAuctionListing(
      await this.run(() =>
        this.actor.createAuctionListing(nftId, startingBid, endTime),
      ),
    );
  }

  async createUserCollection(
    name: string,
    description: string,
    symbol: string,
    imageUrl: string,
    dividendsEnabled: boolean,
  ): Promise<
    | { __kind__: "ok"; ok: CollectionCreationReceipt }
    | { __kind__: "err"; err: string }
  > {
    return fromCollectionCreationResult(
      await this.run(() =>
        this.actor.createUserCollection(
          name,
          description,
          symbol,
          imageUrl,
          dividendsEnabled,
        ),
      ),
    );
  }

  async createFixedListing(nftId: NFTId, price: bigint): Promise<FixedListing> {
    return fromRawFixedListing(
      await this.run(() => this.actor.createFixedListing(nftId, price)),
    );
  }

  async quoteCollectionCreationCost(
    collectionCanisterCycles: bigint,
    collectionCreationPriceE8s: bigint,
    collectionCreationPrimaryPayoutBasisPoints: bigint,
    collectionCreationSecondaryPayoutBasisPoints: bigint,
  ): Promise<CollectionCreationQuote> {
    return fromRawCollectionCreationQuote(
      await this.run(() =>
        this.actor.quoteCollectionCreationCost(
          collectionCanisterCycles,
          collectionCreationPriceE8s,
          collectionCreationPrimaryPayoutBasisPoints,
          collectionCreationSecondaryPayoutBasisPoints,
        ),
      ),
    );
  }

  async quoteCollectionCycleTopUp(
    cyclesToTopUp: bigint,
  ): Promise<CollectionCycleTopUpQuote> {
    return fromRawCollectionCycleTopUpQuote(
      await this.run(() => this.actor.quoteCollectionCycleTopUp(cyclesToTopUp)),
    );
  }

  async quoteAppCanisterCycleTopUp(
    cyclesToTopUp: bigint,
  ): Promise<CollectionCycleTopUpQuote> {
    return fromRawCollectionCycleTopUpQuote(
      await this.run(() =>
        this.actor.quoteAppCanisterCycleTopUp(cyclesToTopUp),
      ),
    );
  }

  async getAppCanisterHealth(
    frontendCanisterId: Principal | null,
  ): Promise<
    | { __kind__: "ok"; ok: Array<AppCanisterHealth> }
    | { __kind__: "err"; err: string }
  > {
    return fromAppCanisterHealthResult(
      await this.run(() =>
        this.actor.getAppCanisterHealth(toRawOption(frontendCanisterId)),
      ),
    );
  }

  async getAllCollectionCreationRequests(): Promise<
    | { __kind__: "ok"; ok: Array<CollectionCreationRequestView> }
    | { __kind__: "err"; err: string }
  > {
    const requests: Array<CollectionCreationRequestView> = [];
    let cursor: bigint | null = null;
    do {
      const page = await this.getAllCollectionCreationRequestsPage(
        cursor,
        ADMIN_LIST_PAGE_SIZE,
      );
      if (page.__kind__ === "err") return page;
      requests.push(...page.ok.requests);
      cursor = page.ok.nextCursor;
    } while (cursor !== null);
    return { __kind__: "ok", ok: requests };
  }

  async getAllCollectionCreationRequestsPage(
    cursor: bigint | null,
    limit: bigint | null,
  ): Promise<
    | { __kind__: "ok"; ok: CollectionCreationRequestPage }
    | { __kind__: "err"; err: string }
  > {
    return fromCollectionCreationRequestPageResult(
      await this.run(() =>
        this.actor.getAllCollectionCreationRequestsPage(
          toRawOption(cursor),
          toRawOption(limit),
        ),
      ),
    );
  }

  async getCollectionCreationDiagnostics(
    requestId: bigint,
  ): Promise<
    | { __kind__: "ok"; ok: CollectionCreationDiagnostics }
    | { __kind__: "err"; err: string }
  > {
    return fromCollectionCreationDiagnosticsResult(
      await this.run(() =>
        this.actor.getCollectionCreationDiagnostics(requestId),
      ),
    );
  }

  async claimNFTDividend(
    nftId: NFTId,
  ): Promise<
    | { __kind__: "ok"; ok: DividendClaimReceipt }
    | { __kind__: "err"; err: string }
  > {
    return fromDividendClaimResult(
      await this.run(() => this.actor.claimNFTDividend(nftId)),
    );
  }

  async disburseCollectionDividends(
    collectionId: CollectionId,
    maxTransfers: bigint | null = null,
  ): Promise<
    | { __kind__: "ok"; ok: DividendDisbursementReceipt }
    | { __kind__: "err"; err: string }
  > {
    return fromDividendDisbursementResult(
      await this.run(() =>
        this.actor.disburseCollectionDividends(
          collectionId,
          toRawOption(maxTransfers),
        ),
      ),
    );
  }

  async getActiveListingDetails(): Promise<Array<ActiveListingDetail>> {
    const details: Array<ActiveListingDetail> = [];
    let cursor: bigint | null = null;
    do {
      const page = await this.getActiveListingDetailsPage(
        cursor,
        PUBLIC_LIST_PAGE_SIZE,
      );
      details.push(...page.details);
      cursor = page.nextCursor;
    } while (cursor !== null);
    return details;
  }

  async getActiveListingDetailsPage(
    cursor: bigint | null,
    limit: bigint | null,
  ): Promise<ActiveListingDetailPage> {
    return fromRawActiveListingDetailPage(
      await this.run(() =>
        this.actor.getActiveListingDetailsPage(
          toRawOption(cursor),
          toRawOption(limit),
        ),
      ),
    );
  }

  async getActiveListings(): Promise<Array<ActiveListing>> {
    const listings: Array<ActiveListing> = [];
    let cursor: bigint | null = null;
    do {
      const page = await this.getActiveListingsPage(
        cursor,
        PUBLIC_LIST_PAGE_SIZE,
      );
      listings.push(...page.listings);
      cursor = page.nextCursor;
    } while (cursor !== null);
    return listings;
  }

  async getActiveListingsPage(
    cursor: bigint | null,
    limit: bigint | null,
  ): Promise<ActiveListingPage> {
    return fromRawActiveListingPage(
      await this.run(() =>
        this.actor.getActiveListingsPage(
          toRawOption(cursor),
          toRawOption(limit),
        ),
      ),
    );
  }

  async getMyMarketplaceSettlementStatuses(): Promise<Array<SettlementStatus>> {
    const result = (await this.run(() =>
      this.actor.getMyMarketplaceSettlementStatuses(),
    )) as Array<RawSettlementStatus>;
    return result.map(fromRawSettlementStatus);
  }

  async getMyAuctionBidStatuses(
    listingIds: Array<ListingId>,
  ): Promise<Array<AuctionBidStatus>> {
    const result = (await this.run(() =>
      this.actor.getMyAuctionBidStatuses(listingIds),
    )) as Array<RawAuctionBidStatus>;
    return result.map(fromRawAuctionBidStatus);
  }

  async getAdminPrincipal(): Promise<Principal | null> {
    return fromRawOption(await this.run(() => this.actor.getAdminPrincipal()));
  }

  async getCollection(id: CollectionId): Promise<Collection | null> {
    const result = (await this.run(() => this.actor.getCollection(id))) as
      | []
      | [RawCollection];
    const value = fromRawOption(result);
    return value == null ? null : fromRawCollection(value);
  }

  async getCollectionBrowseStats(
    collectionId: CollectionId,
  ): Promise<CollectionBrowseStats> {
    return fromRawCollectionBrowseStats(
      await this.run(() => this.actor.getCollectionBrowseStats(collectionId)),
    );
  }

  async getCollectionCreator(
    collectionId: CollectionId,
  ): Promise<Principal | null> {
    return fromRawOption(
      await this.run(() => this.actor.getCollectionCreator(collectionId)),
    );
  }

  async getCollectionDividendAccountId(
    collectionId: CollectionId,
  ): Promise<AccountIdentifier> {
    return this.run(() =>
      this.actor.getCollectionDividendAccountId(collectionId),
    );
  }

  async getCollectionDividendBalances(
    collectionId: CollectionId,
  ): Promise<Array<[string, bigint]>> {
    const balances: Array<[string, bigint]> = [];
    let cursor: bigint | null = null;
    do {
      const page = await this.getCollectionDividendBalancesPage(
        collectionId,
        cursor,
        PUBLIC_LIST_PAGE_SIZE,
      );
      balances.push(...page.balances);
      cursor = page.nextCursor;
    } while (cursor !== null);
    return balances;
  }

  async getCollectionDividendBalancesPage(
    collectionId: CollectionId,
    cursor: bigint | null,
    limit: bigint | null,
  ): Promise<DividendBalancePage> {
    return fromRawDividendBalancePage(
      await this.run(() =>
        this.actor.getCollectionDividendBalancesPage(
          collectionId,
          toRawOption(cursor),
          toRawOption(limit),
        ),
      ),
    );
  }

  async refreshCollectionDividendBalances(
    collectionId: CollectionId,
  ): Promise<Array<[string, bigint]>> {
    const balances: Array<[string, bigint]> = [];
    let cursor: bigint | null = null;
    do {
      const page = await this.refreshCollectionDividendBalancesPage(
        collectionId,
        cursor,
        PUBLIC_LIST_PAGE_SIZE,
      );
      balances.push(...page.balances);
      cursor = page.nextCursor;
    } while (cursor !== null);
    return balances;
  }

  async refreshCollectionDividendBalancesPage(
    collectionId: CollectionId,
    cursor: bigint | null,
    limit: bigint | null,
  ): Promise<DividendBalancePage> {
    return fromRawDividendBalancePage(
      await this.run(() =>
        this.actor.refreshCollectionDividendBalancesPage(
          collectionId,
          toRawOption(cursor),
          toRawOption(limit),
        ),
      ),
    );
  }

  async getCollectionDividendInfo(
    collectionId: CollectionId,
  ): Promise<CollectionDividendInfo | null> {
    const result = (await this.run(() =>
      this.actor.getCollectionDividendInfo(collectionId),
    )) as [] | [RawCollectionDividendInfo];
    const value = fromRawOption(result);
    return value == null ? null : fromRawCollectionDividendInfo(value);
  }

  async getCollectionIndexStatus(
    collectionId: CollectionId,
  ): Promise<CollectionIndexStatus | null> {
    const result = (await this.run(() =>
      this.actor.getCollectionIndexStatus(collectionId),
    )) as [] | [RawCollectionIndexStatus];
    const value = fromRawOption(result);
    return value == null ? null : fromRawCollectionIndexStatus(value);
  }

  async getCollectionNFT(
    collectionId: CollectionId,
    tokenId: string,
  ): Promise<WalletNFT | null> {
    const result = (await this.run(() =>
      this.actor.getCollectionNFT(collectionId, tokenId),
    )) as [] | [RawWalletNFT];
    const value = fromRawOption(result);
    return value == null ? null : fromRawWalletNFT(value);
  }

  async lookupCollectionNFT(
    collectionId: CollectionId,
    tokenId: string,
  ): Promise<CollectionNFTLookupResult> {
    return fromRawCollectionNFTLookupResult(
      (await this.run(() =>
        this.actor.lookupCollectionNFT(collectionId, tokenId),
      )) as RawCollectionNFTLookupResult,
    );
  }

  async getCollectionNFTPage(
    collectionId: CollectionId,
    cursor: string | null,
    limit: bigint | null,
  ): Promise<CollectionNFTPage> {
    return fromRawCollectionNFTPage(
      await this.run(() =>
        this.actor.getCollectionNFTPage(
          collectionId,
          toRawOption(cursor),
          toRawOption(limit),
        ),
      ),
    );
  }

  async getCollectionNFTs(
    collectionId: CollectionId,
  ): Promise<Array<WalletNFT>> {
    const result = (await this.run(() =>
      this.actor.getCollectionNFTs(collectionId),
    )) as Array<RawWalletNFT>;
    return result.map(fromRawWalletNFT);
  }

  async getMarketplaceFeeConfig(): Promise<MarketplaceFeeConfig> {
    return fromRawMarketplaceFeeConfig(
      await this.run(() => this.actor.getMarketplaceFeeConfig()),
    );
  }

  async getMintConfig(): Promise<MintConfig> {
    return fromRawMintConfig(await this.run(() => this.actor.getMintConfig()));
  }

  async getModerationConfig(): Promise<PublicModerationConfig> {
    return fromRawPublicModerationConfig(
      await this.run(() => this.actor.getModerationConfig()),
    );
  }

  async getMyCollectionCreationRequests(): Promise<
    Array<CollectionCreationRequestView>
  > {
    const requests: Array<CollectionCreationRequestView> = [];
    let cursor: bigint | null = null;
    do {
      const page = await this.getMyCollectionCreationRequestsPage(
        cursor,
        PUBLIC_LIST_PAGE_SIZE,
      );
      requests.push(...page.requests);
      cursor = page.nextCursor;
    } while (cursor !== null);
    return requests;
  }

  async getMyCollectionCreationRequestsPage(
    cursor: bigint | null,
    limit: bigint | null,
  ): Promise<CollectionCreationRequestPage> {
    return fromRawCollectionCreationRequestPage(
      await this.run(() =>
        this.actor.getMyCollectionCreationRequestsPage(
          toRawOption(cursor),
          toRawOption(limit),
        ),
      ),
    );
  }

  async getMyDividendNFTs(): Promise<Array<NFTDividend>> {
    const dividends: Array<NFTDividend> = [];
    let cursor: bigint | null = null;
    do {
      const page = await this.getMyDividendNFTsPage(
        cursor,
        PUBLIC_LIST_PAGE_SIZE,
      );
      dividends.push(...page.dividends);
      cursor = page.nextCursor;
    } while (cursor !== null);
    return dividends;
  }

  async getMyDividendNFTsPage(
    cursor: bigint | null,
    limit: bigint | null,
  ): Promise<NFTDividendPage> {
    return fromRawNFTDividendPage(
      await this.run(() =>
        this.actor.getMyDividendNFTsPage(
          toRawOption(cursor),
          toRawOption(limit),
        ),
      ),
    );
  }

  async getMyPendingAuctionRefunds(): Promise<Array<AuctionEscrow>> {
    const result = (await this.run(() =>
      this.actor.getMyPendingAuctionRefunds(),
    )) as Array<RawAuctionEscrow>;
    return result.map(fromRawAuctionEscrow);
  }

  async getMyPendingMintPayments(): Promise<Array<PendingMintPaymentView>> {
    const result = (await this.run(() =>
      this.actor.getMyPendingMintPayments(),
    )) as Array<RawPendingMintPaymentView>;
    return result.map(fromRawPendingMintPaymentView);
  }

  async refreshMyDividendNFTs(): Promise<Array<NFTDividend>> {
    const dividends: Array<NFTDividend> = [];
    let cursor: bigint | null = null;
    do {
      const page = await this.refreshMyDividendNFTsPage(
        cursor,
        PUBLIC_LIST_PAGE_SIZE,
      );
      dividends.push(...page.dividends);
      cursor = page.nextCursor;
    } while (cursor !== null);
    return dividends;
  }

  async refreshMyDividendNFTsPage(
    cursor: bigint | null,
    limit: bigint | null,
  ): Promise<NFTDividendPage> {
    return fromRawNFTDividendPage(
      await this.run(() =>
        this.actor.refreshMyDividendNFTsPage(
          toRawOption(cursor),
          toRawOption(limit),
        ),
      ),
    );
  }

  async getMyCreatedCollections(): Promise<Array<Collection>> {
    const result = (await this.run(() =>
      this.actor.getMyCreatedCollections(),
    )) as Array<RawCollection>;
    return result.map(fromRawCollection);
  }

  async getMyCollectionCanisterStatuses(): Promise<
    Array<CollectionCanisterStatus>
  > {
    const result = (await this.run(() =>
      this.actor.getMyCollectionCanisterStatuses(),
    )) as Array<RawCollectionCanisterStatus>;
    return result.map(fromRawCollectionCanisterStatus);
  }

  async getCollectionCanisterControllers(
    collectionId: CollectionId,
  ): Promise<
    | { __kind__: "ok"; ok: CollectionCanisterControllers }
    | { __kind__: "err"; err: string }
  > {
    return fromCollectionCanisterControllersResult(
      await this.run(() =>
        this.actor.getCollectionCanisterControllers(collectionId),
      ),
    );
  }

  async addCollectionCanisterController(
    collectionId: CollectionId,
    controller: Principal,
  ): Promise<
    | { __kind__: "ok"; ok: CollectionCanisterControllers }
    | { __kind__: "err"; err: string }
  > {
    return fromCollectionCanisterControllersResult(
      await this.run(() =>
        this.actor.addCollectionCanisterController(collectionId, controller),
      ),
    );
  }

  async removeCollectionCanisterController(
    collectionId: CollectionId,
    controller: Principal,
  ): Promise<
    | { __kind__: "ok"; ok: CollectionCanisterControllers }
    | { __kind__: "err"; err: string }
  > {
    return fromCollectionCanisterControllersResult(
      await this.run(() =>
        this.actor.removeCollectionCanisterController(collectionId, controller),
      ),
    );
  }

  async getNFTStats(user: Principal): Promise<NFTStats> {
    return this.run(() => this.actor.getNFTStats(user));
  }

  async getUserAccountId(): Promise<AccountIdentifier> {
    return this.run(() => this.actor.getUserAccountId());
  }

  async getUserICPBalance(): Promise<bigint> {
    return this.run(() => this.actor.getUserICPBalance());
  }

  async getUserNFTs(user: Principal): Promise<Array<WalletNFT>> {
    const nfts: Array<WalletNFT> = [];
    let cursor: bigint | null = null;
    do {
      const page = await this.getUserNFTsPage(
        user,
        cursor,
        PUBLIC_LIST_PAGE_SIZE,
      );
      nfts.push(...page.nfts);
      cursor = page.nextCursor;
    } while (cursor !== null);
    return nfts;
  }

  async getUserNFTsPage(
    user: Principal,
    cursor: bigint | null,
    limit: bigint | null,
  ): Promise<WalletNFTPage> {
    return fromRawWalletNFTPage(
      await this.run(() =>
        this.actor.getUserNFTsPage(
          user,
          toRawOption(cursor),
          toRawOption(limit),
        ),
      ),
    );
  }

  async getVaultAccountId(): Promise<AccountIdentifier> {
    return this.run(() => this.actor.getVaultAccountId());
  }

  async getVaultPrincipal(): Promise<Principal> {
    return this.run(() => this.actor.getVaultPrincipal());
  }

  async indexCollectionOwnershipPage(
    collectionId: CollectionId,
    cursor: string | null,
    limit: bigint,
  ): Promise<
    | { __kind__: "ok"; ok: CollectionIndexPageResult }
    | { __kind__: "err"; err: string }
  > {
    return fromCollectionIndexPageResult(
      await this.run(() =>
        this.actor.indexCollectionOwnershipPage(
          collectionId,
          toRawOption(cursor),
          limit,
        ),
      ),
    );
  }

  async isAdmin(): Promise<boolean> {
    return this.run(() => this.actor.isAdmin());
  }

  async isNFTInUserWallet(
    collectionId: CollectionId,
    tokenId: string,
    user: UserId,
  ): Promise<boolean> {
    return this.run(() =>
      this.actor.isNFTInUserWallet(collectionId, tokenId, user),
    );
  }

  async listCollections(): Promise<Array<Collection>> {
    const collections: Array<Collection> = [];
    let cursor: bigint | null = null;
    do {
      const page = await this.listCollectionsPage(
        cursor,
        PUBLIC_LIST_PAGE_SIZE,
      );
      collections.push(...page.collections);
      cursor = page.nextCursor;
    } while (cursor !== null);
    return collections;
  }

  async listCollectionsPage(
    cursor: bigint | null,
    limit: bigint | null,
  ): Promise<CollectionPage> {
    return fromRawCollectionPage(
      await this.run(() =>
        this.actor.listCollectionsPage(toRawOption(cursor), toRawOption(limit)),
      ),
    );
  }

  async mintCollectionNFT(
    collectionId: CollectionId,
    metadata: NFTMetadata,
  ): Promise<
    { __kind__: "ok"; ok: WalletNFT } | { __kind__: "err"; err: string }
  > {
    return fromWalletResult(
      await this.run(() =>
        this.actor.mintCollectionNFT(collectionId, toRawNFTMetadata(metadata)),
      ),
    );
  }

  async mintUserNFT(
    metadata: NFTMetadata,
  ): Promise<
    { __kind__: "ok"; ok: MintReceipt } | { __kind__: "err"; err: string }
  > {
    return fromMintResult(
      await this.run(() => this.actor.mintUserNFT(toRawNFTMetadata(metadata))),
    );
  }

  async placeBid(
    listingId: ListingId,
    amount: bigint,
  ): Promise<AuctionListing> {
    return fromRawAuctionListing(
      await this.run(() => this.actor.placeBid(listingId, amount)),
    );
  }

  async retryPendingBid(listingId: ListingId): Promise<AuctionListing> {
    return fromRawAuctionListing(
      await this.run(() => this.actor.retryPendingBid(listingId)),
    );
  }

  async retryPendingMintPayment(
    paymentId: bigint,
  ): Promise<
    { __kind__: "ok"; ok: MintReceipt } | { __kind__: "err"; err: string }
  > {
    return fromMintResult(
      await this.run(() => this.actor.retryPendingMintPayment(paymentId)),
    );
  }

  async prepareVaultDeposit(
    collectionId: CollectionId,
    tokenId: string,
  ): Promise<
    { __kind__: "ok"; ok: string } | { __kind__: "err"; err: string }
  > {
    return fromTextResult(
      await this.run(() =>
        this.actor.prepareVaultDeposit(collectionId, tokenId),
      ),
    );
  }

  async previewCollectionDividendDisbursement(
    collectionId: CollectionId,
  ): Promise<
    | { __kind__: "ok"; ok: DividendDisbursementPreview }
    | { __kind__: "err"; err: string }
  > {
    return fromDividendDisbursementPreviewResult(
      await this.run(() =>
        this.actor.previewCollectionDividendDisbursement(collectionId),
      ),
    );
  }

  async previewMyCollectionNFTs(
    collectionId: CollectionId,
  ): Promise<
    { __kind__: "ok"; ok: Array<WalletNFT> } | { __kind__: "err"; err: string }
  > {
    return fromPreviewResult(
      await this.run(() => this.actor.previewMyCollectionNFTs(collectionId)),
    );
  }

  async registerNFT(
    collectionId: CollectionId,
    tokenId: string,
    metadata: NFTMetadata,
  ): Promise<
    { __kind__: "ok"; ok: WalletNFT } | { __kind__: "err"; err: string }
  > {
    return fromWalletResult(
      await this.run(() =>
        this.actor.registerNFT(
          collectionId,
          tokenId,
          toRawNFTMetadata(metadata),
        ),
      ),
    );
  }

  async removeCollection(id: CollectionId): Promise<boolean> {
    return this.run(() => this.actor.removeCollection(id));
  }

  async updateCollectionBrowseInfo(
    collectionId: CollectionId,
    browseInfo: CollectionBrowseInfo | null,
  ): Promise<
    { __kind__: "ok"; ok: Collection } | { __kind__: "err"; err: string }
  > {
    return fromCollectionResult(
      await this.run(() =>
        this.actor.updateCollectionBrowseInfo(
          collectionId,
          toRawOption(
            browseInfo == null ? null : toRawCollectionBrowseInfo(browseInfo),
          ),
        ),
      ),
    );
  }

  async recoverCollectionCreationRecord(
    requestId: bigint,
  ): Promise<
    | { __kind__: "ok"; ok: CollectionCreationRequestView }
    | { __kind__: "err"; err: string }
  > {
    return fromCollectionCreationRequestViewResult(
      await this.run(() =>
        this.actor.recoverCollectionCreationRecord(requestId),
      ),
    );
  }

  async retryAuctionRefund(escrowId: bigint): Promise<boolean> {
    return this.run(() => this.actor.retryAuctionRefund(escrowId));
  }

  async retryCollectionCreationRequest(
    requestId: bigint,
  ): Promise<
    | { __kind__: "ok"; ok: CollectionCreationReceipt }
    | { __kind__: "err"; err: string }
  > {
    return fromCollectionCreationResult(
      await this.run(() =>
        this.actor.retryCollectionCreationRequest(requestId),
      ),
    );
  }

  async repairCollectionCreationRequest(
    requestId: bigint,
  ): Promise<
    | { __kind__: "ok"; ok: CollectionCreationRequestView }
    | { __kind__: "err"; err: string }
  > {
    return fromCollectionCreationRequestViewResult(
      await this.run(() =>
        this.actor.repairCollectionCreationRequest(requestId),
      ),
    );
  }

  async retryInstallCollectionCanister(
    collectionId: CollectionId,
  ): Promise<
    { __kind__: "ok"; ok: Collection } | { __kind__: "err"; err: string }
  > {
    return fromCollectionResult(
      await this.run(() =>
        this.actor.retryInstallCollectionCanister(collectionId),
      ),
    );
  }

  async topUpCollectionCanisterCycles(
    collectionId: CollectionId,
    cyclesToTopUp: bigint,
  ): Promise<
    | { __kind__: "ok"; ok: CollectionCycleTopUpReceipt }
    | { __kind__: "err"; err: string }
  > {
    return fromCollectionCycleTopUpResult(
      await this.run(() =>
        this.actor.topUpCollectionCanisterCycles(collectionId, cyclesToTopUp),
      ),
    );
  }

  async topUpAppCanisterCycles(
    cyclesToTopUp: bigint,
  ): Promise<
    | { __kind__: "ok"; ok: AppCycleTopUpReceipt }
    | { __kind__: "err"; err: string }
  > {
    return fromAppCycleTopUpResult(
      await this.run(() => this.actor.topUpAppCanisterCycles(cyclesToTopUp)),
    );
  }

  async topUpCanisterCycles(
    targetCanister: Principal,
    cyclesToTopUp: bigint,
  ): Promise<
    | { __kind__: "ok"; ok: AppCycleTopUpReceipt }
    | { __kind__: "err"; err: string }
  > {
    return fromAppCycleTopUpResult(
      await this.run(() =>
        this.actor.topUpCanisterCycles(targetCanister, cyclesToTopUp),
      ),
    );
  }

  async upgradeCollectionCanister(
    collectionId: CollectionId,
  ): Promise<
    { __kind__: "ok"; ok: Collection } | { __kind__: "err"; err: string }
  > {
    return fromCollectionResult(
      await this.run(() => this.actor.upgradeCollectionCanister(collectionId)),
    );
  }

  async sendNFT(
    nftId: NFTId,
    recipient: Principal,
  ): Promise<
    { __kind__: "ok"; ok: string } | { __kind__: "err"; err: string }
  > {
    return fromTextResult(
      await this.run(() => this.actor.sendNFT(nftId, recipient)),
    );
  }

  async syncExternalNFTOwner(
    collectionId: CollectionId,
    tokenId: string,
    owner: Principal,
  ): Promise<
    { __kind__: "ok"; ok: WalletNFT } | { __kind__: "err"; err: string }
  > {
    return fromWalletResult(
      await this.run(() =>
        this.actor.syncExternalNFTOwner(collectionId, tokenId, owner),
      ),
    );
  }

  async setCollectionCanisterWasm(wasm: Uint8Array): Promise<void> {
    return this.run(() => this.actor.setCollectionCanisterWasm(wasm));
  }

  async settleAuction(listingId: ListingId): Promise<void> {
    return this.run(() => this.actor.settleAuction(listingId));
  }

  async syncUserNFTs(): Promise<
    | { __kind__: "ok"; ok: { errors: Array<string>; newCount: bigint } }
    | { __kind__: "err"; err: string }
  > {
    return fromSyncResult(await this.run(() => this.actor.syncUserNFTs()));
  }

  async syncUserNFTsV2(): Promise<
    | { __kind__: "ok"; ok: WalletSyncV2Result }
    | { __kind__: "err"; err: string }
  > {
    return fromSyncV2Result(await this.run(() => this.actor.syncUserNFTsV2()));
  }

  async syncUserNFTsPage(
    cursor: bigint | null,
    maxCollections: bigint,
  ): Promise<
    | { __kind__: "ok"; ok: WalletSyncPageResult }
    | { __kind__: "err"; err: string }
  > {
    return fromSyncPageResult(
      await this.run(() =>
        this.actor.syncUserNFTsPage(toRawOption(cursor), maxCollections),
      ),
    );
  }

  async syncCollectionDividends(
    collectionId: CollectionId,
  ): Promise<
    | { __kind__: "ok"; ok: DividendSyncReceipt }
    | { __kind__: "err"; err: string }
  > {
    return fromDividendSyncResult(
      await this.run(() => this.actor.syncCollectionDividends(collectionId)),
    );
  }

  async transferICPOut(
    to: AccountIdentifier,
    amount: bigint,
  ): Promise<TransferResult> {
    return fromRawTransferResult(
      await this.run(() => this.actor.transferICPOut(to, amount)),
    );
  }
}

export function createActor(
  canisterId: string,
  uploadFile: (file: ExternalBlob) => Promise<Uint8Array>,
  downloadFile: (file: Uint8Array) => Promise<ExternalBlob>,
  options: CreateActorOptions = {},
): Backend {
  void uploadFile;
  void downloadFile;
  const agent =
    options.agent ||
    HttpAgent.createSync({
      ...options.agentOptions,
    });
  const actor = Actor.createActor<any>(idlFactory, {
    agent,
    canisterId,
    ...options.actorOptions,
  });
  return new Backend(
    actor,
    uploadFile,
    downloadFile,
    agent,
    options.processError,
  );
}
