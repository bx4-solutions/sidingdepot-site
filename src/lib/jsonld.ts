import { SITE } from "@/data/site";

/**
 * Generates comprehensive JSON-LD schemas for service landing pages.
 * Includes Organization, LocalBusiness, Service, and optional FAQPage.
 */

export interface ServiceSchemaInput {
  title: string;
  description: string;
  serviceType: string;
  image?: string;
  faqs?: Array<{ q: string; a: string }>;
  city?: string;
}

/**
 * Organization schema (sitewide identity)
 */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.legalName,
    url: "https://sidingdepot.com",
    logo: "https://sidingdepot.com/logo.png",
    sameAs: ["https://www.facebook.com/sidingdepot", "https://www.instagram.com/sidingdepot"],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: SITE.phone,
      contactType: "Customer Service",
    },
  };
}

/**
 * LocalBusiness schema with James Hardie credentials and service areas
 */
export function localBusinessSchema(city?: string) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://sidingdepot.com",
    name: SITE.legalName,
    image: "https://sidingdepot.com/og-default.jpg",
    description:
      "James Hardie Elite Preferred siding and exterior contractor serving North Atlanta with 20+ years experience, 1,500+ homes completed.",
    telephone: SITE.phone,
    email: SITE.email,
    url: "https://sidingdepot.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.street,
      addressLocality: SITE.address.city,
      addressRegion: SITE.address.state,
      postalCode: SITE.address.zip,
      addressCountry: "US",
    },
    areaServed: city
      ? [{ "@type": "City", name: `${city}, GA` }]
      : [
          { "@type": "City", name: "Marietta, GA" },
          { "@type": "City", name: "Alpharetta, GA" },
          { "@type": "City", name: "Milton, GA" },
          { "@type": "City", name: "Greater Marietta, GA" },
          { "@type": "City", name: "Woodstock, GA" },
          { "@type": "City", name: "Roswell, GA" },
          { "@type": "City", name: "Kennesaw, GA" },
          { "@type": "City", name: "Johns Creek, GA" },
          { "@type": "City", name: "Sandy Springs, GA" },
          { "@type": "City", name: "Acworth, GA" },
        ],
    priceRange: "$$",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.5",
      ratingCount: "160",
      reviewCount: "160",
      bestRating: "5",
      worstRating: "1",
    },
    sameAs: ["https://www.facebook.com/sidingdepot", "https://www.instagram.com/sidingdepot"],
    // James Hardie Elite Preferred Certification
    knowsAbout: ["James Hardie Fiber Cement Siding", "Exterior Home Renovation", "Home Remodeling"],
  };
}

/**
 * Service schema for a specific service offering
 */
export function serviceSchema(input: ServiceSchemaInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: input.title,
    description: input.description,
    serviceType: input.serviceType,
    image: input.image || "https://sidingdepot.com/og-default.jpg",
    provider: {
      "@type": "LocalBusiness",
      name: SITE.legalName,
      url: "https://sidingdepot.com",
      image: "https://sidingdepot.com/og-default.jpg",
      telephone: SITE.phone,
      priceRange: "$$",
      address: {
        "@type": "PostalAddress",
        streetAddress: SITE.address.street,
        addressLocality: SITE.address.city,
        addressRegion: SITE.address.state,
        postalCode: SITE.address.zip,
        addressCountry: "US",
      },
    },
    areaServed: input.city
      ? [{ "@type": "City", name: `${input.city}, GA` }]
      : [
          { "@type": "City", name: "Marietta, GA" },
          { "@type": "City", name: "Alpharetta, GA" },
          { "@type": "City", name: "Milton, GA" },
          { "@type": "City", name: "Greater Marietta, GA" },
          { "@type": "City", name: "Woodstock, GA" },
          { "@type": "City", name: "Roswell, GA" },
          { "@type": "City", name: "Kennesaw, GA" },
          { "@type": "City", name: "Johns Creek, GA" },
          { "@type": "City", name: "Sandy Springs, GA" },
          { "@type": "City", name: "Acworth, GA" },
        ],
    url: "https://sidingdepot.com",
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      description: "Free estimate — no obligation",
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "LocalBusiness",
        name: SITE.legalName,
      },
    },
  };
}

/**
 * FAQPage schema from FAQ items
 */
export function faqPageSchema(faqs: Array<{ q: string; a: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };
}

/**
 * Breadcrumb schema for deep pages (service pages, location pages)
 */
export function breadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * VideoObject schema for embedded videos
 */
export function videoSchema(input: {
  id: string;
  title: string;
  description: string;
  thumbnailUrl?: string;
  uploadDate?: string;
  duration?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: input.title,
    description: input.description,
    thumbnailUrl: input.thumbnailUrl || `https://i.ytimg.com/vi/${input.id}/maxresdefault.jpg`,
    uploadDate: input.uploadDate,
    duration: input.duration,
    contentUrl: `https://www.youtube.com/watch?v=${input.id}`,
    embedUrl: `https://www.youtube.com/embed/${input.id}`,
    publisher: {
      "@type": "Organization",
      name: SITE.legalName,
      logo: {
        "@type": "ImageObject",
        url: "https://sidingdepot.com/logo.png",
      },
    },
  };
}

/**
 * AggregateOffer schema for service pricing
 */
export function aggregateOfferSchema(input: {
  serviceName: string;
  minPrice?: string;
  maxPrice?: string;
  priceCurrency?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "AggregateOffer",
    name: input.serviceName,
    offers: [
      {
        "@type": "Offer",
        priceCurrency: input.priceCurrency || "USD",
        price: input.minPrice || "Contact for estimate",
        priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
      },
    ],
  };
}

/**
 * Generate complete set of schemas for a service landing page
 */
export function generateServicePageSchemas(input: ServiceSchemaInput): object[] {
  const schemas: object[] = [
    organizationSchema(),
    localBusinessSchema(input.city),
    serviceSchema(input),
  ];

  if (input.faqs && input.faqs.length > 0) {
    schemas.push(faqPageSchema(input.faqs));
  }

  return schemas;
}
