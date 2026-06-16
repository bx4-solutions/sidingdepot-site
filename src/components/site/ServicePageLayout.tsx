/**
 * ServicePageLayout — shared visual shell for all non-siding service pages.
 *
 * Visual architecture mirrors /siding exactly (same sections, same design language)
 * but every piece of copy is injected via props so each page is 100% unique.
 *
 * Sections (in render order):
 *  1. ServiceHero           — cinematic full-bleed hero
 *  2. TrustStrip            — credential bar (same for all services)
 *  3. StatsBar              — animated counters (same for all services)
 *  4. EliteBadgeSection     — company authority (same for all)
 *  5. ProblemSolution       — service-specific pain points + solution
 *  6. ServiceOptions        — 4 photo-cards (types/approaches per service)
 *  7. ProcessSection        — step-by-step process (per service)
 *  8. BeforeAfterSection    — project gallery (shared)
 *  9. GoogleReviewsCarousel — live Google reviews (shared)
 * 10. AuthoritySection      — service-specific authority + comparison table
 * 11. WhyUsSection          — company-level proof (same for all)
 * 12. FinalCTA              — service-specific CTA copy
 * 13. FaqSection            — service-specific FAQs
 */

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
import { Link, useLocation } from "@tanstack/react-router";
import { FaqSection } from "@/components/site/FaqSection";
import { GoogleReviewsCarousel } from "@/components/site/GoogleReviewsCarousel";
import { BeforeAfterSlider } from "@/components/site/BeforeAfterSlider";
import { EliteBadgeSection } from "@/components/site/EliteBadgeSection";
import {
  SupplierBrandSection,
  type SupplierSectionConfig,
} from "@/components/site/SupplierBrandSection";
import { BEFORE_AFTER_PAIRS, PROJECTS_SORTED, SITE } from "@/data/site";
import { useGoogleStats } from "@/lib/google-stats-context";
import jamesHardieBadge from "@/assets/james-hardie-elite-badge.png";

// ─── Brand tokens ─────────────────────────────────────────────────────────────
const SD_NAVY = "#1e2a3a";
const SD_LIME = "#B3D133";
const SD_LIME_TEXT = "#3C4A07";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ServiceOption = {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  description: string;
};

export type ProcessStep = {
  num: string;
  title: string;
  desc: string;
};

export type AuthorityRow = [string, string, string]; // [factor, others, siding-depot]

export type ServicePageConfig = {
  // ── Hero ──────────────────────────────────────────────────────────────────
  heroImage: string;
  heroImageAlt: string;
  heroBadge: string;
  heroLine1: string;
  heroLine2: string; // shown in SD_LIME accent color
  heroLine3?: string;
  heroSubtitle: string;

  // ── Problem + Solution ────────────────────────────────────────────────────
  problemHeadline: string;
  problemPoints: string[];
  problemSolution: string;

  // ── Options / Types ────────────────────────────────────────────────────────
  optionsEyebrow: string;
  optionsHeadline: string;
  optionsSubheadline: string;
  options: ServiceOption[];

  // ── Process ────────────────────────────────────────────────────────────────
  processEyebrow?: string;
  processHeadline?: string;
  processSubheadline?: string;
  steps: ProcessStep[];

  // ── Projects ───────────────────────────────────────────────────────────────
  projectsLabel: string;
  hideBeforeAfter?: boolean;

  // ── Authority ──────────────────────────────────────────────────────────────
  authorityEyebrow: string;
  authorityHeadline: string;
  authorityHeadlineAccent: string;
  authorityBody1: string;
  authorityBody2: string;
  authorityRows: AuthorityRow[];
  authorityCta: string;

  // ── Why Us ─────────────────────────────────────────────────────────────────
  whyUsHeadline: string;
  whyUsSubheadline: string;

  // ── Final CTA ──────────────────────────────────────────────────────────────
  ctaEyebrow: string;
  ctaHeadline: string;
  ctaHeadlineAccent: string;
  ctaBody1: string;
  ctaBody2: string;
  ctaMainBtn: string;
  ctaTrustPoints: string[];

  // ── FAQ ────────────────────────────────────────────────────────────────────
  faqTitle: string;
  faqTitleAccent?: string;
  faqs: ReadonlyArray<{ q: string; a: string }>;

  // ── Supplier brand section (replaces EliteBadgeSection when provided) ──────
  supplierSection?: SupplierSectionConfig;
};

