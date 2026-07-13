import { createFileRoute } from "@tanstack/react-router";
import { ServicePageLayout, type ServicePageConfig } from "@/components/site/ServicePageLayout";
import { SERVICE_METADATA } from "@/data/seo-config";
import dumpsterHeroImg from "@/assets/dumpster-hero.webp";
import {
  LOCAL_BUSINESS_SCHEMA,
  getServiceSchema,
  getFaqSchema,
  getBreadcrumbSchema,
} from "@/lib/schema";

const HERO_IMAGE = dumpsterHeroImg;
const OG_IMAGE = "https://www.sidingdepot.com/og-default.webp";
const CANONICAL = "https://www.sidingdepot.com/dumpster-rental";
const seo = SERVICE_METADATA["dumpster-rental"];

const FAQS = [
  {
    q: "What size dumpster do I need for my project?",
    a: "For most residential cleanouts and remodeling projects: a 10-yard handles a single-room cleanout or small demo; a 15-yard covers a typical garage or basement cleanout; a 20-yard handles a full-home renovation project; a 30-yard is used for major construction, roofing tear-offs, or large deck removals. We'll confirm sizing during the booking call — over-ordering wastes money and under-ordering wastes a trip.",
  },
  {
    q: "What can I put in a rental dumpster?",
    a: "Accepted: construction debris, roofing materials, lumber, drywall, flooring, general household junk, furniture, and yard waste. Not accepted: hazardous materials (paint, chemicals, asbestos, batteries), electronics, tires, and liquids. If you're unsure about a specific item, call us before loading — we'd rather answer the question than have you pay a hazardous materials surcharge.",
  },
  {
    q: "How long can I keep a rental dumpster?",
    a: "Standard rental periods in North Atlanta are 7–14 days depending on the size and your project timeline. Extended rentals are available at a daily rate. We're flexible — a renovation project doesn't always finish on schedule, and we account for that.",
  },
  {
    q: "How much does dumpster rental cost in Cobb or Cherokee County?",
    a: "A 10-yard dumpster in North Atlanta runs $275–$375 for a standard 7-day rental. A 15-yard runs $325–$425. A 20-yard runs $400–$500. A 30-yard runs $475–$600. Pricing includes delivery, pickup, and standard tonnage — overweight fees apply if the load exceeds the weight limit specified in your rental agreement.",
  },
  {
    q: "Do I need a permit to place a dumpster on my property?",
    a: "Dumpsters placed on private driveways typically don't require permits in Cobb, Cherokee, or Fulton counties. Street placement does require a permit — we handle the permit process when street placement is necessary and build the cost into the quote. HOA restrictions vary: we can advise on approach based on your specific community.",
  },
  {
    q: "How quickly can you deliver a dumpster?",
    a: "Next-day delivery is standard for most locations in our service area when ordered before 2 PM. Same-day delivery is sometimes possible depending on availability and location — call to confirm. We text you a 2-hour delivery window the evening before scheduled delivery.",
  },
  {
    q: "What happens to the materials when you pick up the dumpster?",
    a: "We sort materials at our transfer station and divert recyclable materials — clean concrete, metal, and clean wood — from landfill where volume permits. Non-recyclable debris is disposed of at licensed Cobb and Cherokee County facilities. We provide disposal receipts upon request for permit-required projects.",
  },
  {
    q: "Can a dumpster damage my driveway?",
    a: "Loaded dumpsters are heavy — we place plywood boards under the dumpster feet on concrete or asphalt driveways to distribute weight and prevent cracking. On gravel driveways, boards aren't required. If your driveway has existing cracks or soft spots, let us know during booking and we'll discuss placement options.",
  },
] as const;

