import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck, Target, Sprout, Layers } from "lucide-react";
import labPhoto from "@/assets/lab_flask_research.jpg.asset.json";
const aboutImage = labPhoto.url;
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";
import { StatusBadge } from "@/components/site/StatusBadge";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Horticulture Master" },
      {
        name: "description",
        content: "Why Horticulture Master exists: focused, honest exam preparation for agriculture and horticulture aspirants.",
      },
      { property: "og:title", content: "About Horticulture Master" },
      {
        property: "og:description",
        content: "Focused, honest exam preparation for CUET-PG, ICAR JRF/SRF and ASRB NET aspirants.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

const values = [
  { icon: Target, title: "Exam-first", text: "Everything maps to CUET-PG, ICAR JRF/SRF and ASRB NET syllabi." },
  { icon: ShieldCheck, title: "Honest by default", text: "No inflated numbers or invented listings — only verified, published content." },
  { icon: Layers, title: "Organised", text: "Subjects, topics and exams neatly structured for quick revision." },
  { icon: Sprout, title: "Growing with you", text: "New quizzes, notes and job alerts added continuously by our team." },
];

const roadmap: { stage: string; title: string; status: "live" | "soon" }[] = [
  { stage: "Stage 1", title: "Website, design & information pages", status: "live" },
  { stage: "Stage 2", title: "Student accounts, dashboard & admin access", status: "live" },
  { stage: "Stage 3", title: "Online quiz portal with analytics", status: "soon" },
  { stage: "Stage 4", title: "Study materials library", status: "soon" },
  { stage: "Stage 5", title: "Agriculture jobs & notifications portal", status: "soon" },
];

function AboutPage() {
  const { isAdmin } = useAuth();
  return (
    <>
      <PageHeader
        eyebrow="About us"
        title="Horticulture prep, without the clutter"
        description="Horticulture Master brings practice tests, organised notes and verified job updates together for agriculture and horticulture aspirants across India."
      />

      <section className="container-page py-14 md:py-20">
        <Reveal className="overflow-hidden rounded-3xl shadow-lift">
          <img
            src={aboutImage}
            alt="Researcher handling flasks in a plant science laboratory"
            width={1600}
            height={912}
            loading="lazy"
            className="aspect-[16/9] w-full object-cover object-right-bottom"
          />
        </Reveal>
      </section>

      <section className="container-page pb-16 md:pb-24">
        <Reveal>
          <SectionHeading eyebrow="What we stand for" title="Built on four simple principles" />
        </Reveal>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v, i) => (
            <Reveal key={v.title} delay={i * 80}>
              <div className="card-lift h-full rounded-2xl border border-border bg-card p-6">
                <v.icon className="size-6 text-primary" />
                <p className="mt-5 font-display text-xl font-semibold">{v.title}</p>
                <p className="mt-2 text-sm text-muted-foreground">{v.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {isAdmin && <section className="bg-muted/40 py-16 md:py-24">
        <div className="container-page">
          <Reveal>
            <SectionHeading
              eyebrow="Build roadmap"
              title="What's live and what's next"
              description="We're launching in stages so every feature works properly before it goes live."
            />
          </Reveal>
          <ol className="mt-10 grid gap-3">
            {roadmap.map((r, i) => (
              <Reveal as="li" key={r.stage} delay={i * 60}>
                <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <span className="font-display text-sm font-semibold text-primary">{r.stage}</span>
                    <span className="font-medium">{r.title}</span>
                  </div>
                  <StatusBadge status={r.status} />
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>}
    </>
  );
}
