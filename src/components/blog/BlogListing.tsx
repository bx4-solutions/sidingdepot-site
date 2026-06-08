import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { BLOG_POSTS, BlogPost } from "@/data/blog-posts";
import { Button } from "@/components/ui/button";
import { HeroQuoteForm } from "@/components/site/HeroQuoteForm";
import { Star, ArrowRight, Clock, Calendar, User, Loader2 } from "lucide-react";
import { useBlogPosts } from "@/hooks/use-blog-posts";
import { getOptimizedUnsplashUrl, getUnsplashSrcSet } from "@/utils/image-optimization";

export default function BlogListing() {
  const { posts, loading } = useBlogPosts();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sd-black text-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-sd-green" />
          <p className="font-bold tracking-widest uppercase text-xs">Loading Insights...</p>
        </div>
      </div>
    );
  }

  const publishedPosts = posts.filter((p) => p.status === "published");
  const featuredPost = publishedPosts.find((p) => p.featured) || publishedPosts[0];
  const otherPosts = publishedPosts.filter((p) => p.slug !== featuredPost?.slug);

  return (
    <div className="flex flex-col min-h-screen font-sans">
      {/* Header Section */}
      <section className="bg-sd-black py-24 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-display text-3xl sm:text-5xl md:text-7xl text-white mb-4 tracking-tight uppercase">
            SIDING DEPOT <span className="text-sd-green">INSIGHTS</span>
          </h1>
          <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto font-medium">
            Expert advice from Georgia's most trusted James Hardie contractor — free, no obligation.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-16 w-full">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Content */}
          <div className="flex-1 space-y-20">
            {/* Featured Post - Full Width Hero Card */}
            {featuredPost && (
              <div className="relative group overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 flex flex-col md:flex-row min-h-[450px]">
                <div className="md:w-[55%] relative overflow-hidden bg-gray-100">
                  <img
                    src={getOptimizedUnsplashUrl(featuredPost.heroImage.url, {
                      width: 1200,
                      height: 675,
                    })}
                    srcSet={getUnsplashSrcSet(featuredPost.heroImage.url)}
                    sizes="(max-width: 768px) 100vw, 800px"
                    alt={featuredPost.heroImage.alt}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    width="1200"
                    height="675"
                    decoding="async"
                  />
                  <div className="absolute top-6 left-6">
                    <span className="bg-sd-green text-sd-black text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-full shadow-lg">
                      {featuredPost.category}
                    </span>
                  </div>
                </div>
                <div className="md:w-[45%] p-8 md:p-12 flex flex-col justify-center">
                  <h2 className="text-2xl md:text-3xl font-bold text-sd-black mb-5 leading-tight group-hover:text-sd-green transition-colors">
                    {featuredPost.title}
                  </h2>
                  <p className="text-sd-gray-text line-clamp-3 mb-8 text-lg leading-relaxed">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center gap-6 mb-10 text-[12px] font-bold uppercase tracking-wider text-sd-gray-text/60">
                    <span className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-sd-green" /> {featuredPost.readTime} min read
                    </span>
                    <span className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-sd-green" />{" "}
                      {new Date(featuredPost.publishDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <Button
                    asChild
                    className="w-fit rounded-full bg-sd-green text-sd-black hover:bg-sd-green-hover px-8 py-6 h-auto text-base font-bold transition-all hover:translate-x-1"
                  >
                    <Link to="/blog/$slug" params={{ slug: featuredPost.slug }}>
                      Read Article <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                  </Button>
                </div>
              </div>
            )}

            {/* Grid of Articles - 3 Columns Desktop */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
              {otherPosts.map((post) => (
                <article key={post.slug} className="group flex flex-col">
                  <Link
                    to="/blog/$slug"
                    params={{ slug: post.slug }}
                    className="relative overflow-hidden rounded-xl aspect-[16/9] mb-6 block bg-gray-100 shadow-md"
                  >
                    <img
                      src={getOptimizedUnsplashUrl(post.heroImage.url, { width: 600, height: 338 })}
                      srcSet={getUnsplashSrcSet(post.heroImage.url)}
                      sizes="(max-width: 768px) 100vw, 400px"
                      alt={post.heroImage.alt}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      loading="lazy"
                      decoding="async"
                      width="600"
                      height="338"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-sd-green text-sd-black text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-md">
                        {post.category}
                      </span>
                    </div>
                  </Link>
                  <h3 className="text-xl font-bold text-sd-black mb-3 group-hover:text-sd-green transition-colors leading-snug">
                    <Link to="/blog/$slug" params={{ slug: post.slug }}>
                      {post.title}
                    </Link>
                  </h3>
                  <p className="text-sd-gray-text text-sm line-clamp-2 mb-6 flex-1 leading-relaxed">
                    {post.excerpt}
                  </p>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-6 text-[11px] font-bold uppercase tracking-wider text-sd-gray-text/50 border-t pt-4">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />{" "}
                      {new Date(post.publishDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" /> {post.readTime} min
                    </span>
                    <span className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" /> Team
                    </span>
                  </div>
                  <Link
                    to="/blog/$slug"
                    params={{ slug: post.slug }}
                    className="text-sd-black font-black text-[13px] uppercase tracking-widest flex items-center gap-2 group-hover:text-sd-green transition-all"
                  >
                    Read More{" "}
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </article>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:w-[350px] space-y-12">
            {/* Lead Form - Agency Style */}
            <div className="bg-sd-black p-8 rounded-2xl shadow-2xl border border-white/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-sd-green/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
              <div className="relative z-10 text-white">
                <h3 className="text-2xl font-bold mb-2">Get a Free Estimate</h3>
                <p className="text-sm text-white/60 mb-8 leading-relaxed font-medium">
                  Expert siding advice for Georgia homeowners. No obligation.
                </p>
                <div className="space-y-4">
                  <HeroQuoteForm bare />
                </div>
              </div>
            </div>

            {/* Popular Articles */}
            <div className="space-y-8">
              <h3 className="text-xl font-bold text-sd-black border-b-2 border-sd-green pb-3 inline-block">
                Popular Articles
              </h3>
              <ul className="space-y-6">
                {publishedPosts.slice(0, 5).map((p) => (
                  <li key={p.slug} className="group">
                    <Link
                      to="/blog/$slug"
                      params={{ slug: p.slug }}
                      className="flex gap-4 items-start"
                    >
                      <span className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 shadow-sm">
                        <img
                          src={getOptimizedUnsplashUrl(p.heroImage.url, {
                            width: 160,
                            height: 160,
                          })}
                          alt={p.heroImage.alt}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          loading="lazy"
                          width="80"
                          height="80"
                        />
                      </span>
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-bold text-sd-black group-hover:text-sd-green transition-colors leading-tight line-clamp-2">
                          {p.title}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-sd-gray-text/50">
                          {p.category}
                        </span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Trust Signals */}
            <div className="space-y-8 pt-8 border-t border-gray-100">
              <h3 className="text-[11px] font-bold text-sd-gray-text uppercase tracking-[0.2em] mb-6">
                Our Certifications
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-md transition-all grayscale opacity-70 hover:grayscale-0 hover:opacity-100">
                  <Star className="w-6 h-6 text-sd-black mb-2" />
                  <span className="text-[10px] font-extrabold uppercase tracking-tight text-center">
                    Elite Preferred
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-md transition-all grayscale opacity-70 hover:grayscale-0 hover:opacity-100">
                  <span className="text-lg font-black text-sd-black mb-1">GAF</span>
                  <span className="text-[10px] font-extrabold uppercase tracking-tight text-center">
                    Certified
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-md transition-all grayscale opacity-70 hover:grayscale-0 hover:opacity-100 col-span-2">
                  <span className="text-lg font-black text-sd-black mb-1">BBB A+</span>
                  <span className="text-[10px] font-extrabold uppercase tracking-tight text-center">
                    Accredited Business
                  </span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
