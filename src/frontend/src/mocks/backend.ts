import type {
  backendInterface,
  Collection,
  CollectionImportMeta,
  NFTReportMeta,
  WalletNFT,
  ActiveListing,
  ActiveListingDetail,
  AuctionListing,
  FixedListing,
  NFTStats,
  AccountIdentifier,
  ModerationCategorySettings,
  RecentTransaction,
} from "../backend-client";
import type { Agent } from "@icp-sdk/core/agent";
import { ListingStatus } from "../backend-client";
import { Principal } from "@icp-sdk/core/principal";

const samplePrincipal = Principal.fromText("aaaaa-aa");
const collectionPrincipal = Principal.fromText("rrkah-fqaaa-aaaaa-aaaaq-cai");
const frontendPrincipal = Principal.fromText("ryjl3-tyaaa-aaaaa-aaaba-cai");
const creatorControllerPrincipal = Principal.fromText(
  "ryjl3-tyaaa-aaaaa-aaaba-cai",
);

const mockModerationCategories: ModerationCategorySettings = {
  nudityOrSexual: true,
  graphicViolence: true,
  explicitLanguage: false,
  hateOrHarassment: false,
  hateSymbols: false,
  illegalOrDangerous: false,
  selfHarm: false,
  otherNsfw: true,
};

const sampleCollections: Collection[] = [
  {
    id: BigInt(1),
    name: "Cosmic Entity",
    description: "Ethereal beings from the void between stars.",
    imageUrl: "https://picsum.photos/seed/cosmic/400/400",
    standard: { __kind__: "EXT", EXT: null },
    symbol: "CENT",
    canisterId: collectionPrincipal,
    kind: "External",
    browseInfo: {
      totalSupply: BigInt(120),
      tokenIndexOffset: BigInt(0),
    },
  },
  {
    id: BigInt(2),
    name: "Geometric Flux",
    description: "Abstract geometric forms in perpetual motion.",
    imageUrl: "https://picsum.photos/seed/geo/400/400",
    standard: { __kind__: "DIP721", DIP721: null },
    symbol: "GFLX",
    canisterId: collectionPrincipal,
    kind: "External",
    browseInfo: {
      totalSupply: BigInt(80),
      tokenIndexOffset: BigInt(1),
    },
  },
  {
    id: BigInt(3),
    name: "Mintlab Genesis",
    description: "The managed Mintlab canister collection profile.",
    imageUrl: "https://picsum.photos/seed/ape/400/400",
    standard: { __kind__: "ICRC7", ICRC7: null },
    symbol: "MINT",
    canisterId: collectionPrincipal,
    kind: "Minted",
  },
  {
    id: BigInt(4),
    name: "Creator Forge",
    description: "A user-owned Mintlab collection created after paying the setup fee.",
    imageUrl: "https://picsum.photos/seed/forge/400/400",
    standard: { __kind__: "ICRC7", ICRC7: null },
    symbol: "FORGE",
    canisterId: collectionPrincipal,
    kind: "Minted",
    dividendConfig: { enabled: true },
  },
];

const sampleCollectionImportMetas: CollectionImportMeta[] =
  sampleCollections
    .filter((collection) => collection.kind === "External")
    .map((collection, index) => ({
      collectionId: collection.id,
      importedBy: samplePrincipal,
      trustStatus: index === 0 ? "Verified" : "CommunityImported",
      reportCount: 0n,
      createdAt: BigInt(Date.now()) * BigInt(1_000_000),
      reviewedAt: index === 0 ? BigInt(Date.now()) * BigInt(1_000_000) : null,
      lastReportedAt: null,
      lastReportReason: null,
    }));

const sampleNFTReportMetas: NFTReportMeta[] = [];

const sampleNFTs: WalletNFT[] = [
  {
    id: BigInt(1),
    tokenId: "42",
    collectionId: BigInt(1),
    owner: samplePrincipal,
    registeredAt: BigInt(Date.now()) * BigInt(1_000_000),
    location: "Registered",
    metadata: {
      name: "Cosmic Entity #42",
      description: "A rare cosmic entity with stellar attributes.",
      imageUrl: "https://picsum.photos/seed/nft1/400/400",
      attributes: [["Rarity", "Legendary"], ["Power", "9500"]],
    },
  },
  {
    id: BigInt(2),
    tokenId: "77",
    collectionId: BigInt(2),
    owner: samplePrincipal,
    registeredAt: BigInt(Date.now()) * BigInt(1_000_000),
    location: "Vaulted",
    metadata: {
      name: "Geometric Flux #77",
      description: "Abstract flux in violet frequencies.",
      imageUrl: "https://picsum.photos/seed/nft2/400/400",
      attributes: [["Rarity", "Rare"], ["Frequency", "290hz"]],
    },
  },
  {
    id: BigInt(3),
    tokenId: "12",
    collectionId: BigInt(4),
    owner: samplePrincipal,
    registeredAt: BigInt(Date.now()) * BigInt(1_000_000),
    location: "Minted",
    metadata: {
      name: "Creator Forge #12",
      description: "Elite community drop minted inside a creator-owned Mintlab collection.",
      imageUrl: "https://picsum.photos/seed/nft3/400/400",
      attributes: [["Rarity", "Epic"], ["Neural", "V3"]],
    },
  },
];

const fixedListing: FixedListing = {
  id: BigInt(1),
  status: ListingStatus.Active,
  createdAt: BigInt(Date.now()) * BigInt(1_000_000),
  seller: samplePrincipal,
  nftId: BigInt(4),
  price: BigInt(1_550_000_000),
};

const auctionListing: AuctionListing = {
  id: BigInt(2),
  status: ListingStatus.Active,
  endTime: BigInt(Date.now() + 86400000) * BigInt(1_000_000),
  createdAt: BigInt(Date.now()) * BigInt(1_000_000),
  seller: samplePrincipal,
  highestBid: BigInt(820_000_000),
  highestBidder: samplePrincipal,
  nftId: BigInt(5),
  startingBid: BigInt(500_000_000),
};

const sampleActiveListings: ActiveListing[] = [
  { __kind__: "Fixed", Fixed: fixedListing },
  { __kind__: "Auction", Auction: auctionListing },
  {
    __kind__: "Fixed",
    Fixed: { ...fixedListing, id: BigInt(3), nftId: BigInt(6), price: BigInt(820_000_000) },
  },
  {
    __kind__: "Auction",
    Auction: {
      ...auctionListing,
      id: BigInt(4),
      nftId: BigInt(7),
      highestBid: BigInt(1_550_000_000),
    },
  },
];

