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

    // Drafts may be viewed through the explicit preview flow, but must never be
    // eligible for indexing or public article metadata before publication.
    if (post.status !== "published") {
      return {
        title: `${post.title} | Draft | Siding Depot`,
        meta: [{ name: "robots", content: "noindex, nofollow" }],
      };
    }

    const canonicalUrl = `https://www.sidingdepot.com/blog/${post.slug}`;

    return {
      title: post.metaTitle,
      meta: [
        { name: "description", content: post.metaDescription },
        // Open Graph / Facebook
        { property: "og:title", content: post.metaTitle },
        { property: "og:description", content: post.metaDescription },
        {
          property: "og:image",
          content: getOptimizedUnsplashUrl(post.heroImage.url, { width: 1200, height: 630 }),
        },
        { property: "og:image:alt", content: post.heroImage.alt },
        { property: "og:url", content: canonicalUrl },
        { property: "og:type", content: "article" },
        { property: "og:site_name", content: "Siding Depot" },
        { property: "article:published_time", content: post.publishDate },
        { property: "article:author", content: "Siding Depot Team" },
        { property: "article:section", content: post.category },

        // Twitter Card
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: post.metaTitle },
        { name: "twitter:description", content: post.metaDescription },
        {
          name: "twitter:image",
          content: getOptimizedUnsplashUrl(post.heroImage.url, { width: 1200, height: 630 }),
        },
      ],
      links: [{ rel: "canonical", href: canonicalUrl }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.excerpt,
            image: [getOptimizedUnsplashUrl(post.heroImage.url, { width: 1200, height: 675 })],
            wordCount: post.sections.reduce(
              (acc, section) => acc + section.content.split(/\s+/).length,
              0,
            ),
            datePublished: `${post.publishDate}T09:00:00-04:00`,
            dateModified: `${(post as any).modifiedDate ?? post.publishDate}T09:00:00-04:00`,
            author: {
              "@type": "Person",
              name: "Siding Depot Editorial Team",
              url: "https://www.sidingdepot.com/about",
            },
            publisher: {
              "@type": "Organization",
              name: "Siding Depot LLC",
              logo: {
                "@type": "ImageObject",
                url: "https://www.sidingdepot.com/logo.png",
              },
            },
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": canonicalUrl,
            },
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: post.faq.map((item) => ({
              "@type": "Question",
              name: item.q,
              acceptedAnswer: {
                "@type": "Answer",
                text: item.a,
              },
            })),
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://www.sidingdepot.com",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Blog",
                item: "https://www.sidingdepot.com/blog",
              },
              {
                "@type": "ListItem",
                position: 3,
                name: post.title,
                item: canonicalUrl,
              },
            ],
          }),
        },
      ],
    };
  },
});
