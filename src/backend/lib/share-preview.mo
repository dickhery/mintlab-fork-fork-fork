import Array "mo:core/Array";
import Char "mo:core/Char";
import Iter "mo:core/Iter";
import Nat "mo:core/Nat";
import Nat32 "mo:core/Nat32";
import Nat8 "mo:core/Nat8";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import CollectionsLib "collections";
import HttpMedia "http-media";
import ShareImageCacheLib "share-image-cache";
import ShareImageLib "share-image";
import MarketplaceLib "marketplace";
import MintLib "mint";
import WalletLib "wallet";
import CollectionTypes "../types/collections";
import WalletTypes "../types/wallet";

module {
  public type HeaderField = HttpMedia.HeaderField;
  public type HttpResponse = HttpMedia.HttpResponse;

  public type SharePreviewMetadata = {
    title : Text;
    description : Text;
    imageUrl : Text;
    canonicalUrl : Text;
    redirectUrl : Text;
  };

  public type SharePreviewContext = {
    siteOrigin : Text;
    backendCanisterId : Principal;
    collectionsState : CollectionsLib.CollectionsState;
    nftModerationState : CollectionsLib.NFTModerationState;
    walletState : WalletLib.WalletState;
    mintState : MintLib.MintState;
    marketplaceState : MarketplaceLib.MarketplaceState;
    marketplaceSettlementState : MarketplaceLib.MarketplaceSettlementState;
    marketplaceNoBidAuctionReturnState : MarketplaceLib.NoBidAuctionReturnState;
    marketplaceListingReturnState : MarketplaceLib.ListingReturnState;
    shareImageCacheState : ShareImageCacheLib.ShareImageCacheState;
  };

  public type ShareRoute = {
    #Listing : Nat;
    #Nft : { collectionId : Nat; tokenId : Text };
  };

  public let DEFAULT_OG_IMAGE : Text = "https://richardhery.com/mintlab-link-preview.png";
  public let DEFAULT_SITE_ORIGIN : Text = "https://mintlab.website";
  public let SHARE_PREVIEW_CACHE_CONTROL : Text = "public, max-age=300";

  func anonymousViewer() : Principal {
    Principal.fromText("2vxsx-fae");
  };

  public func parseShareRoute(url : Text) : ?ShareRoute {
    let path = pathFromUrl(url);
    let segments = pathSegments(path);
    if (segments.size() == 3 and segments[0] == "marketplace" and segments[1] == "listing") {
      switch (Nat.fromText(segments[2])) {
        case (?listingId) ?#Listing(listingId);
        case null null;
      };
    } else if (segments.size() == 3 and segments[0] == "nft") {
      switch (Nat.fromText(segments[1])) {
        case (?collectionId) {
          let tokenId = percentDecode(segments[2]);
          if (tokenId == "") {
            null;
          } else {
            ?#Nft({ collectionId; tokenId });
          };
        };
        case null null;
      };
    } else {
      null;
    };
  };

  public func resolveSharePreview(
    context : SharePreviewContext,
    route : ShareRoute,
  ) : ?SharePreviewMetadata {
    switch (route) {
      case (#Listing(listingId)) listingSharePreview(context, listingId);
      case (#Nft({ collectionId; tokenId })) nftSharePreview(context, collectionId, tokenId);
    };
  };

  public func sharePreviewResponse(metadata : SharePreviewMetadata) : HttpResponse {
    {
      status_code = 200;
      headers = [
        ("Content-Type", "text/html; charset=utf-8"),
        ("Cache-Control", SHARE_PREVIEW_CACHE_CONTROL),
        ("Access-Control-Allow-Origin", "*"),
      ];
      body = Text.encodeUtf8(sharePreviewHtml(metadata));
      upgrade = false;
    };
  };

  public func fallbackSharePreviewResponse(
    _siteOrigin : Text,
    redirectUrl : Text,
  ) : HttpResponse {
    sharePreviewResponse({
      title = "Mintlab";
      description = "Mintlab is a permissionless ICP NFT wallet, collection directory, and marketplace.";
      imageUrl = DEFAULT_OG_IMAGE;
      canonicalUrl = redirectUrl;
      redirectUrl;
    });
  };

  func listingSharePreview(context : SharePreviewContext, listingId : Nat) : ?SharePreviewMetadata {
    let fixed = MarketplaceLib.getFixedListing(context.marketplaceState, listingId);
    let auction = MarketplaceLib.getAuctionListing(context.marketplaceState, listingId);
    let listingActive = switch (fixed) {
      case (?listing) {
        listing.status == #Active and
        not MarketplaceLib.isListingSettling(context.marketplaceSettlementState, listingId) and
        not MarketplaceLib.isListingReturning(context.marketplaceListingReturnState, listingId);
      };
      case null {
        switch (auction) {
          case (?listing) {
            listing.status == #Active and
            not MarketplaceLib.isListingSettling(context.marketplaceSettlementState, listingId) and
            not MarketplaceLib.isNoBidAuctionReturning(
              context.marketplaceNoBidAuctionReturnState,
              listingId,
            ) and
            not MarketplaceLib.isListingReturning(context.marketplaceListingReturnState, listingId);
          };
          case null false;
        };
      };
    };
    if (not listingActive) {
      return null;
    };
    let nft = switch (MarketplaceLib.getEscrowedNFT(context.marketplaceState, listingId)) {
      case (?value) enrichKnownMintedNFT(context, value);
      case null return null;
    };
    if (not viewerCanSeeNFT(context, nft)) {
      return null;
    };
    let collection = CollectionsLib.getCollection(context.collectionsState, nft.collectionId);
    let name = nftDisplayName(nft, collection);
    let listingLabel = switch (fixed) {
      case (?_) "for sale";
      case null "at auction";
    };
    let description = switch (nft.metadata.description) {
      case (?value) if (value != "") value else (name # " is " # listingLabel # " on Mintlab Marketplace.");
      case null name # " is " # listingLabel # " on Mintlab Marketplace.";
    };
    let canonicalPath = "/marketplace/listing/" # Nat.toText(listingId);
    ?{
      title = name # " — Mintlab Marketplace";
      description = truncateDescription(description);
      imageUrl = absoluteOgImageUrl(context, collection, nft);
      canonicalUrl = joinOriginPath(context.siteOrigin, canonicalPath);
      redirectUrl = joinOriginPath(context.siteOrigin, canonicalPath);
    };
  };

  func nftSharePreview(
    context : SharePreviewContext,
    collectionId : Nat,
    tokenId : Text,
  ) : ?SharePreviewMetadata {
    let nft = switch (knownCollectionNFT(context, collectionId, tokenId)) {
      case (?value) value;
      case null return null;
    };
    if (not viewerCanSeeNFT(context, nft)) {
      return null;
    };
    let collection = CollectionsLib.getCollection(context.collectionsState, collectionId);
    let name = nftDisplayName(nft, collection);
    let description = switch (nft.metadata.description) {
      case (?value) if (value != "") value else (name # " on Mintlab.");
      case null name # " on Mintlab.";
    };
    let canonicalPath = "/nft/" # Nat.toText(collectionId) # "/" # urlEncodePathSegment(tokenId);
    ?{
      title = name # " — Mintlab";
      description = truncateDescription(description);
      imageUrl = absoluteOgImageUrl(context, collection, nft);
      canonicalUrl = joinOriginPath(context.siteOrigin, canonicalPath);
      redirectUrl = joinOriginPath(context.siteOrigin, canonicalPath);
    };
  };

  func knownCollectionNFT(
    context : SharePreviewContext,
    collectionId : CollectionTypes.CollectionId,
    tokenId : Text,
  ) : ?WalletTypes.WalletNFT {
    switch (WalletLib.findByCollectionToken(context.walletState, collectionId, tokenId)) {
      case (?nft) ?enrichKnownMintedNFT(context, nft);
      case null {
        switch (
          MarketplaceLib.findActiveEscrowedNFT(
            context.marketplaceState,
            collectionId,
            tokenId,
          )
        ) {
          case (?nft) ?enrichKnownMintedNFT(context, nft);
          case null null;
        };
      };
    };
  };

  func enrichKnownMintedNFT(
    context : SharePreviewContext,
    nft : WalletTypes.WalletNFT,
  ) : WalletTypes.WalletNFT {
    let collection = switch (CollectionsLib.getCollection(context.collectionsState, nft.collectionId)) {
      case null return nft;
      case (?value) value;
    };
    if (collection.kind != #Minted or not Principal.equal(collection.canisterId, context.backendCanisterId)) {
      return nft;
    };
    let tokenId = switch (Nat.fromText(nft.tokenId)) {
      case null return nft;
      case (?value) value;
    };
    let token = switch (MintLib.getToken(context.mintState, tokenId)) {
      case null return nft;
      case (?value) value;
    };
    if (
      not MintLib.tokenBelongsToCollection(
        token,
        collection.id,
        MintLib.getConfig(context.mintState).collectionId,
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

  func viewerCanSeeNFT(context : SharePreviewContext, nft : WalletTypes.WalletNFT) : Bool {
    switch (CollectionsLib.getCollection(context.collectionsState, nft.collectionId)) {
      case null false;
      case (?collection) {
        CollectionsLib.canViewerSeeCollection(
          context.collectionsState,
          collection,
          anonymousViewer(),
          false,
        ) and
        CollectionsLib.canViewerSeeNFT(
          context.nftModerationState,
          nft,
          anonymousViewer(),
          false,
        );
      };
    };
  };

  func nftDisplayName(nft : WalletTypes.WalletNFT, collection : ?CollectionTypes.Collection) : Text {
    switch (collection) {
      case null nftFallbackName(nft, null);
      case (?value) {
        switch (displayTokenId(nft, value)) {
          case (?displayId) value.name # " #" # displayId;
          case null nftFallbackName(nft, ?value);
        };
      };
    };
  };

  func nftFallbackName(nft : WalletTypes.WalletNFT, collection : ?CollectionTypes.Collection) : Text {
    switch (collection) {
      case (?value) value.name # " #" # nft.tokenId;
      case null "Mintlab NFT #" # nft.tokenId;
    };
  };

  func displayTokenId(nft : WalletTypes.WalletNFT, collection : CollectionTypes.Collection) : ?Text {
    switch (displayTokenIdFromAttributes(nft.metadata)) {
      case (?value) ?value;
      case null {
        switch (collection.standard) {
          case (#EXT) {
            switch (HttpMedia.extTokenIndexFromIdentifier(nft.tokenId, collection.canisterId)) {
              case (?index) ?Nat.toText(extDisplayTokenNumber(collection, index));
              case null null;
            };
          };
          case (_) null;
        };
      };
    };
  };

  func displayTokenIdFromAttributes(metadata : WalletTypes.NFTMetadata) : ?Text {
    for ((key, value) in metadata.attributes.values()) {
      let normalized = Text.toLower(Text.trim(key, #char ' '));
      if (
        normalized == "mintlab display token id" or
        normalized == "mintlab:display_token_id" or
        normalized == "display_token_id" or
        normalized == "display token id"
      ) {
        let trimmed = Text.trim(value, #char ' ');
        if (trimmed != "") {
          return ?trimmed;
        };
      };
    };
    null;
  };

  func extDisplayTokenNumber(collection : CollectionTypes.Collection, tokenIndex : Nat) : Nat {
    switch (collection.browseInfo) {
      case null tokenIndex + 1;
      case (?browseInfo) {
        let offset = switch (browseInfo.tokenIndexOffset) {
          case (?value) value;
          case null 0;
        };
        if (tokenIndex >= offset) {
          tokenIndex - offset + 1;
        } else {
          tokenIndex + 1;
        };
      };
    };
  };

  func absoluteOgImageUrl(
    context : SharePreviewContext,
    collection : ?CollectionTypes.Collection,
    nft : WalletTypes.WalletNFT,
  ) : Text {
    switch (ShareImageLib.shareImageUrlFromAttributes(nft)) {
      case (?value) return value;
      case null {};
    };
    let cacheKey = ShareImageCacheLib.cacheKey(nft.collectionId, nft.tokenId);
    switch (ShareImageCacheLib.get(context.shareImageCacheState, cacheKey)) {
      case (?cachedUrl) return ShareImageLib.normalizePreviewImageUrl(cachedUrl);
      case null {};
    };
    switch (collection) {
      case (?value) {
        switch (ShareImageLib.directImageFromMetadata(value, nft)) {
          case (?directUrl) return directUrl;
          case null {};
        };
      };
      case null {};
    };
    let rawImage = switch (nft.metadata.imageUrl) {
      case (?value) value;
      case null {
        switch (collection) {
          case (?value) value.imageUrl;
          case null "";
        };
      };
    };
    let resolved = switch (HttpMedia.publicImageUrl(rawImage)) {
      case (?value) value;
      case null {
        switch (collection) {
          case (?value) tokenAssetFallbackUrl(value.canisterId, nft.tokenId);
          case null DEFAULT_OG_IMAGE;
        };
      };
    };
    HttpMedia.sharePreviewImageUrl(resolved);
  };

  func tokenAssetFallbackUrl(canisterId : Principal, tokenId : Text) : Text {
    switch (Nat.fromText(tokenId)) {
      case (?numericTokenId) {
        switch (HttpMedia.tokenAssetUrl(canisterId, numericTokenId)) {
          case (?value) HttpMedia.sharePreviewImageUrl(value);
          case null DEFAULT_OG_IMAGE;
        };
      };
      case null HttpMedia.fullTokenAssetUrl(canisterId, tokenId);
    };
  };

  func sharePreviewHtml(metadata : SharePreviewMetadata) : Text {
    let title = escapeHtml(metadata.title);
    let description = escapeHtml(metadata.description);
    let imageUrl = escapeHtml(metadata.imageUrl);
    let canonicalUrl = escapeHtml(metadata.canonicalUrl);
    let redirectUrl = escapeHtml(metadata.redirectUrl);
    "<!DOCTYPE html><html lang=\"en\"><head><meta charset=\"utf-8\" />" #
    "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />" #
    "<title>" # title # "</title>" #
    "<meta name=\"description\" content=\"" # description # "\" />" #
    "<meta property=\"og:title\" content=\"" # title # "\" />" #
    "<meta property=\"og:description\" content=\"" # description # "\" />" #
    "<meta property=\"og:type\" content=\"website\" />" #
    "<meta property=\"og:url\" content=\"" # canonicalUrl # "\" />" #
    "<meta property=\"og:image\" content=\"" # imageUrl # "\" />" #
    "<meta property=\"og:image:secure_url\" content=\"" # imageUrl # "\" />" #
    "<meta property=\"og:image:alt\" content=\"" # title # "\" />" #
    "<meta name=\"twitter:card\" content=\"summary_large_image\" />" #
    "<meta name=\"twitter:title\" content=\"" # title # "\" />" #
    "<meta name=\"twitter:description\" content=\"" # description # "\" />" #
    "<meta name=\"twitter:image\" content=\"" # imageUrl # "\" />" #
    "<meta http-equiv=\"refresh\" content=\"0;url=" # redirectUrl # "\" />" #
    "<link rel=\"canonical\" href=\"" # canonicalUrl # "\" />" #
    "</head><body><p><a href=\"" # redirectUrl # "\">Open on Mintlab</a></p></body></html>";
  };

  func truncateDescription(description : Text) : Text {
    if (description.size() <= 300) {
      description;
    } else {
      let chars = Text.toArray(description);
      var result = "";
      var index = 0;
      while (index < 300 and index < chars.size()) {
        result #= Text.fromChar(chars[index]);
        index += 1;
      };
      result # "…";
    };
  };

  func joinOriginPath(origin : Text, path : Text) : Text {
    let trimmedOrigin = Text.trimEnd(origin, #char '/');
    if (Text.startsWith(path, #text "/")) {
      trimmedOrigin # path;
    } else {
      trimmedOrigin # "/" # path;
    };
  };

  func pathFromUrl(url : Text) : Text {
    let withoutQuery = stripQuery(url);
    var source = withoutQuery;
    if (Text.contains(withoutQuery, #text "://")) {
      let parts = Iter.toArray(Text.split(withoutQuery, #text "://"));
      if (parts.size() > 1) {
        source := parts[1];
      };
    };
    if (Text.startsWith(source, #text "/")) {
      source;
    } else {
      let segments = Iter.toArray(Text.split(source, #char '/'));
      if (segments.size() <= 1) {
        "/";
      } else {
        var path = "";
        var index = 1;
        while (index < segments.size()) {
          path #= "/" # segments[index];
          index += 1;
        };
        path;
      };
    };
  };

  func stripQuery(url : Text) : Text {
    switch (urlQueryPart(url)) {
      case (?queryText) {
        switch (Text.stripEnd(url, #text ("?" # queryText))) {
          case (?value) value;
          case null url;
        };
      };
      case null url;
    };
  };

  func pathSegments(path : Text) : [Text] {
    let trimmed = Text.trimStart(Text.trimEnd(path, #char '/'), #char '/');
    if (trimmed == "") {
      [];
    } else {
      Array.map<Text, Text>(
        Iter.toArray(Text.split(trimmed, #char '/')),
        func (segment : Text) : Text { percentDecode(segment) },
      );
    };
  };

  func urlQueryPart(url : Text) : ?Text {
    let parts = Text.split(url, #char '?');
    ignore parts.next();
    parts.next();
  };

  func escapeHtml(value : Text) : Text {
    var result = "";
    for (char in value.chars()) {
      let code = Char.toNat32(char);
      result #= if (char == '&') {
        "&amp;";
      } else if (char == '<') {
        "&lt;";
      } else if (char == '>') {
        "&gt;";
      } else if (code == 34) {
        "&quot;";
      } else if (char == '\'') {
        "&#39;";
      } else {
        Text.fromChar(char);
      };
    };
    result;
  };

  func percentDecode(value : Text) : Text {
    var result = "";
    let chars = Text.toArray(value);
    var index = 0;
    while (index < chars.size()) {
      let char = chars[index];
      if (char == '%' and index + 2 < chars.size()) {
        switch (hexValue(chars[index + 1]), hexValue(chars[index + 2])) {
          case (?high, ?low) {
            result #= Text.fromChar(Char.fromNat32(Nat32.fromNat(high * 16 + low)));
            index += 3;
            continue;
          };
          case (_, _) {};
        };
      };
      result #= Text.fromChar(char);
      index += 1;
    };
    result;
  };

  func urlEncodePathSegment(value : Text) : Text {
    var result = "";
    for (char in value.chars()) {
      let code = Nat32.toNat(Char.toNat32(char));
      if (
        (code >= 48 and code <= 57) or
        (code >= 65 and code <= 90) or
        (code >= 97 and code <= 122) or
        char == '-' or char == '_' or char == '.' or char == '~'
      ) {
        result #= Text.fromChar(char);
      } else {
        result #= "%" # hexByte(Nat8.fromNat(code));
      };
    };
    result;
  };

  func hexValue(char : Char) : ?Nat {
    let code = Nat32.toNat(Char.toNat32(char));
    if (code >= 48 and code <= 57) {
      ?(code - 48);
    } else if (code >= 65 and code <= 70) {
      ?(code - 55);
    } else if (code >= 97 and code <= 102) {
      ?(code - 87);
    } else {
      null;
    };
  };

  func hexByte(value : Nat8) : Text {
    let number = Nat8.toNat(value);
    let high = number / 16;
    let low = number % 16;
    Text.fromChar(hexChar(high)) # Text.fromChar(hexChar(low));
  };

  func hexChar(value : Nat) : Char {
    if (value < 10) {
      Char.fromNat32(Nat32.fromNat(48 + value));
    } else {
      Char.fromNat32(Nat32.fromNat(55 + value));
    };
  };
};