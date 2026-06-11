import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Phone, ShieldCheck, Clock, Award } from "lucide-react";
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
  /** Right-column slot (typically a quote form). When provided, layout becomes 2-col on lg+. */
  formSlot?: ReactNode;
  /** When provided, replaces the default primary + call CTA buttons. */
  ctaSlot?: ReactNode;
  /** Trust bullets shown under the subtitle. */
  trustItems?: ReadonlyArray<string>;
  children?: ReactNode;
};

const DEFAULT_TRUST = [
  "James Hardie Elite Preferred",
  "1,500+ Homes in North Atlanta",
  "GreenSky 0% APR Financing",
] as const;

export function HeroSection({
  badge,
  title,
  subtitle,
  bgImage = HERO.bgImage,
  bgImageMobile = HERO.bgImageMobile,
  bgAlt = HERO.bgAlt,
  primaryCta = { label: "Schedule FREE Quote", to: "/contact" },
  showCallCta = true,
  formSlot,
  ctaSlot,
  trustItems = DEFAULT_TRUST,
  children,
}: HeroProps) {
  const hasForm = Boolean(formSlot);
  const trustIcons = [Award, ShieldCheck, Clock];

  return (
    <section className="relative isolate overflow-hidden min-h-[600px] flex items-center">
      <picture>
        {bgImageMobile && <source media="(max-width: 640px)" srcSet={bgImageMobile} />}
        <img
          src={bgImage}
          alt={bgAlt}
          fetchPriority="high"
          decoding="async"
          width="1920"
          height="1080"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 hover:scale-105"
        />
      </picture>
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-sd-navy/90 via-sd-navy/80 to-sd-navy/60"
      />

      <div
        className={`relative mx-auto max-w-7xl px-4 lg:px-8 py-hero lg:py-hero-lg grid gap-10 ${
          hasForm ? "lg:grid-cols-[1.2fr_minmax(360px,440px)] lg:gap-12 items-center" : ""
        }`}
      >
        {/* Left column */}
        <div>
          <h1 className="font-display text-white leading-[1.05] mt-5 text-3xl sm:text-5xl lg:text-6xl xl:text-7xl max-w-3xl drop-shadow-lg">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-5 text-base sm:text-lg text-white/85 max-w-2xl leading-relaxed">
              {subtitle}
            </p>
          )}

          {children && <div className="mt-8">{children}</div>}

          <div className="mt-9 flex flex-wrap gap-3">
            {ctaSlot ? (
              ctaSlot
            ) : (
              <>
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
                      <Phone aria-hidden="true" /> Call {SITE.phone}
                    </a>
                  </Button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Right column — form */}
        {hasForm && <div className="lg:pl-4">{formSlot}</div>}
      </div>
    </section>
  );
}
