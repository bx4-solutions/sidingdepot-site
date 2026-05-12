import { Award, BadgeCheck, ShieldCheck, Star, Wallet, Wrench } from "lucide-react";
import { AWARDS } from "@/data/site";

const ICONS = [Award, Wrench, Star, ShieldCheck, BadgeCheck, Wallet];

export function AwardsStrip() {
  return (
    <section className="py-14 bg-sd-gray-bg border-y border-sd-gray-border">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <p className="text-center text-xs font-bold tracking-[0.16em] uppercase text-sd-gray-text">
          Certified · Awarded · Trusted
        </p>
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {AWARDS.map((a, i) => {
            const Icon = ICONS[i] ?? Award;
            return (
              <div
                key={a.name}
                className="flex flex-col items-center text-center px-3 py-4 rounded-lg bg-white border border-sd-gray-border hover:border-sd-green hover:shadow-md transition-all"
              >
                <Icon className="h-7 w-7 text-sd-green" aria-hidden />
                <p className="mt-2 text-sm font-semibold text-sd-black leading-tight">{a.name}</p>
                <p className="mt-0.5 text-xs text-sd-gray-text">{a.subtitle}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
