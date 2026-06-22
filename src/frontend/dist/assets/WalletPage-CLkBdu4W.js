import { c as createLucideIcon, g as getNFTDisplayName, j as jsxRuntimeExports, m as motion, a as cn, r as reactExports, u as useControllableState, P as Primitive, b as useComposedRefs, d as composeEventHandlers, e as Presence, f as createContextScope, h as useAuth, i as useBackend, k as useAdmin, l as useQueryClient, n as useQuery, o as ue, W as Wallet, B as Button, L as LogIn, p as useNavigate, H as History, q as Link, T as TermsAgreementNotice, s as getNFTTokenLabel, t as Principal, v as getNFTDisplayTokenId, w as getNFTVisibleAttributes } from "./index-BFRZvZ95.js";
import { P as Plus, i as isLowCyclesError, A as AppCanisterTopUpDialog } from "./AppCanisterTopUpDialog-Ce2slhQt.js";
import { n as nftCustodyLabel, a as nftCustodyClass, C as CollectionBadge, W as WITHDRAW_TO_EXTERNAL_WALLET_LABEL, b as nftCustodyDescription } from "./nft-custody-_e6g_rjq.js";
import { D as DividendBalanceBadge, P as PaymentConfirmationDialog, F as Flag, T as Tag } from "./PaymentConfirmationDialog-4jZQO60d.js";
import { E as EmptyState } from "./EmptyState-8SoG_gw-.js";
import { H as HelpCallout, a as HelpTooltip } from "./HelpCallout-DdSo2GKb.js";
import { M as MediaImage } from "./MediaImage-hDJTnwTH.js";
import { B as Badge } from "./badge-BRjchVt_.js";
import { P as PriceDisplay, R as Root, I as Item, c as createRovingFocusGroupScope, t as transferRegisteredNFT } from "./external-nft-transfer-DhCJaI2h.js";
import { I as ImageOff, r as resolveImageUrl } from "./media-BsInJRYK.js";
import { c as collectionMetaMap, a as collectionTrustStatus, i as isMintlabVerifiedCollection, C as COMMUNITY_COLLECTION_NOTICE, Z as ZoomableMediaImage } from "./ZoomableMediaImage-BuRExo5X.js";
import { S as Skeleton, C as Card, a as CardHeader, b as CardTitle, c as CardContent } from "./skeleton-D7iuR1XU.js";
import { u as useInfiniteQuery, C as Collapsible, a as CollapsibleTrigger, b as CollapsibleContent, S as Sparkles, c as compressModerationImage } from "./imageUtils-CBUjZPUN.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription } from "./dialog-OsdL33AG.js";
import { I as Input } from "./input-OXv0my8g.js";
import { u as useMutation, L as Label } from "./label-Hi1Mm6AX.js";
import { u as useDirection, a as usePrevious, C as Check, b as ChevronDown, S as Select, c as SelectTrigger, d as SelectValue, e as SelectContent, f as SelectItem } from "./select-CmW97cE5.js";
import { u as useSize, R as RefreshCw } from "./index-INkohtkJ.js";
import { I as Info, T as Textarea } from "./textarea-DAIEFlSm.js";
import { L as Layers } from "./layers-EmoaY1KD.js";
import { A as ArrowUpRight, a as ArrowDownLeft } from "./arrow-up-right-B3hHyglp.js";
import { C as CircleCheck } from "./circle-check-Cx3PBWBH.js";
import { C as Coins } from "./coins-Cycp-jtH.js";
import { C as Copy } from "./copy-PEmDd5UN.js";
import { S as Send } from "./send-RbQkaKzs.js";
import { E as ExternalLink } from "./external-link-DcHCtcxB.js";
import "./icp-BXjZNIYq.js";
import "./arrow-right-DJ3k8dWA.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }]];
const Circle = createLucideIcon("circle", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M16 5h6", key: "1vod17" }],
  ["path", { d: "M19 2v6", key: "4bpg5p" }],
  ["path", { d: "M21 11.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7.5", key: "1ue2ih" }],
  ["path", { d: "m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21", key: "1xmnt7" }],
  ["circle", { cx: "9", cy: "9", r: "2", key: "af1f0g" }]
];
const ImagePlus = createLucideIcon("image-plus", __iconNode);
function NFTCard({
  nft,
  collection,
  listingPrice,
  dividendE8s,
  trustStatus,
  isAuction,
  isListed = false,
  onClick,
  index = 0,
  "data-ocid": dataOcid
}) {
  const name = getNFTDisplayName(nft, collection);
  const description = nft.metadata.description;
  const custodyLabel = nftCustodyLabel(nft.location);
  const custodyClass = nftCustodyClass(nft.location);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.35, delay: index * 0.07 },
      whileHover: { y: -4, scale: 1.01 },
      className: cn(
        "nft-card-glow group relative rounded-xl border border-border bg-card overflow-hidden cursor-pointer transition-smooth",
        "hover:nft-card-glow-hover hover:border-accent/40"
      ),
      onClick,
      "data-ocid": dataOcid,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "aspect-square overflow-hidden bg-muted relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            MediaImage,
            {
              src: nft.metadata.imageUrl,
              alt: name,
              assetCanisterId: collection == null ? void 0 : collection.canisterId.toString(),
              tokenId: nft.tokenId,
              className: "w-full h-full object-cover transition-smooth group-hover:scale-105",
              loading: "lazy",
              fallback: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ImageOff, { className: "w-10 h-10 text-muted-foreground/40" }) })
            }
          ),
          isAuction && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "absolute top-2 right-2 bg-accent/90 text-accent-foreground text-xs font-mono", children: "AUCTION" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-semibold text-sm text-foreground truncate", children: name }),
            description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground line-clamp-1 mt-0.5", children: description })
          ] }),
          collection && /* @__PURE__ */ jsxRuntimeExports.jsx(
            CollectionBadge,
            {
              collection,
              trustStatus,
              size: "sm"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1.5", children: [
            isListed && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "text-[10px] border bg-amber-500/10 text-amber-700 border-amber-500/20", children: "Listed" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Badge,
              {
                variant: "secondary",
                className: cn(
                  "max-w-full whitespace-normal break-words text-left text-[10px] leading-tight border",
                  custodyClass
                ),
                title: custodyLabel,
                children: custodyLabel
              }
            ),
            dividendE8s !== void 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(DividendBalanceBadge, { e8s: dividendE8s, compact: true })
          ] }),
          listingPrice !== void 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-1 border-t border-border/60", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            PriceDisplay,
            {
              e8s: listingPrice,
              size: "sm",
              label: isAuction ? "Current bid" : "Price"
            }
          ) })
        ] })
      ]
    }
  );
}
var RADIO_NAME = "Radio";
var [createRadioContext, createRadioScope] = createContextScope(RADIO_NAME);
var [RadioProvider, useRadioContext] = createRadioContext(RADIO_NAME);
var Radio = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeRadio,
      name,
      checked = false,
      required,
      disabled,
      value = "on",
      onCheck,
      form,
      ...radioProps
    } = props;
    const [button, setButton] = reactExports.useState(null);
    const composedRefs = useComposedRefs(forwardedRef, (node) => setButton(node));
    const hasConsumerStoppedPropagationRef = reactExports.useRef(false);
    const isFormControl = button ? form || !!button.closest("form") : true;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(RadioProvider, { scope: __scopeRadio, checked, disabled, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Primitive.button,
        {
          type: "button",
          role: "radio",
          "aria-checked": checked,
          "data-state": getState(checked),
          "data-disabled": disabled ? "" : void 0,
          disabled,
          value,
          ...radioProps,
          ref: composedRefs,
          onClick: composeEventHandlers(props.onClick, (event) => {
            if (!checked) onCheck == null ? void 0 : onCheck();
            if (isFormControl) {
              hasConsumerStoppedPropagationRef.current = event.isPropagationStopped();
              if (!hasConsumerStoppedPropagationRef.current) event.stopPropagation();
            }
          })
        }
      ),
      isFormControl && /* @__PURE__ */ jsxRuntimeExports.jsx(
        RadioBubbleInput,
        {
          control: button,
          bubbles: !hasConsumerStoppedPropagationRef.current,
          name,
          value,
          checked,
          required,
          disabled,
          form,
          style: { transform: "translateX(-100%)" }
        }
      )
    ] });
  }
);
Radio.displayName = RADIO_NAME;
var INDICATOR_NAME = "RadioIndicator";
var RadioIndicator = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeRadio, forceMount, ...indicatorProps } = props;
    const context = useRadioContext(INDICATOR_NAME, __scopeRadio);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || context.checked, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.span,
      {
        "data-state": getState(context.checked),
        "data-disabled": context.disabled ? "" : void 0,
        ...indicatorProps,
        ref: forwardedRef
      }
    ) });
  }
);
RadioIndicator.displayName = INDICATOR_NAME;
var BUBBLE_INPUT_NAME = "RadioBubbleInput";
var RadioBubbleInput = reactExports.forwardRef(
  ({
    __scopeRadio,
    control,
    checked,
    bubbles = true,
    ...props
  }, forwardedRef) => {
    const ref = reactExports.useRef(null);
    const composedRefs = useComposedRefs(ref, forwardedRef);
    const prevChecked = usePrevious(checked);
    const controlSize = useSize(control);
    reactExports.useEffect(() => {
      const input = ref.current;
      if (!input) return;
      const inputProto = window.HTMLInputElement.prototype;
      const descriptor = Object.getOwnPropertyDescriptor(
        inputProto,
        "checked"
      );
      const setChecked = descriptor.set;
      if (prevChecked !== checked && setChecked) {
        const event = new Event("click", { bubbles });
        setChecked.call(input, checked);
        input.dispatchEvent(event);
      }
    }, [prevChecked, checked, bubbles]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.input,
      {
        type: "radio",
        "aria-hidden": true,
        defaultChecked: checked,
        ...props,
        tabIndex: -1,
        ref: composedRefs,
        style: {
          ...props.style,
          ...controlSize,
          position: "absolute",
          pointerEvents: "none",
          opacity: 0,
          margin: 0
        }
      }
    );
  }
);
RadioBubbleInput.displayName = BUBBLE_INPUT_NAME;
function getState(checked) {
  return checked ? "checked" : "unchecked";
}
var ARROW_KEYS = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
var RADIO_GROUP_NAME = "RadioGroup";
var [createRadioGroupContext] = createContextScope(RADIO_GROUP_NAME, [
  createRovingFocusGroupScope,
  createRadioScope
]);
var useRovingFocusGroupScope = createRovingFocusGroupScope();
var useRadioScope = createRadioScope();
var [RadioGroupProvider, useRadioGroupContext] = createRadioGroupContext(RADIO_GROUP_NAME);
var RadioGroup$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeRadioGroup,
      name,
      defaultValue,
      value: valueProp,
      required = false,
      disabled = false,
      orientation,
      dir,
      loop = true,
      onValueChange,
      ...groupProps
    } = props;
    const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeRadioGroup);
    const direction = useDirection(dir);
    const [value, setValue] = useControllableState({
      prop: valueProp,
      defaultProp: defaultValue ?? null,
      onChange: onValueChange,
      caller: RADIO_GROUP_NAME
    });
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      RadioGroupProvider,
      {
        scope: __scopeRadioGroup,
        name,
        required,
        disabled,
        value,
        onValueChange: setValue,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Root,
          {
            asChild: true,
            ...rovingFocusGroupScope,
            orientation,
            dir: direction,
            loop,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Primitive.div,
              {
                role: "radiogroup",
                "aria-required": required,
                "aria-orientation": orientation,
                "data-disabled": disabled ? "" : void 0,
                dir: direction,
                ...groupProps,
                ref: forwardedRef
              }
            )
          }
        )
      }
    );
  }
);
RadioGroup$1.displayName = RADIO_GROUP_NAME;
var ITEM_NAME = "RadioGroupItem";
var RadioGroupItem$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeRadioGroup, disabled, ...itemProps } = props;
    const context = useRadioGroupContext(ITEM_NAME, __scopeRadioGroup);
    const isDisabled = context.disabled || disabled;
    const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeRadioGroup);
    const radioScope = useRadioScope(__scopeRadioGroup);
    const ref = reactExports.useRef(null);
    const composedRefs = useComposedRefs(forwardedRef, ref);
    const checked = context.value === itemProps.value;
    const isArrowKeyPressedRef = reactExports.useRef(false);
    reactExports.useEffect(() => {
      const handleKeyDown = (event) => {
        if (ARROW_KEYS.includes(event.key)) {
          isArrowKeyPressedRef.current = true;
        }
      };
      const handleKeyUp = () => isArrowKeyPressedRef.current = false;
      document.addEventListener("keydown", handleKeyDown);
      document.addEventListener("keyup", handleKeyUp);
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
        document.removeEventListener("keyup", handleKeyUp);
      };
    }, []);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Item,
      {
        asChild: true,
        ...rovingFocusGroupScope,
        focusable: !isDisabled,
        active: checked,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Radio,
          {
            disabled: isDisabled,
            required: context.required,
            checked,
            ...radioScope,
            ...itemProps,
            name: context.name,
            ref: composedRefs,
            onCheck: () => context.onValueChange(itemProps.value),
            onKeyDown: composeEventHandlers((event) => {
              if (event.key === "Enter") event.preventDefault();
            }),
            onFocus: composeEventHandlers(itemProps.onFocus, () => {
              var _a;
              if (isArrowKeyPressedRef.current) (_a = ref.current) == null ? void 0 : _a.click();
            })
          }
        )
      }
    );
  }
);
RadioGroupItem$1.displayName = ITEM_NAME;
var INDICATOR_NAME2 = "RadioGroupIndicator";
var RadioGroupIndicator = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeRadioGroup, ...indicatorProps } = props;
    const radioScope = useRadioScope(__scopeRadioGroup);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(RadioIndicator, { ...radioScope, ...indicatorProps, ref: forwardedRef });
  }
);
RadioGroupIndicator.displayName = INDICATOR_NAME2;
var Root2 = RadioGroup$1;
var Item2 = RadioGroupItem$1;
var Indicator = RadioGroupIndicator;
function RadioGroup({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Root2,
    {
      "data-slot": "radio-group",
      className: cn("grid gap-3", className),
      ...props
    }
  );
}
function RadioGroupItem({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Item2,
    {
      "data-slot": "radio-group-item",
      className: cn(
        "border-input text-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 aspect-square size-4 shrink-0 rounded-full border shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Indicator,
        {
          "data-slot": "radio-group-indicator",
          className: "relative flex items-center justify-center",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Circle, { className: "fill-primary absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2" })
        }
      )
    }
  );
}
const MAX_ON_CHAIN_IMAGE_CHARS = 19e5;
const MODERATION_IMAGE_ACCEPT = "image/png,image/jpeg";
function accountIdToHex(bytes) {
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
}
function truncate(s, head = 6, tail = 4) {
  if (s.length <= head + tail + 3) return s;
  return `${s.slice(0, head)}...${s.slice(-tail)}`;
}
function extractError(err) {
  if (err === null || err === void 0) return "An unexpected error occurred";
  if (typeof err === "string") return err || "An unexpected error occurred";
  if (err instanceof Error)
    return err.message || "An unexpected error occurred";
  if (typeof err === "object") {
    const obj = err;
    if (typeof obj.message === "string") return obj.message;
    try {
      return JSON.stringify(obj) || "An unexpected error occurred";
    } catch {
      return "An unexpected error occurred";
    }
  }
  return String(err) || "An unexpected error occurred";
}
function isSupportedModerationImageFile(file) {
  return file.type === "image/png" || file.type === "image/jpeg" || /\.(png|jpe?g)$/i.test(file.name);
}
const E8S = 100000000n;
const ICP_LEDGER_FEE_E8S = 10000n;
const SYNC_TIMEOUT_MS = 45e3;
const SYNC_STILL_RUNNING_MESSAGE = "Wallet sync is still checking imported collections. New NFTs found during sync will appear here shortly.";
const SYNC_PAGE_TIMEOUT_MESSAGE = "This sync page is taking longer than expected. Mintlab saved progress and will continue on the next Sync.";
const SYNC_PAGE_COLLECTION_LIMIT = 2n;
const TARGET_SYNC_INDEX_PAGE_LIMIT = 3n;
const MAX_SYNC_PAGES_PER_CLICK = 5;
const SYNC_SLOW_NOTICE_MS = 15e3;
const SYNC_REFRESH_INTERVAL_MS = 6e3;
const SYNC_FINISHED_STATUS_CLEAR_MS = 6e3;
const WALLET_NFT_PAGE_SIZE = 50n;
const WALLET_COLLECTION_PAGE_SIZE = 50n;
const WALLET_LISTING_PAGE_SIZE = 25n;
const WALLET_DIVIDEND_PAGE_SIZE = 25n;
function formatICP(e8s) {
  const whole = e8s / E8S;
  const frac = (e8s % E8S).toString().padStart(8, "0").replace(/0+$/, "");
  return frac ? `${whole}.${frac}` : whole.toString();
}
function formatTransactionTime(timestampNanos) {
  const date = new Date(Number(timestampNanos / 1000000n));
  return new Intl.DateTimeFormat(void 0, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(date);
}
function nftTransactionIcon(tx) {
  if (tx.direction === "In") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDownLeft, { className: "h-4 w-4 text-emerald-500" });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { className: "h-4 w-4 text-amber-500" });
}
function nftTransactionLabel(tx) {
  if (tx.amountE8s !== null) {
    const prefix = tx.direction === "In" ? "+" : tx.direction === "Out" ? "-" : "";
    return `${prefix}${formatICP(tx.amountE8s)} ICP`;
  }
  if (tx.direction === "In") return "Received";
  if (tx.direction === "Out") return "Sent";
  return "Updated";
}
function pendingMintStatusLabel(status) {
  if (status === "PaymentPending") return "Payment pending";
  if (status === "PaymentSent") return "Mint retry ready";
  if (status === "Minted") return "Minted";
  return "Needs review";
}
function buildLoadedNFTStats(nfts, totalCount) {
  const counts = /* @__PURE__ */ new Map();
  for (const nft of nfts) {
    counts.set(nft.collectionId, (counts.get(nft.collectionId) ?? 0n) + 1n);
  }
  return {
    totalCount,
    perCollection: Array.from(counts.entries())
  };
}
function parseAttributeLines(value) {
  const seen = /* @__PURE__ */ new Set();
  const attributes = [];
  for (const rawLine of value.split("\n")) {
    const line = rawLine.trim();
    if (!line) continue;
    const separator = line.indexOf(":") === -1 ? line.indexOf("=") : line.indexOf(":");
    if (separator === -1) {
      throw new Error("Attributes must use Trait: Value, one per line");
    }
    const key = line.slice(0, separator).trim();
    const attrValue = line.slice(separator + 1).trim();
    if (!key || !attrValue) {
      throw new Error("Each attribute needs both a trait name and value");
    }
    const uniqueKey = `${key.toLowerCase()}::${attrValue.toLowerCase()}`;
    if (!seen.has(uniqueKey)) {
      seen.add(uniqueKey);
      attributes.push([key, attrValue]);
    }
  }
  return attributes;
}
function nftKey(collectionId, tokenId) {
  return `${collectionId.toString()}:${tokenId}`;
}
function withTimeout(promise, timeoutMs, message) {
  return new Promise((resolve, reject) => {
    const timeout = window.setTimeout(
      () => reject(new Error(message)),
      timeoutMs
    );
    promise.then(resolve, reject).finally(() => window.clearTimeout(timeout));
  });
}
function summarizeSyncErrors(errors) {
  const uniqueErrors = Array.from(
    new Set(errors.map((error) => error.trim()).filter(Boolean))
  );
  if (uniqueErrors.length === 0) {
    return "Some collections could not be checked.";
  }
  if (uniqueErrors.length === 1) {
    return uniqueErrors[0];
  }
  return `${uniqueErrors.length} collections could not be checked. First issue: ${uniqueErrors[0]}`;
}
function summarizeSyncSkipped(skipped) {
  if (skipped.length === 0) {
    return "";
  }
  const indexing = skipped.filter(isAutoIndexingSkip);
  const needsSetup = skipped.filter((skip) => !isAutoIndexingSkip(skip));
  if (needsSetup.length === 0) {
    return indexing.length === 1 ? `${indexing[0].collectionName} is still indexing automatically.` : `${indexing.length} imported collections are still indexing automatically.`;
  }
  if (needsSetup.length === 1) {
    return `${needsSetup[0].collectionName} needs one more check. Select it in the sync menu and click Sync selected, or import the token ID directly.`;
  }
  return `${needsSetup.length} imported collections need one more check. Select a collection in the sync menu and click Sync selected, or import a token ID directly.`;
}
function summarizeSyncAttention(errors, skipped) {
  if (errors.length > 0) {
    return summarizeSyncErrors(errors);
  }
  return summarizeSyncSkipped(skipped);
}
function isAutoIndexingSkip(skip) {
  return skip.reason === "INDEXING_IN_PROGRESS";
}
function selectedSyncProgressMessage(progress, collection) {
  var _a, _b;
  const checkedDirectHint = progress.directHintChecked && progress.scannedThisRun === 0n && progress.indexedThisRun === 0n && progress.nextCursor === null;
  if (checkedDirectHint && progress.errors.length > 0) {
    return "Selected sync checked the token ID directly and could not verify it in the expected wallet account.";
  }
  if (checkedDirectHint && progress.newCount > 0n) {
    return "Selected sync verified the token ID directly and registered it.";
  }
  if (checkedDirectHint) {
    return "Selected sync checked the token ID directly. The wider collection index is still not complete.";
  }
  const scannedTotal = ((_a = progress.status) == null ? void 0 : _a.scanned) ?? progress.scannedThisRun;
  const totalSupply = ((_b = collection == null ? void 0 : collection.browseInfo) == null ? void 0 : _b.totalSupply) ?? null;
  const isExtRegistryCheck = (collection == null ? void 0 : collection.standard.__kind__) === "EXT" && totalSupply == null;
  const scope = totalSupply != null ? `${scannedTotal.toString()} of ${totalSupply.toString()} tokens` : isExtRegistryCheck ? `${scannedTotal.toString()} registry entries` : `${scannedTotal.toString()} token positions`;
  if (progress.complete) {
    return isExtRegistryCheck ? `Selected sync checked ${scope} from this EXT collection and finished.` : `Selected sync checked ${scope} and finished this collection.`;
  }
  return `Selected sync checked ${scope}. Continue Sync selected to keep checking this collection, or enter a known token ID to verify it directly.`;
}
function nftStandardLabel(collection) {
  if (!collection) return "Collection";
  const standard = collection.standard;
  if (standard.__kind__ === "Other") return standard.Other;
  return standard.__kind__;
}
function receiveInstructionUsesAccountId(instructions) {
  return instructions.standard.__kind__ === "EXT" || instructions.accountKind.toLowerCase().includes("account");
}
function receiveInstructionValue(instructions) {
  return receiveInstructionUsesAccountId(instructions) ? accountIdToHex(instructions.accountId) : instructions.principal.toString();
}
function receiveInstructionLabel(collection, instructions) {
  const destinationLabel = receiveInstructionUsesAccountId(instructions) ? "Account ID" : "Principal ID";
  return `${nftStandardLabel(collection)} receive ${destinationLabel}`;
}
function readinessStatusLabel(readiness, collection) {
  var _a, _b, _c;
  if (!readiness) {
    if ((collection == null ? void 0 : collection.kind) === "External" && ((_a = collection.browseInfo) == null ? void 0 : _a.totalSupply) == null) {
      return "Needs safe indexing setup";
    }
    return "Ready";
  }
  if (!readiness.allowsSync) return "Sync disabled";
  if ((_b = readiness.indexStatus) == null ? void 0 : _b.complete) return "Indexed";
  if ((((_c = readiness.indexStatus) == null ? void 0 : _c.scanned) ?? 0n) > 0n) {
    return "Indexing in progress";
  }
  if (!readiness.hasBrowseInfo && (collection == null ? void 0 : collection.standard.__kind__) !== "ICRC7") {
    return "Needs safe indexing setup";
  }
  return "Ready for selected sync";
}
function isSyncAlreadyRunningMessage(message) {
  return message.toLowerCase().includes("wallet sync is already running");
}
function isAgentProcessingTimeoutMessage(message) {
  return message.includes("Request timed out") && message.includes("Request status: processing");
}
function CopyField({ label, value, ocid }) {
  const [copied, setCopied] = reactExports.useState(false);
  function handleCopy() {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
      ue.success(`${label} copied`);
    });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-muted-foreground uppercase tracking-wider", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 bg-muted/40 border border-border rounded-lg px-3 py-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-sm text-foreground truncate flex-1 min-w-0", children: value }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          size: "icon",
          variant: "ghost",
          className: "shrink-0 w-7 h-7 text-muted-foreground hover:text-foreground",
          onClick: handleCopy,
          "aria-label": `Copy ${label}`,
          "data-ocid": ocid,
          children: copied ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-3.5 h-3.5 text-accent" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "w-3.5 h-3.5" })
        }
      )
    ] })
  ] });
}
function RecentNFTTransactionRow({ tx }) {
  const label = nftTransactionLabel(tx);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-w-0 items-center gap-3 overflow-hidden py-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border/60 bg-muted/40", children: nftTransactionIcon(tx) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1 overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-w-0 max-w-full items-center gap-2 overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "min-w-0 truncate text-sm font-medium text-foreground", children: tx.title }),
        tx.status !== "Completed" && /* @__PURE__ */ jsxRuntimeExports.jsx(
          Badge,
          {
            variant: "outline",
            className: "shrink-0 px-1.5 py-0 text-[10px]",
            children: tx.status
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "p",
        {
          className: "min-w-0 max-w-full truncate text-xs text-muted-foreground",
          title: tx.detail,
          children: tx.detail
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 truncate text-[11px] text-muted-foreground", children: formatTransactionTime(tx.occurredAt) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Badge,
      {
        variant: "secondary",
        className: "max-w-[112px] shrink-0 overflow-hidden truncate font-mono text-[10px]",
        title: label,
        children: label
      }
    )
  ] });
}
function RecentNFTTransactionsCard({
  transactions,
  isLoading,
  open,
  onOpenChange
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Collapsible,
    {
      open,
      onOpenChange,
      "data-ocid": "wallet.recent_nft_transactions_collapsible",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Card,
        {
          className: "min-w-0 overflow-hidden border-border/50 bg-card shadow-sm",
          "data-ocid": "wallet.recent_nft_transactions_card",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "min-w-0 pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex min-w-0 flex-col gap-3 text-sm font-medium sm:flex-row sm:items-center sm:justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex min-w-0 items-center gap-2 text-muted-foreground uppercase tracking-wider", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(History, { className: "h-4 w-4 shrink-0 text-accent" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: "NFT Activity" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex shrink-0 items-center gap-2", children: [
                transactions.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "font-mono text-[10px]", children: [
                  transactions.length,
                  "/10"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "button",
                    variant: "ghost",
                    size: "sm",
                    className: "h-8 gap-1.5 text-xs text-accent",
                    asChild: true,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Link,
                      {
                        to: "/activity",
                        search: { scope: "nft" },
                        "data-ocid": "wallet.view_all_activity.link",
                        children: "View all"
                      }
                    )
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(CollapsibleTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    type: "button",
                    variant: "outline",
                    size: "sm",
                    className: "gap-1.5",
                    "aria-controls": "wallet-nft-activity-content",
                    "data-ocid": "wallet.nft_activity.toggle_button",
                    children: [
                      open ? "Hide Activity" : "Show Activity",
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        ChevronDown,
                        {
                          className: `h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`
                        }
                      )
                    ]
                  }
                ) })
              ] })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CollapsibleContent, { id: "wallet-nft-activity-content", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "min-w-0 overflow-hidden", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "grid min-w-0 gap-0 overflow-hidden md:grid-cols-2 md:gap-x-6",
                "data-ocid": "wallet.nft_transactions_loading_state",
                children: [0, 1, 2, 3].map((row) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: row > 1 ? "hidden min-w-0 overflow-hidden md:block" : "min-w-0 overflow-hidden",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-w-0 items-center gap-3 overflow-hidden py-3", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-9 w-9 rounded-md" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1 space-y-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-32" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-56 max-w-full" })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-16 shrink-0 rounded-full" })
                    ] })
                  },
                  row
                ))
              }
            ) : transactions.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex flex-col items-center gap-2 py-6 text-center text-sm text-muted-foreground",
                "data-ocid": "wallet.nft_transactions_empty_state",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(History, { className: "h-5 w-5" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "No NFT activity yet." })
                ]
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "grid min-w-0 gap-0 overflow-hidden md:grid-cols-2 md:gap-x-6",
                "data-ocid": "wallet.nft_transactions_list",
                children: transactions.map((tx, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: index === 0 ? "min-w-0 overflow-hidden" : index === 1 ? "min-w-0 overflow-hidden border-t border-border/50 md:border-t-0" : "min-w-0 overflow-hidden border-t border-border/50",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(RecentNFTTransactionRow, { tx })
                  },
                  tx.id.toString()
                ))
              }
            ) }) })
          ]
        }
      )
    }
  );
}
function SendNFTModal({ open, onClose, nft, collection }) {
  const { actor } = useBackend();
  const { principal } = useAuth();
  const queryClient = useQueryClient();
  const [recipient, setRecipient] = reactExports.useState("");
  const [recipientError, setRecipientError] = reactExports.useState("");
  const nftName = getNFTDisplayName(nft, collection);
  const isRegisteredExternal = nft.location === "Registered";
  const isVaultedExternal = nft.location === "Vaulted";
  const actionLabel = isVaultedExternal ? WITHDRAW_TO_EXTERNAL_WALLET_LABEL : "Send NFT";
  function validateRecipient(value) {
    if (!value.trim()) return "Recipient Principal ID is required";
    try {
      Principal.fromText(value.trim());
      return "";
    } catch {
      return "Invalid Principal ID format (e.g. aaaaa-aa or rrkah-fqaaa-aaaaa-aaaaq-cai)";
    }
  }
  const mutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const err = validateRecipient(recipient);
      if (err) throw new Error(err);
      const recipientPrincipal = Principal.fromText(recipient.trim());
      if (isRegisteredExternal) {
        if (!collection) {
          throw new Error(
            "Collection information is required for this transfer"
          );
        }
        if (!principal) {
          throw new Error("You must be authenticated to do this.");
        }
        const message = await transferRegisteredNFT({
          agent: actor.getAgent(),
          collection,
          nft,
          owner: principal,
          recipient: recipientPrincipal
        });
        try {
          const recipientSync = await withTimeout(
            actor.syncExternalNFTOwner(
              collection.id,
              nft.tokenId,
              recipientPrincipal
            ),
            SYNC_TIMEOUT_MS,
            "The transfer succeeded, but recipient wallet indexing timed out. The recipient can still press Sync or import the token ID."
          );
          if (recipientSync.__kind__ === "err") {
            console.warn(
              "[sendNFT] recipient wallet sync failed:",
              recipientSync.err
            );
          }
        } catch (syncError) {
          console.warn("[sendNFT] recipient wallet sync failed:", syncError);
        }
        return message;
      }
      const result = await actor.sendNFT(nft.id, recipientPrincipal);
      if (result.__kind__ === "err") {
        throw new Error(result.err);
      }
      return result.ok;
    },
    onSuccess: (txId) => {
      ue.success(
        isVaultedExternal ? "NFT withdrawn to external wallet" : txId || "NFT sent successfully"
      );
      const principalKey = principal == null ? void 0 : principal.toString();
      if (principalKey) {
        queryClient.setQueryData(
          ["userNFTs", principalKey],
          (current) => (current == null ? void 0 : current.filter(
            (item) => item.collectionId !== nft.collectionId || item.tokenId !== nft.tokenId
          )) ?? current
        );
      }
      queryClient.invalidateQueries({ queryKey: ["userNFTs"] });
      queryClient.invalidateQueries({ queryKey: ["userStats"] });
      queryClient.invalidateQueries({ queryKey: ["recent-nft-transactions"] });
      setRecipient("");
      setRecipientError("");
      onClose();
    },
    onError: (err) => {
      ue.error(extractError(err));
    }
  });
  function handleSend() {
    const err = validateRecipient(recipient);
    if (err) {
      setRecipientError(err);
      return;
    }
    setRecipientError("");
    mutation.mutate();
  }
  function handleClose() {
    if (mutation.isPending) return;
    setRecipient("");
    setRecipientError("");
    onClose();
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (v) => !v && handleClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: "bg-card border-border max-w-md",
      "data-ocid": "send-nft.dialog",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "font-display text-foreground flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "w-4 h-4 text-accent" }),
          actionLabel
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 pt-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 p-3 bg-muted/30 rounded-xl border border-border", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 rounded-lg overflow-hidden bg-muted shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              MediaImage,
              {
                src: nft.metadata.imageUrl,
                alt: nftName,
                assetCanisterId: collection == null ? void 0 : collection.canisterId.toString(),
                tokenId: nft.tokenId,
                className: "w-full h-full object-cover",
                fallback: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-6 h-6 text-muted-foreground/40" }) })
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-semibold text-sm text-foreground truncate", children: nftName }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-mono mt-0.5", children: getNFTTokenLabel(nft, collection) }),
              collection && /* @__PURE__ */ jsxRuntimeExports.jsx(
                CollectionBadge,
                {
                  collection,
                  size: "sm",
                  className: "mt-1"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: "secondary",
                  className: `mt-1 w-fit border text-[10px] ${nftCustodyClass(nft.location)}`,
                  children: nftCustodyLabel(nft.location)
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 p-3 bg-destructive/5 border border-destructive/20 rounded-lg", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "w-4 h-4 text-destructive shrink-0 mt-0.5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-destructive leading-relaxed", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "This action cannot be undone." }),
              " ",
              isRegisteredExternal ? "This NFT will be sent directly from your connected wallet on the original collection canister." : isVaultedExternal ? "This vaulted NFT is held by the Mintlab vault. Withdrawing transfers the original NFT from Mintlab custody to the recipient principal on the external collection canister." : "The Mintlab-created NFT will be permanently transferred to the recipient's wallet.",
              " ",
              "Double-check the Principal ID before sending."
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Label,
              {
                htmlFor: "recipient-principal",
                className: "text-sm text-foreground",
                children: [
                  "Recipient Principal ID ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "recipient-principal",
                placeholder: "e.g. rrkah-fqaaa-aaaaa-aaaaq-cai",
                value: recipient,
                onChange: (e) => {
                  setRecipient(e.target.value);
                  if (recipientError)
                    setRecipientError(validateRecipient(e.target.value));
                },
                onBlur: () => setRecipientError(validateRecipient(recipient)),
                className: "bg-muted/30 border-border focus:border-accent font-mono text-sm",
                "data-ocid": "send-nft.recipient.input",
                disabled: mutation.isPending
              }
            ),
            recipientError && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "text-xs text-destructive",
                "data-ocid": "send-nft.recipient.field_error",
                children: recipientError
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
              "The recipient must have a Principal ID (not an Account ID).",
              isVaultedExternal ? " Withdrawals from Mintlab custody are sent to that external wallet principal." : " NFT wallets on ICP use Principal IDs for NFT transfers."
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            TermsAgreementNotice,
            {
              actionLabel: isVaultedExternal ? "withdrawing this NFT" : "sending this NFT"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-2 pt-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "ghost",
                onClick: handleClose,
                disabled: mutation.isPending,
                "data-ocid": "send-nft.cancel_button",
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                onClick: handleSend,
                disabled: !recipient.trim() || mutation.isPending,
                className: "bg-accent text-accent-foreground hover:bg-accent/90 transition-smooth gap-2",
                "data-ocid": "send-nft.submit_button",
                children: mutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-3.5 h-3.5 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" }),
                  "Sending…"
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "w-3.5 h-3.5" }),
                  actionLabel
                ] })
              }
            )
          ] })
        ] })
      ]
    }
  ) });
}
function NFTDetailsModal({
  open,
  onClose,
  nft,
  collection,
  trustStatus,
  isListed = false,
  dividendE8s = 0n,
  onReport,
  onSend
}) {
  const nftName = getNFTDisplayName(nft, collection);
  const displayTokenId = getNFTDisplayTokenId(nft, collection);
  const visibleAttributes = getNFTVisibleAttributes(nft.metadata);
  const imageUrl = resolveImageUrl(nft.metadata.imageUrl, {
    canisterId: collection == null ? void 0 : collection.canisterId.toString(),
    tokenId: nft.tokenId
  });
  const canisterId = (collection == null ? void 0 : collection.canisterId.toString()) ?? "";
  const canisterUrl = canisterId ? `https://dashboard.internetcomputer.org/canister/${canisterId}` : null;
  const custodyLabel = nftCustodyLabel(nft.location);
  const custodyClass = nftCustodyClass(nft.location);
  const custodyDescription = nftCustodyDescription(nft, collection);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (value) => !value && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    DialogContent,
    {
      className: "bg-card border-border w-[calc(100vw-2rem)] max-w-3xl p-0 overflow-hidden max-h-[calc(100dvh-2rem)]",
      "data-ocid": "wallet.nft_details.dialog",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex max-h-[calc(100dvh-2rem)] min-h-0 flex-col md:grid md:grid-cols-[minmax(0,0.9fr)_minmax(320px,1fr)]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-muted h-[min(42vh,360px)] shrink-0 md:h-auto md:min-h-0 flex items-center justify-center p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          ZoomableMediaImage,
          {
            src: nft.metadata.imageUrl,
            alt: nftName,
            assetCanisterId: collection == null ? void 0 : collection.canisterId.toString(),
            tokenId: nft.tokenId,
            viewerTitle: nftName,
            buttonClassName: "h-full w-full rounded-lg",
            className: "max-h-full w-full h-full object-contain rounded-lg",
            dataOcid: "wallet.nft_details.image_zoom_button",
            fallback: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-12 h-12 text-muted-foreground/35" }) })
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-0 overflow-y-auto p-5 space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { className: "space-y-2 text-left", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
              isListed && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "border text-xs bg-amber-500/10 text-amber-700 border-amber-500/20", children: "Listed on Market" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: "secondary",
                  className: `border text-xs ${custodyClass}`,
                  children: custodyLabel
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
              /* @__PURE__ */ jsxRuntimeExports.jsx(DividendBalanceBadge, { e8s: dividendE8s, size: "md" }),
              onReport && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  type: "button",
                  size: "sm",
                  variant: "outline",
                  className: "h-7 gap-1.5 text-xs",
                  onClick: onReport,
                  "data-ocid": "wallet.nft_details.report_button",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Flag, { className: "h-3.5 w-3.5" }),
                    "Report"
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display text-xl text-foreground break-words", children: nftName }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground font-mono", children: getNFTTokenLabel(nft, collection) })
          ] }),
          nft.metadata.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground leading-relaxed break-words", children: nft.metadata.description }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 rounded-lg border border-border/60 bg-muted/25 p-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "mt-0.5 h-4 w-4 shrink-0 text-accent" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-foreground", children: custodyLabel }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs leading-relaxed text-muted-foreground", children: custodyDescription })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-3", children: [
            displayTokenId && /* @__PURE__ */ jsxRuntimeExports.jsx(
              CopyField,
              {
                label: "Display Token ID",
                value: displayTokenId,
                ocid: "wallet.nft_details.copy_display_token_id"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              CopyField,
              {
                label: displayTokenId ? "Canonical Token ID" : "Token ID",
                value: nft.tokenId,
                ocid: "wallet.nft_details.copy_token_id"
              }
            ),
            canisterId && /* @__PURE__ */ jsxRuntimeExports.jsx(
              CopyField,
              {
                label: "Collection Canister",
                value: canisterId,
                ocid: "wallet.nft_details.copy_canister_id"
              }
            ),
            imageUrl && /* @__PURE__ */ jsxRuntimeExports.jsx(
              CopyField,
              {
                label: "NFT Media URL",
                value: imageUrl,
                ocid: "wallet.nft_details.copy_media_url"
              }
            )
          ] }),
          visibleAttributes.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { className: "w-3 h-3" }),
              "Attributes"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-2", children: visibleAttributes.map(([key, value]) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "rounded-lg border border-border/50 bg-muted/35 px-3 py-2",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] uppercase tracking-wide text-muted-foreground truncate", children: key }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground truncate mt-0.5", children: value })
                ]
              },
              `wallet-detail-${key}-${value}`
            )) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap justify-end gap-2 pt-2", children: [
            canisterUrl && /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                asChild: true,
                variant: "outline",
                className: "gap-2",
                "data-ocid": "wallet.nft_details.view_canister_button",
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "a",
                  {
                    href: canisterUrl,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "w-3.5 h-3.5" }),
                      "View Canister"
                    ]
                  }
                )
              }
            ),
            onSend && !isListed && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                className: "gap-2",
                onClick: onSend,
                "data-ocid": "wallet.nft_details.send_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "w-3.5 h-3.5" }),
                  nft.location === "Vaulted" ? WITHDRAW_TO_EXTERNAL_WALLET_LABEL : "Send NFT"
                ]
              }
            )
          ] })
        ] })
      ] })
    }
  ) });
}
function RegisterNFTModal({
  open,
  onClose,
  collection
}) {
  const { actor } = useBackend();
  const { principal } = useAuth();
  const queryClient = useQueryClient();
  const [tokenId, setTokenId] = reactExports.useState("");
  const mutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      if (!tokenId.trim()) throw new Error("Token ID is required");
      if (collection.kind === "External") {
        if (!principal)
          throw new Error("You must be authenticated to do this.");
        const result2 = await actor.syncExternalNFTOwner(
          collection.id,
          tokenId.trim(),
          principal
        );
        if (result2.__kind__ === "err") {
          throw new Error(result2.err);
        }
        return result2.ok;
      }
      const result = await actor.registerNFT(collection.id, tokenId.trim(), {
        attributes: []
      });
      if (result.__kind__ === "err") {
        throw new Error(result.err);
      }
      return result.ok;
    },
    onSuccess: () => {
      ue.success("NFT registered successfully");
      queryClient.invalidateQueries({ queryKey: ["userNFTs"] });
      queryClient.invalidateQueries({ queryKey: ["userStats"] });
      setTokenId("");
      onClose();
    },
    onError: (err) => {
      ue.error(extractError(err));
    }
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (v) => !v && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: "bg-card border-border max-w-md",
      "data-ocid": "register-nft.dialog",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "font-display text-foreground flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-4 h-4 text-accent" }),
            "Register NFT"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CollectionBadge, { collection, size: "sm", className: "mt-1" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 pt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "tokenId", className: "text-sm text-foreground", children: [
              "Token ID ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "tokenId",
                placeholder: "e.g. 1234",
                value: tokenId,
                onChange: (e) => setTokenId(e.target.value),
                className: "bg-muted/30 border-border focus:border-accent",
                "data-ocid": "register-nft.token_id.input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-accent/20 bg-accent/5 p-3 text-xs text-muted-foreground", children: "The app verifies that you actually own this token on-chain before it imports it. Metadata is fetched from the collection automatically." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-2 pt-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "ghost",
                onClick: onClose,
                disabled: mutation.isPending,
                "data-ocid": "register-nft.cancel_button",
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                onClick: () => mutation.mutate(),
                disabled: !tokenId.trim() || mutation.isPending,
                className: "bg-accent text-accent-foreground hover:bg-accent/90 transition-smooth",
                "data-ocid": "register-nft.submit_button",
                children: mutation.isPending ? "Registering…" : "Register NFT"
              }
            )
          ] })
        ] })
      ]
    }
  ) });
}
function ImportSpecificNFTModal({
  open,
  onClose,
  collections,
  initialCollectionId = null,
  initialTokenId = null
}) {
  const { actor } = useBackend();
  const { principal } = useAuth();
  const queryClient = useQueryClient();
  const [collectionId, setCollectionId] = reactExports.useState("");
  const [tokenId, setTokenId] = reactExports.useState("");
  const externalCollections = reactExports.useMemo(
    () => collections.filter((collection) => collection.kind === "External"),
    [collections]
  );
  const selectedCollection = externalCollections.find(
    (collection) => collection.id.toString() === collectionId
  );
  reactExports.useEffect(() => {
    if (!open || initialCollectionId == null) return;
    const nextCollectionId = initialCollectionId.toString();
    if (externalCollections.some(
      (collection) => collection.id.toString() === nextCollectionId
    )) {
      setCollectionId(nextCollectionId);
    }
  }, [open, initialCollectionId, externalCollections]);
  reactExports.useEffect(() => {
    if (!open || initialTokenId == null) return;
    setTokenId(initialTokenId);
  }, [open, initialTokenId]);
  const mutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      if (!principal) throw new Error("You must be authenticated to do this.");
      if (!selectedCollection) throw new Error("Choose an external collection");
      if (!tokenId.trim()) throw new Error("Token ID is required");
      const result = await actor.syncExternalNFTOwner(
        selectedCollection.id,
        tokenId.trim(),
        principal
      );
      if (result.__kind__ === "err") {
        throw new Error(result.err);
      }
      return result.ok;
    },
    onSuccess: () => {
      ue.success("NFT imported successfully");
      queryClient.invalidateQueries({ queryKey: ["userNFTs"] });
      queryClient.invalidateQueries({ queryKey: ["userStats"] });
      setCollectionId("");
      setTokenId("");
      onClose();
    },
    onError: (err) => {
      ue.error(extractError(err));
    }
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (v) => !v && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: "bg-card border-border max-w-md",
      "data-ocid": "wallet.import_specific_nft.dialog",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "font-display text-foreground flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-4 h-4 text-accent" }),
          "Import NFT by Token ID"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 pt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Label,
              {
                htmlFor: "specificCollectionId",
                className: "text-sm text-foreground",
                children: [
                  "Collection ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: collectionId, onValueChange: setCollectionId, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                SelectTrigger,
                {
                  id: "specificCollectionId",
                  className: "w-full bg-muted/30 border-border focus:border-accent",
                  "data-ocid": "wallet.import_specific_nft.collection_select",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Choose a collection" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: externalCollections.map((collection) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                SelectItem,
                {
                  value: collection.id.toString(),
                  children: collection.name
                },
                collection.id.toString()
              )) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Label,
              {
                htmlFor: "specificTokenId",
                className: "text-sm text-foreground",
                children: [
                  "Token ID ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "specificTokenId",
                placeholder: "e.g. 1234",
                value: tokenId,
                onChange: (e) => setTokenId(e.target.value),
                className: "bg-muted/30 border-border focus:border-accent font-mono",
                "data-ocid": "wallet.import_specific_nft.token_id.input"
              }
            )
          ] }),
          externalCollections.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border border-border bg-muted/20 p-3 text-xs text-muted-foreground", children: "No external collections have been imported yet." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border border-accent/20 bg-accent/5 p-3 text-xs text-muted-foreground", children: "Mintlab verifies ownership on-chain before adding this NFT to your wallet." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-2 pt-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "ghost",
                onClick: onClose,
                disabled: mutation.isPending,
                "data-ocid": "wallet.import_specific_nft.cancel_button",
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                onClick: () => mutation.mutate(),
                disabled: !selectedCollection || !tokenId.trim() || mutation.isPending,
                className: "bg-accent text-accent-foreground hover:bg-accent/90 transition-smooth",
                "data-ocid": "wallet.import_specific_nft.submit_button",
                children: mutation.isPending ? "Importing…" : "Verify & Import"
              }
            )
          ] })
        ] })
      ]
    }
  ) });
}
function CollectionIndexingDialog({
  open,
  onClose,
  collection
}) {
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  const [cursor, setCursor] = reactExports.useState(null);
  const [lastPage, setLastPage] = reactExports.useState(
    null
  );
  const [isIndexing, setIsIndexing] = reactExports.useState(false);
  const { data: status, refetch } = useQuery({
    queryKey: ["collectionIndexStatus", collection == null ? void 0 : collection.id.toString()],
    queryFn: async () => {
      if (!actor || !collection) return null;
      return actor.getCollectionIndexStatus(collection.id);
    },
    enabled: open && !!actor && !!collection
  });
  reactExports.useEffect(() => {
    if (!open) {
      setCursor(null);
      setLastPage(null);
      setIsIndexing(false);
      return;
    }
    setCursor((status == null ? void 0 : status.cursor) ?? null);
  }, [open, status == null ? void 0 : status.cursor]);
  async function indexOnePage(nextCursor2) {
    if (!actor || !collection) throw new Error("No collection selected");
    const result = await actor.indexCollectionOwnershipPage(
      collection.id,
      nextCursor2,
      50n
    );
    if (result.__kind__ === "err") {
      throw new Error(result.err);
    }
    setLastPage(result.ok);
    setCursor(result.ok.nextCursor);
    await queryClient.invalidateQueries({ queryKey: ["userNFTs"] });
    await queryClient.invalidateQueries({ queryKey: ["userStats"] });
    await queryClient.invalidateQueries({
      queryKey: ["collectionIndexStatus", collection.id.toString()]
    });
    return result.ok;
  }
  async function handleIndexNextPage() {
    setIsIndexing(true);
    try {
      const page = await indexOnePage(cursor);
      await refetch();
      ue.success(
        page.complete ? "Collection indexing complete" : "Indexed next page",
        {
          description: page.complete ? `${page.indexed.toString()} owner records saved on the final page. Run Sync again to refresh wallets.` : `${page.scanned.toString()} tokens checked and ${page.indexed.toString()} owner records saved. Continue indexing to cover more of the collection.`
        }
      );
    } catch (err) {
      ue.error(extractError(err));
    } finally {
      setIsIndexing(false);
    }
  }
  async function handleRunUntilComplete() {
    setIsIndexing(true);
    try {
      let nextCursor2 = cursor;
      let pages = 0;
      let indexed2 = 0n;
      while (pages < 200) {
        const page = await indexOnePage(nextCursor2);
        indexed2 += page.indexed;
        pages += 1;
        nextCursor2 = page.nextCursor;
        if (page.complete || nextCursor2 == null) {
          ue.success("Collection indexing complete", {
            description: `${indexed2.toString()} ownership records indexed.`
          });
          await refetch();
          return;
        }
      }
      ue("Indexing paused", {
        description: `${indexed2.toString()} owner records saved across ${pages.toString()} pages. Continue indexing to cover the rest.`
      });
      await refetch();
    } catch (err) {
      ue.error(extractError(err));
    } finally {
      setIsIndexing(false);
    }
  }
  const scanned = (status == null ? void 0 : status.scanned) ?? 0n;
  const indexed = (status == null ? void 0 : status.indexed) ?? 0n;
  const complete = (status == null ? void 0 : status.complete) ?? false;
  const nextCursor = cursor ?? (status == null ? void 0 : status.cursor) ?? null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (v) => !v && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "bg-card border-border max-w-lg", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "font-display text-foreground flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-4 h-4 text-accent" }),
      "Ownership Indexing"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 pt-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: (collection == null ? void 0 : collection.name) ?? "Collection" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: (collection == null ? void 0 : collection.canisterId.toString()) ?? "" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-accent/20 bg-accent/5 p-3 text-xs text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-foreground", children: "Ownership discovery" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 leading-relaxed", children: "Indexing reads ownership in small pages so wallet Sync can find NFTs from older imported collections. Direct token ID import still works for a known NFT." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border bg-muted/20 p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Scanned" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-lg font-semibold", children: scanned.toString() })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border bg-muted/20 p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Indexed" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-lg font-semibold", children: indexed.toString() })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border bg-muted/20 p-3 text-xs text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: complete ? "default" : "secondary", children: complete ? "Complete" : "In progress" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex items-center justify-between gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Resume cursor" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-foreground", children: nextCursor ?? "None" })
        ] }),
        lastPage && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 text-foreground", children: [
          "Last page: ",
          lastPage.scanned.toString(),
          " tokens checked,",
          " ",
          lastPage.indexed.toString(),
          " owner records saved."
        ] }),
        (status == null ? void 0 : status.lastError) && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-destructive", children: status.lastError })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-2 pt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", onClick: onClose, disabled: isIndexing, children: "Close" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            onClick: handleIndexNextPage,
            disabled: !collection || isIndexing || complete,
            children: "Index Next 50"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            onClick: handleRunUntilComplete,
            disabled: !collection || isIndexing || complete,
            className: "bg-accent text-accent-foreground hover:bg-accent/90 transition-smooth",
            children: isIndexing ? "Indexing..." : "Continue Until Complete"
          }
        )
      ] })
    ] })
  ] }) });
}
function MintComposer({
  mintConfig,
  moderationConfig,
  mainCollection,
  creatorCollections,
  open,
  onOpenChange,
  focusRequestId,
  requestedTarget
}) {
  const { actor } = useBackend();
  const { principalText, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [name, setName] = reactExports.useState("");
  const [description, setDescription] = reactExports.useState("");
  const [attributesText, setAttributesText] = reactExports.useState("");
  const [imageDataUrl, setImageDataUrl] = reactExports.useState(null);
  const [fileName, setFileName] = reactExports.useState("");
  const [selectedTarget, setSelectedTarget] = reactExports.useState("");
  const [confirmMintOpen, setConfirmMintOpen] = reactExports.useState(false);
  const [cycleTopUpReason, setCycleTopUpReason] = reactExports.useState(null);
  const [attentionActive, setAttentionActive] = reactExports.useState(false);
  const mainMintAvailable = (mintConfig == null ? void 0 : mintConfig.mainMintEnabled) === true && mintConfig.collectionId != null && mainCollection != null;
  const { data: pendingMintPayments = [] } = useQuery(
    {
      queryKey: ["pendingMintPayments", principalText],
      queryFn: async () => {
        if (!actor) return [];
        return actor.getMyPendingMintPayments();
      },
      enabled: !!actor && isAuthenticated && open
    }
  );
  const retryPendingMintMutation = useMutation({
    mutationFn: async (paymentId) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.retryPendingMintPayment(paymentId);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (receipt) => {
      ue.success(
        `Mint recovered at block ${receipt.paymentBlock.toString()}`
      );
      void queryClient.invalidateQueries({ queryKey: ["pendingMintPayments"] });
      void queryClient.invalidateQueries({ queryKey: ["userNFTs"] });
      void queryClient.invalidateQueries({ queryKey: ["userStats"] });
      void queryClient.invalidateQueries({ queryKey: ["icp-balance"] });
    },
    onError: (err) => {
      ue.error(extractError(err));
    }
  });
  reactExports.useEffect(() => {
    const targetStillAvailable = selectedTarget === "main" && mainMintAvailable || creatorCollections.some(
      (collection) => `collection:${collection.id.toString()}` === selectedTarget
    );
    if (targetStillAvailable) return;
    if (mainMintAvailable) {
      setSelectedTarget("main");
      return;
    }
    if (creatorCollections.length > 0) {
      setSelectedTarget(`collection:${creatorCollections[0].id.toString()}`);
      return;
    }
    setSelectedTarget("");
  }, [creatorCollections, mainMintAvailable, selectedTarget]);
  reactExports.useEffect(() => {
    if (focusRequestId === 0) return;
    if (requestedTarget === "main" && mainMintAvailable) {
      setSelectedTarget("main");
    }
  }, [focusRequestId, mainMintAvailable, requestedTarget]);
  reactExports.useEffect(() => {
    if (!open || focusRequestId === 0) return;
    setAttentionActive(true);
    const scrollTimer = window.setTimeout(() => {
      const sectionElement = document.getElementById("wallet-mint-section");
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      sectionElement == null ? void 0 : sectionElement.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start"
      });
      const focusTarget = document.getElementById("mint-collection") ?? document.getElementById("mint-name") ?? sectionElement;
      focusTarget == null ? void 0 : focusTarget.focus({ preventScroll: true });
    }, 80);
    const attentionTimer = window.setTimeout(
      () => setAttentionActive(false),
      2200
    );
    return () => {
      window.clearTimeout(scrollTimer);
      window.clearTimeout(attentionTimer);
    };
  }, [focusRequestId, open]);
  const selectedCollection = creatorCollections.find(
    (collection) => `collection:${collection.id.toString()}` === selectedTarget
  ) ?? null;
  const targetCollection = selectedTarget === "main" ? mainCollection : selectedCollection;
  const mutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      if (!targetCollection)
        throw new Error("Select a Mintlab collection first");
      if (!imageDataUrl) throw new Error("Upload an image before minting");
      const metadata = {
        name: name.trim() || void 0,
        description: description.trim() || void 0,
        imageUrl: imageDataUrl,
        attributes: parseAttributeLines(attributesText)
      };
      if (selectedTarget === "main") {
        const result2 = await actor.mintUserNFT(metadata);
        if (result2.__kind__ === "err") throw new Error(result2.err);
        return result2.ok.nft;
      }
      const result = await actor.mintCollectionNFT(
        targetCollection.id,
        metadata
      );
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (nft) => {
      const displayName = getNFTDisplayName(nft, targetCollection);
      ue.success(
        `Minted ${displayName} into ${(targetCollection == null ? void 0 : targetCollection.name) ?? "the collection"}`
      );
      void queryClient.invalidateQueries({ queryKey: ["userNFTs"] });
      void queryClient.invalidateQueries({ queryKey: ["userStats"] });
      void queryClient.invalidateQueries({
        queryKey: ["collectionNFTs", (targetCollection == null ? void 0 : targetCollection.id.toString()) ?? ""]
      });
      void queryClient.invalidateQueries({ queryKey: ["icp-balance"] });
      void queryClient.invalidateQueries({ queryKey: ["pendingMintPayments"] });
      setName("");
      setDescription("");
      setAttributesText("");
      setImageDataUrl(null);
      setFileName("");
    },
    onError: (err) => {
      const message = extractError(err);
      if (isLowCyclesError(message)) {
        setCycleTopUpReason(message);
        return;
      }
      ue.error(message);
    }
  });
  async function handleFileChange(file) {
    if (!file) {
      setImageDataUrl(null);
      setFileName("");
      return;
    }
    if (!isSupportedModerationImageFile(file)) {
      setImageDataUrl(null);
      setFileName("");
      ue.error("Choose a JPG or PNG image");
      return;
    }
    const reader = new FileReader();
    reader.onload = async () => {
      if (typeof reader.result === "string") {
        try {
          const compressed = await compressModerationImage(reader.result);
          if (compressed.length > MAX_ON_CHAIN_IMAGE_CHARS) {
            setImageDataUrl(null);
            setFileName("");
            ue.error(
              "Uploaded image is too large for on-chain storage even after compression. Please use a smaller image."
            );
            return;
          }
          setImageDataUrl(compressed);
          setFileName(file.name);
        } catch (err) {
          setImageDataUrl(null);
          setFileName("");
          ue.error(
            typeof err === "object" && err !== null && "message" in err ? String(err.message) : "Could not process image"
          );
        }
      } else {
        ue.error("Could not read image file");
      }
    };
    reader.onerror = () => ue.error("Could not read image file");
    reader.readAsDataURL(file);
  }
  function startMint() {
    try {
      if (!targetCollection)
        throw new Error("Select a Mintlab collection first");
      if (!imageDataUrl) throw new Error("Upload an image before minting");
      parseAttributeLines(attributesText);
      if (selectedTarget === "main" && (mintConfig == null ? void 0 : mintConfig.mainMintPriceE8s)) {
        setConfirmMintOpen(true);
        return;
      }
      mutation.mutate();
    } catch (err) {
      ue.error(extractError(err));
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Collapsible,
      {
        open,
        onOpenChange,
        "data-ocid": "wallet.mint.collapsible",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Card,
          {
            id: "wallet-mint-section",
            tabIndex: -1,
            "aria-label": "Mint NFTs",
            className: `scroll-mt-6 border-border bg-card outline-none transition-[box-shadow,border-color] duration-300 ${attentionActive ? "border-accent/60 shadow-lg shadow-accent/10" : ""}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "space-y-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 space-y-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2 text-base", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Coins, { className: "w-4 h-4 shrink-0 text-accent" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: "Mint NFTs" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Upload artwork, choose a collection, and add optional traits for filtering and discovery." })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(CollapsibleTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    type: "button",
                    variant: "outline",
                    size: "sm",
                    className: "w-full gap-1.5 sm:w-auto",
                    "aria-controls": "wallet-mint-nfts-content",
                    "data-ocid": "wallet.mint.toggle_button",
                    children: [
                      open ? "Hide Minting" : "Open Minting",
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        ChevronDown,
                        {
                          className: `h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`
                        }
                      )
                    ]
                  }
                ) })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CollapsibleContent, { id: "wallet-mint-nfts-content", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  HelpCallout,
                  {
                    title: "Minting starts here",
                    sectionId: "wallet",
                    actionLabel: "Minting guide",
                    ocid: "wallet.mint.help_callout",
                    children: "Use this panel to mint into the main app collection when public minting is enabled, or into one of the Mintlab collections you created."
                  }
                ),
                pendingMintPayments.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "Paid mint recovery" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Payment is recorded on-chain. Retry finishes the mint without charging again." })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "shrink-0 bg-amber-500/20 text-amber-700 border-0 dark:text-amber-200", children: pendingMintPayments.length })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: pendingMintPayments.map((payment) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      className: "flex flex-col gap-2 rounded-md border border-border bg-background/70 p-3 sm:flex-row sm:items-center sm:justify-between",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: pendingMintStatusLabel(payment.status) }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                            formatICP(payment.amountE8s),
                            " ICP",
                            payment.paymentBlock == null ? "" : ` - block ${payment.paymentBlock.toString()}`
                          ] }),
                          payment.lastError && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-destructive", children: payment.lastError })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          Button,
                          {
                            size: "sm",
                            variant: "outline",
                            className: "gap-2 self-start sm:self-center",
                            disabled: retryPendingMintMutation.isPending || payment.status === "Minted",
                            onClick: () => retryPendingMintMutation.mutate(payment.id),
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-4 w-4" }),
                              "Retry"
                            ]
                          }
                        )
                      ]
                    },
                    payment.id.toString()
                  )) })
                ] }),
                !mintConfig ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Minting has not been configured by the admin yet." }) : !mainMintAvailable && creatorCollections.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-accent/20 bg-accent/5 p-3 text-sm text-muted-foreground", children: "Create your first Mintlab collection on the Collections page, or wait for the admin to enable public minting into the main collection." }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-muted/20 p-3 text-sm text-muted-foreground", children: [
                    "Collection creation fee:",
                    " ",
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { className: "text-foreground", children: [
                      formatICP(mintConfig.collectionCreationPriceE8s),
                      " ICP"
                    ] }),
                    mintConfig.collectionCreationEnabled ? "" : " - collection creation is currently disabled by the admin"
                  ] })
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        Label,
                        {
                          htmlFor: "mint-collection",
                          className: "flex items-center gap-1.5",
                          children: [
                            "Mint target",
                            /* @__PURE__ */ jsxRuntimeExports.jsx(HelpTooltip, { children: "Main app minting uses the admin-set price when enabled. Your creator collections mint into their own ICRC-7 canisters." })
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        Select,
                        {
                          value: selectedTarget,
                          onValueChange: setSelectedTarget,
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              SelectTrigger,
                              {
                                id: "mint-collection",
                                "data-ocid": "wallet.mint.collection_select",
                                children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select a collection" })
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                              mainMintAvailable && mainCollection && /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: "main", children: [
                                mainCollection.name,
                                " (",
                                formatICP(mintConfig.mainMintPriceE8s),
                                " ICP)"
                              ] }),
                              creatorCollections.map((collection) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                SelectItem,
                                {
                                  value: `collection:${collection.id.toString()}`,
                                  children: [
                                    collection.name,
                                    " (",
                                    collection.symbol,
                                    ")"
                                  ]
                                },
                                collection.id.toString()
                              ))
                            ] })
                          ]
                        }
                      )
                    ] }),
                    targetCollection && /* @__PURE__ */ jsxRuntimeExports.jsx(
                      CopyField,
                      {
                        label: "Collection Canister",
                        value: targetCollection.canisterId.toString(),
                        ocid: "wallet.mint.copy_canister_id"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-accent/20 bg-accent/5 p-3 text-sm text-muted-foreground", children: selectedTarget === "main" ? `Minting into the main collection costs ${formatICP(mintConfig.mainMintPriceE8s)} ICP from your in-app account.` : "Creator collections use their own dedicated ICRC-7 canister." }),
                  (moderationConfig == null ? void 0 : moderationConfig.enabled) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-primary/20 bg-primary/5 p-3 text-sm text-muted-foreground", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: moderationConfig.userMessage }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2", children: "Mintlab uses AI moderation and copyright checks for uploads. Avoid potentially copyrighted images, characters, logos, watermarks, and protected artwork. NFTs or collections that fail checks may be hidden from public view." })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "mint-name", children: "NFT name" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Input,
                        {
                          id: "mint-name",
                          value: name,
                          onChange: (e) => setName(e.target.value),
                          placeholder: "e.g. Vault Original #1",
                          "data-ocid": "wallet.mint.name_input"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "mint-image", children: "Image upload" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Input,
                        {
                          id: "mint-image",
                          type: "file",
                          accept: MODERATION_IMAGE_ACCEPT,
                          onChange: (e) => {
                            var _a;
                            return void handleFileChange(((_a = e.target.files) == null ? void 0 : _a[0]) ?? null);
                          },
                          "data-ocid": "wallet.mint.image_input"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: fileName || ((moderationConfig == null ? void 0 : moderationConfig.enabled) ? "Choose a JPG or PNG under about 1 MB and avoid potentially copyrighted artwork" : "Choose an image to store with the minted NFT") })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "mint-description", children: "Description" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Textarea,
                      {
                        id: "mint-description",
                        rows: 3,
                        value: description,
                        onChange: (e) => setDescription(e.target.value),
                        placeholder: "Describe your NFT…",
                        "data-ocid": "wallet.mint.description_textarea"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "mint-attributes", children: [
                      "Attributes",
                      " ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "(Trait: Value)" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Textarea,
                      {
                        id: "mint-attributes",
                        rows: 3,
                        value: attributesText,
                        onChange: (e) => setAttributesText(e.target.value),
                        placeholder: "Rarity: Rare\nSeries: Genesis",
                        "data-ocid": "wallet.mint.attributes_textarea"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Attributes are optional traits like Background: Blue or Rarity: Rare. They appear as filters on collection pages." })
                  ] }),
                  imageDataUrl && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border bg-muted/20 p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "img",
                    {
                      src: imageDataUrl,
                      alt: "Mint preview",
                      className: "w-28 h-28 rounded-lg object-cover border border-border/50"
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TermsAgreementNotice, { actionLabel: "minting this NFT" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      onClick: startMint,
                      disabled: mutation.isPending || !targetCollection,
                      className: "gap-2",
                      "data-ocid": "wallet.mint.submit_button",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(ImagePlus, { className: "w-4 h-4" }),
                        mutation.isPending ? "Minting..." : "Mint NFT"
                      ]
                    }
                  ) })
                ] })
              ] }) })
            ]
          }
        )
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PaymentConfirmationDialog,
      {
        open: confirmMintOpen,
        onOpenChange: setConfirmMintOpen,
        title: "Confirm Mint Payment",
        description: (moderationConfig == null ? void 0 : moderationConfig.enabled) ? "Mintlab checks the uploaded image for moderation and copyright issues before any ICP is transferred." : "Confirm the ICP payment from your in-app account before this NFT is minted.",
        lines: [
          {
            label: "Mint price",
            value: `${formatICP((mintConfig == null ? void 0 : mintConfig.mainMintPriceE8s) ?? 0n)} ICP`
          },
          {
            label: "Ledger fee",
            value: `${formatICP(ICP_LEDGER_FEE_E8S)} ICP`
          },
          {
            label: "Total debit",
            value: `${formatICP(
              ((mintConfig == null ? void 0 : mintConfig.mainMintPriceE8s) ?? 0n) + ICP_LEDGER_FEE_E8S
            )} ICP`
          }
        ],
        confirmLabel: "Mint NFT",
        isPending: mutation.isPending,
        onConfirm: () => {
          setConfirmMintOpen(false);
          mutation.mutate();
        },
        ocid: "wallet.mint.payment_dialog"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      AppCanisterTopUpDialog,
      {
        open: cycleTopUpReason != null,
        reason: cycleTopUpReason,
        onOpenChange: (open2) => {
          if (!open2) setCycleTopUpReason(null);
        },
        onSuccess: () => mutation.mutate()
      }
    )
  ] });
}
function StatsBar({ stats, isLoading }) {
  const totalNFTs = stats ? Number(stats.totalCount) : 0;
  const totalCollections = stats ? stats.perCollection.length : 0;
  const items = [
    {
      icon: Wallet,
      label: "Total NFTs",
      value: isLoading ? null : totalNFTs,
      ocid: "wallet.stats.total_nfts"
    },
    {
      icon: Layers,
      label: "Collections",
      value: isLoading ? null : totalCollections,
      ocid: "wallet.stats.total_collections"
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-3 flex-wrap", children: items.map(({ icon: Icon, label, value, ocid }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex items-center gap-2.5 bg-card border border-border rounded-xl px-4 py-2.5",
      "data-ocid": ocid,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-4 h-4 text-accent" }) }),
        value === null ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-12 h-5" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-lg leading-none text-foreground", children: value }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: label })
        ] })
      ]
    },
    label
  )) });
}
function WalletSyncWizardDialog({
  open,
  onOpenChange,
  syncableCollections,
  selectedCollectionId,
  onSelectedCollectionIdChange,
  tokenHint,
  onTokenHintChange,
  selectedReadiness,
  isSyncing,
  onSyncAll,
  onSyncCollection,
  onImportCollection,
  onImportSpecificNFT
}) {
  const [step, setStep] = reactExports.useState("collection");
  const selectedCollection = syncableCollections.find(
    (collection) => collection.id.toString() === selectedCollectionId
  ) ?? null;
  const trimmedTokenHint = tokenHint.trim();
  reactExports.useEffect(() => {
    if (!open) return;
    if (syncableCollections.length === 0) {
      setStep("missingCollection");
    } else {
      setStep("collection");
    }
  }, [open, syncableCollections.length]);
  function handleSelectedSync() {
    if (!selectedCollection || !onSyncCollection) {
      ue.error("Choose the imported collection this NFT belongs to.");
      return;
    }
    onSyncCollection(
      selectedCollection.id,
      trimmedTokenHint ? [trimmedTokenHint] : []
    );
    onOpenChange(false);
  }
  function handleBroadSync() {
    onSelectedCollectionIdChange("all");
    onTokenHintChange("");
    onSyncAll();
    onOpenChange(false);
  }
  const options = [
    {
      value: "collection",
      title: "I know the collection",
      description: "Fastest when you can also enter the token ID.",
      icon: Layers
    },
    {
      value: "missingCollection",
      title: "I do not see it",
      description: "Import the collection before syncing that NFT.",
      icon: Plus
    },
    {
      value: "broad",
      title: "I do not know",
      description: "Checks imported collections in small pages.",
      icon: RefreshCw
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: "max-h-[90vh] overflow-y-auto border-border bg-card sm:max-w-2xl",
      "data-ocid": "wallet.sync_wizard.dialog",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center gap-2 font-display text-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-4 w-4 text-accent" }),
            "Guided NFT Sync"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Start with the collection when you know it. Mintlab checks a known token ID directly before doing any slower collection indexing." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            RadioGroup,
            {
              value: step,
              onValueChange: (value) => setStep(value),
              className: "grid gap-2 sm:grid-cols-3",
              "data-ocid": "wallet.sync_wizard.mode_group",
              children: options.map(({ value, title, description, icon: Icon }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "label",
                {
                  htmlFor: `sync-mode-${value}`,
                  className: `flex cursor-pointer items-start gap-2 rounded-lg border p-3 transition-smooth ${step === value ? "border-accent bg-accent/10 text-foreground" : "border-border bg-background/60 text-muted-foreground hover:border-accent/40"}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      RadioGroupItem,
                      {
                        id: `sync-mode-${value}`,
                        value,
                        className: "mt-0.5"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "min-w-0", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5 text-sm font-medium", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-3.5 w-3.5 shrink-0" }),
                        title
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mt-1 block text-xs leading-relaxed", children: description })
                    ] })
                  ]
                },
                value
              ))
            }
          ),
          step === "collection" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 rounded-lg border border-border bg-background/60 p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3 md:grid-cols-[1fr_11rem]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "syncWizardCollection", children: "Collection" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Select,
                  {
                    value: selectedCollectionId,
                    onValueChange: onSelectedCollectionIdChange,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        SelectTrigger,
                        {
                          id: "syncWizardCollection",
                          className: "bg-muted/30",
                          "data-ocid": "wallet.sync_wizard.collection_select",
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Choose collection" })
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "Choose collection" }),
                        syncableCollections.map((collection) => /* @__PURE__ */ jsxRuntimeExports.jsx(
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
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "syncWizardTokenId", children: "Token ID" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "syncWizardTokenId",
                    value: tokenHint,
                    onChange: (event) => onTokenHintChange(event.target.value),
                    placeholder: "Optional",
                    className: "bg-muted/30 font-mono",
                    "data-ocid": "wallet.sync_wizard.token_id_input"
                  }
                )
              ] })
            ] }),
            selectedCollection ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3 rounded-lg border border-border bg-card p-3 sm:flex-row sm:items-start sm:justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: selectedCollection.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", children: nftStandardLabel(selectedCollection) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs leading-relaxed text-muted-foreground", children: (selectedReadiness == null ? void 0 : selectedReadiness.recommendedAction) ?? "Mintlab will check owner lookups first, then continue saved selected indexing only when needed." })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: (selectedReadiness == null ? void 0 : selectedReadiness.allowsSync) === false ? "destructive" : "outline",
                  className: "shrink-0",
                  children: readinessStatusLabel(
                    selectedReadiness,
                    selectedCollection
                  )
                }
              )
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border border-amber-200/70 bg-amber-50/70 p-3 text-xs leading-relaxed text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/20 dark:text-amber-100", children: "Choose the imported collection that sent the NFT. If it is not listed, import the collection first." }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  type: "button",
                  variant: "ghost",
                  className: "justify-start gap-1.5 text-muted-foreground",
                  onClick: () => setStep("missingCollection"),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
                    "I do not see the collection"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2 sm:justify-end", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    type: "button",
                    variant: "outline",
                    onClick: () => {
                      if (selectedCollection) {
                        onImportSpecificNFT(
                          selectedCollection.id,
                          trimmedTokenHint || void 0
                        );
                      } else {
                        onImportSpecificNFT();
                      }
                      onOpenChange(false);
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
                      "Import by token ID"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    type: "button",
                    className: "gap-2",
                    disabled: isSyncing || !selectedCollection || !onSyncCollection,
                    onClick: handleSelectedSync,
                    "data-ocid": "wallet.sync_wizard.selected_submit",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        RefreshCw,
                        {
                          className: `h-4 w-4 ${isSyncing ? "animate-spin" : ""}`
                        }
                      ),
                      trimmedTokenHint ? "Check token ID" : "Sync collection"
                    ]
                  }
                )
              ] })
            ] })
          ] }),
          step === "missingCollection" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 rounded-lg border border-border bg-background/60 p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "Import the collection first" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm leading-relaxed text-muted-foreground", children: "Mintlab can only sync external NFTs from collections already added to the shared directory. After importing, return here and sync the specific collection or token ID." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  type: "button",
                  className: "gap-2",
                  onClick: onImportCollection,
                  "data-ocid": "wallet.sync_wizard.import_collection_button",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
                    "Import collection"
                  ]
                }
              ),
              syncableCollections.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  type: "button",
                  variant: "outline",
                  onClick: () => setStep("collection"),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "h-4 w-4" }),
                    "Choose existing collection"
                  ]
                }
              )
            ] })
          ] }),
          step === "broad" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 rounded-lg border border-amber-200/70 bg-amber-50/70 p-4 dark:border-amber-900/50 dark:bg-amber-950/20", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "Broad sync can take longer" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm leading-relaxed text-muted-foreground", children: "Mintlab checks imported collections in small safe pages and saves progress. Some external canisters do not expose a complete owner index, so collection and token ID details are still the most reliable path." })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  type: "button",
                  className: "gap-2",
                  disabled: isSyncing,
                  onClick: handleBroadSync,
                  "data-ocid": "wallet.sync_wizard.broad_submit",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      RefreshCw,
                      {
                        className: `h-4 w-4 ${isSyncing ? "animate-spin" : ""}`
                      }
                    ),
                    "Run broad sync"
                  ]
                }
              ),
              syncableCollections.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  type: "button",
                  variant: "outline",
                  onClick: () => setStep("collection"),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "h-4 w-4" }),
                    "Choose collection"
                  ]
                }
              )
            ] })
          ] })
        ] })
      ]
    }
  ) });
}
function ReceivingInstructions({
  actor,
  principalText,
  accountIdHex,
  collections,
  onSync,
  onSyncCollection,
  onImportSpecificNFT,
  onIndexCollection,
  syncStatus
}) {
  const [syncTargetCollectionId, setSyncTargetCollectionId] = reactExports.useState("all");
  const [syncTokenHint, setSyncTokenHint] = reactExports.useState("");
  const [syncWizardOpen, setSyncWizardOpen] = reactExports.useState(false);
  const navigate = useNavigate();
  const isSyncing = syncStatus.kind === "syncing";
  const skipped = syncStatus.kind === "partial" ? syncStatus.skipped : [];
  const progress = syncStatus.kind === "partial" ? syncStatus.progress : null;
  const indexingSkips = skipped.filter(isAutoIndexingSkip);
  const setupSkips = skipped.filter((skip) => !isAutoIndexingSkip(skip));
  const onlyAutoIndexing = skipped.length > 0 && setupSkips.length === 0;
  const syncableCollections = reactExports.useMemo(
    () => collections.filter((collection) => collection.kind === "External"),
    [collections]
  );
  const selectedSyncCollection = syncableCollections.find(
    (collection) => collection.id.toString() === syncTargetCollectionId
  ) ?? null;
  const { data: selectedReadiness = null } = useQuery({
    queryKey: [
      "collectionSyncReadiness",
      (selectedSyncCollection == null ? void 0 : selectedSyncCollection.id.toString()) ?? null
    ],
    enabled: actor != null && selectedSyncCollection != null,
    staleTime: 15e3,
    queryFn: async () => {
      if (!actor || !selectedSyncCollection) return null;
      const result = await actor.getCollectionSyncReadiness(
        selectedSyncCollection.id
      );
      if (result.__kind__ === "err") {
        throw new Error(result.err);
      }
      return result.ok;
    }
  });
  const {
    data: selectedReceiveInstructions = null,
    isLoading: receiveLoading
  } = useQuery({
    queryKey: [
      "nftReceiveInstructions",
      (selectedSyncCollection == null ? void 0 : selectedSyncCollection.id.toString()) ?? null
    ],
    enabled: actor != null && selectedSyncCollection != null,
    staleTime: 6e4,
    queryFn: async () => {
      if (!actor || !selectedSyncCollection) return null;
      const result = await actor.getNFTReceiveInstructions(
        selectedSyncCollection.id
      );
      if (result.__kind__ === "err") {
        throw new Error(result.err);
      }
      return result.ok;
    }
  });
  reactExports.useEffect(() => {
    if (syncTargetCollectionId !== "all" && !syncableCollections.some(
      (collection) => collection.id.toString() === syncTargetCollectionId
    )) {
      setSyncTargetCollectionId("all");
    }
  }, [syncTargetCollectionId, syncableCollections]);
  function handleImportCollection() {
    setSyncWizardOpen(false);
    void navigate({ to: "/collections", hash: "import-collection" });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 8 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.4, delay: 0.05 },
      className: "bg-card border border-border rounded-2xl overflow-hidden",
      "data-ocid": "wallet.receiving_instructions",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3 px-5 py-3 border-b border-border bg-accent/5 sm:flex-row sm:items-center sm:justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { className: "w-4 h-4 text-accent" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-semibold text-sm text-foreground", children: "Receive NFTs & ICP" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-end gap-2", children: [
            syncStatus.kind === "ok" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.span,
              {
                initial: { opacity: 0, x: 4 },
                animate: { opacity: 1, x: 0 },
                className: "flex items-center gap-1 text-xs text-accent font-medium",
                "data-ocid": "wallet.sync.success_state",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-3.5 h-3.5" }),
                  syncStatus.newCount === 1 ? "1 new NFT found" : `${syncStatus.newCount} new NFTs found`
                ]
              }
            ),
            syncStatus.kind === "upToDate" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.span,
              {
                initial: { opacity: 0, x: 4 },
                animate: { opacity: 1, x: 0 },
                className: "flex items-center gap-1 text-xs text-muted-foreground",
                "data-ocid": "wallet.sync.success_state",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-3.5 h-3.5" }),
                  "Up to date"
                ]
              }
            ),
            syncStatus.kind === "partial" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.span,
              {
                initial: { opacity: 0, x: 4 },
                animate: { opacity: 1, x: 0 },
                className: "flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 truncate max-w-[210px]",
                title: syncStatus.message,
                "data-ocid": "wallet.sync.partial_state",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "w-3.5 h-3.5 shrink-0" }),
                  syncStatus.skipped.length > 0 ? onlyAutoIndexing ? `${indexingSkips.length} indexing` : `${setupSkips.length} need selected sync` : syncStatus.newCount > 0 ? `${syncStatus.newCount} synced; some warnings` : "Review sync details"
                ]
              }
            ),
            syncStatus.kind === "error" && /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.span,
              {
                initial: { opacity: 0, x: 4 },
                animate: { opacity: 1, x: 0 },
                className: "text-xs text-destructive truncate max-w-[160px]",
                title: syncStatus.message,
                "data-ocid": "wallet.sync.error_state",
                children: syncStatus.message
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "sm",
                variant: "ghost",
                className: "h-7 px-2 gap-1.5 text-xs text-muted-foreground hover:text-foreground",
                onClick: () => onImportSpecificNFT(),
                "data-ocid": "wallet.import_specific_nft_button",
                "aria-label": "Import NFT by token ID",
                title: "Import NFT by token ID",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3 h-3" }),
                  "Import NFT"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "sm",
                variant: "ghost",
                className: "h-7 px-2 gap-1.5 text-xs text-muted-foreground hover:text-foreground",
                onClick: () => setSyncWizardOpen(true),
                disabled: isSyncing,
                "data-ocid": "wallet.refresh_button",
                "aria-label": "Sync NFTs from chain",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    RefreshCw,
                    {
                      className: `w-3 h-3 ${isSyncing ? "animate-spin" : ""}`
                    }
                  ),
                  isSyncing ? "Syncing…" : "Sync"
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          WalletSyncWizardDialog,
          {
            open: syncWizardOpen,
            onOpenChange: setSyncWizardOpen,
            syncableCollections,
            selectedCollectionId: syncTargetCollectionId,
            onSelectedCollectionIdChange: setSyncTargetCollectionId,
            tokenHint: syncTokenHint,
            onTokenHintChange: setSyncTokenHint,
            selectedReadiness,
            isSyncing,
            onSyncAll: onSync,
            onSyncCollection,
            onImportCollection: handleImportCollection,
            onImportSpecificNFT
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
            principalText && /* @__PURE__ */ jsxRuntimeExports.jsx(
              CopyField,
              {
                label: "Your Principal ID",
                value: principalText,
                ocid: "wallet.copy_principal_button"
              }
            ),
            accountIdHex ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              CopyField,
              {
                label: "ICP Account ID",
                value: accountIdHex,
                ocid: "wallet.copy_account_id_button"
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-muted-foreground uppercase tracking-wider", children: "ICP Account ID" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-9 w-full rounded-lg" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 rounded-lg border border-accent/20 bg-accent/5 p-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "mt-0.5 h-4 w-4 shrink-0 text-accent" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs leading-relaxed text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-foreground", children: "Send NFTs to your Principal ID." }),
              " ",
              "Use your ICP Account ID only for ICP deposits. If Sync shows a collection-specific NFT receive destination, use that exact value for that collection, then sync or import the token ID."
            ] })
          ] }),
          selectedSyncCollection && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border bg-background/60 p-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: selectedSyncCollection.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", children: nftStandardLabel(selectedSyncCollection) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: (selectedReadiness == null ? void 0 : selectedReadiness.recommendedAction) ?? "Mintlab will use direct owner lookups first, then continue safe selected indexing when collection range data is available." })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: (selectedReadiness == null ? void 0 : selectedReadiness.allowsSync) === false ? "destructive" : "outline",
                  className: "shrink-0",
                  children: readinessStatusLabel(
                    selectedReadiness,
                    selectedSyncCollection
                  )
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3", children: selectedReceiveInstructions ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                CopyField,
                {
                  label: receiveInstructionLabel(
                    selectedSyncCollection,
                    selectedReceiveInstructions
                  ),
                  value: receiveInstructionValue(selectedReceiveInstructions),
                  ocid: "wallet.copy_collection_receive_destination"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed", children: selectedReceiveInstructions.warning })
            ] }) : receiveLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-muted-foreground uppercase tracking-wider", children: "Receive destination" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-9 w-full rounded-lg" })
            ] }) : null }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 grid gap-3 md:grid-cols-[1fr_auto] md:items-end", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 text-xs text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3.5 w-3.5 text-accent" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Direct owner lookup" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3.5 w-3.5 text-accent" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "App deposit account lookup" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "h-3.5 w-3.5 text-amber-600 dark:text-amber-400" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: selectedSyncCollection.standard.__kind__ === "EXT" && (selectedReadiness == null ? void 0 : selectedReadiness.hasBrowseInfo) === false ? "Full EXT registry scan disabled until total supply is set" : selectedSyncCollection.standard.__kind__ === "EXT" ? "EXT indexing uses bounded registry or small saved pages" : "Collection indexing uses small saved pages" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2 md:justify-end", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    size: "sm",
                    variant: "outline",
                    className: "h-8 gap-1.5 text-xs",
                    onClick: () => onImportSpecificNFT(selectedSyncCollection.id),
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5" }),
                      "Enter token ID"
                    ]
                  }
                ),
                onSyncCollection && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    size: "sm",
                    variant: "outline",
                    className: "h-8 gap-1.5 text-xs",
                    disabled: isSyncing,
                    onClick: () => onSyncCollection(selectedSyncCollection.id, []),
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-3.5 w-3.5" }),
                      "Continue indexing"
                    ]
                  }
                ),
                onIndexCollection && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    size: "sm",
                    variant: "outline",
                    className: "h-8 text-xs",
                    onClick: () => onIndexCollection(selectedSyncCollection.id),
                    children: "Open Indexing"
                  }
                )
              ] })
            ] })
          ] }),
          syncStatus.kind === "partial" && (syncStatus.skipped.length > 0 || progress) && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border border-amber-200/70 bg-amber-50/70 p-3 dark:border-amber-900/50 dark:bg-amber-950/20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: progress ? "Selected collection sync progress" : onlyAutoIndexing ? "Automatic discovery is indexing" : "Select a collection to finish sync" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs leading-relaxed text-muted-foreground", children: progress ? selectedSyncProgressMessage(
                  progress,
                  selectedSyncCollection
                ) : onlyAutoIndexing ? "Sync is indexing imported collections in safe pages. New NFTs appear as soon as they are found; known token IDs can still be imported directly." : "Open Sync, choose the named collection, then run selected sync. If you know the NFT token ID, enter it there for the fastest check." })
              ] })
            ] }),
            syncStatus.skipped.slice(0, 4).map((skip) => {
              const isIndexing = isAutoIndexingSkip(skip);
              const canTargetCollection = skip.collectionId !== 0n && syncableCollections.some(
                (collection) => collection.id === skip.collectionId
              );
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex flex-col gap-2 border-t border-amber-200/60 pt-2 sm:flex-row sm:items-center sm:justify-between dark:border-amber-900/40",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-sm font-medium text-foreground", children: skip.collectionName }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: skip.message || "Automatic discovery is still catching up for this collection." })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2 sm:justify-end", children: [
                      canTargetCollection && onSyncCollection && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        Button,
                        {
                          size: "sm",
                          variant: "outline",
                          className: "h-8 shrink-0 gap-1.5 text-xs",
                          onClick: () => {
                            setSyncTargetCollectionId(
                              skip.collectionId.toString()
                            );
                            setSyncTokenHint("");
                            onSyncCollection(skip.collectionId, []);
                          },
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-3.5 w-3.5" }),
                            "Sync collection"
                          ]
                        }
                      ),
                      canTargetCollection && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        Button,
                        {
                          size: "sm",
                          variant: "outline",
                          className: "h-8 shrink-0 gap-1.5 text-xs",
                          onClick: () => onImportSpecificNFT(skip.collectionId),
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5" }),
                            "Enter token ID"
                          ]
                        }
                      ),
                      !isIndexing && canTargetCollection && onIndexCollection && /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Button,
                        {
                          size: "sm",
                          variant: "outline",
                          className: "h-8 shrink-0",
                          onClick: () => onIndexCollection(skip.collectionId),
                          children: "Open Indexing"
                        }
                      ),
                      !canTargetCollection && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "shrink-0", children: isIndexing ? "Indexing" : "Action needed" })
                    ] })
                  ]
                },
                skip.collectionId.toString()
              );
            }),
            syncStatus.skipped.length > 4 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
              syncStatus.skipped.length - 4,
              " more collections",
              " ",
              onlyAutoIndexing ? "are indexing automatically." : "need selected sync."
            ] })
          ] }) }),
          isSyncing && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, height: 0 },
              animate: { opacity: 1, height: "auto" },
              exit: { opacity: 0, height: 0 },
              className: "flex items-center gap-2 p-3 bg-accent/5 border border-accent/20 rounded-lg",
              "data-ocid": "wallet.sync.loading_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-3.5 h-3.5 border-2 border-accent/30 border-t-accent rounded-full animate-spin shrink-0" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-accent leading-relaxed", children: syncStatus.slow ? "Still syncing collections. New NFTs will appear here as they are indexed." : "Checking on-chain ownership across your collections..." })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 p-3 bg-muted/30 rounded-lg", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "w-4 h-4 text-accent shrink-0 mt-0.5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground leading-relaxed", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-foreground", children: "After sending NFTs:" }),
              " ",
              "Click ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-foreground", children: "Sync" }),
              ", choose the collection and token ID when you know them, or import the collection first if it is missing. Broad sync checks imported collections in small saved pages."
            ] })
          ] })
        ] })
      ]
    }
  );
}
function UnauthHero({ login }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 24 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.5 },
      className: "w-full flex flex-col items-center justify-center text-center py-24 px-6",
      "data-ocid": "wallet.unauthenticated_hero",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mb-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "w-24 h-24 rounded-full nft-card-glow",
              style: {
                background: "radial-gradient(circle, oklch(var(--accent) / 0.3) 0%, oklch(var(--primary) / 0.15) 60%, transparent 100%)"
              }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "w-10 h-10 text-accent" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-bold text-4xl text-foreground mb-3", children: "Your NFT Wallet" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-lg max-w-md leading-relaxed mb-8", children: "Connect with Internet Identity to view your NFTs, track collection stats, and register assets to your wallet." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "lg",
            onClick: login,
            className: "bg-accent text-accent-foreground hover:bg-accent/90 transition-smooth gap-2 font-semibold px-8 py-3",
            "data-ocid": "wallet.login_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LogIn, { className: "w-4 h-4" }),
              "Connect with Internet Identity"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-5", children: "No account needed — Internet Identity is secure & anonymous" })
      ]
    }
  );
}
function CollectionSection({
  collection,
  nfts,
  trustStatus,
  listedNFTKeys,
  sectionIndex,
  isCreatorCollection,
  isMainCollection,
  dividendBalances,
  onMintInStudio,
  onReportNFT
}) {
  var _a;
  const [registerOpen, setRegisterOpen] = reactExports.useState(false);
  const [detailNft, setDetailNft] = reactExports.useState(null);
  const [sendNft, setSendNft] = reactExports.useState(null);
  const collectionImageUrl = resolveImageUrl(collection.imageUrl);
  const isNFTListed = (nft) => listedNFTKeys.has(nftKey(nft.collectionId, nft.tokenId));
  const canMintInStudio = collection.kind !== "External" && isMainCollection && typeof onMintInStudio === "function";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.section,
    {
      initial: { opacity: 0, y: 16 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true },
      transition: { duration: 0.4, delay: sectionIndex * 0.08 },
      "data-ocid": `wallet.collection.${sectionIndex + 1}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4 mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
            collectionImageUrl && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: collectionImageUrl,
                alt: collection.name,
                className: "w-9 h-9 rounded-full border border-border/60 object-cover shrink-0"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-foreground text-lg truncate", children: collection.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Badge,
                  {
                    variant: "secondary",
                    className: "font-mono text-xs shrink-0 bg-muted/60 text-muted-foreground border border-border/40",
                    children: [
                      nfts.length,
                      " NFT",
                      nfts.length !== 1 ? "s" : ""
                    ]
                  }
                ),
                isCreatorCollection && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "shrink-0 bg-accent/10 text-accent border border-accent/20", children: "Your Collection" }),
                ((_a = collection.dividendConfig) == null ? void 0 : _a.enabled) && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "shrink-0 bg-emerald-500/10 text-emerald-700 border border-emerald-500/20", children: "Dividends" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                CollectionBadge,
                {
                  collection,
                  trustStatus,
                  size: "sm",
                  className: "mt-0.5"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "sm",
              variant: "outline",
              onClick: () => {
                if (collection.kind === "External") {
                  setRegisterOpen(true);
                  return;
                }
                onMintInStudio == null ? void 0 : onMintInStudio();
              },
              className: "shrink-0 gap-1.5 border-accent/30 text-accent hover:bg-accent/10 hover:border-accent/60",
              "data-ocid": `wallet.register_nft_button.${sectionIndex + 1}`,
              disabled: collection.kind !== "External" && !canMintInStudio,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3.5 h-3.5" }),
                collection.kind === "External" ? "Import NFT" : "Mint in Studio"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-muted/20 px-3 py-2.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] uppercase tracking-wider text-muted-foreground", children: "Collection Canister" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate font-mono text-sm text-foreground", children: collection.canisterId.toString() })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "sm",
              variant: "outline",
              className: "shrink-0 gap-1.5",
              onClick: () => {
                void navigator.clipboard.writeText(
                  collection.canisterId.toString()
                );
                ue.success("Collection canister copied");
              },
              "data-ocid": `wallet.copy_collection_canister.${sectionIndex + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "w-3.5 h-3.5" }),
                "Copy"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3", children: nfts.map((nft, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative group", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            NFTCard,
            {
              nft,
              collection,
              trustStatus,
              isListed: isNFTListed(nft),
              dividendE8s: dividendBalances.get(nftKey(nft.collectionId, nft.tokenId)) ?? 0n,
              index: i,
              onClick: () => setDetailNft(nft),
              "data-ocid": `wallet.nft.item.${sectionIndex * 100 + i + 1}`
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              className: "absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-accent text-accent-foreground rounded-lg px-2 py-1 text-xs font-medium flex items-center gap-1 shadow-lg hover:bg-accent/90",
              onClick: (e) => {
                e.stopPropagation();
                setSendNft(nft);
              },
              "data-ocid": `wallet.send_nft_button.${sectionIndex * 100 + i + 1}`,
              "aria-label": `${nft.location === "Vaulted" ? WITHDRAW_TO_EXTERNAL_WALLET_LABEL : "Send NFT"} ${getNFTDisplayName(nft, collection)}`,
              disabled: isNFTListed(nft),
              hidden: isNFTListed(nft),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "w-3 h-3" }),
                nft.location === "Vaulted" ? "Withdraw" : "Send"
              ]
            }
          )
        ] }, nft.id.toString())) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          RegisterNFTModal,
          {
            open: registerOpen,
            onClose: () => setRegisterOpen(false),
            collection
          }
        ),
        sendNft && /* @__PURE__ */ jsxRuntimeExports.jsx(
          SendNFTModal,
          {
            open: !!sendNft,
            onClose: () => setSendNft(null),
            nft: sendNft,
            collection
          }
        ),
        detailNft && /* @__PURE__ */ jsxRuntimeExports.jsx(
          NFTDetailsModal,
          {
            open: !!detailNft,
            onClose: () => setDetailNft(null),
            nft: detailNft,
            collection,
            trustStatus,
            isListed: isNFTListed(detailNft),
            dividendE8s: dividendBalances.get(
              nftKey(detailNft.collectionId, detailNft.tokenId)
            ) ?? 0n,
            onReport: () => onReportNFT(collection, detailNft),
            onSend: isNFTListed(detailNft) ? void 0 : () => {
              setDetailNft(null);
              setSendNft(detailNft);
            }
          }
        )
      ]
    }
  );
}
function WalletPage() {
  var _a;
  const {
    isAuthenticated,
    isLoading: authLoading,
    login,
    principal,
    principalText
  } = useAuth();
  const { actor, isFetching } = useBackend();
  const { isAdmin } = useAdmin();
  const queryClient = useQueryClient();
  const bootstrappedRef = reactExports.useRef(false);
  const autoSyncedPrincipalRef = reactExports.useRef(null);
  const syncInFlightRef = reactExports.useRef(null);
  const syncModeRef = reactExports.useRef(null);
  const syncScopeRef = reactExports.useRef(null);
  const syncResumeCursorRef = reactExports.useRef(null);
  const [importSpecificOpen, setImportSpecificOpen] = reactExports.useState(false);
  const [preferredImportCollectionId, setPreferredImportCollectionId] = reactExports.useState(null);
  const [preferredImportTokenId, setPreferredImportTokenId] = reactExports.useState(null);
  const [indexingCollectionId, setIndexingCollectionId] = reactExports.useState(null);
  const [nftActivityOpen, setNftActivityOpen] = reactExports.useState(false);
  const [mintComposerOpen, setMintComposerOpen] = reactExports.useState(false);
  const [mintComposerFocusRequestId, setMintComposerFocusRequestId] = reactExports.useState(0);
  const [requestedMintTarget, setRequestedMintTarget] = reactExports.useState(
    null
  );
  reactExports.useEffect(() => {
    if (isAuthenticated && actor && !isFetching && !bootstrappedRef.current) {
      bootstrappedRef.current = true;
      actor.bootstrapAdmin().then(() => {
        queryClient.invalidateQueries({ queryKey: ["isAdmin"] });
        queryClient.invalidateQueries({ queryKey: ["adminPrincipal"] });
      }).catch(() => {
      });
    }
  }, [isAuthenticated, actor, isFetching, queryClient]);
  const {
    data: userNFTPages,
    isLoading: nftsLoading,
    refetch: refetchNFTs,
    fetchNextPage: fetchNextNFTPage,
    hasNextPage: hasMoreNFTs,
    isFetchingNextPage: isFetchingMoreNFTs
  } = useInfiniteQuery({
    queryKey: ["userNFTs", "walletPages", principalText],
    initialPageParam: null,
    queryFn: async ({ pageParam }) => {
      if (!actor || !principal) {
        return { nfts: [], nextCursor: null, totalCount: 0n };
      }
      return actor.getUserNFTsPage(principal, pageParam, WALLET_NFT_PAGE_SIZE);
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? void 0,
    enabled: !!actor && !isFetching && isAuthenticated && !!principal
  });
  const userNFTs = (userNFTPages == null ? void 0 : userNFTPages.pages.flatMap((page) => page.nfts)) ?? [];
  const userNFTTotalCount = ((_a = userNFTPages == null ? void 0 : userNFTPages.pages[0]) == null ? void 0 : _a.totalCount) ?? BigInt(userNFTs.length);
  const userStats = buildLoadedNFTStats(userNFTs, userNFTTotalCount);
  const statsLoading = nftsLoading;
  const { data: collectionPages } = useInfiniteQuery({
    queryKey: ["collections", "walletPages"],
    initialPageParam: null,
    queryFn: async ({ pageParam }) => {
      if (!actor) {
        return { collections: [], nextCursor: null, totalCount: 0n };
      }
      return actor.listCollectionsPage(pageParam, WALLET_COLLECTION_PAGE_SIZE);
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? void 0,
    enabled: !!actor && !isFetching && isAuthenticated
  });
  const collections = (collectionPages == null ? void 0 : collectionPages.pages.flatMap((page) => page.collections)) ?? [];
  const { data: collectionImportMetas = [] } = useQuery(
    {
      queryKey: ["collectionImportMetas", "wallet"],
      queryFn: async () => {
        if (!actor) return [];
        const page = await actor.listCollectionImportMetasPage(null, 100n);
        return page.metas;
      },
      enabled: !!actor && !isFetching && isAuthenticated
    }
  );
  const { data: accountIdBytes } = useQuery({
    queryKey: ["userAccountId", principalText],
    queryFn: async () => {
      if (!actor) throw new Error("No actor");
      return actor.getUserAccountId();
    },
    enabled: !!actor && !isFetching && isAuthenticated
  });
  const { data: mintConfig } = useQuery({
    queryKey: ["mintConfig"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMintConfig();
    },
    enabled: !!actor && !isFetching && isAuthenticated
  });
  const { data: moderationConfig } = useQuery({
    queryKey: ["moderationConfig"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getModerationConfig();
    },
    enabled: !!actor && !isFetching && isAuthenticated
  });
  const { data: myCreatedCollections = [] } = useQuery({
    queryKey: ["myCreatedCollections", principalText],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyCreatedCollections();
    },
    enabled: !!actor && !isFetching && isAuthenticated
  });
  const { data: activeListingDetails = [] } = useQuery({
    queryKey: [
      "activeListingDetails",
      "wallet",
      WALLET_LISTING_PAGE_SIZE.toString()
    ],
    queryFn: async () => {
      if (!actor) return [];
      const page = await actor.getActiveListingDetailsPage(
        null,
        WALLET_LISTING_PAGE_SIZE
      );
      return page.details;
    },
    enabled: !!actor && !isFetching && isAuthenticated
  });
  const { data: myDividendNFTs = [] } = useQuery({
    queryKey: [
      "myDividendNFTs",
      "wallet",
      principalText,
      WALLET_DIVIDEND_PAGE_SIZE.toString()
    ],
    queryFn: async () => {
      if (!actor) return [];
      const page = await actor.getMyDividendNFTsPage(
        null,
        WALLET_DIVIDEND_PAGE_SIZE
      );
      return page.dividends;
    },
    enabled: !!actor && !isFetching && isAuthenticated,
    refetchOnWindowFocus: false,
    staleTime: 6e4
  });
  const {
    data: recentNFTTransactions = [],
    isLoading: nftTransactionsLoading
  } = useQuery({
    queryKey: ["recent-nft-transactions", principalText],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyRecentNFTTransactions(10n);
    },
    enabled: !!actor && !isFetching && isAuthenticated && nftActivityOpen,
    refetchOnWindowFocus: false
  });
  const accountIdHex = accountIdBytes ? accountIdToHex(accountIdBytes) : null;
  const listedNFTKeys = new Set(
    activeListingDetails.filter((detail) => {
      const seller = detail.listing.__kind__ === "Fixed" ? detail.listing.Fixed.seller : detail.listing.Auction.seller;
      return principal ? seller.toString() === principal.toString() : false;
    }).map((detail) => nftKey(detail.nft.collectionId, detail.nft.tokenId))
  );
  const collectionMap = /* @__PURE__ */ new Map();
  for (const c of collections ?? []) {
    collectionMap.set(c.id, c);
  }
  const mainCollectionId = (mintConfig == null ? void 0 : mintConfig.collectionId) ?? null;
  const mainCollection = mainCollectionId == null ? null : collectionMap.get(mainCollectionId) ?? null;
  const importMetaMap = collectionMetaMap(collectionImportMetas);
  const indexingCollection = indexingCollectionId == null ? null : collectionMap.get(indexingCollectionId) ?? null;
  const myCreatedCollectionIds = new Set(
    myCreatedCollections.map((collection) => collection.id)
  );
  const dividendBalances = new Map(
    myDividendNFTs.map((item) => [
      nftKey(item.nft.collectionId, item.nft.tokenId),
      item.claimableE8s
    ])
  );
  const nftsByCollection = /* @__PURE__ */ new Map();
  for (const nft of userNFTs ?? []) {
    const existing = nftsByCollection.get(nft.collectionId) ?? [];
    existing.push(nft);
    nftsByCollection.set(nft.collectionId, existing);
  }
  const collectionEntries = [];
  nftsByCollection.forEach((nfts, collId) => {
    const coll = collectionMap.get(collId);
    if (coll) {
      collectionEntries.push({
        collection: coll,
        trustStatus: collectionTrustStatus(
          coll,
          importMetaMap.get(coll.id.toString())
        ),
        nfts
      });
    }
  });
  const verifiedCollectionEntries = collectionEntries.filter(
    ({ collection }) => isMintlabVerifiedCollection(
      collection,
      importMetaMap.get(collection.id.toString())
    )
  );
  const communityCollectionEntries = collectionEntries.filter(
    ({ collection }) => !isMintlabVerifiedCollection(
      collection,
      importMetaMap.get(collection.id.toString())
    )
  );
  const hasNFTs = ((userNFTs == null ? void 0 : userNFTs.length) ?? 0) > 0;
  const dataLoading = nftsLoading || statsLoading || isFetching;
  const { mutate: reportWalletNFT } = useMutation({
    mutationFn: async ({
      collection,
      nft
    }) => {
      if (!actor) throw new Error("Backend not connected");
      const result = await actor.reportNFT(
        collection.id,
        nft.tokenId,
        `Wallet report for ${getNFTTokenLabel(nft, collection)} in ${collection.name}`
      );
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      ue.success("Report sent to Mintlab admins.");
      void queryClient.invalidateQueries({
        queryKey: ["collectionImportMetas"]
      });
      void queryClient.invalidateQueries({ queryKey: ["nftReportMetas"] });
      void queryClient.invalidateQueries({ queryKey: ["collections"] });
      void queryClient.invalidateQueries({
        queryKey: ["activeListingDetails"]
      });
    },
    onError: (err) => ue.error(`Report failed: ${err.message}`)
  });
  function handleReportWalletNFT(collection, nft) {
    reportWalletNFT({ collection, nft });
  }
  const [syncStatus, setSyncStatus] = reactExports.useState({ kind: "idle" });
  reactExports.useEffect(() => {
    if (syncStatus.kind === "ok" || syncStatus.kind === "upToDate" || syncStatus.kind === "error") {
      const id = setTimeout(
        () => setSyncStatus({ kind: "idle" }),
        SYNC_FINISHED_STATUS_CLEAR_MS
      );
      return () => clearTimeout(id);
    }
  }, [syncStatus]);
  const handleSync = reactExports.useCallback(
    async (options = {}) => {
      if (!actor) return;
      const silent = options.silent === true;
      const targetCollectionId = options.collectionId ?? null;
      const requestedMode = silent ? "silent" : "manual";
      const requestedScope = targetCollectionId === null ? "all" : `collection:${targetCollectionId.toString()}:hints:${(options.tokenHints ?? []).map((hint) => hint.trim()).filter(Boolean).join("|")}`;
      if (!silent) setSyncStatus({ kind: "syncing" });
      const runWalletSync = async () => {
        if (targetCollectionId !== null) {
          const targetCollection = (collections == null ? void 0 : collections.find(
            (collection) => collection.id === targetCollectionId
          )) ?? null;
          const collectionName = (targetCollection == null ? void 0 : targetCollection.name) ?? "Selected collection";
          const tokenHints = options.tokenHints ?? [];
          if (typeof actor.syncUserNFTsForCollectionV2 === "function") {
            const progressPromise = actor.syncUserNFTsForCollectionV2(
              targetCollectionId,
              tokenHints,
              TARGET_SYNC_INDEX_PAGE_LIMIT
            );
            let progressResult;
            try {
              progressResult = await withTimeout(
                progressPromise,
                SYNC_TIMEOUT_MS,
                SYNC_PAGE_TIMEOUT_MESSAGE
              );
            } catch (err) {
              const message = extractError(err);
              if (message !== SYNC_PAGE_TIMEOUT_MESSAGE) {
                throw err;
              }
              void progressPromise.then(() => {
                void refetchNFTs();
                void queryClient.invalidateQueries({
                  queryKey: ["userStats"]
                });
              }).catch((lateError) => {
              });
              return {
                __kind__: "ok",
                ok: {
                  newCount: 0n,
                  errors: [],
                  skipped: [
                    {
                      collectionId: targetCollectionId,
                      collectionName,
                      reason: "INDEXING_IN_PROGRESS",
                      message: SYNC_PAGE_TIMEOUT_MESSAGE
                    }
                  ]
                }
              };
            }
            if (progressResult.__kind__ === "err") {
              return progressResult;
            }
            const skipped3 = [...progressResult.ok.skipped];
            if (!progressResult.ok.complete && skipped3.length === 0) {
              const directHintOnly = progressResult.ok.directHintChecked && progressResult.ok.scannedThisRun === 0n && progressResult.ok.indexedThisRun === 0n;
              skipped3.push({
                collectionId: targetCollectionId,
                collectionName,
                reason: directHintOnly ? "TOKEN_HINT_CHECKED" : "INDEXING_IN_PROGRESS",
                message: directHintOnly ? "Mintlab checked that token ID directly. The wider collection index is still not complete." : "Mintlab saved selected sync progress for this collection. Click Sync selected again to continue, or enter a known token ID."
              });
            }
            return {
              __kind__: "ok",
              ok: {
                newCount: progressResult.ok.newCount,
                errors: progressResult.ok.errors,
                skipped: skipped3,
                progress: progressResult.ok
              }
            };
          }
          if (typeof actor.syncUserNFTsForCollection !== "function") {
            return {
              __kind__: "err",
              err: "Targeted collection sync is not available in this build."
            };
          }
          const pagePromise = actor.syncUserNFTsForCollection(
            targetCollectionId,
            TARGET_SYNC_INDEX_PAGE_LIMIT
          );
          let page;
          try {
            page = await withTimeout(
              pagePromise,
              SYNC_TIMEOUT_MS,
              SYNC_PAGE_TIMEOUT_MESSAGE
            );
          } catch (err) {
            const message = extractError(err);
            if (message !== SYNC_PAGE_TIMEOUT_MESSAGE) {
              throw err;
            }
            void pagePromise.then(() => {
              void refetchNFTs();
              void queryClient.invalidateQueries({ queryKey: ["userStats"] });
            }).catch((lateError) => {
            });
            return {
              __kind__: "ok",
              ok: {
                newCount: 0n,
                errors: [],
                skipped: [
                  {
                    collectionId: targetCollectionId,
                    collectionName,
                    reason: "INDEXING_IN_PROGRESS",
                    message: SYNC_PAGE_TIMEOUT_MESSAGE
                  }
                ]
              }
            };
          }
          if (page.__kind__ === "err") {
            return page;
          }
          const skipped2 = [...page.ok.skipped];
          if (!page.ok.complete && skipped2.length === 0) {
            skipped2.push({
              collectionId: targetCollectionId,
              collectionName,
              reason: "INDEXING_IN_PROGRESS",
              message: "Mintlab saved targeted sync progress for this collection. Click Sync selected again to continue."
            });
          }
          return {
            __kind__: "ok",
            ok: {
              newCount: page.ok.newCount,
              errors: page.ok.errors,
              skipped: skipped2
            }
          };
        }
        if (typeof actor.syncUserNFTsPage !== "function") {
          syncResumeCursorRef.current = null;
          return actor.syncUserNFTsV2();
        }
        let cursor = syncResumeCursorRef.current;
        let newCount = 0n;
        let errors = [];
        let skipped = [];
        let pages = 0;
        let complete = false;
        while (pages < MAX_SYNC_PAGES_PER_CLICK) {
          pages += 1;
          const pagePromise = actor.syncUserNFTsPage(
            cursor,
            SYNC_PAGE_COLLECTION_LIMIT
          );
          let page;
          try {
            page = await withTimeout(
              pagePromise,
              SYNC_TIMEOUT_MS,
              SYNC_PAGE_TIMEOUT_MESSAGE
            );
          } catch (err) {
            const message = extractError(err);
            if (message !== SYNC_PAGE_TIMEOUT_MESSAGE) {
              throw err;
            }
            void pagePromise.then(() => {
              void refetchNFTs();
              void queryClient.invalidateQueries({ queryKey: ["userStats"] });
            }).catch((lateError) => {
            });
            syncResumeCursorRef.current = cursor;
            return {
              __kind__: "ok",
              ok: {
                newCount,
                errors,
                skipped: [
                  ...skipped,
                  {
                    collectionId: 0n,
                    collectionName: "Wallet sync",
                    reason: "INDEXING_IN_PROGRESS",
                    message: SYNC_PAGE_TIMEOUT_MESSAGE
                  }
                ]
              }
            };
          }
          if (page.__kind__ === "err") {
            if (newCount > 0n || errors.length > 0 || skipped.length > 0) {
              syncResumeCursorRef.current = cursor;
              return {
                __kind__: "ok",
                ok: {
                  newCount,
                  errors: [...errors, page.err],
                  skipped
                }
              };
            }
            return page;
          }
          newCount += page.ok.newCount;
          errors = [...errors, ...page.ok.errors];
          skipped = [...skipped, ...page.ok.skipped];
          void refetchNFTs();
          void queryClient.invalidateQueries({ queryKey: ["userStats"] });
          if (page.ok.complete || page.ok.nextCursor === null) {
            complete = true;
            syncResumeCursorRef.current = null;
            break;
          }
          cursor = page.ok.nextCursor;
          syncResumeCursorRef.current = cursor;
        }
        if (!complete) {
          skipped = [
            ...skipped,
            {
              collectionId: 0n,
              collectionName: "Wallet sync",
              reason: "INDEXING_IN_PROGRESS",
              message: "Mintlab checked several wallet sync pages and saved progress. Click Sync again to continue from the next collection."
            }
          ];
        }
        return {
          __kind__: "ok",
          ok: { newCount, errors, skipped }
        };
      };
      const applySyncResult = (result) => {
        if (result.__kind__ === "err") {
          if (isSyncAlreadyRunningMessage(result.err)) {
            if (!silent) {
              setSyncStatus({
                kind: "partial",
                newCount: 0,
                message: "A previous wallet sync is still finishing on-chain. Mintlab refreshed your wallet; try Sync again shortly.",
                errors: [],
                skipped: []
              });
              ue("Wallet sync is already running", {
                description: "Mintlab refreshed your wallet while the previous on-chain check finishes. Known token ID imports still work immediately."
              });
            }
            return;
          }
          if (!silent) {
            setSyncStatus({ kind: "error", message: result.err });
            ue.error(`Sync failed: ${result.err}`);
          }
          return;
        }
        const newCount = Number(result.ok.newCount);
        const syncErrors = result.ok.errors.filter(
          (message) => message.trim().length > 0
        );
        const syncSkipped = result.ok.skipped.filter(
          (item) => item.collectionName.trim().length > 0
        );
        const indexingSkipped = syncSkipped.filter(isAutoIndexingSkip);
        const setupSkipped = syncSkipped.filter(
          (item) => !isAutoIndexingSkip(item)
        );
        const onlyAutoIndexing = syncSkipped.length > 0 && setupSkipped.length === 0;
        if (syncErrors.length > 0) {
          console.warn("[syncUserNFTs] collection errors:", syncErrors);
        }
        if (syncErrors.length > 0 || syncSkipped.length > 0) {
          const warningMessage = summarizeSyncAttention(
            syncErrors,
            syncSkipped
          );
          if (!silent) {
            setSyncStatus({
              kind: "partial",
              newCount,
              message: warningMessage,
              errors: syncErrors,
              skipped: syncSkipped,
              progress: result.ok.progress ?? null
            });
            if (newCount > 0) {
              ue.success(
                newCount === 1 ? "Synced - 1 new NFT found and registered" : `Synced - ${newCount} new NFTs found and registered`,
                {
                  description: syncSkipped.length > 0 ? onlyAutoIndexing ? `${indexingSkipped.length} collection(s) are still indexing automatically.` : `${setupSkipped.length} collection(s) need selected sync or a token ID.` : "Some collections could not be checked."
                }
              );
            } else if (syncErrors.length === 0 && syncSkipped.length > 0) {
              ue(
                onlyAutoIndexing ? "Wallet sync is indexing imported collections" : "Wallet sync complete",
                {
                  description: onlyAutoIndexing ? "Automatic discovery is catching up in small batches. Click Sync again shortly, or import a known token ID directly." : `${setupSkipped.length} collection(s) need selected sync from the collection menu, or a direct token ID import.`
                }
              );
            } else {
              ue("Sync finished with collection warnings", {
                description: warningMessage
              });
            }
          }
          return;
        }
        if (newCount > 0) {
          if (!silent) {
            setSyncStatus({ kind: "ok", newCount });
            ue.success(
              newCount === 1 ? "Synced - 1 new NFT found and registered!" : `Synced - ${newCount} new NFTs found and registered!`
            );
          }
        } else if (!silent) {
          setSyncStatus({ kind: "upToDate" });
          ue.success("Wallet is up to date");
        }
      };
      const existingSync = syncInFlightRef.current;
      const canReuseExistingSync = existingSync !== null && syncModeRef.current === requestedMode && syncScopeRef.current === requestedScope;
      const startedNewSync = !canReuseExistingSync;
      let rawSyncPromise;
      let syncPromise;
      if (canReuseExistingSync) {
        rawSyncPromise = existingSync;
      } else {
        rawSyncPromise = runWalletSync();
        syncInFlightRef.current = rawSyncPromise;
        syncModeRef.current = requestedMode;
        syncScopeRef.current = requestedScope;
      }
      syncPromise = rawSyncPromise;
      let slowNoticeId;
      let refreshId;
      let keepRefreshUntilRawSettles = false;
      if (!silent) {
        slowNoticeId = window.setTimeout(() => {
          setSyncStatus({ kind: "syncing", slow: true });
        }, SYNC_SLOW_NOTICE_MS);
      }
      if (startedNewSync) {
        refreshId = window.setInterval(() => {
          void refetchNFTs();
          void queryClient.invalidateQueries({ queryKey: ["userStats"] });
        }, SYNC_REFRESH_INTERVAL_MS);
      }
      try {
        const result = await syncPromise;
        applySyncResult(result);
      } catch (err) {
        const msg = extractError(err);
        if (msg === SYNC_STILL_RUNNING_MESSAGE) {
          keepRefreshUntilRawSettles = true;
          if (!silent) {
            setSyncStatus({ kind: "syncing", slow: true });
            ue("Wallet sync is still running", {
              description: "Mintlab will keep refreshing your wallet while automatic indexing catches up. Importing a known token ID still works immediately."
            });
          }
          rawSyncPromise.then((result) => applySyncResult(result)).catch((lateError) => {
            const lateMessage = extractError(lateError);
            if (isAgentProcessingTimeoutMessage(lateMessage)) {
              if (!silent) {
                setSyncStatus({
                  kind: "partial",
                  newCount: 0,
                  message: "Wallet sync is still processing on-chain. Mintlab refreshed your wallet and you can try Sync again shortly.",
                  errors: [],
                  skipped: []
                });
                ue("Wallet sync is still processing on-chain", {
                  description: "Mintlab refreshed your wallet. New NFTs may appear after the backend finishes the in-progress check."
                });
              }
              return;
            }
            console.warn("[syncUserNFTs] late sync failed:", lateError);
            if (!silent) {
              setSyncStatus({ kind: "error", message: lateMessage });
              ue.error(`Sync failed: ${lateMessage}`);
            }
          }).finally(() => {
            if (refreshId !== void 0) {
              window.clearInterval(refreshId);
            }
            if (syncInFlightRef.current === rawSyncPromise) {
              syncInFlightRef.current = null;
              syncModeRef.current = null;
              syncScopeRef.current = null;
            }
            void refetchNFTs();
            void queryClient.invalidateQueries({ queryKey: ["userStats"] });
          });
          return;
        }
        if (!silent) {
          setSyncStatus({ kind: "error", message: msg });
          ue.error(`Sync error: ${msg}`);
        }
      } finally {
        if (slowNoticeId !== void 0) {
          window.clearTimeout(slowNoticeId);
        }
        if (refreshId !== void 0 && !keepRefreshUntilRawSettles) {
          window.clearInterval(refreshId);
        }
        if (!keepRefreshUntilRawSettles && syncInFlightRef.current === rawSyncPromise) {
          syncInFlightRef.current = null;
          syncModeRef.current = null;
          syncScopeRef.current = null;
        }
        if (!keepRefreshUntilRawSettles) {
          void refetchNFTs();
          void queryClient.invalidateQueries({ queryKey: ["userStats"] });
        }
      }
    },
    [actor, collections, queryClient, refetchNFTs]
  );
  const handleSyncCollection = reactExports.useCallback(
    (collectionId, tokenHints = []) => {
      void handleSync({ collectionId, tokenHints });
    },
    [handleSync]
  );
  const openImportSpecificNFT = reactExports.useCallback(
    (collectionId, tokenId) => {
      setPreferredImportCollectionId(collectionId ?? null);
      setPreferredImportTokenId((tokenId == null ? void 0 : tokenId.trim()) || null);
      setImportSpecificOpen(true);
    },
    []
  );
  const closeImportSpecificNFT = reactExports.useCallback(() => {
    setImportSpecificOpen(false);
    setPreferredImportCollectionId(null);
    setPreferredImportTokenId(null);
  }, []);
  const openMainMintStudio = reactExports.useCallback(() => {
    setRequestedMintTarget("main");
    setMintComposerOpen(true);
    setMintComposerFocusRequestId((requestId) => requestId + 1);
  }, []);
  reactExports.useEffect(() => {
    if (!actor || !isAuthenticated || !principalText || isFetching || nftsLoading || !collections) {
      return;
    }
    if (autoSyncedPrincipalRef.current === principalText) return;
    autoSyncedPrincipalRef.current = principalText;
    void handleSync({ silent: true });
  }, [
    actor,
    collections,
    isAuthenticated,
    isFetching,
    nftsLoading,
    principalText,
    handleSync
  ]);
  if (!isAuthenticated && !authLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(UnauthHero, { login });
  }
  if (authLoading || isAuthenticated && dataLoading && !userNFTPages) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "px-4 md:px-8 py-8 space-y-8 max-w-7xl mx-auto",
        "data-ocid": "wallet.loading_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-48" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-16 w-44 rounded-xl" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-16 w-44 rounded-xl" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-36 w-full rounded-2xl" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px bg-border" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3", children: ["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "aspect-square rounded-xl" }, k)) })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "px-4 md:px-8 py-8 space-y-8 max-w-7xl mx-auto",
      "data-ocid": "wallet.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: -8 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.35 },
            className: "space-y-1",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-bold text-2xl md:text-3xl text-foreground", children: "My Wallet" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Your NFTs and account details" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatsBar, { stats: userStats, isLoading: statsLoading }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          ReceivingInstructions,
          {
            actor,
            principalText,
            accountIdHex,
            collections: collections ?? [],
            onSync: () => {
              void handleSync();
            },
            onSyncCollection: handleSyncCollection,
            onImportSpecificNFT: openImportSpecificNFT,
            onIndexCollection: isAdmin ? (collectionId) => setIndexingCollectionId(collectionId) : void 0,
            syncStatus
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          RecentNFTTransactionsCard,
          {
            transactions: recentNFTTransactions,
            isLoading: nftTransactionsLoading,
            open: nftActivityOpen,
            onOpenChange: setNftActivityOpen
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          ImportSpecificNFTModal,
          {
            open: importSpecificOpen,
            onClose: closeImportSpecificNFT,
            collections: collections ?? [],
            initialCollectionId: preferredImportCollectionId,
            initialTokenId: preferredImportTokenId
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          CollectionIndexingDialog,
          {
            open: indexingCollectionId != null,
            onClose: () => setIndexingCollectionId(null),
            collection: indexingCollection
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          MintComposer,
          {
            mintConfig: mintConfig ?? null,
            moderationConfig: moderationConfig ?? null,
            mainCollection,
            creatorCollections: myCreatedCollections,
            open: mintComposerOpen,
            onOpenChange: setMintComposerOpen,
            focusRequestId: mintComposerFocusRequestId,
            requestedTarget: requestedMintTarget
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px bg-border" }),
        !hasNFTs ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            EmptyState,
            {
              icon: Wallet,
              title: "No NFTs yet",
              description: "Register an NFT you received externally, import a supported collection, or create your own Mintlab collection first. Choose a collection in Sync to see the exact receive destination.",
              "data-ocid": "wallet.empty_state"
            }
          ),
          (collections ?? []).length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground text-center mb-4", children: "Supported collections — register an NFT from any of these:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2 justify-center", children: (collections ?? []).map((c, idx) => {
              const collectionImageUrl = resolveImageUrl(c.imageUrl);
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex items-center gap-2 bg-card border border-border rounded-full px-3 py-1.5 text-sm",
                  "data-ocid": `wallet.supported_collection.${idx + 1}`,
                  children: [
                    collectionImageUrl && /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "img",
                      {
                        src: collectionImageUrl,
                        alt: c.name,
                        className: "w-5 h-5 rounded-full border border-border/50 object-cover"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground truncate max-w-[140px]", children: c.name }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs text-muted-foreground", children: truncate(c.canisterId.toString(), 5, 3) })
                  ]
                },
                c.id.toString()
              );
            }) })
          ] })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-10", "data-ocid": "wallet.nft_list", children: [
          verifiedCollectionEntries.map(
            ({ collection, trustStatus, nfts }, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              CollectionSection,
              {
                collection,
                trustStatus,
                nfts,
                listedNFTKeys,
                sectionIndex: idx,
                isCreatorCollection: myCreatedCollectionIds.has(collection.id),
                isMainCollection: mainCollectionId != null && collection.id === mainCollectionId,
                dividendBalances,
                onMintInStudio: mainCollectionId != null && collection.id === mainCollectionId ? openMainMintStudio : void 0,
                onReportNFT: handleReportWalletNFT
              },
              collection.id.toString()
            )
          ),
          communityCollectionEntries.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "space-y-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-amber-500/30 bg-amber-500/10 p-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: "Unverified NFTs" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-xs leading-relaxed text-muted-foreground", children: [
                COMMUNITY_COLLECTION_NOTICE,
                " Treat names, images, and floor prices carefully, and report suspected counterfeits or unsafe content."
              ] })
            ] }),
            communityCollectionEntries.map(
              ({ collection, trustStatus, nfts }, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                CollectionSection,
                {
                  collection,
                  trustStatus,
                  nfts,
                  listedNFTKeys,
                  sectionIndex: verifiedCollectionEntries.length + idx,
                  isCreatorCollection: myCreatedCollectionIds.has(
                    collection.id
                  ),
                  isMainCollection: mainCollectionId != null && collection.id === mainCollectionId,
                  dividendBalances,
                  onMintInStudio: mainCollectionId != null && collection.id === mainCollectionId ? openMainMintStudio : void 0,
                  onReportNFT: handleReportWalletNFT
                },
                collection.id.toString()
              )
            )
          ] }),
          hasMoreNFTs && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center pt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              onClick: () => void fetchNextNFTPage(),
              disabled: isFetchingMoreNFTs,
              children: isFetchingMoreNFTs ? "Loading..." : "Load more NFTs"
            }
          ) })
        ] })
      ]
    }
  );
}
export {
  WalletPage as default
};
