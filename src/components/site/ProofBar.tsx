import { Link } from "@tanstack/react-router";
import { Hammer, ShieldCheck } from "lucide-react";
import { useGoogleStats } from "@/lib/google-stats-context";
import jamesHardieBadge from "@/assets/james-hardie-elite-badge.png";

const GreenStar = () => (
  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-sd-green/20 shrink-0">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#B3D133" aria-hidden="true">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  </span>
);

const HammerIcon = () => (
  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-sd-green/20 shrink-0">
    <Hammer className="h-4 w-4" style={{ color: "#B3D133" }} aria-hidden />
  </span>
);

const GreenSkyIcon = () => (
  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-sd-green/20 shrink-0 font-bold text-[#B3D133] text-base">
    $
  </span>
);

const TrustIcon = () => (
  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-sd-green/20 shrink-0">
    <ShieldCheck className="h-4 w-4" style={{ color: "#B3D133" }} aria-hidden />
  </span>
);

export function ProofBar() {
  const { rating, totalReviews } = useGoogleStats();
  // Combined total: Google (live) + GuildQuality 261 + Thumbtack 91
  const combinedReviews = totalReviews + 352;
  return (
    <section aria-label="Trust signals" className="bg-sd-black">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <ul className="grid grid-cols-2 sm:flex sm:flex-nowrap items-stretch justify-center sm:divide-x sm:divide-white/10">

          {/* Box 1: 4.7★ · 550+ Verified Reviews → seção Google Reviews */}
          <li className="flex-1 min-w-0">
            <a
              href="/#google-reviews"
              className="flex items-center gap-2.5 px-4 py-3.5 min-h-[60px] w-full hover:bg-white/5 active:bg-white/5 transition-colors"
            >
              <GreenStar />
              <div className="min-w-0">
                <div className="text-white text-[11px] sm:text-xs font-bold uppercase tracking-wide leading-tight flex items-center gap-1">
                  {rating}★ · {combinedReviews}+ Verified Reviews
                </div>
              </div>
            </a>
          </li>

          {/* Box 2: James Hardie Elite → seção James Hardie na home */}
          <li className="flex-1 min-w-0">
            <a
              href="/#james-hardie-section"
              className="flex items-center gap-2.5 px-4 py-3.5 min-h-[60px] w-full hover:bg-white/5 active:bg-white/5 transition-colors"
            >
              <img
                src={jamesHardieBadge}
                alt="James Hardie Elite Contractor"
                className="h-9 w-auto shrink-0"
              />
              <div className="min-w-0">
                <div className="text-white text-[11px] sm:text-xs font-bold uppercase tracking-wide leading-tight">
                  James Hardie® Elite Contractor
                </div>
              </div>
            </a>
          </li>

          {/* Box 3: GuildQuality → seção GuildQuality na home */}
          <li className="flex-1 min-w-0">
            <a
              href="/#guild-reviews"
              className="flex items-center gap-2.5 px-4 py-3.5 min-h-[60px] w-full hover:bg-white/5 active:bg-white/5 transition-colors"
            >
              <TrustIcon />
              <div className="min-w-0">
                <div className="text-white text-[11px] sm:text-xs font-bold uppercase tracking-wide leading-tight">
                  GuildQuality Verified
                </div>
              </div>
            </a>
          </li>

          {/* Box 4: 1,500+ Homes → página Galeria/Projetos */}
          <li className="flex-1 min-w-0">
            <Link
              to="/projects"
              className="flex items-center gap-2.5 px-4 py-3.5 min-h-[60px] w-full hover:bg-white/5 active:bg-white/5 transition-colors"
            >
              <HammerIcon />
              <div className="min-w-0">
                <div className="text-white text-[11px] sm:text-xs font-bold uppercase tracking-wide leading-tight">
                  1,500+ Homes Completed
                </div>
              </div>
            </Link>
          </li>

          {/* Box 5: GreenSky → seção Financiamento na home */}
          <li className="flex-1 min-w-0 text-center sm:text-left">
            <a
              href="/#financing"
              className="flex items-center gap-2.5 px-4 py-3.5 min-h-[60px] w-full hover:bg-white/5 active:bg-white/5 transition-colors"
            >
              <GreenSkyIcon />
              <div className="min-w-0">
                <div className="text-white text-[11px] sm:text-xs font-bold uppercase tracking-wide leading-tight">
                  GreenSky® 0% APR Financing for 12 months
                </div>
              </div>
            </a>
          </li>

        </ul>
      </div>
    </section>
  );
}
