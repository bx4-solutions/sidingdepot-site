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
import { track } from "@/lib/track";

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

const FAQS = [
  {
    q: "How much does James Hardie siding cost in Marietta, GA?",
    a: "For most homes in the Marietta and North Atlanta area, a full James Hardie installation runs $15,000–$30,000 for a 2,500 sq ft home ($8–$14/sqft installed). Every estimate is itemized and fixed — the price we quote is the price you pay.",
  },
  {
    q: "Do you offer financing or 0% APR plans?",
    a: "Yes. We partner with GreenSky to offer 0% APR plans (subject to credit approval). Most homeowners get pre-approved in under 60 seconds during the consultation, with monthly payments often less than what they spend on coffee per week.",
  },
  {
    q: "How long does siding installation take?",
    a: "Most homes in North Atlanta take 3–7 days from start to finish. Your home is never left exposed overnight. We assign a dedicated project manager and communicate proactively if weather causes any delay.",
  },
  {
    q: "How long will James Hardie siding last on my home?",
    a: "James Hardie fiber cement is engineered for 50+ years and comes with a 30-year limited transferable product warranty plus our workmanship guarantee. ColorPlus® Technology keeps the finish sharp 30% longer than traditional paint.",
  },
  {
    q: "How soon can you start my project?",
    a: "We're currently booking 3–4 weeks out. Request your free estimate today to lock in your spot before our spring calendar fills up. Insurance and storm-damage projects can often be prioritized.",
  },
  {
    q: "Does insurance cover siding damage from hail or storms?",
    a: "In most cases, yes. Georgia's hail season (March–June) generates thousands of siding claims across Cobb and Cherokee counties. We work directly with your insurance adjuster and document damage on your behalf — at no cost to you.",
  },
  {
    q: "Are you really licensed and insured?",
    a: "Yes — Georgia GC #RBQA006789, fully insured with general liability and workers' comp. We're James Hardie Elite Preferred (top 2% nationwide), GAF Factory Certified, and BBB A+ accredited.",
  },
] as const;

const SIDING_TYPES = [
  {
    title: "Plank Siding",
    desc: "Long, narrow horizontal boards. Durable, low-maintenance and weather-resistant — the most popular Hardie style in North Atlanta.",
  },
  {
    title: "Board & Batten",
    desc: "Vertical panels with batten strips covering the seams. Adds height, drama and a modern-farmhouse feel to any elevation.",
  },
  {
    title: "Shingle Siding",
    desc: "Overlapping rectangular pieces for a warm, traditional look. Perfect for gables, accents and Cape Cod-style homes.",
  },
  {
    title: "Soffit, Trim & Fascia",
    desc: "The often-overlooked pieces that protect attics and crawl spaces from moisture, heat and pests — installed in matching Hardie finishes.",
  },
] as const;

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
  { value: "15+", label: "Years in Georgia" },
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
  defaultCity: string;
  defaultService?: string;
  title: string;
  subtitle: string;
};

