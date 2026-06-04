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

const HERO_IMAGE = "/projects/project-5.webp";
const CANONICAL = "https://sidingdepot.com/painting";
const SERVICE_KEY = "painting";
const CITY = "Marietta e Região";

const seo = SERVICE_METADATA[SERVICE_KEY];

const FAQS: ReadonlyArray<FaqItem> = [
  {
    q: "How much does exterior house painting cost in Marietta e Região, GA?",
    a: "Exterior painting in Marietta e Região typically costs $3,500–$8,000 for a standard 2,000–2,500 sq ft home, depending on stories, surface condition, and paint quality. Homes with hardboard or fiber cement siding may require additional prep. We use Sherwin-Williams Duration or Emerald exterior — both rated for Georgia's UV exposure and humidity.",
  },
  {
    q: "How often should I repaint the exterior of my home in Georgia?",
    a: "In North Atlanta's heat and humidity, a quality repaint with premium Sherwin-Williams coatings lasts 8–12 years. If your home has wood siding, you may need a refresh every 5–7 years to prevent rot. Homes with James Hardie siding typically hold paint much longer. We recommend a 10-year cycle to protect your structural substrate from moisture intrusion.",
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
  { Icon: Award, title: "Premium paint system", desc: "Insist on Sherwin-Williams Emerald or Duration grade — not contractor-grade builder paint that fades inside 3 summers." },
  { Icon: ShieldCheck, title: "License & insurance", desc: "Verify a current Georgia GC license plus general liability and workers' comp before any deposit changes hands." },
  { Icon: FileText, title: "Itemized scope of work", desc: "Demand a written scope: power-wash, scrape, sand, prime, caulk, two finish coats. A vague single price hides corner-cutting." },
  { Icon: Wrench, title: "Highly specialized certified teams, not day labor", desc: "Ask who actually paints. highly specialized certified professionals are trained, insured, and accountable for the warranty." },
  { Icon: Search, title: "Recent local reviews", desc: "50+ recent Google reviews from your county, with photos. Drive past completed jobs after 2 summers — that is the real test." },
  { Icon: Clock, title: "Honest timeline", desc: "A typical full exterior repaint runs 4–8 working days depending on prep. Anything faster is skipping prep — the step that actually makes paint last." },
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
      eyebrow="Sherwin-Williams · PRO Preferred"
      title="Exterior Painting,"
      titleAccent="High-Performance Systems."
      intro="A repaint should last a decade, not a few seasons. We utilize Sherwin-Williams® Emerald and Duration systems to create a UV-resistant thermal barrier that handles North Atlanta's extreme temperature swings."
      benefits={[
        "Sherwin-Williams Emerald® UV-shield coatings",
        "Multi-stage prep: wash, scrape, sand, and prime",
        "Self-cleaning technology resists dirt and mildew",
        "5-year workmanship warranty on all full repaints",
      ]}
      hiringRole="exterior painter"
      hiringIntro="A repaint is your home's primary line of defense against moisture. Use this checklist to ensure your painting partner doesn't skip critical surface preparation."
      hiringChecklist={CHECKLIST}
      faqLabel="Painting"
      faqs={FAQS}
      seoParagraph="Siding Depot provides professional exterior painting across Marietta e Região. We specialize in high-performance Sherwin-Williams systems engineered for North Atlanta's UV exposure and high humidity. In 2026, a full exterior repaint in our service area typically runs $3,500–$8,000, and our multi-stage preparation process ensures your home's substrate is stabilized and protected for 8–12 years."
      ctaAccent="quality and durability?"
      trustBadge={{ title: "Sherwin-Williams PRO", subtitle: "Premium System Certified" }}
    />
  );
}
