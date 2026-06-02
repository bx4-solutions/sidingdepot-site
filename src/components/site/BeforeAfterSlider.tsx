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

      {/* Range input overlay — native touch + full keyboard support (←/→/Home/End/PageUp/PageDown).
          The "peer" class lets the visible handle below react to focus state. */}
      <input
        type="range"
        min={0}
        max={100}
        step={1}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        role="slider"
        aria-label="Compare before and after — use arrow keys to adjust"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pos}
        aria-valuetext={`${pos}% after, ${100 - pos}% before`}
        className="peer absolute inset-0 z-10 h-full w-full cursor-ew-resize opacity-0 touch-pan-y focus:outline-none"
        style={{ WebkitTapHighlightColor: "transparent" }}
      />

      {/* Divider line + handle (purely decorative; positioned by `pos`).
          peer-focus-visible on the input above lights up the handle when focused via keyboard. */}
      <div
        className="pointer-events-none absolute top-0 bottom-0 w-[3px] bg-white shadow-[0_0_12px_rgba(0,0,0,0.5)] transition-[box-shadow] peer-focus-visible:bg-sd-green"
        style={{ left: `${pos}%`, transform: "translateX(-50%)" }}
        aria-hidden
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-14 w-14 sm:h-12 sm:w-12 rounded-full bg-sd-green flex items-center justify-center shadow-xl ring-4 ring-white/60 peer-focus-visible:ring-sd-navy peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-white">
          <svg viewBox="0 0 24 24" className="h-6 w-6 sm:h-5 sm:w-5 text-sd-black" fill="currentColor">
            <path d="M8 5l-7 7 7 7V5zm8 14l7-7-7-7v14z" />
          </svg>
        </div>
      </div>
    </div>
  );
}
