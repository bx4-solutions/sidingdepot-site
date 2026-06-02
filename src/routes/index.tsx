import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, ShieldCheck, Sparkles, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroSection } from "@/components/site/HeroSection";
import { HeroQuoteForm } from "@/components/site/HeroQuoteForm";
import { ProofBar } from "@/components/site/ProofBar";
import { ServiceCard } from "@/components/site/ServiceCard";
import { CityCard } from "@/components/site/CityCard";
import { TestimonialCard } from "@/components/site/TestimonialCard";
import { MapSection } from "@/components/site/MapSection";
import { GoogleReviews } from "@/components/site/GoogleReviews";

import { PainPointsSection } from "@/components/site/PainPointsSection";
import { ProcessTimeline } from "@/components/site/ProcessTimeline";
import { AwardsStrip } from "@/components/site/AwardsStrip";
import { ProjectGallery } from "@/components/site/ProjectGallery";
import { FinancingBlock } from "@/components/site/FinancingBlock";
import { YoutubeEmbed } from "@/components/site/YoutubeEmbed";
import { SERVICES, CITIES, SITE } from "@/data/site";
import { ORG_SCHEMA, LOCAL_BUSINESS_SCHEMA } from "@/lib/schema";



const HOME_VIDEOS = [
  {
    id: "898FBaW_VnI",
    name: "Siding Depot — Institutional video",
    description:
      "Meet Siding Depot, James Hardie Elite Preferred siding contractor serving Marietta, Alpharetta and all of North Atlanta. 1,500+ homes resided.",
    duration: "PT2M",
    uploadDate: "2024-06-01",
  },
  {
    id: "tENqAaDFr9s",
    name: "Why James Hardie fiber cement siding is built for Georgia",
    description:
      "How HardieZone-engineered fiber cement siding handles Georgia's heat, humidity and storms — installed by Siding Depot in Marietta, GA.",
    duration: "PT3M",
    uploadDate: "2024-04-15",
  },
] as const;

const VIDEO_JSONLD_LIST = HOME_VIDEOS.map((v) => ({
  "@context": "https://schema.org",
  "@type": "VideoObject",
  name: v.name,
  description: v.description,
  thumbnailUrl: [
    `https://i.ytimg.com/vi/${v.id}/maxresdefault.jpg`,
    `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`,
  ],
  uploadDate: v.uploadDate,
  duration: v.duration,
  contentUrl: `https://www.youtube.com/watch?v=${v.id}`,
  embedUrl: `https://www.youtube.com/embed/${v.id}`,
  publisher: {
    "@type": "Organization",
    name: "Siding Depot",
    logo: { "@type": "ImageObject", url: "https://sidingdepot.com/logo.png" },
  },
}));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Siding Depot — Georgia's Most Trusted Siding Experts | Marietta GA" },
      { name: "description", content: "James Hardie Elite Preferred contractor serving Marietta, Alpharetta, Milton, Canton & North Atlanta. 1,500+ homes transformed. Free quote in 24h." },
      { name: "keywords", content: "siding contractor Marietta GA, James Hardie siding Atlanta, exterior painting Marietta, window replacement North Atlanta, Siding Depot" },
      { name: "geo.region", content: "US-GA" },
      { name: "geo.placename", content: "Marietta" },
      { name: "geo.position", content: "33.9806;-84.4752" },
      { name: "ICBM", content: "33.9806, -84.4752" },
      { name: "address", content: SITE.address.full },
      { name: "telephone", content: SITE.phone },
      { property: "og:title", content: "Siding Depot — Georgia's Most Trusted Siding Experts" },
      { property: "og:description", content: "James Hardie Elite Preferred. 1,500+ homes. Free quote in 24h across North Atlanta." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/43cab0b0-cb06-42f1-a067-d5f0523e2835" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Siding Depot — Georgia's Most Trusted Siding Experts" },
      { name: "twitter:description", content: "James Hardie Elite Preferred. 1,500+ homes. Free quote in 24h across North Atlanta." },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/43cab0b0-cb06-42f1-a067-d5f0523e2835" },
    ],
    links: [
      { rel: "canonical", href: "https://sidingdepot.com/" },
      { rel: "preconnect", href: "https://www.youtube.com" },
      { rel: "preconnect", href: "https://i.ytimg.com" },
    ],
    scripts: [
      ...VIDEO_JSONLD_LIST.map((data) => ({
        type: "application/ld+json",
        children: JSON.stringify(data),
      })),
      { type: "application/ld+json", children: JSON.stringify(ORG_SCHEMA) },
      { type: "application/ld+json", children: JSON.stringify(LOCAL_BUSINESS_SCHEMA) },
    ],
  }),
  component: HomePage,
});

const WHY_US = [
  { num: "01", title: "Elite Preferred · Top 2%", desc: "James Hardie's highest contractor tier — fewer than 2% of US installers qualify." },
  { num: "02", title: "Built for HardieZone Georgia", desc: "Products and install methods engineered for Georgia's heat, humidity and storms." },
  { num: "03", title: "Transparent Pricing", desc: "Detailed written estimates. No surprises, no last-minute change orders." },
  { num: "04", title: "In-House Crews", desc: "We never sub out installs. Our W-2 crews are trained, insured and accountable." },
];

