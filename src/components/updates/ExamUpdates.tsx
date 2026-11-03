import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Bell, CalendarDays, ExternalLink, Languages, Loader2, Pin, Search } from "lucide-react";
import { examUpdatesQuery, parseKeyDates, updateExams, updateWindow, type ExamUpdate, type UpdateWindow } from "@/lib/updates/updates";
import { daysUntil } from "@/lib/jobs/classify";
import { Reveal } from "@/components/site/Reveal";
import { EmptyState } from "@/components/site/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

function fmt(date: string | null | undefined) {
  if (!date) return null;
  return new Date(`${date.slice(0, 10)}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

const windowStyle: Record<UpdateWindow, string> = {
  OPEN: "bg-primary text-primary-foreground",
  "CLOSING SOON": "bg-destructive text-destructive-foreground",
  CLOSED: "bg-muted text-muted-foreground",
};

function UpdateCard({ item, lang }: { item: ExamUpdate; lang: "en" | "hi" }) {
  const win = updateWindow(item.last_date);
  const days = daysUntil(item.last_date);
  const dates = parseKeyDates(item.key_dates);
  const summary = lang === "hi" && item.summary_hi ? item.summary_hi : item.summary;

  return (
    <article
      className={cn(
        "card-lift flex h-full flex-col rounded-3xl border bg-card p-5 shadow-soft sm:p-6",
        item.is_pinned ? "border-primary/40" : "border-border",
        win === "CLOSED" && "opacity-80",
      )}
    >
      <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-wider">
        {item.is_pinned && (
          <span className="inline-flex items-center gap-1 rounded-full bg-sun px-2.5 py-1 text-sun-foreground">
            <Pin className="size-3" /> Important
          </span>
        )}
        <span className="rounded-full bg-secondary px-2.5 py-1 text-primary">{item.exam}</span>
        <span className="rounded-full border border-border px-2.5 py-1 text-muted-foreground">{item.kind}</span>
        {win && <span className={cn("rounded-full px-2.5 py-1", windowStyle[win])}>{win}</span>}
      </div>

      <h3 className="mt-4 font-sans text-lg font-semibold leading-snug tracking-normal">{item.title}</h3>
      {summary && <p className="mt-2 text-sm text-muted-foreground text-pretty">{summary}</p>}

      {dates.length > 0 && (
        <ul className="mt-4 divide-y divide-border rounded-2xl border border-border bg-muted/40 text-sm">
          {dates.map((d) => (
            <li key={d.label} className="flex items-start justify-between gap-3 px-3.5 py-2">
              <span className="text-muted-foreground">{d.label}</span>
              <span className="text-right font-medium">{d.date ? fmt(d.date) : d.text}</span>
            </li>
          ))}
        </ul>
      )}

      {item.last_date && win !== "CLOSED" && days !== null && (
        <p className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary">
          <CalendarDays className="size-4" /> Last date {fmt(item.last_date)} ·{" "}
          {days === 0 ? "ends today" : `${days} day${days === 1 ? "" : "s"} left`}
        </p>
      )}

      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-5">
        <p className="text-xs text-muted-foreground">
          {item.source_name ? `Source: ${item.source_name}` : "Official source"}
          {item.published_date ? ` · ${fmt(item.published_date)}` : ""}
        </p>
        {item.official_url && (
          <Button asChild size="sm" variant="soft">
            <a href={item.official_url} target="_blank" rel="noopener noreferrer">
              Official notice <ExternalLink />
            </a>
          </Button>
        )}
      </div>
    </article>
  );
}

/** Full Exams & News board with exam filters, search and English/Hindi toggle. */
export function ExamUpdatesBoard() {
  const { data = [], isLoading, error } = useQuery(examUpdatesQuery);
  const [exam, setExam] = useState<string>("All");
  const [q, setQ] = useState("");
  const [lang, setLang] = useState<"en" | "hi">("en");

  const present = useMemo(() => updateExams.filter((e) => data.some((d) => d.exam === e)), [data]);
  const rows = useMemo(() => {
    const term = q.trim().toLowerCase();
    return data.filter(
      (d) =>
        (exam === "All" || d.exam === exam) &&
        (!term || `${d.title} ${d.summary ?? ""} ${d.summary_hi ?? ""} ${d.source_name ?? ""}`.toLowerCase().includes(term)),
    );
  }, [data, exam, q]);

  return (
    <div>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by exam">
          {["All", ...present].map((e) => (
            <button
              key={e}
              type="button"
              onClick={() => setExam(e)}
              aria-pressed={exam === e}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors",
                exam === e ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:border-primary/40",
              )}
            >
              {e}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <div className="relative flex-1 md:w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search updates" className="pl-9" aria-label="Search updates" />
          </div>
          <Button variant="outline" onClick={() => setLang(lang === "en" ? "hi" : "en")} aria-label="Switch language">
            <Languages /> {lang === "en" ? "हिंदी" : "English"}
          </Button>
        </div>
      </div>

      <div className="mt-8">
        {isLoading ? (
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" /> Loading updates…
          </p>
        ) : error ? (
          <EmptyState icon={Bell} title="Couldn't load updates" description="Please refresh the page in a moment." />
        ) : rows.length === 0 ? (
          <EmptyState icon={Bell} title="No updates here yet" description="Exam, counselling and form-date notices will appear here." />
        ) : (
          <div className="grid gap-5 lg:grid-cols-2">
            {rows.map((item, i) => (
              <Reveal key={item.id} delay={(i % 4) * 60}>
                <UpdateCard item={item} lang={lang} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
      <p className="mt-8 text-xs text-muted-foreground">
        Every update links to its official notice. Dates marked "tentative" are not confirmed yet — always check the official
        website before applying.
      </p>
    </div>
  );
}

/** Compact list for the homepage "Latest notifications" card. */
export function LatestUpdatesList({ limit = 5 }: { limit?: number }) {
  const { data = [], isLoading } = useQuery(examUpdatesQuery);
  const items = data.slice(0, limit);
  if (isLoading) return <EmptyState icon={Bell} title="Loading notifications…" description="Exam and counselling updates." />;
  if (!items.length)
    return <EmptyState icon={Bell} title="No notifications yet" description="Exam notices and announcements will appear here." />;
  return (
    <ul className="divide-y divide-border">
      {items.map((u) => {
        const win = updateWindow(u.last_date);
        return (
          <li key={u.id} className="py-3 text-sm">
            <Link to="/updates" className="group block">
              <span className="line-clamp-2 font-medium group-hover:text-primary">{u.title}</span>
              <span className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground">
                <span>{u.exam}</span>
                {u.last_date && <span>· Last date {fmt(u.last_date)}</span>}
                {win === "CLOSED" && <span>· Closed</span>}
              </span>
            </Link>
          </li>
        );
      })}
      <li className="pt-3">
        <Link to="/updates" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
          All exam updates <ArrowRight className="size-4" />
        </Link>
      </li>
    </ul>
  );
}
