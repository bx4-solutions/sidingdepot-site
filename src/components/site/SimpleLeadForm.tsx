import { useState } from "react";
import { z } from "zod";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SITE } from "@/data/site";
import { track } from "@/lib/track";

const schema = z.object({
  name: z.string().trim().min(2, { message: "Informe seu nome" }).max(100),
  phone: z
    .string()
    .trim()
    .min(7, { message: "Telefone inválido" })
    .max(30)
    .regex(/^[+\d\s().-]+$/, { message: "Telefone inválido" }),
  email: z.string().trim().email({ message: "E-mail inválido" }).max(255),
});

type FormState = z.infer<typeof schema>;
type FieldErrors = Partial<Record<keyof FormState, string>>;

type Props = {
  source?: string;
  tag?: string;
  submitLabel?: string;
  /** URL of the PDF to offer for download in the success state. */
  downloadUrl?: string;
  /** Label for the download button shown after submission. */
  downloadLabel?: string;
  onSuccess?: () => void;
};

/**
 * Minimal contact-only lead form (name + phone + email).
 * Used for the ebook/guide download — keep the full HeroQuoteForm
 * (with services + project details) for actual quote requests.
 */
export function SimpleLeadForm({
  source = "ebook_download",
  tag = "ebook_request",
  submitLabel = "Send My Free Guide →",
  onSuccess,
}: Props) {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [values, setValues] = useState<FormState>({
    name: "",
    phone: "",
    email: "",
  });

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      const fe: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const k = issue.path[0] as keyof FormState;
        if (!fe[k]) fe[k] = issue.message;
      }
      setErrors(fe);
      track("lead_form_validation_error", { source, fields: Object.keys(fe).join(",") });
      return;
    }
    setErrors({});
    setSubmitting(true);
    const payload = {
      first_name: parsed.data.name.split(" ")[0],
      last_name: parsed.data.name.split(" ").slice(1).join(" ") || " ",
      email: parsed.data.email,
      phone: parsed.data.phone,
      source,
      tag,
      submittedAt: new Date().toISOString(),
    };
    try {
      if (SITE.ghlWebhookUrl) {
        const response = await fetch(SITE.ghlWebhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!response.ok) throw new Error("Webhook failed");
      }
      track("lead_form_submit", { source });
      setDone(true);
      onSuccess?.();
    } catch {
      track("lead_form_error", { source });
      setErrors({ email: "Não foi possível enviar agora. Tente novamente." });
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="px-2 py-6 text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-sd-green" />
        <h3 className="mt-3 font-display text-xl text-sd-black">Pronto!</h3>
        <p className="mt-2 text-sm text-sd-gray-text">Seu guia está liberado para download.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-3">
      <div className="grid gap-1.5">
        <Label htmlFor="lead-name" className="text-xs font-semibold text-sd-black">Nome completo</Label>
        <Input
          id="lead-name"
          autoComplete="name"
          value={values.name}
          onChange={(e) => update("name", e.target.value)}
          aria-invalid={Boolean(errors.name)}
          className="h-10"
        />
        {errors.name && <p className="text-[11px] text-destructive">{errors.name}</p>}
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="lead-phone" className="text-xs font-semibold text-sd-black">Telefone</Label>
        <Input
          id="lead-phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          value={values.phone}
          onChange={(e) => update("phone", e.target.value)}
          aria-invalid={Boolean(errors.phone)}
          className="h-10"
        />
        {errors.phone && <p className="text-[11px] text-destructive">{errors.phone}</p>}
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="lead-email" className="text-xs font-semibold text-sd-black">E-mail</Label>
        <Input
          id="lead-email"
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={(e) => update("email", e.target.value)}
          aria-invalid={Boolean(errors.email)}
          className="h-10"
        />
        {errors.email && <p className="text-[11px] text-destructive">{errors.email}</p>}
      </div>
      <Button type="submit" size="lg" disabled={submitting} className="mt-1">
        {submitting ? (
          <><Loader2 className="h-4 w-4 animate-spin" /> Enviando…</>
        ) : (
          submitLabel
        )}
      </Button>
      <p className="text-[10px] leading-snug text-sd-gray-text text-center">
        Ao enviar, você concorda em receber o guia e contatos da Siding Depot. Nunca compartilhamos seus dados.
      </p>
    </form>
  );
}
