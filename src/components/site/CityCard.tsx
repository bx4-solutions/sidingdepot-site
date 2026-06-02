import { Link } from "@tanstack/react-router";
import { MapPin, ArrowRight } from "lucide-react";

type Props = { name: string; county: string; slug?: string; to?: string };

// Cidades com Landing Page dedicada (/lp/siding-<slug>)
const DEDICATED_LP = new Set(["marietta", "alpharetta", "canton"]);

function resolveHref(slug?: string, to?: string) {
  if (to) return to;
  if (!slug) return "/contact";
  if (DEDICATED_LP.has(slug)) return `/lp/siding-${slug}` as const;
  return `/locations/${slug}/siding` as const;
}

export function CityCard({ name, county, slug, to }: Props) {
  const href = resolveHref(slug, to);
  return (
    <Link
      to={href as string}
      className="group flex items-center gap-3 rounded-lg border border-border bg-background p-4 transition-all hover:border-sd-green hover:shadow-[0_8px_24px_-12px] hover:shadow-sd-green/40"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-md bg-sd-green-pale text-sd-green-text">
        <MapPin className="h-5 w-5" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-semibold text-foreground truncate">{name}</div>
        <div className="text-xs text-muted-foreground truncate">{county}</div>
      </div>
      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-sd-green group-hover:translate-x-0.5 transition-all" />
    </Link>
  );
}
