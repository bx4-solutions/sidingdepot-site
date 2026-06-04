import { createFileRoute, Link } from "@tanstack/react-router";
import { Phone, ArrowRight, Star, Award, Hammer, CloudRain, CircleDollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroSection } from "@/components/site/HeroSection";
import { PainPointsSection } from "@/components/site/PainPointsSection";
import { ProcessTimeline } from "@/components/site/ProcessTimeline";
import { AwardsStrip } from "@/components/site/AwardsStrip";
import { CitiesGrid } from "@/components/site/CitiesGrid";
import { MapSection } from "@/components/site/MapSection";
import { GoogleReviews } from "@/components/site/GoogleReviews";
import { FinancingBlock } from "@/components/site/FinancingBlock";
import { SITE } from "@/data/site";
import { SERVICE_METADATA } from "@/data/seo-config";

const HERO_IMAGE = "https://images.unsplash.com/photo-1632823471565-1ecdf5c6da03";
const CANONICAL = "https://sidingdepot.com/roofing";
const SERVICE_KEY = "roofing";
const CITY = "Greater Marietta";

const seo = SERVICE_METADATA[SERVICE_KEY];

export const Route = createFileRoute("/roofing")({
  head: () => ({
    meta: [
      { title: "Roofing Installation & Replacement | Marietta & North Atlanta" },
      { name: "description", content: "Georgia's storm season causes more roof damage than most realize. Siding Depot installs GAF & Owens Corning roofing systems. Free estimates in 24h." },
      { property: "og:title", content: "Roofing Installation & Replacement | Marietta & North Atlanta" },
      { property: "og:description", content: "Georgia's storm season causes more roof damage than most realize. Siding Depot installs GAF & Owens Corning roofing systems. Free estimates in 24h." },
      { property: "og:image", content: HERO_IMAGE },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "canonical", href: CANONICAL },
      { rel: "preload", as: "image", href: HERO_IMAGE, fetchPriority: "high" as any },
    ],
  }),
  component: RoofingPage,
});

