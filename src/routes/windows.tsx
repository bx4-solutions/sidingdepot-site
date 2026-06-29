import { createFileRoute, Link } from "@tanstack/react-router";
import { getGoogleReviews } from "@/lib/google-reviews.functions";
import { useEffect, useRef, useState, useCallback } from "react";
import {
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Award,
  CheckCircle2,
  FileText,
  Users,
  Star,
  Phone,
  ChevronRight,
  Zap,
  Thermometer,
  Wind,
  Eye,
} from "lucide-react";
import { BeforeAfterSlider } from "@/components/site/BeforeAfterSlider";
import { FaqSection } from "@/components/site/FaqSection";
import { BEFORE_AFTER_PAIRS, PROJECTS_SORTED, SITE } from "@/data/site";
import { SERVICE_METADATA_AB } from "@/data/seo-config";
import { getFaqSchema, getBreadcrumbSchema } from "@/lib/schema";
import { serviceJsonLd } from "@/components/site/ServiceLandingPage";
import windowsHeroImg from "@/assets/windows-hero.jpg";
import jamesHardieBadge from "@/assets/james-hardie-elite-badge.png";
import { GoogleReviewsCarousel } from "@/components/site/GoogleReviewsCarousel";
import { ProofBar } from "@/components/site/ProofBar";
import { RelatedServices } from "@/components/site/ServicePageLayout";
import { SupplierBrandSection } from "@/components/site/SupplierBrandSection";
import { useGoogleStats } from "@/lib/google-stats-context";

const SD_NAVY = "#1e2a3a";
const SD_LIME = "#B3D133";
const SD_LIME_TEXT = "#3C4A07";

const SERVICE_KEY = "windows";
const CITY = "Marietta & North Atlanta";
const seo = SERVICE_METADATA_AB[SERVICE_KEY].A;
const HERO_IMAGE = windowsHeroImg;
const OG_IMAGE = "https://sidingdepot.com/og-default.webp";
const CANONICAL = "https://sidingdepot.com/windows";

export const Route = createFileRoute("/windows")({
  loader: async () => {
    try {
      const reviewsData = await getGoogleReviews();
      return { reviewsData };
    } catch (error) {
      console.error("Failed to load reviews in windows loader:", error);
      return { reviewsData: { reviews: [], overallRating: 4.7, totalReviews: 160 } };
    }
  },
  head: () => ({
    meta: [
      { title: seo.metaTitle(CITY) },
      { name: "description", content: seo.metaDesc },
      { property: "og:title", content: seo.metaTitle(CITY) },
      { property: "og:description", content: seo.metaDesc },
      { property: "og:image", content: OG_IMAGE },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "canonical", href: CANONICAL },
      { rel: "preload", as: "image", href: HERO_IMAGE, fetchPriority: "high" as any },
    ],
    scripts: [
      serviceJsonLd("Energy Star Window Installation", seo.metaDesc, {
        canonical: CANONICAL,
        image: OG_IMAGE,
        serviceType: "Window Replacement & Installation",
      }),
      { type: "application/ld+json", children: JSON.stringify(getFaqSchema(FAQ_ITEMS)) },
      {
        type: "application/ld+json",
        children: JSON.stringify(
          getBreadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Windows", url: "/windows" },
          ]),
        ),
      },
    ],
  }),
  component: WindowsPage,
});

/* ---------------------------------------------------------------- */
/* useCountUp                                                         */
/* ---------------------------------------------------------------- */
function useCountUp(target: number, duration = 1800) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) {
      setCount(target);
      return;
    }
    let started = false;
    const animate = () => {
      if (started) return;
      started = true;
      const begin = performance.now();
      const tick = (now: number) => {
        const p = Math.min((now - begin) / duration, 1);
        setCount(Math.round(p * target));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    if (typeof IntersectionObserver === "undefined") {
      animate();
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          animate();
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(el);
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) animate();
    return () => observer.disconnect();
  }, [target, duration]);
  return { ref, count };
}

