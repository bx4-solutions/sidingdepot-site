import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { X, Hammer, PanelsTopLeft, CloudRain, AppWindow, PaintRoller, Triangle } from "lucide-react";

type Hotspot = {
  id: string;
  top: string;
  left: string;
  label: string;
  title: string;
  body: string;
  image: string;
  to: string;
  cta: string;
};

const HOTSPOTS: Hotspot[] = [
  {
    id: "roofing",
    top: "15%",
    left: "55%",
    label: "Roofing",
    title: "Roofing",
    body: "GAF certified installation. Storm damage specialists. We work directly with insurance companies — and combine roof replacement with siding to save you $2,000–$5,000 on mobilization.",
    image: "/projects/project-1.webp",
    to: "/roofing",
    cta: "ROOFING SERVICES →",
  },
  {
    id: "hardie",
    top: "30%",
    left: "20%",
    label: "James Hardie Siding",
    title: "James Hardie Siding",
    body: "Elite Preferred installation — top 2% of US installers. HardieZone HZ10 engineered for Georgia's heat, humidity and storms. 30-year non-prorated warranty on materials and labor.",
    image: "/projects/project-2.webp",
    to: "/siding",
    cta: "SIDING SERVICES →",
  },
  {
    id: "board-batten",
    top: "35%",
    left: "45%",
    label: "Board & Batten Siding",
    title: "Board & Batten Siding",
    body: "HardiePanel vertical siding — the modern farmhouse look trending across North Atlanta in 2026. Available in James Hardie ColorPlus finishes that never need repainting.",
    image: "/projects/project-3.webp",
    to: "/siding",
    cta: "VIEW SIDING OPTIONS →",
  },
  {
    id: "gutters",
    top: "45%",
    left: "30%",
    label: "Seamless Gutters",
    title: "Seamless Gutters",
    body: "Custom-fabricated seamless aluminum gutters sized for Georgia's 50+ inches of annual rainfall. LeafGuard protection available. No joints means no leak points.",
    image: "/hero-home.webp",
    to: "/gutters",
    cta: "GUTTER SERVICES →",
  },
  {
    id: "windows",
    top: "55%",
    left: "60%",
    label: "Window Replacement",
    title: "Window Replacement",
    body: "Energy-efficient double and triple-pane windows rated for Georgia's climate zone. Reduce HVAC load by up to 45%. W-2 installation crews — perfect seal guaranteed.",
    image: "/projects/project-4.webp",
    to: "/windows",
    cta: "WINDOW SERVICES →",
  },
  {
    id: "painting",
    top: "65%",
    left: "25%",
    label: "Exterior Painting",
    title: "Exterior Painting",
    body: "Sherwin-Williams Duration and SuperPaint — premium exterior coatings with 15-year warranty against peeling and fading. Full prep: pressure wash, caulk, prime, paint.",
    image: "/projects/project-2.webp",
    to: "/painting",
    cta: "PAINTING SERVICES →",
  },
];

const MOBILE_ICONS: Record<string, typeof Hammer> = {
  roofing: Triangle,
  hardie: PanelsTopLeft,
  "board-batten": PanelsTopLeft,
  gutters: CloudRain,
  windows: AppWindow,
  painting: PaintRoller,
};