function RoofingPage() {
  return (
    <div className="flex flex-col">
      {/* HERO SECTION */}
      <HeroSection
        badge="ROOFING — NORTH ATLANTA"
        title={
          <span className="text-white font-bold text-[48px] leading-tight">
            Roofing Installation & Replacement in <br className="hidden sm:block" />
            Marietta, Canton & North Atlanta, GA
          </span>
        }
        bgImage={HERO_IMAGE}
        ctaSlot={
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Button 
              asChild 
              size="lg" 
              className="bg-[#8DC63F] text-[#1A1A1A] hover:bg-[#8DC63F]/90 font-bold px-8 py-6 text-lg rounded-none"
            >
              <Link to="/contact">
                Get My Free Roof Estimate <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button 
              asChild 
              size="lg" 
              variant="outline" 
              className="border-[#8DC63F] text-[#8DC63F] hover:bg-[#8DC63F]/10 font-bold px-8 py-6 text-lg rounded-none bg-transparent"
            >
              <a href={SITE.phoneHref}>
                Call (678) 400-2012
              </a>
            </Button>
          </div>
        }
        trustItems={[]} // We'll use the Trust Bar below instead
      >
        <div className="mt-6 space-y-6 max-w-2xl text-white/90">
          <p className="text-lg leading-relaxed">
            Georgia's storm season runs March through October. 
            Hail, 70+ mph wind gusts and heavy rain cause more 
            roof damage in North Atlanta than most homeowners 
            realize — until the ceiling starts leaking.
          </p>
          <p className="text-lg leading-relaxed">
            Siding Depot installs GAF and Owens Corning roofing 
            systems using manufacturer-certified methods. 
            Every project is managed by a dedicated on-site 
            supervisor. Every crew member is a W-2 Siding Depot 
            employee — not a storm chaser from out of state.
          </p>
          <p className="text-lg font-semibold text-sd-green bg-sd-navy/40 p-4 border-l-4 border-sd-green italic">
            "When you replace your roof and siding together 
            in one project, you save $2,000–$5,000 on 
            mobilization and finish with a completely 
            transformed home exterior."
          </p>
        </div>
      </HeroSection>

      {/* TRUST BAR (ProofBar style) */}
      <section className="bg-sd-black border-t-[3px] border-sd-green py-6">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <ul className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4 text-white/90 text-sm font-bold uppercase tracking-wider">
            <li className="flex items-center gap-2">
              <Star className="h-5 w-5 text-sd-green fill-sd-green" />
              <span>4.5 · 158 Google Reviews</span>
            </li>
            <li className="flex items-center gap-2">
              <Award className="h-5 w-5 text-sd-green" />
              <span>GAF Certified · Owens Corning</span>
            </li>
            <li className="flex items-center gap-2">
              <Hammer className="h-5 w-5 text-sd-green" />
              <span>4.7 · 256 GuildQuality Reviews</span>
            </li>
            <li className="flex items-center gap-2">
              <CloudRain className="h-5 w-5 text-sd-green" />
              <span>48h Storm Damage Response</span>
            </li>
            <li className="flex items-center gap-2">
              <CircleDollarSign className="h-5 w-5 text-sd-green" />
              <span>GreenSky 0% APR Financing</span>
            </li>
          </ul>
        </div>
      </section>

      {/* PHOTO GALLERY SECTION */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-sd-black">Recent Roofing Projects — North Atlanta</h2>
          <p className="mt-2 text-sd-gray-text text-xl">Marietta · Canton · Kennesaw · Alpharetta</p>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Project 1 */}
            <div className="group relative overflow-hidden rounded-lg shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1604177091072-8f6c4e577427" 
                alt="Full Roof Replacement Marietta GA" 
                className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute top-4 left-4">
                <span className="bg-sd-green text-sd-black px-3 py-1 text-xs font-bold uppercase tracking-wider">
                  GAF Timberline HDZ
                </span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-white font-bold">Full Roof Replacement — Marietta, GA</p>
              </div>
              <div className="bg-sd-gray-bg p-4 text-left border-t border-sd-gray-border">
                <p className="text-sd-black font-semibold">Full Roof Replacement — Marietta, GA</p>
              </div>
            </div>

            {/* Project 2 */}
            <div className="group relative overflow-hidden rounded-lg shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64" 
                alt="Storm Damage Replacement Canton GA" 
                className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute top-4 left-4">
                <span className="bg-sd-green text-sd-black px-3 py-1 text-xs font-bold uppercase tracking-wider">
                  Owens Corning Duration
                </span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-white font-bold">Storm Damage Replacement — Canton, GA</p>
              </div>
              <div className="bg-sd-gray-bg p-4 text-left border-t border-sd-gray-border">
                <p className="text-sd-black font-semibold">Storm Damage Replacement — Canton, GA</p>
              </div>
            </div>

            {/* Project 3 */}
            <div className="group relative overflow-hidden rounded-lg shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1568605114967-8130f3a36994" 
                alt="Roof + Siding Package Kennesaw GA" 
                className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute top-4 left-4">
                <span className="bg-sd-green text-sd-black px-3 py-1 text-xs font-bold uppercase tracking-wider">
                  GAF + James Hardie
                </span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-white font-bold">Roof + Siding Package — Kennesaw, GA</p>
              </div>
              <div className="bg-sd-gray-bg p-4 text-left border-t border-sd-gray-border">
                <p className="text-sd-black font-semibold">Roof + Siding Package — Kennesaw, GA</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ADDITIONAL SECTIONS FROM HOMEPAGE */}
      <PainPointsSection />
      
      <ProcessTimeline title="Our Roofing Process — From Inspection to Protection" />
      
      <AwardsStrip />
      
      <CitiesGrid />
      
      <MapSection />
      
      <GoogleReviews />
      
      <FinancingBlock />

      {/* QUOTE FORM TEASER */}
      <section className="bg-sd-black py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-sd-green/10 to-transparent" />
        <div className="mx-auto max-w-7xl px-4 lg:px-8 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight max-w-3xl mx-auto">
            Ready to Protect Your Home with a <span className="text-sd-green">Certified Roofing System?</span>
          </h2>
          <p className="mt-6 text-xl text-white/80 max-w-2xl mx-auto">
            Get your free, no-pressure roofing estimate within 24 hours. We handle all documentation for storm damage claims.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="bg-sd-green text-sd-black hover:bg-sd-green-hover font-bold px-10 py-7 text-xl rounded-none">
              <Link to="/contact">Get My Free Quote</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10 font-bold px-10 py-7 text-xl rounded-none">
              <a href={SITE.phoneHref}>Call {SITE.phone}</a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
