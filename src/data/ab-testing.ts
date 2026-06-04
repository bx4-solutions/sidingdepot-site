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
  stats: { value: string; label: string; icon: LucideIcon }[];
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
        "W-2 certified installers — no subcontractors",
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
      eyebrow: "Sherwin-Williams · PRO Preferred",
      title: "Exterior Painting,",
      titleAccent: "High-Performance Systems.",
      intro: "A repaint should last a decade, not a few seasons. We utilize Sherwin-Williams® Emerald and Duration systems to create a UV-resistant thermal barrier that handles North Atlanta's extreme temperature swings.",
      benefits: [
        "Sherwin-Williams Emerald® UV-shield coatings",
        "Multi-stage prep: wash, scrape, sand, and prime",
        "Self-cleaning technology resists dirt and mildew",
        "5-year workmanship warranty on all full repaints",
      ],
      process: [
        { title: "Deep Surface Prep", desc: "Professional washing and manual surface stabilization to ensure long-term bonding." },
        { title: "Premium Priming", desc: "Dedicated primer layer for maximum depth and protection on fiber cement or wood." },
        { title: "Dual-Coat Finish", desc: "Two full coats of premium enamel for sharp architectural lines and maximum protection." },
      ],
      hiringIntro: "A repaint is your home's primary line of defense. Ensure your partner doesn't skip critical preparation steps.",
    },
    B: {
      eyebrow: "UV Protection · Mold Resistance",
      title: "Stop Fading & Peeling,",
      titleAccent: "Advanced UV-Shield Barriers.",
      intro: "Georgia's sun and humidity destroy cheap paint in under 3 years. We specify premium coatings that reflect heat and resist mold, keeping your home looking freshly painted for 8-12 years guaranteed.",
      benefits: [
        "Blocks 90% of harmful UV rays to prevent fading",
        "Advanced mildewcide additives for humid GA summers",
        "Breathable membranes prevent moisture trapping",
        "Vibrant color retention technology",
      ],
      process: [
        { title: "Forensic Prep", desc: "Scraping and sanding down to a sound substrate for optimal adhesion." },
        { title: "Gap Sealing", desc: "High-flex elastomeric caulking for all joints to prevent water intrusion." },
        { title: "Satin Shield", desc: "Application of specialized finishes that shed water and resist dirt buildup." },
      ],
      hiringIntro: "The cost of a repaint is 70% labor and prep. This checklist helps you verify the quality of what's under the finish.",
    },
    C: {
      eyebrow: "W-2 Professional Crews · 5-Day Completion",
      title: "Better House Painting,",
      titleAccent: "Without the Mess or Delays.",
      intro: "Tired of ghosting contractors? Our W-2 painting crews show up on time, communicate daily, and finish most North Atlanta homes in 4-8 working days. Professional results without the typical renovation headache.",
      benefits: [
        "Punctual, uniformed highly specialized certified professionals (not subbed)",
        "Daily progress updates from your project manager",
        "Comprehensive property protection (masking/tarping)",
        "Fully licensed and workers-comp insured",
      ],
      process: [
        { title: "Consult & Sample", desc: "Professional color consultation with on-site sample boards." },
        { title: "Precision Execution", desc: "Methodical painting process with zero overspray and crisp trim lines." },
        { title: "Clean Property", desc: "Daily site cleanup and a final debris-free inspection." },
      ],
      hiringIntro: "Who is actually standing on the ladder? This checklist ensures you hire a professional team, not just a middleman.",
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
      { value: "12 Years", label: "Average Lifespan", icon: Clock },
      { value: "5 Years", label: "Labor Warranty", icon: ShieldCheck },
      { value: "850+", label: "Homes Painted", icon: MapPin },
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
