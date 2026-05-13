import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const DashboardMetricsSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

const formatSeconds = (seconds: number) => {
  if (!Number.isFinite(seconds) || seconds <= 0) return "0s";
  const minutes = Math.floor(seconds / 60);
  const rest = Math.round(seconds % 60);
  return minutes > 0 ? `${minutes}m ${rest}s` : `${rest}s`;
};

const asRecord = (value: unknown): Record<string, any> =>
  value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, any>) : {};

const getSourceLabel = (event: any) => {
  const metadata = asRecord(event.metadata);
  const source = event.utm_source || metadata.utm_source || metadata.source || "Direto";
  const medium = event.utm_medium || metadata.utm_medium;
  const campaign = event.utm_campaign || metadata.utm_campaign;
  return [source, medium, campaign].filter(Boolean).join(" / ");
};

const isViewEvent = (type: string) => type.includes("view") || type.includes("visit") || type.includes("page");
const isClickEvent = (type: string) => type.includes("click") || type.includes("cta");
const isLeadEvent = (type: string) => type.includes("lead") || type.includes("conversion") || type.includes("submit") || type.includes("appointment");

const emptyMetrics = (startDate?: string, endDate?: string) => ({
  isSimulated: false,
  sourceLabel: "Dados reais rastreados",
  appliedDateRange: { startDate, endDate },
  overview: {
    totalConversions: 0,
    conversionRate: 0,
    appointments: 0,
    chatInteractions: 0,
    totalVisitors: 0,
    uniqueVisitors: 0,
    pageViews: 0,
    pagesPerVisit: 0,
    bounceRate: 0,
    avgSessionDuration: "0s",
  },
  trafficTrend: [] as Array<{ date: string; visitors: number; views: number }>,
  acquisition: [] as Array<{ source: string; visitors: number; leads: number; color: string }>,
  dailyTrend: [] as Array<{ date: string; visitors: number; views: number }>,
  devices: [] as Array<{ name: string; value: number; color: string }>,
  topPages: [] as Array<any>,
  blogStats: {
    totalPosts: 0,
    avgReadingTime: "0s",
    topArticles: [] as Array<any>,
    marketBenchmarks: [
      { category: "Tempo de leitura", value: 0, benchmark: 65 },
      { category: "Bounce saudável", value: 0, benchmark: 55 },
      { category: "Conversão de conteúdo", value: 0, benchmark: 3 },
    ],
  },
  clickEvents: [] as Array<any>,
  timeComparison: { topPagesAvg: 0, restOfSiteAvg: 0 },
  countries: [] as Array<{ name: string; visitors: number }>,
  scheduledReports: [] as Array<{ id: string; name: string; email: string; frequency: string }>,
});

