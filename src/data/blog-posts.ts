export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  category: string
  readTime: number
  publishDate: string
  featured: boolean
  heroImage: { url: string; alt: string; caption: string }
  sections: BlogSection[]
  faq: { q: string; a: string }[]
  cta: { city: string; service: string }
  metaTitle: string
  metaDescription: string
  internalLinks: string[]
}

export interface BlogSection {
  h2: string
  content: string
  image?: { url: string; alt: string; caption: string }
  table?: { headers: string[]; rows: string[][] }
  pullQuote?: string
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'james-hardie-siding-cost-marietta-ga-2026',
    title: 'How Much Does James Hardie Siding Cost in Marietta, GA? (2026 Complete Guide)',
    excerpt: 'How much does James Hardie siding cost in Marietta, GA in 2026? Real prices from $8–$14/sqft installed. Full breakdown by home size, style, and neighborhood.',
    category: 'Cost Guides',
    readTime: 9,
    publishDate: '2026-05-14',
    featured: true,
    heroImage: {
      url: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1200',
      alt: 'James Hardie HardiePlank lap siding installation on a traditional two-story home in Marietta, Georgia',
      caption: 'A completed James Hardie HardiePlank installation on a 2,600 sq ft home in East Cobb, Marietta — project value approximately $22,000.'
    },
    sections: [
      {
        h2: 'What Does James Hardie Siding Cost Per Square Foot in North Atlanta in 2026?',
        content: 'The cost of James Hardie siding installation varies based on the size of your home and the specific needs of your property. Below is a breakdown of estimated costs for 2026.',
        table: {
          headers: ['Home Size', 'Sq Ft Siding', 'Estimated Cost', 'Notes'],
          rows: [
            ['1,500 sqft home', '~1,800 sqft siding', '$14,400–$25,200', 'Ranch/single story'],
            ['2,000 sqft home', '~2,400 sqft siding', '$19,200–$33,600', 'Most common in Marietta'],
            ['2,500 sqft home', '~3,000 sqft siding', '$24,000–$42,000', 'Typical East Cobb home'],
            ['3,000 sqft home', '~3,600 sqft siding', '$28,800–$50,400', 'Milton/Alpharetta range'],
            ['3,500+ sqft', '~4,200+ sqft siding', '$33,600–$58,800+', 'Custom/luxury tier']
          ]
        },
        pullQuote: 'The gap between the cheapest and most expensive bid in Marietta typically runs $8,000–$12,000. That gap is almost never about material quality — it\'s about who\'s doing the work.'
      },
      {
        h2: 'Cost Breakdown by James Hardie Product Line',
        content: 'James Hardie offers several product lines tailored for the Georgia climate. Here is a breakdown of the material and installation costs per square foot.',
        table: {
          headers: ['Produto', '$/sqft material', '$/sqft installed', 'Melhor para'],
          rows: [
            ['HardiePlank Lap Siding', '$2.50–$4.00', '$8–$11', 'Most homes, traditional look'],
            ['HardieShingle', '$3.00–$5.00', '$10–$14', 'Cape Cod, craftsman, accent areas'],
            ['HardiePanel (Vertical)', '$2.75–$4.25', '$9–$12', 'Modern farmhouse, board & batten'],
            ['HardieTrim', '$1.50–$3.00', '$4–$7', 'Corners, windows, doors — always included']
          ]
        },
        image: {
          url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900',
          alt: 'HardiePlank lap siding close-up showing fiber cement texture and ColorPlus factory finish in Cobblestone color',
          caption: 'James Hardie ColorPlus® factory finish holds color for 12+ years without repainting — a major factor in long-term cost comparison with vinyl.'
        }
      }
    ],
    faq: [
      { q: 'What is the average cost to reside a 2,000 sq ft house in Marietta in 2026?', a: 'Expect $19,000–$28,000 for James Hardie installed, including tear-off and house wrap.' },
      { q: 'How long does James Hardie siding last in Georgia?', a: '50+ years when properly installed by a certified HZ10 contractor.' },
      { q: 'Is James Hardie worth it over vinyl siding in North Atlanta?', a: 'Yes. At a $400k+ home value, vinyl signals builder-grade. Hardie adds resale value and lasts twice as long.' },
      { q: 'How do I know if I need full replacement or just repair?', a: 'If more than 20% of panels are damaged, full replacement is more cost-effective. We\'ll tell you honestly.' }
    ],
    cta: { city: 'Marietta', service: 'Siding' },
    metaTitle: 'James Hardie Siding Cost in Marietta GA 2026 | Complete Price Guide',
    metaDescription: 'How much does James Hardie siding cost in Marietta, GA in 2026? Real prices from $8–$14/sqft installed. Full breakdown by home size, style, and neighborhood.',
    internalLinks: ['6-signs-time-replace-siding-georgia-home', 'james-hardie-vs-vinyl-siding-georgia-climate']
  },
  {
    slug: '6-signs-time-replace-siding-georgia-home',
    title: "6 Signs It's Time to Replace the Siding on Your Georgia Home",
    excerpt: "Water damage and rot behind aging siding is common on Georgia homes built before 2005. Here are the 6 key signs you need to watch for.",
    category: 'Home Maintenance',
    readTime: 7,
    publishDate: '2026-05-13',
    featured: false,
    heroImage: {
      url: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=1200',
      alt: 'Warped and water-damaged wood siding on an aging home in Georgia showing visible rot and paint failure',
      caption: 'Water damage and rot behind aging siding is common on Georgia homes built before 2005 — often invisible until a contractor removes the old cladding.'
    },
    sections: [
      {
        h2: '1. Warping or Buckling Panels',
        content: "Georgia's extreme summer heat can cause vinyl siding to warp if not installed correctly. If you notice panels that are no longer flat, it's a sign of thermal stress.",
        image: {
          url: 'https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?w=900',
          alt: 'Warped vinyl siding panels on a home exterior due to heat exposure',
          caption: 'Georgia heat causes vinyl to warp at 95°F+ when improperly installed or of lower quality.'
        }
      },
      {
        h2: '2. Paint Failure and Fading',
        content: "High-quality fiber cement like James Hardie should hold its color for 12+ years. If your paint is peeling or significantly faded before that, it indicates a breakdown in the protective layer.",
      },
      {
        h2: '3. Mold, Mildew, or Fungus',
        content: "Any growth on your siding suggests that moisture is being trapped. This is especially common on north-facing walls in high-humidity areas like Cherokee County.",
      },
      {
        h2: '4. Higher Than Normal Energy Bills',
        content: "Siding acts as your home's second thermal envelope. If your bills are spiking, your siding might no longer be providing the insulation it should.",
      },
      {
        h2: '5. Rotting Wood Around Windows and Doors',
        content: "This is the 'canary in the coal mine.' If the trim is rotting, there is a high probability that moisture is getting behind the siding panels as well.",
      },
      {
        h2: '6. Storm and Hail Damage',
        content: "After a typical Georgia spring storm, check for 'bruising' on your siding. Fiber cement often hides this damage from a distance, but close inspection reveals the impact marks.",
      }
    ],
    faq: [
      { q: "How do I know if I need full replacement or just a repair?", a: "If more than 20% of your panels show signs of damage or rot, a full replacement is usually more cost-effective in the long run." },
      { q: "Can I just paint over warped siding?", a: "No. Warping is a structural failure of the material. Painting will not fix the underlying issue and the new paint will likely fail quickly." }
    ],
    cta: { city: 'Alpharetta', service: 'Siding' },
    metaTitle: "6 Signs to Replace Siding in Georgia | Siding Depot Blog",
    metaDescription: "Is it time for new siding? Learn the 6 warning signs every Georgia homeowner should know, from warping to hidden rot.",
    internalLinks: ['james-hardie-siding-cost-marietta-ga-2026', 'james-hardie-vs-vinyl-siding-georgia-climate']
  },
  {
    slug: 'james-hardie-vs-vinyl-siding-georgia-climate',
    title: 'James Hardie vs Vinyl Siding: The Honest Comparison for Georgia Homeowners',
    excerpt: "Vinyl is cheaper upfront, but Hardie wins in the Georgia climate. See the side-by-side comparison of cost, durability, and ROI.",
    category: 'Buying Guides',
    readTime: 8,
    publishDate: '2026-05-12',
    featured: false,
    heroImage: {
      url: 'https://images.unsplash.com/photo-1604014237800-1c9102c219da?w=1200',
      alt: 'Side-by-side exterior view comparing homes with James Hardie fiber cement siding versus vinyl siding in suburban Georgia neighborhood',
      caption: 'Left: James Hardie HardiePlank in Arctic White with dark trim in Johns Creek. Right: vinyl siding on comparable home — note how vinyl lacks shadow depth.'
    },
    sections: [
      {
        h2: 'Durability in the Georgia Heat',
        content: "While vinyl can warp in the 95°F+ Georgia summers, James Hardie fiber cement is engineered for the HardieZone® HZ10 climate, making it dimensionally stable and fire-resistant.",
      },
      {
        h2: 'Upfront Cost vs. Long-Term Value',
        content: "Vinyl costs roughly $4–$8/sqft installed, while Hardie ranges from $8–$14/sqft. However, the ROI at resale for Hardie is significantly higher, often recouping 80% of the cost.",
        table: {
          headers: ['Feature', 'James Hardie', 'Vinyl Siding'],
          rows: [
            ['Upfront Cost', 'Higher ($$$)', 'Lower ($)'],
            ['Lifespan', '50+ Years', '15–25 Years'],
            ['Fire Resistance', 'Non-combustible', 'Melts/Burns'],
            ['Resale Value', 'High Impact', 'Standard'],
            ['Maintenance', 'Low (Painting)', 'Low (Cleaning)']
          ]
        }
      }
    ],
    faq: [
      { q: "Is James Hardie worth the extra cost in Atlanta?", a: "For homes valued over $400k, yes. It adds significant curb appeal and signals a higher build quality to potential buyers." },
      { q: "Does vinyl siding lower my insurance premiums?", a: "Usually no. In fact, some insurers offer better rates for non-combustible siding like fiber cement." }
    ],
    cta: { city: 'Milton', service: 'Siding' },
    metaTitle: 'James Hardie vs Vinyl Siding Comparison Georgia 2026',
    metaDescription: 'Honest comparison of fiber cement vs vinyl siding for Georgia homes. We look at cost, lifespan, and performance in the North Atlanta climate.',
    internalLinks: ['james-hardie-siding-cost-marietta-ga-2026', '6-signs-time-replace-siding-georgia-home']
  },
  {
    slug: 'board-batten-siding-guide-north-atlanta-2026',
    title: 'Board and Batten Siding in North Atlanta: Styles, Costs, and What HOAs Approve',
    excerpt: "Why the 'Modern Farmhouse' look is exploding in Milton and Alpharetta. Costs, styles, and HOA approval tips for board and batten.",
    category: 'Style Guides',
    readTime: 7,
    publishDate: '2026-05-11',
    featured: false,
    heroImage: {
      url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200',
      alt: 'Modern farmhouse with James Hardie board and batten siding in Urbane Bronze color in Alpharetta Georgia neighborhood',
      caption: 'James Hardie HardiePanel in Cobblestone with board and batten profile on a new construction home in Alpharetta — increasingly popular in HOA communities.'
    },
    sections: [
      {
        h2: 'The Rise of the Modern Farmhouse in Georgia',
        content: "Heavily influenced by HGTV and custom luxury developments in Milton and Canton, the vertical Board and Batten look has become a top choice for upscale North Atlanta renovations.",
      },
      {
        h2: 'Cost of Board and Batten Installation',
        content: "Expect to pay between $9–$13 per square foot installed for James Hardie Board and Batten. This includes the HardiePanel vertical sheets and the HardieTrim batten strips.",
      }
    ],
    faq: [
      { q: "Will my HOA in Alpharetta approve Board and Batten?", a: "Most modern HOAs approve it as long as it's fiber cement and matches the community's color palette. We help with the approval process." }
    ],
    cta: { city: 'Milton', service: 'Siding' },
    metaTitle: 'Board and Batten Siding Guide Alpharetta Milton GA',
    metaDescription: 'Complete guide to Board and Batten siding in North Atlanta. Costs, styles, and how to get HOA approval in Alpharetta and Milton.',
    internalLinks: ['james-hardie-siding-cost-marietta-ga-2026', 'hardie-siding-colors-2026-north-atlanta-homes']
  },
  {
    slug: 'siding-replacement-cost-vs-value-report-atlanta-2026',
    title: 'Siding ROI in Atlanta: What the 2026 Cost vs. Value Report Says for Georgia Homeowners',
    excerpt: "Planning to sell? Learn why siding replacement has one of the highest returns on investment for Atlanta homes in 2026.",
    category: 'Home Value',
    readTime: 6,
    publishDate: '2026-05-10',
    featured: false,
    heroImage: {
      url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200',
      alt: 'Beautiful curb appeal of newly sided home in East Cobb Marietta Georgia showing increased property value through James Hardie installation',
      caption: 'A complete James Hardie re-siding in East Cobb, Marietta — before listing, the owners invested $24,000 and adjusted their asking price up by $38,000.'
    },
    sections: [
      {
        h2: 'The 2026 Cost vs. Value Data for Atlanta',
        content: "According to recent industry data, a fiber cement siding replacement in the Atlanta metro area recoups an average of 80% of its cost at the time of sale.",
      }
    ],
    faq: [
      { q: "Does new siding increase appraisal value?", a: "Yes, significantly. Appraisers look at the 'remaining economic life' of the exterior. New Hardie siding adds decades." }
    ],
    cta: { city: 'Marietta', service: 'Siding' },
    metaTitle: 'Siding ROI Atlanta 2026 Cost vs Value Report',
    metaDescription: 'Discover the real ROI of siding replacement in Atlanta. How new James Hardie siding affects your home value and resale potential.',
    internalLinks: ['james-hardie-siding-cost-marietta-ga-2026', 'hardie-siding-colors-2026-north-atlanta-homes']
  },
  {
    slug: 'hail-damage-siding-insurance-claim-georgia-2026',
    title: "Hail Damaged Your Siding in Georgia? Here's How to File the Claim and What to Expect",
    excerpt: "Don't let storm chasers handle your claim. Learn the proper way to document and file for siding hail damage in Georgia.",
    category: 'Storm Damage',
    readTime: 8,
    publishDate: '2026-05-09',
    featured: false,
    heroImage: {
      url: 'https://images.unsplash.com/photo-1527576539890-dfa815648363?w=1200',
      alt: 'Hail damage visible on fiber cement siding panel showing impact marks from Georgia spring storm in Cobb County neighborhood',
      caption: 'Quarter-sized hail — common in Cobb and Cherokee County between March and June — leaves impact marks on fiber cement that are invisible from ground level.'
    },
    sections: [
      {
        h2: 'Georgia Hail Season: What You Need to Know',
        content: "Peak hail season in North Atlanta runs from March to June. Even if your siding looks fine from the driveway, quarter-sized hail can compromise the integrity of fiber cement and vinyl.",
      }
    ],
    faq: [
      { q: "Does insurance cover full siding replacement for hail?", a: "If the damage is widespread or if the original product is no longer available (discontinued colors/profiles), they often cover full replacement." }
    ],
    cta: { city: 'Canton', service: 'Siding' },
    metaTitle: 'Siding Hail Damage Insurance Claims Georgia 2026',
    metaDescription: 'Step-by-step guide to filing an insurance claim for siding hail damage in Georgia. How to work with adjusters and avoid storm chasers.',
    internalLinks: ['6-signs-time-replace-siding-georgia-home', 'rotten-wood-siding-replacement-georgia-homes']
  },
  {
    slug: 'hardie-siding-colors-2026-north-atlanta-homes',
    title: 'Best James Hardie Siding Colors for North Atlanta Homes in 2026',
    excerpt: "From Boothbay Blue to Iron Gray, see the top performing color palettes for Marietta, Milton, and Alpharetta this year.",
    category: 'Design & Color',
    readTime: 6,
    publishDate: '2026-05-08',
    featured: false,
    heroImage: {
      url: 'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=1200',
      alt: 'Beautiful home exterior with James Hardie siding in Boothbay Blue ColorPlus finish in Alpharetta Georgia showing 2026 color trend',
      caption: 'James Hardie ColorPlus® Boothbay Blue with Navajo Beige trim — one of the top-performing color combinations in Alpharetta and Milton HOA communities in 2026.'
    },
    sections: [
      {
        h2: 'Top 5 Color Trends in Milton & Alpharetta',
        content: "1. Boothbay Blue (Navy) with White Trim. 2. Iron Gray (Deep Charcoal). 3. Arctic White (Classic Modern). 4. Cobblestone (Warm Earthy Gray). 5. Monterey Taupe (Traditional Neutral).",
      }
    ],
    faq: [
      { q: "Are dark siding colors okay for Georgia heat?", a: "Yes, James Hardie's ColorPlus technology is designed to resist UV fading even in the intense Georgia sun." }
    ],
    cta: { city: 'Alpharetta', service: 'Siding' },
    metaTitle: 'James Hardie Siding Colors 2026 North Atlanta',
    metaDescription: 'The most popular James Hardie siding colors for Georgia homes in 2026. See the palettes that HOAs love in Milton and Alpharetta.',
    internalLinks: ['board-batten-siding-guide-north-atlanta-2026', 'exterior-home-design-trends-north-atlanta-2026']
  },
  {
    slug: 'how-long-does-siding-installation-take-georgia',
    title: 'How Long Does Siding Installation Take in Georgia? A Realistic Timeline',
    excerpt: "From permit to final walk-through. Learn what to expect during your siding replacement project timeline.",
    category: 'Project Planning',
    readTime: 5,
    publishDate: '2026-05-07',
    featured: false,
    heroImage: {
      url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200',
      alt: 'Professional siding installation crew working on James Hardie fiber cement siding installation on two-story home in North Atlanta Georgia',
      caption: 'A Siding Depot crew at day 2 of a 5-day James Hardie installation on a 2,400 sq ft home in Canton, GA — tear-off complete, house wrap installed, first courses going up.'
    },
    sections: [
      {
        h2: 'The 5-Day Installation Window',
        content: "For a typical 2,500 sqft home, the actual installation usually takes 5-7 business days, depending on the complexity of the trim and the extent of any discovered wood rot.",
      }
    ],
    faq: [
      { q: "What happens if it rains during installation?", a: "We only tear off what we can dry-in that same day. Your home is never left exposed to the elements overnight." }
    ],
    cta: { city: 'Canton', service: 'Siding' },
    metaTitle: 'Siding Installation Timeline Georgia 2026',
    metaDescription: 'How long does it take to replace siding? A realistic day-by-day guide for Georgia homeowners.',
    internalLinks: ['james-hardie-siding-cost-marietta-ga-2026', 'rotten-wood-siding-replacement-georgia-homes']
  },
  {
    slug: 'rotten-wood-siding-replacement-georgia-homes',
    title: 'Rotten Wood Behind Your Siding: What Georgia Homeowners Must Know Before Signing',
    excerpt: "90% of Georgia homes over 15 years old have hidden rot. Here's how to identify it and what it costs to fix properly.",
    category: 'Home Maintenance',
    readTime: 7,
    publishDate: '2026-05-06',
    featured: false,
    heroImage: {
      url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200',
      alt: 'Exposed OSB sheathing on Georgia home showing rotten wood and moisture damage discovered during siding tear-off in Woodstock',
      caption: 'During a tear-off in Woodstock, GA, our crew found 60+ linear feet of rotten OSB sheathing and rim boards — hidden behind perfectly painted old siding for years.'
    },
    sections: [
      {
        h2: 'The Georgia Rot Problem',
        content: "Because of our high humidity and frequent heavy rains, many homes built between 1990 and 2005 have improper flashing or lacked house wrap, leading to extensive sheathing rot.",
      }
    ],
    faq: [
      { q: "How much does rot replacement cost?", a: "In Georgia, typical rates for OSB sheathing or rim board replacement range from $8–$18 per linear foot." }
    ],
    cta: { city: 'Woodstock', service: 'Siding' },
    metaTitle: 'Rotten Wood Behind Siding Georgia Homeowner Guide',
    metaDescription: 'Hidden rot is the biggest surprise in siding projects. Learn how to spot it and how much it costs to fix in North Atlanta.',
    internalLinks: ['6-signs-time-replace-siding-georgia-home', 'how-long-does-siding-installation-take-georgia']
  },
  {
    slug: 'exterior-home-design-trends-north-atlanta-2026',
    title: "Exterior Home Design Trends for North Atlanta in 2026: What's Selling in Marietta, Milton, and Alpharetta",
    excerpt: "Mixed materials, dark moody colors, and the 'Modern Traditional' aesthetic. See what's trending in Georgia's most upscale neighborhoods.",
    category: 'Design & Color',
    readTime: 6,
    publishDate: '2026-05-05',
    featured: false,
    heroImage: {
      url: 'https://images.unsplash.com/photo-1416331108676-a22ccb276e35?w=1200',
      alt: 'Modern traditional home exterior with mixed materials including James Hardie board and batten and stone veneer in Milton Georgia neighborhood 2026',
      caption: 'Mixed-material exteriors combining fiber cement board and batten with stacked stone veneer are the leading trend in $600k+ homes in Milton and Alpharetta for 2026.'
    },
    sections: [
      {
        h2: 'Top Trends for 2026',
        content: "1. Mixed Materials (Hardie + Stone). 2. Dark Moody Palettes (Iron Gray/Black). 3. Natural Wood Accents (Cedar Soffits). 4. Modern Traditionalism.",
      }
    ],
    faq: [
      { q: "Will trendy colors hurt my resale value?", a: "Not if they are within the James Hardie ColorPlus palette, as these colors are professionally curated for long-term appeal." }
    ],
    cta: { city: 'Alpharetta', service: 'Siding' },
    metaTitle: 'Exterior Design Trends North Atlanta 2026',
    metaDescription: 'What exteriors are trending in Marietta, Milton, and Alpharetta? See the top design picks for 2026.',
    internalLinks: ['hardie-siding-colors-2026-north-atlanta-homes', 'board-batten-siding-guide-north-atlanta-2026']
  }
];
