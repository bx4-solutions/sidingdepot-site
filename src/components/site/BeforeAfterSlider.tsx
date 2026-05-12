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
    <div className="relative w-full aspect-[16/10] overflow-hidden rounded-xl shadow-2xl select-none">
      {/* AFTER (base) */}
      <img
        src={after}
        alt={afterAlt}
        className="absolute inset-0 h-full w-full object-cover"
        loading="lazy"
        decoding="async"
      />
      {/* BEFORE (clipped) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        aria-hidden
      >
        <img
          src={before}
          alt={beforeAlt}
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
          decoding="async"
        />
      </div>

      {/* Labels */}
      <span className="absolute top-4 left-4 rounded-pill bg-sd-black/70 px-3 py-1 text-xs font-bold tracking-[0.12em] uppercase text-white">
        Before
      </span>
      <span className="absolute top-4 right-4 rounded-pill bg-sd-green px-3 py-1 text-xs font-bold tracking-[0.12em] uppercase text-sd-black">
        After
      </span>

      {/* Divider line */}
      <div
        className="pointer-events-none absolute top-0 bottom-0 w-[3px] bg-white shadow-[0_0_12px_rgba(0,0,0,0.5)]"
        style={{ left: `${pos}%`, transform: "translateX(-50%)" }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-sd-green flex items-center justify-center shadow-xl">
          <svg viewBox="0 0 24 24" className="h-5 w-5 text-sd-black" fill="currentColor" aria-hidden>
            <path d="M8 5l-7 7 7 7V5zm8 14l7-7-7-7v14z" />
          </svg>
        </div>
      </div>

      {/* Range input overlay */}
      <input
        type="range"
        min={0}
        max={100}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-label="Drag to compare before and after"
        className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
      />
    </div>
  );
}
