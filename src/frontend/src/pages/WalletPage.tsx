import { AppCanisterTopUpDialog } from "@/components/AppCanisterTopUpDialog";
import { CollectionBadge } from "@/components/CollectionBadge";
import { DividendBalanceBadge } from "@/components/DividendBalanceBadge";
import { EmptyState } from "@/components/EmptyState";
import { HelpCallout, HelpTooltip } from "@/components/HelpCallout";
import { MediaImage } from "@/components/MediaImage";
import { NFTCard } from "@/components/NFTCard";
import { PaymentConfirmationDialog } from "@/components/PaymentConfirmationDialog";
import { TermsAgreementNotice } from "@/components/TermsAcceptance";
import { ZoomableMediaImage } from "@/components/ZoomableMediaImage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useAdmin } from "@/hooks/use-admin";
import { useAuth } from "@/hooks/use-auth";
import { useBackend } from "@/hooks/use-backend";
import {
  COMMUNITY_COLLECTION_NOTICE,
  collectionMetaMap,
  collectionTrustStatus,
  isMintlabVerifiedCollection,
} from "@/lib/collection-trust";
import { isLowCyclesError } from "@/lib/cycles";
import { transferRegisteredNFT } from "@/lib/external-nft-transfer";
import { compressModerationImage } from "@/lib/imageUtils";
import { resolveImageUrl } from "@/lib/media";
import {
  WITHDRAW_TO_EXTERNAL_WALLET_LABEL,
  nftCustodyClass,
  nftCustodyDescription,
  nftCustodyLabel,
} from "@/lib/nft-custody";
import {
  getNFTDisplayName,
  getNFTDisplayTokenId,
  getNFTTokenLabel,
  getNFTVisibleAttributes,
} from "@/lib/nft-display";
import type {
  ActiveListingDetail,
  Collection,
  CollectionImportMeta,
  CollectionIndexPageResult,
  CollectionIndexStatus,
  CollectionSyncReadiness,
  CollectionTrustStatus,
  MintConfig,
  NFTDividend,
  NFTMetadata,
  NFTStats,
  PendingMintPaymentView,
  PublicModerationConfig,
  RecentTransaction,
  WalletCollectionSyncProgress,
  WalletNFT,
  WalletSyncSkip,
  WalletSyncV2Result,
  backendInterface,
} from "@/types";
import { Principal } from "@icp-sdk/core/principal";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Check,
  CheckCircle2,
  Coins,
  Copy,
  ExternalLink,
  Flag,
  History,
  ImagePlus,
  Info,
  Layers,
  LogIn,
  Plus,
  RefreshCw,
  Send,
  Sparkles,
  Tag,
  Wallet,
} from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

// ── helpers ────────────────────────────────────────────────────────────────

const MAX_ON_CHAIN_IMAGE_CHARS = 1_900_000;
const MODERATION_IMAGE_ACCEPT = "image/png,image/jpeg";

function accountIdToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function truncate(s: string, head = 6, tail = 4): string {
  if (s.length <= head + tail + 3) return s;
  return `${s.slice(0, head)}...${s.slice(-tail)}`;
}

function extractError(err: unknown): string {
  if (err === null || err === undefined) return "An unexpected error occurred";
  if (typeof err === "string") return err || "An unexpected error occurred";
  if (err instanceof Error)
    return err.message || "An unexpected error occurred";
  if (typeof err === "object") {
    const obj = err as Record<string, unknown>;
    if (typeof obj.message === "string") return obj.message;
    try {
      return JSON.stringify(obj) || "An unexpected error occurred";
    } catch {
      return "An unexpected error occurred";
    }
  }
  return String(err) || "An unexpected error occurred";
}

function isSupportedModerationImageFile(file: File): boolean {
  return (
    file.type === "image/png" ||
    file.type === "image/jpeg" ||
    /\.(png|jpe?g)$/i.test(file.name)
  );
}

const E8S = 100_000_000n;
const ICP_LEDGER_FEE_E8S = 10_000n;
const SYNC_TIMEOUT_MS = 45_000;
const SYNC_STILL_RUNNING_MESSAGE =
  "Wallet sync is still checking imported collections. New NFTs found during sync will appear here shortly.";
const SYNC_PAGE_TIMEOUT_MESSAGE =
  "This sync page is taking longer than expected. Mintlab saved progress and will continue on the next Sync.";
const SYNC_PAGE_COLLECTION_LIMIT = 2n;
const TARGET_SYNC_INDEX_PAGE_LIMIT = 3n;
const MAX_SYNC_PAGES_PER_CLICK = 5;
const SYNC_SLOW_NOTICE_MS = 15_000;
const SYNC_REFRESH_INTERVAL_MS = 6_000;
const SYNC_FINISHED_STATUS_CLEAR_MS = 6_000;
const WALLET_NFT_PAGE_SIZE = 50n;
const WALLET_COLLECTION_PAGE_SIZE = 50n;
const WALLET_LISTING_PAGE_SIZE = 25n;
const WALLET_DIVIDEND_PAGE_SIZE = 25n;

function formatICP(e8s: bigint): string {
  const whole = e8s / E8S;
  const frac = (e8s % E8S).toString().padStart(8, "0").replace(/0+$/, "");
  return frac ? `${whole}.${frac}` : whole.toString();
}

function formatTransactionTime(timestampNanos: bigint): string {
  const date = new Date(Number(timestampNanos / 1_000_000n));
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function nftTransactionIcon(tx: RecentTransaction) {
  if (tx.direction === "In") {
    return <ArrowDownLeft className="h-4 w-4 text-emerald-500" />;
  }
  return <ArrowUpRight className="h-4 w-4 text-amber-500" />;
}

function nftTransactionLabel(tx: RecentTransaction): string {
  if (tx.amountE8s !== null) {
    const prefix =
      tx.direction === "In" ? "+" : tx.direction === "Out" ? "-" : "";
    return `${prefix}${formatICP(tx.amountE8s)} ICP`;
  }
  if (tx.direction === "In") return "Received";
  if (tx.direction === "Out") return "Sent";
  return "Updated";
}

function pendingMintStatusLabel(status: PendingMintPaymentView["status"]) {
  if (status === "PaymentPending") return "Payment pending";
  if (status === "PaymentSent") return "Mint retry ready";
  if (status === "Minted") return "Minted";
  return "Needs review";
}

function buildLoadedNFTStats(nfts: WalletNFT[], totalCount: bigint): NFTStats {
  const counts = new Map<bigint, bigint>();
  for (const nft of nfts) {
    counts.set(nft.collectionId, (counts.get(nft.collectionId) ?? 0n) + 1n);
  }
  return {
    totalCount,
    perCollection: Array.from(counts.entries()),
  };
}

function parseAttributeLines(value: string): Array<[string, string]> {
  const seen = new Set<string>();
  const attributes: Array<[string, string]> = [];
  for (const rawLine of value.split("\n")) {
    const line = rawLine.trim();
    if (!line) continue;
    const separator =
      line.indexOf(":") === -1 ? line.indexOf("=") : line.indexOf(":");
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

function nftKey(collectionId: bigint, tokenId: string): string {
  return `${collectionId.toString()}:${tokenId}`;
}

function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  message: string,
): Promise<T> {
  return new Promise((resolve, reject) => {
    const timeout = window.setTimeout(
      () => reject(new Error(message)),
      timeoutMs,
    );
    promise.then(resolve, reject).finally(() => window.clearTimeout(timeout));
  });
}

function summarizeSyncErrors(errors: string[]): string {
  const uniqueErrors = Array.from(
    new Set(errors.map((error) => error.trim()).filter(Boolean)),
  );
  if (uniqueErrors.length === 0) {
    return "Some collections could not be checked.";
  }
  if (uniqueErrors.length === 1) {
    return uniqueErrors[0];
  }
  return `${uniqueErrors.length} collections could not be checked. First issue: ${uniqueErrors[0]}`;
}

function summarizeSyncSkipped(skipped: WalletSyncSkip[]): string {
  if (skipped.length === 0) {
    return "";
  }
  const indexing = skipped.filter(isAutoIndexingSkip);
  const needsSetup = skipped.filter((skip) => !isAutoIndexingSkip(skip));
  if (needsSetup.length === 0) {
    return indexing.length === 1
      ? `${indexing[0].collectionName} is still indexing automatically.`
      : `${indexing.length} imported collections are still indexing automatically.`;
  }
  if (needsSetup.length === 1) {
    return `${needsSetup[0].collectionName} needs one more check. Select it in the sync menu and click Sync selected, or import the token ID directly.`;
  }
  return `${needsSetup.length} imported collections need one more check. Select a collection in the sync menu and click Sync selected, or import a token ID directly.`;
}

function summarizeSyncAttention(
  errors: string[],
  skipped: WalletSyncSkip[],
): string {
  if (errors.length > 0) {
    return summarizeSyncErrors(errors);
  }
  return summarizeSyncSkipped(skipped);
}

function isAutoIndexingSkip(skip: WalletSyncSkip): boolean {
  return skip.reason === "INDEXING_IN_PROGRESS";
}

function selectedSyncProgressMessage(
  progress: WalletCollectionSyncProgress,
  collection?: Collection | null,
): string {
  const checkedDirectHint =
    progress.directHintChecked &&
    progress.scannedThisRun === 0n &&
    progress.indexedThisRun === 0n &&
    progress.nextCursor === null;
  if (checkedDirectHint && progress.errors.length > 0) {
    return "Selected sync checked the token ID directly and could not verify it in the expected wallet account.";
  }
  if (checkedDirectHint && progress.newCount > 0n) {
    return "Selected sync verified the token ID directly and registered it.";
  }
  if (checkedDirectHint) {
    return "Selected sync checked the token ID directly. The wider collection index is still not complete.";
  }
  const scannedTotal = progress.status?.scanned ?? progress.scannedThisRun;
  const totalSupply = collection?.browseInfo?.totalSupply ?? null;
  const isExtRegistryCheck =
    collection?.standard.__kind__ === "EXT" && totalSupply == null;
  const scope =
    totalSupply != null
      ? `${scannedTotal.toString()} of ${totalSupply.toString()} tokens`
      : isExtRegistryCheck
        ? `${scannedTotal.toString()} registry entries`
        : `${scannedTotal.toString()} token positions`;
  if (progress.complete) {
    return isExtRegistryCheck
      ? `Selected sync checked ${scope} from this EXT collection and finished.`
      : `Selected sync checked ${scope} and finished this collection.`;
  }
  return `Selected sync checked ${scope}. Continue Sync selected to keep checking this collection, or enter a known token ID to verify it directly.`;
}

function nftStandardLabel(collection?: Collection | null): string {
  if (!collection) return "Collection";
  const standard = collection.standard;
  if (standard.__kind__ === "Other") return standard.Other;
  return standard.__kind__;
}

function readinessStatusLabel(
  readiness: CollectionSyncReadiness | null | undefined,
  collection?: Collection | null,
): string {
  if (!readiness) {
    if (
      collection?.kind === "External" &&
      collection.browseInfo?.totalSupply == null
    ) {
      return "Needs safe indexing setup";
    }
    return "Ready";
  }
  if (!readiness.allowsSync) return "Sync disabled";
  if (readiness.indexStatus?.complete) return "Indexed";
  if ((readiness.indexStatus?.scanned ?? 0n) > 0n) {
    return "Indexing in progress";
  }
  if (!readiness.hasBrowseInfo && collection?.standard.__kind__ !== "ICRC7") {
    return "Needs safe indexing setup";
  }
  return "Ready for selected sync";
}

function isSyncAlreadyRunningMessage(message: string): boolean {
  return message.toLowerCase().includes("wallet sync is already running");
}

function isAgentProcessingTimeoutMessage(message: string): boolean {
  return (
    message.includes("Request timed out") &&
    message.includes("Request status: processing")
  );
}

// ── CopyField ─────────────────────────────────────────────────────────────

interface CopyFieldProps {
  label: string;
  value: string;
  ocid: string;
}

function CopyField({ label, value, ocid }: CopyFieldProps) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
      toast.success(`${label} copied`);
    });
  }

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        {label}
      </span>
      <div className="flex items-center gap-2 bg-muted/40 border border-border rounded-lg px-3 py-2">
        <span className="font-mono text-sm text-foreground truncate flex-1 min-w-0">
          {value}
        </span>
        <Button
          size="icon"
          variant="ghost"
          className="shrink-0 w-7 h-7 text-muted-foreground hover:text-foreground"
          onClick={handleCopy}
          aria-label={`Copy ${label}`}
          data-ocid={ocid}
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-accent" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
        </Button>
      </div>
    </div>
  );
}

// ── RecentNFTTransactionsCard ──────────────────────────────────────────────

interface RecentNFTTransactionsCardProps {
  transactions: RecentTransaction[];
  isLoading: boolean;
}

