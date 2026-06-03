
DROP POLICY IF EXISTS "Authenticated users can view events" ON public.ab_events;
CREATE POLICY "Admins can view events" ON public.ab_events
  FOR SELECT TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "Authenticated users can manage blog posts" ON public.blog_posts;
CREATE POLICY "Admins can manage blog posts" ON public.blog_posts
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
