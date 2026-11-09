/** Crop notes content model. Text supports *italic* markup for botanical names. */
export type NoteBlock =
  | { type: "p"; text: string }
  | { type: "list"; title?: string; items: string[] }
  | { type: "table"; title?: string; head: string[]; rows: string[][] }
  | { type: "callout"; tone: "gold" | "green" | "alert"; title: string; items: string[] }
  | { type: "diagram"; name: "pome" | "rootstock" | "growth" };

export type NoteSection = { id: string; title: string; blocks: NoteBlock[] };

export type ShortNotes = {
  slug: string;
  crop: string;
  botanical: string;
  facts: [string, string][];
  oneLiners: string[];
};

/** Membership plans (₹). */
export const notePlans = [
  { id: "monthly", label: "Monthly", price: 199, period: "month", note: "Full access for 30 days" },
  { id: "annual", label: "Annual", price: 1999, period: "12 months", note: "Best value · full year" },
] as const;

/** One-time free preview per student account, in minutes. */
export const TRIAL_MINUTES = 15;
