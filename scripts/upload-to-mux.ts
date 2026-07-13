/**
 * Upload Before/After slideshow videos to Mux
 * Usage: bun scripts/upload-to-mux.ts
 *
 * Place your video files in: scripts/videos/
 * File naming convention: "SD TV BA 10.mp4" → auto-saved as siding / Marietta
 * After upload, edit city/service in Supabase dashboard if needed.
 */

import { createReadStream, readdirSync, statSync } from "fs";
import { join } from "path";

const MUX_TOKEN_ID = process.env.MUX_TOKEN_ID!;
const MUX_TOKEN_SECRET = process.env.MUX_TOKEN_SECRET!;
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL!;
const SUPABASE_KEY =
  process.env.SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY!;

const MUX_BASE = "https://api.mux.com";
const auth = Buffer.from(`${MUX_TOKEN_ID}:${MUX_TOKEN_SECRET}`).toString("base64");

// ── 1. Create a Mux direct-upload URL ────────────────────────────────────────
async function createMuxDirectUpload() {
  const res = await fetch(`${MUX_BASE}/video/v1/uploads`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      cors_origin: "https://www.sidingdepot.com",
      new_asset_settings: {
        playback_policy: ["public"],
      },
    }),
  });
  if (!res.ok) throw new Error(`Mux upload create failed: ${await res.text()}`);
  const { data } = (await res.json()) as any;
  return { uploadId: data.id as string, uploadUrl: data.url as string };
}

// ── 2. PUT the file to the Mux signed URL ────────────────────────────────────
async function uploadFileToMux(uploadUrl: string, filePath: string) {
  const file = createReadStream(filePath);
  const size = statSync(filePath).size;
  const res = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": "video/mp4",
      "Content-Length": String(size),
    },
    // @ts-ignore — Node fetch body stream
    body: file,
    duplex: "half",
  });
  if (!res.ok) throw new Error(`File upload failed: ${res.status} ${res.statusText}`);
}

// ── 3. Poll until Mux finishes processing ────────────────────────────────────
async function waitForAsset(
  uploadId: string,
  maxWait = 300_000,
): Promise<{ assetId: string; playbackId: string }> {
  const start = Date.now();
  while (Date.now() - start < maxWait) {
    await new Promise((r) => setTimeout(r, 5000));
    const res = await fetch(`${MUX_BASE}/video/v1/uploads/${uploadId}`, {
      headers: { Authorization: `Basic ${auth}` },
    });
    const { data } = (await res.json()) as any;
    if (data.status === "asset_created" && data.asset_id) {
      const assetRes = await fetch(`${MUX_BASE}/video/v1/assets/${data.asset_id}`, {
        headers: { Authorization: `Basic ${auth}` },
      });
      const { data: asset } = (await assetRes.json()) as any;
      const playbackId = asset.playback_ids?.[0]?.id as string | undefined;
      if (playbackId) return { assetId: data.asset_id as string, playbackId };
    }
    process.stdout.write(".");
  }
  throw new Error("Timeout waiting for Mux asset");
}

// ── 4. Save metadata to Supabase ─────────────────────────────────────────────
async function saveToSupabase(row: {
  title: string;
  city: string;
  service: string;
  mux_asset_id: string;
  mux_playback_id: string;
  thumbnail_url: string;
}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/projects`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify(row),
  });
  if (!res.ok) throw new Error(`Supabase insert failed: ${await res.text()}`);
}

// ── 5. Infer title from filename ──────────────────────────────────────────────
function inferMeta(filename: string) {
  const num = filename.match(/(\d+)/)?.[1] ?? "?";
  return {
    title: `Siding Transformation #${num} — Marietta`,
    city: "Marietta",
    service: "siding", // edit in Supabase if painting/windows/etc.
  };
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  const videosDir = join(import.meta.dir, "videos");

  let files: string[];
  try {
    files = readdirSync(videosDir).filter((f) => /\.(mp4|mov|avi|mkv)$/i.test(f));
  } catch {
    console.error("\n❌  Create folder  scripts/videos/  and drop your MP4 files there.\n");
    process.exit(1);
  }

  if (!files.length) {
    console.error("❌  No video files found in scripts/videos/");
    process.exit(1);
  }

  console.log(`\n🎬  Found ${files.length} video(s) — uploading to Mux...\n`);

  for (const file of files) {
    const filePath = join(videosDir, file);
    const meta = inferMeta(file);
    const sizeMB = (statSync(filePath).size / 1024 / 1024).toFixed(1);

    console.log(`📤  ${file}  (${sizeMB} MB)`);

    try {
      const { uploadId, uploadUrl } = await createMuxDirectUpload();
      await uploadFileToMux(uploadUrl, filePath);
      console.log(`    ✅  Uploaded — waiting for Mux to process`);

      process.stdout.write("    ⏳  Processing");
      const { assetId, playbackId } = await waitForAsset(uploadId);
      console.log(`\n    ✅  Asset: ${assetId}`);
      console.log(`    🔑  Playback ID: ${playbackId}`);

      const thumbnailUrl = `https://image.mux.com/${playbackId}/thumbnail.jpg?time=3`;

      await saveToSupabase({
        ...meta,
        mux_asset_id: assetId,
        mux_playback_id: playbackId,
        thumbnail_url: thumbnailUrl,
      });
      console.log(`    ✅  Saved to Supabase\n`);
    } catch (err) {
      console.error(`    ❌  ${(err as Error).message}\n`);
    }
  }

  console.log("🎉  Done! View assets at https://dashboard.mux.com");
  console.log("    Page live at https://www.sidingdepot.com/projects\n");
}

main();
