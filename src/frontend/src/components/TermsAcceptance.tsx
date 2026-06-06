import {
  TERMS_EFFECTIVE_DATE,
  TERMS_LAST_UPDATED,
  termsRiskHighlights,
} from "@/content/terms";
import { useTermsAcceptance } from "@/hooks/use-terms-acceptance";
import { Link, useRouterState } from "@tanstack/react-router";
import { AlertTriangle, FileText } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

export function TermsLink({ className = "" }: { className?: string }) {
  return (
    <Link
      to="/terms"
      className={`font-medium text-accent transition-colors hover:text-accent/80 ${className}`}
      data-ocid="terms.link"
    >
      Terms of Service
    </Link>
  );
}

export function TermsAgreementNotice({
  actionLabel = "confirming this action",
  className = "",
}: {
  actionLabel?: string;
  className?: string;
}) {
  return (
    <p
      className={`text-xs leading-relaxed text-muted-foreground ${className}`}
      data-ocid="terms.transaction_notice"
    >
      By {actionLabel}, you acknowledge Mintlab's blockchain, escrow, fee,
      dividend, moderation, and canister risks and agree to the <TermsLink />.
    </p>
  );
}

export function TermsGate() {
  const {
    accepted,
    acceptTerms,
    error,
    isAccepting,
    isAuthenticated,
    isAuthLoading,
    isBackendReady,
    isChecking,
  } = useTermsAcceptance();
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });
  const isTermsPage = pathname === "/terms";

  const open =
    isAuthenticated &&
    !isAuthLoading &&
    isBackendReady &&
    !isChecking &&
    !accepted &&
    !isTermsPage;

  return (
    <AlertDialog open={open} onOpenChange={() => {}}>
      <AlertDialogContent
        className="border-border bg-card"
        data-ocid="terms.acceptance_dialog"
      >
        <AlertDialogHeader>
          <div className="mb-1 flex h-10 w-10 items-center justify-center rounded-lg border border-accent/25 bg-accent/10">
            <FileText className="h-5 w-5 text-accent" />
          </div>
          <AlertDialogTitle className="font-display">
            Accept Mintlab Terms
          </AlertDialogTitle>
          <AlertDialogDescription>
            Mintlab uses Internet Computer canisters, in-app ICP balances,
            marketplace escrow, vault transfers, dividend logic, and cycle
            top-ups. Please review the terms before using the app.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="rounded-lg border border-amber-500/25 bg-amber-500/10 p-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <p className="text-sm font-medium text-foreground">
              Key blockchain risks
            </p>
          </div>
          <ul className="mt-2 space-y-1.5">
            {termsRiskHighlights.slice(0, 3).map((risk) => (
              <li
                key={risk}
                className="text-xs leading-relaxed text-muted-foreground"
              >
                {risk}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs leading-relaxed text-muted-foreground">
          Last updated {TERMS_LAST_UPDATED}. Effective {TERMS_EFFECTIVE_DATE}.{" "}
          <TermsLink />
        </p>

        {error ? (
          <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs leading-relaxed text-destructive">
            {error}
          </p>
        ) : null}

        <AlertDialogFooter>
          <AlertDialogAction
            className="bg-accent text-accent-foreground hover:bg-accent/90"
            disabled={isAccepting}
            onClick={(event) => {
              event.preventDefault();
              void acceptTerms();
            }}
            data-ocid="terms.accept_button"
          >
            {isAccepting ? "Accepting..." : "I Agree"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
