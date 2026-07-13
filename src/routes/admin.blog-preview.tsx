import { createFileRoute, redirect, Link } from "@tanstack/react-router";
import { BLOG_POSTS, BlogPost } from "@/data/blog-posts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  Rocket,
  Clock,
  FileText,
  CheckCircle2,
  CircleDashed,
  Search,
  Share2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Calendar,
  LayoutDashboard,
  History,
  X,
  Check,
} from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { getOptimizedUnsplashUrl } from "@/utils/image-optimization";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export const Route = createFileRoute("/admin/blog-preview")({
  beforeLoad: async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) throw redirect({ to: "/admin/login" });
  },
  component: BlogAdminPreview,
});

function SEOPreview({ post }: { post: BlogPost }) {
  const canonicalUrl = `https://www.sidingdepot.com/blog/${post.slug}`;
  const ogImageUrl = getOptimizedUnsplashUrl(post.heroImage.url, { width: 1200, height: 630 });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-top-2 duration-300">
      {/* Google Search Preview */}
      <div className="bg-white rounded-xl border p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 bg-blue-50 rounded-lg text-blue-600">
            <Search className="w-4 h-4" />
          </div>
          <h4 className="font-bold text-sd-navy text-sm uppercase tracking-wider">
            Google Search Result
          </h4>
        </div>
        <div className="max-w-[600px] font-sans">
          <div className="flex items-center gap-1 text-[14px] text-[#202124] mb-1">
            <span className="bg-[#f1f3f4] rounded-full w-7 h-7 flex items-center justify-center text-[10px] font-bold">
              SD
            </span>
            <div className="flex flex-col">
              <span className="text-xs">Siding Depot</span>
              <span className="text-[12px] text-[#202124]/70">
                https://www.sidingdepot.com › blog › {post.slug}
              </span>
            </div>
          </div>
          <h3 className="text-[20px] text-[#1a0dab] hover:underline cursor-pointer font-medium mb-1 leading-tight">
            {post.metaTitle}
          </h3>
          <p className="text-[14px] text-[#4d5156] leading-relaxed">{post.metaDescription}</p>
        </div>
      </div>

      {/* Social Media Preview */}
      <div className="bg-white rounded-xl border p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600">
            <Share2 className="w-4 h-4" />
          </div>
          <h4 className="font-bold text-sd-navy text-sm uppercase tracking-wider">
            Social Share (Facebook/LinkedIn)
          </h4>
        </div>
        <div className="max-w-[500px] border rounded-xl overflow-hidden bg-[#F2F3F5]">
          <div className="aspect-[1.91/1] overflow-hidden relative border-b">
            <img loading="lazy" decoding="async" src={ogImageUrl} alt="OG Preview" className="w-full h-full object-cover" />
          </div>
          <div className="p-3 bg-white">
            <div className="text-[12px] text-gray-500 uppercase font-medium mb-0.5 tracking-tight">
              sidingdepot.com
            </div>
            <div className="text-[16px] font-bold text-[#1d2129] leading-tight mb-1">
              {post.metaTitle}
            </div>
            <div className="text-[14px] text-[#606770] line-clamp-2 leading-relaxed">
              {post.metaDescription}
            </div>
          </div>
        </div>
      </div>

      {/* Technical Data */}
      <div className="bg-gray-50 rounded-xl border p-4">
        <h4 className="text-xs font-bold text-sd-navy/50 uppercase tracking-widest mb-3">
          Technical SEO Metadata
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase">Canonical URL</label>
            <div className="flex items-center gap-2 text-xs font-medium text-sd-navy bg-white p-2 rounded border">
              <span className="truncate">{canonicalUrl}</span>
              <ExternalLink className="w-3 h-3 shrink-0 opacity-40" />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase">Article Schema</label>
            <div className="flex items-center gap-2 text-xs font-medium text-green-700 bg-green-50 p-2 rounded border border-green-100">
              <CheckCircle2 className="w-3 h-3 shrink-0" />
              <span>Valid Article Schema Configured</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BlogAdminPreview() {
  const [dbStatuses, setDbStatuses] = useState<
    Record<string, { status: string; scheduledAt?: string }>
  >({});
  const [expandedSEO, setExpandedSEO] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPosts, setSelectedPosts] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchStatuses();
  }, []);

  const fetchStatuses = async () => {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("slug, status, scheduled_at");

      if (error) throw error;

      const statusMap: Record<string, { status: string; scheduledAt?: string }> = {};
      data?.forEach((item) => {
        statusMap[item.slug] = {
          status: item.status || "draft",
          scheduledAt: item.scheduled_at || undefined,
        };
      });
      setDbStatuses(statusMap);
    } catch (error) {
      console.error("Error fetching statuses:", error);
    } finally {
      setLoading(false);
    }
  };

  const updatePostStatus = async (post: BlogPost, newStatus: string, scheduledAt?: string) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      const { error } = await supabase
        .from("blog_posts")
        .update({
          status: newStatus,
          scheduled_at: scheduledAt || null,
          updated_at: new Date().toISOString(),
        })
        .eq("slug", post.slug);

      if (error) throw error;

      // Log the change
      await supabase.from("audit_logs").insert({
        user_id: userData.user?.id,
        action: `status_change_to_${newStatus}`,
        entity_type: "blog_post",
        entity_id: post.slug,
        details: { oldStatus: dbStatuses[post.slug]?.status, newStatus, scheduledAt },
      });

      setDbStatuses((prev) => ({
        ...prev,
        [post.slug]: { status: newStatus, scheduledAt: scheduledAt },
      }));
      toast.success(`Post updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const toggleStatus = async (post: BlogPost) => {
    const currentStatus = dbStatuses[post.slug]?.status || post.status;
    const newStatus = currentStatus === "published" ? "draft" : "published";
    await updatePostStatus(post, newStatus);
  };

  const handleBulkStatusChange = async (newStatus: "published" | "draft") => {
    if (selectedPosts.size === 0) return;

    try {
      const { data: userData } = await supabase.auth.getUser();
      const slugs = Array.from(selectedPosts);

      const { error } = await supabase
        .from("blog_posts")
        .update({
          status: newStatus,
          scheduled_at: null,
          updated_at: new Date().toISOString(),
        })
        .in("slug", slugs);

      if (error) throw error;

      // Log bulk action
      await supabase.from("audit_logs").insert({
        user_id: userData.user?.id,
        action: `bulk_status_change_to_${newStatus}`,
        entity_type: "blog_post",
        entity_id: "multiple",
        details: { slugs, newStatus },
      });

      const updatedStatuses = { ...dbStatuses };
      slugs.forEach((slug) => {
        updatedStatuses[slug] = {
          ...updatedStatuses[slug],
          status: newStatus,
          scheduledAt: undefined,
        };
      });

      setDbStatuses(updatedStatuses);
      setSelectedPosts(new Set());
      toast.success(`Updated ${slugs.length} posts to ${newStatus}`);
    } catch (error) {
      console.error("Error in bulk update:", error);
      toast.error("Bulk update failed");
    }
  };

  const handleSchedule = async (post: BlogPost, dateStr: string) => {
    if (!dateStr) return;
    await updatePostStatus(post, "draft", dateStr);
  };

  const toggleSelectPost = (slug: string) => {
    const newSelected = new Set(selectedPosts);
    if (newSelected.has(slug)) {
      newSelected.delete(slug);
    } else {
      newSelected.add(slug);
    }
    setSelectedPosts(newSelected);
  };

  const toggleSelectAll = (filteredPosts: BlogPost[]) => {
    if (selectedPosts.size === filteredPosts.length) {
      setSelectedPosts(new Set());
    } else {
      setSelectedPosts(new Set(filteredPosts.map((p) => p.slug)));
    }
  };

  const toggleSEO = (slug: string) => {
    setExpandedSEO((prev) => ({ ...prev, [slug]: !prev[slug] }));
  };

  const filteredPosts = BLOG_POSTS.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.slug.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gray-50/50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-sd-navy mb-2">Blog Content Management</h1>
            <p className="text-sd-gray-text font-medium">
              Review, preview, and manage publication status for all 10 strategic articles.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button asChild variant="outline" className="rounded-full shadow-sm">
              <Link to="/admin/dashboard">
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Admin Dashboard
              </Link>
            </Button>
            <div className="bg-white px-4 py-2 rounded-lg border shadow-sm flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-sd-green animate-pulse" />
              <span className="text-xs font-bold text-sd-navy uppercase tracking-wider">
                Sync Active
              </span>
            </div>
          </div>
        </div>

        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border shadow-sm">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sd-gray-text" />
              <Input
                placeholder="Search articles by title..."
                className="pl-10 rounded-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="rounded-full">
                    <History className="w-4 h-4 mr-2" />
                    Audit Logs
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[400px] sm:w-[540px] overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>Article Change History</SheetTitle>
                  </SheetHeader>
                  <AuditLogViewer />
                </SheetContent>
              </Sheet>

              {selectedPosts.size > 0 && (
                <div className="flex items-center gap-2 animate-in fade-in zoom-in duration-200">
                  <Badge variant="secondary" className="px-3 py-1">
                    {selectedPosts.size} selected
                  </Badge>
                  <Button
                    size="sm"
                    variant="default"
                    className="bg-sd-green text-sd-black hover:bg-sd-green/90 rounded-full"
                    onClick={() => handleBulkStatusChange("published")}
                  >
                    <Rocket className="w-3.5 h-3.5 mr-1.5" /> Publish
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full"
                    onClick={() => handleBulkStatusChange("draft")}
                  >
                    <CircleDashed className="w-3.5 h-3.5 mr-1.5" /> Move to Draft
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="rounded-full h-8 w-8"
                    onClick={() => setSelectedPosts(new Set())}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 px-2">
            <Checkbox
              checked={selectedPosts.size === filteredPosts.length && filteredPosts.length > 0}
              onCheckedChange={() => toggleSelectAll(filteredPosts)}
              id="select-all"
            />
            <label
              htmlFor="select-all"
              className="text-xs font-bold text-sd-navy/60 uppercase cursor-pointer"
            >
              Select All Visible ({filteredPosts.length})
            </label>
          </div>
        </div>

        <div className="grid gap-6">
          {filteredPosts.map((post) => {
            const dbData = dbStatuses[post.slug];
            const status = dbData?.status || post.status;
            const scheduledAt = dbData?.scheduledAt;
            const isPublished = status === "published";
            const isSEOExpanded = expandedSEO[post.slug];
            const isSelected = selectedPosts.has(post.slug);

            return (
              <Card
                key={post.slug}
                className={`overflow-hidden border-none shadow-md hover:shadow-lg transition-all bg-white ring-1 ${isSelected ? "ring-sd-green ring-2" : "ring-black/5"}`}
              >
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-64 h-48 md:h-auto relative shrink-0">
                    <img loading="lazy" decoding="async"
                      src={post.heroImage.url}
                      alt={post.heroImage.alt}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          className="bg-white/90 border-none w-5 h-5"
                          checked={isSelected}
                          onCheckedChange={() => toggleSelectPost(post.slug)}
                        />
                        <Badge
                          className={`${isPublished ? "bg-sd-green text-sd-black" : scheduledAt ? "bg-blue-100 text-blue-800" : "bg-amber-100 text-amber-800"} border-none uppercase text-[9px] tracking-widest font-bold px-2 py-1`}
                        >
                          {isPublished ? "published" : scheduledAt ? "scheduled" : status}
                        </Badge>
                      </div>
                      {scheduledAt && (
                        <Badge className="bg-white/90 text-sd-navy border-none text-[8px] font-bold py-0.5">
                          <Calendar className="w-2.5 h-2.5 mr-1" />
                          {new Date(scheduledAt).toLocaleDateString()}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <CardContent className="p-0 flex-1 flex flex-col">
                    <div className="p-6">
                      <div className="flex flex-col h-full justify-between gap-6">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge
                              variant="outline"
                              className="text-[10px] font-bold border-sd-navy/20 text-sd-navy/60 uppercase tracking-tighter"
                            >
                              {post.category}
                            </Badge>
                            <span className="text-[10px] font-medium text-sd-gray-text flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {post.readTime} min read
                            </span>
                          </div>
                          <Link
                            to="/admin/blog/$slug"
                            params={{ slug: post.slug }}
                            className="hover:opacity-80 transition-opacity"
                          >
                            <h3 className="text-xl font-bold text-sd-navy mb-2 leading-tight">
                              {post.title}
                            </h3>
                          </Link>
                          <p className="text-sm text-sd-gray-text line-clamp-2 mb-4 leading-relaxed font-medium">
                            {post.excerpt}
                          </p>
                          <div className="flex flex-wrap gap-4 text-[11px] font-bold text-sd-navy/50 uppercase tracking-wider">
                            <span className="flex items-center gap-1.5">
                              <FileText className="w-3.5 h-3.5" /> {post.sections.length} Sections
                            </span>
                            <span className="flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5" /> FAQ Complete
                            </span>
                            {scheduledAt && (
                              <span className="flex items-center gap-1.5 text-blue-600">
                                <Calendar className="w-3.5 h-3.5" />
                                Scheduled: {new Date(scheduledAt).toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-gray-100">
                          <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="rounded-full border-sd-navy/20 hover:bg-sd-navy hover:text-white group"
                          >
                            <Link
                              to="/blog/$slug"
                              params={{ slug: post.slug }}
                              search={{ preview: true }}
                            >
                              <Eye className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                              Live Preview
                            </Link>
                          </Button>

                          <Button
                            onClick={() => toggleSEO(post.slug)}
                            variant="outline"
                            size="sm"
                            className={`rounded-full border-sd-navy/20 hover:bg-sd-navy hover:text-white group ${isSEOExpanded ? "bg-sd-navy text-white" : ""}`}
                          >
                            <Search className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                            SEO Preview
                            {isSEOExpanded ? (
                              <ChevronUp className="w-4 h-4 ml-2" />
                            ) : (
                              <ChevronDown className="w-4 h-4 ml-2" />
                            )}
                          </Button>

                          <div className="flex items-center gap-2">
                            <div className="relative group/schedule">
                              <input
                                type="datetime-local"
                                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                onChange={(e) => handleSchedule(post, e.target.value)}
                              />
                              <Button
                                variant="outline"
                                size="sm"
                                className="rounded-full border-sd-navy/20 pointer-events-none group-hover/schedule:bg-gray-50"
                              >
                                <Clock className="w-4 h-4 mr-2" />
                                Schedule
                              </Button>
                            </div>
                          </div>

                          <Button
                            onClick={() => toggleStatus(post)}
                            variant={isPublished ? "ghost" : "default"}
                            size="sm"
                            className={`rounded-full px-6 font-bold uppercase text-[10px] tracking-widest ${
                              isPublished
                                ? "bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border-red-100"
                                : "bg-sd-green text-sd-black hover:bg-sd-green/90"
                            }`}
                          >
                            {isPublished ? (
                              <>
                                <CircleDashed className="w-4 h-4 mr-2" />
                                Unpublish (Draft)
                              </>
                            ) : (
                              <>
                                <Rocket className="w-4 h-4 mr-2" />
                                Publish Now
                              </>
                            )}
                          </Button>

                          <Button
                            asChild
                            variant="ghost"
                            size="sm"
                            className="ml-auto rounded-full text-[10px] font-bold text-sd-gray-text/40 hover:text-sd-navy"
                          >
                            <Link to="/admin/blog/$slug" params={{ slug: post.slug }}>
                              View Details
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>

                    <Collapsible open={isSEOExpanded} onOpenChange={() => toggleSEO(post.slug)}>
                      <CollapsibleContent>
                        <div className="px-6 pb-6 pt-2 bg-gray-50/50 border-t border-gray-100">
                          <SEOPreview post={post} />
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </CardContent>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function AuditLogViewer({ limit = 50, slug }: { limit?: number; slug?: string }) {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dbStatuses, setDbStatuses] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchLogs = async () => {
      let query = supabase
        .from("audit_logs")
        .select("*")
        .eq("entity_type", "blog_post")
        .order("created_at", { ascending: false })
        .limit(limit);

      if (slug) {
        query = query.eq("entity_id", slug);
      }

      const { data, error } = await query;

      if (!error && data) {
        setLogs(data);
      }
      setLoading(false);
    };

    fetchLogs();
  }, []);

  if (loading) return <div className="p-4 text-center">Loading logs...</div>;

  return (
    <div className="mt-6 space-y-4">
      {logs.length === 0 ? (
        <p className="text-center text-sd-gray-text py-8">No history available yet.</p>
      ) : (
        logs.map((log) => (
          <div key={log.id} className="p-3 bg-white rounded-lg border shadow-sm text-xs">
            <div className="flex justify-between items-start mb-1">
              <span className="font-bold text-sd-navy capitalize">
                {log.action.replace(/_/g, " ")}
              </span>
              <span className="text-gray-400">{new Date(log.created_at).toLocaleString()}</span>
            </div>
            <div className="text-sd-gray-text font-medium truncate">
              Target:{" "}
              <Link
                to="/admin/blog/$slug"
                params={{ slug: log.entity_id }}
                className="text-sd-navy hover:underline"
              >
                {log.entity_id}
              </Link>
            </div>
            {log.details && (
              <div className="mt-1 text-[10px] text-gray-500 bg-gray-50 p-1 rounded">
                {JSON.stringify(log.details)}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
