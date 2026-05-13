-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'viewer');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger for new user
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger for login auditing (using auth.audit_log if available, or custom trigger)
-- Since auth schema is managed, we'll use a function called from the app or a trigger on a table that changes on login
-- For now, let's create a trigger on audit_logs itself to ensure search_path is always safe if we add more logic.

-- Ensure first user is admin (optional but helpful for initial setup)
-- UPDATE public.profiles SET role = 'admin' WHERE email = 'your-email@example.com';

-- Audit trigger for profile changes
CREATE OR REPLACE FUNCTION public.audit_profile_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'UPDATE') THEN
    PERFORM public.log_admin_action(
      'update_profile',
      'profiles',
      NEW.id::text,
      jsonb_build_object('old_role', OLD.role, 'new_role', NEW.role, 'email', NEW.email)
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE TRIGGER audit_profiles_trigger
  AFTER UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.audit_profile_changes();
