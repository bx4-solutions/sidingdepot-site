import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { PROJECTS, type ProjectTag } from "@/data/site";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Project Gallery — Siding Depot | North Atlanta Renovations" },
      {
        name: "description",
        content:
          "Explore real home exterior renovation, siding, painting and window projects we have delivered for homeowners across Greater Atlanta, GA.",
      },
      { property: "og:title", content: "Project Gallery — Siding Depot" },
      {
        property: "og:description",
        content:
          "Real homes across Metro Atlanta — siding, painting, windows and full exterior renovations.",
      },
    ],
  }),
  component: ProjectsPage,
});

const FILTERS: ReadonlyArray<"All" | ProjectTag> = [
  "All",
  "Siding",
  "Painting",
  "Roofing",
  "Windows",
  "Decks",
  "Gutters",
];

function ProjectsPage() {
  const [active, setActive] = useState<(typeof FILTERS)[number]>("All");

  const items = useMemo(
    () =>
      active === "All"
        ? PROJECTS
        : PROJECTS.filter((p) => p.tags.includes(active as ProjectTag)),
    [active],
  );

  return (
    <section className="bg-sd-gray-bg py-20 lg:py-28 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-sd-black leading-tight">
            Project Gallery
          </h1>
          <p className="mt-5 text-base sm:text-lg text-sd-gray-text leading-relaxed">
            Explore a selection of home exterior renovation and siding installation projects
            we have delivered for homeowners across Greater Atlanta, GA.
          </p>
        </div>

        {/* Filters */}
        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              aria-pressed={active === f}
              onClick={() => setActive(f)}
              className={`rounded-pill px-4 py-2 text-xs font-semibold tracking-wide uppercase transition-colors border ${
                active === f
                  ? "bg-sd-navy text-white border-sd-navy"
                  : "bg-white text-sd-gray-text border-sd-gray-border hover:border-sd-green hover:text-sd-black"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Cards */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => (
            <article
              key={p.src}
              className="group relative overflow-hidden rounded-xl aspect-[4/5] bg-sd-navy shadow-sm hover:shadow-2xl transition-shadow"
            >
              <img
                src={p.src}
                alt={p.alt}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Dark gradient overlay for legibility */}
              <div className="absolute inset-0 bg-gradient-to-b from-sd-black/40 via-sd-black/20 to-sd-black/85" />

              {/* Top: title + date */}
              <div className="absolute inset-x-0 top-0 p-6 lg:p-7">
                <h2 className="font-display text-2xl sm:text-[28px] leading-[1.05] text-white drop-shadow-md">
                  {p.title ?? p.alt}
                </h2>
                {p.date && (
                  <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-white/85">
                    {p.date}
                  </p>
                )}
              </div>

              {/* Bottom: divider + category */}
              <div className="absolute inset-x-0 bottom-0 p-6 lg:p-7">
                <div className="h-px w-full bg-white/30 mb-4" />
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold text-white">
                    {p.category ?? p.tags[0]}
                  </span>
                  <span
                    aria-hidden
                    className="inline-flex items-center justify-center h-8 w-8 rounded-full border border-white/40 text-white transition-colors group-hover:bg-sd-green group-hover:border-sd-green group-hover:text-sd-black"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <p className="text-sd-gray-text mb-4">
            Ready to start your own transformation?
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-pill bg-sd-green px-6 py-3 text-sm font-bold uppercase tracking-wide text-sd-black hover:bg-sd-green/90 transition-colors"
          >
            Get Your Free Quote <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
