import { Send, MessageCircle, Youtube, ArrowUpRight, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";
import { StatusBadge } from "./StatusBadge";

type Channel = { key: keyof typeof site.social; name: string; blurb: string; icon: LucideIcon };

export const channels: Channel[] = [
  { key: "telegramChannel", name: "Telegram channel", blurb: "Updates, PDFs & exam alerts", icon: Send },
  { key: "telegramGroup", name: "Telegram quiz group", blurb: "Daily MCQs & discussion", icon: Users },
  { key: "whatsapp", name: "WhatsApp group", blurb: "Quick updates & job notifications", icon: MessageCircle },
  { key: "youtube", name: "YouTube", blurb: "Concept classes & revision videos", icon: Youtube },
];

/** Large community cards. Channels without a URL show a "coming soon" state. */
export function SocialCards({ className }: { className?: string }) {
  return (
    <div className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-4", className)}>
      {channels.map(({ key, name, blurb, icon: Icon }) => {
        const href: string = site.social[key];
        const inner = (
          <>
            <div className="flex items-start justify-between">
              <span className="grid size-11 place-items-center rounded-xl bg-deep-foreground/10 text-deep-foreground">
                <Icon className="size-5" />
              </span>
              {href ? (
                <ArrowUpRight className="size-5 text-deep-foreground/70 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              ) : (
                <StatusBadge status="soon" label="Link soon" />
              )}
            </div>
            <div className="mt-6">
              <p className="font-display text-xl font-semibold">{name}</p>
              <p className="mt-1 text-sm text-deep-foreground/70">{blurb}</p>
            </div>
          </>
        );
        const cls =
          "group rounded-2xl border border-deep-foreground/15 bg-deep-foreground/5 p-5 text-deep-foreground backdrop-blur transition-all duration-300";
        return href ? (
          <a key={key} href={href} target="_blank" rel="noopener noreferrer" className={cn(cls, "hover:-translate-y-1 hover:bg-deep-foreground/10")}>
            {inner}
          </a>
        ) : (
          <div key={key} className={cls} aria-label={`${name} link coming soon`}>
            {inner}
          </div>
        );
      })}
    </div>
  );
}

/** Compact icon row for the footer. */
export function SocialIcons() {
  return (
    <div className="flex gap-2">
      {channels.map(({ key, name, icon: Icon }) => {
        const href = site.social[key];
        const cls = "grid size-10 place-items-center rounded-full border border-border bg-card transition-colors";
        return href ? (
          <a key={key} href={href} target="_blank" rel="noopener noreferrer" aria-label={name} className={cn(cls, "hover:border-primary hover:text-primary")}>
            <Icon className="size-4" />
          </a>
        ) : (
          <span key={key} title={`${name} — link coming soon`} aria-label={`${name} link coming soon`} className={cn(cls, "opacity-50")}>
            <Icon className="size-4" />
          </span>
        );
      })}
    </div>
  );
}