const sampleListingNFTs: WalletNFT[] = [
  {
    id: BigInt(4),
    tokenId: "81",
    collectionId: BigInt(2),
    owner: samplePrincipal,
    registeredAt: BigInt(Date.now()) * BigInt(1_000_000),
    location: "Vaulted",
    metadata: {
      name: "Geometric Flux #81",
      description: "Escrowed for direct sale.",
      imageUrl: "https://picsum.photos/seed/market1/400/400",
      attributes: [["Edition", "81"]],
    },
  },
  {
    id: BigInt(5),
    tokenId: "24",
    collectionId: BigInt(3),
    owner: samplePrincipal,
    registeredAt: BigInt(Date.now()) * BigInt(1_000_000),
    location: "Minted",
    metadata: {
      name: "Cybernetic Ape #24",
      description: "Live auction sample.",
      imageUrl: "https://picsum.photos/seed/market2/400/400",
      attributes: [["Drop", "Genesis"]],
    },
  },
  {
    id: BigInt(6),
    tokenId: "108",
    collectionId: BigInt(1),
    owner: samplePrincipal,
    registeredAt: BigInt(Date.now()) * BigInt(1_000_000),
    location: "Vaulted",
    metadata: {
      name: "Cosmic Entity #108",
      description: "Limited fixed-price sample.",
      imageUrl: "https://picsum.photos/seed/market3/400/400",
      attributes: [["Rarity", "Rare"]],
    },
  },
  {
    id: BigInt(7),
    tokenId: "31",
    collectionId: BigInt(3),
    owner: samplePrincipal,
    registeredAt: BigInt(Date.now()) * BigInt(1_000_000),
    location: "Minted",
    metadata: {
      name: "Cybernetic Ape #31",
      description: "Second auction sample.",
      imageUrl: "https://picsum.photos/seed/market4/400/400",
      attributes: [["Rarity", "Epic"]],
    },
  },
];

const sampleActiveListingDetails: ActiveListingDetail[] = sampleActiveListings.map(
  (listing) => ({
    listing,
    nft:
      sampleListingNFTs.find((nft) =>
        nft.id ===
        (listing.__kind__ === "Fixed" ? listing.Fixed.nftId : listing.Auction.nftId),
      ) ?? sampleListingNFTs[0],
  }),
);

const mockAccountId: AccountIdentifier = new Uint8Array(32).fill(0xab);
const sampleRecentTransactions: RecentTransaction[] = [
  {
    id: 5n,
    kind: "Mint",
    direction: "In",
    status: "Completed",
    amountE8s: null,
    feeE8s: null,
    title: "NFT received",
    detail: "Creator Forge - Neon Bloom from rdmx6-jaaaa-aaaaa-aaadq-cai",
    occurredAt: BigInt(Date.now() - 1000 * 60 * 12) * 1_000_000n,
    blockIndex: null,
    reference: "mock-nft-in-5",
  },
  {
    id: 4n,
    kind: "Mint",
    direction: "Out",
    status: "Completed",
    amountE8s: null,
    feeE8s: null,
    title: "NFT sent",
    detail: "Mintlab Genesis - Token 12 to rrkah-fqaaa-aaaaa-aaaaq-cai",
    occurredAt: BigInt(Date.now() - 1000 * 60 * 28) * 1_000_000n,
    blockIndex: null,
    reference: "mock-nft-out-4",
  },
  {
    id: 3n,
    kind: "MarketplaceSale",
    direction: "In",
    status: "Completed",
    amountE8s: 225_000_000n,
    feeE8s: 4_500_000n,
    title: "NFT sold",
    detail: "Marketplace sale settled",
    occurredAt: BigInt(Date.now() - 1000 * 60 * 45) * 1_000_000n,
    blockIndex: 3_220_112n,
    reference: "mock-sale-3",
  },
  {
    id: 2n,
    kind: "Mint",
    direction: "Out",
    status: "Completed",
    amountE8s: 100_000_000n,
    feeE8s: 10_000n,
    title: "NFT minted",
    detail: "Mintlab Genesis",
    occurredAt: BigInt(Date.now() - 1000 * 60 * 60 * 5) * 1_000_000n,
    blockIndex: 3_219_804n,
    reference: "mock-mint-2",
  },
  {
    id: 1n,
    kind: "CollectionCanisterTopUp",
    direction: "Out",
    status: "Completed",
    amountE8s: 50_000_000n,
    feeE8s: 10_000n,
    title: "Collection cycles top-up",
    detail: "Creator Forge",
    occurredAt: BigInt(Date.now() - 1000 * 60 * 60 * 26) * 1_000_000n,
    blockIndex: 3_218_455n,
    reference: "mock-top-up-1",
  },
];
let mockMarketplaceFeeBasisPoints = 200n;
let mockMarketplaceFeeRecipient: AccountIdentifier | null = mockAccountId;

const sampleBrowseNFTsByCollection = new Map<string, WalletNFT[]>([
  [
    "1",
    [
      sampleNFTs[0],
      sampleListingNFTs[2],
      {
        id: 109n,
        tokenId: "109",
        collectionId: 1n,
        owner: samplePrincipal,
        registeredAt: BigInt(Date.now()) * 1_000_000n,
        location: "Registered",
        metadata: {
          name: "Cosmic Entity #109",
          description: "Mock browser sample for the full EXT collection.",
          imageUrl: "https://picsum.photos/seed/market5/400/400",
          attributes: [["Rarity", "Mythic"]],
        },
      },
    ],
  ],
  [
    "2",
    [
      sampleNFTs[1],
      sampleListingNFTs[0],
      {
        id: 82n,
        tokenId: "82",
        collectionId: 2n,
        owner: samplePrincipal,
        registeredAt: BigInt(Date.now()) * 1_000_000n,
        location: "Registered",
        metadata: {
          name: "Geometric Flux #82",
          description: "Mock browser sample for the DIP721 collection.",
          imageUrl: "https://picsum.photos/seed/market6/400/400",
          attributes: [["Edition", "82"]],
        },
      },
    ],
  ],
  [
    "3",
    [
      sampleListingNFTs[1],
      sampleListingNFTs[3],
      {
        id: 32n,
        tokenId: "32",
        collectionId: 3n,
        owner: samplePrincipal,
        registeredAt: BigInt(Date.now()) * 1_000_000n,
        location: "Minted",
        metadata: {
          name: "Cybernetic Ape #32",
          description: "Additional mock minted sample.",
          imageUrl: "https://picsum.photos/seed/market7/400/400",
          attributes: [["Rarity", "Legendary"]],
        },
      },
    ],
  ],
  [
    "4",
    [
      sampleNFTs[2],
      {
        id: 13n,
        tokenId: "13",
        collectionId: 4n,
        owner: samplePrincipal,
        registeredAt: BigInt(Date.now()) * 1_000_000n,
        location: "Minted",
        metadata: {
          name: "Creator Forge #13",
          description: "Another creator-owned Mintlab collectible.",
          imageUrl: "https://picsum.photos/seed/market8/400/400",
          attributes: [["Rarity", "Rare"]],
        },
      },
    ],
  ],
]);

