import { Link } from "@tanstack/react-router";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BeforeAfterSlider } from "./BeforeAfterSlider";
import { BEFORE_AFTER_PAIRS } from "@/data/site";

const PAINS = [
  "Crews cut corners because there's no on-site project manager.",
  "They pad your invoice with work that wasn't actually done.",
  "They stop returning your calls mid-project.",
  "You get stuck with a half-finished home and a dead contractor.",
  "You spend the money — and still hate the way your house looks.",
];

export function PainPointsSection() {
  const pair = BEFORE_AFTER_PAIRS[0];

  return (
    <section className="py-20 lg:py-24 bg-sd-gray-bg">
      <div className="mx-auto max-w-7xl px-4 lg:px-8 grid gap-12 lg:grid-cols-2 items-center">
        <div>
          <BeforeAfterSlider
            before={pair.before}
            after={pair.after}
            beforeAlt={pair.beforeAlt}
            afterAlt={pair.afterAlt}
          />
          <p className="mt-3 text-xs text-sd-gray-text text-center">
            Drag the slider to see the transformation.
          </p>
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
