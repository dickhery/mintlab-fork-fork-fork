import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  type HelpSection,
  faqItems,
  glossaryItems,
  helpSections,
  quickStartItems,
} from "@/content/help";
import { Link, useRouterState } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  CircleDollarSign,
  CircleHelp,
  CreditCard,
  Grid3X3,
  Search,
  ShieldCheck,
  ShoppingBag,
  Wallet,
  Wrench,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";

const sectionIcons: Record<HelpSection["id"], LucideIcon> = {
  overview: BookOpen,
  wallet: Wallet,
  collections: Grid3X3,
  marketplace: ShoppingBag,
  dividends: CircleDollarSign,
  "icp-account": CreditCard,
  troubleshooting: Wrench,
};

function normalize(value: string): string {
  return value.toLowerCase().trim();
}

function sectionText(section: HelpSection): string {
  return [
    section.navTitle,
    section.title,
    section.summary,
    ...section.keywords,
    ...section.highlights,
    ...(section.steps ?? []),
    ...(section.risks ?? []),
  ].join(" ");
}

export default function HelpPage() {
  const [query, setQuery] = useState("");
  const hash = useRouterState({ select: (state) => state.location.hash });
  const normalizedQuery = normalize(query);

  useEffect(() => {
    if (!hash) return;
    const id = hash.replace(/^#/, "");
    window.requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }, [hash]);

  const filteredSections = useMemo(() => {
    if (!normalizedQuery) return helpSections;
    return helpSections.filter((section) =>
      sectionText(section).toLowerCase().includes(normalizedQuery),
    );
  }, [normalizedQuery]);

  const filteredFaqs = useMemo(() => {
    if (!normalizedQuery) return faqItems;
    return faqItems.filter((item) =>
      `${item.question} ${item.answer}`.toLowerCase().includes(normalizedQuery),
    );
  }, [normalizedQuery]);

  const filteredGlossary = useMemo(() => {
    if (!normalizedQuery) return glossaryItems;
    return glossaryItems.filter((item) =>
      `${item.term} ${item.definition}`.toLowerCase().includes(normalizedQuery),
    );
  }, [normalizedQuery]);

  const hasResults =
    filteredSections.length > 0 ||
    filteredFaqs.length > 0 ||
    filteredGlossary.length > 0;

  return (
    <div className="bg-background" data-ocid="help.page">
      <section className="border-b border-border bg-card/70">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 md:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-3">
              <Badge className="w-fit border border-accent/20 bg-accent/10 text-accent">
                Learn Center
              </Badge>
              <div className="space-y-2">
                <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">
                  Mintlab Help
                </h1>
                <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
                  Find where each Mintlab action lives, what each flow does, and
                  what to check before minting, listing, bidding, collecting
                  dividends, or moving ICP.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link to="/wallet">
                <Button className="gap-2" data-ocid="help.hero.wallet_button">
                  <Wallet className="h-4 w-4" />
                  Open Wallet
                </Button>
              </Link>
              <Link to="/dividends">
                <Button
                  variant="outline"
                  className="gap-2"
                  data-ocid="help.hero.dividends_button"
                >
                  <CircleDollarSign className="h-4 w-4" />
                  Dividends
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative max-w-2xl">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search wallet, minting, dividends, auctions, cycles..."
              className="h-11 border-border bg-background pl-9"
              data-ocid="help.search_input"
            />
          </div>
        </div>
      </section>

      <main className="mx-auto grid max-w-7xl gap-8 px-4 py-8 md:px-8 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block">
          <nav
            className="sticky top-24 space-y-1 rounded-xl border border-border bg-card p-2"
            aria-label="Help sections"
          >
            {helpSections.map((section) => {
              const Icon = sectionIcons[section.id];
              return (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-smooth hover:bg-muted/50 hover:text-foreground"
                >
                  <Icon className="h-4 w-4 text-accent" />
                  {section.navTitle}
                </a>
              );
            })}
            <a
              href="#faq"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-smooth hover:bg-muted/50 hover:text-foreground"
            >
              <CircleHelp className="h-4 w-4 text-accent" />
              FAQ
            </a>
            <a
              href="#glossary"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-smooth hover:bg-muted/50 hover:text-foreground"
            >
              <BookOpen className="h-4 w-4 text-accent" />
              Glossary
            </a>
          </nav>
        </aside>

        <div className="space-y-10">
          {!normalizedQuery && (
            <section className="space-y-4" data-ocid="help.quick_start">
              <div className="space-y-1">
                <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  Fast Paths
                </p>
                <h2 className="font-display text-xl font-bold text-foreground">
                  Start With The Action You Need
                </h2>
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {quickStartItems.map((item) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className="rounded-xl border border-border bg-card p-4"
                  >
                    <div className="flex h-full flex-col gap-3">
                      <div className="space-y-1">
                        <h3 className="font-display font-semibold text-foreground">
                          {item.title}
                        </h3>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                      <Link to={item.href} className="mt-auto w-fit">
                        <Button variant="outline" size="sm" className="gap-1.5">
                          {item.label}
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {!hasResults && (
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-start gap-3">
                <Search className="mt-1 h-5 w-5 text-accent" />
                <div className="space-y-1">
                  <p className="font-display font-semibold text-foreground">
                    No help results found
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Try searching for wallet, minting, dividends, auction,
                    cycles, account, or collection.
                  </p>
                </div>
              </div>
            </div>
          )}

          {filteredSections.map((section) => {
            const Icon = sectionIcons[section.id];
            return (
              <article
                key={section.id}
                id={section.id}
                className="scroll-mt-24 rounded-xl border border-border bg-card p-5 md:p-6"
                data-ocid={`help.section.${section.id}`}
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-accent/25 bg-accent/10">
                      <Icon className="h-5 w-5 text-accent" />
                    </div>
                    <div className="min-w-0 space-y-2">
                      <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                        {section.navTitle}
                      </p>
                      <h2 className="font-display text-xl font-bold text-foreground md:text-2xl">
                        {section.title}
                      </h2>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {section.summary}
                      </p>
                    </div>
                  </div>
                  {section.links?.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      className="shrink-0 self-start"
                    >
                      <Button variant="outline" size="sm" className="gap-1.5">
                        {link.label}
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  ))}
                </div>

                <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
                  {section.highlights.map((highlight) => (
                    <div
                      key={highlight}
                      className="flex items-start gap-2 rounded-lg border border-border/70 bg-muted/20 px-3 py-2.5 text-sm text-muted-foreground"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                      <span className="leading-relaxed">{highlight}</span>
                    </div>
                  ))}
                </div>

                {section.steps && (
                  <div className="mt-5 rounded-lg border border-border bg-background/40 p-4">
                    <p className="font-display font-semibold text-foreground">
                      Typical Flow
                    </p>
                    <ol className="mt-3 space-y-2">
                      {section.steps.map((step, index) => (
                        <li
                          key={step}
                          className="flex gap-3 text-sm text-muted-foreground"
                        >
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-accent/30 bg-accent/10 font-mono text-xs text-accent">
                            {index + 1}
                          </span>
                          <span className="pt-0.5 leading-relaxed">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                {section.risks && (
                  <div className="mt-5 rounded-lg border border-amber-500/25 bg-amber-500/10 p-4">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                      <p className="font-display font-semibold text-foreground">
                        Before You Confirm
                      </p>
                    </div>
                    <ul className="mt-3 space-y-2">
                      {section.risks.map((risk) => (
                        <li
                          key={risk}
                          className="text-sm leading-relaxed text-muted-foreground"
                        >
                          {risk}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </article>
            );
          })}

          {filteredFaqs.length > 0 && (
            <section
              id="faq"
              className="scroll-mt-24 rounded-xl border border-border bg-card p-5 md:p-6"
              data-ocid="help.faq"
            >
              <div className="flex items-center gap-3">
                <CircleHelp className="h-5 w-5 text-accent" />
                <h2 className="font-display text-xl font-bold text-foreground">
                  FAQ
                </h2>
              </div>
              <div className="mt-5 divide-y divide-border">
                {filteredFaqs.map((item) => (
                  <div key={item.question} className="py-4 first:pt-0">
                    <p className="font-medium text-foreground">
                      {item.question}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {item.answer}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {filteredGlossary.length > 0 && (
            <section
              id="glossary"
              className="scroll-mt-24 rounded-xl border border-border bg-card p-5 md:p-6"
              data-ocid="help.glossary"
            >
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-accent" />
                <h2 className="font-display text-xl font-bold text-foreground">
                  Glossary
                </h2>
              </div>
              <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
                {filteredGlossary.map((item) => (
                  <div
                    key={item.term}
                    className="rounded-lg border border-border/70 bg-muted/20 p-3"
                  >
                    <p className="font-mono text-xs uppercase tracking-wider text-accent">
                      {item.term}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {item.definition}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
