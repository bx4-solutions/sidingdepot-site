import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, Phone } from "lucide-react";
import { HeroQuoteForm } from "@/components/site/HeroQuoteForm";
import { Button } from "@/components/ui/button";
import { BeforeAfterSlider } from "@/components/site/BeforeAfterSlider";
import { GoogleReviewsCarousel } from "@/components/site/GoogleReviewsCarousel";
import { EliteBadgeSection } from "@/components/site/EliteBadgeSection";
import sidingHousePool from "@/assets/siding-house-hero-pool.webp";
import { SITE, BEFORE_AFTER_PAIRS } from "@/data/site";
import { SITE_ORIGIN } from "@/data/locations";
import { LOCAL_BUSINESS_SCHEMA, getFaqSchema, getServiceSchema } from "@/lib/schema";

/**
 * /james-hardie — INDEXABLE SEO money page (open-field; no local competitor dominates).
 * Angle: James Hardie Elite Contractor for Metro Atlanta & Marietta.
 * Business rule: full re-side / new installation only — NO one-off repairs.
 * Head follows the indexable pattern from marietta-ga-siding.tsx (self-canonical,
 * NO robots noindex). Visual style mirrors referral.tsx: editorial font-display
 * headings, alternating green-pale/white sections, rounded-[2rem] image cards with
 * an offset backing panel + floating badge, oversized numbered steps, pill buttons.
 */

const SOURCE = "james_hardie_page";

const IMG_PRODUCT = "/projects/project-6.webp";

const PROCESS = [
  {
    number: "01",
    eyebrow: "FREE ON-SITE INSPECTION",
    title: "We measure your whole home.",
    text: "A Hardie-trained specialist inspects your existing exterior and measures everything — walls, trim, soffit and fascia. No pressure, no cost, and no obligation to move forward.",
    detail: "James Hardie fiber cement siding starts with an honest assessment.",
    image: sidingHousePool,
    alt: "James Hardie Elite specialist inspecting a Metro Atlanta home for a fiber cement re-side",
  },
  {
    number: "02",
    eyebrow: "ITEMIZED QUOTE IN 24 HOURS",
    title: "A written, fixed price — no surprises.",
    text: "Within 24 hours you get a written estimate with every line detailed: tear-off, weather barrier, HardieZone HZ10 panels, HardieTrim and ColorPlus finish. The price we quote is the price you pay.",
    detail: "Financing up to $65,000 at 0% APR for 12 months (subject to approval).",
    image: "/projects/project-6.webp",
    alt: "Close-up of new James Hardie fiber cement lap siding and trim installed by Siding Depot",
  },
  {
    number: "03",
    eyebrow: "ELITE INSTALLATION & 30-YEAR WARRANTY",
    title: "Our own certified crews install to spec.",
    text: "Because we are a James Hardie Elite Contractor installing to HZ10 specification, your 30-year, non-prorated product warranty stays valid for the life of the product — backed by our own workmanship guarantee.",
    detail: "In-house crews only. No subcontractors, no hidden markup.",
    image: "/projects/project-1.webp",
    alt: "Metro Atlanta home after a complete James Hardie re-side by Siding Depot's in-house crew",
  },
] as const;

const MATERIAL_BENEFITS = [
  {
    t: "Fire-resistant",
    d: "Non-combustible fiber cement — unlike wood or vinyl, it won't feed a fire.",
  },
  {
    t: "Rot & moisture-proof",
    d: "Won't swell, warp or rot in Georgia humidity and heavy storm exposure.",
  },
  {
    t: "Pest-resistant",
    d: "Termites and woodpeckers can't feed on solid fiber cement.",
  },
  {
    t: "HardieZone® HZ10",
    d: "Panels engineered specifically for the Southeast — heat, humidity and storms.",
  },
  {
    t: "ColorPlus® Technology",
    d: "Baked-on factory color with a 15-year finish warranty against fading and chipping.",
  },
  {
    t: "30-year warranty",
    d: "Non-prorated, transferable product warranty — valid only with certified installation.",
  },
];

