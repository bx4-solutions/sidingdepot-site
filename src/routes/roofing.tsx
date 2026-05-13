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

const PAGE_TITLE = "GAF Certified Roof Replacement in Marietta, GA | Siding Depot";
const PAGE_DESC =
  "GAF Factory Certified roof replacement & storm damage repair. Golden Pledge 50-year warranty available. Serving Marietta, Alpharetta, Milton & Canton. Licensed & insured. Free estimate in 24h. Call (678) 400-2012.";
const HERO_IMAGE = "/projects/project-7.webp";
const CANONICAL = "https://sidingdepot.com/roofing";

const FAQS: ReadonlyArray<FaqItem> = [
  {
    q: "How much does roof replacement cost in Marietta, GA in 2026?",
    a: "A full roof replacement in the Marietta and North Atlanta area typically costs $9,000–$18,000 for asphalt shingles on a standard 2,000 sq ft home. GAF Timberline HDZ — the most popular option — runs $10,000–$14,000 installed. Metal roofing costs $18,000–$35,000 but lasts 40–70 years. Cobb County permit fees add $250–$500 to the project total.",
  },
  {
    q: "Does homeowner's insurance cover roof replacement in Georgia?",
    a: "Yes, if the damage was caused by a covered event — hail, wind, fallen tree, or fire. Georgia's storm season creates thousands of roof insurance claims annually across Cobb, Cherokee, and Fulton counties. We inspect for storm damage, document it with photos, provide an insurance-grade estimate, and can meet your adjuster on-site. You pay only your deductible.",
  },
  {
    q: "How do I know if I need a roof repair or full replacement in Atlanta?",
    a: "Repairs are appropriate for isolated damage — a few missing shingles, a small leak, or flashing issues. If your roof is 15+ years old, has multiple leak points, or sustained widespread storm damage, replacement is more cost-effective long-term. We offer free inspections and give you an honest recommendation — we don't push replacements when repairs will do.",
  },
  {
    q: "How long does a roof replacement take in Cherokee or Cobb County?",
    a: "Most residential roof replacements in North Atlanta take 1–2 days. We start early, complete in one day when possible, and leave your property clean. You won't have an exposed roof overnight. We pull all required permits with Cobb, Cherokee, or Fulton county before starting work.",
  },
  {
    q: "What roofing brands do you use and what warranties are offered?",
    a: "We install GAF Timberline HDZ shingles as our primary product — GAF is North America's largest roofing manufacturer. As a GAF Factory Certified contractor, we offer the Golden Pledge warranty (50 years on product, 25 years on labor), which is only available through certified installers. We also install Owens Corning Duration series.",
  },
  {
    q: "Should I be worried about roof damage after a hail storm in Marietta?",
    a: "Yes. Georgia's hail season (March through June) causes significant roof damage that isn't always visible from the ground. Even quarter-sized hail can bruise asphalt shingles, reducing their lifespan by years. Most insurance policies require you to file a claim within 1 year of the storm date. After any storm, we recommend a free inspection — there's no obligation and no cost.",
  },
];

const CHECKLIST: ReadonlyArray<ChecklistItem> = [
  { Icon: Award, title: "GAF Factory Certified", desc: "Only certified contractors can offer the GAF Golden Pledge warranty (50-year product, 25-year labor)." },
  { Icon: ShieldCheck, title: "License & insurance", desc: "Verify a current Georgia GC license plus general liability and workers' comp before any deposit." },
  { Icon: FileText, title: "Itemized written estimate", desc: "Insist on tear-off, decking inspection, underlayment, drip edge, ice & water shield, ridge vent, flashing — not a single lump sum." },
  { Icon: Wrench, title: "W-2 crews, not day labor", desc: "Roofing is dangerous and warranty-critical. W-2 employees are trained, insured and accountable." },
  { Icon: Search, title: "Recent local reviews", desc: "Look for 50+ recent Google reviews from Cobb, Cherokee or Fulton county — and drive past completed jobs after one storm season." },
  { Icon: Clock, title: "Realistic timeline", desc: "A standard tear-off and reinstall is 1–2 days. Anyone promising same-day on a complex roof is cutting corners on prep or cleanup." },
];

export const Route = createFileRoute("/roofing")({
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
      serviceJsonLd("Roof Replacement & Repair", PAGE_DESC, { canonical: CANONICAL, image: HERO_IMAGE, serviceType: "Roof Replacement & Repair" }),
      faqJsonLd(FAQS),
    ],
  }),
  component: RoofingPage,
});

function RoofingPage() {
  return (
    <ServiceLandingPage
      eyebrow="GAF Factory Certified · Top Roofer"
      title="GAF roofing,"
      titleAccent="built for Georgia storm season."
      intro="Marietta's trusted GAF Factory Certified roofer. Full replacement, hail and wind repair, and storm-damage insurance work — backed by the GAF Golden Pledge 50-year product warranty."
      heroImage={HERO_IMAGE}
      benefits={[
        "GAF Factory Certified — Golden Pledge warranty available",
        "Hail and wind storm damage specialists (March–June season)",
        "Insurance claim documentation and adjuster meetings",
        "1–2 day install on standard 2,000 sq ft homes",
      ]}
      hiringRole="roofing contractor"
      hiringIntro="A roof is a 20–50 year decision. Use this checklist before you sign with anyone — including us."
      hiringChecklist={CHECKLIST}
      faqLabel="Roofing"
      faqs={FAQS}
      seoParagraph="Siding Depot is a GAF Factory Certified roofing contractor based in Marietta, GA, serving Cobb County, Cherokee County and Fulton County across Metro Atlanta. We replace and repair asphalt shingle and metal roofs in Marietta, Alpharetta, Milton, Canton, Woodstock, Roswell, Kennesaw, Johns Creek, Sandy Springs and Acworth — all engineered for North Atlanta's heat, humidity, and hail season. Most full residential roof replacements in our service area run $9,000–$18,000 in 2026, and we handle insurance documentation for storm-damage claims after Georgia's spring and summer storm cycles."
      ctaAccent="decades, not seasons?"
      trustBadge={{ title: "GAF Factory Certified", subtitle: "Golden Pledge Warranty" }}
    />
  );
}