export const getDashboardMetrics = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => DashboardMetricsSchema.parse(data))
  .handler(async ({ data, context }) => {
    const { startDate, endDate } = data;
    const { supabase } = context;
    const fallback = emptyMetrics(startDate, endDate);
    const start = startDate ? `${startDate}T00:00:00.000Z` : undefined;
    const end = endDate ? `${endDate}T23:59:59.999Z` : undefined;

    try {
      let eventsQuery = supabase
        .from("ab_events")
        .select("id,timestamp,event_type,service_key,variation,city,utm_source,utm_medium,utm_campaign,landing_page,metadata")
        .order("timestamp", { ascending: true })
        .limit(1000);

      if (start) eventsQuery = eventsQuery.gte("timestamp", start);
      if (end) eventsQuery = eventsQuery.lte("timestamp", end);

      let trafficQuery = supabase
        .from("traffic_metrics_daily")
        .select("date,total_visitors,unique_visitors,page_views,avg_session_duration,bounce_rate,conversions,appointments")
        .order("date", { ascending: true })
        .limit(1000);

      if (startDate) trafficQuery = trafficQuery.gte("date", startDate);
      if (endDate) trafficQuery = trafficQuery.lte("date", endDate);

      let sourceQuery = supabase
        .from("traffic_sources_daily")
        .select("source,visitors,conversions")
        .limit(1000);

      if (startDate) sourceQuery = sourceQuery.gte("date", startDate);
      if (endDate) sourceQuery = sourceQuery.lte("date", endDate);

      const [eventsResult, trafficResult, sourceResult, postsResult] = await Promise.all([
        eventsQuery,
        trafficQuery,
        sourceQuery,
        supabase.from("blog_posts").select("title,slug,keywords,status").limit(200),
      ]);

      if (eventsResult.error) throw eventsResult.error;
      const events = (eventsResult.data || []) as any[];
      const trafficRows = (trafficResult.data || []) as any[];
      const sourceRows = (sourceResult.data || []) as any[];
      const posts = (postsResult.data || []) as any[];

      const pageMap = new Map<string, any>();
      const sourceMap = new Map<string, { source: string; visitors: number; leads: number }>();
      const clickMap = new Map<string, any>();
      const dailyMap = new Map<string, { date: string; visitors: number; views: number }>();
      const countryMap = new Map<string, number>();
      const blogMap = new Map<string, any>();
      let totalDuration = 0;
      let durationCount = 0;

      for (const event of events) {
        const metadata = asRecord(event.metadata);
        const eventType = String(event.event_type || "").toLowerCase();
        const page = event.landing_page || metadata.page_path || metadata.path || "/";
        const source = getSourceLabel(event);
        const day = new Date(event.timestamp).toISOString().slice(0, 10);
        const duration = Number(metadata.duration_seconds || metadata.avg_time_seconds || metadata.time_on_page_seconds || 0);

        if (duration > 0) {
          totalDuration += duration;
          durationCount += 1;
        }

        const daily = dailyMap.get(day) || { date: day, visitors: 0, views: 0 };
        if (isViewEvent(eventType)) daily.views += 1;
        daily.visitors += 1;
        dailyMap.set(day, daily);

        const sourceStats = sourceMap.get(source) || { source, visitors: 0, leads: 0 };
        sourceStats.visitors += 1;
        if (isLeadEvent(eventType)) sourceStats.leads += 1;
        sourceMap.set(source, sourceStats);

        const pageStats = pageMap.get(page) || {
          path: page,
          views: 0,
          avgTimeSeconds: 0,
          bounceRate: 0,
          conversions: 0,
          leadsBySource: [] as Array<{ source: string; count: number }>,
          sourceCounts: new Map<string, number>(),
          trend: [] as Array<{ date: string; views: number; leads: number; leadsByChannel: Record<string, number> }>,
          trendCounts: new Map<string, { date: string; views: number; leads: number; leadsByChannel: Record<string, number> }>(),
        };
        if (isViewEvent(eventType)) pageStats.views += 1;
        if (isLeadEvent(eventType)) {
          pageStats.conversions += 1;
          pageStats.sourceCounts.set(source, (pageStats.sourceCounts.get(source) || 0) + 1);
        }
        if (duration > 0) pageStats.avgTimeSeconds += duration;

        const pageTrend = pageStats.trendCounts.get(day) || { date: day, views: 0, leads: 0, leadsByChannel: {} };
        if (isViewEvent(eventType)) pageTrend.views += 1;
        if (isLeadEvent(eventType)) {
          pageTrend.leads += 1;
          pageTrend.leadsByChannel[source] = (pageTrend.leadsByChannel[source] || 0) + 1;
        }
        pageStats.trendCounts.set(day, pageTrend);
        pageMap.set(page, pageStats);

        if (isClickEvent(eventType)) {
          const button = metadata.button || metadata.button_label || metadata.cta || metadata.event_label || "CTA sem rótulo";
          const clickStats = clickMap.get(button) || {
            button,
            clicks: 0,
            conversions: 0,
            conversion: 0,
            sources: [] as Array<{ source: string; count: number }>,
            sourceCounts: new Map<string, number>(),
          };
          clickStats.clicks += 1;
          clickStats.sourceCounts.set(source, (clickStats.sourceCounts.get(source) || 0) + 1);
          clickMap.set(button, clickStats);
        }

        const country = metadata.country || metadata.country_name;
        if (country) countryMap.set(country, (countryMap.get(country) || 0) + 1);

        if (page.includes("blog") || page.includes("article")) {
          const title = metadata.post_title || metadata.title || page.replace(/^\/blog\/?/, "");
          const article = blogMap.get(page) || {
            path: page,
            title: title || page,
            views: 0,
            avgTimeSeconds: 0,
            bounceRate: 0,
            conversion: 0,
            conversions: 0,
            keywords: Array.isArray(metadata.keywords) ? metadata.keywords : [],
            leadsBySource: [] as Array<{ source: string; count: number }>,
            sourceCounts: new Map<string, number>(),
            trend: [] as Array<{ date: string; views: number; leads: number }>,
            trendCounts: new Map<string, { date: string; views: number; leads: number }>(),
          };
          if (isViewEvent(eventType)) article.views += 1;
          if (duration > 0) article.avgTimeSeconds += duration;
          if (isLeadEvent(eventType)) {
            article.conversions += 1;
            article.sourceCounts.set(source, (article.sourceCounts.get(source) || 0) + 1);
          }
          const trend = article.trendCounts.get(day) || { date: day, views: 0, leads: 0 };
          if (isViewEvent(eventType)) trend.views += 1;
          if (isLeadEvent(eventType)) trend.leads += 1;
          article.trendCounts.set(day, trend);
          blogMap.set(page, article);
        }
      }

      const trafficTotals = trafficRows.reduce((acc: any, row: any) => {
        acc.totalVisitors += Number(row.total_visitors || 0);
        acc.uniqueVisitors += Number(row.unique_visitors || 0);
        acc.pageViews += Number(row.page_views || 0);
        acc.conversions += Number(row.conversions || 0);
        acc.appointments += Number(row.appointments || 0);
        acc.bounceRate += Number(row.bounce_rate || 0);
        return acc;
      }, { totalVisitors: 0, uniqueVisitors: 0, pageViews: 0, conversions: 0, appointments: 0, bounceRate: 0 });

      const pageViewsFromEvents = Array.from(pageMap.values()).reduce((sum, p) => sum + p.views, 0);
      const conversionsFromEvents = events.filter((event) => isLeadEvent(String(event.event_type || "").toLowerCase())).length;
      const clickEvents = Array.from(clickMap.values()).map((click) => ({
        ...click,
        conversion: click.clicks ? Number(((click.conversions / click.clicks) * 100).toFixed(1)) : 0,
        sources: Array.from((click.sourceCounts as Map<string, number>).entries()).map(([source, count]) => ({ source, count })),
      })).sort((a, b) => b.clicks - a.clicks);

      const topPages = Array.from(pageMap.values()).map((page) => {
        const avgSeconds = page.views ? Math.round(page.avgTimeSeconds / Math.max(page.views, 1)) : 0;
        return {
          ...page,
          avgTimeSeconds: avgSeconds,
          avgTime: formatSeconds(avgSeconds),
          bounceRate: page.bounceRate || 0,
          leadsBySource: Array.from((page.sourceCounts as Map<string, number>).entries()).map(([source, count]) => ({ source, count })),
          sourceCounts: undefined,
        };
      }).sort((a, b) => b.views - a.views);

      const topArticles = Array.from(blogMap.values()).map((article) => {
        const avgSeconds = article.views ? Math.round(article.avgTimeSeconds / Math.max(article.views, 1)) : 0;
        return {
          ...article,
          avgTimeSeconds: avgSeconds,
          avgTime: formatSeconds(avgSeconds),
          conversion: article.views ? Number(((article.conversions / article.views) * 100).toFixed(1)) : 0,
          leadsBySource: Array.from((article.sourceCounts as Map<string, number>).entries()).map(([source, count]) => ({ source, count })),
          trend: Array.from((article.trendCounts as Map<string, { date: string; views: number; leads: number }>).values()).sort((a, b) => a.date.localeCompare(b.date)),
          sourceCounts: undefined,
          trendCounts: undefined,
        };
      }).sort((a, b) => b.views - a.views);

      const sourceData = sourceRows.length
        ? Object.values(sourceRows.reduce((acc: Record<string, any>, row: any) => {
            const source = row.source || "Direto";
            acc[source] ||= { source, visitors: 0, leads: 0 };
            acc[source].visitors += Number(row.visitors || 0);
            acc[source].leads += Number(row.conversions || 0);
            return acc;
          }, {})) as Array<{ source: string; visitors: number; leads: number }>
        : Array.from(sourceMap.values());

      const palette = ["var(--sd-green)", "oklch(0.65 0.18 220)", "oklch(0.72 0.12 80)", "oklch(0.7 0.18 35)"];
      const acquisition = sourceData.map((item, index) => ({ ...item, color: palette[index % palette.length] }));
      const dailyTrend = trafficRows.length
        ? trafficRows.map((row: any) => ({ date: row.date, visitors: Number(row.total_visitors || 0), views: Number(row.page_views || 0) }))
        : Array.from(dailyMap.values()).sort((a, b) => a.date.localeCompare(b.date));

      const topThree = topPages.slice(0, 3);
      const rest = topPages.slice(3);
      const topPagesAvg = topThree.length ? Math.round(topThree.reduce((sum, p) => sum + p.avgTimeSeconds, 0) / topThree.length) : 0;
      const restOfSiteAvg = rest.length ? Math.round(rest.reduce((sum, p) => sum + p.avgTimeSeconds, 0) / rest.length) : 0;
      const totalViews = trafficTotals.pageViews || pageViewsFromEvents;
      const totalVisitors = trafficTotals.totalVisitors || events.length;
      const totalConversions = trafficTotals.conversions || conversionsFromEvents;
      const avgSessionSeconds = durationCount ? Math.round(totalDuration / durationCount) : 0;

      return {
        ...fallback,
        overview: {
          totalConversions,
          conversionRate: totalViews ? Number(((totalConversions / totalViews) * 100).toFixed(1)) : 0,
          appointments: trafficTotals.appointments,
          chatInteractions: events.filter((event) => String(event.event_type || "").toLowerCase().includes("chat")).length,
          totalVisitors,
          uniqueVisitors: trafficTotals.uniqueVisitors || totalVisitors,
          pageViews: totalViews,
          pagesPerVisit: totalVisitors ? Number((totalViews / totalVisitors).toFixed(1)) : 0,
          bounceRate: trafficRows.length ? Number((trafficTotals.bounceRate / trafficRows.length).toFixed(1)) : 0,
          avgSessionDuration: formatSeconds(avgSessionSeconds),
        },
        trafficTrend: dailyTrend,
        acquisition,
        dailyTrend,
        devices: fallback.devices,
        topPages,
        blogStats: {
          totalPosts: posts.length || topArticles.length,
          avgReadingTime: topArticles.length ? formatSeconds(Math.round(topArticles.reduce((sum, post) => sum + post.avgTimeSeconds, 0) / topArticles.length)) : "0s",
          topArticles,
          marketBenchmarks: fallback.blogStats.marketBenchmarks,
        },
        clickEvents,
        timeComparison: { topPagesAvg, restOfSiteAvg },
        countries: Array.from(countryMap.entries()).map(([name, visitors]) => ({ name, visitors })).sort((a, b) => b.visitors - a.visitors),
      };
    } catch (error) {
      console.error("Dashboard metrics fallback:", error);
      return { ...fallback, loadError: "Não foi possível consultar todas as métricas reais agora." };
    }
  });