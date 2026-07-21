import {
  Phone,
  CheckCircle2,
  Star,
  AlertTriangle,
  ShieldCheck,
  Paintbrush,
  Flame,
  BadgeCheck,
  Clock,
} from "lucide-react";
import { HeroQuoteForm } from "@/components/site/HeroQuoteForm";
import { Button } from "@/components/ui/button";
import { BeforeAfterSlider } from "@/components/site/BeforeAfterSlider";
import { PartnersCarousel } from "@/components/site/PartnersCarousel";
import { TestimonialCard } from "@/components/site/TestimonialCard";
import jamesHardieElite from "@/assets/james-hardie-elite-contractor.png";
import { SITE, BEFORE_AFTER_PAIRS, STATS, PROCESS_STEPS } from "@/data/site";
import { buildFaqs, GREENSKY_STEPS } from "@/data/lp-content";
import { SITE_ORIGIN } from "@/data/locations";
import { LOCAL_BUSINESS_SCHEMA, getFaqSchema } from "@/lib/schema";
import type { CityLpData } from "@/data/city-lp-content";

/**
 * Dedicated high-conversion city siding LP (/lp/{city}-siding), driven by
 * CityLpData. Same structure across cities; only hyperlocal copy changes.
 * Standalone from the shared /locations template. All claims sourced from
 * approved site data (STATS, PROCESS_STEPS, GREENSKY_*, buildFaqs).
 */

const CREDENTIALS = [
  "James Hardie Elite · Top 2%",
  "550+ Five-Star Reviews",
  "BBB A+ Accredited",
  "Best of Houzz 2026",
  "Licensed GA GC #RBQA006789",
  "20+ Years · 1,500+ Homes",
];

const HARDIE_BENEFITS = [
  {
    Icon: Paintbrush,
    title: "Stop repainting every few years",
    desc: "ColorPlus® Technology is baked on in the factory and keeps its finish 30% longer than traditional paint. No more peeling, blistering or repaint cycles.",
  },
  {
    Icon: ShieldCheck,
    title: "Engineered to outlast the house payment",
    desc: "Fiber cement is engineered for 50+ years and backed by a 30-year limited transferable product warranty — plus our own workmanship guarantee.",
  },
  {
    Icon: Flame,
    title: "Won't rot, warp, burn or feed termites",
    desc: "HardieZone® HZ10 boards are built specifically for the humid Southeast. Non-combustible, moisture-resistant and nothing for pests to eat.",
  },
  {
    Icon: BadgeCheck,
    title: "Installed by the top 2% — not a subcontractor",
    desc: "As an Elite Preferred Contractor, our in-house, Hardie-trained crews install to manufacturer spec — the detail that keeps your warranty valid.",
  },
];

/** Lead-source prefix, e.g. "lp_marietta_siding". */
function leadSource(data: CityLpData) {
  return `lp_${data.routeSlug.replace(/-/g, "_")}`;
}

/**
 * TanStack Router `head` payload for a city LP route.
 * Paid-media only: noindex + canonical to the organic /locations/{city}/siding
 * page so the LP never competes with it in the SERP.
 */
export function cityLpHead(data: CityLpData) {
  const url = `${SITE_ORIGIN}/lp/${data.routeSlug}`;
  const citySlug = data.routeSlug.replace(/-siding$/, "");
  const canonicalUrl = `${SITE_ORIGIN}/locations/${citySlug}/siding`;
  const title = `James Hardie Siding in ${data.city}, GA | Free Estimate + Financing — Siding Depot`;
  const description = `${data.city}'s James Hardie Elite siding contractor. Fiber cement & vinyl siding installation, replacement & repair in ${data.county}. 550+ 5-star reviews, 0% APR financing, free estimate.`;
  const localBusiness = {
    ...LOCAL_BUSINESS_SCHEMA,
    name: `Siding Depot — ${data.city}`,
    url,
    areaServed: { "@type": "City", name: `${data.city}, GA` },
  };
  return {
    meta: [
      { title },
      { name: "robots", content: "noindex, follow" },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: url },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: canonicalUrl }],
    scripts: [
      { type: "application/ld+json", children: JSON.stringify(localBusiness) },
      {
        type: "application/ld+json",
        children: JSON.stringify(getFaqSchema([...buildFaqs(data.city)])),
      },
    ],
  };
}

