import { SITE } from "@/data/site";

export const BASE_URL = "https://sidingdepot.com";
export const ORG_ID = `${BASE_URL}/#organization`;
export const LOCAL_BUSINESS_ID = `${BASE_URL}/#localbusiness`;

export const ORG_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": ORG_ID,
  name: SITE.name,
  legalName: SITE.legalName,
  url: BASE_URL,
  logo: {
    "@type": "ImageObject",
    "@id": `${BASE_URL}/#logo`,
    url: `${BASE_URL}/logo.png`,
    contentUrl: `${BASE_URL}/logo.png`,
    caption: SITE.name,
  },
  image: {
    "@id": `${BASE_URL}/#logo`,
  },
  sameAs: [
    SITE.social.facebook,
    SITE.social.instagram,
    SITE.social.youtube,
    SITE.social.tiktok,
    "https://www.bbb.org/us/ga/marietta/profile/siding-contractors/siding-depot-llc-0443-27604557",
    "https://www.guildquality.com/profile/siding-depot-llc",
  ],
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: SITE.phone,
      contactType: "customer service",
      areaServed: "US",
      availableLanguage: "en",
    },
  ],
};

export const LOCAL_BUSINESS_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "HomeAndConstructionBusiness",
  "@id": LOCAL_BUSINESS_ID,
  name: SITE.name,
  image: `${BASE_URL}/og-default.jpg`,
  // aggregateRating is emitted dynamically from the root with LIVE Google stats
  // (same @id → Google merges the nodes). No static rating here.
  telephone: SITE.phone,
  url: BASE_URL,
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
    latitude: 33.9806,
    longitude: -84.4752,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "08:00",
      closes: "18:00",
    },
  ],
  priceRange: "$$",
  parentOrganization: {
    "@id": ORG_ID,
  },
  areaServed: [
    {
      "@type": "City",
      name: "Marietta",
      sameAs: "https://en.wikipedia.org/wiki/Marietta,_Georgia",
    },
    { "@type": "City", name: "Alpharetta" },
    { "@type": "City", name: "Milton" },
    { "@type": "City", name: "Woodstock" },
    { "@type": "City", name: "Roswell" },
    { "@type": "City", name: "Kennesaw" },
    { "@type": "City", name: "Johns Creek" },
    { "@type": "City", name: "Sandy Springs" },
    { "@type": "City", name: "Acworth" },
    { "@type": "City", name: "Cumming" },
    { "@type": "City", name: "Canton" },
  ],
};

export function getServiceSchema(name: string, description: string, url: string, image?: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url: `${BASE_URL}${url}`,
    image: image ? (image.startsWith("http") ? image : `${BASE_URL}${image}`) : undefined,
    provider: {
      "@id": LOCAL_BUSINESS_ID,
    },
    areaServed: LOCAL_BUSINESS_SCHEMA.areaServed,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Exterior Home Improvement Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "James Hardie Siding Installation",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Exterior Painting",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Window Replacement",
          },
        },
      ],
    },
  };
}

export function getFaqSchema(faqs: ReadonlyArray<{ q: string; a: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };
}

export function getBreadcrumbSchema(items: ReadonlyArray<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url.startsWith("http") ? it.url : `${BASE_URL}${it.url}`,
    })),
  };
}

export function getProjectSchema(project: any) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title ?? project.alt,
    description: project.description ?? project.alt,
    image: project.src.startsWith("http") ? project.src : `${BASE_URL}${project.src}`,
    dateCreated: project.date,
    locationCreated: project.city ? { "@type": "Place", name: project.city } : undefined,
    creator: {
      "@id": LOCAL_BUSINESS_ID,
    },
    keywords: project.tags.join(", "),
  };
}
