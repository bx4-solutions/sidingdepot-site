import { MapPin, Clock, Phone, Mail, Navigation, ExternalLink } from "lucide-react";
import { SITE } from "@/data/site";
import { Button } from "@/components/ui/button";
import { MapEmbed } from "@/components/site/MapEmbed";

export function MapSection() {
  const addressQuery = encodeURIComponent(`${SITE.name}, ${SITE.address.full}`);
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${addressQuery}`;
  const appleMapsUrl = `https://maps.apple.com/?q=${addressQuery}`;

  return (
    <section className="py-20 lg:py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <div>
            <span className="inline-block text-xs font-bold tracking-[0.12em] uppercase text-sd-green-text bg-sd-green-pale px-3 py-1 rounded">
              Our Location
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-sd-black">
              Visit Our Showroom in Marietta
            </h2>
            <p className="mt-4 text-sd-gray-text max-w-lg">
              Stop by our office to see full-size James Hardie siding products installed on
              showroom wall displays—not just small sample pieces. Compare siding profiles,
              windows displays, GAF roofing systems, gutters, railings, and composite materials
              in person and talk to our experts about your exterior renovation project.
            </p>

            <div className="mt-10 space-y-6">
              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-full bg-sd-green/20 border border-sd-green/40 flex items-center justify-center shrink-0">
                  <MapPin className="h-5 w-5 text-sd-green-dark" />
                </div>
                <div>
                  <h3 className="font-semibold text-sd-black">Address</h3>
                  <p className="text-sm text-sd-gray-text">{SITE.address.full}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-full bg-sd-green/20 border border-sd-green/40 flex items-center justify-center shrink-0">
                  <Clock className="h-5 w-5 text-sd-green-dark" />
                </div>
                <div>
                  <h3 className="font-semibold text-sd-black">Office Hours</h3>
                  <p className="text-sm text-sd-gray-text">{SITE.hours}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-full bg-sd-green/20 border border-sd-green/40 flex items-center justify-center shrink-0">
                  <Phone className="h-5 w-5 text-sd-green-dark" />
                </div>
                <div>
                  <h3 className="font-semibold text-sd-black">Phone</h3>
                  <a
                    href={SITE.phoneHref}
                    className="text-sm text-sd-gray-text hover:text-sd-green transition-colors"
                  >
                    {SITE.phone}
                  </a>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-full bg-sd-green/20 border border-sd-green/40 flex items-center justify-center shrink-0">
                  <Mail className="h-5 w-5 text-sd-green-dark" />
                </div>
                <div>
                  <h3 className="font-semibold text-sd-black">Email</h3>
                  <a
                    href={`mailto:${SITE.email}`}
                    className="text-sm text-sd-gray-text hover:text-sd-green transition-colors"
                  >
                    {SITE.email}
                  </a>
                </div>
              </div>

              <div className="pt-6 flex flex-wrap gap-3">
                <Button asChild variant="outline" size="sm" className="rounded-full">
                  <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
                    <Navigation className="mr-2 h-4 w-4" />
                    Open in Google Maps
                  </a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="rounded-full text-sd-black hover:text-sd-black"
                >
                  <a href={appleMapsUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Open in Apple Maps
                  </a>
                </Button>
              </div>
            </div>
          </div>

          <MapEmbed className="h-[400px] lg:h-[500px] shadow-xl" />
        </div>
      </div>
    </section>
  );
}
