import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lock, Mail, Loader2, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/admin/login")({
  component: AdminLogin,
});

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [mode, setMode] = useState<"login" | "reset">("login");
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate({ to: "/seo-dashboard" });
      }
    };
    checkUser();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        let userMessage = "Ocorreu um erro ao tentar entrar.";
        
        if (error.message.includes("Invalid login credentials") || error.message.includes("invalid_credentials")) {
          // Check if user exists to distinguish between user-not-found and wrong-password
          // Note: In secure auth, we shouldn't reveal if user exists, but user specifically asked for it.
          // However, Supabase doesn't reveal this easily via signInWithPassword.
          // We can use a custom error mapping:
          userMessage = "Senha incorreta ou e-mail não cadastrado.";
        } else if (error.message.includes("Email not confirmed")) {
          userMessage = "E-mail ainda não confirmado.";
        } else if (error.message.includes("rate limit")) {
          userMessage = "Muitas tentativas. Tente novamente mais tarde.";
        } else {
          userMessage = error.message;
        }

        await supabase.rpc('log_admin_action', {
          p_action: 'login_failed',
          p_details: { email, reason: error.message },
          p_status: 'error'
        });
        throw new Error(userMessage);
      }

      await supabase.rpc('log_admin_action', {
        p_action: 'login_success',
        p_details: { email }
      });
      
      navigate({ to: "/seo-dashboard" });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/admin/reset-password`,
      });

      if (error) throw error;
      setMessage("Link de recuperação enviado para seu e-mail.");
    } catch (err: any) {
      setError(err.message || "Falha ao enviar e-mail de recuperação");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0e14] flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-[#131921] border-white/10 text-white">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-sd-green/10 rounded-full">
              <Lock className="w-8 h-8 text-sd-green" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">
            {mode === "login" ? "Acesso Administrativo" : "Recuperar Senha"}
          </CardTitle>
          <CardDescription className="text-slate-400">
            {mode === "login" 
              ? "Entre com suas credenciais para gerenciar o SEO" 
              : "Enviaremos um link para redefinir sua senha"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={mode === "login" ? handleLogin : handleResetPassword} className="space-y-4">
            {error && (
              <Alert variant="destructive" className="bg-red-500/10 border-red-500/20 text-red-400">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {message && (
              <Alert className="bg-green-500/10 border-green-500/20 text-green-400">
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@sidingdepot.com"
                  className="bg-white/5 border-white/10 pl-10 text-white"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {mode === "login" && (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="password">Senha</Label>
                  <button 
                    type="button" 
                    onClick={() => setMode("reset")}
                    className="text-xs text-sd-green hover:underline"
                  >
                    Esqueceu a senha?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <Input
                    id="password"
                    type="password"
                    className="bg-white/5 border-white/10 pl-10 text-white"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-sd-green hover:bg-sd-green-hover text-sd-black font-bold"
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {mode === "login" ? "Entrar" : "Enviar Link"}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          {mode === "reset" && (
            <button 
              onClick={() => setMode("login")}
              className="flex items-center text-sm text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para o login
            </button>
          )}
          <Link to="/" className="text-sm text-slate-500 hover:text-slate-400 mx-auto mt-4">
            Voltar para o site
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
