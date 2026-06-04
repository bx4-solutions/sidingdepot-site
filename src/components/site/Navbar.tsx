import { Link, useLocation } from "@tanstack/react-router";
import { Phone, Menu, X, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { SITE } from "@/data/site";
import { track } from "@/lib/track";
import { supabase } from "@/integrations/supabase/client";
import logoSidingDepot from "@/assets/siding-depot-logo.png.asset.json";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { 
    to: "/siding", 
    label: "SIDING",
    sublinks: [
      { to: "/siding", label: "James Hardie Siding" },
      { to: "/siding", label: "Fiber Cement Siding" },
      { to: "/siding", label: "Vinyl Siding" },
      { to: "/siding", label: "Siding Repair" },
    ]
  },
  { 
    to: "/roofing", 
    label: "ROOFING",
    sublinks: [
      { to: "/roofing", label: "Roof Replacement" },
      { to: "/roofing", label: "Roof Repair" },
      { to: "/roofing", label: "GAF Certified Roofing" },
    ]
  },
  { 
    to: "/deck", 
    label: "DECKS",
    sublinks: [
      { to: "/deck", label: "Custom Deck Building" },
      { to: "/deck", label: "Deck Repair & Staining" },
      { to: "/deck", label: "Porches & Porticos" },
    ]
  },
  { 
    to: "/windows", 
    label: "WINDOWS",
    sublinks: [
      { to: "/windows", label: "Window Replacement" },
      { to: "/windows", label: "Energy Efficient Windows" },
      { to: "/windows", label: "Vinyl Windows" },
    ]
  },
  { 
    to: "/gutters", 
    label: "GUTTERS",
    sublinks: [
      { to: "/gutters", label: "Seamless Gutters" },
      { to: "/gutters", label: "Gutter Guards" },
      { to: "/gutters", label: "Gutter Repair" },
    ]
  },
  { 
    to: "/painting", 
    label: "PAINTING",
    sublinks: [
      { to: "/painting", label: "Exterior Painting" },
      { to: "/painting", label: "Trim & Detail Painting" },
      { to: "/painting", label: "Siding Painting" },
    ]
  },
  { to: "/projects", label: "PROJECT GALLERY" },
  { to: "/about", label: "ABOUT" },
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
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-sd-gray-bg/80 border-b border-sd-navy/10 shadow-sm transition-all duration-300">
      <div className="mx-auto flex h-nav-mobile sm:h-nav-tablet lg:h-nav-desktop max-w-7xl items-center justify-between gap-3 px-4 lg:px-8">
        <div className="flex items-center min-w-0 py-2">
          <Link to="/" className="flex items-center" aria-label={`${SITE.name} Home`}>
            <img
              src={logoSidingDepot.url}
              alt={`${SITE.name} logo`}
              className="h-10 sm:h-12 lg:h-14 w-auto" width="160" height="56"
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
              className="text-[13px] font-semibold tracking-wide transition-colors text-sd-black hover:text-sd-green-text"
              activeProps={{ className: "text-sd-green-text underline underline-offset-4" }}
              activeOptions={{ exact: true }}
            >
              {l.label}
            </Link>
          ))}
          {session && (
            <Link
              to="/seo-dashboard"
              className="text-[13px] font-bold tracking-wide transition-colors text-sd-black hover:text-sd-green-text"
              activeProps={{ className: "text-white" }}
            >
              SEO Dashboard
            </Link>
          )}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <Button
            asChild
            size="sm"
            className="bg-sd-green text-sd-black hover:brightness-90"
            onClick={() => track("call_click", { button: "Navbar Call", source: "navbar" })}
          >
            <a href={SITE.phoneHref} aria-label={`Call ${SITE.phone}`}>
              <Phone aria-hidden="true" /> Call {SITE.phone}
            </a>
          </Button>
        </div>

        <button
          type="button"
          className="lg:hidden inline-flex items-center justify-center rounded-md p-2 text-sd-black"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className={`lg:hidden border-t border-sd-navy/15 overflow-y-auto max-h-[calc(100vh-var(--spacing-nav-mobile))] bg-sd-gray-bg border-b border-sd-gray-border`}>
          <nav className="px-4 py-4 flex flex-col gap-1">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="px-3 py-2 rounded-md text-sm font-semibold transition-colors text-sd-black hover:bg-sd-green/10"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            {session && (
              <Link
                to="/seo-dashboard"
                className="px-3 py-2 rounded-md text-sm font-bold transition-colors text-sd-black hover:bg-sd-green/10"
                onClick={() => setOpen(false)}
              >
                SEO Dashboard
              </Link>
            )}
            <Button
              asChild
              className="mt-3 bg-sd-black text-white hover:bg-sd-green-text"
              onClick={() => track("call_click", { button: "Mobile Menu Call", source: "mobile_menu" })}
            >
              <a href={SITE.phoneHref}>
                <Phone aria-hidden="true" /> Call {SITE.phone}
              </a>
            </Button>
            <Button asChild variant="dark">
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
