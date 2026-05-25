import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { HelpSectionId } from "@/content/help";
import { cn } from "@/lib/utils";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, CircleHelp } from "lucide-react";
import type { ReactNode } from "react";

interface HelpCalloutProps {
  title: string;
  children: ReactNode;
  sectionId?: HelpSectionId;
  actionLabel?: string;
  className?: string;
  ocid?: string;
}

export function HelpCallout({
  title,
  children,
  sectionId,
  actionLabel = "Open guide",
  className,
  ocid,
}: HelpCalloutProps) {
  const navigate = useNavigate();

  return (
    <div
      className={cn(
        "rounded-xl border border-accent/20 bg-accent/5 p-3 text-sm text-muted-foreground",
        className,
      )}
      data-ocid={ocid}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-2.5">
          <CircleHelp className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
          <div className="min-w-0 space-y-1">
            <p className="font-medium text-foreground">{title}</p>
            <div className="text-sm leading-relaxed text-muted-foreground">
              {children}
            </div>
          </div>
        </div>
        {sectionId && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 shrink-0 gap-1.5 self-start text-accent hover:bg-accent/10 hover:text-accent"
            onClick={() => {
              void navigate({ to: "/help", hash: sectionId });
            }}
            data-ocid={ocid ? `${ocid}.link` : undefined}
          >
            {actionLabel}
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
    </div>
  );
}

export function HelpTooltip({
  children,
  label = "More information",
}: {
  children: ReactNode;
  label?: string;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-border/70 bg-muted/40 text-muted-foreground transition-smooth hover:border-accent/50 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          aria-label={label}
        >
          <CircleHelp className="h-3.5 w-3.5" />
        </button>
      </TooltipTrigger>
      <TooltipContent
        sideOffset={6}
        className="max-w-xs border border-border bg-card px-3 py-2 text-left text-xs leading-relaxed text-foreground shadow-xl"
      >
        {children}
      </TooltipContent>
    </Tooltip>
  );
}
