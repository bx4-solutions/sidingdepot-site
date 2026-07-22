// TanStack Start server functions for the site→GHL integration.
//
// These replace the non-routable Nitro `server/api/*.post.ts` handlers: in this
// TanStack Start build the `server/api/` convention is NOT scanned, so those
// endpoints 404'd and no lead ever reached GHL. `createServerFn` is the pattern
// this app actually bundles/serves (same as google-reviews.functions.ts), so
// the GHL API key stays server-side and the calls actually run in production.
import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import {
  upsertContact,
  createOpportunity,
  createWebsiteLeadConversation,
  isGhlConfigured,
} from "./ghl-client.server";
import { toCustomFieldValues, type AttributionData } from "./ghl-attribution-fields";
import { CITY_LPS } from "@/data/city-lp-content";

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
  gbraid?: string | null;
  wbraid?: string | null;
  fbclid?: string | null;
  source_platform?: string | null;
  landing_page?: string | null;
  page_url?: string | null;
  referrer?: string | null;
  visitor_id?: string | null;
  device_type?: string | null;
  browser?: string | null;
  os?: string | null;
  consent?: boolean | null;
};

function toAttribution(data: LeadSubmitInput): AttributionData {
  return {
    utm_source: data.utm_source ?? undefined,
    utm_medium: data.utm_medium ?? undefined,
    utm_campaign: data.utm_campaign ?? undefined,
    utm_content: data.utm_content ?? undefined,
    utm_term: data.utm_term ?? undefined,
    gclid: data.gclid ?? undefined,
    gbraid: data.gbraid ?? undefined,
    wbraid: data.wbraid ?? undefined,
    fbclid: data.fbclid ?? undefined,
    source_platform: data.source_platform ?? undefined,
    landing_page: data.landing_page ?? undefined,
    page_url: data.page_url ?? undefined,
    referrer: data.referrer ?? undefined,
    visitorId: data.visitor_id ?? undefined,
    device_type: data.device_type ?? undefined,
    browser: data.browser ?? undefined,
    os: data.os ?? undefined,
    services: data.services,
    details: data.details ?? undefined,
    consent: data.consent ?? undefined,
  };
}

/**
 * Turns a machine lead-source slug into a clean, human-readable origin label for
 * the GHL "Source" field and card tag (e.g. "marietta_ga_siding_page" →
 * "Marietta Siding LP"). The raw slug stays untouched in Supabase / custom fields.
 */
function readableOrigin(rawSource?: string | null, rawTag?: string | null): string {
  const raw = (rawSource || rawTag || "").trim();
  if (!raw) return "Website";
  const DROP = new Set(["page", "ga", "footer", "dialog", "hero", "lp", "hub", "form"]);
  const words = raw
    .split(/[_-]+/)
    .map((w) => w.trim())
    .filter((w) => w && !DROP.has(w.toLowerCase()))
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
  if (words.length === 0) return "Website";
  const isLandingPage = /(^lp[_-]|[_-]page$)/i.test(raw);
  return words.join(" ") + (isLandingPage ? " LP" : "");
}

/**
 * Maps our internal source_platform onto the CRM's existing Source vocabulary.
 * The live pipeline already speaks "Facebook Ads", "Houzz", "Thumbtack", "Call" —
 * so "Meta Paid" is normalised to the wording the sales team already reads.
 */
function channelLabel(sourcePlatform?: string | null): string {
  const p = (sourcePlatform || "").trim();
  if (!p) return "Website";
  if (p === "Meta Paid") return "Facebook Ads";
  return p; // "Google Ads", "Instagram", "LSA", "GMB", "Google Organic", "Direct", …
}

/** City name when the lead-source slug names one of our service cities, else null. */
function cityFromSource(rawSource?: string | null): string | null {
  const raw = (rawSource || "").toLowerCase();
  if (!raw) return null;
  for (const [slug, data] of Object.entries(CITY_LPS)) {
    if (raw.includes(slug) || raw.includes(slug.replace(/-/g, "_"))) return data.city;
  }
  return null;
}

/** Service-role Supabase client (server-only). Bypasses RLS — never expose to the browser. */
function getAdminClient() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  if (!url || !key) return null;
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

/**
 * Persists the lead with its full attribution snapshot. Runs service-role: the
 * old browser-side insert always failed with 42501 because its `.select()`
 * readback needs a SELECT policy, and `leads` only grants SELECT to admins.
 */
async function insertLead(data: LeadSubmitInput): Promise<string | null> {
  const admin = getAdminClient();
  if (!admin) {
    console.error("[leads] Missing Supabase env — lead NOT persisted.");
    return null;
  }
  const { data: inserted, error } = await admin
    .from("leads")
    .insert({
      name: data.name || "",
      phone: data.phone || "",
      email: data.email || null,
      city: data.city || "",
      services: data.services || [],
      details: data.details || null,
      consent: data.consent ?? false,
      source: data.source ?? null,
      tag: data.tag ?? null,
      utm_source: data.utm_source ?? null,
      utm_medium: data.utm_medium ?? null,
      utm_campaign: data.utm_campaign ?? null,
      utm_content: data.utm_content ?? null,
      utm_term: data.utm_term ?? null,
      gclid: data.gclid ?? null,
      fbclid: data.fbclid ?? null,
      source_platform: data.source_platform ?? null,
      page_url: data.page_url ?? null,
      landing_page: data.landing_page ?? null,
      referrer: data.referrer ?? null,
      visitor_id: data.visitor_id ?? null,
      device_type: data.device_type ?? null,
      browser: data.browser ?? null,
      os: data.os ?? null,
    })
    .select("id")
    .single();
  if (error) {
    console.error("[leads] insert failed:", error.message);
    return null;
  }
  return inserted?.id ?? null;
}

