import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const admin = createClient(supabaseUrl, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    let body: Record<string, any> = {};
    try {
      const text = await req.text();
      if (req.headers.get("content-type")?.includes("application/json")) {
        body = JSON.parse(text);
      } else {
        const params = new URLSearchParams(text);
        params.forEach((v, k) => {
          body[k] = v;
        });
      }
    } catch {
      // ignore parse errors
    }

    // Extract common GHL field names (vary by form version)
    const firstName = body.first_name || body.firstName || "";
    const lastName = body.last_name || body.lastName || "";
    const name =
      body.full_name ||
      body.name ||
      body.contact_name ||
      (firstName || lastName ? `${firstName} ${lastName}`.trim() : null);

    const email = body.email || body.email_address || body.contact_email || null;
    const phone = body.phone || body.phone_number || body.contact_phone || null;
    const page_url = body.page_url || body.source_page || body.form_page || body.referrer || null;
    const message = body.message || body.notes || body.comment || null;
    const company = body.company || body.company_name || null;
    const utm_source = body.utm_source || null;
    const utm_medium = body.utm_medium || null;
    const utm_campaign = body.utm_campaign || null;

    const { error } = await admin.from("leads").insert({
      name: name || null,
      email: email || null,
      phone: phone || null,
      company: company || null,
      source: "ghl-chat-widget",
      page_url: page_url || null,
      message: message || null,
      utm_source,
      utm_medium,
      utm_campaign,
      status: "new",
      metadata: body,
    });

    if (error) {
      console.error("[GHL Webhook] Insert error:", error);
      return new Response(JSON.stringify({ ok: false, error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Notify admin dashboard in real-time
    await admin.from("notifications").insert({
      type: "new_lead",
      title: "Novo lead recebido!",
      message: `${name || email || phone || "Lead anônimo"} via GHL Chat Widget`,
      severity: "info",
      data: { name, email, phone, page_url },
    });

    console.log("[GHL Webhook] Lead stored:", { name, email, phone });
    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[GHL Webhook] Unexpected error:", err);
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
