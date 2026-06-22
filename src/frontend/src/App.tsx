import { Layout } from "@/components/Layout";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { TermsGate } from "@/components/TermsAcceptance";
import { Toaster } from "@/components/ui/sonner";
import { parseActivitySearch } from "@/lib/activity-filters";
import { parseMarketplaceSearch } from "@/lib/marketplace-discovery";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Suspense, lazy } from "react";

const WalletPage = lazy(() => import("@/pages/WalletPage"));
const MarketplacePage = lazy(() => import("@/pages/MarketplacePage"));
const AdminPage = lazy(() => import("@/pages/AdminPage"));
const ICPAccountPage = lazy(() => import("@/pages/ICPAccountPage"));
const LandingPage = lazy(() => import("@/pages/LandingPage"));
const CollectionsPage = lazy(() => import("@/pages/CollectionsPage"));
const DividendsPage = lazy(() => import("@/pages/DividendsPage"));
const HelpPage = lazy(() => import("@/pages/HelpPage"));
const TermsPage = lazy(() => import("@/pages/TermsPage"));
const ActivityPage = lazy(() => import("@/pages/ActivityPage"));
const NFTDetailPage = lazy(() => import("@/pages/NFTDetailPage"));

const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Suspense
        fallback={
          <div className="flex-1 flex items-center justify-center min-h-[40vh]">
            <LoadingSpinner size="lg" label="Loading…" />
          </div>
        }
      >
        <Outlet />
      </Suspense>
      <TermsGate />
    </Layout>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LandingPage,
});

const walletRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/wallet",
  component: WalletPage,
});

const marketplaceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/marketplace",
  component: MarketplacePage,
  validateSearch: parseMarketplaceSearch,
});

const marketplaceListingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/marketplace/listing/$listingId",
  component: MarketplacePage,
  validateSearch: parseMarketplaceSearch,
});

const nftDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/nft/$collectionId/$tokenId",
  component: NFTDetailPage,
});

const icpAccountRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/icp-account",
  component: ICPAccountPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminPage,
});

const collectionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/collections",
  component: CollectionsPage,
});

const dividendsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dividends",
  component: DividendsPage,
});

const activityRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/activity",
  component: ActivityPage,
  validateSearch: parseActivitySearch,
});

const helpRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/help",
  component: HelpPage,
});

const termsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/terms",
  component: TermsPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  walletRoute,
  marketplaceRoute,
  marketplaceListingRoute,
  nftDetailRoute,
  icpAccountRoute,
  adminRoute,
  collectionsRoute,
  dividendsRoute,
  activityRoute,
  helpRoute,
  termsRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster
        position="top-right"
        offset={{ top: "5rem", right: "1rem" }}
        mobileOffset={{ top: "5rem", right: "1rem", left: "1rem" }}
        theme="light"
      />
    </>
  );
}
