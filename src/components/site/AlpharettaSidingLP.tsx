import { useEffect, useState } from "react";
import { ArrowRight, CheckCircle2, Phone, ShieldCheck, Star, X } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { BeforeAfterSlider } from "@/components/site/BeforeAfterSlider";
import { EliteBadgeSection } from "@/components/site/EliteBadgeSection";
import { HeroQuoteForm } from "@/components/site/HeroQuoteForm";
import { PartnersCarousel } from "@/components/site/PartnersCarousel";
import { SITE } from "@/data/site";
import { buildFaqs, SIDING_TYPES } from "@/data/lp-content";
import { useGoogleStats } from "@/lib/google-stats-context";
import { getFaqSchema, getServiceSchema, LOCAL_BUSINESS_SCHEMA } from "@/lib/schema";

const CITY = "Alpharetta";
const PATH = "/lp/siding-alpharetta";

const LOCAL_FAQS = [
  {
    q: "How much does siding replacement cost in Alpharetta?",
    a: "Cost depends on the home size, material, trim work and repairs found after removal. We provide a written, itemized estimate after inspecting your Alpharetta home so you can compare the scope clearly.",
  },
  {
    q: "What siding performs best in Alpharetta's climate?",
    a: "Fiber cement is a strong option for Georgia heat, humidity and storm exposure. It resists rot and insects better than many aging wood or hardboard systems when installed and maintained correctly.",
  },
  {
    q: "Do you work with Alpharetta HOA requirements?",
    a: "Yes. We can provide a detailed product and color scope to support your HOA review. Final approval requirements vary by neighborhood and remain with the homeowner and HOA.",
  },
  {
    q: "How long does a siding replacement take?",
    a: "Most single-family siding projects take roughly one to two weeks once work begins, depending on home size, weather, scope and any necessary repairs.",
  },
] as const;

