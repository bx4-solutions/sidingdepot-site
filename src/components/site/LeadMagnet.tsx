import { CheckCircle2, FileText } from "lucide-react";
import { HeroQuoteForm } from "@/components/site/HeroQuoteForm";

type Props = {
  /** City pre-tagged on the lead (e.g. "Marietta"). */
  city?: string;
  /** Tracking source label (defaults to "lead_magnet"). */
  source?: string;
  /** Kept for backwards-compat with parent routes; ignored now that the
   *  form is the standardized HeroQuoteForm. */
  onSuccess?: (data: { firstName: string; email: string }) => void;
};

export function LeadMagnet({ source = "lead_magnet" }: Props) {
  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="mx-auto max-w-5xl px-4 lg:px-8">
        <div className="grid gap-8 overflow-hidden rounded-2xl border border-border bg-background shadow-sm lg:grid-cols-[1fr_1.1fr]">
          {/* Left: PDF preview / pitch */}
          <div className="relative section-dark-alt p-8 text-white lg:p-10">
            <span className="inline-flex items-center gap-2 rounded-pill bg-sd-green/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-sd-green-dark ring-1 ring-sd-green/40">
              <FileText className="h-3.5 w-3.5" /> Free Homeowner Guide
            </span>
            <h2 className="mt-5 font-display text-3xl leading-tight sm:text-4xl">
              5 Mistakes You Can&rsquo;t Afford to Make When Replacing Siding in Georgia
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-white/75">
              The same five contract traps wreck siding budgets across North Atlanta every year.
              Request a quote and our team will share the full guide along with a written estimate.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-white/85">
              {[
                "How to read a siding quote line by line",
                "The James Hardie certification you must verify",
                "8 questions that filter pros from amateurs",
              ].map((b) => (
                <li key={b} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-sd-green-dark shrink-0" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: Simple lead form (Name + Phone + Email → Download) */}
          <div className="p-6 lg:p-8 flex items-center">
            <div className="w-full">
              <h3 className="font-display text-xl text-foreground uppercase tracking-tight mb-1">
                Get Instant Access
              </h3>
              <p className="text-sm text-muted-foreground mb-5">
                Leave your details and download the guide right away.
              </p>
              <HeroQuoteForm source={source} tag="lead_magnet_request" bare />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
