import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { daysUntil } from "@/lib/jobs/classify";

export type ExamUpdate = Database["public"]["Tables"]["exam_updates"]["Row"];

/** Allowed values (must match the database check constraints). */
export const updateExams = ["ICAR PG/PhD", "ASRB NET/ARS", "CUET-PG", "State Exams", "Horticulture News", "Other"] as const;
export const updateKinds = ["Counselling", "Application Form", "Exam Date", "Result", "Notice", "News"] as const;

/** One row in an update's "important dates" list. `date` is YYYY-MM-DD; `text` is for tentative/ranged dates. */
export type KeyDate = { label: string; date?: string | null; text?: string | null };

export function parseKeyDates(value: unknown): KeyDate[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((d): d is Record<string, unknown> => !!d && typeof d === "object" && typeof (d as { label?: unknown }).label === "string")
    .map((d) => ({
      label: String(d["label"]),
      date: typeof d["date"] === "string" ? d["date"] : null,
      text: typeof d["text"] === "string" ? d["text"] : null,
    }));
}

export type UpdateWindow = "OPEN" | "CLOSING SOON" | "CLOSED";

/** Window status from the official last date only; null when no last date is published. */
export function updateWindow(lastDate: string | null, closingSoonDays = 7, now = new Date()): UpdateWindow | null {
  const days = daysUntil(lastDate, now);
  if (days === null) return null;
  if (days < 0) return "CLOSED";
  if (days <= closingSoonDays) return "CLOSING SOON";
  return "OPEN";
}

/** Pinned first, then still-open items, then newest. */
export function sortUpdates(rows: ExamUpdate[], now = new Date()) {
  return [...rows].sort((a, b) => {
    if (a.is_pinned !== b.is_pinned) return a.is_pinned ? -1 : 1;
    const ca = updateWindow(a.last_date, 7, now) === "CLOSED" ? 1 : 0;
    const cb = updateWindow(b.last_date, 7, now) === "CLOSED" ? 1 : 0;
    if (ca !== cb) return ca - cb;
    const pa = a.published_date ?? a.created_at.slice(0, 10);
    const pb = b.published_date ?? b.created_at.slice(0, 10);
    return pb.localeCompare(pa);
  });
}

export const examUpdatesQuery = queryOptions({
  queryKey: ["exam-updates"],
  queryFn: async (): Promise<ExamUpdate[]> => {
    const { data, error } = await supabase
      .from("exam_updates")
      .select("*")
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw error;
    return sortUpdates(data ?? []);
  },
  staleTime: 2 * 60_000,
});
