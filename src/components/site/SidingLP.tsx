import { useEffect, useState } from "react";
import { z } from "zod";
import { CheckCircle2, Loader2, Phone, ShieldCheck, Star } from "lucide-react";
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
  "Canton",
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
    location: "Canton, GA",
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
  { value: "4.9★", label: "Google Rating" },
  { value: "98%", label: "Customer Satisfaction" },
] as const;

/* ------------------------------------------------------------------ */
/* Form                                                                */
/* ------------------------------------------------------------------ */

const schema = z.object({
  firstName: z.string().trim().min(1, "Required").max(60),
  lastName: z.string().trim().min(1, "Required").max(60),
  phone: z
    .string()
    .trim()
    .min(10, "Phone is required")
    .max(20)
    .regex(/^[\d\s().+-]+$/, "Invalid phone"),
  email: z.string().trim().email("Invalid email").max(255),
  city: z.string().trim().min(1, "Select a city"),
  service: z.string().trim().min(1, "Select a service"),
  notes: z.string().trim().max(1000).optional().or(z.literal("")),
});
type FormState = z.infer<typeof schema>;
type FieldErrors = Partial<Record<keyof FormState, string>>;

function formatPhone(raw: string): string {
  const d = raw.replace(/\D/g, "").slice(0, 10);
  if (d.length === 0) return "";
  if (d.length < 4) return `(${d}`;
  if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

function readUtm(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const sp = new URLSearchParams(window.location.search);
  const out: Record<string, string> = {};
  for (const k of ["utm_source", "utm_medium", "utm_campaign", "utm_keyword", "utm_term", "utm_content"]) {
    const v = sp.get(k);
    if (v) out[k] = v;
  }
  return out;
}

type LeadFormProps = {
  source: string;
  defaultCity?: string;
  defaultService?: string;
  title?: string;
  subtitle?: string;
};

function LeadForm({ source }: LeadFormProps) {
  return (
    <div data-lead-form>
      <HeroQuoteForm source={source} tag="lp_quote_request" />
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
    <main className="min-h-screen bg-white">
      {/* HEADER removed — global Navbar already renders the brand + phone */}

      {/* HERO + FORM */}
      <section className="relative overflow-hidden text-sd-black" style={{ background: "#1E2A38" }}>
        <div className="absolute inset-0">
          <img 
            src={HERO_BG} 
            alt="Siding Depot contractor installing James Hardie siding" 
            className="h-full w-full object-cover opacity-30" 
            loading="eager" 
          />
          <div className="absolute inset-0" style={{ background: "rgba(30, 42, 56, 0.65)" }} />
        </div>
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-hero-compact lg:grid-cols-[55%_45%] lg:gap-12 lg:px-8 lg:py-hero-compact-lg">
          <div>
            <span className="inline-flex items-center gap-2 rounded-pill bg-sd-green/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-sd-green ring-1 ring-sd-green/40">
              <Star className="h-3.5 w-3.5 fill-sd-green" aria-hidden="true" /> James Hardie Elite Preferred — Top 2% Nationwide
            </span>
            <h1 className="mt-5 font-display text-[36px] leading-tight sm:text-5xl lg:text-[58px] lg:leading-[1.05]">
              James Hardie® Siding Installation in {city}, GA
            </h1>
            <p className="mt-5 text-base sm:text-lg text-sd-black/75 leading-relaxed">
              Transform your home with North Atlanta's Top 2% James Hardie Elite Preferred contractor. Engineered for Georgia's climate, our siding systems combine unbeatable durability with the vibrant ColorPlus® finish.
            </p>
            <ul className="mt-6 grid gap-2.5 text-sm text-sd-black/85">
              {[
                "Licensed & Insured in Georgia",
                "Elite Preferred — Extended 30-Year Warranty",
                "No Hidden Fees — Itemized Quote",
              ].map((b) => (
                <li key={b} className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-sd-green shrink-0" aria-hidden="true" /> <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:pl-2">
            <LeadForm
              source="lp_hero"
              defaultCity={city}
              title="Get Your Free Estimate"
              subtitle="We respond within 24 hours · No obligation"
            />
          </div>
        </div>
      </section>

      {/* PROOF BAR */}
      <section
        className="text-sd-black"
        style={{ background: "#1E2A38", borderTop: "3px solid #BCD635" }}
      >
        <div className="mx-auto grid max-w-7xl gap-3 px-4 py-5 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
          {[
            "⭐ 4.9/5 Google Rating",
            "🏅 Elite Preferred — Top 2% in the U.S.",
            "🏠 1,500+ Homes in Georgia",
            "✓ Free Estimates · No Obligation",
          ].map((t) => (
            <div key={t} className="text-center text-sm font-semibold text-sd-black/90">{t}</div>
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
      <section className="text-sd-black" style={{ background: "#1E2A38" }}>
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 lg:grid-cols-2 lg:gap-12 lg:px-8 lg:py-20">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight">
              Limited Project Slots Available
            </h2>
            <p className="mt-4 text-sd-black/65 leading-relaxed">
              We limit the number of projects per month to guarantee quality on every job. Spring is
              our busiest season — North Atlanta homeowners are scheduling now.
            </p>
            <div
              className="mt-6 rounded-lg p-4 text-sm font-bold"
              style={{ background: "#BCD635", color: "#1E2A38" }}
            >
              ⚡ We&apos;re booking 3–4 weeks out. Request your estimate today to secure your spot.
            </div>
          </div>
          <div>
            <LeadForm
              source="lp_urgency"
              defaultCity={city}
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

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => scrollToLeadForm({ source: "greensky_section" })}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-pill bg-sd-green px-6 text-sm font-bold text-sd-black hover:opacity-90 transition-opacity"
              >
                Get Pre-Approved With My Free Estimate <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
              <p className="mt-2 text-xs text-sd-gray-text">
                Subject to credit approval. GreenSky® is a registered service mark of GreenSky, LLC.
              </p>
            </div>
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
                  <button
                    type="button"
                    onClick={() =>
                      scrollToLeadForm({
                        source: "faq",
                        faq_index: i,
                        faq_question: item.q,
                      })
                    }
                    className="mt-4 inline-flex h-10 items-center justify-center gap-2 rounded-pill bg-sd-green px-5 text-xs font-bold text-sd-black hover:opacity-90 transition-opacity"
                  >
                    Request My Free Estimate →
                  </button>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>


      {/* FOOTER */}
      <footer className="text-sd-black/70 text-sm" style={{ background: "#07111A" }}>
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-8 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="flex flex-col gap-1">
            <span className="text-base font-extrabold" style={{ color: "#BCD635" }}>
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
            <span className="text-sd-black/55">{SITE.address.full}</span>
            <a href="/privacy-policy" className="text-sd-black/55 hover:text-sd-green">
              Privacy Policy
            </a>
          </div>
        </div>
      </footer>

      {/* Sticky mobile call CTA */}
      <a
        href={SITE.phoneHref}
        onClick={() => track("lp_phone_click", { location: "sticky_mobile" })}
        className={`fixed inset-x-0 bottom-0 z-[9999] flex h-14 items-center justify-center gap-2 text-base font-extrabold lg:hidden transition-transform ${
          hideStickyCall ? "translate-y-full" : "translate-y-0"
        }`}
        style={{ background: "#BCD635", color: "#1E2A38" }}
        aria-hidden={hideStickyCall}
      >
        <Phone className="h-5 w-5" /> TAP TO CALL {SITE.phone}
      </a>
    </main>
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
      { name: "robots", content: "noindex, nofollow" },
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
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: "Siding Depot",
          telephone: "+16784002012",
          address: {
            "@type": "PostalAddress",
            streetAddress: "3036 Roswell Rd",
            addressLocality: "Marietta",
            addressRegion: "GA",
            postalCode: "30062",
          },
          areaServed: ["Marietta", "Alpharetta", "Milton", "Canton", "Woodstock", "Roswell", "Kennesaw"],
          priceRange: "$$$",
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [...buildFaqs(city), ...GREENSKY_FAQS].map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: {
              "@type": "Answer",
              text: f.a,
            },
          })),
        }),
      },
    ],
  };
}
