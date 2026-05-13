import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Gauge, 
  LogOut, 
  Download, 
  Settings,
  Search,
  BarChart3,
  Activity,
  History,
  TrendingUp,
  Clock,
  ExternalLink,
  Link2,
  Unlink
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
  const queryClient = useQueryClient();
  const loaderData = Route.useLoaderData();
  const [activeTab, setActiveTab] = useState("overview");
  const [gscSiteUrl, setGscSiteUrl] = useState("https://sidingdepot.lovable.app/");
  const [gscPropertyId, setGscPropertyId] = useState("");

  const userProfile = loaderData?.profile;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/admin/login" });
  };

  return (
    <div className="min-h-screen bg-[#0a0e14] text-white">
      <nav className="border-b border-white/10 bg-[#131921] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-sd-green/10 p-2 rounded-lg">
            <Gauge className="h-6 w-6 text-sd-green" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">SEO Command Center</h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Siding Depot Admin</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col items-end mr-2">
            <span className="text-xs font-bold text-white">{userProfile?.email}</span>
            <span className="text-[9px] font-bold text-sd-green uppercase">{userProfile?.role}</span>
          </div>
          <Button variant="ghost" size="icon" onClick={handleLogout} className="text-slate-400 hover:text-white">
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </nav>

      <main className="p-6 max-w-[1600px] mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black text-white tracking-tight">Dashboard Overview</h2>
            <p className="text-slate-400 text-sm">Performance A/B, Indexação e Leads em tempo real.</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
               onClick={() => window.print()} 
               variant="outline" 
               className="border-white/10 text-white font-bold text-xs"
            >
              <Download className="h-4 w-4 mr-2" /> EXPORTAR PDF/CSV
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6" onValueChange={setActiveTab}>
           <TabsList className="bg-[#131921] border border-white/10 p-1 h-auto flex-wrap justify-start">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="ab-testing">A/B Testing</TabsTrigger>
              <TabsTrigger value="blog">Blog Calendar</TabsTrigger>
              <TabsTrigger value="seo-audit">SEO Audit</TabsTrigger>
              <TabsTrigger value="integrations">Integrations</TabsTrigger>
              {userProfile?.role === 'admin' && <TabsTrigger value="users">Users</TabsTrigger>}
           </TabsList>

           <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                 <Card className="bg-[#131921] border-white/10">
                    <CardHeader className="pb-2">
                       <CardDescription className="text-[10px] font-bold uppercase text-slate-500">Total Views (30d)</CardDescription>
                       <CardTitle className="text-2xl font-black text-white">12.4k</CardTitle>
                    </CardHeader>
                 </Card>
              </div>
           </TabsContent>
           
           <TabsContent value="integrations">
              <div className="grid md:grid-cols-2 gap-6">
                 <Card className="bg-[#131921] border-white/10">
                    <CardHeader>
                       <div className="flex items-center gap-2">
                          <Search className="h-5 w-5 text-sd-green" />
                          <CardTitle className="text-lg">Google Search Console</CardTitle>
                       </div>
                       <CardDescription>Conecte sua conta GSC</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                       <input 
                         type="text" 
                         value={gscSiteUrl}
                         onChange={(e) => setGscSiteUrl(e.target.value)}
                         className="w-full p-2 bg-white/5 border border-white/10 rounded"
                       />
                       <Button className="w-full bg-sd-green text-sd-black font-bold">CONECTAR GSC</Button>
                    </CardContent>
                 </Card>
              </div>
           </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
