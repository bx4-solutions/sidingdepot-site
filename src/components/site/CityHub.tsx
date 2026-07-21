import { Phone, CheckCircle2, Star, ArrowRight } from "lucide-react";
import { HeroQuoteForm } from "@/components/site/HeroQuoteForm";
import { Button } from "@/components/ui/button";
import { PartnersCarousel } from "@/components/site/PartnersCarousel";
import { TestimonialCard } from "@/components/site/TestimonialCard";
import jamesHardieElite from "@/assets/james-hardie-elite-contractor.png";
import { SITE, STATS, PROCESS_STEPS, SERVICES } from "@/data/site";
import { buildFaqs } from "@/data/lp-content";
import { LOCATION_MATRIX, SITE_ORIGIN } from "@/data/locations";
import { CITY_LPS } from "@/data/city-lp-content";
import { LOCAL_BUSINESS_SCHEMA, getFaqSchema } from "@/lib/schema";

/**
 * Municipal hub page (/locations/{city}) — indexable "Exterior Remodeling in
 * {City}" page that presents every service active in LOCATION_MATRIX for the
 * city and links down to each /locations/{city}/{service} child page.
 * NOT a paid-media landing page: navigation stays, multiple paths allowed.
 * All claims sourced from approved site data.
 */

const CREDENTIALS = [
  "James Hardie Elite · Top 2%",
  "550+ Five-Star Reviews",
  "BBB A+ Accredited",
  "Best of Houzz 2026",
  "Licensed GA GC #RBQA006789",
  "20+ Years · 1,500+ Homes",
];

/** City-agnostic FAQs reused from the shared LP FAQ builder (visible on page + schema). */
function hubFaqs(city: string) {
  const wanted = ["Do you offer financing", "How soon can you start", "Are you really licensed"];
  return buildFaqs(city).filter((f) => wanted.some((w) => f.q.startsWith(w)));
}

/** TanStack Router `head` payload for a municipal hub route. */
export function cityHubHead(slug: string) {
  const data = CITY_LPS[slug];
  if (!data) return {};
  const url = `${SITE_ORIGIN}/locations/${slug}`;
  const title = `Exterior Remodeling in ${data.city}, GA | Siding, Roofing, Painting & More — Siding Depot`;
  const description = `One contractor for your whole exterior in ${data.city}, GA: James Hardie siding, roofing, painting, windows, doors, decks & gutters. Elite Preferred contractor, 550+ 5-star reviews, free estimate.`;
  const localBusiness = {
    ...LOCAL_BUSINESS_SCHEMA,
    name: `Siding Depot — ${data.city}`,
    url,
    areaServed: { "@type": "City", name: `${data.city}, GA` },
  };
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: url },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: url }],
    scripts: [
      { type: "application/ld+json", children: JSON.stringify(localBusiness) },
      {
        type: "application/ld+json",
        children: JSON.stringify(getFaqSchema([...hubFaqs(data.city)])),
      },
    ],
  };
}

