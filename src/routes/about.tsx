import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Facebook, Instagram, Mail, MapPin, Music2, Phone, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE } from "@/data/site";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Siding Depot — James Hardie Elite Preferred Contractor in Georgia" },
      {
        name: "description",
        content:
          "For 15+ years, Siding Depot has helped Georgia homeowners protect and enhance their homes. James Hardie certified contractor delivering siding, painting, windows, decks, gutters & roofing.",
      },
      { property: "og:title", content: "About Siding Depot — Georgia's Trusted Exterior Contractor" },
      {
        property: "og:description",
        content:
          "1,500+ homes transformed, 98% customer satisfaction. James Hardie Elite Preferred installer serving North Atlanta.",
      },
    ],
  }),
  component: AboutPage,
});

const PARTNER_LOGOS = [
  "https://images.leadconnectorhq.com/image/f_webp/q_80/r_640/u_https://assets.cdn.filesafe.space/VPwAmJKkB62wR0BJhYil/media/68b594a44584e19b5e18190f.svg",
  "https://images.leadconnectorhq.com/image/f_webp/q_80/r_640/u_https://assets.cdn.filesafe.space/VPwAmJKkB62wR0BJhYil/media/68b5950c3441c1803b96202d.jpeg",
  "https://images.leadconnectorhq.com/image/f_webp/q_80/r_640/u_https://assets.cdn.filesafe.space/irZ39Ik02snUd4JAOmPv/media/68a8c7609c19c009b3f34d09.svg",
  "https://images.leadconnectorhq.com/image/f_webp/q_80/r_640/u_https://assets.cdn.filesafe.space/irZ39Ik02snUd4JAOmPv/media/68ac604545eaf7e812e3da66.png",
  "https://images.leadconnectorhq.com/image/f_webp/q_80/r_640/u_https://assets.cdn.filesafe.space/VPwAmJKkB62wR0BJhYil/media/68b59793acd791744f0bde7d.jpeg",
  "https://images.leadconnectorhq.com/image/f_webp/q_80/r_640/u_https://storage.googleapis.com/msgsndr/VPwAmJKkB62wR0BJhYil/media/68bacd232398ef53b4c4598c.jpeg",
  "https://images.leadconnectorhq.com/image/f_webp/q_80/r_640/u_https://assets.cdn.filesafe.space/VPwAmJKkB62wR0BJhYil/media/69d7c3c274d020e518e3a116.png",
] as const;

