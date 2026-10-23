import { Link } from "@tanstack/react-router";
import logoMark from "@/assets/logo-mark.png.asset.json";
import logoFull from "@/assets/logo-full.png.asset.json";
import { cn } from "@/lib/utils";

/** Leaf-and-crown mark cropped from the official Horticulture Master logo. */
export function LogoMark({ className }: { className?: string | undefined }) {
  return (
    <img
      src={logoMark.url}
      alt=""
      width={256}
      height={256}
      className={cn("size-10 object-contain drop-shadow-sm", className)}
    />
  );
}

/** The full round brand logo (with wordmark). */
export function LogoBadge({ className }: { className?: string | undefined }) {
  return (
    <img
      src={logoFull.url}
      alt="Horticulture Master logo"
      width={640}
      height={640}
      className={cn("rounded-full bg-card object-contain", className)}
    />
  );
}

export function Logo({ className }: { className?: string | undefined }) {
  return (
    <Link to="/" className={cn("group flex items-center gap-2", className)} aria-label="Horticulture Master home">
      <LogoMark className="transition-transform duration-500 group-hover:rotate-[-6deg]" />
      <span className="flex flex-col leading-none">
        <span className="font-display text-lg font-semibold tracking-tight">Horticulture</span>
        <span className="text-[0.65rem] font-bold uppercase tracking-[0.28em] text-sun-foreground dark:text-sun">Master</span>
      </span>
    </Link>
  );
}
