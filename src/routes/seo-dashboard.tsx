import { createFileRoute, redirect, useNavigate, Link, Outlet } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Gauge, 
  LogOut, 
  Download, 
  Search,
  BarChart3,
  Activity,
  TrendingUp,
  Clock,
  LayoutDashboard,
  Target,
  Split,
  Eye,
  Globe,
  Users,
  Zap,
  Bell,
  FileText,
  Calendar,
  Settings,
  ChevronRight,
  MousePointer2,
  CalendarCheck2,
  MessageSquare,
  AlertTriangle,
  RefreshCcw,
  User,
  Key,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  ExternalLink,
  ChevronDown,
  Info
} from "lucide-react";
import { toast } from "sonner";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from "recharts";
import { getDashboardMetrics } from "@/lib/dashboard.functions";
import { cn } from "@/lib/utils";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const FALLBACK_METRICS = {
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
  trafficTrend: [],
  acquisition: []
};

export const Route = createFileRoute("/seo-dashboard")({
  beforeLoad: async ({ location }) => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw redirect({
        to: "/admin/login",
        search: {
          redirect: location.href,
        },
      });
    }
  },
  loader: async () => {
     const { data: { session } } = await supabase.auth.getSession();
     if (!session) return null;
     
     const { data: profile } = await supabase.from("profiles").select("*").eq("id", session.user.id).single();
     return { session, profile };
  },
  component: SEODashboard,
});

