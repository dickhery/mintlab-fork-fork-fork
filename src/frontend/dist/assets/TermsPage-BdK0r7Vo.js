import { r as reactExports, ap as hasAcceptedCurrentTerms, j as jsxRuntimeExports, am as Link, B as Button, aq as TERMS_LAST_UPDATED, ar as TERMS_EFFECTIVE_DATE, as as TERMS_VERSION, at as acceptCurrentTerms, ao as TriangleAlert, au as termsRiskHighlights, K as CircleDollarSign, av as FileText, aw as termsSections, m as motion } from "./index-Cqt-g6Lz.js";
import { B as Badge } from "./badge-DAJgGi3b.js";
import { A as ArrowLeft } from "./arrow-left-DFMFi7xz.js";
import { S as ShieldCheck } from "./shield-check-t7H1-L3v.js";
function TermsPage() {
  const [accepted, setAccepted] = reactExports.useState(false);
  reactExports.useEffect(() => {
    setAccepted(hasAcceptedCurrentTerms());
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-background", "data-ocid": "terms.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "border-b border-border bg-card/70", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-5xl px-4 py-8 md:px-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", size: "sm", className: "mb-5 gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }),
        "Back to Mintlab"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "w-fit border border-accent/20 bg-accent/10 text-accent", children: "Legal" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl font-bold text-foreground md:text-4xl", children: "Mintlab Terms of Service" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base", children: "These Terms cover Mintlab's ICP wallet views, in-app ICP account, NFT minting, collection creation, marketplace escrow, auctions, dividend distribution, moderation, cycle top-ups, and external collection imports." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2 text-xs text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "rounded-full border border-border bg-background px-3 py-1", children: [
            "Last updated: ",
            TERMS_LAST_UPDATED
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "rounded-full border border-border bg-background px-3 py-1", children: [
            "Effective: ",
            TERMS_EFFECTIVE_DATE
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "rounded-full border border-border bg-background px-3 py-1", children: [
            "Version: ",
            TERMS_VERSION
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            className: "gap-2 bg-accent text-accent-foreground hover:bg-accent/90",
            disabled: accepted,
            onClick: () => {
              acceptCurrentTerms();
              setAccepted(true);
            },
            "data-ocid": "terms.page.accept_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-4 w-4" }),
              accepted ? "Terms Accepted" : "Accept Terms"
            ]
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "mx-auto max-w-5xl space-y-8 px-4 py-8 md:px-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "rounded-xl border border-amber-500/25 bg-amber-500/10 p-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-amber-500/25 bg-background/50", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-5 w-5 text-amber-500" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-lg font-semibold text-foreground", children: "Important Risks" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm leading-relaxed text-muted-foreground", children: "Read these carefully before signing in, funding your in-app ICP account, transferring assets, minting, listing, bidding, claiming dividends, or topping up cycles." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-2 md:grid-cols-2", children: termsRiskHighlights.map((risk) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "rounded-lg border border-border/60 bg-background/50 px-3 py-2 text-sm leading-relaxed text-muted-foreground",
              children: risk
            },
            risk
          )) })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "grid grid-cols-1 gap-3 md:grid-cols-3", children: [
        {
          title: "ICP and NFTs",
          text: "Transfers, minting, vault deposits, and marketplace settlement can be irreversible.",
          icon: CircleDollarSign
        },
        {
          title: "Canister Logic",
          text: "Balances, dividends, fees, cycles, and escrow depend on deployed smart contract code.",
          icon: ShieldCheck
        },
        {
          title: "User Content",
          text: "You are responsible for rights, legality, and accuracy of uploaded NFT content.",
          icon: FileText
        }
      ].map(({ title, text, icon: Icon }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "rounded-xl border border-border bg-card p-4",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5 text-accent" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-3 font-display font-semibold text-foreground", children: title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm leading-relaxed text-muted-foreground", children: text })
          ]
        },
        title
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "space-y-4", children: termsSections.map((section, index) => {
        var _a;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.article,
          {
            initial: { opacity: 0, y: 8 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true, margin: "-80px" },
            transition: {
              duration: 0.2,
              delay: Math.min(index * 0.015, 0.2)
            },
            className: "scroll-mt-24 rounded-xl border border-border bg-card p-5 md:p-6",
            "data-ocid": `terms.section.${index + 1}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-lg font-semibold text-foreground", children: section.title }),
              (_a = section.body) == null ? void 0 : _a.map((paragraph) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "mt-3 text-sm leading-relaxed text-muted-foreground",
                  children: paragraph
                },
                paragraph
              )),
              section.bullets && /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-3 space-y-2", children: section.bullets.map((bullet) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "li",
                {
                  className: "text-sm leading-relaxed text-muted-foreground",
                  children: bullet
                },
                bullet
              )) })
            ]
          },
          section.title
        );
      }) })
    ] })
  ] });
}
export {
  TermsPage as default
};
