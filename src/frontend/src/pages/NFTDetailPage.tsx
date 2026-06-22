import { CollectionBadge } from "@/components/CollectionBadge";
import { EmptyState } from "@/components/EmptyState";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ShareLinkButton } from "@/components/ShareLinkButton";
import { ZoomableMediaImage } from "@/components/ZoomableMediaImage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useBackend } from "@/hooks/use-backend";
import { usePageMeta } from "@/hooks/use-page-meta";
import {
  collectionMetaMap,
  collectionTrustStatus,
} from "@/lib/collection-trust";
import { resolveImageUrl } from "@/lib/media";
import {
  nftCustodyClass,
  nftCustodyDescription,
  nftCustodyLabel,
} from "@/lib/nft-custody";
import {
  getNFTDisplayName,
  getNFTDisplayTokenId,
  getNFTTokenLabel,
  getNFTVisibleAttributes,
} from "@/lib/nft-display";
import { appPageUrl, nftSharePath, nftShareUrl } from "@/lib/share-urls";
import type { ActiveListingDetail, Collection, WalletNFT } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  ExternalLink,
  Gavel,
  ImageOff,
  ShoppingBag,
} from "lucide-react";
import { useMemo } from "react";

function NFTImagePlaceholder({ name }: { name: string }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-muted/60">
      <ImageOff className="h-8 w-8 text-muted-foreground/40" />
      <span className="max-w-full truncate px-2 text-center text-xs text-muted-foreground/60">
        {name}
      </span>
    </div>
  );
}

