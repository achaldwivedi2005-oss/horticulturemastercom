import { createFileRoute } from "@tanstack/react-router";
import { Apple } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";
import { StatusBadge } from "@/components/site/StatusBadge";
import { fruitGroups } from "@/lib/fruits";

export const Route = createFileRoute("/fruit-science")({
  head: () => ({
    meta: [
      { title: "Fruit Science Crops — Major, Citrus & Minor Fruits | Horticulture Master" },
      {
        name: "description",
        content: "Complete Fruit Science crop list for ICAR JRF, CUET-PG and ASRB NET — major fruits, citrus group and minor fruit crops with notes.",
      },
      { property: "og:title", content: "Fruit Science Crops — Horticulture Master" },
      { property: "og:description", content: "Major fruits, citrus and minor fruit crops for horticulture competitive exams." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FruitSciencePage,
});

function FruitSciencePage() {
  return (
    <>
      <PageHeader
        eyebrow="Fruit Science"
        title="Fruit crops — Major, Citrus & Minor"
        description="Every fruit crop from the Fruit Science syllabus. Crop-wise notes are coming soon."
      />
      {fruitGroups.map((g) => (
        <section key={g.id} id={g.id} className="container-page py-10 md:py-14">
          <Reveal>
            <SectionHeading eyebrow={`${g.fruits.length} crops`} title={g.title} description={g.description} />
          </Reveal>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {g.fruits.map((f, i) => (
              <Reveal key={f.name} delay={(i % 5) * 50}>
                <div className="card-lift flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card">
                  <div className="grid aspect-square place-items-center bg-photo-tile p-3">
                    {f.image ? (
                      <img src={f.image} alt={f.name} loading="lazy" className="size-full rounded-xl object-contain" />
                    ) : (
                      <Apple className="size-12 text-primary" aria-hidden />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col gap-2 p-3">
                    <p className="font-semibold leading-snug">{f.name}</p>
                    <p className="text-xs leading-relaxed text-muted-foreground"><span className="font-medium text-foreground">English:</span> {f.englishName}</p>
                    <p className="text-xs leading-relaxed text-muted-foreground"><span className="font-medium text-foreground">{f.otherNames.startsWith("Examples:") ? "Crop examples:" : "Also known as:"}</span> {f.otherNames.replace(/^Examples:\s*/, "")}</p>
                    <StatusBadge status="soon" label="Notes soon" />
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      ))}
      <p className="container-page pb-12 text-center text-xs text-muted-foreground">Photos: Wikipedia / Wikimedia Commons.</p>
    </>
  );
}
