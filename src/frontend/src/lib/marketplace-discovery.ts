import { getNFTDisplayName, getNFTTokenLabel } from "@/lib/nft-display";
import type {
  AuctionListing,
  Collection,
  FixedListing,
  WalletNFT,
} from "@/types";

export type MarketplaceSort =
  | "newest"
  | "price-asc"
  | "price-desc"
  | "ending-soon";

export type MarketplaceTrustFilter = "all" | "verified" | "community";

export type MarketplaceTab = "all" | "fixed" | "auctions";

export type MarketplaceSearchState = {
  q?: string;
  collection?: string;
  trust?: MarketplaceTrustFilter;
  sort?: MarketplaceSort;
  tab?: MarketplaceTab;
};

export type MarketplaceListingKind = "fixed" | "auction";

export type DiscoverableListingItem = {
  kind: MarketplaceListingKind;
  listing: FixedListing | AuctionListing;
  nft: WalletNFT;
  collection?: Collection;
};

const TRUST_FILTERS: MarketplaceTrustFilter[] = [
  "all",
  "verified",
  "community",
];
const SORT_OPTIONS: MarketplaceSort[] = [
  "newest",
  "price-asc",
  "price-desc",
  "ending-soon",
];
const TAB_OPTIONS: MarketplaceTab[] = ["all", "fixed", "auctions"];

export function parseMarketplaceSearch(
  search: Record<string, unknown>,
): MarketplaceSearchState {
  const trust = TRUST_FILTERS.includes(search.trust as MarketplaceTrustFilter)
    ? (search.trust as MarketplaceTrustFilter)
    : undefined;
  const sort = SORT_OPTIONS.includes(search.sort as MarketplaceSort)
    ? (search.sort as MarketplaceSort)
    : undefined;
  const tab = TAB_OPTIONS.includes(search.tab as MarketplaceTab)
    ? (search.tab as MarketplaceTab)
    : undefined;

  return {
    q: typeof search.q === "string" && search.q.trim() ? search.q : undefined,
    collection:
      typeof search.collection === "string" && search.collection.trim()
        ? search.collection
        : undefined,
    trust,
    sort,
    tab,
  };
}

export function listingIdFromItem(item: DiscoverableListingItem): bigint {
  return item.listing.id;
}

export function listingPriceE8s(item: DiscoverableListingItem): bigint {
  if (item.kind === "fixed") {
    return (item.listing as FixedListing).price;
  }
  const auction = item.listing as AuctionListing;
  return auction.highestBid > 0n ? auction.highestBid : auction.startingBid;
}

export function listingCreatedAt(item: DiscoverableListingItem): bigint {
  return item.listing.createdAt;
}

export function listingEndTime(item: DiscoverableListingItem): bigint | null {
  if (item.kind !== "auction") return null;
  return (item.listing as AuctionListing).endTime;
}

export function matchesMarketplaceSearch(
  item: DiscoverableListingItem,
  query: string,
): boolean {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;

  const collection = item.collection;
  const nft = item.nft;
  const seller = item.listing.seller.toString().toLowerCase();
  const haystack = [
    getNFTDisplayName(nft, collection),
    getNFTTokenLabel(nft, collection),
    nft.tokenId,
    collection?.name,
    collection?.symbol,
    collection?.canisterId.toString(),
    seller,
    item.listing.id.toString(),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return haystack.includes(normalized);
}

export function filterMarketplaceListings<T extends DiscoverableListingItem>(
  items: T[],
  options: {
    query: string;
    collectionId: string | null;
    trust: MarketplaceTrustFilter;
    isVerified: (item: T) => boolean;
  },
): T[] {
  const query = options.query.trim();

  return items.filter((item) => {
    if (
      options.collectionId &&
      item.nft.collectionId.toString() !== options.collectionId
    ) {
      return false;
    }

    const verified = options.isVerified(item);
    if (options.trust === "verified" && !verified) return false;
    if (options.trust === "community" && verified) return false;
    if (query && !matchesMarketplaceSearch(item, query)) return false;
    return true;
  });
}

export function sortMarketplaceListings<T extends DiscoverableListingItem>(
  items: T[],
  sort: MarketplaceSort,
): T[] {
  const sorted = [...items];

  switch (sort) {
    case "price-asc":
      sorted.sort((a, b) => {
        const diff = listingPriceE8s(a) - listingPriceE8s(b);
        if (diff !== 0n) return diff < 0n ? -1 : 1;
        return Number(listingCreatedAt(b) - listingCreatedAt(a));
      });
      return sorted;
    case "price-desc":
      sorted.sort((a, b) => {
        const diff = listingPriceE8s(b) - listingPriceE8s(a);
        if (diff !== 0n) return diff < 0n ? -1 : 1;
        return Number(listingCreatedAt(b) - listingCreatedAt(a));
      });
      return sorted;
    case "ending-soon":
      sorted.sort((a, b) => {
        const aEnd = listingEndTime(a);
        const bEnd = listingEndTime(b);
        if (aEnd == null && bEnd == null) {
          return Number(listingCreatedAt(b) - listingCreatedAt(a));
        }
        if (aEnd == null) return 1;
        if (bEnd == null) return -1;
        const diff = aEnd - bEnd;
        if (diff !== 0n) return diff < 0n ? -1 : 1;
        return Number(listingCreatedAt(b) - listingCreatedAt(a));
      });
      return sorted;
    default:
      sorted.sort((a, b) => Number(listingCreatedAt(b) - listingCreatedAt(a)));
      return sorted;
  }
}
