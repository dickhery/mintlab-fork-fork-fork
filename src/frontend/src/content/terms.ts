export const TERMS_VERSION = "2026-05-29";
export const TERMS_LAST_UPDATED = "May 29, 2026";
export const TERMS_EFFECTIVE_DATE = "May 29, 2026";

export interface TermsSection {
  title: string;
  body?: string[];
  bullets?: string[];
}

export const termsRiskHighlights = [
  "Blockchain and canister transactions can be final, irreversible, delayed, or fail.",
  "ICP, NFTs, and dividend balances can change in value and may become worthless.",
  "The in-app ICP account, marketplace escrow, vault, dividend, and cycle top-up flows depend on canister code and ICP ledger behavior.",
  "Smart contracts, external collection canisters, moderation services, gateways, and network infrastructure can contain bugs or become unavailable.",
];

export const termsSections: TermsSection[] = [
  {
    title: "1. Acceptance of Terms",
    body: [
      'By accessing or using Mintlab, connecting with Internet Identity, viewing collections, importing NFTs, minting NFTs, creating collections, listing, buying, bidding, canceling or settling marketplace listings, transferring ICP or NFTs, claiming dividends, topping up cycles, or otherwise interacting with Mintlab canisters or interfaces, you agree to these Terms of Service ("Terms").',
      "If you do not agree to these Terms, do not use Mintlab.",
    ],
  },
  {
    title: "2. Description of Services",
    body: [
      "Mintlab is an Internet Computer application for NFT wallet views, external collection imports, Mintlab-created ICRC-7 collections, NFT minting, marketplace listings and auctions, in-app ICP account balances, canister cycle top-ups, and dividend distribution tools.",
      "Mintlab includes a frontend interface and public Internet Computer canisters. Some actions are handled by Mintlab canisters, some are sent to external collection canisters, and some are settled through the ICP ledger.",
    ],
  },
  {
    title: "3. Eligibility and Compliance",
    bullets: [
      "You must be at least 18 years old and have legal capacity to enter these Terms.",
      "You are responsible for complying with laws that apply to you, including laws about digital assets, taxes, sanctions, intellectual property, consumer protection, and financial activity.",
      "Mintlab is not available where use would be illegal or would require unsupported licensing, registration, or approval.",
    ],
  },
  {
    title: "4. Wallets, Identity, and In-App ICP Accounts",
    bullets: [
      "You are responsible for your Internet Identity, wallets, principals, devices, passkeys, seed phrases, private keys, and account credentials.",
      "Mintlab cannot recover your external wallet, Internet Identity anchor, passkeys, private keys, or funds sent to the wrong account or principal.",
      "Paid Mintlab actions may use an in-app ICP account associated with your principal. ICP ledger transfers, app balances, withdrawals, marketplace escrow, refunds, and dividend payments are processed by canister logic and the ICP ledger.",
      "You must verify all principals, account identifiers, token IDs, collection IDs, prices, bid amounts, fee reserves, and cycle amounts before confirming an action.",
    ],
  },
  {
    title: "5. NFTs, Minting, and Collection Creation",
    bullets: [
      "NFT ownership is determined by the applicable on-chain canister logic, including Mintlab-created ICRC-7 collection canisters and imported external collection canisters.",
      "Minting and collection creation can require ICP payments, ledger fees, moderation checks, canister creation, cycle conversion, and asynchronous recovery steps.",
      "Mintlab-created collections may use dedicated canisters. Creators should keep enough cycles available and understand that controller changes can affect app-managed updates, top-ups, and recovery tools.",
      "Minted metadata, images, attributes, collection names, and collection descriptions may be stored on-chain or displayed publicly and may be difficult or impossible to remove completely.",
    ],
  },
  {
    title: "6. Marketplace, Vault, Escrow, Bids, and Settlements",
    bullets: [
      "Marketplace listings and auctions are peer-to-peer transactions coordinated by Mintlab canisters according to the deployed code.",
      "Registered external wallet NFTs may be transferred into a Mintlab vault before listing so that the app can settle a sale. Buying a vaulted external NFT keeps the original NFT in Mintlab custody until the buyer withdraws it to an external wallet.",
      "Fixed purchases, auction bids, fee reserves, seller payouts, Mintlab fees, refunds, no-bid returns, and settlement retries depend on canister state, ICP ledger fees, and successful asynchronous calls.",
      "Auction bids may be held in escrow, may extend auctions near closing time, and may require refund or recovery flows. Auctions with bids may not be cancelable.",
      "You are responsible for reviewing listing type, price, bid amount, duration, fees, escrow reserves, and settlement status before confirming.",
    ],
  },
  {
    title: "7. Dividends and Rewards",
    bullets: [
      "Dividend-enabled collections can receive ICP deposits and distribute new balances across NFTs according to deterministic canister logic.",
      "Dividend calculations can include ledger fees, fee reserves, integer division, remainders, minimum claim amounts, and manual or user-triggered deposit checks.",
      "Dividend eligibility can move with an NFT. If you sell or transfer an NFT, future dividend eligibility for that NFT may move to the new holder.",
      "Mintlab does not guarantee any dividend amount, timing, frequency, market value, yield, profit, or tax treatment.",
    ],
  },
  {
    title: "8. Fees",
    body: [
      "Mintlab and the underlying canisters may charge or reserve fees for minting, collection creation, marketplace transactions, auction bids, settlement, refunds, ICP transfers, dividend claims, and cycle top-ups. ICP ledger fees and canister cycle costs may also apply.",
      "Displayed quotes are estimates or current canister-calculated values and can change before or during settlement. Fees are non-refundable except where the deployed smart contract logic explicitly provides a refund or recovery path.",
    ],
  },
  {
    title: "9. Content Rules and Moderation",
    bullets: [
      "You may not upload, mint, list, trade, or promote content that is illegal, harmful, misleading, infringing, abusive, exploitative, or otherwise violates these Terms.",
      "You may not use Mintlab for fraud, money laundering, terrorist financing, sanctions evasion, market manipulation, wash trading, bug exploitation, spam, phishing, or other unlawful or abusive conduct.",
      "Mintlab may use automated moderation, including AI-assisted image or metadata review. Moderation can produce false positives or false negatives, and passing moderation is not legal approval of content.",
      "Mintlab may sample imported external collections or early marketplace listings for moderation instead of reviewing every NFT in a collection.",
      "Mintlab may hide, block, or remove imported NFT collections that include images, text, metadata, or other content currently blocked by the app moderation settings.",
      "Users should report inappropriate NFTs, suspected counterfeit collections, misleading metadata, or other unsafe imported collection issues through the reporting controls in the app.",
      "The operator may hide, block, restrict, or remove access to content or wallet principals through the frontend or app-admin tools when reasonably needed for security, legal, operational, or policy reasons.",
    ],
  },
  {
    title: "10. Intellectual Property",
    bullets: [
      "You represent that you have all rights needed for content, metadata, images, names, and other materials you upload or publish through Mintlab.",
      "You retain any rights you own in your content, subject to any NFT license or transfer terms you separately provide.",
      "You grant Mintlab a non-exclusive, worldwide, royalty-free license to host, store, reproduce, display, index, moderate, and use your content as needed to operate, secure, promote, and improve the app.",
      "Mintlab names, branding, interface design, and source materials are owned by the operator or their licensors unless otherwise stated.",
    ],
  },
  {
    title: "11. Smart Contract, Network, and Upgrade Risks",
    bullets: [
      "Canisters, ledgers, external NFT standards, gateways, browser wallets, Internet Identity, and frontend infrastructure can fail, change, trap, run out of cycles, be exploited, or become unavailable.",
      "Upgrades, migrations, admin actions, emergency fixes, dependency changes, or network events may alter behavior, pause features, or require recovery steps.",
      "External collection imports rely on third-party canisters and metadata. Mintlab does not control those canisters and cannot guarantee their standards, availability, ownership data, media, or token behavior.",
      "Unverified external collections can be counterfeit, impersonate higher-value collections, expose unsafe content, disappear, change behavior, or report inaccurate metadata.",
    ],
  },
  {
    title: "12. Disclaimers and Risk Warnings",
    body: [
      'Mintlab is provided "AS IS" and "AS AVAILABLE" without warranties of any kind, express or implied.',
      "Mintlab does not provide financial, investment, legal, tax, accounting, or securities advice. You should make your own decisions and consult qualified professionals when needed.",
    ],
    bullets: [
      "Transactions can be final and irreversible.",
      "Digital asset values can be volatile and can go to zero.",
      "No yield, reward, dividend, price, liquidity, buyer, seller, uptime, moderation result, or marketplace outcome is guaranteed.",
      "You may lose ICP, NFTs, metadata access, expected dividends, escrowed funds, fee reserves, or other value because of user error, bugs, exploits, network issues, failed calls, cycle exhaustion, or external canister behavior.",
    ],
  },
  {
    title: "13. Limitation of Liability",
    body: [
      "To the maximum extent permitted by law, the operator of Mintlab, affiliates, contributors, service providers, and licensors will not be liable for indirect, incidental, special, consequential, exemplary, punitive, or similar damages, or for lost profits, lost revenue, lost data, loss of goodwill, loss of NFTs, loss of ICP, failed settlements, missed dividends, or loss of digital asset value arising from or related to Mintlab.",
      "To the maximum extent permitted by law, any aggregate liability relating to Mintlab is limited to the greater of the amount you paid directly to the operator for use of Mintlab during the three months before the claim or 100 USD.",
    ],
  },
  {
    title: "14. Indemnification",
    body: [
      "You agree to defend, indemnify, and hold harmless the operator of Mintlab, affiliates, contributors, service providers, and licensors from claims, damages, losses, liabilities, costs, and expenses, including reasonable legal fees, arising from your use of Mintlab, your content, your violation of these Terms, your violation of law, or your infringement or misuse of third-party rights.",
    ],
  },
  {
    title: "15. Suspension and Termination",
    body: [
      "The operator may suspend, restrict, block, or terminate frontend access, app-admin features, collection visibility, marketplace access, moderation status, or other app functions at any time when reasonably needed for legal, security, operational, or policy reasons.",
      "On-chain records, canister state, ledger transactions, NFT ownership records, and public blockchain data may remain available even if frontend access is restricted.",
    ],
  },
  {
    title: "16. Governing Law and Dispute Resolution",
    body: [
      "These Terms are governed by the laws of the State of Nevada, United States, without regard to conflict of law principles.",
      "Before filing a claim, you and the operator agree to try to resolve the dispute informally. If informal resolution fails, disputes will be resolved by binding arbitration administered by the American Arbitration Association in Las Vegas, Nevada, unless applicable law requires otherwise.",
      "You and the operator waive the right to a jury trial and the right to participate in a class action to the maximum extent permitted by law.",
    ],
  },
  {
    title: "17. Changes to These Terms",
    body: [
      "The operator may update these Terms from time to time. Material changes may be announced in the app or through other reasonable means. Continued use of Mintlab after an update means you accept the updated Terms.",
    ],
  },
  {
    title: "18. Contact",
    body: [
      "For questions about these Terms, use the support channel, repository issue tracker, or contact method designated by the Mintlab operator.",
    ],
  },
  {
    title: "19. Miscellaneous",
    body: [
      "These Terms are the entire agreement between you and the operator about Mintlab. If a provision is unenforceable, the remaining provisions remain in effect. You may not assign these Terms without prior written consent from the operator. The operator may assign these Terms as part of a merger, acquisition, reorganization, asset sale, or by operation of law.",
    ],
  },
];
