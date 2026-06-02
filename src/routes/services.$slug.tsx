import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Star,
  Award,
} from "lucide-react";
import { generateServicePageSchemas } from "@/lib/jsonld";
import {
  PROJECTS_SORTED,
  SERVICE_OPTIONS,
  SITE,
  formatProjectDate,
  serviceSlug,
  type ProjectTag,
} from "@/data/site";

type ServiceSlug =
  | "siding"
  | "painting"
  | "windows"
  | "doors"
  | "gutters"
  | "decks"
  | "roof";

type ServiceContent = {
  label: ProjectTag;
  hero: string;
  intro: string;
  benefits: ReadonlyArray<string>;
  process: ReadonlyArray<{ title: string; desc: string }>;
  partners: string;
  ogImage?: string;
};

const SERVICE_CONTENT: Record<ServiceSlug, ServiceContent> = {
  siding: {
    label: "Siding",
    hero: "James Hardie® Siding: Elite Installation & Protection",
    intro:
      "Transform your home with North Atlanta's Top 2% James Hardie Elite Preferred contractor. Engineered for Georgia's HZ10 zone, our siding systems combine unbeatable durability with the vibrant ColorPlus® Technology finish.",
    benefits: [
      "Top 2% Elite Preferred James Hardie status",
      "Engineered specifically for Georgia's heat & humidity",
      "30-year limited material & 15-year finish warranty",
      "W-2 certified installers — no subcontractors",
    ],
    process: [
      { title: "Precision Measurement", desc: "We perform a forensic inspection of your current siding and provide a detailed, itemized quote within 24 hours." },
      { title: "Material Customization", desc: "Select your profile (Lap, Shingle, or Board & Batten) and your ColorPlus® palette for a maintenance-free finish." },
      { title: "Expert Installation", desc: "Full tear-off, weather-barrier wrap, and precision install following Hardie's strict Best Practices manual." },
    ],
    partners: "James Hardie Elite Preferred",
    ogImage: "/projects/project-1.webp",
  },
  painting: {
    label: "Painting",
    hero: "High-Performance Exterior Painting Systems",
    intro:
      "A repaint should last a decade, not a few seasons. We utilize the Sherwin-Williams Emerald® and Duration® systems to create a UV-resistant thermal barrier that handles North Atlanta's extreme temperature swings.",
    benefits: [
      "Sherwin-Williams Emerald® UV-shield coatings",
      "Multi-stage prep: wash, scrape, sand, and prime",
      "Self-cleaning technology resists dirt and mildew",
      "5-year workmanship warranty on all full repaints",
    ],
    process: [
      { title: "Deep Surface Prep", desc: "We don't just paint; we restore. Every project starts with professional washing and manual surface stabilization." },
      { title: "Premium Priming", desc: "A dedicated primer layer ensures the final coats bond permanently to fiber cement, wood, or brick surfaces." },
      { title: "Dual-Coat Finish", desc: "Two full coats of premium enamel applied for maximum depth, protection, and sharp architectural lines." },
    ],
    partners: "Sherwin-Williams PRO Preferred",
    ogImage: "/projects/project-5.webp",
  },
  windows: {
    label: "Windows",
    hero: "Energy-Efficient Window Replacement & Design",
    intro:
      "Slash your summer cooling costs by 15-25% with Energy Star® certified windows. Our double-pane Low-E systems are sized specifically for North Atlanta's climate, blocking infrared heat while flooding your home with light.",
    benefits: [
      "Energy Star® 3A/4A climate zone certified",
      "Low-E3 silver coatings for maximum heat reflection",
      "Argon-filled chambers for superior thermal insulation",
      "Lifetime limited manufacturer warranty on frames",
    ],
    process: [
      { title: "Structural Assessment", desc: "We measure every opening to the millimeter to ensure a true air-tight, water-tight custom fit." },
      { title: "Custom Fabrication", desc: "Windows are custom-built using high-performance vinyl or fiberglass engineered for Southeast humidity." },
      { title: "Clean-Capture Install", desc: "Most projects completed in 1-2 days with full debris removal and a final seal-integrity inspection." },
    ],
    partners: "ENERGY STAR® Certified Installers",
    ogImage: "/projects/project-8.webp",
  },
  doors: {
    label: "Doors",
    hero: "Custom Entry, Patio & Security Door Systems",
    intro:
      "Upgrade your curb appeal and security simultaneously. We install high-performance Therma-Tru® and ProVia® door systems featuring multi-point locking and thermal-break thresholds designed for Georgia homes.",
    benefits: [
      "Fiberglass & steel cores — won't warp or rot",
      "Multi-point security locking hardware included",
      "Factory-finished stains that mimic real wood",
      "Fully insulated cores for maximum energy savings",
    ],
    process: [
      { title: "Design Consultation", desc: "Choose your material, glass insert (decorative or clear), and high-security hardware options." },
      { title: "Precision Framing", desc: "We re-square your entryway to ensure a perfect weather seal and effortless lock alignment." },
      { title: "Security Testing", desc: "Every door undergoes a 20-point check for threshold level, sweep contact, and lock engagement." },
    ],
    partners: "Therma-Tru Authorized Dealer",
  },
  gutters: {
    label: "Gutters",
    hero: "6-Inch Seamless Aluminum & LeafGuard® Protection",
    intro:
      "Protect your foundation from Georgia's 50+ inches of annual rain. Our 6-inch seamless systems move 40% more water than standard gutters, preventing basement leaks and fascia rot.",
    benefits: [
      "Seamless 6-inch K-style for high-volume runoff",
      "On-site fabrication for leak-free continuous runs",
      "Stainless hidden hangers screwed (not nailed)",
      "Optional LeafGuard® lifetime no-clog systems",
    ],
    process: [
      { title: "Pitch Engineering", desc: "We calculate the exact slope needed for your roofline to ensure water never pools or overflows." },
      { title: "Custom Extrusion", desc: "Aluminum coils are fed through our on-site machine to create continuous, joint-free gutter runs." },
      { title: "Downspout Routing", desc: "Strategic placement of high-flow 3x4 downspouts to move water safely away from your foundation." },
    ],
    partners: "LeafGuard Authorized Installer",
  },
  decks: {
    label: "Decks",
    hero: "Custom Composite & Hardwood Deck Construction",
    intro:
      "Maximize your outdoor living with a deck built for decades, not seasons. As Trex Pro® installers, we build moisture-proof outdoor spaces that resist the warping, rotting, and fading common in Georgia.",
    benefits: [
      "Trex® & TimberTech® high-performance composite",
      "Hidden fastener systems for a smooth, screw-free look",
      "Permit-ready engineered framing for safety and code",
      "10-year workmanship & 25-year material warranties",
    ],
    process: [
      { title: "3D Layout & Planning", desc: "We design your space based on your lifestyle, from grill zones to multi-level lounge areas." },
      { title: "Permit Management", desc: "We handle all filings and structural inspections with Cobb, Cherokee, or Fulton counties." },
      { title: "Craftsman Build", desc: "Framing, decking, and railing installed by our dedicated carpenters with high-load footings." },
    ],
    partners: "Trex Pro Installer",
    ogImage: "/projects/project-6.webp",
  },
  roof: {
    label: "Roof",
    hero: "GAF Factory-Certified Roofing & Storm Protection",
    intro:
      "Protect your biggest investment with a GAF Golden Pledge® roofing system. As factory-certified contractors, we provide superior wind and hail resistance backed by the strongest warranty in the industry.",
    benefits: [
      "GAF Factory-Certified status (Golden Pledge available)",
      "Advanced protection against 130mph wind & hail",
      "Synthetic underlayment & ice/water shield standard",
      "Storm damage insurance claim documentation experts",
    ],
    process: [
      { title: "Drone & Manual Audit", desc: "A comprehensive photo report of your roof's current health, including shingle, valley, and flashing state." },
      { title: "Full System Tear-off", desc: "We remove all old layers to inspect the structural deck before installing the GAF system components." },
      { title: "Site Protection & Scan", desc: "We protect your landscaping and perform a high-powered magnet sweep for nails before leaving." },
    ],
    partners: "GAF Factory Certified",
    ogImage: "/projects/project-7.webp",
  },
};

