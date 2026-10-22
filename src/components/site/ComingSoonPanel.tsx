import { CheckCircle2, Hammer } from "lucide-react";
import { Reveal } from "./Reveal";
import { StatusBadge } from "./StatusBadge";

/**
 * Honest placeholder for sections that are designed but not yet functional.
 * Lists the features planned for the section so nothing is passed off as live.
 */
export function ComingSoonPanel({ stage, features }: { stage: string; features: string[] }) {
  return (
    <section className="container-page py-14 md:py-20">
      <Reveal className="overflow-hidden rounded-3xl border border-border bg-card shadow-soft">
        <div className="grid md:grid-cols-[1fr_1.3fr]">
          <div className="relative bg-gradient-deep p-8 text-deep-foreground md:p-10">
            <div className="pointer-events-none absolute -right-10 -top-10 size-48 rounded-full bg-accent/20 blur-3xl" />
            <span className="grid size-12 place-items-center rounded-2xl bg-deep-foreground/10">
              <Hammer className="size-6" />
            </span>
            <h2 className="mt-6 text-3xl font-semibold">Being built</h2>
            <p className="mt-3 text-deep-foreground/75">
              This section is designed and scheduled for <strong className="text-deep-foreground">{stage}</strong>.
              Nothing shown here is live data yet.
            </p>
            <StatusBadge status="soon" className="mt-6" label={stage} />
          </div>
          <div className="p-8 md:p-10">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Planned features</p>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {features.map((f) => (
                <li key={f} className="flex items-start gap-3 rounded-xl bg-muted/60 p-3.5 text-sm">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
