import { useEffect } from "react";

export function GuildQualityReviews() {
  useEffect(() => {
    // GuildQuality requires this callback defined BEFORE their script executes
    (window as any).embedGQwidget = function (html: string) {
      const el = document.getElementById("gq3-reviews-widget");
      if (el) el.innerHTML = html;
    };

    if (document.getElementById("gq3-reviews-script")) return;

    const script = document.createElement("script");
    script.id = "gq3-reviews-script";
    script.type = "text/javascript";
    script.async = true;
    script.src = "https://www.guildquality.com/embed/reviews/NDAzMDQ0/all";
    document.body.appendChild(script);
  }, []);

  return (
    <section className="py-20 lg:py-24 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-bold tracking-[0.12em] uppercase text-sd-green-text bg-sd-green-pale px-3 py-1 rounded mb-4">
            Verified Customer Reviews
          </span>
          <h2 className="font-display text-4xl sm:text-5xl text-sd-black leading-tight">
            What Homeowners Say
            <span className="block text-sd-green-text">About Siding Depot.</span>
          </h2>
          <p className="mt-4 text-sd-gray-text max-w-xl mx-auto">
            4.7 stars · 303 verified reviews on GuildQuality — the industry's independent contractor
            review platform. Every review is tied to a real completed project.
          </p>
        </div>

        {/* Satisfaction score bars — sourced from GuildQuality profile */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-10">
          {[
            { label: "Concern For Needs", pct: 96 },
            { label: "Value", pct: 95 },
            { label: "Likely To Recommend", pct: 92 },
            { label: "Professional & Organized", pct: 91 },
            { label: "Follow Up", pct: 91 },
            { label: "Communication", pct: 88 },
          ].map(({ label, pct }) => (
            <div
              key={label}
              className="bg-white rounded-xl px-5 py-4 border border-sd-gray-border shadow-sm"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold text-sd-black">{label}</span>
                <span className="text-xs font-bold text-sd-green-text">{pct}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-sd-green" style={{ width: `${pct}%` }} />
              </div>
            </div>
          ))}
        </div>

        {/* Two-column: live reviews feed + project map */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Official GuildQuality reviews embed */}
          <div>
            <h3 className="font-display text-xl text-sd-black mb-4 font-semibold">
              Customer Reviews
            </h3>
            <div
              id="gq3-reviews-widget"
              className="rounded-2xl border border-sd-gray-border bg-white shadow-sm"
              style={{ height: "400px", overflowY: "auto" }}
            />
          </div>

          {/* Project map — 569 completed projects */}
          <div>
            <h3 className="font-display text-xl text-sd-black mb-4 font-semibold">
              569 Projects Across North Atlanta
            </h3>
            <div className="rounded-2xl overflow-hidden shadow-sm border border-sd-gray-border h-[400px]">
              <iframe
                src="https://www.guildquality.com/embed/projects/NDAzMDQ0"
                title="Siding Depot project map — GuildQuality"
                style={{ padding: 0, margin: 0, border: 0, height: "100%", width: "100%" }}
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
