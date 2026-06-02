import { ClipboardCheck, Hammer, PartyPopper } from "lucide-react";
import { PROCESS_STEPS } from "@/data/site";

const ICONS = [ClipboardCheck, Hammer, PartyPopper];

export function ProcessTimeline() {
  return (
    <section className="py-20 lg:py-24 bg-background">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-block text-xs font-bold tracking-[0.12em] uppercase text-sd-green-text bg-sd-green-pale px-3 py-1 rounded">
            Our Process
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-foreground">
            It&apos;s Easy to Start Your Exterior Project
          </h2>
          <p className="mt-3 text-muted-foreground">
            Three steps. Zero surprises. Total transparency from quote to handshake.
          </p>
        </div>

        <div className="relative mt-16 grid gap-10 md:grid-cols-3 md:gap-6">
          {/* connector line (desktop only) */}
          <div
            aria-hidden
            className="hidden md:block absolute top-8 left-[16%] right-[16%] h-0.5 bg-sd-gray-border"
          />
          {PROCESS_STEPS.map((step, i) => {
            const Icon = ICONS[i];
            return (
              <div key={step.num} className="relative flex flex-col items-center text-center">
                <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-sd-green text-sd-navy shadow-lg">
                  <Icon className="h-7 w-7" />
                </div>
                <span className="mt-4 font-display text-2xl text-sd-green">{step.num}</span>
                <h3 className="mt-1 text-lg font-semibold text-foreground">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground max-w-xs">{step.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
