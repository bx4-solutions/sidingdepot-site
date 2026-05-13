CREATE TABLE IF NOT EXISTS public.google_reviews_sync_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  place_id TEXT NOT NULL,
  status TEXT NOT NULL,
  reviews_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.google_reviews_sync_log ENABLE ROW LEVEL SECURITY;

-- Política de leitura para todos (opcional, para exibir no frontend se necessário)
CREATE POLICY "Leitura pública de logs de sincronização" ON public.google_reviews_sync_log
  FOR SELECT USING (true);
