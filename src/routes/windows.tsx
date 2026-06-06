import { createFileRoute } from "@tanstack/react-router";
import { ServicePageLayout, type ServicePageConfig } from "@/components/site/ServicePageLayout";
import { SERVICE_METADATA } from "@/data/seo-config";
import windowsHeroAsset from "@/assets/windows-hero.png.asset.json";
import { LOCAL_BUSINESS_SCHEMA, getServiceSchema, getFaqSchema } from "@/lib/schema";

const HERO_IMAGE = windowsHeroAsset.url;
const OG_IMAGE = "https://sidingdepot.com/og-default.webp";
const CANONICAL = "https://sidingdepot.com/windows";
const seo = SERVICE_METADATA["windows"];

const FAQS = [
  { q: "How do I know if my windows need replacing?", a: "Key indicators: drafts you can feel near the frame, condensation between panes (failed seal), difficulty opening or closing, excessive street noise transmission, or energy bills that have climbed without a clear cause. If your windows are more than 20 years old and you notice any of these, replacement typically pays for itself faster than repair." },
  { q: "How much do replacement windows cost in North Atlanta?", a: "A standard double-hung vinyl replacement window runs $400–$700 per window installed, including labor and disposal of the old unit. Casement and specialty windows run higher. A full home replacement (15–20 windows) typically ranges $8,000–$18,000 depending on window type, size, and glass package. We provide written, itemized estimates — not ranges." },
  { q: "What is Low-E glass and do I need it in Georgia?", a: "Low-emissivity (Low-E) glass has an invisible metallic coating that reflects radiant heat. In Georgia's climate — intense summer sun, high UV exposure — Low-E glass meaningfully reduces solar heat gain, lowers AC load, and protects interior furnishings from UV fading. We include it as standard on most Georgia window installations." },
  { q: "What window brands does Siding Depot install?", a: "We install Simonton, Andersen, and Pella windows — brands with strong track records for Georgia's climate conditions. We spec the appropriate product for each project based on budget, architectural style, and performance goals. We don't push a single brand regardless of fit." },
  { q: "How long does window replacement take?", a: "Most full-home window replacements are completed in one to two days depending on window count, accessibility, and any structural work needed. Individual window replacements are typically a half-day project. We protect interior and exterior surfaces throughout the job." },
  { q: "Will new windows reduce my energy bills?", a: "In Georgia, yes — measurably. Replacing single-pane or aging double-pane windows with Energy Star certified Low-E units typically reduces heating and cooling energy costs by 12–25% depending on your current window condition and HVAC efficiency. We can walk you through realistic expectations for your specific home during the consultation." },
  { q: "Do you handle window permits?", a: "For full window replacements involving structural modifications, we file the required permits with the relevant county. Straightforward like-for-like replacements typically don't require permits in most North Atlanta jurisdictions — we confirm the requirement before any project begins." },
  { q: "What is the warranty on new windows?", a: "Window warranties vary by brand and product line. Simonton provides a lifetime limited warranty on most residential window products. Andersen offers a 20-year glass warranty and 10-year non-glass warranty. We review the specific warranty terms for your chosen product before you sign anything." },
] as const;

