import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Star,
  Award,
} from "lucide-react";
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
    hero: "James Hardie Siding Installation in North Atlanta",
    intro:
      "Elite Preferred James Hardie installation engineered for HardieZone HZ10. Board & Batten, HardiePlank, Cedarmill and shake — backed by ColorPlus® Technology.",
    benefits: [
      "Top 2% Elite Preferred James Hardie contractor",
      "Engineered for Georgia humidity, storms and UV",
      "30-year limited warranty on materials and finish",
      "W-2 crews — never subcontracted",
    ],
    process: [
      { title: "On-site consultation", desc: "Free measurement and written estimate, usually same-day." },
      { title: "Material selection", desc: "Choose profile, ColorPlus® finish and trim package." },
      { title: "Installation", desc: "Tear-off, weather barrier, install, caulk, paint touch-up and clean-up." },
    ],
    partners: "James Hardie Elite Preferred",
    ogImage: "/projects/project-1.webp",
  },
  painting: {
    label: "Painting",
    hero: "Exterior Painting — Sherwin-Williams Premium Systems",
    intro:
      "Long-lasting exterior repaints with Sherwin-Williams premium coatings. Surface prep, priming and UV-protective topcoats applied by experienced W-2 crews.",
    benefits: [
      "Sherwin-Williams Emerald & Duration systems",
      "Power-wash, scrape, prime and caulk every job",
      "Color consultation included",
      "5-year workmanship warranty",
    ],
    process: [
      { title: "Color consultation", desc: "Sample boards on your home before you commit." },
      { title: "Surface prep", desc: "Wash, scrape, sand, prime — the difference that lasts." },
      { title: "Finish coats", desc: "Two premium topcoats with UV protection and crisp trim lines." },
    ],
    partners: "Sherwin-Williams PRO Preferred",
    ogImage: "/projects/project-5.webp",
  },
  windows: {
    label: "Windows",
    hero: "Energy-Efficient Window Replacement",
    intro:
      "Replace drafty windows with high-performance double-pane units. Lower energy bills, reduce outside noise and refresh your curb appeal.",
    benefits: [
      "ENERGY STAR® certified glass packages",
      "Low-E coatings & argon fill standard",
      "Lifetime limited manufacturer warranty",
      "Custom-fit installation, no gaps",
    ],
    process: [
      { title: "Measure & quote", desc: "Precise measurements for every opening, no surprises." },
      { title: "Custom order", desc: "Frames, grilles and glass tailored to your home." },
      { title: "Same-day install", desc: "Most jobs completed in a single day with full clean-up." },
    ],
    partners: "ENERGY STAR® Certified Installers",
    ogImage: "/projects/project-8.webp",
  },
  doors: {
    label: "Doors",
    hero: "Entry, Patio & Storm Door Replacement",
    intro:
      "Upgrade entry doors, sliding patio doors and storm doors. Better security, better insulation and a striking first impression.",
    benefits: [
      "Therma-Tru, ProVia & Andersen lines",
      "Multi-point locking hardware available",
      "Insulated steel and fiberglass options",
      "Custom paint and stain finishes",
    ],
    process: [
      { title: "Style consultation", desc: "Browse hardware, glass and finish options on-site." },
      { title: "Precise install", desc: "Re-frame as needed for true square fit and weather seal." },
      { title: "Final walk-through", desc: "We test every lock, hinge and seal before we leave." },
    ],
    partners: "Therma-Tru Authorized Dealer",
  },
  gutters: {
    label: "Gutters",
    hero: "Seamless Aluminum Gutters & LeafGuard",
    intro:
      "Seamless aluminum gutters fabricated on-site to your home's exact dimensions. Optional LeafGuard covers eliminate cleaning forever.",
    benefits: [
      "Seamless 5\" and 6\" aluminum profiles",
      "Hidden hangers — no exposed nails",
      "Optional LeafGuard or micro-mesh covers",
      "Downspout routing engineered for grade",
    ],
    process: [
      { title: "Inspection", desc: "Assess existing drainage, fascia and roof line." },
      { title: "On-site fabrication", desc: "Continuous gutter runs cut to length for a clean look." },
      { title: "Install & test", desc: "Mount, seal, route downspouts and water-test the system." },
    ],
    partners: "LeafGuard Authorized Installer",
  },
  decks: {
    label: "Decks",
    hero: "Custom Deck Construction & Rebuilds",
    intro:
      "Composite, hardwood and pressure-treated decks built to last. Permits, framing, decking, railings and finish — fully managed.",
    benefits: [
      "Trex, TimberTech & Fiberon composite options",
      "Engineered framing with hidden fasteners",
      "Permits and inspections handled for you",
      "10-year workmanship warranty",
    ],
    process: [
      { title: "Design & permit", desc: "3D layout, material selection and county permitting." },
      { title: "Build", desc: "Footings, framing and decking installed by W-2 carpenters." },
      { title: "Finish & inspect", desc: "Railings, stairs, stain and final county inspection." },
    ],
    partners: "Trex Pro Installer",
    ogImage: "/projects/project-6.webp",
  },
  roof: {
    label: "Roof",
    hero: "Roof Replacement & Repair — GAF Factory Certified",
    intro:
      "GAF Factory Certified installations with manufacturer-backed system warranties. Architectural shingles, ridge venting and complete tear-offs.",
    benefits: [
      "GAF Factory Certified contractor",
      "Golden Pledge® system warranty available",
      "Synthetic underlayment & ice/water shield",
      "Storm damage insurance claim support",
    ],
    process: [
      { title: "Free roof inspection", desc: "Drone and on-roof inspection with photo report." },
      { title: "Tear-off & install", desc: "Complete tear-off, deck inspection, underlayment, shingle install." },
      { title: "Magnet sweep", desc: "Full property magnet sweep and final walk-through." },
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
  loader: ({ params }) => {
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
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: content.hero,
            provider: { "@type": "LocalBusiness", name: SITE.name, telephone: SITE.phone },
            areaServed: "Greater Atlanta, GA",
            description,
            url,
          }),
        },
      ],
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
  const { slug, content } = Route.useLoaderData();
  const related = PROJECTS_SORTED.filter((p) => p.tags.includes(content.label)).slice(0, 3);

  return (
    <div className="bg-sd-gray-bg">
      {/* Hero */}
      <section className="bg-sd-navy text-white py-20 lg:py-28">
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
              className="inline-flex items-center gap-2 rounded-pill border border-white/30 px-6 py-3 text-sm font-bold uppercase tracking-wide text-white hover:bg-white/10 transition-colors"
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
