import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, Loader2 } from "lucide-react";

export function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingLink, setCheckingLink] = useState(true);
  const [recoveryReady, setRecoveryReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    const markReadyFromUrlOrSession = async () => {
      const url = new URL(window.location.href);
      const code = url.searchParams.get("code");
      const hashParams = new URLSearchParams(url.hash.replace(/^#/, ""));
      const hasRecoveryHash = hashParams.get("type") === "recovery" || hashParams.has("access_token");

      try {
        if (code) {
          await supabase.auth.exchangeCodeForSession(code);
          window.history.replaceState({}, document.title, url.pathname);
        }

        const { data: { session } } = await supabase.auth.getSession();
        if (!mounted) return;

        if (session || hasRecoveryHash) {
          setRecoveryReady(true);
          setError(null);
        } else {
          setError("Link de recuperação inválido ou expirado. Solicite um novo link pelo login.");
        }
      } catch (err: any) {
        if (mounted) {
          setError(err?.message || "Não foi possível validar o link de recuperação.");
        }
      } finally {
        if (mounted) setCheckingLink(false);
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || session) {
        setRecoveryReady(true);
        setError(null);
        setCheckingLink(false);
      }
    });

    markReadyFromUrlOrSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      await supabase.auth.signOut();
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
          <CardDescription className="text-slate-200">
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
                <h3 className="text-xl font-bold text-white">Senha redefinida</h3>
                <p className="text-slate-200">Sua senha foi atualizada. Entre novamente com a nova senha.</p>
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

              {checkingLink && (
                <Alert className="bg-white/5 border-white/10 text-slate-200">
                  <AlertDescription>Validando link de recuperação...</AlertDescription>
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
                  disabled={!recoveryReady || loading}
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
                  disabled={!recoveryReady || loading}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-sd-green hover:bg-sd-green-hover text-sd-black font-bold"
                disabled={loading || !recoveryReady}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Atualizar Senha
              </Button>

              {!recoveryReady && !checkingLink && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate({ to: "/admin/login" })}
                  className="w-full border-white/10 hover:bg-white/5 text-white"
                >
                  Solicitar novo link
                </Button>
              )}
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}