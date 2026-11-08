import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { FruitCropsGrid } from "@/components/site/FruitCropsGrid";

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
      <FruitCropsGrid />
    </>
  );
}
