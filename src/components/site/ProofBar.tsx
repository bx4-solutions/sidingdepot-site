import { useGoogleStats } from "@/lib/google-stats-context";

export function ProofBar() {
  const { rating, totalReviews } = useGoogleStats();

  const items = [
    {
      icon: "⭐",
      label: `${rating} · ${totalReviews} Google Reviews`,
      href: "https://www.google.com/search?q=Siding+Depot+Marietta+GA+reviews",
      external: true,
    },
    {
      icon: "🏆",
      label: "Elite Preferred · Top 2% US",
      href: "https://www.jameshardie.com/find-a-contractor/results/siding-depot-marietta/",
      external: true,
    },
    {
      icon: "🔨",
      label: "4.7 · 256 GuildQuality Reviews",
      href: "https://www.guildquality.com/profile/siding-depot-llc",
      external: true,
    },
    {
      icon: "🏠",
      label: "1,500+ North Atlanta Homes",
      href: "/projects",
      external: false,
    },
    {
      icon: "💰",
      label: "GreenSky 0% APR Financing for 12 months",
      href: "https://projects.greensky.com/merchantloanapplication?apptype=short&merchant=81018569&dealerplan=2521&channel=External-Button-03",
      external: true,
    },
  ];

  return (
    <section aria-label="Trust signals" className="bg-sd-black border-t-2 border-sd-green">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <ul className="flex flex-wrap lg:flex-nowrap items-center justify-center gap-x-0 py-0">
          {items.map((item, i) => (
            <li key={item.label} className="flex items-center shrink-0">
              <a
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                className="flex items-center gap-1.5 px-3 py-2.5 text-white/80 hover:text-sd-green hover:bg-white/5 transition-colors text-[11px] font-semibold uppercase tracking-wide whitespace-nowrap cursor-pointer"
              >
                <span aria-hidden="true" className="text-sm">
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </a>
              {i < items.length - 1 && <span className="text-white/20 select-none text-xs">·</span>}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
