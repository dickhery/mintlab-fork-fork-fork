import { AppCanisterTopUpDialog } from "@/components/AppCanisterTopUpDialog";
import { EmptyState } from "@/components/EmptyState";
import { HelpCallout } from "@/components/HelpCallout";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { MediaImage } from "@/components/MediaImage";
import { TermsAgreementNotice } from "@/components/TermsAcceptance";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { useBackend } from "@/hooks/use-backend";
import { isLowCyclesError } from "@/lib/cycles";
import { getNFTDisplayName, getNFTTokenLabel } from "@/lib/nft-display";
import type { ActiveListingDetail, NFTDividend, WalletNFT } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CircleDollarSign,
  Coins,
  ImageOff,
  LoaderCircle,
  LogIn,
  RefreshCw,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

const E8S = 100_000_000n;
const ICP_FEE = 10_000n;
const DIVIDEND_PAGE_SIZE = 50n;
const DIVIDEND_MEDIA_PAGE_SIZE = 50n;

function formatICP(e8s: bigint): string {
  const whole = e8s / E8S;
  const fraction = (e8s % E8S).toString().padStart(8, "0").replace(/0+$/, "");
  return fraction ? `${whole}.${fraction}` : whole.toString();
}

function extractError(err: unknown): string {
  if (err instanceof Error) return err.message || "Something went wrong";
  if (typeof err === "string") return err;
  return "Something went wrong";
}

function dividendKey(item: NFTDividend): string {
  return `${item.nft.collectionId.toString()}:${item.nft.tokenId}`;
}

function activeListingSeller(detail: ActiveListingDetail): string {
  return detail.listing.__kind__ === "Fixed"
    ? detail.listing.Fixed.seller.toString()
    : detail.listing.Auction.seller.toString();
}

interface DividendStatCardProps {
  label: string;
  value: string;
  valueClassName?: string;
  isLoading: boolean;
}

