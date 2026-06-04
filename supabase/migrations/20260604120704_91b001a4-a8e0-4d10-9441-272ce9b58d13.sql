DROP POLICY IF EXISTS "Anyone can submit a lead" ON public.leads;

CREATE POLICY "Anyone can submit a valid lead"
ON public.leads
FOR INSERT
TO anon, authenticated
WITH CHECK (
  length(trim(name)) BETWEEN 2 AND 100
  AND length(trim(phone)) BETWEEN 7 AND 30
  AND length(trim(city)) BETWEEN 2 AND 80
  AND (email IS NULL OR length(email) <= 255)
  AND (details IS NULL OR length(details) <= 2000)
  AND coalesce(array_length(services, 1), 0) <= 20
  AND consent = true
);