import { useState } from "react";
import { Apple, Carrot, ChevronDown, Flower2, Leaf, Package, Sprout, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { StatusBadge } from "@/components/site/StatusBadge";

const branches = [
  { name: "Fruit Science", icon: Apple, href: "#fruit-science" },
  { name: "Vegetable Science", icon: Carrot },
  { name: "Floriculture", icon: Flower2 },
  { name: "Medicinal, Plantation & Spice Crops", icon: Leaf },
  { name: "Postharvest Technology", icon: Package },
  { name: "General Horticulture", icon: Sprout },
];

export function NotesBranches() {
  const [open, setOpen] = useState(false);
  return (
    <div className="mb-8">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="shine-card bg-gradient-primary flex w-full items-center gap-4 rounded-3xl border-2 border-sun p-5 text-left text-primary-foreground sm:p-7"
      >
        <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-sun text-sun-foreground">
          <Sparkles className="size-7" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-2xl font-extrabold sm:text-3xl">Horticulture Master Notes</span>
          <span className="mt-1 block text-sm opacity-90">Tap to open 6 branches</span>
        </span>
        <ChevronDown className={cn("size-6 shrink-0 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
              <a key={b.name} href={b.href} className={cls}>{inner}</a>
            ) : (
              <div key={b.name} className={cls}>{inner}</div>
            );
          })}
        </div>
      )}
    </div>
  );
}
