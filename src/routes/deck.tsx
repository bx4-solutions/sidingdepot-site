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

const PAGE_TITLE = "Deck Construction in Marietta, GA | Siding Depot — Free Estimate";
const PAGE_DESC =
  "Custom composite, hardwood and pressure-treated decks built for Georgia weather. Serving Marietta, Alpharetta, Milton, Canton & North Atlanta. Licensed & insured. Free estimate in 24h. Call (678) 400-2012.";
const HERO_IMAGE = "/projects/project-6.webp";
const CANONICAL = "https://sidingdepot.com/deck";

const FAQS: ReadonlyArray<FaqItem> = [
  {
    q: "How much does a deck cost in Marietta or Canton, GA in 2026?",
    a: "A pressure-treated wood deck in North Atlanta runs $15–$25 per square foot installed, so a 300 sq ft deck costs $4,500–$7,500. Composite decking (Trex, TimberTech) costs $30–$55 per square foot — so $9,000–$16,500 for the same deck — but lasts 25–30 years with virtually no maintenance. Elevated decks, screened porches, and multi-level designs increase cost.",
  },
  {
    q: "Do I need a permit to build a deck in Cherokee or Cobb County?",
    a: "Yes. Any deck over 30 inches above grade requires a building permit in Cobb, Cherokee, and Fulton counties. The permit process includes structural plan review and typically 2–3 inspections (framing, electrical if applicable, final). Permit fees range $150–$600 depending on project value. We manage the entire permit process — you don't deal with the county.",
  },
  {
    q: "What's the best decking material for Georgia's heat and humidity?",
    a: "For low-maintenance, composite decking (Trex Transcend or TimberTech AZEK) is the best choice for Georgia. Wood decks absorb moisture, warp in summer heat, and require sealing or staining every 2–3 years. Composite holds color, won't splinter, and handles Georgia's 50+ inches of annual rain without swelling. For budget projects, pressure-treated pine is still the most popular choice.",
  },
  {
    q: "How long does deck construction take in North Atlanta?",
    a: "A standard 300–400 sq ft deck takes 3–5 days to build once permits are approved. Permit approval in Cherokee and Cobb counties typically takes 5–15 business days. We recommend starting the permit process 3–4 weeks before your desired start date, especially in spring and summer when our schedule fills quickly.",
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

export const Route = createFileRoute("/deck")({
  head: () => ({
    meta: buildServiceMeta({
      title: PAGE_TITLE,
      description: PAGE_DESC,
      image: HERO_IMAGE,
      canonical: CANONICAL,
    }),
    scripts: [
      serviceJsonLd("Deck Construction & Installation", PAGE_DESC),
      faqJsonLd(FAQS),
    ],
  }),
  component: DeckPage,
});

function DeckPage() {
  return (
    <ServiceLandingPage
      eyebrow="Trex · TimberTech · Pressure-Treated"
      title="Custom decks,"
      titleAccent="built for Georgia outdoor living."
      intro="Marietta's trusted deck builder. Composite (Trex Transcend, TimberTech AZEK), hardwood and pressure-treated decks — engineered for Georgia humidity and permitted with Cobb, Cherokee or Fulton county before day one."
      heroImage={HERO_IMAGE}
      benefits={[
        "Composite decking with 25–30 year material warranty",
        "Permit-ready engineered plans, every project",
        "Stainless / coated hardware rated for PT lumber",
        "65–75% ROI on resale in the Atlanta metro market",
      ]}
      hiringRole="deck builder"
      hiringIntro="A deck is a permitted structure that has to live through 50+ inches of rain a year. Use this checklist before you sign with anyone — including us."
      hiringChecklist={CHECKLIST}
      faqLabel="Deck"
      faqs={FAQS}
      seoParagraph="Siding Depot designs and builds custom decks across Cobb County, Cherokee County and Fulton County, including Marietta, Alpharetta, Milton, Canton, Woodstock, Roswell, Kennesaw, Johns Creek, Sandy Springs and Acworth. We specialize in composite systems (Trex Transcend, TimberTech AZEK) that hold up to Georgia's heat, humidity and 50+ inches of annual rainfall — and we handle all building permits with Cobb, Cherokee or Fulton county on every deck above 30 inches. In 2026, pressure-treated decks in our service area run $15–$25 per square foot installed, while composite runs $30–$55 per square foot."
      ctaAccent="decades, not seasons?"
      trustBadge={{ title: "Trex Pro Installer", subtitle: "Composite warranty unlocked" }}
    />
  );
}
