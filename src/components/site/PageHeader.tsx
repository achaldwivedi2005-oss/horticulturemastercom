import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

export function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-gradient-hero">
      <div className="pointer-events-none absolute inset-0 bg-dots opacity-40 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      <div className="container-page relative pb-14 pt-10 md:pb-20 md:pt-16">
        <Reveal>
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-primary">{eyebrow}</p>
          <h1 className="max-w-3xl text-4xl font-semibold leading-[1.05] text-balance sm:text-5xl md:text-6xl">{title}</h1>
          {description && (
            <p className="mt-5 max-w-2xl text-base text-muted-foreground text-pretty md:text-lg">{description}</p>
          )}
          {children && <div className="mt-8">{children}</div>}
        </Reveal>
      </div>
    </section>
  );
}
