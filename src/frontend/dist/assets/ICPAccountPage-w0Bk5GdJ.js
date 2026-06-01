import { c as createLucideIcon, g as useAuth, h as useBackend, k as useQueryClient, r as reactExports, l as useQuery, j as jsxRuntimeExports, W as Wallet, B as Button, L as LogIn, T as TermsAgreementNotice, n as ue } from "./index-Cn7DexRX.js";
import { H as HelpCallout } from "./HelpCallout-tGan5vTA.js";
import { B as Badge } from "./badge-DdyoADYm.js";
import { C as Card, a as CardHeader, b as CardTitle, c as CardContent, S as Skeleton } from "./skeleton-CHYC1TAt.js";
import { a as useMutation, R as RefreshCw, L as Label, D as Dialog, b as DialogContent, c as DialogHeader, d as DialogTitle, e as DialogDescription, f as DialogFooter } from "./index-tdtoTYoj.js";
import { I as Input } from "./input-BAqaZ7H-.js";
import { p as parseICPToE8s, I as ICP_E8S } from "./icp-BXjZNIYq.js";
import { a as ArrowDownLeft, H as History, S as Send, A as ArrowUpRight } from "./send-C_fE0RDS.js";
import { C as CircleAlert } from "./circle-alert-Bvz1FMTS.js";
import { C as CircleCheck } from "./circle-check-D4lQ7VHe.js";
import { C as Copy } from "./copy-BaIne-Db.js";
import "./arrow-right-CAc8jCoL.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [["path", { d: "M5 12h14", key: "1ays0h" }]];
const Minus = createLucideIcon("minus", __iconNode);
const TRANSFER_FEE = 10000n;
const MAX_NAT64 = 18446744073709551615n;
function formatICP(e8s) {
  const whole = e8s / ICP_E8S;
  const frac = e8s % ICP_E8S;
  const fracStr = frac.toString().padStart(8, "0");
  return `${whole}.${fracStr}`;
}
function accountIdToHex(bytes) {
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
}
function hexToAccountId(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = Number.parseInt(hex.slice(i, i + 2), 16);
  }
  return bytes;
}
function createWithdrawalNonce() {
  const cryptoApi = globalThis.crypto;
  if (cryptoApi == null ? void 0 : cryptoApi.getRandomValues) {
    const bytes = new Uint8Array(8);
    cryptoApi.getRandomValues(bytes);
    let value = 0n;
    for (const byte of bytes) {
      value = (value << 8n) + BigInt(byte);
    }
    return value === 0n ? 1n : value;
  }
  return BigInt(Date.now()) * 1000000n + BigInt(Math.floor(Math.random() * 1e6));
}
function parseMemoToNat64(value) {
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (!/^\d+$/.test(trimmed)) return null;
  const parsed = BigInt(trimmed);
  return parsed <= MAX_NAT64 ? parsed : null;
}
function formatTransferError(result) {
  if (result.__kind__ === "Ok") return "";
  const err = result.Err;
  switch (err.__kind__) {
    case "InsufficientFunds":
      return `Insufficient funds. Balance: ${formatICP(err.InsufficientFunds.balance.e8s)} ICP`;
    case "BadFee":
      return `Bad fee. Expected: ${formatICP(err.BadFee.expected_fee.e8s)} ICP`;
    case "TxDuplicate":
      return `Duplicate transaction (block ${err.TxDuplicate.duplicate_of})`;
    case "TxTooOld":
      return "Transaction too old";
    case "TxCreatedInFuture":
      return "Transaction created in future";
    default:
      return "Transfer failed";
  }
}
function formatTransactionTime(timestampNanos) {
  const date = new Date(Number(timestampNanos / 1000000n));
  return new Intl.DateTimeFormat(void 0, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(date);
}
function transactionAmountLabel(tx) {
  if (tx.amountE8s === null) return "";
  const prefix = tx.direction === "In" ? "+" : tx.direction === "Out" ? "-" : "";
  return `${prefix}${formatICP(tx.amountE8s)} ICP`;
}
function transactionIcon(tx) {
  if (tx.direction === "In") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDownLeft, { className: "h-4 w-4 text-emerald-500" });
  }
  if (tx.direction === "Out") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { className: "h-4 w-4 text-amber-500" });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { className: "h-4 w-4 text-muted-foreground" });
}
function statusTone(status) {
  if (status === "Completed") {
    return "border-emerald-500/30 bg-emerald-500/10 text-emerald-500";
  }
  if (status === "Failed") {
    return "border-destructive/30 bg-destructive/10 text-destructive";
  }
  return "border-amber-500/30 bg-amber-500/10 text-amber-500";
}
function RecentTransactionRow({ tx }) {
  const amount = transactionAmountLabel(tx);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 py-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border/60 bg-muted/40", children: transactionIcon(tx) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-sm font-medium text-foreground", children: tx.title }),
        tx.status !== "Completed" && /* @__PURE__ */ jsxRuntimeExports.jsx(
          Badge,
          {
            variant: "outline",
            className: `shrink-0 px-1.5 py-0 text-[10px] ${statusTone(tx.status)}`,
            children: tx.status
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-xs text-muted-foreground", children: tx.detail }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-[11px] text-muted-foreground", children: [
        formatTransactionTime(tx.occurredAt),
        tx.blockIndex !== null && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono", children: [
          " block ",
          tx.blockIndex.toString()
        ] })
      ] })
    ] }),
    amount && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "shrink-0 text-right", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "p",
        {
          className: `font-mono text-sm font-semibold ${tx.direction === "In" ? "text-emerald-500" : tx.direction === "Out" ? "text-foreground" : "text-muted-foreground"}`,
          children: amount
        }
      ),
      tx.feeE8s !== null && tx.feeE8s > 0n && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-[11px] text-muted-foreground", children: [
        "fee ",
        formatICP(tx.feeE8s)
      ] })
    ] })
  ] });
}
function CopyField({
  label,
  value,
  ocid,
  note
}) {
  const [copied, setCopied] = reactExports.useState(false);
  const handleCopy = reactExports.useCallback(() => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2e3);
    });
  }, [value]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-muted-foreground text-xs uppercase tracking-wider", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "flex-1 font-mono text-xs bg-muted/60 border border-border/50 rounded-md px-3 py-2.5 text-foreground truncate min-w-0 select-all", children: value }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          size: "icon",
          variant: "outline",
          className: "shrink-0 border-border/50 hover:border-primary/60 hover:bg-primary/10 transition-colors duration-200",
          onClick: handleCopy,
          "aria-label": `Copy ${label}`,
          "data-ocid": ocid,
          children: copied ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3.5 w-3.5 text-accent" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "h-3.5 w-3.5" })
        }
      )
    ] }),
    note && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground pl-1", children: note })
  ] });
}
function ICPAccountPage() {
  var _a;
  const { isAuthenticated, login, principalText } = useAuth();
  const { actor, isFetching } = useBackend();
  const queryClient = useQueryClient();
  const [recipient, setRecipient] = reactExports.useState("");
  const [amount, setAmount] = reactExports.useState("");
  const [memo, setMemo] = reactExports.useState("");
  const [withdrawalNonce, setWithdrawalNonce] = reactExports.useState(null);
  const [confirmOpen, setConfirmOpen] = reactExports.useState(false);
  const recipientError = recipient.length > 0 && !/^[0-9a-fA-F]{64}$/.test(recipient) ? "Must be a 64-character hex string" : null;
  const parsedAmountE8s = parseICPToE8s(amount);
  const parsedMemo = parseMemoToNat64(memo);
  const amountE8s = parsedAmountE8s ?? 0n;
  const totalDebitE8s = amountE8s + TRANSFER_FEE;
  const {
    data: balanceE8s,
    isLoading: balanceLoading,
    refetch: refetchBalance,
    isRefetching
  } = useQuery({
    queryKey: ["icp-balance"],
    queryFn: async () => {
      if (!actor) return 0n;
      return actor.getUserICPBalance();
    },
    enabled: !!actor && !isFetching && isAuthenticated,
    refetchInterval: 3e4
  });
  const { data: accountIdBytes, isLoading: accountIdLoading } = useQuery({
    queryKey: ["account-id"],
    queryFn: async () => {
      if (!actor) return new Uint8Array(0);
      return actor.getUserAccountId();
    },
    enabled: !!actor && !isFetching && isAuthenticated
  });
  const { data: recentTransactions = [], isLoading: transactionsLoading } = useQuery({
    queryKey: ["recent-transactions", principalText],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyRecentTransactions(10n);
    },
    enabled: !!actor && !isFetching && isAuthenticated,
    refetchInterval: 3e4
  });
  const accountIdHex = accountIdBytes ? accountIdToHex(accountIdBytes) : null;
  const balanceNum = balanceE8s ?? 0n;
  const hasAmount = amount.trim().length > 0;
  const amountInvalid = hasAmount && parsedAmountE8s === null;
  const memoInvalid = memo.trim().length > 0 && parsedMemo === null;
  const amountTooSmall = amountE8s > 0n && amountE8s <= TRANSFER_FEE;
  const amountExceedsBalance = amountE8s > 0n && totalDebitE8s > balanceNum;
  const formValid = /^[0-9a-fA-F]{64}$/.test(recipient) && amountE8s > TRANSFER_FEE && !amountExceedsBalance && !memoInvalid;
  const transferMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected to backend");
      const to = hexToAccountId(recipient);
      const clientNonce = withdrawalNonce ?? parsedMemo ?? createWithdrawalNonce();
      if (withdrawalNonce === null) {
        setWithdrawalNonce(clientNonce);
      }
      const result = await actor.transferICPOutWithClientNonce(
        to,
        amountE8s,
        clientNonce
      );
      return result;
    },
    onSuccess: (result) => {
      setConfirmOpen(false);
      if (result.__kind__ === "Ok") {
        ue.success("Transfer successful!", {
          description: `Transaction confirmed at block ${result.Ok}`,
          duration: 6e3
        });
        setRecipient("");
        setAmount("");
        setMemo("");
        setWithdrawalNonce(null);
        queryClient.invalidateQueries({ queryKey: ["icp-balance"] });
        queryClient.invalidateQueries({ queryKey: ["recent-transactions"] });
      } else {
        ue.error("Transfer failed", {
          description: formatTransferError(result),
          duration: 8e3
        });
      }
    },
    onError: (err) => {
      setConfirmOpen(false);
      ue.error("Transfer error", {
        description: err.message ?? "Unknown error",
        duration: 8e3
      });
    }
  });
  if (!isAuthenticated) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex-1 flex flex-col items-center justify-center min-h-[70vh] gap-6 px-4",
        "data-ocid": "icp-account.page",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl bg-card border border-border/50 shadow-lg p-10 flex flex-col items-center gap-5 max-w-sm w-full", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-full bg-primary/15 border border-primary/30 p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "h-8 w-8 text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-display font-semibold text-foreground", children: "Connect to view your ICP account" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground leading-relaxed", children: "Authenticate with Internet Identity to view your balance, account address, and transfer ICP." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              className: "w-full gap-2",
              onClick: login,
              "data-ocid": "icp-account.login_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LogIn, { className: "h-4 w-4" }),
                "Sign in with Internet Identity"
              ]
            }
          )
        ] })
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex-1 flex flex-col gap-6 px-4 py-8 max-w-2xl mx-auto w-full",
      "data-ocid": "icp-account.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-display font-bold text-foreground", children: "ICP Account" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "View your balance and transfer ICP to any address" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          HelpCallout,
          {
            title: "Your in-app balance funds Mintlab actions",
            sectionId: "icp-account",
            actionLabel: "ICP guide",
            ocid: "icp-account.help_callout",
            children: "Use the Account Identifier below to receive ICP. This balance pays for minting, collection creation, marketplace buys, auction bids, and cycle top-ups."
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Card,
          {
            className: "relative border-primary/20 bg-card shadow-lg overflow-hidden",
            "data-ocid": "icp-account.balance_card",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 pointer-events-none rounded-xl bg-gradient-to-br from-primary/8 via-transparent to-accent/5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3 relative", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center justify-between text-sm font-medium text-muted-foreground uppercase tracking-wider", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDownLeft, { className: "h-4 w-4 text-primary" }),
                  "Available Balance"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    size: "sm",
                    variant: "ghost",
                    className: "h-7 gap-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/60",
                    onClick: () => refetchBalance(),
                    disabled: isRefetching || balanceLoading,
                    "data-ocid": "icp-account.refresh_button",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        RefreshCw,
                        {
                          className: `h-3 w-3 ${isRefetching ? "animate-spin" : ""}`
                        }
                      ),
                      "Refresh"
                    ]
                  }
                )
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "relative pb-6", children: balanceLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "space-y-2",
                  "data-ocid": "icp-account.balance_loading_state",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-56" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-32" })
                  ]
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-4xl font-bold text-primary tabular-nums tracking-tight", children: formatICP(balanceNum) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Badge,
                    {
                      variant: "secondary",
                      className: "bg-primary/15 text-primary border-primary/30 text-xs font-mono",
                      children: "ICP"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-2 font-mono", children: [
                  balanceNum.toString(),
                  " e8s"
                ] })
              ] }) })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Card,
          {
            className: "border-border/50 bg-card shadow-sm",
            "data-ocid": "icp-account.identity_card",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-medium text-muted-foreground uppercase tracking-wider", children: "Your Addresses" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-5", children: [
                accountIdLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-40" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full" })
                ] }) : accountIdHex && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  CopyField,
                  {
                    label: "Account Identifier (ICP Ledger)",
                    value: accountIdHex,
                    ocid: "icp-account.account_id_copy_button",
                    note: "📨 Send ICP to this address to top up your wallet"
                  }
                ),
                principalText && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  CopyField,
                  {
                    label: "Principal ID",
                    value: principalText,
                    ocid: "icp-account.principal_id_copy_button"
                  }
                )
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Card,
          {
            className: "border-border/50 bg-card shadow-sm",
            "data-ocid": "icp-account.recent_transactions_card",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center justify-between text-sm font-medium text-muted-foreground uppercase tracking-wider", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(History, { className: "h-4 w-4 text-accent" }),
                  "Recent Transactions"
                ] }),
                recentTransactions.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "font-mono text-[10px]", children: [
                  recentTransactions.length,
                  "/10"
                ] })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: transactionsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "space-y-3",
                  "data-ocid": "icp-account.transactions_loading_state",
                  children: [0, 1, 2].map((row) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-9 w-9 rounded-md" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1 space-y-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-36" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-52 max-w-full" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-20" })
                  ] }, row))
                }
              ) : recentTransactions.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex flex-col items-center gap-2 py-6 text-center text-sm text-muted-foreground",
                  "data-ocid": "icp-account.transactions_empty_state",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(History, { className: "h-5 w-5" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "No recent transactions yet." })
                  ]
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-ocid": "icp-account.transactions_list", children: recentTransactions.map((tx, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: index > 0 ? "border-t border-border/50" : "",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(RecentTransactionRow, { tx })
                },
                tx.id.toString()
              )) }) })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Card,
          {
            className: "border-border/50 bg-card shadow-sm",
            "data-ocid": "icp-account.transfer_card",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-4 w-4 text-accent" }),
                "Transfer ICP Out"
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Label,
                    {
                      htmlFor: "recipient",
                      className: "text-sm font-medium text-foreground",
                      children: "Recipient Account ID"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      id: "recipient",
                      placeholder: "64-character hex account identifier…",
                      value: recipient,
                      onChange: (e) => {
                        setRecipient(e.target.value.trim());
                        setWithdrawalNonce(null);
                      },
                      className: "font-mono text-xs bg-muted/30 border-border/60 focus:border-primary/60 placeholder:text-muted-foreground/50",
                      "data-ocid": "icp-account.recipient_input"
                    }
                  ),
                  recipientError && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "p",
                    {
                      className: "text-xs text-destructive flex items-center gap-1.5",
                      "data-ocid": "icp-account.recipient_field_error",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-3 w-3 shrink-0" }),
                        recipientError
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Label,
                    {
                      htmlFor: "amount",
                      className: "text-sm font-medium text-foreground",
                      children: "Amount (ICP)"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        id: "amount",
                        type: "number",
                        placeholder: "0.00000000",
                        min: "0",
                        step: "0.00000001",
                        value: amount,
                        onChange: (e) => {
                          setAmount(e.target.value);
                          setWithdrawalNonce(null);
                        },
                        className: "font-mono pr-14 bg-muted/30 border-border/60 focus:border-primary/60 placeholder:text-muted-foreground/50",
                        "data-ocid": "icp-account.amount_input"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-muted-foreground pointer-events-none", children: "ICP" })
                  ] }),
                  amountExceedsBalance && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "p",
                    {
                      className: "text-xs text-destructive flex items-center gap-1.5",
                      "data-ocid": "icp-account.amount_field_error",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-3 w-3 shrink-0" }),
                        "Exceeds balance (",
                        formatICP(balanceNum),
                        " ICP available)"
                      ]
                    }
                  ),
                  amountInvalid && !amountExceedsBalance && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "p",
                    {
                      className: "text-xs text-destructive flex items-center gap-1.5",
                      "data-ocid": "icp-account.amount_field_error",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-3 w-3 shrink-0" }),
                        "Enter a valid ICP amount with up to 8 decimals"
                      ]
                    }
                  ),
                  amountTooSmall && !amountExceedsBalance && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "p",
                    {
                      className: "text-xs text-destructive flex items-center gap-1.5",
                      "data-ocid": "icp-account.amount_field_error",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-3 w-3 shrink-0" }),
                        "Amount must exceed the network fee"
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                    "Network fee: ",
                    formatICP(TRANSFER_FEE),
                    " ICP (deducted from your balance)"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Label,
                    {
                      htmlFor: "memo",
                      className: "text-sm font-medium text-foreground",
                      children: [
                        "Memo",
                        " ",
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-normal text-xs", children: "(optional)" })
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      id: "memo",
                      type: "number",
                      placeholder: "Numeric memo e.g. 12345",
                      min: "0",
                      value: memo,
                      onChange: (e) => {
                        setMemo(e.target.value);
                        setWithdrawalNonce(null);
                      },
                      className: "font-mono bg-muted/30 border-border/60 focus:border-primary/60 placeholder:text-muted-foreground/50",
                      "data-ocid": "icp-account.memo_input"
                    }
                  ),
                  memoInvalid && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "p",
                    {
                      className: "text-xs text-destructive flex items-center gap-1.5",
                      "data-ocid": "icp-account.memo_field_error",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-3 w-3 shrink-0" }),
                        "Memo must be a non-negative 64-bit integer"
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    className: "w-full gap-2 font-medium",
                    disabled: !formValid || transferMutation.isPending,
                    onClick: () => {
                      setWithdrawalNonce(
                        (current) => current ?? parsedMemo ?? createWithdrawalNonce()
                      );
                      setConfirmOpen(true);
                    },
                    "data-ocid": "icp-account.transfer_submit_button",
                    children: [
                      transferMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-4 w-4" }),
                      transferMutation.isPending ? "Sending…" : "Transfer ICP"
                    ]
                  }
                ),
                transferMutation.isSuccess && transferMutation.data.__kind__ === "Ok" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "flex items-center gap-2 rounded-lg bg-green-500/10 border border-green-500/30 px-3 py-2.5 text-sm text-green-400",
                    "data-ocid": "icp-account.success_state",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 shrink-0" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                        "Transfer confirmed — block",
                        " ",
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono font-semibold", children: transferMutation.data.Ok.toString() })
                      ] })
                    ]
                  }
                ),
                transferMutation.isError && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "flex items-center gap-2 rounded-lg bg-destructive/10 border border-destructive/30 px-3 py-2.5 text-sm text-destructive",
                    "data-ocid": "icp-account.error_state",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4 shrink-0" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: ((_a = transferMutation.error) == null ? void 0 : _a.message) ?? "Unknown error" })
                    ]
                  }
                )
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: confirmOpen, onOpenChange: setConfirmOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          DialogContent,
          {
            className: "bg-card border-border/60 shadow-2xl max-w-sm",
            "data-ocid": "icp-account.dialog",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display text-lg text-foreground", children: "Confirm Transfer" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { className: "text-muted-foreground text-sm", children: "Review the details carefully before confirming." })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 rounded-lg bg-muted/40 border border-border/40 p-4 text-sm", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-start gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground shrink-0", children: "To" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "font-mono text-xs text-foreground text-right break-all leading-relaxed", children: recipient })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px bg-border/50" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "You send" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono font-semibold text-primary", children: [
                    formatICP(amountE8s),
                    " ICP"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center text-xs", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Network fee" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-muted-foreground", children: [
                    formatICP(TRANSFER_FEE),
                    " ICP"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center text-xs", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Total deducted" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-muted-foreground", children: [
                    formatICP(totalDebitE8s),
                    " ICP"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px bg-border/50" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-semibold", children: "Recipient receives" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono font-bold text-foreground", children: [
                    formatICP(amountE8s),
                    " ICP"
                  ] })
                ] }),
                memo && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px bg-border/50" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center text-xs", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Memo" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-foreground", children: memo })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TermsAgreementNotice, { actionLabel: "confirming this ICP transfer" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "outline",
                    onClick: () => setConfirmOpen(false),
                    disabled: transferMutation.isPending,
                    className: "border-border/50",
                    "data-ocid": "icp-account.cancel_button",
                    children: "Cancel"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    onClick: () => transferMutation.mutate(),
                    disabled: transferMutation.isPending,
                    className: "gap-2",
                    "data-ocid": "icp-account.confirm_button",
                    children: [
                      transferMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-3.5 w-3.5" }),
                      transferMutation.isPending ? "Sending…" : "Confirm Transfer"
                    ]
                  }
                )
              ] })
            ]
          }
        ) })
      ]
    }
  );
}
export {
  ICPAccountPage as default
};