function SEODashboard() {
  const navigate = useNavigate();
  const loaderData = Route.useLoaderData();
  const queryClient = useQueryClient();
  const [activeView, setActiveView] = useState("dashboard");
  const [sessionExists, setSessionExists] = useState(true);
  const [dateRange, setDateRange] = useState({ 
    startDate: "2026-04-13", 
    endDate: "2026-05-13" 
  });
  const [selectedPageForLeads, setSelectedPageForLeads] = useState<string | null>(null);
  const userProfile = loaderData?.profile;

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSessionExists(!!session);
    };
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSessionExists(!!session);
    });

    checkSession();
    return () => subscription.unsubscribe();
  }, []);

  const { data: metrics, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ["dashboard-metrics", activeView, dateRange.startDate, dateRange.endDate],
    queryFn: async (): Promise<any> => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Unauthorized");
      
      return getDashboardMetrics({ data: { startDate: dateRange.startDate, endDate: dateRange.endDate } });
    },
    enabled: sessionExists,
    refetchInterval: 60000,
    retry: (failureCount, error: any) => {
      if (error?.message === "Unauthorized") return false;
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    placeholderData: (previousData) => previousData || (FALLBACK_METRICS as any),
  });

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/admin/login" });
  };

  const handleExport = (format: 'csv' | 'pdf') => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 2000)),
      {
        loading: `Gerando relatório ${format.toUpperCase()}...`,
        success: `Relatório exportado com sucesso!`,
        error: `Falha ao exportar relatório.`,
      }
    );
    
    if (format === 'csv') {
      const headers = "Página,Visualizações,Tempo Médio,Bounce Rate,Conversões\n";
      const rows = metrics?.topPages?.map((p: any) => `${p.path},${p.views},${p.avgTime},${p.bounceRate}%,${p.conversions}`).join("\n");
      const csvContent = "data:text/csv;charset=utf-8," + headers + rows;
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `dashboard-metrics-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "campaigns", label: "Campanhas", icon: Target },
    { id: "ab-testing", label: "Testes A/B", icon: Split },
    { id: "visao-geral", label: "Visão Geral", icon: BarChart3 },
    { id: "site", label: "Site", icon: Globe },
    { id: "audiencia", label: "Audiência", icon: Users },
    { id: "aquisicao", label: "Aquisição", icon: TrendingUp },
    { id: "blog-analytics", label: "Analytics do Blog", icon: Zap },
    { id: "alertas", label: "Alertas", icon: Bell },
  ];

  const adminItems = [
    { id: "blog", label: "Gerenciar Blog", icon: FileText },
    { id: "calendar", label: "Calendário", icon: Calendar },
    { id: "users", label: "Usuários", icon: Users },
    { id: "integrations", label: "Integrações", icon: Settings },
    { id: "profile", label: "Meu Perfil", icon: User },
  ];

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updatingPassword, setUpdatingPassword] = useState(false);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    setUpdatingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      toast.success("Senha atualizada com sucesso!");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast.error(err.message || "Falha ao atualizar senha");
    } finally {
      setUpdatingPassword(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0e14] flex text-white font-sans">
      {/* SIDEBAR - Estilo Siding Depot */}
      <aside className="w-64 bg-[#131921] border-r border-white/10 flex flex-col h-screen sticky top-0 shrink-0">
        <div className="p-6 flex items-center gap-3">
          <div className="bg-sd-green/10 p-2 rounded-lg">
            <Gauge className="h-6 w-6 text-sd-green" />
          </div>
          <span className="font-display text-2xl tracking-tight text-white uppercase">Siding Depot <span className="text-sd-green">SD</span></span>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold transition-all",
                activeView === item.id 
                  ? "bg-sd-green text-sd-black shadow-[0_0_15px_rgba(141,198,63,0.3)]" 
                  : "text-slate-200 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </button>
          ))}

          <div className="pt-6 pb-2">
            <span className="px-3 text-[10px] font-black uppercase tracking-widest text-slate-300">Administração</span>
          </div>

          {adminItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold transition-all",
                activeView === item.id 
                  ? "bg-sd-green text-sd-black shadow-[0_0_15px_rgba(141,198,63,0.3)]" 
                  : "text-slate-200 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold text-slate-200 hover:text-white hover:bg-white/5 transition-all"
          >
            <LogOut className="h-4 w-4" />
            Sair do Painel
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* TOP BAR */}
        <header className="h-16 border-b border-white/10 bg-[#131921] px-8 flex items-center justify-between sticky top-0 z-10 shrink-0">
          <div className="flex items-center gap-4">
             <h2 className="text-lg font-bold capitalize">{activeView.replace('-', ' ')}</h2>
             <span className="text-slate-300 text-xs flex items-center gap-2">
               <Clock className="h-3 w-3" /> 
               {isFetching ? "Atualizando..." : "Sincronizado"}
               <button 
                 onClick={() => {
                   refetch();
                   toast.success("Atualizando dados...");
                 }}
                 disabled={isFetching}
                 className="p-1 hover:bg-white/5 rounded-md transition-colors disabled:opacity-50"
                 title="Atualizar agora"
               >
                 <RefreshCw className={cn("h-3 w-3", isFetching && "animate-spin")} />
               </button>
             </span>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10 group hover:border-sd-green/50 transition-colors cursor-default">
              <Calendar className="h-3 w-3 text-sd-green" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                {dateRange.startDate === "2026-04-13" && dateRange.endDate === "2026-05-13" 
                  ? "Últimos 30 dias" 
                  : `${dateRange.startDate} - ${dateRange.endDate}`}
              </span>
            </div>

            <div className="flex items-center gap-3 border-l border-white/10 pl-6">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold leading-none">{userProfile?.email}</p>
                <span className="text-[10px] font-black text-sd-green uppercase">{userProfile?.role}</span>
              </div>
              <div className="h-8 w-8 rounded-full bg-sd-green flex items-center justify-center text-sd-black font-black text-xs">
                {userProfile?.email?.substring(0, 2).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* CONTENT AREA */}
        <main className="flex-1 overflow-y-auto p-8 bg-[#0a0e14]">
          <div className="max-w-[1400px] mx-auto space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-black tracking-tight">{activeView === 'dashboard' ? 'Painel de Controle' : menuItems.find(i => i.id === activeView)?.label || adminItems.find(i => i.id === activeView)?.label}</h1>
                <p className="text-slate-200 text-sm">Acompanhe seus indicadores de performance e conversão em tempo real.</p>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline"
                  onClick={() => handleExport('csv')}
                  className="bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold h-10"
                >
                  <Download className="h-4 w-4 mr-2" /> CSV
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => handleExport('pdf')}
                  className="bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold h-10"
                >
                  <FileText className="h-4 w-4 mr-2" /> PDF
                </Button>
              </div>
            </div>

            {!sessionExists ? (
              <Card className="bg-[#131921] border-sd-green/20 p-12 text-center animate-in fade-in zoom-in duration-500">
                <div className="bg-sd-green/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertTriangle className="h-8 w-8 text-sd-green" />
                </div>
                <h3 className="text-xl font-bold mb-2">Sessão Expirada ou Desconectado</h3>
                <p className="text-slate-200 mb-8 max-w-sm mx-auto">
                  Não foi possível detectar sua sessão. Por favor, reconecte-se para visualizar as métricas.
                </p>
                <Button 
                  onClick={() => navigate({ to: "/admin/login" })}
                  className="bg-sd-green hover:bg-sd-green-hover text-sd-black font-black"
                >
                  <RefreshCcw className="h-4 w-4 mr-2" /> RECONECTAR AGORA
                </Button>
              </Card>
            ) : error ? (
              <Card className="bg-[#131921] border-red-500/20 p-12 text-center animate-in fade-in duration-500">
                <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold">Erro ao buscar métricas</h3>
                <p className="text-slate-200 mt-2">Ocorreu uma falha intermitente na conexão com o servidor.</p>
                <Button 
                  onClick={() => refetch()}
                  variant="outline"
                  className="mt-6 border-white/10 hover:bg-white/5"
                >
                  TENTAR NOVAMENTE
                </Button>
              </Card>
            ) : isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => (
                  <Card key={i} className="bg-[#131921] border-white/10 h-32 animate-pulse" />
                ))}
              </div>
            ) : (
              <>
                {activeView === "dashboard" && (
                  <div className="space-y-8 animate-in fade-in duration-500">
                    {/* KPI GRIDS */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <KPICard title="Total Conversões" value={metrics?.overview.totalConversions} icon={MousePointer2} color="sd-green" diff="+12% vs anterior" />
                      <KPICard title="Taxa Conversão" value={`${metrics?.overview.conversionRate}%`} icon={TrendingUp} color="sd-green" diff="+0.5% vs anterior" />
                      <KPICard title="Agendamentos" value={metrics?.overview.appointments} icon={CalendarCheck2} color="sd-green" diff="3 novos hoje" />
                      <KPICard title="Chat com Bia" value={metrics?.overview.chatInteractions} icon={MessageSquare} color="sd-green" diff="Interações 24h" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                      <MiniKPICard title="Total Visitantes" value="12.4k" diff="+5%" />
                      <MiniKPICard title="Únicos" value="8.9k" diff="+3%" />
                      <MiniKPICard title="Visualizações" value="32.1k" diff="+8%" />
                      <MiniKPICard title="Pág/Visita" value="2.6" diff="+1%" />
                      <MiniKPICard title="Bounce" value="42%" diff="-2%" />
                      <MiniKPICard title="Tempo Médio" value="2m 45s" diff="+15s" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <Card className="lg:col-span-2 bg-[#131921] border-white/10">
                        <CardHeader className="flex flex-row items-center justify-between pb-8">
                          <div>
                            <CardTitle className="text-lg font-bold text-white">Evolução de Tráfego</CardTitle>
                            <CardDescription className="text-xs">Visualizações e visitantes únicos nos últimos 30 dias</CardDescription>
                          </div>
                        </CardHeader>
                        <CardContent className="h-[300px] p-0 pr-6">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={metrics?.trafficTrend}>
                              <defs>
                                <linearGradient id="colorVis" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="var(--sd-green)" stopOpacity={0.3}/>
                                  <stop offset="95%" stopColor="var(--sd-green)" stopOpacity={0}/>
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                              <XAxis dataKey="date" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                              <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                              <Tooltip 
                                contentStyle={{ backgroundColor: '#131921', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                itemStyle={{ fontSize: '12px' }}
                              />
                              <Area type="monotone" dataKey="views" stroke="var(--sd-green)" strokeWidth={3} fillOpacity={1} fill="url(#colorVis)" />
                            </AreaChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>

                      <Card className="bg-[#131921] border-white/10">
                        <CardHeader>
                          <CardTitle className="text-lg font-bold text-white">Fontes de Aquisição</CardTitle>
                          <CardDescription className="text-xs">Principais canais de entrada</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center justify-center pt-0">
                           <div className="h-[200px] w-full">
                              <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                  <Pie
                                    data={metrics?.acquisition}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="visitors"
                                  >
                                    {metrics?.acquisition?.map((entry: any, index: number) => (
                                      <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                  </Pie>
                                  <Tooltip />
                                </PieChart>
                              </ResponsiveContainer>
                           </div>
                           <div className="w-full space-y-2 mt-4">
                              {metrics?.acquisition?.map((item: any, i: number) => (
                                <div key={i} className="flex items-center justify-between text-xs">
                                  <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                                    <span className="text-slate-200">{item.source}</span>
                                  </div>
                                  <span className="font-bold">{item.visitors.toLocaleString()}</span>
                                </div>
                              ))}
                           </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* VISUALIZAÇÕES E VISITANTES (série diária) */}
                    <Card className="bg-[#131921] border-white/10">
                      <CardHeader>
                        <CardTitle className="text-lg font-bold text-white">Visualizações e Visitantes</CardTitle>
                        <CardDescription className="text-xs">Série diária dentro do período selecionado</CardDescription>
                      </CardHeader>
                      <CardContent className="h-[280px] p-0 pr-6">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={metrics?.dailyTrend}>
                            <defs>
                              <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--sd-green)" stopOpacity={0.4}/>
                                <stop offset="95%" stopColor="var(--sd-green)" stopOpacity={0}/>
                              </linearGradient>
                              <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="oklch(0.65 0.18 220)" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="oklch(0.65 0.18 220)" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                            <XAxis dataKey="date" stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} dy={8} interval={3} />
                            <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                            <Tooltip contentStyle={{ backgroundColor: '#131921', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }} />
                            <Area type="monotone" dataKey="views" name="Visualizações" stroke="var(--sd-green)" strokeWidth={2} fill="url(#colorViews)" />
                            <Area type="monotone" dataKey="visitors" name="Visitantes" stroke="oklch(0.65 0.18 220)" strokeWidth={2} fill="url(#colorVisitors)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>

                    {/* DISPOSITIVOS / PÁGINAS / PAÍSES */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <Card className="bg-[#131921] border-white/10">
                        <CardHeader>
                          <CardTitle className="text-lg font-bold text-white">Dispositivos</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center pt-0">
                          <div className="h-[180px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie data={metrics?.devices} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="value">
                                  {metrics?.devices?.map((entry: any, i: number) => (
                                    <Cell key={i} fill={entry.color} />
                                  ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#131921', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }} />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                          <div className="flex gap-4 mt-3">
                            {metrics?.devices?.map((d: any, i: number) => (
                              <div key={i} className="flex items-center gap-1.5 text-xs">
                                <div className="h-2 w-2 rounded-sm" style={{ backgroundColor: d.color }} />
                                <span className="text-slate-200">{d.name}</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="lg:col-span-2 bg-[#131921] border-white/10">
                        <CardHeader className="flex flex-row items-center justify-between">
                          <CardTitle className="text-lg font-bold text-white">Ranqueamento e Performance de Páginas</CardTitle>
                          <Badge className="bg-sd-green/10 text-sd-green border-sd-green/20">Site Interno</Badge>
                        </CardHeader>
                        <CardContent>
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                              <thead>
                                <tr className="border-b border-white/5 text-slate-400 text-[10px] uppercase font-black tracking-widest">
                                  <th className="pb-3 px-2">Página</th>
                                  <th className="pb-3 text-right">Views</th>
                                  <th className="pb-3 text-right">Tempo Médio</th>
                                  <th className="pb-3 text-right">Bounce</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-white/5">
                                {metrics?.topPages?.map((p: any, i: number) => (
                                  <tr key={i} className="group hover:bg-white/5 transition-colors">
                                    <td className="py-3 px-2">
                                      <div className="flex items-center gap-2">
                                        <span className="text-sd-green font-bold w-4">#{i+1}</span>
                                        <span className="text-slate-200 truncate font-mono text-xs max-w-[200px]">{p.path}</span>
                                      </div>
                                    </td>
                                    <td className="py-3 text-right font-bold">{p.views}</td>
                                    <td className="py-3 text-right text-slate-300">{p.avgTime}</td>
                                    <td className="py-3 text-right">
                                      <span className={cn(
                                        "px-2 py-0.5 rounded text-[10px] font-bold",
                                        p.bounceRate < 30 ? "bg-green-500/10 text-green-500" : "bg-yellow-500/10 text-yellow-500"
                                      )}>
                                        {p.bounceRate}%
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-[#131921] border-white/10">
                        <CardHeader>
                          <CardTitle className="text-lg font-bold text-white">Origem de Leads</CardTitle>
                          <CardDescription className="text-xs">Rastreamento de conversão por canal</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {metrics?.acquisition?.map((item: any, i: number) => (
                            <div key={i} className="space-y-1">
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-slate-300">{item.source}</span>
                                <span className="font-bold text-sd-green">{item.leads} leads</span>
                              </div>
                              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-sd-green rounded-full" 
                                  style={{ width: `${(item.leads / 142) * 100}%` }} 
                                />
                              </div>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    </div>

                    {/* EVENTOS DE CLIQUE */}
                    <Card className="bg-[#131921] border-white/10">
                      <CardHeader>
                        <CardTitle className="text-lg font-bold text-white">Botões e Interações</CardTitle>
                        <CardDescription className="text-xs">Rastreamento de cliques em CTAs principais</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          {metrics?.clickEvents?.map((ev: any, i: number) => (
                            <div key={i} className="p-4 bg-white/5 border border-white/10 rounded-xl hover:border-sd-green/30 transition-all">
                              <p className="text-[10px] font-black uppercase text-slate-400 mb-2">{ev.button}</p>
                              <div className="flex items-end justify-between">
                                <span className="text-2xl font-black text-white">{ev.clicks}</span>
                                <div className="text-right">
                                  <p className="text-[10px] font-bold text-sd-green">CONVERSÃO</p>
                                  <p className="text-sm font-black">{ev.conversion}%</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <Card className="lg:col-span-2 bg-[#131921] border-white/10">
                        <CardHeader className="flex flex-row items-center justify-between">
                          <div>
                            <CardTitle className="text-lg font-bold text-white">Performance de Artigos</CardTitle>
                            <CardDescription className="text-xs">Ranqueamento dos melhores posts do blog</CardDescription>
                          </div>
                          <Badge className="bg-sd-green/10 text-sd-green border-sd-green/20">Blog</Badge>
                        </CardHeader>
                        <CardContent>
                           <div className="space-y-4">
                              {metrics?.blogStats?.topArticles?.map((art: any, i: number) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-lg group hover:bg-white/10 transition-colors">
                                   <div className="flex items-center gap-4">
                                      <div className="h-8 w-8 rounded bg-sd-green/10 flex items-center justify-center text-sd-green font-bold text-xs">
                                        {i + 1}
                                      </div>
                                      <div>
                                        <p className="text-sm font-bold text-white">{art.title}</p>
                                        <p className="text-[10px] text-slate-400">{art.views.toLocaleString()} views · {art.conversion}% conv.</p>
                                      </div>
                                   </div>
                                   <ChevronRight className="h-4 w-4 text-slate-600 group-hover:text-sd-green transition-colors" />
                                </div>
                              ))}
                           </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-[#131921] border-white/10">
                        <CardHeader>
                          <CardTitle className="text-lg font-bold text-white">Benchmarks do Mercado</CardTitle>
                          <CardDescription className="text-xs">Comparativo com médias do setor</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                           {metrics?.blogStats?.marketBenchmarks?.map((bench: any, i: number) => (
                             <div key={i} className="space-y-2">
                               <div className="flex justify-between text-xs">
                                 <span className="text-slate-300 font-bold">{bench.category}</span>
                                 <span className="text-sd-green font-black">{bench.value}% <span className="text-slate-500 font-normal">/ {bench.benchmark}%</span></span>
                               </div>
                               <div className="relative h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                 <div className="absolute top-0 left-0 h-full bg-sd-green rounded-full z-10" style={{ width: `${bench.value}%` }} />
                                 <div className="absolute top-0 left-[70%] h-full w-0.5 bg-white/20 z-20" title="Benchmark" />
                               </div>
                             </div>
                           ))}
                           <div className="pt-2 border-t border-white/5">
                              <p className="text-[10px] text-slate-400 italic">Benchmarks baseados em dados de mercado para o segmento de Construção/IA em 2026.</p>
                           </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <Card className="bg-[#131921] border-white/10">
                        <CardHeader>
                          <CardTitle className="text-lg font-bold text-white">Visitantes por País</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          {metrics?.countries?.map((c: any, i: number) => (
                            <div key={i} className="flex items-center justify-between text-sm py-1.5 border-b border-white/5 last:border-0">
                              <span className="text-slate-200">{c.name}</span>
                              <span className="font-bold text-white">{c.visitors}</span>
                            </div>
                          ))}
                        </CardContent>
                      </Card>

                    </div>
                  </div>
                )}

                {activeView === "profile" && (
                  <div className="max-w-2xl animate-in fade-in duration-500">
                    <Card className="bg-[#131921] border-white/10">
                      <CardHeader className="flex flex-row items-center gap-4">
                        <div className="p-3 bg-sd-green/10 rounded-xl">
                          <User className="h-6 w-6 text-sd-green" />
                        </div>
                        <div>
                          <CardTitle className="text-xl font-bold text-white">Meu Perfil</CardTitle>
                          <CardDescription>Gerencie suas informações e segurança</CardDescription>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-white/5 border border-white/10 rounded-xl">
                          <div>
                            <p className="text-[10px] font-black uppercase text-slate-300 mb-1">E-mail</p>
                            <p className="font-bold">{userProfile?.email}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-black uppercase text-slate-300 mb-1">Nível de Acesso</p>
                            <Badge className="bg-sd-green/20 text-sd-green border-sd-green/30 uppercase">{userProfile?.role}</Badge>
                          </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-white/5">
                          <h3 className="text-lg font-bold flex items-center gap-2">
                            <Key className="h-4 w-4 text-sd-green" /> Alterar Senha
                          </h3>
                          <form onSubmit={handleUpdatePassword} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <label className="text-sm text-slate-200">Nova Senha</label>
                                <Input 
                                  type="password" 
                                  className="bg-white/5 border-white/10 text-white" 
                                  placeholder="••••••••"
                                  value={newPassword}
                                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)}
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm text-slate-200">Confirmar Senha</label>
                                <Input 
                                  type="password" 
                                  className="bg-white/5 border-white/10 text-white" 
                                  placeholder="••••••••"
                                  value={confirmPassword}
                                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                                  required
                                />
                              </div>
                            </div>
                            <Button 
                              type="submit" 
                              className="bg-sd-green hover:bg-sd-green-hover text-sd-black font-bold h-11 px-8"
                              disabled={updatingPassword}
                            >
                              {updatingPassword ? "Atualizando..." : "Salvar Nova Senha"}
                            </Button>
                          </form>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {activeView === "integrations" && (
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-500">
                      <Card className="bg-[#131921] border-white/10">
                        <CardHeader className="flex flex-row items-center gap-4">
                           <div className="p-3 bg-sd-green/10 rounded-xl">
                              <Search className="h-6 w-6 text-sd-green" />
                           </div>
                           <div>
                              <CardTitle className="text-xl font-bold text-white">Google Search Console</CardTitle>
                              <CardDescription>Status de indexação e performance orgânica</CardDescription>
                           </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                           <div className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                 <Globe className="h-4 w-4 text-sd-green" />
                                 <span className="text-sm font-bold">sidingdepot.lovable.app</span>
                              </div>
                              <Badge className="bg-sd-green/20 text-sd-green border-sd-green/30">CONECTADO</Badge>
                           </div>
                           <Button className="w-full bg-sd-green hover:bg-sd-green-hover text-sd-black font-black uppercase tracking-widest text-xs h-12 rounded-xl">Configurar Propriedade</Button>
                        </CardContent>
                      </Card>

                      <Card className="bg-[#131921] border-white/10">
                        <CardHeader className="flex flex-row items-center gap-4">
                           <div className="p-3 bg-sd-green/10 rounded-xl">
                              <Activity className="h-6 w-6 text-sd-green" />
                           </div>
                           <div>
                              <CardTitle className="text-xl font-bold text-white">Google Analytics 4</CardTitle>
                              <CardDescription>Eventos, conversões e fluxo de usuários</CardDescription>
                           </div>
                        </CardHeader>
                        <CardContent className="space-y-4 text-center py-8">
                           <p className="text-slate-300 text-sm">Métricas reais integradas via Global Site Tag.</p>
                           <Button variant="outline" className="border-white/10 text-white font-bold h-10">Gerenciar Integração</Button>
                        </CardContent>
                      </Card>
                   </div>
                )}

                {/* PLACEHOLDER PARA OUTRAS ABAS */}
                {["campaigns", "ab-testing", "site", "audiencia", "blog-analytics", "blog", "calendar", "users"].includes(activeView) && (
                  <div className="flex flex-col items-center justify-center py-20 text-center animate-in zoom-in duration-300">
                    <div className="bg-sd-green/5 p-8 rounded-full mb-6">
                      <LayoutDashboard className="h-16 w-16 text-sd-green/20" />
                    </div>
                    <h3 className="text-2xl font-bold">Módulo em Desenvolvimento</h3>
                    <p className="text-slate-300 max-w-sm mt-2">Estamos portando as métricas 1:1 do Siding Depot para este módulo. Disponível em breve.</p>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

function KPICard({ title, value, icon: Icon, color, diff }: any) {
  return (
    <Card className="bg-[#131921] border-white/10 relative overflow-hidden group hover:border-sd-green/30 transition-all duration-300">
       <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
          <Icon className="h-12 w-12 text-sd-green" />
       </div>
       <CardHeader className="pb-2">
          <CardDescription className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-300">{title}</CardDescription>
          <CardTitle className="text-3xl font-black text-white">{value}</CardTitle>
       </CardHeader>
       <CardContent>
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-sd-green">
             <TrendingUp className="h-3 w-3" /> {diff}
          </div>
       </CardContent>
    </Card>
  );
}

function MiniKPICard({ title, value, diff }: any) {
  const isPositive = diff.startsWith('+');
  return (
    <div className="bg-[#131921]/50 border border-white/5 rounded-xl p-4 hover:bg-[#131921] transition-colors">
       <p className="text-[9px] font-black uppercase tracking-widest text-slate-300 mb-1">{title}</p>
       <div className="flex items-end justify-between">
          <span className="text-xl font-bold">{value}</span>
          <span className={cn("text-[10px] font-bold", isPositive ? "text-sd-green" : "text-red-400")}>{diff}</span>
       </div>
    </div>
  );
}
