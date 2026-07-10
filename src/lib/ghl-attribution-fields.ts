/**
 * Canonical attribution field map shared by every lead-capture path
 * (standard site forms + GHL chat widget) so both send the exact same
 * complete tracking payload to GoHighLevel.
 *
 * Field keys are account-agnostic — created on demand via
 * ensureCustomFields() in ghl-client.server.ts — so this works unmodified
 * against any GHL location (e.g. a future clone for another company).
 */

export type AttributionData = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  utm_keyword?: string;
  gclid?: string;
  fbclid?: string;
  msclkid?: string;
  ttclid?: string;
  source_platform?: string;
  landing_page?: string;
  page_url?: string;
  referrer?: string;
  visitorId?: string;
  device_type?: string;
  browser?: string;
  os?: string;
};

/**
 * Definition of every custom field this integration needs on the GHL
 * "contact" model. `key` becomes the GHL fieldKey suffix
 * (contact.<key>) and the property name ensureCustomFields() resolves
 * to a field ID for. `name` is the human label shown in GHL's UI.
 */
export const ATTRIBUTION_FIELD_DEFS = [
  { key: "utm_source", name: "UTM Source" },
  { key: "utm_medium", name: "UTM Medium" },
  { key: "utm_campaign", name: "UTM Campaign" },
  { key: "utm_content", name: "UTM Content" },
  { key: "utm_term", name: "UTM Term" },
  { key: "gclid", name: "Google Click ID (GCLID)" },
  { key: "fbclid", name: "Facebook Click ID (FBCLID)" },
  { key: "source_platform", name: "Source Platform" },
  { key: "landing_page", name: "Landing Page" },
  { key: "conversion_page", name: "Conversion Page" },
  { key: "referrer", name: "Referrer" },
  { key: "visitor_id", name: "Visitor ID" },
  { key: "device_type", name: "Device Type" },
  { key: "browser", name: "Browser" },
  { key: "operating_system", name: "Operating System" },
] as const;

export type AttributionFieldKey = (typeof ATTRIBUTION_FIELD_DEFS)[number]["key"];

/** Maps our internal attribution shape onto ATTRIBUTION_FIELD_DEFS keys. */
export function toCustomFieldValues(
  attribution: AttributionData,
): Partial<Record<AttributionFieldKey, string>> {
  return {
    utm_source: attribution.utm_source,
    utm_medium: attribution.utm_medium,
    utm_campaign: attribution.utm_campaign,
    utm_content: attribution.utm_content,
    utm_term: attribution.utm_term || attribution.utm_keyword,
    gclid: attribution.gclid,
    fbclid: attribution.fbclid,
    source_platform: attribution.source_platform,
    landing_page: attribution.landing_page,
    conversion_page: attribution.page_url,
    referrer: attribution.referrer,
    visitor_id: attribution.visitorId,
    device_type: attribution.device_type,
    browser: attribution.browser,
    operating_system: attribution.os,
  };
}