export default function NFTDetailPage() {
  const { collectionId: collectionIdParam, tokenId: tokenIdParam } = useParams({
    from: "/nft/$collectionId/$tokenId",
  });
  const navigate = useNavigate();
  const { actor, isFetching } = useBackend();

  const collectionId = useMemo(() => {
    try {
      return BigInt(collectionIdParam);
    } catch {
      return null;
    }
  }, [collectionIdParam]);

  const tokenId = useMemo(() => {
    if (!tokenIdParam) return null;
    try {
      return decodeURIComponent(tokenIdParam);
    } catch {
      return tokenIdParam;
    }
  }, [tokenIdParam]);

  const { data: collection, isLoading: collectionLoading } =
    useQuery<Collection | null>({
      queryKey: ["collection", collectionId?.toString()],
      queryFn: async () => {
        if (!actor || collectionId == null) return null;
        return actor.getCollection(collectionId);
      },
      enabled: !!actor && !isFetching && collectionId != null,
    });

  const { data: importMetas = [] } = useQuery({
    queryKey: ["collectionImportMetas", "nft-detail"],
    queryFn: async () => {
      if (!actor) return [];
      const page = await actor.listCollectionImportMetasPage(null, 100n);
      return page.metas;
    },
    enabled: !!actor && !isFetching,
  });

  const importMetaMap = collectionMetaMap(importMetas);
  const trustStatus = collection
    ? collectionTrustStatus(
        collection,
        importMetaMap.get(collection.id.toString()),
      )
    : null;

  const { data: nft, isLoading: nftLoading } = useQuery<WalletNFT | null>({
    queryKey: ["collectionNFT", collectionId?.toString(), tokenId],
    queryFn: async () => {
      if (!actor || collectionId == null || !tokenId) return null;
      return actor.getCollectionNFT(collectionId, tokenId);
    },
    enabled: !!actor && !isFetching && collectionId != null && !!tokenId,
  });

  const { data: activeListing } = useQuery<ActiveListingDetail | null>({
    queryKey: ["nftActiveListing", collectionId?.toString(), tokenId],
    queryFn: async () => {
      if (!actor || collectionId == null || !tokenId) return null;
      const details = await actor.getActiveListingDetails();
      return (
        details.find(
          (detail) =>
            detail.nft.collectionId === collectionId &&
            detail.nft.tokenId === tokenId,
        ) ?? null
      );
    },
    enabled: !!actor && !isFetching && collectionId != null && !!tokenId,
  });

  const isLoading = collectionLoading || nftLoading;
  const shareUrl =
    collectionId != null && tokenId ? nftShareUrl(collectionId, tokenId) : "";

  const pageMeta = useMemo(() => {
    if (!collection || !nft || collectionId == null || !tokenId) {
      return {};
    }
    const name = getNFTDisplayName(nft, collection);
    return {
      title: `${name} — Mintlab`,
      description: nft.metadata.description?.trim() || `${name} on Mintlab.`,
      image: resolveImageUrl(nft.metadata.imageUrl, {
        canisterId: collection.canisterId.toString(),
        tokenId: nft.tokenId,
      }),
      url: appPageUrl(nftSharePath(collectionId, tokenId)),
    };
  }, [collection, collectionId, nft, tokenId]);
  usePageMeta(pageMeta);

  if (collectionId == null || !tokenId) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <EmptyState
          icon={ImageOff}
          title="Invalid NFT link"
          description="This URL is missing a valid collection ID or token ID."
          action={{
            label: "Browse marketplace",
            onClick: () => void navigate({ to: "/marketplace" }),
          }}
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <LoadingSpinner size="lg" label="Loading NFT…" />
      </div>
    );
  }

  if (!collection || !nft) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <EmptyState
          icon={ImageOff}
          title="NFT not found"
          description="Mintlab could not load this NFT from the shared collection directory."
          action={{
            label: "Browse collections",
            onClick: () => void navigate({ to: "/collections" }),
          }}
        />
      </div>
    );
  }

  const nftName = getNFTDisplayName(nft, collection);
  const visibleAttributes = getNFTVisibleAttributes(nft.metadata);
  const canisterId = collection.canisterId.toString();
  const canisterUrl = `https://dashboard.internetcomputer.org/canister/${canisterId}`;
  const listingId =
    activeListing?.listing.__kind__ === "Fixed"
      ? activeListing.listing.Fixed.id
      : activeListing?.listing.__kind__ === "Auction"
        ? activeListing.listing.Auction.id
        : null;

  return (
    <div className="min-h-screen bg-background" data-ocid="nft_detail.page">
      <div className="border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2"
            onClick={() =>
              window.history.length > 1
                ? window.history.back()
                : void navigate({ to: "/collections" })
            }
            data-ocid="nft_detail.back_button"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <ShareLinkButton url={shareUrl} data-ocid="nft_detail.share_button" />
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,420px)] lg:px-8">
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="aspect-square bg-muted">
            <ZoomableMediaImage
              src={nft.metadata.imageUrl}
              alt={nftName}
              assetCanisterId={canisterId}
              tokenId={nft.tokenId}
              viewerTitle={nftName}
              buttonClassName="h-full w-full"
              className="h-full w-full object-contain"
              dataOcid="nft_detail.image_zoom_button"
              fallback={<NFTImagePlaceholder name={nftName} />}
            />
          </div>
        </div>

        <div className="space-y-5">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <CollectionBadge
                collection={collection}
                trustStatus={trustStatus}
                size="sm"
              />
              <Badge
                variant="secondary"
                className={`border text-xs ${nftCustodyClass(nft.location)}`}
              >
                {nftCustodyLabel(nft.location)}
              </Badge>
              {activeListing && (
                <Badge className="border-0 bg-accent/15 text-accent">
                  Listed
                </Badge>
              )}
            </div>
            <h1 className="font-display text-3xl font-bold text-foreground">
              {nftName}
            </h1>
            <p className="font-mono text-sm text-muted-foreground">
              {getNFTTokenLabel(nft, collection)}
            </p>
            <p className="font-mono text-xs text-muted-foreground">
              Display token ID: {getNFTDisplayTokenId(nft, collection)}
            </p>
          </div>

          {nft.metadata.description && (
            <p className="text-sm leading-relaxed text-muted-foreground">
              {nft.metadata.description}
            </p>
          )}

          <div className="rounded-lg border border-border/60 bg-muted/25 p-3">
            <p className="text-xs font-semibold text-foreground">
              {nftCustodyLabel(nft.location)}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              {nftCustodyDescription(nft, collection)}
            </p>
          </div>

          {activeListing && listingId != null && (
            <div className="rounded-lg border border-accent/30 bg-accent/5 p-4 space-y-3">
              <div className="flex items-center gap-2">
                {activeListing.listing.__kind__ === "Auction" ? (
                  <Gavel className="h-4 w-4 text-accent" />
                ) : (
                  <ShoppingBag className="h-4 w-4 text-accent" />
                )}
                <p className="text-sm font-semibold text-foreground">
                  {activeListing.listing.__kind__ === "Auction"
                    ? "Active auction"
                    : "Active fixed listing"}
                </p>
              </div>
              <Button
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                onClick={() =>
                  void navigate({
                    to: "/marketplace/listing/$listingId",
                    params: { listingId: listingId.toString() },
                  })
                }
                data-ocid="nft_detail.view_listing_button"
              >
                View marketplace listing
              </Button>
            </div>
          )}

          {visibleAttributes.length > 0 && (
            <div className="rounded-lg border border-border bg-card p-4">
              <h2 className="mb-3 text-sm font-semibold text-foreground">
                Attributes
              </h2>
              <div className="grid grid-cols-2 gap-2">
                {visibleAttributes.map(([key, value]) => (
                  <div
                    key={`${key}:${value}`}
                    className="rounded-md border border-border/50 bg-muted/30 px-3 py-2"
                  >
                    <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                      {key}
                    </p>
                    <p className="mt-0.5 text-sm font-medium text-foreground">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid gap-2 text-sm">
            <div className="rounded-lg border border-border/50 bg-muted/35 px-3 py-2">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Collection canister
              </p>
              <a
                href={canisterUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-0.5 inline-flex items-center gap-1 font-mono text-sm text-accent hover:underline"
              >
                {canisterId}
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
            <div className="rounded-lg border border-border/50 bg-muted/35 px-3 py-2">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Owner
              </p>
              <p className="mt-0.5 truncate font-mono text-sm text-foreground">
                {nft.owner.toString()}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link to="/collections">
              <Button variant="outline" size="sm">
                Browse collections
              </Button>
            </Link>
            <Link to="/marketplace">
              <Button variant="outline" size="sm">
                Marketplace
              </Button>
            </Link>
            {listingId != null && (
              <Link
                to="/marketplace/listing/$listingId"
                params={{ listingId: listingId.toString() }}
              >
                <Button size="sm" className="bg-accent text-accent-foreground">
                  Open listing
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
