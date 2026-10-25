import { createHash } from "node:crypto";
import { createOpenAI } from "@ai-sdk/openai";
import { NoObjectGeneratedError, Output, streamText } from "ai";
import { z } from "zod/v4";
import { classifyJob, normaliseDate } from "./classify";

const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1";
const MODEL = "openai/gpt-6-astra";
const MAX_PAGE_CHARS = 40_000;

type Admin = Awaited<typeof import("@/integrations/supabase/client.server")>["supabaseAdmin"];
type Source = { id: string; name: string; url: string; organisation_type: string; content_hash: string | null };

const extractionSchema = z.object({
  postings: z.array(
    z.object({
      post_name: z.string(),
      institute: z.string().nullable(),
      number_of_vacancies: z.string().nullable(),
      qualification: z.string().nullable(),
      age_limit: z.string().nullable(),
      salary_or_stipend: z.string().nullable(),
      location: z.string().nullable(),
      application_deadline: z.string().nullable(),
      published_date: z.string().nullable(),
      notification_url: z.string().nullable(),
      apply_url: z.string().nullable(),
    }),
  ),
});
type Extracted = z.infer<typeof extractionSchema>["postings"][number];

const sha = (s: string) => createHash("sha256").update(s).digest("hex");

/** Fetch an official page and turn it into compact text where every link keeps its absolute URL. */
async function fetchPage(url: string): Promise<{ text: string; links: Set<string> }> {
  const firecrawlKey = process.env["FIRECRAWL_API_KEY"];
  const lovableKey = process.env["LOVABLE_API_KEY"];
  if (firecrawlKey && lovableKey) {
    // Optional: Firecrawl renders JavaScript-heavy pages. Used only when the connector is linked.
    const res = await fetch("https://connector-gateway.lovable.dev/firecrawl/v2/scrape", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${lovableKey}`,
        "X-Connection-Api-Key": firecrawlKey,
      },
      body: JSON.stringify({ url, formats: ["markdown", "links"], onlyMainContent: false }),
    });
    if (res.ok) {
      const data = (await res.json()) as { data?: { markdown?: string; links?: string[] }; markdown?: string; links?: string[] };
      const markdown = data.data?.markdown ?? data.markdown ?? "";
      const links = new Set(data.data?.links ?? data.links ?? []);
      if (markdown) return { text: markdown.slice(0, MAX_PAGE_CHARS), links };
    } else {
      console.error(`Firecrawl failed [${res.status}] for ${url}: ${await res.text()}`);
    }
  }

  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; HorticultureMasterJobBot/1.0; +https://horticulture-master)",
      Accept: "text/html,application/xhtml+xml",
    },
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`Page returned HTTP ${res.status}`);
  const html = await res.text();
  const links = new Set<string>();
  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<a\b[^>]*href\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, (_m, href: string, inner: string) => {
      let abs = "";
      try {
        abs = new URL(href.trim(), res.url || url).toString();
      } catch {
        return inner;
      }
      if (!/^https?:/i.test(abs)) return inner;
      links.add(abs);
      return `${inner} [link: ${abs}]`;
    })
    .replace(/<\/(p|div|tr|li|h\d|br|table|section)>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<td[^>]*>/gi, " | ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#8211;|&ndash;/g, "–")
    .replace(/[ \t]+/g, " ")
    .replace(/\n\s*\n+/g, "\n")
    .trim();
  return { text: text.slice(0, MAX_PAGE_CHARS), links };
}

/** Ask the AI to pull out only the vacancies that are explicitly on the page. */
async function extractPostings(source: Source, pageText: string, today: string): Promise<Extracted[]> {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) throw new Error("AI is not configured");
  const provider = createOpenAI({
    baseURL: GATEWAY_URL,
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
  });

  const result = streamText({
    model: provider.responses(MODEL),
    instructions: `You extract recruitment advertisements from an official Indian government / ICAR / agricultural university web page for agriculture and horticulture students.
Rules:
- Only include NEW recruitment advertisements or walk-in interviews (e.g. Young Professional I/II, SRF, JRF, Research Associate, Project Associate/Assistant, Technical Assistant, Scientist, Field Assistant, Horticulture/Agriculture Officer, NET/ARS exam notifications).
- Skip results, shortlisted/selected candidate lists, marks, tenders, circulars, transfers, LDCE/departmental exams, compassionate appointments and archived items.
- Copy facts exactly as written on the page. NEVER guess or invent vacancies, salary, eligibility, age limit or dates. Use null for anything not stated on the page.
- Dates must be YYYY-MM-DD. application_deadline = last date to apply or the walk-in/interview date when no last date is given. published_date = advertisement date if shown.
- notification_url and apply_url must be URLs that appear in the page text as [link: ...]; otherwise null.
- If the page lists only the post titles, still include them with the other fields null.
- Today's date is ${today}. Skip items whose deadline is more than 60 days in the past.
Return an empty list when there are no matching advertisements.`,
    messages: [
      {
        role: "user",
        content: `Source: ${source.name}\nPage URL: ${source.url}\n\nPage content:\n${pageText}`,
      },
    ],
    output: Output.object({ schema: extractionSchema }),
    providerOptions: {
      openai: {
        forceReasoning: true,
        reasoningEffort: "low",
        reasoningSummary: "auto",
        store: false,
        include: ["reasoning.encrypted_content"],
      },
    },
  });

  try {
    const output = await result.output;
    return output.postings;
  } catch (error) {
    if (NoObjectGeneratedError.isInstance(error) && error.text) {
      try {
        const parsed = extractionSchema.safeParse(JSON.parse(error.text));
        if (parsed.success) return parsed.data.postings;
      } catch {
        /* fall through */
      }
    }
    throw error;
  }
}

function clip(v: string | null | undefined, max: number) {
  const t = v?.replace(/\s+/g, " ").trim();
  return t ? t.slice(0, max) : null;
}

async function sendTelegram(chatId: string, text: string) {
  const lovableKey = process.env["LOVABLE_API_KEY"];
  const telegramKey = process.env["TELEGRAM_API_KEY"];
  if (!lovableKey || !telegramKey) return { sent: false, reason: "Telegram not connected" };
  const res = await fetch("https://connector-gateway.lovable.dev/telegram/sendMessage", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${lovableKey}`,
      "X-Connection-Api-Key": telegramKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML", disable_web_page_preview: true }),
  });
  if (!res.ok) {
    const body = await res.text();
    console.error(`Telegram send failed [${res.status}]: ${body}`);
    return { sent: false, reason: `Telegram error ${res.status}` };
  }
  return { sent: true };
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function formatTelegramAlert(job: {
  title: string;
  institute: string | null;
  deadline: string | null;
  notification_url: string | null;
  source_url: string | null;
  status: string;
}) {
  const link = job.notification_url ?? job.source_url;
  return [
    `🚨 <b>${esc(job.title)}</b>`,
    job.institute ? `🏛 ${esc(job.institute)}` : null,
    job.deadline ? `⏳ Last date: ${job.deadline}` : null,
    job.status === "verified" ? "✅ Verified by Horticulture Master" : "ℹ️ Auto-detected — please check the official notice",
    link ? `🔗 ${esc(link)}` : null,
  ]
    .filter(Boolean)
    .join("\n");
}

/** Send alerts for postings that haven't been announced yet (respects the admin's alert mode). */
export async function sendPendingAlerts(admin: Admin) {
  const { data: settings } = await admin.from("job_monitor_settings").select("*").eq("id", 1).maybeSingle();
  if (!settings || settings.alert_mode === "off" || !settings.telegram_chat_id) return 0;
  const statuses = settings.alert_mode === "on_detect" ? ["detected", "verified"] : ["verified"];
  const { data: pending } = await admin
    .from("job_postings")
    .select("id, title, institute, deadline, notification_url, source_url, status")
    .is("alerted_at", null)
    .in("status", statuses)
    .order("created_at", { ascending: true })
    .limit(20);
  let sent = 0;
  for (const job of pending ?? []) {
    const r = await sendTelegram(settings.telegram_chat_id, formatTelegramAlert(job));
    if (!r.sent) break;
    await admin.from("job_postings").update({ alerted_at: new Date().toISOString() }).eq("id", job.id);
    sent++;
  }
  return sent;
}

/**
 * Check every active official source, extract new vacancies and store them as "detected".
 * Duplicate postings are ignored via a unique fingerprint; unchanged pages are skipped to save AI cost.
 */
export async function runJobScan(opts: { trigger: "schedule" | "manual"; force?: boolean; sourceId?: string }) {
  const { supabaseAdmin: admin } = await import("@/integrations/supabase/client.server");

  const { data: settings } = await admin.from("job_monitor_settings").select("*").eq("id", 1).maybeSingle();
  if (opts.trigger === "schedule" && settings?.last_run_at && !opts.force) {
    const hoursSince = (Date.now() - new Date(settings.last_run_at).getTime()) / 3_600_000;
    if (hoursSince < settings.scan_interval_hours - 0.25) {
      return { skipped: true, reason: "Not due yet", sourcesChecked: 0, newPostings: 0, errors: [] as string[] };
    }
  }

  const { data: run } = await admin.from("job_monitor_runs").insert({ trigger: opts.trigger }).select("id").single();
  await admin.from("job_monitor_settings").update({ last_run_at: new Date().toISOString() }).eq("id", 1);

  let query = admin.from("job_sources").select("id, name, url, organisation_type, content_hash").eq("active", true);
  if (opts.sourceId) query = query.eq("id", opts.sourceId);
  const { data: sources } = await query;

  const today = new Date().toISOString().slice(0, 10);
  const errors: string[] = [];
  let newPostings = 0;
  let checked = 0;

  for (const source of sources ?? []) {
    checked++;
    try {
      const page = await fetchPage(source.url);
      const hash = sha(page.text);
      if (!opts.force && source.content_hash === hash) {
        await admin
          .from("job_sources")
          .update({ last_checked_at: new Date().toISOString(), last_status: "unchanged", last_error: null })
          .eq("id", source.id);
        continue;
      }

      const postings = await extractPostings(source, page.text, today);
      let added = 0;
      for (const p of postings) {
        const title = clip(p.post_name, 300);
        if (!title) continue;
        const notificationUrl = p.notification_url && page.links.has(p.notification_url) ? p.notification_url : null;
        const applyUrl = p.apply_url && page.links.has(p.apply_url) ? p.apply_url : null;
        const deadline = normaliseDate(p.application_deadline);
        const published = normaliseDate(p.published_date);
        const institute = clip(p.institute, 200) ?? source.name.split("—")[0]?.trim() ?? null;
        const fingerprint = sha(
          (notificationUrl ? notificationUrl.toLowerCase() : `${source.id}|${title.toLowerCase()}|${deadline ?? ""}|${published ?? ""}`).trim(),
        );
        const { data: inserted, error } = await admin
          .from("job_postings")
          .upsert(
            {
              source_id: source.id,
              fingerprint,
              title,
              institute,
              categories: classifyJob({ title, institute, organisationType: source.organisation_type }),
              vacancies: clip(p.number_of_vacancies, 100),
              qualification: clip(p.qualification, 1000),
              age_limit: clip(p.age_limit, 200),
              salary: clip(p.salary_or_stipend, 300),
              location: clip(p.location, 200),
              deadline,
              published_date: published,
              notification_url: notificationUrl,
              apply_url: applyUrl,
              source_url: source.url,
            },
            { onConflict: "fingerprint", ignoreDuplicates: true },
          )
          .select("id");
        if (error) errors.push(`${source.name}: could not save "${title}"`);
        else if (inserted?.length) added++;
      }
      newPostings += added;
      await admin
        .from("job_sources")
        .update({
          last_checked_at: new Date().toISOString(),
          last_status: `ok — ${postings.length} found, ${added} new`,
          last_error: null,
          content_hash: hash,
        })
        .eq("id", source.id);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error(`job scan failed for ${source.url}`, e);
      errors.push(`${source.name}: ${msg}`);
      await admin
        .from("job_sources")
        .update({ last_checked_at: new Date().toISOString(), last_status: "error", last_error: msg.slice(0, 500) })
        .eq("id", source.id);
    }
  }

  let alertsSent = 0;
  try {
    alertsSent = await sendPendingAlerts(admin);
  } catch (e) {
    console.error("alerts failed", e);
    errors.push("Alerts: sending failed");
  }

  if (run) {
    await admin
      .from("job_monitor_runs")
      .update({ finished_at: new Date().toISOString(), sources_checked: checked, new_postings: newPostings, errors })
      .eq("id", run.id);
  }
  return { skipped: false, sourcesChecked: checked, newPostings, alertsSent, errors };
}
