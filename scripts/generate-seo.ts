/*
 * Postbuild SEO/LLM surfaces: reads the markdown content and writes sitemap.xml,
 * robots.txt, rss.xml, llms.txt and llms-full.txt into dist/. Runs after
 * `vite-ssg build` (see the build-only script).
 */
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const DIST = join(ROOT, 'dist')

const SITE = 'https://deluisa.me'
const SITE_NAME = 'Massimo De Luisa'
const SUMMARY =
  'CTO & Product Engineer. I build platforms, mobile apps and AI-assisted workflows that stay simple under pressure. Based in Udine, Italy — moving to Japan.'
/* '' is the default English locale (served unprefixed / x-default). */
const LOCALES = ['', 'it', 'ja', 'ru', 'uk']

type TFrontmatter = Record<string, string>
type TContentEntry = TFrontmatter & { slug: string; body: string }

function parseFrontmatter(raw: string): { data: TFrontmatter; body: string } {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/)
  if (!match) {
    return { data: {}, body: raw.trim() }
  }
  const data: TFrontmatter = {}
  for (const line of match[1].split('\n')) {
    const kv = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/)
    if (kv && kv[2] !== '') {
      data[kv[1]] = kv[2].trim().replace(/^['"]|['"]$/g, '')
    }
  }
  return { data, body: match[2].trim() }
}

/*
 * Content is authored as a base `slug.md` (metadata) plus per-locale copies
 * `slug.<locale>.md` (title/summary/body). Only the base file is a real page;
 * the English copy is overlaid as the canonical locale so title/summary/body
 * resolve. Locale-suffixed files must NOT become their own slugs (that produced
 * phantom /slug.it URLs in the sitemap).
 */
const LOCALE_SUFFIX = /\.(en|it|ja|ru|uk)\.md$/

function readContent(dir: string): TContentEntry[] {
  const folder = join(ROOT, 'src/contents', dir)
  if (!existsSync(folder)) {
    return []
  }
  const files = readdirSync(folder).filter((file) => file.endsWith('.md'))
  return files
    .filter((file) => !LOCALE_SUFFIX.test(file))
    .map((file) => {
      const slug = file.replace(/\.md$/, '')
      const base = parseFrontmatter(readFileSync(join(folder, file), 'utf8'))
      const enPath = join(folder, `${slug}.en.md`)
      const en = existsSync(enPath)
        ? parseFrontmatter(readFileSync(enPath, 'utf8'))
        : { data: {} as TFrontmatter, body: '' }
      return { slug, body: en.body || base.body, ...base.data, ...en.data }
    })
}

const blog = readContent('blog').sort((a, b) => (b.date || '').localeCompare(a.date || ''))

const today = new Date().toISOString().slice(0, 10)
const xml = (s: string | undefined): string =>
  String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

/* Base paths (no locale prefix). */
const pages = ['/', '/blog', ...blog.map((p) => `/blog/${p.slug}`)]

function locUrl(prefix: string, path: string): string {
  const base = prefix ? `/${prefix}` : ''
  return path === '/' ? `${SITE}${base || '/'}` : `${SITE}${base}${path}`
}

function sitemap(): string {
  const urls: string[] = []
  for (const path of pages) {
    const post = path.startsWith('/blog/') && blog.find((b) => path.endsWith(`/${b.slug}`))
    const lastmod = post && post.date ? post.date : today
    const alternates = [
      ...LOCALES.map(
        (l) => `    <xhtml:link rel="alternate" hreflang="${l || 'en'}" href="${locUrl(l, path)}"/>`,
      ),
      `    <xhtml:link rel="alternate" hreflang="x-default" href="${locUrl('', path)}"/>`,
    ].join('\n')
    for (const prefix of LOCALES) {
      urls.push(
        `  <url>\n    <loc>${locUrl(prefix, path)}</loc>\n    <lastmod>${lastmod}</lastmod>\n${alternates}\n  </url>`,
      )
    }
  }
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`
}

/*
 * 2026 "selective-allow" robots policy: explicitly welcome the AI answer-engine
 * and assistant crawlers (citation traffic is ~4× more valuable than classic
 * organic), opt out of nothing for a personal brand chasing visibility, and
 * block only Bytespider — the one high-volume crawler that wastes bandwidth and
 * routinely ignores rules. Each bot is listed individually (best practice) so
 * the policy stays auditable as the landscape shifts.
 */
function robots(): string {
  /* Search/retrieval + assistant crawlers, grouped by vendor. All allowed. */
  const allowed: string[][] = [
    ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User'], // OpenAI
    ['ClaudeBot', 'Claude-SearchBot', 'Claude-User', 'anthropic-ai'], // Anthropic
    ['PerplexityBot', 'Perplexity-User'], // Perplexity
    ['Google-Extended'], // Google (Gemini/Vertex training opt-in token)
    ['Applebot-Extended'], // Apple Intelligence token
    ['Bingbot', 'Amazonbot', 'Meta-ExternalAgent', 'DuckAssistBot'], // Bing/Copilot, Amazon, Meta, DuckDuckGo
    ['Googlebot', 'cohere-ai', 'YouBot', 'Diffbot', 'Timpibot'], // misc answer engines
  ]
  const blocks = [
    '# robots.txt — https://deluisa.me',
    '# Classic search + AI answer engines welcome (2026 selective-allow policy).',
    '',
    'User-agent: *',
    'Allow: /',
    '',
    '# --- AI crawlers & assistants: explicitly allowed for citations ---',
    ...allowed.flatMap((group) => [...group.map((ua) => `User-agent: ${ua}`), 'Allow: /', '']),
    '# --- Abusive crawler: ignores rules and wastes crawl budget ---',
    'User-agent: Bytespider',
    'Disallow: /',
    '',
    `Sitemap: ${SITE}/sitemap.xml`,
    `# LLM-curated overview: ${SITE}/llms.txt`,
    '',
  ]
  return blocks.join('\n')
}

