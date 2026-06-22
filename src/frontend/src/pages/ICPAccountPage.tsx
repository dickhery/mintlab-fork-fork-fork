import type {
  AccountIdentifier,
  RecentTransaction,
  TransferResult,
} from "@/backend-client";
import { HelpCallout } from "@/components/HelpCallout";
import { TermsAgreementNotice } from "@/components/TermsAcceptance";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { useBackend } from "@/hooks/use-backend";
import { ICP_E8S, parseICPToE8s } from "@/lib/icp";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowDownLeft,
  ArrowUpRight,
  CheckCircle2,
  Copy,
  History,
  LogIn,
  Minus,
  RefreshCw,
  Send,
  Wallet,
} from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";

// ─── helpers ──────────────────────────────────────────────────────────────────

const TRANSFER_FEE = 10_000n;
const MAX_NAT64 = 18_446_744_073_709_551_615n;

function formatICP(e8s: bigint): string {
  const whole = e8s / ICP_E8S;
  const frac = e8s % ICP_E8S;
  const fracStr = frac.toString().padStart(8, "0");
  return `${whole}.${fracStr}`;
}

function accountIdToHex(bytes: AccountIdentifier): string {
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

function createWithdrawalNonce(): bigint {
  const cryptoApi = globalThis.crypto;
  if (cryptoApi?.getRandomValues) {
    const bytes = new Uint8Array(8);
    cryptoApi.getRandomValues(bytes);
    let value = 0n;
    for (const byte of bytes) {
      value = (value << 8n) + BigInt(byte);
    }
    return value === 0n ? 1n : value;
  }

  return (
    BigInt(Date.now()) * 1_000_000n +
    BigInt(Math.floor(Math.random() * 1_000_000))
  );
}

function parseMemoToNat64(value: string): bigint | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (!/^\d+$/.test(trimmed)) return null;
  const parsed = BigInt(trimmed);
  return parsed <= MAX_NAT64 ? parsed : null;
}

