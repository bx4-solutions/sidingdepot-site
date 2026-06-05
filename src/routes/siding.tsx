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
import { PROJECTS_SORTED } from "@/data/site";
import { SERVICE_METADATA_AB } from "@/data/seo-config";
import { getFaqSchema } from "@/lib/schema";
import { HiringChecklist } from "@/components/site/HiringChecklist";
import { FaqSection } from "@/components/site/FaqSection";
import sidingHero from "@/assets/siding-hero.png";
import project1 from "/projects/project-1.webp";
import project2 from "/projects/project-2.webp";
import project3 from "/projects/project-3.webp";
import project4 from "/projects/project-4.webp";
import project5 from "/projects/project-5.webp";
import project1Before from "/projects/project-1-before.webp";
import project5Before from "/projects/project-5-before.webp";

const SERVICE_KEY = "siding";
const CITY = "Marietta & North Atlanta";
const seo = SERVICE_METADATA_AB[SERVICE_KEY].A;
const HERO_IMAGE = sidingHero;

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

type SidingType = {
  id: string;
  x: number;
  y: number;
  title: string;
  image: string;
  imageAlt: string;
  description: string;
};

const SHOWCASE_IMAGE = project1;
const SHOWCASE_ALT = "Two-story North Atlanta home showcasing James Hardie Board & Batten siding, trim and shingle accents";

const SIDING_TYPES: ReadonlyArray<SidingType> = [
  {
    id: "board-batten",
    x: 38,
    y: 42,
    title: "Board & Batten Siding",
    image: project1,
    imageAlt: "James Hardie Board & Batten siding installed on a North Atlanta home",
    description: "Long vertical boards joined by narrow battens. A traditional, rustic profile that adds vertical drama.",
  },
  {
    id: "plank",
    x: 60,
    y: 58,
    title: "HardiePlank Lap Siding",
    image: project3,
    imageAlt: "HardiePlank Cedarmill lap siding on a North Atlanta home",
    description: "Long, narrow horizontal planks — the classic American siding look.",
  },
  {
    id: "shingle",
    x: 26,
    y: 22,
    title: "Shingle / Shake Siding",
    image: project4,
    imageAlt: "Cedar-style shingle siding accenting a gable",
    description: "Overlapping rectangular shingles inspired by cedar shake roofing.",
  },
  {
    id: "trim",
    x: 78,
    y: 30,
    title: "Soffit, Trim & Fascia",
    image: project2,
    imageAlt: "Crisp white soffit, fascia and trim detailing on a Cape Cod home",
    description: "Regulate attic temperature and moisture, finish your rooflines, and keep pests out.",
  },
];

