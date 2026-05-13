import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { AlertCircle, CheckCircle2, Clock, TrendingUp } from "lucide-react";
import { getIndexingStatus, inspectURL, getSearchAnalytics } from "@/lib/gsc.functions";
import { Button } from "@/components/ui/button";

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

  const { data: status, isLoading: statusLoading } = useQuery({
    queryKey: ["gsc-status", selectedUrl],
    queryFn: () => statusFn({ data: { url: selectedUrl } }),
    enabled: !!selectedUrl,
  });

  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ["gsc-analytics", startDate, endDate],
    queryFn: () => analyticsFn({ data: { startDate, endDate } }),
  });

  const handleInspect = async () => {
    try {
      const result = await inspectFn({ data: { url: selectedUrl, action: "REQUEST_INDEXING" } });
      alert(`✓ Inspeção solicitada para ${selectedUrl}`);
    } catch (error) {
      alert(`✗ Erro: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  };

  const statusColor = {
    INDEXED: "text-green-600",
    DISCOVERED: "text-blue-600",
    CRAWLED: "text-yellow-600",
    NOT_INDEXED: "text-red-600",
    UNKNOWN: "text-gray-600",
  }[status?.indexingState || "UNKNOWN"] || "text-gray-600";

  return (
    <div className="min-h-screen bg-gradient-to-b from-sd-navy to-sd-navy/95 px-4 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">SEO Dashboard</h1>
          <p className="text-white/70">
            Monitore indexação, inspeção de URLs e performance do Google Search Console
          </p>
        </div>

        {/* URL Inspection Section */}
        <div className="bg-white/10 backdrop-blur border border-white/20 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Inspeção de URL</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-white/80 mb-2">URL para inspecionar:</label>
              <input
                type="text"
                value={selectedUrl}
                onChange={(e) => setSelectedUrl(e.target.value)}
                placeholder="https://sidingdepot.lovable.app/..."
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-white/50"
              />
            </div>
            <Button
              onClick={handleInspect}
              className="bg-sd-green hover:bg-sd-green-hover text-sd-black font-semibold"
            >
              Solicitar Inspeção
            </Button>
          </div>
        </div>

        {/* Indexing Status */}
        {status && (
          <div className="bg-white/10 backdrop-blur border border-white/20 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Status de Indexação</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/5 rounded p-4">
                <div className="flex items-center gap-3 mb-2">
                  {status.indexingState === "INDEXED" ? (
                    <CheckCircle2 className="text-green-500" />
                  ) : status.indexingState === "DISCOVERED" ? (
                    <Clock className="text-blue-500" />
                  ) : (
                    <AlertCircle className="text-red-500" />
                  )}
                  <span className={`font-semibold ${statusColor}`}>
                    {status.indexingState}
                  </span>
                </div>
                <p className="text-white/70 text-sm">Estado de Indexação</p>
              </div>

              <div className="bg-white/5 rounded p-4">
                <p className="text-white/70 text-sm mb-1">Último Rastreamento:</p>
                <p className="text-white font-mono text-sm">
                  {status.lastCrawlTime
                    ? new Date(status.lastCrawlTime).toLocaleDateString("pt-BR")
                    : "Nunca"}
                </p>
              </div>

              {status.robotsTxtState && (
                <div className="bg-white/5 rounded p-4">
                  <p className="text-white/70 text-sm mb-1">Robots.txt:</p>
                  <p className="text-white font-mono text-sm">{status.robotsTxtState}</p>
                </div>
              )}

              {status.coverageState && (
                <div className="bg-white/5 rounded p-4">
                  <p className="text-white/70 text-sm mb-1">Cobertura:</p>
                  <p className="text-white font-mono text-sm">{status.coverageState}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {statusLoading && (
          <div className="text-white/70 text-center py-8">Carregando status...</div>
        )}

        {/* Search Analytics */}
        <div className="bg-white/10 backdrop-blur border border-white/20 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Search Analytics</h2>
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-white/80 mb-2 text-sm">Data inicial:</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded text-white"
              />
            </div>
            <div>
              <label className="block text-white/80 mb-2 text-sm">Data final:</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded text-white"
              />
            </div>
          </div>

          {analyticsLoading ? (
            <div className="text-white/70 text-center py-8">Carregando analytics...</div>
          ) : analytics && analytics.rows && analytics.rows.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-white/20">
                  <tr>
                    <th className="text-left py-3 px-4 text-white/80">Página</th>
                    <th className="text-left py-3 px-4 text-white/80">Query</th>
                    <th className="text-center py-3 px-4 text-white/80">Cliques</th>
                    <th className="text-center py-3 px-4 text-white/80">Impressões</th>
                    <th className="text-center py-3 px-4 text-white/80">CTR</th>
                    <th className="text-center py-3 px-4 text-white/80">Posição</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.rows.slice(0, 20).map((row: any, idx: number) => (
                    <tr key={idx} className="border-b border-white/10 hover:bg-white/5">
                      <td className="py-3 px-4 text-white/80 text-xs font-mono">
                        {row.keys?.[0] || "-"}
                      </td>
                      <td className="py-3 px-4 text-white/80 text-xs">{row.keys?.[1] || "-"}</td>
                      <td className="py-3 px-4 text-center text-white">
                        {Math.round(row.clicks || 0)}
                      </td>
                      <td className="py-3 px-4 text-center text-white">
                        {Math.round(row.impressions || 0)}
                      </td>
                      <td className="py-3 px-4 text-center text-white">
                        {((row.ctr || 0) * 100).toFixed(1)}%
                      </td>
                      <td className="py-3 px-4 text-center text-white">
                        {(row.position || 0).toFixed(1)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-white/70 text-center py-8">
              Nenhum dado disponível no período selecionado
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="bg-white/10 backdrop-blur border border-white/20 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Links Úteis</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <a
              href="https://search.google.com/search-console"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/5 hover:bg-white/10 rounded p-4 text-white hover:text-sd-green transition"
            >
              Google Search Console →
            </a>
            <a
              href="https://pagespeed.web.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/5 hover:bg-white/10 rounded p-4 text-white hover:text-sd-green transition"
            >
              PageSpeed Insights →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
