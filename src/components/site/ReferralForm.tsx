import { useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Copy, Loader2 } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { submitReferral } from "@/lib/referral.functions";
import { trackLeadSubmit } from "@/lib/track";

const formSchema = z.object({
  referrerName: z.string().trim().min(2, "Please enter your full name").max(100),
  referrerPhone: z.string().trim().min(7, "Please enter a valid phone number").max(30),
  referrerEmail: z.string().trim().email("Please enter a valid email address").max(254),
  homeownerName: z.string().trim().min(2, "Please enter your neighbor's full name").max(100),
  homeownerPhone: z.string().trim().min(7, "Please enter a valid phone number").max(30),
  homeownerEmail: z.string().trim().email("Please enter a valid email address").max(254),
  cityOrZip: z.string().trim().min(2, "Please enter a city or ZIP code").max(100),
  service: z.string().min(1, "Please choose the project they are considering"),
  permission: z.boolean().refine((v) => v, { message: "Confirmation is required" }),
  terms: z.boolean().refine((v) => v, { message: "You must accept the program terms" }),
});

type FormValues = z.infer<typeof formSchema>;
type Step = 1 | 2;

const FIELD_CLASS =
  "h-12 text-base border-sd-navy/10 bg-white text-sd-black placeholder:text-sd-gray-text focus-visible:ring-sd-green";

/**
 * The referrer completes step one (about themselves), then step two (about the
 * neighbor they're referring) and accepts the program terms. On submit we create
 * two linked contacts + a REFERRALS deal and hand back a unique link to share.
 */
