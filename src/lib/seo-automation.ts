import { supabase } from "@/integrations/supabase/client";
import { generateSeoMarkdownReport } from "@/lib/seo-report";

/**
 * Automates the SEO Audit and updates the seo_audit_report.md file.
 * In a real environment, this could be triggered by a Cron Job or a GitHub Action.
 */
export async function runPeriodicSeoAudit() {
  console.log("Starting periodic SEO audit...");
  
  try {
    const report = generateSeoMarkdownReport();
    
    // In the dev environment, we write to a file via tool call.
    // In production, we could save this to a 'site_health' table in Supabase.
    const { error } = await supabase.from("site_health_logs").insert({
      check_type: "SEO_AUDIT",
      status: "SUCCESS",
      payload: { 
        summary: "Audit completed successfully",
        url_count: report.split("\n").filter(l => l.includes("| `/")).length
      }
    });

    if (error) console.error("Error logging SEO audit to Supabase:", error);
    
    return report;
  } catch (err) {
    console.error("SEO Audit failed:", err);
    await supabase.from("site_health_logs").insert({
      check_type: "SEO_AUDIT",
      status: "FAILED",
      payload: { error: String(err) }
    });
    throw err;
  }
}
