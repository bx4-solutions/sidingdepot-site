import { createFileRoute } from "@tanstack/react-router";
import { Phone, CheckCircle2, ArrowRight, Calendar, X, Star, ShieldCheck, Flame, Droplets, Bug, CreditCard } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { HeroQuoteForm } from "@/components/site/HeroQuoteForm";
import { Button } from "@/components/ui/button";
import { BeforeAfterSlider } from "@/components/site/BeforeAfterSlider";
import { PartnersCarousel } from "@/components/site/PartnersCarousel";
import { GoogleReviewsCarousel } from "@/components/site/GoogleReviewsCarousel";
import { EliteBadgeSection } from "@/components/site/EliteBadgeSection";
import { MapEmbed } from "@/components/site/MapEmbed";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { SITE, BEFORE_AFTER_PAIRS } from "@/data/site";
import { CITY_LPS } from "@/data/city-lp-content";
import { SITE_ORIGIN } from "@/data/locations";
import { LOCAL_BUSINESS_SCHEMA, getFaqSchema, getServiceSchema } from "@/lib/schema";

/**
 * Alpharetta paid-traffic LP — MASTER MODEL (competitor-standard, 10 sections).
 * Mobile-first · alternating image/content · scroll-reveal transitions.
 * NO form in the hero (CTA only). Exit-intent financing offer is DESKTOP ONLY
 * (Google interstitial policy). Business rule: full replacement only, no repair.
 * Original content — nothing reused from old Alpharetta LPs.
 */

const CITY = CITY_LPS.alpharetta;
const SOURCE = "alpharetta_ga_siding_lp";

// Approved site images only (same set the live /siding page uses).
const IMG_HERO = "/hero-home.webp";
const IMG_PROBLEM = "/projects/project-5-before.webp";
const IMG_PRODUCT = "/projects/project-6.webp";
const IMG_SPECIALIST = "/projects/project-1.webp";

const SIGNS = [
  "Soft, swollen or cracked boards near the ground and gutters",
  "Paint that peels again soon after repainting",
  "Rising energy bills from a leaky exterior envelope",
  "Faded, warped panels that hurt curb appeal",
];

const SERVICES = [
  { title: "Full Siding Replacement", desc: "Complete removal and replacement of aging wood, hardboard, Masonite or vinyl siding — done once, done right." },
  { title: "James Hardie Fiber Cement", desc: "Fire-resistant, rot-proof and engineered for Georgia heat, humidity and storms. Installed to HZ10 spec." },
  { title: "New Installation & Design", desc: "Lap, board-and-batten, shake, trim and color planning for your home's architecture and HOA review." },
];

const PRODUCT_POINTS = [
  { icon: Flame, t: "Fire-resistant", d: "Non-combustible fiber cement, unlike wood or vinyl." },
  { icon: Droplets, t: "Rot & moisture-proof", d: "Built for Georgia humidity and storm exposure." },
  { icon: Bug, t: "Pest-resistant", d: "Termites and woodpeckers can't feed on it." },
];

const STEPS = [
  { n: "01", t: "Free On-Site Inspection", d: "We assess your Alpharetta home and measure everything — no cost." },
  { n: "02", t: "Itemized Quote in 24h", d: "A written price with every line detailed. No surprises." },
  { n: "03", t: "Elite Installation", d: "Our own certified crew installs to James Hardie HZ10 spec." },
  { n: "04", t: "30-Year Warranty", d: "Transferable product warranty + our workmanship guarantee." },
];

const FAQS = [
  { q: "How much does new siding cost in Alpharetta?", a: "Every home is different, so we give you a written, itemized estimate within 24 hours — and the price we quote is the price you pay. Full replacements in Alpharetta typically range from $25,000 to $65,000. GreenSky 0% APR financing is available (subject to credit approval)." },
  { q: "Why James Hardie fiber cement?", a: "It is fire-resistant, rot-proof and engineered for Georgia heat, humidity and storms. As a James Hardie Elite Contractor installing to HZ10 spec, your manufacturer warranty stays valid for the life of the product." },
  { q: "How long does a siding replacement take?", a: "Our own in-house crews complete typical full replacements in about 3 to 7 days, depending on home size, weather and scope. We coordinate planning, materials and permitting for you." },
  { q: "Do you work with Alpharetta HOA requirements?", a: "Yes. We document product, trim and color details in your estimate to support your HOA review. Final approval remains with the homeowner and HOA." },
  { q: "What warranty do you offer?", a: "James Hardie's 30-year, non-prorated, transferable product warranty, plus our own workmanship guarantee on the installation." },
];

