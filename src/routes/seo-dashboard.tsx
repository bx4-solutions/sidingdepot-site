import { createFileRoute, redirect, useNavigate, Link, Outlet } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
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
  MessageSquare
} from "lucide-react";
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
  Cell
} from "recharts";
import { getDashboardMetrics } from "@/lib/dashboard.functions";
import { cn } from "@/lib/utils";

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
  const [activeView, setActiveView] = useState("dashboard");
  const userProfile = loaderData?.profile;

  const { data: metrics, isLoading } = useQuery({
    queryKey: ["dashboard-metrics", activeView],
    queryFn: () => getDashboardMetrics({ data: { startDate: "2026-04-13", endDate: "2026-05-13" } }),
  });

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/admin/login" });
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
  ];

  return (
    <div className="min-h-screen bg-[#0a0e14] flex text-white font-sans">
      {/* SIDEBAR - Estilo ClickOne */}
      <aside className="w-64 bg-[#131921] border-r border-white/10 flex flex-col h-screen sticky top-0 shrink-0">
        <div className="p-6 flex items-center gap-3">
          <div className="bg-sd-green/10 p-2 rounded-lg">
            <Gauge className="h-6 w-6 text-sd-green" />
          </div>
          <span className="font-display text-2xl tracking-tight text-white uppercase">ClickOne <span className="text-sd-green">SD</span></span>
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
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </button>
          ))}

          <div className="pt-6 pb-2">
            <span className="px-3 text-[10px] font-black uppercase tracking-widest text-slate-500">Administração</span>
          </div>

          {adminItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold transition-all",
                activeView === item.id 
                  ? "bg-sd-green text-sd-black shadow-[0_0_15px_rgba(141,198,63,0.3)]" 
                  : "text-slate-400 hover:text-white hover:bg-white/5"
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
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold text-slate-400 hover:text-white hover:bg-white/5 transition-all"
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
             <span className="text-slate-500 text-xs flex items-center gap-1"><Clock className="h-3 w-3" /> Atualizado agora</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
              <Calendar className="h-3 w-3 text-sd-green" />
              <span className="text-xs font-bold">13 abr - 13 mai</span>
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
                <p className="text-slate-400 text-sm">Acompanhe seus indicadores de performance e conversão em tempo real.</p>
              </div>
              <Button className="bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold h-10">
                <Download className="h-4 w-4 mr-2" /> EXPORTAR PDF/CSV
              </Button>
            </div>

            {isLoading ? (
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
                            <CardTitle className="text-lg font-bold">Evolução de Tráfego</CardTitle>
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
                          <CardTitle className="text-lg font-bold">Fontes de Aquisição</CardTitle>
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
                                    {metrics?.acquisition.map((entry, index) => (
                                      <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                  </Pie>
                                  <Tooltip />
                                </PieChart>
                              </ResponsiveContainer>
                           </div>
                           <div className="w-full space-y-2 mt-4">
                              {metrics?.acquisition.map((item, i) => (
                                <div key={i} className="flex items-center justify-between text-xs">
                                  <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                                    <span className="text-slate-400">{item.source}</span>
                                  </div>
                                  <span className="font-bold">{item.visitors.toLocaleString()}</span>
                                </div>
                              ))}
                           </div>
                        </CardContent>
                      </Card>
                    </div>
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
                              <CardTitle className="text-xl font-bold">Google Search Console</CardTitle>
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
                              <CardTitle className="text-xl font-bold">Google Analytics 4</CardTitle>
                              <CardDescription>Eventos, conversões e fluxo de usuários</CardDescription>
                           </div>
                        </CardHeader>
                        <CardContent className="space-y-4 text-center py-8">
                           <p className="text-slate-500 text-sm">Métricas reais integradas via Global Site Tag.</p>
                           <Button variant="outline" className="border-white/10 text-white font-bold h-10">Gerenciar Integração</Button>
                        </CardContent>
                      </Card>
                   </div>
                )}

                {/* PLACEHOLDER PARA OUTRAS ABAS */}
                {["campaigns", "ab-testing", "visao-geral", "site", "audiencia", "aquisicao", "blog-analytics", "alertas", "blog", "calendar", "users"].includes(activeView) && (
                  <div className="flex flex-col items-center justify-center py-20 text-center animate-in zoom-in duration-300">
                    <div className="bg-sd-green/5 p-8 rounded-full mb-6">
                      <LayoutDashboard className="h-16 w-16 text-sd-green/20" />
                    </div>
                    <h3 className="text-2xl font-bold">Módulo em Desenvolvimento</h3>
                    <p className="text-slate-500 max-w-sm mt-2">Estamos portando as métricas 1:1 do ClickOne para este módulo. Disponível em breve.</p>
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
          <CardDescription className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-500">{title}</CardDescription>
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
       <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">{title}</p>
       <div className="flex items-end justify-between">
          <span className="text-xl font-bold">{value}</span>
          <span className={cn("text-[10px] font-bold", isPositive ? "text-sd-green" : "text-red-400")}>{diff}</span>
       </div>
    </div>
  );
}
