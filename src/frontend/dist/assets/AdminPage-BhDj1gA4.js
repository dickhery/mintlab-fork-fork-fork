import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, a as cn, E as useNavigate, d as useAdmin, b as useBackend, e as useQueryClient, f as useQuery, F as Shield, g as ue, B as Button, P as Principal, A as AlertDialog, G as AlertDialogTrigger, t as AlertDialogContent, v as AlertDialogHeader, w as AlertDialogTitle, x as AlertDialogDescription, y as AlertDialogFooter, z as AlertDialogCancel, C as AlertDialogAction, D as Actor } from "./index-CHAGiUfU.js";
import { L as LoaderCircle, A as AppCanisterTopUpDialog, P as Plus, F as Fuel } from "./AppCanisterTopUpDialog-INRKw4mB.js";
import { S as Switch, r as recommendedCollectionCreationTopUpCycles, T as Trash2, C as CollectionCreationDiagnosticsPanel } from "./switch-D8xPATar.js";
import { B as Badge } from "./badge-DLVsPFRJ.js";
import { C as Card, a as CardHeader, b as CardTitle, d as CardDescription, R as RefreshCw, c as CardContent } from "./card-GqRq-vum.js";
import { I as Input } from "./input-Cln_5knP.js";
import { P as Primitive, u as useMutation, L as Label } from "./index-Ck2v8pAM.js";
import { L as Layers, e as ChevronDown, T as Textarea, S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem, E as ExternalLink, C as Check, I as Info } from "./textarea-XnWOJTBN.js";
import { S as Skeleton, C as Copy } from "./skeleton-BXDqQQtI.js";
import { r as resolveImageUrl, I as ImageOff } from "./media-ZaZcdkEj.js";
import { C as CircleAlert } from "./circle-alert-DPk_Njg3.js";
import { S as ShieldCheck } from "./shield-check-CVfPwLCX.js";
import "./index-DBalLeHY.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$4 = [
  [
    "path",
    {
      d: "M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2",
      key: "169zse"
    }
  ]
];
const Activity = createLucideIcon("activity", __iconNode$4);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m4.9 4.9 14.2 14.2", key: "1m5liu" }]
];
const Ban = createLucideIcon("ban", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["line", { x1: "10", x2: "10", y1: "15", y2: "9", key: "c1nkhi" }],
  ["line", { x1: "14", x2: "14", y1: "15", y2: "9", key: "h65svq" }]
];
const CirclePause = createLucideIcon("circle-pause", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49",
      key: "ct8e1f"
    }
  ],
  ["path", { d: "M14.084 14.158a3 3 0 0 1-4.242-4.242", key: "151rxh" }],
  [
    "path",
    {
      d: "M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143",
      key: "13bj9a"
    }
  ],
  ["path", { d: "m2 2 20 20", key: "1ooewy" }]
];
const EyeOff = createLucideIcon("eye-off", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["rect", { width: "20", height: "8", x: "2", y: "2", rx: "2", ry: "2", key: "ngkwjq" }],
  ["rect", { width: "20", height: "8", x: "2", y: "14", rx: "2", ry: "2", key: "iecqi9" }],
  ["line", { x1: "6", x2: "6.01", y1: "6", y2: "6", key: "16zg32" }],
  ["line", { x1: "6", x2: "6.01", y1: "18", y2: "18", key: "nzw8ys" }]
];
const Server = createLucideIcon("server", __iconNode);
var NAME = "Separator";
var DEFAULT_ORIENTATION = "horizontal";
var ORIENTATIONS = ["horizontal", "vertical"];
var Separator$1 = reactExports.forwardRef((props, forwardedRef) => {
  const { decorative, orientation: orientationProp = DEFAULT_ORIENTATION, ...domProps } = props;
  const orientation = isValidOrientation(orientationProp) ? orientationProp : DEFAULT_ORIENTATION;
  const ariaOrientation = orientation === "vertical" ? orientation : void 0;
  const semanticProps = decorative ? { role: "none" } : { "aria-orientation": ariaOrientation, role: "separator" };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Primitive.div,
    {
      "data-orientation": orientation,
      ...semanticProps,
      ...domProps,
      ref: forwardedRef
    }
  );
});
Separator$1.displayName = NAME;
function isValidOrientation(orientation) {
  return ORIENTATIONS.includes(orientation);
}
var Root = Separator$1;
function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Root,
    {
      "data-slot": "separator",
      decorative,
      orientation,
      className: cn(
        "bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
        className
      ),
      ...props
    }
  );
}
var define_process_env_default = {};
const E8S = 100000000n;
const MAX_MARKETPLACE_FEE_BASIS_POINTS = 9999n;
const PAYOUT_BASIS_POINTS_TOTAL = 10000n;
const APP_LOW_CYCLES_THRESHOLD = 1000000000000n;
const MIN_COLLECTION_CANISTER_CYCLES = 2000000000000n;
const MAX_ON_CHAIN_IMAGE_CHARS = 19e5;
const MODERATION_IMAGE_ACCEPT = "image/png,image/jpeg";
const COLLECTION_CREATION_REPAIR_GRACE_MS = 3 * 60 * 1e3;
const OPENAI_MODERATION_MODEL = "omni-moderation-latest";
const DEFAULT_MODERATION_MESSAGE = "Uploads cannot include sexual content, graphic violence, self-harm content, hateful or harassing text, or dangerous illegal instructions.";
const FRONTEND_CANISTER_ENV_KEYS = [
  "CANISTER_ID_FRONTEND",
  "CANISTER_FRONTEND_CANISTER_ID",
  "CANISTER_FRONTEND",
  "FRONTEND_CANISTER_ID"
];
const defaultModerationCategories = {
  nudityOrSexual: true,
  graphicViolence: true,
  explicitLanguage: false,
  hateOrHarassment: false,
  hateSymbols: false,
  illegalOrDangerous: false,
  selfHarm: false,
  otherNsfw: true
};
const moderationCategoryLabels = [
  { key: "nudityOrSexual", label: "Adult or sexual content" },
  { key: "graphicViolence", label: "Violence or injury" },
  { key: "selfHarm", label: "Self-harm content" },
  { key: "hateOrHarassment", label: "Hate or harassment text" },
  { key: "illegalOrDangerous", label: "Illicit instructions" },
  { key: "otherNsfw", label: "Other unsafe content" }
];
function truncatePrincipal(p) {
  if (p.length <= 24) return p;
  return `${p.slice(0, 10)}…${p.slice(-8)}`;
}
function makeStandard(raw, otherValue) {
  if (raw === "EXT") return { __kind__: "EXT", EXT: null };
  if (raw === "DIP721") return { __kind__: "DIP721", DIP721: null };
  if (raw === "ICRC7") return { __kind__: "ICRC7", ICRC7: null };
  return { __kind__: "Other", Other: otherValue };
}
function standardLabel(s) {
  if (s.__kind__ === "ICRC7") return "ICRC-7";
  return s.__kind__ === "Other" ? s.Other || "Other" : s.__kind__;
}
function standardVariant(s) {
  if (s.__kind__ === "EXT") return "default";
  if (s.__kind__ === "DIP721") return "secondary";
  if (s.__kind__ === "ICRC7") return "secondary";
  return "outline";
}
function collectionTrustLabel(status) {
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
      return "Needs range";
    case "Reported":
      return "Reported";
    case "CommunityImported":
      return "Community imported";
    default:
      return "Legacy external";
  }
}
function collectionTrustVariant(status) {
  if (status === "Verified") return "secondary";
  if (status === "Hidden" || status === "Blocked" || status === "Reported") {
    return "destructive";
  }
  return "outline";
}
function collectionCreationStatusLabel(status) {
  switch (status) {
    case "Started":
      return "Started";
    case "CyclePaymentSent":
      return "Payment sent";
    case "CyclesConverted":
      return "Cycles ready";
    case "AdminPayoutPending":
      return "Payout pending";
    case "AdminPayoutSent":
      return "Payout sent";
    case "CanisterCreated":
      return "Canister created";
    case "CollectionRegistered":
      return "Registered";
    case "Installed":
      return "Installed";
    case "Failed":
      return "Failed";
  }
}
function isRepairableCollectionCreationRequest(request) {
  if (request.status === "Installed") return false;
  if (request.status === "Failed" || request.lastError) return true;
  const updatedAtMs = Number(request.updatedAt / 1000000n);
  return Date.now() - updatedAtMs > COLLECTION_CREATION_REPAIR_GRACE_MS;
}
function isValidPrincipal(value) {
  try {
    Principal.fromText(value);
    return true;
  } catch {
    return false;
  }
}
function principalFromText(value) {
  const trimmed = value == null ? void 0 : value.trim();
  if (!trimmed || trimmed === "undefined" || !isValidPrincipal(trimmed)) {
    return null;
  }
  return Principal.fromText(trimmed);
}
function frontendCanisterIdFromHost() {
  if (typeof window === "undefined") return null;
  const host = window.location.hostname;
  const patterns = [
    /^([a-z0-9-]+)\.localhost$/i,
    /^([a-z0-9-]+)\.raw\.localhost$/i,
    /^([a-z0-9-]+)\.icp0\.io$/i,
    /^([a-z0-9-]+)\.raw\.icp0\.io$/i,
    /^([a-z0-9-]+)\.ic0\.app$/i,
    /^([a-z0-9-]+)\.raw\.ic0\.app$/i
  ];
  for (const pattern of patterns) {
    const match = host.match(pattern);
    if ((match == null ? void 0 : match[1]) && isValidPrincipal(match[1])) {
      return match[1];
    }
  }
  return null;
}
function getFrontendCanisterPrincipal() {
  const env = typeof process !== "undefined" ? define_process_env_default : {};
  for (const key of FRONTEND_CANISTER_ENV_KEYS) {
    const fromEnv = principalFromText(env[key]);
    if (fromEnv) return fromEnv;
  }
  return principalFromText(frontendCanisterIdFromHost());
}
const managementCanisterId = "aaaaa-aa";
const managementIdlFactory = ({ IDL }) => {
  const CanisterIdRecord = IDL.Record({ canister_id: IDL.Principal });
  const DefiniteCanisterSettings = IDL.Record({
    controllers: IDL.Vec(IDL.Principal),
    freezing_threshold: IDL.Nat,
    compute_allocation: IDL.Nat,
    memory_allocation: IDL.Nat,
    reserved_cycles_limit: IDL.Nat,
    log_visibility: IDL.Variant({
      controllers: IDL.Null,
      public: IDL.Null,
      allowed_viewers: IDL.Vec(IDL.Principal)
    }),
    wasm_memory_limit: IDL.Nat,
    wasm_memory_threshold: IDL.Nat
  });
  const CanisterStatusResult = IDL.Record({
    status: IDL.Variant({
      running: IDL.Null,
      stopping: IDL.Null,
      stopped: IDL.Null
    }),
    memory_size: IDL.Nat,
    cycles: IDL.Nat,
    settings: DefiniteCanisterSettings,
    module_hash: IDL.Opt(IDL.Vec(IDL.Nat8)),
    idle_cycles_burned_per_day: IDL.Nat
  });
  return IDL.Service({
    canister_status: IDL.Func([CanisterIdRecord], [CanisterStatusResult], [])
  });
};
async function getFrontendHealthWithAgent(agent, canisterId) {
  try {
    const management = Actor.createActor(managementIdlFactory, {
      agent,
      canisterId: managementCanisterId
    });
    const status = await management.canister_status({
      canister_id: canisterId
    });
    return {
      kind: "Frontend",
      canisterId,
      cycles: status.cycles,
      moduleInstalled: status.module_hash.length > 0,
      freezingThresholdSeconds: status.settings.freezing_threshold,
      idleCyclesBurnedPerDay: status.idle_cycles_burned_per_day,
      error: null
    };
  } catch {
    return null;
  }
}
function extractError(err) {
  if (err instanceof Error)
    return err.message || "An unexpected error occurred";
  if (typeof err === "string") return err;
  if (err !== null && typeof err === "object") {
    const obj = err;
    if (typeof obj.message === "string") return obj.message;
    try {
      return JSON.stringify(obj);
    } catch {
    }
  }
  return "An unexpected error occurred";
}
function accountIdToHex(bytes) {
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
}
function hexToAccountId(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = Number.parseInt(hex.slice(i, i + 2), 16);
  }
  return bytes;
}
function formatICP(e8s) {
  const whole = e8s / E8S;
  const frac = (e8s % E8S).toString().padStart(8, "0").replace(/0+$/, "");
  return frac ? `${whole}.${frac}` : whole.toString();
}
function formatMarketplaceFeePercent(basisPoints) {
  const whole = basisPoints / 100n;
  const frac = (basisPoints % 100n).toString().padStart(2, "0");
  const trimmedFrac = frac.replace(/0+$/, "");
  return trimmedFrac ? `${whole}.${trimmedFrac}` : whole.toString();
}
function formatPayoutPercent(basisPoints) {
  return formatMarketplaceFeePercent(basisPoints);
}
function formatCycles(cycles) {
  const trillion = 1000000000000n;
  if (cycles < trillion) return cycles.toString();
  const hundredths = cycles * 100n / trillion;
  const whole = hundredths / 100n;
  const frac = (hundredths % 100n).toString().padStart(2, "0");
  return `${whole}.${frac}T`;
}
function parseICPToE8s(value) {
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (!/^\d+(\.\d{0,8})?$/.test(trimmed)) return null;
  const [wholePart, fracPart = ""] = trimmed.split(".");
  return BigInt(wholePart) * E8S + BigInt(`${fracPart}00000000`.slice(0, 8));
}
function parseMarketplaceFeePercentToBasisPoints(value) {
  const trimmed = value.trim();
  if (!trimmed || !/^\d+(\.\d{0,2})?$/.test(trimmed)) return null;
  const [wholePart, fracPart = ""] = trimmed.split(".");
  const basisPoints = BigInt(wholePart) * 100n + BigInt(`${fracPart}00`.slice(0, 2));
  if (basisPoints === 0n || basisPoints > MAX_MARKETPLACE_FEE_BASIS_POINTS) {
    return null;
  }
  return basisPoints;
}
function parsePayoutPercentToBasisPoints(value) {
  const trimmed = value.trim();
  if (!trimmed || !/^\d+(\.\d{0,2})?$/.test(trimmed)) return null;
  const [wholePart, fracPart = ""] = trimmed.split(".");
  const basisPoints = BigInt(wholePart) * 100n + BigInt(`${fracPart}00`.slice(0, 2));
  if (basisPoints < 0n || basisPoints > PAYOUT_BASIS_POINTS_TOTAL) {
    return null;
  }
  return basisPoints;
}
function parseWholeBigInt(value) {
  const trimmed = value.trim().replace(/_/g, "");
  if (!trimmed || !/^\d+$/.test(trimmed)) return null;
  return BigInt(trimmed);
}
function parseOptionalNatInput(value) {
  const trimmed = value.trim().replace(/_/g, "");
  if (!trimmed) return null;
  if (!/^\d+$/.test(trimmed)) {
    throw new Error("Browse settings must be whole numbers");
  }
  return BigInt(trimmed);
}
function buildBrowseInfoFromInputs(totalSupply, tokenIndexOffset) {
  const parsedTotalSupply = parseOptionalNatInput(totalSupply);
  const parsedTokenIndexOffset = parseOptionalNatInput(tokenIndexOffset);
  if (parsedTotalSupply == null && parsedTokenIndexOffset == null) {
    return null;
  }
  return {
    totalSupply: parsedTotalSupply,
    tokenIndexOffset: parsedTokenIndexOffset
  };
}
function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Could not read image file"));
      }
    };
    reader.onerror = () => reject(new Error("Could not read image file"));
    reader.readAsDataURL(file);
  });
}
async function readImageFileAsDataUrl(file) {
  if (!isSupportedModerationImageFile(file)) {
    throw new Error("Choose a JPG or PNG image");
  }
  const dataUrl = await readFileAsDataUrl(file);
  if (dataUrl.length > MAX_ON_CHAIN_IMAGE_CHARS) {
    throw new Error("Uploaded image is too large for on-chain storage");
  }
  return dataUrl;
}
function isSupportedModerationImageFile(file) {
  return file.type === "image/png" || file.type === "image/jpeg" || /\.(png|jpe?g)$/i.test(file.name);
}
function readFileAsBytes(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result instanceof ArrayBuffer) {
        resolve(new Uint8Array(reader.result));
      } else {
        reject(new Error("Could not read WASM file"));
      }
    };
    reader.onerror = () => reject(new Error("Could not read WASM file"));
    reader.readAsArrayBuffer(file);
  });
}
function CopyButton({
  text,
  ariaLabel = "Copy value"
}) {
  const [copied, setCopied] = reactExports.useState(false);
  const copy = () => {
    void navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      type: "button",
      onClick: copy,
      "aria-label": ariaLabel,
      className: "ml-1 text-muted-foreground hover:text-foreground transition-colors",
      "data-ocid": "admin.copy_button",
      children: copied ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 13, className: "text-primary" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { size: 13 })
    }
  );
}
const GUIDE_STEPS = [
  {
    num: 1,
    title: "Get the Collection's Canister ID",
    body: "Every NFT collection on the Internet Computer has a unique Canister ID (looks like: ryjl3-tyaaa-aaaaa-aaaba-cai). Get this from the collection's official website or creator."
  },
  {
    num: 2,
    title: "Choose the Right NFT Standard",
    body: "EXT (Entrepot) is used by many older ICP collections, DIP721 is another common standard, and newer ledgers may expose ICRC-7. If unsure, check the collection's documentation. Choosing the wrong standard will cause transfer errors."
  },
  {
    num: 3,
    title: "Fill In the Form",
    body: "Enter the Canister ID, a display name, symbol, optional description and collection image, then select the NFT Standard and click Add Collection."
  },
  {
    num: 4,
    title: "Verify the Collection Works",
    body: "After adding, users with NFTs from that collection should be able to register them in their wallet using the token ID. If transfers fail, double-check the canister ID and NFT standard."
  }
];
function CollectionSetupGuide() {
  const [open, setOpen] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "rounded-2xl border border-primary/25 overflow-hidden bg-primary/3",
      "data-ocid": "admin.setup_guide",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            className: "w-full flex items-center justify-between gap-3 px-5 py-4 hover:bg-primary/5 transition-colors text-left",
            onClick: () => setOpen((v) => !v),
            "data-ocid": "admin.setup_guide.toggle",
            "aria-expanded": open,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-7 h-7 rounded-lg bg-primary/15 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { size: 15, className: "text-primary" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-semibold text-sm text-foreground", children: "How to Add NFT Collections" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Step-by-step setup guide for admins" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                ChevronDown,
                {
                  size: 16,
                  className: `text-muted-foreground transition-transform shrink-0 ${open ? "rotate-180" : ""}`
                }
              )
            ]
          }
        ),
        open && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 pb-5 space-y-5 border-t border-primary/15", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3 pt-4", children: GUIDE_STEPS.map((step) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-start gap-3",
              "data-ocid": `admin.setup_guide.step.${step.num}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-6 h-6 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center shrink-0 mt-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-primary", children: step.num }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground leading-snug", children: step.title }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed mt-0.5", children: step.body })
                ] })
              ]
            },
            step.num
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "bg-primary/15" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2.5 p-3 bg-destructive/5 border border-destructive/20 rounded-xl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              CircleAlert,
              {
                size: 15,
                className: "text-destructive shrink-0 mt-0.5"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-foreground", children: "Troubleshooting Transfer Errors" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed", children: "If users report transfer errors, verify:" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "text-xs text-muted-foreground space-y-0.5 list-none", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive/60 mt-0.5", children: "•" }),
                  "The canister ID is correct and the collection is deployed on mainnet."
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive/60 mt-0.5", children: "•" }),
                  "The NFT standard matches what the collection actually uses (EXT vs DIP721 vs ICRC-7)."
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive/60 mt-0.5", children: "•" }),
                  "The collection canister is accessible (not paused or private)."
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground leading-relaxed mt-1.5 pt-1.5 border-t border-destructive/10", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-foreground", children: "Note:" }),
                " Most collections on the",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "a",
                  {
                    href: "https://entrepot.app",
                    target: "_blank",
                    rel: "noopener noreferrer",
                    className: "text-primary underline underline-offset-2",
                    children: "Entrepot marketplace"
                  }
                ),
                " ",
                "use the",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-foreground", children: "EXT standard" }),
                ". Collections deployed independently may use DIP721 or ICRC-7."
              ] })
            ] })
          ] })
        ] })
      ]
    }
  );
}
function repairKindLabel(kind) {
  return kind === "Auction" ? "Auction" : "Fixed sale";
}
function RepairMetric({
  label,
  value,
  tone = "default"
}) {
  const valueClass = tone === "warning" ? "text-destructive" : tone === "success" ? "text-emerald-700" : "text-foreground";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border bg-background/60 p-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `font-mono text-sm mt-1 truncate ${valueClass}`, children: value })
  ] });
}
function MarketplaceEscrowRepairPanel() {
  const { actor } = useBackend();
  const [listingIdInput, setListingIdInput] = reactExports.useState("");
  const [quote, setQuote] = reactExports.useState(null);
  const [mintlabQuote, setMintlabQuote] = reactExports.useState(null);
  const quoteMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Backend not ready");
      const listingId = parseWholeBigInt(listingIdInput);
      if (listingId === null) throw new Error("Enter a valid listing ID");
      return actor.adminGetSettlementEscrowRepairQuote(listingId);
    },
    onSuccess: (result) => {
      setQuote(result);
      setMintlabQuote(null);
      if (result.shortfall === 0n) {
        ue.success("Settlement escrow is funded.");
      }
    },
    onError: (err) => {
      setQuote(null);
      ue.error(extractError(err));
    }
  });
  const mintlabRecoveryMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Backend not ready");
      const listingId = parseWholeBigInt(listingIdInput);
      if (listingId === null) throw new Error("Enter a valid listing ID");
      return actor.adminGetMintlabFeeRecoveryQuote(listingId);
    },
    onSuccess: (result) => {
      setMintlabQuote(result);
      ue.success("Mintlab fee recovery quote loaded.");
    },
    onError: (err) => {
      setMintlabQuote(null);
      ue.error(extractError(err));
    }
  });
  const resetMintlabFeeMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Backend not ready");
      const listingId = (mintlabQuote == null ? void 0 : mintlabQuote.listingId) ?? parseWholeBigInt(listingIdInput);
      if (listingId === null) throw new Error("Enter a valid listing ID");
      return actor.adminResetUnresolvedMintlabFeeAttempt(listingId);
    },
    onSuccess: (result) => {
      setMintlabQuote(result);
      ue.success("Mintlab fee attempt reset.");
      quoteMutation.mutate();
    },
    onError: (err) => {
      ue.error(extractError(err));
    }
  });
  const markMintlabFeeVerifiedMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Backend not ready");
      const listingId = (mintlabQuote == null ? void 0 : mintlabQuote.listingId) ?? parseWholeBigInt(listingIdInput);
      if (listingId === null) throw new Error("Enter a valid listing ID");
      return actor.adminMarkMintlabFeeBalanceVerified(listingId);
    },
    onSuccess: (result) => {
      setMintlabQuote(result);
      ue.success("Mintlab fee marked balance-verified.");
      quoteMutation.mutate();
    },
    onError: (err) => {
      ue.error(extractError(err));
    }
  });
  const topUpMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Backend not ready");
      if (!quote) throw new Error("Load a repair quote first");
      return actor.adminTopUpSettlementEscrow(quote.listingId, quote.shortfall);
    },
    onSuccess: (receipt) => {
      ue.success(
        `Escrow topped up with ${formatICP(receipt.amount)} ICP at block ${receipt.blockIndex.toString()}.`
      );
      quoteMutation.mutate();
    },
    onError: (err) => {
      ue.error(extractError(err));
    }
  });
  const retrySettlementMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Backend not ready");
      if (!quote) throw new Error("Load a repair quote first");
      if (quote.kind === "Auction") {
        await actor.adminRetryAuctionSettlement(quote.listingId);
      } else {
        await actor.adminRetryFixedPurchaseSettlement(quote.listingId);
      }
    },
    onSuccess: () => {
      ue.success("Settlement retry started.");
      quoteMutation.mutate();
    },
    onError: (err) => {
      ue.error(extractError(err));
    }
  });
  const retryNoBidReturnMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Backend not ready");
      const listingId = parseWholeBigInt(listingIdInput);
      if (listingId === null) throw new Error("Enter a valid listing ID");
      await actor.adminRetryNoBidAuctionReturn(listingId);
    },
    onSuccess: () => {
      ue.success("No-bid return retry started.");
    },
    onError: (err) => {
      ue.error(extractError(err));
    }
  });
  const retryListingReturnMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Backend not ready");
      const listingId = parseWholeBigInt(listingIdInput);
      if (listingId === null) throw new Error("Enter a valid listing ID");
      await actor.adminRetryListingReturn(listingId);
    },
    onSuccess: () => {
      ue.success("Listing return retry started.");
    },
    onError: (err) => {
      ue.error(extractError(err));
    }
  });
  const shortfallText = quote ? `${formatICP(quote.shortfall)} ICP` : "No quote";
  const topUpBlocked = !quote || quote.shortfall === 0n || quote.topUpFromBalance < quote.topUpTotalDebit || topUpMutation.isPending;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-amber-500/25 bg-card", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "space-y-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base", children: "Marketplace Escrow Repair" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { className: "text-xs", children: "Quote and fund settlement escrow shortfalls from the admin ICP account." })
      ] }),
      quote && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: quote.shortfall > 0n ? "destructive" : "secondary", children: quote.shortfall > 0n ? shortfallText : "Funded" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3 items-end", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "marketplace-escrow-repair-listing", children: "Listing ID" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "marketplace-escrow-repair-listing",
              inputMode: "numeric",
              value: listingIdInput,
              onChange: (event) => setListingIdInput(event.target.value),
              placeholder: "e.g. 12",
              "data-ocid": "admin.marketplace_repair.listing_input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap justify-start sm:justify-end gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              variant: "outline",
              className: "gap-2",
              disabled: quoteMutation.isPending,
              onClick: () => quoteMutation.mutate(),
              "data-ocid": "admin.marketplace_repair.quote_button",
              children: [
                quoteMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 15, className: "animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 15 }),
                "Load Quote"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              variant: "outline",
              className: "gap-2",
              disabled: mintlabRecoveryMutation.isPending,
              onClick: () => mintlabRecoveryMutation.mutate(),
              "data-ocid": "admin.marketplace_repair.mintlab_quote_button",
              children: [
                mintlabRecoveryMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 15, className: "animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { size: 15 }),
                "Mintlab Fee"
              ]
            }
          )
        ] })
      ] }),
      mintlabQuote && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 rounded-lg border border-amber-500/30 bg-amber-500/5 p-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            RepairMetric,
            {
              label: "Settlement",
              value: `${repairKindLabel(mintlabQuote.kind)} #${mintlabQuote.listingId.toString()}`
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            RepairMetric,
            {
              label: "Escrow balance",
              value: `${formatICP(mintlabQuote.escrowBalance)} ICP`
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            RepairMetric,
            {
              label: "Before fee debit",
              value: `${formatICP(mintlabQuote.expectedBeforeMintlabFeeDebit)} ICP`
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            RepairMetric,
            {
              label: "Before fee shortfall",
              value: `${formatICP(mintlabQuote.shortfallBeforeMintlabFee)} ICP`,
              tone: mintlabQuote.shortfallBeforeMintlabFee > 0n ? "warning" : "success"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            RepairMetric,
            {
              label: "After fee debit",
              value: `${formatICP(mintlabQuote.expectedAfterMintlabFeeDebit)} ICP`
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            RepairMetric,
            {
              label: "Mintlab fee",
              value: `${formatICP(mintlabQuote.mintlabFee)} ICP`
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            RepairMetric,
            {
              label: "Ledger fee",
              value: `${formatICP(mintlabQuote.ledgerFeeE8s)} ICP`
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border bg-background/60 p-3 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Settlement escrow account" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-xs text-foreground mt-1 break-all", children: [
              accountIdToHex(mintlabQuote.escrowAccount),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                CopyButton,
                {
                  text: accountIdToHex(mintlabQuote.escrowAccount),
                  ariaLabel: "Copy settlement escrow account"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border bg-background/60 p-3 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Mintlab fee recipient" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-xs text-foreground mt-1 break-all", children: [
              accountIdToHex(mintlabQuote.feeRecipient),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                CopyButton,
                {
                  text: accountIdToHex(mintlabQuote.feeRecipient),
                  ariaLabel: "Copy Mintlab fee recipient"
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap justify-end gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              variant: "secondary",
              className: "gap-2",
              disabled: resetMintlabFeeMutation.isPending,
              onClick: () => resetMintlabFeeMutation.mutate(),
              "data-ocid": "admin.marketplace_repair.mintlab_reset_button",
              children: [
                resetMintlabFeeMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 15, className: "animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 15 }),
                "Reset Fee Attempt"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              variant: "outline",
              className: "gap-2",
              disabled: markMintlabFeeVerifiedMutation.isPending,
              onClick: () => markMintlabFeeVerifiedMutation.mutate(),
              "data-ocid": "admin.marketplace_repair.mintlab_mark_verified_button",
              children: [
                markMintlabFeeVerifiedMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 15, className: "animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 15 }),
                "Mark Fee Verified"
              ]
            }
          )
        ] })
      ] }),
      quote && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            RepairMetric,
            {
              label: "Settlement",
              value: `${repairKindLabel(quote.kind)} #${quote.listingId.toString()}`
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            RepairMetric,
            {
              label: "Escrow balance",
              value: `${formatICP(quote.escrowBalance)} ICP`
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            RepairMetric,
            {
              label: "Required debit",
              value: `${formatICP(quote.requiredDebit)} ICP`
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            RepairMetric,
            {
              label: "Shortfall",
              value: shortfallText,
              tone: quote.shortfall > 0n ? "warning" : "success"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border bg-background/60 p-3 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Settlement escrow account" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-xs text-foreground mt-1 break-all", children: [
              accountIdToHex(quote.escrowAccount),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                CopyButton,
                {
                  text: accountIdToHex(quote.escrowAccount),
                  ariaLabel: "Copy settlement escrow account"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border bg-background/60 p-3 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Admin funding account" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-xs text-foreground mt-1 break-all", children: [
              accountIdToHex(quote.topUpFromAccount),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                CopyButton,
                {
                  text: accountIdToHex(quote.topUpFromAccount),
                  ariaLabel: "Copy admin funding account"
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            RepairMetric,
            {
              label: "Admin balance",
              value: `${formatICP(quote.topUpFromBalance)} ICP`,
              tone: quote.shortfall > 0n && quote.topUpFromBalance < quote.topUpTotalDebit ? "warning" : "default"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            RepairMetric,
            {
              label: "Top-up transfer fee",
              value: `${formatICP(quote.topUpTransferFeeE8s)} ICP`
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            RepairMetric,
            {
              label: "Admin total debit",
              value: `${formatICP(quote.topUpTotalDebit)} ICP`
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap justify-end gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              variant: "outline",
              className: "gap-2",
              disabled: !quote || retrySettlementMutation.isPending,
              onClick: () => retrySettlementMutation.mutate(),
              "data-ocid": "admin.marketplace_repair.retry_button",
              children: [
                retrySettlementMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 15, className: "animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 15 }),
                "Retry Settlement"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              variant: "secondary",
              className: "gap-2",
              disabled: topUpBlocked,
              onClick: () => topUpMutation.mutate(),
              "data-ocid": "admin.marketplace_repair.top_up_button",
              children: [
                topUpMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 15, className: "animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Fuel, { size: 15 }),
                "Top Up Shortfall"
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap justify-end gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            type: "button",
            variant: "outline",
            className: "gap-2",
            disabled: retryNoBidReturnMutation.isPending,
            onClick: () => retryNoBidReturnMutation.mutate(),
            "data-ocid": "admin.marketplace_repair.retry_no_bid_return_button",
            children: [
              retryNoBidReturnMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 15, className: "animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 15 }),
              "Retry No-Bid Return"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            type: "button",
            variant: "outline",
            className: "gap-2",
            disabled: retryListingReturnMutation.isPending,
            onClick: () => retryListingReturnMutation.mutate(),
            "data-ocid": "admin.marketplace_repair.retry_listing_return_button",
            children: [
              retryListingReturnMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 15, className: "animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 15 }),
              "Retry Listing Return"
            ]
          }
        )
      ] })
    ] })
  ] });
}
function CollectionRow({
  collection,
  importMeta,
  index,
  onRemove
}) {
  var _a, _b, _c, _d;
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  const [imgError, setImgError] = reactExports.useState(false);
  const [totalSupply, setTotalSupply] = reactExports.useState(
    ((_b = (_a = collection.browseInfo) == null ? void 0 : _a.totalSupply) == null ? void 0 : _b.toString()) ?? ""
  );
  const [tokenIndexOffset, setTokenIndexOffset] = reactExports.useState(
    ((_d = (_c = collection.browseInfo) == null ? void 0 : _c.tokenIndexOffset) == null ? void 0 : _d.toString()) ?? ""
  );
  const pid = collection.canisterId.toString();
  const imageUrl = resolveImageUrl(collection.imageUrl);
  const isExternalCollection = collection.kind === "External";
  const browseMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Backend not ready");
      const result = await actor.updateCollectionBrowseInfo(
        collection.id,
        buildBrowseInfoFromInputs(totalSupply, tokenIndexOffset)
      );
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["collections"] });
      void queryClient.invalidateQueries({
        queryKey: ["allCollectionBrowseStats"]
      });
      ue.success("Collection browse settings updated.");
    },
    onError: (err) => {
      ue.error(`Failed to update browse settings: ${extractError(err)}`);
    }
  });
  const trustMutation = useMutation({
    mutationFn: async (status) => {
      if (!actor) throw new Error("Backend not ready");
      const result = await (async () => {
        switch (status) {
          case "Verified":
            return actor.adminVerifyCollection(collection.id);
          case "Hidden":
            return actor.adminHideCollection(collection.id);
          case "Blocked":
            return actor.adminBlockCollection(collection.id);
          case "SyncDisabled":
            return actor.adminDisableCollectionSync(collection.id);
          case "NeedsBrowseInfo":
            return actor.adminMarkCollectionNeedsBrowseInfo(collection.id);
          default:
            return actor.adminHideCollection(collection.id);
        }
      })();
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["collections"] });
      void queryClient.invalidateQueries({
        queryKey: ["collectionImportMetas"]
      });
      ue.success("Collection trust status updated.");
    },
    onError: (err) => {
      ue.error(`Failed to update trust status: ${extractError(err)}`);
    }
  });
  reactExports.useEffect(() => {
    var _a2, _b2, _c2, _d2;
    setTotalSupply(((_b2 = (_a2 = collection.browseInfo) == null ? void 0 : _a2.totalSupply) == null ? void 0 : _b2.toString()) ?? "");
    setTokenIndexOffset(
      ((_d2 = (_c2 = collection.browseInfo) == null ? void 0 : _c2.tokenIndexOffset) == null ? void 0 : _d2.toString()) ?? ""
    );
  }, [collection.browseInfo]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "space-y-3 rounded-xl border border-border bg-card px-4 py-3 hover:bg-muted/30 transition-colors",
      "data-ocid": `admin.collection.item.${index}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0 flex items-center justify-center", children: !imgError && imageUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: imageUrl,
              alt: collection.name,
              className: "w-full h-full object-cover",
              onError: () => setImgError(true)
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx(ImageOff, { size: 18, className: "text-muted-foreground" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0 space-y-0.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-sm text-foreground truncate", children: collection.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: collection.kind === "Minted" ? "secondary" : "outline",
                  className: "text-[10px] shrink-0",
                  children: collection.kind === "Minted" ? "Minted" : "External"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: standardVariant(collection.standard),
                  className: "text-xs shrink-0",
                  children: standardLabel(collection.standard)
                }
              ),
              isExternalCollection && /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: collectionTrustVariant(importMeta == null ? void 0 : importMeta.trustStatus),
                  className: "text-xs shrink-0",
                  children: collectionTrustLabel(importMeta == null ? void 0 : importMeta.trustStatus)
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground font-mono truncate flex items-center gap-1", children: [
              truncatePrincipal(pid),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CopyButton, { text: pid })
            ] }),
            collection.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground line-clamp-1", children: collection.description })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:block text-xs font-mono font-semibold text-muted-foreground px-2 py-1 rounded bg-muted shrink-0", children: collection.symbol }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialog, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "ghost",
                size: "icon",
                className: "text-destructive hover:bg-destructive/10 shrink-0",
                "data-ocid": `admin.collection.delete_button.${index}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 15 })
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { "data-ocid": "admin.remove_collection.dialog", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Remove Collection?" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogDescription, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: collection.name }),
                  " will be removed from the platform. Existing registered NFTs from this collection won't be deleted but new registrations won't be possible."
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { "data-ocid": "admin.remove_collection.cancel_button", children: "Cancel" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  AlertDialogAction,
                  {
                    className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                    onClick: () => onRemove(collection.id),
                    "data-ocid": "admin.remove_collection.confirm_button",
                    children: "Remove"
                  }
                )
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-2 border-t border-border pt-3 sm:grid-cols-[1fr_1fr_auto]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              inputMode: "numeric",
              placeholder: "Collection size",
              value: totalSupply,
              onChange: (event) => setTotalSupply(event.target.value),
              className: "h-8 text-xs",
              "data-ocid": `admin.collection.browse_total_supply.${index}`
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              inputMode: "numeric",
              placeholder: "First token index",
              value: tokenIndexOffset,
              onChange: (event) => setTokenIndexOffset(event.target.value),
              className: "h-8 text-xs",
              "data-ocid": `admin.collection.browse_token_offset.${index}`
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "sm",
              variant: "secondary",
              className: "gap-2",
              onClick: () => browseMutation.mutate(),
              disabled: browseMutation.isPending,
              "data-ocid": `admin.collection.browse_save.${index}`,
              children: [
                browseMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 14, className: "animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 14 }),
                "Save Range"
              ]
            }
          )
        ] }),
        isExternalCollection && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2 border-t border-border pt-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "sm",
              variant: "secondary",
              className: "gap-2",
              onClick: () => trustMutation.mutate("Verified"),
              disabled: trustMutation.isPending,
              "data-ocid": `admin.collection.verify.${index}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { size: 14 }),
                "Verify"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "sm",
              variant: "outline",
              className: "gap-2",
              onClick: () => trustMutation.mutate("NeedsBrowseInfo"),
              disabled: trustMutation.isPending,
              "data-ocid": `admin.collection.needs_range.${index}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { size: 14 }),
                "Needs Range"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "sm",
              variant: "outline",
              className: "gap-2",
              onClick: () => trustMutation.mutate("SyncDisabled"),
              disabled: trustMutation.isPending,
              "data-ocid": `admin.collection.sync_disabled.${index}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CirclePause, { size: 14 }),
                "Disable Sync"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "sm",
              variant: "outline",
              className: "gap-2",
              onClick: () => trustMutation.mutate("Hidden"),
              disabled: trustMutation.isPending,
              "data-ocid": `admin.collection.hide.${index}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { size: 14 }),
                "Hide"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "sm",
              variant: "destructive",
              className: "gap-2",
              onClick: () => trustMutation.mutate("Blocked"),
              disabled: trustMutation.isPending,
              "data-ocid": `admin.collection.block.${index}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Ban, { size: 14 }),
                "Block"
              ]
            }
          )
        ] })
      ]
    }
  );
}
function CollectionCreationRequestRow({
  request,
  onRepair,
  onRetry,
  onClose,
  onTopUp,
  repairPending,
  retryPending,
  deletePending
}) {
  const { actor, isFetching } = useBackend();
  const { data: diagnosticsResult, isLoading: isDiagnosticsLoading } = useQuery(
    {
      queryKey: ["collectionCreationDiagnostics", request.id.toString()],
      queryFn: async () => {
        if (!actor) {
          return { __kind__: "err", err: "Backend not ready" };
        }
        return actor.getCollectionCreationDiagnostics(request.id);
      },
      enabled: !!actor && !isFetching,
      refetchInterval: 2e4
    }
  );
  const diagnostics = (diagnosticsResult == null ? void 0 : diagnosticsResult.__kind__) === "ok" ? diagnosticsResult.ok : null;
  const diagnosticsError = (diagnosticsResult == null ? void 0 : diagnosticsResult.__kind__) === "err" ? diagnosticsResult.err : null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border bg-background/60 p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-foreground", children: request.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "text-[11px]", children: [
            "#",
            request.id.toString()
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "text-[11px]", children: collectionCreationStatusLabel(request.status) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: request.cyclePaymentBlock != null ? `ICP block ${request.cyclePaymentBlock.toString()}` : "No cycle payment block yet" }),
        request.lastError && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-amber-700 dark:text-amber-200", children: request.lastError })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            size: "sm",
            variant: "outline",
            onClick: onRepair,
            disabled: repairPending,
            "data-ocid": `admin.collection_creation.repair.${request.id.toString()}`,
            children: "Repair"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            size: "sm",
            variant: "secondary",
            onClick: onRetry,
            disabled: retryPending || request.status === "Installed",
            "data-ocid": `admin.collection_creation.retry.${request.id.toString()}`,
            children: "Retry"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialog, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              size: "sm",
              variant: "ghost",
              className: "text-destructive hover:bg-destructive/10",
              disabled: deletePending,
              "data-ocid": `admin.collection_creation.delete.${request.id.toString()}`,
              children: "Close"
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Close setup request?" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { children: "Paid requests without a recovered collection are protected by the backend and must be recovered or manually settled before they can be closed." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { children: "Cancel" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                AlertDialogAction,
                {
                  className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                  onClick: onClose,
                  children: "Close"
                }
              )
            ] })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      CollectionCreationDiagnosticsPanel,
      {
        diagnostics,
        error: diagnosticsError,
        isLoading: isDiagnosticsLoading,
        onTopUp
      }
    )
  ] }) });
}
function CollectionCreationRequestsPanel() {
  const { actor, isFetching } = useBackend();
  const queryClient = useQueryClient();
  const [topUpReason, setTopUpReason] = reactExports.useState(null);
  const [topUpInitialCycles, setTopUpInitialCycles] = reactExports.useState(
    null
  );
  const { data: requestResult, isLoading } = useQuery({
    queryKey: ["allCollectionCreationRequests"],
    queryFn: async () => {
      if (!actor) return { __kind__: "ok", ok: [] };
      return actor.getAllCollectionCreationRequests();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 2e4
  });
  const requests = (requestResult == null ? void 0 : requestResult.__kind__) === "ok" ? requestResult.ok : [];
  const visibleRequests = reactExports.useMemo(
    () => requests.filter(isRepairableCollectionCreationRequest),
    [requests]
  );
  const requestError = (requestResult == null ? void 0 : requestResult.__kind__) === "err" ? requestResult.err : null;
  const repairMutation = useMutation({
    mutationFn: async (requestId) => {
      if (!actor) throw new Error("Backend not ready");
      const result = await actor.repairCollectionCreationRequest(requestId);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["allCollectionCreationRequests"]
      });
      void queryClient.invalidateQueries({
        queryKey: ["collectionCreationDiagnostics"]
      });
      ue.success("Collection setup request repaired.");
    },
    onError: (err) => {
      ue.error(`Repair failed: ${extractError(err)}`);
    }
  });
  const retryMutation = useMutation({
    mutationFn: async (requestId) => {
      if (!actor) throw new Error("Backend not ready");
      const repair = await actor.repairCollectionCreationRequest(requestId);
      if (repair.__kind__ === "err") throw new Error(repair.err);
      const result = await actor.retryCollectionCreationRequest(requestId);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (receipt) => {
      void queryClient.invalidateQueries({ queryKey: ["collections"] });
      void queryClient.invalidateQueries({
        queryKey: ["allCollectionCreationRequests"]
      });
      void queryClient.invalidateQueries({
        queryKey: ["collectionCreationDiagnostics"]
      });
      void queryClient.invalidateQueries({
        queryKey: ["myCollectionCreationRequests"]
      });
      ue.success(`${receipt.collection.name} setup completed.`);
    },
    onError: (err) => {
      ue.error(`Retry failed: ${extractError(err)}`);
    }
  });
  const deleteMutation = useMutation({
    mutationFn: async (requestId) => {
      if (!actor) throw new Error("Backend not ready");
      const result = await actor.adminDeleteCollectionCreationRequest(requestId);
      if (result.__kind__ === "err") throw new Error(result.err);
      if (!result.ok) throw new Error("Request could not be deleted");
      return requestId;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["allCollectionCreationRequests"]
      });
      void queryClient.invalidateQueries({
        queryKey: ["collectionCreationDiagnostics"]
      });
      void queryClient.invalidateQueries({
        queryKey: ["myCollectionCreationRequests"]
      });
      ue.success("Collection setup request closed.");
    },
    onError: (err) => {
      ue.error(`Close failed: ${extractError(err)}`);
    }
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border bg-card", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base", children: "Collection Setup Requests" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { className: "text-sm", children: "Repair or retry saved collection creation attempts without charging the creator again." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-3", children: [
      requestError && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive", children: requestError }),
      isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: [1, 2].map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-20 rounded-xl" }, item)) }) : visibleRequests.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "rounded-lg border border-border bg-muted/20 p-3 text-sm text-muted-foreground", children: "No collection setup requests need attention." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: visibleRequests.map((request) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        CollectionCreationRequestRow,
        {
          request,
          onRepair: () => repairMutation.mutate(request.id),
          onRetry: () => retryMutation.mutate(request.id),
          onClose: () => deleteMutation.mutate(request.id),
          onTopUp: (diagnostics) => {
            setTopUpReason(
              `The app backend needs more cycles before it can attach ${formatCycles(
                diagnostics.createCallCycles
              )} cycles to create request #${request.id.toString()}.`
            );
            setTopUpInitialCycles(
              recommendedCollectionCreationTopUpCycles(diagnostics)
            );
          },
          repairPending: repairMutation.isPending,
          retryPending: retryMutation.isPending,
          deletePending: deleteMutation.isPending
        },
        request.id.toString()
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      AppCanisterTopUpDialog,
      {
        open: topUpReason != null,
        reason: topUpReason,
        initialCycles: topUpInitialCycles,
        onOpenChange: (open) => {
          if (!open) {
            setTopUpReason(null);
            setTopUpInitialCycles(null);
          }
        },
        onSuccess: () => {
          void queryClient.invalidateQueries({
            queryKey: ["appCanisterHealth"]
          });
          void queryClient.invalidateQueries({
            queryKey: ["collectionCreationDiagnostics"]
          });
        }
      }
    )
  ] });
}
function AppHealthSection() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  const frontendCanister = reactExports.useMemo(getFrontendCanisterPrincipal, []);
  const frontendCanisterText = (frontendCanister == null ? void 0 : frontendCanister.toString()) ?? null;
  const [topUpTarget, setTopUpTarget] = reactExports.useState(
    null
  );
  const {
    data: healthResult,
    isLoading,
    isFetching
  } = useQuery({
    queryKey: ["appCanisterHealth", frontendCanisterText],
    queryFn: async () => {
      if (!actor) return { __kind__: "ok", ok: [] };
      const result = await actor.getAppCanisterHealth(frontendCanister);
      if (!frontendCanister || result.__kind__ === "err") return result;
      const frontendHealth = await getFrontendHealthWithAgent(
        actor.getAgent(),
        frontendCanister
      );
      if (!frontendHealth) return result;
      return {
        __kind__: "ok",
        ok: [
          ...result.ok.filter((item) => item.kind !== "Frontend"),
          frontendHealth
        ]
      };
    },
    enabled: !!actor,
    staleTime: 12e4
  });
  const health = (healthResult == null ? void 0 : healthResult.__kind__) === "ok" ? healthResult.ok : [];
  const healthError = (healthResult == null ? void 0 : healthResult.__kind__) === "err" ? healthResult.err : null;
  const hasFrontendHealth = health.some((item) => item.kind === "Frontend");
  const refreshHealth = () => {
    void queryClient.invalidateQueries({ queryKey: ["appCanisterHealth"] });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-primary/20 bg-card", "data-ocid": "admin.app_health", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "space-y-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-start justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-base flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { size: 16, className: "text-primary" }),
          "App Health"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { className: "text-xs", children: "Frontend and backend canister IDs, cycle balances, and top-ups." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "button",
          variant: "outline",
          size: "sm",
          onClick: refreshHealth,
          disabled: isFetching,
          className: "gap-2",
          "data-ocid": "admin.app_health.refresh_button",
          children: [
            isFetching ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 14, className: "animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 14 }),
            "Refresh"
          ]
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-3", children: [
      healthError && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { size: 15, className: "mt-0.5 shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: healthError })
      ] }),
      isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-40 rounded-xl" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-40 rounded-xl" })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3", children: [
        health.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          AppHealthCanisterPanel,
          {
            health: item,
            onTopUp: setTopUpTarget
          },
          `${item.kind}-${item.canisterId.toString()}`
        )),
        !frontendCanisterText && /* @__PURE__ */ jsxRuntimeExports.jsx(MissingFrontendCanisterPanel, {}),
        frontendCanisterText && !hasFrontendHealth && /* @__PURE__ */ jsxRuntimeExports.jsx(MissingFrontendCanisterPanel, { canisterId: frontendCanisterText })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      AppCanisterTopUpDialog,
      {
        open: topUpTarget !== null,
        targetCanisterId: (topUpTarget == null ? void 0 : topUpTarget.canisterId.toString()) ?? null,
        targetLabel: topUpTarget ? `${topUpTarget.kind} canister` : "App canister",
        onOpenChange: (open) => {
          if (!open) setTopUpTarget(null);
        },
        onSuccess: refreshHealth
      }
    )
  ] });
}
function AppHealthCanisterPanel({
  health,
  onTopUp
}) {
  const lowCycles = health.cycles !== null && health.cycles < APP_LOW_CYCLES_THRESHOLD;
  const icon = health.kind === "Backend" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Server, { size: 15, className: "text-primary" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { size: 15, className: "text-primary" });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-muted/20 p-4 space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center", children: icon }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-semibold text-foreground", children: [
            health.kind,
            " Canister"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: health.moduleInstalled === false ? "No module installed" : "Module installed" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: lowCycles ? "destructive" : "secondary", children: lowCycles ? "Low cycles" : "Ready" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs uppercase tracking-wider text-muted-foreground", children: "Canister ID" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs break-all text-foreground", children: health.canisterId.toString() }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CopyButton, { text: health.canisterId.toString() })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border bg-background/60 p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Cycle balance" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-sm text-foreground mt-1", children: health.cycles === null ? "Unavailable" : formatCycles(health.cycles) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border bg-background/60 p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Daily burn" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-sm text-foreground mt-1", children: health.idleCyclesBurnedPerDay === null ? "Unavailable" : formatCycles(health.idleCyclesBurnedPerDay) })
        ] })
      ] }),
      health.error && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 rounded-lg border border-amber-500/20 bg-amber-500/10 p-3 text-xs text-amber-700 dark:text-amber-300", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { size: 14, className: "mt-0.5 shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: health.error })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Button,
      {
        type: "button",
        variant: "secondary",
        className: "w-full gap-2",
        onClick: () => onTopUp(health),
        "data-ocid": `admin.app_health.${health.kind.toLowerCase()}_top_up_button`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Fuel, { size: 15 }),
          "Top Up"
        ]
      }
    )
  ] });
}
function MissingFrontendCanisterPanel({ canisterId }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-dashed border-border bg-muted/10 p-4 space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-muted flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { size: 15, className: "text-muted-foreground" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: "Frontend Canister" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: canisterId ?? "Canister ID unavailable" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Frontend cycle balance appears when the deployed asset canister ID is available." })
  ] });
}
function MintConfigForm() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  const [name, setName] = reactExports.useState("");
  const [symbol, setSymbol] = reactExports.useState("");
  const [description, setDescription] = reactExports.useState("");
  const [imageUrl, setImageUrl] = reactExports.useState("");
  const [imageFileName, setImageFileName] = reactExports.useState("");
  const [collectionCreationPayout, setCollectionCreationPayout] = reactExports.useState("");
  const [
    collectionCreationSecondaryPayout,
    setCollectionCreationSecondaryPayout
  ] = reactExports.useState("");
  const [
    collectionCreationPrimaryPayoutPercent,
    setCollectionCreationPrimaryPayoutPercent
  ] = reactExports.useState("100");
  const [
    collectionCreationSecondaryPayoutPercent,
    setCollectionCreationSecondaryPayoutPercent
  ] = reactExports.useState("0");
  const [collectionCreationPrice, setCollectionCreationPrice] = reactExports.useState("");
  const [collectionCreationEnabled, setCollectionCreationEnabled] = reactExports.useState(false);
  const [mainMintPayout, setMainMintPayout] = reactExports.useState("");
  const [mainMintPrice, setMainMintPrice] = reactExports.useState("");
  const [mainMintEnabled, setMainMintEnabled] = reactExports.useState(false);
  const [marketplaceFeePayout, setMarketplaceFeePayout] = reactExports.useState("");
  const [marketplaceFeePercent, setMarketplaceFeePercent] = reactExports.useState("");
  const [marketplaceFeeInitialized, setMarketplaceFeeInitialized] = reactExports.useState(false);
  const [mainMintDividendsEnabled, setMainMintDividendsEnabled] = reactExports.useState(false);
  const [collectionCanisterCycles, setCollectionCanisterCycles] = reactExports.useState("1000000000000");
  const [wasmBytes, setWasmBytes] = reactExports.useState(null);
  const [wasmFileName, setWasmFileName] = reactExports.useState("");
  const [initialized, setInitialized] = reactExports.useState(false);
  const [moderationEnabled, setModerationEnabled] = reactExports.useState(false);
  const [moderationApiKey, setModerationApiKey] = reactExports.useState("");
  const [clearModerationApiKey, setClearModerationApiKey] = reactExports.useState(false);
  const [moderationMessage, setModerationMessage] = reactExports.useState(
    DEFAULT_MODERATION_MESSAGE
  );
  const [moderationCategories, setModerationCategories] = reactExports.useState(defaultModerationCategories);
  const [moderationInitialized, setModerationInitialized] = reactExports.useState(false);
  const { data: mintConfig, isLoading: mintConfigLoading } = useQuery({
    queryKey: ["mintConfig"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMintConfig();
    },
    enabled: !!actor
  });
  const { data: collections } = useQuery({
    queryKey: ["collections"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listCollections();
    },
    enabled: !!actor
  });
  const { data: marketplaceFeeConfig, isLoading: marketplaceFeeLoading } = useQuery({
    queryKey: ["marketplaceFeeConfig"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMarketplaceFeeConfig();
    },
    enabled: !!actor
  });
  const { data: moderationConfig, isLoading: moderationConfigLoading } = useQuery({
    queryKey: ["moderationConfig"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getModerationConfig();
    },
    enabled: !!actor
  });
  const parsedCreationPriceE8s = parseICPToE8s(collectionCreationPrice);
  const parsedCollectionCanisterCycles = parseWholeBigInt(
    collectionCanisterCycles
  );
  const parsedPrimaryPayoutBasisPoints = parsePayoutPercentToBasisPoints(
    collectionCreationPrimaryPayoutPercent
  );
  const parsedSecondaryPayoutBasisPoints = parsePayoutPercentToBasisPoints(
    collectionCreationSecondaryPayoutPercent
  );
  const payoutPercentagesValid = parsedPrimaryPayoutBasisPoints !== null && parsedSecondaryPayoutBasisPoints !== null && parsedPrimaryPayoutBasisPoints + parsedSecondaryPayoutBasisPoints === PAYOUT_BASIS_POINTS_TOTAL;
  const canQuoteCreationCost = !!actor && parsedCreationPriceE8s !== null && parsedCollectionCanisterCycles !== null && payoutPercentagesValid;
  const {
    data: creationQuote,
    error: creationQuoteError,
    isFetching: creationQuoteFetching
  } = useQuery({
    queryKey: [
      "collectionCreationQuote",
      collectionCreationPrice.trim(),
      collectionCanisterCycles.trim(),
      collectionCreationPrimaryPayoutPercent.trim(),
      collectionCreationSecondaryPayoutPercent.trim()
    ],
    queryFn: async () => {
      if (!actor || parsedCreationPriceE8s === null || parsedCollectionCanisterCycles === null || parsedPrimaryPayoutBasisPoints === null || parsedSecondaryPayoutBasisPoints === null) {
        return null;
      }
      return actor.quoteCollectionCreationCost(
        parsedCollectionCanisterCycles,
        parsedCreationPriceE8s,
        parsedPrimaryPayoutBasisPoints,
        parsedSecondaryPayoutBasisPoints
      );
    },
    enabled: canQuoteCreationCost,
    staleTime: 6e4
  });
  const creationPriceBelowCycles = !!creationQuote && parsedCreationPriceE8s !== null && parsedCreationPriceE8s < creationQuote.minimumCreationPriceE8s;
  const mainCollection = (mintConfig == null ? void 0 : mintConfig.collectionId) ? collections == null ? void 0 : collections.find(
    (collection) => collection.id === mintConfig.collectionId
  ) : null;
  const dedicatedMintlabCollections = (collections == null ? void 0 : collections.filter(
    (collection) => collection.kind === "Minted" && collection.id !== (mintConfig == null ? void 0 : mintConfig.collectionId)
  )) ?? [];
  reactExports.useEffect(() => {
    var _a;
    if (initialized || !mintConfig) return;
    setName((mainCollection == null ? void 0 : mainCollection.name) ?? "");
    setSymbol((mainCollection == null ? void 0 : mainCollection.symbol) ?? "");
    setDescription((mainCollection == null ? void 0 : mainCollection.description) ?? "");
    setImageUrl((mainCollection == null ? void 0 : mainCollection.imageUrl) ?? "");
    setImageFileName((mainCollection == null ? void 0 : mainCollection.imageUrl) ? "Current image" : "");
    setCollectionCreationPayout(
      mintConfig.collectionCreationPayoutAccount ? accountIdToHex(mintConfig.collectionCreationPayoutAccount) : ""
    );
    setCollectionCreationSecondaryPayout(
      mintConfig.collectionCreationSecondaryPayoutAccount ? accountIdToHex(mintConfig.collectionCreationSecondaryPayoutAccount) : ""
    );
    setCollectionCreationPrimaryPayoutPercent(
      formatPayoutPercent(
        mintConfig.collectionCreationPrimaryPayoutBasisPoints
      )
    );
    setCollectionCreationSecondaryPayoutPercent(
      formatPayoutPercent(
        mintConfig.collectionCreationSecondaryPayoutBasisPoints
      )
    );
    setCollectionCreationPrice(
      mintConfig.collectionCreationPriceE8s > 0n ? formatICP(mintConfig.collectionCreationPriceE8s) : "0"
    );
    setCollectionCreationEnabled(mintConfig.collectionCreationEnabled);
    setMainMintPayout(
      mintConfig.mainMintPayoutAccount ? accountIdToHex(mintConfig.mainMintPayoutAccount) : ""
    );
    setMainMintPrice(
      mintConfig.mainMintPriceE8s > 0n ? formatICP(mintConfig.mainMintPriceE8s) : "0"
    );
    setMainMintEnabled(mintConfig.mainMintEnabled);
    setMainMintDividendsEnabled(
      ((_a = mainCollection == null ? void 0 : mainCollection.dividendConfig) == null ? void 0 : _a.enabled) === true
    );
    setCollectionCanisterCycles(mintConfig.collectionCanisterCycles.toString());
    setInitialized(true);
  }, [initialized, mintConfig, mainCollection]);
  reactExports.useEffect(() => {
    if (moderationInitialized || !moderationConfig) return;
    setModerationEnabled(moderationConfig.enabled);
    setModerationMessage(
      moderationConfig.userMessage || DEFAULT_MODERATION_MESSAGE
    );
    setModerationCategories(moderationConfig.categories);
    setModerationInitialized(true);
  }, [moderationInitialized, moderationConfig]);
  reactExports.useEffect(() => {
    if (marketplaceFeeInitialized || !marketplaceFeeConfig) return;
    setMarketplaceFeePayout(
      marketplaceFeeConfig.mintlabFeeRecipient ? accountIdToHex(marketplaceFeeConfig.mintlabFeeRecipient) : ""
    );
    setMarketplaceFeePercent(
      formatMarketplaceFeePercent(marketplaceFeeConfig.mintlabFeeBasisPoints)
    );
    setMarketplaceFeeInitialized(true);
  }, [marketplaceFeeInitialized, marketplaceFeeConfig]);
  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Backend not ready");
      if (!name.trim()) throw new Error("Main collection name is required");
      if (!symbol.trim()) throw new Error("Main collection symbol is required");
      if (!description.trim())
        throw new Error("Main collection description is required");
      if (!imageUrl) throw new Error("Upload a main collection image");
      const creationPriceE8s = parseICPToE8s(collectionCreationPrice);
      const mainMintPriceE8s = parseICPToE8s(mainMintPrice);
      const cycles = parseWholeBigInt(collectionCanisterCycles);
      const primaryPayoutBasisPoints = parsePayoutPercentToBasisPoints(
        collectionCreationPrimaryPayoutPercent
      );
      const secondaryPayoutBasisPoints = parsePayoutPercentToBasisPoints(
        collectionCreationSecondaryPayoutPercent
      );
      if (creationPriceE8s === null)
        throw new Error("Collection creation fee must be a valid ICP amount");
      if (mainMintPriceE8s === null)
        throw new Error("Main mint price must be a valid ICP amount");
      if (cycles === null)
        throw new Error("Collection canister cycles must be a whole number");
      if (primaryPayoutBasisPoints === null || secondaryPayoutBasisPoints === null || primaryPayoutBasisPoints + secondaryPayoutBasisPoints !== PAYOUT_BASIS_POINTS_TOTAL) {
        throw new Error(
          "Collection creation payout percentages must add up to 100%"
        );
      }
      if (collectionCreationEnabled && creationQuote && creationPriceE8s < creationQuote.minimumCreationPriceE8s) {
        throw new Error(
          `Collection creation fee must be at least ${formatICP(
            creationQuote.minimumCreationPriceE8s
          )} ICP at the current cycles rate`
        );
      }
      const primaryPayoutRequired = creationQuote ? creationQuote.adminPrimaryPayoutE8s > 0n : creationPriceE8s > 0n && primaryPayoutBasisPoints > 0n;
      const secondaryPayoutRequired = creationQuote ? creationQuote.adminSecondaryPayoutE8s > 0n || secondaryPayoutBasisPoints > 0n : secondaryPayoutBasisPoints > 0n;
      const creationPayout = primaryPayoutRequired ? validateAccountId(collectionCreationPayout, "collection creation") : null;
      const secondaryCreationPayout = secondaryPayoutRequired ? validateAccountId(
        collectionCreationSecondaryPayout,
        "secondary collection creation"
      ) : null;
      const mintPayout = mainMintPriceE8s > 0n ? validateAccountId(mainMintPayout, "main mint") : null;
      return actor.configureMinting(
        name.trim(),
        description.trim(),
        symbol.trim().toUpperCase(),
        imageUrl,
        creationPayout,
        secondaryCreationPayout,
        primaryPayoutBasisPoints,
        secondaryPayoutBasisPoints,
        creationPriceE8s,
        collectionCreationEnabled,
        mintPayout,
        mainMintPriceE8s,
        mainMintEnabled,
        mainMintDividendsEnabled,
        cycles
      );
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["collections"] });
      void queryClient.invalidateQueries({ queryKey: ["mintConfig"] });
      ue.success("Mint settings saved");
    },
    onError: (err) => {
      ue.error(extractError(err));
    }
  });
  const marketplaceFeeMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Backend not ready");
      const recipient = validateAccountId(
        marketplaceFeePayout,
        "Mintlab sales fee"
      );
      const basisPoints = parseMarketplaceFeePercentToBasisPoints(
        marketplaceFeePercent
      );
      if (basisPoints === null) {
        throw new Error(
          "Marketplace sales fee must be between 0.01% and 99.99%"
        );
      }
      return actor.configureMarketplaceFee(recipient, basisPoints);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["marketplaceFeeConfig"]
      });
      ue.success("Marketplace fee saved");
    },
    onError: (err) => {
      ue.error(extractError(err));
    }
  });
  const wasmMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Backend not ready");
      if (!wasmBytes) throw new Error("Choose a collection canister WASM file");
      await actor.setCollectionCanisterWasm(wasmBytes);
    },
    onSuccess: () => {
      setWasmBytes(null);
      setWasmFileName("");
      void queryClient.invalidateQueries({ queryKey: ["mintConfig"] });
      ue.success("Collection canister WASM uploaded");
    },
    onError: (err) => {
      ue.error(extractError(err));
    }
  });
  const moderationMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Backend not ready");
      const apiKey = moderationApiKey.trim() || null;
      const model = OPENAI_MODERATION_MODEL;
      const message = moderationMessage.trim() || DEFAULT_MODERATION_MESSAGE;
      return actor.configureModeration(
        moderationEnabled,
        apiKey,
        clearModerationApiKey,
        model,
        moderationCategories,
        message
      );
    },
    onSuccess: () => {
      setModerationApiKey("");
      setClearModerationApiKey(false);
      void queryClient.invalidateQueries({ queryKey: ["moderationConfig"] });
      ue.success("Moderation settings saved");
    },
    onError: (err) => {
      ue.error(extractError(err));
    }
  });
  const upgradeDedicatedCollectionsMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Backend not ready");
      if (!(mintConfig == null ? void 0 : mintConfig.collectionCanisterWasmUploaded)) {
        throw new Error("Upload the latest collection canister WASM first");
      }
      let updated = 0;
      for (const collection of dedicatedMintlabCollections) {
        const result = await actor.upgradeCollectionCanister(collection.id);
        if (result.__kind__ === "err") {
          throw new Error(`${collection.name}: ${result.err}`);
        }
        updated += 1;
      }
      return updated;
    },
    onSuccess: (updated) => {
      void queryClient.invalidateQueries({ queryKey: ["collections"] });
      void queryClient.invalidateQueries({
        queryKey: ["myCollectionCanisterStatuses"]
      });
      ue.success(
        updated === 0 ? "No dedicated collection canisters to update" : `Updated ${updated} collection canister${updated === 1 ? "" : "s"}`
      );
    },
    onError: (err) => {
      ue.error(extractError(err));
    }
  });
  function validateAccountId(value, label) {
    const trimmed = value.trim();
    if (!/^[0-9a-fA-F]{64}$/.test(trimmed)) {
      throw new Error(`${label} payout account must be 64 hex characters`);
    }
    return hexToAccountId(trimmed);
  }
  async function handleImageFile(file) {
    if (!file) return;
    try {
      const dataUrl = await readImageFileAsDataUrl(file);
      setImageUrl(dataUrl);
      setImageFileName(file.name);
    } catch (err) {
      ue.error(extractError(err));
    }
  }
  async function handleWasmFile(file) {
    if (!file) {
      setWasmBytes(null);
      setWasmFileName("");
      return;
    }
    const bytes = await readFileAsBytes(file);
    setWasmBytes(bytes);
    setWasmFileName(`${file.name} (${Math.ceil(bytes.byteLength / 1024)} KB)`);
  }
  function setModerationCategory(key, value) {
    setModerationCategories((current) => ({ ...current, [key]: value }));
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-accent/20 bg-card", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "space-y-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base", children: "Mintlab Collections" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { className: "text-xs", children: "Configure the main app collection, user collection launch fees, mint fees, payout accounts, and child collection canister template." })
      ] }),
      mintConfigLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-24 rounded-full" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap justify-end gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Badge,
          {
            variant: collectionCreationEnabled ? "default" : "outline",
            children: collectionCreationEnabled ? "Creation on" : "Creation off"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: mainMintEnabled ? "default" : "outline", children: mainMintEnabled ? "Main mint on" : "Main mint off" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: moderationEnabled ? "secondary" : "outline", children: moderationEnabled ? "Moderation on" : "Moderation off" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Badge,
          {
            variant: (mintConfig == null ? void 0 : mintConfig.collectionCanisterWasmUploaded) ? "secondary" : "outline",
            children: (mintConfig == null ? void 0 : mintConfig.collectionCanisterWasmUploaded) ? "WASM ready" : "WASM needed"
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "mint-name", children: "Main collection name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "mint-name",
              value: name,
              onChange: (e) => setName(e.target.value),
              placeholder: "e.g. Vault Originals",
              "data-ocid": "admin.mint_config.name_input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "mint-symbol", children: "Main collection symbol" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "mint-symbol",
              value: symbol,
              onChange: (e) => setSymbol(e.target.value.toUpperCase()),
              placeholder: "e.g. VLT",
              "data-ocid": "admin.mint_config.symbol_input"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "mint-description", children: "Main collection description" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Textarea,
          {
            id: "mint-description",
            rows: 2,
            value: description,
            onChange: (e) => setDescription(e.target.value),
            placeholder: "Describe the app's main collection...",
            "data-ocid": "admin.mint_config.description_textarea"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 items-end", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "mint-image", children: "Main collection image" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "mint-image",
              type: "file",
              accept: MODERATION_IMAGE_ACCEPT,
              onChange: (e) => {
                var _a;
                return void handleImageFile(((_a = e.target.files) == null ? void 0 : _a[0]) ?? null);
              },
              "data-ocid": "admin.mint_config.image_file_input"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: imageFileName || "Choose an image from this device" })
        ] }),
        imageUrl && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: resolveImageUrl(imageUrl),
            alt: "Main collection preview",
            className: "w-16 h-16 rounded-lg object-cover border border-border"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 rounded-xl border border-border bg-muted/20 p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-start justify-between gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: "Marketplace Sales Fee" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Fixed-price and auction sales send this percentage of the sale amount to this ICP account." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", children: marketplaceFeeLoading ? "Loading" : `${formatMarketplaceFeePercent(
            (marketplaceFeeConfig == null ? void 0 : marketplaceFeeConfig.mintlabFeeBasisPoints) ?? 200n
          )}% fee` })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-[10rem_1fr_auto] gap-3 items-end", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "marketplace-fee-percent", children: "Sales fee (%)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "marketplace-fee-percent",
                value: marketplaceFeePercent,
                onChange: (e) => setMarketplaceFeePercent(e.target.value),
                placeholder: "2",
                inputMode: "decimal",
                "data-ocid": "admin.mint_config.marketplace_fee_percent_input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "marketplace-fee-payout", children: "Mintlab sales fee account ID" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "marketplace-fee-payout",
                value: marketplaceFeePayout,
                onChange: (e) => setMarketplaceFeePayout(e.target.value),
                placeholder: "64-character ICP account hex",
                className: "font-mono text-xs",
                "data-ocid": "admin.mint_config.marketplace_fee_payout_input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              onClick: () => marketplaceFeeMutation.mutate(),
              disabled: marketplaceFeeMutation.isPending,
              "data-ocid": "admin.mint_config.marketplace_fee_save_button",
              children: [
                marketplaceFeeMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }) : null,
                "Save Fee"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border bg-background/60 p-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Ledger fee" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-foreground mt-1", children: [
              formatICP((marketplaceFeeConfig == null ? void 0 : marketplaceFeeConfig.ledgerFeeE8s) ?? 10000n),
              " ICP"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border bg-background/60 p-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Auction escrow fee reserve" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-foreground mt-1", children: [
              formatICP(
                (marketplaceFeeConfig == null ? void 0 : marketplaceFeeConfig.auctionBidFeeReserveE8s) ?? 20000n
              ),
              " ",
              "ICP"
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 rounded-xl border border-border bg-muted/20 p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: "User Collection Creation" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 xl:grid-cols-[1fr_7rem] gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "creation-payout", children: "Primary payout account ID" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "creation-payout",
                  value: collectionCreationPayout,
                  onChange: (e) => setCollectionCreationPayout(e.target.value),
                  placeholder: "64-character ICP account hex",
                  className: "font-mono text-xs",
                  "data-ocid": "admin.mint_config.creation_payout_input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "creation-primary-percent", children: "Share (%)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "creation-primary-percent",
                  value: collectionCreationPrimaryPayoutPercent,
                  onChange: (e) => setCollectionCreationPrimaryPayoutPercent(e.target.value),
                  placeholder: "100",
                  inputMode: "decimal",
                  "data-ocid": "admin.mint_config.creation_primary_percent_input"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 xl:grid-cols-[1fr_7rem] gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "creation-secondary-payout", children: "Secondary payout account ID" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "creation-secondary-payout",
                  value: collectionCreationSecondaryPayout,
                  onChange: (e) => setCollectionCreationSecondaryPayout(e.target.value),
                  placeholder: "Optional 64-character ICP account hex",
                  className: "font-mono text-xs",
                  "data-ocid": "admin.mint_config.creation_secondary_payout_input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "creation-secondary-percent", children: "Share (%)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "creation-secondary-percent",
                  value: collectionCreationSecondaryPayoutPercent,
                  onChange: (e) => setCollectionCreationSecondaryPayoutPercent(e.target.value),
                  placeholder: "0",
                  inputMode: "decimal",
                  "data-ocid": "admin.mint_config.creation_secondary_percent_input"
                }
              )
            ] })
          ] }),
          !payoutPercentagesValid && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 rounded-md border border-destructive/20 bg-destructive/5 p-2 text-xs text-destructive", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { size: 14, className: "mt-0.5 shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Payout shares must add up to 100%." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "creation-price", children: "Creation fee (ICP)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "creation-price",
                value: collectionCreationPrice,
                onChange: (e) => setCollectionCreationPrice(e.target.value),
                placeholder: "e.g. 1.25",
                "data-ocid": "admin.mint_config.creation_price_input"
              }
            )
          ] }),
          creationQuoteFetching && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Updating cycles quote..." }),
          creationQuoteError && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 rounded-md border border-destructive/20 bg-destructive/5 p-2 text-xs text-destructive", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { size: 14, className: "mt-0.5 shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "Could not fetch the cycles quote:",
              " ",
              creationQuoteError instanceof Error ? creationQuoteError.message : "Unknown error"
            ] })
          ] }),
          creationQuote && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border bg-background/60 p-3 text-xs space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Converted to cycles" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium text-foreground", children: [
                formatICP(creationQuote.cycleCostE8s),
                " ICP"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Primary payout receives" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium text-foreground", children: [
                formatICP(creationQuote.adminPrimaryPayoutE8s),
                " ICP"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Secondary payout receives" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium text-foreground", children: [
                formatICP(creationQuote.adminSecondaryPayoutE8s),
                " ICP"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Total payout remainder" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium text-foreground", children: [
                formatICP(creationQuote.adminPayoutE8s),
                " ICP"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "User debit" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium text-foreground", children: [
                formatICP(creationQuote.totalUserDebitE8s),
                " ICP"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Cycles attached to create call" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: formatCycles(creationQuote.totalCyclesToConvert) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "New canister receives after fee" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: formatCycles(creationQuote.collectionCanisterCycles) })
            ] }),
            creationPriceBelowCycles && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 rounded-md border border-destructive/20 bg-destructive/5 p-2 text-destructive", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { size: 14, className: "mt-0.5 shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "Set at least",
                " ",
                formatICP(creationQuote.minimumCreationPriceE8s),
                " ICP at the current cycles rate."
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "creation-enabled", children: "Enable creation" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Switch,
              {
                id: "creation-enabled",
                checked: collectionCreationEnabled,
                onCheckedChange: setCollectionCreationEnabled,
                "data-ocid": "admin.mint_config.creation_enabled_switch"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 rounded-xl border border-border bg-muted/20 p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: "Main Collection Minting" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "main-mint-payout", children: "Mint payout account ID" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "main-mint-payout",
                value: mainMintPayout,
                onChange: (e) => setMainMintPayout(e.target.value),
                placeholder: "64-character ICP account hex",
                className: "font-mono text-xs",
                "data-ocid": "admin.mint_config.main_payout_input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "main-mint-price", children: "Mint price (ICP)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "main-mint-price",
                value: mainMintPrice,
                onChange: (e) => setMainMintPrice(e.target.value),
                placeholder: "e.g. 0.25",
                "data-ocid": "admin.mint_config.main_price_input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "main-mint-enabled", children: "Enable public mint" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Switch,
              {
                id: "main-mint-enabled",
                checked: mainMintEnabled,
                onCheckedChange: setMainMintEnabled,
                "data-ocid": "admin.mint_config.main_enabled_switch"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "main-dividends-enabled", children: "Enable dividends" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Switch,
              {
                id: "main-dividends-enabled",
                checked: mainMintDividendsEnabled,
                onCheckedChange: setMainMintDividendsEnabled,
                "data-ocid": "admin.mint_config.main_dividends_switch"
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-muted/20 p-4 space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: "Dedicated Collection Canisters" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "collection-cycles", children: "Cycles per new canister" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "collection-cycles",
                inputMode: "numeric",
                value: collectionCanisterCycles,
                onChange: (e) => setCollectionCanisterCycles(e.target.value),
                "data-ocid": "admin.mint_config.collection_cycles_input"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
              "Values below ",
              formatCycles(MIN_COLLECTION_CANISTER_CYCLES),
              " are raised automatically so the child canister has enough cycles to install its WASM module."
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "collection-wasm", children: "Collection canister WASM" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "collection-wasm",
                type: "file",
                accept: ".wasm,application/wasm,application/octet-stream",
                onChange: (e) => {
                  var _a;
                  return void handleWasmFile(((_a = e.target.files) == null ? void 0 : _a[0]) ?? null);
                },
                "data-ocid": "admin.mint_config.wasm_input"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: wasmFileName || ((mintConfig == null ? void 0 : mintConfig.collectionCanisterWasmUploaded) ? "A collection canister template is stored" : "Upload src/backend/dist/collection_nft.wasm after build") })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap justify-end gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "secondary",
              onClick: () => upgradeDedicatedCollectionsMutation.mutate(),
              disabled: upgradeDedicatedCollectionsMutation.isPending || !(mintConfig == null ? void 0 : mintConfig.collectionCanisterWasmUploaded),
              className: "gap-2",
              "data-ocid": "admin.mint_config.upgrade_dedicated_wasms_button",
              children: [
                upgradeDedicatedCollectionsMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 15, className: "animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 15 }),
                "Update Existing Canisters"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "outline",
              onClick: () => wasmMutation.mutate(),
              disabled: !wasmBytes || wasmMutation.isPending,
              className: "gap-2",
              "data-ocid": "admin.mint_config.wasm_submit_button",
              children: [
                wasmMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 15, className: "animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { size: 15 }),
                "Upload WASM"
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-muted/20 p-4 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-semibold text-foreground flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { size: 15, className: "text-primary" }),
              "OpenAI Image Moderation"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Checks uploaded JPG/PNG images and mint metadata before any ICP transfer is attempted." }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
              "Moderation uses OpenAI",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono", children: "omni-moderation-latest" }),
              " and checks images, title, description, and metadata before any ICP transfer."
            ] })
          ] }),
          moderationConfigLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-24 rounded-full" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
            Badge,
            {
              variant: (moderationConfig == null ? void 0 : moderationConfig.apiKeyConfigured) ? "secondary" : "outline",
              children: (moderationConfig == null ? void 0 : moderationConfig.apiKeyConfigured) ? "OpenAI key set" : "No key"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "moderation-api-key", children: "OpenAI API key" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "moderation-api-key",
              type: "password",
              value: moderationApiKey,
              onChange: (e) => {
                setModerationApiKey(e.target.value);
                if (e.target.value.trim()) setClearModerationApiKey(false);
              },
              placeholder: (moderationConfig == null ? void 0 : moderationConfig.apiKeyConfigured) ? "Leave blank to keep current key" : "sk-...",
              "data-ocid": "admin.moderation.api_key_input"
            }
          )
        ] }) }),
        (moderationConfig == null ? void 0 : moderationConfig.apiKeyConfigured) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4 rounded-lg border border-border bg-background/60 p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "moderation-clear-key", children: "Clear stored OpenAI key on save" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Switch,
            {
              id: "moderation-clear-key",
              checked: clearModerationApiKey,
              onCheckedChange: (checked) => {
                setClearModerationApiKey(checked);
                if (checked) setModerationApiKey("");
              },
              "data-ocid": "admin.moderation.clear_key_switch"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4 rounded-lg border border-border bg-background/60 p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "moderation-enabled", children: "Enable moderation" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Switch,
            {
              id: "moderation-enabled",
              checked: moderationEnabled,
              onCheckedChange: setModerationEnabled,
              "data-ocid": "admin.moderation.enabled_switch"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: moderationCategoryLabels.map((category) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center justify-between gap-3 rounded-lg border border-border bg-background/60 p-3",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Label,
                {
                  htmlFor: `moderation-${category.key}`,
                  className: "text-xs",
                  children: category.label
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Switch,
                {
                  id: `moderation-${category.key}`,
                  checked: moderationCategories[category.key],
                  onCheckedChange: (checked) => setModerationCategory(category.key, checked),
                  "data-ocid": `admin.moderation.category.${category.key}`
                }
              )
            ]
          },
          category.key
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "moderation-message", children: "User policy message" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Textarea,
            {
              id: "moderation-message",
              rows: 3,
              value: moderationMessage,
              onChange: (e) => setModerationMessage(e.target.value),
              "data-ocid": "admin.moderation.message_textarea"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "secondary",
            onClick: () => moderationMutation.mutate(),
            disabled: moderationMutation.isPending,
            className: "gap-2",
            "data-ocid": "admin.moderation.submit_button",
            children: moderationMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 15, className: "animate-spin" }),
              "Saving..."
            ] }) : "Save Moderation"
          }
        ) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          onClick: () => saveMutation.mutate(),
          disabled: saveMutation.isPending,
          className: "gap-2",
          "data-ocid": "admin.mint_config.submit_button",
          children: saveMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 15, className: "animate-spin" }),
            "Saving..."
          ] }) : "Save Mint Settings"
        }
      ) })
    ] })
  ] });
}
const defaultForm = {
  name: "",
  symbol: "",
  description: "",
  canisterId: "",
  standard: "EXT",
  otherStandard: "",
  imageUrl: "",
  totalSupply: "",
  tokenIndexOffset: ""
};
function AddCollectionForm({ onSuccess }) {
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  const [form, setForm] = reactExports.useState(defaultForm);
  const [errors, setErrors] = reactExports.useState({});
  const [imageDataUrl, setImageDataUrl] = reactExports.useState("");
  const [imageFileName, setImageFileName] = reactExports.useState("");
  const [imageFileInputKey, setImageFileInputKey] = reactExports.useState(0);
  const [previewImg, setPreviewImg] = reactExports.useState("");
  const [previewError, setPreviewError] = reactExports.useState(false);
  const [expanded, setExpanded] = reactExports.useState(true);
  const mutation = useMutation({
    mutationFn: async (values) => {
      if (!actor) throw new Error("Backend not ready");
      const principal = Principal.fromText(values.canisterId);
      const standard = makeStandard(values.standard, values.otherStandard);
      return actor.addCollection(
        values.name,
        values.description,
        principal,
        standard,
        values.imageUrl,
        values.symbol,
        buildBrowseInfoFromInputs(values.totalSupply, values.tokenIndexOffset)
      );
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["collections"] });
      ue.success("Collection added successfully!");
      setForm(defaultForm);
      setImageDataUrl("");
      setImageFileName("");
      setImageFileInputKey((current) => current + 1);
      setPreviewImg("");
      setErrors({});
      onSuccess();
    },
    onError: (err) => {
      ue.error(`Failed to add collection: ${extractError(err)}`);
    }
  });
  function validate(imageValue) {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.symbol.trim()) e.symbol = "Symbol is required";
    if (!form.description.trim()) e.description = "Description is required";
    if (!form.canisterId.trim()) {
      e.canisterId = "Canister ID is required";
    } else if (!isValidPrincipal(form.canisterId.trim())) {
      e.canisterId = "Invalid principal format";
    }
    if (!imageValue) {
      e.imageUrl = "Upload a collection image or add an image URL";
    } else if (imageValue.length > MAX_ON_CHAIN_IMAGE_CHARS) {
      e.imageUrl = "Collection image is too large for on-chain storage";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }
  function handleSubmit(e) {
    e.preventDefault();
    const imageValue = (imageDataUrl || form.imageUrl).trim();
    if (!validate(imageValue)) return;
    mutation.mutate({ ...form, imageUrl: imageValue });
  }
  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: void 0 }));
    }
  }
  function setImageUrl(value) {
    if (imageDataUrl) {
      setImageFileInputKey((current) => current + 1);
    }
    setImageDataUrl("");
    setImageFileName("");
    set("imageUrl", value);
  }
  async function handleCollectionImageFile(file) {
    if (!file) return;
    try {
      const dataUrl = await readImageFileAsDataUrl(file);
      setImageDataUrl(dataUrl);
      setImageFileName(file.name);
      set("imageUrl", "");
      setPreviewImg(dataUrl);
      setPreviewError(false);
    } catch (err) {
      ue.error(extractError(err));
    }
  }
  function handleImageBlur() {
    setPreviewError(false);
    setPreviewImg(form.imageUrl.trim());
  }
  const previewImage = imageDataUrl || previewImg;
  const previewImageUrl = resolveImageUrl(previewImage);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-primary/20 bg-card", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      CardHeader,
      {
        className: "cursor-pointer select-none pb-3",
        onClick: () => setExpanded((v) => !v),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 16, className: "text-primary" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base", children: "Add New Collection" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { className: "text-xs", children: "Manually curate a supported ICP NFT collection into Mintlab" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ChevronDown,
            {
              size: 16,
              className: `text-muted-foreground transition-transform ${expanded ? "rotate-180" : ""}`
            }
          )
        ] })
      }
    ),
    expanded && /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, noValidate: true, className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "col-name", children: [
            "Name ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "col-name",
              placeholder: "e.g. Bored Apes ICP",
              value: form.name,
              onChange: (e) => set("name", e.target.value),
              "data-ocid": "admin.add_collection.name_input"
            }
          ),
          errors.name && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-xs text-destructive",
              "data-ocid": "admin.add_collection.name_field_error",
              children: errors.name
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "col-symbol", children: [
            "Symbol ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "col-symbol",
              placeholder: "e.g. BAPE",
              value: form.symbol,
              onChange: (e) => set("symbol", e.target.value.toUpperCase()),
              "data-ocid": "admin.add_collection.symbol_input"
            }
          ),
          errors.symbol && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-xs text-destructive",
              "data-ocid": "admin.add_collection.symbol_field_error",
              children: errors.symbol
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "col-desc", children: [
          "Description ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Textarea,
          {
            id: "col-desc",
            placeholder: "Brief description of the collection…",
            rows: 2,
            value: form.description,
            onChange: (e) => set("description", e.target.value),
            "data-ocid": "admin.add_collection.description_textarea"
          }
        ),
        errors.description && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "p",
          {
            className: "text-xs text-destructive",
            "data-ocid": "admin.add_collection.description_field_error",
            children: errors.description
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "col-canister", children: [
            "Canister ID ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "col-canister",
              placeholder: "e.g. rrkah-fqaaa-aaaaa-aaaaq-cai",
              value: form.canisterId,
              onChange: (e) => set("canisterId", e.target.value),
              className: "font-mono text-sm",
              "data-ocid": "admin.add_collection.canister_id_input"
            }
          ),
          errors.canisterId && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-xs text-destructive",
              "data-ocid": "admin.add_collection.canister_id_field_error",
              children: errors.canisterId
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "col-standard", children: [
            "NFT Standard ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: form.standard,
              onValueChange: (v) => set("standard", v),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SelectTrigger,
                  {
                    id: "col-standard",
                    "data-ocid": "admin.add_collection.standard_select",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select standard" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "EXT", children: "EXT (Entrepot)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "DIP721", children: "DIP721" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "ICRC7", children: "ICRC-7" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Other", children: "Other" })
                ] })
              ]
            }
          ),
          form.standard === "Other" && /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              placeholder: "Custom standard name",
              value: form.otherStandard,
              onChange: (e) => set("otherStandard", e.target.value),
              className: "mt-1.5",
              "data-ocid": "admin.add_collection.other_standard_input"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Most Entrepot collections use EXT. Modern ICP NFT ledgers may use ICRC-7 instead." })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "col-total-supply", children: "Collection size" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "col-total-supply",
              inputMode: "numeric",
              placeholder: "e.g. 1000",
              value: form.totalSupply,
              onChange: (e) => set("totalSupply", e.target.value),
              "data-ocid": "admin.add_collection.total_supply_input"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Recommended when the collection does not provide a reliable token list." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "col-token-offset", children: "First token index" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "col-token-offset",
              inputMode: "numeric",
              placeholder: "Default: 0",
              value: form.tokenIndexOffset,
              onChange: (e) => set("tokenIndexOffset", e.target.value),
              "data-ocid": "admin.add_collection.token_offset_input"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Use 1 if token IDs start at 1 instead of 0." })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "col-image-file", children: [
          "Collection image ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-3 items-end", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "col-image-file",
                type: "file",
                accept: MODERATION_IMAGE_ACCEPT,
                onChange: (e) => {
                  var _a;
                  return void handleCollectionImageFile(
                    ((_a = e.target.files) == null ? void 0 : _a[0]) ?? null
                  );
                },
                "data-ocid": "admin.add_collection.image_file_input"
              },
              imageFileInputKey
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: imageFileName || "Choose an image from this device" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Label,
              {
                htmlFor: "col-image",
                className: "text-xs text-muted-foreground",
                children: "Or image URL"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "col-image",
                placeholder: "https://… or ipfs://…",
                value: form.imageUrl,
                onChange: (e) => setImageUrl(e.target.value),
                onBlur: handleImageBlur,
                "data-ocid": "admin.add_collection.image_url_input"
              }
            ),
            errors.imageUrl && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "text-xs text-destructive",
                "data-ocid": "admin.add_collection.image_url_field_error",
                children: errors.imageUrl
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 rounded-lg border border-border bg-muted flex items-center justify-center overflow-hidden shrink-0", children: previewImageUrl && !previewError ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: previewImageUrl,
              alt: "Preview",
              className: "w-full h-full object-cover",
              onError: () => setPreviewError(true)
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { size: 16, className: "text-muted-foreground" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          type: "submit",
          disabled: mutation.isPending,
          "data-ocid": "admin.add_collection.submit_button",
          className: "gap-2",
          children: mutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" }),
            "Adding…"
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 15 }),
            "Add Collection"
          ] })
        }
      ) })
    ] }) })
  ] });
}
function AdminPage() {
  const navigate = useNavigate();
  const { isAdmin, isLoading: adminLoading } = useAdmin();
  const { actor, isFetching } = useBackend();
  const queryClient = useQueryClient();
  const { data: collections, isLoading: collectionsLoading } = useQuery({
    queryKey: ["collections"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listCollections();
    },
    enabled: !!actor && !isFetching
  });
  const { data: collectionImportMetas = [] } = useQuery({
    queryKey: ["collectionImportMetas"],
    queryFn: async () => {
      if (!actor) return [];
      const metas = [];
      let cursor = null;
      do {
        const page = await actor.listCollectionImportMetasPage(cursor, 100n);
        metas.push(...page.metas);
        cursor = page.nextCursor;
      } while (cursor !== null);
      return metas;
    },
    enabled: !!actor && !isFetching && isAdmin
  });
  const collectionImportMetaById = reactExports.useMemo(() => {
    const map = /* @__PURE__ */ new Map();
    for (const meta of collectionImportMetas) {
      map.set(meta.collectionId.toString(), meta);
    }
    return map;
  }, [collectionImportMetas]);
  const removeMutation = useMutation({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Backend not ready");
      const ok = await actor.removeCollection(id);
      if (!ok) throw new Error("Collection could not be removed");
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["collections"] });
      ue.success("Collection removed.");
    },
    onError: (err) => {
      ue.error(`Failed to remove collection: ${extractError(err)}`);
    }
  });
  const redirected = reactExports.useRef(false);
  if (!adminLoading && !isAdmin && !redirected.current) {
    redirected.current = true;
    void navigate({ to: "/wallet" });
    return null;
  }
  const isLoading = adminLoading || collectionsLoading;
  const count = (collections == null ? void 0 : collections.length) ?? 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "max-w-4xl mx-auto px-4 py-8 space-y-6",
      "data-ocid": "admin.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { size: 20, className: "text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-display font-bold text-foreground leading-tight", children: "Admin Dashboard" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Manage Mintlab settings and collection curation" })
          ] }),
          !isLoading && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ml-auto flex items-center gap-2 bg-muted/60 rounded-lg px-3 py-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { size: 14, className: "text-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-foreground", children: count }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: count === 1 ? "collection" : "collections" })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AppHealthSection, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AddCollectionForm, { onSuccess: () => {
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(MintConfigForm, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx(MarketplaceEscrowRepairPanel, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CollectionCreationRequestsPanel, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CollectionSetupGuide, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-muted-foreground uppercase tracking-wider", children: "Registered Collections" }),
          isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "space-y-2",
              "data-ocid": "admin.collections.loading_state",
              children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-20 rounded-xl" }, i))
            }
          ) : count === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex flex-col items-center justify-center py-16 rounded-2xl border border-dashed border-border bg-muted/20",
              "data-ocid": "admin.collections.empty_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { size: 40, className: "text-muted-foreground/40 mb-3" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-muted-foreground", children: "No collections yet" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground/70 mt-1", children: "Use the form above to register the first NFT collection." })
              ]
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", "data-ocid": "admin.collections.list", children: collections.map((col, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            CollectionRow,
            {
              collection: col,
              importMeta: collectionImportMetaById.get(col.id.toString()),
              index: i + 1,
              onRemove: (id) => removeMutation.mutate(id)
            },
            col.id.toString()
          )) })
        ] })
      ]
    }
  );
}
export {
  AdminPage as default
};
