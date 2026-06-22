import { j as jsxRuntimeExports, a as cn } from "./index-DrbJ3Dgs.js";
import { a as collectionTrustStatus, b as collectionTrustLabel, d as collectionTrustDescription, e as collectionTrustBadgeClass } from "./ZoomableMediaImage-nkA4xSpd.js";
import { r as resolveImageUrl } from "./media-D3kuYwrv.js";
function getStandardLabel(standard) {
  if (standard.__kind__ === "EXT") return "EXT";
  if (standard.__kind__ === "DIP721") return "DIP-721";
  if (standard.__kind__ === "ICRC7") return "ICRC-7";
  return standard.Other ?? "Unknown";
}
function CollectionBadge({
  collection,
  trustStatus,
  size = "md",
  className
}) {
  const standardLabel = getStandardLabel(collection.standard);
  const resolvedTrustStatus = trustStatus ?? collectionTrustStatus(collection, null);
  const trustLabel = collectionTrustLabel(resolvedTrustStatus, collection);
  const imageUrl = resolveImageUrl(collection.imageUrl);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("flex items-center gap-1.5 min-w-0", className), children: [
    imageUrl && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "img",
      {
        src: imageUrl,
        alt: collection.name,
        className: cn(
          "rounded-full object-cover shrink-0 border border-border/60",
          size === "sm" ? "w-4 h-4" : "w-5 h-5"
        )
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "span",
      {
        className: cn(
          "font-medium truncate text-muted-foreground",
          size === "sm" ? "text-xs" : "text-sm"
        ),
        children: collection.name
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "span",
      {
        className: cn(
          "shrink-0 px-1.5 py-0.5 rounded font-mono bg-muted/60 text-muted-foreground border border-border/40",
          size === "sm" ? "text-[10px]" : "text-xs"
        ),
        children: standardLabel
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "span",
      {
        className: cn(
          "shrink-0 px-1.5 py-0.5 rounded border",
          collectionTrustBadgeClass(resolvedTrustStatus),
          size === "sm" ? "text-[10px]" : "text-xs"
        ),
        title: collectionTrustDescription(resolvedTrustStatus, collection),
        children: trustLabel
      }
    )
  ] });
}
const WITHDRAW_TO_EXTERNAL_WALLET_LABEL = "Withdraw to external wallet";
const VAULTED_PURCHASE_NOTICE = "Buying this vaulted NFT keeps it in Mintlab custody until you withdraw it.";
function nftCustodyLabel(location) {
  if (location === "Registered") return "Registered external wallet NFT";
  if (location === "Vaulted") return "Vaulted in Mintlab";
  return "Minted NFT";
}
function nftCustodyClass(location) {
  if (location === "Registered") {
    return "bg-muted/80 text-muted-foreground border-border/60";
  }
  if (location === "Vaulted") {
    return "bg-primary/10 text-primary border-primary/20";
  }
  return "bg-accent/10 text-accent border-accent/20";
}
function nftCustodyDescription(nft, collection) {
  if (nft.location === "Registered") {
    return "Mintlab is showing a registered wallet record for an external NFT that remains in your wallet on the original collection canister.";
  }
  if (nft.location === "Vaulted") {
    return "The original external NFT is held by the Mintlab canister vault. The in-app owner can withdraw it to an external wallet principal.";
  }
  const collectionName = (collection == null ? void 0 : collection.name) ?? "its collection";
  return `This NFT was minted into ${collectionName} and transfers through that collection canister.`;
}
function isVaultedInMintlab(nft) {
  return (nft == null ? void 0 : nft.location) === "Vaulted";
}
export {
  CollectionBadge as C,
  VAULTED_PURCHASE_NOTICE as V,
  WITHDRAW_TO_EXTERNAL_WALLET_LABEL as W,
  nftCustodyClass as a,
  nftCustodyDescription as b,
  isVaultedInMintlab as i,
  nftCustodyLabel as n
};
