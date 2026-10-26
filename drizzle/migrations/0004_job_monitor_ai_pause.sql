ALTER TABLE public.job_monitor_settings
  ADD COLUMN ai_paused_at timestamptz,
  ADD COLUMN ai_paused_reason text CHECK (char_length(ai_paused_reason) <= 500);