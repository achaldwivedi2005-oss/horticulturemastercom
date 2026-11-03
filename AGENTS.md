<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Project rules
- Site-wide content config (brand, nav, exams, subjects, social URLs) lives in `src/lib/site.ts`; edit there instead of hardcoding in pages.
- Shared site UI lives in `src/components/site/`; shadcn primitives stay in `src/components/ui/` and get new looks via cva variants, not className overrides.
- All colors/gradients/shadows are oklch tokens + `@utility` helpers in `src/styles.css`; components never use raw color classes.
- Unbuilt sections render `ComingSoonPanel` / `StatusBadge` so placeholders are never mistaken for live features.
- Dark mode = `.dark` class on `<html>`, set pre-hydration by `themeInitScript` and toggled by `ThemeToggle` (localStorage key `hm-theme`).
- Exam/counselling/news posts live in the `exam_updates` table (admin-managed via RLS `has_role`), separate from scanned `job_postings`, because they are hand-verified notices rather than scraped vacancies.
