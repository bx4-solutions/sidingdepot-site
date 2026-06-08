import { useState, type ReactNode } from "react";
import { X } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { HeroQuoteForm } from "@/components/site/HeroQuoteForm";
import { track } from "@/lib/track";

type Props = {
  /** What triggers the modal — typically a Button. */
  trigger: ReactNode;
  /** Source label sent to analytics + included in the lead payload. */
  source: string;
  /** Optional GHL tag override. */
  tag?: string;
  /** Kept for backwards-compat with old call sites; not displayed. */
  title?: string;
  description?: string;
};

export function QuoteModal({ trigger, source, tag }: Props) {
  const [open, setOpen] = useState(false);

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (next) track("quote_modal_open", { source });
    else track("quote_modal_close", { source, had_input: false });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md p-0 overflow-y-auto max-h-[90dvh] bg-transparent border-0 shadow-none [&>button]:hidden">
        <DialogTitle className="sr-only">Get Your FREE Quote</DialogTitle>
        <div className="relative">
          <DialogClose
            className="absolute right-3 top-3 z-20 rounded-full bg-white/20 p-2 text-white hover:bg-white/40 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="Close"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </DialogClose>
          <HeroQuoteForm source={source} tag={tag} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
