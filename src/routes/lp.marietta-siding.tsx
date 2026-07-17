import { createFileRoute } from "@tanstack/react-router";
import {
  Phone,
  CheckCircle2,
  Star,
  Home,
  Layers,
  Droplets,
  Paintbrush,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import { HeroQuoteForm } from "@/components/site/HeroQuoteForm";
import { Button } from "@/components/ui/button";
import { BeforeAfterSlider } from "@/components/site/BeforeAfterSlider";
import { PartnersCarousel } from "@/components/site/PartnersCarousel";
import { TestimonialCard } from "@/components/site/TestimonialCard";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import jamesHardieElite from "@/assets/james-hardie-elite-contractor.png";
import { SITE, STATS, PROJECTS, BEFORE_AFTER_PAIRS } from "@/data/site";
import { buildFaqs, GREENSKY_STEPS } from "@/data/lp-content";
import { CITY_LPS } from "@/data/city-lp-content";
import { SITE_ORIGIN } from "@/data/locations";
import { LOCAL_BUSINESS_SCHEMA, getFaqSchema } from "@/lib/schema";

/*
 * Marietta siding LP v3 — paid traffic only (noindex + canonical to
 * /locations/marietta/siding). Block-based layout modeled on the local pages
 * of the two benchmark competitors: alternating text+image blocks, real
 * project photos from this site, era-segmented Marietta copy, repair-vs-
 * replace decision framework, collapsed accordion FAQ. All claims from
 * approved site data.
 */

const CITY = CITY_LPS.marietta;
const SOURCE = "lp_marietta_siding";
const faqs = buildFaqs("Marietta");

/** Housing eras of Marietta — the local knowledge block competitors can't template. */
const ERAS = [
  {
    title: "Marietta Square & Historic District",
    era: "1880s–1940s",
    desc: "Victorian and Craftsman homes with original wood siding and trim detail. We repair or replace while matching the historic profile — not erasing it.",
  },
  {
    title: "Whitlock & Kennestone corridors",
    era: "1950s–1960s",
    desc: "Ranches and split-levels wearing 60-year-old cladding. Most of what we replace here is hardboard at true end-of-life.",
  },
  {
    title: "East Cobb subdivisions",
    era: "1970s–1990s",
    desc: "Indian Hills, Sandy Plains, Powers Ferry corridor: first-generation Masonite that Georgia humidity has been eating for decades. Our most common full-replacement call.",
  },
  {
    title: "Newer infill & townhomes",
    era: "2000s+",
    desc: "Builder-grade siding installed fast, failing early. We re-side to James Hardie spec so it's done once, correctly.",
  },
];

const SERVICE_MODES = [
  {
    Icon: Home,
    title: "Full Replacement",
    desc: "Old wood, Masonite or vinyl off — James Hardie fiber cement on. The last siding decision this house will need.",
  },
  {
    Icon: Layers,
    title: "New Installation",
    desc: "Additions, gables and new construction, installed to HardieZone® HZ10 spec so the warranty holds.",
  },
];

const DECISION_TIERS = [
  {
    Icon: Paintbrush,
    title: "Cosmetic wear only",
    verdict: "Repaint or spot-repair",
    desc: "Fading, chalking, a couple of tired boards. We'll tell you honestly when paint is the smarter spend — and we do that too.",
  },
  {
    Icon: Droplets,
    title: "Localized moisture",
    verdict: "Targeted repair",
    desc: "Soft boards on one elevation, rot around windows or behind gutters. Repair the area, fix the flashing, stop the spread.",
  },
  {
    Icon: AlertTriangle,
    title: "System-wide failure",
    verdict: "Replacement",
    desc: "Swelling, rot or repeat paint failure on multiple sides. Patching a failing system costs more over 5 years than replacing it once.",
  },
];

export const Route = createFileRoute("/lp/marietta-siding")({
  head: () => {
    const url = `${SITE_ORIGIN}/lp/marietta-siding`;
    const canonicalUrl = `${SITE_ORIGIN}/locations/marietta/siding`;
    const title = "James Hardie Siding in Marietta, GA | Free Estimate + Financing — Siding Depot";
    const description =
      "Marietta's James Hardie Elite siding contractor. Full fiber cement siding replacement & new installation in Cobb County. 550+ 5-star reviews, 0% APR financing, free estimate.";
    const localBusiness = {
      ...LOCAL_BUSINESS_SCHEMA,
      name: "Siding Depot — Marietta",
      url,
      areaServed: { "@type": "City", name: "Marietta, GA" },
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
        { type: "application/ld+json", children: JSON.stringify(getFaqSchema([...faqs])) },
      ],
    };
  },
  component: MariettaSidingLP,
});

