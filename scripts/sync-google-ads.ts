import { createClient } from "@supabase/supabase-js";

const cleanId = (value: string) => value.replace(/\D/g, "");
const clientFile = process.env.GOOGLE_ADS_OAUTH_CLIENT_FILE;
const client = clientFile
  ? ((await Bun.file(clientFile).json()) as { installed?: { client_id?: string; client_secret?: string } }).installed
  : undefined;
const developerToken = process.env.GOOGLE_ADS_DEVELOPER_TOKEN;
const clientId = process.env.GOOGLE_ADS_OAUTH_CLIENT_ID || client?.client_id;
const clientSecret = process.env.GOOGLE_ADS_OAUTH_CLIENT_SECRET || client?.client_secret;
const refreshToken = process.env.GOOGLE_ADS_OAUTH_REFRESH_TOKEN;
const readCustomerIds = (process.env.GOOGLE_ADS_READ_CUSTOMER_IDS || process.env.GOOGLE_ADS_CUSTOMER_ID || "")
  .split(",")
  .map(cleanId)
  .filter(Boolean);
const operationalCustomerId = cleanId(
  process.env.GOOGLE_ADS_OPERATIONAL_CUSTOMER_ID || process.env.GOOGLE_ADS_CUSTOMER_ID || "",
);
const loginCustomerId = process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID
  ? cleanId(process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID)
  : undefined;
const apiVersion = process.env.GOOGLE_ADS_API_VERSION || "v24";
const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

if (!developerToken || !clientId || !clientSecret || !refreshToken || !readCustomerIds.length || !operationalCustomerId) {
  throw new Error("Google Ads is not configured.");
}
if (!url || !serviceRoleKey) throw new Error("Supabase is not configured.");

const admin = createClient(url, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});
const end = new Date();
const start = new Date(end);
start.setDate(end.getDate() - 30);
const toDay = (date: Date) => date.toISOString().slice(0, 10);
const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
  method: "POST",
  headers: { "content-type": "application/x-www-form-urlencoded" },
  body: new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: refreshToken,
    grant_type: "refresh_token",
  }),
});
if (!tokenResponse.ok) throw new Error(`Google OAuth failed (${tokenResponse.status}).`);
const { access_token: accessToken } = (await tokenResponse.json()) as { access_token?: string };
if (!accessToken) throw new Error("Google OAuth did not return an access token.");

let synced = 0;

for (const customerId of readCustomerIds) {
  const query = `SELECT segments.date, campaign.id, campaign.name, campaign.status, campaign.advertising_channel_type, metrics.impressions, metrics.clicks, metrics.cost_micros, metrics.conversions, metrics.conversions_value FROM campaign WHERE segments.date BETWEEN '${toDay(start)}' AND '${toDay(end)}'`;
  const response = await fetch(
    `https://googleads.googleapis.com/${apiVersion}/customers/${customerId}/googleAds:searchStream`,
    {
      method: "POST",
      headers: {
        authorization: `Bearer ${accessToken}`,
        "developer-token": developerToken,
        ...(loginCustomerId ? { "login-customer-id": loginCustomerId } : {}),
        "content-type": "application/json",
      },
      body: JSON.stringify({ query }),
    },
  );
  if (!response.ok) throw new Error(`Google Ads query failed (${response.status}).`);
  const batches = (await response.json()) as Array<{ results?: any[] }>;
  const rows = batches.flatMap((batch) => batch.results || []).map((row) => ({
    date: row.segments?.date,
    campaignId: String(row.campaign?.id),
    campaignName: row.campaign?.name || "Sem nome",
    campaignStatus: row.campaign?.status || "UNKNOWN",
    channelType: row.campaign?.advertisingChannelType || null,
    impressions: Number(row.metrics?.impressions || 0),
    clicks: Number(row.metrics?.clicks || 0),
    costMicros: Number(row.metrics?.costMicros || 0),
    conversions: Number(row.metrics?.conversions || 0),
    conversionValue: Number(row.metrics?.conversionsValue || 0),
  }));
  const account = {
    customer_id: customerId,
    display_name:
      customerId === operationalCustomerId
        ? "Siding Depot (2025 · operacional)"
        : "Siding Depot (2023 · histórico)",
    last_synced_at: new Date().toISOString(),
  };

  const { error: accountError } = await admin.from("google_ads_accounts").upsert(account);
  if (accountError) throw accountError;

  const campaigns = rows.map((row) => ({
    customer_id: customerId,
    metric_date: row.date,
    campaign_id: row.campaignId,
    campaign_name: row.campaignName,
    campaign_status: row.campaignStatus,
    campaign_channel_type: row.channelType,
    impressions: row.impressions,
    clicks: row.clicks,
    cost_micros: row.costMicros,
    conversions: row.conversions,
    conversion_value: row.conversionValue,
  }));

  if (campaigns.length) {
    const { error } = await admin.from("google_ads_campaign_metrics").upsert(campaigns);
    if (error) throw error;
  }

  synced += campaigns.length;
}

const { error: runError } = await admin.from("google_ads_sync_runs").insert({
  customer_id: operationalCustomerId,
  status: "success",
  records_synced: synced,
  completed_at: new Date().toISOString(),
});
if (runError) throw runError;

console.log(JSON.stringify({ synced, accounts: readCustomerIds.length }));