export function CitySidingLP({ data }: { data: CityLpData }) {
  const { city, county, neighborhoods, zips, intro, challenges, localNote } = data;
  const source = leadSource(data);
  const faqs = buildFaqs(city);

  return (
    <>
      {/* ── 1. HERO (above the fold) — headline + form ───────────────────── */}
      <section className="relative bg-sd-navy text-white">
        <div
          className="absolute inset-0 opacity-20 bg-cover bg-center"
          style={{ backgroundImage: "url(/hero-home.webp)" }}
          aria-hidden
        />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-20 lg:items-center">
          <div>
            <span className="inline-block rounded bg-sd-green px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-sd-navy">
              {city}, GA · Rated 4.7★ by 512+ verified homeowners
            </span>
            <h1 className="mt-5 font-display text-4xl leading-[1.05] sm:text-5xl">
              James Hardie Siding in {city} —{" "}
              <span className="text-sd-green">Installed Once, Beautiful for Decades</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-white/80">
              Rotting boards? Paint that peels every other summer? Replace it once — with fiber
              cement engineered for Georgia humidity, installed by the top 2% of James Hardie
              contractors in the country. Free itemized estimate within 24 hours.
            </p>
            <ul className="mt-6 grid gap-2 sm:grid-cols-2">
              {[
                "Itemized estimate in 24 hours — the price we quote is the price you pay",
                "0% APR financing up to $65,000 · 60-second approval",
                "30-year transferable warranty + workmanship guarantee",
                "In-house crews · most installs done in 3–7 days",
              ].map((b) => (
                <li key={b} className="flex items-start gap-2 text-white/90">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-sd-green" />
                  <span className="text-sm font-medium">{b}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full border-white px-8 py-6 text-base text-white hover:bg-white hover:text-sd-navy"
              >
                <a href={SITE.phoneHref}>
                  <Phone className="mr-2 h-5 w-5" />
                  Call {SITE.phone}
                </a>
              </Button>
            </div>
          </div>

          {/* Lead capture form */}
          <div className="lg:justify-self-end">
            <HeroQuoteForm source={source} tag={`${source}_hero`} />
          </div>
        </div>
      </section>

      {/* ── 2. TRUST BAR ─────────────────────────────────────────────────── */}
      <section className="border-b border-sd-gray-bg bg-white py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 lg:flex-row lg:justify-between lg:px-8">
          <div className="flex items-center gap-4">
            <img
              src={jamesHardieElite}
              alt="James Hardie Elite Preferred Contractor badge"
              className="h-16 w-auto"
            />
            <div>
              <p className="font-display text-lg text-sd-navy">Elite Preferred Contractor</p>
              <p className="text-xs text-sd-gray-text">
                Top 2% of James Hardie installers nationwide
              </p>
            </div>
          </div>
          <ul className="flex flex-wrap justify-center gap-2">
            {CREDENTIALS.map((c) => (
              <li
                key={c}
                className="rounded-full bg-sd-green-pale px-3 py-1 text-xs font-bold text-sd-green-text"
              >
                {c}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── 3. OFFER BAND ────────────────────────────────────────────────── */}
      <section className="bg-sd-green">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-6 text-center sm:flex-row sm:justify-between sm:text-left lg:px-8">
          <p className="text-lg font-extrabold text-sd-navy">
            Free {city} siding inspection + itemized estimate in 24 hours.{" "}
            <span className="font-bold">We're booking 3–4 weeks out — lock in your spot.</span>
          </p>
          <Button
            asChild
            size="lg"
            className="shrink-0 rounded-full bg-sd-navy px-8 py-6 text-base font-bold text-white hover:bg-sd-navy/90"
          >
            <a href="#quote">Claim my free estimate</a>
          </Button>
        </div>
      </section>

      {/* ── 4. PAIN / WARNING SIGNS (agitation) ──────────────────────────── */}
      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-4xl px-4 lg:px-8">
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-1 text-xs font-bold uppercase tracking-wide text-amber-800">
              <AlertTriangle className="h-4 w-4" /> Homeowner warning signs
            </span>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-sd-black sm:text-4xl">
              Georgia humidity is quietly eating your siding
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-sd-gray-text">
              Moisture always moves inward: first the siding, then the sheathing, then the framing
              behind it. The earlier you catch it, the smaller the project. Walk your exterior and
              look for these four signs:
            </p>
          </div>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2">
            {challenges.map((c) => (
              <li
                key={c}
                className="flex gap-3 rounded-xl border border-sd-gray-bg bg-sd-gray-bg/40 p-5 text-sd-black"
              >
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                <span className="font-medium">{c}</span>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-center text-sd-gray-text">
            See even one of these on your {city} home?{" "}
            <a href="#quote" className="font-bold text-sd-navy underline underline-offset-4">
              Get it inspected free
            </a>{" "}
            — before a cosmetic fix becomes a structural one.
          </p>
        </div>
      </section>

      {/* ── 5. STATS STRIP ───────────────────────────────────────────────── */}
      <section className="bg-sd-navy py-10">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 text-center text-white sm:grid-cols-4 lg:px-8">
          {STATS.map((s) => (
            <div key={s.label}>
              <p className="font-display text-3xl text-sd-green sm:text-4xl">{s.value}</p>
              <p className="mt-1 text-sm text-white/70">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 6. BEFORE / AFTER ────────────────────────────────────────────── */}
      <section className="bg-sd-gray-bg py-16 lg:py-24">
        <div className="mx-auto max-w-6xl px-4 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-sd-black">
              Before &amp; after — real James Hardie results
            </h2>
            <p className="mt-3 text-sd-gray-text">
              Same home, transformed. Drag the slider to see it.
            </p>
          </div>
          <div className="grid gap-8 lg:grid-cols-2">
            {BEFORE_AFTER_PAIRS.map((p) => (
              <div key={p.after} className="overflow-hidden rounded-2xl shadow-lg">
                <BeforeAfterSlider
                  before={p.before}
                  after={p.after}
                  beforeAlt={p.beforeAlt}
                  afterAlt={p.afterAlt}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. WHY JAMES HARDIE (benefits) ───────────────────────────────── */}
      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-6xl px-4 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-sd-black sm:text-4xl">
              Why {city} homeowners choose James Hardie fiber cement
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-sd-gray-text">
              This isn't a repaint or a patch. It's the last siding decision you should ever have to
              make on this house.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {HARDIE_BENEFITS.map(({ Icon, title, desc }) => (
              <div key={title} className="rounded-2xl border border-sd-gray-bg p-6">
                <Icon className="h-8 w-8 text-sd-green" />
                <h3 className="mt-4 font-display text-xl text-sd-navy">{title}</h3>
                <p className="mt-2 leading-relaxed text-sd-gray-text">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. WHY {CITY} (100% local) ───────────────────────────────────── */}
      <section className="bg-sd-gray-bg py-16 lg:py-24">
        <div className="mx-auto max-w-4xl px-4 lg:px-8">
          <h2 className="text-3xl font-extrabold tracking-tight text-sd-black sm:text-4xl">
            Siding built for {city}'s climate
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-sd-gray-text">{intro}</p>
          {localNote && (
            <p className="mt-4 text-lg font-semibold leading-relaxed text-sd-navy">{localNote}</p>
          )}

          <div className="mt-10 rounded-2xl bg-sd-navy px-6 py-6 text-center text-white">
            <p className="font-display text-xl">
              Proudly serving {city}, {county}
            </p>
            <p className="mt-2 text-white/80">{neighborhoods}</p>
            <p className="mt-2 text-sm font-semibold text-sd-green">ZIP codes: {zips}</p>
          </div>
        </div>
      </section>

      {/* ── 9. PROCESS (how it works) ────────────────────────────────────── */}
      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-6xl px-4 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-sd-black sm:text-4xl">
              What working with Siding Depot looks like
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-sd-gray-text">
              No mystery, no chasing your contractor. A dedicated project manager, our own crews,
              and a customer portal that shows you exactly what's happening — every day.
            </p>
          </div>
          <ol className="grid gap-6 md:grid-cols-3 lg:grid-cols-5">
            {PROCESS_STEPS.map((s) => (
              <li key={s.num} className="rounded-2xl border border-sd-gray-bg p-5">
                <span className="font-display text-2xl text-sd-green">{s.num}</span>
                <h3 className="mt-2 font-display text-lg text-sd-navy">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-sd-gray-text">{s.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── 10. FINANCING (objection: cost) ──────────────────────────────── */}
      <section className="bg-sd-navy py-16 lg:py-24 text-white">
        <div className="mx-auto max-w-6xl px-4 lg:px-8">
          <div className="mb-12 text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-sd-green px-4 py-1 text-xs font-bold uppercase tracking-wide text-sd-navy">
              <Clock className="h-4 w-4" /> 60-second approval
            </span>
            <h2 className="mt-4 font-display text-3xl sm:text-4xl">
              New siding without touching your savings
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80">
              Through GreenSky®, most homeowners are pre-approved during the estimate — 0% APR
              promotional plans, up to $65,000, no prepayment penalty.
            </p>
          </div>
          <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {GREENSKY_STEPS.map((s) => (
              <li key={s.step} className="rounded-2xl bg-white/5 p-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sd-green font-display text-lg text-sd-navy">
                  {s.step}
                </span>
                <h3 className="mt-4 font-display text-lg">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/70">{s.desc}</p>
              </li>
            ))}
          </ol>
          <div className="mt-10 text-center">
            <Button
              asChild
              size="lg"
              className="rounded-full bg-sd-green px-8 py-6 text-base font-bold text-sd-navy hover:bg-sd-green/90"
            >
              <a href="#quote">Check my options — free estimate</a>
            </Button>
          </div>
        </div>
      </section>

      {/* ── 11. BRANDS CAROUSEL ──────────────────────────────────────────── */}
      <PartnersCarousel />

      {/* ── 12. REVIEWS ──────────────────────────────────────────────────── */}
      <section className="bg-sd-gray-bg py-16 lg:py-24">
        <div className="mx-auto max-w-5xl px-4 lg:px-8">
          <div className="mb-3 flex items-center justify-center gap-1 text-sd-green">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-5 w-5 fill-current" />
            ))}
          </div>
          <h2 className="text-center text-3xl font-extrabold tracking-tight text-sd-black">
            What {city} homeowners say
          </h2>
          <p className="mb-10 text-center font-semibold text-sd-gray-text">
            550+ five-star reviews · 4.7★ across Google, GuildQuality &amp; Angi
          </p>
          <div className="grid gap-5 md:grid-cols-2">
            <TestimonialCard
              name="Verified Google Review"
              city={city}
              text="The Siding Depot team made our James Hardie project effortless. Best decision we made this year — the finish is incredible."
            />
            <TestimonialCard
              name="Verified Google Review"
              city={city}
              text="On time, on budget, no surprises. The crew respected our property and kept us updated the whole way through."
            />
          </div>
        </div>
      </section>

      {/* ── 13. FAQ (schema in head) ─────────────────────────────────────── */}
      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-3xl px-4 lg:px-8">
          <h2 className="text-center text-3xl font-extrabold tracking-tight text-sd-black">
            {city} siding — straight answers
          </h2>
          <p className="mt-3 text-center text-sd-gray-text">
            Including the one everyone wants first: what it costs.
          </p>
          <div className="mt-10 divide-y divide-sd-gray-bg">
            {faqs.map((f) => (
              <div key={f.q} className="py-5">
                <h3 className="font-display text-lg text-sd-navy">{f.q}</h3>
                <p className="mt-2 leading-relaxed text-sd-gray-text">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 14. FINAL CTA (form anchor) ──────────────────────────────────── */}
      <section id="quote" className="bg-sd-navy py-16 lg:py-24">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 lg:grid-cols-2 lg:items-center lg:px-8">
          <div className="text-white">
            <h2 className="font-display text-3xl sm:text-4xl">
              Get the exact number for your {city} home — free
            </h2>
            <p className="mt-4 text-lg text-white/80">
              A Hardie-trained specialist inspects your siding, walks you through options, and hands
              you a written, itemized estimate within 24 hours. No pressure, no games — the price we
              quote is the price you pay.
            </p>
            <ul className="mt-6 space-y-2">
              {[
                `Serving all of ${city} and ${county}`,
                "30-year transferable warranty + workmanship guarantee",
                "Booking 3–4 weeks out — reserve your spot today",
              ].map((b) => (
                <li key={b} className="flex items-start gap-2 text-white/90">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-sd-green" />
                  <span className="font-medium">{b}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full border-white px-8 py-6 text-base text-white hover:bg-white hover:text-sd-navy"
              >
                <a href={SITE.phoneHref}>
                  <Phone className="mr-2 h-5 w-5" />
                  Call {SITE.phone}
                </a>
              </Button>
            </div>
          </div>
          <div className="lg:justify-self-end">
            <HeroQuoteForm source={source} tag={`${source}_footer`} />
          </div>
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
    </>
  );
}
