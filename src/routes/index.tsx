import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, ShieldCheck, Sparkles, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroSection } from "@/components/site/HeroSection";
import { ProofBar } from "@/components/site/ProofBar";
import { ServiceCard } from "@/components/site/ServiceCard";
import { CityCard } from "@/components/site/CityCard";
import { TestimonialCard } from "@/components/site/TestimonialCard";
import { StatCard } from "@/components/site/StatCard";
import { SERVICES, CITIES, STATS, SITE } from "@/data/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Siding Depot — Georgia's Most Trusted Siding Experts | Marietta GA" },
      { name: "description", content: "James Hardie Elite Preferred contractor serving Marietta, Alpharetta, Milton, Canton & North Atlanta. 1,500+ homes transformed. Free quote in 24h." },
      { property: "og:title", content: "Siding Depot — Georgia's Most Trusted Siding Experts" },
      { property: "og:description", content: "James Hardie Elite Preferred. 1,500+ homes. Free quote in 24h across North Atlanta." },
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
            Georgia's Most Trusted{" "}
            <span className="text-sd-green">Siding Experts</span>
          </>
        }
        subtitle="Premium James Hardie installation, exterior painting, windows, decks and roofing across Marietta, Alpharetta, Milton, Canton and all of North Atlanta."
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl">
          {STATS.map((s) => (
            <StatCard key={s.label} value={s.value} label={s.label} />
          ))}
        </div>
      </HeroSection>

      <ProofBar />

      {/* SERVICES GRID */}
      <section className="py-20 lg:py-24 bg-background">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="inline-block text-xs font-bold tracking-[0.12em] uppercase text-sd-green-text bg-sd-green-pale px-3 py-1 rounded">
              Our Services
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-sd-black">
              Complete Exterior Solutions for Your Home
            </h2>
            <p className="mt-3 text-sd-gray-text">
              One contractor. Every exterior service. Backed by 15+ years of work in North Atlanta.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.slice(0, 6).map((s) => (
              <ServiceCard
                key={s.slug}
                icon={s.icon}
                title={s.title}
                description={s.short}
                to={`/${s.slug}`}
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
            <img
              src="https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=900&q=80"
              alt="Siding Depot installation crew at work in North Atlanta"
              className="rounded-xl object-cover w-full h-[460px]"
              loading="lazy"
            />
            <div className="absolute -bottom-6 -left-6 bg-sd-green text-sd-black rounded-full h-32 w-32 flex flex-col items-center justify-center shadow-2xl">
              <span className="font-display text-3xl leading-none">15+</span>
              <span className="text-[11px] font-bold uppercase tracking-wider mt-1">Years</span>
            </div>
          </div>
        </div>
      </section>

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
              <CityCard key={c.slug} name={c.name} county={c.county} />
            ))}
          </div>

          <div className="mt-10 text-center">
            <Button asChild variant="dark">
              <Link to="/service-areas">View All Service Areas</Link>
            </Button>
          </div>
        </div>
      </section>

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

      {/* TESTIMONIALS */}
      <section className="py-20 lg:py-24 bg-background">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="inline-block text-xs font-bold tracking-[0.12em] uppercase text-sd-green-text bg-sd-green-pale px-3 py-1 rounded">
              Real Reviews
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-sd-black">
              What North Atlanta Homeowners Say
            </h2>
            <p className="mt-3 text-sd-gray-text">
              4.9★ average across 60+ Google Reviews.
            </p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <TestimonialCard key={t.name} {...t} />
            ))}
          </div>
        </div>
      </section>

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
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=80"
            alt="James Hardie fiber cement siding installed on a North Atlanta home"
            className="rounded-xl object-cover w-full h-[460px]"
            loading="lazy"
          />
        </div>
      </section>
    </>
  );
}
