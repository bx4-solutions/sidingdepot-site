import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BLOG_POSTS } from "@/data/blog-posts";
import { STATIC_ROUTES, getAllLocationCombos } from "@/data/locations";
import { FileText, MapPin, Layout, CheckCircle2, CircleDashed, Clock, Calendar, Search } from "lucide-react";
import { useState, useEffect, ChangeEvent } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/dashboard")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const [dbStatuses, setDbStatuses] = useState<Record<string, { status: string; scheduledAt?: string }>>({});
  const [loading, setLoading] = useState(true);

  // Filters state
  const [locationCityFilter, setLocationCityFilter] = useState("");
  const [locationServiceFilter, setLocationServiceFilter] = useState("");
  const [routeSearch, setRouteSearch] = useState("");
  const [pageTypeFilter, setPageTypeFilter] = useState("all");
  const [blogSearch, setBlogSearch] = useState("");
  const [blogStatusFilter, setBlogStatusFilter] = useState("all");

  // Pagination state
  const [locationPage, setLocationPage] = useState(1);
  const [blogPage, setBlogPage] = useState(1);
  const itemsPerPage = 10;

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
            scheduledAt: item.scheduled_at ?? undefined
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
  const allSitePages = [
    ...STATIC_ROUTES.map(route => ({ route, type: 'static' as const, city: '—', service: '—' })),
    ...locationPages.map(lp => ({ 
      route: `/locations/${lp.city}/${lp.service}`, 
      type: 'location' as const, 
      city: lp.city.replace('-', ' '), 
      service: lp.service 
    }))
  ];
  
  const totalPages = allSitePages.length;
  
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

  // Filtered Site Pages
  const filteredSitePages = allSitePages.filter(page => {
    const matchesCity = !locationCityFilter || page.city.toLowerCase().includes(locationCityFilter.toLowerCase());
    const matchesService = !locationServiceFilter || page.service.toLowerCase().includes(locationServiceFilter.toLowerCase());
    const matchesRoute = !routeSearch || page.route.toLowerCase().includes(routeSearch.toLowerCase());
    const matchesType = pageTypeFilter === "all" || page.type === pageTypeFilter;
    
    return matchesCity && matchesService && matchesRoute && matchesType;
  });

  // Filtered Blog Posts
  const filteredBlogPosts = BLOG_POSTS.filter(post => {
    const dbData = dbStatuses[post.slug];
    const status = dbData?.status || post.status;
    const scheduledAt = dbData?.scheduledAt;
    const finalStatus = status === 'published' ? 'published' : scheduledAt ? 'scheduled' : 'draft';

    const matchesSearch = !blogSearch || post.title.toLowerCase().includes(blogSearch.toLowerCase());
    const matchesStatus = blogStatusFilter === "all" || finalStatus === blogStatusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Paginated data
  const paginatedPages = filteredSitePages.slice((locationPage - 1) * itemsPerPage, locationPage * itemsPerPage);
  const totalSitePagesCount = Math.ceil(filteredSitePages.length / itemsPerPage);

  const paginatedBlogs = filteredBlogPosts.slice((blogPage - 1) * itemsPerPage, blogPage * itemsPerPage);
  const totalBlogPagesCount = Math.ceil(filteredBlogPosts.length / itemsPerPage);

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
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-bold text-sd-navy">Site Pages Architecture</CardTitle>
                  <Badge variant="outline">{filteredSitePages.length} Results</Badge>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="relative col-span-2">
                    <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-sd-gray-text" />
                    <Input 
                      placeholder="Search route..." 
                      className="h-8 pl-8 text-xs"
                      value={routeSearch}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        setRouteSearch(e.target.value);
                        setLocationPage(1);
                      }}
                    />
                  </div>
                  <Input 
                    placeholder="Filter city..." 
                    className="h-8 text-xs"
                    value={locationCityFilter}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      setLocationCityFilter(e.target.value);
                      setLocationPage(1);
                    }}
                  />
                  <Input 
                    placeholder="Filter service..." 
                    className="h-8 text-xs"
                    value={locationServiceFilter}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      setLocationServiceFilter(e.target.value);
                      setLocationPage(1);
                    }}
                  />
                  <Select 
                    value={pageTypeFilter} 
                    onValueChange={(val: string) => {
                      setPageTypeFilter(val);
                      setLocationPage(1);
                    }}
                  >
                    <SelectTrigger className="h-8 text-xs col-span-2">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="static">Static Only</SelectItem>
                      <SelectItem value="location">Locations Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-[500px] overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-bold">Page / Route</TableHead>
                      <TableHead className="font-bold">Type</TableHead>
                      <TableHead className="font-bold">City / Service</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedPages.map((page, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium text-xs text-sd-navy">
                          {page.route}
                        </TableCell>
                        <TableCell>
                          <Badge variant={page.type === 'static' ? "secondary" : "outline"} className="capitalize text-[10px]">
                            {page.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <span className="capitalize text-[10px] text-sd-navy font-medium">{page.city}</span>
                            <span className="capitalize text-[9px] text-sd-gray-text">{page.service}</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {paginatedPages.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-8 text-sd-gray-text text-sm">
                          No pages found matching filters.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              
              {/* Pagination Controls */}
              {totalSitePagesCount > 1 && (
                <div className="p-4 border-t border-gray-100 flex items-center justify-between">
                  <div className="text-xs text-sd-gray-text font-medium">
                    Page {locationPage} of {totalSitePagesCount}
                  </div>
                  <div className="flex gap-1">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8 w-8 p-0" 
                      onClick={() => setLocationPage(p => Math.max(1, p - 1))}
                      disabled={locationPage === 1}
                    >
                      &lt;
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8 w-8 p-0"
                      onClick={() => setLocationPage(p => Math.min(totalSitePagesCount, p + 1))}
                      disabled={locationPage === totalSitePagesCount}
                    >
                      &gt;
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Blog Status List */}
          <Card className="bg-white border-none shadow-md ring-1 ring-black/5 h-fit">
            <CardHeader className="border-b border-gray-100">
              <div className="space-y-4">
                <div className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg font-bold text-sd-navy">Blog Content Status</CardTitle>
                  <Button asChild variant="outline" size="sm" className="rounded-full">
                    <Link to="/admin/blog-preview">Manage Blog</Link>
                  </Button>
                </div>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-sd-gray-text" />
                    <Input 
                      placeholder="Search articles..." 
                      className="h-8 pl-8 text-xs"
                      value={blogSearch}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        setBlogSearch(e.target.value);
                        setBlogPage(1);
                      }}
                    />
                  </div>
                  <Select 
                    value={blogStatusFilter} 
                    onValueChange={(val: string) => {
                      setBlogStatusFilter(val);
                      setBlogPage(1);
                    }}
                  >
                    <SelectTrigger className="h-8 w-[120px] text-xs">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-[500px] overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-bold">Article Title</TableHead>
                      <TableHead className="font-bold text-center">Status</TableHead>
                      <TableHead className="font-bold">Schedule</TableHead>
                      <TableHead className="font-bold text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedBlogs.map((post) => {
                      const dbData = dbStatuses[post.slug];
                      const status = dbData?.status || post.status;
                      const scheduledAt = dbData?.scheduledAt;
                      const isPublished = status === 'published';
                      
                      return (
                        <TableRow key={post.slug}>
                          <TableCell className="max-w-[200px]">
                            <Link to="/admin/blog/$slug" params={{ slug: post.slug }} className="font-bold text-sd-navy text-xs truncate hover:text-sd-green transition-colors" title={post.title}>
                              {post.title}
                            </Link>
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
                          <TableCell className="text-right">
                            <Button asChild variant="ghost" size="sm" className="h-7 text-[10px] font-bold uppercase tracking-wider">
                              <Link to="/admin/blog/$slug" params={{ slug: post.slug }}>Details</Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {paginatedBlogs.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-8 text-sd-gray-text text-sm">
                          No articles found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination Controls */}
              {totalBlogPagesCount > 1 && (
                <div className="p-4 border-t border-gray-100 flex items-center justify-between">
                  <div className="text-xs text-sd-gray-text font-medium">
                    Page {blogPage} of {totalBlogPagesCount}
                  </div>
                  <div className="flex gap-1">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8 w-8 p-0" 
                      onClick={() => setBlogPage(p => Math.max(1, p - 1))}
                      disabled={blogPage === 1}
                    >
                      &lt;
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8 w-8 p-0"
                      onClick={() => setBlogPage(p => Math.min(totalBlogPagesCount, p + 1))}
                      disabled={blogPage === totalBlogPagesCount}
                    >
                      &gt;
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


import { Button } from "@/components/ui/button";
