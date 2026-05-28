import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TERMS_EFFECTIVE_DATE,
  TERMS_LAST_UPDATED,
  TERMS_VERSION,
  termsRiskHighlights,
  termsSections,
} from "@/content/terms";
import { acceptCurrentTerms, hasAcceptedCurrentTerms } from "@/lib/terms";
import { Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowLeft,
  CircleDollarSign,
  FileText,
  ShieldCheck,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

export default function TermsPage() {
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    setAccepted(hasAcceptedCurrentTerms());
  }, []);

  return (
    <div className="bg-background" data-ocid="terms.page">
      <section className="border-b border-border bg-card/70">
        <div className="mx-auto max-w-5xl px-4 py-8 md:px-8">
          <Link to="/">
            <Button variant="ghost" size="sm" className="mb-5 gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Mintlab
            </Button>
          </Link>

          <div className="space-y-4">
            <Badge className="w-fit border border-accent/20 bg-accent/10 text-accent">
              Legal
            </Badge>
            <div className="space-y-2">
              <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">
                Mintlab Terms of Service
              </h1>
              <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
                These Terms cover Mintlab's ICP wallet views, in-app ICP
                account, NFT minting, collection creation, marketplace escrow,
                auctions, dividend distribution, moderation, cycle top-ups, and
                external collection imports.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              <span className="rounded-full border border-border bg-background px-3 py-1">
                Last updated: {TERMS_LAST_UPDATED}
              </span>
              <span className="rounded-full border border-border bg-background px-3 py-1">
                Effective: {TERMS_EFFECTIVE_DATE}
              </span>
              <span className="rounded-full border border-border bg-background px-3 py-1">
                Version: {TERMS_VERSION}
              </span>
            </div>

            <Button
              className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
              disabled={accepted}
              onClick={() => {
                acceptCurrentTerms();
                setAccepted(true);
              }}
              data-ocid="terms.page.accept_button"
            >
              <ShieldCheck className="h-4 w-4" />
              {accepted ? "Terms Accepted" : "Accept Terms"}
            </Button>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-5xl space-y-8 px-4 py-8 md:px-8">
        <section className="rounded-xl border border-amber-500/25 bg-amber-500/10 p-5">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-amber-500/25 bg-background/50">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
            </div>
            <div className="space-y-3">
              <div>
                <h2 className="font-display text-lg font-semibold text-foreground">
                  Important Risks
                </h2>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  Read these carefully before signing in, funding your in-app
                  ICP account, transferring assets, minting, listing, bidding,
                  claiming dividends, or topping up cycles.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                {termsRiskHighlights.map((risk) => (
                  <div
                    key={risk}
                    className="rounded-lg border border-border/60 bg-background/50 px-3 py-2 text-sm leading-relaxed text-muted-foreground"
                  >
                    {risk}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {[
            {
              title: "ICP and NFTs",
              text: "Transfers, minting, vault deposits, and marketplace settlement can be irreversible.",
              icon: CircleDollarSign,
            },
            {
              title: "Canister Logic",
              text: "Balances, dividends, fees, cycles, and escrow depend on deployed smart contract code.",
              icon: ShieldCheck,
            },
            {
              title: "User Content",
              text: "You are responsible for rights, legality, and accuracy of uploaded NFT content.",
              icon: FileText,
            },
          ].map(({ title, text, icon: Icon }) => (
            <div
              key={title}
              className="rounded-xl border border-border bg-card p-4"
            >
              <Icon className="h-5 w-5 text-accent" />
              <h2 className="mt-3 font-display font-semibold text-foreground">
                {title}
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {text}
              </p>
            </div>
          ))}
        </section>

        <section className="space-y-4">
          {termsSections.map((section, index) => (
            <motion.article
              key={section.title}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 0.2,
                delay: Math.min(index * 0.015, 0.2),
              }}
              className="scroll-mt-24 rounded-xl border border-border bg-card p-5 md:p-6"
              data-ocid={`terms.section.${index + 1}`}
            >
              <h2 className="font-display text-lg font-semibold text-foreground">
                {section.title}
              </h2>
              {section.body?.map((paragraph) => (
                <p
                  key={paragraph}
                  className="mt-3 text-sm leading-relaxed text-muted-foreground"
                >
                  {paragraph}
                </p>
              ))}
              {section.bullets && (
                <ul className="mt-3 space-y-2">
                  {section.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="text-sm leading-relaxed text-muted-foreground"
                    >
                      {bullet}
                    </li>
                  ))}
                </ul>
              )}
            </motion.article>
          ))}
        </section>
      </main>
    </div>
  );
}
