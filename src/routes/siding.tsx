import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useCallback, useEffect } from "react";
import {
  ArrowRight, ArrowLeft, Phone, ShieldCheck, Award, CheckCircle2,
  Search, FileText, Wrench, Clock, Users,
} from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { BeforeAfterSlider } from "@/components/site/BeforeAfterSlider";
import { serviceJsonLd, ServiceLandingPage } from "@/components/site/ServiceLandingPage";
import { SITE, BEFORE_AFTER_PAIRS, PROJECTS_SORTED } from "@/data/site";
import { SERVICE_METADATA } from "@/data/seo-config";
import { getFaqSchema } from "@/lib/schema";


const SERVICE_KEY = "siding";
const CITY = "Marietta, Canton & North Atlanta";
const seo = SERVICE_METADATA[SERVICE_KEY];

/**
 * /services/siding — flagship service landing page.
 *
 * Sections (after hero):
 *  - "Siding types" interactive house: clickable hotspots open a dialog with
 *     a zoomed reference photo + description for each siding profile.
 *  - "Real projects" before/after carousel: navigate through the studio's
 *     own BEFORE_AFTER_PAIRS using the existing BeforeAfterSlider component.
 *
 * This static route file takes precedence over the dynamic services.$slug.tsx.
 */

const PAGE_TITLE = "James Hardie Siding Installation Marietta GA | Siding Depot — Elite Preferred";
const PAGE_DESC =
  "Elite Preferred James Hardie siding installation in Marietta, Canton and North Atlanta, GA. W-2 crews, 30-year warranty, written estimates. Free quote: (678) 400-2012.";

export const Route = createFileRoute("/siding")({
  head: () => ({
    meta: [
      { title: seo.metaTitle(CITY) },
      { name: "description", content: seo.metaDesc },
      { property: "og:title", content: seo.metaTitle(CITY) },
      { property: "og:description", content: seo.metaDesc },
      { property: "og:image", content: "/projects/project-1.webp" },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "canonical", href: "https://sidingdepot.com/siding" },
      { rel: "preload", as: "image", href: "/projects/project-1.webp", fetchPriority: "high" as any },
    ],
    scripts: [
      serviceJsonLd("James Hardie Siding Installation", seo.metaDesc, {
        canonical: "https://sidingdepot.com/siding",
        image: "/projects/project-1.webp",
        serviceType: "James Hardie Siding Installation",
      }),
      {
        type: "application/ld+json",
        children: JSON.stringify(getFaqSchema(FAQ_ITEMS)),
      },
    ],
  }),
  component: SidingPage,
});

/* ---------------------------------------------------------------- */
/* Siding-type hotspots (Section 2)                                  */
/* ---------------------------------------------------------------- */

type SidingType = {
  id: string;
  /** Position on the showcase image, percentage of width/height. */
  x: number;
  y: number;
  title: string;
  /** Detail photo opened in the dialog. */
  image: string;
  imageAlt: string;
  description: string;
};

const SHOWCASE_IMAGE = "/projects/project-1.webp";
const SHOWCASE_ALT =
  "Two-story Marietta e Região home showcasing James Hardie Board & Batten siding, trim and shingle accents";

const SIDING_TYPES: ReadonlyArray<SidingType> = [
  {
    id: "board-batten",
    x: 38,
    y: 42,
    title: "Board & Batten Siding",
    image: "/projects/project-1.webp",
    imageAlt: "James Hardie Board & Batten siding installed on a Marietta e Região home",
    description:
      "Long vertical boards joined by narrow battens. A traditional, rustic profile that adds vertical drama and works beautifully on gables, accent walls or full elevations.",
  },
  {
    id: "plank",
    x: 60,
    y: 58,
    title: "HardiePlank Lap Siding",
    image: "/projects/project-3.webp",
    imageAlt: "HardiePlank Cedarmill lap siding on a North Atlanta home",
    description: "Long, narrow horizontal planks — the classic American siding look. Durable and weather-resistant, making it our most popular choice across Marietta e Região.",
  },
  {
    id: "shingle",
    x: 26,
    y: 22,
    title: "Shingle / Shake Siding",
    image: "/projects/project-4.webp",
    imageAlt: "Cedar-style shingle siding accenting a gable",
    description:
      "Overlapping rectangular shingles inspired by cedar shake roofing. Adds warmth and craftsman character — perfect for gables, dormers and entryways.",
  },
  {
    id: "trim",
    x: 78,
    y: 30,
    title: "Soffit, Trim & Fascia",
    image: "/projects/project-2.webp",
    imageAlt: "Crisp white soffit, fascia and trim detailing on a Cape Cod home",
    description:
      "Often overlooked, but critical: soffit, trim and fascia regulate attic temperature and moisture, finish your rooflines, and keep pests out. We replace to match your siding system.",
  },
];

