import { readFile } from "node:fs/promises";

const env = Object.fromEntries((await readFile(".env.local", "utf8")).split(/\r?\n/).flatMap((line) => {
  const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
  return match ? [[match[1], match[2]]] : [];
}));
const oauthFile = JSON.parse(await readFile(env.GOOGLE_ADS_OAUTH_CLIENT_FILE, "utf8"));
const oauthClient = oauthFile.installed || oauthFile.web;
const tokenResponse = await fetch("https://oauth2.googleapis.com/token", { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ client_id: oauthClient.client_id, client_secret: oauthClient.client_secret, refresh_token: env.GOOGLE_ADS_OAUTH_REFRESH_TOKEN, grant_type: "refresh_token" }) });
const token = await tokenResponse.json();
if (!tokenResponse.ok || !token.access_token) throw new Error("Unable to refresh Google OAuth token");
const response = await fetch(`https://googleads.googleapis.com/v24/customers/${env.GOOGLE_ADS_CUSTOMER_ID}/googleAds:searchStream`, {
  method: "POST",
  headers: { authorization: `Bearer ${token.access_token}`, "developer-token": env.GOOGLE_ADS_DEVELOPER_TOKEN, "content-type": "application/json" },
  body: JSON.stringify({ query: "SELECT campaign.name, campaign.status, metrics.impressions, metrics.clicks, metrics.cost_micros, metrics.conversions FROM campaign WHERE segments.date DURING LAST_30_DAYS" }),
});
const body = await response.json();
if (!response.ok) throw new Error(JSON.stringify({ status: response.status, body }));
const campaigns = body.flatMap((batch) => batch.results || []).map((row) => ({ name: row.campaign?.name, status: row.campaign?.status, impressions: Number(row.metrics?.impressions || 0), clicks: Number(row.metrics?.clicks || 0), cost: Number(row.metrics?.costMicros || 0) / 1_000_000, conversions: Number(row.metrics?.conversions || 0) }));
console.log(JSON.stringify({ customerId: env.GOOGLE_ADS_CUSTOMER_ID, campaigns }, null, 2));
