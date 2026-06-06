import Int "mo:core/Int";
import Map "mo:core/Map";
import Nat64 "mo:core/Nat64";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Types "../types/terms";

module {
  public type TermsState = Types.TermsState;
  public type TermsAcceptance = Types.TermsAcceptance;
  public type TermsAcceptanceStatus = Types.TermsAcceptanceStatus;

  public let CURRENT_TERMS_VERSION : Text = "2026-06-06.1";

  public func newState() : TermsState {
    {
      acceptances = Map.empty<Principal, TermsAcceptance>();
    };
  };

  public func currentVersion() : Text {
    CURRENT_TERMS_VERSION;
  };

  public func acceptanceError(state : TermsState, caller : Principal) : ?Text {
    if (Principal.isAnonymous(caller)) {
      return ?"You must be authenticated to do this.";
    };
    if (hasAcceptedCurrent(state, caller)) {
      null;
    } else {
      ?"Accept the current Mintlab Terms of Service before performing transactions.";
    };
  };

  public func requireCurrent(state : TermsState, caller : Principal) {
    switch (acceptanceError(state, caller)) {
      case null {};
      case (?message) Runtime.trap(message);
    };
  };

  public func hasAcceptedCurrent(state : TermsState, caller : Principal) : Bool {
    switch (Map.get(state.acceptances, Principal.compare, caller)) {
      case (?record) record.version == CURRENT_TERMS_VERSION;
      case null false;
    };
  };

  public func status(state : TermsState, caller : Principal) : TermsAcceptanceStatus {
    switch (Map.get(state.acceptances, Principal.compare, caller)) {
      case (?record) {
        {
          currentVersion = CURRENT_TERMS_VERSION;
          acceptedCurrent = record.version == CURRENT_TERMS_VERSION;
          acceptedVersion = ?record.version;
          acceptedAt = ?record.acceptedAt;
        };
      };
      case null {
        {
          currentVersion = CURRENT_TERMS_VERSION;
          acceptedCurrent = false;
          acceptedVersion = null;
          acceptedAt = null;
        };
      };
    };
  };

  public func acceptCurrent(state : TermsState, caller : Principal) : TermsAcceptanceStatus {
    if (Principal.isAnonymous(caller)) {
      Runtime.trap("You must be authenticated to do this.");
    };
    let record : TermsAcceptance = {
      version = CURRENT_TERMS_VERSION;
      acceptedAt = Nat64.fromNat(Int.abs(Time.now()));
    };
    Map.add(state.acceptances, Principal.compare, caller, record);
    {
      currentVersion = CURRENT_TERMS_VERSION;
      acceptedCurrent = true;
      acceptedVersion = ?record.version;
      acceptedAt = ?record.acceptedAt;
    };
  };
};
