import { useEffect } from "react";

/**
 * Official GuildQuality reviews widget (account NDAzMDQ0).
 * The remote script is JSONP-style: it calls a global `embedGQwidget(html)`
 * which injects the reviews HTML into #gq3-reviews-widget. Client-only.
 */
export function GuildQualityEmbed() {
  useEffect(() => {
    (window as any).embedGQwidget = (html: string) => {
      const el = document.getElementById("gq3-reviews-widget");
      if (el) el.innerHTML = html;
    };
    if (!document.getElementById("gq3-embed-script")) {
      const s = document.createElement("script");
      s.id = "gq3-embed-script";
      s.type = "text/javascript";
      s.src = "https://www.guildquality.com/embed/reviews/NDAzMDQ0/all";
      s.async = true;
      document.body.appendChild(s);
    }
  }, []);

  return (
    <div className="overflow-y-auto" style={{ maxHeight: "420px" }}>
      <style>{`
        #gq3-reviews-widget a {
          pointer-events: none !important;
          cursor: default !important;
          text-decoration: none !important;
          color: inherit !important;
        }
      `}</style>
      <div id="gq3-reviews-widget">
        <p className="text-xs text-gray-400">Loading verified GuildQuality reviews…</p>
      </div>
    </div>
  );
}
