import { Link } from "@tanstack/react-router";
import { MapPin, ArrowRight } from "lucide-react";

const PRIMARY_CITIES = [
  { slug: "marietta", name: "Greater Marietta", county: "Cobb County" },
  { slug: "alpharetta", name: "Alpharetta", county: "Fulton County" },
  { slug: "canton", name: "Canton", county: "Cherokee County" },
  { slug: "woodstock", name: "Woodstock", county: "Cherokee County" },
  { slug: "roswell", name: "Roswell", county: "Fulton County" },
  { slug: "kennesaw", name: "Kennesaw", county: "Cobb County" },
  { slug: "johns-creek", name: "Johns Creek", county: "Fulton County" },
  { slug: "milton", name: "Milton", county: "Fulton County" },
  { slug: "acworth", name: "Acworth", county: "Cobb County" },
  { slug: "sandy-springs", name: "Sandy Springs", county: "Fulton County" },
];

export function CitiesServed() {
  return (
    <section className="bg-sd-navy text-white py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest"
            style={{
              background: "rgba(179,209,51,0.15)",
              border: "1px solid #B3D133",
              color: "#B3D133",
            }}
          >
            <MapPin className="h-3 w-3" /> Service Area
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight text-white">
            Serving <span style={{ color: "#B3D133" }}>North Atlanta</span> &amp; Surrounding Cities
          </h2>
          <p className="mt-4 text-base sm:text-lg text-white/70 max-w-2xl mx-auto">
            From Marietta to Canton and beyond — our W-2 crews bring James Hardie Elite Preferred
            quality directly to your neighborhood. No subcontractors, ever.
          </p>
        </div>

        {/* Primary Cities Grid */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5 mb-10">
          {PRIMARY_CITIES.map((city) => (
            <Link
              key={city.slug}
              to="/locations/$city/$service"
              params={{ city: city.slug, service: "siding" }}
              className="group flex flex-col gap-1.5 rounded-xl p-4 transition-all duration-200 hover:-translate-y-0.5"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "rgba(179,209,51,0.10)";
                (e.currentTarget as HTMLElement).style.borderColor = "#B3D133";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)";
              }}
            >
              <div className="flex items-start justify-between gap-1">
                <span className="font-bold text-sm text-white group-hover:text-[#B3D133] transition-colors leading-tight">
                  {city.name}
                </span>
                <ArrowRight className="h-3.5 w-3.5 shrink-0 mt-0.5 text-white/30 group-hover:text-[#B3D133] transition-colors" />
              </div>
              <span className="text-xs text-white/45">{city.county}</span>
              <div className="mt-1.5 flex flex-wrap gap-1">
                {["Siding", "Painting", "Windows"].map((svc) => (
                  <span
                    key={svc}
                    className="text-[10px] px-1.5 py-0.5 rounded-full"
                    style={{ background: "rgba(179,209,51,0.1)", color: "#B3D133" }}
                  >
                    {svc}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="border-t border-white/10 pt-8 text-center">
          <p className="text-white/50 text-sm">
            Outside these areas?{" "}
            <Link
              to="/contact"
              className="underline hover:text-[#B3D133] transition-colors"
              style={{ color: "#B3D133" }}
            >
              Contact us — we'll let you know if we can help.
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
