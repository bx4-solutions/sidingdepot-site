import { createServer } from "node:http";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const envPath = resolve(".env.local");
const page = `<!doctype html><html><body style="font-family:system-ui;max-width:560px;margin:72px auto"><h1>Google Ads: token de desenvolvedor</h1><p>Cole o token do API Center. Ele ficará apenas neste computador.</p><form method="post"><input name="token" type="password" autocomplete="off" style="width:100%;padding:12px;box-sizing:border-box" autofocus required><button style="margin-top:16px;padding:10px 16px">Salvar e conectar</button></form></body></html>`;
const server = createServer(async (request, response) => {
  if (request.method !== "POST") {
    response.writeHead(200, { "content-type": "text/html" }).end(page);
    return;
  }
  const body = await new Promise((resolveBody) => { let value = ""; request.on("data", (chunk) => value += chunk); request.on("end", () => resolveBody(value)); });
  const token = new URLSearchParams(String(body)).get("token")?.trim() || "";
  if (!/^[A-Za-z0-9_-]{20,40}$/.test(token)) {
    response.writeHead(400, { "content-type": "text/html" }).end("<h1>Token inválido.</h1><p>Volte e tente novamente.</p>");
    return;
  }
  const env = await readFile(envPath, "utf8");
  const next = env.replace(/^GOOGLE_ADS_DEVELOPER_TOKEN=.*$/m, `GOOGLE_ADS_DEVELOPER_TOKEN=${token}`);
  await writeFile(envPath, next, { mode: 0o600 });
  response.writeHead(200, { "content-type": "text/html" }).end("<h1>Token salvo.</h1><p>Você pode fechar esta aba.</p>");
  console.log("Developer token stored locally.");
  server.close();
});
server.listen(53683, "127.0.0.1", () => console.log("Open http://127.0.0.1:53683"));