export function CityHub({ slug }: { slug: string }) {
  const data = CITY_LPS[slug];
  const serviceSlugs = LOCATION_MATRIX[slug] ?? [];
  const services = serviceSlugs
    .map((s) => SERVICES.find((svc) => svc.slug === s))
    .filter((s): s is (typeof SERVICES)[number] => Boolean(s));
  const { city, county, neighborhoods, zips, localNote } = data;
  const faqs = hubFaqs(city);
  const source = `hub_${slug.replace(/-/g, "_")}`;

  return (
    <>
      {/* HERO */}
      <section className="relative bg-sd-navy text-white">
        <div
          className="absolute inset-0 opacity-20 bg-cover bg-center"
          style={{ backgroundImage: "url(/hero-home.webp)" }}
          aria-hidden
        />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-20 lg:items-center">
          <div>
            <span className="inline-block rounded bg-sd-green px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-sd-navy">
              {city}, GA · {county}
            </span>
            <h1 className="mt-5 font-display text-4xl leading-[1.05] sm:text-5xl">
              Exterior Remodeling in <span className="text-sd-green">{city}, GA</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-white/80">
              Siding, roofing, painting, windows, doors, decks and gutters — one licensed team, one
              project manager, one accountable contractor for your whole exterior. James Hardie
              Elite Preferred, 20+ years in Georgia, 1,500+ North Atlanta homes.
            </p>
            <ul className="mt-6 grid gap-2 sm:grid-cols-2">
              {[
                "Free itemized estimate within 24 hours",
                "0% APR financing up to $65,000 (GreenSky)",
                "In-house crews — not subcontracted out",
                "30-year transferable product warranty on Hardie siding",
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
            <HeroQuoteForm source={source} tag={`${source}_hero`} />
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
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

      {/* SERVICES GRID — every active service for this city */}
      <section className="bg-sd-gray-bg py-16 lg:py-24">
        <div className="mx-auto max-w-6xl px-4 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-sd-black sm:text-4xl">
              Every exterior service we offer in {city}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-sd-gray-text">
              Pick the project you're planning — each service has its own dedicated {city} page with
              details, process and a free estimate.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s) => (
              <a
                key={s.slug}
                href={`/locations/${slug}/${s.slug}`}
                className="group rounded-2xl border border-sd-gray-bg bg-white p-6 transition-shadow hover:shadow-lg"
              >
                <s.Icon className="h-8 w-8 text-sd-green" />
                <h3 className="mt-4 font-display text-lg text-sd-navy">{s.title}</h3>
                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-sd-gray-text">
                  {s.short}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-sd-navy group-hover:text-sd-green">
                  {s.title} in {city} <ArrowRight className="h-4 w-4" />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
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

      {/* LOCAL AREA */}
      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-4xl px-4 lg:px-8">
          <h2 className="text-3xl font-extrabold tracking-tight text-sd-black sm:text-4xl">
            Serving {city} and all of {county}
          </h2>
          {localNote && (
            <p className="mt-5 text-lg font-semibold leading-relaxed text-sd-navy">{localNote}</p>
          )}
          <div className="mt-8 rounded-2xl bg-sd-navy px-6 py-6 text-center text-white">
            <p className="mt-1 text-white/80">{neighborhoods}</p>
            <p className="mt-2 text-sm font-semibold text-sd-green">ZIP codes: {zips}</p>
          </div>
          <p className="mt-6 text-sd-gray-text">
            Want to see finished work first?{" "}
            <a href="/projects" className="font-bold text-sd-navy underline underline-offset-4">
              Browse recent projects
            </a>{" "}
            or{" "}
            <a href="/gallery" className="font-bold text-sd-navy underline underline-offset-4">
              visit the photo gallery
            </a>
            .
          </p>
        </div>
      </section>

      {/* PROCESS */}
      <section className="bg-sd-gray-bg py-16 lg:py-24">
        <div className="mx-auto max-w-6xl px-4 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-sd-black sm:text-4xl">
              How your {city} project runs
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-sd-gray-text">
              A dedicated project manager, our own crews, and a customer portal that shows you
              exactly what's happening — every day.
            </p>
          </div>
          <ol className="grid gap-6 md:grid-cols-3 lg:grid-cols-5">
            {PROCESS_STEPS.map((s) => (
              <li key={s.num} className="rounded-2xl border border-sd-gray-bg bg-white p-5">
                <span className="font-display text-2xl text-sd-green">{s.num}</span>
                <h3 className="mt-2 font-display text-lg text-sd-navy">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-sd-gray-text">{s.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* BRANDS */}
      <PartnersCarousel />

      {/* REVIEWS */}
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

      {/* FAQ */}
      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-3xl px-4 lg:px-8">
          <h2 className="text-center text-3xl font-extrabold tracking-tight text-sd-black">
            {city} exterior remodeling — common questions
          </h2>
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

      {/* FINAL CTA */}
      <section id="quote" className="bg-sd-navy py-16 lg:py-24">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 lg:grid-cols-2 lg:items-center lg:px-8">
          <div className="text-white">
            <h2 className="font-display text-3xl sm:text-4xl">
              Start your {city} exterior project with a free estimate
            </h2>
            <p className="mt-4 text-lg text-white/80">
              Tell us what you're planning — siding, roof, paint, windows or the whole exterior —
              and get a written, itemized estimate within 24 hours.
            </p>
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
    </>
  );
}
