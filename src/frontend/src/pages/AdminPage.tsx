import { AppCanisterTopUpDialog } from "@/components/AppCanisterTopUpDialog";
import {
  CollectionCreationDiagnosticsPanel,
  recommendedCollectionCreationTopUpCycles,
} from "@/components/CollectionCreationDiagnosticsPanel";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useAdmin } from "@/hooks/use-admin";
import { useBackend } from "@/hooks/use-backend";
import { resolveImageUrl } from "@/lib/media";
import type {
  AppCanisterHealth,
  Collection,
  CollectionBrowseInfo,
  CollectionCreationDiagnostics,
  CollectionCreationRequestView,
  CollectionImportMeta,
  CollectionTrustStatus,
  MintlabFeeRecoveryQuote,
  ModerationCategorySettings,
  NFTStandard,
  SettlementEscrowRepairQuote,
} from "@/types";
import { Actor, type Agent } from "@icp-sdk/core/agent";
import { Principal } from "@icp-sdk/core/principal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  Activity,
  AlertCircle,
  Ban,
  Check,
  ChevronDown,
  Copy,
  ExternalLink,
  EyeOff,
  Fuel,
  ImageOff,
  Info,
  Layers,
  LoaderCircle,
  PauseCircle,
  Plus,
  RefreshCw,
  Search,
  Server,
  Shield,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

// ─── helpers ────────────────────────────────────────────────────────────────

const E8S = 100_000_000n;
const MAX_MARKETPLACE_FEE_BASIS_POINTS = 9_999n;
const PAYOUT_BASIS_POINTS_TOTAL = 10_000n;
const APP_LOW_CYCLES_THRESHOLD = 1_000_000_000_000n;
const MIN_COLLECTION_CANISTER_CYCLES = 2_000_000_000_000n;
const MAX_ON_CHAIN_IMAGE_CHARS = 1_900_000;
const MODERATION_IMAGE_ACCEPT = "image/png,image/jpeg";
const COLLECTION_CREATION_REPAIR_GRACE_MS = 3 * 60 * 1000;
const OPENAI_MODERATION_MODEL = "omni-moderation-latest";
const DEFAULT_MODERATION_MESSAGE =
  "Uploads cannot include sexual content, graphic violence, self-harm content, hateful or harassing text, or dangerous illegal instructions.";
const FRONTEND_CANISTER_ENV_KEYS = [
  "CANISTER_ID_FRONTEND",
  "CANISTER_FRONTEND_CANISTER_ID",
  "CANISTER_FRONTEND",
  "FRONTEND_CANISTER_ID",
];

const defaultModerationCategories: ModerationCategorySettings = {
  nudityOrSexual: true,
  graphicViolence: true,
  explicitLanguage: false,
  hateOrHarassment: false,
  hateSymbols: false,
  illegalOrDangerous: false,
  selfHarm: false,
  otherNsfw: true,
};

const moderationCategoryLabels: Array<{
  key: keyof ModerationCategorySettings;
  label: string;
}> = [
  { key: "nudityOrSexual", label: "Adult or sexual content" },
  { key: "graphicViolence", label: "Violence or injury" },
  { key: "selfHarm", label: "Self-harm content" },
  { key: "hateOrHarassment", label: "Hate or harassment text" },
  { key: "illegalOrDangerous", label: "Illicit instructions" },
  { key: "otherNsfw", label: "Other unsafe content" },
];

function truncatePrincipal(p: string) {
  if (p.length <= 24) return p;
  return `${p.slice(0, 10)}…${p.slice(-8)}`;
}

function makeStandard(raw: string, otherValue: string): NFTStandard {
  if (raw === "EXT") return { __kind__: "EXT", EXT: null };
  if (raw === "DIP721") return { __kind__: "DIP721", DIP721: null };
  if (raw === "ICRC7") return { __kind__: "ICRC7", ICRC7: null };
  return { __kind__: "Other", Other: otherValue };
}

function standardLabel(s: NFTStandard): string {
  if (s.__kind__ === "ICRC7") return "ICRC-7";
  return s.__kind__ === "Other" ? s.Other || "Other" : s.__kind__;
}

function standardVariant(s: NFTStandard): "default" | "secondary" | "outline" {
  if (s.__kind__ === "EXT") return "default";
  if (s.__kind__ === "DIP721") return "secondary";
  if (s.__kind__ === "ICRC7") return "secondary";
  return "outline";
}

function collectionTrustLabel(status?: CollectionTrustStatus): string {
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

function collectionTrustVariant(
  status?: CollectionTrustStatus,
): "default" | "secondary" | "outline" | "destructive" {
  if (status === "Verified") return "secondary";
  if (status === "Hidden" || status === "Blocked" || status === "Reported") {
    return "destructive";
  }
  return "outline";
}

function collectionCreationStatusLabel(
  status: CollectionCreationRequestView["status"],
): string {
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

function isRepairableCollectionCreationRequest(
  request: CollectionCreationRequestView,
): boolean {
  if (request.status === "Installed") return false;
  if (request.status === "Failed" || request.lastError) return true;

  const updatedAtMs = Number(request.updatedAt / 1_000_000n);
  return Date.now() - updatedAtMs > COLLECTION_CREATION_REPAIR_GRACE_MS;
}

function isValidPrincipal(value: string): boolean {
  try {
    Principal.fromText(value);
    return true;
  } catch {
    return false;
  }
}

function principalFromText(value: string | null | undefined): Principal | null {
  const trimmed = value?.trim();
  if (!trimmed || trimmed === "undefined" || !isValidPrincipal(trimmed)) {
    return null;
  }
  return Principal.fromText(trimmed);
}

function frontendCanisterIdFromHost(): string | null {
  if (typeof window === "undefined") return null;
  const host = window.location.hostname;
  const patterns = [
    /^([a-z0-9-]+)\.localhost$/i,
    /^([a-z0-9-]+)\.raw\.localhost$/i,
    /^([a-z0-9-]+)\.icp0\.io$/i,
    /^([a-z0-9-]+)\.raw\.icp0\.io$/i,
    /^([a-z0-9-]+)\.ic0\.app$/i,
    /^([a-z0-9-]+)\.raw\.ic0\.app$/i,
  ];
  for (const pattern of patterns) {
    const match = host.match(pattern);
    if (match?.[1] && isValidPrincipal(match[1])) {
      return match[1];
    }
  }
  return null;
}

function getFrontendCanisterPrincipal(): Principal | null {
  const env: Record<string, string | undefined> =
    typeof process !== "undefined" ? process.env : {};
  for (const key of FRONTEND_CANISTER_ENV_KEYS) {
    const fromEnv = principalFromText(env[key]);
    if (fromEnv) return fromEnv;
  }
  return principalFromText(frontendCanisterIdFromHost());
}

type RawManagementCanisterStatus = {
  cycles: bigint;
  module_hash: [] | [Uint8Array];
  idle_cycles_burned_per_day: bigint;
  settings: {
    controllers: Principal[];
    freezing_threshold: bigint;
  };
};

const managementCanisterId = "aaaaa-aa";
const managementIdlFactory = ({ IDL }: { IDL: any }) => {
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
      allowed_viewers: IDL.Vec(IDL.Principal),
    }),
    wasm_memory_limit: IDL.Nat,
    wasm_memory_threshold: IDL.Nat,
  });
  const CanisterStatusResult = IDL.Record({
    status: IDL.Variant({
      running: IDL.Null,
      stopping: IDL.Null,
      stopped: IDL.Null,
    }),
    memory_size: IDL.Nat,
    cycles: IDL.Nat,
    settings: DefiniteCanisterSettings,
    module_hash: IDL.Opt(IDL.Vec(IDL.Nat8)),
    idle_cycles_burned_per_day: IDL.Nat,
  });
  return IDL.Service({
    canister_status: IDL.Func([CanisterIdRecord], [CanisterStatusResult], []),
  });
};

async function getFrontendHealthWithAgent(
  agent: Agent,
  canisterId: Principal,
): Promise<AppCanisterHealth | null> {
  try {
    const management = Actor.createActor<{
      canister_status(args: {
        canister_id: Principal;
      }): Promise<RawManagementCanisterStatus>;
    }>(managementIdlFactory, {
      agent,
      canisterId: managementCanisterId,
    });
    const status = await management.canister_status({
      canister_id: canisterId,
    });
    return {
      kind: "Frontend",
      canisterId,
      cycles: status.cycles,
      moduleInstalled: status.module_hash.length > 0,
      freezingThresholdSeconds: status.settings.freezing_threshold,
      idleCyclesBurnedPerDay: status.idle_cycles_burned_per_day,
      error: null,
    };
  } catch {
    return null;
  }
}

function extractError(err: unknown): string {
  if (err instanceof Error)
    return err.message || "An unexpected error occurred";
  if (typeof err === "string") return err;
  if (err !== null && typeof err === "object") {
    const obj = err as Record<string, unknown>;
    if (typeof obj.message === "string") return obj.message;
    try {
      return JSON.stringify(obj);
    } catch {
      /* noop */
    }
  }
  return "An unexpected error occurred";
}

function accountIdToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function hexToAccountId(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = Number.parseInt(hex.slice(i, i + 2), 16);
  }
  return bytes;
}

function formatICP(e8s: bigint): string {
  const whole = e8s / E8S;
  const frac = (e8s % E8S).toString().padStart(8, "0").replace(/0+$/, "");
  return frac ? `${whole}.${frac}` : whole.toString();
}

function formatMarketplaceFeePercent(basisPoints: bigint): string {
  const whole = basisPoints / 100n;
  const frac = (basisPoints % 100n).toString().padStart(2, "0");
  const trimmedFrac = frac.replace(/0+$/, "");
  return trimmedFrac ? `${whole}.${trimmedFrac}` : whole.toString();
}

function formatPayoutPercent(basisPoints: bigint): string {
  return formatMarketplaceFeePercent(basisPoints);
}

function formatCycles(cycles: bigint): string {
  const trillion = 1_000_000_000_000n;
  if (cycles < trillion) return cycles.toString();
  const hundredths = (cycles * 100n) / trillion;
  const whole = hundredths / 100n;
  const frac = (hundredths % 100n).toString().padStart(2, "0");
  return `${whole}.${frac}T`;
}

function parseICPToE8s(value: string): bigint | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (!/^\d+(\.\d{0,8})?$/.test(trimmed)) return null;
  const [wholePart, fracPart = ""] = trimmed.split(".");
  return BigInt(wholePart) * E8S + BigInt(`${fracPart}00000000`.slice(0, 8));
}

function parseMarketplaceFeePercentToBasisPoints(value: string): bigint | null {
  const trimmed = value.trim();
  if (!trimmed || !/^\d+(\.\d{0,2})?$/.test(trimmed)) return null;
  const [wholePart, fracPart = ""] = trimmed.split(".");
  const basisPoints =
    BigInt(wholePart) * 100n + BigInt(`${fracPart}00`.slice(0, 2));
  if (basisPoints === 0n || basisPoints > MAX_MARKETPLACE_FEE_BASIS_POINTS) {
    return null;
  }
  return basisPoints;
}

function parsePayoutPercentToBasisPoints(value: string): bigint | null {
  const trimmed = value.trim();
  if (!trimmed || !/^\d+(\.\d{0,2})?$/.test(trimmed)) return null;
  const [wholePart, fracPart = ""] = trimmed.split(".");
  const basisPoints =
    BigInt(wholePart) * 100n + BigInt(`${fracPart}00`.slice(0, 2));
  if (basisPoints < 0n || basisPoints > PAYOUT_BASIS_POINTS_TOTAL) {
    return null;
  }
  return basisPoints;
}

function parseWholeBigInt(value: string): bigint | null {
  const trimmed = value.trim().replace(/_/g, "");
  if (!trimmed || !/^\d+$/.test(trimmed)) return null;
  return BigInt(trimmed);
}

function parseOptionalNatInput(value: string): bigint | null {
  const trimmed = value.trim().replace(/_/g, "");
  if (!trimmed) return null;
  if (!/^\d+$/.test(trimmed)) {
    throw new Error("Browse settings must be whole numbers");
  }
  return BigInt(trimmed);
}