function MariettaSidingLP() {
  return (
    <>
      {/* ── 1. HERO — real Marietta project photo + form ─────────────────── */}
      <section className="relative bg-sd-navy text-white">
        <div
          className="absolute inset-0 opacity-25 bg-cover bg-center"
          style={{ backgroundImage: "url(/projects/project-1.webp)" }}
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-sd-navy/90 via-sd-navy/70 to-transparent"
          aria-hidden
        />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-20 lg:items-center">
          <div>
            <span className="inline-block rounded bg-sd-green px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-sd-navy">
              Marietta, GA · Headquartered on Roswell Rd
            </span>
            <h1 className="mt-5 font-display text-4xl leading-[1.05] sm:text-5xl">
              James Hardie Siding in <span className="text-sd-green">Marietta, GA</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-white/85">
              Repair, replacement and installation by the{" "}
              <strong>top 2% of James Hardie contractors in the country</strong> — headquartered
              right here in Marietta.
            </p>
            <ul className="mt-6 grid gap-2 sm:grid-cols-2">
              {[
                "Itemized estimate in 24 hours — fixed price",
                "0% APR financing up to $65,000",
                "30-year transferable warranty",
                "In-house crews · 3–7 day installs",
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
          <div className="lg:justify-self-end">
            <HeroQuoteForm source={SOURCE} tag={`${SOURCE}_hero`} />
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
            {[
              "550+ Five-Star Reviews",
              "BBB A+",
              "Best of Houzz 2026",
              "Licensed GA GC #RBQA006789",
              "20+ Years · 1,500+ Homes",
            ].map((c) => (
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
            Free Marietta siding inspection + itemized estimate in 24 hours.{" "}
            <span className="font-bold">Booking 3–4 weeks out — lock in your spot.</span>
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

      {/* ── 4. TEXT + IMAGE — we know Marietta homes by era ──────────────── */}
      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 lg:grid-cols-2 lg:px-8">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-sd-black sm:text-4xl">
              We know Marietta homes <span className="text-sd-green-text">by era</span>
            </h2>
            <p className="mt-4 text-lg text-sd-gray-text">
              The right siding plan depends on when your home was built and what's on the walls
              today. After 20+ years and 1,500+ North Atlanta homes, we've re-sided every era
              Marietta has:
            </p>
            <div className="mt-6 space-y-4">
              {ERAS.map((e) => (
                <div key={e.title} className="rounded-xl border border-sd-gray-bg p-4">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-display text-base text-sd-navy">{e.title}</h3>
                    <span className="shrink-0 rounded-full bg-sd-green-pale px-2.5 py-0.5 text-xs font-bold text-sd-green-text">
                      {e.era}
                    </span>
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed text-sd-gray-text">{e.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <figure className="lg:justify-self-end">
            <img
              src="/projects/project-6.webp"
              alt="Three-story Marietta home re-sided with James Hardie by Siding Depot, with bold blue siding and white trim"
              className="w-full rounded-2xl object-cover shadow-xl"
              loading="lazy"
            />
            <figcaption className="mt-3 text-center text-sm text-sd-gray-text">
              Hardie siding, repaint &amp; rebuilt deck — Marietta, GA
            </figcaption>
          </figure>
        </div>
      </section>

      {/* ── 5. SERVICE MODES — repair / replace / install ────────────────── */}
      <section className="bg-sd-gray-bg py-16 lg:py-24">
        <div className="mx-auto max-w-6xl px-4 lg:px-8">
          <h2 className="text-center text-3xl font-extrabold tracking-tight text-sd-black sm:text-4xl">
            Full siding replacement &amp; new installation in Marietta
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {SERVICE_MODES.map(({ Icon, title, desc }) => (
              <div key={title} className="rounded-2xl bg-white p-7 shadow-sm">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sd-green-pale">
                  <Icon className="h-6 w-6 text-sd-green-text" />
                </span>
                <h3 className="mt-4 font-display text-xl text-sd-navy">{title}</h3>
                <p className="mt-2 leading-relaxed text-sd-gray-text">{desc}</p>
                <a
                  href="#quote"
                  className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-sd-navy hover:text-sd-green-text"
                >
                  Get my estimate <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. DECISION FRAMEWORK — repair or replace? ───────────────────── */}
      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-6xl px-4 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-sd-black sm:text-4xl">
              Repair or replace? The honest answer.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-sd-gray-text">
              Not every Marietta home needs new siding — and we'll say so. Here's the framework our
              estimators use on your free inspection:
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {DECISION_TIERS.map(({ Icon, title, verdict, desc }) => (
              <div key={title} className="rounded-2xl border border-sd-gray-bg p-7">
                <Icon className="h-8 w-8 text-sd-green" />
                <h3 className="mt-4 font-display text-lg text-sd-navy">{title}</h3>
                <p className="mt-1 text-sm font-bold uppercase tracking-wide text-sd-green-text">
                  → {verdict}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-sd-gray-text">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. BEFORE / AFTER ────────────────────────────────────────────── */}
      <section className="bg-sd-gray-bg py-16 lg:py-24">
        <div className="mx-auto max-w-6xl px-4 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-sd-black">
              Before &amp; after — real James Hardie results
            </h2>
            <p className="mt-3 text-sd-gray-text">Same home, transformed. Drag the slider.</p>
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

      {/* ── 8. FEATURED MARIETTA PROJECTS (real, titled) ─────────────────── */}
      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-6xl px-4 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-sd-black sm:text-4xl">
              Recent Siding Depot projects in Marietta
            </h2>
            <p className="mt-3 text-sd-gray-text">
              Real Cobb County homes from our portfolio —{" "}
              <a href="/projects" className="font-bold text-sd-navy underline underline-offset-4">
                see all projects
              </a>
              .
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            {PROJECTS.map((p) => (
              <article
                key={p.slug}
                className="overflow-hidden rounded-2xl border border-sd-gray-bg shadow-sm"
              >
                <img src={p.src} alt={p.alt} className="h-64 w-full object-cover" loading="lazy" />
                <div className="p-6">
                  <p className="text-xs font-bold uppercase tracking-wide text-sd-green-text">
                    {p.category}
                  </p>
                  <h3 className="mt-1 font-display text-lg text-sd-navy">{p.title}</h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {p.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full bg-sd-gray-bg px-2.5 py-0.5 text-xs font-semibold text-sd-gray-text"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── 9. STATS STRIP ───────────────────────────────────────────────── */}
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

      {/* ── 10. IMAGE + TEXT — why Hardie fiber cement ───────────────────── */}
      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 lg:grid-cols-2 lg:px-8">
          <figure className="order-2 lg:order-1">
            <img
              src="/projects/project-3.webp"
              alt="Home exterior finished with James Hardie fiber cement siding by Siding Depot"
              className="w-full rounded-2xl object-cover shadow-xl"
              loading="lazy"
            />
          </figure>
          <div className="order-1 lg:order-2">
            <h2 className="text-3xl font-extrabold tracking-tight text-sd-black sm:text-4xl">
              Why fiber cement wins in <span className="text-sd-green-text">Georgia humidity</span>
            </h2>
            <ul className="mt-6 space-y-4">
              {[
                [
                  "Never repaint every few years",
                  "ColorPlus® factory finish holds 30% longer than traditional paint.",
                ],
                [
                  "Engineered for 50+ years",
                  "30-year limited transferable product warranty + our workmanship guarantee.",
                ],
                [
                  "Won't rot, warp, burn or feed termites",
                  "HardieZone® HZ10 boards, made for the humid Southeast.",
                ],
                [
                  "Installed to manufacturer spec",
                  "Elite Preferred in-house crews — the detail that keeps the warranty valid.",
                ],
              ].map(([t, d]) => (
                <li key={t} className="flex gap-3">
                  <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-sd-green" />
                  <div>
                    <p className="font-bold text-sd-black">{t}</p>
                    <p className="text-sm text-sd-gray-text">{d}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── 11. IMAGE + TEXT — crew & process ────────────────────────────── */}
      <section className="bg-sd-gray-bg py-16 lg:py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 lg:grid-cols-2 lg:px-8">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-sd-black sm:text-4xl">
              Our crews. Our project manager. <span className="text-sd-green-text">Your app.</span>
            </h2>
            <p className="mt-4 text-lg text-sd-gray-text">
              No subcontractor roulette. Here's the whole journey:
            </p>
            <ol className="mt-6 space-y-3">
              {[
                "Consultation — itemized written estimate within 24 hours",
                "Approval & planning — start date on your schedule",
                "Customer portal — track progress, photos and documents in the Siding Depot app",
                "Installation — in-house crews, home never left exposed overnight",
                "Final walkthrough — done when you say it's done",
              ].map((step, i) => (
                <li key={step} className="flex items-start gap-3 rounded-xl bg-white p-4">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sd-green font-display text-sm text-sd-navy">
                    {i + 1}
                  </span>
                  <span className="text-sm font-medium text-sd-black">{step}</span>
                </li>
              ))}
            </ol>
          </div>
          <figure className="lg:justify-self-end">
            <img
              src="/siding-installation-crews.webp"
              alt="Siding Depot in-house crew installing James Hardie siding"
              className="w-full rounded-2xl object-cover shadow-xl"
              loading="lazy"
            />
            <figcaption className="mt-3 text-center text-sm text-sd-gray-text">
              Siding Depot in-house installation crew at work
            </figcaption>
          </figure>
        </div>
      </section>

      {/* ── 12. FINANCING BAND ───────────────────────────────────────────── */}
      <section className="bg-sd-navy py-16 lg:py-24 text-white">
        <div className="mx-auto max-w-6xl px-4 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="font-display text-3xl sm:text-4xl">
              New siding without touching your savings
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80">
              GreenSky® 0% APR plans up to $65,000 — most homeowners approved in 60 seconds during
              the estimate.
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
        </div>
      </section>

      {/* ── 13. BRANDS ───────────────────────────────────────────────────── */}
      <PartnersCarousel />

      {/* ── 14. REVIEWS ──────────────────────────────────────────────────── */}
      <section className="bg-sd-gray-bg py-16 lg:py-24">
        <div className="mx-auto max-w-5xl px-4 lg:px-8">
          <div className="mb-3 flex items-center justify-center gap-1 text-sd-green">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-5 w-5 fill-current" />
            ))}
          </div>
          <h2 className="text-center text-3xl font-extrabold tracking-tight text-sd-black">
            What Marietta homeowners say
          </h2>
          <p className="mb-10 text-center font-semibold text-sd-gray-text">
            550+ five-star reviews · 4.7★ across Google, GuildQuality &amp; Angi
          </p>
          <div className="grid gap-5 md:grid-cols-2">
            <TestimonialCard
              name="Verified Google Review"
              city="Marietta"
              text="The Siding Depot team made our James Hardie project effortless. Best decision we made this year — the finish is incredible."
            />
            <TestimonialCard
              name="Verified Google Review"
              city="Marietta"
              text="On time, on budget, no surprises. The crew respected our property and kept us updated the whole way through."
            />
          </div>
        </div>
      </section>

      {/* ── 15. FAQ — collapsed accordion ────────────────────────────────── */}
      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-3xl px-4 lg:px-8">
          <h2 className="text-center text-3xl font-extrabold tracking-tight text-sd-black">
            Marietta siding — straight answers
          </h2>
          <p className="mt-3 text-center text-sd-gray-text">
            Starting with the one everyone asks first: price.
          </p>
          <Accordion type="single" collapsible className="mt-10">
            {faqs.map((f) => (
              <AccordionItem key={f.q} value={f.q}>
                <AccordionTrigger className="text-left font-display text-base text-sd-navy hover:text-sd-green-text">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="leading-relaxed text-sd-gray-text">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ── 16. FINAL CTA + local proof ──────────────────────────────────── */}
      <section id="quote" className="bg-sd-navy py-16 lg:py-24">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 lg:grid-cols-2 lg:items-center lg:px-8">
          <div className="text-white">
            <h2 className="font-display text-3xl sm:text-4xl">
              Get the exact number for your Marietta home — free
            </h2>
            <p className="mt-4 text-lg text-white/80">
              A Hardie-trained specialist inspects your siding and hands you a written, itemized
              estimate within 24 hours. <strong>The price we quote is the price you pay.</strong>
            </p>
            <div className="mt-6 rounded-2xl bg-white/5 px-5 py-4">
              <p className="font-display text-base text-sd-green">
                Proudly serving Marietta &amp; Cobb County
              </p>
              <p className="mt-1 text-sm text-white/75">{CITY.neighborhoods}</p>
              <p className="mt-1 text-xs font-semibold text-white/60">ZIP codes: {CITY.zips}</p>
            </div>
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
            <HeroQuoteForm source={SOURCE} tag={`${SOURCE}_footer`} />
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
