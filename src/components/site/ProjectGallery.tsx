import { useMemo, useState } from "react";
import { PROJECTS, SERVICE_OPTIONS, type ProjectTag } from "@/data/site";

const FILTERS: ReadonlyArray<"All" | ProjectTag> = ["All", ...SERVICE_OPTIONS];

export function ProjectGallery() {
  const [active, setActive] = useState<(typeof FILTERS)[number]>("All");

  const filtered = useMemo(
    () =>
      active === "All"
        ? PROJECTS
        : PROJECTS.filter((p) => p.tags.includes(active as ProjectTag)),
    [active],
  );

  return (
    <section className="py-20 lg:py-24 bg-background">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-block text-xs font-bold tracking-[0.12em] uppercase text-sd-green-text bg-sd-green-pale px-3 py-1 rounded">
            Featured Projects
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-sd-black">
            Transformations That Speak for Themselves
          </h2>
          <p className="mt-3 text-sd-gray-text">
            Real homes across Metro Atlanta — siding, painting, trim and full exterior renovations.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-2">
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

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <figure
              key={p.src}
              className="group relative overflow-hidden rounded-lg aspect-[4/3] bg-sd-gray-bg shadow-sm hover:shadow-xl transition-shadow"
            >
              <img
                src={p.src}
                alt={p.alt}
                loading="lazy"
                decoding="async"
                width="800"
                height="600"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-sd-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex flex-wrap gap-1">
                  {p.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-pill bg-sd-green px-2 py-0.5 text-[10px] font-bold uppercase text-sd-black"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
