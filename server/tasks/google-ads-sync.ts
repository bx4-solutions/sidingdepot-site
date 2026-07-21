import { defineTask } from "nitropack/runtime";
import { createClient } from "@supabase/supabase-js";
import { fetchGoogleAdsCampaignMetrics, getGoogleAdsConfig } from "../../src/lib/google-ads.client.server";

export default defineTask({
  meta: { name: "google-ads:sync", description: "Sync read-only Google Ads campaign metrics" },
  async run() {
    const config = getGoogleAdsConfig();
    if (!config) return { result: { synced: 0, skipped: "Google Ads not configured" } };
    const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "";
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
    if (!url || !key) return { result: { synced: 0, skipped: "Supabase not configured" } };
    const admin = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
    const end = new Date();
    const start = new Date(end);
    start.setDate(end.getDate() - 30);
    const toDay = (d: Date) => d.toISOString().slice(0, 10);
    try {
      let synced = 0;
      for (const customerId of config.readCustomerIds) {
        const rows = await fetchGoogleAdsCampaignMetrics(toDay(start), toDay(end), customerId);
        const account = { customer_id: customerId, display_name: customerId === config.operationalCustomerId ? "Siding Depot (2025 · operacional)" : "Siding Depot (2023 · histórico)", last_synced_at: new Date().toISOString() };
        const { error: accountError } = await admin.from("google_ads_accounts").upsert(account);
        if (accountError) throw accountError;
        const campaigns = rows.map((row) => ({
          customer_id: customerId, metric_date: row.date, campaign_id: row.campaignId,
          campaign_name: row.campaignName, campaign_status: row.campaignStatus,
          campaign_channel_type: row.channelType, impressions: row.impressions, clicks: row.clicks,
          cost_micros: row.costMicros, conversions: row.conversions, conversion_value: row.conversionValue,
        }));
        if (campaigns.length) {
          const { error } = await admin.from("google_ads_campaign_metrics").upsert(campaigns);
          if (error) throw error;
        }
        synced += campaigns.length;
      }
      await admin.from("google_ads_sync_runs").insert({ customer_id: config.operationalCustomerId, status: "success", records_synced: synced, completed_at: new Date().toISOString() });
      return { result: { synced } };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown Google Ads sync error";
      console.error("[task] google-ads:sync", message);
      await admin.from("google_ads_sync_runs").insert({ customer_id: config.operationalCustomerId, status: "failed", error_message: message, completed_at: new Date().toISOString() });
      return { result: { synced: 0, error: message } };
    }
  },
});
