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

const PAGE_TITLE = "Entry & Patio Doors in Marietta, GA | Siding Depot — Secure & Stylish";
const PAGE_DESC =
  "Upgrade your home with Energy Star® entry and patio doors. Serving Marietta, Alpharetta & North Atlanta. Therma-Tru® authorized installer. Free estimate in 24h. Call (678) 400-2012.";
const HERO_IMAGE = "/projects/project-8.webp";
const CANONICAL = "https://sidingdepot.com/doors";

const FAQS: ReadonlyArray<FaqItem> = [
  {
    q: "How much does a new entry door cost in Marietta, GA?",
    a: "A professional entry door replacement in North Atlanta typically costs $1,500–$4,500 for fiberglass or steel doors, including installation. High-end custom wood doors or double-entry systems can range from $5,000–$10,000+. Factors affecting price include material, glass inserts, sidelights, and hardware. We recommend fiberglass for Georgia's humidity as it won't warp or rot like wood.",
  },
  {
    q: "What is the best entry door material for Georgia's humidity?",
    a: "Fiberglass is the #1 recommendation for Georgia homes. Unlike wood, fiberglass won't swell or rot in 100% humidity, and unlike steel, it doesn't conduct heat as much in the summer. Brands like Therma-Tru offer fiberglass doors that mimic real wood grain perfectly but require zero maintenance and offer 4x the insulating R-value of a standard wood door.",
  },
  {
    q: "Do I need a permit to replace a front door in Cobb or Cherokee County?",
    a: "If you are replacing the door within the existing frame size, a building permit is usually not required in Cobb, Cherokee, or Fulton counties. However, if we are enlarging the opening or changing the structural header, a permit is mandatory. We handle all structural assessments and permit filings so you stay compliant with local Georgia building codes.",
  },
  {
    q: "Are sliding patio doors better than French doors for Atlanta homes?",
    a: "It depends on space and use. Sliding doors (Gliding) are great for tight spaces and modern looks, offering large glass areas for natural light. French doors (Hinged) offer a classic look and a wider opening for moving furniture. For energy efficiency in Atlanta's heat, look for double-pane Low-E glass on either style to keep your AC bills down in July and August.",
  },
  {
    q: "How long does a door replacement take?",
    a: "Most single-door replacements are completed in 4–6 hours by our W-2 crews. Patio doors or entry systems with sidelights may take a full day. We ensure the home is secure and weather-tight before we leave, and we handle all disposal of your old door. Our process includes a final 20-point inspection of locks, seals, and threshold alignment.",
  },
];

const CHECKLIST: ReadonlyArray<ChecklistItem> = [
  { Icon: Award, title: "Authorized Dealer status", desc: "Always hire an authorized dealer for brands like Therma-Tru or ProVia to ensure your manufacturer warranty is valid and fully backed." },
  { Icon: ShieldCheck, title: "Georgia GC License", desc: "Front doors are a primary security point. Verify your contractor has a current Georgia GC license and full liability/workers' comp insurance." },
  { Icon: FileText, title: "Energy Star certification", desc: "In the Atlanta climate, look for doors with a U-factor < 0.25. This ensures the door is a thermal barrier, not just a slab of wood or metal." },
  { Icon: Wrench, title: "Precision Sill Alignment", desc: "A door that sticks or drafts is usually a sill or frame issue. Demand a technician who checks level and plumb at 5 points during install." },
  { Icon: Search, title: "Security Hardware Specs", desc: "Insist on 3-inch screws into the structural framing for the strike plate. Short screws are the #1 cause of easy forced entry." },
  { Icon: Clock, title: "Realistic Lead Times", desc: "Custom doors currently have 4–8 week lead times. Beware any contractor promising a custom entry system in 7 days — they are likely using stock big-box inventory." },
];

export const Route = createFileRoute("/doors")({
  head: () => ({
    meta: buildServiceMeta({
      title: PAGE_TITLE,
      description: PAGE_DESC,
      image: HERO_IMAGE,
      canonical: CANONICAL,
    }),
    links: [
      { rel: "canonical", href: CANONICAL },
      { rel: "preload", as: "image", href: HERO_IMAGE, fetchPriority: "high" as any },
    ],
    scripts: [
      serviceJsonLd("Entry & Patio Door Replacement", PAGE_DESC, { canonical: CANONICAL, image: HERO_IMAGE, serviceType: "Entry & Patio Door Replacement" }),
      faqJsonLd(FAQS),
    ],
  }),
  component: DoorsPage,
});

function DoorsPage() {
  return (
    <ServiceLandingPage
      eyebrow="Fiberglass · Steel · Patio · Storm"
      title="Custom Entry & Patio Doors,"
      titleAccent="engineered for security and style."
      intro="Upgrade your curb appeal and security simultaneously. We install high-performance Therma-Tru® and ProVia® door systems featuring multi-point locking and thermal-break thresholds designed for Georgia homes."
      heroImage={HERO_IMAGE}
      benefits={[
        "Fiberglass & steel options — no warping or rotting",
        "Energy Star certified with Low-E glass packages",
        "Multi-point locking systems for enhanced security",
        "Custom paint and stain finishes available",
      ]}
      hiringRole="door contractor"
      hiringIntro="Your entryway is your home's first impression and first line of security. Use this checklist to verify structural alignment and thermal efficiency standards."
      hiringChecklist={CHECKLIST}
      faqLabel="Door"
      faqs={FAQS}
      seoParagraph="Siding Depot replaces entry and patio doors across Cobb County, Cherokee County and Fulton County, including Marietta, Alpharetta, Milton, Canton, Woodstock, Roswell, Kennesaw, Johns Creek, Sandy Springs and Acworth. We specialize in fiberglass entry systems that handle North Atlanta's high humidity without the swelling or rotting common to wood doors. In 2026, most residential door replacements in our service area run $1,500–$4,500, and we specify Energy Star double-pane glass packages that reflect Georgia's summer heat while maintaining clear curb appeal."
      ctaAccent="security and efficiency?"
      trustBadge={{ title: "ProVia Authorized", subtitle: "Certified Entry Systems" }}
    />
  );
}
