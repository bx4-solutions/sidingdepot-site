import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect } from "react";

import appCss from "../styles.css?url";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { FloatingCTA } from "@/components/site/FloatingCTA";
import { MascotGreeter } from "@/components/site/MascotGreeter";
import { AnalyticsTracker } from "@/components/AnalyticsTracker";
import { SITE } from "@/data/site";
import { ORG_SCHEMA, LOCAL_BUSINESS_SCHEMA, LOCAL_BUSINESS_ID } from "@/lib/schema";
import { fetchGooglePlaceStats } from "@/lib/place-stats.server";
import { getGoogleReviews } from "@/lib/google-reviews.functions";
import { GoogleStatsContext, GoogleReviewsContext } from "@/lib/google-stats-context";
import { GhlChatWidget } from "@/components/site/GhlChatWidget";

const GTM_ID = "GTM-TFGQWCQN";
const GA4_ID = import.meta.env.VITE_GA4_ID as string | undefined;
// Set VITE_META_PIXEL_ID=<pixel_id> in Vercel env vars to activate Meta Pixel
const META_PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID as string | undefined;
const METRICOOL_TRACKER_SCRIPT =
  'function loadScript(a){var b=document.getElementsByTagName("head")[0],c=document.createElement("script");c.type="text/javascript",c.src="https://tracker.metricool.com/resources/be.js",c.onreadystatechange=a,c.onload=a,b.appendChild(c)}loadScript(function(){beTracker.t({hash:"5650f1d5ea63827a1cce95efe75d00f4"})});';

