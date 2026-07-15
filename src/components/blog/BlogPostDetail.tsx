import { useParams, Link, useSearch } from "@tanstack/react-router";
import { BLOG_POSTS, BlogPost } from "@/data/blog-posts";
import { Button } from "@/components/ui/button";
import { HeroQuoteForm } from "@/components/site/HeroQuoteForm";
import { ArrowRight, Clock, Calendar, User, ChevronRight, Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { useBlogPosts, useBlogPost } from "@/hooks/use-blog-posts";
import { getOptimizedUnsplashUrl, getUnsplashSrcSet } from "@/utils/image-optimization";

export default function BlogPostDetail() {
  const { slug } = useParams({ from: "/blog/$slug" });
  const search = useSearch({ from: "/blog/$slug" });
  const isPreview = search.preview === true;

  const { post, loading } = useBlogPost(slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

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

  if (!post || (post.status === "draft" && !isPreview)) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-3xl font-bold mb-4 text-sd-black">
          {!post ? "Post not found" : "This article is still a draft"}
        </h1>
        <p className="text-sd-gray-text mb-8 max-w-md">
          {!post
            ? "The page you are looking for doesn't exist or has been moved."
            : "This article hasn't been published yet. Check back soon for expert siding insights!"}
        </p>
        <Button asChild className="bg-sd-black hover:bg-sd-black/90 text-white rounded-full px-8">
          <Link to="/blog">Back to Blog</Link>
        </Button>
      </div>
    );
  }

  const relatedPosts = BLOG_POSTS.filter(
    (p) => post.internalLinks.includes(p.slug) && p.status === "published",
  );

  // Galeria do rodapé: linkados primeiro, depois mesma categoria, depois os demais — sempre 4
  const morePosts = (() => {
    const published = BLOG_POSTS.filter((p) => p.status === "published" && p.slug !== post.slug);
    const linked = published.filter((p) => post.internalLinks.includes(p.slug));
    const sameCategory = published.filter(
      (p) => !linked.includes(p) && p.category === post.category,
    );
    const others = published.filter((p) => !linked.includes(p) && !sameCategory.includes(p));
    return [...linked, ...sameCategory, ...others].slice(0, 4);
  })();
  const isMariettaCostGuide = post.slug === "james-hardie-siding-cost-marietta-ga-2026";

  return (
    <div className="bg-white min-h-screen font-sans">
      {isPreview && (
        <div className="bg-amber-50 border-b border-amber-200 py-3 px-4 sticky top-0 z-[60]">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-800 font-medium">
              <Eye className="w-4 h-4" />
              <span>Preview Mode: Viewing "{post.status}" version</span>
            </div>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="bg-white border-amber-200 text-amber-800 hover:bg-amber-100 h-8"
            >
              <Link to="/admin/blog-preview">Back to Admin</Link>
            </Button>
          </div>
        </div>
      )}

      <div
        className={`mx-auto px-4 py-8 ${
          isMariettaCostGuide ? "max-w-[1400px] lg:px-8 lg:py-12" : "max-w-7xl"
        }`}
      >
        {/* Breadcrumb - Premium Styling */}
        <nav
          className="flex items-center flex-wrap gap-2 text-[11px] font-bold uppercase tracking-widest text-sd-gray-text/60 mb-12"
          aria-label="Breadcrumb"
        >
          <Link to="/" className="hover:text-sd-black transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/blog" className="hover:text-sd-black transition-colors">
            Blog
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-sd-green">{post.category}</span>
        </nav>

        <div className={`flex flex-col lg:flex-row ${isMariettaCostGuide ? "gap-12 lg:gap-14" : "gap-16"}`}>
          {/* Main Article Content */}
          <article className={isMariettaCostGuide ? "lg:w-[72%]" : "lg:w-[65%]"}>
            <header
              className={`mb-12 ${
                isMariettaCostGuide
                  ? "border-b border-sd-black/10 pb-14"
                  : ""
              }`}
            >
              <span
                className={`inline-block bg-sd-green text-sd-black text-[10px] font-bold uppercase tracking-widest px-4 py-2 mb-8 shadow-sm ${
                  isMariettaCostGuide ? "rounded-none" : "rounded-full"
                }`}
              >
                {post.category}
              </span>
              <h1
                className={`text-4xl md:text-5xl font-bold text-sd-black leading-tight mb-8 ${
                  isMariettaCostGuide ? "max-w-[920px] lg:text-[58px] lg:leading-[1.02]" : "lg:text-[44px]"
                }`}
              >
                {post.title}
              </h1>
              <p
                className={`text-xl italic text-sd-gray-text/80 leading-relaxed mb-10 border-l-4 border-sd-green pl-6 py-2 ${
                  isMariettaCostGuide ? "max-w-[780px]" : ""
                }`}
              >
                {post.excerpt}
              </p>

              <div
                className={`flex flex-wrap items-center gap-6 text-[12px] font-bold uppercase tracking-wider text-sd-gray-text/60 border-y py-6 border-gray-100 mb-12 ${
                  isMariettaCostGuide ? "" : "gap-8"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-sd-black flex items-center justify-center text-white text-[10px] font-black border-2 border-sd-green">
                    SD
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sd-black font-black tracking-normal">
                      Siding Depot Team
                    </span>
                    <span className="text-[10px] lowercase font-medium tracking-normal opacity-70">
                      Editorial Staff
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-sd-green" />{" "}
                  {new Date(post.publishDate).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-sd-green" /> {post.readTime} min read
                </div>
              </div>

              {/* Hero Image with Semantic Caption */}
              <div
                className={`mb-16 overflow-hidden shadow-2xl bg-gray-100 ring-1 ring-black/5 ${
                  isMariettaCostGuide
                    ? "rounded-none"
                    : "rounded-3xl"
                }`}
              >
                <img
                  src={getOptimizedUnsplashUrl(post.heroImage.url, { width: 1200, height: 675 })}
                  srcSet={getUnsplashSrcSet(post.heroImage.url)}
                  sizes="(max-width: 1024px) 100vw, 800px"
                  alt={post.heroImage.alt}
                  className={`w-full h-auto object-cover ${
                    isMariettaCostGuide ? "aspect-[16/8]" : "aspect-[16/9]"
                  }`}
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

            <div
              className={`prose prose-lg max-w-none prose-headings:text-sd-black prose-h2:font-bold prose-h2:mb-8 prose-h2:mt-16 prose-h3:text-[22px] prose-h3:font-bold prose-p:text-sd-gray-text prose-p:leading-[1.8] prose-p:text-lg prose-p:mb-8 prose-li:text-sd-gray-text prose-li:text-lg prose-table:overflow-hidden prose-th:bg-sd-black prose-th:text-sd-black prose-th:px-6 prose-th:py-4 prose-td:px-6 prose-td:py-4 ${
                isMariettaCostGuide
                  ? "prose-h2:text-[34px] prose-h2:border-l-0 prose-h2:pl-0 prose-table:rounded-none"
                  : "prose-h2:text-[28px] prose-h2:border-l-[4px] prose-h2:border-sd-green prose-h2:pl-6 prose-table:rounded-xl"
              }`}
            >
              {post.sections.map((section: any, idx: number) => {
                const sectionId = section.h2
                  .toLowerCase()
                  .replace(/[^\w ]+/g, "")
                  .replace(/ +/g, "-");

                const renderInline = (text: string) => {
                  const parts = text.split(/(\[[^\]]*?\]\([^)]*?\)|\*\*[^*]+?\*\*)/g);
                  return parts.map((part, i) => {
                    const linkMatch = part.match(/^\[([^\]]*?)\]\(([^)]*?)\)$/);
                    if (linkMatch) {
                      const [_, text, url] = linkMatch;
                      const isInternal = url.startsWith("/blog/");
                      if (isInternal) {
                        return (
                          <Link
                            key={i}
                            to={url as any}
                            className="text-sd-green-text font-bold hover:underline"
                          >
                            {text}
                          </Link>
                        );
                      }
                      return (
                        <a
                          key={i}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sd-green-text font-bold hover:underline"
                        >
                          {text}
                        </a>
                      );
                    }
                    const boldMatch = part.match(/^\*\*([^*]+?)\*\*$/);
                    if (boldMatch) {
                      return (
                        <strong key={i} className="font-bold text-sd-black">
                          {boldMatch[1]}
                        </strong>
                      );
                    }
                    return part;
                  });
                };

                // Converte o texto cru em <p>/<ul> reais para herdar os estilos do prose
                const renderContent = (content: string) =>
                  content.split(/\n{2,}/).map((block, i) => {
                    const lines = block.split("\n").filter((l) => l.trim() !== "");
                    const isList =
                      lines.length > 0 && lines.every((l) => l.trim().startsWith("•"));
                    if (isList) {
                      return (
                        <ul key={i}>
                          {lines.map((l, j) => (
                            <li key={j}>{renderInline(l.replace(/^\s*•\s*/, ""))}</li>
                          ))}
                        </ul>
                      );
                    }
                    return <p key={i}>{renderInline(block)}</p>;
                  });

                return (
                  <div key={idx} className="mb-16">
                    <h2 id={sectionId} className="scroll-mt-24">
                      {section.h2}
                    </h2>
                    <div className="mb-10">{renderContent(section.content)}</div>

                    {section.subsections?.map((subsection: { h3: string; content: string }) => (
                      <section key={subsection.h3} className="mb-8">
                        <h3 className="text-2xl font-bold text-sd-black mb-3">{subsection.h3}</h3>
                        <div>{renderContent(subsection.content)}</div>
                      </section>
                    ))}

                    {section.table && (
                      <div className="overflow-x-auto my-12 rounded-xl border border-gray-200 shadow-xl bg-white">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-sd-black text-white">
                            <tr>
                              {section.table.headers.map((header: string, i: number) => (
                                <th
                                  key={i}
                                  className="px-6 py-5 text-left text-[11px] font-black uppercase tracking-[0.1em]"
                                >
                                  {header}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {section.table.rows.map((row: string[], i: number) => (
                              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-[#F4F7FA]"}>
                                {row.map((cell: string, j: number) => (
                                  <td
                                    key={j}
                                    className="px-6 py-5 text-[15px] font-medium text-sd-gray-text"
                                  >
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
                      <div className="my-12 bg-sd-gray-bg border-l-[6px] border-sd-green p-10 rounded-r-3xl shadow-sm">
                        <p className="text-2xl font-bold text-sd-black italic leading-relaxed">
                          "{section.pullQuote}"
                        </p>
                      </div>
                    )}

                    {section.image && (
                      <figure className="my-16 rounded-2xl overflow-hidden shadow-2xl bg-gray-100 ring-1 ring-black/5">
                        <img
                          src={getOptimizedUnsplashUrl(section.image.url, {
                            width: 1000,
                            height: 600,
                          })}
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
                      <div className={`my-20 bg-sd-black p-12 text-white text-center shadow-2xl relative overflow-hidden group ${isMariettaCostGuide ? "rounded-none" : "rounded-3xl"}`}>
                        <div className="absolute top-0 left-0 w-full h-1 bg-sd-green"></div>
                        <p className="text-2xl md:text-3xl font-bold mb-4">
                          Getting quotes for your home?
                        </p>
                        <p className="text-lg text-white/70 mb-10 font-medium">
                          We respond within 24 hours. No high-pressure sales.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
                          <a
                            href="tel:6784002012"
                            className="text-3xl font-black text-sd-green hover:text-sd-black transition-all transform hover:scale-105"
                          >
                            (678) 400-2012
                          </a>
                          <Button
                            asChild
                            size="lg"
                            className="bg-sd-green text-sd-black hover:bg-sd-green-hover rounded-full font-black px-10 py-7 h-auto text-base transition-all hover:translate-y-[-2px] hover:shadow-lg shadow-sd-green/20"
                          >
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
                  <div className="w-2 h-10 bg-sd-green rounded-full"></div>
                  <h2 className="text-3xl font-bold text-sd-black m-0">
                    Frequently Asked Questions
                  </h2>
                </div>
                <div className="space-y-6">
                  {post.faq.map((item: { q: string; a: string }, idx: number) => (
                    <div
                      key={idx}
                      className="bg-sd-gray-bg p-8 rounded-2xl border border-sd-gray-border shadow-sm hover:shadow-md transition-shadow"
                    >
                      <h3 className="font-bold text-xl text-sd-black mb-4 leading-snug flex gap-4">
                        <span className="text-sd-green">Q.</span>
                        {item.q}
                      </h3>
                      <p className="text-sd-gray-text leading-[1.8] text-lg pl-8">{item.a}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Next / Previous Article Navigation */}
            <nav
              className="mt-24 py-12 border-t border-b border-gray-100 flex flex-col sm:flex-row justify-between gap-12"
              aria-label="Post navigation"
            >
              {(() => {
                const currentIndex = BLOG_POSTS.findIndex((p) => p.slug === post.slug);
                const prevPost = currentIndex > 0 ? BLOG_POSTS[currentIndex - 1] : null;
                const nextPost =
                  currentIndex < BLOG_POSTS.length - 1 ? BLOG_POSTS[currentIndex + 1] : null;

                return (
                  <>
                    <div className="flex-1 text-left">
                      {prevPost && (
                        <Link to="/blog/$slug" params={{ slug: prevPost.slug }} className="group">
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-sd-gray-text/40 block mb-4">
                            Previous Article
                          </span>
                          <span className="text-xl font-bold text-sd-black group-hover:text-sd-green transition-colors line-clamp-2">
                            {prevPost.title}
                          </span>
                        </Link>
                      )}
                    </div>
                    <div className="flex-1 text-right">
                      {nextPost && (
                        <Link to="/blog/$slug" params={{ slug: nextPost.slug }} className="group">
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-sd-gray-text/40 block mb-4">
                            Next Article
                          </span>
                          <span className="text-xl font-bold text-sd-black group-hover:text-sd-green transition-colors line-clamp-2">
                            {nextPost.title}
                          </span>
                        </Link>
                      )}
                    </div>
                  </>
                );
              })()}
            </nav>

            {/* Final Conversion CTA */}
            <div className={`mt-24 bg-sd-green p-16 text-center shadow-2xl relative overflow-hidden ${isMariettaCostGuide ? "rounded-none" : "rounded-[40px]"}`}>
              <div className="relative z-10">
                <p className="text-4xl md:text-5xl font-black text-sd-black mb-6 leading-tight">
                  Ready for Your Free Estimate?
                </p>
                <p className="text-xl text-sd-black/70 mb-12 max-w-2xl mx-auto font-bold leading-relaxed">
                  Join 1,000+ happy Georgia homeowners. Professional measurement and detailed
                  written proposal within 48 hours.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  <Button
                    asChild
                    size="lg"
                    className="w-full sm:w-auto rounded-full bg-sd-black text-white hover:bg-sd-black/90 text-lg px-12 py-8 h-auto font-black shadow-xl"
                  >
                    <Link to="/contact">Get Started Now</Link>
                  </Button>
                  <a
                    href="tel:6784002012"
                    className="text-2xl font-black text-sd-black py-4 px-8 hover:opacity-80 transition-opacity"
                  >
                    Call (678) 400-2012
                  </a>
                </div>
              </div>
            </div>
          </article>

          {/* Sidebar - Sticky Agency Style */}
          <aside className={isMariettaCostGuide ? "lg:w-[28%]" : "lg:w-[35%]"}>
            <div className="sticky top-24 space-y-12">
              {/* Quote Form - High Impact */}
              <div className={`bg-white p-8 shadow-2xl ring-1 ring-black/5 relative overflow-hidden ${isMariettaCostGuide ? "rounded-none border-t-8 border-sd-green" : "rounded-[32px]"}`}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-sd-green/15 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                <h3 className="text-2xl font-bold text-sd-black mb-2">Get Your Quote</h3>
                <p className="text-sd-gray-text text-sm mb-6 font-bold uppercase tracking-widest">
                  Free Estimate
                </p>
                <HeroQuoteForm />
              </div>

              {/* Table of Contents - ScrollSpy Style */}
              <div className="bg-white p-10 rounded-[32px] shadow-sm border border-gray-100 ring-1 ring-black/[0.02]">
                <h3 className="text-xl font-bold text-sd-black mb-8 flex items-center gap-3">
                  <div className="w-1.5 h-6 bg-sd-green rounded-full"></div>
                  In This Article
                </h3>
                <ul className="space-y-6">
                  {post.sections.map((section: any, idx: number) => {
                    const sectionId = section.h2
                      .toLowerCase()
                      .replace(/[^\w ]+/g, "")
                      .replace(/ +/g, "-");
                    return (
                      <li key={idx}>
                        <a
                          href={`#${sectionId}`}
                          className={`text-sm font-bold uppercase tracking-wider transition-all block border-l-2 pl-6 py-1 ${
                            activeId === sectionId
                              ? "text-sd-green border-sd-green translate-x-2"
                              : "text-sd-gray-text/60 border-gray-100 hover:text-sd-black hover:border-sd-navy"
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
                  <h3 className="text-xl font-bold text-sd-black flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-sd-green rounded-full"></div>
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
                            src={getOptimizedUnsplashUrl(p.heroImage.url, {
                              width: 200,
                              height: 200,
                            })}
                            alt={p.heroImage.alt}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            loading="lazy"
                            width="96"
                            height="96"
                          />
                        </div>

                        <div className="flex flex-col justify-center gap-1">
                          <h4 className="text-sm font-bold text-sd-black group-hover:text-sd-green transition-colors leading-snug line-clamp-2">
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

        {/* Related Articles Gallery - full width below the final CTA */}
        {morePosts.length > 0 && (
          <section
            className="mt-24 pt-16 border-t border-gray-100"
            aria-labelledby="related-articles-heading"
          >
            <h2
              id="related-articles-heading"
              className="text-3xl md:text-4xl font-bold text-sd-black mb-12 flex items-center gap-4"
            >
              <span className="w-2 h-10 bg-sd-green rounded-full"></span>
              Related Articles
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {morePosts.map((p: BlogPost) => (
                <article key={p.slug} className="group flex flex-col">
                  <Link
                    to="/blog/$slug"
                    params={{ slug: p.slug }}
                    className="relative overflow-hidden rounded-lg aspect-[16/9] mb-5 block bg-gray-100 shadow-md"
                  >
                    <img
                      src={getOptimizedUnsplashUrl(p.heroImage.url, { width: 600, height: 338 })}
                      srcSet={getUnsplashSrcSet(p.heroImage.url)}
                      sizes="(max-width: 640px) 100vw, 320px"
                      alt={p.heroImage.alt}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      loading="lazy"
                      decoding="async"
                      width="600"
                      height="338"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="bg-sd-green text-sd-black text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-md">
                        {p.category}
                      </span>
                    </div>
                  </Link>
                  <h3 className="text-lg font-bold text-sd-black mb-2 group-hover:text-sd-green transition-colors leading-snug line-clamp-2">
                    <Link to="/blog/$slug" params={{ slug: p.slug }}>
                      {p.title}
                    </Link>
                  </h3>
                  <div className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-wider text-sd-gray-text/50 mt-auto pt-2">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" /> {p.readTime} min read
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
