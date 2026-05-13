ALTER TABLE public.ab_events ADD COLUMN visitor_id UUID;

-- Adicionar comentário para descrever a coluna
COMMENT ON COLUMN public.ab_events.visitor_id IS 'Identificador único persistente do visitante para correlacionar eventos.';