function LeadForm({ source, defaultCity, defaultService = "James Hardie Siding", title, subtitle }: LeadFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [values, setValues] = useState<FormState>({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    city: defaultCity,
    service: defaultService,
    notes: "",
  });

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      const fe: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const k = issue.path[0] as keyof FormState;
        if (!fe[k]) fe[k] = issue.message;
      }
      setErrors(fe);
      track("lp_form_validation_error", { source, fields: Object.keys(fe).join(",") });
      return;
    }
    setErrors({});
    setSubmitting(true);
    const payload = {
      ...parsed.data,
      source,
      landingPage: typeof window !== "undefined" ? window.location.pathname : source,
      submittedAt: new Date().toISOString(),
      ...readUtm(),
    };
    try {
      if (SITE.ghlWebhookUrl) {
        await fetch(SITE.ghlWebhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      track("lp_form_submit", { source, city: parsed.data.city, service: parsed.data.service });
      setDone(true);
    } catch {
      track("lp_form_error", { source });
      setErrors({ notes: "Could not send right now. Please call us." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="w-full rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 overflow-hidden border-t-4"
      style={{ borderTopColor: "#8DC63F" }}
      data-lead-form
    >
      <div className="px-6 pt-6 pb-4 text-center">
        <h2 className="text-xl font-bold text-sd-navy">{title}</h2>
        <p className="mt-1 text-xs text-sd-gray-text">{subtitle}</p>
      </div>

      {done ? (
        <div className="px-6 pb-8 pt-2 text-center">
          <CheckCircle2 className="mx-auto h-14 w-14 text-sd-green" />
          <h3 className="mt-3 text-lg font-bold text-sd-navy">We received your request!</h3>
          <p className="mt-2 text-sm text-sd-gray-text">
            A member of our team will contact you within 24 hours to schedule your free estimate.
          </p>
          <p className="mt-4 text-sm text-sd-gray-text">
            Questions? Call us now: <strong className="text-sd-navy">{SITE.phone}</strong>
          </p>
          <a
            href={SITE.phoneHref}
            className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-pill bg-sd-green font-bold text-sd-navy hover:opacity-90 transition-opacity"
          >
            <Phone className="h-4 w-4" /> Call Us Now →
          </a>
        </div>
      ) : (
        <form onSubmit={onSubmit} noValidate className="px-6 pb-6 pt-2 grid gap-3">
          <div className="grid grid-cols-2 gap-3">
            <LpField id="lp-first" label="First Name" value={values.firstName} onChange={(v) => update("firstName", v)} error={errors.firstName} autoComplete="given-name" />
            <LpField id="lp-last" label="Last Name" value={values.lastName} onChange={(v) => update("lastName", v)} error={errors.lastName} autoComplete="family-name" />
          </div>
          <LpField
            id="lp-phone"
            label="Phone"
            type="tel"
            inputMode="tel"
            value={values.phone}
            onChange={(v) => update("phone", formatPhone(v))}
            error={errors.phone}
            autoComplete="tel"
            placeholder="(___) ___-____"
          />
          <LpField id="lp-email" label="Email" type="email" value={values.email} onChange={(v) => update("email", v)} error={errors.email} autoComplete="email" />
          <LpSelect id="lp-city" label="City" value={values.city} onChange={(v) => update("city", v)} options={CITIES as readonly string[]} error={errors.city} />
          <LpSelect id="lp-service" label="Service" value={values.service} onChange={(v) => update("service", v)} options={SERVICES as readonly string[]} error={errors.service} />
          <div className="grid gap-1.5">
            <Label htmlFor="lp-notes" className="text-xs font-semibold text-sd-black">
              Notes <span className="text-sd-gray-text font-normal">(optional)</span>
            </Label>
            <Textarea
              id="lp-notes"
              rows={2}
              maxLength={1000}
              placeholder="Tell us about your project..."
              value={values.notes ?? ""}
              onChange={(e) => update("notes", e.target.value)}
              className="resize-none"
            />
            {errors.notes && <p className="text-[11px] text-destructive">{errors.notes}</p>}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-1 inline-flex h-[52px] w-full items-center justify-center gap-2 rounded-pill bg-sd-green text-base font-bold text-sd-navy hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {submitting ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Sending…</>
            ) : (
              "GET MY FREE ESTIMATE →"
            )}
          </button>
          <p className="flex items-center justify-center gap-1.5 text-[12px] text-sd-gray-text">
            <ShieldCheck className="h-3.5 w-3.5" /> Your information is secure. No spam, ever.
          </p>
        </form>
      )}
    </div>
  );
}

function LpField({
  id, label, value, onChange, error, type = "text", inputMode, autoComplete, placeholder,
}: {
  id: string; label: string; value: string; onChange: (v: string) => void;
  error?: string; type?: string; inputMode?: "tel" | "email" | "text";
  autoComplete?: string; placeholder?: string;
}) {
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id} className="text-xs font-semibold text-sd-black">{label}</Label>
      <Input
        id={id}
        type={type}
        inputMode={inputMode}
        autoComplete={autoComplete}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={Boolean(error)}
        className="h-11"
      />
      {error && <p className="text-[11px] text-destructive">{error}</p>}
    </div>
  );
}

