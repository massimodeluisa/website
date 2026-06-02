---
version: alpha
name: Portfolio — Conventions
description: >-
  Canonical coding, architecture, UI, Pug, styling, i18n, routing, content,
  motion, and git conventions for the deluisa.me portfolio. New human- or
  LLM-authored code must follow this file when conventions conflict.
audience:
  - llm-agent
  - contributor
scope:
  - repository
canonical: true
priority: highest
tags:
  - coding-conventions
  - vue
  - pug
  - tailwind
  - i18n
  - gsap
related:
  - ../AGENTS.md
  - ../README.md
---

# Portfolio — Conventions

Canonical reference for **all** coding conventions in this repository — the multilingual personal portfolio of Massimo De Luisa ([deluisa.me](https://deluisa.me)). New code (LLM-generated or human) MUST follow these rules.

**Related documents:**

- [`../AGENTS.md`](../AGENTS.md) — per-repo entrypoint for agentic tooling and new contributors (points back here).
- [`../README.md`](../README.md) — project overview, philosophy, and stack.

When `AGENTS.md` and `CONVENTIONS.md` disagree, this file wins.

This is a **single Vite app**, not a monorepo. There is no backend, no database, and no API layer — everything is static, client-rendered, and pre-rendered at build time via `vite-ssg`.

---

## ⭐ Crucial — read first

These three are non-negotiable foundations of the codebase. Every other rule below is downstream of them.

### C-1. Pug + `<script setup lang="ts">` + `// MARK:` ordering

Every `.vue` file uses **`<template lang="pug">`** and **`<script setup lang="ts">`**. Scripts are organised top-to-bottom from broad dependencies to local behaviour, with Apple-style `// MARK: - <Section>` section comments. Full rules in § UI rules → Script organization. This is the single most visible convention in the codebase — match it exactly.

### C-2. Every user-facing string goes through i18n

The site ships in **five languages** (`en` default, `it`, `ja`, `ru`, `uk`). No copy is ever hard-coded in a template or script. All visible text resolves through `useI18n().t('namespace.key')`, and the key must exist in **all** locale files under `src/i18n/locales/`. Full rules in § Internationalization.

```pug
//- ✅ copy via i18n
a.footer-link(href="/cv.pdf" download) {{ t('footer.cv') }}

//- ❌ hard-coded copy — breaks the other four languages
a.footer-link(href="/cv.pdf" download) Download CV
```

`aria-label`, `alt`, `title`, and any other human-readable attribute counts as copy and must be translated too.

### C-3. Colours and spacing come from theme tokens — never hard-coded

Colours are exposed both as CSS custom properties (`--site-background`, `--site-muted`, …) defined in `src/assets/theme.scss` and as Tailwind colour utilities (`bg-site-background`, `text-site-muted`, `border-site-border`) registered in `src/assets/tailwind.css`. Fonts and the Osaka accent palette are tokens too.

- In **Pug templates** reach for the Tailwind `site-*` colour utilities.
- In **scoped SCSS** reference the `var(--site-*)` custom properties.
- **Never** write a raw hex, `rgb()`, or named colour in a component. A new colour means a new token in `theme.scss` (+ its Tailwind mapping), not an inline literal.

```pug
//- ✅ themed
section.bg-site-background.text-site-text.border-site-border

//- ❌ raw colour — invisible to dark mode and the theme switcher
section(style="background:#f8f8f5; color:#484647")
```

---

## Project layout

```
src/
├── App.vue                 # Root layout: SiteHeader + RouterView + footer + ScrollToTop
├── main.ts                 # createApp + router + @unhead/vue + dayjs plugins
├── assets/                 # tailwind.css, theme.scss, main.scss, fonts, images, works/*
├── components/
│   ├── home/               # Landing-page sections (Hero*, About*, Contact*, backgrounds)
│   ├── work/               # Selected-work section + detail (Work*, Selettore-style pickers)
│   ├── site/               # Chrome: SiteHeader, nav, LanguageSwitcher, ScrollToTopButton
│   └── shared/             # Cross-cutting primitives: Section, SectionHeading, TechBrand…
├── composables/            # use-*.ts (kebab) — scroll spy, text reveal, locale…
├── contents/               # Markdown-driven content
│   ├── works.ts            # Loads & normalises src/contents/works/*.md
│   ├── blog.ts             # Loads & normalises src/contents/blog/*.md
│   ├── loader.ts           # Shared frontmatter helpers (slugFromPath, asString, asStringArray)
│   ├── works/*.md          # Case studies (frontmatter + body)
│   └── blog/*.md           # Journal posts (frontmatter + body)
├── data/                   # Static catalogs (techBrands, workTechnologyCatalog) + navigation.ts (nav + section ids)
├── i18n/                   # Custom i18n: index.ts + locales/{en,it,ja,ru,uk}.ts
├── router/index.ts         # vue-router, locale-prefixed routes, scroll behaviour
├── utils/                  # Pure, framework-agnostic helpers (e.g. motion.ts)
└── views/                  # Routable top-level pages: *View.vue
```

- **`components/shared`** is the only home for cross-cutting primitives. If a component is used by two or more feature folders, lift it here.
- **`composables/`** holds all reusable reactive logic (`use*.ts`). Never duplicate a composable's logic inline in a component.
- **`utils/`** holds pure, non-reactive, framework-agnostic helpers (no Vue refs, no lifecycle). The SSR-safe `prefersReducedMotion()` lives in `utils/motion.ts` — import it, never re-implement the `matchMedia('(prefers-reduced-motion: reduce)')` check inline.
- **`data/`** holds hand-authored static catalogs (`techBrands.ts`, `navigation.ts`, `workTechnologyCatalog.ts`) — typed `const` exports keyed by a stable id.
- `views/` are route targets only; the substance lives in `components/`.

Import alias: **`@/` = `src/`** (configured in `vite.config.ts` and `tsconfig`). Use `@/…` for anything outside the current folder; relative imports (`./Foo.vue`) only for close siblings.

---

## UI rules — `.vue` components

### Templates and scripts

- **Pug + `<script setup lang="ts">`** is mandatory for every `.vue` file.
- Styles, when Tailwind cannot express them, go in **`<style scoped lang="scss">`** at the bottom of the file.
- Component file naming and suffixes: see § File naming.

### Script organization

Organise the `<script setup>` block from broad dependencies to local behaviour, in this order:

1. **Imports** — external packages first, then `@/…`, then relative siblings.
2. **Types / interfaces** — local `type` / `interface` declarations and literal constants that don't depend on component state.
3. **`defineProps` / `defineEmits` / `defineModel`** — the component contract, in **runtime object form** (see § Compiler macros). Prefer `defineModel(...)` for two-way parent-owned values over a `modelValue` prop + manual emit.
4. `// MARK: - Composables` — `useRoute()`, `useI18n()`, `useLocale()`, custom `use*` composables, stores.
5. `// MARK: - Variables` — `ref` / `shallowRef` / `reactive` state and other mutable locals.
6. `// MARK: - Computed` — all `computed(...)` values.
7. `// MARK: - Methods` — event handlers, loaders, and pure local functions.
8. `// MARK: - Watchers` — `watch(...)` / `watchEffect(...)`.
9. `// MARK: - Lifecycle` — `onMounted`, `onBeforeUnmount`, `onUnmounted`, etc.

Use the section comment **exactly** as `// MARK: - <Section>`, with the canonical names above (`Composables`, `Variables`, `Computed`, `Methods`, `Watchers`, `Lifecycle`). Keep the comment label matched to what actually follows it — a `// MARK: - Variables` block must contain variables, not composables. Omit sections a component doesn't need; never reorder them.

### Compiler macros — runtime object form, not generics

`defineProps`, `defineModel`, and `defineEmits` use the **runtime object form**, never the `<T>` type-argument form.

```ts
// ✅ runtime object form
const props = defineProps({
  id: { type: String, required: false },
  contentClass: { type: String, default: '' },
  work: { type: Object as PropType<WorkCaseStudy>, required: true },
})
const open = defineModel('open', { type: Boolean, default: false })
const emit = defineEmits(['close', 'select'])
```

```ts
// ❌ type-generic form
const props = defineProps<{ id?: string; contentClass?: string }>()
const open = defineModel<boolean>('open')
const emit = defineEmits<{ close: []; select: [id: string] }>()
```

- Declare prop options explicitly: `type`, plus `required` or `default`.
- For non-primitive prop types use `Object as PropType<T>` / `Array as PropType<T[]>` and import the type — that keeps full type-safety without the generic macro form.
- `defineEmits` takes the array of event names (or the runtime object map when you need per-event validation).

### Pug class syntax — `.class` shorthand vs `(class="…")`

Plain class names use Pug's `.class` shorthand. Class names containing characters Pug's shorthand cannot parse — dots, parentheses, slashes, square brackets, colons stacked beyond the first variant — go inside the `(class="…")` attribute. Mix both on the same element:

```pug
//- ✅ plain classes via shorthand, special-char ones via the attribute
.relative.z-10.mx-auto.w-full.px-6(class="max-w-[calc(var(--spacing)*310)] md:px-12 lg:px-20")
.grid.items-center.gap-x-12(class="gap-y-10 md:gap-y-16 lg:grid-cols-[1.2fr_0.8fr]")
p.font-mono.uppercase.text-site-muted(class="text-[10px] tracking-[0.2em]")

//- ❌ shorthand cannot parse the fractional size or arbitrary value
.grid.gap-y-1.5.max-w-[calc(var(--spacing)*310)]
```

Characters that force the attribute form: `.` (fractional sizes like `gap-y-1.5`, `border-1.5`), `(` `)` (arbitrary `calc()` / `var()` values), `/` (`max-w-1/2`, `bg-site-surface/80`), `[` `]` (Tailwind arbitrary values like `max-w-[calc(...)]`, `text-[10px]`, `lg:grid-cols-[1.2fr_0.8fr]`), and multi-stacked variants (`md:hover:lg:…`) for readability.

### CSS naming — hyphens only, never underscores

Every authored CSS class name and element `id` is **kebab-case using hyphens (`-`)** — underscores (`_`) are forbidden.

```pug
//- ✅ hyphenated class and id names
section#hero-stage.hero-stage
.reveal-line-inner
a.footer-link

//- ❌ underscores in authored names
section#hero_stage.hero_stage
.reveal_line_inner
a.footer_link
```

This applies to:

- `class="…"` / `.class` names you define and target in `<style scoped>`.
- `id` attributes (including section anchors used by `useScrollSpy` and the router hash).
- SCSS selectors, `@keyframes` names, and CSS custom properties (`--site-link-hover`, not `--site_link_hover`).

The **only** underscores allowed in markup are inside Tailwind's arbitrary-value brackets, where `_` is Tailwind's own encoding for a space (`grid-cols-[1.2fr_0.8fr]`, `[grid-area:main_header]`) — that is generated Tailwind syntax, not an authored name, so it stays.

### Styling — Tailwind structure, tokens for colour & spacing

- **Tailwind utilities** handle structural layout: `flex`, `grid`, `overflow`, `min-w-0`, `truncate`, sizing, responsive prefixes.
- **Colour** always comes from `site-*` utilities / `--site-*` vars (C-3). The Osaka palette (`osaka-red`, `osaka-umber`, `osaka-garnet`, `osaka-ivory`) is for deliberate accents only.
- **Spacing** uses Tailwind's scale and the `--spacing` multiplier inside arbitrary values. The canonical page gutter is the `site-container` utility (`src/assets/tailwind.css`) — full-width with a fluid `clamp()` horizontal padding, no fixed `max-width`. Reach for it (via `<Section>`) rather than a per-page width. Don't sprinkle raw `px`/`rem` where a scale step or token works.
- **SCSS scoped blocks** are reserved for what Tailwind can't do declaratively: keyframes, complex pseudo-element chrome, `color-mix()` borders, `prefers-reduced-motion` fallbacks. Keep them small and reference `var(--site-*)`.

### Theme / dark mode

- Light is the default; dark activates via `@media (prefers-color-scheme: dark)` **and** via the explicit `[data-theme="dark"]` / `.dark` selectors. The Tailwind `dark:` variant is wired to mirror both (`@custom-variant dark` in `tailwind.css`).
- When you add a colour token, define it in **every** theme branch in `theme.scss` (light, the `color-mix` light refinement, the `prefers-color-scheme: dark` block, and the explicit `[data-theme="dark"]` block) and register its `--color-site-*` mapping in `tailwind.css`. A token defined in only one branch is a bug.

### Typography & fonts

- Font families are tokens: `font-sans` (Geist Sans), `font-mono` (Geist Mono), the `font-pixel*` Geist Pixel variants, and `font-jp` (DotGothic16 for Japanese). Apply via the Tailwind utility (`.font-mono`, `.font-pixel`), never a raw `font-family` declaration.
- Fonts are self-hosted variable WOFF2 in `public/fonts/` with `font-display: swap`. Don't add network font links except the existing DotGothic16 import.

### Motion / GSAP

Motion is purposeful and restrained — it must never block content or fight the reader.

- Register plugins **once** at module scope: `gsap.registerPlugin(ScrollTrigger, SplitText, …)`. Never register inside a component method.
- **Always respect reduced motion.** Guard every animation with `prefersReducedMotion()` from `@/utils/motion`; when reduced, snap to the final visible state (`gsap.set(el, { opacity: 1, clearProps: 'transform' })`) instead of animating. Never hand-roll the `matchMedia` check.
- **Always clean up.** Kill timelines and ScrollTriggers and `revert()` any `SplitText` on `onUnmounted` / `onBeforeUnmount`. Reusable reveal/scroll logic lives in a composable (see `useTextReveal`, `useScrollSpy`, `useScrollProgress`) — don't re-implement GSAP teardown inline.
- Prefer reusing the existing reveal composables over hand-rolling new scroll animations.

### Accessibility

- External links carry `target="_blank"` **and** `rel="noopener noreferrer"`, plus an `aria-label` clarifying that they open in a new tab when the link text alone isn't explicit.
- Decorative glyphs (`♥`, separators) get `aria-hidden="true"`.
- `<nav>` regions get an `aria-label`. Interactive controls get accessible names.
- Honour `prefers-reduced-motion` for any CSS animation too (see the footer-heart fallback in `App.vue`).

### Shared building blocks

Reach for these before inventing new layout primitives:

| Component | Path | Use for |
|---|---|---|
| `<Section>` | `src/components/shared/Section.vue` | Standard page section: top border, vertical padding, the `site-container` width, default + `contentClass` slot |
| `<SectionHeading>` | `src/components/shared/SectionHeading.vue` | Section title typography |
| `<SectionKicker>` | `src/components/shared/SectionKicker.vue` | Eyebrow / kicker above a heading |
| `<TechBrand>` | `src/components/shared/TechBrand.vue` | Render a brand from the `TECH_BRANDS` catalog (icon + colour + link, theme-aware mono masking) |
| `<BlogPostCard>` | `src/components/shared/BlogPostCard.vue` | Journal post preview card |

The canonical page container is the `site-container` utility (used by `<Section>`). Reuse it rather than picking a new width per page.

---

## Internationalization

- Five locales: `en` (default/primary), `it`, `ja`, `ru`, `uk`. Type: `LocaleCode` from `@/i18n`.
- **All copy via `useI18n()`** (C-2). Keys are dot-namespaced (`nav.about`, `hero.tagline1`, `footer.cv`) and mirror the nested object shape in `src/i18n/locales/*.ts`.
- When you add or rename a key, update **all five** locale files in the same change. A key present in `en.ts` but missing elsewhere falls back to `en` (or the raw key) at runtime — that's a translation gap, not an acceptable state.
- The locale objects are plain typed `const` exports. Keep keys grouped by feature/namespace and ordered consistently across locales so diffs stay reviewable.
- Locale state is a module-level `ref` in `src/i18n/index.ts`, persisted to `localStorage` under `mdl:locale` and reflected on `<html lang>`. Don't read/write that key directly — go through `setLocale` / `useI18n`.

### Routing & locale paths

- The default locale (`en`) is **unprefixed**; the others are served under a `/:locale(it|ja|ru|uk)` path prefix. Both share the same child routes (`''`, `blog`, `blog/:slug`, `work/:slug`), with locale routes namespaced `locale.<name>`.
- Build internal links with `useLocale().localePath(path)` so the current locale prefix is applied correctly — never concatenate locale prefixes by hand.
- Use `localeAlternates(path)` when emitting hreflang/alternate links.
- The keep-DOM-order rule for the `useScrollSpy` `ids` array matters: pass section IDs top-to-bottom as they appear in the page.
- **Navigation + section ids have one source of truth: `src/data/navigation.ts`** (`NAV_ITEMS`, `SECTION_IDS`, the `SectionId` union). `SiteHeaderNav` renders from `NAV_ITEMS`; `HomeView` feeds `SECTION_IDS` to `useScrollSpy`. Never re-hardcode the `['home','about','work','blog','contact']` list anywhere — import it.

---

## Content — markdown-driven

Works (case studies) and journal posts are Markdown files with frontmatter, loaded at build time via `import.meta.glob`.

- **Works**: `src/contents/works/*.md`, surfaced through `src/contents/works.ts` (`works`, `workBySlug`, `workNeighbors`). Sorted by `priority` desc, then title.
- **Blog**: `src/contents/blog/*.md`, surfaced through `src/contents/blog.ts` (`blogPosts`). Sorted by `date` desc. Filenames are date-prefixed (`YYYY-MM-<slug>.md`); the slug is derived from the filename.
- **Frontmatter is the contract.** The loaders normalise frontmatter into a typed object with `asString` / `asStringArray` guards and sensible fallbacks. When you add a frontmatter field, add it to the `*Frontmatter` type **and** the normalising `.map(...)` in the loader — don't read raw `attributes` at the call site.
- Work cover/gallery assets live under `src/assets/works/<slug>/` and are resolved by `resolveAsset` against an `import.meta.glob` of the assets folder. Reference them by the relative path in frontmatter (e.g. `coverUrl: itd/cover.webp`); a missing asset falls back to the placeholder cover.
- Markdown rendering is configured in `vite.config.ts` (`vite-plugin-markdown` in HTML mode, exposing `html` + `attributes`, `html: false`). Don't enable raw HTML in markdown content.

---

## Composables

- One concern per `use*.ts` file in `src/composables/`.
- Return an object of refs/computed/functions; don't expose raw mutable internals.
- **SSR/SSG-safe**: guard every `window` / `document` / `localStorage` access with `typeof window === 'undefined'` (or the `document` equivalent) — the app is pre-rendered by `vite-ssg`, so module and setup code runs in Node too.
- Throttle scroll/resize work with `requestAnimationFrame` and a re-entrancy guard (see `useScrollSpy`).
- Register listeners in `onMounted`, remove them and cancel pending rAF in `onBeforeUnmount` / `onUnmounted`. No leaked listeners or timers.

---

## SSR / SSG safety

The production build is static via `vite-ssg`; head management is `@unhead/vue`.

- Never touch `window`, `document`, `localStorage`, or `navigator` at module top level or unguarded in `setup` — guard with a `typeof … === 'undefined'` check or move it into `onMounted`.
- The router already guards `document` in its `beforeEach`; follow that pattern when reflecting state onto the DOM.
- Manage `<title>` / meta through `@unhead/vue`, not by mutating `document.title`.

---

## Data & build scripts

- `src/data/*.ts` (`techBrands.ts`, `navigation.ts`, `workTechnologyCatalog.ts`) are hand-authored static catalogs — typed `const` exports keyed by a stable id.
- Build-time generation lives in typed `scripts/*.ts`, run via `bun` after `vite-ssg build` in the `build-only` script: `generate-og.ts` renders the per-page Open Graph cards into `dist/og/`; `generate-seo.ts` writes `sitemap.xml`, `robots.txt`, `rss.xml`, and the `llms*.txt` surfaces. Their output is a `dist/` build artefact — don't hand-edit.
- **Never** commit secrets.

---

## TypeScript & code style

- **Formatter is `oxfmt`** (`.oxfmtrc.json`): **single quotes, no semicolons**, 2-space indent, LF, final newline, 100-col guide (`.editorconfig`). Run `bun run format`; don't fight the formatter by hand. (A few legacy files still carry double quotes / semicolons — bring them into line when you touch them.)
- **Linters & gates**: `oxlint` (correctness category as error) is the enforced lint gate, paired with `bun run type-check` (`vue-tsc`) and a clean `bun run build-only`. Run all three before considering work done. ⚠️ `eslint` (the second half of `bun lint`) **cannot parse `<template lang="pug">`**, so its `no-unused-vars` / `vue/multi-word-component-names` rules report false positives for every component, `t`, computed, or handler used only inside a Pug template — do **not** "fix" those by deleting template-bound identifiers. Treat oxlint + type-check + build as the source of truth; eslint output is advisory until Pug-aware parsing is wired in.
- **No `any`.** Model unknown external shapes as `unknown` and narrow with type guards (`asString`, `asStringArray`, `typeof`/`in` checks), exactly as the content loaders do. If a third-party type is genuinely wrong, prefer a single-line, commented `as` cast with a `TODO` over `any`.
- **Always braces** on `if` / `else` / `for` / `while`, even single-line bodies. No `if (x) return` one-liners.
- **No casting / coercion in templates.** Pug templates stay declarative: never call `String(x)`, `Number(x)`, `JSON.stringify(x)`, or write `as Type` inside an attribute, handler, or interpolation. If a value needs reshaping, expose a `computed` or a `// MARK: - Methods` helper and bind that.
- Prefer `shallowRef` for large/immutable objects and non-reactive payloads (formatters, DOM-ish handles), `ref` for ordinary reactive state — match the existing usage.
- No bare `console.log` left in committed code.
- **Comments are terse — code first, prose last.** Delete narration that just restates what the code does (`// Comet trail constants`, `// Negative delay so…`). Keep only the non-obvious *why*, and keep it short: **SCSS/CSS comments are one line maximum** — no multi-line explanation blocks. If a rule seems to need a paragraph, that paragraph is a smell, not documentation.
- **Multi-line comments use a single `/* … */` block — never stacked `//` lines.** A one-line aside stays `//`; the moment the rationale needs a second line, collapse it into one `/* */` block (or `/** */` for a documented export or function). Pug templates use `//-` for their single-line equivalent.

### Identifier naming — type/interface/enum prefixes & constants

- **Prefix declared kinds:** types `T`, interfaces `I`, enum-like value objects `E` — e.g. `TUserCode`, `IUser`, `EUserType`. The exported composable function name is the exception (`useScrollSpy`, not `IUseScrollSpy`).
- **Single constants:** `UPPER_SNAKE_CASE`, `const` — add `as const` only when you want the precise literal type (URLs, keys, tuples):

  ```ts
  export const MAX_RETRIES = 3
  export const API_BASE_URL = 'https://api.example.com/v1' as const
  ```

- **Groups of related constants (the enum replacement):** a `PascalCase` object frozen with `as const`, `UPPER_SNAKE_CASE` keys, plus the derived union type. **Never a TS `enum` / `const enum`** — the `as const` object emits no runtime cruft, plays nicely with `Object.keys/values`, and types better. Prefix the value object `E` and the derived type `T`:

  ```ts
  export const EUserStatus = {
    ACTIVE: 'ACTIVE',
    INACTIVE: 'INACTIVE',
    PENDING: 'PENDING',
  } as const
  export type TUserStatus = (typeof EUserStatus)[keyof typeof EUserStatus]
  ```

- **Standalone data catalogs / config tables** (not enumerations — they hold records, not a closed set of member values) keep plain `UPPER_SNAKE_CASE`: `TECH_BRANDS`, `NAV_ITEMS`, `SECTION_IDS`.

---

## File naming

### Vue SFCs — PascalCase with a meaningful suffix

| Suffix / prefix | Meaning |
|---|---|
| `*View.vue` | Routable top-level page (in `views/`) or a self-contained detail view |
| `*Section.vue` | A full page section (Hero, About, Contact, Works…) |
| `*Card.vue` / `*CardView.vue` | Card-level component |
| `*Background.vue` | Decorative background layer (mesh, gradient, dots, shader) |
| `Site*` | Site chrome (header, nav, switchers) |
| `Selettore*.vue` | Selector / picker component |

### TypeScript

- **Composables**: **kebab-case files prefixed `use-`** (`use-scroll-spy.ts`, `use-text-reveal.ts`, `use-work-morph.ts`). The exported composable function keeps its `useXxx` camelCase name — only the filename is kebab. One concern per file.
- **Data / content loaders / i18n / router / utils**: kebab-case or single-noun camelCase matching existing files (`techBrands.ts`, `workTechnologyCatalog.ts`, `works.ts`, `blog.ts`, `loader.ts`, `motion.ts`).
- Locale files: lowercase locale code (`en.ts`, `it.ts`, `ja.ts`, `ru.ts`, `uk.ts`).

### Markdown content

- Works: `<slug>.md` (the slug is the URL slug).
- Blog: `YYYY-MM-<slug>.md` (date-prefixed; controls ordering).
- Repo docs: `UPPERCASE_SNAKE.md` for canonical entrypoints already named that way (`README.md`, `AGENTS.md`, `CONVENTIONS.md`); plan/spec docs under `docs/superpowers/` keep their `YYYY-MM-DD-<slug>` naming.

---

## Git

- This project follows **Conventional Commits**: `type(scope): summary` — e.g. `feat(scrollspy): update URL hash on active section`, `fix(hero): per-line underline via background-image`. Common types: `feat`, `fix`, `chore`, `refactor`, `docs`, `style`.
- Keep the summary imperative and scoped to one logical change.
- **Never** add `Co-Authored-By: Claude…` (or any LLM co-author line) to commit messages.
- Generated-data commits use `chore: sync GitHub profile data` (the Action's convention) — don't mix generated output with feature changes.
- There is no `CHANGELOG.md`; the commit history is the record. Keep it clean and meaningful.
