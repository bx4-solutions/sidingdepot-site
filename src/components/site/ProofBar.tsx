import { PROOF_BAR } from "@/data/site";
import { useGoogleStats } from "@/lib/google-stats-context";

export function ProofBar() {
  const { rating, totalReviews } = useGoogleStats();
  // Replace the static Google entry with live API data; keep all others as-is
  const items = PROOF_BAR.map((p) =>
    p.label.includes("Google") ? { ...p, label: `${rating} · ${totalReviews} Google Reviews` } : p,
  );

  return (
    <section aria-label="Trust signals" className="bg-sd-black border-t-[3px] border-sd-green">
      <div className="mx-auto max-w-7xl px-4 lg:px-8 py-5">
        <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-white/90 text-sm font-bold uppercase tracking-wider">
          {items.map((p) => (
            <li key={p.label} className="flex items-center gap-2">
              <span aria-hidden="true" className="text-base">
                {p.icon}
              </span>
              <span className="font-medium">{p.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