function SidingTypesSection() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = SIDING_TYPES.find((t) => t.id === activeId) ?? null;

  return (
    <section className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
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
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl shadow-2xl bg-sd-gray-bg">
            <img src={SHOWCASE_IMAGE} alt={SHOWCASE_ALT} className="absolute inset-0 h-full w-full object-cover" />
            {SIDING_TYPES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveId(t.id)}
                className="group absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${t.x}%`, top: `${t.y}%` }}
              >
                <span className="relative flex h-7 w-7 items-center justify-center">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sd-green opacity-60" />
                  <span className="relative inline-flex h-5 w-5 rounded-full bg-sd-green ring-4 ring-white shadow-lg" />
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
      <Dialog open={!!active} onOpenChange={(o) => !o && setActiveId(null)}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden bg-white sm:rounded-xl">
          {active && (
            <div className="grid sm:grid-cols-2">
              <div className="relative aspect-[4/3] sm:aspect-auto sm:h-full bg-sd-gray-bg">
                <img src={active.image} alt={active.imageAlt} className="absolute inset-0 h-full w-full object-cover" />
              </div>
              <div className="p-5 sm:p-6">
                <DialogTitle className="text-lg sm:text-xl font-extrabold text-sd-navy">{active.title}</DialogTitle>
                <DialogDescription className="mt-3 text-sm sm:text-[15px] text-sd-gray-text">{active.description}</DialogDescription>
                <div className="mt-5 flex flex-col gap-2">
                  <Button asChild size="sm"><Link to="/contact">Get a quote for {active.title} <ArrowRight /></Link></Button>
                  <Button asChild variant="outline" size="sm"><Link to="/projects">See real projects</Link></Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}

type ShowcasePair = {
  before: string;
  after: string;
  beforeAlt: string;
  afterAlt: string;
  title: string;
  description: string;
};

const SHOWCASE_PAIRS: ReadonlyArray<ShowcasePair> = [
  {
    before: project1Before,
    after: project1,
    beforeAlt: "Greater Marietta home before renovation",
    afterAlt: "Same home transformed with James Hardie blue siding",
    title: "James Hardie Board & Batten Siding — Greater Marietta, GA",
    description: "Full James Hardie Board & Batten siding replacement on a two-story Greater Marietta home.",
  },
  {
    before: project5Before,
    after: project5,
    beforeAlt: "Two-story home before renovation",
    afterAlt: "Same home repainted in deep blue with white trim",
    title: "Real Project #2",
    description: "Full exterior transformation by Siding Depot — James Hardie siding, paint and trim.",
  },
];

function BeforeAfterCarousel() {
  const [index, setIndex] = useState(0);
  const total = SHOWCASE_PAIRS.length;
  const current = SHOWCASE_PAIRS[index];
  const next = useCallback(() => setIndex((i) => (i + 1) % total), [total]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + total) % total), [total]);

  if (!current) return null;

  return (
    <section className="bg-muted py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-block rounded-pill bg-sd-green-pale px-3 py-1 text-xs font-bold uppercase tracking-wider text-sd-navy">Before / After</span>
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground">Real projects. <span className="text-sd-green">Real transformations.</span></h2>
        </div>
        <div className="mt-12 grid gap-10 lg:grid-cols-[1.4fr_1fr] items-center">
          <BeforeAfterSlider key={index} before={current.before} after={current.after} beforeAlt={current.beforeAlt} afterAlt={current.afterAlt} />
          <div className="flex flex-col">
            <h3 className="mt-6 text-2xl sm:text-3xl font-extrabold uppercase text-sd-navy">{current.title}</h3>
            <p className="mt-4 text-sd-gray-text">{current.description}</p>
            <div className="mt-8 flex items-center gap-3">
              <button onClick={prev} className="inline-flex h-11 w-11 items-center justify-center rounded-full border-2 border-sd-navy text-sd-navy hover:bg-sd-gray-bg"><ArrowLeft className="h-4 w-4" /></button>
              <button onClick={next} className="inline-flex h-11 w-11 items-center justify-center rounded-full border-2 border-sd-navy text-sd-navy hover:bg-sd-gray-bg"><ArrowRight className="h-4 w-4" /></button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const HIRING_CHECKLIST = [
  { Icon: Award, title: "Elite Preferred — Top 2% in the US", desc: "One of the few certified Elite Preferred James Hardie installers." },
  { Icon: ShieldCheck, title: "W-2 Crews Only — No Subcontractors", desc: "Every crew member is a Siding Depot W-2 employee." },
  { Icon: CheckCircle2, title: "Built for Georgia's Climate", desc: "HardieZone® HZ10 products engineered for Georgia's heat and humidity." },
  { Icon: FileText, title: "Written Estimates — Zero Surprises", desc: "Detailed written estimates before any work starts." },
  { Icon: Users, title: "Dedicated On-Site Project Manager", desc: "A Siding Depot project manager is on-site every day." },
  { Icon: ShieldCheck, title: "30-Year Non-Prorated Warranty", desc: "Our projects qualify for James Hardie's extended warranty." },
];

const FAQ_ITEMS = [
  { q: "How much does James Hardie siding cost in Marietta, GA in 2026?", a: "Typical installation costs range from $10,000 to $55,000+." },
  { q: "What is the best siding for Georgia's climate?", a: "James Hardie fiber cement siding, specifically the HZ10 system." },
];

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
        intro="Georgia homes face brutal conditions. Standard vinyl siding fails. James Hardie fiber cement doesn't. As an Elite Preferred contractor, Siding Depot installs HZ10 products specifically engineered for Georgia's climate."
        benefits={["Top 2% Elite Preferred", "Engineered for GA", "30-year warranty", "W-2 crews"]}
        hiringRole="siding contractor"
        hiringIntro="We're the one your neighbors call back to thank."
        hiringChecklist={HIRING_CHECKLIST}
        faqLabel="Siding"
        faqs={FAQ_ITEMS}
        seoParagraph="Siding Depot provides James Hardie siding installation across Marietta and North Atlanta."
        ctaAccent="quality and durability?"
      />
      <SidingTypesSection />
      <BeforeAfterCarousel />
      <HiringChecklist items={HIRING_CHECKLIST} />
      <FaqSection items={FAQ_ITEMS} title="Siding questions," />
    </div>
  );
}
