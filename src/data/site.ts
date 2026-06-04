export const SITE = {
  name: "Siding Depot",
  legalName: "Siding Depot LLC",
  phone: "(678) 400-2012",
  phoneHref: "tel:+16784002012",
  whatsapp: "16784002012",
  email: "office@sidingdepot.com",
  address: {
    street: "3036 Roswell Rd",
    city: "Marietta",
    state: "GA",
    zip: "30062",
    full: "3036 Roswell Rd, Marietta, GA 30062",
  },
  hours: "Mon–Sat: 8:00 AM – 6:00 PM",
  greenSkyUrl:
    "https://projects.greensky.com/merchantloanapplication?apptype=short&merchant=81018569&dealerplan=2521&channel=External-Button-03",
  ghlWebhookUrl: import.meta.env.VITE_GHL_WEBHOOK_URL ?? "",
  social: {
    facebook: "https://www.facebook.com/SidingDepot",
    instagram: "https://www.instagram.com/sidingdepot/",
    youtube: "https://www.youtube.com/channel/UCz1pbny99aDrwC9qvqZ0qyg",
    tiktok: "https://www.tiktok.com/@sidingdepot",
  },
} as const;

/**
 * HERO config — change these paths to swap the homepage Hero background.
 * Drop your image into `public/` (e.g. `public/hero-home.webp`) and update the
 * paths below. No code changes required. The mobile variant is optional but
 * recommended for faster loads on phones.
 */
export const HERO = {
  bgImage: "/hero-home.webp",
  bgImageMobile: "/hero-home-sm.webp",
  bgAlt: "Newly renovated North Atlanta home with James Hardie siding by Siding Depot",
} as const;

import {
  PanelsTopLeft,
  PaintRoller,
  AppWindow,
  Hammer,
  CloudRain,
  Triangle,
  Truck,
  type LucideIcon,
} from "lucide-react";

import sidingImg from "@/assets/services/siding.webp";

import paintingImg from "@/assets/services/painting.jpg";
import paintingWebp from "@/assets/services/painting.webp";
import paintingAvif from "@/assets/services/painting.avif";
import windowsImg from "@/assets/services/windows.jpg";
import windowsWebp from "@/assets/services/windows.webp";
import windowsAvif from "@/assets/services/windows.avif";
import deckImg from "@/assets/services/deck.jpg";
import deckWebp from "@/assets/services/deck.webp";
import deckAvif from "@/assets/services/deck.avif";
import guttersImg from "@/assets/services/gutters.jpg";
import guttersWebp from "@/assets/services/gutters.webp";
import guttersAvif from "@/assets/services/gutters.avif";
import roofingImg from "@/assets/services/roofing.jpg";
import roofingWebp from "@/assets/services/roofing.webp";
import roofingAvif from "@/assets/services/roofing.avif";
import dumpsterImg from "@/assets/services/dumpster.jpg";
import dumpsterWebp from "@/assets/services/dumpster.webp";
import dumpsterAvif from "@/assets/services/dumpster.avif";

export type ServiceImage = {
  /** Fallback raster (JPEG/WebP) used as <img src>. */
  src: string;
  /** Optional WebP variant for <source type="image/webp">. */
  webp?: string;
  /** Optional AVIF variant for <source type="image/avif">. */
  avif?: string;
};

export const SERVICES: ReadonlyArray<{
  slug: string;
  title: string;
  short: string;
  Icon: LucideIcon;
  image: ServiceImage;
}> = [
  { slug: "siding", title: "James Hardie Siding", short: "Elite Preferred installation. HardieZone HZ10 engineered for Georgia's heat, humidity and storms.", Icon: PanelsTopLeft, image: { src: sidingImg } },
  { slug: "painting", title: "Exterior Painting", short: "Sherwin-Williams premium with UV protection.", Icon: PaintRoller, image: { src: paintingImg, webp: paintingWebp, avif: paintingAvif } },
  { slug: "windows", title: "Windows", short: "Energy-efficient replacements that lower bills.", Icon: AppWindow, image: { src: windowsImg, webp: windowsWebp, avif: windowsAvif } },
  { slug: "doors", title: "Entry & Patio Doors", short: "Secure and stylish doors by Therma-Tru & ProVia.", Icon: AppWindow, image: { src: windowsImg, webp: windowsWebp, avif: windowsAvif } },
  { slug: "deck", title: "Deck Construction", short: "Custom decks in composite, hardwood and PT.", Icon: Hammer, image: { src: deckImg, webp: deckWebp, avif: deckAvif } },
  { slug: "gutters", title: "Gutter Systems", short: "Seamless aluminum gutters and LeafGuard.", Icon: CloudRain, image: { src: guttersImg, webp: guttersWebp, avif: guttersAvif } },
  { slug: "roofing", title: "Roofing", short: "GAF Factory Certified — replacement & repair.", Icon: Triangle, image: { src: roofingImg, webp: roofingWebp, avif: roofingAvif } },
  { slug: "dumpster", title: "Dumpster Rental", short: "10/15/20 yd — same-day delivery in North Atlanta.", Icon: Truck, image: { src: dumpsterImg, webp: dumpsterWebp, avif: dumpsterAvif } },
];

