/**
 * GoogleStatsContext — single source of truth for Google rating + review count.
 * Loaded once in the root route loader, provided globally so every component
 * (EliteBadgeSection, GoogleReviewsCarousel, etc.) reads the same live value
 * without individual API calls.
 */
import { createContext, useContext } from "react";

export type GoogleStats = {
  rating: number;
  totalReviews: number;
};

const DEFAULT: GoogleStats = { rating: 4.4, totalReviews: 162 };

export const GoogleStatsContext = createContext<GoogleStats>(DEFAULT);

export function useGoogleStats(): GoogleStats {
  return useContext(GoogleStatsContext);
}
