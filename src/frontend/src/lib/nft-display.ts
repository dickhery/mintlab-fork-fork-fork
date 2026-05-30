import type { Collection, NFTMetadata, WalletNFT } from "@/types";

const DISPLAY_TOKEN_KEYS = new Set([
  "mintlab display token id",
  "mintlab:display_token_id",
  "display token id",
  "display_token_id",
]);

function normalizeAttributeKey(key: string): string {
  return key.trim().toLowerCase();
}

export function getNFTDisplayTokenId(nft: WalletNFT): string | null {
  for (const [key, value] of nft.metadata.attributes) {
    if (DISPLAY_TOKEN_KEYS.has(normalizeAttributeKey(key))) {
      const trimmed = value.trim();
      return trimmed.length > 0 ? trimmed : null;
    }
  }
  return null;
}

export function getNFTDisplayName(
  nft: WalletNFT,
  collection?: Collection | null,
): string {
  const displayTokenId = getNFTDisplayTokenId(nft);
  if (displayTokenId) {
    return `${collection?.name ?? "NFT"} #${displayTokenId}`;
  }
  return nft.metadata.name ?? `NFT #${nft.tokenId}`;
}

export function getNFTTokenLabel(nft: WalletNFT): string {
  const displayTokenId = getNFTDisplayTokenId(nft);
  return `Token #${displayTokenId ?? nft.tokenId}`;
}

export function getNFTVisibleAttributes(
  metadata: NFTMetadata,
): Array<[string, string]> {
  return metadata.attributes.filter(
    ([key]) => !DISPLAY_TOKEN_KEYS.has(normalizeAttributeKey(key)),
  );
}
