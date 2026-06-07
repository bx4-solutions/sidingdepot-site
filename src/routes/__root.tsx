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
import { VisualEditToggle } from "@/components/VisualEditToggle";
import { SITE } from "@/data/site";
import { ORG_SCHEMA, LOCAL_BUSINESS_SCHEMA } from "@/lib/schema";
import { fetchGooglePlaceStats } from "@/lib/place-stats.server";
import { GoogleStatsContext } from "@/lib/google-stats-context";

const GTM_ID = "GTM-TFGQWCQN";
const GA4_ID = import.meta.env.VITE_GA4_ID as string | undefined;

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
  // Fetch Google stats ONCE for the entire app — all pages share the same live count
  loader: async () => {
    try {
      const stats = await fetchGooglePlaceStats();
      return { googleStats: stats };
    } catch {
      return { googleStats: { rating: 4.4, totalReviews: 162 } };
    }
  },
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Siding Depot — James Hardie Elite Preferred Contractor" },
      {
        name: "description",
        content:
          "Georgia's trusted James Hardie Elite Preferred contractor. Siding, painting, windows, decks, gutters, roofing in Greater Marietta & North Atlanta.",
      },
      { name: "author", content: "Siding Depot LLC" },
      { name: "google-site-verification", content: "Q3iqnEYQT-FjjpwrinYUm2LxJYgmuYrBgQDgPPcBiQ8" },
      { name: "theme-color", content: "#0A0A0A" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Siding Depot" },
      {
        property: "og:title",
        content: "Siding Depot — James Hardie Elite Preferred Contractor in Greater Marietta GA",
      },
      {
        property: "og:description",
        content:
          "Georgia's trusted James Hardie Elite Preferred contractor. Siding, painting, windows, decks, gutters, roofing in Greater Marietta & North Atlanta.",
      },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:title",
        content: "Siding Depot — James Hardie Elite Preferred Contractor in Greater Marietta GA",
      },
      {
        name: "twitter:description",
        content:
          "Georgia's trusted James Hardie Elite Preferred contractor. Siding, painting, windows, decks, gutters, roofing in Greater Marietta & North Atlanta.",
      },
      { property: "og:image", content: "https://sidingdepot.com/og-default.webp" },
      { name: "twitter:image", content: "https://sidingdepot.com/og-default.webp" },
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
      // GHL Chat Widget — tracks source page automatically via window.location
      {
        children: `
          window.hl_chat_widget_page_source = window.location.href;
          // Force GHL widget to bottom-right
          function fixGHLPosition() {
            var selectors = ['#chat-widget-container','[id^="chat-widget"]','.hl-chat-widget','[data-widget-id]','#leadconnector-chat-widget'];
            selectors.forEach(function(sel) {
              var el = document.querySelector(sel);
              if (el) {
                el.style.cssText += 'position:fixed!important;bottom:20px!important;right:20px!important;top:auto!important;left:auto!important;z-index:9999!important;';
              }
            });
          }
          setTimeout(fixGHLPosition, 2000);
          setTimeout(fixGHLPosition, 5000);
          window.addEventListener('message', function(e) {
            if (e.data && e.data.type === 'hl-chat-form-submitted') {
              if (typeof gtag === 'function') {
                gtag('event', 'ghl_chat_lead', {
                  event_category: 'Lead',
                  event_label: window.location.pathname,
                  page_source: window.location.href
                });
              }
              if (window.dataLayer) {
                window.dataLayer.push({
                  event: 'ghl_chat_lead',
                  page_source: window.location.href,
                  page_path: window.location.pathname
                });
              }
            }
          });
        `,
      },
      {
        src: "https://beta.leadconnectorhq.com/loader.js",
        async: true,
        "data-resources-url": "https://beta.leadconnectorhq.com/chat-widget/loader.js",
        "data-widget-id": "6a05e7c2f127bb4126a40721",
      },
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
  const { googleStats } = Route.useLoaderData();
  const isDev =
    import.meta.env.DEV ||
    (typeof window !== "undefined" &&
      (window.location.hostname === "localhost" ||
        window.location.hostname.includes("lovableproject.com")));

  return (
    <QueryClientProvider client={queryClient}>
      <GoogleStatsContext.Provider value={googleStats}>
        <div className="flex min-h-screen flex-col bg-background overflow-x-clip">
          <Navbar />
          <main className="flex-1">
            <Outlet />
          </main>
          <Footer />
          <FloatingCTA />
          {isDev && <VisualEditToggle />}
        </div>
      </GoogleStatsContext.Provider>
    </QueryClientProvider>
  );
}
