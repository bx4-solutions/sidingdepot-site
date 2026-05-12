import { useState } from "react";

type Props = {
  before: string;
  after: string;
  beforeAlt: string;
  afterAlt: string;
};

export function BeforeAfterSlider({ before, after, beforeAlt, afterAlt }: Props) {
  const [pos, setPos] = useState(50);

  return (
    <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] overflow-hidden rounded-xl shadow-2xl select-none bg-sd-gray-bg touch-pan-y">
      {/* AFTER (base) */}
      <img
        src={after}
        alt={afterAlt}
        width={1400}
        height={875}
        className="absolute inset-0 h-full w-full object-cover pointer-events-none"
        loading="lazy"
        decoding="async"
      />
      {/* BEFORE (clipped) */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        aria-hidden
      >
        <img
          src={before}
          alt={beforeAlt}
          width={1400}
          height={875}
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
          decoding="async"
        />
      </div>

      {/* Labels */}
      <span className="absolute top-3 left-3 sm:top-4 sm:left-4 rounded-pill bg-sd-black/75 px-2.5 py-1 text-[10px] sm:text-xs font-bold tracking-[0.12em] uppercase text-white">
        Before
      </span>
      <span className="absolute top-3 right-3 sm:top-4 sm:right-4 rounded-pill bg-sd-green px-2.5 py-1 text-[10px] sm:text-xs font-bold tracking-[0.12em] uppercase text-sd-black">
        After
      </span>

      {/* Divider line + handle */}
      <div
        className="pointer-events-none absolute top-0 bottom-0 w-[3px] bg-white shadow-[0_0_12px_rgba(0,0,0,0.5)]"
        style={{ left: `${pos}%`, transform: "translateX(-50%)" }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-14 w-14 sm:h-12 sm:w-12 rounded-full bg-sd-green flex items-center justify-center shadow-xl ring-4 ring-white/30">
          <svg viewBox="0 0 24 24" className="h-6 w-6 sm:h-5 sm:w-5 text-sd-black" fill="currentColor" aria-hidden>
            <path d="M8 5l-7 7 7 7V5zm8 14l7-7-7-7v14z" />
          </svg>
        </div>
      </div>

      {/* Range input overlay — native touch + keyboard support */}
      <input
        type="range"
        min={0}
        max={100}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-label="Drag to compare before and after"
        className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0 touch-pan-y"
        style={{ WebkitTapHighlightColor: "transparent" }}
      />
    </div>
  );
}
