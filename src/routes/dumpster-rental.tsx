import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Phone, Truck } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { HeroQuoteForm } from "@/components/site/HeroQuoteForm";
import { SITE } from "@/data/site";
import { track } from "@/lib/track";
import { getServiceSchema } from "@/lib/schema";


const HERO_IMAGE =
  "https://assets.cdn.filesafe.space/VPwAmJKkB62wR0BJhYil/media/68cb2a4e8c4437153cdbaa3b.jpeg";

export const Route = createFileRoute("/dumpster-rental")({
  head: () => ({
    meta: [
      { title: "Dumpster Rental in Marietta, GA — Reserve Your Roll-Off | Siding Depot" },
      {
        name: "description",
        content:
          "Reserve a 10, 15 or 20-yard dumpster in Marietta, Greater Marietta, Alpharetta and across North Atlanta. Same-day / next-day drop-off, transparent pricing, no hidden fees.",
      },
      { property: "og:title", content: "Reserve Your Dumpster — North Atlanta" },
      {
        property: "og:description",
        content:
          "Same-day / next-day delivery. 10, 15, 20 yd. Licensed & insured. Reserve in 60 seconds.",
      },
      { property: "og:image", content: HERO_IMAGE },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Reserve Your Dumpster — North Atlanta" },
      { name: "twitter:description", content: "Same-day / next-day delivery. 10, 15, 20 yd. Licensed & insured. Reserve in 60 seconds." },
      { name: "twitter:image", content: HERO_IMAGE },
    ],
    links: [{ rel: "canonical", href: "https://sidingdepot.lovable.app/dumpster-rental" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(
          getServiceSchema(
            "Dumpster Rental in Marietta, GA",
            "Reserve a 10, 15 or 20-yard dumpster in Marietta, Greater Marietta, Alpharetta and across North Atlanta. Same-day / next-day drop-off, transparent pricing, no hidden fees.",
            "/dumpster-rental",
            HERO_IMAGE
          )
        ),
      },
    ],
  }),
  component: DumpsterRentalPage,
});

const DUMPSTER_SIZES = [
  { size: "10 yd", use: "Garage clean-outs, small remodels, single room" },
  { size: "15 yd", use: "Kitchen / bath remodels, roofing tear-offs" },
  { size: "20 yd", use: "Whole-home renovations, siding replacement" },
] as const;

function DumpsterRentalPage() {
  return (
    <>
      <Navbar />
      <main className="bg-sd-gray-bg">
        {/* Hero */}
        <section className="relative isolate overflow-hidden">
          <img
            src={HERO_IMAGE}
            alt="Bright green Siding Depot dumpsters lined up ready for delivery"
            loading="eager"
            decoding="async"
            className="absolute inset-0 -z-10 h-full w-full object-cover"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-sd-navy/80 via-sd-navy/45 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 -z-10 h-24 bg-gradient-to-t from-sd-navy/60 to-transparent" />
          <div className="mx-auto max-w-6xl px-4 py-16 text-white lg:px-8 lg:py-24">
            <span className="inline-flex items-center gap-2 rounded-pill bg-sd-green/20 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-sd-green ring-1 ring-sd-green/40">
              <Truck className="h-3.5 w-3.5" /> Dumpster Rental · North Atlanta
            </span>
            <h1 className="mt-5 max-w-3xl font-display text-4xl leading-tight sm:text-5xl">
              Reserve a roll-off dumpster &mdash; same-day or next-day delivery.
            </h1>
            <p className="mt-4 max-w-2xl text-base text-white/80">
              10, 15 and 20-yard dumpsters dropped where you need them. Transparent
              pricing, no surprise fees, and a real human answering your calls.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href={SITE.phoneHref}
                onClick={() => track("dumpster_rental_phone_click", {})}
                className="inline-flex h-12 items-center gap-2 rounded-pill bg-sd-green px-6 text-sm font-bold text-sd-navy hover:opacity-90"
              >
                <Phone className="h-4 w-4" /> {SITE.phone}
              </a>
              <a
                href="#reserve"
                className="inline-flex h-12 items-center gap-2 rounded-pill bg-white/10 px-6 text-sm font-bold text-white ring-1 ring-white/25 hover:bg-white/15"
              >
                Reserve online
              </a>
            </div>
          </div>
        </section>

        {/* Body grid */}
        <section id="reserve" className="py-14 lg:py-20">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 lg:grid-cols-[1fr_1.15fr] lg:px-8">
            {/* Left: pitch */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-sd-green">
                Service
              </span>
              <h2 className="mt-2 font-display text-3xl text-sd-navy sm:text-4xl">
                Dumpster Rentals
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-sd-gray-text">
                Whether you&rsquo;re tackling a home renovation, cleaning out the garage
                or managing debris from a construction project, our roll-offs make waste
                removal simple. Each rental includes convenient delivery, on-time pickup
                and responsible disposal.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-sd-gray-text">
                Flexible scheduling, competitive rates, and the same crew that handles
                James Hardie installs across North Atlanta &mdash; you keep the project
                on track and the property clean.
              </p>

              <div className="mt-8 rounded-2xl border border-sd-gray-border bg-white p-5 shadow-sm">
                <h3 className="text-sm font-bold uppercase tracking-wider text-sd-navy">
                  Pick the right size
                </h3>
                <ul className="mt-3 space-y-3">
                  {DUMPSTER_SIZES.map((d) => (
                    <li key={d.size} className="flex items-start gap-3 text-sm">
                      <span className="mt-0.5 inline-flex h-7 min-w-[3.25rem] items-center justify-center rounded-md bg-sd-green/15 px-2 font-bold text-sd-navy">
                        {d.size}
                      </span>
                      <span className="text-sd-gray-text">{d.use}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <ul className="mt-6 space-y-2 text-sm text-sd-gray-text">
                {[
                  "Same-day or next-day delivery in Marietta, Greater Marietta, Alpharetta",
                  "Driveway-safe drop with plywood protection on request",
                  "7-day standard rental, early pickup available",
                  "Licensed & insured Georgia GC #RBQA006789",
                ].map((b) => (
                  <li key={b} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-sd-green" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: standardized lead form */}
            <div className="flex items-start justify-center">
              <HeroQuoteForm source="dumpster_rental_lp" tag="dumpster_reservation" />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
