import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { ComingSoonPanel } from "@/components/site/ComingSoonPanel";

export const Route = createFileRoute("/jobs")({
  head: () => ({
    meta: [
      { title: "Agriculture & Horticulture Jobs — Horticulture Master" },
      {
        name: "description",
        content: "Government agriculture and horticulture jobs, ICAR and agricultural university vacancies with official links.",
      },
      { property: "og:title", content: "Agriculture & Horticulture Jobs — Horticulture Master" },
      {
        property: "og:description",
        content: "ICAR, SAU and government agri-horti vacancies with eligibility, deadlines and official notifications.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: JobsPage,
});

function JobsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Agriculture jobs portal"
        title="Verified vacancies, straight from official notifications"
        description="Government, ICAR and agricultural university openings — with eligibility, deadlines and the original notification link."
      />
      <ComingSoonPanel
        stage="Stage 5"
        features={[
          "Government agriculture & horticulture jobs",
          "ICAR institute vacancies",
          "Agricultural university vacancies",
          "Eligibility & number of posts",
          "Application deadlines",
          "Official notification links",
          "Search & filter options",
          "Latest exam notifications",
        ]}
      />
    </>
  );
}
