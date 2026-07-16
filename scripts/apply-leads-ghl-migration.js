import { readFileSync } from "node:fs";

const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!serviceRoleKey) throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured");
const supabaseUrl = process.env.SUPABASE_URL;
if (!supabaseUrl) throw new Error("SUPABASE_URL is not configured");

const query = readFileSync("supabase/migrations/20260713231510_repair_leads_ghl_attribution.sql", "utf8");
const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
  method: "POST",
  headers: { "Content-Type": "application/json", apikey: serviceRoleKey, Authorization: `Bearer ${serviceRoleKey}` },
  body: JSON.stringify({ query }),
});

if (!response.ok) throw new Error(`Migration failed (${response.status}): ${await response.text()}`);
console.log("Lead attribution and GHL schema migration applied.");
