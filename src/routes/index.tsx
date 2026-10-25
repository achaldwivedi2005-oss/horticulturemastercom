import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  Bell,
  Briefcase,
  ClipboardCheck,
  FileQuestion,
  Library,
  Timer,
  Users,
  Sparkles,
  Target,
  BarChart3,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import heroImage from "@/assets/hero-horticulture.jpg";
import { supabase } from "@/integrations/supabase/client";
import { driveLibraryQuery } from "@/lib/drive/drive.functions";
import { jobPostingsQuery } from "@/lib/jobs/jobs-query";
import { daysUntil } from "@/lib/jobs/classify";
import { JobAlertsHighlight } from "@/components/jobs/JobAlerts";
import type * as React from "react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";
import { StatusBadge } from "@/components/site/StatusBadge";
import { EmptyState } from "@/components/site/EmptyState";
import { SocialCards } from "@/components/site/SocialLinks";
import { exams, site, subjects } from "@/lib/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Horticulture Master — CUET-PG, ICAR JRF/SRF & ASRB NET Preparation" },
      {
        name: "description",
        content:
          "Prepare for CUET-PG, ICAR JRF, ICAR SRF and ASRB NET with subject-wise horticulture quizzes, study materials and agriculture job updates.",
      },
      { property: "og:title", content: "Horticulture Master — Crack Agri & Horti Competitive Exams" },
      {
        property: "og:description",
        content: "Subject-wise MCQs, organised notes and agriculture job updates for horticulture aspirants.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <>
      <Hero />
      <JobAlertsHighlight />
      <ExamCategories />
      <Stats />
      <FeaturedSubjects />
      <UpdatesBoard />
      <Community />
      <FinalCta />
    </>
  );
}

/* ---------------------------------- Hero ---------------------------------- */

