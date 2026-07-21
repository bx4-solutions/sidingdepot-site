import "server-only";
import { readFileSync } from "node:fs";

type GoogleAdsConfig = {
  developerToken: string;
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  loginCustomerId: string | null;
  customerId: string;
  readCustomerIds: string[];
  operationalCustomerId: string;
  apiVersion: string;
};

const cleanId = (value: string) => value.replace(/\D/g, "");

export function getGoogleAdsConfig(): GoogleAdsConfig | null {
  const localClientFile = process.env.GOOGLE_ADS_OAUTH_CLIENT_FILE;
  let localClient: { client_id?: string; client_secret?: string } | null = null;
  if (localClientFile) {
    try {
      const parsed = JSON.parse(readFileSync(localClientFile, "utf8"));
      localClient = parsed.installed || parsed.web || null;
    } catch {
      localClient = null;
    }
  }
  const developerToken = process.env.GOOGLE_ADS_DEVELOPER_TOKEN;
  const clientId = process.env.GOOGLE_ADS_OAUTH_CLIENT_ID || localClient?.client_id;
  const clientSecret = process.env.GOOGLE_ADS_OAUTH_CLIENT_SECRET || localClient?.client_secret;
  const refreshToken = process.env.GOOGLE_ADS_OAUTH_REFRESH_TOKEN;
  const loginCustomerId = process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID;
  const customerId = process.env.GOOGLE_ADS_CUSTOMER_ID;
  if (!developerToken || !clientId || !clientSecret || !refreshToken || !customerId) {
    return null;
  }
  return {
    developerToken,
    clientId,
    clientSecret,
    refreshToken,
    loginCustomerId: loginCustomerId ? cleanId(loginCustomerId) : null,
    customerId: cleanId(customerId),
    readCustomerIds: (process.env.GOOGLE_ADS_READ_CUSTOMER_IDS || customerId)
      .split(",")
      .map(cleanId)
      .filter(Boolean),
    operationalCustomerId: cleanId(process.env.GOOGLE_ADS_OPERATIONAL_CUSTOMER_ID || customerId),
    apiVersion: process.env.GOOGLE_ADS_API_VERSION || "v24",
  };
}

async function getAccessToken(config: GoogleAdsConfig) {
  const body = new URLSearchParams({
    client_id: config.clientId,
    client_secret: config.clientSecret,
    refresh_token: config.refreshToken,
    grant_type: "refresh_token",
  });
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!response.ok) throw new Error(`Google OAuth refresh failed (${response.status})`);
  const payload = (await response.json()) as { access_token?: string };
  if (!payload.access_token) throw new Error("Google OAuth refresh returned no access token");
  return payload.access_token;
}

export type GoogleAdsCampaignRow = {
  date: string;
  campaignId: string;
  campaignName: string;
  campaignStatus: string;
  channelType: string | null;
  impressions: number;
  clicks: number;
  costMicros: number;
  conversions: number;
  conversionValue: number;
};

export async function fetchGoogleAdsCampaignMetrics(startDate: string, endDate: string, customerId?: string) {
  const config = getGoogleAdsConfig();
  if (!config) throw new Error("Google Ads is not configured");
  const targetCustomerId = cleanId(customerId || config.customerId);
  const accessToken = await getAccessToken(config);
  const query = `SELECT segments.date, campaign.id, campaign.name, campaign.status, campaign.advertising_channel_type, metrics.impressions, metrics.clicks, metrics.cost_micros, metrics.conversions, metrics.conversions_value FROM campaign WHERE segments.date BETWEEN '${startDate}' AND '${endDate}'`;
  const response = await fetch(
    `https://googleads.googleapis.com/${config.apiVersion}/customers/${targetCustomerId}/googleAds:searchStream`,
    {
      method: "POST",
      headers: {
        authorization: `Bearer ${accessToken}`,
        "developer-token": config.developerToken,
        ...(config.loginCustomerId ? { "login-customer-id": config.loginCustomerId } : {}),
        "content-type": "application/json",
      },
      body: JSON.stringify({ query }),
    },
  );
  if (!response.ok) throw new Error(`Google Ads query failed (${response.status}): ${await response.text()}`);
  const batches = (await response.json()) as Array<{ results?: any[] }>;
  return batches.flatMap((batch) => batch.results || []).map((row): GoogleAdsCampaignRow => ({
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
}
