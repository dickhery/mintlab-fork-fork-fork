import { c as createLucideIcon, j as jsxRuntimeExports, W as Wallet, _ as Zap, a1 as CircleDollarSign, S as ShoppingBag, h as useAuth, i as useBackend, l as useQueryClient, p as useNavigate, y as useSearch, r as reactExports, n as useQuery, aq as filterActivityTransactions, E as LoadingSpinner, H as History, B as Button, ar as ACTIVITY_SCOPE_LABELS, X, q as Link } from "./index-BSFYQ4AG.js";
import { E as EmptyState } from "./EmptyState-DiYXFWvQ.js";
import { H as HelpCallout } from "./HelpCallout-CS4y0xxn.js";
import { I as Input } from "./input-fDzaPwGg.js";
import { S as Select, c as SelectTrigger, d as SelectValue, e as SelectContent, f as SelectItem } from "./select-tnK7eYhZ.js";
import { B as Badge } from "./badge-CG_50zJx.js";
import { f as formatICPAmount } from "./icp-BXjZNIYq.js";
import { L as Layers } from "./layers-Beyav2mK.js";
import { G as Gavel } from "./gavel-03RcJFeV.js";
import { a as ArrowDownLeft, A as ArrowUpRight } from "./arrow-up-right-D_MD0kbg.js";
import { M as Minus } from "./minus-DSClq1fn.js";
import { R as RefreshCw } from "./index-D-TFMYNl.js";
import { S as SlidersHorizontal } from "./sliders-horizontal-Co7bx26b.js";
import { S as Search } from "./search-T1YLmX8p.js";
import "./arrow-right-C7hmEa_q.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", ry: "2", key: "1m3agn" }],
  ["circle", { cx: "9", cy: "9", r: "2", key: "af1f0g" }],
  ["path", { d: "m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21", key: "1xmnt7" }]
];
const Image = createLucideIcon("image", __iconNode);
function formatTransactionTime(timestampNanos) {
  const date = new Date(Number(timestampNanos / 1000000n));
  return new Intl.DateTimeFormat(void 0, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(date);
}
function transactionAmountLabel(tx) {
  if (tx.amountE8s === null) return "";
  const prefix = tx.direction === "In" ? "+" : tx.direction === "Out" ? "-" : "";
  return `${prefix}${formatICPAmount(tx.amountE8s)} ICP`;
}
function transactionKindLabel(kind) {
  switch (kind) {
    case "ICPTransferOut":
      return "ICP transfer";
    case "Mint":
      return "Mint";
    case "CollectionCreation":
      return "Collection creation";
    case "CollectionCanisterTopUp":
      return "Collection top-up";
    case "AppCanisterTopUp":
      return "App top-up";
    case "MarketplacePurchase":
      return "Marketplace purchase";
    case "MarketplaceSale":
      return "Marketplace sale";
    case "AuctionBid":
      return "Auction bid";
    case "AuctionRefund":
      return "Auction refund";
    case "DividendClaim":
      return "Dividend claim";
    default:
      return kind;
  }
}
function transactionStatusTone(status) {
  if (status === "Completed") {
    return "border-emerald-500/30 bg-emerald-500/10 text-emerald-500";
  }
  if (status === "Failed") {
    return "border-destructive/30 bg-destructive/10 text-destructive";
  }
  return "border-amber-500/30 bg-amber-500/10 text-amber-500";
}
function transactionDirectionIcon(tx) {
  switch (tx.kind) {
    case "Mint":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { className: "h-4 w-4 text-accent" });
    case "MarketplacePurchase":
    case "MarketplaceSale":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "h-4 w-4 text-primary" });
    case "AuctionBid":
    case "AuctionRefund":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Gavel, { className: "h-4 w-4 text-accent" });
    case "DividendClaim":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(CircleDollarSign, { className: "h-4 w-4 text-emerald-500" });
    case "CollectionCreation":
    case "CollectionCanisterTopUp":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "h-4 w-4 text-primary" });
    case "AppCanisterTopUp":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-4 w-4 text-accent" });
    case "ICPTransferOut":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "h-4 w-4 text-amber-500" });
  }
  if (tx.direction === "In") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDownLeft, { className: "h-4 w-4 text-emerald-500" });
  }
  if (tx.direction === "Out") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { className: "h-4 w-4 text-amber-500" });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { className: "h-4 w-4 text-muted-foreground" });
}
function transactionAmountTone(direction) {
  if (direction === "In") return "text-emerald-500";
  if (direction === "Out") return "text-foreground";
  return "text-muted-foreground";
}
function TransactionActivityRow({
  tx,
  showKind = true
}) {
  const amount = transactionAmountLabel(tx);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 py-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-muted/40", children: transactionDirectionIcon(tx) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-sm font-medium text-foreground", children: tx.title }),
        showKind && /* @__PURE__ */ jsxRuntimeExports.jsx(
          Badge,
          {
            variant: "secondary",
            className: "shrink-0 px-1.5 py-0 text-[10px] font-normal",
            children: transactionKindLabel(tx.kind)
          }
        ),
        tx.status !== "Completed" && /* @__PURE__ */ jsxRuntimeExports.jsx(
          Badge,
          {
            variant: "outline",
            className: `shrink-0 px-1.5 py-0 text-[10px] ${transactionStatusTone(tx.status)}`,
            children: tx.status
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs leading-relaxed text-muted-foreground", children: tx.detail }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1.5 text-[11px] text-muted-foreground", children: [
        formatTransactionTime(tx.occurredAt),
        tx.blockIndex !== null && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono", children: [
          " ",
          "· block ",
          tx.blockIndex.toString()
        ] })
      ] })
    ] }),
    amount && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "shrink-0 text-right", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "p",
        {
          className: `font-mono text-sm font-semibold ${transactionAmountTone(tx.direction)}`,
          children: amount
        }
      ),
      tx.feeE8s !== null && tx.feeE8s > 0n && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-[11px] text-muted-foreground", children: [
        "fee ",
        formatICPAmount(tx.feeE8s)
      ] })
    ] })
  ] });
}
const ACTIVITY_FETCH_LIMIT = 25n;
function ActivityPage() {
  const { isAuthenticated, isLoading: authLoading, login } = useAuth();
  const { actor, isFetching } = useBackend();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const search = useSearch({ strict: false });
  const [searchQuery, setSearchQuery] = reactExports.useState(search.q ?? "");
  const [scopeFilter, setScopeFilter] = reactExports.useState(
    search.scope ?? "all"
  );
  const [kindFilter, setKindFilter] = reactExports.useState(
    search.kind ?? "all"
  );
  const [statusFilter, setStatusFilter] = reactExports.useState(
    search.status ?? "all"
  );
  const [directionFilter, setDirectionFilter] = reactExports.useState(search.direction ?? "all");
  const searchDebounceRef = reactExports.useRef(null);
  const activitySearch = reactExports.useMemo(
    () => ({
      q: searchQuery.trim() || void 0,
      scope: scopeFilter === "all" ? void 0 : scopeFilter,
      kind: kindFilter === "all" ? void 0 : kindFilter,
      status: statusFilter === "all" ? void 0 : statusFilter,
      direction: directionFilter === "all" ? void 0 : directionFilter
    }),
    [searchQuery, scopeFilter, kindFilter, statusFilter, directionFilter]
  );
  const syncActivityToUrl = reactExports.useCallback(
    (overrides) => {
      void navigate({
        to: "/activity",
        search: { ...activitySearch, ...overrides },
        replace: true
      });
    },
    [activitySearch, navigate]
  );
  reactExports.useEffect(() => {
    setSearchQuery(search.q ?? "");
    setScopeFilter(search.scope ?? "all");
    setKindFilter(search.kind ?? "all");
    setStatusFilter(search.status ?? "all");
    setDirectionFilter(search.direction ?? "all");
  }, [search.q, search.scope, search.kind, search.status, search.direction]);
  reactExports.useEffect(() => {
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }
    searchDebounceRef.current = setTimeout(() => {
      syncActivityToUrl();
    }, 300);
    return () => {
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
      }
    };
  }, [syncActivityToUrl]);
  const {
    data: transactions = [],
    isLoading,
    isRefetching,
    refetch
  } = useQuery({
    queryKey: ["activity-transactions"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyRecentTransactions(ACTIVITY_FETCH_LIMIT);
    },
    enabled: !!actor && !isFetching && isAuthenticated,
    refetchInterval: 12e4
  });
  const filteredTransactions = reactExports.useMemo(
    () => filterActivityTransactions(transactions, {
      query: searchQuery,
      scope: scopeFilter,
      kind: kindFilter,
      status: statusFilter,
      direction: directionFilter
    }),
    [
      transactions,
      searchQuery,
      scopeFilter,
      kindFilter,
      statusFilter,
      directionFilter
    ]
  );
  const hasActiveFilters = searchQuery.trim().length > 0 || scopeFilter !== "all" || kindFilter !== "all" || statusFilter !== "all" || directionFilter !== "all";
  const clearFilters = () => {
    setSearchQuery("");
    setScopeFilter("all");
    setKindFilter("all");
    setStatusFilter("all");
    setDirectionFilter("all");
    void navigate({ to: "/activity", search: {}, replace: true });
  };
  if (authLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-[50vh] items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, { size: "lg", label: "Loading activity…" }) });
  }
  if (!isAuthenticated) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-3xl px-4 py-16", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      EmptyState,
      {
        icon: History,
        title: "Sign in to view your activity",
        description: "Mintlab records your recent ICP transfers, NFT actions, marketplace trades, dividend claims, and collection operations in one activity feed.",
        action: {
          label: "Sign in with Internet Identity",
          onClick: login,
          "data-ocid": "activity.login_button"
        },
        "data-ocid": "activity.sign_in_required"
      }
    ) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", "data-ocid": "activity.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b border-border bg-card/80 backdrop-blur-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-0.5 font-mono text-xs uppercase tracking-widest text-muted-foreground", children: "Activity" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold leading-tight text-foreground", children: "Your Mintlab History" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "outline",
          size: "sm",
          className: "gap-2",
          onClick: () => {
            void refetch();
            void queryClient.invalidateQueries({
              queryKey: ["recent-transactions"]
            });
            void queryClient.invalidateQueries({
              queryKey: ["recent-nft-transactions"]
            });
          },
          disabled: isLoading || isRefetching,
          "data-ocid": "activity.refresh_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              RefreshCw,
              {
                className: `h-4 w-4 ${isRefetching ? "animate-spin" : ""}`
              }
            ),
            "Refresh"
          ]
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        HelpCallout,
        {
          title: "One feed for wallet, marketplace, and ICP account actions",
          sectionId: "activity",
          actionLabel: "Help guide",
          className: "mb-0",
          ocid: "activity.help_callout",
          children: "Mintlab keeps your latest activity on-chain in the app. This feed shows up to 25 recent events across NFT transfers, marketplace trades, dividend claims, collection launches, and ICP account movements."
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "space-y-3 rounded-xl border border-border bg-card/70 p-4",
          "data-ocid": "activity.filters",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm font-medium text-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SlidersHorizontal, { className: "h-4 w-4 text-accent" }),
              "Filter activity"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3 lg:grid-cols-[minmax(0,1.3fr)_repeat(4,minmax(0,0.8fr))_auto]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    value: searchQuery,
                    onChange: (event) => setSearchQuery(event.target.value),
                    placeholder: "Search titles, details, references…",
                    className: "bg-background pl-9",
                    "data-ocid": "activity.search_input"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Select,
                {
                  value: scopeFilter,
                  onValueChange: (value) => {
                    const nextScope = value;
                    setScopeFilter(nextScope);
                    syncActivityToUrl({
                      scope: nextScope === "all" ? void 0 : nextScope
                    });
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "activity.scope_filter", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "All activity" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: Object.entries(ACTIVITY_SCOPE_LABELS).map(([value, label]) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value, children: label }, value)) })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Select,
                {
                  value: kindFilter,
                  onValueChange: (value) => {
                    const nextKind = value;
                    setKindFilter(nextKind);
                    syncActivityToUrl({
                      kind: nextKind === "all" ? void 0 : nextKind
                    });
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "activity.kind_filter", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "All types" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All types" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "ICPTransferOut", children: transactionKindLabel("ICPTransferOut") }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Mint", children: transactionKindLabel("Mint") }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "MarketplacePurchase", children: transactionKindLabel("MarketplacePurchase") }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "MarketplaceSale", children: transactionKindLabel("MarketplaceSale") }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "AuctionBid", children: transactionKindLabel("AuctionBid") }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "AuctionRefund", children: transactionKindLabel("AuctionRefund") }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "DividendClaim", children: transactionKindLabel("DividendClaim") }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "CollectionCreation", children: transactionKindLabel("CollectionCreation") }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "CollectionCanisterTopUp", children: transactionKindLabel("CollectionCanisterTopUp") }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "AppCanisterTopUp", children: transactionKindLabel("AppCanisterTopUp") })
                    ] })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Select,
                {
                  value: statusFilter,
                  onValueChange: (value) => {
                    const nextStatus = value;
                    setStatusFilter(nextStatus);
                    syncActivityToUrl({
                      status: nextStatus === "all" ? void 0 : nextStatus
                    });
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "activity.status_filter", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "All statuses" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All statuses" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Completed", children: "Completed" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Pending", children: "Pending" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Failed", children: "Failed" })
                    ] })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Select,
                {
                  value: directionFilter,
                  onValueChange: (value) => {
                    const nextDirection = value;
                    setDirectionFilter(nextDirection);
                    syncActivityToUrl({
                      direction: nextDirection === "all" ? void 0 : nextDirection
                    });
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "activity.direction_filter", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "All directions" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All directions" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "In", children: "Incoming" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Out", children: "Outgoing" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Neutral", children: "Neutral" })
                    ] })
                  ]
                }
              ),
              hasActiveFilters && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  type: "button",
                  variant: "ghost",
                  size: "sm",
                  className: "gap-1.5 text-muted-foreground",
                  onClick: clearFilters,
                  "data-ocid": "activity.clear_filters",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3.5 w-3.5" }),
                    "Clear"
                  ]
                }
              )
            ] }),
            !isLoading && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
              "Showing ",
              filteredTransactions.length,
              " of ",
              transactions.length,
              " ",
              "loaded events"
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border bg-card", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "flex min-h-[30vh] items-center justify-center",
          "data-ocid": "activity.loading_state",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, { size: "lg", label: "Loading activity…" })
        }
      ) : transactions.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        EmptyState,
        {
          icon: History,
          title: "No activity yet",
          description: "Your Mintlab actions will appear here after you mint, trade, transfer NFTs, claim dividends, or move ICP in your account.",
          action: {
            label: "Explore marketplace",
            onClick: () => void navigate({ to: "/marketplace" }),
            "data-ocid": "activity.empty_marketplace_cta"
          },
          "data-ocid": "activity.empty_state"
        }
      ) }) : filteredTransactions.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        EmptyState,
        {
          icon: Search,
          title: "No activity matches your filters",
          description: "Try a broader search or clear the current filters to see more events.",
          action: {
            label: "Clear filters",
            onClick: clearFilters,
            "data-ocid": "activity.filtered_empty_cta"
          },
          "data-ocid": "activity.filtered_empty_state"
        }
      ) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-border/60 px-4 sm:px-6", children: filteredTransactions.map((tx) => /* @__PURE__ */ jsxRuntimeExports.jsx(TransactionActivityRow, { tx }, tx.id.toString())) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2 text-sm text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Quick links:" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: "/wallet",
            className: "text-accent hover:text-accent/80",
            "data-ocid": "activity.link.wallet",
            children: "Wallet"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: "/marketplace",
            className: "text-accent hover:text-accent/80",
            "data-ocid": "activity.link.marketplace",
            children: "Marketplace"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: "/icp-account",
            className: "text-accent hover:text-accent/80",
            "data-ocid": "activity.link.icp_account",
            children: "ICP Account"
          }
        )
      ] })
    ] })
  ] });
}
export {
  ActivityPage as default
};
