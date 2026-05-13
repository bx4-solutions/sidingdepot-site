import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, ArrowRight, ExternalLink, ShieldCheck, Clock, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE } from "@/data/site";
import { trackFinanceApply, trackFinanceQualified } from "@/lib/track";
import { useEffect } from "react";

export const Route = createFileRoute("/finance")({
  head: () => {
    const canonical = "https://sidingdepot.com/finance";
    const schema = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebPage",
          "@id": `${canonical}/#webpage`,
          "url": canonical,
          "name": "Financing Options | Siding Depot — GreenSky® Home Improvement Loans",
          "description": "Flexible financing for your siding, roofing, or painting project. Deferred interest and fixed monthly budget plans via GreenSky®. Apply online in minutes.",
          "isPartOf": { "@id": "https://sidingdepot.com/#website" }
        },
        {
          "@type": ["Organization", "LocalBusiness"],
          "@id": "https://sidingdepot.com/#organization",
          "name": SITE.name,
          "legalName": SITE.legalName,
          "url": "https://sidingdepot.com",
          "logo": "https://sidingdepot.com/logo.png",
          "telephone": SITE.phone,
          "email": SITE.email,
          "address": {
            "@type": "PostalAddress",
            "streetAddress": SITE.address.street,
            "addressLocality": SITE.address.city,
            "addressRegion": SITE.address.state,
            "postalCode": SITE.address.zip,
            "addressCountry": "US"
          },
          "openingHoursSpecification": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            "opens": "08:00",
            "closes": "18:00"
          },
          "sameAs": [
            SITE.social.facebook,
            SITE.social.instagram,
            SITE.social.youtube,
            SITE.social.tiktok
          ]
        }
      ]
    };

    return {
      meta: [
        { title: "Financing Options | Siding Depot — GreenSky® Home Improvement Loans" },
        {
          name: "description",
          content: "Flexible financing for your siding, roofing, or painting project. Deferred interest and fixed monthly budget plans via GreenSky®. Apply online in minutes.",
        },
        { property: "og:title", content: "Financing Options | Siding Depot" },
        { property: "og:description", content: "Flexible financing for your siding, roofing, or painting project via GreenSky®." },
        { property: "og:image", content: "/projects/project-1.webp" },
        { property: "og:type", content: "website" },
      ],
      links: [
        { rel: "canonical", href: canonical }
      ],
      script: [
        {
          type: "application/ld+json",
          children: JSON.stringify(schema)
        }
      ]
    };
  },
  component: FinancePage,
});

function FinancePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[40vh] min-h-[400px] w-full overflow-hidden bg-sd-navy">
        <div className="absolute inset-0 z-0">
          <img
            src="/projects/project-1.webp"
            alt="North Atlanta home"
            className="h-full w-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-sd-navy/60 to-sd-navy" />
        </div>
        
        <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col items-center justify-center px-4 text-center lg:px-8">
          <nav className="mb-6 flex items-center gap-2 text-sm font-medium text-white/60">
            <Link to="/" className="hover:text-sd-green transition-colors">Home</Link>
            <span>•</span>
            <span className="text-white">Finance</span>
          </nav>
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white uppercase">
            Finance
          </h1>
        </div>
      </section>

      {/* Main Content */}
      <section className="relative -mt-20 z-20 pb-20 lg:pb-32">
        <div className="mx-auto max-w-4xl px-4 lg:px-8">
          <div className="overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-black/5">
            <div className="p-8 sm:p-12 lg:p-16 text-center">
              <span className="inline-block rounded-pill bg-sd-green-pale px-3 py-1 text-xs font-bold uppercase tracking-wider text-sd-navy">
                Payment Plans
              </span>
              <h2 className="mt-6 font-display text-4xl sm:text-5xl font-extrabold text-sd-navy uppercase tracking-tight">
                FINANCE
              </h2>
              
              <div className="mt-12 flex justify-center">
                <div className="max-w-[400px] w-full">
                   <p className="text-sm font-bold text-sd-gray-text uppercase tracking-widest mb-4">
                    Financing options from
                  </p>
                  <img 
                    src="https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://assets.cdn.filesafe.space/VPwAmJKkB62wR0BJhYil/media/691b50c1bb3d036e04caa4af.png" 
                    alt="GreenSky Logo" 
                    className="h-auto w-full max-w-[280px] mx-auto"
                  />
                </div>
              </div>

              <div className="mt-12 space-y-4 max-w-2xl mx-auto italic text-lg sm:text-xl text-sd-navy font-medium leading-relaxed">
                <p>
                  Whether your customer wants to pay using a deferred interest plan
                  or has a fixed monthly budget, the GreenSky® programs offer
                  flexible consumer financing options to meet various needs.
                </p>
              </div>

              <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button asChild size="lg" className="w-full sm:w-auto text-lg h-16 px-10" onClick={() => trackFinanceApply()}>
                  <a href={SITE.greenSkyUrl} target="_blank" rel="noopener noreferrer">
                    APPLY NOW <ExternalLink className="ml-2 h-5 w-5" />
                  </a>
                </Button>
                <Button asChild variant="outline" size="lg" className="w-full sm:w-auto h-16 px-10 border-2">
                  <a href="http://www.greenskycredit.com/" target="_blank" rel="noopener noreferrer">
                    Learn More
                  </a>
                </Button>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="mt-20 grid gap-8 sm:grid-cols-3">
            <div className="rounded-2xl bg-sd-gray-bg p-8 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-sd-green/10 text-sd-green">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-sd-navy">Quick Decision</h3>
              <p className="mt-2 text-sm text-sd-gray-text">Apply online and get a credit decision in seconds.</p>
            </div>
            <div className="rounded-2xl bg-sd-gray-bg p-8 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-sd-green/10 text-sd-green">
                <CreditCard className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-sd-navy">Flexible Plans</h3>
              <p className="mt-2 text-sm text-sd-gray-text">Deferred interest or low monthly payment options.</p>
            </div>
            <div className="rounded-2xl bg-sd-gray-bg p-8 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-sd-green/10 text-sd-green">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-sd-navy">Secure Process</h3>
              <p className="mt-2 text-sm text-sd-gray-text">Safe and confidential application through GreenSky®.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="bg-sd-navy py-20 lg:py-32 text-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="font-display text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight">
                Trusted by Hundreds of <br />
                <span className="text-sd-green">Homeowners in Georgia</span>
              </h2>
              <p className="mt-6 text-lg text-white/70 leading-relaxed">
                Over 1,500 homes transformed in Georgia. As a Top 2% Elite Preferred James Hardie® contractor, 
                we bring certified excellence and 5-star Google reviews to every project.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Button asChild size="lg" className="h-14 px-8">
                  <Link to="/contact">Contact us <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-10 w-10 rounded-full border-2 border-sd-navy bg-sd-gray-bg overflow-hidden">
                        <img src={`/projects/project-${i}.webp`} alt="Happy Customer" className="h-full w-full object-cover" />
                      </div>
                    ))}
                  </div>
                  <div className="text-sm">
                    <div className="flex text-sd-green">
                      {"★".repeat(5)}
                    </div>
                    <p className="font-bold">1,500+ Homes Served</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-video overflow-hidden rounded-2xl shadow-2xl">
                <img 
                  src="/projects/project-2.webp" 
                  alt="Renovated Home" 
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 rounded-2xl bg-sd-green p-6 shadow-xl">
                <p className="text-3xl font-bold text-sd-navy uppercase">5-Star</p>
                <p className="text-sm font-bold text-sd-navy/80 uppercase tracking-wider">Google Reviews</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
