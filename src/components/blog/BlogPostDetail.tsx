import { useParams, Link, useSearch } from "@tanstack/react-router";
import { BLOG_POSTS, BlogPost } from "@/data/blog-posts";
import { Button } from "@/components/ui/button";
import { HeroQuoteForm } from "@/components/site/HeroQuoteForm";
import { ArrowRight, Clock, Calendar, User, ChevronRight, Eye } from "lucide-react";
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
  
  // Important: We use BLOG_POSTS directly for initial render to avoid flicker,
  // then use hook data to handle draft/published status from DB
  const { posts } = useBlogPosts();
  const post = posts.find((p: BlogPost) => p.slug === slug) || BLOG_POSTS.find((p) => p.slug === slug);

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
    <div className="bg-white min-h-screen font-sans">
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
        {/* Breadcrumb - Premium Styling */}
        <nav className="flex items-center flex-wrap gap-2 text-[11px] font-bold uppercase tracking-widest text-sd-gray-text/60 mb-12" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-sd-navy transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/blog" className="hover:text-sd-navy transition-colors">Blog</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-sd-green">{post.category}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-16">
          {/* Main Article Content */}
          <article className="lg:w-[65%]">
            <header className="mb-12">
              <span className="inline-block bg-[#8DC63F] text-sd-black text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-8 shadow-sm">
                {post.category}
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-[44px] font-bold text-sd-navy leading-tight mb-8">
                {post.title}
              </h1>
              <p className="text-xl italic text-sd-gray-text/80 leading-relaxed mb-10 border-l-4 border-[#8DC63F] pl-6 py-2">
                {post.excerpt}
              </p>
              
              <div className="flex items-center gap-8 text-[12px] font-bold uppercase tracking-wider text-sd-gray-text/60 border-y py-6 border-gray-100 mb-12">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-sd-navy flex items-center justify-center text-white text-[10px] font-black border-2 border-sd-green">SD</div>
                  <div className="flex flex-col">
                    <span className="text-sd-navy font-black tracking-normal">Siding Depot Team</span>
                    <span className="text-[10px] lowercase font-medium tracking-normal opacity-70">Editorial Staff</span>
                  </div>
                </div>
                <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-[#8DC63F]" /> {new Date(post.publishDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
                <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-[#8DC63F]" /> {post.readTime} min read</div>
              </div>

              {/* Hero Image with Semantic Caption */}
              <div className="mb-16 rounded-3xl overflow-hidden shadow-2xl bg-gray-100 ring-1 ring-black/5">
                <img 
                  src={getOptimizedUnsplashUrl(post.heroImage.url, { width: 1200, height: 675 })} 
                  srcSet={getUnsplashSrcSet(post.heroImage.url)}
                  sizes="(max-width: 1024px) 100vw, 800px"
                  alt={post.heroImage.alt}
                  className="w-full h-auto aspect-[16/9] object-cover"
                  width="1200"
                  height="675"
                  decoding="async"
                  fetchPriority="high"
                  loading="eager"
                />
                <div className="bg-[#F8FAFC] px-8 py-5 border-t border-gray-100 italic text-[13px] text-sd-gray-text text-center leading-relaxed">
                  {post.heroImage.caption}
                </div>
              </div>
            </header>
            
            <div className="prose prose-lg max-w-none prose-headings:text-sd-navy prose-h2:text-[28px] prose-h2:font-bold prose-h2:border-l-[4px] prose-h2:border-[#8DC63F] prose-h2:pl-6 prose-h2:mb-8 prose-h2:mt-16 prose-h3:text-[22px] prose-h3:font-bold prose-p:text-sd-gray-text prose-p:leading-[1.8] prose-p:text-lg prose-p:mb-8 prose-li:text-sd-gray-text prose-li:text-lg prose-table:rounded-xl prose-table:overflow-hidden prose-th:bg-sd-navy prose-th:text-white prose-th:px-6 prose-th:py-4 prose-td:px-6 prose-td:py-4">
              {post.sections.map((section: any, idx: number) => {
                const sectionId = section.h2.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
                
                const renderContent = (content: string) => {
                  const parts = content.split(/(\[.*?\]\(.*?\))/g);
                  return parts.map((part, i) => {
                    const match = part.match(/\[(.*?)\]\((.*?)\)/);
                    if (match) {
                      const [_, text, url] = match;
                      const isInternal = url.startsWith('/blog/');
                      if (isInternal) {
                        return <Link key={i} to={url as any} className="text-[#8DC63F] font-bold hover:underline">{text}</Link>;
                      }
                      return <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="text-[#8DC63F] font-bold hover:underline">{text}</a>;
                    }
                    return part;
                  });
                };

                return (
                  <div key={idx} className="mb-16">
                    <h2 id={sectionId} className="scroll-mt-24">
                      {section.h2}
                    </h2>
                    <div className="mb-10 whitespace-pre-wrap">{renderContent(section.content)}</div>

                    {section.table && (
                      <div className="overflow-x-auto my-12 rounded-xl border border-gray-200 shadow-xl bg-white">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-[#1E2A38] text-white">
                            <tr>
                              {section.table.headers.map((header: string, i: number) => (
                                <th key={i} className="px-6 py-5 text-left text-[11px] font-black uppercase tracking-[0.1em]">
                                  {header}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {section.table.rows.map((row: string[], i: number) => (
                              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-[#F4F7FA]"}>
                                {row.map((cell: string, j: number) => (
                                  <td key={j} className="px-6 py-5 text-[15px] font-medium text-sd-gray-text">
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {section.pullQuote && (
                      <div className="my-12 bg-[#F4F7FA] border-l-[6px] border-[#8DC63F] p-10 rounded-r-3xl shadow-sm">
                        <p className="text-2xl font-bold text-sd-navy italic leading-relaxed">
                          "{section.pullQuote}"
                        </p>
                      </div>
                    )}

                    {section.image && (
                      <figure className="my-16 rounded-2xl overflow-hidden shadow-2xl bg-gray-100 ring-1 ring-black/5">
                        <img 
                          src={getOptimizedUnsplashUrl(section.image.url, { width: 1000, height: 600 })} 
                          srcSet={getUnsplashSrcSet(section.image.url)}
                          sizes="(max-width: 1024px) 100vw, 800px"
                          alt={section.image.alt} 
                          className="w-full h-auto"
                          loading="lazy"
                          decoding="async"
                          width="1000"
                          height="600"
                        />
                        <figcaption className="bg-[#F8FAFC] px-8 py-4 text-[13px] italic text-sd-gray-text text-center border-t border-gray-100 leading-relaxed">
                          {section.image.caption}
                        </figcaption>
                      </figure>
                    )}

                    {/* Inline CTA after 2nd section (roughly the middle) */}
                    {idx === 1 && (
                      <div className="my-20 bg-[#1E2A38] p-12 rounded-3xl text-white text-center shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-1 bg-[#8DC63F]"></div>
                        <h3 className="text-2xl md:text-3xl font-bold mb-4">Getting quotes for your home?</h3>
                        <p className="text-lg text-white/70 mb-10 font-medium">We respond within 24 hours. No high-pressure sales.</p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
                           <a href="tel:6784002012" className="text-3xl font-black text-[#8DC63F] hover:text-white transition-all transform hover:scale-105">
                             (678) 400-2012
                           </a>
                           <Button asChild size="lg" className="bg-[#8DC63F] text-sd-black hover:bg-[#8DC63F]/90 rounded-full font-black px-10 py-7 h-auto text-base transition-all hover:translate-y-[-2px] hover:shadow-lg shadow-[#8DC63F]/20">
                             <Link to="/contact">Get Free Estimate</Link>
                           </Button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* FAQ Section with Premium Accordion Styling */}
            {post.faq.length > 0 && (
              <section className="mt-24 pt-24 border-t border-gray-100">
                <div className="flex items-center gap-4 mb-12">
                  <div className="w-2 h-10 bg-[#8DC63F] rounded-full"></div>
                  <h2 className="text-3xl font-bold text-sd-navy m-0">Frequently Asked Questions</h2>
                </div>
                <div className="space-y-6">
                  {post.faq.map((item: { q: string, a: string }, idx: number) => (
                    <div key={idx} className="bg-[#F4F7FA] p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                      <h4 className="font-bold text-xl text-sd-navy mb-4 leading-snug flex gap-4">
                        <span className="text-[#8DC63F]">Q.</span>
                        {item.q}
                      </h4>
                      <p className="text-sd-gray-text leading-[1.8] text-lg pl-8">{item.a}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Final Conversion CTA */}
            <div className="mt-24 bg-[#8DC63F] p-16 rounded-[40px] text-center shadow-2xl relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-4xl md:text-5xl font-black text-sd-black mb-6 leading-tight">Ready for Your Free Estimate?</h2>
                <p className="text-xl text-sd-black/70 mb-12 max-w-2xl mx-auto font-bold leading-relaxed">
                  Join 1,000+ happy Georgia homeowners. Professional measurement and detailed written proposal within 48 hours.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  <Button asChild size="lg" className="w-full sm:w-auto rounded-full bg-[#1E2A38] text-white hover:bg-sd-navy/90 text-lg px-12 py-8 h-auto font-black shadow-xl">
                    <Link to="/contact">Get Started Now</Link>
                  </Button>
                  <a href="tel:6784002012" className="text-2xl font-black text-[#1E2A38] py-4 px-8 hover:opacity-80 transition-opacity">
                    Call (678) 400-2012
                  </a>
                </div>
              </div>
            </div>
          </article>

          {/* Sidebar - Sticky Agency Style */}
          <aside className="lg:w-[35%]">
            <div className="sticky top-24 space-y-12">
              {/* Quote Form - High Impact */}
              <div className="bg-[#1E2A38] p-10 rounded-[32px] shadow-2xl border border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-sd-green/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                <h3 className="text-2xl font-bold text-white mb-2">Get Your Quote</h3>
                <p className="text-white/50 text-sm mb-8 font-bold uppercase tracking-widest">Free Consultation</p>
                <HeroQuoteForm bare />
              </div>

              {/* Table of Contents - ScrollSpy Style */}
              <div className="bg-white p-10 rounded-[32px] shadow-sm border border-gray-100 ring-1 ring-black/[0.02]">
                <h3 className="text-xl font-bold text-sd-navy mb-8 flex items-center gap-3">
                   <div className="w-1.5 h-6 bg-[#8DC63F] rounded-full"></div>
                   In This Article
                </h3>
                <ul className="space-y-6">
                  {post.sections.map((section: any, idx: number) => {
                    const sectionId = section.h2.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
                    return (
                      <li key={idx}>
                        <a 
                          href={`#${sectionId}`}
                          className={`text-sm font-bold uppercase tracking-wider transition-all block border-l-2 pl-6 py-1 ${
                            activeId === sectionId ? "text-[#8DC63F] border-[#8DC63F] translate-x-2" : "text-sd-gray-text/60 border-gray-100 hover:text-sd-navy hover:border-sd-navy"
                          }`}
                        >
                          {section.h2}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Related Articles - Visual Cards */}
              {relatedPosts.length > 0 && (
                <div className="space-y-8">
                  <h3 className="text-xl font-bold text-sd-navy flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-[#8DC63F] rounded-full"></div>
                    Related Insights
                  </h3>
                  <div className="space-y-8">
                    {relatedPosts.map((p: BlogPost) => (
                      <Link 
                        key={p.slug} 
                        to="/blog/$slug" 
                        params={{ slug: p.slug }}
                        className="group flex gap-5"
                      >
                        <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 shadow-lg bg-gray-100 ring-1 ring-black/5">
                          <img 
                            src={getOptimizedUnsplashUrl(p.heroImage.url, { width: 200, height: 200 })} 
                            alt={p.heroImage.alt} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            loading="lazy"
                            width="96"
                            height="96"
                          />
                        </div>

                        <div className="flex flex-col justify-center gap-1">
                          <h4 className="text-sm font-bold text-sd-navy group-hover:text-[#8DC63F] transition-colors leading-snug line-clamp-2">
                            {p.title}
                          </h4>
                          <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-sd-gray-text/40 mt-1">
                            <span>{p.readTime} min read</span>
                            <span className="w-1 h-1 rounded-full bg-sd-green/30"></span>
                            <span>{p.category}</span>
                          </div>
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
