import { supabase } from "@/integrations/supabase/client";
import { SITE } from "@/data/site";
import { track, getAttribution } from "@/lib/track";

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

export async function submitLead(payload: LeadPayload) {
  const { name, phone, email, city, services, details, source, tag, consent } = payload;
  const attribution = typeof window !== "undefined" ? getAttribution() : {};
  const gclid = attribution.gclid ?? null;
  const fbclid = attribution.fbclid ?? null;

  function deriveSourcePlatform(): string {
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

  try {
    // 1. Save to Supabase
    const { error: dbError } = await supabase.from("leads").insert({
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
      gclid,
      fbclid,
      source_platform: deriveSourcePlatform(),
      page_url: typeof window !== "undefined" ? window.location.href : null,
    });

    if (dbError) {
      console.error("Database error:", dbError);
      // We still continue to webhook if database fails,
      // but we should probably track this error.
    }

    // 2. Send to GHL Webhook (only if enabled in site_settings table)
    const { data: settings } = await supabase
      .from("site_settings")
      .select("key, value")
      .in("key", ["ghl_webhook_enabled", "ghl_webhook_url"]);

    const settingsMap = Object.fromEntries(
      (settings ?? []).map((r: { key: string; value: string }) => [r.key, r.value]),
    );

    const webhookEnabled = settingsMap["ghl_webhook_enabled"] !== "false";
    // DB URL takes priority over env var — lets you change it without redeploying
    const webhookUrl = settingsMap["ghl_webhook_url"] || SITE.ghlWebhookUrl;

    if (webhookEnabled && webhookUrl) {
      const ghlPayload = {
        first_name: name.split(" ")[0],
        last_name: name.split(" ").slice(1).join(" ") || " ",
        phone,
        email: email || "",
        city: city || "",
        services: services || [],
        service: services?.join(", ") || "",
        details: details || "",
        source,
        tag,
        submittedAt: new Date().toISOString(),
        utm_source: attribution.utm_source ?? null,
        utm_medium: attribution.utm_medium ?? null,
        utm_campaign: attribution.utm_campaign ?? null,
        utm_content: (attribution as Record<string, string>).utm_content ?? null,
        utm_term: (attribution as Record<string, string>).utm_term ?? null,
        gclid,
        fbclid,
        source_platform: deriveSourcePlatform(),
        page_url: typeof window !== "undefined" ? window.location.href : "",
        referrer: typeof document !== "undefined" ? document.referrer : "",
      };

      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ghlPayload),
      });

      if (!response.ok) {
        console.warn("GHL webhook responded with:", response.status);
      }
    }

    track("lead_submission_success", { source, tag });
    return { success: true };
  } catch (error) {
    console.error("Lead submission error:", error);
    track("lead_submission_error", { source, tag, error: String(error) });
    return { success: false, error };
  }
}
