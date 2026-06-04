import { useState } from "react";
import { z } from "zod";
import { CheckCircle2, Loader2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SITE } from "@/data/site";
import { track } from "@/lib/track";

const schema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "Please enter your full name (minimum 2 characters)" })
    .max(100, { message: "Name is too long (maximum 100 characters)" }),
  phone: z
    .string()
    .trim()
    .min(7, { message: "Please enter a valid phone number" })
    .max(30, { message: "Phone number is too long" })
    .regex(/^[+\d\s().-]+$/, {
      message: "Please use only numbers, spaces, and the characters + ( ) . -",
    }),
  city: z
    .string()
    .trim()
    .min(2, { message: "Please enter your city" })
    .max(80, { message: "City name is too long" }),
});

type FormState = z.infer<typeof schema>;
type FieldErrors = Partial<Record<keyof FormState, string>>;

type HeroQuoteFormProps = {
  /** Tracking source label sent to analytics + GHL payload. */
  source?: string;
  /** Optional override for the lead tag sent to GHL. */
  tag?: string;
  /** Hide outer card chrome (header band + ring) — useful inside dialogs. */
  bare?: boolean;
  /** Optional callback fired after successful submission. */
  onSuccess?: () => void;
};

export function HeroQuoteForm({
  source = "hero_inline_form",
  tag = "hero_quote_request",
  bare = false,
  onSuccess,
}: HeroQuoteFormProps = {}) {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState<FieldErrors & { general?: string }>({});
  const [values, setValues] = useState<FormState>({
    name: "",
    phone: "",
    city: "",
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
      track("quote_form_validation_error", {
        source: source,
        fields: Object.keys(fe).join(","),
      });
      return;
    }
    setErrors({});
    setSubmitting(true);
    const payload = {
      first_name: parsed.data.name.split(" ")[0],
      last_name: parsed.data.name.split(" ").slice(1).join(" ") || " ",
      phone: parsed.data.phone,
      city: parsed.data.city,
      source: source,
      tag: tag,
      submittedAt: new Date().toISOString(),
    };
    if (import.meta.env.DEV) {
      console.info("[HeroQuoteForm] submit payload", payload);
    }
    try {
      if (SITE.ghlWebhookUrl) {
        const response = await fetch(SITE.ghlWebhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error("Webhook failed");
      }
      track("quote_form_submit", {
        source: source,
      });
      setDone(true);
      onSuccess?.();
    } catch {
      track("quote_form_error", { source: source });
      setErrors({ general: "Unable to send right now. Please try again." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className={
        bare
          ? "w-full"
          : "w-full max-w-md mx-auto rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 overflow-hidden"
      }
    >
      {!bare && (
        <div className="bg-sd-black px-6 pt-6 pb-5 text-center text-white">
          <h2 className="font-display text-2xl sm:text-3xl leading-tight">
            Get Your Free <span className="text-sd-green">James Hardie</span> Quote
          </h2>
          <p className="mt-1.5 text-xs text-white/75">
            Response within 24h · No pressure · Written estimate
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
      )}

      {done ? (
        <div className="px-6 py-10 text-center">
          <CheckCircle2 className="mx-auto h-10 w-10 text-sd-green" />
          <h3 className="mt-3 font-display text-xl text-sd-black">
            Request Received!
          </h3>
          <p className="mt-2 text-sm text-sd-gray-text">
            Our team will contact you within 24 hours.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className={bare ? "grid gap-3" : "px-6 py-5 grid gap-3"}>
          <Field
            id="hero-name"
            label="Full name"
            value={values.name}
            onChange={(v) => update("name", v)}
            error={errors.name}
            autoComplete="name"
            dark={bare}
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
              dark={bare}
            />
            <Field
              id="hero-city"
              label="City"
              value={values.city}
              onChange={(v) => update("city", v)}
              error={errors.city}
              autoComplete="address-level2"
              dark={bare}
            />
          </div>

          {errors.general && (
            <p className="text-[11px] text-destructive text-center">{errors.general}</p>
          )}

          <Button type="submit" size="lg" disabled={submitting} className="mt-1">
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Sending…
              </>
            ) : (
              "Get My Free Quote →"
            )}
          </Button>
          <p className={`text-[10px] leading-snug text-center ${bare ? "text-white/60" : "text-sd-gray-text"}`}>
            🔒 We respond within 24 hours. No pressure, ever.
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
  dark = false,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
  inputMode?: "tel" | "email" | "text";
  autoComplete?: string;
  dark?: boolean;
}) {
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id} className={`text-xs font-semibold ${dark ? "text-white" : "text-sd-black"}`}>
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
        className={`h-10 ${dark ? "bg-white/10 border-white/20 text-white placeholder:text-white/50" : ""}`}
      />
      {error && (
        <p id={`${id}-err`} className="text-[11px] text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