function RecentNFTTransactionRow({ tx }: { tx: RecentTransaction }) {
  const label = nftTransactionLabel(tx);

  return (
    <div className="flex min-w-0 items-center gap-3 overflow-hidden py-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border/60 bg-muted/40">
        {nftTransactionIcon(tx)}
      </div>
      <div className="min-w-0 flex-1 overflow-hidden">
        <div className="flex min-w-0 max-w-full items-center gap-2 overflow-hidden">
          <p className="min-w-0 truncate text-sm font-medium text-foreground">
            {tx.title}
          </p>
          {tx.status !== "Completed" && (
            <Badge
              variant="outline"
              className="shrink-0 px-1.5 py-0 text-[10px]"
            >
              {tx.status}
            </Badge>
          )}
        </div>
        <p
          className="min-w-0 max-w-full truncate text-xs text-muted-foreground"
          title={tx.detail}
        >
          {tx.detail}
        </p>
        <p className="mt-1 truncate text-[11px] text-muted-foreground">
          {formatTransactionTime(tx.occurredAt)}
        </p>
      </div>
      <Badge
        variant="secondary"
        className="max-w-[112px] shrink-0 overflow-hidden truncate font-mono text-[10px]"
        title={label}
      >
        {label}
      </Badge>
    </div>
  );
}

