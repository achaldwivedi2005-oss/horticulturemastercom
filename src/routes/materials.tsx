import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { ComingSoonPanel } from "@/components/site/ComingSoonPanel";

export const Route = createFileRoute("/materials")({
  head: () => ({
    meta: [
      { title: "Study Materials & PDF Library — Horticulture Master" },
      {
        name: "description",
        content: "Organised horticulture notes and downloadable PDFs, arranged subject-wise and topic-wise.",
      },
      { property: "og:title", content: "Study Materials & PDF Library — Horticulture Master" },
      {
        property: "og:description",
        content: "Subject-wise and topic-wise horticulture notes with search and filters.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MaterialsPage,
});

function MaterialsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Study materials"
        title="Notes that follow the syllabus, not the noise"
        description="A curated library of notes and PDFs, organised by subject and topic so revision stays fast."
      />
      <ComingSoonPanel
        stage="Stage 4"
        features={[
          "Organised notes & PDF library",
          "Subject-wise categories",
          "Topic-wise categories",
          "Search across materials",
          "Filter by subject, topic & exam",
          "Admin-managed downloadable files",
        ]}
      />
    </>
  );
}
