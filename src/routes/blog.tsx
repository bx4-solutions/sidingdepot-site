import { createFileRoute } from "@tanstack/react-router";
import BlogListing from "@/components/blog/BlogListing";
import { BLOG_POSTS } from "@/data/blog-posts";


export const Route = createFileRoute("/blog")({
  component: BlogListing,
  head: () => ({
    meta: [
      { title: "Expert Siding Blog | Marietta & North Atlanta Siding Insights | Siding Depot" },
      { 
        name: "description", 
        content: "Expert advice on James Hardie siding installation, cost guides, and home exterior maintenance for Marietta, Alpharetta, and North Atlanta homeowners." 
      },
      { property: "og:title", content: "Expert Siding Blog | Siding Depot" },
      { property: "og:description", content: "Expert advice on siding installation, cost guides, and maintenance for North Atlanta homeowners." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://sidingdepot.com/blog" },
    ],
  }),

});
