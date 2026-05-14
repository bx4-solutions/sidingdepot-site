import { createFileRoute } from "@tanstack/react-router";
import BlogListing from "@/components/blog/BlogListing";

export const Route = createFileRoute("/blog")({
  component: BlogListing,
  head: () => ({
    meta: [
      { title: "Siding Depot Insights | Georgia's Trusted Siding Blog" },
      { 
        name: "description", 
        content: "Expert siding, painting, and home exterior advice for homeowners in Marietta, Alpharetta, Milton, and across North Atlanta." 
      },
    ],
  }),
});
