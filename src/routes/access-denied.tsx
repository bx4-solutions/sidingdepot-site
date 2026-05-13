import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ShieldAlert, Home, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/access-denied")({
  component: AccessDenied,
});

function AccessDenied() {
  return (
    <div className="min-h-screen bg-[#0a0e14] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="p-6 bg-red-500/10 rounded-full animate-pulse">
            <ShieldAlert className="w-16 h-16 text-red-500" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold text-white tracking-tight">Acesso Negado</h1>
          <p className="text-slate-400 text-lg">
            Você não tem as permissões necessárias para acessar esta página.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Button asChild variant="outline" className="border-white/10 text-white hover:bg-white/5">
            <Link to="/">
              <Home className="mr-2 h-4 w-4" /> Início
            </Link>
          </Button>
          <Button asChild className="bg-sd-green hover:bg-sd-green-hover text-sd-black font-bold">
            <Link to="/admin/login">
              Fazer Login <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
