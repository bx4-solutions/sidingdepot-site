import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { HeroQuoteForm } from "@/components/site/HeroQuoteForm";

export const Route = createFileRoute("/guide")({
  head: () => ({
    meta: [
      { title: "Free Guide: Georgia Homeowner's Siding Guide 2026 | Siding Depot" },
      {
        name: "description",
        content:
          "Download our free guide before replacing your siding in Georgia. 8 pages of expert advice from James Hardie Elite Preferred contractors in Marietta, GA.",
      },
    ],
  }),
  component: GuidePage,
});

function GuidePage() {
  const [downloadReady, setDownloadReady] = useState(false);

  return (
    <div className="py-20 bg-sd-gray-bg min-h-screen">
      <div className="mx-auto max-w-4xl px-4 text-center">
        <h1 className="font-display text-4xl sm:text-5xl text-sd-navy">The Georgia Homeowner's Siding Guide</h1>
        <p className="mt-4 text-sd-gray-text text-lg">
          Download our expert 8-page guide to navigate your siding replacement project with confidence.
        </p>

        {!downloadReady ? (
          <div className="mt-12 bg-white p-8 rounded-2xl shadow-sm border border-sd-gray-border max-w-md mx-auto">
            <h3 className="text-xl font-bold text-sd-navy mb-6">Get Your Free Guide</h3>
            <HeroQuoteForm
              source="guide_page"
              tag="guide_request"
              bare
            />
            {/* Minimal success-state simulation until full export is built */}
            <button 
              onClick={() => setDownloadReady(true)}
              className="mt-6 text-xs text-sd-gray-text underline"
            >
              (Simulate submit for demo)
            </button>
          </div>
        ) : (
          <div className="mt-12">
             <button className="bg-sd-green text-sd-navy font-bold px-8 py-4 rounded-pill hover:opacity-90">
               Download PDF
             </button>
          </div>
        )}
      </div>
    </div>
  );
}
