import type {
  Collection,
  CollectionImportMeta,
  CollectionTrustStatus,
} from "@/types";

export const COMMUNITY_COLLECTION_NOTICE =
  "Unverified community collections are imported from external canisters. Mintlab has not confirmed authenticity, ownership history, or content safety.";

export function collectionMetaMap(
  metas: CollectionImportMeta[] = [],
): Map<string, CollectionImportMeta> {
  return new Map(metas.map((meta) => [meta.collectionId.toString(), meta]));
}

export function collectionTrustStatus(
  collection: Collection,
  meta?: CollectionImportMeta | null,
): CollectionTrustStatus {
  if (collection.kind === "Minted") return "Verified";
  return meta?.trustStatus ?? "CommunityImported";
}

export function isMintlabVerifiedCollection(
  collection: Collection,
  meta?: CollectionImportMeta | null,
): boolean {
  return (
    collection.kind === "Minted" ||
    collectionTrustStatus(collection, meta) === "Verified"
  );
}

export function isCommunityCollection(
  collection: Collection,
  meta?: CollectionImportMeta | null,
): boolean {
  return !isMintlabVerifiedCollection(collection, meta);
}

function hasBrowseRange(collection?: Collection | null): boolean {
  return collection?.browseInfo?.totalSupply != null;
}

export function collectionTrustLabel(
  status: CollectionTrustStatus,
  collection?: Collection | null,
): string {
  switch (status) {
    case "Verified":
      return "Mintlab verified";
    case "Hidden":
      return "Hidden";
    case "Blocked":
      return "Blocked";
    case "SyncDisabled":
      return "Sync disabled";
    case "NeedsBrowseInfo":
      return hasBrowseRange(collection)
        ? "Token range set"
        : "Needs token range";
    case "Reported":
      return "Reported";
    case "CommunityImported":
      return "Unverified";
    default:
      return "Unverified";
  }
}

export function collectionTrustDescription(
  status: CollectionTrustStatus,
  collection?: Collection | null,
): string {
  switch (status) {
    case "Verified":
      return "Mintlab has reviewed this collection.";
    case "Hidden":
      return "This collection is hidden from public browsing while admins review it.";
    case "Blocked":
      return "This collection is blocked by Mintlab moderation.";
    case "SyncDisabled":
      return "Automatic wallet sync is disabled for this imported collection.";
    case "NeedsBrowseInfo":
      return hasBrowseRange(collection)
        ? "Mintlab has token range details for this collection. Admins can review it when ready."
        : "Admins need a token range before Mintlab can browse this collection reliably.";
    case "Reported":
      return "Users have reported this imported collection for admin review.";
    case "CommunityImported":
      return COMMUNITY_COLLECTION_NOTICE;
    default:
      return COMMUNITY_COLLECTION_NOTICE;
  }
}

export function collectionTrustBadgeClass(
  status: CollectionTrustStatus,
): string {
  switch (status) {
    case "Verified":
      return "bg-emerald-500/10 text-emerald-700 border-emerald-500/25";
    case "Hidden":
    case "Blocked":
      return "bg-red-500/10 text-red-700 border-red-500/25";
    case "Reported":
      return "bg-amber-500/10 text-amber-700 border-amber-500/25";
    case "SyncDisabled":
    case "NeedsBrowseInfo":
      return "bg-sky-500/10 text-sky-700 border-sky-500/25";
    case "CommunityImported":
      return "bg-amber-500/10 text-amber-700 border-amber-500/25";
    default:
      return "bg-amber-500/10 text-amber-700 border-amber-500/25";
  }
}
