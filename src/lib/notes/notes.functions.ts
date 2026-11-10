import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { TRIAL_MINUTES } from "./types";
import type { NoteSection } from "./types";

export type NotesResponse =
  | { status: "open"; reason: "admin" | "premium" | "trial"; endsAt: string | null; sections: NoteSection[] }
  | { status: "trial-available" }
  | { status: "locked"; reason: "trial-used" };

async function loadSections(slug: string): Promise<NoteSection[] | null> {
  if (slug === "apple") return (await import("./apple.server")).appleFull;
  return null;
}

/** Full crop notes: admin / members always; others get one 15-minute trial per account, ever. */
export const openCropNotes = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ slug: z.string().min(1).max(40), startTrial: z.boolean() }).parse(input))
  .handler(async ({ data, context }): Promise<NotesResponse> => {
    const sections = await loadSections(data.slug);
    if (!sections) throw new Error("Notes not found");

    const { data: isAdmin } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" });
    if (isAdmin === true) return { status: "open", reason: "admin", endsAt: null, sections };

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabaseAdmin as any;
    const { data: row } = await db.from("note_access").select("trial_started_at, premium_until").eq("user_id", context.userId).maybeSingle();
    const now = Date.now();

    if (row?.premium_until && new Date(row.premium_until).getTime() > now) {
      return { status: "open", reason: "premium", endsAt: row.premium_until, sections };
    }

    let started: string | null = row?.trial_started_at ?? null;
    if (!started) {
      if (!data.startTrial) return { status: "trial-available" };
      started = new Date(now).toISOString();
      const { error } = await db.from("note_access").upsert({ user_id: context.userId, trial_started_at: started }, { onConflict: "user_id" });
      if (error) throw new Error("Could not start trial");
    }
    const ends = new Date(started).getTime() + TRIAL_MINUTES * 60_000;
    if (ends > now) return { status: "open", reason: "trial", endsAt: new Date(ends).toISOString(), sections };
    return { status: "locked", reason: "trial-used" };
  });
