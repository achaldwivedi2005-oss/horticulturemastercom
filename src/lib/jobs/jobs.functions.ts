import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function assertAdmin(supabase: { rpc: (fn: "has_role", args: { _user_id: string; _role: "admin" }) => PromiseLike<{ data: boolean | null }> }, userId: string) {
  const { data } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" });
  if (data !== true) throw new Error("Forbidden");
}

/** Admin: run the job monitor now (optionally for one source). */
export const runJobScanNow = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ sourceId: z.string().uuid().optional(), force: z.boolean().optional() }).parse(input ?? {}))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { runJobScan } = await import("./scan.server");
    return runJobScan({ trigger: "manual", force: data.force ?? true, ...(data.sourceId ? { sourceId: data.sourceId } : {}) });
  });

/** Admin: send any pending Telegram alerts (e.g. right after verifying postings). */
export const sendJobAlertsNow = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { sendPendingAlerts } = await import("./scan.server");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const sent = await sendPendingAlerts(supabaseAdmin);
    return { sent, telegramConnected: !!process.env["TELEGRAM_API_KEY"] };
  });
