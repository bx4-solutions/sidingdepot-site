import { createFileRoute } from "@tanstack/react-router";
import { Phone, CheckCircle2, ArrowRight, ShieldCheck, Calendar, X } from "lucide-react";
import { useState } from "react";
import { HeroQuoteForm } from "@/components/site/HeroQuoteForm";
import { Button } from "@/components/ui/button";
import { BeforeAfterSlider } from "@/components/site/BeforeAfterSlider";
import { PartnersCarousel } from "@/components/site/PartnersCarousel";
import { GoogleReviewsCarousel } from "@/components/site/GoogleReviewsCarousel";
import { MapEmbed } from "@/components/site/MapEmbed";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EliteBadgeSection } from "@/components/site/EliteBadgeSection";
import sidingHousePool from "@/assets/siding-house-hero-pool.webp";
import { SITE, PROJECTS, BEFORE_AFTER_PAIRS } from "@/data/site";
import { CITY_LPS } from "@/data/city-lp-content";
import { SITE_ORIGIN } from "@/data/locations";
import { LOCAL_BUSINESS_SCHEMA, getFaqSchema, getServiceSchema } from "@/lib/schema";

const CITY = CITY_LPS.marietta;
const SOURCE = "marietta_ga_siding_page";

const WHY_US_ITEMS = [
  {
    title: "Built to Keep Marietta's Heat Out",
    desc: "Installing James Hardie fiber cement siding and Owens Corning roofing improve energy retention, reducing thermal transfer and the price of energy bills.",
  },
  {
    title: "Experienced Local Installers",
    desc: "With over 20 years of experience in siding, roofing, and trim installation in North Atlanta, homeowners trust Siding Depot to get the job done right.",
  },
  {
    title: "High-Quality Materials",
    desc: "We install James Hardie fiber cement siding and premium shingles, both renowned for their long lifespan, durability, and resistance to Georgia humidity.",
  },
  {
    title: "Flexible Financing Options",
    desc: "Financing is easy with our GreenSky® partnership. We offer a wide variety of payment plans, including 0% APR options for qualified homeowners.",
  },
];

const SERVICES_PRICING = [
  {
    title: "Siding Replacements",
    desc: "New siding protects your home from costly structural damage while improving curb appeal and home value. Depending on material and scope of work, a replacement can cost from $25,000 - $65,000 on average.",
    link: "/siding",
  },
  {
    title: "Roofing Replacements",
    desc: "Replacing your roof gives you a strong layer against the elements. Depending on shingle type and the size of your roof, projects can range from $10,000 - $25,000 on average.",
    link: "/roofing",
  },
  {
    title: "Exterior Painting",
    desc: "Exterior Painting will add protection to your siding and increase property value. Depending on scope and paint quality, these projects can range from $2,000 - $14,000.",
    link: "/painting",
  },
];

const CHALLENGE_ITEMS = [
  {
    title: "Moisture Protection",
    desc: "Marietta's humid climate necessitates installing a material that is water and rot-resistant. James Hardie fiber cement won't rot, swell, or feed termites.",
  },
  {
    title: "Energy Efficient Insulation",
    desc: "Premium housewrap and quality insulation keep the Georgia summer heat out and your air-conditioning in. Both reduce the price of your energy bill.",
  },
  {
    title: "Long-Term Durability",
    desc: "Siding is the only home improvement project you'll need to do once when done right. Our HardieZone® HZ10 spec installations are engineered for 50+ years.",
  },
];

