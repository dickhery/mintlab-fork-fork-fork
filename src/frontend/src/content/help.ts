export type HelpSectionId =
  | "overview"
  | "wallet"
  | "collections"
  | "marketplace"
  | "dividends"
  | "icp-account"
  | "troubleshooting";

export interface HelpLink {
  label: string;
  href: HelpRouteHref;
}

export type HelpRouteHref =
  | "/wallet"
  | "/collections"
  | "/marketplace"
  | "/dividends"
  | "/icp-account"
  | "/help";

export interface HelpSection {
  id: HelpSectionId;
  navTitle: string;
  title: string;
  summary: string;
  keywords: string[];
  highlights: string[];
  steps?: string[];
  risks?: string[];
  links?: HelpLink[];
}

export interface QuickStartItem {
  title: string;
  description: string;
  href: HelpRouteHref;
  label: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface GlossaryItem {
  term: string;
  definition: string;
}

export const quickStartItems: QuickStartItem[] = [
  {
    title: "Mint an NFT",
    description:
      "Open Wallet, upload artwork in Mint NFTs, then choose the main app collection or one of your own collections.",
    href: "/wallet",
    label: "Open Wallet",
  },
  {
    title: "Collect ICP dividends",
    description:
      "Open Dividends to check deposit splits and collect claimable ICP from dividend-enabled NFTs you hold.",
    href: "/dividends",
    label: "View Dividends",
  },
  {
    title: "Create or import collections",
    description:
      "Use Collections to add supported external NFT canisters or launch a new Mintlab ICRC-7 collection.",
    href: "/collections",
    label: "Manage Collections",
  },
  {
    title: "Fund app actions",
    description:
      "Your in-app ICP Account funds minting, collection creation, marketplace buys, bids, and transfers out.",
    href: "/icp-account",
    label: "Open ICP Account",
  },
];

export const helpSections: HelpSection[] = [
  {
    id: "overview",
    navTitle: "Overview",
    title: "How Mintlab Works",
    summary:
      "Mintlab combines an ICP NFT wallet, shared collection directory, creator collection launch flow, marketplace, and dividend rewards in one app.",
    keywords: ["overview", "how it works", "capabilities", "mintlab"],
    highlights: [
      "Connect with Internet Identity to activate your wallet, ICP account, minting, marketplace, and dividend views.",
      "Use the ICP Account page to receive ICP into your in-app balance before paid actions.",
      "Use Collections to import supported external collections or create your own Mintlab collection canister.",
      "Use Wallet to mint NFTs into the main app collection when enabled, or into collections you created.",
      "Use Marketplace to list, buy, bid on, cancel eligible listings, and settle auctions.",
      "Use Dividends to check deposits and collect ICP assigned to NFTs you currently hold.",
    ],
    steps: [
      "Sign in with Internet Identity.",
      "Copy your ICP Account address and fund your in-app balance.",
      "Import a collection, create a collection, or browse existing collections.",
      "Mint from Wallet, trade on Marketplace, and collect dividends from Dividends.",
    ],
  },
  {
    id: "wallet",
    navTitle: "Wallet & Minting",
    title: "Wallet, Receiving, Sync, and Minting",
    summary:
      "The Wallet page is the home for NFTs you own, incoming NFT sync, direct token imports, NFT sending, and Mintlab NFT minting.",
    keywords: [
      "wallet",
      "mint",
      "minting",
      "sync",
      "receive",
      "principal",
      "import nft",
      "send",
    ],
    highlights: [
      "Share your Principal ID to receive NFTs from ICP wallets and apps.",
      "Share your Account ID to receive ICP transfers into your in-app ICP account.",
      "Click Sync after receiving NFTs so Mintlab checks on-chain ownership across supported collections.",
      "Use Import NFT when you know a token ID from an imported external collection that automatic sync has not found yet.",
      "Mint NFTs from Wallet by choosing the main app collection or one of your own Mintlab collections.",
      "Mintlab-created NFTs can be sent or listed from their detail actions. Vaulted in Mintlab NFTs can also be withdrawn to an external wallet.",
    ],
    risks: [
      "Minting into the main app collection can require an admin-set ICP price and uses your in-app ICP balance.",
      "External collection sync can be slow when the original collection canister does not expose a complete ownership index.",
      "NFTs from unverified imported collections are separated from Mintlab verified NFTs and may be counterfeit, unsafe, or inaccurate.",
      "Images may be compressed and, when moderation is enabled, checked before ICP is transferred.",
    ],
    links: [{ label: "Open Wallet", href: "/wallet" }],
  },
  {
    id: "collections",
    navTitle: "Collections",
    title: "Collections, Canisters, Controllers, and Dividends Setup",
    summary:
      "Collections is where users browse the shared directory, import external collections, launch creator collections, inspect collection NFTs, and manage creator canisters.",
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
      "dividends setup",
    ],
    highlights: [
      "Import external collections by adding the collection canister ID, standard, collection image, and browse details.",
      "Mintlab supports EXT, DIP721, and ICRC-7 collection imports.",
      "Create Your Mintlab Collection launches a dedicated ICRC-7 canister for your collection after the admin-set payment is confirmed.",
      "The final review dialog shows the collection settings, dividend setup, payment source, fees, and cycle allocation before payment starts.",
      "Enable collection dividends during collection creation to create a dedicated ICP dividend address for deposits.",
      "Creator collection cards show cycle status, controller tools, top-up actions, and update actions when you can manage the canister.",
      "Collection browse supports search, direct token lookup, attribute filters, dividend balance badges, and canister links.",
    ],
    risks: [
      "A collection canister needs cycles to keep running. Use Top Up when Mintlab reports low cycles.",
      "Mintlab needs controller access for app-managed updates, top-ups, and recovery flows. Removing Mintlab as a controller can make those app tools stop working for that collection.",
      "External imports are shared with every Mintlab user unless hidden or blocked by admins. Mintlab may sample imported collection listings for moderation instead of checking every NFT.",
      "Unverified community imports can impersonate valuable collections. Check canister IDs and report suspected counterfeits, unsafe content, or misleading metadata.",
    ],
    links: [{ label: "Open Collections", href: "/collections" }],
  },
  {
    id: "marketplace",
    navTitle: "Marketplace",
    title: "Marketplace Listings, Auctions, Bids, and Escrow",
    summary:
      "The Marketplace page supports fixed-price listings and timed auctions for eligible NFTs in your Mintlab wallet.",
    keywords: [
      "marketplace",
      "sale",
      "listing",
      "fixed price",
      "auction",
      "bid",
      "escrow",
      "cancel",
      "settle",
    ],
    highlights: [
      "Click List Your NFT to choose an eligible wallet NFT and select Fixed Price or Auction.",
      "Fixed-price buyers pay from their in-app ICP balance and receive the NFT in their Mintlab wallet.",
      "Buying a vaulted external NFT keeps the original NFT in Mintlab custody until the buyer withdraws it to an external wallet.",
      "Auction bids must meet the minimum bid and increment rules shown in the bid dialog.",
      "Bids are funded into escrow with fee reserves, then returned when outbid or used when the auction settles.",
      "Auctions can run from 1 hour to 30 days and extend by 5 minutes when late bids arrive.",
      "An auction cannot be canceled after the first bid is placed.",
    ],
    risks: [
      "Registered external wallet NFTs are deposited into the app vault before listing so Mintlab can settle the sale.",
      "Ledger transfers into escrow and back can cost network fees even when a bid is later refunded.",
      "Unverified marketplace listings are separated from Mintlab verified listings. Verify the collection canister before buying or bidding.",
      "Sellers should review price, duration, and listing type carefully before confirming.",
    ],
    links: [{ label: "Open Marketplace", href: "/marketplace" }],
  },
  {
    id: "dividends",
    navTitle: "Dividends",
    title: "ICP Dividends and Reward Collection",
    summary:
      "Dividend-enabled collections can receive ICP deposits, split the new balance across minted NFTs, and let current NFT holders collect their assigned ICP.",
    keywords: [
      "dividends",
      "rewards",
      "collect",
      "claim",
      "deposit",
      "distribution",
      "ICP",
    ],
    highlights: [
      "Creators enable dividends when creating a Mintlab collection.",
      "The collection browser shows a Dividend ICP Address for dividend-enabled collections.",
      "Send ICP to that address, then click Check Deposits to distribute new deposits across collection NFTs.",
      "Open Dividends to see eligible NFTs you hold and collect claimable ICP.",
      "Collected dividends appear in your in-app ICP Account balance.",
      "NFTs can show Below Fee until the claimable amount is large enough to cover ledger fees.",
    ],
    risks: [
      "Dividend claims are attached to the NFTs you currently hold, so transferred or sold NFTs can move future collection eligibility to the new holder.",
      "New deposits are not visible as claimable until a Check Deposits action distributes them.",
    ],
    links: [{ label: "Open Dividends", href: "/dividends" }],
  },
  {
    id: "icp-account",
    navTitle: "ICP Account",
    title: "ICP Account, Funding, and Transfers",
    summary:
      "The ICP Account page shows your in-app ICP balance, deposit address, Principal ID, and transfer-out form.",
    keywords: [
      "ICP account",
      "balance",
      "fund",
      "deposit",
      "transfer",
      "account id",
      "ledger fee",
    ],
    highlights: [
      "Copy Account Identifier to fund your app balance from another ICP wallet or exchange.",
      "Your in-app balance pays for minting, collection creation, marketplace purchases, auction bids, and cycle top-ups.",
      "Copy Principal ID when another ICP app or wallet needs your principal.",
      "Transfer ICP Out sends ICP to a 64-character hex account identifier.",
      "Transfers include the ICP ledger fee shown in the form before confirmation.",
    ],
    risks: [
      "Always verify the recipient account ID before confirming a transfer.",
      "Keep enough ICP for the action amount plus ledger fees and fee reserves.",
    ],
    links: [{ label: "Open ICP Account", href: "/icp-account" }],
  },
  {
    id: "troubleshooting",
    navTitle: "Troubleshooting",
    title: "Common Issues and What To Try",
    summary:
      "Most issues are caused by missing sync, insufficient ICP balance, low canister cycles, unsupported external collection metadata, or pending chain settlement.",
    keywords: [
      "troubleshooting",
      "failed",
      "missing nft",
      "not visible",
      "cycles",
      "moderation",
      "support",
    ],
    highlights: [
      "NFT not visible: open Wallet, click Sync, then use Import NFT if you know the token ID.",
      "Imported collection slow: some EXT, DIP721, or ICRC-7 canisters do not expose complete browse data, so direct token lookup can be faster.",
      "Payment failed: check the ICP Account balance and remember that fees or escrow reserves may be added.",
      "Low cycles: follow the Top Up prompt so the app or collection canister can keep completing the action.",
      "Image rejected: use JPG or PNG and reduce file size; moderation settings can block flagged content before payment.",
      "Auction or sale still pending: refresh Marketplace and check whether settlement, refund, or admin recovery is required.",
    ],
    links: [{ label: "Check Wallet", href: "/wallet" }],
  },
];

