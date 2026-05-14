import { useParams, Link, useSearch } from "@tanstack/react-router";
import { BLOG_POSTS, BlogPost } from "@/data/blog-posts";
import { Button } from "@/components/ui/button";
import { HeroQuoteForm } from "@/components/site/HeroQuoteForm";
import { ArrowRight, Clock, Calendar, User, ChevronRight, Eye, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useBlogPosts } from "@/hooks/use-blog-posts";
import { getOptimizedUnsplashUrl, getUnsplashSrcSet } from "@/utils/image-optimization";


export default function BlogPostDetail() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { slug } = useParams({ from: "/blog/$slug" });
  const search = useSearch({ from: "/blog/$slug" });
  const isPreview = search.preview === true;
  
  const { posts, loading } = useBlogPosts();
  const post = posts.find((p: BlogPost) => p.slug === slug);

  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (!post) return;
    const handleScroll = () => {
      const headings = document.querySelectorAll("h2[id]");
      let currentId = "";
      headings.forEach((h) => {
        const top = h.getBoundingClientRect().top;
        if (top < 150) currentId = h.id;
      });
      setActiveId(currentId);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [post]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-8 h-8 animate-spin text-sd-navy" />
      </div>
    );
  }

  if (!post || (post.status === 'draft' && !isPreview)) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-3xl font-bold mb-4 text-sd-navy">
          {!post ? "Post not found" : "This article is still a draft"}
        </h1>
        <p className="text-sd-gray-text mb-8 max-w-md">
          {!post 
            ? "The page you are looking for doesn't exist or has been moved." 
            : "This article hasn't been published yet. Check back soon for expert siding insights!"}
        </p>
        <Button asChild className="bg-sd-navy hover:bg-sd-navy/90 text-white rounded-full px-8">
          <Link to="/blog">Back to Blog</Link>
        </Button>
      </div>
    );
  }

  const relatedPosts = BLOG_POSTS.filter((p) => post.internalLinks.includes(p.slug) && p.status === 'published');

  return (
    <div className="bg-white min-h-screen">
      {isPreview && (
        <div className="bg-amber-50 border-b border-amber-200 py-3 px-4 sticky top-0 z-[60]">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-800 font-medium">
              <Eye className="w-4 h-4" />
              <span>Preview Mode: Viewing "{post.status}" version</span>
            </div>
            <Button asChild variant="outline" size="sm" className="bg-white border-amber-200 text-amber-800 hover:bg-amber-100 h-8">
              <Link to="/admin/blog-preview">Back to Admin</Link>
            </Button>
          </div>
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-medium text-sd-gray-text mb-8">
          <Link to="/" className="hover:text-sd-navy">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/blog" className="hover:text-sd-navy">Blog</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-sd-navy">{post.category}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Article Content */}
          <article className="lg:w-[65%]">
            <header className="mb-10">
              <span className="inline-block bg-sd-green text-sd-black text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6">
                {post.category}
              </span>
              <h1 className="text-3xl md:text-5xl font-bold text-sd-navy leading-[1.1] mb-6">
                {post.title}
              </h1>
              <p className="text-xl italic text-sd-gray-text leading-relaxed mb-8">
                {post.excerpt}
              </p>
              <div className="flex items-center gap-6 text-sm text-sd-gray-text border-y py-4 border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-sd-navy flex items-center justify-center text-white text-[10px] font-bold">SD</div>
                  <span className="font-semibold text-sd-navy">By Siding Depot Team</span>
                </div>
                <div className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {new Date(post.publishDate).toLocaleDateString()}</div>
                <div className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {post.readTime} min read</div>
              </div>
            </header>

            <div className="mb-12 rounded-2xl overflow-hidden shadow-lg">
              <img 
                src={post.heroImage.url} 
                alt={post.heroImage.alt}
                className="w-full h-auto aspect-[16/9] object-cover"
              />
              <div className="bg-gray-50 px-6 py-3 border-t border-gray-100">
                <p className="text-[13px] italic text-sd-gray-text text-center">{post.heroImage.caption}</p>
              </div>
            </div>

            <div className="prose prose-lg max-w-none prose-headings:text-sd-navy prose-h2:border-l-[3px] prose-h2:border-sd-green prose-h2:pl-4 prose-p:text-sd-gray-text prose-p:leading-[1.8] prose-p:text-lg">
              {post.sections.map((section: any, idx: number) => {
                const sectionId = section.h2.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
                
                // Helper to render content with internal links
                const renderContent = (content: string) => {
                  const parts = content.split(/(\[.*?\]\(.*?\))/g);
                  return parts.map((part, i) => {
                    const match = part.match(/\[(.*?)\]\((.*?)\)/);
                    if (match) {
                      const [_, text, url] = match;
                      const isInternal = url.startsWith('/blog/');
                      if (isInternal) {
                        return <Link key={i} to={url as any} className="text-sd-green font-bold hover:underline">{text}</Link>;
                      }
                      return <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="text-sd-green font-bold hover:underline">{text}</a>;
                    }
                    return part;
                  });
                };

                return (
                  <div key={idx} className="mb-12">
                    <h2 id={sectionId} className="text-2xl font-bold mb-6 pt-4">
                      {section.h2}
                    </h2>
                    <div className="mb-6 whitespace-pre-wrap">{renderContent(section.content)}</div>

                    {section.table && (
                      <div className="overflow-x-auto my-8 rounded-xl border border-gray-100 shadow-sm">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-sd-navy text-white">
                            <tr>
                              {section.table.headers.map((header: string, i: number) => (
                                <th key={i} className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">
                                  {header}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-100">
                            {section.table.rows.map((row: string[], i: number) => (
                              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-sd-gray-light/30"}>
                                {row.map((cell: string, j: number) => (
                                  <th key={j} className="px-6 py-4 text-sm font-medium text-sd-gray-text">
                                    {cell}
                                  </th>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {section.pullQuote && (
                      <div className="my-10 bg-sd-gray-light/30 border-l-[4px] border-sd-green p-8 rounded-r-2xl">
                        <p className="text-xl font-bold text-sd-navy italic leading-relaxed">
                          "{section.pullQuote}"
                        </p>
                      </div>
                    )}

                    {section.image && (
                      <figure className="my-10 rounded-2xl overflow-hidden shadow-md">
                        <img src={section.image.url} alt={section.image.alt} className="w-full h-auto" />
                        <figcaption className="bg-gray-50 px-6 py-3 text-[13px] italic text-sd-gray-text text-center border-t border-gray-100">
                          {section.image.caption}
                        </figcaption>
                      </figure>
                    )}

                    {/* Inline CTA after 3rd section (or at least somewhere in the middle) */}
                    {idx === 1 && (
                      <div className="my-12 bg-sd-navy p-10 rounded-2xl text-white text-center shadow-xl">
                        <h3 className="text-2xl font-bold mb-4">Getting quotes for your home?</h3>
                        <p className="text-lg text-white/80 mb-8">We respond within 24 hours. No obligation.</p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                           <a href="tel:6784002012" className="text-2xl font-bold text-sd-green hover:text-white transition-colors">
                             (678) 400-2012
                           </a>
                           <Button asChild size="lg" className="bg-sd-green text-sd-black hover:bg-sd-green/90 rounded-full font-bold px-8">
                             <Link to="/contact">Get Free Estimate</Link>
                           </Button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* FAQ Section */}
            {post.faq.length > 0 && (
              <section className="mt-16 pt-16 border-t border-gray-100">
                <h2 className="text-3xl font-bold text-sd-navy mb-8">Frequently Asked Questions</h2>
                <div className="space-y-6">
                  {post.faq.map((item: { q: string, a: string }, idx: number) => (
                    <div key={idx} className="bg-sd-gray-light/20 p-6 rounded-xl border border-gray-100">
                      <h4 className="font-bold text-lg text-sd-navy mb-3">{item.q}</h4>
                      <p className="text-sd-gray-text leading-relaxed">{item.a}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Final CTA */}
            <div className="mt-20 bg-sd-green p-12 rounded-3xl text-center shadow-xl">
              <h2 className="text-3xl md:text-4xl font-bold text-sd-black mb-4">Ready for Your Free Estimate?</h2>
              <p className="text-xl text-sd-black/80 mb-8 max-w-xl mx-auto font-medium">
                Our team is standing by to measure your home and provide a detailed written proposal.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button asChild size="lg" className="w-full sm:w-auto rounded-full bg-sd-navy text-white hover:bg-sd-navy/90 text-lg px-10">
                  <Link to="/contact">Get Started Now</Link>
                </Button>
                <a href="tel:6784002012" className="text-xl font-bold text-sd-navy py-3 px-6">
                  Call (678) 400-2012
                </a>
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:w-[35%] relative">
            <div className="sticky top-24 space-y-10">
              {/* Quote Form */}
              <div className="bg-sd-navy p-8 rounded-2xl shadow-xl border border-white/5">
                <h3 className="text-xl font-bold text-white mb-2">Get Your Quote</h3>
                <p className="text-white/60 text-sm mb-6 font-medium">Fast, friendly service since 2014.</p>
                <HeroQuoteForm bare />
              </div>

              {/* Table of Contents */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-sd-navy mb-6 border-b pb-2">In This Article</h3>
                <ul className="space-y-4">
                  {post.sections.map((section: any, idx: number) => {
                    const sectionId = section.h2.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
                    return (
                      <li key={idx}>
                        <a 
                          href={`#${sectionId}`}
                          className={`text-sm font-medium transition-colors block border-l-2 pl-4 ${
                            activeId === sectionId ? "text-sd-green border-sd-green" : "text-sd-gray-text border-transparent hover:text-sd-navy"
                          }`}
                        >
                          {section.h2}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Related Articles */}
              {relatedPosts.length > 0 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-sd-navy border-b pb-2">Related Articles</h3>
                  <div className="space-y-6">
                    {relatedPosts.map((p: BlogPost) => (
                      <Link 
                        key={p.slug} 
                        to="/blog/$slug" 
                        params={{ slug: p.slug }}
                        className="group flex gap-4"
                      >
                        <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 shadow-sm">
                          <img src={p.heroImage.url} alt={p.heroImage.alt} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div className="flex flex-col justify-center">
                          <h4 className="text-sm font-bold text-sd-navy group-hover:text-sd-green transition-colors leading-snug line-clamp-2">
                            {p.title}
                          </h4>
                          <span className="text-[11px] font-medium text-sd-gray-text mt-1">{p.readTime} min read</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