function sampleCollectionNFTs(collectionId: bigint): WalletNFT[] {
  return sampleBrowseNFTsByCollection.get(collectionId.toString()) ?? [];
}

function paginateMock<T>(
  items: T[],
  cursor: bigint | null,
  limit: bigint | null,
): { items: T[]; nextCursor: bigint | null; totalCount: bigint } {
  const start = cursor == null ? 0 : Number(cursor);
  const pageSize = limit == null ? 100 : Number(limit);
  const page = items.slice(start, start + pageSize);
  const next = start + page.length < items.length ? BigInt(start + page.length) : null;
  return {
    items: page,
    nextCursor: next,
    totalCount: BigInt(items.length),
  };
}

function sampleCollectionDividendBalances(
  collectionId: bigint,
): Array<[string, bigint]> {
  return collectionId === 4n
    ? [
        ["12", 50_000_000n],
        ["13", 50_000_000n],
      ]
    : [];
}

function mockCollectionMeta(
  collectionId: bigint,
  trustStatus: CollectionImportMeta["trustStatus"],
): CollectionImportMeta {
  return (
    sampleCollectionImportMetas.find(
      (meta) => meta.collectionId === collectionId,
    ) ?? {
      collectionId,
      importedBy: samplePrincipal,
      trustStatus,
      reportCount: 0n,
      createdAt: BigInt(Date.now()) * BigInt(1_000_000),
      reviewedAt: null,
      lastReportedAt: null,
      lastReportReason: null,
    }
  );
}

function mockNFTReportMeta(
  collectionId: bigint,
  tokenId: string,
  status: NFTReportMeta["status"],
): NFTReportMeta {
  return (
    sampleNFTReportMetas.find(
      (meta) => meta.collectionId === collectionId && meta.tokenId === tokenId,
    ) ?? {
      collectionId,
      tokenId,
      status,
      reportCount: 1n,
      createdAt: BigInt(Date.now()) * BigInt(1_000_000),
      lastReportedAt: BigInt(Date.now()) * BigInt(1_000_000),
      lastReportReason: null,
      reviewedAt:
        status === "Approved" || status === "Hidden"
          ? BigInt(Date.now()) * BigInt(1_000_000)
          : null,
      reviewedBy:
        status === "Approved" || status === "Hidden" ? samplePrincipal : null,
    }
  );
}

