
-- Tighten audit_logs INSERT
DROP POLICY IF EXISTS "Allow system/authenticated users to insert audit logs" ON public.audit_logs;
CREATE POLICY "Users can insert audit logs for themselves"
  ON public.audit_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Make guides bucket private
UPDATE storage.buckets SET public = false WHERE id = 'guides';

-- Replace broad public SELECT with admin-only access
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Admins can read guides"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'guides' AND public.is_admin());
