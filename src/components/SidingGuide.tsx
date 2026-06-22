import React from "react";
import { Star, CheckCircle2, ShieldCheck, Mail, Phone, MapPin, ExternalLink, Award } from "lucide-react";

/**
 * Standardized A4 dimensions for 96 DPI export (816x1056).
 * html2canvas/jsPDF will use this for high-fidelity export.
 */
export const PAGE_WIDTH = 816;
export const PAGE_HEIGHT = 1056;

const BrandHeader = ({ pageNum }: { pageNum: number }) => (
  <div className="absolute top-0 left-0 w-full">
    <div className="h-2 w-full bg-[var(--sd-green)]" />
    <div className="flex justify-between items-center px-10 py-6">
      <div className="font-display text-[28px] text-[#0A0A0A] leading-none tracking-tight bg-[var(--sd-green)] px-2 py-1 rounded" aria-hidden="true">SIDING DEPOT</div>
      <div className="text-[10px] font-bold text-[#2D3748] tracking-widest uppercase opacity-40">
        Page {pageNum} / 8
      </div>
    </div>
  </div>
);

const BrandFooter = () => (
  <div className="absolute bottom-0 left-0 w-full px-10 py-6 border-t border-[#E2E8EE] flex justify-between items-center bg-white text-[11px] text-[#6B7A8A]">
    <div className="font-semibold">sidingdepot.com</div>
    <div className="flex gap-4">
      <span>(678) 400-2012</span>
      <span className="opacity-50">|</span>
      <span>office@sidingdepot.com</span>
    </div>
  </div>
);

const PageWrapper = ({ children, pageNum, className = "" }: { children: React.ReactNode; pageNum: number; className?: string }) => (
  <div 
    className={`guide-page relative bg-white overflow-hidden shadow-2xl mx-auto mb-10 select-none ${className}`}
    style={{ width: PAGE_WIDTH, height: PAGE_HEIGHT }}
    id={`page-${pageNum}`}
  >
    {pageNum !== 1 && pageNum !== 8 && <BrandHeader pageNum={pageNum} />}
    <div className="h-full w-full">{children}</div>
    {pageNum !== 1 && pageNum !== 8 && <BrandFooter />}
  </div>
);

/* ------------------------------------------------------------------ */
/* Pages                                                               */
/* ------------------------------------------------------------------ */

