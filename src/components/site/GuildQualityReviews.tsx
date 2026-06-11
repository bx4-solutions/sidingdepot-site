import { useEffect } from "react";

export function GuildQualityReviews() {
  useEffect(() => {
    const existing = document.getElementById("gq3-reviews-script");
    if (existing) return;

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
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-bold tracking-[0.12em] uppercase text-sd-green-text bg-sd-green-pale px-3 py-1 rounded mb-4">
            Verified Customer Reviews
          </span>
          <h2 className="font-display text-4xl sm:text-5xl text-sd-black leading-tight">
            What Homeowners Say
            <span className="block text-sd-green-text">About Siding Depot.</span>
          </h2>
          <p className="mt-4 text-sd-gray-text max-w-xl mx-auto">
            4.7 stars · 261 verified reviews on GuildQuality — the industry's independent
            contractor review platform. Every review is tied to a real completed project.
          </p>
        </div>

        {/* Official GuildQuality embed widget */}
        <div
          id="gq3-reviews-widget"
          className="rounded-2xl overflow-hidden shadow-sm border border-sd-gray-border"
        />

        <div className="mt-8 text-center">
          <a
            href="https://www.guildquality.com/profile/siding-depot-llc"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-sd-green-text hover:underline"
          >
            View all GuildQuality reviews →
          </a>
        </div>
      </div>
    </section>
  );
}
