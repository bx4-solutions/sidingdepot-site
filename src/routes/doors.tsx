import { createFileRoute } from "@tanstack/react-router";
import { ServicePageLayout, type ServicePageConfig } from "@/components/site/ServicePageLayout";
import { SERVICE_METADATA } from "@/data/seo-config";
import { LOCAL_BUSINESS_SCHEMA, getServiceSchema, getFaqSchema } from "@/lib/schema";

import doorsHeroImg from "@/assets/doors-hero.png";
const HERO_IMAGE = doorsHeroImg;
const OG_IMAGE = "https://sidingdepot.com/og-default.webp";
const CANONICAL = "https://sidingdepot.com/doors";
const seo = SERVICE_METADATA["doors"];

const FAQS = [
  {
    q: "What type of exterior door is best for Georgia's climate?",
    a: "Fiberglass doors outperform wood and steel in Georgia's humidity and heat. They don't warp, swell, or rust — the three most common failure modes for exterior doors in the Southeast. Premium fiberglass units replicate the look of wood grain without the maintenance or vulnerability. Steel is a strong second for security-focused applications with proper weatherstripping.",
  },
  {
    q: "How much does an exterior door replacement cost in North Atlanta?",
    a: "A standard fiberglass entry door with installation runs $1,200–$2,800 depending on door size, glass package, hardware, and sidelite configuration. Steel entry doors with installation run $800–$2,000. Custom or oversized double-door units range $3,000–$6,000 installed. Every project begins with a written, itemized estimate.",
  },
  {
    q: "Can you install patio and French doors?",
    a: "Yes. We install sliding patio doors, hinged French doors, and folding multi-panel door systems. For patio doors, we recommend fiberglass or aluminum-clad wood units with Low-E glass — the combination handles Georgia's UV exposure and minimizes solar heat gain into living areas.",
  },
  {
    q: "How long does exterior door replacement take?",
    a: "A single entry door replacement is typically completed in half a day. French door or patio door installations that require structural header work can take one full day. We protect interior flooring and repaint or caulk exterior trim as part of the installation scope.",
  },
  {
    q: "Will a new front door improve my home's energy efficiency?",
    a: "Significantly. A weatherstripped, insulated fiberglass or steel door with thermal break technology reduces air infiltration by 40–60% compared to a worn wood door with degraded weatherstripping. Combined with a proper threshold seal, a quality exterior door is one of the most cost-effective energy upgrades per dollar spent.",
  },
  {
    q: "Do you handle storm doors as well?",
    a: "Yes. We install full-view and retractable-screen storm doors from Andersen and LARSON — the two most durable brands for Georgia's conditions. Storm doors extend the life of your primary entry door by reducing direct UV and moisture exposure.",
  },
  {
    q: "Do you pull permits for door replacements?",
    a: "Standard like-for-like replacements typically don't require permits in most North Atlanta jurisdictions. Projects involving frame modifications, structural header work, or new door openings require permits — we file and manage those with the relevant county at no additional administrative charge.",
  },
  {
    q: "Can I see door styles and finishes before committing?",
    a: "Yes. During your free consultation we bring physical samples of door skins, glass patterns, hardware finishes, and paint or stain options. We reference completed projects from similar homes in your area so you can see the actual result — not just a catalog photo.",
  },
] as const;

