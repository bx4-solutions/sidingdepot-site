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
} from "lucide-react";
import { BeforeAfterSlider } from "@/components/site/BeforeAfterSlider";
import { FaqSection } from "@/components/site/FaqSection";
import { BEFORE_AFTER_PAIRS, PROJECTS_SORTED, SITE } from "@/data/site";
import { SERVICE_METADATA_AB } from "@/data/seo-config";
import { getFaqSchema } from "@/lib/schema";
import { serviceJsonLd } from "@/components/site/ServiceLandingPage";
import sidingHouseHeroAsset from "@/assets/siding-house-hero-pool.jpg";
import sidingInstallationCrews from "@/assets/siding-installation-crews.png";
import jamesHardieBadge from "@/assets/james-hardie-elite-badge.png";
import { GoogleReviewsCarousel } from "@/components/site/GoogleReviewsCarousel";
import { EliteBadgeSection } from "@/components/site/EliteBadgeSection";
import { useGoogleStats } from "@/lib/google-stats-context";

// Brand palette — used by inline sections in this file
const SD_NAVY = "#1e2a3a";
const SD_LIME = "#B3D133";
const SD_LIME_TEXT = "#3C4A07";

const SERVICE_KEY = "siding";
const CITY = "Marietta & North Atlanta";
const seo = SERVICE_METADATA_AB[SERVICE_KEY].A;
const HERO_IMAGE = sidingHouseHeroAsset;
const OG_IMAGE = "https://sidingdepot.com/og-default.webp"; // absolute for OG crawlers

export const Route = createFileRoute("/siding")({
  loader: async () => {
    const reviewsData = await getGoogleReviews();
    return { reviewsData };
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
      { rel: "canonical", href: "https://sidingdepot.com/siding" },
      { rel: "preload", as: "image", href: HERO_IMAGE, fetchPriority: "high" as any },
    ],
    scripts: [
      serviceJsonLd("James Hardie Siding Installation", seo.metaDesc, {
        canonical: "https://sidingdepot.com/siding",
        image: HERO_IMAGE,
        serviceType: "James Hardie Siding Installation",
      }),
      {
        type: "application/ld+json",
        children: JSON.stringify(getFaqSchema(FAQ_ITEMS)),
      },
    ],
  }),
  component: SidingPage,
});

/* ---------------------------------------------------------------- */
/* useCountUp — animate numbers when entering viewport               */
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

    // If already in viewport on mount, animate immediately
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) animate();

    return () => observer.disconnect();
  }, [target, duration]);

  return { ref, count };
}

