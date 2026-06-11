import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  X,
  Hammer,
  PanelsTopLeft,
  CloudRain,
  AppWindow,
  PaintRoller,
  Triangle,
  DoorOpen,
} from "lucide-react";
import doorsImg from "@/assets/services/doors.webp";
import sidingImg from "@/assets/services/siding.webp";
import paintingImg from "@/assets/services/painting.webp";
import windowsImg from "@/assets/services/windows.webp";
import deckImg from "@/assets/services/deck.webp";
import guttersImg from "@/assets/services/gutters.webp";
import roofingImg from "@/assets/services/roofing.webp";

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
    id: "siding",
    top: "73.2%",
    left: "18.4%",
    label: "James Hardie Siding",
    title: "James Hardie Siding",
    body: "As Elite Preferred installers, we're authorized to offer the full 30-year James Hardie warranty — most contractors can't. HZ10 panels built for Georgia's heat, humidity, and hurricane-force winds.",
    image: sidingImg,
    to: "/siding",
    cta: "SIDING SERVICES",
  },
  {
    id: "painting",
    top: "35.9%",
    left: "11.9%",
    label: "Exterior Painting",
    title: "Exterior Painting",
    body: "We only use Sherwin-Williams Duration — a lifetime-grade exterior coating. Full prep included: power wash, caulk, prime, two finish coats. No shortcuts, no upcharges. Price locked at estimate.",
    image: paintingImg,
    to: "/painting",
    cta: "PAINTING SERVICES",
  },
  {
    id: "gutters",
    top: "51.6%",
    left: "94.8%",
    label: "Seamless Gutters",
    title: "Seamless Gutters",
    body: "Fabricated on-site to fit your roofline exactly — no seams, no leaks. Sized for Georgia's 50+ inches of rain per year. Gutter guard systems available. Installed same day in most cases.",
    image: guttersImg,
    to: "/gutters",
    cta: "GUTTER SERVICES",
  },
  {
    id: "windows",
    top: "65.4%",
    left: "28.5%",
    label: "Window Replacement",
    title: "Window Replacement",
    body: "Low-E glass rated for Georgia's climate zone cuts HVAC costs by up to 30%. Every window installed by our own in-house crew — with a written seal and weatherproofing guarantee.",
    image: windowsImg,
    to: "/windows",
    cta: "WINDOW SERVICES",
  },
  {
    id: "doors",
    top: "69.9%",
    left: "48.6%",
    label: "Entry Doors",
    title: "Entry & Patio Doors",
    body: "Therma-Tru and ProVia doors — the two most trusted names in entry doors. Multi-point locking, fiberglass core, zero warp in Georgia humidity. Your home's first impression, done right.",
    image: doorsImg,
    to: "/doors",
    cta: "DOOR SERVICES",
  },
  {
    id: "deck",
    top: "78.2%",
    left: "71.6%",
    label: "Decking & Porches",
    title: "Decking & Porches",
    body: "From a simple repair to a full outdoor living space — we build with Trex, TimberTech and pressure-treated lumber. Designed for Georgia summers, built to last decades without rotting or splintering.",
    image: deckImg,
    to: "/decks",
    cta: "DECK SERVICES",
  },
  {
    id: "roofing",
    top: "29.1%",
    left: "56.5%",
    label: "Roofing",
    title: "Roofing",
    body: "GAF Master Elite certified — only 3% of US roofers earn this. We handle insurance claims directly so you don't have to. Bundle with siding and save $2,000–$5,000 in shared mobilization costs.",
    image: roofingImg,
    to: "/roofing",
    cta: "ROOFING SERVICES",
  },
];

