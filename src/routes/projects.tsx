import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import {
  PROJECTS_SORTED,
  SERVICE_OPTIONS,
  formatProjectDate,
  type ProjectTag,
  type Project,
} from "@/data/site";
import { ProjectModal } from "@/components/site/ProjectModal";

const FILTERS: ReadonlyArray<"All" | ProjectTag> = ["All", ...SERVICE_OPTIONS];

const PAGE_SIZE = 6;

type Search = { page: number; tag: "All" | ProjectTag };

export const Route = createFileRoute("/projects")({
  validateSearch: (raw: Record<string, unknown>): Search => {
    const pageNum = Number(raw.page);
    const page = Number.isFinite(pageNum) && pageNum >= 1 ? Math.floor(pageNum) : 1;
    const tag =
      typeof raw.tag === "string" && (FILTERS as readonly string[]).includes(raw.tag)
        ? (raw.tag as Search["tag"])
        : "All";
    return { page, tag };
  },
  head: () => ({
    meta: [
      { title: "Project Gallery — Siding Depot | North Atlanta Renovations" },
      {
        name: "description",
        content:
          "Explore real exterior renovation, siding, painting and window projects we have delivered for homeowners across Greater Atlanta, GA.",
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

function ProjectsPage() {
  const { page, tag } = Route.useSearch();
  const filtered = useMemo<ReadonlyArray<Project>>(
    () =>
      tag === "All"
        ? PROJECTS_SORTED
        : PROJECTS_SORTED.filter((p) => p.tags.includes(tag as ProjectTag)),
    [tag],
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const items = filtered.slice(start, start + PAGE_SIZE);

  const [modalIdx, setModalIdx] = useState<number | null>(null);
  const modalProject = modalIdx != null ? filtered[modalIdx] : null;

  return (
    <section className="bg-sd-gray-bg py-hero lg:py-hero-lg min-h-screen">
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
            <Link
              key={f}
              to={Route.fullPath}
              search={{ tag: f, page: 1 }}
              aria-pressed={tag === f}
              className={`rounded-pill px-4 py-2 text-xs font-semibold tracking-wide uppercase transition-colors border ${
                tag === f
                  ? "bg-sd-navy text-white border-sd-navy"
                  : "bg-white text-sd-gray-text border-sd-gray-border hover:border-sd-green hover:text-sd-black"
              }`}
            >
              {f}
            </Link>
          ))}
        </div>

        {/* Result count */}
        <p className="mt-6 text-center text-xs uppercase tracking-[0.14em] text-sd-gray-text">
          Showing {start + 1}–{Math.min(start + PAGE_SIZE, filtered.length)} of {filtered.length}
        </p>

        {/* Cards */}
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p, i) => {
            const globalIdx = start + i;
            return (
              <button
                key={p.slug}
                type="button"
                onClick={() => setModalIdx(globalIdx)}
                className="group relative overflow-hidden rounded-xl aspect-[4/5] bg-sd-navy shadow-sm hover:shadow-2xl transition-shadow text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-sd-green focus-visible:ring-offset-2"
                aria-label={`Open ${p.title ?? p.alt}`}
              >
                <img
                  src={p.src}
                  alt={p.alt}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-sd-black/40 via-sd-black/20 to-sd-black/85" />

                <div className="absolute inset-x-0 top-0 p-6 lg:p-7">
                  <h2 className="font-display text-2xl sm:text-[28px] leading-[1.05] text-white drop-shadow-md">
                    {p.title ?? p.alt}
                  </h2>
                  {p.date && (
                    <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-white/85">
                      {formatProjectDate(p.date)}
                    </p>
                  )}
                </div>

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
              </button>
            );
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <nav
            aria-label="Pagination"
            className="mt-12 flex items-center justify-center gap-1.5"
          >
            <Link
              to={Route.fullPath}
              search={{ tag, page: Math.max(1, safePage - 1) }}
              aria-disabled={safePage === 1}
              className={`inline-flex items-center justify-center h-10 w-10 rounded-pill border text-sm transition-colors ${
                safePage === 1
                  ? "border-sd-gray-border text-sd-gray-text/50 pointer-events-none"
                  : "border-sd-gray-border bg-white text-sd-black hover:border-sd-green"
              }`}
            >
              <ChevronLeft className="h-4 w-4" />
            </Link>

            {Array.from({ length: totalPages }).map((_, i) => {
              const n = i + 1;
              const isActive = n === safePage;
              return (
                <Link
                  key={n}
                  to={Route.fullPath}
                  search={{ tag, page: n }}
                  aria-current={isActive ? "page" : undefined}
                  className={`inline-flex items-center justify-center h-10 min-w-10 px-3 rounded-pill border text-sm font-semibold transition-colors ${
                    isActive
                      ? "bg-sd-navy text-white border-sd-navy"
                      : "border-sd-gray-border bg-white text-sd-black hover:border-sd-green"
                  }`}
                >
                  {n}
                </Link>
              );
            })}

            <Link
              to={Route.fullPath}
              search={{ tag, page: Math.min(totalPages, safePage + 1) }}
              aria-disabled={safePage === totalPages}
              className={`inline-flex items-center justify-center h-10 w-10 rounded-pill border text-sm transition-colors ${
                safePage === totalPages
                  ? "border-sd-gray-border text-sd-gray-text/50 pointer-events-none"
                  : "border-sd-gray-border bg-white text-sd-black hover:border-sd-green"
              }`}
            >
              <ChevronRight className="h-4 w-4" />
            </Link>
          </nav>
        )}

        {/* CTA */}
        <div className="mt-16 text-center">
          <p className="text-sd-gray-text mb-4">Ready to start your own transformation?</p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-pill bg-sd-green px-6 py-3 text-sm font-bold uppercase tracking-wide text-sd-black hover:bg-sd-green/90 transition-colors"
          >
            Get Your Free Quote <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <ProjectModal
        project={modalProject}
        onClose={() => setModalIdx(null)}
        onPrev={() => setModalIdx((i) => (i != null && i > 0 ? i - 1 : i))}
        onNext={() =>
          setModalIdx((i) => (i != null && i < filtered.length - 1 ? i + 1 : i))
        }
        hasPrev={modalIdx != null && modalIdx > 0}
        hasNext={modalIdx != null && modalIdx < filtered.length - 1}
      />
    </section>
  );
}