const TESTIMONIALS = [
  { name: "Jennifer M.", city: "Marietta", text: "Best contractor we've worked with. Crew was on time every day and the new HardiePlank looks incredible." },
  { name: "David & Susan R.", city: "Alpharetta", text: "From the first quote to final walkthrough they were professional. The estimate matched the final invoice — no surprises." },
  { name: "Michael T.", city: "Canton", text: "Replaced our siding, gutters and trim. The whole project finished one day ahead of schedule and looks fantastic." },
];

function HomePage() {
  return (
    <>
      <HeroSection
        badge="James Hardie Elite Preferred"
        title={
          <>
            Elevate Your Home's Exterior with{" "}
            <span className="text-sd-green">Precision &amp; Craftsmanship</span>
          </>
        }
        subtitle="Certified James Hardie installers serving Marietta, Alpharetta, Milton & all of North Atlanta — backed by 1,500+ transformations and a written 24-hour quote guarantee."
        primaryCta={{ label: "Schedule FREE Quote", to: "/contact" }}
        formSlot={<HeroQuoteForm />}
      />

      <ProofBar />

      <PainPointsSection />

      {/* SERVICES GRID */}
      <section id="services" className="py-20 lg:py-24 bg-background scroll-mt-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="inline-block text-xs font-bold tracking-[0.12em] uppercase text-sd-green-text bg-sd-green-pale px-3 py-1 rounded">
              Our Services
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-sd-black">
              Complete Exterior Solutions for Your Home
            </h2>
            <p className="mt-3 text-sd-gray-text">
              One contractor. Every exterior service. Backed by 12+ years of work in North Atlanta.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.slice(0, 6).map((s, i) => (
              <ServiceCard
                key={s.slug}
                id={`services-${s.slug}`}
                Icon={s.Icon}
                title={s.title}
                description={s.short}
                to={`/${s.slug}`}
                image={s.image}
                priority={i < 3}
              />
            ))}
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="bg-sd-navy py-20 lg:py-24 text-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 grid gap-12 lg:grid-cols-2 items-center">
          <div>
            <span className="inline-block text-xs font-bold tracking-[0.12em] uppercase text-sd-green bg-sd-green/10 border border-sd-green/30 px-3 py-1 rounded">
              Why Siding Depot
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-bold">
              4 Reasons Georgia Homeowners Choose Us
            </h2>
            <p className="mt-3 text-white/65 max-w-lg">
              We're not the cheapest. We're the contractor your neighbors trust to do it right the first time.
            </p>

            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              {WHY_US.map((f) => (
                <div key={f.num} className="flex gap-4">
                  <span className="font-display text-3xl text-sd-green leading-none shrink-0">{f.num}</span>
                  <div>
                    <h3 className="text-base font-semibold">{f.title}</h3>
                    <p className="mt-1 text-sm text-white/60">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="relative">
              <YoutubeEmbed
                videoId="898FBaW_VnI"
                title="Siding Depot — Institutional"
              />
              <div className="absolute top-2 right-2 sm:-top-5 sm:-right-5 bg-sd-green text-sd-black rounded-full h-16 w-16 sm:h-24 sm:w-24 flex flex-col items-center justify-center shadow-2xl border-2 sm:border-4 border-sd-navy z-10">
                <span className="font-display text-base sm:text-2xl leading-none">12+</span>
                <span className="text-[8px] sm:text-[10px] font-bold uppercase tracking-wider mt-0.5">Years</span>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/contact">Get Your Free Quote</Link>
              </Button>
              <Button asChild size="lg" variant="outlineWhite">
                <Link to="/about">About Siding Depot</Link>
              </Button>
            </div>
            <nav
              aria-label="Related siding pages"
              className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-white/70"
            >
              <Link to="/siding" className="text-sd-green hover:underline">
                James Hardie siding installation in Marietta
              </Link>
              <Link to="/lp/siding-marietta" className="text-sd-green hover:underline">
                North Atlanta service areas
              </Link>
              <Link to="/projects" className="text-sd-green hover:underline">
                See recent siding projects
              </Link>
            </nav>
          </div>
        </div>
      </section>

      <ProcessTimeline />

      <AwardsStrip />

      {/* CITIES GRID */}
      <section className="py-20 lg:py-24 bg-sd-gray-bg">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="inline-block text-xs font-bold tracking-[0.12em] uppercase text-sd-green-text bg-sd-green-pale px-3 py-1 rounded">
              Service Areas
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-sd-black">
              Serving North Atlanta — From Marietta to Canton
            </h2>
            <p className="mt-3 text-sd-gray-text">
              We cover Cobb, Cherokee, Fulton and Forsyth counties.
            </p>
          </div>

          <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {CITIES.map((c) => (
              <CityCard key={c.slug} slug={c.slug} name={c.name} county={c.county} />
            ))}
          </div>

          <div className="mt-10 text-center">
            <Button asChild variant="dark">
              <Link to="/contact">View All Service Areas</Link>
            </Button>
          </div>
        </div>
      </section>

      <MapSection />

      <GoogleReviews />

      <ProjectGallery />

      <FinancingBlock />

      {/* QUOTE FORM TEASER */}
      <section className="bg-sd-dark text-white py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 grid gap-12 lg:grid-cols-2 items-center">
          <div>
            <span className="inline-block text-xs font-bold tracking-[0.12em] uppercase text-sd-green bg-sd-green/10 border border-sd-green/30 px-3 py-1 rounded">
              Free Quote · 24h Response
            </span>
            <h2 className="mt-4 font-display text-4xl sm:text-5xl text-white leading-tight">
              Get Your Free Quote Today
            </h2>
            <p className="mt-4 text-white/65 max-w-lg">
              Tell us about your project and we'll get back within 24 hours with a no-pressure, written estimate.
            </p>
            <div className="mt-6 inline-flex items-center gap-3 rounded-lg border border-sd-green/30 bg-sd-green/5 p-4">
              <Sparkles className="h-5 w-5 text-sd-green shrink-0" />
              <p className="text-sm text-white/80">
                <span className="text-sd-green font-semibold">Limited slots this month.</span>{" "}
                Book your consultation before the calendar fills up.
              </p>
            </div>

            <ul className="mt-8 grid grid-cols-2 gap-3 text-sm">
              {[
                { i: ShieldCheck, t: "Licensed & Insured" },
                { i: CheckCircle2, t: "Free Estimates" },
                { i: Users, t: "1,500+ Homes" },
                { i: Sparkles, t: "Elite Preferred" },
              ].map(({ i: Icon, t }) => (
                <li key={t} className="flex items-center gap-2 text-white/80">
                  <Icon className="h-4 w-4 text-sd-green" /> {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl bg-sd-navy border border-white/5 p-6 lg:p-8">
            <h3 className="text-lg font-semibold">Request Your Free Estimate</h3>
            <p className="text-sm text-white/55 mt-1">It takes less than 60 seconds.</p>

            <div className="mt-5 grid gap-3">
              <Button asChild size="lg">
                <Link to="/contact">Open Full Quote Form</Link>
              </Button>
              <Button asChild size="lg" variant="outlineWhite">
                <a href={SITE.phoneHref}>Call {SITE.phone}</a>
              </Button>
              <p className="text-xs text-white/45 text-center mt-2">
                Or email us at{" "}
                <a href={`mailto:${SITE.email}`} className="text-sd-green hover:underline">
                  {SITE.email}
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* GAF/HARDIE SEALS STRIP OR CTA */}

      {/* HARDIE SECTION */}
      <section className="relative bg-gradient-to-br from-sd-navy via-sd-navy to-sd-dark text-white py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 grid gap-12 lg:grid-cols-2 items-center">
          <div>
            <span className="inline-block text-xs font-bold tracking-[0.12em] uppercase text-sd-green bg-sd-green/10 border border-sd-green/30 px-3 py-1 rounded">
              James Hardie · Elite Preferred
            </span>
            <h2 className="mt-4 font-display text-4xl sm:text-5xl">
              Why James Hardie Is Built For Georgia
            </h2>
            <ul className="mt-6 space-y-3 text-white/80">
              {[
                "Engineered for HardieZone HZ10 — Georgia's heat, humidity and storms.",
                "Non-combustible fiber cement that won't warp, rot or buckle.",
                "ColorPlus® Technology baked-on finish keeps color 30% longer than paint.",
                "30-year limited transferable warranty on the product.",
                "Resists pests, moisture and impact better than vinyl or wood.",
                "Boosts resale value — top recouped exterior remodel ROI.",
              ].map((b) => (
                <li key={b} className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 text-sd-green shrink-0 mt-0.5" />
                  <span className="text-sm leading-relaxed">{b}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Button asChild size="lg">
                <Link to="/siding">Explore James Hardie Siding</Link>
              </Button>
            </div>
          </div>
          <div>
            <YoutubeEmbed
              videoId="tENqAaDFr9s"
              title="Why James Hardie siding is built for Georgia"
            />
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/contact">Get Your Free Quote</Link>
              </Button>
              <Button asChild size="lg" variant="outlineWhite">
                <Link to="/siding">See Siding Services</Link>
              </Button>
            </div>
            <nav
              aria-label="Related Hardie siding pages"
              className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-white/70"
            >
              <Link to="/siding" className="text-sd-green hover:underline">
                Fiber cement siding services
              </Link>
              <Link to="/painting" className="text-sd-green hover:underline">
                Exterior painting in North Atlanta
              </Link>
              <Link to="/contact" className="text-sd-green hover:underline">
                Request a free Hardie siding quote
              </Link>
            </nav>
          </div>
        </div>
      </section>
    </>
  );
}
