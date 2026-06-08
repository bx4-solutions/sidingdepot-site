/**
 * MascotGreeter — Welcome popup with mascot peeking from the bottom-right.
 * Shows once per browser session, 2.5s after first visit.
 * Mascot cropped waist-up. Transparent PNG with 3D drop-shadow.
 */

import { useEffect, useState } from "react";
import { X } from "lucide-react";

const SESSION_KEY = "sd_greeter_shown";
const DELAY_MS   = 5000;
const AUTO_HIDE  = 14000;

export function MascotGreeter() {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (sessionStorage.getItem(SESSION_KEY)) return;

    const t = setTimeout(() => {
      setVisible(true);
      sessionStorage.setItem(SESSION_KEY, "1");
      setTimeout(() => setVisible(false), AUTO_HIDE);
    }, DELAY_MS);

    return () => clearTimeout(t);
  }, []);

  if (!mounted || !visible) return null;

  return (
    <>
      <style>{`
        @keyframes sd-slide-up {
          from { transform: translateY(100%) scale(0.92); opacity: 0; }
          to   { transform: translateY(0%)   scale(1);   opacity: 1; }
        }
        @keyframes sd-wave {
          0%,100% { transform: perspective(420px) rotateY(-10deg) rotateZ(0deg)  scale(1.00); }
          20%      { transform: perspective(420px) rotateY( -5deg) rotateZ(-7deg) scale(1.01); }
          40%      { transform: perspective(420px) rotateY(  0deg) rotateZ( 5deg) scale(1.00); }
          60%      { transform: perspective(420px) rotateY( -5deg) rotateZ(-5deg) scale(1.01); }
          80%      { transform: perspective(420px) rotateY(-10deg) rotateZ( 2deg) scale(1.00); }
        }
        @keyframes sd-bubble-in {
          0%   { transform: scale(0.6) translateX(20px); opacity: 0; }
          70%  { transform: scale(1.04) translateX(-3px); opacity: 1; }
          100% { transform: scale(1)   translateX(0);    opacity: 1; }
        }

        /* ── wrapper ── */
        .sdg-wrap {
          position: fixed;
          bottom: 0;
          right: 12px;
          z-index: 9999;
          display: flex;
          align-items: flex-end;
          gap: 12px;
          animation: sd-slide-up 0.65s cubic-bezier(0.34,1.56,0.64,1) both;
          pointer-events: none;
        }

        /* ── speech bubble ── */
        .sdg-bubble {
          pointer-events: all;
          position: relative;
          bottom: 180px;
          background: #fff;
          border: 2.5px solid #B3D133;
          border-radius: 20px 20px 6px 20px;
          padding: 16px 18px 14px;
          width: 230px;
          box-shadow:
            0 12px 40px rgba(0,0,0,0.20),
            0 3px 10px rgba(0,0,0,0.12);
          animation: sd-bubble-in 0.55s 0.45s cubic-bezier(0.34,1.56,0.64,1) both;
        }
        /* tail pointing to mascot (bottom-right) */
        .sdg-bubble::after {
          content:'';
          position:absolute;
          bottom:-15px; right:22px;
          border-left:12px solid transparent;
          border-top:15px solid #B3D133;
        }
        .sdg-bubble::before {
          content:'';
          position:absolute;
          bottom:-11px; right:23px;
          z-index:1;
          border-left:11px solid transparent;
          border-top:13px solid #fff;
        }

        .sdg-close {
          position:absolute; top:8px; right:8px;
          width:24px; height:24px;
          border-radius:50%; background:#f2f2f2;
          border:none; cursor:pointer;
          display:flex; align-items:center; justify-content:center;
          color:#777; transition:background .15s;
        }
        .sdg-close:hover { background:#e0e0e0; color:#333; }

        .sdg-tag {
          display:inline-block;
          background:#EEF7D8; color:#3C4A07;
          font-size:10px; font-weight:800;
          letter-spacing:.06em; text-transform:uppercase;
          padding:2px 8px; border-radius:100px;
          margin-bottom:6px;
        }
        .sdg-title {
          margin:0; font-size:15px; font-weight:800;
          color:#1a1a1a; line-height:1.3; padding-right:20px;
        }
        .sdg-body {
          margin:7px 0 0; font-size:12.5px;
          color:#555; line-height:1.5;
        }
        .sdg-cta {
          display:inline-block;
          margin-top:12px;
          padding:8px 18px;
          background:#B3D133; color:#1a2200;
          border-radius:100px;
          font-size:12px; font-weight:800;
          text-decoration:none;
          letter-spacing:.04em;
          box-shadow:0 4px 12px rgba(179,209,51,.40);
          transition:background .15s, transform .15s;
        }
        .sdg-cta:hover { background:#7CB035; transform:translateY(-1px); }

        /* ── mascot (waist-up crop) ── */
        .sdg-mascot-clip {
          pointer-events: all;
          width: 170px;
          height: 255px;   /* shows top 55% of the 577×1153 image at display-width 170px */
          overflow: hidden;
          flex-shrink: 0;
          align-self: flex-end;
        }
        .sdg-mascot-img {
          width: 170px;
          height: auto;
          display: block;
          transform-origin: bottom center;
          filter:
            drop-shadow(0 18px 36px rgba(0,0,0,0.42))
            drop-shadow(0 5px 14px rgba(0,0,0,0.28))
            drop-shadow(-5px 0 12px rgba(0,0,0,0.16));
          animation: sd-wave 2.6s 0.7s ease-in-out infinite;
        }

        /* ── mobile ── */
        @media (max-width: 639px) {
          .sdg-wrap  { right:0; left:0; justify-content:center; gap:8px; }
          .sdg-mascot-clip { width:120px; height:180px; }
          .sdg-mascot-img  { width:120px; }
          .sdg-bubble { width:190px; bottom:130px; padding:12px 14px 10px; }
          .sdg-title  { font-size:13px; }
          .sdg-body   { font-size:11.5px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .sdg-wrap, .sdg-mascot-img, .sdg-bubble {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>

      <div className="sdg-wrap" role="complementary" aria-label="Welcome from Siding Depot">

        {/* Speech bubble */}
        <div className="sdg-bubble">
          <button className="sdg-close" onClick={() => setVisible(false)} aria-label="Close">
            <X size={13} />
          </button>
          <span className="sdg-tag">👋 Welcome!</span>
          <p className="sdg-title">Atlanta's #1 Siding Company</p>
          <p className="sdg-body">
            Serving North Atlanta for <strong>over 10 years</strong> — James Hardie Elite Preferred contractor.
          </p>
          <a href="/contact" className="sdg-cta">Get a Free Quote →</a>
        </div>

        {/* Mascot waist-up */}
        <div className="sdg-mascot-clip">
          <img
            src="/mascot.png"
            alt="Siding Depot mascot waving hello"
            className="sdg-mascot-img"
            width={170}
            loading="lazy"
            decoding="async"
            draggable={false}
          />
        </div>

      </div>
    </>
  );
}
