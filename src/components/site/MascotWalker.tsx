/**
 * MascotWalker — Desktop-only animated mascot that walks across the page.
 * Background must be transparent (PNG with alpha channel).
 * 3D effect via CSS perspective + rotateY oscillation + layered drop-shadows.
 */

import { useEffect, useState } from "react";

interface MascotWalkerProps {
  size?: number;
  bottom?: number;
  speed?: number;
  src?: string;
}

export function MascotWalker({
  size = 120,
  bottom = 16,
  speed = 40,
  src = "/mascot.png",
}: MascotWalkerProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const id = `mw-${size}-${speed}`;

  return (
    <>
      <style>{`
        @keyframes ${id}-walk {
          from { left: -${size + 40}px; }
          to   { left: calc(100vw + ${size + 40}px); }
        }
        @keyframes ${id}-bounce {
          0%, 100% { bottom: ${bottom}px; }
          50%       { bottom: ${bottom + 10}px; }
        }
        @keyframes ${id}-tilt {
          0%   { transform: perspective(350px) rotateY(-10deg) scaleY(1.00); }
          25%  { transform: perspective(350px) rotateY( -5deg) scaleY(1.01); }
          50%  { transform: perspective(350px) rotateY(  0deg) scaleY(1.00); }
          75%  { transform: perspective(350px) rotateY(  5deg) scaleY(1.01); }
          100% { transform: perspective(350px) rotateY(-10deg) scaleY(1.00); }
        }
        .${id} {
          position: absolute;
          bottom: ${bottom}px;
          left: -${size + 40}px;
          width: ${size}px;
          height: auto;
          pointer-events: none;
          user-select: none;
          z-index: 20;
          transform-origin: bottom center;
          filter:
            drop-shadow(0 12px 24px rgba(0,0,0,0.38))
            drop-shadow(0 4px 8px rgba(0,0,0,0.22))
            drop-shadow(-5px 0 10px rgba(0,0,0,0.14));
          display: none;
          animation:
            ${id}-walk   ${speed}s linear   infinite,
            ${id}-bounce 0.5s ease-in-out   infinite,
            ${id}-tilt   2.8s ease-in-out   infinite;
        }
        @media (min-width: 1024px) {
          .${id} { display: block; }
        }
        @media (prefers-reduced-motion: reduce) {
          .${id} { display: none; }
        }
      `}</style>

      <img
        src={src}
        alt=""
        aria-hidden="true"
        className={id}
        width={size}
        loading="lazy"
        draggable={false}
      />
    </>
  );
}
