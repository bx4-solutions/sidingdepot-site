import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Mail, MapPin, Music2, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { YoutubeEmbed } from "@/components/site/YoutubeEmbed";
import { MapEmbed } from "@/components/site/MapEmbed";
import { SITE } from "@/data/site";
import { ORG_SCHEMA, LOCAL_BUSINESS_SCHEMA } from "@/lib/schema";
import teamPhoto from "@/assets/team-photo.png";

const LucideFacebook = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);
const LucideInstagram = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.51" />
  </svg>
);
const LucideYoutube = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 2-2 69.14 69.14 0 0 1 15 0 2 2 0 0 1 2 2 24.12 24.12 0 0 1 0 10 2 2 0 0 1-2 2 69.14 69.14 0 0 1-15 0 2 2 0 0 1-2-2z" />
    <polyline points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
  </svg>
);

const ABOUT_VIDEO = {
  id: "fgNhcGoEYmE",
  title: "Meet Siding Depot — James Hardie Siding Installer in Greater Marietta, GA",
  description:
    "Get to know Siding Depot, the James Hardie Elite Preferred siding contractor serving Greater Marietta. 20+ years and 1,500+ homes resided.",
  duration: "PT2M30S",
  uploadDate: "2024-06-01",
} as const;

const LOCAL_BUSINESS_ABOUT_JSONLD = {
  ...LOCAL_BUSINESS_SCHEMA,
  "@id": "https://sidingdepot.com/about/#localbusiness",
  alternateName: "Siding Depot Greater Marietta",
  foundingDate: "2010",
  hasCredential: [
    {
      "@type": "EducationalOccupationalCredential",
      name: "James Hardie Elite Preferred Contractor",
      credentialCategory: "Manufacturer Certification",
      recognizedBy: { "@type": "Organization", name: "James Hardie Industries" },
    },
    {
      "@type": "EducationalOccupationalCredential",
      name: "Licensed & Insured General Contractor — State of Georgia",
      credentialCategory: "license",
    },
  ],
  knowsAbout: [
    "James Hardie fiber cement siding installation",
    "HardiePlank lap siding",
    "HardieShingle siding",
    "ColorPlus Technology",
    "Siding replacement",
    "Exterior painting",
    "Replacement windows",
    "Gutters",
    "Decks",
    "Roofing",
  ],
};

const VIDEO_JSONLD = {
  "@context": "https://schema.org",
  "@type": "VideoObject",
  name: ABOUT_VIDEO.title,
  description: ABOUT_VIDEO.description,
  thumbnailUrl: [
    `https://i.ytimg.com/vi/${ABOUT_VIDEO.id}/maxresdefault.jpg`,
    `https://i.ytimg.com/vi/${ABOUT_VIDEO.id}/hqdefault.jpg`,
  ],
  uploadDate: ABOUT_VIDEO.uploadDate,
  duration: ABOUT_VIDEO.duration,
  contentUrl: `https://www.youtube.com/watch?v=${ABOUT_VIDEO.id}`,
  embedUrl: `https://www.youtube.com/embed/${ABOUT_VIDEO.id}`,
  publisher: {
    "@type": "Organization",
    name: "Siding Depot",
    logo: { "@type": "ImageObject", url: "https://sidingdepot.com/logo.png" },
  },
};

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      {
        title: "About Siding Depot — James Hardie Elite Contractor, Marietta GA",
      },
      {
        name: "description",
        content:
          "James Hardie Elite Preferred siding contractor in Marietta, GA. 20+ years on 1,500+ homes — siding, windows, painting, decks, gutters & roofing.",
      },
      {
        name: "keywords",
        content:
          "siding contractor Greater Marietta GA, James Hardie installer Atlanta, fiber cement siding Georgia, siding replacement North Atlanta, siding installation Cobb County",
      },
      {
        property: "og:title",
        content: "About Siding Depot — Georgia's Trusted James Hardie Siding Installer",
      },
      {
        property: "og:description",
        content:
          "1,500+ homes resided across North Atlanta. James Hardie Elite Preferred — top 2% of US installers. In-house crews, written estimates, no surprises.",
      },
      {
        property: "og:image",
        content: `https://i.ytimg.com/vi/${ABOUT_VIDEO.id}/maxresdefault.jpg`,
      },
      {
        property: "og:type",
        content: "website",
      },
      {
        name: "twitter:card",
        content: "summary_large_image",
      },
      {
        name: "twitter:title",
        content: "About Siding Depot — Georgia's Trusted James Hardie Siding Installer",
      },
      {
        name: "twitter:description",
        content:
          "1,500+ homes resided across North Atlanta. James Hardie Elite Preferred — top 2% of US installers. In-house crews, written estimates, no surprises.",
      },
      {
        name: "twitter:image",
        content: `https://i.ytimg.com/vi/${ABOUT_VIDEO.id}/maxresdefault.jpg`,
      },
    ],
    links: [
      { rel: "canonical", href: "https://sidingdepot.com/about" },
      // Pre-warm YouTube hosts so the click-to-play embed feels instant
      { rel: "preconnect", href: "https://www.youtube.com" },
      { rel: "preconnect", href: "https://i.ytimg.com" },
      { rel: "dns-prefetch", href: "https://www.youtube-nocookie.com" },
    ],
    scripts: [
      { type: "application/ld+json", children: JSON.stringify(ORG_SCHEMA) },
      { type: "application/ld+json", children: JSON.stringify(LOCAL_BUSINESS_ABOUT_JSONLD) },
      { type: "application/ld+json", children: JSON.stringify(VIDEO_JSONLD) },
    ],
  }),
  component: AboutPage,
});