const FAQs = [
  {
    q: "How do I know if my siding needs to be replaced?",
    a: "Signs you may need to replace your siding on a home in Marietta include cracks, warping, fading, moisture damage, or higher energy bills than normal. If repairs are frequent or widespread across your home, a replacement may be more cost effective.",
  },
  {
    q: "How long does a siding replacement take in Marietta?",
    a: "The time a siding replacement project takes in Marietta depends on the size of your home and the materials you choose. At Siding Depot, our trained in-house crews complete typical full replacements in just 3 to 7 days, leaving your home secure and cleaned up. We coordinate all planning, material deliveries, and permitting so you don't have to worry about a thing.",
  },
  {
    q: "Are exterior painting projects worth it in the Marietta climate?",
    a: "Yes, exterior paint projects can seem frivolous especially when considering the higher price tag of siding replacements. However, high-quality paint like Sherwin-Williams Duration can increase reflectivity, helping protect the siding from Georgia's intense heat and reducing thermal transfer.",
  },
  {
    q: "How much does new siding cost in Marietta?",
    a: "Every home is different, so we give you a written, itemized estimate within 24 hours — and the price we quote is the price you pay. As a general guide, full siding replacements in the Marietta area typically range from $25,000 to $65,000 depending on the material and scope of work. We also offer GreenSky® financing with 0% APR plans (subject to credit approval), so most homeowners can start their project without touching their savings.",
  },
  {
    q: "What warranty do you offer on James Hardie siding?",
    a: "Your project is backed by James Hardie's 30-year, non-prorated, transferable product warranty, plus our own workmanship guarantee on the installation itself. Because we're a James Hardie Elite Contractor installing to HardieZone® HZ10 specification, that manufacturer warranty stays valid for the life of the product.",
  },
  {
    q: "Is Siding Depot licensed and insured in Marietta?",
    a: "Yes. We're a licensed Georgia General Contractor (#RBQA006789), fully insured, and a James Hardie Elite Contractor — the top 2% of installers nationwide. We use our own in-house crews rather than subcontractors, and we're headquartered right here in Marietta on Roswell Road, so your estimator and crew are local.",
  },
];