function RecentNFTTransactionsCard({
  transactions,
  isLoading,
}: RecentNFTTransactionsCardProps) {
  return (
    <Card
      className="min-w-0 overflow-hidden border-border/50 bg-card shadow-sm"
      data-ocid="wallet.recent_nft_transactions_card"
    >
      <CardHeader className="min-w-0 pb-3">
        <CardTitle className="flex min-w-0 items-center justify-between text-sm font-medium text-muted-foreground uppercase tracking-wider">
          <span className="flex min-w-0 items-center gap-2">
            <History className="h-4 w-4 text-accent" />
            NFT Activity
          </span>
          {transactions.length > 0 && (
            <Badge variant="secondary" className="font-mono text-[10px]">
              {transactions.length}/10
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="min-w-0 overflow-hidden">
        {isLoading ? (
          <div
            className="grid min-w-0 gap-0 overflow-hidden md:grid-cols-2 md:gap-x-6"
            data-ocid="wallet.nft_transactions_loading_state"
          >
            {[0, 1, 2, 3].map((row) => (
              <div
                key={row}
                className={
                  row > 1
                    ? "hidden min-w-0 overflow-hidden md:block"
                    : "min-w-0 overflow-hidden"
                }
              >
                <div className="flex min-w-0 items-center gap-3 overflow-hidden py-3">
                  <Skeleton className="h-9 w-9 rounded-md" />
                  <div className="min-w-0 flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-56 max-w-full" />
                  </div>
                  <Skeleton className="h-5 w-16 shrink-0 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <div
            className="flex flex-col items-center gap-2 py-6 text-center text-sm text-muted-foreground"
            data-ocid="wallet.nft_transactions_empty_state"
          >
            <History className="h-5 w-5" />
            <span>No NFT activity yet.</span>
          </div>
        ) : (
          <div
            className="grid min-w-0 gap-0 overflow-hidden md:grid-cols-2 md:gap-x-6"
            data-ocid="wallet.nft_transactions_list"
          >
            {transactions.map((tx, index) => (
              <div
                key={tx.id.toString()}
                className={
                  index === 0
                    ? "min-w-0 overflow-hidden"
                    : index === 1
                      ? "min-w-0 overflow-hidden border-t border-border/50 md:border-t-0"
                      : "min-w-0 overflow-hidden border-t border-border/50"
                }
              >
                <RecentNFTTransactionRow tx={tx} />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ── SendNFTModal ───────────────────────────────────────────────────────────

interface SendNFTModalProps {
  open: boolean;
  onClose: () => void;
  nft: WalletNFT;
  collection?: Collection;
}

function SendNFTModal({ open, onClose, nft, collection }: SendNFTModalProps) {
  const { actor } = useBackend();
  const { principal } = useAuth();
  const queryClient = useQueryClient();
  const [recipient, setRecipient] = useState("");
  const [recipientError, setRecipientError] = useState("");

  const nftName = getNFTDisplayName(nft, collection);
  const isRegisteredExternal = nft.location === "Registered";
  const isVaultedExternal = nft.location === "Vaulted";
  const actionLabel = isVaultedExternal
    ? WITHDRAW_TO_EXTERNAL_WALLET_LABEL
    : "Send NFT";

  function validateRecipient(value: string): string {
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
            "Collection information is required for this transfer",
          );
        }
        if (!principal) {
          throw new Error("You must be logged in to send this NFT");
        }
        const message = await transferRegisteredNFT({
          agent: actor.getAgent(),
          collection,
          nft,
          owner: principal,
          recipient: recipientPrincipal,
        });
        try {
          const recipientSync = await withTimeout(
            actor.syncExternalNFTOwner(
              collection.id,
              nft.tokenId,
              recipientPrincipal,
            ),
            SYNC_TIMEOUT_MS,
            "The transfer succeeded, but recipient wallet indexing timed out. The recipient can still press Sync or import the token ID.",
          );
          if (recipientSync.__kind__ === "err") {
            console.warn(
              "[sendNFT] recipient wallet sync failed:",
              recipientSync.err,
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
      toast.success(
        isVaultedExternal
          ? "NFT withdrawn to external wallet"
          : txId || "NFT sent successfully",
      );
      const principalKey = principal?.toString();
      if (principalKey) {
        queryClient.setQueryData<WalletNFT[]>(
          ["userNFTs", principalKey],
          (current) =>
            current?.filter(
              (item) =>
                item.collectionId !== nft.collectionId ||
                item.tokenId !== nft.tokenId,
            ) ?? current,
        );
      }
      queryClient.invalidateQueries({ queryKey: ["userNFTs"] });
      queryClient.invalidateQueries({ queryKey: ["userStats"] });
      queryClient.invalidateQueries({ queryKey: ["recent-nft-transactions"] });
      setRecipient("");
      setRecipientError("");
      onClose();
    },
    onError: (err: unknown) => {
      toast.error(extractError(err));
    },
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

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent
        className="bg-card border-border max-w-md"
        data-ocid="send-nft.dialog"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-foreground flex items-center gap-2">
            <Send className="w-4 h-4 text-accent" />
            {actionLabel}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-1">
          {/* NFT preview */}
          <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl border border-border">
            <div className="w-14 h-14 rounded-lg overflow-hidden bg-muted shrink-0">
              <MediaImage
                src={nft.metadata.imageUrl}
                alt={nftName}
                assetCanisterId={collection?.canisterId.toString()}
                tokenId={nft.tokenId}
                className="w-full h-full object-cover"
                fallback={
                  <div className="w-full h-full flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-muted-foreground/40" />
                  </div>
                }
              />
            </div>
            <div className="min-w-0">
              <p className="font-display font-semibold text-sm text-foreground truncate">
                {nftName}
              </p>
              <p className="text-xs text-muted-foreground font-mono mt-0.5">
                {getNFTTokenLabel(nft, collection)}
              </p>
              {collection && (
                <CollectionBadge
                  collection={collection}
                  size="sm"
                  className="mt-1"
                />
              )}
              <Badge
                variant="secondary"
                className={`mt-1 w-fit border text-[10px] ${nftCustodyClass(nft.location)}`}
              >
                {nftCustodyLabel(nft.location)}
              </Badge>
            </div>
          </div>

          {/* Warning */}
          <div className="flex items-start gap-2 p-3 bg-destructive/5 border border-destructive/20 rounded-lg">
            <Info className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
            <p className="text-xs text-destructive leading-relaxed">
              <strong>This action cannot be undone.</strong>{" "}
              {isRegisteredExternal
                ? "This NFT will be sent directly from your connected wallet on the original collection canister."
                : isVaultedExternal
                  ? "This vaulted NFT is held by the Mintlab vault. Withdrawing transfers the original NFT from Mintlab custody to the recipient principal on the external collection canister."
                  : "The Mintlab-created NFT will be permanently transferred to the recipient's wallet."}{" "}
              Double-check the Principal ID before sending.
            </p>
          </div>

          {/* Recipient input */}
          <div className="space-y-1.5">
            <Label
              htmlFor="recipient-principal"
              className="text-sm text-foreground"
            >
              Recipient Principal ID <span className="text-destructive">*</span>
            </Label>
            <Input
              id="recipient-principal"
              placeholder="e.g. rrkah-fqaaa-aaaaa-aaaaq-cai"
              value={recipient}
              onChange={(e) => {
                setRecipient(e.target.value);
                if (recipientError)
                  setRecipientError(validateRecipient(e.target.value));
              }}
              onBlur={() => setRecipientError(validateRecipient(recipient))}
              className="bg-muted/30 border-border focus:border-accent font-mono text-sm"
              data-ocid="send-nft.recipient.input"
              disabled={mutation.isPending}
            />
            {recipientError && (
              <p
                className="text-xs text-destructive"
                data-ocid="send-nft.recipient.field_error"
              >
                {recipientError}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              The recipient must have a Principal ID (not an Account ID).
              {isVaultedExternal
                ? " Withdrawals from Mintlab custody are sent to that external wallet principal."
                : " NFT wallets on ICP use Principal IDs for NFT transfers."}
            </p>
          </div>

          <TermsAgreementNotice
            actionLabel={
              isVaultedExternal ? "withdrawing this NFT" : "sending this NFT"
            }
          />

          <div className="flex items-center justify-end gap-2 pt-1">
            <Button
              variant="ghost"
              onClick={handleClose}
              disabled={mutation.isPending}
              data-ocid="send-nft.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSend}
              disabled={!recipient.trim() || mutation.isPending}
              className="bg-accent text-accent-foreground hover:bg-accent/90 transition-smooth gap-2"
              data-ocid="send-nft.submit_button"
            >
              {mutation.isPending ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
                  Sending…
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  {actionLabel}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── NFTDetailsModal ────────────────────────────────────────────────────────

interface NFTDetailsModalProps {
  open: boolean;
  onClose: () => void;
  nft: WalletNFT;
  collection?: Collection;
  trustStatus?: CollectionTrustStatus | null;
  isListed?: boolean;
  dividendE8s?: bigint;
  onReport?: () => void;
  onSend?: () => void;
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
  onSend,
}: NFTDetailsModalProps) {
  const nftName = getNFTDisplayName(nft, collection);
  const displayTokenId = getNFTDisplayTokenId(nft, collection);
  const visibleAttributes = getNFTVisibleAttributes(nft.metadata);
  const imageUrl = resolveImageUrl(nft.metadata.imageUrl, {
    canisterId: collection?.canisterId.toString(),
    tokenId: nft.tokenId,
  });
  const canisterId = collection?.canisterId.toString() ?? "";
  const canisterUrl = canisterId
    ? `https://dashboard.internetcomputer.org/canister/${canisterId}`
    : null;

  const custodyLabel = nftCustodyLabel(nft.location);
  const custodyClass = nftCustodyClass(nft.location);
  const custodyDescription = nftCustodyDescription(nft, collection);

  return (
    <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
      <DialogContent
        className="bg-card border-border w-[calc(100vw-2rem)] max-w-3xl p-0 overflow-hidden max-h-[calc(100dvh-2rem)]"
        data-ocid="wallet.nft_details.dialog"
      >
        <div className="flex max-h-[calc(100dvh-2rem)] min-h-0 flex-col md:grid md:grid-cols-[minmax(0,0.9fr)_minmax(320px,1fr)]">
          <div className="bg-muted h-[min(42vh,360px)] shrink-0 md:h-auto md:min-h-0 flex items-center justify-center p-3">
            <ZoomableMediaImage
              src={nft.metadata.imageUrl}
              alt={nftName}
              assetCanisterId={collection?.canisterId.toString()}
              tokenId={nft.tokenId}
              viewerTitle={nftName}
              buttonClassName="h-full w-full rounded-lg"
              className="max-h-full w-full h-full object-contain rounded-lg"
              dataOcid="wallet.nft_details.image_zoom_button"
              fallback={
                <div className="w-full h-full flex items-center justify-center">
                  <Sparkles className="w-12 h-12 text-muted-foreground/35" />
                </div>
              }
            />
          </div>

          <div className="min-h-0 overflow-y-auto p-5 space-y-4">
            <DialogHeader className="space-y-2 text-left">
              <div className="flex items-center gap-2 flex-wrap">
                {isListed && (
                  <Badge className="border text-xs bg-amber-500/10 text-amber-700 border-amber-500/20">
                    Listed on Market
                  </Badge>
                )}
                <Badge
                  variant="secondary"
                  className={`border text-xs ${custodyClass}`}
                >
                  {custodyLabel}
                </Badge>
                {collection && (
                  <CollectionBadge
                    collection={collection}
                    trustStatus={trustStatus}
                    size="sm"
                  />
                )}
                <DividendBalanceBadge e8s={dividendE8s} size="md" />
                {onReport && (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="h-7 gap-1.5 text-xs"
                    onClick={onReport}
                    data-ocid="wallet.nft_details.report_button"
                  >
                    <Flag className="h-3.5 w-3.5" />
                    Report
                  </Button>
                )}
              </div>
              <DialogTitle className="font-display text-xl text-foreground break-words">
                {nftName}
              </DialogTitle>
              <p className="text-sm text-muted-foreground font-mono">
                {getNFTTokenLabel(nft, collection)}
              </p>
            </DialogHeader>

            {nft.metadata.description && (
              <p className="text-sm text-muted-foreground leading-relaxed break-words">
                {nft.metadata.description}
              </p>
            )}

            <div className="flex items-start gap-2 rounded-lg border border-border/60 bg-muted/25 p-3">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <div className="space-y-1">
                <p className="text-xs font-semibold text-foreground">
                  {custodyLabel}
                </p>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {custodyDescription}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {displayTokenId && (
                <CopyField
                  label="Display Token ID"
                  value={displayTokenId}
                  ocid="wallet.nft_details.copy_display_token_id"
                />
              )}
              <CopyField
                label={displayTokenId ? "Canonical Token ID" : "Token ID"}
                value={nft.tokenId}
                ocid="wallet.nft_details.copy_token_id"
              />
              {canisterId && (
                <CopyField
                  label="Collection Canister"
                  value={canisterId}
                  ocid="wallet.nft_details.copy_canister_id"
                />
              )}
              {imageUrl && (
                <CopyField
                  label="NFT Media URL"
                  value={imageUrl}
                  ocid="wallet.nft_details.copy_media_url"
                />
              )}
            </div>

            {visibleAttributes.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Tag className="w-3 h-3" />
                  Attributes
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {visibleAttributes.map(([key, value]) => (
                    <div
                      key={`wallet-detail-${key}-${value}`}
                      className="rounded-lg border border-border/50 bg-muted/35 px-3 py-2"
                    >
                      <p className="text-[11px] uppercase tracking-wide text-muted-foreground truncate">
                        {key}
                      </p>
                      <p className="text-sm font-semibold text-foreground truncate mt-0.5">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap justify-end gap-2 pt-2">
              {canisterUrl && (
                <Button
                  asChild
                  variant="outline"
                  className="gap-2"
                  data-ocid="wallet.nft_details.view_canister_button"
                >
                  <a
                    href={canisterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    View Canister
                  </a>
                </Button>
              )}
              {onSend && !isListed && (
                <Button
                  className="gap-2"
                  onClick={onSend}
                  data-ocid="wallet.nft_details.send_button"
                >
                  <Send className="w-3.5 h-3.5" />
                  {nft.location === "Vaulted"
                    ? WITHDRAW_TO_EXTERNAL_WALLET_LABEL
                    : "Send NFT"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── RegisterNFTModal ───────────────────────────────────────────────────────

interface RegisterNFTModalProps {
  open: boolean;
  onClose: () => void;
  collection: Collection;
}

function RegisterNFTModal({
  open,
  onClose,
  collection,
}: RegisterNFTModalProps) {
  const { actor } = useBackend();
  const { principal } = useAuth();
  const queryClient = useQueryClient();
  const [tokenId, setTokenId] = useState("");

  const mutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      if (!tokenId.trim()) throw new Error("Token ID is required");
      if (collection.kind === "External") {
        if (!principal)
          throw new Error("You must be logged in to import an NFT");
        const result = await actor.syncExternalNFTOwner(
          collection.id,
          tokenId.trim(),
          principal,
        );
        if (result.__kind__ === "err") {
          throw new Error(result.err);
        }
        return result.ok;
      }
      const result = await actor.registerNFT(collection.id, tokenId.trim(), {
        attributes: [],
      });
      if (result.__kind__ === "err") {
        throw new Error(result.err);
      }
      return result.ok;
    },
    onSuccess: () => {
      toast.success("NFT registered successfully");
      queryClient.invalidateQueries({ queryKey: ["userNFTs"] });
      queryClient.invalidateQueries({ queryKey: ["userStats"] });
      setTokenId("");
      onClose();
    },
    onError: (err: unknown) => {
      toast.error(extractError(err));
    },
  });

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="bg-card border-border max-w-md"
        data-ocid="register-nft.dialog"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-foreground flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-accent" />
            Register NFT
          </DialogTitle>
          <CollectionBadge collection={collection} size="sm" className="mt-1" />
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="tokenId" className="text-sm text-foreground">
              Token ID <span className="text-destructive">*</span>
            </Label>
            <Input
              id="tokenId"
              placeholder="e.g. 1234"
              value={tokenId}
              onChange={(e) => setTokenId(e.target.value)}
              className="bg-muted/30 border-border focus:border-accent"
              data-ocid="register-nft.token_id.input"
            />
          </div>

          <div className="rounded-xl border border-accent/20 bg-accent/5 p-3 text-xs text-muted-foreground">
            The app verifies that you actually own this token on-chain before it
            imports it. Metadata is fetched from the collection automatically.
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              variant="ghost"
              onClick={onClose}
              disabled={mutation.isPending}
              data-ocid="register-nft.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={() => mutation.mutate()}
              disabled={!tokenId.trim() || mutation.isPending}
              className="bg-accent text-accent-foreground hover:bg-accent/90 transition-smooth"
              data-ocid="register-nft.submit_button"
            >
              {mutation.isPending ? "Registering…" : "Register NFT"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface ImportSpecificNFTModalProps {
  open: boolean;
  onClose: () => void;
  collections: Collection[];
  initialCollectionId?: bigint | null;
}

function ImportSpecificNFTModal({
  open,
  onClose,
  collections,
  initialCollectionId = null,
}: ImportSpecificNFTModalProps) {
  const { actor } = useBackend();
  const { principal } = useAuth();
  const queryClient = useQueryClient();
  const [collectionId, setCollectionId] = useState("");
  const [tokenId, setTokenId] = useState("");

  const externalCollections = useMemo(
    () => collections.filter((collection) => collection.kind === "External"),
    [collections],
  );
  const selectedCollection = externalCollections.find(
    (collection) => collection.id.toString() === collectionId,
  );

  useEffect(() => {
    if (!open || initialCollectionId == null) return;
    const nextCollectionId = initialCollectionId.toString();
    if (
      externalCollections.some(
        (collection) => collection.id.toString() === nextCollectionId,
      )
    ) {
      setCollectionId(nextCollectionId);
    }
  }, [open, initialCollectionId, externalCollections]);

  const mutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      if (!principal) throw new Error("You must be logged in to import an NFT");
      if (!selectedCollection) throw new Error("Choose an external collection");
      if (!tokenId.trim()) throw new Error("Token ID is required");

      const result = await actor.syncExternalNFTOwner(
        selectedCollection.id,
        tokenId.trim(),
        principal,
      );
      if (result.__kind__ === "err") {
        throw new Error(result.err);
      }
      return result.ok;
    },
    onSuccess: () => {
      toast.success("NFT imported successfully");
      queryClient.invalidateQueries({ queryKey: ["userNFTs"] });
      queryClient.invalidateQueries({ queryKey: ["userStats"] });
      setCollectionId("");
      setTokenId("");
      onClose();
    },
    onError: (err: unknown) => {
      toast.error(extractError(err));
    },
  });

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="bg-card border-border max-w-md"
        data-ocid="wallet.import_specific_nft.dialog"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-foreground flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-accent" />
            Import NFT by Token ID
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label
              htmlFor="specificCollectionId"
              className="text-sm text-foreground"
            >
              Collection <span className="text-destructive">*</span>
            </Label>
            <Select value={collectionId} onValueChange={setCollectionId}>
              <SelectTrigger
                id="specificCollectionId"
                className="w-full bg-muted/30 border-border focus:border-accent"
                data-ocid="wallet.import_specific_nft.collection_select"
              >
                <SelectValue placeholder="Choose a collection" />
              </SelectTrigger>
              <SelectContent>
                {externalCollections.map((collection) => (
                  <SelectItem
                    key={collection.id.toString()}
                    value={collection.id.toString()}
                  >
                    {collection.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="specificTokenId"
              className="text-sm text-foreground"
            >
              Token ID <span className="text-destructive">*</span>
            </Label>
            <Input
              id="specificTokenId"
              placeholder="e.g. 1234"
              value={tokenId}
              onChange={(e) => setTokenId(e.target.value)}
              className="bg-muted/30 border-border focus:border-accent font-mono"
              data-ocid="wallet.import_specific_nft.token_id.input"
            />
          </div>

          {externalCollections.length === 0 && (
            <div className="rounded-lg border border-border bg-muted/20 p-3 text-xs text-muted-foreground">
              No external collections have been imported yet.
            </div>
          )}

          <div className="rounded-lg border border-accent/20 bg-accent/5 p-3 text-xs text-muted-foreground">
            Mintlab verifies ownership on-chain before adding this NFT to your
            wallet.
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              variant="ghost"
              onClick={onClose}
              disabled={mutation.isPending}
              data-ocid="wallet.import_specific_nft.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={() => mutation.mutate()}
              disabled={
                !selectedCollection || !tokenId.trim() || mutation.isPending
              }
              className="bg-accent text-accent-foreground hover:bg-accent/90 transition-smooth"
              data-ocid="wallet.import_specific_nft.submit_button"
            >
              {mutation.isPending ? "Importing…" : "Verify & Import"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface CollectionIndexingDialogProps {
  open: boolean;
  onClose: () => void;
  collection: Collection | null;
}

function CollectionIndexingDialog({
  open,
  onClose,
  collection,
}: CollectionIndexingDialogProps) {
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  const [cursor, setCursor] = useState<string | null>(null);
  const [lastPage, setLastPage] = useState<CollectionIndexPageResult | null>(
    null,
  );
  const [isIndexing, setIsIndexing] = useState(false);

  const { data: status, refetch } = useQuery<CollectionIndexStatus | null>({
    queryKey: ["collectionIndexStatus", collection?.id.toString()],
    queryFn: async () => {
      if (!actor || !collection) return null;
      return actor.getCollectionIndexStatus(collection.id);
    },
    enabled: open && !!actor && !!collection,
  });

  useEffect(() => {
    if (!open) {
      setCursor(null);
      setLastPage(null);
      setIsIndexing(false);
      return;
    }
    setCursor(status?.cursor ?? null);
  }, [open, status?.cursor]);

  async function indexOnePage(nextCursor: string | null) {
    if (!actor || !collection) throw new Error("No collection selected");
    const result = await actor.indexCollectionOwnershipPage(
      collection.id,
      nextCursor,
      50n,
    );
    if (result.__kind__ === "err") {
      throw new Error(result.err);
    }
    setLastPage(result.ok);
    setCursor(result.ok.nextCursor);
    await queryClient.invalidateQueries({ queryKey: ["userNFTs"] });
    await queryClient.invalidateQueries({ queryKey: ["userStats"] });
    await queryClient.invalidateQueries({
      queryKey: ["collectionIndexStatus", collection.id.toString()],
    });
    return result.ok;
  }

  async function handleIndexNextPage() {
    setIsIndexing(true);
    try {
      const page = await indexOnePage(cursor);
      await refetch();
      toast.success(
        page.complete ? "Collection indexing complete" : "Indexed next page",
        {
          description: page.complete
            ? `${page.indexed.toString()} owner records saved on the final page. Run Sync again to refresh wallets.`
            : `${page.scanned.toString()} tokens checked and ${page.indexed.toString()} owner records saved. Continue indexing to cover more of the collection.`,
        },
      );
    } catch (err) {
      toast.error(extractError(err));
    } finally {
      setIsIndexing(false);
    }
  }

  async function handleRunUntilComplete() {
    setIsIndexing(true);
    try {
      let nextCursor = cursor;
      let pages = 0;
      let indexed = 0n;
      while (pages < 200) {
        const page = await indexOnePage(nextCursor);
        indexed += page.indexed;
        pages += 1;
        nextCursor = page.nextCursor;
        if (page.complete || nextCursor == null) {
          toast.success("Collection indexing complete", {
            description: `${indexed.toString()} ownership records indexed.`,
          });
          await refetch();
          return;
        }
      }
      toast("Indexing paused", {
        description: `${indexed.toString()} owner records saved across ${pages.toString()} pages. Continue indexing to cover the rest.`,
      });
      await refetch();
    } catch (err) {
      toast.error(extractError(err));
    } finally {
      setIsIndexing(false);
    }
  }

  const scanned = status?.scanned ?? 0n;
  const indexed = status?.indexed ?? 0n;
  const complete = status?.complete ?? false;
  const nextCursor = cursor ?? status?.cursor ?? null;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="bg-card border-border max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-foreground flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-accent" />
            Ownership Indexing
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">
              {collection?.name ?? "Collection"}
            </p>
            <p className="text-xs text-muted-foreground">
              {collection?.canisterId.toString() ?? ""}
            </p>
          </div>

          <div className="rounded-lg border border-accent/20 bg-accent/5 p-3 text-xs text-muted-foreground">
            <p className="font-medium text-foreground">Ownership discovery</p>
            <p className="mt-1 leading-relaxed">
              Indexing reads ownership in small pages so wallet Sync can find
              NFTs from older imported collections. Direct token ID import still
              works for a known NFT.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-border bg-muted/20 p-3">
              <p className="text-xs text-muted-foreground">Scanned</p>
              <p className="font-display text-lg font-semibold">
                {scanned.toString()}
              </p>
            </div>
            <div className="rounded-lg border border-border bg-muted/20 p-3">
              <p className="text-xs text-muted-foreground">Indexed</p>
              <p className="font-display text-lg font-semibold">
                {indexed.toString()}
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-muted/20 p-3 text-xs text-muted-foreground">
            <div className="flex items-center justify-between gap-3">
              <span>Status</span>
              <Badge variant={complete ? "default" : "secondary"}>
                {complete ? "Complete" : "In progress"}
              </Badge>
            </div>
            <div className="mt-2 flex items-center justify-between gap-3">
              <span>Resume cursor</span>
              <span className="font-mono text-foreground">
                {nextCursor ?? "None"}
              </span>
            </div>
            {lastPage && (
              <p className="mt-2 text-foreground">
                Last page: {lastPage.scanned.toString()} tokens checked,{" "}
                {lastPage.indexed.toString()} owner records saved.
              </p>
            )}
            {status?.lastError && (
              <p className="mt-2 text-destructive">{status.lastError}</p>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={onClose} disabled={isIndexing}>
              Close
            </Button>
            <Button
              variant="outline"
              onClick={handleIndexNextPage}
              disabled={!collection || isIndexing || complete}
            >
              Index Next 50
            </Button>
            <Button
              onClick={handleRunUntilComplete}
              disabled={!collection || isIndexing || complete}
              className="bg-accent text-accent-foreground hover:bg-accent/90 transition-smooth"
            >
              {isIndexing ? "Indexing..." : "Continue Until Complete"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function MintComposer({
  mintConfig,
  moderationConfig,
  mainCollection,
  creatorCollections,
}: {
  mintConfig: MintConfig | null;
  moderationConfig: PublicModerationConfig | null;
  mainCollection: Collection | null;
  creatorCollections: Collection[];
}) {
  const { actor } = useBackend();
  const { principalText, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [attributesText, setAttributesText] = useState("");
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [selectedTarget, setSelectedTarget] = useState("");
  const [confirmMintOpen, setConfirmMintOpen] = useState(false);
  const [cycleTopUpReason, setCycleTopUpReason] = useState<string | null>(null);

  const mainMintAvailable =
    mintConfig?.mainMintEnabled === true &&
    mintConfig.collectionId != null &&
    mainCollection != null;

  const { data: pendingMintPayments = [] } = useQuery<PendingMintPaymentView[]>(
    {
      queryKey: ["pendingMintPayments", principalText],
      queryFn: async () => {
        if (!actor) return [];
        return actor.getMyPendingMintPayments();
      },
      enabled: !!actor && isAuthenticated,
    },
  );

  const retryPendingMintMutation = useMutation({
    mutationFn: async (paymentId: bigint) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.retryPendingMintPayment(paymentId);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (receipt) => {
      toast.success(
        `Mint recovered at block ${receipt.paymentBlock.toString()}`,
      );
      void queryClient.invalidateQueries({ queryKey: ["pendingMintPayments"] });
      void queryClient.invalidateQueries({ queryKey: ["userNFTs"] });
      void queryClient.invalidateQueries({ queryKey: ["userStats"] });
      void queryClient.invalidateQueries({ queryKey: ["icp-balance"] });
    },
    onError: (err: unknown) => {
      toast.error(extractError(err));
    },
  });

  useEffect(() => {
    const targetStillAvailable =
      (selectedTarget === "main" && mainMintAvailable) ||
      creatorCollections.some(
        (collection) =>
          `collection:${collection.id.toString()}` === selectedTarget,
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

  const selectedCollection =
    creatorCollections.find(
      (collection) =>
        `collection:${collection.id.toString()}` === selectedTarget,
    ) ?? null;
  const targetCollection =
    selectedTarget === "main" ? mainCollection : selectedCollection;

  const mutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      if (!targetCollection)
        throw new Error("Select a Mintlab collection first");
      if (!imageDataUrl) throw new Error("Upload an image before minting");
      const metadata: NFTMetadata = {
        name: name.trim() || undefined,
        description: description.trim() || undefined,
        imageUrl: imageDataUrl,
        attributes: parseAttributeLines(attributesText),
      };
      if (selectedTarget === "main") {
        const result = await actor.mintUserNFT(metadata);
        if (result.__kind__ === "err") throw new Error(result.err);
        return result.ok.nft;
      }
      const result = await actor.mintCollectionNFT(
        targetCollection.id,
        metadata,
      );
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (nft) => {
      const displayName = getNFTDisplayName(nft, targetCollection);
      toast.success(
        `Minted ${displayName} into ${targetCollection?.name ?? "the collection"}`,
      );
      void queryClient.invalidateQueries({ queryKey: ["userNFTs"] });
      void queryClient.invalidateQueries({ queryKey: ["userStats"] });
      void queryClient.invalidateQueries({
        queryKey: ["collectionNFTs", targetCollection?.id.toString() ?? ""],
      });
      void queryClient.invalidateQueries({ queryKey: ["icp-balance"] });
      void queryClient.invalidateQueries({ queryKey: ["pendingMintPayments"] });
      setName("");
      setDescription("");
      setAttributesText("");
      setImageDataUrl(null);
      setFileName("");
    },
    onError: (err: unknown) => {
      const message = extractError(err);
      if (isLowCyclesError(message)) {
        setCycleTopUpReason(message);
        return;
      }
      toast.error(message);
    },
  });

  async function handleFileChange(file: File | null) {
    if (!file) {
      setImageDataUrl(null);
      setFileName("");
      return;
    }
    if (!isSupportedModerationImageFile(file)) {
      setImageDataUrl(null);
      setFileName("");
      toast.error("Choose a JPG or PNG image");
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
            toast.error(
              "Uploaded image is too large for on-chain storage even after compression. Please use a smaller image.",
            );
            return;
          }
          setImageDataUrl(compressed);
          setFileName(file.name);
        } catch (err) {
          setImageDataUrl(null);
          setFileName("");
          toast.error(
            typeof err === "object" && err !== null && "message" in err
              ? String((err as { message: string }).message)
              : "Could not process image",
          );
        }
      } else {
        toast.error("Could not read image file");
      }
    };
    reader.onerror = () => toast.error("Could not read image file");
    reader.readAsDataURL(file);
  }

  function startMint() {
    try {
      if (!targetCollection)
        throw new Error("Select a Mintlab collection first");
      if (!imageDataUrl) throw new Error("Upload an image before minting");
      parseAttributeLines(attributesText);
      if (selectedTarget === "main" && mintConfig?.mainMintPriceE8s) {
        setConfirmMintOpen(true);
        return;
      }
      mutation.mutate();
    } catch (err) {
      toast.error(extractError(err));
    }
  }

  return (
    <>
      <Card className="border-border bg-card">
        <CardHeader className="space-y-1">
          <CardTitle className="text-base flex items-center gap-2">
            <Coins className="w-4 h-4 text-accent" />
            Mint NFTs
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Upload artwork, choose a collection, and add optional traits for
            filtering and discovery.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <HelpCallout
            title="Minting starts here"
            sectionId="wallet"
            actionLabel="Minting guide"
            ocid="wallet.mint.help_callout"
          >
            Use this panel to mint into the main app collection when public
            minting is enabled, or into one of the Mintlab collections you
            created.
          </HelpCallout>

          {pendingMintPayments.length > 0 && (
            <div className="space-y-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Paid mint recovery
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Payment is recorded on-chain. Retry finishes the mint
                    without charging again.
                  </p>
                </div>
                <Badge className="shrink-0 bg-amber-500/20 text-amber-700 border-0 dark:text-amber-200">
                  {pendingMintPayments.length}
                </Badge>
              </div>
              <div className="space-y-2">
                {pendingMintPayments.map((payment) => (
                  <div
                    key={payment.id.toString()}
                    className="flex flex-col gap-2 rounded-md border border-border bg-background/70 p-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        {pendingMintStatusLabel(payment.status)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatICP(payment.amountE8s)} ICP
                        {payment.paymentBlock == null
                          ? ""
                          : ` - block ${payment.paymentBlock.toString()}`}
                      </p>
                      {payment.lastError && (
                        <p className="mt-1 text-xs text-destructive">
                          {payment.lastError}
                        </p>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-2 self-start sm:self-center"
                      disabled={
                        retryPendingMintMutation.isPending ||
                        payment.status === "Minted"
                      }
                      onClick={() =>
                        retryPendingMintMutation.mutate(payment.id)
                      }
                    >
                      <RefreshCw className="h-4 w-4" />
                      Retry
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!mintConfig ? (
            <p className="text-sm text-muted-foreground">
              Minting has not been configured by the admin yet.
            </p>
          ) : !mainMintAvailable && creatorCollections.length === 0 ? (
            <div className="space-y-3">
              <div className="rounded-xl border border-accent/20 bg-accent/5 p-3 text-sm text-muted-foreground">
                Create your first Mintlab collection on the Collections page, or
                wait for the admin to enable public minting into the main
                collection.
              </div>
              <div className="rounded-xl border border-border bg-muted/20 p-3 text-sm text-muted-foreground">
                Collection creation fee:{" "}
                <strong className="text-foreground">
                  {formatICP(mintConfig.collectionCreationPriceE8s)} ICP
                </strong>
                {mintConfig.collectionCreationEnabled
                  ? ""
                  : " - collection creation is currently disabled by the admin"}
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="mint-collection"
                    className="flex items-center gap-1.5"
                  >
                    Mint target
                    <HelpTooltip>
                      Main app minting uses the admin-set price when enabled.
                      Your creator collections mint into their own ICRC-7
                      canisters.
                    </HelpTooltip>
                  </Label>
                  <Select
                    value={selectedTarget}
                    onValueChange={setSelectedTarget}
                  >
                    <SelectTrigger
                      id="mint-collection"
                      data-ocid="wallet.mint.collection_select"
                    >
                      <SelectValue placeholder="Select a collection" />
                    </SelectTrigger>
                    <SelectContent>
                      {mainMintAvailable && mainCollection && (
                        <SelectItem value="main">
                          {mainCollection.name} (
                          {formatICP(mintConfig.mainMintPriceE8s)} ICP)
                        </SelectItem>
                      )}
                      {creatorCollections.map((collection) => (
                        <SelectItem
                          key={collection.id.toString()}
                          value={`collection:${collection.id.toString()}`}
                        >
                          {collection.name} ({collection.symbol})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {targetCollection && (
                  <CopyField
                    label="Collection Canister"
                    value={targetCollection.canisterId.toString()}
                    ocid="wallet.mint.copy_canister_id"
                  />
                )}
              </div>

              <div className="rounded-xl border border-accent/20 bg-accent/5 p-3 text-sm text-muted-foreground">
                {selectedTarget === "main"
                  ? `Minting into the main collection costs ${formatICP(mintConfig.mainMintPriceE8s)} ICP from your in-app account.`
                  : "Creator collections use their own dedicated ICRC-7 canister."}
              </div>

              {moderationConfig?.enabled && (
                <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 text-sm text-muted-foreground">
                  {moderationConfig.userMessage}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="mint-name">NFT name</Label>
                  <Input
                    id="mint-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Vault Original #1"
                    data-ocid="wallet.mint.name_input"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="mint-image">Image upload</Label>
                  <Input
                    id="mint-image"
                    type="file"
                    accept={MODERATION_IMAGE_ACCEPT}
                    onChange={(e) =>
                      void handleFileChange(e.target.files?.[0] ?? null)
                    }
                    data-ocid="wallet.mint.image_input"
                  />
                  <p className="text-xs text-muted-foreground">
                    {fileName ||
                      (moderationConfig?.enabled
                        ? "Choose a JPG or PNG under about 1 MB"
                        : "Choose an image to store with the minted NFT")}
                  </p>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="mint-description">Description</Label>
                <Textarea
                  id="mint-description"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your NFT…"
                  data-ocid="wallet.mint.description_textarea"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="mint-attributes">
                  Attributes{" "}
                  <span className="text-muted-foreground">(Trait: Value)</span>
                </Label>
                <Textarea
                  id="mint-attributes"
                  rows={3}
                  value={attributesText}
                  onChange={(e) => setAttributesText(e.target.value)}
                  placeholder={"Rarity: Rare\nSeries: Genesis"}
                  data-ocid="wallet.mint.attributes_textarea"
                />
                <p className="text-xs text-muted-foreground">
                  Attributes are optional traits like Background: Blue or
                  Rarity: Rare. They appear as filters on collection pages.
                </p>
              </div>

              {imageDataUrl && (
                <div className="rounded-xl border border-border bg-muted/20 p-3">
                  <img
                    src={imageDataUrl}
                    alt="Mint preview"
                    className="w-28 h-28 rounded-lg object-cover border border-border/50"
                  />
                </div>
              )}

              <TermsAgreementNotice actionLabel="minting this NFT" />

              <div className="flex justify-end">
                <Button
                  onClick={startMint}
                  disabled={mutation.isPending || !targetCollection}
                  className="gap-2"
                  data-ocid="wallet.mint.submit_button"
                >
                  <ImagePlus className="w-4 h-4" />
                  {mutation.isPending ? "Minting..." : "Mint NFT"}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
      <PaymentConfirmationDialog
        open={confirmMintOpen}
        onOpenChange={setConfirmMintOpen}
        title="Confirm Mint Payment"
        description={
          moderationConfig?.enabled
            ? "Mintlab checks the uploaded image before any ICP is transferred."
            : "Confirm the ICP payment from your in-app account before this NFT is minted."
        }
        lines={[
          {
            label: "Mint price",
            value: `${formatICP(mintConfig?.mainMintPriceE8s ?? 0n)} ICP`,
          },
          {
            label: "Ledger fee",
            value: `${formatICP(ICP_LEDGER_FEE_E8S)} ICP`,
          },
          {
            label: "Total debit",
            value: `${formatICP(
              (mintConfig?.mainMintPriceE8s ?? 0n) + ICP_LEDGER_FEE_E8S,
            )} ICP`,
          },
        ]}
        confirmLabel="Mint NFT"
        isPending={mutation.isPending}
        onConfirm={() => {
          setConfirmMintOpen(false);
          mutation.mutate();
        }}
        ocid="wallet.mint.payment_dialog"
      />
      <AppCanisterTopUpDialog
        open={cycleTopUpReason != null}
        reason={cycleTopUpReason}
        onOpenChange={(open) => {
          if (!open) setCycleTopUpReason(null);
        }}
        onSuccess={() => mutation.mutate()}
      />
    </>
  );
}

// ── StatsBar ───────────────────────────────────────────────────────────────

interface StatsBarProps {
  stats: NFTStats | undefined;
  isLoading: boolean;
}

function StatsBar({ stats, isLoading }: StatsBarProps) {
  const totalNFTs = stats ? Number(stats.totalCount) : 0;
  const totalCollections = stats ? stats.perCollection.length : 0;

  const items = [
    {
      icon: Wallet,
      label: "Total NFTs",
      value: isLoading ? null : totalNFTs,
      ocid: "wallet.stats.total_nfts",
    },
    {
      icon: Layers,
      label: "Collections",
      value: isLoading ? null : totalCollections,
      ocid: "wallet.stats.total_collections",
    },
  ];

  return (
    <div className="flex gap-3 flex-wrap">
      {items.map(({ icon: Icon, label, value, ocid }) => (
        <div
          key={label}
          className="flex items-center gap-2.5 bg-card border border-border rounded-xl px-4 py-2.5"
          data-ocid={ocid}
        >
          <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
            <Icon className="w-4 h-4 text-accent" />
          </div>
          {value === null ? (
            <Skeleton className="w-12 h-5" />
          ) : (
            <div className="min-w-0">
              <p className="font-display font-bold text-lg leading-none text-foreground">
                {value}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ── ReceivingInstructions ──────────────────────────────────────────────────

type SyncStatus =
  | { kind: "idle" }
  | { kind: "syncing"; slow?: boolean }
  | { kind: "ok"; newCount: number }
  | { kind: "upToDate" }
  | {
      kind: "partial";
      newCount: number;
      message: string;
      errors: string[];
      skipped: WalletSyncSkip[];
      progress?: WalletCollectionSyncProgress | null;
    }
  | { kind: "error"; message: string };

type SyncMode = "silent" | "manual";

type SyncOptions = {
  silent?: boolean;
  collectionId?: bigint | null;
  tokenHints?: string[];
};

type SyncResult =
  | {
      __kind__: "ok";
      ok: WalletSyncV2Result & {
        progress?: WalletCollectionSyncProgress | null;
      };
    }
  | { __kind__: "err"; err: string };

interface ReceivingInstructionsProps {
  actor: backendInterface | null;
  principalText: string | null;
  accountIdHex: string | null;
  collections: Collection[];
  onSync: () => void;
  onSyncCollection?: (collectionId: bigint, tokenHints?: string[]) => void;
  onImportSpecificNFT: (collectionId?: bigint) => void;
  onIndexCollection?: (collectionId: bigint) => void;
  syncStatus: SyncStatus;
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
  syncStatus,
}: ReceivingInstructionsProps) {
  const [syncTargetCollectionId, setSyncTargetCollectionId] = useState("all");
  const [syncTokenHint, setSyncTokenHint] = useState("");
  const isSyncing = syncStatus.kind === "syncing";
  const skipped = syncStatus.kind === "partial" ? syncStatus.skipped : [];
  const progress = syncStatus.kind === "partial" ? syncStatus.progress : null;
  const indexingSkips = skipped.filter(isAutoIndexingSkip);
  const setupSkips = skipped.filter((skip) => !isAutoIndexingSkip(skip));
  const onlyAutoIndexing = skipped.length > 0 && setupSkips.length === 0;
  const syncableCollections = useMemo(
    () => collections.filter((collection) => collection.kind === "External"),
    [collections],
  );
  const selectedSyncCollection =
    syncableCollections.find(
      (collection) => collection.id.toString() === syncTargetCollectionId,
    ) ?? null;
  const { data: selectedReadiness = null } =
    useQuery<CollectionSyncReadiness | null>({
      queryKey: [
        "collectionSyncReadiness",
        selectedSyncCollection?.id.toString() ?? null,
      ],
      enabled: actor != null && selectedSyncCollection != null,
      staleTime: 15_000,
      queryFn: async () => {
        if (!actor || !selectedSyncCollection) return null;
        const result = await actor.getCollectionSyncReadiness(
          selectedSyncCollection.id,
        );
        if (result.__kind__ === "err") {
          throw new Error(result.err);
        }
        return result.ok;
      },
    });

  useEffect(() => {
    if (
      syncTargetCollectionId !== "all" &&
      !syncableCollections.some(
        (collection) => collection.id.toString() === syncTargetCollectionId,
      )
    ) {
      setSyncTargetCollectionId("all");
    }
  }, [syncTargetCollectionId, syncableCollections]);

  function handleSyncClick() {
    if (selectedSyncCollection && onSyncCollection) {
      const hint = syncTokenHint.trim();
      onSyncCollection(selectedSyncCollection.id, hint ? [hint] : []);
      return;
    }
    onSync();
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.05 }}
      className="bg-card border border-border rounded-2xl overflow-hidden"
      data-ocid="wallet.receiving_instructions"
    >
      {/* Header bar */}
      <div className="flex flex-col gap-3 px-5 py-3 border-b border-border bg-accent/5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <ArrowUpRight className="w-4 h-4 text-accent" />
          <span className="font-display font-semibold text-sm text-foreground">
            Receive NFTs &amp; ICP
          </span>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          {/* Sync status inline indicator */}
          {syncStatus.kind === "ok" && (
            <motion.span
              initial={{ opacity: 0, x: 4 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-1 text-xs text-accent font-medium"
              data-ocid="wallet.sync.success_state"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              {syncStatus.newCount === 1
                ? "1 new NFT found"
                : `${syncStatus.newCount} new NFTs found`}
            </motion.span>
          )}
          {syncStatus.kind === "upToDate" && (
            <motion.span
              initial={{ opacity: 0, x: 4 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-1 text-xs text-muted-foreground"
              data-ocid="wallet.sync.success_state"
            >
              <Check className="w-3.5 h-3.5" />
              Up to date
            </motion.span>
          )}
          {syncStatus.kind === "partial" && (
            <motion.span
              initial={{ opacity: 0, x: 4 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 truncate max-w-[210px]"
              title={syncStatus.message}
              data-ocid="wallet.sync.partial_state"
            >
              <Info className="w-3.5 h-3.5 shrink-0" />
              {syncStatus.skipped.length > 0
                ? onlyAutoIndexing
                  ? `${indexingSkips.length} indexing`
                  : `${setupSkips.length} need selected sync`
                : syncStatus.newCount > 0
                  ? `${syncStatus.newCount} synced; some warnings`
                  : "Review sync details"}
            </motion.span>
          )}
          {syncStatus.kind === "error" && (
            <motion.span
              initial={{ opacity: 0, x: 4 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-xs text-destructive truncate max-w-[160px]"
              title={syncStatus.message}
              data-ocid="wallet.sync.error_state"
            >
              {syncStatus.message}
            </motion.span>
          )}
          <Button
            size="sm"
            variant="ghost"
            className="h-7 px-2 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
            onClick={() => onImportSpecificNFT()}
            data-ocid="wallet.import_specific_nft_button"
            aria-label="Import NFT by token ID"
            title="Import NFT by token ID"
          >
            <Plus className="w-3 h-3" />
            Import NFT
          </Button>
          {syncableCollections.length > 0 && (
            <Select
              value={syncTargetCollectionId}
              onValueChange={setSyncTargetCollectionId}
            >
              <SelectTrigger
                aria-label="Choose sync collection"
                className="h-7 w-[min(100%,13rem)] border-border bg-background/60 px-2 text-xs"
                data-ocid="wallet.sync_collection_select"
              >
                <Layers className="mr-1.5 h-3 w-3 shrink-0 text-muted-foreground" />
                <SelectValue placeholder="All collections" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All collections</SelectItem>
                {syncableCollections.map((collection) => (
                  <SelectItem
                    key={collection.id.toString()}
                    value={collection.id.toString()}
                  >
                    {collection.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {selectedSyncCollection && (
            <Input
              value={syncTokenHint}
              onChange={(event) => setSyncTokenHint(event.target.value)}
              placeholder="Optional token ID"
              className="h-7 w-[min(100%,9rem)] border-border bg-background/60 px-2 text-xs"
              data-ocid="wallet.sync_token_hint_input"
              aria-label="Optional token ID for selected sync"
            />
          )}
          <Button
            size="sm"
            variant="ghost"
            className="h-7 px-2 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
            onClick={handleSyncClick}
            disabled={isSyncing}
            data-ocid="wallet.refresh_button"
            aria-label="Sync NFTs from chain"
          >
            <RefreshCw
              className={`w-3 h-3 ${isSyncing ? "animate-spin" : ""}`}
            />
            {isSyncing
              ? "Syncing…"
              : selectedSyncCollection
                ? "Sync selected"
                : "Sync"}
          </Button>
        </div>
      </div>

      <div className="p-5 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {principalText && (
            <CopyField
              label="Principal ID — use for ICRC-7/DIP721 NFTs"
              value={principalText}
              ocid="wallet.copy_principal_button"
            />
          )}
          {accountIdHex ? (
            <CopyField
              label="Account ID — use for ICP and EXT NFTs"
              value={accountIdHex}
              ocid="wallet.copy_account_id_button"
            />
          ) : (
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Account ID — use for ICP and EXT NFTs
              </span>
              <Skeleton className="h-9 w-full rounded-lg" />
            </div>
          )}
        </div>

        {selectedSyncCollection && (
          <div className="rounded-lg border border-border bg-background/60 p-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-medium text-foreground">
                    {selectedSyncCollection.name}
                  </p>
                  <Badge variant="secondary">
                    {nftStandardLabel(selectedSyncCollection)}
                  </Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {selectedReadiness?.recommendedAction ??
                    "Mintlab will use direct owner lookups first, then continue safe selected indexing when collection range data is available."}
                </p>
              </div>
              <Badge
                variant={
                  selectedReadiness?.allowsSync === false
                    ? "destructive"
                    : "outline"
                }
                className="shrink-0"
              >
                {readinessStatusLabel(
                  selectedReadiness,
                  selectedSyncCollection,
                )}
              </Badge>
            </div>

            <div className="mt-3 grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
              <div className="space-y-1.5 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-accent" />
                  <span>Direct owner lookup</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-accent" />
                  <span>App deposit account lookup</span>
                </div>
                <div className="flex items-center gap-2">
                  <Info className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                  <span>
                    {selectedSyncCollection.standard.__kind__ === "EXT" &&
                    selectedReadiness?.hasBrowseInfo === false
                      ? "Full EXT registry scan disabled for cycle safety"
                      : "Collection indexing uses small saved pages"}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 md:justify-end">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 gap-1.5 text-xs"
                  onClick={() => onImportSpecificNFT(selectedSyncCollection.id)}
                >
                  <Plus className="h-3.5 w-3.5" />
                  Enter token ID
                </Button>
                {onSyncCollection && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 gap-1.5 text-xs"
                    disabled={isSyncing}
                    onClick={() =>
                      onSyncCollection(selectedSyncCollection.id, [])
                    }
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    Continue indexing
                  </Button>
                )}
                {onIndexCollection && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 text-xs"
                    onClick={() => onIndexCollection(selectedSyncCollection.id)}
                  >
                    Open Indexing
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}

        {syncStatus.kind === "partial" &&
          (syncStatus.skipped.length > 0 || progress) && (
            <div className="rounded-lg border border-amber-200/70 bg-amber-50/70 p-3 dark:border-amber-900/50 dark:bg-amber-950/20">
              <div className="flex flex-col gap-2">
                <div className="flex items-start gap-2">
                  <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      {progress
                        ? "Selected collection sync progress"
                        : onlyAutoIndexing
                          ? "Automatic discovery is indexing"
                          : "Select a collection to finish sync"}
                    </p>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      {progress
                        ? selectedSyncProgressMessage(
                            progress,
                            selectedSyncCollection,
                          )
                        : onlyAutoIndexing
                          ? "Sync is indexing imported collections in safe pages. New NFTs appear as soon as they are found; known token IDs can still be imported directly."
                          : "Use the collection menu above, choose the named collection, then click Sync selected. If you know the NFT token ID, Import NFT checks it directly."}
                    </p>
                  </div>
                </div>
                {syncStatus.skipped.slice(0, 4).map((skip) => {
                  const isIndexing = isAutoIndexingSkip(skip);
                  const canTargetCollection =
                    skip.collectionId !== 0n &&
                    syncableCollections.some(
                      (collection) => collection.id === skip.collectionId,
                    );
                  return (
                    <div
                      key={skip.collectionId.toString()}
                      className="flex flex-col gap-2 border-t border-amber-200/60 pt-2 sm:flex-row sm:items-center sm:justify-between dark:border-amber-900/40"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">
                          {skip.collectionName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {skip.message ||
                            "Automatic discovery is still catching up for this collection."}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                        {canTargetCollection && onSyncCollection && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 shrink-0 gap-1.5 text-xs"
                            onClick={() => {
                              setSyncTargetCollectionId(
                                skip.collectionId.toString(),
                              );
                              setSyncTokenHint("");
                              onSyncCollection(skip.collectionId, []);
                            }}
                          >
                            <RefreshCw className="h-3.5 w-3.5" />
                            Sync collection
                          </Button>
                        )}
                        {canTargetCollection && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 shrink-0 gap-1.5 text-xs"
                            onClick={() =>
                              onImportSpecificNFT(skip.collectionId)
                            }
                          >
                            <Plus className="h-3.5 w-3.5" />
                            Enter token ID
                          </Button>
                        )}
                        {!isIndexing &&
                          canTargetCollection &&
                          onIndexCollection && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 shrink-0"
                              onClick={() =>
                                onIndexCollection(skip.collectionId)
                              }
                            >
                              Open Indexing
                            </Button>
                          )}
                        {!canTargetCollection && (
                          <Badge variant="secondary" className="shrink-0">
                            {isIndexing ? "Indexing" : "Action needed"}
                          </Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
                {syncStatus.skipped.length > 4 && (
                  <p className="text-xs text-muted-foreground">
                    {syncStatus.skipped.length - 4} more collections{" "}
                    {onlyAutoIndexing
                      ? "are indexing automatically."
                      : "need selected sync."}
                  </p>
                )}
              </div>
            </div>
          )}

        {isSyncing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-2 p-3 bg-accent/5 border border-accent/20 rounded-lg"
            data-ocid="wallet.sync.loading_state"
          >
            <div className="w-3.5 h-3.5 border-2 border-accent/30 border-t-accent rounded-full animate-spin shrink-0" />
            <p className="text-xs text-accent leading-relaxed">
              {syncStatus.slow
                ? "Still syncing collections. New NFTs will appear here as they are indexed."
                : "Checking on-chain ownership across your collections..."}
            </p>
          </motion.div>
        )}

        <div className="flex items-start gap-2 p-3 bg-muted/30 rounded-lg">
          <Info className="w-4 h-4 text-accent shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong className="text-foreground">To receive NFTs:</strong> Use
            the field the sending wallet asks for. ICRC-7 and DIP721 use your{" "}
            <strong className="text-foreground">Principal ID</strong>; EXT
            collections may use either your Principal ID or the{" "}
            <strong className="text-foreground">Account ID</strong>. After
            sending, click <strong className="text-foreground">Sync</strong> to
            check on-chain ownership and auto-register any new NFTs.
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// ── UnauthHero ─────────────────────────────────────────────────────────────

function UnauthHero({ login }: { login: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full flex flex-col items-center justify-center text-center py-24 px-6"
      data-ocid="wallet.unauthenticated_hero"
    >
      <div className="relative mb-8">
        <div
          className="w-24 h-24 rounded-full nft-card-glow"
          style={{
            background:
              "radial-gradient(circle, oklch(var(--accent) / 0.3) 0%, oklch(var(--primary) / 0.15) 60%, transparent 100%)",
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <Wallet className="w-10 h-10 text-accent" />
        </div>
      </div>

      <h1 className="font-display font-bold text-4xl text-foreground mb-3">
        Your NFT Wallet
      </h1>
      <p className="text-muted-foreground text-lg max-w-md leading-relaxed mb-8">
        Connect with Internet Identity to view your NFTs, track collection
        stats, and register assets to your wallet.
      </p>

      <Button
        size="lg"
        onClick={login}
        className="bg-accent text-accent-foreground hover:bg-accent/90 transition-smooth gap-2 font-semibold px-8 py-3"
        data-ocid="wallet.login_button"
      >
        <LogIn className="w-4 h-4" />
        Connect with Internet Identity
      </Button>

      <p className="text-xs text-muted-foreground mt-5">
        No account needed — Internet Identity is secure &amp; anonymous
      </p>
    </motion.div>
  );
}

// ── CollectionSection ─────────────────────────────────────────────────────

interface CollectionSectionProps {
  collection: Collection;
  nfts: WalletNFT[];
  trustStatus?: CollectionTrustStatus | null;
  listedNFTKeys: Set<string>;
  sectionIndex: number;
  isCreatorCollection: boolean;
  dividendBalances: Map<string, bigint>;
  onReportNFT: (collection: Collection, nft: WalletNFT) => void;
}

function CollectionSection({
  collection,
  nfts,
  trustStatus,
  listedNFTKeys,
  sectionIndex,
  isCreatorCollection,
  dividendBalances,
  onReportNFT,
}: CollectionSectionProps) {
  const [registerOpen, setRegisterOpen] = useState(false);
  const [detailNft, setDetailNft] = useState<WalletNFT | null>(null);
  const [sendNft, setSendNft] = useState<WalletNFT | null>(null);
  const collectionImageUrl = resolveImageUrl(collection.imageUrl);
  const isNFTListed = (nft: WalletNFT) =>
    listedNFTKeys.has(nftKey(nft.collectionId, nft.tokenId));

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: sectionIndex * 0.08 }}
      data-ocid={`wallet.collection.${sectionIndex + 1}`}
    >
      {/* Collection header */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3 min-w-0">
          {collectionImageUrl && (
            <img
              src={collectionImageUrl}
              alt={collection.name}
              className="w-9 h-9 rounded-full border border-border/60 object-cover shrink-0"
            />
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-display font-bold text-foreground text-lg truncate">
                {collection.name}
              </h2>
              <Badge
                variant="secondary"
                className="font-mono text-xs shrink-0 bg-muted/60 text-muted-foreground border border-border/40"
              >
                {nfts.length} NFT{nfts.length !== 1 ? "s" : ""}
              </Badge>
              {isCreatorCollection && (
                <Badge className="shrink-0 bg-accent/10 text-accent border border-accent/20">
                  Your Collection
                </Badge>
              )}
              {collection.dividendConfig?.enabled && (
                <Badge className="shrink-0 bg-emerald-500/10 text-emerald-700 border border-emerald-500/20">
                  Dividends
                </Badge>
              )}
            </div>
            <CollectionBadge
              collection={collection}
              trustStatus={trustStatus}
              size="sm"
              className="mt-0.5"
            />
          </div>
        </div>

        <Button
          size="sm"
          variant="outline"
          onClick={() => setRegisterOpen(true)}
          className="shrink-0 gap-1.5 border-accent/30 text-accent hover:bg-accent/10 hover:border-accent/60"
          data-ocid={`wallet.register_nft_button.${sectionIndex + 1}`}
          disabled={collection.kind !== "External"}
        >
          <Plus className="w-3.5 h-3.5" />
          {collection.kind === "External" ? "Import NFT" : "Mint in Studio"}
        </Button>
      </div>

      <div className="mb-4 flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-muted/20 px-3 py-2.5">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
            Collection Canister
          </p>
          <p className="truncate font-mono text-sm text-foreground">
            {collection.canisterId.toString()}
          </p>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="shrink-0 gap-1.5"
          onClick={() => {
            void navigator.clipboard.writeText(
              collection.canisterId.toString(),
            );
            toast.success("Collection canister copied");
          }}
          data-ocid={`wallet.copy_collection_canister.${sectionIndex + 1}`}
        >
          <Copy className="w-3.5 h-3.5" />
          Copy
        </Button>
      </div>

      {/* NFT grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {nfts.map((nft, i) => (
          <div key={nft.id.toString()} className="relative group">
            <NFTCard
              nft={nft}
              collection={collection}
              trustStatus={trustStatus}
              isListed={isNFTListed(nft)}
              dividendE8s={
                dividendBalances.get(nftKey(nft.collectionId, nft.tokenId)) ??
                0n
              }
              index={i}
              onClick={() => setDetailNft(nft)}
              data-ocid={`wallet.nft.item.${sectionIndex * 100 + i + 1}`}
            />
            {/* Send button overlay */}
            <button
              type="button"
              className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-accent text-accent-foreground rounded-lg px-2 py-1 text-xs font-medium flex items-center gap-1 shadow-lg hover:bg-accent/90"
              onClick={(e) => {
                e.stopPropagation();
                setSendNft(nft);
              }}
              data-ocid={`wallet.send_nft_button.${sectionIndex * 100 + i + 1}`}
              aria-label={`${nft.location === "Vaulted" ? WITHDRAW_TO_EXTERNAL_WALLET_LABEL : "Send NFT"} ${getNFTDisplayName(nft, collection)}`}
              disabled={isNFTListed(nft)}
              hidden={isNFTListed(nft)}
            >
              <Send className="w-3 h-3" />
              {nft.location === "Vaulted" ? "Withdraw" : "Send"}
            </button>
          </div>
        ))}
      </div>

      <RegisterNFTModal
        open={registerOpen}
        onClose={() => setRegisterOpen(false)}
        collection={collection}
      />

      {sendNft && (
        <SendNFTModal
          open={!!sendNft}
          onClose={() => setSendNft(null)}
          nft={sendNft}
          collection={collection}
        />
      )}

      {detailNft && (
        <NFTDetailsModal
          open={!!detailNft}
          onClose={() => setDetailNft(null)}
          nft={detailNft}
          collection={collection}
          trustStatus={trustStatus}
          isListed={isNFTListed(detailNft)}
          dividendE8s={
            dividendBalances.get(
              nftKey(detailNft.collectionId, detailNft.tokenId),
            ) ?? 0n
          }
          onReport={() => onReportNFT(collection, detailNft)}
          onSend={
            isNFTListed(detailNft)
              ? undefined
              : () => {
                  setDetailNft(null);
                  setSendNft(detailNft);
                }
          }
        />
      )}
    </motion.section>
  );
}

// ── WalletPage ─────────────────────────────────────────────────────────────

export default function WalletPage() {
  const {
    isAuthenticated,
    isLoading: authLoading,
    login,
    principal,
    principalText,
  } = useAuth();
  const { actor, isFetching } = useBackend();
  const { isAdmin } = useAdmin();
  const queryClient = useQueryClient();
  const bootstrappedRef = useRef(false);
  const autoSyncedPrincipalRef = useRef<string | null>(null);
  const syncInFlightRef = useRef<Promise<SyncResult> | null>(null);
  const syncModeRef = useRef<SyncMode | null>(null);
  const syncScopeRef = useRef<string | null>(null);
  const syncResumeCursorRef = useRef<bigint | null>(null);
  const [importSpecificOpen, setImportSpecificOpen] = useState(false);
  const [preferredImportCollectionId, setPreferredImportCollectionId] =
    useState<bigint | null>(null);
  const [indexingCollectionId, setIndexingCollectionId] = useState<
    bigint | null
  >(null);

  // Bootstrap admin on first login
  useEffect(() => {
    if (isAuthenticated && actor && !isFetching && !bootstrappedRef.current) {
      bootstrappedRef.current = true;
      actor
        .bootstrapAdmin()
        .then(() => {
          queryClient.invalidateQueries({ queryKey: ["isAdmin"] });
          queryClient.invalidateQueries({ queryKey: ["adminPrincipal"] });
        })
        .catch(() => {
          // Already bootstrapped — silent
        });
    }
  }, [isAuthenticated, actor, isFetching, queryClient]);

  // ── queries ──────────────────────────────────────────────────────────────

  const {
    data: userNFTPages,
    isLoading: nftsLoading,
    refetch: refetchNFTs,
    fetchNextPage: fetchNextNFTPage,
    hasNextPage: hasMoreNFTs,
    isFetchingNextPage: isFetchingMoreNFTs,
  } = useInfiniteQuery({
    queryKey: ["userNFTs", "walletPages", principalText],
    initialPageParam: null as bigint | null,
    queryFn: async ({ pageParam }) => {
      if (!actor || !principal) {
        return { nfts: [], nextCursor: null, totalCount: 0n };
      }
      return actor.getUserNFTsPage(principal, pageParam, WALLET_NFT_PAGE_SIZE);
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    enabled: !!actor && !isFetching && isAuthenticated && !!principal,
  });

  const userNFTs = userNFTPages?.pages.flatMap((page) => page.nfts) ?? [];
  const userNFTTotalCount =
    userNFTPages?.pages[0]?.totalCount ?? BigInt(userNFTs.length);
  const userStats = buildLoadedNFTStats(userNFTs, userNFTTotalCount);
  const statsLoading = nftsLoading;

  const { data: collectionPages } = useInfiniteQuery({
    queryKey: ["collections", "walletPages"],
    initialPageParam: null as bigint | null,
    queryFn: async ({ pageParam }) => {
      if (!actor) {
        return { collections: [], nextCursor: null, totalCount: 0n };
      }
      return actor.listCollectionsPage(pageParam, WALLET_COLLECTION_PAGE_SIZE);
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    enabled: !!actor && !isFetching && isAuthenticated,
  });
  const collections =
    collectionPages?.pages.flatMap((page) => page.collections) ?? [];

  const { data: collectionImportMetas = [] } = useQuery<CollectionImportMeta[]>(
    {
      queryKey: ["collectionImportMetas", "wallet"],
      queryFn: async () => {
        if (!actor) return [];
        const page = await actor.listCollectionImportMetasPage(null, 100n);
        return page.metas;
      },
      enabled: !!actor && !isFetching && isAuthenticated,
    },
  );

  const { data: accountIdBytes } = useQuery<Uint8Array>({
    queryKey: ["userAccountId", principalText],
    queryFn: async () => {
      if (!actor) throw new Error("No actor");
      return actor.getUserAccountId();
    },
    enabled: !!actor && !isFetching && isAuthenticated,
  });

  const { data: mintConfig } = useQuery<MintConfig | null>({
    queryKey: ["mintConfig"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMintConfig();
    },
    enabled: !!actor && !isFetching && isAuthenticated,
  });

  const { data: moderationConfig } = useQuery<PublicModerationConfig | null>({
    queryKey: ["moderationConfig"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getModerationConfig();
    },
    enabled: !!actor && !isFetching && isAuthenticated,
  });

  const { data: myCreatedCollections = [] } = useQuery<Collection[]>({
    queryKey: ["myCreatedCollections", principalText],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyCreatedCollections();
    },
    enabled: !!actor && !isFetching && isAuthenticated,
  });

  const { data: activeListingDetails = [] } = useQuery<ActiveListingDetail[]>({
    queryKey: [
      "activeListingDetails",
      "wallet",
      WALLET_LISTING_PAGE_SIZE.toString(),
    ],
    queryFn: async () => {
      if (!actor) return [];
      const page = await actor.getActiveListingDetailsPage(
        null,
        WALLET_LISTING_PAGE_SIZE,
      );
      return page.details;
    },
    enabled: !!actor && !isFetching && isAuthenticated,
  });

  const { data: myDividendNFTs = [] } = useQuery<NFTDividend[]>({
    queryKey: [
      "myDividendNFTs",
      "wallet",
      principalText,
      WALLET_DIVIDEND_PAGE_SIZE.toString(),
    ],
    queryFn: async () => {
      if (!actor) return [];
      const page = await actor.getMyDividendNFTsPage(
        null,
        WALLET_DIVIDEND_PAGE_SIZE,
      );
      return page.dividends;
    },
    enabled: !!actor && !isFetching && isAuthenticated,
    refetchOnWindowFocus: false,
    staleTime: 60_000,
  });

  const {
    data: recentNFTTransactions = [],
    isLoading: nftTransactionsLoading,
  } = useQuery<RecentTransaction[]>({
    queryKey: ["recent-nft-transactions", principalText],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyRecentNFTTransactions(10n);
    },
    enabled: !!actor && !isFetching && isAuthenticated,
    refetchOnWindowFocus: false,
  });

  // ── derived data ─────────────────────────────────────────────────────────

  const accountIdHex = accountIdBytes ? accountIdToHex(accountIdBytes) : null;
  const listedNFTKeys = new Set(
    activeListingDetails
      .filter((detail) => {
        const seller =
          detail.listing.__kind__ === "Fixed"
            ? detail.listing.Fixed.seller
            : detail.listing.Auction.seller;
        return principal ? seller.toString() === principal.toString() : false;
      })
      .map((detail) => nftKey(detail.nft.collectionId, detail.nft.tokenId)),
  );

  const collectionMap = new Map<bigint, Collection>();
  for (const c of collections ?? []) {
    collectionMap.set(c.id, c);
  }
  const importMetaMap = collectionMetaMap(collectionImportMetas);
  const indexingCollection =
    indexingCollectionId == null
      ? null
      : (collectionMap.get(indexingCollectionId) ?? null);
  const myCreatedCollectionIds = new Set(
    myCreatedCollections.map((collection) => collection.id),
  );
  const dividendBalances = new Map<string, bigint>(
    myDividendNFTs.map((item) => [
      nftKey(item.nft.collectionId, item.nft.tokenId),
      item.claimableE8s,
    ]),
  );

  const nftsByCollection = new Map<bigint, WalletNFT[]>();
  for (const nft of userNFTs ?? []) {
    const existing = nftsByCollection.get(nft.collectionId) ?? [];
    existing.push(nft);
    nftsByCollection.set(nft.collectionId, existing);
  }

  const collectionEntries: Array<{
    collection: Collection;
    trustStatus: CollectionTrustStatus;
    nfts: WalletNFT[];
  }> = [];
  nftsByCollection.forEach((nfts, collId) => {
    const coll = collectionMap.get(collId);
    if (coll) {
      collectionEntries.push({
        collection: coll,
        trustStatus: collectionTrustStatus(
          coll,
          importMetaMap.get(coll.id.toString()),
        ),
        nfts,
      });
    }
  });

  const verifiedCollectionEntries = collectionEntries.filter(({ collection }) =>
    isMintlabVerifiedCollection(
      collection,
      importMetaMap.get(collection.id.toString()),
    ),
  );
  const communityCollectionEntries = collectionEntries.filter(
    ({ collection }) =>
      !isMintlabVerifiedCollection(
        collection,
        importMetaMap.get(collection.id.toString()),
      ),
  );

  const hasNFTs = (userNFTs?.length ?? 0) > 0;
  const dataLoading = nftsLoading || statsLoading || isFetching;

  const { mutate: reportWalletNFT } = useMutation({
    mutationFn: async ({
      collection,
      nft,
    }: {
      collection: Collection;
      nft: WalletNFT;
    }) => {
      if (!actor) throw new Error("Backend not connected");
      const result = await actor.reportNFT(
        collection.id,
        nft.tokenId,
        `Wallet report for ${getNFTTokenLabel(nft, collection)} in ${collection.name}`,
      );
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      toast.success("Report sent to Mintlab admins.");
      void queryClient.invalidateQueries({
        queryKey: ["collectionImportMetas"],
      });
      void queryClient.invalidateQueries({ queryKey: ["nftReportMetas"] });
      void queryClient.invalidateQueries({ queryKey: ["collections"] });
      void queryClient.invalidateQueries({
        queryKey: ["activeListingDetails"],
      });
    },
    onError: (err: Error) => toast.error(`Report failed: ${err.message}`),
  });

  function handleReportWalletNFT(collection: Collection, nft: WalletNFT) {
    reportWalletNFT({ collection, nft });
  }

  // ── sync state ────────────────────────────────────────────────────────────

  const [syncStatus, setSyncStatus] = useState<SyncStatus>({ kind: "idle" });

  // Auto-clear finished sync statuses; keep partial guidance visible until the next sync status update.
  useEffect(() => {
    if (
      syncStatus.kind === "ok" ||
      syncStatus.kind === "upToDate" ||
      syncStatus.kind === "error"
    ) {
      const id = setTimeout(
        () => setSyncStatus({ kind: "idle" }),
        SYNC_FINISHED_STATUS_CLEAR_MS,
      );
      return () => clearTimeout(id);
    }
  }, [syncStatus]);

  const handleSync = useCallback(
    async (options: SyncOptions = {}) => {
      if (!actor) return;
      const silent = options.silent === true;
      const targetCollectionId = options.collectionId ?? null;
      const requestedMode: SyncMode = silent ? "silent" : "manual";
      const requestedScope =
        targetCollectionId === null
          ? "all"
          : `collection:${targetCollectionId.toString()}:hints:${(
              options.tokenHints ?? []
            )
              .map((hint) => hint.trim())
              .filter(Boolean)
              .join("|")}`;
      if (!silent) setSyncStatus({ kind: "syncing" });

      const runWalletSync = async (): Promise<SyncResult> => {
        if (targetCollectionId !== null) {
          const targetCollection =
            collections?.find(
              (collection) => collection.id === targetCollectionId,
            ) ?? null;
          const collectionName =
            targetCollection?.name ?? "Selected collection";
          const tokenHints = options.tokenHints ?? [];
          if (typeof actor.syncUserNFTsForCollectionV2 === "function") {
            const progressPromise = actor.syncUserNFTsForCollectionV2(
              targetCollectionId,
              tokenHints,
              TARGET_SYNC_INDEX_PAGE_LIMIT,
            );
            let progressResult: Awaited<
              ReturnType<typeof actor.syncUserNFTsForCollectionV2>
            >;
            try {
              progressResult = await withTimeout(
                progressPromise,
                SYNC_TIMEOUT_MS,
                SYNC_PAGE_TIMEOUT_MESSAGE,
              );
            } catch (err) {
              const message = extractError(err);
              if (message !== SYNC_PAGE_TIMEOUT_MESSAGE) {
                throw err;
              }

              void progressPromise
                .then(() => {
                  void refetchNFTs();
                  void queryClient.invalidateQueries({
                    queryKey: ["userStats"],
                  });
                })
                .catch((lateError: unknown) => {
                  if (import.meta.env.DEV) {
                    console.debug(
                      "[syncUserNFTsForCollectionV2] late sync failed:",
                      lateError,
                    );
                  }
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
                      message: SYNC_PAGE_TIMEOUT_MESSAGE,
                    },
                  ],
                },
              };
            }

            if (progressResult.__kind__ === "err") {
              return progressResult;
            }

            const skipped = [...progressResult.ok.skipped];
            if (!progressResult.ok.complete && skipped.length === 0) {
              const directHintOnly =
                progressResult.ok.directHintChecked &&
                progressResult.ok.scannedThisRun === 0n &&
                progressResult.ok.indexedThisRun === 0n;
              skipped.push({
                collectionId: targetCollectionId,
                collectionName,
                reason: directHintOnly
                  ? "TOKEN_HINT_CHECKED"
                  : "INDEXING_IN_PROGRESS",
                message: directHintOnly
                  ? "Mintlab checked that token ID directly. The wider collection index is still not complete."
                  : "Mintlab saved selected sync progress for this collection. Click Sync selected again to continue, or enter a known token ID.",
              });
            }
            return {
              __kind__: "ok",
              ok: {
                newCount: progressResult.ok.newCount,
                errors: progressResult.ok.errors,
                skipped,
                progress: progressResult.ok,
              },
            };
          }

          if (typeof actor.syncUserNFTsForCollection !== "function") {
            return {
              __kind__: "err",
              err: "Targeted collection sync is not available in this build.",
            };
          }
          const pagePromise = actor.syncUserNFTsForCollection(
            targetCollectionId,
            TARGET_SYNC_INDEX_PAGE_LIMIT,
          );
          let page: Awaited<ReturnType<typeof actor.syncUserNFTsForCollection>>;
          try {
            page = await withTimeout(
              pagePromise,
              SYNC_TIMEOUT_MS,
              SYNC_PAGE_TIMEOUT_MESSAGE,
            );
          } catch (err) {
            const message = extractError(err);
            if (message !== SYNC_PAGE_TIMEOUT_MESSAGE) {
              throw err;
            }

            void pagePromise
              .then(() => {
                void refetchNFTs();
                void queryClient.invalidateQueries({ queryKey: ["userStats"] });
              })
              .catch((lateError: unknown) => {
                if (import.meta.env.DEV) {
                  console.debug(
                    "[syncUserNFTsForCollection] late sync failed:",
                    lateError,
                  );
                }
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
                    message: SYNC_PAGE_TIMEOUT_MESSAGE,
                  },
                ],
              },
            };
          }

          if (page.__kind__ === "err") {
            return page;
          }

          const skipped = [...page.ok.skipped];
          if (!page.ok.complete && skipped.length === 0) {
            skipped.push({
              collectionId: targetCollectionId,
              collectionName,
              reason: "INDEXING_IN_PROGRESS",
              message:
                "Mintlab saved targeted sync progress for this collection. Click Sync selected again to continue.",
            });
          }
          return {
            __kind__: "ok",
            ok: {
              newCount: page.ok.newCount,
              errors: page.ok.errors,
              skipped,
            },
          };
        }

        if (typeof actor.syncUserNFTsPage !== "function") {
          syncResumeCursorRef.current = null;
          return actor.syncUserNFTsV2();
        }

        let cursor: bigint | null = syncResumeCursorRef.current;
        let newCount = 0n;
        let errors: string[] = [];
        let skipped: WalletSyncSkip[] = [];
        let pages = 0;
        let complete = false;

        while (pages < MAX_SYNC_PAGES_PER_CLICK) {
          pages += 1;
          const pagePromise = actor.syncUserNFTsPage(
            cursor,
            SYNC_PAGE_COLLECTION_LIMIT,
          );
          let page: Awaited<ReturnType<typeof actor.syncUserNFTsPage>>;
          try {
            page = await withTimeout(
              pagePromise,
              SYNC_TIMEOUT_MS,
              SYNC_PAGE_TIMEOUT_MESSAGE,
            );
          } catch (err) {
            const message = extractError(err);
            if (message !== SYNC_PAGE_TIMEOUT_MESSAGE) {
              throw err;
            }

            void pagePromise
              .then(() => {
                void refetchNFTs();
                void queryClient.invalidateQueries({ queryKey: ["userStats"] });
              })
              .catch((lateError: unknown) => {
                if (import.meta.env.DEV) {
                  console.debug(
                    "[syncUserNFTs] late sync page failed:",
                    lateError,
                  );
                }
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
                    message: SYNC_PAGE_TIMEOUT_MESSAGE,
                  },
                ],
              },
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
                  skipped,
                },
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
              message:
                "Mintlab checked several wallet sync pages and saved progress. Click Sync again to continue from the next collection.",
            },
          ];
        }

        return {
          __kind__: "ok",
          ok: { newCount, errors, skipped },
        };
      };

      const applySyncResult = (result: SyncResult) => {
        if (result.__kind__ === "err") {
          if (isSyncAlreadyRunningMessage(result.err)) {
            if (!silent) {
              setSyncStatus({
                kind: "partial",
                newCount: 0,
                message:
                  "A previous wallet sync is still finishing on-chain. Mintlab refreshed your wallet; try Sync again shortly.",
                errors: [],
                skipped: [],
              });
              toast("Wallet sync is already running", {
                description:
                  "Mintlab refreshed your wallet while the previous on-chain check finishes. Known token ID imports still work immediately.",
              });
            }
            return;
          }
          if (!silent) {
            setSyncStatus({ kind: "error", message: result.err });
            toast.error(`Sync failed: ${result.err}`);
          }
          return;
        }

        const newCount = Number(result.ok.newCount);
        const syncErrors = result.ok.errors.filter(
          (message) => message.trim().length > 0,
        );
        const syncSkipped = result.ok.skipped.filter(
          (item) => item.collectionName.trim().length > 0,
        );
        const indexingSkipped = syncSkipped.filter(isAutoIndexingSkip);
        const setupSkipped = syncSkipped.filter(
          (item) => !isAutoIndexingSkip(item),
        );
        const onlyAutoIndexing =
          syncSkipped.length > 0 && setupSkipped.length === 0;
        if (syncErrors.length > 0) {
          console.warn("[syncUserNFTs] collection errors:", syncErrors);
        }
        if (import.meta.env.DEV && syncSkipped.length > 0) {
          console.debug(
            "[syncUserNFTs] collections need automatic discovery follow-up:",
            syncSkipped,
          );
        }
        if (syncErrors.length > 0 || syncSkipped.length > 0) {
          const warningMessage = summarizeSyncAttention(
            syncErrors,
            syncSkipped,
          );
          if (!silent) {
            setSyncStatus({
              kind: "partial",
              newCount,
              message: warningMessage,
              errors: syncErrors,
              skipped: syncSkipped,
              progress: result.ok.progress ?? null,
            });
            if (newCount > 0) {
              toast.success(
                newCount === 1
                  ? "Synced - 1 new NFT found and registered"
                  : `Synced - ${newCount} new NFTs found and registered`,
                {
                  description:
                    syncSkipped.length > 0
                      ? onlyAutoIndexing
                        ? `${indexingSkipped.length} collection(s) are still indexing automatically.`
                        : `${setupSkipped.length} collection(s) need selected sync or a token ID.`
                      : "Some collections could not be checked.",
                },
              );
            } else if (syncErrors.length === 0 && syncSkipped.length > 0) {
              toast(
                onlyAutoIndexing
                  ? "Wallet sync is indexing imported collections"
                  : "Wallet sync complete",
                {
                  description: onlyAutoIndexing
                    ? "Automatic discovery is catching up in small batches. Click Sync again shortly, or import a known token ID directly."
                    : `${setupSkipped.length} collection(s) need selected sync from the collection menu, or a direct token ID import.`,
                },
              );
            } else {
              toast("Sync finished with collection warnings", {
                description: warningMessage,
              });
            }
          }
          return;
        }

        if (newCount > 0) {
          if (!silent) {
            setSyncStatus({ kind: "ok", newCount });
            toast.success(
              newCount === 1
                ? "Synced - 1 new NFT found and registered!"
                : `Synced - ${newCount} new NFTs found and registered!`,
            );
          }
        } else if (!silent) {
          setSyncStatus({ kind: "upToDate" });
          toast.success("Wallet is up to date");
        }
      };

      const existingSync = syncInFlightRef.current;
      const canReuseExistingSync =
        existingSync !== null &&
        syncModeRef.current === requestedMode &&
        syncScopeRef.current === requestedScope;
      const startedNewSync = !canReuseExistingSync;
      let rawSyncPromise: Promise<SyncResult>;
      let syncPromise: Promise<SyncResult>;
      if (canReuseExistingSync) {
        rawSyncPromise = existingSync;
      } else {
        rawSyncPromise = runWalletSync();
        syncInFlightRef.current = rawSyncPromise;
        syncModeRef.current = requestedMode;
        syncScopeRef.current = requestedScope;
      }
      syncPromise = rawSyncPromise;

      let slowNoticeId: number | undefined;
      let refreshId: number | undefined;
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
            toast("Wallet sync is still running", {
              description:
                "Mintlab will keep refreshing your wallet while automatic indexing catches up. Importing a known token ID still works immediately.",
            });
          }
          rawSyncPromise
            .then((result) => applySyncResult(result))
            .catch((lateError: unknown) => {
              const lateMessage = extractError(lateError);
              if (isAgentProcessingTimeoutMessage(lateMessage)) {
                if (import.meta.env.DEV) {
                  console.debug(
                    "[syncUserNFTs] backend call still processing after agent timeout:",
                    lateError,
                  );
                }
                if (!silent) {
                  setSyncStatus({
                    kind: "partial",
                    newCount: 0,
                    message:
                      "Wallet sync is still processing on-chain. Mintlab refreshed your wallet and you can try Sync again shortly.",
                    errors: [],
                    skipped: [],
                  });
                  toast("Wallet sync is still processing on-chain", {
                    description:
                      "Mintlab refreshed your wallet. New NFTs may appear after the backend finishes the in-progress check.",
                  });
                }
                return;
              }
              console.warn("[syncUserNFTs] late sync failed:", lateError);
              if (!silent) {
                setSyncStatus({ kind: "error", message: lateMessage });
                toast.error(`Sync failed: ${lateMessage}`);
              }
            })
            .finally(() => {
              if (refreshId !== undefined) {
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
          toast.error(`Sync error: ${msg}`);
        }
      } finally {
        if (slowNoticeId !== undefined) {
          window.clearTimeout(slowNoticeId);
        }
        if (refreshId !== undefined && !keepRefreshUntilRawSettles) {
          window.clearInterval(refreshId);
        }
        if (
          !keepRefreshUntilRawSettles &&
          syncInFlightRef.current === rawSyncPromise
        ) {
          syncInFlightRef.current = null;
          syncModeRef.current = null;
          syncScopeRef.current = null;
        }
        if (!keepRefreshUntilRawSettles) {
          // Always refresh the local list after sync settles
          void refetchNFTs();
          void queryClient.invalidateQueries({ queryKey: ["userStats"] });
        }
      }
    },
    [actor, collections, queryClient, refetchNFTs],
  );

  const handleSyncCollection = useCallback(
    (collectionId: bigint, tokenHints: string[] = []) => {
      void handleSync({ collectionId, tokenHints });
    },
    [handleSync],
  );

  const openImportSpecificNFT = useCallback((collectionId?: bigint) => {
    setPreferredImportCollectionId(collectionId ?? null);
    setImportSpecificOpen(true);
  }, []);

  const closeImportSpecificNFT = useCallback(() => {
    setImportSpecificOpen(false);
    setPreferredImportCollectionId(null);
  }, []);

  useEffect(() => {
    if (
      !actor ||
      !isAuthenticated ||
      !principalText ||
      isFetching ||
      nftsLoading ||
      !collections
    ) {
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
    handleSync,
  ]);

  // ── render: not authenticated ─────────────────────────────────────────────

  if (!isAuthenticated && !authLoading) {
    return <UnauthHero login={login} />;
  }

  // ── render: loading ───────────────────────────────────────────────────────

  if (authLoading || (isAuthenticated && dataLoading && !userNFTPages)) {
    return (
      <div
        className="px-4 md:px-8 py-8 space-y-8 max-w-7xl mx-auto"
        data-ocid="wallet.loading_state"
      >
        <Skeleton className="h-8 w-48" />
        <div className="flex gap-3">
          <Skeleton className="h-16 w-44 rounded-xl" />
          <Skeleton className="h-16 w-44 rounded-xl" />
        </div>
        <Skeleton className="h-36 w-full rounded-2xl" />
        <div className="h-px bg-border" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8"].map((k) => (
            <Skeleton key={k} className="aspect-square rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  // ── render: authenticated ─────────────────────────────────────────────────

  return (
    <div
      className="px-4 md:px-8 py-8 space-y-8 max-w-7xl mx-auto"
      data-ocid="wallet.page"
    >
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="space-y-1"
      >
        <h1 className="font-display font-bold text-2xl md:text-3xl text-foreground">
          My Wallet
        </h1>
        <p className="text-sm text-muted-foreground">
          Your NFTs and account details
        </p>
      </motion.div>

      {/* Stats bar */}
      <StatsBar stats={userStats} isLoading={statsLoading} />

      {/* Receiving instructions — prominent address section */}
      <ReceivingInstructions
        actor={actor}
        principalText={principalText}
        accountIdHex={accountIdHex}
        collections={collections ?? []}
        onSync={() => {
          void handleSync();
        }}
        onSyncCollection={handleSyncCollection}
        onImportSpecificNFT={openImportSpecificNFT}
        onIndexCollection={
          isAdmin
            ? (collectionId) => setIndexingCollectionId(collectionId)
            : undefined
        }
        syncStatus={syncStatus}
      />

      <RecentNFTTransactionsCard
        transactions={recentNFTTransactions}
        isLoading={nftTransactionsLoading}
      />

      <ImportSpecificNFTModal
        open={importSpecificOpen}
        onClose={closeImportSpecificNFT}
        collections={collections ?? []}
        initialCollectionId={preferredImportCollectionId}
      />

      <CollectionIndexingDialog
        open={indexingCollectionId != null}
        onClose={() => setIndexingCollectionId(null)}
        collection={indexingCollection}
      />

      <MintComposer
        mintConfig={mintConfig ?? null}
        moderationConfig={moderationConfig ?? null}
        mainCollection={
          mintConfig?.collectionId
            ? (collectionMap.get(mintConfig.collectionId) ?? null)
            : null
        }
        creatorCollections={myCreatedCollections}
      />

      <div className="h-px bg-border" />

      {/* NFT grid — grouped by collection */}
      {!hasNFTs ? (
        <>
          <EmptyState
            icon={Wallet}
            title="No NFTs yet"
            description="Register an NFT you received externally, import a supported collection, or create your own Mintlab collection first. Use your Principal ID above to receive NFTs from any ICP wallet."
            data-ocid="wallet.empty_state"
          />
          {/* Supported collections */}
          {(collections ?? []).length > 0 && (
            <div className="mt-2">
              <p className="text-sm text-muted-foreground text-center mb-4">
                Supported collections — register an NFT from any of these:
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {(collections ?? []).map((c, idx) => {
                  const collectionImageUrl = resolveImageUrl(c.imageUrl);
                  return (
                    <div
                      key={c.id.toString()}
                      className="flex items-center gap-2 bg-card border border-border rounded-full px-3 py-1.5 text-sm"
                      data-ocid={`wallet.supported_collection.${idx + 1}`}
                    >
                      {collectionImageUrl && (
                        <img
                          src={collectionImageUrl}
                          alt={c.name}
                          className="w-5 h-5 rounded-full border border-border/50 object-cover"
                        />
                      )}
                      <span className="font-medium text-foreground truncate max-w-[140px]">
                        {c.name}
                      </span>
                      <span className="font-mono text-xs text-muted-foreground">
                        {truncate(c.canisterId.toString(), 5, 3)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="space-y-10" data-ocid="wallet.nft_list">
          {verifiedCollectionEntries.map(
            ({ collection, trustStatus, nfts }, idx) => (
              <CollectionSection
                key={collection.id.toString()}
                collection={collection}
                trustStatus={trustStatus}
                nfts={nfts}
                listedNFTKeys={listedNFTKeys}
                sectionIndex={idx}
                isCreatorCollection={myCreatedCollectionIds.has(collection.id)}
                dividendBalances={dividendBalances}
                onReportNFT={handleReportWalletNFT}
              />
            ),
          )}
          {communityCollectionEntries.length > 0 && (
            <section className="space-y-6">
              <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4">
                <p className="text-sm font-semibold text-foreground">
                  Unverified NFTs
                </p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {COMMUNITY_COLLECTION_NOTICE} Treat names, images, and floor
                  prices carefully, and report suspected counterfeits or unsafe
                  content.
                </p>
              </div>
              {communityCollectionEntries.map(
                ({ collection, trustStatus, nfts }, idx) => (
                  <CollectionSection
                    key={collection.id.toString()}
                    collection={collection}
                    trustStatus={trustStatus}
                    nfts={nfts}
                    listedNFTKeys={listedNFTKeys}
                    sectionIndex={verifiedCollectionEntries.length + idx}
                    isCreatorCollection={myCreatedCollectionIds.has(
                      collection.id,
                    )}
                    dividendBalances={dividendBalances}
                    onReportNFT={handleReportWalletNFT}
                  />
                ),
              )}
            </section>
          )}
          {hasMoreNFTs && (
            <div className="flex justify-center pt-2">
              <Button
                variant="outline"
                onClick={() => void fetchNextNFTPage()}
                disabled={isFetchingMoreNFTs}
              >
                {isFetchingMoreNFTs ? "Loading..." : "Load more NFTs"}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
