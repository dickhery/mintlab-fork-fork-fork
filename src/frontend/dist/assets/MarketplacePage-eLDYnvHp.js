import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, h as useId, i as Primitive, k as composeEventHandlers, l as createContextScope, n as useComposedRefs, o as useControllableState, p as useCallbackRef, q as Presence, a as cn, b as useBackend, u as useAuth, e as useQueryClient, s as useNavigate, g as ue, f as useQuery, B as Button, t as LoadingSpinner, X, S as ShoppingBag, A as AlertDialog, v as AlertDialogContent, w as AlertDialogHeader, x as AlertDialogTitle, y as AlertDialogDescription, T as TermsAgreementNotice, z as AlertDialogFooter, C as AlertDialogCancel, D as AlertDialogAction, m as motion } from "./index-D_8V8T-G.js";
import { W as WITHDRAW_TO_EXTERNAL_WALLET_LABEL, n as nftCustodyLabel, a as nftCustodyClass, i as isVaultedInMintlab, V as VAULTED_PURCHASE_NOTICE, C as CollectionBadge, P as PriceDisplay, b as nftCustodyDescription, t as transferRegisteredNFT } from "./external-nft-transfer-B6zc_9BB.js";
import { c as collectionMetaMap, a as collectionTrustStatus, T as Tag, C as COMMUNITY_COLLECTION_NOTICE, i as isMintlabVerifiedCollection, D as DividendBalanceBadge, Z as ZoomableMediaImage, F as Flag, P as PaymentConfirmationDialog } from "./ZoomableMediaImage-oql1p8Fq.js";
import { E as EmptyState, a as getNFTTokenLabel, g as getNFTDisplayName, M as MediaImage, C as Coins } from "./nft-display-DbNr7FxV.js";
import { H as HelpCallout, a as HelpTooltip } from "./HelpCallout-CDwtUjej.js";
import { B as Badge } from "./badge-D2nQx0lT.js";
import { u as useMutation, R as RefreshCw, D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, L as Label } from "./index-D7x0BBlv.js";
import { I as Input } from "./input-CxfeRblo.js";
import { c as createCollection, u as useDirection } from "./index-_BPwb9lV.js";
import { f as formatICPAmount, p as parseICPToE8s } from "./icp-BXjZNIYq.js";
import { I as ImageOff } from "./media-CA5B9HTw.js";
import "./arrow-right-Q9k8vsF3.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["polyline", { points: "12 6 12 12 16 14", key: "68esgv" }]
];
const Clock = createLucideIcon("clock", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "m14.5 12.5-8 8a2.119 2.119 0 1 1-3-3l8-8", key: "15492f" }],
  ["path", { d: "m16 16 6-6", key: "vzrcl6" }],
  ["path", { d: "m8 8 6-6", key: "18bi4p" }],
  ["path", { d: "m9 7 8 8", key: "5jnvq1" }],
  ["path", { d: "m21 11-8-8", key: "z4y7zo" }]
];
const Gavel = createLucideIcon("gavel", __iconNode$1);
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
var ENTRY_FOCUS = "rovingFocusGroup.onEntryFocus";
var EVENT_OPTIONS = { bubbles: false, cancelable: true };
var GROUP_NAME = "RovingFocusGroup";
var [Collection, useCollection, createCollectionScope] = createCollection(GROUP_NAME);
var [createRovingFocusGroupContext, createRovingFocusGroupScope] = createContextScope(
  GROUP_NAME,
  [createCollectionScope]
);
var [RovingFocusProvider, useRovingFocusContext] = createRovingFocusGroupContext(GROUP_NAME);
var RovingFocusGroup = reactExports.forwardRef(
  (props, forwardedRef) => {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Collection.Provider, { scope: props.__scopeRovingFocusGroup, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Collection.Slot, { scope: props.__scopeRovingFocusGroup, children: /* @__PURE__ */ jsxRuntimeExports.jsx(RovingFocusGroupImpl, { ...props, ref: forwardedRef }) }) });
  }
);
RovingFocusGroup.displayName = GROUP_NAME;
var RovingFocusGroupImpl = reactExports.forwardRef((props, forwardedRef) => {
  const {
    __scopeRovingFocusGroup,
    orientation,
    loop = false,
    dir,
    currentTabStopId: currentTabStopIdProp,
    defaultCurrentTabStopId,
    onCurrentTabStopIdChange,
    onEntryFocus,
    preventScrollOnEntryFocus = false,
    ...groupProps
  } = props;
  const ref = reactExports.useRef(null);
  const composedRefs = useComposedRefs(forwardedRef, ref);
  const direction = useDirection(dir);
  const [currentTabStopId, setCurrentTabStopId] = useControllableState({
    prop: currentTabStopIdProp,
    defaultProp: defaultCurrentTabStopId ?? null,
    onChange: onCurrentTabStopIdChange,
    caller: GROUP_NAME
  });
  const [isTabbingBackOut, setIsTabbingBackOut] = reactExports.useState(false);
  const handleEntryFocus = useCallbackRef(onEntryFocus);
  const getItems = useCollection(__scopeRovingFocusGroup);
  const isClickFocusRef = reactExports.useRef(false);
  const [focusableItemsCount, setFocusableItemsCount] = reactExports.useState(0);
  reactExports.useEffect(() => {
    const node = ref.current;
    if (node) {
      node.addEventListener(ENTRY_FOCUS, handleEntryFocus);
      return () => node.removeEventListener(ENTRY_FOCUS, handleEntryFocus);
    }
  }, [handleEntryFocus]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    RovingFocusProvider,
    {
      scope: __scopeRovingFocusGroup,
      orientation,
      dir: direction,
      loop,
      currentTabStopId,
      onItemFocus: reactExports.useCallback(
        (tabStopId) => setCurrentTabStopId(tabStopId),
        [setCurrentTabStopId]
      ),
      onItemShiftTab: reactExports.useCallback(() => setIsTabbingBackOut(true), []),
      onFocusableItemAdd: reactExports.useCallback(
        () => setFocusableItemsCount((prevCount) => prevCount + 1),
        []
      ),
      onFocusableItemRemove: reactExports.useCallback(
        () => setFocusableItemsCount((prevCount) => prevCount - 1),
        []
      ),
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Primitive.div,
        {
          tabIndex: isTabbingBackOut || focusableItemsCount === 0 ? -1 : 0,
          "data-orientation": orientation,
          ...groupProps,
          ref: composedRefs,
          style: { outline: "none", ...props.style },
          onMouseDown: composeEventHandlers(props.onMouseDown, () => {
            isClickFocusRef.current = true;
          }),
          onFocus: composeEventHandlers(props.onFocus, (event) => {
            const isKeyboardFocus = !isClickFocusRef.current;
            if (event.target === event.currentTarget && isKeyboardFocus && !isTabbingBackOut) {
              const entryFocusEvent = new CustomEvent(ENTRY_FOCUS, EVENT_OPTIONS);
              event.currentTarget.dispatchEvent(entryFocusEvent);
              if (!entryFocusEvent.defaultPrevented) {
                const items = getItems().filter((item) => item.focusable);
                const activeItem = items.find((item) => item.active);
                const currentItem = items.find((item) => item.id === currentTabStopId);
                const candidateItems = [activeItem, currentItem, ...items].filter(
                  Boolean
                );
                const candidateNodes = candidateItems.map((item) => item.ref.current);
                focusFirst(candidateNodes, preventScrollOnEntryFocus);
              }
            }
            isClickFocusRef.current = false;
          }),
          onBlur: composeEventHandlers(props.onBlur, () => setIsTabbingBackOut(false))
        }
      )
    }
  );
});
var ITEM_NAME = "RovingFocusGroupItem";
var RovingFocusGroupItem = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeRovingFocusGroup,
      focusable = true,
      active = false,
      tabStopId,
      children,
      ...itemProps
    } = props;
    const autoId = useId();
    const id = tabStopId || autoId;
    const context = useRovingFocusContext(ITEM_NAME, __scopeRovingFocusGroup);
    const isCurrentTabStop = context.currentTabStopId === id;
    const getItems = useCollection(__scopeRovingFocusGroup);
    const { onFocusableItemAdd, onFocusableItemRemove, currentTabStopId } = context;
    reactExports.useEffect(() => {
      if (focusable) {
        onFocusableItemAdd();
        return () => onFocusableItemRemove();
      }
    }, [focusable, onFocusableItemAdd, onFocusableItemRemove]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Collection.ItemSlot,
      {
        scope: __scopeRovingFocusGroup,
        id,
        focusable,
        active,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.span,
          {
            tabIndex: isCurrentTabStop ? 0 : -1,
            "data-orientation": context.orientation,
            ...itemProps,
            ref: forwardedRef,
            onMouseDown: composeEventHandlers(props.onMouseDown, (event) => {
              if (!focusable) event.preventDefault();
              else context.onItemFocus(id);
            }),
            onFocus: composeEventHandlers(props.onFocus, () => context.onItemFocus(id)),
            onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
              if (event.key === "Tab" && event.shiftKey) {
                context.onItemShiftTab();
                return;
              }
              if (event.target !== event.currentTarget) return;
              const focusIntent = getFocusIntent(event, context.orientation, context.dir);
              if (focusIntent !== void 0) {
                if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
                event.preventDefault();
                const items = getItems().filter((item) => item.focusable);
                let candidateNodes = items.map((item) => item.ref.current);
                if (focusIntent === "last") candidateNodes.reverse();
                else if (focusIntent === "prev" || focusIntent === "next") {
                  if (focusIntent === "prev") candidateNodes.reverse();
                  const currentIndex = candidateNodes.indexOf(event.currentTarget);
                  candidateNodes = context.loop ? wrapArray(candidateNodes, currentIndex + 1) : candidateNodes.slice(currentIndex + 1);
                }
                setTimeout(() => focusFirst(candidateNodes));
              }
            }),
            children: typeof children === "function" ? children({ isCurrentTabStop, hasTabStop: currentTabStopId != null }) : children
          }
        )
      }
    );
  }
);
RovingFocusGroupItem.displayName = ITEM_NAME;
var MAP_KEY_TO_FOCUS_INTENT = {
  ArrowLeft: "prev",
  ArrowUp: "prev",
  ArrowRight: "next",
  ArrowDown: "next",
  PageUp: "first",
  Home: "first",
  PageDown: "last",
  End: "last"
};
function getDirectionAwareKey(key, dir) {
  if (dir !== "rtl") return key;
  return key === "ArrowLeft" ? "ArrowRight" : key === "ArrowRight" ? "ArrowLeft" : key;
}
function getFocusIntent(event, orientation, dir) {
  const key = getDirectionAwareKey(event.key, dir);
  if (orientation === "vertical" && ["ArrowLeft", "ArrowRight"].includes(key)) return void 0;
  if (orientation === "horizontal" && ["ArrowUp", "ArrowDown"].includes(key)) return void 0;
  return MAP_KEY_TO_FOCUS_INTENT[key];
}
function focusFirst(candidates, preventScroll = false) {
  const PREVIOUSLY_FOCUSED_ELEMENT = document.activeElement;
  for (const candidate of candidates) {
    if (candidate === PREVIOUSLY_FOCUSED_ELEMENT) return;
    candidate.focus({ preventScroll });
    if (document.activeElement !== PREVIOUSLY_FOCUSED_ELEMENT) return;
  }
}
function wrapArray(array, startIndex) {
  return array.map((_, index) => array[(startIndex + index) % array.length]);
}
var Root = RovingFocusGroup;
var Item = RovingFocusGroupItem;
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
const MARKETPLACE_LISTING_PAGE_SIZE = 25n;
const MARKETPLACE_COLLECTION_PAGE_SIZE = 50n;
const MARKETPLACE_WALLET_PAGE_SIZE = 50n;
const MARKETPLACE_DIVIDEND_PAGE_SIZE = 50n;
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
      "data-ocid": `marketplace.fixed.item.${index + 1}`,
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
                "data-ocid": `marketplace.fixed.cancel_button.${index + 1}`,
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
                "data-ocid": `marketplace.fixed.buy_button.${index + 1}`,
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
      "data-ocid": `marketplace.auction.item.${index + 1}`,
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
                  "data-ocid": `marketplace.auction.settle_button.${index + 1}`,
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
                  "data-ocid": `marketplace.auction.cancel_button.${index + 1}`,
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
                    "data-ocid": `marketplace.auction.cancel_locked_button.${index + 1}`,
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
                "data-ocid": `marketplace.auction.collect_button.${index + 1}`,
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
                "data-ocid": `marketplace.auction.bid_button.${index + 1}`,
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
  const principalStr = (principal == null ? void 0 : principal.toString()) ?? null;
  const [activeTab, setActiveTab] = reactExports.useState("fixed");
  const [buyTarget, setBuyTarget] = reactExports.useState(null);
  const [cancelTarget, setCancelTarget] = reactExports.useState(null);
  const [bidTarget, setBidTarget] = reactExports.useState(null);
  const [listModalOpen, setListModalOpen] = reactExports.useState(false);
  const [detailTarget, setDetailTarget] = reactExports.useState(null);
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
    queryKey: [
      "activeListingDetails",
      "marketplace",
      MARKETPLACE_LISTING_PAGE_SIZE.toString()
    ],
    queryFn: async () => {
      if (!actor) return [];
      const page = await actor.getActiveListingDetailsPage(
        null,
        MARKETPLACE_LISTING_PAGE_SIZE
      );
      return page.details;
    },
    enabled: !!actor && !actorLoading,
    refetchInterval: 3e4
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
    staleTime: 6e4
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
    refetchInterval: 3e4
  });
  const collectionMap = new Map(
    collections.map((collection) => [collection.id, collection])
  );
  const importMetaMap = collectionMetaMap(collectionImportMetas);
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
        const page = await actor.refreshCollectionDividendBalancesPage(
          collectionId,
          null,
          MARKETPLACE_DIVIDEND_PAGE_SIZE
        );
        const balances = page.balances;
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
  const listingDividendMap = new Map(listingDividendBalances);
  const ledgerFeeE8s = (marketplaceFeeConfig == null ? void 0 : marketplaceFeeConfig.ledgerFeeE8s) ?? DEFAULT_ICP_LEDGER_FEE_E8S;
  const auctionBidFeeReserveE8s = (marketplaceFeeConfig == null ? void 0 : marketplaceFeeConfig.auctionBidFeeReserveE8s) ?? ledgerFeeE8s * 2n;
  const mintlabFeeBps = (marketplaceFeeConfig == null ? void 0 : marketplaceFeeConfig.mintlabFeeBasisPoints) ?? DEFAULT_MINTLAB_FEE_BPS;
  const fixedListings = listingDetails.flatMap(
    (detail) => detail.listing.__kind__ === "Fixed" ? (() => {
      const collection = collectionMap.get(detail.nft.collectionId);
      return [
        {
          listing: detail.listing.Fixed,
          nft: detail.nft,
          collection,
          trustStatus: collection ? collectionTrustStatus(
            collection,
            importMetaMap.get(collection.id.toString())
          ) : null
        }
      ];
    })() : []
  );
  const buyListingDetail = buyTarget == null ? null : fixedListings.find(({ listing }) => listing.id === buyTarget) ?? null;
  const auctionListings = listingDetails.flatMap(
    (detail) => detail.listing.__kind__ === "Auction" ? (() => {
      const collection = collectionMap.get(detail.nft.collectionId);
      return [
        {
          listing: detail.listing.Auction,
          nft: detail.nft,
          collection,
          trustStatus: collection ? collectionTrustStatus(
            collection,
            importMetaMap.get(collection.id.toString())
          ) : null
        }
      ];
    })() : []
  );
  const isVerifiedListing = ({
    collection
  }) => collection != null && isMintlabVerifiedCollection(
    collection,
    importMetaMap.get(collection.id.toString())
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
    refetchInterval: 3e4
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
  function handleList(params) {
    if (params.type === "fixed") {
      createFixed({ nft: params.nft, price: params.price });
    } else {
      createAuction({
        nft: params.nft,
        startingBid: params.startingBid,
        endTime: params.endTime
      });
    }
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
        Tabs,
        {
          value: activeTab,
          onValueChange: (v) => setActiveTab(v),
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
                      value: "fixed",
                      className: "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-medium",
                      "data-ocid": "marketplace.tab.fixed",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "w-4 h-4 mr-2" }),
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
            /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "fixed", className: "mt-0", children: listingsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "flex items-center justify-center min-h-[40vh]",
                "data-ocid": "marketplace.fixed.loading_state",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, { size: "lg", label: "Loading listings…" })
              }
            ) : fixedListings.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
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
                    onDetails: () => setDetailTarget({
                      listing: { __kind__: "Fixed", Fixed: listing },
                      nft,
                      collection,
                      trustStatus,
                      dividendE8s: listingDividendMap.get(
                        nftKey(nft.collectionId, nft.tokenId)
                      ) ?? 0n
                    }),
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
                      onDetails: () => setDetailTarget({
                        listing: { __kind__: "Fixed", Fixed: listing },
                        nft,
                        collection,
                        trustStatus,
                        dividendE8s: listingDividendMap.get(
                          nftKey(nft.collectionId, nft.tokenId)
                        ) ?? 0n
                      }),
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
            ) : auctionListings.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
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
                    onDetails: () => setDetailTarget({
                      listing: {
                        __kind__: "Auction",
                        Auction: listing
                      },
                      nft,
                      collection,
                      trustStatus,
                      dividendE8s: listingDividendMap.get(
                        nftKey(nft.collectionId, nft.tokenId)
                      ) ?? 0n
                    }),
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
                      onDetails: () => setDetailTarget({
                        listing: {
                          __kind__: "Auction",
                          Auction: listing
                        },
                        nft,
                        collection,
                        trustStatus,
                        dividendE8s: listingDividendMap.get(
                          nftKey(nft.collectionId, nft.tokenId)
                        ) ?? 0n
                      }),
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
        onClose: () => setDetailTarget(null),
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