export const mockBackend: backendInterface = {
  getAgent: (): Agent => {
    throw new Error("Mock backend does not provide an authenticated agent");
  },
  addCollection: async (
    name,
    description,
    canisterId,
    standard,
    imageUrl,
    symbol,
    browseInfo,
  ) => ({
    id: BigInt(Math.floor(Math.random() * 1000)),
    name,
    description,
    imageUrl,
    standard,
    symbol,
    canisterId,
    kind: "External",
    browseInfo: browseInfo ?? undefined,
  }),
  bootstrapAdmin: async () => undefined,
  buyFixedListing: async () => undefined,
  cancelListing: async () => undefined,
  adminBlockCollection: async (collectionId) => ({
    __kind__: "ok" as const,
    ok: mockCollectionMeta(collectionId, "Blocked"),
  }),
  adminApproveNFTReport: async (collectionId, tokenId) => ({
    __kind__: "ok" as const,
    ok: mockNFTReportMeta(collectionId, tokenId, "Approved"),
  }),
  adminDisableCollectionSync: async (collectionId) => ({
    __kind__: "ok" as const,
    ok: mockCollectionMeta(collectionId, "SyncDisabled"),
  }),
  adminHideCollection: async (collectionId) => ({
    __kind__: "ok" as const,
    ok: mockCollectionMeta(collectionId, "Hidden"),
  }),
  adminHideNFTReport: async (collectionId, tokenId) => ({
    __kind__: "ok" as const,
    ok: mockNFTReportMeta(collectionId, tokenId, "Hidden"),
  }),
  adminMarkCollectionNeedsBrowseInfo: async (collectionId) => ({
    __kind__: "ok" as const,
    ok: mockCollectionMeta(collectionId, "NeedsBrowseInfo"),
  }),
  adminVerifyCollection: async (collectionId) => ({
    __kind__: "ok" as const,
    ok: mockCollectionMeta(collectionId, "Verified"),
  }),
  adminGetSettlementEscrowRepairQuote: async (listingId) => ({
    listingId,
    kind: "Auction" as const,
    escrowId: 12n,
    escrowAccount: mockAccountId,
    escrowBalance: 99_990_000n,
    requiredDebit: 100_010_000n,
    shortfall: 20_000n,
    ledgerFeeE8s: 10_000n,
    sellerProceeds: 98_000_000n,
    mintlabFee: 2_000_000n,
    topUpFromAccount: mockAccountId,
    topUpFromBalance: 1_000_000_000n,
    topUpTransferFeeE8s: 10_000n,
    topUpTotalDebit: 30_000n,
  }),
  adminGetMintlabFeeRecoveryQuote: async (listingId) => ({
    listingId,
    kind: "Auction" as const,
    escrowId: 12n,
    escrowAccount: mockAccountId,
    escrowBalance: 99_990_000n,
    expectedBeforeMintlabFeeDebit: 100_020_000n,
    expectedAfterMintlabFeeDebit: 98_010_000n,
    shortfallBeforeMintlabFee: 30_000n,
    sellerProceeds: 98_000_000n,
    mintlabFee: 2_000_000n,
    ledgerFeeE8s: 10_000n,
    feeRecipient: mockAccountId,
    previousMintlabFeeCreatedAt: 1_700_000_000_000_000_000n,
  }),
  adminResetUnresolvedMintlabFeeAttempt: async (listingId) => ({
    listingId,
    kind: "Auction" as const,
    escrowId: 12n,
    escrowAccount: mockAccountId,
    escrowBalance: 99_990_000n,
    expectedBeforeMintlabFeeDebit: 100_020_000n,
    expectedAfterMintlabFeeDebit: 98_010_000n,
    shortfallBeforeMintlabFee: 30_000n,
    sellerProceeds: 98_000_000n,
    mintlabFee: 2_000_000n,
    ledgerFeeE8s: 10_000n,
    feeRecipient: mockAccountId,
    previousMintlabFeeCreatedAt: 1_700_000_000_000_000_000n,
  }),
  adminMarkMintlabFeeBalanceVerified: async (listingId) => ({
    listingId,
    kind: "Auction" as const,
    escrowId: 12n,
    escrowAccount: mockAccountId,
    escrowBalance: 98_000_000n,
    expectedBeforeMintlabFeeDebit: 100_020_000n,
    expectedAfterMintlabFeeDebit: 98_010_000n,
    shortfallBeforeMintlabFee: 2_020_000n,
    sellerProceeds: 98_000_000n,
    mintlabFee: 2_000_000n,
    ledgerFeeE8s: 10_000n,
    feeRecipient: mockAccountId,
    previousMintlabFeeCreatedAt: 1_700_000_000_000_000_000n,
  }),
  adminResolvePendingBid: async () => undefined,
  adminRetryListingReturn: async () => undefined,
  adminRetryNoBidAuctionReturn: async () => undefined,
  adminRetryAuctionSettlement: async () => undefined,
  adminRetryFixedPurchaseSettlement: async () => undefined,
  adminTopUpSettlementEscrow: async (listingId, amount) => ({
    listingId,
    amount,
    feeE8s: 10_000n,
    blockIndex: 99n,
    quoteBefore: {
      listingId,
      kind: "Auction" as const,
      escrowId: 12n,
      escrowAccount: mockAccountId,
      escrowBalance: 99_990_000n,
      requiredDebit: 100_010_000n,
      shortfall: amount,
      ledgerFeeE8s: 10_000n,
      sellerProceeds: 98_000_000n,
      mintlabFee: 2_000_000n,
      topUpFromAccount: mockAccountId,
      topUpFromBalance: 1_000_000_000n,
      topUpTransferFeeE8s: 10_000n,
      topUpTotalDebit: amount + 10_000n,
    },
  }),
  claimNFTDividend: async (nftId) => ({
    __kind__: "ok" as const,
    ok: {
      nft:
        sampleNFTs.find((nft) => nft.id === nftId) ??
        sampleNFTs[sampleNFTs.length - 1],
      collection: sampleCollections[3],
      paidE8s: 49_990_000n,
      feeE8s: 10_000n,
      blockIndex: 42n,
    },
  }),
  disburseCollectionDividends: async () => ({
    __kind__: "err" as const,
    err: "Batch dividend disbursement is disabled. NFT owners must collect dividends individually.",
  }),
  claimVaultDeposit: async (collectionId, tokenId) => ({
    __kind__: "ok" as const,
    ok: {
      id: BigInt(Math.floor(Math.random() * 1000)),
      tokenId,
      collectionId,
      owner: samplePrincipal,
      registeredAt: BigInt(Date.now()) * BigInt(1_000_000),
      location: "Vaulted",
      metadata: {
        name: `Deposited #${tokenId}`,
        description: "Mock vaulted NFT",
        imageUrl: "https://picsum.photos/seed/deposit/400/400",
        attributes: [],
      },
    },
  }),
  configureMarketplaceFee: async (recipient, mintlabFeeBasisPoints) => {
    mockMarketplaceFeeRecipient = recipient;
    mockMarketplaceFeeBasisPoints = mintlabFeeBasisPoints;
    return {
      auctionBidFeeReserveE8s: 20_000n,
      ledgerFeeE8s: 10_000n,
      mintlabFeeBasisPoints: mockMarketplaceFeeBasisPoints,
      mintlabFeeRecipient: mockMarketplaceFeeRecipient,
    };
  },
  configureMarketplaceFeeRecipient: async (recipient) => {
    mockMarketplaceFeeRecipient = recipient;
    return {
      auctionBidFeeReserveE8s: 20_000n,
      ledgerFeeE8s: 10_000n,
      mintlabFeeBasisPoints: mockMarketplaceFeeBasisPoints,
      mintlabFeeRecipient: mockMarketplaceFeeRecipient,
    };
  },
  configureMinting: async (name, description, symbol, imageUrl) => ({
    id: BigInt(999),
    name,
    description,
    imageUrl,
    standard: { __kind__: "ICRC7", ICRC7: null },
    symbol,
    canisterId: collectionPrincipal,
    kind: "Minted",
    browseInfo: undefined,
  }),
  createAuctionListing: async (nftId, startingBid, endTime) => ({
    ...auctionListing,
    nftId,
    startingBid,
    endTime,
    highestBid: 0n,
    highestBidder: undefined,
  }),
  createUserCollection: async (name, description, symbol, imageUrl, dividendsEnabled) => ({
    __kind__: "ok" as const,
    ok: {
      paymentBlock: BigInt(7),
      collection: {
        id: BigInt(4),
        name,
        description,
        imageUrl,
        standard: { __kind__: "ICRC7", ICRC7: null },
        symbol,
        canisterId: collectionPrincipal,
        kind: "Minted",
        browseInfo: undefined,
        dividendConfig: dividendsEnabled ? { enabled: true } : undefined,
      },
    },
  }),
  createFixedListing: async (nftId, price) => ({
    ...fixedListing,
    nftId,
    price,
  }),
  getActiveListingDetails: async () => sampleActiveListingDetails,
  getActiveListingDetailsPage: async (cursor, limit) => {
    const page = paginateMock(sampleActiveListingDetails, cursor, limit);
    return {
      details: page.items,
      nextCursor: page.nextCursor,
      totalCount: page.totalCount,
    };
  },
  getActiveListings: async () => sampleActiveListings,
  getActiveListingsPage: async (cursor, limit) => {
    const page = paginateMock(sampleActiveListings, cursor, limit);
    return {
      listings: page.items,
      nextCursor: page.nextCursor,
      totalCount: page.totalCount,
    };
  },
  getMyMarketplaceSettlementStatuses: async () => [],
  getMyMarketplaceSettlementStatusesPage: async () => ({
    statuses: [],
    nextCursor: null,
    totalCount: 0n,
  }),
  getMyAuctionBidStatuses: async (listingIds) =>
    listingIds.flatMap((listingId) => {
      const active = sampleActiveListings.find(
        (listing) =>
          listing.__kind__ === "Auction" && listing.Auction.id === listingId,
      );
      if (!active || active.__kind__ !== "Auction") return [];
      const auction = active.Auction;
      const isWinning =
        auction.highestBidder?.toString() === samplePrincipal.toString();
      return [
        {
          listingId,
          hasBid: isWinning,
          isWinning,
          highestBidder: auction.highestBidder,
          highestBid: auction.highestBid,
          myHighestBid: isWinning ? auction.highestBid : undefined,
        },
      ];
    }),
  getAdminPrincipal: async () => samplePrincipal,
  getCollection: async (id) => sampleCollections.find((c) => c.id === id) ?? null,
  getCollectionImportMeta: async (collectionId) =>
    sampleCollectionImportMetas.find(
      (meta) => meta.collectionId === collectionId,
    ) ?? null,
  getCollectionBrowseStats: async (collectionId) => {
    const collection = sampleCollections.find((c) => c.id === collectionId);
    const visibleCount = BigInt(sampleCollectionNFTs(collectionId).length);
    const totalCount =
      collection?.kind === "Minted"
        ? visibleCount
        : collection?.browseInfo?.totalSupply ?? visibleCount;
    return {
      collectionId,
      totalCount,
      visibleCount:
        collection?.kind === "Minted" || collection?.browseInfo?.totalSupply != null
          ? totalCount
          : visibleCount,
      coverage:
        collection?.kind === "Minted" || collection?.browseInfo?.totalSupply != null
          ? "Full"
          : "Partial",
      note:
        collection?.kind === "Minted"
          ? "Mintlab can browse every NFT minted in this collection."
          : collection?.browseInfo?.totalSupply != null
            ? "Mintlab can browse the full imported collection."
            : "Mintlab is showing the NFTs it has already indexed for this collection.",
    };
  },
  getCollectionCreator: async (id) => (id === 4n ? samplePrincipal : null),
  getCollectionDividendAccountId: async () => mockAccountId,
  getCollectionDividendBalances: async (collectionId) =>
    sampleCollectionDividendBalances(collectionId),
  getCollectionDividendBalancesPage: async (collectionId, cursor, limit) => {
    const page = paginateMock(
      sampleCollectionDividendBalances(collectionId),
      cursor,
      limit,
    );
    return {
      balances: page.items,
      nextCursor: page.nextCursor,
      totalCount: page.totalCount,
    };
  },
  refreshCollectionDividendBalances: async (collectionId) =>
    mockBackend.getCollectionDividendBalances(collectionId),
  refreshCollectionDividendBalancesPage: async (collectionId, cursor, limit) =>
    mockBackend.getCollectionDividendBalancesPage(collectionId, cursor, limit),
  getCollectionDividendInfo: async (collectionId) => ({
    collectionId,
    enabled: collectionId === 4n,
    accountId: mockAccountId,
    balanceE8s: 100_000_000n,
    distributableBalanceE8s: 99_980_000n,
    feeReserveE8s: 20_000n,
    processedBalanceE8s: 100_000_000n,
    pendingE8s: collectionId === 4n ? 100_000_000n : 0n,
    nftCount: BigInt(sampleCollectionNFTs(collectionId).length),
  }),
  getCollectionNFTPage: async (collectionId, cursor, limit) => {
    const items = sampleCollectionNFTs(collectionId);
    const start = cursor == null ? 0 : Number.parseInt(cursor, 10) || 0;
    const pageSize = limit == null ? 24 : Number(limit);
    const nfts = items.slice(start, start + pageSize);
    const stats = await mockBackend.getCollectionBrowseStats(collectionId);
    return {
      nfts,
      nextCursor:
        start + nfts.length < items.length ? `${start + nfts.length}` : undefined,
      totalCount: stats.totalCount,
      coverage: stats.coverage,
      note: stats.note,
    };
  },
  getNFTStats: async (): Promise<NFTStats> => ({
    totalCount: BigInt(3),
    perCollection: [
      [BigInt(1), BigInt(1)],
      [BigInt(2), BigInt(1)],
      [BigInt(4), BigInt(1)],
    ],
  }),
  getUserAccountId: async () => mockAccountId,
  getUserICPBalance: async () => BigInt(4_250_000_000),
  getMyRecentTransactions: async (limit) => {
    const count = limit === null ? 10 : Number(limit);
    return sampleRecentTransactions.slice(0, count);
  },
  getMyRecentNFTTransactions: async (limit) => {
    const count = limit === null ? 10 : Number(limit);
    return sampleRecentTransactions
      .filter((transaction) =>
        [
          "Mint",
          "MarketplacePurchase",
          "MarketplaceSale",
        ].includes(transaction.kind),
      )
      .slice(0, count);
  },
  getUserNFTs: async () => sampleNFTs,
  getUserNFTsPage: async (_user, cursor, limit) => {
    const page = paginateMock(sampleNFTs, cursor, limit);
    return {
      nfts: page.items,
      nextCursor: page.nextCursor,
      totalCount: page.totalCount,
    };
  },
  getMarketplaceFeeConfig: async () => ({
    auctionBidFeeReserveE8s: 20_000n,
    ledgerFeeE8s: 10_000n,
    mintlabFeeBasisPoints: mockMarketplaceFeeBasisPoints,
    mintlabFeeRecipient: mockMarketplaceFeeRecipient,
  }),
  getMintConfig: async () => ({
    collectionId: BigInt(3),
    payoutAccount: mockAccountId,
    mintPriceE8s: BigInt(100_000_000),
    mintEnabled: true,
    collectionCreationPayoutAccount: mockAccountId,
    collectionCreationSecondaryPayoutAccount: null,
    collectionCreationPrimaryPayoutBasisPoints: 10_000n,
    collectionCreationSecondaryPayoutBasisPoints: 0n,
    collectionCreationPriceE8s: BigInt(100_000_000),
    collectionCreationEnabled: true,
    mainMintPayoutAccount: mockAccountId,
    mainMintPriceE8s: BigInt(25_000_000),
    mainMintEnabled: true,
    collectionCanisterWasmUploaded: true,
    collectionCanisterCycles: 2_000_000_000_000n,
  }),
  getModerationConfig: async () => ({
    enabled: true,
    apiKeyConfigured: true,
    model: "openai-omni-moderation-latest",
    categories: mockModerationCategories,
    userMessage:
      "Uploads cannot include sexual content, graphic violence, self-harm content, hateful or harassing text, or dangerous illegal instructions.",
  }),
  configureModeration: async (
    enabled,
    apiKey,
    clearApiKey,
    model,
    categories,
    userMessage,
  ) => ({
    enabled,
    apiKeyConfigured: !clearApiKey,
    model,
    categories,
    userMessage,
  }),
  adminRecoverPaidCollectionCreation: async (
    _owner,
    cyclePaymentBlock,
    name,
    description,
    symbol,
    imageUrl,
    dividendsEnabled,
  ) => ({
    __kind__: "ok" as const,
    ok: {
      paymentBlock: cyclePaymentBlock,
      collection: {
        id: BigInt(5),
        name,
        description,
        imageUrl,
        standard: { __kind__: "ICRC7", ICRC7: null },
        symbol,
        canisterId: collectionPrincipal,
        kind: "Minted",
        browseInfo: undefined,
        dividendConfig: dividendsEnabled ? { enabled: true } : undefined,
      },
    },
  }),
  adminDeleteCollectionCreationRequest: async () => ({
    __kind__: "ok" as const,
    ok: true,
  }),
  adminReleaseDividendClaimLock: async () => ({
    __kind__: "ok" as const,
    ok: true,
  }),
  adminReleaseDividendDisbursementLock: async () => ({
    __kind__: "ok" as const,
    ok: true,
  }),
  adminResetCollectionOwnershipIndex: async () => ({
    __kind__: "ok" as const,
    ok: true,
  }),
  quoteCollectionCreationCost: async (
    collectionCanisterCycles,
    collectionCreationPriceE8s,
    _collectionCreationPrimaryPayoutBasisPoints,
    collectionCreationSecondaryPayoutBasisPoints,
  ) => {
    const minimumCollectionCanisterCycles = 2_000_000_000_000n;
    const normalizedCollectionCanisterCycles =
      collectionCanisterCycles < minimumCollectionCanisterCycles
        ? minimumCollectionCanisterCycles
        : collectionCanisterCycles;
    const factoryReserveCycles = 500_000_000_000n;
    const totalCyclesToConvert =
      normalizedCollectionCanisterCycles + factoryReserveCycles;
    const cycleCostE8s = 15_000_000n;
    const adminPayoutE8s =
      collectionCreationPriceE8s > cycleCostE8s
        ? collectionCreationPriceE8s - cycleCostE8s
        : 0n;
    const adminSecondaryPayoutE8s =
      (adminPayoutE8s * collectionCreationSecondaryPayoutBasisPoints) /
      10_000n;
    const adminPrimaryPayoutE8s =
      adminPayoutE8s - adminSecondaryPayoutE8s;
    const adminPayoutTransferCount =
      (adminPrimaryPayoutE8s > 0n ? 1n : 0n) +
      (adminSecondaryPayoutE8s > 0n ? 1n : 0n);
    const adminPayoutFeeE8s = adminPayoutTransferCount * 10_000n;
    return {
      collectionCanisterCycles: normalizedCollectionCanisterCycles,
      factoryReserveCycles,
      totalCyclesToConvert,
      cycleCostE8s,
      minimumCreationPriceE8s: cycleCostE8s,
      collectionCreationPriceE8s,
      adminPayoutE8s,
      adminPrimaryPayoutE8s,
      adminSecondaryPayoutE8s,
      ledgerFeeE8s: 10_000n,
      cycleTransferFeeE8s: 10_000n,
      adminPayoutFeeE8s,
      totalUserDebitE8s:
        collectionCreationPriceE8s + 10_000n + adminPayoutFeeE8s,
      xdrPermyriadPerIcp: 100_000n,
      rateTimestampSeconds: BigInt(Math.floor(Date.now() / 1000)),
    };
  },
  quoteCollectionCycleTopUp: async (cyclesToTopUp) => ({
    cyclesToTopUp:
      cyclesToTopUp < 100_000_000_000n
        ? 100_000_000_000n
        : cyclesToTopUp,
    cycleCostE8s: 750_000n,
    ledgerFeeE8s: 10_000n,
    totalUserDebitE8s: 760_000n,
    xdrPermyriadPerIcp: 100_000n,
    rateTimestampSeconds: BigInt(Math.floor(Date.now() / 1000)),
  }),
  quoteAppCanisterCycleTopUp: async (cyclesToTopUp) =>
    mockBackend.quoteCollectionCycleTopUp(cyclesToTopUp),
  getAppCanisterHealth: async (frontendCanisterId) => ({
    __kind__: "ok" as const,
    ok: [
      {
        kind: "Backend" as const,
        canisterId: samplePrincipal,
        cycles: 3_400_000_000_000n,
        moduleInstalled: true,
        freezingThresholdSeconds: null,
        idleCyclesBurnedPerDay: null,
        error: null,
      },
      {
        kind: "Frontend" as const,
        canisterId: frontendCanisterId ?? frontendPrincipal,
        cycles: 1_900_000_000_000n,
        moduleInstalled: true,
        freezingThresholdSeconds: 2_592_000n,
        idleCyclesBurnedPerDay: 4_200_000_000n,
        error: null,
      },
    ],
  }),
  getAllCollectionCreationRequests: async () => ({
    __kind__: "ok" as const,
    ok: [],
  }),
  getAllCollectionCreationRequestsPage: async () => ({
    __kind__: "ok" as const,
    ok: {
      requests: [],
      nextCursor: null,
      totalCount: 0n,
    },
  }),
  getCollectionCreationDiagnostics: async (requestId) => ({
    __kind__: "ok" as const,
    ok: {
      request: {
        id: requestId,
        name: "Recovered setup",
        symbol: "RTRY",
        status: "CyclePaymentSent" as const,
        cyclePaymentBlock: 7n,
        childCanisterId: null,
        collectionId: null,
        lastError: null,
        createdAt: BigInt(Date.now()) * BigInt(1_000_000),
        updatedAt: BigInt(Date.now()) * BigInt(1_000_000),
      },
      requestedCanisterCycles: 2_000_000_000_000n,
      totalCyclesToConvert: 2_500_000_000_000n,
      childTargetCycles: 2_000_000_000_000n,
      createCallCycles: 2_500_000_000_000n,
      canisterCreationFeeCycles: 500_000_000_000n,
      backendCycles: 3_400_000_000_000n,
      requiredBackendCycles: 2_600_000_000_000n,
      canCreateNow: true,
      buildVersion: "mock",
    },
  }),
  getMyCreatedCollections: async () =>
    sampleCollections.filter((collection) => collection.id === 4n),
  getMyCollectionCanisterStatuses: async () =>
    sampleCollections
      .filter((collection) => collection.id === 4n)
      .map((collection) => ({
        collectionId: collection.id,
        canisterId: collection.canisterId,
        appCanisterId: samplePrincipal,
        controllers: [samplePrincipal, creatorControllerPrincipal],
        cycles: 1_750_000_000_000n,
        moduleInstalled: true,
        freezingThresholdSeconds: 2_592_000n,
        idleCyclesBurnedPerDay: 12_500_000_000n,
      })),
  getMyCollectionCreationRequests: async () => [],
  getMyCollectionCreationRequestsPage: async () => ({
    requests: [],
    nextCursor: null,
    totalCount: 0n,
  }),
  getCollectionCanisterControllers: async (collectionId) => ({
    __kind__: "ok" as const,
    ok: {
      collectionId,
      canisterId:
        sampleCollections.find((collection) => collection.id === collectionId)
          ?.canisterId ?? collectionPrincipal,
      appCanisterId: samplePrincipal,
      controllers: [samplePrincipal, creatorControllerPrincipal],
    },
  }),
  addCollectionCanisterController: async (collectionId, controller) => ({
    __kind__: "ok" as const,
    ok: {
      collectionId,
      canisterId:
        sampleCollections.find((collection) => collection.id === collectionId)
          ?.canisterId ?? collectionPrincipal,
      appCanisterId: samplePrincipal,
      controllers: [samplePrincipal, creatorControllerPrincipal, controller],
    },
  }),
  removeCollectionCanisterController: async (collectionId, controller) => ({
    __kind__: "ok" as const,
    ok: {
      collectionId,
      canisterId:
        sampleCollections.find((collection) => collection.id === collectionId)
          ?.canisterId ?? collectionPrincipal,
      appCanisterId: samplePrincipal,
      controllers: [samplePrincipal, creatorControllerPrincipal].filter(
        (principal) => principal.toString() !== controller.toString(),
      ),
    },
  }),
  getMyDividendNFTs: async () =>
    sampleNFTs
      .filter((nft) => nft.collectionId === 4n)
      .map((nft) => ({
        nft,
        collection: sampleCollections[3],
        claimableE8s: 50_000_000n,
      })),
  getMyDividendNFTsPage: async (cursor, limit) => {
    const dividends = await mockBackend.getMyDividendNFTs();
    const page = paginateMock(dividends, cursor, limit);
    return {
      dividends: page.items,
      nextCursor: page.nextCursor,
      totalCount: page.totalCount,
    };
  },
  getMyPendingAuctionRefunds: async () => [],
  getMyPendingMintPayments: async () => [],
  refreshMyDividendNFTs: async () => mockBackend.getMyDividendNFTs(),
  refreshMyDividendNFTsPage: async (cursor, limit) =>
    mockBackend.getMyDividendNFTsPage(cursor, limit),
  getVaultAccountId: async () => mockAccountId,
  getVaultPrincipal: async () => samplePrincipal,
  isAdmin: async () => true,
  listCollections: async () => sampleCollections,
  listCollectionImportMetasPage: async (cursor, limit) => {
    const page = paginateMock(sampleCollectionImportMetas, cursor, limit);
    return {
      metas: page.items,
      nextCursor: page.nextCursor,
      totalCount: page.totalCount,
    };
  },
  listNFTReportMetasPage: async (cursor, limit) => {
    const page = paginateMock(sampleNFTReportMetas, cursor, limit);
    return {
      reports: page.items,
      nextCursor: page.nextCursor,
      totalCount: page.totalCount,
    };
  },
  listCollectionsPage: async (cursor, limit) => {
    const page = paginateMock(sampleCollections, cursor, limit);
    return {
      collections: page.items,
      nextCursor: page.nextCursor,
      totalCount: page.totalCount,
    };
  },
  mintCollectionNFT: async (collectionId, metadata) => ({
    __kind__: "ok" as const,
    ok: {
      id: BigInt(Math.floor(Math.random() * 1000)),
      tokenId: `${Math.floor(Math.random() * 10000)}`,
      collectionId,
      owner: samplePrincipal,
      registeredAt: BigInt(Date.now()) * BigInt(1_000_000),
      location: "Minted",
      metadata,
    },
  }),
  mintUserNFT: async (metadata) => ({
    __kind__: "ok" as const,
    ok: {
      paymentBlock: BigInt(1),
      nft: {
        id: BigInt(Math.floor(Math.random() * 1000)),
        tokenId: `${Math.floor(Math.random() * 10000)}`,
        collectionId: BigInt(3),
        owner: samplePrincipal,
        registeredAt: BigInt(Date.now()) * BigInt(1_000_000),
        location: "Minted",
        metadata,
      },
    },
  }),
  placeBid: async (listingId, amount) => ({
    ...auctionListing,
    id: listingId,
    highestBid: amount,
  }),
  retryPendingBid: async (listingId) => ({
    ...auctionListing,
    id: listingId,
  }),
  cancelStalePendingBid: async () => undefined,
  retryPendingMintPayment: async () => ({
    __kind__: "err" as const,
    err: "No pending mock mint payment found",
  }),
  prepareVaultDeposit: async () => ({ __kind__: "ok" as const, ok: "Mock deposit prepared" }),
  previewCollectionDividendDisbursement: async () => ({
    __kind__: "err" as const,
    err: "Batch dividend disbursement is disabled. NFT owners collect dividends individually.",
  }),
  previewMyCollectionNFTs: async (collectionId) => ({
    __kind__: "ok" as const,
    ok: sampleNFTs.filter((nft) => nft.collectionId === collectionId),
  }),
  registerNFT: async (collectionId, tokenId, metadata) => ({
    __kind__: "ok" as const,
    ok: {
      id: BigInt(Math.floor(Math.random() * 1000)),
      tokenId,
      collectionId,
      owner: samplePrincipal,
      registeredAt: BigInt(Date.now()) * BigInt(1_000_000),
      location: "Registered",
      metadata,
    },
  }),
  removeCollection: async () => true,
  updateCollectionBrowseInfo: async (collectionId, browseInfo) => {
    const collection =
      sampleCollections.find((item) => item.id === collectionId) ??
      sampleCollections[0];
    return {
      __kind__: "ok" as const,
      ok: {
        ...collection,
        browseInfo: browseInfo ?? undefined,
      },
    };
  },
  recoverCollectionCreationRecord: async (requestId) => ({
    __kind__: "ok" as const,
    ok: {
      id: requestId,
      name: "Recovered setup",
      symbol: "RTRY",
      status: "CyclePaymentSent" as const,
      cyclePaymentBlock: 7n,
      childCanisterId: null,
      collectionId: null,
      lastError: null,
      createdAt: BigInt(Date.now()) * BigInt(1_000_000),
      updatedAt: BigInt(Date.now()) * BigInt(1_000_000),
    },
  }),
  retryAuctionRefund: async () => true,
  retryCollectionCreationRequest: async () => ({
    __kind__: "ok" as const,
    ok: {
      paymentBlock: 7n,
      collection: sampleCollections[3],
    },
  }),
  repairCollectionCreationRequest: async (requestId) =>
    mockBackend.recoverCollectionCreationRecord(requestId),
  retryInstallCollectionCanister: async (collectionId) => ({
    __kind__: "ok" as const,
    ok: sampleCollections.find((collection) => collection.id === collectionId) ??
      sampleCollections[0],
  }),
  topUpCollectionCanisterCycles: async (collectionId, cyclesToTopUp) => ({
    __kind__: "ok" as const,
    ok: {
      collectionId,
      canisterId:
        sampleCollections.find((collection) => collection.id === collectionId)
          ?.canisterId ?? sampleCollections[0].canisterId,
      cyclesRequested: cyclesToTopUp,
      cyclesMinted: cyclesToTopUp,
      cycleCostE8s: 750_000n,
      totalUserDebitE8s: 760_000n,
      paymentBlock: 1n,
      cycleBalance: 2_500_000_000_000n,
    },
  }),
  topUpCanisterCycles: async (targetCanister, cyclesToTopUp) => ({
    __kind__: "ok" as const,
    ok: {
      canisterId: targetCanister,
      cyclesRequested: cyclesToTopUp,
      cyclesMinted: cyclesToTopUp,
      cycleCostE8s: 750_000n,
      totalUserDebitE8s: 760_000n,
      paymentBlock: 1n,
      cycleBalance: 2_500_000_000_000n,
    },
  }),
  topUpAppCanisterCycles: async (cyclesToTopUp) => ({
    __kind__: "ok" as const,
    ok: {
      canisterId: samplePrincipal,
      cyclesRequested: cyclesToTopUp,
      cyclesMinted: cyclesToTopUp,
      cycleCostE8s: 750_000n,
      totalUserDebitE8s: 760_000n,
      paymentBlock: 1n,
      cycleBalance: 2_500_000_000_000n,
    },
  }),
  upgradeCollectionCanister: async (collectionId) => ({
    __kind__: "ok" as const,
    ok: sampleCollections.find((collection) => collection.id === collectionId) ??
      sampleCollections[0],
  }),
  sendNFT: async () => ({ __kind__: "ok" as const, ok: "mock-tx-id" }),
  reportCollection: async (collectionId, reason) => ({
    __kind__: "ok" as const,
    ok: {
      ...mockCollectionMeta(collectionId, "Reported"),
      trustStatus: "Reported" as const,
      reportCount: 1n,
      lastReportedAt: BigInt(Date.now()) * BigInt(1_000_000),
      lastReportReason: reason,
    },
  }),
  reportNFT: async (collectionId, tokenId, reason) => ({
    __kind__: "ok" as const,
    ok: {
      ...mockNFTReportMeta(collectionId, tokenId, "Open"),
      lastReportReason: reason,
    },
  }),
  syncExternalNFTOwner: async (collectionId, tokenId, owner) => ({
    __kind__: "ok" as const,
    ok: {
      id: BigInt(Math.floor(Math.random() * 1000)),
      tokenId,
      collectionId,
      owner,
      registeredAt: BigInt(Date.now()) * BigInt(1_000_000),
      location: "Registered",
      metadata: {
        name: `Synced #${tokenId}`,
        description: "Mock synced external NFT.",
        imageUrl: "https://picsum.photos/seed/synced-external/400/400",
        attributes: [],
      },
    },
  }),
  setCollectionCanisterWasm: async () => undefined,
  settleAuction: async () => undefined,
  syncCollectionDividends: async (collectionId) => ({
    __kind__: "ok" as const,
    ok: {
      collectionId,
      depositedE8s: 100_000_000n,
      distributedE8s: 100_000_000n,
      shareE8s: 50_000_000n,
      remainderE8s: 0n,
      nftCount: 2n,
      balanceE8s: 100_000_000n,
    },
  }),
  getCollectionIndexStatus: async (collectionId) => ({
    collectionId,
    cursor: null,
    scanned: 0n,
    indexed: 0n,
    complete: false,
    lastError: null,
    updatedAt: BigInt(Date.now()) * BigInt(1_000_000),
  }),
  indexCollectionOwnershipPage: async (collectionId, cursor, limit) => ({
    __kind__: "ok" as const,
    ok: {
      collectionId,
      scanned: limit,
      indexed: limit,
      nextCursor: cursor == null ? "100" : null,
      complete: cursor != null,
      error: null,
    },
  }),
  transferICPOut: async () => ({ __kind__: "Ok", Ok: BigInt(1) }),
  transferICPOutWithClientNonce: async () => ({
    __kind__: "Ok",
    Ok: BigInt(1),
  }),
  getCollectionNFTs: async (collectionId) => sampleCollectionNFTs(collectionId),
  getCollectionNFT: async (collectionId, tokenId) =>
    sampleCollectionNFTs(collectionId).find((n) => n.tokenId === tokenId) ?? null,
  lookupCollectionNFT: async (collectionId, tokenId) => {
    const existing = sampleCollectionNFTs(collectionId).find(
      (n) => n.tokenId === tokenId,
    );
    if (existing) return { __kind__: "ok" as const, ok: existing };
    return {
      __kind__: "ok" as const,
      ok: {
        id: BigInt(Number.parseInt(tokenId, 10) || 0),
        tokenId,
        collectionId,
        owner: samplePrincipal,
        registeredAt: 0n,
        location: "Registered",
        metadata: {
          name: `Mock NFT #${tokenId}`,
          description: "Direct lookup mock result.",
          imageUrl: `https://picsum.photos/seed/lookup-${collectionId}-${tokenId}/400/400`,
          attributes: [],
        },
      },
    };
  },
  isNFTInUserWallet: async () => false,
  syncUserNFTs: async () => ({
    __kind__: "ok" as const,
    ok: { newCount: 0n, errors: [] as string[] },
  }),
  syncUserNFTsV2: async () => ({
    __kind__: "ok" as const,
    ok: { newCount: 0n, errors: [] as string[], skipped: [] },
  }),
  syncUserNFTsPage: async () => ({
    __kind__: "ok" as const,
    ok: {
      newCount: 0n,
      errors: [] as string[],
      skipped: [],
      nextCursor: null,
      complete: true,
      checkedCollections: 0n,
    },
  }),
  syncUserNFTsForCollection: async () => ({
    __kind__: "ok" as const,
    ok: {
      newCount: 0n,
      errors: [] as string[],
      skipped: [],
      nextCursor: null,
      complete: true,
      checkedCollections: 1n,
    },
  }),
  syncUserNFTsForCollectionV2: async (collectionId) => ({
    __kind__: "ok" as const,
    ok: {
      collectionId,
      newCount: 0n,
      errors: [] as string[],
      skipped: [],
      scannedThisRun: 50n,
      indexedThisRun: 50n,
      nextCursor: "50",
      complete: false,
      status: {
        collectionId,
        cursor: "50",
        scanned: 50n,
        indexed: 50n,
        complete: false,
        lastError: null,
        updatedAt: BigInt(Date.now()) * BigInt(1_000_000),
      },
    },
  }),
};
