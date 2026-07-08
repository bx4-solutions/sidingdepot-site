import { createFileRoute, redirect, Link } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Loader2, UserPlus, ArrowLeft, Copy, Eye, EyeOff, Users } from "lucide-react";

export const Route = createFileRoute("/admin/users")({
  beforeLoad: async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) throw redirect({ to: "/admin/login" });
  },
  component: AdminUsers,
});

function AdminUsers() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<{ name: string; email: string; password: string } | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const generatePassword = () => {
    const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$";
    let pwd = "";
    for (let i = 0; i < 12; i++) pwd += chars[Math.floor(Math.random() * chars.length)];
    setPassword(pwd);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/create-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create user");
      setSuccess({ name, email, password });
      setName("");
      setEmail("");
      setPassword("");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const copyCredentials = () => {
    if (!success) return;
    const text = `Olá ${success.name}!\n\nVocê foi convidado para acessar o painel admin do Siding Depot.\n\nURL: ${window.location.origin}/admin/login\nEmail: ${success.email}\nSenha: ${success.password}\n\nAlteremos sua senha após o primeiro acesso.`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 flex items-center gap-4">
          <Link
            to="/admin/dashboard"
            className="text-sd-gray-text hover:text-sd-black transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-sd-navy flex items-center gap-2">
              <Users className="h-7 w-7" /> User Management
            </h1>
            <p className="text-sd-gray-text mt-1">Create admin access for your team members.</p>
          </div>
        </div>

        {success && (
          <Card className="mb-6 border-sd-green/30 bg-sd-green/5 shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-sd-green shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-bold text-sd-black">Usuário criado com sucesso!</p>
                  <p className="text-sm text-sd-gray-text mt-1">
                    Compartilhe as credenciais abaixo com <strong>{success.name}</strong>.
                  </p>
                  <div className="mt-4 p-4 bg-white rounded-lg border border-sd-green/20 font-mono text-sm space-y-1.5">
                    <p>
                      <span className="text-sd-gray-text text-xs uppercase tracking-wider">
                        URL
                      </span>
                      <br />
                      {window.location.origin}/admin/login
                    </p>
                    <p>
                      <span className="text-sd-gray-text text-xs uppercase tracking-wider">
                        Email
                      </span>
                      <br />
                      {success.email}
                    </p>
                    <p>
                      <span className="text-sd-gray-text text-xs uppercase tracking-wider">
                        Senha
                      </span>
                      <br />
                      {success.password}
                    </p>
                  </div>
                  <Button
                    onClick={copyCredentials}
                    variant="outline"
                    size="sm"
                    className="mt-3 rounded-full"
                  >
                    {copied ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 mr-2 text-sd-green" /> Copiado!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-2" /> Copiar para enviar
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="bg-white border-none shadow-md ring-1 ring-black/5">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="text-lg font-bold text-sd-navy flex items-center gap-2">
              <UserPlus className="h-5 w-5" /> Criar Novo Usuário
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-1.5">
                <Label
                  htmlFor="u-name"
                  className="text-xs font-bold uppercase tracking-wider text-sd-navy"
                >
                  Nome Completo *
                </Label>
                <Input
                  id="u-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="João Silva"
                  required
                  className="h-11"
                />
              </div>

              <div className="grid gap-1.5">
                <Label
                  htmlFor="u-email"
                  className="text-xs font-bold uppercase tracking-wider text-sd-navy"
                >
                  Email *
                </Label>
                <Input
                  id="u-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="joao@email.com"
                  required
                  className="h-11"
                />
              </div>

              <div className="grid gap-1.5">
                <Label
                  htmlFor="u-password"
                  className="text-xs font-bold uppercase tracking-wider text-sd-navy"
                >
                  Senha *
                </Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      id="u-password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Mínimo 8 caracteres"
                      required
                      minLength={8}
                      className="h-11 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-sd-gray-text hover:text-sd-black"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={generatePassword}
                    className="h-11 rounded-lg text-xs whitespace-nowrap"
                  >
                    Gerar senha
                  </Button>
                </div>
                <p className="text-[11px] text-sd-gray-text">
                  Clique em "Gerar senha" para criar uma senha segura automaticamente.
                </p>
              </div>

              {error && (
                <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-lg font-medium">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-sd-green text-sd-black font-bold hover:bg-sd-green-hover"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" /> Criando usuário…
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-2" /> Criar Usuário e Gerar Credenciais
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-sd-gray-text mt-6">
          O usuário criado poderá fazer login em{" "}
          <span className="font-mono text-sd-navy">/admin/login</span>.
        </p>
      </div>
    </div>
  );
}
