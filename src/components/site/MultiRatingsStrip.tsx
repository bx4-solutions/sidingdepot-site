import { Star } from "lucide-react";

const RATINGS = [
  {
    platform: "Google",
    score: "4.5",
    label: "158 Reviews",
    href: "https://g.co/kgs/sidingdepot",
  },
  {
    platform: "GuildQuality",
    score: "4.7",
    label: "256 Reviews",
    href: "https://www.guildquality.com/member/siding-depot",
  },
  {
    platform: "BBB",
    score: "A+",
    label: "Accredited",
    href: "https://www.bbb.org/us/ga/marietta/profile/siding-contractor/siding-depot-0443-1000066915",
  },
];

export function MultiRatingsStrip() {
  return (
    <section className="bg-sd-navy border-b border-white/10">
      <div className="mx-auto max-w-7xl px-4 lg:px-8 py-4">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
          {RATINGS.map((r) => (
            <a
              key={r.platform}
              href={r.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-white/90 hover:text-white transition-colors"
            >
              <span className="text-xs font-bold uppercase tracking-wider text-white/60">
                {r.platform}
              </span>
              <span className="flex items-center gap-1">
                {r.score !== "A+" && (
                  <Star className="h-3.5 w-3.5 fill-sd-green text-sd-green" aria-hidden="true" />
                )}
                <span className="text-sm font-bold">{r.score}</span>
              </span>
              <span className="text-xs text-white/50">{r.label}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
