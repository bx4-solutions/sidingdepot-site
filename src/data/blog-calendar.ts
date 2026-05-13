export type BlogPostDraft = {
  id: string;
  title: string;
  slug: string;
  suggestedDate: string;
  category: string;
  keywords: string[];
  excerpt: string;
  status: 'draft' | 'published';
};

export const BLOG_CALENDAR: BlogPostDraft[] = [
  {
    id: "1",
    title: "James Hardie vs. Vinyl Siding: Which is Best for Georgia Homes?",
    slug: "james-hardie-vs-vinyl-siding-georgia",
    suggestedDate: "2026-06-01",
    category: "Siding",
    keywords: ["James Hardie", "vinyl siding", "Georgia homes"],
    excerpt: "Compare durability, cost, and maintenance for the two most popular siding choices in the Atlanta area.",
    status: 'draft'
  },
  {
    id: "2",
    title: "How Energy-Efficient Windows Can Save You Money This Summer",
    slug: "energy-efficient-windows-savings-atlanta",
    suggestedDate: "2026-06-15",
    category: "Windows",
    keywords: ["energy efficient windows", "Atlanta cooling costs"],
    excerpt: "Learn how modern window technology keeps your home cool and your electricity bills low during Georgia's peak heat.",
    status: 'draft'
  },
  {
    id: "3",
    title: "The Ultimate Guide to Choosing the Right Gutter System",
    slug: "choosing-right-gutter-system",
    suggestedDate: "2026-07-01",
    category: "Gutters",
    keywords: ["gutter system", "seamless gutters", "leaf protection"],
    excerpt: "Protect your foundation with the right gutter size and protection system. Here's what you need to know.",
    status: 'draft'
  },
  {
    id: "4",
    title: "Top Exterior Paint Colors for North Atlanta Homes in 2026",
    slug: "exterior-paint-colors-atlanta-2026",
    suggestedDate: "2026-07-15",
    category: "Painting",
    keywords: ["exterior paint colors", "Atlanta home trends"],
    excerpt: "Discover the most popular Sherwin-Williams colors that are trending in Marietta and Alpharetta this year.",
    status: 'draft'
  },
  {
    id: "5",
    title: "Signs It's Time to Replace Your Roof Before Storm Season",
    slug: "when-to-replace-roof-atlanta",
    suggestedDate: "2026-08-01",
    category: "Roofing",
    keywords: ["roof replacement", "storm damage", "Atlanta roofing"],
    excerpt: "Don't wait for a leak. Check these critical signs that your roof needs professional attention.",
    status: 'draft'
  },
  {
    id: "6",
    title: "Creating the Perfect Outdoor Space: Composite vs. Wood Decks",
    slug: "composite-vs-wood-decks-atlanta",
    suggestedDate: "2026-08-15",
    category: "Decks",
    keywords: ["composite deck", "wood deck", "Trex deck"],
    excerpt: "Comparing maintenance, longevity, and aesthetics for your new outdoor living area.",
    status: 'draft'
  },
  {
    id: "7",
    title: "How to Prepare Your Home for a Siding Replacement Project",
    slug: "preparing-for-siding-replacement",
    suggestedDate: "2026-09-01",
    category: "Siding",
    keywords: ["siding replacement prep", "home renovation"],
    excerpt: "A step-by-step checklist to ensure a smooth and stress-free siding installation experience.",
    status: 'draft'
  },
  {
    id: "8",
    title: "The Impact of New Entry Doors on Home Value and Security",
    slug: "entry-doors-home-value-security",
    suggestedDate: "2026-09-15",
    category: "Doors",
    keywords: ["entry doors", "home security", "curb appeal"],
    excerpt: "Why upgrading your front door is one of the best investments you can make for your home.",
    status: 'draft'
  },
  {
    id: "9",
    title: "Understanding Georgia's Climate: Why Fiber Cement Wins",
    slug: "fiber-cement-georgia-climate",
    suggestedDate: "2026-10-01",
    category: "Siding",
    keywords: ["fiber cement", "Georgia climate", "moisture resistance"],
    excerpt: "Why James Hardie's HZ10 rating is essential for homes in the humid Southeast.",
    status: 'draft'
  },
  {
    id: "10",
    title: "Winterizing Your Home: Focus on Windows and Doors",
    slug: "winterizing-windows-doors-atlanta",
    suggestedDate: "2026-10-15",
    category: "Windows",
    keywords: ["winterizing home", "drafty windows", "energy efficiency"],
    excerpt: "Keep the heat in and the cold out. Simple tips for checking seals and insulation.",
    status: 'draft'
  },
  {
    id: "11",
    title: "The Importance of Proper Gutter Maintenance in the Fall",
    slug: "fall-gutter-maintenance",
    suggestedDate: "2026-11-01",
    category: "Gutters",
    keywords: ["fall gutters", "cleaning gutters", "leaf guard"],
    excerpt: "Prevent ice dams and water damage by keeping your gutters clear this autumn.",
    status: 'draft'
  },
  {
    id: "12",
    title: "Planning Your 2027 Home Renovations: A Winter Guide",
    slug: "planning-2027-renovations",
    suggestedDate: "2026-11-15",
    category: "General",
    keywords: ["home renovation planning", "remodeling guide"],
    excerpt: "The best time to start planning your spring and summer projects is during the off-season.",
    status: 'draft'
  }
];
