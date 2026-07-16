import { readFile } from "node:fs/promises";

const env = Object.fromEntries((await readFile(".env.local", "utf8")).split(/\r?\n/).flatMap((line) => {
  const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
  return match ? [[match[1], match[2]]] : [];
}));
const oauth = JSON.parse(await readFile(env.GOOGLE_ADS_OAUTH_CLIENT_FILE, "utf8")).installed;
const refresh = await fetch("https://oauth2.googleapis.com/token", { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ client_id: oauth.client_id, client_secret: oauth.client_secret, refresh_token: env.GOOGLE_ADS_OAUTH_REFRESH_TOKEN, grant_type: "refresh_token" }) });
const token = await refresh.json();
if (!refresh.ok || !token.access_token) throw new Error("OAuth refresh failed");
const accessible = await fetch("https://googleads.googleapis.com/v24/customers:listAccessibleCustomers", { headers: { authorization: `Bearer ${token.access_token}`, "developer-token": env.GOOGLE_ADS_DEVELOPER_TOKEN } });
const accounts = await accessible.json();
if (!accessible.ok) throw new Error("Could not list accessible accounts");
const rows = await Promise.all((accounts.resourceNames || []).map(async (resourceName) => {
  const id = resourceName.split("/")[1];
  const response = await fetch(`https://googleads.googleapis.com/v24/customers/${id}/googleAds:searchStream`, { method: "POST", headers: { authorization: `Bearer ${token.access_token}`, "developer-token": env.GOOGLE_ADS_DEVELOPER_TOKEN, "content-type": "application/json" }, body: JSON.stringify({ query: "SELECT customer.id, customer.descriptive_name, customer.currency_code, customer.time_zone FROM customer LIMIT 1" }) });
  const data = await response.json();
  const row = data?.[0]?.results?.[0]?.customer;
  return row ? { id: String(row.id), name: row.descriptiveName || "Sem nome", currency: row.currencyCode, timeZone: row.timeZone } : null;
}));
console.log(JSON.stringify(rows.filter(Boolean), null, 2));
