import { useState, useEffect } from 'react';
import { BLOG_POSTS, BlogPost } from '@/data/blog-posts';
import { supabase } from '@/integrations/supabase/client';

export function useBlogPosts() {
  const [posts, setPosts] = useState<BlogPost[]>(BLOG_POSTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function syncStatuses() {
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('slug, status');

        if (error) throw error;

        if (data) {
          const statusMap = new Map(data.map(item => [item.slug, item.status]));
          const updatedPosts = BLOG_POSTS.map(post => ({
            ...post,
            status: (statusMap.get(post.slug) as 'published' | 'draft') || post.status
          }));
          setPosts(updatedPosts);
        }
      } catch (err) {
        console.error('Error syncing blog statuses:', err);
      } finally {
        setLoading(false);
      }
    }

    syncStatuses();
  }, []);

  return { posts, loading };
}

export function useBlogPost(slug: string) {
  const [post, setPost] = useState<BlogPost | null>(
    BLOG_POSTS.find(p => p.slug === slug) || null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function syncStatus() {
      if (!slug) return;
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('status')
          .eq('slug', slug)
          .single();

        if (error && error.code !== 'PGRST116') throw error;

        if (data) {
          const basePost = BLOG_POSTS.find(p => p.slug === slug);
          if (basePost) {
            setPost({
              ...basePost,
              status: (data.status as 'published' | 'draft') || basePost.status
            });
          }
        }
      } catch (err) {
        console.error('Error syncing blog status:', err);
      } finally {
        setLoading(false);
      }
    }

    syncStatus();
  }, [slug]);

  return { post, loading };
}
