import { createFileRoute } from "@tanstack/react-router";
import { ServicePageLayout, type ServicePageConfig } from "@/components/site/ServicePageLayout";
import { SERVICE_METADATA } from "@/data/seo-config";
import {
  LOCAL_BUSINESS_SCHEMA,
  getServiceSchema,
  getFaqSchema,
  getBreadcrumbSchema,
} from "@/lib/schema";

const HERO_IMAGE = "/projects/project-6.webp";
const OG_IMAGE = "https://sidingdepot.com/og-default.webp";
const CANONICAL = "https://sidingdepot.com/gutters";
const seo = SERVICE_METADATA["gutters"];

const FAQS = [
  {
    q: "Why do gutters matter so much in Georgia?",
    a: "Georgia averages 50+ inches of rainfall per year — nearly double the US average. Without properly sized and functional gutters, that water runs off your roof and pools against your foundation, erodes landscaping, saturates the soil below your slab, and works behind siding and trim. Gutters aren't cosmetic — they're structural protection for everything below the roofline.",
  },
  {
    q: "What is a seamless gutter and why is it better?",
    a: "Seamless gutters are fabricated on-site from a continuous roll of aluminum — no seams except at corners and downspout connections. Standard sectional gutters have joints every 10 feet, and every joint is a future leak point. Seamless gutters eliminate 90% of those leak points and are the only type we install for residential projects in North Atlanta.",
  },
  {
    q: "What size gutter do I need?",
    a: "Most North Atlanta homes need 5-inch K-style gutters as a minimum. Homes with steep pitches, large roof footprints, or complex valleys benefit from 6-inch gutters, which move 40% more water per linear foot. We calculate runoff capacity for your specific roof pitch and drainage zones during the free estimate — not a rule-of-thumb guess.",
  },
  {
    q: "How much do seamless gutters cost in Cobb or Cherokee County?",
    a: "Seamless aluminum gutters in North Atlanta run $8–$14 per linear foot installed, including downspouts and hangers. A typical 2,000 sq ft home with 150–200 linear feet of gutter runs $1,200–$2,800 total. Copper and steel run higher. We provide written, itemized estimates before any work begins.",
  },
  {
    q: "Do gutter guards actually work?",
    a: "Quality micro-mesh gutter guards — the type we install — significantly reduce cleaning frequency and prevent 95%+ of debris entry. They work best on homes surrounded by mature trees where seasonal cleaning costs $200–$400 per visit. Cheaper foam or brush inserts we don't install — they create mold and hold debris rather than shedding it.",
  },
  {
    q: "How often should gutters be cleaned in North Atlanta?",
    a: "Without guards: twice annually — once in late spring after pollen season, once in late fall after leaf drop. With quality micro-mesh guards: typically once every 2–3 years to remove fine debris that accumulates on top. We offer annual maintenance programs for homeowners who prefer not to track the schedule themselves.",
  },
  {
    q: "What materials are gutters made from?",
    a: "We install aluminum (most common — rustproof, lightweight, 20+ year lifespan), galvanized steel (heavier, stronger for high-debris areas), and copper (architectural choice — naturally patinas, 50+ year lifespan, premium cost). For most North Atlanta homes, aluminum is the correct specification.",
  },
  {
    q: "Can you repair existing gutters, or do they always need full replacement?",
    a: "Often, repairs extend functional life significantly — especially on aluminum systems under 15 years old. We assess each section individually and recommend repair where it makes sense. If more than 40% of the system needs individual fixes, full replacement is typically the better economic decision. We'll show you the math.",
  },
] as const;

