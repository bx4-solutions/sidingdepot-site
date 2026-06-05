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
        <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-transparent border-0 shadow-none">
          <DialogTitle className="sr-only">Get Your Free Quote</DialogTitle>
          <QuickQuoteForm source={source} onSuccess={() => setTimeout(() => setOpen(false), 2500)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
