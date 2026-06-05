import { useEffect, useState } from "react";
import { z } from "zod";
import { ArrowRight, CheckCircle2, Loader2, Phone, ShieldCheck, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SITE } from "@/data/site";
import { LeadMagnet } from "@/components/site/LeadMagnet";
import { HeroQuoteForm } from "@/components/site/HeroQuoteForm";
import { track, type TrackPayload } from "@/lib/track";
import {
  SIDING_TYPES,
  buildFaqs,
  GREENSKY_STEPS,
  GREENSKY_FAQS,
} from "@/data/lp-content";
import { LOCAL_BUSINESS_SCHEMA, getFaqSchema, getServiceSchema } from "@/lib/schema";


/**
 * Conversion-optimized landing page for Google Ads traffic.
 * - Zero outbound nav links (only the phone CTA + form submit)
 * - Sticky mobile call-to-call bar
 * - UTM capture forwarded to GHL webhook
 * - Form is reused above-the-fold and again before the FAQ
 */

const CITIES = [
  "Marietta",
  "Alpharetta",
  "Milton",
  "Greater Marietta",
  "Woodstock",
  "Roswell",
  "Kennesaw",
  "Johns Creek",
  "Sandy Springs",
  "Acworth",
  "Other",
] as const;

const SERVICES = [
  "James Hardie Siding",
  "Exterior Painting",
  "Windows & Doors",
  "Deck Construction",
  "Gutters",
  "Roofing",
  "Multiple Services",
] as const;

const HERO_BG =
  "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1920&q=70";

/* FAQs and Siding types now come from @/data/lp-content (shared across LPs). */

const REVIEWS = [
  {
    initials: "MT",
    name: "Michael T.",
    location: "Alpharetta, GA",
    text: "From quote to completion, the crew was on time every day. The Hardie siding looks incredible — worth every penny.",
  },
  {
    initials: "DK",
    name: "David & Jennifer K.",
    location: "Greater Marietta, GA",
    text: "They handled our hail damage insurance claim AND finished in under a week. Professional and fair.",
  },
  {
    initials: "SR",
    name: "Sarah R.",
    location: "Milton, GA",
    text: "4 contractors quoted us. Siding Depot was the most transparent and finished ahead of schedule.",
  },
] as const;

const STATS = [
  { value: "1,500+", label: "Homes Transformed" },
  { value: "12+", label: "Years in Georgia" },
  { value: "4.5★", label: "Google Rating" },
  { value: "98%", label: "Customer Satisfaction" },
] as const;

/* ------------------------------------------------------------------ */
/* Form                                                                */
/* ------------------------------------------------------------------ */

type LeadFormProps = {
  source: string;
  title?: string;
  subtitle?: string;
};

