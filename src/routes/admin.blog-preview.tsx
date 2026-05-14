import { createFileRoute, Link } from "@tanstack/react-router";
import { BLOG_POSTS } from "@/data/blog-posts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/blog-preview")({
  component: BlogAdminPreview,
});

function BlogAdminPreview() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Blog Content Admin Preview</h1>
      <div className="grid gap-6">
        {BLOG_POSTS.map((post) => (
          <Card key={post.slug}>
            <CardHeader>
              <CardTitle>{post.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">{post.excerpt}</p>
              <div className="flex gap-4">
                <Button asChild variant="outline">
                  <Link to="/blog/$slug" params={{ slug: post.slug }}>
                    Preview Live
                  </Link>
                </Button>
                <div className="text-sm flex items-center">
                  Sections: {post.sections.length} | FAQ: {post.faq.length}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
