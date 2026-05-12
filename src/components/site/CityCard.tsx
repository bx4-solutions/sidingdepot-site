import { Link } from "@tanstack/react-router";
import { MapPin, ArrowRight } from "lucide-react";

type Props = { name: string; county: string; to?: string };

export function CityCard({ name, county, to = "/service-areas" }: Props) {
  return (
    <Link
      to={to}
      className="group flex items-center gap-3 rounded-lg border border-sd-gray-border bg-white p-4 transition-all hover:border-sd-green hover:shadow-[0_8px_24px_-12px] hover:shadow-sd-green/40"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-md bg-sd-green-pale text-sd-green-text">
        <MapPin className="h-5 w-5" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-semibold text-sd-black truncate">{name}</div>
        <div className="text-xs text-sd-gray-text truncate">{county}</div>
      </div>
      <ArrowRight className="h-4 w-4 text-sd-gray-text group-hover:text-sd-green group-hover:translate-x-0.5 transition-all" />
    </Link>
  );
}
