import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { HeroQuoteForm } from "@/components/site/HeroQuoteForm";
import { SidingGuide } from "@/components/SidingGuide";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { Download, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/guide")({
  validateSearch: (search: Record<string, unknown>) => ({
    city: (search.city as string) || "",
    src: (search.src as string) || "",
  }),
  head: () => ({
    meta: [
      { title: "Free Guide: Georgia Homeowner's Siding Guide 2026 | Siding Depot" },
      {
        name: "description",
        content:
          "Download our free guide before replacing your siding in Georgia. 8 pages of expert advice from James Hardie Elite Preferred contractors in Marietta, GA.",
      },
      { property: "og:title", content: "Free Guide: Georgia Homeowner's Siding Guide 2026" },
      { property: "og:description", content: "8 pages of expert advice for siding replacement in North Atlanta." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: GuidePage,
});

function GuidePage() {
  const { city, src } = Route.useSearch();
  const navigate = useNavigate();
  const [downloadReady, setDownloadReady] = useState(false);
  const [exporting, setExporting] = useState(false);

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
      
      pdf.save("SidingDepot-Georgia-Homeowner-Guide-2026.pdf");
    } catch (err) {
      console.error("PDF Export failed:", err);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="bg-sd-gray-bg min-h-screen">
      {/* Navigation overlay when guide is visible */}
      {downloadReady && (
        <div className="fixed top-0 left-0 w-full bg-sd-navy/95 backdrop-blur-sm z-50 px-6 py-4 flex justify-between items-center shadow-lg border-b border-white/10">
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
          <Button 
            onClick={exportPDF} 
            disabled={exporting}
            className="bg-sd-green text-sd-navy font-bold rounded-pill h-10 px-6"
          >
            {exporting ? (
              <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Generating...</>
            ) : (
              <><Download className="h-4 w-4 mr-2" /> Download PDF</>
            )}
          </Button>
        </div>
      )}

      <div className={`transition-all duration-500 ${downloadReady ? "pt-24 opacity-100" : "pt-20"}`}>
        {!downloadReady ? (
          <div className="mx-auto max-w-4xl px-4 text-center py-20">
             <div className="inline-block bg-sd-green/15 text-sd-green font-bold text-xs px-4 py-1.5 rounded-full uppercase tracking-widest mb-6">
                Free 2026 Edition
             </div>
            <h1 className="font-display text-4xl sm:text-6xl text-sd-navy leading-[1.1] uppercase">
              The Georgia Homeowner's<br />
              <span className="text-sd-green">Siding Guide</span>
            </h1>
            <p className="mt-6 text-sd-gray-text text-lg max-w-2xl mx-auto leading-relaxed">
              Don't hire a contractor until you read this. 8 pages of expert advice covering Georgia climate risks, material comparisons, and the 5 fatal mistakes that ruin budgets.
            </p>

            <div className="mt-12 bg-white p-8 rounded-2xl shadow-xl border border-sd-gray-border max-w-md mx-auto relative isolate overflow-hidden">
              <div className="absolute top-0 right-0 -z-10 opacity-5">
                <Download className="h-40 w-40 text-sd-navy" />
              </div>
              <h3 className="text-xl font-bold text-sd-navy mb-2 uppercase tracking-tight">Request Instant Access</h3>
              <p className="text-sd-gray-text text-sm mb-8 italic">Sent directly to your inbox and available for download.</p>
              
              {/* Using a custom onSuccess callback proxy via HeroQuoteForm if we had one, 
                  but for now we'll simulate the successful transition based on GHL submit logic
                  or provide a simple success state for the user. */}
              <div className="text-left">
                <HeroQuoteForm
                  source={src || "guide_page"}
                  tag="guide_request"
                  bare
                />
              </div>

              {/* Development bypass */}
              <button 
                onClick={() => setDownloadReady(true)}
                className="mt-8 text-[10px] text-sd-gray-text/40 uppercase font-bold tracking-widest hover:text-sd-green transition-colors"
              >
                (Dev: View Guide Content)
              </button>
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
              <p className="font-display text-2xl tracking-wide uppercase mb-4">Trusted by 1,500+ North Atlanta Homeowners</p>
              <div className="flex flex-wrap justify-center gap-8 opacity-60 text-xs font-bold uppercase tracking-widest">
                 <span>Marietta</span>
                 <span>Alpharetta</span>
                 <span>Milton</span>
                 <span>Canton</span>
                 <span>Woodstock</span>
                 <span>Roswell</span>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
