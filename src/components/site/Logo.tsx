import { Link } from "@tanstack/react-router";
import { Sprout } from "lucide-react";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "grid size-9 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow",
        className,
      )}
    >
      <Sprout className="size-5" strokeWidth={2.2} />
    </span>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <Link to="/" className={cn("group flex items-center gap-2.5", className)} aria-label="Horticulture Master home">
      <LogoMark className="transition-transform duration-500 group-hover:rotate-[-8deg]" />
      <span className="flex flex-col leading-none">
        <span className="font-display text-lg font-semibold tracking-tight">Horticulture</span>
        <span className="text-[0.65rem] font-bold uppercase tracking-[0.28em] text-primary">Master</span>
      </span>
    </Link>
  );
}
