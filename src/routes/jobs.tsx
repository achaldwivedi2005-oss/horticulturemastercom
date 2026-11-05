import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { JobAlertsBoard } from "@/components/jobs/JobAlerts";

export const Route = createFileRoute("/jobs")({
  head: () => ({
    meta: [
      { title: "Agriculture & Horticulture Job Alerts — Horticulture Master" },
      {
        name: "description",
        content:
          "Young Professional, SRF/JRF, ICAR and government agriculture & horticulture vacancies, from official recruitment pages.",
      },
      { property: "og:title", content: "Agriculture & Horticulture Job Alerts — Horticulture Master" },
      {
        property: "og:description",
        content: "ICAR, SAU and government agri-horti vacancies with deadlines and official notification links.",
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
        title="🚨 Latest Agriculture & Horticulture Job Alerts"
        description="We check official ICAR institute, university and government recruitment pages several times a day. Every vacancy links to its original notice and source."
      />
      <section className="container-page py-10 md:py-14">
        <JobAlertsBoard />
      </section>
    </>
  );
}
