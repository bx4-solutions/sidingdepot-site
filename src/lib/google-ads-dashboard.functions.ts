import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const Input = z.object({
  startDate: z.string(),
  endDate: z.string(),
  customerId: z.string().regex(/^\d{10}$/).optional(),
});

export const getGoogleAdsDashboard = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => Input.parse(data))
  .handler(async ({ data, context }) => {
    const db = context.supabase as any;
    const [accountsResult, syncResult] = await Promise.all([
      db.from("google_ads_accounts").select("customer_id,display_name,currency_code,last_synced_at").eq("is_active", true),
      db.from("google_ads_sync_runs").select("status,error_message,completed_at").order("started_at", { ascending: false }).limit(1).maybeSingle(),
    ]);
    if (accountsResult.error) throw accountsResult.error;
    const activeAccountIds = new Set((accountsResult.data || []).map((account: any) => account.customer_id));
    if (data.customerId && !activeAccountIds.has(data.customerId)) throw new Error("Conta do Google Ads indisponível.");
    const campaignsQuery = db.from("google_ads_campaign_metrics")
      .select("metric_date,campaign_id,campaign_name,campaign_status,campaign_channel_type,impressions,clicks,cost_micros,conversions,conversion_value")
      .gte("metric_date", data.startDate)
      .lte("metric_date", data.endDate);
    const campaignsResult = data.customerId
      ? await campaignsQuery.eq("customer_id", data.customerId)
      : { data: [], error: null };
    if (campaignsResult.error) throw campaignsResult.error;
    const rows = campaignsResult.data || [];
    const totals = rows.reduce((sum: any, row: any) => ({
      impressions: sum.impressions + Number(row.impressions || 0), clicks: sum.clicks + Number(row.clicks || 0),
      costMicros: sum.costMicros + Number(row.cost_micros || 0), conversions: sum.conversions + Number(row.conversions || 0),
      conversionValue: sum.conversionValue + Number(row.conversion_value || 0),
    }), { impressions: 0, clicks: 0, costMicros: 0, conversions: 0, conversionValue: 0 });
    const campaigns = Object.values(rows.reduce((byCampaign: Record<string, any>, row: any) => {
      const current = byCampaign[row.campaign_id] || { id: row.campaign_id, name: row.campaign_name, status: row.campaign_status, channel: row.campaign_channel_type, impressions: 0, clicks: 0, costMicros: 0, conversions: 0 };
      current.impressions += Number(row.impressions || 0); current.clicks += Number(row.clicks || 0); current.costMicros += Number(row.cost_micros || 0); current.conversions += Number(row.conversions || 0); byCampaign[row.campaign_id] = current; return byCampaign;
    }, {})).sort((a: any, b: any) => b.costMicros - a.costMicros);
    return {
      configured: (accountsResult.data || []).length > 0,
      accounts: accountsResult.data || [],
      selectedCustomerId: data.customerId || null,
      defaultCustomerId: process.env.GOOGLE_ADS_OPERATIONAL_CUSTOMER_ID || null,
      totals,
      campaigns,
      lastSync: syncResult.data || null,
    };
  });
