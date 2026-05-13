import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import {
  CheckCircle2,
  Loader2,
  Phone,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SITE } from "@/data/site";
import { track } from "@/lib/track";

const HERO_IMAGE =
  "https://assets.cdn.filesafe.space/VPwAmJKkB62wR0BJhYil/media/68cb2a4e8c4437153cdbaa3b.jpeg";

export const Route = createFileRoute("/dumpster-rental")({
  head: () => ({
    meta: [
      { title: "Dumpster Rental in Marietta, GA — Reserve Your Roll-Off | Siding Depot" },
      {
        name: "description",
        content:
          "Reserve a 10, 15 or 20-yard dumpster in Marietta, Canton, Alpharetta and across North Atlanta. Same-day / next-day drop-off, transparent pricing, no hidden fees.",
      },
      { property: "og:title", content: "Reserve Your Dumpster — North Atlanta" },
      {
        property: "og:description",
        content:
          "Same-day / next-day delivery. 10, 15, 20 yd. Licensed & insured. Reserve in 60 seconds.",
      },
      { property: "og:image", content: HERO_IMAGE },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Reserve Your Dumpster — North Atlanta" },
      { name: "twitter:description", content: "Same-day / next-day delivery. 10, 15, 20 yd. Licensed & insured. Reserve in 60 seconds." },
      { name: "twitter:image", content: HERO_IMAGE },
    ],
  }),
  component: DumpsterRentalPage,
});

const PAYMENT_METHODS = ["Check", "Zelle", "Cash", "Credit Card (3% fee)"] as const;
type PaymentMethod = (typeof PAYMENT_METHODS)[number];

const schema = z.object({
  firstName: z.string().trim().min(1, "Required").max(60),
  lastName: z.string().trim().min(1, "Required").max(60),
  phone: z.string().trim().min(7, "Enter a valid phone").max(20),
  email: z.string().trim().email("Invalid email").max(255),
  street: z.string().trim().min(1, "Required").max(160),
  city: z.string().trim().min(1, "Required").max(80),
  state: z.string().trim().min(2, "Required").max(40),
  zip: z.string().trim().min(3, "Required").max(10),
  dropDate: z.string().trim().min(1, "Pick a date"),
  earlyPickup: z.enum(["Yes", "No"], { message: "Required" }),
  placement: z.string().trim().min(1, "Required").max(240),
  payment: z.enum(PAYMENT_METHODS, { message: "Pick one" }),
  consent: z.literal(true, { message: "Required to receive your confirmation" }),
});
type FormValues = z.infer<typeof schema>;

const initial: FormValues = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  street: "",
  city: "",
  state: "GA",
  zip: "",
  dropDate: "",
  earlyPickup: "No",
  placement: "",
  payment: "Check",
  // satisfies the literal(true) discriminator at runtime; UI starts unchecked
  consent: false as unknown as true,
};

const DUMPSTER_SIZES = [
  { size: "10 yd", use: "Garage clean-outs, small remodels, single room" },
  { size: "15 yd", use: "Kitchen / bath remodels, roofing tear-offs" },
  { size: "20 yd", use: "Whole-home renovations, siding replacement" },
] as const;

