import { createFileRoute } from "@tanstack/react-router";
import { authenticateCronRequest } from "@/integrations/supabase/cron-auth";

// Called by the managed scheduler. Only requests carrying the scheduler's secret are accepted.
export const Route = createFileRoute("/api/public/jobs/scan")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const authFailure = await authenticateCronRequest(request);
        if (authFailure) return authFailure;
        const { runJobScan } = await import("@/lib/jobs/scan.server");
        try {
          const result = await runJobScan({ trigger: "schedule" });
          return Response.json({ success: true, ...result });
        } catch (e) {
          console.error("scheduled job scan failed", e);
          return Response.json({ success: false, error: "Scan failed" }, { status: 500 });
        }
      },
    },
  },
});
