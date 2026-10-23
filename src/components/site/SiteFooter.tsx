import { Link } from "@tanstack/react-router";
import { exams, mainNav, site } from "@/lib/site";
import { LogoBadge } from "./Logo";
import { SocialIcons } from "./SocialLinks";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-muted/40">
      <div className="container-page grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="max-w-sm">
          <LogoBadge className="size-28 border border-border shadow-soft" />
          <p className="mt-4 text-sm text-muted-foreground">{site.shortDescription}</p>
          <div className="mt-5">
            <SocialIcons />
          </div>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Explore</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            {mainNav.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="text-muted-foreground transition-colors hover:text-foreground">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Exams we cover</p>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            {exams.map((e) => (
              <li key={e.code}>{e.code}</li>
            ))}
            <li>Other agri competitive exams</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container-page flex flex-col gap-2 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
          <p className="max-w-xl sm:text-right">
            Independent learning platform — not affiliated with ICAR, NTA or ASRB. Always verify details on official notifications.
          </p>
        </div>
      </div>
    </footer>
  );
}
