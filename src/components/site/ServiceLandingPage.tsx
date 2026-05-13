import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Phone,
  ShieldCheck,
  Award,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { SITE } from "@/data/site";

export type ChecklistItem = {
  Icon: LucideIcon;
  title: string;
  desc: string;
};

export type FaqItem = { q: string; a: string };

export type ServiceLandingProps = {
  /** Pill above the H1 (e.g. "GAF Factory Certified · Roofing"). */
  eyebrow: string;
  /** First part of the H1 (left of the green accent). */
  title: string;
  /** Green-accented continuation of the H1. */
  titleAccent: string;
  /** Lead paragraph under the H1. */
  intro: string;
  /** Hero background image (also used as faded backdrop). */
  heroImage: string;
  /** Heroic bullets shown under the CTAs. */
  benefits: ReadonlyArray<string>;
  /** What-to-consider checklist title (e.g. "roofer", "gutter installer"). */
  hiringRole: string;
  /** What-to-consider lead paragraph. */
  hiringIntro: string;
  /** 4–6 cards under "What to consider when hiring a {role}". */
  hiringChecklist: ReadonlyArray<ChecklistItem>;
  /** FAQ section heading word (e.g. "Roofing", "Gutter", "Window"). */
  faqLabel: string;
  /** FAQ list rendered with the standard accordion + JSON-LD upstream. */
  faqs: ReadonlyArray<FaqItem>;
  /** Optional supporting paragraph rendered between hero and checklist —
   *  useful for stuffing the SEO-required city / county / climate copy. */
  seoParagraph: string;
  /** Final CTA closing text (e.g. "decades, not seasons?"). */
  ctaAccent: string;
  /** Right-rail trust badge title (defaults to "Licensed & Insured"). */
  trustBadge?: { title: string; subtitle: string };
};

