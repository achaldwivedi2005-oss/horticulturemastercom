import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type JobPosting = {
  id: string;
  title: string;
  institute: string | null;
  categories: string[];
  vacancies: string | null;
  qualification: string | null;
  age_limit: string | null;
  salary: string | null;
  location: string | null;
  deadline: string | null;
  published_date: string | null;
  notification_url: string | null;
  apply_url: string | null;
  source_url: string | null;
  status: string;
  created_at: string;
  department: string | null;
  scope: string | null;
  state_name: string | null;
  degree_levels: string[];
  phd_compulsory: boolean | null;
  net_compulsory: boolean | null;
  specialization: string | null;
  application_fee: string | null;
  application_mode: string | null;
  opening_date: string | null;
  previous_deadlines: unknown;
  is_updated_notification: boolean;
  summary_en: string | null;
  summary_hi: string | null;
  why_it_matters: string | null;
  is_pinned: boolean;
  is_breaking: boolean;
  last_verified_at: string | null;
};

/** Public job alerts (verified + auto-detected). Rejected postings are never returned. */
export const closingSoonDaysQuery = queryOptions({
  queryKey: ["jobs-closing-soon-days"],
  queryFn: async () => {
    const { data } = await supabase.rpc("jobs_closing_soon_days");
    return typeof data === "number" ? data : 7;
  },
  staleTime: 10 * 60_000,
});

export const jobPostingsQuery = queryOptions({
  queryKey: ["job-postings"],
  queryFn: async (): Promise<JobPosting[]> => {
    const { data, error } = await supabase
      .from("job_postings")
      .select(
        "id, title, institute, categories, vacancies, qualification, age_limit, salary, location, deadline, published_date, notification_url, apply_url, source_url, status, created_at, department, scope, state_name, degree_levels, phd_compulsory, net_compulsory, specialization, application_fee, application_mode, opening_date, previous_deadlines, is_updated_notification, summary_en, summary_hi, why_it_matters, is_pinned, is_breaking, last_verified_at",
      )
      .in("status", ["detected", "verified"])
      .order("created_at", { ascending: false })
      .limit(300);
    if (error) throw error;
    return data ?? [];
  },
  staleTime: 2 * 60_000,
});
