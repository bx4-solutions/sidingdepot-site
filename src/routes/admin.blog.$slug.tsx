import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { BLOG_POSTS, BlogPost } from "@/data/blog-posts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Rocket, 
  Clock, 
  FileText, 
  CheckCircle2, 
  CircleDashed, 
  Calendar, 
  ArrowLeft,
  CalendarDays,
  History,
  ExternalLink,
  Eye,
  AlertCircle
} from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export const Route = createFileRoute("/admin/blog/$slug")({
  component: ArticleDetail,
});

function ArticleDetail() {
  const { slug } = Route.useParams();
  const navigate = useNavigate();
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  
  const [dbData, setDbData] = useState<{ 
    status: string; 
    scheduled_at?: string; 
    updated_at?: string;
    created_at?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  useEffect(() => {
    if (post) {
      fetchPostData();
      fetchAuditLogs();
    }
  }, [slug]);

  const fetchPostData = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('status, scheduled_at, updated_at, created_at')
        .eq('slug', slug)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          // Post not in DB yet, show default from static data
          setDbData({
            status: post?.status || 'draft',
            updated_at: new Date().toISOString()
          });
        } else {
          throw error;
        }
      } else {
        setDbData({
          status: data.status || 'draft',
          scheduled_at: data.scheduled_at || undefined,
          updated_at: data.updated_at || undefined,
          created_at: data.created_at || undefined
        });
      }
    } catch (error) {
      console.error('Error fetching post data:', error);
      toast.error('Failed to load article status');
    } finally {
      setLoading(false);
    }
  };

  const fetchAuditLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .eq('entity_type', 'blog_post')
        .eq('entity_id', slug)
        .order('created_at', { ascending: false });
      
      if (!error && data) {
        setAuditLogs(data);
      }
    } catch (error) {
      console.error('Error fetching logs:', error);
    }
  };

  const updateStatus = async (newStatus: string, scheduledAt: string | null = null) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      
      // Upsert to handle cases where post might not be in DB yet
      const { error } = await supabase
        .from('blog_posts')
        .upsert({ 
          slug: slug,
          status: newStatus,
          scheduled_at: scheduledAt,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      // Log the change
      await supabase.from('audit_logs').insert({
        user_id: userData.user?.id,
        action: `status_change_to_${newStatus}`,
        entity_type: 'blog_post',
        entity_id: slug,
        details: { oldStatus: dbData?.status, newStatus, scheduledAt }
      });

      toast.success(`Article ${newStatus === 'published' ? 'published' : newStatus === 'scheduled' ? 'scheduled' : 'moved to draft'}`);
      fetchPostData();
      fetchAuditLogs();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update article');
    }
  };

  if (!post) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold">Article not found</h1>
        <Button asChild className="mt-4">
          <Link to="/admin/blog-preview">Back to List</Link>
        </Button>
      </div>
    );
  }

  const currentStatus = dbData?.status || post.status;
  const scheduledAt = dbData?.scheduled_at;
  const isPublished = currentStatus === 'published';
  const isScheduled = !!scheduledAt;

  return (
    <div className="min-h-screen bg-gray-50/50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate({ to: "/admin/blog-preview" })}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-sd-navy">{post.title}</h1>
            <p className="text-sd-gray-text font-medium">Article ID: {slug}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Status Card */}
          <div className="md:col-span-2 space-y-6">
            <Card className="border-none shadow-md bg-white">
              <CardHeader className="border-b">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-sd-green" /> Publication Status
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <Badge className={`text-sm px-4 py-1.5 uppercase tracking-widest font-bold ${
                      isPublished ? 'bg-sd-green text-sd-black' : 
                      isScheduled ? 'bg-blue-100 text-blue-800' : 
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {isPublished ? 'Published' : isScheduled ? 'Scheduled' : 'Draft'}
                    </Badge>
                    {isScheduled && (
                      <div className="flex items-center gap-2 text-blue-600 font-bold text-sm">
                        <CalendarDays className="w-4 h-4" />
                        {new Date(scheduledAt).toLocaleString()}
                      </div>
                    )}
                  </div>
                  
                  <div className="text-right">
                    <p className="text-xs font-bold text-gray-400 uppercase">Last Modified</p>
                    <p className="text-sm font-bold text-sd-navy">
                      {dbData?.updated_at ? new Date(dbData.updated_at).toLocaleString() : 'Never'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Button 
                    className="w-full bg-sd-green text-sd-black hover:bg-sd-green/90 font-bold"
                    onClick={() => updateStatus('published')}
                    disabled={isPublished}
                  >
                    <Rocket className="w-4 h-4 mr-2" /> Publish Now
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full font-bold"
                    onClick={() => updateStatus('draft')}
                    disabled={!isPublished && !isScheduled}
                  >
                    <CircleDashed className="w-4 h-4 mr-2" /> Revert to Draft
                  </Button>

                  <div className="sm:col-span-2 pt-4 border-t">
                    <p className="text-xs font-bold text-sd-navy/60 uppercase mb-3">Scheduling Options</p>
                    <div className="flex flex-col sm:flex-row gap-4 items-end">
                      <div className="w-full">
                        <label className="text-xs font-bold text-gray-500 mb-1 block">Release Date & Time</label>
                        <input 
                          type="datetime-local" 
                          className="w-full p-2 border rounded-md text-sm"
                          onChange={(e) => {
                            if (e.target.value) {
                              updateStatus('draft', e.target.value);
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md bg-white">
              <CardHeader className="border-b">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <FileText className="w-5 h-5 text-sd-navy" /> Quick Stats & Preview
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  <div className="p-3 bg-gray-50 rounded-lg text-center">
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Sections</p>
                    <p className="text-lg font-bold text-sd-navy">{post.sections.length}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg text-center">
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Read Time</p>
                    <p className="text-lg font-bold text-sd-navy">{post.readTime}m</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg text-center">
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Category</p>
                    <p className="text-sm font-bold text-sd-navy truncate">{post.category}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg text-center">
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Featured</p>
                    <p className="text-sm font-bold text-sd-navy">{post.featured ? 'Yes' : 'No'}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button asChild variant="outline" className="flex-1 rounded-full">
                    <Link to="/blog/$slug" params={{ slug: post.slug }} search={{ preview: true }}>
                      <Eye className="w-4 h-4 mr-2" /> Preview Article
                    </Link>
                  </Button>
                  <Button variant="ghost" className="flex-1 rounded-full text-sd-navy" asChild>
                    <a href={`/blog/${post.slug}`} target="_blank" rel="noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" /> View Live Site
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Audit Log */}
          <div className="space-y-6">
            <Card className="border-none shadow-md bg-white h-fit">
              <CardHeader className="border-b">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <History className="w-5 h-5 text-gray-400" /> Change History
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="max-h-[600px] overflow-y-auto">
                  {auditLogs.length === 0 ? (
                    <div className="p-8 text-center text-sd-gray-text text-sm italic">
                      No changes recorded yet.
                    </div>
                  ) : (
                    <div className="divide-y">
                      {auditLogs.map((log) => (
                        <div key={log.id} className="p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex justify-between items-start mb-1">
                            <Badge variant="outline" className="text-[9px] font-bold uppercase tracking-tighter h-4">
                              {log.action.replace('status_change_to_', '')}
                            </Badge>
                            <span className="text-[10px] text-gray-400">
                              {new Date(log.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-xs font-bold text-sd-navy">
                            {log.action.includes('published') ? 'Article Published' : 
                             log.action.includes('draft') ? 'Moved to Draft' : 
                             'Status Updated'}
                          </p>
                          <p className="text-[10px] text-sd-gray-text mt-1">
                            {new Date(log.created_at).toLocaleTimeString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-amber-50 border-amber-100 shadow-sm border">
               <CardContent className="p-4 flex gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-amber-800 uppercase">Admin Note</p>
                    <p className="text-[11px] text-amber-700 font-medium leading-relaxed mt-1">
                      Published articles are immediately visible on the live site. Scheduled articles will go live automatically at the selected time.
                    </p>
                  </div>
               </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
