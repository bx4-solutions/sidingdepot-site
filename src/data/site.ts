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
  hours: "Mon–Fri: 8:00 AM – 5:00 PM",
  greenSkyUrl: "https://www.greensky.com/home-improvement/",
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
  bgAlt: "Newly renovated Marietta home with James Hardie siding by Siding Depot",
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

import sidingImg from "../assets/services/siding.webp";

import paintingImg from "../assets/services/painting.jpg";
import paintingWebp from "../assets/services/painting.webp";
import paintingAvif from "../assets/services/painting.avif";
import windowsImg from "../assets/services/windows.jpg";
import windowsWebp from "../assets/services/windows.webp";
import windowsAvif from "../assets/services/windows.avif";
import doorsWebp from "../assets/services/doors.webp";
import deckImg from "../assets/services/deck.jpg";
import deckWebp from "../assets/services/deck.webp";
import deckAvif from "../assets/services/deck.avif";
import guttersImg from "../assets/services/gutters.jpg";
import guttersWebp from "../assets/services/gutters.webp";
import guttersAvif from "../assets/services/gutters.avif";
import roofingImg from "../assets/services/roofing.jpg";
import roofingWebp from "../assets/services/roofing.webp";
import roofingAvif from "../assets/services/roofing.avif";
import dumpsterImg from "../assets/services/dumpster.jpg";
import dumpsterWebp from "../assets/services/dumpster.webp";
import dumpsterAvif from "../assets/services/dumpster.avif";

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
  {
    slug: "siding",
    title: "James Hardie Siding",
    short:
      "Explore the full james hardie hz10 product lineup, including lap siding, board & batten, shake siding, trim, soffit, fascia, and modern architectural panels—all professionally installed and painted to match your home's style.",
    Icon: PanelsTopLeft,
    image: { src: sidingImg },
  },
  {
    slug: "painting",
    title: "Exterior Painting",
    short:
      "Sherwin-Williams Duration paint with premium UV protection and Lifetime limited warranty against peeling and blistering.",
    Icon: PaintRoller,
    image: { src: paintingImg, webp: paintingWebp, avif: paintingAvif },
  },
  {
    slug: "gutters",
    title: "Gutter Systems",
    short:
      "Aluminum Seamless Gutters, Downspouts, and Leaf-Free High Water Flow Gutter Guard Covers",
    Icon: CloudRain,
    image: { src: guttersImg, webp: guttersWebp, avif: guttersAvif },
  },
  {
    slug: "windows",
    title: "Windows",
    short:
      "Explore a wide selection of window styles, colors, frame options, and decorative grids designed to enhance your home's curb appeal.",
    Icon: AppWindow,
    image: { src: windowsImg, webp: windowsWebp, avif: windowsAvif },
  },
  {
    slug: "doors",
    title: "Entry & Patio Doors",
    short:
      "Fiberglass, steel, French, and sliding patio doors available in a wide range of colors, glass options, and architectural styles.",
    Icon: AppWindow,
    image: { src: doorsWebp },
  },
  {
    slug: "decks",
    title: "Deck Construction",
    short:
      "Explore composite and pressure-treated wood decking options with custom railings, stairs, landings, covered areas and design layouts tailored to your outdoor space.",
    Icon: Hammer,
    image: { src: deckImg, webp: deckWebp, avif: deckAvif },
  },
  {
    slug: "roofing",
    title: "Roofing",
    short:
      "North Atlanta's trusted roofing contractor — GAF architectural shingles, standing-seam metal, and TPO systems, plus storm-damage repair and insurance documentation. In-house crews and full permit management.",
    Icon: Triangle,
    image: { src: roofingImg, webp: roofingWebp, avif: roofingAvif },
  },
  {
    slug: "dumpster",
    title: "Dumpster Rental",
    short: "10/15/20 yd — same-day delivery in Marietta.",
    Icon: Truck,
    image: { src: dumpsterImg, webp: dumpsterWebp, avif: dumpsterAvif },
  },
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
  { value: "1,500+", label: "Homes in North Atlanta" },
  { value: "20+", label: "Years in Georgia" },
  { value: "98%", label: "5-Star Reviews" },
  { value: "4.5★", label: "Google Rating" },
] as const;

