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
  }
];
