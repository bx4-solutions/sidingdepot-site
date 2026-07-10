// TanStack Start server functions for the site→GHL integration.
//
// These replace the non-routable Nitro `server/api/*.post.ts` handlers: in this
// TanStack Start build the `server/api/` convention is NOT scanned, so those
// endpoints 404'd and no lead ever reached GHL. `createServerFn` is the pattern
// this app actually bundles/serves (same as google-reviews.functions.ts), so
// the GHL API key stays server-side and the calls actually run in production.
import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { upsertContact, createOpportunity, isGhlConfigured } from "./ghl-client.server";
import { toCustomFieldValues, type AttributionData } from "./ghl-attribution-fields";

type LeadSubmitInput = {
  name?: string;
  phone?: string;
  email?: string | null;
  city?: string | null;
  services?: string[];
  details?: string | null;
  source?: string | null;
  tag?: string | null;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  utm_content?: string | null;
  utm_term?: string | null;
  gclid?: string | null;
  fbclid?: string | null;
  source_platform?: string | null;
  landing_page?: string | null;
  page_url?: string | null;
  referrer?: string | null;
  visitor_id?: string | null;
  device_type?: string | null;
  browser?: string | null;
  os?: string | null;
};

function toAttribution(data: LeadSubmitInput): AttributionData {
  return {
    utm_source: data.utm_source ?? undefined,
    utm_medium: data.utm_medium ?? undefined,
    utm_campaign: data.utm_campaign ?? undefined,
    utm_content: data.utm_content ?? undefined,
    utm_term: data.utm_term ?? undefined,
    gclid: data.gclid ?? undefined,
    fbclid: data.fbclid ?? undefined,
    source_platform: data.source_platform ?? undefined,
    landing_page: data.landing_page ?? undefined,
    page_url: data.page_url ?? undefined,
    referrer: data.referrer ?? undefined,
    visitorId: data.visitor_id ?? undefined,
    device_type: data.device_type ?? undefined,
    browser: data.browser ?? undefined,
    os: data.os ?? undefined,
  };
}

/**
 * Standard site lead-form → GHL. Upserts the contact with the full attribution
 * snapshot as custom fields, then creates an opportunity in the configured
 * pipeline. Called from src/lib/leads.ts. Degrades to `{ ghl: false }` (never
 * throws) so the user's submission still succeeds even if GHL is down/unset.
 */
export const submitLeadToGhl = createServerFn({ method: "POST" })
  .inputValidator((data: LeadSubmitInput) => data)
  .handler(async ({ data }) => {
    if (!isGhlConfigured()) return { ok: true, ghl: false as const };

    const name = (data.name || "").trim();
    const [firstName, ...rest] = name.split(" ");
    const lastName = rest.join(" ");

    const contact = await upsertContact({
      firstName: firstName || "Website",
      lastName,
      email: data.email || undefined,
      phone: data.phone || "",
      city: data.city || undefined,
      tags: [data.tag, data.source].filter(Boolean) as string[],
      source: data.source || "website",
      customFieldValues: toCustomFieldValues(toAttribution(data)),
    });

    if (!contact) return { ok: true, ghl: false as const };

    const opportunity = await createOpportunity({
      contactId: contact.id,
      name: `${name || "Website Lead"} — ${data.services?.join(", ") || data.tag || "General Inquiry"}`,
      source: data.source || "website",
    });

    return {
      ok: true,
      ghl: true as const,
      ghl_contact_id: contact.id,
      ghl_opportunity_id: opportunity?.id || null,
    };
  });

/**
 * GHL Chat Widget bridge. The floating widget creates the contact in GHL on its
 * own; this enriches that contact with the site's full attribution snapshot and
 * mirrors the lead into Supabase `leads` for the dashboard. Called from
 * GhlChatWidget.tsx. Uses the service-role key (server-side only) for the insert.
 */
export const enrichGhlFromWidget = createServerFn({ method: "POST" })
  .inputValidator((data: Record<string, any>) => data)
  .handler(async ({ data }) => {
    const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "";
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
    if (!supabaseUrl || !serviceKey) {
      console.error("[GHL Widget] Missing Supabase env vars.");
      return { ok: false, error: "server misconfiguration" };
    }

    const admin = createClient(supabaseUrl, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const firstName = data.first_name || data.firstName || "";
    const lastName = data.last_name || data.lastName || "";
    const name =
      data.full_name ||
      data.name ||
      data.contact_name ||
      (firstName || lastName ? `${firstName} ${lastName}`.trim() : null);

    const email = data.email || data.email_address || data.contact_email || null;
    const phone = data.phone || data.phone_number || data.contact_phone || null;
    const page_url = data.page_url || data.source_page || data.form_page || null;
    const message = data.message || data.notes || data.comment || null;

    const attribution: AttributionData = {
      utm_source: data.utm_source,
      utm_medium: data.utm_medium,
      utm_campaign: data.utm_campaign,
      utm_content: data.utm_content,
      utm_term: data.utm_term,
      gclid: data.gclid,
      fbclid: data.fbclid,
      landing_page: data.landing_page,
      page_url,
      referrer: data.referrer,
      visitorId: data.visitor_id,
      device_type: data.device_type,
      browser: data.browser,
      os: data.os,
    };

    const { data: inserted, error } = await admin
      .from("leads")
      .insert({
        name: name || null,
        email: email || null,
        phone: phone || null,
        source: "ghl-chat-widget",
        page_url: page_url || null,
        message: message || null,
        utm_source: data.utm_source || null,
        utm_medium: data.utm_medium || null,
        utm_campaign: data.utm_campaign || null,
        utm_content: data.utm_content || null,
        utm_term: data.utm_term || null,
        gclid: data.gclid || null,
        fbclid: data.fbclid || null,
        landing_page: data.landing_page || null,
        referrer: data.referrer || null,
        visitor_id: data.visitor_id || null,
        device_type: data.device_type || null,
        browser: data.browser || null,
        os: data.os || null,
        metadata: data,
      })
      .select("id")
      .single();

    if (error) {
      console.error("[GHL Widget] Insert error:", error);
      return { ok: false, error: error.message };
    }

    if (isGhlConfigured() && phone) {
      const contact = await upsertContact({
        firstName: firstName || (name ? name.split(" ")[0] : "Website"),
        lastName: lastName || (name ? name.split(" ").slice(1).join(" ") : ""),
        email: email || undefined,
        phone,
        tags: ["ghl-chat-widget"],
        source: "ghl-chat-widget",
        customFieldValues: toCustomFieldValues(attribution),
      });

      if (contact && inserted?.id) {
        await admin
          .from("leads")
          .update({ ghl_contact_id: contact.id, ghl_synced_at: new Date().toISOString() })
          .eq("id", inserted.id);
      }
    }

    return { ok: true };
  });
