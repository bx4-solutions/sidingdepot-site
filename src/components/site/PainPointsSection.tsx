import { Link } from "@tanstack/react-router";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BeforeAfterSlider } from "./BeforeAfterSlider";
import { RelatedProjects } from "./RelatedProjects";
import { QuoteModal } from "./QuoteModal";
import { BEFORE_AFTER_PAIRS } from "@/data/site";
import { track } from "@/lib/track";

const PAINS = [
  "Crews cut corners because there's no on-site project manager.",
  "They pad your invoice with work that wasn't actually done.",
  "They stop returning your calls mid-project.",
  "You get stuck with a half-finished home and a dead contractor.",
  "You spend the money — and still hate the way your house looks.",
];

const SLIDER_SOURCE = "Slider antes/depois";

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
          <p className="mt-3 text-xs text-sd-gray-text text-center">
            Drag the slider — or use the arrow keys — to see the transformation.
          </p>

          {/* Lead-capture CTA next to the slider */}
          <div className="mt-5 rounded-xl bg-sd-navy p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 shadow-lg ring-1 ring-white/5">
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm sm:text-base">
                Quer ver sua casa transformada assim?
              </p>
              <p className="text-white/65 text-xs sm:text-sm mt-0.5">
                Orçamento gratuito · resposta em 24h.
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
                  Solicitar Orçamento
                </Button>
              }
            />
          </div>

          <RelatedProjects />
        </div>

        <div>
          <span className="inline-flex items-center gap-2 rounded-pill bg-sd-green-pale px-3 py-1 text-xs font-bold tracking-[0.12em] uppercase text-sd-green-text">
            <AlertTriangle className="h-3.5 w-3.5" /> The Hidden Cost
          </span>
          <h2 className="mt-4 font-display text-4xl sm:text-5xl text-sd-black leading-[1.05]">
            An Exterior Renovation Is a <span className="text-sd-green">Big Project.</span>
          </h2>
          <p className="mt-4 text-sd-gray-text max-w-lg">
            Choosing the wrong North Atlanta exterior contractor is a costly mistake. Ask yourself
            — what if you hire a contractor and then:
          </p>
          <ul className="mt-6 space-y-3">
            {PAINS.map((p) => (
              <li key={p} className="flex gap-3 text-sm text-sd-black">
                <span className="mt-1.5 inline-block h-1.5 w-1.5 rounded-full bg-sd-green shrink-0" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sd-gray-text max-w-lg">
            Don&apos;t put yourself in that situation.{" "}
            <span className="font-semibold text-sd-black">Siding Depot</span> delivers professional
            renovation and restoration services Georgia homeowners actually trust.
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
