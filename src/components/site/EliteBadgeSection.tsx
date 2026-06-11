import { ArrowRight } from "lucide-react";
import { useGoogleStats } from "@/lib/google-stats-context";
import jamesHardieBadge from "@/assets/james-hardie-elite-badge.png";

const SD_NAVY = "#1e2a3a";
const SD_LIME = "#B3D133";
const SD_LIME_TEXT = "#3C4A07";

export function EliteBadgeSection() {
  const { rating: googleRating, totalReviews: googleReviewCount } = useGoogleStats();
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden bg-gray-50">
      <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span
            className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-5"
            style={{ background: SD_LIME, color: SD_NAVY }}
          >
            Certifications & Awards
          </span>
          <h2
            className="font-display text-4xl sm:text-5xl leading-tight"
            style={{ color: SD_NAVY }}
          >
            The Credentials That Protect
            <br />
            <span style={{ color: SD_LIME_TEXT }}>Your Investment.</span>
          </h2>
          <p className="mt-5 text-gray-500 max-w-xl mx-auto leading-relaxed">
            These aren't self-given titles. Every certification below is independently awarded,
            verified, and renewed — with a direct impact on your warranty coverage and project
            quality.
          </p>
        </div>

        {/* Main card: dark navy badge panel + white explanation */}
        <div
          className="rounded-3xl overflow-hidden mb-6 shadow-2xl"
          style={{ border: `2px solid ${SD_LIME}` }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-0">
            {/* Badge panel — SD dark navy */}
            <div
              className="flex flex-col items-center justify-center gap-5 p-8 lg:p-10"
              style={{ background: SD_NAVY }}
            >
              <img
                src={jamesHardieBadge}
                alt="James Hardie Alliance Elite Preferred Contractor badge"
                className="w-full h-auto object-contain"
                style={{
                  maxWidth: "340px",
                  filter: "drop-shadow(0 6px 20px rgba(0,0,0,0.45))",
                }}
                loading="lazy"
              />
              <p
                className="text-center text-sm font-bold uppercase tracking-wider"
                style={{ color: SD_LIME }}
              >
                ★ Top 2% Nationwide
              </p>
            </div>

            {/* Explanation panel — white */}
            <div className="p-8 lg:p-12 flex flex-col justify-center bg-white">
              <p
                className="text-xs font-bold uppercase tracking-widest mb-3"
                style={{ color: SD_LIME_TEXT }}
              >
                James Hardie® Alliance — Elite Preferred
              </p>
              <h3
                className="font-display text-3xl lg:text-4xl leading-tight mb-5"
                style={{ color: SD_NAVY }}
              >
                The highest designation
                <br />
                James Hardie awards.
              </h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Elite Preferred requires passing rigorous installation audits, maintaining certified
                crews, and meeting James Hardie's highest quality benchmarks year over year. It's
                renewed annually — not just awarded once.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                <strong style={{ color: SD_NAVY }}>What it means for you:</strong> only Elite
                Preferred contractors can offer the 30-year non-prorated warranty — covering both
                materials and labor. Standard contractors max out at 15-year prorated coverage.
              </p>

              <div className="grid sm:grid-cols-3 gap-3">
                {[
                  { val: "Top 2%", desc: "of US installers" },
                  { val: "30-Year", desc: "non-prorated warranty" },
                  { val: "Since 2019", desc: "GuildQuality member" },
                ].map((s) => (
                  <div
                    key={s.val}
                    className="rounded-xl p-4 text-center"
                    style={{ background: SD_NAVY }}
                  >
                    <p className="font-display text-2xl font-bold" style={{ color: SD_LIME }}>
                      {s.val}
                    </p>
                    <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.6)" }}>
                      {s.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Secondary credentials row */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            {
              name: "GuildQuality",
              rating: "4.7★",
              detail: "261 verified reviews · Guildmember since 2019",
              href: "https://www.guildquality.com/profile/siding-depot-llc",
            },
            {
              name: "Google Reviews",
              rating: `${googleRating}★`,
              detail: `${googleReviewCount} Google customer reviews`,
              href: "https://www.google.com/search?q=Siding+Depot+Marietta+GA+reviews",
            },
            {
              name: "Thumbtack",
              rating: "4.9★",
              detail: "91 reviews · Top Pro badge",
              href: "https://www.thumbtack.com/ga/marietta/vinyl-siding-install/siding-depot-llc/service/482073672544780291",
            },
            {
              name: "BuildZoom",
              rating: "#1",
              detail: "Licensed · Verified contractor · North Atlanta",
              href: "https://www.buildzoom.com/contractor/siding-depot-llc",
            },
            {
              name: "GreenSky® Financing",
              rating: "0% APR",
              detail: "Apply in 60 sec · Decisions in minutes",
              href: "https://www.greensky.com/home-improvement/",
            },
          ].map((c) => {
            const inner = (
              <div
                className="rounded-2xl p-5 h-full flex flex-col gap-2 bg-white transition-all hover:shadow-lg"
                style={{
                  border: `2px solid ${SD_LIME}`,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                }}
              >
                <div className="h-1 w-10 rounded-full mb-1" style={{ background: SD_LIME }} />
                <div className="flex items-center justify-between">
                  <span
                    className="text-xs font-bold uppercase tracking-wider"
                    style={{ color: SD_NAVY }}
                  >
                    {c.name}
                  </span>
                  {c.href && <ArrowRight className="h-3.5 w-3.5" style={{ color: SD_LIME_TEXT }} />}
                </div>
                <p className="font-display text-3xl font-bold" style={{ color: SD_NAVY }}>
                  {c.rating}
                </p>
                <p className="text-xs text-gray-400 leading-relaxed">{c.detail}</p>
              </div>
            );

            return c.href ? (
              <a
                key={c.name}
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                {inner}
              </a>
            ) : (
              <div key={c.name}>{inner}</div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
