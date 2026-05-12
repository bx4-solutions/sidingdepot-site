import { Link } from "@tanstack/react-router";
import { ArrowRight, type LucideIcon } from "lucide-react";

type Props = {
  Icon: LucideIcon;
  title: string;
  description: string;
  to?: string;
  /** Optional DOM id, used as a scroll anchor target (e.g. "services-siding"). */
  id?: string;
};

export function ServiceCard({ Icon, title, description, to, id }: Props) {
  const inner = (
    <div className="group relative h-full bg-white border border-sd-gray-border rounded-lg overflow-hidden transition-all hover:bg-sd-navy hover:border-sd-navy hover:-translate-y-1 hover:shadow-xl scroll-mt-32">
      <div className="h-1.5 bg-sd-green" />
      <div className="p-6">
        <div className="flex h-11 w-11 items-center justify-center rounded-md bg-sd-green-pale text-sd-navy group-hover:bg-sd-green group-hover:text-sd-navy transition-colors">
          <Icon className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-sd-black group-hover:text-white transition-colors">
          {title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-sd-gray-text group-hover:text-white/65 transition-colors">
          {description}
        </p>
        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-sd-green">
          View More <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </div>
  );

  return to ? (
    <Link to={to} id={id} className="block h-full">
      {inner}
    </Link>
  ) : (
    <div id={id}>{inner}</div>
  );
}