// ─── TrustStrip ───────────────────────────────────────────────────────────────
function TrustStrip() {
  const { rating, totalReviews } = useGoogleStats();
  const items = [
    { label: "James Hardie", sublabel: "Elite Preferred Contractor", badge: true, href: undefined },
    {
      label: "4.7★",
      sublabel: "261 GuildQuality Reviews",
      href: "/#guild-reviews",
      badge: false,
    },
    {
      label: `${rating}★`,
      sublabel: `${totalReviews} Google Reviews`,
      href: "/#google-reviews",
      badge: false,
    },
    {
      label: "4.9★",
      sublabel: "91 Thumbtack Reviews",
      href: "/#google-reviews",
      badge: false,
    },
    { label: "GreenSky®", sublabel: "0% APR Financing", href: undefined, badge: false },
    { label: "Guildmember", sublabel: "Since 2019", href: undefined, badge: false },
  ];

  return (
    <div style={{ background: SD_NAVY, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="flex flex-wrap items-center justify-center lg:justify-between gap-x-6 gap-y-1 lg:gap-x-8 py-0">
          {items.map((item, i) => {
            const inner = (
              <div
                className={`flex items-center gap-3 py-4 px-2 ${
                  i < items.length - 1 ? "lg:border-r lg:border-white/10" : ""
                }`}
              >
                {item.badge ? (
                  <img
                    src={jamesHardieBadge}
                    alt="James Hardie Elite Preferred"
                    className="h-10 w-auto object-contain"
                    loading="eager"
                  />
                ) : (
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-black"
                    style={{ background: "rgba(179,209,51,0.12)", color: SD_LIME }}
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
              <a key={item.label} href={item.href} className="hover:opacity-80 transition-opacity">
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

// ─── StatsBar ─────────────────────────────────────────────────────────────────
const STATS_DATA = [
  { value: 1500, suffix: "+", label: "Projects Completed" },
  { value: 20, suffix: "+", label: "Years in Georgia" },
  { value: 92, suffix: "%", label: "Would Recommend Us" },
  { value: 261, suffix: "+", label: "Verified Reviews" },
];

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

function StatItem({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const { ref, count } = useCountUp(value);
  return (
    <div className="flex flex-col items-center text-center px-3 py-6 sm:px-6 sm:py-8">
      <span
        ref={ref}
        className="font-display text-2xl sm:text-5xl lg:text-6xl"
        style={{ color: SD_LIME }}
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

function StatsBar() {
  return (
    <section style={{ background: SD_NAVY }} className="border-t border-white/5">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/8 divide-y lg:divide-y-0">
          {STATS_DATA.map((s) => (
            <StatItem key={s.label} {...s} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── ProblemSolution ──────────────────────────────────────────────────────────
function ProblemSolution({
  headline,
  points,
  solution,
}: {
  headline: string;
  points: string[];
  solution: string;
}) {
  return (
    <section className="py-24 lg:py-32 bg-white">
      <div className="mx-auto max-w-7xl px-4 lg:px-8 grid gap-16 lg:grid-cols-2 items-center">
        <div>
          <span
            className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-5"
            style={{ background: "#eef7c0", color: SD_LIME_TEXT }}
          >
            The Problem
          </span>
          <h2 className="font-display text-4xl sm:text-5xl text-sd-navy leading-tight mb-6">
            {headline}
          </h2>
          <ul className="space-y-3">
            {points.map((p) => (
              <li key={p} className="flex items-start gap-3 text-gray-600">
                <span
                  className="mt-2 h-2 w-2 shrink-0 rounded-full"
                  style={{ background: SD_LIME }}
                />
                <span className="text-lg leading-relaxed">{p}</span>
              </li>
            ))}
          </ul>
        </div>
        <div
          className="rounded-3xl p-8 lg:p-10"
          style={{ background: SD_NAVY, border: "1px solid rgba(179,209,51,0.2)" }}
        >
          <span
            className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-5"
            style={{ background: "rgba(179,209,51,0.12)", color: SD_LIME }}
          >
            The Solution
          </span>
          <p className="text-white/80 text-lg leading-relaxed">{solution}</p>
          <div className="mt-8">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-sm transition-all hover:scale-105"
              style={{ background: SD_LIME, color: SD_NAVY }}
            >
              Get Free Estimate <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── ServiceOptions ───────────────────────────────────────────────────────────
function ServiceOptions({
  eyebrow,
  headline,
  subheadline,
  options,
}: {
  eyebrow: string;
  headline: string;
  subheadline: string;
  options: ServiceOption[];
}) {
  const [active, setActive] = useState<string | null>(null);
  const activeOpt = options.find((o) => o.id === active);

  return (
    <section className="py-24 lg:py-32" style={{ background: SD_NAVY }}>
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="max-w-2xl mb-14">
          <span
            className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4"
            style={{ background: "rgba(179,209,51,0.12)", color: SD_LIME }}
          >
            {eyebrow}
          </span>
          <h2 className="font-display text-4xl sm:text-5xl text-white leading-tight">{headline}</h2>
          <p className="mt-5 text-white/55 leading-relaxed">{subheadline}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {options.map((opt) => {
            const isActive = active === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setActive(isActive ? null : opt.id)}
                className="group relative overflow-hidden rounded-2xl text-left"
                style={{
                  aspectRatio: "3/4",
                  outline: isActive ? `2px solid ${SD_LIME}` : "none",
                  outlineOffset: 2,
                }}
              >
                <img
                  src={opt.image}
                  alt={opt.title}
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
                      style={{ background: SD_LIME, color: SD_NAVY }}
                    >
                      Selected
                    </span>
                  )}
                  <p
                    className="text-xs font-bold uppercase tracking-widest mb-1.5"
                    style={{ color: SD_LIME }}
                  >
                    {opt.subtitle}
                  </p>
                  <h3 className="text-xl font-bold text-white leading-tight">{opt.title}</h3>
                  <p className="mt-2 text-sm text-white/0 leading-relaxed transition-all duration-300 group-hover:text-white/80 overflow-hidden max-h-0 group-hover:max-h-24">
                    {opt.description}
                  </p>
                  <span
                    className="mt-3 inline-flex items-center gap-1 text-xs font-bold"
                    style={{ color: SD_LIME }}
                  >
                    Learn More <ChevronRight className="h-3 w-3" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
        {activeOpt && (
          <div
            className="mt-6 rounded-2xl p-6 grid sm:grid-cols-[200px_1fr] gap-6 items-center"
            style={{
              background: "rgba(179,209,51,0.06)",
              border: "1px solid rgba(179,209,51,0.2)",
            }}
          >
            <img
              src={activeOpt.image}
              alt={activeOpt.title}
              className="rounded-xl w-full object-cover"
              style={{ aspectRatio: "4/3" }}
            />
            <div>
              <p
                className="text-xs font-bold uppercase tracking-widest mb-2"
                style={{ color: SD_LIME }}
              >
                {activeOpt.subtitle}
              </p>
              <h3 className="text-2xl font-bold text-white mb-3">{activeOpt.title}</h3>
              <p className="text-white/65 leading-relaxed">{activeOpt.description}</p>
              <Link
                to="/contact"
                className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all hover:scale-105"
                style={{ background: SD_LIME, color: SD_NAVY }}
              >
                Get Quote <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// ─── ProcessSection ───────────────────────────────────────────────────────────
function ProcessSection({
  eyebrow,
  headline,
  subheadline,
  steps,
}: {
  eyebrow: string;
  headline: string;
  subheadline: string;
  steps: ProcessStep[];
}) {
  return (
    <section className="py-24 lg:py-32 bg-white">
      <div className="mx-auto max-w-6xl px-4 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span
            className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4"
            style={{ background: "#eef7c0", color: SD_LIME_TEXT }}
          >
            {eyebrow}
          </span>
          <h2 className="font-display text-4xl sm:text-5xl text-sd-navy leading-tight">
            {headline}
          </h2>
          <p className="mt-4 text-gray-500 leading-relaxed">{subheadline}</p>
        </div>
        <div className="flex flex-col gap-0">
          {steps.map((step, i) => {
            const isLast = i === steps.length - 1;
            return (
              <div key={step.num} className="relative flex gap-4 pb-6">
                <div className="flex flex-col items-center shrink-0" style={{ width: 36 }}>
                  <div
                    className="h-9 w-9 rounded-full border-4 border-white flex items-center justify-center font-display text-xs font-bold shrink-0"
                    style={{
                      background: SD_LIME,
                      color: SD_NAVY,
                      boxShadow: "0 0 0 3px rgba(179,209,51,0.22)",
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
                  className="flex-1 rounded-2xl p-5"
                  style={{
                    background: "#f9fafb",
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                  }}
                >
                  <h3 className="text-base font-bold text-sd-navy leading-snug mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── BeforeAfterSection ───────────────────────────────────────────────────────
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
      "Full exterior transformation completed by Siding Depot across North Atlanta.",
  };
});

function BeforeAfterSection({ projectsLabel }: { projectsLabel: string }) {
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
    <section style={{ background: SD_NAVY }} className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-14">
          <div>
            <span
              className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4"
              style={{ background: "rgba(179,209,51,0.12)", color: SD_LIME }}
            >
              Real Projects
            </span>
            <h2 className="font-display text-4xl sm:text-5xl text-white leading-tight">
              {projectsLabel}
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
                    background: i === index ? SD_LIME : "rgba(255,255,255,0.2)",
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
                style={{ background: SD_LIME, color: SD_NAVY }}
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

// ─── AuthoritySection ─────────────────────────────────────────────────────────
function AuthoritySection({ cfg }: { cfg: ServicePageConfig }) {
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
            src="/projects/project-3.webp"
            alt="Siding Depot professional crew completing a North Atlanta exterior project"
            className="relative rounded-2xl w-full object-cover shadow-2xl"
            style={{ aspectRatio: "4/3" }}
            loading="lazy"
          />
          <div
            className="absolute -bottom-6 -right-4 rounded-2xl px-6 py-4 shadow-xl text-center"
            style={{ background: SD_NAVY, border: "1px solid rgba(179,209,51,0.3)" }}
          >
            <p className="font-display text-4xl" style={{ color: SD_LIME }}>
              1,500+
            </p>
            <p className="text-xs text-white/60 uppercase tracking-widest font-bold mt-0.5">
              Projects Done
            </p>
          </div>
        </div>
        <div>
          <span
            className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-5"
            style={{ background: "#eef7c0", color: SD_LIME_TEXT }}
          >
            {cfg.authorityEyebrow}
          </span>
          <h2 className="font-display text-4xl sm:text-5xl text-sd-navy leading-tight">
            {cfg.authorityHeadline}
            <br />
            <span style={{ color: SD_LIME_TEXT }}>{cfg.authorityHeadlineAccent}</span>
          </h2>
          <p className="mt-6 text-gray-600 leading-relaxed text-lg">{cfg.authorityBody1}</p>
          <p className="mt-4 text-gray-600 leading-relaxed">{cfg.authorityBody2}</p>
          <div className="mt-8 rounded-xl overflow-hidden border border-gray-200 overflow-x-auto">
            <div className="min-w-[340px]">
              <div className="grid grid-cols-3 text-xs font-bold uppercase tracking-wider bg-gray-50 px-3 py-3 text-gray-500">
                <span>Factor</span>
                <span className="text-center">Others</span>
                <span className="text-center" style={{ color: SD_LIME_TEXT }}>
                  Siding Depot
                </span>
              </div>
              {cfg.authorityRows.map(([factor, standard, elite]) => (
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
            style={{ background: SD_LIME, color: SD_NAVY }}
          >
            {cfg.authorityCta} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── WhyUsSection (company-level, same for all) ───────────────────────────────
const WHY_US_ITEMS = [
  {
    Icon: Award,
    title: "Elite Preferred — Top 2% in the US",
    desc: "One of fewer than 2% of US installers to hold James Hardie Elite Preferred status. This certification is renewed annually and unlocks warranty coverage no standard contractor can offer.",
  },
  {
    Icon: ShieldCheck,
    title: "In-House Crews — Not a Subcontract Shop",
    desc: "Every crew member on your job is a Siding Depot in-house employee. Background-checked, trained, and covered under our insurance. We never hand your project to a third party.",
  },
  {
    Icon: CheckCircle2,
    title: "Engineered for Georgia's Climate",
    desc: "Our materials and methods are selected specifically for Georgia's heat, humidity, and storm season. Every product we specify performs under the conditions your home actually faces.",
  },
  {
    Icon: FileText,
    title: "Written Estimates — Price Locked",
    desc: "Every estimate is detailed, itemized, and binding. The number you see is the number you pay. No surprise change orders, no last-minute additions after the job starts.",
  },
  {
    Icon: Users,
    title: "On-Site Project Manager Every Day",
    desc: "A dedicated Siding Depot project manager is physically on your job site each day. You get a daily progress update — by call or text — no chasing, no guessing.",
  },
  {
    Icon: ShieldCheck,
    title: "Licensed, Insured & Financing Ready",
    desc: "Georgia General Contractor #RBQA006789, fully insured, and an approved GreenSky® financing partner offering 0% APR options. We handle the paperwork so you don't have to.",
  },
] as const;

function WhyUsSection({ headline, subheadline }: { headline: string; subheadline: string }) {
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
              {headline}
            </h2>
            <p className="mt-5 text-gray-500 leading-relaxed">{subheadline}</p>
            <img
              src="/projects/project-2.webp"
              alt="Siding Depot professional crew"
              className="mt-8 rounded-2xl w-full object-cover shadow-lg"
              style={{ aspectRatio: "4/3" }}
              loading="lazy"
            />
          </div>
          <div className="flex flex-col gap-5">
            {WHY_US_ITEMS.map((item, i) => {
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

// ─── FinalCTA ─────────────────────────────────────────────────────────────────
function FinalCTA({ cfg }: { cfg: ServicePageConfig }) {
  return (
    <section className="py-24 lg:py-32 bg-white overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden" style={{ background: SD_NAVY }}>
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
                src="/projects/project-5.webp"
                alt="Siding Depot completed exterior project"
                className="absolute inset-0 h-full w-full object-cover"
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
                style={{ background: "rgba(179,209,51,0.12)", color: SD_LIME }}
              >
                {cfg.ctaEyebrow}
              </span>
              <h2 className="font-display text-4xl sm:text-5xl text-white leading-tight mb-5">
                {cfg.ctaHeadline}
                <br />
                <span style={{ color: SD_LIME }}>{cfg.ctaHeadlineAccent}</span>
              </h2>
              <p className="text-white/65 leading-relaxed mb-4">{cfg.ctaBody1}</p>
              <p className="text-white/65 leading-relaxed mb-8">{cfg.ctaBody2}</p>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all hover:scale-105"
                  style={{ background: SD_LIME, color: SD_NAVY }}
                >
                  {cfg.ctaMainBtn} <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href={SITE.phoneHref}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm text-white transition-all hover:bg-white/10 whitespace-nowrap"
                  style={{ border: "1px solid rgba(255,255,255,0.2)" }}
                >
                  <Phone className="h-4 w-4" /> {SITE.phone}
                </a>
              </div>
              <div className="mt-8 flex flex-wrap gap-5">
                {cfg.ctaTrustPoints.map((t) => (
                  <div key={t} className="flex items-center gap-1.5 text-xs text-white/50">
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0" style={{ color: SD_LIME }} />
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

// ─── ServiceHero ──────────────────────────────────────────────────────────────
function ServiceHero({ cfg }: { cfg: ServicePageConfig }) {
  return (
    <section className="relative isolate overflow-hidden" style={{ minHeight: "92vh" }}>
      <img
        src={cfg.heroImage}
        alt={cfg.heroImageAlt}
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
        <div className="max-w-5xl">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest"
              style={{
                background: "rgba(179,209,51,0.15)",
                border: `1px solid ${SD_LIME}`,
                color: SD_LIME,
              }}
            >
              <Award className="h-3 w-3" /> {cfg.heroBadge}
            </span>
          </div>
          <h1 className="font-display text-white leading-[0.95] text-4xl sm:text-5xl lg:text-7xl xl:text-8xl">
            {cfg.heroLine1}
            <br />
            <span style={{ color: SD_LIME }}>{cfg.heroLine2}</span>
            {cfg.heroLine3 && <> {cfg.heroLine3}</>}
          </h1>
          <p className="mt-6 text-lg text-white/75 leading-relaxed max-w-2xl mx-auto">
            {cfg.heroSubtitle}
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-base transition-all hover:scale-105 active:scale-100"
              style={{ background: SD_LIME, color: SD_NAVY }}
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
                <Icon className="h-4 w-4 shrink-0" style={{ color: SD_LIME }} />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── RelatedServices ──────────────────────────────────────────────────────────
const SERVICE_LINKS = [
  { to: "/siding", label: "Siding", desc: "James Hardie fiber cement" },
  { to: "/painting", label: "Painting", desc: "Sherwin-Williams exteriors" },
  { to: "/windows", label: "Windows", desc: "Energy-efficient replacements" },
  { to: "/doors", label: "Doors", desc: "Entry, patio & storm doors" },
  { to: "/gutters", label: "Gutters", desc: "Seamless 6-inch systems" },
  { to: "/decks", label: "Decks", desc: "Composite & custom builds" },
  { to: "/roofing", label: "Roofing", desc: "GAF-certified roofing" },
] as const;

export function RelatedServices() {
  const { pathname } = useLocation();
  const others = SERVICE_LINKS.filter((s) => s.to !== pathname);
  if (others.length === 0) return null;

  return (
    <section className="py-16 sm:py-20 lg:py-24" style={{ background: SD_NAVY }}>
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="text-center mb-10">
          <span
            className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4"
            style={{ background: SD_LIME, color: SD_NAVY }}
          >
            More From Siding Depot
          </span>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl text-white leading-tight">
            Explore Our Other Services
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {others.map((s) => (
            <Link
              key={s.to}
              to={s.to}
              className="group rounded-xl p-4 flex flex-col gap-1 transition-all hover:-translate-y-0.5"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <span className="flex items-center justify-between text-white font-bold text-sm">
                {s.label}
                <ArrowRight
                  className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: SD_LIME }}
                />
              </span>
              <span className="text-white/50 text-xs leading-snug">{s.desc}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export function ServicePageLayout({ config }: { config: ServicePageConfig }) {
  return (
    <div className="flex flex-col">
      <ServiceHero cfg={config} />
      <TrustStrip />
      <StatsBar />
      {config.supplierSection ? (
        <SupplierBrandSection cfg={config.supplierSection} />
      ) : (
        <EliteBadgeSection />
      )}
      <ProblemSolution
        headline={config.problemHeadline}
        points={config.problemPoints}
        solution={config.problemSolution}
      />
      <ServiceOptions
        eyebrow={config.optionsEyebrow}
        headline={config.optionsHeadline}
        subheadline={config.optionsSubheadline}
        options={config.options}
      />
      <ProcessSection
        eyebrow={config.processEyebrow ?? "Our Process"}
        headline={config.processHeadline ?? "5 Steps. No Surprises."}
        subheadline={
          config.processSubheadline ??
          "A clear, predictable process from first call to final walkthrough."
        }
        steps={config.steps}
      />
      {!config.hideBeforeAfter && <BeforeAfterSection projectsLabel={config.projectsLabel} />}
      <GoogleReviewsCarousel />
      <AuthoritySection cfg={config} />
      <WhyUsSection headline={config.whyUsHeadline} subheadline={config.whyUsSubheadline} />
      <RelatedServices />
      <FinalCTA cfg={config} />
      <FaqSection
        items={config.faqs}
        title={config.faqTitle}
        titleAccent={config.faqTitleAccent ?? "answered."}
      />
    </div>
  );
}
