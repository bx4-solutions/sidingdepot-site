import { createFileRoute } from "@tanstack/react-router";
import { Phone, CheckCircle2, AlertTriangle, ClipboardList, Search, FileText } from "lucide-react";
import { HeroQuoteForm } from "@/components/site/HeroQuoteForm";
import { Button } from "@/components/ui/button";
import { TestimonialCard } from "@/components/site/TestimonialCard";
import jamesHardieElite from "@/assets/james-hardie-elite-contractor.png";
import { SITE, STATS } from "@/data/site";
import { SITE_ORIGIN } from "@/data/locations";
import { LOCAL_BUSINESS_SCHEMA, getFaqSchema } from "@/lib/schema";

/**
 * Storm/hail damage siding page — organic, indexable. Scope per the
 * competitive-research spec: documentation, inspection, itemized scope and
 * technical support to the homeowner's insurance adjuster. Coverage decisions
 * always rest with the insurer — this page makes no approval promises.
 */

const FAQS = [
  {
    q: "Does insurance cover siding damage from hail or storms?",
    a: "In most cases, yes. Georgia's hail season (March–June) generates thousands of siding claims across Cobb and Cherokee counties. We work directly with your insurance adjuster and document damage on your behalf — at no cost to you. Coverage decisions always rest with your insurer and policy.",
  },
  {
    q: "Are you really licensed and insured?",
    a: "Yes — Georgia GC #RBQA006789, fully insured with general liability and workers' comp. We're James Hardie Elite Contractor (top 2% nationwide), GAF Factory Certified, and BBB A+ accredited.",
  },
  {
    q: "How soon can you start my project?",
    a: "We're currently booking 3–4 weeks out. Request your free estimate today to lock in your spot. Insurance and storm-damage projects can often be prioritized.",
  },
];

const SIGNS = [
  "Cracked, chipped or punctured siding boards after hail",
  "Dents and dings across one elevation (usually the side the storm hit)",
  "Loose, lifted or missing boards and trim after high winds",
  "New moisture stains or leaks around windows and walls after a storm",
];

const STEPS = [
  {
    Icon: Search,
    title: "1. Free storm inspection",
    desc: "A Hardie-trained specialist inspects every elevation and photographs the damage — you get a clear picture of what the storm actually did.",
  },
  {
    Icon: ClipboardList,
    title: "2. Written, itemized scope",
    desc: "You receive a written, itemized repair or replacement scope within 24 hours. The price we quote is the price you pay.",
  },
  {
    Icon: FileText,
    title: "3. Support for your claim",
    desc: "If you file a claim, we document the damage on your behalf and provide the technical detail your insurance adjuster needs — at no cost to you.",
  },
  {
    Icon: CheckCircle2,
    title: "4. Repair done right",
    desc: "Our in-house crews repair or replace the siding to manufacturer spec. Most projects take 3–7 days, and your home is never left exposed overnight.",
  },
];

export const Route = createFileRoute("/storm-damage-siding-georgia")({
  head: () => {
    const url = `${SITE_ORIGIN}/storm-damage-siding-georgia`;
    const title = "Hail & Storm Damage Siding in North Atlanta | Free Inspection | Siding Depot";
    const description =
      "Hail or storm damage to your siding? Free inspection, written itemized scope in 24 hours, and full documentation support for your insurance adjuster. Licensed GA GC, James Hardie Elite.";
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
        { type: "application/ld+json", children: JSON.stringify(LOCAL_BUSINESS_SCHEMA) },
        { type: "application/ld+json", children: JSON.stringify(getFaqSchema(FAQS)) },
      ],
    };
  },
  component: StormDamageSidingPage,
});

