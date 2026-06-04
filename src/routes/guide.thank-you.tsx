import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { ArrowRight, CheckCircle2, Download, Phone } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { SITE, SERVICES } from "@/data/site";
import { track } from "@/lib/track";

const PDF_PATH = "/downloads/5-mistakes-siding-georgia.pdf";

const searchSchema = z.object({
  city: z.string().optional(),
  src: z.string().optional(),
});

export const Route = createFileRoute("/guide/thank-you")({
  validateSearch: (s) => searchSchema.parse(s),
  head: () => ({
    meta: [
      { title: "Your Siding Guide Is Ready! Download Below — Siding Depot" },
      {
        name: "description",
        content:
          "Your free guide to avoiding siding mistakes in Georgia is ready. Download it now and learn how to protect your home's exterior and your budget.",
      },
      { property: "og:title", content: "Your Siding Guide Is Ready! Download Now" },
      { property: "og:description", content: "Grab your free 8-page siding guide and learn the 5 mistakes to avoid." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/43cab0b0-cb06-42f1-a067-d5f0523e2835" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Your Siding Guide Is Ready! Download Now" },
      { name: "twitter:description", content: "Grab your free 8-page siding guide and learn the 5 mistakes to avoid." },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/43cab0b0-cb06-42f1-a067-d5f0523e2835" },
      // Block this page from search results — it's a post-conversion thank-you.
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: ThankYouPage,
});

/**
 * Smart service CTAs: every card maps to a top-level route so a click takes
 * the user directly to the service they self-identified with — no extra hop.
 * Slugs match existing routes: /siding, /painting, /windows, /decks, /gutters,
 * /roofing, /dumpster.
 */
const SERVICE_ROUTE_BY_SLUG: Record<string, string> = {
  siding: "/siding",
  painting: "/painting",
  windows: "/windows",
  decks: "/decks",
  gutters: "/gutters",
  roofing: "/roofing",
  dumpster: "/dumpster",
};

const NEED_PROMPT_BY_SLUG: Record<string, string> = {
  siding: "My siding is faded, cracked, or rotting",
  painting: "I want a fresh exterior color & long-lasting finish",
  windows: "My energy bills are too high",
  decks: "I want to add or rebuild outdoor living space",
  gutters: "Water is overflowing or pooling near the foundation",
  roofing: "I see missing shingles or interior leaks",
  dumpster: "I need a roll-off for a remodel or clean-out",
};

function ThankYouPage() {
  const { city, src } = Route.useSearch();

  return (
    <>
      <Navbar />
      <main className="bg-sd-gray-bg">
        {/* Confirmation hero */}
        <section className="bg-sd-navy text-white">
          <div className="mx-auto max-w-4xl px-4 py-14 text-center lg:px-8 lg:py-20">
            <CheckCircle2 className="mx-auto h-14 w-14 text-sd-green" />
            <h1 className="mt-5 font-display text-4xl leading-tight sm:text-5xl">
              Your guide is on the way!
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-white/75">
              Check your inbox in the next few minutes. Didn&rsquo;t see the new tab?
              Grab the PDF directly below.
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <a
                href={PDF_PATH}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  track("lead_magnet_pdf_open", {
                    source: src ?? "thank_you",
                    city,
                    pdf_path: PDF_PATH,
                    location: "thank_you_hero",
                  })
                }
                className="inline-flex h-12 items-center gap-2 rounded-pill bg-sd-green px-6 text-sm font-bold text-sd-navy hover:opacity-90"
              >
                <Download className="h-4 w-4" /> Download the PDF
              </a>
              <a
                href={SITE.phoneHref}
                onClick={() =>
                  track("guide_phone_click", { source: src ?? "thank_you", city })
                }
                className="inline-flex h-12 items-center gap-2 rounded-pill bg-white/10 px-6 text-sm font-bold text-white ring-1 ring-white/25 hover:bg-white/15"
              >
                <Phone className="h-4 w-4" /> {SITE.phone}
              </a>
            </div>
          </div>
        </section>

        {/* Smart service CTAs */}
        <section className="py-14 lg:py-20">
          <div className="mx-auto max-w-6xl px-4 lg:px-8">
            <div className="text-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-sd-green">
                What does your home need next?
              </span>
              <h2 className="mt-3 font-display text-3xl text-sd-navy sm:text-4xl">
                Pick what fits — go straight to the right service
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-sm text-sd-gray-text">
                Tap the option that sounds most like you. We&rsquo;ll take you to
                the dedicated page with photos, pricing guidance and a quote form.
              </p>
            </div>

            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {SERVICES.map((s) => {
                const to = SERVICE_ROUTE_BY_SLUG[s.slug];
                const prompt = NEED_PROMPT_BY_SLUG[s.slug] ?? s.short;
                if (!to) return null;
                return (
                  <Link
                    key={s.slug}
                    to={to}
                    onClick={() =>
                      track("guide_service_cta_click", {
                        source: src ?? "thank_you",
                        city,
                        service: s.slug,
                        destination: to,
                      })
                    }
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-sd-gray-border bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-sd-gray-bg">
                      <picture>
                        {s.image.avif && <source srcSet={s.image.avif} type="image/avif" />}
                        {s.image.webp && <source srcSet={s.image.webp} type="image/webp" />}
                        <img
                          src={s.image.src}
                          alt={s.title}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </picture>
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <div className="flex items-center gap-2">
                        <s.Icon className="h-4 w-4 text-sd-green" />
                        <span className="text-[11px] font-bold uppercase tracking-wider text-sd-gray-text">
                          {s.title}
                        </span>
                      </div>
                      <p className="mt-3 text-base font-semibold text-sd-navy leading-snug">
                        &ldquo;{prompt}&rdquo;
                      </p>
                      <p className="mt-2 text-sm text-sd-gray-text">{s.short}</p>
                      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-sd-green">
                        See this service <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
