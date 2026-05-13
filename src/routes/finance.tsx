import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, ArrowRight, ExternalLink, ShieldCheck, Clock, CreditCard, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE } from "@/data/site";
import { trackFinanceApply, trackFinanceQualified } from "@/lib/track";
import { useEffect, useState } from "react";

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
          "name": "Financing for Siding & Roofing Projects in North Atlanta",
          "description": "Flexible financing for siding, roofing, and painting in Marietta and North Atlanta. 12-month deferred interest or 9.99% fixed monthly budget plans via GreenSky®.",
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
        { title: "Financing for Siding & Roofing Projects | Siding Depot North Atlanta" },
        {
          name: "description",
          content: "Flexible financing for siding, roofing, and painting in Marietta and North Atlanta. 12-month deferred interest or 9.99% fixed monthly budget plans via GreenSky®.",
        },
        { property: "og:title", content: "Financing for Siding & Roofing | Siding Depot" },
        { property: "og:description", content: "Apply for siding or roofing financing in minutes with GreenSky®. Deferred interest and low monthly payment options available." },
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
  useEffect(() => {
    // Detect if returning from GreenSky or moving to next step
    const sp = new URLSearchParams(window.location.search);
    if (sp.get("status") === "success" || sp.get("qualified") === "true") {
      trackFinanceQualified();
    }
  }, []);

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section — illustrated banner */}
      <section className="relative w-full overflow-hidden bg-sd-black">
        <div className="absolute inset-0 z-0">
          <img
            src="/finance-hero-bg.jpg"
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-sd-black/40 via-sd-black/20 to-sd-black/70" />
        </div>

        <div className="relative z-10 mx-auto flex min-h-[420px] max-w-7xl flex-col justify-end px-6 pb-16 pt-32 lg:px-12 lg:pb-20 lg:pt-40">


          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white">
            Finance
          </h1>
        </div>
      </section>

      {/* Main Content — green semicircle backdrop */}
      <section className="relative overflow-hidden bg-white pb-20 lg:pb-28">
        {/* Green semicircle */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 rounded-b-full bg-sd-green/40"
          style={{ width: "min(1100px, 95vw)", height: "min(1100px, 95vw)" }}
        />

        <div className="relative z-10 mx-auto max-w-5xl px-4 pt-16 lg:px-8 lg:pt-20">
          <div className="mx-auto w-full rounded-2xl bg-white p-6 shadow-xl ring-1 ring-black/5 sm:p-12 lg:p-16">
            {/* Big GreenSky logo */}
            <header className="flex flex-col items-center">
              <h2 className="text-xs sm:text-sm font-bold uppercase tracking-[0.3em] text-sd-gray-text">
                Financing options from
              </h2>
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/GreenSky_logo.svg/2560px-GreenSky_logo.svg.png"
                alt="GreenSky logo"
                className="mt-6 h-auto w-full max-w-[480px]"
              />
            </header>

            {/* House photo */}
            <div className="mt-10 overflow-hidden rounded-xl">
              <img
                src="/projects/project-1.webp"
                alt="Modern renovated home featuring fresh siding and roofing"
                className="h-64 w-full object-cover sm:h-80 md:h-96"
              />
            </div>

            {/* Two plan highlights side-by-side */}
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:gap-8">
              <article className="flex h-full flex-col rounded-xl border-l-4 border-sd-navy bg-sd-gray-bg p-6 sm:p-8">
                <h3 className="font-display text-2xl sm:text-3xl font-extrabold leading-[1.1] text-sd-navy uppercase">
                  No Interest if Paid in Full in <span className="text-sd-green-text">12 Months</span>
                </h3>
                <p className="mt-4 text-base leading-relaxed text-sd-dark-mid sm:text-lg">
                  Subject to credit approval. Interest is billed during the
                  promotional period but waived if the purchase amount is paid
                  in full within 12 months.
                </p>
              </article>

              <article className="flex h-full flex-col rounded-xl border-l-4 border-sd-green bg-sd-gray-bg p-6 sm:p-8">
                <h3 className="font-display text-2xl sm:text-3xl font-extrabold leading-[1.1] text-sd-green-text uppercase">
                  Reduced APR of 9.99% for 138 Months
                </h3>
                <p className="mt-4 text-base leading-relaxed text-sd-dark-mid sm:text-lg">
                  Low fixed monthly payments stretched over 138 months to fit your budget.
                  <span className="mt-2 block text-xs font-semibold italic text-sd-gray-text">*With approved credit</span>
                </p>
              </article>
            </div>

            {/* Closing copy + CTAs */}
            <div className="mt-12 text-center">
              <p className="mx-auto max-w-3xl text-lg font-medium italic leading-relaxed text-sd-navy sm:text-xl">
                "Whether you want to pay using a deferred interest plan or have a
                fixed monthly budget, the GreenSky® programs offer flexible
                consumer financing options to meet your needs."
              </p>

              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button
                  asChild
                  size="lg"
                  className="h-14 w-full px-10 text-base font-bold sm:w-auto"
                  onClick={() => trackFinanceApply()}
                >
                  <a href={SITE.greenSkyUrl} target="_blank" rel="noopener noreferrer">
                    APPLY NOW <ExternalLink className="ml-2 h-5 w-5" />
                  </a>
                </Button>
                <Button 
                  asChild 
                  variant="outline" 
                  size="lg" 
                  className="h-14 w-full border-2 px-10 text-base font-bold sm:w-auto"
                >
                  <a href="http://www.greenskycredit.com/" target="_blank" rel="noopener noreferrer">
                    Learn More
                  </a>
                </Button>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <section className="mt-20">
            <h2 className="sr-only">Financing Benefits</h2>
            <div className="grid gap-6 sm:grid-cols-3 sm:gap-8">
              <div className="rounded-2xl bg-sd-gray-bg p-8 text-center ring-1 ring-black/5">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-sd-green/10 text-sd-green-text">
                  <Clock className="h-7 w-7" />
                </div>
                <h3 className="text-lg font-bold text-sd-navy">Quick Decision</h3>
                <p className="mt-3 text-sm leading-relaxed text-sd-gray-text">Apply online and get a credit decision in seconds.</p>
              </div>
              <div className="rounded-2xl bg-sd-gray-bg p-8 text-center ring-1 ring-black/5">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-sd-green/10 text-sd-green-text">
                  <CreditCard className="h-7 w-7" />
                </div>
                <h3 className="text-lg font-bold text-sd-navy">Flexible Plans</h3>
                <p className="mt-3 text-sm leading-relaxed text-sd-gray-text">Deferred interest or low monthly payment options.</p>
              </div>
              <div className="rounded-2xl bg-sd-gray-bg p-8 text-center ring-1 ring-black/5">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-sd-green/10 text-sd-green-text">
                  <ShieldCheck className="h-7 w-7" />
                </div>
                <h3 className="text-lg font-bold text-sd-navy">Secure Process</h3>
                <p className="mt-3 text-sm leading-relaxed text-sd-gray-text">Safe and confidential application through GreenSky®.</p>
              </div>
            </div>
          </section>
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
