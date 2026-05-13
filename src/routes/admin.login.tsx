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
        // Verify if session is actually valid
        const { data: { user }, error } = await supabase.auth.getUser();
        if (user && !error) {
          navigate({ to: "/seo-dashboard" });
        } else {
          // If session exists but user call fails, clear it
          await supabase.auth.signOut();
        }
      }
    };
    checkUser();
  }, [navigate]);

  const clearSession = async () => {
    await supabase.auth.signOut();
    localStorage.clear();
    sessionStorage.clear();
    window.location.reload();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    // Basic validation
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      setError("Por favor, preencha todos os campos.");
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password: password,
      });

      if (error) {
        let userMessage = "Ocorreu um erro ao tentar entrar.";
        
        if (error.message.includes("Invalid login credentials") || error.message.includes("invalid_credentials")) {
          userMessage = "Senha incorreta ou e-mail não cadastrado. Verifique seus dados e tente novamente.";
        } else if (error.message.includes("Email not confirmed")) {
          userMessage = "E-mail ainda não confirmado. Verifique sua caixa de entrada.";
        } else if (error.message.includes("rate limit")) {
          userMessage = "Muitas tentativas. Por favor, aguarde alguns minutos.";
        } else {
          userMessage = error.message;
        }

        // Try to log failed attempt if possible
        try {
          await supabase.from('audit_logs').insert({
            action: 'login_failed',
            details: { email: trimmedEmail, reason: error.message },
            status: 'error'
          });
        } catch (logErr) {
          console.error("Failed to log audit:", logErr);
        }

        throw new Error(userMessage);
      }

      if (data.session) {
        try {
          await supabase.from('audit_logs').insert({
            action: 'login_success',
            details: { email: trimmedEmail },
            status: 'success',
            user_id: data.user.id
          });
        } catch (logErr) {
          console.error("Failed to log audit:", logErr);
        }
        
        navigate({ to: "/seo-dashboard" });
      }
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
          <CardDescription className="text-slate-200">
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
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
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
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
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
              className="flex items-center text-sm text-slate-200 hover:text-white transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para o login
            </button>
          )}
          <Link to="/" className="text-sm text-slate-300 hover:text-slate-200 mx-auto mt-4">
            Voltar para o site
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
