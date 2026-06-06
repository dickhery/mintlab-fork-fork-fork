import Principal "mo:core/Principal";
import TermsLib "../lib/terms";
import TermsTypes "../types/terms";

mixin (termsState : TermsLib.TermsState) {
  public query func getCurrentTermsVersion() : async Text {
    TermsLib.currentVersion();
  };

  public shared query ({ caller }) func getMyTermsAcceptanceStatus() : async TermsTypes.TermsAcceptanceStatus {
    TermsLib.status(termsState, caller);
  };

  public shared query ({ caller }) func hasAcceptedCurrentTerms() : async Bool {
    if (Principal.isAnonymous(caller)) {
      return false;
    };
    TermsLib.hasAcceptedCurrent(termsState, caller);
  };

  public shared ({ caller }) func acceptCurrentTerms() : async TermsTypes.TermsAcceptanceStatus {
    TermsLib.acceptCurrent(termsState, caller);
  };
};
