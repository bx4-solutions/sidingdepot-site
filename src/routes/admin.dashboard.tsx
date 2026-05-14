import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BLOG_POSTS } from "@/data/blog-posts";
import { STATIC_ROUTES, getAllLocationCombos } from "@/data/locations";
import { FileText, MapPin, Layout, CheckCircle2, CircleDashed, Clock, Calendar } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/dashboard")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const [dbStatuses, setDbStatuses] = useState<Record<string, { status: string; scheduledAt?: string }>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('slug, status, scheduled_at');
        
        if (error) throw error;
        
        const statusMap: Record<string, { status: string; scheduledAt?: string }> = {};
        data?.forEach(item => {
          statusMap[item.slug] = {
            status: item.status || 'draft',
            scheduledAt: item.scheduled_at
          };
        });
        setDbStatuses(statusMap);
      } catch (error) {
        console.error('Error fetching blog statuses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatuses();
  }, []);

  const locationPages = getAllLocationCombos();
  const totalPages = STATIC_ROUTES.length + locationPages.length;
  
  const blogStats = BLOG_POSTS.reduce((acc, post) => {
    const dbData = dbStatuses[post.slug];
    const status = dbData?.status || post.status;
    const isScheduled = !!dbData?.scheduledAt;
    
    acc.total++;
    if (status === 'published') acc.published++;
    else if (isScheduled) acc.scheduled++;
    else acc.draft++;
    
    return acc;
  }, { total: 0, published: 0, draft: 0, scheduled: 0 });

  return (
    <div className="min-h-screen bg-gray-50/50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-sd-navy mb-2">System Overview</h1>
          <p className="text-sd-gray-text font-medium">Dashboard monitor of pages, locations, and blog publication states.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white border-none shadow-sm ring-1 ring-black/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-sd-navy/60 uppercase tracking-wider flex items-center gap-2">
                <Layout className="w-4 h-4" /> Total Pages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-sd-navy">{totalPages}</div>
              <p className="text-xs text-sd-gray-text mt-1">{STATIC_ROUTES.length} Static + {locationPages.length} Dynamic</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-none shadow-sm ring-1 ring-black/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-sd-navy/60 uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4" /> Blog Articles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-sd-navy">{blogStats.total}</div>
              <div className="flex gap-2 mt-1">
                <Badge className="bg-sd-green text-sd-black text-[10px]">{blogStats.published} Pub</Badge>
                <Badge className="bg-amber-100 text-amber-800 text-[10px]">{blogStats.draft} Draft</Badge>
                <Badge className="bg-blue-100 text-blue-800 text-[10px]">{blogStats.scheduled} Sched</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-none shadow-sm ring-1 ring-black/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-sd-navy/60 uppercase tracking-wider flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Locations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-sd-navy">{locationPages.length}</div>
              <p className="text-xs text-sd-gray-text mt-1">Service x City combinations</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-none shadow-sm ring-1 ring-black/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-sd-navy/60 uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4" /> Next Scheduled
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-sd-navy truncate">
                {blogStats.scheduled > 0 ? "Upcoming Post" : "None"}
              </div>
              <p className="text-xs text-sd-gray-text mt-1">Automatic publishing active</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Site Pages List */}
          <Card className="bg-white border-none shadow-md ring-1 ring-black/5 h-fit">
            <CardHeader className="border-b border-gray-100">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold text-sd-navy">Site Pages Architecture</CardTitle>
                <Badge variant="outline">{locationPages.length} Location Pages</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-[600px] overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-bold">Page / Route</TableHead>
                      <TableHead className="font-bold">City</TableHead>
                      <TableHead className="font-bold">Service</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {locationPages.map((lp, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium text-xs text-sd-navy">
                          /locations/{lp.city}/{lp.service}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="capitalize text-[10px]">{lp.city.replace('-', ' ')}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize text-[10px]">{lp.service}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Blog Status List */}
          <Card className="bg-white border-none shadow-md ring-1 ring-black/5 h-fit">
            <CardHeader className="border-b border-gray-100 flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-bold text-sd-navy">Blog Content Status</CardTitle>
              <Button asChild variant="outline" size="sm" className="rounded-full">
                <Link to="/admin/blog-preview">Manage Blog</Link>
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-bold">Article Title</TableHead>
                    <TableHead className="font-bold text-center">Status</TableHead>
                    <TableHead className="font-bold">Schedule</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {BLOG_POSTS.map((post) => {
                    const dbData = dbStatuses[post.slug];
                    const status = dbData?.status || post.status;
                    const scheduledAt = dbData?.scheduledAt;
                    const isPublished = status === 'published';
                    
                    return (
                      <TableRow key={post.slug}>
                        <TableCell className="max-w-[200px]">
                          <div className="font-bold text-sd-navy text-xs truncate" title={post.title}>
                            {post.title}
                          </div>
                          <div className="text-[10px] text-sd-gray-text">{post.category}</div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge className={`${
                            isPublished ? 'bg-sd-green text-sd-black' : 
                            scheduledAt ? 'bg-blue-100 text-blue-800' :
                            'bg-amber-100 text-amber-800'
                          } border-none uppercase text-[9px] tracking-widest font-bold px-2 py-0.5`}>
                            {isPublished ? 'Published' : scheduledAt ? 'Scheduled' : 'Draft'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {scheduledAt ? (
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-sd-navy/60">
                              <Calendar className="w-3 h-3" />
                              {new Date(scheduledAt).toLocaleDateString()}
                            </div>
                          ) : (
                            <span className="text-[10px] text-sd-gray-text/40">—</span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

import { Button } from "@/components/ui/button";
