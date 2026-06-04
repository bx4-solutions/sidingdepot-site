import { Link } from "@tanstack/react-router";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BeforeAfterSlider } from "./BeforeAfterSlider";
import { QuoteModal } from "./QuoteModal";
import { BEFORE_AFTER_PAIRS } from "@/data/site";
import { track } from "@/lib/track";

const PAINS = [
  "Subcontractors your contractor never met show up at your door.",
  "The final invoice has line items that weren't in the estimate.",
  "Calls go unanswered once the deposit clears.",
  "Wood rot is \"discovered\" mid-project and the price doubles.",
  "You spend $20,000 — and still have to call someone else to fix it.",
];

const SLIDER_SOURCE = "Before/After Slider";

export function PainPointsSection() {
  const pair = BEFORE_AFTER_PAIRS[0];

  return (
    <section className="py-20 lg:py-24 bg-sd-gray-bg">
      <div className="mx-auto max-w-7xl px-4 lg:px-8 grid gap-12 lg:grid-cols-2 items-start">
        <div>
          <BeforeAfterSlider
            before={pair.before}
            after={pair.after}
            beforeAlt={pair.beforeAlt}
            afterAlt={pair.afterAlt}
          />
          <p className="mt-3 text-xs text-muted-foreground text-center">
            Drag the slider — or use the arrow keys — to see the transformation.
          </p>

          {/* Lead-capture CTA next to the slider */}
          <div className="mt-5 rounded-xl section-dark p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 shadow-lg ring-1 ring-white/5">
            <div className="flex-1 min-w-0">
              <p className="text-foreground font-semibold text-sm sm:text-base">
                Want to see your home transformed like this? Our team has completed 1,500+ projects across Greater Marietta, Alpharetta and North Atlanta.
              </p>
              <p className="text-muted-foreground text-xs sm:text-sm mt-0.5">
                Free estimate · response within 24h.
              </p>
            </div>
            <QuoteModal
              source={SLIDER_SOURCE}
              trigger={
                <Button
                  size="lg"
                  className="w-full sm:w-auto shrink-0"
                  onClick={() => track("quote_cta_click", { source: SLIDER_SOURCE })}
                >
                  Get Your Quote
                </Button>
              }
            />
          </div>

          
        </div>

        <div>
          <span className="inline-flex items-center gap-2 rounded-pill bg-sd-green-pale px-3 py-1 text-xs font-bold tracking-[0.12em] uppercase text-sd-green-text">
            <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" /> The Risk of Getting It Wrong
          </span>
          <h2 className="mt-4 font-display text-4xl sm:text-5xl text-foreground leading-[1.05]">
            Choosing the Wrong Contractor Is a <span className="text-sd-green">$20,000 Mistake.</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-lg">
            Choosing the wrong North Atlanta exterior contractor is a costly mistake. Ask yourself
            — what if you hire a contractor and then:
          </p>
          <ul className="mt-6 space-y-3">
            {PAINS.map((p) => (
              <li key={p} className="flex gap-3 text-sm text-foreground">
                <span className="mt-1.5 inline-block h-1.5 w-1.5 rounded-full bg-sd-green shrink-0" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-muted-foreground max-w-lg">
            Don&apos;t put yourself in that situation.{" "}
            <span className="font-semibold text-foreground">Siding Depot</span> uses only 
            highly specialized certified teams — trained, insured, and accountable to us 

            directly. Every project has a dedicated manager on-site. Every 
            estimate is written, itemized, and guaranteed. No surprises. 
            No strangers at your door.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/">Get Free Quote</Link>
            </Button>
            <Button asChild size="lg" variant="dark">
              <Link to="/">See Our Process</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
