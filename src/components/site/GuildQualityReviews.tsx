const RECENT_REVIEWS = [
  {
    name: "Reviewer in Marietta, GA",
    location: "Marietta, GA",
    date: "Apr 27, 2025",
    stars: 5,
    verified: true,
    text: "Siding Depot did great work and were very professional.",
  },
  {
    name: "Ozzie S.",
    location: "Marietta, GA",
    date: "Dec 9, 2024",
    stars: 5,
    verified: true,
    text: "I had 4 different companies come to the property to give me an estimate on a portion of my home. Siding Depot was the most thorough, most professional, and delivered exactly what they promised.",
  },
  {
    name: "Elmer W.",
    location: "Kennesaw, GA",
    date: "Oct 23, 2024",
    stars: 5,
    verified: true,
    text: "I had three estimates. They had the best price of all three and they had outstanding professionalism. The crew was clean, efficient, and the result was better than I expected.",
  },
  {
    name: "Reviewer in Canton, GA",
    location: "Canton, GA",
    date: "Sep 14, 2024",
    stars: 5,
    verified: true,
    text: "From the first call to the final walkthrough, everything was handled with care. They showed up on time every day and left the property clean. Highly recommend.",
  },
  {
    name: "Reviewer in Alpharetta, GA",
    location: "Alpharetta, GA",
    date: "Aug 5, 2024",
    stars: 5,
    verified: true,
    text: "The crew was courteous and knowledgeable. The project manager checked in daily. We are very happy with our new siding and the whole experience.",
  },
  {
    name: "Reviewer in Marietta, GA",
    location: "Marietta, GA",
    date: "Jul 18, 2024",
    stars: 5,
    verified: true,
    text: "Excellent communication throughout the entire project. The written estimate matched the final bill exactly — no surprises. Would use Siding Depot again without hesitation.",
  },
  {
    name: "Reviewer in Woodstock, GA",
    location: "Woodstock, GA",
    date: "Jun 2, 2024",
    stars: 5,
    verified: true,
    text: "Nick and his team are top notch. They replaced our siding and gutters and the house looks brand new. Very competitive pricing and professional from start to finish.",
  },
  {
    name: "Reviewer in Roswell, GA",
    location: "Roswell, GA",
    date: "May 10, 2024",
    stars: 5,
    verified: true,
    text: "James Hardie product looks amazing. The installation was flawless and the crew was respectful of our property. Could not be happier with the outcome.",
  },
];