function NotFoundComponent() {
  const router = useRouter();
  const location = router.state.location;

  useEffect(() => {
    // Basic case-insensitivity redirect
    if (location.pathname !== location.pathname.toLowerCase()) {
      router.navigate({
        to: location.pathname.toLowerCase() as any,
        replace: true,
      });
    }
  }, [location.pathname, router]);

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
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="rounded-pill bg-sd-green px-6 py-3 text-sm font-semibold text-sd-black hover:bg-sd-green-hover"
          >
            Try again
          </button>
          <a
            href="/"
            className="rounded-pill border-2 border-sd-green px-6 py-3 text-sm font-semibold text-sd-green hover:bg-sd-green hover:text-sd-black"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  loader: async () => {
    // Never let a slow/blocked external call (Google Places / Supabase) hang SSR.
    // A never-resolving fetch isn't caught by .catch — race it against a timeout.
    const withTimeout = <T,>(p: Promise<T>, ms: number, fallback: T): Promise<T> =>
      Promise.race([p, new Promise<T>((resolve) => setTimeout(() => resolve(fallback), ms))]);

    const [googleStats, reviewsData] = await Promise.all([
      withTimeout(
        fetchGooglePlaceStats().catch(() => ({ rating: 4.5, totalReviews: 166 })),
        2500,
        { rating: 4.5, totalReviews: 166 },
      ),
      withTimeout(
        getGoogleReviews().catch(() => ({ reviews: [] as any[] })),
        2500,
        { reviews: [] as any[] },
      ),
    ]);
    const googleReviews = ((reviewsData as any)?.reviews ?? [])
      .filter((r: any) => r?.text)
      .map((r: any) => ({
        author_name: r.author_name,
        rating: r.rating,
        text: r.text as string,
        relative_time_description: r.relative_time_description ?? "",
        author_photo_url: r.author_photo_url ?? undefined,
      }));
    return { googleStats, googleReviews };
  },
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Siding Depot — James Hardie Elite Contractor" },
      {
        name: "description",
        content:
          "Georgia's trusted James Hardie Elite Contractor. Siding, painting, windows, decks, gutters, roofing in Marietta & North Atlanta.",
      },
      { name: "author", content: "Siding Depot LLC" },
      { name: "google-site-verification", content: "Q3iqnEYQT-FjjpwrinYUm2LxJYgmuYrBgQDgPPcBiQ8" },
      { name: "theme-color", content: "#0A0A0A" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Siding Depot" },
      {
        property: "og:title",
        content: "Siding Depot — James Hardie Elite Contractor in Marietta GA",
      },
      {
        property: "og:description",
        content:
          "Georgia's trusted James Hardie Elite Contractor. Siding, painting, windows, decks, gutters, roofing in Marietta & North Atlanta.",
      },
      { name: "twitter:card", content: "summary_large_image" },
      // twitter:title/description intentionally omitted — X/Twitter falls back to each
      // page's og:title/og:description, keeping social cards page-specific.
      { property: "og:image", content: "https://www.sidingdepot.com/og-default.jpg" },
      { name: "twitter:image", content: "https://www.sidingdepot.com/og-default.jpg" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      // Preload hero — browser inicia download antes de parsear o body → LCP -1.5s
      {
        rel: "preload",
        as: "image",
        href: "/hero-home.webp",
        // @ts-ignore — React 19 needs camelCase; lowercase was dropped (no high priority)
        fetchPriority: "high",
        media: "(min-width: 641px)",
      },
      {
        rel: "preload",
        as: "image",
        href: "/hero-home-sm.webp",
        // @ts-ignore — React 19 needs camelCase; lowercase was dropped (no high priority)
        fetchPriority: "high",
        media: "(max-width: 640px)",
      },
      { rel: "icon", href: "/favicon.png?v=2", type: "image/png" },
      { rel: "shortcut icon", href: "/favicon.png?v=2" },
      { rel: "apple-touch-icon", href: "/favicon.png?v=2" },
    ],
    scripts: [
      // GA4 (only if env var present) — also loaded afterInteractive via useEffect
      // Organization / LocalBusiness schema
      { type: "application/ld+json", children: JSON.stringify(ORG_SCHEMA) },
      { type: "application/ld+json", children: JSON.stringify(LOCAL_BUSINESS_SCHEMA) },
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
  const { googleStats, googleReviews } = Route.useLoaderData();

  // ── afterInteractive: inject GTM + GA4 only after React hydration ──────────
  // Equivalent to Next.js <Script strategy="afterInteractive">
  // This keeps gtm.js out of the critical path and eliminates its TBT impact.
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Initialize dataLayer immediately (zero-byte, just array creation)
    const w = window as any;
    w.dataLayer = w.dataLayer || [];
    w.dataLayer.push({ "gtm.start": new Date().getTime(), event: "gtm.js" });

    // Inject gtm.js script tag (async — fires after hydration)
    const gtmScript = document.createElement("script");
    gtmScript.async = true;
    gtmScript.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
    document.head.appendChild(gtmScript);

    // Metricool tracker — deferred to afterInteractive (was render-blocking inline in <head>)
    const metricoolScript = document.createElement("script");
    metricoolScript.type = "text/javascript";
    metricoolScript.text = METRICOOL_TRACKER_SCRIPT;
    document.head.appendChild(metricoolScript);

    // Inject GA4 if configured
    if (GA4_ID) {
      w.dataLayer = w.dataLayer || [];
      function gtag(...args: any[]) {
        w.dataLayer.push(args);
      }
      w.gtag = gtag;
      gtag("js", new Date());
      gtag("config", GA4_ID);

      const ga4Script = document.createElement("script");
      ga4Script.async = true;
      ga4Script.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`;
      document.head.appendChild(ga4Script);
    }

    // Inject Meta Pixel if configured (set VITE_META_PIXEL_ID in Vercel env vars)
    if (META_PIXEL_ID) {
      w.fbq =
        w.fbq ||
        function (...args: any[]) {
          (w.fbq.q = w.fbq.q || []).push(args);
        };
      w.fbq.v = "2.0";
      w.fbq.loaded = true;
      w._fbq = w._fbq || w.fbq;

      w.fbq("init", META_PIXEL_ID);
      w.fbq("track", "PageView");

      const pixelScript = document.createElement("script");
      pixelScript.async = true;
      pixelScript.src = "https://connect.facebook.net/en_US/fbevents.js";
      document.head.appendChild(pixelScript);

      // noscript fallback
      const noscript = document.createElement("noscript");
      const img = document.createElement("img");
      img.height = 1;
      img.width = 1;
      img.style.display = "none";
      img.src = `https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`;
      noscript.appendChild(img);
      document.body.appendChild(noscript);
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <GoogleStatsContext.Provider value={googleStats}>
        <GoogleReviewsContext.Provider value={googleReviews}>
          {/* aggregateRating — merged into LocalBusiness by matching @id.
              Matches the headline rating shown on-page (ProofBar): combined
              4.7 / 550 reviews across Google, GuildQuality, Thumbtack, Houzz & Angi.
              Kept in sync with ProofBar so schema never contradicts visible content. */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": ["HomeAndConstructionBusiness", "GeneralContractor"],
                "@id": LOCAL_BUSINESS_ID,
                aggregateRating: {
                  "@type": "AggregateRating",
                  ratingValue: 4.7,
                  reviewCount: 550,
                  bestRating: 5,
                  worstRating: 1,
                },
              }),
            }}
          />
          <div className="flex min-h-screen flex-col bg-background overflow-x-clip">
            <Navbar />
            <main className="flex-1">
              <Outlet />
            </main>
            <Footer />
            <FloatingCTA />
            <AnalyticsTracker />
            <GhlChatWidget />
          </div>
        </GoogleReviewsContext.Provider>
      </GoogleStatsContext.Provider>
    </QueryClientProvider>
  );
}
