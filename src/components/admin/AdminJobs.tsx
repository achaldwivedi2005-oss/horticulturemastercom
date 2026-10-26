import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { format } from "date-fns";
import { toast } from "sonner";
import { Check, Loader2, Pencil, Pin, Play, Plus, Send, Trash2, X, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { runJobScanNow, sendJobAlertsNow } from "@/lib/jobs/jobs.functions";
import { degreeLevels } from "@/lib/jobs/classify";
import { indianStates } from "@/lib/universities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EmptyState } from "@/components/site/EmptyState";
import { cn } from "@/lib/utils";
import { Briefcase } from "lucide-react";

type Posting = Database["public"]["Tables"]["job_postings"]["Row"];
type PostingInsert = Database["public"]["Tables"]["job_postings"]["Insert"];
type Source = Database["public"]["Tables"]["job_sources"]["Row"];
type Settings = Database["public"]["Tables"]["job_monitor_settings"]["Row"];

const fmt = (d: string | null) => (d ? format(new Date(d), "d MMM yyyy, HH:mm") : "—");

function invalidateJobs(qc: ReturnType<typeof useQueryClient>) {
  qc.invalidateQueries({ queryKey: ["admin-job-postings"] });
  qc.invalidateQueries({ queryKey: ["job-postings"] });
}

/* ------------------------------ Review queue ------------------------------ */

function ReviewQueue() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState<"detected" | "verified" | "rejected">("detected");
  const [editing, setEditing] = useState<Partial<Posting> | null>(null);
  const postings = useQuery({
    queryKey: ["admin-job-postings", filter],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("job_postings")
        .select("*")
        .eq("status", filter)
        .order("is_pinned", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(200);
      if (error) throw error;
      return data;
    },
  });

  const update = useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Partial<Posting> }) => {
      const { error } = await supabase.from("job_postings").update(patch).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => invalidateJobs(qc),
    onError: (e: Error) => toast.error(e.message),
  });
  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("job_postings").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      invalidateJobs(qc);
      toast.success("Deleted");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        {(["detected", "verified", "rejected"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            aria-pressed={filter === f}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-sm font-medium capitalize",
              filter === f ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background",
            )}
          >
            {f === "detected" ? "Pending review" : f}
          </button>
        ))}
        <Button size="sm" variant="soft" className="ml-auto" onClick={() => setEditing({ status: "verified", degree_levels: [], categories: [] })}>
          <Plus /> Add job manually
        </Button>
      </div>

      <div className="mt-4 space-y-3">
        {postings.isLoading ? (
          <Loader2 className="mx-auto size-5 animate-spin text-muted-foreground" />
        ) : !postings.data?.length ? (
          <EmptyState icon={Briefcase} title="Nothing here" description="Postings found by the monitor will appear here." />
        ) : (
          postings.data.map((p) => (
            <div key={p.id} className="rounded-2xl border border-border bg-card p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">
                    {p.is_pinned && <Pin className="mr-1 inline size-3.5 text-primary" />}
                    {p.is_breaking && <Zap className="mr-1 inline size-3.5 text-destructive" />}
                    {p.title}
                  </p>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {p.institute ?? "Institute not stated"} · Deadline {p.deadline ?? "not verified"} · Found {fmt(p.created_at)}
                  </p>
                  {p.degree_levels.length > 0 && <p className="mt-1 text-xs text-muted-foreground">{p.degree_levels.join(", ")}</p>}
                  {p.notification_url && (
                    <a href={p.notification_url} target="_blank" rel="noopener noreferrer" className="mt-1 block truncate text-xs text-primary underline">
                      {p.notification_url}
                    </a>
                  )}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {p.status !== "verified" && (
                    <Button
                      size="sm"
                      variant="hero"
                      onClick={() => update.mutate({ id: p.id, patch: { status: "verified", last_verified_at: new Date().toISOString() } })}
                    >
                      <Check /> Verify & publish
                    </Button>
                  )}
                  {p.status !== "rejected" && (
                    <Button size="sm" variant="outline" onClick={() => update.mutate({ id: p.id, patch: { status: "rejected" } })}>
                      <X /> Reject
                    </Button>
                  )}
                  <Button size="icon-sm" variant="ghost" aria-label="Pin" onClick={() => update.mutate({ id: p.id, patch: { is_pinned: !p.is_pinned } })}>
                    <Pin className={cn(p.is_pinned && "text-primary")} />
                  </Button>
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    aria-label="Mark breaking"
                    onClick={() => update.mutate({ id: p.id, patch: { is_breaking: !p.is_breaking } })}
                  >
                    <Zap className={cn(p.is_breaking && "text-destructive")} />
                  </Button>
                  <Button size="icon-sm" variant="ghost" aria-label="Edit" onClick={() => setEditing(p)}>
                    <Pencil />
                  </Button>
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    aria-label="Delete"
                    onClick={() => confirm("Delete this posting permanently?") && remove.mutate(p.id)}
                  >
                    <Trash2 />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      {editing && <PostingEditor value={editing} onClose={() => setEditing(null)} />}
    </div>
  );
}

function PostingEditor({ value, onClose }: { value: Partial<Posting>; onClose: () => void }) {
  const qc = useQueryClient();
  const [v, setV] = useState<Partial<Posting>>(value);
  const set = <K extends keyof Posting>(k: K, val: Posting[K] | null) => setV((s) => ({ ...s, [k]: val }));
  const text = (k: keyof Posting, label: string, area = false) => (
    <div className="space-y-1">
      <Label htmlFor={`f-${k}`}>{label}</Label>
      {area ? (
        <Textarea id={`f-${k}`} value={(v[k] as string | null) ?? ""} onChange={(e) => set(k, (e.target.value || null) as never)} rows={3} />
      ) : (
        <Input id={`f-${k}`} value={(v[k] as string | null) ?? ""} onChange={(e) => set(k, (e.target.value || null) as never)} />
      )}
    </div>
  );
  const save = useMutation({
    mutationFn: async () => {
      if (!v.title?.trim()) throw new Error("Title is required");
      const { id, created_at: _c, updated_at: _u, ...rest } = v as Posting;
      if (id) {
        const { error } = await supabase.from("job_postings").update(rest).eq("id", id);
        if (error) throw error;
      } else {
        const row: PostingInsert = {
          ...(rest as PostingInsert),
          title: v.title.trim(),
          fingerprint: `manual-${crypto.randomUUID()}`,
          last_verified_at: new Date().toISOString(),
        };
        const { error } = await supabase.from("job_postings").insert(row);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      invalidateJobs(qc);
      toast.success("Saved");
      onClose();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{v.id ? "Edit posting" : "Add job manually"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">{text("title", "Post / title *")}</div>
          {text("institute", "Institute")}
          {text("department", "Department")}
          {text("vacancies", "Vacancies")}
          {text("salary", "Salary / fellowship")}
          {text("age_limit", "Age limit")}
          {text("application_fee", "Application fee")}
          {text("application_mode", "Mode (Online / Walk-in…)")}
          {text("location", "Location")}
          <div className="space-y-1">
            <Label htmlFor="f-opening">Opening date</Label>
            <Input id="f-opening" type="date" value={v.opening_date ?? ""} onChange={(e) => set("opening_date", e.target.value || null)} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="f-deadline">Closing date (deadline)</Label>
            <Input id="f-deadline" type="date" value={v.deadline ?? ""} onChange={(e) => set("deadline", e.target.value || null)} />
          </div>
          <div className="sm:col-span-2">{text("qualification", "Essential qualification", true)}</div>
          <div className="space-y-2 sm:col-span-2">
            <Label>Eligible degrees</Label>
            <div className="flex flex-wrap gap-3">
              {degreeLevels.map((d) => (
                <label key={d} className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={v.degree_levels?.includes(d) ?? false}
                    onCheckedChange={(c) =>
                      set("degree_levels", c ? [...(v.degree_levels ?? []), d] : (v.degree_levels ?? []).filter((x) => x !== d))
                    }
                  />
                  {d}
                </label>
              ))}
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <Switch checked={!!v.phd_compulsory} onCheckedChange={(c) => set("phd_compulsory", c)} /> Ph.D. compulsory
          </label>
          <label className="flex items-center gap-2 text-sm">
            <Switch checked={v.net_compulsory === false} onCheckedChange={(c) => set("net_compulsory", c ? false : null)} /> No NET required
          </label>
          <div className="space-y-1">
            <Label>Scope</Label>
            <Select value={v.scope ?? "none"} onValueChange={(s) => set("scope", s === "none" ? null : s)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Not stated</SelectItem>
                <SelectItem value="All India">All India</SelectItem>
                <SelectItem value="State Specific">State specific</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label>State</Label>
            <Select value={v.state_name ?? "none"} onValueChange={(s) => set("state_name", s === "none" ? null : s)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-72">
                <SelectItem value="none">—</SelectItem>
                <SelectItem value="All India">All India</SelectItem>
                {indianStates.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {text("specialization", "Specialisation subject")}
          {text("published_date", "Published date (YYYY-MM-DD)")}
          <div className="sm:col-span-2">{text("notification_url", "Official notification link")}</div>
          <div className="sm:col-span-2">{text("apply_url", "Apply link")}</div>
          <div className="sm:col-span-2">{text("summary_en", "Summary (English)", true)}</div>
          <div className="sm:col-span-2">{text("summary_hi", "Summary (Hindi)", true)}</div>
          <div className="sm:col-span-2">{text("why_it_matters", "Why it matters")}</div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="hero" onClick={() => save.mutate()} disabled={save.isPending}>
            {save.isPending && <Loader2 className="animate-spin" />} Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* --------------------------------- Sources -------------------------------- */

function SourcesManager() {
  const qc = useQueryClient();
  const scan = useServerFn(runJobScanNow);
  const [form, setForm] = useState({ name: "", url: "", organisation_type: "ICAR" });
  const sources = useQuery({
    queryKey: ["admin-job-sources"],
    queryFn: async () => {
      const { data, error } = await supabase.from("job_sources").select("*").order("name");
      if (error) throw error;
      return data;
    },
  });
  const refresh = () => qc.invalidateQueries({ queryKey: ["admin-job-sources"] });
  const add = useMutation({
    mutationFn: async () => {
      if (!form.name.trim() || !/^https?:\/\//i.test(form.url.trim())) throw new Error("Enter a name and a full https:// link");
      const { error } = await supabase.from("job_sources").insert({ ...form, name: form.name.trim(), url: form.url.trim() });
      if (error) throw error;
    },
    onSuccess: () => {
      setForm({ name: "", url: "", organisation_type: "ICAR" });
      refresh();
      toast.success("Source added");
    },
    onError: (e: Error) => toast.error(e.message),
  });
  const patch = useMutation({
    mutationFn: async ({ id, p }: { id: string; p: Partial<Source> | null }) => {
      const { error } = p ? await supabase.from("job_sources").update(p).eq("id", id) : await supabase.from("job_sources").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: refresh,
    onError: (e: Error) => toast.error(e.message),
  });
  const scanOne = useMutation({
    mutationFn: (sourceId: string) => scan({ data: { sourceId, force: true } }),
    onSuccess: (r) => {
      refresh();
      invalidateJobs(qc);
      toast.success(`Checked. ${r.newPostings ?? 0} new posting(s).${r.errors?.length ? ` ${r.errors[0]}` : ""}`);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="space-y-4">
      <div className="grid gap-2 rounded-2xl border border-border bg-card p-4 sm:grid-cols-[1fr_1.5fr_auto_auto]">
        <Input placeholder="Source name (e.g. ICAR-CISH Lucknow)" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <Input placeholder="https://… official recruitment page" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} />
        <Select value={form.organisation_type} onValueChange={(t) => setForm({ ...form, organisation_type: t })}>
          <SelectTrigger className="sm:w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {["ICAR", "University", "Government", "Other"].map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="hero" onClick={() => add.mutate()} disabled={add.isPending}>
          <Plus /> Add
        </Button>
      </div>
      {sources.data?.map((s) => (
        <div key={s.id} className="flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-card p-4">
          <Switch checked={s.active} onCheckedChange={(c) => patch.mutate({ id: s.id, p: { active: c } })} aria-label="Active" />
          <div className="min-w-0 flex-1">
            <p className="font-medium">
              {s.name} <span className="text-xs text-muted-foreground">· {s.organisation_type}</span>
            </p>
            <a href={s.url} target="_blank" rel="noopener noreferrer" className="block truncate text-xs text-primary underline">
              {s.url}
            </a>
            <p className={cn("mt-0.5 text-xs", s.last_error ? "text-destructive" : "text-muted-foreground")}>
              Last checked {fmt(s.last_checked_at)} · {s.last_error ?? s.last_status ?? "not checked yet"}
            </p>
          </div>
          <Button size="sm" variant="outline" onClick={() => scanOne.mutate(s.id)} disabled={scanOne.isPending}>
            {scanOne.isPending && scanOne.variables === s.id ? <Loader2 className="animate-spin" /> : <Play />} Check now
          </Button>
          <Button size="icon-sm" variant="ghost" aria-label="Remove source" onClick={() => confirm(`Remove ${s.name}?`) && patch.mutate({ id: s.id, p: null })}>
            <Trash2 />
          </Button>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------ Settings + log ----------------------------- */

function MonitorSettings() {
  const qc = useQueryClient();
  const scan = useServerFn(runJobScanNow);
  const sendAlerts = useServerFn(sendJobAlertsNow);
  const settings = useQuery({
    queryKey: ["admin-job-settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("job_monitor_settings").select("*").eq("id", 1).single();
      if (error) throw error;
      return data;
    },
  });
  const runs = useQuery({
    queryKey: ["admin-job-runs"],
    queryFn: async () => {
      const { data, error } = await supabase.from("job_monitor_runs").select("*").order("started_at", { ascending: false }).limit(15);
      if (error) throw error;
      return data;
    },
  });
  const save = useMutation({
    mutationFn: async (p: Partial<Settings>) => {
      const { error } = await supabase.from("job_monitor_settings").update(p).eq("id", 1);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-job-settings"] });
      qc.invalidateQueries({ queryKey: ["job-postings"] });
      qc.invalidateQueries({ queryKey: ["jobs-closing-soon-days"] });
      toast.success("Settings saved");
    },
    onError: (e: Error) => toast.error(e.message),
  });
  const runAll = useMutation({
    mutationFn: () => scan({ data: { force: true } }),
    onSuccess: (r) => {
      qc.invalidateQueries({ queryKey: ["admin-job-runs"] });
      qc.invalidateQueries({ queryKey: ["admin-job-sources"] });
      invalidateJobs(qc);
      toast.success(`Checked ${r.sourcesChecked ?? 0} sources · ${r.newPostings ?? 0} new · ${r.errors?.length ?? 0} errors`);
    },
    onError: (e: Error) => toast.error(e.message),
  });
  const alerts = useMutation({
    mutationFn: () => sendAlerts(),
    onSuccess: (r) =>
      r.telegramConnected ? toast.success(`${r.sent} alert(s) sent`) : toast.error("Telegram bot is not connected yet — alerts can't be sent."),
    onError: (e: Error) => toast.error(e.message),
  });
  const s = settings.data;
  const [chatId, setChatId] = useState<string | null>(null);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-5 rounded-2xl border border-border bg-card p-5">
        <div className="flex flex-wrap gap-2">
          <Button variant="hero" onClick={() => runAll.mutate()} disabled={runAll.isPending}>
            {runAll.isPending ? <Loader2 className="animate-spin" /> : <Play />} Run monitor now
          </Button>
          <Button variant="outline" onClick={() => alerts.mutate()} disabled={alerts.isPending}>
            <Send /> Send pending Telegram alerts
          </Button>
        </div>
        {runAll.isPending && <p className="text-xs text-muted-foreground">Checking every source — this can take a minute or two.</p>}
        {s?.ai_paused_reason && (
          <p className="rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
            Monitoring paused since {fmt(s.ai_paused_at)}: {s.ai_paused_reason}
          </p>
        )}
        {s && (
          <>
            <label className="flex items-center justify-between gap-3 text-sm">
              <span>
                <strong>Auto-publish detected jobs</strong>
                <span className="block text-xs text-muted-foreground">On: shown immediately with an "unverified" label. Off: hidden until you verify.</span>
              </span>
              <Switch checked={s.auto_publish} onCheckedChange={(c) => save.mutate({ auto_publish: c })} />
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <Label>Check sources every</Label>
                <Select value={String(s.scan_interval_hours)} onValueChange={(h) => save.mutate({ scan_interval_hours: Number(h) })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[3, 6, 12, 24].map((h) => (
                      <SelectItem key={h} value={String(h)}>
                        {h} hours
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>"Closing soon" when deadline within</Label>
                <Select value={String(s.closing_soon_days)} onValueChange={(d) => save.mutate({ closing_soon_days: Number(d) })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[3, 5, 7, 10, 14].map((d) => (
                      <SelectItem key={d} value={String(d)}>
                        {d} days
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Telegram alerts</Label>
                <Select value={s.alert_mode} onValueChange={(m) => save.mutate({ alert_mode: m })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="on_verify">When I verify a job</SelectItem>
                    <SelectItem value="on_detect">As soon as detected</SelectItem>
                    <SelectItem value="off">Off</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="chat-id">Telegram channel (e.g. @Horticulturemaster)</Label>
                <div className="flex gap-2">
                  <Input id="chat-id" value={chatId ?? s.telegram_chat_id ?? ""} onChange={(e) => setChatId(e.target.value)} />
                  <Button size="sm" variant="soft" onClick={() => save.mutate({ telegram_chat_id: (chatId ?? "").trim() || null })}>
                    Save
                  </Button>
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Last automatic run: {fmt(s.last_run_at)}</p>
          </>
        )}
      </div>
      <div className="rounded-2xl border border-border bg-card p-5">
        <p className="font-semibold">Run history</p>
        <ul className="mt-3 space-y-2 text-sm">
          {runs.data?.map((r) => {
            const errs = Array.isArray(r.errors) ? (r.errors as string[]) : [];
            return (
              <li key={r.id} className="rounded-xl bg-muted/60 p-3">
                <p>
                  {fmt(r.started_at)} · <span className="capitalize">{r.trigger}</span> · {r.sources_checked} sources · {r.new_postings} new
                </p>
                {errs.length > 0 && (
                  <details className="mt-1 text-xs text-destructive">
                    <summary>{errs.length} error(s)</summary>
                    <ul className="mt-1 list-disc pl-4">
                      {errs.map((e, i) => (
                        <li key={i}>{e}</li>
                      ))}
                    </ul>
                  </details>
                )}
              </li>
            );
          }) ?? <li className="text-muted-foreground">No runs yet.</li>}
        </ul>
      </div>
    </div>
  );
}

export function AdminJobs() {
  const [tab, setTab] = useState<"queue" | "sources" | "settings">("queue");
  return (
    <div>
      <div className="mb-5 flex flex-wrap gap-2">
        {(
          [
            ["queue", "Review queue"],
            ["sources", "Monitored sources"],
            ["settings", "Settings & logs"],
          ] as const
        ).map(([k, label]) => (
          <Button key={k} size="sm" variant={tab === k ? "default" : "outline"} onClick={() => setTab(k)}>
            {label}
          </Button>
        ))}
      </div>
      {tab === "queue" ? <ReviewQueue /> : tab === "sources" ? <SourcesManager /> : <MonitorSettings />}
    </div>
  );
}