const CERT_HERO =
  "https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://assets.cdn.filesafe.space/VPwAmJKkB62wR0BJhYil/media/689f1907c6ba4e35d9b05691.png";

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
    value: "15+",
    label: "Years of Experience",
    desc: "Over a decade delivering siding, painting, and exterior renovation projects with quality and technical precision.",
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
              For 15 years, helping Georgia homeowners{" "}
              <span className="text-sd-green">protect and enhance</span> their homes.
            </h1>
            <p className="mt-5 text-lg text-white/75 max-w-xl leading-relaxed">
              As one of the fastest-growing James Hardie certified contractors in the
              region, we combine top-tier quality, highly trained crews, and professional
              management to deliver flawless results.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/contact">Get a Free Quote</Link>
              </Button>
              <Button asChild size="lg" variant="outlineWhite">
                <a href={SITE.phoneHref}>Call {SITE.phone}</a>
              </Button>
            </div>
          </div>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&q=80"
              alt="Newly renovated North Atlanta home with James Hardie siding installed by Siding Depot"
              className="rounded-xl object-cover w-full h-[460px] shadow-2xl"
              loading="eager"
            />
          </div>
        </div>
      </section>

      {/* DIFFERENTIATORS */}
      <section className="py-20 lg:py-24 bg-background">
        <div className="mx-auto max-w-5xl px-4 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-block text-xs font-bold tracking-[0.12em] uppercase text-sd-green-text bg-sd-green-pale px-3 py-1 rounded">
              Why Siding Depot
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-sd-black">
              What sets us apart from other remodeling contractors
            </h2>
            <p className="mt-3 text-sd-gray-text">
              Siding Depot is one of the fastest-growing James Hardie Replacement Contractors
              in Georgia. The differences are clear, the reasons are simple:
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
            <strong className="text-sd-navy">Siding, Painting, Windows, Decks, Gutter, and Roofing</strong>{" "}
            needs quickly, efficiently and affordably. We know how much quality means to you,
            and we work hard to give you the absolute best on every job.
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
                <div className="font-display text-6xl text-sd-green leading-none">{s.value}</div>
                <h3 className="mt-3 text-base font-bold uppercase tracking-wider">{s.label}</h3>
                <p className="mt-3 text-sm text-white/70 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PARTNERS / BRAND CAROUSEL */}
      <section className="py-16 bg-sd-gray-bg border-y border-sd-gray-border">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <p className="text-center text-xs font-bold tracking-[0.12em] uppercase text-sd-gray-text">
            Trusted partners &amp; manufacturers
          </p>
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-6 items-center">
            {PARTNER_LOGOS.map((src, i) => (
              <div key={src} className="flex items-center justify-center h-20">
                <img
                  src={src}
                  alt={`Manufacturer partner ${i + 1}`}
                  className="max-h-16 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CERTIFICATIONS */}
      <section className="py-20 lg:py-24 bg-background">
        <div className="mx-auto max-w-6xl px-4 lg:px-8 grid gap-10 lg:grid-cols-2 items-center">
          <div>
            <span className="inline-block text-xs font-bold tracking-[0.12em] uppercase text-sd-green-text bg-sd-green-pale px-3 py-1 rounded">
              Certifications
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-sd-black">
              Our Certifications
            </h2>
            <p className="mt-4 text-sd-gray-text leading-relaxed">
              Our certifications and recognitions reflect the quality, trust, and commitment we
              bring to every project. They validate our dedication to meeting the highest industry
              standards, ensuring our clients receive safety, excellence, and results that exceed
              expectations.
            </p>
            <p className="mt-6 text-lg font-semibold text-sd-navy">
              Experts in siding installation.
            </p>
          </div>
          <div className="flex justify-center">
            <img
              src={CERT_HERO}
              alt="James Hardie Elite Preferred Contractor certification"
              className="max-w-full h-auto rounded-xl"
              loading="lazy"
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
                <a href={SITE.phoneHref} className="flex items-center gap-3 text-sd-green hover:text-sd-green-hover">
                  <Phone className="h-5 w-5" /> {SITE.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${SITE.email}`} className="flex items-center gap-3 text-sd-green hover:text-sd-green-hover">
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
                  <MapPin className="h-5 w-5 mt-0.5 shrink-0" /> {SITE.address.full}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="font-display text-4xl">Follow Us</h2>
            <p className="mt-3 text-white/65 max-w-md">
              See real projects, before/after transformations and tips from our crews.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={SITE.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-pill bg-white/5 hover:bg-sd-green hover:text-sd-navy transition-colors px-5 py-3 text-sm font-semibold border border-white/10"
              >
                <Facebook className="h-4 w-4" /> Facebook
              </a>
              <a
                href={SITE.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-pill bg-white/5 hover:bg-sd-green hover:text-sd-navy transition-colors px-5 py-3 text-sm font-semibold border border-white/10"
              >
                <Instagram className="h-4 w-4" /> Instagram
              </a>
              <a
                href={SITE.social.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-pill bg-white/5 hover:bg-sd-green hover:text-sd-navy transition-colors px-5 py-3 text-sm font-semibold border border-white/10"
              >
                <Youtube className="h-4 w-4" /> YouTube
              </a>
              <a
                href={SITE.social.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-pill bg-white/5 hover:bg-sd-green hover:text-sd-navy transition-colors px-5 py-3 text-sm font-semibold border border-white/10"
              >
                <Music2 className="h-4 w-4" /> TikTok
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
