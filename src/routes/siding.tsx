import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useCallback, useEffect } from "react";
import {
  ArrowRight, ArrowLeft, ShieldCheck, Award, CheckCircle2,
  FileText, Users,
} from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BeforeAfterSlider } from "@/components/site/BeforeAfterSlider";
import { serviceJsonLd, ServiceLandingPage } from "@/components/site/ServiceLandingPage";
import { BEFORE_AFTER_PAIRS, PROJECTS_SORTED } from "@/data/site";
import { SERVICE_METADATA_AB } from "@/data/seo-config";
import { getFaqSchema } from "@/lib/schema";
import { HiringChecklist } from "@/components/site/HiringChecklist";
import { FaqSection } from "@/components/site/FaqSection";
import sidingHeroAsset from "@/assets/siding-hero.png.asset.json";

const SERVICE_KEY = "siding";
const CITY = "Marietta & North Atlanta";
const seo = SERVICE_METADATA_AB[SERVICE_KEY].A;
const HERO_IMAGE = sidingHeroAsset.url;

export const Route = createFileRoute("/siding")({
  head: () => ({
    meta: [
      { title: seo.metaTitle(CITY) },
      { name: "description", content: seo.metaDesc },
      { property: "og:title", content: seo.metaTitle(CITY) },
      { property: "og:description", content: seo.metaDesc },
      { property: "og:image", content: HERO_IMAGE },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "canonical", href: "https://sidingdepot.com/siding" },
      { rel: "preload", as: "image", href: HERO_IMAGE, fetchPriority: "high" as any },
    ],
    scripts: [
      serviceJsonLd("James Hardie Siding Installation", seo.metaDesc, {
        canonical: "https://sidingdepot.com/siding",
        image: HERO_IMAGE,
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
  "Two-story North Atlanta home showcasing James Hardie Board & Batten siding, trim and shingle accents";

const SIDING_TYPES: ReadonlyArray<SidingType> = [
  {
    id: "board-batten",
    x: 38,
    y: 42,
    title: "Board & Batten Siding",
    image: "/projects/project-1.webp",
    imageAlt: "James Hardie Board & Batten siding installed on a North Atlanta home",
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
    description: "Long, narrow horizontal planks — the classic American siding look. Durable and weather-resistant, making it our most popular choice across Marietta, Canton and North Atlanta.",
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
    <section className="bg-white py-20 lg:py-28">
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
            siding, paint and trim transform a Marietta, Canton or North Atlanta home.
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
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border-2 border-sd-navy text-sd-navy hover:bg-sd-gray-bg hover:text-sd-black transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Next project"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border-2 border-sd-navy text-sd-navy hover:bg-sd-gray-bg hover:text-sd-black transition-colors"
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

/* ---------------------------------------------------------------- */
/* FAQ (Section 5)                                                   */
/* ---------------------------------------------------------------- */

const FAQ_ITEMS = [

  {
    q: "How much does James Hardie siding cost in Marietta, GA in 2026?",
    a: "Typical James Hardie installation costs in North Atlanta range from $10,000 for smaller homes under 1,500 sq ft, up to $55,000+ for large estates over 3,500 sq ft. This includes full tear-off, moisture barrier, HardiePlank installation, and professional project management. Financing is available with 0% interest through GreenSky.",
  },
  {
    q: "What is the best siding for Georgia's climate?",
    a: "James Hardie fiber cement siding is the top choice for Georgia. Specifically, the HardieZone® HZ10 system is engineered for the heat, humidity, and storm cycles common in Marietta, Canton, and North Atlanta. It resists rot, warping, and pests, ensuring your home stays protected for decades.",
  },
  {
    q: "How long does siding installation take in Marietta or Canton?",
    a: "A typical siding project takes 5–10 working days. This allows for a proper full tear-off, structural inspection, and precision installation of the James Hardie system by our W-2 crews. Every project is overseen by a dedicated on-site project manager.",
  },
  {
    q: "What does the 30-year non-prorated warranty cover?",
    a: "As Elite Preferred installers, we can offer James Hardie's highest level of protection. The 30-year non-prorated warranty covers both materials and labor, giving you peace of mind that your investment is fully protected against manufacturer defects and installation issues.",
  },
  {
    q: "Are your crews subcontractors or employees?",
    a: "Every crew member at Siding Depot is a W-2 employee. We never use subcontractors. This ensures consistent quality, accountability, and safety on every project. Our teams are background-checked, insured, and trained specifically in James Hardie Best Practices.",
  },
  {
    q: "Do you provide written estimates?",
    a: "Yes. We provide detailed, itemized written estimates within 24 hours of our site visit. The price quoted is the price you pay — no hidden fees or surprise change orders mid-project.",
  },
] as const;



function SidingPage() {
  return (
    <div className="flex flex-col">
      <ServiceLandingPage
        serviceKey={SERVICE_KEY}
        city={CITY}
        heroImage={HERO_IMAGE}
        heroImageSide
        heroImageAlt="Beautiful home with new James Hardie siding installed by Siding Depot"
        eyebrow="James Hardie Siding — Elite Preferred Installation"
        title="James Hardie Siding Installation in"
        titleAccent="Marietta & North Atlanta, GA"
        intro={`Georgia homes face brutal conditions — summer heat above 95°F, year-round humidity over 70%, and an active storm season from March through October. Standard vinyl siding warps, fades, and fails. James Hardie fiber cement doesn't.

As an Elite Preferred James Hardie contractor — the top 2% of installers in the US — Siding Depot installs HardieZone® HZ10 products specifically engineered for Georgia's climate. Every project is managed by a dedicated on-site supervisor. Every crew member is a W-2 Siding Depot employee. No subcontractors. Ever.

We've completed 1,500+ siding projects across Marietta, Canton, Kennesaw, Alpharetta, Milton and Woodstock. Our homeowners get written, itemized estimates — the price in the estimate is the price they pay. If anything changes, we tell you before we do it. That's the Siding Depot guarantee.`}
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
      <section className="bg-white py-20 lg:py-28 text-sd-black">
        <div className="mx-auto max-w-4xl px-4 lg:px-8">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight text-center">
            How Much Does James Hardie Siding Cost in Marietta, GA? (2026)
          </h2>
          <div className="mt-10 space-y-6 text-lg text-sd-black/90 leading-relaxed">
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

      <HiringChecklist items={HIRING_CHECKLIST} />
      
      <FaqSection items={FAQ_ITEMS} title="Siding questions," />

      <BeforeAfterCarousel />
    </div>
  );

}
