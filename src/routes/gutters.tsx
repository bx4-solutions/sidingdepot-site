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
const CANONICAL = "https://sidingdepot.com/gutters";
const SERVICE_KEY = "gutters";
const CITY = "Greater Marietta";

const seo = SERVICE_METADATA[SERVICE_KEY];

const FAQS: ReadonlyArray<FaqItem> = [
  {
    q: "How much does gutter installation cost in Greater Marietta, GA?",
    a: "Seamless aluminum gutter installation in Greater Marietta typically costs $1,200–$3,500 for a standard home, depending on linear footage, gutter size (5\" vs 6\"), and whether gutter guards are included. 6-inch gutters are strongly recommended for Georgia — our rainfall averages 50+ inches per year, and standard 5-inch gutters frequently overflow during summer storms.",
  },
  {
    q: "What size gutters does a home in Greater Marietta need?",
    a: "We recommend 6-inch K-style gutters for most homes in Greater Marietta. Georgia receives some of the highest annual rainfall in the Southeast — standard 5-inch gutters can't handle the flow during summer thunderstorms, leading to overflow, foundation damage, and erosion. 6-inch gutters move 40% more water.",
  },
  {
    q: "How often should gutters be cleaned in Georgia?",
    a: "Twice a year minimum — spring (after pollen season) and fall (after leaves drop). Homes near pine trees in Cherokee or Cobb counties may need cleaning 3–4 times per year, as pine needles accumulate quickly and block downspouts. Clogged gutters cause fascia rot, foundation problems, and basement flooding — all expensive replacements.",
  },
  {
    q: "Are gutter guards worth it in Atlanta?",
    a: "For most North Atlanta homeowners, yes. Georgia's combination of heavy rain, pine pollen, and leaf fall makes gutters clog faster than average. Quality gutter guards (LeafGuard, MicroMesh) reduce cleaning frequency to once per year and prevent the standing water that breeds mosquitoes — a real concern in our climate. ROI over 5–7 years vs cleaning costs is typically positive.",
  },
  {
    q: "Can clogged gutters damage my foundation in Georgia?",
    a: "Yes — this is one of the most common and costly problems we see in Cobb and Cherokee counties. When gutters overflow, water pools at the foundation. Georgia's clay-heavy soil expands and contracts with moisture, accelerating foundation movement. We've seen $30,000+ foundation replacements that started with a $200 gutter cleaning that was skipped for years.",
  },
];

const CHECKLIST: ReadonlyArray<ChecklistItem> = [
  { Icon: Award, title: "Seamless, on-site forming", desc: "Sectional gutters leak at every joint. Demand seamless aluminum cut on-site to your exact runs." },
  { Icon: ShieldCheck, title: "License & insurance", desc: "Ladder work above 20 feet is high-risk. Verify GA GC license plus general liability and workers' comp." },
  { Icon: FileText, title: "Itemized written estimate", desc: "Linear footage, hangers per run, downspouts, splash blocks and guard model — never a single lump sum." },
  { Icon: Wrench, title: "Hidden hangers, not spike-and-ferrule", desc: "Hidden hangers screwed into fascia hold 50% better than 1990s-era spikes that pull free under our rainfall." },
  { Icon: Search, title: "6-inch K-style for North Atlanta", desc: "5-inch gutters are undersized for Georgia rainfall. Insist on 6-inch capacity and 3x4 downspouts." },
  { Icon: Clock, title: "Realistic timeline", desc: "A standard home takes 4–8 hours start to finish. Beware crews that quote a multi-day install — usually means undermanned." },
];

export const Route = createFileRoute("/gutters")({
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
      serviceJsonLd("Seamless Gutter Installation", seo.metaDesc, { canonical: CANONICAL, image: HERO_IMAGE, serviceType: "GutterContractor" }),
      faqJsonLd(FAQS),
    ],
  }),
  component: GuttersPage,
});

function GuttersPage() {
  return (
    <ServiceLandingPage
      serviceKey={SERVICE_KEY}
      city={CITY}
      heroImage={HERO_IMAGE}
      eyebrow="Seamless Aluminum · LeafGuard"
      title="6-Inch Seamless Gutters:"
      titleAccent="High-Volume Protection."
      intro="Protect your foundation from Georgia's 50+ inches of annual rain. Our 6-inch seamless systems move 40% more water than standard gutters, preventing basement leaks and fascia rot."
      benefits={[
        "6-inch K-style gutters move 40% more water than 5-inch",
        "Seamless aluminum formed on-site — no leaky joints",
        "LeafGuard / MicroMesh guards for pine-heavy yards",
        "Most homes installed in 4–8 hours",
      ]}
      hiringRole="gutter installer"
      hiringIntro="Gutters are your foundation's primary defense against erosion. Use this checklist to verify pitch engineering and material capacity for heavy Georgia rainfall."
      hiringChecklist={CHECKLIST}
      faqLabel="Gutter"
      faqs={FAQS}
      seoParagraph="Siding Depot installs seamless aluminum gutters and LeafGuard systems across Greater Marietta. Metro Atlanta receives 50+ inches of rainfall a year — combined with heavy pine pollen, our climate clogs and overwhelms undersized 5-inch gutters within a couple of seasons. We size every system for Greater Marietta rainfall and Georgia's clay-heavy soil, where overflow leads directly to foundation movement and costly replacements."
      ctaAccent="years, not seasons?"
      trustBadge={{ title: "LeafGuard Authorized", subtitle: "Lifetime no-clog warranty" }}
    />
  );
}
