import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { FloatingCTA } from "@/components/site/FloatingCTA";
import { SITE } from "@/data/site";

const GTM_ID = "GTM-TFGQWCQN";
const GA4_ID = import.meta.env.VITE_GA4_ID as string | undefined;

const ORG_JSONLD = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://sidingdepot.com/#organization",
  name: SITE.name,
  legalName: SITE.legalName,
  image: "https://sidingdepot.com/og-default.jpg",
  logo: "https://sidingdepot.com/logo.png",
  telephone: SITE.phone,
  email: SITE.email,
  url: "https://sidingdepot.com",
  description: "Georgia's trusted James Hardie Elite Preferred contractor. Specializing in siding, painting, windows, and home exteriors.",
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
    latitude: 33.9806, // Marietta coordinates approx
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
  sameAs: [
    SITE.social.facebook,
    SITE.social.instagram,
    SITE.social.youtube,
    SITE.social.tiktok,
  ],
  areaServed: [
    { "@type": "City", name: "Marietta", sameAs: "https://en.wikipedia.org/wiki/Marietta,_Georgia" },
    { "@type": "City", name: "Alpharetta" },
    { "@type": "City", name: "Milton" },
    { "@type": "City", name: "Canton" },
    { "@type": "City", name: "Woodstock" },
    { "@type": "City", name: "Roswell" },
    { "@type": "City", name: "Kennesaw" },
    { "@type": "City", name: "Johns Creek" },
    { "@type": "City", name: "Sandy Springs" },
    { "@type": "City", name: "Acworth" },
  ],
  priceRange: "$$",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "128",
  },
};

function NotFoundComponent() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl text-sd-navy">404</h1>
        <h2 className="mt-3 text-xl font-semibold text-sd-black">Page not found</h2>
        <p className="mt-2 text-sm text-sd-gray-text">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center justify-center rounded-pill bg-sd-green px-6 py-3 text-sm font-semibold text-sd-black hover:bg-sd-green-hover"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold text-sd-black">This page didn't load</h1>
        <p className="mt-2 text-sm text-sd-gray-text">Something went wrong on our end.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="rounded-pill bg-sd-green px-6 py-3 text-sm font-semibold text-sd-black hover:bg-sd-green-hover"
          >
            Try again
          </button>
          <a href="/" className="rounded-pill border-2 border-sd-green px-6 py-3 text-sm font-semibold text-sd-green hover:bg-sd-green hover:text-sd-black">
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Siding Depot — James Hardie Elite Preferred Contractor" },
      { name: "description", content: "Georgia's trusted James Hardie Elite Preferred contractor. Siding, painting, windows, decks, gutters, roofing in Marietta, Alpharetta, Milton, Canton & North Atlanta." },
      { name: "author", content: "Siding Depot LLC" },
      { name: "google-site-verification", content: "Q3iqnEYQT-FjjpwrinYUm2LxJYgmuYrBgQDgPPcBiQ8" },
      { name: "theme-color", content: "#0A0A0A" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Siding Depot" },
      { property: "og:title", content: "Siding Depot — James Hardie Elite Preferred Contractor in North Atlanta GA" },
      { property: "og:description", content: "Georgia's trusted James Hardie Elite Preferred contractor. Siding, painting, windows, decks, gutters, roofing in Marietta, Alpharetta, Milton, Canton & North Atlanta." },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Siding Depot — James Hardie Elite Preferred Contractor in North Atlanta GA" },
      { name: "twitter:description", content: "Georgia's trusted James Hardie Elite Preferred contractor. Siding, painting, windows, decks, gutters, roofing in Marietta, Alpharetta, Milton, Canton & North Atlanta." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/43cab0b0-cb06-42f1-a067-d5f0523e2835" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/43cab0b0-cb06-42f1-a067-d5f0523e2835" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Bebas+Neue&display=swap",
      },
    ],
    scripts: [
      // Google Tag Manager
      {
        children: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`,
      },
      // GA4 (only if env var present)
      ...(GA4_ID
        ? [
            { src: `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`, async: true },
            {
              children: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA4_ID}');`,
            },
          ]
        : []),
      // Organization / LocalBusiness schema
      { type: "application/ld+json", children: JSON.stringify(ORG_JSONLD) },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {/* GTM noscript fallback */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
            title="gtm"
          />
        </noscript>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-h-screen flex-col bg-background overflow-x-clip">
        <Navbar />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
        <FloatingCTA />
      </div>
    </QueryClientProvider>
  );
}
