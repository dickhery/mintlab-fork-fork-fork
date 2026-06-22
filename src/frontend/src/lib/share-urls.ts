export function appOrigin(): string {
  if (typeof window !== "undefined" && window.location.origin) {
    return window.location.origin;
  }
  return "";
}

export function listingSharePath(listingId: bigint | string): string {
  return `/marketplace/listing/${listingId.toString()}`;
}

export function listingShareUrl(listingId: bigint | string): string {
  return `${appOrigin()}${listingSharePath(listingId)}`;
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
  return `${appOrigin()}${nftSharePath(collectionId, tokenId)}`;
}
