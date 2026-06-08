import { createFileRoute } from "@tanstack/react-router";
import { ServicePageLayout, type ServicePageConfig } from "@/components/site/ServicePageLayout";
import { SERVICE_METADATA } from "@/data/seo-config";
import roofingHeroImg from "@/assets/services/roofing.jpg";
import { LOCAL_BUSINESS_SCHEMA, getServiceSchema, getFaqSchema } from "@/lib/schema";

const HERO_IMAGE = roofingHeroImg;
const OG_IMAGE = "https://sidingdepot.com/og-default.webp";
const CANONICAL = "https://sidingdepot.com/roofing";
const seo = SERVICE_METADATA["roofing"];

const FAQS = [
  {
    q: "How do I know if I need a full replacement or just a repair?",
    a: "During a free inspection we evaluate shingle age, granule loss, deck integrity, flashing condition, and attic ventilation. Roofs under 15 years with isolated damage often qualify for targeted repair. Roofs over 20 years, or those with widespread curling, cracking, or recurring leaks, typically need full replacement — incremental repairs on an aging system cost more in the long run.",
  },
  {
    q: "What roofing products does Siding Depot install?",
    a: "We install GAF architectural shingles (Timberline HDZ and UHDZ), standing-seam metal roofing, and low-slope TPO membranes. For most North Atlanta homes, GAF Timberline delivers the best balance of performance, warranty coverage, and long-term value.",
  },
  {
    q: "Does my homeowner's insurance cover storm damage?",
    a: "Most policies cover sudden storm-related damage — hail strikes, wind-lifted shingles, and falling debris. We assist with documentation: detailed inspection reports with photographs, itemized damage assessments, and direct communication with your adjuster when needed. The inspection costs you nothing.",
  },
  {
    q: "How long does a roof replacement take?",
    a: "A standard 2,000–2,500 sq ft home is typically finished in one to two days. Steeper pitches, multiple valleys, and dormers can extend the schedule to three days. We protect driveways and landscaping daily and handle all debris removal — your property is clean when we leave.",
  },
  {
    q: "What warranty comes with a Siding Depot roof?",
    a: "We offer GAF's Golden Pledge® Limited Warranty — 50-year non-prorated coverage on materials and 25-year workmanship coverage. This is the strongest residential roofing warranty available, exclusive to GAF Master Elite contractors. Every project also includes our own written workmanship guarantee.",
  },
  {
    q: "What does a roof replacement cost in Cobb or Cherokee County?",
    a: "A 2,000 sq ft architectural shingle roof in North Atlanta typically runs $9,000–$14,000 installed, depending on pitch, accessibility, decking condition, and shingle tier. Metal roofing ranges $18,000–$30,000 for the same footprint. Every project starts with a detailed, itemized written estimate.",
  },
  {
    q: "Do you pull roofing permits?",
    a: "Yes. We handle all Cobb, Cherokee, and Fulton County permit filings. Permitted work is county-inspected — protecting your home's resale value and ensuring your insurance coverage remains fully valid after the project.",
  },
  {
    q: "Can I finance a roof replacement?",
    a: "Yes. Through our GreenSky® partnership you can apply for 0% APR financing in under 60 seconds with a soft credit pull — decisions are typically instant. Financing and homeowner's insurance can be used simultaneously.",
  },
] as const;