const WHY_SPECIALIST = [
  "James Hardie Elite Contractor — the highest certification tier, held by very few contractors in Metro Atlanta.",
  "Every job installed by our own certified in-house crews, with one dedicated project manager.",
  "Installed to HardieZone HZ10 specification so the 30-year manufacturer warranty stays valid.",
];

const RESIDE_SCOPE = [
  "Complete re-sides and full replacement of failing wood, hardboard, Masonite or vinyl.",
  "New construction and whole-home James Hardie fiber cement siding installation.",
  "Storm-damage restoration, fully documented for your insurance claim.",
];

const NOT_OFFERED = [
  "One-off single-board or spot repairs.",
  "Patch-and-match jobs that leave mismatched color and split warranties.",
  "Cosmetic touch-ups without a full, warrantied system.",
];

const SERVICE_AREAS = [
  "Atlanta",
  "Marietta",
  "Alpharetta",
  "Kennesaw",
  "Woodstock",
  "Roswell",
  "Acworth",
  "Canton",
  "Smyrna",
  "Sandy Springs",
  "East Cobb",
];

const FAQS = [
  {
    q: "Are you a certified James Hardie contractor?",
    a: "Yes — Siding Depot is a James Hardie Elite Contractor, the highest certification tier, serving Metro Atlanta and Marietta. Elite status is earned through installation volume, verified in-field quality and continuous crew training — very few contractors in the Atlanta area hold it.",
  },
  {
    q: "Does installation affect the James Hardie warranty?",
    a: "Yes. The 30-year, non-prorated product warranty depends on installation to James Hardie specification. Incorrect installation can void that warranty — which is exactly why Elite certification matters. Installing to HardieZone HZ10 spec keeps your manufacturer warranty valid for the life of the product.",
  },
  {
    q: "Do you use subcontractors?",
    a: "No — every James Hardie fiber cement siding installation is completed by our own certified in-house crews, with one dedicated project manager per job. That means no hidden markup, no finger-pointing and no budget surprises.",
  },
  {
    q: "James Hardie vs. vinyl — which is better for Georgia?",
    a: "James Hardie fiber cement outperforms vinyl on the things that matter in Georgia: it's non-combustible, resists rot and moisture, stands up to storms and impact, and holds resale value far better. Vinyl is cheaper up front but cracks, warps and fades faster in the Southeast heat.",
  },
  {
    q: "Do you offer financing?",
    a: "Yes. Qualified homeowners can finance up to $65,000 at 0% APR for 12 months (subject to credit approval). Ask about current plans when you request your free itemized estimate, or see our financing page for details.",
  },
  {
    q: "Do you do siding repair?",
    a: "No — we specialize in complete re-sides and new James Hardie fiber cement siding installation, not one-off board repairs. Re-siding the whole home means the entire exterior is a single, warrantied James Hardie system rather than a patchwork, so you get consistent color, performance and one warranty across the house.",
  },
];

export const Route = createFileRoute("/james-hardie")({
  head: () => {
    const url = `${SITE_ORIGIN}/james-hardie`;
    const title = "James Hardie Elite Contractor — Atlanta & Marietta | Siding Depot";
    const description =
      "James Hardie Elite Contractor serving Metro Atlanta & Marietta. Fiber cement siding installation & full re-side by certified in-house crews. 30-year warranty, itemized quote in 24h. Free estimate.";

    const localBusiness = {
      ...LOCAL_BUSINESS_SCHEMA,
      name: "Siding Depot — James Hardie Elite Contractor",
      url,
      areaServed: [
        { "@type": "City", name: "Atlanta, GA" },
        { "@type": "City", name: "Marietta, GA" },
        ...LOCAL_BUSINESS_SCHEMA.areaServed,
      ],
    };

    const faqSchema = getFaqSchema([...FAQS]);

    const serviceSchema = getServiceSchema(
      "James Hardie Siding Installation",
      description,
      "/james-hardie",
      `${SITE_ORIGIN}${IMG_PRODUCT}`,
    );

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(localBusiness) },
        { type: "application/ld+json", children: JSON.stringify(faqSchema) },
        { type: "application/ld+json", children: JSON.stringify(serviceSchema) },
      ],
    };
  },
  component: JamesHardiePage,
});

