---
version: alpha
name: Portfolio — Agents
description: >-
  Per-repo entrypoint for agentic tooling and new contributors. Directs LLM
  agents to the canonical conventions, the project layout, validation commands,
  and the rules that matter most for this Vue + Vite + Pug + Tailwind portfolio.
audience:
  - llm-agent
  - contributor
scope:
  - repository
tags:
  - agent-instructions
  - conventions
  - validation
  - skill-hints
related:
  - README.md
  - docs/CONVENTIONS.md
---

# Agents

Per-repo entrypoint for agentic tooling (Claude Code, automation scripts) and any new contributor working on the **deluisa.me** portfolio — a multilingual, static, Vue 3 single-page app.

## Where the rules live

- **[`docs/CONVENTIONS.md`](docs/CONVENTIONS.md)** — canonical reference for **all** coding conventions (Pug + `<script setup>` discipline, i18n, theme tokens, styling, motion/GSAP, routing, content, composables, SSG safety, code style, git). New code MUST follow it; when in doubt, this file wins.
- **[`README.md`](README.md)** — project overview, philosophy, stack, and the "sacred" header note.

If you keep a root `CLAUDE.md`, make it a symlink to this file — keep canonical edits in `AGENTS.md` only.

## Agent workflow

- Start by reading `docs/CONVENTIONS.md`; skim `README.md` for the design intent.
- Check `git status --short` before editing. Preserve unrelated user changes, and never hand-edit generated output (`src/data/githubProfile.ts`) — regenerate it instead.
- Use `rg` / `rg --files` for discovery and read only the focused files you need.
- This is a **single Vite app, not a monorepo** — there is no backend, database, or API. Don't invent server-side code; everything is static and pre-rendered by `vite-ssg`.
- When you add or rename an i18n key, update **all five** locale files (`src/i18n/locales/{en,it,ja,ru,uk}.ts`) in the same change.

## The five rules you will break first if you skip them

1. **Pug templates + `<script setup lang="ts">` in every `.vue`**, ordered with `// MARK: - <Section>` comments (`Composables → Variables → Computed → Methods → Watchers → Lifecycle`).
2. **Every user-facing string goes through `useI18n().t(...)`** — never hard-code copy (including `aria-label`, `alt`, `title`).
3. **Colours and spacing come from theme tokens** (`site-*` Tailwind utilities / `--site-*` vars), never raw hex or ad-hoc `px`.
4. **Special-character classes go in `(class="…")`**, plain ones use Pug's `.class` shorthand.
5. **Respect `prefers-reduced-motion` and always clean up GSAP** (kill timelines/ScrollTriggers, `revert()` SplitText on unmount); guard all `window`/`document` access for SSG.

## Skill hints for capable agents

If the agent runtime exposes skills, use the matching skill before implementing:

- `brainstorming` — new sections, UX changes, behaviour changes, or ambiguous implementation work.
- `frontend-design` — building or restyling components/pages where visual quality matters.
- `recursive-decomposition` — repo-wide searches or analysis spanning many files.

If a named skill is unavailable, continue with the closest local convention and mention the missing skill in the final note.

## Common commands

All commands run through **bun**.

- Install dependencies: `bun install`.
- Start the dev server: `bun dev`.
- Production build (type-check + build): `bun run build`.
- Type-check only: `bun run type-check` (`vue-tsc`).
- Lint + format (oxlint → eslint → oxfmt, all auto-fix): `bun lint`.
- Format only: `bun run format` (`oxfmt`).
- Regenerate GitHub profile data: `bun run sync:github`.

Prefer the narrowest command that validates what you changed; run `bun run type-check` and `bun lint` before claiming work is done.

## Generated files and secrets

- Treat `src/data/githubProfile.ts` as **generated** output of `scripts/sync-github-profile.mjs`. Regenerate via `bun run sync:github`; never hand-edit it.
- Never print or commit secrets. The sync script reads tokens (`PROFILE_SYNC_TOKEN`, `GH_TOKEN`) from the environment — reference variable **names** in docs and logs, not values.

## Quick repo layout

| Area | Path | Purpose |
|---|---|---|
| Root layout | `src/App.vue`, `src/main.ts` | Header + `RouterView` + footer; app bootstrap (router, unhead, dayjs) |
| Pages | `src/views/*View.vue` | Routable top-level views (home, blog, blog post, work detail) |
| Home sections | `src/components/home/` | Hero, About, Contact, animated backgrounds |
| Work | `src/components/work/` | Selected-work section + case-study detail UI |
| Site chrome | `src/components/site/` | Header, nav, language switcher, scroll-to-top |
| Shared | `src/components/shared/` | `Section`, `SectionHeading`, `TechBrand`, cards |
| Composables | `src/composables/use*.ts` | Scroll spy, text reveal, locale, scroll progress |
| Content | `src/contents/` | `works.ts` / `blog.ts` loaders + `works/*.md`, `blog/*.md` |
| i18n | `src/i18n/` | `index.ts` + `locales/{en,it,ja,ru,uk}.ts` |
| Data | `src/data/` | Static catalogs + generated `githubProfile.ts` |
| Routing | `src/router/index.ts` | Locale-prefixed routes, scroll behaviour |
| Styling | `src/assets/` | `tailwind.css` (`@theme` tokens), `theme.scss` (CSS vars, dark mode), fonts |

For everything else — coding rules, naming, patterns, examples — start at [`docs/CONVENTIONS.md`](docs/CONVENTIONS.md).
