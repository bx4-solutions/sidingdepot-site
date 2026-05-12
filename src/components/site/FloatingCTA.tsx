import { Link } from "@tanstack/react-router";
import { Phone, MessageSquareText } from "lucide-react";
import { SITE } from "@/data/site";

export function FloatingCTA() {
  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col gap-2 lg:hidden">
      <a
        href={SITE.phoneHref}
        aria-label={`Call ${SITE.phone}`}
        className="flex items-center justify-center h-13 w-13 rounded-full bg-sd-green text-sd-black shadow-lg shadow-sd-green/30 hover:bg-sd-green-hover transition-all"
      >
        <Phone className="h-5 w-5" />
      </a>
      <Link
        to="/contact"
        aria-label="Get a free quote"
        className="flex items-center justify-center h-13 w-13 rounded-full bg-sd-navy text-sd-green shadow-lg hover:bg-sd-dark transition-all"
      >
        <MessageSquareText className="h-5 w-5" />
      </Link>
    </div>
  );
}
