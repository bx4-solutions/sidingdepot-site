import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Music2, Phone } from "lucide-react";
import { SITE, SERVICES, CITIES } from "@/data/site";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import logoSidingDepot from "@/assets/logo-sidingdepot.png";

const LucideFacebook = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);
const LucideInstagram = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.51" />
  </svg>
);
const LucideYoutube = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 2-2 69.14 69.14 0 0 1 15 0 2 2 0 0 1 2 2 24.12 24.12 0 0 1 0 10 2 2 0 0 1-2 2 69.14 69.14 0 0 1-15 0 2 2 0 0 1-2-2z" />
    <polyline points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
  </svg>
);

export function Footer() {
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <footer className="bg-sd-black text-white">
      <div className="mx-auto max-w-7xl px-4 lg:px-8 py-14 pb-24 lg:pb-14">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
          <div className="md:col-span-1">
            <img
              src={logoSidingDepot}
              alt={`${SITE.name} logo`}
              className="h-16 w-auto mb-2"
              width="200"
              height="64"
              loading="lazy"
              decoding="async"
            />
            <p className="mt-3 text-sm text-white/50 max-w-xs">
              Georgia's trusted James Hardie Elite Preferred contractor. Serving North Atlanta since
              2010.
            </p>
            <div className="mt-5 space-y-2 text-sm">
              <a
                href={SITE.phoneHref}
                className="flex items-center gap-2 py-2 text-sd-green hover:text-sd-green-hover"
              >
                <Phone className="h-4 w-4" /> {SITE.phone}
              </a>
              <a
                href={`mailto:${SITE.email}`}
                className="flex items-center gap-2 py-2 text-sd-green hover:text-sd-green-hover"
              >
                <Mail className="h-4 w-4" /> {SITE.email}
              </a>
              <div className="flex items-start gap-2 text-white/60">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0" /> {SITE.address.full}
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold tracking-[0.12em] uppercase text-white mb-4">
              Services
            </h3>
            <ul className="space-y-2">
              {SERVICES.map((s) => (
                <li key={s.slug}>
                  <Link
                    to={`/${s.slug}`}
                    className="block py-2 text-sm text-white/55 hover:text-sd-green"
                  >
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold tracking-[0.12em] uppercase text-white mb-4">
              Service Areas
            </h3>
            <ul className="space-y-2">
              {CITIES.slice(0, 8).map((c) => (
                <li key={c.slug}>
                  <span className="block py-2 text-sm text-white/55 cursor-default">
                    {c.name}, GA
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold tracking-[0.12em] uppercase text-white mb-4">
              Company
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="text-white/55 hover:text-sd-green">
                  About
                </Link>
              </li>
              <li>
                <Link to="/projects" className="text-white/55 hover:text-sd-green">
                  Gallery
                </Link>
              </li>
              <li>
                <span className="text-white/55 cursor-default">Blog</span>
              </li>
              <li>
                <Link to="/guide" className="text-white/55 hover:text-sd-green">
                  Free Guide
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-white/55 hover:text-sd-green">
                  Contact
                </Link>
              </li>
              <li>
                <a
                  href={
                    import.meta.env.DEV
                      ? "http://localhost:4004/admin/dashboard"
                      : "https://sidingdepot-dashboard.vercel.app/admin/dashboard"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/40 hover:text-white/70"
                >
                  Painel
                </a>
              </li>
            </ul>
            <div className="flex gap-3 mt-5">
              <a
                href={SITE.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="p-2 -m-2 text-white/70 hover:text-sd-green"
              >
                <LucideFacebook className="h-5 w-5" />
              </a>
              <a
                href={SITE.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="p-2 -m-2 text-white/70 hover:text-sd-green"
              >
                <LucideInstagram className="h-5 w-5" />
              </a>
              <a
                href={SITE.social.youtube}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="p-2 -m-2 text-white/70 hover:text-sd-green"
              >
                <LucideYoutube className="h-5 w-5" />
              </a>
              <a
                href={SITE.social.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="p-2 -m-2 text-white/70 hover:text-sd-green"
              >
                <Music2 className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between gap-3 text-xs text-white/70">
          <p>
            © {new Date().getFullYear()} {SITE.legalName}. All rights reserved.
          </p>
          <p className="text-balance">
            James Hardie Elite Preferred Contractor · Licensed &amp; Insured · GA
          </p>
        </div>
      </div>
    </footer>
  );
}
