import { createFileRoute } from "@tanstack/react-router";
import BlogListing from "@/components/blog/BlogListing";
import { BLOG_POSTS } from "@/data/blog-posts";


export const Route = createFileRoute("/blog/")({
  component: BlogListing,
  head: () => {
    const publishedPosts = BLOG_POSTS.filter(p => p.status === 'published');
    
    return {
      title: "Expert Siding Blog | Marietta & North Atlanta | Siding Depot",
      meta: [
        { 
          name: "description", 
          content: "Expert advice on James Hardie siding, cost guides, and exterior maintenance for Marietta, Alpharetta, and North Atlanta homeowners." 
        },
        { name: "keywords", content: "siding marietta, james hardie siding atlanta, siding cost georgia, siding replacement marietta" },
        { property: "og:title", content: "Expert Siding Blog | Siding Depot" },
        { property: "og:description", content: "Expert advice on siding installation, cost guides, and maintenance for North Atlanta homeowners." },
        { property: "og:type", content: "website" },
        { property: "og:url", content: "https://sidingdepot.com/blog" },
        { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/43cab0b0-cb06-42f1-a067-d5f0523e2835" },
      ],
      links: [
        { rel: "canonical", href: "https://sidingdepot.com/blog" },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            "name": "Siding Depot Insights",
            "description": "Expert advice on James Hardie siding, painting, and home exterior projects in North Atlanta.",
            "url": "https://sidingdepot.com/blog",
            "publisher": {
              "@type": "Organization",
              "name": "Siding Depot",
              "logo": {
                "@type": "ImageObject",
                "url": "https://sidingdepot.com/logo.png"
              }
            },
            "blogPost": publishedPosts.map(post => ({
              "@type": "BlogPosting",
              "headline": post.title,
              "description": post.excerpt,
              "url": `https://sidingdepot.com/blog/${post.slug}`,
              "datePublished": post.publishDate,
              "author": {
                "@type": "Organization",
                "name": "Siding Depot Team"
              }
            }))
          })
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://sidingdepot.com/"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Blog",
                "item": "https://sidingdepot.com/blog"
              }
            ]
          })
        }
      ]
    };
  },


});
