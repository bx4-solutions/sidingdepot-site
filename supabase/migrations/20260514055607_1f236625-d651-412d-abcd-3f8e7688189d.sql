-- Add scheduled_at column to blog_posts
ALTER TABLE public.blog_posts 
ADD COLUMN IF NOT EXISTS scheduled_at TIMESTAMP WITH TIME ZONE;

-- Ensure updated_at exists
ALTER TABLE public.blog_posts 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Create a policy if it doesn't exist (assuming some already exist)
-- Note: RLS should already be enabled on this table based on previous messages.