// Smaller variants (r_320 instead of r_640) — partner logos render at max-h-16,
// so 320px wide is more than enough and ~4× smaller payload.
const PARTNER_LOGOS = [
  "https://images.leadconnectorhq.com/image/f_webp/q_70/r_320/u_https://assets.cdn.filesafe.space/VPwAmJKkB62wR0BJhYil/media/68b594a44584e19b5e18190f.svg",
  "https://images.leadconnectorhq.com/image/f_webp/q_70/r_320/u_https://assets.cdn.filesafe.space/VPwAmJKkB62wR0BJhYil/media/68b5950c3441c1803b96202d.jpeg",
  "https://images.leadconnectorhq.com/image/f_webp/q_70/r_320/u_https://assets.cdn.filesafe.space/irZ39Ik02snUd4JAOmPv/media/68a8c7609c19c009b3f34d09.svg",
  "https://images.leadconnectorhq.com/image/f_webp/q_70/r_320/u_https://assets.cdn.filesafe.space/irZ39Ik02snUd4JAOmPv/media/68ac604545eaf7e812e3da66.png",
  "https://images.leadconnectorhq.com/image/f_webp/q_70/r_320/u_https://assets.cdn.filesafe.space/VPwAmJKkB62wR0BJhYil/media/68b59793acd791744f0bde7d.jpeg",
  "https://images.leadconnectorhq.com/image/f_webp/q_70/r_320/u_https://storage.googleapis.com/msgsndr/VPwAmJKkB62wR0BJhYil/media/68bacd232398ef53b4c4598c.jpeg",
  "https://images.leadconnectorhq.com/image/f_webp/q_70/r_320/u_https://assets.cdn.filesafe.space/VPwAmJKkB62wR0BJhYil/media/69d7c3c274d020e518e3a116.png",
] as const;


const DIFFERENTIATORS = [
  "You get a line-by-line itemized estimate with exact pricing up front.",
  "You get the details of the project in writing. No surprises.",
  "You get top-notch, high-quality products. No builder-grade or knock-off products.",
  "You get an official James Hardie Replacement Contractor — not a fly-by-night operation or a company who does siding “on the side.”",
  "You get immediate customer service with a single phone call. Not the run-around.",
  "You get installation by trained, insured, professional crews with strict quality control. Not cheap, per-day labor.",
  "You get professional, hands-on project management from start to finish. Not a salesperson who only collects the check.",
  "Payment is made upon completion of each phase.",
] as const;

const STATS = [
  {
    value: "20+",
    label: "Years of Experience",
    desc: "Over two decades delivering siding, painting, and exterior renovation projects with quality and technical precision.",
  },
  {
    value: "1,500+",
    label: "Transformed Houses",
    desc: "With over 1,500 homes transformed, we turn your vision into reality.",
  },
  {
    value: "98%",
    label: "Customer Satisfaction",
    desc: "Our commitment goes beyond installation: we always strive to exceed expectations, providing long-lasting results and exceptional service.",
  },
] as const;

