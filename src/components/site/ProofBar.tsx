import { Link } from "@tanstack/react-router";
import jhEliteBadge from "@/assets/jh-elite-badge.svg";

const GreenStar = () => (
  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-sd-green/20 shrink-0">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#B3D133" aria-hidden="true">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  </span>
);

const HouseCheck = () => (
  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-sd-green/20 shrink-0">
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#B3D133"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
      <path d="M9 14l2 2 4-4" />
    </svg>
  </span>
);

const GreenSkyIcon = () => (
  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-sd-green/20 shrink-0 font-bold text-[#B3D133] text-sm">
    G
  </span>
);

export function ProofBar() {
  return (
    <section aria-label="Trust signals" className="bg-sd-black">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <ul className="flex flex-wrap sm:flex-nowrap items-stretch justify-center divide-x divide-white/10">
          {/* Box 1: James Hardie Elite */}
          <li className="flex-1 min-w-0">
            <Link
              to="/siding"
              className="flex items-center gap-2.5 px-4 py-3.5 min-h-[60px] w-full hover:bg-white/5 active:bg-white/5 transition-colors"
            >
              <img
                src={jhEliteBadge}
                alt="James Hardie Elite Contractor"
                className="h-9 w-auto shrink-0"
              />
              <div className="min-w-0">
                <div className="text-white text-[11px] sm:text-xs font-bold uppercase tracking-wide leading-tight">
                  James Hardie
                </div>
                <div className="text-white/60 text-[10px] sm:text-[11px] leading-tight">
                  Elite Contractor
                </div>
              </div>
            </Link>
          </li>

          {/* Box 2: 4.7 · 512 Verified Reviews */}
          <li className="flex-1 min-w-0">
            <a
              href="/#google-reviews"
              className="flex items-center gap-2.5 px-4 py-3.5 min-h-[60px] w-full hover:bg-white/5 active:bg-white/5 transition-colors"
            >
              <GreenStar />
              <div className="min-w-0">
                <div className="text-white text-[11px] sm:text-xs font-bold uppercase tracking-wide leading-tight flex items-center gap-1">
                  4.7
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="#B3D133" aria-hidden="true">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
                <div className="text-white/60 text-[10px] sm:text-[11px] leading-tight">
                  512 Verified Reviews
                </div>
              </div>
            </a>
          </li>

          {/* Box 3: 1,500+ Homes */}
          <li className="flex-1 min-w-0">
            <Link
              to="/projects"
              className="flex items-center gap-2.5 px-4 py-3.5 min-h-[60px] w-full hover:bg-white/5 active:bg-white/5 transition-colors"
            >
              <HouseCheck />
              <div className="min-w-0">
                <div className="text-white text-[11px] sm:text-xs font-bold uppercase tracking-wide leading-tight">
                  1,500+ Homes
                </div>
                <div className="text-white/60 text-[10px] sm:text-[11px] leading-tight">
                  Completed in North Atlanta
                </div>
              </div>
            </Link>
          </li>

          {/* Box 4: GreenSky Financing */}
          <li className="flex-1 min-w-0">
            <Link
              to="/contact"
              className="flex items-center gap-2.5 px-4 py-3.5 min-h-[60px] w-full hover:bg-white/5 active:bg-white/5 transition-colors"
            >
              <GreenSkyIcon />
              <div className="min-w-0">
                <div className="text-white text-[11px] sm:text-xs font-bold uppercase tracking-wide leading-tight">
                  GreenSky® 0% APR
                </div>
                <div className="text-white/60 text-[10px] sm:text-[11px] leading-tight">
                  Financing for 12 months
                </div>
              </div>
            </Link>
          </li>
        </ul>
      </div>
    </section>
  );
}
