import { LucideIcon, Award, ShieldCheck, Clock, CheckCircle2, Star, Users, MapPin, BadgeCheck } from "lucide-react";
import { track } from "@/lib/track";

export type ABVariation = "A" | "B" | "C";

export type ServiceCopy = {
  eyebrow: string;
  title: string;
  titleAccent: string;
  intro: string;
  benefits: string[];
  process: { title: string; desc: string }[];
  hiringIntro: string;
};

export type SocialProof = {
  stats: { value: string; label: string; description?: string; icon: LucideIcon }[];
  seals: { title: string; subtitle: string; icon: LucideIcon }[];
  reviews: { name: string; city: string; text: string; rating: number }[];
};

export const AB_CONTENT: Record<string, Record<ABVariation, ServiceCopy>> = {
  siding: {
    A: {
      eyebrow: "James Hardie · Elite Preferred",
      title: "James Hardie® Siding,",
      titleAccent: "Elite Installation & Protection.",
      intro: "Transform your home with North Atlanta's Top 2% James Hardie Elite Preferred contractor. Engineered for Georgia's HZ10 zone, our siding systems combine unbeatable durability with the vibrant ColorPlus® Technology finish.",
      benefits: [
        "Top 2% Elite Preferred James Hardie status",
        "Engineered specifically for Georgia's heat & humidity",
        "30-year limited material & 15-year finish warranty",
        "highly specialized certified teams — no subcontractors",
      ],
      process: [
        { title: "Precision Measurement", desc: "Forensic inspection of current siding with a detailed, itemized quote within 24 hours." },
        { title: "Material Selection", desc: "Choose your profile (Lap, Shingle, Board & Batten) and ColorPlus® maintenance-free finish." },
        { title: "Elite Installation", desc: "Full tear-off and precision install following Hardie's strict Best Practices manual." },
      ],
      hiringIntro: "Choosing siding is a 30-year decision. Use this checklist to verify your contractor meets the highest industry standards for Georgia.",
    },
    B: {
      eyebrow: "30-Year Performance · HZ10 Engineered",
      title: "Moisture-Proof Your Home,",
      titleAccent: "Built for Georgia's Climate.",
      intro: "Don't let humidity rot your investment. Our fiber cement siding is specifically engineered for the Southeast, resisting warping, pests, and fire while increasing your home's resale value by up to 80%.",
      benefits: [
        "Resists rot, swelling, and mold in GA humidity",
        "Non-combustible — superior fire protection",
        "Pest-resistant fiber cement technology",
        "Highest ROI of any exterior home renovation",
      ],
      process: [
        { title: "Thermal Audit", desc: "We assess your home's thermal barrier and moisture points before quoting." },
        { title: "HardieZone System", desc: "Customizing the installation for Georgia's specific temperature and rain cycles." },
        { title: "Lifetime Protection", desc: "Advanced weather-barrier wrap ensures your structural frame stays dry for decades." },
      ],
      hiringIntro: "Siding must survive 50+ inches of rain per year. This checklist ensures your installation is moisture-tight from day one.",
    },
    C: {
      eyebrow: "Transparent Pricing · Expert Crews",
      title: "Fixed-Price Siding,",
      titleAccent: "Installed Without the Stress.",
      intro: "Get a comprehensive, no-pressure siding estimate the same day. Our Highly specialized certified teams specialize in James Hardie installation, ensuring a fast, clean, and professional process from tear-off to final celebration.",
      benefits: [
        "Written estimates delivered within 24 hours",
        "Dedicated project manager on-site daily",
        "Complete cleanup and magnet sweep included",
        "0% APR financing available through GreenSky",
      ],
      process: [
        { title: "Instant Consultation", desc: "Same-day on-site visit with a digital, transparent price proposal." },
        { title: "Professional Tear-Off", desc: "Efficient removal of old siding with high-load debris management." },
        { title: "Final Walkthrough", desc: "100% satisfaction check before we ever collect the final payment." },
      ],
      hiringIntro: "A siding project shouldn't disrupt your life. Use this checklist to find a partner who values your time and property.",
    },
  },
  painting: {
    A: {
      eyebrow: "Exterior Painting — North Atlanta",
      title: "Exterior Painting in Marietta, Canton &",
      titleAccent: "North Atlanta, GA",
      intro: "Georgia's heat and humidity are relentless. UV exposure, temperature swings from 20°F in January to 100°F in August, and year-round moisture cause cheap exterior paint to crack, peel, and fade within 2–3 years.\n\nSiding Depot uses only Sherwin-Williams Duration® and SuperPaint® — premium exterior coatings engineered specifically for hot, humid climates like Marietta and Cherokee County. These paints carry a 15-year warranty against peeling and fading.\n\nEvery Siding Depot painting project starts with a thorough prep: pressure washing, scraping, caulking every gap and crack, and a full primer coat. The paint goes on last. This is why our results look better at year 5 than most competitors' results look at year 1.\n\nOur W-2 crews — never subcontractors — handle every exterior painting project in North Atlanta. A dedicated project manager oversees every stage. You receive a written, itemized estimate before a single brush touches your house. The price in the estimate is the price you pay.",
      benefits: [
        "Sherwin-Williams Duration® & SuperPaint®",
        "Full multi-stage surface preparation",
        "W-2 employee crews (never subcontractors)",
        "Written itemized estimates guaranteed",
      ],
      process: [], // Using hiringChecklist instead for 6 cards
      hiringIntro: "Premium paint. Proper prep. Professionals who show up on time and clean up when they leave.",
    },
    B: {
      eyebrow: "Exterior Painting — North Atlanta",
      title: "Exterior Painting in Marietta, Canton &",
      titleAccent: "North Atlanta, GA",
      intro: "Georgia's heat and humidity are relentless. UV exposure, temperature swings from 20°F in January to 100°F in August, and year-round moisture cause cheap exterior paint to crack, peel, and fade within 2–3 years.\n\nSiding Depot uses only Sherwin-Williams Duration® and SuperPaint® — premium exterior coatings engineered specifically for hot, humid climates like Marietta and Cherokee County. These paints carry a 15-year warranty against peeling and fading.\n\nEvery Siding Depot painting project starts with a thorough prep: pressure washing, scraping, caulking every gap and crack, and a full primer coat. The paint goes on last. This is why our results look better at year 5 than most competitors' results look at year 1.\n\nOur W-2 crews — never subcontractors — handle every exterior painting project in North Atlanta. A dedicated project manager oversees every stage. You receive a written, itemized estimate before a single brush touches your house. The price in the estimate is the price you pay.",
      benefits: [
        "Sherwin-Williams Duration® & SuperPaint®",
        "Full multi-stage surface preparation",
        "W-2 employee crews (never subcontractors)",
        "Written itemized estimates guaranteed",
      ],
      process: [],
      hiringIntro: "Premium paint. Proper prep. Professionals who show up on time and clean up when they leave.",
    },
    C: {
      eyebrow: "Exterior Painting — North Atlanta",
      title: "Exterior Painting in Marietta, Canton &",
      titleAccent: "North Atlanta, GA",
      intro: "Georgia's heat and humidity are relentless. UV exposure, temperature swings from 20°F in January to 100°F in August, and year-round moisture cause cheap exterior paint to crack, peel, and fade within 2–3 years.\n\nSiding Depot uses only Sherwin-Williams Duration® and SuperPaint® — premium exterior coatings engineered specifically for hot, humid climates like Marietta and Cherokee County. These paints carry a 15-year warranty against peeling and fading.\n\nEvery Siding Depot painting project starts with a thorough prep: pressure washing, scraping, caulking every gap and crack, and a full primer coat. The paint goes on last. This is why our results look better at year 5 than most competitors' results look at year 1.\n\nOur W-2 crews — never subcontractors — handle every exterior painting project in North Atlanta. A dedicated project manager oversees every stage. You receive a written, itemized estimate before a single brush touches your house. The price in the estimate is the price you pay.",
      benefits: [
        "Sherwin-Williams Duration® & SuperPaint®",
        "Full multi-stage surface preparation",
        "W-2 employee crews (never subcontractors)",
        "Written itemized estimates guaranteed",
      ],
      process: [],
      hiringIntro: "Premium paint. Proper prep. Professionals who show up on time and clean up when they leave.",
    },
  },
  // Add other services here...
};

