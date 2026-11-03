import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { toast } from "sonner";
import { Bell, Eye, EyeOff, Loader2, Pencil, Pin, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Database, Json } from "@/integrations/supabase/types";
import { normaliseDate } from "@/lib/jobs/classify";
import { parseKeyDates, updateExams, updateKinds, type KeyDate } from "@/lib/updates/updates";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EmptyState } from "@/components/site/EmptyState";
import { cn } from "@/lib/utils";

type Row = Database["public"]["Tables"]["exam_updates"]["Row"];
type Insert = Database["public"]["Tables"]["exam_updates"]["Insert"];

/** Key dates are edited one per line as "Label | 2026-11-02" or "Label | November 2026 (tentative)". */
function keyDatesToText(value: unknown) {
  return parseKeyDates(value)
    .map((d) => `${d.label} | ${d.date ?? d.text ?? ""}`)
    .join("\n");
}
function textToKeyDates(text: string): KeyDate[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label, ...rest] = line.split("|");
      const value = rest.join("|").trim();
      const date = normaliseDate(value);
      return date ? { label: label!.trim(), date } : { label: label!.trim(), text: value || null };
    });
}

const empty: Partial<Row> = { exam: "ICAR PG/PhD", kind: "Notice", status: "published", is_pinned: false, key_dates: [] };