function buildBrowseInfoFromInputs(
  totalSupply: string,
  tokenIndexOffset: string,
): CollectionBrowseInfo | null {
  const parsedTotalSupply = parseOptionalNatInput(totalSupply);
  const parsedTokenIndexOffset = parseOptionalNatInput(tokenIndexOffset);
  if (parsedTotalSupply == null && parsedTokenIndexOffset == null) {
    return null;
  }
  return {
    totalSupply: parsedTotalSupply,
    tokenIndexOffset: parsedTokenIndexOffset,
  };
}

function readFileAsDataUrl(file: File): Promise<string> {
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

async function readImageFileAsDataUrl(file: File): Promise<string> {
  if (!isSupportedModerationImageFile(file)) {
    throw new Error("Choose a JPG or PNG image");
  }
  const dataUrl = await readFileAsDataUrl(file);
  if (dataUrl.length > MAX_ON_CHAIN_IMAGE_CHARS) {
    throw new Error("Uploaded image is too large for on-chain storage");
  }
  return dataUrl;
}

function isSupportedModerationImageFile(file: File): boolean {
  return (
    file.type === "image/png" ||
    file.type === "image/jpeg" ||
    /\.(png|jpe?g)$/i.test(file.name)
  );
}

function readFileAsBytes(file: File): Promise<Uint8Array> {
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

// ─── CopyButton ─────────────────────────────────────────────────────────────

function CopyButton({
  text,
  ariaLabel = "Copy value",
}: {
  text: string;
  ariaLabel?: string;
}) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    void navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button
      type="button"
      onClick={copy}
      aria-label={ariaLabel}
      className="ml-1 text-muted-foreground hover:text-foreground transition-colors"
      data-ocid="admin.copy_button"
    >
      {copied ? (
        <Check size={13} className="text-primary" />
      ) : (
        <Copy size={13} />
      )}
    </button>
  );
}

// ─── CollectionSetupGuide ────────────────────────────────────────────────────

const GUIDE_STEPS = [
  {
    num: 1,
    title: "Get the Collection's Canister ID",
    body: "Every NFT collection on the Internet Computer has a unique Canister ID (looks like: ryjl3-tyaaa-aaaaa-aaaba-cai). Get this from the collection's official website or creator.",
  },
  {
    num: 2,
    title: "Choose the Right NFT Standard",
    body: "EXT (Entrepot) is used by many older ICP collections, DIP721 is another common standard, and newer ledgers may expose ICRC-7. If unsure, check the collection's documentation. Choosing the wrong standard will cause transfer errors.",
  },
  {
    num: 3,
    title: "Fill In the Form",
    body: "Enter the Canister ID, a display name, symbol, optional description and collection image, then select the NFT Standard and click Add Collection.",
  },
  {
    num: 4,
    title: "Verify the Collection Works",
    body: "After adding, users with NFTs from that collection should be able to register them in their wallet using the token ID. If transfers fail, double-check the canister ID and NFT standard.",
  },
];

function CollectionSetupGuide() {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="rounded-2xl border border-primary/25 overflow-hidden bg-primary/3"
      data-ocid="admin.setup_guide"
    >
      {/* Toggle header */}
      <button
        type="button"
        className="w-full flex items-center justify-between gap-3 px-5 py-4 hover:bg-primary/5 transition-colors text-left"
        onClick={() => setOpen((v) => !v)}
        data-ocid="admin.setup_guide.toggle"
        aria-expanded={open}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
            <Info size={15} className="text-primary" />
          </div>
          <div>
            <p className="font-display font-semibold text-sm text-foreground">
              How to Add NFT Collections
            </p>
            <p className="text-xs text-muted-foreground">
              Step-by-step setup guide for admins
            </p>
          </div>
        </div>
        <ChevronDown
          size={16}
          className={`text-muted-foreground transition-transform shrink-0 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="px-5 pb-5 space-y-5 border-t border-primary/15">
          {/* Steps */}
          <div className="space-y-3 pt-4">
            {GUIDE_STEPS.map((step) => (
              <div
                key={step.num}
                className="flex items-start gap-3"
                data-ocid={`admin.setup_guide.step.${step.num}`}
              >
                <div className="w-6 h-6 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-primary">
                    {step.num}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground leading-snug">
                    {step.title}
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
                    {step.body}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <Separator className="bg-primary/15" />

          {/* Troubleshooting */}
          <div className="flex items-start gap-2.5 p-3 bg-destructive/5 border border-destructive/20 rounded-xl">
            <AlertCircle
              size={15}
              className="text-destructive shrink-0 mt-0.5"
            />
            <div className="min-w-0 space-y-1">
              <p className="text-xs font-semibold text-foreground">
                Troubleshooting Transfer Errors
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                If users report transfer errors, verify:
              </p>
              <ul className="text-xs text-muted-foreground space-y-0.5 list-none">
                <li className="flex items-start gap-1.5">
                  <span className="text-destructive/60 mt-0.5">•</span>
                  The canister ID is correct and the collection is deployed on
                  mainnet.
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-destructive/60 mt-0.5">•</span>
                  The NFT standard matches what the collection actually uses
                  (EXT vs DIP721 vs ICRC-7).
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-destructive/60 mt-0.5">•</span>
                  The collection canister is accessible (not paused or private).
                </li>
              </ul>
              <p className="text-xs text-muted-foreground leading-relaxed mt-1.5 pt-1.5 border-t border-destructive/10">
                <strong className="text-foreground">Note:</strong> Most
                collections on the{" "}
                <a
                  href="https://entrepot.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-2"
                >
                  Entrepot marketplace
                </a>{" "}
                use the{" "}
                <strong className="text-foreground">EXT standard</strong>.
                Collections deployed independently may use DIP721 or ICRC-7.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function repairKindLabel(kind: SettlementEscrowRepairQuote["kind"]): string {
  return kind === "Auction" ? "Auction" : "Fixed sale";
}

function RepairMetric({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "warning" | "success";
}) {
  const valueClass =
    tone === "warning"
      ? "text-destructive"
      : tone === "success"
        ? "text-emerald-700"
        : "text-foreground";

  return (
    <div className="rounded-lg border border-border bg-background/60 p-3">
      <span className="text-xs text-muted-foreground">{label}</span>
      <p className={`font-mono text-sm mt-1 truncate ${valueClass}`}>{value}</p>
    </div>
  );
}

function MarketplaceEscrowRepairPanel() {
  const { actor } = useBackend();
  const [listingIdInput, setListingIdInput] = useState("");
  const [quote, setQuote] = useState<SettlementEscrowRepairQuote | null>(null);
  const [mintlabQuote, setMintlabQuote] =
    useState<MintlabFeeRecoveryQuote | null>(null);

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
        toast.success("Settlement escrow is funded.");
      }
    },
    onError: (err: unknown) => {
      setQuote(null);
      toast.error(extractError(err));
    },
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
      toast.success("Mintlab fee recovery quote loaded.");
    },
    onError: (err: unknown) => {
      setMintlabQuote(null);
      toast.error(extractError(err));
    },
  });

  const resetMintlabFeeMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Backend not ready");
      const listingId =
        mintlabQuote?.listingId ?? parseWholeBigInt(listingIdInput);
      if (listingId === null) throw new Error("Enter a valid listing ID");
      return actor.adminResetUnresolvedMintlabFeeAttempt(listingId);
    },
    onSuccess: (result) => {
      setMintlabQuote(result);
      toast.success("Mintlab fee attempt reset.");
      quoteMutation.mutate();
    },
    onError: (err: unknown) => {
      toast.error(extractError(err));
    },
  });

  const markMintlabFeeVerifiedMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Backend not ready");
      const listingId =
        mintlabQuote?.listingId ?? parseWholeBigInt(listingIdInput);
      if (listingId === null) throw new Error("Enter a valid listing ID");
      return actor.adminMarkMintlabFeeBalanceVerified(listingId);
    },
    onSuccess: (result) => {
      setMintlabQuote(result);
      toast.success("Mintlab fee marked balance-verified.");
      quoteMutation.mutate();
    },
    onError: (err: unknown) => {
      toast.error(extractError(err));
    },
  });

  const topUpMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Backend not ready");
      if (!quote) throw new Error("Load a repair quote first");
      return actor.adminTopUpSettlementEscrow(quote.listingId, quote.shortfall);
    },
    onSuccess: (receipt) => {
      toast.success(
        `Escrow topped up with ${formatICP(receipt.amount)} ICP at block ${receipt.blockIndex.toString()}.`,
      );
      quoteMutation.mutate();
    },
    onError: (err: unknown) => {
      toast.error(extractError(err));
    },
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
      toast.success("Settlement retry started.");
      quoteMutation.mutate();
    },
    onError: (err: unknown) => {
      toast.error(extractError(err));
    },
  });

  const retryNoBidReturnMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Backend not ready");
      const listingId = parseWholeBigInt(listingIdInput);
      if (listingId === null) throw new Error("Enter a valid listing ID");
      await actor.adminRetryNoBidAuctionReturn(listingId);
    },
    onSuccess: () => {
      toast.success("No-bid return retry started.");
    },
    onError: (err: unknown) => {
      toast.error(extractError(err));
    },
  });

  const retryListingReturnMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Backend not ready");
      const listingId = parseWholeBigInt(listingIdInput);
      if (listingId === null) throw new Error("Enter a valid listing ID");
      await actor.adminRetryListingReturn(listingId);
    },
    onSuccess: () => {
      toast.success("Listing return retry started.");
    },
    onError: (err: unknown) => {
      toast.error(extractError(err));
    },
  });

  const resolvePendingBidMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Backend not ready");
      const listingId = parseWholeBigInt(listingIdInput);
      if (listingId === null) throw new Error("Enter a valid listing ID");
      await actor.adminResolvePendingBid(listingId);
    },
    onSuccess: () => {
      toast.success("Pending bid resolution started.");
    },
    onError: (err: unknown) => {
      toast.error(extractError(err));
    },
  });

  const shortfallText = quote
    ? `${formatICP(quote.shortfall)} ICP`
    : "No quote";
  const topUpBlocked =
    !quote ||
    quote.shortfall === 0n ||
    quote.topUpFromBalance < quote.topUpTotalDebit ||
    topUpMutation.isPending;

  return (
    <Card className="border-amber-500/25 bg-card">
      <CardHeader className="space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-base">
              Marketplace Escrow Repair
            </CardTitle>
            <CardDescription className="text-xs">
              Quote and fund settlement escrow shortfalls from the admin ICP
              account.
            </CardDescription>
          </div>
          {quote && (
            <Badge variant={quote.shortfall > 0n ? "destructive" : "secondary"}>
              {quote.shortfall > 0n ? shortfallText : "Funded"}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3 items-end">
          <div className="space-y-1.5">
            <Label htmlFor="marketplace-escrow-repair-listing">
              Listing ID
            </Label>
            <Input
              id="marketplace-escrow-repair-listing"
              inputMode="numeric"
              value={listingIdInput}
              onChange={(event) => setListingIdInput(event.target.value)}
              placeholder="e.g. 12"
              data-ocid="admin.marketplace_repair.listing_input"
            />
          </div>
          <div className="flex flex-wrap justify-start sm:justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              className="gap-2"
              disabled={quoteMutation.isPending}
              onClick={() => quoteMutation.mutate()}
              data-ocid="admin.marketplace_repair.quote_button"
            >
              {quoteMutation.isPending ? (
                <LoaderCircle size={15} className="animate-spin" />
              ) : (
                <RefreshCw size={15} />
              )}
              Load Quote
            </Button>
            <Button
              type="button"
              variant="outline"
              className="gap-2"
              disabled={mintlabRecoveryMutation.isPending}
              onClick={() => mintlabRecoveryMutation.mutate()}
              data-ocid="admin.marketplace_repair.mintlab_quote_button"
            >
              {mintlabRecoveryMutation.isPending ? (
                <LoaderCircle size={15} className="animate-spin" />
              ) : (
                <AlertCircle size={15} />
              )}
              Mintlab Fee
            </Button>
          </div>
        </div>

        {mintlabQuote && (
          <div className="space-y-3 rounded-lg border border-amber-500/30 bg-amber-500/5 p-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              <RepairMetric
                label="Settlement"
                value={`${repairKindLabel(mintlabQuote.kind)} #${mintlabQuote.listingId.toString()}`}
              />
              <RepairMetric
                label="Escrow balance"
                value={`${formatICP(mintlabQuote.escrowBalance)} ICP`}
              />
              <RepairMetric
                label="Before fee debit"
                value={`${formatICP(mintlabQuote.expectedBeforeMintlabFeeDebit)} ICP`}
              />
              <RepairMetric
                label="Before fee shortfall"
                value={`${formatICP(mintlabQuote.shortfallBeforeMintlabFee)} ICP`}
                tone={
                  mintlabQuote.shortfallBeforeMintlabFee > 0n
                    ? "warning"
                    : "success"
                }
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <RepairMetric
                label="After fee debit"
                value={`${formatICP(mintlabQuote.expectedAfterMintlabFeeDebit)} ICP`}
              />
              <RepairMetric
                label="Mintlab fee"
                value={`${formatICP(mintlabQuote.mintlabFee)} ICP`}
              />
              <RepairMetric
                label="Ledger fee"
                value={`${formatICP(mintlabQuote.ledgerFeeE8s)} ICP`}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="rounded-lg border border-border bg-background/60 p-3 min-w-0">
                <span className="text-xs text-muted-foreground">
                  Settlement escrow account
                </span>
                <p className="font-mono text-xs text-foreground mt-1 break-all">
                  {accountIdToHex(mintlabQuote.escrowAccount)}
                  <CopyButton
                    text={accountIdToHex(mintlabQuote.escrowAccount)}
                    ariaLabel="Copy settlement escrow account"
                  />
                </p>
              </div>
              <div className="rounded-lg border border-border bg-background/60 p-3 min-w-0">
                <span className="text-xs text-muted-foreground">
                  Mintlab fee recipient
                </span>
                <p className="font-mono text-xs text-foreground mt-1 break-all">
                  {accountIdToHex(mintlabQuote.feeRecipient)}
                  <CopyButton
                    text={accountIdToHex(mintlabQuote.feeRecipient)}
                    ariaLabel="Copy Mintlab fee recipient"
                  />
                </p>
              </div>
            </div>

            <div className="flex flex-wrap justify-end gap-2">
              <Button
                type="button"
                variant="secondary"
                className="gap-2"
                disabled={resetMintlabFeeMutation.isPending}
                onClick={() => resetMintlabFeeMutation.mutate()}
                data-ocid="admin.marketplace_repair.mintlab_reset_button"
              >
                {resetMintlabFeeMutation.isPending ? (
                  <LoaderCircle size={15} className="animate-spin" />
                ) : (
                  <RefreshCw size={15} />
                )}
                Reset Fee Attempt
              </Button>
              <Button
                type="button"
                variant="outline"
                className="gap-2"
                disabled={markMintlabFeeVerifiedMutation.isPending}
                onClick={() => markMintlabFeeVerifiedMutation.mutate()}
                data-ocid="admin.marketplace_repair.mintlab_mark_verified_button"
              >
                {markMintlabFeeVerifiedMutation.isPending ? (
                  <LoaderCircle size={15} className="animate-spin" />
                ) : (
                  <Check size={15} />
                )}
                Mark Fee Verified
              </Button>
            </div>
          </div>
        )}

        {quote && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              <RepairMetric
                label="Settlement"
                value={`${repairKindLabel(quote.kind)} #${quote.listingId.toString()}`}
              />
              <RepairMetric
                label="Escrow balance"
                value={`${formatICP(quote.escrowBalance)} ICP`}
              />
              <RepairMetric
                label="Required debit"
                value={`${formatICP(quote.requiredDebit)} ICP`}
              />
              <RepairMetric
                label="Shortfall"
                value={shortfallText}
                tone={quote.shortfall > 0n ? "warning" : "success"}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="rounded-lg border border-border bg-background/60 p-3 min-w-0">
                <span className="text-xs text-muted-foreground">
                  Settlement escrow account
                </span>
                <p className="font-mono text-xs text-foreground mt-1 break-all">
                  {accountIdToHex(quote.escrowAccount)}
                  <CopyButton
                    text={accountIdToHex(quote.escrowAccount)}
                    ariaLabel="Copy settlement escrow account"
                  />
                </p>
              </div>
              <div className="rounded-lg border border-border bg-background/60 p-3 min-w-0">
                <span className="text-xs text-muted-foreground">
                  Admin funding account
                </span>
                <p className="font-mono text-xs text-foreground mt-1 break-all">
                  {accountIdToHex(quote.topUpFromAccount)}
                  <CopyButton
                    text={accountIdToHex(quote.topUpFromAccount)}
                    ariaLabel="Copy admin funding account"
                  />
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <RepairMetric
                label="Admin balance"
                value={`${formatICP(quote.topUpFromBalance)} ICP`}
                tone={
                  quote.shortfall > 0n &&
                  quote.topUpFromBalance < quote.topUpTotalDebit
                    ? "warning"
                    : "default"
                }
              />
              <RepairMetric
                label="Top-up transfer fee"
                value={`${formatICP(quote.topUpTransferFeeE8s)} ICP`}
              />
              <RepairMetric
                label="Admin total debit"
                value={`${formatICP(quote.topUpTotalDebit)} ICP`}
              />
            </div>

            <div className="flex flex-wrap justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                className="gap-2"
                disabled={!quote || retrySettlementMutation.isPending}
                onClick={() => retrySettlementMutation.mutate()}
                data-ocid="admin.marketplace_repair.retry_button"
              >
                {retrySettlementMutation.isPending ? (
                  <LoaderCircle size={15} className="animate-spin" />
                ) : (
                  <RefreshCw size={15} />
                )}
                Retry Settlement
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="gap-2"
                disabled={topUpBlocked}
                onClick={() => topUpMutation.mutate()}
                data-ocid="admin.marketplace_repair.top_up_button"
              >
                {topUpMutation.isPending ? (
                  <LoaderCircle size={15} className="animate-spin" />
                ) : (
                  <Fuel size={15} />
                )}
                Top Up Shortfall
              </Button>
            </div>
          </div>
        )}

        <div className="flex flex-wrap justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            className="gap-2"
            disabled={resolvePendingBidMutation.isPending}
            onClick={() => resolvePendingBidMutation.mutate()}
            data-ocid="admin.marketplace_repair.resolve_pending_bid_button"
          >
            {resolvePendingBidMutation.isPending ? (
              <LoaderCircle size={15} className="animate-spin" />
            ) : (
              <RefreshCw size={15} />
            )}
            Resolve Pending Bid
          </Button>
          <Button
            type="button"
            variant="outline"
            className="gap-2"
            disabled={retryNoBidReturnMutation.isPending}
            onClick={() => retryNoBidReturnMutation.mutate()}
            data-ocid="admin.marketplace_repair.retry_no_bid_return_button"
          >
            {retryNoBidReturnMutation.isPending ? (
              <LoaderCircle size={15} className="animate-spin" />
            ) : (
              <RefreshCw size={15} />
            )}
            Retry No-Bid Return
          </Button>
          <Button
            type="button"
            variant="outline"
            className="gap-2"
            disabled={retryListingReturnMutation.isPending}
            onClick={() => retryListingReturnMutation.mutate()}
            data-ocid="admin.marketplace_repair.retry_listing_return_button"
          >
            {retryListingReturnMutation.isPending ? (
              <LoaderCircle size={15} className="animate-spin" />
            ) : (
              <RefreshCw size={15} />
            )}
            Retry Listing Return
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── CollectionRow ───────────────────────────────────────────────────────────

