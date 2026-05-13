import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState, useMemo } from "react";
import { AlertCircle, CheckCircle2, Clock, TrendingUp, BarChart3, Search, Activity, Gauge } from "lucide-react";
import { getIndexingStatus, inspectURL, getSearchAnalytics, getLighthouseMetrics } from "@/lib/gsc.functions";
import { Button } from "@/components/ui/button";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Bar,
  BarChart,
  Cell
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/seo-dashboard")({
  component: SEODashboard,
});

function SEODashboard() {
  const [selectedUrl, setSelectedUrl] = useState("https://sidingdepot.lovable.app/");
  const [startDate, setStartDate] = useState(
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState(new Date().toISOString().split("T")[0]);

  const inspectFn = useServerFn(inspectURL);
  const statusFn = useServerFn(getIndexingStatus);
  const analyticsFn = useServerFn(getSearchAnalytics);
  const lighthouseFn = useServerFn(getLighthouseMetrics);

  const { data: status, isLoading: statusLoading } = useQuery({
    queryKey: ["gsc-status", selectedUrl],
    queryFn: () => statusFn({ data: { url: selectedUrl } }),
    enabled: !!selectedUrl,
  });

  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ["gsc-analytics", startDate, endDate],
    queryFn: () => analyticsFn({ data: { startDate, endDate, dimensions: ["date", "page"] } }),
  });

  const { data: lhMetrics, isLoading: lhLoading } = useQuery({
    queryKey: ["lighthouse", selectedUrl],
    queryFn: () => lighthouseFn({ data: { url: selectedUrl } }),
    enabled: !!selectedUrl,
  });

  // Process data for charts
  const chartData = useMemo(() => {
    if (!analytics?.rows) return [];
    
    // Group by date
    const dateMap: Record<string, any> = {};
    analytics.rows.forEach((row: any) => {
      const date = row.keys[0];
      if (!dateMap[date]) {
        dateMap[date] = { date, clicks: 0, impressions: 0 };
      }
      dateMap[date].clicks += row.clicks;
      dateMap[date].impressions += row.impressions;
    });

    return Object.values(dateMap).sort((a: any, b: any) => a.date.localeCompare(b.date));
  }, [analytics]);

  const lpPerformance = useMemo(() => {
    if (!analytics?.rows) return [];
    
    const pageMap: Record<string, any> = {};
    analytics.rows.forEach((row: any) => {
      const page = row.keys[1];
      if (!pageMap[page]) {
        pageMap[page] = { page, clicks: 0, impressions: 0, position: 0, count: 0 };
      }
      pageMap[page].clicks += row.clicks;
      pageMap[page].impressions += row.impressions;
      pageMap[page].position += row.position;
      pageMap[page].count += 1;
    });

    return Object.values(pageMap)
      .map((p: any) => ({
        ...p,
        pageName: p.page.replace("https://sidingdepot.lovable.app", "").replace(/\/$/, "") || "/",
        avgPosition: p.position / p.count,
        ctr: (p.clicks / (p.impressions || 1)) * 100
      }))
      .sort((a: any, b: any) => b.clicks - a.clicks)
      .slice(0, 10);
  }, [analytics]);

  const handleInspect = async () => {
    try {
      const result = await inspectFn({ data: { url: selectedUrl, action: "REQUEST_INDEXING" } });
      alert(`✓ Inspeção solicitada para ${selectedUrl}. Status: ${result.inspectionResult?.indexingState || 'Enviado'}`);
    } catch (error) {
      alert(`✗ Erro: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  };

  const colorMap = {
    INDEXED: "text-green-400",
    DISCOVERED: "text-blue-400",
    CRAWLED: "text-yellow-400",
    NOT_INDEXED: "text-red-400",
    UNKNOWN: "text-gray-400",
  } as const;

  const statusColor = colorMap[(status?.indexingState as keyof typeof colorMap) || "UNKNOWN"] || "text-gray-400";

  return (
    <div className="min-h-screen bg-[#0a0e14] text-slate-200 px-4 py-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <TrendingUp className="text-sd-green h-8 w-8" />
              SEO Command Center
            </h1>
            <p className="text-slate-400 mt-1">Intelligence Dashboard & Automation for Siding Depot</p>
          </div>
          
          <div className="flex items-center gap-4 bg-white/5 p-1 rounded-lg border border-white/10">
             <div className="flex items-center gap-2 px-3 py-1.5">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-medium uppercase tracking-wider text-slate-300">GSC Connected</span>
             </div>
          </div>
        </div>

        {/* URL Toolbar */}
        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 bg-[#131921] border-white/10 shadow-xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-white">Inspeção & Status em Tempo Real</CardTitle>
              <CardDescription className="text-slate-400">Verifique a indexação de qualquer rota</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    value={selectedUrl}
                    onChange={(e) => setSelectedUrl(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-md text-slate-200 focus:outline-none focus:ring-2 focus:ring-sd-green/50"
                  />
                </div>
                <Button 
                  onClick={handleInspect}
                  className="bg-sd-green hover:bg-sd-green-hover text-sd-black font-bold px-6"
                >
                  Solicitar Indexação
                </Button>
              </div>

              {status && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                    <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Status GSC</p>
                    <div className="flex items-center gap-2">
                       <span className={`text-sm font-bold ${statusColor}`}>{status.indexingState}</span>
                    </div>
                  </div>
                  <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                    <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Último Crawl</p>
                    <p className="text-sm font-medium">{status.lastCrawlTime ? new Date(status.lastCrawlTime).toLocaleDateString() : 'N/A'}</p>
                  </div>
                  <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                    <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Performance</p>
                    <p className="text-sm font-bold text-green-400">{lhMetrics?.performance || '--'}/100</p>
                  </div>
                  <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                    <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Timestamp</p>
                    <p className="text-[10px] font-mono opacity-50">{new Date(status.timestamp).toLocaleTimeString()}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-[#131921] border-white/10 shadow-xl overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-white flex items-center gap-2">
                <Gauge className="h-5 w-5 text-sd-green" />
                Vitals (Lighthouse)
              </CardTitle>
            </CardHeader>
            <CardContent>
               {lhLoading ? (
                 <div className="h-32 flex items-center justify-center">
                    <Activity className="h-8 w-8 text-sd-green animate-spin" />
                 </div>
               ) : lhMetrics && (
                 <div className="space-y-4">
                    <div className="flex justify-between items-end border-b border-white/5 pb-2">
                       <span className="text-slate-400 text-sm">LCP (Largest Contentful Paint)</span>
                       <span className="text-green-400 font-bold">{lhMetrics.metrics.lcp}</span>
                    </div>
                    <div className="flex justify-between items-end border-b border-white/5 pb-2">
                       <span className="text-slate-400 text-sm">CLS (Cumulative Layout Shift)</span>
                       <span className="text-green-400 font-bold">{lhMetrics.metrics.cls}</span>
                    </div>
                    <div className="flex justify-between items-end border-b border-white/5 pb-2">
                       <span className="text-slate-400 text-sm">TBT (Total Blocking Time)</span>
                       <span className="text-yellow-400 font-bold">{lhMetrics.metrics.tbt}</span>
                    </div>
                    <div className="pt-2">
                       <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1">
                          <span>SCORE ACESSIBILIDADE</span>
                          <span>{lhMetrics.accessibility}%</span>
                       </div>
                       <div className="w-full bg-white/10 h-1.5 rounded-full">
                          <div className="bg-sd-green h-full rounded-full" style={{ width: `${lhMetrics.accessibility}%` }} />
                       </div>
                    </div>
                 </div>
               )}
            </CardContent>
          </Card>
        </div>

        {/* Analytics Section */}
        <Tabs defaultValue="overview" className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList className="bg-white/5 border border-white/10">
              <TabsTrigger value="overview">Overview Performance</TabsTrigger>
              <TabsTrigger value="pages">Landing Pages</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-2">
              <input 
                type="date" 
                value={startDate} 
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-white/5 border border-white/10 rounded px-2 py-1 text-xs"
              />
              <span className="text-slate-500">to</span>
              <input 
                type="date" 
                value={endDate} 
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-white/5 border border-white/10 rounded px-2 py-1 text-xs"
              />
            </div>
          </div>

          <TabsContent value="overview">
            <div className="grid md:grid-cols-4 gap-4 mb-6">
               <StatCard title="Total Cliques" value={chartData.reduce((acc, curr) => acc + curr.clicks, 0)} icon={<BarChart3 className="text-sd-green" />} />
               <StatCard title="Impressões" value={chartData.reduce((acc, curr) => acc + curr.impressions, 0).toLocaleString()} icon={<Activity className="text-blue-400" />} />
               <StatCard title="CTR Médio" value={`${((chartData.reduce((acc, curr) => acc + curr.clicks, 0) / (chartData.reduce((acc, curr) => acc + curr.impressions, 0) || 1)) * 100).toFixed(1)}%`} icon={<TrendingUp className="text-yellow-400" />} />
               <StatCard title="Posição Média" value={(lpPerformance.reduce((acc, curr) => acc + curr.avgPosition, 0) / (lpPerformance.length || 1)).toFixed(1)} icon={<Search className="text-purple-400" />} />
            </div>

            <Card className="bg-[#131921] border-white/10 shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg text-white">Evolução Temporal</CardTitle>
                <CardDescription>Cliques e Impressões por dia</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#2a2f35" vertical={false} />
                      <XAxis 
                        dataKey="date" 
                        stroke="#64748b" 
                        fontSize={10} 
                        tickFormatter={(val) => new Date(val).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                      />
                      <YAxis yAxisId="left" stroke="#16a34a" fontSize={10} />
                      <YAxis yAxisId="right" orientation="right" stroke="#3b82f6" fontSize={10} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#131921', borderColor: '#2a2f35', color: '#f1f5f9' }}
                        itemStyle={{ fontSize: '12px' }}
                      />
                      <Line yAxisId="left" type="monotone" dataKey="clicks" name="Cliques" stroke="#16a34a" strokeWidth={2} dot={false} />
                      <Line yAxisId="right" type="monotone" dataKey="impressions" name="Impressões" stroke="#3b82f6" strokeWidth={2} dot={false} strokeDasharray="5 5" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pages">
            <div className="grid lg:grid-cols-2 gap-6">
               <Card className="bg-[#131921] border-white/10 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-lg text-white">Top Landing Pages (Cliques)</CardTitle>
                  </CardHeader>
                  <CardContent>
                     <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                           <BarChart data={lpPerformance} layout="vertical">
                              <XAxis type="number" hide />
                              <YAxis dataKey="pageName" type="category" width={150} stroke="#64748b" fontSize={10} />
                              <Tooltip contentStyle={{ backgroundColor: '#131921', borderColor: '#2a2f35' }} />
                              <Bar dataKey="clicks" fill="#16a34a" radius={[0, 4, 4, 0]} />
                           </BarChart>
                        </ResponsiveContainer>
                     </div>
                  </CardContent>
               </Card>

               <Card className="bg-[#131921] border-white/10 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-lg text-white">Detalhamento por Landing Page</CardTitle>
                  </CardHeader>
                  <CardContent className="overflow-x-auto">
                     <table className="w-full text-xs">
                        <thead>
                           <tr className="border-b border-white/10">
                              <th className="text-left py-3 px-2 text-slate-500 font-bold uppercase">Landing Page</th>
                              <th className="text-right py-3 px-2 text-slate-500 font-bold uppercase">Cliques</th>
                              <th className="text-right py-3 px-2 text-slate-500 font-bold uppercase">CTR</th>
                              <th className="text-right py-3 px-2 text-slate-500 font-bold uppercase">Posição</th>
                           </tr>
                        </thead>
                        <tbody>
                           {lpPerformance.map((row, idx) => (
                              <tr key={idx} className="border-b border-white/5 hover:bg-white/5">
                                 <td className="py-3 px-2 text-slate-300 font-medium">{row.pageName}</td>
                                 <td className="py-3 px-2 text-right text-white font-bold">{Math.round(row.clicks)}</td>
                                 <td className="py-3 px-2 text-right text-slate-400">{row.ctr.toFixed(1)}%</td>
                                 <td className="py-3 px-2 text-right">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${row.avgPosition < 10 ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                       {row.avgPosition.toFixed(1)}
                                    </span>
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </CardContent>
               </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string; value: string | number; icon: React.ReactNode }) {
  return (
    <Card className="bg-[#131921] border-white/10 shadow-lg">
      <CardContent className="p-4 flex items-center gap-4">
        <div className="p-3 bg-white/5 rounded-lg border border-white/5">
          {icon}
        </div>
        <div>
          <p className="text-[10px] uppercase font-bold text-slate-500 mb-0.5">{title}</p>
          <p className="text-xl font-bold text-white">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