const CONFIG: ServicePageConfig = {
  heroImage: HERO_IMAGE,
  heroImageAlt:
    "Seamless aluminum gutter installation protecting a North Atlanta home by Siding Depot",
  heroBadge: "Seamless Aluminum · Gutter Guards Available",
  heroLine1: "Protect Your Home",
  heroLine2: "From Costly Water Damage.",
  heroLine3: "",
  heroSubtitle:
    "Seamless gutter installation and repair across Marietta — fabricated on-site, sized for Georgia's rainfall, and backed by a written warranty. The last gutter system your home should ever need.",
  problemHeadline: "Gutters Fail Quietly — Until The Damage Is Expensive.",
  problemPoints: [
    "Foundation settlement caused by years of concentrated roof runoff pooling against the slab",
    "Fascia and soffit rot that progresses invisibly until a full section needs replacement",
    "Basement and crawl space moisture that drives mold, efflorescence, and structural damage",
    "Landscaping erosion that washes away beds and grades you spent money installing",
  ],
  problemSolution:
    "Siding Depot installs seamless aluminum gutters fabricated on-site — no pre-cut sections, no seam leaks. We calculate proper sizing for your specific roof pitch and drainage zones, install downspout extensions to move water away from the foundation, and offer micro-mesh guard systems for homes surrounded by trees.",
  optionsEyebrow: "Gutter Systems",
  optionsHeadline: "Four Systems. Sized Right For Your Roof.",
  optionsSubheadline:
    "Every gutter system we install is sized for your specific roof footprint and Georgia's rainfall intensity — not a catalog default.",
  options: [
    {
      id: "k-style",
      title: '5" & 6" K-Style Aluminum',
      subtitle: "Most popular · Best value",
      image: "/projects/project-1.webp",
      description:
        "Seamless K-style aluminum gutters in 5-inch and 6-inch profiles — the industry standard for North Atlanta residential roofing. Fabricated on-site for a continuous run, powder-coated in 20+ color options, and rated for 20+ years with proper maintenance.",
    },
    {
      id: "half-round",
      title: "Half-Round Gutters",
      subtitle: "Historic homes · Traditional look",
      image: "/projects/project-3.webp",
      description:
        "Half-round profile gutters for craftsman, Victorian, and traditional architectural styles where K-style looks out of place. Available in aluminum, galvanized steel, and copper. Superior debris shedding versus K-style due to the round bottom profile.",
    },
    {
      id: "guards",
      title: "Micro-Mesh Gutter Guards",
      subtitle: "Tree-heavy lots · Reduced cleaning",
      image: "/projects/project-4.webp",
      description:
        "Stainless steel micro-mesh guards that stop debris while allowing full water flow — unlike foam or brush inserts that trap moisture and grow mold. For homes with mature trees, guards reduce cleaning visits from twice annually to once every 2–3 years.",
    },
    {
      id: "copper",
      title: "Copper Gutter Systems",
      subtitle: "Architectural · 50+ yr lifespan",
      image: "/projects/project-2.webp",
      description:
        "Copper gutters patina naturally over time and are the longest-lasting gutter material available — 50+ year functional lifespan with no painting required. The architectural choice for high-end traditional homes where permanence and aesthetics both matter.",
    },
  ],
  processEyebrow: "How We Install It",
  processHeadline: "Properly Sized, Properly Pitched, Properly Done.",
  processSubheadline:
    "Most gutter failures trace back to improper pitch or undersizing at installation. We engineer before we install.",
  steps: [
    {
      num: "01",
      title: "Free Gutter Estimate",
      desc: "We walk the full perimeter of your home, evaluate existing gutter condition, identify leak points and sag, and assess foundation and landscaping drainage. Written findings delivered the same day.",
    },
    {
      num: "02",
      title: "Drainage Engineering & Sizing",
      desc: "We calculate roof runoff volume for your specific pitch, drainage zones, and rainfall intensity — then spec the appropriate gutter profile, size, and downspout placement to move water completely away from the foundation.",
    },
    {
      num: "03",
      title: "Written Proposal — Itemized",
      desc: "Your estimate covers gutter linear footage, downspout count and placement, guards if applicable, hanger type, and any fascia repairs identified during our estimate. Fixed price — no additions after signing.",
    },
    {
      num: "04",
      title: "On-Site Fabrication & Installation",
      desc: "We fabricate seamless gutters on-site from a continuous aluminum coil — cut to your exact roofline dimensions. No pre-cut sections. No exposed seams except at inside corners and downspout outlets.",
    },
    {
      num: "05",
      title: "Water Test & Final Walkthrough",
      desc: "We run water through every downspout and verify proper drainage direction before we leave. If anything doesn't drain perfectly, we adjust on the spot — not on a callback visit.",
    },
  ],
  projectsLabel: "Recent Gutter Projects\nAcross Metro Atlanta.",
  authorityEyebrow: "Why On-Site Fabrication Changes Everything",
  authorityHeadline: "Sectional Gutters Have",
  authorityHeadlineAccent: "One Problem Per Section.",
  authorityBody1:
    "Pre-cut sectional gutters from a box store have joints every 10 feet — and every joint is a future leak point. Caulk degrades. Seams separate in Georgia's heat cycles. Most gutter failures in North Atlanta homes are sectional gutter failures — not aluminum failures.",
  authorityBody2:
    "Seamless gutters fabricated on-site have no exposed seams in straight runs — only at mitered corners and downspout connections. That's the difference between a gutter system that lasts 5–8 years and one that lasts 20+. We only install seamless systems for residential projects.",
  authorityRows: [
    ["Seams per 40ft run", "4 joints (leak points)", "0 seams (seamless)"],
    ["Pitch calibration", "Level by eye", "Engineered per section"],
    ["Downspout placement", "Convenience-based", "Drainage-zone calculated"],
    ["Hanger spacing", '24" industry default', '18" for Georgia rainfall'],
  ],
  authorityCta: "Schedule My Free Gutter Estimate",
  whyUsHeadline: "Six Reasons North Atlanta Homeowners Choose Siding Depot For Gutters.",
  whyUsSubheadline:
    "Gutters are the least glamorous exterior upgrade and the most consequential one to get wrong. We get it right.",
  ctaEyebrow: "Free Estimate",
  ctaHeadline: "Find Out Where Your Home",
  ctaHeadlineAccent: "Is Draining Wrong.",
  ctaBody1:
    "Most gutter problems are invisible until they show up as foundation cracks, rotted fascia, or a wet basement. A free estimate identifies what's failing — before the repair costs compound.",
  ctaBody2:
    "We respond within 24 hours, walk your full perimeter, and deliver a written findings report at no charge.",
  ctaMainBtn: "Book My Free Gutter Estimate",
  ctaTrustPoints: [
    "Free written estimate",
    "On-site seamless fabrication",
    "Drainage-zone engineered sizing",
  ],
  faqTitle: "Gutter questions,",
  faqTitleAccent: "answered.",
  faqs: FAQS,

  supplierSection: {
    logoSrc: "/logos/senox.png",
    logoAlt: "Senox American-Made Gutter Systems Logo",
    logoTagline: "★ AMERICAN-MADE QUALITY",
    sectionEyebrow: "Certified Gutter Supplier",
    sectionHeadline: "The Credentials That Back Your Gutters.",
    sectionBody:
      "Senox painted aluminum gutters carry the longest factory paint warranty in the gutter industry — 50 years. Manufactured primarily in the USA with a factory-baked finish built to last.",
    cardEyebrow: "Senox® — American-Made Gutter Systems",
    cardHeadline: "50-year paint warranty. The longest in the industry.",
    body1:
      "Senox manufactures seamless gutter systems primarily in the United States, with a factory-applied paint finish that is baked on for durability and scuff resistance from day one. Their 50-year paint warranty is the longest available for aluminum gutter coatings.",
    body2:
      "What it means for you: a 50-year warranty against paint cracking, peeling, and chipping — plus 32 color options to match any exterior. For high-moisture environments, Senox Galvalume products provide superior corrosion resistance backed by a 20-year warranty.",
    stats: [
      { val: "50 Years", desc: "paint warranty" },
      { val: "32 Colors", desc: "painted aluminum options" },
      { val: "Made in USA", desc: "primary manufacturing" },
    ],
    cards: [
      { name: "Paint Warranty", value: "50 Years", detail: "Against cracking, peeling & chipping" },
      { name: "Galvalume Warranty", value: "20 Years", detail: "Galvalume steel gutter systems" },
      { name: "Color Options", value: "32", detail: "Factory-baked aluminum finishes" },
      { name: "Fabrication", value: "On-Site", detail: "Seamless — formed to exact length" },
      { name: "Manufacturing", value: "USA", detail: "Primarily American-made materials" },
    ],
  },
};

export const Route = createFileRoute("/gutters")({
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
            "Seamless Gutter Installation in North Atlanta",
            seo.metaDesc,
            "/gutters",
            OG_IMAGE,
          ),
        ),
      },
      { type: "application/ld+json", children: JSON.stringify(getFaqSchema([...FAQS])) },
      {
        type: "application/ld+json",
        children: JSON.stringify(
          getBreadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Gutters", url: "/gutters" },
          ]),
        ),
      },
    ],
  }),
  component: () => <ServicePageLayout config={CONFIG} />,
});
