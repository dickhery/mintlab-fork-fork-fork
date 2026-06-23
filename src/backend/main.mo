import AuthLib "lib/auth";
import MigrationLib "migration";
import CollectionsLib "lib/collections";
import MintLib "lib/mint";
import WalletLib "lib/wallet";
import MarketplaceLib "lib/marketplace";
import DividendsLib "lib/dividends";
import IcpLib "lib/icp";
import TermsLib "lib/terms";
import TransactionsLib "lib/transactions";
import RateLimitLib "lib/rate-limit";
import ShareImageCacheLib "lib/share-image-cache";
import Principal "mo:core/Principal";

import AuthApi "mixins/auth-api";
import CollectionsApi "mixins/collections-api";
import MintApi "mixins/mint-api";
import WalletApi "mixins/wallet-api";
import ICPApi "mixins/icp-api";
import MarketplaceApi "mixins/marketplace-api";
import BrowseApi "mixins/browse-api";
import DividendsApi "mixins/dividends-api";
import TermsApi "mixins/terms-api";
import TransactionsApi "mixins/transactions-api";

persistent actor Backend {
  // ── Stable state ──────────────────────────────────────────────────────────
  let authState = AuthLib.newState();
  let collectionsState = CollectionsLib.newState();
  let nftModerationState = CollectionsLib.newNFTModerationState();
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
  let dividendAccumulatorState = DividendsLib.newAccumulatorState();
  let dividendFeeState = DividendsLib.newFeeState();
  let dividendSourceState = DividendsLib.newSourceState();
  let termsState = TermsLib.newState();
  let transactionState = TransactionsLib.newState();
  let rateLimitState = RateLimitLib.newState();
  let shareImageCacheState = ShareImageCacheLib.newState();
  let walletAuthState = AuthLib.newWalletAuthState();

  // ── Mixin composition ─────────────────────────────────────────────────────
  include AuthApi(authState, walletAuthState);
  include TermsApi(termsState);
  include CollectionsApi(
    collectionsState,
    nftModerationState,
    authState,
    ownershipIndexState,
    rateLimitState,
  );
  include MintApi(
    mintState,
    collectionCreationState,
    collectionCreationPayoutSplitState,
    moderationState,
    pendingMintPaymentState,
    collectionsState,
    nftModerationState,
    walletState,
    authState,
    walletAuthState,
    marketplaceState,
    marketplaceSettlementState,
    marketplaceNoBidAuctionReturnState,
    marketplaceListingReturnState,
    shareImageCacheState,
    marketplaceUserPaymentLockState,
    dividendAccumulatorState,
    dividendSourceState,
    transactionState,
    termsState,
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
    nftModerationState,
    transactionState,
    termsState,
    Principal.fromActor(Backend),
  );
  include ICPApi(
    marketplaceUserPaymentLockState,
    icpWithdrawalState,
    transactionState,
    termsState,
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
    moderationState,
    collectionsState,
    authState,
    nftModerationState,
    transactionState,
    termsState,
    shareImageCacheState,
    Principal.fromActor(Backend),
  );
  include DividendsApi(
    dividendsState,
    dividendAccumulatorState,
    dividendFeeState,
    dividendSourceState,
    collectionsState,
    walletState,
    marketplaceState,
    marketplaceListingLockState,
    marketplaceUserPaymentLockState,
    mintState,
    authState,
    transactionState,
    termsState,
    rateLimitState,
    Principal.fromActor(Backend),
  );
  include BrowseApi(
    walletState,
    collectionsState,
    marketplaceState,
    mintState,
    authState,
    nftModerationState,
    rateLimitState,
    Principal.fromActor(Backend),
  );
  include TransactionsApi(transactionState);

  system func postupgrade() {
    MigrationLib.runPostUpgrade({
      authState;
      rateLimitState;
      collectionsState;
      mintState;
      ownershipIndexState;
      marketplaceState;
      marketplacePaymentState;
      marketplaceSettlementState;
      marketplaceNoBidAuctionReturnState;
      marketplaceListingReturnState;
      marketplaceBidState;
    });
  };
};
