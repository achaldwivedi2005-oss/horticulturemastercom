import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CalendarClock,
  ChevronDown,
  ExternalLink,
  GraduationCap,
  IndianRupee,
  Info,
  MapPin,
  Pin,
  Search,
  Send,
  MessageCircle,
  Users,
  Loader2,
  BellRing,
  Zap,
} from "lucide-react";
import { closingSoonDaysQuery, jobPostingsQuery, type JobPosting } from "@/lib/jobs/jobs-query";
import { computeJobStatuses, daysUntil, degreeLevels, jobCategories, type JobStatus } from "@/lib/jobs/classify";
import { indianStates } from "@/lib/universities";
import { Reveal } from "@/components/site/Reveal";
import { EmptyState } from "@/components/site/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

function fmt(date: string | null) {
  if (!date) return null;
  return new Date(`${date.slice(0, 10)}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

const isClosed = (j: JobPosting) => (daysUntil(j.deadline) ?? 1) < 0;

function sortJobs(jobs: JobPosting[], sort: "newest" | "closing" = "newest") {
  return [...jobs].sort((a, b) => {
    if (a.is_pinned !== b.is_pinned) return a.is_pinned ? -1 : 1;
    const ca = isClosed(a) ? 1 : 0;
    const cb = isClosed(b) ? 1 : 0;
    if (ca !== cb) return ca - cb;
    if (sort === "closing") {
      const da = daysUntil(a.deadline) ?? 9999;
      const db = daysUntil(b.deadline) ?? 9999;
      if (da !== db) return da - db;
    }
    return b.created_at.localeCompare(a.created_at);
  });
}

const statusStyle: Record<JobStatus, string> = {
  NEW: "bg-sun text-sun-foreground animate-pulse",
  "CLOSING SOON": "bg-destructive text-destructive-foreground",
  CLOSED: "bg-muted text-muted-foreground",
  "UPDATED NOTIFICATION": "bg-accent text-accent-foreground",
  "APPLICATION OPEN": "bg-secondary text-secondary-foreground",
};

function Countdown({ deadline }: { deadline: string | null }) {
  const days = daysUntil(deadline);
  if (days === null) return <span className="text-xs text-muted-foreground">Deadline not verified — see official notice</span>;
  if (days < 0) return <span className="text-xs font-medium text-muted-foreground">Closed on {fmt(deadline)}</span>;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        days <= 3 ? "bg-destructive/10 text-destructive" : days <= 10 ? "bg-sun/20 text-sun-foreground dark:text-sun" : "bg-secondary text-secondary-foreground",
      )}
    >
      <CalendarClock className="size-3.5" />
      {days === 0 ? "Closes today" : `${days} day${days === 1 ? "" : "s"} left`} · {fmt(deadline)}
    </span>
  );
}

function shareText(job: JobPosting) {
  const link = job.notification_url ?? job.source_url ?? "";
  return `🚨 ${job.title}${job.institute ? ` — ${job.institute}` : ""}${job.deadline ? ` | Last date: ${fmt(job.deadline)}` : ""}\n${link}\nvia Horticulture Master`;
}

export function JobCard({ job, index = 0, closingSoonDays = 7 }: { job: JobPosting; index?: number; closingSoonDays?: number }) {
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState<"en" | "hi">("en");
  const statuses = computeJobStatuses(job, closingSoonDays);
  const closed = statuses.includes("CLOSED");
  const officialLink = job.notification_url ?? job.source_url;
  const hasDetails = !!(job.summary_en || job.summary_hi || job.qualification || job.why_it_matters || job.application_fee || job.application_mode);
  const prev = Array.isArray(job.previous_deadlines) ? (job.previous_deadlines as { deadline?: string }[]) : [];

  return (
    <Reveal delay={(index % 6) * 60} className="h-full">
      <article
        className={cn(
          "card-lift group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-card p-5",
          statuses.includes("NEW") ? "border-primary/40 shadow-glow" : "border-border",
          job.is_breaking && "border-destructive/50",
          closed && "opacity-70",
        )}
      >
        <div className="flex flex-wrap items-center gap-1.5">
          {job.is_pinned && (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-primary-foreground">
              <Pin className="size-3" /> Pinned
            </span>
          )}
          {job.is_breaking && (
            <span className="inline-flex items-center gap-1 rounded-full bg-destructive px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-destructive-foreground">
              <Zap className="size-3" /> Breaking
            </span>
          )}
          {statuses.map((s) => (
            <span key={s} className={cn("rounded-full px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider", statusStyle[s])}>
              {s}
            </span>
          ))}
        </div>

        <h3 className="mt-3 font-sans text-base font-semibold leading-snug tracking-normal">{job.title}</h3>
        {job.institute && (
          <p className="mt-1 flex items-start gap-1.5 text-sm text-primary">
            <Building2 className="mt-0.5 size-4 shrink-0" /> {job.institute}
          </p>
        )}

        <div className="mt-3 flex flex-wrap gap-1.5">
          {job.scope && (
            <span className="rounded-full border border-primary/30 px-2 py-0.5 text-[0.7rem] font-medium text-primary">
              {job.scope === "All India" ? "All India" : job.state_name || "State"}
            </span>
          )}
          {job.degree_levels.map((d) => (
            <span key={d} className="rounded-full bg-muted px-2 py-0.5 text-[0.7rem] text-muted-foreground">
              {d}
            </span>
          ))}
          {job.phd_compulsory && <span className="rounded-full bg-muted px-2 py-0.5 text-[0.7rem] text-muted-foreground">Ph.D. compulsory</span>}
          {job.net_compulsory === false && (
            <span className="rounded-full bg-secondary px-2 py-0.5 text-[0.7rem] font-medium text-secondary-foreground">No NET required</span>
          )}
          {job.net_compulsory === true && <span className="rounded-full bg-muted px-2 py-0.5 text-[0.7rem] text-muted-foreground">NET required</span>}
          {job.categories
            .filter((c) => c !== "ICAR")
            .slice(0, 2)
            .map((c) => (
              <span key={c} className="rounded-full border border-border px-2 py-0.5 text-[0.7rem] text-muted-foreground">
                {c}
              </span>
            ))}
        </div>

        <dl className="mt-3 grid gap-1.5 text-sm text-muted-foreground">
          {job.vacancies && (
            <div className="flex items-start gap-1.5">
              <Users className="mt-0.5 size-4 shrink-0" /> <dt className="sr-only">Vacancies</dt>
              <dd>{job.vacancies} post(s)</dd>
            </div>
          )}
          {job.salary && (
            <div className="flex items-start gap-1.5">
              <IndianRupee className="mt-0.5 size-4 shrink-0" /> <dt className="sr-only">Salary</dt>
              <dd className="line-clamp-1">{job.salary}</dd>
            </div>
          )}
          {job.location && (
            <div className="flex items-start gap-1.5">
              <MapPin className="mt-0.5 size-4 shrink-0" /> <dt className="sr-only">Location</dt>
              <dd className="line-clamp-1">{job.location}</dd>
            </div>
          )}
        </dl>

        {hasDetails && (
          <div className="mt-3">
            <button
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
            >
              Read full details <ChevronDown className={cn("size-4 transition-transform", open && "rotate-180")} />
            </button>
            {open && (
              <div className="mt-3 space-y-2 rounded-xl bg-muted/60 p-3 text-sm">
                {(job.summary_en || job.summary_hi) && (
                  <div>
                    <div className="mb-1.5 flex gap-1">
                      {(["en", "hi"] as const).map((l) => (
                        <button
                          key={l}
                          onClick={() => setLang(l)}
                          aria-pressed={lang === l}
                          className={cn(
                            "rounded-full px-2 py-0.5 text-xs font-semibold",
                            lang === l ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground",
                          )}
                        >
                          {l === "en" ? "English" : "हिंदी"}
                        </button>
                      ))}
                    </div>
                    <p>{(lang === "hi" ? job.summary_hi : job.summary_en) ?? job.summary_en ?? job.summary_hi}</p>
                  </div>
                )}
                {job.why_it_matters && (
                  <p>
                    <strong>Why it matters:</strong> {job.why_it_matters}
                  </p>
                )}
                {job.qualification && (
                  <p className="flex gap-1.5">
                    <GraduationCap className="mt-0.5 size-4 shrink-0" /> <span>{job.qualification}</span>
                  </p>
                )}
                {job.specialization && <p>Specialisation: {job.specialization}</p>}
                {job.age_limit && <p>Age limit: {job.age_limit}</p>}
                {job.application_mode && <p>Mode: {job.application_mode}</p>}
                {job.application_fee && <p>Fee: {job.application_fee}</p>}
                {job.opening_date && <p>Opens: {fmt(job.opening_date)}</p>}
                {prev.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Earlier deadline(s): {prev.map((d) => fmt(d.deadline ?? null)).filter(Boolean).join(", ")}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        <div className="mt-auto pt-4">
          <Countdown deadline={job.deadline} />
          <p className="mt-2 flex flex-wrap items-center gap-x-1 text-xs text-muted-foreground">
            {job.status === "verified" ? (
              <span className="inline-flex items-center gap-1 font-medium text-primary">
                <BadgeCheck className="size-3.5" /> Verified{job.last_verified_at ? ` ${fmt(job.last_verified_at)}` : ""}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1" title="Taken from the official page.">
                <Info className="size-3.5" /> Confirm in official notice
              </span>
            )}
            {job.published_date ? <span>· Published {fmt(job.published_date)}</span> : null}
            {job.source_url && (
              <a href={job.source_url} target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">
                · official source
              </a>
            )}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {officialLink && (
              <Button asChild size="sm" variant="hero">
                <a href={officialLink} target="_blank" rel="noopener noreferrer">
                  Official notification <ExternalLink />
                </a>
              </Button>
            )}
            {job.apply_url && !closed && (
              <Button asChild size="sm" variant="soft">
                <a href={job.apply_url} target="_blank" rel="noopener noreferrer">
                  Apply online
                </a>
              </Button>
            )}
            <div className="ml-auto flex gap-1">
              <Button asChild size="icon-sm" variant="ghost" aria-label="Share on WhatsApp">
                <a href={`https://wa.me/?text=${encodeURIComponent(shareText(job))}`} target="_blank" rel="noopener noreferrer">
                  <MessageCircle />
                </a>
              </Button>
              <Button asChild size="icon-sm" variant="ghost" aria-label="Share on Telegram">
                <a
                  href={`https://t.me/share/url?url=${encodeURIComponent(officialLink ?? "")}&text=${encodeURIComponent(shareText(job))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Send />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </article>
    </Reveal>
  );
}

const qualificationFilters = [...degreeLevels, "Ph.D. compulsory", "Without NET"] as const;
const statusFilters = ["NEW", "APPLICATION OPEN", "CLOSING SOON", "WALK-IN INTERVIEW", "CLOSED"] as const;

/** Full job alerts board with filters + search (Jobs page). */
export function JobAlertsBoard() {
  const { data: jobs = [], isLoading, error } = useQuery(jobPostingsQuery);
  const { data: closingSoonDays = 7 } = useQuery(closingSoonDaysQuery);
  const [category, setCategory] = useState("All");
  const [q, setQ] = useState("");
  const [qualification, setQualification] = useState("any");
  const [scope, setScope] = useState("any");
  const [status, setStatus] = useState("active");
  const [sort, setSort] = useState<"newest" | "closing">("newest");

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return sortJobs(
      jobs.filter((j) => {
        const st = computeJobStatuses(j, closingSoonDays);
        if (status === "active" && st.includes("CLOSED")) return false;
        if (status === "WALK-IN INTERVIEW" && !/walk/i.test(`${j.application_mode ?? ""} ${j.title}`)) return false;
        if (status !== "active" && status !== "all" && status !== "WALK-IN INTERVIEW" && !st.includes(status as JobStatus)) return false;
        if (category !== "All" && !j.categories.includes(category)) return false;
        if (qualification === "Ph.D. compulsory" && !j.phd_compulsory) return false;
        if (qualification === "Without NET" && j.net_compulsory !== false) return false;
        if (degreeLevels.includes(qualification as never) && !j.degree_levels.includes(qualification)) return false;
        if (scope === "All India" && j.scope !== "All India") return false;
        if (scope !== "any" && scope !== "All India" && j.state_name !== scope) return false;
        if (!needle) return true;
        return [j.title, j.institute, j.qualification, j.location, j.specialization].some((v) => v?.toLowerCase().includes(needle));
      }),
      sort,
    );
  }, [jobs, category, q, qualification, scope, status, sort, closingSoonDays]);

  return (
    <div>
      <Reveal className="rounded-3xl border border-border bg-card p-4 shadow-soft sm:p-6">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by post, institute, qualification or location…"
            aria-label="Search jobs"
            className="h-12 rounded-full pl-11 text-base"
          />
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2" role="group" aria-label="Filter by job type">
          {["All", ...jobCategories].map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              aria-pressed={category === c}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all",
                category === c
                  ? "border-primary bg-primary text-primary-foreground shadow-glow"
                  : "border-border bg-background hover:border-primary/40",
              )}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <Select value={qualification} onValueChange={setQualification}>
            <SelectTrigger aria-label="Qualification" className="h-10">
              <SelectValue placeholder="Qualification" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any qualification</SelectItem>
              {qualificationFilters.map((v) => (
                <SelectItem key={v} value={v}>
                  {v}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={scope} onValueChange={setScope}>
            <SelectTrigger aria-label="Scope and state" className="h-10">
              <SelectValue placeholder="Scope / state" />
            </SelectTrigger>
            <SelectContent className="max-h-72">
              <SelectItem value="any">All India + all states</SelectItem>
              <SelectItem value="All India">All India / Central only</SelectItem>
              {indianStates.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger aria-label="Status" className="h-10">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Open (hide closed)</SelectItem>
              <SelectItem value="all">All, including closed</SelectItem>
              {statusFilters.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sort} onValueChange={(v) => setSort(v as "newest" | "closing")}>
            <SelectTrigger aria-label="Sort" className="h-10">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest first</SelectItem>
              <SelectItem value="closing">Closing soonest</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Reveal>

      <div className="mt-8">
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground">
            <Loader2 className="size-5 animate-spin" /> Loading job alerts…
          </div>
        ) : error ? (
          <EmptyState icon={Info} title="Couldn't load jobs" description="Please refresh the page in a moment." />
        ) : filtered.length === 0 ? (
          <EmptyState icon={BellRing} title="No matching vacancies" description="Try another filter or search term." />
        ) : (
          <>
            <p className="mb-4 text-sm text-muted-foreground">{filtered.length} vacancies</p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((j, i) => (
                <JobCard key={j.id} job={j} index={i} closingSoonDays={closingSoonDays} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/** Homepage highlight: newest active vacancies. */
export function JobAlertsHighlight() {
  const { data: jobs = [], isLoading } = useQuery(jobPostingsQuery);
  const { data: closingSoonDays = 7 } = useQuery(closingSoonDaysQuery);
  const active = useMemo(() => sortJobs(jobs.filter((j) => !isClosed(j))).slice(0, 6), [jobs]);
  const newCount = jobs.filter((j) => computeJobStatuses(j, closingSoonDays).includes("NEW")).length;

  return (
    <section className="container-page py-16 md:py-20" aria-labelledby="job-alerts-title">
      <Reveal className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <p className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-primary">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-destructive opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-destructive" />
            </span>
            Live jobs
          </p>
          <h2 id="job-alerts-title" className="text-3xl font-semibold leading-tight text-balance sm:text-4xl">
            🚨 Latest Agriculture &amp; Horticulture Job Alerts
          </h2>
          <p className="mt-3 text-muted-foreground">
            Latest vacancies from official ICAR, university and government recruitment pages.
            {newCount > 0 ? ` ${newCount} new in the last 3 days.` : ""}
          </p>
        </div>
        <Button asChild variant="soft" size="lg">
          <Link to="/jobs">
            View all jobs <ArrowRight />
          </Link>
        </Button>
      </Reveal>
      <div className="mt-10">
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 py-12 text-muted-foreground">
            <Loader2 className="size-5 animate-spin" /> Loading…
          </div>
        ) : active.length === 0 ? (
          <EmptyState icon={BellRing} title="No open vacancies right now" description="New official notifications will appear here." />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {active.map((j, i) => (
              <JobCard key={j.id} job={j} index={i} closingSoonDays={closingSoonDays} />
            ))}
          </div>
        )}
      </div>
      <p className="mt-6 text-center text-xs text-muted-foreground">
        Details are taken from official pages and may be incomplete — always confirm in the official notice
        before applying.
      </p>
    </section>
  );
}