export function AdminUpdates() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Partial<Row> | null>(null);
  const [datesText, setDatesText] = useState("");

  const list = useQuery({
    queryKey: ["admin-exam-updates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("exam_updates")
        .select("*")
        .order("is_pinned", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(300);
      if (error) throw error;
      return data;
    },
  });

  const refresh = () => {
    void qc.invalidateQueries({ queryKey: ["admin-exam-updates"] });
    void qc.invalidateQueries({ queryKey: ["exam-updates"] });
  };

  const update = useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Partial<Row> }) => {
      const { error } = await supabase.from("exam_updates").update(patch).eq("id", id);
      if (error) throw error;
    },
    onSuccess: refresh,
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("exam_updates").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      refresh();
      toast.success("Update deleted");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const save = useMutation({
    mutationFn: async (row: Partial<Row>) => {
      if (!row.title?.trim()) throw new Error("Title is required");
      const payload: Insert = {
        title: row.title.trim(),
        exam: row.exam ?? "Other",
        kind: row.kind ?? "Notice",
        summary: row.summary?.trim() || null,
        summary_hi: row.summary_hi?.trim() || null,
        key_dates: textToKeyDates(datesText) as unknown as Json,
        last_date: normaliseDate(row.last_date ?? null),
        official_url: row.official_url?.trim() || null,
        source_name: row.source_name?.trim() || null,
        published_date: normaliseDate(row.published_date ?? null),
        is_pinned: !!row.is_pinned,
        status: row.status ?? "published",
      };
      const { error } = row.id
        ? await supabase.from("exam_updates").update(payload).eq("id", row.id)
        : await supabase.from("exam_updates").insert(payload);
      if (error) throw error;
    },
    onSuccess: () => {
      refresh();
      setEditing(null);
      toast.success("Saved");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const open = (row: Partial<Row>) => {
    setEditing(row);
    setDatesText(keyDatesToText(row.key_dates));
  };
  const set = (patch: Partial<Row>) => setEditing((e) => ({ ...e, ...patch }));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-xl text-sm text-muted-foreground">
          Exam, counselling, form-date and horticulture news posts shown on the "Exams & News" page and the homepage.
        </p>
        <Button variant="hero" onClick={() => open(empty)}>
          <Plus /> Add update
        </Button>
      </div>

      <div className="mt-6 grid gap-3">
        {list.isLoading ? (
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" /> Loading…
          </p>
        ) : !list.data?.length ? (
          <EmptyState icon={Bell} title="No updates yet" description="Add your first exam or counselling update." />
        ) : (
          list.data.map((r) => (
            <article
              key={r.id}
              className={cn("rounded-2xl border bg-card p-4", r.status === "draft" ? "border-dashed border-border opacity-70" : "border-border")}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                    {r.exam} · {r.kind}
                    {r.status === "draft" ? " · Hidden" : ""}
                    {r.last_date ? ` · Last date ${format(new Date(r.last_date), "d MMM yyyy")}` : ""}
                  </p>
                  <p className="mt-1 font-semibold">{r.title}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={r.is_pinned ? "Unpin" : "Pin"}
                    onClick={() => update.mutate({ id: r.id, patch: { is_pinned: !r.is_pinned } })}
                  >
                    <Pin className={r.is_pinned ? "text-primary" : "text-muted-foreground"} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={r.status === "draft" ? "Publish" : "Hide"}
                    onClick={() => update.mutate({ id: r.id, patch: { status: r.status === "draft" ? "published" : "draft" } })}
                  >
                    {r.status === "draft" ? <EyeOff /> : <Eye />}
                  </Button>
                  <Button variant="ghost" size="icon" aria-label="Edit" onClick={() => open(r)}>
                    <Pencil />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Delete"
                    onClick={() => {
                      if (window.confirm("Delete this update?")) remove.mutate(r.id);
                    }}
                  >
                    <Trash2 className="text-destructive" />
                  </Button>
                </div>
              </div>
            </article>
          ))
        )}
      </div>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editing?.id ? "Edit update" : "Add update"}</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="grid gap-4">
              <div className="grid gap-1.5">
                <Label htmlFor="u-title">Title</Label>
                <Input id="u-title" value={editing.title ?? ""} onChange={(e) => set({ title: e.target.value })} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-1.5">
                  <Label>Exam / section</Label>
                  <Select value={editing.exam ?? "Other"} onValueChange={(v) => set({ exam: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {updateExams.map((e) => <SelectItem key={e} value={e}>{e}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-1.5">
                  <Label>Type</Label>
                  <Select value={editing.kind ?? "Notice"} onValueChange={(v) => set({ kind: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {updateKinds.map((k) => <SelectItem key={k} value={k}>{k}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="u-sum">Summary (English)</Label>
                <Textarea id="u-sum" rows={4} value={editing.summary ?? ""} onChange={(e) => set({ summary: e.target.value })} />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="u-hi">Summary (Hindi, optional)</Label>
                <Textarea id="u-hi" rows={3} value={editing.summary_hi ?? ""} onChange={(e) => set({ summary_hi: e.target.value })} />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="u-dates">Important dates (one per line: Label | 2026-11-02 or Label | November 2026 (tentative))</Label>
                <Textarea id="u-dates" rows={4} value={datesText} onChange={(e) => setDatesText(e.target.value)} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-1.5">
                  <Label htmlFor="u-last">Last date (for countdown)</Label>
                  <Input id="u-last" type="date" value={editing.last_date ?? ""} onChange={(e) => set({ last_date: e.target.value || null })} />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="u-pub">Notice date</Label>
                  <Input id="u-pub" type="date" value={editing.published_date ?? ""} onChange={(e) => set({ published_date: e.target.value || null })} />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-1.5">
                  <Label htmlFor="u-url">Official link</Label>
                  <Input id="u-url" type="url" placeholder="https://" value={editing.official_url ?? ""} onChange={(e) => set({ official_url: e.target.value })} />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="u-src">Source name</Label>
                  <Input id="u-src" placeholder="ICAR, ASRB…" value={editing.source_name ?? ""} onChange={(e) => set({ source_name: e.target.value })} />
                </div>
              </div>
              <div className="flex flex-wrap gap-6">
                <label className="flex items-center gap-2 text-sm">
                  <Switch checked={!!editing.is_pinned} onCheckedChange={(v) => set({ is_pinned: v })} /> Pin as important
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <Switch checked={editing.status !== "draft"} onCheckedChange={(v) => set({ status: v ? "published" : "draft" })} /> Visible on site
                </label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
            <Button variant="hero" disabled={save.isPending} onClick={() => editing && save.mutate(editing)}>
              {save.isPending && <Loader2 className="animate-spin" />} Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
