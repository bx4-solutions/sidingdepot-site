import { useState } from "react";
import { z } from "zod";
import { CheckCircle2, Loader2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  city: z.string().trim().min(2, { message: "Informe sua cidade" }).max(80),
  services: z.array(z.string()).min(1, { message: "Select at least one service" }),
  message: z.string().trim().max(1000).optional().or(z.literal("")),
});

const SERVICE_OPTIONS = [
  "Siding",
  "Painting",
  "Windows",
  "Doors",
  "Gutters",
  "Decks",
  "Roof",
] as const;

type FormState = z.infer<typeof schema>;
type FieldErrors = Partial<Record<keyof FormState, string>>;

const SOURCE = "hero_inline_form";

export function HeroQuoteForm() {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [values, setValues] = useState<FormState>({
    name: "",
    phone: "",
    email: "",
    city: "",
    services: [],
    message: "",
  });

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  function toggleService(name: string) {
    setValues((v) => ({
      ...v,
      services: v.services.includes(name)
        ? v.services.filter((s) => s !== name)
        : [...v.services, name],
    }));
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
      track("quote_form_validation_error", {
        source: SOURCE,
        fields: Object.keys(fe).join(","),
      });
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      if (SITE.ghlWebhookUrl) {
        await fetch(SITE.ghlWebhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...parsed.data, source: SOURCE }),
        });
      }
      track("quote_form_submit", { source: SOURCE });
      setDone(true);
    } catch {
      track("quote_form_error", { source: SOURCE });
      setErrors({ message: "Não foi possível enviar agora. Tente novamente." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-md mx-auto rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 overflow-hidden">
      {/* Header band */}
      <div className="bg-sd-navy px-6 pt-6 pb-5 text-center text-white">
        <h2 className="font-display text-2xl sm:text-3xl leading-tight">
          Get Your <span className="text-sd-green">FREE</span> Quote
        </h2>
        <p className="mt-1.5 text-xs text-white/75">
          24h response · No obligation · Written estimate
        </p>
        <div className="mt-3 inline-flex items-center gap-1.5">
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-3.5 w-3.5 fill-sd-green text-sd-green" />
            ))}
          </div>
          <span className="text-[11px] font-semibold text-white/80">
            4.9 · 128+ reviews
          </span>
        </div>
      </div>

      {done ? (
        <div className="px-6 py-10 text-center">
          <CheckCircle2 className="mx-auto h-10 w-10 text-sd-green" />
          <h3 className="mt-3 font-display text-xl text-sd-black">
            Pedido recebido!
          </h3>
          <p className="mt-2 text-sm text-sd-gray-text">
            Nossa equipe entra em contato em até 24h.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="px-6 py-5 grid gap-3">
          <Field
            id="hero-name"
            label="Full name"
            value={values.name}
            onChange={(v) => update("name", v)}
            error={errors.name}
            autoComplete="name"
          />
          <div className="grid grid-cols-2 gap-3">
            <Field
              id="hero-phone"
              label="Phone"
              type="tel"
              inputMode="tel"
              value={values.phone}
              onChange={(v) => update("phone", v)}
              error={errors.phone}
              autoComplete="tel"
            />
            <Field
              id="hero-city"
              label="City"
              value={values.city}
              onChange={(v) => update("city", v)}
              error={errors.city}
              autoComplete="address-level2"
            />
          </div>
          <Field
            id="hero-email"
            label="Email"
            type="email"
            value={values.email}
            onChange={(v) => update("email", v)}
            error={errors.email}
            autoComplete="email"
          />
          <div className="grid gap-1.5">
            <Label htmlFor="hero-msg" className="text-xs font-semibold text-sd-black">
              Project details <span className="text-sd-gray-text font-normal">(optional)</span>
            </Label>
            <Textarea
              id="hero-msg"
              rows={3}
              maxLength={1000}
              value={values.message ?? ""}
              onChange={(e) => update("message", e.target.value)}
              className="resize-none"
            />
          </div>

          <Button type="submit" size="lg" disabled={submitting} className="mt-1">
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Sending…
              </>
            ) : (
              "Schedule FREE Quote"
            )}
          </Button>
          <p className="text-[10px] leading-snug text-sd-gray-text text-center">
            By submitting, you agree to be contacted by Siding Depot regarding
            your project. We never share your information.
          </p>
        </form>
      )}
    </div>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  error,
  type = "text",
  inputMode,
  autoComplete,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
  inputMode?: "tel" | "email" | "text";
  autoComplete?: string;
}) {
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id} className="text-xs font-semibold text-sd-black">
        {label}
      </Label>
      <Input
        id={id}
        type={type}
        inputMode={inputMode}
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-err` : undefined}
        className="h-10"
      />
      {error && (
        <p id={`${id}-err`} className="text-[11px] text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