function CollectionRow({
  collection,
  importMeta,
  index,
  onRemove,
}: {
  collection: Collection;
  importMeta?: CollectionImportMeta;
  index: number;
  onRemove: (id: bigint) => void;
}) {
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  const [imgError, setImgError] = useState(false);
  const [totalSupply, setTotalSupply] = useState(
    collection.browseInfo?.totalSupply?.toString() ?? "",
  );
  const [tokenIndexOffset, setTokenIndexOffset] = useState(
    collection.browseInfo?.tokenIndexOffset?.toString() ?? "",
  );
  const pid = collection.canisterId.toString();
  const imageUrl = resolveImageUrl(collection.imageUrl);
  const resolvedTrustStatus: CollectionTrustStatus =
    importMeta?.trustStatus ??
    (collection.kind === "Minted" ? "Verified" : "CommunityImported");

  const browseMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Backend not ready");
      const result = await actor.updateCollectionBrowseInfo(
        collection.id,
        buildBrowseInfoFromInputs(totalSupply, tokenIndexOffset),
      );
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["collections"] });
      void queryClient.invalidateQueries({
        queryKey: ["allCollectionBrowseStats"],
      });
      toast.success("Collection browse settings updated.");
    },
    onError: (err: unknown) => {
      toast.error(`Failed to update browse settings: ${extractError(err)}`);
    },
  });

  const trustMutation = useMutation({
    mutationFn: async (status: CollectionTrustStatus) => {
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
        queryKey: ["collectionImportMetas"],
      });
      toast.success("Collection trust status updated.");
    },
    onError: (err: unknown) => {
      toast.error(`Failed to update trust status: ${extractError(err)}`);
    },
  });

  const resetIndexMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Backend not ready");
      const result = await actor.adminResetCollectionOwnershipIndex(
        collection.id,
      );
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["collectionIndexStatus", collection.id.toString()],
      });
      void queryClient.invalidateQueries({ queryKey: ["collections"] });
      toast.success("Ownership index reset for this collection.");
    },
    onError: (err: unknown) => {
      toast.error(`Failed to reset ownership index: ${extractError(err)}`);
    },
  });

  useEffect(() => {
    setTotalSupply(collection.browseInfo?.totalSupply?.toString() ?? "");
    setTokenIndexOffset(
      collection.browseInfo?.tokenIndexOffset?.toString() ?? "",
    );
  }, [collection.browseInfo]);

  return (
    <div
      className="space-y-2 rounded-lg border border-border bg-card px-3 py-2.5 hover:bg-muted/30 transition-colors"
      data-ocid={`admin.collection.item.${index}`}
    >
      <div className="flex items-center gap-4">
        {/* thumbnail */}
        <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0 flex items-center justify-center">
          {!imgError && imageUrl ? (
            <img
              src={imageUrl}
              alt={collection.name}
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <ImageOff size={18} className="text-muted-foreground" />
          )}
        </div>

        {/* info */}
        <div className="flex-1 min-w-0 space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm text-foreground truncate">
              {collection.name}
            </span>
            <Badge
              variant={collection.kind === "Minted" ? "secondary" : "outline"}
              className="text-[10px] shrink-0"
            >
              {collection.kind === "Minted" ? "Minted" : "External"}
            </Badge>
            <Badge
              variant={standardVariant(collection.standard)}
              className="text-xs shrink-0"
            >
              {standardLabel(collection.standard)}
            </Badge>
            <Badge
              variant={collectionTrustVariant(resolvedTrustStatus)}
              className="text-xs shrink-0"
            >
              {collectionTrustLabel(resolvedTrustStatus)}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground font-mono truncate flex items-center gap-1">
            {truncatePrincipal(pid)}
            <CopyButton text={pid} />
          </p>
          {collection.description && (
            <p className="text-xs text-muted-foreground line-clamp-1">
              {collection.description}
            </p>
          )}
        </div>

        {/* symbol */}
        <span className="hidden sm:block text-xs font-mono font-semibold text-muted-foreground px-2 py-1 rounded bg-muted shrink-0">
          {collection.symbol}
        </span>

        {/* remove */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-destructive hover:bg-destructive/10 shrink-0"
              data-ocid={`admin.collection.delete_button.${index}`}
            >
              <Trash2 size={15} />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent data-ocid="admin.remove_collection.dialog">
            <AlertDialogHeader>
              <AlertDialogTitle>Remove Collection?</AlertDialogTitle>
              <AlertDialogDescription>
                <strong>{collection.name}</strong> will be removed from the
                platform. Existing registered NFTs from this collection
                won&apos;t be deleted but new registrations won&apos;t be
                possible.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel data-ocid="admin.remove_collection.cancel_button">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={() => onRemove(collection.id)}
                data-ocid="admin.remove_collection.confirm_button"
              >
                Remove
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="grid grid-cols-1 gap-2 border-t border-border pt-2 sm:grid-cols-[1fr_1fr_auto]">
        <Input
          inputMode="numeric"
          placeholder="Collection size"
          value={totalSupply}
          onChange={(event) => setTotalSupply(event.target.value)}
          className="h-8 text-xs"
          data-ocid={`admin.collection.browse_total_supply.${index}`}
        />
        <Input
          inputMode="numeric"
          placeholder="First token index"
          value={tokenIndexOffset}
          onChange={(event) => setTokenIndexOffset(event.target.value)}
          className="h-8 text-xs"
          data-ocid={`admin.collection.browse_token_offset.${index}`}
        />
        <Button
          size="sm"
          variant="secondary"
          className="gap-2"
          onClick={() => browseMutation.mutate()}
          disabled={browseMutation.isPending}
          data-ocid={`admin.collection.browse_save.${index}`}
        >
          {browseMutation.isPending ? (
            <LoaderCircle size={14} className="animate-spin" />
          ) : (
            <RefreshCw size={14} />
          )}
          Save Range
        </Button>
      </div>

      <div className="space-y-2 border-t border-border pt-2">
        <p className="text-[11px] leading-relaxed text-muted-foreground">
          Verify marks the collection as Mintlab reviewed. Needs Range flags
          missing token browse data. Disable Sync stops wallet auto-sync. Hide
          removes it from public browsing. Block removes public access and
          prevents sync or marketplace use.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="secondary"
            className="gap-2"
            title="Mark this collection as reviewed and Mintlab verified."
            onClick={() => trustMutation.mutate("Verified")}
            disabled={trustMutation.isPending}
            data-ocid={`admin.collection.verify.${index}`}
          >
            <ShieldCheck size={14} />
            Verify
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="gap-2"
            title="Flag this collection as needing token range browse settings."
            onClick={() => trustMutation.mutate("NeedsBrowseInfo")}
            disabled={trustMutation.isPending}
            data-ocid={`admin.collection.needs_range.${index}`}
          >
            <AlertCircle size={14} />
            Needs Range
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="gap-2"
            title="Disable automatic wallet sync for this collection without hiding it."
            onClick={() => trustMutation.mutate("SyncDisabled")}
            disabled={trustMutation.isPending}
            data-ocid={`admin.collection.sync_disabled.${index}`}
          >
            <PauseCircle size={14} />
            Disable Sync
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="gap-2"
            title="Clear saved ownership scan progress so the next sync starts from the current token range."
            onClick={() => resetIndexMutation.mutate()}
            disabled={resetIndexMutation.isPending}
            data-ocid={`admin.collection.reset_index.${index}`}
          >
            <RefreshCw size={14} />
            Reset Index
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="gap-2"
            title="Hide this collection from public browsing while admins review it."
            onClick={() => trustMutation.mutate("Hidden")}
            disabled={trustMutation.isPending}
            data-ocid={`admin.collection.hide.${index}`}
          >
            <EyeOff size={14} />
            Hide
          </Button>
          <Button
            size="sm"
            variant="destructive"
            className="gap-2"
            title="Block this collection from public access, wallet sync, and marketplace activity."
            onClick={() => trustMutation.mutate("Blocked")}
            disabled={trustMutation.isPending}
            data-ocid={`admin.collection.block.${index}`}
          >
            <Ban size={14} />
            Block
          </Button>
        </div>
      </div>
    </div>
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
  deletePending,
}: {
  request: CollectionCreationRequestView;
  onRepair: () => void;
  onRetry: () => void;
  onClose: () => void;
  onTopUp: (diagnostics: CollectionCreationDiagnostics) => void;
  repairPending: boolean;
  retryPending: boolean;
  deletePending: boolean;
}) {
  const { actor, isFetching } = useBackend();
  const { data: diagnosticsResult, isLoading: isDiagnosticsLoading } = useQuery(
    {
      queryKey: ["collectionCreationDiagnostics", request.id.toString()],
      queryFn: async () => {
        if (!actor) {
          return { __kind__: "err" as const, err: "Backend not ready" };
        }
        return actor.getCollectionCreationDiagnostics(request.id);
      },
      enabled: !!actor && !isFetching,
      refetchInterval: 20_000,
    },
  );
  const diagnostics =
    diagnosticsResult?.__kind__ === "ok" ? diagnosticsResult.ok : null;
  const diagnosticsError =
    diagnosticsResult?.__kind__ === "err" ? diagnosticsResult.err : null;

  return (
    <div className="rounded-xl border border-border bg-background/60 p-3">
      <div className="space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-foreground">
                {request.name}
              </span>
              <Badge variant="outline" className="text-[11px]">
                #{request.id.toString()}
              </Badge>
              <Badge variant="secondary" className="text-[11px]">
                {collectionCreationStatusLabel(request.status)}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              {request.cyclePaymentBlock != null
                ? `ICP block ${request.cyclePaymentBlock.toString()}`
                : "No cycle payment block yet"}
            </p>
            {request.lastError && (
              <p className="text-xs text-amber-700 dark:text-amber-200">
                {request.lastError}
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={onRepair}
              disabled={repairPending}
              data-ocid={`admin.collection_creation.repair.${request.id.toString()}`}
            >
              Repair
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={onRetry}
              disabled={retryPending || request.status === "Installed"}
              data-ocid={`admin.collection_creation.retry.${request.id.toString()}`}
            >
              Retry
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-destructive hover:bg-destructive/10"
                  disabled={deletePending}
                  data-ocid={`admin.collection_creation.delete.${request.id.toString()}`}
                >
                  Close
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Close setup request?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Paid requests without a recovered collection are protected
                    by the backend and must be recovered or manually settled
                    before they can be closed.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    onClick={onClose}
                  >
                    Close
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        <CollectionCreationDiagnosticsPanel
          diagnostics={diagnostics}
          error={diagnosticsError}
          isLoading={isDiagnosticsLoading}
          onTopUp={onTopUp}
        />
      </div>
    </div>
  );
}

function CollectionCreationRequestsPanel() {
  const { actor, isFetching } = useBackend();
  const queryClient = useQueryClient();
  const [topUpReason, setTopUpReason] = useState<string | null>(null);
  const [topUpInitialCycles, setTopUpInitialCycles] = useState<bigint | null>(
    null,
  );

  const { data: requestResult, isLoading } = useQuery({
    queryKey: ["allCollectionCreationRequests"],
    queryFn: async () => {
      if (!actor) return { __kind__: "ok" as const, ok: [] };
      return actor.getAllCollectionCreationRequests();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 20_000,
  });

  const requests = requestResult?.__kind__ === "ok" ? requestResult.ok : [];
  const visibleRequests = useMemo(
    () => requests.filter(isRepairableCollectionCreationRequest),
    [requests],
  );
  const requestError =
    requestResult?.__kind__ === "err" ? requestResult.err : null;

  const repairMutation = useMutation({
    mutationFn: async (requestId: bigint) => {
      if (!actor) throw new Error("Backend not ready");
      const result = await actor.repairCollectionCreationRequest(requestId);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["allCollectionCreationRequests"],
      });
      void queryClient.invalidateQueries({
        queryKey: ["collectionCreationDiagnostics"],
      });
      toast.success("Collection setup request repaired.");
    },
    onError: (err: unknown) => {
      toast.error(`Repair failed: ${extractError(err)}`);
    },
  });

  const retryMutation = useMutation({
    mutationFn: async (requestId: bigint) => {
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
        queryKey: ["allCollectionCreationRequests"],
      });
      void queryClient.invalidateQueries({
        queryKey: ["collectionCreationDiagnostics"],
      });
      void queryClient.invalidateQueries({
        queryKey: ["myCollectionCreationRequests"],
      });
      toast.success(`${receipt.collection.name} setup completed.`);
    },
    onError: (err: unknown) => {
      toast.error(`Retry failed: ${extractError(err)}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (requestId: bigint) => {
      if (!actor) throw new Error("Backend not ready");
      const result =
        await actor.adminDeleteCollectionCreationRequest(requestId);
      if (result.__kind__ === "err") throw new Error(result.err);
      if (!result.ok) throw new Error("Request could not be deleted");
      return requestId;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["allCollectionCreationRequests"],
      });
      void queryClient.invalidateQueries({
        queryKey: ["collectionCreationDiagnostics"],
      });
      void queryClient.invalidateQueries({
        queryKey: ["myCollectionCreationRequests"],
      });
      toast.success("Collection setup request closed.");
    },
    onError: (err: unknown) => {
      toast.error(`Close failed: ${extractError(err)}`);
    },
  });

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-base">Collection Setup Requests</CardTitle>
        <CardDescription className="text-sm">
          Repair or retry saved collection creation attempts without charging
          the creator again.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {requestError && (
          <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive">
            {requestError}
          </div>
        )}
        {isLoading ? (
          <div className="space-y-2">
            {[1, 2].map((item) => (
              <Skeleton key={item} className="h-20 rounded-xl" />
            ))}
          </div>
        ) : visibleRequests.length === 0 ? (
          <p className="rounded-lg border border-border bg-muted/20 p-3 text-sm text-muted-foreground">
            No collection setup requests need attention.
          </p>
        ) : (
          <div className="space-y-2">
            {visibleRequests.map((request) => (
              <CollectionCreationRequestRow
                key={request.id.toString()}
                request={request}
                onRepair={() => repairMutation.mutate(request.id)}
                onRetry={() => retryMutation.mutate(request.id)}
                onClose={() => deleteMutation.mutate(request.id)}
                onTopUp={(diagnostics) => {
                  setTopUpReason(
                    `The app backend needs more cycles before it can attach ${formatCycles(
                      diagnostics.createCallCycles,
                    )} cycles to create request #${request.id.toString()}.`,
                  );
                  setTopUpInitialCycles(
                    recommendedCollectionCreationTopUpCycles(diagnostics),
                  );
                }}
                repairPending={repairMutation.isPending}
                retryPending={retryMutation.isPending}
                deletePending={deleteMutation.isPending}
              />
            ))}
          </div>
        )}
      </CardContent>
      <AppCanisterTopUpDialog
        open={topUpReason != null}
        reason={topUpReason}
        initialCycles={topUpInitialCycles}
        onOpenChange={(open) => {
          if (!open) {
            setTopUpReason(null);
            setTopUpInitialCycles(null);
          }
        }}
        onSuccess={() => {
          void queryClient.invalidateQueries({
            queryKey: ["appCanisterHealth"],
          });
          void queryClient.invalidateQueries({
            queryKey: ["collectionCreationDiagnostics"],
          });
        }}
      />
    </Card>
  );
}

