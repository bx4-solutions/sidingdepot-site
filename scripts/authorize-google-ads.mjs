import { createServer } from "node:http";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const envPath = resolve(".env.local");
const envText = await readFile(envPath, "utf8");
const env = Object.fromEntries(envText.split(/\r?\n/).flatMap((line) => {
  const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
  return match ? [[match[1], match[2]]] : [];
}));
const clientFile = env.GOOGLE_ADS_OAUTH_CLIENT_FILE;
const redirectUri = env.GOOGLE_ADS_OAUTH_REDIRECT_URI;
if (!clientFile || !redirectUri) throw new Error("Missing local Google Ads OAuth configuration");
const file = JSON.parse(await readFile(clientFile, "utf8"));
const client = file.installed || file.web;
if (!client?.client_id || !client?.client_secret) throw new Error("Invalid Google OAuth client JSON");
const redirect = new URL(redirectUri);
const authorizationUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
authorizationUrl.search = new URLSearchParams({ client_id: client.client_id, redirect_uri: redirectUri, response_type: "code", scope: "https://www.googleapis.com/auth/adwords", access_type: "offline", prompt: "consent" }).toString();
console.log(authorizationUrl.toString());
const server = createServer(async (request, response) => {
  const requestUrl = new URL(request.url || "/", redirectUri);
  const code = requestUrl.searchParams.get("code");
  if (requestUrl.pathname !== redirect.pathname || !code) {
    response.writeHead(400).end("Authorization was not completed.");
    server.close();
    return;
  }
  try {
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ code, client_id: client.client_id, client_secret: client.client_secret, redirect_uri: redirectUri, grant_type: "authorization_code" }) });
    const token = await tokenResponse.json();
    if (!tokenResponse.ok || !token.refresh_token) throw new Error(token.error_description || "Google did not return a refresh token");
    const updated = envText.includes("GOOGLE_ADS_OAUTH_REFRESH_TOKEN=") ? envText.replace(/^GOOGLE_ADS_OAUTH_REFRESH_TOKEN=.*$/m, `GOOGLE_ADS_OAUTH_REFRESH_TOKEN=${token.refresh_token}`) : `${envText.trimEnd()}\nGOOGLE_ADS_OAUTH_REFRESH_TOKEN=${token.refresh_token}\n`;
    await writeFile(envPath, updated, { mode: 0o600 });
    response.writeHead(200, { "content-type": "text/html" }).end("<h1>Google Ads connected.</h1><p>You can close this tab.</p>");
    console.log("OAuth completed and stored locally.");
  } catch (error) {
    response.writeHead(500).end("OAuth could not be completed.");
    console.error(error instanceof Error ? error.message : error);
  } finally {
    server.close();
  }
});
server.listen(Number(redirect.port), "127.0.0.1", () => console.log("Waiting for Google authorization..."));