function SidingTypesSection() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = SIDING_TYPES.find((t) => t.id === activeId) ?? null;

  return (
    <section className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Copy */}
          <div>
            <span className="inline-block rounded-pill bg-sd-green-pale px-3 py-1 text-xs font-bold uppercase tracking-wider text-sd-navy">
              Siding Types
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight text-foreground">
              Why Marietta and Canton Homeowners Choose Siding Depot
            </h2>
            <p className="mt-5 text-base sm:text-lg text-muted-foreground leading-relaxed">
              We're not the cheapest contractor in North Atlanta. We're the one your neighbors call back to thank.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {SIDING_TYPES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveId(t.id)}
                  className="rounded-pill border border-sd-gray-border bg-white px-4 py-2 text-sm font-semibold text-sd-navy hover:border-sd-green hover:text-sd-green transition-colors"
                >
                  {t.title}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive house */}
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl shadow-2xl bg-sd-gray-bg">
            <img
              src={SHOWCASE_IMAGE}
              alt={SHOWCASE_ALT}
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
              decoding="async"
            />
            {SIDING_TYPES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveId(t.id)}
                aria-label={`View details: ${t.title}`}
                className="group absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${t.x}%`, top: `${t.y}%` }}
              >
                <span className="relative flex h-7 w-7 items-center justify-center">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sd-green opacity-60" />
                  <span className="relative inline-flex h-5 w-5 rounded-full bg-sd-green ring-4 ring-white shadow-lg transition-transform group-hover:scale-110" />
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Detail dialog — compact 2-column card (image left, copy right on ≥sm) */}
      <Dialog open={!!active} onOpenChange={(o) => !o && setActiveId(null)}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden bg-white sm:rounded-xl !duration-0 !animate-none data-[state=open]:!slide-in-from-left-0 data-[state=open]:!slide-in-from-top-0 data-[state=closed]:!slide-out-to-left-0 data-[state=closed]:!slide-out-to-top-0 data-[state=open]:!zoom-in-100 data-[state=closed]:!zoom-out-100">
          {active && (
            <div className="grid sm:grid-cols-2">
              {/* Image */}
              <div className="relative aspect-[4/3] sm:aspect-auto sm:h-full bg-sd-gray-bg">
                <img
                  src={active.image}
                  alt={active.imageAlt}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <span className="absolute left-3 top-3 rounded-pill bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-sd-navy shadow-sm">
                  Siding type
                </span>
              </div>
              {/* Copy */}
              <div className="p-5 sm:p-6">
                <DialogTitle className="text-lg sm:text-xl font-extrabold text-sd-navy leading-tight">
                  {active.title}
                </DialogTitle>
                <span className="mt-2 block h-0.5 w-12 bg-sd-green" />
                <DialogDescription className="mt-3 text-sm sm:text-[15px] text-sd-gray-text leading-relaxed">
                  {active.description}
                </DialogDescription>
                <div className="mt-5 flex flex-col gap-2">
                  <Button asChild size="sm">
                    <Link to="/contact">
                      Get a quote for {active.title} <ArrowRight />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <Link to="/projects">See real projects</Link>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}

/* ---------------------------------------------------------------- */
/* Before / After carousel (Section 3)                               */
/* ---------------------------------------------------------------- */

type ShowcasePair = {
  before: string;
  after: string;
  beforeAlt: string;
  afterAlt: string;
  title: string;
  description: string;
};

const SHOWCASE_PAIRS: ReadonlyArray<ShowcasePair> = BEFORE_AFTER_PAIRS.map((p, i) => {
  // Pair each before/after with its matching project entry to surface a
  // real headline + description, falling back gracefully if the slug isn't
  // found (e.g. asset added without a project record).
  const project = PROJECTS_SORTED.find((proj) => proj.src === p.after);
  return {
    ...p,
    title: project?.title ?? `Real Project #${i + 1}`,
    description:
      project?.description ??
      "Full exterior transformation by Siding Depot — James Hardie siding, paint and trim.",
  };
});

function BeforeAfterCarousel() {
  const [index, setIndex] = useState(0);
  const total = SHOWCASE_PAIRS.length;
  const current = SHOWCASE_PAIRS[index];

  const next = useCallback(() => setIndex((i) => (i + 1) % total), [total]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + total) % total), [total]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  if (!current) return null;

  return (
    <section className="bg-muted py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-block rounded-pill bg-sd-green-pale px-3 py-1 text-xs font-bold uppercase tracking-wider text-sd-navy">
            Before / After
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight text-foreground">
            Real projects.{" "}
            <span className="text-sd-green">Real transformations.</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground">
            Drag the slider on each project to see exactly how new James Hardie
            siding, paint and trim transform a Marietta e Região home.
          </p>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-12 items-center">
          {/* Slider */}
          <div className="relative">
            <BeforeAfterSlider
              key={index}
              before={current.before}
              after={current.after}
              beforeAlt={current.beforeAlt}
              afterAlt={current.afterAlt}
            />
            <div className="mt-3 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-sd-navy">
              <span>Before</span>
              <span>After</span>
            </div>
          </div>

          {/* Description + nav */}
          <div className="flex flex-col">
            {/* Dots */}
            <div className="flex items-center gap-2">
              {SHOWCASE_PAIRS.map((_, i) => {
                const active = i === index;
                return (
                  <button
                    key={i}
                    type="button"
                    aria-label={`Show project ${i + 1}`}
                    aria-current={active ? "true" : undefined}
                    onClick={() => setIndex(i)}
                    className={`h-3 w-3 rounded-full border transition-colors ${
                      active
                        ? "bg-sd-green border-sd-green"
                        : "bg-transparent border-sd-navy/40 hover:border-sd-navy"
                    }`}
                  />
                );
              })}
            </div>

            <h3 className="mt-6 text-2xl sm:text-3xl font-extrabold uppercase text-sd-navy leading-tight">
              {current.title}
            </h3>
            <p className="mt-4 text-sd-gray-text leading-relaxed">
              {current.description}
            </p>

            <div className="mt-8 flex items-center gap-3">
              <button
                type="button"
                onClick={prev}
                aria-label="Previous project"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border-2 border-sd-navy text-sd-navy hover:bg-sd-navy hover:text-white transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Next project"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border-2 border-sd-navy text-sd-navy hover:bg-sd-navy hover:text-white transition-colors"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
              <Button asChild variant="outline" className="ml-2">
                <Link to="/projects">
                  See our work <ArrowRight />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- */
/* Page                                                              */
/* ---------------------------------------------------------------- */

/* ---------------------------------------------------------------- */
/* What to consider when hiring (Section 4)                          */
/* ---------------------------------------------------------------- */

const HIRING_CHECKLIST = [
  {
    Icon: Award,
    title: "Elite Preferred — Top 2% in the US",
    desc: "One of the few certified Elite Preferred James Hardie installers in Cherokee and Cobb County. This status qualifies your project for the extended 30-year non-prorated warranty — not available from standard installers.",
  },
  {
    Icon: ShieldCheck,
    title: "W-2 Crews Only — No Subcontractors",
    desc: "Every crew member is a Siding Depot W-2 employee. Trained, background-checked, and insured. We never subcontract installs — period.",
  },
  {
    Icon: CheckCircle2,
    title: "Built for Georgia's Climate",
    desc: "HardieZone® HZ10 products engineered for Georgia's heat above 95°F, year-round humidity, and storm season. Not a generic install — a Georgia-specific solution.",
  },
  {
    Icon: FileText,
    title: "Written Estimates — Zero Surprises",
    desc: "Detailed written estimates before any work starts. The number in the estimate is the number you pay. No last-minute change orders. No 'wood rot discovered mid-project' price doubles.",
  },
  {
    Icon: Users,
    title: "Dedicated On-Site Project Manager",
    desc: "A Siding Depot project manager is on-site every day. You get a daily update — call or text — so you always know exactly what was done and what is next.",
  },
  {
    Icon: ShieldCheck,
    title: "30-Year Non-Prorated Warranty",
    desc: "As Elite Preferred installers, our projects qualify for James Hardie's extended warranty covering both materials and labor. The highest coverage in the industry — only available through Elite Preferred contractors.",
  },
] as const;

function WhatToConsiderSection() {
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="max-w-3xl">
          <span className="inline-block rounded-pill bg-sd-green-pale px-3 py-1 text-xs font-bold uppercase tracking-wider text-sd-navy">
            Hire smart
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight text-sd-black">
            What to consider when hiring a{" "}
            <span className="text-sd-green">siding contractor.</span>
          </h2>
          <p className="mt-5 text-base sm:text-lg text-sd-gray-text leading-relaxed">
            Choosing the right siding is a 30-year decision. Use this checklist to verify your contractor meets the highest industry standards for Georgia installations.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {HIRING_CHECKLIST.map(({ Icon, title, desc }) => (
            <div
              key={title}
              className="group rounded-xl border border-sd-gray-border bg-white p-6 transition-all hover:border-sd-green hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-md bg-sd-green-pale text-sd-navy">
                <Icon className="h-5 w-5" strokeWidth={2} />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-sd-black">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-sd-gray-text">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- */
/* FAQ (Section 5)                                                   */
/* ---------------------------------------------------------------- */

const FAQ_ITEMS = [
  {
    q: "How much does James Hardie siding cost in Marietta, GA in 2026?",
    a: "For most homes in the Marietta and North Atlanta area, James Hardie fiber cement siding costs between $15,000 and $30,000 for a full installation on a 2,500 sq ft home. Per square foot, expect $8–$14 installed, depending on the style (HardiePlank, HardieShingle, Board & Batten), trim work, and whether old siding removal is included. Homes in higher-end communities like Milton or Alpharetta with more complex architecture may run higher. We provide free, itemized estimates with no hidden fees.",
  },
  {
    q: "What is the best siding for Georgia's climate?",
    a: "James Hardie fiber cement siding is widely considered the best choice for Georgia. It's engineered specifically for the Southeast's heat, humidity, and storm season through the HardieZone® HZ10 system. Unlike vinyl, it won't warp in 95°F summers. Unlike wood, it won't rot from moisture or attract termites — a real concern in Cherokee and Cobb counties. It also carries a 30-year non-prorated warranty.",
  },
  {
    q: "How long does siding installation take in Marietta or Alpharetta?",
    a: "Most single-family homes in the North Atlanta area take 3 to 7 days from start to finish, depending on home size, number of stories, and siding style. We schedule projects so your home is never left exposed overnight. Weather delays are rare but we communicate proactively.",
  },
  {
    q: "Does James Hardie siding increase home value in Georgia?",
    a: "Yes. According to national remodeling data, James Hardie fiber cement siding delivers up to 80% ROI on resale — one of the highest of any exterior renovation. In high-value markets like Milton, Johns Creek, and Alpharetta, new siding can directly impact appraisal value and days on market.",
  },
  {
    q: "Will my homeowner's insurance cover siding damage from a storm?",
    a: "In most cases, yes — if the damage was caused by a covered peril like hail, wind, or a fallen tree. Georgia's hail season (March–May) causes thousands of siding claims across Cobb, Cherokee, and Fulton counties every year. We work directly with insurance adjusters and can document damage to help you get the coverage you deserve.",
  },
  {
    q: "What's the difference between James Hardie Elite Preferred and a regular contractor?",
    a: "Elite Preferred is James Hardie's top certification, awarded to fewer than 2% of contractors nationwide. It requires passing installation training, maintaining high customer satisfaction scores, and completing a minimum volume of certified installs. Siding Depot holds this status — meaning your installation is backed by both our labor warranty and James Hardie's extended product warranty, which is only available through certified installers.",
  },
] as const;

function SidingFaqSection() {
  return (
    <section className="bg-sd-gray-bg py-20 lg:py-28">
      <div className="mx-auto max-w-4xl px-4 lg:px-8">
        <div className="text-center">
          <span className="inline-block rounded-pill bg-sd-green-pale px-3 py-1 text-xs font-bold uppercase tracking-wider text-sd-navy">
            FAQ
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight text-sd-black">
            Siding questions,{" "}
            <span className="text-sd-green">answered.</span>
          </h2>
        </div>

        <Accordion type="single" collapsible className="mt-10 space-y-3">
          {FAQ_ITEMS.map((item, i) => (
            <AccordionItem
              key={item.q}
              value={`item-${i}`}
              className="rounded-xl border border-sd-gray-border bg-white px-5 sm:px-6"
            >
              <AccordionTrigger className="text-left text-base sm:text-lg font-semibold text-sd-navy hover:no-underline">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-sd-gray-text leading-relaxed">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <p className="mt-8 text-center text-sd-gray-text">
          Still have questions?{" "}
          <Link to="/contact" className="font-semibold text-sd-green hover:underline">
            Talk to our team →
          </Link>
        </p>
      </div>
    </section>
  );
}

function SidingPage() {
  return (
    <div className="flex flex-col">
      <ServiceLandingPage
        serviceKey={SERVICE_KEY}
        city={CITY}
        heroImage="/projects/project-1.webp"
        eyebrow="James Hardie Siding — Elite Preferred Installation"
        title="James Hardie Siding Installation in"
        titleAccent="Marietta, Canton & North Atlanta, GA"
        intro="Georgia homes face brutal conditions — summer heat above 95°F, year-round humidity over 70%, and an active storm season from March through October. Standard vinyl siding warps, fades, and fails. James Hardie fiber cement doesn't.

As an Elite Preferred James Hardie contractor — the top 2% of installers in the US — Siding Depot installs HardieZone® HZ10 products specifically engineered for Georgia's climate. Every project is managed by a dedicated on-site supervisor. Every crew member is a W-2 Siding Depot employee. No subcontractors. Ever.

We've completed 1,500+ siding projects across Marietta, Canton, Kennesaw, Alpharetta, Milton and Woodstock. Our homeowners get written, itemized estimates — the price in the estimate is the price they pay. If anything changes, we tell you before we do it. That's the Siding Depot guarantee."
        benefits={[
          "Top 2% Elite Preferred James Hardie status",
          "Engineered for Georgia heat & humidity (HZ10)",
          "30-year limited material warranty",
          "W-2 employee crews (never subcontractors)",
        ]}
        hiringRole="siding contractor"
        hiringIntro="We're not the cheapest contractor in North Atlanta. We're the one your neighbors call back to thank."
        hiringChecklist={HIRING_CHECKLIST}
        faqLabel="Siding"
        faqs={FAQ_ITEMS}
        seoParagraph="Siding Depot provides James Hardie siding installation across Marietta, Canton and North Atlanta. We serve Cobb County and the surrounding area with Elite Preferred expertise. In 2026, a full James Hardie replacement in Marietta typically runs $15,000–$55,000+, and our fiber cement systems are specifically rated for HardieZone 10 — the highest level of protection against Georgia's intense humidity, rain, and UV exposure."
        ctaAccent="quality and durability?"
      />
      
      {/* Flagship-only interactive sections */}
      <SidingTypesSection />
      
      {/* Pricing Section */}
      <section className="bg-[#1E2A38] py-20 lg:py-28 text-white">
        <div className="mx-auto max-w-4xl px-4 lg:px-8">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight text-center">
            How Much Does James Hardie Siding Cost in Marietta, GA? (2026)
          </h2>
          <div className="mt-10 space-y-6 text-lg text-white/90 leading-relaxed">
            <p>Typical James Hardie installation costs in North Atlanta:</p>
            <ul className="space-y-3 list-disc pl-6">
              <li>Under 1,500 sq ft home: $10,000 – $16,000</li>
              <li>1,500 – 2,500 sq ft home: $16,000 – $26,000</li>
              <li>2,500 – 3,500 sq ft home: $26,000 – $38,000</li>
              <li>3,500+ sq ft home: $38,000 – $55,000+</li>
            </ul>
            <p className="mt-8">
              Price includes: full tear-off and disposal of old siding, moisture barrier installation, James Hardie HardiePlank installation, all caulking and sealing, project manager oversight, and final walkthrough inspection.
            </p>
            <p>
              Financing available from $0 down through GreenSky — apply in 60 seconds, decisions in minutes.
            </p>
          </div>
          <div className="mt-12 text-center">
            <Button asChild size="lg" className="bg-sd-green text-sd-dark hover:bg-sd-green-hover font-bold px-8">
              <Link to="/contact">
                Get My Free Written Estimate <ArrowRight className="ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <BeforeAfterCarousel />
    </div>
  );
}
