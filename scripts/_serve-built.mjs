// TEMP local server for the PRODUCTION build (.vercel/output) — used because
// `vite dev` hangs on this project. Serves static assets + real SSR handler.
// Run: node scripts/_serve-built.mjs   (delete before committing)
import http from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { Readable } from "node:stream";

const ROOT = fileURLToPath(new URL("../.vercel/output/", import.meta.url));
const STATIC = join(ROOT, "static");
const HANDLER = join(ROOT, "functions/__server.func/index.mjs");
const PORT = Number(process.env.PORT) || 4321;

const MIME = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".mjs": "text/javascript",
  ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml",
  ".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
  ".ico": "image/x-icon", ".woff2": "font/woff2", ".woff": "font/woff", ".txt": "text/plain",
  ".xml": "application/xml", ".mp4": "video/mp4", ".webm": "video/webm",
};

const mod = await import(pathToFileURL(HANDLER).href);
const app = mod.default; // { fetch(request, context) }

async function tryStatic(pathname) {
  if (pathname === "/") return null;
  const safe = normalize(pathname).replace(/^(\.\.[/\\])+/, "");
  const filePath = join(STATIC, safe);
  if (!filePath.startsWith(STATIC)) return null;
  try {
    const s = await stat(filePath);
    if (!s.isFile()) return null;
    const body = await readFile(filePath);
    return { body, type: MIME[extname(filePath)] || "application/octet-stream" };
  } catch {
    return null;
  }
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://localhost:${PORT}`);
    const asset = await tryStatic(url.pathname);
    if (asset) {
      res.writeHead(200, { "content-type": asset.type, "cache-control": "public, max-age=3600" });
      res.end(asset.body);
      return;
    }
    // SSR
    const request = new Request(url.href, {
      method: req.method,
      headers: req.headers,
      body: req.method === "GET" || req.method === "HEAD" ? undefined : Readable.toWeb(req),
      duplex: "half",
    });
    const response = await app.fetch(request, { waitUntil() {} });
    const headers = {};
    response.headers.forEach((v, k) => (headers[k] = v));
    res.writeHead(response.status, headers);
    const buf = Buffer.from(await response.arrayBuffer());
    res.end(buf);
  } catch (err) {
    console.error("[serve] error:", err);
    res.writeHead(500, { "content-type": "text/plain" });
    res.end("Server error: " + (err?.message || err));
  }
});

server.listen(PORT, () => {
  console.log(`\n✅ Built site served at:  http://localhost:${PORT}\n`);
});
