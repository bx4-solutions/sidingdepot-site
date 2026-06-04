import { useState } from "react";
import { z } from "zod";
import { CheckCircle2, Loader2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { SITE } from "@/data/site";
import { track } from "@/lib/track";
import { supabase } from "@/integrations/supabase/client";

// Standard schema (for other pages)
const standardSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name").max(100),
  phone: z.string().trim().min(7, "Please enter a valid phone number").max(30),
  city: z.string().trim().min(2, "Please enter your city").max(80),
});

// Homepage specific schema
const homepageSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name").max(100),
  phone: z.string().trim().min(7, "Please enter a valid phone number").max(30),
  email: z.string().trim().email("Please enter a valid email address"),
  city: z.string().trim().min(2, "Please enter your city").max(80),
  services: z.array(z.string()).min(1, "Please select at least one service").max(20),
  details: z.string().max(2000).optional(),
  consent: z.literal(true, {
    errorMap: () => ({ message: "Consent is required" }),
  }),
});

type HeroQuoteFormProps = {
  source?: string;
  tag?: string;
  bare?: boolean;
  onSuccess?: () => void;
  isHomepage?: boolean;
};

const SERVICES_OPTIONS = [
  "Siding",
  "Painting",
  "Windows",
  "Doors",
  "Gutters",
  "Decks",
  "Roof",
  "Dumpster Rental",
] as const;

