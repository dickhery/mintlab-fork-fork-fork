import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { CollectionCreationDiagnostics } from "@/types";
import { Fuel, LoaderCircle } from "lucide-react";

const FACTORY_RESERVE_BUFFER = 100_000_000_000n;

function formatCycles(cycles: bigint): string {
  const trillion = 1_000_000_000_000n;
  if (cycles < trillion) return cycles.toString();
  const hundredths = (cycles * 100n) / trillion;
  const whole = hundredths / 100n;
  const fraction = (hundredths % 100n).toString().padStart(2, "0");
  return `${whole}.${fraction}T`;
}

export function recommendedCollectionCreationTopUpCycles(
  diagnostics: CollectionCreationDiagnostics,
): bigint {
  if (diagnostics.canCreateNow) return 0n;
  const shortfall =
    diagnostics.requiredBackendCycles > diagnostics.backendCycles
      ? diagnostics.requiredBackendCycles - diagnostics.backendCycles
      : 0n;
  return shortfall + FACTORY_RESERVE_BUFFER;
}

export function CollectionCreationDiagnosticsPanel({
  diagnostics,
  error,
  isLoading,
  onTopUp,
}: {
  diagnostics?: CollectionCreationDiagnostics | null;
  error?: string | null;
  isLoading?: boolean;
  onTopUp?: (diagnostics: CollectionCreationDiagnostics) => void;
}) {
  if (isLoading && !diagnostics) {
    return (
      <div className="rounded-lg border border-border bg-muted/20 p-3 text-xs text-muted-foreground">
        <LoaderCircle className="mr-2 inline h-3.5 w-3.5 animate-spin" />
        Checking collection setup cycles...
      </div>
    );
  }

  if (error && !diagnostics) {
    return (
      <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-xs text-destructive">
        Diagnostics unavailable: {error}
      </div>
    );
  }

  if (!diagnostics) return null;

  const isInstalled = diagnostics.request.status === "Installed";
  const recommendedTopUp =
    recommendedCollectionCreationTopUpCycles(diagnostics);

  return (
    <div className="rounded-lg border border-border bg-muted/20 p-3 text-xs">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium text-foreground">
          Creation diagnostics
        </span>
        <Badge
          variant={
            isInstalled || diagnostics.canCreateNow
              ? "secondary"
              : "destructive"
          }
          className="text-[11px]"
        >
          {isInstalled
            ? "Completed"
            : diagnostics.canCreateNow
              ? "Ready to create"
              : "Top up app"}
        </Badge>
      </div>
      <dl className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <div>
          <dt className="text-muted-foreground">Attach</dt>
          <dd className="font-mono text-foreground">
            {formatCycles(diagnostics.createCallCycles)}
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Backend</dt>
          <dd className="font-mono text-foreground">
            {formatCycles(diagnostics.backendCycles)}
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Required</dt>
          <dd className="font-mono text-foreground">
            {formatCycles(diagnostics.requiredBackendCycles)}
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Child target</dt>
          <dd className="font-mono text-foreground">
            {formatCycles(diagnostics.childTargetCycles)}
          </dd>
        </div>
      </dl>
      <p className="mt-2 break-all text-[11px] text-muted-foreground">
        Build {diagnostics.buildVersion}
      </p>
      {!isInstalled && !diagnostics.canCreateNow && (
        <div className="mt-3 flex flex-col gap-2 rounded-md border border-amber-500/20 bg-amber-500/10 p-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-amber-800 dark:text-amber-200">
            Top up about {formatCycles(recommendedTopUp)} cycles before retrying
            this setup. If an ICP block is already recorded, the user does not
            need to pay the collection fee again.
          </p>
          {onTopUp && (
            <Button
              type="button"
              size="sm"
              variant="secondary"
              className="shrink-0 gap-2"
              onClick={() => onTopUp(diagnostics)}
            >
              <Fuel className="h-3.5 w-3.5" />
              Top Up
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
