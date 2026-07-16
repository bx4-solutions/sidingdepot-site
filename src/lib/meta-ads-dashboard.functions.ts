import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const Input = z.object({ startDate: z.string(), endDate: z.string() });
const number = (value: unknown) => Number(value || 0);

export const getMetaAdsDashboard = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => Input.parse(data))
  .handler(async ({ data, context }) => {
    const db = context.supabase as any;
    const [accountsResult, syncResult, campaignResult, adsetResult, adResult, creativesResult] = await Promise.all([
      db.from("meta_ads_accounts").select("account_id,display_name,currency_code,time_zone,last_synced_at").eq("is_active", true),
      db.from("meta_ads_sync_runs").select("status,error_message,completed_at").order("started_at", { ascending: false }).limit(1).maybeSingle(),
      db.from("meta_ads_campaign_metrics").select("campaign_id,campaign_name,campaign_status,objective,impressions,reach,clicks,inline_link_clicks,spend,leads").gte("metric_date", data.startDate).lte("metric_date", data.endDate),
      db.from("meta_ads_adset_metrics").select("adset_id,adset_name,adset_status,campaign_name,impressions,reach,clicks,inline_link_clicks,spend,leads").gte("metric_date", data.startDate).lte("metric_date", data.endDate),
      db.from("meta_ads_ad_metrics").select("ad_id,ad_name,ad_status,campaign_name,adset_name,creative_id,impressions,reach,clicks,inline_link_clicks,spend,leads").gte("metric_date", data.startDate).lte("metric_date", data.endDate),
      db.from("meta_ads_creatives").select("creative_id,ad_id,creative_name,thumbnail_url,image_url,title,body,call_to_action_type,link_url,video_id"),
    ]);
    for (const result of [accountsResult, campaignResult, adsetResult, adResult, creativesResult]) if (result.error) throw result.error;
    const sum = (rows: any[]) => rows.reduce((total, row) => ({
      impressions: total.impressions + number(row.impressions), reach: total.reach + number(row.reach), clicks: total.clicks + number(row.clicks), inlineLinkClicks: total.inlineLinkClicks + number(row.inline_link_clicks), spend: total.spend + number(row.spend), leads: total.leads + number(row.leads),
    }), { impressions: 0, reach: 0, clicks: 0, inlineLinkClicks: 0, spend: 0, leads: 0 });
    const aggregate = (rows: any[], id: string, fields: Record<string, string>) => Object.values(rows.reduce((grouped: Record<string, any>, row) => {
      const key = row[id];
      const current = grouped[key] || { id: key, ...Object.fromEntries(Object.entries(fields).map(([name, field]) => [name, row[field]])), impressions: 0, reach: 0, clicks: 0, inlineLinkClicks: 0, spend: 0, leads: 0 };
      const values = sum([row]);
      for (const [name, value] of Object.entries(values)) current[name] += value;
      grouped[key] = current;
      return grouped;
    }, {})) as any[];
    const campaigns = aggregate(campaignResult.data || [], "campaign_id", { name: "campaign_name", status: "campaign_status", objective: "objective" }).sort((a, b) => b.spend - a.spend);
    const adsets = aggregate(adsetResult.data || [], "adset_id", { name: "adset_name", status: "adset_status", campaignName: "campaign_name" }).sort((a, b) => b.spend - a.spend);
    const creativeByAdId = new Map((creativesResult.data || []).map((creative: any) => [creative.ad_id, creative]));
    const ads = aggregate(adResult.data || [], "ad_id", { name: "ad_name", status: "ad_status", campaignName: "campaign_name", adsetName: "adset_name", creativeId: "creative_id" }).map((ad: any) => ({ ...ad, creative: creativeByAdId.get(ad.id) || null }));
    const totals = sum(adResult.data || []);
    const averageCpl = totals.leads ? totals.spend / totals.leads : null;
    const averageCtr = totals.impressions ? (totals.inlineLinkClicks / totals.impressions) * 100 : 0;
    const evaluatedAds = ads.map((ad: any) => {
      const cpl = ad.leads ? ad.spend / ad.leads : null;
      const ctr = ad.impressions ? (ad.inlineLinkClicks / ad.impressions) * 100 : 0;
      const frequency = ad.reach ? ad.impressions / ad.reach : 0;
      const qualified = ad.leads >= 2 && ad.spend >= 50;
      const decision = qualified && averageCpl && cpl! <= averageCpl * 0.8 && ctr >= averageCtr ? "VENCEDOR" : ad.spend >= Math.max(50, averageCpl || 50) && (!ad.leads || (averageCpl && cpl! > averageCpl * 1.5)) ? "DESPERDÍCIO" : qualified && averageCpl && cpl! <= averageCpl ? "PROMISSOR" : "EM OBSERVAÇÃO";
      return { ...ad, cpl, ctr, frequency, decision };
    }).sort((a: any, b: any) => a.decision === "VENCEDOR" ? -1 : b.decision === "VENCEDOR" ? 1 : b.spend - a.spend);
    const winner = evaluatedAds.find((ad: any) => ad.decision === "VENCEDOR") || null;
    const waste = evaluatedAds.filter((ad: any) => ad.decision === "DESPERDÍCIO").reduce((total: number, ad: any) => total + ad.spend, 0);
    return { configured: (accountsResult.data || []).length > 0, accounts: accountsResult.data || [], lastSync: syncResult.data || null, totals: { ...totals, ctr: averageCtr, cpl: averageCpl, cpc: totals.inlineLinkClicks ? totals.spend / totals.inlineLinkClicks : null, cpm: totals.impressions ? (totals.spend / totals.impressions) * 1000 : null, waste }, campaigns, adsets, ads: evaluatedAds, winner, criteria: { minLeads: 2, minSpend: 50, winnerCplVsAverage: 0.8, wasteCplVsAverage: 1.5 } };
  });
