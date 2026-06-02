import { useState } from "react";
import { z } from "zod";
import { CheckCircle2, Loader2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SITE } from "@/data/site";
import { track } from "@/lib/track";

const schema = z.object({
  name: z.string().trim().min(2, { message: "Please enter your name" }).max(100),
  phone: z
    .string()
    .trim()
    .min(7, { message: "Invalid phone number" })
    .max(30)
    .regex(/^[+\d\s().-]+$/, { message: "Invalid phone number" }),
  email: z.string().trim().email({ message: "Invalid email" }).max(255),
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
  downloadUrl = "/downloads/5-mistakes-siding-georgia.pdf",
  downloadLabel = "Download Your Siding Guide",
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
      setErrors({ email: "Unable to send right now. Please try again." });
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="px-2 py-6 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-sd-green" />
        <h3 className="mt-3 font-display text-xl text-foreground uppercase tracking-tight">
          Thank you!
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Your guide is ready. Click below to download your free copy.
        </p>
        <a
          href={downloadUrl}
          target="_blank"
          rel="noopener noreferrer"
          download
          onClick={() => track("ebook_download_click", { source })}
          className="mt-5 inline-flex h-12 items-center justify-center gap-2 rounded-pill bg-sd-green px-6 text-sm font-bold text-sd-navy hover:bg-sd-green-hover transition-colors"
        >
          <Download className="h-4 w-4" /> {downloadLabel}
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-3">
      <div className="grid gap-1.5">
        <Label htmlFor="lead-name" className="text-xs font-semibold text-foreground">Full Name</Label>
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
        <Label htmlFor="lead-phone" className="text-xs font-semibold text-foreground">Phone</Label>
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
        <Label htmlFor="lead-email" className="text-xs font-semibold text-foreground">Email</Label>
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
          <><Loader2 className="h-4 w-4 animate-spin" /> Sending…</>
        ) : (
          submitLabel
        )}
      </Button>
      <p className="text-[10px] leading-snug text-muted-foreground text-center">
        By submitting, you agree to receive the guide and contacts from Siding Depot. We never share your data.
      </p>
    </form>
  );
}