function AppHealthSection() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  const frontendCanister = useMemo(getFrontendCanisterPrincipal, []);
  const frontendCanisterText = frontendCanister?.toString() ?? null;
  const [topUpTarget, setTopUpTarget] = useState<AppCanisterHealth | null>(
    null,
  );

  const {
    data: healthResult,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["appCanisterHealth", frontendCanisterText],
    queryFn: async () => {
      if (!actor) return { __kind__: "ok" as const, ok: [] };
      const result = await actor.getAppCanisterHealth(frontendCanister);
      if (!frontendCanister || result.__kind__ === "err") return result;
      const frontendHealth = await getFrontendHealthWithAgent(
        actor.getAgent(),
        frontendCanister,
      );
      if (!frontendHealth) return result;
      return {
        __kind__: "ok" as const,
        ok: [
          ...result.ok.filter((item) => item.kind !== "Frontend"),
          frontendHealth,
        ],
      };
    },
    enabled: !!actor,
    staleTime: 120_000,
  });

  const health = healthResult?.__kind__ === "ok" ? healthResult.ok : [];
  const healthError =
    healthResult?.__kind__ === "err" ? healthResult.err : null;
  const hasFrontendHealth = health.some((item) => item.kind === "Frontend");

  const refreshHealth = () => {
    void queryClient.invalidateQueries({ queryKey: ["appCanisterHealth"] });
  };

  return (
    <Card className="border-primary/20 bg-card" data-ocid="admin.app_health">
      <CardHeader className="space-y-2">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <Activity size={16} className="text-primary" />
              App Health
            </CardTitle>
            <CardDescription className="text-xs">
              Frontend and backend canister IDs, cycle balances, and top-ups.
            </CardDescription>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={refreshHealth}
            disabled={isFetching}
            className="gap-2"
            data-ocid="admin.app_health.refresh_button"
          >
            {isFetching ? (
              <LoaderCircle size={14} className="animate-spin" />
            ) : (
              <RefreshCw size={14} />
            )}
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {healthError && (
          <div className="flex items-start gap-2 rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive">
            <AlertCircle size={15} className="mt-0.5 shrink-0" />
            <span>{healthError}</span>
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Skeleton className="h-40 rounded-xl" />
            <Skeleton className="h-40 rounded-xl" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {health.map((item) => (
              <AppHealthCanisterPanel
                key={`${item.kind}-${item.canisterId.toString()}`}
                health={item}
                onTopUp={setTopUpTarget}
              />
            ))}
            {!frontendCanisterText && <MissingFrontendCanisterPanel />}
            {frontendCanisterText && !hasFrontendHealth && (
              <MissingFrontendCanisterPanel canisterId={frontendCanisterText} />
            )}
          </div>
        )}
      </CardContent>
      <AppCanisterTopUpDialog
        open={topUpTarget !== null}
        targetCanisterId={topUpTarget?.canisterId.toString() ?? null}
        targetLabel={
          topUpTarget ? `${topUpTarget.kind} canister` : "App canister"
        }
        onOpenChange={(open) => {
          if (!open) setTopUpTarget(null);
        }}
        onSuccess={refreshHealth}
      />
    </Card>
  );
}

