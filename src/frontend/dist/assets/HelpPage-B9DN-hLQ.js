import { c as createLucideIcon, r as reactExports, N as useRouterState, j as jsxRuntimeExports, O as Link, B as Button, W as Wallet, t as CircleDollarSign, T as CreditCard, S as ShoppingBag, G as Grid3x3, C as CircleHelp, m as motion } from "./index-w5is4GTk.js";
import { B as Badge, I as Input } from "./badge-BWm-YNrs.js";
import { S as Search, a as ShieldCheck } from "./shield-check-C5CDFDBp.js";
import { A as ArrowRight } from "./arrow-right-Cj47z9RK.js";
import { C as CircleCheck } from "./circle-check-9JetrRso.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "M12 7v14", key: "1akyts" }],
  [
    "path",
    {
      d: "M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z",
      key: "ruj8y"
    }
  ]
];
const BookOpen = createLucideIcon("book-open", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",
      key: "wmoenq"
    }
  ],
  ["path", { d: "M12 9v4", key: "juzpu7" }],
  ["path", { d: "M12 17h.01", key: "p32p05" }]
];
const TriangleAlert = createLucideIcon("triangle-alert", __iconNode$1);
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
      d: "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z",
      key: "cbrjhi"
    }
  ]
];
const Wrench = createLucideIcon("wrench", __iconNode);
const quickStartItems = [
  {
    title: "Mint an NFT",
    description: "Open Wallet, upload artwork in Mint NFTs, then choose the main app collection or one of your own collections.",
    href: "/wallet",
    label: "Open Wallet"
  },
  {
    title: "Collect ICP dividends",
    description: "Open Dividends to check deposit splits and collect claimable ICP from dividend-enabled NFTs you hold.",
    href: "/dividends",
    label: "View Dividends"
  },
  {
    title: "Create or import collections",
    description: "Use Collections to add supported external NFT canisters or launch a new Mintlab ICRC-7 collection.",
    href: "/collections",
    label: "Manage Collections"
  },
  {
    title: "Fund app actions",
    description: "Your in-app ICP Account funds minting, collection creation, marketplace buys, bids, and transfers out.",
    href: "/icp-account",
    label: "Open ICP Account"
  }
];
const helpSections = [
  {
    id: "overview",
    navTitle: "Overview",
    title: "How Mintlab Works",
    summary: "Mintlab combines an ICP NFT wallet, shared collection directory, creator collection launch flow, marketplace, and dividend rewards in one app.",
    keywords: ["overview", "how it works", "capabilities", "mintlab"],
    highlights: [
      "Connect with Internet Identity to activate your wallet, ICP account, minting, marketplace, and dividend views.",
      "Use the ICP Account page to receive ICP into your in-app balance before paid actions.",
      "Use Collections to import supported external collections or create your own Mintlab collection canister.",
      "Use Wallet to mint NFTs into the main app collection when enabled, or into collections you created.",
      "Use Marketplace to list, buy, bid on, cancel eligible listings, and settle auctions.",
      "Use Dividends to check deposits and collect ICP assigned to NFTs you currently hold."
    ],
    steps: [
      "Sign in with Internet Identity.",
      "Copy your ICP Account address and fund your in-app balance.",
      "Import a collection, create a collection, or browse existing collections.",
      "Mint from Wallet, trade on Marketplace, and collect dividends from Dividends."
    ]
  },
  {
    id: "wallet",
    navTitle: "Wallet & Minting",
    title: "Wallet, Receiving, Sync, and Minting",
    summary: "The Wallet page is the home for NFTs you own, incoming NFT sync, direct token imports, NFT sending, and Mintlab NFT minting.",
    keywords: [
      "wallet",
      "mint",
      "minting",
      "sync",
      "receive",
      "principal",
      "import nft",
      "send"
    ],
    highlights: [
      "Share your Principal ID to receive NFTs from ICP wallets and apps.",
      "Share your Account ID to receive ICP transfers into your in-app ICP account.",
      "Click Sync after receiving NFTs so Mintlab checks on-chain ownership across supported collections.",
      "Use Import NFT when you know a token ID from an imported external collection that automatic sync has not found yet.",
      "Mint NFTs from Wallet by choosing the main app collection or one of your own Mintlab collections.",
      "Minted and vaulted NFTs can be sent or listed from their detail actions."
    ],
    risks: [
      "Minting into the main app collection can require an admin-set ICP price and uses your in-app ICP balance.",
      "External collection sync can be slow when the original collection canister does not expose a complete ownership index.",
      "Images may be compressed and, when moderation is enabled, checked before ICP is transferred."
    ],
    links: [{ label: "Open Wallet", href: "/wallet" }]
  },
  {
    id: "collections",
    navTitle: "Collections",
    title: "Collections, Canisters, Controllers, and Dividends Setup",
    summary: "Collections is where users browse the shared directory, import external collections, launch creator collections, inspect collection NFTs, and manage creator canisters.",
    keywords: [
      "collections",
      "create collection",
      "import",
      "canister",
      "controller",
      "cycles",
      "EXT",
      "DIP721",
      "ICRC-7",
      "dividends setup"
    ],
    highlights: [
      "Import external collections by adding the collection canister ID, standard, collection image, and browse details.",
      "Mintlab supports EXT, DIP721, and ICRC-7 collection imports.",
      "Create Your Mintlab Collection launches a dedicated ICRC-7 canister for your collection after the admin-set payment is confirmed.",
      "Enable collection dividends during collection creation to create a dedicated ICP dividend address for deposits.",
      "Creator collection cards show cycle status, controller tools, top-up actions, and update actions when you can manage the canister.",
      "Collection browse supports search, direct token lookup, attribute filters, dividend balance badges, and canister links."
    ],
    risks: [
      "A collection canister needs cycles to keep running. Use Top Up when Mintlab reports low cycles.",
      "Mintlab needs controller access for app-managed updates, top-ups, and recovery flows. Removing Mintlab as a controller can make those app tools stop working for that collection.",
      "External imports are shared with every Mintlab user, so use clear names, symbols, and images."
    ],
    links: [{ label: "Open Collections", href: "/collections" }]
  },
  {
    id: "marketplace",
    navTitle: "Marketplace",
    title: "Marketplace Listings, Auctions, Bids, and Escrow",
    summary: "The Marketplace page supports fixed-price listings and timed auctions for eligible NFTs in your Mintlab wallet.",
    keywords: [
      "marketplace",
      "sale",
      "listing",
      "fixed price",
      "auction",
      "bid",
      "escrow",
      "cancel",
      "settle"
    ],
    highlights: [
      "Click List Your NFT to choose an eligible wallet NFT and select Fixed Price or Auction.",
      "Fixed-price buyers pay from their in-app ICP balance and receive the NFT in their Mintlab wallet.",
      "Auction bids must meet the minimum bid and increment rules shown in the bid dialog.",
      "Bids are funded into escrow with fee reserves, then returned when outbid or used when the auction settles.",
      "Auctions can run from 1 hour to 30 days and extend by 5 minutes when late bids arrive.",
      "An auction cannot be canceled after the first bid is placed."
    ],
    risks: [
      "External registered NFTs are deposited into the app vault before listing so Mintlab can settle the sale.",
      "Ledger transfers into escrow and back can cost network fees even when a bid is later refunded.",
      "Sellers should review price, duration, and listing type carefully before confirming."
    ],
    links: [{ label: "Open Marketplace", href: "/marketplace" }]
  },
  {
    id: "dividends",
    navTitle: "Dividends",
    title: "ICP Dividends and Reward Collection",
    summary: "Dividend-enabled collections can receive ICP deposits, split the new balance across minted NFTs, and let current NFT holders collect their assigned ICP.",
    keywords: [
      "dividends",
      "rewards",
      "collect",
      "claim",
      "deposit",
      "distribution",
      "ICP"
    ],
    highlights: [
      "Creators enable dividends when creating a Mintlab collection.",
      "The collection browser shows a Dividend ICP Address for dividend-enabled collections.",
      "Send ICP to that address, then click Check Deposits to distribute new deposits across collection NFTs.",
      "Open Dividends to see eligible NFTs you hold and collect claimable ICP.",
      "Collected dividends appear in your in-app ICP Account balance.",
      "NFTs can show Below Fee until the claimable amount is large enough to cover ledger fees."
    ],
    risks: [
      "Dividend claims are attached to the NFTs you currently hold, so transferred or sold NFTs can move future collection eligibility to the new holder.",
      "New deposits are not visible as claimable until a Check Deposits action distributes them."
    ],
    links: [{ label: "Open Dividends", href: "/dividends" }]
  },
  {
    id: "icp-account",
    navTitle: "ICP Account",
    title: "ICP Account, Funding, and Transfers",
    summary: "The ICP Account page shows your in-app ICP balance, deposit address, Principal ID, and transfer-out form.",
    keywords: [
      "ICP account",
      "balance",
      "fund",
      "deposit",
      "transfer",
      "account id",
      "ledger fee"
    ],
    highlights: [
      "Copy Account Identifier to fund your app balance from another ICP wallet or exchange.",
      "Your in-app balance pays for minting, collection creation, marketplace purchases, auction bids, and cycle top-ups.",
      "Copy Principal ID when another ICP app or wallet needs your principal.",
      "Transfer ICP Out sends ICP to a 64-character hex account identifier.",
      "Transfers include the ICP ledger fee shown in the form before confirmation."
    ],
    risks: [
      "Always verify the recipient account ID before confirming a transfer.",
      "Keep enough ICP for the action amount plus ledger fees and fee reserves."
    ],
    links: [{ label: "Open ICP Account", href: "/icp-account" }]
  },
  {
    id: "troubleshooting",
    navTitle: "Troubleshooting",
    title: "Common Issues and What To Try",
    summary: "Most issues are caused by missing sync, insufficient ICP balance, low canister cycles, unsupported external collection metadata, or pending chain settlement.",
    keywords: [
      "troubleshooting",
      "failed",
      "missing nft",
      "not visible",
      "cycles",
      "moderation",
      "support"
    ],
    highlights: [
      "NFT not visible: open Wallet, click Sync, then use Import NFT if you know the token ID.",
      "Imported collection slow: some EXT, DIP721, or ICRC-7 canisters do not expose complete browse data, so direct token lookup can be faster.",
      "Payment failed: check the ICP Account balance and remember that fees or escrow reserves may be added.",
      "Low cycles: follow the Top Up prompt so the app or collection canister can keep completing the action.",
      "Image rejected: use JPG or PNG and reduce file size; moderation settings can block flagged content before payment.",
      "Auction or sale still pending: refresh Marketplace and check whether settlement, refund, or admin recovery is required."
    ],
    links: [{ label: "Check Wallet", href: "/wallet" }]
  }
];
const faqItems = [
  {
    question: "Where do I mint NFTs?",
    answer: "Mint from the Wallet page. The Mint NFTs panel lets you upload artwork and choose the main app collection or one of your own Mintlab collections."
  },
  {
    question: "Where do I collect ICP dividends?",
    answer: "Open Dividends. Click Check Deposits when needed, then collect ICP from dividend-enabled NFTs with claimable balances."
  },
  {
    question: "How do I add an external collection?",
    answer: "Open Collections and use Import an ICP NFT Collection. You need the collection canister ID, standard, image, name, symbol, and optional browse details."
  },
  {
    question: "Why is my NFT not showing after a transfer?",
    answer: "Use Wallet Sync first. Mintlab indexes imported collections automatically in small batches. If you know the token ID, use Import NFT to register that exact token immediately."
  },
  {
    question: "What happens if I remove Mintlab as a controller?",
    answer: "You may prevent Mintlab from managing that collection canister through the app, including updates, top-ups, and recovery flows. Keep Mintlab as a controller unless you intend to self-manage the canister."
  },
  {
    question: "How does AI moderation affect payments?",
    answer: "When moderation is enabled, Mintlab checks uploaded images before ICP is transferred. If an upload is blocked, the paid action should not continue."
  },
  {
    question: "Why do auctions have minimum bids and increments?",
    answer: "Minimums keep bids meaningful and make escrow, refund, and settlement fees predictable. The bid dialog shows the current minimum before confirmation."
  }
];
const glossaryItems = [
  {
    term: "Account Identifier",
    definition: "A 64-character ICP ledger address. Use it to receive ICP into your in-app account or transfer ICP out."
  },
  {
    term: "Canister",
    definition: "An Internet Computer smart contract. Mintlab collections created in the app get dedicated NFT canisters."
  },
  {
    term: "Controller",
    definition: "A principal allowed to manage a canister. Mintlab needs controller access for app-managed collection maintenance."
  },
  {
    term: "Cycles",
    definition: "The resource canisters spend to run on the Internet Computer. Low cycles can block canister actions until topped up."
  },
  {
    term: "Dividend Address",
    definition: "A dedicated ICP account for a dividend-enabled collection. Deposits there can be split across minted NFTs."
  },
  {
    term: "Escrow",
    definition: "ICP temporarily held by Mintlab while a marketplace purchase, bid, refund, or settlement completes."
  },
  {
    term: "ICRC-7",
    definition: "An ICP NFT standard used by Mintlab-created collections and some external collections."
  },
  {
    term: "Principal ID",
    definition: "Your Internet Computer identity. Share it to receive NFTs or prove ownership in ICP apps."
  },
  {
    term: "Vaulted NFT",
    definition: "An NFT held by the Mintlab vault so marketplace settlement can transfer it to a buyer."
  }
];
const sectionIcons = {
  overview: BookOpen,
  wallet: Wallet,
  collections: Grid3x3,
  marketplace: ShoppingBag,
  dividends: CircleDollarSign,
  "icp-account": CreditCard,
  troubleshooting: Wrench
};
function normalize(value) {
  return value.toLowerCase().trim();
}
function sectionText(section) {
  return [
    section.navTitle,
    section.title,
    section.summary,
    ...section.keywords,
    ...section.highlights,
    ...section.steps ?? [],
    ...section.risks ?? []
  ].join(" ");
}
function HelpPage() {
  const [query, setQuery] = reactExports.useState("");
  const hash = useRouterState({ select: (state) => state.location.hash });
  const normalizedQuery = normalize(query);
  reactExports.useEffect(() => {
    if (!hash) return;
    const id = hash.replace(/^#/, "");
    window.requestAnimationFrame(() => {
      var _a;
      (_a = document.getElementById(id)) == null ? void 0 : _a.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    });
  }, [hash]);
  const filteredSections = reactExports.useMemo(() => {
    if (!normalizedQuery) return helpSections;
    return helpSections.filter(
      (section) => sectionText(section).toLowerCase().includes(normalizedQuery)
    );
  }, [normalizedQuery]);
  const filteredFaqs = reactExports.useMemo(() => {
    if (!normalizedQuery) return faqItems;
    return faqItems.filter(
      (item) => `${item.question} ${item.answer}`.toLowerCase().includes(normalizedQuery)
    );
  }, [normalizedQuery]);
  const filteredGlossary = reactExports.useMemo(() => {
    if (!normalizedQuery) return glossaryItems;
    return glossaryItems.filter(
      (item) => `${item.term} ${item.definition}`.toLowerCase().includes(normalizedQuery)
    );
  }, [normalizedQuery]);
  const hasResults = filteredSections.length > 0 || filteredFaqs.length > 0 || filteredGlossary.length > 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-background", "data-ocid": "help.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "border-b border-border bg-card/70", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 md:px-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "w-fit border border-accent/20 bg-accent/10 text-accent", children: "Learn Center" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl font-bold text-foreground md:text-4xl", children: "Mintlab Help" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm leading-relaxed text-muted-foreground md:text-base", children: "Find where each Mintlab action lives, what each flow does, and what to check before minting, listing, bidding, collecting dividends, or moving ICP." })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/wallet", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { className: "gap-2", "data-ocid": "help.hero.wallet_button", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "h-4 w-4" }),
            "Open Wallet"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/dividends", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "outline",
              className: "gap-2",
              "data-ocid": "help.hero.dividends_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleDollarSign, { className: "h-4 w-4" }),
                "Dividends"
              ]
            }
          ) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative max-w-2xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            value: query,
            onChange: (event) => setQuery(event.target.value),
            placeholder: "Search wallet, minting, dividends, auctions, cycles...",
            className: "h-11 border-border bg-background pl-9",
            "data-ocid": "help.search_input"
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "mx-auto grid max-w-7xl gap-8 px-4 py-8 md:px-8 lg:grid-cols-[240px_1fr]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("aside", { className: "hidden lg:block", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "nav",
        {
          className: "sticky top-24 space-y-1 rounded-xl border border-border bg-card p-2",
          "aria-label": "Help sections",
          children: [
            helpSections.map((section) => {
              const Icon = sectionIcons[section.id];
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "a",
                {
                  href: `#${section.id}`,
                  className: "flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-smooth hover:bg-muted/50 hover:text-foreground",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4 text-accent" }),
                    section.navTitle
                  ]
                },
                section.id
              );
            }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "a",
              {
                href: "#faq",
                className: "flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-smooth hover:bg-muted/50 hover:text-foreground",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CircleHelp, { className: "h-4 w-4 text-accent" }),
                  "FAQ"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "a",
              {
                href: "#glossary",
                className: "flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-smooth hover:bg-muted/50 hover:text-foreground",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "h-4 w-4 text-accent" }),
                  "Glossary"
                ]
              }
            )
          ]
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-10", children: [
        !normalizedQuery && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "space-y-4", "data-ocid": "help.quick_start", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs uppercase tracking-widest text-muted-foreground", children: "Fast Paths" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-bold text-foreground", children: "Start With The Action You Need" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-3 md:grid-cols-2", children: quickStartItems.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { opacity: 0, y: 10 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.25 },
              className: "rounded-xl border border-border bg-card p-4",
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-full flex-col gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-foreground", children: item.title }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm leading-relaxed text-muted-foreground", children: item.description })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: item.href, className: "mt-auto w-fit", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", className: "gap-1.5", children: [
                  item.label,
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-3.5 w-3.5" })
                ] }) })
              ] })
            },
            item.title
          )) })
        ] }),
        !hasResults && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border bg-card p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "mt-1 h-5 w-5 text-accent" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-semibold text-foreground", children: "No help results found" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Try searching for wallet, minting, dividends, auction, cycles, account, or collection." })
          ] })
        ] }) }),
        filteredSections.map((section) => {
          var _a;
          const Icon = sectionIcons[section.id];
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "article",
            {
              id: section.id,
              className: "scroll-mt-24 rounded-xl border border-border bg-card p-5 md:p-6",
              "data-ocid": `help.section.${section.id}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4 md:flex-row md:items-start md:justify-between", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-w-0 items-start gap-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-accent/25 bg-accent/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5 text-accent" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 space-y-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs uppercase tracking-widest text-muted-foreground", children: section.navTitle }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-bold text-foreground md:text-2xl", children: section.title }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm leading-relaxed text-muted-foreground", children: section.summary })
                    ] })
                  ] }),
                  (_a = section.links) == null ? void 0 : _a.map((link) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Link,
                    {
                      to: link.href,
                      className: "shrink-0 self-start",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", className: "gap-1.5", children: [
                        link.label,
                        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-3.5 w-3.5" })
                      ] })
                    },
                    link.href
                  ))
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-5 grid grid-cols-1 gap-3 md:grid-cols-2", children: section.highlights.map((highlight) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "flex items-start gap-2 rounded-lg border border-border/70 bg-muted/20 px-3 py-2.5 text-sm text-muted-foreground",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "mt-0.5 h-4 w-4 shrink-0 text-accent" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "leading-relaxed", children: highlight })
                    ]
                  },
                  highlight
                )) }),
                section.steps && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 rounded-lg border border-border bg-background/40 p-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-semibold text-foreground", children: "Typical Flow" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("ol", { className: "mt-3 space-y-2", children: section.steps.map((step, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "li",
                    {
                      className: "flex gap-3 text-sm text-muted-foreground",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-accent/30 bg-accent/10 font-mono text-xs text-accent", children: index + 1 }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "pt-0.5 leading-relaxed", children: step })
                      ]
                    },
                    step
                  )) })
                ] }),
                section.risks && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 rounded-lg border border-amber-500/25 bg-amber-500/10 p-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4 text-amber-500" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-semibold text-foreground", children: "Before You Confirm" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-3 space-y-2", children: section.risks.map((risk) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "li",
                    {
                      className: "text-sm leading-relaxed text-muted-foreground",
                      children: risk
                    },
                    risk
                  )) })
                ] })
              ]
            },
            section.id
          );
        }),
        filteredFaqs.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "section",
          {
            id: "faq",
            className: "scroll-mt-24 rounded-xl border border-border bg-card p-5 md:p-6",
            "data-ocid": "help.faq",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleHelp, { className: "h-5 w-5 text-accent" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-bold text-foreground", children: "FAQ" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-5 divide-y divide-border", children: filteredFaqs.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-4 first:pt-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-foreground", children: item.question }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm leading-relaxed text-muted-foreground", children: item.answer })
              ] }, item.question)) })
            ]
          }
        ),
        filteredGlossary.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "section",
          {
            id: "glossary",
            className: "scroll-mt-24 rounded-xl border border-border bg-card p-5 md:p-6",
            "data-ocid": "help.glossary",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-5 w-5 text-accent" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-bold text-foreground", children: "Glossary" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-5 grid grid-cols-1 gap-3 md:grid-cols-2", children: filteredGlossary.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "rounded-lg border border-border/70 bg-muted/20 p-3",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs uppercase tracking-wider text-accent", children: item.term }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm leading-relaxed text-muted-foreground", children: item.definition })
                  ]
                },
                item.term
              )) })
            ]
          }
        )
      ] })
    ] })
  ] });
}
export {
  HelpPage as default
};
