import { Award, BadgeCheck, ShieldCheck, Star, Wrench } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { AWARDS, SITE } from "@/data/site";
import { useGoogleStats } from "@/lib/google-stats-context";

const SD_NAVY = "#1e2a3a";
const SD_LIME = "#B3D133";
const SD_LIME_TEXT = "#3C4A07";

const DollarIcon = ({ style }: { className?: string; style?: React.CSSProperties }) => (
  <span style={{ ...style, fontSize: "1.4rem", fontWeight: 700, lineHeight: 1 }} aria-hidden>
    $
  </span>
);

const ICONS = [Award, Wrench, Star, ShieldCheck, BadgeCheck, DollarIcon];

const AWARD_LINKS: Record<string, { type: "internal" | "anchor" | "external"; href: string }> = {
  "James Hardie Elite Contractor": { type: "internal", href: "/siding" },
  "GAF Factory Certified": { type: "internal", href: "/roofing" },
  "BBB Accredited": { type: "anchor", href: "/#google-reviews" },
  "GreenSky Financing": { type: "external", href: SITE.greenSkyUrl },
};

export function AwardsStrip() {
  const { rating, totalReviews } = useGoogleStats();
  const awards = AWARDS.map((a) =>
    a.name.includes("Verified Reviews") || a.name.includes("Reviews")
      ? { name: `${rating} ⭐️ ${totalReviews + 352}+ Reviews`, subtitle: "Across Google, GuildQuality, Thumbtack, and AngiLeads" }
      : a,
  );

  return (
    <section className="py-14 bg-white border-y border-sd-gray-border">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <p className="text-center text-xs font-bold tracking-[0.16em] uppercase text-sd-gray-text">
          Certified · Awarded · Trusted
        </p>
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {awards.map((a, i) => {
            const Icon = ICONS[i] ?? Award;
            const isGoogle = a.name.includes("Reviews");

            const cardContent = (
              <div
                className="flex flex-col items-start px-4 py-4 rounded-2xl bg-white h-full transition-all hover:shadow-lg"
                style={{
                  border: `2px solid ${SD_LIME}`,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                }}
              >
                <div className="h-1 w-10 rounded-full mb-3" style={{ background: SD_LIME }} />
                <Icon className="h-6 w-6 mb-2" style={{ color: SD_LIME }} aria-hidden />
                <p className="text-sm font-bold leading-tight" style={{ color: SD_NAVY }}>
                  {a.name}
                </p>
                <p className="mt-0.5 text-xs leading-tight" style={{ color: "#9ca3af" }}>
                  {a.subtitle}
                </p>
              </div>
            );

            if (isGoogle) {
              return (
                <a key={a.name} href="/#google-reviews" className="block">
                  {cardContent}
                </a>
              );
            }

            const link = AWARD_LINKS[a.name];
            if (link?.type === "internal") {
              return (
                <Link key={a.name} to={link.href} className="block">
                  {cardContent}
                </Link>
              );
            }
            if (link?.type === "anchor") {
              return (
                <a key={a.name} href={link.href} className="block">
                  {cardContent}
                </a>
              );
            }
            if (link?.type === "external") {
              return (
                <a
                  key={a.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  {cardContent}
                </a>
              );
            }

            return <div key={a.name}>{cardContent}</div>;
          })}
        </div>
      </div>
    </section>
  );
}
