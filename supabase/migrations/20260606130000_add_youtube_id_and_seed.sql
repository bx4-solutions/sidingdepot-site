-- Add youtube_id column to projects
alter table public.projects add column if not exists youtube_id text;

-- Seed: 9 Before & After videos from YouTube
insert into public.projects (title, city, service, youtube_id, thumbnail_url, published, sort_order) values
  ('Before & After Siding Transformation #1 — Greater Marietta', 'Greater Marietta', 'siding', 'Tnjj45TAc2k', 'https://img.youtube.com/vi/Tnjj45TAc2k/maxresdefault.jpg', true, 1),
  ('Before & After Siding Transformation #2 — Greater Marietta', 'Greater Marietta', 'siding', '2TFxqOOVhg4', 'https://img.youtube.com/vi/2TFxqOOVhg4/maxresdefault.jpg', true, 2),
  ('Before & After Siding Transformation #3 — Greater Marietta', 'Greater Marietta', 'siding', 'Wb3zPV83_dg', 'https://img.youtube.com/vi/Wb3zPV83_dg/maxresdefault.jpg', true, 3),
  ('Before & After Siding Transformation #4 — Greater Marietta', 'Greater Marietta', 'siding', 'Zf61N2WWkJ4', 'https://img.youtube.com/vi/Zf61N2WWkJ4/maxresdefault.jpg', true, 4),
  ('Before & After Siding Transformation #5 — Greater Marietta', 'Greater Marietta', 'siding', 'OlWZlwOlQqI', 'https://img.youtube.com/vi/OlWZlwOlQqI/maxresdefault.jpg', true, 5),
  ('Before & After Siding Transformation #6 — Greater Marietta', 'Greater Marietta', 'siding', '_lk2t_5ZZBs', 'https://img.youtube.com/vi/_lk2t_5ZZBs/maxresdefault.jpg', true, 6),
  ('Before & After Siding Transformation #7 — Greater Marietta', 'Greater Marietta', 'siding', 'v4Pf_1rNLDs', 'https://img.youtube.com/vi/v4Pf_1rNLDs/maxresdefault.jpg', true, 7),
  ('Before & After Siding Transformation #8 — Greater Marietta', 'Greater Marietta', 'siding', 'q1t0HoeP3lY', 'https://img.youtube.com/vi/q1t0HoeP3lY/maxresdefault.jpg', true, 8),
  ('Before & After Siding Transformation #9 — Greater Marietta', 'Greater Marietta', 'siding', '43lgIP_ZJqU', 'https://img.youtube.com/vi/43lgIP_ZJqU/maxresdefault.jpg', true, 9)
on conflict do nothing;
