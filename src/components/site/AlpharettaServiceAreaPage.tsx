import { ArrowRight, CheckCircle2, MapPin, Phone, ShieldCheck, Star } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { HeroQuoteForm } from "@/components/site/HeroQuoteForm";
import { SERVICES, SITE } from "@/data/site";
import { buildFaqs } from "@/data/lp-content";
import { useGoogleStats } from "@/lib/google-stats-context";
import sidingHouseHero from "@/assets/siding-house-hero-pool.webp";
import sidingCrew from "@/assets/siding-installation-crews.webp";

const featuredServices = SERVICES.filter((service) =>
  ["siding", "painting", "windows", "doors", "roofing", "gutters"].includes(service.slug),
);

const reviews = [
  {
    name: "Michael T.",
    text: "The crew showed up on time, kept the site clean, and the finished Hardie siding made our home look brand new.",
  },
  {
    name: "Sarah R.",
    text: "Clear estimate, thoughtful recommendations, and excellent communication from the first visit through the final walkthrough.",
  },
  {
    name: "David & Jennifer K.",
    text: "Siding Depot made a large exterior project feel organized and stress-free. We would recommend them to any neighbor.",
  },
] as const;

function scrollToQuote() {
  document.querySelector("#alpharetta-quote")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function AlpharettaServiceAreaPage() {
  const { rating, totalReviews } = useGoogleStats();
  const faqs = buildFaqs("Alpharetta").slice(0, 5);

  return (
    <main className="bg-white text-sd-black">
      <section className="relative isolate overflow-hidden bg-sd-navy text-white">
        <img
          src={sidingHouseHero}
          alt="Renovated North Atlanta home with new exterior siding"
          className="absolute inset-0 -z-20 h-full w-full object-cover object-center opacity-35"
          fetchPriority="high"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-sd-navy via-sd-navy/90 to-sd-navy/55" />
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:py-20 lg:grid-cols-[1fr_410px] lg:items-center lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-sm font-semibold text-sd-green">
              <MapPin className="h-4 w-4" /> Proudly serving Alpharetta, GA
            </div>
            <h1 className="mt-5 font-display text-5xl leading-[0.95] sm:text-6xl lg:text-7xl">
              Exterior Remodeling for Alpharetta Homes
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/85">
              James Hardie siding, exterior painting, windows, doors, roofing, and gutters —
              planned around your home and installed by a local team that communicates clearly.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button onClick={scrollToQuote} size="lg" className="rounded-pill bg-sd-green px-7 font-bold text-sd-black hover:bg-sd-green-hover">
                Request a Free Quote <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <a href={SITE.phoneHref} className="inline-flex items-center gap-2 font-bold text-white hover:text-sd-green">
                <Phone className="h-4 w-4" /> {SITE.phone}
              </a>
            </div>
            <p className="mt-6 text-sm text-white/70">Licensed & insured · Detailed written estimate · Response within 24 hours</p>
          </div>
          <div id="alpharetta-quote" className="scroll-mt-28">
            <HeroQuoteForm source="alpharetta_service_area_hero" tag="alpharetta_quote" title="Get Your Free Quote" subtitle="Tell us about your Alpharetta project." />
          </div>
        </div>
      </section>

      <section className="border-b border-sd-gray-border bg-sd-black text-white">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-5 text-center text-sm font-semibold sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
          <p>⭐ {rating}/5 · {totalReviews} Google Reviews</p>
          <p>James Hardie Elite Contractor</p>
          <p>1,500+ North Atlanta Homes</p>
          <p>Free, no-obligation estimates</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 lg:grid-cols-[.85fr_1.15fr] lg:items-center lg:px-8 lg:py-24">
        <img src={sidingCrew} alt="Siding Depot installation crew at work" className="aspect-[4/3] w-full rounded-2xl object-cover shadow-xl" loading="lazy" />
        <div>
          <span className="text-sm font-bold uppercase tracking-[.16em] text-sd-green-text">Alpharetta home exteriors</span>
          <h2 className="mt-3 font-display text-4xl leading-none sm:text-5xl">Built for the way you live in Alpharetta.</h2>
          <p className="mt-5 text-base leading-relaxed text-sd-gray-text sm:text-lg">
            Your exterior should protect your investment and make you proud when you pull into the driveway. Siding Depot helps Alpharetta homeowners update aging, damaged, or dated exteriors with durable materials and a managed installation process.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {["A dedicated project manager", "Premium, proven materials", "Clear scope before work begins", "Respectful, tidy job sites"].map((item) => (
              <p key={item} className="flex items-center gap-2 text-sm font-semibold"><CheckCircle2 className="h-4 w-4 text-sd-green-text" />{item}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-sd-green-pale py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="max-w-2xl">
            <span className="text-sm font-bold uppercase tracking-[.16em] text-sd-green-text">Professional services</span>
            <h2 className="mt-3 font-display text-4xl leading-none sm:text-5xl">Everything your exterior needs.</h2>
            <p className="mt-4 text-sd-gray-text">One trusted local team for the projects that shape your home’s curb appeal, comfort, and protection.</p>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featuredServices.map(({ slug, title, short, image, Icon }) => (
              <a key={slug} href={`/${slug}`} className="group overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                <img src={image.src} alt="" className="h-48 w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" />
                <div className="p-6">
                  <Icon className="h-5 w-5 text-sd-green-text" />
                  <h3 className="mt-3 text-xl font-bold">{title}</h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-sd-gray-text">{short}</p>
                  <span className="mt-5 inline-flex items-center text-sm font-bold text-sd-green-text">Explore service <ArrowRight className="ml-1 h-4 w-4" /></span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-start">
          <div>
            <span className="text-sm font-bold uppercase tracking-[.16em] text-sd-green-text">Why Siding Depot</span>
            <h2 className="mt-3 font-display text-4xl leading-none sm:text-5xl">A better remodeling experience starts here.</h2>
            <p className="mt-5 text-lg leading-relaxed text-sd-gray-text">We combine high-performance products with a simple process: understand the home, define the scope, communicate the schedule, and deliver workmanship that lasts.</p>
            <Button onClick={scrollToQuote} className="mt-7 rounded-pill bg-sd-navy px-6 text-white hover:bg-sd-dark">Plan my project</Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {[{ title: "Local expertise", text: "A North Atlanta team that understands local homes, weather, and expectations." }, { title: "Premium workmanship", text: "Certified installation practices and materials selected to perform." }, { title: "Straight answers", text: "A clear estimate, proactive updates, and a team accountable to the plan." }].map((item, index) => (
              <article key={item.title} className="rounded-2xl border border-sd-gray-border p-6"><span className="font-display text-4xl text-sd-green-text">0{index + 1}</span><h3 className="mt-8 text-lg font-bold">{item.title}</h3><p className="mt-3 text-sm leading-relaxed text-sd-gray-text">{item.text}</p></article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-sd-navy py-16 text-white lg:py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><span className="text-sm font-bold uppercase tracking-[.16em] text-sd-green">Homeowner feedback</span><h2 className="mt-3 font-display text-4xl leading-none sm:text-5xl">Trusted by North Atlanta homeowners.</h2></div><p className="text-white/70">Real projects. Clear communication. Lasting results.</p></div>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">{reviews.map((review) => <article key={review.name} className="rounded-2xl bg-white p-6 text-sd-black"><div className="flex text-sd-green-text">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}</div><p className="mt-5 leading-relaxed text-sd-gray-text">“{review.text}”</p><p className="mt-5 text-sm font-bold">{review.name}</p><p className="text-xs text-sd-gray-text">Alpharetta area homeowner</p></article>)}</div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 lg:grid-cols-[1fr_.85fr] lg:items-start lg:px-8 lg:py-24">
        <div><span className="text-sm font-bold uppercase tracking-[.16em] text-sd-green-text">Frequently asked questions</span><h2 className="mt-3 font-display text-4xl leading-none sm:text-5xl">Answers before you get started.</h2><Accordion type="single" collapsible className="mt-8">{faqs.map((faq, index) => <AccordionItem key={faq.q} value={`faq-${index}`} className="border-b border-sd-gray-border"><AccordionTrigger className="text-left font-bold hover:no-underline">{faq.q}</AccordionTrigger><AccordionContent className="leading-relaxed text-sd-gray-text">{faq.a}</AccordionContent></AccordionItem>)}</Accordion></div>
        <aside className="rounded-2xl bg-sd-green p-8 text-sd-black"><ShieldCheck className="h-8 w-8" /><h2 className="mt-7 font-display text-4xl leading-none">Ready to improve your home?</h2><p className="mt-4 leading-relaxed text-sd-black/75">Tell us what you are planning. We will schedule a convenient on-site consultation and prepare a detailed, no-obligation estimate.</p><Button onClick={scrollToQuote} className="mt-7 w-full rounded-pill bg-sd-navy text-white hover:bg-sd-dark">Request my free quote</Button><a href={SITE.phoneHref} className="mt-5 flex items-center justify-center gap-2 text-sm font-bold"><Phone className="h-4 w-4" />{SITE.phone}</a></aside>
      </section>
    </main>
  );
}
