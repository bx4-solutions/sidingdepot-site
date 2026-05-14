import { createFileRoute } from "@tanstack/react-router";
import BlogPostDetail from "@/components/blog/BlogPostDetail";
import { BLOG_POSTS } from "@/data/blog-posts";
import { z } from "zod";
import { getOptimizedUnsplashUrl } from "@/utils/image-optimization";


const blogSearchSchema = z.object({
  preview: z.boolean().optional(),
});

export const Route = createFileRoute("/blog/$slug")({
  validateSearch: (search) => blogSearchSchema.parse(search),
  component: BlogPostDetail,
  head: ({ params }) => {
    const post = BLOG_POSTS.find((p) => p.slug === params.slug);
    if (!post) return { title: "Post Not Found | Siding Depot" };
    
    const canonicalUrl = `https://sidingdepot.com/blog/${post.slug}`;
    
    return {
      title: post.metaTitle,
      meta: [
        { name: "description", content: post.metaDescription },
        { property: "og:title", content: post.metaTitle },
        { property: "og:description", content: post.metaDescription },
        { property: "og:image", content: post.heroImage.url },
        { property: "og:url", content: canonicalUrl },
        { property: "og:type", content: "article" },
        { property: "og:site_name", content: "Siding Depot" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: post.metaTitle },
        { name: "twitter:description", content: post.metaDescription },
        { name: "twitter:image", content: post.heroImage.url },
        { rel: "canonical", href: canonicalUrl },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": post.title,
            "description": post.excerpt,
            "image": post.heroImage.url,
            "datePublished": post.publishDate,
            "dateModified": post.publishDate,
            "author": {
              "@type": "Organization",
              "name": "Siding Depot Team",
              "url": "https://sidingdepot.com"
            },
            "publisher": {
              "@type": "Organization",
              "name": "Siding Depot LLC",
              "logo": {
                "@type": "ImageObject",
                "url": "https://sidingdepot.com/logo.png"
              }
            },
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": canonicalUrl
            }
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": post.faq.map(item => ({
              "@type": "Question",
              "name": item.q,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": item.a
              }
            }))
          }),
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
                "item": "https://sidingdepot.com"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Blog",
                "item": "https://sidingdepot.com/blog"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": post.title,
                "item": canonicalUrl
              }
            ]
          }),
        }
      ]
    };
  },
});
