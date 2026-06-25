// GitHub sync test commit — sidingdepot-dfab98cb
import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, ShieldCheck, Sparkles, Users, Link2, Star, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroSection } from "@/components/site/HeroSection";
import { HeroCtaButtons } from "@/components/site/HeroCtaButtons";
import { ProofBar } from "@/components/site/ProofBar";
import { ServiceCard } from "@/components/site/ServiceCard";
import { PainPointsSection } from "@/components/site/PainPointsSection";
import { ServicesHotspots } from "@/components/site/ServicesHotspots";
import { YoutubeEmbed } from "@/components/site/YoutubeEmbed";
import { SERVICES, SITE } from "@/data/site";
import { useGoogleStats } from "@/lib/google-stats-context";
import { QuickQuoteForm } from "@/components/site/QuickQuoteForm";
import { lazy, Suspense } from "react";
import jamesHardieBadge from "@/assets/james-hardie-elite-badge.png";

const PARTNER_LOGOS = [
  "https://images.leadconnectorhq.com/image/f_webp/q_70/r_320/u_https://assets.cdn.filesafe.space/VPwAmJKkB62wR0BJhYil/media/68b594a44584e19b5e18190f.svg",
  "https://images.leadconnectorhq.com/image/f_webp/q_70/r_320/u_https://assets.cdn.filesafe.space/VPwAmJKkB62wR0BJhYil/media/68b5950c3441c1803b96202d.jpeg",
  "https://images.leadconnectorhq.com/image/f_webp/q_70/r_320/u_https://assets.cdn.filesafe.space/irZ39Ik02snUd4JAOmPv/media/68a8c7609c19c009b3f34d09.svg",
  "https://images.leadconnectorhq.com/image/f_webp/q_70/r_320/u_https://assets.cdn.filesafe.space/irZ39Ik02snUd4JAOmPv/media/68ac604545eaf7e812e3da66.png",
  "https://images.leadconnectorhq.com/image/f_webp/q_70/r_320/u_https://assets.cdn.filesafe.space/VPwAmJKkB62wR0BJhYil/media/68b59793acd791744f0bde7d.jpeg",
  "https://images.leadconnectorhq.com/image/f_webp/q_70/r_320/u_https://storage.googleapis.com/msgsndr/VPwAmJKkB62wR0BJhYil/media/68bacd232398ef53b4c4598c.jpeg",
  "https://images.leadconnectorhq.com/image/f_webp/q_70/r_320/u_https://assets.cdn.filesafe.space/VPwAmJKkB62wR0BJhYil/media/69d7c3c274d020e518e3a116.png",
] as const;

