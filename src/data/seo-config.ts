export const SERVICE_METADATA: Record<string, {
  h1: (city: string) => string;
  h2: string;
  metaTitle: (city: string) => string;
  metaDesc: string;
}> = {
  siding: {
    h1: (city) => `Elite Siding Installation & Protection in ${city}, GA`,
    h2: "Top 2% James Hardie Elite Preferred Contractor",
    metaTitle: (city) => `James Hardie Siding in ${city}, GA | Siding Depot — Elite Preferred`,
    metaDesc: "Upgrade your home with James Hardie fiber cement siding. Certified Elite Preferred installer for Marietta & North Atlanta. 50-year durability. Get a 24h quote.",
  },
  painting: {
    h1: (city) => `Exterior Painting Services in ${city}, GA`,
    h2: "Sherwin-Williams Premium Systems with UV Protection",
    metaTitle: (city) => `Exterior Painting in ${city}, GA | Siding Depot — UV Protection`,
    metaDesc: "Premium Sherwin-Williams exterior painting in North Atlanta. UV-shield coatings for 10-year durability. Professional W-2 crews. Free quote in 24h.",
  },
  windows: {
    h1: (city) => `Energy-Efficient Windows in ${city}, GA`,
    h2: "Energy Star® Certified Low-E Double-Pane Windows",
    metaTitle: (city) => `Windows in ${city}, GA | Siding Depot — Energy Star Certified`,
    metaDesc: "Energy Star Simonton & PGT window replacement for North Atlanta. Cut cooling costs by 15-25%. Marietta, Alpharetta & beyond. Free estimate.",
  },
  doors: {
    h1: (city) => `Entry & Patio Doors in ${city}, GA`,
    h2: "Secure, Stylish, and Energy Star Certified Door Systems",
    metaTitle: (city) => `Entry Doors in ${city}, GA | Siding Depot — Secure & Stylish`,
    metaDesc: "Custom entry & patio doors. Therma-Tru® authorized installer. Enhance security and curb appeal in North Atlanta. Call for a free estimate.",
  },
  gutters: {
    h1: (city) => `Gutter System Installation in ${city}, GA`,
    h2: "Seamless Aluminum Gutters & Protection Systems",
    metaTitle: (city) => `Gutter Systems in ${city}, GA | Siding Depot — Seamless Protection`,
    metaDesc: "Protect your foundation with seamless gutters in North Atlanta. Professional installation & protection systems. Free estimate in 24h.",
  },
  deck: {
    h1: (city) => `Custom Deck Construction in ${city}, GA`,
    h2: "Composite, Hardwood & Pressure-Treated Decks",
    metaTitle: (city) => `Decks in ${city}, GA | Siding Depot — Custom Outdoor Living`,
    metaDesc: "Transform your backyard with a custom deck in North Atlanta. Composite, hardwood & pressure-treated options. Elite craftmanship. Request a quote.",
  },
  roofing: {
    h1: (city) => `Professional Roofing Services in ${city}, GA`,
    h2: "GAF Factory Certified Roofing Replacement & Repair",
    metaTitle: (city) => `Roofing in ${city}, GA | Siding Depot — GAF Certified`,
    metaDesc: "GAF Factory Certified roof replacement in North Atlanta. 50-year system warranties. Expert storm damage assessment. Free quote in 24h.",
  },
};
