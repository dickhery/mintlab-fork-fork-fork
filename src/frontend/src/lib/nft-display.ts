import type { Collection, NFTMetadata, WalletNFT } from "@/types";
import { Principal } from "@dfinity/principal";

const DISPLAY_TOKEN_KEYS = new Set([
  "mintlab display token id",
  "mintlab:display_token_id",
  "display token id",
  "display_token_id",
]);

const EXT_TOKEN_PREFIX = [10, 116, 105, 100] as const;
const EXT_MAX_TOKEN_INDEX = 4_294_967_295n;

function normalizeAttributeKey(key: string): string {
  return key.trim().toLowerCase();
}

function isEXTCollection(collection?: Collection | null): boolean {
  return collection?.standard.__kind__ === "EXT";
}

function parseNatText(value: string): bigint | null {
  const trimmed = value.trim();
  if (!/^\d+$/.test(trimmed)) return null;
  try {
    return BigInt(trimmed);
  } catch {
    return null;
  }
}

function extDisplayTokenNumber(
  collection: Collection,
  tokenIndex: bigint,
): string {
  const offset = collection.browseInfo?.tokenIndexOffset ?? 0n;
  if (tokenIndex >= offset) {
    return (tokenIndex - offset + 1n).toString();
  }
  return (tokenIndex + 1n).toString();
}

function bytesEqual(
  bytes: Uint8Array,
  offset: number,
  expected: Uint8Array,
): boolean {
  for (let index = 0; index < expected.length; index += 1) {
    if (bytes[offset + index] !== expected[index]) return false;
  }
  return true;
}

function decodeEXTTokenIndex(
  tokenId: string,
  collection: Collection,
): bigint | null {
  const numericIndex = parseNatText(tokenId);
  if (numericIndex != null) {
    return numericIndex <= EXT_MAX_TOKEN_INDEX ? numericIndex : null;
  }

  try {
    const tokenBytes = Principal.fromText(tokenId).toUint8Array();
    const canisterBytes = Principal.fromText(
      collection.canisterId.toString(),
    ).toUint8Array();
    if (tokenBytes.length !== canisterBytes.length + 8) return null;
    for (let index = 0; index < EXT_TOKEN_PREFIX.length; index += 1) {
      if (tokenBytes[index] !== EXT_TOKEN_PREFIX[index]) return null;
    }
    if (!bytesEqual(tokenBytes, EXT_TOKEN_PREFIX.length, canisterBytes)) {
      return null;
    }
    const start = tokenBytes.length - 4;
    return (
      (BigInt(tokenBytes[start]) << 24n) +
      (BigInt(tokenBytes[start + 1]) << 16n) +
      (BigInt(tokenBytes[start + 2]) << 8n) +
      BigInt(tokenBytes[start + 3])
    );
  } catch {
    return null;
  }
}

function getEXTDisplayTokenId(
  nft: WalletNFT,
  collection?: Collection | null,
): string | null {
  if (!isEXTCollection(collection) || !collection) return null;
  const tokenIndex = decodeEXTTokenIndex(nft.tokenId, collection);
  return tokenIndex == null
    ? null
    : extDisplayTokenNumber(collection, tokenIndex);
}

function getMetadataDisplayTokenId(nft: WalletNFT): string | null {
  for (const [key, value] of nft.metadata.attributes) {
    if (DISPLAY_TOKEN_KEYS.has(normalizeAttributeKey(key))) {
      const trimmed = value.trim();
      return trimmed.length > 0 ? trimmed : null;
    }
  }
  return null;
}

export function getNFTDisplayTokenId(
  nft: WalletNFT,
  collection?: Collection | null,
): string | null {
  return (
    getEXTDisplayTokenId(nft, collection) ?? getMetadataDisplayTokenId(nft)
  );
}

export function getNFTDisplayName(
  nft: WalletNFT,
  collection?: Collection | null,
): string {
  const displayTokenId = getNFTDisplayTokenId(nft, collection);
  if (displayTokenId) {
    return `${collection?.name ?? "NFT"} #${displayTokenId}`;
  }
  return nft.metadata.name ?? `NFT #${nft.tokenId}`;
}

export function getNFTTokenLabel(
  nft: WalletNFT,
  collection?: Collection | null,
): string {
  const displayTokenId = getNFTDisplayTokenId(nft, collection);
  return `Token #${displayTokenId ?? nft.tokenId}`;
}

export function getNFTVisibleAttributes(
  metadata: NFTMetadata,
): Array<[string, string]> {
  return metadata.attributes.filter(
    ([key]) => !DISPLAY_TOKEN_KEYS.has(normalizeAttributeKey(key)),
  );
}
