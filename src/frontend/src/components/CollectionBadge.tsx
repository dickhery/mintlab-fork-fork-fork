import { resolveImageUrl } from "@/lib/media";
import { cn } from "@/lib/utils";
import type { Collection, NFTStandard } from "@/types";

function getStandardLabel(standard: NFTStandard): string {
  if (standard.__kind__ === "EXT") return "EXT";
  if (standard.__kind__ === "DIP721") return "DIP-721";
  if (standard.__kind__ === "ICRC7") return "ICRC-7";
  return standard.Other ?? "Unknown";
}

function getTrustLabel(collection: Collection): string {
  if (collection.kind === "Minted") return "Mintlab verified";
  const needsRange =
    (collection.standard.__kind__ === "EXT" ||
      collection.standard.__kind__ === "DIP721") &&
    collection.browseInfo?.totalSupply == null;
  return needsRange ? "Needs token range" : "Community imported";
}

interface CollectionBadgeProps {
  collection: Collection;
  size?: "sm" | "md";
  className?: string;
}

export function CollectionBadge({
  collection,
  size = "md",
  className,
}: CollectionBadgeProps) {
  const standardLabel = getStandardLabel(collection.standard);
  const trustLabel = getTrustLabel(collection);
  const imageUrl = resolveImageUrl(collection.imageUrl);

  return (
    <div className={cn("flex items-center gap-1.5 min-w-0", className)}>
      {imageUrl && (
        <img
          src={imageUrl}
          alt={collection.name}
          className={cn(
            "rounded-full object-cover shrink-0 border border-border/60",
            size === "sm" ? "w-4 h-4" : "w-5 h-5",
          )}
        />
      )}
      <span
        className={cn(
          "font-medium truncate text-muted-foreground",
          size === "sm" ? "text-xs" : "text-sm",
        )}
      >
        {collection.name}
      </span>
      <span
        className={cn(
          "shrink-0 px-1.5 py-0.5 rounded font-mono bg-muted/60 text-muted-foreground border border-border/40",
          size === "sm" ? "text-[10px]" : "text-xs",
        )}
      >
        {standardLabel}
      </span>
      <span
        className={cn(
          "shrink-0 px-1.5 py-0.5 rounded border",
          collection.kind === "Minted"
            ? "bg-accent/10 text-accent border-accent/20"
            : "bg-muted/40 text-muted-foreground border-border/40",
          size === "sm" ? "text-[10px]" : "text-xs",
        )}
      >
        {trustLabel}
      </span>
    </div>
  );
}