export const faqItems: FaqItem[] = [
  {
    question: "Where do I mint NFTs?",
    answer:
      "Mint from the Wallet page. The Mint NFTs panel lets you upload artwork and choose the main app collection or one of your own Mintlab collections.",
  },
  {
    question: "Where do I collect ICP dividends?",
    answer:
      "Open Dividends. Click Check Deposits when needed, then collect ICP from dividend-enabled NFTs with claimable balances.",
  },
  {
    question: "How do I add an external collection?",
    answer:
      "Open Collections and use Import an ICP NFT Collection. You need the collection canister ID, standard, image, name, symbol, and optional browse details.",
  },
  {
    question: "Why is my NFT not showing after a transfer?",
    answer:
      "Use Wallet Sync first. Mintlab indexes imported collections automatically in small batches. If you know the token ID, use Import NFT to register that exact token immediately.",
  },
  {
    question: "What happens if I remove Mintlab as a controller?",
    answer:
      "You may prevent Mintlab from managing that collection canister through the app, including updates, top-ups, and recovery flows. Keep Mintlab as a controller unless you intend to self-manage the canister.",
  },
  {
    question: "How does AI moderation affect payments?",
    answer:
      "When moderation is enabled, Mintlab checks uploaded images before ICP is transferred. If an upload is blocked, the paid action should not continue.",
  },
  {
    question: "Why do auctions have minimum bids and increments?",
    answer:
      "Minimums keep bids meaningful and make escrow, refund, and settlement fees predictable. The bid dialog shows the current minimum before confirmation.",
  },
];