function formatTransferError(result: TransferResult): string {
  if (result.__kind__ === "Ok") return "";
  const err = result.Err;
  switch (err.__kind__) {
    case "InsufficientFunds":
      return `Insufficient funds. Balance: ${formatICP(err.InsufficientFunds.balance.e8s)} ICP`;
    case "BadFee":
      return `Bad fee. Expected: ${formatICP(err.BadFee.expected_fee.e8s)} ICP`;
    case "TxDuplicate":
      return `Duplicate transaction (block ${err.TxDuplicate.duplicate_of})`;
    case "TxTooOld":
      return "Transaction too old";
    case "TxCreatedInFuture":
      return "Transaction created in future";
    default:
      return "Transfer failed";
  }
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

function transactionAmountLabel(tx: RecentTransaction): string {
  if (tx.amountE8s === null) return "";
  const prefix =
    tx.direction === "In" ? "+" : tx.direction === "Out" ? "-" : "";
  return `${prefix}${formatICP(tx.amountE8s)} ICP`;
}

function transactionIcon(tx: RecentTransaction) {
  if (tx.direction === "In") {
    return <ArrowDownLeft className="h-4 w-4 text-emerald-500" />;
  }
  if (tx.direction === "Out") {
    return <ArrowUpRight className="h-4 w-4 text-amber-500" />;
  }
  return <Minus className="h-4 w-4 text-muted-foreground" />;
}

function statusTone(status: RecentTransaction["status"]): string {
  if (status === "Completed") {
    return "border-emerald-500/30 bg-emerald-500/10 text-emerald-500";
  }
  if (status === "Failed") {
    return "border-destructive/30 bg-destructive/10 text-destructive";
  }
  return "border-amber-500/30 bg-amber-500/10 text-amber-500";
}

function RecentTransactionRow({ tx }: { tx: RecentTransaction }) {
  const amount = transactionAmountLabel(tx);

  return (
    <div className="flex items-center gap-3 py-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border/60 bg-muted/40">
        {transactionIcon(tx)}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-medium text-foreground">
            {tx.title}
          </p>
          {tx.status !== "Completed" && (
            <Badge
              variant="outline"
              className={`shrink-0 px-1.5 py-0 text-[10px] ${statusTone(tx.status)}`}
            >
              {tx.status}
            </Badge>
          )}
        </div>
        <p className="truncate text-xs text-muted-foreground">{tx.detail}</p>
        <p className="mt-1 text-[11px] text-muted-foreground">
          {formatTransactionTime(tx.occurredAt)}
          {tx.blockIndex !== null && (
            <span className="font-mono"> block {tx.blockIndex.toString()}</span>
          )}
        </p>
      </div>
      {amount && (
        <div className="shrink-0 text-right">
          <p
            className={`font-mono text-sm font-semibold ${
              tx.direction === "In"
                ? "text-emerald-500"
                : tx.direction === "Out"
                  ? "text-foreground"
                  : "text-muted-foreground"
            }`}
          >
            {amount}
          </p>
          {tx.feeE8s !== null && tx.feeE8s > 0n && (
            <p className="font-mono text-[11px] text-muted-foreground">
              fee {formatICP(tx.feeE8s)}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ─── CopyField ────────────────────────────────────────────────────────────────

function CopyField({
  label,
  value,
  ocid,
  note,
}: {
  label: string;
  value: string;
  ocid: string;
  note?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [value]);

  return (
    <div className="space-y-1.5">
      <Label className="text-muted-foreground text-xs uppercase tracking-wider">
        {label}
      </Label>
      <div className="flex items-center gap-2">
        <code className="flex-1 font-mono text-xs bg-muted/60 border border-border/50 rounded-md px-3 py-2.5 text-foreground truncate min-w-0 select-all">
          {value}
        </code>
        <Button
          size="icon"
          variant="outline"
          className="shrink-0 border-border/50 hover:border-primary/60 hover:bg-primary/10 transition-colors duration-200"
          onClick={handleCopy}
          aria-label={`Copy ${label}`}
          data-ocid={ocid}
        >
          {copied ? (
            <CheckCircle2 className="h-3.5 w-3.5 text-accent" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
        </Button>
      </div>
      {note && <p className="text-xs text-muted-foreground pl-1">{note}</p>}
    </div>
  );
}

// ─── ICPAccountPage ───────────────────────────────────────────────────────────

export default function ICPAccountPage() {
  const { isAuthenticated, login, principalText } = useAuth();
  const { actor, isFetching } = useBackend();
  const queryClient = useQueryClient();

  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");
  const [withdrawalNonce, setWithdrawalNonce] = useState<bigint | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const recipientError =
    recipient.length > 0 && !/^[0-9a-fA-F]{64}$/.test(recipient)
      ? "Must be a 64-character hex string"
      : null;

  const parsedAmountE8s = parseICPToE8s(amount);
  const parsedMemo = parseMemoToNat64(memo);
  const amountE8s = parsedAmountE8s ?? 0n;
  const totalDebitE8s = amountE8s + TRANSFER_FEE;

  const {
    data: balanceE8s,
    isLoading: balanceLoading,
    refetch: refetchBalance,
    isRefetching,
  } = useQuery<bigint>({
    queryKey: ["icp-balance"],
    queryFn: async () => {
      if (!actor) return 0n;
      return actor.getUserICPBalance();
    },
    enabled: !!actor && !isFetching && isAuthenticated,
    refetchInterval: 30_000,
  });

  const { data: accountIdBytes, isLoading: accountIdLoading } =
    useQuery<AccountIdentifier>({
      queryKey: ["account-id"],
      queryFn: async () => {
        if (!actor) return new Uint8Array(0);
        return actor.getUserAccountId();
      },
      enabled: !!actor && !isFetching && isAuthenticated,
    });

  const { data: recentTransactions = [], isLoading: transactionsLoading } =
    useQuery<RecentTransaction[]>({
      queryKey: ["recent-transactions", principalText],
      queryFn: async () => {
        if (!actor) return [];
        return actor.getMyRecentTransactions(10n);
      },
      enabled: !!actor && !isFetching && isAuthenticated,
      refetchInterval: 30_000,
    });

  const accountIdHex = accountIdBytes ? accountIdToHex(accountIdBytes) : null;
  const balanceNum = balanceE8s ?? 0n;
  const hasAmount = amount.trim().length > 0;
  const amountInvalid = hasAmount && parsedAmountE8s === null;
  const memoInvalid = memo.trim().length > 0 && parsedMemo === null;
  const amountTooSmall = amountE8s > 0n && amountE8s <= TRANSFER_FEE;
  const amountExceedsBalance = amountE8s > 0n && totalDebitE8s > balanceNum;

  const formValid =
    /^[0-9a-fA-F]{64}$/.test(recipient) &&
    amountE8s > TRANSFER_FEE &&
    !amountExceedsBalance &&
    !memoInvalid;

  const transferMutation = useMutation<TransferResult, Error>({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected to backend");
      const to = hexToAccountId(recipient);
      const clientNonce =
        withdrawalNonce ?? parsedMemo ?? createWithdrawalNonce();
      if (withdrawalNonce === null) {
        setWithdrawalNonce(clientNonce);
      }
      const result = await actor.transferICPOutWithClientNonce(
        to,
        amountE8s,
        clientNonce,
      );
      return result;
    },
    onSuccess: (result) => {
      setConfirmOpen(false);
      if (result.__kind__ === "Ok") {
        toast.success("Transfer successful!", {
          description: `Transaction confirmed at block ${result.Ok}`,
          duration: 6000,
        });
        setRecipient("");
        setAmount("");
        setMemo("");
        setWithdrawalNonce(null);
        queryClient.invalidateQueries({ queryKey: ["icp-balance"] });
        queryClient.invalidateQueries({ queryKey: ["recent-transactions"] });
      } else {
        toast.error("Transfer failed", {
          description: formatTransferError(result),
          duration: 8000,
        });
      }
    },
    onError: (err) => {
      setConfirmOpen(false);
      toast.error("Transfer error", {
        description: err.message ?? "Unknown error",
        duration: 8000,
      });
    },
  });

  // ── Unauthenticated gate ──────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div
        className="flex-1 flex flex-col items-center justify-center min-h-[70vh] gap-6 px-4"
        data-ocid="icp-account.page"
      >
        <div className="rounded-2xl bg-card border border-border/50 shadow-lg p-10 flex flex-col items-center gap-5 max-w-sm w-full">
          <div className="rounded-full bg-primary/15 border border-primary/30 p-4">
            <Wallet className="h-8 w-8 text-primary" />
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-xl font-display font-semibold text-foreground">
              Connect to view your ICP account
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Authenticate with Internet Identity to view your balance, account
              address, and transfer ICP.
            </p>
          </div>
          <Button
            className="w-full gap-2"
            onClick={login}
            data-ocid="icp-account.login_button"
          >
            <LogIn className="h-4 w-4" />
            Sign in with Internet Identity
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex-1 flex flex-col gap-6 px-4 py-8 max-w-2xl mx-auto w-full"
      data-ocid="icp-account.page"
    >
      {/* Page header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-display font-bold text-foreground">
          ICP Account
        </h1>
        <p className="text-sm text-muted-foreground">
          View your balance and transfer ICP to any address
        </p>
      </div>

      <HelpCallout
        title="Your in-app balance funds Mintlab actions"
        sectionId="icp-account"
        actionLabel="ICP guide"
        ocid="icp-account.help_callout"
      >
        Use the Account Identifier below to receive ICP. This balance pays for
        minting, collection creation, marketplace buys, auction bids, and cycle
        top-ups.
      </HelpCallout>

      {/* ── Balance card ── */}
      <Card
        className="relative border-primary/20 bg-card shadow-lg overflow-hidden"
        data-ocid="icp-account.balance_card"
      >
        <div className="absolute inset-0 pointer-events-none rounded-xl bg-gradient-to-br from-primary/8 via-transparent to-accent/5" />
        <CardHeader className="pb-3 relative">
          <CardTitle className="flex items-center justify-between text-sm font-medium text-muted-foreground uppercase tracking-wider">
            <span className="flex items-center gap-2">
              <ArrowDownLeft className="h-4 w-4 text-primary" />
              Available Balance
            </span>
            <Button
              size="sm"
              variant="ghost"
              className="h-7 gap-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/60"
              onClick={() => refetchBalance()}
              disabled={isRefetching || balanceLoading}
              data-ocid="icp-account.refresh_button"
            >
              <RefreshCw
                className={`h-3 w-3 ${isRefetching ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="relative pb-6">
          {balanceLoading ? (
            <div
              className="space-y-2"
              data-ocid="icp-account.balance_loading_state"
            >
              <Skeleton className="h-12 w-56" />
              <Skeleton className="h-4 w-32" />
            </div>
          ) : (
            <>
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-4xl font-bold text-primary tabular-nums tracking-tight">
                  {formatICP(balanceNum)}
                </span>
                <Badge
                  variant="secondary"
                  className="bg-primary/15 text-primary border-primary/30 text-xs font-mono"
                >
                  ICP
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-2 font-mono">
                {balanceNum.toString()} e8s
              </p>
            </>
          )}
        </CardContent>
      </Card>

      {/* ── Identity info card ── */}
      <Card
        className="border-border/50 bg-card shadow-sm"
        data-ocid="icp-account.identity_card"
      >
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Your Addresses
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {accountIdLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            accountIdHex && (
              <CopyField
                label="Account Identifier (ICP Ledger)"
                value={accountIdHex}
                ocid="icp-account.account_id_copy_button"
                note="📨 Send ICP to this address to top up your wallet"
              />
            )
          )}
          {principalText && (
            <CopyField
              label="Principal ID"
              value={principalText}
              ocid="icp-account.principal_id_copy_button"
            />
          )}
        </CardContent>
      </Card>

      {/* ── Recent transactions card ── */}
      <Card
        className="border-border/50 bg-card shadow-sm"
        data-ocid="icp-account.recent_transactions_card"
      >
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-sm font-medium text-muted-foreground uppercase tracking-wider">
            <span className="flex items-center gap-2">
              <History className="h-4 w-4 text-accent" />
              Recent Transactions
            </span>
            <span className="flex shrink-0 items-center gap-2">
              {recentTransactions.length > 0 && (
                <Badge variant="secondary" className="font-mono text-[10px]">
                  {recentTransactions.length}/10
                </Badge>
              )}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 gap-1.5 text-xs text-accent"
                asChild
              >
                <Link
                  to="/activity"
                  search={{ scope: "icp" }}
                  data-ocid="icp-account.view_all_activity.link"
                >
                  View all
                </Link>
              </Button>
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {transactionsLoading ? (
            <div
              className="space-y-3"
              data-ocid="icp-account.transactions_loading_state"
            >
              {[0, 1, 2].map((row) => (
                <div key={row} className="flex items-center gap-3">
                  <Skeleton className="h-9 w-9 rounded-md" />
                  <div className="min-w-0 flex-1 space-y-2">
                    <Skeleton className="h-4 w-36" />
                    <Skeleton className="h-3 w-52 max-w-full" />
                  </div>
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
            </div>
          ) : recentTransactions.length === 0 ? (
            <div
              className="flex flex-col items-center gap-2 py-6 text-center text-sm text-muted-foreground"
              data-ocid="icp-account.transactions_empty_state"
            >
              <History className="h-5 w-5" />
              <span>No recent transactions yet.</span>
            </div>
          ) : (
            <div data-ocid="icp-account.transactions_list">
              {recentTransactions.map((tx, index) => (
                <div
                  key={tx.id.toString()}
                  className={index > 0 ? "border-t border-border/50" : ""}
                >
                  <RecentTransactionRow tx={tx} />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Transfer Out card ── */}
      <Card
        className="border-border/50 bg-card shadow-sm"
        data-ocid="icp-account.transfer_card"
      >
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <Send className="h-4 w-4 text-accent" />
            Transfer ICP Out
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Recipient */}
          <div className="space-y-2">
            <Label
              htmlFor="recipient"
              className="text-sm font-medium text-foreground"
            >
              Recipient Account ID
            </Label>
            <Input
              id="recipient"
              placeholder="64-character hex account identifier…"
              value={recipient}
              onChange={(e) => {
                setRecipient(e.target.value.trim());
                setWithdrawalNonce(null);
              }}
              className="font-mono text-xs bg-muted/30 border-border/60 focus:border-primary/60 placeholder:text-muted-foreground/50"
              data-ocid="icp-account.recipient_input"
            />
            {recipientError && (
              <p
                className="text-xs text-destructive flex items-center gap-1.5"
                data-ocid="icp-account.recipient_field_error"
              >
                <AlertCircle className="h-3 w-3 shrink-0" />
                {recipientError}
              </p>
            )}
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label
              htmlFor="amount"
              className="text-sm font-medium text-foreground"
            >
              Amount (ICP)
            </Label>
            <div className="relative">
              <Input
                id="amount"
                type="number"
                placeholder="0.00000000"
                min="0"
                step="0.00000001"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setWithdrawalNonce(null);
                }}
                className="font-mono pr-14 bg-muted/30 border-border/60 focus:border-primary/60 placeholder:text-muted-foreground/50"
                data-ocid="icp-account.amount_input"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-muted-foreground pointer-events-none">
                ICP
              </span>
            </div>
            {amountExceedsBalance && (
              <p
                className="text-xs text-destructive flex items-center gap-1.5"
                data-ocid="icp-account.amount_field_error"
              >
                <AlertCircle className="h-3 w-3 shrink-0" />
                Exceeds balance ({formatICP(balanceNum)} ICP available)
              </p>
            )}
            {amountInvalid && !amountExceedsBalance && (
              <p
                className="text-xs text-destructive flex items-center gap-1.5"
                data-ocid="icp-account.amount_field_error"
              >
                <AlertCircle className="h-3 w-3 shrink-0" />
                Enter a valid ICP amount with up to 8 decimals
              </p>
            )}
            {amountTooSmall && !amountExceedsBalance && (
              <p
                className="text-xs text-destructive flex items-center gap-1.5"
                data-ocid="icp-account.amount_field_error"
              >
                <AlertCircle className="h-3 w-3 shrink-0" />
                Amount must exceed the network fee
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Network fee: {formatICP(TRANSFER_FEE)} ICP (deducted from your
              balance)
            </p>
          </div>

          {/* Memo */}
          <div className="space-y-2">
            <Label
              htmlFor="memo"
              className="text-sm font-medium text-foreground"
            >
              Memo{" "}
              <span className="text-muted-foreground font-normal text-xs">
                (optional)
              </span>
            </Label>
            <Input
              id="memo"
              type="number"
              placeholder="Numeric memo e.g. 12345"
              min="0"
              value={memo}
              onChange={(e) => {
                setMemo(e.target.value);
                setWithdrawalNonce(null);
              }}
              className="font-mono bg-muted/30 border-border/60 focus:border-primary/60 placeholder:text-muted-foreground/50"
              data-ocid="icp-account.memo_input"
            />
            {memoInvalid && (
              <p
                className="text-xs text-destructive flex items-center gap-1.5"
                data-ocid="icp-account.memo_field_error"
              >
                <AlertCircle className="h-3 w-3 shrink-0" />
                Memo must be a non-negative 64-bit integer
              </p>
            )}
          </div>

          {/* Submit button */}
          <Button
            className="w-full gap-2 font-medium"
            disabled={!formValid || transferMutation.isPending}
            onClick={() => {
              setWithdrawalNonce(
                (current) => current ?? parsedMemo ?? createWithdrawalNonce(),
              );
              setConfirmOpen(true);
            }}
            data-ocid="icp-account.transfer_submit_button"
          >
            {transferMutation.isPending ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            {transferMutation.isPending ? "Sending…" : "Transfer ICP"}
          </Button>

          {/* Success state banner */}
          {transferMutation.isSuccess &&
            transferMutation.data.__kind__ === "Ok" && (
              <div
                className="flex items-center gap-2 rounded-lg bg-green-500/10 border border-green-500/30 px-3 py-2.5 text-sm text-green-400"
                data-ocid="icp-account.success_state"
              >
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>
                  Transfer confirmed — block{" "}
                  <span className="font-mono font-semibold">
                    {transferMutation.data.Ok.toString()}
                  </span>
                </span>
              </div>
            )}

          {/* Error state banner */}
          {transferMutation.isError && (
            <div
              className="flex items-center gap-2 rounded-lg bg-destructive/10 border border-destructive/30 px-3 py-2.5 text-sm text-destructive"
              data-ocid="icp-account.error_state"
            >
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{transferMutation.error?.message ?? "Unknown error"}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Confirm dialog ── */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent
          className="bg-card border-border/60 shadow-2xl max-w-sm"
          data-ocid="icp-account.dialog"
        >
          <DialogHeader>
            <DialogTitle className="font-display text-lg text-foreground">
              Confirm Transfer
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm">
              Review the details carefully before confirming.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 rounded-lg bg-muted/40 border border-border/40 p-4 text-sm">
            <div className="flex justify-between items-start gap-3">
              <span className="text-muted-foreground shrink-0">To</span>
              <code className="font-mono text-xs text-foreground text-right break-all leading-relaxed">
                {recipient}
              </code>
            </div>
            <div className="h-px bg-border/50" />
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">You send</span>
              <span className="font-mono font-semibold text-primary">
                {formatICP(amountE8s)} ICP
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground">Network fee</span>
              <span className="font-mono text-muted-foreground">
                {formatICP(TRANSFER_FEE)} ICP
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground">Total deducted</span>
              <span className="font-mono text-muted-foreground">
                {formatICP(totalDebitE8s)} ICP
              </span>
            </div>
            <div className="h-px bg-border/50" />
            <div className="flex justify-between items-center">
              <span className="text-foreground font-semibold">
                Recipient receives
              </span>
              <span className="font-mono font-bold text-foreground">
                {formatICP(amountE8s)} ICP
              </span>
            </div>
            {memo && (
              <>
                <div className="h-px bg-border/50" />
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Memo</span>
                  <span className="font-mono text-foreground">{memo}</span>
                </div>
              </>
            )}
          </div>

          <TermsAgreementNotice actionLabel="confirming this ICP transfer" />

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setConfirmOpen(false)}
              disabled={transferMutation.isPending}
              className="border-border/50"
              data-ocid="icp-account.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={() => transferMutation.mutate()}
              disabled={transferMutation.isPending}
              className="gap-2"
              data-ocid="icp-account.confirm_button"
            >
              {transferMutation.isPending ? (
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Send className="h-3.5 w-3.5" />
              )}
              {transferMutation.isPending ? "Sending…" : "Confirm Transfer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
