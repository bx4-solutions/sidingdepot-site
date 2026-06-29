import { Link } from "@tanstack/react-router";
import { Hammer } from "lucide-react";
import jamesHardieBadge from "@/assets/james-hardie-elite-contractor.png";

const GreenStar = () => (
  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-sd-green/20 shrink-0">
    <svg width="12" height="12" viewBox="0 0 24 24" fill="#B3D133" aria-hidden="true">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  </span>
);

const HammerIcon = () => (
  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-sd-green/20 shrink-0">
    <Hammer className="h-3 w-3" style={{ color: "#B3D133" }} aria-hidden />
  </span>
);

const GreenSkyIcon = () => (
  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-sd-green/20 shrink-0 font-bold text-[#B3D133] text-xs">
    $
  </span>
);

export function ProofBar() {
  const rating = 4.7;
  const combinedReviews = 550;
  return (
    <section aria-label="Trust signals" className="bg-sd-black">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <ul className="grid grid-cols-2 sm:flex sm:flex-nowrap items-center justify-center sm:divide-x sm:divide-white/10">
          {/* Box 1: Google Reviews */}
          <li className="flex-1 min-w-0">
            <a
              href="/#google-reviews"
              className="flex items-center justify-center sm:justify-start gap-2 px-3 py-2.5 min-h-[48px] w-full hover:bg-white/5 active:bg-white/5 transition-colors"
            >
              <GreenStar />
              <div className="min-w-0">
                <div className="text-white text-[10px] md:text-xs font-bold uppercase tracking-wide leading-none whitespace-nowrap truncate">
                  {rating}★ · {combinedReviews}+ Reviews
                </div>
              </div>
            </a>
          </li>

          {/* Box 2: James Hardie Elite */}
          <li className="flex-1 min-w-0">
            <a
              href="/#james-hardie-section"
              className="flex items-center justify-center sm:justify-start gap-2 px-3 py-2.5 min-h-[48px] w-full hover:bg-white/5 active:bg-white/5 transition-colors"
            >
              <img
                src={jamesHardieBadge}
                alt="JAMES HARDIE ELITE CONTRACTOR"
                className="h-8 w-auto shrink-0"
              />
              <div className="min-w-0">
                <div className="text-white text-[10px] md:text-xs font-bold uppercase tracking-wide leading-none whitespace-nowrap truncate">
                  James Hardie® Elite
                </div>
              </div>
            </a>
          </li>

          {/* Box 4: 1,500+ Homes */}
          <li className="flex-1 min-w-0">
            <Link
              to="/projects"
              className="flex items-center justify-center sm:justify-start gap-2 px-3 py-2.5 min-h-[48px] w-full hover:bg-white/5 active:bg-white/5 transition-colors"
            >
              <HammerIcon />
              <div className="min-w-0">
                <div className="text-white text-[10px] md:text-xs font-bold uppercase tracking-wide leading-none whitespace-nowrap truncate">
                  1,500+ Homes
                </div>
              </div>
            </Link>
          </li>

          {/* Box 5: GreenSky */}
          <li className="flex-1 min-w-0">
            <a
              href="/#financing"
              className="flex items-center justify-center sm:justify-start gap-2 px-3 py-2.5 min-h-[48px] w-full hover:bg-white/5 active:bg-white/5 transition-colors"
            >
              <GreenSkyIcon />
              <div className="min-w-0">
                <div className="text-white text-[10px] md:text-xs font-bold uppercase tracking-wide leading-none whitespace-nowrap truncate">
                  GreenSky® 0% APR Financing for 12 Months
                </div>
              </div>
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
}
