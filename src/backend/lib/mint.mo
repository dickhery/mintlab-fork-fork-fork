import Array "mo:core/Array";
import Int "mo:core/Int";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Nat32 "mo:core/Nat32";
import Nat64 "mo:core/Nat64";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import NFTStandards "nft-standards";
import Types "../types/mint";
import WalletTypes "../types/wallet";

module {
  public type MintState = {
    tokens : Map.Map<Nat, Types.MintedToken>;
    pendingCollectionCreates : Map.Map<Principal, Bool>;
    var nextTokenId : Nat;
    var nextTransactionId : Nat;
    var config : Types.StoredMintConfig;
    var collectionCanisterWasm : ?Blob;
  };

  public type CollectionCreationState = {
    requests : Map.Map<Nat, Types.CollectionCreationRequest>;
    requestsByOwner : Map.Map<Principal, [Nat]>;
    var nextRequestId : Nat;
  };

  public type CollectionCreationPayoutSplitState = {
    requestPayouts : Map.Map<Nat, Types.CollectionCreationRequestPayout>;
    var secondaryPayoutAccount : ?Types.AccountIdentifier;
    var primaryPayoutBasisPoints : Nat;
    var secondaryPayoutBasisPoints : Nat;
  };

  public type ModerationState = {
    var config : Types.ModerationConfig;
  };

  public type PendingMintPaymentState = {
    payments : Map.Map<Nat, Types.PendingMintPayment>;
    paymentsByCaller : Map.Map<Principal, [Nat]>;
    var nextPaymentId : Nat;
  };

  public func defaultCollectionCreationPrimaryPayoutBasisPoints() : Nat {
    10_000;
  };

  public func defaultCollectionCreationSecondaryPayoutBasisPoints() : Nat {
    0;
  };

  public func newState() : MintState {
    {
      tokens = Map.empty<Nat, Types.MintedToken>();
      pendingCollectionCreates = Map.empty<Principal, Bool>();
      var nextTokenId = 1;
      var nextTransactionId = 0;
      var config = {
        collectionId = null;
        payoutAccount = null;
        mintPriceE8s = 0;
        mintEnabled = false;
        collectionCreationPayoutAccount = null;
        collectionCreationPriceE8s = 0;
        collectionCreationEnabled = false;
        mainMintPayoutAccount = null;
        mainMintPriceE8s = 0;
        mainMintEnabled = false;
        collectionCanisterWasmUploaded = false;
        collectionCanisterCycles = 2_000_000_000_000;
      };
      var collectionCanisterWasm = null;
    };
  };

  public func newCollectionCreationState() : CollectionCreationState {
    {
      requests = Map.empty<Nat, Types.CollectionCreationRequest>();
      requestsByOwner = Map.empty<Principal, [Nat]>();
      var nextRequestId = 1;
    };
  };

  public func newCollectionCreationPayoutSplitState() : CollectionCreationPayoutSplitState {
    {
      requestPayouts = Map.empty<Nat, Types.CollectionCreationRequestPayout>();
      var secondaryPayoutAccount = null;
      var primaryPayoutBasisPoints = defaultCollectionCreationPrimaryPayoutBasisPoints();
      var secondaryPayoutBasisPoints = defaultCollectionCreationSecondaryPayoutBasisPoints();
    };
  };

  public func newModerationState() : ModerationState {
    { var config = defaultModerationConfig() };
  };

  public func newPendingMintPaymentState() : PendingMintPaymentState {
    {
      payments = Map.empty<Nat, Types.PendingMintPayment>();
      paymentsByCaller = Map.empty<Principal, [Nat]>();
      var nextPaymentId = 1;
    };
  };

  public func defaultModerationCategories() : Types.ModerationCategorySettings {
    {
      nudityOrSexual = true;
      graphicViolence = true;
      explicitLanguage = false;
      hateOrHarassment = false;
      hateSymbols = false;
      illegalOrDangerous = false;
      selfHarm = false;
      otherNsfw = true;
    };
  };

  public func defaultModerationUserMessage() : Text {
    "Uploads cannot include sexual content, graphic violence, self-harm content, hateful or harassing text, or dangerous illegal instructions.";
  };

  public func defaultModerationModel() : Text {
    "omni-moderation-latest";
  };

  func legacyGoogleModerationModel() : Text {
    "google-vision-safe-search";
  };

  func legacyModerationUserMessage() : Text {
    "Uploads cannot include nudity or sexual content, graphic violence, explicit language, hate or harassment, hate symbols, illegal or dangerous activity, self-harm content, or other NSFW material.";
  };

  func lenientModerationUserMessage() : Text {
    "Uploads cannot include explicit nudity or sexual content, graphic violence, explicit language, hate or harassment, hate symbols, illegal or dangerous activity, self-harm content, or clearly adult NSFW material. Non-explicit artistic, stylized, fashion, and character art is generally allowed.";
  };

  func googleModerationUserMessage() : Text {
    "Uploads cannot include adult, racy, or violent image content. Non-explicit artistic, stylized, fashion, and character art is generally allowed.";
  };

  func normalizeModerationConfig(config : Types.ModerationConfig) : Types.ModerationConfig {
    let normalizedModel =
      if (
        config.model == "" or
        config.model == legacyGoogleModerationModel() or
        config.model == "openai-omni-moderation-latest" or
        config.model == "omni-moderation-latest"
      ) {
        defaultModerationModel();
      } else {
        config.model;
      };
    let normalizedApiKey =
      if (config.model == legacyGoogleModerationModel()) {
        null;
      } else {
        config.apiKey;
      };
    if (
      config.userMessage == legacyModerationUserMessage() or
      config.userMessage == lenientModerationUserMessage() or
      config.userMessage == googleModerationUserMessage()
    ) {
      {
        config with
        apiKey = normalizedApiKey;
        model = normalizedModel;
        categories = {
          config.categories with
          explicitLanguage = false;
          hateOrHarassment = false;
          hateSymbols = false;
          illegalOrDangerous = false;
          selfHarm = false;
          otherNsfw = true;
        };
        userMessage = defaultModerationUserMessage();
      };
    } else {
      {
        config with
        apiKey = normalizedApiKey;
        model = normalizedModel;
      };
    };
  };

  public func defaultModerationConfig() : Types.ModerationConfig {
    {
      enabled = false;
      apiKey = null;
      model = defaultModerationModel();
      categories = defaultModerationCategories();
      userMessage = defaultModerationUserMessage();
    };
  };

  public func getPayoutSplitConfig(
    payoutSplitState : CollectionCreationPayoutSplitState
  ) : Types.CollectionCreationPayoutSplitConfig {
    {
      secondaryPayoutAccount = payoutSplitState.secondaryPayoutAccount;
      primaryPayoutBasisPoints = payoutSplitState.primaryPayoutBasisPoints;
      secondaryPayoutBasisPoints = payoutSplitState.secondaryPayoutBasisPoints;
    };
  };

  public func collectionCreationPrimaryPayoutBasisPoints(
    payoutSplitState : CollectionCreationPayoutSplitState
  ) : Nat {
    payoutSplitState.primaryPayoutBasisPoints;
  };

  public func collectionCreationSecondaryPayoutBasisPoints(
    payoutSplitState : CollectionCreationPayoutSplitState
  ) : Nat {
    payoutSplitState.secondaryPayoutBasisPoints;
  };

  func getCollectionCreationRequestPayout(
    payoutSplitState : CollectionCreationPayoutSplitState,
    requestId : Nat,
  ) : ?Types.CollectionCreationRequestPayout {
    Map.get(payoutSplitState.requestPayouts, Nat.compare, requestId);
  };

  func saveCollectionCreationRequestPayout(
    payoutSplitState : CollectionCreationPayoutSplitState,
    payout : Types.CollectionCreationRequestPayout,
  ) {
    Map.add(payoutSplitState.requestPayouts, Nat.compare, payout.requestId, payout);
  };

  public func collectionCreationPrimaryAdminPayoutE8s(
    payoutSplitState : CollectionCreationPayoutSplitState,
    request : Types.CollectionCreationRequest,
  ) : Nat64 {
    switch (getCollectionCreationRequestPayout(payoutSplitState, request.id)) {
      case (?payout) payout.primaryPayoutE8s;
      case null request.adminPayoutE8s;
    };
  };

  public func collectionCreationSecondaryAdminPayoutE8s(
    payoutSplitState : CollectionCreationPayoutSplitState,
    request : Types.CollectionCreationRequest,
  ) : Nat64 {
    switch (getCollectionCreationRequestPayout(payoutSplitState, request.id)) {
      case (?payout) payout.secondaryPayoutE8s;
      case null 0;
    };
  };

  public func collectionCreationSecondaryAdminPayoutAccount(
    payoutSplitState : CollectionCreationPayoutSplitState,
    request : Types.CollectionCreationRequest,
  ) : ?Types.AccountIdentifier {
    switch (getCollectionCreationRequestPayout(payoutSplitState, request.id)) {
      case (?payout) payout.secondaryPayoutAccount;
      case null null;
    };
  };

  public func collectionCreationSecondaryAdminPayoutBlock(
    payoutSplitState : CollectionCreationPayoutSplitState,
    request : Types.CollectionCreationRequest,
  ) : ?Nat64 {
    switch (getCollectionCreationRequestPayout(payoutSplitState, request.id)) {
      case (?payout) payout.secondaryPayoutBlock;
      case null null;
    };
  };

  public func getConfig(state : MintState) : Types.StoredMintConfig {
    state.config;
  };

  public func getPublicConfig(
    state : MintState,
    payoutSplitState : CollectionCreationPayoutSplitState,
  ) : Types.MintConfig {
    let config = state.config;
    {
      collectionId = config.collectionId;
      payoutAccount = config.payoutAccount;
      mintPriceE8s = config.mintPriceE8s;
      mintEnabled = config.mintEnabled;
      collectionCreationPayoutAccount = config.collectionCreationPayoutAccount;
      collectionCreationSecondaryPayoutAccount = payoutSplitState.secondaryPayoutAccount;
      collectionCreationPrimaryPayoutBasisPoints = payoutSplitState.primaryPayoutBasisPoints;
      collectionCreationSecondaryPayoutBasisPoints = payoutSplitState.secondaryPayoutBasisPoints;
      collectionCreationPriceE8s = config.collectionCreationPriceE8s;
      collectionCreationEnabled = config.collectionCreationEnabled;
      mainMintPayoutAccount = config.mainMintPayoutAccount;
      mainMintPriceE8s = config.mainMintPriceE8s;
      mainMintEnabled = config.mainMintEnabled;
      collectionCanisterWasmUploaded = config.collectionCanisterWasmUploaded;
      collectionCanisterCycles = config.collectionCanisterCycles;
    };
  };

  public func getModerationConfig(state : ModerationState) : Types.ModerationConfig {
    normalizeModerationConfig(state.config);
  };

  public func getPublicModerationConfig(state : ModerationState) : Types.PublicModerationConfig {
    let config = normalizeModerationConfig(state.config);
    {
      enabled = config.enabled;
      apiKeyConfigured = config.apiKey != null;
      model = config.model;
      categories = config.categories;
      userMessage = config.userMessage;
    };
  };

  public func configureModeration(
    state : ModerationState,
    enabled : Bool,
    apiKey : ?Text,
    clearApiKey : Bool,
    model : Text,
    categories : Types.ModerationCategorySettings,
    userMessage : Text,
  ) {
    let current = state.config;
    let nextApiKey = switch (apiKey) {
      case (?value) ?value;
      case null {
        if (clearApiKey) {
          null;
        } else {
          current.apiKey;
        };
      };
    };
    let normalizedModel = if (model == "") defaultModerationModel() else model;
    let migratingFromLegacyGoogle =
      current.model == legacyGoogleModerationModel() and
      normalizedModel == defaultModerationModel() and
      apiKey == null and
      not clearApiKey;
    state.config := normalizeModerationConfig({
      enabled;
      apiKey = if (migratingFromLegacyGoogle) null else nextApiKey;
      model = normalizedModel;
      categories;
      userMessage = if (userMessage == "") defaultModerationUserMessage() else userMessage;
    });
  };

  public func configure(
    state : MintState,
    payoutSplitState : CollectionCreationPayoutSplitState,
    collectionId : ?Types.CollectionId,
    collectionCreationPayoutAccount : ?Types.AccountIdentifier,
    collectionCreationSecondaryPayoutAccount : ?Types.AccountIdentifier,
    collectionCreationPrimaryPayoutBasisPoints : Nat,
    collectionCreationSecondaryPayoutBasisPoints : Nat,
    collectionCreationPriceE8s : Nat64,
    collectionCreationEnabled : Bool,
    mainMintPayoutAccount : ?Types.AccountIdentifier,
    mainMintPriceE8s : Nat64,
    mainMintEnabled : Bool,
    collectionCanisterCycles : Nat,
  ) {
    state.config := {
      collectionId;
      payoutAccount = collectionCreationPayoutAccount;
      mintPriceE8s = collectionCreationPriceE8s;
      mintEnabled = collectionCreationEnabled;
      collectionCreationPayoutAccount;
      collectionCreationPriceE8s;
      collectionCreationEnabled;
      mainMintPayoutAccount;
      mainMintPriceE8s;
      mainMintEnabled;
      collectionCanisterWasmUploaded = state.collectionCanisterWasm != null;
      collectionCanisterCycles;
    };
    payoutSplitState.secondaryPayoutAccount := collectionCreationSecondaryPayoutAccount;
    payoutSplitState.primaryPayoutBasisPoints := collectionCreationPrimaryPayoutBasisPoints;
    payoutSplitState.secondaryPayoutBasisPoints := collectionCreationSecondaryPayoutBasisPoints;
  };

  public func beginPendingMintPayment(
    state : PendingMintPaymentState,
    caller : Principal,
    collectionId : Types.CollectionId,
    metadata : WalletTypes.NFTMetadata,
    amountE8s : Nat64,
    payoutAccount : Types.AccountIdentifier,
  ) : Types.PendingMintPayment {
    let id = state.nextPaymentId;
    state.nextPaymentId += 1;
    let now = nowNat64();
    let payment : Types.PendingMintPayment = {
      id;
      caller;
      collectionId;
      metadata;
      amountE8s;
      payoutAccount;
      memo = Nat64.fromNat(id);
      paymentCreatedAt = now;
      paymentBlock = null;
      mintedTokenId = null;
      status = #PaymentPending;
      createdAt = now;
      updatedAt = now;
      lastError = null;
    };
    savePendingMintPayment(state, payment);
  };

  public func getPendingMintPayment(
    state : PendingMintPaymentState,
    paymentId : Nat,
  ) : ?Types.PendingMintPayment {
    Map.get(state.payments, Nat.compare, paymentId);
  };

  public func markPendingMintPaymentSent(
    state : PendingMintPaymentState,
    paymentId : Nat,
    blockIndex : Nat64,
  ) : ?Types.PendingMintPayment {
    switch (getPendingMintPayment(state, paymentId)) {
      case null null;
      case (?payment) {
        ?savePendingMintPayment(state, {
          payment with
          paymentBlock = ?blockIndex;
          status = #PaymentSent;
          updatedAt = nowNat64();
          lastError = null;
        });
      };
    };
  };

  public func markPendingMintPaymentMinted(
    state : PendingMintPaymentState,
    paymentId : Nat,
    tokenId : Nat,
  ) : ?Types.PendingMintPayment {
    switch (getPendingMintPayment(state, paymentId)) {
      case null null;
      case (?payment) {
        ?savePendingMintPayment(state, {
          payment with
          mintedTokenId = ?tokenId;
          status = #Minted;
          updatedAt = nowNat64();
          lastError = null;
        });
      };
    };
  };

  public func markPendingMintPaymentError(
    state : PendingMintPaymentState,
    paymentId : Nat,
    message : Text,
  ) : ?Types.PendingMintPayment {
    switch (getPendingMintPayment(state, paymentId)) {
      case null null;
      case (?payment) {
        let nextStatus = switch (payment.paymentBlock) {
          case (?_) #PaymentSent;
          case null #Failed;
        };
        ?savePendingMintPayment(state, {
          payment with
          status = nextStatus;
          updatedAt = nowNat64();
          lastError = ?message;
        });
      };
    };
  };

  public func pendingMintPaymentView(
    payment : Types.PendingMintPayment
  ) : Types.PendingMintPaymentView {
    {
      id = payment.id;
      collectionId = payment.collectionId;
      amountE8s = payment.amountE8s;
      paymentBlock = payment.paymentBlock;
      mintedTokenId = payment.mintedTokenId;
      status = payment.status;
      createdAt = payment.createdAt;
      updatedAt = payment.updatedAt;
      lastError = payment.lastError;
    };
  };

  public func pendingMintPaymentsByCaller(
    state : PendingMintPaymentState,
    caller : Principal,
  ) : [Types.PendingMintPaymentView] {
    var payments : [Types.PendingMintPaymentView] = [];
    for (payment in Map.values(state.payments)) {
      if (
        Principal.equal(payment.caller, caller) and
        payment.status != #Minted and
        (payment.status != #Failed or payment.paymentBlock != null)
      ) {
        payments := Array.concat<Types.PendingMintPaymentView>(
          payments,
          [pendingMintPaymentView(payment)],
        );
      };
    };
    payments;
  };

  func savePendingMintPayment(
    state : PendingMintPaymentState,
    payment : Types.PendingMintPayment,
  ) : Types.PendingMintPayment {
    Map.add(state.payments, Nat.compare, payment.id, payment);
    let current = switch (Map.get(state.paymentsByCaller, Principal.compare, payment.caller)) {
      case (?ids) ids;
      case null [];
    };
    if (not containsRequestId(current, payment.id)) {
      Map.add(
        state.paymentsByCaller,
        Principal.compare,
        payment.caller,
        Array.concat<Nat>(current, [payment.id]),
      );
    };
    payment;
  };

  public func setCollectionCanisterWasm(state : MintState, wasm : Blob) {
    state.collectionCanisterWasm := ?wasm;
    state.config := {
      state.config with
      collectionCanisterWasmUploaded = true;
    };
  };

  public func getCollectionCanisterWasm(state : MintState) : ?Blob {
    state.collectionCanisterWasm;
  };

  public func acquireCollectionCreate(state : MintState, caller : Principal) : Bool {
    switch (Map.get(state.pendingCollectionCreates, Principal.compare, caller)) {
      case (?_) false;
      case null {
        Map.add(state.pendingCollectionCreates, Principal.compare, caller, true);
        true;
      };
    };
  };

  public func releaseCollectionCreate(state : MintState, caller : Principal) {
    Map.remove(state.pendingCollectionCreates, Principal.compare, caller);
  };

  func collectionCreationRequestMap(
    state : CollectionCreationState
  ) : Map.Map<Nat, Types.CollectionCreationRequest> {
    state.requests;
  };

  func collectionCreationOwnerMap(
    state : CollectionCreationState
  ) : Map.Map<Principal, [Nat]> {
    state.requestsByOwner;
  };

  func nowNat64() : Nat64 {
    Nat64.fromNat(Int.abs(Time.now()));
  };

  let COLLECTION_CREATION_REPAIR_GRACE_NS : Nat64 = 180_000_000_000; // 3 minutes

  func containsRequestId(ids : [Nat], target : Nat) : Bool {
    for (id in ids.values()) {
      if (id == target) {
        return true;
      };
    };
    false;
  };

  func appendCollectionCreationRequestOwner(
    state : CollectionCreationState,
    owner : Principal,
    requestId : Nat,
  ) {
    let owners = collectionCreationOwnerMap(state);
    let current = switch (Map.get(owners, Principal.compare, owner)) {
      case (?ids) ids;
      case null [];
    };
    if (not containsRequestId(current, requestId)) {
      Map.add(owners, Principal.compare, owner, Array.concat<Nat>(current, [requestId]));
    };
  };

  public func beginCollectionCreationRequest(
    state : CollectionCreationState,
    payoutSplitState : CollectionCreationPayoutSplitState,
    owner : Principal,
    name : Text,
    description : Text,
    symbol : Text,
    imageUrl : Text,
    dividendsEnabled : Bool,
    quote : Types.CollectionCreationQuote,
    adminPayoutAccount : ?Types.AccountIdentifier,
    adminSecondaryPayoutAccount : ?Types.AccountIdentifier,
  ) : Types.CollectionCreationRequest {
    let requestId = state.nextRequestId;
    state.nextRequestId += 1;
    let now = nowNat64();
    let request : Types.CollectionCreationRequest = {
      id = requestId;
      owner;
      name;
      description;
      symbol;
      imageUrl;
      dividendsEnabled;
      requestedCanisterCycles = quote.collectionCanisterCycles;
      factoryReserveCycles = quote.factoryReserveCycles;
      totalCyclesToConvert = quote.totalCyclesToConvert;
      cycleCostE8s = quote.cycleCostE8s;
      adminPayoutE8s = quote.adminPayoutE8s;
      adminPayoutAccount;
      totalUserDebitE8s = quote.totalUserDebitE8s;
      status = #Started;
      cyclePaymentBlock = null;
      adminPayoutBlock = null;
      childCanisterId = null;
      collectionId = null;
      createdAt = now;
      updatedAt = now;
      lastError = null;
      attempts = 0;
    };
    Map.add(collectionCreationRequestMap(state), Nat.compare, requestId, request);
    saveCollectionCreationRequestPayout(
      payoutSplitState,
      {
        requestId;
        primaryPayoutE8s = quote.adminPrimaryPayoutE8s;
        secondaryPayoutE8s = quote.adminSecondaryPayoutE8s;
        secondaryPayoutAccount = adminSecondaryPayoutAccount;
        secondaryPayoutBlock = null;
      },
    );
    appendCollectionCreationRequestOwner(state, owner, requestId);
    request;
  };

  public func beginRecoveredCollectionCreationRequest(
    state : CollectionCreationState,
    payoutSplitState : CollectionCreationPayoutSplitState,
    owner : Principal,
    cyclePaymentBlock : Nat64,
    name : Text,
    description : Text,
    symbol : Text,
    imageUrl : Text,
    dividendsEnabled : Bool,
    quote : Types.CollectionCreationQuote,
  ) : Types.CollectionCreationRequest {
    let request = beginCollectionCreationRequest(
      state,
      payoutSplitState,
      owner,
      name,
      description,
      symbol,
      imageUrl,
      dividendsEnabled,
      {
        quote with
        adminPayoutE8s = 0;
        adminPrimaryPayoutE8s = 0;
        adminSecondaryPayoutE8s = 0;
        adminPayoutFeeE8s = 0;
        totalUserDebitE8s = 0;
      },
      null,
      null,
    );
    let recovered = {
      request with
      status = #CyclePaymentSent;
      cyclePaymentBlock = ?cyclePaymentBlock;
      updatedAt = nowNat64();
      lastError = ?"Admin recovery request created from an existing ICP payment block";
    };
    Map.add(collectionCreationRequestMap(state), Nat.compare, request.id, recovered);
    recovered;
  };

  public func getCollectionCreationRequest(
    state : CollectionCreationState,
    requestId : Nat,
  ) : ?Types.CollectionCreationRequest {
    Map.get(collectionCreationRequestMap(state), Nat.compare, requestId);
  };

  func saveCollectionCreationRequest(
    state : CollectionCreationState,
    request : Types.CollectionCreationRequest,
  ) : Types.CollectionCreationRequest {
    Map.add(collectionCreationRequestMap(state), Nat.compare, request.id, request);
    appendCollectionCreationRequestOwner(state, request.owner, request.id);
    request;
  };

  public func markCollectionCreationAttempt(
    state : CollectionCreationState,
    requestId : Nat,
  ) : ?Types.CollectionCreationRequest {
    switch (getCollectionCreationRequest(state, requestId)) {
      case null null;
      case (?request) {
        ?saveCollectionCreationRequest(state, {
          request with
          attempts = request.attempts + 1;
          updatedAt = nowNat64();
        });
      };
    };
  };

  public func markCollectionCreationCyclePayment(
    state : CollectionCreationState,
    requestId : Nat,
    blockIndex : Nat64,
  ) : ?Types.CollectionCreationRequest {
    switch (getCollectionCreationRequest(state, requestId)) {
      case null null;
      case (?request) {
        ?saveCollectionCreationRequest(state, {
          request with
          status = #CyclePaymentSent;
          cyclePaymentBlock = ?blockIndex;
          updatedAt = nowNat64();
          lastError = null;
        });
      };
    };
  };

  public func markCollectionCreationCyclesConverted(
    state : CollectionCreationState,
    requestId : Nat,
  ) : ?Types.CollectionCreationRequest {
    switch (getCollectionCreationRequest(state, requestId)) {
      case null null;
      case (?request) {
        ?saveCollectionCreationRequest(state, {
          request with
          status = #CyclesConverted;
          updatedAt = nowNat64();
          lastError = null;
        });
      };
    };
  };

  public func markCollectionCreationCanisterCreated(
    state : CollectionCreationState,
    requestId : Nat,
    childCanisterId : Principal,
  ) : ?Types.CollectionCreationRequest {
    switch (getCollectionCreationRequest(state, requestId)) {
      case null null;
      case (?request) {
        ?saveCollectionCreationRequest(state, {
          request with
          status = #CanisterCreated;
          childCanisterId = ?childCanisterId;
          updatedAt = nowNat64();
          lastError = null;
        });
      };
    };
  };

  public func markCollectionCreationRegistered(
    state : CollectionCreationState,
    requestId : Nat,
    collectionId : Types.CollectionId,
  ) : ?Types.CollectionCreationRequest {
    switch (getCollectionCreationRequest(state, requestId)) {
      case null null;
      case (?request) {
        ?saveCollectionCreationRequest(state, {
          request with
          status = #CollectionRegistered;
          collectionId = ?collectionId;
          updatedAt = nowNat64();
          lastError = null;
        });
      };
    };
  };

  public func markCollectionCreationInstalled(
    state : CollectionCreationState,
    requestId : Nat,
  ) : ?Types.CollectionCreationRequest {
    switch (getCollectionCreationRequest(state, requestId)) {
      case null null;
      case (?request) {
        ?saveCollectionCreationRequest(state, {
          request with
          status = #Installed;
          updatedAt = nowNat64();
          lastError = null;
        });
      };
    };
  };

  public func markCollectionCreationInstalledForCollection(
    state : CollectionCreationState,
    collectionId : Types.CollectionId,
  ) : Bool {
    var updated = false;
    for (request in Map.values(collectionCreationRequestMap(state))) {
      switch (request.collectionId) {
        case (?requestCollectionId) {
          if (requestCollectionId == collectionId and request.status != #Installed) {
            ignore saveCollectionCreationRequest(state, {
              request with
              status = #Installed;
              updatedAt = nowNat64();
              lastError = null;
            });
            updated := true;
          };
        };
        case null {};
      };
    };
    updated;
  };

  public func markCollectionCreationAdminPayout(
    state : CollectionCreationState,
    payoutSplitState : CollectionCreationPayoutSplitState,
    requestId : Nat,
    blockIndex : Nat64,
  ) : ?Types.CollectionCreationRequest {
    switch (getCollectionCreationRequest(state, requestId)) {
      case null null;
      case (?request) {
        let updatedRequest = {
          request with
          adminPayoutBlock = ?blockIndex;
          updatedAt = nowNat64();
          lastError = null;
        };
        let nextStatus = if (updatedRequest.status == #Installed) {
          #Installed;
        } else if (collectionCreationAdminPayoutsComplete(payoutSplitState, updatedRequest)) {
          #AdminPayoutSent;
        } else {
          #AdminPayoutPending;
        };
        ?saveCollectionCreationRequest(state, {
          updatedRequest with
          status = nextStatus;
        });
      };
    };
  };

  public func markCollectionCreationSecondaryAdminPayout(
    state : CollectionCreationState,
    payoutSplitState : CollectionCreationPayoutSplitState,
    requestId : Nat,
    blockIndex : Nat64,
  ) : ?Types.CollectionCreationRequest {
    switch (getCollectionCreationRequest(state, requestId)) {
      case null null;
      case (?request) {
        let payout = switch (getCollectionCreationRequestPayout(payoutSplitState, requestId)) {
          case (?value) value;
          case null {
            {
              requestId;
              primaryPayoutE8s = request.adminPayoutE8s;
              secondaryPayoutE8s = 0 : Nat64;
              secondaryPayoutAccount = null;
              secondaryPayoutBlock = null;
            };
          };
        };
        saveCollectionCreationRequestPayout(payoutSplitState, {
          payout with
          secondaryPayoutBlock = ?blockIndex;
        });
        let updatedRequest = {
          request with
          updatedAt = nowNat64();
          lastError = null;
        };
        let nextStatus = if (updatedRequest.status == #Installed) {
          #Installed;
        } else if (collectionCreationAdminPayoutsComplete(payoutSplitState, updatedRequest)) {
          #AdminPayoutSent;
        } else {
          #AdminPayoutPending;
        };
        ?saveCollectionCreationRequest(state, {
          updatedRequest with
          status = nextStatus;
        });
      };
    };
  };

  func collectionCreationAdminPayoutsComplete(
    payoutSplitState : CollectionCreationPayoutSplitState,
    request : Types.CollectionCreationRequest
  ) : Bool {
    let primaryComplete = collectionCreationPrimaryAdminPayoutE8s(payoutSplitState, request) == 0 or request.adminPayoutBlock != null;
    let secondaryComplete = collectionCreationSecondaryAdminPayoutE8s(payoutSplitState, request) == 0 or collectionCreationSecondaryAdminPayoutBlock(payoutSplitState, request) != null;
    primaryComplete and secondaryComplete;
  };

  public func markCollectionCreationError(
    state : CollectionCreationState,
    requestId : Nat,
    message : Text,
  ) : ?Types.CollectionCreationRequest {
    switch (getCollectionCreationRequest(state, requestId)) {
      case null null;
      case (?request) {
        ?saveCollectionCreationRequest(state, {
          request with
          updatedAt = nowNat64();
          lastError = ?message;
        });
      };
    };
  };

  public func markCollectionCreationFailed(
    state : CollectionCreationState,
    requestId : Nat,
    message : Text,
  ) : ?Types.CollectionCreationRequest {
    switch (getCollectionCreationRequest(state, requestId)) {
      case null null;
      case (?request) {
        ?saveCollectionCreationRequest(state, {
          request with
          status = #Failed;
          updatedAt = nowNat64();
          lastError = ?message;
        });
      };
    };
  };

  public func repairCollectionCreationRequestCycles(
    state : CollectionCreationState,
    payoutSplitState : CollectionCreationPayoutSplitState,
    requestId : Nat,
    quote : Types.CollectionCreationQuote,
  ) : ?Types.CollectionCreationRequest {
    switch (getCollectionCreationRequest(state, requestId)) {
      case null null;
      case (?request) {
        let hasPayment = request.cyclePaymentBlock != null;
        let updated : Types.CollectionCreationRequest = {
          request with
          requestedCanisterCycles = if (hasPayment) {
            request.requestedCanisterCycles;
          } else {
            quote.collectionCanisterCycles;
          };
          factoryReserveCycles = if (hasPayment) {
            request.factoryReserveCycles;
          } else {
            quote.factoryReserveCycles;
          };
          totalCyclesToConvert = if (hasPayment) {
            request.totalCyclesToConvert;
          } else {
            quote.totalCyclesToConvert;
          };
          cycleCostE8s = if (hasPayment) {
            request.cycleCostE8s;
          } else {
            quote.cycleCostE8s;
          };
          adminPayoutE8s = if (hasPayment) {
            request.adminPayoutE8s;
          } else {
            quote.adminPayoutE8s;
          };
          totalUserDebitE8s = if (hasPayment) {
            request.totalUserDebitE8s;
          } else {
            quote.totalUserDebitE8s;
          };
          updatedAt = nowNat64();
          lastError = ?(if (hasPayment) {
            "Paid setup request repaired for retry without changing the funded cycle amount";
          } else {
            "Unpaid setup request cycle values were repaired for retry";
          });
        };
        if (not hasPayment) {
          let payout = switch (getCollectionCreationRequestPayout(payoutSplitState, requestId)) {
            case (?value) value;
            case null {
              {
                requestId;
                primaryPayoutE8s = quote.adminPrimaryPayoutE8s;
                secondaryPayoutE8s = quote.adminSecondaryPayoutE8s;
                secondaryPayoutAccount = payoutSplitState.secondaryPayoutAccount;
                secondaryPayoutBlock = null;
              };
            };
          };
          saveCollectionCreationRequestPayout(payoutSplitState, {
            payout with
            primaryPayoutE8s = quote.adminPrimaryPayoutE8s;
            secondaryPayoutE8s = quote.adminSecondaryPayoutE8s;
            secondaryPayoutAccount = payoutSplitState.secondaryPayoutAccount;
            secondaryPayoutBlock = null;
          });
        };
        ?saveCollectionCreationRequest(state, updated);
      };
    };
  };

  public func deleteCollectionCreationRequest(
    state : CollectionCreationState,
    requestId : Nat,
  ) : Bool {
    switch (Map.get(collectionCreationRequestMap(state), Nat.compare, requestId)) {
      case null false;
      case (?request) {
        Map.remove(collectionCreationRequestMap(state), Nat.compare, requestId);
        switch (Map.get(collectionCreationOwnerMap(state), Principal.compare, request.owner)) {
          case null {};
          case (?ids) {
            let filtered = Array.filter<Nat>(
              ids,
              func(id) {
                id != requestId;
              },
            );
            if (filtered.size() == 0) {
              Map.remove(collectionCreationOwnerMap(state), Principal.compare, request.owner);
            } else {
              Map.add(collectionCreationOwnerMap(state), Principal.compare, request.owner, filtered);
            };
          };
        };
        true;
      };
    };
  };

  public func collectionCreationRequestView(
    request : Types.CollectionCreationRequest
  ) : Types.CollectionCreationRequestView {
    {
      id = request.id;
      name = request.name;
      symbol = request.symbol;
      status = request.status;
      cyclePaymentBlock = request.cyclePaymentBlock;
      childCanisterId = request.childCanisterId;
      collectionId = request.collectionId;
      lastError = request.lastError;
      createdAt = request.createdAt;
      updatedAt = request.updatedAt;
    };
  };

  func collectionCreationHasLastError(
    request : Types.CollectionCreationRequest
  ) : Bool {
    request.lastError != null;
  };

  func collectionCreationIsInstalled(
    request : Types.CollectionCreationRequest
  ) : Bool {
    switch (request.status) {
      case (#Installed) true;
      case (_) false;
    };
  };

  func collectionCreationIsFailed(
    request : Types.CollectionCreationRequest
  ) : Bool {
    switch (request.status) {
      case (#Failed) true;
      case (_) false;
    };
  };

  func collectionCreationIsStale(
    request : Types.CollectionCreationRequest
  ) : Bool {
    if (collectionCreationIsInstalled(request)) {
      return false;
    };
    if (collectionCreationHasLastError(request)) {
      return false;
    };
    let now = nowNat64();
    if (now <= request.updatedAt) {
      return false;
    };
    (now - request.updatedAt) > COLLECTION_CREATION_REPAIR_GRACE_NS;
  };

  public func collectionCreationRequestNeedsRepair(
    request : Types.CollectionCreationRequest
  ) : Bool {
    if (collectionCreationIsInstalled(request)) {
      return false;
    };
    collectionCreationIsFailed(request) or
    collectionCreationHasLastError(request) or
    collectionCreationIsStale(request);
  };

  public func activeCollectionCreationRequestsByOwner(
    state : CollectionCreationState,
    owner : Principal,
  ) : [Types.CollectionCreationRequestView] {
    var requests : [Types.CollectionCreationRequestView] = [];
    for (request in Map.values(collectionCreationRequestMap(state))) {
      if (Principal.equal(request.owner, owner) and request.status != #Installed) {
        requests := Array.concat<Types.CollectionCreationRequestView>(
          requests,
          [collectionCreationRequestView(request)],
        );
      };
    };
    requests;
  };

  public func repairableCollectionCreationRequestsByOwner(
    state : CollectionCreationState,
    owner : Principal,
  ) : [Types.CollectionCreationRequestView] {
    var requests : [Types.CollectionCreationRequestView] = [];
    for (request in Map.values(collectionCreationRequestMap(state))) {
      if (
        Principal.equal(request.owner, owner) and
        collectionCreationRequestNeedsRepair(request)
      ) {
        requests := Array.concat<Types.CollectionCreationRequestView>(
          requests,
          [collectionCreationRequestView(request)],
        );
      };
    };
    requests;
  };

  public func collectionCreationRequestsByOwner(
    state : CollectionCreationState,
    owner : Principal,
  ) : [Types.CollectionCreationRequestView] {
    var requests : [Types.CollectionCreationRequestView] = [];
    for (request in Map.values(collectionCreationRequestMap(state))) {
      if (Principal.equal(request.owner, owner)) {
        requests := Array.concat<Types.CollectionCreationRequestView>(
          requests,
          [collectionCreationRequestView(request)],
        );
      };
    };
    requests;
  };

  public func repairableCollectionCreationRequests(
    state : CollectionCreationState
  ) : [Types.CollectionCreationRequestView] {
    var requests : [Types.CollectionCreationRequestView] = [];
    for (request in Map.values(collectionCreationRequestMap(state))) {
      if (collectionCreationRequestNeedsRepair(request)) {
        requests := Array.concat<Types.CollectionCreationRequestView>(
          requests,
          [collectionCreationRequestView(request)],
        );
      };
    };
    requests;
  };

  public func allCollectionCreationRequests(
    state : CollectionCreationState
  ) : [Types.CollectionCreationRequestView] {
    var requests : [Types.CollectionCreationRequestView] = [];
    for (request in Map.values(collectionCreationRequestMap(state))) {
      requests := Array.concat<Types.CollectionCreationRequestView>(
        requests,
        [collectionCreationRequestView(request)],
      );
    };
    requests;
  };

  public func mintToken(
    state : MintState,
    owner : Principal,
    metadata : WalletTypes.NFTMetadata,
  ) : Types.MintedToken {
    let tokenId = state.nextTokenId;
    state.nextTokenId += 1;
    ignore allocateTransactionId(state);
    let mintedAt = Nat64.fromNat(Int.abs(Time.now()));
    let token : Types.MintedToken = {
      tokenId;
      owner;
      metadata;
      mintedAt;
      mintedBy = owner;
      transferredAt = null;
      transferredBy = null;
    };
    Map.add(state.tokens, Nat.compare, tokenId, token);
    token;
  };

  public func getToken(state : MintState, tokenId : Nat) : ?Types.MintedToken {
    Map.get(state.tokens, Nat.compare, tokenId);
  };

  public func attachManagedCollectionMetadata(
    metadata : WalletTypes.NFTMetadata,
    collectionId : Types.CollectionId,
    collectionName : Text,
    collectionSymbol : Text,
  ) : WalletTypes.NFTMetadata {
    {
      metadata with
      attributes = Array.concat<(Text, Text)>(
        publicAttributes(metadata.attributes),
        [
          (managedCollectionIdKey(), Nat.toText(collectionId)),
          (managedCollectionNameKey(), collectionName),
          (managedCollectionSymbolKey(), collectionSymbol),
        ],
      );
    };
  };

  public func publicMetadata(metadata : WalletTypes.NFTMetadata) : WalletTypes.NFTMetadata {
    {
      metadata with
      attributes = publicAttributes(metadata.attributes);
    };
  };

  public func tokenCollectionId(
    token : Types.MintedToken,
    legacyCollectionId : ?Types.CollectionId,
  ) : ?Types.CollectionId {
    switch (managedCollectionIdFromAttributes(token.metadata.attributes)) {
      case (?collectionId) ?collectionId;
      case null legacyCollectionId;
    };
  };

  public func tokenBelongsToCollection(
    token : Types.MintedToken,
    collectionId : Types.CollectionId,
    legacyCollectionId : ?Types.CollectionId,
  ) : Bool {
    switch (tokenCollectionId(token, legacyCollectionId)) {
      case (?resolvedCollectionId) resolvedCollectionId == collectionId;
      case null false;
    };
  };

  public func ownerTokensForCollection(
    state : MintState,
    owner : Principal,
    collectionId : Types.CollectionId,
    legacyCollectionId : ?Types.CollectionId,
  ) : [Types.MintedToken] {
    var tokens : [Types.MintedToken] = [];
    for (token in Map.values(state.tokens)) {
      if (
        Principal.equal(token.owner, owner) and
        tokenBelongsToCollection(token, collectionId, legacyCollectionId)
      ) {
        tokens := Array.concat<Types.MintedToken>(tokens, [token]);
      };
    };
    tokens;
  };

  public func tokensForCollection(
    state : MintState,
    collectionId : Types.CollectionId,
    legacyCollectionId : ?Types.CollectionId,
  ) : [Types.MintedToken] {
    var tokens : [Types.MintedToken] = [];
    for (token in Map.values(state.tokens)) {
      if (tokenBelongsToCollection(token, collectionId, legacyCollectionId)) {
        tokens := Array.concat<Types.MintedToken>(tokens, [token]);
      };
    };
    tokens;
  };

  public func transferToken(
    state : MintState,
    tokenId : Nat,
    from : Principal,
    to : Principal,
  ) : { #ok : Types.MintTransfer; #err : Text } {
    switch (Map.get(state.tokens, Nat.compare, tokenId)) {
      case null #err("Minted token not found");
      case (?token) {
        if (not Principal.equal(token.owner, from)) {
          return #err("You do not own this minted NFT");
        };
        let transferredAt = Nat64.fromNat(Int.abs(Time.now()));
        let updated : Types.MintedToken = {
          token with
          owner = to;
          transferredAt = ?transferredAt;
          transferredBy = ?from;
        };
        Map.add(state.tokens, Nat.compare, tokenId, updated);
        #ok({
          token = updated;
          transactionId = allocateTransactionId(state);
        });
      };
    };
  };

  public func ownerTokenIds(state : MintState, owner : Principal) : [Nat32] {
    var tokenIds : [Nat32] = [];
    for (token in Map.values(state.tokens)) {
      if (Principal.equal(token.owner, owner)) {
        tokenIds := Array.concat<Nat32>(tokenIds, [Nat32.fromNat(token.tokenId)]);
      };
    };
    tokenIds;
  };

  public func ownerTokenIdsNat(state : MintState, owner : Principal) : [Nat] {
    var tokenIds : [Nat] = [];
    for (token in Map.values(state.tokens)) {
      if (Principal.equal(token.owner, owner)) {
        tokenIds := Array.concat<Nat>(tokenIds, [token.tokenId]);
      };
    };
    tokenIds;
  };

  public func allTokens(state : MintState) : [Types.MintedToken] {
    var tokens : [Types.MintedToken] = [];
    for (token in Map.values(state.tokens)) {
      tokens := Array.concat<Types.MintedToken>(tokens, [token]);
    };
    tokens;
  };

  public func totalSupply(state : MintState) : Nat {
    Map.size(state.tokens);
  };

  public func tokenIds(state : MintState) : [Nat] {
    var ids : [Nat] = [];
    for ((tokenId, _) in Map.entries(state.tokens)) {
      ids := Array.concat<Nat>(ids, [tokenId]);
    };
    ids;
  };

  public func tokenMetadataPairs(
    state : MintState,
    tokenId : Nat,
  ) : ?NFTStandards.ICRC7TokenMetadata {
    switch (Map.get(state.tokens, Nat.compare, tokenId)) {
      case null null;
      case (?token) {
        var properties : NFTStandards.ICRC7TokenMetadata = [];
        switch (token.metadata.name) {
          case (?name) {
            properties := Array.concat<(Text, NFTStandards.ICRC7Value)>(
              properties,
              [
                ("name", #Text(name)),
                ("icrc7:name", #Text(name)),
              ],
            );
          };
          case null {};
        };
        switch (token.metadata.description) {
          case (?description) {
            properties := Array.concat<(Text, NFTStandards.ICRC7Value)>(
              properties,
              [
                ("description", #Text(description)),
                ("icrc7:description", #Text(description)),
              ],
            );
          };
          case null {};
        };
        switch (token.metadata.imageUrl) {
          case (?imageUrl) {
            properties := Array.concat<(Text, NFTStandards.ICRC7Value)>(
              properties,
              [
                ("image", #Text(imageUrl)),
                ("image_url", #Text(imageUrl)),
                ("url", #Text(imageUrl)),
                ("icrc7:image", #Text(imageUrl)),
                ("icrc7:logo", #Text(imageUrl)),
              ],
            );
          };
          case null {};
        };
        let publicAttrs = publicAttributes(token.metadata.attributes);
        if (publicAttrs.size() > 0) {
          var attributePairs : [(Text, NFTStandards.ICRC7Value)] = [];
          for ((key, value) in publicAttrs.values()) {
            attributePairs := Array.concat<(Text, NFTStandards.ICRC7Value)>(
              attributePairs,
              [(key, #Text(value))],
            );
          };
          properties := Array.concat<(Text, NFTStandards.ICRC7Value)>(
            properties,
            [("attributes", #Map(attributePairs))],
          );
        };
        ?properties;
      };
    };
  };

  public func tokenMetadataResult(
    state : MintState,
    tokenId : Nat,
  ) : NFTStandards.DIP721MetadataResult {
    switch (Map.get(state.tokens, Nat.compare, tokenId)) {
      case null #Err(#InvalidTokenId);
      case (?token) {
        let properties = tokenMetadataProperties(token);
        #Ok({
          transferred_at = token.transferredAt;
          transferred_by = token.transferredBy;
          owner = ?token.owner;
          operator = null;
          properties;
          is_burned = false;
          token_identifier = token.tokenId;
          burned_at = null;
          burned_by = null;
          approved_at = null;
          approved_by = null;
          minted_at = token.mintedAt;
          minted_by = token.mintedBy;
        });
      };
    };
  };

  func tokenMetadataProperties(
    token : Types.MintedToken,
  ) : [(Text, NFTStandards.TokenMetadataValue)] {
    var properties : [(Text, NFTStandards.TokenMetadataValue)] = [];
    switch (token.metadata.name) {
      case (?name) {
        properties := Array.concat<(Text, NFTStandards.TokenMetadataValue)>(
          properties,
          [("name", #TextContent(name))],
        );
      };
      case null {};
    };
    switch (token.metadata.description) {
      case (?description) {
        properties := Array.concat<(Text, NFTStandards.TokenMetadataValue)>(
          properties,
          [("description", #TextContent(description))],
        );
      };
      case null {};
    };
    switch (token.metadata.imageUrl) {
      case (?imageUrl) {
        properties := Array.concat<(Text, NFTStandards.TokenMetadataValue)>(
          properties,
          [
            ("image", #TextContent(imageUrl)),
            ("image_url", #TextContent(imageUrl)),
            ("url", #TextContent(imageUrl)),
          ],
        );
      };
      case null {};
    };
    for ((key, value) in publicAttributes(token.metadata.attributes).values()) {
      properties := Array.concat<(Text, NFTStandards.TokenMetadataValue)>(
        properties,
        [(key, #TextContent(value))],
      );
    };
    properties;
  };

  func allocateTransactionId(state : MintState) : Nat {
    let transactionId = state.nextTransactionId;
    state.nextTransactionId += 1;
    transactionId;
  };

  func publicAttributes(attributes : [(Text, Text)]) : [(Text, Text)] {
    var filtered : [(Text, Text)] = [];
    for ((key, value) in attributes.values()) {
      if (not isManagedCollectionAttribute(key)) {
        filtered := Array.concat<(Text, Text)>(filtered, [(key, value)]);
      };
    };
    filtered;
  };

  func managedCollectionIdFromAttributes(
    attributes : [(Text, Text)]
  ) : ?Types.CollectionId {
    for ((key, value) in attributes.values()) {
      if (key == managedCollectionIdKey()) {
        return Nat.fromText(value);
      };
    };
    null;
  };

  func isManagedCollectionAttribute(key : Text) : Bool {
    key == managedCollectionIdKey() or
    key == managedCollectionNameKey() or
    key == managedCollectionSymbolKey();
  };

  func managedCollectionIdKey() : Text {
    "mintlab:collection_id";
  };

  func managedCollectionNameKey() : Text {
    "mintlab:collection_name";
  };

  func managedCollectionSymbolKey() : Text {
    "mintlab:collection_symbol";
  };
};