export const SOCIAL_PROOF: Record<string, SocialProof> = {
  siding: {
    stats: [
      { value: "1,500+", label: "Installs in GA", icon: Users },
      { value: "Top 2%", label: "Elite Preferred", icon: Award },
      { value: "30 Years", label: "Material Warranty", icon: ShieldCheck },
    ],
    seals: [
      { title: "James Hardie®", subtitle: "Elite Preferred", icon: BadgeCheck },
      { title: "BBB Accredited", subtitle: "A+ Rating", icon: ShieldCheck },
      { title: "Google Rated", subtitle: "4.9 Stars", icon: Star },
    ],
    reviews: [
      { name: "Michael T.", city: "Alpharetta", text: "From quote to completion, the crew was on time every day. The Hardie siding looks incredible — worth every penny.", rating: 5 },
      { name: "Sarah R.", city: "Milton", text: "4 contractors quoted us. Siding Depot was the most transparent and finished ahead of schedule.", rating: 5 },
    ],
  },
  painting: {
    stats: [
      { 
        value: "15+", 
        label: "Years Painting North Atlanta Homes", 
        description: "Exterior painting across Marietta, Canton, Kennesaw, Alpharetta, Milton and Woodstock since 2009.",
        icon: Clock 
      },
      { 
        value: "1,500+", 
        label: "Homes Transformed", 
        description: "Exterior painting, siding, windows and full renovation projects across Cherokee, Cobb, Fulton and Forsyth counties.",
        icon: MapPin 
      },
      { 
        value: "15yr", 
        label: "Paint Warranty", 
        description: "Sherwin-Williams Duration® carries a 15-year warranty against peeling and fading — the longest in the industry for exterior paint.",
        icon: ShieldCheck 
      },
    ],
    seals: [
      { title: "Sherwin-Williams®", subtitle: "PRO Preferred", icon: BadgeCheck },
      { title: "EPA Certified", subtitle: "Lead-Safe Firm", icon: ShieldCheck },
      { title: "HomeAdvisor", subtitle: "Top Rated", icon: Star },
    ],
    reviews: [
      { name: "David K.", city: "Marietta e região", text: "They used high-end Emerald paint and the finish is flawless. My house looks brand new after 10 years of neglect.", rating: 5 },
      { name: "Jennifer L.", city: "Marietta", text: "The prep work was amazing. They spent 2 days just scraping and caulking before a single drop of paint touched the wall.", rating: 5 },
    ],
  },
};

/**
 * Persists and returns the assigned variation for a service.
 * Tracks CTR (assignment) and ensures consistency.
 */
export function getServiceVariation(service: string): ABVariation {
  if (typeof window === "undefined") return "A";
  
  const key = `ab_var_${service}`;
  let variation = sessionStorage.getItem(key) as ABVariation;
  
  if (!variation) {
    // 60% A (Authority), 20% B (Benefit), 20% C (Conversion)
    const rand = Math.random();
    variation = rand < 0.6 ? "A" : rand < 0.8 ? "B" : "C";
    sessionStorage.setItem(key, variation);
    
    // Track CTR (Variation Assignment)
    track("ab_variation_assigned", { service, variation });
  }
  
  return variation;
}
