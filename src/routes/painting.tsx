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
import paintingHeroAsset from "@/assets/painting-hero.png.asset.json";

const HERO_IMAGE = paintingHeroAsset.url;
const CANONICAL = "https://sidingdepot.com/painting";
const SERVICE_KEY = "painting";
const CITY = "Greater Marietta";

const seo = SERVICE_METADATA[SERVICE_KEY];

const FAQS: ReadonlyArray<FaqItem> = [
  {
    q: "How much does exterior house painting cost in Greater Marietta, GA?",
    a: "Exterior painting in Greater Marietta typically costs $3,500–$8,000 for a standard 2,000–2,500 sq ft home, depending on stories, surface condition, and paint quality. Homes with hardboard or fiber cement siding may require additional prep. We use Sherwin-Williams Duration or Emerald exterior — both rated for Georgia's UV exposure and humidity.",
  },
  {
    q: "How often should I repaint the exterior of my home in Greater Marietta?",
    a: "In Georgia's heat and humidity, a quality repaint with premium Sherwin-Williams coatings lasts 8–12 years. If your home has wood siding, you may need a refresh every 5–7 years to prevent rot. Homes with James Hardie siding typically hold paint much longer. We recommend a 10-year cycle to protect your structural substrate from moisture intrusion.",
  },
  {
    q: "What kind of paint do you use for Georgia's climate?",
    a: "We specify Sherwin-Williams® Emerald and Duration exterior systems. These are high-performance acrylic coatings engineered with UV-inhibitors and mildewcides specifically designed for the humidity of the Southeast. These paints form a breathable but moisture-proof thermal barrier that resists the fading and peeling common in Georgia summers.",
  },
  {
    q: "Do you use subcontractors or highly specialized certified professionals for painting?",
    a: "We use professional Highly specialized certified teams who are trained in our specific multi-stage preparation process. Unlike many painting companies that use day laborers or rotating subcontractors, our teams are consistent, insured, and accountable for the final finish. This ensures your warranty is backed by Siding Depot directly.",
  },
  {
    q: "What is your exterior painting preparation process?",
    a: "Preparation is 70% of a quality repaint. Our process includes: professional pressure washing to remove oxidation, hand-scraping loose paint, mechanical sanding of rough edges, replacing any rotted wood, applying a dedicated primer coat, and sealing all joints with high-flex elastomeric caulk before the two finish coats are applied.",
  },
];

const CHECKLIST: ReadonlyArray<ChecklistItem> = [
  { 
    Icon: Award, 
    title: "Sherwin-Williams Duration® & SuperPaint®", 
    desc: "We only use Sherwin-Williams premium exterior lines — never cheap builder-grade paint. Duration® carries a 15-year warranty against peeling and fading in Georgia's climate." 
  },
  { 
    Icon: ShieldCheck, 
    title: "Full Prep — Not Just Paint", 
    desc: "Pressure washing, scraping, caulking, wood rot repair and primer coat — every time. Skipping prep is why other companies' work fails in 2 years. We don't skip steps." 
  },
  { 
    Icon: FileText, 
    title: "Color Consultation Included", 
    desc: "Our project managers bring Sherwin-Williams color samples to your home. We help you choose colors that complement your siding, trim and neighborhood. No extra charge." 
  },
  { 
    Icon: Wrench, 
    title: "Written Estimate — Price Guaranteed", 
    desc: "You receive an itemized written estimate before work starts. The price in the estimate is the price you pay. No 'discovered' issues that double the invoice mid-project." 
  },
  { 
    Icon: Search, 
    title: "W-2 Crews — Not Day Labor", 
    desc: "Every painter on your property is a Siding Depot W-2 employee. Trained, background-checked, insured, and accountable to us — not a temporary hire you've never met." 
  },
  { 
    Icon: Clock, 
    title: "Combination Projects — Save More", 
    desc: "Most of our painting projects are combined with siding or other exterior work. When you do multiple services together, you save on setup, prep and project management costs." 
  },
];

export const Route = createFileRoute("/painting")({
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
      serviceJsonLd("Exterior Painting", seo.metaDesc, { canonical: CANONICAL, image: HERO_IMAGE, serviceType: "PaintingContractor" }),
      faqJsonLd(FAQS),
    ],
  }),
  component: PaintingPage,
});

function PaintingPage() {
  return (
    <ServiceLandingPage
      serviceKey={SERVICE_KEY}
      city={CITY}
      heroImage={HERO_IMAGE}
      eyebrow="Exterior Painting — North Atlanta"
      title="Exterior Painting in Marietta &"
      titleAccent="North Atlanta, GA"
      intro={"Georgia's heat and humidity are relentless. UV exposure, temperature swings from 20°F in January to 100°F in August, and year-round moisture cause cheap exterior paint to crack, peel, and fade within 2–3 years.\n\nSiding Depot uses only Sherwin-Williams Duration® and SuperPaint® — premium exterior coatings engineered specifically for hot, humid climates like Marietta and Cherokee County. These paints carry a 15-year warranty against peeling and fading.\n\nEvery Siding Depot painting project starts with a thorough prep: pressure washing, scraping, caulking every gap and crack, and a full primer coat. The paint goes on last. This is why our results look better at year 5 than most competitors' results look at year 1.\n\nOur W-2 crews — never subcontractors — handle every exterior painting project in North Atlanta. A dedicated project manager oversees every stage. You receive a written, itemized estimate before a single brush touches your house. The price in the estimate is the price you pay."}
      benefits={[
        "Sherwin-Williams Duration® & SuperPaint®",
        "Full multi-stage surface preparation",
        "W-2 employee crews (never subcontractors)",
        "Written itemized estimates guaranteed",
      ]}
      hiringRole="exterior painter"
      hiringIntro="Premium paint. Proper prep. Professionals who show up on time and clean up when they leave."
      hiringChecklist={CHECKLIST}
      faqLabel="Painting"
      faqs={FAQS}
      seoParagraph="Professional exterior painting in Marietta, Canton and North Atlanta, GA. Sherwin-Williams Duration, W-2 crews, written estimates. Free quote: (678) 400-2012."
      ctaAccent="quality and durability?"
      trustBadge={{ title: "Sherwin-Williams PRO", subtitle: "Premium System Certified" }}
    />
  );
}