const SLUG_SET = new Set<string>(SERVICE_OPTIONS.map(serviceSlug));

export const Route = createFileRoute("/services/$slug")({
  beforeLoad: ({ params }) => {
    if (!SLUG_SET.has(params.slug)) throw notFound();
  },
  loader: ({ params }): { slug: ServiceSlug; content: ServiceContent } => {
    const slug = params.slug as ServiceSlug;
    const content = SERVICE_CONTENT[slug];
    return { slug, content };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [] };
    const { slug, content } = loaderData;
    const title = `${content.hero} | ${SITE.name}`;
    const description = content.intro;
    const url = `https://www.sidingdepot.com/services/${slug}`;

    // Generate enhanced schemas
    const serviceSchemas = generateServicePageSchemas({
      title: content.hero,
      description: content.intro,
      serviceType: content.label,
      image: content.ogImage ? `https://www.sidingdepot.com${content.ogImage}` : undefined,
      // Adding common FAQs for these services
      faqs: [
        { q: `Do you provide free estimates for ${content.label.toLowerCase()}?`, a: "Yes, we provide 100% free, no-obligation on-site estimates for all our exterior services." },
        { q: "Are you licensed and insured?", a: "Yes, Siding Depot is fully licensed and carries comprehensive liability and workers' compensation insurance." }
      ]
    });

    const meta = [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: url },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ];
    if (content.ogImage) {
      meta.push({ property: "og:image", content: content.ogImage });
      meta.push({ name: "twitter:image", content: content.ogImage });
    }
    return {
      meta,
      links: [{ rel: "canonical", href: url }],
      scripts: serviceSchemas.map(schema => ({
        type: "application/ld+json",
        children: JSON.stringify(schema),
      })),
    };
  },
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="font-display text-4xl text-sd-black">Service not found</h1>
        <Link to="/" className="mt-4 inline-block text-sd-navy underline">
          Back to home
        </Link>
      </div>
    </div>
  ),
  component: ServicePage,
});

