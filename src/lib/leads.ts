import { supabase } from "@/integrations/supabase/client";
import { track, getAttribution, getVisitorId } from "@/lib/track";
import { getDeviceType, getBrowser, getOS } from "@/lib/device-detect";
import { submitLeadToGhl } from "@/lib/ghl-lead.functions";

export type LeadPayload = {
  name: string;
  phone: string;
  email?: string;
  city?: string;
  services?: string[];
  details?: string;
  source: string;
  tag: string;
  consent?: boolean;
};

function deriveSourcePlatform(attribution: Record<string, string>): string {
  const gclid = attribution.gclid;
  const fbclid = attribution.fbclid;
  if (gclid) return "Google Ads";
  if (fbclid) return "Meta Paid";
  const src = (attribution.utm_source ?? "").toLowerCase();
  const med = (attribution.utm_medium ?? "").toLowerCase();
  if (src === "lsa") return "LSA";
  if (src === "gmb" || src === "google_business_profile") return "GMB";
  if (src === "google" && (med === "cpc" || med === "ppc")) return "Google Ads";
  if (src === "google") return "Google Organic";
  if (src === "instagram") return "Instagram";
  if (src === "facebook" || src === "fb") return "Facebook";
  if (src) return src;
  return "Direct";
}

export async function submitLead(payload: LeadPayload) {
  const { name, phone, email, city, services, details, source, tag, consent } = payload;
  const attribution = typeof window !== "undefined" ? getAttribution() : {};
  const sourcePlatform = deriveSourcePlatform(attribution);
  const visitorId = typeof window !== "undefined" ? getVisitorId() : "";
  const pageUrl = typeof window !== "undefined" ? window.location.href : "";
  const deviceType = typeof window !== "undefined" ? getDeviceType() : "";
  const browser = typeof window !== "undefined" ? getBrowser() : "";
  const os = typeof window !== "undefined" ? getOS() : "";

  try {
    // 1. Save to Supabase — full attribution snapshot, not just the basics.
    const { data: inserted, error: dbError } = await supabase
      .from("leads")
      .insert({
        name,
        phone,
        email: email || null,
        city: city || "",
        services: services || [],
        details: details || null,
        consent: consent || false,
        source,
        tag,
        utm_source: attribution.utm_source ?? null,
        utm_medium: attribution.utm_medium ?? null,
        utm_campaign: attribution.utm_campaign ?? null,
        utm_content: attribution.utm_content ?? null,
        utm_term: attribution.utm_term ?? null,
        gclid: attribution.gclid ?? null,
        fbclid: attribution.fbclid ?? null,
        source_platform: sourcePlatform,
        page_url: pageUrl,
        landing_page: attribution.landing_page ?? null,
        referrer: attribution.referrer ?? null,
        visitor_id: visitorId || null,
        device_type: deviceType || null,
        browser: browser || null,
        os: os || null,
      })
      .select("id")
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
    }

    // 2. Send to GHL via a server function (API key never touches the browser).
    //    createServerFn is the pattern this TanStack Start build actually serves;
    //    the old fetch("/api/submit-lead") route was never mounted (always 404).
    const result = await submitLeadToGhl({
      data: {
        name,
        phone,
        email: email || "",
        city: city || "",
        services: services || [],
        details: details || "",
        source,
        tag,
        utm_source: attribution.utm_source ?? null,
        utm_medium: attribution.utm_medium ?? null,
        utm_campaign: attribution.utm_campaign ?? null,
        utm_content: attribution.utm_content ?? null,
        utm_term: attribution.utm_term ?? null,
        gclid: attribution.gclid ?? null,
        fbclid: attribution.fbclid ?? null,
        source_platform: sourcePlatform,
        page_url: pageUrl,
        landing_page: attribution.landing_page ?? null,
        referrer: attribution.referrer ?? null,
        visitor_id: visitorId,
        device_type: deviceType,
        browser,
        os,
      },
    }).catch((err) => {
      console.warn("GHL submit failed:", err);
      return null;
    });

    if (result?.ghl && inserted?.id) {
      await supabase
        .from("leads")
        .update({
          ghl_contact_id: result.ghl_contact_id ?? null,
          ghl_opportunity_id: result.ghl_opportunity_id ?? null,
          ghl_synced_at: new Date().toISOString(),
        })
        .eq("id", inserted.id);
    }

    track("lead_submission_success", { source, tag });
    return { success: true };
  } catch (error) {
    console.error("Lead submission error:", error);
    track("lead_submission_error", { source, tag, error: String(error) });
    return { success: false, error };
  }
}