const CONFIG: ServicePageConfig = {
  heroImage: HERO_IMAGE,
  heroImageAlt: "Energy-efficient window installation on a North Atlanta home by Siding Depot",
  heroBadge: "Energy Star Certified · Georgia Climate Specialists",
  heroLine1: "Stop Losing Money",
  heroLine2: "Through Old",
  heroLine3: "Windows.",
  heroSubtitle: "Energy-efficient window replacement across Greater Marietta — Low-E glass, proper installation, and measurable reductions in heating and cooling costs. Written warranties. W-2 crews. No pressure.",
  problemHeadline: "Old Windows Cost You Money Every Single Month.",
  problemPoints: [
    "Drafts that force your HVAC system to run longer through Georgia's summer and winter",
    "Condensation between panes — a failed seal that lets moisture work into your frame",
    "Noise from the street, neighbors, and traffic that a proper window should block",
    "UV fading on floors, furniture, and artwork that Low-E glass would prevent entirely",
  ],
  problemSolution: "Siding Depot installs Energy Star certified replacement windows using Low-E glass packages specified for Georgia's high-UV, high-humidity climate. Proper installation — not just the product — determines performance. Our W-2 crews are trained in the details that affect your energy bills for the next 20 years.",
  optionsEyebrow: "Window Systems",
  optionsHeadline: "Four Window Types. One Right Fit For Your Home.",
  optionsSubheadline: "Every window we install is selected for Georgia's solar load, humidity, and your home's specific architectural style. Click to explore each type.",
  options: [
    { id: "double-hung", title: "Double-Hung Windows", subtitle: "Most versatile · Easy cleaning", image: "/projects/project-1.webp", description: "Both sashes tilt inward for cleaning — the most popular window type for North Atlanta homes. Available in vinyl, wood-clad, and fiberglass frames. Energy Star Low-E glass is standard on all our double-hung installs." },
    { id: "casement", title: "Casement Windows", subtitle: "Maximum ventilation · Modern look", image: "/projects/project-3.webp", description: "Side-hinged windows that crank open fully for maximum airflow — ideal for kitchens, bathrooms, and rooms where cross-ventilation matters. Casements provide a tighter weather seal than double-hungs when closed." },
    { id: "bay-bow", title: "Bay & Bow Windows", subtitle: "Architectural feature · Panoramic view", image: "/projects/project-4.webp", description: "Multi-unit projecting window assemblies that expand interior sightlines and add architectural character to living rooms and dining spaces. Requires structural framing — we handle permits and engineering." },
    { id: "sliding", title: "Sliding & Picture Windows", subtitle: "Unobstructed view · Low profile", image: "/projects/project-2.webp", description: "Horizontal sliding units for wide openings and fixed picture windows for framing views without ventilation. Both deliver maximum glass area and minimal frame intrusion." },
  ],
  processEyebrow: "How It Works",
  processHeadline: "From Drafty To Done In 5 Steps.",
  processSubheadline: "Window replacement is faster than most homeowners expect. We make it cleaner and quieter too.",
  steps: [
    { num: "01", title: "Free Window Audit", desc: "We walk every window in your home, check seal integrity, frame condition, and operational performance. You receive a written assessment — not a sales pitch." },
    { num: "02", title: "Performance & Aesthetic Evaluation", desc: "We match window types and glass packages to your home's orientation, existing architecture, and performance priorities — solar heat gain matters differently on south-facing vs. north-facing walls." },
    { num: "03", title: "Written Proposal — Per Window & Total", desc: "You receive an itemized proposal broken out by window, including product specs, glass package, labor, and disposal. No line items hidden in a 'miscellaneous' charge." },
    { num: "04", title: "Professional Installation", desc: "Our W-2 crews remove existing units, prepare openings, install and flash each new window, and apply interior and exterior trim. Interior spaces are protected with drop cloths throughout." },
    { num: "05", title: "Final Inspection & Warranty Registration", desc: "We test every window — opening, closing, locking, and weatherstrip seal — before we leave. Manufacturer warranty is registered to your address in writing." },
  ],
  projectsLabel: "Recent Window Projects\nAcross Metro Atlanta.",
  authorityEyebrow: "Why Installation Quality Determines Performance",
  authorityHeadline: "The Window Is Only",
  authorityHeadlineAccent: "Half The Story.",
  authorityBody1: "A premium window installed incorrectly will underperform a mid-range window installed correctly. Flashing, shimming, weatherstrip compression, and interior sealing determine whether your new windows actually reduce energy costs — or just look different.",
  authorityBody2: "Our W-2 installation crews are trained specifically in window performance installation — not just removal and replacement. Every window we install is flashed, sealed, and tested before we move to the next one. That level of detail is what separates a window job from a window investment.",
  authorityRows: [
    ["Glass package", "Standard clear", "Low-E certified"],
    ["Installation method", "Caulk and go", "Flash, seal, test"],
    ["Frame preparation", "Minimal", "Full prep & moisture check"],
    ["Warranty registration", "Homeowner's task", "Done by us at completion"],
  ],
  authorityCta: "Schedule My Free Window Audit",
  whyUsHeadline: "Six Reasons North Atlanta Homeowners Choose Siding Depot For Windows.",
  whyUsSubheadline: "We don't upsell products your home doesn't need. We spec what performs — and install it correctly.",
  ctaEyebrow: "Free Consultation",
  ctaHeadline: "Find Out Exactly What",
  ctaHeadlineAccent: "Your Windows Are Costing You.",
  ctaBody1: "A free window audit identifies which windows are failing, which are borderline, and which can wait — so you invest where it matters most and don't replace what you don't need to.",
  ctaBody2: "We respond within 24 hours, come to your home on your schedule, and deliver a written audit report at no charge.",
  ctaMainBtn: "Book My Free Window Audit",
  ctaTrustPoints: ["Free written audit", "No-obligation estimate", "Energy Star certified products"],
  faqTitle: "Window questions,",
  faqTitleAccent: "answered.",
  faqs: FAQS,
};

export const Route = createFileRoute("/windows")({
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
      { type: "application/ld+json", children: JSON.stringify(getServiceSchema("Energy-Efficient Window Replacement in North Atlanta", seo.metaDesc, "/windows", OG_IMAGE)) },
      { type: "application/ld+json", children: JSON.stringify(getFaqSchema([...FAQS])) },
    ],
  }),
  component: () => <ServicePageLayout config={CONFIG} />,
});
