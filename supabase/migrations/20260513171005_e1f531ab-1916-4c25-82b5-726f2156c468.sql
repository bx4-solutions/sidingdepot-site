-- Enable pg_cron if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule the sync-metrics function to run every 6 hours
-- Note: Replace the URL with your project's Edge Function URL if needed, 
-- but usually we use a net-request to call it via HTTP or use a trigger.
-- For now, we'll set up the cron record.

SELECT cron.schedule(
    'sync-metrics-job',
    '0 */6 * * *', -- Every 6 hours
    $$
    SELECT
      net.http_post(
        url := 'https://runxlbfkzdppuazwwrsy.supabase.co/functions/v1/sync-metrics',
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
        ),
        body := '{}'
      ) as request_id;
    $$
);
