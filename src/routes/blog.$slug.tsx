import { createFileRoute } from "@tanstack/react-router";
import BlogPostDetail from "@/components/blog/BlogPostDetail";
import { BLOG_POSTS } from "@/data/blog-posts";

export const Route = createFileRoute("/blog/$slug")({
  component: BlogPostDetail,
  head: ({ params }) => {
    const post = BLOG_POSTS.find((p) => p.slug === params.slug);
    if (!post) return { title: "Post Not Found | Siding Depot" };
    
    return {
      title: `${post.title} | Siding Depot Blog`,
      meta: [
        { name: "description", content: post.metaDescription },
        { property: "og:title", content: post.metaTitle },
        { property: "og:description", content: post.metaDescription },
        { property: "og:image", content: post.heroImage.url },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": post.title,
            "description": post.excerpt,
            "image": post.heroImage.url,
            "author": {
              "@type": "Organization",
              "name": "Siding Depot Team"
            },
            "publisher": {
              "@type": "Organization",
              "name": "Siding Depot LLC",
              "logo": {
                "@type": "ImageObject",
                "url": "https://sidingdepot.com/logo.png"
              }
            },
            "datePublished": post.publishDate,
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": `https://sidingdepot.com/blog/${post.slug}`
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
        }
      ]
    };
  },
});
