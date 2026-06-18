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

const DEFAULT: GoogleStats = { rating: 4.5, totalReviews: 160 };

export const GoogleStatsContext = createContext<GoogleStats>(DEFAULT);

export function useGoogleStats(): GoogleStats {
  return useContext(GoogleStatsContext);
}

// ── Live Google reviews (text cards), provided globally from the root loader ──
export type GoogleReview = {
  author_name: string;
  rating: number;
  text: string;
  relative_time_description: string;
  author_photo_url?: string;
};

export const GoogleReviewsContext = createContext<GoogleReview[]>([]);

export function useGoogleReviews(): GoogleReview[] {
  return useContext(GoogleReviewsContext);
}
