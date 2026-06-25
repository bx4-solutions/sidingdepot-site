/**
 * Shared content for all Landing Pages (LPs).
 * Centralized so every LP stays consistent and edits propagate site-wide.
 */

export type SidingType = { title: string; desc: string };
export type FaqItem = { q: string; a: string };
export type GreenSkyStep = { step: string; title: string; desc: string };

export const SIDING_TYPES: ReadonlyArray<SidingType> = [
  {
    title: "Plank Siding",
    desc: "Long, narrow horizontal boards. Durable, low-maintenance and weather-resistant — the most popular Hardie style in North Atlanta.",
  },
  {
    title: "Board & Batten",
    desc: "Vertical panels with batten strips covering the seams. Adds height, drama and a modern-farmhouse feel to any elevation.",
  },
  {
    title: "Shingle Siding",
    desc: "Overlapping rectangular pieces for a warm, traditional look. Perfect for gables, accents and Cape Cod-style homes.",
  },
  {
    title: "Soffit, Trim & Fascia",
    desc: "The often-overlooked pieces that protect attics and crawl spaces from moisture, heat and pests — installed in matching Hardie finishes.",
  },
] as const;

/** FAQs builder — interpolates city for local SEO. */
export function buildFaqs(city: string): ReadonlyArray<FaqItem> {
  return [
    {
      q: `How much does James Hardie siding cost in ${city}, GA?`,
      a: `For most homes in ${city} and the North Atlanta area, a full James Hardie installation runs $15,000–$30,000 for a 2,500 sq ft home ($8–$14/sqft installed). Every estimate is itemized and fixed — the price we quote is the price you pay.`,
    },
    {
      q: "Do you offer financing or 0% APR plans?",
      a: "Yes. We partner with GreenSky to offer 0% APR plans (subject to credit approval). Most homeowners get pre-approved in under 60 seconds during the estimate, with monthly payments often less than what they spend on coffee per week.",
    },
    {
      q: "How long does siding installation take?",
      a: "Most homes in North Atlanta take 3–7 days from start to finish. Your home is never left exposed overnight. We assign a dedicated project manager and communicate proactively if weather causes any delay.",
    },
    {
      q: "How long will James Hardie siding last on my home?",
      a: "James Hardie fiber cement is engineered for 50+ years and comes with a 30-year limited transferable product warranty plus our workmanship guarantee. ColorPlus® Technology keeps the finish sharp 30% longer than traditional paint.",
    },
    {
      q: "How soon can you start my project?",
      a: "We're currently booking 3–4 weeks out. Request your free estimate today to lock in your spot before our spring calendar fills up. Insurance and storm-damage projects can often be prioritized.",
    },
    {
      q: "Does insurance cover siding damage from hail or storms?",
      a: "In most cases, yes. Georgia's hail season (March–June) generates thousands of siding claims across Cobb and Cherokee counties. We work directly with your insurance adjuster and document damage on your behalf — at no cost to you.",
    },
    {
      q: "Are you really licensed and insured?",
      a: "Yes — Georgia GC #RBQA006789, fully insured with general liability and workers' comp. We're James Hardie Elite Contractor (top 2% nationwide), GAF Factory Certified, and BBB A+ accredited.",
    },
  ];
}

/** GreenSky financing — process steps. */
export const GREENSKY_STEPS: ReadonlyArray<GreenSkyStep> = [
  {
    step: "1",
    title: "Apply in 60 seconds",
    desc: "Soft credit check during your free estimate — no impact on your score.",
  },
  {
    step: "2",
    title: "Get instant approval",
    desc: "Most homeowners are pre-approved on the spot for up to $65,000.",
  },
  {
    step: "3",
    title: "Start your project",
    desc: "Sign the digital agreement and we schedule installation right away.",
  },
  {
    step: "4",
    title: "Pay over time",
    desc: "0% APR promotional plans available. Fixed monthly payments, no prepayment penalty.",
  },
];

/** GreenSky financing — quick objection-busting Q&A. */
export const GREENSKY_FAQS: ReadonlyArray<FaqItem> = [
  {
    q: "What credit score do I need to qualify?",
    a: "GreenSky approves homeowners with a wide range of credit profiles. A 660+ FICO score typically qualifies for the best 0% APR promotional plans.",
  },
  {
    q: "How long does approval take?",
    a: "Under 60 seconds. We submit the soft credit check digitally during your estimate and you get an instant decision.",
  },
  {
    q: "Are there any application or prepayment fees?",
    a: "No application fees, no prepayment penalties, and no hidden charges. Pay your loan off early with zero extra cost.",
  },
  {
    q: "What documents do I need?",
    a: "Just a government-issued ID and basic income info. No tax returns, pay stubs, or home appraisal required for most homeowners.",
  },
];
