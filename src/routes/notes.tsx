import { createFileRoute } from "@tanstack/react-router";
import { LogoBadge } from "@/components/site/Logo";
import { BranchList } from "@/components/site/NotesBranches";

export const Route = createFileRoute("/notes")({
  head: () => ({
    meta: [
      { title: "Horticulture Master Notes — 5 Branches" },
      { name: "description", content: "Official Horticulture Master notes for ICAR JRF, SRF and competitive exams across five horticulture branches." },
      { property: "og:title", content: "Horticulture Master Notes — 5 Branches" },
      { property: "og:description", content: "Fruit, vegetable, floriculture, plantation & spices, and postharvest notes under General Horticulture." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NotesPage,
});

function NotesPage() {
  return (
    <section className="container-page py-10 md:py-14">
      <div className="gold-card mb-8 flex items-center gap-5 rounded-3xl p-6 sm:p-8">
        <span className="logo-shine size-20 shrink-0 sm:size-28">
          <LogoBadge className="size-full" />
        </span>
        <div>
          <h1 className="text-3xl font-extrabold sm:text-5xl">Horticulture Master Notes</h1>
          <p className="mt-2 text-sm font-medium opacity-80">ICAR JRF · SRF · Competitive exams</p>
        </div>
      </div>
      <BranchList />
    </section>
  );
}
