import { defineTask } from "nitropack/runtime";
import { createClient } from "@supabase/supabase-js";
import { fetchMetaAdsAccount, fetchMetaAdsInsights, fetchMetaAdsMetadata, getMetaAdsConfig } from "../../src/lib/meta-ads.client.server";

const day = (date: Date) => date.toISOString().slice(0, 10);

export default defineTask({
  meta: { name: "meta-ads:sync", description: "Sync read-only Meta Ads metrics and creatives" },
  async run() {
    const config = getMetaAdsConfig();
    if (!config) return { result: { synced: 0, skipped: "Meta Ads not configured" } };
    const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "";
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
    if (!url || !key) return { result: { synced: 0, skipped: "Supabase not configured" } };
    const admin = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
    const end = new Date();
    const start = new Date(end);
    start.setDate(end.getDate() - config.lookbackDays);
    const accountId = config.accountId;
    try {
      const [account, campaignRows, adsetRows, adRows, metadata] = await Promise.all([
        fetchMetaAdsAccount(), fetchMetaAdsInsights(day(start), day(end), "campaign"), fetchMetaAdsInsights(day(start), day(end), "adset"), fetchMetaAdsInsights(day(start), day(end), "ad"), fetchMetaAdsMetadata(),
      ]);
      const campaignById = new Map(metadata.campaigns.map((item: any) => [String(item.id), item]));
      const adsetById = new Map(metadata.adsets.map((item: any) => [String(item.id), item]));
      const adById = new Map(metadata.ads.map((item: any) => [String(item.id), item]));
      const now = new Date().toISOString();
      const { error: accountError } = await admin.from("meta_ads_accounts").upsert({ account_id: accountId, display_name: account.name || "Meta Ads", currency_code: account.currency || "USD", time_zone: account.timezone_name || null, account_status: String(account.account_status || ""), last_synced_at: now });
      if (accountError) throw accountError;
      const campaigns = campaignRows.map((row) => {
        const item: any = campaignById.get(row.campaignId);
        return { account_id: accountId, metric_date: row.date, campaign_id: row.campaignId, campaign_name: row.campaignName, campaign_status: item?.effective_status || item?.status || null, objective: item?.objective || null, impressions: row.impressions, reach: row.reach, clicks: row.clicks, inline_link_clicks: row.inlineLinkClicks, spend: row.spend, leads: row.leads };
      });
      const adsets = adsetRows.filter((row) => row.adsetId).map((row) => {
        const item: any = adsetById.get(row.adsetId!);
        return { account_id: accountId, metric_date: row.date, adset_id: row.adsetId, adset_name: row.adsetName || "Sem nome", adset_status: item?.effective_status || item?.status || null, campaign_id: row.campaignId, campaign_name: row.campaignName, impressions: row.impressions, reach: row.reach, clicks: row.clicks, inline_link_clicks: row.inlineLinkClicks, spend: row.spend, leads: row.leads };
      });
      const ads = adRows.filter((row) => row.adId && row.adsetId).map((row) => {
        const item: any = adById.get(row.adId!);
        return { account_id: accountId, metric_date: row.date, ad_id: row.adId, ad_name: row.adName || "Sem nome", ad_status: item?.effective_status || item?.status || null, campaign_id: row.campaignId, campaign_name: row.campaignName, adset_id: row.adsetId, adset_name: row.adsetName || "Sem nome", creative_id: item?.creative?.id || null, impressions: row.impressions, reach: row.reach, clicks: row.clicks, inline_link_clicks: row.inlineLinkClicks, spend: row.spend, leads: row.leads };
      });
      const creatives = metadata.ads.filter((ad: any) => ad.creative?.id).map((ad: any) => ({ account_id: accountId, creative_id: String(ad.creative.id), ad_id: String(ad.id), creative_name: ad.creative.name || null, thumbnail_url: ad.creative.thumbnail_url || null, image_url: ad.creative.image_url || null, title: ad.creative.title || null, body: ad.creative.body || null, call_to_action_type: ad.creative.call_to_action_type || null, link_url: ad.creative.link_url || null, video_id: ad.creative.video_id || null, raw_creative: ad.creative, last_synced_at: now }));
      for (const [table, rows] of [["meta_ads_campaign_metrics", campaigns], ["meta_ads_adset_metrics", adsets], ["meta_ads_ad_metrics", ads], ["meta_ads_creatives", creatives]] as const) {
        if (!rows.length) continue;
        const { error } = await admin.from(table).upsert(rows);
        if (error) throw error;
      }
      const synced = campaigns.length + adsets.length + ads.length + creatives.length;
      await admin.from("meta_ads_sync_runs").insert({ account_id: accountId, status: "success", records_synced: synced, completed_at: now });
      return { result: { synced } };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown Meta Ads sync error";
      console.error("[task] meta-ads:sync", message);
      await admin.from("meta_ads_sync_runs").insert({ account_id: accountId, status: "failed", error_message: message, completed_at: new Date().toISOString() });
      return { result: { synced: 0, error: message } };
    }
  },
});
