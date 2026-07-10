/**
 * Nitro scheduled task: google:refresh
 * Registered in vite.config.ts -> nitro.scheduledTasks
 * Called by Vercel Cron every 3 days via /_vercel/cron route.
 */
import { defineTask } from "nitropack/runtime";
import { refreshFromGoogle } from "../src/lib/place-stats.server";

export default defineTask({
  meta: {
    name: "google:refresh",
    description: "Refresh Google Place stats from API and persist to Supabase",
  },
  async run() {
    const result = await refreshFromGoogle();
    console.log(
      `[task] google:refresh — rating: ${result.rating}, reviews: ${result.totalReviews}`,
    );
    return { result };
  },
});
