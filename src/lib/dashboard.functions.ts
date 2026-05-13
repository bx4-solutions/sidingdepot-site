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
        { source: "Busca Orgânica", visitors: 4500, color: "var(--sd-green)", leads: 42 },
        { source: "Direto", visitors: 3200, color: "var(--sd-dark-mid)", leads: 28 },
        { source: "Social", visitors: 2100, color: "oklch(0.6 0.2 250)", leads: 15 },
        { source: "E-mail", visitors: 800, color: "oklch(0.7 0.1 200)", leads: 57 },
      ],
      dailyTrend,
      devices: [
        { name: "Desktop", value: 68, color: "var(--sd-green)" },
        { name: "Mobile", value: 27, color: "oklch(0.65 0.18 220)" },
        { name: "Tablet", value: 5, color: "oklch(0.75 0.12 200)" },
      ],
      topPages: [
        { 
          path: "/", 
          views: 304, 
          avgTime: "1m 20s", 
          avgTimeSeconds: 80,
          bounceRate: 32,
          conversions: 12,
          leadsBySource: [
            { source: "Google", count: 8 },
            { source: "Direct", count: 4 }
          ]
        },
        { 
          path: "/agendar-demo", 
          views: 30, 
          avgTime: "2m 45s", 
          avgTimeSeconds: 165,
          bounceRate: 15,
          conversions: 18,
          leadsBySource: [
            { source: "Email Marketing", count: 12 },
            { source: "Social Ads", count: 6 }
          ]
        },
        { 
          path: "/sobre", 
          views: 11, 
          avgTime: "1m 10s", 
          avgTimeSeconds: 70,
          bounceRate: 45,
          conversions: 2,
          leadsBySource: [
            { source: "Direct", count: 2 }
          ]
        },
        { 
          path: "/produto/recepcionista-ia-voz", 
          views: 8, 
          avgTime: "4m 12s", 
          avgTimeSeconds: 252,
          bounceRate: 10,
          conversions: 5,
          leadsBySource: [
            { source: "Organic Search", count: 5 }
          ]
        },
      ],
      blogStats: {
        totalPosts: 24,
        avgReadingTime: "3m 15s",
        topArticles: [
          { 
            title: "Como a IA está mudando o atendimento", 
            views: 1250, 
            avgTime: "4m 15s", 
            bounceRate: 28, 
            conversion: 4.2,
            keywords: ["IA atendimento", "futuro do suporte"]
          },
          { 
            title: "O guia completo de Siding em 2026", 
            views: 980, 
            avgTime: "3m 45s", 
            bounceRate: 35, 
            conversion: 3.8,
            keywords: ["guia siding", "materiais construção 2026"]
          },
          { 
            title: "5 dicas para aumentar sua produtividade", 
            views: 750, 
            avgTime: "2m 30s", 
            bounceRate: 52, 
            conversion: 2.5,
            keywords: ["produtividade", "dicas trabalho"]
          },
        ],
        marketBenchmarks: [
          { category: "SEO Health", value: 85, benchmark: 70 },
          { category: "Content Quality", value: 92, benchmark: 75 },
          { category: "Engagement", value: 65, benchmark: 60 },
        ]
      },
      clickEvents: [
        { 
          button: "Agendar Demo", 
          clicks: 145, 
          conversion: 12.4, 
          sources: [
            { source: "Home Hero", count: 85 },
            { source: "Pricing Page", count: 60 }
          ]
        },
        { 
          button: "Download Catálogo", 
          clicks: 89, 
          conversion: 8.2, 
          sources: [
            { source: "Product Footer", count: 50 },
            { source: "Sidebar", count: 39 }
          ]
        },
        { 
          button: "Falar com Consultor", 
          clicks: 64, 
          conversion: 15.1, 
          sources: [
            { source: "Contact Page", count: 64 }
          ]
        },
        { 
          button: "Assinar Newsletter", 
          clicks: 230, 
          conversion: 2.4, 
          sources: [
            { source: "Blog Sidebar", count: 180 },
            { source: "Footer", count: 50 }
          ]
        },
      ],
      timeComparison: {
        topPagesAvg: 145, // seconds
        restOfSiteAvg: 58, // seconds
      },
      countries: [
        { name: "United States", visitors: 187 },
        { name: "Brazil", visitors: 64 },
        { name: "Unknown", visitors: 46 },
      ],
      scheduledReports: [] as Array<{ id: string; name: string; email: string; frequency: string }>,
    };
  });