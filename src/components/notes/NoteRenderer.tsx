import { Fragment, type ReactNode } from "react";
import type { NoteBlock, NoteSection } from "@/lib/notes/types";
import { GrowthCurve, PomeDiagram, RootstockChart } from "./NoteDiagrams";

/** Renders **bold** and *italic* (botanical names) markup. */
export function Rich({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return (
    <>
      {parts.map((p, i): ReactNode => {
        if (p.startsWith("**")) return <strong key={i} className="font-semibold text-foreground">{p.slice(2, -2)}</strong>;
        if (p.startsWith("*") && p.length > 2) return <em key={i}>{p.slice(1, -1)}</em>;
        return <Fragment key={i}>{p}</Fragment>;
      })}
    </>
  );
}

const tone = {
  gold: "gold-card",
  green: "border-primary/40 bg-primary/5",
  alert: "border-destructive/40 bg-destructive/5",
} as const;

function Block({ b }: { b: NoteBlock }) {
  switch (b.type) {
    case "p":
      return <p className="leading-relaxed text-muted-foreground"><Rich text={b.text} /></p>;
    case "list":
      return (
        <div>
          {b.title && <h4 className="mb-2 font-semibold text-primary">{b.title}</h4>}
          <ul className="space-y-1.5">
            {b.items.map((it, i) => (
              <li key={i} className="flex gap-2 text-sm leading-relaxed">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                <span><Rich text={it} /></span>
              </li>
            ))}
          </ul>
        </div>
      );
    case "table":
      return (
        <div>
          {b.title && <h4 className="mb-2 font-semibold text-primary">{b.title}</h4>}
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-left text-sm">
              <thead className="bg-primary text-primary-foreground">
                <tr>{b.head.map((h) => <th key={h} className="px-3 py-2 font-semibold">{h}</th>)}</tr>
              </thead>
              <tbody>
                {b.rows.map((r, i) => (
                  <tr key={i} className="border-t border-border even:bg-muted/50">
                    {r.map((c, j) => <td key={j} className={`px-3 py-2 align-top ${j === 0 ? "font-medium" : "text-muted-foreground"}`}><Rich text={c} /></td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    case "callout":
      return (
        <div className={`rounded-2xl border p-4 ${tone[b.tone]}`}>
          <h4 className="mb-2 font-semibold">{b.title}</h4>
          <ul className="list-disc space-y-1 pl-5 text-sm">{b.items.map((it, i) => <li key={i}><Rich text={it} /></li>)}</ul>
        </div>
      );
    case "diagram":
      return b.name === "pome" ? <PomeDiagram /> : b.name === "rootstock" ? <RootstockChart /> : <GrowthCurve />;
  }
}

export function NoteSections({ sections }: { sections: NoteSection[] }) {
  return (
    <div className="space-y-6">
      {sections.map((s) => (
        <section key={s.id} id={s.id} className="scroll-mt-24 rounded-3xl border border-border bg-card p-5 shadow-sm md:p-7">
          <h3 className="mb-4 border-b border-border pb-3 font-display text-xl text-primary md:text-2xl"><Rich text={s.title} /></h3>
          <div className="space-y-5">{s.blocks.map((b, i) => <Block key={i} b={b} />)}</div>
        </section>
      ))}
    </div>
  );
}
