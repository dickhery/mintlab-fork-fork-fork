import { CollectionBadge } from "@/components/CollectionBadge";
import { DividendBalanceBadge } from "@/components/DividendBalanceBadge";
import { EmptyState } from "@/components/EmptyState";
import { HelpCallout, HelpTooltip } from "@/components/HelpCallout";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { MediaImage } from "@/components/MediaImage";
import { PaymentConfirmationDialog } from "@/components/PaymentConfirmationDialog";
import { PriceDisplay } from "@/components/PriceDisplay";
import { ShareLinkButton } from "@/components/ShareLinkButton";
import { TermsAgreementNotice } from "@/components/TermsAcceptance";
import { ZoomableMediaImage } from "@/components/ZoomableMediaImage";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { useBackend } from "@/hooks/use-backend";
import { usePageMeta } from "@/hooks/use-page-meta";
import {
  COMMUNITY_COLLECTION_NOTICE,
  collectionMetaMap,
  collectionTrustStatus,
  isMintlabVerifiedCollection,
} from "@/lib/collection-trust";
import { transferRegisteredNFT } from "@/lib/external-nft-transfer";
import { formatICPAmount, parseICPToE8s } from "@/lib/icp";
import {
  type MarketplaceSearchState,
  type MarketplaceSort,
  type MarketplaceTab,
  type MarketplaceTrustFilter,
  filterMarketplaceListings,
  listingIdFromItem,
  sortMarketplaceListings,
} from "@/lib/marketplace-discovery";
import { resolveImageUrl } from "@/lib/media";
import {
  VAULTED_PURCHASE_NOTICE,
  WITHDRAW_TO_EXTERNAL_WALLET_LABEL,
  isVaultedInMintlab,
  nftCustodyClass,
  nftCustodyDescription,
  nftCustodyLabel,
} from "@/lib/nft-custody";
import { getNFTDisplayName, getNFTTokenLabel } from "@/lib/nft-display";
import {
  appPageUrl,
  listingSharePath,
  listingShareUrl,
} from "@/lib/share-urls";
import type {
  ActiveListing,
  ActiveListingDetail,
  AuctionBidStatus,
  AuctionListing,
  Collection,
  CollectionImportMeta,
  CollectionTrustStatus,
  FixedListing,
  ListingId,
  SettlementStatus,
  WalletNFT,
} from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Link,
  useNavigate,
  useParams,
  useSearch,
} from "@tanstack/react-router";
import {
  Clock,
  Coins,
  Flag,
  Gavel,
  ImageOff,
  Lock,
  RefreshCw,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  Tag,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function parseICP(val: string): bigint | null {
  return parseICPToE8s(val);
}

function truncatePrincipal(p: string): string {
  if (p.length <= 16) return p;
  return `${p.slice(0, 8)}…${p.slice(-6)}`;
}

function nftKey(collectionId: bigint, tokenId: string): string {
  return `${collectionId.toString()}:${tokenId}`;
}

const DEFAULT_ICP_LEDGER_FEE_E8S = 10_000n;
const DEFAULT_MINTLAB_FEE_BPS = 200n;
const BPS_DENOMINATOR = 10_000n;
const MIN_AUCTION_STARTING_BID_E8S = 1_000_000n;
const MIN_AUCTION_BID_INCREMENT_E8S = 1_000_000n;
const MARKETPLACE_COLLECTION_PAGE_SIZE = 50n;
const MARKETPLACE_WALLET_PAGE_SIZE = 50n;
const MARKETPLACE_STATUS_PAGE_SIZE = 25n;

type FixedListingItem = {
  kind: "fixed";
  listing: FixedListing;
  nft: WalletNFT;
  collection?: Collection;
  trustStatus?: CollectionTrustStatus | null;
};

type AuctionListingItem = {
  kind: "auction";
  listing: AuctionListing;
  nft: WalletNFT;
  collection?: Collection;
  trustStatus?: CollectionTrustStatus | null;
};

type MarketplaceListingItem = FixedListingItem | AuctionListingItem;

function marketplaceFee(amount: bigint, feeBps: bigint): bigint {
  return (amount * feeBps) / BPS_DENOMINATOR;
}

function nextAuctionMinimumBid(listing: AuctionListing): bigint {
  if (listing.highestBid > 0n) {
    return listing.highestBid + MIN_AUCTION_BID_INCREMENT_E8S;
  }

  return listing.startingBid >= MIN_AUCTION_STARTING_BID_E8S
    ? listing.startingBid
    : MIN_AUCTION_STARTING_BID_E8S;
}

function auctionHighBidderText(listing: AuctionListing): string {
  return listing.highestBidder
    ? truncatePrincipal(listing.highestBidder.toString())
    : "No bids yet";
}

function auctionHasBid(listing: AuctionListing): boolean {
  return listing.highestBid > 0n || listing.highestBidder != null;
}

function isViewerWinningAuction(
  listing: AuctionListing,
  currentPrincipal: string | null,
  bidStatus?: AuctionBidStatus,
): boolean {
  return (
    bidStatus?.isWinning ??
    listing.highestBidder?.toString() === currentPrincipal
  );
}

function useCountdown(endTimeNs: bigint) {
  const [remaining, setRemaining] = useState<number>(() => {
    const endMs = Number(endTimeNs / 1_000_000n);
    return Math.max(0, endMs - Date.now());
  });

  useEffect(() => {
    const endMs = Number(endTimeNs / 1_000_000n);
    const tick = () => setRemaining(Math.max(0, endMs - Date.now()));
    const id = setInterval(tick, 1000);
    tick();
    return () => clearInterval(id);
  }, [endTimeNs]);

  return remaining;
}

function formatRemaining(ms: number): string {
  if (ms <= 0) return "Ended";
  const totalSec = Math.floor(ms / 1000);
  const d = Math.floor(totalSec / 86400);
  const h = Math.floor((totalSec % 86400) / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (d > 0) return `${d}d ${h}h remaining`;
  if (h > 0) return `${h}h ${m}m remaining`;
  return `${m}m ${s}s remaining`;
}

function NFTImagePlaceholder({ name }: { name: string }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-muted/60">
      <ImageOff className="w-8 h-8 text-muted-foreground/40" />
      <span className="text-xs text-muted-foreground/60 text-center px-2 truncate max-w-full">
        {name}
      </span>
    </div>
  );
}

// ─── Fixed Listing Card ───────────────────────────────────────────────────────

interface FixedCardProps {
  listing: FixedListing;
  nft: WalletNFT | undefined;
  collection?: Collection;
  dividendE8s?: bigint;
  trustStatus?: CollectionTrustStatus | null;
  index: number;
  ocidPrefix?: string;
  currentPrincipal: string | null;
  onBuy: (id: ListingId) => void;
  onCancel: (id: ListingId) => void;
  onDetails: () => void;
  isBuying: boolean;
  isCancelling: boolean;
}

function FixedListingCard({
  listing,
  nft,
  collection,
  dividendE8s = 0n,
  trustStatus,
  index,
  ocidPrefix = "marketplace.fixed",
  currentPrincipal,
  onBuy,
  onCancel,
  onDetails,
  isBuying,
  isCancelling,
}: FixedCardProps) {
  const name = nft ? getNFTDisplayName(nft, collection) : "NFT #?";
  const sellerText = listing.seller.toString();
  const isOwner = currentPrincipal === sellerText;
  const custodyLabel = nft ? nftCustodyLabel(nft.location) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.07 }}
      className="nft-card-glow group relative rounded-xl border border-border bg-card overflow-hidden flex flex-col hover:nft-card-glow-hover hover:border-accent/40 transition-smooth cursor-pointer"
      onClick={onDetails}
      data-ocid={`${ocidPrefix}.item.${index + 1}`}
    >
      <div className="aspect-square overflow-hidden bg-muted relative">
        <MediaImage
          src={nft?.metadata.imageUrl}
          alt={name}
          assetCanisterId={collection?.canisterId.toString()}
          tokenId={nft?.tokenId}
          className="w-full h-full object-cover transition-smooth group-hover:scale-105"
          loading="lazy"
          fallback={<NFTImagePlaceholder name={name} />}
        />
        <Badge className="absolute top-2 left-2 bg-primary/90 text-primary-foreground text-xs font-mono uppercase">
          Fixed
        </Badge>
      </div>

      <div className="p-3 flex flex-col gap-2 flex-1">
        <div className="min-w-0">
          <p className="font-display font-semibold text-sm text-foreground truncate">
            {name}
          </p>
          <p className="text-xs text-muted-foreground font-mono truncate mt-0.5">
            {truncatePrincipal(sellerText)}
          </p>
          <p className="text-[11px] text-muted-foreground mt-1 font-mono">
            {nft ? getNFTTokenLabel(nft, collection) : "Token #?"}
          </p>
        </div>

        {collection && (
          <CollectionBadge
            collection={collection}
            trustStatus={trustStatus}
            size="sm"
          />
        )}
        {nft && custodyLabel && (
          <Badge
            variant="secondary"
            className={`w-fit max-w-full whitespace-normal break-words text-left text-[10px] leading-tight border ${nftCustodyClass(nft.location)}`}
          >
            {custodyLabel}
          </Badge>
        )}
        <DividendBalanceBadge e8s={dividendE8s} compact label="Dividends" />

        <div className="mt-auto pt-2 border-t border-border/60 flex items-end justify-between gap-2">
          <PriceDisplay e8s={listing.price} size="sm" label="Price" />
          {isOwner ? (
            <Button
              size="sm"
              variant="outline"
              className="text-destructive border-destructive/40 hover:bg-destructive/10 transition-smooth shrink-0"
              onClick={(event) => {
                event.stopPropagation();
                onCancel(listing.id);
              }}
              disabled={isCancelling}
              data-ocid={`${ocidPrefix}.cancel_button.${index + 1}`}
            >
              {isCancelling ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  <X className="w-3 h-3 mr-1" />
                  Cancel
                </>
              )}
            </Button>
          ) : (
            <Button
              size="sm"
              className="bg-accent text-accent-foreground hover:bg-accent/90 transition-smooth shrink-0 font-semibold"
              onClick={(event) => {
                event.stopPropagation();
                onBuy(listing.id);
              }}
              disabled={isBuying}
              data-ocid={`${ocidPrefix}.buy_button.${index + 1}`}
            >
              {isBuying ? (
                <>
                  <LoadingSpinner size="sm" />
                  Processing...
                </>
              ) : (
                "Buy Now"
              )}
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

interface ListingDetailModalProps {
  detail: {
    listing: ActiveListing;
    nft: WalletNFT;
    collection?: Collection;
    trustStatus?: CollectionTrustStatus | null;
    dividendE8s: bigint;
  } | null;
  currentPrincipal: string | null;
  bidStatusMap: Map<string, AuctionBidStatus>;
  onClose: () => void;
  onBuy: (id: ListingId) => void;
  onCancel: (id: ListingId) => void;
  onBid: (listing: AuctionListing) => void;
  onReport: (collection: Collection | undefined, nft: WalletNFT) => void;
}

function ListingDetailModal({
  detail,
  currentPrincipal,
  bidStatusMap,
  onClose,
  onBuy,
  onCancel,
  onBid,
  onReport,
}: ListingDetailModalProps) {
  if (!detail) return null;

  const { listing, nft, collection, trustStatus, dividendE8s } = detail;
  const name = getNFTDisplayName(nft, collection);
  const canisterId = collection?.canisterId.toString();
  const fixed = listing.__kind__ === "Fixed" ? listing.Fixed : null;
  const auction = listing.__kind__ === "Auction" ? listing.Auction : null;
  const seller = fixed?.seller ?? auction?.seller;
  const isOwner = seller != null && currentPrincipal === seller.toString();
  const auctionBidStatus = auction
    ? bidStatusMap.get(auction.id.toString())
    : undefined;
  const auctionHasAcceptedBid = auction ? auctionHasBid(auction) : false;
  const isWinningAuction = auction
    ? isViewerWinningAuction(auction, currentPrincipal, auctionBidStatus)
    : false;
  const hasBeenOutbid =
    auction != null && !!auctionBidStatus?.hasBid && !isWinningAuction;
  const auctionRemaining = auction
    ? formatRemaining(
        Math.max(0, Number(auction.endTime / 1_000_000n) - Date.now()),
      )
    : "";
  const custodyLabel = nftCustodyLabel(nft.location);
  const custodyDescription = nftCustodyDescription(nft, collection);
  const listingId = fixed?.id ?? auction?.id ?? null;

  return (
    <Dialog open={!!detail} onOpenChange={(value) => !value && onClose()}>
      <DialogContent
        className="bg-card border-border max-w-3xl p-0 overflow-hidden max-h-[88vh]"
        data-ocid="marketplace.nft_detail.dialog"
      >
        <div className="grid md:grid-cols-[minmax(0,0.9fr)_minmax(320px,1fr)]">
          <div className="bg-muted min-h-[260px] md:min-h-0 md:h-full flex items-center justify-center p-3">
            <ZoomableMediaImage
              src={nft.metadata.imageUrl}
              alt={name}
              assetCanisterId={collection?.canisterId.toString()}
              tokenId={nft.tokenId}
              viewerTitle={name}
              buttonClassName="h-full w-full rounded-lg"
              className="max-h-[72vh] w-full h-full object-contain rounded-lg"
              dataOcid="marketplace.nft_detail.image_zoom_button"
              fallback={<NFTImagePlaceholder name={name} />}
            />
          </div>

          <div className="p-5 space-y-4 overflow-y-auto max-h-[88vh]">
            <DialogHeader className="space-y-2 text-left">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge
                  className={
                    fixed
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "bg-accent/10 text-accent border border-accent/20"
                  }
                >
                  {fixed ? "Fixed Price" : "Auction"}
                </Badge>
                {collection && (
                  <CollectionBadge
                    collection={collection}
                    trustStatus={trustStatus}
                    size="sm"
                  />
                )}
                <Badge
                  variant="secondary"
                  className={`border text-xs ${nftCustodyClass(nft.location)}`}
                >
                  {custodyLabel}
                </Badge>
                <DividendBalanceBadge e8s={dividendE8s} size="md" />
                {listingId != null && (
                  <ShareLinkButton
                    url={listingShareUrl(listingId)}
                    data-ocid="marketplace.nft_detail.share_listing_button"
                  />
                )}
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="h-7 gap-1.5 text-xs"
                  asChild
                >
                  <Link
                    to="/nft/$collectionId/$tokenId"
                    params={{
                      collectionId: nft.collectionId.toString(),
                      tokenId: encodeURIComponent(nft.tokenId),
                    }}
                    data-ocid="marketplace.nft_detail.open_nft_page_link"
                  >
                    Open NFT page
                  </Link>
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="h-7 gap-1.5 text-xs"
                  onClick={() => onReport(collection, nft)}
                  data-ocid="marketplace.nft_detail.report_button"
                >
                  <Flag className="h-3.5 w-3.5" />
                  Report
                </Button>
              </div>
              <DialogTitle className="font-display text-xl text-foreground">
                {name}
              </DialogTitle>
              <p className="text-sm text-muted-foreground font-mono">
                {getNFTTokenLabel(nft, collection)}
              </p>
            </DialogHeader>

            {nft.metadata.description && (
              <p className="text-sm text-muted-foreground leading-relaxed">
                {nft.metadata.description}
              </p>
            )}

            <div className="rounded-lg border border-border/60 bg-muted/25 p-3">
              <p className="text-xs font-semibold text-foreground">
                {custodyLabel}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {custodyDescription}
              </p>
              {isVaultedInMintlab(nft) && (
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {VAULTED_PURCHASE_NOTICE}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-2">
              <div className="rounded-lg border border-border/50 bg-muted/35 px-3 py-2">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Seller
                </p>
                <p className="font-mono text-sm text-foreground truncate mt-0.5">
                  {seller?.toString() ?? "Unknown"}
                </p>
              </div>
              {canisterId && (
                <div className="rounded-lg border border-border/50 bg-muted/35 px-3 py-2">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Collection Canister
                  </p>
                  <p className="font-mono text-sm text-foreground truncate mt-0.5">
                    {canisterId}
                  </p>
                </div>
              )}
              {auction && (
                <div className="rounded-lg border border-border/50 bg-muted/35 px-3 py-2">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Current High Bidder
                  </p>
                  <p className="font-mono text-sm text-foreground truncate mt-0.5">
                    {auction.highestBidder?.toString() ?? "No bids yet"}
                  </p>
                </div>
              )}
            </div>

            <div className="rounded-lg border border-border/60 bg-muted/25 p-3 flex items-center justify-between gap-3">
              <div className="flex flex-col gap-2">
                {fixed ? (
                  <PriceDisplay e8s={fixed.price} label="Price" />
                ) : auction ? (
                  <PriceDisplay
                    e8s={
                      auction.highestBid > 0n
                        ? auction.highestBid
                        : auction.startingBid
                    }
                    label={auction.highestBid > 0n ? "Top bid" : "Starting bid"}
                  />
                ) : null}
                {auction && isWinningAuction && (
                  <Badge className="w-fit bg-emerald-500/10 text-emerald-700 border border-emerald-500/20">
                    You're Winning
                  </Badge>
                )}
                {auction && hasBeenOutbid && (
                  <Badge className="w-fit bg-amber-500/10 text-amber-700 border border-amber-500/20">
                    You've been outbid
                  </Badge>
                )}
              </div>
              {auction && (
                <span className="text-xs text-muted-foreground font-mono">
                  {auctionRemaining}
                </span>
              )}
            </div>

            <div className="flex flex-wrap justify-end gap-2 pt-2">
              {fixed &&
                (isOwner ? (
                  <Button
                    variant="outline"
                    className="text-destructive border-destructive/40 hover:bg-destructive/10"
                    onClick={() => {
                      onCancel(fixed.id);
                      onClose();
                    }}
                  >
                    Cancel Listing
                  </Button>
                ) : (
                  <Button
                    className="bg-accent text-accent-foreground hover:bg-accent/90"
                    onClick={() => {
                      onBuy(fixed.id);
                      onClose();
                    }}
                  >
                    Buy Now
                  </Button>
                ))}
              {auction &&
                (isOwner ? (
                  <div className="flex flex-col items-end gap-1.5">
                    <Button
                      variant="outline"
                      className={
                        auctionHasAcceptedBid
                          ? "border-border text-muted-foreground"
                          : "text-destructive border-destructive/40 hover:bg-destructive/10"
                      }
                      onClick={() => {
                        if (auctionHasAcceptedBid) return;
                        onCancel(auction.id);
                        onClose();
                      }}
                      disabled={auctionHasAcceptedBid}
                    >
                      {auctionHasAcceptedBid ? (
                        <>
                          <Lock className="w-4 h-4 mr-2" />
                          Bid Placed
                        </>
                      ) : (
                        "Cancel Auction"
                      )}
                    </Button>
                    {auctionHasAcceptedBid && (
                      <p className="text-xs text-muted-foreground text-right max-w-[14rem]">
                        Auctions cannot be canceled after the first bid.
                      </p>
                    )}
                  </div>
                ) : (
                  <Button
                    className="bg-accent text-accent-foreground hover:bg-accent/90"
                    onClick={() => {
                      onBid(auction);
                      onClose();
                    }}
                    disabled={
                      Date.now() >= Number(auction.endTime / 1_000_000n)
                    }
                  >
                    <Gavel className="w-4 h-4 mr-2" />
                    Place Bid
                  </Button>
                ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Auction Listing Card ─────────────────────────────────────────────────────

interface AuctionCardProps {
  listing: AuctionListing;
  nft: WalletNFT | undefined;
  collection?: Collection;
  dividendE8s?: bigint;
  trustStatus?: CollectionTrustStatus | null;
  index: number;
  ocidPrefix?: string;
  currentPrincipal: string | null;
  bidStatus?: AuctionBidStatus;
  onBid: (listing: AuctionListing) => void;
  onSettle: (id: ListingId) => void;
  onCancel: (id: ListingId) => void;
  onDetails: () => void;
  isSettling: boolean;
  isCancelling: boolean;
}

function AuctionListingCard({
  listing,
  nft,
  collection,
  dividendE8s = 0n,
  trustStatus,
  index,
  ocidPrefix = "marketplace.auction",
  currentPrincipal,
  bidStatus,
  onBid,
  onSettle,
  onCancel,
  onDetails,
  isSettling,
  isCancelling,
}: AuctionCardProps) {
  const remaining = useCountdown(listing.endTime);
  const ended = remaining <= 0;
  const name = nft ? getNFTDisplayName(nft, collection) : "NFT #?";
  const sellerText = listing.seller.toString();
  const isOwner = currentPrincipal === sellerText;
  const isWinner = isViewerWinningAuction(listing, currentPrincipal, bidStatus);
  const hasBeenOutbid = !!bidStatus?.hasBid && !isWinner;
  const hasBid = auctionHasBid(listing);
  const custodyLabel = nft ? nftCustodyLabel(nft.location) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.07 }}
      className="nft-card-glow group relative rounded-xl border border-border bg-card overflow-hidden flex flex-col hover:nft-card-glow-hover hover:border-accent/40 transition-smooth cursor-pointer"
      onClick={onDetails}
      data-ocid={`${ocidPrefix}.item.${index + 1}`}
    >
      <div className="aspect-square overflow-hidden bg-muted relative">
        <MediaImage
          src={nft?.metadata.imageUrl}
          alt={name}
          assetCanisterId={collection?.canisterId.toString()}
          tokenId={nft?.tokenId}
          className="w-full h-full object-cover transition-smooth group-hover:scale-105"
          loading="lazy"
          fallback={<NFTImagePlaceholder name={name} />}
        />
        <Badge
          className={`absolute top-2 left-2 text-xs font-mono uppercase ${
            ended
              ? "bg-muted text-muted-foreground"
              : "bg-accent/90 text-accent-foreground"
          }`}
        >
          {ended ? "Ended" : "Live"}
        </Badge>
      </div>

      <div className="p-3 flex flex-col gap-2 flex-1">
        <div className="min-w-0">
          <p className="font-display font-semibold text-sm text-foreground truncate">
            {name}
          </p>
          <p className="text-xs text-muted-foreground font-mono truncate mt-0.5">
            {truncatePrincipal(sellerText)}
          </p>
          <p className="text-[11px] text-muted-foreground mt-1 font-mono">
            {nft ? getNFTTokenLabel(nft, collection) : "Token #?"}
          </p>
        </div>

        {collection && (
          <CollectionBadge
            collection={collection}
            trustStatus={trustStatus}
            size="sm"
          />
        )}
        {nft && custodyLabel && (
          <Badge
            variant="secondary"
            className={`w-fit max-w-full whitespace-normal break-words text-left text-[10px] leading-tight border ${nftCustodyClass(nft.location)}`}
          >
            {custodyLabel}
          </Badge>
        )}
        <DividendBalanceBadge e8s={dividendE8s} compact label="Dividends" />

        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
          <Clock className="w-3 h-3 shrink-0" />
          <span
            className={ended ? "text-destructive/80" : "text-foreground/70"}
          >
            {formatRemaining(remaining)}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono min-w-0">
          <Gavel className="w-3 h-3 shrink-0" />
          <span className="truncate">
            High bidder: {auctionHighBidderText(listing)}
          </span>
        </div>
        {isWinner && (
          <Badge className="w-fit bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 text-[10px]">
            You're Winning
          </Badge>
        )}
        {hasBeenOutbid && (
          <Badge className="w-fit bg-amber-500/10 text-amber-700 border border-amber-500/20 text-[10px]">
            You've been outbid
          </Badge>
        )}

        <div className="mt-auto pt-2 border-t border-border/60 flex items-end justify-between gap-2">
          <PriceDisplay
            e8s={
              listing.highestBid > 0n ? listing.highestBid : listing.startingBid
            }
            size="sm"
            label={listing.highestBid > 0n ? "Top bid" : "Starting bid"}
          />

          {isOwner ? (
            <div className="flex gap-1.5 shrink-0">
              {ended && (
                <Button
                  size="sm"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 transition-smooth font-semibold"
                  onClick={(event) => {
                    event.stopPropagation();
                    onSettle(listing.id);
                  }}
                  disabled={isSettling}
                  data-ocid={`${ocidPrefix}.settle_button.${index + 1}`}
                >
                  {isSettling ? <LoadingSpinner size="sm" /> : "Settle"}
                </Button>
              )}
              {!ended && !hasBid && (
                <Button
                  size="sm"
                  variant="outline"
                  className="text-destructive border-destructive/40 hover:bg-destructive/10 transition-smooth"
                  onClick={(event) => {
                    event.stopPropagation();
                    onCancel(listing.id);
                  }}
                  disabled={isCancelling}
                  data-ocid={`${ocidPrefix}.cancel_button.${index + 1}`}
                >
                  {isCancelling ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <>
                      <X className="w-3 h-3 mr-1" />
                      Cancel
                    </>
                  )}
                </Button>
              )}
              {!ended && hasBid && (
                <div className="flex flex-col items-end gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-border text-muted-foreground"
                    disabled
                    data-ocid={`${ocidPrefix}.cancel_locked_button.${index + 1}`}
                  >
                    <Lock className="w-3 h-3 mr-1" />
                    Bid Locked
                  </Button>
                  <span className="max-w-[8rem] text-right text-[10px] leading-snug text-muted-foreground">
                    Cannot cancel after bids
                  </span>
                </div>
              )}
            </div>
          ) : ended && isWinner ? (
            <Button
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary/90 transition-smooth font-semibold shrink-0"
              onClick={(event) => {
                event.stopPropagation();
                onSettle(listing.id);
              }}
              disabled={isSettling}
              data-ocid={`${ocidPrefix}.collect_button.${index + 1}`}
            >
              {isSettling ? <LoadingSpinner size="sm" /> : "Collect"}
            </Button>
          ) : !ended ? (
            <Button
              size="sm"
              className="bg-accent text-accent-foreground hover:bg-accent/90 transition-smooth shrink-0 font-semibold"
              onClick={(event) => {
                event.stopPropagation();
                onBid(listing);
              }}
              data-ocid={`${ocidPrefix}.bid_button.${index + 1}`}
            >
              <Gavel className="w-3 h-3 mr-1" />
              Bid
            </Button>
          ) : null}
        </div>
      </div>
    </motion.div>
  );
}

// ─── List NFT Modal ───────────────────────────────────────────────────────────

type ListParams =
  | { type: "fixed"; nft: WalletNFT; price: bigint }
  | { type: "auction"; nft: WalletNFT; startingBid: bigint; endTime: bigint };

interface ListNFTModalProps {
  open: boolean;
  onClose: () => void;
  userNFTs: WalletNFT[];
  collections: Collection[];
  onList: (params: ListParams) => void;
  isListing: boolean;
}

function ListNFTModal({
  open,
  onClose,
  userNFTs,
  collections,
  onList,
  isListing,
}: ListNFTModalProps) {
  const [selectedNFT, setSelectedNFT] = useState<bigint | null>(null);
  const [mode, setMode] = useState<"fixed" | "auction">("fixed");
  const [price, setPrice] = useState("");
  const [startBid, setStartBid] = useState("0.01");
  const [durationAmount, setDurationAmount] = useState("3");
  const [durationUnit, setDurationUnit] = useState<"hours" | "days">("days");

  const reset = useCallback(() => {
    setSelectedNFT(null);
    setMode("fixed");
    setPrice("");
    setStartBid("0.01");
    setDurationAmount("3");
    setDurationUnit("days");
  }, []);

  useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedNFT) return;
    const nft = userNFTs.find((item) => item.id === selectedNFT);
    if (!nft) return toast.error("Select an NFT to list");

    if (mode === "fixed") {
      const p = parseICP(price);
      if (!p) return toast.error("Enter a valid price");
      onList({ type: "fixed", nft, price: p });
    } else {
      const bid = parseICP(startBid);
      if (!bid) return toast.error("Enter a valid starting bid");
      if (bid < MIN_AUCTION_STARTING_BID_E8S) {
        return toast.error("Starting bid must be at least 0.01 ICP");
      }
      const amount = Number.parseInt(durationAmount, 10);
      if (Number.isNaN(amount) || amount < 1)
        return toast.error("Duration must be at least 1 hour");
      const durationHours = durationUnit === "days" ? amount * 24 : amount;
      const maxDurationHours = 30 * 24;
      if (durationHours > maxDurationHours)
        return toast.error("Duration cannot exceed 30 days");
      const endTimeNs =
        BigInt(Date.now() + durationHours * 3_600_000) * 1_000_000n;
      onList({
        type: "auction",
        nft,
        startingBid: bid,
        endTime: endTimeNs,
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="bg-card border-border max-w-md max-h-[90vh] overflow-y-auto"
        data-ocid="marketplace.list_dialog"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-lg">
            List Your NFT
          </DialogTitle>
        </DialogHeader>

        <div className="mt-1 mb-3 rounded-lg border border-accent/30 bg-accent/5 p-3 flex gap-2.5 items-start">
          <div className="w-4 h-4 rounded-full bg-accent/30 flex items-center justify-center mt-0.5 shrink-0">
            <span className="text-accent text-[10px] font-bold">!</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Registered external wallet NFTs are deposited into the app vault
            before listing. Buyers of vaulted external NFTs receive a Mintlab
            wallet record first; the original NFT stays vaulted in Mintlab until
            they withdraw it to an external wallet.
          </p>
        </div>

        <div className="mb-3 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 flex gap-2.5 items-start">
          <Coins className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            Dividend collection is paused while this NFT is listed at a fixed
            price or in an auction. Any claimable ICP stays attached to the NFT
            for the buyer or auction winner.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* NFT Selector */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground uppercase tracking-wider">
              Select NFT
            </Label>
            {userNFTs.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center border border-dashed border-border rounded-lg">
                No NFTs available to list yet
              </p>
            ) : (
              <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
                {userNFTs.map((nft) => {
                  const collection = collections.find(
                    (item) => item.id === nft.collectionId,
                  );
                  const nftName = getNFTDisplayName(nft, collection);
                  const selected = selectedNFT === nft.id;
                  return (
                    <button
                      key={nft.id.toString()}
                      type="button"
                      onClick={() => setSelectedNFT(nft.id)}
                      className={`rounded-lg border overflow-hidden transition-smooth text-left ${
                        selected
                          ? "border-accent ring-1 ring-accent/50"
                          : "border-border hover:border-accent/40"
                      }`}
                      data-ocid="marketplace.list_nft_select"
                    >
                      <div className="aspect-square bg-muted">
                        <MediaImage
                          src={nft.metadata.imageUrl}
                          alt={nftName}
                          assetCanisterId={collection?.canisterId.toString()}
                          tokenId={nft.tokenId}
                          className="w-full h-full object-cover"
                          fallback={
                            <div className="w-full h-full flex items-center justify-center">
                              <ImageOff className="w-5 h-5 text-muted-foreground/40" />
                            </div>
                          }
                        />
                      </div>
                      <p className="px-1.5 py-1 text-[10px] font-mono text-foreground/80 truncate">
                        {nftName}
                      </p>
                      <p
                        className="px-1.5 pb-1 text-[9px] font-mono text-muted-foreground truncate"
                        title={nftCustodyLabel(nft.location)}
                      >
                        {nftCustodyLabel(nft.location)}
                      </p>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Type Toggle */}
          <div className="space-y-2">
            <Label className="flex items-center gap-1.5 text-xs text-muted-foreground uppercase tracking-wider">
              Listing Type
              <HelpTooltip>
                Fixed listings sell at one price. Auctions hold bids in escrow,
                can run 1 hour to 30 days, and cannot be canceled after the
                first bid.
              </HelpTooltip>
            </Label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setMode("fixed")}
                className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-smooth ${
                  mode === "fixed"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:border-border/80"
                }`}
                data-ocid="marketplace.list_type_fixed"
              >
                <Tag className="w-3.5 h-3.5 inline mr-1.5" />
                Fixed Price
              </button>
              <button
                type="button"
                onClick={() => setMode("auction")}
                className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-smooth ${
                  mode === "auction"
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-border text-muted-foreground hover:border-border/80"
                }`}
                data-ocid="marketplace.list_type_auction"
              >
                <Gavel className="w-3.5 h-3.5 inline mr-1.5" />
                Auction
              </button>
            </div>
          </div>

          {mode === "fixed" ? (
            <div className="space-y-1.5">
              <Label
                htmlFor="list-price"
                className="text-xs text-muted-foreground uppercase tracking-wider"
              >
                Price (ICP)
              </Label>
              <Input
                id="list-price"
                type="text"
                inputMode="decimal"
                placeholder="e.g. 15.5"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="bg-background border-input font-mono"
                data-ocid="marketplace.list_price_input"
              />
              <p className="text-xs text-muted-foreground">
                Use any positive ICP amount with up to 8 decimals.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label
                  htmlFor="list-startbid"
                  className="text-xs text-muted-foreground uppercase tracking-wider"
                >
                  Starting Bid (ICP)
                </Label>
                <Input
                  id="list-startbid"
                  type="text"
                  inputMode="decimal"
                  placeholder="0.01"
                  value={startBid}
                  onChange={(e) => setStartBid(e.target.value)}
                  className="bg-background border-input font-mono"
                  data-ocid="marketplace.list_startbid_input"
                />
                <p className="text-xs text-muted-foreground">
                  Minimum starting bid is 0.01 ICP. Use up to 8 decimals.
                </p>
              </div>
              <div className="space-y-1.5">
                <Label
                  htmlFor="list-duration"
                  className="text-xs text-muted-foreground uppercase tracking-wider"
                >
                  Duration
                </Label>
                <div className="grid grid-cols-[1fr_auto] gap-2">
                  <Input
                    id="list-duration"
                    type="number"
                    min="1"
                    max={durationUnit === "days" ? "30" : "720"}
                    step="1"
                    placeholder={durationUnit === "days" ? "e.g. 3" : "e.g. 1"}
                    value={durationAmount}
                    onChange={(e) => setDurationAmount(e.target.value)}
                    className="bg-background border-input font-mono"
                    data-ocid="marketplace.list_duration_input"
                  />
                  <div className="flex overflow-hidden rounded-lg border border-border">
                    <button
                      type="button"
                      onClick={() => setDurationUnit("hours")}
                      className={`px-3 text-xs font-semibold transition-smooth ${
                        durationUnit === "hours"
                          ? "bg-accent text-accent-foreground"
                          : "bg-background text-muted-foreground hover:bg-muted"
                      }`}
                      data-ocid="marketplace.list_duration_unit_hours"
                    >
                      Hours
                    </button>
                    <button
                      type="button"
                      onClick={() => setDurationUnit("days")}
                      className={`px-3 text-xs font-semibold transition-smooth ${
                        durationUnit === "days"
                          ? "bg-accent text-accent-foreground"
                          : "bg-background text-muted-foreground hover:bg-muted"
                      }`}
                      data-ocid="marketplace.list_duration_unit_days"
                    >
                      Days
                    </button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Auctions can run from 1 hour up to 30 days.
                </p>
                <p className="text-xs text-muted-foreground">
                  After the first bid is placed, the auction cannot be canceled.
                </p>
              </div>
            </div>
          )}

          <TermsAgreementNotice actionLabel="listing this NFT" />

          <div className="flex gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              className="flex-1 border-border"
              onClick={onClose}
              data-ocid="marketplace.list_cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isListing || !selectedNFT}
              className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90 transition-smooth font-semibold"
              data-ocid="marketplace.list_submit_button"
            >
              {isListing ? <LoadingSpinner size="sm" /> : "List NFT"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Place Bid Modal ──────────────────────────────────────────────────────────

interface BidModalProps {
  listing: AuctionListing | null;
  nft: WalletNFT | undefined;
  collection?: Collection;
  ledgerFeeE8s: bigint;
  auctionBidFeeReserveE8s: bigint;
  mintlabFeeBps: bigint;
  onClose: () => void;
  onBid: (listingId: ListingId, amount: bigint) => void;
  isBidding: boolean;
}

function PlaceBidModal({
  listing,
  nft,
  collection,
  ledgerFeeE8s,
  auctionBidFeeReserveE8s,
  mintlabFeeBps,
  onClose,
  onBid,
  isBidding,
}: BidModalProps) {
  const [bidAmount, setBidAmount] = useState("");
  const [pendingBidAmount, setPendingBidAmount] = useState<bigint | null>(null);
  const [confirmBidOpen, setConfirmBidOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (listing) {
      setBidAmount("");
      setPendingBidAmount(null);
      setConfirmBidOpen(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [listing]);

  if (!listing) return null;

  const minBid = nextAuctionMinimumBid(listing);
  const minBidICP = formatICPAmount(minBid);
  const name = nft ? getNFTDisplayName(nft, collection) : "NFT #?";
  const pendingAmount = pendingBidAmount ?? 0n;
  const pendingMintlabFee = marketplaceFee(pendingAmount, mintlabFeeBps);
  const escrowDeposit = pendingAmount + auctionBidFeeReserveE8s;
  const maximumDebit = escrowDeposit + ledgerFeeE8s;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!listing) return;
    const amount = parseICP(bidAmount);
    if (!amount) return toast.error("Enter a valid bid amount");
    if (amount < minBid) {
      return toast.error(`Bid must be at least ${minBidICP} ICP`);
    }
    setPendingBidAmount(amount);
    setConfirmBidOpen(true);
  }

  return (
    <>
      <Dialog open={!!listing} onOpenChange={(v) => !v && onClose()}>
        <DialogContent
          className="bg-card border-border max-w-sm"
          data-ocid="marketplace.bid_dialog"
        >
          <DialogHeader>
            <DialogTitle className="font-display text-lg">
              Place a Bid
            </DialogTitle>
          </DialogHeader>

          <p className="text-sm text-muted-foreground -mt-1">{name}</p>
          {nft && (
            <div className="rounded-lg border border-border bg-muted/30 p-3">
              <Badge
                variant="secondary"
                className={`border text-[10px] ${nftCustodyClass(nft.location)}`}
              >
                {nftCustodyLabel(nft.location)}
              </Badge>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                {nftCustodyDescription(nft)}
              </p>
              {isVaultedInMintlab(nft) && (
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  If you win, the NFT remains vaulted in Mintlab until you
                  withdraw it to an external wallet.
                </p>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 mt-1">
            <div className="rounded-lg bg-muted/40 border border-border p-3 flex items-center justify-between">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">
                {listing.highestBid > 0n ? "Current top bid" : "Starting bid"}
              </span>
              <PriceDisplay
                e8s={
                  listing.highestBid > 0n
                    ? listing.highestBid
                    : listing.startingBid
                }
                size="sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="bid-amount"
                className="text-xs text-muted-foreground uppercase tracking-wider"
              >
                Your Bid (ICP) — min {minBidICP}
              </Label>
              <Input
                id="bid-amount"
                ref={inputRef}
                type="text"
                inputMode="decimal"
                placeholder={minBidICP}
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                className="bg-background border-input font-mono"
                data-ocid="marketplace.bid_amount_input"
              />
              <p className="text-xs text-muted-foreground">
                Bids must be at least 0.01 ICP above the current top bid.
              </p>
              <p className="text-xs text-muted-foreground">
                Bids placed with less than 2 minutes remaining extend the
                auction by 5 minutes.
              </p>
              <p className="text-xs text-muted-foreground">
                A bid counts when Mintlab starts processing it before the
                auction ends.
              </p>
            </div>

            {bidAmount.trim() && (
              <div className="rounded-lg border border-border bg-muted/30 p-3 text-xs text-muted-foreground">
                If confirmed,{" "}
                <span className="font-mono text-foreground">
                  {bidAmount.trim()} ICP
                </span>{" "}
                plus escrow fee reserves moves from your in-app account into
                auction escrow now.
              </div>
            )}

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1 border-border"
                onClick={onClose}
                data-ocid="marketplace.bid_cancel_button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isBidding}
                className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90 transition-smooth font-semibold"
                data-ocid="marketplace.bid_confirm_button"
              >
                {isBidding ? <LoadingSpinner size="sm" /> : "Review Bid"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <PaymentConfirmationDialog
        open={confirmBidOpen}
        onOpenChange={setConfirmBidOpen}
        title="Fund Auction Escrow"
        description={
          isVaultedInMintlab(nft)
            ? "Your bid is held in escrow until you are outbid or the auction settles. If you win, this vaulted NFT stays in Mintlab custody until you withdraw it."
            : "Your bid is held in escrow until you are outbid or the auction settles. Outbid refunds return the bid and unused reserve, but ledger transfers into escrow and back still cost a small amount of ICP."
        }
        lines={[
          {
            label: "Bid amount",
            value: `${formatICPAmount(pendingAmount)} ICP`,
          },
          {
            label: "Mintlab fee if won",
            value: `${formatICPAmount(pendingMintlabFee)} ICP`,
            helper: "Deducted from seller proceeds.",
          },
          {
            label: "Escrow fee reserve",
            value: `${formatICPAmount(auctionBidFeeReserveE8s)} ICP`,
            helper: "Reserved to settle the sale or refund you if outbid.",
          },
          {
            label: "Transfer to escrow fee",
            value: `${formatICPAmount(ledgerFeeE8s)} ICP`,
          },
          {
            label: "Total debit now",
            value: `${formatICPAmount(maximumDebit)} ICP`,
          },
        ]}
        confirmLabel="Fund Escrow"
        isPending={isBidding}
        onConfirm={() => {
          if (pendingBidAmount == null) return;
          onBid(listing.id, pendingBidAmount);
        }}
        ocid="marketplace.bid.payment_dialog"
      />
    </>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

type ListingDetailState = NonNullable<ListingDetailModalProps["detail"]>;

export default function MarketplacePage() {
  const { actor, isFetching: actorLoading } = useBackend();
  const { isAuthenticated, principal, login } = useAuth();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as MarketplaceSearchState;
  const params = useParams({ strict: false }) as { listingId?: string };
  const listingIdParam = params.listingId;
  const principalStr = principal?.toString() ?? null;

  const [activeTab, setActiveTab] = useState<MarketplaceTab>(
    search.tab ?? "all",
  );
  const [searchQuery, setSearchQuery] = useState(search.q ?? "");
  const [collectionFilter, setCollectionFilter] = useState<string>(
    search.collection ?? "all",
  );
  const [trustFilter, setTrustFilter] = useState<MarketplaceTrustFilter>(
    search.trust ?? "all",
  );
  const [sortBy, setSortBy] = useState<MarketplaceSort>(
    search.sort ?? "newest",
  );
  const [buyTarget, setBuyTarget] = useState<ListingId | null>(null);
  const [cancelTarget, setCancelTarget] = useState<ListingId | null>(null);
  const [bidTarget, setBidTarget] = useState<AuctionListing | null>(null);
  const [listModalOpen, setListModalOpen] = useState(false);
  const [detailTarget, setDetailTarget] = useState<ListingDetailState | null>(
    null,
  );
  const listingPageMeta = useMemo(() => {
    if (!detailTarget) return {};
    const { listing, nft, collection } = detailTarget;
    const name = getNFTDisplayName(nft, collection);
    const listingId =
      listing.__kind__ === "Fixed" ? listing.Fixed.id : listing.Auction.id;
    return {
      title: `${name} — Mintlab Marketplace`,
      description:
        nft.metadata.description?.trim() ||
        `${name} is listed on Mintlab Marketplace.`,
      image: resolveImageUrl(nft.metadata.imageUrl, {
        canisterId: collection?.canisterId.toString(),
        tokenId: nft.tokenId,
      }),
      url: appPageUrl(listingSharePath(listingId)),
    };
  }, [detailTarget]);
  usePageMeta(listingPageMeta);
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const discoverySearch = useMemo(
    () => ({
      q: searchQuery.trim() || undefined,
      collection: collectionFilter === "all" ? undefined : collectionFilter,
      trust: trustFilter === "all" ? undefined : trustFilter,
      sort: sortBy === "newest" ? undefined : sortBy,
      tab: activeTab === "all" ? undefined : activeTab,
    }),
    [searchQuery, collectionFilter, trustFilter, sortBy, activeTab],
  );

  const syncDiscoveryToUrl = useCallback(
    (overrides?: Partial<MarketplaceSearchState>) => {
      const nextSearch = { ...discoverySearch, ...overrides };
      void navigate({
        to: listingIdParam ? "/marketplace/listing/$listingId" : "/marketplace",
        params: listingIdParam ? { listingId: listingIdParam } : undefined,
        search: nextSearch,
        replace: true,
      });
    },
    [discoverySearch, listingIdParam, navigate],
  );

  useEffect(() => {
    setActiveTab(search.tab ?? "all");
    setSearchQuery(search.q ?? "");
    setCollectionFilter(search.collection ?? "all");
    setTrustFilter(search.trust ?? "all");
    setSortBy(search.sort ?? "newest");
  }, [search.q, search.collection, search.trust, search.sort, search.tab]);

  useEffect(() => {
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }
    searchDebounceRef.current = setTimeout(() => {
      syncDiscoveryToUrl();
    }, 300);
    return () => {
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
      }
    };
  }, [syncDiscoveryToUrl]);

  const showVaultedPurchaseToast = useCallback(
    (title: string) => {
      toast.success(title, {
        description:
          "This vaulted NFT is now in your Mintlab wallet. Use Withdraw to external wallet when you are ready to move the original NFT out of Mintlab custody.",
        action: {
          label: WITHDRAW_TO_EXTERNAL_WALLET_LABEL,
          onClick: () => {
            void navigate({ to: "/wallet" });
          },
        },
        duration: 9000,
      });
    },
    [navigate],
  );

  // ── Queries ───────────────────────────────────────────────────────────────

  const { data: listingDetails = [], isLoading: listingsLoading } = useQuery<
    ActiveListingDetail[]
  >({
    queryKey: ["activeListingDetails", "marketplace", "all"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getActiveListingDetails();
    },
    enabled: !!actor && !actorLoading,
    staleTime: 120_000,
    refetchInterval: 300_000,
  });

  const { data: collections = [] } = useQuery<Collection[]>({
    queryKey: [
      "collections",
      "marketplace",
      MARKETPLACE_COLLECTION_PAGE_SIZE.toString(),
    ],
    queryFn: async () => {
      if (!actor) return [];
      const page = await actor.listCollectionsPage(
        null,
        MARKETPLACE_COLLECTION_PAGE_SIZE,
      );
      return page.collections;
    },
    enabled: !!actor && !actorLoading,
  });

  const { data: collectionImportMetas = [] } = useQuery<CollectionImportMeta[]>(
    {
      queryKey: ["collectionImportMetas", "marketplace"],
      queryFn: async () => {
        if (!actor) return [];
        const page = await actor.listCollectionImportMetasPage(null, 100n);
        return page.metas;
      },
      enabled: !!actor && !actorLoading,
    },
  );

  const { data: marketplaceFeeConfig } = useQuery({
    queryKey: ["marketplaceFeeConfig"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMarketplaceFeeConfig();
    },
    enabled: !!actor && !actorLoading,
    staleTime: 3_600_000,
  });

  const { data: userNFTs = [] } = useQuery<WalletNFT[]>({
    queryKey: ["userNFTs", principal?.toString()],
    queryFn: async () => {
      if (!actor || !principal) return [];
      const page = await actor.getUserNFTsPage(
        principal,
        null,
        MARKETPLACE_WALLET_PAGE_SIZE,
      );
      return page.nfts;
    },
    enabled: !!actor && !actorLoading && isAuthenticated && !!principal,
  });

  const { data: settlementStatuses = [] } = useQuery<SettlementStatus[]>({
    queryKey: ["myMarketplaceSettlementStatuses", principal?.toString()],
    queryFn: async () => {
      if (!actor) return [];
      const page = await actor.getMyMarketplaceSettlementStatusesPage(
        null,
        MARKETPLACE_STATUS_PAGE_SIZE,
      );
      return page.statuses;
    },
    enabled: !!actor && !actorLoading && isAuthenticated,
    staleTime: 120_000,
    refetchInterval: 300_000,
  });

  const collectionMap = useMemo(
    () =>
      new Map<bigint, Collection>(
        collections.map((collection) => [collection.id, collection]),
      ),
    [collections],
  );
  const importMetaMap = useMemo(
    () => collectionMetaMap(collectionImportMetas),
    [collectionImportMetas],
  );

  const { data: listingDividendBalances = [] } = useQuery<
    Array<[string, bigint]>
  >({
    queryKey: [
      "marketplaceDividendBalances",
      listingDetails
        .map((detail) => detail.nft.collectionId.toString())
        .join(","),
      collections.map((collection) => collection.id.toString()).join(","),
    ],
    queryFn: async () => {
      if (!actor) return [];
      const entries: Array<[string, bigint]> = [];
      const collectionIds = Array.from(
        new Set(listingDetails.map((detail) => detail.nft.collectionId)),
      );
      for (const collectionId of collectionIds) {
        const collection = collectionMap.get(collectionId);
        if (!collection?.dividendConfig?.enabled) continue;
        const balances =
          await actor.getCollectionDividendBalances(collectionId);
        for (const [tokenId, balance] of balances) {
          entries.push([`${collectionId.toString()}:${tokenId}`, balance]);
        }
      }
      return entries;
    },
    enabled: !!actor && !actorLoading && listingDetails.length > 0,
    refetchOnWindowFocus: false,
    staleTime: 60_000,
  });

  const listingDividendMap = useMemo(
    () => new Map<string, bigint>(listingDividendBalances),
    [listingDividendBalances],
  );
  const ledgerFeeE8s =
    marketplaceFeeConfig?.ledgerFeeE8s ?? DEFAULT_ICP_LEDGER_FEE_E8S;
  const auctionBidFeeReserveE8s =
    marketplaceFeeConfig?.auctionBidFeeReserveE8s ?? ledgerFeeE8s * 2n;
  const mintlabFeeBps =
    marketplaceFeeConfig?.mintlabFeeBasisPoints ?? DEFAULT_MINTLAB_FEE_BPS;

  // ── Derived lists ──────────────────────────────────────────────────────────

  const allListings = useMemo<MarketplaceListingItem[]>(() => {
    return listingDetails.map((detail) => {
      const collection = collectionMap.get(detail.nft.collectionId);
      const trustStatus = collection
        ? collectionTrustStatus(
            collection,
            importMetaMap.get(collection.id.toString()),
          )
        : null;

      if (detail.listing.__kind__ === "Fixed") {
        return {
          kind: "fixed" as const,
          listing: detail.listing.Fixed,
          nft: detail.nft,
          collection,
          trustStatus,
        };
      }

      return {
        kind: "auction" as const,
        listing: detail.listing.Auction,
        nft: detail.nft,
        collection,
        trustStatus,
      };
    });
  }, [listingDetails, collectionMap, importMetaMap]);

  const isVerifiedListing = useCallback(
    ({ collection }: { collection?: Collection }) =>
      collection != null &&
      isMintlabVerifiedCollection(
        collection,
        importMetaMap.get(collection.id.toString()),
      ),
    [importMetaMap],
  );

  const applyDiscovery = useCallback(
    (items: MarketplaceListingItem[]) => {
      const filtered = filterMarketplaceListings(items, {
        query: searchQuery,
        collectionId: collectionFilter === "all" ? null : collectionFilter,
        trust: trustFilter,
        isVerified: isVerifiedListing,
      });
      return sortMarketplaceListings(filtered, sortBy);
    },
    [searchQuery, collectionFilter, trustFilter, sortBy, isVerifiedListing],
  );

  const discoveredAllListings = applyDiscovery(allListings);

  const fixedListings = discoveredAllListings.filter(
    (item): item is FixedListingItem => item.kind === "fixed",
  );

  const buyListingDetail =
    buyTarget == null
      ? null
      : (fixedListings.find(({ listing }) => listing.id === buyTarget) ?? null);

  const auctionListings = discoveredAllListings.filter(
    (item): item is AuctionListingItem => item.kind === "auction",
  );

  const verifiedListings = discoveredAllListings.filter(isVerifiedListing);
  const communityListings = discoveredAllListings.filter(
    (item) => !isVerifiedListing(item),
  );
  const verifiedFixedListings = fixedListings.filter(isVerifiedListing);
  const communityFixedListings = fixedListings.filter(
    (item) => !isVerifiedListing(item),
  );
  const verifiedAuctionListings = auctionListings.filter(isVerifiedListing);
  const communityAuctionListings = auctionListings.filter(
    (item) => !isVerifiedListing(item),
  );

  const cancelAuctionDetail =
    cancelTarget == null
      ? null
      : (auctionListings.find(({ listing }) => listing.id === cancelTarget) ??
        null);
  const cancelAuctionBlockedByBid =
    cancelAuctionDetail != null && auctionHasBid(cancelAuctionDetail.listing);

  const auctionListingIds = auctionListings.map(({ listing }) => listing.id);
  const auctionListingIdsKey = auctionListingIds
    .map((id) => id.toString())
    .join(",");

  const { data: myAuctionBidStatuses = [] } = useQuery<AuctionBidStatus[]>({
    queryKey: [
      "myAuctionBidStatuses",
      principal?.toString(),
      auctionListingIdsKey,
    ],
    queryFn: async () => {
      if (!actor || auctionListingIds.length === 0) return [];
      return actor.getMyAuctionBidStatuses(auctionListingIds);
    },
    enabled:
      !!actor &&
      !actorLoading &&
      isAuthenticated &&
      !!principal &&
      auctionListingIds.length > 0,
    staleTime: 120_000,
    refetchInterval: 300_000,
  });

  const myAuctionBidStatusMap = new Map(
    myAuctionBidStatuses.map((status) => [status.listingId.toString(), status]),
  );

  const listedNFTKeys = new Set(
    listingDetails
      .filter((detail) => {
        const seller =
          detail.listing.__kind__ === "Fixed"
            ? detail.listing.Fixed.seller
            : detail.listing.Auction.seller;
        return principal ? seller.toString() === principal.toString() : false;
      })
      .map(
        (detail) =>
          `${detail.nft.collectionId.toString()}:${detail.nft.tokenId}`,
      ),
  );

  const listableUserNFTs = userNFTs.filter((nft) => {
    if (listedNFTKeys.has(`${nft.collectionId.toString()}:${nft.tokenId}`)) {
      return false;
    }
    if (nft.location === "Minted" || nft.location === "Vaulted") return true;
    if (nft.location !== "Registered") return false;
    const collection = collectionMap.get(nft.collectionId);
    return collection?.kind === "External";
  });

  const listingCollectionOptions = useMemo(() => {
    const listedCollectionIds = new Set(
      allListings.map((item) => item.nft.collectionId.toString()),
    );
    return collections
      .filter((collection) => listedCollectionIds.has(collection.id.toString()))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [allListings, collections]);

  const hasActiveDiscoveryFilters =
    searchQuery.trim().length > 0 ||
    collectionFilter !== "all" ||
    trustFilter !== "all" ||
    sortBy !== "newest";

  const buildListingDetail = useCallback(
    (item: MarketplaceListingItem): ListingDetailState => {
      const dividendE8s =
        listingDividendMap.get(
          nftKey(item.nft.collectionId, item.nft.tokenId),
        ) ?? 0n;
      if (item.kind === "fixed") {
        return {
          listing: { __kind__: "Fixed", Fixed: item.listing },
          nft: item.nft,
          collection: item.collection,
          trustStatus: item.trustStatus,
          dividendE8s,
        };
      }
      return {
        listing: {
          __kind__: "Auction",
          Auction: item.listing as AuctionListing,
        },
        nft: item.nft,
        collection: item.collection,
        trustStatus: item.trustStatus,
        dividendE8s,
      };
    },
    [listingDividendMap],
  );

  const openListingDetail = useCallback(
    (detail: ListingDetailState) => {
      setDetailTarget(detail);
      const listingId =
        detail.listing.__kind__ === "Fixed"
          ? detail.listing.Fixed.id
          : detail.listing.Auction.id;
      void navigate({
        to: "/marketplace/listing/$listingId",
        params: { listingId: listingId.toString() },
        search: discoverySearch,
      });
    },
    [discoverySearch, navigate],
  );

  const closeListingDetail = useCallback(() => {
    setDetailTarget(null);
    void navigate({
      to: "/marketplace",
      search: discoverySearch,
    });
  }, [discoverySearch, navigate]);

  useEffect(() => {
    if (!listingIdParam || listingsLoading) return;
    let listingId: bigint;
    try {
      listingId = BigInt(listingIdParam);
    } catch {
      return;
    }
    const item = allListings.find(
      (listingItem) => listingIdFromItem(listingItem) === listingId,
    );
    if (!item) return;

    const nextDetail = buildListingDetail(item);
    setDetailTarget((current) => {
      if (!current) return nextDetail;
      const currentListingId =
        current.listing.__kind__ === "Fixed"
          ? current.listing.Fixed.id
          : current.listing.Auction.id;
      if (
        currentListingId === listingId &&
        current.dividendE8s === nextDetail.dividendE8s
      ) {
        return current;
      }
      return nextDetail;
    });
  }, [listingIdParam, listingsLoading, allListings, buildListingDetail]);

  const clearDiscoveryFilters = () => {
    setSearchQuery("");
    setCollectionFilter("all");
    setTrustFilter("all");
    setSortBy("newest");
    void navigate({
      to: listingIdParam ? "/marketplace/listing/$listingId" : "/marketplace",
      params: listingIdParam ? { listingId: listingIdParam } : undefined,
      search: {},
      replace: true,
    });
  };

  // ── Mutations ──────────────────────────────────────────────────────────────

  const refreshMarketplace = () => {
    void qc.invalidateQueries({ queryKey: ["activeListingDetails"] });
    void qc.invalidateQueries({ queryKey: ["activeListings"] });
    void qc.invalidateQueries({ queryKey: ["userNFTs"] });
    void qc.invalidateQueries({ queryKey: ["userStats"] });
    void qc.invalidateQueries({ queryKey: ["icp-balance"] });
    void qc.invalidateQueries({ queryKey: ["collectionImportMetas"] });
    void qc.invalidateQueries({ queryKey: ["myAuctionBidStatuses"] });
    void qc.invalidateQueries({
      queryKey: ["myMarketplaceSettlementStatuses"],
    });
  };

  const { mutate: reportListing } = useMutation({
    mutationFn: async ({
      collection,
      nft,
    }: {
      collection: Collection;
      nft: WalletNFT;
    }) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.reportNFT(
        collection.id,
        nft.tokenId,
        `Marketplace report for ${getNFTTokenLabel(nft, collection)} in ${collection.name}`,
      );
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      toast.success("Report sent to Mintlab admins.");
      void qc.invalidateQueries({ queryKey: ["collectionImportMetas"] });
      void qc.invalidateQueries({ queryKey: ["nftReportMetas"] });
      void qc.invalidateQueries({ queryKey: ["collections"] });
      void qc.invalidateQueries({ queryKey: ["activeListingDetails"] });
    },
    onError: (e: Error) => toast.error(`Report failed: ${e.message}`),
  });

  function handleReportListing(
    collection: Collection | undefined,
    nft: WalletNFT,
  ) {
    if (!collection) {
      toast.error("Collection information is missing for this NFT.");
      return;
    }
    if (!isAuthenticated) {
      toast("Sign in to report this NFT.");
      return;
    }
    reportListing({ collection, nft });
  }

  async function ensureNFTReadyForListing(nft: WalletNFT): Promise<bigint> {
    if (!actor) throw new Error("Not connected");
    if (nft.location !== "Registered") return nft.id;
    if (!principal) throw new Error("Sign in to list this NFT");

    const collection = collectionMap.get(nft.collectionId);
    if (!collection) throw new Error("Collection not found for this NFT");
    if (collection.kind !== "External") {
      throw new Error(
        "Only external registered NFTs can be vaulted for listing",
      );
    }

    const existingClaim = await actor.claimVaultDeposit(
      nft.collectionId,
      nft.tokenId,
    );
    if (existingClaim.__kind__ === "ok") return existingClaim.ok.id;

    const prepared = await actor.prepareVaultDeposit(
      nft.collectionId,
      nft.tokenId,
    );
    if (prepared.__kind__ === "err") throw new Error(prepared.err);

    const vaultPrincipal = await actor.getVaultPrincipal();
    await transferRegisteredNFT({
      agent: actor.getAgent(),
      collection,
      nft,
      owner: principal,
      recipient: vaultPrincipal,
    });

    const claimed = await actor.claimVaultDeposit(
      nft.collectionId,
      nft.tokenId,
    );
    if (claimed.__kind__ === "err") throw new Error(claimed.err);
    return claimed.ok.id;
  }

  const { mutate: buyListing, isPending: isBuying } = useMutation({
    mutationFn: async (id: ListingId) => {
      if (!actor) throw new Error("Not connected");
      return actor.buyFixedListing(id);
    },
    onSuccess: (_result, id) => {
      const purchasedDetail = fixedListings.find(
        ({ listing }) => listing.id === id,
      );
      if (isVaultedInMintlab(purchasedDetail?.nft)) {
        showVaultedPurchaseToast("Vaulted NFT purchased");
      } else {
        toast.success("NFT purchased successfully!");
      }
      setBuyTarget(null);
      refreshMarketplace();
    },
    onError: (e: Error) => toast.error(`Purchase failed: ${e.message}`),
  });

  const { mutate: cancelListing, isPending: isCancelling } = useMutation({
    mutationFn: async (id: ListingId) => {
      if (!actor) throw new Error("Not connected");
      return actor.cancelListing(id);
    },
    onSuccess: () => {
      toast.success("Listing cancelled.");
      setCancelTarget(null);
      refreshMarketplace();
    },
    onError: (e: Error) => toast.error(`Cancel failed: ${e.message}`),
  });

  const { mutate: placeBid, isPending: isBidding } = useMutation({
    mutationFn: async ({ id, amount }: { id: ListingId; amount: bigint }) => {
      if (!actor) throw new Error("Not connected");
      return actor.placeBid(id, amount);
    },
    onSuccess: () => {
      toast.success("Bid placed and escrow funded!");
      setBidTarget(null);
      refreshMarketplace();
    },
    onError: (e: Error) => {
      if (e.message.toLowerCase().includes("pending bid")) {
        toast.error(
          "This auction has a pending bid recovery. Retry with the same amount or contact an admin.",
        );
        return;
      }
      toast.error(`Bid failed: ${e.message}`);
    },
  });

  const { mutate: retryPendingBid, isPending: isRetryingPendingBid } =
    useMutation({
      mutationFn: async (id: ListingId) => {
        if (!actor) throw new Error("Not connected");
        return actor.retryPendingBid(id);
      },
      onSuccess: () => {
        toast.success("Pending bid recovered.");
        refreshMarketplace();
      },
      onError: (e: Error) => toast.error(`Retry failed: ${e.message}`),
    });

  const {
    mutate: cancelStalePendingBid,
    isPending: isCancellingStalePendingBid,
  } = useMutation({
    mutationFn: async (id: ListingId) => {
      if (!actor) throw new Error("Not connected");
      return actor.cancelStalePendingBid(id);
    },
    onSuccess: () => {
      toast.success("Pending bid recovery resolved.");
      refreshMarketplace();
    },
    onError: (e: Error) => toast.error(`Recovery failed: ${e.message}`),
  });

  const { mutate: settleAuction, isPending: isSettling } = useMutation({
    mutationFn: async (id: ListingId) => {
      if (!actor) throw new Error("Not connected");
      return actor.settleAuction(id);
    },
    onSuccess: (_result, id) => {
      const settledDetail = auctionListings.find(
        ({ listing }) => listing.id === id,
      );
      const bidStatus = myAuctionBidStatusMap.get(id.toString());
      const viewerIsWinner =
        settledDetail != null &&
        isViewerWinningAuction(settledDetail.listing, principalStr, bidStatus);
      if (viewerIsWinner && isVaultedInMintlab(settledDetail?.nft)) {
        showVaultedPurchaseToast("Vaulted auction NFT collected");
      } else {
        toast.success("Auction settled!");
      }
      refreshMarketplace();
    },
    onError: (e: Error) => toast.error(`Settle failed: ${e.message}`),
  });

  const { mutate: createFixed, isPending: isCreatingFixed } = useMutation({
    mutationFn: async ({ nft, price }: { nft: WalletNFT; price: bigint }) => {
      if (!actor) throw new Error("Not connected");
      const nftId = await ensureNFTReadyForListing(nft);
      return actor.createFixedListing(nftId, price);
    },
    onSuccess: () => {
      toast.success("Fixed listing created!");
      setListModalOpen(false);
      refreshMarketplace();
    },
    onError: (e: Error) => toast.error(`Listing failed: ${e.message}`),
  });

  const { mutate: createAuction, isPending: isCreatingAuction } = useMutation({
    mutationFn: async ({
      nft,
      startingBid,
      endTime,
    }: {
      nft: WalletNFT;
      startingBid: bigint;
      endTime: bigint;
    }) => {
      if (!actor) throw new Error("Not connected");
      const nftId = await ensureNFTReadyForListing(nft);
      return actor.createAuctionListing(nftId, startingBid, endTime);
    },
    onSuccess: () => {
      toast.success("Auction listing created!");
      setListModalOpen(false);
      refreshMarketplace();
    },
    onError: (e: Error) => toast.error(`Listing failed: ${e.message}`),
  });

  const isListing = isCreatingFixed || isCreatingAuction;

  function handleList(params: ListParams) {
    if (params.type === "fixed") {
      createFixed({ nft: params.nft, price: params.price });
    } else {
      createAuction({
        nft: params.nft,
        startingBid: params.startingBid,
        endTime: params.endTime,
      });
    }
  }

  function renderListingCard(
    item: MarketplaceListingItem,
    index: number,
    ocidPrefix?: string,
  ) {
    const dividendE8s =
      listingDividendMap.get(nftKey(item.nft.collectionId, item.nft.tokenId)) ??
      0n;

    if (item.kind === "fixed") {
      return (
        <FixedListingCard
          key={`${ocidPrefix ?? "marketplace.fixed"}-${item.listing.id.toString()}`}
          listing={item.listing}
          nft={item.nft}
          collection={item.collection}
          trustStatus={item.trustStatus}
          dividendE8s={dividendE8s}
          index={index}
          ocidPrefix={ocidPrefix}
          currentPrincipal={principalStr}
          onBuy={(id) => setBuyTarget(id)}
          onCancel={(id) => setCancelTarget(id)}
          onDetails={() => openListingDetail(buildListingDetail(item))}
          isBuying={isBuying && buyTarget === item.listing.id}
          isCancelling={isCancelling && cancelTarget === item.listing.id}
        />
      );
    }

    return (
      <AuctionListingCard
        key={`${ocidPrefix ?? "marketplace.auction"}-${item.listing.id.toString()}`}
        listing={item.listing}
        nft={item.nft}
        collection={item.collection}
        trustStatus={item.trustStatus}
        dividendE8s={dividendE8s}
        index={index}
        ocidPrefix={ocidPrefix}
        currentPrincipal={principalStr}
        bidStatus={myAuctionBidStatusMap.get(item.listing.id.toString())}
        onBid={(listing) => setBidTarget(listing)}
        onSettle={(id) => settleAuction(id)}
        onCancel={(id) => setCancelTarget(id)}
        onDetails={() => openListingDetail(buildListingDetail(item))}
        isSettling={isSettling}
        isCancelling={isCancelling && cancelTarget === item.listing.id}
      />
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  const buyPrice = buyListingDetail?.listing.price ?? 0n;
  const buyMintlabFee = marketplaceFee(buyPrice, mintlabFeeBps);
  const buySellerProceeds = buyPrice - buyMintlabFee;
  const buySettlementLedgerFees = ledgerFeeE8s * (buyMintlabFee > 0n ? 2n : 1n);
  const buyTotalLedgerFees = buySettlementLedgerFees + ledgerFeeE8s;

  return (
    <div className="min-h-screen bg-background" data-ocid="marketplace.page">
      {/* Sticky header strip */}
      <div className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-mono mb-0.5">
              Marketplace
            </p>
            <h1 className="font-display text-2xl font-bold text-foreground leading-tight">
              Discover Digital Collectibles
            </h1>
          </div>

          {isAuthenticated ? (
            <Button
              className="bg-accent text-accent-foreground hover:bg-accent/90 transition-smooth font-semibold shrink-0"
              onClick={() => setListModalOpen(true)}
              data-ocid="marketplace.list_nft_button"
            >
              <Tag className="w-4 h-4 mr-2" />
              List Your NFT
            </Button>
          ) : (
            <Button
              variant="outline"
              className="border-accent/40 text-accent hover:bg-accent/10 transition-smooth shrink-0"
              onClick={login}
              data-ocid="marketplace.login_button"
            >
              Connect Wallet to List
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <HelpCallout
          title="List from your Wallet, buy and bid from your ICP Account"
          sectionId="marketplace"
          actionLabel="Marketplace guide"
          className="mb-6"
          ocid="marketplace.help_callout"
        >
          Fixed purchases and auction bids use your in-app ICP balance. External
          registered wallet NFTs are vaulted before listing. Buying a vaulted
          NFT keeps it in Mintlab custody until the owner withdraws it to an
          external wallet.
        </HelpCallout>

        {settlementStatuses.length > 0 && (
          <div className="mb-6 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4">
            <div className="mb-3 flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber-700 dark:text-amber-200" />
              <h2 className="text-sm font-semibold text-foreground">
                Settlement status
              </h2>
            </div>
            <div className="grid gap-2 md:grid-cols-2">
              {settlementStatuses.map((status) => (
                <div
                  key={`${status.kind}:${status.listingId.toString()}:${status.role}`}
                  className="rounded-md border border-border bg-background/70 p-3"
                >
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-foreground">
                      Listing #{status.listingId.toString()}
                    </p>
                    <Badge className="shrink-0 border-0 bg-amber-500/20 text-amber-700 dark:text-amber-200">
                      {status.role}
                    </Badge>
                  </div>
                  <p className="text-xs font-medium text-muted-foreground">
                    {status.stage}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {status.message}
                  </p>
                  {status.kind === "PendingBidDeposit" && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        className="h-7 text-xs"
                        disabled={isRetryingPendingBid}
                        onClick={() => retryPendingBid(status.listingId)}
                        data-ocid={`marketplace.pending_bid.retry.${status.listingId.toString()}`}
                      >
                        {isRetryingPendingBid ? (
                          <LoadingSpinner size="sm" />
                        ) : (
                          <RefreshCw className="h-3.5 w-3.5" />
                        )}
                        Retry bid
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs"
                        disabled={isCancellingStalePendingBid}
                        onClick={() => cancelStalePendingBid(status.listingId)}
                        data-ocid={`marketplace.pending_bid.cancel_stale.${status.listingId.toString()}`}
                      >
                        {isCancellingStalePendingBid ? (
                          <LoadingSpinner size="sm" />
                        ) : (
                          <X className="h-3.5 w-3.5" />
                        )}
                        Cancel stale bid
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div
          className="mb-6 space-y-3 rounded-xl border border-border bg-card/70 p-4"
          data-ocid="marketplace.discovery.toolbar"
        >
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <SlidersHorizontal className="h-4 w-4 text-accent" />
            Discover listings
          </div>
          <div className="grid gap-3 lg:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,0.7fr))_auto]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search NFTs, collections, sellers, token IDs…"
                className="bg-background pl-9"
                data-ocid="marketplace.discovery.search_input"
              />
            </div>
            <Select
              value={collectionFilter}
              onValueChange={(value) => {
                setCollectionFilter(value);
                syncDiscoveryToUrl({
                  collection: value === "all" ? undefined : value,
                });
              }}
            >
              <SelectTrigger data-ocid="marketplace.discovery.collection_filter">
                <SelectValue placeholder="All collections" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All collections</SelectItem>
                {listingCollectionOptions.map((collection) => (
                  <SelectItem
                    key={collection.id.toString()}
                    value={collection.id.toString()}
                  >
                    {collection.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={trustFilter}
              onValueChange={(value) => {
                const nextTrust = value as MarketplaceTrustFilter;
                setTrustFilter(nextTrust);
                syncDiscoveryToUrl({
                  trust: nextTrust === "all" ? undefined : nextTrust,
                });
              }}
            >
              <SelectTrigger data-ocid="marketplace.discovery.trust_filter">
                <SelectValue placeholder="All trust levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All trust levels</SelectItem>
                <SelectItem value="verified">Mintlab verified</SelectItem>
                <SelectItem value="community">Community only</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={sortBy}
              onValueChange={(value) => {
                const nextSort = value as MarketplaceSort;
                setSortBy(nextSort);
                syncDiscoveryToUrl({
                  sort: nextSort === "newest" ? undefined : nextSort,
                });
              }}
            >
              <SelectTrigger data-ocid="marketplace.discovery.sort_filter">
                <SelectValue placeholder="Sort listings" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest listed</SelectItem>
                <SelectItem value="price-asc">Price: low to high</SelectItem>
                <SelectItem value="price-desc">Price: high to low</SelectItem>
                <SelectItem value="ending-soon">Ending soon</SelectItem>
              </SelectContent>
            </Select>
            {hasActiveDiscoveryFilters && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="gap-1.5 text-muted-foreground"
                onClick={clearDiscoveryFilters}
                data-ocid="marketplace.discovery.clear_filters"
              >
                <X className="h-3.5 w-3.5" />
                Clear
              </Button>
            )}
          </div>
          {!listingsLoading && (
            <p className="text-xs text-muted-foreground">
              Showing {discoveredAllListings.length} of {allListings.length}{" "}
              active listings
            </p>
          )}
        </div>

        <Tabs
          value={activeTab}
          onValueChange={(value) => {
            const nextTab = value as MarketplaceTab;
            setActiveTab(nextTab);
            syncDiscoveryToUrl({
              tab: nextTab === "all" ? undefined : nextTab,
            });
          }}
        >
          <TabsList
            className="bg-muted/60 border border-border mb-6"
            data-ocid="marketplace.tabs"
          >
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-foreground data-[state=active]:text-background font-medium"
              data-ocid="marketplace.tab.all"
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              All Listings
              {discoveredAllListings.length > 0 && (
                <Badge className="ml-2 bg-background/20 text-current text-[10px] px-1.5 py-0 font-mono border-0">
                  {discoveredAllListings.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="fixed"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-medium"
              data-ocid="marketplace.tab.fixed"
            >
              <Tag className="w-4 h-4 mr-2" />
              Fixed Price
              {fixedListings.length > 0 && (
                <Badge className="ml-2 bg-primary/20 text-primary text-[10px] px-1.5 py-0 font-mono border-0">
                  {fixedListings.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="auctions"
              className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground font-medium"
              data-ocid="marketplace.tab.auctions"
            >
              <Gavel className="w-4 h-4 mr-2" />
              Auctions
              {auctionListings.length > 0 && (
                <Badge className="ml-2 bg-accent/20 text-accent text-[10px] px-1.5 py-0 font-mono border-0">
                  {auctionListings.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* All Listings Tab */}
          <TabsContent value="all" className="mt-0">
            {listingsLoading ? (
              <div
                className="flex items-center justify-center min-h-[40vh]"
                data-ocid="marketplace.all.loading_state"
              >
                <LoadingSpinner size="lg" label="Loading listings…" />
              </div>
            ) : allListings.length === 0 ? (
              <EmptyState
                icon={ShoppingBag}
                title="No marketplace listings"
                description="No fixed-price listings or auctions are active right now. List yours to start the marketplace."
                action={
                  isAuthenticated
                    ? {
                        label: "List Your NFT",
                        onClick: () => setListModalOpen(true),
                        "data-ocid": "marketplace.all.list_cta",
                      }
                    : undefined
                }
                data-ocid="marketplace.all.empty_state"
              />
            ) : discoveredAllListings.length === 0 ? (
              <EmptyState
                icon={Search}
                title="No listings match your filters"
                description="Try a broader search, another collection, or clear the current filters to see more marketplace listings."
                action={{
                  label: "Clear filters",
                  onClick: clearDiscoveryFilters,
                  "data-ocid": "marketplace.all.clear_filters_cta",
                }}
                data-ocid="marketplace.all.filtered_empty_state"
              />
            ) : (
              <div className="space-y-8">
                {verifiedListings.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {verifiedListings.map((item, i) =>
                      renderListingCard(
                        item,
                        i,
                        item.kind === "fixed"
                          ? "marketplace.all.fixed"
                          : "marketplace.all.auction",
                      ),
                    )}
                  </div>
                )}

                {communityListings.length > 0 && (
                  <section className="space-y-4">
                    <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4">
                      <p className="text-sm font-semibold text-foreground">
                        Unverified community listings
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        {COMMUNITY_COLLECTION_NOTICE} Check canister IDs
                        carefully and report suspected counterfeits or unsafe
                        content.
                      </p>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                      {communityListings.map((item, i) =>
                        renderListingCard(
                          item,
                          verifiedListings.length + i,
                          item.kind === "fixed"
                            ? "marketplace.all.fixed"
                            : "marketplace.all.auction",
                        ),
                      )}
                    </div>
                  </section>
                )}
              </div>
            )}
          </TabsContent>

          {/* Fixed Price Tab */}
          <TabsContent value="fixed" className="mt-0">
            {listingsLoading ? (
              <div
                className="flex items-center justify-center min-h-[40vh]"
                data-ocid="marketplace.fixed.loading_state"
              >
                <LoadingSpinner size="lg" label="Loading listings…" />
              </div>
            ) : allListings.filter((item) => item.kind === "fixed").length ===
              0 ? (
              <EmptyState
                icon={ShoppingBag}
                title="No fixed-price listings"
                description="Be the first to list an NFT for a fixed price. Connect your wallet and click 'List Your NFT' above."
                action={
                  isAuthenticated
                    ? {
                        label: "List Your NFT",
                        onClick: () => setListModalOpen(true),
                        "data-ocid": "marketplace.fixed.list_cta",
                      }
                    : undefined
                }
                data-ocid="marketplace.fixed.empty_state"
              />
            ) : fixedListings.length === 0 ? (
              <EmptyState
                icon={Search}
                title="No fixed listings match your filters"
                description="Adjust your search or clear filters to see fixed-price listings again."
                action={{
                  label: "Clear filters",
                  onClick: clearDiscoveryFilters,
                  "data-ocid": "marketplace.fixed.clear_filters_cta",
                }}
                data-ocid="marketplace.fixed.filtered_empty_state"
              />
            ) : (
              <div className="space-y-8">
                {verifiedFixedListings.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {verifiedFixedListings.map(
                      ({ listing, nft, collection, trustStatus }, i) => (
                        <FixedListingCard
                          key={listing.id.toString()}
                          listing={listing}
                          nft={nft}
                          collection={collection}
                          trustStatus={trustStatus}
                          dividendE8s={
                            listingDividendMap.get(
                              nftKey(nft.collectionId, nft.tokenId),
                            ) ?? 0n
                          }
                          index={i}
                          currentPrincipal={principalStr}
                          onBuy={(id) => setBuyTarget(id)}
                          onCancel={(id) => setCancelTarget(id)}
                          onDetails={() =>
                            openListingDetail(
                              buildListingDetail({
                                kind: "fixed",
                                listing,
                                nft,
                                collection,
                                trustStatus,
                              }),
                            )
                          }
                          isBuying={isBuying && buyTarget === listing.id}
                          isCancelling={
                            isCancelling && cancelTarget === listing.id
                          }
                        />
                      ),
                    )}
                  </div>
                )}

                {communityFixedListings.length > 0 && (
                  <section className="space-y-4">
                    <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4">
                      <p className="text-sm font-semibold text-foreground">
                        Unverified community listings
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        {COMMUNITY_COLLECTION_NOTICE} Check canister IDs
                        carefully and report suspected counterfeits or unsafe
                        content.
                      </p>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                      {communityFixedListings.map(
                        ({ listing, nft, collection, trustStatus }, i) => (
                          <FixedListingCard
                            key={listing.id.toString()}
                            listing={listing}
                            nft={nft}
                            collection={collection}
                            trustStatus={trustStatus}
                            dividendE8s={
                              listingDividendMap.get(
                                nftKey(nft.collectionId, nft.tokenId),
                              ) ?? 0n
                            }
                            index={verifiedFixedListings.length + i}
                            currentPrincipal={principalStr}
                            onBuy={(id) => setBuyTarget(id)}
                            onCancel={(id) => setCancelTarget(id)}
                            onDetails={() =>
                              openListingDetail(
                                buildListingDetail({
                                  kind: "fixed",
                                  listing,
                                  nft,
                                  collection,
                                  trustStatus,
                                }),
                              )
                            }
                            isBuying={isBuying && buyTarget === listing.id}
                            isCancelling={
                              isCancelling && cancelTarget === listing.id
                            }
                          />
                        ),
                      )}
                    </div>
                  </section>
                )}
              </div>
            )}
          </TabsContent>

          {/* Auctions Tab */}
          <TabsContent value="auctions" className="mt-0">
            {listingsLoading ? (
              <div
                className="flex items-center justify-center min-h-[40vh]"
                data-ocid="marketplace.auction.loading_state"
              >
                <LoadingSpinner size="lg" label="Loading auctions…" />
              </div>
            ) : allListings.filter((item) => item.kind === "auction").length ===
              0 ? (
              <EmptyState
                icon={Gavel}
                title="No active auctions"
                description="No NFTs are currently up for auction. List yours to start the bidding!"
                action={
                  isAuthenticated
                    ? {
                        label: "Start an Auction",
                        onClick: () => setListModalOpen(true),
                        "data-ocid": "marketplace.auction.list_cta",
                      }
                    : undefined
                }
                data-ocid="marketplace.auction.empty_state"
              />
            ) : auctionListings.length === 0 ? (
              <EmptyState
                icon={Search}
                title="No auctions match your filters"
                description="Adjust your search or clear filters to see active auctions again."
                action={{
                  label: "Clear filters",
                  onClick: clearDiscoveryFilters,
                  "data-ocid": "marketplace.auction.clear_filters_cta",
                }}
                data-ocid="marketplace.auction.filtered_empty_state"
              />
            ) : (
              <div className="space-y-8">
                {verifiedAuctionListings.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {verifiedAuctionListings.map(
                      ({ listing, nft, collection, trustStatus }, i) => (
                        <AuctionListingCard
                          key={listing.id.toString()}
                          listing={listing}
                          nft={nft}
                          collection={collection}
                          trustStatus={trustStatus}
                          dividendE8s={
                            listingDividendMap.get(
                              nftKey(nft.collectionId, nft.tokenId),
                            ) ?? 0n
                          }
                          index={i}
                          currentPrincipal={principalStr}
                          bidStatus={myAuctionBidStatusMap.get(
                            listing.id.toString(),
                          )}
                          onBid={(l) => setBidTarget(l)}
                          onSettle={(id) => settleAuction(id)}
                          onCancel={(id) => setCancelTarget(id)}
                          onDetails={() =>
                            openListingDetail(
                              buildListingDetail({
                                kind: "auction",
                                listing,
                                nft,
                                collection,
                                trustStatus,
                              }),
                            )
                          }
                          isSettling={isSettling}
                          isCancelling={
                            isCancelling && cancelTarget === listing.id
                          }
                        />
                      ),
                    )}
                  </div>
                )}

                {communityAuctionListings.length > 0 && (
                  <section className="space-y-4">
                    <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4">
                      <p className="text-sm font-semibold text-foreground">
                        Unverified community auctions
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        {COMMUNITY_COLLECTION_NOTICE} Check canister IDs
                        carefully and report suspected counterfeits or unsafe
                        content.
                      </p>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                      {communityAuctionListings.map(
                        ({ listing, nft, collection, trustStatus }, i) => (
                          <AuctionListingCard
                            key={listing.id.toString()}
                            listing={listing}
                            nft={nft}
                            collection={collection}
                            trustStatus={trustStatus}
                            dividendE8s={
                              listingDividendMap.get(
                                nftKey(nft.collectionId, nft.tokenId),
                              ) ?? 0n
                            }
                            index={verifiedAuctionListings.length + i}
                            currentPrincipal={principalStr}
                            bidStatus={myAuctionBidStatusMap.get(
                              listing.id.toString(),
                            )}
                            onBid={(l) => setBidTarget(l)}
                            onSettle={(id) => settleAuction(id)}
                            onCancel={(id) => setCancelTarget(id)}
                            onDetails={() =>
                              openListingDetail(
                                buildListingDetail({
                                  kind: "auction",
                                  listing,
                                  nft,
                                  collection,
                                  trustStatus,
                                }),
                              )
                            }
                            isSettling={isSettling}
                            isCancelling={
                              isCancelling && cancelTarget === listing.id
                            }
                          />
                        ),
                      )}
                    </div>
                  </section>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <ListingDetailModal
        detail={detailTarget}
        currentPrincipal={principalStr}
        bidStatusMap={myAuctionBidStatusMap}
        onClose={closeListingDetail}
        onBuy={(id) => setBuyTarget(id)}
        onCancel={(id) => setCancelTarget(id)}
        onBid={(listing) => setBidTarget(listing)}
        onReport={handleReportListing}
      />

      {/* Buy Confirmation Dialog */}
      <AlertDialog
        open={buyTarget !== null}
        onOpenChange={(v) => !v && !isBuying && setBuyTarget(null)}
      >
        <AlertDialogContent
          className="bg-card border-border"
          data-ocid="marketplace.buy_dialog"
        >
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display">
              Confirm Purchase
            </AlertDialogTitle>
            <AlertDialogDescription>
              Confirm the ICP payment from your in-app account. The purchase is
              funded into marketplace escrow first, then the NFT and seller
              payout are settled from there.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {buyListingDetail && (
            <div className="space-y-2 rounded-lg border border-border bg-muted/30 p-3 text-sm">
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">Listed price</span>
                <span className="font-mono">
                  {formatICPAmount(buyListingDetail.listing.price)} ICP
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">NFT custody</span>
                <Badge
                  variant="secondary"
                  className={`border text-[10px] ${nftCustodyClass(buyListingDetail.nft.location)}`}
                >
                  {nftCustodyLabel(buyListingDetail.nft.location)}
                </Badge>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">
                  Mintlab fee
                  <span className="block text-[11px] leading-snug">
                    Deducted from seller proceeds
                  </span>
                </span>
                <span className="font-mono">
                  {formatICPAmount(buyMintlabFee)} ICP
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">Seller receives</span>
                <span className="font-mono">
                  {formatICPAmount(buySellerProceeds)} ICP
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">
                  Settlement ledger fees
                  <span className="block text-[11px] leading-snug">
                    Reserved in escrow for the seller and Mintlab payouts
                  </span>
                </span>
                <span className="font-mono">
                  {formatICPAmount(buySettlementLedgerFees)} ICP
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">
                  Transfer to escrow fee
                </span>
                <span className="font-mono">
                  {formatICPAmount(ledgerFeeE8s)} ICP
                </span>
              </div>
              <div className="flex items-center justify-between gap-4 border-t border-border pt-2 font-medium">
                <span>Total debit</span>
                <span className="font-mono">
                  {formatICPAmount(buyPrice + buyTotalLedgerFees)} ICP
                </span>
              </div>
            </div>
          )}
          {isVaultedInMintlab(buyListingDetail?.nft) && (
            <div className="rounded-lg border border-primary/30 bg-primary/5 p-3 text-xs leading-relaxed text-muted-foreground">
              <p className="font-semibold text-foreground">
                Vaulted in Mintlab
              </p>
              <p className="mt-1">
                {VAULTED_PURCHASE_NOTICE} After purchase, use{" "}
                {WITHDRAW_TO_EXTERNAL_WALLET_LABEL} from Wallet to move the
                original NFT to your principal.
              </p>
            </div>
          )}
          <TermsAgreementNotice actionLabel="confirming this purchase" />
          <AlertDialogFooter>
            <AlertDialogCancel
              className="border-border"
              disabled={isBuying}
              data-ocid="marketplace.buy_cancel_button"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-accent text-accent-foreground hover:bg-accent/90"
              disabled={isBuying}
              onClick={(event) => {
                event.preventDefault();
                if (buyTarget !== null && !isBuying) buyListing(buyTarget);
              }}
              data-ocid="marketplace.buy_confirm_button"
            >
              {isBuying ? (
                <>
                  <LoadingSpinner size="sm" />
                  Processing purchase...
                </>
              ) : (
                "Confirm Purchase"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Cancel Listing Confirmation Dialog */}
      <AlertDialog
        open={cancelTarget !== null}
        onOpenChange={(v) => !v && setCancelTarget(null)}
      >
        <AlertDialogContent
          className="bg-card border-border"
          data-ocid="marketplace.cancel_dialog"
        >
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display">
              Cancel Listing
            </AlertDialogTitle>
            <AlertDialogDescription>
              {cancelAuctionBlockedByBid
                ? "This auction already has a bid, so it cannot be canceled. Let the auction finish, then settle it."
                : "Are you sure you want to cancel this listing? Your NFT will be returned to your wallet."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <TermsAgreementNotice actionLabel="canceling this listing" />
          <AlertDialogFooter>
            <AlertDialogCancel
              className="border-border"
              data-ocid="marketplace.cancel_keep_button"
            >
              Keep Listing
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() =>
                cancelTarget !== null &&
                !cancelAuctionBlockedByBid &&
                cancelListing(cancelTarget)
              }
              disabled={cancelAuctionBlockedByBid || isCancelling}
              data-ocid="marketplace.cancel_confirm_button"
            >
              {isCancelling ? <LoadingSpinner size="sm" /> : "Cancel Listing"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Place Bid Modal */}
      <PlaceBidModal
        listing={bidTarget}
        nft={
          bidTarget
            ? auctionListings.find(({ listing }) => listing.id === bidTarget.id)
                ?.nft
            : undefined
        }
        collection={
          bidTarget
            ? auctionListings.find(({ listing }) => listing.id === bidTarget.id)
                ?.collection
            : undefined
        }
        ledgerFeeE8s={ledgerFeeE8s}
        auctionBidFeeReserveE8s={auctionBidFeeReserveE8s}
        mintlabFeeBps={mintlabFeeBps}
        onClose={() => setBidTarget(null)}
        onBid={(id, amount) => placeBid({ id, amount })}
        isBidding={isBidding}
      />

      {/* List NFT Modal */}
      <ListNFTModal
        open={listModalOpen}
        onClose={() => setListModalOpen(false)}
        userNFTs={listableUserNFTs}
        collections={collections}
        onList={handleList}
        isListing={isListing}
      />
    </div>
  );
}
