import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { z } from "zod";
import { ArrowRight, FileText, ShieldCheck } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { LeadMagnet } from "@/components/site/LeadMagnet";
import { track } from "@/lib/track";

const PDF_PATH = "/downloads/5-mistakes-siding-georgia.pdf";

const guideSearchSchema = z.object({
  city: z.string().optional(),
  src: z.string().optional(),
});

export const Route = createFileRoute("/guide")({
  validateSearch: (s) => guideSearchSchema.parse(s),
  head: () => ({
    meta: [
      { title: "Free Guide: 5 Mistakes to Avoid When Replacing Siding in Georgia" },
      {
        name: "description",
        content:
          "Download the free 4-page homeowner guide before signing any siding contract in Georgia. Spot the 5 most common contract traps and bring our 8-question checklist to every estimate.",
      },
      { property: "og:title", content: "Free Guide — 5 Siding Mistakes to Avoid in Georgia" },
      {
        property: "og:description",
        content:
          "4-page PDF + 8-question checklist. Sent instantly to your inbox, no spam.",
      },
    ],
  }),
  component: GuidePage,
});

function GuidePage() {
  const navigate = useNavigate();
  const { city, src } = useSearch({ from: "/guide" });

  return (
    <>
      <Navbar />
      <main className="bg-sd-gray-bg">
        {/* Hero */}
        <section className="bg-sd-navy text-white">
          <div className="mx-auto max-w-6xl px-4 py-14 lg:px-8 lg:py-20">
            <span className="inline-flex items-center gap-2 rounded-pill bg-sd-green/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-sd-green ring-1 ring-sd-green/40">
              <FileText className="h-3.5 w-3.5" /> Free Homeowner Guide
            </span>
            <h1 className="mt-5 max-w-3xl font-display text-4xl leading-tight sm:text-5xl">
              5 Mistakes You Can&rsquo;t Afford to Make When Replacing Siding in Georgia
            </h1>
            <p className="mt-4 max-w-2xl text-base text-white/75">
              Preview the full 4-page guide below. Drop your email and we&rsquo;ll send the PDF
              straight to your inbox &mdash; plus an 8-question checklist to bring to every
              estimate.
            </p>
            <p className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-wider text-white/55">
              <ShieldCheck className="h-3.5 w-3.5" /> No spam &middot; Unsubscribe anytime
            </p>
          </div>
        </section>

        {/* PDF preview + form */}
        <section className="py-12 lg:py-16">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 lg:grid-cols-[1.2fr_1fr] lg:px-8">
            {/* PDF preview card — visual mock of the cover page. Avoids the
                Chrome inline-PDF iframe blocker that shows "Esta página foi
                bloqueada pelo Chrome". The real PDF opens in a new tab. */}
            <div className="overflow-hidden rounded-2xl border border-sd-gray-border bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-sd-gray-border bg-sd-gray-bg/60 px-4 py-2.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-sd-gray-text">
                  Preview &middot; 4 pages &middot; PDF
                </span>
                <a
                  href={PDF_PATH}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    track("lead_magnet_pdf_preview_open", {
                      source: src ?? "guide_page",
                      city,
                      pdf_path: PDF_PATH,
                    })
                  }
                  className="text-[11px] font-semibold uppercase tracking-wider text-sd-navy hover:text-sd-green"
                >
                  Open in new tab
                </a>
              </div>

              {/* Mocked cover */}
              <a
                href={PDF_PATH}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  track("lead_magnet_pdf_preview_open", {
                    source: src ?? "guide_page",
                    city,
                    pdf_path: PDF_PATH,
                    location: "preview_card",
                  })
                }
                className="group relative block bg-sd-navy"
              >
                <div className="relative mx-auto max-w-md px-8 py-12 text-white">
                  <span className="inline-flex items-center gap-2 rounded-pill bg-sd-green/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-sd-green ring-1 ring-sd-green/40">
                    <FileText className="h-3 w-3" /> Homeowner Guide
                  </span>
                  <h3 className="mt-5 font-display text-2xl leading-tight sm:text-3xl">
                    5 Mistakes You Can&rsquo;t Afford to Make When Replacing Siding in Georgia
                  </h3>
                  <p className="mt-3 text-xs leading-relaxed text-white/70">
                    A 4-page contract-trap checklist for North Atlanta homeowners
                    &mdash; including the 8 questions to ask every estimator.
                  </p>

                  <div className="mt-8 space-y-2">
                    {[
                      "Reading a siding quote line by line",
                      "James Hardie certifications to verify",
                      "8 questions that filter pros from amateurs",
                      "Red-flag clauses hidden in standard contracts",
                    ].map((b, i) => (
                      <div key={b} className="flex items-start gap-2 text-[12px] text-white/80">
                        <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-sm bg-sd-green/20 text-[10px] font-bold text-sd-green">
                          {i + 1}
                        </span>
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-10 flex items-center justify-between border-t border-white/15 pt-4 text-[10px] uppercase tracking-wider text-white/45">
                    <span>Siding Depot &middot; Marietta, GA</span>
                    <span>Page 1 / 4</span>
                  </div>
                </div>

                {/* Hover affordance */}
                <div className="absolute inset-0 flex items-center justify-center bg-sd-navy/0 transition-colors duration-200 group-hover:bg-sd-navy/40">
                  <span className="opacity-0 transition-opacity duration-200 group-hover:opacity-100 inline-flex items-center gap-2 rounded-pill bg-sd-green px-5 py-2.5 text-xs font-bold text-sd-navy shadow-lg">
                    <FileText className="h-3.5 w-3.5" /> Open the full PDF
                  </span>
                </div>
              </a>
            </div>

            {/* Form */}
            <div>
              <LeadMagnet
                city={city}
                source={src ?? "guide_page"}
                onSuccess={() => {
                  // Open PDF in a new tab AND route the user to a curated
                  // "thank you" page with smart service CTAs.
                  if (typeof window !== "undefined") {
                    window.open(PDF_PATH, "_blank", "noopener,noreferrer");
                  }
                  navigate({
                    to: "/guide/thank-you",
                    search: { city, src: src ?? "guide_page" },
                  });
                }}
              />
            </div>
          </div>
        </section>

        {/* Inline secondary CTA */}
        <section className="pb-16 lg:pb-20">
          <div className="mx-auto flex max-w-4xl flex-col items-center gap-3 rounded-2xl border border-sd-gray-border bg-white px-6 py-8 text-center shadow-sm lg:flex-row lg:justify-between lg:text-left">
            <div>
              <h2 className="font-display text-xl text-sd-navy">Already know what you need?</h2>
              <p className="mt-1 text-sm text-sd-gray-text">
                Skip the guide and request your free, no-pressure estimate today.
              </p>
            </div>
            <a
              href="#contact"
              onClick={() => track("guide_cta_estimate_click", { source: src ?? "guide_page", city })}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-pill bg-sd-green px-6 text-sm font-bold text-sd-navy hover:opacity-90"
            >
              Get my free estimate <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