function AppHealthCanisterPanel({
  health,
  onTopUp,
}: {
  health: AppCanisterHealth;
  onTopUp: (health: AppCanisterHealth) => void;
}) {
  const lowCycles =
    health.cycles !== null && health.cycles < APP_LOW_CYCLES_THRESHOLD;
  const icon =
    health.kind === "Backend" ? (
      <Server size={15} className="text-primary" />
    ) : (
      <Layers size={15} className="text-primary" />
    );

  return (
    <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            {icon}
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">
              {health.kind} Canister
            </p>
            <p className="text-xs text-muted-foreground">
              {health.moduleInstalled === false
                ? "No module installed"
                : "Module installed"}
            </p>
          </div>
        </div>
        <Badge variant={lowCycles ? "destructive" : "secondary"}>
          {lowCycles ? "Low cycles" : "Ready"}
        </Badge>
      </div>

      <div className="space-y-3 text-sm">
        <div>
          <span className="text-xs uppercase tracking-wider text-muted-foreground">
            Canister ID
          </span>
          <div className="mt-1 flex items-center gap-1">
            <span className="font-mono text-xs break-all text-foreground">
              {health.canisterId.toString()}
            </span>
            <CopyButton text={health.canisterId.toString()} />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div className="rounded-lg border border-border bg-background/60 p-3">
            <span className="text-xs text-muted-foreground">Cycle balance</span>
            <p className="font-mono text-sm text-foreground mt-1">
              {health.cycles === null
                ? "Unavailable"
                : formatCycles(health.cycles)}
            </p>
          </div>
          <div className="rounded-lg border border-border bg-background/60 p-3">
            <span className="text-xs text-muted-foreground">Daily burn</span>
            <p className="font-mono text-sm text-foreground mt-1">
              {health.idleCyclesBurnedPerDay === null
                ? "Unavailable"
                : formatCycles(health.idleCyclesBurnedPerDay)}
            </p>
          </div>
        </div>
        {health.error && (
          <div className="flex items-start gap-2 rounded-lg border border-amber-500/20 bg-amber-500/10 p-3 text-xs text-amber-700 dark:text-amber-300">
            <AlertCircle size={14} className="mt-0.5 shrink-0" />
            <span>{health.error}</span>
          </div>
        )}
      </div>

      <Button
        type="button"
        variant="secondary"
        className="w-full gap-2"
        onClick={() => onTopUp(health)}
        data-ocid={`admin.app_health.${health.kind.toLowerCase()}_top_up_button`}
      >
        <Fuel size={15} />
        Top Up
      </Button>
    </div>
  );
}

function MissingFrontendCanisterPanel({ canisterId }: { canisterId?: string }) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-muted/10 p-4 space-y-3">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
          <Layers size={15} className="text-muted-foreground" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">
            Frontend Canister
          </p>
          <p className="text-xs text-muted-foreground">
            {canisterId ?? "Canister ID unavailable"}
          </p>
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        Frontend cycle balance appears when the deployed asset canister ID is
        available.
      </p>
    </div>
  );
}

