-- Create storage bucket for guides if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('guides', 'guides', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public access to read files in the guides bucket
CREATE POLICY "Public Access" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'guides');

-- Allow anyone to upload to the guides bucket (since it's a public lead magnet tool)
-- In a production app, you might want to restrict this or use a signed upload, 
-- but for a simple "generate and share" link on a lead magnet page, this is the most direct path.
CREATE POLICY "Allow Public Uploads" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'guides');