import { createFileRoute } from "@tanstack/react-router";
import { Award, ShieldCheck, FileText, Wrench, Search, Clock } from "lucide-react";
import {
  ServiceLandingPage,
  buildServiceMeta,
  faqJsonLd,
  serviceJsonLd,
  type FaqItem,
  type ChecklistItem,
} from "@/components/site/ServiceLandingPage";
import dumpsterHeroAsset from "@/assets/dumpster-hero.png.asset.json";

const PAGE_TITLE = "Dumpster Rental in Marietta, GA | Siding Depot — Free Estimate";
const PAGE_DESC =
  "10, 15 and 20-yard dumpsters with same-day or next-day delivery in North Atlanta. Serving Marietta, Alpharetta, Milton, Greater Marietta & North Atlanta. Licensed & insured. Free estimate in 24h. Call (678) 400-2012.";
const HERO_IMAGE = dumpsterHeroAsset.url;
const CANONICAL = "https://sidingdepot.com/dumpster";

const FAQS: ReadonlyArray<FaqItem> = [
  {
    q: "How much does dumpster rental cost in Marietta or Woodstock, GA?",
    a: "Dumpster rental in the North Atlanta area typically costs $350–$650 for a 10–20 yard dumpster for a standard 7-day rental. Price depends on dumpster size, rental period, and disposal fees. We serve Marietta, Greater Marietta, Woodstock, Kennesaw, and surrounding cities with same-day or next-day delivery available.",
  },
  {
    q: "What size dumpster do I need for a home renovation in Georgia?",
    a: "For a room cleanout or small project: 10-yard dumpster. For a kitchen or bathroom remodel: 15-yard. For a full home renovation, siding replacement, or roofing project: 20-yard. As a rule of thumb, it's better to go one size up — an overfilled dumpster creates safety issues and extra fees.",
  },
  {
    q: "Can I put siding, shingles, and construction debris in a dumpster?",
    a: "Yes — construction debris including old siding, shingles, drywall, wood framing, and general renovation waste is accepted. We cannot accept hazardous materials: paint, chemicals, tires, batteries, or appliances with refrigerant. If your home has older siding that may contain asbestos (common in homes built before 1980), contact us before renting — asbestos requires special disposal.",
  },
  {
    q: "Do I need a permit for a dumpster in Marietta or Greater Marietta?",
    a: "You don't need a permit if the dumpster is placed on your private property (driveway). If it needs to go on a public street or ROW, a permit may be required from Cobb County or the City of Marietta. We handle this coordination — just let us know your placement preference when booking.",
  },
];

const CHECKLIST: ReadonlyArray<ChecklistItem> = [
  {
    Icon: Award,
    title: "Right-sized for the job",
    desc: "10 yd for cleanouts, 15 yd for one-room remodels, 20 yd for full siding/roof projects. Going one size up is almost always cheaper than an overfill fee.",
  },
  {
    Icon: ShieldCheck,
    title: "Driveway protection",
    desc: "A reputable hauler uses wood planks under the rollers to protect your asphalt or concrete driveway from gouging.",
  },
  {
    Icon: FileText,
    title: "Transparent pricing",
    desc: "Insist on a written quote that includes delivery, pickup, disposal fees, weight allowance, and overage rate per ton.",
  },
  {
    Icon: Wrench,
    title: "Same-day or next-day delivery",
    desc: "Local haulers in North Atlanta should deliver within 24 hours. Multi-day waits usually mean a broker, not a real local company.",
  },
  {
    Icon: Search,
    title: "Knows what you can't load",
    desc: "A good rental partner tells you upfront: no paint, chemicals, tires, batteries, refrigerant appliances — and flags asbestos risk on pre-1980 homes.",
  },
  {
    Icon: Clock,
    title: "Flexible rental period",
    desc: "Standard rentals are 7 days. Make sure you can extend at a fair daily rate without renegotiating the whole contract.",
  },
];

export const Route = createFileRoute("/dumpster")({
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
      serviceJsonLd("Dumpster Rental", PAGE_DESC, {
        canonical: CANONICAL,
        image: HERO_IMAGE,
        serviceType: "Dumpster Rental",
      }),
      faqJsonLd(FAQS),
    ],
  }),
  component: DumpsterPage,
});

function DumpsterPage() {
  return (
    <ServiceLandingPage
      serviceKey="dumpster"
      eyebrow="10 / 15 / 20 yd · Same-Day Delivery"
      title="Dumpster rental,"
      titleAccent="ready when your project is."
      intro="Marietta's trusted dumpster rental partner for siding, roofing and renovation projects. 10, 15 and 20-yard roll-offs with same-day or next-day delivery across North Atlanta — and a written, transparent quote before we drop."
      heroImage={HERO_IMAGE}
      heroImageSide
      heroImageAlt="Dumpster for rental from Siding Depot"
      benefits={[
        "10, 15 and 20-yard roll-off sizes",
        "Same-day or next-day delivery in North Atlanta",
        "Driveway-safe drop with wood plank protection",
        "Transparent flat pricing — delivery, pickup, disposal",
      ]}
      hiringRole="dumpster rental company"
      hiringIntro="A bad rental costs you more in surprise fees than the dumpster itself. Use this checklist before you book with anyone — including us."
      hiringChecklist={CHECKLIST}
      faqLabel="Dumpster"
      faqs={FAQS}
      seoParagraph="Siding Depot rents construction-grade roll-off dumpsters across Cobb County, Cherokee County and Fulton County, including Marietta, Alpharetta, Milton, Greater Marietta, Woodstock, Roswell, Kennesaw, Johns Creek, Sandy Springs and Acworth. Same-day or next-day delivery is standard in our North Atlanta service area, and 2026 pricing for a 10–20 yard roll-off on a 7-day rental runs $350–$650 all-in. We accept standard construction debris — old siding, shingles, drywall, framing — and will flag pre-1980 homes that may need asbestos testing before we drop."
      ctaAccent="without surprise fees?"
      trustBadge={{ title: "Same-Day Delivery", subtitle: "10 / 15 / 20 yd roll-offs" }}
    />
  );
}