function MintConfigForm() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFileName, setImageFileName] = useState("");
  const [collectionCreationPayout, setCollectionCreationPayout] = useState("");
  const [
    collectionCreationSecondaryPayout,
    setCollectionCreationSecondaryPayout,
  ] = useState("");
  const [
    collectionCreationPrimaryPayoutPercent,
    setCollectionCreationPrimaryPayoutPercent,
  ] = useState("100");
  const [
    collectionCreationSecondaryPayoutPercent,
    setCollectionCreationSecondaryPayoutPercent,
  ] = useState("0");
  const [collectionCreationPrice, setCollectionCreationPrice] = useState("");
  const [collectionCreationEnabled, setCollectionCreationEnabled] =
    useState(false);
  const [mainMintPayout, setMainMintPayout] = useState("");
  const [mainMintPrice, setMainMintPrice] = useState("");
  const [mainMintEnabled, setMainMintEnabled] = useState(false);
  const [marketplaceFeePayout, setMarketplaceFeePayout] = useState("");
  const [marketplaceFeePercent, setMarketplaceFeePercent] = useState("");
  const [marketplaceFeeInitialized, setMarketplaceFeeInitialized] =
    useState(false);
  const [mainMintDividendsEnabled, setMainMintDividendsEnabled] =
    useState(false);
  const [collectionCanisterCycles, setCollectionCanisterCycles] =
    useState("1000000000000");
  const [wasmBytes, setWasmBytes] = useState<Uint8Array | null>(null);
  const [wasmFileName, setWasmFileName] = useState("");
  const [initialized, setInitialized] = useState(false);
  const [moderationEnabled, setModerationEnabled] = useState(false);
  const [moderationApiKey, setModerationApiKey] = useState("");
  const [clearModerationApiKey, setClearModerationApiKey] = useState(false);
  const [moderationMessage, setModerationMessage] = useState(
    DEFAULT_MODERATION_MESSAGE,
  );
  const [moderationCategories, setModerationCategories] =
    useState<ModerationCategorySettings>(defaultModerationCategories);
  const [moderationInitialized, setModerationInitialized] = useState(false);

  const { data: mintConfig, isLoading: mintConfigLoading } = useQuery({
    queryKey: ["mintConfig"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMintConfig();
    },
    enabled: !!actor,
  });

  const { data: collections } = useQuery({
    queryKey: ["collections"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listCollections();
    },
    enabled: !!actor,
  });

  const { data: marketplaceFeeConfig, isLoading: marketplaceFeeLoading } =
    useQuery({
      queryKey: ["marketplaceFeeConfig"],
      queryFn: async () => {
        if (!actor) return null;
        return actor.getMarketplaceFeeConfig();
      },
      enabled: !!actor,
    });

  const { data: moderationConfig, isLoading: moderationConfigLoading } =
    useQuery({
      queryKey: ["moderationConfig"],
      queryFn: async () => {
        if (!actor) return null;
        return actor.getModerationConfig();
      },
      enabled: !!actor,
    });

  const parsedCreationPriceE8s = parseICPToE8s(collectionCreationPrice);
  const parsedCollectionCanisterCycles = parseWholeBigInt(
    collectionCanisterCycles,
  );
  const parsedPrimaryPayoutBasisPoints = parsePayoutPercentToBasisPoints(
    collectionCreationPrimaryPayoutPercent,
  );
  const parsedSecondaryPayoutBasisPoints = parsePayoutPercentToBasisPoints(
    collectionCreationSecondaryPayoutPercent,
  );
  const payoutPercentagesValid =
    parsedPrimaryPayoutBasisPoints !== null &&
    parsedSecondaryPayoutBasisPoints !== null &&
    parsedPrimaryPayoutBasisPoints + parsedSecondaryPayoutBasisPoints ===
      PAYOUT_BASIS_POINTS_TOTAL;
  const canQuoteCreationCost =
    !!actor &&
    parsedCreationPriceE8s !== null &&
    parsedCollectionCanisterCycles !== null &&
    payoutPercentagesValid;

  const {
    data: creationQuote,
    error: creationQuoteError,
    isFetching: creationQuoteFetching,
  } = useQuery({
    queryKey: [
      "collectionCreationQuote",
      collectionCreationPrice.trim(),
      collectionCanisterCycles.trim(),
      collectionCreationPrimaryPayoutPercent.trim(),
      collectionCreationSecondaryPayoutPercent.trim(),
    ],
    queryFn: async () => {
      if (
        !actor ||
        parsedCreationPriceE8s === null ||
        parsedCollectionCanisterCycles === null ||
        parsedPrimaryPayoutBasisPoints === null ||
        parsedSecondaryPayoutBasisPoints === null
      ) {
        return null;
      }
      return actor.quoteCollectionCreationCost(
        parsedCollectionCanisterCycles,
        parsedCreationPriceE8s,
        parsedPrimaryPayoutBasisPoints,
        parsedSecondaryPayoutBasisPoints,
      );
    },
    enabled: canQuoteCreationCost,
    staleTime: 60_000,
  });

  const creationPriceBelowCycles =
    !!creationQuote &&
    parsedCreationPriceE8s !== null &&
    parsedCreationPriceE8s < creationQuote.minimumCreationPriceE8s;

  const mainCollection = mintConfig?.collectionId
    ? collections?.find(
        (collection) => collection.id === mintConfig.collectionId,
      )
    : null;
  const dedicatedMintlabCollections =
    collections?.filter(
      (collection) =>
        collection.kind === "Minted" &&
        collection.id !== mintConfig?.collectionId,
    ) ?? [];

  useEffect(() => {
    if (initialized || !mintConfig) return;
    setName(mainCollection?.name ?? "");
    setSymbol(mainCollection?.symbol ?? "");
    setDescription(mainCollection?.description ?? "");
    setImageUrl(mainCollection?.imageUrl ?? "");
    setImageFileName(mainCollection?.imageUrl ? "Current image" : "");
    setCollectionCreationPayout(
      mintConfig.collectionCreationPayoutAccount
        ? accountIdToHex(mintConfig.collectionCreationPayoutAccount)
        : "",
    );
    setCollectionCreationSecondaryPayout(
      mintConfig.collectionCreationSecondaryPayoutAccount
        ? accountIdToHex(mintConfig.collectionCreationSecondaryPayoutAccount)
        : "",
    );
    setCollectionCreationPrimaryPayoutPercent(
      formatPayoutPercent(
        mintConfig.collectionCreationPrimaryPayoutBasisPoints,
      ),
    );
    setCollectionCreationSecondaryPayoutPercent(
      formatPayoutPercent(
        mintConfig.collectionCreationSecondaryPayoutBasisPoints,
      ),
    );
    setCollectionCreationPrice(
      mintConfig.collectionCreationPriceE8s > 0n
        ? formatICP(mintConfig.collectionCreationPriceE8s)
        : "0",
    );
    setCollectionCreationEnabled(mintConfig.collectionCreationEnabled);
    setMainMintPayout(
      mintConfig.mainMintPayoutAccount
        ? accountIdToHex(mintConfig.mainMintPayoutAccount)
        : "",
    );
    setMainMintPrice(
      mintConfig.mainMintPriceE8s > 0n
        ? formatICP(mintConfig.mainMintPriceE8s)
        : "0",
    );
    setMainMintEnabled(mintConfig.mainMintEnabled);
    setMainMintDividendsEnabled(
      mainCollection?.dividendConfig?.enabled === true,
    );
    setCollectionCanisterCycles(mintConfig.collectionCanisterCycles.toString());
    setInitialized(true);
  }, [initialized, mintConfig, mainCollection]);

  useEffect(() => {
    if (moderationInitialized || !moderationConfig) return;
    setModerationEnabled(moderationConfig.enabled);
    setModerationMessage(
      moderationConfig.userMessage || DEFAULT_MODERATION_MESSAGE,
    );
    setModerationCategories(moderationConfig.categories);
    setModerationInitialized(true);
  }, [moderationInitialized, moderationConfig]);

  useEffect(() => {
    if (marketplaceFeeInitialized || !marketplaceFeeConfig) return;
    setMarketplaceFeePayout(
      marketplaceFeeConfig.mintlabFeeRecipient
        ? accountIdToHex(marketplaceFeeConfig.mintlabFeeRecipient)
        : "",
    );
    setMarketplaceFeePercent(
      formatMarketplaceFeePercent(marketplaceFeeConfig.mintlabFeeBasisPoints),
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
        collectionCreationPrimaryPayoutPercent,
      );
      const secondaryPayoutBasisPoints = parsePayoutPercentToBasisPoints(
        collectionCreationSecondaryPayoutPercent,
      );
      if (creationPriceE8s === null)
        throw new Error("Collection creation fee must be a valid ICP amount");
      if (mainMintPriceE8s === null)
        throw new Error("Main mint price must be a valid ICP amount");
      if (cycles === null)
        throw new Error("Collection canister cycles must be a whole number");
      if (
        primaryPayoutBasisPoints === null ||
        secondaryPayoutBasisPoints === null ||
        primaryPayoutBasisPoints + secondaryPayoutBasisPoints !==
          PAYOUT_BASIS_POINTS_TOTAL
      ) {
        throw new Error(
          "Collection creation payout percentages must add up to 100%",
        );
      }
      if (
        collectionCreationEnabled &&
        creationQuote &&
        creationPriceE8s < creationQuote.minimumCreationPriceE8s
      ) {
        throw new Error(
          `Collection creation fee must be at least ${formatICP(
            creationQuote.minimumCreationPriceE8s,
          )} ICP at the current cycles rate`,
        );
      }

      const primaryPayoutRequired = creationQuote
        ? creationQuote.adminPrimaryPayoutE8s > 0n
        : creationPriceE8s > 0n && primaryPayoutBasisPoints > 0n;
      const secondaryPayoutRequired = creationQuote
        ? creationQuote.adminSecondaryPayoutE8s > 0n ||
          secondaryPayoutBasisPoints > 0n
        : secondaryPayoutBasisPoints > 0n;
      const creationPayout = primaryPayoutRequired
        ? validateAccountId(collectionCreationPayout, "collection creation")
        : null;
      const secondaryCreationPayout = secondaryPayoutRequired
        ? validateAccountId(
            collectionCreationSecondaryPayout,
            "secondary collection creation",
          )
        : null;
      const mintPayout =
        mainMintPriceE8s > 0n
          ? validateAccountId(mainMintPayout, "main mint")
          : null;

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
        cycles,
      );
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["collections"] });
      void queryClient.invalidateQueries({ queryKey: ["mintConfig"] });
      toast.success("Mint settings saved");
    },
    onError: (err: unknown) => {
      toast.error(extractError(err));
    },
  });

  const marketplaceFeeMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Backend not ready");
      const recipient = validateAccountId(
        marketplaceFeePayout,
        "Mintlab sales fee",
      );
      const basisPoints = parseMarketplaceFeePercentToBasisPoints(
        marketplaceFeePercent,
      );
      if (basisPoints === null) {
        throw new Error(
          "Marketplace sales fee must be between 0.01% and 99.99%",
        );
      }
      return actor.configureMarketplaceFee(recipient, basisPoints);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["marketplaceFeeConfig"],
      });
      toast.success("Marketplace fee saved");
    },
    onError: (err: unknown) => {
      toast.error(extractError(err));
    },
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
      toast.success("Collection canister WASM uploaded");
    },
    onError: (err: unknown) => {
      toast.error(extractError(err));
    },
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
        message,
      );
    },
    onSuccess: () => {
      setModerationApiKey("");
      setClearModerationApiKey(false);
      void queryClient.invalidateQueries({ queryKey: ["moderationConfig"] });
      toast.success("Moderation settings saved");
    },
    onError: (err: unknown) => {
      toast.error(extractError(err));
    },
  });

  const upgradeDedicatedCollectionsMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Backend not ready");
      if (!mintConfig?.collectionCanisterWasmUploaded) {
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
        queryKey: ["myCollectionCanisterStatuses"],
      });
      toast.success(
        updated === 0
          ? "No dedicated collection canisters to update"
          : `Updated ${updated} collection canister${updated === 1 ? "" : "s"}`,
      );
    },
    onError: (err: unknown) => {
      toast.error(extractError(err));
    },
  });

  function validateAccountId(value: string, label: string) {
    const trimmed = value.trim();
    if (!/^[0-9a-fA-F]{64}$/.test(trimmed)) {
      throw new Error(`${label} payout account must be 64 hex characters`);
    }
    return hexToAccountId(trimmed);
  }

  async function handleImageFile(file: File | null) {
    if (!file) return;
    try {
      const dataUrl = await readImageFileAsDataUrl(file);
      setImageUrl(dataUrl);
      setImageFileName(file.name);
    } catch (err) {
      toast.error(extractError(err));
    }
  }

  async function handleWasmFile(file: File | null) {
    if (!file) {
      setWasmBytes(null);
      setWasmFileName("");
      return;
    }
    const bytes = await readFileAsBytes(file);
    setWasmBytes(bytes);
    setWasmFileName(`${file.name} (${Math.ceil(bytes.byteLength / 1024)} KB)`);
  }

  function setModerationCategory(
    key: keyof ModerationCategorySettings,
    value: boolean,
  ) {
    setModerationCategories((current) => ({ ...current, [key]: value }));
  }

  return (
    <Card className="border-accent/20 bg-card">
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle className="text-base">Mintlab Collections</CardTitle>
            <CardDescription className="text-xs">
              Configure the main app collection, user collection launch fees,
              mint fees, payout accounts, and child collection canister
              template.
            </CardDescription>
          </div>
          {mintConfigLoading ? (
            <Skeleton className="h-8 w-24 rounded-full" />
          ) : (
            <div className="flex flex-wrap justify-end gap-2">
              <Badge
                variant={collectionCreationEnabled ? "default" : "outline"}
              >
                {collectionCreationEnabled ? "Creation on" : "Creation off"}
              </Badge>
              <Badge variant={mainMintEnabled ? "default" : "outline"}>
                {mainMintEnabled ? "Main mint on" : "Main mint off"}
              </Badge>
              <Badge variant={moderationEnabled ? "secondary" : "outline"}>
                {moderationEnabled ? "Moderation on" : "Moderation off"}
              </Badge>
              <Badge
                variant={
                  mintConfig?.collectionCanisterWasmUploaded
                    ? "secondary"
                    : "outline"
                }
              >
                {mintConfig?.collectionCanisterWasmUploaded
                  ? "WASM ready"
                  : "WASM needed"}
              </Badge>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="mint-name">Main collection name</Label>
            <Input
              id="mint-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Vault Originals"
              data-ocid="admin.mint_config.name_input"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="mint-symbol">Main collection symbol</Label>
            <Input
              id="mint-symbol"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              placeholder="e.g. VLT"
              data-ocid="admin.mint_config.symbol_input"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="mint-description">Main collection description</Label>
          <Textarea
            id="mint-description"
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the app's main collection..."
            data-ocid="admin.mint_config.description_textarea"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 items-end">
          <div className="space-y-1.5">
            <Label htmlFor="mint-image">Main collection image</Label>
            <Input
              id="mint-image"
              type="file"
              accept={MODERATION_IMAGE_ACCEPT}
              onChange={(e) =>
                void handleImageFile(e.target.files?.[0] ?? null)
              }
              data-ocid="admin.mint_config.image_file_input"
            />
            <p className="text-xs text-muted-foreground">
              {imageFileName || "Choose an image from this device"}
            </p>
          </div>
          {imageUrl && (
            <img
              src={resolveImageUrl(imageUrl)}
              alt="Main collection preview"
              className="w-16 h-16 rounded-lg object-cover border border-border"
            />
          )}
        </div>

        <Separator />

        <div className="space-y-3 rounded-xl border border-border bg-muted/20 p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-foreground">
                Marketplace Sales Fee
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Fixed-price and auction sales send this percentage of the sale
                amount to this ICP account.
              </p>
            </div>
            <Badge variant="secondary">
              {marketplaceFeeLoading
                ? "Loading"
                : `${formatMarketplaceFeePercent(
                    marketplaceFeeConfig?.mintlabFeeBasisPoints ?? 200n,
                  )}% fee`}
            </Badge>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-[10rem_1fr_auto] gap-3 items-end">
            <div className="space-y-1.5">
              <Label htmlFor="marketplace-fee-percent">Sales fee (%)</Label>
              <Input
                id="marketplace-fee-percent"
                value={marketplaceFeePercent}
                onChange={(e) => setMarketplaceFeePercent(e.target.value)}
                placeholder="2"
                inputMode="decimal"
                data-ocid="admin.mint_config.marketplace_fee_percent_input"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="marketplace-fee-payout">
                Mintlab sales fee account ID
              </Label>
              <Input
                id="marketplace-fee-payout"
                value={marketplaceFeePayout}
                onChange={(e) => setMarketplaceFeePayout(e.target.value)}
                placeholder="64-character ICP account hex"
                className="font-mono text-xs"
                data-ocid="admin.mint_config.marketplace_fee_payout_input"
              />
            </div>
            <Button
              type="button"
              onClick={() => marketplaceFeeMutation.mutate()}
              disabled={marketplaceFeeMutation.isPending}
              data-ocid="admin.mint_config.marketplace_fee_save_button"
            >
              {marketplaceFeeMutation.isPending ? (
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Save Fee
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="rounded-lg border border-border bg-background/60 p-3">
              <span className="text-muted-foreground">Ledger fee</span>
              <p className="font-mono text-foreground mt-1">
                {formatICP(marketplaceFeeConfig?.ledgerFeeE8s ?? 10_000n)} ICP
              </p>
            </div>
            <div className="rounded-lg border border-border bg-background/60 p-3">
              <span className="text-muted-foreground">
                Auction escrow fee reserve
              </span>
              <p className="font-mono text-foreground mt-1">
                {formatICP(
                  marketplaceFeeConfig?.auctionBidFeeReserveE8s ?? 20_000n,
                )}{" "}
                ICP
              </p>
            </div>
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-3 rounded-xl border border-border bg-muted/20 p-4">
            <p className="text-sm font-semibold text-foreground">
              User Collection Creation
            </p>
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_7rem] gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="creation-payout">
                  Primary payout account ID
                </Label>
                <Input
                  id="creation-payout"
                  value={collectionCreationPayout}
                  onChange={(e) => setCollectionCreationPayout(e.target.value)}
                  placeholder="64-character ICP account hex"
                  className="font-mono text-xs"
                  data-ocid="admin.mint_config.creation_payout_input"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="creation-primary-percent">Share (%)</Label>
                <Input
                  id="creation-primary-percent"
                  value={collectionCreationPrimaryPayoutPercent}
                  onChange={(e) =>
                    setCollectionCreationPrimaryPayoutPercent(e.target.value)
                  }
                  placeholder="100"
                  inputMode="decimal"
                  data-ocid="admin.mint_config.creation_primary_percent_input"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_7rem] gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="creation-secondary-payout">
                  Secondary payout account ID
                </Label>
                <Input
                  id="creation-secondary-payout"
                  value={collectionCreationSecondaryPayout}
                  onChange={(e) =>
                    setCollectionCreationSecondaryPayout(e.target.value)
                  }
                  placeholder="Optional 64-character ICP account hex"
                  className="font-mono text-xs"
                  data-ocid="admin.mint_config.creation_secondary_payout_input"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="creation-secondary-percent">Share (%)</Label>
                <Input
                  id="creation-secondary-percent"
                  value={collectionCreationSecondaryPayoutPercent}
                  onChange={(e) =>
                    setCollectionCreationSecondaryPayoutPercent(e.target.value)
                  }
                  placeholder="0"
                  inputMode="decimal"
                  data-ocid="admin.mint_config.creation_secondary_percent_input"
                />
              </div>
            </div>
            {!payoutPercentagesValid && (
              <div className="flex items-start gap-2 rounded-md border border-destructive/20 bg-destructive/5 p-2 text-xs text-destructive">
                <AlertCircle size={14} className="mt-0.5 shrink-0" />
                <span>Payout shares must add up to 100%.</span>
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="creation-price">Creation fee (ICP)</Label>
              <Input
                id="creation-price"
                value={collectionCreationPrice}
                onChange={(e) => setCollectionCreationPrice(e.target.value)}
                placeholder="e.g. 1.25"
                data-ocid="admin.mint_config.creation_price_input"
              />
            </div>
            {creationQuoteFetching && (
              <p className="text-xs text-muted-foreground">
                Updating cycles quote...
              </p>
            )}
            {creationQuoteError && (
              <div className="flex items-start gap-2 rounded-md border border-destructive/20 bg-destructive/5 p-2 text-xs text-destructive">
                <AlertCircle size={14} className="mt-0.5 shrink-0" />
                <span>
                  Could not fetch the cycles quote:{" "}
                  {creationQuoteError instanceof Error
                    ? creationQuoteError.message
                    : "Unknown error"}
                </span>
              </div>
            )}
            {creationQuote && (
              <div className="rounded-lg border border-border bg-background/60 p-3 text-xs space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">
                    Converted to cycles
                  </span>
                  <span className="font-medium text-foreground">
                    {formatICP(creationQuote.cycleCostE8s)} ICP
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">
                    Primary payout receives
                  </span>
                  <span className="font-medium text-foreground">
                    {formatICP(creationQuote.adminPrimaryPayoutE8s)} ICP
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">
                    Secondary payout receives
                  </span>
                  <span className="font-medium text-foreground">
                    {formatICP(creationQuote.adminSecondaryPayoutE8s)} ICP
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">
                    Total payout remainder
                  </span>
                  <span className="font-medium text-foreground">
                    {formatICP(creationQuote.adminPayoutE8s)} ICP
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">User debit</span>
                  <span className="font-medium text-foreground">
                    {formatICP(creationQuote.totalUserDebitE8s)} ICP
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">
                    Cycles attached to create call
                  </span>
                  <span className="font-medium text-foreground">
                    {formatCycles(creationQuote.totalCyclesToConvert)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">
                    New canister receives after fee
                  </span>
                  <span className="font-medium text-foreground">
                    {formatCycles(creationQuote.collectionCanisterCycles)}
                  </span>
                </div>
                {creationPriceBelowCycles && (
                  <div className="flex items-start gap-2 rounded-md border border-destructive/20 bg-destructive/5 p-2 text-destructive">
                    <AlertCircle size={14} className="mt-0.5 shrink-0" />
                    <span>
                      Set at least{" "}
                      {formatICP(creationQuote.minimumCreationPriceE8s)} ICP at
                      the current cycles rate.
                    </span>
                  </div>
                )}
              </div>
            )}
            <div className="flex items-center justify-between gap-4">
              <Label htmlFor="creation-enabled">Enable creation</Label>
              <Switch
                id="creation-enabled"
                checked={collectionCreationEnabled}
                onCheckedChange={setCollectionCreationEnabled}
                data-ocid="admin.mint_config.creation_enabled_switch"
              />
            </div>
          </div>

          <div className="space-y-3 rounded-xl border border-border bg-muted/20 p-4">
            <p className="text-sm font-semibold text-foreground">
              Main Collection Minting
            </p>
            <div className="space-y-1.5">
              <Label htmlFor="main-mint-payout">Mint payout account ID</Label>
              <Input
                id="main-mint-payout"
                value={mainMintPayout}
                onChange={(e) => setMainMintPayout(e.target.value)}
                placeholder="64-character ICP account hex"
                className="font-mono text-xs"
                data-ocid="admin.mint_config.main_payout_input"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="main-mint-price">Mint price (ICP)</Label>
              <Input
                id="main-mint-price"
                value={mainMintPrice}
                onChange={(e) => setMainMintPrice(e.target.value)}
                placeholder="e.g. 0.25"
                data-ocid="admin.mint_config.main_price_input"
              />
            </div>
            <div className="flex items-center justify-between gap-4">
              <Label htmlFor="main-mint-enabled">Enable public mint</Label>
              <Switch
                id="main-mint-enabled"
                checked={mainMintEnabled}
                onCheckedChange={setMainMintEnabled}
                data-ocid="admin.mint_config.main_enabled_switch"
              />
            </div>
            <div className="flex items-center justify-between gap-4">
              <Label htmlFor="main-dividends-enabled">Enable dividends</Label>
              <Switch
                id="main-dividends-enabled"
                checked={mainMintDividendsEnabled}
                onCheckedChange={setMainMintDividendsEnabled}
                data-ocid="admin.mint_config.main_dividends_switch"
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-3">
          <p className="text-sm font-semibold text-foreground">
            Dedicated Collection Canisters
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="collection-cycles">Cycles per new canister</Label>
              <Input
                id="collection-cycles"
                inputMode="numeric"
                value={collectionCanisterCycles}
                onChange={(e) => setCollectionCanisterCycles(e.target.value)}
                data-ocid="admin.mint_config.collection_cycles_input"
              />
              <p className="text-xs text-muted-foreground">
                Values below {formatCycles(MIN_COLLECTION_CANISTER_CYCLES)} are
                raised automatically so the child canister has enough cycles to
                install its WASM module.
              </p>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="collection-wasm">Collection canister WASM</Label>
              <Input
                id="collection-wasm"
                type="file"
                accept=".wasm,application/wasm,application/octet-stream"
                onChange={(e) =>
                  void handleWasmFile(e.target.files?.[0] ?? null)
                }
                data-ocid="admin.mint_config.wasm_input"
              />
              <p className="text-xs text-muted-foreground">
                {wasmFileName ||
                  (mintConfig?.collectionCanisterWasmUploaded
                    ? "A collection canister template is stored"
                    : "Upload src/backend/dist/collection_nft.wasm after build")}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap justify-end gap-2">
            <Button
              variant="secondary"
              onClick={() => upgradeDedicatedCollectionsMutation.mutate()}
              disabled={
                upgradeDedicatedCollectionsMutation.isPending ||
                !mintConfig?.collectionCanisterWasmUploaded
              }
              className="gap-2"
              data-ocid="admin.mint_config.upgrade_dedicated_wasms_button"
            >
              {upgradeDedicatedCollectionsMutation.isPending ? (
                <LoaderCircle size={15} className="animate-spin" />
              ) : (
                <RefreshCw size={15} />
              )}
              Update Existing Canisters
            </Button>
            <Button
              variant="outline"
              onClick={() => wasmMutation.mutate()}
              disabled={!wasmBytes || wasmMutation.isPending}
              className="gap-2"
              data-ocid="admin.mint_config.wasm_submit_button"
            >
              {wasmMutation.isPending ? (
                <LoaderCircle size={15} className="animate-spin" />
              ) : (
                <Layers size={15} />
              )}
              Upload WASM
            </Button>
          </div>
        </div>

        <Separator />

        <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Shield size={15} className="text-primary" />
                OpenAI Image Moderation
              </p>
              <p className="text-xs text-muted-foreground">
                Checks uploaded JPG/PNG images and mint metadata before any ICP
                transfer is attempted.
              </p>
              <p className="text-xs text-muted-foreground">
                Moderation uses OpenAI{" "}
                <span className="font-mono">omni-moderation-latest</span> and
                checks images, title, description, and metadata before any ICP
                transfer.
              </p>
            </div>
            {moderationConfigLoading ? (
              <Skeleton className="h-6 w-24 rounded-full" />
            ) : (
              <Badge
                variant={
                  moderationConfig?.apiKeyConfigured ? "secondary" : "outline"
                }
              >
                {moderationConfig?.apiKeyConfigured
                  ? "OpenAI key set"
                  : "No key"}
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="moderation-api-key">OpenAI API key</Label>
              <Input
                id="moderation-api-key"
                type="password"
                value={moderationApiKey}
                onChange={(e) => {
                  setModerationApiKey(e.target.value);
                  if (e.target.value.trim()) setClearModerationApiKey(false);
                }}
                placeholder={
                  moderationConfig?.apiKeyConfigured
                    ? "Leave blank to keep current key"
                    : "sk-..."
                }
                data-ocid="admin.moderation.api_key_input"
              />
            </div>
          </div>

          {moderationConfig?.apiKeyConfigured && (
            <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-background/60 p-3">
              <Label htmlFor="moderation-clear-key">
                Clear stored OpenAI key on save
              </Label>
              <Switch
                id="moderation-clear-key"
                checked={clearModerationApiKey}
                onCheckedChange={(checked) => {
                  setClearModerationApiKey(checked);
                  if (checked) setModerationApiKey("");
                }}
                data-ocid="admin.moderation.clear_key_switch"
              />
            </div>
          )}

          <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-background/60 p-3">
            <Label htmlFor="moderation-enabled">Enable moderation</Label>
            <Switch
              id="moderation-enabled"
              checked={moderationEnabled}
              onCheckedChange={setModerationEnabled}
              data-ocid="admin.moderation.enabled_switch"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {moderationCategoryLabels.map((category) => (
              <div
                key={category.key}
                className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background/60 p-3"
              >
                <Label
                  htmlFor={`moderation-${category.key}`}
                  className="text-xs"
                >
                  {category.label}
                </Label>
                <Switch
                  id={`moderation-${category.key}`}
                  checked={moderationCategories[category.key]}
                  onCheckedChange={(checked) =>
                    setModerationCategory(category.key, checked)
                  }
                  data-ocid={`admin.moderation.category.${category.key}`}
                />
              </div>
            ))}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="moderation-message">User policy message</Label>
            <Textarea
              id="moderation-message"
              rows={3}
              value={moderationMessage}
              onChange={(e) => setModerationMessage(e.target.value)}
              data-ocid="admin.moderation.message_textarea"
            />
          </div>

          <div className="flex justify-end">
            <Button
              variant="secondary"
              onClick={() => moderationMutation.mutate()}
              disabled={moderationMutation.isPending}
              className="gap-2"
              data-ocid="admin.moderation.submit_button"
            >
              {moderationMutation.isPending ? (
                <>
                  <LoaderCircle size={15} className="animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Moderation"
              )}
            </Button>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            onClick={() => saveMutation.mutate()}
            disabled={saveMutation.isPending}
            className="gap-2"
            data-ocid="admin.mint_config.submit_button"
          >
            {saveMutation.isPending ? (
              <>
                <LoaderCircle size={15} className="animate-spin" />
                Saving...
              </>
            ) : (
              "Save Mint Settings"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── AddCollectionForm ────────────────────────────────────────────────────────

interface FormValues {
  name: string;
  symbol: string;
  description: string;
  canisterId: string;
  standard: string;
  otherStandard: string;
  imageUrl: string;
  totalSupply: string;
  tokenIndexOffset: string;
}

const defaultForm: FormValues = {
  name: "",
  symbol: "",
  description: "",
  canisterId: "",
  standard: "EXT",
  otherStandard: "",
  imageUrl: "",
  totalSupply: "",
  tokenIndexOffset: "",
};

interface FormErrors {
  name?: string;
  symbol?: string;
  description?: string;
  canisterId?: string;
  imageUrl?: string;
}

function AddCollectionForm({ onSuccess }: { onSuccess: () => void }) {
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  const [form, setForm] = useState<FormValues>(defaultForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [imageDataUrl, setImageDataUrl] = useState("");
  const [imageFileName, setImageFileName] = useState("");
  const [imageFileInputKey, setImageFileInputKey] = useState(0);
  const [previewImg, setPreviewImg] = useState("");
  const [previewError, setPreviewError] = useState(false);
  const [expanded, setExpanded] = useState(true);

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
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
        buildBrowseInfoFromInputs(values.totalSupply, values.tokenIndexOffset),
      );
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["collections"] });
      toast.success("Collection added successfully!");
      setForm(defaultForm);
      setImageDataUrl("");
      setImageFileName("");
      setImageFileInputKey((current) => current + 1);
      setPreviewImg("");
      setErrors({});
      onSuccess();
    },
    onError: (err: unknown) => {
      toast.error(`Failed to add collection: ${extractError(err)}`);
    },
  });

  function validate(imageValue: string): boolean {
    const e: FormErrors = {};
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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const imageValue = (imageDataUrl || form.imageUrl).trim();
    if (!validate(imageValue)) return;
    mutation.mutate({ ...form, imageUrl: imageValue });
  }

  function set(field: keyof FormValues, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  function setImageUrl(value: string) {
    if (imageDataUrl) {
      setImageFileInputKey((current) => current + 1);
    }
    setImageDataUrl("");
    setImageFileName("");
    set("imageUrl", value);
  }

  async function handleCollectionImageFile(file: File | null) {
    if (!file) return;
    try {
      const dataUrl = await readImageFileAsDataUrl(file);
      setImageDataUrl(dataUrl);
      setImageFileName(file.name);
      set("imageUrl", "");
      setPreviewImg(dataUrl);
      setPreviewError(false);
    } catch (err) {
      toast.error(extractError(err));
    }
  }

  function handleImageBlur() {
    setPreviewError(false);
    setPreviewImg(form.imageUrl.trim());
  }

  const previewImage = imageDataUrl || previewImg;
  const previewImageUrl = resolveImageUrl(previewImage);

  return (
    <Card className="border-primary/20 bg-card">
      <CardHeader
        className="cursor-pointer select-none pb-3"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Plus size={16} className="text-primary" />
            </div>
            <div>
              <CardTitle className="text-base">Add New Collection</CardTitle>
              <CardDescription className="text-xs">
                Manually curate a supported ICP NFT collection into Mintlab
              </CardDescription>
            </div>
          </div>
          <ChevronDown
            size={16}
            className={`text-muted-foreground transition-transform ${expanded ? "rotate-180" : ""}`}
          />
        </div>
      </CardHeader>

      {expanded && (
        <CardContent>
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Row 1: Name + Symbol */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="col-name">
                  Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="col-name"
                  placeholder="e.g. Bored Apes ICP"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  data-ocid="admin.add_collection.name_input"
                />
                {errors.name && (
                  <p
                    className="text-xs text-destructive"
                    data-ocid="admin.add_collection.name_field_error"
                  >
                    {errors.name}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="col-symbol">
                  Symbol <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="col-symbol"
                  placeholder="e.g. BAPE"
                  value={form.symbol}
                  onChange={(e) => set("symbol", e.target.value.toUpperCase())}
                  data-ocid="admin.add_collection.symbol_input"
                />
                {errors.symbol && (
                  <p
                    className="text-xs text-destructive"
                    data-ocid="admin.add_collection.symbol_field_error"
                  >
                    {errors.symbol}
                  </p>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label htmlFor="col-desc">
                Description <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="col-desc"
                placeholder="Brief description of the collection…"
                rows={2}
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                data-ocid="admin.add_collection.description_textarea"
              />
              {errors.description && (
                <p
                  className="text-xs text-destructive"
                  data-ocid="admin.add_collection.description_field_error"
                >
                  {errors.description}
                </p>
              )}
            </div>

            {/* Row 2: Canister ID + Standard */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="col-canister">
                  Canister ID <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="col-canister"
                  placeholder="e.g. rrkah-fqaaa-aaaaa-aaaaq-cai"
                  value={form.canisterId}
                  onChange={(e) => set("canisterId", e.target.value)}
                  className="font-mono text-sm"
                  data-ocid="admin.add_collection.canister_id_input"
                />
                {errors.canisterId && (
                  <p
                    className="text-xs text-destructive"
                    data-ocid="admin.add_collection.canister_id_field_error"
                  >
                    {errors.canisterId}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="col-standard">
                  NFT Standard <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={form.standard}
                  onValueChange={(v) => set("standard", v)}
                >
                  <SelectTrigger
                    id="col-standard"
                    data-ocid="admin.add_collection.standard_select"
                  >
                    <SelectValue placeholder="Select standard" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EXT">EXT (Entrepot)</SelectItem>
                    <SelectItem value="DIP721">DIP721</SelectItem>
                    <SelectItem value="ICRC7">ICRC-7</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {form.standard === "Other" && (
                  <Input
                    placeholder="Custom standard name"
                    value={form.otherStandard}
                    onChange={(e) => set("otherStandard", e.target.value)}
                    className="mt-1.5"
                    data-ocid="admin.add_collection.other_standard_input"
                  />
                )}
                <p className="text-xs text-muted-foreground">
                  Most Entrepot collections use EXT. Modern ICP NFT ledgers may
                  use ICRC-7 instead.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="col-total-supply">Collection size</Label>
                <Input
                  id="col-total-supply"
                  inputMode="numeric"
                  placeholder="e.g. 1000"
                  value={form.totalSupply}
                  onChange={(e) => set("totalSupply", e.target.value)}
                  data-ocid="admin.add_collection.total_supply_input"
                />
                <p className="text-xs text-muted-foreground">
                  Recommended when the collection does not provide a reliable
                  token list.
                </p>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="col-token-offset">First token index</Label>
                <Input
                  id="col-token-offset"
                  inputMode="numeric"
                  placeholder="Default: 0"
                  value={form.tokenIndexOffset}
                  onChange={(e) => set("tokenIndexOffset", e.target.value)}
                  data-ocid="admin.add_collection.token_offset_input"
                />
                <p className="text-xs text-muted-foreground">
                  Use 1 if token IDs start at 1 instead of 0.
                </p>
              </div>
            </div>

            {/* Image + preview */}
            <div className="space-y-1.5">
              <Label htmlFor="col-image-file">
                Collection image <span className="text-destructive">*</span>
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-3 items-end">
                <div className="space-y-1">
                  <Input
                    key={imageFileInputKey}
                    id="col-image-file"
                    type="file"
                    accept={MODERATION_IMAGE_ACCEPT}
                    onChange={(e) =>
                      void handleCollectionImageFile(
                        e.target.files?.[0] ?? null,
                      )
                    }
                    data-ocid="admin.add_collection.image_file_input"
                  />
                  <p className="text-xs text-muted-foreground">
                    {imageFileName || "Choose an image from this device"}
                  </p>
                </div>
                <div className="space-y-1">
                  <Label
                    htmlFor="col-image"
                    className="text-xs text-muted-foreground"
                  >
                    Or image URL
                  </Label>
                  <Input
                    id="col-image"
                    placeholder="https://… or ipfs://…"
                    value={form.imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    onBlur={handleImageBlur}
                    data-ocid="admin.add_collection.image_url_input"
                  />
                  {errors.imageUrl && (
                    <p
                      className="text-xs text-destructive"
                      data-ocid="admin.add_collection.image_url_field_error"
                    >
                      {errors.imageUrl}
                    </p>
                  )}
                </div>
                {/* preview */}
                <div className="w-14 h-14 rounded-lg border border-border bg-muted flex items-center justify-center overflow-hidden shrink-0">
                  {previewImageUrl && !previewError ? (
                    <img
                      src={previewImageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={() => setPreviewError(true)}
                    />
                  ) : (
                    <ExternalLink size={16} className="text-muted-foreground" />
                  )}
                </div>
              </div>
            </div>

            <Separator />

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={mutation.isPending}
                data-ocid="admin.add_collection.submit_button"
                className="gap-2"
              >
                {mutation.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Adding…
                  </>
                ) : (
                  <>
                    <Plus size={15} />
                    Add Collection
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      )}
    </Card>
  );
}

// ─── AdminPage ────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const navigate = useNavigate();
  const { isAdmin, isLoading: adminLoading } = useAdmin();
  const { actor, isFetching } = useBackend();
  const queryClient = useQueryClient();
  const [collectionSearch, setCollectionSearch] = useState("");

  const { data: collections, isLoading: collectionsLoading } = useQuery({
    queryKey: ["collections"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listCollections();
    },
    enabled: !!actor && !isFetching,
  });

  const { data: collectionImportMetas = [] } = useQuery({
    queryKey: ["collectionImportMetas"],
    queryFn: async () => {
      if (!actor) return [];
      const metas: CollectionImportMeta[] = [];
      let cursor: bigint | null = null;
      do {
        const page = await actor.listCollectionImportMetasPage(cursor, 100n);
        metas.push(...page.metas);
        cursor = page.nextCursor;
      } while (cursor !== null);
      return metas;
    },
    enabled: !!actor && !isFetching && isAdmin,
  });

  const collectionImportMetaById = useMemo(() => {
    const map = new Map<string, CollectionImportMeta>();
    for (const meta of collectionImportMetas) {
      map.set(meta.collectionId.toString(), meta);
    }
    return map;
  }, [collectionImportMetas]);

  const filteredCollections = useMemo(() => {
    const allCollections = collections ?? [];
    const q = collectionSearch.trim().toLowerCase();
    if (!q) return allCollections;
    return allCollections.filter((collection) => {
      const meta = collectionImportMetaById.get(collection.id.toString());
      const status =
        meta?.trustStatus ??
        (collection.kind === "Minted" ? "Verified" : "CommunityImported");
      return [
        collection.name,
        collection.symbol,
        collection.canisterId.toString(),
        collection.id.toString(),
        collection.kind,
        standardLabel(collection.standard),
        collectionTrustLabel(status),
      ]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [collectionImportMetaById, collectionSearch, collections]);

  const removeMutation = useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Backend not ready");
      const ok = await actor.removeCollection(id);
      if (!ok) throw new Error("Collection could not be removed");
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["collections"] });
      void queryClient.invalidateQueries({
        queryKey: ["collectionImportMetas"],
      });
      toast.success("Collection removed.");
    },
    onError: (err: unknown) => {
      toast.error(`Failed to remove collection: ${extractError(err)}`);
    },
  });

  // Redirect non-admins once we know they're not admin
  const redirected = useRef(false);
  if (!adminLoading && !isAdmin && !redirected.current) {
    redirected.current = true;
    void navigate({ to: "/wallet" });
    return null;
  }

  const isLoading = adminLoading || collectionsLoading;
  const count = collections?.length ?? 0;
  const filteredCount = filteredCollections.length;

  return (
    <div
      className="max-w-4xl mx-auto px-4 py-8 space-y-6"
      data-ocid="admin.page"
    >
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Shield size={20} className="text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground leading-tight">
              Admin Dashboard
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage Mintlab settings and collection curation
            </p>
          </div>
          {!isLoading && (
            <div className="ml-auto flex items-center gap-2 bg-muted/60 rounded-lg px-3 py-1.5">
              <Layers size={14} className="text-primary" />
              <span className="text-sm font-semibold text-foreground">
                {count}
              </span>
              <span className="text-xs text-muted-foreground">
                {count === 1 ? "collection" : "collections"}
              </span>
            </div>
          )}
        </div>
      </div>

      <AppHealthSection />

      {/* Add Collection form */}
      <AddCollectionForm onSuccess={() => {}} />

      <MintConfigForm />

      <MarketplaceEscrowRepairPanel />

      <CollectionCreationRequestsPanel />

      {/* Collection Setup Guide */}
      <CollectionSetupGuide />

      {/* Collections list */}
      <div className="space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Registered Collections
            </h2>
            {!isLoading && collectionSearch.trim() && (
              <p className="mt-1 text-xs text-muted-foreground">
                Showing {filteredCount} of {count}
              </p>
            )}
          </div>
          <div className="relative sm:w-80">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={collectionSearch}
              onChange={(event) => setCollectionSearch(event.target.value)}
              placeholder="Search name, canister, status"
              className="pl-9"
              data-ocid="admin.collections.search"
            />
          </div>
        </div>

        {isLoading ? (
          <div
            className="space-y-2"
            data-ocid="admin.collections.loading_state"
          >
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 rounded-xl" />
            ))}
          </div>
        ) : count === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-16 rounded-2xl border border-dashed border-border bg-muted/20"
            data-ocid="admin.collections.empty_state"
          >
            <Layers size={40} className="text-muted-foreground/40 mb-3" />
            <p className="text-sm font-semibold text-muted-foreground">
              No collections yet
            </p>
            <p className="text-xs text-muted-foreground/70 mt-1">
              Use the form above to register the first NFT collection.
            </p>
          </div>
        ) : filteredCount === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-12 rounded-2xl border border-dashed border-border bg-muted/20"
            data-ocid="admin.collections.no_search_results"
          >
            <Search size={32} className="text-muted-foreground/40 mb-3" />
            <p className="text-sm font-semibold text-muted-foreground">
              No collections match that search
            </p>
          </div>
        ) : (
          <div className="space-y-2" data-ocid="admin.collections.list">
            {filteredCollections.map((col, i) => (
              <CollectionRow
                key={col.id.toString()}
                collection={col}
                importMeta={collectionImportMetaById.get(col.id.toString())}
                index={i + 1}
                onRemove={(id) => removeMutation.mutate(id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
