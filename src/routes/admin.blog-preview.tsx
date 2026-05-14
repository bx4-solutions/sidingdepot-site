import { createFileRoute, Link } from "@tanstack/react-router";
import { BLOG_POSTS, BlogPost } from "@/data/blog-posts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Rocket, Clock, FileText, CheckCircle2, CircleDashed } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/blog-preview")({
  component: BlogAdminPreview,
});

function BlogAdminPreview() {
  const [dbStatuses, setDbStatuses] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatuses();
  }, []);

  const fetchStatuses = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('slug, status');
      
      if (error) throw error;
      
      const statusMap: Record<string, string> = {};
      data?.forEach(item => {
        statusMap[item.slug] = item.status || 'draft';
      });
      setDbStatuses(statusMap);
    } catch (error) {
      console.error('Error fetching statuses:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (post: BlogPost) => {
    const currentStatus = dbStatuses[post.slug] || post.status;
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    
    try {
      const { error } = await supabase
        .from('blog_posts')
        .upsert({ 
          slug: post.slug, 
          status: newStatus,
          title: post.title,
          updated_at: new Date().toISOString()
        }, { onConflict: 'slug' });

      if (error) throw error;

      setDbStatuses(prev => ({ ...prev, [post.slug]: newStatus }));
      toast.success(`Post ${newStatus === 'published' ? 'published' : 'moved to drafts'}`);
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-sd-navy mb-2">Blog Content Management</h1>
            <p className="text-sd-gray-text font-medium">Review, preview, and manage publication status for all 10 strategic articles.</p>
          </div>
          <div className="flex items-center gap-3">
             <div className="bg-white px-4 py-2 rounded-lg border shadow-sm flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-sd-green animate-pulse" />
                <span className="text-xs font-bold text-sd-navy uppercase tracking-wider">Sync Active</span>
             </div>
          </div>
        </div>

        <div className="grid gap-6">
          {BLOG_POSTS.map((post) => {
            const status = dbStatuses[post.slug] || post.status;
            const isPublished = status === 'published';

            return (
              <Card key={post.slug} className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow bg-white ring-1 ring-black/5">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-64 h-48 md:h-auto relative shrink-0">
                    <img 
                      src={post.heroImage.url} 
                      alt={post.heroImage.alt}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge className={`${isPublished ? 'bg-sd-green text-sd-black' : 'bg-amber-100 text-amber-800'} border-none uppercase text-[9px] tracking-widest font-bold px-2 py-1`}>
                        {status}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardContent className="p-6 flex-1">
                    <div className="flex flex-col h-full justify-between gap-6">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-[10px] font-bold border-sd-navy/20 text-sd-navy/60 uppercase tracking-tighter">
                            {post.category}
                          </Badge>
                          <span className="text-[10px] font-medium text-sd-gray-text flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {post.readTime} min read
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-sd-navy mb-2 leading-tight">{post.title}</h3>
                        <p className="text-sm text-sd-gray-text line-clamp-2 mb-4 leading-relaxed font-medium">
                          {post.excerpt}
                        </p>
                        <div className="flex flex-wrap gap-4 text-[11px] font-bold text-sd-navy/50 uppercase tracking-wider">
                           <span className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> {post.sections.length} Sections</span>
                           <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> FAQ Complete</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-gray-100">
                        <Button asChild variant="outline" size="sm" className="rounded-full border-sd-navy/20 hover:bg-sd-navy hover:text-white group">
                          <Link to="/blog/$slug" params={{ slug: post.slug }} search={{ preview: true }}>
                            <Eye className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                            Live Preview
                          </Link>
                        </Button>
                        
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

                        <div className="ml-auto flex items-center gap-2 text-[10px] font-bold text-sd-gray-text/40">
                          ID: {post.slug.slice(0, 8)}...
                        </div>
                      </div>
                    </div>
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
