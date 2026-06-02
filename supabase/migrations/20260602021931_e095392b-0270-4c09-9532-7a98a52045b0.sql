
-- 1. audit_logs: drop broad authenticated SELECT
DROP POLICY IF EXISTS "Allow authenticated users to view audit logs" ON public.audit_logs;

-- 2. blog_posts: drop the always-true policies
DROP POLICY IF EXISTS "Public can view blog post status" ON public.blog_posts;
DROP POLICY IF EXISTS "Authenticated users can update blog post status" ON public.blog_posts;

-- 3. google_reviews_sync_log: restrict to admins
DROP POLICY IF EXISTS "Leitura pública de logs de sincronização" ON public.google_reviews_sync_log;
CREATE POLICY "Admins can view google reviews sync log"
  ON public.google_reviews_sync_log
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- 4. storage.objects: tighten guides bucket
DROP POLICY IF EXISTS "Allow Public Uploads" ON storage.objects;

CREATE POLICY "Admins can upload to guides"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'guides' AND public.is_admin());

CREATE POLICY "Admins can update guides"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'guides' AND public.is_admin())
  WITH CHECK (bucket_id = 'guides' AND public.is_admin());

CREATE POLICY "Admins can delete guides"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'guides' AND public.is_admin());

-- 5. is_admin: revoke direct EXECUTE; RLS policies still work because they
--    run as the function owner via SECURITY DEFINER call paths, but anon/
--    authenticated callers can no longer invoke it directly via RPC.
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM anon;
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO service_role;

-- 6. ab_events: tighten always-true INSERT check to a minimal validation
DROP POLICY IF EXISTS "Public can insert tracking events" ON public.ab_events;
CREATE POLICY "Public can insert tracking events"
  ON public.ab_events
  FOR INSERT
  TO public
  WITH CHECK (
    event_type IS NOT NULL
    AND length(event_type) > 0
    AND length(event_type) <= 100
    AND service_key IS NOT NULL
    AND length(service_key) <= 100
    AND variation IS NOT NULL
    AND length(variation) <= 50
  );
