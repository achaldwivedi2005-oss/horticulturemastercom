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
};

/** Public job alerts (verified + auto-detected). Rejected postings are never returned. */
export const jobPostingsQuery = queryOptions({
  queryKey: ["job-postings"],
  queryFn: async (): Promise<JobPosting[]> => {
    const { data, error } = await supabase
      .from("job_postings")
      .select(
        "id, title, institute, categories, vacancies, qualification, age_limit, salary, location, deadline, published_date, notification_url, apply_url, source_url, status, created_at",
      )
      .in("status", ["detected", "verified"])
      .order("created_at", { ascending: false })
      .limit(300);
    if (error) throw error;
    return data ?? [];
  },
  staleTime: 2 * 60_000,
});
