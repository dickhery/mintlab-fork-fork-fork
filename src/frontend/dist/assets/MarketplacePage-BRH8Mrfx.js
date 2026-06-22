import { c as createLucideIcon, r as reactExports, u as useControllableState, j as jsxRuntimeExports, P as Primitive, x as useId, d as composeEventHandlers, e as Presence, f as createContextScope, a as cn, i as useBackend, h as useAuth, l as useQueryClient, p as useNavigate, y as useSearch, z as useParams, g as getNFTDisplayName, o as ue, n as useQuery, A as filterMarketplaceListings, C as sortMarketplaceListings, D as listingIdFromItem, B as Button, E as LoadingSpinner, X, S as ShoppingBag, F as AlertDialog, G as AlertDialogContent, I as AlertDialogHeader, J as AlertDialogTitle, K as AlertDialogDescription, T as TermsAgreementNotice, M as AlertDialogFooter, N as AlertDialogCancel, O as AlertDialogAction, s as getNFTTokenLabel, m as motion, q as Link } from "./index-DrbJ3Dgs.js";
import { W as WITHDRAW_TO_EXTERNAL_WALLET_LABEL, n as nftCustodyLabel, a as nftCustodyClass, i as isVaultedInMintlab, V as VAULTED_PURCHASE_NOTICE, C as CollectionBadge, b as nftCustodyDescription } from "./nft-custody-CxHtyM70.js";
import { T as Tag, D as DividendBalanceBadge, F as Flag, P as PaymentConfirmationDialog } from "./PaymentConfirmationDialog-DnlbpTXz.js";
import { E as EmptyState } from "./EmptyState-DxZppddp.js";
import { H as HelpCallout, a as HelpTooltip } from "./HelpCallout-BC79IBP9.js";
import { M as MediaImage } from "./MediaImage-ULhrqqe5.js";
import { R as Root, I as Item, c as createRovingFocusGroupScope, P as PriceDisplay, t as transferRegisteredNFT } from "./external-nft-transfer-CSNYsvlj.js";
import { a as appPageUrl, l as listingSharePath, S as ShareLinkButton, b as listingShareUrl } from "./share-urls-CbGyTrAI.js";
import { c as collectionMetaMap, a as collectionTrustStatus, i as isMintlabVerifiedCollection, C as COMMUNITY_COLLECTION_NOTICE, Z as ZoomableMediaImage } from "./ZoomableMediaImage-nkA4xSpd.js";
import { B as Badge } from "./badge-DdjukgZZ.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle } from "./dialog-4NTTazXF.js";
import { I as Input } from "./input-CqSv3G5S.js";
import { u as useMutation, L as Label } from "./label-DOUTvvvf.js";
import { u as useDirection, S as Select, c as SelectTrigger, d as SelectValue, e as SelectContent, f as SelectItem } from "./select-UZKmF0bE.js";
import { u as usePageMeta } from "./use-page-meta-ig4YPpNY.js";
import { f as formatICPAmount, p as parseICPToE8s } from "./icp-BXjZNIYq.js";
import { r as resolveImageUrl, I as ImageOff } from "./media-D3kuYwrv.js";
import { R as RefreshCw } from "./index-DBYkfugF.js";
import { S as SlidersHorizontal } from "./sliders-horizontal-CbAonUW1.js";
import { S as Search } from "./search-CiVtcyE7.js";
import { G as Gavel } from "./gavel-BU6V8aFR.js";
import { C as Coins } from "./coins-B2DDJXVJ.js";
import "./arrow-right-DMXLUVmr.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["polyline", { points: "12 6 12 12 16 14", key: "68esgv" }]
];
const Clock = createLucideIcon("clock", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["rect", { width: "18", height: "11", x: "3", y: "11", rx: "2", ry: "2", key: "1w4ew1" }],
  ["path", { d: "M7 11V7a5 5 0 0 1 10 0v4", key: "fwvmzm" }]
];
const Lock = createLucideIcon("lock", __iconNode);
var TABS_NAME = "Tabs";
var [createTabsContext] = createContextScope(TABS_NAME, [
  createRovingFocusGroupScope
]);
var useRovingFocusGroupScope = createRovingFocusGroupScope();
var [TabsProvider, useTabsContext] = createTabsContext(TABS_NAME);
var Tabs$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeTabs,
      value: valueProp,
      onValueChange,
      defaultValue,
      orientation = "horizontal",
      dir,
      activationMode = "automatic",
      ...tabsProps
    } = props;
    const direction = useDirection(dir);
    const [value, setValue] = useControllableState({
      prop: valueProp,
      onChange: onValueChange,
      defaultProp: defaultValue ?? "",
      caller: TABS_NAME
    });
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      TabsProvider,
      {
        scope: __scopeTabs,
        baseId: useId(),
        value,
        onValueChange: setValue,
        orientation,
        dir: direction,
        activationMode,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.div,
          {
            dir: direction,
            "data-orientation": orientation,
            ...tabsProps,
            ref: forwardedRef
          }
        )
      }
    );
  }
);
Tabs$1.displayName = TABS_NAME;
var TAB_LIST_NAME = "TabsList";
var TabsList$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeTabs, loop = true, ...listProps } = props;
    const context = useTabsContext(TAB_LIST_NAME, __scopeTabs);
    const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeTabs);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Root,
      {
        asChild: true,
        ...rovingFocusGroupScope,
        orientation: context.orientation,
        dir: context.dir,
        loop,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.div,
          {
            role: "tablist",
            "aria-orientation": context.orientation,
            ...listProps,
            ref: forwardedRef
          }
        )
      }
    );
  }
);
TabsList$1.displayName = TAB_LIST_NAME;
var TRIGGER_NAME = "TabsTrigger";
var TabsTrigger$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeTabs, value, disabled = false, ...triggerProps } = props;
    const context = useTabsContext(TRIGGER_NAME, __scopeTabs);
    const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeTabs);
    const triggerId = makeTriggerId(context.baseId, value);
    const contentId = makeContentId(context.baseId, value);
    const isSelected = value === context.value;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Item,
      {
        asChild: true,
        ...rovingFocusGroupScope,
        focusable: !disabled,
        active: isSelected,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.button,
          {
            type: "button",
            role: "tab",
            "aria-selected": isSelected,
            "aria-controls": contentId,
            "data-state": isSelected ? "active" : "inactive",
            "data-disabled": disabled ? "" : void 0,
            disabled,
            id: triggerId,
            ...triggerProps,
            ref: forwardedRef,
            onMouseDown: composeEventHandlers(props.onMouseDown, (event) => {
              if (!disabled && event.button === 0 && event.ctrlKey === false) {
                context.onValueChange(value);
              } else {
                event.preventDefault();
              }
            }),
            onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
              if ([" ", "Enter"].includes(event.key)) context.onValueChange(value);
            }),
            onFocus: composeEventHandlers(props.onFocus, () => {
              const isAutomaticActivation = context.activationMode !== "manual";
              if (!isSelected && !disabled && isAutomaticActivation) {
                context.onValueChange(value);
              }
            })
          }
        )
      }
    );
  }
);
TabsTrigger$1.displayName = TRIGGER_NAME;
var CONTENT_NAME = "TabsContent";
var TabsContent$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeTabs, value, forceMount, children, ...contentProps } = props;
    const context = useTabsContext(CONTENT_NAME, __scopeTabs);
    const triggerId = makeTriggerId(context.baseId, value);
    const contentId = makeContentId(context.baseId, value);
    const isSelected = value === context.value;
    const isMountAnimationPreventedRef = reactExports.useRef(isSelected);
    reactExports.useEffect(() => {
      const rAF = requestAnimationFrame(() => isMountAnimationPreventedRef.current = false);
      return () => cancelAnimationFrame(rAF);
    }, []);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || isSelected, children: ({ present }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.div,
      {
        "data-state": isSelected ? "active" : "inactive",
        "data-orientation": context.orientation,
        role: "tabpanel",
        "aria-labelledby": triggerId,
        hidden: !present,
        id: contentId,
        tabIndex: 0,
        ...contentProps,
        ref: forwardedRef,
        style: {
          ...props.style,
          animationDuration: isMountAnimationPreventedRef.current ? "0s" : void 0
        },
        children: present && children
      }
    ) });
  }
);
TabsContent$1.displayName = CONTENT_NAME;
function makeTriggerId(baseId, value) {
  return `${baseId}-trigger-${value}`;
}
function makeContentId(baseId, value) {
  return `${baseId}-content-${value}`;
}
var Root2 = Tabs$1;
var List = TabsList$1;
var Trigger = TabsTrigger$1;
var Content = TabsContent$1;
function Tabs({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Root2,
    {
      "data-slot": "tabs",
      className: cn("flex flex-col gap-2", className),
      ...props
    }
  );
}
function TabsList({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    List,
    {
      "data-slot": "tabs-list",
      className: cn(
        "bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]",
        className
      ),
      ...props
    }
  );
}
function TabsTrigger({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Trigger,
    {
      "data-slot": "tabs-trigger",
      className: cn(
        "data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      ),
      ...props
    }
  );
}
function TabsContent({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Content,
    {
      "data-slot": "tabs-content",
      className: cn("flex-1 outline-none", className),
      ...props
    }
  );
}
function parseICP(val) {
  return parseICPToE8s(val);
}
function truncatePrincipal(p) {
  if (p.length <= 16) return p;
  return `${p.slice(0, 8)}…${p.slice(-6)}`;
}
function nftKey(collectionId, tokenId) {
  return `${collectionId.toString()}:${tokenId}`;
}
const DEFAULT_ICP_LEDGER_FEE_E8S = 10000n;
const DEFAULT_MINTLAB_FEE_BPS = 200n;
const BPS_DENOMINATOR = 10000n;
const MIN_AUCTION_STARTING_BID_E8S = 1000000n;
const MIN_AUCTION_BID_INCREMENT_E8S = 1000000n;
const MARKETPLACE_COLLECTION_PAGE_SIZE = 50n;
const MARKETPLACE_WALLET_PAGE_SIZE = 50n;
const MARKETPLACE_STATUS_PAGE_SIZE = 25n;
function marketplaceFee(amount, feeBps) {
  return amount * feeBps / BPS_DENOMINATOR;
}
function nextAuctionMinimumBid(listing) {
  if (listing.highestBid > 0n) {
    return listing.highestBid + MIN_AUCTION_BID_INCREMENT_E8S;
  }
  return listing.startingBid >= MIN_AUCTION_STARTING_BID_E8S ? listing.startingBid : MIN_AUCTION_STARTING_BID_E8S;
}
function auctionHighBidderText(listing) {
  return listing.highestBidder ? truncatePrincipal(listing.highestBidder.toString()) : "No bids yet";
}
function auctionHasBid(listing) {
  return listing.highestBid > 0n || listing.highestBidder != null;
}
function isViewerWinningAuction(listing, currentPrincipal, bidStatus) {
  var _a;
  return (bidStatus == null ? void 0 : bidStatus.isWinning) ?? ((_a = listing.highestBidder) == null ? void 0 : _a.toString()) === currentPrincipal;
}
function useCountdown(endTimeNs) {
  const [remaining, setRemaining] = reactExports.useState(() => {
    const endMs = Number(endTimeNs / 1000000n);
    return Math.max(0, endMs - Date.now());
  });
  reactExports.useEffect(() => {
    const endMs = Number(endTimeNs / 1000000n);
    const tick = () => setRemaining(Math.max(0, endMs - Date.now()));
    const id = setInterval(tick, 1e3);
    tick();
    return () => clearInterval(id);
  }, [endTimeNs]);
  return remaining;
}
function formatRemaining(ms) {
  if (ms <= 0) return "Ended";
  const totalSec = Math.floor(ms / 1e3);
  const d = Math.floor(totalSec / 86400);
  const h = Math.floor(totalSec % 86400 / 3600);
  const m = Math.floor(totalSec % 3600 / 60);
  const s = totalSec % 60;
  if (d > 0) return `${d}d ${h}h remaining`;
  if (h > 0) return `${h}h ${m}m remaining`;
  return `${m}m ${s}s remaining`;
}
function NFTImagePlaceholder({ name }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full h-full flex flex-col items-center justify-center gap-2 bg-muted/60", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(ImageOff, { className: "w-8 h-8 text-muted-foreground/40" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground/60 text-center px-2 truncate max-w-full", children: name })
  ] });
}
function FixedListingCard({
  listing,
  nft,
  collection,
  dividendE8s = 0n,
  trustStatus,
  index,
  ocidPrefix = "marketplace.fixed",
  currentPrincipal,
  onBuy,
  onCancel,
  onDetails,
  isBuying,
  isCancelling
}) {
  const name = nft ? getNFTDisplayName(nft, collection) : "NFT #?";
  const sellerText = listing.seller.toString();
  const isOwner = currentPrincipal === sellerText;
  const custodyLabel = nft ? nftCustodyLabel(nft.location) : null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.35, delay: index * 0.07 },
      className: "nft-card-glow group relative rounded-xl border border-border bg-card overflow-hidden flex flex-col hover:nft-card-glow-hover hover:border-accent/40 transition-smooth cursor-pointer",
      onClick: onDetails,
      "data-ocid": `${ocidPrefix}.item.${index + 1}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "aspect-square overflow-hidden bg-muted relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            MediaImage,
            {
              src: nft == null ? void 0 : nft.metadata.imageUrl,
              alt: name,
              assetCanisterId: collection == null ? void 0 : collection.canisterId.toString(),
              tokenId: nft == null ? void 0 : nft.tokenId,
              className: "w-full h-full object-cover transition-smooth group-hover:scale-105",
              loading: "lazy",
              fallback: /* @__PURE__ */ jsxRuntimeExports.jsx(NFTImagePlaceholder, { name })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "absolute top-2 left-2 bg-primary/90 text-primary-foreground text-xs font-mono uppercase", children: "Fixed" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 flex flex-col gap-2 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-semibold text-sm text-foreground truncate", children: name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-mono truncate mt-0.5", children: truncatePrincipal(sellerText) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground mt-1 font-mono", children: nft ? getNFTTokenLabel(nft, collection) : "Token #?" })
          ] }),
          collection && /* @__PURE__ */ jsxRuntimeExports.jsx(
            CollectionBadge,
            {
              collection,
              trustStatus,
              size: "sm"
            }
          ),
          nft && custodyLabel && /* @__PURE__ */ jsxRuntimeExports.jsx(
            Badge,
            {
              variant: "secondary",
              className: `w-fit max-w-full whitespace-normal break-words text-left text-[10px] leading-tight border ${nftCustodyClass(nft.location)}`,
              children: custodyLabel
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DividendBalanceBadge, { e8s: dividendE8s, compact: true, label: "Dividends" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-auto pt-2 border-t border-border/60 flex items-end justify-between gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(PriceDisplay, { e8s: listing.price, size: "sm", label: "Price" }),
            isOwner ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                size: "sm",
                variant: "outline",
                className: "text-destructive border-destructive/40 hover:bg-destructive/10 transition-smooth shrink-0",
                onClick: (event) => {
                  event.stopPropagation();
                  onCancel(listing.id);
                },
                disabled: isCancelling,
                "data-ocid": `${ocidPrefix}.cancel_button.${index + 1}`,
                children: isCancelling ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, { size: "sm" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3 h-3 mr-1" }),
                  "Cancel"
                ] })
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                size: "sm",
                className: "bg-accent text-accent-foreground hover:bg-accent/90 transition-smooth shrink-0 font-semibold",
                onClick: (event) => {
                  event.stopPropagation();
                  onBuy(listing.id);
                },
                disabled: isBuying,
                "data-ocid": `${ocidPrefix}.buy_button.${index + 1}`,
                children: isBuying ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, { size: "sm" }),
                  "Processing..."
                ] }) : "Buy Now"
              }
            )
          ] })
        ] })
      ]
    }
  );
}
function ListingDetailModal({
  detail,
  currentPrincipal,
  bidStatusMap,
  onClose,
  onBuy,
  onCancel,
  onBid,
  onReport
}) {
  var _a;
  if (!detail) return null;
  const { listing, nft, collection, trustStatus, dividendE8s } = detail;
  const name = getNFTDisplayName(nft, collection);
  const canisterId = collection == null ? void 0 : collection.canisterId.toString();
  const fixed = listing.__kind__ === "Fixed" ? listing.Fixed : null;
  const auction = listing.__kind__ === "Auction" ? listing.Auction : null;
  const seller = (fixed == null ? void 0 : fixed.seller) ?? (auction == null ? void 0 : auction.seller);
  const isOwner = seller != null && currentPrincipal === seller.toString();
  const auctionBidStatus = auction ? bidStatusMap.get(auction.id.toString()) : void 0;
  const auctionHasAcceptedBid = auction ? auctionHasBid(auction) : false;
  const isWinningAuction = auction ? isViewerWinningAuction(auction, currentPrincipal, auctionBidStatus) : false;
  const hasBeenOutbid = auction != null && !!(auctionBidStatus == null ? void 0 : auctionBidStatus.hasBid) && !isWinningAuction;
  const auctionRemaining = auction ? formatRemaining(
    Math.max(0, Number(auction.endTime / 1000000n) - Date.now())
  ) : "";
  const custodyLabel = nftCustodyLabel(nft.location);
  const custodyDescription = nftCustodyDescription(nft, collection);
  const listingId = (fixed == null ? void 0 : fixed.id) ?? (auction == null ? void 0 : auction.id) ?? null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!detail, onOpenChange: (value) => !value && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    DialogContent,
    {
      className: "bg-card border-border max-w-3xl p-0 overflow-hidden max-h-[88vh]",
      "data-ocid": "marketplace.nft_detail.dialog",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-[minmax(0,0.9fr)_minmax(320px,1fr)]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-muted min-h-[260px] md:min-h-0 md:h-full flex items-center justify-center p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          ZoomableMediaImage,
          {
            src: nft.metadata.imageUrl,
            alt: name,
            assetCanisterId: collection == null ? void 0 : collection.canisterId.toString(),
            tokenId: nft.tokenId,
            viewerTitle: name,
            buttonClassName: "h-full w-full rounded-lg",
            className: "max-h-[72vh] w-full h-full object-contain rounded-lg",
            dataOcid: "marketplace.nft_detail.image_zoom_button",
            fallback: /* @__PURE__ */ jsxRuntimeExports.jsx(NFTImagePlaceholder, { name })
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 space-y-4 overflow-y-auto max-h-[88vh]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { className: "space-y-2 text-left", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  className: fixed ? "bg-primary/10 text-primary border border-primary/20" : "bg-accent/10 text-accent border border-accent/20",
                  children: fixed ? "Fixed Price" : "Auction"
                }
              ),
              collection && /* @__PURE__ */ jsxRuntimeExports.jsx(
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
                  children: custodyLabel
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(DividendBalanceBadge, { e8s: dividendE8s, size: "md" }),
              listingId != null && /* @__PURE__ */ jsxRuntimeExports.jsx(
                ShareLinkButton,
                {
                  url: listingShareUrl(listingId),
                  "data-ocid": "marketplace.nft_detail.share_listing_button"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  size: "sm",
                  variant: "outline",
                  className: "h-7 gap-1.5 text-xs",
                  asChild: true,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Link,
                    {
                      to: "/nft/$collectionId/$tokenId",
                      params: {
                        collectionId: nft.collectionId.toString(),
                        tokenId: encodeURIComponent(nft.tokenId)
                      },
                      "data-ocid": "marketplace.nft_detail.open_nft_page_link",
                      children: "Open NFT page"
                    }
                  )
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  type: "button",
                  size: "sm",
                  variant: "outline",
                  className: "h-7 gap-1.5 text-xs",
                  onClick: () => onReport(collection, nft),
                  "data-ocid": "marketplace.nft_detail.report_button",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Flag, { className: "h-3.5 w-3.5" }),
                    "Report"
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display text-xl text-foreground", children: name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground font-mono", children: getNFTTokenLabel(nft, collection) })
          ] }),
          nft.metadata.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground leading-relaxed", children: nft.metadata.description }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border/60 bg-muted/25 p-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-foreground", children: custodyLabel }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs leading-relaxed text-muted-foreground", children: custodyDescription }),
            isVaultedInMintlab(nft) && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs leading-relaxed text-muted-foreground", children: VAULTED_PURCHASE_NOTICE })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border/50 bg-muted/35 px-3 py-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-wide text-muted-foreground", children: "Seller" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-sm text-foreground truncate mt-0.5", children: (seller == null ? void 0 : seller.toString()) ?? "Unknown" })
            ] }),
            canisterId && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border/50 bg-muted/35 px-3 py-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-wide text-muted-foreground", children: "Collection Canister" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-sm text-foreground truncate mt-0.5", children: canisterId })
            ] }),
            auction && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border/50 bg-muted/35 px-3 py-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-wide text-muted-foreground", children: "Current High Bidder" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-sm text-foreground truncate mt-0.5", children: ((_a = auction.highestBidder) == null ? void 0 : _a.toString()) ?? "No bids yet" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border/60 bg-muted/25 p-3 flex items-center justify-between gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
              fixed ? /* @__PURE__ */ jsxRuntimeExports.jsx(PriceDisplay, { e8s: fixed.price, label: "Price" }) : auction ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                PriceDisplay,
                {
                  e8s: auction.highestBid > 0n ? auction.highestBid : auction.startingBid,
                  label: auction.highestBid > 0n ? "Top bid" : "Starting bid"
                }
              ) : null,
              auction && isWinningAuction && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "w-fit bg-emerald-500/10 text-emerald-700 border border-emerald-500/20", children: "You're Winning" }),
              auction && hasBeenOutbid && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "w-fit bg-amber-500/10 text-amber-700 border border-amber-500/20", children: "You've been outbid" })
            ] }),
            auction && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground font-mono", children: auctionRemaining })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap justify-end gap-2 pt-2", children: [
            fixed && (isOwner ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                className: "text-destructive border-destructive/40 hover:bg-destructive/10",
                onClick: () => {
                  onCancel(fixed.id);
                  onClose();
                },
                children: "Cancel Listing"
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                className: "bg-accent text-accent-foreground hover:bg-accent/90",
                onClick: () => {
                  onBuy(fixed.id);
                  onClose();
                },
                children: "Buy Now"
              }
            )),
            auction && (isOwner ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-end gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "outline",
                  className: auctionHasAcceptedBid ? "border-border text-muted-foreground" : "text-destructive border-destructive/40 hover:bg-destructive/10",
                  onClick: () => {
                    if (auctionHasAcceptedBid) return;
                    onCancel(auction.id);
                    onClose();
                  },
                  disabled: auctionHasAcceptedBid,
                  children: auctionHasAcceptedBid ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-4 h-4 mr-2" }),
                    "Bid Placed"
                  ] }) : "Cancel Auction"
                }
              ),
              auctionHasAcceptedBid && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground text-right max-w-[14rem]", children: "Auctions cannot be canceled after the first bid." })
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                className: "bg-accent text-accent-foreground hover:bg-accent/90",
                onClick: () => {
                  onBid(auction);
                  onClose();
                },
                disabled: Date.now() >= Number(auction.endTime / 1000000n),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Gavel, { className: "w-4 h-4 mr-2" }),
                  "Place Bid"
                ]
              }
            ))
          ] })
        ] })
      ] })
    }
  ) });
}
function AuctionListingCard({
  listing,
  nft,
  collection,
  dividendE8s = 0n,
  trustStatus,
  index,
  ocidPrefix = "marketplace.auction",
  currentPrincipal,
  bidStatus,
  onBid,
  onSettle,
  onCancel,
  onDetails,
  isSettling,
  isCancelling
}) {
  const remaining = useCountdown(listing.endTime);
  const ended = remaining <= 0;
  const name = nft ? getNFTDisplayName(nft, collection) : "NFT #?";
  const sellerText = listing.seller.toString();
  const isOwner = currentPrincipal === sellerText;
  const isWinner = isViewerWinningAuction(listing, currentPrincipal, bidStatus);
  const hasBeenOutbid = !!(bidStatus == null ? void 0 : bidStatus.hasBid) && !isWinner;
  const hasBid = auctionHasBid(listing);
  const custodyLabel = nft ? nftCustodyLabel(nft.location) : null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.35, delay: index * 0.07 },
      className: "nft-card-glow group relative rounded-xl border border-border bg-card overflow-hidden flex flex-col hover:nft-card-glow-hover hover:border-accent/40 transition-smooth cursor-pointer",
      onClick: onDetails,
      "data-ocid": `${ocidPrefix}.item.${index + 1}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "aspect-square overflow-hidden bg-muted relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            MediaImage,
            {
              src: nft == null ? void 0 : nft.metadata.imageUrl,
              alt: name,
              assetCanisterId: collection == null ? void 0 : collection.canisterId.toString(),
              tokenId: nft == null ? void 0 : nft.tokenId,
              className: "w-full h-full object-cover transition-smooth group-hover:scale-105",
              loading: "lazy",
              fallback: /* @__PURE__ */ jsxRuntimeExports.jsx(NFTImagePlaceholder, { name })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Badge,
            {
              className: `absolute top-2 left-2 text-xs font-mono uppercase ${ended ? "bg-muted text-muted-foreground" : "bg-accent/90 text-accent-foreground"}`,
              children: ended ? "Ended" : "Live"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 flex flex-col gap-2 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-semibold text-sm text-foreground truncate", children: name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-mono truncate mt-0.5", children: truncatePrincipal(sellerText) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground mt-1 font-mono", children: nft ? getNFTTokenLabel(nft, collection) : "Token #?" })
          ] }),
          collection && /* @__PURE__ */ jsxRuntimeExports.jsx(
            CollectionBadge,
            {
              collection,
              trustStatus,
              size: "sm"
            }
          ),
          nft && custodyLabel && /* @__PURE__ */ jsxRuntimeExports.jsx(
            Badge,
            {
              variant: "secondary",
              className: `w-fit max-w-full whitespace-normal break-words text-left text-[10px] leading-tight border ${nftCustodyClass(nft.location)}`,
              children: custodyLabel
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DividendBalanceBadge, { e8s: dividendE8s, compact: true, label: "Dividends" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-xs text-muted-foreground font-mono", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3 h-3 shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: ended ? "text-destructive/80" : "text-foreground/70",
                children: formatRemaining(remaining)
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-xs text-muted-foreground font-mono min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Gavel, { className: "w-3 h-3 shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "truncate", children: [
              "High bidder: ",
              auctionHighBidderText(listing)
            ] })
          ] }),
          isWinner && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "w-fit bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 text-[10px]", children: "You're Winning" }),
          hasBeenOutbid && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "w-fit bg-amber-500/10 text-amber-700 border border-amber-500/20 text-[10px]", children: "You've been outbid" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-auto pt-2 border-t border-border/60 flex items-end justify-between gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              PriceDisplay,
              {
                e8s: listing.highestBid > 0n ? listing.highestBid : listing.startingBid,
                size: "sm",
                label: listing.highestBid > 0n ? "Top bid" : "Starting bid"
              }
            ),
            isOwner ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1.5 shrink-0", children: [
              ended && /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  size: "sm",
                  className: "bg-primary text-primary-foreground hover:bg-primary/90 transition-smooth font-semibold",
                  onClick: (event) => {
                    event.stopPropagation();
                    onSettle(listing.id);
                  },
                  disabled: isSettling,
                  "data-ocid": `${ocidPrefix}.settle_button.${index + 1}`,
                  children: isSettling ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, { size: "sm" }) : "Settle"
                }
              ),
              !ended && !hasBid && /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  size: "sm",
                  variant: "outline",
                  className: "text-destructive border-destructive/40 hover:bg-destructive/10 transition-smooth",
                  onClick: (event) => {
                    event.stopPropagation();
                    onCancel(listing.id);
                  },
                  disabled: isCancelling,
                  "data-ocid": `${ocidPrefix}.cancel_button.${index + 1}`,
                  children: isCancelling ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, { size: "sm" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3 h-3 mr-1" }),
                    "Cancel"
                  ] })
                }
              ),
              !ended && hasBid && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-end gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    size: "sm",
                    variant: "outline",
                    className: "border-border text-muted-foreground",
                    disabled: true,
                    "data-ocid": `${ocidPrefix}.cancel_locked_button.${index + 1}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-3 h-3 mr-1" }),
                      "Bid Locked"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "max-w-[8rem] text-right text-[10px] leading-snug text-muted-foreground", children: "Cannot cancel after bids" })
              ] })
            ] }) : ended && isWinner ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                size: "sm",
                className: "bg-primary text-primary-foreground hover:bg-primary/90 transition-smooth font-semibold shrink-0",
                onClick: (event) => {
                  event.stopPropagation();
                  onSettle(listing.id);
                },
                disabled: isSettling,
                "data-ocid": `${ocidPrefix}.collect_button.${index + 1}`,
                children: isSettling ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, { size: "sm" }) : "Collect"
              }
            ) : !ended ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "sm",
                className: "bg-accent text-accent-foreground hover:bg-accent/90 transition-smooth shrink-0 font-semibold",
                onClick: (event) => {
                  event.stopPropagation();
                  onBid(listing);
                },
                "data-ocid": `${ocidPrefix}.bid_button.${index + 1}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Gavel, { className: "w-3 h-3 mr-1" }),
                  "Bid"
                ]
              }
            ) : null
          ] })
        ] })
      ]
    }
  );
}
function ListNFTModal({
  open,
  onClose,
  userNFTs,
  collections,
  onList,
  isListing
}) {
  const [selectedNFT, setSelectedNFT] = reactExports.useState(null);
  const [mode, setMode] = reactExports.useState("fixed");
  const [price, setPrice] = reactExports.useState("");
  const [startBid, setStartBid] = reactExports.useState("0.01");
  const [durationAmount, setDurationAmount] = reactExports.useState("3");
  const [durationUnit, setDurationUnit] = reactExports.useState("days");
  const reset = reactExports.useCallback(() => {
    setSelectedNFT(null);
    setMode("fixed");
    setPrice("");
    setStartBid("0.01");
    setDurationAmount("3");
    setDurationUnit("days");
  }, []);
  reactExports.useEffect(() => {
    if (!open) reset();
  }, [open, reset]);
  function handleSubmit(e) {
    e.preventDefault();
    if (!selectedNFT) return;
    const nft = userNFTs.find((item) => item.id === selectedNFT);
    if (!nft) return ue.error("Select an NFT to list");
    if (mode === "fixed") {
      const p = parseICP(price);
      if (!p) return ue.error("Enter a valid price");
      onList({ type: "fixed", nft, price: p });
    } else {
      const bid = parseICP(startBid);
      if (!bid) return ue.error("Enter a valid starting bid");
      if (bid < MIN_AUCTION_STARTING_BID_E8S) {
        return ue.error("Starting bid must be at least 0.01 ICP");
      }
      const amount = Number.parseInt(durationAmount, 10);
      if (Number.isNaN(amount) || amount < 1)
        return ue.error("Duration must be at least 1 hour");
      const durationHours = durationUnit === "days" ? amount * 24 : amount;
      const maxDurationHours = 30 * 24;
      if (durationHours > maxDurationHours)
        return ue.error("Duration cannot exceed 30 days");
      const endTimeNs = BigInt(Date.now() + durationHours * 36e5) * 1000000n;
      onList({
        type: "auction",
        nft,
        startingBid: bid,
        endTime: endTimeNs
      });
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (v) => !v && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: "bg-card border-border max-w-md max-h-[90vh] overflow-y-auto",
      "data-ocid": "marketplace.list_dialog",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display text-lg", children: "List Your NFT" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 mb-3 rounded-lg border border-accent/30 bg-accent/5 p-3 flex gap-2.5 items-start", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-4 h-4 rounded-full bg-accent/30 flex items-center justify-center mt-0.5 shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent text-[10px] font-bold", children: "!" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed", children: "Registered external wallet NFTs are deposited into the app vault before listing. Buyers of vaulted external NFTs receive a Mintlab wallet record first; the original NFT stays vaulted in Mintlab until they withdraw it to an external wallet." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 flex gap-2.5 items-start", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Coins, { className: "w-4 h-4 text-amber-600 mt-0.5 shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed", children: "Dividend collection is paused while this NFT is listed at a fixed price or in an auction. Any claimable ICP stays attached to the NFT for the buyer or auction winner." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground uppercase tracking-wider", children: "Select NFT" }),
            userNFTs.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground py-4 text-center border border-dashed border-border rounded-lg", children: "No NFTs available to list yet" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1", children: userNFTs.map((nft) => {
              const collection = collections.find(
                (item) => item.id === nft.collectionId
              );
              const nftName = getNFTDisplayName(nft, collection);
              const selected = selectedNFT === nft.id;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => setSelectedNFT(nft.id),
                  className: `rounded-lg border overflow-hidden transition-smooth text-left ${selected ? "border-accent ring-1 ring-accent/50" : "border-border hover:border-accent/40"}`,
                  "data-ocid": "marketplace.list_nft_select",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-square bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      MediaImage,
                      {
                        src: nft.metadata.imageUrl,
                        alt: nftName,
                        assetCanisterId: collection == null ? void 0 : collection.canisterId.toString(),
                        tokenId: nft.tokenId,
                        className: "w-full h-full object-cover",
                        fallback: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ImageOff, { className: "w-5 h-5 text-muted-foreground/40" }) })
                      }
                    ) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "px-1.5 py-1 text-[10px] font-mono text-foreground/80 truncate", children: nftName }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "p",
                      {
                        className: "px-1.5 pb-1 text-[9px] font-mono text-muted-foreground truncate",
                        title: nftCustodyLabel(nft.location),
                        children: nftCustodyLabel(nft.location)
                      }
                    )
                  ]
                },
                nft.id.toString()
              );
            }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "flex items-center gap-1.5 text-xs text-muted-foreground uppercase tracking-wider", children: [
              "Listing Type",
              /* @__PURE__ */ jsxRuntimeExports.jsx(HelpTooltip, { children: "Fixed listings sell at one price. Auctions hold bids in escrow, can run 1 hour to 30 days, and cannot be canceled after the first bid." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => setMode("fixed"),
                  className: `flex-1 py-2 rounded-lg border text-sm font-medium transition-smooth ${mode === "fixed" ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-border/80"}`,
                  "data-ocid": "marketplace.list_type_fixed",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { className: "w-3.5 h-3.5 inline mr-1.5" }),
                    "Fixed Price"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => setMode("auction"),
                  className: `flex-1 py-2 rounded-lg border text-sm font-medium transition-smooth ${mode === "auction" ? "border-accent bg-accent/10 text-accent" : "border-border text-muted-foreground hover:border-border/80"}`,
                  "data-ocid": "marketplace.list_type_auction",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Gavel, { className: "w-3.5 h-3.5 inline mr-1.5" }),
                    "Auction"
                  ]
                }
              )
            ] })
          ] }),
          mode === "fixed" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Label,
              {
                htmlFor: "list-price",
                className: "text-xs text-muted-foreground uppercase tracking-wider",
                children: "Price (ICP)"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "list-price",
                type: "text",
                inputMode: "decimal",
                placeholder: "e.g. 15.5",
                value: price,
                onChange: (e) => setPrice(e.target.value),
                className: "bg-background border-input font-mono",
                "data-ocid": "marketplace.list_price_input"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Use any positive ICP amount with up to 8 decimals." })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Label,
                {
                  htmlFor: "list-startbid",
                  className: "text-xs text-muted-foreground uppercase tracking-wider",
                  children: "Starting Bid (ICP)"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "list-startbid",
                  type: "text",
                  inputMode: "decimal",
                  placeholder: "0.01",
                  value: startBid,
                  onChange: (e) => setStartBid(e.target.value),
                  className: "bg-background border-input font-mono",
                  "data-ocid": "marketplace.list_startbid_input"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Minimum starting bid is 0.01 ICP. Use up to 8 decimals." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Label,
                {
                  htmlFor: "list-duration",
                  className: "text-xs text-muted-foreground uppercase tracking-wider",
                  children: "Duration"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-[1fr_auto] gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "list-duration",
                    type: "number",
                    min: "1",
                    max: durationUnit === "days" ? "30" : "720",
                    step: "1",
                    placeholder: durationUnit === "days" ? "e.g. 3" : "e.g. 1",
                    value: durationAmount,
                    onChange: (e) => setDurationAmount(e.target.value),
                    className: "bg-background border-input font-mono",
                    "data-ocid": "marketplace.list_duration_input"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex overflow-hidden rounded-lg border border-border", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => setDurationUnit("hours"),
                      className: `px-3 text-xs font-semibold transition-smooth ${durationUnit === "hours" ? "bg-accent text-accent-foreground" : "bg-background text-muted-foreground hover:bg-muted"}`,
                      "data-ocid": "marketplace.list_duration_unit_hours",
                      children: "Hours"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => setDurationUnit("days"),
                      className: `px-3 text-xs font-semibold transition-smooth ${durationUnit === "days" ? "bg-accent text-accent-foreground" : "bg-background text-muted-foreground hover:bg-muted"}`,
                      "data-ocid": "marketplace.list_duration_unit_days",
                      children: "Days"
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Auctions can run from 1 hour up to 30 days." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "After the first bid is placed, the auction cannot be canceled." })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TermsAgreementNotice, { actionLabel: "listing this NFT" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 pt-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                variant: "outline",
                className: "flex-1 border-border",
                onClick: onClose,
                "data-ocid": "marketplace.list_cancel_button",
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "submit",
                disabled: isListing || !selectedNFT,
                className: "flex-1 bg-accent text-accent-foreground hover:bg-accent/90 transition-smooth font-semibold",
                "data-ocid": "marketplace.list_submit_button",
                children: isListing ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, { size: "sm" }) : "List NFT"
              }
            )
          ] })
        ] })
      ]
    }
  ) });
}
function PlaceBidModal({
  listing,
  nft,
  collection,
  ledgerFeeE8s,
  auctionBidFeeReserveE8s,
  mintlabFeeBps,
  onClose,
  onBid,
  isBidding
}) {
  const [bidAmount, setBidAmount] = reactExports.useState("");
  const [pendingBidAmount, setPendingBidAmount] = reactExports.useState(null);
  const [confirmBidOpen, setConfirmBidOpen] = reactExports.useState(false);
  const inputRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (listing) {
      setBidAmount("");
      setPendingBidAmount(null);
      setConfirmBidOpen(false);
      setTimeout(() => {
        var _a;
        return (_a = inputRef.current) == null ? void 0 : _a.focus();
      }, 100);
    }
  }, [listing]);
  if (!listing) return null;
  const minBid = nextAuctionMinimumBid(listing);
  const minBidICP = formatICPAmount(minBid);
  const name = nft ? getNFTDisplayName(nft, collection) : "NFT #?";
  const pendingAmount = pendingBidAmount ?? 0n;
  const pendingMintlabFee = marketplaceFee(pendingAmount, mintlabFeeBps);
  const escrowDeposit = pendingAmount + auctionBidFeeReserveE8s;
  const maximumDebit = escrowDeposit + ledgerFeeE8s;
  function handleSubmit(e) {
    e.preventDefault();
    if (!listing) return;
    const amount = parseICP(bidAmount);
    if (!amount) return ue.error("Enter a valid bid amount");
    if (amount < minBid) {
      return ue.error(`Bid must be at least ${minBidICP} ICP`);
    }
    setPendingBidAmount(amount);
    setConfirmBidOpen(true);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!listing, onOpenChange: (v) => !v && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      DialogContent,
      {
        className: "bg-card border-border max-w-sm",
        "data-ocid": "marketplace.bid_dialog",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display text-lg", children: "Place a Bid" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground -mt-1", children: name }),
          nft && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border bg-muted/30 p-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Badge,
              {
                variant: "secondary",
                className: `border text-[10px] ${nftCustodyClass(nft.location)}`,
                children: nftCustodyLabel(nft.location)
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-xs leading-relaxed text-muted-foreground", children: nftCustodyDescription(nft) }),
            isVaultedInMintlab(nft) && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs leading-relaxed text-muted-foreground", children: "If you win, the NFT remains vaulted in Mintlab until you withdraw it to an external wallet." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4 mt-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-muted/40 border border-border p-3 flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground uppercase tracking-wider", children: listing.highestBid > 0n ? "Current top bid" : "Starting bid" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                PriceDisplay,
                {
                  e8s: listing.highestBid > 0n ? listing.highestBid : listing.startingBid,
                  size: "sm"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Label,
                {
                  htmlFor: "bid-amount",
                  className: "text-xs text-muted-foreground uppercase tracking-wider",
                  children: [
                    "Your Bid (ICP) — min ",
                    minBidICP
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "bid-amount",
                  ref: inputRef,
                  type: "text",
                  inputMode: "decimal",
                  placeholder: minBidICP,
                  value: bidAmount,
                  onChange: (e) => setBidAmount(e.target.value),
                  className: "bg-background border-input font-mono",
                  "data-ocid": "marketplace.bid_amount_input"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Bids must be at least 0.01 ICP above the current top bid." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Bids placed with less than 2 minutes remaining extend the auction by 5 minutes." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "A bid counts when Mintlab starts processing it before the auction ends." })
            ] }),
            bidAmount.trim() && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border bg-muted/30 p-3 text-xs text-muted-foreground", children: [
              "If confirmed,",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-foreground", children: [
                bidAmount.trim(),
                " ICP"
              ] }),
              " ",
              "plus escrow fee reserves moves from your in-app account into auction escrow now."
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  variant: "outline",
                  className: "flex-1 border-border",
                  onClick: onClose,
                  "data-ocid": "marketplace.bid_cancel_button",
                  children: "Cancel"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "submit",
                  disabled: isBidding,
                  className: "flex-1 bg-accent text-accent-foreground hover:bg-accent/90 transition-smooth font-semibold",
                  "data-ocid": "marketplace.bid_confirm_button",
                  children: isBidding ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, { size: "sm" }) : "Review Bid"
                }
              )
            ] })
          ] })
        ]
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PaymentConfirmationDialog,
      {
        open: confirmBidOpen,
        onOpenChange: setConfirmBidOpen,
        title: "Fund Auction Escrow",
        description: isVaultedInMintlab(nft) ? "Your bid is held in escrow until you are outbid or the auction settles. If you win, this vaulted NFT stays in Mintlab custody until you withdraw it." : "Your bid is held in escrow until you are outbid or the auction settles. Outbid refunds return the bid and unused reserve, but ledger transfers into escrow and back still cost a small amount of ICP.",
        lines: [
          {
            label: "Bid amount",
            value: `${formatICPAmount(pendingAmount)} ICP`
          },
          {
            label: "Mintlab fee if won",
            value: `${formatICPAmount(pendingMintlabFee)} ICP`,
            helper: "Deducted from seller proceeds."
          },
          {
            label: "Escrow fee reserve",
            value: `${formatICPAmount(auctionBidFeeReserveE8s)} ICP`,
            helper: "Reserved to settle the sale or refund you if outbid."
          },
          {
            label: "Transfer to escrow fee",
            value: `${formatICPAmount(ledgerFeeE8s)} ICP`
          },
          {
            label: "Total debit now",
            value: `${formatICPAmount(maximumDebit)} ICP`
          }
        ],
        confirmLabel: "Fund Escrow",
        isPending: isBidding,
        onConfirm: () => {
          if (pendingBidAmount == null) return;
          onBid(listing.id, pendingBidAmount);
        },
        ocid: "marketplace.bid.payment_dialog"
      }
    )
  ] });
}
function MarketplacePage() {
  var _a, _b;
  const { actor, isFetching: actorLoading } = useBackend();
  const { isAuthenticated, principal, login } = useAuth();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const search = useSearch({ strict: false });
  const params = useParams({ strict: false });
  const listingIdParam = params.listingId;
  const principalStr = (principal == null ? void 0 : principal.toString()) ?? null;
  const [activeTab, setActiveTab] = reactExports.useState(
    search.tab ?? "all"
  );
  const [searchQuery, setSearchQuery] = reactExports.useState(search.q ?? "");
  const [collectionFilter, setCollectionFilter] = reactExports.useState(
    search.collection ?? "all"
  );
  const [trustFilter, setTrustFilter] = reactExports.useState(
    search.trust ?? "all"
  );
  const [sortBy, setSortBy] = reactExports.useState(
    search.sort ?? "newest"
  );
  const [buyTarget, setBuyTarget] = reactExports.useState(null);
  const [cancelTarget, setCancelTarget] = reactExports.useState(null);
  const [bidTarget, setBidTarget] = reactExports.useState(null);
  const [listModalOpen, setListModalOpen] = reactExports.useState(false);
  const [detailTarget, setDetailTarget] = reactExports.useState(
    null
  );
  const listingPageMeta = reactExports.useMemo(() => {
    var _a2;
    if (!detailTarget) return {};
    const { listing, nft, collection } = detailTarget;
    const name = getNFTDisplayName(nft, collection);
    const listingId = listing.__kind__ === "Fixed" ? listing.Fixed.id : listing.Auction.id;
    return {
      title: `${name} — Mintlab Marketplace`,
      description: ((_a2 = nft.metadata.description) == null ? void 0 : _a2.trim()) || `${name} is listed on Mintlab Marketplace.`,
      image: resolveImageUrl(nft.metadata.imageUrl, {
        canisterId: collection == null ? void 0 : collection.canisterId.toString(),
        tokenId: nft.tokenId
      }),
      url: appPageUrl(listingSharePath(listingId))
    };
  }, [detailTarget]);
  usePageMeta(listingPageMeta);
  const searchDebounceRef = reactExports.useRef(null);
  const discoverySearch = reactExports.useMemo(
    () => ({
      q: searchQuery.trim() || void 0,
      collection: collectionFilter === "all" ? void 0 : collectionFilter,
      trust: trustFilter === "all" ? void 0 : trustFilter,
      sort: sortBy === "newest" ? void 0 : sortBy,
      tab: activeTab === "all" ? void 0 : activeTab
    }),
    [searchQuery, collectionFilter, trustFilter, sortBy, activeTab]
  );
  const syncDiscoveryToUrl = reactExports.useCallback(
    (overrides) => {
      const nextSearch = { ...discoverySearch, ...overrides };
      void navigate({
        to: listingIdParam ? "/marketplace/listing/$listingId" : "/marketplace",
        params: listingIdParam ? { listingId: listingIdParam } : void 0,
        search: nextSearch,
        replace: true
      });
    },
    [discoverySearch, listingIdParam, navigate]
  );
  reactExports.useEffect(() => {
    setActiveTab(search.tab ?? "all");
    setSearchQuery(search.q ?? "");
    setCollectionFilter(search.collection ?? "all");
    setTrustFilter(search.trust ?? "all");
    setSortBy(search.sort ?? "newest");
  }, [search.q, search.collection, search.trust, search.sort, search.tab]);
  reactExports.useEffect(() => {
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }
    searchDebounceRef.current = setTimeout(() => {
      syncDiscoveryToUrl();
    }, 300);
    return () => {
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
      }
    };
  }, [syncDiscoveryToUrl]);
  const showVaultedPurchaseToast = reactExports.useCallback(
    (title) => {
      ue.success(title, {
        description: "This vaulted NFT is now in your Mintlab wallet. Use Withdraw to external wallet when you are ready to move the original NFT out of Mintlab custody.",
        action: {
          label: WITHDRAW_TO_EXTERNAL_WALLET_LABEL,
          onClick: () => {
            void navigate({ to: "/wallet" });
          }
        },
        duration: 9e3
      });
    },
    [navigate]
  );
  const { data: listingDetails = [], isLoading: listingsLoading } = useQuery({
    queryKey: ["activeListingDetails", "marketplace", "all"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getActiveListingDetails();
    },
    enabled: !!actor && !actorLoading,
    staleTime: 12e4,
    refetchInterval: 3e5
  });
  const { data: collections = [] } = useQuery({
    queryKey: [
      "collections",
      "marketplace",
      MARKETPLACE_COLLECTION_PAGE_SIZE.toString()
    ],
    queryFn: async () => {
      if (!actor) return [];
      const page = await actor.listCollectionsPage(
        null,
        MARKETPLACE_COLLECTION_PAGE_SIZE
      );
      return page.collections;
    },
    enabled: !!actor && !actorLoading
  });
  const { data: collectionImportMetas = [] } = useQuery(
    {
      queryKey: ["collectionImportMetas", "marketplace"],
      queryFn: async () => {
        if (!actor) return [];
        const page = await actor.listCollectionImportMetasPage(null, 100n);
        return page.metas;
      },
      enabled: !!actor && !actorLoading
    }
  );
  const { data: marketplaceFeeConfig } = useQuery({
    queryKey: ["marketplaceFeeConfig"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMarketplaceFeeConfig();
    },
    enabled: !!actor && !actorLoading,
    staleTime: 36e5
  });
  const { data: userNFTs = [] } = useQuery({
    queryKey: ["userNFTs", principal == null ? void 0 : principal.toString()],
    queryFn: async () => {
      if (!actor || !principal) return [];
      const page = await actor.getUserNFTsPage(
        principal,
        null,
        MARKETPLACE_WALLET_PAGE_SIZE
      );
      return page.nfts;
    },
    enabled: !!actor && !actorLoading && isAuthenticated && !!principal
  });
  const { data: settlementStatuses = [] } = useQuery({
    queryKey: ["myMarketplaceSettlementStatuses", principal == null ? void 0 : principal.toString()],
    queryFn: async () => {
      if (!actor) return [];
      const page = await actor.getMyMarketplaceSettlementStatusesPage(
        null,
        MARKETPLACE_STATUS_PAGE_SIZE
      );
      return page.statuses;
    },
    enabled: !!actor && !actorLoading && isAuthenticated,
    staleTime: 12e4,
    refetchInterval: 3e5
  });
  const collectionMap = reactExports.useMemo(
    () => new Map(
      collections.map((collection) => [collection.id, collection])
    ),
    [collections]
  );
  const importMetaMap = reactExports.useMemo(
    () => collectionMetaMap(collectionImportMetas),
    [collectionImportMetas]
  );
  const { data: listingDividendBalances = [] } = useQuery({
    queryKey: [
      "marketplaceDividendBalances",
      listingDetails.map((detail) => detail.nft.collectionId.toString()).join(","),
      collections.map((collection) => collection.id.toString()).join(",")
    ],
    queryFn: async () => {
      var _a2;
      if (!actor) return [];
      const entries = [];
      const collectionIds = Array.from(
        new Set(listingDetails.map((detail) => detail.nft.collectionId))
      );
      for (const collectionId of collectionIds) {
        const collection = collectionMap.get(collectionId);
        if (!((_a2 = collection == null ? void 0 : collection.dividendConfig) == null ? void 0 : _a2.enabled)) continue;
        const balances = await actor.getCollectionDividendBalances(collectionId);
        for (const [tokenId, balance] of balances) {
          entries.push([`${collectionId.toString()}:${tokenId}`, balance]);
        }
      }
      return entries;
    },
    enabled: !!actor && !actorLoading && listingDetails.length > 0,
    refetchOnWindowFocus: false,
    staleTime: 6e4
  });
  const listingDividendMap = reactExports.useMemo(
    () => new Map(listingDividendBalances),
    [listingDividendBalances]
  );
  const ledgerFeeE8s = (marketplaceFeeConfig == null ? void 0 : marketplaceFeeConfig.ledgerFeeE8s) ?? DEFAULT_ICP_LEDGER_FEE_E8S;
  const auctionBidFeeReserveE8s = (marketplaceFeeConfig == null ? void 0 : marketplaceFeeConfig.auctionBidFeeReserveE8s) ?? ledgerFeeE8s * 2n;
  const mintlabFeeBps = (marketplaceFeeConfig == null ? void 0 : marketplaceFeeConfig.mintlabFeeBasisPoints) ?? DEFAULT_MINTLAB_FEE_BPS;
  const allListings = reactExports.useMemo(() => {
    return listingDetails.map((detail) => {
      const collection = collectionMap.get(detail.nft.collectionId);
      const trustStatus = collection ? collectionTrustStatus(
        collection,
        importMetaMap.get(collection.id.toString())
      ) : null;
      if (detail.listing.__kind__ === "Fixed") {
        return {
          kind: "fixed",
          listing: detail.listing.Fixed,
          nft: detail.nft,
          collection,
          trustStatus
        };
      }
      return {
        kind: "auction",
        listing: detail.listing.Auction,
        nft: detail.nft,
        collection,
        trustStatus
      };
    });
  }, [listingDetails, collectionMap, importMetaMap]);
  const isVerifiedListing = reactExports.useCallback(
    ({ collection }) => collection != null && isMintlabVerifiedCollection(
      collection,
      importMetaMap.get(collection.id.toString())
    ),
    [importMetaMap]
  );
  const applyDiscovery = reactExports.useCallback(
    (items) => {
      const filtered = filterMarketplaceListings(items, {
        query: searchQuery,
        collectionId: collectionFilter === "all" ? null : collectionFilter,
        trust: trustFilter,
        isVerified: isVerifiedListing
      });
      return sortMarketplaceListings(filtered, sortBy);
    },
    [searchQuery, collectionFilter, trustFilter, sortBy, isVerifiedListing]
  );
  const discoveredAllListings = applyDiscovery(allListings);
  const fixedListings = discoveredAllListings.filter(
    (item) => item.kind === "fixed"
  );
  const buyListingDetail = buyTarget == null ? null : fixedListings.find(({ listing }) => listing.id === buyTarget) ?? null;
  const auctionListings = discoveredAllListings.filter(
    (item) => item.kind === "auction"
  );
  const verifiedListings = discoveredAllListings.filter(isVerifiedListing);
  const communityListings = discoveredAllListings.filter(
    (item) => !isVerifiedListing(item)
  );
  const verifiedFixedListings = fixedListings.filter(isVerifiedListing);
  const communityFixedListings = fixedListings.filter(
    (item) => !isVerifiedListing(item)
  );
  const verifiedAuctionListings = auctionListings.filter(isVerifiedListing);
  const communityAuctionListings = auctionListings.filter(
    (item) => !isVerifiedListing(item)
  );
  const cancelAuctionDetail = cancelTarget == null ? null : auctionListings.find(({ listing }) => listing.id === cancelTarget) ?? null;
  const cancelAuctionBlockedByBid = cancelAuctionDetail != null && auctionHasBid(cancelAuctionDetail.listing);
  const auctionListingIds = auctionListings.map(({ listing }) => listing.id);
  const auctionListingIdsKey = auctionListingIds.map((id) => id.toString()).join(",");
  const { data: myAuctionBidStatuses = [] } = useQuery({
    queryKey: [
      "myAuctionBidStatuses",
      principal == null ? void 0 : principal.toString(),
      auctionListingIdsKey
    ],
    queryFn: async () => {
      if (!actor || auctionListingIds.length === 0) return [];
      return actor.getMyAuctionBidStatuses(auctionListingIds);
    },
    enabled: !!actor && !actorLoading && isAuthenticated && !!principal && auctionListingIds.length > 0,
    staleTime: 12e4,
    refetchInterval: 3e5
  });
  const myAuctionBidStatusMap = new Map(
    myAuctionBidStatuses.map((status) => [status.listingId.toString(), status])
  );
  const listedNFTKeys = new Set(
    listingDetails.filter((detail) => {
      const seller = detail.listing.__kind__ === "Fixed" ? detail.listing.Fixed.seller : detail.listing.Auction.seller;
      return principal ? seller.toString() === principal.toString() : false;
    }).map(
      (detail) => `${detail.nft.collectionId.toString()}:${detail.nft.tokenId}`
    )
  );
  const listableUserNFTs = userNFTs.filter((nft) => {
    if (listedNFTKeys.has(`${nft.collectionId.toString()}:${nft.tokenId}`)) {
      return false;
    }
    if (nft.location === "Minted" || nft.location === "Vaulted") return true;
    if (nft.location !== "Registered") return false;
    const collection = collectionMap.get(nft.collectionId);
    return (collection == null ? void 0 : collection.kind) === "External";
  });
  const listingCollectionOptions = reactExports.useMemo(() => {
    const listedCollectionIds = new Set(
      allListings.map((item) => item.nft.collectionId.toString())
    );
    return collections.filter((collection) => listedCollectionIds.has(collection.id.toString())).sort((a, b) => a.name.localeCompare(b.name));
  }, [allListings, collections]);
  const hasActiveDiscoveryFilters = searchQuery.trim().length > 0 || collectionFilter !== "all" || trustFilter !== "all" || sortBy !== "newest";
  const buildListingDetail = reactExports.useCallback(
    (item) => {
      const dividendE8s = listingDividendMap.get(
        nftKey(item.nft.collectionId, item.nft.tokenId)
      ) ?? 0n;
      if (item.kind === "fixed") {
        return {
          listing: { __kind__: "Fixed", Fixed: item.listing },
          nft: item.nft,
          collection: item.collection,
          trustStatus: item.trustStatus,
          dividendE8s
        };
      }
      return {
        listing: {
          __kind__: "Auction",
          Auction: item.listing
        },
        nft: item.nft,
        collection: item.collection,
        trustStatus: item.trustStatus,
        dividendE8s
      };
    },
    [listingDividendMap]
  );
  const openListingDetail = reactExports.useCallback(
    (detail) => {
      setDetailTarget(detail);
      const listingId = detail.listing.__kind__ === "Fixed" ? detail.listing.Fixed.id : detail.listing.Auction.id;
      void navigate({
        to: "/marketplace/listing/$listingId",
        params: { listingId: listingId.toString() },
        search: discoverySearch
      });
    },
    [discoverySearch, navigate]
  );
  const closeListingDetail = reactExports.useCallback(() => {
    setDetailTarget(null);
    void navigate({
      to: "/marketplace",
      search: discoverySearch
    });
  }, [discoverySearch, navigate]);
  reactExports.useEffect(() => {
    if (!listingIdParam || listingsLoading) return;
    let listingId;
    try {
      listingId = BigInt(listingIdParam);
    } catch {
      return;
    }
    const item = allListings.find(
      (listingItem) => listingIdFromItem(listingItem) === listingId
    );
    if (!item) return;
    const nextDetail = buildListingDetail(item);
    setDetailTarget((current) => {
      if (!current) return nextDetail;
      const currentListingId = current.listing.__kind__ === "Fixed" ? current.listing.Fixed.id : current.listing.Auction.id;
      if (currentListingId === listingId && current.dividendE8s === nextDetail.dividendE8s) {
        return current;
      }
      return nextDetail;
    });
  }, [listingIdParam, listingsLoading, allListings, buildListingDetail]);
  const clearDiscoveryFilters = () => {
    setSearchQuery("");
    setCollectionFilter("all");
    setTrustFilter("all");
    setSortBy("newest");
    void navigate({
      to: listingIdParam ? "/marketplace/listing/$listingId" : "/marketplace",
      params: listingIdParam ? { listingId: listingIdParam } : void 0,
      search: {},
      replace: true
    });
  };
  const refreshMarketplace = () => {
    void qc.invalidateQueries({ queryKey: ["activeListingDetails"] });
    void qc.invalidateQueries({ queryKey: ["activeListings"] });
    void qc.invalidateQueries({ queryKey: ["userNFTs"] });
    void qc.invalidateQueries({ queryKey: ["userStats"] });
    void qc.invalidateQueries({ queryKey: ["icp-balance"] });
    void qc.invalidateQueries({ queryKey: ["collectionImportMetas"] });
    void qc.invalidateQueries({ queryKey: ["myAuctionBidStatuses"] });
    void qc.invalidateQueries({
      queryKey: ["myMarketplaceSettlementStatuses"]
    });
  };
  const { mutate: reportListing } = useMutation({
    mutationFn: async ({
      collection,
      nft
    }) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.reportNFT(
        collection.id,
        nft.tokenId,
        `Marketplace report for ${getNFTTokenLabel(nft, collection)} in ${collection.name}`
      );
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      ue.success("Report sent to Mintlab admins.");
      void qc.invalidateQueries({ queryKey: ["collectionImportMetas"] });
      void qc.invalidateQueries({ queryKey: ["nftReportMetas"] });
      void qc.invalidateQueries({ queryKey: ["collections"] });
      void qc.invalidateQueries({ queryKey: ["activeListingDetails"] });
    },
    onError: (e) => ue.error(`Report failed: ${e.message}`)
  });
  function handleReportListing(collection, nft) {
    if (!collection) {
      ue.error("Collection information is missing for this NFT.");
      return;
    }
    if (!isAuthenticated) {
      ue("Sign in to report this NFT.");
      return;
    }
    reportListing({ collection, nft });
  }
  async function ensureNFTReadyForListing(nft) {
    if (!actor) throw new Error("Not connected");
    if (nft.location !== "Registered") return nft.id;
    if (!principal) throw new Error("Sign in to list this NFT");
    const collection = collectionMap.get(nft.collectionId);
    if (!collection) throw new Error("Collection not found for this NFT");
    if (collection.kind !== "External") {
      throw new Error(
        "Only external registered NFTs can be vaulted for listing"
      );
    }
    const existingClaim = await actor.claimVaultDeposit(
      nft.collectionId,
      nft.tokenId
    );
    if (existingClaim.__kind__ === "ok") return existingClaim.ok.id;
    const prepared = await actor.prepareVaultDeposit(
      nft.collectionId,
      nft.tokenId
    );
    if (prepared.__kind__ === "err") throw new Error(prepared.err);
    const vaultPrincipal = await actor.getVaultPrincipal();
    await transferRegisteredNFT({
      agent: actor.getAgent(),
      collection,
      nft,
      owner: principal,
      recipient: vaultPrincipal
    });
    const claimed = await actor.claimVaultDeposit(
      nft.collectionId,
      nft.tokenId
    );
    if (claimed.__kind__ === "err") throw new Error(claimed.err);
    return claimed.ok.id;
  }
  const { mutate: buyListing, isPending: isBuying } = useMutation({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Not connected");
      return actor.buyFixedListing(id);
    },
    onSuccess: (_result, id) => {
      const purchasedDetail = fixedListings.find(
        ({ listing }) => listing.id === id
      );
      if (isVaultedInMintlab(purchasedDetail == null ? void 0 : purchasedDetail.nft)) {
        showVaultedPurchaseToast("Vaulted NFT purchased");
      } else {
        ue.success("NFT purchased successfully!");
      }
      setBuyTarget(null);
      refreshMarketplace();
    },
    onError: (e) => ue.error(`Purchase failed: ${e.message}`)
  });
  const { mutate: cancelListing, isPending: isCancelling } = useMutation({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Not connected");
      return actor.cancelListing(id);
    },
    onSuccess: () => {
      ue.success("Listing cancelled.");
      setCancelTarget(null);
      refreshMarketplace();
    },
    onError: (e) => ue.error(`Cancel failed: ${e.message}`)
  });
  const { mutate: placeBid, isPending: isBidding } = useMutation({
    mutationFn: async ({ id, amount }) => {
      if (!actor) throw new Error("Not connected");
      return actor.placeBid(id, amount);
    },
    onSuccess: () => {
      ue.success("Bid placed and escrow funded!");
      setBidTarget(null);
      refreshMarketplace();
    },
    onError: (e) => {
      if (e.message.toLowerCase().includes("pending bid")) {
        ue.error(
          "This auction has a pending bid recovery. Retry with the same amount or contact an admin."
        );
        return;
      }
      ue.error(`Bid failed: ${e.message}`);
    }
  });
  const { mutate: retryPendingBid, isPending: isRetryingPendingBid } = useMutation({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Not connected");
      return actor.retryPendingBid(id);
    },
    onSuccess: () => {
      ue.success("Pending bid recovered.");
      refreshMarketplace();
    },
    onError: (e) => ue.error(`Retry failed: ${e.message}`)
  });
  const {
    mutate: cancelStalePendingBid,
    isPending: isCancellingStalePendingBid
  } = useMutation({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Not connected");
      return actor.cancelStalePendingBid(id);
    },
    onSuccess: () => {
      ue.success("Pending bid recovery resolved.");
      refreshMarketplace();
    },
    onError: (e) => ue.error(`Recovery failed: ${e.message}`)
  });
  const { mutate: settleAuction, isPending: isSettling } = useMutation({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Not connected");
      return actor.settleAuction(id);
    },
    onSuccess: (_result, id) => {
      const settledDetail = auctionListings.find(
        ({ listing }) => listing.id === id
      );
      const bidStatus = myAuctionBidStatusMap.get(id.toString());
      const viewerIsWinner = settledDetail != null && isViewerWinningAuction(settledDetail.listing, principalStr, bidStatus);
      if (viewerIsWinner && isVaultedInMintlab(settledDetail == null ? void 0 : settledDetail.nft)) {
        showVaultedPurchaseToast("Vaulted auction NFT collected");
      } else {
        ue.success("Auction settled!");
      }
      refreshMarketplace();
    },
    onError: (e) => ue.error(`Settle failed: ${e.message}`)
  });
  const { mutate: createFixed, isPending: isCreatingFixed } = useMutation({
    mutationFn: async ({ nft, price }) => {
      if (!actor) throw new Error("Not connected");
      const nftId = await ensureNFTReadyForListing(nft);
      return actor.createFixedListing(nftId, price);
    },
    onSuccess: () => {
      ue.success("Fixed listing created!");
      setListModalOpen(false);
      refreshMarketplace();
    },
    onError: (e) => ue.error(`Listing failed: ${e.message}`)
  });
  const { mutate: createAuction, isPending: isCreatingAuction } = useMutation({
    mutationFn: async ({
      nft,
      startingBid,
      endTime
    }) => {
      if (!actor) throw new Error("Not connected");
      const nftId = await ensureNFTReadyForListing(nft);
      return actor.createAuctionListing(nftId, startingBid, endTime);
    },
    onSuccess: () => {
      ue.success("Auction listing created!");
      setListModalOpen(false);
      refreshMarketplace();
    },
    onError: (e) => ue.error(`Listing failed: ${e.message}`)
  });
  const isListing = isCreatingFixed || isCreatingAuction;
  function handleList(params2) {
    if (params2.type === "fixed") {
      createFixed({ nft: params2.nft, price: params2.price });
    } else {
      createAuction({
        nft: params2.nft,
        startingBid: params2.startingBid,
        endTime: params2.endTime
      });
    }
  }
  function renderListingCard(item, index, ocidPrefix) {
    const dividendE8s = listingDividendMap.get(nftKey(item.nft.collectionId, item.nft.tokenId)) ?? 0n;
    if (item.kind === "fixed") {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        FixedListingCard,
        {
          listing: item.listing,
          nft: item.nft,
          collection: item.collection,
          trustStatus: item.trustStatus,
          dividendE8s,
          index,
          ocidPrefix,
          currentPrincipal: principalStr,
          onBuy: (id) => setBuyTarget(id),
          onCancel: (id) => setCancelTarget(id),
          onDetails: () => openListingDetail(buildListingDetail(item)),
          isBuying: isBuying && buyTarget === item.listing.id,
          isCancelling: isCancelling && cancelTarget === item.listing.id
        },
        `${ocidPrefix ?? "marketplace.fixed"}-${item.listing.id.toString()}`
      );
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      AuctionListingCard,
      {
        listing: item.listing,
        nft: item.nft,
        collection: item.collection,
        trustStatus: item.trustStatus,
        dividendE8s,
        index,
        ocidPrefix,
        currentPrincipal: principalStr,
        bidStatus: myAuctionBidStatusMap.get(item.listing.id.toString()),
        onBid: (listing) => setBidTarget(listing),
        onSettle: (id) => settleAuction(id),
        onCancel: (id) => setCancelTarget(id),
        onDetails: () => openListingDetail(buildListingDetail(item)),
        isSettling,
        isCancelling: isCancelling && cancelTarget === item.listing.id
      },
      `${ocidPrefix ?? "marketplace.auction"}-${item.listing.id.toString()}`
    );
  }
  const buyPrice = (buyListingDetail == null ? void 0 : buyListingDetail.listing.price) ?? 0n;
  const buyMintlabFee = marketplaceFee(buyPrice, mintlabFeeBps);
  const buySellerProceeds = buyPrice - buyMintlabFee;
  const buySettlementLedgerFees = ledgerFeeE8s * (buyMintlabFee > 0n ? 2n : 1n);
  const buyTotalLedgerFees = buySettlementLedgerFees + ledgerFeeE8s;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", "data-ocid": "marketplace.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-widest font-mono mb-0.5", children: "Marketplace" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold text-foreground leading-tight", children: "Discover Digital Collectibles" })
      ] }),
      isAuthenticated ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          className: "bg-accent text-accent-foreground hover:bg-accent/90 transition-smooth font-semibold shrink-0",
          onClick: () => setListModalOpen(true),
          "data-ocid": "marketplace.list_nft_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { className: "w-4 h-4 mr-2" }),
            "List Your NFT"
          ]
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "outline",
          className: "border-accent/40 text-accent hover:bg-accent/10 transition-smooth shrink-0",
          onClick: login,
          "data-ocid": "marketplace.login_button",
          children: "Connect Wallet to List"
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        HelpCallout,
        {
          title: "List from your Wallet, buy and bid from your ICP Account",
          sectionId: "marketplace",
          actionLabel: "Marketplace guide",
          className: "mb-6",
          ocid: "marketplace.help_callout",
          children: "Fixed purchases and auction bids use your in-app ICP balance. External registered wallet NFTs are vaulted before listing. Buying a vaulted NFT keeps it in Mintlab custody until the owner withdraws it to an external wallet."
        }
      ),
      settlementStatuses.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-4 w-4 text-amber-700 dark:text-amber-200" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-foreground", children: "Settlement status" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-2 md:grid-cols-2", children: settlementStatuses.map((status) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "rounded-md border border-border bg-background/70 p-3",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-1 flex items-center justify-between gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-medium text-foreground", children: [
                  "Listing #",
                  status.listingId.toString()
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "shrink-0 border-0 bg-amber-500/20 text-amber-700 dark:text-amber-200", children: status.role })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-muted-foreground", children: status.stage }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: status.message }),
              status.kind === "PendingBidDeposit" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex flex-wrap gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    type: "button",
                    size: "sm",
                    variant: "secondary",
                    className: "h-7 text-xs",
                    disabled: isRetryingPendingBid,
                    onClick: () => retryPendingBid(status.listingId),
                    "data-ocid": `marketplace.pending_bid.retry.${status.listingId.toString()}`,
                    children: [
                      isRetryingPendingBid ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, { size: "sm" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-3.5 w-3.5" }),
                      "Retry bid"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    type: "button",
                    size: "sm",
                    variant: "outline",
                    className: "h-7 text-xs",
                    disabled: isCancellingStalePendingBid,
                    onClick: () => cancelStalePendingBid(status.listingId),
                    "data-ocid": `marketplace.pending_bid.cancel_stale.${status.listingId.toString()}`,
                    children: [
                      isCancellingStalePendingBid ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, { size: "sm" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3.5 w-3.5" }),
                      "Cancel stale bid"
                    ]
                  }
                )
              ] })
            ]
          },
          `${status.kind}:${status.listingId.toString()}:${status.role}`
        )) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "mb-6 space-y-3 rounded-xl border border-border bg-card/70 p-4",
          "data-ocid": "marketplace.discovery.toolbar",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm font-medium text-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SlidersHorizontal, { className: "h-4 w-4 text-accent" }),
              "Discover listings"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3 lg:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,0.7fr))_auto]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    value: searchQuery,
                    onChange: (event) => setSearchQuery(event.target.value),
                    placeholder: "Search NFTs, collections, sellers, token IDs…",
                    className: "bg-background pl-9",
                    "data-ocid": "marketplace.discovery.search_input"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Select,
                {
                  value: collectionFilter,
                  onValueChange: (value) => {
                    setCollectionFilter(value);
                    syncDiscoveryToUrl({
                      collection: value === "all" ? void 0 : value
                    });
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "marketplace.discovery.collection_filter", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "All collections" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All collections" }),
                      listingCollectionOptions.map((collection) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                        SelectItem,
                        {
                          value: collection.id.toString(),
                          children: collection.name
                        },
                        collection.id.toString()
                      ))
                    ] })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Select,
                {
                  value: trustFilter,
                  onValueChange: (value) => {
                    const nextTrust = value;
                    setTrustFilter(nextTrust);
                    syncDiscoveryToUrl({
                      trust: nextTrust === "all" ? void 0 : nextTrust
                    });
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "marketplace.discovery.trust_filter", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "All trust levels" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All trust levels" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "verified", children: "Mintlab verified" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "community", children: "Community only" })
                    ] })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Select,
                {
                  value: sortBy,
                  onValueChange: (value) => {
                    const nextSort = value;
                    setSortBy(nextSort);
                    syncDiscoveryToUrl({
                      sort: nextSort === "newest" ? void 0 : nextSort
                    });
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "marketplace.discovery.sort_filter", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Sort listings" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "newest", children: "Newest listed" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "price-asc", children: "Price: low to high" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "price-desc", children: "Price: high to low" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "ending-soon", children: "Ending soon" })
                    ] })
                  ]
                }
              ),
              hasActiveDiscoveryFilters && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  type: "button",
                  variant: "ghost",
                  size: "sm",
                  className: "gap-1.5 text-muted-foreground",
                  onClick: clearDiscoveryFilters,
                  "data-ocid": "marketplace.discovery.clear_filters",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3.5 w-3.5" }),
                    "Clear"
                  ]
                }
              )
            ] }),
            !listingsLoading && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
              "Showing ",
              discoveredAllListings.length,
              " of ",
              allListings.length,
              " ",
              "active listings"
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Tabs,
        {
          value: activeTab,
          onValueChange: (value) => {
            const nextTab = value;
            setActiveTab(nextTab);
            syncDiscoveryToUrl({
              tab: nextTab === "all" ? void 0 : nextTab
            });
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              TabsList,
              {
                className: "bg-muted/60 border border-border mb-6",
                "data-ocid": "marketplace.tabs",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    TabsTrigger,
                    {
                      value: "all",
                      className: "data-[state=active]:bg-foreground data-[state=active]:text-background font-medium",
                      "data-ocid": "marketplace.tab.all",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "w-4 h-4 mr-2" }),
                        "All Listings",
                        discoveredAllListings.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "ml-2 bg-background/20 text-current text-[10px] px-1.5 py-0 font-mono border-0", children: discoveredAllListings.length })
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    TabsTrigger,
                    {
                      value: "fixed",
                      className: "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-medium",
                      "data-ocid": "marketplace.tab.fixed",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { className: "w-4 h-4 mr-2" }),
                        "Fixed Price",
                        fixedListings.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "ml-2 bg-primary/20 text-primary text-[10px] px-1.5 py-0 font-mono border-0", children: fixedListings.length })
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    TabsTrigger,
                    {
                      value: "auctions",
                      className: "data-[state=active]:bg-accent data-[state=active]:text-accent-foreground font-medium",
                      "data-ocid": "marketplace.tab.auctions",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Gavel, { className: "w-4 h-4 mr-2" }),
                        "Auctions",
                        auctionListings.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "ml-2 bg-accent/20 text-accent text-[10px] px-1.5 py-0 font-mono border-0", children: auctionListings.length })
                      ]
                    }
                  )
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "all", className: "mt-0", children: listingsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "flex items-center justify-center min-h-[40vh]",
                "data-ocid": "marketplace.all.loading_state",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, { size: "lg", label: "Loading listings…" })
              }
            ) : allListings.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              EmptyState,
              {
                icon: ShoppingBag,
                title: "No marketplace listings",
                description: "No fixed-price listings or auctions are active right now. List yours to start the marketplace.",
                action: isAuthenticated ? {
                  label: "List Your NFT",
                  onClick: () => setListModalOpen(true),
                  "data-ocid": "marketplace.all.list_cta"
                } : void 0,
                "data-ocid": "marketplace.all.empty_state"
              }
            ) : discoveredAllListings.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              EmptyState,
              {
                icon: Search,
                title: "No listings match your filters",
                description: "Try a broader search, another collection, or clear the current filters to see more marketplace listings.",
                action: {
                  label: "Clear filters",
                  onClick: clearDiscoveryFilters,
                  "data-ocid": "marketplace.all.clear_filters_cta"
                },
                "data-ocid": "marketplace.all.filtered_empty_state"
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8", children: [
              verifiedListings.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4", children: verifiedListings.map(
                (item, i) => renderListingCard(
                  item,
                  i,
                  item.kind === "fixed" ? "marketplace.all.fixed" : "marketplace.all.auction"
                )
              ) }),
              communityListings.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "space-y-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-amber-500/30 bg-amber-500/10 p-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: "Unverified community listings" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-xs leading-relaxed text-muted-foreground", children: [
                    COMMUNITY_COLLECTION_NOTICE,
                    " Check canister IDs carefully and report suspected counterfeits or unsafe content."
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4", children: communityListings.map(
                  (item, i) => renderListingCard(
                    item,
                    verifiedListings.length + i,
                    item.kind === "fixed" ? "marketplace.all.fixed" : "marketplace.all.auction"
                  )
                ) })
              ] })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "fixed", className: "mt-0", children: listingsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "flex items-center justify-center min-h-[40vh]",
                "data-ocid": "marketplace.fixed.loading_state",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, { size: "lg", label: "Loading listings…" })
              }
            ) : allListings.filter((item) => item.kind === "fixed").length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              EmptyState,
              {
                icon: ShoppingBag,
                title: "No fixed-price listings",
                description: "Be the first to list an NFT for a fixed price. Connect your wallet and click 'List Your NFT' above.",
                action: isAuthenticated ? {
                  label: "List Your NFT",
                  onClick: () => setListModalOpen(true),
                  "data-ocid": "marketplace.fixed.list_cta"
                } : void 0,
                "data-ocid": "marketplace.fixed.empty_state"
              }
            ) : fixedListings.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              EmptyState,
              {
                icon: Search,
                title: "No fixed listings match your filters",
                description: "Adjust your search or clear filters to see fixed-price listings again.",
                action: {
                  label: "Clear filters",
                  onClick: clearDiscoveryFilters,
                  "data-ocid": "marketplace.fixed.clear_filters_cta"
                },
                "data-ocid": "marketplace.fixed.filtered_empty_state"
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8", children: [
              verifiedFixedListings.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4", children: verifiedFixedListings.map(
                ({ listing, nft, collection, trustStatus }, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  FixedListingCard,
                  {
                    listing,
                    nft,
                    collection,
                    trustStatus,
                    dividendE8s: listingDividendMap.get(
                      nftKey(nft.collectionId, nft.tokenId)
                    ) ?? 0n,
                    index: i,
                    currentPrincipal: principalStr,
                    onBuy: (id) => setBuyTarget(id),
                    onCancel: (id) => setCancelTarget(id),
                    onDetails: () => openListingDetail(
                      buildListingDetail({
                        kind: "fixed",
                        listing,
                        nft,
                        collection,
                        trustStatus
                      })
                    ),
                    isBuying: isBuying && buyTarget === listing.id,
                    isCancelling: isCancelling && cancelTarget === listing.id
                  },
                  listing.id.toString()
                )
              ) }),
              communityFixedListings.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "space-y-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-amber-500/30 bg-amber-500/10 p-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: "Unverified community listings" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-xs leading-relaxed text-muted-foreground", children: [
                    COMMUNITY_COLLECTION_NOTICE,
                    " Check canister IDs carefully and report suspected counterfeits or unsafe content."
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4", children: communityFixedListings.map(
                  ({ listing, nft, collection, trustStatus }, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    FixedListingCard,
                    {
                      listing,
                      nft,
                      collection,
                      trustStatus,
                      dividendE8s: listingDividendMap.get(
                        nftKey(nft.collectionId, nft.tokenId)
                      ) ?? 0n,
                      index: verifiedFixedListings.length + i,
                      currentPrincipal: principalStr,
                      onBuy: (id) => setBuyTarget(id),
                      onCancel: (id) => setCancelTarget(id),
                      onDetails: () => openListingDetail(
                        buildListingDetail({
                          kind: "fixed",
                          listing,
                          nft,
                          collection,
                          trustStatus
                        })
                      ),
                      isBuying: isBuying && buyTarget === listing.id,
                      isCancelling: isCancelling && cancelTarget === listing.id
                    },
                    listing.id.toString()
                  )
                ) })
              ] })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "auctions", className: "mt-0", children: listingsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "flex items-center justify-center min-h-[40vh]",
                "data-ocid": "marketplace.auction.loading_state",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, { size: "lg", label: "Loading auctions…" })
              }
            ) : allListings.filter((item) => item.kind === "auction").length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              EmptyState,
              {
                icon: Gavel,
                title: "No active auctions",
                description: "No NFTs are currently up for auction. List yours to start the bidding!",
                action: isAuthenticated ? {
                  label: "Start an Auction",
                  onClick: () => setListModalOpen(true),
                  "data-ocid": "marketplace.auction.list_cta"
                } : void 0,
                "data-ocid": "marketplace.auction.empty_state"
              }
            ) : auctionListings.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              EmptyState,
              {
                icon: Search,
                title: "No auctions match your filters",
                description: "Adjust your search or clear filters to see active auctions again.",
                action: {
                  label: "Clear filters",
                  onClick: clearDiscoveryFilters,
                  "data-ocid": "marketplace.auction.clear_filters_cta"
                },
                "data-ocid": "marketplace.auction.filtered_empty_state"
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8", children: [
              verifiedAuctionListings.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4", children: verifiedAuctionListings.map(
                ({ listing, nft, collection, trustStatus }, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  AuctionListingCard,
                  {
                    listing,
                    nft,
                    collection,
                    trustStatus,
                    dividendE8s: listingDividendMap.get(
                      nftKey(nft.collectionId, nft.tokenId)
                    ) ?? 0n,
                    index: i,
                    currentPrincipal: principalStr,
                    bidStatus: myAuctionBidStatusMap.get(
                      listing.id.toString()
                    ),
                    onBid: (l) => setBidTarget(l),
                    onSettle: (id) => settleAuction(id),
                    onCancel: (id) => setCancelTarget(id),
                    onDetails: () => openListingDetail(
                      buildListingDetail({
                        kind: "auction",
                        listing,
                        nft,
                        collection,
                        trustStatus
                      })
                    ),
                    isSettling,
                    isCancelling: isCancelling && cancelTarget === listing.id
                  },
                  listing.id.toString()
                )
              ) }),
              communityAuctionListings.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "space-y-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-amber-500/30 bg-amber-500/10 p-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: "Unverified community auctions" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-xs leading-relaxed text-muted-foreground", children: [
                    COMMUNITY_COLLECTION_NOTICE,
                    " Check canister IDs carefully and report suspected counterfeits or unsafe content."
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4", children: communityAuctionListings.map(
                  ({ listing, nft, collection, trustStatus }, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    AuctionListingCard,
                    {
                      listing,
                      nft,
                      collection,
                      trustStatus,
                      dividendE8s: listingDividendMap.get(
                        nftKey(nft.collectionId, nft.tokenId)
                      ) ?? 0n,
                      index: verifiedAuctionListings.length + i,
                      currentPrincipal: principalStr,
                      bidStatus: myAuctionBidStatusMap.get(
                        listing.id.toString()
                      ),
                      onBid: (l) => setBidTarget(l),
                      onSettle: (id) => settleAuction(id),
                      onCancel: (id) => setCancelTarget(id),
                      onDetails: () => openListingDetail(
                        buildListingDetail({
                          kind: "auction",
                          listing,
                          nft,
                          collection,
                          trustStatus
                        })
                      ),
                      isSettling,
                      isCancelling: isCancelling && cancelTarget === listing.id
                    },
                    listing.id.toString()
                  )
                ) })
              ] })
            ] }) })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ListingDetailModal,
      {
        detail: detailTarget,
        currentPrincipal: principalStr,
        bidStatusMap: myAuctionBidStatusMap,
        onClose: closeListingDetail,
        onBuy: (id) => setBuyTarget(id),
        onCancel: (id) => setCancelTarget(id),
        onBid: (listing) => setBidTarget(listing),
        onReport: handleReportListing
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      AlertDialog,
      {
        open: buyTarget !== null,
        onOpenChange: (v) => !v && !isBuying && setBuyTarget(null),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          AlertDialogContent,
          {
            className: "bg-card border-border",
            "data-ocid": "marketplace.buy_dialog",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { className: "font-display", children: "Confirm Purchase" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { children: "Confirm the ICP payment from your in-app account. The purchase is funded into marketplace escrow first, then the NFT and seller payout are settled from there." })
              ] }),
              buyListingDetail && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 rounded-lg border border-border bg-muted/30 p-3 text-sm", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Listed price" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono", children: [
                    formatICPAmount(buyListingDetail.listing.price),
                    " ICP"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "NFT custody" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Badge,
                    {
                      variant: "secondary",
                      className: `border text-[10px] ${nftCustodyClass(buyListingDetail.nft.location)}`,
                      children: nftCustodyLabel(buyListingDetail.nft.location)
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
                    "Mintlab fee",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block text-[11px] leading-snug", children: "Deducted from seller proceeds" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono", children: [
                    formatICPAmount(buyMintlabFee),
                    " ICP"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Seller receives" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono", children: [
                    formatICPAmount(buySellerProceeds),
                    " ICP"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
                    "Settlement ledger fees",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block text-[11px] leading-snug", children: "Reserved in escrow for the seller and Mintlab payouts" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono", children: [
                    formatICPAmount(buySettlementLedgerFees),
                    " ICP"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Transfer to escrow fee" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono", children: [
                    formatICPAmount(ledgerFeeE8s),
                    " ICP"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4 border-t border-border pt-2 font-medium", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Total debit" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono", children: [
                    formatICPAmount(buyPrice + buyTotalLedgerFees),
                    " ICP"
                  ] })
                ] })
              ] }),
              isVaultedInMintlab(buyListingDetail == null ? void 0 : buyListingDetail.nft) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-primary/30 bg-primary/5 p-3 text-xs leading-relaxed text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground", children: "Vaulted in Mintlab" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1", children: [
                  VAULTED_PURCHASE_NOTICE,
                  " After purchase, use",
                  " ",
                  WITHDRAW_TO_EXTERNAL_WALLET_LABEL,
                  " from Wallet to move the original NFT to your principal."
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TermsAgreementNotice, { actionLabel: "confirming this purchase" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  AlertDialogCancel,
                  {
                    className: "border-border",
                    disabled: isBuying,
                    "data-ocid": "marketplace.buy_cancel_button",
                    children: "Cancel"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  AlertDialogAction,
                  {
                    className: "bg-accent text-accent-foreground hover:bg-accent/90",
                    disabled: isBuying,
                    onClick: (event) => {
                      event.preventDefault();
                      if (buyTarget !== null && !isBuying) buyListing(buyTarget);
                    },
                    "data-ocid": "marketplace.buy_confirm_button",
                    children: isBuying ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, { size: "sm" }),
                      "Processing purchase..."
                    ] }) : "Confirm Purchase"
                  }
                )
              ] })
            ]
          }
        )
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      AlertDialog,
      {
        open: cancelTarget !== null,
        onOpenChange: (v) => !v && setCancelTarget(null),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          AlertDialogContent,
          {
            className: "bg-card border-border",
            "data-ocid": "marketplace.cancel_dialog",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { className: "font-display", children: "Cancel Listing" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { children: cancelAuctionBlockedByBid ? "This auction already has a bid, so it cannot be canceled. Let the auction finish, then settle it." : "Are you sure you want to cancel this listing? Your NFT will be returned to your wallet." })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TermsAgreementNotice, { actionLabel: "canceling this listing" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  AlertDialogCancel,
                  {
                    className: "border-border",
                    "data-ocid": "marketplace.cancel_keep_button",
                    children: "Keep Listing"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  AlertDialogAction,
                  {
                    className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                    onClick: () => cancelTarget !== null && !cancelAuctionBlockedByBid && cancelListing(cancelTarget),
                    disabled: cancelAuctionBlockedByBid || isCancelling,
                    "data-ocid": "marketplace.cancel_confirm_button",
                    children: isCancelling ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, { size: "sm" }) : "Cancel Listing"
                  }
                )
              ] })
            ]
          }
        )
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PlaceBidModal,
      {
        listing: bidTarget,
        nft: bidTarget ? (_a = auctionListings.find(({ listing }) => listing.id === bidTarget.id)) == null ? void 0 : _a.nft : void 0,
        collection: bidTarget ? (_b = auctionListings.find(({ listing }) => listing.id === bidTarget.id)) == null ? void 0 : _b.collection : void 0,
        ledgerFeeE8s,
        auctionBidFeeReserveE8s,
        mintlabFeeBps,
        onClose: () => setBidTarget(null),
        onBid: (id, amount) => placeBid({ id, amount }),
        isBidding
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ListNFTModal,
      {
        open: listModalOpen,
        onClose: () => setListModalOpen(false),
        userNFTs: listableUserNFTs,
        collections,
        onList: handleList,
        isListing
      }
    )
  ] });
}
export {
  MarketplacePage as default
};
