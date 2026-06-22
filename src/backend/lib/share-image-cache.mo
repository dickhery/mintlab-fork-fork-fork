import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Text "mo:core/Text";

module {
  public type ShareImageCacheState = {
    urls : Map.Map<Text, Text>;
  };

  public func newState() : ShareImageCacheState {
    {
      urls = Map.empty<Text, Text>();
    };
  };

  public func cacheKey(collectionId : Nat, tokenId : Text) : Text {
    Nat.toText(collectionId) # "/" # tokenId;
  };

  public func get(state : ShareImageCacheState, key : Text) : ?Text {
    Map.get(state.urls, Text.compare, key);
  };

  public func put(
    state : ShareImageCacheState,
    key : Text,
    imageUrl : Text,
  ) {
    Map.add(state.urls, Text.compare, key, imageUrl);
  };
};