// ── Below-fold components: lazy-loaded (equivalent to Next.js dynamic()) ──────
const TestimonialCard = lazy(() =>
  import("@/components/site/TestimonialCard").then((m) => ({ default: m.TestimonialCard })),
);
const MapSection = lazy(() =>
  import("@/components/site/MapSection").then((m) => ({ default: m.MapSection })),
);
const CitiesServed = lazy(() =>
  import("@/components/site/CitiesServed").then((m) => ({ default: m.CitiesServed })),
);
const ProcessTimeline = lazy(() =>
  import("@/components/site/ProcessTimeline").then((m) => ({ default: m.ProcessTimeline })),
);
const AwardsStrip = lazy(() =>
  import("@/components/site/AwardsStrip").then((m) => ({ default: m.AwardsStrip })),
);
const FinancingBlock = lazy(() =>
  import("@/components/site/FinancingBlock").then((m) => ({ default: m.FinancingBlock })),
);
const EliteBadgeSection = lazy(() =>
  import("@/components/site/EliteBadgeSection").then((m) => ({ default: m.EliteBadgeSection })),
);
const PartnersCarousel = lazy(() =>
  import("@/components/site/PartnersCarousel").then((m) => ({ default: m.PartnersCarousel })),
);
const GuildQualityReviews = lazy(() =>
  import("@/components/site/GuildQualityReviews").then((m) => ({
    default: m.GuildQualityReviews,
  })),
);
const GoogleReviewsCarousel = lazy(() =>
  import("@/components/site/GoogleReviewsCarousel").then((m) => ({
    default: m.GoogleReviewsCarousel,
  })),
);
const HOME_VIDEOS = [
  {
    id: "898FBaW_VnI",
    name: "Siding Depot — Institutional video",
    description:
      "Meet Siding Depot, Georgia's top-rated Elite James Hardie Contractor serving Marietta. 1,500+ homes completed.",
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
      { title: "North Atlanta's James Hardie Siding Experts | Siding Depot" },
      {
        name: "description",
        content:
          "Georgia's Top-Rated Elite James Hardie Contractor in Marietta, Alpharetta & Canton. 1,500+ homes transformed. In-house crews only, 30-yr warranty. Free quote in 24h.",
      },
      {
        name: "keywords",
        content:
          "siding contractor Marietta GA, James Hardie siding Atlanta, exterior painting Marietta, window replacement North Atlanta, Siding Depot",
      },
      { name: "geo.region", content: "US-GA" },
      { name: "geo.placename", content: "Marietta" },
      { name: "geo.position", content: "33.9806;-84.4752" },
      { name: "ICBM", content: "33.9806, -84.4752" },
      { name: "address", content: SITE.address.full },
      { name: "telephone", content: SITE.phone },
      {
        property: "og:title",
        content: "North Atlanta's James Hardie Siding Experts | Siding Depot",
      },
      {
        property: "og:description",
        content:
          "North Atlanta's James Hardie Siding Experts — 1,500+ homes transformed. Elite James Hardie Contractor in Marietta, Alpharetta & Canton. Free quote in 24h.",
      },
      { property: "og:image", content: "https://sidingdepot.vercel.app/og-default.jpg" },
      { property: "og:image:secure_url", content: "https://sidingdepot.vercel.app/og-default.jpg" },
      { property: "og:image:type", content: "image/jpeg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      {
        property: "og:image:alt",
        content: "Siding Depot — James Hardie siding experts in Marietta, GA",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:title",
        content: "North Atlanta's James Hardie Siding Experts | Siding Depot",
      },
      {
        name: "twitter:description",
        content:
          "North Atlanta's James Hardie Siding Experts — 1,500+ homes transformed. Elite James Hardie Contractor in Marietta, Alpharetta & Canton. Free quote in 24h.",
      },
      { name: "twitter:image", content: "https://sidingdepot.vercel.app/og-default.jpg" },
    ],
    links: [
      { rel: "canonical", href: "https://sidingdepot.com/" },
      { rel: "preconnect", href: "https://www.youtube.com" },
      { rel: "preconnect", href: "https://i.ytimg.com" },
      // Responsive hero preload — browser picks the correct variant automatically
      {
        rel: "preload",
        href: "/hero-home.webp",
        as: "image",
        // @ts-expect-error — imagesrcset/imagesizes are valid but not typed in TanStack's LinkProps
        imagesrcset: "/hero-home-sm.webp 640w, /hero-home.webp 1920w",
        imagesizes: "(max-width: 640px) 100vw, 100vw",
        fetchpriority: "high",
      },
    ],
    scripts: [
      ...VIDEO_JSONLD_LIST.map((data) => ({
        type: "application/ld+json",
        children: JSON.stringify(data),
      })),
    ],
  }),
  component: HomePage,
});

const WHY_US = [
  {
    num: "01",
    title: "Elite Contractor · Top 2%",
    desc: "James Hardie's highest contractor tier — fewer than 2% of US installers qualify.",
  },
  {
    num: "02",
    title: "Built for Georgia's Climate",
    desc: "HardieZone HZ10 products and installation methods engineered specifically for Georgia's heat above 95°F, year-round humidity, and active storm season.",
  },
  {
    num: "03",
    title: "Detailed, Itemized, and transparent Estimates",
    desc: "Know exactly what you're paying for. Every estimate includes a detailed, itemized scope of work, material and labor specifications, and a wood replacement addendum with predetermined pricing for any hidden rot uncovered during installation.",
  },
  {
    num: "04",
    title: "In-House Certified Installation Crews",
    desc: "We never subcontract our installations. Every crew member is part of our highly specialized, certified team—with over 20 years of combined experience, fully insured, and directly accountable to Siding Depot.",
  },
  {
    num: "05",
    title: "Flexible Payment Options",
    desc: "No large upfront deposit required when you sign. Your first payment isn't due until your project start date. With milestone-based payments and financing options available, we make it easy to move forward with your project while staying within your budget.",
  },
  {
    num: "06",
    title: "Trusted by Hundreds of Homeowners",
    desc: "4.7-star average rating with 550+ verified reviews across Google, GuildQuality, Thumbtack, Houzz and AngiLeads—reflecting our commitment to quality, communication, and customer satisfaction.",
  },
];

