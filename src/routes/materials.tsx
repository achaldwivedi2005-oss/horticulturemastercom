import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { FileText, FolderOpen, Search, Eye, ExternalLink, AlertCircle, Loader2 } from "lucide-react";
import { driveLibraryQuery, type DrivePdf } from "@/lib/drive/drive.functions";
import { driveSubjects } from "@/lib/drive/categorize";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { EmptyState } from "@/components/site/EmptyState";
import { PdfViewerDialog } from "@/components/materials/PdfViewerDialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { site } from "@/lib/site";
import { isHorticultureMasterNote } from "@/lib/drive/material-groups";
import { FruitCropsGrid } from "@/components/site/FruitCropsGrid";

export const Route = createFileRoute("/materials")({
  head: () => ({
    meta: [
      { title: "Study Materials & PDF Library — Horticulture Master" },
      {
        name: "description",
        content:
          "Horticulture books, MCQ guides and ICAR JRF/SRF previous year papers — searchable, filterable and viewable online.",
      },
      { property: "og:title", content: "Study Materials & PDF Library — Horticulture Master" },
      {
        property: "og:description",
        content: "Subject-wise horticulture PDFs and previous year papers with search and filters.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MaterialsPage,
});

const NEW_DAYS = 14;

function isNew(file: DrivePdf) {
  return Date.now() - new Date(file.createdTime).getTime() < NEW_DAYS * 86_400_000;
}

function formatSize(bytes: number | null) {
  if (!bytes) return "";
  return bytes > 1_048_576 ? `${(bytes / 1_048_576).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

function MaterialsPage() {
  const { data, isLoading, isError, isFetching, refetch } = useQuery(driveLibraryQuery);
  const files = data?.files ?? [];
  const [query, setQuery] = useState("");
  const [subject, setSubject] = useState<string>("All");
  const [collection, setCollection] = useState<string>("All");
  const [viewing, setViewing] = useState<DrivePdf | null>(null);

  const collections = useMemo(() => ["All", ...Array.from(new Set(files.map((f) => f.collection)))], [files]);
  const subjectCounts = useMemo(() => {
    const m = new Map<string, number>();
    for (const f of files) for (const s of f.subjects) m.set(s, (m.get(s) ?? 0) + 1);
    return m;
  }, [files]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return files.filter(
      (f) =>
        (subject === "All" || f.subjects.includes(subject as never)) &&
        (collection === "All" || f.collection === collection) &&
        (!q || `${f.title} ${f.folderPath.join(" ")}`.toLowerCase().includes(q)),
    );
  }, [files, query, subject, collection]);

  return (
    <>
      <PageHeader
        eyebrow="Study materials"
        title="Notes that follow the syllabus, not the noise"
        description="Books, MCQ guides and previous year papers — organised by subject. New PDFs added to our library appear here automatically."
      />

      <section className="container-page py-10 md:py-14">
        <Reveal className="rounded-3xl border border-border bg-card p-4 shadow-soft sm:p-6">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search books, papers, topics…"
              aria-label="Search study materials"
              className="h-12 rounded-full pl-11 text-base"
            />
          </div>
          <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Filter by subject">
            {["All", ...driveSubjects].map((s) => {
              const count = s === "All" ? files.length : (subjectCounts.get(s) ?? 0);
              if (s !== "All" && count === 0) return null;
              return (
                <button
                  key={s}
                  onClick={() => setSubject(s)}
                  aria-pressed={subject === s}
                  className={cn(
                    "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all",
                    subject === s
                      ? "border-primary bg-primary text-primary-foreground shadow-glow"
                      : "border-border bg-background hover:border-primary/40",
                  )}
                >
                  {s} <span className="opacity-70">({count})</span>
                </button>
              );
            })}
          </div>
          {collections.length > 2 && (
            <div className="mt-3 flex flex-wrap items-center gap-2" role="group" aria-label="Filter by collection">
              <FolderOpen className="size-4 text-muted-foreground" />
              {collections.map((c) => (
                <button
                  key={c}
                  onClick={() => setCollection(c)}
                  aria-pressed={collection === c}
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider transition-colors",
                    collection === c ? "bg-secondary text-secondary-foreground" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          )}
        </Reveal>

        <div className="mt-8">
          {isLoading ? (
            <div className="flex items-center justify-center gap-2 py-20 text-muted-foreground">
              <Loader2 className="size-5 animate-spin" /> Loading library…
            </div>
          ) : data?.error || isError ? (
            <div>
              <EmptyState icon={AlertCircle} title="Library temporarily unavailable" description="Google Drive is temporarily busy. Please try again shortly." />
              <div className="flex justify-center">
                <Button onClick={() => void refetch()} disabled={isFetching}>
                  {isFetching ? <Loader2 className="animate-spin" /> : <FolderOpen />} Try again
                </Button>
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState icon={FileText} title="No matching PDFs" description="Try another search term or filter." />
          ) : (
            <>
              <p className="mb-4 text-sm text-muted-foreground">
                Showing {filtered.length} of {files.length} PDFs
              </p>
              <div className="grid gap-8 md:grid-cols-2">
                {[
                  { title: site.materialColumns.notes, items: filtered.filter(isHorticultureMasterNote) },
                  { title: site.materialColumns.books, items: filtered.filter((f) => !isHorticultureMasterNote(f)) },
                ].map((column) => (
                  <section key={column.title} className="min-w-0" aria-label={column.title}>
                    <h2 className="mb-5 border-b border-border pb-4 text-2xl">{column.title} <span className="text-sm font-sans text-muted-foreground">({column.items.length})</span></h2>
                    {column.items.length === 0 ? (
                      <p className="py-8 text-sm text-muted-foreground">{query || subject !== "All" || collection !== "All" ? "No matching PDFs in this collection." : "Notes coming soon."}</p>
                    ) : (
                    <div className="grid gap-4 xl:grid-cols-2">
                {column.items.map((f, i) => (
                  <Reveal key={f.id} delay={(i % 6) * 50}>
                    <article className="card-lift group flex h-full flex-col rounded-2xl border border-border bg-card p-5">
                      <div className="flex items-start gap-3">
                        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-secondary text-primary">
                          <FileText className="size-5" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <h3 className="line-clamp-2 font-sans text-base font-semibold leading-snug tracking-normal">
                            {f.title}
                          </h3>
                          <p className="mt-1 truncate text-xs text-muted-foreground">{f.folderPath.join(" › ")}</p>
                        </div>
                        {isNew(f) && (
                          <span className="shrink-0 rounded-full bg-sun px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-sun-foreground">
                            New
                          </span>
                        )}
                      </div>
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {f.subjects.map((s) => (
                          <span key={s} className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
                            {s}
                          </span>
                        ))}
                      </div>
                      <div className="mt-auto flex items-center justify-between gap-2 pt-5">
                        <span className="text-xs text-muted-foreground">
                          {formatSize(f.sizeBytes)}
                          {f.sizeBytes ? " · " : ""}
                          {new Date(f.createdTime).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                        <div className="flex gap-1.5">
                          <Button size="sm" variant="ghost" asChild aria-label={`Open ${f.title} in Google Drive`}>
                            <a href={`https://drive.google.com/file/d/${f.id}/view`} target="_blank" rel="noopener noreferrer">
                              <ExternalLink />
                            </a>
                          </Button>
                          <Button size="sm" onClick={() => setViewing(f)} className="rounded-full">
                            <Eye /> View
                          </Button>
                        </div>
                      </div>
                    </article>
                  </Reveal>
                ))}
                    </div>
                    )}
                  </section>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <div id="fruit-science" className="border-t border-border">
        <div className="container-page pt-10 md:pt-14">
          <h2 className="text-3xl">Fruit Science crops</h2>
          <p className="mt-2 text-sm text-muted-foreground">All fruit crops with English names, other names and photos. Crop-wise notes coming soon.</p>
        </div>
        <FruitCropsGrid />
      </div>

      <PdfViewerDialog file={viewing} onClose={() => setViewing(null)} />
    </>
  );
}
