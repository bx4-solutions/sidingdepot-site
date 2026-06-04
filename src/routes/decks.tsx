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

const HERO_IMAGE = "/projects/project-6.webp";
const CANONICAL = "https://sidingdepot.com/decks";
const SERVICE_KEY = "deck";
const CITY = "Greater Marietta";

const seo = SERVICE_METADATA[SERVICE_KEY];

const FAQS: ReadonlyArray<FaqItem> = [
  {
    q: "How much does a deck cost in Greater Marietta, GA in 2026?",
    a: "A pressure-treated wood deck in Greater Marietta runs $15–$25 per square foot installed, so a 300 sq ft deck costs $4,500–$7,500. Composite decking (Trex, TimberTech) costs $30–$55 per square foot — so $9,000–$16,500 for the same deck — but lasts 25–30 years. Elevated decks, screened porches, and multi-level designs increase cost.",
  },
  {
    q: "Do I need a permit to build a deck in Cherokee or Cobb County?",
    a: "Yes. Any deck over 30 inches above grade requires a building permit in Cobb, Cherokee, and Fulton counties. The permit process includes structural plan review and typically 2–3 inspections (framing, electrical if applicable, final). Permit fees range $150–$600 depending on project value. We manage the entire permit process — you don't deal with the county.",
  },
  {
    q: "What's the best decking material for Georgia's heat and humidity?",
    a: "For long-lasting, composite decking (Trex Transcend or TimberTech AZEK) is the best choice for Georgia. Wood decks absorb moisture, warp in summer heat, and require sealing or staining every 2–3 years. Composite holds color, won't splinter, and handles Georgia's 50+ inches of annual rain without swelling. For budget projects, pressure-treated pine is still the most popular choice.",
  },
  {
    q: "How long does deck construction take in Greater Marietta?",
    a: "A standard 300–400 sq ft deck takes 3–5 days to build once permits are approved. Permit approval typically takes 5–15 business days. We recommend starting the permit process 3–4 weeks before your desired start date, especially in spring and summer when our schedule fills quickly.",
  },
  {
    q: "Does a deck add value to a home in the Atlanta market?",
    a: "Yes — consistently. In the Atlanta metro market, a well-built composite deck returns 65–75% of its cost at resale according to Remodeling Magazine's Cost vs. Value Report. In high-demand areas like Milton, Alpharetta, and Roswell, outdoor living spaces are a strong selling point. Buyers in North Atlanta expect functional outdoor space — a deck differentiates your listing.",
  },
];

const CHECKLIST: ReadonlyArray<ChecklistItem> = [
  { Icon: Award, title: "Trex Pro / TimberTech installer", desc: "Manufacturer-certified composite installers unlock the strongest 25–30 year material warranties." },
  { Icon: ShieldCheck, title: "License & insurance", desc: "Decks above 30 inches are permitted structures. Verify a current GA GC license plus general liability and workers' comp." },
  { Icon: FileText, title: "Permit-ready engineered plans", desc: "Insist on stamped framing plans, footing depth, joist spacing and railing detail before signing." },
  { Icon: Wrench, title: "Stainless / coated hardware", desc: "Pressure-treated lumber chemistry corrodes standard fasteners fast in Georgia humidity. Demand stainless or ACQ-rated coated screws." },
  { Icon: Search, title: "Local reviews after a season", desc: "Composite holds up — but bad framing shows in year 2. Drive past completed jobs from at least one year ago." },
  { Icon: Clock, title: "Realistic timeline", desc: "Standard 300–400 sq ft deck is 3–5 build days plus 5–15 business days for Cobb / Cherokee / Fulton permit approval." },
];

export const Route = createFileRoute("/decks")({
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
      serviceJsonLd("Deck Construction & Installation", seo.metaDesc, { canonical: CANONICAL, image: HERO_IMAGE, serviceType: "DeckContractor" }),
      faqJsonLd(FAQS),
    ],
  }),
  component: DeckPage,
});

function DeckPage() {
  return (
    <ServiceLandingPage
      serviceKey={SERVICE_KEY}
      city={CITY}
      heroImage={HERO_IMAGE}
      eyebrow="Trex · TimberTech · Pressure-Treated"
      title="Custom Composite Decks:"
      titleAccent="Long-lasting Luxury."
      intro="Maximize your outdoor living with a deck built for decades, not seasons. As Trex Pro® installers, we build moisture-proof spaces that resist the warping, rotting, and fading common in North Atlanta."
      benefits={[
        "Composite decking with 25–30 year material warranty",
        "Permit-ready engineered plans, every project",
        "Stainless / coated hardware rated for PT lumber",
        "65–75% ROI on resale in the Atlanta metro market",
      ]}
      hiringRole="deck builder"
      hiringIntro="A custom deck is a structural extension of your home. Use this checklist to ensure your builder follows strict framing codes and utilizes Southeast-rated materials."
      hiringChecklist={CHECKLIST}
      faqLabel="Deck"
      faqs={FAQS}
      seoParagraph="Siding Depot designs and builds custom decks across Greater Marietta. We specialize in composite systems (Trex Transcend, TimberTech AZEK) that hold up to Georgia's heat, humidity and 50+ inches of annual rainfall — and we handle all building permits on every deck above 30 inches. In 2026, pressure-treated decks in our service area run $15–$25 per square foot installed, while composite runs $30–$55 per square foot."
      ctaAccent="decades, not seasons?"
      trustBadge={{ title: "Trex Pro Installer", subtitle: "Composite warranty unlocked" }}
    />
  );
}
