import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { HeroQuoteForm } from "@/components/site/HeroQuoteForm";
import { SidingGuide } from "@/components/SidingGuide";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { Download, Loader2, ArrowLeft, Share2, Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ORG_SCHEMA, LOCAL_BUSINESS_SCHEMA } from "@/lib/schema";

export const Route = createFileRoute("/guide")({
  validateSearch: (search: Record<string, unknown>) => ({
    city: (search.city as string) || "",
    src: (search.src as string) || "",
    download: (search.download as string) || "",
  }),
  head: () => ({
    meta: [
      { title: "Free Guide: 5 Fatal Siding Mistakes to Avoid in Georgia (2026) | Siding Depot" },
      {
        name: "description",
        content:
          "Download our free 8-page guide: 5 Fatal Siding Mistakes Georgia Homeowners Make. Expert advice on James Hardie installation, pricing traps, and climate risks.",
      },
      { property: "og:title", content: "Free Guide: 5 Fatal Siding Mistakes to Avoid in Georgia" },
      {
        property: "og:description",
        content:
          "8 pages of expert advice to prevent siding budget overruns and install failures in North Atlanta.",
      },
      { property: "og:type", content: "website" },
    ],
    scripts: [
      { type: "application/ld+json", children: JSON.stringify(ORG_SCHEMA) },
      { type: "application/ld+json", children: JSON.stringify(LOCAL_BUSINESS_SCHEMA) },
    ],
  }),
  component: GuidePage,
});

function GuidePage() {
  const { city, src, download } = Route.useSearch();
  const navigate = useNavigate();
  const [downloadReady, setDownloadReady] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [publicUrl, setPublicUrl] = useState<string | null>(null);
  const [copying, setCopying] = useState(false);

  // Persistence within session
  useEffect(() => {
    const isUnlocked = sessionStorage.getItem("guide_unlocked") === "true";
    if (isUnlocked || download) {
      setDownloadReady(true);
    }
  }, [download]);

  const handleSuccess = () => {
    sessionStorage.setItem("guide_unlocked", "true");
    setDownloadReady(true);
  };

  const exportPDF = async () => {
    setExporting(true);
    try {
      const pdf = new jsPDF("p", "pt", "a4");
      const pages = document.querySelectorAll(".guide-page");

      for (let i = 0; i < pages.length; i++) {
        const page = pages[i] as HTMLElement;
        const canvas = await html2canvas(page, {
          scale: 2,
          useCORS: true,
          logging: false,
          allowTaint: true,
        });

        const imgData = canvas.toDataURL("image/jpeg", 0.95);
        if (i > 0) pdf.addPage();
        // A4 in pt is 595 x 842
        pdf.addImage(imgData, "JPEG", 0, 0, 595, 842);
      }

      const fileName = `SidingDepot-Georgia-Homeowner-Guide-2026-${Date.now()}.pdf`;
      const pdfBlob = pdf.output("blob");

      // Save locally
      pdf.save("SidingDepot-Georgia-Homeowner-Guide-2026.pdf");

      // Upload to Supabase for shareable link
      const { data, error } = await supabase.storage.from("guides").upload(fileName, pdfBlob, {
        contentType: "application/pdf",
        cacheControl: "3600",
        upsert: false,
      });

      if (error) throw error;

      const {
        data: { publicUrl },
      } = supabase.storage.from("guides").getPublicUrl(fileName);

      setPublicUrl(publicUrl);
      toast.success("Shareable link generated!");
    } catch (err) {
      console.error("PDF Export failed:", err);
      toast.error("Failed to generate shareable link, but PDF was downloaded.");
    } finally {
      setExporting(false);
    }
  };

  const copyToClipboard = async () => {
    if (!publicUrl) return;
    setCopying(true);
    try {
      await navigator.clipboard.writeText(publicUrl);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopying(false), 2000);
    } catch (err) {
      setCopying(false);
    }
  };

  return (
    <div className="bg-sd-gray-bg min-h-screen">
      {/* Navigation overlay when guide is visible */}
      {downloadReady && (
        <div className="fixed top-0 left-0 w-full bg-sd-navy/95 backdrop-blur-sm z-50 px-3 sm:px-6 py-4 flex justify-between items-center shadow-lg border-b border-white/10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setDownloadReady(false)}
              className="text-white hover:text-sd-green flex items-center gap-2 text-sm font-bold uppercase tracking-wider"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            <div className="h-6 w-px bg-white/20 hidden sm:block" />
            <div className="hidden sm:block text-white/60 text-xs font-bold uppercase tracking-widest">
              Georgia Homeowner's Siding Guide 2026
            </div>
          </div>
          <div className="flex items-center gap-2">
            {publicUrl && (
              <Button
                onClick={copyToClipboard}
                variant="outline"
                className="bg-transparent border-white/20 text-white hover:bg-white/10 font-bold rounded-pill h-10 px-3 sm:px-4"
              >
                {copying ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                {copying ? "Copied" : "Copy Link"}
              </Button>
            )}
            <Button
              onClick={exportPDF}
              disabled={exporting}
              className="bg-sd-green text-sd-navy font-bold rounded-pill h-10 px-3 sm:px-6"
            >
              {exporting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" /> Generating...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" /> Download PDF
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      <div
        className={`transition-all duration-500 ${downloadReady ? "pt-24 opacity-100" : "pt-20"}`}
      >
        {!downloadReady ? (
          <div className="mx-auto max-w-4xl px-4 text-center py-20">
            <div className="inline-block bg-sd-green/15 text-sd-green font-bold text-xs px-4 py-1.5 rounded-full uppercase tracking-widest mb-6">
              Free 2026 Edition
            </div>
            <h1 className="font-display text-4xl sm:text-6xl text-sd-navy leading-[1.1] uppercase">
              5 Siding Mistakes
              <br />
              <span className="text-sd-green">You Can't Afford</span>
            </h1>
            <p className="mt-6 text-sd-gray-text text-lg max-w-2xl mx-auto leading-relaxed">
              Don't hire a contractor until you read this. 8 pages of expert advice covering the
              "fatal 5" mistakes that ruin siding budgets across Georgia every year.
            </p>

            <div className="mt-12 bg-white p-8 rounded-2xl shadow-xl border border-sd-gray-border max-w-md mx-auto relative isolate overflow-hidden">
              <div className="absolute top-0 right-0 -z-10 opacity-5">
                <Download className="h-40 w-40 text-sd-navy" />
              </div>
              <h3 className="text-xl font-bold text-sd-navy mb-2 uppercase tracking-tight">
                Request Instant Access
              </h3>
              <p className="text-sd-gray-text text-sm mb-8 italic">
                Sent directly to your inbox and available for download.
              </p>

              <div className="text-left">
                <HeroQuoteForm
                  source={src || "guide_page"}
                  tag="guide_request"
                  submitLabel="Send My Free Guide →"
                  onSuccess={handleSuccess}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center pb-20">
            <SidingGuide />
          </div>
        )}
      </div>

      {/* Footer Info (Static) */}
      {!downloadReady && (
        <div className="bg-sd-navy py-16 text-center text-white border-t-4 border-sd-green">
          <div className="max-w-4xl mx-auto px-4">
            <p className="font-display text-2xl tracking-wide uppercase mb-4">
              Trusted by 1,500+ North Atlanta Homeowners
            </p>
            <div className="flex flex-wrap justify-center gap-8 opacity-60 text-xs font-bold uppercase tracking-widest">
              <span>Marietta</span>
              <span>Alpharetta</span>
              <span>Milton</span>
              <span>Marietta</span>
              <span>Woodstock</span>
              <span>Roswell</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
