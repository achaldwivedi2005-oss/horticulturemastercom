/** Filter categories for job alerts. */
export const jobCategories = ["ICAR", "Young Professional", "SRF/JRF", "Government Jobs", "Horticulture"] as const;
export type JobCategory = (typeof jobCategories)[number];

/** Derive filter categories from the post title, institute and source type (code-owned, not AI-guessed). */
export function classifyJob(input: { title: string; institute?: string | null; organisationType?: string | null }): JobCategory[] {
  const text = `${input.title} ${input.institute ?? ""}`;
  const out = new Set<JobCategory>();
  if (/\bICAR\b|IARI|IIHR|IIVR|NBPGR|\bICAR-/i.test(text) || input.organisationType === "ICAR") out.add("ICAR");
  if (/young professional|\bYP[-\s]?(I{1,2}|1|2)\b|\bYPs?\b/i.test(text)) out.add("Young Professional");
  if (/\bSRF\b|\bJRF\b|research fellow|research associate|project associate|project assistant/i.test(text)) out.add("SRF/JRF");
  if (/horticultur|vegetable|fruit|flori|olericult|pomolog|plantation|spice/i.test(text)) out.add("Horticulture");
  if (
    input.organisationType === "Government" ||
    /ASRB|officer|scientist|technical assistant|state|department|public service commission|\bPSC\b/i.test(text)
  )
    out.add("Government Jobs");
  return [...out];
}

/** A posting counts as "new" for this many days after it is first detected. */
export const NEW_JOB_DAYS = 3;

export function isNewJob(createdAt: string, now = Date.now()) {
  return now - new Date(createdAt).getTime() < NEW_JOB_DAYS * 86_400_000;
}

/** Days left until the application deadline (negative when expired); null when no reliable date. */
export function daysUntil(deadline: string | null, now = new Date()) {
  if (!deadline) return null;
  const end = new Date(`${deadline}T23:59:59+05:30`).getTime();
  return Math.ceil((end - now.getTime()) / 86_400_000);
}

/** Only accept real calendar dates in YYYY-MM-DD form. */
export function normaliseDate(value: string | null | undefined): string | null {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const d = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== value) return null;
  const year = d.getUTCFullYear();
  return year >= 2000 && year <= 2100 ? value : null;
}

/** Degree levels used for eligibility tags and filters. */
export const degreeLevels = ["B.Sc. Horticulture", "B.Sc. Agriculture", "M.Sc. Horticulture", "M.Sc. Agriculture", "Ph.D."] as const;
export type DegreeLevel = (typeof degreeLevels)[number];

export type JobStatus = "NEW" | "APPLICATION OPEN" | "CLOSING SOON" | "CLOSED" | "UPDATED NOTIFICATION";

/**
 * Status badges for a posting, computed from verified dates only:
 * NEW = found in the last 72 hours, CLOSING SOON = deadline within the threshold,
 * CLOSED = deadline passed, UPDATED NOTIFICATION = corrigendum/extension detected.
 */
export function computeJobStatuses(
  job: { created_at: string; deadline: string | null; is_updated_notification?: boolean | null },
  closingSoonDays = 7,
  now = new Date(),
): JobStatus[] {
  const days = daysUntil(job.deadline, now);
  if (days !== null && days < 0) return ["CLOSED"];
  const out: JobStatus[] = [];
  if (now.getTime() - new Date(job.created_at).getTime() < 72 * 3_600_000) out.push("NEW");
  if (job.is_updated_notification) out.push("UPDATED NOTIFICATION");
  if (days !== null && days <= closingSoonDays) out.push("CLOSING SOON");
  if (!out.includes("CLOSING SOON")) out.push("APPLICATION OPEN");
  return out;
}

/** Notices with no deadline older than this many days are treated as archive entries, not open vacancies. */
export const STALE_NOTICE_DAYS = 90;

/**
 * True when a scanned notice has no deadline and is clearly old — its published date, or the
 * /uploads/YYYY/MM/ folder in its link, is more than STALE_NOTICE_DAYS before today.
 * Prevents archive sections of recruitment pages from showing up as open jobs.
 */
export function isStaleNotice(
  notice: { deadline: string | null; published: string | null; url: string | null },
  today = new Date(),
) {
  if (notice.deadline) return false;
  const cutoff = today.getTime() - STALE_NOTICE_DAYS * 86_400_000;
  if (notice.published) return new Date(`${notice.published}T00:00:00Z`).getTime() < cutoff;
  const m = notice.url?.match(/\/uploads\/(20\d{2})\/(\d{2})\//);
  if (m) return Date.UTC(Number(m[1]), Number(m[2]), 1) < cutoff; // end of that upload month
  return false;
}
