import { supabase } from "@/integrations/supabase/client";
import { SITE } from "@/data/site";
import { track } from "@/lib/track";

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
    });

    if (dbError) {
      console.error("Database error:", dbError);
      // We still continue to webhook if database fails, 
      // but we should probably track this error.
    }

    // 2. Send to Webhook (GHL)
    if (SITE.ghlWebhookUrl) {
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
      };

      const response = await fetch(SITE.ghlWebhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ghlPayload),
      });

      if (!response.ok) {
        throw new Error("Webhook submission failed");
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