function scrollToQuote() {
  document.getElementById("alpharetta-quote")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function ExitIntentOffer() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const seenKey = "alpharetta-siding-exit-offer-seen";
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
      <DialogContent className="max-h-[92dvh] max-w-md overflow-y-auto border-0 bg-transparent p-0 shadow-none [&>button]:hidden">
        <DialogTitle className="sr-only">Before you go</DialogTitle>
        <div className="relative overflow-hidden rounded-2xl bg-white shadow-2xl">
          <DialogClose aria-label="Close offer" className="absolute right-3 top-3 z-10 rounded-full bg-sd-navy/80 p-2 text-white hover:bg-sd-black">
            <X className="h-4 w-4" />
          </DialogClose>
          <div className="bg-sd-navy px-7 pb-6 pt-8 text-center text-white">
            <p className="text-xs font-bold uppercase tracking-[.16em] text-sd-green">Before you go</p>
            <h2 className="mt-3 text-3xl font-extrabold">Get a personalized exterior plan for your Alpharetta home.</h2>
            <p className="mt-3 text-sm leading-relaxed text-white/80">Request your free written estimate and we'll help you review siding, trim and color options for your project.</p>
          </div>
          <div className="p-5">
            <HeroQuoteForm
              source="lp_siding_alpharetta_exit_intent"
              tag="alpharetta_siding_exit_offer"
              bare
              submitLabel="Send My Project Request →"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function AlpharettaSidingLP() {
  const { rating, totalReviews } = useGoogleStats();
  const faqs = [...LOCAL_FAQS, ...buildFaqs(CITY).slice(0, 2)];

  return (
    <main className="min-h-screen bg-white">
      <section className="relative isolate overflow-hidden bg-sd-navy text-white">
        <img
          src="/hero-home.webp"
          alt="James Hardie fiber cement siding on an Alpharetta, Georgia home"
          className="absolute inset-0 -z-20 h-full w-full object-cover"
          fetchPriority="high"
        />
        <div className="absolute inset-0 -z-10 bg-sd-navy/80" />
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:py-20 lg:grid-cols-[1.15fr_.85fr] lg:items-center lg:px-8">
          <div className="max-w-3xl">
            <p className="inline-flex items-center rounded-full border border-sd-green/40 bg-sd-green/10 px-3 py-1 text-xs font-bold uppercase tracking-[.14em] text-sd-green">
              Alpharetta, GA · Free written estimate
            </p>
            <h1 className="mt-5 font-display text-4xl leading-[1.04] sm:text-5xl lg:text-6xl">
              James Hardie Siding Installation in Alpharetta, GA
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/85">
              Replace failing siding with a durable exterior system built for Georgia heat, humidity and storms. Get a detailed estimate from Siding Depot's North Atlanta team.
            </p>
            <div className="mt-7 flex flex-wrap gap-x-5 gap-y-3 text-sm font-semibold text-white/90">
              <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-sd-green" /> Licensed & insured</span>
              <span className="inline-flex items-center gap-2"><Star className="h-4 w-4 fill-sd-green text-sd-green" /> {rating}/5 from {totalReviews} Google reviews</span>
              <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-sd-green" /> James Hardie Elite Contractor</span>
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button onClick={scrollToQuote} size="lg" className="bg-sd-green px-7 text-base font-bold text-sd-navy hover:bg-sd-green-hover">
                Get My Free Alpharetta Estimate <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <a href={SITE.phoneHref} className="inline-flex items-center justify-center gap-2 rounded-md border border-white/35 px-6 py-3 text-sm font-bold hover:bg-white/10">
                <Phone className="h-4 w-4" /> Call {SITE.phone}
              </a>
            </div>
          </div>
          <div id="alpharetta-quote" className="scroll-mt-6">
            <HeroQuoteForm
              source="lp_siding_alpharetta_hero"
              tag="alpharetta_siding_google_ads"
              title="Get Your Free Alpharetta Estimate"
              subtitle="Tell us about your siding project — we'll follow up within 24 hours."
              submitLabel="Request My Free Estimate →"
            />
          </div>
        </div>
      </section>

      <section className="border-y-2 border-sd-green bg-sd-black py-4 text-white">
        <div className="mx-auto grid max-w-7xl gap-3 px-4 text-center text-sm font-semibold sm:grid-cols-3 lg:px-8">
          <span>Detailed, itemized written estimates</span>
          <span>Fiber cement, siding replacement & repair</span>
          <span>Serving Alpharetta & North Fulton County</span>
        </div>
      </section>

      <EliteBadgeSection />

      <PartnersCarousel />

      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-[.14em] text-sd-green-text">Project transformation</p>
            <h2 className="mt-3 text-3xl font-extrabold text-sd-black sm:text-4xl">See how a siding replacement changes the whole exterior.</h2>
            <p className="mt-4 text-sd-gray-text">Drag the slider to compare an existing project before and after. Your Alpharetta estimate is based on your home's actual conditions and scope.</p>
          </div>
          <div className="mx-auto mt-10 max-w-5xl">
            <BeforeAfterSlider
              before="/projects/home-before.webp"
              after="/projects/home-after.webp"
              beforeAlt="Before siding replacement on a North Atlanta home"
              afterAlt="After James Hardie siding replacement by Siding Depot"
            />
            <p className="mt-4 text-center text-sm text-slate-500">
              Representative North Atlanta transformation. We serve homeowners throughout Downtown Alpharetta,
              Avalon, Windward, Crabapple, and Country Club of the South.
            </p>
          </div>
          <div className="mt-8 flex justify-center">
            <Button onClick={scrollToQuote} className="bg-sd-navy px-7 font-bold text-white hover:bg-sd-black">Discuss My Home's Exterior <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[.14em] text-sd-green-text">Siding for Alpharetta homes</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-sd-black sm:text-4xl">A better exterior starts with the right scope.</h2>
            <p className="mt-5 text-lg leading-relaxed text-sd-gray-text">
              Alpharetta homes see long humid summers, heavy rain and seasonal storms. Older wood, hardboard and Masonite siding can trap moisture and lead to swelling, paint failure and rot — especially around trim, gutters, windows and chimneys.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-sd-gray-text">
              We inspect the full exterior, explain the condition we find and build a practical plan for replacement, repair, trim and finishing details. That means a clear scope before work starts — not surprises after demolition.
            </p>
          </div>
          <div className="rounded-2xl bg-sd-gray-bg p-7">
            <h3 className="text-xl font-bold text-sd-black">Common issues we inspect</h3>
            <ul className="mt-5 space-y-4">
              {[
                "Soft, swollen or crumbling boards near the ground and behind gutters",
                "Paint that peels again soon after repainting",
                "Damaged trim, window surrounds and chimney transitions",
                "Insect or woodpecker damage on aging wood materials",
              ].map((item) => (
                <li key={item} className="flex gap-3 text-sd-gray-text"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-sd-green-text" />{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-sd-gray-bg py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[.14em] text-sd-green-text">Siding services</p>
            <h2 className="mt-3 text-3xl font-extrabold text-sd-black sm:text-4xl">Siding options for Alpharetta homeowners</h2>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {SIDING_TYPES.map((type) => (
              <article key={type.title} className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-black/5">
                <div className="h-1 w-10 rounded-full bg-sd-green" />
                <h3 className="mt-4 text-lg font-bold text-sd-black">{type.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-sd-gray-text">{type.desc}</p>
              </article>
            ))}
          </div>
          <div className="mt-8 grid gap-4 text-sm text-sd-gray-text md:grid-cols-3">
            <p><strong className="text-sd-black">Replacement:</strong> Full removal and replacement of aging wood, hardboard, Masonite or vinyl siding.</p>
            <p><strong className="text-sd-black">Repair:</strong> Targeted repairs for rot, storm damage and local failures when appropriate.</p>
            <p><strong className="text-sd-black">Design details:</strong> Lap, board-and-batten, shake, trim and color planning for your home's architecture.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
          <img src="/siding-installation-crews.webp" alt="Siding Depot crew installing fiber cement siding in North Atlanta" className="h-full min-h-72 w-full rounded-2xl object-cover" loading="lazy" />
          <div>
            <p className="text-sm font-bold uppercase tracking-[.14em] text-sd-green-text">Local project planning</p>
            <h2 className="mt-3 text-3xl font-extrabold text-sd-black sm:text-4xl">Built for Alpharetta's homes and neighborhoods</h2>
            <p className="mt-5 text-lg leading-relaxed text-sd-gray-text">From Downtown Alpharetta and Avalon to Windward, Crabapple and Country Club of the South, homeowners often need an exterior plan that balances durability, curb appeal and HOA review.</p>
            <p className="mt-4 text-lg leading-relaxed text-sd-gray-text">We'll document product, trim and color details in your estimate so you have a practical scope for your home and, where applicable, your HOA submission.</p>
            <Button onClick={scrollToQuote} variant="outline" className="mt-7 border-sd-navy text-sd-navy hover:bg-sd-navy hover:text-white">Plan My Siding Project <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </div>
        </div>
      </section>

      <section className="bg-sd-navy py-16 text-white lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-[.14em] text-sd-green">Clear pricing. Flexible financing.</p>
            <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">Know what your project includes before work begins.</h2>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/80">Your estimate is written and itemized so you can understand materials, labor and project details. Ask your estimator about available financing options for qualified homeowners.</p>
            <Button onClick={scrollToQuote} className="mt-7 bg-sd-green text-sd-navy hover:bg-sd-green-hover">Request My Estimate <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {["Written project scope", "Licensed & insured crews", "James Hardie Elite Contractor", "Project-specific financing discussion"].map((item) => (
              <div key={item} className="rounded-xl border border-white/15 bg-white/5 p-5 font-semibold"><CheckCircle2 className="mb-3 h-5 w-5 text-sd-green" />{item}</div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 lg:px-8 lg:py-24">
        <p className="text-center text-sm font-bold uppercase tracking-[.14em] text-sd-green-text">Alpharetta siding FAQ</p>
        <h2 className="mt-3 text-center text-3xl font-extrabold text-sd-black sm:text-4xl">Questions before your siding estimate</h2>
        <Accordion type="single" collapsible className="mt-9 space-y-3">
          {faqs.map((faq, index) => (
            <AccordionItem key={faq.q} value={`faq-${index}`} className="rounded-xl border border-sd-gray-border px-5">
              <AccordionTrigger className="text-left font-semibold text-sd-black hover:no-underline">{faq.q}</AccordionTrigger>
              <AccordionContent className="leading-relaxed text-sd-gray-text">{faq.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <section className="bg-sd-green px-4 py-16 text-center text-sd-navy lg:py-20">
        <h2 className="text-3xl font-extrabold sm:text-4xl">Get Your Free Alpharetta Siding Estimate</h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg">Tell us what you are seeing on your home's exterior. We'll follow up with next steps and a time to review your project.</p>
        <div className="mt-7 flex flex-wrap justify-center gap-4">
          <Button onClick={scrollToQuote} size="lg" className="bg-sd-navy px-7 font-bold text-white hover:bg-sd-black">Get My Free Estimate <ArrowRight className="ml-2 h-4 w-4" /></Button>
          <a href={SITE.phoneHref} className="inline-flex items-center gap-2 rounded-md border border-sd-navy/50 px-6 py-3 text-sm font-bold"><Phone className="h-4 w-4" /> {SITE.phone}</a>
        </div>
      </section>
      <ExitIntentOffer />
    </main>
  );
}

export function alpharettaSidingLpHead() {
  const title = "James Hardie Siding in Alpharetta, GA | Siding Depot";
  const description = "James Hardie siding installation, replacement and repair in Alpharetta, GA. Get a free written estimate from Siding Depot's North Atlanta team.";
  const canonicalUrl = `https://www.sidingdepot.com${PATH}`;
  return {
    meta: [
      { title }, { name: "description", content: description }, { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: title }, { property: "og:description", content: description }, { property: "og:url", content: canonicalUrl }, { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: canonicalUrl }],
    scripts: [
      { type: "application/ld+json", children: JSON.stringify(LOCAL_BUSINESS_SCHEMA) },
      { type: "application/ld+json", children: JSON.stringify(getServiceSchema("James Hardie Siding Installation in Alpharetta", description, PATH, "https://www.sidingdepot.com/hero-home.webp")) },
      { type: "application/ld+json", children: JSON.stringify(getFaqSchema(LOCAL_FAQS)) },
    ],
  };
}
