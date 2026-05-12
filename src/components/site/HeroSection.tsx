import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE, HERO } from "@/data/site";

type HeroProps = {
  badge?: string;
  title: ReactNode;
  subtitle?: string;
  bgImage?: string;
  bgImageMobile?: string;
  bgAlt?: string;
  primaryCta?: { label: string; to?: string; href?: string };
  showCallCta?: boolean;
  align?: "left" | "center";
  children?: ReactNode;
};

export function HeroSection({
  badge,
  title,
  subtitle,
  bgImage = HERO.bgImage,
  bgImageMobile = HERO.bgImageMobile,
  bgAlt = HERO.bgAlt,
  primaryCta = { label: "Get Free Quote", to: "/contact" },
  showCallCta = true,
  align = "left",
  children,
}: HeroProps) {
  return (
    <section className="relative isolate overflow-hidden bg-sd-dark">
      <picture>
        {bgImageMobile && <source media="(max-width: 640px)" srcSet={bgImageMobile} />}
        <img
          src={bgImage}
          alt={bgAlt}
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </picture>
      <div
        aria-hidden
        className="absolute inset-0 bg-[#0D1B2A]"
        style={{ opacity: 0.65 }}
      />
      <div
        className={`relative mx-auto max-w-7xl px-4 lg:px-8 py-20 lg:py-28 ${
          align === "center" ? "text-center flex flex-col items-center" : ""
        }`}
      >
        {badge && (
          <span className="inline-flex items-center gap-2 rounded-pill bg-sd-green/15 border border-sd-green/40 px-4 py-1.5 text-xs font-semibold tracking-[0.08em] uppercase text-sd-green">
            <span aria-hidden>★</span> {badge}
          </span>
        )}
        <h1
          className={`font-display text-white leading-[0.95] mt-5 text-5xl sm:text-6xl lg:text-7xl ${
            align === "center" ? "max-w-4xl" : "max-w-3xl"
          }`}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            className={`mt-5 text-base sm:text-lg text-white/80 ${
              align === "center" ? "max-w-2xl" : "max-w-2xl"
            }`}
          >
            {subtitle}
          </p>
        )}

        {children && <div className="mt-8">{children}</div>}

        <div
          className={`mt-9 flex flex-wrap gap-3 ${
            align === "center" ? "justify-center" : ""
          }`}
        >
          {primaryCta.to ? (
            <Button asChild size="lg">
              <Link to={primaryCta.to}>{primaryCta.label}</Link>
            </Button>
          ) : (
            <Button asChild size="lg">
              <a href={primaryCta.href}>{primaryCta.label}</a>
            </Button>
          )}
          {showCallCta && (
            <Button asChild size="lg" variant="outlineWhite">
              <a href={SITE.phoneHref}>
                <Phone /> Call {SITE.phone}
              </a>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
