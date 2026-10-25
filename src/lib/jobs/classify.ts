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
