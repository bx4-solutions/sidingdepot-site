import { Link } from "@tanstack/react-router";
import { Phone, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SITE, SERVICES } from "@/data/site";
import logoSidingDepot from "@/assets/logo-sidingdepot.png";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/siding", label: "Siding" },
  { to: "/painting", label: "Painting" },
  { to: "/windows", label: "Windows" },
  { to: "/service-areas", label: "Service Areas" },
  { to: "/about", label: "About" },
  { to: "/gallery", label: "Gallery" },
  { to: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-sd-navy/95 backdrop-blur-sm border-b border-white/5">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 lg:px-8">
        <div className="flex flex-col items-start leading-none">
          <Link to="/" className="flex items-center" aria-label={SITE.name}>
            <img
              src={logoSidingDepot}
              alt="Siding Depot"
              width={224}
              height={68}
              className="h-14 w-auto sm:h-16"
              loading="eager"
              decoding="async"
            />
          </Link>
          <div className="mt-1 hidden sm:flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/70">
            <Link to="/siding" className="hover:text-sd-green transition-colors">Siding</Link>
            <span aria-hidden className="text-sd-green">–</span>
            <Link to="/painting" className="hover:text-sd-green transition-colors">Painting</Link>
            <span aria-hidden className="text-sd-green">–</span>
            <Link to="/windows" className="hover:text-sd-green transition-colors">Windows</Link>
          </div>
        </div>

        <nav className="hidden lg:flex items-center gap-7">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-[13px] font-medium tracking-wide text-white/70 hover:text-sd-green transition-colors"
              activeProps={{ className: "text-sd-green" }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <Button asChild size="sm" variant="default">
            <a href={SITE.phoneHref} aria-label={`Call ${SITE.phone}`}>
              <Phone /> Call {SITE.phone}
            </a>
          </Button>
        </div>

        <button
          type="button"
          className="lg:hidden inline-flex items-center justify-center rounded-md p-2 text-white"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-white/5 bg-sd-navy">
          <nav className="px-4 py-4 flex flex-col gap-1">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="px-3 py-2 rounded-md text-sm text-white/80 hover:bg-white/5 hover:text-sd-green"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            <Button asChild className="mt-3">
              <a href={SITE.phoneHref}>
                <Phone /> Call {SITE.phone}
              </a>
            </Button>
            <Button asChild variant="outlineWhite">
              <Link to="/contact" onClick={() => setOpen(false)}>
                Get Free Quote
              </Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