export function ReferralForm() {
  const [step, setStep] = useState<Step>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [referralLink, setReferralLink] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      referrerName: "",
      referrerPhone: "",
      referrerEmail: "",
      homeownerName: "",
      homeownerPhone: "",
      homeownerEmail: "",
      cityOrZip: "",
      service: "",
      permission: false,
      terms: false,
    },
  });

  const permission = watch("permission");
  const terms = watch("terms");

  const goToNeighbor = async () => {
    const isValid = await trigger(["referrerName", "referrerPhone", "referrerEmail"]);
    if (isValid) setStep(2);
  };

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    setError(null);
    const res = await submitReferral({
      data: {
        referrerName: values.referrerName,
        referrerPhone: values.referrerPhone,
        referrerEmail: values.referrerEmail,
        homeownerName: values.homeownerName,
        homeownerPhone: values.homeownerPhone,
        homeownerEmail: values.homeownerEmail,
        cityOrZip: values.cityOrZip,
        service: values.service,
        permission: values.permission,
        termsAccepted: values.terms,
      },
    }).catch(() => null);
    setIsSubmitting(false);
    if (res?.ok) {
      trackLeadSubmit({ service: "referral_rewards", source: "referral_rewards_page" });
      const origin =
        typeof window !== "undefined" ? window.location.origin : "https://www.sidingdepot.com";
      setReferralLink(`${origin}${res.welcomePath}`);
      setIsSuccess(true);
    } else {
      setError("Something went wrong. Please try again or call us at 678-400-2012.");
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  if (isSuccess) {
    return (
      <div className="rounded-[1.75rem] bg-white p-8 text-center shadow-[0_24px_60px_rgba(12,12,12,.13)] sm:p-9">
        <CheckCircle2 className="mx-auto h-14 w-14 text-sd-green" />
        <p className="mt-6 text-[11px] font-bold tracking-[.16em] text-sd-green-dark">
          REFERRAL RECEIVED
        </p>
        <h3 className="mt-2 font-display text-4xl text-sd-black">
          Thank you for the introduction.
        </h3>
        <p className="mx-auto mt-4 max-w-md leading-relaxed text-sd-gray-text">
          We&apos;ll reach out to your neighbor and keep the referral connected to you at every
          reward milestone. Want to give them a head start? Send them their personal welcome link:
        </p>
        {referralLink && (
          <div className="mx-auto mt-6 flex max-w-md items-center gap-2 rounded-xl border border-sd-gray-border bg-sd-green-pale/60 p-2 pl-4">
            <span className="flex-1 truncate text-left text-sm text-sd-navy">{referralLink}</span>
            <Button type="button" size="sm" onClick={copyLink} className="shrink-0 rounded-lg">
              <Copy className="mr-1.5 h-3.5 w-3.5" /> {copied ? "Copied!" : "Copy"}
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-[1.75rem] bg-white p-6 shadow-[0_24px_60px_rgba(12,12,12,.13)] ring-1 ring-black/5 sm:p-9"
    >
      <div className="flex items-center justify-between border-b border-sd-gray-border pb-5">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[.15em] text-sd-green-text">
            Step {step} of 2
          </p>
          <h3 className="mt-1 font-display text-3xl text-sd-black">
            {step === 1 ? "About you" : "About your neighbor"}
          </h3>
        </div>
        <div className="flex gap-2">
          <span className="h-2.5 w-8 rounded-full bg-sd-green-text" />
          <span
            className={`h-2.5 w-8 rounded-full ${step === 2 ? "bg-sd-green-text" : "bg-sd-green/25"}`}
          />
        </div>
      </div>

      {step === 1 ? (
        <div className="mt-6 grid gap-5">
          <p className="text-sm leading-relaxed text-sd-gray-text">
            We start with you so the referral is connected to the right person before we contact
            anyone.
          </p>
          <Field error={errors.referrerName?.message} label="Your full name" id="referrer-name">
            <Input
              {...register("referrerName")}
              id="referrer-name"
              autoComplete="name"
              placeholder="Your name"
              className={FIELD_CLASS}
            />
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              error={errors.referrerPhone?.message}
              label="Your mobile number"
              id="referrer-phone"
            >
              <Input
                {...register("referrerPhone")}
                id="referrer-phone"
                type="tel"
                autoComplete="tel"
                placeholder="(678) 000-0000"
                className={FIELD_CLASS}
              />
            </Field>
            <Field
              error={errors.referrerEmail?.message}
              label="Your email address"
              id="referrer-email"
            >
              <Input
                {...register("referrerEmail")}
                id="referrer-email"
                type="email"
                autoComplete="email"
                placeholder="you@email.com"
                className={FIELD_CLASS}
              />
            </Field>
          </div>
          <Button
            type="button"
            onClick={() => void goToNeighbor()}
            className="mt-2 h-12 w-full rounded-full text-base font-bold"
          >
            Continue to your neighbor
          </Button>
        </div>
      ) : (
        <div className="mt-6 grid gap-5">
          <p className="text-sm leading-relaxed text-sd-gray-text">
            Share only the details you have. We will make the follow-up easy and respectful.
          </p>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              error={errors.homeownerName?.message}
              label="Neighbor's full name"
              id="homeowner-name"
            >
              <Input
                {...register("homeownerName")}
                id="homeowner-name"
                placeholder="Their name"
                className={FIELD_CLASS}
              />
            </Field>
            <Field
              error={errors.homeownerPhone?.message}
              label="Neighbor's mobile number"
              id="homeowner-phone"
            >
              <Input
                {...register("homeownerPhone")}
                id="homeowner-phone"
                type="tel"
                placeholder="(678) 000-0000"
                className={FIELD_CLASS}
              />
            </Field>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              error={errors.homeownerEmail?.message}
              label="Neighbor's email address"
              id="homeowner-email"
            >
              <Input
                {...register("homeownerEmail")}
                id="homeowner-email"
                type="email"
                placeholder="neighbor@email.com"
                className={FIELD_CLASS}
              />
            </Field>
            <Field
              error={errors.cityOrZip?.message}
              label="City or ZIP code"
              id="homeowner-location"
            >
              <Input
                {...register("cityOrZip")}
                id="homeowner-location"
                placeholder="Marietta, GA or 30062"
                className={FIELD_CLASS}
              />
            </Field>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="referral-service">Project they may need</Label>
            <select
              {...register("service")}
              id="referral-service"
              defaultValue=""
              className={`${FIELD_CLASS} rounded-md px-3 shadow-sm`}
            >
              <option value="" disabled>
                Select one
              </option>
              <option value="Siding">Siding</option>
              <option value="Roofing">Roofing</option>
              <option value="Windows">Windows</option>
              <option value="Gutters">Gutters</option>
              <option value="Exterior painting">Exterior painting</option>
              <option value="More than one exterior project">More than one exterior project</option>
            </select>
            {errors.service && (
              <p className="text-xs font-medium text-destructive">{errors.service.message}</p>
            )}
          </div>

          {/* Neighbor consent */}
          <div className="flex items-start gap-2 rounded-xl border border-sd-green/30 bg-sd-green/10 p-4">
            <Checkbox
              id="referral-permission"
              checked={permission}
              onCheckedChange={(v) => setValue("permission", v === true, { shouldValidate: true })}
              className="mt-0.5"
            />
            <div>
              <Label
                htmlFor="referral-permission"
                className="cursor-pointer text-xs leading-snug text-sd-gray-text"
              >
                My neighbor has agreed that Siding Depot may contact them about their exterior
                project.
              </Label>
              {errors.permission && (
                <p className="mt-1 text-xs font-medium text-destructive">
                  {errors.permission.message}
                </p>
              )}
            </div>
          </div>

          {/* Program terms acceptance */}
          <div className="flex items-start gap-2 rounded-xl border border-sd-gray-border bg-sd-green-pale/50 p-4">
            <Checkbox
              id="referral-terms"
              checked={terms}
              onCheckedChange={(v) => setValue("terms", v === true, { shouldValidate: true })}
              className="mt-0.5"
            />
            <div>
              <Label
                htmlFor="referral-terms"
                className="cursor-pointer text-xs leading-snug text-sd-gray-text"
              >
                I have read and accept the Referral Rewards Program terms without reservation:
                rewards apply to new customers only, on qualifying projects of $5,000+ where a
                written estimate is provided ($75 at written estimate, $75 at signed contract),
                verified before payment.
              </Label>
              {errors.terms && (
                <p className="mt-1 text-xs font-medium text-destructive">{errors.terms.message}</p>
              )}
            </div>
          </div>

          {error && <p className="text-sm font-semibold text-destructive">{error}</p>}
          <div className="flex flex-col-reverse gap-3 sm:flex-row">
            <Button type="button" variant="ghost" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-12 flex-1 rounded-full text-base font-bold"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Sending…
                </>
              ) : (
                "Send this referral"
              )}
            </Button>
          </div>
        </div>
      )}
    </form>
  );
}

function Field({
  label,
  id,
  error,
  children,
}: {
  label: string;
  id: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error && <p className="text-xs font-medium text-destructive">{error}</p>}
    </div>
  );
}
