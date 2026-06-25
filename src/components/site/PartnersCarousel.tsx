const SD_NAVY = "#1e2a3a";
const SD_LIME = "#B3D133";

const PARTNERS = [
  { name: "James Hardie", src: "/logos/james-hardie.jpg", w: 200 },
  { name: "GAF", src: "/logos/gaf.png", w: 160 },
  { name: "Simonton", src: "/logos/simonton.png", w: 180 },
  { name: "Norandex", src: "/logos/norandex.png", w: 180 },
  { name: "Trex", src: "/logos/trex.png", w: 160 },
  { name: "TimberTech", src: "/logos/timbertech.png", w: 200 },
  { name: "Senox", src: "/logos/senox.png", w: 180 },
  { name: "Master Windows", src: "/logos/master-windows.png", w: 200 },
];

const TRACK = [...PARTNERS, ...PARTNERS];

export function PartnersCarousel() {
  return (
    <section
      className="py-14 bg-white border-y border-sd-gray-border overflow-hidden"
      aria-label="Trusted suppliers"
    >
      {/* Header */}
      <div className="mx-auto max-w-7xl px-4 lg:px-8 mb-10 text-center">
        <p
          className="text-xs font-bold tracking-[0.18em] uppercase mb-3"
          style={{ color: SD_LIME }}
        >
          Trusted Suppliers
        </p>
        <h2
          className="text-2xl lg:text-3xl font-display font-black leading-tight mb-4"
          style={{ color: SD_NAVY }}
        >
          We only install <span style={{ color: SD_LIME }}>the world's best.</span>
        </h2>
        <p className="text-sm lg:text-base text-sd-gray-text max-w-2xl mx-auto leading-relaxed">
          Every material installed by Siding Depot comes from global industry leaders — brands
          recognized for durability, innovation, and performance. Because your home deserves nothing
          less than the best.
        </p>
      </div>

      {/* Marquee — same classes as Google Reviews */}
      <div className="marquee-wrapper">
        <div className="marquee-track gap-5 sm:gap-10 px-4 sm:px-6">
          {TRACK.map((p, i) => (
            <div
              key={i}
              className="flex-shrink-0 flex items-center justify-center h-16 sm:h-24"
              style={{ width: `clamp(110px, 34vw, ${p.w + 40}px)` }}
            >
              <img
                src={p.src}
                alt={p.name}
                className="object-contain select-none h-12 sm:h-20 w-auto max-w-full"
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
