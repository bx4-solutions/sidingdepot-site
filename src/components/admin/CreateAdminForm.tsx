import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { UserPlus, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CreateAdminFormProps {
  onSuccess: () => void;
}

export function CreateAdminForm({ onSuccess }: CreateAdminFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [role, setRole] = useState<"admin" | "viewer">("viewer");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // 1. Create the user in Supabase Auth via Edge Function or Admin API
      // Since we don't have a dedicated invite function yet, we use a simple approach:
      // The user will need to use "Forgot Password" to set their password 
      // OR we can use the admin API if available via a server function.
      
      // For now, we'll try to create the profile record first. 
      // Note: Real user creation usually requires service_role or invite email.
      // I will implement a call to a hypothetical 'create-admin' edge function 
      // or explain to the user that they should use the invite flow.
      
      // Better: Use supabase.auth.admin.inviteUserByEmail if available (requires service key)
      // Since we are in a client-side environment, we'll use a server function or 
      // just create the profile and let the user sign up? No, that's not secure.
      
      // Let's use the invite flow which is standard for Supabase.
      const { data, error: inviteError } = await supabase.auth.admin.inviteUserByEmail(email, {
        data: { 
          display_name: displayName,
          role: role
        },
        redirectTo: `${window.location.origin}/admin/reset-password`
      });

      if (inviteError) {
        // If the above fails because of missing permissions (expected on client),
        // we suggest using a dedicated server-side function.
        throw new Error(inviteError.message);
      }

      // 2. Log the action
      await supabase.rpc('log_admin_action', {
        p_action: 'create_user',
        p_entity_type: 'profiles',
        p_entity_id: data.user.id,
        p_details: { email, role, display_name: displayName }
      });

      setSuccess(true);
      setTimeout(() => {
        setIsOpen(false);
        setSuccess(false);
        setEmail("");
        setDisplayName("");
        setRole("viewer");
        onSuccess();
      }, 2000);

    } catch (err: any) {
      setError(err.message || "Erro ao criar administrador. Verifique se você tem permissões de super-admin.");
      console.error("Create admin error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-sd-green hover:bg-sd-green-hover text-sd-black font-bold">
          <UserPlus className="h-4 w-4 mr-2" /> Novo Usuário
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#131921] border-white/10 text-white sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-sd-green" />
            Criar Novo Administrador
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            O usuário receberá um convite por e-mail para definir sua senha.
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="py-6 flex flex-col items-center justify-center space-y-3">
            <CheckCircle2 className="h-12 w-12 text-green-500 animate-bounce" />
            <p className="text-green-400 font-bold">Convite enviado com sucesso!</p>
          </div>
        ) : (
          <form onSubmit={handleCreate} className="space-y-4 py-4">
            {error && (
              <Alert variant="destructive" className="bg-red-500/10 border-red-500/20 text-red-400">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                placeholder="Ex: João Silva"
                className="bg-white/5 border-white/10 text-white"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@exemplo.com"
                className="bg-white/5 border-white/10 text-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Nível de Acesso</Label>
              <Select value={role} onValueChange={(v: any) => setRole(v)}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="Selecione o papel" />
                </SelectTrigger>
                <SelectContent className="bg-[#131921] border-white/10 text-white">
                  <SelectItem value="admin">Administrador (Total)</SelectItem>
                  <SelectItem value="viewer">Visualizador (Apenas Leitura)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter className="pt-4">
              <Button 
                type="submit" 
                className="w-full bg-sd-green hover:bg-sd-green-hover text-sd-black font-bold"
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Enviar Convite
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
