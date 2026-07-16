import "server-only";

export type MetaAdsConfig = {
  accessToken: string;
  accountId: string;
  apiVersion: string;
  lookbackDays: number;
};

export type MetaInsightRow = {
  date: string;
  campaignId: string;
  campaignName: string;
  campaignStatus: string | null;
  objective: string | null;
  adsetId: string | null;
  adsetName: string | null;
  adsetStatus: string | null;
  adId: string | null;
  adName: string | null;
  adStatus: string | null;
  impressions: number;
  reach: number;
  clicks: number;
  inlineLinkClicks: number;
  spend: number;
  leads: number;
};

const cleanAccountId = (value: string) => value.replace(/^act_/, "").replace(/\D/g, "");
const numeric = (value: unknown) => Number(value || 0);

export function getMetaAdsConfig(): MetaAdsConfig | null {
  const accessToken = process.env.META_ADS_ACCESS_TOKEN;
  const accountId = process.env.META_ADS_ACCOUNT_ID;
  if (!accessToken || !accountId) return null;
  return {
    accessToken,
    accountId: cleanAccountId(accountId),
    apiVersion: process.env.META_ADS_API_VERSION || "v25.0",
    lookbackDays: Math.max(30, Number(process.env.META_ADS_SYNC_LOOKBACK_DAYS || 90)),
  };
}

function getLeads(actions: Array<{ action_type?: string; value?: string }> | undefined) {
  const byType = new Map((actions || []).map((action) => [action.action_type, numeric(action.value)]));
  return byType.get("lead") || byType.get("offsite_complete_registration_add_meta_leads") || byType.get("offsite_complete_registration") || 0;
}

async function fetchGraph<T>(pathOrUrl: string, config: MetaAdsConfig): Promise<T> {
  const url = pathOrUrl.startsWith("http") ? new URL(pathOrUrl) : new URL(`https://graph.facebook.com/${config.apiVersion}/${pathOrUrl}`);
  if (!url.searchParams.has("access_token")) url.searchParams.set("access_token", config.accessToken);
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Meta Marketing API failed (${response.status}): ${await response.text()}`);
  return response.json() as Promise<T>;
}

async function fetchAll<T>(path: string, config: MetaAdsConfig): Promise<T[]> {
  const rows: T[] = [];
  let next: string | undefined = path;
  while (next) {
    const page: { data?: T[]; paging?: { next?: string } } = await fetchGraph(next, config);
    rows.push(...(page.data || []));
    next = page.paging?.next;
  }
  return rows;
}

const insightFields = [
  "date_start", "campaign_id", "campaign_name", "adset_id", "adset_name", "ad_id", "ad_name",
  "impressions", "reach", "clicks", "inline_link_clicks", "spend", "actions",
].join(",");

export async function fetchMetaAdsAccount() {
  const config = getMetaAdsConfig();
  if (!config) throw new Error("Meta Ads is not configured");
  return fetchGraph<{ id: string; name?: string; currency?: string; timezone_name?: string; account_status?: number }>(
    `act_${config.accountId}?fields=id,name,currency,timezone_name,account_status`, config,
  );
}

export async function fetchMetaAdsInsights(startDate: string, endDate: string, level: "campaign" | "adset" | "ad") {
  const config = getMetaAdsConfig();
  if (!config) throw new Error("Meta Ads is not configured");
  const params = new URLSearchParams({ fields: insightFields, level, time_increment: "1", time_range: JSON.stringify({ since: startDate, until: endDate }), limit: "500" });
  const rows = await fetchAll<any>(`act_${config.accountId}/insights?${params}`, config);
  return rows.map((row): MetaInsightRow => ({
    date: row.date_start,
    campaignId: String(row.campaign_id), campaignName: row.campaign_name || "Sem nome", campaignStatus: null, objective: null,
    adsetId: row.adset_id ? String(row.adset_id) : null, adsetName: row.adset_name || null, adsetStatus: null,
    adId: row.ad_id ? String(row.ad_id) : null, adName: row.ad_name || null, adStatus: null,
    impressions: numeric(row.impressions), reach: numeric(row.reach), clicks: numeric(row.clicks), inlineLinkClicks: numeric(row.inline_link_clicks), spend: numeric(row.spend), leads: getLeads(row.actions),
  }));
}

export async function fetchMetaAdsMetadata() {
  const config = getMetaAdsConfig();
  if (!config) throw new Error("Meta Ads is not configured");
  const [campaigns, adsets, ads] = await Promise.all([
    fetchAll<any>(`act_${config.accountId}/campaigns?fields=id,name,status,effective_status,objective&limit=500`, config),
    fetchAll<any>(`act_${config.accountId}/adsets?fields=id,name,status,effective_status,campaign_id&limit=500`, config),
    fetchAll<any>(`act_${config.accountId}/ads?fields=id,name,status,effective_status,campaign_id,adset_id,creative{id,name,thumbnail_url,image_url,title,body,call_to_action_type,link_url,video_id}&limit=500`, config),
  ]);
  return { campaigns, adsets, ads };
}