/** Writes the GHL sync outcome back onto the lead row (service-role). */
async function markLeadSync(
  leadId: string | null,
  result: {
    ghl: boolean;
    contactId?: string | null;
    opportunityId?: string | null;
    conversationId?: string | null;
  },
): Promise<void> {
  if (!leadId) return;
  const admin = getAdminClient();
  if (!admin) return;
  const { error } = await admin
    .from("leads")
    .update({
      ghl_contact_id: result.contactId ?? null,
      ghl_opportunity_id: result.opportunityId ?? null,
      ghl_synced_at: result.ghl ? new Date().toISOString() : null,
      status: result.ghl ? "processed" : "failed",
      ghl_response: { synced: result.ghl, conversation_id: result.conversationId ?? null },
    })
    .eq("id", leadId);
  if (error) console.error("[leads] sync write-back failed:", error.message);
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
    const name = (data.name || "").trim();
    const [firstName, ...rest] = name.split(" ");
    const lastName = rest.join(" ");
    // Two distinct labels, per the house convention:
    //  • pageLabel  — which page produced the lead ("Marietta Siding LP") → tag.
    //  • sourceLabel — channel + city ("Facebook Ads — Marietta") → the Source
    //    field, matching the vocabulary already in the live pipeline.
    const pageLabel = readableOrigin(data.source, data.tag);
    const city = cityFromSource(data.source);
    const channel = channelLabel(data.source_platform);
    const sourceLabel = city ? `${channel} — ${city}` : channel;

    // Persist first, so the lead is never lost even if GHL is down/unset.
    const leadId = await insertLead(data);

    if (!isGhlConfigured()) {
      await markLeadSync(leadId, { ghl: false });
      return { ok: true, ghl: false as const, lead_id: leadId };
    }

    const contact = await upsertContact({
      firstName: firstName || "Website",
      lastName,
      email: data.email || undefined,
      phone: data.phone || "",
      city: data.city || undefined,
      // "new_lead" is the sub-account's canonical automation trigger; the
      // readable origin is what the sales team sees on the card.
      tags: ["new_lead", pageLabel].filter(Boolean) as string[],
      source: sourceLabel,
      customFieldValues: toCustomFieldValues(toAttribution(data)),
    });

    if (!contact) {
      await markLeadSync(leadId, { ghl: false });
      return { ok: true, ghl: false as const, lead_id: leadId };
    }

    const opportunity = await createOpportunity({
      contactId: contact.id,
      // House convention, verified against the live pipeline: an opportunity is
      // named for the customer, nothing else. Service lives in the "Services"
      // custom field + the conversation; origin lives in Source and the tags.
      name: name || "Website Lead",
      source: sourceLabel,
    });

    const conversation = await createWebsiteLeadConversation(
      contact.id,
      [
        `New lead from ${pageLabel}`,
        `Service: ${data.services?.filter(Boolean).join(", ") || data.tag || "General inquiry"}`,
        data.details ? `Details: ${data.details}` : null,
        `Source: ${sourceLabel}`,
        // Page name, not the raw URL — the full link with its params stays in the
        // "Conversion Page" attribution field for whoever needs to audit it.
        `Page: ${pageLabel}`,
      ]
        .filter(Boolean)
        .join("\n"),
    );

    await markLeadSync(leadId, {
      ghl: true,
      contactId: contact.id,
      opportunityId: opportunity?.id || null,
      conversationId: conversation?.id || null,
    });

    return {
      ok: true,
      ghl: true as const,
      lead_id: leadId,
      ghl_contact_id: contact.id,
      ghl_opportunity_id: opportunity?.id || null,
      ghl_conversation_id: conversation?.id || null,
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
      gbraid: data.gbraid,
      wbraid: data.wbraid,
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
        tags: ["new_lead", "ghl-chat-widget"],
        source: "ghl-chat-widget",
        customFieldValues: toCustomFieldValues(attribution),
      });

      if (contact && inserted?.id) {
        const conversation = await createWebsiteLeadConversation(
          contact.id,
          [
            "New GHL chat-widget submission",
            message ? `Details: ${message}` : null,
            page_url ? `Page: ${page_url}` : null,
          ]
            .filter(Boolean)
            .join("\n"),
        );
        await admin
          .from("leads")
          .update({
            ghl_contact_id: contact.id,
            ghl_response: { conversation_id: conversation?.id || null },
            ghl_synced_at: new Date().toISOString(),
          })
          .eq("id", inserted.id);
      }
    }

    return { ok: true };
  });
