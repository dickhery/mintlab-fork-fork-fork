export const DEFAULT_SHARE_IMAGE =
  "https://richardhery.com/mintlab-link-preview.png";

function envString(key: string): string | undefined {
  const value = (import.meta.env as Record<string, string | undefined>)[key];
  return value && value !== "undefined" ? value : undefined;
}

function envSharePreviewOrigin(): string | undefined {
  return envString("VITE_SHARE_PREVIEW_ORIGIN");
}

function envBackendCanisterId(): string | undefined {
  for (const key of [
    "VITE_BACKEND_CANISTER_ID",
    "VITE_CANISTER_ID_BACKEND",
    "CANISTER_ID_BACKEND",
  ]) {
    const value = envString(key);
    if (value) return value;
  }
  return undefined;
}

export function appOrigin(): string {
  if (typeof window !== "undefined" && window.location.origin) {
    return window.location.origin;
  }
  return "";
}

/** Backend HTTP origin used for crawler-friendly Open Graph HTML. */
export function sharePreviewOrigin(): string {
  const configured = envSharePreviewOrigin();
  if (configured) {
    return configured.replace(/\/$/, "");
  }
  const backendId = envBackendCanisterId();
  if (backendId) {
    return `https://${backendId}.raw.icp0.io`;
  }
  return appOrigin();
}

export function appPageUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${appOrigin()}${normalized}`;
}

export function listingSharePath(listingId: bigint | string): string {
  return `/marketplace/listing/${listingId.toString()}`;
}

export function listingShareUrl(listingId: bigint | string): string {
  return `${sharePreviewOrigin()}${listingSharePath(listingId)}`;
}

export function nftSharePath(
  collectionId: bigint | string,
  tokenId: string,
): string {
  const encodedTokenId = encodeURIComponent(tokenId);
  return `/nft/${collectionId.toString()}/${encodedTokenId}`;
}

export function nftShareUrl(
  collectionId: bigint | string,
  tokenId: string,
): string {
  return `${sharePreviewOrigin()}${nftSharePath(collectionId, tokenId)}`;
}
