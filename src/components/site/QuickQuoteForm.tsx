import { z } from "zod";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useGoogleStats } from "@/lib/google-stats-context";
import { useLeadForm } from "@/hooks/use-lead-form";
import { Controller } from "react-hook-form";

const formSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name").max(100),
  phone: z.string().trim().min(7, "Please enter a valid phone number").max(30),
  city: z.string().trim().min(2, "Please enter your city").max(80),
  services: z.array(z.string()).min(1, "Please select at least one service").max(20),
});

type Props = {
  source?: string;
  tag?: string;
  onSuccess?: () => void;
};

const SERVICES_OPTIONS = [
  "Siding",
  "Painting",
  "Gutters",
  "Windows",
  "Doors",
  "Decks",
  "Roof",
  "Dumpster Rental",
] as const;

export function QuickQuoteForm({
  source = "quick_quote_modal",
  tag = "quote_request",
  onSuccess,
}: Props = {}) {
  const { rating } = useGoogleStats();
  const { form, onSubmit, isSubmitting, isSuccess, error } = useLeadForm({
    schema: formSchema as any,
    defaultValues: { name: "", phone: "", city: "", services: [] } as any,
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
      <div className="bg-white rounded-2xl shadow-2xl ring-1 ring-black/5 px-6 py-10 text-center animate-in fade-in zoom-in duration-300">
        <CheckCircle2 className="mx-auto h-12 w-12 text-sd-green" />
        <h3 className="mt-3 font-display text-2xl text-sd-black">Request Received!</h3>
        <p className="mt-2 text-sd-gray-text">Our team will contact you within 24 hours.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[440px] mx-auto rounded-xl bg-white shadow-xl ring-1 ring-black/5 overflow-hidden">
      <div className="bg-sd-navy px-5 pt-5 pb-4 text-center text-white border-b border-white/10">
        <h2 className="font-display text-xl sm:text-2xl leading-tight">Get Your FREE Quote</h2>
        <p className="mt-1 text-[11px] text-white/75">
          A specialist will contact you within 24 hours.
        </p>
        <div className="mt-3 text-[9px] font-bold text-sd-green uppercase tracking-wider flex items-center justify-center gap-1.5 bg-white/5 py-1 px-2 rounded-full">
          ⭐ {rating} Google · 🏆 Elite Contractor · 🔨 4.7 GuildQuality
        </div>
      </div>
      <form onSubmit={onSubmit} className="px-5 py-5 grid gap-3">
        <div className="grid gap-1">
          <Label
            htmlFor="qq-name"
            className="text-[11px] font-bold text-sd-black uppercase tracking-wider"
          >
            Full Name *
          </Label>
          <Input
            {...register("name")}
            id="qq-name"
            placeholder="Your full name"
            className="h-10 text-sm border-sd-navy/10 focus:ring-2 focus:ring-sd-green/20"
          />
          {errors.name && (
            <p className="text-[11px] text-destructive font-medium">
              {errors.name.message as string}
            </p>
          )}
        </div>

        <div className="grid gap-1">
          <Label
            htmlFor="qq-phone"
            className="text-[11px] font-bold text-sd-black uppercase tracking-wider"
          >
            Phone *
          </Label>
          <Input
            {...register("phone")}
            id="qq-phone"
            type="tel"
            placeholder="(678) 000-0000"
            className="h-10 text-sm border-sd-navy/10 focus:ring-2 focus:ring-sd-green/20"
          />
          {errors.phone && (
            <p className="text-[11px] text-destructive font-medium">
              {errors.phone.message as string}
            </p>
          )}
        </div>

        <div className="grid gap-1">
          <Label
            htmlFor="qq-city"
            className="text-[11px] font-bold text-sd-black uppercase tracking-wider"
          >
            City *
          </Label>
          <Input
            {...register("city")}
            id="qq-city"
            placeholder="Your city"
            className="h-10 text-sm border-sd-navy/10 focus:ring-2 focus:ring-sd-green/20"
          />
          {errors.city && (
            <p className="text-[11px] text-destructive font-medium">
              {errors.city.message as string}
            </p>
          )}
        </div>

        <div className="grid gap-1.5">
          <Label className="text-[11px] font-bold text-sd-black uppercase tracking-wider">
            Services *
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
                        id={`qq-svc-${opt}`}
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
                <Label
                  htmlFor={`qq-svc-${opt}`}
                  className="text-[13px] text-sd-black cursor-pointer"
                >
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

        {error && <p className="text-sm text-destructive text-center font-semibold">{error}</p>}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full font-bold bg-sd-green text-sd-dark hover:bg-sd-green-hover shadow-lg shadow-sd-green/20 transition-all h-11 text-sm mt-1"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" /> Sending…
            </>
          ) : (
            "Send Request →"
          )}
        </Button>
        <p className="text-[10px] text-sd-gray-text text-center font-medium">
          🔒 Response within 24h · No pressure · Written estimate
        </p>
      </form>
    </div>
  );
}
