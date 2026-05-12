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

export const PROCESS_STEPS = [
  {
    num: "01",
    title: "Consultation",
    desc: "Free on-site visit. We listen to your vision, measure, and walk you through a written, no-pressure proposal — usually the same day.",
  },
  {
    num: "02",
    title: "Renovation",
    desc: "Your dedicated project manager runs daily check-ins. Our W-2 crews install James Hardie, paint, decks or roofing — never subcontracted.",
  },
  {
    num: "03",
    title: "Celebration",
    desc: "Final walk-through to make sure every detail meets your expectations. Then step back to the curb and admire your transformed home.",
  },
] as const;

export const AWARDS = [
  { name: "James Hardie Elite Preferred", subtitle: "Top 2% of US installers" },
  { name: "GAF Factory Certified", subtitle: "Roofing system warranty" },
  { name: "Google · 4.9★", subtitle: "128+ verified reviews" },
  { name: "Licensed & Insured", subtitle: "Georgia GC #RBQA006789" },
  { name: "BBB Accredited", subtitle: "A+ rating" },
  { name: "GreenSky Financing", subtitle: "0% APR plans available" },
] as const;

export type ProjectTag = "Siding" | "Painting" | "Roofing" | "Windows" | "Decks" | "Gutters";

export const PROJECTS: ReadonlyArray<{
  src: string;
  alt: string;
  tags: ReadonlyArray<ProjectTag>;
}> = [
  { src: "/projects/project-1.webp", alt: "Two-story Marietta home with new James Hardie blue siding, fresh paint and white trim", tags: ["Siding", "Painting", "Windows"] },
  { src: "/projects/project-2.webp", alt: "Cape Cod style home in Alpharetta with new white HardiePlank siding and yellow front door", tags: ["Siding", "Painting", "Roofing"] },
  { src: "/projects/project-3.webp", alt: "Renovated split-level home with white siding and dark trim accents in North Atlanta", tags: ["Siding", "Painting"] },
  { src: "/projects/project-4.webp", alt: "Newly painted white home with two-car garage and shake siding gable", tags: ["Painting", "Siding"] },
  { src: "/projects/project-5.webp", alt: "Two-story Cobb County home repainted in deep blue with crisp white trim and gutters", tags: ["Painting", "Gutters"] },
  { src: "/projects/project-6.webp", alt: "Three-story Canton home with bold blue siding, white trim and rebuilt rear deck", tags: ["Siding", "Painting", "Decks"] },
  { src: "/projects/project-7.webp", alt: "Tan craftsman style home in Roswell with new gables, dark garage doors and roofing", tags: ["Siding", "Roofing"] },
  { src: "/projects/project-8.webp", alt: "Backyard view of repainted home with new windows and rebuilt wood deck", tags: ["Windows", "Decks", "Painting"] },
];

export const BEFORE_AFTER_PAIRS = [
  {
    before: "/projects/project-1-before.webp",
    after: "/projects/project-1.webp",
    beforeAlt: "Marietta home before renovation with peeling paint and worn siding",
    afterAlt: "Same Marietta home transformed with James Hardie blue siding by Siding Depot",
  },
  {
    before: "/projects/project-5-before.webp",
    after: "/projects/project-5.webp",
    beforeAlt: "Two-story home before renovation with faded, mildewed siding",
    afterAlt: "Same home repainted in deep blue with white trim by Siding Depot",
  },
] as const;