export const CITIES = [
  { slug: "marietta", name: "Marietta", county: "Cobb County" },
  { slug: "alpharetta", name: "Alpharetta", county: "Fulton County" },
  { slug: "milton", name: "Milton", county: "Fulton County" },
  { slug: "canton", name: "Canton", county: "Cherokee County" },
  { slug: "woodstock", name: "Woodstock", county: "Cherokee County" },
  { slug: "roswell", name: "Roswell", county: "Fulton County" },
  { slug: "kennesaw", name: "Kennesaw", county: "Cobb County" },
  { slug: "johns-creek", name: "Johns Creek", county: "Fulton County" },
  { slug: "sandy-springs", name: "Sandy Springs", county: "Fulton County" },
  { slug: "acworth", name: "Acworth", county: "Cobb County" },
] as const;

export const STATS = [
  { value: "1,500+", label: "Homes Transformed" },
  { value: "12+", label: "Years in Georgia" },
  { value: "98%", label: "5-Star Reviews" },
  { value: "4.9★", label: "Google Rating" },
] as const;

export const PROOF_BAR = [
  { icon: "⭐", label: "4.9 · 128 Verified Reviews" },
  { icon: "🏆", label: "Elite Preferred · Top 2% US" },
  { icon: "✅", label: "GA License #RBQA006789" },
  { icon: "🏠", label: "1,500+ North Atlanta Homes" },
  { icon: "💰", label: "GreenSky 0% APR Financing" },
] as const;

export const PROCESS_STEPS = [
  {
    num: "01",
    title: "Consultation",
    desc: "Free on-site visit in Marietta e região, Alpharetta or anywhere in North Atlanta. We measure, assess, and deliver a written, itemized proposal — usually the same day. No pressure. No obligation.",
  },
  {
    num: "02",
    title: "Renovation",
    desc: "Your dedicated project manager is on-site daily. Our W-2 crews — never subcontractors — handle every aspect of the installation. You get a daily update call or text.",
  },
  {
    num: "03",
    title: "Celebration",
    desc: "Final walk-through to make sure every detail meets your expectations. Then step back to the curb and admire your transformed home.",
  },
] as const;

export const AWARDS = [
  { name: "James Hardie Elite Preferred", subtitle: "Top 2% of US installers" },
  { name: "GAF Factory Certified", subtitle: "Roofing system warranty" },
  { name: "Google · 4.9★", subtitle: "128+ verified reviews" },
  { name: "Licensed & Insured", subtitle: "Georgia GC #RBQA006789" },
  { name: "BBB Accredited", subtitle: "A+ rating" },
  { name: "GreenSky Financing", subtitle: "0% APR plans available" },
] as const;

/**
 * Canonical list of services. Used as:
 *  - Multi-select options in quote forms (HeroQuoteForm, project admin)
 *  - Filter chips on /projects
 *  - URL slugs for /services/$slug SEO landing pages
 *  - Allowed values for Project.tags
 */
export const SERVICE_OPTIONS = [
  "Siding",
  "Painting",
  "Windows",
  "Doors",
  "Gutters",
  "Decks",
  "Roof",
] as const;

export type ProjectTag = (typeof SERVICE_OPTIONS)[number];

/** Map a service label to its URL-safe slug used by /services/$slug. */
export function serviceSlug(label: ProjectTag): string {
  return label.toLowerCase();
}

export type Project = {
  /** Unique URL-safe identifier used for /projects/$slug. */
  slug: string;
  src: string;
  alt: string;
  tags: ReadonlyArray<ProjectTag>;
  /** Headline shown over the card on the /projects page. */
  title?: string;
  /** Service category label shown at the bottom of the card. */
  category?: string;
  /** City + state shown on the detail page (e.g. "Marietta, GA"). */
  city?: string;
  /** Publish date as ISO 8601 (e.g. "2026-04-29"). */
  date?: string;
  /** Long-form description for the detail page / SEO. */
  description?: string;
};

