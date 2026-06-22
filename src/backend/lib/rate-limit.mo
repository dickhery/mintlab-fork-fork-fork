import Array "mo:core/Array";
import Int "mo:core/Int";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Text "mo:core/Text";

module {
  public type RateLimitState = {
    var lastAtByKey : ?Map.Map<Text, Int>;
    var windowCallsByKey : ?Map.Map<Text, [Int]>;
  };

  public func newState() : RateLimitState {
    {
      var lastAtByKey = ?Map.empty<Text, Int>();
      var windowCallsByKey = ?Map.empty<Text, [Int]>();
    };
  };

  public func ensureIndexes(state : RateLimitState) {
    switch (state.lastAtByKey) {
      case null { state.lastAtByKey := ?Map.empty<Text, Int>() };
      case (?_) {};
    };
    switch (state.windowCallsByKey) {
      case null { state.windowCallsByKey := ?Map.empty<Text, [Int]>() };
      case (?_) {};
    };
  };

  public func keyFor(
    prefix : Text,
    caller : Principal,
    suffix : Text,
  ) : Text {
    prefix # ":" # Principal.toText(caller) # ":" # suffix;
  };

  /// Returns an error message when the caller should wait; null when the call is allowed.
  public func enforce(
    state : RateLimitState,
    key : Text,
    now : Int,
    cooldownNs : Int,
    windowNs : Int,
    maxInWindow : Nat,
    cooldownMessage : Text,
    windowMessage : Text,
  ) : ?Text {
    ensureIndexes(state);
    let lastAtMap = switch (state.lastAtByKey) {
      case (?value) value;
      case null return ?cooldownMessage;
    };
    let windowMap = switch (state.windowCallsByKey) {
      case (?value) value;
      case null return ?windowMessage;
    };

    switch (Map.get(lastAtMap, Text.compare, key)) {
      case (?lastAt) {
        if (now - lastAt < cooldownNs) {
          return ?cooldownMessage;
        };
      };
      case null {};
    };

    let recent = pruneWindow(
      switch (Map.get(windowMap, Text.compare, key)) {
        case (?timestamps) timestamps;
        case null [];
      },
      now,
      windowNs,
    );
    if (recent.size() >= maxInWindow) {
      return ?windowMessage;
    };

    Map.add(lastAtMap, Text.compare, key, now);
    Map.add(
      windowMap,
      Text.compare,
      key,
      Array.concat<Int>(recent, [now]),
    );
    null;
  };

  func pruneWindow(timestamps : [Int], now : Int, windowNs : Int) : [Int] {
    Array.filter<Int>(
      timestamps,
      func (timestamp) {
        now >= timestamp and now - timestamp < windowNs;
      },
    );
  };
};