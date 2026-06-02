import { PROOF_BAR } from "@/data/site";

export function ProofBar() {
  return (
    <section
      aria-label="Trust signals"
      className="bg-sd-black border-t-[3px] border-sd-green"
    >
      <div className="mx-auto max-w-7xl px-4 lg:px-8 py-5">
        <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-white/90 text-sm font-bold uppercase tracking-wider">
          {PROOF_BAR.map((p) => (
            <li key={p.label} className="flex items-center gap-2">
              <span aria-hidden="true" className="text-base">{p.icon}</span>
              <span className="font-medium">{p.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
