import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Calendar, MapPin, Tag, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PROJECTS_SORTED, formatProjectDate, SITE } from "@/data/site";
import { getProjectSchema } from "@/lib/schema";


export const Route = createFileRoute("/projects/$slug")({
  loader: ({ params }) => {
    const idx = PROJECTS_SORTED.findIndex((p) => p.slug === params.slug);
    if (idx === -1) throw notFound();
    return {
      project: PROJECTS_SORTED[idx],
      prev: idx > 0 ? PROJECTS_SORTED[idx - 1] : null,
      next: idx < PROJECTS_SORTED.length - 1 ? PROJECTS_SORTED[idx + 1] : null,
    };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.project;
    if (!p) {
      return { meta: [{ title: "Project Not Found — Siding Depot" }] };
    }
    const title = `${p.title ?? p.alt} | Siding Depot`;
    const description =
      p.description ??
      `${p.category ?? "Exterior renovation"} project completed by Siding Depot${p.city ? ` in ${p.city}` : ""}.`;
    const absoluteImage = p.src.startsWith("http") ? p.src : `https://www.sidingdepot.com${p.src}`;

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:image", content: absoluteImage },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: absoluteImage },
      ],
      links: [
        { rel: "canonical", href: `https://www.sidingdepot.com/projects/${p.slug}` },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="font-display text-4xl text-sd-black">Project not found</h1>
      <p className="mt-3 text-sd-gray-text">The project you’re looking for doesn’t exist.</p>
      <Button asChild className="mt-6">
        <Link to="/projects" search={{ tag: "All", page: 1 }}>
          Back to Project Gallery
        </Link>
      </Button>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="min-h-[60vh] flex items-center justify-center px-4 text-center">
      <p className="text-sd-gray-text">Something went wrong: {error.message}</p>
    </div>
  ),
  component: ProjectDetailPage,
});

function ProjectDetailPage() {
  const { project: p, prev, next } = Route.useLoaderData();

  const jsonLd = getProjectSchema(p);

  return (
    <article className="bg-background">
      {/* Hero */}
      <header className="bg-sd-navy text-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 py-10 lg:py-14">
          <Link
            to="/projects"
            search={{ tag: "All", page: 1 }}
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-white/70 hover:text-sd-green transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to gallery
          </Link>

          <div className="mt-6 flex flex-wrap gap-1.5">
            {p.tags.map((t: string) => (
              <span
                key={t}
                className="rounded-pill bg-sd-green px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-sd-black"
              >
                {t}
              </span>
            ))}
          </div>

          <h1 className="mt-4 font-display text-3xl sm:text-4xl lg:text-5xl leading-tight max-w-4xl">
            {p.title ?? p.alt}
          </h1>

          <dl className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/85">
            {p.city && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-sd-green" />
                <span>{p.city}</span>
              </div>
            )}
            {p.date && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-sd-green" />
                <time dateTime={p.date}>{formatProjectDate(p.date)}</time>
              </div>
            )}
            {p.category && (
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-sd-green" />
                <span>{p.category}</span>
              </div>
            )}
          </dl>
        </div>
      </header>

      {/* Image */}
      <div className="mx-auto max-w-7xl px-4 lg:px-8 -mt-2 lg:-mt-4">
        <div className="rounded-xl overflow-hidden shadow-2xl bg-sd-gray-bg aspect-[16/10]">
          <img
            src={p.src}
            alt={p.alt}
            className="h-full w-full object-cover"
            loading="eager"
          />
        </div>
      </div>

      {/* Body + CTA */}
      <div className="mx-auto max-w-4xl px-4 lg:px-8 py-hero-compact lg:py-hero-compact-lg">
        {p.description && (
          <p className="text-lg text-sd-gray-text leading-relaxed">{p.description}</p>
        )}

        <div className="mt-10 rounded-xl bg-sd-gray-bg border border-sd-gray-border p-6 sm:p-8 text-center">
          <h2 className="font-display text-2xl sm:text-3xl text-sd-black">
            Want a transformation like this?
          </h2>
          <p className="mt-2 text-sd-gray-text">
            Free written estimate within 24 hours. No pressure.
          </p>
          <div className="mt-5 flex flex-wrap gap-3 justify-center">
            <Button asChild size="lg">
              <Link to="/contact">Get a Free Quote</Link>
            </Button>
            <Button asChild size="lg" variant="dark">
              <a href={SITE.phoneHref}>Call {SITE.phone}</a>
            </Button>
          </div>
        </div>
      </div>

      {/* Prev/Next */}
      <nav className="border-t border-sd-gray-border bg-sd-gray-bg" aria-label="Project navigation">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 py-8 grid gap-4 sm:grid-cols-2">
          {prev ? (
            <Link
              to="/projects/$slug"
              params={{ slug: prev.slug }}
              className="group flex items-center gap-4 p-4 rounded-xl bg-white border border-sd-gray-border hover:border-sd-green transition-colors"
            >
              <ChevronLeft className="h-5 w-5 text-sd-gray-text group-hover:text-sd-green shrink-0" />
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-sd-gray-text">
                  Previous (newer)
                </p>
                <p className="mt-1 text-sm font-semibold text-sd-black truncate">
                  {prev.title ?? prev.alt}
                </p>
              </div>
            </Link>
          ) : (
            <div />
          )}
          {next ? (
            <Link
              to="/projects/$slug"
              params={{ slug: next.slug }}
              className="group flex items-center gap-4 p-4 rounded-xl bg-white border border-sd-gray-border hover:border-sd-green transition-colors sm:text-right sm:flex-row-reverse"
            >
              <ChevronRight className="h-5 w-5 text-sd-gray-text group-hover:text-sd-green shrink-0" />
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-sd-gray-text">
                  Next (older)
                </p>
                <p className="mt-1 text-sm font-semibold text-sd-black truncate">
                  {next.title ?? next.alt}
                </p>
              </div>
            </Link>
          ) : (
            <div />
          )}
        </div>
      </nav>

      {/* Suppress unused import */}
      <span className="hidden">
        <ArrowRight />
      </span>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </article>
  );
}
