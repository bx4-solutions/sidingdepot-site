import { createFileRoute, notFound, Link, useRouter } from "@tanstack/react-router";
import { useEffect } from "react";
import { Phone, CheckCircle2, Calendar } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { HeroQuoteForm } from "@/components/site/HeroQuoteForm";
import { Button } from "@/components/ui/button";
import { HeroSection } from "@/components/site/HeroSection";
import { ProofBar } from "@/components/site/ProofBar";
import { TestimonialCard } from "@/components/site/TestimonialCard";
import { MapEmbed } from "@/components/site/MapEmbed";
import {
  isValidLocation,
  getCityMeta,
  getServiceMeta,
  SITE_ORIGIN,
} from "@/data/locations";
import { SITE, HERO } from "@/data/site";
import { LOCAL_BUSINESS_SCHEMA, getServiceSchema, getFaqSchema } from "@/lib/schema";


export const Route = createFileRoute("/locations/$city/$service")({
  loader: ({ params }) => {
    if (!isValidLocation(params.city, params.service)) {
      throw notFound();
    }
    const city = getCityMeta(params.city)!;
    const service = getServiceMeta(params.service)!;
    return { city, service };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const { city, service } = loaderData;
    const title = `${service.title} in ${city.name}, GA — Siding Depot`;
    const description = `Local ${service.title.toLowerCase()} expert in ${city.name}, GA. James Hardie Elite Preferred contractor. Free quote in 24h.`;
    const url = `${SITE_ORIGIN}/locations/${city.slug}/${service.slug}`;

    const localBusiness = {
      ...LOCAL_BUSINESS_SCHEMA,
      name: `Siding Depot — ${city.name}`,
      url,
      areaServed: { "@type": "City", name: `${city.name}, GA` },
    };

    const serviceSchema = getServiceSchema(
      `${service.title} in ${city.name}`,
      description,
      `/locations/${city.slug}/${service.slug}`,
      "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/43cab0b0-cb06-42f1-a067-d5f0523e2835"
    );

    const faqSchema = getFaqSchema([
      {
        q: `Do you provide ${service.title.toLowerCase()} estimates in ${city.name}?`,
        a: `Yes, Siding Depot provides free, on-site estimates for ${service.title.toLowerCase()} projects throughout ${city.name} and the surrounding ${city.county} area.`,
      },
      {
        q: `Is Siding Depot licensed to work in ${city.name}, GA?`,
        a: `Yes, we are a fully licensed Georgia General Contractor (#RBQA006789) and carry comprehensive insurance for all ${service.title.toLowerCase()} work in ${city.name}.`,
      },
    ]);

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/43cab0b0-cb06-42f1-a067-d5f0523e2835" },
        { property: "og:url", content: url },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/43cab0b0-cb06-42f1-a067-d5f0523e2835" },
      ],
      links: [
        { rel: "canonical", href: url },
        { rel: "preload", as: "image", href: HERO.bgImage, fetchPriority: "high" as any },
      ],
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(localBusiness) },
        { type: "application/ld+json", children: JSON.stringify(serviceSchema) },
        { type: "application/ld+json", children: JSON.stringify(faqSchema) },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <h1 className="font-display text-5xl text-sd-navy">Location not available</h1>
      <p className="mt-4 text-sd-gray-text">
        We don't have a dedicated landing page for this combination yet.
      </p>
      <Button asChild className="mt-8">
        <Link to="/">Back to home</Link>
      </Button>
    </div>
  ),
  component: LocationPage,
});

function LocationPage() {
  const { city, service } = Route.useLoaderData();
  const router = useRouter();
  const location = router.state.location;

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (location.pathname !== location.pathname.toLowerCase()) {
      router.navigate({
        to: location.pathname.toLowerCase() as any,
        replace: true,
      });
    }
  }, [location.pathname, router]);

  return (
    <>
      <HeroSection
        badge={`${city.name}, GA · Elite Preferred`}
        title={
          <>
            {service.title} in{" "}
            <span className="text-sd-green">{city.name}, GA</span>
          </>
        }
        subtitle={`Local ${service.title.toLowerCase()} done right by Georgia's most trusted exterior contractor — serving ${city.name} (${city.county}) and all of North Atlanta.`}
      />

      <ProofBar />

      <section className="py-16 lg:py-24 bg-white">
        <div className="mx-auto max-w-4xl px-4 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-sd-black tracking-tight">
            Why {city.name} homeowners choose Siding Depot for {service.title.toLowerCase()}
          </h2>
          <ul className="mt-6 space-y-3">
            {[
              `12+ years of ${service.title.toLowerCase()} projects in ${city.county}.`,
              `Crews based in North Atlanta — fast scheduling for ${city.name} addresses.`,
              `Familiar with local HOAs, permits and architectural standards.`,
              `Transparent written quotes — no surprises after we start.`,
              `Licensed, insured, and James Hardie Elite Preferred (top 2%).`,
            ].map((b) => (
              <li key={b} className="flex gap-3 text-sd-black">
                <CheckCircle2 className="h-5 w-5 text-sd-green shrink-0 mt-0.5" />
                <span>{b}</span>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-wrap gap-4">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="px-10 py-7 text-lg font-bold bg-sd-green text-sd-navy hover:bg-sd-green-hover shadow-xl shadow-sd-green/20 rounded-full transition-all hover:scale-105">
                  <Calendar className="mr-2 h-5 w-5" />
                  Get a free {city.name} quote
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-transparent border-0 shadow-none">
                <DialogTitle className="sr-only">Get Your Free Quote</DialogTitle>
                <HeroQuoteForm 
                  source={`location_page_${city.slug}_${service.slug}`} 
                  tag={`location_page_${city.slug}_${service.slug}_quote`}
                  onSuccess={() => setTimeout(() => setOpen(false), 2500)}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-sd-gray-bg">
        <div className="mx-auto max-w-5xl px-4 lg:px-8">
          <h2 className="text-3xl font-extrabold text-sd-black mb-12 text-center tracking-tight">
            What {city.name} customers say
          </h2>
          <div className="grid gap-5 md:grid-cols-2">
            <TestimonialCard
              name="Local Homeowner"
              city={city.name}
              text={`The Siding Depot team made our ${service.title.toLowerCase()} project effortless. Best decision we made this year.`}
            />
            <TestimonialCard
              name="Verified Customer"
              city={city.name}
              text="On time, on budget, no surprises. The crew respected our property and the finish looks incredible."
            />
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-24 bg-white">
        <div className="mx-auto max-w-5xl px-4 lg:px-8">
          <div className="text-center mb-10">
            <span className="inline-block text-xs font-bold tracking-[0.12em] uppercase text-sd-green-text bg-sd-green-pale px-3 py-1 rounded">
              Service Area
            </span>
            <h2 className="mt-4 text-3xl font-extrabold text-sd-black tracking-tight">
              Serving {city.name}, {city.county}
            </h2>
            <p className="mt-3 text-sd-gray-text max-w-xl mx-auto">
              Crews dispatched from our Marietta showroom — typical arrival within North Atlanta same week.
            </p>
          </div>
          <MapEmbed
            className="h-[380px]"
            title={`Service area for ${city.name}, GA`}
            query={`${city.name}, ${city.county}, GA`}
          />
        </div>
      </section>
    </>
  );
}
