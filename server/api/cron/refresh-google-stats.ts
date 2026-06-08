/**
 * Vercel Cron endpoint — runs every 2 days at 06:00 UTC.
 * Fetches fresh stats from Google Places API and persists to Supabase
 * so all Vercel function instances share the updated count.
 *
 * Cron schedule: "0 6 */2 * *" (configured in vercel.json)
 */
import { defineEventHandler, createError } from "h3";
import { refreshFromGoogle } from "../../src/lib/place-stats.server";

export default defineEventHandler(async (event) => {
  // Protect against unauthorized calls (Vercel sends this header for cron jobs)
  const authHeader = event.node.req.headers["authorization"];
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }

  try {
    const result = await refreshFromGoogle();
    console.log(
      `[cron] Google stats refreshed — rating: ${result.rating}, reviews: ${result.totalReviews}`,
    );
    event.node.res.setHeader("Content-Type", "application/json");
    event.node.res.end(
      JSON.stringify({ ok: true, ...result, refreshedAt: new Date().toISOString() }),
    );
  } catch (err: any) {
    console.error("[cron] Failed to refresh Google stats:", err?.message);
    throw createError({ statusCode: 500, statusMessage: "Refresh failed" });
  }
});
