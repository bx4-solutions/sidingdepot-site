-- Create GSC settings table
CREATE TABLE public.gsc_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    site_url TEXT NOT NULL UNIQUE,
    property_id TEXT,
    is_connected BOOLEAN DEFAULT false,
    last_sync_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create daily metrics table for historical reporting
CREATE TABLE public.daily_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL,
    service_key TEXT,
    city TEXT,
    variation TEXT,
    views INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    impressions INTEGER DEFAULT 0,
    leads INTEGER DEFAULT 0,
    ctr DECIMAL,
    avg_position DECIMAL,
    source TEXT NOT NULL, -- 'ga4' or 'gsc'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(date, service_key, city, variation, source)
);

-- Enable RLS
ALTER TABLE public.gsc_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_metrics ENABLE ROW LEVEL SECURITY;

-- Admin policies
CREATE POLICY "Admins can manage GSC settings"
    ON public.gsc_settings
    FOR ALL
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

CREATE POLICY "Admins can view daily metrics"
    ON public.daily_metrics
    FOR SELECT
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

-- Trigger for updated_at
CREATE TRIGGER update_gsc_settings_updated_at
    BEFORE UPDATE ON public.gsc_settings
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