function rss(): string {
  const items = blog
    .map(
      (p) =>
        `    <item>\n      <title>${xml(p.title)}</title>\n      <link>${SITE}/blog/${p.slug}</link>\n      <guid>${SITE}/blog/${p.slug}</guid>\n      <pubDate>${new Date(p.date || today).toUTCString()}</pubDate>\n      <description>${xml(p.excerpt)}</description>\n    </item>`,
    )
    .join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0">\n  <channel>\n    <title>${xml(SITE_NAME)} — Journal</title>\n    <link>${SITE}/blog</link>\n    <description>Notes on systems, product, technology and the move to Japan.</description>\n    <language>en</language>\n${items}\n  </channel>\n</rss>\n`
}

function llmsTxt(): string {
  const list = (items: TContentEntry[], base: string): string =>
    items
      .map(
        (i) =>
          `- [${i.title}](${SITE}${base}/${i.slug})${i.excerpt || i.summary ? `: ${i.excerpt || i.summary}` : ''}`,
      )
      .join('\n')
  return `# ${SITE_NAME}

> ${SUMMARY}

## About

- Massimo De Luisa is a CTO & Product Engineer based in Udine, Italy (relocating to Japan).
- He is CTO of two software companies (mobile development and systems integration), building platforms, mobile apps and AI-assisted workflows.
- Core stack: Vue, TypeScript, Tailwind, Supabase, and long-context AI tooling.
- Site available in English, Italian, Japanese, Russian and Ukrainian.

## Pages

- [Home](${SITE}/): overview and focus areas
- [Journal](${SITE}/blog): writing on systems, product and craft
${blog.length ? `\n## Journal\n\n${list(blog, '/blog')}\n` : ''}
## Contact & profiles

- GitHub: https://github.com/massimodeluisa
- LinkedIn: https://www.linkedin.com/in/massimodeluisa
- X: https://x.com/massimodeluisa
- Licensing, citation or press enquiries: ${SITE}/#contact

## Optional

- [llms-full.txt](${SITE}/llms-full.txt): every post as plain markdown
`
}

function llmsFull(): string {
  const out = [`# ${SITE_NAME}\n\n> ${SUMMARY}\n`, '\n---\n\n# Journal\n']
  for (const p of blog) {
    out.push(`\n## ${p.title}\n\n_${p.date || ''}_\n\n${p.body}\n`)
  }
  return out.join('\n')
}

if (!existsSync(DIST)) {
  console.error('[seo] dist/ not found — run this after `vite-ssg build`.')
  process.exit(1)
}

writeFileSync(join(DIST, 'sitemap.xml'), sitemap())
writeFileSync(join(DIST, 'robots.txt'), robots())
writeFileSync(join(DIST, 'rss.xml'), rss())
writeFileSync(join(DIST, 'llms.txt'), llmsTxt())
writeFileSync(join(DIST, 'llms-full.txt'), llmsFull())

/* GitHub Pages SPA fallback: unknown URLs serve 404.html → the app routes to the 404 view. */
writeFileSync(join(DIST, '404.html'), readFileSync(join(DIST, 'index.html'), 'utf8'))

console.log(
  `[seo] wrote sitemap.xml (${pages.length * LOCALES.length} urls), robots.txt, rss.xml, llms.txt, llms-full.txt, 404.html`,
)
