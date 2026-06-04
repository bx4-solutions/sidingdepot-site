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
  faqJsonLd,
  serviceJsonLd,
  type FaqItem,
  type ChecklistItem,
} from "@/components/site/ServiceLandingPage";
import { SERVICE_METADATA } from "@/data/seo-config";

const HERO_IMAGE = "/projects/project-8.webp";
const CANONICAL = "https://sidingdepot.com/windows";
const SERVICE_KEY = "windows";
const CITY = "Marietta e Região";

const seo = SERVICE_METADATA[SERVICE_KEY];

const FAQS: ReadonlyArray<FaqItem> = [
  {
    q: "How much does window replacement cost in Marietta e Região, GA?",
    a: "Window replacement in Marietta e Região typically ranges from $400–$900 per window installed, depending on size, style, and brand. A full-home replacement (15–20 windows) generally falls in the $7,000–$18,000 range. According to Energy Star, certified Low-E windows can meaningfully reduce cooling costs in hot climates like Atlanta. Final pricing depends on your home's specifications and selected products.",
  },
  {
    q: "What's the best window for Georgia's hot and humid climate?",
    a: "Double-pane Low-E (low emissivity) windows with argon gas fill are widely recommended for Georgia. The Low-E coating reflects infrared heat, helping keep interiors cooler in summer without blocking natural light. Energy Star recommends a U-factor below 0.30 and Solar Heat Gain Coefficient (SHGC) below 0.25 for Atlanta's climate zone (3A/4A).",
  },
  {
    q: "Do I need permits to replace windows in Marietta e Região?",
    a: "Generally yes for structural changes (such as enlarging openings) and not for same-size replacements, but this varies by jurisdiction. We handle all applicable permit applications and inspections so homeowners don't deal with the county directly.",
  },
  {
    q: "How long do replacement windows last in Georgia?",
    a: "Quality vinyl or fiberglass windows can last 20–40 years in Georgia's climate when properly installed and maintained. Wood windows generally require more upkeep due to humidity. We install Simonton and PGT brands — both designed for Southeast climates and engineered to maintain a tight seal through Georgia's temperature swings.",
  },
  {
    q: "Can new windows really lower my energy bill in Atlanta?",
    a: "According to Energy Star, upgrading from single-pane or aged windows to certified Low-E double-pane can lower heating and cooling costs in hot-humid climates like Atlanta. Actual savings depend on your home's insulation, HVAC efficiency, and existing window condition. We'd be happy to provide a personalized assessment.",
  },
];

const CHECKLIST: ReadonlyArray<ChecklistItem> = [
  { Icon: Award, title: "Energy Star certified product", desc: "According to Energy Star, look for U-factor < 0.30 and SHGC < 0.25 for Atlanta's climate zone (3A/4A) — the specs that meaningfully impact summer cooling costs." },
  { Icon: ShieldCheck, title: "License & insurance", desc: "Verify a current Georgia GC license plus general liability and workers' comp before any deposit changes hands." },
  { Icon: FileText, title: "Itemized written estimate", desc: "Insist on per-window pricing, frame material, glazing package, install method (insert vs. full-frame), and trim/wrap details." },
  { Icon: Wrench, title: "Manufacturer-trained installers", desc: "Improperly installed windows can leak air and water no matter how good the product. Ask who trains the install crew." },
  { Icon: Search, title: "Local reviews after one summer", desc: "Drive past jobs from 12+ months ago. Caulk lines and trim wraps tell you a lot about install quality." },
  { Icon: Clock, title: "Realistic timeline", desc: "A standard 15–20 window swap typically takes 2–3 days for an experienced crew. Substantially faster timelines may indicate rushed flashing or insulation work." },
];

export const Route = createFileRoute("/windows")({
  head: () => ({
    meta: [
      { title: seo.metaTitle(CITY) },
      { name: "description", content: seo.metaDesc },
      { property: "og:title", content: seo.metaTitle(CITY) },
      { property: "og:description", content: seo.metaDesc },
      { property: "og:image", content: HERO_IMAGE },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "canonical", href: CANONICAL },
      { rel: "preload", as: "image", href: HERO_IMAGE, fetchPriority: "high" as any },
    ],
    scripts: [
      serviceJsonLd("Window Replacement & Installation", seo.metaDesc, { canonical: CANONICAL, image: HERO_IMAGE, serviceType: "Window Replacement & Installation" }),
      faqJsonLd(FAQS),
    ],
  }),
  component: WindowsPage,
});

function WindowsPage() {
  return (
    <ServiceLandingPage
      serviceKey={SERVICE_KEY}
      city={CITY}
      heroImage={HERO_IMAGE}
      eyebrow="Energy Star · Low-E Double Pane"
      title="Energy-Efficient Windows:"
      titleAccent="Atlanta's Thermal Barrier."
      intro="Help reduce cooling costs with Energy Star® certified windows. According to Energy Star, certified Low-E double-pane systems can meaningfully cut summer cooling bills in Atlanta's climate zone — we'd love to assess your home."
      benefits={[
        "Double-pane Low-E with argon fill — sized for Atlanta climate",
        "Energy Star certified options — up to meaningful cooling savings",
        "Simonton & PGT — designed for Southeast humidity",
        "We handle Cobb / Cherokee / Fulton permits",
      ]}
      hiringRole="window contractor"
      hiringIntro="Energy-efficient windows are a long-term investment. Use this checklist to verify thermal performance specs and installation certifications for Georgia's climate."
      hiringChecklist={CHECKLIST}
      faqLabel="Window"
      faqs={FAQS}
      seoParagraph="Siding Depot replaces windows across Marietta, Alpharetta, Milton, Marietta e região, Woodstock, Roswell, Kennesaw, Johns Creek, Sandy Springs and Acworth — covering Cobb County, Cherokee County and Fulton County in Metro Atlanta. We specify Energy Star double-pane Low-E windows for Atlanta's climate zone (3A/4A), where AC runs much of the year. Most full-home window replacements in our service area generally run $7,000–$18,000, and according to Energy Star, certified Low-E packages can meaningfully reduce summer cooling costs."
      ctaAccent="decades, not summers?"
      trustBadge={{ title: "Energy Star Partner", subtitle: "Low-E + Argon double-pane" }}
    />
  );
}
