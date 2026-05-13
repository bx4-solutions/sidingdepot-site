import { useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { HeroQuoteForm } from "@/components/site/HeroQuoteForm";
import { trackContactPageView } from "@/lib/track";
import { MapSection } from "@/components/site/MapSection";

const searchSchema = z.object({
  source: z.string().max(80).optional(),
  city: z.string().max(80).optional(),
  service: z.string().max(80).optional(),
});

export const Route = createFileRoute("/contact")({
  validateSearch: (s) => searchSchema.parse(s),
  head: () => ({
    meta: [
      { title: "Solicitar Orçamento — Siding Depot" },
      {
        name: "description",
        content:
          "Peça seu orçamento gratuito de siding, pintura, janelas, decks ou roofing em North Atlanta. Resposta em 24h.",
      },
      { property: "og:title", content: "Solicitar Orçamento — Siding Depot" },
      { property: "og:description", content: "Peça seu orçamento gratuito de siding, pintura, janelas, decks ou roofing em North Atlanta. Resposta em 24h." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/43cab0b0-cb06-42f1-a067-d5f0523e2835" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Solicitar Orçamento — Siding Depot" },
      { name: "twitter:description", content: "Peça seu orçamento gratuito de siding, pintura, janelas, decks ou roofing em North Atlanta. Resposta em 24h." },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/43cab0b0-cb06-42f1-a067-d5f0523e2835" },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const search = Route.useSearch();

  useEffect(() => {
    trackContactPageView();
  }, []);

  return (
    <section className="py-hero-compact lg:py-hero-compact-lg bg-sd-gray-bg min-h-[70vh]">
      <div className="mx-auto max-w-2xl px-4 lg:px-8">
        <div className="text-center">
          <span className="inline-block text-xs font-bold tracking-[0.12em] uppercase text-sd-green-text bg-sd-green-pale px-3 py-1 rounded">
            Free Quote · 24h Response
          </span>
          <h1 className="mt-4 font-display text-4xl sm:text-5xl text-sd-black">
            Solicitar Orçamento
          </h1>
          <p className="mt-3 text-sd-gray-text">
            Conte sobre seu projeto e respondemos em até 24h com uma estimativa por escrito.
          </p>
        </div>

        <div className="mt-10">
          <HeroQuoteForm
            source={search.source || "contact_page"}
            tag="contact_page_request"
          />
        </div>
      </div>
      <MapSection />
    </section>
  );
}
