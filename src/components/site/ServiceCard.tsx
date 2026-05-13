import { Link } from "@tanstack/react-router";
import { ArrowRight, type LucideIcon } from "lucide-react";
import type { ServiceImage } from "@/data/site";

type Props = {
  Icon: LucideIcon;
  title: string;
  description: string;
  to?: string;
  /** Optional DOM id, used as a scroll anchor target (e.g. "services-siding"). */
  id?: string;
  /** Background image shown behind the card content; covered by white on hover. */
  image?: ServiceImage;
  /**
   * When true, the background image is preloaded eagerly with high fetch priority.
   * Use for cards rendered in the first viewport (above the fold).
   */
  priority?: boolean;
};

export function ServiceCard({ Icon, title, description, to, id, image, priority = false }: Props) {
  const inner = (
    <div className="group relative h-full overflow-hidden rounded-lg border border-sd-gray-border bg-white transition-all hover:-translate-y-1 hover:shadow-xl scroll-mt-32">
      <div className="relative z-20 h-1.5 bg-sd-green" />

      {/* Background image (behind text). Hidden on hover by white overlay. */}
      {image && (
        <picture>
          {image.avif && <source srcSet={image.avif} type="image/avif" />}
          {image.webp && <source srcSet={image.webp} type="image/webp" />}
          <img
            src={image.src}
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
            width={480}
            height={320}
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover opacity-90 transition-opacity duration-300 group-hover:opacity-0"
          />
        </picture>
      )}
      {/* Soft white veil for default-state readability */}
      {image && (
        <div className="pointer-events-none absolute inset-0 z-[1] bg-white/55 transition-opacity duration-300 group-hover:opacity-0" />
      )}
      {/* Solid white cover on hover so text is crisp */}
      <div className="pointer-events-none absolute inset-0 z-[2] bg-white opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative z-10 p-6">
        <div className="flex h-11 w-11 items-center justify-center rounded-md bg-sd-green-pale text-sd-navy transition-colors">
          <Icon className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
        </div>
        <h3 className="mt-4 text-lg font-bold text-sd-black [text-shadow:0_1px_2px_rgba(255,255,255,0.6)] group-hover:[text-shadow:none]">
          {title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-sd-black/85 group-hover:text-sd-gray-text">
          {description}
        </p>
        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-sd-green-text">
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
