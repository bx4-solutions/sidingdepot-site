import { CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE } from "@/data/site";

export function FinancingBlock() {
  return (
    <section id="financing" className="bg-sd-black text-white py-16 lg:py-20">
      <div className="mx-auto max-w-6xl px-4 lg:px-8 grid gap-10 lg:grid-cols-[1fr_auto] items-center">
        <div>
          <span className="inline-flex items-center gap-2 rounded-pill bg-sd-green/15 border border-sd-green/40 px-3 py-1 text-xs font-bold tracking-[0.12em] uppercase text-sd-green">
            <CreditCard className="h-3.5 w-3.5" /> GreenSky Financing
          </span>
          <h2 className="mt-4 font-display text-3xl sm:text-4xl lg:text-5xl leading-tight">
            Buy Now. <span className="text-sd-green">Pay Over Time.</span>
          </h2>
          <p className="mt-3 text-white/70 max-w-xl">
            Flexible monthly payments through GreenSky. 0% APR plans available for qualified
            homeowners. Apply in minutes — no impact on your credit to check rates.
          </p>
        </div>
        <div className="flex flex-col gap-3 lg:items-end">
          <Button asChild size="lg">
            <a href={SITE.greenSkyUrl} target="_blank" rel="noopener noreferrer">
              Apply Now
            </a>
          </Button>
          <p className="text-xs text-white/50">Subject to credit approval.</p>
        </div>
      </div>
    </section>
  );
}
