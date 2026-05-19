import MarketplaceLib "../lib/marketplace";
import WalletLib "../lib/wallet";
import IcpLib "../lib/icp";
import MintLib "../lib/mint";
import AuthLib "../lib/auth";
import CollectionsLib "../lib/collections";
import MarketplaceTypes "../types/marketplace";
import WalletTypes "../types/wallet";
import CollectionTypes "../types/collections";
import Blob "mo:core/Blob";
import Error "mo:core/Error";
import Runtime "mo:core/Runtime";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Nat64 "mo:core/Nat64";

mixin (
  marketplaceState : MarketplaceLib.MarketplaceState,
  marketplacePaymentState : MarketplaceLib.MarketplacePaymentState,
  marketplaceFeeState : MarketplaceLib.MarketplaceFeeState,
  walletState : WalletLib.WalletState,
  mintState : MintLib.MintState,
  collectionsState : CollectionsLib.CollectionsState,
  authState : AuthLib.AdminState,
  canisterId : Principal,
) {
  type MarketplaceChildTransferResult = {
    #ok : Nat;
    #err : Text;
  };

  type MarketplaceICRC7Account = {
    owner : Principal;
    subaccount : ?Blob;
  };

  type MarketplaceChildCollectionActor = actor {
    mintlab_transfer_from : (Principal, Principal, Nat) -> async MarketplaceChildTransferResult;
    mintlab_owner_of : ([Nat]) -> async [?MarketplaceICRC7Account];
  };

  func requireMarketplaceAdmin(caller : Principal) {
    if (Principal.isAnonymous(caller)) Runtime.trap("Anonymous caller not allowed");
    if (not AuthLib.isAdmin(authState, caller)) Runtime.trap("Unauthorized: admin only");
  };

  func validateMarketplaceFeeRecipient(recipient : ?MarketplaceTypes.AccountIdentifier) {
    switch (recipient) {
      case (?account) {
        if (account.size() != 32) {
          Runtime.trap("Mintlab sales fee account must be a 32-byte ICP account identifier");
        };
      };
      case null {};
    };
  };

  func validateMintlabFeeBasisPoints(basisPoints : Nat) {
    if (basisPoints == 0 or basisPoints >= MarketplaceLib.BASIS_POINTS_DENOMINATOR) {
      Runtime.trap("Mintlab sales fee must be between 0.01% and 99.99%");
    };
  };

  func ensureMintlabFeeApplies(amount : Nat64, valueLabel : Text) {
    if (MarketplaceLib.mintlabFee(marketplaceFeeState, amount) == 0) {
      Runtime.trap(valueLabel # " is too low to apply the Mintlab marketplace fee");
    };
  };

  /// List an NFT at a fixed price; caller must own the NFT (escrow transfer happens here)
  public shared ({ caller }) func createFixedListing(
    nftId : MarketplaceTypes.NFTId,
    price : Nat64,
  ) : async MarketplaceTypes.FixedListing {
    if (Principal.isAnonymous(caller)) Runtime.trap("Anonymous caller not allowed");
    if (price == 0) Runtime.trap("Price must be greater than zero");
    ensureMintlabFeeApplies(price, "Price");
    let nft = switch (WalletLib.getNFT(walletState, nftId)) {
      case null Runtime.trap("NFT not found");
      case (?n) n;
    };
    if (not Principal.equal(nft.owner, caller)) Runtime.trap("Unauthorized: caller does not own this NFT");
    if (nft.location == #Registered) {
      Runtime.trap("Only vaulted or in-app minted NFTs can be listed for sale");
    };
    await* prepareNFTForListing(nft, caller);
    WalletLib.removeNFT(walletState, nftId, caller);
    MarketplaceLib.createFixedListing(marketplaceState, caller, nft, price);
  };

  /// List an NFT for timed auction; caller must own the NFT (escrow transfer happens here)
  public shared ({ caller }) func createAuctionListing(
    nftId : MarketplaceTypes.NFTId,
    startingBid : Nat64,
    endTime : Int,
  ) : async MarketplaceTypes.AuctionListing {
    if (Principal.isAnonymous(caller)) Runtime.trap("Anonymous caller not allowed");
    if (startingBid == 0) Runtime.trap("Starting bid must be greater than zero");
    ensureMintlabFeeApplies(startingBid, "Starting bid");
    if (endTime <= Time.now()) Runtime.trap("End time must be in the future");
    let nft = switch (WalletLib.getNFT(walletState, nftId)) {
      case null Runtime.trap("NFT not found");
      case (?n) n;
    };
    if (not Principal.equal(nft.owner, caller)) Runtime.trap("Unauthorized: caller does not own this NFT");
    if (nft.location == #Registered) {
      Runtime.trap("Only vaulted or in-app minted NFTs can be listed for auction");
    };
    await* prepareNFTForListing(nft, caller);
    WalletLib.removeNFT(walletState, nftId, caller);
    MarketplaceLib.createAuctionListing(marketplaceState, caller, nft, startingBid, endTime);
  };

  /// Return all currently active listings (fixed + auction)
  public query func getActiveListings() : async [MarketplaceTypes.ActiveListing] {
    MarketplaceLib.getActiveListings(marketplaceState);
  };

  public query func getActiveListingDetails() : async [MarketplaceTypes.ActiveListingDetail] {
    MarketplaceLib.getActiveListingDetails(marketplaceState);
  };

  public func getMarketplaceFeeConfig() : async MarketplaceTypes.MarketplaceFeeConfig {
    let ledger = actor (IcpLib.LEDGER_CANISTER_ID) : IcpLib.Ledger;
    let feeE8s = await* IcpLib.getTransferFee(ledger);
    MarketplaceLib.getFeeConfig(marketplacePaymentState, marketplaceFeeState, feeE8s);
  };

  public shared ({ caller }) func configureMarketplaceFee(
    recipient : ?MarketplaceTypes.AccountIdentifier,
    mintlabFeeBasisPoints : Nat,
  ) : async MarketplaceTypes.MarketplaceFeeConfig {
    requireMarketplaceAdmin(caller);
    validateMarketplaceFeeRecipient(recipient);
    validateMintlabFeeBasisPoints(mintlabFeeBasisPoints);
    MarketplaceLib.setMintlabFeeRecipient(marketplacePaymentState, recipient);
    MarketplaceLib.setMintlabFeeBasisPoints(marketplaceFeeState, mintlabFeeBasisPoints);
    await getMarketplaceFeeConfig();
  };

  public shared ({ caller }) func configureMarketplaceFeeRecipient(
    recipient : ?MarketplaceTypes.AccountIdentifier
  ) : async MarketplaceTypes.MarketplaceFeeConfig {
    requireMarketplaceAdmin(caller);
    validateMarketplaceFeeRecipient(recipient);
    MarketplaceLib.setMintlabFeeRecipient(marketplacePaymentState, recipient);
    await getMarketplaceFeeConfig();
  };

  public shared ({ caller }) func getMyPendingAuctionRefunds() : async [MarketplaceTypes.AuctionEscrow] {
    if (Principal.isAnonymous(caller)) Runtime.trap("Anonymous caller not allowed");
    MarketplaceLib.getPendingRefundsByBidder(marketplacePaymentState, caller);
  };

  public shared ({ caller }) func retryAuctionRefund(escrowId : Nat) : async Bool {
    if (Principal.isAnonymous(caller)) Runtime.trap("Anonymous caller not allowed");
    let escrow = switch (MarketplaceLib.getPendingRefund(marketplacePaymentState, escrowId)) {
      case null Runtime.trap("Pending refund not found");
      case (?value) value;
    };
    let isCallerAdmin = AuthLib.isAdmin(authState, caller);
    if (not Principal.equal(escrow.bidder, caller) and not isCallerAdmin) {
      Runtime.trap("Unauthorized: must be refund owner or admin");
    };
    let ledger = actor (IcpLib.LEDGER_CANISTER_ID) : IcpLib.Ledger;
    let feeE8s = await* IcpLib.getTransferFee(ledger);
    switch (await* refundAuctionEscrow(ledger, escrow, feeE8s)) {
      case (#ok(_)) {
        ignore MarketplaceLib.removePendingRefund(marketplacePaymentState, escrow.escrowId);
        true;
      };
      case (#err(_)) false;
    };
  };

  /// Buy a fixed-price listing; ICP transferred from buyer's subaccount, NFT registered to buyer
  public shared ({ caller }) func buyFixedListing(listingId : MarketplaceTypes.ListingId) : async () {
    if (Principal.isAnonymous(caller)) Runtime.trap("Anonymous caller not allowed");
    if (not MarketplaceLib.acquireListingLock(marketplacePaymentState, listingId)) {
      Runtime.trap("Listing is processing another payment. Try again shortly.");
    };
    try {
    let listing = switch (MarketplaceLib.getFixedListing(marketplaceState, listingId)) {
      case null Runtime.trap("Listing not found");
      case (?l) l;
    };
    if (listing.status != #Active) Runtime.trap("Listing is not active");
    if (Principal.equal(listing.seller, caller)) Runtime.trap("Seller cannot buy their own listing");
    let escrowedNFT = switch (MarketplaceLib.getEscrowedNFT(marketplaceState, listingId)) {
      case null Runtime.trap("Escrowed NFT not found for listing");
      case (?nft) nft;
    };
    await* ensureEscrowedNFTReady(escrowedNFT);

    // Transfer ICP from buyer's subaccount and split the sale proceeds.
    let ledger = actor (IcpLib.LEDGER_CANISTER_ID) : IcpLib.Ledger;
    let selfPrincipal = canisterId;
    let ledgerFeeE8s = await* IcpLib.getTransferFee(ledger);
    let mintlabFee = MarketplaceLib.mintlabFee(marketplaceFeeState, listing.price);
    let feeRecipient = if (mintlabFee > 0) {
      switch (marketplacePaymentState.mintlabFeeRecipient) {
        case null Runtime.trap("Mintlab sales fee account has not been configured");
        case (?account) account;
      };
    } else {
      IcpLib.accountIdentifier(selfPrincipal, IcpLib.zeroSubaccount());
    };
    let buyerSub = IcpLib.principalToSubaccount(caller);
    let buyerAccount = IcpLib.accountIdentifier(selfPrincipal, buyerSub);
    let sellerSub = IcpLib.principalToSubaccount(listing.seller);
    let sellerAccount = IcpLib.accountIdentifier(selfPrincipal, sellerSub);
    let requiredDebit = MarketplaceLib.totalFixedBuyerDebit(marketplaceFeeState, listing.price, ledgerFeeE8s);
    let buyerBalance = await* IcpLib.getBalance(ledger, buyerAccount);
    if (buyerBalance < requiredDebit) {
      Runtime.trap(
        "Insufficient ICP for purchase, Mintlab fee split, and ledger fees. Required: " #
        Nat64.toText(requiredDebit) # " e8s"
      );
    };
    if (mintlabFee > 0) {
      let feeResult = await* IcpLib.transferOutWithFee(
        ledger,
        ?buyerSub,
        feeRecipient,
        mintlabFee,
        Nat64.fromNat(listingId),
        ledgerFeeE8s,
      );
      switch (feeResult) {
        case (#Err(error)) Runtime.trap("Mintlab sales fee transfer failed: " # IcpLib.transferErrorText(error));
        case (#Ok(_)) {};
      };
    };
    let sellerResult = await* IcpLib.transferOutWithFee(
      ledger,
      ?buyerSub,
      sellerAccount,
      MarketplaceLib.sellerProceeds(marketplaceFeeState, listing.price),
      Nat64.fromNat(listingId),
      ledgerFeeE8s,
    );
    switch (sellerResult) {
      case (#Err(error)) Runtime.trap("Seller ICP transfer failed: " # IcpLib.transferErrorText(error));
      case (#Ok(_)) {};
    };

    // Settle the listing
    switch (MarketplaceLib.settleFixedListing(marketplaceState, listingId)) {
      case null Runtime.trap("Failed to settle listing");
      case (?settled) {
        ignore settled;
        switch (MarketplaceLib.takeEscrowedNFT(marketplaceState, listingId)) {
          case null Runtime.trap("Escrowed NFT disappeared during settlement");
          case (?escrowed) {
            let deliveredLocation = await* transferEscrowedNFTToRecipient(escrowed, caller);
            ignore MarketplaceLib.clearListingsForToken(marketplaceState, escrowed.collectionId, escrowed.tokenId);
            ignore WalletLib.registerNFT(
              walletState,
              caller,
              escrowed.collectionId,
              escrowed.tokenId,
              escrowed.metadata,
              deliveredLocation,
            );
          };
        };
      };
    };
    } finally {
      MarketplaceLib.releaseListingLock(marketplacePaymentState, listingId);
    };
  };

  /// Place a bid on an active auction listing
  public shared ({ caller }) func placeBid(
    listingId : MarketplaceTypes.ListingId,
    amount : Nat64,
  ) : async MarketplaceTypes.AuctionListing {
    if (Principal.isAnonymous(caller)) Runtime.trap("Anonymous caller not allowed");
    if (amount == 0) Runtime.trap("Bid amount must be greater than zero");
    ensureMintlabFeeApplies(amount, "Bid amount");
    if (not MarketplaceLib.acquireListingLock(marketplacePaymentState, listingId)) {
      Runtime.trap("Auction is processing another payment. Try again shortly.");
    };
    try {
      let listing = switch (MarketplaceLib.getAuctionListing(marketplaceState, listingId)) {
        case null Runtime.trap("Auction listing not found");
        case (?l) l;
      };
      if (listing.status != #Active) Runtime.trap("Auction is not active");
      if (Time.now() >= listing.endTime) Runtime.trap("Auction has ended");
      if (Principal.equal(listing.seller, caller)) Runtime.trap("Seller cannot bid on their own auction");
      let ledger = actor (IcpLib.LEDGER_CANISTER_ID) : IcpLib.Ledger;
      let ledgerFeeE8s = await* IcpLib.getTransferFee(ledger);
      let escrowDeposit = MarketplaceLib.auctionBidEscrowDeposit(amount, ledgerFeeE8s);
      let requiredDebit = MarketplaceLib.totalBidderDebit(amount, ledgerFeeE8s);
      let selfPrincipal = canisterId;
      let bidderSub = IcpLib.principalToSubaccount(caller);
      let bidderAccount = IcpLib.accountIdentifier(selfPrincipal, bidderSub);
      let bidderBalance = await* IcpLib.getBalance(ledger, bidderAccount);
      if (bidderBalance < requiredDebit) {
        Runtime.trap(
          "Insufficient ICP for bid escrow and ledger fees. Required: " #
          Nat64.toText(requiredDebit) # " e8s"
        );
      };

      let escrowId = MarketplaceLib.peekNextEscrowId(marketplacePaymentState);
      let escrowSub = IcpLib.marketplaceEscrowSubaccount(escrowId);
      let escrowAccount = IcpLib.accountIdentifier(selfPrincipal, escrowSub);
      let depositResult = await* IcpLib.transferOutWithFee(
        ledger,
        ?bidderSub,
        escrowAccount,
        escrowDeposit,
        Nat64.fromNat(listingId),
        ledgerFeeE8s,
      );
      let depositBlock = switch (depositResult) {
        case (#Err(error)) Runtime.trap("Bid escrow transfer failed: " # IcpLib.transferErrorText(error));
        case (#Ok(blockIndex)) blockIndex;
      };

      let previousEscrow = MarketplaceLib.getAuctionEscrow(marketplacePaymentState, listingId);
      let updated = switch (MarketplaceLib.placeBid(marketplaceState, listingId, caller, amount)) {
        case null Runtime.trap("Bid too low or listing not found");
        case (?value) value;
      };
      MarketplaceLib.recordAuctionEscrow(
        marketplacePaymentState,
        listingId,
        {
          escrowId;
          listingId;
          bidder = caller;
          amount;
          feeReserve = MarketplaceLib.auctionBidFeeReserve(ledgerFeeE8s);
          ledgerFeeE8s;
          depositedBlock = depositBlock;
          createdAt = Time.now();
        },
      );

      switch (previousEscrow) {
        case null {};
        case (?escrow) {
          MarketplaceLib.queueAuctionRefund(marketplacePaymentState, escrow);
          switch (await* refundAuctionEscrow(ledger, escrow, ledgerFeeE8s)) {
            case (#ok(_)) {
              ignore MarketplaceLib.removePendingRefund(marketplacePaymentState, escrow.escrowId);
            };
            case (#err(_)) {};
          };
        };
      };
      updated;
    } finally {
      MarketplaceLib.releaseListingLock(marketplacePaymentState, listingId);
    };
  };

  /// Settle an auction after its end time; transfers ICP to seller, NFT registered to highest bidder
  public shared ({ caller }) func settleAuction(listingId : MarketplaceTypes.ListingId) : async () {
    if (Principal.isAnonymous(caller)) Runtime.trap("Anonymous caller not allowed");
    if (not MarketplaceLib.acquireListingLock(marketplacePaymentState, listingId)) {
      Runtime.trap("Auction is processing another payment. Try again shortly.");
    };
    try {
      let listing = switch (MarketplaceLib.getAuctionListing(marketplaceState, listingId)) {
        case null Runtime.trap("Auction listing not found");
        case (?l) l;
      };
      if (listing.status != #Active) Runtime.trap("Auction is not active");
      if (Time.now() < listing.endTime) Runtime.trap("Auction has not ended yet");
      let settledNFT = switch (MarketplaceLib.getEscrowedNFT(marketplaceState, listingId)) {
        case null Runtime.trap("Escrowed NFT missing while finalizing auction");
        case (?nft) nft;
      };
      await* ensureEscrowedNFTReady(settledNFT);

      switch (listing.highestBidder) {
        case null {};
        case (?winner) {
          let ledger = actor (IcpLib.LEDGER_CANISTER_ID) : IcpLib.Ledger;
          let ledgerFeeE8s = await* IcpLib.getTransferFee(ledger);

          switch (resolveWinningEscrow(listing, winner)) {
            case (?currentEscrow) {
              let escrowSub = IcpLib.marketplaceEscrowSubaccount(currentEscrow.escrowId);
              await* payAuctionProceedsFromSubaccount(
                ledger,
                escrowSub,
                listing,
                ledgerFeeE8s,
                "Winning bid escrow",
              );
              ignore MarketplaceLib.removeAuctionEscrow(marketplacePaymentState, listingId);
              ignore MarketplaceLib.removePendingRefund(marketplacePaymentState, currentEscrow.escrowId);
            };
            case null {
              // Recovery path for legacy auctions whose winning bid predates escrow records.
              let winnerSub = IcpLib.principalToSubaccount(winner);
              await* payAuctionProceedsFromSubaccount(
                ledger,
                winnerSub,
                listing,
                ledgerFeeE8s,
                "Winning bid escrow record is missing and winner's in-app ICP account",
              );
            };
          };
        };
      };

      ignore MarketplaceLib.settleAuction(marketplaceState, listingId);
      ignore MarketplaceLib.takeEscrowedNFT(marketplaceState, listingId);
      ignore MarketplaceLib.clearListingsForToken(marketplaceState, settledNFT.collectionId, settledNFT.tokenId);

      switch (listing.highestBidder) {
        case null {
          let returnedLocation = await* transferEscrowedNFTToRecipient(settledNFT, listing.seller);
          ignore WalletLib.registerNFT(
            walletState,
            listing.seller,
            settledNFT.collectionId,
            settledNFT.tokenId,
            settledNFT.metadata,
            returnedLocation,
          );
        };
        case (?winner) {
          let deliveredLocation = await* transferEscrowedNFTToRecipient(settledNFT, winner);
          ignore WalletLib.registerNFT(
            walletState,
            winner,
            settledNFT.collectionId,
            settledNFT.tokenId,
            settledNFT.metadata,
            deliveredLocation,
          );
        };
      };
    } finally {
      MarketplaceLib.releaseListingLock(marketplacePaymentState, listingId);
    };
  };

  func resolveWinningEscrow(
    listing : MarketplaceTypes.AuctionListing,
    winner : Principal,
  ) : ?MarketplaceTypes.AuctionEscrow {
    let current = switch (MarketplaceLib.getAuctionEscrow(marketplacePaymentState, listing.id)) {
      case (?escrow) ?escrow;
      case null MarketplaceLib.findPendingAuctionEscrow(
        marketplacePaymentState,
        listing.id,
        winner,
        listing.highestBid,
      );
    };
    switch (current) {
      case null null;
      case (?escrow) {
        if (
          escrow.listingId != listing.id or
          not Principal.equal(escrow.bidder, winner) or
          escrow.amount != listing.highestBid
        ) {
          Runtime.trap("Winning bid escrow does not match the auction state");
        };
        ?escrow;
      };
    };
  };

  func payAuctionProceedsFromSubaccount(
    ledger : IcpLib.Ledger,
    fromSubaccount : Blob,
    listing : MarketplaceTypes.AuctionListing,
    ledgerFeeE8s : Nat64,
    sourceLabel : Text,
  ) : async* () {
    let sourceAccount = IcpLib.accountIdentifier(canisterId, fromSubaccount);
    let requiredDebit = MarketplaceLib.totalFixedBuyerDebit(marketplaceFeeState, listing.highestBid, ledgerFeeE8s);
    let sourceBalance = await* IcpLib.getBalance(ledger, sourceAccount);
    if (sourceBalance < requiredDebit) {
      Runtime.trap(
        sourceLabel # " does not hold enough ICP to settle this auction. Required: " #
        Nat64.toText(requiredDebit) # " e8s"
      );
    };

    let mintlabFee = MarketplaceLib.mintlabFee(marketplaceFeeState, listing.highestBid);
    let feeRecipient = if (mintlabFee > 0) {
      switch (marketplacePaymentState.mintlabFeeRecipient) {
        case null Runtime.trap("Mintlab sales fee account has not been configured");
        case (?account) account;
      };
    } else {
      IcpLib.accountIdentifier(canisterId, IcpLib.zeroSubaccount());
    };

    if (mintlabFee > 0) {
      let feeResult = await* IcpLib.transferOutWithFee(
        ledger,
        ?fromSubaccount,
        feeRecipient,
        mintlabFee,
        Nat64.fromNat(listing.id),
        ledgerFeeE8s,
      );
      switch (feeResult) {
        case (#Err(error)) Runtime.trap("Mintlab sales fee transfer failed: " # IcpLib.transferErrorText(error));
        case (#Ok(_)) {};
      };
    };

    let sellerSub = IcpLib.principalToSubaccount(listing.seller);
    let sellerAccount = IcpLib.accountIdentifier(canisterId, sellerSub);
    let sellerResult = await* IcpLib.transferOutWithFee(
      ledger,
      ?fromSubaccount,
      sellerAccount,
      MarketplaceLib.sellerProceeds(marketplaceFeeState, listing.highestBid),
      Nat64.fromNat(listing.id),
      ledgerFeeE8s,
    );
    switch (sellerResult) {
      case (#Err(error)) Runtime.trap("ICP transfer to seller failed: " # IcpLib.transferErrorText(error));
      case (#Ok(_)) {};
    };
  };

  func ensureEscrowedNFTReady(nft : WalletTypes.WalletNFT) : async* () {
    switch (nft.location) {
      case (#Minted) {
        await* ensureMintedNFTReady(nft, canisterId);
      };
      case (#Vaulted) {
        let collection = externalCollection(nft);
        let vaultAccountId = IcpLib.accountIdentifier(canisterId, IcpLib.zeroSubaccount());
        switch (
          await* WalletLib.isNFTCurrentlyOwnedBy(
            collection,
            canisterId,
            vaultAccountId,
            nft.tokenId,
          )
        ) {
          case (#ok(true)) {};
          case (#ok(false)) Runtime.trap("Escrowed external NFT is not held by the app vault");
          case (#err(message)) Runtime.trap(message);
        };
      };
      case (#Registered) {
        Runtime.trap("Registered external NFTs must be deposited into the app vault before listing");
      };
    };
  };

  /// Cancel a listing; NFT returned from escrow; caller must be owner or admin
  public shared ({ caller }) func cancelListing(listingId : MarketplaceTypes.ListingId) : async () {
    let isCallerAdmin = AuthLib.isAdmin(authState, caller);

    // Check authorization before cancelling
    switch (MarketplaceLib.getFixedListing(marketplaceState, listingId)) {
      case (?listing) {
        if (listing.status != #Active) Runtime.trap("Listing is not active");
        if (not Principal.equal(listing.seller, caller) and not isCallerAdmin) {
          Runtime.trap("Unauthorized: must be seller or admin");
        };
        if (not MarketplaceLib.acquireListingLock(marketplacePaymentState, listingId)) {
          Runtime.trap("Listing is processing another payment. Try again shortly.");
        };
        try {
        switch (MarketplaceLib.cancelListing(marketplaceState, listingId)) {
          case null Runtime.trap("Failed to cancel listing");
          case (?#Fixed(cancelled)) {
            let escrowedNFT = switch (MarketplaceLib.takeEscrowedNFT(marketplaceState, listingId)) {
              case null Runtime.trap("Escrowed NFT not found for fixed listing");
              case (?nft) nft;
            };
            let returnedLocation = await* transferEscrowedNFTToRecipient(escrowedNFT, cancelled.seller);
            ignore MarketplaceLib.clearListingsForToken(marketplaceState, escrowedNFT.collectionId, escrowedNFT.tokenId);
            ignore WalletLib.registerNFT(
              walletState,
              cancelled.seller,
              escrowedNFT.collectionId,
              escrowedNFT.tokenId,
              escrowedNFT.metadata,
              returnedLocation,
            );
          };
          case (?_) {};
        };
        } finally {
          MarketplaceLib.releaseListingLock(marketplacePaymentState, listingId);
        };
        return;
      };
      case null {};
    };

    switch (MarketplaceLib.getAuctionListing(marketplaceState, listingId)) {
      case (?listing) {
        if (listing.status != #Active) Runtime.trap("Listing is not active");
        if (not Principal.equal(listing.seller, caller) and not isCallerAdmin) {
          Runtime.trap("Unauthorized: must be seller or admin");
        };
        if (not MarketplaceLib.acquireListingLock(marketplacePaymentState, listingId)) {
          Runtime.trap("Auction is processing another payment. Try again shortly.");
        };
        try {
          let currentEscrow = MarketplaceLib.removeAuctionEscrow(marketplacePaymentState, listingId);
          switch (MarketplaceLib.cancelListing(marketplaceState, listingId)) {
            case null Runtime.trap("Failed to cancel listing");
            case (?#Auction(cancelled)) {
              let escrowedNFT = switch (MarketplaceLib.takeEscrowedNFT(marketplaceState, listingId)) {
                case null Runtime.trap("Escrowed NFT not found for auction listing");
                case (?nft) nft;
              };
              let returnedLocation = await* transferEscrowedNFTToRecipient(escrowedNFT, cancelled.seller);
              ignore MarketplaceLib.clearListingsForToken(marketplaceState, escrowedNFT.collectionId, escrowedNFT.tokenId);
              ignore WalletLib.registerNFT(
                walletState,
                cancelled.seller,
                escrowedNFT.collectionId,
                escrowedNFT.tokenId,
                escrowedNFT.metadata,
                returnedLocation,
              );
            };
            case (?_) {};
          };
          switch (currentEscrow) {
            case null {};
            case (?escrow) {
              MarketplaceLib.queueAuctionRefund(marketplacePaymentState, escrow);
              let ledger = actor (IcpLib.LEDGER_CANISTER_ID) : IcpLib.Ledger;
              let feeE8s = await* IcpLib.getTransferFee(ledger);
              switch (await* refundAuctionEscrow(ledger, escrow, feeE8s)) {
                case (#ok(_)) {
                  ignore MarketplaceLib.removePendingRefund(marketplacePaymentState, escrow.escrowId);
                };
                case (#err(_)) {};
              };
            };
          };
        } finally {
          MarketplaceLib.releaseListingLock(marketplacePaymentState, listingId);
        };
        return;
      };
      case null {};
    };

    Runtime.trap("Listing not found");
  };

  func refundAuctionEscrow(
    ledger : IcpLib.Ledger,
    escrow : MarketplaceTypes.AuctionEscrow,
    feeE8s : Nat64,
  ) : async* { #ok : Nat64; #err : Text } {
    let escrowSub = IcpLib.marketplaceEscrowSubaccount(escrow.escrowId);
    let bidderSub = IcpLib.principalToSubaccount(escrow.bidder);
    let bidderAccount = IcpLib.accountIdentifier(canisterId, bidderSub);
    let refundAmount = MarketplaceLib.auctionRefundPayoutAmount(escrow, feeE8s);
    let result = await* IcpLib.transferOutWithFee(
      ledger,
      ?escrowSub,
      bidderAccount,
      refundAmount,
      Nat64.fromNat(escrow.listingId),
      feeE8s,
    );
    switch (result) {
      case (#Ok(blockIndex)) #ok(blockIndex);
      case (#Err(error)) #err(IcpLib.transferErrorText(error));
    };
  };

  func prepareNFTForListing(nft : WalletTypes.WalletNFT, owner : Principal) : async* () {
    switch (nft.location) {
      case (#Minted) {
        await* transferMintedNFT(nft, owner, canisterId);
      };
      case (#Vaulted) {
        await* ensureEscrowedNFTReady(nft);
      };
      case (#Registered) {
        Runtime.trap("Deposit this external NFT into the app vault before listing it");
      };
    };
  };

  func transferEscrowedNFTToRecipient(
    nft : WalletTypes.WalletNFT,
    to : Principal,
  ) : async* WalletTypes.WalletLocation {
    switch (nft.location) {
      case (#Minted) {
        await* transferMintedNFT(nft, canisterId, to);
        #Minted;
      };
      case (#Vaulted) {
        ignore to;
        await* ensureEscrowedNFTReady(nft);
        #Vaulted;
      };
      case (#Registered) {
        Runtime.trap("Registered external NFTs are not escrowed by the marketplace");
      };
    };
  };

  func transferMintedNFT(
    nft : WalletTypes.WalletNFT,
    from : Principal,
    to : Principal,
  ) : async* () {
    let collection = mintedCollection(nft);
    let tokenId = switch (Nat.fromText(nft.tokenId)) {
      case null Runtime.trap("Minted token IDs must be numeric");
      case (?value) value;
    };
    if (Principal.equal(collection.canisterId, canisterId)) {
      ensureLocalMintedToken(collection, tokenId, from);
      switch (MintLib.transferToken(mintState, tokenId, from, to)) {
        case (#ok(_)) {};
        case (#err(message)) Runtime.trap(message);
      };
    } else {
      let child : MarketplaceChildCollectionActor = actor (collection.canisterId.toText());
      let result = try {
        await child.mintlab_transfer_from(from, to, tokenId);
      } catch (error) {
        Runtime.trap("Collection canister transfer failed: " # Error.message(error));
      };
      switch (result) {
        case (#ok(_)) {};
        case (#err(message)) Runtime.trap(message);
      };
    };
  };

  func ensureMintedNFTReady(
    nft : WalletTypes.WalletNFT,
    owner : Principal,
  ) : async* () {
    let collection = mintedCollection(nft);
    let tokenId = switch (Nat.fromText(nft.tokenId)) {
      case null Runtime.trap("Minted token IDs must be numeric");
      case (?value) value;
    };
    if (Principal.equal(collection.canisterId, canisterId)) {
      ensureLocalMintedToken(collection, tokenId, owner);
    } else {
      let child : MarketplaceChildCollectionActor = actor (collection.canisterId.toText());
      let owners = try {
        await child.mintlab_owner_of([tokenId]);
      } catch (error) {
        Runtime.trap("Collection canister ownership check failed: " # Error.message(error));
      };
      if (owners.size() == 0) {
        Runtime.trap("Collection canister returned no owner for this minted NFT");
      };
      switch (owners[0]) {
        case (?(account)) {
          if (not Principal.equal(account.owner, owner)) {
            Runtime.trap("Escrowed minted NFT is not held by the expected owner");
          };
        };
        case null Runtime.trap("Minted NFT not found on collection canister");
      };
    };
  };

  func mintedCollection(nft : WalletTypes.WalletNFT) : CollectionTypes.Collection {
    let collection = switch (CollectionsLib.getCollection(collectionsState, nft.collectionId)) {
      case null Runtime.trap("Collection not found for minted NFT");
      case (?value) value;
    };
    if (collection.kind != #Minted) {
      Runtime.trap("Minted wallet NFT does not belong to a Mintlab collection");
    };
    collection;
  };

  func externalCollection(nft : WalletTypes.WalletNFT) : CollectionTypes.Collection {
    let collection = switch (CollectionsLib.getCollection(collectionsState, nft.collectionId)) {
      case null Runtime.trap("Collection not found for external NFT");
      case (?value) value;
    };
    if (collection.kind != #External) {
      Runtime.trap("Vaulted wallet NFT does not belong to an external collection");
    };
    collection;
  };

  func ensureLocalMintedToken(
    collection : CollectionTypes.Collection,
    tokenId : Nat,
    owner : Principal,
  ) {
    switch (MintLib.getToken(mintState, tokenId)) {
      case null Runtime.trap("Minted token not found");
      case (?token) {
        if (
          not MintLib.tokenBelongsToCollection(
            token,
            collection.id,
            MintLib.getConfig(mintState).collectionId,
          )
        ) {
          Runtime.trap("This minted NFT does not belong to the selected collection");
        };
        if (not Principal.equal(token.owner, owner)) {
          Runtime.trap("You do not own this minted NFT");
        };
      };
    };
  };
};
