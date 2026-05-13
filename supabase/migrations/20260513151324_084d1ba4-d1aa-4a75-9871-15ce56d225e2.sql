-- Ensure profile exists and promote to admin
INSERT INTO public.profiles (id, email, role)
VALUES ('03259b12-469f-43f9-b932-7d7864ad85f4', 'groupbiones@gmail.com', 'admin')
ON CONFLICT (id) DO UPDATE SET role = 'admin', email = EXCLUDED.email;