function LeadForm({ source, title, subtitle }: LeadFormProps) {
  const [open, setOpen] = useState(false);
  
  return (
    <div data-lead-form className="flex flex-col items-center justify-center">
      <Dialog open={open} onOpenChange={(v) => setOpen(v)}>
        <DialogTrigger asChild>
          <Button 
            size="lg" 
            className="w-full sm:w-auto px-10 py-7 text-lg font-bold bg-sd-green text-sd-navy hover:bg-sd-green-hover shadow-xl shadow-sd-green/20 rounded-full transition-all hover:scale-105"
          >
            Get My Free Estimate →
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-transparent border-0 shadow-none">
          <DialogTitle className="sr-only">Get Your Free Quote</DialogTitle>
          <HeroQuoteForm 
            source={source} 
            tag="lp_quote_request" 
            title={title} 
            subtitle={subtitle} 
            onSuccess={() => setTimeout(() => setOpen(false), 2500)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export type SidingLPProps = { city: string };

export function SidingLP({ city }: SidingLPProps) {
  const FAQS = buildFaqs(city);

  function scrollToLeadForm(meta: TrackPayload = {}) {
    const el = document.querySelector("[data-lead-form]");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    track("lp_cta_click", { city, ...meta });
  }

  // Hide the sticky mobile call bar when a lead form is on screen
  // so the buttons don't fight the form CTA.
  const [hideStickyCall, setHideStickyCall] = useState(false);
  useEffect(() => {
    const forms = document.querySelectorAll("[data-lead-form]");
    if (!forms.length || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        const anyVisible = entries.some((e) => e.isIntersecting);
        setHideStickyCall(anyVisible);
      },
      { threshold: 0.25 },
    );
    forms.forEach((f) => io.observe(f));
    return () => io.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* HEADER removed — global Navbar already renders the brand + phone */}

      {/* HERO + FORM */}
      <section className="relative overflow-hidden bg-sd-navy text-white">
        <div className="absolute inset-0">
          <img 
            src={HERO_BG} 
            alt="Siding Depot contractor installing James Hardie siding" 
            className="h-full w-full object-cover opacity-30" 
            loading="eager" 
          />
          <div className="absolute inset-0 bg-sd-navy/65" />
        </div>
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-hero-compact lg:grid-cols-[60%_40%] lg:gap-12 lg:px-8 lg:py-hero-compact-lg items-center">
          <div className="flex flex-col md:flex-row items-center gap-8 lg:gap-12 text-center md:text-left">
            <div className="flex-1">
              <h1 className="font-display text-[32px] leading-tight sm:text-5xl lg:text-[58px] lg:leading-[1.05] text-white">
                James Hardie® Siding Installation in {city}, GA
              </h1>
              <p className="mt-5 text-base sm:text-lg text-white/80 leading-relaxed">
                Transform your home with North Atlanta's Top 2% James Hardie Elite Preferred contractor. Engineered for Georgia's climate, our siding systems combine unbeatable durability with the vibrant ColorPlus® finish.
              </p>
            </div>
            <div className="w-full max-w-[300px] md:max-w-[200px] lg:max-w-[280px] shrink-0">
              <div className="relative group">
                <div className="absolute -inset-1 bg-sd-green/20 rounded-[2rem] blur-xl opacity-50 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <img 
                  src="https://ynvrijkuampxpsmshftm.supabase.co/storage/v1/object/public/prompt-images/uploads/1780663807517-6231247b-0c9b-4a94-bd0d-0bb161cd8625.png"
                  alt="James Hardie Siding Project Portfolio"
                  className="relative rounded-2xl shadow-2xl border-4 border-white/10 w-full object-cover aspect-[4/5] transform hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
          <div className="lg:pl-2">
            <LeadForm
              source="lp_hero"
              title="Get Your Free Estimate"
              subtitle="We respond within 24 hours · No obligation"
            />
          </div>
        </div>
      </section>

      {/* PROOF BAR */}
      <section
        className="bg-sd-black text-white border-t-[3px] border-sd-green"
      >
        <div className="mx-auto grid max-w-7xl gap-3 px-4 py-5 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
          {[
            "⭐ 4.5/5 Google Rating",
            "🏅 Elite Preferred — Top 2% in the U.S.",
            "🏠 1,500+ Homes in Georgia",
            "✓ Free Estimates · No Obligation",
          ].map((t) => (
            <div key={t} className="text-center text-sm font-semibold text-white/90">{t}</div>
          ))}
        </div>
      </section>

      {/* WHY US */}
      <section className="bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h2 className="text-center text-3xl sm:text-4xl font-extrabold text-sd-black">
            Why North Atlanta Homeowners Choose <span className="text-sd-green">Siding Depot</span>
          </h2>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {[
              { icon: "🏆", title: "Elite Preferred Status", desc: "Only 2% of contractors nationwide earn James Hardie's Elite Preferred designation. Your installation comes with extended warranties only available through certified installers." },
              { icon: "💰", title: "Transparent, Fixed Pricing", desc: "Every estimate is itemized and fixed. The price we quote is the price you pay — no change orders, no surprise fees when the job is done." },
              { icon: "📍", title: "Local to North Atlanta", desc: "We live and work here. Our crews know Cobb County, Cherokee County, and Fulton County HOA requirements, permit processes, and local building codes." },
            ].map((c) => (
              <div key={c.title} className="rounded-xl border border-sd-gray-border bg-white p-6 shadow-sm">
                <div className="text-3xl">{c.icon}</div>
                <h3 className="mt-3 text-lg font-bold text-sd-black">{c.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-sd-gray-text">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TYPES OF SIDING */}
      <section className="bg-white py-16 lg:py-20 border-t border-sd-gray-border">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-block rounded bg-sd-green-pale px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-sd-green-text">
              James Hardie Styles
            </span>
            <h2 className="mt-4 text-3xl font-extrabold text-sd-black sm:text-4xl">
              Types of Siding We Install in {city}
            </h2>
            <p className="mt-3 text-sd-gray-text">
              Every Hardie product line — installed by Elite Preferred crews engineered for HardieZone HZ10.
            </p>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {SIDING_TYPES.map((t) => (
              <div
                key={t.title}
                className="rounded-xl border border-sd-gray-border bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
              >
                <div className="h-1 w-10 rounded-full bg-sd-green" />
                <h3 className="mt-4 text-lg font-bold text-sd-black">{t.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-sd-gray-text">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section style={{ background: "#F4F7FA" }} className="py-16 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 lg:grid-cols-2 lg:gap-12 lg:px-8">
          <div className="grid gap-4">
            {REVIEWS.map((r) => (
              <div key={r.name} className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-black/5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sd-black text-sm font-bold text-sd-green">
                    {r.initials}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-sd-black">{r.name}</p>
                    <p className="text-xs text-sd-gray-text">{r.location}</p>
                  </div>
                  <div className="ml-auto flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-sd-green text-sd-green" aria-hidden="true" />
                    ))}
                  </div>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-sd-gray-text">{r.text}</p>
                <span className="mt-2 inline-block rounded-pill bg-sd-green-pale px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-sd-black">
                  Google Review
                </span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4 self-center">
            {STATS.map((s) => (
              <div key={s.label} className="rounded-xl bg-white p-6 text-center shadow-sm ring-1 ring-black/5">
                <div className="text-4xl font-extrabold text-sd-black">{s.value}</div>
                <div className="mt-2 text-xs font-semibold uppercase tracking-wider text-sd-gray-text">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* URGENCY + CTA */}
      <section className="section-dark">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 lg:grid-cols-2 lg:gap-12 lg:px-8 lg:py-20">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight text-white">
              Limited Project Slots Available
            </h2>
            <p className="mt-4 text-white/80 leading-relaxed">
              We limit the number of projects per month to guarantee quality on every job. Spring is
              our busiest season — North Atlanta homeowners are scheduling now.
            </p>
            <div
              className="mt-6 rounded-lg p-4 text-sm font-bold bg-sd-green text-sd-navy"
            >
              ⚡ We&apos;re booking 3–4 weeks out. Request your estimate today to secure your spot.
            </div>
          </div>
          <div>
            <LeadForm
              source="lp_urgency"
              title="Schedule Your Free Estimate"
              subtitle="We respond within 24 hours · No obligation"
            />
          </div>
        </div>
      </section>

      <LeadMagnet city={city} source="lp_siding_magnet" />

      {/* GREENSKY FINANCING */}
      <section className="bg-white py-16 lg:py-20 border-t border-sd-gray-border">
        <div className="mx-auto max-w-6xl px-4 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-block rounded bg-sd-green-pale px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-sd-green-text">
              0% APR Financing Available
            </span>
            <h2 className="mt-4 text-3xl font-extrabold text-sd-black sm:text-4xl">
              GreenSky® Home Improvement Financing
            </h2>
            <p className="mt-3 text-sd-gray-text">
              Pre-approved in 60 seconds. Soft credit pull, zero obligation, no impact on your score.
            </p>
          </div>

          <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {GREENSKY_STEPS.map((s) => (
              <li
                key={s.step}
                className="rounded-xl border border-sd-gray-border bg-white p-6 shadow-sm"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sd-green text-sm font-extrabold text-sd-black">
                  {s.step}
                </div>
                <h3 className="mt-4 text-base font-bold text-sd-black">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-sd-gray-text">{s.desc}</p>
              </li>
            ))}
          </ol>

          <div className="mx-auto mt-10 max-w-3xl">
            <h3 className="text-center text-xl font-bold text-sd-black">
              Quick Financing Questions
            </h3>
            <Accordion type="single" collapsible className="mt-5 space-y-3">
              {GREENSKY_FAQS.map((item, i) => (
                <AccordionItem
                  key={item.q}
                  value={`gs-${i}`}
                  className="rounded-xl border border-sd-gray-border bg-white px-5"
                >
                  <AccordionTrigger className="text-left text-sm font-semibold text-sd-black hover:no-underline">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-sd-gray-text leading-relaxed">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <div className="mt-6 flex justify-center">
              <LeadForm
                source="greensky_section"
                title="Get Pre-Approved"
                subtitle="GreenSky® Financing available"
              />
            </div>
            <p className="mt-2 text-xs text-sd-gray-text text-center">
              Subject to credit approval. GreenSky® is a registered service mark of GreenSky, LLC.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-16 lg:py-20 border-t border-sd-gray-border">
        <div className="mx-auto max-w-3xl px-4 lg:px-8">
          <h2 className="text-center text-3xl sm:text-4xl font-extrabold text-sd-black">
            Common <span className="text-sd-green">Questions</span>
          </h2>
          <Accordion type="single" collapsible className="mt-8 space-y-3">
            {FAQS.map((item, i) => (
              <AccordionItem
                key={item.q}
                value={`q-${i}`}
                className="rounded-xl border border-sd-gray-border bg-white px-5"
              >
                <AccordionTrigger className="text-left text-base font-semibold text-sd-black hover:no-underline">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-sd-gray-text leading-relaxed">
                  <p>{item.a}</p>
                  <div className="mt-4 flex">
                    <LeadForm
                      source="faq"
                      title="Request My Free Estimate"
                      subtitle={`Question: ${item.q}`}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>


      {/* FOOTER */}
      <footer className="text-white/70 text-sm" style={{ background: "#07111A" }}>
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-8 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="flex flex-col gap-1">
            <span className="text-base font-extrabold text-sd-green">
              Siding Depot
            </span>
            <span>© 2026 {SITE.legalName}</span>
          </div>
          <div className="flex flex-col gap-1 lg:items-end">
            <a href={SITE.phoneHref} className="hover:text-sd-green">
              {SITE.phone}
            </a>
            <a href={`mailto:${SITE.email}`} className="hover:text-sd-green">
              {SITE.email}
            </a>
            <span className="text-white/55">{SITE.address.full}</span>
            <a href="/privacy-policy" className="text-white/55 hover:text-sd-green">
              Privacy Policy
            </a>
          </div>
        </div>
      </footer>

      {/* Sticky mobile call CTA removed as requested */}
    </div>
  );
}

/** Build the meta + JSON-LD payload for an LP route. */
export function lpHead({ city, path }: { city: string; path: string }) {
  const title = `James Hardie Siding ${city} GA | Free Estimate | Siding Depot`;
  const description = `James Hardie Elite Preferred contractor in ${city}, GA. Serving North Atlanta since 2009. Free estimate in 24h. Call ${SITE.phone}.`;
  const image = "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/43cab0b0-cb06-42f1-a067-d5f0523e2835";
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:image", content: image },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: image },
      { rel: "canonical", href: `https://sidingdepot.com${path}` },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(LOCAL_BUSINESS_SCHEMA),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify(getServiceSchema(`James Hardie Siding Installation in ${city}`, description, path, image)),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify(getFaqSchema([...buildFaqs(city), ...GREENSKY_FAQS])),
      },
    ],
  };
}
