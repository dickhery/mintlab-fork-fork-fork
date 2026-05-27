import Array "mo:core/Array";
import Blob "mo:core/Blob";
import Cycles "mo:core/Cycles";
import Debug "mo:core/Debug";
import Error "mo:core/Error";
import Int "mo:core/Int";
import CollectionsLib "../lib/collections";
import HttpMedia "../lib/http-media";
import IcpLib "../lib/icp";
import MarketplaceLib "../lib/marketplace";
import MintLib "../lib/mint";
import WalletLib "../lib/wallet";
import AuthLib "../lib/auth";
import CommonTypes "../types/common";
import CollectionTypes "../types/collections";
import MintTypes "../types/mint";
import WalletTypes "../types/wallet";
import NFTStandards "../lib/nft-standards";
import Prim "mo:⛔";
import Runtime "mo:core/Runtime";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Nat8 "mo:core/Nat8";
import Nat32 "mo:core/Nat32";
import Nat64 "mo:core/Nat64";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import Time "mo:core/Time";

mixin (
  mintState : MintLib.MintState,
  collectionCreationState : MintLib.CollectionCreationState,
  collectionCreationPayoutSplitState : MintLib.CollectionCreationPayoutSplitState,
  moderationState : MintLib.ModerationState,
  pendingMintPaymentState : MintLib.PendingMintPaymentState,
  collectionsState : CollectionsLib.CollectionsState,
  walletState : WalletLib.WalletState,
  authState : AuthLib.AdminState,
  marketplaceUserPaymentLockState : MarketplaceLib.MarketplaceUserPaymentLockState,
  canisterId : Principal,
) {
  type CanisterSettings = {
    controllers : ?[Principal];
    compute_allocation : ?Nat;
    memory_allocation : ?Nat;
    freezing_threshold : ?Nat;
  };

  type CreateCanisterResult = {
    canister_id : Principal;
  };

  type InstallCodeMode = {
    #install;
    #reinstall;
    #upgrade : ?{
      skip_pre_upgrade : ?Bool;
      wasm_memory_persistence : ?{
        #keep;
        #replace;
      };
    };
  };

  type InstallCodeArgs = {
    mode : InstallCodeMode;
    canister_id : Principal;
    wasm_module : Blob;
    arg : Blob;
    sender_canister_version : ?Nat64;
  };

  type DepositCyclesArgs = {
    canister_id : Principal;
  };

  type HttpHeader = {
    name : Text;
    value : Text;
  };

  type HttpRequestResult = {
    status : Nat;
    body : Blob;
    headers : [HttpHeader];
  };

  type HttpRequestArgs = {
    url : Text;
    method : { #get; #put; #head; #post; #delete };
    max_response_bytes : ?Nat64;
    body : ?Blob;
    transform : ?{
      function : shared query {
        context : Blob;
        response : HttpRequestResult;
      } -> async HttpRequestResult;
      context : Blob;
    };
    headers : [HttpHeader];
    is_replicated : ?Bool;
  };

  type CanisterStatusSettings = {
    controllers : [Principal];
    freezing_threshold : Nat;
  };

  type CanisterStatusResult = {
    cycles : Nat;
    module_hash : ?Blob;
    idle_cycles_burned_per_day : Nat;
    settings : CanisterStatusSettings;
  };

  type CollectionCanisterInitArgs = {
    owner : Principal;
    parent : Principal;
    name : Text;
    description : Text;
    symbol : Text;
    logo : Text;
  };

  type ChildMintResult = {
    #ok : { tokenId : Nat; transactionId : Nat };
    #err : Text;
  };

  type ChildCollectionActor = actor {
    mintlab_mint : (Principal, WalletTypes.NFTMetadata) -> async ChildMintResult;
  };

  type ChildCollectionInfoActor = actor {
    mintlab_collection_owner : () -> async Principal;
  };

  type MintFinalizeResult = {
    receipt : MintTypes.MintReceipt;
    tokenId : Nat;
  };

  type EXTTokenIdentifier = Text;
  type EXTAccountIdentifier = Text;
  type EXTBalance = Nat;
  type EXTTokenIndex = Nat32;
  type EXTSubAccount = Blob;
  type EXTMemo = Blob;
  type EXTTime = Int;

  type EXTUser = {
    #address : EXTAccountIdentifier;
    #principal : Principal;
  };

  type EXTCommonError = {
    #InvalidToken : EXTTokenIdentifier;
    #Other : Text;
  };

  type EXTBalanceRequest = {
    token : EXTTokenIdentifier;
    user : EXTUser;
  };

  type EXTBalanceResponse = {
    #ok : EXTBalance;
    #err : EXTCommonError;
  };

  type EXTMetadataContainer = {
    #blob : Blob;
    #data : [EXTMetadataValue];
    #json : Text;
  };

  type EXTMetadataValue = (
    Text,
    {
      #blob : Blob;
      #nat : Nat;
      #nat8 : Nat8;
      #text : Text;
    },
  );

  type EXTMetadata = {
    #fungible : {
      decimals : Nat8;
      metadata : ?EXTMetadataContainer;
      name : Text;
      symbol : Text;
    };
    #nonfungible : {
      asset : Text;
      metadata : ?EXTMetadataContainer;
      name : Text;
      thumbnail : Text;
    };
  };

  type EXTMetadataResult = {
    #ok : EXTMetadata;
    #err : EXTCommonError;
  };

  type EXTMetadataLegacy = {
    #fungible : {
      decimals : Nat8;
      metadata : ?Blob;
      name : Text;
      symbol : Text;
    };
    #nonfungible : { metadata : ?Blob };
  };

  type EXTListing = {
    locked : ?EXTTime;
    price : Nat64;
    seller : Principal;
  };

  type EXTTokensExtResult = {
    #ok : [(EXTTokenIndex, ?EXTListing, ?Blob)];
    #err : EXTCommonError;
  };

  type EXTTransferRequest = {
    amount : EXTBalance;
    from : EXTUser;
    memo : EXTMemo;
    notify : Bool;
    subaccount : ?EXTSubAccount;
    to : EXTUser;
    token : EXTTokenIdentifier;
  };

  type EXTTransferResponse = {
    #ok : EXTBalance;
    #err : {
      #CannotNotify : EXTAccountIdentifier;
      #InsufficientBalance;
      #InvalidToken : EXTTokenIdentifier;
      #Other : Text;
      #Rejected;
      #Unauthorized : EXTAccountIdentifier;
    };
  };

  type AssetHttpRequest = HttpMedia.HttpRequest;
  type AssetHttpResponse = HttpMedia.HttpResponse;

  type PreparedModerationImage = {
    imageUrl : Text;
    requestId : Text;
  };

  transient let MAX_ON_CHAIN_IMAGE_CHARS : Nat = 1_900_000;
  // Keep Base64 image moderation comfortably below IC outcall payload limits.
  transient let MODERATION_MAX_IMAGE_DATA_URL_CHARS : Nat = 320_000;
  transient let MODERATION_MAX_REQUEST_BODY_BYTES : Nat = 380_000;
  transient let MODERATION_MAX_RESPONSE_BYTES : Nat64 = 24_000;
  transient let CMC_RATE_CACHE_TTL_NS : Nat64 = 60_000_000_000;
  transient let CYCLE_DEBUG_LOGS_ENABLED : Bool = false;
  transient let PAYOUT_BASIS_POINTS_TOTAL : Nat = 10_000;
  transient let MINT_COOLDOWN_NS : Int = 10_000_000_000; // 10 seconds
  transient let COLLECTION_CREATION_COOLDOWN_NS : Int = 60_000_000_000; // 1 minute
  transient let COLLECTION_CREATION_PAGE_DEFAULT : Nat = 25;
  transient let COLLECTION_CREATION_PAGE_MAX : Nat = 100;
  transient var moderationImageNonce : Nat = 0;
  transient var cachedCmcRate : ?IcpLib.IcpXdrConversionRate = null;
  transient var cachedCmcRateFetchedAt : Nat64 = 0;
  transient let mintCooldowns = Map.empty<Principal, Int>();
  transient let collectionCreationCooldowns = Map.empty<Principal, Int>();

  func acquireUserPaymentLockResult(user : Principal) : ?Text {
    if (not MarketplaceLib.acquireUserPaymentLock(marketplaceUserPaymentLockState, user)) {
      ?"Another ICP operation is already using this account balance. Try again shortly.";
    } else {
      null;
    };
  };

  func releaseUserPaymentLock(user : Principal) {
    MarketplaceLib.releaseUserPaymentLock(marketplaceUserPaymentLockState, user);
  };

  func enforcePrincipalCooldown(
    cooldowns : Map.Map<Principal, Int>,
    caller : Principal,
    cooldownNs : Int,
    message : Text,
  ) : ?Text {
    let now = Time.now();
    switch (Map.get(cooldowns, Principal.compare, caller)) {
      case (?lastStartedAt) {
        if (now > lastStartedAt and now - lastStartedAt < cooldownNs) {
          return ?message;
        };
      };
      case null {};
    };
    Map.add(cooldowns, Principal.compare, caller, now);
    null;
  };

  type ManagementCanisterActor = actor {
    create_canister : shared ({
      settings : ?CanisterSettings;
      sender_canister_version : ?Nat64;
    }) -> async CreateCanisterResult;
    install_code : shared InstallCodeArgs -> async ();
    deposit_cycles : shared DepositCyclesArgs -> async ();
    canister_status : shared DepositCyclesArgs -> async CanisterStatusResult;
    update_settings : shared ({
      canister_id : Principal;
      settings : CanisterSettings;
      sender_canister_version : ?Nat64;
    }) -> async ();
    http_request : shared HttpRequestArgs -> async HttpRequestResult;
  };

  transient let managementCanister : ManagementCanisterActor = actor "aaaaa-aa";

  func assertCyclesForCall(amount : Nat, operationLabel : Text) {
    if (amount == 0) {
      Runtime.trap(operationLabel # ": refusing to attach 0 cycles");
    };

    let backendBalance = Cycles.balance();
    let reserve = minimumFactoryOperatingReserveCycles();
    if (backendBalance <= amount + reserve) {
      Runtime.trap(
        operationLabel #
        ": backend does not have enough cycles to attach " #
        Nat.toText(amount) #
        " while keeping reserve " #
        Nat.toText(reserve) #
        ". Backend balance: " #
        Nat.toText(backendBalance)
      );
    };

    if (CYCLE_DEBUG_LOGS_ENABLED) {
      Debug.print(
        "MINTLAB cycles-attach-v7 preparing " #
        operationLabel #
        " attachCycles=" #
        Nat.toText(amount) #
        " backendBalanceBefore=" #
        Nat.toText(backendBalance)
      );
    };
  };

  public query func getMintConfig() : async MintTypes.MintConfig {
    MintLib.getPublicConfig(mintState, collectionCreationPayoutSplitState);
  };

  public query func getModerationConfig() : async MintTypes.PublicModerationConfig {
    MintLib.getPublicModerationConfig(moderationState);
  };

  public shared ({ caller }) func configureModeration(
    enabled : Bool,
    apiKey : ?Text,
    clearApiKey : Bool,
    model : Text,
    categories : MintTypes.ModerationCategorySettings,
    userMessage : Text,
  ) : async MintTypes.PublicModerationConfig {
    if (Principal.isAnonymous(caller)) Runtime.trap("Anonymous caller not allowed");
    if (not AuthLib.isAdmin(authState, caller)) Runtime.trap("Unauthorized: admin only");
    let trimmedModel = Text.trim(model, #char ' ');
    let trimmedMessage = Text.trim(userMessage, #char ' ');
    let normalizedApiKey = switch (apiKey) {
      case (?value) {
        let sanitized = sanitizeModerationApiKey(value);
        if (sanitized == "") null else ?sanitized;
      };
      case null null;
    };
    MintLib.configureModeration(
      moderationState,
      enabled,
      normalizedApiKey,
      clearApiKey,
      trimmedModel,
      categories,
      trimmedMessage,
    );
    MintLib.getPublicModerationConfig(moderationState);
  };

  public query func transformModerationResponse(
    args : {
      context : Blob;
      response : HttpRequestResult;
    }
  ) : async HttpRequestResult {
    let normalized = switch (Text.decodeUtf8(args.response.body)) {
      case (?body) openAIModerationSummaryFromResponse(args.response.status, body);
      case null "ERROR_NON_UTF8";
    };
    {
      status = args.response.status;
      body = Text.encodeUtf8(normalized);
      headers = [];
    };
  };

  func openAIModerationSummaryFromResponse(status : Nat, body : Text) : Text {
    if (status != 200) {
      return moderationErrorDiagnostic(body);
    };

    let compact = compactModerationResponseBody(body);
    if (Text.contains(compact, #text "\"error\":")) {
      return moderationErrorDiagnostic(body);
    };

    switch (jsonBool(compact, "flagged")) {
      case (?flagged) {
        "OPENAI_MODERATION" #
        ";flagged=" # boolText(flagged) #
        ";sexual=" # boolText(jsonBoolDefault(compact, "sexual")) #
        ";sexual_minors=" # boolText(jsonBoolDefault(compact, "sexual/minors")) #
        ";harassment=" # boolText(jsonBoolDefault(compact, "harassment")) #
        ";harassment_threatening=" # boolText(jsonBoolDefault(compact, "harassment/threatening")) #
        ";hate=" # boolText(jsonBoolDefault(compact, "hate")) #
        ";hate_threatening=" # boolText(jsonBoolDefault(compact, "hate/threatening")) #
        ";illicit=" # boolText(jsonBoolDefault(compact, "illicit")) #
        ";illicit_violent=" # boolText(jsonBoolDefault(compact, "illicit/violent")) #
        ";self_harm=" # boolText(jsonBoolDefault(compact, "self-harm")) #
        ";self_harm_intent=" # boolText(jsonBoolDefault(compact, "self-harm/intent")) #
        ";self_harm_instructions=" # boolText(jsonBoolDefault(compact, "self-harm/instructions")) #
        ";violence=" # boolText(jsonBoolDefault(compact, "violence")) #
        ";violence_graphic=" # boolText(jsonBoolDefault(compact, "violence/graphic"));
      };
      case null "UNKNOWN";
    };
  };

  func jsonBool(body : Text, field : Text) : ?Bool {
    if (Text.contains(body, #text ("\"" # field # "\":true"))) {
      ?true;
    } else if (Text.contains(body, #text ("\"" # field # "\":false"))) {
      ?false;
    } else {
      null;
    };
  };

  func jsonBoolDefault(body : Text, field : Text) : Bool {
    switch (jsonBool(body, field)) {
      case (?value) value;
      case null false;
    };
  };

  func boolText(value : Bool) : Text {
    if (value) "true" else "false";
  };

  func moderationErrorDiagnostic(body : Text) : Text {
    let compact = Text.toLower(compactModerationResponseBody(body));
    if (
      Text.contains(compact, #text "image") and
      (Text.contains(compact, #text "url") or Text.contains(compact, #text "uri") or Text.contains(compact, #text "fetch") or Text.contains(compact, #text "download"))
    ) {
      "ERROR_IMAGE_URL";
    } else if (
      Text.contains(compact, #text "api key") or
      Text.contains(compact, #text "apikey") or
      Text.contains(compact, #text "permission") or
      Text.contains(compact, #text "denied") or
      Text.contains(compact, #text "forbidden") or
      Text.contains(compact, #text "unauthorized")
    ) {
      "ERROR_AUTH";
    } else if (
      Text.contains(compact, #text "quota") or
      Text.contains(compact, #text "rate") or
      Text.contains(compact, #text "resource_exhausted")
    ) {
      "ERROR_RATE_LIMIT";
    } else if (
      Text.contains(compact, #text "content") or
      Text.contains(compact, #text "base64") or
      Text.contains(compact, #text "invalid")
    ) {
      "ERROR_CONTENT";
    } else {
      "ERROR";
    };
  };

  func moderationResponseDiagnostic(body : Blob) : Text {
    switch (Text.decodeUtf8(body)) {
      case (?value) value;
      case null "ERROR_NON_UTF8";
    };
  };

  func compactModerationResponseBody(body : Text) : Text {
    let noSpaces = Text.replace(body, #text " ", "");
    let noNewlines = Text.replace(noSpaces, #text "\n", "");
    let noCarriageReturns = Text.replace(noNewlines, #text "\r", "");
    Text.replace(noCarriageReturns, #text "\t", "");
  };

  public func quoteCollectionCreationCost(
    collectionCanisterCycles : Nat,
    collectionCreationPriceE8s : Nat64,
    collectionCreationPrimaryPayoutBasisPoints : Nat,
    collectionCreationSecondaryPayoutBasisPoints : Nat,
  ) : async MintTypes.CollectionCreationQuote {
    validateCollectionCreationPayoutShares(
      collectionCreationPrimaryPayoutBasisPoints,
      collectionCreationSecondaryPayoutBasisPoints,
    );
    await collectionCreationQuoteFor(
      normalizedCollectionCanisterCycles(collectionCanisterCycles),
      collectionCreationPriceE8s,
      collectionCreationPrimaryPayoutBasisPoints,
      collectionCreationSecondaryPayoutBasisPoints,
    );
  };

  public shared ({ caller }) func getMyCreatedCollections() : async [CollectionTypes.Collection] {
    if (Principal.isAnonymous(caller)) {
      return [];
    };
    var collections : [CollectionTypes.Collection] = [];
    for (collectionId in (await manageableMintedCollectionIds(caller)).values()) {
      switch (CollectionsLib.getCollection(collectionsState, collectionId)) {
        case (?collection) {
          if (collection.kind == #Minted) {
            collections := Array.concat<CollectionTypes.Collection>(collections, [collection]);
          };
        };
        case null {};
      };
    };
    collections;
  };

  public shared ({ caller }) func getMyCollectionCanisterStatuses() : async [MintTypes.CollectionCanisterStatus] {
    if (Principal.isAnonymous(caller)) {
      return [];
    };
    var statuses : [MintTypes.CollectionCanisterStatus] = [];
    for (collectionId in (await manageableMintedCollectionIds(caller)).values()) {
      switch (CollectionsLib.getCollection(collectionsState, collectionId)) {
        case (?collection) {
          if (collection.kind == #Minted and not Principal.equal(collection.canisterId, canisterId)) {
            switch (await collectionCanisterStatus(collection.canisterId)) {
              case (?status) {
                statuses := Array.concat<MintTypes.CollectionCanisterStatus>(
                  statuses,
                  [collectionCanisterStatusRecord(collection.id, collection.canisterId, status)],
                );
              };
              case null {};
            };
          };
        };
        case null {};
      };
    };
    statuses;
  };

  public shared query ({ caller }) func getMyCollectionCreationRequests() : async [MintTypes.CollectionCreationRequestView] {
    if (Principal.isAnonymous(caller)) {
      return [];
    };
    MintLib.repairableCollectionCreationRequestsByOwner(collectionCreationState, caller);
  };

  public shared query ({ caller }) func getMyCollectionCreationRequestsPage(
    cursor : ?Nat,
    limit : ?Nat,
  ) : async MintTypes.CollectionCreationRequestPage {
    if (Principal.isAnonymous(caller)) {
      return {
        requests = [];
        nextCursor = null;
        totalCount = 0;
      };
    };
    collectionCreationRequestPageFromViews(
      MintLib.repairableCollectionCreationRequestsByOwner(collectionCreationState, caller),
      mintCursorOrZero(cursor),
      normalizeCollectionCreationPageSize(limit),
    );
  };

  public shared query ({ caller }) func getAllCollectionCreationRequests() : async {
    #ok : [MintTypes.CollectionCreationRequestView];
    #err : Text;
  } {
    if (Principal.isAnonymous(caller)) {
      return #err("Anonymous caller not allowed");
    };
    if (not AuthLib.isAdmin(authState, caller)) {
      return #err("Unauthorized: admin only");
    };
    #ok(MintLib.repairableCollectionCreationRequests(collectionCreationState));
  };

  public shared query ({ caller }) func getAllCollectionCreationRequestsPage(
    cursor : ?Nat,
    limit : ?Nat,
  ) : async {
    #ok : MintTypes.CollectionCreationRequestPage;
    #err : Text;
  } {
    if (Principal.isAnonymous(caller)) {
      return #err("Anonymous caller not allowed");
    };
    if (not AuthLib.isAdmin(authState, caller)) {
      return #err("Unauthorized: admin only");
    };
    #ok(
      collectionCreationRequestPageFromViews(
        MintLib.repairableCollectionCreationRequests(collectionCreationState),
        mintCursorOrZero(cursor),
        normalizeCollectionCreationPageSize(limit),
      )
    );
  };

  public shared ({ caller }) func recoverCollectionCreationRecord(
    requestId : Nat
  ) : async { #ok : MintTypes.CollectionCreationRequestView; #err : Text } {
    if (Principal.isAnonymous(caller)) {
      return #err("You must be logged in to view a collection setup request");
    };
    let request = switch (MintLib.getCollectionCreationRequest(collectionCreationState, requestId)) {
      case null return #err("Collection creation request not found");
      case (?value) value;
    };
    if (not Principal.equal(request.owner, caller) and not AuthLib.isAdmin(authState, caller)) {
      return #err("Only the collection creator or admin can view this collection setup request");
    };
    #ok(MintLib.collectionCreationRequestView(request));
  };

  public shared query ({ caller }) func getCollectionCreationDiagnostics(
    requestId : Nat
  ) : async { #ok : MintTypes.CollectionCreationDiagnostics; #err : Text } {
    if (Principal.isAnonymous(caller)) {
      return #err("You must be logged in to inspect collection setup");
    };
    let request = switch (MintLib.getCollectionCreationRequest(collectionCreationState, requestId)) {
      case null return #err("Collection creation request not found");
      case (?value) value;
    };
    if (not Principal.equal(request.owner, caller) and not AuthLib.isAdmin(authState, caller)) {
      return #err("Only the collection creator or admin can inspect this setup request");
    };

    let childTargetCycles = collectionCreationChildTargetCycles(request);
    let createCallCycles = collectionCreationCreateCallCycles(request);
    let backendCycles = Cycles.balance();
    let requiresBackendCreateCycles =
      request.childCanisterId == null and collectionCreationCyclesConverted(request);
    let requiredBackendCycles = if (requiresBackendCreateCycles) {
      createCallCycles + minimumFactoryOperatingReserveCycles();
    } else {
      0;
    };
    #ok({
      request = MintLib.collectionCreationRequestView(request);
      requestedCanisterCycles = request.requestedCanisterCycles;
      totalCyclesToConvert = request.totalCyclesToConvert;
      childTargetCycles;
      createCallCycles;
      canisterCreationFeeCycles = canisterCreationFeeCycles();
      backendCycles;
      requiredBackendCycles;
      canCreateNow = if (requiresBackendCreateCycles) {
        backendCycles > requiredBackendCycles;
      } else {
        request.cyclePaymentBlock != null or request.childCanisterId != null;
      };
      buildVersion = "mintlab-collection-create-cmc-v7";
    });
  };

  public shared ({ caller }) func repairCollectionCreationRequest(
    requestId : Nat
  ) : async { #ok : MintTypes.CollectionCreationRequestView; #err : Text } {
    if (Principal.isAnonymous(caller)) {
      return #err("Anonymous caller not allowed");
    };
    let request = switch (MintLib.getCollectionCreationRequest(collectionCreationState, requestId)) {
      case null return #err("Collection creation request not found");
      case (?value) value;
    };
    if (not Principal.equal(request.owner, caller) and not AuthLib.isAdmin(authState, caller)) {
      return #err("Only the collection creator or admin can repair this setup request");
    };
    await repairCollectionCreationRequestInternal(requestId);
  };

  public shared ({ caller }) func adminDeleteCollectionCreationRequest(
    requestId : Nat
  ) : async { #ok : Bool; #err : Text } {
    if (Principal.isAnonymous(caller)) {
      return #err("Anonymous caller not allowed");
    };
    if (not AuthLib.isAdmin(authState, caller)) {
      return #err("Unauthorized: admin only");
    };
    let request = switch (MintLib.getCollectionCreationRequest(collectionCreationState, requestId)) {
      case null return #err("Collection creation request not found");
      case (?value) value;
    };
    if (request.cyclePaymentBlock != null and request.childCanisterId == null and request.collectionId == null) {
      return #err(
        "This request has an ICP payment block but no collection yet. Recover it first or settle it manually before deleting."
      );
    };
    #ok(MintLib.deleteCollectionCreationRequest(collectionCreationState, requestId));
  };

  public shared ({ caller }) func retryCollectionCreationRequest(
    requestId : Nat
  ) : async { #ok : MintTypes.CollectionCreationReceipt; #err : Text } {
    if (Principal.isAnonymous(caller)) {
      return #err("You must be logged in to retry collection setup");
    };
    let request = switch (MintLib.getCollectionCreationRequest(collectionCreationState, requestId)) {
      case null return #err("Collection creation request not found");
      case (?value) value;
    };
    if (not Principal.equal(request.owner, caller) and not AuthLib.isAdmin(authState, caller)) {
      return #err("Only the collection creator or admin can retry this collection setup");
    };
    switch (acquireUserPaymentLockResult(request.owner)) {
      case (?message) return #err(message);
      case null {};
    };
    try {
      if (not MintLib.acquireCollectionCreate(mintState, request.owner)) {
        return #err("A collection setup is already running for this creator");
      };
      try {
        switch (await repairCollectionCreationRequestInternal(requestId)) {
          case (#err(message)) return #err(message);
          case (#ok(_)) {};
        };
        await resumeCollectionCreationInternal(caller, requestId);
      } finally {
        MintLib.releaseCollectionCreate(mintState, request.owner);
      };
    } finally {
      releaseUserPaymentLock(request.owner);
    };
  };

  public shared ({ caller }) func adminAttachExistingCanisterToCreationRequest(
    requestId : Nat,
    childCanisterId : Principal,
  ) : async { #ok : MintTypes.CollectionCreationReceipt; #err : Text } {
    if (Principal.isAnonymous(caller)) {
      return #err("Anonymous caller not allowed");
    };
    if (not AuthLib.isAdmin(authState, caller)) {
      return #err("Unauthorized: admin only");
    };
    if (Principal.isAnonymous(childCanisterId)) {
      return #err("Choose a valid child canister");
    };
    let request = switch (MintLib.getCollectionCreationRequest(collectionCreationState, requestId)) {
      case null return #err("Collection creation request not found");
      case (?value) value;
    };
    if (request.cyclePaymentBlock == null) {
      return #err("This setup request has no recorded ICP cycles payment block");
    };
    if (request.childCanisterId != null or request.collectionId != null) {
      return #err("This setup request already has a child canister or collection record");
    };
    let status = switch (await collectionCanisterStatus(childCanisterId)) {
      case null return #err("Could not read the child canister status. Make sure the app backend is a controller.");
      case (?value) value;
    };
    if (not principalArrayContains(status.settings.controllers, canisterId)) {
      return #err("The app backend must be a controller of the child canister before it can install the collection WASM.");
    };
    let requiredControllers = appendController(
      appendController(status.settings.controllers, canisterId),
      request.owner,
    );
    if (requiredControllers.size() != status.settings.controllers.size()) {
      try {
        await updateCollectionCanisterControllers(childCanisterId, requiredControllers);
      } catch (error) {
        return #err("Could not add the collection owner as a child canister controller: " # Error.message(error));
      };
    };
    switch (acquireUserPaymentLockResult(request.owner)) {
      case (?message) return #err(message);
      case null {};
    };
    try {
      if (not MintLib.acquireCollectionCreate(mintState, request.owner)) {
        return #err("A collection setup is already running for this creator");
      };
      try {
        ignore MintLib.markCollectionCreationCyclesConverted(collectionCreationState, requestId);
        ignore MintLib.markCollectionCreationCanisterCreated(collectionCreationState, requestId, childCanisterId);
        await resumeCollectionCreationInternal(caller, requestId);
      } finally {
        MintLib.releaseCollectionCreate(mintState, request.owner);
      };
    } finally {
      releaseUserPaymentLock(request.owner);
    };
  };

  public shared ({ caller }) func adminRecoverPaidCollectionCreation(
    owner : Principal,
    cyclePaymentBlock : Nat64,
    name : Text,
    description : Text,
    symbol : Text,
    imageUrl : Text,
    dividendsEnabled : Bool,
  ) : async { #ok : MintTypes.CollectionCreationReceipt; #err : Text } {
    if (Principal.isAnonymous(caller)) {
      return #err("Anonymous caller not allowed");
    };
    if (not AuthLib.isAdmin(authState, caller)) {
      return #err("Unauthorized: admin only");
    };
    if (Principal.isAnonymous(owner)) {
      return #err("Recovered collection owner cannot be anonymous");
    };
    switch (validateCollectionProfileResult(name, description, symbol, imageUrl)) {
      case (?message) return #err(message);
      case null {};
    };
    let config = MintLib.getConfig(mintState);
    let canisterCycles = normalizedCollectionCanisterCycles(config.collectionCanisterCycles);
    if (not config.collectionCanisterWasmUploaded) {
      return #err("The admin has not uploaded the collection canister WASM yet");
    };
    switch (MintLib.getCollectionCanisterWasm(mintState)) {
      case null return #err("The collection canister WASM is missing");
      case (?_) {};
    };
    let quote = try {
      await collectionCreationQuoteFor(
        canisterCycles,
        config.collectionCreationPriceE8s,
        MintLib.collectionCreationPrimaryPayoutBasisPoints(collectionCreationPayoutSplitState),
        MintLib.collectionCreationSecondaryPayoutBasisPoints(collectionCreationPayoutSplitState),
      );
    } catch (error) {
      return #err("Could not fetch the ICP-to-cycles conversion rate: " # Error.message(error));
    };
    switch (acquireUserPaymentLockResult(owner)) {
      case (?message) return #err(message);
      case null {};
    };
    try {
      if (not MintLib.acquireCollectionCreate(mintState, owner)) {
        return #err("A collection setup is already running for this creator");
      };
      try {
        let request = MintLib.beginRecoveredCollectionCreationRequest(
          collectionCreationState,
          collectionCreationPayoutSplitState,
          owner,
          cyclePaymentBlock,
          name,
          description,
          symbol,
          imageUrl,
          dividendsEnabled,
          quote,
        );
        await resumeCollectionCreationInternal(caller, request.id);
      } finally {
        MintLib.releaseCollectionCreate(mintState, owner);
      };
    } finally {
      releaseUserPaymentLock(owner);
    };
  };

  public shared ({ caller }) func getAppCanisterHealth(
    frontendCanisterId : ?Principal
  ) : async { #ok : [MintTypes.AppCanisterHealth]; #err : Text } {
    if (Principal.isAnonymous(caller)) {
      return #err("Anonymous caller not allowed");
    };
    if (not AuthLib.isAdmin(authState, caller)) {
      return #err("Unauthorized: admin only");
    };

    var health = [backendCanisterHealth()];
    switch (frontendCanisterId) {
      case (?id) {
        if (not Principal.isAnonymous(id) and not Principal.equal(id, canisterId)) {
          health := Array.concat<MintTypes.AppCanisterHealth>(
            health,
            [await appCanisterHealthFromStatus(#Frontend, id)],
          );
        };
      };
      case null {};
    };
    #ok(health);
  };

  public shared ({ caller }) func getCollectionCanisterControllers(
    collectionId : CollectionTypes.CollectionId
  ) : async { #ok : MintTypes.CollectionCanisterControllers; #err : Text } {
    switch (await currentCollectionControllers(caller, collectionId)) {
      case (#err(message)) #err(message);
      case (#ok(info)) {
        #ok(collectionCanisterControllersRecord(info.collection.id, info.collection.canisterId, info.controllers));
      };
    };
  };

  public shared ({ caller }) func addCollectionCanisterController(
    collectionId : CollectionTypes.CollectionId,
    controller : Principal,
  ) : async { #ok : MintTypes.CollectionCanisterControllers; #err : Text } {
    if (Principal.isAnonymous(controller)) {
      return #err("Controller principal cannot be anonymous");
    };
    switch (await currentCollectionControllers(caller, collectionId)) {
      case (#err(message)) #err(message);
      case (#ok(info)) {
        let nextControllers = appendController(info.controllers, controller);
        if (nextControllers.size() == info.controllers.size()) {
          return #ok(collectionCanisterControllersRecord(info.collection.id, info.collection.canisterId, info.controllers));
        };
        try {
          await updateCollectionCanisterControllers(info.collection.canisterId, nextControllers);
          #ok(collectionCanisterControllersRecord(info.collection.id, info.collection.canisterId, nextControllers));
        } catch (error) {
          #err("Could not add controller: " # Error.message(error));
        };
      };
    };
  };

  public shared ({ caller }) func removeCollectionCanisterController(
    collectionId : CollectionTypes.CollectionId,
    controller : Principal,
  ) : async { #ok : MintTypes.CollectionCanisterControllers; #err : Text } {
    switch (await currentCollectionControllers(caller, collectionId)) {
      case (#err(message)) #err(message);
      case (#ok(info)) {
        if (not principalArrayContains(info.controllers, controller)) {
          return #err("That principal is not a controller of this collection canister");
        };
        if (info.controllers.size() <= 1) {
          return #err("Cannot remove the final controller from a collection canister");
        };
        let nextControllers = removeController(info.controllers, controller);
        if (nextControllers.size() == 0) {
          return #err("Cannot remove the final controller from a collection canister");
        };
        try {
          await updateCollectionCanisterControllers(info.collection.canisterId, nextControllers);
          #ok(collectionCanisterControllersRecord(info.collection.id, info.collection.canisterId, nextControllers));
        } catch (error) {
          #err("Could not remove controller: " # Error.message(error));
        };
      };
    };
  };

  public func quoteCollectionCycleTopUp(
    cyclesToTopUp : Nat
  ) : async MintTypes.CollectionCycleTopUpQuote {
    await collectionCycleTopUpQuoteFor(normalizedCollectionTopUpCycles(cyclesToTopUp));
  };

  public func quoteAppCanisterCycleTopUp(
    cyclesToTopUp : Nat
  ) : async MintTypes.CollectionCycleTopUpQuote {
    await collectionCycleTopUpQuoteFor(normalizedCollectionTopUpCycles(cyclesToTopUp));
  };

  public shared ({ caller }) func topUpAppCanisterCycles(
    cyclesToTopUp : Nat,
  ) : async { #ok : MintTypes.AppCycleTopUpReceipt; #err : Text } {
    await topUpCanisterCyclesFor(caller, canisterId, cyclesToTopUp);
  };

  public shared ({ caller }) func topUpCanisterCycles(
    targetCanister : Principal,
    cyclesToTopUp : Nat,
  ) : async { #ok : MintTypes.AppCycleTopUpReceipt; #err : Text } {
    if (Principal.isAnonymous(targetCanister)) {
      return #err("Choose a valid canister to top up");
    };
    await topUpCanisterCyclesFor(caller, targetCanister, cyclesToTopUp);
  };

  func topUpCanisterCyclesFor(
    caller : Principal,
    targetCanister : Principal,
    cyclesToTopUp : Nat,
  ) : async { #ok : MintTypes.AppCycleTopUpReceipt; #err : Text } {
    if (Principal.isAnonymous(caller)) {
      return #err("You must be logged in to top up a canister");
    };
    let normalizedCycles = normalizedCollectionTopUpCycles(cyclesToTopUp);
    let quote = try {
      await collectionCycleTopUpQuoteFor(normalizedCycles);
    } catch (error) {
      return #err("Could not fetch the ICP-to-cycles conversion rate: " # Error.message(error));
    };

    switch (acquireUserPaymentLockResult(caller)) {
      case (?message) return #err(message);
      case null {};
    };
    try {
      try {
        let ledger = actor (IcpLib.LEDGER_CANISTER_ID) : IcpLib.Ledger;
        let userSubaccount = IcpLib.principalToSubaccount(caller);
        let userAccount = IcpLib.accountIdentifier(canisterId, userSubaccount);
        let userBalance = await* IcpLib.getBalance(ledger, userAccount);
        if (userBalance < quote.totalUserDebitE8s) {
          return #err(
            "Insufficient ICP in your in-app account. Required: " #
            Nat64.toText(quote.totalUserDebitE8s) #
            " e8s including ledger fee. Current balance: " #
            Nat64.toText(userBalance) #
            " e8s"
          );
        };

        let paymentResult = await* IcpLib.transferOut(
          ledger,
          ?userSubaccount,
          IcpLib.cmcTopUpAccount(targetCanister),
          quote.cycleCostE8s,
          IcpLib.CMC_TOP_UP_MEMO,
        );
        let paymentBlock = switch (paymentResult) {
          case (#Err(error)) {
            return #err("Canister cycles payment failed: " # transferErrorText(error));
          };
          case (#Ok(value)) value;
        };

        let cmc = actor (IcpLib.CYCLES_MINTING_CANISTER_ID) : IcpLib.CyclesMintingCanister;
        let topUpResult = await notifyTopUpWithRetries(cmc, paymentBlock, targetCanister);
        let cyclesMinted = switch (topUpResult) {
          case (#Err(error)) {
            return #err(
              "Canister cycles conversion failed for ICP block " #
              Nat64.toText(paymentBlock) #
              ": " #
              notifyErrorText(error)
            );
          };
          case (#Ok(value)) value;
        };
        let cycleBalance = if (Principal.equal(targetCanister, canisterId)) {
          ?Cycles.balance();
        } else {
          switch (await collectionCanisterStatus(targetCanister)) {
            case (?status) ?status.cycles;
            case null null;
          };
        };
        #ok({
          canisterId = targetCanister;
          cyclesRequested = normalizedCycles;
          cyclesMinted;
          cycleCostE8s = quote.cycleCostE8s;
          totalUserDebitE8s = quote.totalUserDebitE8s;
          paymentBlock;
          cycleBalance;
        });
      } catch (error) {
        #err("Canister top-up failed: " # Error.message(error));
      };
    } finally {
      releaseUserPaymentLock(caller);
    };
  };

  public query func getCollectionCreator(
    collectionId : CollectionTypes.CollectionId
  ) : async ?Principal {
    WalletLib.getManagedCollectionOwner(walletState, collectionId);
  };

  public shared ({ caller }) func configureMinting(
    name : Text,
    description : Text,
    symbol : Text,
    imageUrl : Text,
    collectionCreationPayoutAccount : ?MintTypes.AccountIdentifier,
    collectionCreationSecondaryPayoutAccount : ?MintTypes.AccountIdentifier,
    collectionCreationPrimaryPayoutBasisPoints : Nat,
    collectionCreationSecondaryPayoutBasisPoints : Nat,
    collectionCreationPriceE8s : Nat64,
    collectionCreationEnabled : Bool,
    mainMintPayoutAccount : ?MintTypes.AccountIdentifier,
    mainMintPriceE8s : Nat64,
    mainMintEnabled : Bool,
    mainMintDividendsEnabled : Bool,
    collectionCanisterCycles : Nat,
  ) : async CollectionTypes.Collection {
    if (Principal.isAnonymous(caller)) Runtime.trap("Anonymous caller not allowed");
    if (not AuthLib.isAdmin(authState, caller)) Runtime.trap("Unauthorized: admin only");
    validateCollectionProfile(name, description, symbol, imageUrl);
    validateOptionalAccountIdentifier(collectionCreationPayoutAccount, "Collection creation primary payout account");
    validateOptionalAccountIdentifier(collectionCreationSecondaryPayoutAccount, "Collection creation secondary payout account");
    validateOptionalAccountIdentifier(mainMintPayoutAccount, "Main collection mint payout account");
    validateCollectionCreationPayoutShares(
      collectionCreationPrimaryPayoutBasisPoints,
      collectionCreationSecondaryPayoutBasisPoints,
    );
    if (collectionCreationSecondaryPayoutBasisPoints > 0 and collectionCreationSecondaryPayoutAccount == null) {
      Runtime.trap("Collection creation secondary payout account is required when its split is greater than 0%");
    };
    let collection = switch (MintLib.getConfig(mintState).collectionId) {
      case (?collectionId) {
        switch (
          CollectionsLib.updateCollection(
            collectionsState,
            collectionId,
            name,
            description,
            canisterId,
            #ICRC7,
            imageUrl,
            symbol,
            null,
            if (mainMintDividendsEnabled) ?{ enabled = true } else null,
          )
        ) {
          case (?updated) updated;
          case null {
            CollectionsLib.addCollection(
              collectionsState,
              name,
              description,
              canisterId,
              #ICRC7,
              imageUrl,
              symbol,
              #Minted,
              null,
              if (mainMintDividendsEnabled) ?{ enabled = true } else null,
            );
          };
        };
      };
      case null {
        CollectionsLib.addCollection(
          collectionsState,
          name,
          description,
          canisterId,
          #ICRC7,
          imageUrl,
          symbol,
          #Minted,
          null,
          if (mainMintDividendsEnabled) ?{ enabled = true } else null,
        );
      };
    };
    MintLib.configure(
      mintState,
      collectionCreationPayoutSplitState,
      ?collection.id,
      collectionCreationPayoutAccount,
      collectionCreationSecondaryPayoutAccount,
      collectionCreationPrimaryPayoutBasisPoints,
      collectionCreationSecondaryPayoutBasisPoints,
      collectionCreationPriceE8s,
      collectionCreationEnabled,
      mainMintPayoutAccount,
      mainMintPriceE8s,
      mainMintEnabled,
      normalizedCollectionCanisterCycles(collectionCanisterCycles),
    );
    collection;
  };

  public shared ({ caller }) func setCollectionCanisterWasm(
    wasm : Blob
  ) : async () {
    if (Principal.isAnonymous(caller)) Runtime.trap("Anonymous caller not allowed");
    if (not AuthLib.isAdmin(authState, caller)) Runtime.trap("Unauthorized: admin only");
    if (wasm.size() == 0) Runtime.trap("Collection canister WASM is required");
    if (wasm.size() > 1_900_000) {
      Runtime.trap("Collection canister WASM must be under 1.9 MB for a single install call");
    };
    MintLib.setCollectionCanisterWasm(mintState, wasm);
  };

  public shared ({ caller }) func createUserCollection(
    name : Text,
    description : Text,
    symbol : Text,
    imageUrl : Text,
    dividendsEnabled : Bool,
  ) : async { #ok : MintTypes.CollectionCreationReceipt; #err : Text } {
    if (Principal.isAnonymous(caller)) {
      return #err("You must be logged in to create a collection");
    };
    switch (
      enforcePrincipalCooldown(
        collectionCreationCooldowns,
        caller,
        COLLECTION_CREATION_COOLDOWN_NS,
        "Collection setup was just started. Wait a minute before trying again.",
      )
    ) {
      case (?message) return #err(message);
      case null {};
    };
    if (MintLib.activeCollectionCreationRequestsByOwner(collectionCreationState, caller).size() > 0) {
      return #err("You already have a saved collection setup request. Use the pending setup retry card to continue it without paying again.");
    };
    switch (validateCollectionProfileResult(name, description, symbol, imageUrl)) {
      case (?message) return #err(message);
      case null {};
    };
    let config = MintLib.getConfig(mintState);
    if (not config.collectionCreationEnabled) {
      return #err("Collection creation is currently disabled");
    };
    let canisterCycles = normalizedCollectionCanisterCycles(config.collectionCanisterCycles);
    if (not config.collectionCanisterWasmUploaded) {
      return #err("The admin has not uploaded the collection canister WASM yet");
    };
    switch (await maybeModerateCollection(name, description, symbol, imageUrl)) {
      case (?message) return #err(message);
      case null {};
    };
    let quote = try {
      await collectionCreationQuoteFor(
        canisterCycles,
        config.collectionCreationPriceE8s,
        MintLib.collectionCreationPrimaryPayoutBasisPoints(collectionCreationPayoutSplitState),
        MintLib.collectionCreationSecondaryPayoutBasisPoints(collectionCreationPayoutSplitState),
      );
    } catch (error) {
      return #err("Could not fetch the ICP-to-cycles conversion rate: " # Error.message(error));
    };
    if (config.collectionCreationPriceE8s < quote.minimumCreationPriceE8s) {
      return #err(
        "The collection creation fee is below the current cycles cost. Ask the admin to set it to at least " #
        Nat64.toText(quote.minimumCreationPriceE8s) #
        " e8s"
      );
    };
    let payoutAccount = if (quote.adminPrimaryPayoutE8s > 0) {
      switch (config.collectionCreationPayoutAccount) {
        case null return #err("The collection creation primary payout account has not been configured");
        case (?value) {
          if (value.size() != 32) {
            return #err("The collection creation primary payout account must be a 32-byte ICP account identifier");
          };
          ?value;
        };
      };
    } else {
      null;
    };
    let secondaryPayoutAccount = if (quote.adminSecondaryPayoutE8s > 0) {
      switch (MintLib.getPayoutSplitConfig(collectionCreationPayoutSplitState).secondaryPayoutAccount) {
        case null return #err("The collection creation secondary payout account has not been configured");
        case (?value) {
          if (value.size() != 32) {
            return #err("The collection creation secondary payout account must be a 32-byte ICP account identifier");
          };
          ?value;
        };
      };
    } else {
      null;
    };
    let wasm = switch (MintLib.getCollectionCanisterWasm(mintState)) {
      case null return #err("The collection canister WASM is missing");
      case (?value) value;
    };
    ignore wasm;
    let expectedFactoryBalance =
      Cycles.balance() + quote.totalCyclesToConvert;
    let requiredFactoryBalance =
      canisterCycles + canisterCreationFeeCycles() + minimumFactoryOperatingReserveCycles();
    if (expectedFactoryBalance <= requiredFactoryBalance) {
      return #err(
        "The app canister needs more cycles before accepting collection creation payments. Ask the admin to top up the app canister."
      );
    };
    switch (acquireUserPaymentLockResult(caller)) {
      case (?message) return #err(message);
      case null {};
    };
    try {
      let ledger = actor (IcpLib.LEDGER_CANISTER_ID) : IcpLib.Ledger;
      let userSubaccount = IcpLib.principalToSubaccount(caller);
      let userAccount = IcpLib.accountIdentifier(canisterId, userSubaccount);
      let userBalance = await* IcpLib.getBalance(ledger, userAccount);
      if (userBalance < quote.totalUserDebitE8s) {
        return #err(
          "Insufficient ICP in your in-app account. Required: " #
          Nat64.toText(quote.totalUserDebitE8s) #
          " e8s including ledger fees. Current balance: " #
          Nat64.toText(userBalance) #
          " e8s"
        );
      };
      if (not MintLib.acquireCollectionCreate(mintState, caller)) {
        return #err("A collection is already being created for your account");
      };

      try {
        let request = MintLib.beginCollectionCreationRequest(
          collectionCreationState,
          collectionCreationPayoutSplitState,
          caller,
          name,
          description,
          symbol,
          imageUrl,
          dividendsEnabled,
          quote,
          payoutAccount,
          secondaryPayoutAccount,
        );
        await resumeCollectionCreationInternal(caller, request.id);
      } finally {
        MintLib.releaseCollectionCreate(mintState, caller);
      };
    } finally {
      releaseUserPaymentLock(caller);
    };
  };

  func resumeCollectionCreationInternal(
    caller : Principal,
    requestId : Nat,
  ) : async { #ok : MintTypes.CollectionCreationReceipt; #err : Text } {
    var request = switch (MintLib.getCollectionCreationRequest(collectionCreationState, requestId)) {
      case null return #err("Collection creation request not found");
      case (?value) value;
    };
    if (not Principal.equal(request.owner, caller) and not AuthLib.isAdmin(authState, caller)) {
      return #err("Only the collection creator or admin can retry this collection setup");
    };
    ignore MintLib.markCollectionCreationAttempt(collectionCreationState, requestId);

    try {
      request := switch (MintLib.getCollectionCreationRequest(collectionCreationState, requestId)) {
        case null return #err("Collection creation request not found");
        case (?value) value;
      };

      if (request.cyclePaymentBlock == null) {
        let ledger = actor (IcpLib.LEDGER_CANISTER_ID) : IcpLib.Ledger;
        let userSubaccount = IcpLib.principalToSubaccount(request.owner);
        let userAccount = IcpLib.accountIdentifier(canisterId, userSubaccount);
        let userBalance = await* IcpLib.getBalance(ledger, userAccount);
        if (userBalance < request.totalUserDebitE8s) {
          let message =
            "Insufficient ICP in your in-app account. Required: " #
            Nat64.toText(request.totalUserDebitE8s) #
            " e8s including ledger fees. Current balance: " #
            Nat64.toText(userBalance) #
            " e8s";
          ignore MintLib.markCollectionCreationError(collectionCreationState, requestId, message);
          return #err(message);
        };
        let cyclePaymentResult = await* IcpLib.transferOutAt(
          ledger,
          ?userSubaccount,
          IcpLib.cmcCreateCanisterAccount(canisterId),
          request.cycleCostE8s,
          IcpLib.CMC_CREATE_CANISTER_MEMO,
          request.createdAt,
        );
        let cyclePaymentBlock = switch (transferResultBlock(cyclePaymentResult)) {
          case (#ok(value)) value;
          case (#err(message)) {
            let fullMessage = "Cycles payment failed: " # message;
            ignore MintLib.markCollectionCreationError(collectionCreationState, requestId, fullMessage);
            return #err(fullMessage);
          };
        };
        ignore MintLib.markCollectionCreationCyclePayment(collectionCreationState, requestId, cyclePaymentBlock);
      };

      request := switch (MintLib.getCollectionCreationRequest(collectionCreationState, requestId)) {
        case null return #err("Collection creation request not found");
        case (?value) value;
      };
      if (request.childCanisterId == null) {
        let cyclePaymentBlock = switch (request.cyclePaymentBlock) {
          case null return #err("Collection creation request is missing its cycles payment block");
          case (?value) value;
        };
        let cmc = actor (IcpLib.CYCLES_MINTING_CANISTER_ID) : IcpLib.CyclesMintingCanister;
        if (not collectionCreationCyclesConverted(request)) {
          Debug.print(
            "MINTLAB CMC notify_create_canister " #
            "requestId=" # Nat.toText(requestId) #
            " block=" # Nat64.toText(cyclePaymentBlock) #
            " controller=" # canisterId.toText() #
            " owner=" # request.owner.toText()
          );
          let createFromPaymentResult = await notifyCreateCanisterWithRetries(
            cmc,
            cyclePaymentBlock,
            request.owner,
          );
          switch (createFromPaymentResult) {
            case (#Ok(childCanisterId)) {
              ignore MintLib.markCollectionCreationCyclesConverted(collectionCreationState, requestId);
              await recordCollectionCreationChildCanister(requestId, childCanisterId, "cmc notify_create_canister");
            };
            case (#Err(error)) {
              if (notifyCreateErrorAllowsLegacyTopUpFallback(error)) {
                Debug.print(
                  "MINTLAB CMC notify_create_canister did not match this payment; trying legacy notify_top_up recovery " #
                  "requestId=" # Nat.toText(requestId) #
                  " block=" # Nat64.toText(cyclePaymentBlock)
                );
                let topUpResult = await notifyTopUpWithRetries(cmc, cyclePaymentBlock, canisterId);
                switch (topUpResult) {
                  case (#Ok(_cyclesMinted)) {
                    ignore MintLib.markCollectionCreationCyclesConverted(collectionCreationState, requestId);
                  };
                  case (#Err(topUpError)) {
                    if (
                      notifyErrorLooksAlreadyProcessed(topUpError) and
                      Cycles.balance() > collectionCreationCreateCallCycles(request)
                    ) {
                      ignore MintLib.markCollectionCreationCyclesConverted(collectionCreationState, requestId);
                    } else {
                      let message =
                        "Cycles conversion failed for ICP block " #
                        Nat64.toText(cyclePaymentBlock) #
                        ": " #
                        notifyErrorText(topUpError);
                      ignore MintLib.markCollectionCreationError(collectionCreationState, requestId, message);
                      return #err(message);
                    };
                  };
                };
              } else {
                let message =
                  "Collection canister creation payment failed for ICP block " #
                  Nat64.toText(cyclePaymentBlock) #
                  ": " #
                  notifyErrorText(error);
                ignore MintLib.markCollectionCreationError(collectionCreationState, requestId, message);
                return #err(message);
              };
            };
          };
        };

        request := switch (MintLib.getCollectionCreationRequest(collectionCreationState, requestId)) {
          case null return #err("Collection creation request not found");
          case (?value) value;
        };
      };
      if (request.childCanisterId == null) {
        let createCallCycles = collectionCreationCreateCallCycles(request);
        let childTargetCycles = collectionCreationChildTargetCycles(request);
        let availableCycles = Cycles.balance();
        let requiredCycles = createCallCycles + minimumFactoryOperatingReserveCycles();
        if (availableCycles <= requiredCycles) {
          let message =
            "Cycles are ready for this paid setup request, but the app canister needs at least " #
            Nat.toText(createCallCycles) #
            " cycles to create the collection canister plus " #
            Nat.toText(minimumFactoryOperatingReserveCycles()) #
            " cycles of operating reserve. Top up the app canister, then press Retry. No additional ICP collection payment is needed.";
          ignore MintLib.markCollectionCreationError(collectionCreationState, requestId, message);
          return #err(message);
        };
        Debug.print(
          "MINTLAB CMC CREATE COLLECTION CANISTER FROM BACKEND CYCLES " #
          "requestId=" # Nat.toText(requestId) #
          " attachCycles=" # Nat.toText(createCallCycles) #
          " targetChildCycles=" # Nat.toText(childTargetCycles) #
          " canisterCreationFeeCycles=" # Nat.toText(canisterCreationFeeCycles()) #
          " backendBalanceBefore=" # Nat.toText(availableCycles)
        );
        let childCanisterId = await createEmptyCollectionCanister(
          request.owner,
          createCallCycles,
        );
        await recordCollectionCreationChildCanister(requestId, childCanisterId, "cmc create_canister");
      } else if (not collectionCreationCyclesConverted(request)) {
        ignore MintLib.markCollectionCreationCyclesConverted(collectionCreationState, requestId);
      };

      request := switch (MintLib.getCollectionCreationRequest(collectionCreationState, requestId)) {
        case null return #err("Collection creation request not found");
        case (?value) value;
      };
      let childCanisterId = switch (request.childCanisterId) {
        case null return #err("Collection creation request is missing its child canister ID");
        case (?value) value;
      };
      if (request.collectionId == null) {
        let collection = switch (CollectionsLib.findCollectionByCanister(collectionsState, childCanisterId)) {
          case (?existing) existing;
          case null {
            CollectionsLib.addCollection(
              collectionsState,
              request.name,
              request.description,
              childCanisterId,
              #ICRC7,
              request.imageUrl,
              request.symbol,
              #Minted,
              null,
              if (request.dividendsEnabled) ?{ enabled = true } else null,
            );
          };
        };
        WalletLib.setManagedCollectionOwner(walletState, collection.id, request.owner);
        ignore MintLib.markCollectionCreationRegistered(collectionCreationState, requestId, collection.id);
      };

      request := switch (MintLib.getCollectionCreationRequest(collectionCreationState, requestId)) {
        case null return #err("Collection creation request not found");
        case (?value) value;
      };
      let collection = switch (collectionForCreationRequest(request)) {
        case (#ok(value)) value;
        case (#err(message)) {
          ignore MintLib.markCollectionCreationError(collectionCreationState, requestId, message);
          return #err(message);
        };
      };
      let wasm = switch (MintLib.getCollectionCanisterWasm(mintState)) {
        case null {
          let message = "The collection canister WASM is missing";
          ignore MintLib.markCollectionCreationError(collectionCreationState, requestId, message);
          return #err(message);
        };
        case (?value) value;
      };

      switch (await collectionCanisterStatus(collection.canisterId)) {
        case (?status) {
          switch (status.module_hash) {
            case (?_) {
              ignore MintLib.markCollectionCreationInstalled(collectionCreationState, requestId);
              await settleCollectionCreationAdminPayout(requestId);
              return #ok({
                collection;
                paymentBlock = collectionCreationPaymentBlock(request);
              });
            };
            case null {};
          };
        };
        case null {};
      };

      try {
        await installCollectionCode(
          collection.canisterId,
          wasm,
          collectionCreationInitArgs(request, collection.canisterId),
        );
      } catch (_installError) {
        try {
          await ensureCollectionCanisterInstallCycles(collection.canisterId);
          await installCollectionCode(
            collection.canisterId,
            wasm,
            collectionCreationInitArgs(request, collection.canisterId),
          );
        } catch (retryError) {
          let message =
            "Collection record exists but canister install failed. Retry setup from the pending collection card. " #
            Error.message(retryError);
          ignore MintLib.markCollectionCreationError(collectionCreationState, requestId, message);
          return #err(message);
        };
      };
      ignore MintLib.markCollectionCreationInstalled(collectionCreationState, requestId);
      await settleCollectionCreationAdminPayout(requestId);
      #ok({
        collection;
        paymentBlock = collectionCreationPaymentBlock(request);
      });
    } catch (error) {
      let message = "Collection canister setup failed: " # Error.message(error);
      ignore MintLib.markCollectionCreationError(collectionCreationState, requestId, message);
      #err(message);
    };
  };

  func repairCollectionCreationRequestInternal(
    requestId : Nat
  ) : async { #ok : MintTypes.CollectionCreationRequestView; #err : Text } {
    let request = switch (MintLib.getCollectionCreationRequest(collectionCreationState, requestId)) {
      case null return #err("Collection creation request not found");
      case (?value) value;
    };
    if (request.childCanisterId != null or request.collectionId != null) {
      return #ok(MintLib.collectionCreationRequestView(request));
    };

    let config = MintLib.getConfig(mintState);
    let canisterCycles = normalizedCollectionCanisterCycles(config.collectionCanisterCycles);
    let quote = try {
      await collectionCreationQuoteFor(
        canisterCycles,
        config.collectionCreationPriceE8s,
        MintLib.collectionCreationPrimaryPayoutBasisPoints(collectionCreationPayoutSplitState),
        MintLib.collectionCreationSecondaryPayoutBasisPoints(collectionCreationPayoutSplitState),
      );
    } catch (error) {
      return #err("Could not fetch the ICP-to-cycles conversion rate: " # Error.message(error));
    };
    if (request.cyclePaymentBlock == null and config.collectionCreationPriceE8s < quote.minimumCreationPriceE8s) {
      return #err(
        "The collection creation fee is below the current cycles cost. Ask the admin to set it to at least " #
        Nat64.toText(quote.minimumCreationPriceE8s) #
        " e8s"
      );
    };

    switch (MintLib.repairCollectionCreationRequestCycles(collectionCreationState, collectionCreationPayoutSplitState, requestId, quote)) {
      case null #err("Collection creation request not found");
      case (?updated) #ok(MintLib.collectionCreationRequestView(updated));
    };
  };

  public shared ({ caller }) func retryInstallCollectionCanister(
    collectionId : CollectionTypes.CollectionId
  ) : async { #ok : CollectionTypes.Collection; #err : Text } {
    if (Principal.isAnonymous(caller)) {
      return #err("You must be logged in to retry collection setup");
    };
    let collection = switch (CollectionsLib.getCollection(collectionsState, collectionId)) {
      case null return #err("Collection not found");
      case (?value) value;
    };
    if (collection.kind != #Minted) {
      return #err("Only Mintlab collections use this installer");
    };
    let owner = switch (WalletLib.getManagedCollectionOwner(walletState, collectionId)) {
      case null {
        if (AuthLib.isAdmin(authState, caller)) {
          caller;
        } else {
          return #err("This Mintlab collection is not assigned to a creator account");
        };
      };
      case (?owner) {
        if (not Principal.equal(owner, caller) and not AuthLib.isAdmin(authState, caller)) {
          return #err("Only the collection creator or admin can retry installation");
        };
        owner;
      };
    };
    let wasm = switch (MintLib.getCollectionCanisterWasm(mintState)) {
      case null return #err("The collection canister WASM is missing");
      case (?value) value;
    };
    try {
      switch (await collectionCanisterStatus(collection.canisterId)) {
        case (?status) {
          switch (status.module_hash) {
            case (?_) {
              ignore MintLib.markCollectionCreationInstalledForCollection(collectionCreationState, collection.id);
              return #ok(collection);
            };
            case null {};
          };
        };
        case null {};
      };
      await ensureCollectionCanisterInstallCycles(collection.canisterId);
      await installCollectionCode(
        collection.canisterId,
        wasm,
        {
          owner;
          parent = canisterId;
          name = collection.name;
          description = collection.description;
          symbol = collection.symbol;
          logo = collection.imageUrl;
        },
      );
      ignore MintLib.markCollectionCreationInstalledForCollection(collectionCreationState, collection.id);
      #ok(collection);
    } catch (error) {
      #err("Collection canister install failed: " # Error.message(error));
    };
  };

  public shared ({ caller }) func upgradeCollectionCanister(
    collectionId : CollectionTypes.CollectionId
  ) : async { #ok : CollectionTypes.Collection; #err : Text } {
    if (Principal.isAnonymous(caller)) {
      return #err("You must be logged in to update collection setup");
    };
    let collection = switch (CollectionsLib.getCollection(collectionsState, collectionId)) {
      case null return #err("Collection not found");
      case (?value) value;
    };
    if (collection.kind != #Minted) {
      return #err("Only Mintlab collections use this installer");
    };
    if (Principal.equal(collection.canisterId, canisterId)) {
      if (AuthLib.isAdmin(authState, caller)) {
        return #ok(collection);
      };
      return #err("The main app collection is updated when the app canister is deployed");
    };
    let owner = switch (WalletLib.getManagedCollectionOwner(walletState, collectionId)) {
      case null {
        if (AuthLib.isAdmin(authState, caller)) {
          caller;
        } else {
          return #err("This Mintlab collection is not assigned to a creator account");
        };
      };
      case (?value) value;
    };
    if (not Principal.equal(owner, caller) and not AuthLib.isAdmin(authState, caller)) {
      return #err("Only the collection creator or admin can update this collection canister");
    };
    let wasm = switch (MintLib.getCollectionCanisterWasm(mintState)) {
      case null return #err("The collection canister WASM is missing");
      case (?value) value;
    };
    try {
      switch (await collectionCanisterStatus(collection.canisterId)) {
        case (?status) {
          switch (status.module_hash) {
            case null {
              await ensureCollectionCanisterInstallCycles(collection.canisterId);
              await installCollectionCode(
                collection.canisterId,
                wasm,
                {
                  owner;
                  parent = canisterId;
                  name = collection.name;
                  description = collection.description;
                  symbol = collection.symbol;
                  logo = collection.imageUrl;
                },
              );
              return #ok(collection);
            };
            case (?_) {};
          };
        };
        case null return #err("Could not read the collection canister status");
      };
      await ensureCollectionCanisterInstallCycles(collection.canisterId);
      await installCollectionCodeWithMode(
        collection.canisterId,
        wasm,
        {
          owner;
          parent = canisterId;
          name = collection.name;
          description = collection.description;
          symbol = collection.symbol;
          logo = collection.imageUrl;
        },
        enhancedOrthogonalPersistenceUpgradeMode(),
      );
      #ok(collection);
    } catch (error) {
      #err("Collection canister update failed: " # Error.message(error));
    };
  };

  public shared ({ caller }) func topUpCollectionCanisterCycles(
    collectionId : CollectionTypes.CollectionId,
    cyclesToTopUp : Nat,
  ) : async { #ok : MintTypes.CollectionCycleTopUpReceipt; #err : Text } {
    if (Principal.isAnonymous(caller)) {
      return #err("You must be logged in to top up a collection canister");
    };
    let collection = switch (CollectionsLib.getCollection(collectionsState, collectionId)) {
      case null return #err("Collection not found");
      case (?value) value;
    };
    if (collection.kind != #Minted) {
      return #err("Only Mintlab collection canisters can be topped up through this flow");
    };
    switch (WalletLib.getManagedCollectionOwner(walletState, collectionId)) {
      case null return #err("This Mintlab collection is not assigned to a creator account");
      case (?owner) {
        if (not Principal.equal(owner, caller) and not AuthLib.isAdmin(authState, caller)) {
          return #err("Only the collection creator or admin can top up this collection canister");
        };
      };
    };
    if (Principal.equal(collection.canisterId, canisterId)) {
      return #err("The main app canister cannot be topped up with this collection flow");
    };
    let normalizedCycles = normalizedCollectionTopUpCycles(cyclesToTopUp);
    let quote = try {
      await collectionCycleTopUpQuoteFor(normalizedCycles);
    } catch (error) {
      return #err("Could not fetch the ICP-to-cycles conversion rate: " # Error.message(error));
    };

    switch (acquireUserPaymentLockResult(caller)) {
      case (?message) return #err(message);
      case null {};
    };
    try {
      try {
        let ledger = actor (IcpLib.LEDGER_CANISTER_ID) : IcpLib.Ledger;
        let userSubaccount = IcpLib.principalToSubaccount(caller);
        let userAccount = IcpLib.accountIdentifier(canisterId, userSubaccount);
        let userBalance = await* IcpLib.getBalance(ledger, userAccount);
        if (userBalance < quote.totalUserDebitE8s) {
          return #err(
            "Insufficient ICP in your in-app account. Required: " #
            Nat64.toText(quote.totalUserDebitE8s) #
            " e8s including ledger fee. Current balance: " #
            Nat64.toText(userBalance) #
            " e8s"
          );
        };

        let paymentResult = await* IcpLib.transferOut(
          ledger,
          ?userSubaccount,
          IcpLib.cmcTopUpAccount(collection.canisterId),
          quote.cycleCostE8s,
          IcpLib.CMC_TOP_UP_MEMO,
        );
        let paymentBlock = switch (paymentResult) {
          case (#Err(error)) {
            return #err("Cycles top-up payment failed: " # transferErrorText(error));
          };
          case (#Ok(value)) value;
        };

        let cmc = actor (IcpLib.CYCLES_MINTING_CANISTER_ID) : IcpLib.CyclesMintingCanister;
        let topUpResult = await notifyTopUpWithRetries(cmc, paymentBlock, collection.canisterId);
        let cyclesMinted = switch (topUpResult) {
          case (#Err(error)) {
            return #err(
              "Cycles conversion failed for ICP block " #
              Nat64.toText(paymentBlock) #
              ": " #
              notifyErrorText(error)
            );
          };
          case (#Ok(value)) value;
        };
        let cycleBalance = switch (await collectionCanisterStatus(collection.canisterId)) {
          case (?status) ?status.cycles;
          case null null;
        };
        #ok({
          collectionId;
          canisterId = collection.canisterId;
          cyclesRequested = normalizedCycles;
          cyclesMinted;
          cycleCostE8s = quote.cycleCostE8s;
          totalUserDebitE8s = quote.totalUserDebitE8s;
          paymentBlock;
          cycleBalance;
        });
      } catch (error) {
        #err("Collection canister top-up failed: " # Error.message(error));
      };
    } finally {
      releaseUserPaymentLock(caller);
    };
  };

  public shared ({ caller }) func mintUserNFT(
    metadata : WalletTypes.NFTMetadata,
  ) : async { #ok : MintTypes.MintReceipt; #err : Text } {
    if (Principal.isAnonymous(caller)) {
      return #err("You must be logged in to mint");
    };
    switch (
      enforcePrincipalCooldown(
        mintCooldowns,
        caller,
        MINT_COOLDOWN_NS,
        "Minting was just started. Wait a few seconds before trying again.",
      )
    ) {
      case (?message) return #err(message);
      case null {};
    };
    let config = MintLib.getConfig(mintState);
    if (not config.mainMintEnabled) {
      return #err("Main collection minting is currently disabled");
    };
    let collectionId = switch (config.collectionId) {
      case null return #err("The main Mintlab collection has not been configured yet");
      case (?value) value;
    };
    let collection = switch (CollectionsLib.getCollection(collectionsState, collectionId)) {
      case null return #err("Minting collection is missing");
      case (?value) value;
    };
    let payoutAccount = if (config.mainMintPriceE8s > 0) {
      switch (config.mainMintPayoutAccount) {
        case null return #err("Main collection mint payout account has not been configured");
        case (?value) value;
      };
    } else {
      Blob.fromArray([]);
    };
    switch (validateMintMetadata(metadata)) {
      case (?message) return #err(message);
      case null {};
    };
    switch (await maybeModerateNFT(metadata)) {
      case (?message) return #err(message);
      case null {};
    };

    if (
      config.mainMintPriceE8s > 0 and
      MintLib.pendingMintPaymentsByCaller(pendingMintPaymentState, caller).size() > 0
    ) {
      return #err(
        "You already have a paid mint payment being finalized. Use the pending mint retry card before starting another paid mint."
      );
    };

    if (config.mainMintPriceE8s > 0) {
      let payment = MintLib.beginPendingMintPayment(
        pendingMintPaymentState,
        caller,
        collectionId,
        metadata,
        config.mainMintPriceE8s,
        payoutAccount,
      );
      switch (acquireUserPaymentLockResult(caller)) {
        case (?message) {
          ignore MintLib.markPendingMintPaymentError(pendingMintPaymentState, payment.id, message);
          return #err(message);
        };
        case null {};
      };
      try {
        let ledger = actor (IcpLib.LEDGER_CANISTER_ID) : IcpLib.Ledger;
        let userSubaccount = IcpLib.principalToSubaccount(caller);
        let paymentResult = await* IcpLib.transferOutAt(
          ledger,
          ?userSubaccount,
          payoutAccount,
          config.mainMintPriceE8s,
          payment.memo,
          payment.paymentCreatedAt,
        );
        let paymentBlock = switch (paymentResult) {
          case (#Err(#InsufficientFunds({ balance }))) {
            let message = "Insufficient ICP in your in-app account. Current balance: " # Nat64.toText(balance.e8s) # " e8s";
            ignore MintLib.markPendingMintPaymentError(pendingMintPaymentState, payment.id, message);
            return #err(message);
          };
          case (#Err(#BadFee({ expected_fee }))) {
            let message = "Ledger rejected the fee. Expected fee: " # Nat64.toText(expected_fee.e8s) # " e8s";
            ignore MintLib.markPendingMintPaymentError(pendingMintPaymentState, payment.id, message);
            return #err(message);
          };
          case (#Err(#TxDuplicate({ duplicate_of }))) {
            duplicate_of;
          };
          case (#Err(_)) {
            ignore MintLib.markPendingMintPaymentError(pendingMintPaymentState, payment.id, "ICP payment failed");
            return #err("ICP payment failed");
          };
          case (#Ok(value)) value;
        };
        var persistPaymentBlock : ?Nat64 = ?paymentBlock;
        try {
          ignore MintLib.markPendingMintPaymentSent(pendingMintPaymentState, payment.id, paymentBlock);
          let finalized = mintMainCollectionNFTFromMetadata(caller, collection, metadata, paymentBlock);
          ignore MintLib.markPendingMintPaymentMinted(pendingMintPaymentState, payment.id, finalized.tokenId);
          #ok(finalized.receipt);
        } catch (error) {
          let message =
            "Your ICP payment was recorded at block " #
            Nat64.toText(paymentBlock) #
            ", but mint finalization failed. Retry this pending mint. Details: " #
            Error.message(error);
          ignore MintLib.markPendingMintPaymentError(pendingMintPaymentState, payment.id, message);
          #err(message);
        } finally {
          switch (persistPaymentBlock) {
            case (?block) {
              switch (MintLib.getPendingMintPayment(pendingMintPaymentState, payment.id)) {
                case (?latest) {
                  if (latest.paymentBlock == null) {
                    ignore MintLib.markPendingMintPaymentSent(pendingMintPaymentState, payment.id, block);
                  };
                };
                case null {};
              };
            };
            case null {};
          };
        };
      } finally {
        releaseUserPaymentLock(caller);
      };
    } else {
      #ok(mintMainCollectionNFTFromMetadata(caller, collection, metadata, 0).receipt);
    };
  };

  public shared query ({ caller }) func getMyPendingMintPayments() : async [MintTypes.PendingMintPaymentView] {
    if (Principal.isAnonymous(caller)) {
      return [];
    };
    MintLib.pendingMintPaymentsByCaller(pendingMintPaymentState, caller);
  };

  public shared ({ caller }) func retryPendingMintPayment(
    paymentId : Nat
  ) : async { #ok : MintTypes.MintReceipt; #err : Text } {
    if (Principal.isAnonymous(caller)) {
      return #err("You must be logged in to retry a pending mint");
    };
    let payment = switch (MintLib.getPendingMintPayment(pendingMintPaymentState, paymentId)) {
      case null return #err("Pending mint payment not found");
      case (?value) value;
    };
    if (not Principal.equal(payment.caller, caller) and not AuthLib.isAdmin(authState, caller)) {
      return #err("Only the payer or admin can retry this mint");
    };
    switch (payment.paymentBlock) {
      case null return #err("This mint payment has not been recorded on the ICP ledger yet");
      case (?paymentBlock) {
        switch (payment.mintedTokenId) {
          case (?tokenId) {
            switch (WalletLib.findByCollectionToken(walletState, payment.collectionId, Nat.toText(tokenId))) {
              case (?nft) return #ok({ nft; paymentBlock });
              case null {
                switch (MintLib.getToken(mintState, tokenId)) {
                  case (?token) {
                    if (Principal.equal(token.owner, payment.caller)) {
                      let nft = WalletLib.registerNFT(
                        walletState,
                        payment.caller,
                        payment.collectionId,
                        Nat.toText(token.tokenId),
                        MintLib.publicMetadata(token.metadata),
                        #Minted,
                      );
                      return #ok({ nft; paymentBlock });
                    };
                  };
                  case null {};
                };
              };
            };
          };
          case null {};
        };
        let collection = switch (CollectionsLib.getCollection(collectionsState, payment.collectionId)) {
          case null {
            let message = "Minting collection is missing";
            ignore MintLib.markPendingMintPaymentError(pendingMintPaymentState, payment.id, message);
            return #err(message);
          };
          case (?value) value;
        };
        try {
          let finalized = mintMainCollectionNFTFromMetadata(
            payment.caller,
            collection,
            payment.metadata,
            paymentBlock,
          );
          ignore MintLib.markPendingMintPaymentMinted(pendingMintPaymentState, payment.id, finalized.tokenId);
          #ok(finalized.receipt);
        } catch (error) {
          let message = "Pending mint retry failed: " # Error.message(error);
          ignore MintLib.markPendingMintPaymentError(pendingMintPaymentState, payment.id, message);
          #err(message);
        };
      };
    };
  };

  func mintMainCollectionNFTFromMetadata(
    caller : Principal,
    collection : CollectionTypes.Collection,
    metadata : WalletTypes.NFTMetadata,
    paymentBlock : Nat64,
  ) : MintFinalizeResult {
    let token = MintLib.mintToken(
      mintState,
      caller,
      MintLib.attachManagedCollectionMetadata(
        metadata,
        collection.id,
        collection.name,
        collection.symbol,
      ),
    );
    let nft = WalletLib.registerNFT(
      walletState,
      caller,
      collection.id,
      Nat.toText(token.tokenId),
      MintLib.publicMetadata(token.metadata),
      #Minted,
    );
    {
      receipt = {
        nft;
        paymentBlock;
      };
      tokenId = token.tokenId;
    };
  };

  public shared ({ caller }) func mintCollectionNFT(
    collectionId : CollectionTypes.CollectionId,
    metadata : WalletTypes.NFTMetadata,
  ) : async { #ok : WalletTypes.WalletNFT; #err : Text } {
    if (Principal.isAnonymous(caller)) {
      return #err("You must be logged in to mint");
    };
    switch (
      enforcePrincipalCooldown(
        mintCooldowns,
        caller,
        MINT_COOLDOWN_NS,
        "Minting was just started. Wait a few seconds before trying again.",
      )
    ) {
      case (?message) return #err(message);
      case null {};
    };
    let collection = switch (CollectionsLib.getCollection(collectionsState, collectionId)) {
      case null return #err("Collection not found");
      case (?value) value;
    };
    if (collection.kind != #Minted) {
      return #err("Only Mintlab collections can mint through this flow");
    };
    switch (WalletLib.getManagedCollectionOwner(walletState, collectionId)) {
      case null return #err("This Mintlab collection is not assigned to a creator account");
      case (?owner) {
        if (not Principal.equal(owner, caller)) {
          return #err("You can only mint into collections that you created");
        };
      };
    };
    switch (validateMintMetadata(metadata)) {
      case (?message) return #err(message);
      case null {};
    };
    switch (await maybeModerateNFT(metadata)) {
      case (?message) return #err(message);
      case null {};
    };

    if (Principal.equal(collection.canisterId, canisterId)) {
      let token = MintLib.mintToken(
        mintState,
        caller,
        MintLib.attachManagedCollectionMetadata(
          metadata,
          collection.id,
          collection.name,
          collection.symbol,
        ),
      );
      let nft = WalletLib.registerNFT(
        walletState,
        caller,
        collection.id,
        Nat.toText(token.tokenId),
        MintLib.publicMetadata(token.metadata),
        #Minted,
      );
      return #ok(nft);
    };

    let child : ChildCollectionActor = actor (collection.canisterId.toText());
    let mintResult = try {
      await child.mintlab_mint(caller, metadata);
    } catch (error) {
      return #err("Collection canister mint failed: " # Error.message(error));
    };
    switch (mintResult) {
      case (#err(message)) #err(message);
      case (#ok(receipt)) {
        let nft = WalletLib.registerNFT(
          walletState,
          caller,
          collection.id,
          Nat.toText(receipt.tokenId),
          metadata,
          #Minted,
        );
        #ok(nft);
      };
    };
  };

  public shared ({ caller }) func transferFromDip721(
    from : Principal,
    to : Principal,
    tokenId : Nat,
  ) : async NFTStandards.DIP721NatResult {
    if (not Principal.equal(caller, from) and not Principal.equal(caller, canisterId)) {
      return #Err(#Unauthorized);
    };
    switch (MintLib.transferToken(mintState, tokenId, from, to)) {
      case (#err("Minted token not found")) #Err(#InvalidTokenId);
      case (#err(_)) #Err(#Unauthorized);
      case (#ok(transfer)) {
        syncTransferredManagedNFT(from, to, transfer.token);
        #Ok(tokenId);
      };
    };
  };

  public shared ({ caller }) func transfer(
    to : Principal,
    tokenId : Nat,
  ) : async NFTStandards.DIP721NatResult {
    if (Principal.isAnonymous(caller)) {
      return #Err(#Unauthorized);
    };
    await transferFromDip721(caller, to, tokenId);
  };

  public query func dip721_owner_token_identifiers(
    owner : Principal,
  ) : async NFTStandards.DIP721TokensResult {
    #Ok(MintLib.ownerTokenIdsNat(mintState, owner));
  };

  public query func dip721_token_metadata(
    token_id : Nat,
  ) : async NFTStandards.DIP721MetadataResult {
    MintLib.tokenMetadataResult(mintState, token_id);
  };

  public query func balance(request : EXTBalanceRequest) : async EXTBalanceResponse {
    extBalance(request);
  };

  public query func ext_balance(request : EXTBalanceRequest) : async EXTBalanceResponse {
    extBalance(request);
  };

  public query func tokens_ext(account : EXTAccountIdentifier) : async EXTTokensExtResult {
    #ok(ownerMainTokenIndexesForAccount(account));
  };

  public query func ext_metadata(tokenIdentifier : EXTTokenIdentifier) : async EXTMetadataResult {
    switch (extTokenIdFromIdentifier(tokenIdentifier)) {
      case null #err(#InvalidToken(tokenIdentifier));
      case (?tokenId) {
        switch (extMetadataForMainTokenId(tokenId)) {
          case (?value) #ok(value);
          case null #err(#InvalidToken(tokenIdentifier));
        };
      };
    };
  };

  public query func ext_bearer(tokenIdentifier : EXTTokenIdentifier) : async {
    #ok : EXTAccountIdentifier;
    #err : EXTCommonError;
  } {
    switch (extTokenIdFromIdentifier(tokenIdentifier)) {
      case null #err(#InvalidToken(tokenIdentifier));
      case (?tokenId) {
        switch (mainTokenById(tokenId)) {
          case null #err(#InvalidToken(tokenIdentifier));
          case (?token) #ok(accountIdHex(token.owner));
        };
      };
    };
  };

  public query func supply(tokenIdentifier : EXTTokenIdentifier) : async {
    #ok : EXTBalance;
    #err : EXTCommonError;
  } {
    switch (extTokenIdFromIdentifier(tokenIdentifier)) {
      case null #err(#InvalidToken(tokenIdentifier));
      case (?tokenId) {
        switch (mainTokenById(tokenId)) {
          case null #ok(0);
          case (?_) #ok(1);
        };
      };
    };
  };

  public query func extdata_supply(tokenIdentifier : EXTTokenIdentifier) : async {
    #ok : EXTBalance;
    #err : EXTCommonError;
  } {
    switch (extTokenIdFromIdentifier(tokenIdentifier)) {
      case null #err(#InvalidToken(tokenIdentifier));
      case (?tokenId) {
        switch (mainTokenById(tokenId)) {
          case null #ok(0);
          case (?_) #ok(1);
        };
      };
    };
  };

  public query func getRegistry() : async [(EXTTokenIndex, EXTAccountIdentifier)] {
    var registry : [(EXTTokenIndex, EXTAccountIdentifier)] = [];
    for (token in currentCollectionTokens().values()) {
      switch (extTokenIndexFromTokenId(token.tokenId)) {
        case null {};
        case (?index) {
          registry := Array.concat<(EXTTokenIndex, EXTAccountIdentifier)>(
            registry,
            [(index, accountIdHex(token.owner))],
          );
        };
      };
    };
    registry;
  };

  public query func getTokens() : async [(EXTTokenIndex, EXTMetadataLegacy)] {
    var result : [(EXTTokenIndex, EXTMetadataLegacy)] = [];
    for (token in currentCollectionTokens().values()) {
      switch (extTokenIndexFromTokenId(token.tokenId)) {
        case null {};
        case (?index) {
          result := Array.concat<(EXTTokenIndex, EXTMetadataLegacy)>(
            result,
            [(index, #nonfungible({ metadata = ?Blob.fromArray([]) }))],
          );
        };
      };
    };
    result;
  };

  public query func extensions() : async [Text] {
    ["@ext/common", "@ext/nonfungible"];
  };

  public query func ext_extensions() : async [Text] {
    ["@ext/common", "@ext/nonfungible"];
  };

  public query func http_request(request : AssetHttpRequest) : async AssetHttpResponse {
    httpAssetResponse(request);
  };

  public func http_request_update(request : AssetHttpRequest) : async AssetHttpResponse {
    httpAssetResponse(request);
  };

  public shared ({ caller }) func ext_transfer(request : EXTTransferRequest) : async EXTTransferResponse {
    extTransfer(caller, request);
  };

  public query func icrc7_collection_metadata() : async [(Text, NFTStandards.ICRC7Value)] {
    let collection = currentMintCollection();
    [
      (
        "icrc7:symbol",
        #Text(
          switch (collection) {
            case (?value) value.symbol;
            case null "MINT";
          }
        ),
      ),
      (
        "icrc7:name",
        #Text(
          switch (collection) {
            case (?value) value.name;
            case null "Mintlab Collection";
          }
        ),
      ),
      (
        "icrc7:description",
        #Text(
          switch (collection) {
            case (?value) value.description;
            case null "";
          }
        ),
      ),
      (
        "icrc7:logo",
        #Text(
          switch (collection) {
            case (?value) value.imageUrl;
            case null "";
          }
        ),
      ),
      (
        "icrc7:total_supply",
        #Nat(currentCollectionSupply()),
      ),
      ("icrc7:max_query_batch_size", #Nat(maxQueryBatchSize())),
      ("icrc7:max_update_batch_size", #Nat(maxUpdateBatchSize())),
      ("icrc7:default_take_value", #Nat(defaultTakeValue())),
      ("icrc7:max_take_value", #Nat(maxTakeValue())),
      ("icrc7:max_memo_size", #Nat(maxMemoSize())),
    ];
  };

  public query func icrc7_symbol() : async Text {
    switch (currentMintCollection()) {
      case (?collection) collection.symbol;
      case null "MINT";
    };
  };

  public query func icrc7_name() : async Text {
    switch (currentMintCollection()) {
      case (?collection) collection.name;
      case null "Mintlab Collection";
    };
  };

  public query func icrc7_description() : async ?Text {
    switch (currentMintCollection()) {
      case (?collection) ?collection.description;
      case null null;
    };
  };

  public query func icrc7_logo() : async ?Text {
    switch (currentMintCollection()) {
      case (?collection) {
        if (collection.imageUrl == "") {
          null;
        } else {
          ?collection.imageUrl;
        };
      };
      case null null;
    };
  };

  public query func icrc7_total_supply() : async Nat {
    currentCollectionSupply();
  };

  public query func icrc7_supply_cap() : async ?Nat {
    null;
  };

  public query func icrc7_max_query_batch_size() : async ?Nat {
    ?maxQueryBatchSize();
  };

  public query func icrc7_max_update_batch_size() : async ?Nat {
    ?maxUpdateBatchSize();
  };

  public query func icrc7_default_take_value() : async ?Nat {
    ?defaultTakeValue();
  };

  public query func icrc7_max_take_value() : async ?Nat {
    ?maxTakeValue();
  };

  public query func icrc7_max_memo_size() : async ?Nat {
    ?maxMemoSize();
  };

  public query func icrc7_atomic_batch_transfers() : async ?Bool {
    ?false;
  };

  public query func icrc7_tx_window() : async ?Nat {
    null;
  };

  public query func icrc7_permitted_drift() : async ?Nat {
    null;
  };

  public query func icrc7_token_metadata(
    token_ids : [Nat],
  ) : async [?NFTStandards.ICRC7TokenMetadata] {
    var result : [?NFTStandards.ICRC7TokenMetadata] = [];
    for (tokenId in token_ids.values()) {
      let metadata = switch (currentMintCollectionId()) {
        case null null;
        case (?collectionId) {
          switch (MintLib.getToken(mintState, tokenId)) {
            case (?token) {
              if (MintLib.tokenBelongsToCollection(token, collectionId, currentMintCollectionId())) {
                MintLib.tokenMetadataPairs(mintState, tokenId);
              } else {
                null;
              };
            };
            case null null;
          };
        };
      };
      result := Array.concat<?NFTStandards.ICRC7TokenMetadata>(
        result,
        [metadata],
      );
    };
    result;
  };

  public query func icrc7_owner_of(
    token_ids : [Nat],
  ) : async [?NFTStandards.ICRC7Account] {
    var result : [?NFTStandards.ICRC7Account] = [];
    for (tokenId in token_ids.values()) {
      let ownerAccount = switch (MintLib.getToken(mintState, tokenId)) {
        case (?token) {
          switch (currentMintCollectionId()) {
            case (?collectionId) {
              if (MintLib.tokenBelongsToCollection(token, collectionId, currentMintCollectionId())) {
                ?defaultAccount(token.owner);
              } else {
                null;
              };
            };
            case null null;
          };
        };
        case null null;
      };
      result := Array.concat<?NFTStandards.ICRC7Account>(result, [ownerAccount]);
    };
    result;
  };

  public query func icrc7_balance_of(
    accounts : [NFTStandards.ICRC7Account],
  ) : async [Nat] {
    var balances : [Nat] = [];
    for (account in accounts.values()) {
      let balance = if (isDefaultSubaccount(account.subaccount)) {
        switch (currentMintCollectionId()) {
          case null 0;
          case (?collectionId) {
            MintLib.ownerTokensForCollection(
              mintState,
              account.owner,
              collectionId,
              currentMintCollectionId(),
            ).size();
          };
        };
      } else {
        0;
      };
      balances := Array.concat<Nat>(balances, [balance]);
    };
    balances;
  };

  public query func icrc7_tokens(prev : ?Nat, take : ?Nat) : async [Nat] {
    paginateTokenIds(currentCollectionTokenIds(), prev, take);
  };

  public query func icrc7_tokens_of(
    account : NFTStandards.ICRC7Account,
    prev : ?Nat,
    take : ?Nat,
  ) : async [Nat] {
    if (not isDefaultSubaccount(account.subaccount)) {
      return [];
    };
    switch (currentMintCollectionId()) {
      case null [];
      case (?collectionId) {
        let tokens = MintLib.ownerTokensForCollection(
          mintState,
          account.owner,
          collectionId,
          currentMintCollectionId(),
        );
        var tokenIds : [Nat] = [];
        for (token in tokens.values()) {
          tokenIds := Array.concat<Nat>(tokenIds, [token.tokenId]);
        };
        paginateTokenIds(tokenIds, prev, take);
      };
    };
  };

  public shared ({ caller }) func icrc7_transfer(
    args : [NFTStandards.ICRC7TransferArg]
  ) : async [?NFTStandards.ICRC7TransferResult] {
    var results : [?NFTStandards.ICRC7TransferResult] = [];

    for (arg in args.values()) {
      let response = if (Principal.isAnonymous(caller)) {
        ?#Err(#Unauthorized);
      } else if (not isDefaultSubaccount(arg.from_subaccount)) {
        ?#Err(#Unauthorized);
      } else if (Principal.equal(arg.to.owner, caller) and isDefaultSubaccount(arg.to.subaccount)) {
        ?#Err(#InvalidRecipient);
      } else {
        switch (currentMintCollectionId()) {
          case null ?#Err(#NonExistingTokenId);
          case (?collectionId) {
            switch (MintLib.getToken(mintState, arg.token_id)) {
              case null ?#Err(#NonExistingTokenId);
              case (?token) {
                if (not MintLib.tokenBelongsToCollection(token, collectionId, currentMintCollectionId())) {
                  ?#Err(#NonExistingTokenId);
                } else {
                  switch (MintLib.transferToken(mintState, arg.token_id, caller, arg.to.owner)) {
                    case (#err("Minted token not found")) ?#Err(#NonExistingTokenId);
                    case (#err(message)) ?#Err(#GenericError({ error_code = 1; message }));
                    case (#ok(transfer)) {
                      syncTransferredManagedNFT(caller, arg.to.owner, transfer.token);
                      ?#Ok(transfer.transactionId);
                    };
                  };
                };
              };
            };
          };
        };
      };
      results := Array.concat<?NFTStandards.ICRC7TransferResult>(results, [response]);
    };
    results;
  };

  public query func icrc10_supported_standards() : async [NFTStandards.SupportedStandard] {
    [
      {
        name = "ICRC-7";
        url = "https://github.com/dfinity/ICRC/ICRCs/ICRC-7";
      },
      {
        name = "ICRC-10";
        url = "https://github.com/dfinity/ICRC/ICRCs/ICRC-10";
      },
      {
        name = "DIP721";
        url = "https://github.com/Psychedelic/DIP721";
      },
      {
        name = "EXT";
        url = "https://github.com/Toniq-Labs/ext-v2-token";
      },
    ];
  };

  func manageableMintedCollectionIds(caller : Principal) : async [CollectionTypes.CollectionId] {
    var collectionIds = WalletLib.getManagedCollectionsByOwner(walletState, caller);
    let callerIsAdmin = AuthLib.isAdmin(authState, caller);
    for (collection in CollectionsLib.getCollections(collectionsState).values()) {
      if (collection.kind == #Minted and not containsCollectionId(collectionIds, collection.id)) {
        if (callerIsAdmin) {
          collectionIds := appendCollectionId(collectionIds, collection.id);
        } else if (not Principal.equal(collection.canisterId, canisterId)) {
          switch (await collectionCanisterOwner(collection.canisterId)) {
            case (?owner) {
              if (Principal.equal(owner, caller)) {
                WalletLib.setManagedCollectionOwner(walletState, collection.id, caller);
                collectionIds := appendCollectionId(collectionIds, collection.id);
              };
            };
            case null {};
          };
        };
      };
    };
    collectionIds;
  };

  func collectionCanisterOwner(childCanisterId : Principal) : async ?Principal {
    try {
      let child : ChildCollectionInfoActor = actor (childCanisterId.toText());
      ?(await child.mintlab_collection_owner());
    } catch (_error) {
      null;
    };
  };

  func containsCollectionId(ids : [CollectionTypes.CollectionId], target : CollectionTypes.CollectionId) : Bool {
    for (id in ids.values()) {
      if (id == target) {
        return true;
      };
    };
    false;
  };

  func appendCollectionId(
    ids : [CollectionTypes.CollectionId],
    id : CollectionTypes.CollectionId,
  ) : [CollectionTypes.CollectionId] {
    if (containsCollectionId(ids, id)) {
      ids;
    } else {
      Array.concat<CollectionTypes.CollectionId>(ids, [id]);
    };
  };

  func currentMintCollection() : ?CollectionTypes.Collection {
    switch (MintLib.getConfig(mintState).collectionId) {
      case (?collectionId) CollectionsLib.getCollection(collectionsState, collectionId);
      case null null;
    };
  };

  func currentMintCollectionId() : ?CollectionTypes.CollectionId {
    MintLib.getConfig(mintState).collectionId;
  };

  func currentCollectionSupply() : Nat {
    currentCollectionTokenIds().size();
  };

  func currentCollectionTokenIds() : [Nat] {
    switch (currentMintCollectionId()) {
      case null [];
      case (?collectionId) {
        var ids : [Nat] = [];
        for (
          token in MintLib.tokensForCollection(
            mintState,
            collectionId,
            currentMintCollectionId(),
          ).values()
        ) {
          ids := Array.concat<Nat>(ids, [token.tokenId]);
        };
        ids;
      };
    };
  };

  func currentCollectionTokens() : [MintTypes.MintedToken] {
    switch (currentMintCollectionId()) {
      case null [];
      case (?collectionId) {
        MintLib.tokensForCollection(mintState, collectionId, currentMintCollectionId());
      };
    };
  };

  func mainTokenById(tokenId : Nat) : ?MintTypes.MintedToken {
    switch (currentMintCollectionId()) {
      case null null;
      case (?collectionId) {
        switch (MintLib.getToken(mintState, tokenId)) {
          case (?token) {
            if (MintLib.tokenBelongsToCollection(token, collectionId, currentMintCollectionId())) {
              ?token;
            } else {
              null;
            };
          };
          case null null;
        };
      };
    };
  };

  func extBalance(request : EXTBalanceRequest) : EXTBalanceResponse {
    switch (extTokenIdFromIdentifier(request.token)) {
      case null #err(#InvalidToken(request.token));
      case (?tokenId) {
        switch (mainTokenById(tokenId)) {
          case null #ok(0);
          case (?token) {
            let ownsToken = switch (request.user) {
              case (#principal(owner)) Principal.equal(owner, token.owner);
              case (#address(account)) account == accountIdHex(token.owner);
            };
            #ok(if (ownsToken) 1 else 0);
          };
        };
      };
    };
  };

  func extTransfer(caller : Principal, request : EXTTransferRequest) : EXTTransferResponse {
    if (Principal.isAnonymous(caller)) {
      return #err(#Unauthorized(""));
    };
    if (request.amount != 1) {
      return #err(#Other("EXT NFT transfers require amount 1"));
    };
    let from = switch (request.from) {
      case (#principal(value)) value;
      case (#address(value)) return #err(#Unauthorized(value));
    };
    if (not Principal.equal(caller, from)) {
      return #err(#Unauthorized(accountIdHex(from)));
    };
    let to = switch (request.to) {
      case (#principal(value)) value;
      case (#address(_)) return #err(#Other("Transfers to account identifiers are not supported"));
    };
    let tokenId = switch (extTokenIdFromIdentifier(request.token)) {
      case null return #err(#InvalidToken(request.token));
      case (?value) value;
    };
    switch (mainTokenById(tokenId)) {
      case null return #err(#InvalidToken(request.token));
      case (?_) {};
    };
    switch (MintLib.transferToken(mintState, tokenId, from, to)) {
      case (#ok(transfer)) {
        syncTransferredManagedNFT(from, to, transfer.token);
        #ok(0);
      };
      case (#err("Minted token not found")) #err(#InvalidToken(request.token));
      case (#err("You do not own this minted NFT")) #err(#Unauthorized(accountIdHex(from)));
      case (#err(message)) #err(#Other(message));
    };
  };

  func ownerMainTokenIndexesForAccount(
    account : EXTAccountIdentifier
  ) : [(EXTTokenIndex, ?EXTListing, ?Blob)] {
    var result : [(EXTTokenIndex, ?EXTListing, ?Blob)] = [];
    for (token in currentCollectionTokens().values()) {
      if (account == accountIdHex(token.owner)) {
        switch (extTokenIndexFromTokenId(token.tokenId)) {
          case null {};
          case (?index) {
            result := Array.concat<(EXTTokenIndex, ?EXTListing, ?Blob)>(
              result,
              [(index, null, null)],
            );
          };
        };
      };
    };
    result;
  };

  func extTokenIndexFromTokenId(tokenId : Nat) : ?EXTTokenIndex {
    if (tokenId == 0) {
      return null;
    };
    let index = Nat.sub(tokenId, 1);
    if (index > 4_294_967_295) {
      return null;
    };
    ?Nat32.fromNat(index);
  };

  func extTokenIdFromIdentifier(identifier : EXTTokenIdentifier) : ?Nat {
    let bytes = Blob.toArray(Principal.fromText(identifier).toBlob());
    let size = bytes.size();
    if (size < 8) {
      return null;
    };
    if (bytes[0] != 10 or bytes[1] != 116 or bytes[2] != 105 or bytes[3] != 100) {
      return null;
    };
    let collectionBytes = Blob.toArray(Principal.toBlob(canisterId));
    if (size != collectionBytes.size() + 8) {
      return null;
    };
    var i = 0;
    while (i < collectionBytes.size()) {
      if (bytes[4 + i] != collectionBytes[i]) {
        return null;
      };
      i += 1;
    };
    let index =
      (((Nat8.toNat(bytes[size - 4]) * 256 + Nat8.toNat(bytes[size - 3])) * 256 + Nat8.toNat(bytes[size - 2])) * 256) +
      Nat8.toNat(bytes[size - 1]);
    ?(index + 1);
  };

  func extMetadataForMainTokenId(tokenId : Nat) : ?EXTMetadata {
    switch (mainTokenById(tokenId)) {
      case (?token) {
        let imageUrl = mainTokenAssetUrl(token);
        ?#nonfungible({
          asset = imageUrl;
          metadata = ?#json(extMetadataJson(token));
          name = tokenName(token);
          thumbnail = imageUrl;
        });
      };
      case null {
        if (tokenId == 1) {
          ?#nonfungible({
            asset = mainCollectionLogo();
            metadata = ?#json(
              "{" #
              "\"name\":" # debug_show (mainCollectionName()) # "," #
              "\"description\":" # debug_show (mainCollectionDescription()) # "," #
              "\"image\":" # debug_show (mainCollectionLogo()) # "," #
              "\"image_url\":" # debug_show (mainCollectionLogo()) # "," #
              "\"url\":" # debug_show (mainCollectionLogo()) # "," #
              "\"thumb\":" # debug_show (mainCollectionLogo()) # "," #
              "\"thumbnail\":" # debug_show (mainCollectionLogo()) # "," #
              "\"collection\":" # mainCollectionMetadataJson() # "," #
              "\"attributes\":[]" #
              "}"
            );
            name = mainCollectionName();
            thumbnail = mainCollectionLogo();
          });
        } else {
          null;
        };
      };
    };
  };

  func extMetadataJson(token : MintTypes.MintedToken) : Text {
    let imageUrl = mainTokenAssetUrl(token);
    "{" #
    "\"name\":" # debug_show (tokenName(token)) # "," #
    "\"description\":" # debug_show (tokenDescription(token)) # "," #
    "\"image\":" # debug_show (imageUrl) # "," #
    "\"image_url\":" # debug_show (imageUrl) # "," #
    "\"url\":" # debug_show (imageUrl) # "," #
    "\"thumb\":" # debug_show (imageUrl) # "," #
    "\"thumbnail\":" # debug_show (imageUrl) # "," #
    "\"collection\":" # mainCollectionMetadataJson() # "," #
    "\"attributes\":" # extAttributesJson(token.metadata.attributes) #
    "}";
  };

  func mainCollectionMetadataJson() : Text {
    "{" #
    "\"name\":" # debug_show (mainCollectionName()) # "," #
    "\"symbol\":" # debug_show (mainCollectionSymbol()) # "," #
    "\"description\":" # debug_show (mainCollectionDescription()) # "," #
    "\"canister_id\":" # debug_show (canisterId.toText()) #
    "}";
  };

  func mainTokenOriginalImageUrl(token : MintTypes.MintedToken) : Text {
    switch (token.metadata.imageUrl) {
      case (?value) value;
      case null mainCollectionLogo();
    };
  };

  func mainTokenAssetUrl(token : MintTypes.MintedToken) : Text {
    switch (HttpMedia.tokenAssetUrl(canisterId, token.tokenId)) {
      case (?value) value;
      case null mainTokenOriginalImageUrl(token);
    };
  };

  func httpAssetResponse(request : AssetHttpRequest) : AssetHttpResponse {
    switch (HttpMedia.tokenIdFromUrl(request.url, canisterId)) {
      case null HttpMedia.notFoundResponse();
      case (?tokenId) {
        switch (mainTokenById(tokenId)) {
          case (?token) HttpMedia.imageResponse(mainTokenOriginalImageUrl(token));
          case null HttpMedia.notFoundResponse();
        };
      };
    };
  };

  func extAttributesJson(attributes : [(Text, Text)]) : Text {
    var result =
      "[" #
      "{\"trait_type\":\"Collection\",\"value\":" # debug_show (mainCollectionName()) # "}," #
      "{\"trait_type\":\"Collection Symbol\",\"value\":" # debug_show (mainCollectionSymbol()) # "}," #
      "{\"trait_type\":\"Collection Canister\",\"value\":" # debug_show (canisterId.toText()) # "}";
    for ((key, value) in attributes.values()) {
      if (isManagedCollectionAttribute(key)) {
        continue;
      };
      result #= ",";
      result #= "{\"trait_type\":" # debug_show (key) # ",\"value\":" # debug_show (value) # "}";
    };
    result # "]";
  };

  func tokenName(token : MintTypes.MintedToken) : Text {
    switch (token.metadata.name) {
      case (?value) value;
      case null mainCollectionName() # " #" # Nat.toText(token.tokenId);
    };
  };

  func tokenDescription(token : MintTypes.MintedToken) : Text {
    switch (token.metadata.description) {
      case (?value) value;
      case null mainCollectionDescription();
    };
  };

  func mainCollectionName() : Text {
    switch (currentMintCollection()) {
      case (?collection) collection.name;
      case null "Mintlab Collection";
    };
  };

  func mainCollectionDescription() : Text {
    switch (currentMintCollection()) {
      case (?collection) collection.description;
      case null "";
    };
  };

  func mainCollectionSymbol() : Text {
    switch (currentMintCollection()) {
      case (?collection) collection.symbol;
      case null "MINT";
    };
  };

  func mainCollectionLogo() : Text {
    switch (currentMintCollection()) {
      case (?collection) collection.imageUrl;
      case null "";
    };
  };

  func isManagedCollectionAttribute(key : Text) : Bool {
    key == "mintlab:collection_id" or
    key == "mintlab:collection_name" or
    key == "mintlab:collection_symbol";
  };

  func accountIdHex(owner : Principal) : Text {
    bytesToHex(owner.toLedgerAccount(null));
  };

  func bytesToHex(bytes : Blob) : Text {
    var result = "";
    for (byte in Blob.toArray(bytes).values()) {
      result #= hexByte(byte);
    };
    result;
  };

  func hexByte(byte : Nat8) : Text {
    let value = Nat8.toNat(byte);
    hexDigit(value / 16) # hexDigit(value % 16);
  };

  func hexDigit(value : Nat) : Text {
    switch (value) {
      case 0 "0";
      case 1 "1";
      case 2 "2";
      case 3 "3";
      case 4 "4";
      case 5 "5";
      case 6 "6";
      case 7 "7";
      case 8 "8";
      case 9 "9";
      case 10 "a";
      case 11 "b";
      case 12 "c";
      case 13 "d";
      case 14 "e";
      case _ "f";
    };
  };

  func syncTransferredManagedNFT(
    from : Principal,
    to : Principal,
    token : MintTypes.MintedToken,
  ) {
    switch (resolvedCollectionId(token)) {
      case null {};
      case (?collectionId) {
        switch (WalletLib.findByCollectionToken(walletState, collectionId, Nat.toText(token.tokenId))) {
          case (?nft) {
            ignore WalletLib.transferManagedNFT(walletState, nft.id, from, to, #Minted);
          };
          case null {};
        };
      };
    };
  };

  func resolvedCollectionId(token : MintTypes.MintedToken) : ?CollectionTypes.CollectionId {
    MintLib.tokenCollectionId(token, MintLib.getConfig(mintState).collectionId);
  };

  func validateMintMetadata(
    metadata : WalletTypes.NFTMetadata
  ) : ?Text {
    switch (metadata.imageUrl) {
      case (?imageUrl) {
        if (imageUrl.size() > MAX_ON_CHAIN_IMAGE_CHARS) {
          ?"Uploaded image is too large for on-chain storage";
        } else {
          null;
        };
      };
      case null ?"Minting requires an uploaded image";
    };
  };

  func maybeModerateCollection(
    name : Text,
    description : Text,
    symbol : Text,
    imageUrl : Text,
  ) : async ?Text {
    await moderateUpload(
      "collection",
      name,
      description,
      "Symbol: " # symbol,
      imageUrl,
    );
  };

  func maybeModerateNFT(
    metadata : WalletTypes.NFTMetadata
  ) : async ?Text {
    let title = switch (metadata.name) {
      case (?value) value;
      case null "";
    };
    let description = switch (metadata.description) {
      case (?value) value;
      case null "";
    };
    var attributes = "";
    for ((key, value) in metadata.attributes.values()) {
      attributes #= "\nAttribute " # key # ": " # value;
    };
    let imageUrl = switch (metadata.imageUrl) {
      case (?value) value;
      case null "";
    };
    await moderateUpload("NFT", title, description, attributes, imageUrl);
  };

  func moderateUpload(
    kind : Text,
    title : Text,
    description : Text,
    extraText : Text,
    imageUrl : Text,
  ) : async ?Text {
    let config = MintLib.getModerationConfig(moderationState);
    if (not config.enabled) {
      return null;
    };
    if (not hasActiveModerationRules(config.categories)) {
      return null;
    };
    let apiKey = switch (config.apiKey) {
      case (?value) {
        let sanitized = sanitizeModerationApiKey(value);
        if (sanitized == "") {
          return ?moderationUnavailableReason("The OpenAI API key is not configured.");
        };
        sanitized;
      };
      case null return ?moderationUnavailableReason("The OpenAI API key is not configured.");
    };
    if (not isSupportedModerationImage(imageUrl)) {
      return ?"Moderation currently supports JPG and PNG uploads. Please upload a JPG or PNG image. No ICP was transferred.";
    };

    let preparedImage = switch (prepareModerationImage(imageUrl)) {
      case (#ok(value)) value;
      case (#err(message)) return ?moderationUnavailableReason(message);
    };
    let response = try {
      await callOpenAIModeration(apiKey, kind, title, description, extraText, preparedImage.imageUrl, preparedImage.requestId);
    } catch (error) {
      let errMsg = Error.message(error);
      Debug.print("=== OPENAI MODERATION OUTCALL FAILURE ===");
      Debug.print("Error: " # errMsg);
      Debug.print("Request ID: " # preparedImage.requestId);
      Debug.print("Original image kind: " # moderationImageKind(imageUrl));
      Debug.print("Original image chars: " # Nat.toText(imageUrl.size()));
      Debug.print("Prepared image kind: " # moderationImageKind(preparedImage.imageUrl));
      Debug.print("Prepared image chars: " # Nat.toText(preparedImage.imageUrl.size()));
      Debug.print("======================================");
      return ?moderationUnavailableReason(moderationRequestFailureMessage(errMsg));
    };
    if (response.status != 200) {
      let diagnostic = moderationResponseDiagnostic(response.body);
      Debug.print("=== MODERATION DEBUG ===");
      Debug.print("Status: " # Nat.toText(response.status));
      Debug.print("Transformed response body: " # debug_show (response.body));
      Debug.print("Diagnostic: " # diagnostic);
      Debug.print("========================");
      return ?moderationUnavailableReason(moderationStatusFailureMessage(response.status, diagnostic));
    };
    switch (Text.decodeUtf8(response.body)) {
      case (?summary) {
        if (Text.startsWith(summary, #text "ERROR") or summary == "UNKNOWN") {
          return ?moderationUnavailableReason(moderationProviderFailureMessage(summary));
        };
        switch (openAIModerationDecision(summary, config.categories)) {
          case ("ALLOW") null;
          case ("BLOCK") ?moderationDeclineReason(config);
          case (_) ?moderationUnavailableReason("The OpenAI moderation response could not be verified.");
        };
      };
      case null ?moderationUnavailableReason("The OpenAI moderation response could not be verified.");
    };
  };

  func callOpenAIModeration(
    apiKey : Text,
    kind : Text,
    title : Text,
    description : Text,
    extraText : Text,
    imageUrl : Text,
    requestId : Text,
  ) : async HttpRequestResult {
    let body = Text.encodeUtf8(
      "{" #
      "\"model\":\"omni-moderation-latest\"," #
      "\"input\":[" #
      "{\"type\":\"text\",\"text\":" # jsonString(moderationTextInput(kind, title, description, extraText)) # "}," #
      "{\"type\":\"image_url\",\"image_url\":{\"url\":" # jsonString(imageUrl) # "}}" #
      "]" #
      "}"
    );
    if (body.size() > MODERATION_MAX_REQUEST_BODY_BYTES) {
      Runtime.trap("The OpenAI moderation request was too large.");
    };
    let request : HttpRequestArgs = {
      url = "https://api.openai.com/v1/moderations";
      method = #post;
      max_response_bytes = ?MODERATION_MAX_RESPONSE_BYTES;
      headers = [
        { name = "Host"; value = "api.openai.com" },
        { name = "Authorization"; value = "Bearer " # apiKey },
        { name = "User-Agent"; value = "mintlab-openai-moderation" },
        { name = "Content-Type"; value = "application/json" },
        { name = "Idempotency-Key"; value = requestId },
      ];
      body = ?body;
      transform = ?{
        function = transformModerationResponse;
        context = Blob.fromArray([]);
      };
      // This response gates minting/payment, so replicas must agree on it.
      is_replicated = null;
    };
    let ic : ManagementCanisterActor = actor "aaaaa-aa";
    let requestSize = httpRequestSize(request);
    let cost = httpRequestCost(requestSize, request.max_response_bytes);
    if (Cycles.balance() <= cost + minimumFactoryOperatingReserveCycles()) {
      Runtime.trap("The app canister does not have enough cycles to call OpenAI moderation.");
    };
    if (CYCLE_DEBUG_LOGS_ENABLED) {
      Debug.print(
        "OPENAI MODERATION OUTCALL" #
        " requestBytes=" # Nat.toText(requestSize) #
        " maxResponseBytes=" # (switch (request.max_response_bytes) { case (?b) Nat64.toText(b); case null "unlimited" }) #
        " estimatedCycles=" # Nat.toText(cost) #
        " canisterCycleBalance=" # Nat.toText(Cycles.balance()) #
        " requestId=" # requestId #
        " imageKind=" # moderationImageKind(imageUrl) #
        " imageChars=" # Nat.toText(imageUrl.size())
      );
    };
    assertCyclesForCall(cost, "OpenAI moderation HTTPS outcall");
    await (with cycles = cost) ic.http_request(request);
  };

  func moderationTextInput(kind : Text, title : Text, description : Text, extraText : Text) : Text {
    "Kind: " # kind #
    "\nTitle: " # title #
    "\nDescription: " # description #
    "\nMetadata: " # extraText;
  };

  func prepareModerationImage(imageUrl : Text) : { #ok : PreparedModerationImage; #err : Text } {
    let token = newModerationToken();
    if (Text.startsWith(imageUrl, #text "data:image/")) {
      if (imageUrl.size() > MODERATION_MAX_IMAGE_DATA_URL_CHARS) {
        return #err("The uploaded image is too large for OpenAI moderation. Please upload a smaller JPG or PNG.");
      };
      #ok({
        imageUrl;
        requestId = moderationRequestId(token);
      });
    } else {
      #ok({ imageUrl; requestId = moderationRequestId(token) });
    };
  };

  func newModerationToken() : Text {
    moderationImageNonce += 1;
    Nat.toText(Int.abs(Time.now())) # "-" # Nat.toText(moderationImageNonce);
  };

  func moderationRequestId(token : Text) : Text {
    "mintlab-" # token;
  };

  func moderationImageKind(imageUrl : Text) : Text {
    if (Text.startsWith(imageUrl, #text "data:image/png;base64,")) {
      "data:image/png";
    } else if (
      Text.startsWith(imageUrl, #text "data:image/jpeg;base64,") or
      Text.startsWith(imageUrl, #text "data:image/jpg;base64,")
    ) {
      "data:image/jpeg";
    } else if (Text.startsWith(imageUrl, #text "https://")) {
      "https-url";
    } else {
      "unsupported";
    };
  };

  func openAIModerationDecision(summary : Text, categories : MintTypes.ModerationCategorySettings) : Text {
    if (not Text.startsWith(summary, #text "OPENAI_MODERATION;")) {
      return "UNKNOWN";
    };
    let sexual =
      summaryFlag(summary, "sexual") or
      summaryFlag(summary, "sexual_minors");
    let violence =
      summaryFlag(summary, "violence") or
      summaryFlag(summary, "violence_graphic");
    let selfHarm =
      summaryFlag(summary, "self_harm") or
      summaryFlag(summary, "self_harm_intent") or
      summaryFlag(summary, "self_harm_instructions");
    let harassment =
      summaryFlag(summary, "harassment") or
      summaryFlag(summary, "harassment_threatening");
    let hate =
      summaryFlag(summary, "hate") or
      summaryFlag(summary, "hate_threatening");
    let illicit =
      summaryFlag(summary, "illicit") or
      summaryFlag(summary, "illicit_violent");
    let blockAdult = categories.nudityOrSexual and sexual;
    let blockViolence = categories.graphicViolence and violence;
    let blockSelfHarm = categories.selfHarm and selfHarm;
    let blockHateOrHarassment = categories.hateOrHarassment and (hate or harassment);
    let blockExplicitLanguage = categories.explicitLanguage and harassment;
    let blockHateSymbols = categories.hateSymbols and hate;
    let blockIllegalOrDangerous = categories.illegalOrDangerous and illicit;
    let blockOtherNsfw = categories.otherNsfw and (
      sexual or
      summaryFlag(summary, "violence_graphic") or
      selfHarm
    );
    if (
      blockAdult or
      blockViolence or
      blockSelfHarm or
      blockHateOrHarassment or
      blockExplicitLanguage or
      blockHateSymbols or
      blockIllegalOrDangerous or
      blockOtherNsfw
    ) {
      "BLOCK";
    } else {
      "ALLOW";
    };
  };

  func summaryFlag(summary : Text, field : Text) : Bool {
    Text.contains(summary, #text (field # "=true"));
  };

  func jsonString(value : Text) : Text {
    let escapedBackslash = Text.replace(value, #text "\\", "\\\\");
    let escapedQuote = Text.replace(escapedBackslash, #text "\"", "\\\"");
    let escapedNewline = Text.replace(escapedQuote, #text "\n", "\\n");
    let escapedCarriageReturn = Text.replace(escapedNewline, #text "\r", "\\r");
    let escapedTab = Text.replace(escapedCarriageReturn, #text "\t", "\\t");
    "\"" # escapedTab # "\"";
  };

  func httpRequestSize(request : HttpRequestArgs) : Nat {
    var requestSize = request.url.size();
    for (header in request.headers.values()) {
      requestSize += header.name.size();
      requestSize += header.value.size();
    };
    switch (request.body) {
      case (?body) requestSize += body.size();
      case null {};
    };
    switch (request.transform) {
      case (?transform) {
        requestSize += transform.context.size();
        requestSize += 256;
      };
      case null {};
    };
    requestSize += 2_000;
    requestSize;
  };

  func httpRequestCost(requestSize : Nat, maxResponseBytesOption : ?Nat64) : Nat {
    let maxResponseBytes = switch (maxResponseBytesOption) {
      case (?value) Nat64.toNat(value);
      case null 2_000_000;
    };
    Prim.costHttpRequest(Nat64.fromNat(requestSize), Nat64.fromNat(maxResponseBytes));
  };

  func moderationDeclineReason(config : MintTypes.ModerationConfig) : Text {
    "Upload declined by moderation. " # config.userMessage;
  };

  func moderationUnavailableReason(detail : Text) : Text {
    detail # " Upload moderation must pass before minting or collection creation. No ICP was transferred.";
  };

  func sanitizeModerationApiKey(value : Text) : Text {
    var result = "";
    for (char in value.chars()) {
      if (not isAsciiWhitespace(char)) {
        result #= Text.fromChar(char);
      };
    };
    stripBearerPrefix(result);
  };

  func stripBearerPrefix(value : Text) : Text {
    if (Text.startsWith(value, #text "Bearer")) {
      switch (Text.stripStart(value, #text "Bearer")) {
        case (?stripped) stripped;
        case null value;
      };
    } else if (Text.startsWith(value, #text "bearer")) {
      switch (Text.stripStart(value, #text "bearer")) {
        case (?stripped) stripped;
        case null value;
      };
    } else {
      value;
    };
  };

  func isAsciiWhitespace(char : Char) : Bool {
    char == ' ' or char == '\n' or char == '\r' or char == '\t';
  };

  func moderationRequestFailureMessage(message : Text) : Text {
    let lowerMessage = Text.toLower(message);
    if (
      Text.contains(lowerMessage, #text "replicated") or
      Text.contains(lowerMessage, #text "non-replicated") or
      Text.contains(lowerMessage, #text "is_replicated") or
      Text.contains(lowerMessage, #text "update call") or
      Text.contains(lowerMessage, #text "consensus")
    ) {
      "The OpenAI moderation outcall is configured incorrectly. Contact the admin to fix the moderation setup.";
    } else if (
      Text.contains(lowerMessage, #text "cycles") or
      Text.contains(lowerMessage, #text "canisteroutofcycles") or
      Text.contains(lowerMessage, #text "insufficientcycles") or
      Text.contains(lowerMessage, #text "out of cycles")
    ) {
      "The backend is running low on cycles. Please ask the admin to top up the canister.";
    } else if (
      Text.contains(lowerMessage, #text "timeout") or
      Text.contains(lowerMessage, #text "timed out") or
      Text.contains(lowerMessage, #text "deadline") or
      Text.contains(lowerMessage, #text "no response received") or
      Text.contains(lowerMessage, #text "systransient")
    ) {
      "OpenAI moderation is temporarily unavailable. Please try again in a moment.";
    } else if (
      Text.contains(lowerMessage, #text "request body") or
      Text.contains(lowerMessage, #text "payload") or
      Text.contains(lowerMessage, #text "message size") or
      Text.contains(lowerMessage, #text "max message") or
      Text.contains(lowerMessage, #text "maximum size") or
      Text.contains(lowerMessage, #text "too large") or
      Text.contains(lowerMessage, #text "size limit")
    ) {
      "The uploaded image is too large for moderation. Please upload a smaller JPG or PNG image.";
    } else if (
      Text.contains(lowerMessage, #text "dns") or
      Text.contains(lowerMessage, #text "certificate") or
      Text.contains(lowerMessage, #text "tls") or
      Text.contains(lowerMessage, #text "connect") or
      Text.contains(lowerMessage, #text "connection") or
      Text.contains(lowerMessage, #text "network")
    ) {
      "The IC HTTPS outcall could not connect to OpenAI moderation.";
    } else {
      "The OpenAI moderation HTTPS outcall failed before OpenAI returned a usable response.";
    };
  };

  func moderationStatusFailureMessage(status : Nat, diagnostic : Text) : Text {
    if (status == 400) {
      if (diagnostic == "ERROR_AUTH") {
        "The OpenAI API key is invalid or expired. Please ask the admin to update the OpenAI API key in the moderation settings.";
      } else if (diagnostic == "ERROR_IMAGE_URL") {
        "Unsupported image format. Please upload a JPG or PNG image for moderation.";
      } else if (diagnostic == "ERROR_CONTENT") {
        "OpenAI rejected the uploaded image content before moderation could complete.";
      } else {
        "The OpenAI moderation request was rejected as invalid.";
      };
    } else if (status == 401 or status == 403) {
      "The OpenAI API key is invalid or expired. Please ask the admin to update the OpenAI API key in the moderation settings.";
    } else if (status == 413) {
      "The uploaded image is too large for moderation. Please upload a smaller JPG or PNG image.";
    } else if (status == 429) {
      "OpenAI moderation is temporarily unavailable. Please try again in a moment.";
    } else if (status >= 500) {
      "The OpenAI moderation service is temporarily unavailable.";
    } else {
      "The OpenAI moderation service returned HTTP status " # Nat.toText(status) # ".";
    };
  };

  func moderationProviderFailureMessage(diagnostic : Text) : Text {
    if (diagnostic == "ERROR_AUTH") {
      "The OpenAI API key was rejected. Ask an admin to update the moderation key.";
    } else if (diagnostic == "ERROR_IMAGE_URL") {
      "OpenAI could not fetch or read the uploaded image for moderation.";
    } else if (diagnostic == "ERROR_RATE_LIMIT") {
      "The OpenAI service is rate limiting moderation requests.";
    } else if (diagnostic == "ERROR_CONTENT") {
      "OpenAI rejected the uploaded image content before moderation could complete.";
    } else {
      "The OpenAI moderation response could not be verified.";
    };
  };

  func isSupportedModerationImage(imageUrl : Text) : Bool {
    Text.startsWith(imageUrl, #text "data:image/png;base64,") or
    Text.startsWith(imageUrl, #text "data:image/jpeg;base64,") or
    Text.startsWith(imageUrl, #text "data:image/jpg;base64,") or
    Text.startsWith(imageUrl, #text "https://");
  };

  func hasActiveModerationRules(categories : MintTypes.ModerationCategorySettings) : Bool {
    categories.nudityOrSexual or
    categories.graphicViolence or
    categories.explicitLanguage or
    categories.hateOrHarassment or
    categories.hateSymbols or
    categories.illegalOrDangerous or
    categories.selfHarm or
    categories.otherNsfw;
  };

  func validateCollectionProfile(
    name : Text,
    description : Text,
    symbol : Text,
    imageUrl : Text,
  ) {
    switch (validateCollectionProfileResult(name, description, symbol, imageUrl)) {
      case (?message) Runtime.trap(message);
      case null {};
    };
  };

  func validateCollectionProfileResult(
    name : Text,
    description : Text,
    symbol : Text,
    imageUrl : Text,
  ) : ?Text {
    if (name == "") {
      return ?"Collection name is required";
    };
    if (symbol == "") {
      return ?"Collection symbol is required";
    };
    if (description == "") {
      return ?"Collection description is required";
    };
    if (imageUrl == "") {
      return ?"Collection image is required";
    };
    if (imageUrl.size() > MAX_ON_CHAIN_IMAGE_CHARS) {
      return ?"Collection image is too large for on-chain storage";
    };
    null;
  };

  func validateOptionalAccountIdentifier(
    account : ?MintTypes.AccountIdentifier,
    accountLabel : Text,
  ) {
    switch (account) {
      case null {};
      case (?value) {
        if (value.size() != 32) {
          Runtime.trap(accountLabel # " must be a 32-byte ICP account identifier");
        };
      };
    };
  };

  func validateCollectionCreationPayoutShares(
    primaryBasisPoints : Nat,
    secondaryBasisPoints : Nat,
  ) {
    if (primaryBasisPoints + secondaryBasisPoints != PAYOUT_BASIS_POINTS_TOTAL) {
      Runtime.trap("Collection creation payout percentages must add up to 100%");
    };
  };

  func transferResultBlock(
    result : CommonTypes.TransferResult
  ) : { #ok : Nat64; #err : Text } {
    switch (result) {
      case (#Ok(value)) #ok(value);
      case (#Err(#TxDuplicate({ duplicate_of }))) #ok(duplicate_of);
      case (#Err(error)) #err(transferErrorText(error));
    };
  };

  func collectionCreationCyclesConverted(
    request : MintTypes.CollectionCreationRequest
  ) : Bool {
    switch (request.status) {
      case (#CyclesConverted) true;
      case (#AdminPayoutPending) true;
      case (#AdminPayoutSent) true;
      case (#CanisterCreated) true;
      case (#CollectionRegistered) true;
      case (#Installed) true;
      case (_) request.childCanisterId != null or request.collectionId != null;
    };
  };

  func notifyErrorLooksAlreadyProcessed(error : IcpLib.NotifyError) : Bool {
    let message = switch (error) {
      case (#InvalidTransaction(value)) value;
      case (#Other({ error_message })) error_message;
      case (_) "";
    };
    let lower = Text.toLower(message);
    Text.contains(lower, #text "already") or
    Text.contains(lower, #text "duplicate") or
    Text.contains(lower, #text "processed");
  };

  func collectionCreationPaymentBlock(
    request : MintTypes.CollectionCreationRequest
  ) : Nat64 {
    switch (request.cyclePaymentBlock) {
      case (?value) value;
      case null 0;
    };
  };

  func collectionForCreationRequest(
    request : MintTypes.CollectionCreationRequest
  ) : { #ok : CollectionTypes.Collection; #err : Text } {
    switch (request.collectionId) {
      case (?collectionId) {
        switch (CollectionsLib.getCollection(collectionsState, collectionId)) {
          case (?collection) #ok(collection);
          case null {
            switch (request.childCanisterId) {
              case (?childCanisterId) {
                switch (CollectionsLib.findCollectionByCanister(collectionsState, childCanisterId)) {
                  case (?collection) #ok(collection);
                  case null #err("Collection record is missing for this paid setup request");
                };
              };
              case null #err("Collection record is missing for this paid setup request");
            };
          };
        };
      };
      case null {
        switch (request.childCanisterId) {
          case (?childCanisterId) {
            switch (CollectionsLib.findCollectionByCanister(collectionsState, childCanisterId)) {
              case (?collection) #ok(collection);
              case null #err("Collection record is missing for this paid setup request");
            };
          };
          case null #err("Collection canister has not been created yet");
        };
      };
    };
  };

  func collectionCreationInitArgs(
    request : MintTypes.CollectionCreationRequest,
    childCanisterId : Principal,
  ) : CollectionCanisterInitArgs {
    ignore childCanisterId;
    {
      owner = request.owner;
      parent = canisterId;
      name = request.name;
      description = request.description;
      symbol = request.symbol;
      logo = request.imageUrl;
    };
  };

  func settleCollectionCreationAdminPayout(requestId : Nat) : async () {
    var request = switch (MintLib.getCollectionCreationRequest(collectionCreationState, requestId)) {
      case null return;
      case (?value) value;
    };
    var primaryPayoutE8s = MintLib.collectionCreationPrimaryAdminPayoutE8s(collectionCreationPayoutSplitState, request);
    var secondaryPayoutE8s = MintLib.collectionCreationSecondaryAdminPayoutE8s(collectionCreationPayoutSplitState, request);
    if (
      request.adminPayoutE8s == 0 or
      (
        (primaryPayoutE8s == 0 or request.adminPayoutBlock != null) and
        (secondaryPayoutE8s == 0 or MintLib.collectionCreationSecondaryAdminPayoutBlock(collectionCreationPayoutSplitState, request) != null)
      )
    ) {
      return;
    };
    if (primaryPayoutE8s > 0 and request.adminPayoutBlock == null) {
      let payoutAccount = switch (request.adminPayoutAccount) {
        case null {
          ignore MintLib.markCollectionCreationError(
            collectionCreationState,
            requestId,
            "Admin payout pending: collection creation primary payout account is not configured",
          );
          return;
        };
        case (?value) value;
      };
      let ledger = actor (IcpLib.LEDGER_CANISTER_ID) : IcpLib.Ledger;
      let userSubaccount = IcpLib.principalToSubaccount(request.owner);
      let payoutResult = await* IcpLib.transferOutAt(
        ledger,
        ?userSubaccount,
        payoutAccount,
        primaryPayoutE8s,
        Nat64.fromNat(request.id),
        request.createdAt + 1,
      );
      switch (transferResultBlock(payoutResult)) {
        case (#ok(blockIndex)) {
          ignore MintLib.markCollectionCreationAdminPayout(collectionCreationState, collectionCreationPayoutSplitState, requestId, blockIndex);
        };
        case (#err(message)) {
          ignore MintLib.markCollectionCreationError(
            collectionCreationState,
            requestId,
            "Admin primary payout pending: " # message,
          );
          return;
        };
      };
      request := switch (MintLib.getCollectionCreationRequest(collectionCreationState, requestId)) {
        case null return;
        case (?value) value;
      };
      primaryPayoutE8s := MintLib.collectionCreationPrimaryAdminPayoutE8s(collectionCreationPayoutSplitState, request);
      secondaryPayoutE8s := MintLib.collectionCreationSecondaryAdminPayoutE8s(collectionCreationPayoutSplitState, request);
    };
    if (secondaryPayoutE8s > 0 and MintLib.collectionCreationSecondaryAdminPayoutBlock(collectionCreationPayoutSplitState, request) == null) {
      let secondaryPayoutAccount = switch (MintLib.collectionCreationSecondaryAdminPayoutAccount(collectionCreationPayoutSplitState, request)) {
        case null {
          ignore MintLib.markCollectionCreationError(
            collectionCreationState,
            requestId,
            "Admin payout pending: collection creation secondary payout account is not configured",
          );
          return;
        };
        case (?value) value;
      };
      let ledger = actor (IcpLib.LEDGER_CANISTER_ID) : IcpLib.Ledger;
      let userSubaccount = IcpLib.principalToSubaccount(request.owner);
      let payoutResult = await* IcpLib.transferOutAt(
        ledger,
        ?userSubaccount,
        secondaryPayoutAccount,
        secondaryPayoutE8s,
        Nat64.fromNat(request.id),
        request.createdAt + 2,
      );
      switch (transferResultBlock(payoutResult)) {
        case (#ok(blockIndex)) {
          ignore MintLib.markCollectionCreationSecondaryAdminPayout(collectionCreationState, collectionCreationPayoutSplitState, requestId, blockIndex);
        };
        case (#err(message)) {
          ignore MintLib.markCollectionCreationError(
            collectionCreationState,
            requestId,
            "Admin secondary payout pending: " # message,
          );
        };
      };
    };
  };

  func collectionCanisterSettingsForCmc(owner : Principal) : IcpLib.CmcCanisterSettings {
    {
      controllers = ?[canisterId, owner];
      compute_allocation = null;
      memory_allocation = null;
      freezing_threshold = ?2_592_000;
    };
  };

  func recordCollectionCreationChildCanister(
    requestId : Nat,
    childCanisterId : Principal,
    source : Text,
  ) : async () {
    ignore MintLib.markCollectionCreationCanisterCreated(collectionCreationState, requestId, childCanisterId);
    if (CYCLE_DEBUG_LOGS_ENABLED) {
      switch (await collectionCanisterStatus(childCanisterId)) {
        case (?status) {
          Debug.print(
            "MINTLAB child canister created via " #
            source #
            " child=" #
            childCanisterId.toText() #
            " childCycles=" #
            Nat.toText(status.cycles)
          );
        };
        case null {
          Debug.print(
            "MINTLAB child canister created via " #
            source #
            " but status could not be read child=" #
            childCanisterId.toText()
          );
        };
      };
    };
  };

  func createEmptyCollectionCanister(
    owner : Principal,
    cyclesToAttach : Nat,
  ) : async Principal {
    let attachCycles : Nat = cyclesToAttach;
    let creationFee = canisterCreationFeeCycles();
    let reserve = minimumFactoryOperatingReserveCycles();
    let backendBalance = Cycles.balance();
    if (attachCycles <= creationFee) {
      Runtime.trap(
        "Collection canister create call needs more than the IC canister creation fee. Requested attach cycles: " #
        Nat.toText(attachCycles)
      );
    };
    if (backendBalance <= attachCycles + reserve) {
      Runtime.trap(
        "The app canister does not have enough cycles to attach " #
        Nat.toText(attachCycles) #
        " cycles to create_canister while keeping the factory reserve. Backend balance: " #
        Nat.toText(backendBalance)
      );
    };
    if (CYCLE_DEBUG_LOGS_ENABLED) {
      Debug.print(
        "MINTLAB CMC create_canister v7 attaching cycles=" #
        Nat.toText(attachCycles) #
        " backendBalanceBefore=" #
        Nat.toText(backendBalance) #
        " owner=" #
        owner.toText()
      );
    };
    assertCyclesForCall(attachCycles, "CMC create collection canister");
    let cmc = actor (IcpLib.CYCLES_MINTING_CANISTER_ID) : IcpLib.CyclesMintingCanister;
    let createResult = await (with cycles = attachCycles) cmc.create_canister({
      settings = ?collectionCanisterSettingsForCmc(owner);
      subnet_type = null;
      subnet_selection = null;
    });
    switch (createResult) {
      case (#Ok(childCanisterId)) {
        if (CYCLE_DEBUG_LOGS_ENABLED) {
          Debug.print(
            "MINTLAB CMC create_canister v7 created child=" #
            childCanisterId.toText() #
            " backendBalanceAfter=" #
            Nat.toText(Cycles.balance())
          );
        };
        childCanisterId;
      };
      case (#Err(#Refunded({ refund_amount; create_error }))) {
        Runtime.trap(
          "CMC create_canister refunded " #
          Nat.toText(refund_amount) #
          " cycles while creating the collection canister: " #
          create_error
        );
      };
    };
  };

  func installCollectionCode(
    childCanisterId : Principal,
    wasm : Blob,
    initArgs : CollectionCanisterInitArgs,
  ) : async () {
    await installCollectionCodeWithMode(childCanisterId, wasm, initArgs, #install);
  };

  func installCollectionCodeWithMode(
    childCanisterId : Principal,
    wasm : Blob,
    initArgs : CollectionCanisterInitArgs,
    mode : InstallCodeMode,
  ) : async () {
    let ic = managementCanister;
    await ic.install_code({
      mode;
      canister_id = childCanisterId;
      wasm_module = wasm;
      arg = to_candid (initArgs);
      sender_canister_version = null;
    });
  };

  func enhancedOrthogonalPersistenceUpgradeMode() : InstallCodeMode {
    #upgrade(
      ?{
        skip_pre_upgrade = null;
        wasm_memory_persistence = ?(#keep);
      }
    );
  };

  func topUpCollectionCanister(
    childCanisterId : Principal,
    cyclesToAttach : Nat,
  ) : async () {
    if (cyclesToAttach == 0) {
      return;
    };
    if (Cycles.balance() <= cyclesToAttach + minimumFactoryOperatingReserveCycles()) {
      Runtime.trap("The app canister needs more cycles before it can top up and install this collection canister");
    };
    assertCyclesForCall(cyclesToAttach, "deposit cycles into collection canister");
    let ic : ManagementCanisterActor = actor "aaaaa-aa";
    await (with cycles = cyclesToAttach) ic.deposit_cycles({
      canister_id = childCanisterId;
    });
  };

  func collectionCanisterStatus(
    childCanisterId : Principal
  ) : async ?CanisterStatusResult {
    try {
      let ic = managementCanister;
      ?(await ic.canister_status({ canister_id = childCanisterId }));
    } catch (_error) {
      null;
    };
  };

  func backendCanisterHealth() : MintTypes.AppCanisterHealth {
    {
      kind = #Backend;
      canisterId;
      cycles = ?Cycles.balance();
      moduleInstalled = ?true;
      freezingThresholdSeconds = null;
      idleCyclesBurnedPerDay = null;
      error = null;
    };
  };

  func appCanisterHealthFromStatus(
    kind : MintTypes.AppCanisterKind,
    targetCanisterId : Principal,
  ) : async MintTypes.AppCanisterHealth {
    try {
      let status = await managementCanister.canister_status({
        canister_id = targetCanisterId;
      });
      {
        kind;
        canisterId = targetCanisterId;
        cycles = ?status.cycles;
        moduleInstalled = ?(status.module_hash != null);
        freezingThresholdSeconds = ?status.settings.freezing_threshold;
        idleCyclesBurnedPerDay = ?status.idle_cycles_burned_per_day;
        error = null;
      };
    } catch (error) {
      {
        kind;
        canisterId = targetCanisterId;
        cycles = null;
        moduleInstalled = null;
        freezingThresholdSeconds = null;
        idleCyclesBurnedPerDay = null;
        error = ?("Cycle balance unavailable: " # Error.message(error));
      };
    };
  };

  func currentCollectionControllers(
    caller : Principal,
    collectionId : CollectionTypes.CollectionId,
  ) : async {
    #ok : {
      collection : CollectionTypes.Collection;
      controllers : [Principal];
    };
    #err : Text;
  } {
    let collection = switch (await manageableMintedCollection(caller, collectionId)) {
      case (#err(message)) return #err(message);
      case (#ok(value)) value;
    };
    switch (await collectionCanisterStatus(collection.canisterId)) {
      case (?status) {
        #ok({
          collection;
          controllers = status.settings.controllers;
        });
      };
      case null {
        #err("Could not read this collection canister's controllers. Mintlab may no longer be a controller of the canister.");
      };
    };
  };

  func manageableMintedCollection(
    caller : Principal,
    collectionId : CollectionTypes.CollectionId,
  ) : async { #ok : CollectionTypes.Collection; #err : Text } {
    if (Principal.isAnonymous(caller)) {
      return #err("You must be logged in to manage collection controllers");
    };
    let collection = switch (CollectionsLib.getCollection(collectionsState, collectionId)) {
      case null return #err("Collection not found");
      case (?value) value;
    };
    if (collection.kind != #Minted) {
      return #err("Only Mintlab collection canisters have controllers managed through this flow");
    };
    if (Principal.equal(collection.canisterId, canisterId)) {
      return #err("The main app collection is controlled by the app deployment, not this collection flow");
    };
    let manageableIds = await manageableMintedCollectionIds(caller);
    if (not containsCollectionId(manageableIds, collectionId)) {
      return #err("Only the collection creator or admin can manage this collection canister");
    };
    #ok(collection);
  };

  func updateCollectionCanisterControllers(
    childCanisterId : Principal,
    controllers : [Principal],
  ) : async () {
    let ic = managementCanister;
    await ic.update_settings({
      canister_id = childCanisterId;
      settings = {
        controllers = ?controllers;
        compute_allocation = null;
        memory_allocation = null;
        freezing_threshold = null;
      };
      sender_canister_version = null;
    });
  };

  func collectionCanisterControllersRecord(
    collectionId : CollectionTypes.CollectionId,
    childCanisterId : Principal,
    controllers : [Principal],
  ) : MintTypes.CollectionCanisterControllers {
    {
      collectionId;
      canisterId = childCanisterId;
      appCanisterId = canisterId;
      controllers;
    };
  };

  func collectionCanisterStatusRecord(
    collectionId : CollectionTypes.CollectionId,
    childCanisterId : Principal,
    status : CanisterStatusResult,
  ) : MintTypes.CollectionCanisterStatus {
    {
      collectionId;
      canisterId = childCanisterId;
      appCanisterId = canisterId;
      controllers = status.settings.controllers;
      cycles = status.cycles;
      moduleInstalled = switch (status.module_hash) {
        case null false;
        case (?_) true;
      };
      freezingThresholdSeconds = status.settings.freezing_threshold;
      idleCyclesBurnedPerDay = status.idle_cycles_burned_per_day;
    };
  };

  func principalArrayContains(values : [Principal], target : Principal) : Bool {
    for (value in values.values()) {
      if (Principal.equal(value, target)) {
        return true;
      };
    };
    false;
  };

  func appendController(values : [Principal], controller : Principal) : [Principal] {
    if (principalArrayContains(values, controller)) {
      values;
    } else {
      Array.concat<Principal>(values, [controller]);
    };
  };

  func removeController(values : [Principal], controller : Principal) : [Principal] {
    Array.filter<Principal>(
      values,
      func(value) {
        not Principal.equal(value, controller);
      },
    );
  };

  func ensureCollectionCanisterInstallCycles(
    childCanisterId : Principal
  ) : async () {
    switch (await collectionCanisterStatus(childCanisterId)) {
      case (?status) {
        let target = minimumInstallReadyCycles();
        if (status.cycles < target) {
          await topUpCollectionCanister(childCanisterId, target - status.cycles);
        };
      };
      case null {
        await topUpCollectionCanister(childCanisterId, installRetryTopUpCycles());
      };
    };
  };

  func normalizedCollectionCanisterCycles(requested : Nat) : Nat {
    let minimum = minimumCollectionCanisterCycles();
    if (requested < minimum) {
      minimum;
    } else {
      requested;
    };
  };

  func normalizedCollectionTopUpCycles(requested : Nat) : Nat {
    let minimum = minimumCollectionTopUpCycles();
    let maximum = maximumCollectionTopUpCycles();
    if (requested < minimum) {
      minimum;
    } else if (requested > maximum) {
      maximum;
    } else {
      requested;
    };
  };

  func canisterCreationFeeCycles() : Nat {
    500_000_000_000;
  };

  func collectionCreationChildTargetCycles(
    request : MintTypes.CollectionCreationRequest
  ) : Nat {
    let normalizedRequested = normalizedCollectionCanisterCycles(request.requestedCanisterCycles);
    let creationFee = canisterCreationFeeCycles();
    if (request.totalCyclesToConvert > creationFee) {
      let convertedTarget = Int.abs(Nat.toInt(request.totalCyclesToConvert) - Nat.toInt(creationFee));
      if (convertedTarget > normalizedRequested) {
        convertedTarget;
      } else {
        normalizedRequested;
      };
    } else {
      normalizedRequested;
    };
  };

  func collectionCreationCreateCallCycles(
    request : MintTypes.CollectionCreationRequest
  ) : Nat {
    collectionCreationChildTargetCycles(request) + canisterCreationFeeCycles();
  };

  func minimumFactoryOperatingReserveCycles() : Nat {
    100_000_000_000;
  };

  func minimumCollectionCanisterCycles() : Nat {
    2_000_000_000_000;
  };

  func minimumInstallReadyCycles() : Nat {
    1_250_000_000_000;
  };

  func installRetryTopUpCycles() : Nat {
    250_000_000_000;
  };

  func minimumCollectionTopUpCycles() : Nat {
    100_000_000_000;
  };

  func maximumCollectionTopUpCycles() : Nat {
    10_000_000_000_000;
  };

  func getCachedCmcRate() : ?IcpLib.IcpXdrConversionRate {
    switch (cachedCmcRate) {
      case (?rate) {
        let now = IcpLib.nowNat64();
        if (now >= cachedCmcRateFetchedAt and now - cachedCmcRateFetchedAt <= CMC_RATE_CACHE_TTL_NS) {
          ?rate;
        } else {
          null;
        };
      };
      case null null;
    };
  };

  func getCmcRate() : async IcpLib.IcpXdrConversionRate {
    switch (getCachedCmcRate()) {
      case (?rate) rate;
      case null {
        let cmc = actor (IcpLib.CYCLES_MINTING_CANISTER_ID) : IcpLib.CyclesMintingCanister;
        let rate = (await cmc.get_icp_xdr_conversion_rate()).data;
        cachedCmcRate := ?rate;
        cachedCmcRateFetchedAt := IcpLib.nowNat64();
        rate;
      };
    };
  };

  func splitAdminPayoutE8s(
    adminPayoutE8s : Nat64,
    secondaryBasisPoints : Nat,
  ) : {
    primary : Nat64;
    secondary : Nat64;
  } {
    let total = Nat64.toNat(adminPayoutE8s);
    let secondary = Nat64.fromNat((total * secondaryBasisPoints) / PAYOUT_BASIS_POINTS_TOTAL);
    {
      primary = adminPayoutE8s - secondary;
      secondary;
    };
  };

  func collectionCreationQuoteFor(
    canisterCycles : Nat,
    creationPriceE8s : Nat64,
    primaryPayoutBasisPoints : Nat,
    secondaryPayoutBasisPoints : Nat,
  ) : async MintTypes.CollectionCreationQuote {
    validateCollectionCreationPayoutShares(primaryPayoutBasisPoints, secondaryPayoutBasisPoints);
    let rate = await getCmcRate();
    let collectionCanisterCycles = normalizedCollectionCanisterCycles(canisterCycles);
    let factoryReserveCycles = canisterCreationFeeCycles();
    let totalCyclesToConvert = collectionCanisterCycles + factoryReserveCycles;
    let cycleCostE8s = IcpLib.cyclesToE8s(totalCyclesToConvert, rate.xdr_permyriad_per_icp);
    let adminPayoutE8s = if (creationPriceE8s > cycleCostE8s) {
      creationPriceE8s - cycleCostE8s;
    } else {
      0 : Nat64;
    };
    let payoutSplit = splitAdminPayoutE8s(adminPayoutE8s, secondaryPayoutBasisPoints);
    let adminPayoutTransferCount =
      (if (payoutSplit.primary > 0) 1 else 0) +
      (if (payoutSplit.secondary > 0) 1 else 0);
    let adminPayoutFeeE8s = Nat64.fromNat(adminPayoutTransferCount) * IcpLib.DEFAULT_FEE;
    {
      collectionCanisterCycles;
      factoryReserveCycles;
      totalCyclesToConvert;
      cycleCostE8s;
      minimumCreationPriceE8s = cycleCostE8s;
      collectionCreationPriceE8s = creationPriceE8s;
      adminPayoutE8s;
      adminPrimaryPayoutE8s = payoutSplit.primary;
      adminSecondaryPayoutE8s = payoutSplit.secondary;
      ledgerFeeE8s = IcpLib.DEFAULT_FEE;
      cycleTransferFeeE8s = IcpLib.DEFAULT_FEE;
      adminPayoutFeeE8s;
      totalUserDebitE8s = creationPriceE8s + IcpLib.DEFAULT_FEE + adminPayoutFeeE8s;
      xdrPermyriadPerIcp = rate.xdr_permyriad_per_icp;
      rateTimestampSeconds = rate.timestamp_seconds;
    };
  };

  func collectionCycleTopUpQuoteFor(
    cyclesToTopUp : Nat
  ) : async MintTypes.CollectionCycleTopUpQuote {
    let rate = await getCmcRate();
    let cycleCostE8s = IcpLib.cyclesToE8s(cyclesToTopUp, rate.xdr_permyriad_per_icp);
    {
      cyclesToTopUp;
      cycleCostE8s;
      ledgerFeeE8s = IcpLib.DEFAULT_FEE;
      totalUserDebitE8s = cycleCostE8s + IcpLib.DEFAULT_FEE;
      xdrPermyriadPerIcp = rate.xdr_permyriad_per_icp;
      rateTimestampSeconds = rate.timestamp_seconds;
    };
  };

  func transferErrorText(error : CommonTypes.TransferError) : Text {
    switch (error) {
      case (#InsufficientFunds({ balance })) {
        "insufficient ICP. Current balance: " # Nat64.toText(balance.e8s) # " e8s";
      };
      case (#BadFee({ expected_fee })) {
        "ledger rejected the fee. Expected fee: " # Nat64.toText(expected_fee.e8s) # " e8s";
      };
      case (#TxDuplicate({ duplicate_of })) {
        "duplicate payment detected at block " # Nat64.toText(duplicate_of);
      };
      case (#TxTooOld(_)) {
        "transaction is too old";
      };
      case (#TxCreatedInFuture) {
        "transaction was created in the future";
      };
    };
  };

  func notifyErrorText(error : IcpLib.NotifyError) : Text {
    switch (error) {
      case (#Refunded({ block_index; reason })) {
        let blockText = switch (block_index) {
          case null "";
          case (?value) " Refund block: " # Nat64.toText(value) # ".";
        };
        "CMC refunded the payment. " # reason # "." # blockText;
      };
      case (#Processing) {
        "CMC is still processing the payment. Do not submit another collection creation payment; contact the admin with this block.";
      };
      case (#TransactionTooOld(blockIndex)) {
        "CMC says the payment transaction is too old at block " # Nat64.toText(blockIndex);
      };
      case (#InvalidTransaction(message)) {
        "CMC rejected the transaction: " # message;
      };
      case (#Other({ error_code; error_message })) {
        "CMC error " # Nat64.toText(error_code) # ": " # error_message;
      };
    };
  };

  func notifyCreateErrorAllowsLegacyTopUpFallback(error : IcpLib.NotifyError) : Bool {
    switch (error) {
      case (#InvalidTransaction(message)) {
        let lower = Text.toLower(message);
        Text.contains(lower, #text "memo") or
        Text.contains(lower, #text "top") or
        Text.contains(lower, #text "processed") or
        Text.contains(lower, #text "duplicate") or
        Text.contains(lower, #text "already");
      };
      case (#Other({ error_message })) {
        let lower = Text.toLower(error_message);
        Text.contains(lower, #text "memo") or
        Text.contains(lower, #text "top") or
        Text.contains(lower, #text "processed") or
        Text.contains(lower, #text "duplicate") or
        Text.contains(lower, #text "already");
      };
      case (_) false;
    };
  };

  func notifyCreateCanisterWithRetries(
    cmc : IcpLib.CyclesMintingCanister,
    blockIndex : Nat64,
    owner : Principal,
  ) : async IcpLib.NotifyCreateCanisterResult {
    var attempts : Nat = 0;
    var lastResult : IcpLib.NotifyCreateCanisterResult = #Err(#Processing);
    while (attempts < 5) {
      let result = await cmc.notify_create_canister({
        block_index = blockIndex;
        controller = canisterId;
        subnet_type = null;
        subnet_selection = null;
        settings = ?collectionCanisterSettingsForCmc(owner);
      });
      switch (result) {
        case (#Err(#Processing)) {
          lastResult := result;
          attempts += 1;
        };
        case (_) return result;
      };
    };
    lastResult;
  };

  func notifyTopUpWithRetries(
    cmc : IcpLib.CyclesMintingCanister,
    blockIndex : Nat64,
    targetCanister : Principal,
  ) : async IcpLib.NotifyTopUpResult {
    var attempts : Nat = 0;
    var lastResult : IcpLib.NotifyTopUpResult = #Err(#Processing);
    while (attempts < 5) {
      let result = await cmc.notify_top_up({
        block_index = blockIndex;
        canister_id = targetCanister;
      });
      switch (result) {
        case (#Err(#Processing)) {
          lastResult := result;
          attempts += 1;
        };
        case (_) return result;
      };
    };
    lastResult;
  };

  func defaultAccount(owner : Principal) : NFTStandards.ICRC7Account {
    {
      owner;
      subaccount = null;
    };
  };

  func isDefaultSubaccount(subaccount : ?Blob) : Bool {
    switch (subaccount) {
      case null true;
      case (?bytes) {
        for (byte in Blob.toArray(bytes).values()) {
          if (byte != 0) {
            return false;
          };
        };
        true;
      };
    };
  };

  func mintCursorOrZero(cursor : ?Nat) : Nat {
    switch (cursor) {
      case null 0;
      case (?value) value;
    };
  };

  func normalizeCollectionCreationPageSize(limit : ?Nat) : Nat {
    switch (limit) {
      case null COLLECTION_CREATION_PAGE_DEFAULT;
      case (?requested) {
        if (requested > COLLECTION_CREATION_PAGE_MAX) {
          COLLECTION_CREATION_PAGE_MAX;
        } else {
          requested;
        };
      };
    };
  };

  func collectionCreationRequestPageFromViews(
    requests : [MintTypes.CollectionCreationRequestView],
    cursor : Nat,
    limit : Nat,
  ) : MintTypes.CollectionCreationRequestPage {
    let total = requests.size();
    if (cursor >= total or limit == 0) {
      return {
        requests = [];
        nextCursor = null;
        totalCount = total;
      };
    };

    var index = cursor;
    var page : [MintTypes.CollectionCreationRequestView] = [];
    while (index < total and page.size() < limit) {
      page := Array.concat<MintTypes.CollectionCreationRequestView>(page, [requests[index]]);
      index += 1;
    };

    {
      requests = page;
      nextCursor = if (index < total) { ?index } else { null };
      totalCount = total;
    };
  };

  func paginateTokenIds(tokenIds : [Nat], prev : ?Nat, take : ?Nat) : [Nat] {
    let limitedTake = normalizedTake(take);
    if (limitedTake == 0) {
      return [];
    };

    var page : [Nat] = [];
    for (tokenId in tokenIds.values()) {
      switch (prev) {
        case (?previous) {
          if (tokenId <= previous) {
            continue;
          };
        };
        case null {};
      };
      if (page.size() >= limitedTake) {
        return page;
      };
      page := Array.concat<Nat>(page, [tokenId]);
    };
    page;
  };

  func normalizedTake(take : ?Nat) : Nat {
    switch (take) {
      case null defaultTakeValue();
      case (?requested) {
        if (requested > maxTakeValue()) {
          maxTakeValue();
        } else {
          requested;
        };
      };
    };
  };

  func defaultTakeValue() : Nat {
    100;
  };

  func maxTakeValue() : Nat {
    100;
  };

  func maxQueryBatchSize() : Nat {
    100;
  };

  func maxUpdateBatchSize() : Nat {
    25;
  };

  func maxMemoSize() : Nat {
    256;
  };
};
