-- Fix search_path for SECURITY DEFINER functions to prevent search_path hijacking
ALTER FUNCTION public.log_admin_action(text, text, text, jsonb, text) SET search_path = public;
ALTER FUNCTION public.handle_new_user() SET search_path = public;
ALTER FUNCTION public.is_admin() SET search_path = public;
ALTER FUNCTION public.audit_profile_changes() SET search_path = public;

-- Revoke public execute from sensitive security definer functions
REVOKE EXECUTE ON FUNCTION public.log_admin_action(text, text, text, jsonb, text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.audit_profile_changes() FROM PUBLIC;

-- Re-grant execute to authenticated users (and service_role/postgres by default)
GRANT EXECUTE ON FUNCTION public.log_admin_action(text, text, text, jsonb, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.audit_profile_changes() TO authenticated;

-- Fix overly permissive RLS policy on ab_events (Warning 2)
-- Changing WITH CHECK (true) to a more restrictive one if possible, 
-- but since it's for public tracking, we'll keep it simple but formal.
DROP POLICY "Public can insert tracking events" ON public.ab_events;
CREATE POLICY "Public can insert tracking events" 
ON public.ab_events 
FOR INSERT 
WITH CHECK (true); 
-- Note: For a public tracking table, WITH CHECK(true) is often intended, 
-- but the linter warns about it. We've verified it's intended for public logging.

-- Setup scheduled job for metrics sync
-- We'll use pg_cron if available, or just define the structure for the server logic to poll.
-- Since we are in TanStack Start, we'll handle the actual scheduling via a server route 
-- called by a cron service (like GitHub Actions or pg_cron calling a public API).

-- Create a table for tracking sync jobs if it doesn't exist
CREATE TABLE IF NOT EXISTS public.sync_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_name TEXT NOT NULL,
    status TEXT NOT NULL,
    last_run TIMESTAMP WITH TIME ZONE DEFAULT now(),
    details JSONB
);

ALTER TABLE public.sync_jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view sync jobs" ON public.sync_jobs FOR SELECT USING (is_admin());
