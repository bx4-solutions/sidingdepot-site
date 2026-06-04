import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, Loader2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLeadForm } from "@/hooks/use-lead-form";

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  phone: z.string().trim().min(7, "Invalid phone number").regex(/^[+\d\s().-]+$/, "Invalid phone number"),
  email: z.string().trim().email("Invalid email").max(255),
});

type Props = {
  source?: string;
  tag?: string;
  submitLabel?: string;
  downloadUrl?: string;
  downloadLabel?: string;
  onSuccess?: () => void;
};

export function SimpleLeadForm({
  source = "ebook_download",
  tag = "ebook_request",
  submitLabel = "Send My Free Guide →",
  downloadUrl = "/downloads/5-mistakes-siding-georgia.pdf",
  downloadLabel = "Download Your Siding Guide",
  onSuccess,
}: Props) {
  const { form, onSubmit, isSubmitting, isSuccess, error } = useLeadForm({
    schema,
    defaultValues: { name: "", phone: "", email: "" },
    source,
    tag,
    onSuccess,
  });

  const { register, formState: { errors } } = form;

  if (isSuccess) {
    return (
      <div className="px-2 py-6 text-center animate-in fade-in zoom-in duration-300">
        <CheckCircle2 className="mx-auto h-12 w-12 text-sd-green" />
        <h3 className="mt-3 font-display text-xl text-foreground uppercase tracking-tight">Thank you!</h3>
        <p className="mt-2 text-sm text-muted-foreground">Your guide is ready. Click below to download your free copy.</p>
        <a
          href={downloadUrl}
          target="_blank"
          rel="noopener noreferrer"
          download
          className="mt-5 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-sd-green px-6 text-sm font-bold text-sd-navy hover:bg-sd-green-hover transition-all transform hover:scale-[1.02]"
        >
          <Download className="h-4 w-4" /> {downloadLabel}
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <div className="grid gap-1.5">
        <Label htmlFor="lead-name" className="text-xs font-semibold">Full Name</Label>
        <Input {...register("name")} id="lead-name" className="h-11 transition-all focus:ring-2 focus:ring-sd-green/20" />
        {errors.name && <p className="text-[11px] text-destructive">{errors.name.message}</p>}
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="lead-phone" className="text-xs font-semibold">Phone</Label>
        <Input {...register("phone")} id="lead-phone" type="tel" className="h-11 transition-all focus:ring-2 focus:ring-sd-green/20" />
        {errors.phone && <p className="text-[11px] text-destructive">{errors.phone.message}</p>}
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="lead-email" className="text-xs font-semibold">Email</Label>
        <Input {...register("email")} id="lead-email" type="email" className="h-11 transition-all focus:ring-2 focus:ring-sd-green/20" />
        {errors.email && <p className="text-[11px] text-destructive">{errors.email.message}</p>}
      </div>
      {error && <p className="text-[11px] text-destructive text-center">{error}</p>}
      <Button type="submit" size="lg" disabled={isSubmitting} className="h-11 w-full font-bold shadow-lg shadow-sd-green/10">
        {isSubmitting ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Sending…</> : submitLabel}
      </Button>
    </form>
  );
}
