import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SITE } from "@/data/site";
import { track, trackLeadSubmit, trackContactPageView } from "@/lib/track";

const searchSchema = z.object({
  source: z.string().max(80).optional(),
  city: z.string().max(80).optional(),
  service: z.string().max(80).optional(),
});

export const Route = createFileRoute("/contact")({
  validateSearch: (s) => searchSchema.parse(s),
  head: () => ({
    meta: [
      { title: "Solicitar Orçamento — Siding Depot" },
      {
        name: "description",
        content:
          "Peça seu orçamento gratuito de siding, pintura, janelas, decks ou roofing em North Atlanta. Resposta em 24h.",
      },
      { property: "og:title", content: "Solicitar Orçamento — Siding Depot" },
      { property: "og:description", content: "Peça seu orçamento gratuito de siding, pintura, janelas, decks ou roofing em North Atlanta. Resposta em 24h." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/43cab0b0-cb06-42f1-a067-d5f0523e2835" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Solicitar Orçamento — Siding Depot" },
      { name: "twitter:description", content: "Peça seu orçamento gratuito de siding, pintura, janelas, decks ou roofing em North Atlanta. Resposta em 24h." },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/43cab0b0-cb06-42f1-a067-d5f0523e2835" },
    ],
  }),
  component: ContactPage,
});

const formSchema = z.object({
  name: z.string().trim().min(2, "Informe seu nome").max(100),
  email: z.string().trim().email("Email inválido").max(255),
  phone: z
    .string()
    .trim()
    .min(7, "Telefone inválido")
    .max(30)
    .regex(/^[+\d\s().-]+$/, "Telefone inválido"),
  source: z.string().trim().max(80),
  message: z.string().trim().max(1000).optional().or(z.literal("")),
});

type FormState = z.infer<typeof formSchema>;
type FieldErrors = Partial<Record<keyof FormState, string>>;

function ContactPage() {
  const search = Route.useSearch();
  const [values, setValues] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    source: search.source ?? "",
    message: "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  // Track page view on mount
  useEffect(() => {
    trackContactPageView();
  }, []);

  // Keep "origem" in sync if the user lands with ?source=...
  useEffect(() => {
    if (search.source) {
      setValues((v) => ({ ...v, source: search.source ?? "" }));
    }
  }, [search.source]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = formSchema.safeParse(values);
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
    try {
      if (SITE.ghlWebhookUrl) {
        // Prepare data for GHL
        const payload = {
          first_name: parsed.data.name.split(" ")[0],
          last_name: parsed.data.name.split(" ").slice(1).join(" ") || " ",
          email: parsed.data.email,
          phone: parsed.data.phone,
          source: parsed.data.source || "contact_page",
          message: parsed.data.message,
          location: search.city || "North Atlanta",
          service_requested: search.service || "General Inquiry",
        };

        const response = await fetch(SITE.ghlWebhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error("Webhook failed");
      }
      trackLeadSubmit({
        service: search.service || "general",
        phone: parsed.data.phone,
        source: parsed.data.source || "contact_page",
      });
      setDone(true);
    } catch {
      track("quote_form_error", { source: parsed.data.source || "contact_page" });
      setErrors({ message: "Ocorreu um erro ao enviar. Por favor, tente novamente ou ligue para nós." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="py-hero-compact lg:py-hero-compact-lg bg-sd-gray-bg min-h-[70vh]">
      <div className="mx-auto max-w-2xl px-4 lg:px-8">
        <div className="text-center">
          <span className="inline-block text-xs font-bold tracking-[0.12em] uppercase text-sd-green-text bg-sd-green-pale px-3 py-1 rounded">
            Free Quote · 24h Response
          </span>
          <h1 className="mt-4 font-display text-4xl sm:text-5xl text-sd-black">
            Solicitar Orçamento
          </h1>
          <p className="mt-3 text-sd-gray-text">
            Conte sobre seu projeto e respondemos em até 24h com uma estimativa por escrito.
          </p>
        </div>

        <div className="mt-10 rounded-2xl bg-white p-6 sm:p-8 shadow-lg ring-1 ring-black/5">
          {done ? (
            <div className="py-8 text-center">
              <CheckCircle2 className="mx-auto h-14 w-14 text-sd-green" />
              <h2 className="mt-4 font-display text-2xl text-sd-black">Pedido recebido!</h2>
              <p className="mt-2 text-sd-gray-text">
                Entramos em contato em até 24h pelo telefone informado.
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="grid gap-4" noValidate>
              <div className="grid gap-1.5">
                <Label htmlFor="c-name">Nome</Label>
                <Input
                  id="c-name"
                  name="name"
                  autoComplete="name"
                  value={values.name}
                  maxLength={100}
                  onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
                  aria-invalid={Boolean(errors.name)}
                />
                {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="grid gap-1.5">
                  <Label htmlFor="c-email">Email</Label>
                  <Input
                    id="c-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={values.email}
                    maxLength={255}
                    onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
                    aria-invalid={Boolean(errors.email)}
                  />
                  {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="c-phone">Telefone</Label>
                  <Input
                    id="c-phone"
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    value={values.phone}
                    maxLength={30}
                    onChange={(e) => setValues((v) => ({ ...v, phone: e.target.value }))}
                    aria-invalid={Boolean(errors.phone)}
                  />
                  {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
                </div>
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="c-source">Origem</Label>
                <Input
                  id="c-source"
                  name="source"
                  value={values.source}
                  maxLength={80}
                  onChange={(e) => setValues((v) => ({ ...v, source: e.target.value }))}
                  aria-invalid={Boolean(errors.source)}
                  placeholder="Ex.: Slider antes/depois"
                  readOnly={Boolean(search.source)}
                  className={search.source ? "bg-sd-gray-bg" : undefined}
                />
                {search.source && (
                  <p className="text-[11px] text-sd-gray-text">
                    Preenchido automaticamente pelo link.
                  </p>
                )}
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="c-msg">Mensagem (opcional)</Label>
                <Textarea
                  id="c-msg"
                  name="message"
                  rows={5}
                  value={values.message ?? ""}
                  maxLength={1000}
                  onChange={(e) => setValues((v) => ({ ...v, message: e.target.value }))}
                />
                {errors.message && <p className="text-xs text-destructive">{errors.message}</p>}
              </div>

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
          )}
        </div>
      </div>
    </section>
  );
}
