import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CalendarClock,
  ExternalLink,
  GraduationCap,
  IndianRupee,
  Info,
  MapPin,
  Search,
  Users,
  Loader2,
  BellRing,
} from "lucide-react";
import { jobPostingsQuery, type JobPosting } from "@/lib/jobs/jobs-query";
import { daysUntil, isNewJob, jobCategories } from "@/lib/jobs/classify";
import { Reveal } from "@/components/site/Reveal";
import { EmptyState } from "@/components/site/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

function fmt(date: string | null) {
  if (!date) return null;
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function sortJobs(jobs: JobPosting[]) {
  return [...jobs].sort((a, b) => {
    const ea = (daysUntil(a.deadline) ?? 1) < 0 ? 1 : 0;
    const eb = (daysUntil(b.deadline) ?? 1) < 0 ? 1 : 0;
    if (ea !== eb) return ea - eb; // active first, expired last
    return b.created_at.localeCompare(a.created_at);
  });
}

function Countdown({ deadline }: { deadline: string | null }) {
  const days = daysUntil(deadline);
  if (days === null)
    return <span className="text-xs text-muted-foreground">Last date: see official notice</span>;
  if (days < 0)
    return (
      <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Expired · {fmt(deadline)}
      </span>
    );
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

export function JobCard({ job, index = 0 }: { job: JobPosting; index?: number }) {
  const expired = (daysUntil(job.deadline) ?? 1) < 0;
  const officialLink = job.notification_url ?? job.source_url;
  const fresh = isNewJob(job.created_at) && !expired;
  return (
    <Reveal delay={(index % 6) * 60} className="h-full">
      <article
        className={cn(
          "card-lift group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-card p-5",
          fresh ? "border-primary/40 shadow-glow" : "border-border",
          expired && "opacity-70",
        )}
      >
        {fresh && (
          <span className="absolute right-4 top-4 inline-flex animate-pulse items-center rounded-full bg-sun px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-sun-foreground shadow-soft">
            New
          </span>
        )}
        <div className="flex flex-wrap items-center gap-1.5 pr-14">
          {job.status === "verified" ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-[0.7rem] font-semibold text-secondary-foreground">
              <BadgeCheck className="size-3.5 text-primary" /> Verified
            </span>
          ) : (
            <span
              className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[0.7rem] font-semibold text-muted-foreground"
              title="Detected automatically from the official page. Always confirm details in the official notice."
            >
              <Info className="size-3.5" /> Auto-detected · unverified
            </span>
          )}
          {job.categories.slice(0, 3).map((c) => (
            <span key={c} className="rounded-full border border-border px-2 py-0.5 text-[0.7rem] text-muted-foreground">
              {c}
            </span>
          ))}
        </div>
        <h3 className="mt-3 font-sans text-base font-semibold leading-snug tracking-normal">{job.title}</h3>
        {job.institute && (
          <p className="mt-1 flex items-start gap-1.5 text-sm text-primary">
            <Building2 className="mt-0.5 size-4 shrink-0" /> {job.institute}
          </p>
        )}
        <dl className="mt-3 grid gap-1.5 text-sm text-muted-foreground">
          {job.vacancies && (
            <div className="flex items-start gap-1.5">
              <Users className="mt-0.5 size-4 shrink-0" /> <dt className="sr-only">Vacancies</dt>
              <dd>{job.vacancies} post(s)</dd>
            </div>
          )}
          {job.qualification && (
            <div className="flex items-start gap-1.5">
              <GraduationCap className="mt-0.5 size-4 shrink-0" /> <dt className="sr-only">Qualification</dt>
              <dd className="line-clamp-2">{job.qualification}</dd>
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
          {job.age_limit && <div className="text-xs">Age limit: {job.age_limit}</div>}
        </dl>
        <div className="mt-auto pt-4">
          <Countdown deadline={job.deadline} />
          <p className="mt-2 text-xs text-muted-foreground">
            {job.published_date ? `Published ${fmt(job.published_date)} · ` : ""}Found {fmt(job.created_at.slice(0, 10))}
            {job.source_url && (
              <>
                {" · "}
                <a href={job.source_url} target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">
                  official source
                </a>
              </>
            )}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {officialLink && (
              <Button asChild size="sm" variant="hero">
                <a href={officialLink} target="_blank" rel="noopener noreferrer">
                  Official notice <ExternalLink />
                </a>
              </Button>
            )}
            {job.apply_url && !expired && (
              <Button asChild size="sm" variant="soft">
                <a href={job.apply_url} target="_blank" rel="noopener noreferrer">
                  Apply
                </a>
              </Button>
            )}
          </div>
        </div>
      </article>
    </Reveal>
  );
}

/** Full job alerts board with filters + search (Jobs page). */
export function JobAlertsBoard() {
  const { data: jobs = [], isLoading, error } = useQuery(jobPostingsQuery);
  const [category, setCategory] = useState("All");
  const [q, setQ] = useState("");
  const [hideExpired, setHideExpired] = useState(true);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return sortJobs(
      jobs.filter((j) => {
        if (hideExpired && (daysUntil(j.deadline) ?? 1) < 0) return false;
        if (category !== "All" && !j.categories.includes(category)) return false;
        if (!needle) return true;
        return [j.title, j.institute, j.qualification, j.location].some((v) => v?.toLowerCase().includes(needle));
      }),
    );
  }, [jobs, category, q, hideExpired]);

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
        <div className="mt-4 flex flex-wrap items-center gap-2" role="group" aria-label="Filter jobs">
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
          <label className="ml-auto flex items-center gap-2 text-sm text-muted-foreground">
            <input
              type="checkbox"
              checked={hideExpired}
              onChange={(e) => setHideExpired(e.target.checked)}
              className="size-4 accent-[var(--primary)]"
            />
            Hide expired
          </label>
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
                <JobCard key={j.id} job={j} index={i} />
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
  const active = useMemo(() => sortJobs(jobs.filter((j) => (daysUntil(j.deadline) ?? 1) >= 0)).slice(0, 6), [jobs]);
  const newCount = jobs.filter((j) => isNewJob(j.created_at)).length;

  return (
    <section className="container-page py-16 md:py-20" aria-labelledby="job-alerts-title">
      <Reveal className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <p className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-primary">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-destructive opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-destructive" />
            </span>
            Live job monitor
          </p>
          <h2 id="job-alerts-title" className="text-3xl font-semibold leading-tight text-balance sm:text-4xl">
            🚨 Latest Agriculture &amp; Horticulture Job Alerts
          </h2>
          <p className="mt-3 text-muted-foreground">
            Checked automatically from official ICAR, university and government recruitment pages.
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
          <EmptyState icon={BellRing} title="No open vacancies right now" description="New official notifications will appear here automatically." />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {active.map((j, i) => (
              <JobCard key={j.id} job={j} index={i} />
            ))}
          </div>
        )}
      </div>
      <p className="mt-6 text-center text-xs text-muted-foreground">
        Auto-detected items are copied from official pages and may be incomplete — always confirm in the official notice
        before applying.
      </p>
    </section>
  );
}
