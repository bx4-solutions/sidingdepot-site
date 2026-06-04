import { useState } from "react";
import { z } from "zod";
import { CheckCircle2, Loader2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useLeadForm } from "@/hooks/use-lead-form";
import { Controller } from "react-hook-form";

// Consolidated schema - now the standard for all forms
const formSchema = z.object({
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
  /** @deprecated No longer used as this is now the standard form */
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
  source = "standard_form",
  tag = "quote_request",
  bare = false,
  onSuccess,
}: HeroQuoteFormProps = {}) {
  const { form, onSubmit, isSubmitting, isSuccess, error } = useLeadForm({
    schema: formSchema as any,
    defaultValues: { 
      name: "", 
      phone: "", 
      email: "", 
      city: "", 
      services: [], 
      details: "", 
      consent: false 
    } as any,
    source,
    tag,
    onSuccess,
  });

  const { register, control, formState: { errors } } = form as any;

  if (isSuccess) {
    return (
      <div className={`${bare ? "" : "bg-white rounded-2xl shadow-2xl ring-1 ring-black/5"} px-6 py-10 text-center animate-in fade-in zoom-in duration-300`}>
        <CheckCircle2 className="mx-auto h-12 w-12 text-sd-green" />
        <h3 className="mt-3 font-display text-2xl text-sd-black">Request Received!</h3>
        <p className="mt-2 text-sd-gray-text">Our team will contact you within 24 hours.</p>
      </div>
    );
  }

  return (
    <div className={bare ? "w-full" : "w-full max-w-md mx-auto rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 overflow-hidden transition-all hover:shadow-sd-green/5"}>
      {!bare && (
        <div className="bg-sd-navy px-6 pt-6 pb-5 text-center text-white border-b border-white/10">
          <h2 className="font-display text-2xl sm:text-3xl leading-tight">Get Your FREE Quote Today</h2>
          <p className="mt-1.5 text-xs text-white/75">A specialist will contact you within 24 hours.</p>
          <div className="mt-4 text-[10px] font-bold text-sd-green uppercase tracking-wider flex items-center justify-center gap-1.5 bg-white/5 py-1 px-2 rounded-full">
            ⭐ 4.9 Nota no Google · 🏠 1.500+ Casas · 💰 0% Juros
          </div>
        </div>
      )}
      <form onSubmit={onSubmit} className={bare ? "grid gap-3" : "px-6 py-6 grid gap-4"}>
        <div className="grid gap-1.5">
          <Label htmlFor="hero-name" className="text-xs font-bold text-sd-black uppercase tracking-wider">Full Name *</Label>
          <Input {...register("name")} id="hero-name" placeholder="Your full name" className="h-11 border-sd-navy/10 focus:ring-2 focus:ring-sd-green/20" />
          {errors.name && <p className="text-[11px] text-destructive font-medium">{errors.name.message as string}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="grid gap-1.5">
            <Label htmlFor="hero-phone" className="text-xs font-bold text-sd-black uppercase tracking-wider">Phone *</Label>
            <Input {...register("phone")} id="hero-phone" type="tel" placeholder="(678) 000-0000" className="h-11 border-sd-navy/10 focus:ring-2 focus:ring-sd-green/20" />
            {errors.phone && <p className="text-[11px] text-destructive font-medium">{errors.phone.message as string}</p>}
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="hero-email" className="text-xs font-bold text-sd-black uppercase tracking-wider">Email *</Label>
            <Input {...register("email")} id="hero-email" type="email" placeholder="your@email.com" className="h-11 border-sd-navy/10 focus:ring-2 focus:ring-sd-green/20" />
            {errors.email && <p className="text-[11px] text-destructive font-medium">{errors.email.message as string}</p>}
          </div>
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="hero-city" className="text-xs font-bold text-sd-black uppercase tracking-wider">City *</Label>
          <Input {...register("city")} id="hero-city" placeholder="Your city" className="h-11 border-sd-navy/10 focus:ring-2 focus:ring-sd-green/20" />
          {errors.city && <p className="text-[11px] text-destructive font-medium">{errors.city.message as string}</p>}
        </div>

        <div className="grid gap-2">
          <Label className="text-xs font-bold text-sd-black uppercase tracking-wider">Services *</Label>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 mt-1">
            {SERVICES_OPTIONS.map((opt) => (
              <div key={opt} className="flex items-center gap-2">
                <Controller
                  name="services"
                  control={control}
                  render={({ field }) => {
                    const currentServices = (field.value as string[]) || [];
                    return (
                      <Checkbox
                        id={`svc-${opt}`}
                        checked={currentServices.includes(opt)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            field.onChange([...currentServices, opt]);
                          } else {
                            field.onChange(currentServices.filter((s) => s !== opt));
                          }
                        }}
                      />
                    );
                  }}
                />
                <Label htmlFor={`svc-${opt}`} className="text-sm text-sd-black cursor-pointer">{opt}</Label>
              </div>
            ))}
          </div>
          {errors.services && <p className="text-[11px] text-destructive font-medium">{errors.services.message as string}</p>}
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="hero-details" className="text-xs font-bold text-sd-black uppercase tracking-wider">Project Details</Label>
          <Textarea {...register("details")} id="hero-details" placeholder="Describe your project..." className="resize-none min-h-[90px] border-sd-navy/10 focus:ring-2 focus:ring-sd-green/20" rows={3} />
        </div>

        <div className="flex items-start gap-3 p-3 bg-sd-gray-bg/50 rounded-lg border border-sd-navy/5">
          <Controller
            name="consent"
            control={control}
            render={({ field }) => (
              <Checkbox
                id="hero-consent"
                checked={field.value as boolean}
                onCheckedChange={field.onChange}
                className="mt-0.5"
              />
            )}
          />
          <div className="grid gap-1">
            <Label htmlFor="hero-consent" className="text-[11px] leading-relaxed text-sd-gray-text cursor-pointer">
              I agree to receive SMS and emails from Siding Depot LLC. Message frequency varies. Msg & data rates apply. Text STOP to opt out.
            </Label>
            {errors.consent && <p className="text-[11px] text-destructive font-medium">{errors.consent.message as string}</p>}
          </div>
        </div>

        {error && <p className="text-sm text-destructive text-center font-semibold">{error}</p>}
        
        <Button type="submit" size="lg" disabled={isSubmitting} className="w-full font-bold bg-sd-green text-sd-dark hover:bg-sd-green-hover shadow-xl shadow-sd-green/20 transition-all h-12">
          {isSubmitting ? <><Loader2 className="h-5 w-5 animate-spin mr-2" /> Sending…</> : "Get My Free Quote →"}
        </Button>
        <p className="text-[10px] text-sd-gray-text text-center font-medium">🔒 Response within 24h · Trusted by 1,500+ homeowners</p>
      </form>
    </div>
  );
}
