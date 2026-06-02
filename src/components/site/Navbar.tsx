import { Link, useLocation } from "@tanstack/react-router";
import { Phone, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { SITE, SERVICES } from "@/data/site";
import { track } from "@/lib/track";
import { supabase } from "@/integrations/supabase/client";
import logoSidingDepot from "@/assets/logo-sidingdepot.png";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/siding", label: "Siding" },
  { to: "/painting", label: "Painting" },
  { to: "/windows", label: "Windows" },
  { to: "/blog", label: "Blog" },
  { to: "/lp/siding-marietta", label: "Service Areas" },
  { to: "/about", label: "About" },
  { to: "/projects", label: "Projects" },
  { to: "/contact", label: "Contact" },
  { to: "/finance", label: "Finance" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [session, setSession] = useState<any>(null);
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleStripClick = (slug: string) => {
    track("service_strip_click", { service: slug });
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-sd-dark/95 backdrop-blur-sm border-b border-white/5">
      <div className="mx-auto flex h-nav-mobile sm:h-nav-tablet lg:h-nav-desktop max-w-7xl items-center justify-between gap-3 px-4 lg:px-8">
        <div className="flex items-center min-w-0 py-2">
          <Link to="/" className="flex items-center" aria-label={SITE.name}>
            <div style={{
              background: '#BCD635',
              padding: '6px 14px',
              borderRadius: '8px',
              fontWeight: 900,
              color: '#fff',
              WebkitTextStroke: '2px #000',
              paintOrder: 'stroke fill',
              transform: 'rotate(-4deg)',
              display: 'inline-block',
              lineHeight: 1.1,
              fontFamily: 'var(--font-display)',
              fontSize: '20px'
            }}>
              Siding<br/>Depot
            </div>
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
          {session && (
            <Link
              to="/seo-dashboard"
              className="text-[13px] font-bold tracking-wide text-sd-green hover:text-sd-green-hover transition-colors"
              activeProps={{ className: "text-white" }}
            >
              SEO Dashboard
            </Link>
          )}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <Button asChild size="sm" variant="default" onClick={() => track("call_click", { button: "Navbar Call", source: "navbar" })}>
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
        <div className="lg:hidden border-t border-white/5 bg-sd-dark overflow-y-auto max-h-[calc(100vh-var(--spacing-nav-mobile))]">
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
            {session && (
              <Link
                to="/seo-dashboard"
                className="px-3 py-2 rounded-md text-sm font-bold text-sd-green hover:bg-white/5"
                onClick={() => setOpen(false)}
              >
                SEO Dashboard
              </Link>
            )}
            <Button asChild className="mt-3" onClick={() => track("call_click", { button: "Mobile Menu Call", source: "mobile_menu" })}>
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