export function HeroQuoteForm({
  source = "hero_inline_form",
  tag = "hero_quote_request",
  bare = false,
  onSuccess,
  isHomepage = false,
}: HeroQuoteFormProps = {}) {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [values, setValues] = useState<any>(
    isHomepage
      ? { name: "", phone: "", email: "", city: "", services: [] as string[], details: "", consent: false }
      : { name: "", phone: "", city: "" }
  );

  function toggleService(name: string, checked: boolean) {
    setValues((v: any) => {
      const current: string[] = Array.isArray(v.services) ? v.services : [];
      const next = checked ? [...current, name] : current.filter((s) => s !== name);
      return { ...v, services: next };
    });
  }

  function update(key: string, value: any) {
    setValues((v: any) => ({ ...v, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const schema = isHomepage ? homepageSchema : standardSchema;
    const parsed = schema.safeParse(values);
    
    if (!parsed.success) {
      const fe: any = {};
      for (const issue of parsed.error.issues) {
        const k = issue.path[0] as string;
        if (!fe[k]) fe[k] = issue.message;
      }
      setErrors(fe);
      track("quote_form_validation_error", { source, fields: Object.keys(fe).join(",") });
      return;
    }
    
    setErrors({});
    setSubmitting(true);
    
    const data = parsed.data as any;
    const services: string[] = Array.isArray(data.services) ? data.services : [];
    const payload = {
      first_name: data.name.split(" ")[0],
      last_name: data.name.split(" ").slice(1).join(" ") || " ",
      phone: data.phone,
      city: data.city,
      email: data.email || "",
      services,
      service: services.join(", "),
      details: data.details || "",
      source: source,
      tag: tag,
      submittedAt: new Date().toISOString(),
    };

    try {
      // Save lead in the customer record (Lovable Cloud database)
      if (isHomepage) {
        const { error: dbError } = await supabase.from("leads").insert({
          name: data.name,
          phone: data.phone,
          email: data.email || null,
          city: data.city,
          services,
          details: data.details || null,
          consent: true,
          source,
          tag,
        });
        if (dbError) throw dbError;
      }

      if (SITE.ghlWebhookUrl) {
        const response = await fetch(SITE.ghlWebhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!response.ok) throw new Error("Webhook failed");
      }
      track("quote_form_submit", { source });
      setDone(true);
      onSuccess?.();
    } catch {
      track("quote_form_error", { source });
      setErrors({ general: "Unable to send right now. Please try again." });
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className={`${bare ? "" : "bg-white rounded-2xl shadow-2xl ring-1 ring-black/5"} px-6 py-10 text-center`}>
        <CheckCircle2 className="mx-auto h-10 w-10 text-sd-green" />
        <h3 className="mt-3 font-display text-xl text-sd-black">Request Received!</h3>
        <p className="mt-2 text-sm text-sd-gray-text">Our team will contact you within 24 hours.</p>
      </div>
    );
  }

  if (isHomepage) {
    return (
      <div className={bare ? "w-full" : "w-full max-w-md mx-auto rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 overflow-hidden"}>
        {!bare && (
          <div className="bg-sd-navy px-6 pt-6 pb-5 text-center text-white border-b border-white/10">
            <h2 className="font-display text-2xl sm:text-3xl leading-tight">Get Your FREE Quote Today</h2>
            <p className="mt-1.5 text-xs text-white/75">
              A specialist will contact you within 24 hours to schedule your free in-person estimate.
            </p>
            <div className="mt-4 text-[10px] font-bold text-sd-green uppercase tracking-wider flex items-center justify-center gap-1.5">
              ⭐ 4.9 Google Rating · 1,500+ Homes Transformed · James Hardie Elite Preferred
            </div>
          </div>
        )}
        <form onSubmit={handleSubmit} noValidate className={bare ? "grid gap-3" : "px-6 py-5 grid gap-3.5"}>
          <Field id="hero-name" label="Full Name" placeholder="Your full name" value={values.name} onChange={(v: string) => update("name", v)} error={errors.name} required />
          <div className="grid grid-cols-2 gap-3">
            <Field id="hero-phone" label="Phone" type="tel" placeholder="(678) 000-0000" value={values.phone} onChange={(v: string) => update("phone", v)} error={errors.phone} required />
            <Field id="hero-email" label="Email" type="email" placeholder="your@email.com" value={values.email} onChange={(v: string) => update("email", v)} error={errors.email} required />
          </div>
          <Field id="hero-city" label="City" placeholder="Your city" value={values.city} onChange={(v: string) => update("city", v)} error={errors.city} required />

          <div className="grid gap-2">
            <Label className="text-xs font-semibold text-sd-black">
              Services<span className="text-destructive ml-0.5">*</span>
            </Label>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {SERVICES_OPTIONS.map((opt) => {
                const id = `hero-svc-${opt.replace(/\s+/g, "-").toLowerCase()}`;
                const checked = (values.services as string[])?.includes(opt) ?? false;
                return (
                  <label key={opt} htmlFor={id} className="flex items-center gap-2 cursor-pointer text-sm text-sd-black">
                    <Checkbox
                      id={id}
                      checked={checked}
                      onCheckedChange={(v: boolean) => toggleService(opt, Boolean(v))}
                    />
                    <span>{opt}</span>
                  </label>
                );
              })}
            </div>
            {errors.services && <p className="text-[11px] text-destructive">{errors.services}</p>}
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="hero-details" className="text-xs font-semibold text-sd-black">Tell us about your project (optional)</Label>
            <Textarea id="hero-details" placeholder="Describe your project, home size, timeline, or any questions..." value={values.details} onChange={(e) => update("details", e.target.value)} className="resize-none min-h-[80px]" rows={3} />
          </div>
          <div className="flex items-start gap-2.5 mt-1">
            <Checkbox id="hero-consent" checked={values.consent} onCheckedChange={(v: boolean) => update("consent", v)} className="mt-0.5" />
            <div className="grid gap-1">
              <Label htmlFor="hero-consent" className="text-[11px] leading-snug font-normal text-sd-gray-text cursor-pointer">
                By checking this box, I agree to receive SMS text messages and emails from Siding Depot LLC. Message frequency varies. Standard message and data rates may apply. Text STOP to opt out at anytime.
              </Label>
              {errors.consent && <p className="text-[11px] text-destructive leading-none">{errors.consent}</p>}
            </div>
          </div>
          {errors.general && <p className="text-[11px] text-destructive text-center">{errors.general}</p>}
          <Button type="submit" size="lg" disabled={submitting} className="mt-2 w-full font-bold bg-sd-green text-sd-dark hover:bg-sd-green-hover shadow-lg">
            {submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending…</> : "Get My Free Quote →"}
          </Button>
          <p className="text-[9px] text-sd-gray-text text-center mt-1">🔒 Response within 24h · Your data is safe with us</p>
        </form>
      </div>
    );
  }

  // Standard Form (for other pages)
  return (
    <div className={bare ? "w-full" : "w-full max-w-md mx-auto rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 overflow-hidden"}>
      {!bare && (
        <div className="bg-sd-black px-6 pt-6 pb-5 text-center text-white">
          <h2 className="font-display text-2xl sm:text-3xl leading-tight">
            Get Your Free <span className="text-sd-green">James Hardie</span> Quote
          </h2>
          <p className="mt-1.5 text-xs text-white/75">Response within 24h · No pressure · Written estimate</p>
          <div className="mt-3 inline-flex items-center gap-1.5">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-sd-green text-sd-green" />
              ))}
            </div>
            <span className="text-[11px] font-semibold text-white/80">4.9 · 128+ reviews</span>
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit} noValidate className={bare ? "grid gap-3" : "px-6 py-5 grid gap-3"}>
        <Field id="hero-name" label="Full name" value={values.name} onChange={(v: string) => update("name", v)} error={errors.name} autoComplete="name" dark={bare} />
        <div className="grid grid-cols-2 gap-3">
          <Field id="hero-phone" label="Phone" type="tel" value={values.phone} onChange={(v: string) => update("phone", v)} error={errors.phone} autoComplete="tel" dark={bare} />
          <Field id="hero-city" label="City" value={values.city} onChange={(v: string) => update("city", v)} error={errors.city} autoComplete="address-level2" dark={bare} />
        </div>
        {errors.general && <p className="text-[11px] text-destructive text-center">{errors.general}</p>}
        <Button type="submit" size="lg" disabled={submitting} className="mt-1">
          {submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending…</> : "Get My Free Quote →"}
        </Button>
        <p className={`text-[10px] leading-snug text-center ${bare ? "text-white/60" : "text-sd-gray-text"}`}>
          🔒 We respond within 24 hours. No pressure, ever.
        </p>
      </form>
    </div>
  );
}

function Field({ id, label, placeholder, value, onChange, error, type = "text", autoComplete, required = false, dark = false }: any) {
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id} className={`text-xs font-semibold ${dark ? "text-white" : "text-sd-black"}`}>
        {label}{required && <span className="text-destructive ml-0.5">*</span>}
      </Label>
      <Input id={id} type={type} placeholder={placeholder} autoComplete={autoComplete} value={value} onChange={(e) => onChange(e.target.value)} aria-invalid={Boolean(error)} className={`h-10 ${dark ? "bg-white/10 border-white/20 text-white placeholder:text-white/50" : ""} ${error ? "border-destructive focus-visible:ring-destructive" : ""}`} />
      {error && <p className="text-[11px] text-destructive">{error}</p>}
    </div>
  );
}