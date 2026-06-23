import Array "mo:core/Array";
import Principal "mo:core/Principal";

module {
  public type AdminState = { var adminPrincipal : ?Principal };

  /// Separate stable state so upgrades stay compatible with deployed canisters.
  public type WalletAuthState = {
    var authorizedWalletCanisters : [Principal];
  };

  /// Initialise fresh admin state
  public func newState() : AdminState {
    { var adminPrincipal = null };
  };

  public func newWalletAuthState() : WalletAuthState {
    { var authorizedWalletCanisters = [] };
  };

  /// Register the first caller as admin; no-op if already set
  public func initAdmin(state : AdminState, caller : Principal) {
    switch (state.adminPrincipal) {
      case null { state.adminPrincipal := ?caller };
      case (?_) {};
    };
  };

  /// Returns true when caller is the stored admin principal
  public func isAdmin(state : AdminState, caller : Principal) : Bool {
    switch (state.adminPrincipal) {
      case (?admin) { Principal.equal(admin, caller) };
      case null { false };
    };
  };

  /// Return the current admin principal (may be null if none set yet)
  public func getAdminPrincipal(state : AdminState) : ?Principal {
    state.adminPrincipal;
  };

  public func isAuthorizedWallet(state : WalletAuthState, caller : Principal) : Bool {
    for (walletId in state.authorizedWalletCanisters.values()) {
      if (Principal.equal(walletId, caller)) {
        return true;
      };
    };
    false;
  };

  public func authorizeWalletCanister(
    state : WalletAuthState,
    walletCanisterId : Principal,
  ) : { #ok; #err : Text } {
    if (Principal.isAnonymous(walletCanisterId)) {
      return #err("Cannot authorize the anonymous principal");
    };
    if (isAuthorizedWallet(state, walletCanisterId)) {
      return #ok;
    };
    state.authorizedWalletCanisters := Array.concat<Principal>(
      state.authorizedWalletCanisters,
      [walletCanisterId],
    );
    #ok;
  };

  public func listAuthorizedWalletCanisters(state : WalletAuthState) : [Principal] {
    state.authorizedWalletCanisters;
  };
};