import { readFile } from "node:fs/promises";

const envText = await readFile(".env.local", "utf8");
const env = Object.fromEntries(envText.split(/\r?\n/).flatMap((line) => {
  const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
  return match ? [[match[1], match[2]]] : [];
}));
const oauthFile = JSON.parse(await readFile(env.GOOGLE_ADS_OAUTH_CLIENT_FILE, "utf8"));
const oauthClient = oauthFile.installed || oauthFile.web;
const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
  method: "POST",
  headers: { "content-type": "application/x-www-form-urlencoded" },
  body: new URLSearchParams({ client_id: oauthClient.client_id, client_secret: oauthClient.client_secret, refresh_token: env.GOOGLE_ADS_OAUTH_REFRESH_TOKEN, grant_type: "refresh_token" }),
});
const token = await tokenResponse.json();
if (!tokenResponse.ok || !token.access_token) throw new Error(`OAuth refresh failed: ${token.error || token.error_description || tokenResponse.status}`);
const response = await fetch(`https://googleads.googleapis.com/v24/customers:listAccessibleCustomers`, {
  headers: { authorization: `Bearer ${token.access_token}`, "developer-token": env.GOOGLE_ADS_DEVELOPER_TOKEN, "login-customer-id": env.GOOGLE_ADS_LOGIN_CUSTOMER_ID },
});
const data = await response.json();
if (!response.ok) throw new Error(`Google Ads access failed: ${data.error?.message || response.status}`);
console.log(JSON.stringify({ connected: true, resourceNames: data.resourceNames || [] }));