export function ServiceLandingPage({
  eyebrow,
  title,
  titleAccent,
  intro,
  heroImage,
  benefits,
  hiringRole,
  hiringIntro,
  hiringChecklist,
  faqLabel,
  faqs,
  seoParagraph,
  ctaAccent,
  trustBadge = {
    title: "Licensed & Insured",
    subtitle: "GA GC #RBQA006789",
  },
}: ServiceLandingProps) {
  return (
    <main>
      {/* HERO */}
      <section className="relative bg-sd-navy text-white overflow-hidden">
        <div className="absolute inset-0 opacity-25">
          <img
            src={heroImage}
            alt=""
            aria-hidden
            className="h-full w-full object-cover"
            fetchPriority="high"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-sd-navy via-sd-navy/80 to-transparent" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 lg:px-8 py-hero lg:py-hero-lg">
          <div className="max-w-2xl">
            <span className="inline-block rounded-pill bg-sd-green/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-sd-green ring-1 ring-sd-green/40">
              {eyebrow}
            </span>
            <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
              {title}{" "}
              <span className="text-sd-green">{titleAccent}</span>
            </h1>
            <p className="mt-6 text-lg text-white/80 leading-relaxed">{intro}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/contact">
                  Get a free estimate <ArrowRight />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outlineWhite">
                <a href={SITE.phoneHref}>
                  <Phone /> Call {SITE.phone}
                </a>
              </Button>
            </div>
            <ul className="mt-10 grid gap-3 sm:grid-cols-2 text-sm text-white/85">
              {benefits.map((b) => (
                <li key={b} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-sd-green shrink-0" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* SEO copy block */}
      <section className="bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-4xl px-4 lg:px-8">
          <p className="text-base sm:text-lg text-sd-gray-text leading-relaxed">
            {seoParagraph}
          </p>
        </div>
      </section>

      {/* What to consider when hiring */}
      <section className="bg-sd-gray-bg py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-block rounded-pill bg-sd-green-pale px-3 py-1 text-xs font-bold uppercase tracking-wider text-sd-navy">
              Hire smart
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight text-sd-black">
              What to consider when hiring a{" "}
              <span className="text-sd-green">{hiringRole}.</span>
            </h2>
            <p className="mt-5 text-base sm:text-lg text-sd-gray-text leading-relaxed">
              {hiringIntro}
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {hiringChecklist.map(({ Icon, title: itemTitle, desc }) => (
              <div
                key={itemTitle}
                className="group rounded-xl border border-sd-gray-border bg-white p-6 transition-all hover:border-sd-green hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-md bg-sd-green-pale text-sd-navy">
                  <Icon className="h-5 w-5" strokeWidth={2} />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-sd-black">
                  {itemTitle}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-sd-gray-text">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-4xl px-4 lg:px-8">
          <div className="text-center">
            <span className="inline-block rounded-pill bg-sd-green-pale px-3 py-1 text-xs font-bold uppercase tracking-wider text-sd-navy">
              FAQ
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight text-sd-black">
              {faqLabel} questions,{" "}
              <span className="text-sd-green">answered.</span>
            </h2>
          </div>

          <Accordion type="single" collapsible className="mt-10 space-y-3">
            {faqs.map((item, i) => (
              <AccordionItem
                key={item.q}
                value={`item-${i}`}
                className="rounded-xl border border-sd-gray-border bg-white px-5 sm:px-6"
              >
                <AccordionTrigger className="text-left text-base sm:text-lg font-semibold text-sd-navy hover:no-underline">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-sd-gray-text leading-relaxed">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <p className="mt-8 text-center text-sd-gray-text">
            Still have questions?{" "}
            <Link
              to="/contact"
              className="font-semibold text-sd-green hover:underline"
            >
              Talk to our team →
            </Link>
          </p>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="bg-sd-navy py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 grid gap-10 lg:grid-cols-3 items-center">
          <div className="lg:col-span-2">
            <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight">
              Ready for work that lasts{" "}
              <span className="text-sd-green">{ctaAccent}</span>
            </h2>
            <p className="mt-4 text-white/75 max-w-2xl">
              Free on-site consultation, written estimate the same day, and a
              dedicated project manager from start to finish — across Marietta,
              Alpharetta, Milton, Canton, Woodstock, Roswell, Kennesaw, Johns
              Creek, Sandy Springs and Acworth.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/contact">
                  Get a free estimate <ArrowRight />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outlineWhite">
                <a href={SITE.phoneHref}>
                  <Phone /> Call {SITE.phone}
                </a>
              </Button>
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
    </main>
  );
}

/** Build the FAQPage JSON-LD payload matching Google's required schema. */
export function faqJsonLd(faqs: ReadonlyArray<FaqItem>) {
  return {
    type: "application/ld+json",
    children: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    }),
  };
}

/**
 * Cities served across North Atlanta. Mirrors the LocalBusiness areaServed in
 * the root layout so per-service Service schema stays consistent for local SEO.
 */
const AREA_SERVED = [
  "Marietta, GA",
  "Alpharetta, GA",
  "Milton, GA",
  "Canton, GA",
  "Woodstock, GA",
  "Roswell, GA",
  "Kennesaw, GA",
  "Johns Creek, GA",
  "Sandy Springs, GA",
  "Acworth, GA",
];

/**
 * Build a Service JSON-LD enriched with a fully-described LocalBusiness
 * provider (address, phone, url, image, ratings, area served). Pair with the
 * root LocalBusiness schema to reinforce local SEO signals across each service
 * page. `canonical` should be the absolute URL of the service page.
 */
export function serviceJsonLd(
  name: string,
  description: string,
  options?: {
    canonical?: string;
    image?: string;
    serviceType?: string;
  }
) {
  const siteUrl = "https://sidingdepot.com";
  const canonical = options?.canonical;
  const image = options?.image
    ? options.image.startsWith("http")
      ? options.image
      : `${siteUrl}${options.image}`
    : `${siteUrl}/og-default.jpg`;

  return {
    type: "application/ld+json",
    children: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Service",
      ...(canonical ? { "@id": `${canonical}#service` } : {}),
      name,
      serviceType: options?.serviceType ?? name,
      description,
      ...(canonical ? { url: canonical } : {}),
      image,
      areaServed: AREA_SERVED.map((n) => ({
        "@type": "City",
        name: n,
      })),
      provider: {
        "@type": "LocalBusiness",
        "@id": `${siteUrl}#localbusiness`,
        name: SITE.legalName,
        telephone: SITE.phone,
        email: SITE.email,
        url: siteUrl,
        image: `${siteUrl}/og-default.jpg`,
        priceRange: "$$",
        address: {
          "@type": "PostalAddress",
          streetAddress: SITE.address.street,
          addressLocality: SITE.address.city,
          addressRegion: SITE.address.state,
          postalCode: SITE.address.zip,
          addressCountry: "US",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: 33.9526,
          longitude: -84.5499,
        },
        areaServed: AREA_SERVED.map((n) => ({
          "@type": "City",
          name: n,
        })),
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.9",
          reviewCount: "60",
        },
      },
    }),
  };
}

/** Build the standard meta array from page title + description + image. */
export function buildServiceMeta(args: {
  title: string;
  description: string;
  image: string;
  canonical?: string;
}) {
  const meta = [
    { title: args.title },
    { name: "description", content: args.description },
    { property: "og:title", content: args.title },
    { property: "og:description", content: args.description },
    { property: "og:image", content: args.image },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:image", content: args.image },
  ];
  return meta;
}
