import AuthLib "../lib/auth";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";

mixin (authState : AuthLib.AdminState) {

  /// Called on every authenticated interaction to bootstrap admin on first use
  public shared ({ caller }) func bootstrapAdmin() : async () {
    if (Principal.isAnonymous(caller)) Runtime.trap("You must be authenticated to do this.");
    AuthLib.initAdmin(authState, caller);
  };

  /// Returns true if caller is the admin principal
  public shared query ({ caller }) func isAdmin() : async Bool {
    AuthLib.isAdmin(authState, caller);
  };

  /// Returns the stored admin principal (null if not yet bootstrapped)
  public query func getAdminPrincipal() : async ?Principal {
    AuthLib.getAdminPrincipal(authState);
  };

  /// Authorize a Mintlab Wallet backend canister to mediate NFT transfers.
  public shared ({ caller }) func authorizeWalletCanister(
    walletCanisterId : Principal,
  ) : async { #ok; #err : Text } {
    if (not AuthLib.isAdmin(authState, caller)) {
      return #err("Only admins can authorize wallet canisters");
    };
    switch (AuthLib.authorizeWalletCanister(authState, walletCanisterId)) {
      case (#ok) #ok;
      case (#err(message)) #err(message);
    };
  };

  public query func listAuthorizedWalletCanisters() : async [Principal] {
    AuthLib.listAuthorizedWalletCanisters(authState);
  };
};
