import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight, CheckCircle2, Loader2, ShieldCheck, Star, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ServiceCard } from "@/components/site/ServiceCard";
import { SERVICES, SITE } from "@/data/site";
import { getReferralByCode, acceptReferral, type ReferralInfo } from "@/lib/referral.functions";

/** Service slugs used by the 24h reminder SMS links (…/welcome/CODE?s=siding). */
const SERVICE_BY_SLUG: Record<string, string> = {
  siding: "Siding",
  roofing: "Roofing",
  windows: "Windows",
  gutters: "Gutters",
  painting: "Exterior painting",
  other: "More than one project",
};

/** Multi-select options (mesmo conjunto da Page A / ReferralForm). */
const SERVICE_OPTIONS = ["Siding", "Roofing", "Windows", "Gutters", "Exterior painting"] as const;

export const Route = createFileRoute("/welcome/$code")({
  validateSearch: (search: Record<string, unknown>) => ({
    s: typeof search.s === "string" ? search.s.toLowerCase() : undefined,
  }),
  loader: async ({ params }) => getReferralByCode({ data: params.code }),
  head: () => ({
    meta: [
      { title: "You've been referred to Siding Depot" },
      { name: "robots", content: "noindex" },
      {
        name: "description",
        content:
          "A neighbor referred you to Siding Depot — Georgia's Elite James Hardie contractor. Accept the referral and book a free, no-pressure estimate.",
      },
    ],
  }),
  component: WelcomePage,
});

const acceptSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address").max(254),
  address: z.string().trim().min(5, "Please enter your home address").max(160),
  services: z.array(z.string()).min(1, "Please choose at least one project"),
});
type AcceptValues = z.infer<typeof acceptSchema>;

