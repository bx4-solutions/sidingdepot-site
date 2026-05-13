import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

export const getBlogPosts = createServerFn({ method: "GET" })
  .handler(async () => {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .order("suggested_date", { ascending: true });
    
    if (error) throw new Error(error.message);
    return data;
  });

export const updateBlogPost = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({
    id: z.string(),
    status: z.enum(["draft", "published"]),
    published_at: z.string().optional(),
    content: z.string().optional(),
  }).parse(data))
  .handler(async ({ data }) => {
    const { error } = await supabase
      .from("blog_posts")
      .update({
        status: data.status,
        published_at: data.published_at,
        content: data.content
      })
      .eq("id", data.id);
    
    if (error) throw new Error(error.message);
    return { success: true };
  });

export const seedBlogPosts = createServerFn({ method: "POST" })
  .handler(async () => {
    // Check if posts exist
    const { count } = await supabase.from("blog_posts").select("*", { count: 'exact', head: true });
    if (count && count > 0) return { message: "Already seeded" };

    const { BLOG_CALENDAR } = await import("@/data/blog-calendar");
    
    const posts = BLOG_CALENDAR.map(p => ({
      title: p.title,
      slug: p.slug,
      category: p.category,
      keywords: p.keywords,
      suggested_date: p.suggestedDate,
      excerpt: p.excerpt,
      status: 'draft'
    }));

    const { error } = await supabase.from("blog_posts").insert(posts);
    if (error) throw new Error(error.message);
    return { success: true };
  });
