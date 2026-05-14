-- Make title nullable since we store the source of truth in the code
ALTER TABLE public.blog_posts ALTER COLUMN title DROP NOT NULL;

-- Enable RLS
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid errors
DROP POLICY IF EXISTS "Public can view blog post status" ON public.blog_posts;
DROP POLICY IF EXISTS "Authenticated users can update blog post status" ON public.blog_posts;

-- Allow public to see status
CREATE POLICY "Public can view blog post status" ON public.blog_posts
  FOR SELECT USING (true);

-- Allow authenticated users to manage status
CREATE POLICY "Authenticated users can update blog post status" ON public.blog_posts
  FOR ALL TO authenticated USING (true);

-- Allow service role (and thus our inserts) to work
-- Usually service role bypasses RLS, but let's be safe.
