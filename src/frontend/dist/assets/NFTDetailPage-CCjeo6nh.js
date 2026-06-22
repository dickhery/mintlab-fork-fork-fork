import { z as useParams, p as useNavigate, i as useBackend, r as reactExports, n as useQuery, g as getNFTDisplayName, j as jsxRuntimeExports, E as LoadingSpinner, w as getNFTVisibleAttributes, B as Button, s as getNFTTokenLabel, v as getNFTDisplayTokenId, S as ShoppingBag, q as Link } from "./index-BSFYQ4AG.js";
import { C as CollectionBadge, n as nftCustodyLabel, a as nftCustodyClass, b as nftCustodyDescription } from "./nft-custody-Dse1DCHz.js";
import { E as EmptyState } from "./EmptyState-DiYXFWvQ.js";
import { n as nftShareUrl, a as appPageUrl, d as nftSharePath, S as ShareLinkButton } from "./share-urls-CB6ZSqHb.js";
import { c as collectionMetaMap, a as collectionTrustStatus, Z as ZoomableMediaImage } from "./ZoomableMediaImage-CxufzEEx.js";
import { B as Badge } from "./badge-CG_50zJx.js";
import { u as usePageMeta } from "./use-page-meta-D-plpMMV.js";
import { r as resolveImageUrl, I as ImageOff } from "./media-Bak1Mo1k.js";
import { A as ArrowLeft } from "./arrow-left-D30khu1c.js";
import { G as Gavel } from "./gavel-03RcJFeV.js";
import { E as ExternalLink } from "./external-link-DJsHhQno.js";
import "./MediaImage-DvIbuAU7.js";
import "./dialog-DaD49ONY.js";
function NFTImagePlaceholder({ name }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-full w-full flex-col items-center justify-center gap-2 bg-muted/60", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(ImageOff, { className: "h-8 w-8 text-muted-foreground/40" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "max-w-full truncate px-2 text-center text-xs text-muted-foreground/60", children: name })
  ] });
}
function NFTDetailPage() {
  const { collectionId: collectionIdParam, tokenId: tokenIdParam } = useParams({
    from: "/nft/$collectionId/$tokenId"
  });
  const navigate = useNavigate();
  const { actor, isFetching } = useBackend();
  const collectionId = reactExports.useMemo(() => {
    try {
      return BigInt(collectionIdParam);
    } catch {
      return null;
    }
  }, [collectionIdParam]);
  const tokenId = reactExports.useMemo(() => {
    if (!tokenIdParam) return null;
    try {
      return decodeURIComponent(tokenIdParam);
    } catch {
      return tokenIdParam;
    }
  }, [tokenIdParam]);
  const { data: collection, isLoading: collectionLoading } = useQuery({
    queryKey: ["collection", collectionId == null ? void 0 : collectionId.toString()],
    queryFn: async () => {
      if (!actor || collectionId == null) return null;
      return actor.getCollection(collectionId);
    },
    enabled: !!actor && !isFetching && collectionId != null
  });
  const { data: importMetas = [] } = useQuery({
    queryKey: ["collectionImportMetas", "nft-detail"],
    queryFn: async () => {
      if (!actor) return [];
      const page = await actor.listCollectionImportMetasPage(null, 100n);
      return page.metas;
    },
    enabled: !!actor && !isFetching
  });
  const importMetaMap = collectionMetaMap(importMetas);
  const trustStatus = collection ? collectionTrustStatus(
    collection,
    importMetaMap.get(collection.id.toString())
  ) : null;
  const { data: nft, isLoading: nftLoading } = useQuery({
    queryKey: ["collectionNFT", collectionId == null ? void 0 : collectionId.toString(), tokenId],
    queryFn: async () => {
      if (!actor || collectionId == null || !tokenId) return null;
      return actor.getCollectionNFT(collectionId, tokenId);
    },
    enabled: !!actor && !isFetching && collectionId != null && !!tokenId
  });
  const { data: activeListing } = useQuery({
    queryKey: ["nftActiveListing", collectionId == null ? void 0 : collectionId.toString(), tokenId],
    queryFn: async () => {
      if (!actor || collectionId == null || !tokenId) return null;
      const details = await actor.getActiveListingDetails();
      return details.find(
        (detail) => detail.nft.collectionId === collectionId && detail.nft.tokenId === tokenId
      ) ?? null;
    },
    enabled: !!actor && !isFetching && collectionId != null && !!tokenId
  });
  const isLoading = collectionLoading || nftLoading;
  const shareUrl = collectionId != null && tokenId ? nftShareUrl(collectionId, tokenId) : "";
  const pageMeta = reactExports.useMemo(() => {
    var _a;
    if (!collection || !nft || collectionId == null || !tokenId) {
      return {};
    }
    const name = getNFTDisplayName(nft, collection);
    return {
      title: `${name} — Mintlab`,
      description: ((_a = nft.metadata.description) == null ? void 0 : _a.trim()) || `${name} on Mintlab.`,
      image: resolveImageUrl(nft.metadata.imageUrl, {
        canisterId: collection.canisterId.toString(),
        tokenId: nft.tokenId
      }),
      url: appPageUrl(nftSharePath(collectionId, tokenId))
    };
  }, [collection, collectionId, nft, tokenId]);
  usePageMeta(pageMeta);
  if (collectionId == null || !tokenId) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-3xl px-4 py-16", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      EmptyState,
      {
        icon: ImageOff,
        title: "Invalid NFT link",
        description: "This URL is missing a valid collection ID or token ID.",
        action: {
          label: "Browse marketplace",
          onClick: () => void navigate({ to: "/marketplace" })
        }
      }
    ) });
  }
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-[50vh] items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, { size: "lg", label: "Loading NFT…" }) });
  }
  if (!collection || !nft) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-3xl px-4 py-16", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      EmptyState,
      {
        icon: ImageOff,
        title: "NFT not found",
        description: "Mintlab could not load this NFT from the shared collection directory.",
        action: {
          label: "Browse collections",
          onClick: () => void navigate({ to: "/collections" })
        }
      }
    ) });
  }
  const nftName = getNFTDisplayName(nft, collection);
  const visibleAttributes = getNFTVisibleAttributes(nft.metadata);
  const canisterId = collection.canisterId.toString();
  const canisterUrl = `https://dashboard.internetcomputer.org/canister/${canisterId}`;
  const listingId = (activeListing == null ? void 0 : activeListing.listing.__kind__) === "Fixed" ? activeListing.listing.Fixed.id : (activeListing == null ? void 0 : activeListing.listing.__kind__) === "Auction" ? activeListing.listing.Auction.id : null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", "data-ocid": "nft_detail.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b border-border bg-card/80 backdrop-blur-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "ghost",
          size: "sm",
          className: "gap-2",
          onClick: () => window.history.length > 1 ? window.history.back() : void navigate({ to: "/collections" }),
          "data-ocid": "nft_detail.back_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }),
            "Back"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ShareLinkButton, { url: shareUrl, "data-ocid": "nft_detail.share_button" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,420px)] lg:px-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-hidden rounded-2xl border border-border bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-square bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        ZoomableMediaImage,
        {
          src: nft.metadata.imageUrl,
          alt: nftName,
          assetCanisterId: canisterId,
          tokenId: nft.tokenId,
          viewerTitle: nftName,
          buttonClassName: "h-full w-full",
          className: "h-full w-full object-contain",
          dataOcid: "nft_detail.image_zoom_button",
          fallback: /* @__PURE__ */ jsxRuntimeExports.jsx(NFTImagePlaceholder, { name: nftName })
        }
      ) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              CollectionBadge,
              {
                collection,
                trustStatus,
                size: "sm"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Badge,
              {
                variant: "secondary",
                className: `border text-xs ${nftCustodyClass(nft.location)}`,
                children: nftCustodyLabel(nft.location)
              }
            ),
            activeListing && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "border-0 bg-accent/15 text-accent", children: "Listed" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl font-bold text-foreground", children: nftName }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-sm text-muted-foreground", children: getNFTTokenLabel(nft, collection) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-xs text-muted-foreground", children: [
            "Display token ID: ",
            getNFTDisplayTokenId(nft, collection)
          ] })
        ] }),
        nft.metadata.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm leading-relaxed text-muted-foreground", children: nft.metadata.description }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border/60 bg-muted/25 p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-foreground", children: nftCustodyLabel(nft.location) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs leading-relaxed text-muted-foreground", children: nftCustodyDescription(nft, collection) })
        ] }),
        activeListing && listingId != null && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-accent/30 bg-accent/5 p-4 space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            activeListing.listing.__kind__ === "Auction" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Gavel, { className: "h-4 w-4 text-accent" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "h-4 w-4 text-accent" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: activeListing.listing.__kind__ === "Auction" ? "Active auction" : "Active fixed listing" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              className: "w-full bg-accent text-accent-foreground hover:bg-accent/90",
              onClick: () => void navigate({
                to: "/marketplace/listing/$listingId",
                params: { listingId: listingId.toString() }
              }),
              "data-ocid": "nft_detail.view_listing_button",
              children: "View marketplace listing"
            }
          )
        ] }),
        visibleAttributes.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border bg-card p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mb-3 text-sm font-semibold text-foreground", children: "Attributes" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2", children: visibleAttributes.map(([key, value]) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "rounded-md border border-border/50 bg-muted/30 px-3 py-2",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-wide text-muted-foreground", children: key }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-0.5 text-sm font-medium text-foreground", children: value })
              ]
            },
            `${key}:${value}`
          )) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border/50 bg-muted/35 px-3 py-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-wide text-muted-foreground", children: "Collection canister" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "a",
              {
                href: canisterUrl,
                target: "_blank",
                rel: "noreferrer",
                className: "mt-0.5 inline-flex items-center gap-1 font-mono text-sm text-accent hover:underline",
                children: [
                  canisterId,
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "h-3.5 w-3.5" })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border/50 bg-muted/35 px-3 py-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-wide text-muted-foreground", children: "Owner" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-0.5 truncate font-mono text-sm text-foreground", children: nft.owner.toString() })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/collections", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", children: "Browse collections" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/marketplace", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", children: "Marketplace" }) }),
          listingId != null && /* @__PURE__ */ jsxRuntimeExports.jsx(
            Link,
            {
              to: "/marketplace/listing/$listingId",
              params: { listingId: listingId.toString() },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", className: "bg-accent text-accent-foreground", children: "Open listing" })
            }
          )
        ] })
      ] })
    ] })
  ] });
}
export {
  NFTDetailPage as default
};