function WelcomePage() {
  const referral = Route.useLoaderData() as ReferralInfo;
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AcceptValues>({
    resolver: zodResolver(acceptSchema),
    // Pré-marca os serviços que o INDICADOR escolheu; o vizinho pode alterar/acrescentar.
    defaultValues: { email: "", address: "", services: referral.services ?? [] },
  });
  const services = watch("services");
  const toggleService = (name: string, checked: boolean) => {
    const current = services ?? [];
    setValue("services", checked ? [...current, name] : current.filter((s) => s !== name), {
      shouldValidate: true,
    });
  };

  const hasReferrer = referral.found && !!referral.referrerName;
  const referrer = referral.referrerName || "A neighbor";
  const last4 = referral.referrerPhoneLast4;
  const you = referral.referredFirst;

  // Arrived from a 24h reminder SMS link (…?s=siding) — one tap to confirm.
  const { s } = Route.useSearch();
  const pickedService = s ? SERVICE_BY_SLUG[s] : undefined;

  /**
   * One-tap confirmation from the SMS link. We deliberately do NOT accept on
   * page load: link scanners in SMS/spam filters open URLs automatically and
   * would create false acceptances. The neighbor taps once to confirm.
   */
  const confirmPickedService = async () => {
    if (!pickedService) return;
    setSubmitting(true);
    setError(null);
    const res = await acceptReferral({
      data: {
        code: referral.code,
        contactId: referral.contactId,
        opportunityId: referral.opportunityId,
        email: "",
        address: "",
        services: [pickedService],
      },
    }).catch(() => null);
    setSubmitting(false);
    if (res?.ok) setDone(true);
    else setError("Something went wrong. Please try again or call us at " + SITE.phone + ".");
  };

  const onSubmit = async (values: AcceptValues) => {
    setSubmitting(true);
    setError(null);
    const res = await acceptReferral({
      data: {
        code: referral.code,
        contactId: referral.contactId,
        opportunityId: referral.opportunityId,
        email: values.email,
        address: values.address,
        services: values.services,
      },
    }).catch(() => null);
    setSubmitting(false);
    if (res?.ok) setDone(true);
    else setError("Something went wrong. Please try again or call us at " + SITE.phone + ".");
  };

  if (done) {
    return (
      <main className="bg-background text-sd-black">
        <section className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center px-4 py-24 text-center sm:px-6">
          <CheckCircle2 className="h-16 w-16 text-sd-green" />
          <p className="mt-6 text-[11px] font-bold tracking-[.16em] text-sd-green-dark">
            REFERRAL ACCEPTED
          </p>
          <h1 className="mt-2 font-display text-4xl leading-tight sm:text-6xl">
            {you ? `Thank you, ${you}!` : "Thank you!"}
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-sd-gray-text">
            We&apos;ll reach out shortly to schedule your free, no-pressure estimate. While you
            wait, get to know the team {referrer} trusts with their home.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link to="/projects">
                See recent projects <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/about">Meet Siding Depot</Link>
            </Button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="bg-background text-sd-black">
      {/* Personalized welcome hero */}
      <section className="overflow-hidden px-4 pb-14 pt-12 sm:px-6 sm:pt-20 lg:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_.95fr] lg:gap-16">
          <div className="max-w-2xl">
            <p className="inline-flex rounded-full bg-sd-green-pale px-4 py-2 text-[11px] font-bold tracking-[.13em] text-sd-green-dark">
              A PERSONAL INTRODUCTION
            </p>
            <h1 className="mt-6 font-display text-4xl leading-[1.02] sm:text-6xl lg:text-7xl">
              {hasReferrer ? (
                <>
                  Your friend {referrer} referred you to{" "}
                  <span className="text-sd-green-text">Siding Depot.</span>
                </>
              ) : (
                <>
                  A neighbor referred you to{" "}
                  <span className="text-sd-green-text">Siding Depot.</span>
                </>
              )}
            </h1>
            {hasReferrer && (
              <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-sd-green/40 bg-white px-4 py-2 text-sm shadow-sm">
                <ShieldCheck className="h-4 w-4 shrink-0 text-sd-navy" />
                <span className="text-sd-gray-text">
                  Referred by <strong className="text-sd-black">{referrer}</strong>
                  {last4 ? (
                    <>
                      {" "}
                      · phone ending{" "}
                      <strong className="text-sd-black tabular-nums">••••{last4}</strong>
                    </>
                  ) : null}
                </span>
              </div>
            )}
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-sd-gray-text sm:text-xl">
              {hasReferrer ? referrer : "A neighbor"} wants you to get to know our premium,
              professional exterior work — installed by Georgia&apos;s Elite James Hardie
              contractor. It&apos;s a real compliment, and we&apos;d love to earn your trust too.
            </p>
            {pickedService && (
              <div className="mt-7 rounded-2xl border-2 border-sd-green bg-sd-green-pale p-5 shadow-sm">
                <p className="text-[11px] font-bold tracking-[.14em] text-sd-green-dark">
                  ONE STEP LEFT
                </p>
                <p className="mt-2 font-display text-2xl leading-tight text-sd-black">
                  You selected <span className="text-sd-green-text">{pickedService}</span>.
                </p>
                <p className="mt-2 text-sm leading-relaxed text-sd-gray-text">
                  Confirm and we&apos;ll call you to book your free estimate — no obligation.
                </p>
                <Button
                  type="button"
                  size="lg"
                  disabled={submitting}
                  onClick={() => void confirmPickedService()}
                  className="mt-4 h-14 w-full rounded-full text-base font-bold sm:w-auto sm:px-8"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Confirming…
                    </>
                  ) : (
                    <>
                      Yes — confirm {pickedService} <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
                {error && <p className="mt-3 text-sm font-semibold text-destructive">{error}</p>}
              </div>
            )}
            <ul className="mt-7 grid grid-cols-2 gap-3 text-sm sm:max-w-md">
              {[
                { i: Star, t: "4.7★ · 550+ reviews" },
                { i: Users, t: "1,500+ homes completed" },
                { i: ShieldCheck, t: "Licensed & insured" },
                { i: CheckCircle2, t: "Free, no-pressure estimate" },
              ].map(({ i: Icon, t }) => (
                <li key={t} className="flex items-center gap-2 text-sd-black/80">
                  <Icon className="h-4 w-4 shrink-0 text-sd-navy" /> {t}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Button asChild size="lg" className="rounded-full">
                <a href="#accept">
                  Accept the referral <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute -inset-5 rounded-[2.5rem] bg-sd-green-pale"
            />
            <img
              src="/referral/neighbors-referral.png"
              alt="A neighbor recommending Siding Depot"
              className="relative h-[360px] w-full rounded-[2rem] object-cover object-center shadow-[0_24px_60px_rgba(12,12,12,.17)] sm:h-[500px]"
            />
          </div>
        </div>
      </section>

      {/* Services showcase — the reference work */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-bold tracking-[.16em] text-sd-green-dark">
            WHAT WE&apos;RE KNOWN FOR
          </p>
          <h2 className="mt-4 font-display text-4xl leading-none sm:text-5xl">
            The services neighbors recommend.
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-sd-gray-text">
            One contractor for every exterior project — installed by in-house certified crews, never
            subcontractors.
          </p>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.slice(0, 6).map((s, i) => (
            <ServiceCard
              key={s.slug}
              id={`welcome-${s.slug}`}
              Icon={s.Icon}
              title={s.title}
              description={s.short}
              to={`/${s.slug}`}
              image={s.image}
              priority={i < 3}
            />
          ))}
        </div>
      </section>

      {/* Accept form */}
      <section
        id="accept"
        className="scroll-mt-24 bg-sd-green-pale px-4 py-20 sm:px-6 sm:py-24 lg:px-8"
      >
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[.9fr_1.1fr] lg:gap-16">
          <div className="lg:pt-6">
            <p className="text-[11px] font-bold tracking-[.16em] text-sd-green-dark">
              ACCEPT THE INTRODUCTION
            </p>
            <h2 className="mt-4 font-display text-4xl leading-none sm:text-5xl">
              {you ? `Almost done, ${you}.` : "You're almost there."}
            </h2>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-sd-gray-text">
              We already have your name from {referrer}. Just confirm a couple of details and
              we&apos;ll schedule your free estimate — zero pressure, zero obligation.
            </p>
            <div className="mt-8 rounded-2xl border border-sd-gray-border bg-background p-5">
              <p className="text-sm leading-relaxed text-sd-gray-text">
                Prefer to talk? Call or text{" "}
                <a
                  className="font-bold underline decoration-sd-green decoration-2 underline-offset-2"
                  href={SITE.phoneHref}
                >
                  {SITE.phone}
                </a>{" "}
                and mention {referrer}.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="rounded-[1.75rem] bg-white p-6 shadow-[0_24px_60px_rgba(12,12,12,.13)] ring-1 ring-black/5 sm:p-9"
          >
            <h3 className="font-display text-3xl text-sd-black">Confirm your details</h3>
            <p className="mt-1 text-sm text-sd-gray-text">Two quick fields, then accept.</p>
            <div className="mt-6 grid gap-5">
              <div className="grid gap-1.5">
                <Label htmlFor="w-email">Your email</Label>
                <Input
                  {...register("email")}
                  id="w-email"
                  type="email"
                  placeholder="you@email.com"
                  className="h-12 text-base border-sd-navy/10 bg-white focus-visible:ring-sd-green"
                />
                {errors.email && (
                  <p className="text-xs font-medium text-destructive">{errors.email.message}</p>
                )}
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="w-address">Home address</Label>
                <Input
                  {...register("address")}
                  id="w-address"
                  autoComplete="street-address"
                  placeholder="123 Main St, Marietta, GA 30062"
                  className="h-12 text-base border-sd-navy/10 bg-white focus-visible:ring-sd-green"
                />
                {errors.address && (
                  <p className="text-xs font-medium text-destructive">{errors.address.message}</p>
                )}
              </div>
              <div className="grid gap-1.5">
                <Label>Projects you&apos;re considering (choose all that apply)</Label>
                <div className="grid gap-2.5 sm:grid-cols-2">
                  {SERVICE_OPTIONS.map((name) => {
                    const checked = (services ?? []).includes(name);
                    return (
                      <label
                        key={name}
                        htmlFor={`w-service-${name}`}
                        className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-sd-navy/10 bg-white px-3.5 py-3 transition-colors hover:border-sd-green/50"
                      >
                        <Checkbox
                          id={`w-service-${name}`}
                          checked={checked}
                          onCheckedChange={(v) => toggleService(name, v === true)}
                        />
                        <span className="text-sm text-sd-black">{name}</span>
                      </label>
                    );
                  })}
                </div>
                {referral.services.length > 0 && (
                  <p className="text-xs text-sd-gray-text">
                    Pre-selected from your referral — add or change anything you like.
                  </p>
                )}
                {errors.services && (
                  <p className="text-xs font-medium text-destructive">{errors.services.message}</p>
                )}
              </div>
              {error && <p className="text-sm font-semibold text-destructive">{error}</p>}
              <Button
                type="submit"
                disabled={submitting}
                className="mt-1 h-14 w-full rounded-full text-base font-bold"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Accepting…
                  </>
                ) : (
                  "Accept the referral"
                )}
              </Button>
              <p className="text-center text-xs text-sd-gray-text">
                No obligation. We&apos;ll only use this to schedule your free estimate.
              </p>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
