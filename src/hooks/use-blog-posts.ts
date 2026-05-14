import { useState, useEffect } from 'react';
import { BLOG_POSTS, BlogPost } from '@/data/blog-posts';
import { supabase } from '@/integrations/supabase/client';

export function useBlogPosts() {
  const [posts, setPosts] = useState<BlogPost[]>(BLOG_POSTS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function syncStatuses() {
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('slug, status, scheduled_at');

        if (error) throw error;

        if (data) {
          const statusMap = new Map(data.map(item => [item.slug, { status: item.status, scheduledAt: item.scheduled_at }]));
          const now = new Date();
          const updatedPosts = BLOG_POSTS.map(post => {
            const dbItem = statusMap.get(post.slug);
            let status = (dbItem?.status as 'published' | 'draft' | 'scheduled') || post.status;
            const scheduledAt = dbItem?.scheduledAt;

            // Automatic publication logic: if draft/scheduled and date passed, it's published
            if (status !== 'published' && scheduledAt && new Date(scheduledAt) <= now) {
              status = 'published';
            }

            return {
              ...post,
              status,
              scheduledAt: scheduledAt || undefined
            };
          });
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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function syncStatus() {
      if (!slug) return;
      const localPost = BLOG_POSTS.find(p => p.slug === slug) || null;
      setPost(localPost);
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('status, scheduled_at')
          .eq('slug', slug)
          .single();

        if (error && error.code !== 'PGRST116') throw error;

        if (data) {
          const basePost = BLOG_POSTS.find(p => p.slug === slug);
          if (basePost) {
            let status = (data.status as 'published' | 'draft' | 'scheduled') || basePost.status;
            const scheduledAt = data.scheduled_at;
            const now = new Date();

            if (status !== 'published' && scheduledAt && new Date(scheduledAt) <= now) {
              status = 'published';
            }

            setPost({
              ...basePost,
              status,
              scheduledAt: scheduledAt || undefined
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
