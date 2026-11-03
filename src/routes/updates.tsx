import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { ExamUpdatesBoard } from "@/components/updates/ExamUpdates";

export const Route = createFileRoute("/updates")({
  head: () => ({
    meta: [
      { title: "ICAR PG/PhD Counselling, ASRB NET/ARS & Horticulture News — Horticulture Master" },
      {
        name: "description",
        content:
          "Latest ICAR PG & Ph.D. counselling, ASRB NET / ARS form dates and important horticulture news, each linked to the official notice.",
      },
      { property: "og:title", content: "Exams, Counselling & Horticulture News — Horticulture Master" },
      {
        property: "og:description",
        content: "ICAR counselling, ASRB NET/ARS updates and horticulture news with official links and last dates.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: UpdatesPage,
});

function UpdatesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Exams & news"
        title="Counselling, form dates & horticulture news"
        description="ICAR PG/Ph.D. counselling, ASRB NET & ARS updates, and important horticulture news — each with its official notice and last date."
      />
      <section className="container-page py-10 md:py-14">
        <ExamUpdatesBoard />
      </section>
    </>
  );
}
