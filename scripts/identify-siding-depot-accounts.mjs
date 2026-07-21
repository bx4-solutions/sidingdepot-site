import { readFile } from "node:fs/promises";

const env = Object.fromEntries((await readFile(".env.local", "utf8")).split(/\r?\n/).flatMap((line) => {
  const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
  return match ? [[match[1], match[2]]] : [];
}));
const oauth = JSON.parse(await readFile(env.GOOGLE_ADS_OAUTH_CLIENT_FILE, "utf8")).installed;
const refresh = await fetch("https://oauth2.googleapis.com/token", { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ client_id: oauth.client_id, client_secret: oauth.client_secret, refresh_token: env.GOOGLE_ADS_OAUTH_REFRESH_TOKEN, grant_type: "refresh_token" }) });
const token = await refresh.json();
if (!refresh.ok || !token.access_token) throw new Error("OAuth refresh failed");
const ids = ["5077395707", "3984854749"];
const result = await Promise.all(ids.map(async (id) => {
  const response = await fetch(`https://googleads.googleapis.com/v24/customers/${id}/googleAds:searchStream`, { method: "POST", headers: { authorization: `Bearer ${token.access_token}`, "developer-token": env.GOOGLE_ADS_DEVELOPER_TOKEN, "content-type": "application/json" }, body: JSON.stringify({ query: "SELECT campaign.name, campaign.start_date, campaign.status FROM campaign ORDER BY campaign.start_date ASC LIMIT 3" }) });
  const body = await response.json();
  if (!response.ok) return { id, error: body?.[0]?.error?.message || "query failed" };
  return { id, earliestCampaigns: body.flatMap((batch) => batch.results || []).map((row) => ({ name: row.campaign?.name, startDate: row.campaign?.startDate, status: row.campaign?.status })) };
}));
console.log(JSON.stringify(result, null, 2));
