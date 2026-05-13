import { MapPin, Clock, Phone, Mail } from "lucide-react";
import { SITE } from "@/data/site";

export function MapSection() {
  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=${
    import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ""
  }&q=${encodeURIComponent(SITE.address.full)}`;

  // Fallback to a simpler search embed if no API key is provided
  // Note: Standard embed without API key uses a different URL structure
  const fallbackMapUrl = `https://www.google.com/maps?q=${encodeURIComponent(
    SITE.address.full
  )}&output=embed`;

  const finalUrl = import.meta.env.VITE_GOOGLE_MAPS_API_KEY ? mapUrl : fallbackMapUrl;

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
              Stop by our office to see James Hardie siding samples, window displays, and talk to our experts about your exterior renovation project.
            </p>

            <div className="mt-10 space-y-6">
              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-full bg-sd-green/10 flex items-center justify-center shrink-0">
                  <MapPin className="h-5 w-5 text-sd-green" />
                </div>
                <div>
                  <h3 className="font-semibold text-sd-black">Address</h3>
                  <p className="text-sm text-sd-gray-text">{SITE.address.full}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-full bg-sd-green/10 flex items-center justify-center shrink-0">
                  <Clock className="h-5 w-5 text-sd-green" />
                </div>
                <div>
                  <h3 className="font-semibold text-sd-black">Office Hours</h3>
                  <p className="text-sm text-sd-gray-text">{SITE.hours}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-full bg-sd-green/10 flex items-center justify-center shrink-0">
                  <Phone className="h-5 w-5 text-sd-green" />
                </div>
                <div>
                  <h3 className="font-semibold text-sd-black">Phone</h3>
                  <a href={SITE.phoneHref} className="text-sm text-sd-gray-text hover:text-sd-green transition-colors">
                    {SITE.phone}
                  </a>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-full bg-sd-green/10 flex items-center justify-center shrink-0">
                  <Mail className="h-5 w-5 text-sd-green" />
                </div>
                <div>
                  <h3 className="font-semibold text-sd-black">Email</h3>
                  <a href={`mailto:${SITE.email}`} className="text-sm text-sd-gray-text hover:text-sd-green transition-colors">
                    {SITE.email}
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="relative h-[400px] lg:h-[500px] rounded-2xl overflow-hidden border border-sd-gray-bg shadow-xl bg-sd-gray-bg">
            <iframe
              title="Siding Depot Location"
              src={finalUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
}
