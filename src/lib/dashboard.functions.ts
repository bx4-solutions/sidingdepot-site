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
  .handler(async ({ input, context }) => {
    const { supabase } = context;
    const { startDate, endDate } = input;

    // Simular dados reais enquanto o job de sincronização não popula as tabelas
    // No futuro, isso faria: 
    // const { data } = await supabase.from('traffic_metrics_daily').select('*').gte('date', startDate).lte('date', endDate)

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
      ]
    };
  });
