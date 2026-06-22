import { EmptyState } from "@/components/EmptyState";
import { HelpCallout } from "@/components/HelpCallout";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/use-auth";
import { useBackend } from "@/hooks/use-backend";
import {
  ACTIVITY_SCOPE_LABELS,
  type ActivityScope,
  type ActivitySearchState,
  filterActivityTransactions,
} from "@/lib/activity-filters";
import {
  TransactionActivityRow,
  transactionKindLabel,
} from "@/lib/transactions-display";
import type {
  RecentTransaction,
  TransactionDirection,
  TransactionKind,
  TransactionStatus,
} from "@/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { History, RefreshCw, Search, SlidersHorizontal, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const ACTIVITY_FETCH_LIMIT = 25n;

type ActivityKindFilter = TransactionKind | "all";
type ActivityStatusFilter = TransactionStatus | "all";
type ActivityDirectionFilter = TransactionDirection | "all";

export default function ActivityPage() {
  const { isAuthenticated, isLoading: authLoading, login } = useAuth();
  const { actor, isFetching } = useBackend();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as ActivitySearchState;

  const [searchQuery, setSearchQuery] = useState(search.q ?? "");
  const [scopeFilter, setScopeFilter] = useState<ActivityScope>(
    search.scope ?? "all",
  );
  const [kindFilter, setKindFilter] = useState<ActivityKindFilter>(
    search.kind ?? "all",
  );
  const [statusFilter, setStatusFilter] = useState<ActivityStatusFilter>(
    search.status ?? "all",
  );
  const [directionFilter, setDirectionFilter] =
    useState<ActivityDirectionFilter>(search.direction ?? "all");
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activitySearch = useMemo(
    () => ({
      q: searchQuery.trim() || undefined,
      scope: scopeFilter === "all" ? undefined : scopeFilter,
      kind: kindFilter === "all" ? undefined : kindFilter,
      status: statusFilter === "all" ? undefined : statusFilter,
      direction: directionFilter === "all" ? undefined : directionFilter,
    }),
    [searchQuery, scopeFilter, kindFilter, statusFilter, directionFilter],
  );

  const syncActivityToUrl = useCallback(
    (overrides?: Partial<ActivitySearchState>) => {
      void navigate({
        to: "/activity",
        search: { ...activitySearch, ...overrides },
        replace: true,
      });
    },
    [activitySearch, navigate],
  );

  useEffect(() => {
    setSearchQuery(search.q ?? "");
    setScopeFilter(search.scope ?? "all");
    setKindFilter(search.kind ?? "all");
    setStatusFilter(search.status ?? "all");
    setDirectionFilter(search.direction ?? "all");
  }, [search.q, search.scope, search.kind, search.status, search.direction]);

  useEffect(() => {
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
    refetch,
  } = useQuery<RecentTransaction[]>({
    queryKey: ["activity-transactions"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyRecentTransactions(ACTIVITY_FETCH_LIMIT);
    },
    enabled: !!actor && !isFetching && isAuthenticated,
    refetchInterval: 120_000,
  });

  const filteredTransactions = useMemo(
    () =>
      filterActivityTransactions(transactions, {
        query: searchQuery,
        scope: scopeFilter,
        kind: kindFilter,
        status: statusFilter,
        direction: directionFilter,
      }),
    [
      transactions,
      searchQuery,
      scopeFilter,
      kindFilter,
      statusFilter,
      directionFilter,
    ],
  );

  const hasActiveFilters =
    searchQuery.trim().length > 0 ||
    scopeFilter !== "all" ||
    kindFilter !== "all" ||
    statusFilter !== "all" ||
    directionFilter !== "all";

  const clearFilters = () => {
    setSearchQuery("");
    setScopeFilter("all");
    setKindFilter("all");
    setStatusFilter("all");
    setDirectionFilter("all");
    void navigate({ to: "/activity", search: {}, replace: true });
  };

  if (authLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <LoadingSpinner size="lg" label="Loading activity…" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <EmptyState
          icon={History}
          title="Sign in to view your activity"
          description="Mintlab records your recent ICP transfers, NFT actions, marketplace trades, dividend claims, and collection operations in one activity feed."
          action={{
            label: "Sign in with Internet Identity",
            onClick: login,
            "data-ocid": "activity.login_button",
          }}
          data-ocid="activity.sign_in_required"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" data-ocid="activity.page">
      <div className="border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <p className="mb-0.5 font-mono text-xs uppercase tracking-widest text-muted-foreground">
              Activity
            </p>
            <h1 className="font-display text-2xl font-bold leading-tight text-foreground">
              Your Mintlab History
            </h1>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => {
              void refetch();
              void queryClient.invalidateQueries({
                queryKey: ["recent-transactions"],
              });
              void queryClient.invalidateQueries({
                queryKey: ["recent-nft-transactions"],
              });
            }}
            disabled={isLoading || isRefetching}
            data-ocid="activity.refresh_button"
          >
            <RefreshCw
              className={`h-4 w-4 ${isRefetching ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      <div className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <HelpCallout
          title="One feed for wallet, marketplace, and ICP account actions"
          sectionId="activity"
          actionLabel="Help guide"
          className="mb-0"
          ocid="activity.help_callout"
        >
          Mintlab keeps your latest activity on-chain in the app. This feed
          shows up to 25 recent events across NFT transfers, marketplace trades,
          dividend claims, collection launches, and ICP account movements.
        </HelpCallout>

        <div
          className="space-y-3 rounded-xl border border-border bg-card/70 p-4"
          data-ocid="activity.filters"
        >
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <SlidersHorizontal className="h-4 w-4 text-accent" />
            Filter activity
          </div>
          <div className="grid gap-3 lg:grid-cols-[minmax(0,1.3fr)_repeat(4,minmax(0,0.8fr))_auto]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search titles, details, references…"
                className="bg-background pl-9"
                data-ocid="activity.search_input"
              />
            </div>
            <Select
              value={scopeFilter}
              onValueChange={(value) => {
                const nextScope = value as ActivityScope;
                setScopeFilter(nextScope);
                syncActivityToUrl({
                  scope: nextScope === "all" ? undefined : nextScope,
                });
              }}
            >
              <SelectTrigger data-ocid="activity.scope_filter">
                <SelectValue placeholder="All activity" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(ACTIVITY_SCOPE_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={kindFilter}
              onValueChange={(value) => {
                const nextKind = value as ActivityKindFilter;
                setKindFilter(nextKind);
                syncActivityToUrl({
                  kind: nextKind === "all" ? undefined : nextKind,
                });
              }}
            >
              <SelectTrigger data-ocid="activity.kind_filter">
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="ICPTransferOut">
                  {transactionKindLabel("ICPTransferOut")}
                </SelectItem>
                <SelectItem value="Mint">
                  {transactionKindLabel("Mint")}
                </SelectItem>
                <SelectItem value="MarketplacePurchase">
                  {transactionKindLabel("MarketplacePurchase")}
                </SelectItem>
                <SelectItem value="MarketplaceSale">
                  {transactionKindLabel("MarketplaceSale")}
                </SelectItem>
                <SelectItem value="AuctionBid">
                  {transactionKindLabel("AuctionBid")}
                </SelectItem>
                <SelectItem value="AuctionRefund">
                  {transactionKindLabel("AuctionRefund")}
                </SelectItem>
                <SelectItem value="DividendClaim">
                  {transactionKindLabel("DividendClaim")}
                </SelectItem>
                <SelectItem value="CollectionCreation">
                  {transactionKindLabel("CollectionCreation")}
                </SelectItem>
                <SelectItem value="CollectionCanisterTopUp">
                  {transactionKindLabel("CollectionCanisterTopUp")}
                </SelectItem>
                <SelectItem value="AppCanisterTopUp">
                  {transactionKindLabel("AppCanisterTopUp")}
                </SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={statusFilter}
              onValueChange={(value) => {
                const nextStatus = value as ActivityStatusFilter;
                setStatusFilter(nextStatus);
                syncActivityToUrl({
                  status: nextStatus === "all" ? undefined : nextStatus,
                });
              }}
            >
              <SelectTrigger data-ocid="activity.status_filter">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={directionFilter}
              onValueChange={(value) => {
                const nextDirection = value as ActivityDirectionFilter;
                setDirectionFilter(nextDirection);
                syncActivityToUrl({
                  direction:
                    nextDirection === "all" ? undefined : nextDirection,
                });
              }}
            >
              <SelectTrigger data-ocid="activity.direction_filter">
                <SelectValue placeholder="All directions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All directions</SelectItem>
                <SelectItem value="In">Incoming</SelectItem>
                <SelectItem value="Out">Outgoing</SelectItem>
                <SelectItem value="Neutral">Neutral</SelectItem>
              </SelectContent>
            </Select>
            {hasActiveFilters && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="gap-1.5 text-muted-foreground"
                onClick={clearFilters}
                data-ocid="activity.clear_filters"
              >
                <X className="h-3.5 w-3.5" />
                Clear
              </Button>
            )}
          </div>
          {!isLoading && (
            <p className="text-xs text-muted-foreground">
              Showing {filteredTransactions.length} of {transactions.length}{" "}
              loaded events
            </p>
          )}
        </div>

        <div className="rounded-xl border border-border bg-card">
          {isLoading ? (
            <div
              className="flex min-h-[30vh] items-center justify-center"
              data-ocid="activity.loading_state"
            >
              <LoadingSpinner size="lg" label="Loading activity…" />
            </div>
          ) : transactions.length === 0 ? (
            <div className="p-8">
              <EmptyState
                icon={History}
                title="No activity yet"
                description="Your Mintlab actions will appear here after you mint, trade, transfer NFTs, claim dividends, or move ICP in your account."
                action={{
                  label: "Explore marketplace",
                  onClick: () => void navigate({ to: "/marketplace" }),
                  "data-ocid": "activity.empty_marketplace_cta",
                }}
                data-ocid="activity.empty_state"
              />
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="p-8">
              <EmptyState
                icon={Search}
                title="No activity matches your filters"
                description="Try a broader search or clear the current filters to see more events."
                action={{
                  label: "Clear filters",
                  onClick: clearFilters,
                  "data-ocid": "activity.filtered_empty_cta",
                }}
                data-ocid="activity.filtered_empty_state"
              />
            </div>
          ) : (
            <div className="divide-y divide-border/60 px-4 sm:px-6">
              {filteredTransactions.map((tx) => (
                <TransactionActivityRow key={tx.id.toString()} tx={tx} />
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
          <span>Quick links:</span>
          <Link
            to="/wallet"
            className="text-accent hover:text-accent/80"
            data-ocid="activity.link.wallet"
          >
            Wallet
          </Link>
          <Link
            to="/marketplace"
            className="text-accent hover:text-accent/80"
            data-ocid="activity.link.marketplace"
          >
            Marketplace
          </Link>
          <Link
            to="/icp-account"
            className="text-accent hover:text-accent/80"
            data-ocid="activity.link.icp_account"
          >
            ICP Account
          </Link>
        </div>
      </div>
    </div>
  );
}
