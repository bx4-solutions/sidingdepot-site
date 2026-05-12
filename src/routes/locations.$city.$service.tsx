import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { Phone, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroSection } from "@/components/site/HeroSection";
import { ProofBar } from "@/components/site/ProofBar";
import { TestimonialCard } from "@/components/site/TestimonialCard";
import {
  isValidLocation,
  getCityMeta,
  getServiceMeta,
  SITE_ORIGIN,
} from "@/data/locations";
import { SITE } from "@/data/site";

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
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: `Siding Depot — ${city.name}`,
      url,
      telephone: SITE.phone,
      address: {
        "@type": "PostalAddress",
        streetAddress: SITE.address.street,
        addressLocality: SITE.address.city,
        addressRegion: SITE.address.state,
        postalCode: SITE.address.zip,
        addressCountry: "US",
      },
      areaServed: { "@type": "City", name: `${city.name}, GA` },
    };

    const serviceSchema = {
      "@context": "https://schema.org",
      "@type": "Service",
      serviceType: service.title,
      provider: { "@type": "LocalBusiness", name: "Siding Depot" },
      areaServed: { "@type": "City", name: `${city.name}, GA` },
      url,
    };

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
        { property: "og:type", content: "website" },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(localBusiness) },
        { type: "application/ld+json", children: JSON.stringify(serviceSchema) },
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
        <Link to="/service-areas">View all service areas</Link>
      </Button>
    </div>
  ),
  component: LocationPage,
});

function LocationPage() {
  const { city, service } = Route.useLoaderData();

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

      <section className="py-16 lg:py-20 bg-background">
        <div className="mx-auto max-w-4xl px-4 lg:px-8">
          <h2 className="text-3xl font-bold text-sd-black">
            Why {city.name} homeowners choose Siding Depot for {service.title.toLowerCase()}
          </h2>
          <ul className="mt-6 space-y-3">
            {[
              `15+ years of ${service.title.toLowerCase()} projects in ${city.county}.`,
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

          <div className="mt-10 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link
                to="/contact"
                search={{ city: city.slug, service: service.slug } as never}
              >
                Get a free {city.name} quote
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href={SITE.phoneHref}>
                <Phone /> Call {SITE.phone}
              </a>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-sd-gray-bg">
        <div className="mx-auto max-w-5xl px-4 lg:px-8">
          <h2 className="text-2xl font-bold text-sd-black mb-8 text-center">
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
    </>
  );
}