/* ---------------------------------------------------------------- */
/* Hero                                                               */
/* ---------------------------------------------------------------- */
function WindowsHero() {
  return (
    <section className="relative isolate overflow-hidden" style={{ minHeight: "92vh" }}>
      <img
        src={HERO_IMAGE}
        alt="Beautiful home with new energy-efficient windows installed by Siding Depot in North Atlanta"
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
        style={{ objectPosition: "center 40%" }}
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(105deg, rgba(30,42,58,0.92) 0%, rgba(30,42,58,0.70) 50%, rgba(30,42,58,0.30) 100%)",
        }}
      />
      <div className="relative mx-auto max-w-7xl px-4 lg:px-8 flex flex-col items-center justify-center h-full py-32 lg:py-40 text-center">
        <div className="max-w-3xl">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest"
              style={{
                background: "rgba(179,209,51,0.15)",
                border: "1px solid #B3D133",
                color: "#B3D133",
              }}
            >
              <Award className="h-3 w-3" /> Energy Star Certified · Georgia Climate Specialists
            </span>
          </div>
          <h1 className="font-display text-white leading-[0.95] text-4xl sm:text-5xl lg:text-7xl xl:text-8xl">
            Windows That
            <br />
            <span style={{ color: "#B3D133" }}>Pay For</span> Themselves.
          </h1>
          <p className="mt-6 text-lg text-white/75 leading-relaxed max-w-2xl mx-auto">
            Energy Star certified window replacement across Marietta, Canton, and North Atlanta —
            cut cooling bills by up to 31%, eliminate drafts, and protect your home's resale value.
            Written warranty. In-house installers. Free in-home assessment.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-base transition-all hover:scale-105 active:scale-100"
              style={{ background: "#B3D133", color: "#1e2a3a" }}
            >
              Get My Free Window Quote <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={SITE.phoneHref}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-base text-white transition-all hover:bg-white/10 active:bg-white/5"
              style={{ border: "2px solid rgba(255,255,255,0.3)" }}
            >
              <Phone className="h-4 w-4" /> {SITE.phone}
            </a>
          </div>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-5">
            {[
              { icon: Star, text: "4.7 · 261 Verified Reviews" },
              { icon: ShieldCheck, text: "Licensed & Insured · GA" },
              { icon: CheckCircle2, text: "0% APR Financing Available" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-1.5 text-sm text-white/65">
                <Icon className="h-4 w-4 shrink-0" style={{ color: "#B3D133" }} />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- */
/* Trust Strip                                                        */
/* ---------------------------------------------------------------- */
function TrustStrip() {
  const { rating, totalReviews } = useGoogleStats();
  const items = [
    { label: "Energy Star · Certified Installer", href: undefined, char: "E" },
    { label: "4.7★ · 261 GuildQuality", href: "/#guild-reviews", char: "★" },
    { label: `${rating}★ · ${totalReviews} Google Reviews`, href: "/#google-reviews", char: "★" },
    { label: "4.9★ · 91 Thumbtack", href: "/#google-reviews", char: "★" },
    { label: "GreenSky® 0% APR", href: undefined, char: "G" },
    { label: "Guildmember Since 2019", href: undefined, char: "G" },
  ];
  return (
    <div style={{ background: "#1e2a3a", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <ul className="overflow-x-auto scrollbar-none flex flex-nowrap items-center justify-start lg:justify-between gap-x-4 py-1">
          {items.map((item) => {
            const inner = (
              <div className="flex items-center gap-2 py-1.5 px-2 shrink-0">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-sd-green/20 shrink-0 font-black text-[#B3D133] text-[9px]">
                  {item.char}
                </span>
                <div className="min-w-0">
                  <p className="text-white text-[9px] md:text-[10px] font-bold uppercase tracking-wide leading-none whitespace-nowrap truncate">
                    {item.label}
                  </p>
                </div>
              </div>
            );
            return item.href ? (
              <a
                key={item.label}
                href={item.href}
                className="hover:opacity-80 transition-opacity shrink-0"
              >
                {inner}
              </a>
            ) : (
              <div key={item.label} className="shrink-0">
                {inner}
              </div>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Stats Bar                                                          */
/* ---------------------------------------------------------------- */
const STATS_DATA = [
  { value: 1500, suffix: "+", label: "Projects Completed" },
  { value: 20, suffix: "+", label: "Years in Georgia" },
  { value: 92, suffix: "%", label: "Would Recommend Us" },
  { value: 261, suffix: "+", label: "Verified Reviews" },
];

function StatItem({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const { ref, count } = useCountUp(value);
  return (
    <div className="flex flex-col items-center text-center px-6 py-8">
      <span
        ref={ref}
        className="font-display text-3xl sm:text-5xl lg:text-6xl"
        style={{ color: "#B3D133" }}
      >
        {count.toLocaleString()}
        {suffix}
      </span>
      <span className="mt-1 text-sm font-semibold uppercase tracking-wider text-white/60">
        {label}
      </span>
    </div>
  );
}

function WindowsStatsBar() {
  return (
    <section style={{ background: SD_NAVY }} className="border-t border-white/5">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/8">
          {STATS_DATA.map((s) => (
            <StatItem key={s.label} {...s} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- */
/* Performance Authority Section                                      */
/* ---------------------------------------------------------------- */
function WindowPerformanceSection() {
  return (
    <section className="py-24 lg:py-32 bg-white">
      <div className="mx-auto max-w-7xl px-4 lg:px-8 grid gap-16 lg:grid-cols-2 items-center">
        <div className="relative">
          <div
            className="absolute -inset-4 rounded-3xl opacity-10"
            style={{ background: "linear-gradient(135deg, #B3D133, transparent)" }}
            aria-hidden
          />
          <img
            src="/projects/project-1.webp"
            alt="Energy-efficient window installation by Siding Depot in North Atlanta"
            className="relative rounded-2xl w-full object-cover shadow-2xl"
            style={{ aspectRatio: "4/3" }}
            loading="lazy"
          />
          <div
            className="absolute -bottom-6 -right-4 rounded-2xl px-6 py-4 shadow-xl text-center"
            style={{ background: "#1e2a3a", border: "1px solid rgba(179,209,51,0.3)" }}
          >
            <p className="font-display text-4xl" style={{ color: "#B3D133" }}>
              Up to 31%
            </p>
            <p className="text-xs text-white/60 uppercase tracking-widest font-bold mt-0.5">
              Energy Savings
            </p>
          </div>
        </div>
        <div>
          <span
            className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-5"
            style={{ background: "#eef7c0", color: SD_LIME_TEXT }}
          >
            Why Installation Quality Matters
          </span>
          <h2 className="font-display text-4xl sm:text-5xl text-sd-navy leading-tight">
            The Window Is Only As Good
            <br />
            <span style={{ color: SD_LIME_TEXT }}>As The Install.</span>
          </h2>
          <p className="mt-6 text-gray-600 leading-relaxed text-lg">
            A premium window installed incorrectly performs no better than a builder-grade one. Air
            infiltration, water intrusion, and frame gap failures all come from poor installation —
            not the window itself.
            <strong> The install is 60% of the result.</strong>
          </p>
          <p className="mt-4 text-gray-600 leading-relaxed">
            Every Siding Depot window is installed with precision-fitted flashing, foam-seal
            perimeters, and factory-matched trim — the complete system that delivers the energy
            savings the manufacturer actually promises. That's why our installs come with a written
            15-year labor warranty on top of the manufacturer's material coverage.
          </p>
          <div className="mt-8 rounded-xl overflow-hidden border border-gray-200 overflow-x-auto">
            <div className="min-w-[340px]">
              <div className="grid grid-cols-3 text-xs font-bold uppercase tracking-wider bg-gray-50 px-3 py-3 text-gray-500">
                <span>Factor</span>
                <span className="text-center">Typical Installer</span>
                <span className="text-center" style={{ color: SD_LIME_TEXT }}>
                  Siding Depot
                </span>
              </div>
              {[
                ["Install warranty", "1-yr verbal", "15-yr written"],
                ["Flashing", "Basic tape", "Full system flash"],
                ["Air seal", "Caulk only", "Foam + caulk"],
                ["Low-E glass", "Optional", "Standard"],
              ].map(([factor, standard, elite]) => (
                <div
                  key={factor}
                  className="grid grid-cols-3 px-3 py-3 border-t border-gray-100 text-xs sm:text-sm"
                >
                  <span className="font-medium text-gray-700">{factor}</span>
                  <span className="text-center text-gray-400">{standard}</span>
                  <span className="text-center font-semibold" style={{ color: SD_LIME_TEXT }}>
                    {elite}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <Link
            to="/contact"
            className="mt-8 inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-sm transition-all hover:scale-105"
            style={{ background: "#B3D133", color: "#1e2a3a" }}
          >
            Get My Free Window Assessment <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- */
/* Window Types Section                                               */
/* ---------------------------------------------------------------- */
const WINDOW_TYPES = [
  {
    id: "double-hung",
    title: "Double-Hung",
    subtitle: "Most popular · Easy to clean",
    image: "/projects/project-2.webp",
    description:
      "Both sashes slide up and down — easy cleaning, great ventilation, and works with every home style. The most installed window in North Atlanta for a reason.",
  },
  {
    id: "casement",
    title: "Casement",
    subtitle: "Maximum airflow · Modern look",
    image: "/projects/project-3.webp",
    description:
      "Hinged on one side and cranked open like a door, casements seal tighter than any other style when closed. Ideal for kitchens and hard-to-reach areas.",
  },
  {
    id: "bay-bow",
    title: "Bay & Bow",
    subtitle: "Architectural drama · Add space",
    image: "/projects/project-4.webp",
    description:
      "Bay and bow windows project outward from the wall, creating a seating alcove inside while adding curb appeal outside. Statement pieces that increase perceived square footage.",
  },
  {
    id: "picture-slider",
    title: "Picture & Sliding",
    subtitle: "Maximize views · Let in light",
    image: "/projects/project-1.webp",
    description:
      "Picture windows are fixed glass — the largest possible pane for unobstructed views. Sliding windows offer a sleek horizontal operation perfect for wide openings.",
  },
];

function WindowTypesSection() {
  const [active, setActive] = useState<string | null>(null);
  const activeType = WINDOW_TYPES.find((t) => t.id === active);
  return (
    <section className="py-24 lg:py-32" style={{ background: "#1e2a3a" }}>
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="max-w-2xl mb-14">
          <span
            className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4"
            style={{ background: "rgba(179,209,51,0.12)", color: "#B3D133" }}
          >
            Window Styles
          </span>
          <h2 className="font-display text-4xl sm:text-5xl text-white leading-tight">
            Four Window Systems.
            <br />
            One Right Choice For Your Home.
          </h2>
          <p className="mt-5 text-white/55 leading-relaxed">
            Every window we install includes Low-E double-pane glass, argon-gas fill, and
            energy-rated frames — engineered for Georgia's heat and humidity. Click to explore each
            style.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {WINDOW_TYPES.map((t) => {
            const isActive = active === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActive(isActive ? null : t.id)}
                className="group relative overflow-hidden rounded-2xl text-left"
                style={{
                  aspectRatio: "3/4",
                  outline: isActive ? "2px solid #B3D133" : "none",
                  outlineOffset: 2,
                }}
              >
                <img
                  src={t.image}
                  alt={t.title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div
                  className="absolute inset-0 transition-opacity duration-300 group-hover:opacity-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(30,42,58,0.88) 0%, rgba(30,42,58,0.20) 60%, transparent 100%)",
                  }}
                />
                <div
                  className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{ background: "rgba(30,42,58,0.82)" }}
                />
                <div className="relative z-10 h-full flex flex-col justify-end p-5">
                  {isActive && (
                    <span
                      className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                      style={{ background: "#B3D133", color: "#1e2a3a" }}
                    >
                      Selected
                    </span>
                  )}
                  <p
                    className="text-xs font-bold uppercase tracking-widest mb-1.5"
                    style={{ color: "#B3D133" }}
                  >
                    {t.subtitle}
                  </p>
                  <h3 className="text-xl font-bold text-white leading-tight">{t.title}</h3>
                  <p className="mt-2 text-sm text-white/0 leading-relaxed transition-all duration-300 group-hover:text-white/80 overflow-hidden max-h-0 group-hover:max-h-24">
                    {t.description}
                  </p>
                  <span
                    className="mt-3 inline-flex items-center gap-1 text-xs font-bold"
                    style={{ color: "#B3D133" }}
                  >
                    Learn More <ChevronRight className="h-3 w-3" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
        {activeType && (
          <div
            className="mt-6 rounded-2xl p-6 grid sm:grid-cols-[200px_1fr] gap-6 items-center"
            style={{
              background: "rgba(179,209,51,0.06)",
              border: "1px solid rgba(179,209,51,0.2)",
            }}
          >
            <img
              src={activeType.image}
              alt={activeType.title}
              className="rounded-xl w-full object-cover"
              style={{ aspectRatio: "4/3" }}
            />
            <div>
              <p
                className="text-xs font-bold uppercase tracking-widest mb-2"
                style={{ color: "#B3D133" }}
              >
                {activeType.subtitle}
              </p>
              <h3 className="text-2xl font-bold text-white mb-3">{activeType.title}</h3>
              <p className="text-white/65 leading-relaxed">{activeType.description}</p>
              <Link
                to="/contact"
                className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all hover:scale-105"
                style={{ background: "#B3D133", color: "#1e2a3a" }}
              >
                Get Quote for {activeType.title} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- */
/* Process — 5 steps                                                  */
/* ---------------------------------------------------------------- */
const PROCESS = [
  {
    num: "01",
    title: "Free In-Home Assessment",
    desc: "We visit your home, measure every opening, assess frame condition, and identify where air and heat are escaping. You receive a written findings report with energy-loss estimates — at no charge.",
    icon: Users,
  },
  {
    num: "02",
    title: "Custom Window Selection",
    desc: "We match window style, glass package (Low-E, argon, triple-pane options), and frame color to your home's architecture and HOA requirements. Written proposal with exact specifications before you commit.",
    icon: FileText,
  },
  {
    num: "03",
    title: "Factory-Direct Order",
    desc: "Every window is custom-measured and factory-ordered to your exact opening size. No cutting, trimming, or shimming to force a fit — each unit arrives ready for a precision install.",
    icon: Award,
  },
  {
    num: "04",
    title: "Professional Installation",
    desc: "Our in-house crews remove the old window, assess and repair the rough opening, install full-perimeter flashing, foam-seal the frame, and fit the new window to manufacturer specs. Interior and exterior trim matched and finished same day.",
    icon: ShieldCheck,
  },
  {
    num: "05",
    title: "Energy Test & Final Walkthrough",
    desc: "We check every window for air infiltration, seal integrity, and smooth operation. You receive operating instructions, warranty documentation, and Energy Star certification paperwork before we leave.",
    icon: CheckCircle2,
  },
] as const;

function WindowsProcess() {
  return (
    <section className="py-24 lg:py-32 bg-white overflow-hidden">
      <style>{`
        @keyframes wp-fade-up   { from { opacity:0; transform:translateY(32px);  } to { opacity:1; transform:translateY(0);   } }
        @keyframes wp-fade-down { from { opacity:0; transform:translateY(-32px); } to { opacity:1; transform:translateY(0);   } }
        @keyframes wp-fade-left { from { opacity:0; transform:translateX(32px);  } to { opacity:1; transform:translateX(0);  } }
        @keyframes wp-dot-pop   { from { opacity:0; transform:scale(0);          } to { opacity:1; transform:scale(1);        } }
        .wp-step[data-visible="true"].wp-top  { animation: wp-fade-up   0.6s ease both; }
        .wp-step[data-visible="true"].wp-bot  { animation: wp-fade-down 0.6s ease both; }
        .wp-step[data-visible="true"].wp-mob  { animation: wp-fade-left 0.6s ease both; }
        .wp-dot[data-visible="true"]          { animation: wp-dot-pop   0.4s ease both; }
        .wp-step, .wp-dot { opacity: 0; }
      `}</style>
      <div className="mx-auto max-w-6xl px-4 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span
            className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4"
            style={{ background: "#eef7c0", color: SD_LIME_TEXT }}
          >
            Our Process
          </span>
          <h2 className="font-display text-4xl sm:text-5xl text-sd-navy leading-tight">
            5 Steps. Zero Surprises.
          </h2>
          <p className="mt-4 text-gray-500 leading-relaxed">
            Most window jobs fail at steps 3 and 4 — rushed installs, no flashing, no air seal. We
            don't cut those corners.
          </p>
        </div>
        <div className="hidden lg:block relative">
          <div
            className="absolute left-1/2 -translate-x-1/2 top-[88px] bottom-[88px] w-0.5"
            style={{
              background: "linear-gradient(to bottom, #B3D133 0%, #D4EC5A 50%, #B3D133 100%)",
              opacity: 0.35,
            }}
          />
          {PROCESS.map((step, i) => {
            const Icon = step.icon;
            const isTop = i % 2 === 0;
            return (
              <WPStepZigzag
                key={step.num}
                step={step}
                Icon={Icon}
                isTop={isTop}
                delay={`${i * 0.11}s`}
                index={i}
                total={PROCESS.length}
              />
            );
          })}
        </div>
        <div className="lg:hidden flex flex-col gap-0">
          {PROCESS.map((step, i) => {
            const Icon = step.icon;
            return (
              <WPStepMobile
                key={step.num}
                step={step}
                Icon={Icon}
                delay={`${i * 0.09}s`}
                index={i}
                total={PROCESS.length}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

function WPStepZigzag({
  step,
  Icon,
  isTop,
  delay,
  index,
  total,
}: {
  step: (typeof PROCESS)[number];
  Icon: React.ElementType;
  isTop: boolean;
  delay: string;
  index: number;
  total: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVis(true);
          obs.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className="relative" style={{ height: 220, marginTop: index === 0 ? 0 : -60 }}>
      <div
        data-visible={vis}
        className={`wp-step ${isTop ? "wp-top" : "wp-bot"} absolute w-[44%]`}
        style={{
          [isTop ? "right" : "left"]: "54%",
          ...(isTop ? { top: 0 } : { bottom: 0 }),
          animationDelay: delay,
        }}
      >
        <div
          className="rounded-2xl p-5 h-full"
          style={{
            background: "#f9fafb",
            border: "1px solid #e5e7eb",
            boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
          }}
        >
          <div className="flex items-center gap-3 mb-3">
            <span
              className="flex h-9 w-9 items-center justify-center rounded-full font-display text-sm font-bold shrink-0"
              style={{ background: "#B3D133", color: "#1e2a3a" }}
            >
              {step.num}
            </span>
            <Icon className="h-4 w-4 text-gray-400" />
          </div>
          <h3 className="text-sm font-bold text-sd-navy leading-snug mb-1.5">{step.title}</h3>
          <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">{step.desc}</p>
        </div>
      </div>
      <div
        data-visible={vis}
        className="wp-dot absolute left-1/2 -translate-x-1/2"
        style={{ top: isTop ? "auto" : 0, bottom: isTop ? 0 : "auto", animationDelay: delay }}
      >
        <div
          className="h-5 w-5 rounded-full border-4 border-white"
          style={{ background: "#B3D133", boxShadow: "0 0 0 3px rgba(179,209,51,0.25)" }}
        />
      </div>
      <div
        className="absolute left-1/2 -translate-x-1/2"
        style={{
          width: "calc(44% + 10px)",
          height: 2,
          background: "rgba(179,209,51,0.3)",
          top: isTop ? "auto" : 10,
          bottom: isTop ? 10 : "auto",
          [isTop ? "right" : "left"]: "50%",
          transformOrigin: "left center",
        }}
      />
    </div>
  );
}

function WPStepMobile({
  step,
  Icon,
  delay,
  index,
  total,
}: {
  step: (typeof PROCESS)[number];
  Icon: React.ElementType;
  delay: string;
  index: number;
  total: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVis(true);
          obs.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  const isLast = index === total - 1;
  return (
    <div ref={ref} className="relative flex gap-4 pb-6">
      <div className="flex flex-col items-center shrink-0" style={{ width: 36 }}>
        <div
          data-visible={vis}
          className="wp-dot h-9 w-9 rounded-full border-4 border-white flex items-center justify-center font-display text-xs font-bold shrink-0"
          style={{
            background: "#B3D133",
            color: "#1e2a3a",
            boxShadow: "0 0 0 3px rgba(179,209,51,0.22)",
            animationDelay: delay,
          }}
        >
          {step.num}
        </div>
        {!isLast && (
          <div
            className="flex-1 w-0.5 mt-2"
            style={{ background: "rgba(179,209,51,0.3)", minHeight: 24 }}
          />
        )}
      </div>
      <div
        data-visible={vis}
        className="wp-step wp-mob flex-1 rounded-2xl p-5"
        style={{
          background: "#f9fafb",
          border: "1px solid #e5e7eb",
          boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
          animationDelay: delay,
        }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Icon className="h-4 w-4 text-gray-400" />
          <h3 className="text-sm font-bold text-sd-navy leading-snug">{step.title}</h3>
        </div>
        <p className="text-xs text-gray-500 leading-relaxed">{step.desc}</p>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Before / After Carousel                                           */
/* ---------------------------------------------------------------- */
type ShowcasePair = {
  before: string;
  after: string;
  beforeAlt: string;
  afterAlt: string;
  title: string;
  description: string;
};
const SHOWCASE_PAIRS: ReadonlyArray<ShowcasePair> = BEFORE_AFTER_PAIRS.map((p, i) => {
  const project = PROJECTS_SORTED.find((proj) => proj.src === p.after);
  return {
    ...p,
    title: project?.title ?? `Real Project #${i + 1}`,
    description:
      project?.description ??
      "Full exterior transformation by Siding Depot — windows, trim and finishing.",
  };
});

function BeforeAfterCarousel() {
  const [index, setIndex] = useState(0);
  const total = SHOWCASE_PAIRS.length;
  const current = SHOWCASE_PAIRS[index];
  const next = useCallback(() => setIndex((i) => (i + 1) % total), [total]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + total) % total), [total]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);
  if (!current) return null;
  return (
    <section style={{ background: "#1e2a3a" }} className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-14">
          <div>
            <span
              className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4"
              style={{ background: "rgba(179,209,51,0.12)", color: "#B3D133" }}
            >
              Real Projects
            </span>
            <h2 className="font-display text-4xl sm:text-5xl text-white leading-tight">
              Before & After.
              <br />
              <span style={{ color: "#B3D133" }}>See the difference.</span>
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={prev}
              aria-label="Previous"
              className="h-12 w-12 rounded-full flex items-center justify-center transition-colors hover:bg-white/10"
              style={{ border: "1px solid rgba(255,255,255,0.15)" }}
            >
              <ArrowLeft className="h-4 w-4 text-white" />
            </button>
            <span className="text-sm text-white/40 font-mono">
              {index + 1}/{total}
            </span>
            <button
              type="button"
              onClick={next}
              aria-label="Next"
              className="h-12 w-12 rounded-full flex items-center justify-center transition-colors hover:bg-white/10"
              style={{ border: "1px solid rgba(255,255,255,0.15)" }}
            >
              <ArrowRight className="h-4 w-4 text-white" />
            </button>
          </div>
        </div>
        <div className="grid lg:grid-cols-[1.6fr_1fr] gap-10 items-start">
          <div className="rounded-2xl overflow-hidden shadow-2xl">
            <BeforeAfterSlider
              key={index}
              before={current.before}
              after={current.after}
              beforeAlt={current.beforeAlt}
              afterAlt={current.afterAlt}
            />
          </div>
          <div className="flex flex-col justify-center py-4">
            <div className="flex items-center gap-2 mb-8">
              {SHOWCASE_PAIRS.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Project ${i + 1}`}
                  className="rounded-full transition-all"
                  style={{
                    width: i === index ? 24 : 8,
                    height: 8,
                    background: i === index ? "#B3D133" : "rgba(255,255,255,0.2)",
                  }}
                />
              ))}
            </div>
            <h3 className="font-display text-3xl text-white leading-tight mb-4">{current.title}</h3>
            <p className="text-white/55 leading-relaxed">{current.description}</p>
            <div className="mt-8 flex flex-col gap-3">
              <Link
                to="/projects"
                search={{ page: 1, tag: "All" }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all hover:scale-105"
                style={{ background: "#B3D133", color: "#1e2a3a" }}
              >
                See All Projects <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm text-white transition-colors hover:bg-white/8"
                style={{ border: "1px solid rgba(255,255,255,0.2)" }}
              >
                Get a Free Window Quote
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- */
/* Why Us Section                                                     */
/* ---------------------------------------------------------------- */
const WHY_US = [
  {
    Icon: Zap,
    title: "Energy Star Certified Installer",
    desc: "We're authorized to install and certify Energy Star rated windows — unlocking federal and Georgia energy rebates your project may qualify for. Most installers can't offer this.",
  },
  {
    Icon: ShieldCheck,
    title: "In-House Installers — Zero Subcontracting",
    desc: "Every window is installed by a Siding Depot in-house employee — trained, certified, and insured. We never hand your project to a subcontractor the day it starts.",
  },
  {
    Icon: Thermometer,
    title: "Built for Georgia's Heat & Humidity",
    desc: "Low-E double-pane glass with argon-gas fill blocks Georgia's radiant heat and keeps humidity out. Not a Northern-spec window installed in the South — the right product for your climate.",
  },
  {
    Icon: FileText,
    title: "Written Estimates — Locked Price",
    desc: "Detailed, itemized written estimate before any work begins. The number we quote is the number you pay — no change orders, no mid-project surprises.",
  },
  {
    Icon: Eye,
    title: "Precision Measurement & Custom Order",
    desc: "Every opening is measured twice. Every window is custom-ordered to your exact dimensions. No field-cutting, no shimming to cover a bad fit. The window fits because we measured right.",
  },
  {
    Icon: Wind,
    title: "15-Year Workmanship Warranty",
    desc: "Our installation warranty covers air infiltration, seal failure, and operational defects for 15 years — on top of the manufacturer's glass and frame coverage. The most complete window warranty in North Atlanta.",
  },
] as const;

function WindowsWhyUsSection() {
  return (
    <section className="py-24 lg:py-32 bg-white">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid lg:grid-cols-[1fr_1.4fr] gap-16 items-start">
          <div className="lg:sticky lg:top-28">
            <span
              className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-5"
              style={{ background: "#eef7c0", color: SD_LIME_TEXT }}
            >
              Why Siding Depot
            </span>
            <h2 className="font-display text-4xl sm:text-5xl text-sd-navy leading-tight">
              Six Reasons North Atlanta Homeowners Choose Us For Windows.
            </h2>
            <p className="mt-5 text-gray-500 leading-relaxed">
              We're not the cheapest window installer in the area. We're the one that actually
              delivers the energy savings the manufacturer promises.
            </p>
            <img
              src="/projects/project-3.webp"
              alt="Siding Depot window installation team"
              className="mt-8 rounded-2xl w-full object-cover shadow-lg"
              style={{ aspectRatio: "4/3" }}
              loading="lazy"
            />
          </div>
          <div className="flex flex-col gap-5">
            {WHY_US.map((item, i) => {
              const Icon = item.Icon;
              return (
                <div
                  key={item.title}
                  className="flex gap-5 p-5 rounded-2xl transition-colors hover:bg-gray-50"
                  style={{ border: "1px solid #e5e7eb" }}
                >
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                    style={{ background: "#eef7c0" }}
                  >
                    <Icon className="h-5 w-5" style={{ color: SD_LIME_TEXT }} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-gray-300 font-mono">0{i + 1}</span>
                      <h3 className="text-base font-bold text-sd-navy">{item.title}</h3>
                    </div>
                    <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- */
/* CTA Section                                                        */
/* ---------------------------------------------------------------- */
function WindowsCtaSection() {
  return (
    <section className="py-24 lg:py-32 bg-white overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden" style={{ background: "#1e2a3a" }}>
          <div
            aria-hidden
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 50%, rgba(179,209,51,0.15) 0%, transparent 60%), radial-gradient(circle at 80% 20%, rgba(179,209,51,0.08) 0%, transparent 50%)",
            }}
          />
          <div className="relative grid lg:grid-cols-2 gap-0 items-center">
            <div className="relative h-72 lg:h-full min-h-[400px] overflow-hidden">
              <img
                src="/projects/project-4.webp"
                alt="Beautiful home with new windows installed by Siding Depot"
                className="absolute inset-0 h-full w-full object-cover"
                style={{ objectPosition: "center top" }}
                loading="lazy"
              />
              <div
                className="absolute inset-0 lg:hidden"
                style={{ background: "linear-gradient(to top, #1e2a3a 0%, transparent 60%)" }}
                aria-hidden
              />
              <div
                className="absolute inset-0 hidden lg:block"
                style={{ background: "linear-gradient(to right, transparent 60%, #1e2a3a 100%)" }}
                aria-hidden
              />
            </div>
            <div className="relative px-8 py-12 lg:pl-4 lg:pr-12">
              <span
                className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-6"
                style={{ background: "rgba(179,209,51,0.12)", color: "#B3D133" }}
              >
                Free Assessment
              </span>
              <h2 className="font-display text-4xl sm:text-5xl text-white leading-tight mb-5">
                Find Out How Much
                <br />
                <span style={{ color: "#B3D133" }}>Your Windows Are Costing You.</span>
              </h2>
              <p className="text-white/65 leading-relaxed mb-4">
                Old windows with failed seals and no Low-E coating can add 20–31% to your summer
                cooling bill. Our free in-home assessment identifies exactly which windows are
                performing and which are quietly draining your energy — with no obligation to buy.
              </p>
              <p className="text-white/65 leading-relaxed mb-8">
                We respond within 24 hours, come to you on your schedule, and deliver a written
                report at no charge.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-base transition-all hover:scale-105"
                  style={{ background: "#B3D133", color: "#1e2a3a" }}
                >
                  Book My Free Assessment <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href={SITE.phoneHref}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-base text-white transition-all hover:bg-white/10"
                  style={{ border: "2px solid rgba(255,255,255,0.2)" }}
                >
                  <Phone className="h-4 w-4" /> {SITE.phone}
                </a>
              </div>
              <div className="mt-8 flex flex-wrap gap-5">
                {["No-obligation assessment", "Written energy report", "Energy Star certified"].map(
                  (t) => (
                    <div key={t} className="flex items-center gap-1.5 text-xs text-white/50">
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0" style={{ color: "#B3D133" }} />
                      {t}
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- */
/* FAQs                                                               */
/* ---------------------------------------------------------------- */
const FAQ_ITEMS = [
  {
    q: "How do I know if my windows need to be replaced?",
    a: "Key signs include drafts near the frame even when closed, condensation between the glass panes (failed seal), difficulty opening or closing, visible rot or warping in wood frames, and energy bills that spike in summer. During your free assessment we check all of these and give you a written report — so you know exactly which windows are failing before you spend anything.",
  },
  {
    q: "What window brands does Siding Depot install?",
    a: "We primarily install Simonton and PGT windows — both Energy Star rated and purpose-engineered for the Southeast's heat and humidity. For customers who want a premium upgrade, we also offer triple-pane options with superior sound attenuation and thermal performance. We recommend the right product for your budget and performance goals — not the most expensive one.",
  },
  {
    q: "Can new windows really reduce my energy bill?",
    a: "Yes — measurably. Energy Star certified double-pane Low-E windows can reduce solar heat gain by up to 75% compared to single-pane clear glass. In a Georgia summer, that translates to a 20–31% reduction in cooling load. Actual savings depend on your existing windows, insulation, and HVAC efficiency, but most North Atlanta homeowners see a meaningful difference within the first summer.",
  },
  {
    q: "How long does a window replacement take?",
    a: "A typical residential project of 10–15 windows takes 1–2 days. We custom-order every window in advance, so installation day is focused entirely on the install — not waiting on materials. Interior and exterior trim is finished the same day, so your home is fully buttoned up before we leave.",
  },
  {
    q: "What warranty comes with a Siding Depot window installation?",
    a: "Two layers of coverage: the manufacturer's warranty covers glass (Low-E coating, seal, argon fill) and frame for 20–30 years depending on the product. Our installation warranty covers workmanship — air infiltration, seal failure, operational issues — for 15 years. If anything goes wrong with how we installed it, we fix it. In writing.",
  },
  {
    q: "Will new windows impact my home's resale value?",
    a: "Yes. Remodeling Magazine's annual Cost vs. Value report consistently shows window replacement in the top tier for resale ROI in the Southeast — partly because buyers can see and feel the difference, and partly because Energy Star certification is a marketable feature that shows up on listings. It's one of the few upgrades that pays back at sale.",
  },
] as const;

/* ---------------------------------------------------------------- */
/* Page Assembly                                                      */
/* ---------------------------------------------------------------- */
function WindowsPage() {
  const { reviewsData } = Route.useLoaderData();
  const mappedReviews = reviewsData?.reviews?.length
    ? reviewsData.reviews
        .filter((r) => r.text)
        .map((r) => ({
          author_name: r.author_name,
          rating: r.rating,
          text: r.text as string,
          relative_time_description: r.relative_time_description ?? "",
          author_photo_url: r.author_photo_url ?? undefined,
        }))
    : undefined;
  return (
    <div className="flex flex-col">
      <WindowsHero />
      <ProofBar />
      <WindowsStatsBar />
      <SupplierBrandSection
        cfg={{
          logoSrc: "/logos/simonton.png",
          logoAlt: "Simonton Windows & Doors Logo",
          logoTagline: "★ AAMA GOLD LABEL CERTIFIED",
          sectionEyebrow: "Certified Window Supplier",
          sectionHeadline: "The Credentials That Back Your Windows.",
          sectionBody:
            "Simonton windows carry a Lifetime Limited Warranty on frames and sashes — the industry's strongest frame coverage — plus AAMA Gold Label certification, the highest quality standard in the fenestration industry.",
          cardEyebrow: "Simonton® — AAMA Gold Label Certified",
          cardHeadline: "The highest designation AAMA awards.",
          body1:
            "AAMA Gold Label is the top quality certification available for window and door manufacturers — independently verifying that every Simonton product meets or exceeds the most rigorous performance standards in the industry. It's renewed, not just awarded once.",
          body2:
            "What it means for you: a Lifetime Limited Warranty on vinyl frames, sashes, and working parts, plus 15-year coverage on the insulating glass unit against internal obstruction. The warranty is transferable to the next homeowner, adding documented resale value.",
          stats: [
            { val: "Lifetime", desc: "frame & sash warranty" },
            { val: "15 Years", desc: "insulating glass unit" },
            { val: "Transferable", desc: "to next homeowner" },
          ],
          cards: [
            {
              name: "Frame Warranty",
              value: "Lifetime",
              detail: "Vinyl frames & sashes for original homeowner",
            },
            {
              name: "Glass Unit (IGU)",
              value: "15 Years",
              detail: "Internal obstruction of vision coverage",
            },
            {
              name: "Working Parts",
              value: "Lifetime",
              detail: "Hardware and operating components",
            },
            {
              name: "Warranty Transfer",
              value: "Yes",
              detail: "Transferable to next homeowner upon sale",
            },
            {
              name: "Quality Standard",
              value: "AAMA Gold",
              detail: "Industry's highest certification",
            },
          ],
        }}
      />
      <WindowTypesSection />
      {/* WindowsProcess removido — a seção "How It Works" existe apenas na home */}
      <BeforeAfterCarousel />
      <GoogleReviewsCarousel reviews={mappedReviews} />
      <WindowsWhyUsSection />
      <RelatedServices />
      <WindowsCtaSection />
      <FaqSection items={FAQ_ITEMS} title="Window questions," />
    </div>
  );
}