export function GuildQualityReviews() {

  const ratingRows = [
    { stars: 5, count: 206, total: 261 },
    { stars: 4, count: 34, total: 261 },
    { stars: 3, count: 9, total: 261 },
    { stars: 2, count: 3, total: 261 },
    { stars: 1, count: 4, total: 261 },
  ];

  const satisfaction = [
    { label: "Concern For Needs", pct: 96 },
    { label: "Value", pct: 95 },
    { label: "Likely To Recommend", pct: 92 },
    { label: "Professional & Organized", pct: 91 },
    { label: "Follow Up", pct: 91 },
    { label: "Communication", pct: 88 },
  ];

  return (
    <section className="py-16 lg:py-20 bg-white border-t border-gray-100">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* ── Header — company card ── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8 pb-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            {/* GuildQuality badge */}
            <div className="w-14 h-14 rounded-xl bg-[#1a3a5c] flex items-center justify-center shrink-0">
              <svg viewBox="0 0 40 40" className="w-8 h-8" fill="none">
                <circle cx="20" cy="20" r="18" fill="#f5a623" />
                <path
                  d="M20 10l2.5 7.5h7.9l-6.4 4.7 2.5 7.5L20 25.2l-6.5 4.5 2.5-7.5-6.4-4.7h7.9z"
                  fill="white"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#1a3a5c]">Siding Depot LLC</h2>
              <div className="flex items-center gap-2 mt-0.5">
                <div className="flex text-[#f5a623] text-lg">★★★★★</div>
                <a
                  href="https://www.guildquality.com/profile/siding-depot-llc?tab=reviews"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#f5a623] font-semibold text-sm hover:underline"
                >
                  261 Reviews
                </a>
              </div>
            </div>
          </div>
          <div className="sm:ml-auto">
            <a
              href="https://www.guildquality.com/profile/siding-depot-llc?tab=reviews"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#1a3a5c] border border-[#1a3a5c]/20 px-4 py-2 rounded-lg hover:bg-[#1a3a5c]/5 transition-colors"
            >
              View full profile →
            </a>
          </div>
        </div>

        {/* ── Main grid ── */}
        <div className="grid lg:grid-cols-[280px_1fr_1fr] gap-6">
          {/* LEFT — Satisfaction bars */}
          <div>
            {/* About surveys box */}
            <div className="border border-gray-200 rounded-xl p-4 mb-5 bg-gray-50">
              <p className="text-xs font-bold text-[#1a3a5c] mb-1">GuildQuality surveys</p>
              <p className="text-xs text-gray-500 leading-relaxed">
                Feedback collected by GuildQuality using impartial third-party surveys.
              </p>
            </div>

            {/* Satisfaction */}
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
              Satisfaction
            </p>
            <div className="space-y-3">
              {satisfaction.map(({ label, pct }) => (
                <div key={label}>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs font-semibold text-[#1a3a5c]">{label}</span>
                    <span className="text-xs font-bold text-[#1a3a5c]">{pct}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${pct}%`, background: "#4caf50" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* MIDDLE — Rating summary */}
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
              Reviews <span className="text-gray-300">261</span>
            </p>
            <div className="border border-gray-200 rounded-xl p-5">
              <div className="flex items-start gap-6 mb-5 pb-5 border-b border-gray-100">
                <div>
                  <p className="text-5xl font-bold text-[#f5a623] leading-none">4.7</p>
                  <div className="flex text-[#f5a623] mt-1">★★★★★</div>
                  <p className="text-[11px] text-gray-400 mt-1">240 of 256 would recommend</p>
                </div>
                <div className="flex-1 space-y-1.5 pt-1">
                  {ratingRows.map(({ stars, count, total }) => (
                    <div key={stars} className="flex items-center gap-2">
                      <div className="flex text-[#f5a623] text-[10px] w-16 shrink-0">
                        {"★".repeat(stars)}
                        {"☆".repeat(5 - stars)}
                      </div>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#1a3a5c]"
                          style={{ width: `${(count / total) * 100}%` }}
                        />
                      </div>
                      <span className="text-[11px] text-gray-400 w-6 text-right">{count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Project map */}
              <div className="rounded-lg overflow-hidden h-[200px]">
                <iframe
                  src="https://www.guildquality.com/embed/projects/NDAzMDQ0"
                  title="Siding Depot project map"
                  style={{ padding: 0, margin: 0, border: 0, height: "100%", width: "100%" }}
                  loading="lazy"
                />
              </div>
              <p className="text-[11px] text-gray-400 mt-2 text-center">
                569 projects across North Atlanta
              </p>
            </div>
          </div>

          {/* RIGHT — Recent reviews */}
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
              Recent Reviews
            </p>
            <div className="space-y-3 overflow-y-auto" style={{ maxHeight: "560px" }}>
              {RECENT_REVIEWS.map((r, i) => (
                <div key={i} className="border border-gray-200 rounded-xl p-4 bg-white">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <p className="text-sm font-bold text-[#1a3a5c]">{r.name}</p>
                      <p className="text-[11px] text-gray-400">{r.location} · {r.date}</p>
                    </div>
                    <div className="flex text-[#f5a623] text-sm shrink-0">{"★".repeat(r.stars)}</div>
                  </div>
                  {r.verified && (
                    <p className="text-[10px] text-[#1a7abf] font-semibold mb-1.5">✓ Verified</p>
                  )}
                  <p className="text-xs text-gray-600 leading-relaxed">{r.text}</p>
                </div>
              ))}
              <a
                href="https://www.guildquality.com/profile/siding-depot-llc?tab=reviews"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center text-xs font-semibold text-[#1a3a5c] hover:underline pt-1 pb-2"
              >
                View all 261 reviews on GuildQuality →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