const MOBILE_ICONS: Record<string, typeof Hammer> = {
  roofing: Triangle,
  siding: PanelsTopLeft,
  gutters: CloudRain,
  windows: AppWindow,
  doors: DoorOpen,
  painting: PaintRoller,
  deck: Hammer,
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

  const activeHotspot = HOTSPOTS.find((x) => x.id === active);

  return (
    <section className="py-20 lg:py-24 bg-background scroll-mt-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8 grid gap-10 lg:grid-cols-[2fr_3fr] items-center">
        {/* LEFT — copy block */}
        <div>
          <span className="inline-block text-xs font-bold tracking-[0.12em] uppercase text-sd-green-text bg-sd-green-pale px-3 py-1 rounded mb-4">
            Explore Our Services
          </span>
          <h2 className="font-display text-4xl sm:text-5xl text-sd-black leading-tight">
            One Crew. Every Exterior. Zero Shortcuts.
          </h2>
          <p className="mt-6 text-sd-gray-text leading-relaxed">
            Siding Depot is North Atlanta's #1 top-rated James Hardie Elite Preferred Contractor,
            recognized by homeowners for exceptional reviews, proven reliability, and quality
            craftsmanship. Our in-house installation crews have completed 1,500+ projects across
            Marietta, Canton, Kennesaw, and Alpharetta.
          </p>
          <p className="mt-4 text-sd-gray-text leading-relaxed">
            Click any pin on the house to see exactly what we do, how we do it, and why homeowners
            trust us with their biggest investment.
          </p>

          {/* Service pills */}
          <div className="mt-6 flex flex-wrap gap-2">
            {HOTSPOTS.map((h) => (
              <button
                key={h.id}
                type="button"
                onClick={() => setActive(active === h.id ? null : h.id)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                  active === h.id
                    ? "bg-sd-green text-sd-black border-sd-green"
                    : "bg-transparent text-sd-gray-text border-sd-gray-border hover:border-sd-green hover:text-sd-green"
                }`}
              >
                {h.label}
              </button>
            ))}
          </div>

          <Link
            to="/contact"
            className="mt-8 inline-block font-bold text-sd-green hover:text-sd-green-hover active:text-sd-green-active transition-colors"
          >
            Contact us for a free consultation →
          </Link>
        </div>

        {/* RIGHT — house photo + hotspot overlay */}
        <div
          ref={containerRef}
          className="relative hidden md:block overflow-hidden rounded-2xl shadow-2xl"
          style={{ aspectRatio: "16/10" }}
        >
          {/* House photo — dims when popup open */}
          <img
            src="/projects/project-2.webp"
            alt="Real home exterior project by Siding Depot — James Hardie siding, roofing, windows and deck in Greater Marietta, GA"
            className="w-full h-full object-cover block transition-all duration-300"
            style={{ filter: activeHotspot ? "brightness(0.45)" : "brightness(1)" }}
            loading="lazy"
          />

          {/* Bottom gradient */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "linear-gradient(to top, rgba(0,0,0,0.32) 0%, transparent 55%)",
            }}
          />

          {/* Hotspot pins */}
          {HOTSPOTS.map((h) => {
            const isActive = active === h.id;
            return (
              <div
                key={h.id}
                className="absolute"
                style={{
                  top: h.top,
                  left: h.left,
                  transform: "translate(-50%, -50%)",
                  zIndex: 20,
                }}
              >
                {/* Label badge above pin */}
                <div
                  aria-hidden
                  className={`absolute bottom-full mb-2 left-1/2 -translate-x-1/2 pointer-events-none transition-opacity duration-200 ${isActive ? "opacity-100" : "opacity-0"}`}
                >
                  <span className="text-[9px] font-bold uppercase tracking-wider bg-sd-green text-sd-black px-1.5 py-0.5 rounded shadow-md max-w-[80px] text-center leading-tight block">
                    {h.label}
                  </span>
                </div>

                <button
                  type="button"
                  aria-label={`See ${h.label} details`}
                  onClick={() => setActive(isActive ? null : h.id)}
                  className="relative grid place-items-center rounded-full cursor-pointer transition-all duration-200 hover:scale-110"
                  style={{
                    width: 34,
                    height: 34,
                    border: `2.5px solid var(--sd-green)`,
                    background: isActive ? "var(--sd-green)" : "rgba(180,210,54,0.22)",
                    backdropFilter: "blur(3px)",
                    boxShadow: isActive ? "0 0 0 5px rgba(180,210,54,0.35)" : "none",
                  }}
                >
                  <span
                    className="rounded-full block"
                    style={{
                      width: 13,
                      height: 13,
                      background: isActive ? "var(--sd-black)" : "var(--sd-green)",
                    }}
                  />
                  {!isActive && (
                    <span
                      aria-hidden
                      className="absolute inset-0 rounded-full animate-hotspot-pulse"
                      style={{ background: "rgba(180,210,54,0.45)" }}
                    />
                  )}
                </button>
              </div>
            );
          })}

          {/* Large popup card — image left, info right */}
          {activeHotspot && (
            <div
              role="dialog"
              aria-label={activeHotspot.title}
              className="absolute inset-x-4 animate-hotspot-fade"
              style={{
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 40,
                borderRadius: 16,
                overflow: "hidden",
                boxShadow: "0 24px 80px rgba(0,0,0,0.7)",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
              }}
            >
              {/* Left — service photo */}
              <div className="relative overflow-hidden" style={{ minHeight: 260 }}>
                <img
                  src={activeHotspot.image}
                  alt={activeHotspot.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>

              {/* Right — info panel */}
              <div className="flex flex-col justify-between p-8" style={{ background: "#fff" }}>
                <div>
                  <button
                    type="button"
                    aria-label="Close"
                    onClick={() => setActive(null)}
                    className="absolute text-sd-gray-text hover:text-sd-black transition-colors"
                    style={{ top: 16, right: 16 }}
                  >
                    <X size={20} />
                  </button>

                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-1 w-8 bg-sd-green rounded" />
                    <span className="text-xs font-bold uppercase tracking-widest text-sd-green">
                      {activeHotspot.title}
                    </span>
                  </div>

                  <h3 className="font-display text-3xl text-sd-black leading-tight mb-4">
                    {activeHotspot.title}
                  </h3>

                  <p className="text-sm text-sd-gray-text leading-relaxed">{activeHotspot.body}</p>
                </div>

                <Link
                  to={activeHotspot.to}
                  className="mt-6 inline-flex items-center justify-center gap-2 font-bold text-sm uppercase tracking-widest bg-sd-green text-sd-black hover:bg-sd-green-hover active:bg-sd-green-active rounded-xl py-4 px-6 transition-colors"
                >
                  {activeHotspot.cta} →
                </Link>
              </div>
            </div>
          )}

          {/* Idle hint */}
          {!active && (
            <div
              aria-hidden
              className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none"
            >
              <span className="text-[11px] font-semibold text-white/85 bg-black/45 backdrop-blur-sm px-4 py-2 rounded-full tracking-wide">
                Click any pin to explore services
              </span>
            </div>
          )}
        </div>

        {/* MOBILE — service cards grid */}
        <div className="md:hidden grid grid-cols-2 gap-3">
          {HOTSPOTS.map((h) => {
            const Icon = MOBILE_ICONS[h.id] ?? Hammer;
            return (
              <Link
                key={h.id}
                to={h.to}
                className="rounded-xl overflow-hidden shadow-lg flex flex-col"
                style={{ background: "#1E2A38" }}
              >
                <div className="h-28 overflow-hidden">
                  <img
                    src={h.image}
                    alt={h.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="p-4 flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-sd-green shrink-0" />
                    <h3 className="text-sm font-semibold text-white">{h.title}</h3>
                  </div>
                  <p className="text-[11px] text-white/70 line-clamp-2 leading-relaxed">{h.body}</p>
                  <span className="text-[11px] font-bold text-sd-green mt-1">View More →</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
