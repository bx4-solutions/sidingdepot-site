import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Check,
  Phone,
  ShieldCheck,
  Star,
  CreditCard,
  MapPin,
  Flame,
  Droplets,
  Bug,
  CircleDollarSign,
} from "lucide-react";
import { HeroQuoteForm } from "@/components/site/HeroQuoteForm";
import { Button } from "@/components/ui/button";
import { BeforeAfterSlider } from "@/components/site/BeforeAfterSlider";
import { PartnersCarousel } from "@/components/site/PartnersCarousel";
import { GoogleReviewsCarousel } from "@/components/site/GoogleReviewsCarousel";
import { EliteBadgeSection } from "@/components/site/EliteBadgeSection";
import { MapEmbed } from "@/components/site/MapEmbed";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SITE, BEFORE_AFTER_PAIRS } from "@/data/site";
import { SITE_ORIGIN } from "@/data/locations";
import { LOCAL_BUSINESS_SCHEMA, getFaqSchema, getServiceSchema } from "@/lib/schema";

/**
 * /atlanta-ga-siding — INDEXABLE Atlanta SEO money page.
 * Look-and-feel mirrors /referral (editorial font-display headings, alternating
 * white / bg-sd-green-pale sections, rounded-[2rem] image cards with an offset
 * backing panel + floating white badge, oversized numbered steps, pill buttons).
 * Indexable head/canonical/JSON-LD pattern borrowed from marietta-ga-siding.
 * Business rule: installation / replacement / re-side only — NO repair wording.
 */

const SOURCE = "atlanta_ga_siding_page";

const IMG_HERO = "/hero-home.webp";

const OFFERINGS = [
  {
    title: "James Hardie fiber cement",
    desc: "A 30-year transferable warranty, available only through Elite Contractors like us. Installed to HardieZone HZ10 spec for Georgia weather.",
  },
  {
    title: "Full re-side & storm restoration",
    desc: "Whole-home or single-elevation siding replacement, plus storm-damage restoration with full insurance documentation.",
  },
  {
    title: "New construction & design",
    desc: "Lap, board-and-batten, shake, trim, soffit and fascia — color-planned to fit your home's architecture and HOA review.",
  },
  {
    title: "Fixed price in writing",
    desc: "An itemized estimate in 24 hours, with 0% APR financing up to $65,000 for qualified Atlanta homeowners.",
  },
];

const STORY = [
  {
    number: "01",
    eyebrow: "A SPECIALIST, NOT A GENERALIST",
    title: "Why Atlanta homeowners choose Siding Depot.",
    text: "Plenty of siding contractors in Atlanta GA hand your project to whichever crew is free that week. We don't. Every Atlanta job is completed by our own certified in-house crews — never subcontractors — with one dedicated project manager from tear-off to final walkthrough.",
    detail:
      "Transparent, itemized pricing. No subcontractor markups. The price we quote is the price you pay.",
    image: "/projects/project-1.webp",
    alt: "Atlanta home finished with new James Hardie siding by Siding Depot",
  },
  {
    number: "02",
    eyebrow: "THE MATERIAL",
    title: "Why James Hardie siding for Atlanta.",
    text: "James Hardie siding in Atlanta is engineered for Georgia's heat, humidity and storms. The baked-on ColorPlus finish holds for decades, and installing to HZ10 specification keeps your 30-year, non-prorated, transferable warranty valid for the life of the product.",
    detail: "Fire-resistant, rot-proof and pest-resistant — unlike wood or vinyl.",
    image: "/projects/project-6.webp",
    alt: "Close-up of new James Hardie lap siding installed on an Atlanta home",
  },
];

const PRODUCT_POINTS = [
  { icon: Flame, t: "Fire-resistant", d: "Non-combustible fiber cement." },
  { icon: Droplets, t: "Rot & moisture-proof", d: "Built for Atlanta humidity and storms." },
  { icon: Bug, t: "Pest-resistant", d: "Termites can't feed on it." },
];

