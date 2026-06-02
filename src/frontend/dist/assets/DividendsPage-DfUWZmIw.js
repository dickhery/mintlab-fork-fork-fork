import { h as useBackend, g as useAuth, k as useQueryClient, r as reactExports, l as useQuery, j as jsxRuntimeExports, K as CircleDollarSign, B as Button, L as LogIn, T as TermsAgreementNotice, n as ue, s as LoadingSpinner } from "./index-CvyJDpcy.js";
import { L as LoaderCircle, A as AppCanisterTopUpDialog, i as isLowCyclesError } from "./AppCanisterTopUpDialog-BHs7QdLP.js";
import { E as EmptyState, C as Coins, g as getNFTDisplayName, M as MediaImage, a as getNFTTokenLabel } from "./nft-display-CLRKuyy_.js";
import { H as HelpCallout } from "./HelpCallout-dyygj8-V.js";
import { B as Badge } from "./badge-m40NpXBf.js";
import { C as Card, c as CardContent, S as Skeleton } from "./skeleton-DFnziQrB.js";
import { a as useMutation, R as RefreshCw } from "./index-BeWj3TLq.js";
import { I as ImageOff } from "./media-BcuyCiTh.js";
import "./input-D2IB0C9P.js";
import "./arrow-right-DCj7kAkZ.js";
const E8S = 100000000n;
const ICP_FEE = 10000n;
const DIVIDEND_PAGE_SIZE = 50n;
const DIVIDEND_MEDIA_PAGE_SIZE = 50n;
function formatICP(e8s) {
  const whole = e8s / E8S;
  const fraction = (e8s % E8S).toString().padStart(8, "0").replace(/0+$/, "");
  return fraction ? `${whole}.${fraction}` : whole.toString();
}
function extractError(err) {
  if (err instanceof Error) return err.message || "Something went wrong";
  if (typeof err === "string") return err;
  return "Something went wrong";
}
function dividendKey(item) {
  return `${item.nft.collectionId.toString()}:${item.nft.tokenId}`;
}
function activeListingSeller(detail) {
  return detail.listing.__kind__ === "Fixed" ? detail.listing.Fixed.seller.toString() : detail.listing.Auction.seller.toString();
}
function DividendStatCard({
  label,
  value,
  valueClassName = "text-foreground",
  isLoading
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-border bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-wider text-muted-foreground", children: label }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "mt-3 h-8 w-28 bg-muted" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `font-mono text-2xl font-bold mt-1 ${valueClassName}`, children: value })
  ] }) });
}
function DividendLoadingState() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "space-y-4",
      "aria-live": "polite",
      "data-ocid": "dividends.loading_state",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-5 sm:p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4 sm:flex-row sm:items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, { size: "lg" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-lg font-semibold text-foreground", children: "Loading your dividend-eligible NFTs" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "max-w-2xl text-sm leading-relaxed text-muted-foreground", children: "Mintlab is checking your wallet, dividend balances, listings, and the current ICP fee. This can take up to a minute for wallets with multiple NFTs or imported collections." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-emerald-700", children: "Nothing is wrong; keep this page open while the information finishes loading." })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-3 md:grid-cols-2", children: [0, 1, 2, 3].map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          Card,
          {
            className: "border-border bg-card overflow-hidden",
            "data-ocid": `dividends.loading_card.${item + 1}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-0 flex min-h-36", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-32 sm:w-40 shrink-0 rounded-none bg-muted" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 flex-col gap-3 p-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-24 bg-muted" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-14 bg-muted" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-44 max-w-full bg-muted" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-32 max-w-full bg-muted" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "mt-auto h-9 w-28 bg-muted" })
              ] })
            ] })
          },
          item
        )) })
      ]
    }
  );
}
function DividendsPage() {
  const { actor, isFetching } = useBackend();
  const { principal, isAuthenticated, principalText, login } = useAuth();
  const queryClient = useQueryClient();
  const [cycleRetry, setCycleRetry] = reactExports.useState(null);
  const {
    data: dividends = [],
    error: dividendsError,
    isError: dividendsFailed,
    isLoading: dividendsLoading,
    refetch
  } = useQuery({
    queryKey: ["myDividendNFTs", principalText],
    queryFn: async () => {
      if (!actor) return [];
      const page = await actor.getMyDividendNFTsPage(null, DIVIDEND_PAGE_SIZE);
      return page.dividends;
    },
    enabled: !!actor && !isFetching && isAuthenticated,
    refetchOnWindowFocus: false,
    staleTime: 6e4
  });
  const { data: mediaNFTs = [] } = useQuery({
    queryKey: ["userNFTs", principalText],
    queryFn: async () => {
      if (!actor || !principal) return [];
      const page = await actor.getUserNFTsPage(
        principal,
        null,
        DIVIDEND_MEDIA_PAGE_SIZE
      );
      return page.nfts;
    },
    enabled: !!actor && !isFetching && isAuthenticated && !!principal,
    refetchOnWindowFocus: false,
    staleTime: 6e4
  });
  const {
    data: listedDividendKeys = [],
    isLoading: listedDividendKeysLoading
  } = useQuery({
    queryKey: ["myListedDividendNFTs", principalText],
    queryFn: async () => {
      if (!actor || !principalText) return [];
      const details = await actor.getActiveListingDetails();
      return details.filter((detail) => activeListingSeller(detail) === principalText).map(
        (detail) => `${detail.nft.collectionId.toString()}:${detail.nft.tokenId}`
      );
    },
    enabled: !!actor && !isFetching && isAuthenticated && !!principalText,
    refetchOnWindowFocus: false,
    staleTime: 3e4
  });
  const { data: marketplaceFeeConfig, isLoading: marketplaceFeeConfigLoading } = useQuery({
    queryKey: ["marketplaceFeeConfig"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMarketplaceFeeConfig();
    },
    enabled: !!actor && !isFetching && isAuthenticated,
    refetchOnWindowFocus: false,
    staleTime: 6e4
  });
  const claimMutation = useMutation({
    mutationFn: async (item) => {
      if (!actor) throw new Error("Backend not connected");
      const result = await actor.claimNFTDividend(item.nft.id);
      if (result.__kind__ === "err") {
        throw new Error(result.err);
      }
      return result.ok;
    },
    onSuccess: (receipt) => {
      ue.success(`Collected ${formatICP(receipt.paidE8s)} ICP`, {
        description: `Confirmed at block ${receipt.blockIndex.toString()}`
      });
      void queryClient.invalidateQueries({ queryKey: ["myDividendNFTs"] });
      void queryClient.invalidateQueries({
        queryKey: ["collectionDividendBalances"]
      });
      void queryClient.invalidateQueries({
        queryKey: ["collectionDividendInfo"]
      });
      void queryClient.invalidateQueries({
        queryKey: ["marketplaceDividendBalances"]
      });
      void queryClient.invalidateQueries({ queryKey: ["icp-balance"] });
      void queryClient.invalidateQueries({ queryKey: ["userNFTs"] });
    },
    onError: (err, item) => {
      const message = extractError(err);
      if (isLowCyclesError(message)) {
        setCycleRetry({ kind: "claim", reason: message, item });
        return;
      }
      ue.error(message);
    }
  });
  const syncMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Backend not connected");
      const collectionIds = Array.from(
        new Set(dividends.map((item) => item.collection.id.toString()))
      );
      let distributed = 0n;
      for (const collectionId of collectionIds) {
        const result = await actor.syncCollectionDividends(
          BigInt(collectionId)
        );
        if (result.__kind__ === "ok") {
          distributed += result.ok.distributedE8s;
        }
      }
      return distributed;
    },
    onSuccess: (distributed) => {
      ue.success(
        distributed > 0n ? `Distributed ${formatICP(distributed)} ICP` : "No new deposits to distribute"
      );
      void refetch();
      void queryClient.invalidateQueries({ queryKey: ["myDividendNFTs"] });
      void queryClient.invalidateQueries({
        queryKey: ["collectionDividendBalances"]
      });
      void queryClient.invalidateQueries({
        queryKey: ["collectionDividendInfo"]
      });
      void queryClient.invalidateQueries({
        queryKey: ["marketplaceDividendBalances"]
      });
      void queryClient.invalidateQueries({ queryKey: ["userNFTs"] });
    },
    onError: (err) => {
      const message = extractError(err);
      if (isLowCyclesError(message)) {
        setCycleRetry({ kind: "sync", reason: message });
        return;
      }
      ue.error(message);
    }
  });
  const mediaByDividendKey = reactExports.useMemo(() => {
    return new Map(
      mediaNFTs.map((nft) => [
        `${nft.collectionId.toString()}:${nft.tokenId}`,
        nft
      ])
    );
  }, [mediaNFTs]);
  const listedDividendKeySet = reactExports.useMemo(
    () => new Set(listedDividendKeys),
    [listedDividendKeys]
  );
  const dividendLedgerFee = (marketplaceFeeConfig == null ? void 0 : marketplaceFeeConfig.ledgerFeeE8s) ?? ICP_FEE;
  const actorLoading = isAuthenticated && (isFetching || !actor || !principalText);
  const dividendDecisionDataLoading = dividends.length > 0 && (listedDividendKeysLoading || marketplaceFeeConfigLoading);
  const dividendInfoLoading = actorLoading || dividendsLoading || dividendDecisionDataLoading;
  if (!isAuthenticated) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex-1 flex flex-col items-center justify-center min-h-[70vh] gap-6 px-4",
        "data-ocid": "dividends.page",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl bg-card border border-border/50 shadow-lg p-10 flex flex-col items-center gap-5 max-w-sm w-full", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-full bg-emerald-500/15 border border-emerald-500/30 p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleDollarSign, { className: "h-8 w-8 text-emerald-600" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-display font-semibold text-foreground", children: "Connect to view dividends" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground leading-relaxed", children: "Sign in to see ICP rewards attached to NFTs you own." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { className: "w-full gap-2", onClick: login, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LogIn, { className: "h-4 w-4" }),
            "Sign in with Internet Identity"
          ] })
        ] })
      }
    );
  }
  const totalClaimable = dividends.reduce(
    (sum, item) => listedDividendKeySet.has(dividendKey(item)) ? sum : sum + item.claimableE8s,
    0n
  );
  const claimableItems = dividends.filter(
    (item) => item.claimableE8s > dividendLedgerFee && !listedDividendKeySet.has(dividendKey(item))
  );
  const belowFeeItems = dividends.filter(
    (item) => item.claimableE8s > 0n && item.claimableE8s <= dividendLedgerFee && !listedDividendKeySet.has(dividendKey(item))
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "px-4 md:px-8 py-8 space-y-6 max-w-6xl mx-auto",
        "data-ocid": "dividends.page",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-widest text-muted-foreground font-mono", children: "NFT Rewards" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-bold text-2xl md:text-3xl text-foreground", children: "Dividends" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Collect ICP that has been assigned to NFTs you currently hold." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "outline",
                className: "gap-2",
                onClick: () => syncMutation.mutate(),
                disabled: syncMutation.isPending || dividendInfoLoading || dividends.length === 0,
                "data-ocid": "dividends.sync_button",
                children: [
                  syncMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-4 w-4" }),
                  "Check Deposits"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            HelpCallout,
            {
              title: "This is where dividend ICP is collected",
              sectionId: "dividends",
              actionLabel: "Dividend guide",
              ocid: "dividends.help_callout",
              children: [
                "Dividend-enabled collection deposits are checked here, then claimable ICP can be collected from the NFTs you currently hold. The ICP ledger fee is deducted from each collection, so an NFT must have more than",
                " ",
                formatICP(dividendLedgerFee),
                " ICP before collection is available."
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TermsAgreementNotice, { actionLabel: "checking deposits or collecting dividend ICP" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              DividendStatCard,
              {
                label: "Claimable",
                value: `${formatICP(totalClaimable)} ICP`,
                valueClassName: "text-emerald-600",
                isLoading: dividendInfoLoading
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              DividendStatCard,
              {
                label: "Eligible NFTs",
                value: dividends.length.toString(),
                isLoading: dividendInfoLoading
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              DividendStatCard,
              {
                label: "Ready To Collect",
                value: claimableItems.length.toString(),
                isLoading: dividendInfoLoading
              }
            )
          ] }),
          !dividendInfoLoading && belowFeeItems.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "rounded-xl border border-amber-500/25 bg-amber-500/10 px-4 py-3 text-sm text-amber-800",
              "data-ocid": "dividends.below_fee_notice",
              children: [
                belowFeeItems.length,
                " dividend",
                " ",
                belowFeeItems.length === 1 ? "balance is" : "balances are",
                " below the current ICP transfer fee of ",
                formatICP(dividendLedgerFee),
                " ICP. They remain attached to the NFT and can be collected once the balance grows above that fee."
              ]
            }
          ),
          dividendInfoLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(DividendLoadingState, {}) : dividendsFailed ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            EmptyState,
            {
              icon: CircleDollarSign,
              title: "Dividend NFTs could not load",
              description: extractError(dividendsError),
              action: {
                label: "Try again",
                onClick: () => {
                  void refetch();
                },
                "data-ocid": "dividends.retry_button"
              },
              "data-ocid": "dividends.error_state"
            }
          ) : dividends.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            EmptyState,
            {
              icon: Coins,
              title: "No dividend-enabled NFTs",
              description: "Create or hold NFTs from collections that enabled dividends to collect rewards here.",
              "data-ocid": "dividends.empty_state"
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3", children: dividends.map((item, index) => {
            const hydratedNFT = mediaByDividendKey.get(dividendKey(item));
            const nftName = getNFTDisplayName(
              hydratedNFT ?? item.nft,
              item.collection
            );
            const imageSrc = item.nft.metadata.imageUrl ?? (hydratedNFT == null ? void 0 : hydratedNFT.metadata.imageUrl);
            const isListed = listedDividendKeySet.has(dividendKey(item));
            const canClaim = !isListed && item.claimableE8s > dividendLedgerFee;
            const isClaiming = claimMutation.isPending && claimMutation.variables != null && dividendKey(claimMutation.variables) === dividendKey(item);
            return /* @__PURE__ */ jsxRuntimeExports.jsx(
              Card,
              {
                className: "border-border bg-card overflow-hidden",
                "data-ocid": `dividends.item.${index + 1}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-0 flex min-h-36", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-32 sm:w-40 bg-muted shrink-0 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    MediaImage,
                    {
                      src: imageSrc,
                      alt: nftName,
                      assetCanisterId: item.collection.canisterId.toString(),
                      tokenId: item.nft.tokenId,
                      className: "w-full h-full object-cover",
                      loading: "lazy",
                      fallback: /* @__PURE__ */ jsxRuntimeExports.jsx(ImageOff, { className: "w-8 h-8 text-muted-foreground/35" })
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 flex-1 min-w-0 flex flex-col gap-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-emerald-500/10 text-emerald-700 border border-emerald-500/20", children: [
                          formatICP(item.claimableE8s),
                          " ICP"
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Badge,
                          {
                            variant: "secondary",
                            className: "font-mono text-xs bg-muted/60 text-muted-foreground border border-border/40",
                            children: getNFTTokenLabel(item.nft, item.collection)
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-semibold text-foreground truncate mt-2", children: nftName }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground truncate", children: item.collection.name }),
                      isListed && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-amber-700 mt-2 leading-relaxed", children: "Listed on the marketplace. Dividends stay attached until the listing sells, settles, or is canceled." }),
                      !isListed && item.claimableE8s > 0n && item.claimableE8s <= dividendLedgerFee && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-amber-700 mt-2 leading-relaxed", children: [
                        "Below the current ICP transfer fee of",
                        " ",
                        formatICP(dividendLedgerFee),
                        " ICP. This balance stays attached to the NFT until more dividends accrue."
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Button,
                      {
                        className: "mt-auto gap-2 self-start",
                        disabled: !canClaim || isClaiming,
                        onClick: () => claimMutation.mutate(item),
                        "data-ocid": `dividends.claim_button.${index + 1}`,
                        children: [
                          isClaiming ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Coins, { className: "h-4 w-4" }),
                          isListed ? "Listed" : canClaim ? "Collect ICP" : "Below Fee"
                        ]
                      }
                    )
                  ] })
                ] })
              },
              `${dividendKey(item)}-${index}`
            );
          }) })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      AppCanisterTopUpDialog,
      {
        open: cycleRetry != null,
        reason: (cycleRetry == null ? void 0 : cycleRetry.reason) ?? null,
        onOpenChange: (open) => {
          if (!open) setCycleRetry(null);
        },
        onSuccess: () => {
          const retry = cycleRetry;
          setCycleRetry(null);
          if ((retry == null ? void 0 : retry.kind) === "sync") {
            syncMutation.mutate();
          } else if ((retry == null ? void 0 : retry.kind) === "claim") {
            claimMutation.mutate(retry.item);
          }
        }
      }
    )
  ] });
}
export {
  DividendsPage as default
};
