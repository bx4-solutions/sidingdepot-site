DROP POLICY IF EXISTS "Anyone can insert site health logs" ON public.site_health_logs;
DROP POLICY IF EXISTS "Anyone can read site health logs" ON public.site_health_logs;
DROP POLICY IF EXISTS "Public can insert site health logs" ON public.site_health_logs;
DROP POLICY IF EXISTS "Public can read site health logs" ON public.site_health_logs;
DROP POLICY IF EXISTS "site_health_logs_insert" ON public.site_health_logs;
DROP POLICY IF EXISTS "site_health_logs_select" ON public.site_health_logs;
DROP POLICY IF EXISTS "Allow public insert" ON public.site_health_logs;
DROP POLICY IF EXISTS "Allow public select" ON public.site_health_logs;

REVOKE ALL ON public.site_health_logs FROM anon;
REVOKE ALL ON public.site_health_logs FROM authenticated;
GRANT ALL ON public.site_health_logs TO service_role;

ALTER TABLE public.site_health_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read site health logs"
  ON public.site_health_logs
  FOR SELECT
  TO authenticated
  USING (public.is_admin());