export const Route = createFileRoute("/marietta-ga-siding")({
  head: () => {
    const url = `${SITE_ORIGIN}/marietta-ga-siding`;
    const title = "Marietta GA Siding Replacements and Installations | Siding Depot";
    const description =
      "Marietta's James Hardie Elite siding contractor. Fiber cement siding repair, replacement & installation in Cobb County. 550+ 5-star reviews, 0% APR financing, free estimate.";

    const localBusiness = {
      ...LOCAL_BUSINESS_SCHEMA,
      name: "Siding Depot — Marietta",
      url,
      areaServed: { "@type": "City", name: "Marietta, GA" },
    };

    const faqSchema = getFaqSchema([...FAQs]);

    const serviceSchema = getServiceSchema(
      "James Hardie Siding Installation in Marietta",
      description,
      "/marietta-ga-siding",
      "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/43cab0b0-cb06-42f1-a067-d5f0523e2835",
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
  component: MariettaGASidingPage,
});

function MariettaGASidingPage() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* ── 1. HERO — real Marietta project photo + form ─────────────────── */}
      <section className="relative bg-sd-navy text-white overflow-hidden">
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
          <div className="text-center lg:text-left flex flex-col items-center lg:items-start">
            <span className="inline-block rounded bg-sd-green px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-sd-navy mx-auto lg:mx-0">
              Marietta, GA · Headquartered on Roswell Rd
            </span>
            <h1 className="mt-5 font-display text-4xl leading-[1.05] sm:text-5xl">
              Reliable Siding and Roofing Company in <span className="text-sd-green">Marietta</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-white/85 mx-auto lg:mx-0">
              The same team trusted by hundreds of homeowners in Atlanta — now serving Marietta with
              siding, roofing, and exterior painting under one roof.
            </p>
            <ul className="mt-6 grid gap-2 sm:grid-cols-2 text-left mx-auto lg:mx-0">
              {[
                "Itemized estimate in 24 hours — fixed price",
                "0% APR financing up to $65,000",
                "30-year transferable warranty",
                "Lowest price guarantee",
              ].map((b) => (
                <li
                  key={b}
                  className="flex items-start gap-2 text-white/90 justify-center lg:justify-start"
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-sd-green" />
                  <span className="text-sm font-medium">{b}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-4 justify-center lg:justify-start">
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
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button
                    size="lg"
                    className="px-8 py-6 text-base font-bold bg-sd-green text-sd-navy hover:bg-sd-green-hover rounded-full transition-all hover:scale-105"
                  >
                    <Calendar className="mr-2 h-5 w-5" />
                    Schedule Your Free Estimate
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md p-0 overflow-y-auto max-h-[90dvh] bg-transparent border-0 shadow-none [&>button]:hidden">
                  <DialogTitle className="sr-only">Get Your Free Quote</DialogTitle>
                  <div className="relative">
                    <DialogClose
                      className="absolute right-3 top-3 z-20 rounded-full bg-white/20 p-2 text-white hover:bg-white/40 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
                      aria-label="Close"
                    >
                      <X className="h-4 w-4" aria-hidden="true" />
                    </DialogClose>
                    <HeroQuoteForm
                      source={SOURCE}
                      tag={`${SOURCE}_dialog`}
                      onSuccess={() => setTimeout(() => setOpen(false), 2500)}
                    />
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-white/10 lg:justify-self-end max-w-lg mx-auto lg:mx-0">
            <img
              src={sidingHousePool}
              alt="Beautiful siding installation in Marietta by Siding Depot"
              className="w-full h-full object-cover"
              loading="eager"
            />
          </div>
        </div>
      </section>

      {/* ── 2. ELITE CONTRACTOR — credentials, awards & review platforms ──── */}
      <EliteBadgeSection />

      {/* ── 3. WHY US ────────────────────────────────────────────────────── */}
      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 lg:grid-cols-2 lg:px-8">
          <div className="text-center lg:text-left flex flex-col items-center lg:items-start">
            <h2 className="text-3xl font-extrabold tracking-tight text-sd-black sm:text-4xl text-center lg:text-left">
              Why Homeowners in Marietta{" "}
              <span className="text-sd-green-text">Choose Siding Depot</span>
            </h2>
            <p className="mt-4 text-lg text-sd-gray-text text-center lg:text-left">
              Marietta homeowners face unique challenges when it comes to the humid climate and hot
              weather. Siding Depot ensures that your home will be enhanced and protected while
              improving comfort and value.
            </p>
            <div className="mt-6 space-y-4">
              {WHY_US_ITEMS.map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl border border-sd-gray-bg p-4 bg-sd-gray-bg/30"
                >
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-sd-green-text" />
                    <div>
                      <h3 className="font-display text-base text-sd-navy font-bold">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-sd-gray-text">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <figure className="lg:justify-self-end">
            <img
              src="/projects/project-1.webp"
              alt="Beautiful Marietta home finished with new siding by Siding Depot"
              className="w-full rounded-2xl object-cover shadow-xl"
              loading="lazy"
            />
            <figcaption className="mt-3 text-center text-sm text-sd-gray-text">
              Complete James Hardie siding replacement in Marietta, GA
            </figcaption>
          </figure>
        </div>
      </section>

      {/* ── 4. SERVICES & PRICING ────────────────────────────────────────── */}
      <section className="bg-sd-gray-bg py-16 lg:py-24">
        <div className="mx-auto max-w-6xl px-4 lg:px-8">
          <div className="mb-12 text-center">
            <span className="inline-block rounded bg-sd-green-pale px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-sd-green-text">
              Our Services
            </span>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-sd-black sm:text-4xl">
              Siding, Roofing &amp; Painting Services in Marietta
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-sd-gray-text">
              By being upfront with our pricing, we help you plan for your project by considering
              your budget and financing options.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {SERVICES_PRICING.map((s) => (
              <div
                key={s.title}
                className="rounded-2xl bg-white p-7 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sd-green-pale">
                    <ShieldCheck className="h-6 w-6 text-sd-green-text" />
                  </span>
                  <h3 className="mt-4 font-display text-xl text-sd-navy font-bold">{s.title}</h3>
                  <p className="mt-2 leading-relaxed text-sd-gray-text text-sm">{s.desc}</p>
                </div>
                <div className="mt-6 border-t border-sd-gray-bg pt-4">
                  <a
                    href={s.link}
                    className="inline-flex items-center gap-1 text-sm font-bold text-sd-navy hover:text-sd-green-text transition-colors"
                  >
                    Learn More <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. LOCAL CHALLENGES ──────────────────────────────────────────── */}
      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 lg:grid-cols-2 lg:px-8">
          <figure className="order-2 lg:order-1">
            <img
              src="/projects/project-6.webp"
              alt="Three-story home re-sided with James Hardie siding and trim in Marietta, GA"
              className="w-full rounded-2xl object-cover shadow-xl"
              loading="lazy"
            />
            <figcaption className="mt-3 text-center text-sm text-sd-gray-text">
              Hardie siding, repaint &amp; rebuilt deck — Marietta, GA
            </figcaption>
          </figure>
          <div className="order-1 lg:order-2 text-center lg:text-left flex flex-col items-center lg:items-start">
            <h2 className="text-3xl font-extrabold tracking-tight text-sd-black sm:text-4xl text-center lg:text-left">
              Marietta Homes Face <span className="text-sd-green-text">Unique Challenges</span>
            </h2>
            <p className="mt-4 text-lg text-sd-gray-text text-center lg:text-left">
              Marietta's climate is both humid and hot. Finding materials that are durable,
              aesthetic, and fall within your budget is Siding Depot's goal.
            </p>
            <ul className="mt-6 space-y-4 text-left">
              {CHALLENGE_ITEMS.map((item) => (
                <li
                  key={item.title}
                  className="flex items-start gap-3 justify-center lg:justify-start"
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-sd-green" />
                  <div>
                    <p className="font-bold text-sd-black text-center lg:text-left">{item.title}</p>
                    <p className="text-sm text-sd-gray-text mt-1 text-center lg:text-left">
                      {item.desc}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-8 w-full sm:w-auto flex justify-center lg:justify-start">
              <Button
                onClick={() => setOpen(true)}
                size="lg"
                className="rounded-full bg-sd-green text-sd-navy hover:bg-sd-green-hover px-8 py-6 text-base font-bold transition-all hover:scale-105"
              >
                Schedule a Free Estimate
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. BEFORE / AFTER ────────────────────────────────────────────── */}
      <section className="bg-sd-gray-bg py-16 lg:py-24">
        <div className="mx-auto max-w-6xl px-4 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-sd-black">
              Before &amp; After — Real James Hardie Results
            </h2>
            <p className="mt-3 text-sd-gray-text">
              Same Marietta home, transformed. Drag the slider to compare.
            </p>
          </div>
          <div className="grid gap-8 lg:grid-cols-2">
            {BEFORE_AFTER_PAIRS.map((p) => (
              <div key={p.after} className="overflow-hidden rounded-2xl shadow-lg bg-white p-2">
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

      {/* ── 7. REVIEWS — live Google reviews (real-time via root loader) ──── */}
      <GoogleReviewsCarousel />

      {/* ── 8. FAQ — collapsed accordion ────────────────────────────────── */}
      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-3xl px-4 lg:px-8">
          <div className="text-center mb-10">
            <span className="inline-block rounded bg-sd-green-pale px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-sd-green-text">
              FAQ
            </span>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-sd-black">
              Marietta Siding &amp; Roofing — Straight Answers
            </h2>
            <p className="mt-3 text-sd-gray-text">
              Helping you make the right decision for your home.
            </p>
          </div>
          <Accordion type="single" collapsible className="w-full">
            {FAQs.map((f, i) => (
              <AccordionItem
                key={f.q}
                value={`faq-${i}`}
                className="border-b border-sd-gray-bg py-2"
              >
                <AccordionTrigger className="text-left font-display text-base text-sd-navy hover:text-sd-green-text hover:no-underline font-semibold">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="leading-relaxed text-sd-gray-text text-sm pt-2">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ── 9. PARTNERS CAROUSEL ────────────────────────────────────────── */}
      <PartnersCarousel />

      {/* ── 10. FINAL CTA + local proof ──────────────────────────────────── */}
      <section id="quote" className="bg-sd-navy py-16 lg:py-24 text-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 lg:grid-cols-2 lg:items-center lg:px-8">
          <div className="text-center lg:text-left flex flex-col items-center lg:items-start">
            <h2 className="font-display text-3xl sm:text-4xl text-center lg:text-left">
              Get the Exact Number for Your Marietta Home — Free
            </h2>
            <p className="mt-4 text-lg text-white/80 text-center lg:text-left">
              A Hardie-trained specialist inspects your siding and hands you a written, itemized
              estimate within 24 hours. <strong>The price we quote is the price you pay.</strong>
            </p>
            <div className="mt-6 rounded-2xl bg-white/5 px-5 py-4 text-center lg:text-left w-full">
              <p className="font-display text-base text-sd-green font-bold">
                Proudly serving Marietta &amp; Cobb County
              </p>
              <p className="mt-1 text-sm text-white/75">{CITY.neighborhoods}</p>
              <p className="mt-1 text-xs font-semibold text-white/60">ZIP codes: {CITY.zips}</p>
            </div>
            <div className="mt-8 flex flex-wrap gap-4 justify-center lg:justify-start w-full">
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
            <div className="mt-10">
              <MapEmbed
                className="h-[300px] w-full rounded-2xl overflow-hidden shadow-lg border border-white/10"
                title="Siding Depot service area in Marietta, GA"
                query="Marietta, GA"
              />
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
    </div>
  );
}
