import { useState, type ReactNode } from "react";
import {
  Dialog,
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
      <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-transparent border-0 shadow-none">
        <DialogTitle className="sr-only">Get Your FREE Quote</DialogTitle>
        <HeroQuoteForm source={source} tag={tag} />
      </DialogContent>
    </Dialog>
  );
}
