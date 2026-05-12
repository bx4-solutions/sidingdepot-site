import { useState, type ReactNode } from "react";
import { z } from "zod";
import { CheckCircle2, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SITE } from "@/data/site";
import { track } from "@/lib/track";

const schema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "Informe seu nome" })
    .max(100, { message: "Máximo 100 caracteres" }),
  phone: z
    .string()
    .trim()
    .min(7, { message: "Informe um telefone válido" })
    .max(30, { message: "Telefone muito longo" })
    .regex(/^[+\d\s().-]+$/, { message: "Telefone inválido" }),
  message: z
    .string()
    .trim()
    .max(1000, { message: "Máximo 1000 caracteres" })
    .optional()
    .or(z.literal("")),
});

type FormState = { name: string; phone: string; message: string };
type FieldErrors = Partial<Record<keyof FormState, string>>;

type Props = {
  /** What triggers the modal — typically a Button. */
  trigger: ReactNode;
  /** Source label sent to analytics + included in the lead payload. */
  source: string;
  title?: string;
  description?: string;
};

export function QuoteModal({
  trigger,
  source,
  title = "Solicitar Orçamento",
  description = "Resposta em até 24h. Sem compromisso.",
}: Props) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [values, setValues] = useState<FormState>({ name: "", phone: "", message: "" });

  function reset() {
    setValues({ name: "", phone: "", message: "" });
    setErrors({});
    setDone(false);
    setSubmitting(false);
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (next) {
      track("quote_modal_open", { source });
    } else {
      // Defer reset so the closing animation looks clean
      setTimeout(reset, 200);
    }
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
      return;
    }
    setErrors({});
    setSubmitting(true);

    const payload = { ...parsed.data, source };

    try {
      if (SITE.ghlWebhookUrl) {
        await fetch(SITE.ghlWebhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      track("quote_form_submit", { source, has_message: Boolean(payload.message) });
      setDone(true);
    } catch (err) {
      track("quote_form_error", { source });
      setErrors({ message: "Não foi possível enviar agora. Tente novamente." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        {done ? (
          <div className="py-6 text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-sd-green" />
            <DialogTitle className="mt-4 font-display text-2xl text-sd-black">
              Pedido recebido!
            </DialogTitle>
            <DialogDescription className="mt-2 text-sd-gray-text">
              Nossa equipe entra em contato em até 24h pelo telefone informado.
            </DialogDescription>
            <Button className="mt-6" onClick={() => handleOpenChange(false)}>
              Fechar
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-display text-2xl text-sd-black">{title}</DialogTitle>
              <DialogDescription>{description}</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="grid gap-4 mt-2" noValidate>
              <div className="grid gap-1.5">
                <Label htmlFor="qm-name">Nome</Label>
                <Input
                  id="qm-name"
                  name="name"
                  autoComplete="name"
                  value={values.name}
                  maxLength={100}
                  onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? "qm-name-err" : undefined}
                />
                {errors.name && (
                  <p id="qm-name-err" className="text-xs text-red-600">
                    {errors.name}
                  </p>
                )}
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="qm-phone">Telefone</Label>
                <Input
                  id="qm-phone"
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  value={values.phone}
                  maxLength={30}
                  onChange={(e) => setValues((v) => ({ ...v, phone: e.target.value }))}
                  aria-invalid={Boolean(errors.phone)}
                  aria-describedby={errors.phone ? "qm-phone-err" : undefined}
                />
                {errors.phone && (
                  <p id="qm-phone-err" className="text-xs text-red-600">
                    {errors.phone}
                  </p>
                )}
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="qm-msg">Mensagem (opcional)</Label>
                <Textarea
                  id="qm-msg"
                  name="message"
                  rows={4}
                  value={values.message}
                  maxLength={1000}
                  onChange={(e) => setValues((v) => ({ ...v, message: e.target.value }))}
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={errors.message ? "qm-msg-err" : undefined}
                />
                {errors.message && (
                  <p id="qm-msg-err" className="text-xs text-red-600">
                    {errors.message}
                  </p>
                )}
              </div>

              <p className="text-[11px] text-sd-gray-text">
                Origem: <span className="font-semibold">{source}</span>
              </p>

              <Button type="submit" size="lg" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Enviando…
                  </>
                ) : (
                  "Enviar pedido"
                )}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
