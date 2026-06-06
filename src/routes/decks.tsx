import { createFileRoute } from "@tanstack/react-router";
import { ServicePageLayout, type ServicePageConfig } from "@/components/site/ServicePageLayout";
import { SERVICE_METADATA } from "@/data/seo-config";
import decksHeroAsset from "@/assets/decks-hero.png.asset.json";
import { LOCAL_BUSINESS_SCHEMA, getServiceSchema, getFaqSchema } from "@/lib/schema";

const HERO_IMAGE = decksHeroAsset.url;
const OG_IMAGE = "https://sidingdepot.com/og-default.webp";
const CANONICAL = "https://sidingdepot.com/decks";
const seo = SERVICE_METADATA["decks"];

const FAQS = [
  { q: "How much does a deck cost in Greater Marietta in 2026?", a: "Pressure-treated wood decks in our service area run $15–$25 per square foot installed — so a 300 sq ft deck costs $4,500–$7,500. Composite decking (Trex, TimberTech AZEK) runs $30–$55 per square foot for the same size, but lasts 25–30 years with no staining, no sealing, and no splinters. We provide written, itemized estimates — not ballpark guesses." },
  { q: "Do I need a permit to build a deck in Cobb or Cherokee County?", a: "Yes. Any deck over 30 inches above grade requires a building permit in Cobb, Cherokee, and Fulton counties. The process includes structural plan review and 2–3 inspections. Permit fees range $150–$600 depending on project value. We manage the full permit process — you never deal directly with the county." },
  { q: "What decking material is best for Georgia's climate?", a: "Composite decking is the top performer in Georgia. Trex Transcend and TimberTech AZEK hold color, resist moisture, and don't splinter regardless of summer heat or 50-plus annual inches of rain. Pressure-treated pine is popular for budget projects but requires sealing or staining every 2–3 years." },
  { q: "How long does deck construction take?", a: "A standard 300–400 sq ft deck takes 3–5 build days once permits are approved. Permit approval typically takes 5–15 business days in Cobb, Cherokee, and Fulton. We recommend initiating the permit process 3–4 weeks before your target start date — especially in spring and summer." },
  { q: "Does a new deck add resale value in the Atlanta market?", a: "Consistently yes. A well-built composite deck returns 65–75% of its cost at resale in the Atlanta metro according to Remodeling Magazine's Cost vs. Value Report. In high-demand areas like Milton, Alpharetta, and Roswell, outdoor living space is a meaningful competitive advantage." },
  { q: "Can you build screened porches or multi-level decks?", a: "Yes. We design and build in any configuration — single-level, multi-level, L-shaped, and screened porches. Every design starts with a free consultation and a site-specific structural plan, not a template from a catalog." },
  { q: "What is Trex and why do you recommend it?", a: "Trex is a composite decking brand made from 95% recycled material. Trex Transcend carries a 25-year fade and stain warranty. It's the most installed composite brand in North America — not because of marketing, but because it performs. We're a certified Trex Pro installer." },
  { q: "Is financing available for a deck project?", a: "Yes. Through our GreenSky® partnership you can apply for 0% APR in 60 seconds with a soft credit check. Approval decisions are typically instant." },
] as const;

