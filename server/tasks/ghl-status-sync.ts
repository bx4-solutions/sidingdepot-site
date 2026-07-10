/**
 * Nitro scheduled task: ghl:status-sync
 * Registered in vite.config.ts -> nitro.scheduledTasks
 * Called by Vercel Cron via /_vercel/cron route.
 *
 * Pulls current status/stage/value for every lead that has a linked GHL
 * opportunity and writes it back to Supabase `leads`, so /admin/leads shows
 * the real pipeline state instead of a status that never leaves "new".
 */
import { defineTask } from "nitropack/runtime";
import { createClient } from "@supabase/supabase-js";
import {
  getOpportunity,
  getPipelineStageName,
  isGhlConfigured,
} from "../src/lib/ghl-client.server";

const BATCH_SIZE = 50;

export default defineTask({
  meta: {
    name: "ghl:status-sync",
    description: "Sync opportunity status/stage/value from GHL back into Supabase leads",
  },
  async run() {
    if (!isGhlConfigured()) {
      return { result: { synced: 0, skipped: "GHL not configured" } };
    }

    const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "";
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
    if (!supabaseUrl || !serviceKey) {
      return { result: { synced: 0, skipped: "Supabase not configured" } };
    }

    const admin = createClient(supabaseUrl, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data: leads, error } = await admin
      .from("leads")
      .select("id, ghl_opportunity_id")
      .not("ghl_opportunity_id", "is", null)
      .order("ghl_synced_at", { ascending: true, nullsFirst: true })
      .limit(BATCH_SIZE);

    if (error || !leads) {
      console.error("[task] ghl:status-sync — failed to load leads:", error);
      return { result: { synced: 0, error: error?.message } };
    }

    let synced = 0;
    for (const lead of leads) {
      const snapshot = await getOpportunity(lead.ghl_opportunity_id as string);
      if (!snapshot) continue;

      const stageName = await getPipelineStageName(snapshot.pipelineStageId);
      const isClosed = snapshot.status === "won" || snapshot.status === "lost";

      const { error: updateError } = await admin
        .from("leads")
        .update({
          opportunity_status: snapshot.status,
          pipeline_stage: stageName,
          opportunity_value: snapshot.monetaryValue,
          close_date: isClosed ? new Date().toISOString() : null,
          ghl_synced_at: new Date().toISOString(),
        })
        .eq("id", lead.id);

      if (!updateError) synced++;
    }

    console.log(`[task] ghl:status-sync — synced ${synced}/${leads.length} leads`);
    return { result: { synced, total: leads.length } };
  },
});
