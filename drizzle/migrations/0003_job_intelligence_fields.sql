ALTER TABLE public.job_postings
  ADD COLUMN department text CHECK (char_length(department) <= 200),
  ADD COLUMN scope text CHECK (scope IN ('All India', 'State Specific')),
  ADD COLUMN state_name text CHECK (char_length(state_name) <= 60),
  ADD COLUMN degree_levels text[] NOT NULL DEFAULT '{}',
  ADD COLUMN phd_compulsory boolean,
  ADD COLUMN net_compulsory boolean,
  ADD COLUMN specialization text CHECK (char_length(specialization) <= 200),
  ADD COLUMN application_fee text CHECK (char_length(application_fee) <= 300),
  ADD COLUMN opening_date date,
  ADD COLUMN application_mode text CHECK (char_length(application_mode) <= 60),
  ADD COLUMN previous_deadlines jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN is_updated_notification boolean NOT NULL DEFAULT false,
  ADD COLUMN summary_en text CHECK (char_length(summary_en) <= 2000),
  ADD COLUMN summary_hi text CHECK (char_length(summary_hi) <= 3000),
  ADD COLUMN why_it_matters text CHECK (char_length(why_it_matters) <= 500),
  ADD COLUMN is_pinned boolean NOT NULL DEFAULT false,
  ADD COLUMN is_breaking boolean NOT NULL DEFAULT false,
  ADD COLUMN last_verified_at timestamptz;

CREATE INDEX job_postings_title_idx ON public.job_postings (source_id, lower(title));

ALTER TABLE public.job_monitor_settings
  ADD COLUMN auto_publish boolean NOT NULL DEFAULT true,
  ADD COLUMN closing_soon_days int NOT NULL DEFAULT 7 CHECK (closing_soon_days BETWEEN 1 AND 30);

-- Public visibility depends on the admin's auto-publish switch (settings are not readable by visitors).
CREATE OR REPLACE FUNCTION public.jobs_auto_publish()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE((SELECT auto_publish FROM public.job_monitor_settings WHERE id = 1), true)
$$;
GRANT EXECUTE ON FUNCTION public.jobs_auto_publish() TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.jobs_closing_soon_days()
RETURNS int
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE((SELECT closing_soon_days FROM public.job_monitor_settings WHERE id = 1), 7)
$$;
GRANT EXECUTE ON FUNCTION public.jobs_closing_soon_days() TO anon, authenticated;

DROP POLICY "Public reads visible postings" ON public.job_postings;
CREATE POLICY "Public reads visible postings" ON public.job_postings FOR SELECT TO anon, authenticated
  USING (status = 'verified' OR (status = 'detected' AND public.jobs_auto_publish()));
