import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lock, Loader2, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/admin/reset-password")({
  component: ResetPassword,
});

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we have a session (user clicked reset link)
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        // If no session, they might have landed here accidentally or link expired
        setError("Sessão de recuperação inválida ou expirada.");
      }
    };
    checkSession();
  }, []);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Falha ao atualizar senha");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0e14] flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-[#131921] border-white/10 text-white">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Nova Senha</CardTitle>
          <CardDescription className="text-slate-400">
            Crie uma nova senha segura para sua conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          {success ? (
            <div className="space-y-6 py-4 text-center">
              <div className="flex justify-center">
                <div className="bg-green-500/10 p-3 rounded-full">
                  <CheckCircle2 className="h-12 w-12 text-green-500" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">Senha Redefinida!</h3>
                <p className="text-slate-400">Sua senha foi atualizada com sucesso. Você já pode acessar o painel.</p>
              </div>
              <Button 
                onClick={() => navigate({ to: "/admin/login" })}
                className="w-full bg-sd-green hover:bg-sd-green-hover text-sd-black font-bold"
              >
                Voltar ao Login
              </Button>
            </div>
          ) : (
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              {error && (
                <Alert variant="destructive" className="bg-red-500/10 border-red-500/20 text-red-400">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="password">Nova Senha</Label>
                <Input
                  id="password"
                  type="password"
                  className="bg-white/5 border-white/10 text-white"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  className="bg-white/5 border-white/10 text-white"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-sd-green hover:bg-sd-green-hover text-sd-black font-bold"
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Atualizar Senha
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
