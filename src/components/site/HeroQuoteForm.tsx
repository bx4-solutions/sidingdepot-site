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
  services: z.array(z.string()).max(20).optional(),
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
  submitLabel?: string;
  title?: string;
  subtitle?: string;
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
  submitLabel = "Get My Free Quote →",
  title = "Get Your FREE Quote Today",
  subtitle = "A specialist will contact you within 24 hours.",
}: HeroQuoteFormProps = {}) {
  const { form, onSubmit, isSubmitting, isSuccess, error } = useLeadForm({
    schema: formSchema as any,
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      services: [],
      details: "",
      consent: false,
    } as any,
    source,
    tag,
    onSuccess,
  });

  const {
    register,
    control,
    formState: { errors },
  } = form as any;

  if (isSuccess) {
    return (
      <div
        className={`${bare ? "" : "bg-white rounded-2xl shadow-2xl ring-1 ring-black/5"} px-6 py-10 text-center animate-in fade-in zoom-in duration-300`}
      >
        <CheckCircle2 className="mx-auto h-12 w-12 text-sd-green" />
        <h3 className="mt-3 font-display text-2xl text-sd-black">Thank You!</h3>
        <p className="mt-2 text-sd-gray-text">
          Thank you for sending us your information. Stay alert — we are already reaching out to
          you.
        </p>
      </div>
    );
  }

  return (
    <div
      className={
        bare
          ? "w-full"
          : "w-full max-w-[420px] mx-auto rounded-xl bg-white shadow-xl ring-1 ring-black/5 overflow-hidden transition-all hover:shadow-sd-green/5"
      }
    >
      {!bare && (
        <div
          className="px-5 pt-5 pb-4 text-center text-sd-black border-b border-black/10"
          style={{ background: "#B6E214" }}
        >
          <p className="font-display text-xl sm:text-2xl leading-tight">{title}</p>
          <p className="mt-1 text-[11px] text-sd-black/70">{subtitle}</p>
        </div>
      )}
      <form onSubmit={onSubmit} className={bare ? "grid gap-2.5" : "px-5 py-5 grid gap-3"}>
        <div className="grid gap-1">
          <Label
            htmlFor="hero-name"
            className="text-[11px] font-bold text-sd-black uppercase tracking-wider"
          >
            Full Name *
          </Label>
          <Input
            {...register("name")}
            id="hero-name"
            placeholder="Your full name"
            autoComplete="name"
            className="h-11 text-base border-sd-navy/10 focus:ring-2 focus:ring-sd-green/20"
          />
          {errors.name && (
            <p className="text-[11px] text-destructive font-medium">
              {errors.name.message as string}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div className="grid gap-1">
            <Label
              htmlFor="hero-phone"
              className="text-[11px] font-bold text-sd-black uppercase tracking-wider"
            >
              Phone *
            </Label>
            <Input
              {...register("phone")}
              id="hero-phone"
              type="tel"
              placeholder="(678) 000-0000"
              autoComplete="tel"
              className="h-11 text-base border-sd-navy/10 focus:ring-2 focus:ring-sd-green/20"
            />
            {errors.phone && (
              <p className="text-[11px] text-destructive font-medium">
                {errors.phone.message as string}
              </p>
            )}
          </div>
          <div className="grid gap-1">
            <Label
              htmlFor="hero-email"
              className="text-[11px] font-bold text-sd-black uppercase tracking-wider"
            >
              Email *
            </Label>
            <Input
              {...register("email")}
              id="hero-email"
              type="email"
              placeholder="your@email.com"
              autoComplete="email"
              className="h-11 text-base border-sd-navy/10 focus:ring-2 focus:ring-sd-green/20"
            />
            {errors.email && (
              <p className="text-[11px] text-destructive font-medium">
                {errors.email.message as string}
              </p>
            )}
          </div>
        </div>

        <div className="grid gap-1.5 hidden sm:block">
          <Label className="text-[11px] font-bold text-sd-black uppercase tracking-wider">
            Services
          </Label>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
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
                        className="border-2 border-sd-green data-[state=checked]:bg-sd-green data-[state=checked]:border-sd-green"
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
                <Label htmlFor={`svc-${opt}`} className="text-[13px] text-sd-black cursor-pointer">
                  {opt}
                </Label>
              </div>
            ))}
          </div>
          {errors.services && (
            <p className="text-[11px] text-destructive font-medium">
              {errors.services.message as string}
            </p>
          )}
        </div>

        <div className="grid gap-1 hidden sm:block">
          <Label
            htmlFor="hero-details"
            className="text-[11px] font-bold text-sd-black uppercase tracking-wider flex items-center gap-1.5"
          >
            Project Details
            <span className="normal-case font-normal text-sd-gray-text tracking-normal">
              (Optional)
            </span>
          </Label>
          <Textarea
            {...register("details")}
            id="hero-details"
            placeholder="Describe your project..."
            className="resize-none min-h-[64px] bg-white text-sd-black caret-sd-black placeholder:text-sd-gray-text border-sd-navy/10 selection:bg-sd-navy selection:text-white focus:ring-2 focus:ring-sd-green/20"
            rows={2}
          />
        </div>

        <div className="flex items-start gap-2 p-2.5 bg-sd-gray-bg/50 rounded-md border border-sd-navy/5">
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
            <Label
              htmlFor="hero-consent"
              className="text-[10px] leading-snug text-sd-gray-text cursor-pointer"
            >
              I agree to receive SMS and emails from Siding Depot LLC. Message frequency varies. Msg
              & data rates apply. Text STOP to opt out.
            </Label>
            {errors.consent && (
              <p className="text-[11px] text-destructive font-medium">
                {errors.consent.message as string}
              </p>
            )}
          </div>
        </div>

        {error && <p className="text-sm text-destructive text-center font-semibold">{error}</p>}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full font-bold bg-sd-green text-sd-dark hover:bg-sd-green-hover shadow-lg shadow-sd-green/20 transition-all h-10 text-sm"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" /> Sending…
            </>
          ) : (
            submitLabel
          )}
        </Button>
      </form>
    </div>
  );
}