export const PROJECTS: ReadonlyArray<Project> = [
  {
    slug: "hardie-board-batten-marietta",
    src: "/projects/project-1.webp",
    alt: "Two-story Marietta home with new James Hardie blue siding, fresh paint and white trim",
    tags: ["Siding", "Painting", "Windows"],
    title: "James Hardie Board & Batten Siding — Marietta, GA",
    category: "Siding Installation & Replacement",
    city: "Marietta, GA",
    date: "2026-04-29",
    description:
      "Full James Hardie Board & Batten siding replacement on a two-story Marietta home, paired with fresh exterior paint and crisp white trim. Engineered for HardieZone HZ10 — built to last in Georgia weather.",
  },
  {
    slug: "hardieplank-repaint-alpharetta",
    src: "/projects/project-2.webp",
    alt: "Cape Cod style home in Alpharetta with new white HardiePlank siding and yellow front door",
    tags: ["Siding", "Painting", "Roof"],
    title: "HardiePlank Siding & Full Repaint — Alpharetta, GA",
    category: "Siding Installation & Replacement",
    city: "Alpharetta, GA",
    date: "2026-04-22",
    description:
      "Cape Cod home in Alpharetta transformed with white HardiePlank lap siding, complete exterior repaint and a refreshed roofline. ColorPlus® Technology baked-on finish keeps the color sharp.",
  },
  {
    slug: "fiber-cement-cedarmill-cumming",
    src: "/projects/project-3.webp",
    alt: "Renovated split-level home with white siding and dark trim accents in North Atlanta",
    tags: ["Siding", "Painting"],
    title: "Fiber Cement Board & Cedarmill Siding — Cumming, GA",
    category: "Siding Installation & Replacement",
    city: "Cumming, GA",
    date: "2026-04-21",
    description:
      "Split-level home in Cumming reclad with fiber cement Board & Batten plus Cedarmill accents, finished with high-contrast trim and a fresh paint system.",
  },
  {
    slug: "exterior-repaint-shake-roswell",
    src: "/projects/project-4.webp",
    alt: "Newly painted white home with two-car garage and shake siding gable",
    tags: ["Painting", "Siding"],
    title: "Exterior Repaint & Shake Gable Refresh — Roswell, GA",
    category: "Exterior Painting",
    city: "Roswell, GA",
    date: "2026-04-12",
    description:
      "Bright exterior repaint with refreshed shake-style gable detailing on a Roswell home. Sherwin-Williams premium system with UV protection.",
  },
  {
    slug: "deep-blue-repaint-gutters-kennesaw",
    src: "/projects/project-5.webp",
    alt: "Two-story Cobb County home repainted in deep blue with crisp white trim and gutters",
    tags: ["Painting", "Gutters"],
    title: "Deep Blue Repaint & Seamless Gutters — Kennesaw, GA",
    category: "Exterior Painting",
    city: "Kennesaw, GA",
    date: "2026-04-05",
    description:
      "Two-story Kennesaw home in deep navy blue with crisp white trim and brand-new seamless aluminum gutters.",
  },
  {
    slug: "hardie-repaint-deck-canton",
    src: "/projects/project-6.webp",
    alt: "Three-story Canton home with bold blue siding, white trim and rebuilt rear deck",
    tags: ["Siding", "Painting", "Decks"],
    title: "Hardie Siding, Repaint & Rebuilt Deck — Canton, GA",
    category: "Siding Installation & Replacement",
    city: "Canton, GA",
    date: "2026-03-28",
    description:
      "Three-story Canton home re-sided with James Hardie, freshly painted, and finished with a rebuilt rear deck for outdoor living.",
  },
  {
    slug: "craftsman-siding-roof-roswell",
    src: "/projects/project-7.webp",
    alt: "Tan craftsman style home in Roswell with new gables, dark garage doors and roofing",
    tags: ["Siding", "Roof"],
    title: "Craftsman Siding & Roof Replacement — Roswell, GA",
    category: "Siding & Roofing",
    city: "Roswell, GA",
    date: "2026-03-18",
    description:
      "Craftsman-style Roswell home with new gable detailing, GAF Factory Certified roofing system and refreshed garage doors.",
  },
  {
    slug: "windows-deck-repaint-milton",
    src: "/projects/project-8.webp",
    alt: "Backyard view of repainted home with new windows and rebuilt wood deck",
    tags: ["Windows", "Decks", "Painting"],
    title: "New Windows, Deck Rebuild & Repaint — Milton, GA",
    category: "Windows & Decks",
    city: "Milton, GA",
    date: "2026-03-09",
    description:
      "Backyard transformation in Milton: energy-efficient windows, a fully rebuilt wood deck and a fresh exterior paint system.",
  },
];

/** Projects sorted by date descending (most recent first). */
export const PROJECTS_SORTED: ReadonlyArray<Project> = [...PROJECTS].sort(
  (a, b) => (b.date ?? "").localeCompare(a.date ?? ""),
);

/** Format an ISO date as a readable label (e.g. "April 29, 2026"). */
export function formatProjectDate(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export const BEFORE_AFTER_PAIRS = [
  {
    before: "/projects/project-1-before.webp",
    after: "/projects/project-1.webp",
    beforeAlt: "Marietta home before renovation with peeling paint and worn siding",
    afterAlt: "Same Marietta home transformed with James Hardie blue siding by Siding Depot",
  },
  {
    before: "/projects/project-5-before.webp",
    after: "/projects/project-5.webp",
    beforeAlt: "Two-story home before renovation with faded, mildewed siding",
    afterAlt: "Same home repainted in deep blue with white trim by Siding Depot",
  },
] as const;