const CONFIG: ServicePageConfig = {
  heroImage: HERO_IMAGE,
  heroImageAlt: "Premium exterior door installation on a North Atlanta home by Siding Depot",
  heroBadge: "Fiberglass & Steel Specialists · North Atlanta",
  heroLine1: "Make A Powerful",
  heroLine2: "First Impression.",
  heroLine3: "",
  heroSubtitle:
    "Exterior door replacement and installation across Greater Marietta — fiberglass, steel, and French doors specified for Georgia's climate. Security, energy efficiency, and curb appeal in one project.",
  problemHeadline: "Your Front Door Does More Than Open And Close.",
  problemPoints: [
    "A warped or swollen door that sticks in humidity and signals deferred maintenance to every visitor",
    "Air leaks around the frame that defeat your HVAC system year-round",
    "Inadequate security hardware that doesn't match the strength of the door itself",
    "A dated entry that reduces curb appeal and first impressions before anyone gets inside",
  ],
  problemSolution:
    "Siding Depot replaces exterior doors using fiberglass and steel units specified for Georgia's heat, humidity, and storm season. Every installation includes proper flashing, weatherstripping, threshold sealing, and hardware installation — the details that determine whether your new door performs for 20 years or 5.",
  optionsEyebrow: "Door Systems",
  optionsHeadline: "Four Door Types. One Right Entry For Your Home.",
  optionsSubheadline:
    "Every door we install is specified for Georgia's climate and your home's specific architectural character. Click to explore.",
  options: [
    {
      id: "fiberglass",
      title: "Fiberglass Entry Doors",
      subtitle: "Best for Georgia · No maintenance",
      image: "/projects/project-1.webp",
      description:
        "Fiberglass doors don't warp, swell, or rust — the three most common failure modes for exterior doors in the Southeast. Available in wood-grain textures, full-glass, and paint-ready smooth finishes. Our top recommendation for Georgia homeowners.",
    },
    {
      id: "steel",
      title: "Steel Entry Doors",
      subtitle: "Maximum security · Value",
      image: "/projects/project-3.webp",
      description:
        "Insulated steel doors provide excellent security ratings and energy performance at a lower cost than fiberglass. Require proper sealing at the bottom and weatherstripping maintenance to resist corrosion in Georgia's humidity.",
    },
    {
      id: "french-patio",
      title: "French & Patio Doors",
      subtitle: "Indoor-outdoor living · Natural light",
      image: "/projects/project-4.webp",
      description:
        "Hinged French doors and sliding patio systems that connect interior living spaces to decks, porches, and outdoor entertaining areas. Low-E glass is standard — essential for managing solar heat gain in south and west-facing installations.",
    },
    {
      id: "storm",
      title: "Storm & Security Doors",
      subtitle: "UV protection · Extended door life",
      image: "/projects/project-2.webp",
      description:
        "Full-view and retractable-screen storm doors that protect your primary entry door from UV exposure and moisture, extend its lifespan, and add a secondary ventilation and security layer — particularly valuable during Georgia's spring and fall.",
    },
  ],
  processEyebrow: "How It Works",
  processHeadline: "From Selection To A Secure Front Door.",
  processSubheadline:
    "Exterior door installation is a one-day project done right — or a year of problems done wrong. We do it right.",
  steps: [
    {
      num: "01",
      title: "Free Door Consultation",
      desc: "We come to your home with physical samples — door skins, glass patterns, hardware finishes — and assess the existing frame, threshold condition, and security hardware. You leave the consultation with a clear recommendation, not a catalog.",
    },
    {
      num: "02",
      title: "Frame & Structural Evaluation",
      desc: "We inspect the existing rough opening, header integrity, and exterior trim condition. If structural work is required, we identify it upfront — not mid-installation as a change order.",
    },
    {
      num: "03",
      title: "Written Proposal — No Surprises",
      desc: "Your estimate covers the door unit, glass package, hardware, installation labor, flashing, trim restoration, and any permit fees. Fixed price. No additions after you sign.",
    },
    {
      num: "04",
      title: "Professional Installation",
      desc: "Our in-house crews remove the existing door, prepare the opening, install the new unit to manufacturer specifications — including flash, seal, and hardware alignment — and restore exterior trim.",
    },
    {
      num: "05",
      title: "Final Test & Walkthrough",
      desc: "We test the door through its full range of motion, verify weatherstrip compression, confirm hardware operation, and walk you through maintenance guidelines before we leave.",
    },
  ],
  projectsLabel: "Recent Door Projects\nAcross Metro Atlanta.",
  authorityEyebrow: "Why Installation Details Determine Performance",
  authorityHeadline: "A Premium Door Installed",
  authorityHeadlineAccent: "Incorrectly Performs Poorly.",
  authorityBody1:
    "The most common complaint after door replacement is air leaks — not because of the door, but because of the installation. Improper shimming, missing flashing, compressed weatherstripping, and inadequate threshold sealing all create the same result: energy loss and water infiltration.",
  authorityBody2:
    "Our installation method follows manufacturer rough opening specifications, uses closed-cell foam backer rod before caulking, and includes a full threshold-to-frame seal test before we consider the job complete. The difference is invisible on day one and obvious on year three.",
  authorityRows: [
    ["Flashing method", "Caulk at frame edge", "Full head & jamb flashing"],
    ["Insulation gap", "Fiberglass batt", "Closed-cell foam"],
    ["Threshold seal", "Factory default", "Custom fit & adjusted"],
    ["Hardware alignment", "Approximate", "Calibrated & tested"],
  ],
  authorityCta: "Schedule My Free Door Consultation",
  whyUsHeadline:
    "Six Reasons North Atlanta Homeowners Choose Siding Depot For Their Exterior Doors.",
  whyUsSubheadline:
    "A door is a security system, an energy system, and a design statement. We treat it as all three.",
  ctaEyebrow: "Free Consultation",
  ctaHeadline: "See What The Right Door",
  ctaHeadlineAccent: "Does For Your Home.",
  ctaBody1:
    "Your front door shapes the first impression of your home for every visitor — and every buyer. A free consultation shows you what's possible before you commit to anything.",
  ctaBody2:
    "We respond within 24 hours and bring samples to your home so you can see finishes, glass patterns, and hardware in the actual light of your entryway.",
  ctaMainBtn: "Book My Free Door Consultation",
  ctaTrustPoints: [
    "Physical samples at your home",
    "Same-day written estimate",
    "In-house installation crews",
  ],
  faqTitle: "Door questions,",
  faqTitleAccent: "answered.",
  faqs: FAQS,
};

export const Route = createFileRoute("/doors")({
  head: () => ({
    meta: [
      { title: seo.metaTitle("North Atlanta") },
      { name: "description", content: seo.metaDesc },
      { property: "og:title", content: seo.metaTitle("North Atlanta") },
      { property: "og:description", content: seo.metaDesc },
      { property: "og:image", content: OG_IMAGE },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "canonical", href: CANONICAL },
      { rel: "preload", as: "image", href: HERO_IMAGE, fetchPriority: "high" as any },
    ],
    scripts: [
      { type: "application/ld+json", children: JSON.stringify(LOCAL_BUSINESS_SCHEMA) },
      {
        type: "application/ld+json",
        children: JSON.stringify(
          getServiceSchema(
            "Premium Exterior Door Installation in North Atlanta",
            seo.metaDesc,
            "/doors",
            OG_IMAGE,
          ),
        ),
      },
      { type: "application/ld+json", children: JSON.stringify(getFaqSchema([...FAQS])) },
    ],
  }),
  component: () => <ServicePageLayout config={CONFIG} />,
});
