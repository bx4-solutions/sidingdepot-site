import { readFileSync } from "node:fs";

const credentialSource = readFileSync("scripts/apply-cea-migration.js", "utf8");
const serviceRoleKey = credentialSource.match(/const SERVICE_ROLE_KEY = '([^']+)'/)?.[1];
if (!serviceRoleKey) throw new Error("Supabase service role key unavailable");
const supabaseUrl = process.env.SUPABASE_URL;
if (!supabaseUrl) throw new Error("SUPABASE_URL is not configured");

const query = readFileSync("supabase/migrations/20260712090000_google_ads_read_model.sql", "utf8");
const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
  },
  body: JSON.stringify({ query }),
});

if (!response.ok) throw new Error(`Migration failed (${response.status}): ${await response.text()}`);
console.log("Google Ads read model migration applied.");
