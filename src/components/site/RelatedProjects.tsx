import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { PROJECTS } from "@/data/site";

type Props = {
  /** How many thumbnails to show. Default 4. */
  limit?: number;
};

export function RelatedProjects({ limit = 4 }: Props) {
  const items = PROJECTS.slice(0, limit);
  return (
    <div className="mt-6">
      <div className="flex items-end justify-between mb-3">
        <h3 className="text-sm font-bold tracking-[0.12em] uppercase text-sd-black">
          Related Projects
        </h3>
        <Link
          to="/"
          className="text-xs font-semibold text-sd-black hover:underline inline-flex items-center gap-1 [&>svg]:text-sd-green"
        >
          View all <ArrowUpRight className="h-3 w-3" />
        </Link>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {items.map((p) => (
          <Link
            key={p.src}
            to="/"
            className="group relative aspect-square overflow-hidden rounded-lg ring-1 ring-black/5 hover:ring-sd-green focus:outline-none focus-visible:ring-2 focus-visible:ring-sd-green transition"
          >
            <img
              src={p.src}
              alt={p.alt}
              loading="lazy"
              decoding="async"
              width={300}
              height={300}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-sd-black/80 to-transparent p-1.5">
              <span className="block text-[10px] font-semibold uppercase tracking-wide text-white truncate">
                {p.tags[0]}
              </span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
