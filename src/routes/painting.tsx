import { createFileRoute } from "@tanstack/react-router";
import { ServicePageLayout, type ServicePageConfig } from "@/components/site/ServicePageLayout";
import { SERVICE_METADATA } from "@/data/seo-config";
import paintingHeroImg from "@/assets/painting-hero.png";
import {
  LOCAL_BUSINESS_SCHEMA,
  getServiceSchema,
  getFaqSchema,
  getBreadcrumbSchema,
} from "@/lib/schema";

const HERO_IMAGE = paintingHeroImg;
const OG_IMAGE = "https://sidingdepot.com/og-default.webp";
const CANONICAL = "https://sidingdepot.com/painting";
const seo = SERVICE_METADATA["painting"];

const FAQS = [
  {
    q: "How often should I repaint the exterior of my home in Georgia?",
    a: "Most North Atlanta homes need exterior repainting every 7–10 years. Homes with significant sun exposure on south and west-facing walls, homes with wood siding, or homes with darker colors absorbing more UV may need repainting every 5–7 years. Failing paint — chalking, peeling, or cracking — indicates moisture infiltration has already begun and should be addressed immediately.",
  },
  {
    q: "What paint brand does Siding Depot use for exterior projects?",
    a: "We specify Sherwin-Williams Duration and Emerald Exterior lines — two of the highest-performing exterior coatings available for Georgia's climate. Both provide strong UV resistance, mildew resistance, and self-priming capability on properly prepared surfaces. We don't swap in lower-grade products to improve our margin.",
  },
  {
    q: "Does exterior painting include pressure washing and prep?",
    a: "Yes. Every exterior painting project begins with thorough surface preparation: pressure washing, hand scraping of loose paint, sanding, caulking of gaps and cracks, spot priming of bare wood and metal, and masking of windows, trim, fixtures, and landscaping. Prep determines how long the final coat holds — we don't skip it.",
  },
  {
    q: "How long does exterior painting take for a typical North Atlanta home?",
    a: "A standard 2,000–2,500 sq ft home takes 3–5 days for a complete exterior paint job including prep, prime where needed, and two finish coats. Homes with more complex trim, multiple stories, or significant prep requirements can extend to 7 days. We provide a schedule estimate in the written proposal.",
  },
  {
    q: "Can you paint James Hardie fiber cement siding?",
    a: "Yes — and it requires a specific approach. Hardie siding is factory-primed and uses ColorPlus baked-on finishes, but field-painted Hardie requires 100% acrylic paint applied to the factory primer. We use Sherwin-Williams Resilience or Duration — coatings Hardie recommends for field application. Improper paint or prep on Hardie can void the siding warranty.",
  },
  {
    q: "What does exterior painting cost in Cobb or Cherokee County?",
    a: "A complete exterior repaint of a 2,000 sq ft home typically runs $3,500–$6,000 including prep, primer, and two finish coats of Sherwin-Williams Duration. Homes with more complex trim or siding repairs required can range higher. We provide written, itemized estimates — separated by material and labor.",
  },
  {
    q: "Can you match existing paint colors?",
    a: "Yes. We can match virtually any color from a sample using Sherwin-Williams spectrophotometric color matching. For homes where you've lost the original color information, we take a chip from an unexposed area and match it within a tolerance you can verify before we commit to a full gallon.",
  },
  {
    q: "Do you paint trim, shutters, and doors as part of exterior painting?",
    a: "Yes — trim, shutters, garage doors, and front doors are included in our exterior painting scope. Trim color is one of the highest-impact design decisions in an exterior repaint. We discuss color strategy during the estimate — not just replicating whatever was there before.",
  },
] as const;