function DividendStatCard({
  label,
  value,
  valueClassName = "text-foreground",
  isLoading,
}: DividendStatCardProps) {
  return (
    <Card className="border-border bg-card">
      <CardContent className="p-4">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        {isLoading ? (
          <Skeleton className="mt-3 h-8 w-28 bg-muted" />
        ) : (
          <p className={`font-mono text-2xl font-bold mt-1 ${valueClassName}`}>
            {value}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function DividendLoadingState() {
  return (
    <div
      className="space-y-4"
      aria-live="polite"
      data-ocid="dividends.loading_state"
    >
      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="shrink-0">
            <LoadingSpinner size="lg" />
          </div>
          <div className="space-y-2">
            <h2 className="font-display text-lg font-semibold text-foreground">
              Loading your dividend-eligible NFTs
            </h2>
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Mintlab is checking your wallet, dividend balances, listings, and
              the current ICP fee. This can take up to a minute for wallets with
              multiple NFTs or imported collections.
            </p>
            <p className="text-xs font-medium text-emerald-700">
              Nothing is wrong; keep this page open while the information
              finishes loading.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {[0, 1, 2, 3].map((item) => (
          <Card
            key={item}
            className="border-border bg-card overflow-hidden"
            data-ocid={`dividends.loading_card.${item + 1}`}
          >
            <CardContent className="p-0 flex min-h-36">
              <Skeleton className="w-32 sm:w-40 shrink-0 rounded-none bg-muted" />
              <div className="flex flex-1 flex-col gap-3 p-4">
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-6 w-24 bg-muted" />
                  <Skeleton className="h-6 w-14 bg-muted" />
                </div>
                <Skeleton className="h-5 w-44 max-w-full bg-muted" />
                <Skeleton className="h-4 w-32 max-w-full bg-muted" />
                <Skeleton className="mt-auto h-9 w-28 bg-muted" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function DividendsPage() {
  const { actor, isFetching } = useBackend();
  const { principal, isAuthenticated, principalText, login } = useAuth();
  const queryClient = useQueryClient();
  const [cycleRetry, setCycleRetry] = useState<
    | { kind: "sync"; reason: string }
    | { kind: "claim"; reason: string; item: NFTDividend }
    | null
  >(null);

  const {
    data: dividends = [],
    error: dividendsError,
    isError: dividendsFailed,
    isLoading: dividendsLoading,
    refetch,
  } = useQuery<NFTDividend[]>({
    queryKey: ["myDividendNFTs", principalText],
    queryFn: async () => {
      if (!actor) return [];
      const page = await actor.getMyDividendNFTsPage(null, DIVIDEND_PAGE_SIZE);
      return page.dividends;
    },
    enabled: !!actor && !isFetching && isAuthenticated,
    refetchOnWindowFocus: false,
    staleTime: 300_000,
  });

  const { data: mediaNFTs = [] } = useQuery<WalletNFT[]>({
    queryKey: ["userNFTs", principalText],
    queryFn: async () => {
      if (!actor || !principal) return [];
      const page = await actor.getUserNFTsPage(
        principal,
        null,
        DIVIDEND_MEDIA_PAGE_SIZE,
      );
      return page.nfts;
    },
    enabled: !!actor && !isFetching && isAuthenticated && !!principal,
    refetchOnWindowFocus: false,
    staleTime: 300_000,
  });

  const {
    data: listedDividendKeys = [],
    isLoading: listedDividendKeysLoading,
  } = useQuery<string[]>({
    queryKey: ["myListedDividendNFTs", principalText],
    queryFn: async () => {
      if (!actor || !principalText) return [];
      const details = await actor.getActiveListingDetails();
      return details
        .filter((detail) => activeListingSeller(detail) === principalText)
        .map(
          (detail) =>
            `${detail.nft.collectionId.toString()}:${detail.nft.tokenId}`,
        );
    },
    enabled: !!actor && !isFetching && isAuthenticated && !!principalText,
    refetchOnWindowFocus: false,
    staleTime: 300_000,
  });

  const { data: marketplaceFeeConfig, isLoading: marketplaceFeeConfigLoading } =
    useQuery({
      queryKey: ["marketplaceFeeConfig"],
      queryFn: async () => {
        if (!actor) return null;
        return actor.getMarketplaceFeeConfig();
      },
      enabled: !!actor && !isFetching && isAuthenticated,
      refetchOnWindowFocus: false,
      staleTime: 3_600_000,
    });

  const claimMutation = useMutation({
    mutationFn: async (item: NFTDividend) => {
      if (!actor) throw new Error("Backend not connected");
      const result = await actor.claimNFTDividend(item.nft.id);
      if (result.__kind__ === "err") {
        throw new Error(result.err);
      }
      return result.ok;
    },
    onSuccess: (receipt) => {
      toast.success(`Collected ${formatICP(receipt.paidE8s)} ICP`, {
        description: `Confirmed at block ${receipt.blockIndex.toString()}`,
      });
      void queryClient.invalidateQueries({ queryKey: ["myDividendNFTs"] });
      void queryClient.invalidateQueries({
        queryKey: ["collectionDividendBalances"],
      });
      void queryClient.invalidateQueries({
        queryKey: ["collectionDividendInfo"],
      });
      void queryClient.invalidateQueries({
        queryKey: ["marketplaceDividendBalances"],
      });
      void queryClient.invalidateQueries({ queryKey: ["icp-balance"] });
      void queryClient.invalidateQueries({ queryKey: ["userNFTs"] });
    },
    onError: (err: unknown, item) => {
      const message = extractError(err);
      if (isLowCyclesError(message)) {
        setCycleRetry({ kind: "claim", reason: message, item });
        return;
      }
      toast.error(message);
    },
  });

  const syncMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Backend not connected");
      const collectionIds = Array.from(
        new Set(dividends.map((item) => item.collection.id.toString())),
      );
      let distributed = 0n;
      for (const collectionId of collectionIds) {
        const result = await actor.syncCollectionDividends(
          BigInt(collectionId),
        );
        if (result.__kind__ === "ok") {
          distributed += result.ok.distributedE8s;
        }
      }
      return distributed;
    },
    onSuccess: (distributed) => {
      toast.success(
        distributed > 0n
          ? `Distributed ${formatICP(distributed)} ICP`
          : "No new deposits to distribute",
      );
      void refetch();
      void queryClient.invalidateQueries({ queryKey: ["myDividendNFTs"] });
      void queryClient.invalidateQueries({
        queryKey: ["collectionDividendBalances"],
      });
      void queryClient.invalidateQueries({
        queryKey: ["collectionDividendInfo"],
      });
      void queryClient.invalidateQueries({
        queryKey: ["marketplaceDividendBalances"],
      });
      void queryClient.invalidateQueries({ queryKey: ["userNFTs"] });
    },
    onError: (err: unknown) => {
      const message = extractError(err);
      if (isLowCyclesError(message)) {
        setCycleRetry({ kind: "sync", reason: message });
        return;
      }
      toast.error(message);
    },
  });

  const mediaByDividendKey = useMemo(() => {
    return new Map(
      mediaNFTs.map((nft) => [
        `${nft.collectionId.toString()}:${nft.tokenId}`,
        nft,
      ]),
    );
  }, [mediaNFTs]);

  const listedDividendKeySet = useMemo(
    () => new Set(listedDividendKeys),
    [listedDividendKeys],
  );
  const dividendLedgerFee = marketplaceFeeConfig?.ledgerFeeE8s ?? ICP_FEE;
  const actorLoading =
    isAuthenticated && (isFetching || !actor || !principalText);
  const dividendDecisionDataLoading =
    dividends.length > 0 &&
    (listedDividendKeysLoading || marketplaceFeeConfigLoading);
  const dividendInfoLoading =
    actorLoading || dividendsLoading || dividendDecisionDataLoading;

  if (!isAuthenticated) {
    return (
      <div
        className="flex-1 flex flex-col items-center justify-center min-h-[70vh] gap-6 px-4"
        data-ocid="dividends.page"
      >
        <div className="rounded-2xl bg-card border border-border/50 shadow-lg p-10 flex flex-col items-center gap-5 max-w-sm w-full">
          <div className="rounded-full bg-emerald-500/15 border border-emerald-500/30 p-4">
            <CircleDollarSign className="h-8 w-8 text-emerald-600" />
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-xl font-display font-semibold text-foreground">
              Connect to view dividends
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Sign in to see ICP rewards attached to NFTs you own.
            </p>
          </div>
          <Button className="w-full gap-2" onClick={login}>
            <LogIn className="h-4 w-4" />
            Sign in with Internet Identity
          </Button>
        </div>
      </div>
    );
  }

  const totalClaimable = dividends.reduce(
    (sum, item) =>
      listedDividendKeySet.has(dividendKey(item))
        ? sum
        : sum + item.claimableE8s,
    0n,
  );
  const claimableItems = dividends.filter(
    (item) =>
      item.claimableE8s > dividendLedgerFee &&
      !listedDividendKeySet.has(dividendKey(item)),
  );
  const belowFeeItems = dividends.filter(
    (item) =>
      item.claimableE8s > 0n &&
      item.claimableE8s <= dividendLedgerFee &&
      !listedDividendKeySet.has(dividendKey(item)),
  );

  return (
    <>
      <div
        className="px-4 md:px-8 py-8 space-y-6 max-w-6xl mx-auto"
        data-ocid="dividends.page"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-mono">
              NFT Rewards
            </p>
            <h1 className="font-display font-bold text-2xl md:text-3xl text-foreground">
              Dividends
            </h1>
            <p className="text-sm text-muted-foreground">
              Collect ICP that has been assigned to NFTs you currently hold.
            </p>
          </div>
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => syncMutation.mutate()}
            disabled={
              syncMutation.isPending ||
              dividendInfoLoading ||
              dividends.length === 0
            }
            data-ocid="dividends.sync_button"
          >
            {syncMutation.isPending ? (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Check Deposits
          </Button>
        </div>

        <HelpCallout
          title="This is where dividend ICP is collected"
          sectionId="dividends"
          actionLabel="Dividend guide"
          ocid="dividends.help_callout"
        >
          Dividend-enabled collection deposits are checked here, then claimable
          ICP can be collected from the NFTs you currently hold. The ICP ledger
          fee is deducted from each collection, so an NFT must have more than{" "}
          {formatICP(dividendLedgerFee)} ICP before collection is available.
        </HelpCallout>

        <TermsAgreementNotice actionLabel="checking deposits or collecting dividend ICP" />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <DividendStatCard
            label="Claimable"
            value={`${formatICP(totalClaimable)} ICP`}
            valueClassName="text-emerald-600"
            isLoading={dividendInfoLoading}
          />
          <DividendStatCard
            label="Eligible NFTs"
            value={dividends.length.toString()}
            isLoading={dividendInfoLoading}
          />
          <DividendStatCard
            label="Ready To Collect"
            value={claimableItems.length.toString()}
            isLoading={dividendInfoLoading}
          />
        </div>

        {!dividendInfoLoading && belowFeeItems.length > 0 && (
          <div
            className="rounded-xl border border-amber-500/25 bg-amber-500/10 px-4 py-3 text-sm text-amber-800"
            data-ocid="dividends.below_fee_notice"
          >
            {belowFeeItems.length} dividend{" "}
            {belowFeeItems.length === 1 ? "balance is" : "balances are"} below
            the current ICP transfer fee of {formatICP(dividendLedgerFee)} ICP.
            They remain attached to the NFT and can be collected once the
            balance grows above that fee.
          </div>
        )}

        {dividendInfoLoading ? (
          <DividendLoadingState />
        ) : dividendsFailed ? (
          <EmptyState
            icon={CircleDollarSign}
            title="Dividend NFTs could not load"
            description={extractError(dividendsError)}
            action={{
              label: "Try again",
              onClick: () => {
                void refetch();
              },
              "data-ocid": "dividends.retry_button",
            }}
            data-ocid="dividends.error_state"
          />
        ) : dividends.length === 0 ? (
          <EmptyState
            icon={Coins}
            title="No dividend-enabled NFTs"
            description="Create or hold NFTs from collections that enabled dividends to collect rewards here."
            data-ocid="dividends.empty_state"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {dividends.map((item, index) => {
              const hydratedNFT = mediaByDividendKey.get(dividendKey(item));
              const nftName = getNFTDisplayName(
                hydratedNFT ?? item.nft,
                item.collection,
              );
              const imageSrc =
                item.nft.metadata.imageUrl ?? hydratedNFT?.metadata.imageUrl;
              const isListed = listedDividendKeySet.has(dividendKey(item));
              const canClaim =
                !isListed && item.claimableE8s > dividendLedgerFee;
              const isClaiming =
                claimMutation.isPending &&
                claimMutation.variables != null &&
                dividendKey(claimMutation.variables) === dividendKey(item);

              return (
                <Card
                  key={`${dividendKey(item)}-${index}`}
                  className="border-border bg-card overflow-hidden"
                  data-ocid={`dividends.item.${index + 1}`}
                >
                  <CardContent className="p-0 flex min-h-36">
                    <div className="w-32 sm:w-40 bg-muted shrink-0 flex items-center justify-center">
                      <MediaImage
                        src={imageSrc}
                        alt={nftName}
                        assetCanisterId={item.collection.canisterId.toString()}
                        tokenId={item.nft.tokenId}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        fallback={
                          <ImageOff className="w-8 h-8 text-muted-foreground/35" />
                        }
                      />
                    </div>
                    <div className="p-4 flex-1 min-w-0 flex flex-col gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge className="bg-emerald-500/10 text-emerald-700 border border-emerald-500/20">
                            {formatICP(item.claimableE8s)} ICP
                          </Badge>
                          <Badge
                            variant="secondary"
                            className="font-mono text-xs bg-muted/60 text-muted-foreground border border-border/40"
                          >
                            {getNFTTokenLabel(item.nft, item.collection)}
                          </Badge>
                        </div>
                        <h2 className="font-display font-semibold text-foreground truncate mt-2">
                          {nftName}
                        </h2>
                        <p className="text-sm text-muted-foreground truncate">
                          {item.collection.name}
                        </p>
                        {isListed && (
                          <p className="text-xs text-amber-700 mt-2 leading-relaxed">
                            Listed on the marketplace. Dividends stay attached
                            until the listing sells, settles, or is canceled.
                          </p>
                        )}
                        {!isListed &&
                          item.claimableE8s > 0n &&
                          item.claimableE8s <= dividendLedgerFee && (
                            <p className="text-xs text-amber-700 mt-2 leading-relaxed">
                              Below the current ICP transfer fee of{" "}
                              {formatICP(dividendLedgerFee)} ICP. This balance
                              stays attached to the NFT until more dividends
                              accrue.
                            </p>
                          )}
                      </div>
                      <Button
                        className="mt-auto gap-2 self-start"
                        disabled={!canClaim || isClaiming}
                        onClick={() => claimMutation.mutate(item)}
                        data-ocid={`dividends.claim_button.${index + 1}`}
                      >
                        {isClaiming ? (
                          <LoaderCircle className="h-4 w-4 animate-spin" />
                        ) : (
                          <Coins className="h-4 w-4" />
                        )}
                        {isListed
                          ? "Listed"
                          : canClaim
                            ? "Collect ICP"
                            : "Below Fee"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
      <AppCanisterTopUpDialog
        open={cycleRetry != null}
        reason={cycleRetry?.reason ?? null}
        onOpenChange={(open) => {
          if (!open) setCycleRetry(null);
        }}
        onSuccess={() => {
          const retry = cycleRetry;
          setCycleRetry(null);
          if (retry?.kind === "sync") {
            syncMutation.mutate();
          } else if (retry?.kind === "claim") {
            claimMutation.mutate(retry.item);
          }
        }}
      />
    </>
  );
}
