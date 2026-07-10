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
    <section id="guild-reviews" className="py-16 lg:py-20 bg-white border-t border-gray-100">
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
                  href="/#guild-reviews"
                  className="text-[#f5a623] font-semibold text-sm hover:underline"
                >
                  261 Reviews
                </a>
              </div>
            </div>
          </div>
          <div className="sm:ml-auto">
            <a
              href="/#guild-reviews"
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#1a3a5c] border border-[#1a3a5c]/20 px-4 py-2 rounded-lg hover:bg-[#1a3a5c]/5 transition-colors"
            >
              View full profile →
            </a>
          </div>
        </div>

        {/* ── Main grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
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

              <p className="text-[11px] text-gray-400 mt-2 text-center">
                569 projects across North Atlanta
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
