import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ReportData {
  period: string;
  leads: number;
  pageViews: number;
  conversionRate: string;
  topPages: { path: string; views: number }[];
}

async function buildReportData(admin: any): Promise<ReportData> {
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const { count: leadsCount } = await admin
    .from("leads")
    .select("*", { count: "exact", head: true })
    .gte("created_at", weekAgo.toISOString());

  const { count: pageViewsCount } = await admin
    .from("analytics_events")
    .select("*", { count: "exact", head: true })
    .eq("event_type", "page_view")
    .gte("created_at", weekAgo.toISOString());

  const { data: topPagesData } = await admin
    .from("analytics_events")
    .select("page_path")
    .eq("event_type", "page_view")
    .gte("created_at", weekAgo.toISOString());

  const pageCounts: Record<string, number> = {};
  (topPagesData || []).forEach((row: any) => {
    pageCounts[row.page_path] = (pageCounts[row.page_path] || 0) + 1;
  });
  const topPages = Object.entries(pageCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([path, views]) => ({ path, views }));

  const views = pageViewsCount || 0;
  const leads = leadsCount || 0;
  const conversionRate = views > 0 ? ((leads / views) * 100).toFixed(2) + "%" : "0%";

  const periodStart = weekAgo.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const periodEnd = now.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return {
    period: `${periodStart} – ${periodEnd}`,
    leads,
    pageViews: views,
    conversionRate,
    topPages,
  };
}

function buildEmailHtml(report: ReportData): string {
  const topPagesRows = report.topPages
    .map(
      (p) => `<tr>
        <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;font-size:13px;color:#374151;">${p.path}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;font-size:13px;color:#374151;text-align:right;">${p.views.toLocaleString()}</td>
      </tr>`,
    )
    .join("");

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:Inter,Arial,sans-serif;">
  <div style="max-width:600px;margin:40px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
    <div style="background:#0A0A0A;padding:32px 40px;text-align:center;">
      <h1 style="margin:0;color:#fff;font-size:24px;font-weight:700;">Siding Depot</h1>
      <p style="margin:8px 0 0;color:#9ca3af;font-size:13px;">Weekly Performance Report</p>
    </div>
    <div style="padding:24px 40px 0;border-bottom:1px solid #f0f0f0;">
      <p style="margin:0;color:#6b7280;font-size:13px;">Period: <strong style="color:#111827;">${report.period}</strong></p>
    </div>
    <div style="padding:32px 40px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="width:33%;padding:20px;background:#f9fafb;border-radius:8px;text-align:center;">
            <div style="font-size:28px;font-weight:700;color:#111827;">${report.leads}</div>
            <div style="font-size:12px;color:#6b7280;margin-top:4px;text-transform:uppercase;letter-spacing:0.5px;">New Leads</div>
          </td>
          <td style="width:4px;"></td>
          <td style="width:33%;padding:20px;background:#f9fafb;border-radius:8px;text-align:center;">
            <div style="font-size:28px;font-weight:700;color:#111827;">${report.pageViews.toLocaleString()}</div>
            <div style="font-size:12px;color:#6b7280;margin-top:4px;text-transform:uppercase;letter-spacing:0.5px;">Page Views</div>
          </td>
          <td style="width:4px;"></td>
          <td style="width:33%;padding:20px;background:#f9fafb;border-radius:8px;text-align:center;">
            <div style="font-size:28px;font-weight:700;color:#111827;">${report.conversionRate}</div>
            <div style="font-size:12px;color:#6b7280;margin-top:4px;text-transform:uppercase;letter-spacing:0.5px;">Conversion Rate</div>
          </td>
        </tr>
      </table>
    </div>
    ${
      report.topPages.length > 0
        ? `
    <div style="padding:0 40px 32px;">
      <h3 style="margin:0 0 16px;font-size:14px;font-weight:600;color:#111827;text-transform:uppercase;letter-spacing:0.5px;">Top Pages This Week</h3>
      <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #f0f0f0;border-radius:8px;overflow:hidden;">
        <thead>
          <tr style="background:#f9fafb;">
            <th style="padding:10px 12px;text-align:left;font-size:11px;color:#6b7280;font-weight:600;">Page</th>
            <th style="padding:10px 12px;text-align:right;font-size:11px;color:#6b7280;font-weight:600;">Views</th>
          </tr>
        </thead>
        <tbody>${topPagesRows}</tbody>
      </table>
    </div>`
        : ""
    }
    <div style="padding:0 40px 32px;text-align:center;">
      <a href="https://sidingdepot.com/admin/dashboard" style="display:inline-block;background:#22c55e;color:#0A0A0A;text-decoration:none;padding:14px 32px;border-radius:100px;font-weight:700;font-size:14px;">View Full Dashboard →</a>
    </div>
    <div style="padding:24px 40px;background:#f9fafb;border-top:1px solid #f0f0f0;text-align:center;">
      <p style="margin:0;font-size:12px;color:#9ca3af;">Siding Depot — James Hardie Elite Preferred Contractor<br>Greater Marietta & North Atlanta, GA</p>
    </div>
  </div>
</body>
</html>`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    if (!resendApiKey) {
      return new Response(JSON.stringify({ ok: false, error: "RESEND_API_KEY not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const admin = createClient(supabaseUrl, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data: reports, error: reportsError } = await admin
      .from("scheduled_reports")
      .select("*")
      .eq("enabled", true);

    if (reportsError || !reports?.length) {
      return new Response(JSON.stringify({ ok: true, message: "No active scheduled reports" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const reportData = await buildReportData(admin);
    const emailHtml = buildEmailHtml(reportData);

    const results = [];
    for (const report of reports) {
      const recipients: string[] = Array.isArray(report.recipients) ? report.recipients : [];
      for (const to of recipients) {
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Siding Depot <reports@sidingdepot.com>",
            to,
            subject: `📊 Weekly Report — ${reportData.period}`,
            html: emailHtml,
          }),
        });
        const result = await res.json();
        results.push({ to, ok: res.ok, result });
      }

      await admin
        .from("scheduled_reports")
        .update({ last_sent_at: new Date().toISOString() })
        .eq("id", report.id);
    }

    console.log("[Scheduled Reports] Sent:", results.length);
    return new Response(JSON.stringify({ ok: true, sent: results.length, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[Scheduled Reports] Error:", err);
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
