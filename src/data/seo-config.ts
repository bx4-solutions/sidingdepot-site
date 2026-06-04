import type { ABVariation } from "./ab-testing";

export type SeoVariant = {
  h1: (city: string) => string;
  h2: string;
  metaTitle: (city: string) => string;
  metaDesc: string;
};

export type ServiceSeo = Record<ABVariation, SeoVariant>;

export const SERVICE_METADATA_AB: Record<string, ServiceSeo> = {
  siding: {
    A: {
      h1: (c) => `Elite James Hardie Siding Installation in ${c}, GA`,
      h2: "Top 2% James Hardie Elite Preferred Contractor",
      metaTitle: (c) => `James Hardie Siding in ${c}, GA | Siding Depot — Elite Preferred`,
      metaDesc: "Top 2% Elite Preferred James Hardie installer for Marietta e Região. 50-year fiber cement durability. Free 24h quote — call Siding Depot.",
    },
    B: {
      h1: (c) => `Moisture-Proof Fiber Cement Siding in ${c}, GA`,
      h2: "Engineered for Georgia's HZ10 Climate Zone",
      metaTitle: (c) => `Fiber Cement Siding ${c}, GA | Built for Georgia Humidity`,
      metaDesc: "James Hardie fiber cement siding engineered for Georgia humidity, storms & UV. HZ10-rated install in Marietta e Região. Get a free written estimate.",
    },
    C: {
      h1: (c) => `Fixed-Price Siding Installation in ${c}, GA`,
      h2: "Transparent Quotes, Highly Specialized Certified Teams, On-Time Finish",
      metaTitle: (c) => `Siding Installer ${c}, GA | Free 24h Quote — Siding Depot`,
      metaDesc: "Same-day on-site visit, written quote in 24h, dedicated project manager. James Hardie siding installed in Marietta e Região with 0% APR financing.",
    },
  },
  painting: {
    A: {
      h1: (c) => `Exterior Painting in Marietta, Canton & North Atlanta, GA`,
      h2: "Why North Atlanta Homeowners Choose Siding Depot for Exterior Painting",
      metaTitle: (c) => `Exterior Painting Marietta GA | Siding Depot — Sherwin-Williams Premium`,
      metaDesc: "Professional exterior painting in Marietta, Canton and North Atlanta, GA. Sherwin-Williams Duration, W-2 crews, written estimates. Free quote: (678) 400-2012.",
    },
    B: {
      h1: (c) => `Exterior Painting in Marietta, Canton & North Atlanta, GA`,
      h2: "Why North Atlanta Homeowners Choose Siding Depot for Exterior Painting",
      metaTitle: (c) => `Exterior Painting Marietta GA | Siding Depot — Sherwin-Williams Premium`,
      metaDesc: "Professional exterior painting in Marietta, Canton and North Atlanta, GA. Sherwin-Williams Duration, W-2 crews, written estimates. Free quote: (678) 400-2012.",
    },
    C: {
      h1: (c) => `Exterior Painting in Marietta, Canton & North Atlanta, GA`,
      h2: "Why North Atlanta Homeowners Choose Siding Depot for Exterior Painting",
      metaTitle: (c) => `Exterior Painting Marietta GA | Siding Depot — Sherwin-Williams Premium`,
      metaDesc: "Professional exterior painting in Marietta, Canton and North Atlanta, GA. Sherwin-Williams Duration, W-2 crews, written estimates. Free quote: (678) 400-2012.",
    },
  },
  windows: {
    A: {
      h1: (c) => `Energy-Efficient Window Replacement in ${c}, GA`,
      h2: "Energy Star® Certified Low-E Double-Pane Windows",
      metaTitle: (c) => `Energy Star Windows in ${c}, GA | Siding Depot`,
      metaDesc: "Energy Star certified Simonton & PGT windows installed in Marietta e Região. Low-E double-pane built for Georgia summers. Free 24h quote.",
    },
    B: {
      h1: (c) => `Lower Cooling Bills with New Windows in ${c}, GA`,
      h2: "Low-E Windows Sized for Atlanta Climate Zone (3A/4A)",
      metaTitle: (c) => `Window Replacement ${c}, GA | Cut Cooling Costs`,
      metaDesc: "According to Energy Star, certified Low-E windows can meaningfully cut summer cooling costs in Marietta e Região. Free home assessment from Siding Depot.",
    },
    C: {
      h1: (c) => `Window Installation Experts in ${c}, GA`,
      h2: "Permits Handled · Manufacturer-Trained Crews",
      metaTitle: (c) => `Window Installers ${c}, GA | Marietta e Região`,
      metaDesc: "We handle Marietta e Região permits and install Simonton/PGT windows by manufacturer-trained crews. Free written quote in 24h.",
    },
  },
  doors: {
    A: {
      h1: (c) => `Entry & Patio Door Installation in ${c}, GA`,
      h2: "Therma-Tru® & ProVia® Authorized Installer",
      metaTitle: (c) => `Entry & Patio Doors in ${c}, GA | Therma-Tru · ProVia`,
      metaDesc: "Custom Therma-Tru & ProVia entry and patio doors installed in Marietta e Região. Energy Star options. Multi-point security. Free 24h quote.",
    },
    B: {
      h1: (c) => `Secure Fiberglass Entry Doors in ${c}, GA`,
      h2: "Multi-Point Locking, Built for Georgia Humidity",
      metaTitle: (c) => `Fiberglass Entry Doors ${c}, GA | No Warp · No Rot`,
      metaDesc: "Fiberglass entry doors that won't warp or rot in Georgia humidity. Multi-point locking, Energy Star Low-E glass. Free estimate.",
    },
    C: {
      h1: (c) => `Custom Door Replacement in ${c}, GA`,
      h2: "Same-Day Quotes · Precision Sill Alignment",
      metaTitle: (c) => `Door Replacement ${c}, GA | Free Quote — Siding Depot`,
      metaDesc: "Custom entry & patio door replacement in Marietta e Região. Authorized dealer. Precision install. Get a free written quote in 24 hours.",
    },
  },
  gutters: {
    A: {
      h1: (c) => `Seamless Gutter Installation in ${c}, GA`,
      h2: "6-Inch Aluminum Gutters & Protection Systems",
      metaTitle: (c) => `Seamless Gutters in ${c}, GA | 6-Inch Systems`,
      metaDesc: "6-inch seamless aluminum gutters & LeafGuard for North Atlanta rainfall. Foundation protection by Siding Depot. Free estimate in 24h.",
    },
    B: {
      h1: (c) => `Protect Your Foundation — Gutters in ${c}, GA`,
      h2: "Built for Georgia's 50+ Inches of Annual Rain",
      metaTitle: (c) => `Foundation-Safe Gutters ${c}, GA | Siding Depot`,
      metaDesc: "Up to 40% more water capacity vs 5-inch. Engineered for Georgia rainfall to protect your foundation and fascia. Free quote.",
    },
    C: {
      h1: (c) => `Gutter Installers in ${c}, GA`,
      h2: "Hidden Hangers · Same-Day Install",
      metaTitle: (c) => `Gutter Installers ${c}, GA | Same-Day — Siding Depot`,
      metaDesc: "Most homes installed in 4–8 hours. Hidden-hanger seamless aluminum gutters. Licensed & insured in Marietta e Região. Free quote.",
    },
  },
  deck: {
    A: {
      h1: (c) => `Custom Deck Construction in ${c}, GA`,
      h2: "Composite, Hardwood & Pressure-Treated Decks",
      metaTitle: (c) => `Custom Decks in ${c}, GA | Trex Pro — Siding Depot`,
      metaDesc: "Trex Pro & TimberTech composite decks built in Marietta e Região. Permit-ready engineered plans. Free estimate in 24h.",
    },
    B: {
      h1: (c) => `Low-Maintenance Composite Decks in ${c}, GA`,
      h2: "25–30 Year Warranty · No Warping in Georgia Humidity",
      metaTitle: (c) => `Composite Decks ${c}, GA | 25-Year Warranty`,
      metaDesc: "Trex & TimberTech composite decks engineered for Georgia humidity. Up to 30-year material warranty. Free quote from Siding Depot.",
    },
    C: {
      h1: (c) => `Deck Builders in ${c}, GA`,
      h2: "Permits Handled · Stamped Engineered Plans",
      metaTitle: (c) => `Deck Builders ${c}, GA | Permit-Ready Plans`,
      metaDesc: "We handle Marietta e Região permits and deliver stamped engineered plans on every deck. Free quote in 24h.",
    },
  },
  roofing: {
    A: {
      h1: (c) => `GAF Certified Roofing in ${c}, GA`,
      h2: "GAF Factory Certified Replacement",
      metaTitle: (c) => `Roofing in ${c}, GA | GAF Factory Certified`,
      metaDesc: "GAF Factory Certified roof replacement in Marietta e Região. Golden Pledge® warranties available. Free 24h quote from Siding Depot.",
    },
    B: {
      h1: (c) => `Storm-Ready Roof Replacement in ${c}, GA`,
      h2: "Hail & Wind Damage Specialists · Insurance Documentation",
      metaTitle: (c) => `Storm Damage Roofing ${c}, GA | Insurance Help`,
      metaDesc: "Hail & wind storm damage specialists. Free inspection and full insurance claim documentation in Marietta e Região. Call today.",
    },
    C: {
      h1: (c) => `Roof Replacement in ${c}, GA`,
      h2: "1–2 Day Install · Licensed & Insured",
      metaTitle: (c) => `Roof Replacement ${c}, GA | 1–2 Day Install`,
      metaDesc: "Most residential roof replacements completed in 1–2 days. GAF Timberline HDZ shingles. Free 24h quote from Siding Depot.",
    },
  },
};

/** Backward-compat — defaults to variation A. */
export const SERVICE_METADATA: Record<string, SeoVariant> = Object.fromEntries(
  Object.entries(SERVICE_METADATA_AB).map(([k, v]) => [k, v.A]),
);

export function getSeoForVariation(serviceKey: string, variation: ABVariation): SeoVariant {
  return SERVICE_METADATA_AB[serviceKey]?.[variation] ?? SERVICE_METADATA_AB.siding.A;
}
