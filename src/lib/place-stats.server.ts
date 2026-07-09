// Server-only module — safe to import from __root.tsx loader.
// Uses Supabase as a persistent cross-instance cache so ALL Vercel function
// instances share the same live Google Places data.
// Google API is called at most once every 24 hours (daily cadence).

import { createClient } from "@supabase/supabase-js";

const GOOGLE_PLACES_API_URL = "https://maps.googleapis.com/maps/api/place/details/json";

/** Fallback when both Supabase and Google API are unavailable. */
export const FALLBACK_STATS = { rating: 4.7, totalReviews: 160 } as const;

/** How long to use cached stats before refreshing from Google (24 hours). */
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

// In-memory cache within a single Nitro worker instance (fast path).
let _memCache: { rating: number; totalReviews: number; cachedAt: number } | null = null;

/** Returns a Supabase admin client using runtime env vars. */
function getSupabaseClient() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "";
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    "";
  if (!url || !key) return null;
  return createClient(url, key);
}

/** Read the latest stats from Supabase (persistent cross-instance cache). */
async function readFromSupabase(): Promise<{
  rating: number;
  totalReviews: number;
  fetchedAt: Date;
} | null> {
  try {
    const sb = getSupabaseClient();
    if (!sb) return null;
    const { data, error } = await sb
      .from("google_place_stats")
      .select("rating, total_reviews, fetched_at")
      .eq("id", 1)
      .single();
    if (error || !data) return null;
    return {
      rating: Number(data.rating),
      totalReviews: Number(data.total_reviews),
      fetchedAt: new Date(data.fetched_at),
    };
  } catch {
    return null;
  }
}

/** Persist fresh stats to Supabase (upsert the singleton row). */
async function writeToSupabase(rating: number, totalReviews: number): Promise<void> {
  try {
    const sb = getSupabaseClient();
    if (!sb) return;
    await sb
      .from("google_place_stats")
      .upsert(
        { id: 1, rating, total_reviews: totalReviews, fetched_at: new Date().toISOString() },
        { onConflict: "id" },
      );
  } catch {
    // Non-fatal — memory cache still serves the value
  }
}

/** Fetch live stats from Google Places API and persist to Supabase. */
export async function refreshFromGoogle(): Promise<{ rating: number; totalReviews: number }> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY || process.env.GOOGLE_MAPS_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;
  if (!apiKey || !placeId) return { ...FALLBACK_STATS };

  try {
    const url = `${GOOGLE_PLACES_API_URL}?place_id=${placeId}&fields=rating,user_ratings_total&key=${apiKey}`;
    const res = await fetch(url);
    if (!res.ok) return { ...FALLBACK_STATS };
    const json = await res.json();
    if (json.status !== "OK" || !json.result) return { ...FALLBACK_STATS };
    const result = {
      rating: json.result.rating ?? FALLBACK_STATS.rating,
      totalReviews: json.result.user_ratings_total ?? FALLBACK_STATS.totalReviews,
    };
    // Persist to Supabase (async — don't block the response)
    writeToSupabase(result.rating, result.totalReviews).catch(() => {});
    // Update in-memory cache
    _memCache = { ...result, cachedAt: Date.now() };
    return result;
  } catch {
    return { ...FALLBACK_STATS };
  }
}

/**
 * Fetch Google Place stats with a 2-tier cache:
 *   1. In-memory (fast path within a single Nitro worker instance)
 *   2. Supabase (persistent cross-instance cache — updated every 48h)
 *   3. Google Places API (live source — refreshes when Supabase data is stale)
 *
 * Call from server-side loaders only. Never use createServerFn here
 * (avoids seroval serialization errors when called from other server contexts).
 */
export async function fetchGooglePlaceStats(): Promise<{ rating: number; totalReviews: number }> {
  // 1. In-memory fast path
  if (_memCache && Date.now() - _memCache.cachedAt < CACHE_TTL_MS) {
    return { rating: _memCache.rating, totalReviews: _memCache.totalReviews };
  }

  // 2. Supabase persistent cache
  const supabaseData = await readFromSupabase();
  if (supabaseData) {
    const age = Date.now() - supabaseData.fetchedAt.getTime();
    if (age < CACHE_TTL_MS) {
      // Supabase data is fresh — populate memory cache and return
      _memCache = {
        rating: supabaseData.rating,
        totalReviews: supabaseData.totalReviews,
        cachedAt: Date.now(),
      };
      return { rating: supabaseData.rating, totalReviews: supabaseData.totalReviews };
    }
  }

  // 3. Supabase data is stale (or missing) — call Google API and refresh
  return refreshFromGoogle();
}

/** Read the in-memory cache for use by getGoogleReviews (zero extra API calls). */
export function getPlaceStatsCache() {
  return _memCache;
}
