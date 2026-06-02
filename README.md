# Massimo De Luisa — Portfolio

Professional, multilingual portfolio of **Massimo De Luisa** (MDL), CTO at Smart Squad Srl and Inksquad Srl.

Live at [deluisa.me](https://deluisa.me) (primary), with Japanese domains [出る.com](https://出る.com) and [デルイザ.com](https://デルイザ.com) for the Japan move.

## Philosophy

This site is built with obsessive attention to **cleanliness, clarity, and craft**.

- Extremely high signal-to-noise ratio
- Purposeful, restrained motion (GSAP)
- Rigorous component hygiene and ordering
- First-class multilingual experience (English, Italian, Japanese, Russian, Ukrainian)
- Content-driven (markdown case studies + journal)

The visual and technical references that shaped the direction include the quiet confidence of ewan-kerboas.fr, martinpriotti.dev, aimane.dev, crz.studio, and jorisbrianti.fr, combined with the technical depth already present in the previous version of this portfolio.

## Tech Stack

- **Vue 3** (latest beta + Volar)
- **Tailwind CSS 4** (via Vite plugin)
- **GSAP 3** (ScrollTrigger, SplitText, DrawSVG, matchMedia)
- **Pug** templates + **SCSS**
- **TypeScript** (strict)
- **bun** as package manager and runtime
- Custom lightweight i18n (no heavy dependencies)
- Markdown-driven content (works + journal)

Typography: Geist Sans / Mono / Pixel (Vercel typeface, self-hosted variable fonts).

## Development

```bash
bun install
bun dev
```

### Quality commands (all via bun)

```bash
bun run build          # Production build
bun run type-check     # vue-tsc
bun lint               # oxlint + eslint + oxfmt
```

### Component Discipline (enforced)

Every component follows a strict internal order:

1. Imports (external → `@/` → relative)
2. Types & interfaces
3. Props / Emits (`defineProps`, `defineEmits`)
4. Constants / static data
5. Reactive state (refs, shallowRefs, composables)
6. Computed
7. Methods & event handlers
8. Watchers
9. Lifecycle hooks

Templates are written in **Pug**. Styles (when not achievable with Tailwind) live in `<style lang="scss" scoped>`.

## Internationalization

Five languages, client-side, clean URLs, persisted in localStorage:

- English (primary)
- Italian (complete)
- Japanese, Russian, Ukrainian (UI complete, content expanding)

Language switcher lives elegantly inside the fixed header (and mobile menu). All new copy must go through `useI18n()`.

## Content

- **Selected Work**: Case studies loaded from `src/contents/works/*.md` (frontmatter + rendered HTML).
- **Journal / Blog**: Markdown posts in `src/contents/blog/` (planned, with categories Tech / Product / Personal).
- Photos and assets live in `src/assets/`.

## Header (sacred)

The fixed header with its scroll-driven "transparent → pill" morph animation, house icon, live Rome time, and mobile hamburger is preserved exactly as originally authored. Only navigation labels and the integrated language switcher were added.

## Deployment

Static build. Intended targets:

- GitHub Pages (`gh-pages` branch or GitHub Action)
- Direct deployment to the custom domains (Vercel, Cloudflare Pages, or Netlify all work excellently)

The Japanese domains (`出る.com`, `デルイザ.com`) are chosen for their playful kanji reading of "De Luisa" → "Deruiza" → 出る (to go out / to emerge).

## License & Attribution

Personal portfolio. Feel free to study the source for patterns (especially the GSAP + Vue + Tailwind 4 + Pug + strict component hygiene approach). If you reuse significant parts in public work, a credit or star on GitHub is appreciated.

## Contact

Massimo De Luisa  
CTO @ Smart Squad & Inksquad
Udine, Italy → Japan

- GitHub: https://github.com/massimodeluisa
- X: https://x.com/massimodeluisa

---

Built with clarity and care. The code should read as nicely as the site looks.
