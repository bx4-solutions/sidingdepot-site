-- Fix execution permissions for handle_new_user
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO authenticated;

-- Fix execution permissions for audit_profile_changes
REVOKE EXECUTE ON FUNCTION public.audit_profile_changes() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.audit_profile_changes() TO authenticated;