/** SSR-safe scroll reveal. Hero is never wrapped (must be instant, above the fold). */
function Reveal({ children, from = "up", className = "" }: { children: ReactNode; from?: "up" | "left" | "right"; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") { setShown(true); return; }
    const io = new IntersectionObserver((e) => { if (e[0]?.isIntersecting) { setShown(true); io.disconnect(); } }, { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const hidden = from === "left" ? "-translate-x-8 opacity-0" : from === "right" ? "translate-x-8 opacity-0" : "translate-y-8 opacity-0";
  return <div ref={ref} className={`transition-all duration-700 ease-out ${shown ? "translate-x-0 translate-y-0 opacity-100" : hidden} ${className}`}>{children}</div>;
}

function QuoteDialog({ open, setOpen, label }: { open: boolean; setOpen: (v: boolean) => void; label: string }) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="rounded-full bg-sd-green px-8 py-6 text-base font-bold text-sd-navy hover:bg-sd-green-hover">
          <Calendar className="mr-2 h-5 w-5" /> {label}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90dvh] overflow-y-auto border-0 bg-transparent p-0 shadow-none sm:max-w-md [&>button]:hidden">
        <DialogTitle className="sr-only">Get Your Free Quote</DialogTitle>
        <div className="relative">
          <DialogClose className="absolute right-3 top-3 z-20 rounded-full bg-white/20 p-2 text-white hover:bg-white/40" aria-label="Close">
            <X className="h-4 w-4" aria-hidden="true" />
          </DialogClose>
          <HeroQuoteForm source={SOURCE} tag={`${SOURCE}_dialog`} onSuccess={() => setTimeout(() => setOpen(false), 2500)} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ExitIntentOffer({ onGetEstimate }: { onGetEstimate: () => void }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || window.innerWidth < 1024) return; // desktop only
    const seenKey = "alpharetta-lp-exit-offer-seen";
    if (sessionStorage.getItem(seenKey)) return;
    const handleMouseOut = (event: MouseEvent) => {
      if (event.relatedTarget || event.clientY > 0) return;
      sessionStorage.setItem(seenKey, "true");
      setOpen(true);
    };
    document.addEventListener("mouseout", handleMouseOut);
    return () => document.removeEventListener("mouseout", handleMouseOut);
  }, []);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md overflow-hidden rounded-2xl border-0 p-0 shadow-2xl [&>button]:hidden">
        <DialogTitle className="sr-only">Financing offer</DialogTitle>
        <DialogClose aria-label="Close offer" className="absolute right-3 top-3 z-10 rounded-full bg-sd-navy/80 p-2 text-white hover:bg-sd-black"><X className="h-4 w-4" aria-hidden="true" /></DialogClose>
        <div className="bg-sd-navy px-7 pb-6 pt-8 text-center text-white">
          <p className="text-xs font-bold uppercase tracking-[.16em] text-sd-green">Before you go</p>
          <h2 className="mt-3 font-display text-3xl leading-tight">Get New Siding Now — Pay Over Time</h2>
          <p className="mt-3 text-sm leading-relaxed text-white/80">Qualified Alpharetta homeowners can finance up to <strong>$65,000 at 0% APR</strong> through GreenSky.</p>
        </div>
        <div className="bg-white p-6 text-center">
          <Button onClick={() => { setOpen(false); onGetEstimate(); }} size="lg" className="w-full rounded-full bg-sd-green px-7 py-6 text-base font-bold text-sd-navy hover:bg-sd-green-hover">Get My Free Estimate <ArrowRight className="ml-2 h-4 w-4" /></Button>
          <p className="mt-3 text-xs text-sd-gray-text">Subject to credit approval.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export const Route = createFileRoute("/alpharetta-ga-siding")({
  head: () => {
    const url = `${SITE_ORIGIN}/alpharetta-ga-siding`;
    const title = "Alpharetta GA Siding Replacement & Installation | Siding Depot";
    const description = "Alpharetta's James Hardie Elite siding specialist. Full fiber cement siding replacement & new installation. 550+ 5-star reviews, 0% APR financing, free itemized quote in 24 hours.";
    const localBusiness = { ...LOCAL_BUSINESS_SCHEMA, name: "Siding Depot — Alpharetta", url, areaServed: { "@type": "City", name: "Alpharetta, GA" } };
    return {
      meta: [
        { title }, { name: "description", content: description }, { name: "robots", content: "noindex, nofollow" },
        { property: "og:title", content: title }, { property: "og:description", content: description }, { property: "og:url", content: url }, { property: "og:type", content: "website" },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(localBusiness) },
        { type: "application/ld+json", children: JSON.stringify(getFaqSchema([...FAQS])) },
        { type: "application/ld+json", children: JSON.stringify(getServiceSchema("James Hardie Siding Installation in Alpharetta", description, "/alpharetta-ga-siding", `${SITE_ORIGIN}${IMG_HERO}`)) },
      ],
    };
  },
  component: AlpharettaGASidingLP,
});