function AboutPage() {
  return (
    <main>
      {/* HERO */}
      <section className="relative bg-sd-navy text-white overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 py-20 lg:py-28 grid gap-12 lg:grid-cols-2 items-center">
          <div>
            <span className="inline-block text-xs font-bold tracking-[0.12em] uppercase text-sd-green bg-sd-green/10 border border-sd-green/30 px-3 py-1 rounded">
              About Siding Depot
            </span>
            <h1 className="mt-4 font-display text-4xl sm:text-5xl lg:text-6xl leading-tight">
              20+ years installing <span className="text-sd-green">James Hardie siding</span> across
              Greater Marietta.
            </h1>
            <p className="mt-5 text-lg text-white/75 max-w-xl leading-relaxed">
              Siding Depot is a James Hardie Elite Preferred contractor based in Greater Marietta,
              GA — specialists in fiber cement siding installation, replacement, painting, windows,
              decks, gutters and roofing for homeowners in the area.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/contact">Get a Free Siding Quote</Link>
              </Button>
              <Button asChild size="lg" variant="outlineWhite">
                <a href={SITE.phoneHref}>Call {SITE.phone}</a>
              </Button>
            </div>
          </div>
          <div>
            <YoutubeEmbed videoId="fgNhcGoEYmE" title="Meet Siding Depot — Greater Marietta, GA" />
            <nav
              aria-label="Related siding services"
              className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-white/75"
            >
              <span className="text-white/55">Explore:</span>
              <Link to="/siding" className="text-sd-black hover:underline">
                James Hardie siding installation
              </Link>
              <Link to="/painting" className="text-sd-black hover:underline">
                exterior painting in Greater Marietta
              </Link>
              <Link to="/windows" className="text-sd-black hover:underline">
                replacement windows
              </Link>
              <Link to="/contact" className="text-sd-black hover:underline">
                request a free siding quote
              </Link>
            </nav>
          </div>
        </div>
      </section>

      {/* DIFFERENTIATORS */}
      <section className="py-20 lg:py-24 bg-background">
        <div className="mx-auto max-w-5xl px-4 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-block text-xs font-bold tracking-[0.12em] uppercase text-sd-green-text bg-sd-green-pale px-3 py-1 rounded">
              Why choose a local James Hardie Elite installer
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-sd-black">
              What sets our siding installation apart in Georgia
            </h2>
            <p className="mt-3 text-sd-gray-text">
              Siding Depot is one of the fastest-growing James Hardie Replacement Contractors in
              Georgia. Hiring a certified local installer matters — here's why Greater Marietta
              homeowners trust us with their siding project:
            </p>
          </div>

          <ul className="mt-12 grid gap-4 sm:grid-cols-2">
            {DIFFERENTIATORS.map((d) => (
              <li
                key={d}
                className="flex gap-3 rounded-xl border border-sd-gray-border bg-white p-5 shadow-sm"
              >
                <CheckCircle2 className="h-5 w-5 text-sd-green shrink-0 mt-0.5" />
                <span className="text-sm leading-relaxed text-sd-gray-text">{d}</span>
              </li>
            ))}
          </ul>

          <p className="mt-10 text-center text-sd-gray-text max-w-3xl mx-auto leading-relaxed">
            You can count on the team at Siding Depot to satisfy all your{" "}
            <strong className="text-sd-navy">
              Siding, Painting, Windows, Decks, Gutter, and Roofing
            </strong>{" "}
            needs quickly, efficiently and affordably. We know how much quality means to you, and we
            work hard to give you the absolute best on every job.
          </p>

          <div className="mt-8 text-center">
            <Button asChild size="lg">
              <Link to="/contact">View More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-sd-navy text-white py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid gap-10 md:grid-cols-3">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <div className="font-display text-4xl sm:text-6xl text-sd-green leading-none">
                  {s.value}
                </div>
                <h3 className="mt-3 text-base font-bold uppercase tracking-wider">{s.label}</h3>
                <p className="mt-3 text-sm text-white/70 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PARTNERS / BRAND MARQUEE */}
      <section className="py-16 bg-white border-y border-sd-gray-border overflow-hidden">
        <p className="text-center text-xs font-bold tracking-[0.12em] uppercase text-sd-gray-text mb-8">
          Trusted partners &amp; manufacturers
        </p>
        {/* Marquee track — duplicated for seamless loop */}
        <div className="relative flex">
          <div
            className="flex items-center gap-12 animate-marquee whitespace-nowrap"
            style={{ animation: "marquee 28s linear infinite" }}
          >
            {[...PARTNER_LOGOS, ...PARTNER_LOGOS].map((src, i) => (
              <div key={i} className="flex-shrink-0 flex items-center justify-center h-20 w-36">
                <img
                  src={src}
                  alt={`Manufacturer partner ${(i % PARTNER_LOGOS.length) + 1}`}
                  width={144}
                  height={64}
                  className="max-h-16 w-auto object-contain opacity-75 hover:opacity-100 transition-opacity"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            ))}
          </div>
        </div>
        <style>{`
          @keyframes marquee {
            0%   { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
      </section>

      {/* CERTIFICATIONS */}
      <section className="py-20 lg:py-24 bg-background">
        <div className="mx-auto max-w-6xl px-4 lg:px-8 grid gap-10 lg:grid-cols-2 items-center">
          <div>
            <span className="inline-block text-xs font-bold tracking-[0.12em] uppercase text-sd-green-text bg-sd-green-pale px-3 py-1 rounded">
              The People Behind The Work
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-sd-black">
              A company made of people
            </h2>
            <p className="mt-4 text-sd-gray-text leading-relaxed">
              Certifications and awards matter — they prove we meet the highest standards in the
              industry. But what truly defines Siding Depot is our people. We're a tight-knit,
              in-house crew who show up, take pride in every home, and treat your project like it's
              our own — no subcontractors, no strangers on your property.
            </p>
            <p className="mt-4 text-sd-gray-text leading-relaxed">
              Because at the end of the day, this work isn't really about siding — it's about people.
              And we genuinely love working with them, from the first handshake to the final walk-through.
            </p>
            <p className="mt-6 text-lg font-semibold text-sd-navy">
              Real people. Real craftsmanship. Real care.
            </p>
          </div>
          <div className="flex justify-center">
            <img
              src={teamPhoto}
              alt="The Siding Depot crew — our full in-house team in front of the company vans"
              width={1200}
              height={800}
              className="max-w-full h-auto rounded-2xl shadow-xl ring-1 ring-black/5"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </section>

      {/* OFFICE + SOCIAL */}
      <section className="bg-sd-dark text-white py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-4xl">Office</h2>
            <ul className="mt-6 space-y-4 text-base">
              <li>
                <a
                  href={SITE.phoneHref}
                  className="flex items-center gap-3 text-sd-green hover:text-sd-green-hover"
                >
                  <Phone className="h-5 w-5" /> {SITE.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${SITE.email}`}
                  className="flex items-center gap-3 text-sd-green hover:text-sd-green-hover"
                >
                  <Mail className="h-5 w-5" /> {SITE.email}
                </a>
              </li>
              <li>
                <a
                  href="https://www.google.com/maps/place/3036+Roswell+Rd,+Marietta,+GA+30062"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 text-white/80 hover:text-sd-green"
                >
                  <MapPin className="h-5 w-5 mt-1 shrink-0" />
                  {SITE.address.full}
                </a>
              </li>
            </ul>
            <div className="flex gap-4 mt-10">
              <a
                href={SITE.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="text-white/50 hover:text-sd-green transition-colors"
              >
                <LucideFacebook className="h-6 w-6" />
              </a>
              <a
                href={SITE.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-white/50 hover:text-sd-green transition-colors"
              >
                <LucideInstagram className="h-6 w-6" />
              </a>
              <a
                href={SITE.social.youtube}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="text-white/50 hover:text-sd-green transition-colors"
              >
                <LucideYoutube className="h-6 w-6" />
              </a>
              <a
                href={SITE.social.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="text-white/50 hover:text-sd-green transition-colors"
              >
                <Music2 className="h-6 w-6" />
              </a>
            </div>
          </div>
          <div>
            <MapEmbed className="h-[300px]" title="Siding Depot Office Location" />
          </div>
        </div>
      </section>
    </main>
  );
}