const TESTIMONIALS = [
  {
    name: "Jennifer M.",
    city: "Marietta",
    text: "We got 4 quotes. Siding Depot was the most transparent — no vague numbers, no pressure. The James Hardie looks incredible. Our neighbors keep stopping to ask who did the work.",
  },
  {
    name: "David & Susan R.",
    city: "Marietta",
    text: "From the first quote to the final walkthrough, not a single surprise. The estimate matched the invoice to the dollar. The project manager checked in with us every single day. This is how a contractor should run.",
  },
  {
    name: "Michael T.",
    city: "Marietta",
    text: "I specifically looked for a James Hardie Elite Contractor because I wanted the 30-year warranty. Siding Depot qualified. The install was flawless — you can see the craftsmanship at every corner.",
  },
];

function HomePage() {
  const { rating, totalReviews } = useGoogleStats();
  return (
    <>
      <HeroSection
        badge="James Hardie Elite Contractor · Marietta, GA"
        title={
          <>
            Marietta & North Atlanta's James Hardie Siding Experts —{" "}
            <span className="text-sd-green">1,500+ Homes Transformed</span>
          </>
        }
        subtitle="Georgia's Top-Rated Elite James Hardie Contractor, trusted and recommended by homeowners across Marietta, Alpharetta, Canton, Woodstock, and Kennesaw. In-house installation crews only—no subcontractors. Written quote within 24 hours, guaranteed."
        primaryCta={{ label: "Schedule FREE Quote", to: "/contact" }}
        bgVideo="898FBaW_VnI"
        showCallCta={false}
        trustItems={[
          `⭐ ${rating} · ${totalReviews} Google Reviews`,
          "🏆 James Hardie Elite Contractor · Marietta, GA",
          "🔨 4.7 · 256 GuildQuality Reviews",
          "🏠 1,500+ North Atlanta Homes",
          "💰 GreenSky 0% APR Financing",
        ]}
        ctaSlot={<></>}
        formSlot={<HeroCtaButtons source="home_hero" />}
      />

      <ProofBar />

      <PainPointsSection />

      {/* CERTIFICATIONS / TRUSTED PARTNERS MARQUEE (acima de "Explore Our Services") */}
      <section className="py-16 bg-white border-y border-sd-gray-border overflow-hidden">
        <p className="text-center text-xs font-bold tracking-[0.12em] uppercase text-sd-gray-text mb-8">
          Trusted partners &amp; manufacturers
        </p>
        {/* Marquee track — duplicated for seamless loop */}
        <div className="relative flex">
          <div
            className="flex items-center gap-12 animate-marquee whitespace-nowrap"
            style={{ animation: "marquee 28s linear infinite" }}
          >
            {[...PARTNER_LOGOS, ...PARTNER_LOGOS].map((src, i) => (
              <div key={i} className="flex-shrink-0 flex items-center justify-center h-20 w-36">
                <img
                  src={src}
                  alt={`Manufacturer partner ${(i % PARTNER_LOGOS.length) + 1}`}
                  width={144}
                  height={64}
                  className="max-h-16 w-auto object-contain opacity-75 hover:opacity-100 transition-opacity"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            ))}
          </div>
        </div>
        <style>{`
          @keyframes marquee {
            0%   { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
      </section>

      <ServicesHotspots />

      {/* SERVICES GRID */}
      <section
        id="services"
        className="relative py-20 lg:py-24 bg-background scroll-mt-24 overflow-hidden"
      >
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="inline-block text-xs font-bold tracking-[0.12em] uppercase text-sd-green-dark bg-sd-green-pale px-3 py-1 rounded">
              Our Services
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-sd-black">
              Complete Exterior Services — One Contractor, One Call
            </h2>
            <p className="mt-3 text-sd-gray-text">
              From James Hardie siding to painting, windows, decks and gutters — Siding Depot
              handles every exterior service in Marietta and all of North Atlanta.
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
            <span className="inline-block text-xs font-bold tracking-[0.12em] uppercase text-sd-navy bg-sd-green px-3 py-1 rounded">
              Why Siding Depot
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-sd-black">
              6 Reasons Georgia Homeowners Choose Us
            </h2>
            <p className="mt-3 text-sd-black/65 max-w-lg">
              We're not the cheapest contractor in Marietta. We're the one your neighbors call back
              to thank.
            </p>

            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              {WHY_US.map((f) => (
                <div key={f.num} className="flex gap-4">
                  <span className="font-display text-3xl text-sd-green leading-none shrink-0">
                    {f.num}
                  </span>
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
              <YoutubeEmbed videoId="898FBaW_VnI" title="Siding Depot — Institutional" />
              <div className="absolute top-2 right-2 sm:-top-5 sm:-right-5 bg-sd-green text-sd-black rounded-full h-16 w-16 sm:h-24 sm:w-24 flex flex-col items-center justify-center shadow-2xl border-2 sm:border-4 border-sd-navy z-10">
                <span className="font-display text-base sm:text-2xl leading-none">20+</span>
                <span className="text-[8px] sm:text-[10px] font-bold uppercase tracking-wider mt-0.5">
                  Years
                </span>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/contact">Get Your Free Quote</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/about">About Siding Depot</Link>
              </Button>
            </div>
            <nav aria-label="Related siding pages" className="mt-6 flex flex-col gap-3 text-sm">
              <Link
                to="/siding"
                className="flex items-center gap-2 text-sd-navy font-semibold underline hover:text-sd-green-dark transition-colors"
              >
                <Link2 className="h-4 w-4 shrink-0 text-sd-green" />
                James Hardie siding installation in Marietta
              </Link>
              <Link
                to="/lp/siding-marietta"
                className="flex items-center gap-2 text-sd-navy font-semibold underline hover:text-sd-green-dark transition-colors"
              >
                <Link2 className="h-4 w-4 shrink-0 text-sd-green" />
                Service areas
              </Link>
              <Link
                to="/projects"
                className="flex items-center gap-2 text-sd-navy font-semibold underline hover:text-sd-green-dark transition-colors"
              >
                <Link2 className="h-4 w-4 shrink-0 text-sd-green" />
                See recent siding projects
              </Link>
            </nav>
          </div>
        </div>
      </section>

      <Suspense fallback={null}>
        <ProcessTimeline title="How It Works — From First Call to Final Walkthrough" />
      </Suspense>

      <Suspense fallback={null}>
        <EliteBadgeSection />
      </Suspense>

      <div id="google-reviews">
        <Suspense fallback={null}>
          <GoogleReviewsCarousel />
        </Suspense>
      </div>

      <div id="guild-reviews">
        <Suspense fallback={null}>
          <GuildQualityReviews />
        </Suspense>
      </div>

      <Suspense fallback={null}>
        <AwardsStrip />
      </Suspense>

      <Suspense fallback={null}>
        <FinancingBlock />
      </Suspense>

      {/* QUOTE FORM TEASER */}
      <section className="section-dark-alt py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 grid gap-12 lg:grid-cols-2 items-center">
          <div>
            <span className="inline-block text-xs font-bold tracking-[0.12em] uppercase text-sd-navy bg-sd-green px-3 py-1 rounded">
              Free Quote · 24h Response
            </span>
            <h2 className="mt-4 font-display text-3xl sm:text-4xl lg:text-5xl text-sd-black leading-tight">
              Get Your Free Quote Today
            </h2>
            <p className="mt-4 text-sd-black/65 max-w-lg">
              Tell us about your project and we'll get back to you within 24 hours to schedule an
              estimator to write you a detailed, no-obligation written estimate.
            </p>
            <div className="mt-6 inline-flex items-center gap-3 rounded-lg border border-sd-green/30 bg-sd-green/5 p-4">
              <Sparkles className="h-5 w-5 text-sd-navy shrink-0" />
              <p className="text-sm text-sd-black/80">
                Limited estimate slots available each month. Schedule yours before our calendar
                fills up.
              </p>
            </div>

            <ul className="mt-8 grid grid-cols-2 gap-3 text-sm">
              {[
                { i: Star, t: "4.7-Star Rating" },
                { i: CheckCircle2, t: "500+ Verified Reviews" },
                { i: Users, t: "1,500+ Projects Completed" },
                { i: ShieldCheck, t: "Licensed & Insured" },
                { i: CheckCircle2, t: "Free Estimates" },
                { i: Award, t: "JAMES HARDIE ELITE CONTRACTOR" },
              ].map(({ i: Icon, t }) => (
                <li key={t} className="flex items-center gap-2 text-sd-black/80">
                  <Icon className="h-4 w-4 text-sd-navy" /> {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-center">
            <QuickQuoteForm source="home_quote_section" tag="quote_request" />
          </div>
        </div>
      </section>

      {/* PARTNERS CAROUSEL */}
      <Suspense fallback={null}>
        <PartnersCarousel />
      </Suspense>

      {/* HARDIE SECTION */}
      <section
        id="james-hardie-section"
        className="relative section-dark bg-gradient-to-br from-sd-gray-bg via-sd-gray-bg to-white py-20 lg:py-24"
        aria-labelledby="hardie-section-title"
      >
        <div className="mx-auto max-w-7xl px-4 lg:px-8 grid gap-12 lg:grid-cols-2 items-center">
          <div>
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div className="flex-1 min-w-0 w-full">
                <span className="inline-block text-xs font-bold tracking-[0.12em] uppercase text-sd-navy bg-sd-green px-3 py-1 rounded">
                  James Hardie · Elite Contractor
                </span>
                <h2
                  id="hardie-section-title"
                  className="mt-4 font-display text-3xl sm:text-4xl lg:text-5xl text-sd-black"
                >
                  Why James Hardie Is Built For Georgia
                </h2>
                <p className="mt-4 text-sd-black/70 text-lg leading-relaxed">
                  As a James Hardie Elite Contractor, we install the highest quality fiber cement
                  siding engineered specifically for Georgia's unique climate challenges.
                </p>
              </div>
            </div>

            <ul className="mt-8 space-y-4 text-sd-black/80">
              {[
                {
                  title: "HardieZone® HZ10",
                  desc: "Engineered specifically for Georgia's high heat, humidity, and intense storm seasons.",
                },
                {
                  title: "Superior Durability",
                  desc: "Non-combustible fiber cement that resists warping, rotting, and buckling better than wood or vinyl.",
                },
                {
                  title: "Pest Resistance",
                  desc: "Unlike wood siding, fiber cement is not a food source for termites, carpenter ants, woodpeckers, or rodents and is far less susceptible to pest-related damage.",
                },
                {
                  title: "Industry-Leading Warranty",
                  desc: "Peace of mind with a 30-year limited transferable product warranty.",
                },
                {
                  title: "Maximum ROI",
                  desc: "Fiber cement siding consistently ranks as one of the best investments for home resale value.",
                },
              ].map((item) => (
                <li key={item.title} className="flex gap-4">
                  <CheckCircle2
                    className="h-6 w-6 text-sd-navy shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
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
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-sd-black/20 text-sd-black hover:bg-sd-black/5"
              >
                <Link to="/siding">Explore All Siding Options</Link>
              </Button>
            </div>
          </div>
          <div className="lg:pl-8 flex flex-col items-center">
            <div className="relative w-full max-w-[450px] mx-auto">
              <img
                src={jamesHardieBadge}
                alt="James Hardie Elite Contractor Certification Badge"
                className="w-full h-auto object-contain"
                width={600}
                height={450}
                loading="lazy"
              />
            </div>

            <div className="mt-12 w-full p-6 bg-white rounded-xl border border-sd-gray-border shadow-sm">
              <h3 className="font-semibold text-sd-black mb-4">Certified Local Expertise</h3>
              <nav
                aria-label="James Hardie Siding Resources"
                className="flex flex-col gap-3 text-sm"
              >
                <Link
                  to="/siding"
                  className="text-sd-black hover:underline flex items-center gap-2 [&>svg]:text-sd-green"
                >
                  <Sparkles className="h-4 w-4" /> Fiber cement siding installation services
                </Link>
                <Link
                  to="/lp/siding-marietta"
                  className="text-sd-black hover:underline flex items-center gap-2 [&>svg]:text-sd-green"
                >
                  <Sparkles className="h-4 w-4" /> Elite Contractor installation in Marietta &
                  Atlanta
                </Link>
                <Link
                  to="/projects"
                  className="text-sd-black hover:underline flex items-center gap-2 [&>svg]:text-sd-green"
                >
                  <Sparkles className="h-4 w-4" /> View our recent Hardie siding transformations
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </section>

      <Suspense fallback={null}>
        <CitiesServed />
      </Suspense>

      <section id="location-section" aria-labelledby="location-title">
        <Suspense fallback={null}>
          <MapSection />
        </Suspense>
      </section>
    </>
  );
}
