import { Phone } from "lucide-react";
import { SITE } from "@/data/site";
import { track } from "@/lib/track";

export function FloatingCTA() {
  return (
    <div className="fixed bottom-[calc(env(safe-area-inset-bottom,0px)+6rem)] right-4 z-[9999] flex flex-col gap-2 lg:hidden">
      <a
        href={SITE.phoneHref}
        aria-label={`Call ${SITE.phone}`}
        className="flex items-center justify-center h-14 w-14 rounded-full bg-sd-green text-sd-black shadow-lg shadow-sd-green/30 hover:bg-sd-green-hover transition-all"
        onClick={() =>
          track("call_click", { button: "Floating Phone CTA", source: "floating_cta" })
        }
      >
        <Phone className="h-5 w-5" />
      </a>
    </div>
  );
}