function StormDamageSidingPage() {
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
            <span className="inline-flex items-center gap-2 rounded bg-sd-green px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-sd-navy">
              <AlertTriangle className="h-4 w-4" /> North Atlanta · Cobb & Cherokee counties
            </span>
            <h1 className="mt-5 font-display text-4xl leading-[1.05] sm:text-5xl">
              Hail or Storm Damage to Your Siding?{" "}
              <span className="text-sd-green">Get a Clear Inspection and Repair Plan.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-white/80">
              After a storm, guesswork is expensive. We inspect, photograph and document the damage,
              hand you a written itemized scope in 24 hours, and give your insurance adjuster the
              technical detail they need — at no cost to you.
            </p>
            <ul className="mt-6 grid gap-2 sm:grid-cols-2">
              {[
                "Free storm-damage inspection",
                "Written, itemized scope in 24 hours",
                "Damage documented for your adjuster — free",
                "Licensed GA GC #RBQA006789 · 20+ years",
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
            <HeroQuoteForm source="storm_damage_siding" tag="storm_damage_siding_hero" />
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
            {[
              "550+ Five-Star Reviews",
              "BBB A+ Accredited",
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

      {/* SIGNS OF STORM DAMAGE */}
      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-4xl px-4 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-sd-black sm:text-4xl">
              What storm damage looks like on siding
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-sd-gray-text">
              Hail and wind damage isn't always obvious from the driveway. Walk each side of your
              home after a storm and look for:
            </p>
          </div>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2">
            {SIGNS.map((s) => (
              <li
                key={s}
                className="flex gap-3 rounded-xl border border-sd-gray-bg bg-sd-gray-bg/40 p-5 text-sd-black"
              >
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                <span className="font-medium">{s}</span>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-center text-sd-gray-text">
            Not sure what you're looking at?{" "}
            <a href="#quote" className="font-bold text-sd-navy underline underline-offset-4">
              Request a free inspection
            </a>{" "}
            — we'll document it either way, so you can decide with facts.
          </p>
        </div>
      </section>

      {/* PROCESS */}
      <section className="bg-sd-gray-bg py-16 lg:py-24">
        <div className="mx-auto max-w-6xl px-4 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-sd-black sm:text-4xl">
              From storm to fixed — how it works
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-sd-gray-text">
              Whether or not you file a claim is always your decision, and coverage is decided by
              your insurer and policy. Our job is to give you and your adjuster clear, professional
              documentation — and to fix the siding right.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map(({ Icon, title, desc }) => (
              <div key={title} className="rounded-2xl border border-sd-gray-bg bg-white p-6">
                <Icon className="h-8 w-8 text-sd-green" />
                <h3 className="mt-4 font-display text-lg text-sd-navy">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-sd-gray-text">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
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

      {/* REVIEWS */}
      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-5xl px-4 lg:px-8">
          <h2 className="text-center text-3xl font-extrabold tracking-tight text-sd-black">
            North Atlanta homeowners trust the process
          </h2>
          <p className="mb-10 mt-2 text-center font-semibold text-sd-gray-text">
            550+ five-star reviews · 4.7★ across Google, GuildQuality &amp; Angi
          </p>
          <div className="grid gap-5 md:grid-cols-2">
            <TestimonialCard
              name="Verified Google Review"
              city="North Atlanta"
              text="On time, on budget, no surprises. The crew respected our property and kept us updated the whole way through."
            />
            <TestimonialCard
              name="Verified Google Review"
              city="North Atlanta"
              text="The Siding Depot team made our James Hardie project effortless. Best decision we made this year — the finish is incredible."
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-sd-gray-bg py-16 lg:py-24">
        <div className="mx-auto max-w-3xl px-4 lg:px-8">
          <h2 className="text-center text-3xl font-extrabold tracking-tight text-sd-black">
            Storm damage & insurance — straight answers
          </h2>
          <div className="mt-10 divide-y divide-sd-gray-bg">
            {FAQS.map((f) => (
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
              Get your free storm-damage inspection
            </h2>
            <p className="mt-4 text-lg text-white/80">
              Serving Marietta, Alpharetta, Roswell and all of Cobb, Cherokee and North Fulton
              counties. Free inspection, written itemized scope in 24 hours, and documentation your
              adjuster can actually use.
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
            <HeroQuoteForm source="storm_damage_siding" tag="storm_damage_siding_footer" />
          </div>
        </div>
      </section>
    </>
  );
}
