import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { ComingSoonPanel } from "@/components/site/ComingSoonPanel";
import { Reveal } from "@/components/site/Reveal";
import { subjects } from "@/lib/site";

export const Route = createFileRoute("/quizzes")({
  head: () => ({
    meta: [
      { title: "Online Quiz Portal — Horticulture Master" },
      {
        name: "description",
        content: "Subject-wise horticulture MCQ tests with timers, negative marking, explanations and performance analytics.",
      },
      { property: "og:title", content: "Online Quiz Portal — Horticulture Master" },
      {
        property: "og:description",
        content: "Timed, subject-wise MCQ tests for CUET-PG, ICAR JRF/SRF and ASRB NET aspirants.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: QuizzesPage,
});

function QuizzesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Online quiz portal"
        title="Timed MCQ tests, built around the syllabus"
        description="Pick a subject, set your timer and marking scheme, and review every answer with explanations."
      />
      <section className="container-page pt-14">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Subjects</p>
        </Reveal>
        <div className="mt-5 flex flex-wrap gap-2">
          {subjects.map((s) => (
            <span key={s.slug} className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm">
              <s.icon className="size-4 text-primary" /> {s.name}
            </span>
          ))}
        </div>
      </section>
      <ComingSoonPanel
        stage="Stage 3"
        features={[
          "Subject-wise MCQ tests",
          "Configurable question timer",
          "Configurable positive & negative marking",
          "Automatic scoring",
          "Answer explanations after submission",
          "Results & leaderboard",
          "Test history",
          "Performance analytics",
        ]}
      />
    </>
  );
}
