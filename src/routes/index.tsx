import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, ShieldCheck, Sparkles, Users, ListChecks } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroSection } from "@/components/site/HeroSection";
import { HeroCtaButtons } from "@/components/site/HeroCtaButtons";
import { ProofBar } from "@/components/site/ProofBar";
import { ServiceCard } from "@/components/site/ServiceCard";
import { CityCard } from "@/components/site/CityCard";
import { TestimonialCard } from "@/components/site/TestimonialCard";
import { MapSection } from "@/components/site/MapSection";
import { GoogleReviews } from "@/components/site/GoogleReviews";

import { PainPointsSection } from "@/components/site/PainPointsSection";
import { ProcessTimeline } from "@/components/site/ProcessTimeline";
import { AwardsStrip } from "@/components/site/AwardsStrip";
import { ServicesHotspots } from "@/components/site/ServicesHotspots";
import { FinancingBlock } from "@/components/site/FinancingBlock";
import { YoutubeEmbed } from "@/components/site/YoutubeEmbed";
import { SERVICES, CITIES, SITE } from "@/data/site";
import { ORG_SCHEMA, LOCAL_BUSINESS_SCHEMA } from "@/lib/schema";



const HOME_VIDEOS = [
  {
    id: "898FBaW_VnI",
    name: "Siding Depot — Institutional video",
    description:
      "Meet Siding Depot, James Hardie Elite Preferred siding contractor serving Greater Marietta. 1,500+ homes resided.",
    duration: "PT2M",
    uploadDate: "2024-06-01",
  },
  {
    id: "tENqAaDFr9s",
    name: "Why James Hardie fiber cement siding is built for Georgia",
    description:
      "How HardieZone-engineered fiber cement siding handles Georgia's heat, humidity and storms — installed by Siding Depot in Greater Marietta, GA.",
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
      { title: "North Atlanta's James Hardie Siding Experts | Siding Depot" },
      { name: "description", content: "North Atlanta's James Hardie Siding Experts — 1,500+ homes transformed. Elite Preferred contractor in Marietta, Alpharetta & Canton. W-2 crews only. Free quote in 24h." },
      { name: "keywords", content: "siding contractor Greater Marietta GA, James Hardie siding Atlanta, exterior painting Marietta, window replacement North Atlanta, Siding Depot" },
      { name: "geo.region", content: "US-GA" },
      { name: "geo.placename", content: "Greater Marietta" },
      { name: "geo.position", content: "33.9806;-84.4752" },
      { name: "ICBM", content: "33.9806, -84.4752" },
      { name: "address", content: SITE.address.full },
      { name: "telephone", content: SITE.phone },
      { property: "og:title", content: "North Atlanta's James Hardie Siding Experts | Siding Depot" },
      { property: "og:description", content: "North Atlanta's James Hardie Siding Experts — 1,500+ homes transformed. Elite Preferred contractor in Marietta, Alpharetta & Canton. Free quote in 24h." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/43cab0b0-cb06-42f1-a067-d5f0523e2835" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "North Atlanta's James Hardie Siding Experts | Siding Depot" },
      { name: "twitter:description", content: "North Atlanta's James Hardie Siding Experts — 1,500+ homes transformed. Elite Preferred contractor in Marietta, Alpharetta & Canton. Free quote in 24h." },
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
  { num: "02", title: "Built for Georgia's Climate", desc: "HardieZone HZ10 products and installation methods engineered specifically for Georgia's heat above 95°F, year-round humidity, and active storm season." },
  { num: "03", title: "Written Estimates — No Surprises", desc: "Detailed written estimates before any work starts. The price in the estimate is the price you pay. No last-minute change orders, ever." },
  { num: "04", title: "Highly Specialized Certified Teams", desc: "We never sub out installs. Every crew member is part of our highly specialized certified teams — trained, background-checked, insured, and accountable to us directly." },
  { num: "05", title: "Payment at Completion", desc: "No large upfront deposits. You pay when the job is 100% complete to your satisfaction." },
  { num: "06", title: "GuildQuality Verified — 256 Reviews", desc: "92% of our customers say they would recommend Siding Depot to a friend. Verified by GuildQuality since 2019." },
];

const TESTIMONIALS = [
  { name: "Jennifer M.", city: "Greater Marietta", text: "We got 4 quotes. Siding Depot was the most transparent — no vague numbers, no pressure. The James Hardie looks incredible. Our neighbors keep stopping to ask who did the work." },
  { name: "David & Susan R.", city: "Greater Marietta", text: "From the first quote to the final walkthrough, not a single surprise. The estimate matched the invoice to the dollar. The project manager checked in with us every single day. This is how a contractor should run." },
  { name: "Michael T.", city: "Greater Marietta", text: "I specifically looked for a James Hardie Elite Preferred contractor because I wanted the 30-year warranty. Siding Depot qualified. The install was flawless — you can see the craftsmanship at every corner." },
];

function HomePage() {
  return (
    <>
      <HeroSection
        badge="Elite Preferred · Top 2% of US Installers · Greater Marietta, GA"
        title={
          <>
            North Atlanta's James Hardie Siding Experts —{" "}
            <span className="text-sd-green">1,500+ Homes Transformed</span>
          </>
        }
        subtitle="We're the Elite Preferred James Hardie contractor your Marietta, Alpharetta and Canton neighbors call back to thank. W-2 crews only. Written quote within 24 hours, guaranteed."
        primaryCta={{ label: "Schedule FREE Quote", to: "/contact" }}
        showCallCta={false}
        trustItems={[
          "⭐ 4.5 · 158 Google Reviews",
          "🏆 Elite Preferred · Top 2% US",
          "🔨 4.7 · 256 GuildQuality Reviews",
          "🏠 1,500+ North Atlanta Homes",
          "💰 GreenSky 0% APR Financing",
        ]}
        ctaSlot={<HeroCtaButtons source="home_hero" />}
      />

      <ProofBar />

      <PainPointsSection />

      <ServicesHotspots />

      {/* SERVICES GRID */}
      <section id="services" className="py-20 lg:py-24 bg-background scroll-mt-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="inline-block text-xs font-bold tracking-[0.12em] uppercase text-sd-green-text bg-sd-green-pale px-3 py-1 rounded">
              Our Services
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-sd-black">
              Complete Exterior Services — One Contractor, One Call
            </h2>
            <p className="mt-3 text-sd-gray-text">
              From James Hardie siding to painting, windows, decks and gutters — Siding Depot handles every exterior service in Greater Marietta and all of North Atlanta.
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
      <section className="section-dark py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 grid gap-12 lg:grid-cols-2 items-center">
          <div>
            <span className="inline-block text-xs font-bold tracking-[0.12em] uppercase text-sd-green bg-sd-green/10 border border-sd-green/30 px-3 py-1 rounded">
              Why Siding Depot
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-sd-black">
              6 Reasons Georgia Homeowners Choose Us
            </h2>
            <p className="mt-3 text-sd-black/65 max-w-lg">
              We're not the cheapest contractor in Greater Marietta. We're the one your neighbors call back to thank.
            </p>

            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              {WHY_US.map((f) => (
                <div key={f.num} className="flex gap-4">
                  <span className="font-display text-3xl text-sd-green leading-none shrink-0">{f.num}</span>
                  <div>
                    <h3 className="text-base font-semibold">{f.title}</h3>
                    <p className="mt-1 text-sm text-sd-black/60">{f.desc}</p>
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
              className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-sd-black/70"
            >
              <Link to="/siding" className="text-sd-green hover:underline">
                James Hardie siding installation in Greater Marietta
              </Link>
              <Link to="/lp/siding-marietta" className="text-sd-green hover:underline">
                Service areas
              </Link>
              <Link to="/projects" className="text-sd-green hover:underline">
                See recent siding projects
              </Link>
            </nav>
          </div>
        </div>
      </section>

      <ProcessTimeline title="How It Works — From First Call to Final Walkthrough" />

      <AwardsStrip />

      {/* CITIES GRID */}
      <section className="py-20 lg:py-24 bg-sd-gray-bg">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="inline-block text-xs font-bold tracking-[0.12em] uppercase text-sd-green-text bg-sd-green-pale px-3 py-1 rounded">
              Service Areas
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-sd-black">
              Serving Greater Marietta & North Atlanta
            </h2>
            <p className="mt-3 text-sd-gray-text">
              James Hardie Elite Preferred installations in Greater Marietta. Free on-site quotes — we come to you.
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

      

      <GoogleReviews />

      <FinancingBlock />

      {/* QUOTE FORM TEASER */}
      <section className="section-dark-alt py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 grid gap-12 lg:grid-cols-2 items-center">
          <div>
            <span className="inline-block text-xs font-bold tracking-[0.12em] uppercase text-sd-green bg-sd-green/10 border border-sd-green/30 px-3 py-1 rounded">
              Free Quote · 24h Response
            </span>
            <h2 className="mt-4 font-display text-4xl sm:text-5xl text-sd-black leading-tight">
              Get Your Free Quote Today
            </h2>
            <p className="mt-4 text-sd-black/65 max-w-lg">
              Tell us about your project and we'll get back within 24 hours with a no-pressure, written estimate.
            </p>
            <div className="mt-6 inline-flex items-center gap-3 rounded-lg border border-sd-green/30 bg-sd-green/5 p-4">
              <Sparkles className="h-5 w-5 text-sd-green shrink-0" />
              <p className="text-sm text-sd-black/80">
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
                <li key={t} className="flex items-center gap-2 text-sd-black/80">
                  <Icon className="h-4 w-4 text-sd-green" /> {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl bg-sd-gray-bg border border-sd-gray-border p-6 lg:p-8">
            <h3 className="text-lg font-semibold">Request Your Free Estimate</h3>
            <p className="text-sm text-sd-black/55 mt-1">It takes less than 60 seconds.</p>

            <div className="mt-5 grid gap-3">
              <Button asChild size="lg">
                <Link to="/contact">Open Full Quote Form</Link>
              </Button>
              <Button asChild size="lg" variant="outlineWhite">
                <a href={SITE.phoneHref}>Call {SITE.phone}</a>
              </Button>
              <p className="text-xs text-sd-black/45 text-center mt-2">
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
      <section 
        id="james-hardie-section" 
        className="relative section-dark bg-gradient-to-br from-sd-gray-bg via-sd-gray-bg to-white py-20 lg:py-24"
        aria-labelledby="hardie-section-title"
      >
        <div className="mx-auto max-w-7xl px-4 lg:px-8 grid gap-12 lg:grid-cols-2 items-center">
          <div>
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div className="flex-1 min-w-[300px]">
                <span className="inline-block text-xs font-bold tracking-[0.12em] uppercase text-sd-green bg-sd-green/10 border border-sd-green/30 px-3 py-1 rounded">
                  James Hardie · Elite Preferred
                </span>
                <h2 id="hardie-section-title" className="mt-4 font-display text-4xl sm:text-5xl text-sd-black">
                  Why James Hardie Is Built For Georgia
                </h2>
                <p className="mt-4 text-sd-black/70 text-lg leading-relaxed">
                  As a James Hardie Elite Preferred contractor, we install the highest quality fiber cement siding engineered specifically for Georgia's unique climate challenges.
                </p>
              </div>
            </div>
            
            <ul className="mt-8 space-y-4 text-sd-black/80">
              {[
                { title: "HardieZone® HZ10", desc: "Engineered specifically for Georgia's high heat, humidity, and intense storm seasons." },
                { title: "Superior Durability", desc: "Non-combustible fiber cement that resists warping, rotting, and buckling better than wood or vinyl." },
                { title: "ColorPlus® Technology", desc: "Baked-on finish provides a vibrant color that lasts up to 30% longer than field-applied paint." },
                { title: "Industry-Leading Warranty", desc: "Peace of mind with a 30-year limited transferable product warranty." },
                { title: "Maximum ROI", desc: "Fiber cement siding consistently ranks as one of the best investments for home resale value." },
              ].map((item) => (
                <li key={item.title} className="flex gap-4">
                  <CheckCircle2 className="h-6 w-6 text-sd-green shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <strong className="text-sd-black block">{item.title}</strong>
                    <span className="text-sm leading-relaxed">{item.desc}</span>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-wrap gap-4">
              <Button asChild size="lg" className="shadow-lg hover:shadow-xl transition-all">
                <Link to="/contact">Request Your Hardie Siding Quote</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-sd-black/20 text-sd-black hover:bg-sd-black/5">
                <Link to="/siding">Explore All Siding Options</Link>
              </Button>
            </div>
          </div>
          <div className="lg:pl-8 flex flex-col items-center">
            <div className="relative w-full max-w-md mx-auto">
              <img 
                src="https://ynvrijkuampxpsmshftm.supabase.co/storage/v1/object/public/prompt-images/uploads/1780611894575-482bc3f5-005d-40c9-95a8-388817ce03c1.png" 
                alt="James Hardie Alliance Elite Preferred Contractor Certification Badge" 
                className="w-full h-auto object-contain drop-shadow-xl hover:scale-105 transition-transform duration-500"
                width={400}
                height={300}
                loading="lazy"
              />
            </div>
            
            <div className="mt-12 w-full p-6 bg-white rounded-xl border border-sd-gray-border shadow-sm">
              <h3 className="font-semibold text-sd-black mb-4">Certified Local Expertise</h3>
              <nav
                aria-label="James Hardie Siding Resources"
                className="flex flex-col gap-3 text-sm"
              >
                <Link to="/siding" className="text-sd-green hover:underline flex items-center gap-2">
                  <Sparkles className="h-4 w-4" /> Fiber cement siding installation services
                </Link>
                <Link to="/lp/siding-marietta" className="text-sd-green hover:underline flex items-center gap-2">
                  <Sparkles className="h-4 w-4" /> Elite Preferred installation in Marietta & Atlanta
                </Link>
                <Link to="/projects" className="text-sd-green hover:underline flex items-center gap-2">
                  <Sparkles className="h-4 w-4" /> View our recent Hardie siding transformations
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </section>

      <section id="location-section" aria-labelledby="location-title">
        <MapSection />
      </section>


    </>

  );
}