const CONFIG: ServicePageConfig = {
  heroImage: HERO_IMAGE,
  heroImageAlt: "Dumpster rental delivery for a North Atlanta renovation project by Siding Depot",
  heroBadge: "Next-Day Delivery · North Atlanta Service Area",
  heroLine1: "Fast, Reliable Dumpsters",
  heroLine2: "For Any Project Size.",
  heroLine3: "",
  trustBadgeLabel: "Next-Day Delivery · North Atlanta",
  heroSubtitle:
    "Dumpster rental across Cobb, Cherokee, and Fulton counties — next-day delivery, flexible rental periods, and transparent pricing with no hidden surcharges. From single-room cleanouts to full renovation hauls.",
  problemHeadline: "Debris Piling Up Slows Down Every Project.",
  problemPoints: [
    "Contractor delays while debris removal scheduling holds up the next phase of your renovation",
    "HOA notices and neighbor complaints about debris accumulating on your property",
    "Multiple haul trips in a pickup truck that cost more than a dumpster and take far longer",
    "Incorrect size ordering — too small means a second trip fee, too large means money wasted",
  ],
  problemSolution:
    "Siding Depot delivers the right dumpster to your driveway the next business day, keeps it as long as your project requires, and hauls it when you call. Transparent per-period pricing, no surprise surcharges, and a same-day booking process that doesn't require three emails to confirm.",
  optionsEyebrow: "Dumpster Sizes",
  optionsHeadline: "Four Sizes. Right-Sized For Your Project.",
  optionsSubheadline:
    "Ordering the wrong size is the most common dumpster rental mistake. We size the container to your actual project — not to the nearest available.",
  options: [
    {
      id: "10yd",
      title: "10-Yard Dumpster",
      subtitle: "Single room · Small cleanouts",
      image: "/projects/project-1.webp",
      description:
        "10 cubic yards — roughly the equivalent of 3–4 pickup truck loads. Ideal for single-room renovation debris, bathroom gut-outs, small deck removals, or a focused garage cleanout. Fits in most single-car driveway spaces.",
    },
    {
      id: "15yd",
      title: "15-Yard Dumpster",
      subtitle: "Garage · Basement · Roof section",
      image: "/projects/project-3.webp",
      description:
        "15 cubic yards — the most versatile size for residential projects. Covers a full garage or basement cleanout, a roofing section tear-off, or a multi-room renovation. The best balance of capacity and cost for most North Atlanta homeowners.",
    },
    {
      id: "20yd",
      title: "20-Yard Dumpster",
      subtitle: "Full renovation · Large tear-offs",
      image: "/projects/project-4.webp",
      description:
        "20 cubic yards for full-home renovation projects, complete roofing tear-offs, and large deck or addition demolitions. The go-to size for general contractors managing multi-trade residential projects in one debris cycle.",
    },
    {
      id: "30yd",
      title: "30-Yard Dumpster",
      subtitle: "Major construction · Commercial jobs",
      image: "/projects/project-2.webp",
      description:
        "30 cubic yards for major construction projects, commercial applications, and renovation projects generating sustained high debris volume. Requires a larger drop zone — we assess driveway access and placement during booking.",
    },
  ],
  processEyebrow: "How It Works",
  processHeadline: "Order Today. Delivered Tomorrow.",
  processSubheadline:
    "Dumpster rental should be the simplest part of your project. We keep it that way.",
  steps: [
    {
      num: "01",
      title: "Free Project Estimate & Sizing",
      desc: "Tell us your project type, timeline, and approximate debris volume. We recommend the right size — including whether a second swap-out pickup mid-project makes more sense than a single oversized container.",
    },
    {
      num: "02",
      title: "Placement & Access Evaluation",
      desc: "We confirm driveway dimensions, overhead clearance, and any HOA or street-placement permit requirements before delivery. No surprises on the day the truck arrives.",
    },
    {
      num: "03",
      title: "Transparent Written Quote",
      desc: "Flat-rate pricing covering the rental period, weight allowance, and pickup. Overage rates are disclosed upfront — no surprise line items on the final invoice.",
    },
    {
      num: "04",
      title: "Next-Day Delivery",
      desc: "The dumpster arrives in your confirmed placement window. We place protective boards under the feet on concrete and asphalt driveways to prevent surface damage.",
    },
    {
      num: "05",
      title: "Pickup On Your Schedule",
      desc: "Call or text when you're ready for pickup — or at the end of your rental period. We haul and handle disposal at licensed county facilities. Recycling diversion receipts available on request.",
    },
  ],
  projectsLabel: "Recent Projects We've\nSupported Across Metro Atlanta.",
  authorityEyebrow: "Why Rental Logistics Matter",
  authorityHeadline: "The Wrong Container",
  authorityHeadlineAccent: "At The Wrong Time Costs More.",
  authorityBody1:
    "The most expensive dumpster rental is one that arrives too small, gets swapped mid-project, and delays your contractor by a day while you wait for the replacement. The second most expensive is one that sits on your driveway longer than needed because pickup scheduling required 48 hours of lead time.",
  authorityBody2:
    "We right-size the container to your project scope, deliver next-day, and pick up when you call — not on a weekly schedule that assumes your project timeline is predictable. For contractors managing multiple jobs, we offer account pricing and priority scheduling across our North Atlanta service area.",
  authorityRows: [
    ["Delivery window", "2–5 business days", "Next business day"],
    ["Pickup scheduling", "Fixed weekly windows", "On-demand same-day"],
    ["Weight overage notice", "Post-pickup invoice", "Disclosed upfront in quote"],
    ["Contractor accounts", "Not available", "Priority pricing available"],
  ],
  authorityCta: "Get My Dumpster Quote",
  whyUsHeadline:
    "Six Reasons North Atlanta Contractors And Homeowners Choose Siding Depot For Dumpsters.",
  whyUsSubheadline:
    "We run dumpster rentals the same way we run construction projects — with clear communication, right-sizing, and no surprises at the end.",
  ctaEyebrow: "Get A Quote",
  ctaHeadline: "Right Size. Right Price.",
  ctaHeadlineAccent: "Right On Time.",
  ctaBody1:
    "Tell us your project scope and we'll have the correct container at your driveway the next business day. No upsizing to pad the margin. No hidden fees at pickup.",
  ctaBody2:
    "Call or submit a quote request online. We respond within two hours during business hours and confirm delivery the same day you book.",
  ctaMainBtn: "Get My Dumpster Quote",
  ctaTrustPoints: [
    "Next-day delivery available",
    "Transparent flat-rate pricing",
    "On-demand pickup scheduling",
  ],
  faqTitle: "Dumpster rental questions,",
  faqTitleAccent: "answered.",
  faqs: FAQS,
};

export const Route = createFileRoute("/dumpster-rental")({
  head: () => ({
    meta: [
      { title: seo.metaTitle("North Atlanta") },
      { name: "description", content: seo.metaDesc },
      { property: "og:title", content: seo.metaTitle("North Atlanta") },
      { property: "og:description", content: seo.metaDesc },
      { property: "og:image", content: OG_IMAGE },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "canonical", href: CANONICAL },
      { rel: "preload", as: "image", href: HERO_IMAGE, fetchPriority: "high" as any },
    ],
    scripts: [
      { type: "application/ld+json", children: JSON.stringify(LOCAL_BUSINESS_SCHEMA) },
      {
        type: "application/ld+json",
        children: JSON.stringify(
          getServiceSchema(
            "Dumpster Rental in North Atlanta",
            seo.metaDesc,
            "/dumpster-rental",
            OG_IMAGE,
          ),
        ),
      },
      { type: "application/ld+json", children: JSON.stringify(getFaqSchema([...FAQS])) },
      {
        type: "application/ld+json",
        children: JSON.stringify(
          getBreadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Dumpster Rental", url: "/dumpster-rental" },
          ]),
        ),
      },
    ],
  }),
  component: () => <ServicePageLayout config={CONFIG} />,
});