/* ---------------------------------------------------------------- */
/* Hero — cinematic full-bleed                                       */
/* ---------------------------------------------------------------- */
function SidingHero() {
  return (
    <section className="relative isolate overflow-hidden" style={{ minHeight: "92vh" }}>
      <img
        src={HERO_IMAGE}
        alt="James Hardie siding installed on a beautiful North Atlanta home"
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
        style={{ objectPosition: "center 30%" }}
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
              <Award className="h-3 w-3" /> Elite Preferred — Top 2% US Installers
            </span>
          </div>

          <h1 className="font-display text-white leading-[0.9] text-4xl sm:text-5xl lg:text-7xl xl:text-8xl">
            James Hardie
            <br />
            <span style={{ color: "#B3D133" }}>Siding Done</span>
            <br />
            Right.
          </h1>

          <p className="mt-6 text-lg text-white/75 leading-relaxed max-w-2xl mx-auto">
            Among the top 2% of James Hardie Elite Preferred contractors nationwide — with W-2
            crews, a 30-year non-prorated warranty, and 1,500+ projects completed across Marietta,
            Canton and North Atlanta.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-base transition-all hover:scale-105 active:scale-100"
              style={{ background: "#B3D133", color: "#1e2a3a" }}
            >
              Get My Free Quote <ArrowRight className="h-4 w-4" />
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
/* Trust Strip — all credentials in one horizontal bar              */
/* ---------------------------------------------------------------- */
function TrustStrip() {
  const { rating, totalReviews } = useGoogleStats();
  const items = [
    {
      label: "James Hardie",
      sublabel: "Elite Preferred Contractor",
      badge: true,
    },
    {
      label: "4.7★",
      sublabel: "261 GuildQuality Reviews",
      href: "https://www.guildquality.com/profile/siding-depot-llc",
    },
    {
      label: `${rating}★`,
      sublabel: `${totalReviews} Google Reviews`,
      href: "https://www.google.com/search?q=Siding+Depot+Marietta+GA+reviews",
    },
    {
      label: "4.9★",
      sublabel: "91 Thumbtack Reviews",
      href: "https://www.thumbtack.com/ga/marietta/vinyl-siding-install/siding-depot-llc/service/482073672544780291",
    },
    {
      label: "GreenSky®",
      sublabel: "0% APR Financing",
    },
    {
      label: "Guildmember",
      sublabel: "Since 2019",
    },
  ];

  return (
    <div style={{ background: "#1e2a3a", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="flex flex-wrap items-center justify-center lg:justify-between gap-x-8 gap-y-0 py-0">
          {items.map((item, i) => {
            const inner = (
              <div
                key={item.label}
                className="flex items-center gap-3 py-4 px-2"
                style={{
                  borderRight: i < items.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
                }}
              >
                {item.badge ? (
                  <img
                    src={jamesHardieBadge}
                    alt="James Hardie Elite Preferred Contractor"
                    className="h-10 w-auto object-contain"
                    loading="eager"
                  />
                ) : (
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-black"
                    style={{ background: "rgba(179,209,51,0.12)", color: "#B3D133" }}
                  >
                    {item.label.includes("★") ? "★" : item.label.charAt(0)}
                  </div>
                )}
                <div>
                  {!item.badge && (
                    <p className="text-sm font-bold text-white leading-none">{item.label}</p>
                  )}
                  <p className="text-xs text-white/45 leading-none mt-0.5">{item.sublabel}</p>
                </div>
              </div>
            );

            return item.href ? (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
              >
                {inner}
              </a>
            ) : (
              <div key={item.label}>{inner}</div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Stats bar                                                          */
/* ---------------------------------------------------------------- */
const STATS_DATA = [
  { value: 1500, suffix: "+", label: "Homes Transformed" },
  { value: 30, suffix: "-Year", label: "Hardie Warranty" },
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

function SidingStatsBar() {
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
/* Elite Authority Section                                           */
/* ---------------------------------------------------------------- */
function EliteAuthoritySection() {
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
            alt="Siding Depot W-2 crew installing James Hardie siding in North Atlanta"
            className="relative rounded-2xl w-full object-cover shadow-2xl"
            style={{ aspectRatio: "4/3" }}
            loading="lazy"
          />
          <div
            className="absolute -bottom-6 -right-4 rounded-2xl px-6 py-4 shadow-xl text-center"
            style={{ background: "#1e2a3a", border: "1px solid rgba(179,209,51,0.3)" }}
          >
            <p className="font-display text-4xl" style={{ color: "#B3D133" }}>
              Top 2%
            </p>
            <p className="text-xs text-white/60 uppercase tracking-widest font-bold mt-0.5">
              US Installers
            </p>
          </div>
        </div>

        <div>
          <span
            className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-5"
            style={{ background: "#eef7c0", color: SD_LIME_TEXT }}
          >
            Why Elite Preferred Matters
          </span>
          <h2 className="font-display text-4xl sm:text-5xl text-sd-navy leading-tight">
            Most Contractors Can't Offer
            <br />
            <span style={{ color: SD_LIME_TEXT }}>This Warranty.</span>
          </h2>
          <p className="mt-6 text-gray-600 leading-relaxed text-lg">
            James Hardie's Elite Preferred status is awarded to fewer than 2% of US installers. It's
            not a marketing badge — it's a quality certification that unlocks the
            <strong> 30-year non-prorated warranty</strong> covering both materials <em>and</em>{" "}
            labor.
          </p>
          <p className="mt-4 text-gray-600 leading-relaxed">
            Standard contractors offer a basic 15-year prorated warranty. That means after year 5,
            your coverage is already reduced. Ours isn't. Every Siding Depot project is covered in
            full for 30 years — because we're certified to deliver it.
          </p>

          <div className="mt-8 rounded-xl overflow-hidden border border-gray-200 overflow-x-auto">
            <div className="min-w-[340px]">
              <div className="grid grid-cols-3 text-xs font-bold uppercase tracking-wider bg-gray-50 px-3 py-3 text-gray-500">
                <span>Factor</span>
                <span className="text-center">Standard</span>
                <span className="text-center" style={{ color: SD_LIME_TEXT }}>
                  Elite Preferred
                </span>
              </div>
              {[
                ["Warranty", "15-yr prorated", "30-yr full"],
                ["Crews", "Subcontracted", "W-2 employees"],
                ["Training", "Basic", "Hardie certified"],
                ["Oversight", "Optional PM", "On-site PM"],
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
            Schedule Free Estimate <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- */
/* Siding Types — premium photo cards                                */
/* ---------------------------------------------------------------- */
const SIDING_TYPES = [
  {
    id: "board-batten",
    title: "Board & Batten",
    subtitle: "Vertical drama — modern farmhouse",
    image: "/projects/project-1.webp",
    description:
      "Long vertical boards joined by narrow battens. Adds vertical drama and farmhouse character — perfect for full elevations or accent walls.",
  },
  {
    id: "plank",
    title: "HardiePlank Lap",
    subtitle: "Classic American — most popular",
    image: "/projects/project-3.webp",
    description:
      "The most popular choice in North Atlanta. Horizontal planks with classic Cedarmill texture — durable, weather-resistant, timeless.",
  },
  {
    id: "shingle",
    title: "Shingle / Shake",
    subtitle: "Craftsman warmth — gables & dormers",
    image: "/projects/project-4.webp",
    description:
      "Overlapping shingles inspired by cedar shake. Adds warmth and craftsman character — ideal for gables, dormers and entryways.",
  },
  {
    id: "trim",
    title: "Soffit, Trim & Fascia",
    subtitle: "The finishing touch — often overlooked",
    image: "/projects/project-2.webp",
    description:
      "Critical but overlooked: soffit, trim and fascia regulate attic ventilation, finish rooflines, and seal out pests. Installed to match your siding perfectly.",
  },
];

function SidingTypesSection() {
  const [active, setActive] = useState<string | null>(null);
  const activeType = SIDING_TYPES.find((t) => t.id === active);

  return (
    <section className="py-24 lg:py-32" style={{ background: "#1e2a3a" }}>
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="max-w-2xl mb-14">
          <span
            className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4"
            style={{ background: "rgba(179,209,51,0.12)", color: "#B3D133" }}
          >
            Siding Products
          </span>
          <h2 className="font-display text-4xl sm:text-5xl text-white leading-tight">
            Four James Hardie Systems.
            <br />
            One Right Choice For Your Home.
          </h2>
          <p className="mt-5 text-white/55 leading-relaxed">
            Every product is HardieZone® HZ10 — engineered specifically for Georgia's heat,
            humidity, and storm cycles. Click to explore each style.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SIDING_TYPES.map((t) => {
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
/* Process — 7 detailed steps                                        */
/* ---------------------------------------------------------------- */
const PROCESS = [
  {
    num: "01",
    title: "Free On-Site Consultation",
    desc: "We come to your home, measure the full exterior, and inspect existing conditions. You receive a written itemized estimate — usually same day. No pressure, no obligation.",
    icon: Users,
  },
  {
    num: "02",
    title: "Written Proposal — Price Locked",
    desc: "The number in your estimate is the number you pay. Fully itemized: materials, labor, tearoff, moisture barrier. No surprise change orders.",
    icon: FileText,
  },
  {
    num: "03",
    title: "Full Siding Tearoff",
    desc: "We remove all existing cladding — hardboard, cedar, T1-11, stucco, or aluminum — down to the sheathing. This exposes the full surface and sets the stage for a correct install.",
    icon: ShieldCheck,
  },
  {
    num: "04",
    title: "Sheathing & Framing Inspection",
    desc: "With the old siding off, we inspect sheathing and framing for moisture damage, rot, or mold. Any issues are addressed before a single new board goes up.",
    icon: ShieldCheck,
  },
  {
    num: "05",
    title: "Moisture Barrier Installation",
    desc: "A weather-resistant house wrap goes over the sheathing — your home's last line of defense against moisture infiltration in Georgia's heavy rain season.",
    icon: ShieldCheck,
  },
  {
    num: "06",
    title: "Window & Door Reflashing",
    desc: "Windows and doors are the most common water entry points. We reflash every opening before siding goes up — one of the most overlooked steps that cheaper contractors skip.",
    icon: ShieldCheck,
  },
  {
    num: "07",
    title: "Hardie Install + Final Walkthrough",
    desc: "James Hardie siding goes up using certified fasteners, spacing, and gapping per manufacturer specs. After caulk, seal, and trim, we walk the finished project with you — and hand you the 30-year warranty in writing.",
    icon: Award,
  },
];

function SidingProcess() {
  return (
    <section className="py-24 lg:py-32 bg-white overflow-hidden">
      <style>{`
        @keyframes sp-fade-up   { from { opacity:0; transform:translateY(32px);  } to { opacity:1; transform:translateY(0);   } }
        @keyframes sp-fade-down { from { opacity:0; transform:translateY(-32px); } to { opacity:1; transform:translateY(0);   } }
        @keyframes sp-fade-left { from { opacity:0; transform:translateX(32px);  } to { opacity:1; transform:translateX(0);  } }
        @keyframes sp-dot-pop   { from { opacity:0; transform:scale(0);          } to { opacity:1; transform:scale(1);        } }
        .sp-step[data-visible="true"].sp-top  { animation: sp-fade-up   0.6s ease both; }
        .sp-step[data-visible="true"].sp-bot  { animation: sp-fade-down 0.6s ease both; }
        .sp-step[data-visible="true"].sp-mob  { animation: sp-fade-left 0.6s ease both; }
        .sp-dot[data-visible="true"]          { animation: sp-dot-pop   0.4s ease both; }
        .sp-step, .sp-dot { opacity: 0; }
      `}</style>

      <div className="mx-auto max-w-6xl px-4 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span
            className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4"
            style={{ background: "#eef7c0", color: SD_LIME_TEXT }}
          >
            Our Process
          </span>
          <h2 className="font-display text-4xl sm:text-5xl text-sd-navy leading-tight">
            7 Steps. Zero Shortcuts.
          </h2>
          <p className="mt-4 text-gray-500 leading-relaxed">
            Most contractors skip steps 4, 5, and 6. We don't — because that's where siding failures
            begin.
          </p>
        </div>

        {/* ── Desktop zigzag (lg+) ── */}
        <div className="hidden lg:block relative">
          {/* Central spine line */}
          <div
            className="absolute left-1/2 -translate-x-1/2 top-[88px] bottom-[88px] w-0.5"
            style={{
              background: "linear-gradient(to bottom, #B3D133 0%, #D4EC5A 50%, #B3D133 100%)",
              opacity: 0.35,
            }}
          />

          {PROCESS.map((step, i) => {
            const Icon = step.icon;
            const isTop = i % 2 === 0; // even → card on top row
            const delay = `${i * 0.11}s`;

            return (
              <ProcessStepZigzag
                key={step.num}
                step={step}
                Icon={Icon}
                isTop={isTop}
                delay={delay}
                index={i}
                total={PROCESS.length}
              />
            );
          })}
        </div>

        {/* ── Mobile / tablet stacked (< lg) ── */}
        <div className="lg:hidden flex flex-col gap-0">
          {PROCESS.map((step, i) => {
            const Icon = step.icon;
            const delay = `${i * 0.09}s`;
            return (
              <ProcessStepMobile
                key={step.num}
                step={step}
                Icon={Icon}
                delay={delay}
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

/* ── Zigzag card (desktop) ── */
function ProcessStepZigzag({
  step,
  Icon,
  isTop,
  delay,
  index,
  total,
}: {
  step: (typeof PROCESS)[0];
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

  const pct = (index / (total - 1)) * 100;

  return (
    <div ref={ref} className="relative" style={{ height: 220, marginTop: index === 0 ? 0 : -60 }}>
      {/* Card — alternates left/right half */}
      <div
        data-visible={vis}
        className={`sp-step ${isTop ? "sp-top" : "sp-bot"} absolute w-[44%]`}
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

      {/* Dot on spine */}
      <div
        data-visible={vis}
        className="sp-dot absolute left-1/2 -translate-x-1/2"
        style={{
          top: isTop ? "auto" : 0,
          bottom: isTop ? 0 : "auto",
          animationDelay: delay,
        }}
      >
        <div
          className="h-5 w-5 rounded-full border-4 border-white flex items-center justify-center"
          style={{ background: "#B3D133", boxShadow: "0 0 0 3px rgba(179,209,51,0.25)" }}
        />
      </div>

      {/* Connector arm from dot to card */}
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

/* ── Mobile stacked card ── */
function ProcessStepMobile({
  step,
  Icon,
  delay,
  index,
  total,
}: {
  step: (typeof PROCESS)[0];
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
      {/* Left spine */}
      <div className="flex flex-col items-center shrink-0" style={{ width: 36 }}>
        <div
          data-visible={vis}
          className="sp-dot h-9 w-9 rounded-full border-4 border-white flex items-center justify-center font-display text-xs font-bold shrink-0"
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

      {/* Card */}
      <div
        data-visible={vis}
        className="sp-step sp-mob flex-1 rounded-2xl p-5"
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
      "Full exterior transformation by Siding Depot — James Hardie siding, paint and trim.",
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
                Get a Free Quote
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- */
/* Why Hire Us                                                        */
/* ---------------------------------------------------------------- */
const HIRING_CHECKLIST = [
  {
    Icon: Award,
    title: "Elite Preferred — Top 2% in the US",
    desc: "One of the few certified Elite Preferred James Hardie installers in Cherokee and Cobb County. This status qualifies your project for the extended 30-year non-prorated warranty — not available from standard installers.",
  },
  {
    Icon: ShieldCheck,
    title: "W-2 Crews Only — No Subcontractors",
    desc: "Every crew member is a Siding Depot W-2 employee. Trained, background-checked, and insured. We never subcontract installs — period.",
  },
  {
    Icon: CheckCircle2,
    title: "Built for Georgia's Climate",
    desc: "HardieZone® HZ10 products engineered for Georgia's heat above 95°F, year-round humidity, and storm season. Not a generic install — a Georgia-specific solution.",
  },
  {
    Icon: FileText,
    title: "Written Estimates — Zero Surprises",
    desc: "Detailed written estimates before any work starts. The number in the estimate is the number you pay. No last-minute change orders.",
  },
  {
    Icon: Users,
    title: "Dedicated On-Site Project Manager",
    desc: "A Siding Depot project manager is on-site every day. You get a daily update — call or text — so you always know exactly what was done and what is next.",
  },
  {
    Icon: ShieldCheck,
    title: "30-Year Non-Prorated Warranty",
    desc: "As Elite Preferred installers, our projects qualify for James Hardie's extended warranty covering both materials and labor. The highest coverage in the industry.",
  },
] as const;

function WhyUsSection() {
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
              Six Reasons Marietta Homeowners Choose Us.
            </h2>
            <p className="mt-5 text-gray-500 leading-relaxed">
              We're not the cheapest contractor in North Atlanta. We're the one your neighbors call
              back to thank.
            </p>
            <img
              src={sidingInstallationCrews}
              alt="Siding Depot installation crew on a North Atlanta home"
              className="mt-8 rounded-2xl w-full object-cover shadow-lg"
              style={{ aspectRatio: "4/3" }}
              loading="lazy"
            />
          </div>

          <div className="flex flex-col gap-5">
            {HIRING_CHECKLIST.map((item, i) => {
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
/* Testimonials                                                       */
/* ---------------------------------------------------------------- */
// GoogleReviewsCarousel is imported from @/components/site/GoogleReviewsCarousel

const REVIEWS = [
  {
    name: "Ozzie S.",
    location: "Marietta, GA",
    stars: 5,
    text: "I had 4 different companies come to give me an estimate to test out their quality. Ruby from Siding Depot had the most descriptive and informative estimate. The price was very competitive and made me feel at ease. The product was done on time — no need for any returns to touch up any of the agreed work. I have contracted them for the remainder of the project.",
    source: "GuildQuality · Verified",
  },
  {
    name: "Season C.",
    location: "Woodstock, GA",
    stars: 5,
    text: "The people at Siding Depot made this busy mom extremely happy with the entire job. They did three projects on my house. Professional, friendly, and kept me up to date throughout the entire process. I never had to worry that something wasn't being done. They were extremely communicative. I would recommend them to anyone.",
    source: "GuildQuality · Verified",
  },
  {
    name: "Jason E.",
    location: "Marietta, GA",
    stars: 5,
    text: "Siding Depot worked with my wife and I to find the best solution to fit our budget for siding, painting, and gutters. The crews were amazing and kept everything clean. We were ecstatic with the results of the job on our house. If you need siding, call Siding Depot.",
    source: "GuildQuality · Verified",
  },
  {
    name: "Charles L.",
    location: "Acworth, GA",
    stars: 5,
    text: "They are superior in every way. We could not have asked for better cooperation with the siding and painting crews. We were so pleased with everything that has been done, we now have another project with them to put in new windows.",
    source: "GuildQuality · Verified",
  },
  {
    name: "William J.",
    location: "Kennesaw, GA",
    stars: 5,
    text: "They did a beautiful job and we would highly recommend them. We received several quotes and they are also a great value.",
    source: "GuildQuality · Verified",
  },
  {
    name: "Sam S.",
    location: "Roswell, GA",
    stars: 5,
    text: "Fantastic crew, great salespeople, and a wonderful company to work with!",
    source: "GuildQuality · Verified",
  },
] as const;

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-current" style={{ color: "#f59e0b" }} />
      ))}
    </div>
  );
}

function TestimonialsSection() {
  return (
    <section style={{ background: "#1e2a3a" }} className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-14">
          <div>
            <span
              className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4"
              style={{ background: "rgba(179,209,51,0.12)", color: "#B3D133" }}
            >
              What Homeowners Say
            </span>
            <h2 className="font-display text-4xl sm:text-5xl text-white leading-tight">
              4.7★ · 261 Reviews.
              <br />
              <span style={{ color: "#B3D133" }}>Real customers. Real projects.</span>
            </h2>
          </div>
          <a
            href="https://www.guildquality.com/profile/siding-depot-llc"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold text-white shrink-0 transition-colors hover:bg-white/8"
            style={{ border: "1px solid rgba(255,255,255,0.2)" }}
          >
            All Reviews <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {REVIEWS.map((r) => (
            <div
              key={r.name}
              className="flex flex-col gap-4 rounded-2xl p-6"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <StarRating count={r.stars} />
              <p className="text-white/75 text-sm leading-relaxed flex-1">"{r.text}"</p>
              <div className="flex items-end justify-between gap-2">
                <div>
                  <p className="text-white font-bold text-sm">{r.name}</p>
                  <p className="text-white/40 text-xs">{r.location}</p>
                </div>
                <span
                  className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0"
                  style={{ background: "rgba(179,209,51,0.12)", color: "#B3D133" }}
                >
                  {r.source}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- */
/* Design Consultation CTA (replaces pricing)                        */
/* ---------------------------------------------------------------- */
function DesignConsultationSection() {
  return (
    <section className="py-24 lg:py-32 bg-white overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden" style={{ background: "#1e2a3a" }}>
          {/* Background texture */}
          <div
            aria-hidden
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 50%, rgba(179,209,51,0.15) 0%, transparent 60%), radial-gradient(circle at 80% 20%, rgba(179,209,51,0.08) 0%, transparent 50%)",
            }}
          />

          <div className="relative grid lg:grid-cols-2 gap-0 items-center">
            {/* Left — image */}
            <div className="relative h-72 lg:h-full min-h-[400px] overflow-hidden">
              <img
                src="/projects/project-1.webp"
                alt="James Hardie siding transformation — Siding Depot North Atlanta"
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

            {/* Right — copy */}
            <div className="relative px-8 py-12 lg:pl-4 lg:pr-12">
              <span
                className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-6"
                style={{ background: "rgba(179,209,51,0.12)", color: "#B3D133" }}
              >
                Free Consultation
              </span>
              <h2 className="font-display text-4xl sm:text-5xl text-white leading-tight mb-5">
                See What Your Home
                <br />
                <span style={{ color: "#B3D133" }}>Could Look Like.</span>
              </h2>
              <p className="text-white/65 leading-relaxed mb-4">
                Before committing to a siding project, you want to know what you're getting. Our
                team walks you through siding styles, colors, and trim combinations for your
                specific home — with photo references from similar projects in your neighborhood.
              </p>
              <p className="text-white/65 leading-relaxed mb-8">
                Schedule a free consultation. We'll bring the ideas, you make the call.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-base transition-all hover:scale-105"
                  style={{ background: "#B3D133", color: "#1e2a3a" }}
                >
                  Book Free Consultation <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href={SITE.phoneHref}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-base text-white transition-all hover:bg-white/10"
                  style={{ border: "2px solid rgba(255,255,255,0.2)" }}
                >
                  <Phone className="h-4 w-4" /> {SITE.phone}
                </a>
              </div>

              {/* Trust mini-badges */}
              <div className="mt-8 flex flex-wrap gap-5">
                {[
                  "No obligation",
                  "Response within 24 hours",
                  "W-2 crews · Never subcontracted",
                ].map((t) => (
                  <div key={t} className="flex items-center gap-1.5 text-xs text-white/50">
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0" style={{ color: "#B3D133" }} />
                    {t}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- */
/* FAQ items                                                          */
/* ---------------------------------------------------------------- */
const FAQ_ITEMS = [
  {
    q: "How do I get a quote for James Hardie siding in Marietta or Canton, GA?",
    a: "Contact us online or call us directly. We come to your home for a free on-site consultation, measure the full exterior, and deliver a written itemized estimate — usually the same day. No obligation, no pressure.",
  },
  {
    q: "What is the best siding for Georgia's climate?",
    a: "James Hardie fiber cement siding is the top choice for Georgia. Specifically, the HardieZone® HZ10 system is engineered for the heat, humidity, and storm cycles common in Marietta, Canton, and North Atlanta. It resists rot, warping, and pests, ensuring your home stays protected for decades.",
  },
  {
    q: "How long does siding installation take in Marietta or Canton?",
    a: "A typical siding project takes 5–10 working days. This allows for a proper full tear-off, structural inspection, and precision installation of the James Hardie system by our W-2 crews. Every project is overseen by a dedicated on-site project manager.",
  },
  {
    q: "What does the 30-year non-prorated warranty cover?",
    a: "As Elite Preferred installers, we can offer James Hardie's highest level of protection. The 30-year non-prorated warranty covers both materials and labor, giving you peace of mind that your investment is fully protected against manufacturer defects and installation issues.",
  },
  {
    q: "Are your crews subcontractors or employees?",
    a: "Every crew member at Siding Depot is a W-2 employee. We never use subcontractors. This ensures consistent quality, accountability, and safety on every project. Our teams are background-checked, insured, and trained specifically in James Hardie Best Practices.",
  },
  {
    q: "Do you provide written estimates?",
    a: "Yes. We provide detailed, itemized written estimates within 24 hours of our site visit. The price quoted is the price you pay — no hidden fees or surprise change orders mid-project.",
  },
] as const;

/* ---------------------------------------------------------------- */
/* Page assembly                                                     */
/* ---------------------------------------------------------------- */
function SidingPage() {
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
      <SidingHero />
      <TrustStrip />
      <SidingStatsBar />
      <EliteBadgeSection />
      <SidingTypesSection />
      <SidingProcess />
      <BeforeAfterCarousel />
      {/* overallRating and totalReviews intentionally omitted — carousel reads from GoogleStatsContext */}
      <GoogleReviewsCarousel reviews={mappedReviews} />
      <WhyUsSection />
      <DesignConsultationSection />
      <FaqSection items={FAQ_ITEMS} title="Siding questions," />
    </div>
  );
}
