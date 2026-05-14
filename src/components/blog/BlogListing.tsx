import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { BLOG_POSTS, BlogPost } from "@/data/blog-posts";
import { Button } from "@/components/ui/button";
import { HeroQuoteForm } from "@/components/site/HeroQuoteForm";
import { Star, ArrowRight, Clock, Calendar, User, Loader2 } from "lucide-react";
import { useBlogPosts } from "@/hooks/use-blog-posts";

export default function BlogListing() {
  const { posts, loading } = useBlogPosts();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sd-navy text-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-sd-green" />
          <p className="font-bold tracking-widest uppercase text-xs">Loading Insights...</p>
        </div>
      </div>
    );
  }

  const publishedPosts = posts.filter(p => p.status === 'published');
  const featuredPost = publishedPosts.find(p => p.featured) || publishedPosts[0];
  const otherPosts = publishedPosts.filter(p => p.slug !== featuredPost?.slug);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <section className="bg-sd-navy py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-display text-5xl md:text-6xl text-white mb-4 tracking-tight uppercase">
            Siding Depot <span className="text-sd-green">Insights</span>
          </h1>
          <p className="text-lg md:text-xl text-white/65 max-w-2xl mx-auto font-medium">
            Expert advice from Georgia's most trusted James Hardie contractor — free, no obligation.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-16 w-full">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Content */}
          <div className="flex-1 space-y-16">
            {/* Featured Post */}
            {featuredPost && (
              <div className="relative group overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-black/5 flex flex-col md:flex-row">
                <div className="md:w-[55%] relative overflow-hidden h-[300px] md:h-auto">
                  <img 
                    src={featuredPost.heroImage.url} 
                    alt={featuredPost.heroImage.alt}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-sd-green text-sd-black text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">
                      {featuredPost.category}
                    </span>
                  </div>
                </div>
                <div className="md:w-[45%] p-8 md:p-10 flex flex-col justify-center">
                  <h2 className="text-2xl md:text-3xl font-bold text-sd-navy mb-4 leading-tight">
                    {featuredPost.title}
                  </h2>
                  <p className="text-sd-gray-text line-clamp-3 mb-6 leading-relaxed">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center gap-4 mb-8 text-[12px] font-medium text-sd-gray-text/80">
                    <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {featuredPost.readTime} min read</span>
                    <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {new Date(featuredPost.publishDate).toLocaleDateString()}</span>
                  </div>
                  <Button asChild className="w-fit rounded-full bg-sd-green text-sd-black hover:bg-sd-green/90">
                    <Link to="/blog/$slug" params={{ slug: featuredPost.slug }}>
                      Read Article <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            )}

            {/* Grid of Articles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {otherPosts.map((post) => (
                <article key={post.slug} className="group flex flex-col">
                  <Link to="/blog/$slug" params={{ slug: post.slug }} className="relative overflow-hidden rounded-xl aspect-[16/9] mb-6 block">
                    <img 
                      src={post.heroImage.url} 
                      alt={post.heroImage.alt}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="bg-sd-green text-sd-black text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">
                        {post.category}
                      </span>
                    </div>
                  </Link>
                  <h3 className="text-xl font-bold text-sd-navy mb-3 group-hover:text-sd-green transition-colors">
                    <Link to="/blog/$slug" params={{ slug: post.slug }}>
                      {post.title}
                    </Link>
                  </h3>
                  <p className="text-sd-gray-text text-sm line-clamp-2 mb-4 flex-1">
                    {post.excerpt}
                  </p>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4 text-[11px] font-medium text-sd-gray-text/70">
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {new Date(post.publishDate).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {post.readTime} min read</span>
                    <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> Siding Depot Team</span>
                  </div>
                  <Link 
                    to="/blog/$slug" 
                    params={{ slug: post.slug }}
                    className="text-sd-navy font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all"
                  >
                    Read More <ArrowRight className="w-4 h-4" />
                  </Link>
                </article>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:w-[350px] space-y-10">
            {/* Lead Form */}
            <div className="bg-sd-navy p-8 rounded-2xl shadow-xl border border-white/5 relative overflow-hidden">
              <div className="relative z-10 text-white">
                <h3 className="text-xl font-bold mb-2">Get a Free Estimate</h3>
                <p className="text-sm text-white/70 mb-6">Expert siding consultation in North Atlanta.</p>
                <HeroQuoteForm bare />
              </div>
            </div>

            {/* Popular Articles */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-sd-navy border-b pb-2">Popular Articles</h3>
              <ul className="space-y-4">
                {BLOG_POSTS.slice(0, 5).map(p => (
                  <li key={p.slug}>
                    <Link 
                      to="/blog/$slug" 
                      params={{ slug: p.slug }}
                      className="text-sm font-medium text-sd-gray-text hover:text-sd-green transition-colors flex gap-3"
                    >
                      <span className="w-12 h-12 flex-shrink-0 rounded overflow-hidden">
                        <img src={p.heroImage.url} alt={p.heroImage.alt} className="w-full h-full object-cover" />
                      </span>
                      <span className="line-clamp-2 leading-snug">{p.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Certifications */}
            <div className="space-y-6 pt-4 border-t">
              <h3 className="text-[11px] font-bold text-sd-gray-text uppercase tracking-widest">Our Credentials</h3>
              <div className="grid grid-cols-2 gap-4 opacity-70 grayscale">
                <div className="text-center p-3 rounded-lg border flex flex-col items-center justify-center">
                   <Star className="w-5 h-5 text-sd-navy mb-1" />
                   <span className="text-[9px] font-bold leading-tight">Elite Preferred</span>
                </div>
                <div className="text-center p-3 rounded-lg border flex flex-col items-center justify-center">
                   <span className="text-sm font-bold text-sd-navy leading-tight">GAF</span>
                   <span className="text-[9px] font-bold leading-tight">Certified</span>
                </div>
                <div className="text-center p-3 rounded-lg border flex flex-col items-center justify-center col-span-2">
                   <span className="text-sm font-bold text-sd-navy leading-tight">BBB</span>
                   <span className="text-[9px] font-bold leading-tight">A+ Accredited</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