const CONFIG: ServicePageConfig = {
  heroImage: HERO_IMAGE,
  heroImageAlt: "Beautiful composite deck built by Siding Depot for a North Atlanta homeowner",
  heroBadge: "Trex Pro · TimberTech Certified Installer",
  heroLine1: "Transform Your Backyard",
  heroLine2: "Into The Space",
  heroLine3: "Your Family Deserves.",
  heroSubtitle: "Custom composite and wood decks across Greater Marietta — engineered for Georgia's heat and humidity, permit-managed from start to finish, and built to increase the value and livability of your outdoor space.",
  problemHeadline: "Your Backyard Has More Potential Than A Worn-Out Deck Can Offer.",
  problemPoints: [
    "Splintering boards that keep your family off the deck through summer",
    "Rot and moisture damage spreading under the surface — invisible until it becomes structural",
    "A layout that wastes square footage and doesn't match how your family lives outside",
    "Annual maintenance costs for staining, sealing, and board replacement that never end",
  ],
  problemSolution: "Siding Depot designs and builds custom composite and pressure-treated decks across North Atlanta. As a certified Trex Pro installer, we construct outdoor living spaces built to Georgia's specific conditions — with permit-ready engineered plans, stainless hardware, and 25-year material warranties. No annual maintenance, no early replacement.",
  optionsEyebrow: "Deck Systems",
  optionsHeadline: "Four Approaches. One Perfect Outdoor Space.",
  optionsSubheadline: "Every deck system we build is specified for Georgia's heat, humidity, and heavy rain season. Click to explore each option.",
  options: [
    { id: "composite", title: "Composite Decking", subtitle: "25-yr warranty · Zero maintenance", image: "/projects/project-1.webp", description: "Trex Transcend and TimberTech AZEK — no staining, no sealing, no splinters. Fade and stain warranty backed by the manufacturer for 25 years, certified by us as a Trex Pro installer." },
    { id: "pressure-treated", title: "Pressure-Treated Wood", subtitle: "Budget-friendly · Classic look", image: "/projects/project-4.webp", description: "Southern Yellow Pine pressure-treated lumber — the most cost-effective structural decking option. Correct hardware is critical in Georgia's humidity. We don't cut corners on the details others skip." },
    { id: "multilevel", title: "Multi-Level & Custom Design", subtitle: "Elevated · Architectural", image: "/projects/project-3.webp", description: "Multi-tier, L-shaped, and wraparound designs that match your home's footprint and your family's outdoor lifestyle. Every custom layout begins with site-specific engineered plans." },
    { id: "screened", title: "Screened Porches", subtitle: "Year-round comfort · Bug-free", image: "/projects/project-2.webp", description: "Screened porch enclosures that extend your outdoor season through Georgia's spring and fall. Composite or wood framing, tight screening, and ceiling fans create an outdoor room your family can actually use." },
  ],
  processEyebrow: "How We Build It",
  processHeadline: "From Design To Your First Dinner Outside.",
  processSubheadline: "Deck projects involve permits, structural engineering, and material lead times. We manage every step so you don't have to.",
  steps: [
    { num: "01", title: "Free Outdoor Living Consultation", desc: "We visit your property, measure the space, evaluate grade and footing requirements, and discuss how your family wants to use the deck. You leave with a clear vision — we leave with everything we need to design." },
    { num: "02", title: "Site & Structural Evaluation", desc: "We assess ledger attachment points, footing depth, drainage, and HOA setback requirements specific to your lot — before a single board is ordered." },
    { num: "03", title: "Permit-Ready Design & Proposal", desc: "You receive stamped framing plans, footing specs, and a detailed written estimate with material, labor, and permit costs itemized. The price in the proposal is the price you pay." },
    { num: "04", title: "Professional Installation", desc: "Our W-2 deck crews build to engineered plans using specified materials and stainless fasteners. We manage county inspections at no additional cost." },
    { num: "05", title: "Final Walkthrough & Warranty Transfer", desc: "We walk the finished deck with you, confirm clean-up, and transfer your Trex or TimberTech material warranty in writing. Your outdoor space is ready to use the day we leave." },
  ],
  projectsLabel: "Recent Deck Projects\nAcross Metro Atlanta.",
  authorityEyebrow: "Why Certified Installation Matters",
  authorityHeadline: "Any Contractor Can Buy",
  authorityHeadlineAccent: "Composite Boards.",
  authorityBody1: "Trex Pro certification isn't a sticker — it's a qualification that unlocks the full 25-year warranty on Trex Transcend. Non-certified installers can sell you the same boards, but their installation voids the manufacturer warranty the moment something goes wrong.",
  authorityBody2: "As a certified Trex Pro installer, every Siding Depot composite deck qualifies for the full material warranty — and every install follows Trex's engineering specifications for fastening, spacing, and ventilation. That distinction is invisible at installation and critical five years later.",
  authorityRows: [
    ["Material warranty", "5-yr (voided if non-cert)", "25-yr Trex full"],
    ["Fastener type", "Standard (corrodes in humidity)", "Stainless/ACQ-rated"],
    ["Permit handling", "Homeowner's responsibility", "Fully managed"],
    ["Engineering plans", "Informal sketch", "Stamped & county-filed"],
  ],
  authorityCta: "Get My Free Deck Design Consultation",
  whyUsHeadline: "Six Reasons North Atlanta Homeowners Choose Siding Depot For Their Deck.",
  whyUsSubheadline: "Your deck is a structural extension of your home. We treat it that way — from footing depth to final fastener.",
  ctaEyebrow: "Free Design Consultation",
  ctaHeadline: "See What Your Backyard",
  ctaHeadlineAccent: "Could Actually Look Like.",
  ctaBody1: "Most homeowners don't know what's possible until they see it. Our consultation walks you through composite systems, custom layouts, and color combinations — with references from projects in your neighborhood.",
  ctaBody2: "Schedule a free outdoor living consultation today. We respond within 24 hours and come to your home ready to design — not just to sell.",
  ctaMainBtn: "Book My Free Deck Consultation",
  ctaTrustPoints: ["No-obligation consultation", "Permit-ready engineered plans", "Trex Pro certified installer"],
  faqTitle: "Deck questions,",
  faqTitleAccent: "answered.",
  faqs: FAQS,
};

export const Route = createFileRoute("/decks")({
  head: () => ({
    meta: [
      { title: seo.metaTitle("Greater Marietta") },
      { name: "description", content: seo.metaDesc },
      { property: "og:title", content: seo.metaTitle("Greater Marietta") },
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
      { type: "application/ld+json", children: JSON.stringify(getServiceSchema("Custom Deck Construction in Greater Marietta", seo.metaDesc, "/decks", OG_IMAGE)) },
      { type: "application/ld+json", children: JSON.stringify(getFaqSchema([...FAQS])) },
    ],
  }),
  component: () => <ServicePageLayout config={CONFIG} />,
});
