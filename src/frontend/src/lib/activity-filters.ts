import type {
  RecentTransaction,
  TransactionDirection,
  TransactionKind,
  TransactionStatus,
} from "@/types";

export type ActivityScope =
  | "all"
  | "nft"
  | "marketplace"
  | "icp"
  | "dividends"
  | "collections";

export type ActivitySearchState = {
  q?: string;
  scope?: ActivityScope;
  kind?: TransactionKind;
  status?: TransactionStatus;
  direction?: TransactionDirection;
};

const SCOPES: ActivityScope[] = [
  "all",
  "nft",
  "marketplace",
  "icp",
  "dividends",
  "collections",
];

const STATUSES: TransactionStatus[] = ["Pending", "Completed", "Failed"];
const DIRECTIONS: TransactionDirection[] = ["In", "Out", "Neutral"];

const KINDS: TransactionKind[] = [
  "ICPTransferOut",
  "Mint",
  "CollectionCreation",
  "CollectionCanisterTopUp",
  "AppCanisterTopUp",
  "MarketplacePurchase",
  "MarketplaceSale",
  "AuctionBid",
  "AuctionRefund",
  "DividendClaim",
];

export function parseActivitySearch(
  search: Record<string, unknown>,
): ActivitySearchState {
  const scope = SCOPES.includes(search.scope as ActivityScope)
    ? (search.scope as ActivityScope)
    : undefined;
  const kind = KINDS.includes(search.kind as TransactionKind)
    ? (search.kind as TransactionKind)
    : undefined;
  const status = STATUSES.includes(search.status as TransactionStatus)
    ? (search.status as TransactionStatus)
    : undefined;
  const direction = DIRECTIONS.includes(
    search.direction as TransactionDirection,
  )
    ? (search.direction as TransactionDirection)
    : undefined;

  return {
    q: typeof search.q === "string" && search.q.trim() ? search.q : undefined,
    scope,
    kind,
    status,
    direction,
  };
}

export function isNFTTransaction(tx: RecentTransaction): boolean {
  if (
    tx.kind === "Mint" ||
    tx.kind === "MarketplacePurchase" ||
    tx.kind === "MarketplaceSale"
  ) {
    return true;
  }
  if (tx.title === "NFT sent" || tx.title === "NFT received") {
    return true;
  }
  if (!tx.reference) return false;
  return (
    tx.reference.startsWith("nft-transfer:") ||
    tx.reference.startsWith("nft-vault-transfer:") ||
    tx.reference.startsWith("mock-nft-")
  );
}

export function matchesActivityScope(
  tx: RecentTransaction,
  scope: ActivityScope,
): boolean {
  switch (scope) {
    case "nft":
      return isNFTTransaction(tx);
    case "marketplace":
      return (
        tx.kind === "MarketplacePurchase" ||
        tx.kind === "MarketplaceSale" ||
        tx.kind === "AuctionBid" ||
        tx.kind === "AuctionRefund"
      );
    case "icp":
      return tx.kind === "ICPTransferOut";
    case "dividends":
      return tx.kind === "DividendClaim";
    case "collections":
      return (
        tx.kind === "Mint" ||
        tx.kind === "CollectionCreation" ||
        tx.kind === "CollectionCanisterTopUp" ||
        tx.kind === "AppCanisterTopUp"
      );
    default:
      return true;
  }
}

export function matchesActivitySearch(
  tx: RecentTransaction,
  query: string,
): boolean {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;

  const haystack = [
    tx.title,
    tx.detail,
    tx.reference,
    tx.kind,
    tx.status,
    tx.direction,
    tx.blockIndex?.toString(),
    tx.id.toString(),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return haystack.includes(normalized);
}

export function filterActivityTransactions(
  transactions: RecentTransaction[],
  options: {
    query: string;
    scope: ActivityScope;
    kind: TransactionKind | "all";
    status: TransactionStatus | "all";
    direction: TransactionDirection | "all";
  },
): RecentTransaction[] {
  return transactions.filter((tx) => {
    if (!matchesActivityScope(tx, options.scope)) return false;
    if (options.kind !== "all" && tx.kind !== options.kind) return false;
    if (options.status !== "all" && tx.status !== options.status) return false;
    if (options.direction !== "all" && tx.direction !== options.direction) {
      return false;
    }
    if (!matchesActivitySearch(tx, options.query)) return false;
    return true;
  });
}

export const ACTIVITY_SCOPE_LABELS: Record<ActivityScope, string> = {
  all: "All activity",
  nft: "NFTs",
  marketplace: "Marketplace",
  icp: "ICP transfers",
  dividends: "Dividends",
  collections: "Collections & mints",
};
