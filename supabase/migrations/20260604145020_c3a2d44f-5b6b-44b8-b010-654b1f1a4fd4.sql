CREATE TABLE IF NOT EXISTS public.site_health_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    check_type TEXT NOT NULL,
    status TEXT NOT NULL,
    payload JSONB DEFAULT '{}'::jsonb NOT NULL
);

GRANT SELECT, INSERT ON public.site_health_logs TO authenticated;
GRANT SELECT, INSERT ON public.site_health_logs TO anon;
GRANT ALL ON public.site_health_logs TO service_role;

ALTER TABLE public.site_health_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable insert for all users" ON public.site_health_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable read for all users" ON public.site_health_logs FOR SELECT USING (true);