function LpSelect({
  id, label, value, onChange, options, error,
}: {
  id: string; label: string; value: string; onChange: (v: string) => void;
  options: readonly string[]; error?: string;
}) {
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id} className="text-xs font-semibold text-sd-black">{label}</Label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={Boolean(error)}
        className="h-11 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-sd-navy/30"
      >
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
      {error && <p className="text-[11px] text-destructive">{error}</p>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export type SidingLPProps = { city: string };

export function SidingLP({ city }: SidingLPProps) {
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
      <section className="relative overflow-hidden text-white" style={{ background: "#1E2A38" }}>
        <div className="absolute inset-0">
          <img src={HERO_BG} alt="" aria-hidden className="h-full w-full object-cover opacity-30" loading="eager" />
          <div className="absolute inset-0" style={{ background: "rgba(30, 42, 56, 0.65)" }} />
        </div>
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-hero-compact lg:grid-cols-[55%_45%] lg:gap-12 lg:px-8 lg:py-hero-compact-lg">
          <div>
            <span className="inline-flex items-center gap-2 rounded-pill bg-sd-green/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-sd-green ring-1 ring-sd-green/40">
              <Star className="h-3.5 w-3.5 fill-sd-green" /> James Hardie Elite Preferred — Top 2% Nationwide
            </span>
            <h1 className="mt-5 font-display text-[36px] leading-tight sm:text-5xl lg:text-[58px] lg:leading-[1.05]">
              James Hardie Siding Installation in {city}, GA
            </h1>
            <p className="mt-5 text-base sm:text-lg text-white/75 leading-relaxed">
              Georgia&apos;s most trusted fiber cement contractor. Serving Marietta, Alpharetta,
              Milton, Canton & North Atlanta. Free estimate in 24 hours.
            </p>
            <ul className="mt-6 grid gap-2.5 text-sm text-white/85">
              {[
                "Licensed & Insured in Georgia",
                "Elite Preferred — Extended 30-Year Warranty",
                "No Hidden Fees — Itemized Quote",
              ].map((b) => (
                <li key={b} className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-sd-green shrink-0" /> <span>{b}</span>
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
        className="text-white"
        style={{ background: "#1E2A38", borderTop: "3px solid #8DC63F" }}
      >
        <div className="mx-auto grid max-w-7xl gap-3 px-4 py-5 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
          {[
            "⭐ 4.9/5 Google Rating",
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
                <h3 className="mt-3 text-lg font-bold text-sd-navy">{c.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-sd-gray-text">{c.desc}</p>
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
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sd-navy text-sm font-bold text-sd-green">
                    {r.initials}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-sd-navy">{r.name}</p>
                    <p className="text-xs text-sd-gray-text">{r.location}</p>
                  </div>
                  <div className="ml-auto flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-sd-green text-sd-green" />
                    ))}
                  </div>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-sd-gray-text">{r.text}</p>
                <span className="mt-2 inline-block rounded-pill bg-sd-green-pale px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-sd-navy">
                  Google Review
                </span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4 self-center">
            {STATS.map((s) => (
              <div key={s.label} className="rounded-xl bg-white p-6 text-center shadow-sm ring-1 ring-black/5">
                <div className="text-4xl font-extrabold text-sd-navy">{s.value}</div>
                <div className="mt-2 text-xs font-semibold uppercase tracking-wider text-sd-gray-text">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* URGENCY + CTA */}
      <section className="text-white" style={{ background: "#1E2A38" }}>
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 lg:grid-cols-2 lg:gap-12 lg:px-8 lg:py-20">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight">
              Limited Project Slots Available
            </h2>
            <p className="mt-4 text-white/65 leading-relaxed">
              We limit the number of projects per month to guarantee quality on every job. Spring is
              our busiest season — North Atlanta homeowners are scheduling now.
            </p>
            <div
              className="mt-6 rounded-lg p-4 text-sm font-bold"
              style={{ background: "#8DC63F", color: "#1E2A38" }}
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

      {/* FAQ */}
      <section className="bg-white py-16 lg:py-20">
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
                <AccordionTrigger className="text-left text-base font-semibold text-sd-navy hover:no-underline">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-sd-gray-text leading-relaxed">
                  {item.a}
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
            <span className="text-base font-extrabold" style={{ color: "#8DC63F" }}>
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

      {/* Sticky mobile call CTA */}
      <a
        href={SITE.phoneHref}
        onClick={() => track("lp_phone_click", { location: "sticky_mobile" })}
        className={`fixed inset-x-0 bottom-0 z-[9999] flex h-14 items-center justify-center gap-2 text-base font-extrabold lg:hidden transition-transform ${
          hideStickyCall ? "translate-y-full" : "translate-y-0"
        }`}
        style={{ background: "#8DC63F", color: "#1E2A38" }}
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
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
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
    ],
  };
}
