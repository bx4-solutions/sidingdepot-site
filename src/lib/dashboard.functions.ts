import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const DashboardMetricsSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export const getDashboardMetrics = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => DashboardMetricsSchema.parse(data))
  .handler(async ({ data, context }) => {
    const { startDate, endDate } = data;

    // Gera série diária simulada de 13/abr a 13/mai com pico em 04/mai
    const dailyTrend = Array.from({ length: 31 }, (_, i) => {
      const day = i + 13;
      const month = day > 30 ? 5 : 4;
      const dayOfMonth = day > 30 ? day - 30 : day;
      const date = `2026-${String(month).padStart(2, "0")}-${String(dayOfMonth).padStart(2, "0")}`;
      const isSpike = month === 5 && dayOfMonth === 4;
      const base = 5 + Math.round(Math.sin(i / 2) * 4 + Math.random() * 6);
      const views = isSpike ? 130 : base + Math.round(Math.random() * 5);
      const visitors = isSpike ? 95 : Math.max(2, base - 2);
      return { date, views, visitors };
    });

    return {
      overview: {
        totalConversions: 142,
        conversionRate: 3.2,
        appointments: 28,
        chatInteractions: 85,
        totalVisitors: 12400,
        uniqueVisitors: 8900,
        pageViews: 32100,
        pagesPerVisit: 2.6,
        bounceRate: 42.5,
        avgSessionDuration: "2m 45s",
      },
      trafficTrend: [
        { date: "13 abr", visitors: 400, views: 600 },
        { date: "20 abr", visitors: 800, views: 1200 },
        { date: "27 abr", visitors: 600, views: 900 },
        { date: "04 mai", visitors: 1200, views: 1800 },
        { date: "11 mai", visitors: 900, views: 1400 },
      ],
      acquisition: [
        { source: "Busca Orgânica", visitors: 4500, color: "var(--sd-green)" },
        { source: "Direto", visitors: 3200, color: "var(--sd-dark-mid)" },
        { source: "Social", visitors: 2100, color: "oklch(0.6 0.2 250)" },
        { source: "E-mail", visitors: 800, color: "oklch(0.7 0.1 200)" },
      ],
      dailyTrend,
      devices: [
        { name: "Desktop", value: 68, color: "var(--sd-green)" },
        { name: "Mobile", value: 27, color: "oklch(0.65 0.18 220)" },
        { name: "Tablet", value: 5, color: "oklch(0.75 0.12 200)" },
      ],
      topPages: [
        { path: "/", views: 304 },
        { path: "/agendar-demo", views: 30 },
        { path: "/sobre", views: 11 },
        { path: "/produto/recepcionista-ia-voz", views: 8 },
        { path: "/contato", views: 8 },
      ],
      countries: [
        { name: "United States", visitors: 187 },
        { name: "Brazil", visitors: 64 },
        { name: "Unknown", visitors: 46 },
      ],
      scheduledReports: [] as Array<{ id: string; name: string; email: string; frequency: string }>,
    };
  });
