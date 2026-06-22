import Array "mo:core/Array";
import Blob "mo:core/Blob";
import Char "mo:core/Char";
import Nat32 "mo:core/Nat32";
import HttpMedia "http-media";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import CollectionTypes "../types/collections";
import WalletTypes "../types/wallet";

module {
  public let SHARE_IMAGE_ATTRIBUTE_KEY : Text = "Mintlab Share Image URL";

  public type HttpHeader = { name : Text; value : Text };

  public type HttpResponse = {
    status : Nat;
    body : Blob;
    headers : [HttpHeader];
  };

  public func cacheKey(collectionId : Nat, tokenId : Text) : Text {
    Nat.toText(collectionId) # "/" # tokenId;
  };

  public func normalizePreviewImageUrl(url : Text) : Text {
    let normalized = HttpMedia.sharePreviewImageUrl(url);
    Text.replace(
      Text.replace(normalized, #text ".raw.ic0.app", ".raw.icp0.io"),
      #text ".ic0.app",
      ".icp0.io",
    );
  };

  public func isIcAssetEndpointUrl(url : Text) : Bool {
    Text.contains(url, #text ".raw.icp0.io") or
    Text.contains(url, #text ".raw.ic0.app") or
    Text.contains(url, #text ".icp0.io/?") or
    Text.contains(url, #text ".ic0.app/?");
  };

  public func isLikelyDirectRasterImageUrl(url : Text) : Bool {
    let normalized = Text.toLower(url);
    if (not (Text.startsWith(normalized, #text "https://") or Text.startsWith(normalized, #text "http://"))) {
      return false;
    };
    if (isIcAssetEndpointUrl(normalized)) {
      return false;
    };
    Text.contains(normalized, #text ".jpg") or
    Text.contains(normalized, #text ".jpeg") or
    Text.contains(normalized, #text ".png") or
    Text.contains(normalized, #text ".webp") or
    Text.contains(normalized, #text ".gif") or
    Text.contains(normalized, #text "ipfs.io/ipfs/") or
    Text.contains(normalized, #text "arweave.net/");
  };

  public func shareImageUrlFromAttributes(nft : WalletTypes.WalletNFT) : ?Text {
    for ((key, value) in nft.metadata.attributes.values()) {
      if (key == SHARE_IMAGE_ATTRIBUTE_KEY and value != "") {
        return ?normalizePreviewImageUrl(value);
      };
    };
    null;
  };

  public func withShareImageAttribute(
    nft : WalletTypes.WalletNFT,
    imageUrl : Text,
  ) : WalletTypes.WalletNFT {
    let normalized = normalizePreviewImageUrl(imageUrl);
    var attributes = nft.metadata.attributes;
    var found = false;
    var updated : [(Text, Text)] = [];
    for ((key, value) in attributes.values()) {
      if (key == SHARE_IMAGE_ATTRIBUTE_KEY) {
        found := true;
        updated := Array.concat(updated, [(key, normalized)]);
      } else {
        updated := Array.concat(updated, [(key, value)]);
      };
    };
    if (not found) {
      updated := Array.concat(updated, [(SHARE_IMAGE_ATTRIBUTE_KEY, normalized)]);
    };
    {
      nft with
      metadata = {
        nft.metadata with
        attributes = updated;
      };
    };
  };

  public func candidateImageUrls(
    collection : CollectionTypes.Collection,
    nft : WalletTypes.WalletNFT,
  ) : [Text] {
    var candidates : [Text] = [];
    switch (shareImageUrlFromAttributes(nft)) {
      case (?value) candidates := pushUnique(candidates, value);
      case null {};
    };
    switch (nft.metadata.imageUrl) {
      case (?value) {
        if (value != "") {
          candidates := pushUnique(candidates, value);
          candidates := pushUnique(candidates, HttpMedia.withoutThumbnailParam(value));
        };
      };
      case null {};
    };
    if (collection.imageUrl != "") {
      candidates := pushUnique(candidates, collection.imageUrl);
    };
    for ((_, value) in nft.metadata.attributes.values()) {
      let trimmed = Text.trim(value, #char ' ');
      if (trimmed != "" and isLikelyDirectRasterImageUrl(trimmed)) {
        candidates := pushUnique(candidates, trimmed);
      };
    };
    switch (HttpMedia.publicImageUrl(switch (nft.metadata.imageUrl) { case (?value) value; case null "" })) {
      case (?value) {
        candidates := pushUnique(candidates, value);
      };
      case null {};
    };
    switch (Nat.fromText(nft.tokenId)) {
      case (?numericTokenId) {
        switch (HttpMedia.tokenAssetUrl(collection.canisterId, numericTokenId)) {
          case (?value) candidates := pushUnique(candidates, value);
          case null {};
        };
      };
      case null {
        let fullTokenUrl = HttpMedia.fullTokenAssetUrl(collection.canisterId, nft.tokenId);
        candidates := pushUnique(candidates, fullTokenUrl);
        candidates := pushUnique(candidates, HttpMedia.withoutThumbnailParam(fullTokenUrl));
      };
    };
    candidates;
  };

  public func directImageFromMetadata(
    collection : CollectionTypes.Collection,
    nft : WalletTypes.WalletNFT,
  ) : ?Text {
    switch (shareImageUrlFromAttributes(nft)) {
      case (?value) {
        if (isLikelyDirectRasterImageUrl(value)) {
          return ?value;
        };
      };
      case null {};
    };
    for (candidate in candidateImageUrls(collection, nft).values()) {
      switch (HttpMedia.publicImageUrl(candidate)) {
        case (?value) {
          if (isLikelyDirectRasterImageUrl(value)) {
            return ?normalizePreviewImageUrl(value);
          };
        };
        case null {};
      };
      if (isLikelyDirectRasterImageUrl(candidate)) {
        return ?normalizePreviewImageUrl(candidate);
      };
    };
    null;
  };

  public func resolveDirectImageFromHttpResponse(
    sourceUrl : Text,
    response : HttpResponse,
  ) : ?Text {
    if (response.status < 200 or response.status >= 300) {
      return null;
    };
    let contentType = headerValue(response.headers, "content-type");
    let normalizedType = Text.toLower(Text.trim(contentType, #char ' '));
    if (
      Text.startsWith(normalizedType, #text "image/jpeg") or
      Text.startsWith(normalizedType, #text "image/jpg") or
      Text.startsWith(normalizedType, #text "image/png") or
      Text.startsWith(normalizedType, #text "image/webp") or
      Text.startsWith(normalizedType, #text "image/gif")
    ) {
      return ?normalizePreviewImageUrl(sourceUrl);
    };
    if (
      Text.startsWith(normalizedType, #text "image/svg") or
      Text.startsWith(normalizedType, #text "text/") or
      normalizedType == ""
    ) {
      switch (Text.decodeUtf8(response.body)) {
        case (?bodyText) parseSvgEmbeddedImageUrl(bodyText);
        case null null;
      };
    } else {
      null;
    };
  };

  func svgAttributeQuote() : Char {
    Char.fromNat32(34);
  };

  public func parseSvgEmbeddedImageUrl(body : Text) : ?Text {
    for (marker in ["xlink:href=\"", "href=\""].values()) {
      switch (extractAttributeValue(body, marker, svgAttributeQuote())) {
        case (?value) {
          if (value != "") {
            return ?normalizePreviewImageUrl(value);
          };
        };
        case null {};
      };
    };
    null;
  };

  func pushUnique(values : [Text], value : Text) : [Text] {
    for (existing in values.values()) {
      if (existing == value) {
        return values;
      };
    };
    Array.concat<Text>(values, [value]);
  };

  func headerValue(headers : [HttpHeader], name : Text) : Text {
    let target = Text.toLower(name);
    for (header in headers.values()) {
      if (Text.toLower(header.name) == target) {
        return header.value;
      };
    };
    "";
  };

  func extractAttributeValue(body : Text, marker : Text, closingQuote : Char) : ?Text {
    switch (indexOfText(body, marker)) {
      case null null;
      case (?start) {
        let chars = Text.toArray(body);
        let valueStart = start + marker.size();
        var index = valueStart;
        var result = "";
        while (index < chars.size()) {
          let char = chars[index];
          if (char == closingQuote) {
            return ?result;
          };
          result #= Text.fromChar(char);
          index += 1;
        };
        ?result;
      };
    };
  };

  func indexOfText(haystack : Text, needle : Text) : ?Nat {
    let haystackChars = Text.toArray(haystack);
    let needleChars = Text.toArray(needle);
    let haystackSize = haystackChars.size();
    let needleSize = needleChars.size();
    if (needleSize == 0) {
      return ?0;
    };
    if (needleSize > haystackSize) {
      return null;
    };
    var index = 0;
    while (index + needleSize <= haystackSize) {
      var matches = true;
      var offset = 0;
      while (offset < needleSize) {
        if (haystackChars[index + offset] != needleChars[offset]) {
          matches := false;
        };
        offset += 1;
      };
      if (matches) {
        return ?index;
      };
      index += 1;
    };
    null;
  };
};