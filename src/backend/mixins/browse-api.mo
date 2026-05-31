import Array "mo:core/Array";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import WalletLib "../lib/wallet";
import IcpLib "../lib/icp";
import MarketplaceLib "../lib/marketplace";
import MintLib "../lib/mint";
import AuthLib "../lib/auth";
import CollectionLib "../lib/collections";
import NFTStandards "../lib/nft-standards";
import BrowseTypes "../types/browse";
import WalletTypes "../types/wallet";
import CollectionTypes "../types/collections";
import MintTypes "../types/mint";

mixin (
  walletState : WalletLib.WalletState,
  collectionsState : CollectionLib.CollectionsState,
  marketplaceState : MarketplaceLib.MarketplaceState,
  mintState : MintLib.MintState,
  authState : AuthLib.AdminState,
  nftModerationState : CollectionLib.NFTModerationState,
  canisterId : Principal,
) {
  let DEFAULT_COLLECTION_PAGE_SIZE : Nat = 24;
  let MAX_COLLECTION_PAGE_SIZE : Nat = 40;
  let MAX_RICH_METADATA_PAGE_SIZE : Nat = 8;

  public shared ({ caller }) func getCollectionBrowseStats(
    collectionId : CollectionTypes.CollectionId
  ) : async BrowseTypes.CollectionBrowseStats {
    let collection = switch (CollectionLib.getCollection(collectionsState, collectionId)) {
      case null {
        return {
          collectionId;
          totalCount = 0;
          visibleCount = 0;
          coverage = #Partial;
          note = "Collection not found.";
        };
      };
      case (?value) value;
    };
    await* loadCollectionBrowseStats(collection, caller);
  };

  public shared ({ caller }) func getCollectionNFTPage(
    collectionId : CollectionTypes.CollectionId,
    cursor : ?Text,
    limit : ?Nat,
  ) : async BrowseTypes.CollectionNFTPage {
    let collection = switch (CollectionLib.getCollection(collectionsState, collectionId)) {
      case null {
        return {
          nfts = [];
          nextCursor = null;
          totalCount = 0;
          coverage = #Partial;
          note = "Collection not found.";
        };
      };
      case (?value) value;
    };
    await* loadCollectionNFTPage(collection, cursor, normalizeCollectionPageSize(collection, limit), caller);
  };

  public shared ({ caller }) func getCollectionNFTs(
    collectionId : CollectionTypes.CollectionId,
  ) : async [WalletTypes.WalletNFT] {
    let collection = switch (CollectionLib.getCollection(collectionsState, collectionId)) {
      case null return [];
      case (?value) value;
    };

    var cursor : ?Text = null;
    var allNFTs : [WalletTypes.WalletNFT] = [];

    if (collectionUsesRichMetadataPages(collection)) {
      let page = await* loadCollectionNFTPage(
        collection,
        null,
        normalizeCollectionPageSize(collection, ?MAX_COLLECTION_PAGE_SIZE),
        caller,
      );
      return page.nfts;
    };

    label paginate loop {
      let page = await* loadCollectionNFTPage(
        collection,
        cursor,
        normalizeCollectionPageSize(collection, ?MAX_COLLECTION_PAGE_SIZE),
        caller,
      );
      allNFTs := Array.concat<WalletTypes.WalletNFT>(allNFTs, page.nfts);
      switch (page.nextCursor) {
        case null break paginate;
        case (?nextCursor) cursor := ?nextCursor;
      };
    };

    allNFTs;
  };

  public shared query ({ caller }) func getCollectionNFT(
    collectionId : CollectionTypes.CollectionId,
    tokenId : Text,
  ) : async ?WalletTypes.WalletNFT {
    switch (knownCollectionNFT(collectionId, tokenId)) {
      case (?nft) {
        if (viewerCanSeeNFT(nft, caller)) ?nft else null;
      };
      case null null;
    };
  };

  public shared ({ caller }) func lookupCollectionNFT(
    collectionId : CollectionTypes.CollectionId,
    tokenId : Text,
  ) : async { #ok : ?WalletTypes.WalletNFT; #err : Text } {
    let requestedTokenId = Text.trim(tokenId, #char ' ');
    if (requestedTokenId == "") {
      return #err("Enter a token ID to search this collection");
    };
    switch (knownCollectionNFT(collectionId, requestedTokenId)) {
      case (?nft) {
        let visible = if (viewerCanSeeNFT(nft, caller)) ?nft else null;
        return #ok(visible);
      };
      case null {};
    };
    let collection = switch (CollectionLib.getCollection(collectionsState, collectionId)) {
      case null return #err("Collection not found");
      case (?value) value;
    };
    if (collection.kind == #Minted and Principal.equal(collection.canisterId, canisterId)) {
      let parsedTokenId = switch (Nat.fromText(requestedTokenId)) {
        case null return #err("Enter a numeric token ID for this Mintlab collection");
        case (?value) value;
      };
      switch (MintLib.getToken(mintState, parsedTokenId)) {
        case null return #ok(null);
        case (?token) {
          if (
            not MintLib.tokenBelongsToCollection(
              token,
              collection.id,
              MintLib.getConfig(mintState).collectionId,
            )
          ) {
            return #ok(null);
          };
          let nft = resolveMintedCollectionNFT(
              collection.id,
              Nat.toText(token.tokenId),
              token.owner,
              token.metadata,
              token.tokenId,
            );
          let visible = if (viewerCanSeeNFT(nft, caller)) ?nft else null;
          return #ok(visible);
        };
      };
    };
    switch (await* WalletLib.previewCollectionNFT(collection, requestedTokenId)) {
      case (#ok(nft)) {
        let reconciled = reconcileCollectionNFT(nft);
        let visible = if (viewerCanSeeNFT(reconciled, caller)) ?reconciled else null;
        #ok(visible);
      };
      case (#err(message)) #err(message);
    };
  };

  func knownCollectionNFT(
    collectionId : CollectionTypes.CollectionId,
    tokenId : Text,
  ) : ?WalletTypes.WalletNFT {
    switch (WalletLib.findByCollectionToken(walletState, collectionId, tokenId)) {
      case (?nft) ?browseEnrichKnownMintedNFT(nft);
      case null {
        switch (MarketplaceLib.findActiveEscrowedNFT(marketplaceState, collectionId, tokenId)) {
          case (?nft) ?browseEnrichKnownMintedNFT(nft);
          case null null;
        };
      };
    };
  };

  public query func isNFTInUserWallet(
    collectionId : CollectionTypes.CollectionId,
    tokenId : Text,
    user : WalletTypes.UserId,
  ) : async Bool {
    switch (WalletLib.findByCollectionToken(walletState, collectionId, tokenId)) {
      case null {
        switch (MarketplaceLib.findActiveEscrowedNFT(marketplaceState, collectionId, tokenId)) {
          case null false;
          case (?nft) Principal.equal(nft.owner, user);
        };
      };
      case (?nft) Principal.equal(nft.owner, user);
    };
  };

  public shared ({ caller }) func previewMyCollectionNFTs(
    collectionId : CollectionTypes.CollectionId,
  ) : async { #ok : [WalletTypes.WalletNFT]; #err : Text } {
    if (Principal.isAnonymous(caller)) {
      return #err("You must be signed in to preview collection ownership");
    };
    let collection = switch (CollectionLib.getCollection(collectionsState, collectionId)) {
      case null return #err("Collection not found");
      case (?value) value;
    };
    switch (collection.kind) {
      case (#Minted) {
        if (not Principal.equal(collection.canisterId, canisterId)) {
          let accountId = IcpLib.accountIdentifier(caller, IcpLib.zeroSubaccount());
          let preview = await* WalletLib.previewUserOwnedNFTs(collection, caller, accountId);
          switch (preview) {
            case (#err(message)) return #err(message);
            case (#ok(nfts)) {
              return #ok(
                browseMergeDistinctNFTs(
                  nfts,
                  MarketplaceLib.getActiveEscrowedNFTsBySellerAndCollection(
                    marketplaceState,
                    caller,
                    collectionId,
                  ),
                )
              );
            };
          };
        };
        var minted : [WalletTypes.WalletNFT] = [];
        for (
          token in MintLib.ownerTokensForCollection(
            mintState,
            caller,
            collectionId,
            MintLib.getConfig(mintState).collectionId,
          ).values()
        ) {
          let tokenId = Nat.toText(token.tokenId);
          let nft = resolveMintedCollectionNFT(collectionId, tokenId, token.owner, token.metadata, token.tokenId);
          minted := Array.concat<WalletTypes.WalletNFT>(minted, [nft]);
        };
        #ok(
          browseMergeDistinctNFTs(
            minted,
            MarketplaceLib.getActiveEscrowedNFTsBySellerAndCollection(
              marketplaceState,
              caller,
              collectionId,
            ),
          )
        );
      };
      case (#External) {
        let accountId = IcpLib.accountIdentifier(caller, IcpLib.zeroSubaccount());
        let preview = await* WalletLib.previewUserOwnedNFTs(collection, caller, accountId);
        switch (preview) {
          case (#err(message)) #err(message);
          case (#ok(nfts)) {
            #ok(
              browseMergeDistinctNFTs(
                nfts,
                MarketplaceLib.getActiveEscrowedNFTsBySellerAndCollection(
                  marketplaceState,
                  caller,
                  collectionId,
                ),
              )
            );
          };
        };
      };
    };
  };

  func loadCollectionBrowseStats(
    collection : CollectionTypes.Collection,
    viewer : Principal,
  ) : async* BrowseTypes.CollectionBrowseStats {
    let visibleNFTs = visibleCollectionNFTs(collection.id, viewer);
    let viewerIsAdmin = AuthLib.isAdmin(authState, viewer);
    switch (collection.kind) {
      case (#Minted) {
        if (not Principal.equal(collection.canisterId, canisterId)) {
          let canister : NFTStandards.ICRC7Actor = actor (collection.canisterId.toText());
          let totalCount = try {
            await canister.icrc7_total_supply();
          } catch (_) {
            switch (configuredBrowseSupply(collection)) {
              case (?configuredTotal) {
                return {
                  collectionId = collection.id;
                  totalCount = configuredTotal;
                  visibleCount = if (viewerIsAdmin) configuredTotal else CollectionLib.visibleNFTTotal(nftModerationState, collection.id, configuredTotal);
                  coverage = #Full;
                  note = "Mintlab can browse this dedicated ICRC-7 collection using the configured token range.";
                };
              };
              case null {
                return partialBrowseStats(
                  collection.id,
                  visibleNFTs.size(),
                  "Mintlab could not reach this collection canister just now, so it is showing the NFTs it has already indexed."
                );
              };
            };
          };
          return {
            collectionId = collection.id;
            totalCount;
            visibleCount = if (viewerIsAdmin) totalCount else CollectionLib.visibleNFTTotal(nftModerationState, collection.id, totalCount);
            coverage = #Full;
            note = "Mintlab can browse this dedicated ICRC-7 collection canister directly.";
          };
        };
        let tokens = MintLib.tokensForCollection(
          mintState,
          collection.id,
          MintLib.getConfig(mintState).collectionId,
        );
        let totalCount = tokens.size();
        let visibleCount = if (viewerIsAdmin) totalCount else countVisibleMintedTokens(collection.id, tokens, viewer);
        {
          collectionId = collection.id;
          totalCount;
          visibleCount;
          coverage = #Full;
          note = "Mintlab can browse every NFT minted in this collection.";
        };
      };
      case (#External) {
        switch (collection.standard) {
          case (#ICRC7) {
            let canister : NFTStandards.ICRC7Actor = actor (collection.canisterId.toText());
            let totalCount = try {
              await canister.icrc7_total_supply();
            } catch (error) {
              ignore error;
              return switch (configuredBrowseSupply(collection)) {
                case (?configuredTotal) {
                  {
                    collectionId = collection.id;
                    totalCount = configuredTotal;
                    visibleCount = if (viewerIsAdmin) configuredTotal else CollectionLib.visibleNFTTotal(nftModerationState, collection.id, configuredTotal);
                    coverage = #Full;
                    note = "Mintlab can browse the full ICRC-7 collection using the imported token range.";
                  };
                };
                case null {
                  partialBrowseStats(
                    collection.id,
                    visibleNFTs.size(),
                    "Mintlab could not reach the collection canister just now, so it is showing the NFTs it has already indexed."
                  );
                };
              };
            };
            {
              collectionId = collection.id;
              totalCount;
              visibleCount = if (viewerIsAdmin) totalCount else CollectionLib.visibleNFTTotal(nftModerationState, collection.id, totalCount);
              coverage = #Full;
              note = "Mintlab can browse the full ICRC-7 collection directly from the collection canister.";
            };
          };
          case (#EXT) {
            switch (configuredBrowseSupply(collection)) {
              case (?totalCount) {
                {
                  collectionId = collection.id;
                  totalCount;
                  visibleCount = if (viewerIsAdmin) totalCount else CollectionLib.visibleNFTTotal(nftModerationState, collection.id, totalCount);
                  coverage = #Full;
                  note = "Mintlab can browse the full EXT collection using the imported token range.";
                };
              };
              case null {
                partialBrowseStats(
                  collection.id,
                  visibleNFTs.size(),
                  "Mintlab needs the collection size for this EXT import before it can browse every NFT."
                );
              };
            };
          };
          case (#DIP721) {
            switch (configuredBrowseSupply(collection)) {
              case (?totalCount) {
                {
                  collectionId = collection.id;
                  totalCount;
                  visibleCount = if (viewerIsAdmin) totalCount else CollectionLib.visibleNFTTotal(nftModerationState, collection.id, totalCount);
                  coverage = #Full;
                  note = "Mintlab can browse the full DIP721 collection using the imported token range.";
                };
              };
              case null {
                partialBrowseStats(
                  collection.id,
                  visibleNFTs.size(),
                  "Mintlab needs the collection size for this DIP721 import before it can browse every NFT."
                );
              };
            };
          };
          case (#Other(standardName)) {
            partialBrowseStats(
              collection.id,
              visibleNFTs.size(),
              "Mintlab does not support collection-wide browsing for '" # standardName # "' imports."
            );
          };
        };
      };
    };
  };

  func loadCollectionNFTPage(
    collection : CollectionTypes.Collection,
    cursor : ?Text,
    limit : Nat,
    viewer : Principal,
  ) : async* BrowseTypes.CollectionNFTPage {
    switch (collection.kind) {
      case (#Minted) await* mintedCollectionPage(collection, cursor, limit, viewer);
      case (#External) {
        switch (await* WalletLib.previewCollectionNFTPage(collection, cursor, limit)) {
          case (#ok(page)) {
            let reconciled = reconcileCollectionNFTs(page.nfts);
            {
              page with
              nfts = filterNFTsForViewer(reconciled, viewer);
              totalCount = if (AuthLib.isAdmin(authState, viewer)) page.totalCount else CollectionLib.visibleNFTTotal(nftModerationState, collection.id, page.totalCount);
            };
          };
          case (#err(_)) partialCollectionPage(collection, cursor, limit, viewer);
        };
      };
    };
  };

  func mintedCollectionPage(
    collection : CollectionTypes.Collection,
    cursor : ?Text,
    limit : Nat,
    viewer : Principal,
  ) : async* BrowseTypes.CollectionNFTPage {
    if (not Principal.equal(collection.canisterId, canisterId)) {
      switch (await* WalletLib.previewCollectionNFTPage(collection, cursor, limit)) {
        case (#ok(page)) {
          let reconciled = reconcileCollectionNFTs(page.nfts);
          return {
            page with
            nfts = filterNFTsForViewer(reconciled, viewer);
            totalCount = if (AuthLib.isAdmin(authState, viewer)) page.totalCount else CollectionLib.visibleNFTTotal(nftModerationState, collection.id, page.totalCount);
            note = "Mintlab can browse this dedicated ICRC-7 collection canister directly.";
          };
        };
        case (#err(_)) return partialCollectionPage(collection, cursor, limit, viewer);
      };
    };
    let previousTokenId = textToNatOrDefault(cursor, 0);
    let pageSize = normalizePageSize(?limit);
    let tokens = MintLib.tokensForCollection(
      mintState,
      collection.id,
      MintLib.getConfig(mintState).collectionId,
    );
    let totalCount = countVisibleMintedTokens(collection.id, tokens, viewer);
    var pageNFTs : [WalletTypes.WalletNFT] = [];
    var pageCount : Nat = 0;
    var lastTokenId : ?Text = null;
    var hasMore = false;

    for (token in tokens.values()) {
      if (token.tokenId <= previousTokenId) {
        continue;
      };
      let tokenId = Nat.toText(token.tokenId);
      let nft = resolveMintedCollectionNFT(
        collection.id,
        tokenId,
        token.owner,
        token.metadata,
        token.tokenId,
      );
      if (not viewerCanSeeNFT(nft, viewer)) {
        continue;
      };
      if (pageCount >= pageSize) {
        hasMore := true;
        continue;
      };
      pageNFTs := Array.concat<WalletTypes.WalletNFT>(
        pageNFTs,
        [nft],
      );
      pageCount += 1;
      lastTokenId := ?tokenId;
    };

    {
      nfts = pageNFTs;
      nextCursor = if (hasMore) lastTokenId else null;
      totalCount;
      coverage = #Full;
      note = "Mintlab can browse every NFT minted in this collection.";
    };
  };

  func partialCollectionPage(
    collection : CollectionTypes.Collection,
    cursor : ?Text,
    limit : Nat,
    viewer : Principal,
  ) : BrowseTypes.CollectionNFTPage {
    let visibleNFTs = visibleCollectionNFTs(collection.id, viewer);
    let start = textToNatOrDefault(cursor, 0);
    let pageSize = normalizePageSize(?limit);
    let pageNFTs = sliceNFTs(visibleNFTs, start, pageSize);
    let nextStart = start + pageNFTs.size();

    {
      nfts = pageNFTs;
      nextCursor = if (nextStart < visibleNFTs.size()) {
        ?Nat.toText(nextStart);
      } else {
        null;
      };
      totalCount = visibleNFTs.size();
      coverage = #Partial;
      note = partialBrowseNote(collection);
    };
  };

  func resolveMintedCollectionNFT(
    collectionId : CollectionTypes.CollectionId,
    tokenId : Text,
    owner : Principal,
    metadata : WalletTypes.NFTMetadata,
    syntheticId : Nat,
  ) : WalletTypes.WalletNFT {
    switch (WalletLib.findByCollectionToken(walletState, collectionId, tokenId)) {
      case (?existing) {
        {
          existing with
          metadata = WalletLib.mergeMetadata(
            MintLib.publicMetadata(metadata),
            existing.metadata,
          );
        };
      };
      case null {
        {
          id = syntheticId;
          owner;
          collectionId;
          tokenId;
          metadata = MintLib.publicMetadata(metadata);
          location = #Minted;
          registeredAt = 0;
        };
      };
    };
  };

  func reconcileCollectionNFTs(
    nfts : [WalletTypes.WalletNFT]
  ) : [WalletTypes.WalletNFT] {
    var resolved : [WalletTypes.WalletNFT] = [];
    for (nft in nfts.values()) {
      resolved := Array.concat<WalletTypes.WalletNFT>(
        resolved,
        [reconcileCollectionNFT(nft)],
      );
    };
    resolved;
  };

  func reconcileCollectionNFT(nft : WalletTypes.WalletNFT) : WalletTypes.WalletNFT {
    switch (WalletLib.findByCollectionToken(walletState, nft.collectionId, nft.tokenId)) {
      case (?existing) browseEnrichKnownMintedNFT(existing);
      case null {
        switch (
          MarketplaceLib.findActiveEscrowedNFT(
            marketplaceState,
            nft.collectionId,
            nft.tokenId,
          )
        ) {
          case (?escrowed) browseEnrichKnownMintedNFT(escrowed);
          case null browseEnrichKnownMintedNFT(nft);
        };
      };
    };
  };

  func browseEnrichKnownMintedNFT(nft : WalletTypes.WalletNFT) : WalletTypes.WalletNFT {
    let collection = switch (CollectionLib.getCollection(collectionsState, nft.collectionId)) {
      case null return nft;
      case (?value) value;
    };
    if (collection.kind != #Minted or not Principal.equal(collection.canisterId, canisterId)) {
      return nft;
    };
    let tokenId = switch (Nat.fromText(nft.tokenId)) {
      case null return nft;
      case (?value) value;
    };
    let token = switch (MintLib.getToken(mintState, tokenId)) {
      case null return nft;
      case (?value) value;
    };
    if (
      not MintLib.tokenBelongsToCollection(
        token,
        collection.id,
        MintLib.getConfig(mintState).collectionId,
      )
    ) {
      return nft;
    };
    {
      nft with
      metadata = WalletLib.mergeMetadata(
        MintLib.publicMetadata(token.metadata),
        nft.metadata,
      );
    };
  };

  func visibleCollectionNFTs(
    collectionId : CollectionTypes.CollectionId,
    viewer : Principal,
  ) : [WalletTypes.WalletNFT] {
    var knownNFTs : [WalletTypes.WalletNFT] = [];
    for ((_, nft) in Map.entries(walletState.nfts)) {
      if (nft.collectionId == collectionId) {
        knownNFTs := Array.concat<WalletTypes.WalletNFT>(knownNFTs, [browseEnrichKnownMintedNFT(nft)]);
      };
    };
    filterNFTsForViewer(
      browseMergeDistinctNFTs(
      knownNFTs,
      MarketplaceLib.getActiveEscrowedNFTsByCollection(
        marketplaceState,
        collectionId,
      ),
      ),
      viewer,
    );
  };

  func filterNFTsForViewer(
    nfts : [WalletTypes.WalletNFT],
    viewer : Principal,
  ) : [WalletTypes.WalletNFT] {
    var visible : [WalletTypes.WalletNFT] = [];
    for (nft in nfts.values()) {
      if (viewerCanSeeNFT(nft, viewer)) {
        visible := Array.concat<WalletTypes.WalletNFT>(visible, [nft]);
      };
    };
    visible;
  };

  func viewerCanSeeNFT(nft : WalletTypes.WalletNFT, viewer : Principal) : Bool {
    CollectionLib.canViewerSeeNFT(
      nftModerationState,
      nft,
      viewer,
      AuthLib.isAdmin(authState, viewer),
    );
  };

  func countVisibleMintedTokens(
    collectionId : CollectionTypes.CollectionId,
    tokens : [MintTypes.MintedToken],
    viewer : Principal,
  ) : Nat {
    var count : Nat = 0;
    for (token in tokens.values()) {
      let tokenId = Nat.toText(token.tokenId);
      let nft = resolveMintedCollectionNFT(
        collectionId,
        tokenId,
        token.owner,
        token.metadata,
        token.tokenId,
      );
      if (viewerCanSeeNFT(nft, viewer)) {
        count += 1;
      };
    };
    count;
  };

  func partialBrowseStats(
    collectionId : CollectionTypes.CollectionId,
    visibleCount : Nat,
    note : Text,
  ) : BrowseTypes.CollectionBrowseStats {
    {
      collectionId;
      totalCount = visibleCount;
      visibleCount;
      coverage = #Partial;
      note;
    };
  };

  func partialBrowseNote(collection : CollectionTypes.Collection) : Text {
    switch (collection.standard) {
      case (#EXT) {
        "Mintlab is showing the EXT NFTs it has already indexed. Add the collection size to enable full collection browsing."
      };
      case (#DIP721) {
        "Mintlab is showing the DIP721 NFTs it has already indexed. Add the collection size to enable full collection browsing."
      };
      case (#ICRC7) {
        "Mintlab is showing the ICRC-7 NFTs it has already indexed. Add the collection size and first token index if this canister does not enumerate tokens reliably."
      };
      case (#Other(standardName)) {
        "Mintlab is showing the NFTs it has already indexed because '" # standardName # "' does not support full collection browsing here."
      };
    };
  };

  func configuredBrowseSupply(collection : CollectionTypes.Collection) : ?Nat {
    switch (collection.browseInfo) {
      case null null;
      case (?browseInfo) browseInfo.totalSupply;
    };
  };

  func sliceNFTs(
    nfts : [WalletTypes.WalletNFT],
    start : Nat,
    limit : Nat,
  ) : [WalletTypes.WalletNFT] {
    var page : [WalletTypes.WalletNFT] = [];
    var index : Nat = 0;
    var added : Nat = 0;
    for (nft in nfts.values()) {
      if (index < start) {
        index += 1;
        continue;
      };
      if (added >= limit) {
        break;
      };
      page := Array.concat<WalletTypes.WalletNFT>(page, [nft]);
      added += 1;
      index += 1;
    };
    page;
  };

  func textToNatOrDefault(value : ?Text, fallback : Nat) : Nat {
    switch (value) {
      case null fallback;
      case (?textValue) {
        switch (Nat.fromText(textValue)) {
          case (?parsed) parsed;
          case null fallback;
        };
      };
    };
  };

  func normalizePageSize(limit : ?Nat) : Nat {
    switch (limit) {
      case null DEFAULT_COLLECTION_PAGE_SIZE;
      case (?value) {
        if (value == 0) {
          1;
        } else if (value > MAX_COLLECTION_PAGE_SIZE) {
          MAX_COLLECTION_PAGE_SIZE;
        } else {
          value;
        };
      };
    };
  };

  func normalizeCollectionPageSize(
    collection : CollectionTypes.Collection,
    limit : ?Nat,
  ) : Nat {
    let pageSize = normalizePageSize(limit);
    if (collectionUsesRichMetadataPages(collection) and pageSize > MAX_RICH_METADATA_PAGE_SIZE) {
      MAX_RICH_METADATA_PAGE_SIZE;
    } else {
      pageSize;
    };
  };

  func collectionUsesRichMetadataPages(collection : CollectionTypes.Collection) : Bool {
    switch (collection.kind) {
      case (#Minted) true;
      case (#External) {
        switch (collection.standard) {
          case (#ICRC7) true;
          case (_) false;
        };
      };
    };
  };

  func browseMergeDistinctNFTs(
    primary : [WalletTypes.WalletNFT],
    secondary : [WalletTypes.WalletNFT],
  ) : [WalletTypes.WalletNFT] {
    var merged = primary;
    for (nft in secondary.values()) {
      if (not browseContainsCollectionToken(merged, nft.collectionId, nft.tokenId)) {
        merged := Array.concat<WalletTypes.WalletNFT>(merged, [nft]);
      };
    };
    merged;
  };

  func browseContainsCollectionToken(
    nfts : [WalletTypes.WalletNFT],
    collectionId : WalletTypes.CollectionId,
    tokenId : Text,
  ) : Bool {
    for (nft in nfts.values()) {
      if (nft.collectionId == collectionId and nft.tokenId == tokenId) {
        return true;
      };
    };
    false;
  };
};
