import { c as createLucideIcon, j as jsxRuntimeExports, a as cn, F as AlertDialog, G as AlertDialogContent, I as AlertDialogHeader, J as AlertDialogTitle, K as AlertDialogDescription, T as TermsAgreementNotice, M as AlertDialogFooter, N as AlertDialogCancel, O as AlertDialogAction, E as LoadingSpinner } from "./index-BSFYQ4AG.js";
import { B as Badge } from "./badge-CG_50zJx.js";
import { f as formatICPAmount } from "./icp-BXjZNIYq.js";
import { C as Coins } from "./coins-DvmO8Ocd.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z", key: "i9b6wo" }],
  ["line", { x1: "4", x2: "4", y1: "22", y2: "15", key: "1cm3nv" }]
];
const Flag = createLucideIcon("flag", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z",
      key: "vktsd0"
    }
  ],
  ["circle", { cx: "7.5", cy: "7.5", r: ".5", fill: "currentColor", key: "kqv944" }]
];
const Tag = createLucideIcon("tag", __iconNode);
const E8S = 100000000n;
function formatCompactICPAmount(e8s) {
  const whole = e8s / E8S;
  const frac = (e8s % E8S).toString().padStart(8, "0").slice(0, 4);
  const trimmed = frac.replace(/0+$/, "");
  return trimmed ? `${whole}.${trimmed}` : whole.toString();
}
function DividendBalanceBadge({
  e8s,
  size = "sm",
  compact = false,
  label = "Dividend balance",
  className
}) {
  if (e8s <= 0n) return null;
  const fullAmount = formatICPAmount(e8s);
  const displayAmount = compact ? formatCompactICPAmount(e8s) : fullAmount;
  const title = `${label}: ${fullAmount} ICP`;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Badge,
    {
      className: cn(
        "max-w-full flex-wrap justify-start whitespace-normal break-words border bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
        size === "sm" ? "text-[10px] leading-tight" : "text-xs",
        className
      ),
      title,
      "aria-label": title,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Coins, { className: "shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          label,
          ":"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono font-semibold", children: [
          displayAmount,
          " ICP"
        ] })
      ]
    }
  );
}
function PaymentConfirmationDialog({
  open,
  onOpenChange,
  title,
  description,
  lines,
  children,
  cancelLabel = "Cancel",
  confirmLabel = "Confirm Payment",
  isPending = false,
  onConfirm,
  ocid
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    AlertDialogContent,
    {
      className: "max-h-[90vh] overflow-y-auto bg-card border-border sm:max-w-xl",
      "data-ocid": ocid,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { className: "font-display", children: title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { children: description })
        ] }),
        children,
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2 rounded-lg border border-border bg-muted/30 p-3 text-sm", children: lines.map((line) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-4",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
                line.label,
                line.helper && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block text-[11px] leading-snug text-muted-foreground/80", children: line.helper })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "break-words text-right font-mono text-foreground", children: line.value })
            ]
          },
          line.label
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TermsAgreementNotice, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { className: "border-border", disabled: isPending, children: cancelLabel }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            AlertDialogAction,
            {
              className: "bg-accent text-accent-foreground hover:bg-accent/90",
              disabled: isPending,
              onClick: onConfirm,
              children: isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, { size: "sm" }) : confirmLabel
            }
          )
        ] })
      ]
    }
  ) });
}
export {
  DividendBalanceBadge as D,
  Flag as F,
  PaymentConfirmationDialog as P,
  Tag as T
};