function AlpharettaGASidingLP() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* ── 1 · HERO (static, NO form — CTA only) ─────────────────────────── */}
      <section className="relative isolate overflow-hidden bg-sd-navy text-white">
        <img src={IMG_HERO} alt="New James Hardie fiber cement siding on an Alpharetta, GA home" className="absolute inset-0 -z-10 h-full w-full object-cover opacity-30" fetchPriority="high" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-sd-navy/95 via-sd-navy/85 to-sd-navy/60" aria-hidden />
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:py-24 lg:px-8">
          <span className="inline-block rounded bg-sd-green px-3 py-1 text-xs font-extrabold uppercase tracking-[.12em] text-sd-navy">Alpharetta, GA · James Hardie Elite Contractor</span>
          <h1 className="mt-5 font-display text-4xl leading-[1.04] sm:text-6xl">New James Hardie Siding in <span className="text-sd-green">Alpharetta</span></h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/85">Alpharetta's siding specialist — not a generalist. Get a written, itemized quote in 24 hours. The price we quote is the price you pay.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm font-semibold text-white/90">
            <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-sd-green" /> James Hardie Elite</span>
            <span className="inline-flex items-center gap-1.5"><Star className="h-4 w-4 fill-sd-green text-sd-green" /> 550+ 5-star reviews</span>
            <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-sd-green" /> Quote in 24h</span>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <QuoteDialog open={open} setOpen={setOpen} label="Get My Free Estimate" />
            <a href={SITE.phoneHref} className="inline-flex items-center justify-center gap-2 rounded-full border border-white/40 px-6 py-3 text-sm font-bold hover:bg-white/10"><Phone className="h-4 w-4" /> Call {SITE.phone}</a>
          </div>
        </div>
      </section>

      {/* ── 2 · AUTHORITY & PROOF ─────────────────────────────────────────── */}
      <EliteBadgeSection />
      <PartnersCarousel />

      {/* ── 3 · PROBLEM / SIGNS (image LEFT) ──────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-14 lg:px-8 lg:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <Reveal from="left"><img src={IMG_PROBLEM} alt="Alpharetta-area home due for full siding replacement" className="w-full rounded-2xl object-cover shadow-xl" loading="lazy" /></Reveal>
          <Reveal from="up">
            <p className="text-sm font-bold uppercase tracking-[.14em] text-sd-green-text">Is it time to replace?</p>
            <h2 className="mt-3 font-display text-3xl text-sd-black sm:text-4xl">Failing siding only gets worse in Alpharetta's climate</h2>
            <ul className="mt-6 space-y-3">{SIGNS.map((s) => (<li key={s} className="flex items-start gap-3 text-sd-gray-text"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-sd-green" /> {s}</li>))}</ul>
            <p className="mt-6 text-lg text-sd-gray-text">The fix isn't a patch — it's a <strong className="text-sd-black">complete James Hardie replacement</strong>, done once, done right.</p>
          </Reveal>
        </div>
      </section>

      {/* ── 4 · SERVICES (3 cards) ────────────────────────────────────────── */}
      <section className="bg-sd-gray-bg py-14 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <Reveal from="up" className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-[.14em] text-sd-green-text">Siding services</p>
            <h2 className="mt-3 font-display text-3xl text-sd-black sm:text-4xl">Siding replacement &amp; installation in Alpharetta</h2>
          </Reveal>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {SERVICES.map((s, i) => (
              <Reveal key={s.title} from="up" className="rounded-2xl bg-white p-7 shadow-sm" >
                <div style={{ transitionDelay: `${i * 80}ms` }}>
                  <div className="h-1 w-10 rounded-full bg-sd-green" />
                  <h3 className="mt-4 font-display text-xl text-sd-navy">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-sd-gray-text">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5 · PRODUCT — JAMES HARDIE (image RIGHT) ──────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-14 lg:px-8 lg:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <Reveal from="left" className="order-2 lg:order-1">
            <p className="text-sm font-bold uppercase tracking-[.14em] text-sd-green-text">The material</p>
            <h2 className="mt-3 font-display text-3xl text-sd-black sm:text-4xl">Why James Hardie fiber cement</h2>
            <p className="mt-4 text-lg text-sd-gray-text">Engineered for Georgia. Baked-on ColorPlus finish that holds for decades, backed by a 30-year transferable warranty.</p>
            <div className="mt-6 space-y-4">
              {PRODUCT_POINTS.map((p) => (<div key={p.t} className="flex items-start gap-3"><p.icon className="mt-0.5 h-6 w-6 shrink-0 text-sd-green-text" /><div><p className="font-bold text-sd-black">{p.t}</p><p className="text-sm text-sd-gray-text">{p.d}</p></div></div>))}
            </div>
          </Reveal>
          <Reveal from="right" className="order-1 lg:order-2"><img src={IMG_PRODUCT} alt="Close-up of new James Hardie lap siding on an Alpharetta home" className="w-full rounded-2xl object-cover shadow-xl" loading="lazy" /></Reveal>
        </div>
      </section>

      {/* ── 6 · PROCESS (4 steps) ─────────────────────────────────────────── */}
      <section className="bg-sd-navy py-14 text-white lg:py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <Reveal from="up" className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-[.14em] text-sd-green">Simple, no-pressure process</p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl">From free inspection to new siding</h2>
          </Reveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s) => (
              <Reveal key={s.n} from="up" className="rounded-2xl border border-white/15 bg-white/5 p-6">
                <div className="font-display text-4xl text-sd-green">{s.n}</div>
                <h3 className="mt-2 font-bold">{s.t}</h3>
                <p className="mt-1 text-sm text-white/75">{s.d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7 · SPECIALIST + FINANCING (image LEFT) ───────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-14 lg:px-8 lg:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <Reveal from="left"><img src={IMG_SPECIALIST} alt="Alpharetta-area home with completed James Hardie siding" className="w-full rounded-2xl object-cover shadow-xl" loading="lazy" /></Reveal>
          <Reveal from="right">
            <p className="text-sm font-bold uppercase tracking-[.14em] text-sd-green-text">Why Siding Depot</p>
            <h2 className="mt-3 font-display text-3xl text-sd-black sm:text-4xl">A specialist beats a generalist</h2>
            <p className="mt-5 text-lg leading-relaxed text-sd-gray-text">We do one thing — siding — with our own licensed crews, a written itemized quote in 24 hours, and a 30-year transferable warranty.</p>
            <div className="mt-6 rounded-2xl border border-sd-green/40 bg-sd-green-pale p-5">
              <span className="inline-flex items-center gap-2 rounded-full border border-sd-green/40 bg-sd-green/15 px-3 py-1 text-xs font-bold uppercase tracking-[.12em] text-sd-green-text"><CreditCard className="h-3.5 w-3.5" /> GreenSky Financing</span>
              <p className="mt-3 font-display text-xl text-sd-navy">0% APR up to $65,000</p>
              <p className="mt-1 text-sm text-sd-gray-text">Flexible monthly payments through GreenSky. Apply in minutes — no credit impact to check rates. Subject to approval.</p>
            </div>
            <div className="mt-7"><QuoteDialog open={open} setOpen={setOpen} label="Get My Free Estimate" /></div>
          </Reveal>
        </div>
      </section>

      {/* ── 8 · PROOF (before/after + reviews) ────────────────────────────── */}
      <section className="bg-sd-gray-bg py-14 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <Reveal from="up" className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl text-sd-black sm:text-4xl">Real results. Real reviews.</h2>
            <p className="mt-3 text-sd-gray-text">Drag the slider — same home, transformed with James Hardie.</p>
          </Reveal>
          {BEFORE_AFTER_PAIRS[0] ? (
            <Reveal from="up" className="mx-auto mt-8 max-w-4xl overflow-hidden rounded-2xl bg-white p-2 shadow-lg">
              <BeforeAfterSlider before={BEFORE_AFTER_PAIRS[0].before} after={BEFORE_AFTER_PAIRS[0].after} beforeAlt={BEFORE_AFTER_PAIRS[0].beforeAlt} afterAlt={BEFORE_AFTER_PAIRS[0].afterAlt} />
            </Reveal>
          ) : null}
        </div>
        <div className="mt-12"><GoogleReviewsCarousel /></div>
      </section>

      {/* ── 9 · FAQ ───────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-3xl px-4 py-14 lg:px-8 lg:py-20">
        <Reveal from="up" className="text-center">
          <p className="text-sm font-bold uppercase tracking-[.14em] text-sd-green-text">Alpharetta siding FAQ</p>
          <h2 className="mt-3 font-display text-3xl text-sd-black sm:text-4xl">Straight answers before your estimate</h2>
        </Reveal>
        <Accordion type="single" collapsible className="mt-8 space-y-3">
          {FAQS.map((f, i) => (
            <AccordionItem key={f.q} value={`faq-${i}`} className="rounded-xl border border-sd-gray-border px-5">
              <AccordionTrigger className="text-left font-semibold text-sd-black hover:no-underline">{f.q}</AccordionTrigger>
              <AccordionContent className="leading-relaxed text-sd-gray-text">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* ── 10 · FINAL CTA + LOCAL (form lives here) ──────────────────────── */}
      <section id="quote" className="bg-sd-navy py-14 text-white lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 lg:grid-cols-2 lg:items-center lg:px-8">
          <Reveal from="left">
            <h2 className="font-display text-3xl sm:text-4xl">Get the exact number for your Alpharetta home — free</h2>
            <p className="mt-4 text-lg text-white/80">A Hardie-trained specialist inspects your siding and hands you a written, itemized quote within 24 hours.</p>
            <div className="mt-6 rounded-2xl bg-white/5 px-5 py-4">
              <p className="font-display text-lg text-sd-green">Serving Alpharetta &amp; North Fulton</p>
              <p className="mt-1 text-sm text-white/75">{CITY.neighborhoods}</p>
              <p className="mt-1 text-xs font-semibold text-white/60">ZIP codes: {CITY.zips}</p>
            </div>
            <div className="mt-8"><MapEmbed className="h-[280px] w-full overflow-hidden rounded-2xl border border-white/10 shadow-lg" title="Siding Depot service area in Alpharetta, GA" query="Alpharetta, GA" /></div>
          </Reveal>
          <Reveal from="right" className="lg:justify-self-end"><HeroQuoteForm source={SOURCE} tag={`${SOURCE}_footer`} /></Reveal>
        </div>
      </section>

      <a href={SITE.phoneHref} className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-center gap-2 bg-sd-green py-3 text-base font-bold text-sd-navy shadow-[0_-4px_16px_rgba(0,0,0,.15)] lg:hidden"><Phone className="h-5 w-5" /> Call for a free estimate</a>
      <ExitIntentOffer onGetEstimate={() => setOpen(true)} />
    </div>
  );
}