function DumpsterRentalPage() {
  const [values, setValues] = useState<FormValues>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof FormValues, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  function update<K extends keyof FormValues>(k: K, v: FormValues[K]) {
    setValues((prev) => ({ ...prev, [k]: v }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      const fe: Partial<Record<keyof FormValues, string>> = {};
      for (const issue of parsed.error.issues) {
        const k = issue.path[0] as keyof FormValues;
        if (!fe[k]) fe[k] = issue.message;
      }
      setErrors(fe);
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      if (SITE.ghlWebhookUrl) {
        // Prepare data for GHL Dumpster Reservation
        const payload = {
          first_name: parsed.data.firstName,
          last_name: parsed.data.lastName,
          email: parsed.data.email,
          phone: parsed.data.phone,
          street: parsed.data.street,
          city: parsed.data.city,
          state: parsed.data.state,
          zip: parsed.data.zip,
          drop_date: parsed.data.dropDate,
          early_pickup: parsed.data.earlyPickup,
          placement_instructions: parsed.data.placement,
          payment_method: parsed.data.payment,
          source: "dumpster_rental_lp",
          tag: "dumpster_reservation",
          submittedAt: new Date().toISOString(),
        };

        const response = await fetch(SITE.ghlWebhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error("Webhook failed");
      }
      track("dumpster_rental_submit", {
        city: parsed.data.city,
        payment: parsed.data.payment,
      });
      setDone(true);
    } catch {
      track("dumpster_rental_error", {});
      setDone(true);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Navbar />
      <main className="bg-sd-gray-bg">
        {/* Hero */}
        <section className="relative isolate overflow-hidden">
          <img
            src={HERO_IMAGE}
            alt="Bright green Siding Depot dumpsters lined up ready for delivery"
            loading="eager"
            decoding="async"
            className="absolute inset-0 -z-10 h-full w-full object-cover"
          />
          {/* Lighter left-to-right scrim only on the text side, plus a subtle
              bottom fade — keeps the dumpster photo clearly visible while
              preserving headline contrast. */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-sd-navy/80 via-sd-navy/45 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 -z-10 h-24 bg-gradient-to-t from-sd-navy/60 to-transparent" />
          <div className="mx-auto max-w-6xl px-4 py-16 text-white lg:px-8 lg:py-24">
            <span className="inline-flex items-center gap-2 rounded-pill bg-sd-green/20 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-sd-green ring-1 ring-sd-green/40">
              <Truck className="h-3.5 w-3.5" /> Dumpster Rental · North Atlanta
            </span>
            <h1 className="mt-5 max-w-3xl font-display text-4xl leading-tight sm:text-5xl">
              Reserve a roll-off dumpster &mdash; same-day or next-day delivery.
            </h1>
            <p className="mt-4 max-w-2xl text-base text-white/80">
              10, 15 and 20-yard dumpsters dropped where you need them. Transparent
              pricing, no surprise fees, and a real human answering your calls.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href={SITE.phoneHref}
                onClick={() => track("dumpster_rental_phone_click", {})}
                className="inline-flex h-12 items-center gap-2 rounded-pill bg-sd-green px-6 text-sm font-bold text-sd-navy hover:opacity-90"
              >
                <Phone className="h-4 w-4" /> {SITE.phone}
              </a>
              <a
                href="#reserve"
                className="inline-flex h-12 items-center gap-2 rounded-pill bg-white/10 px-6 text-sm font-bold text-white ring-1 ring-white/25 hover:bg-white/15"
              >
                Reserve online
              </a>
            </div>
          </div>
        </section>

        {/* Body grid */}
        <section id="reserve" className="py-14 lg:py-20">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 lg:grid-cols-[1fr_1.15fr] lg:px-8">
            {/* Left: pitch */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-sd-green">
                Service
              </span>
              <h2 className="mt-2 font-display text-3xl text-sd-navy sm:text-4xl">
                Dumpster Rentals
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-sd-gray-text">
                Whether you&rsquo;re tackling a home renovation, cleaning out the garage
                or managing debris from a construction project, our roll-offs make waste
                removal simple. Each rental includes convenient delivery, on-time pickup
                and responsible disposal.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-sd-gray-text">
                Flexible scheduling, competitive rates, and the same crew that handles
                James Hardie installs across North Atlanta &mdash; you keep the project
                on track and the property clean.
              </p>

              <div className="mt-8 rounded-2xl border border-sd-gray-border bg-white p-5 shadow-sm">
                <h3 className="text-sm font-bold uppercase tracking-wider text-sd-navy">
                  Pick the right size
                </h3>
                <ul className="mt-3 space-y-3">
                  {DUMPSTER_SIZES.map((d) => (
                    <li key={d.size} className="flex items-start gap-3 text-sm">
                      <span className="mt-0.5 inline-flex h-7 min-w-[3.25rem] items-center justify-center rounded-md bg-sd-green/15 px-2 font-bold text-sd-navy">
                        {d.size}
                      </span>
                      <span className="text-sd-gray-text">{d.use}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <ul className="mt-6 space-y-2 text-sm text-sd-gray-text">
                {[
                  "Same-day or next-day delivery in Marietta, Canton, Alpharetta",
                  "Driveway-safe drop with plywood protection on request",
                  "7-day standard rental, early pickup available",
                  "Licensed & insured Georgia GC #RBQA006789",
                ].map((b) => (
                  <li key={b} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-sd-green" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: form */}
            <div className="rounded-2xl border border-sd-gray-border bg-white p-6 shadow-sm lg:p-8">
              {done ? (
                <div className="flex h-full flex-col items-start justify-center text-left">
                  <CheckCircle2 className="h-12 w-12 text-sd-green" />
                  <h3 className="mt-4 font-display text-2xl text-sd-navy">
                    Reservation received!
                  </h3>
                  <p className="mt-2 text-sm text-sd-gray-text">
                    A team member will confirm your dumpster drop within one business
                    hour. Need to reach us sooner?
                  </p>
                  <a
                    href={SITE.phoneHref}
                    className="mt-5 inline-flex h-12 items-center gap-2 rounded-pill bg-sd-green px-6 font-bold text-sd-navy hover:opacity-90"
                  >
                    <Phone className="h-4 w-4" /> {SITE.phone}
                  </a>
                </div>
              ) : (
                <form onSubmit={onSubmit} noValidate className="grid gap-5">
                  <div>
                    <h3 className="font-display text-2xl text-sd-navy">Reserve your dumpster</h3>
                    <p className="mt-1 text-sm text-sd-gray-text">
                      Takes about 60 seconds. We&rsquo;ll confirm by phone within an hour.
                    </p>
                  </div>

                  {/* Name */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="First Name" error={errors.firstName} htmlFor="dr-first">
                      <Input id="dr-first" autoComplete="given-name" value={values.firstName}
                        onChange={(e) => update("firstName", e.target.value)} className="h-11" />
                    </Field>
                    <Field label="Last Name" error={errors.lastName} htmlFor="dr-last">
                      <Input id="dr-last" autoComplete="family-name" value={values.lastName}
                        onChange={(e) => update("lastName", e.target.value)} className="h-11" />
                    </Field>
                  </div>

                  {/* Contact */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Phone" error={errors.phone} htmlFor="dr-phone">
                      <Input id="dr-phone" type="tel" autoComplete="tel" value={values.phone}
                        onChange={(e) => update("phone", e.target.value)} className="h-11" />
                    </Field>
                    <Field label="Email" error={errors.email} htmlFor="dr-email">
                      <Input id="dr-email" type="email" autoComplete="email" value={values.email}
                        onChange={(e) => update("email", e.target.value)} className="h-11" />
                    </Field>
                  </div>

                  {/* Address */}
                  <Field label="Street Address" error={errors.street} htmlFor="dr-street">
                    <Input id="dr-street" autoComplete="address-line1" value={values.street}
                      onChange={(e) => update("street", e.target.value)} className="h-11" />
                  </Field>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <Field label="City" error={errors.city} htmlFor="dr-city">
                      <Input id="dr-city" autoComplete="address-level2" value={values.city}
                        onChange={(e) => update("city", e.target.value)} className="h-11" />
                    </Field>
                    <Field label="State" error={errors.state} htmlFor="dr-state">
                      <Input id="dr-state" autoComplete="address-level1" value={values.state}
                        onChange={(e) => update("state", e.target.value)} className="h-11" />
                    </Field>
                    <Field label="ZIP code" error={errors.zip} htmlFor="dr-zip">
                      <Input id="dr-zip" autoComplete="postal-code" value={values.zip}
                        onChange={(e) => update("zip", e.target.value)} className="h-11" />
                    </Field>
                  </div>

                  {/* Drop date */}
                  <Field label="When do you need dumpster dropped?" error={errors.dropDate} htmlFor="dr-date">
                    <Input id="dr-date" type="date" value={values.dropDate}
                      onChange={(e) => update("dropDate", e.target.value)} className="h-11" />
                  </Field>

                  {/* Early pickup */}
                  <Field label="Will you need it picked up earlier than the 7 day rental period?" error={errors.earlyPickup} htmlFor="dr-early">
                    <Select value={values.earlyPickup} onValueChange={(v) => update("earlyPickup", v as "Yes" | "No")}>
                      <SelectTrigger id="dr-early" className="h-11">
                        <SelectValue placeholder="Select…" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="No">No — keep the full 7 days</SelectItem>
                        <SelectItem value="Yes">Yes — pick it up early</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>

                  {/* Placement */}
                  <Field label="Where on the property would you like the dumpster placed?" error={errors.placement} htmlFor="dr-place">
                    <Input id="dr-place" placeholder="e.g. Driveway, left side near garage" value={values.placement}
                      onChange={(e) => update("placement", e.target.value)} className="h-11" />
                  </Field>

                  {/* Payment */}
                  <div>
                    <span className="text-xs font-semibold text-sd-black">
                      What payment method will you use?
                    </span>
                    <RadioGroup
                      value={values.payment}
                      onValueChange={(v) => update("payment", v as PaymentMethod)}
                      className="mt-2 grid gap-2 sm:grid-cols-2"
                    >
                      {PAYMENT_METHODS.map((m) => (
                        <label
                          key={m}
                          className="flex items-center gap-2 rounded-md border border-sd-gray-border px-3 py-2.5 text-sm hover:border-sd-green cursor-pointer has-[:checked]:border-sd-green has-[:checked]:bg-sd-green/5"
                        >
                          <RadioGroupItem value={m} id={`pay-${m}`} />
                          <span>{m}</span>
                        </label>
                      ))}
                    </RadioGroup>
                    {errors.payment && (
                      <p className="mt-1 text-[11px] text-destructive">{errors.payment}</p>
                    )}
                  </div>

                  {/* Consent */}
                  <label className="flex items-start gap-3 rounded-md border border-sd-gray-border bg-sd-gray-bg/40 p-3 text-[12px] leading-relaxed text-sd-gray-text">
                    <Checkbox
                      checked={Boolean(values.consent)}
                      onCheckedChange={(c) => update("consent", (c === true) as unknown as true)}
                      className="mt-0.5"
                    />
                    <span>
                      By checking this box, I agree to receive SMS text messages and emails
                      from {SITE.legalName}. Message frequency varies. Standard message
                      and data rates may apply. Text STOP to opt out at any time.
                    </span>
                  </label>
                  {errors.consent && (
                    <p className="-mt-3 text-[11px] text-destructive">{errors.consent}</p>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="mt-1 inline-flex h-12 w-full items-center justify-center gap-2 rounded-pill bg-sd-green text-sm font-bold text-sd-navy hover:opacity-90 transition-opacity disabled:opacity-60"
                  >
                    {submitting ? (
                      <><Loader2 className="h-4 w-4 animate-spin" /> Sending…</>
                    ) : (
                      <>RESERVE MY DUMPSTER</>
                    )}
                  </button>

                  <p className="flex items-center justify-center gap-1.5 text-[11px] text-sd-gray-text">
                    <ShieldCheck className="h-3.5 w-3.5" /> Your info is private &mdash; we never share it.
                  </p>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

/* ---------- helpers ---------- */
function Field({
  label,
  error,
  htmlFor,
  children,
}: {
  label: string;
  error?: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={htmlFor} className="text-xs font-semibold text-sd-black">
        {label}
      </Label>
      {children}
      {error && <p className="text-[11px] text-destructive">{error}</p>}
    </div>
  );
}
