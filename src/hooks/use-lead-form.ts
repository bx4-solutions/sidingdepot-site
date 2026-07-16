import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { submitLead, LeadPayload } from "@/lib/leads";
import { trackLeadSubmit } from "@/lib/track";
import { z } from "zod";

interface UseLeadFormOptions<T extends z.ZodType<any, any>> {
  schema: T;
  defaultValues: z.infer<T>;
  source: string;
  tag: string;
  onSuccess?: () => void;
}

export function useLeadForm<T extends z.ZodType<any, any>>({
  schema,
  defaultValues,
  source,
  tag,
  onSuccess,
}: UseLeadFormOptions<T>) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<T>>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const onSubmit = async (values: z.infer<T>) => {
    setIsSubmitting(true);
    setError(null);

    const payload: LeadPayload = {
      ...values,
      source,
      tag,
    };

    const result = await submitLead(payload);

    if (result.success) {
      // Fire conversion event into dataLayer (GTM → Google Ads) + Meta Pixel.
      // `tag` carries the service context (e.g. "james-hardie", "siding-replacement").
      trackLeadSubmit({ service: tag, source });
      setIsSuccess(true);
      onSuccess?.();
    } else {
      setError("Something went wrong. Please try again or call us.");
    }

    setIsSubmitting(false);
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isSubmitting,
    isSuccess,
    error,
    reset: () => {
      form.reset();
      setIsSuccess(false);
      setError(null);
    },
  };
}