export const glossaryItems: GlossaryItem[] = [
  {
    term: "Account Identifier",
    definition:
      "A 64-character ICP ledger address. Use it to receive ICP into your in-app account or transfer ICP out.",
  },
  {
    term: "Canister",
    definition:
      "An Internet Computer smart contract. Mintlab collections created in the app get dedicated NFT canisters.",
  },
  {
    term: "Controller",
    definition:
      "A principal allowed to manage a canister. Mintlab needs controller access for app-managed collection maintenance.",
  },
  {
    term: "Cycles",
    definition:
      "The resource canisters spend to run on the Internet Computer. Low cycles can block canister actions until topped up.",
  },
  {
    term: "Dividend Address",
    definition:
      "A dedicated ICP account for a dividend-enabled collection. Deposits there can be split across minted NFTs.",
  },
  {
    term: "Escrow",
    definition:
      "ICP temporarily held by Mintlab while a marketplace purchase, bid, refund, or settlement completes.",
  },
  {
    term: "ICRC-7",
    definition:
      "An ICP NFT standard used by Mintlab-created collections and some external collections.",
  },
  {
    term: "Principal ID",
    definition:
      "Your Internet Computer identity. Share it to receive NFTs or prove ownership in ICP apps.",
  },
  {
    term: "Vaulted NFT",
    definition:
      "An external NFT held by the Mintlab vault. A sale changes Mintlab's in-app owner record first; the buyer can withdraw the original NFT to an external wallet later.",
  },
];

export function getHelpSection(id: HelpSectionId): HelpSection | undefined {
  return helpSections.find((section) => section.id === id);
}
