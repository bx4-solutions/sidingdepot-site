import { useState } from "react";
import { Phone, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { QuickQuoteForm } from "@/components/site/QuickQuoteForm";
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
      <Button asChild size="lg" variant="outlineWhite" className="rounded-full font-bold">
        <a href={SITE.phoneHref} onClick={() => track("hero_call_click", { source })}>
          <Phone aria-hidden="true" className="h-5 w-5" />
          Call: {SITE.phone}
        </a>
      </Button>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button
            size="lg"
            className="rounded-full font-bold bg-sd-green text-sd-dark hover:bg-sd-green-hover shadow-lg shadow-sd-green/20"
          >
            <Calendar aria-hidden="true" className="h-5 w-5" />
            Free Quote
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-transparent border-0 shadow-none">
          <DialogTitle className="sr-only">Get Your Free Quote</DialogTitle>
          <QuickQuoteForm source={source} onSuccess={() => setTimeout(() => setOpen(false), 2500)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
