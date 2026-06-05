DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'lead_status') THEN
        CREATE TYPE public.lead_status AS ENUM ('new', 'processed', 'failed');
    END IF;
END $$;

ALTER TABLE public.leads 
ADD COLUMN IF NOT EXISTS status public.lead_status NOT NULL DEFAULT 'new',
ADD COLUMN IF NOT EXISTS ghl_response JSONB,
ADD COLUMN IF NOT EXISTS metadata JSONB;

-- Ensure permissions are correct
GRANT SELECT, INSERT, UPDATE, DELETE ON public.leads TO authenticated;
GRANT INSERT ON public.leads TO anon;
GRANT ALL ON public.leads TO service_role;
