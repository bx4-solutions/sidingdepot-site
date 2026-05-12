import { Link } from "@tanstack/react-router";
import { track } from "@/lib/track";

const ITEMS = [
  { slug: "siding", label: "Siding" },
  { slug: "painting", label: "Painting" },
  { slug: "windows", label: "Windows" },
] as const;

/**
 * Service strip — sits directly under the Navbar, modeled after Dr. Roof's
 * "Roofing – Siding – Windows" tagline. Each item links to the matching
 * service card on the home page (smooth-scroll via #services-{slug}).
 */
export function ServiceStrip() {
  return (
    <div className="w-full bg-sd-gray-bg border-b border-sd-gray-border">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <ul className="flex flex-col sm:flex-row items-stretch justify-center divide-y sm:divide-y-0 sm:divide-x divide-sd-gray-border">
          {ITEMS.map((item) => (
            <li key={item.slug} className="flex-1">
              <Link
                to="/"
                hash={`services-${item.slug}`}
                onClick={() => track("service_strip_click", { service: item.slug })}
                className="group flex items-center justify-center gap-2 py-3 sm:py-3.5 px-4 font-display text-base sm:text-lg tracking-wide text-sd-navy transition-colors hover:text-sd-green focus-visible:outline-none focus-visible:text-sd-green"
              >
                <span>{item.label}</span>
                <span
                  aria-hidden
                  className="hidden sm:inline-block h-1.5 w-1.5 rounded-full bg-sd-green opacity-0 transition-opacity group-hover:opacity-100"
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
