import { useState } from "react";
import { z } from "zod";
import { CheckCircle2, Download, FileText, Loader2, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SITE } from "@/data/site";
import { track } from "@/lib/track";

/**
 * Lead-magnet block: capture an email in exchange for the
 * "5 Mistakes You Can't Afford to Make When Replacing Siding in Georgia" PDF.
 *
 * On submit:
 *  - posts the lead to the GHL webhook (tagged source: "lead_magnet_5_mistakes")
 *  - opens the PDF in a new tab so the user gets immediate value
 *  - falls back to a direct download link if the post fails
 */

const PDF_PATH = "/downloads/5-mistakes-siding-georgia.pdf";

const schema = z.object({
  firstName: z.string().trim().min(1, "Required").max(60),
  email: z.string().trim().email("Invalid email").max(255),
});
type Values = z.infer<typeof schema>;

function readUtm(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const sp = new URLSearchParams(window.location.search);
  const out: Record<string, string> = {};
  for (const k of ["utm_source", "utm_medium", "utm_campaign", "utm_keyword", "utm_term", "utm_content"]) {
    const v = sp.get(k);
    if (v) out[k] = v;
  }
  return out;
}

type Props = {
  /** City pre-tagged on the lead (e.g. "Marietta"). */
  city?: string;
  /** Tracking source label (defaults to "lead_magnet"). */
  source?: string;
  /**
   * If provided, called after a successful submit instead of auto-opening
   * the PDF. Lets the parent route navigate the user to a thank-you page
   * (and trigger the download itself).
   */
  onSuccess?: (data: { firstName: string; email: string }) => void;
};

export function LeadMagnet({ city, source = "lead_magnet", onSuccess }: Props) {
  const [values, setValues] = useState<Values>({ firstName: "", email: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof Values, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      const fe: Partial<Record<keyof Values, string>> = {};
      for (const issue of parsed.error.issues) {
        const k = issue.path[0] as keyof Values;
        if (!fe[k]) fe[k] = issue.message;
      }
      setErrors(fe);
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      if (SITE.ghlWebhookUrl) {
        await fetch(SITE.ghlWebhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...parsed.data,
            source,
            tag: "lead_magnet_5_mistakes",
            city: city ?? "",
            landingPage: typeof window !== "undefined" ? window.location.pathname : source,
            submittedAt: new Date().toISOString(),
            ...readUtm(),
          }),
        });
      }
      track("lead_magnet_download", { source, city });
    } catch {
      track("lead_magnet_error", { source });
    } finally {
      setSubmitting(false);
      setDone(true);
      // Trigger download in a new tab so users see the asset immediately.
      if (typeof window !== "undefined") {
        window.open(PDF_PATH, "_blank", "noopener,noreferrer");
      }
    }
  }

  return (
    <section className="bg-sd-gray-bg py-16 lg:py-20">
      <div className="mx-auto max-w-5xl px-4 lg:px-8">
        <div className="grid gap-8 overflow-hidden rounded-2xl border border-sd-gray-border bg-white shadow-sm lg:grid-cols-[1fr_1.1fr]">
          {/* Left: PDF preview / pitch */}
          <div className="relative bg-sd-navy p-8 text-white lg:p-10">
            <span className="inline-flex items-center gap-2 rounded-pill bg-sd-green/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-sd-green ring-1 ring-sd-green/40">
              <FileText className="h-3.5 w-3.5" /> Free Homeowner Guide
            </span>
            <h2 className="mt-5 font-display text-3xl leading-tight sm:text-4xl">
              5 Mistakes You Can&rsquo;t Afford to Make When Replacing Siding in Georgia
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-white/75">
              The same five contract traps wreck siding budgets across North Atlanta every year.
              This 4-page guide shows you how to spot them before you sign &mdash; plus an 8-question
              checklist to bring to every estimate.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-white/85">
              {[
                "How to read a siding quote line by line",
                "The James Hardie certification you must verify",
                "8 questions that filter pros from amateurs",
              ].map((b) => (
                <li key={b} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-sd-green shrink-0" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-[11px] font-semibold uppercase tracking-wider text-white/50">
              4 pages &middot; 5 minute read &middot; PDF
            </p>
          </div>

          {/* Right: Form */}
          <div className="p-8 lg:p-10">
            {done ? (
              <div className="flex h-full flex-col items-start justify-center text-left">
                <CheckCircle2 className="h-12 w-12 text-sd-green" />
                <h3 className="mt-4 text-xl font-bold text-sd-navy">Your guide is on the way!</h3>
                <p className="mt-2 text-sm text-sd-gray-text">
                  The PDF should have opened in a new tab. If it didn&rsquo;t, you can download it directly:
                </p>
                <a
                  href={PDF_PATH}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex h-12 items-center justify-center gap-2 rounded-pill bg-sd-green px-6 font-bold text-sd-navy hover:opacity-90 transition-opacity"
                  onClick={() => track("lead_magnet_fallback_download", { source })}
                >
                  <Download className="h-4 w-4" /> Download the PDF
                </a>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate className="grid gap-4">
                <div>
                  <h3 className="font-display text-2xl text-sd-navy leading-tight">
                    Get the free guide
                  </h3>
                  <p className="mt-1 text-sm text-sd-gray-text">
                    Sent instantly to your inbox &mdash; no spam, ever.
                  </p>
                </div>

                <div className="grid gap-1.5">
                  <Label htmlFor="lm-first" className="text-xs font-semibold text-sd-black">
                    First name
                  </Label>
                  <Input
                    id="lm-first"
                    autoComplete="given-name"
                    value={values.firstName}
                    onChange={(e) => setValues((v) => ({ ...v, firstName: e.target.value }))}
                    aria-invalid={Boolean(errors.firstName)}
                    className="h-11"
                  />
                  {errors.firstName && (
                    <p className="text-[11px] text-destructive">{errors.firstName}</p>
                  )}
                </div>

                <div className="grid gap-1.5">
                  <Label htmlFor="lm-email" className="text-xs font-semibold text-sd-black">
                    Email
                  </Label>
                  <Input
                    id="lm-email"
                    type="email"
                    autoComplete="email"
                    value={values.email}
                    onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
                    aria-invalid={Boolean(errors.email)}
                    className="h-11"
                  />
                  {errors.email && (
                    <p className="text-[11px] text-destructive">{errors.email}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-1 inline-flex h-12 w-full items-center justify-center gap-2 rounded-pill bg-sd-green text-sm font-bold text-sd-navy hover:opacity-90 transition-opacity disabled:opacity-60"
                >
                  {submitting ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Sending&hellip;</>
                  ) : (
                    <><Download className="h-4 w-4" /> SEND ME THE GUIDE</>
                  )}
                </button>

                <p className="flex items-center justify-center gap-1.5 text-[11px] text-sd-gray-text">
                  <ShieldCheck className="h-3.5 w-3.5" /> We&rsquo;ll never share your email.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
