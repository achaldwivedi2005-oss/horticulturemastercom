-- Official recruitment pages that the monitor checks
CREATE TABLE public.job_sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 150),
  url text NOT NULL UNIQUE CHECK (url ~* '^https?://'),
  organisation_type text NOT NULL DEFAULT 'ICAR' CHECK (organisation_type IN ('ICAR', 'University', 'Government', 'Other')),
  active boolean NOT NULL DEFAULT true,
  last_checked_at timestamptz,
  last_status text,
  last_error text,
  content_hash text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.job_sources TO authenticated;
GRANT ALL ON public.job_sources TO service_role;
ALTER TABLE public.job_sources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage sources" ON public.job_sources FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Vacancies detected from those pages
CREATE TABLE public.job_postings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id uuid REFERENCES public.job_sources(id) ON DELETE SET NULL,
  fingerprint text NOT NULL UNIQUE,
  title text NOT NULL CHECK (char_length(title) <= 300),
  institute text CHECK (char_length(institute) <= 200),
  categories text[] NOT NULL DEFAULT '{}',
  vacancies text CHECK (char_length(vacancies) <= 100),
  qualification text CHECK (char_length(qualification) <= 1000),
  age_limit text CHECK (char_length(age_limit) <= 200),
  salary text CHECK (char_length(salary) <= 300),
  location text CHECK (char_length(location) <= 200),
  deadline date,
  published_date date,
  notification_url text,
  apply_url text,
  source_url text,
  status text NOT NULL DEFAULT 'detected' CHECK (status IN ('detected', 'verified', 'rejected')),
  alerted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX job_postings_status_idx ON public.job_postings (status, created_at DESC);
GRANT SELECT ON public.job_postings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.job_postings TO authenticated;
GRANT ALL ON public.job_postings TO service_role;
ALTER TABLE public.job_postings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads visible postings" ON public.job_postings FOR SELECT TO anon, authenticated
  USING (status IN ('detected', 'verified'));
CREATE POLICY "Admins manage postings" ON public.job_postings FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER job_postings_set_updated_at BEFORE UPDATE ON public.job_postings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Monitor settings (single row)
CREATE TABLE public.job_monitor_settings (
  id int PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  scan_interval_hours int NOT NULL DEFAULT 6 CHECK (scan_interval_hours IN (3, 6, 12, 24)),
  alert_mode text NOT NULL DEFAULT 'on_verify' CHECK (alert_mode IN ('on_verify', 'on_detect', 'off')),
  telegram_chat_id text CHECK (char_length(telegram_chat_id) <= 100),
  last_run_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE ON public.job_monitor_settings TO authenticated;
GRANT ALL ON public.job_monitor_settings TO service_role;
ALTER TABLE public.job_monitor_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read settings" ON public.job_monitor_settings FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update settings" ON public.job_monitor_settings FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
INSERT INTO public.job_monitor_settings (id) VALUES (1);

-- Run log
CREATE TABLE public.job_monitor_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trigger text NOT NULL DEFAULT 'schedule',
  started_at timestamptz NOT NULL DEFAULT now(),
  finished_at timestamptz,
  sources_checked int NOT NULL DEFAULT 0,
  new_postings int NOT NULL DEFAULT 0,
  errors jsonb NOT NULL DEFAULT '[]'::jsonb
);
GRANT SELECT ON public.job_monitor_runs TO authenticated;
GRANT ALL ON public.job_monitor_runs TO service_role;
ALTER TABLE public.job_monitor_runs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read runs" ON public.job_monitor_runs FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
