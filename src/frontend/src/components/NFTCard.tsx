import { Badge } from "@/components/ui/badge";
import { nftCustodyClass, nftCustodyLabel } from "@/lib/nft-custody";
import { cn } from "@/lib/utils";
import type { Collection, CollectionTrustStatus, WalletNFT } from "@/types";
import { Flag, ImageOff } from "lucide-react";
import { motion } from "motion/react";
import { CollectionBadge } from "./CollectionBadge";
import { DividendBalanceBadge } from "./DividendBalanceBadge";
import { MediaImage } from "./MediaImage";
import { PriceDisplay } from "./PriceDisplay";

interface NFTCardProps {
  nft: WalletNFT;
  collection?: Collection;
  listingPrice?: bigint;
  dividendE8s?: bigint;
  trustStatus?: CollectionTrustStatus | null;
  isAuction?: boolean;
  isListed?: boolean;
  onReport?: () => void;
  reportLabel?: string;
  onClick?: () => void;
  index?: number;
  "data-ocid"?: string;
}

export function NFTCard({
  nft,
  collection,
  listingPrice,
  dividendE8s,
  trustStatus,
  isAuction,
  isListed = false,
  onReport,
  reportLabel = "Report NFT",
  onClick,
  index = 0,
  "data-ocid": dataOcid,
}: NFTCardProps) {
  const name = nft.metadata.name ?? `NFT #${nft.tokenId}`;
  const description = nft.metadata.description;
  const custodyLabel = nftCustodyLabel(nft.location);
  const custodyClass = nftCustodyClass(nft.location);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.07 }}
      whileHover={{ y: -4, scale: 1.01 }}
      className={cn(
        "nft-card-glow group relative rounded-xl border border-border bg-card overflow-hidden cursor-pointer transition-smooth",
        "hover:nft-card-glow-hover hover:border-accent/40",
      )}
      onClick={onClick}
      data-ocid={dataOcid}
    >
      {/* Image */}
      <div className="aspect-square overflow-hidden bg-muted relative">
        <MediaImage
          src={nft.metadata.imageUrl}
          alt={name}
          assetCanisterId={collection?.canisterId.toString()}
          tokenId={nft.tokenId}
          className="w-full h-full object-cover transition-smooth group-hover:scale-105"
          loading="lazy"
          fallback={
            <div className="w-full h-full flex items-center justify-center">
              <ImageOff className="w-10 h-10 text-muted-foreground/40" />
            </div>
          }
        />
        {isAuction && (
          <Badge className="absolute top-2 right-2 bg-accent/90 text-accent-foreground text-xs font-mono">
            AUCTION
          </Badge>
        )}
        {onReport && (
          <button
            type="button"
            className="absolute left-2 top-2 flex h-8 w-8 items-center justify-center rounded-lg border border-border/70 bg-card/85 text-muted-foreground opacity-0 shadow-sm backdrop-blur-sm transition-opacity hover:text-foreground group-hover:opacity-100 focus:opacity-100"
            title={reportLabel}
            aria-label={reportLabel}
            onClick={(event) => {
              event.stopPropagation();
              onReport();
            }}
          >
            <Flag className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Info */}
      <div className="p-3 space-y-2">
        <div className="min-w-0">
          <p className="font-display font-semibold text-sm text-foreground truncate">
            {name}
          </p>
          {description && (
            <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
              {description}
            </p>
          )}
        </div>

        {collection && (
          <CollectionBadge
            collection={collection}
            trustStatus={trustStatus}
            size="sm"
          />
        )}

        <div className="flex flex-wrap gap-1.5">
          {isListed && (
            <Badge className="text-[10px] border bg-amber-500/10 text-amber-700 border-amber-500/20">
              Listed
            </Badge>
          )}
          <Badge
            variant="secondary"
            className={cn(
              "max-w-full whitespace-normal break-words text-left text-[10px] leading-tight border",
              custodyClass,
            )}
            title={custodyLabel}
          >
            {custodyLabel}
          </Badge>
          {dividendE8s !== undefined && (
            <DividendBalanceBadge e8s={dividendE8s} compact />
          )}
        </div>

        {listingPrice !== undefined && (
          <div className="pt-1 border-t border-border/60">
            <PriceDisplay
              e8s={listingPrice}
              size="sm"
              label={isAuction ? "Current bid" : "Price"}
            />
          </div>
        )}
      </div>
    </motion.div>
  );
}