const STEPS = [
  {
    n: "01",
    t: "Free on-site inspection",
    d: "We assess your Atlanta home and measure everything — at no cost.",
  },
  {
    n: "02",
    t: "Itemized quote in 24h",
    d: "A written price with every line detailed. No surprises, no markups.",
  },
  {
    n: "03",
    t: "Elite installation",
    d: "Our own certified crew installs James Hardie to HZ10 spec.",
  },
  {
    n: "04",
    t: "30-year warranty",
    d: "Transferable product warranty plus our workmanship guarantee.",
  },
];

const SERVICE_LINKS: ReadonlyArray<{ label: string; to: string }> = [
  { label: "James Hardie Siding", to: "/siding" },
  { label: "Exterior Painting", to: "/painting" },
  { label: "Gutter Systems", to: "/gutters" },
  { label: "Windows", to: "/windows" },
  { label: "Entry & Patio Doors", to: "/doors" },
  { label: "Deck Construction", to: "/decks" },
  { label: "Roofing", to: "/roofing" },
  { label: "Financing", to: "/finance" },
];

const AREA_LINKS: ReadonlyArray<{ label: string; to?: string }> = [
  { label: "Marietta", to: "/marietta-ga-siding" },
  { label: "Alpharetta", to: "/alpharetta-ga-siding" },
  { label: "Kennesaw" },
  { label: "Woodstock" },
  { label: "Roswell" },
  { label: "Acworth" },
  { label: "Canton" },
  { label: "Johns Creek" },
  { label: "Milton" },
  { label: "Sandy Springs" },
  { label: "East Cobb" },
  { label: "Smyrna" },
];

const FAQS = [
  {
    q: "How much does siding installation cost in Atlanta?",
    a: "Every home is different, so we give you a written, itemized estimate within 24 hours — and the price we quote is the price you pay. As a general guide, full siding installation and replacement in the Atlanta area typically ranges from $25,000 to $65,000 depending on home size, tear-off, and whether you choose James Hardie HZ10 fiber cement over vinyl. GreenSky 0% APR financing up to $65,000 is available for qualified homeowners (subject to credit approval).",
  },
  {
    q: "Do you install James Hardie siding in Atlanta?",
    a: "Yes. We are a James Hardie Elite Contractor — the top 2% of installers nationwide — serving all of Metro Atlanta. Every James Hardie siding Atlanta project is installed to HardieZone HZ10 specification, which keeps your 30-year, non-prorated, transferable product warranty valid for the life of the product.",
  },
  {
    q: "Do you use subcontractors?",
    a: "No. Every Atlanta siding job is completed by our own certified in-house crews, with one dedicated project manager per project. That means consistent quality, no subcontractor markups, and no finger-pointing if a question comes up.",
  },
  {
    q: "How long does a full re-side take in Atlanta?",
    a: "A typical full re-side takes about one to two weeks depending on the size of your home, the scope of work, and weather. We coordinate planning, permitting, and material deliveries so your Atlanta siding replacement stays on schedule from start to final walkthrough.",
  },
  {
    q: "Do you offer financing?",
    a: "Yes. Qualified Atlanta homeowners can finance up to $65,000 at 0% APR for 12 months through our GreenSky partnership. You can apply in minutes with no impact to your credit to check your rate (subject to approval).",
  },
  {
    q: "What areas of Atlanta do you serve?",
    a: "We serve homeowners across Metro Atlanta, including Marietta, Alpharetta, Kennesaw, Woodstock, Roswell, Acworth, Canton, Johns Creek, Milton, Sandy Springs, East Cobb, and Smyrna.",
  },
];

