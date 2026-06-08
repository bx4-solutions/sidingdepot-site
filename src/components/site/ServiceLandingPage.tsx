import { useEffect } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Phone,
  ShieldCheck,
  Award,
  CheckCircle2,
  type LucideIcon,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { SITE, SERVICES } from "@/data/site";
import { HeroQuoteForm } from "@/components/site/HeroQuoteForm";
import { useState } from "react";
import { type SocialProof, getServiceVariation, AB_CONTENT, SOCIAL_PROOF } from "@/data/ab-testing";
import { getSeoForVariation } from "@/data/seo-config";
import { trackVariationView, trackCtaClick, trackCallClick } from "@/lib/track";
import { getFaqSchema, getServiceSchema } from "@/lib/schema";
import { useGoogleStats } from "@/lib/google-stats-context";
import { HiringChecklist } from "@/components/site/HiringChecklist";
import { FaqSection } from "@/components/site/FaqSection";
import { GoogleReviewsCarousel } from "@/components/site/GoogleReviewsCarousel";
import { EliteBadgeSection } from "@/components/site/EliteBadgeSection";
import { HiringChecklistItem } from "./HiringChecklist";
import { FaqItem as GlobalFaqItem } from "./FaqSection";

export type ChecklistItem = HiringChecklistItem;
export type FaqItem = GlobalFaqItem;

export type ServiceLandingProps = {
  eyebrow: string;
  title: string;
  titleAccent: string;
  intro: string;
  heroImage: string;
  benefits: ReadonlyArray<string>;
  hiringRole: string;
  hiringIntro: string;
  hiringChecklist: ReadonlyArray<ChecklistItem>;
  faqLabel: string;
  faqs: ReadonlyArray<FaqItem>;
  seoParagraph: string;
  ctaAccent: string;
  trustBadge?: { title: string; subtitle: string };
  socialProof?: SocialProof;
  serviceKey?: string;
  city?: string;
  /** When true, hero displays the image as a side visual (right column) and places the CTA button below the text. */
  heroImageSide?: boolean;
  heroImageAlt?: string;
};

const ServiceFormModal = ({ source, tag }: { source: string; tag: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="w-full sm:w-auto px-6 sm:px-10 py-4 sm:py-7 text-base sm:text-lg font-bold bg-sd-green text-sd-navy hover:bg-sd-green-hover shadow-xl shadow-sd-green/20 rounded-full transition-all hover:scale-105"
        >
          Get My Free Quote →
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md p-0 overflow-y-auto max-h-[85dvh] bg-transparent border-0 shadow-none">
        <DialogTitle className="sr-only">Get Your Free Quote</DialogTitle>
        <HeroQuoteForm
          source={source}
          tag={tag}
          onSuccess={() => setTimeout(() => setOpen(false), 2500)}
        />
      </DialogContent>
    </Dialog>
  );
};

