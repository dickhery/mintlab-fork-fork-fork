import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const marketplace = readFileSync(
  resolve(root, "src/backend/mixins/marketplace-api.mo"),
  "utf8",
);
const did = readFileSync(resolve(root, "src/backend/main.did"), "utf8");

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function section(start, end) {
  const startIndex = marketplace.indexOf(start);
  assert(startIndex >= 0, `Missing section start: ${start}`);
  const endIndex = marketplace.indexOf(end, startIndex + start.length);
  assert(endIndex >= 0, `Missing section end after ${start}: ${end}`);
  return marketplace.slice(startIndex, endIndex);
}

function assertIncludes(haystack, needle, label) {
  assert(haystack.includes(needle), `${label} does not cover ${needle}`);
}

assert(
  !marketplace.includes("persistFixedPurchaseSettlementAndTrap") &&
    !marketplace.includes("persistAuctionSettlementAndTrap") &&
    !marketplace.includes("persistPendingBidDepositAndTrap"),
  "Trap-based marketplace recovery helpers must not be reintroduced",
);

const fixed = section(
  "func continueFixedPurchaseSettlement",
  "/// Place a bid on an active auction listing",
);
for (const variant of [
  "#Err(#BadFee",
  "#Err(#TxDuplicate",
  "#Err(#InsufficientFunds",
  "#Err(#TxTooOld",
  "#Err(#TxCreatedInFuture",
]) {
  assertIncludes(fixed, variant, "fixed purchase settlement");
}
assertIncludes(
  fixed,
  "return persistFixedPurchaseSettlementErr",
  "fixed purchase settlement",
);
assertIncludes(fixed, "return #err(", "fixed purchase settlement");

const pendingBid = section(
  "func continuePendingBidDeposit",
  "/// Settle an auction after its end time",
);
for (const variant of [
  "#Err(#BadFee",
  "#Err(#TxDuplicate",
  "#Err(#InsufficientFunds",
  "#Err(#TxTooOld",
  "#Err(#TxCreatedInFuture",
]) {
  assertIncludes(pendingBid, variant, "pending bid deposit");
}
assertIncludes(
  pendingBid,
  "return persistPendingBidDepositErr",
  "pending bid deposit",
);
assertIncludes(pendingBid, "return #err(", "pending bid deposit");

const auction = section("func continueAuctionSettlement", "func resolveWinningEscrow");
for (const variant of ["#badFee", "#insufficientFunds", "#tooOld", "#createdInFuture"]) {
  assertIncludes(auction, variant, "auction settlement");
}
assertIncludes(auction, "return persistAuctionSettlementErr", "auction settlement");
assertIncludes(auction, "return #err(", "auction settlement");

const refund = section("func refundAuctionEscrow", "func prepareNFTForListing");
for (const variant of [
  "#Err(#BadFee",
  "#Err(#TxDuplicate",
  "#Err(#InsufficientFunds",
  "#Err(#TxTooOld",
  "#Err(#TxCreatedInFuture",
]) {
  assertIncludes(refund, variant, "auction refund retry");
}
assertIncludes(refund, "#err(", "auction refund retry");

const nftTransfer = section("func transferMintedNFTResult", "func ensureMintedNFTReady");
assertIncludes(nftTransfer, "catch (error)", "remote NFT transfer recovery");
assertIncludes(nftTransfer, "return #err(", "remote NFT transfer recovery");

for (const signature of [
  "type MarketplaceActionResult",
  "type MarketplaceBidResult",
  "buyFixedListing: (listingId: ListingId) -> (MarketplaceActionResult)",
  "cancelListing: (listingId: ListingId) -> (MarketplaceActionResult)",
  "placeBid: (listingId: ListingId, amount: nat64) -> (MarketplaceBidResult)",
  "retryAuctionRefund: (escrowId: nat) -> (MarketplaceActionResult)",
  "retryPendingBid: (listingId: ListingId) -> (MarketplaceBidResult)",
  "settleAuction: (listingId: ListingId) -> (MarketplaceActionResult)",
]) {
  assertIncludes(did, signature, "backend DID");
}

console.log("Marketplace recovery regression checks passed.");