export const Route = createFileRoute("/atlanta-ga-siding")({
  head: () => {
    const url = `${SITE_ORIGIN}/atlanta-ga-siding`;
    const title = "Siding Contractor in Atlanta, GA | James Hardie Elite | Siding Depot";
    const description =
      "Atlanta's James Hardie Elite siding contractor. Fiber cement siding installation & replacement across Metro Atlanta — in-house crews, 30-year warranty, itemized quote in 24h. Free estimate.";

    const localBusiness = {
      ...LOCAL_BUSINESS_SCHEMA,
      name: "Siding Depot — Atlanta",
      url,
      areaServed: { "@type": "City", name: "Atlanta, GA" },
    };

    const faqSchema = getFaqSchema([...FAQS]);

    const serviceSchema = getServiceSchema(
      "Siding Installation & Replacement in Atlanta",
      description,
      "/atlanta-ga-siding",
      IMG_HERO,
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
  component: AtlantaGASidingPage,
});

function AtlantaGASidingPage() {
  return (
    <main className="bg-background text-sd-black">
      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="overflow-hidden px-4 pb-16 pt-12 sm:px-6 sm:pb-24 sm:pt-20 lg:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[.94fr_1.06fr] lg:gap-16">
          <div className="max-w-2xl">
            <p className="inline-flex rounded-full bg-sd-green-pale px-4 py-2 text-[11px] font-bold tracking-[.13em] text-sd-green-dark">
              METRO ATLANTA · JAMES HARDIE ELITE CONTRACTOR
            </p>
            <h1 className="mt-6 font-display text-5xl leading-[.96] sm:text-7xl lg:text-8xl">
              Atlanta's James Hardie Elite{" "}
              <span className="text-sd-green-text">siding contractor.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-sd-gray-text sm:text-xl">
              Fiber cement siding installation &amp; replacement across Metro Atlanta — installed by
              our own certified crews, never subcontractors. Get an itemized, fixed-price quote in
              24 hours.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="rounded-full">
                <a href="#quote">
                  Get my free Atlanta estimate <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full">
                <a href={SITE.phoneHref}>
                  <Phone className="mr-2 h-4 w-4" />
                  Call {SITE.phone}
                </a>
              </Button>
            </div>
            <p className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-semibold text-sd-gray-text">
              <span className="inline-flex items-center gap-1.5">
                <Star className="h-4 w-4 fill-sd-green text-sd-green" /> 4.7★ · 550+ reviews
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-sd-green-dark" /> 30-year warranty
              </span>
              <span>Licensed GA #RBQA006789</span>
            </p>
          </div>
          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute -inset-5 rounded-[2.5rem] bg-sd-green-pale"
            />
            <img
              src={IMG_HERO}
              alt="New James Hardie fiber cement siding on an Atlanta, GA home"
              className="relative h-[390px] w-full rounded-[2rem] object-cover object-center shadow-[0_24px_60px_rgba(12,12,12,.17)] sm:h-[540px]"
              fetchPriority="high"
            />
            <div className="absolute -bottom-5 -left-3 max-w-[245px] rounded-2xl border border-white/70 bg-white/95 p-4 shadow-xl backdrop-blur sm:-left-7 sm:p-5">
              <p className="text-[10px] font-bold tracking-[.14em] text-sd-green-dark">
                ITEMIZED, FIXED PRICE
              </p>
              <p className="mt-1 font-display text-2xl leading-none">
                Your Atlanta quote in 24 hours.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST STRIP ───────────────────────────────────────────────────── */}
      <section className="border-y border-sd-gray-border bg-sd-green-pale px-4 py-5 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
          <p className="font-display text-2xl text-sd-navy">
            In-house crews. Elite install. One project manager.
          </p>
          <p className="text-sm font-semibold text-sd-gray-text">
            James Hardie Elite · 1,500+ projects · 30-year non-prorated warranty
          </p>
        </div>
      </section>

      {/* ── INTRO — Siding Installation & Replacement in Atlanta ──────────── */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[11px] font-bold tracking-[.16em] text-sd-green-dark">
            SERVING ALL OF METRO ATLANTA
          </p>
          <h2 className="mt-4 font-display text-5xl leading-none sm:text-6xl">
            Siding installation &amp; replacement in Atlanta.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-sd-gray-text">
            As a dedicated <strong className="text-sd-black">siding contractor in Atlanta</strong>,
            we install premium{" "}
            <strong className="text-sd-black">James Hardie fiber cement siding</strong> engineered
            for Georgia's heat, humidity, and storms. Whether you're planning a full{" "}
            <strong className="text-sd-black">siding replacement in Atlanta</strong>, upgrading from
            vinyl, or building new, our in-house Atlanta crews handle the entire job — tear-off,
            moisture barrier, HardieZone HZ10 panels, trim, soffit, and fascia — backed by a written
            weatherproofing guarantee. From <em>siding installation in Atlanta GA</em> to a
            whole-home re-side, the price we quote is the price you pay.
          </p>
        </div>
        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {OFFERINGS.map((o) => (
            <article key={o.title} className="rounded-2xl bg-sd-green-pale p-6 sm:p-7">
              <div className="flex items-start gap-3">
                <Check className="mt-1 h-5 w-5 shrink-0 text-sd-green-dark" />
                <div>
                  <h3 className="font-display text-2xl text-sd-navy">{o.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-sd-gray-text">{o.desc}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── AUTHORITY ─────────────────────────────────────────────────────── */}
      <EliteBadgeSection />
      <PartnersCarousel />

      {/* ── STORY — alternating editorial image blocks ───────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-bold tracking-[.16em] text-sd-green-dark">
            THE SIDING DEPOT DIFFERENCE
          </p>
          <h2 className="mt-4 font-display text-5xl leading-none sm:text-6xl">
            A siding contractor Atlanta trusts.
          </h2>
        </div>
        <div className="mt-16 grid gap-16 lg:mt-20 lg:gap-24">
          {STORY.map((item, index) => (
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
                {item.number === "02" ? (
                  <ul className="mt-6 grid gap-3 sm:grid-cols-3">
                    {PRODUCT_POINTS.map((p) => (
                      <li key={p.t} className="rounded-2xl bg-sd-green-pale p-4">
                        <p.icon className="h-5 w-5 text-sd-green-dark" />
                        <p className="mt-2 text-sm font-bold text-sd-navy">{p.t}</p>
                        <p className="mt-1 text-xs leading-relaxed text-sd-gray-text">{p.d}</p>
                      </li>
                    ))}
                  </ul>
                ) : null}
                <p className="mt-6 border-l-2 border-sd-green pl-4 text-sm font-bold leading-relaxed text-sd-navy">
                  {item.detail}
                </p>
                <Link
                  to={item.number === "02" ? "/siding" : "/marietta-ga-siding"}
                  className="mt-6 inline-flex items-center gap-1 text-sm font-bold text-sd-navy underline decoration-sd-green decoration-2 underline-offset-4 hover:text-sd-green-text"
                >
                  {item.number === "02"
                    ? "Explore the full James Hardie lineup"
                    : "See a nearby Marietta project"}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── PROCESS — oversized numbered steps ────────────────────────────── */}
      <section className="bg-sd-green-pale px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[11px] font-bold tracking-[.16em] text-sd-green-dark">
              SIMPLE, NO-PRESSURE PROCESS
            </p>
            <h2 className="mt-4 font-display text-5xl leading-none sm:text-6xl">
              From free inspection to new siding.
            </h2>
          </div>
          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
            {STEPS.map((s) => (
              <div key={s.n} className="rounded-2xl border border-sd-green/30 bg-background p-6">
                <p className="font-display text-6xl leading-none text-sd-green">{s.n}</p>
                <h3 className="mt-4 font-display text-2xl text-sd-navy">{s.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-sd-gray-text">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES WE OFFER (internal links) ────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-bold tracking-[.16em] text-sd-green-dark">
            EXTERIOR SERVICES
          </p>
          <h2 className="mt-4 font-display text-5xl leading-none sm:text-6xl">
            Siding services we offer in Atlanta.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-sd-gray-text">
            Siding is our specialty — but we finish the whole exterior. Explore each service.
          </p>
        </div>
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICE_LINKS.map((s) => (
            <Link
              key={s.to}
              to={s.to}
              className="group flex items-center justify-between rounded-2xl border border-sd-gray-border bg-background p-6 transition-all hover:border-sd-green hover:bg-sd-green-pale/50"
            >
              <span className="font-display text-xl text-sd-navy">{s.label}</span>
              <ArrowRight className="h-5 w-5 text-sd-green-dark transition-transform group-hover:translate-x-1" />
            </Link>
          ))}
        </div>
      </section>

      {/* ── AREAS WE SERVE ────────────────────────────────────────────────── */}
      <section className="bg-sd-green-pale px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-[11px] font-bold tracking-[.16em] text-sd-green-dark">SERVICE AREA</p>
          <h2 className="mt-4 font-display text-5xl leading-none sm:text-6xl">
            Atlanta areas we serve.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-sd-gray-text">
            We install and replace siding for homeowners across Metro Atlanta.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {AREA_LINKS.map((a) =>
              a.to ? (
                <Link
                  key={a.label}
                  to={a.to}
                  className="inline-flex items-center gap-1.5 rounded-full border border-sd-green bg-background px-5 py-2.5 text-sm font-bold text-sd-navy transition-colors hover:bg-sd-green hover:text-white"
                >
                  <MapPin className="h-4 w-4" /> {a.label}
                </Link>
              ) : (
                <span
                  key={a.label}
                  className="inline-flex items-center gap-1.5 rounded-full border border-sd-gray-border bg-background px-5 py-2.5 text-sm font-semibold text-sd-gray-text"
                >
                  <MapPin className="h-4 w-4 text-sd-green-dark" /> {a.label}
                </span>
              ),
            )}
          </div>
        </div>
      </section>

      {/* ── COST — navy feature card ──────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] bg-sd-navy px-6 py-10 text-white sm:px-12 sm:py-14">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_.85fr] lg:items-center">
            <div>
              <p className="text-[11px] font-bold tracking-[.16em] text-sd-green">HONEST PRICING</p>
              <h2 className="mt-3 font-display text-4xl leading-none sm:text-5xl">
                What does siding cost in Atlanta?
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-white/80">
                Pricing depends on the size of your home, whether tear-off is required, and whether
                you choose James Hardie HZ10 fiber cement over vinyl. As a general guide, full{" "}
                <strong className="text-white">siding replacement in Atlanta</strong> typically runs{" "}
                <strong className="text-white">$25,000–$65,000</strong>. The best way to know your
                number is simple — get your exact itemized price in 24 hours.
              </p>
            </div>
            <div className="rounded-2xl bg-white/10 p-6 text-center">
              <CircleDollarSign className="mx-auto h-8 w-8 text-sd-green" />
              <p className="mt-3 font-display text-3xl leading-none">0% APR up to $65,000</p>
              <p className="mt-2 text-sm text-white/75">
                Flexible monthly payments through GreenSky. Subject to credit approval.
              </p>
              <Button asChild size="lg" className="mt-5 rounded-full">
                <a href="#quote">
                  Get my itemized quote <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROOF — before/after + reviews ────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 pb-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-bold tracking-[.16em] text-sd-green-dark">REAL RESULTS</p>
          <h2 className="mt-4 font-display text-5xl leading-none sm:text-6xl">
            Real Atlanta homes. Real reviews.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-sd-gray-text">
            Drag the slider — same home, transformed with James Hardie fiber cement.
          </p>
        </div>
        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {BEFORE_AFTER_PAIRS.map((p) => (
            <div
              key={p.after}
              className="overflow-hidden rounded-[2rem] bg-sd-green-pale p-2 shadow-[0_20px_48px_rgba(12,12,12,.10)]"
            >
              <BeforeAfterSlider
                before={p.before}
                after={p.after}
                beforeAlt={p.beforeAlt}
                afterAlt={p.afterAlt}
              />
            </div>
          ))}
        </div>
      </section>
      <div className="py-12">
        <GoogleReviewsCarousel />
      </div>

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="text-center">
          <p className="text-[11px] font-bold tracking-[.16em] text-sd-green-dark">
            ATLANTA SIDING FAQ
          </p>
          <h2 className="mt-3 font-display text-4xl leading-none sm:text-5xl">
            Frequently asked questions.
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-sd-gray-text">
            Straight answers before your Atlanta siding estimate.
          </p>
        </div>
        <Accordion type="single" collapsible className="mt-10 space-y-3">
          {FAQS.map((f, i) => (
            <AccordionItem
              key={f.q}
              value={`faq-${i}`}
              className="rounded-2xl border border-sd-gray-border px-5"
            >
              <AccordionTrigger className="text-left font-display text-lg text-sd-navy hover:text-sd-green-text hover:no-underline">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-sd-gray-text">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* ── QUOTE FORM — conversion section ───────────────────────────────── */}
      <section
        id="quote"
        className="scroll-mt-24 bg-sd-green-pale px-4 py-20 sm:px-6 sm:py-28 lg:px-8"
      >
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.76fr_1.24fr] lg:gap-20">
          <div className="lg:pt-8">
            <p className="text-[11px] font-bold tracking-[.16em] text-sd-green-dark">
              GET YOUR FREE ESTIMATE
            </p>
            <h2 className="mt-4 font-display text-5xl leading-none sm:text-6xl">
              Your Atlanta siding quote in 24 hours.
            </h2>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-sd-gray-text">
              A Hardie-trained specialist inspects your siding and hands you a written, itemized
              quote within 24 hours. The price we quote is the price you pay.
            </p>
            <div className="mt-8 rounded-2xl border border-sd-gray-border bg-background p-5">
              <p className="font-bold text-sd-navy">Proudly serving Metro Atlanta</p>
              <p className="mt-2 text-sm leading-relaxed text-sd-gray-text">
                Marietta · Alpharetta · Kennesaw · Woodstock · Roswell · Acworth · Canton · Johns
                Creek · Milton · Sandy Springs · East Cobb · Smyrna
              </p>
              <a
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-sd-navy underline decoration-sd-green decoration-2 underline-offset-2"
                href={SITE.phoneHref}
              >
                <Phone className="h-4 w-4" /> Prefer to talk? Call {SITE.phone}
              </a>
            </div>
            <div className="mt-6 overflow-hidden rounded-2xl border border-sd-gray-border">
              <MapEmbed
                className="h-[240px] w-full"
                title="Siding Depot service area in Atlanta, GA"
                query="Atlanta, GA"
              />
            </div>
          </div>
          <HeroQuoteForm source={SOURCE} tag={`${SOURCE}_footer`} />
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────────────────── */}
      <section className="bg-sd-black py-14 text-center text-white sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <ShieldCheck className="mx-auto h-8 w-8 text-sd-green" />
          <h2 className="mt-4 font-display text-4xl sm:text-5xl">
            Atlanta's Elite siding contractor is one call away.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/70">
            Fiber cement siding installation &amp; replacement across Metro Atlanta — in-house
            crews, 30-year warranty, itemized quote in 24 hours.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="rounded-full">
              <a href="#quote">
                Get my free estimate <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button asChild size="lg" variant="outlineWhite" className="rounded-full">
              <a href={SITE.phoneHref}>
                <Phone className="mr-2 h-4 w-4" />
                Call {SITE.phone}
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Sticky mobile call button */}
      <a
        href={SITE.phoneHref}
        className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-center gap-2 bg-sd-green py-3 text-base font-bold text-sd-navy shadow-[0_-4px_16px_rgba(0,0,0,.15)] lg:hidden"
      >
        <Phone className="h-5 w-5" />
        Call for a free Atlanta estimate
      </a>
    </main>
  );
}
