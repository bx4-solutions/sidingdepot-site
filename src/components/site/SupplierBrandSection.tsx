import { ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";

const SD_NAVY = "#1e2a3a";
const SD_LIME = "#B3D133";
const SD_LIME_TEXT = "#3C4A07";

export type SupplierStat = { val: string; desc: string };
export type SupplierCard = { name: string; value: string; detail: string; href?: string };

export type SupplierSectionConfig = {
  logoSrc: string;
  logoAlt: string;
  logoTagline: string;
  logoFilter?: string;
  /** True when the logo is light/white (meant for a dark backdrop). Keeps it on the navy panel instead of a white chip. */
  logoOnDark?: boolean;
  sectionEyebrow: string;
  sectionHeadline: string;
  sectionBody: string;
  cardEyebrow: string;
  cardHeadline: string;
  body1: string;
  body2: string;
  stats: [SupplierStat, SupplierStat, SupplierStat];
  cards: SupplierCard[];
};

export function SupplierBrandSection({ cfg }: { cfg: SupplierSectionConfig }) {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden bg-gray-50">
      <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span
            className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-5"
            style={{ background: SD_LIME, color: SD_NAVY }}
          >
            {cfg.sectionEyebrow}
          </span>
          <h2
            className="font-display text-3xl sm:text-4xl lg:text-5xl leading-tight"
            style={{ color: SD_NAVY }}
          >
            {cfg.sectionHeadline}
          </h2>
          <p className="mt-5 text-gray-500 max-w-xl mx-auto leading-relaxed">{cfg.sectionBody}</p>
        </div>

        {/* Main card */}
        <div
          className="rounded-3xl overflow-hidden mb-6 shadow-2xl"
          style={{ border: `2px solid ${SD_LIME}` }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-0">
            {/* Logo panel — dark navy */}
            <div
              className="flex flex-col items-center justify-center gap-5 p-8 lg:p-10"
              style={{ background: SD_NAVY }}
            >
              {cfg.logoOnDark ? (
                <img
                  src={cfg.logoSrc}
                  alt={cfg.logoAlt}
                  className="w-full h-auto object-contain"
                  style={{
                    maxWidth: 300,
                    maxHeight: 200,
                    filter: cfg.logoFilter ?? "drop-shadow(0 6px 20px rgba(0,0,0,0.45))",
                  }}
                  loading="lazy"
                />
              ) : (
                <div className="bg-white rounded-2xl p-6 lg:p-8 w-full flex items-center justify-center shadow-lg">
                  <img
                    src={cfg.logoSrc}
                    alt={cfg.logoAlt}
                    className="w-full h-auto object-contain"
                    style={{
                      maxWidth: 280,
                      maxHeight: 160,
                      filter: cfg.logoFilter,
                    }}
                    loading="lazy"
                  />
                </div>
              )}
              <p
                className="text-center text-sm font-bold uppercase tracking-wider"
                style={{ color: SD_LIME }}
              >
                {cfg.logoTagline}
              </p>
            </div>

            {/* Copy panel — white */}
            <div className="p-8 lg:p-12 flex flex-col justify-center bg-white">
              <p
                className="text-xs font-bold uppercase tracking-widest mb-3"
                style={{ color: SD_LIME_TEXT }}
              >
                {cfg.cardEyebrow}
              </p>
              <h3
                className="font-display text-3xl lg:text-4xl leading-tight mb-5"
                style={{ color: SD_NAVY }}
              >
                {cfg.cardHeadline}
              </h3>
              <p className="text-gray-600 leading-relaxed mb-4">{cfg.body1}</p>
              <p className="text-gray-600 leading-relaxed mb-8">{cfg.body2}</p>

              <div className="grid sm:grid-cols-3 gap-3">
                {cfg.stats.map((s) => (
                  <div
                    key={s.val}
                    className="rounded-xl p-4 text-center"
                    style={{ background: SD_NAVY }}
                  >
                    <p className="font-display text-2xl font-bold" style={{ color: SD_LIME }}>
                      {s.val}
                    </p>
                    <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.6)" }}>
                      {s.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Secondary cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {cfg.cards.map((c) => {
            const inner = (
              <div
                className="rounded-2xl p-5 h-full flex flex-col gap-2 bg-white transition-all hover:shadow-lg"
                style={{
                  border: `2px solid ${SD_LIME}`,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                }}
              >
                <div className="h-1 w-10 rounded-full mb-1" style={{ background: SD_LIME }} />
                <div className="flex items-center justify-between">
                  <span
                    className="text-xs font-bold uppercase tracking-wider"
                    style={{ color: SD_NAVY }}
                  >
                    {c.name}
                  </span>
                  {c.href && <ArrowRight className="h-3.5 w-3.5" style={{ color: SD_LIME_TEXT }} />}
                </div>
                <p className="font-display text-2xl font-bold" style={{ color: SD_NAVY }}>
                  {c.value}
                </p>
                <p className="text-xs text-gray-400 leading-relaxed">{c.detail}</p>
              </div>
            );

            return c.href ? (
              <Link key={c.name} to={c.href} className="block">
                {inner}
              </Link>
            ) : (
              <div key={c.name}>{inner}</div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
