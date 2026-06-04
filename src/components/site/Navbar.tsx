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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface NavLink {
  to: string;
  label: string;
  sublinks?: { to: string; label: string }[];
}

const NAV_LINKS: NavLink[] = [
  { 
    to: "/siding", 
    label: "SIDING",
    sublinks: [{ to: "/siding", label: "SIDING" }]
  },
  { 
    to: "/roofing", 
    label: "ROOFING",
    sublinks: [{ to: "/roofing", label: "ROOFING" }]
  },
  { 
    to: "/deck", 
    label: "DECKS",
    sublinks: [{ to: "/deck", label: "DECKS" }]
  },
  { 
    to: "/windows", 
    label: "WINDOWS",
    sublinks: [{ to: "/windows", label: "WINDOWS" }]
  },
  { 
    to: "/gutters", 
    label: "GUTTERS",
    sublinks: [{ to: "/gutters", label: "GUTTERS" }]
  },
  { 
    to: "/painting", 
    label: "PAINTING",
    sublinks: [{ to: "/painting", label: "PAINTING" }]
  },
  { 
    to: "/projects", 
    label: "PROJECT GALLERY",
    sublinks: [{ to: "/projects", label: "PROJECT GALLERY" }]
  },
  { 
    to: "/about", 
    label: "ABOUT",
    sublinks: [{ to: "/about", label: "ABOUT" }]
  },
];

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

        <nav className="hidden lg:flex items-center gap-2">
          <ul className="flex items-center gap-1 list-none m-0 p-0">
            {NAV_LINKS.map((l) => (
              <li key={l.label} className="relative group">
                <div className="flex items-center gap-1 py-2 px-3">
                  <Link 
                    to={l.to} 
                    className={cn(
                      "text-[13px] font-semibold tracking-wide transition-colors text-sd-black hover:text-sd-green-text",
                      location.pathname === l.to && "text-sd-green-text underline underline-offset-4"
                    )}
                  >
                    {l.label}
                  </Link>
                  {l.sublinks && (
                    <ChevronDown className="h-3 w-3 text-sd-black group-hover:text-sd-green-text transition-transform group-hover:rotate-180" />
                  )}
                </div>
                
                {l.sublinks && (
                  <div className="absolute left-1/2 -translate-x-1/2 top-full pt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="w-[200px] bg-white border border-sd-navy/10 shadow-xl rounded-md overflow-hidden py-2">
                      {l.sublinks.map((sub) => (
                        <Link
                          key={sub.label}
                          to={sub.to}
                          className="block px-4 py-3 text-[12px] font-bold tracking-wider transition-colors hover:bg-sd-green/10 hover:text-sd-green-text text-sd-black"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </li>
            ))}
            {session && (
              <li>
                <Link
                  to="/seo-dashboard"
                  className="text-[13px] font-bold tracking-wide transition-colors text-sd-black hover:text-sd-green-text px-3 py-2"
                >
                  SEO DASHBOARD
                </Link>
              </li>
            )}
          </ul>
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
            <Accordion type="single" collapsible className="w-full">
              {NAV_LINKS.map((l) => (
                <div key={l.label}>
                  {l.sublinks ? (
                    <AccordionItem value={l.label} className="border-none">
                      <AccordionTrigger className="px-3 py-2 text-sm font-semibold text-sd-black hover:bg-sd-green/10 hover:no-underline rounded-md">
                        {l.label}
                      </AccordionTrigger>
                      <AccordionContent className="pb-1 pl-4 flex flex-col gap-1">
                        {l.sublinks.map((sub) => (
                          <Link
                            key={sub.label}
                            to={sub.to}
                            className="px-3 py-2 rounded-md text-xs font-medium text-sd-black/70 hover:bg-sd-green/10"
                            onClick={() => setOpen(false)}
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                  ) : (
                    <Link
                      to={l.to}
                      className="px-3 py-2 flex items-center rounded-md text-sm font-semibold transition-colors text-sd-black hover:bg-sd-green/10"
                      onClick={() => setOpen(false)}
                    >
                      {l.label}
                    </Link>
                  )}
                </div>
              ))}
            </Accordion>
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
