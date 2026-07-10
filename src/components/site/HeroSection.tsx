import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Phone, ShieldCheck, Clock, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE, HERO } from "@/data/site";
import { HeroVideoBg } from "@/components/site/HeroVideoBg";

type HeroProps = {
  badge?: string;
  title: ReactNode;
  subtitle?: string;
  bgImage?: string;
  bgImageMobile?: string;
  bgAlt?: string;
  bgVideo?: string;
  primaryCta?: { label: string; to?: string; href?: string };
  showCallCta?: boolean;
  /** Right-column slot (typically a quote form). When provided, layout becomes 2-col on lg+. */
  formSlot?: ReactNode;
  /** When provided, replaces the default primary + call CTA buttons. */
  ctaSlot?: ReactNode;
  /** Trust bullets shown under the subtitle. */
  trustItems?: ReadonlyArray<string>;
  alignCenter?: boolean;
  children?: ReactNode;
};

const DEFAULT_TRUST = [
  "JAMES HARDIE ELITE CONTRACTOR",
  "1,500+ Homes in North Atlanta",
  "0% APR Financing Available",
] as const;

export function HeroSection({
  badge,
  title,
  subtitle,
  bgImage = HERO.bgImage,
  bgImageMobile = HERO.bgImageMobile,
  bgAlt = HERO.bgAlt,
  bgVideo,
  primaryCta = { label: "Schedule FREE Quote", to: "/contact" },
  showCallCta = true,
  formSlot,
  ctaSlot,
  trustItems = DEFAULT_TRUST,
  alignCenter = false,
  children,
}: HeroProps) {
  const hasForm = Boolean(formSlot);
  const trustIcons = [Award, ShieldCheck, Clock];

  return (
    <section className="relative isolate overflow-hidden min-h-[70vh] lg:min-h-[100vh] flex items-center">
      {bgVideo ? (
        <HeroVideoBg videoId={bgVideo} fallbackImg={bgImage} fallbackImgMobile={bgImageMobile} />
      ) : (
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
      )}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-sd-navy/90 via-sd-navy/80 to-sd-navy/60"
        style={{ zIndex: 2 }}
      />

      <div
        className={`relative mx-auto max-w-7xl px-4 lg:px-8 py-hero lg:py-hero-lg grid gap-10 w-full ${
          hasForm ? "lg:grid-cols-[1.2fr_minmax(360px,440px)] lg:gap-12 items-center" : ""
        } ${alignCenter ? "flex flex-col items-center justify-center text-center" : ""}`}
        style={{ zIndex: 3 }}
      >
        {/* Left column */}
        <div className={alignCenter ? "flex flex-col items-center text-center mx-auto" : ""}>
          {badge && (
            <span
              className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-5 text-center"
              style={{
                background: "rgba(179,209,51,0.15)",
                border: "1px solid #B3D133",
                color: "#B3D133",
              }}
            >
              {badge.includes(" · ")
                ? badge.split(" · ").map((part, i) => (
                    <span key={i} className="block sm:inline">
                      {i > 0 && <span className="hidden sm:inline"> · </span>}
                      {part}
                    </span>
                  ))
                : badge}
            </span>
          )}
          <h1
            className={`font-display text-white leading-[1.05] mt-5 text-3xl sm:text-5xl lg:text-6xl xl:text-7xl max-w-3xl drop-shadow-lg ${alignCenter ? "text-center mx-auto" : ""}`}
          >
            {title}
          </h1>
          {subtitle && (
            <p
              className={`mt-5 text-base sm:text-lg text-white/85 max-w-2xl leading-relaxed ${alignCenter ? "text-center mx-auto" : ""}`}
            >
              {subtitle}
            </p>
          )}

          {children && <div className="mt-8">{children}</div>}

          <div className={`mt-9 flex flex-wrap gap-3 ${alignCenter ? "justify-center" : ""}`}>
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
