import { useState } from "react";
import { Phone, Calendar, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { HeroQuoteForm } from "@/components/site/HeroQuoteForm";
import { SITE } from "@/data/site";
import { track } from "@/lib/track";

type Props = {
  source?: string;
};

export function HeroCtaButtons({ source = "hero_cta" }: Props = {}) {
  const [open, setOpen] = useState(false);

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (next) track("quote_modal_open", { source });
  }

  return (
    <div className="flex flex-col sm:flex-row flex-wrap gap-3">
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button
            size="lg"
            className="w-full sm:w-auto px-10 py-7 text-lg font-bold bg-sd-green text-sd-dark hover:bg-sd-green-hover shadow-xl shadow-sd-green/20 rounded-full transition-all hover:scale-105"
          >
            <Calendar aria-hidden="true" className="h-5 w-5 mr-2" />
            Get My Free Quote →
          </Button>
        </DialogTrigger>
        {/* overflow-y-auto + max-h-[90dvh] fixes mobile scroll trap */}
        <DialogContent className="sm:max-w-md p-0 overflow-y-auto max-h-[90dvh] bg-transparent border-0 shadow-none [&>button]:hidden">
          <DialogTitle className="sr-only">Get Your Free Quote</DialogTitle>
          {/* Visible close button over the dark form header */}
          <div className="relative">
            <DialogClose
              className="absolute right-3 top-3 z-20 rounded-full bg-white/20 p-2 text-white hover:bg-white/40 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
              aria-label="Close"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </DialogClose>
            <HeroQuoteForm
              source={source}
              onSuccess={() => setTimeout(() => setOpen(false), 2500)}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
