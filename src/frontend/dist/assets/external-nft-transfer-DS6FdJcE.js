import { j as jsxRuntimeExports, a as cn, A as Actor } from "./index-99MVlzyu.js";
import { r as resolveImageUrl } from "./media-JzcE7in6.js";
function getStandardLabel(standard) {
  if (standard.__kind__ === "EXT") return "EXT";
  if (standard.__kind__ === "DIP721") return "DIP-721";
  if (standard.__kind__ === "ICRC7") return "ICRC-7";
  return standard.Other ?? "Unknown";
}
function CollectionBadge({
  collection,
  size = "md",
  className
}) {
  const standardLabel = getStandardLabel(collection.standard);
  const imageUrl = resolveImageUrl(collection.imageUrl);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("flex items-center gap-1.5 min-w-0", className), children: [
    imageUrl && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "img",
      {
        src: imageUrl,
        alt: collection.name,
        className: cn(
          "rounded-full object-cover shrink-0 border border-border/60",
          size === "sm" ? "w-4 h-4" : "w-5 h-5"
        )
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "span",
      {
        className: cn(
          "font-medium truncate text-muted-foreground",
          size === "sm" ? "text-xs" : "text-sm"
        ),
        children: collection.name
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "span",
      {
        className: cn(
          "shrink-0 px-1.5 py-0.5 rounded font-mono bg-muted/60 text-muted-foreground border border-border/40",
          size === "sm" ? "text-[10px]" : "text-xs"
        ),
        children: standardLabel
      }
    )
  ] });
}
const ICP_DECIMALS = 100000000n;
function formatICP(e8s) {
  const whole = e8s / ICP_DECIMALS;
  const frac = e8s % ICP_DECIMALS;
  if (frac === 0n) return whole.toString();
  const fracStr = frac.toString().padStart(8, "0").replace(/0+$/, "");
  return `${whole}.${fracStr}`;
}
function PriceDisplay({
  e8s,
  size = "md",
  label,
  className
}) {
  const formatted = formatICP(e8s);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("flex flex-col gap-0.5", className), children: [
    label && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "span",
      {
        className: cn(
          "text-muted-foreground uppercase tracking-wider font-medium",
          size === "sm" ? "text-[10px]" : "text-xs"
        ),
        children: label
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "span",
      {
        className: cn(
          "bid-typography",
          size === "sm" && "text-sm",
          size === "md" && "text-base",
          size === "lg" && "text-2xl"
        ),
        children: [
          formatted,
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1 text-accent/70 font-mono font-semibold text-[0.75em]", children: "ICP" })
        ]
      }
    )
  ] });
}
const extIdlFactory = ({ IDL: idl }) => {
  const AccountUser = idl.Variant({
    principal: idl.Principal,
    address: idl.Text
  });
  const TransferRequest = idl.Record({
    to: AccountUser,
    token: idl.Text,
    notify: idl.Bool,
    from: AccountUser,
    memo: idl.Vec(idl.Nat8),
    subaccount: idl.Opt(idl.Vec(idl.Nat8)),
    amount: idl.Nat
  });
  const TransferError = idl.Variant({
    CannotNotify: idl.Text,
    InsufficientBalance: idl.Null,
    InvalidToken: idl.Text,
    Rejected: idl.Null,
    Unauthorized: idl.Text,
    Other: idl.Text
  });
  const TransferResponse = idl.Variant({
    ok: idl.Nat,
    err: TransferError
  });
  return idl.Service({
    ext_transfer: idl.Func([TransferRequest], [TransferResponse], []),
    transfer: idl.Func([TransferRequest], [TransferResponse], [])
  });
};
const dip721IdlFactory = ({ IDL: idl }) => {
  const Dip721Error = idl.Variant({
    Unauthorized: idl.Null,
    InvalidTokenId: idl.Null,
    ZeroAddress: idl.Null,
    Other: idl.Text,
    ExistedNFT: idl.Null,
    SelfTransfer: idl.Null,
    TokenNotFound: idl.Null,
    OwnerNotFound: idl.Null,
    OperatorNotFound: idl.Null,
    SelfApprove: idl.Null,
    UnauthorizedOwner: idl.Null,
    UnauthorizedOperator: idl.Null
  });
  const NatResult = idl.Variant({
    Ok: idl.Nat,
    Err: Dip721Error
  });
  return idl.Service({
    transfer: idl.Func([idl.Principal, idl.Nat], [NatResult], []),
    dip721_transfer: idl.Func([idl.Principal, idl.Nat], [NatResult], []),
    transferFromDip721: idl.Func(
      [idl.Principal, idl.Principal, idl.Nat],
      [NatResult],
      []
    )
  });
};
const icrc7IdlFactory = ({ IDL: idl }) => {
  const Account = idl.Record({
    owner: idl.Principal,
    subaccount: idl.Opt(idl.Vec(idl.Nat8))
  });
  const TransferArg = idl.Record({
    from_subaccount: idl.Opt(idl.Vec(idl.Nat8)),
    to: Account,
    token_id: idl.Nat,
    memo: idl.Opt(idl.Vec(idl.Nat8)),
    created_at_time: idl.Opt(idl.Nat64)
  });
  const TransferError = idl.Variant({
    NonExistingTokenId: idl.Null,
    InvalidRecipient: idl.Null,
    Unauthorized: idl.Null,
    TooOld: idl.Null,
    CreatedInFuture: idl.Record({ ledger_time: idl.Nat64 }),
    Duplicate: idl.Record({ duplicate_of: idl.Nat }),
    GenericError: idl.Record({
      error_code: idl.Nat,
      message: idl.Text
    }),
    GenericBatchError: idl.Record({
      error_code: idl.Nat,
      message: idl.Text
    })
  });
  const TransferResult = idl.Variant({
    Ok: idl.Nat,
    Err: TransferError
  });
  return idl.Service({
    icrc7_transfer: idl.Func(
      [idl.Vec(TransferArg)],
      [idl.Vec(idl.Opt(TransferResult))],
      []
    )
  });
};
async function transferRegisteredNFT({
  agent,
  collection,
  nft,
  owner,
  recipient
}) {
  if (nft.location !== "Registered") {
    throw new Error("Only registered external NFTs use direct wallet transfer");
  }
  if (collection.kind !== "External") {
    throw new Error("Only imported external collections use direct transfer");
  }
  if (nft.owner.toString() !== owner.toString()) {
    throw new Error("This NFT is registered under a different principal");
  }
  switch (collection.standard.__kind__) {
    case "EXT":
      await transferExtNFT(agent, collection, nft, owner, recipient);
      return "External NFT transferred successfully";
    case "DIP721":
      await transferDip721NFT(agent, collection, nft, owner, recipient);
      return "DIP721 NFT transferred successfully";
    case "ICRC7":
      await transferIcrc7NFT(agent, collection, nft, recipient);
      return "ICRC-7 NFT transferred successfully";
    case "Other":
      throw new Error(
        `Direct transfer is not supported for ${collection.standard.Other} collections yet`
      );
  }
}
async function transferExtNFT(agent, collection, nft, owner, recipient) {
  const actor = Actor.createActor(extIdlFactory, {
    agent,
    canisterId: collection.canisterId.toString()
  });
  const request = {
    from: { principal: owner },
    to: { principal: recipient },
    token: nft.tokenId,
    amount: 1n,
    memo: new Uint8Array(),
    notify: false,
    subaccount: []
  };
  let lastError = "EXT transfer method not available";
  for (const method of ["ext_transfer", "transfer"]) {
    try {
      const result = await actor[method](request);
      if ("ok" in result) {
        return;
      }
      lastError = `EXT transfer rejected: ${extTransferErrorToText(result.err)}`;
    } catch (error) {
      lastError = `Transfer call failed: ${errorMessage(error)}`;
    }
  }
  throw new Error(lastError);
}
async function transferDip721NFT(agent, collection, nft, owner, recipient) {
  const actor = Actor.createActor(dip721IdlFactory, {
    agent,
    canisterId: collection.canisterId.toString()
  });
  const tokenId = parseTokenNat(nft.tokenId, "DIP721");
  let lastError = "DIP721 transfer method not available";
  for (const transferCall of [
    () => actor.transfer(recipient, tokenId),
    () => actor.dip721_transfer(recipient, tokenId),
    () => actor.transferFromDip721(owner, recipient, tokenId)
  ]) {
    try {
      const result = await transferCall();
      if ("Ok" in result) {
        return;
      }
      lastError = `DIP721 transfer rejected: ${dip721ErrorToText(result.Err)}`;
    } catch (error) {
      lastError = `Transfer call failed: ${errorMessage(error)}`;
    }
  }
  throw new Error(lastError);
}
async function transferIcrc7NFT(agent, collection, nft, recipient) {
  const actor = Actor.createActor(icrc7IdlFactory, {
    agent,
    canisterId: collection.canisterId.toString()
  });
  const tokenId = parseTokenNat(nft.tokenId, "ICRC-7");
  const result = await actor.icrc7_transfer([
    {
      from_subaccount: [],
      to: {
        owner: recipient,
        subaccount: []
      },
      token_id: tokenId,
      memo: [],
      created_at_time: []
    }
  ]);
  if (result.length === 0 || result[0].length === 0) {
    throw new Error("ICRC-7 transfer was not processed");
  }
  const transferResult = result[0][0];
  if ("Err" in transferResult) {
    throw new Error(
      `ICRC-7 transfer rejected: ${icrc7TransferErrorToText(transferResult.Err)}`
    );
  }
}
function parseTokenNat(tokenId, standard) {
  try {
    const parsed = BigInt(tokenId);
    if (parsed < 0n) {
      throw new Error("negative token ID");
    }
    return parsed;
  } catch {
    throw new Error(`Invalid ${standard} token ID`);
  }
}
function errorMessage(error) {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}
function extTransferErrorToText(error) {
  if ("CannotNotify" in error) return "The recipient could not be notified";
  if ("InsufficientBalance" in error) return "Insufficient balance";
  if ("InvalidToken" in error) return `Invalid token: ${error.InvalidToken}`;
  if ("Rejected" in error)
    return "Transfer rejected by the collection canister";
  if ("Unauthorized" in error) return "Unauthorized";
  return error.Other;
}
function dip721ErrorToText(error) {
  if ("Unauthorized" in error) return "Unauthorized";
  if ("InvalidTokenId" in error) return "Invalid token ID";
  if ("ZeroAddress" in error) return "Cannot transfer to the zero address";
  if ("Other" in error) return error.Other;
  if ("ExistedNFT" in error) return "NFT already exists";
  if ("SelfTransfer" in error)
    return "Cannot transfer an NFT to the same owner";
  if ("TokenNotFound" in error) return "Token not found";
  if ("OwnerNotFound" in error) return "Owner not found";
  if ("OperatorNotFound" in error) return "Operator not found";
  if ("SelfApprove" in error) return "Cannot approve yourself";
  if ("UnauthorizedOwner" in error) return "Unauthorized owner";
  return "Unauthorized operator";
}
function icrc7TransferErrorToText(error) {
  if ("NonExistingTokenId" in error) return "Token does not exist";
  if ("InvalidRecipient" in error) return "Invalid recipient";
  if ("Unauthorized" in error) return "Unauthorized";
  if ("TooOld" in error) return "Transfer request is too old";
  if ("CreatedInFuture" in error) {
    return `Transfer timestamp is in the future relative to ledger time ${error.CreatedInFuture.ledger_time.toString()}`;
  }
  if ("Duplicate" in error) {
    return `Duplicate transfer detected at transaction ${error.Duplicate.duplicate_of.toString()}`;
  }
  if ("GenericError" in error) return error.GenericError.message;
  return error.GenericBatchError.message;
}
export {
  CollectionBadge as C,
  PriceDisplay as P,
  transferRegisteredNFT as t
};
