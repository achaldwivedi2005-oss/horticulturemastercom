import { Apple } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";
import { StatusBadge } from "@/components/site/StatusBadge";
import { fruitGroups } from "@/lib/fruits";

/** All Fruit Science crops (major, citrus, minor) with names, aliases and photos. */
export function FruitCropsGrid() {
  return (
    <>
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
