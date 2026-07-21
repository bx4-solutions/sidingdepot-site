// One-off manual backfill runner for Meta Ads (READ-ONLY). Self-contained: replicates
// the read logic of src/lib/meta-ads.client.server.ts (avoids the "server-only" import).
// Token is read from the local credentials file (never inlined on the CLI).
// Run: bun run scripts/run-meta-ads-sync.ts
import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

// --- config ---
const credPath =
  "/Users/severinobione/.claude/projects/-Users-severinobione-Desktop-Projeto-SidingDdept-jun-26-finalizado/credentials/meta-ads-credentials.env";
const cred = Object.fromEntries(
  readFileSync(credPath, "utf8")
    .split("\n")
    .filter((l) => l && !l.startsWith("#") && l.includes("="))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    }),
);
const ACCESS_TOKEN = cred.META_LONG_LIVED_TOKEN as string;
const ACCOUNT_ID = "133749310327870";
const API = "v25.0";
const LOOKBACK = 90;
if (!ACCESS_TOKEN) throw new Error("META token missing in credentials file");

const day = (d: Date) => d.toISOString().slice(0, 10);
const numeric = (v: unknown) => Number(v || 0);
const getLeads = (actions: Array<{ action_type?: string; value?: string }> | undefined) => {
  const byType = new Map((actions || []).map((a) => [a.action_type, numeric(a.value)]));
  return (
    byType.get("lead") ||
    byType.get("offsite_complete_registration_add_meta_leads") ||
    byType.get("offsite_complete_registration") ||
    0
  );
};

