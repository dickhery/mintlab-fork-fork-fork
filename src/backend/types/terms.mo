import Map "mo:core/Map";
import Principal "mo:core/Principal";

module {
  public type TermsAcceptance = {
    version : Text;
    acceptedAt : Nat64;
  };

  public type TermsAcceptanceStatus = {
    currentVersion : Text;
    acceptedCurrent : Bool;
    acceptedVersion : ?Text;
    acceptedAt : ?Nat64;
  };

  public type TermsState = {
    acceptances : Map.Map<Principal, TermsAcceptance>;
  };
};
