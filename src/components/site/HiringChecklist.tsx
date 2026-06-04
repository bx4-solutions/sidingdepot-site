import { LucideIcon } from "lucide-react";

export interface HiringChecklistItem {
  Icon: LucideIcon;
  title: string;
  desc: string;
}

export function HiringChecklist({ items }: { items: readonly HiringChecklistItem[] }) {
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="max-w-3xl">
          <span className="inline-block rounded-pill bg-sd-green-pale px-3 py-1 text-xs font-bold uppercase tracking-wider text-sd-navy">
            Hire smart
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight text-sd-black">
            What to consider when hiring a{" "}
            <span className="text-sd-green">siding contractor.</span>
          </h2>
          <p className="mt-5 text-base sm:text-lg text-sd-gray-text leading-relaxed">
            Choosing the right siding is a 30-year decision. Use this checklist to verify your contractor meets the highest industry standards for Georgia installations.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(({ Icon, title, desc }) => (
            <div
              key={title}
              className="group rounded-xl border border-sd-gray-border bg-white p-6 transition-all hover:border-sd-green hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-md bg-sd-green-pale text-sd-navy">
                <Icon className="h-5 w-5" strokeWidth={2} />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-sd-black">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-sd-gray-text">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

