import { createFileRoute } from "@tanstack/react-router";
import {
  Award,
  ShieldCheck,
  FileText,
  Wrench,
  Search,
  Clock,
} from "lucide-react";
import {
  ServiceLandingPage,
  buildServiceMeta,
  faqJsonLd,
  serviceJsonLd,
  type FaqItem,
  type ChecklistItem,
} from "@/components/site/ServiceLandingPage";

const PAGE_TITLE = "Window Replacement in Marietta, GA | Siding Depot — Free Estimate";
const PAGE_DESC =
  "Energy Star double-pane Low-E window replacement built for Atlanta's climate zone. Serving Marietta, Alpharetta, Milton, Canton & North Atlanta. Licensed & insured. Free estimate in 24h. Call (678) 400-2012.";
const HERO_IMAGE = "/projects/project-8.webp";
const CANONICAL = "https://sidingdepot.com/windows";

const FAQS: ReadonlyArray<FaqItem> = [
  {
    q: "How much does window replacement cost in Marietta or Alpharetta, GA?",
    a: "Window replacement in North Atlanta typically costs $400–$900 per window installed, depending on size, style, and brand. A full-home replacement (15–20 windows) runs $7,000–$18,000. Energy-efficient double-pane Low-E windows — recommended for Georgia's climate — reduce cooling costs by 15–25%, which matters when your AC runs 6+ months per year.",
  },
  {
    q: "What's the best window for Georgia's hot and humid climate?",
    a: "Double-pane Low-E (low emissivity) windows with argon gas fill are the standard recommendation for Georgia. The Low-E coating reflects infrared heat, keeping interiors cooler in summer without blocking natural light. Look for a U-factor below 0.30 and Solar Heat Gain Coefficient (SHGC) below 0.25 for optimal performance in Atlanta's climate zone (4A/3A).",
  },
  {
    q: "Do I need permits to replace windows in Cobb or Cherokee County?",
    a: "Yes for structural changes (enlarging openings), no for same-size replacements in most cases. Cobb County requires a permit if you're changing the window opening size. Cherokee County has similar requirements. We handle all permit applications and inspections — homeowners never need to deal with the county directly.",
  },
  {
    q: "How long do replacement windows last in Georgia?",
    a: "Quality vinyl or fiberglass windows last 20–40 years in Georgia's climate. Wood windows require more maintenance and are susceptible to moisture swelling in our humid summers. We install Simonton and PGT brands — both rated for Southeast humidity and designed to maintain a tight seal through Georgia's temperature swings (20°F winters to 100°F summers).",
  },
  {
    q: "Can new windows really lower my energy bill in Atlanta?",
    a: "Yes, measurably. The average Atlanta home spends $200–$300/month on cooling in summer. Upgrading from single-pane or aged windows to Energy Star certified double-pane Low-E can reduce that by $30–$60/month. Over the life of the windows, energy savings often cover 40–60% of the installation cost.",
  },
];

const CHECKLIST: ReadonlyArray<ChecklistItem> = [
  { Icon: Award, title: "Energy Star certified product", desc: "Look for U-factor < 0.30 and SHGC < 0.25 for Atlanta's climate zone (3A/4A) — the only specs that meaningfully cut summer cooling costs." },
  { Icon: ShieldCheck, title: "License & insurance", desc: "Verify a current Georgia GC license plus general liability and workers' comp before any deposit changes hands." },
  { Icon: FileText, title: "Itemized written estimate", desc: "Insist on per-window pricing, frame material, glazing package, install method (insert vs. full-frame), and trim/wrap details." },
  { Icon: Wrench, title: "Manufacturer-trained installers", desc: "Improperly installed windows leak air and water no matter how good the product. Ask who trains the install crew." },
  { Icon: Search, title: "Local reviews after one summer", desc: "Drive past jobs from 12+ months ago. Caulk lines and trim wraps tell you everything about install quality." },
  { Icon: Clock, title: "Realistic timeline", desc: "A standard 15–20 window swap takes 2–3 days for an experienced crew. Anything faster usually means rushed flashing or insulation." },
];

export const Route = createFileRoute("/windows")({
  head: () => ({
    meta: buildServiceMeta({
      title: PAGE_TITLE,
      description: PAGE_DESC,
      image: HERO_IMAGE,
      canonical: CANONICAL,
    }),
    scripts: [
      serviceJsonLd("Window Replacement & Installation", PAGE_DESC, { canonical: CANONICAL, image: HERO_IMAGE, serviceType: "Window Replacement & Installation" }),
      faqJsonLd(FAQS),
    ],
  }),
  component: WindowsPage,
});

function WindowsPage() {
  return (
    <ServiceLandingPage
      eyebrow="Energy Star · Low-E Double Pane"
      title="Replacement windows,"
      titleAccent="built for Atlanta summers."
      intro="Marietta's trusted window installer. Energy Star double-pane Low-E windows from Simonton and PGT — engineered for Georgia humidity, sized for our 100°F summers and 20°F winters."
      heroImage={HERO_IMAGE}
      benefits={[
        "Double-pane Low-E with argon fill — Atlanta climate zone",
        "Cuts summer cooling bills by 15–25%",
        "Simonton & PGT — rated for Southeast humidity",
        "We handle Cobb / Cherokee / Fulton permits",
      ]}
      hiringRole="window contractor"
      hiringIntro="Windows are a 25+ year decision and the #1 driver of summer cooling costs. Use this checklist before you sign with anyone — including us."
      hiringChecklist={CHECKLIST}
      faqLabel="Window"
      faqs={FAQS}
      seoParagraph="Siding Depot replaces windows across Marietta, Alpharetta, Milton, Canton, Woodstock, Roswell, Kennesaw, Johns Creek, Sandy Springs and Acworth — covering Cobb County, Cherokee County and Fulton County in Metro Atlanta. We specify Energy Star double-pane Low-E windows engineered for Atlanta's climate zone (3A/4A), where AC runs 6+ months a year and Georgia's heat and humidity will destroy a poorly sealed install. Most full-home window replacements in 2026 run $7,000–$18,000 in our service area, and quality Low-E packages typically cut summer cooling bills $30–$60 per month."
      ctaAccent="decades, not summers?"
      trustBadge={{ title: "Energy Star Partner", subtitle: "Low-E + Argon double-pane" }}
    />
  );
}