export function ServiceLandingPage({
  eyebrow: manualEyebrow,
  title: manualTitle,
  titleAccent: manualAccent,
  intro: manualIntro,
  heroImage,
  benefits: manualBenefits,
  hiringRole,
  hiringIntro: manualHiringIntro,
  hiringChecklist,
  faqLabel,
  faqs,
  seoParagraph,
  ctaAccent,
  trustBadge = { title: "Licensed & Insured", subtitle: "GA GC #RBQA006789" },
  socialProof: manualSocialProof,
  serviceKey = "siding",
  city = "Marietta",
  heroImageSide = false,
  heroImageAlt = "",
}: ServiceLandingProps) {
  const variation = getServiceVariation(serviceKey);
  const abContent = AB_CONTENT[serviceKey]?.[variation];
  const seo = getSeoForVariation(serviceKey, variation);

  const [heroModalOpen, setHeroModalOpen] = useState(false);
  const [midModalOpen, setMidModalOpen] = useState(false);
  const [imgError, setImgError] = useState(false);

  const fallbackImage =
    "https://images.unsplash.com/photo-1632759145351-1d592919f522?auto=format&fit=crop&q=80&w=1200";

  // Use AB content if available, fallback to manual props
  const eyebrow = abContent?.eyebrow ?? manualEyebrow;
  const title = abContent?.title ?? manualTitle;
  const titleAccent = abContent?.titleAccent ?? manualAccent;
  const intro = abContent?.intro ?? manualIntro;
  const benefits = abContent?.benefits ?? manualBenefits;
  const hiringIntro = abContent?.hiringIntro ?? manualHiringIntro;
  const process = abContent?.process;

  const { rating: googleRating, totalReviews: googleReviews } = useGoogleStats();
  const rawSocialProof = manualSocialProof || SOCIAL_PROOF[serviceKey] || SOCIAL_PROOF["siding"];
  // Override the Google Reviews stat with live data from context
  const socialProof = {
    ...rawSocialProof,
    stats: rawSocialProof.stats.map((s: any) =>
      s.label.includes("Google")
        ? { ...s, value: `⭐ ${googleRating}`, label: `${googleReviews} Google Reviews` }
        : s,
    ),
  };

  // Internal links for SEO consistency
  const relatedServices = SERVICES.filter((s) => s.slug !== serviceKey).slice(0, 3);

  // Track variation view + override <title>/meta description on client per assigned variation
  useEffect(() => {
    if (typeof document === "undefined") return;
    trackVariationView({ serviceKey, variation, city });
    const t = seo.metaTitle(city);
    if (t) document.title = t;
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute("content", seo.metaDesc);
    const ogt = document.querySelector('meta[property="og:title"]');
    if (ogt) ogt.setAttribute("content", t);
    const ogd = document.querySelector('meta[property="og:description"]');
    if (ogd) ogd.setAttribute("content", seo.metaDesc);
  }, [serviceKey, variation, city, seo]);

  const ctx = { serviceKey, variation, city };

  return (
    <div className="bg-white">
      {/* HERO */}
      <section className="relative bg-sd-navy text-white overflow-hidden">
        {!heroImageSide && (
          <div className="absolute inset-0 opacity-25">
            <img
              src={imgError ? fallbackImage : heroImage}
              alt=""
              aria-hidden
              className="h-full w-full object-cover object-center"
              loading="lazy"
              onError={() => setImgError(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-sd-navy via-sd-navy/80 to-transparent" />
          </div>
        )}
        <div className="relative mx-auto max-w-7xl px-4 lg:px-8 py-hero lg:py-hero-lg">
          {heroImageSide ? (
            <div className="grid gap-8 lg:gap-10 lg:grid-cols-2 lg:items-center">
              <div className="max-w-2xl">
                <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-white">
                  {title} <span className="text-sd-green">{titleAccent}</span>
                </h1>
                <div className="mt-6 text-lg text-white/80 leading-relaxed space-y-4">
                  {intro.split("\n\n").map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
                {benefits && benefits.length > 0 && (
                  <ul className="mt-5 space-y-2">
                    {benefits.map((b) => (
                      <li
                        key={b}
                        className="flex items-center gap-2 text-sm sm:text-base text-white/90"
                      >
                        <CheckCircle2 className="h-4 w-4 text-sd-green shrink-0" />
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
                <div className="mt-8 mb-4 lg:mb-0">
                  <ServiceFormModal
                    source={`service_${serviceKey}_hero`}
                    tag={`service_${serviceKey}_quote`}
                  />
                </div>
              </div>
              <div className="relative">
                <img
                  src={imgError ? fallbackImage : heroImage}
                  alt={heroImageAlt}
                  className="w-full aspect-[4/3] lg:aspect-[4/5] object-cover object-center rounded-2xl shadow-2xl ring-1 ring-white/10"
                  fetchPriority="high"
                  onError={() => setImgError(true)}
                />
              </div>
            </div>
          ) : (
            <div className="grid gap-10 lg:grid-cols-[1.1fr_minmax(0,420px)] lg:items-start">
              <div className="max-w-2xl">
                <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-white">
                  {title} <span className="text-sd-green">{titleAccent}</span>
                </h1>
                <div className="mt-6 text-lg text-white/80 leading-relaxed space-y-4">
                  {intro.split("\n\n").map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </div>
              <div className="lg:sticky lg:top-24 flex justify-center">
                <ServiceFormModal
                  source={`service_${serviceKey}_hero`}
                  tag={`service_${serviceKey}_quote`}
                />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* SOCIAL PROOF SECTION */}
      {socialProof && (
        <section className="bg-white py-12 lg:py-16">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-3">
              {socialProof.stats.map((s) => (
                <div
                  key={s.label}
                  className="flex items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-sd-gray-border"
                >
                  <div className="p-3 bg-sd-green-pale rounded-full text-sd-green">
                    <s.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-sd-navy">{s.value}</div>
                    <div className="text-sm font-bold text-sd-gray-text">{s.label}</div>
                    {s.description && (
                      <div className="mt-1 text-xs text-sd-gray-text/80 leading-snug">
                        {s.description}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {socialProof.reviews.map((r, i) => (
                <div
                  key={i}
                  className="bg-white p-6 rounded-xl shadow-sm border border-sd-gray-border"
                >
                  <div className="flex text-sd-green mb-3">
                    {[...Array(r.rating)].map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-sd-green" />
                    ))}
                  </div>
                  <p className="text-sm text-sd-gray-text italic leading-relaxed">"{r.text}"</p>
                  <p className="mt-4 text-xs font-bold text-sd-navy">
                    {r.name} — {r.city}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SEO copy block — visually hidden, preserved for crawlers */}
      <p className="sr-only">{seoParagraph}</p>

      {/* What to consider when hiring / Process */}
      {process ? (
        <section className="bg-white py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="max-w-3xl">
              <span className="inline-block rounded-pill bg-sd-green-pale px-3 py-1 text-xs font-bold uppercase tracking-wider text-sd-navy">
                Hire smart
              </span>
              <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight text-sd-black">
                {seo?.h2 || `Certified ${faqLabel} Experts in ${city}`}
              </h2>
              <p className="mt-5 text-base sm:text-lg text-sd-gray-text leading-relaxed">
                {hiringIntro}
              </p>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {process.map((step, i) => (
                <div
                  key={i}
                  className="group flex flex-col h-full rounded-xl border border-sd-gray-border bg-white p-6 transition-all hover:border-sd-green hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-md bg-sd-green-pale text-sd-navy font-bold text-xl shrink-0">
                    {i + 1}
                  </div>
                  <div className="mt-4 flex flex-col flex-grow">
                    <h3 className="text-lg font-semibold text-sd-black leading-tight">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-sd-gray-text">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <HiringChecklist
          items={hiringChecklist}
          heading={`Why North Atlanta Homeowners Choose Siding Depot for ${faqLabel}.`}
          subheading={hiringIntro}
        />
      )}

      {/* Internal Linking Section */}
      <section className="py-8 bg-white border-t border-sd-dark/5">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-2xl font-display text-sd-dark mb-8">Related Services in {city}</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {relatedServices.map((s) => (
              <Button
                key={s.slug}
                asChild
                variant="outline"
                className="rounded-full border-2 border-sd-navy text-sd-navy font-semibold hover:bg-sd-green hover:text-sd-black hover:border-sd-green"
              >
                <Link to={`/${s.slug}`}>{s.title} Installation</Link>
              </Button>
            ))}
            <Button
              asChild
              variant="outline"
              className="rounded-full border-2 border-sd-navy text-sd-navy font-semibold hover:bg-sd-green hover:text-sd-black hover:border-sd-green"
            >
              <Link to="/contact">Free {city} Estimate</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Mid-page quote form (below the fold) */}
      <section className="bg-white py-20 lg:py-24 border-t border-sd-gray-border">
        <div className="mx-auto max-w-5xl px-4 lg:px-8 grid gap-10 lg:grid-cols-[1fr_minmax(0,420px)] lg:items-center">
          <div>
            <span className="inline-block rounded-pill bg-sd-green-pale px-3 py-1 text-xs font-bold uppercase tracking-wider text-sd-navy">
              Free Quote · 24h Response
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold leading-tight text-sd-black">
              Ready to start your <span className="text-sd-green">{faqLabel.toLowerCase()}</span>{" "}
              project in {city}?
            </h2>
            <p className="mt-4 text-base sm:text-lg text-sd-gray-text leading-relaxed">
              Tell us about your project and our team will respond within 24 hours with a written
              estimate — no obligation.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-sd-gray-text">
              {[
                "24-hour response from our local team",
                "Detailed written estimate",
                "Licensed & insured · GA GC #RBQA006789",
              ].map((b) => (
                <li key={b} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-sd-green shrink-0" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex justify-center">
            <ServiceFormModal
              source={`service_${serviceKey}_midpage`}
              tag={`service_${serviceKey}_quote`}
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FaqSection
        items={faqs}
        eyebrow="FAQ"
        title={`${faqLabel} questions,`}
        titleAccent="answered."
      />

      <EliteBadgeSection />
      <GoogleReviewsCarousel />

      {/* Closing CTA */}
      <section className="section-dark py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 grid gap-10 lg:grid-cols-3 items-center">
          <div className="lg:col-span-2">
            <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight text-white">
              Ready for work that lasts <span className="text-sd-green">{ctaAccent}</span>
            </h2>
            <p className="mt-4 text-white/75 max-w-2xl">
              Free on-site consultation, written estimate the same day, and a dedicated project
              manager from start to finish.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <ServiceFormModal
                source={`service_${serviceKey}_footer`}
                tag={`service_${serviceKey}_quote`}
              />
            </div>
          </div>
          <div className="grid gap-3">
            <div className="flex items-center gap-3 rounded-lg bg-white/5 p-4 ring-1 ring-white/10">
              <Award className="h-6 w-6 text-sd-green" />
              <div>
                <p className="font-semibold">{trustBadge.title}</p>
                <p className="text-xs text-white/60">{trustBadge.subtitle}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-white/5 p-4 ring-1 ring-white/10">
              <ShieldCheck className="h-6 w-6 text-sd-green" />
              <div>
                <p className="font-semibold">Licensed &amp; Insured</p>
                <p className="text-xs text-white/60">GA GC #RBQA006789</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export function faqJsonLd(faqs: ReadonlyArray<FaqItem>) {
  return {
    type: "application/ld+json",
    children: JSON.stringify(getFaqSchema(faqs)),
  };
}

export function serviceJsonLd(
  name: string,
  description: string,
  options?: {
    canonical?: string;
    image?: string;
    serviceType?: string;
  },
) {
  const path = options?.canonical ? new URL(options.canonical).pathname : "";
  return {
    type: "application/ld+json",
    children: JSON.stringify(getServiceSchema(name, description, path, options?.image)),
  };
}

export function buildServiceMeta(args: {
  title: string;
  description: string;
  image: string;
  canonical?: string;
}) {
  return [
    { title: args.title },
    { name: "description", content: args.description },
    { property: "og:title", content: args.title },
    { property: "og:description", content: args.description },
    { property: "og:image", content: args.image },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:image", content: args.image },
  ];
}
