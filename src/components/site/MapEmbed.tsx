import { Loader2, MapPin } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SITE } from "@/data/site";

interface MapEmbedProps {
  className?: string;
  title?: string;
  query?: string;
}

/**
 * Reusable Google Maps iframe embed with loading + error fallback.
 * Uses the no-key embed URL by default; if VITE_GOOGLE_MAPS_API_KEY is set,
 * uses the official Embed API for nicer rendering.
 */
export function MapEmbed({ className = "h-[300px]", title, query }: MapEmbedProps) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;

  const [isLoading, setIsLoading] = useState(true);
  // Sem chave da Maps Embed API, o Google faz 301 do embed keyless para um
  // endpoint com X-Frame-Options: SAMEORIGIN → iframe em branco e o onError
  // nunca dispara. Nesse caso degradamos direto para o card de localizacao.
  const [hasError, setHasError] = useState(!apiKey);
  const addressQuery = encodeURIComponent(query ?? `${SITE.name}, ${SITE.address.full}`);

  const mapUrl = apiKey
    ? `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${addressQuery}`
    : `https://www.google.com/maps?q=${addressQuery}&z=15&output=embed`;

  const externalUrl = `https://www.google.com/maps/dir/?api=1&destination=${addressQuery}`;

  return (
    <div
      className={`relative rounded-2xl overflow-hidden bg-sd-gray-bg border border-black/5 ${className}`}
    >
      {isLoading && !hasError && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-sd-gray-bg">
          <Loader2 className="h-7 w-7 text-sd-green animate-spin" />
          <p className="mt-2 text-xs text-sd-gray-text">Loading map…</p>
        </div>
      )}

      {hasError ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
          <MapPin className="h-10 w-10 text-sd-gray-text/40 mb-3" />
          <h4 className="font-semibold text-sd-black text-sm">Map couldn't load</h4>
          <p className="mt-1 text-xs text-sd-gray-text max-w-xs">
            View our location on Google Maps instead.
          </p>
          <Button asChild variant="dark" size="sm" className="mt-4">
            <a href={externalUrl} target="_blank" rel="noopener noreferrer">
              Open in Google Maps
            </a>
          </Button>
        </div>
      ) : (
        <iframe
          title={title ?? `${SITE.name} Location`}
          src={mapUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
        />
      )}
    </div>
  );
}
