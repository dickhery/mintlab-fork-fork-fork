import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Types "../types/collections";

module {
  let NFT_AUTO_HIDE_REPORT_THRESHOLD : Nat = 4;

  public type CollectionsState = {
    collections : Map.Map<Types.CollectionId, Types.Collection>;
    var importMetas : ?Map.Map<Types.CollectionId, Types.CollectionImportMeta>;
    var importsByUser : ?Map.Map<Principal, [Types.CollectionId]>;
    var lastImportAtByUser : ?Map.Map<Principal, Int>;
    var nextId : Nat;
  };

  public type NFTReportRecord = {
    collectionId : Types.CollectionId;
    tokenId : Text;
    reporters : [Principal];
    status : Types.NFTReportStatus;
    createdAt : Int;
    lastReportedAt : ?Int;
    lastReportReason : ?Text;
    reviewedAt : ?Int;
    reviewedBy : ?Principal;
  };

  public type NFTModerationState = {
    reports : Map.Map<Text, NFTReportRecord>;
  };

  public func newState() : CollectionsState {
    {
      collections = Map.empty<Types.CollectionId, Types.Collection>();
      var importMetas = ?Map.empty<Types.CollectionId, Types.CollectionImportMeta>();
      var importsByUser = ?Map.empty<Principal, [Types.CollectionId]>();
      var lastImportAtByUser = ?Map.empty<Principal, Int>();
      var nextId = 1;
    };
  };

  public func newNFTModerationState() : NFTModerationState {
    {
      reports = Map.empty<Text, NFTReportRecord>();
    };
  };

  public func addCollection(
    state : CollectionsState,
    name : Text,
    description : Text,
    canisterId : Principal,
    standard : Types.NFTStandard,
    imageUrl : Text,
    symbol : Text,
    kind : Types.CollectionKind,
    browseInfo : ?Types.CollectionBrowseInfo,
    dividendConfig : ?Types.CollectionDividendConfig,
  ) : Types.Collection {
    let id = state.nextId;
    state.nextId += 1;
    let collection : Types.Collection = {
      id;
      name;
      description;
      canisterId;
      standard;
      imageUrl;
      symbol;
      kind;
      browseInfo;
      dividendConfig;
    };
    Map.add(state.collections, Nat.compare, id, collection);
    collection;
  };

  public func getCollections(state : CollectionsState) : [Types.Collection] {
    Iter.toArray(Map.values(state.collections));
  };

  public func getCollectionsPage(
    state : CollectionsState,
    cursor : ?Nat,
    limit : Nat,
    includeHidden : Bool,
  ) : Types.CollectionPage {
    let start = switch (cursor) {
      case (?value) value;
      case null 0;
    };
    let pageSize = normalizePageLimit(limit);
    var collections : [Types.Collection] = [];
    var index : Nat = 0;
    var added : Nat = 0;
    for ((_, collection) in Map.entries(state.collections)) {
      if (includeHidden or isPubliclyVisible(state, collection)) {
        if (index < start) {
          index += 1;
        } else if (added < pageSize) {
          collections := Array.concat<Types.Collection>(collections, [collection]);
          added += 1;
          index += 1;
        } else {
          index += 1;
        };
      };
    };
    let totalCount = index;
    let next = start + added;
    {
      collections;
      nextCursor = if (next < totalCount) ?next else null;
      totalCount;
    };
  };

  public func removeCollection(state : CollectionsState, id : Types.CollectionId) : Bool {
    switch (Map.get(state.collections, Nat.compare, id)) {
      case null false;
      case (?collection) {
        switch (collection.kind) {
          case (#Minted) false;
          case (#External) {
            Map.remove(state.collections, Nat.compare, id);
            true;
          };
        };
      };
    };
  };

  public func getCollection(state : CollectionsState, id : Types.CollectionId) : ?Types.Collection {
    Map.get(state.collections, Nat.compare, id);
  };

  func importMetas(state : CollectionsState) : Map.Map<Types.CollectionId, Types.CollectionImportMeta> {
    switch (state.importMetas) {
      case (?metas) metas;
      case null {
        let metas = Map.empty<Types.CollectionId, Types.CollectionImportMeta>();
        state.importMetas := ?metas;
        metas;
      };
    };
  };

  func importsByUser(state : CollectionsState) : Map.Map<Principal, [Types.CollectionId]> {
    switch (state.importsByUser) {
      case (?imports) imports;
      case null {
        let imports = Map.empty<Principal, [Types.CollectionId]>();
        state.importsByUser := ?imports;
        imports;
      };
    };
  };

  func lastImportAtByUser(state : CollectionsState) : Map.Map<Principal, Int> {
    switch (state.lastImportAtByUser) {
      case (?lastImports) lastImports;
      case null {
        let lastImports = Map.empty<Principal, Int>();
        state.lastImportAtByUser := ?lastImports;
        lastImports;
      };
    };
  };

  public func getImportMeta(
    state : CollectionsState,
    collectionId : Types.CollectionId,
  ) : ?Types.CollectionImportMeta {
    Map.get(importMetas(state), Nat.compare, collectionId);
  };

  public func getImportMetas(state : CollectionsState) : [Types.CollectionImportMeta] {
    Iter.toArray(Map.values(importMetas(state)));
  };

  public func getImportMetasPage(
    state : CollectionsState,
    cursor : ?Nat,
    limit : Nat,
  ) : Types.CollectionImportMetaPage {
    let start = switch (cursor) {
      case (?value) value;
      case null 0;
    };
    let pageSize = normalizePageLimit(limit);
    var metas : [Types.CollectionImportMeta] = [];
    var index : Nat = 0;
    var added : Nat = 0;
    for ((_, meta) in Map.entries(importMetas(state))) {
      if (index < start) {
        index += 1;
      } else if (added < pageSize) {
        metas := Array.concat<Types.CollectionImportMeta>(metas, [meta]);
        added += 1;
        index += 1;
      } else {
        index += 1;
      };
    };
    let next = start + added;
    {
      metas;
      nextCursor = if (next < index) ?next else null;
      totalCount = index;
    };
  };

  public func ensureImportMeta(
    state : CollectionsState,
    collectionId : Types.CollectionId,
    importedBy : Principal,
    trustStatus : Types.CollectionTrustStatus,
  ) : Types.CollectionImportMeta {
    let metas = importMetas(state);
    switch (Map.get(metas, Nat.compare, collectionId)) {
      case (?existing) existing;
      case null {
        let now = Time.now();
        let meta : Types.CollectionImportMeta = {
          collectionId;
          importedBy;
          trustStatus;
          reportCount = 0;
          createdAt = now;
          reviewedAt = null;
          lastReportedAt = null;
          lastReportReason = null;
        };
        Map.add(metas, Nat.compare, collectionId, meta);
        addImportForUser(state, importedBy, collectionId, now);
        meta;
      };
    };
  };

  public func noteImportAttempt(
    state : CollectionsState,
    importedBy : Principal,
    collectionId : Types.CollectionId,
  ) {
    addImportForUser(state, importedBy, collectionId, Time.now());
  };

  public func lastImportAt(
    state : CollectionsState,
    importedBy : Principal,
  ) : ?Int {
    Map.get(lastImportAtByUser(state), Principal.compare, importedBy);
  };

  public func recentImportCountForUser(
    state : CollectionsState,
    importedBy : Principal,
    since : Int,
  ) : Nat {
    let ids = switch (Map.get(importsByUser(state), Principal.compare, importedBy)) {
      case (?values) values;
      case null [];
    };
    var count : Nat = 0;
    for (collectionId in ids.values()) {
      switch (Map.get(importMetas(state), Nat.compare, collectionId)) {
        case (?meta) {
          if (meta.createdAt >= since) {
            count += 1;
          };
        };
        case null {};
      };
    };
    count;
  };

  public func visibleUnverifiedCollectionCount(state : CollectionsState) : Nat {
    var count : Nat = 0;
    for ((collectionId, collection) in Map.entries(state.collections)) {
      if (collection.kind == #External and isPubliclyVisible(state, collection)) {
        switch (Map.get(importMetas(state), Nat.compare, collectionId)) {
          case (?meta) {
            if (meta.trustStatus != #Verified) {
              count += 1;
            };
          };
          case null {
            count += 1;
          };
        };
      };
    };
    count;
  };

  public func setCollectionTrustStatus(
    state : CollectionsState,
    collectionId : Types.CollectionId,
    status : Types.CollectionTrustStatus,
  ) : ?Types.CollectionImportMeta {
    let metas = importMetas(state);
    let current = switch (Map.get(metas, Nat.compare, collectionId)) {
      case (?meta) meta;
      case null {
        switch (Map.get(state.collections, Nat.compare, collectionId)) {
          case null return null;
          case (?_) ensureImportMeta(state, collectionId, Principal.fromText("2vxsx-fae"), #CommunityImported);
        };
      };
    };
    let updated : Types.CollectionImportMeta = {
      current with
      trustStatus = status;
      reviewedAt = ?Time.now();
    };
    Map.add(metas, Nat.compare, collectionId, updated);
    ?updated;
  };

  public func reportCollection(
    state : CollectionsState,
    collectionId : Types.CollectionId,
    reason : Text,
  ) : ?Types.CollectionImportMeta {
    let metas = importMetas(state);
    let current = switch (Map.get(metas, Nat.compare, collectionId)) {
      case (?meta) meta;
      case null {
        switch (Map.get(state.collections, Nat.compare, collectionId)) {
          case null return null;
          case (?_) ensureImportMeta(state, collectionId, Principal.fromText("2vxsx-fae"), #CommunityImported);
        };
      };
    };
    let nextStatus = if (current.trustStatus == #Verified) {
      #Verified;
    } else {
      #Reported;
    };
    let updated : Types.CollectionImportMeta = {
      current with
      trustStatus = nextStatus;
      reportCount = current.reportCount + 1;
      lastReportedAt = ?Time.now();
      lastReportReason = ?reason;
    };
    Map.add(metas, Nat.compare, collectionId, updated);
    ?updated;
  };

  public func markCollectionReviewed(
    state : CollectionsState,
    collectionId : Types.CollectionId,
  ) : ?Types.CollectionImportMeta {
    let metas = importMetas(state);
    let current = switch (Map.get(metas, Nat.compare, collectionId)) {
      case (?meta) meta;
      case null {
        switch (Map.get(state.collections, Nat.compare, collectionId)) {
          case null return null;
          case (?_) ensureImportMeta(state, collectionId, Principal.fromText("2vxsx-fae"), #CommunityImported);
        };
      };
    };
    let updated : Types.CollectionImportMeta = {
      current with
      reviewedAt = ?Time.now();
    };
    Map.add(metas, Nat.compare, collectionId, updated);
    ?updated;
  };

  public func collectionAllowsSync(
    state : CollectionsState,
    collection : Types.Collection,
  ) : Bool {
    switch (Map.get(importMetas(state), Nat.compare, collection.id)) {
      case (?meta) meta.trustStatus != #Blocked and meta.trustStatus != #SyncDisabled;
      case null true;
    };
  };

  public func isPubliclyVisible(
    state : CollectionsState,
    collection : Types.Collection,
  ) : Bool {
    switch (Map.get(importMetas(state), Nat.compare, collection.id)) {
      case (?meta) meta.trustStatus != #Hidden and meta.trustStatus != #Blocked;
      case null true;
    };
  };

  public func canViewerSeeCollection(
    state : CollectionsState,
    collection : Types.Collection,
    viewer : Principal,
    viewerIsAdmin : Bool,
  ) : Bool {
    switch (Map.get(importMetas(state), Nat.compare, collection.id)) {
      case (?meta) {
        if (meta.trustStatus == #Hidden or meta.trustStatus == #Blocked) {
          viewerIsAdmin or Principal.equal(meta.importedBy, viewer);
        } else {
          true;
        };
      };
      case null true;
    };
  };

  public func isMintlabVerified(
    state : CollectionsState,
    collection : Types.Collection,
  ) : Bool {
    switch (collection.kind) {
      case (#Minted) true;
      case (#External) {
        switch (Map.get(importMetas(state), Nat.compare, collection.id)) {
          case (?meta) meta.trustStatus == #Verified;
          case null false;
        };
      };
    };
  };

  public func isMarketplaceAllowed(
    state : CollectionsState,
    collection : Types.Collection,
  ) : Bool {
    switch (Map.get(importMetas(state), Nat.compare, collection.id)) {
      case (?meta) meta.trustStatus != #Hidden and meta.trustStatus != #Blocked;
      case null true;
    };
  };

  public func getNFTReportMeta(
    state : NFTModerationState,
    collectionId : Types.CollectionId,
    tokenId : Text,
  ) : ?Types.NFTReportMeta {
    switch (Map.get(state.reports, Text.compare, nftReportKey(collectionId, tokenId))) {
      case (?record) ?toNFTReportMeta(record);
      case null null;
    };
  };

  public func getNFTReportMetasPage(
    state : NFTModerationState,
    cursor : ?Nat,
    limit : Nat,
  ) : Types.NFTReportMetaPage {
    let start = switch (cursor) {
      case (?value) value;
      case null 0;
    };
    let pageSize = normalizePageLimit(limit);
    var reports : [Types.NFTReportMeta] = [];
    var index : Nat = 0;
    var added : Nat = 0;
    for ((_, record) in Map.entries(state.reports)) {
      if (index < start) {
        index += 1;
      } else if (added < pageSize) {
        reports := Array.concat<Types.NFTReportMeta>(reports, [toNFTReportMeta(record)]);
        added += 1;
        index += 1;
      } else {
        index += 1;
      };
    };
    let next = start + added;
    {
      reports;
      nextCursor = if (next < index) ?next else null;
      totalCount = index;
    };
  };

  public func reportNFT(
    state : NFTModerationState,
    collectionId : Types.CollectionId,
    tokenId : Text,
    reporter : Principal,
    reason : Text,
  ) : Types.NFTReportMeta {
    let key = nftReportKey(collectionId, tokenId);
    let now = Time.now();
    let updated = switch (Map.get(state.reports, Text.compare, key)) {
      case (?current) {
        if (
          current.status == #Approved or
          current.status == #AutoHidden or
          current.status == #Hidden
        ) {
          current;
        } else if (containsPrincipal(current.reporters, reporter)) {
          current;
        } else {
          let reporters = Array.concat<Principal>(current.reporters, [reporter]);
          {
            current with
            reporters;
            status = if (reporters.size() >= NFT_AUTO_HIDE_REPORT_THRESHOLD) #AutoHidden else current.status;
            lastReportedAt = ?now;
            lastReportReason = ?reason;
          };
        };
      };
      case null {
        {
          collectionId;
          tokenId;
          reporters = [reporter];
          status = #Open;
          createdAt = now;
          lastReportedAt = ?now;
          lastReportReason = ?reason;
          reviewedAt = null;
          reviewedBy = null;
        };
      };
    };
    Map.add(state.reports, Text.compare, key, updated);
    toNFTReportMeta(updated);
  };

  public func setNFTReportStatus(
    state : NFTModerationState,
    collectionId : Types.CollectionId,
    tokenId : Text,
    status : Types.NFTReportStatus,
    reviewer : Principal,
  ) : ?Types.NFTReportMeta {
    let key = nftReportKey(collectionId, tokenId);
    let current = switch (Map.get(state.reports, Text.compare, key)) {
      case (?record) record;
      case null return null;
    };
    let updated : NFTReportRecord = {
      current with
      status;
      reviewedAt = ?Time.now();
      reviewedBy = ?reviewer;
    };
    Map.add(state.reports, Text.compare, key, updated);
    ?toNFTReportMeta(updated);
  };

  public func isNFTPubliclyVisible(
    state : NFTModerationState,
    collectionId : Types.CollectionId,
    tokenId : Text,
  ) : Bool {
    switch (Map.get(state.reports, Text.compare, nftReportKey(collectionId, tokenId))) {
      case (?record) record.status != #AutoHidden and record.status != #Hidden;
      case null true;
    };
  };

  public func canViewerSeeNFT(
    state : NFTModerationState,
    nft : { collectionId : Types.CollectionId; tokenId : Text; owner : Principal },
    viewer : Principal,
    viewerIsAdmin : Bool,
  ) : Bool {
    isNFTPubliclyVisible(state, nft.collectionId, nft.tokenId) or
    viewerIsAdmin or
    Principal.equal(nft.owner, viewer);
  };

  public func hiddenNFTCountForCollection(
    state : NFTModerationState,
    collectionId : Types.CollectionId,
  ) : Nat {
    var count : Nat = 0;
    for ((_, record) in Map.entries(state.reports)) {
      if (
        record.collectionId == collectionId and
        (record.status == #AutoHidden or record.status == #Hidden)
      ) {
        count += 1;
      };
    };
    count;
  };

  public func visibleNFTTotal(
    state : NFTModerationState,
    collectionId : Types.CollectionId,
    totalCount : Nat,
  ) : Nat {
    let hiddenCount = hiddenNFTCountForCollection(state, collectionId);
    if (hiddenCount >= totalCount) 0 else totalCount - hiddenCount;
  };

  public func findExternalCollectionByCanister(
    state : CollectionsState,
    canisterId : Principal,
    standard : Types.NFTStandard,
  ) : ?Types.Collection {
    for (collection in Map.values(state.collections)) {
      if (
        collection.kind == #External and
        Principal.equal(collection.canisterId, canisterId) and
        collection.standard == standard
      ) {
        return ?collection;
      };
    };
    null;
  };

  func addImportForUser(
    state : CollectionsState,
    importedBy : Principal,
    collectionId : Types.CollectionId,
    now : Int,
  ) {
    let imports = importsByUser(state);
    let existing = switch (Map.get(imports, Principal.compare, importedBy)) {
      case (?values) values;
      case null [];
    };
    Map.add(
      imports,
      Principal.compare,
      importedBy,
      appendUniqueNat(existing, collectionId),
    );
    Map.add(lastImportAtByUser(state), Principal.compare, importedBy, now);
  };

  func appendUniqueNat(values : [Nat], value : Nat) : [Nat] {
    for (existing in values.values()) {
      if (existing == value) {
        return values;
      };
    };
    Array.concat<Nat>(values, [value]);
  };

  func containsPrincipal(values : [Principal], value : Principal) : Bool {
    for (existing in values.values()) {
      if (Principal.equal(existing, value)) {
        return true;
      };
    };
    false;
  };

  func nftReportKey(collectionId : Types.CollectionId, tokenId : Text) : Text {
    Nat.toText(collectionId) # ":" # tokenId;
  };

  func toNFTReportMeta(record : NFTReportRecord) : Types.NFTReportMeta {
    {
      collectionId = record.collectionId;
      tokenId = record.tokenId;
      status = record.status;
      reportCount = record.reporters.size();
      createdAt = record.createdAt;
      lastReportedAt = record.lastReportedAt;
      lastReportReason = record.lastReportReason;
      reviewedAt = record.reviewedAt;
      reviewedBy = record.reviewedBy;
    };
  };

  public func findCollectionByCanister(
    state : CollectionsState,
    canisterId : Principal,
  ) : ?Types.Collection {
    for (collection in Map.values(state.collections)) {
      if (Principal.equal(collection.canisterId, canisterId)) {
        return ?collection;
      };
    };
    null;
  };

  public func updateCollection(
    state : CollectionsState,
    id : Types.CollectionId,
    name : Text,
    description : Text,
    canisterId : Principal,
    standard : Types.NFTStandard,
    imageUrl : Text,
    symbol : Text,
    browseInfo : ?Types.CollectionBrowseInfo,
    dividendConfig : ?Types.CollectionDividendConfig,
  ) : ?Types.Collection {
    switch (Map.get(state.collections, Nat.compare, id)) {
      case null null;
      case (?existing) {
        let updated : Types.Collection = {
          id = existing.id;
          name;
          description;
          canisterId;
          standard;
          imageUrl;
          symbol;
          kind = existing.kind;
          browseInfo;
          dividendConfig;
        };
        Map.add(state.collections, Nat.compare, id, updated);
        ?updated;
      };
    };
  };

  func normalizePageLimit(limit : Nat) : Nat {
    if (limit == 0) {
      25;
    } else if (limit > 100) {
      100;
    } else {
      limit;
    };
  };
};