function JamesHardiePage() {
  return (
    <main className="bg-background text-sd-black">
      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="overflow-hidden px-4 pb-16 pt-12 sm:px-6 sm:pb-24 sm:pt-20 lg:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[.94fr_1.06fr] lg:gap-16">
          <div className="max-w-2xl">
            <p className="inline-flex rounded-full bg-sd-green-pale px-4 py-2 text-[11px] font-bold tracking-[.13em] text-sd-green-dark">
              JAMES HARDIE ELITE CONTRACTOR · ATLANTA &amp; MARIETTA
            </p>
            <h1 className="mt-6 font-display text-5xl leading-[.96] sm:text-7xl lg:text-8xl">
              James Hardie Elite Contractor in{" "}
              <span className="text-sd-green-text">Atlanta &amp; Marietta.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-sd-gray-text sm:text-xl">
              One of the few James Hardie <strong>Elite</strong> Contractors in Metro Atlanta —{" "}
              <strong>james hardie fiber cement siding</strong> installed by our own certified
              crews, never subcontractors. HardieZone HZ10, engineered for Georgia's heat and
              storms. If you searched <em>james hardie installers near me</em>, you found the top
              tier.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="rounded-full">
                <a href="#quote">
                  Get my free James Hardie estimate <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full">
                <a href={SITE.phoneHref}>
                  <Phone className="mr-2 h-4 w-4" /> Call {SITE.phone}
                </a>
              </Button>
            </div>
            <p className="mt-5 text-sm font-semibold text-sd-gray-text">
              4.7★ across 550+ reviews · 30-year non-prorated warranty · Itemized quote in 24 hours
            </p>
          </div>
          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute -inset-5 rounded-[2.5rem] bg-sd-green-pale"
            />
            <img
              src={sidingHousePool}
              alt="James Hardie fiber cement siding installation on a Metro Atlanta home by Siding Depot"
              className="relative h-[390px] w-full rounded-[2rem] object-cover object-center shadow-[0_24px_60px_rgba(12,12,12,.17)] sm:h-[540px]"
            />
            <div className="absolute -bottom-5 -left-3 max-w-[245px] rounded-2xl border border-white/70 bg-white/95 p-4 shadow-xl backdrop-blur sm:-left-7 sm:p-5">
              <p className="text-[10px] font-bold tracking-[.14em] text-sd-green-dark">
                THE HIGHEST TIER
              </p>
              <p className="mt-1 font-display text-2xl leading-none">
                Elite Contractor, not just a dealer.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── GREEN-PALE BAND ──────────────────────────────────────────────── */}
      <section className="border-y border-sd-gray-border bg-sd-green-pale px-4 py-5 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
          <p className="font-display text-2xl text-sd-navy">
            Installed to spec. Warrantied for 30 years.
          </p>
          <p className="text-sm font-semibold text-sd-gray-text">
            James Hardie Elite · In-house crews · Licensed GA #RBQA006789
          </p>
        </div>
      </section>

      {/* ── PROOF: ELITE BADGE ───────────────────────────────────────────── */}
      <EliteBadgeSection />

      {/* ── WHAT "ELITE" MEANS ───────────────────────────────────────────── */}
      <section className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 sm:py-28 lg:px-8">
        <p className="text-[11px] font-bold tracking-[.16em] text-sd-green-dark">
          WHAT "ELITE CONTRACTOR" ACTUALLY MEANS
        </p>
        <h2 className="mt-4 font-display text-5xl leading-none sm:text-6xl">
          The top tier of James Hardie siding contractors.
        </h2>
        <p className="mt-6 text-lg leading-relaxed text-sd-gray-text">
          James Hardie certifies installers in tiers — Contractor Alliance, then Preferred, then{" "}
          <strong className="text-sd-black">Elite</strong>, the very top. Elite is earned through
          installation volume, verified in-field quality and continuous training, and only a handful
          of <strong>james hardie siding contractors</strong> in the Atlanta region hold it. For you
          it means one thing: your siding is installed to the exact specification that keeps the{" "}
          <strong className="text-sd-black">30-year warranty valid</strong>. A wrong install is the
          single biggest risk of hiring an uncertified crew — it can void the manufacturer warranty
          entirely.
        </p>
      </section>

      {/* ── PROCESS (oversized numbered steps, alternating) ──────────────── */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 sm:pb-28 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-bold tracking-[.16em] text-sd-green-dark">
            FIBER CEMENT SIDING INSTALLATION
          </p>
          <h2 className="mt-4 font-display text-5xl leading-none sm:text-6xl">
            From free inspection to new siding.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-sd-gray-text">
            Our <strong>fiber cement siding installation</strong> is a complete system — tear-off,
            weather barrier, HZ10 panels, trim, soffit and fascia — done once, done right.
          </p>
        </div>
        <div className="mt-16 grid gap-16 lg:mt-20 lg:gap-24">
          {PROCESS.map((item, index) => (
            <article
              key={item.number}
              className={`grid items-center gap-9 lg:grid-cols-2 lg:gap-20 ${index % 2 ? "lg:[&>*:first-child]:order-2" : ""}`}
            >
              <div className="relative">
                <div
                  aria-hidden="true"
                  className="absolute -inset-4 rounded-[2rem] bg-sd-green-pale"
                />
                <img
                  src={item.image}
                  alt={item.alt}
                  className="relative h-[360px] w-full rounded-[1.65rem] object-cover shadow-[0_20px_48px_rgba(12,12,12,.12)] sm:h-[500px]"
                  loading="lazy"
                />
              </div>
              <div className="max-w-xl">
                <p className="font-display text-7xl leading-none text-sd-green sm:text-8xl">
                  {item.number}
                </p>
                <p className="mt-4 text-[11px] font-bold tracking-[.16em] text-sd-green-dark">
                  {item.eyebrow}
                </p>
                <h3 className="mt-3 font-display text-4xl leading-[.98] sm:text-5xl">
                  {item.title}
                </h3>
                <p className="mt-5 text-lg leading-relaxed text-sd-gray-text">{item.text}</p>
                <p className="mt-6 border-l-2 border-sd-green pl-4 text-sm font-bold leading-relaxed text-sd-navy">
                  {item.detail}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── MATERIAL BENEFITS (2-col grid) ───────────────────────────────── */}
      <section className="bg-sd-green-pale px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[11px] font-bold tracking-[.16em] text-sd-green-dark">
              WHY FIBER CEMENT WINS IN GEORGIA
            </p>
            <h2 className="mt-4 font-display text-5xl leading-none sm:text-6xl">
              It beats vinyl and wood — for good.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-sd-gray-text">
              James Hardie fiber cement is built for the Southeast climate, and it holds resale
              value far better than the materials it replaces.
            </p>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {MATERIAL_BENEFITS.map((b) => (
              <article
                key={b.t}
                className="rounded-2xl border border-white/70 bg-background p-6 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <Check className="mt-1 h-5 w-5 shrink-0 text-sd-green-dark" />
                  <div>
                    <h3 className="font-display text-2xl text-sd-navy">{b.t}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-sd-gray-text">{b.d}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY A SPECIALIST + FULL RE-SIDE (navy panel) ─────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] bg-sd-navy px-6 py-10 text-white sm:px-12 sm:py-14">
          <div className="grid gap-10 lg:grid-cols-[.85fr_1.15fr] lg:items-center">
            <div>
              <p className="text-[11px] font-bold tracking-[.16em] text-sd-green">
                WHY A JAMES HARDIE SPECIALIST
              </p>
              <h2 className="mt-3 font-display text-4xl leading-none sm:text-5xl">
                We install complete systems — not one-off repairs.
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-white/80">
                Siding Depot does complete re-sides, full replacements and new construction. We
                replace failing siding with a complete, warrantied James Hardie system so your whole
                home carries one warranty, consistent color and consistent performance.
              </p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="rounded-2xl bg-white/10 p-5">
                <p className="text-sm font-bold text-sd-green">WHAT WE DO</p>
                <ul className="mt-3 grid gap-3 text-sm leading-relaxed text-white/85">
                  {RESIDE_SCOPE.map((item) => (
                    <li key={item} className="flex gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-sd-green" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl bg-white/10 p-5">
                <p className="text-sm font-bold text-sd-green">WHAT WE DON'T DO</p>
                <ul className="mt-3 grid gap-3 text-sm leading-relaxed text-white/85">
                  {NOT_OFFERED.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-white/50" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-10 grid gap-3 border-t border-white/10 pt-8 sm:grid-cols-3">
            {WHY_SPECIALIST.map((item) => (
              <div key={item} className="flex gap-2 text-sm leading-relaxed text-white/80">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-sd-green" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROOF: BEFORE/AFTER + REVIEWS ────────────────────────────────── */}
      <section className="border-t border-sd-gray-border bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-[11px] font-bold tracking-[.16em] text-sd-green-dark">REAL RESULTS</p>
          <h2 className="mt-3 font-display text-5xl leading-none sm:text-6xl">
            Same home, transformed with James Hardie.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-sd-gray-text">
            Drag the slider to see a complete re-side, not a patch job.
          </p>
        </div>
        {BEFORE_AFTER_PAIRS[0] ? (
          <div className="relative mx-auto mt-12 max-w-4xl">
            <div aria-hidden="true" className="absolute -inset-4 rounded-[2rem] bg-sd-green-pale" />
            <div className="relative overflow-hidden rounded-[1.65rem] bg-white p-2 shadow-[0_20px_48px_rgba(12,12,12,.12)]">
              <BeforeAfterSlider
                before={BEFORE_AFTER_PAIRS[0].before}
                after={BEFORE_AFTER_PAIRS[0].after}
                beforeAlt={BEFORE_AFTER_PAIRS[0].beforeAlt}
                afterAlt={BEFORE_AFTER_PAIRS[0].afterAlt}
              />
            </div>
          </div>
        ) : null}
      </section>
      <GoogleReviewsCarousel />

      {/* ── AREAS WE SERVE + COST ────────────────────────────────────────── */}
      <section className="bg-sd-green-pale px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="text-[11px] font-bold tracking-[.16em] text-sd-green-dark">
                AREAS WE SERVE
              </p>
              <h2 className="mt-4 font-display text-5xl leading-none sm:text-6xl">
                Metro Atlanta &amp; Marietta.
              </h2>
              <p className="mt-6 max-w-md text-lg leading-relaxed text-sd-gray-text">
                Searching for <strong>james hardie dealers near me</strong> or{" "}
                <strong>james hardie distributors near me</strong>? We're the installing Elite
                Contractor — not just a supplier — across Cobb County and North Atlanta.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {SERVICE_AREAS.map((city) => (
                  <span
                    key={city}
                    className="rounded-full border border-sd-gray-border bg-background px-4 py-1.5 text-sm font-semibold text-sd-navy"
                  >
                    {city}
                  </span>
                ))}
              </div>
              <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-sm font-bold">
                <Link to="/marietta-ga-siding" className="text-sd-navy hover:text-sd-green-text">
                  Marietta siding →
                </Link>
                <Link to="/alpharetta-ga-siding" className="text-sd-navy hover:text-sd-green-text">
                  Alpharetta siding →
                </Link>
                <Link to="/siding" className="text-sd-navy hover:text-sd-green-text">
                  All siding services →
                </Link>
              </div>
            </div>
            <div className="rounded-[2rem] bg-background p-8 shadow-sm">
              <p className="text-[11px] font-bold tracking-[.16em] text-sd-green-dark">
                WHAT DOES JAMES HARDIE SIDING COST?
              </p>
              <h3 className="mt-3 font-display text-4xl leading-none sm:text-5xl">
                Honest pricing, in 24 hours.
              </h3>
              <p className="mt-5 text-lg leading-relaxed text-sd-gray-text">
                Every home is different, so we hand you an exact, written and itemized price in 24
                hours — and the price we quote is the price you pay. Full James Hardie re-sides in
                the Atlanta area typically range from $25,000 to $65,000, driven by home size,
                tear-off, HZ10 spec and ColorPlus selections.
              </p>
              <p className="mt-4 border-l-2 border-sd-green pl-4 text-sm font-bold leading-relaxed text-sd-navy">
                Finance up to $65,000 at 0% APR for 12 months (subject to credit approval).
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button asChild size="lg" className="rounded-full">
                  <a href="#quote">
                    Get my free estimate <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full">
                  <Link to="/finance">See financing</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="border-t border-sd-gray-border bg-white px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <p className="text-[11px] font-bold tracking-[.16em] text-sd-green-dark">
              JAMES HARDIE FAQ
            </p>
            <h2 className="mt-3 font-display text-5xl leading-none sm:text-6xl">
              Straight answers before your estimate.
            </h2>
          </div>
          <div className="mt-12 grid gap-5">
            {FAQS.map((f) => (
              <article
                key={f.q}
                className="rounded-2xl border border-sd-gray-border bg-background p-6 sm:p-7"
              >
                <h3 className="font-display text-2xl leading-tight text-sd-navy sm:text-3xl">
                  {f.q}
                </h3>
                <p className="mt-3 text-base leading-relaxed text-sd-gray-text">{f.a}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA + LEAD FORM ────────────────────────────────────────── */}
      <section
        id="quote"
        className="scroll-mt-24 bg-sd-green-pale px-4 py-20 sm:px-6 sm:py-28 lg:px-8"
      >
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.76fr_1.24fr] lg:gap-20">
          <div className="lg:pt-8">
            <p className="text-[11px] font-bold tracking-[.16em] text-sd-green-dark">
              START YOUR PROJECT
            </p>
            <h2 className="mt-4 font-display text-5xl leading-none sm:text-6xl">
              Get your free, itemized James Hardie estimate.
            </h2>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-sd-gray-text">
              A James Hardie Elite specialist inspects your home and hands you a written, itemized
              quote within 24 hours. The price we quote is the price you pay.
            </p>
            <div className="mt-8 rounded-2xl border border-sd-gray-border bg-background p-5">
              <p className="font-bold text-sd-navy">Prefer to talk it through?</p>
              <p className="mt-2 text-sm leading-relaxed text-sd-gray-text">
                Call or text{" "}
                <a
                  className="font-bold underline decoration-sd-green decoration-2 underline-offset-2"
                  href={SITE.phoneHref}
                >
                  {SITE.phone}
                </a>{" "}
                and a specialist will walk you through your options across Metro Atlanta and
                Marietta.
              </p>
            </div>
          </div>
          <HeroQuoteForm source={SOURCE} tag={`${SOURCE}_footer`} />
        </div>
      </section>

      {/* Sticky mobile call button */}
      <a
        href={SITE.phoneHref}
        className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-center gap-2 bg-sd-green py-3 text-base font-bold text-sd-navy shadow-[0_-4px_16px_rgba(0,0,0,0.15)] lg:hidden"
      >
        <Phone className="h-5 w-5" />
        Call for a free estimate
      </a>
    </main>
  );
}
