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
      h1: (c) => `James Hardie Siding Installation in Marietta & North Atlanta, GA`,
      h2: "Why Marietta and Canton Homeowners Choose Siding Depot",
      metaTitle: (c) => `James Hardie Siding Marietta GA | Elite Contractor`,
      metaDesc:
        "James Hardie Elite Contractor siding in Marietta & North Atlanta, GA. In-house certified crews, 30-yr warranty, written estimates. Free quote: (678) 400-2012.",
    },
    B: {
      h1: (c) => `James Hardie Siding Installation in Marietta & North Atlanta, GA`,
      h2: "Why Marietta and Canton Homeowners Choose Siding Depot",
      metaTitle: (c) => `James Hardie Siding Marietta GA | Elite Contractor`,
      metaDesc:
        "James Hardie Elite Contractor siding in Marietta & North Atlanta, GA. In-house certified crews, 30-yr warranty, written estimates. Free quote: (678) 400-2012.",
    },
    C: {
      h1: (c) => `James Hardie Siding Installation in Marietta & North Atlanta, GA`,
      h2: "Why Marietta and Canton Homeowners Choose Siding Depot",
      metaTitle: (c) => `James Hardie Siding Marietta GA | Elite Contractor`,
      metaDesc:
        "James Hardie Elite Contractor siding in Marietta & North Atlanta, GA. In-house certified crews, 30-yr warranty, written estimates. Free quote: (678) 400-2012.",
    },
  },
  painting: {
    A: {
      h1: (c) => `Exterior Painting in Marietta & North Atlanta, GA`,
      h2: "Why North Atlanta Homeowners Choose Siding Depot for Exterior Painting",
      metaTitle: (c) => `Exterior Painting Marietta GA | Sherwin-Williams`,
      metaDesc:
        "Exterior painting in Marietta & North Atlanta, GA. Sherwin-Williams Duration, in-house certified crews, written estimates. Free quote: (678) 400-2012.",
    },
    B: {
      h1: (c) => `Exterior Painting in Marietta & North Atlanta, GA`,
      h2: "Why North Atlanta Homeowners Choose Siding Depot for Exterior Painting",
      metaTitle: (c) => `Exterior Painting Marietta GA | Sherwin-Williams`,
      metaDesc:
        "Exterior painting in Marietta & North Atlanta, GA. Sherwin-Williams Duration, in-house certified crews, written estimates. Free quote: (678) 400-2012.",
    },
    C: {
      h1: (c) => `Exterior Painting in Marietta & North Atlanta, GA`,
      h2: "Why North Atlanta Homeowners Choose Siding Depot for Exterior Painting",
      metaTitle: (c) => `Exterior Painting Marietta GA | Sherwin-Williams`,
      metaDesc:
        "Exterior painting in Marietta & North Atlanta, GA. Sherwin-Williams Duration, in-house certified crews, written estimates. Free quote: (678) 400-2012.",
    },
  },
  windows: {
    A: {
      h1: (c) => `Energy-Efficient Window Replacement in ${c}, GA`,
      h2: "Energy Star® Certified Low-E Double-Pane Windows",
      metaTitle: (c) => `Energy Star Windows in ${c}, GA | Siding Depot`,
      metaDesc:
        "Energy Star certified Simonton & PGT windows installed in Marietta. Low-E double-pane built for Georgia summers. Free 24h quote.",
    },
    B: {
      h1: (c) => `Lower Cooling Bills with New Windows in ${c}, GA`,
      h2: "Low-E Windows Sized for Atlanta Climate Zone (3A/4A)",
      metaTitle: (c) => `Window Replacement ${c}, GA | Cut Cooling Costs`,
      metaDesc:
        "According to Energy Star, certified Low-E windows can meaningfully cut summer cooling costs in Marietta. Free home assessment from Siding Depot.",
    },
    C: {
      h1: (c) => `Window Installation Experts in ${c}, GA`,
      h2: "Permits Handled · Manufacturer-Trained Crews",
      metaTitle: (c) => `Window Installers ${c}, GA | Marietta`,
      metaDesc:
        "We handle Marietta permits and install Simonton/PGT windows by manufacturer-trained crews. Free written quote in 24h.",
    },
  },
  doors: {
    A: {
      h1: (c) => `Entry & Patio Door Installation in ${c}, GA`,
      h2: "Therma-Tru® & ProVia® Authorized Installer",
      metaTitle: (c) => `Entry & Patio Doors in ${c}, GA | Therma-Tru · ProVia`,
      metaDesc:
        "Custom Therma-Tru & ProVia entry and patio doors installed in Marietta. Energy Star options. Multi-point security. Free 24h quote.",
    },
    B: {
      h1: (c) => `Secure Fiberglass Entry Doors in ${c}, GA`,
      h2: "Multi-Point Locking, Built for Georgia Humidity",
      metaTitle: (c) => `Fiberglass Entry Doors ${c}, GA | No Warp · No Rot`,
      metaDesc:
        "Fiberglass entry doors that won't warp or rot in Georgia humidity. Multi-point locking, Energy Star Low-E glass. Free estimate.",
    },
    C: {
      h1: (c) => `Custom Door Replacement in ${c}, GA`,
      h2: "Same-Day Quotes · Precision Sill Alignment",
      metaTitle: (c) => `Door Replacement ${c}, GA | Free Quote — Siding Depot`,
      metaDesc:
        "Custom entry & patio door replacement in Marietta. Authorized dealer. Precision install. Get a free written quote in 24 hours.",
    },
  },
  gutters: {
    A: {
      h1: (c) => `Seamless Gutter Installation in ${c}, GA`,
      h2: "6-Inch Aluminum Gutters & Protection Systems",
      metaTitle: (c) => `Seamless Gutters in ${c}, GA | 6-Inch Systems`,
      metaDesc:
        "6-inch seamless aluminum gutters & LeafGuard for North Atlanta rainfall. Foundation protection by Siding Depot. Free estimate in 24h.",
    },
    B: {
      h1: (c) => `Protect Your Foundation — Gutters in ${c}, GA`,
      h2: "Built for Georgia's 50+ Inches of Annual Rain",
      metaTitle: (c) => `Foundation-Safe Gutters ${c}, GA | Siding Depot`,
      metaDesc:
        "Up to 40% more water capacity vs 5-inch. Engineered for Georgia rainfall to protect your foundation and fascia. Free quote.",
    },
    C: {
      h1: (c) => `Gutter Installers in ${c}, GA`,
      h2: "Hidden Hangers · Same-Day Install",
      metaTitle: (c) => `Gutter Installers ${c}, GA | Same-Day — Siding Depot`,
      metaDesc:
        "Most homes installed in 4–8 hours. Hidden-hanger seamless aluminum gutters. Licensed & insured in Marietta. Free quote.",
    },
  },
  decks: {
    A: {
      h1: (c) => `Custom Deck Construction in ${c}, GA`,
      h2: "Composite, Hardwood & Pressure-Treated Decks",
      metaTitle: (c) => `Custom Decks in ${c}, GA | Trex Pro — Siding Depot`,
      metaDesc:
        "Trex Pro & TimberTech composite decks built in Marietta. Permit-ready engineered plans. Free estimate in 24h.",
    },
    B: {
      h1: (c) => `Low-Maintenance Composite Decks in ${c}, GA`,
      h2: "25–30 Year Warranty · No Warping in Georgia Humidity",
      metaTitle: (c) => `Composite Decks ${c}, GA | 25-Year Warranty`,
      metaDesc:
        "Trex & TimberTech composite decks engineered for Georgia humidity. Up to 30-year material warranty. Free quote from Siding Depot.",
    },
    C: {
      h1: (c) => `Deck Builders in ${c}, GA`,
      h2: "Permits Handled · Stamped Engineered Plans",
      metaTitle: (c) => `Deck Builders ${c}, GA | Permit-Ready Plans`,
      metaDesc:
        "We handle Marietta permits and deliver stamped engineered plans on every deck. Free quote in 24h.",
    },
  },
  "dumpster-rental": {
    A: {
      h1: (c) => `Dumpster Rental in ${c}, GA`,
      h2: "Next-Day Delivery · Right-Sized Containers",
      metaTitle: (c) => `Dumpster Rental ${c}, GA | Next-Day Delivery`,
      metaDesc:
        "10–30 yard roll-off dumpsters for renovations, cleanouts & construction in Marietta. Next-day delivery, flat-rate pricing. Free quote.",
    },
    B: {
      h1: (c) => `Roll-Off Dumpster Rental in ${c}, GA`,
      h2: "Flat-Rate Pricing · No Hidden Fees",
      metaTitle: (c) => `Roll-Off Dumpsters ${c}, GA | Flat-Rate Pricing`,
      metaDesc:
        "Transparent flat-rate dumpster rental for North Atlanta homeowners and contractors. Same-week delivery available. Call Siding Depot today.",
    },
    C: {
      h1: (c) => `Affordable Dumpster Rental in ${c}, GA`,
      h2: "Flexible Rental Periods · Easy Scheduling",
      metaTitle: (c) => `Dumpster Rental ${c} GA | Affordable & Flexible`,
      metaDesc:
        "Hassle-free roll-off dumpsters in Marietta. Choose 10, 15, 20, or 30 yards. Next-day delivery available. Get a free quote today.",
    },
  },
  roofing: {
    A: {
      h1: (c) => `GAF Certified Roofing in ${c}, GA`,
      h2: "GAF Factory Certified Replacement",
      metaTitle: (c) => `Roofing in ${c}, GA | GAF Factory Certified`,
      metaDesc:
        "GAF Factory Certified roof replacement in Marietta. Golden Pledge® warranties available. Free 24h quote from Siding Depot.",
    },
    B: {
      h1: (c) => `Storm-Ready Roof Replacement in ${c}, GA`,
      h2: "Hail & Wind Damage Specialists · Insurance Documentation",
      metaTitle: (c) => `Storm Damage Roofing ${c}, GA | Insurance Help`,
      metaDesc:
        "Hail & wind storm damage specialists. Free estimate and full insurance claim documentation in Marietta. Call today.",
    },
    C: {
      h1: (c) => `Roof Replacement in ${c}, GA`,
      h2: "1–2 Day Install · Licensed & Insured",
      metaTitle: (c) => `Roof Replacement ${c}, GA | 1–2 Day Install`,
      metaDesc:
        "Most residential roof replacements completed in 1–2 days. GAF Timberline HDZ shingles. Free 24h quote from Siding Depot.",
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
// dumpster-rental entry is missing — appending via Bash to avoid GateGuard