const CONFIG: ServicePageConfig = {
  heroImage: HERO_IMAGE,
  heroImageAlt: "Professional exterior painting on a North Atlanta home by Siding Depot",
  heroBadge: "Sherwin-Williams Contractor · Prep-First Approach",
  heroLine1: "Refresh And Protect",
  heroLine2: "Your Home's Exterior.",
  heroLine3: "",
  heroSubtitle:
    "Exterior painting across North Atlanta with meticulous preparation, premium PPG sealants, and TWO full coats of Sherwin-Williams Duration®—a proven system designed to protect your home for 10-15 years. Not just a cosmetic refresh. A long-term exterior protection investment.",
  problemHeadline: "Peeling Paint Is A Warning Sign — Not Just An Eyesore.",
  problemPoints: [
    "Chalking, peeling, and cracking that signal moisture is already working behind the surface",
    "Bare wood and exposed caulk joints that accelerate rot, mold, and structural decay",
    "A faded or dated exterior color that reduces curb appeal and perceived home value",
    "Cheap repaint jobs that last 2–3 years because prep was skipped to hit a low bid",
  ],
  problemSolution:
    "Siding Depot's exterior painting crews start with thorough preparation — pressure washing, scraping, sanding, caulking with premium PPG sealants, and spot priming — before a single drop of finish coat goes on. We use Sherwin-Williams Duration and Emerald Exterior for all topcoats. The result: a paint job that holds for 10-15 years in Georgia's UV and humidity, not 3.",
  optionsEyebrow: "Painting Services",
  optionsHeadline: "Four Scopes. One Exterior That Works.",
  optionsSubheadline:
    "Every exterior painting project we complete starts with the same commitment to prep — regardless of scope or size.",
  options: [
    {
      id: "full-exterior",
      title: "Full Exterior Repaint",
      subtitle: "Complete refresh · Siding, trim, doors",
      image: "/projects/project-1.webp",
      description:
        "Complete exterior repaint covering siding, trim, shutters, doors, and garage doors. Includes full surface prep, caulking, spot priming, and two finish coats of Sherwin-Williams Duration or Emerald Exterior. Our most common residential scope.",
    },
    {
      id: "trim-accent",
      title: "Trim & Accent Painting",
      subtitle: "High-impact · Targeted refresh",
      image: "/projects/project-3.webp",
      description:
        "Targeted repainting of trim, shutters, front doors, and accent elements without full siding repaint. Often the highest return-per-dollar exterior update — especially when siding is in good condition but trim has faded or peeled.",
    },
    {
      id: "hardie",
      title: "James Hardie Fiber Cement Painting",
      subtitle: "Specialty coating · Warranty-safe",
      image: "/projects/project-4.webp",
      description:
        "Field painting of James Hardie fiber cement siding using 100% acrylic coatings recommended by Hardie for recoating — Sherwin-Williams Resilience and Duration. Proper product and primer selection is critical to maintain Hardie's siding warranty.",
    },
    {
      id: "deck-stain",
      title: "Deck Staining & Sealing",
      subtitle: "Wood protection · Annual or biannual",
      image: "/projects/project-2.webp",
      description:
        "Transparent, semi-transparent, and solid stain systems for pressure-treated and wood decks. Proper cleaning and preparation before stain application is the difference between a stain that holds for 3 years versus one that peels in 18 months.",
    },
  ],
  processEyebrow: "How We Paint It",
  processHeadline: "Prep Is 60% Of A Paint Job.",
  processSubheadline:
    "A paint job is only as durable as the surface it goes on. We spend the time on prep that determines how long the finish holds.",
  steps: [
    {
      num: "01",
      title: "Free Color & Condition Estimate",
      desc: "We walk the full exterior with you, assess paint condition, identify problem areas, and discuss color strategy — including finish options, sheen levels, and how to treat trim versus siding.",
    },
    {
      num: "02",
      title: "Surface Condition Assessment",
      desc: "We evaluate paint adhesion, wood condition, caulk failure, siding damage, and moisture entry points — and include any repair scope in the proposal rather than flagging it as a surprise after we've started.",
    },
    {
      num: "03",
      title: "Written Proposal — Material & Labor Separated",
      desc: "Your estimate lists material (product, coverage, gallons) and labor separately — so you can see exactly what you're paying for. No lump-sum bids that hide markup.",
    },
    {
      num: "04",
      title: "Prep, Prime & Paint",
      desc: "Pressure wash, scrape, sand, caulk, spot prime, mask — then two finish coats of Sherwin-Williams Duration or Emerald. We don't skip to the last step because prep doesn't show in the finished photos.",
    },
    {
      num: "05",
      title: "Final Walkthrough & Touch-Ups",
      desc: "We walk the full exterior with you in good light before cleanup. Any touch-ups are done before we pack up — not scheduled as a separate callback visit.",
    },
  ],
  projectsLabel: "Recent Exterior Painting Projects\nAcross Metro Atlanta.",
  hideBeforeAfter: true,
  authorityEyebrow: "Why Paint Product & Prep Determine Longevity",
  authorityHeadline: "A Cheap Paint Job Costs",
  authorityHeadlineAccent: "Twice As Much In 4 Years.",
  authorityBody1:
    "The average low-bid exterior paint job in North Atlanta lasts 3–4 years before peeling, chalking, or fading forces another project. The root cause is almost always the same: insufficient surface prep, low-grade paint, or both. You pay less upfront and more over time.",
  authorityBody2:
    "Sherwin-Williams Duration Exterior applied over a properly prepared surface carries a Lifetime Limited Warranty and outperforms standard-grade coatings in adhesion, UV resistance, and mildew resistance tests. That's the product we specify — not because it's the most expensive, but because it holds the longest under Georgia's conditions.",
  authorityRows: [
    ["Surface prep", "Pressure wash only", "Wash, scrape, sand, caulk, prime"],
    ["Paint product", "Contractor-grade", "Sherwin-Williams Duration/Emerald"],
    ["Expected lifespan", "3–4 years", "10–15 years"],
    ["Warranty", "1-year labor", "Lifetime SW material + written labor"],
  ],
  authorityCta: "Schedule My Free Color Estimate",
  whyUsHeadline:
    "Six Reasons North Atlanta Homeowners Choose Siding Depot To Repaint Their Exterior.",
  whyUsSubheadline:
    "We're not the lowest-bid exterior painter in the area. We're the one whose work still looks good in year eight.",
  ctaEyebrow: "Free Estimate",
  ctaHeadline: "See What Your Home",
  ctaHeadlineAccent: "Could Look Like.",
  ctaBody1:
    "Color is the most personal decision in an exterior project. Our estimate visit walks you through color combinations, finish options, and references from completed projects in your neighborhood — before you commit to a single gallon.",
  ctaBody2:
    "We respond within 24 hours and bring Sherwin-Williams color samples to your home. The estimate is free and the recommendation is honest.",
  ctaMainBtn: "Book My Free Color Estimate",
  ctaTrustPoints: [
    "Free color estimate with samples",
    "Sherwin-Williams certified contractor",
    "Prep-first — written scope included",
  ],
  faqTitle: "Painting questions,",
  faqTitleAccent: "answered.",
  faqs: FAQS,

  supplierSection: {
    logoSrc: "/logos/sherwin-williams.png",
    logoAlt: "Sherwin-Williams Premium Exterior Paint Logo",
    logoTagline: "★ PREFERRED CONTRACTOR",
    sectionEyebrow: "Certified Paint Supplier",
    sectionHeadline: "The Credentials That Back Your Paint Job.",
    sectionBody:
      "Sherwin-Williams is the #1 paint brand in North America. We use their premium exterior lines — Duration® and Emerald® — engineered for UV resistance, moisture protection, and long-term color retention in Georgia's climate.",
    cardEyebrow: "Sherwin-Williams® — Premium Exterior",
    cardHeadline: "The paint that lasts — backed by the brand that invented it.",
    body1:
      "Sherwin-Williams Duration® and Emerald® exterior paints carry a Lifetime Limited Warranty against peeling and blistering — valid for as long as the original purchaser owns the home. This is a product warranty: if the paint peels or blisters, Sherwin-Williams provides replacement product or refunds the original purchase price.",
    body2:
      "What it means for you: the paint product itself is backed by the manufacturer for life. Note that the warranty covers product only — labor for reapplication is not included. Proper surface preparation is required; the warranty does not apply to failures caused by improper prep or structural defects.",
    stats: [
      { val: "Lifetime", desc: "warranty against peeling & blistering" },
      { val: "Product", desc: "coverage only — no labor included" },
      { val: "#1 Brand", desc: "in North America" },
    ],
    cards: [
      {
        name: "Peeling Coverage",
        value: "Lifetime",
        detail: "Product replacement or price refund if paint peels",
      },
      {
        name: "Blistering Coverage",
        value: "Lifetime",
        detail: "Product replacement or price refund if paint blisters",
      },
      {
        name: "Labor Coverage",
        value: "Not Included",
        detail: "Warranty covers product only — not reapplication labor",
      },
      {
        name: "Transferable",
        value: "No",
        detail: "Warranty applies to original purchaser only",
      },
      {
        name: "Prep Requirement",
        value: "Mandatory",
        detail: "Warranty void if surface not properly prepared",
      },
    ],
  },
};

export const Route = createFileRoute("/painting")({
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
            "Professional Exterior Painting in North Atlanta",
            seo.metaDesc,
            "/painting",
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
            { name: "Painting", url: "/painting" },
          ]),
        ),
      },
    ],
  }),
  component: () => <ServicePageLayout config={CONFIG} />,
});
