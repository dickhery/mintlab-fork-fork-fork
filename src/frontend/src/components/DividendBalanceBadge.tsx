import { Badge } from "@/components/ui/badge";
import { formatICPAmount } from "@/lib/icp";
import { cn } from "@/lib/utils";
import { Coins } from "lucide-react";

interface DividendBalanceBadgeProps {
  e8s: bigint;
  size?: "sm" | "md";
  compact?: boolean;
  label?: string;
  className?: string;
}

const E8S = 100_000_000n;

function formatCompactICPAmount(e8s: bigint): string {
  const whole = e8s / E8S;
  const frac = (e8s % E8S).toString().padStart(8, "0").slice(0, 4);
  const trimmed = frac.replace(/0+$/, "");
  return trimmed ? `${whole}.${trimmed}` : whole.toString();
}

export function DividendBalanceBadge({
  e8s,
  size = "sm",
  compact = false,
  label = "Dividend balance",
  className,
}: DividendBalanceBadgeProps) {
  if (e8s <= 0n) return null;

  const fullAmount = formatICPAmount(e8s);
  const displayAmount = compact ? formatCompactICPAmount(e8s) : fullAmount;
  const title = `${label}: ${fullAmount} ICP`;

  return (
    <Badge
      className={cn(
        "max-w-full flex-wrap justify-start whitespace-normal break-words border bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
        size === "sm" ? "text-[10px] leading-tight" : "text-xs",
        className,
      )}
      title={title}
      aria-label={title}
    >
      <Coins className="shrink-0" />
      <span>{label}:</span>
      <span className="font-mono font-semibold">{displayAmount} ICP</span>
    </Badge>
  );
}
