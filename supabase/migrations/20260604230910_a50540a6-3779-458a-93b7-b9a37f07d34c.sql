
-- 1. Leads: add admin-only SELECT policy
CREATE POLICY "Admins can view leads"
ON public.leads
FOR SELECT
TO authenticated
USING (public.is_admin());

-- 2. site_health_logs: remove permissive public policies, restrict to admins
DROP POLICY IF EXISTS "Enable insert for all users" ON public.site_health_logs;
DROP POLICY IF EXISTS "Enable read for all users" ON public.site_health_logs;

CREATE POLICY "Admins can insert site health logs"
ON public.site_health_logs
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

-- (existing "Admins can read site health logs" SELECT policy remains)

-- 3. Lock down SECURITY DEFINER function execution
-- Revoke from public/anon/authenticated; keep service_role and postgres
REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.log_admin_action(text, text, text, jsonb, text) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.audit_profile_changes() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.handle_updated_at() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;

-- is_admin is still used inside RLS policies; policy evaluation runs with the
-- definer's rights, so this revoke does not break policy checks. It only
-- prevents direct RPC calls like /rest/v1/rpc/is_admin from clients.
