<h1 align="center">Massimo De Luisa</h1>

<p align="center">
  <strong>Personal site</strong><br />
  Portfolio, selected work and journal. Multilingual, static, GitHub Pages
</p>

<p align="center">
  <a href="https://deluisa.me"><img src="https://img.shields.io/badge/Live-deluisa.me-111827?style=flat-square" alt="Live site" /></a>
  <a href="https://isready.ai"><img src="https://isready.ai/badge/deluisa.me" alt="AI readiness" /></a>
  <a href="LICENSE.md"><img src="https://img.shields.io/badge/License-MIT_code-green?style=flat-square" alt="Source MIT, content reserved" /></a>
  <a href="https://vuejs.org/"><img src="https://img.shields.io/badge/Vue-3-42B883?style=flat-square&logo=vuedotjs&logoColor=white" alt="Vue 3" /></a>
</p>

<p align="center">
  <a href="#stack">Stack</a> ·
  <a href="#development">Develop</a> ·
  <a href="#internationalization">i18n</a> ·
  <a href="#deployment">Deploy</a>
</p>

<p align="center">
  <img src="https://deluisa.me/og/home.jpg" alt="Massimo De Luisa, deluisa.me" width="800" />
</p>

---

Live at [deluisa.me](https://deluisa.me) (primary), with Japanese domains [出る.com](https://出る.com) and [デルイザ.com](https://デルイザ.com).

CTO & Product Engineer. Platforms, mobile apps and AI-assisted workflows. Shipping Inksquad, IsReady.AI, SIDUS and Images in motion. Experimenting with Rust. Udine, Italy, moving to Japan.

## Stack

- **Vue 3** (latest beta + Volar)
- **Tailwind CSS 4** (via Vite plugin)
- **GSAP 3** (ScrollTrigger, SplitText, DrawSVG, matchMedia)
- **Pug** templates + **SCSS**
- **TypeScript** (strict)
- **bun** as package manager and runtime
- Custom lightweight i18n
- Markdown-driven content (works + journal)

Typography: Geist Sans / Mono / Pixel (Vercel typeface, self-hosted variable fonts).

## Development

```bash
bun install
bun dev
```

```bash
bun run build          # Production build
bun run type-check     # vue-tsc
bun lint               # oxlint + eslint + oxfmt
```

Every component follows a strict internal order (enforced):

1. Imports (external → `@/` → relative)
2. Types & interfaces
3. Props / Emits (`defineProps`, `defineEmits`)
4. Constants / static data
5. Reactive state (refs, shallowRefs, composables)
6. Computed
7. Methods & event handlers
8. Watchers
9. Lifecycle hooks

Templates are written in **Pug**. Styles (when not achievable with Tailwind) live in `<style lang="scss" scoped>`. See [`CONVENTIONS.md`](CONVENTIONS.md).

## Internationalization

Five languages, client-side, clean URLs, persisted in localStorage:

- English (primary)
- Italian (complete)
- Japanese, Russian, Ukrainian (UI complete, content expanding)

Language switcher lives in the fixed header (and mobile menu). All new copy must go through `useI18n()`.

## Content

- **Selected work**: Inksquad, IsReady.AI, Images in motion, SIDUS. Routes `/work/inksquad`, `/work/isready-ai`, `/work/images-in-motion`, `/work/sidus-tools`.
- **Journal**: Markdown posts in `src/contents/blog/`.
- Photos and assets live in `src/assets/`.

## Deployment

The production site is a static build on GitHub Pages.

GitHub Pages does not expose repository-level custom response-header configuration for custom domains. To send `Strict-Transport-Security`, put `deluisa.me` behind a CDN or reverse proxy that can add:

```text
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

Do not use a static `_headers` file or an HTML `http-equiv` tag for HSTS: GitHub Pages ignores the former, and browsers only honor HSTS as an HTTPS response header.

The Japanese domains (`出る.com`, `デルイザ.com`) are chosen for their kanji reading of "De Luisa" → "Deruiza" → 出る.

## Author

<p>
  <a href="https://x.com/massimodeluisa"><img src="https://img.shields.io/badge/@massimodeluisa-000000?style=flat-square&logo=x" alt="X" /></a>
  <a href="https://github.com/massimodeluisa"><img src="https://img.shields.io/badge/GitHub-massimodeluisa-181717?style=flat-square&logo=github" alt="GitHub" /></a>
</p>

**Massimo De Luisa**: [massimo.deluisa.bio](https://massimo.deluisa.bio)

## License

Source code MIT, content All Rights Reserved, see [LICENSE.md](LICENSE.md).
