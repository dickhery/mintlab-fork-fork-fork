import AuthLib "lib/auth";
import CollectionsLib "lib/collections";
import MintLib "lib/mint";
import WalletLib "lib/wallet";
import MarketplaceLib "lib/marketplace";
import DividendsLib "lib/dividends";
import IcpLib "lib/icp";
import Principal "mo:core/Principal";

import AuthApi "mixins/auth-api";
import CollectionsApi "mixins/collections-api";
import MintApi "mixins/mint-api";
import WalletApi "mixins/wallet-api";
import ICPApi "mixins/icp-api";
import MarketplaceApi "mixins/marketplace-api";
import BrowseApi "mixins/browse-api";
import DividendsApi "mixins/dividends-api";

persistent actor Backend {
  // ── Stable state ──────────────────────────────────────────────────────────
  let authState = AuthLib.newState();
  let collectionsState = CollectionsLib.newState();
  let mintState = MintLib.newState();
  let collectionCreationState = MintLib.newCollectionCreationState();
  let collectionCreationPayoutSplitState = MintLib.newCollectionCreationPayoutSplitState();
  let moderationState = MintLib.newModerationState();
  let pendingMintPaymentState = MintLib.newPendingMintPaymentState();
  let walletState = WalletLib.newState();
  let ownershipIndexState = WalletLib.newOwnershipIndexState();
  let marketplaceState = MarketplaceLib.newState();
  let marketplacePaymentState = MarketplaceLib.newPaymentState();
  let marketplaceRefundState = MarketplaceLib.newRefundState();
  let marketplaceUserPaymentLockState = MarketplaceLib.newUserPaymentLockState();
  let marketplaceListingLockState = MarketplaceLib.newListingLockState();
  let marketplaceSettlementState = MarketplaceLib.newSettlementState();
  let marketplaceNoBidAuctionReturnState = MarketplaceLib.newNoBidAuctionReturnState();
  let marketplaceListingReturnState = MarketplaceLib.newListingReturnState();
  let marketplaceBidState = MarketplaceLib.newBidState();
  let marketplaceFeeState = MarketplaceLib.newFeeState();
  let icpWithdrawalState = IcpLib.newWithdrawalState();
  let dividendsState = DividendsLib.newState();
  let dividendFeeState = DividendsLib.newFeeState();

  // ── Mixin composition ─────────────────────────────────────────────────────
  include AuthApi(authState);
  include CollectionsApi(collectionsState, authState, ownershipIndexState);
  include MintApi(
    mintState,
    collectionCreationState,
    collectionCreationPayoutSplitState,
    moderationState,
    pendingMintPaymentState,
    collectionsState,
    walletState,
    authState,
    marketplaceUserPaymentLockState,
    Principal.fromActor(Backend),
  );
  include WalletApi(
    walletState,
    ownershipIndexState,
    collectionsState,
    marketplaceState,
    marketplaceListingLockState,
    mintState,
    authState,
    Principal.fromActor(Backend),
  );
  include ICPApi(
    marketplaceUserPaymentLockState,
    icpWithdrawalState,
    Principal.fromActor(Backend),
  );
  include MarketplaceApi(
    marketplaceState,
    marketplacePaymentState,
    marketplaceRefundState,
    marketplaceUserPaymentLockState,
    marketplaceListingLockState,
    marketplaceSettlementState,
    marketplaceNoBidAuctionReturnState,
    marketplaceListingReturnState,
    marketplaceBidState,
    marketplaceFeeState,
    walletState,
    mintState,
    collectionsState,
    authState,
    Principal.fromActor(Backend),
  );
  include DividendsApi(
    dividendsState,
    dividendFeeState,
    collectionsState,
    walletState,
    marketplaceState,
    marketplaceListingLockState,
    marketplaceUserPaymentLockState,
    mintState,
    Principal.fromActor(Backend),
  );
  include BrowseApi(
    walletState,
    collectionsState,
    marketplaceState,
    mintState,
    Principal.fromActor(Backend),
  );
};