function ServicePage() {
  const data = Route.useLoaderData() as { slug: ServiceSlug; content: ServiceContent };
  const { slug, content } = data;
  const related = PROJECTS_SORTED.filter((p) => p.tags.includes(content.label)).slice(0, 3);

  return (
    <div className="bg-sd-gray-bg">
      {/* Hero */}
      <section className="bg-sd-navy text-white py-hero lg:py-hero-lg">
        <div className="mx-auto max-w-5xl px-4 lg:px-8 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-sd-green">
            {content.label} Services
          </p>
          <h1 className="mt-4 font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.05]">
            {content.hero}
          </h1>
          <p className="mt-6 text-lg text-white/85 max-w-2xl mx-auto leading-relaxed">
            {content.intro}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-pill bg-sd-green px-6 py-3 text-sm font-bold uppercase tracking-wide text-sd-black hover:bg-sd-green/90 transition-colors"
            >
              Get Free Quote <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={SITE.phoneHref}
              className="inline-flex items-center gap-2 rounded-pill border border-white/60 px-6 py-3 text-sm font-bold uppercase tracking-wide text-white hover:bg-white/10 transition-colors"
            >
              Call {SITE.phone}
            </a>
          </div>
          <div className="mt-8 inline-flex items-center gap-2 text-sm text-white/80">
            <Star className="h-4 w-4 fill-sd-green text-sd-green" />
            <span>4.9 · 128+ reviews · {content.partners}</span>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-6xl px-4 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] items-start">
            <div>
              <h2 className="font-display text-3xl sm:text-4xl text-sd-black leading-tight">
                Why homeowners choose Siding Depot for {content.label.toLowerCase()}
              </h2>
              <p className="mt-4 text-sd-gray-text leading-relaxed">
                Backed by industry-leading partners and W-2 crews. Every project includes
                a dedicated project manager and a written warranty.
              </p>
              <ul className="mt-8 grid gap-3">
                {content.benefits.map((b) => (
                  <li key={b} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-sd-green flex-shrink-0 mt-0.5" />
                    <span className="text-sd-black">{b}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <TrustCard icon={<Award className="h-5 w-5" />} label={content.partners} />
              <TrustCard icon={<ShieldCheck className="h-5 w-5" />} label="Licensed & insured" />
              <TrustCard icon={<Star className="h-5 w-5" />} label="4.9★ Google" />
              <TrustCard icon={<CheckCircle2 className="h-5 w-5" />} label="Written warranty" />
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-6xl px-4 lg:px-8">
          <h2 className="font-display text-3xl sm:text-4xl text-sd-black text-center leading-tight">
            Our {content.label.toLowerCase()} process
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {content.process.map((step, i) => (
              <div
                key={step.title}
                className="rounded-xl border border-sd-gray-border bg-sd-gray-bg p-6"
              >
                <div className="text-sd-green font-display text-3xl">0{i + 1}</div>
                <h3 className="mt-3 font-display text-xl text-sd-black">{step.title}</h3>
                <p className="mt-2 text-sm text-sd-gray-text leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related projects */}
      {related.length > 0 && (
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-6xl px-4 lg:px-8">
            <div className="flex items-end justify-between gap-4 mb-8">
              <h2 className="font-display text-3xl sm:text-4xl text-sd-black leading-tight">
                Recent {content.label.toLowerCase()} projects
              </h2>
              <Link
                to="/projects"
                search={{ tag: content.label, page: 1 }}
                className="text-sm font-semibold text-sd-navy hover:underline whitespace-nowrap"
              >
                View all →
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <Link
                  key={p.slug}
                  to="/projects/$slug"
                  params={{ slug: p.slug }}
                  className="group relative overflow-hidden rounded-xl aspect-[4/5] bg-sd-navy shadow-sm hover:shadow-2xl transition-shadow"
                >
                  <img
                    src={p.src}
                    alt={p.alt}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-sd-black/10 to-sd-black/85" />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <h3 className="font-display text-lg text-white leading-tight">
                      {p.title ?? p.alt}
                    </h3>
                    {p.date && (
                      <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-white/80">
                        {formatProjectDate(p.date)}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-sd-navy text-white py-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="font-display text-3xl sm:text-4xl leading-tight">
            Ready to start your {content.label.toLowerCase()} project?
          </h2>
          <p className="mt-3 text-white/80">
            Free on-site consultation. Written estimate within 24 hours.
          </p>
          <Link
            to="/contact"
            className="mt-6 inline-flex items-center gap-2 rounded-pill bg-sd-green px-6 py-3 text-sm font-bold uppercase tracking-wide text-sd-black hover:bg-sd-green/90 transition-colors"
          >
            Get Free Quote <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Other services */}
      <section className="py-12 bg-white border-t border-sd-gray-border">
        <div className="mx-auto max-w-6xl px-4 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-sd-gray-text text-center">
            Explore other services
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {SERVICE_OPTIONS.filter((s) => serviceSlug(s) !== slug).map((s) => (
              <Link
                key={s}
                to="/services/$slug"
                params={{ slug: serviceSlug(s) }}
                className="rounded-pill border border-sd-gray-border bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wide text-sd-black hover:border-sd-green transition-colors"
              >
                {s}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function TrustCard({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="rounded-xl border border-sd-gray-border bg-white p-4 flex items-center gap-3">
      <div className="text-sd-navy">{icon}</div>
      <span className="text-sm font-semibold text-sd-black">{label}</span>
    </div>
  );
}
