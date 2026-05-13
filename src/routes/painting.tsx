import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useCallback, useEffect } from "react";
import {
  ArrowRight, ArrowLeft, Phone, ShieldCheck, Award, CheckCircle2,
  Search, FileText, Wrench, Clock,
} from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { BeforeAfterSlider } from "@/components/site/BeforeAfterSlider";
import { serviceJsonLd, buildServiceMeta, faqJsonLd } from "@/components/site/ServiceLandingPage";
import { SITE, BEFORE_AFTER_PAIRS, PROJECTS_SORTED } from "@/data/site";

/**
 * /services/painting — flagship-style service landing page.
 * Mirrors the architecture of /services/siding for SEO + UX consistency.
 */

const PAGE_TITLE = "Exterior Painting Services in Marietta, GA | Siding Depot";
const PAGE_DESC =
  "Premium Sherwin-Williams® exterior painting built for Georgia heat. UV-resistant thermal barriers for Marietta, Milton & Alpharetta homes. W-2 crews. Free estimate in 24h. Call (678) 400-2012.";

const PROJECT_HERO = "/projects/project-5.webp";
const PROJECT_HERO_ALT =
  "Two-story Kennesaw home freshly repainted in deep navy blue with crisp white trim";

export const Route = createFileRoute("/painting")({
  head: () => ({
    meta: buildServiceMeta({
      title: PAGE_TITLE,
      description: PAGE_DESC,
      image: PROJECT_HERO,
      canonical: "https://sidingdepot.com/painting",
    }),
    links: [
      { rel: "canonical", href: "https://sidingdepot.com/painting" },
      { rel: "preload", as: "image", href: PROJECT_HERO, fetchPriority: "high" as any },
    ],
    scripts: [
      serviceJsonLd("Exterior Painting", PAGE_DESC, {
        canonical: "https://sidingdepot.com/painting",
        image: PROJECT_HERO,
        serviceType: "Exterior Painting",
      }),
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQ_ITEMS.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: item.a },
          })),
        }),
      },
    ],
  }),
  component: PaintingPage,
});

/* ---------------------------------------------------------------- */
/* Section 2 — Paint system spotlights                              */
/* ---------------------------------------------------------------- */

type PaintSpot = {
  id: string;
  x: number;
  y: number;
  title: string;
  image: string;
  imageAlt: string;
  description: string;
};

const PAINT_SPOTS: ReadonlyArray<PaintSpot> = [
  {
    id: "body",
    x: 50,
    y: 55,
    title: "Body Coat — Sherwin-Williams Emerald",
    image: "/projects/project-5.webp",
    imageAlt: "Two-story home in deep navy with new exterior paint",
    description:
      "Two coats of Sherwin-Williams Emerald applied over a fully prepped substrate. Self-priming, mildew-resistant and engineered to hold its color through Georgia summers.",
  },
  {
    id: "trim",
    x: 22,
    y: 32,
    title: "Trim & Fascia",
    image: "/projects/project-2.webp",
    imageAlt: "Crisp white trim and fascia detailing on a Cape Cod home",
    description:
      "Crisp, hand-cut trim lines using Emerald Urethane Trim Enamel. Bonds tighter, resists yellowing, and gives the project the magazine-cover finish that separates a real repaint from a quick spray-and-go.",
  },
  {
    id: "shake",
    x: 78,
    y: 25,
    title: "Shake & Gable Accents",
    image: "/projects/project-4.webp",
    imageAlt: "Refreshed shake-style gable detailing on a Roswell home",
    description:
      "Detail brushwork on shake gables, dormers and architectural accents. Proper back-brushing pushes paint into every shadow line for full coverage with zero lap marks.",
  },
  {
    id: "doors",
    x: 60,
    y: 78,
    title: "Doors & Garage",
    image: "/projects/project-7.webp",
    imageAlt: "Refreshed garage doors on a Craftsman-style Roswell home",
    description:
      "High-traffic surfaces get factory-grade enamel. Smoother flow, harder cure, and a finish that resists scuffs from daily use.",
  },
];

