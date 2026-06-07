import { createClient } from "@supabase/supabase-js";

/**
 * GHL (GoHighLevel) Webhook endpoint
 * Configure this URL in GHL: POST /api/ghl-webhook
 *
 * GHL sends form submissions here — we store them in Supabase `leads` table
 * and they appear in the SEO Dashboard → Leads Real-time view.
 */
export default defineEventHandler(async (event) => {
  // Support both JSON and form-encoded bodies
  let body: Record<string, any> = {};
  try {
    body = await readBody(event);
  } catch {
    // ignore parse errors
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "";
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

  if (!supabaseUrl || !serviceKey) {
    console.error("[GHL Webhook] Missing Supabase env vars. Body:", body);
    return { ok: false, error: "server misconfiguration" };
  }

  const admin = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // Extract common GHL fields (field names vary by form)
  const firstName = body.first_name || body.firstName || "";
  const lastName = body.last_name || body.lastName || "";
  const name =
    body.full_name ||
    body.name ||
    body.contact_name ||
    (firstName || lastName ? `${firstName} ${lastName}`.trim() : null);

  const email =
    body.email ||
    body.email_address ||
    body.contact_email ||
    null;

  const phone =
    body.phone ||
    body.phone_number ||
    body.contact_phone ||
    null;

  const page_url =
    body.page_url ||
    body.source_page ||
    body.form_page ||
    body.referrer ||
    null;

  const message =
    body.message ||
    body.notes ||
    body.comment ||
    null;

  const { error } = await admin.from("leads").insert({
    name: name || null,
    email: email || null,
    phone: phone || null,
    source: "ghl-chat-widget",
    page_url: page_url || null,
    message: message || null,
    metadata: body,
  });

  if (error) {
    console.error("[GHL Webhook] Insert error:", error);
    return { ok: false, error: error.message };
  }

  console.log("[GHL Webhook] Lead stored:", { name, email, phone });
  return { ok: true };
});
