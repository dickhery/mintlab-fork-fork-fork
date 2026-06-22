import Array "mo:core/Array";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Nat64 "mo:core/Nat64";
import Text "mo:core/Text";
import CollectionTypes "../types/collections";
import Types "../types/dividends";

module {
  public type DividendsState = {
    claimableE8s : Map.Map<Text, Nat64>;
    processedBalanceE8s : Map.Map<CollectionTypes.CollectionId, Nat64>;
    pendingClaims : Map.Map<Text, Bool>;
  };

  public type DividendFeeState = {
    feeReserveE8s : Map.Map<CollectionTypes.CollectionId, Nat64>;
    disbursementLocks : Map.Map<CollectionTypes.CollectionId, Bool>;
  };

  public type CollectionDividendAccumulator = {
    collectionId : CollectionTypes.CollectionId;
    var totalReceivedE8s : Nat64;
    var totalDistributedE8s : Nat64;
    var accDividendPerTokenScaled : Nat;
    var remainderE8s : Nat64;
  };

  public type TokenDividendSnapshot = {
    collectionId : CollectionTypes.CollectionId;
    tokenId : Text;
    var claimedAccumulatorScaled : Nat;
    var pendingCarryE8s : Nat64;
  };

  public type DividendAccumulatorState = {
    accumulators : Map.Map<CollectionTypes.CollectionId, CollectionDividendAccumulator>;
    tokenSnapshots : Map.Map<Text, TokenDividendSnapshot>;
    pendingSyncMints : Map.Map<CollectionTypes.CollectionId, [Text]>;
    syncLocks : Map.Map<CollectionTypes.CollectionId, Bool>;
    operationLocks : Map.Map<CollectionTypes.CollectionId, Bool>;
  };

  public type ClaimReservation = {
    legacyClaimableE8s : Nat64;
    hadSnapshot : Bool;
    claimedAccumulatorScaled : Nat;
    pendingCarryE8s : Nat64;
  };

  let ACCUMULATOR_SCALE : Nat = 1_000_000_000_000;

  public func newState() : DividendsState {
    {
      claimableE8s = Map.empty<Text, Nat64>();
      processedBalanceE8s = Map.empty<CollectionTypes.CollectionId, Nat64>();
      pendingClaims = Map.empty<Text, Bool>();
    };
  };

  public func newFeeState() : DividendFeeState {
    {
      feeReserveE8s = Map.empty<CollectionTypes.CollectionId, Nat64>();
      disbursementLocks = Map.empty<CollectionTypes.CollectionId, Bool>();
    };
  };

  public type DividendSourceState = {
    descriptions : Map.Map<CollectionTypes.CollectionId, Text>;
  };

  public func newSourceState() : DividendSourceState {
    {
      descriptions = Map.empty<CollectionTypes.CollectionId, Text>();
    };
  };

  public func sourceDescriptionFor(
    state : DividendSourceState,
    collectionId : CollectionTypes.CollectionId,
  ) : ?Text {
    Map.get(state.descriptions, Nat.compare, collectionId);
  };

  public func setSourceDescription(
    state : DividendSourceState,
    collectionId : CollectionTypes.CollectionId,
    sourceDescription : ?Text,
  ) {
    switch (sourceDescription) {
      case null {
        Map.remove(state.descriptions, Nat.compare, collectionId);
      };
      case (?value) {
        Map.add(state.descriptions, Nat.compare, collectionId, value);
      };
    };
  };

  public func newAccumulatorState() : DividendAccumulatorState {
    {
      accumulators = Map.empty<CollectionTypes.CollectionId, CollectionDividendAccumulator>();
      tokenSnapshots = Map.empty<Text, TokenDividendSnapshot>();
      pendingSyncMints = Map.empty<CollectionTypes.CollectionId, [Text]>();
      syncLocks = Map.empty<CollectionTypes.CollectionId, Bool>();
      operationLocks = Map.empty<CollectionTypes.CollectionId, Bool>();
    };
  };

  public func collectionEnabled(collection : CollectionTypes.Collection) : Bool {
    switch (collection.dividendConfig) {
      case (?config) config.enabled;
      case null false;
    };
  };

  public func nftKey(collectionId : CollectionTypes.CollectionId, tokenId : Text) : Text {
    Nat.toText(collectionId) # "#" # tokenId;
  };

  public func legacyClaimableFor(
    state : DividendsState,
    collectionId : CollectionTypes.CollectionId,
    tokenId : Text,
  ) : Nat64 {
    switch (Map.get(state.claimableE8s, Text.compare, nftKey(collectionId, tokenId))) {
      case (?amount) amount;
      case null 0;
    };
  };

  public func claimableFor(
    state : DividendsState,
    accumulatorState : DividendAccumulatorState,
    collectionId : CollectionTypes.CollectionId,
    tokenId : Text,
  ) : Nat64 {
    let legacy = legacyClaimableFor(state, collectionId, tokenId);
    let key = nftKey(collectionId, tokenId);
    let accumulatorScaled = accumulatorScaledFor(accumulatorState, collectionId);
    let (claimedScaled, carry) = switch (Map.get(accumulatorState.tokenSnapshots, Text.compare, key)) {
      case (?snapshot) (snapshot.claimedAccumulatorScaled, snapshot.pendingCarryE8s);
      case null (0, 0 : Nat64);
    };
    let accrued = if (accumulatorScaled > claimedScaled) {
      Nat64.fromNat((accumulatorScaled - claimedScaled) / ACCUMULATOR_SCALE);
    } else {
      0 : Nat64;
    };
    legacy + carry + accrued;
  };

  public func setClaimable(
    state : DividendsState,
    collectionId : CollectionTypes.CollectionId,
    tokenId : Text,
    amount : Nat64,
  ) {
    Map.add(state.claimableE8s, Text.compare, nftKey(collectionId, tokenId), amount);
  };

  public func addClaimable(
    state : DividendsState,
    collectionId : CollectionTypes.CollectionId,
    tokenId : Text,
    amount : Nat64,
  ) {
    let current = legacyClaimableFor(state, collectionId, tokenId);
    setClaimable(state, collectionId, tokenId, current + amount);
  };

  public func totalClaimableForCollection(
    state : DividendsState,
    accumulatorState : DividendAccumulatorState,
    collectionId : CollectionTypes.CollectionId,
    tokenIds : [Text],
  ) : Nat64 {
    var total : Nat64 = 0;
    for (tokenId in tokenIds.values()) {
      total += claimableFor(state, accumulatorState, collectionId, tokenId);
    };
    total;
  };

  public func processedBalance(
    state : DividendsState,
    collectionId : CollectionTypes.CollectionId,
  ) : Nat64 {
    switch (Map.get(state.processedBalanceE8s, Nat.compare, collectionId)) {
      case (?amount) amount;
      case null 0;
    };
  };

  public func increaseProcessedBalance(
    state : DividendsState,
    collectionId : CollectionTypes.CollectionId,
    amount : Nat64,
  ) {
    Map.add(
      state.processedBalanceE8s,
      Nat.compare,
      collectionId,
      processedBalance(state, collectionId) + amount,
    );
  };

  public func reduceProcessedBalance(
    state : DividendsState,
    collectionId : CollectionTypes.CollectionId,
    amount : Nat64,
  ) {
    let current = processedBalance(state, collectionId);
    Map.add(
      state.processedBalanceE8s,
      Nat.compare,
      collectionId,
      if (current > amount) current - amount else (0 : Nat64),
    );
  };

  public func feeReserve(
    state : DividendFeeState,
    collectionId : CollectionTypes.CollectionId,
  ) : Nat64 {
    switch (Map.get(state.feeReserveE8s, Nat.compare, collectionId)) {
      case (?amount) amount;
      case null 0;
    };
  };

  public func addFeeReserve(
    state : DividendFeeState,
    collectionId : CollectionTypes.CollectionId,
    amount : Nat64,
  ) {
    Map.add(
      state.feeReserveE8s,
      Nat.compare,
      collectionId,
      feeReserve(state, collectionId) + amount,
    );
  };

  public func reduceFeeReserve(
    state : DividendFeeState,
    collectionId : CollectionTypes.CollectionId,
    amount : Nat64,
  ) {
    let current = feeReserve(state, collectionId);
    Map.add(
      state.feeReserveE8s,
      Nat.compare,
      collectionId,
      if (current > amount) current - amount else (0 : Nat64),
    );
  };

  public func distributeNewBalance(
    state : DividendsState,
    accumulatorState : DividendAccumulatorState,
    collectionId : CollectionTypes.CollectionId,
    nftCount : Nat,
    balanceE8s : Nat64,
  ) : Types.DividendSyncReceipt {
    let processed = processedBalance(state, collectionId);
    let deposited = if (balanceE8s > processed) balanceE8s - processed else (0 : Nat64);
    let nftCount64 = Nat64.fromNat(nftCount);
    let share = if (nftCount64 == 0) (0 : Nat64) else deposited / nftCount64;
    let distributed = share * nftCount64;
    let remainder = deposited - distributed;
    let accumulator = accumulatorFor(accumulatorState, collectionId);

    if (share > 0) {
      accumulator.accDividendPerTokenScaled += Nat64.toNat(share) * ACCUMULATOR_SCALE;
      accumulator.totalReceivedE8s += distributed;
      accumulator.totalDistributedE8s += distributed;
      accumulator.remainderE8s := remainder;
      increaseProcessedBalance(state, collectionId, distributed);
    } else {
      accumulator.remainderE8s := deposited;
    };

    {
      collectionId;
      depositedE8s = deposited;
      distributedE8s = distributed;
      shareE8s = share;
      remainderE8s = remainder;
      nftCount;
      balanceE8s;
    };
  };

  public func collectionBalances(
    state : DividendsState,
    accumulatorState : DividendAccumulatorState,
    collectionId : CollectionTypes.CollectionId,
    tokenIds : [Text],
  ) : [(Text, Nat64)] {
    var balances : [(Text, Nat64)] = [];
    for (tokenId in tokenIds.values()) {
      balances := Array.concat<(Text, Nat64)>(
        balances,
        [(tokenId, claimableFor(state, accumulatorState, collectionId, tokenId))],
      );
    };
    balances;
  };

  public func initializeTokenSnapshot(
    state : DividendAccumulatorState,
    collectionId : CollectionTypes.CollectionId,
    tokenId : Text,
  ) {
    let key = nftKey(collectionId, tokenId);
    switch (Map.get(state.tokenSnapshots, Text.compare, key)) {
      case (?_) {};
      case null {
        Map.add(
          state.tokenSnapshots,
          Text.compare,
          key,
          {
            collectionId;
            tokenId;
            var claimedAccumulatorScaled = accumulatorScaledFor(state, collectionId);
            var pendingCarryE8s = 0 : Nat64;
          },
        );
      };
    };
    if (isSyncPending(state, collectionId)) {
      rememberPendingSyncMint(state, collectionId, tokenId);
    };
  };

  public func reserveClaim(
    dividendState : DividendsState,
    accumulatorState : DividendAccumulatorState,
    collectionId : CollectionTypes.CollectionId,
    tokenId : Text,
  ) : ClaimReservation {
    let key = nftKey(collectionId, tokenId);
    let legacy = legacyClaimableFor(dividendState, collectionId, tokenId);
    let reservation = switch (Map.get(accumulatorState.tokenSnapshots, Text.compare, key)) {
      case (?snapshot) {
        {
          legacyClaimableE8s = legacy;
          hadSnapshot = true;
          claimedAccumulatorScaled = snapshot.claimedAccumulatorScaled;
          pendingCarryE8s = snapshot.pendingCarryE8s;
        };
      };
      case null {
        {
          legacyClaimableE8s = legacy;
          hadSnapshot = false;
          claimedAccumulatorScaled = 0;
          pendingCarryE8s = 0 : Nat64;
        };
      };
    };
    setClaimable(dividendState, collectionId, tokenId, 0);
    let snapshot = snapshotFor(accumulatorState, collectionId, tokenId);
    snapshot.claimedAccumulatorScaled := accumulatorScaledFor(accumulatorState, collectionId);
    snapshot.pendingCarryE8s := 0;
    reservation;
  };

  public func restoreClaim(
    dividendState : DividendsState,
    accumulatorState : DividendAccumulatorState,
    collectionId : CollectionTypes.CollectionId,
    tokenId : Text,
    reservation : ClaimReservation,
  ) {
    let key = nftKey(collectionId, tokenId);
    setClaimable(dividendState, collectionId, tokenId, reservation.legacyClaimableE8s);
    if (reservation.hadSnapshot) {
      let snapshot = snapshotFor(accumulatorState, collectionId, tokenId);
      snapshot.claimedAccumulatorScaled := reservation.claimedAccumulatorScaled;
      snapshot.pendingCarryE8s := reservation.pendingCarryE8s;
    } else {
      Map.remove(accumulatorState.tokenSnapshots, Text.compare, key);
    };
  };

  public func finalizePendingSyncMints(
    state : DividendAccumulatorState,
    collectionId : CollectionTypes.CollectionId,
  ) {
    let pending = switch (Map.get(state.pendingSyncMints, Nat.compare, collectionId)) {
      case (?tokenIds) tokenIds;
      case null [];
    };
    let currentScaled = accumulatorScaledFor(state, collectionId);
    for (tokenId in pending.values()) {
      let snapshot = snapshotFor(state, collectionId, tokenId);
      snapshot.claimedAccumulatorScaled := currentScaled;
      snapshot.pendingCarryE8s := 0;
    };
    Map.remove(state.pendingSyncMints, Nat.compare, collectionId);
  };

  public func acquireSync(
    state : DividendAccumulatorState,
    collectionId : CollectionTypes.CollectionId,
  ) : Bool {
    switch (Map.get(state.syncLocks, Nat.compare, collectionId)) {
      case (?_) false;
      case null {
        Map.add(state.syncLocks, Nat.compare, collectionId, true);
        true;
      };
    };
  };

  public func releaseSync(
    state : DividendAccumulatorState,
    collectionId : CollectionTypes.CollectionId,
  ) {
    Map.remove(state.syncLocks, Nat.compare, collectionId);
    Map.remove(state.pendingSyncMints, Nat.compare, collectionId);
  };

  public func isSyncPending(
    state : DividendAccumulatorState,
    collectionId : CollectionTypes.CollectionId,
  ) : Bool {
    switch (Map.get(state.syncLocks, Nat.compare, collectionId)) {
      case (?_) true;
      case null false;
    };
  };

  public func acquireCollectionOperation(
    state : DividendAccumulatorState,
    collectionId : CollectionTypes.CollectionId,
  ) : Bool {
    switch (Map.get(state.operationLocks, Nat.compare, collectionId)) {
      case (?_) false;
      case null {
        Map.add(state.operationLocks, Nat.compare, collectionId, true);
        true;
      };
    };
  };

  public func releaseCollectionOperation(
    state : DividendAccumulatorState,
    collectionId : CollectionTypes.CollectionId,
  ) {
    Map.remove(state.operationLocks, Nat.compare, collectionId);
  };

  public func isCollectionOperationPending(
    state : DividendAccumulatorState,
    collectionId : CollectionTypes.CollectionId,
  ) : Bool {
    switch (Map.get(state.operationLocks, Nat.compare, collectionId)) {
      case (?_) true;
      case null false;
    };
  };

  func accumulatorScaledFor(
    state : DividendAccumulatorState,
    collectionId : CollectionTypes.CollectionId,
  ) : Nat {
    switch (Map.get(state.accumulators, Nat.compare, collectionId)) {
      case (?accumulator) accumulator.accDividendPerTokenScaled;
      case null 0;
    };
  };

  func accumulatorFor(
    state : DividendAccumulatorState,
    collectionId : CollectionTypes.CollectionId,
  ) : CollectionDividendAccumulator {
    switch (Map.get(state.accumulators, Nat.compare, collectionId)) {
      case (?accumulator) accumulator;
      case null {
        let accumulator : CollectionDividendAccumulator = {
          collectionId;
          var totalReceivedE8s = 0;
          var totalDistributedE8s = 0;
          var accDividendPerTokenScaled = 0;
          var remainderE8s = 0;
        };
        Map.add(state.accumulators, Nat.compare, collectionId, accumulator);
        accumulator;
      };
    };
  };

  func snapshotFor(
    state : DividendAccumulatorState,
    collectionId : CollectionTypes.CollectionId,
    tokenId : Text,
  ) : TokenDividendSnapshot {
    let key = nftKey(collectionId, tokenId);
    switch (Map.get(state.tokenSnapshots, Text.compare, key)) {
      case (?snapshot) snapshot;
      case null {
        let snapshot : TokenDividendSnapshot = {
          collectionId;
          tokenId;
          var claimedAccumulatorScaled = 0;
          var pendingCarryE8s = 0 : Nat64;
        };
        Map.add(state.tokenSnapshots, Text.compare, key, snapshot);
        snapshot;
      };
    };
  };

  func rememberPendingSyncMint(
    state : DividendAccumulatorState,
    collectionId : CollectionTypes.CollectionId,
    tokenId : Text,
  ) {
    let current = switch (Map.get(state.pendingSyncMints, Nat.compare, collectionId)) {
      case (?tokenIds) tokenIds;
      case null [];
    };
    Map.add(state.pendingSyncMints, Nat.compare, collectionId, appendUniqueText(current, tokenId));
  };

  func appendUniqueText(values : [Text], value : Text) : [Text] {
    for (existing in values.values()) {
      if (existing == value) {
        return values;
      };
    };
    Array.concat<Text>(values, [value]);
  };

  public func acquireClaim(state : DividendsState, key : Text) : Bool {
    switch (Map.get(state.pendingClaims, Text.compare, key)) {
      case (?_) false;
      case null {
        Map.add(state.pendingClaims, Text.compare, key, true);
        true;
      };
    };
  };

  public func releaseClaim(state : DividendsState, key : Text) {
    Map.remove(state.pendingClaims, Text.compare, key);
  };

  public func isClaimPending(state : DividendsState, key : Text) : Bool {
    switch (Map.get(state.pendingClaims, Text.compare, key)) {
      case (?_) true;
      case null false;
    };
  };

  public func acquireDisbursement(
    state : DividendFeeState,
    collectionId : CollectionTypes.CollectionId,
  ) : Bool {
    switch (Map.get(state.disbursementLocks, Nat.compare, collectionId)) {
      case (?_) false;
      case null {
        Map.add(state.disbursementLocks, Nat.compare, collectionId, true);
        true;
      };
    };
  };

  public func releaseDisbursement(
    state : DividendFeeState,
    collectionId : CollectionTypes.CollectionId,
  ) {
    Map.remove(state.disbursementLocks, Nat.compare, collectionId);
  };

  public func isDisbursementPending(
    state : DividendFeeState,
    collectionId : CollectionTypes.CollectionId,
  ) : Bool {
    switch (Map.get(state.disbursementLocks, Nat.compare, collectionId)) {
      case (?_) true;
      case null false;
    };
  };
};
