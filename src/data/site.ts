export const SITE = {
  name: "Siding Depot",
  legalName: "Siding Depot LLC",
  phone: "(678) 400-2012",
  phoneHref: "tel:+16784002012",
  whatsapp: "16784002012",
  email: "office@sidingdepot.com",
  address: {
    street: "3036 Roswell Rd",
    city: "Marietta",
    state: "GA",
    zip: "30062",
    full: "3036 Roswell Rd, Marietta, GA 30062",
  },
  hours: "Mon–Sat: 8:00 AM – 6:00 PM",
  greenSkyUrl:
    "https://projects.greensky.com/merchantloanapplication?apptype=short&merchant=810185699&dealerplan=25211&channel=External-Button-03",
  ghlWebhookUrl: import.meta.env.VITE_GHL_WEBHOOK_URL ?? "",
} as const;

export const SERVICES = [
  { slug: "siding", title: "James Hardie Siding", short: "Elite Preferred installation built for Georgia weather.", icon: "🏠" },
  { slug: "painting", title: "Exterior Painting", short: "Sherwin-Williams premium with UV protection.", icon: "🎨" },
  { slug: "windows", title: "Windows & Doors", short: "Energy-efficient replacements that lower bills.", icon: "🪟" },
  { slug: "deck", title: "Deck Construction", short: "Custom decks in composite, hardwood and PT.", icon: "🪵" },
  { slug: "gutters", title: "Gutter Systems", short: "Seamless aluminum gutters and LeafGuard.", icon: "💧" },
  { slug: "roofing", title: "Roofing", short: "GAF Factory Certified — replacement & repair.", icon: "🏚️" },
  { slug: "dumpster", title: "Dumpster Rental", short: "10/15/20 yd — same-day delivery in North Atlanta.", icon: "🚛" },
] as const;

export const CITIES = [
  { slug: "marietta", name: "Marietta", county: "Cobb County" },
  { slug: "alpharetta", name: "Alpharetta", county: "Fulton County" },
  { slug: "milton", name: "Milton", county: "Fulton County" },
  { slug: "canton", name: "Canton", county: "Cherokee County" },
  { slug: "woodstock", name: "Woodstock", county: "Cherokee County" },
  { slug: "roswell", name: "Roswell", county: "Fulton County" },
  { slug: "kennesaw", name: "Kennesaw", county: "Cobb County" },
  { slug: "johns-creek", name: "Johns Creek", county: "Fulton County" },
  { slug: "sandy-springs", name: "Sandy Springs", county: "Fulton County" },
  { slug: "acworth", name: "Acworth", county: "Cobb County" },
] as const;

export const STATS = [
  { value: "1,500+", label: "Homes Transformed" },
  { value: "15+", label: "Years in Georgia" },
  { value: "98%", label: "5-Star Reviews" },
  { value: "4.9★", label: "Google Rating" },
] as const;

export const PROOF_BAR = [
  { icon: "⭐", label: "4.9 Google Rating" },
  { icon: "🏆", label: "Elite Preferred · Top 2%" },
  { icon: "🏠", label: "1,500+ Homes" },
  { icon: "✅", label: "Licensed & Insured" },
  { icon: "💰", label: "Financing Available" },
] as const;
