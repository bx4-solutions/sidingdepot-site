import { Link, useLocation } from "@tanstack/react-router";
import { Phone, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SITE, SERVICES } from "@/data/site";
import { track } from "@/lib/track";
import logoSidingDepot from "@/assets/logo-sidingdepot.png";

/**
 * Strip items: slug must match a SERVICES[].slug AND the ServiceCard id
 * (`services-${slug}`) on the home page. Label is derived from the SERVICES
 * source of truth to prevent label/slug drift.
 */
const STRIP_SLUGS = ["siding", "painting", "windows"] as const;
type StripSlug = (typeof STRIP_SLUGS)[number];
const STRIP_ITEMS: { slug: StripSlug; label: string }[] = STRIP_SLUGS.map((slug) => {
  const svc = SERVICES.find((s) => s.slug === slug);
  if (!svc) {
    // Fail fast in dev if data/site.ts ever drifts away from these slugs.
    throw new Error(`[Navbar] Missing SERVICES entry for slug "${slug}"`);
  }
  return { slug, label: slug.charAt(0).toUpperCase() + slug.slice(1) };
});

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/siding", label: "Siding" },
  { to: "/painting", label: "Painting" },
  { to: "/windows", label: "Windows" },
  { to: "/service-areas", label: "Service Areas" },
  { to: "/about", label: "About" },
  { to: "/projects", label: "Projects" },
  { to: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  // TanStack Router stores the hash without the leading "#".
  const activeHash = location.hash;
  const isHome = location.pathname === "/";

  const handleStripClick = (slug: StripSlug) => {
    track("service_strip_click", { service: slug });
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-sd-navy/95 backdrop-blur-sm border-b border-white/5">
      <div className="mx-auto flex h-nav-mobile sm:h-nav-tablet lg:h-nav-desktop max-w-7xl items-center justify-between gap-3 px-4 lg:px-8">
        <div className="flex items-center min-w-0 py-2">
          <Link to="/" className="flex items-center" aria-label={SITE.name}>
            <img
              src={logoSidingDepot}
              alt="Siding Depot"
              width={224}
              height={68}
              className="h-11 w-auto sm:h-12 lg:h-14"
              loading="eager"
              decoding="async"
            />
          </Link>
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
