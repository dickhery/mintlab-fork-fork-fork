import { Badge } from "@/components/ui/badge";
import { formatICPAmount } from "@/lib/icp";
import type {
  RecentTransaction,
  TransactionDirection,
  TransactionKind,
  TransactionStatus,
} from "@/types";
import {
  ArrowDownLeft,
  ArrowUpRight,
  CircleDollarSign,
  Gavel,
  Image,
  Layers,
  Minus,
  ShoppingBag,
  Wallet,
  Zap,
} from "lucide-react";
import type { ReactNode } from "react";

export function formatTransactionTime(timestampNanos: bigint): string {
  const date = new Date(Number(timestampNanos / 1_000_000n));
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function transactionAmountLabel(tx: RecentTransaction): string {
  if (tx.amountE8s === null) return "";
  const prefix =
    tx.direction === "In" ? "+" : tx.direction === "Out" ? "-" : "";
  return `${prefix}${formatICPAmount(tx.amountE8s)} ICP`;
}

export function transactionKindLabel(kind: TransactionKind): string {
  switch (kind) {
    case "ICPTransferOut":
      return "ICP transfer";
    case "Mint":
      return "Mint";
    case "CollectionCreation":
      return "Collection creation";
    case "CollectionCanisterTopUp":
      return "Collection top-up";
    case "AppCanisterTopUp":
      return "App top-up";
    case "MarketplacePurchase":
      return "Marketplace purchase";
    case "MarketplaceSale":
      return "Marketplace sale";
    case "AuctionBid":
      return "Auction bid";
    case "AuctionRefund":
      return "Auction refund";
    case "DividendClaim":
      return "Dividend claim";
    default:
      return kind;
  }
}

export function transactionStatusTone(status: TransactionStatus): string {
  if (status === "Completed") {
    return "border-emerald-500/30 bg-emerald-500/10 text-emerald-500";
  }
  if (status === "Failed") {
    return "border-destructive/30 bg-destructive/10 text-destructive";
  }
  return "border-amber-500/30 bg-amber-500/10 text-amber-500";
}

export function transactionDirectionIcon(tx: RecentTransaction): ReactNode {
  switch (tx.kind) {
    case "Mint":
      return <Image className="h-4 w-4 text-accent" />;
    case "MarketplacePurchase":
    case "MarketplaceSale":
      return <ShoppingBag className="h-4 w-4 text-primary" />;
    case "AuctionBid":
    case "AuctionRefund":
      return <Gavel className="h-4 w-4 text-accent" />;
    case "DividendClaim":
      return <CircleDollarSign className="h-4 w-4 text-emerald-500" />;
    case "CollectionCreation":
    case "CollectionCanisterTopUp":
      return <Layers className="h-4 w-4 text-primary" />;
    case "AppCanisterTopUp":
      return <Zap className="h-4 w-4 text-accent" />;
    case "ICPTransferOut":
      return <Wallet className="h-4 w-4 text-amber-500" />;
    default:
      break;
  }

  if (tx.direction === "In") {
    return <ArrowDownLeft className="h-4 w-4 text-emerald-500" />;
  }
  if (tx.direction === "Out") {
    return <ArrowUpRight className="h-4 w-4 text-amber-500" />;
  }
  return <Minus className="h-4 w-4 text-muted-foreground" />;
}

export function transactionAmountTone(direction: TransactionDirection): string {
  if (direction === "In") return "text-emerald-500";
  if (direction === "Out") return "text-foreground";
  return "text-muted-foreground";
}

interface TransactionActivityRowProps {
  tx: RecentTransaction;
  showKind?: boolean;
}

export function TransactionActivityRow({
  tx,
  showKind = true,
}: TransactionActivityRowProps) {
  const amount = transactionAmountLabel(tx);

  return (
    <div className="flex items-start gap-3 py-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-muted/40">
        {transactionDirectionIcon(tx)}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="truncate text-sm font-medium text-foreground">
            {tx.title}
          </p>
          {showKind && (
            <Badge
              variant="secondary"
              className="shrink-0 px-1.5 py-0 text-[10px] font-normal"
            >
              {transactionKindLabel(tx.kind)}
            </Badge>
          )}
          {tx.status !== "Completed" && (
            <Badge
              variant="outline"
              className={`shrink-0 px-1.5 py-0 text-[10px] ${transactionStatusTone(tx.status)}`}
            >
              {tx.status}
            </Badge>
          )}
        </div>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          {tx.detail}
        </p>
        <p className="mt-1.5 text-[11px] text-muted-foreground">
          {formatTransactionTime(tx.occurredAt)}
          {tx.blockIndex !== null && (
            <span className="font-mono">
              {" "}
              · block {tx.blockIndex.toString()}
            </span>
          )}
        </p>
      </div>
      {amount && (
        <div className="shrink-0 text-right">
          <p
            className={`font-mono text-sm font-semibold ${transactionAmountTone(tx.direction)}`}
          >
            {amount}
          </p>
          {tx.feeE8s !== null && tx.feeE8s > 0n && (
            <p className="font-mono text-[11px] text-muted-foreground">
              fee {formatICPAmount(tx.feeE8s)}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