export const PROOF_BAR = [
  { icon: "⭐", label: "4.5 · 166 Google Reviews" },
  { icon: "🏆", label: "James Hardie Elite Contractor · Marietta, GA" },
  { icon: "🔨", label: "4.7 · 256 GuildQuality Reviews" },
  { icon: "🏠", label: "1,500+ North Atlanta Homes" },
  { icon: "💰", label: "GreenSky 0% APR Financing" },
] as const;

export const PROCESS_STEPS = [
  {
    num: "01",
    title: "Consultation",
    desc: "Meet with a James Hardie trained exterior specialist to discuss your project, explore options, and receive a detailed, itemized written estimate within 24 hours.",
  },
  {
    num: "02",
    title: "Approval & Planning",
    desc: "Once your estimate details are approved and the agreement is signed, our team will coordinate a start date that works with your schedule. Your project is prepared for production, materials and dumpster delivery are scheduled, and everything is organized for a smooth installation.",
  },
  {
    num: "03",
    title: "Customer Portal Access",
    desc: "Gain access to the Siding Depot app, where you can track project progress in real time, view photos and updates, review documents, communicate with your project team, and stay informed every step of the way.",
  },
  {
    num: "04",
    title: "Installation",
    desc: "Our highly specialized in-house crews complete the work while our team oversees the installation and keeps you updated throughout the process.",
  },
  {
    num: "05",
    title: "Final Walkthrough",
    desc: "We review the completed project with you, address any final details, and ensure everything meets your expectations before considering the job complete.",
  },
] as const;

export const AWARDS = [
  { name: "JAMES HARDIE ELITE CONTRACTOR", subtitle: "Top installers in the USA" },
  { name: "GAF Certified Roofing Contractor", subtitle: "Roof system warranty" },
  {
    name: "4.7 ⭐️ 512+ Verified Reviews",
    subtitle: "Across Google, GuildQuality, Thumbtack, and AngiLeads",
  },
  { name: "Licensed & Insured", subtitle: "Fully licensed, bonded and insured" },
  { name: "BBB Accredited", subtitle: "A+ Rating" },
  { name: "Best of Houzz Service 2026", subtitle: "Awarded for customer service excellence" },
] as const;

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

export function serviceSlug(label: ProjectTag): string {
  return label.toLowerCase();
}

export type Project = {
  slug: string;
  src: string;
  alt: string;
  tags: ReadonlyArray<ProjectTag>;
  title?: string;
  category?: string;
  city?: string;
  date?: string;
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
    slug: "hardie-repaint-deck-marietta-e-regiao",
    src: "/projects/project-6.webp",
    alt: "Three-story Marietta home with bold blue siding, white trim and rebuilt rear deck",
    tags: ["Siding", "Painting", "Decks"],
    title: "Hardie Siding, Repaint & Rebuilt Deck — Marietta, GA",
    category: "Siding Installation & Replacement",
    city: "Marietta, GA",
    date: "2026-03-28",
    description:
      "Three-story Marietta home re-sided with James Hardie, freshly painted, and finished with a rebuilt rear deck for outdoor living.",
  },
];

export const PROJECTS_SORTED: ReadonlyArray<Project> = [...PROJECTS].sort((a, b) =>
  (b.date ?? "").localeCompare(a.date ?? ""),
);

export function formatProjectDate(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export const BEFORE_AFTER_PAIRS = [
  {
    before: "/projects/home-before.webp",
    after: "/projects/home-after.webp",
    beforeAlt: "Marietta home before renovation with faded tan siding and worn trim",
    afterAlt: "Same Marietta home transformed with dark olive-green James Hardie siding and black trim by Siding Depot",
  },
  {
    before: "/projects/project-5-before.webp",
    after: "/projects/project-5.webp",
    beforeAlt: "Two-story home before renovation with faded, mildewed siding",
    afterAlt: "Same home repainted in deep blue with white trim by Siding Depot",
  },
] as const;