export function ServicesHotspots() {
  const [active, setActive] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) setActive(null);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <section className="py-20 lg:py-24 bg-background">
      <div className="mx-auto max-w-7xl px-4 lg:px-8 grid gap-10 lg:grid-cols-[2fr_3fr] items-center">
        {/* LEFT */}
        <div>
          <span className="inline-block text-xs font-bold tracking-[0.12em] uppercase text-sd-green-text bg-sd-green-pale px-3 py-1 rounded">
            Our Services — Click to Explore
          </span>
          <h2 className="mt-4 font-display text-3xl sm:text-4xl text-sd-black leading-tight">
            Quality Craftsmanship. Professional Service.
          </h2>
          <p className="mt-4 text-sd-gray-text">
            We've transformed 1,500+ homes across Marietta, Canton, Alpharetta and North Atlanta. As Elite Preferred James Hardie installers, our W-2 crews handle every exterior service — siding, painting, windows, gutters, decks and roofing.
          </p>
          <p className="mt-3 text-sd-gray-text">
            Family-owned and based in Marietta, GA. We use only the best products and stand behind every project with a written guarantee.
          </p>
          <Link
            to="/contact"
            className="mt-5 inline-block font-semibold underline underline-offset-4"
            style={{ color: "#8DC63F" }}
          >
            Contact us for a free inspection →
          </Link>
        </div>

        {/* RIGHT — desktop image with hotspots */}
        <div
          ref={containerRef}
          className="relative hidden md:block overflow-hidden rounded-xl shadow-lg"
        >
          <img
            src="/projects/project-1.webp"
            alt="Greater Marietta home featuring James Hardie siding, gutters, windows and roofing by Siding Depot"
            className="w-full h-auto block"
            loading="lazy"
          />

          {HOTSPOTS.map((h) => {
            const isActive = active === h.id;
            // Flip popup side if hotspot is on the right half
            const leftNum = parseFloat(h.left);
            const flipX = leftNum > 55;
            const topNum = parseFloat(h.top);
            const flipY = topNum > 60;
            return (
              <div
                key={h.id}
                className="absolute"
                style={{ top: h.top, left: h.left, transform: "translate(-50%, -50%)" }}
              >
                <button
                  type="button"
                  aria-label={`Open ${h.label} details`}
                  onClick={() => setActive(isActive ? null : h.id)}
                  className="relative grid place-items-center rounded-full cursor-pointer"
                  style={{
                    width: 28,
                    height: 28,
                    border: "2px solid #8DC63F",
                    background: isActive ? "#8DC63F" : "rgba(141,198,63,0.2)",
                  }}
                >
                  <span
                    className="rounded-full block"
                    style={{ width: 12, height: 12, background: "#8DC63F" }}
                  />
                  {!isActive && (
                    <span
                      aria-hidden
                      className="absolute inset-0 rounded-full animate-hotspot-pulse"
                      style={{ background: "rgba(141,198,63,0.6)" }}
                    />
                  )}
                </button>

                {isActive && (
                  <div
                    role="dialog"
                    className="absolute animate-hotspot-fade"
                    style={{
                      width: 260,
                      background: "#1E2A38",
                      borderRadius: 12,
                      boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
                      padding: 20,
                      zIndex: 50,
                      [flipX ? "right" : "left"]: 36,
                      [flipY ? "bottom" : "top"]: -8,
                    } as React.CSSProperties}
                  >
                    <button
                      type="button"
                      aria-label="Close"
                      onClick={() => setActive(null)}
                      className="absolute text-white/80 hover:text-white"
                      style={{ top: 8, right: 8 }}
                    >
                      <X size={20} />
                    </button>
                    <img
                      src={h.image}
                      alt=""
                      className="w-full h-24 object-cover rounded-md mb-3"
                    />
                    <h3 style={{ color: "#8DC63F", fontWeight: 600 }}>{h.title}</h3>
                    <div style={{ height: 2, width: 32, background: "#8DC63F", margin: "8px 0" }} />
                    <p style={{ color: "#fff", fontSize: 13, lineHeight: 1.6 }}>{h.body}</p>
                    <Link
                      to={h.to}
                      className="mt-4 block text-center font-bold"
                      style={{
                        background: "#8DC63F",
                        color: "#1A1A1A",
                        borderRadius: 6,
                        padding: "10px",
                      }}
                    >
                      {h.cta}
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* MOBILE — service cards grid */}
        <div className="md:hidden grid grid-cols-2 gap-3">
          {HOTSPOTS.map((h) => {
            const Icon = MOBILE_ICONS[h.id] ?? Hammer;
            return (
              <Link
                key={h.id}
                to={h.to}
                className="rounded-xl p-4 flex flex-col gap-2"
                style={{ background: "#1E2A38", color: "#fff" }}
              >
                <Icon className="h-6 w-6" style={{ color: "#8DC63F" }} />
                <h3 className="text-sm font-semibold" style={{ color: "#8DC63F" }}>
                  {h.title}
                </h3>
                <p className="text-xs text-white/80 line-clamp-2">{h.body}</p>
                <span className="text-xs font-bold mt-1" style={{ color: "#8DC63F" }}>
                  View More →
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