async function graph<T>(pathOrUrl: string): Promise<T> {
  const url = pathOrUrl.startsWith("http")
    ? new URL(pathOrUrl)
    : new URL(`https://graph.facebook.com/${API}/${pathOrUrl}`);
  if (!url.searchParams.has("access_token")) url.searchParams.set("access_token", ACCESS_TOKEN);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Meta API failed (${res.status}): ${await res.text()}`);
  return res.json() as Promise<T>;
}
async function graphAll<T>(path: string): Promise<T[]> {
  const rows: T[] = [];
  let next: string | undefined = path;
  while (next) {
    const page: { data?: T[]; paging?: { next?: string } } = await graph(next);
    rows.push(...(page.data || []));
    next = page.paging?.next;
  }
  return rows;
}

const insightFields = [
  "date_start",
  "campaign_id",
  "campaign_name",
  "adset_id",
  "adset_name",
  "ad_id",
  "ad_name",
  "impressions",
  "reach",
  "clicks",
  "inline_link_clicks",
  "spend",
  "actions",
].join(",");
async function fetchInsights(since: string, until: string, level: "campaign" | "adset" | "ad") {
  const params = new URLSearchParams({
    fields: insightFields,
    level,
    time_increment: "1",
    time_range: JSON.stringify({ since, until }),
    limit: "500",
  });
  const rows = await graphAll<any>(`act_${ACCOUNT_ID}/insights?${params}`);
  return rows.map((r) => ({
    date: r.date_start,
    campaignId: String(r.campaign_id),
    campaignName: r.campaign_name || "Sem nome",
    adsetId: r.adset_id ? String(r.adset_id) : null,
    adsetName: r.adset_name || null,
    adId: r.ad_id ? String(r.ad_id) : null,
    adName: r.ad_name || null,
    impressions: numeric(r.impressions),
    reach: numeric(r.reach),
    clicks: numeric(r.clicks),
    inlineLinkClicks: numeric(r.inline_link_clicks),
    spend: numeric(r.spend),
    leads: getLeads(r.actions),
  }));
}

const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "";
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
if (!url || !key)
  throw new Error("Supabase env missing (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)");
const admin = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });

const end = new Date();
const start = new Date(end);
start.setDate(end.getDate() - LOOKBACK);
console.log(
  `[sync] account act_${ACCOUNT_ID} | ${day(start)} → ${day(end)} (${LOOKBACK}d) | api ${API}`,
);

try {
  const [account, campaignRows, adsetRows, adRows, campaigns_m, adsets_m, ads_m] =
    await Promise.all([
      graph<any>(`act_${ACCOUNT_ID}?fields=id,name,currency,timezone_name,account_status`),
      fetchInsights(day(start), day(end), "campaign"),
      fetchInsights(day(start), day(end), "adset"),
      fetchInsights(day(start), day(end), "ad"),
      graphAll<any>(
        `act_${ACCOUNT_ID}/campaigns?fields=id,name,status,effective_status,objective&limit=500`,
      ),
      graphAll<any>(
        `act_${ACCOUNT_ID}/adsets?fields=id,name,status,effective_status,campaign_id&limit=500`,
      ),
      graphAll<any>(
        `act_${ACCOUNT_ID}/ads?fields=id,name,status,effective_status,campaign_id,adset_id,creative{id,name,thumbnail_url,image_url,title,body,call_to_action_type,link_url,video_id}&limit=500`,
      ),
    ]);
  console.log(
    `[sync] fetched: account=${account.name} (${account.currency}) | insight rows campaign=${campaignRows.length} adset=${adsetRows.length} ad=${adRows.length} | meta campaigns=${campaigns_m.length} adsets=${adsets_m.length} ads=${ads_m.length}`,
  );

  const campaignById = new Map(campaigns_m.map((i) => [String(i.id), i]));
  const adsetById = new Map(adsets_m.map((i) => [String(i.id), i]));
  const adById = new Map(ads_m.map((i) => [String(i.id), i]));
  const now = new Date().toISOString();

  const { error: accErr } = await admin
    .from("meta_ads_accounts")
    .upsert({
      account_id: ACCOUNT_ID,
      display_name: account.name || "Meta Ads",
      currency_code: account.currency || "USD",
      time_zone: account.timezone_name || null,
      account_status: String(account.account_status || ""),
      last_synced_at: now,
    });
  if (accErr) throw accErr;

  const campaigns = campaignRows.map((row) => {
    const it: any = campaignById.get(row.campaignId);
    return {
      account_id: ACCOUNT_ID,
      metric_date: row.date,
      campaign_id: row.campaignId,
      campaign_name: row.campaignName,
      campaign_status: it?.effective_status || it?.status || null,
      objective: it?.objective || null,
      impressions: row.impressions,
      reach: row.reach,
      clicks: row.clicks,
      inline_link_clicks: row.inlineLinkClicks,
      spend: row.spend,
      leads: row.leads,
    };
  });
  const adsets = adsetRows
    .filter((r) => r.adsetId)
    .map((row) => {
      const it: any = adsetById.get(row.adsetId!);
      return {
        account_id: ACCOUNT_ID,
        metric_date: row.date,
        adset_id: row.adsetId,
        adset_name: row.adsetName || "Sem nome",
        adset_status: it?.effective_status || it?.status || null,
        campaign_id: row.campaignId,
        campaign_name: row.campaignName,
        impressions: row.impressions,
        reach: row.reach,
        clicks: row.clicks,
        inline_link_clicks: row.inlineLinkClicks,
        spend: row.spend,
        leads: row.leads,
      };
    });
  const ads = adRows
    .filter((r) => r.adId && r.adsetId)
    .map((row) => {
      const it: any = adById.get(row.adId!);
      return {
        account_id: ACCOUNT_ID,
        metric_date: row.date,
        ad_id: row.adId,
        ad_name: row.adName || "Sem nome",
        ad_status: it?.effective_status || it?.status || null,
        campaign_id: row.campaignId,
        campaign_name: row.campaignName,
        adset_id: row.adsetId,
        adset_name: row.adsetName || "Sem nome",
        creative_id: it?.creative?.id || null,
        impressions: row.impressions,
        reach: row.reach,
        clicks: row.clicks,
        inline_link_clicks: row.inlineLinkClicks,
        spend: row.spend,
        leads: row.leads,
      };
    });
  const creatives = ads_m
    .filter((ad) => ad.creative?.id)
    .map((ad) => ({
      account_id: ACCOUNT_ID,
      creative_id: String(ad.creative.id),
      ad_id: String(ad.id),
      creative_name: ad.creative.name || null,
      thumbnail_url: ad.creative.thumbnail_url || null,
      image_url: ad.creative.image_url || null,
      title: ad.creative.title || null,
      body: ad.creative.body || null,
      call_to_action_type: ad.creative.call_to_action_type || null,
      link_url: ad.creative.link_url || null,
      video_id: ad.creative.video_id || null,
      raw_creative: ad.creative,
      last_synced_at: now,
    }));

  for (const [table, rows] of [
    ["meta_ads_campaign_metrics", campaigns],
    ["meta_ads_adset_metrics", adsets],
    ["meta_ads_ad_metrics", ads],
    ["meta_ads_creatives", creatives],
  ] as const) {
    if (!rows.length) {
      console.log(`[sync] ${table}: 0 rows`);
      continue;
    }
    const { error } = await admin.from(table).upsert(rows as any);
    if (error) throw error;
    console.log(`[sync] ${table}: ${rows.length} rows upserted`);
  }
  const synced = campaigns.length + adsets.length + ads.length + creatives.length;
  await admin
    .from("meta_ads_sync_runs")
    .insert({
      account_id: ACCOUNT_ID,
      status: "success",
      records_synced: synced,
      completed_at: now,
    });
  console.log(`\n[sync] DONE ✅ total records synced = ${synced} at ${now}`);
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  await admin
    .from("meta_ads_sync_runs")
    .insert({
      account_id: ACCOUNT_ID,
      status: "failed",
      error_message: message,
      completed_at: new Date().toISOString(),
    });
  console.error(`\n[sync] FAILED ❌ ${message}`);
  process.exit(1);
}
