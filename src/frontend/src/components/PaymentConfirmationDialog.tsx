import { LoadingSpinner } from "@/components/LoadingSpinner";
import { TermsAgreementNotice } from "@/components/TermsAcceptance";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { ReactNode } from "react";

interface PaymentLine {
  label: string;
  value: string;
  helper?: string;
}

interface PaymentConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  lines: PaymentLine[];
  children?: ReactNode;
  cancelLabel?: string;
  confirmLabel?: string;
  isPending?: boolean;
  onConfirm: () => void;
  ocid: string;
}

export function PaymentConfirmationDialog({
  open,
  onOpenChange,
  title,
  description,
  lines,
  children,
  cancelLabel = "Cancel",
  confirmLabel = "Confirm Payment",
  isPending = false,
  onConfirm,
  ocid,
}: PaymentConfirmationDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent
        className="max-h-[90vh] overflow-y-auto bg-card border-border sm:max-w-xl"
        data-ocid={ocid}
      >
        <AlertDialogHeader>
          <AlertDialogTitle className="font-display">{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        {children}
        <div className="space-y-2 rounded-lg border border-border bg-muted/30 p-3 text-sm">
          {lines.map((line) => (
            <div
              key={line.label}
              className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-4"
            >
              <span className="text-muted-foreground">
                {line.label}
                {line.helper && (
                  <span className="block text-[11px] leading-snug text-muted-foreground/80">
                    {line.helper}
                  </span>
                )}
              </span>
              <span className="break-words text-right font-mono text-foreground">
                {line.value}
              </span>
            </div>
          ))}
        </div>
        <TermsAgreementNotice />
        <AlertDialogFooter>
          <AlertDialogCancel className="border-border" disabled={isPending}>
            {cancelLabel}
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-accent text-accent-foreground hover:bg-accent/90"
            disabled={isPending}
            onClick={onConfirm}
          >
            {isPending ? <LoadingSpinner size="sm" /> : confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
