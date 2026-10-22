import { cn } from "@/lib/utils";

type Status = "live" | "soon";

/**
 * Marks whether a feature is working today ("live") or planned ("soon").
 * Used everywhere so visitors can always tell real features from placeholders.
 */
export function StatusBadge({ status, label, className }: { status: Status; label?: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.7rem] font-semibold uppercase tracking-wider",
        status === "live" ? "bg-secondary text-secondary-foreground" : "bg-sun/20 text-sun-foreground dark:text-sun",
        className,
      )}
    >
      <span
        className={cn("size-1.5 rounded-full", status === "live" ? "bg-primary animate-pulse" : "bg-sun")}
        aria-hidden
      />
      {label ?? (status === "live" ? "Live" : "Coming soon")}
    </span>
  );
}
