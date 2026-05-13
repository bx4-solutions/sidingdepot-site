import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Mail, MapPin, Music2, Phone, Youtube } from "lucide-react";
import { SITE, SERVICES, CITIES } from "@/data/site";

export function Footer() {
  return (
    <footer className="bg-sd-dark text-white">
      <div className="mx-auto max-w-7xl px-4 lg:px-8 py-14 pb-28 lg:pb-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-1">
            <div className="font-display text-3xl leading-none text-sd-green">
              SIDING<br />DEPOT
            </div>
            <p className="mt-3 text-sm text-white/50 max-w-xs">
              Georgia's trusted James Hardie Elite Preferred contractor. Serving
              North Atlanta since 2010.
            </p>
            <div className="mt-5 space-y-2 text-sm">
              <a href={SITE.phoneHref} className="flex items-center gap-2 text-sd-green hover:text-sd-green-hover">
                <Phone className="h-4 w-4" /> {SITE.phone}
              </a>
              <a href={`mailto:${SITE.email}`} className="flex items-center gap-2 text-sd-green hover:text-sd-green-hover">
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
                    to={`/${s.slug}` as string}
                    className="text-sm text-white/55 hover:text-sd-green"
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
                  <Link
                    to="/service-areas"
                    className="text-sm text-white/55 hover:text-sd-green"
                  >
                    {c.name}, GA
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold tracking-[0.12em] uppercase text-white mb-4">
              Company
            </h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="text-white/55 hover:text-sd-green">About</Link></li>
              <li><Link to="/gallery" className="text-white/55 hover:text-sd-green">Gallery</Link></li>
              <li><Link to="/reviews" className="text-white/55 hover:text-sd-green">Reviews</Link></li>
              <li><Link to="/finance" className="text-white/55 hover:text-sd-green">Financing</Link></li>
              <li><Link to="/contact" className="text-white/55 hover:text-sd-green">Contact</Link></li>
              <li><Link to="/privacy-policy" className="text-white/55 hover:text-sd-green">Privacy Policy</Link></li>
              <li><Link to="/terms-of-use" className="text-white/55 hover:text-sd-green">Terms of Use</Link></li>
            </ul>
            <div className="flex gap-3 mt-5">
              <a href={SITE.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-white/40 hover:text-sd-green"><Facebook className="h-5 w-5" /></a>
              <a href={SITE.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-white/40 hover:text-sd-green"><Instagram className="h-5 w-5" /></a>
              <a href={SITE.social.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="text-white/40 hover:text-sd-green"><Youtube className="h-5 w-5" /></a>
              <a href={SITE.social.tiktok} target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="text-white/40 hover:text-sd-green"><Music2 className="h-5 w-5" /></a>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between gap-3 text-xs text-white/40">
          <p>© {new Date().getFullYear()} {SITE.legalName}. All rights reserved.</p>
          <p>James Hardie Elite Preferred Contractor · Licensed & Insured · GA</p>
        </div>
      </div>
    </footer>
  );
}