export const SidingGuide = () => {
  return (
    <div className="guide-container py-10">
      
      {/* PAGE 1 - COVER */}
      <PageWrapper pageNum={1} className="bg-[#0A0A0A]">
        <div className="absolute top-10 left-10">
          <div className="font-display text-[28px] text-[#0A0A0A] tracking-tight bg-[var(--sd-green)] px-2 py-1 rounded" aria-hidden="true">SIDING DEPOT</div>
        </div>
        <div className="absolute top-10 right-10">
          <div className="bg-[var(--sd-green)]/15 border border-[var(--sd-green)]/40 px-3 py-1 rounded-full text-[var(--sd-green)] text-[10px] font-bold tracking-widest uppercase">
            ★ JAMES HARDIE ELITE PREFERRED
          </div>
        </div>

        <div className="flex flex-col h-full justify-center px-16 pt-20">
          {/* Stylized House Illustration (SVG/CSS) */}
          <div className="relative w-[320px] h-[240px] mx-auto mb-16 opacity-90">
             <div className="absolute bottom-0 w-full h-[140px] bg-[#2D3748] border-b-8 border-[var(--sd-green)]" />
             <div className="absolute bottom-0 left-[20%] w-[25%] h-[90px] bg-[#0A0A0A] border-t-4 border-x-4 border-[var(--sd-green)]/20" />
             <div className="absolute bottom-[90px] left-[15%] border-l-[110px] border-l-transparent border-r-[110px] border-r-transparent border-bottom-[80px] border-bottom-[var(--sd-green)]" />
             <div className="absolute bottom-0 right-[15%] w-[35%] h-[120px] bg-[#3A4A5C] border-t-4 border-x-4 border-[var(--sd-green)]/20" />
             <div className="absolute bottom-[120px] right-[10%] border-l-[90px] border-l-transparent border-r-[90px] border-r-transparent border-bottom-[60px] border-bottom-[var(--sd-green)]" />
          </div>

          <div className="space-y-1">
            <h1 className="font-display text-[64px] leading-[1.05] text-white tracking-[0.05em] uppercase">
              THE GEORGIA<br />
              HOMEOWNER'S<br />
              <span className="text-[var(--sd-green)]">SIDING GUIDE</span>
            </h1>
          </div>
          
          <p className="mt-8 text-white/60 text-lg max-w-lg leading-relaxed font-sans">
            Everything you need to know before replacing your siding — from a contractor who has done it 1,500+ times in Cobb, Cherokee and Fulton counties.
          </p>
        </div>

        <div className="absolute bottom-0 w-full h-[52px] bg-[var(--sd-green)] flex items-center px-16">
          <div className="text-sd-black text-[12px] font-bold tracking-[0.2em] uppercase">
            2026 EDITION · FREE GUIDE · SIDINGDEPOT.COM
          </div>
        </div>
      </PageWrapper>

      {/* PAGE 2 - WHY IT MATTERS */}
      <PageWrapper pageNum={2}>
        <div className="pt-32 px-16">
          <h2 className="font-display text-[36px] text-[#1E2A38] leading-tight uppercase">
            YOUR SIDING IS A <span className="text-[var(--sd-green)]">$25,000</span> DECISION.
          </h2>
          <p className="text-[var(--sd-green)] font-bold text-sm tracking-widest uppercase mt-1">
            Make it with the right information.
          </p>

          <div className="mt-16 grid grid-cols-[1fr_1.1fr] gap-12">
            <div className="bg-[#1E2A38] rounded-2xl p-8 flex flex-col justify-between">
              {[
                { val: "$15k–$30k", label: "Average James Hardie installation in North Atlanta (2026)" },
                { val: "80%", label: "ROI on fiber cement siding at resale — highest of any renovation" },
                { val: "50+ years", label: "Expected lifespan of properly installed James Hardie siding" },
              ].map((stat, i) => (
                <div key={i} className={i !== 0 ? "mt-8 pt-8 border-t border-white/10" : ""}>
                   <div className="text-[var(--sd-green)] font-display text-4xl">{stat.val}</div>
                   <div className="text-white/70 text-[11px] mt-1 font-semibold tracking-wide leading-relaxed uppercase">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="text-[#6B7A8A] text-[15px] leading-relaxed space-y-6 pt-2">
              <p>
                For most homeowners in North Atlanta, siding replacement is the single largest maintenance investment they will ever make. It is not just about curb appeal; it is a structural barrier against Georgia's extreme humidity, afternoon thunderstorms, and intense UV exposure.
              </p>
              <p>
                In Cobb, Cherokee, and Fulton counties, thousands of homes built between 2000 and 2010 are now entering their natural replacement cycle. The original builder-grade materials were never intended to last beyond 15–20 years.
              </p>
              <p>
                Choosing the wrong material or, more importantly, the wrong installation method can lead to hidden rot, voided warranties, and a total loss of ROI.
              </p>
              <p className="text-[var(--sd-green)] font-bold">
                This guide was written to help you make the right call — regardless of who you hire.
              </p>
            </div>
          </div>
        </div>
      </PageWrapper>

      {/* PAGE 3 - COMPARISON */}
      <PageWrapper pageNum={3}>
        <div className="pt-32 px-10">
          <h2 className="font-display text-[36px] text-[#1E2A38] leading-tight uppercase text-center">
            WHICH SIDING IS RIGHT FOR GEORGIA?
          </h2>

          <div className="mt-12 overflow-hidden rounded-xl border border-[#E2E8EE]">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#1E2A38] text-white">
                <tr className="text-[10px] font-bold uppercase tracking-widest">
                  <th className="p-4 border-r border-white/10">Criteria</th>
                  <th className="p-4 border-r border-[var(--sd-green)] relative bg-[#1E2A38]">
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[var(--sd-green)] text-white px-2 py-0.5 rounded text-[8px]">RECOMMENDED</span>
                    James Hardie
                  </th>
                  <th className="p-4 border-r border-white/10">Vinyl</th>
                  <th className="p-4 border-r border-white/10">Engineered Wood</th>
                  <th className="p-4">Natural Wood</th>
                </tr>
              </thead>
              <tbody className="text-[12px]">
                {[
                  ["Georgia Climate Rating", "★★★★★", "★★★☆☆", "★★★★☆", "★★☆☆☆"],
                  ["Lifespan", "50+ years", "20–30 years", "25–30 years", "10–20 years"],
                  ["Maintenance", "Very Low", "Low", "Moderate", "High"],
                  ["Fire Resistance", "Excellent", "Poor", "Good", "Poor"],
                  ["Warranty (product)", "30 years", "25 years", "5–10 years", "None"],
                  ["ROI at Resale", "80%", "60%", "65%", "50%"],
                ].map((row, i) => (
                  <tr key={i} className="border-t border-[#E2E8EE]">
                    <td className="p-4 font-bold bg-[#F4F7FA] text-[#1E2A38] w-[25%]">{row[0]}</td>
                    <td className="p-4 font-bold text-[#1E2A38] border-x-2 border-[var(--sd-green)] bg-[var(--sd-green)]/5 text-center">{row[1]}</td>
                    <td className="p-4 text-[#6B7A8A] text-center">{row[2]}</td>
                    <td className="p-4 text-[#6B7A8A] text-center">{row[3]}</td>
                    <td className="p-4 text-[#6B7A8A] text-center">{row[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-10 bg-[var(--sd-green)] p-5 rounded-xl text-[#0A0A0A] font-bold text-center">
             James Hardie HZ10 is the only siding system engineered specifically for Georgia's climate zone — heat, humidity, and storm season combined.
          </div>

          <p className="mt-8 text-center text-[#6B7A8A] text-[10px] uppercase tracking-wide">
            Source: James Hardie Corp, 2026 Remodeling Cost vs. Value Report, NAHB Georgia Chapter
          </p>
        </div>
      </PageWrapper>

      {/* PAGE 4 - 5 MISTAKES */}
      <PageWrapper pageNum={4}>
        <div className="pt-32 px-10">
          <h2 className="font-display text-[40px] text-[#1E2A38] leading-tight uppercase">
            5 MISTAKES GEORGIA HOMEOWNERS MAKE
          </h2>
          <div className="h-1 w-24 bg-[var(--sd-green)] mt-2 mb-12" />

          <div className="grid grid-cols-2 gap-x-12 gap-y-12">
            {[
              {
                id: "01",
                title: "Choosing the Lowest Bid",
                desc: "On a $25,000 project, the gap between bids in North Atlanta runs $8,000–$12,000. The lowest bid almost always means subcontracted day crews, builder-grade materials, or missing line items that become expensive change orders later."
              },
              {
                id: "02",
                title: "Hiring Without James Hardie Certification",
                desc: "Only 2% of contractors earn Elite Preferred status. Without it, the 30-year warranty is void. Wrong flashing detail on a Georgia storm leads to warranty denial and expensive repairs out of your pocket."
              },
              {
                id: "03",
                title: "Skipping the Rot Inspection",
                desc: "90% of local homes over 15 years old have hidden OSB rot. If your contract doesn't include fixed pricing for wood replacement, your budget can balloon mid-project while your walls are exposed."
              },
              {
                id: "04",
                title: "Installing Over Existing Siding",
                desc: "Skipping the tear-off traps moisture, hides damage, and voids warranties. Full tear-off, inspection, and new house wrap are non-negotiable for a long-term structural solution."
              },
              {
                id: "05",
                title: "Paying More Than 30% Upfront",
                desc: "Standard is 25-30% to lock schedule. Any contractor asking for 50-100% upfront is likely using your deposit to finish another job. This is the #1 cause of abandoned projects."
              }
            ].map((err, i) => (
              <div key={i} className="relative bg-[#F4F7FA] p-6 rounded-xl border-l-4 border-[var(--sd-green)]">
                <div className="absolute top-4 right-4 bg-red-100 text-red-600 text-[8px] font-bold px-1.5 py-0.5 rounded tracking-widest uppercase">MISTAKE</div>
                <div className="font-display text-[48px] text-[var(--sd-green)] leading-none mb-3">{err.id}</div>
                <div className="font-bold text-[#1E2A38] text-[14px] leading-tight mb-2 uppercase">{err.title}</div>
                <div className="text-[#6B7A8A] text-[11px] leading-relaxed">{err.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </PageWrapper>

      {/* PAGE 5 - PROCESS */}
      <PageWrapper pageNum={5}>
        <div className="pt-32 px-10">
          <h2 className="font-display text-[36px] text-[#1E2A38] leading-tight uppercase text-center">
            WHAT A PROPER INSTALLATION LOOKS LIKE
          </h2>

          <div className="mt-20 relative">
            <div className="absolute top-[40px] left-0 w-full h-0.5 border-t-2 border-dashed border-[var(--sd-green)] -z-10" />
            <div className="grid grid-cols-3 gap-y-20 gap-x-12">
               {[
                 { step: "Step 1", title: "Free Estimate", desc: "Itemized quote, no pressure. Review every line and ask about rot pricing." },
                 { step: "Step 2", title: "Contract & Schedule", desc: "Fixed price confirmed in writing. Start date locked and permit pulled." },
                 { step: "Step 3", title: "Full Tear-Off", desc: "Siding removed. Sheathing inspected. Rotten wood documented before replacement." },
                 { step: "Step 4", title: "House Wrap", desc: "Continuous water-resistive barrier installed. Critical for warranty compliance." },
                 { step: "Step 5", title: "Hardie Installation", desc: "HZ10-certified install: proper fastening, flashing, and joint details." },
                 { step: "Step 6", title: "Final Walk-Through", desc: "Detailed inspection with crew. Warranty documentation provided." }
               ].map((item, i) => (
                 <div key={i} className="text-center group">
                    <div className="w-20 h-20 bg-white border-2 border-[var(--sd-green)] rounded-full mx-auto flex items-center justify-center font-display text-2xl text-[#1E2A38] mb-4 group-hover:bg-[var(--sd-green)] group-hover:text-white transition-colors">
                      {i + 1}
                    </div>
                    <div className="font-bold text-[#1E2A38] text-[13px] uppercase tracking-wide mb-1">{item.title}</div>
                    <div className="text-[#6B7A8A] text-[10px] leading-relaxed px-2">{item.desc}</div>
                 </div>
               ))}
            </div>
          </div>

          <div className="mt-32 bg-[#0A0A0A] p-8 rounded-2xl text-white text-center">
            <p className="text-lg leading-relaxed">
              At <span className="text-[var(--sd-green)] font-bold">Siding Depot</span>, every project follows these 6 steps exactly — no shortcuts, no subcontracted crews, no surprise change orders.
            </p>
          </div>
        </div>
      </PageWrapper>

      {/* PAGE 6 - CHECKLIST */}
      <PageWrapper pageNum={6} className="bg-[#F4F7FA]">
        <div className="pt-32 px-10">
          <h2 className="font-display text-[36px] text-[#1E2A38] leading-tight uppercase">
            8 QUESTIONS EVERY HOMEOWNER MUST ASK
          </h2>
          <p className="text-[#6B7A8A] text-[14px] mt-1 font-medium italic">
            These take 90 seconds. The answers will tell you everything.
          </p>

          <div className="mt-12 space-y-4">
            {[
              { q: "Are you James Hardie Elite Preferred?", a: "Ask for ID number. Verify at jameshardie.com/contractor-locator." },
              { q: "Are you licensed in Georgia with liability + workers' comp?", a: "Ask for the COI. Call and verify it is current." },
              { q: "Do you use highly specialized certified professionals or subcontractors?", a: "Subcontracted crews have no loyalty to quality. In-house crews do." },
              { q: "What is your per-linear-foot price for wood replacement?", a: "If they hesitate or say 'we will figure it out,' walk away." },
              { q: "Will you do a full tear-off and new house wrap?", a: "Any answer other than 'yes' disqualifies them immediately." },
              { q: "What does your payment schedule look like?", a: "You want milestone-based. No more than 30% upfront." },
              { q: "What workmanship warranty do you provide in writing?", a: "Product warranty is not labor warranty. Get both in writing." },
              { q: "Can I see 3 recent projects within 10 miles?", a: "Driving to see real work is worth 30 minutes of your time." }
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 bg-white p-4 rounded-xl shadow-sm border border-[#E2E8EE]">
                 <div className="mt-1 w-5 h-5 rounded border-2 border-[var(--sd-green)] flex items-center justify-center shrink-0">
                    <CheckCircle2 className="h-4 w-4 text-[var(--sd-green)]" aria-hidden="true" />
                 </div>
                 <div>
                    <div className="text-[13px] font-bold text-[#1E2A38] uppercase tracking-wide">
                      <span className="text-[var(--sd-green)] mr-1">{i + 1}.</span> {item.q}
                    </div>
                    <div className="text-[11px] text-[#6B7A8A] leading-relaxed mt-0.5">{item.a}</div>
                 </div>
              </div>
            ))}
          </div>

          <div className="mt-10 border-2 border-dashed border-[var(--sd-green)] p-4 rounded-xl text-center">
            <p className="text-[12px] text-[#1E2A38]">
              <span className="font-bold">Bonus:</span> Email any quote to <span className="text-[var(--sd-green)] font-bold">office@sidingdepot.com</span> with subject <span className="italic">"Quote Review"</span> — we'll flag anything unusual. No obligation.
            </p>
          </div>
        </div>
      </PageWrapper>

      {/* PAGE 7 - CLIMATE */}
      <PageWrapper pageNum={7}>
        <div className="pt-32 px-10">
          <h2 className="font-display text-[36px] text-[#1E2A38] leading-tight uppercase mb-12">
            WHY GEORGIA'S CLIMATE DEMANDS THE RIGHT SIDING
          </h2>

          <div className="grid grid-cols-[1.1fr_1fr] gap-12">
            <div className="space-y-6">
              <div className="text-[#6B7A8A] text-[13px] leading-relaxed space-y-4">
                <p>
                  Georgia ranks in the top 5 states for rainfall and humidity. Our "HardieZone" is HZ10, which requires specialized formulation to prevent moisture absorption and heat expansion.
                </p>
                <ul className="space-y-4">
                  <li>
                    <strong className="text-[#1E2A38]">Hail Damage:</strong> Between March and June, Cobb and Fulton counties face intense storms. Fiber cement absorbs impact that shatters vinyl.
                  </li>
                  <li>
                    <strong className="text-[#1E2A38]">Termite Zone:</strong> Atlanta is in a "Very Heavy" termite infestation zone. Fiber cement is immune; wood is a feast.
                  </li>
                  <li>
                    <strong className="text-[#1E2A38]">Color Retention:</strong> 220+ sunny days can bleach dark paint in 2 years. ColorPlus technology is baked-on for 15+ years of retention.
                  </li>
                </ul>
              </div>
            </div>

            <div className="space-y-3">
               {[
                 { icon: "🌧️", val: "50+ inches", label: "Annual rainfall in North Georgia" },
                 { icon: "⚡", val: "1,553", label: "Lightning strikes per 100 sq miles" },
                 { icon: "🌡️", val: "95°F+", label: "Summer peaks that warp vinyl" },
                 { icon: "🐛", val: "#1", label: "Termite risk zone nationally" },
                 { icon: "☀️", val: "220+", label: "Annual sunny days" }
               ].map((item, i) => (
                 <div key={i} className="flex items-center gap-4 bg-[#F4F7FA] p-4 rounded-xl">
                    <div className="text-2xl">{item.icon}</div>
                    <div>
                       <div className="text-[#1E2A38] font-display text-xl leading-none">{item.val}</div>
                       <div className="text-[#6B7A8A] text-[9px] font-bold uppercase tracking-widest">{item.label}</div>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </PageWrapper>

      {/* PAGE 8 - FINAL CTA */}
      <PageWrapper pageNum={8} className="bg-[#1E2A38]">
        <div className="flex flex-col h-full justify-center items-center text-center px-16">
          <div className="bg-[var(--sd-green)] text-white px-4 py-1.5 rounded-full text-[11px] font-bold tracking-widest uppercase mb-12">
            ★ JAMES HARDIE ELITE PREFERRED · TOP 2% NATIONWIDE
          </div>

          <h2 className="font-display text-[52px] leading-[1] text-white tracking-[0.05em] uppercase mb-4">
            READY FOR AN<br />
            <span className="text-[var(--sd-green)]">HONEST ESTIMATE?</span>
          </h2>

          <p className="text-white/65 text-lg mb-12 max-w-sm">
            Free. Itemized. No pressure. We respond within 24 hours.
          </p>

          <div className="flex gap-6 mb-16">
             {["Licensed & Insured", "In-house crews", "Fixed price"].map((text, i) => (
               <div key={i} className="text-white text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                  <div className="text-[var(--sd-green)]">✓</div> {text}
               </div>
             ))}
          </div>

          <div className="bg-white rounded-3xl p-10 w-full max-w-md shadow-2xl">
             <h3 className="text-[#1E2A38] font-bold text-xl mb-6 uppercase tracking-tight">Get Your Free Estimate</h3>
             <div className="space-y-4">
                <div className="flex items-center justify-center gap-3 text-[#1E2A38] font-display text-3xl leading-none">
                   <Phone className="h-6 w-6 text-[var(--sd-green)]" aria-hidden="true" /> (678) 400-2012
                </div>
                <div className="flex items-center justify-center gap-2 text-[#6B7A8A] font-semibold text-sm">
                   <Mail className="h-4 w-4 text-[var(--sd-green)]" aria-hidden="true" /> office@sidingdepot.com
                </div>
                <div className="flex items-center justify-center gap-2 text-[#6B7A8A] font-semibold text-sm">
                   <ExternalLink className="h-4 w-4 text-[var(--sd-green)]" aria-hidden="true" /> sidingdepot.com/contact
                </div>
                <div className="mt-6 pt-6 border-t border-[#E2E8EE] flex items-center justify-center gap-2 text-[#6B7A8A]/60 text-[10px] uppercase font-bold tracking-wide">
                   <MapPin className="h-3 w-3" aria-hidden="true" /> 3036 Roswell Rd, Marietta, GA 30062
                </div>
             </div>
          </div>

          <p className="mt-12 text-white/70 text-[10px] uppercase tracking-[0.1em] italic max-w-lg leading-relaxed">
            Serving Marietta · Alpharetta · Milton · Marietta · Woodstock · Roswell · Kennesaw · Johns Creek · Sandy Springs · Acworth
          </p>
          
          <p className="mt-8 text-white/60 text-[9px] uppercase tracking-widest">
            © 2026 Siding Depot LLC · All rights reserved · sidingdepot.com
          </p>
        </div>
      </PageWrapper>

    </div>
  );
};
