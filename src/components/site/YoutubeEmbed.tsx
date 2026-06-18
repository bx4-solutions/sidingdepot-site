import { useState } from "react";
import { Play } from "lucide-react";
import logoSidingDepot from "@/assets/logo-sidingdepot.png";

type Props = {
  videoId: string;
  title: string;
  className?: string;
};

/**
 * Lazy-loaded YouTube embed.
 * Shows a branded green poster with the Siding Depot logo and a play button
 * until the user clicks — only then is the iframe mounted.
 * Improves performance (no third-party JS until interaction) and brand consistency.
 */
export function YoutubeEmbed({ videoId, title, className = "" }: Props) {
  const [active, setActive] = useState(false);

  return (
    <div
      className={`relative w-full overflow-hidden rounded-xl bg-sd-black aspect-video shadow-2xl ${className}`}
    >
      {active ? (
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&controls=1&showinfo=0&modestbranding=1&iv_load_policy=3&disablekb=1`}
          title={title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      ) : (
        <button
          type="button"
          onClick={() => setActive(true)}
          aria-label={`Play video: ${title}`}
          className="group absolute inset-0 flex flex-col items-center justify-center gap-5 bg-gradient-to-br from-sd-green via-sd-green to-sd-green-hover text-sd-navy transition-transform"
        >
          <img
            src={logoSidingDepot}
            alt="Siding Depot"
            className="h-12 sm:h-16 w-auto drop-shadow-lg"
            loading="lazy"
          />
          <span className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-sd-navy text-sd-green shadow-2xl transition-transform group-hover:scale-110">
            <Play className="h-8 w-8 sm:h-10 sm:w-10 ml-1 fill-current" />
          </span>
          <span className="px-4 text-center text-sm sm:text-base font-semibold uppercase tracking-wider">
            {title}
          </span>
        </button>
      )}
    </div>
  );
}