function Hero() {
  return (
    <section className="relative -mt-16 overflow-hidden bg-gradient-hero pt-16 md:-mt-18 md:pt-18">
      <div className="pointer-events-none absolute inset-0 bg-dots opacity-50 [mask-image:radial-gradient(ellipse_at_top_left,black,transparent_65%)]" />
      <div className="container-page relative grid items-center gap-12 pb-16 pt-8 md:pb-24 md:pt-14 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card/70 px-3 py-1.5 text-xs font-semibold text-primary shadow-soft backdrop-blur">
              <Sparkles className="size-3.5" /> Built for horticulture aspirants
            </span>
          </div>
          <h1
            className="mt-6 animate-fade-up text-[2.6rem] font-semibold leading-[1.02] text-balance sm:text-6xl lg:text-7xl"
            style={{ animationDelay: "80ms" }}
          >
            Grow your rank, <span className="italic text-gradient">one concept</span> at a time.
          </h1>
          <p
            className="mt-6 max-w-xl animate-fade-up text-base text-muted-foreground text-pretty sm:text-lg"
            style={{ animationDelay: "160ms" }}
          >
            Welcome to {site.name} — focused practice, organised notes and verified job updates for
            agriculture & horticulture competitive exams.
          </p>
          <p
            className="mt-4 animate-fade-up text-xs font-bold uppercase tracking-[0.18em] text-primary sm:text-sm"
            style={{ animationDelay: "220ms" }}
          >
            {site.tagline}
          </p>
          <div className="mt-8 flex animate-fade-up flex-wrap gap-3" style={{ animationDelay: "280ms" }}>
            <Button asChild variant="hero" size="xl">
              <Link to="/quizzes">
                Start Learning <ArrowRight />
              </Link>
            </Button>
            <Button asChild variant="soft" size="xl">
              <Link to="/materials">Browse study materials</Link>
            </Button>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md animate-fade-up lg:max-w-none" style={{ animationDelay: "200ms" }}>
          <div className="absolute -inset-4 -z-10 rounded-[2.5rem] bg-gradient-primary opacity-20 blur-2xl" />
          <div className="overflow-hidden rounded-[2rem] border border-card shadow-lift">
            <img
              src={heroImage}
              alt="Fresh mangoes, tomatoes, okra, marigolds and seedlings beside an open botanical notebook"
              width={1280}
              height={1440}
              fetchPriority="high"
              className="aspect-[4/4.4] w-full object-cover"
            />
          </div>
          <div className="absolute -left-3 top-8 animate-float rounded-2xl border border-border bg-card/90 p-3.5 shadow-lift backdrop-blur sm:-left-8">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-secondary text-primary">
                <Timer className="size-5" />
              </span>
              <div>
                <p className="text-sm font-semibold">Timed MCQ tests</p>
                <p className="text-xs text-muted-foreground">With negative marking</p>
              </div>
            </div>
          </div>
          <div
            className="absolute -right-2 bottom-10 animate-float-slow rounded-2xl border border-border bg-card/90 p-3.5 shadow-lift backdrop-blur sm:-right-6"
            style={{ animationDelay: "1.5s" }}
          >
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-accent text-accent-foreground">
                <BarChart3 className="size-5" />
              </span>
              <div>
                <p className="text-sm font-semibold">Track accuracy</p>
                <p className="text-xs text-muted-foreground">Subject-wise analytics</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- Exam categories ----------------------------- */

function ExamCategories() {
  return (
    <section className="container-page py-16 md:py-24">
      <Reveal>
        <SectionHeading
          eyebrow="Exam categories"
          title="One platform, every major agri-horti exam"
          description="Content is organised by exam so you always practise what's relevant to your target."
        />
      </Reveal>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {exams.map((exam, i) => (
          <Reveal key={exam.code} delay={i * 80}>
            <Link
              to="/quizzes"
              className="card-lift group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-soft"
            >
              <div className="pointer-events-none absolute -right-8 -top-8 size-28 rounded-full bg-accent/30 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
              <span className="grid size-12 place-items-center rounded-2xl bg-secondary text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                <exam.icon className="size-6" />
              </span>
              <p className="mt-6 font-display text-2xl font-semibold">{exam.code}</p>
              <p className="mt-1 text-sm font-medium text-primary">{exam.name}</p>
              <p className="mt-3 flex-1 text-sm text-muted-foreground">{exam.summary}</p>
              <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-foreground">
                Explore <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------------------------------- Stats ---------------------------------- */

const statItems = [
  { key: "quizzes", label: "Quizzes", icon: ClipboardCheck },
  { key: "questions", label: "Questions", icon: FileQuestion },
  { key: "students", label: "Registered students", icon: Users },
  { key: "materials", label: "Study materials", icon: Library },
] as const;

function Stats() {
  // Real aggregate counts only; sections that don't exist yet stay "—".
  const { data } = useQuery({
    queryKey: ["public-stats"],
    queryFn: async () => {
      const { data: stats, error } = await supabase.rpc("get_public_stats");
      if (error) throw error;
      return stats as { students?: number } | null;
    },
    staleTime: 60_000,
  });
  const { data: library } = useQuery(driveLibraryQuery);
  const values: Partial<Record<(typeof statItems)[number]["key"], number | undefined>> = {
    students: data?.students,
    materials: library && !library.error ? library.files.length : undefined,
  };

  return (
    <section className="container-page">
      <Reveal className="relative overflow-hidden rounded-3xl bg-gradient-deep p-6 text-deep-foreground sm:p-10">
        <div className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-accent/20 blur-3xl" />
        <div className="relative flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-semibold sm:text-3xl">Platform at a glance</h2>
          <p className="text-sm text-deep-foreground/70">Live counts — "—" means that section hasn't launched yet.</p>
        </div>
        <div className="relative mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {statItems.map(({ key, label, icon: Icon }) => {
            const v = values[key];
            return (
              <div key={key} className="rounded-2xl border border-deep-foreground/15 bg-deep-foreground/5 p-5 backdrop-blur">
                <Icon className="size-5 text-accent" />
                <p
                  className="mt-4 font-display text-4xl font-semibold"
                  aria-label={v === undefined ? `${label}: not yet available` : `${label}: ${v}`}
                >
                  {v === undefined ? "—" : v.toLocaleString("en-IN")}
                </p>
                <p className="mt-1 text-sm text-deep-foreground/75">{label}</p>
              </div>
            );
          })}
        </div>
      </Reveal>
    </section>
  );
}

/* --------------------------- Featured subjects ---------------------------- */

function FeaturedSubjects() {
  return (
    <section className="container-page py-16 md:py-24">
      <Reveal>
        <SectionHeading
          eyebrow="Featured quizzes"
          title="Practise subject by subject"
          description="Subject-wise MCQ tests with timers, negative marking and detailed explanations."
          action={<StatusBadge status="soon" label="Quiz bank opening soon" />}
        />
      </Reveal>
      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {subjects.map((s, i) => (
          <Reveal key={s.slug} delay={(i % 4) * 70}>
            <div className="card-lift group flex h-full items-start gap-4 rounded-2xl border border-border bg-card p-5">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-muted text-primary transition-transform duration-500 group-hover:scale-110 group-hover:rotate-[-6deg]">
                <s.icon className="size-5" />
              </span>
              <div>
                <p className="font-semibold leading-snug">{s.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">{s.focus}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
      <Reveal className="mt-8 grid gap-3 rounded-2xl border border-border bg-muted/50 p-5 sm:grid-cols-3">
        {[
          { icon: Timer, text: "Configurable question timer" },
          { icon: Target, text: "Positive & negative marking" },
          { icon: BookOpen, text: "Answer explanations & review" },
        ].map(({ icon: Icon, text }) => (
          <div key={text} className="flex items-center gap-3 text-sm font-medium">
            <Icon className="size-4 text-primary" /> {text}
          </div>
        ))}
      </Reveal>
    </section>
  );
}

/* ------------------------------ Updates board ------------------------------ */

function UpdatesBoard() {
  const { data: library } = useQuery(driveLibraryQuery);
  const { data: jobs = [] } = useQuery(jobPostingsQuery);
  const latestPdfs = (library?.files ?? []).slice(0, 5);
  const latestJobs = jobs.filter((j) => (daysUntil(j.deadline) ?? 1) >= 0).slice(0, 5);

  const shell = (title: string, Icon: typeof Bell, to: "/jobs" | "/materials", body: React.ReactNode, i: number) => (
    <Reveal key={title} delay={i * 90}>
      <div className="flex h-full flex-col rounded-3xl border border-border bg-card p-5 shadow-soft">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Icon className="size-5 text-primary" />
            <h3 className="font-sans text-base font-semibold tracking-normal">{title}</h3>
          </div>
          <Link to={to} className="text-sm font-semibold text-primary hover:underline">
            View all
          </Link>
        </div>
        {body}
      </div>
    </Reveal>
  );

  return (
    <section className="bg-muted/40 py-16 md:py-24">
      <div className="container-page">
        <Reveal>
          <SectionHeading
            eyebrow="Stay updated"
            title="Notifications, notes & jobs"
            description="Live from our study library and the official recruitment pages we monitor — no made-up listings."
          />
        </Reveal>
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {shell(
            "Latest notifications",
            Bell,
            "/jobs",
            <EmptyState
              icon={Bell}
              title="No notifications yet"
              description="Exam notices and announcements will appear here once published by the admin team."
            />,
            0,
          )}
          {shell(
            "Latest study materials",
            Library,
            "/materials",
            latestPdfs.length ? (
              <ul className="divide-y divide-border">
                {latestPdfs.map((f) => (
                  <li key={f.id}>
                    <Link to="/materials" className="flex items-start gap-3 py-3 text-sm hover:text-primary">
                      <BookOpen className="mt-0.5 size-4 shrink-0 text-primary" />
                      <span className="line-clamp-2">{f.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState icon={Library} title="Loading library…" description="Subject-wise notes and PDFs." />
            ),
            1,
          )}
          {shell(
            "Recent job updates",
            Briefcase,
            "/jobs",
            latestJobs.length ? (
              <ul className="divide-y divide-border">
                {latestJobs.map((j) => (
                  <li key={j.id} className="py-3 text-sm">
                    <a
                      href={j.notification_url ?? j.source_url ?? "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="line-clamp-2 font-medium hover:text-primary"
                    >
                      {j.title}
                    </a>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {j.institute}
                      {j.deadline ? ` · Last date ${j.deadline.split("-").reverse().join("-")}` : ""}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState
                icon={Briefcase}
                title="No open vacancies"
                description="Official ICAR, SAU and government vacancies will appear here automatically."
              />
            ),
            2,
          )}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------- Community -------------------------------- */

function Community() {
  return (
    <section className="container-page py-16 md:py-24">
      <Reveal className="relative overflow-hidden rounded-3xl bg-gradient-deep p-6 text-deep-foreground sm:p-10 md:p-14">
        <div className="pointer-events-none absolute -left-16 bottom-0 size-72 rounded-full bg-leaf/25 blur-3xl" />
        <div className="relative max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-accent">Join the community</p>
          <h2 className="mt-3 text-3xl font-semibold text-balance sm:text-4xl">
            Learn together on Telegram, WhatsApp & YouTube
          </h2>
          <p className="mt-3 text-deep-foreground/75">
            Daily practice questions, revision videos and instant alerts for new notifications.
          </p>
        </div>
        <SocialCards className="relative mt-10" />
      </Reveal>
    </section>
  );
}

/* -------------------------------- Final CTA -------------------------------- */

function FinalCta() {
  return (
    <section className="container-page pb-20 md:pb-28">
      <Reveal className="flex flex-col items-center rounded-3xl border border-border bg-card px-6 py-14 text-center shadow-soft">
        <h2 className="max-w-2xl text-3xl font-semibold text-balance sm:text-5xl">
          Your seat in M.Sc., Ph.D. or a faculty role starts with <span className="italic text-gradient">today's practice</span>.
        </h2>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild variant="hero" size="xl">
            <Link to="/quizzes">
              Start Learning <ArrowRight />
            </Link>
          </Button>
          <Button asChild variant="soft" size="xl">
            <Link to="/about">Why Horticulture Master</Link>
          </Button>
        </div>
      </Reveal>
    </section>
  );
}
