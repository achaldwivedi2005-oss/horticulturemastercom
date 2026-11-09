import { Link } from "@tanstack/react-router";
import { Apple, Carrot, ChevronRight, Flower2, Leaf, Package, Sprout } from "lucide-react";
import { LogoBadge } from "@/components/site/Logo";
import { StatusBadge } from "@/components/site/StatusBadge";

export const branches = [
  { name: "Fruit Science", icon: Apple, href: "/fruit-science" as const },
  { name: "Vegetable Science", icon: Carrot },
  { name: "Floriculture", icon: Flower2 },
  { name: "Medicinal, Plantation & Spice Crops", icon: Leaf },
  { name: "Postharvest Technology", icon: Package },
];

/** Big gold card in Study Materials that opens the notes page. */
export function NotesBranches() {
  return (
    <Link to="/notes" className="gold-card card-lift mb-8 flex w-full items-center gap-4 rounded-3xl p-5 sm:gap-6 sm:p-8">
      <span className="logo-shine size-20 shrink-0 sm:size-28">
        <LogoBadge className="size-full" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-display text-2xl font-extrabold sm:text-4xl">Horticulture Master Notes</span>
        <span className="mt-1 block text-sm font-medium opacity-80">5 branches · Tap to open</span>
      </span>
      <ChevronRight className="size-7 shrink-0" />
    </Link>
  );
}

export function BranchList() {
  return (
    <div>
    <div className="mb-4 flex items-center gap-3 rounded-2xl border border-border bg-secondary p-4">
      <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-card text-primary">
        <Sprout className="size-5" />
      </span>
      <h2 className="font-display text-xl font-extrabold sm:text-2xl">General Horticulture</h2>
    </div>
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {branches.map((b, i) => {
        const inner = (
          <>
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-secondary text-primary">
              <b.icon className="size-5" />
            </span>
            <span className="min-w-0 flex-1 font-semibold">{i + 1}. {b.name}</span>
            {!b.href && <StatusBadge status="soon" />}
          </>
        );
        const cls = "card-lift flex items-center gap-3 rounded-2xl border border-border bg-card p-4";
        return b.href ? (
          <Link key={b.name} to={b.href} className={cls}>{inner}</Link>
        ) : (
          <div key={b.name} className={cls}>{inner}</div>
        );
      })}
    </div>
    </div>
  );
}
