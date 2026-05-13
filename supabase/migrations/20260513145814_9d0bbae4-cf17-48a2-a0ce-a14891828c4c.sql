-- Fix search_path and execution permissions for is_admin
ALTER FUNCTION public.is_admin() SET search_path = public;
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- Fix search_path and execution permissions for log_admin_action
ALTER FUNCTION public.log_admin_action(TEXT, TEXT, TEXT, JSONB, TEXT) SET search_path = public;
REVOKE EXECUTE ON FUNCTION public.log_admin_action(TEXT, TEXT, TEXT, JSONB, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.log_admin_action(TEXT, TEXT, TEXT, JSONB, TEXT) TO authenticated;

-- Fix search_path for update_updated_at_column
ALTER FUNCTION public.update_updated_at_column() SET search_path = public;
