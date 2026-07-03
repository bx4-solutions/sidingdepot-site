import { Link } from "@tanstack/react-router";
import { ArrowRight, type LucideIcon } from "lucide-react";
import type { ServiceImage } from "@/data/site";

type Props = {
  Icon: LucideIcon;
  title: string;
  description: string;
  to?: string;
  id?: string;
  image?: ServiceImage;
  priority?: boolean;
};

export function ServiceCard({ Icon, title, description, to, id, image, priority = false }: Props) {
  const inner = (
    <div
      className="group relative h-full overflow-hidden rounded-xl scroll-mt-32"
      style={{
        minHeight: 280,
        boxShadow: "0 2px 8px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.06)",
        transition: "box-shadow 0.3s ease, transform 0.3s ease",
      }}
    >
      {/* Photo — always visible, subtle zoom on hover */}
      {image ? (
        <picture>
          {image.avif && <source srcSet={image.avif} type="image/avif" />}
          {image.webp && <source srcSet={image.webp} type="image/webp" />}
          <img
            src={image.src}
            alt={title}
            aria-hidden="true"
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            // @ts-expect-error fetchpriority is a valid HTML attribute
            fetchpriority={priority ? "high" : "auto"}
            width={480}
            height={320}
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </picture>
      ) : (
        <div className="absolute inset-0 bg-sd-dark" />
      )}

      {/* Default gradient — bottom-up, legible without hover */}
      <div
        aria-hidden
        className="absolute inset-0 transition-opacity duration-300 group-hover:opacity-0"
        style={{
          background:
            "linear-gradient(to top, rgba(10,10,10,0.74) 0%, rgba(10,10,10,0.22) 55%, rgba(10,10,10,0.03) 100%)",
        }}
      />

      {/* Hover overlay — deeper dark for description legibility */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: "rgba(10,10,10,0.72)" }}
      />

      {/* Green top accent bar */}
      <div className="absolute inset-x-0 top-0 z-20 h-[3px] bg-sd-green" />

      {/* Content — pinned to bottom */}
      <div className="relative z-10 flex h-full flex-col justify-end p-6">
        {/* Icon */}
        <div
          className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg"
          style={{
            background: "rgba(182,226,20,0.15)",
            border: "1px solid rgba(182,226,20,0.30)",
          }}
        >
          <Icon className="h-5 w-5 text-sd-green" strokeWidth={2} aria-hidden="true" />
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold leading-snug text-white">{title}</h3>

        {/* Description — hidden at rest, visible on hover */}
        <p className="mt-2 max-h-0 overflow-hidden text-sm leading-relaxed text-white/80 opacity-0 transition-all duration-300 ease-out group-hover:max-h-24 group-hover:opacity-100">
          {description}
        </p>

        {/* CTA */}
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-sd-green">
          View Services{" "}
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1.5" />
        </span>
      </div>
    </div>
  );

  return to ? (
    <Link to={to} id={id} className="block h-full">
      {inner}
    </Link>
  ) : (
    <div id={id} className="h-full">
      {inner}
    </div>
  );
}