function PaintSystemSection() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = PAINT_SPOTS.find((s) => s.id === activeId) ?? null;

  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          <div>
            <span className="inline-block rounded-pill bg-sd-green-pale px-3 py-1 text-xs font-bold uppercase tracking-wider text-sd-navy">
              Paint System
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight text-sd-black">
              High-Performance{" "}
              <span className="text-sd-green">Exterior Painting Systems.</span>
            </h2>
            <p className="mt-5 text-base sm:text-lg text-sd-gray-text leading-relaxed">
              We create UV-resistant thermal barriers that handle North Atlanta's extreme temperature swings. Tap each hotspot to see the Sherwin-Williams® systems we use to protect every surface.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {PAINT_SPOTS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setActiveId(s.id)}
                  className="rounded-pill border border-sd-gray-border bg-white px-4 py-2 text-sm font-semibold text-sd-navy hover:border-sd-green hover:text-sd-green transition-colors"
                >
                  {s.title}
                </button>
              ))}
            </div>
          </div>

          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl shadow-2xl bg-sd-gray-bg">
            <img
              src={PROJECT_HERO}
              alt={PROJECT_HERO_ALT}
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
              decoding="async"
            />
            {PAINT_SPOTS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setActiveId(s.id)}
                aria-label={`View details: ${s.title}`}
                className="group absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${s.x}%`, top: `${s.y}%` }}
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

      <Dialog open={!!active} onOpenChange={(o) => !o && setActiveId(null)}>
        <DialogContent className="max-w-5xl p-0 overflow-hidden bg-white">
          {active && (
            <div className="flex flex-col">
              <div className="relative aspect-[16/9] w-full bg-sd-gray-bg">
                <img
                  src={active.image}
                  alt={active.imageAlt}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <span className="absolute left-4 top-4 rounded-pill bg-white/90 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-sd-navy shadow-sm">
                  Paint detail
                </span>
              </div>
              <div className="p-6 sm:p-8 lg:p-10">
                <DialogTitle className="text-2xl sm:text-3xl font-extrabold text-sd-navy leading-tight">
                  {active.title}
                </DialogTitle>
                <span className="mt-3 block h-0.5 w-16 bg-sd-green" />
                <DialogDescription className="mt-5 max-w-3xl text-base sm:text-lg text-sd-gray-text leading-relaxed">
                  {active.description}
                </DialogDescription>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Button asChild>
                    <Link to="/contact">
                      Get a painting quote <ArrowRight />
                    </Link>
                  </Button>
                  <Button asChild variant="outline">
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
/* Section 3 — Before/After carousel (shared pairs)                 */
/* ---------------------------------------------------------------- */

const SHOWCASE_PAIRS = BEFORE_AFTER_PAIRS.map((p, i) => {
  const project = PROJECTS_SORTED.find((proj) => proj.src === p.after);
  return {
    ...p,
    title: project?.title ?? `Real Project #${i + 1}`,
    description:
      project?.description ??
      "Full exterior transformation by Siding Depot — paint, trim and finish.",
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
    <section className="bg-sd-gray-bg py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-block rounded-pill bg-sd-green-pale px-3 py-1 text-xs font-bold uppercase tracking-wider text-sd-navy">
            Before / After
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight text-sd-black">
            Real repaints.{" "}
            <span className="text-sd-green">Real transformations.</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-sd-gray-text">
            Drag the slider on each project to see how a full Sherwin-Williams
            repaint changes a North Atlanta home.
          </p>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-12 items-center">
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

          <div className="flex flex-col">
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
            <p className="mt-4 text-sd-gray-text leading-relaxed">{current.description}</p>

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
/* Section 4 — What to consider                                      */
/* ---------------------------------------------------------------- */

const HIRING_CHECKLIST = [
  {
    Icon: Award,
    title: "Premium paint system",
    desc: "Insist on Sherwin-Williams Emerald or Duration grade — not contractor-grade builder paint that fades inside 3 summers.",
  },
  {
    Icon: ShieldCheck,
    title: "License & insurance",
    desc: "Verify a current Georgia GC license plus general liability and workers' comp before any deposit changes hands.",
  },
  {
    Icon: FileText,
    title: "Itemized scope of work",
    desc: "Demand a written scope: power-wash, scrape, sand, prime, caulk, two finish coats. A vague single price hides corner-cutting.",
  },
  {
    Icon: Wrench,
    title: "W-2 crews, not day labor",
    desc: "Ask who actually paints. W-2 employees are trained, insured, and accountable for the warranty.",
  },
  {
    Icon: Search,
    title: "Recent local reviews",
    desc: "50+ recent Google reviews from your county, with photos. Drive past completed jobs after 2 summers — that is the real test.",
  },
  {
    Icon: Clock,
    title: "Honest timeline",
    desc: "A typical full exterior repaint runs 4–8 working days depending on prep. Anything faster is skipping prep — the step that actually makes paint last.",
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
            What to consider when hiring an{" "}
            <span className="text-sd-green">exterior painter.</span>
          </h2>
          <p className="mt-5 text-base sm:text-lg text-sd-gray-text leading-relaxed">
            A repaint is your home's primary line of defense against moisture. Use this checklist to ensure your painting partner doesn't skip critical surface preparation.
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
/* Section 5 — FAQ                                                   */
/* ---------------------------------------------------------------- */

const FAQ_ITEMS = [
  {
    q: "How much does exterior house painting cost in Marietta or Alpharetta, GA?",
    a: "Exterior painting in the North Atlanta area typically costs $3,500–$8,000 for a standard 2,000–2,500 sq ft home, depending on stories, surface condition, and paint quality. Homes with hardboard or fiber cement siding may require additional prep. We use Sherwin-Williams Duration or Emerald exterior — both rated for Georgia's UV exposure and humidity.",
  },
  {
    q: "How often should I repaint the exterior of my home in Georgia?",
    a: "In Georgia's climate, most exteriors need repainting every 7–10 years for quality paints, or every 4–5 years for builder-grade coatings. Signs you need repainting sooner: chalking, peeling, fading, or wood that's absorbing water. North-facing walls tend to hold moisture longer and may need attention first.",
  },
  {
    q: "What's included in a professional exterior paint job?",
    a: "A complete job includes pressure washing, surface repair (caulking gaps, filling cracks), sanding rough areas, priming bare or repaired surfaces, and applying two coats of premium exterior paint. We also mask windows, doors, and trim. We never apply paint over dirty or wet surfaces — shortcuts that cause peeling within a year.",
  },
  {
    q: "Do I need permits to paint my house exterior in Cobb or Cherokee County?",
    a: "No — exterior painting does not require a permit in Cobb, Cherokee, or Fulton counties. However, if your home is in an HOA community (common in Alpharetta, Milton, or Woodstock), your HOA may require color approval before you begin. We're familiar with HOA requirements across North Atlanta and can advise.",
  },
  {
    q: "Can you paint James Hardie siding?",
    a: "Yes. James Hardie's ColorPlus® factory finish is designed to last 15+ years without repainting. But if your fiber cement siding is older or you want a color change, it can absolutely be repainted using the right primers and exterior paints. We follow James Hardie's painting guidelines to maintain the warranty.",
  },
] as const;

function PaintingFaqSection() {
  return (
    <section className="bg-sd-gray-bg py-20 lg:py-28">
      <div className="mx-auto max-w-4xl px-4 lg:px-8">
        <div className="text-center">
          <span className="inline-block rounded-pill bg-sd-green-pale px-3 py-1 text-xs font-bold uppercase tracking-wider text-sd-navy">
            FAQ
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight text-sd-black">
            Painting questions,{" "}
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

/* ---------------------------------------------------------------- */
/* Page                                                              */
/* ---------------------------------------------------------------- */

const BENEFITS = [
  "Sherwin-Williams Emerald & Duration premium systems",
  "Power-wash, scrape, sand, prime — every job, every time",
  "5-year workmanship warranty",
  "W-2 crews — never subcontracted",
] as const;

function PaintingPage() {
  return (
    <main>
      {/* HERO */}
      <section className="relative bg-sd-navy text-white overflow-hidden">
        <div className="absolute inset-0 opacity-25">
          <img src={PROJECT_HERO} alt="" aria-hidden className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-sd-navy via-sd-navy/80 to-transparent" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 lg:px-8 py-hero lg:py-hero-lg">
          <div className="max-w-2xl">
            <span className="inline-block rounded-pill bg-sd-green/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-sd-green ring-1 ring-sd-green/40">
              Sherwin-Williams · PRO Preferred
            </span>
            <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
              Exterior Painting,{" "}
              <span className="text-sd-green">High-Performance Systems.</span>
            </h1>
            <p className="mt-6 text-lg text-white/80 leading-relaxed">
              A repaint should last a decade, not a few seasons. We utilize Sherwin-Williams® Emerald and Duration systems to create UV-resistant thermal barriers that handle North Atlanta's extreme temperature swings.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/contact">
                  Get a free estimate <ArrowRight />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outlineWhite">
                <a href={SITE.phoneHref}>
                  <Phone /> Call {SITE.phone}
                </a>
              </Button>
            </div>
            <ul className="mt-10 grid gap-3 sm:grid-cols-2 text-sm text-white/85">
              {BENEFITS.map((b) => (
                <li key={b} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-sd-green shrink-0" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <PaintSystemSection />
      <BeforeAfterCarousel />
      <WhatToConsiderSection />
      <PaintingFaqSection />

      {/* TRUST + CTA */}
      <section className="bg-sd-navy py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 grid gap-10 lg:grid-cols-3 items-center">
          <div className="lg:col-span-2">
            <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight">
              Ready for paint that lasts{" "}
              <span className="text-sd-green">a decade, not a season?</span>
            </h2>
            <p className="mt-4 text-white/75 max-w-2xl">
              Free on-site consultation, written estimate the same day, and a
              dedicated project manager from start to finish.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/contact">Get a free estimate <ArrowRight /></Link>
              </Button>
              <Button asChild size="lg" variant="outlineWhite">
                <a href={SITE.phoneHref}><Phone /> Call {SITE.phone}</a>
              </Button>
            </div>
          </div>
          <div className="grid gap-3">
            <div className="flex items-center gap-3 rounded-lg bg-white/5 p-4 ring-1 ring-white/10">
              <Award className="h-6 w-6 text-sd-green" />
              <div>
                <p className="font-semibold">Sherwin-Williams PRO Preferred</p>
                <p className="text-xs text-white/60">Premium systems, contractor pricing passed on</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-white/5 p-4 ring-1 ring-white/10">
              <ShieldCheck className="h-6 w-6 text-sd-green" />
              <div>
                <p className="font-semibold">Licensed &amp; Insured</p>
                <p className="text-xs text-white/60">GA GC #RBQA006789</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