const CONFIG: ServicePageConfig = {
  heroImage: HERO_IMAGE,
  heroImageAlt: "Professional roofing installation on a North Atlanta home by Siding Depot",
  heroBadge: "GAF Certified · Storm-Ready Systems",
  heroLine1: "Storm-Proof Roofing",
  heroLine2: "Built To Last.",
  heroLine3: "",
  heroSubtitle:
    "North Atlanta's trusted roofing contractor — GAF architectural systems, storm-damage specialists, and full permit management across Cobb, Cherokee, and Fulton counties. W-2 crews. Written warranties. No pressure.",

  problemHeadline: "Your Roof Is Your Home's First Line Of Defense.",
  problemPoints: [
    "Leaks that travel inside walls before a ceiling stain ever appears",
    "Curling or missing shingles that compound quickly under Georgia's UV and storm season",
    "Attic moisture damage that quietly compromises insulation and framing for years",
    "Insurance claims denied as 'pre-existing' — when the damage is clearly storm-related",
  ],
  problemSolution:
    "Siding Depot's roofing team inspects, documents, and resolves your roofing system issues using GAF-certified materials and methods. We manage permits, assist with insurance documentation, and complete most residential replacements in one to two days — backed by a written warranty, not a verbal promise.",

  optionsEyebrow: "Roofing Systems",
  optionsHeadline: "Four Systems. One Right Choice For Your Home.",
  optionsSubheadline:
    "Every system we specify is rated for Georgia's heat, humidity, and storm season — engineered for the conditions your home actually faces.",
  options: [
    {
      id: "architectural",
      title: "Architectural Shingles",
      subtitle: "Most popular · Best value",
      image: "/projects/project-1.webp",
      description:
        "GAF Timberline HDZ and UHDZ — the most installed residential shingle in North America. LayerLock technology, StainGuard Plus algae protection, and WindProven unlimited wind warranty when installed as a complete GAF system.",
    },
    {
      id: "metal",
      title: "Standing-Seam Metal",
      subtitle: "50+ year lifespan · Premium",
      image: "/projects/project-3.webp",
      description:
        "Steel or aluminum standing-seam panels with concealed fasteners, superior hail resistance, and energy-reflective coatings. For homeowners who want a final roofing decision — not another replacement cycle in 20 years.",
    },
    {
      id: "flat",
      title: "Low-Slope TPO Membrane",
      subtitle: "Flat roofs · Covered additions",
      image: "/projects/project-4.webp",
      description:
        "TPO single-ply membrane for flat and low-slope applications — covered porches and additions. Heat-welded seams form a continuous watertight barrier built for Georgia's 50+ inches of annual rainfall.",
    },
    {
      id: "repair",
      title: "Storm Repair & Insurance Work",
      subtitle: "Fast turnaround · Documentation ready",
      image: "/projects/project-2.webp",
      description:
        "Targeted repair of hail-damaged, wind-lifted, or leaking sections. We provide written inspection reports with photographs for insurance claims and coordinate directly with adjusters to document and protect your coverage.",
    },
  ],

  processEyebrow: "How It Works",
  processHeadline: "From First Call To A Dry Home.",
  processSubheadline:
    "Roofing projects should never be mysterious. We eliminate uncertainty at every step — from inspection through final sign-off.",
  steps: [
    {
      num: "01",
      title: "Free Roof Inspection",
      desc: "We come to your property and evaluate the full roof — decking, shingles, flashing, and ridge — at no charge. You receive a written findings report with photographs the same day.",
    },
    {
      num: "02",
      title: "Property & Insurance Evaluation",
      desc: "We assess storm damage, calculate square footage, identify decking conditions, and walk you through your coverage options before any claim is filed.",
    },
    {
      num: "03",
      title: "Detailed Written Proposal",
      desc: "You receive an itemized quote: materials, labor, decking repairs, underlayment, flashing, and permit fees. The number in the proposal is the number you pay — no changes mid-project.",
    },
    {
      num: "04",
      title: "Professional Installation",
      desc: "Our W-2 roofing crews arrive on schedule, protect your property, remove the existing system, and install your new roof to GAF manufacturer specifications. Most homes are finished in one to two days.",
    },
    {
      num: "05",
      title: "Final Walkthrough & Warranty",
      desc: "We walk the completed project with you, confirm site clean-up, and hand you GAF warranty documentation in writing. The project doesn't close until you're satisfied.",
    },
  ],

  projectsLabel: "Recent Roofing Projects\nAcross Metro Atlanta.",

  authorityEyebrow: "Why Our Warranty Is Different",
  authorityHeadline: "Most Roofers Can't Back",
  authorityHeadlineAccent: "What They Install.",
  authorityBody1:
    "A roof warranty is only as strong as the contractor behind it. GAF's Golden Pledge® — the strongest residential roofing warranty available — is exclusive to GAF Master Elite contractors. It covers materials and workmanship for 25 years, fully non-prorated.",
  authorityBody2:
    "Standard contractors typically offer a one-year verbal guarantee backed by nothing in writing. Ours is documented, transferable on home sale, and backed by North America's largest roofing manufacturer. That distinction matters the day you need to use it.",
  authorityRows: [
    ["Workmanship coverage", "1-year verbal", "25-year written"],
    ["Material warranty", "Basic limited", "50-year GAF"],
    ["Transferable on sale", "No", "Yes"],
    ["Wind protection", "Standard", "WindProven unlimited"],
  ],
  authorityCta: "Schedule My Free Inspection",

  whyUsHeadline: "Six Reasons North Atlanta Homeowners Choose Siding Depot For Roofing.",
  whyUsSubheadline:
    "We're not the cheapest option in the area. We're the one your neighbor calls back to thank you for recommending.",

  ctaEyebrow: "Free Consultation",
  ctaHeadline: "Find Out What's Happening",
  ctaHeadlineAccent: "On Your Roof Today.",
  ctaBody1:
    "Most roof problems are invisible until they become expensive. A free inspection uncovers what's developing — before it becomes a leak inside your home.",
  ctaBody2:
    "We respond within 24 hours, come to your home on your schedule, and deliver a written findings report at no charge.",
  ctaMainBtn: "Book My Free Roof Inspection",
  ctaTrustPoints: [
    "No-obligation inspection",
    "Same-day written report",
    "W-2 crews · Not subcontracted",
  ],

  faqTitle: "Roofing questions,",
  faqTitleAccent: "answered.",
  faqs: FAQS,
};

export const Route = createFileRoute("/roofing")({
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
            "Roofing Installation & Storm Repair in North Atlanta",
            seo.metaDesc,
            "/roofing",
            OG_IMAGE,
          ),
        ),
      },
      { type: "application/ld+json", children: JSON.stringify(getFaqSchema([...FAQS])) },
    ],
  }),
  component: () => <ServicePageLayout config={CONFIG} />,
});
