/*
 * Postbuild SEO/LLM surfaces: reads the markdown content and writes sitemap.xml,
 * robots.txt, rss.xml, llms.txt and llms-full.txt into dist/. Runs after
 * `vite-ssg build` (see the build-only script).
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { PROFILES, SAME_AS, SITE_EMAIL, SITE_NAME, SITE_ROLE, SITE_SUMMARY, SITE_URL } from '../src/data/site.ts'
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from '../src/i18n/catalog.ts'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const DIST = join(ROOT, 'dist')

/* '' is the default English locale (served unprefixed / x-default). */
const LOCALES = SUPPORTED_LOCALES.map((code) => (code === DEFAULT_LOCALE ? '' : code))

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
 * Works are authored as a base `slug.md` (metadata) plus per-locale copies
 * `slug.<locale>.md` (title/summary/body) — mirror src/contents/works.ts. Only
 * the base file is a real page; the English copy is overlaid as the canonical
 * locale so title/summary/body resolve. Locale-suffixed files must NOT become
 * their own slugs (that produced phantom /work/slug.it URLs in the sitemap).
 */
const LOCALE_SUFFIX = new RegExp(`\\.(${SUPPORTED_LOCALES.join('|')})\\.md$`)

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
const works = readContent('works').sort((a, b) => Number(b.priority || 0) - Number(a.priority || 0))

const today = new Date().toISOString().slice(0, 10)
const xml = (s: string | undefined): string =>
  String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

/* Base paths (no locale prefix). */
const pages = ['/', '/blog', ...blog.map((p) => `/blog/${p.slug}`), ...works.map((w) => `/work/${w.slug}`)]

function locUrl(prefix: string, path: string): string {
  const base = prefix ? `/${prefix}` : ''
  return path === '/' ? `${SITE_URL}${base || '/'}` : `${SITE_URL}${base}${path}`
}

function sitemap(): string {
  const latestPost = blog[0]?.date || today
  const urls: string[] = []
  for (const path of pages) {
    const post = path.startsWith('/blog/') ? blog.find((b) => path.endsWith(`/${b.slug}`)) : undefined
    const lastmod = post?.date || (path === '/blog' ? latestPost : today)
    const priority = path === '/' ? '1.0' : path === '/blog' ? '0.9' : path.startsWith('/blog/') ? '0.8' : '0.7'
    const changefreq = path.startsWith('/blog') ? 'weekly' : 'monthly'
    const image =
      post && (post.cover || true)
        ? `    <image:image>\n      <image:loc>${SITE_URL}${post.cover || `/og/blog/${post.slug}.jpg`}</image:loc>\n      <image:title>${xml(post.title)}</image:title>\n    </image:image>`
        : ''
    const alternates = [
      ...LOCALES.map(
        (l) => `    <xhtml:link rel="alternate" hreflang="${l || 'en'}" href="${locUrl(l, path)}"/>`,
      ),
      `    <xhtml:link rel="alternate" hreflang="x-default" href="${locUrl('', path)}"/>`,
    ].join('\n')
    for (const prefix of LOCALES) {
      urls.push(
        [
          '  <url>',
          `    <loc>${locUrl(prefix, path)}</loc>`,
          `    <lastmod>${lastmod}</lastmod>`,
          `    <changefreq>${changefreq}</changefreq>`,
          `    <priority>${priority}</priority>`,
          image,
          alternates,
          '  </url>',
        ]
          .filter(Boolean)
          .join('\n'),
      )
    }
  }
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls.join('\n')}
</urlset>
`
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
    `Sitemap: ${SITE_URL}/sitemap.xml`,
    `# LLM-curated overview: ${SITE_URL}/llms.txt`,
    '',
  ]
  return blocks.join('\n')
}

function rss(): string {
  const items = blog
    .map((p) => {
      const url = `${SITE_URL}/blog/${p.slug}`
      return [
        '    <item>',
        `      <title>${xml(p.title)}</title>`,
        `      <link>${url}</link>`,
        `      <guid isPermaLink="true">${url}</guid>`,
        `      <pubDate>${new Date(p.date || today).toUTCString()}</pubDate>`,
        `      <author>${SITE_EMAIL} (${xml(SITE_NAME)})</author>`,
        `      <category>${xml(p.category)}</category>`,
        `      <description>${xml(p.excerpt)}</description>`,
        p.cover ? `      <enclosure url="${SITE_URL}${p.cover}" type="image/png" />` : '',
        '    </item>',
      ]
        .filter(Boolean)
        .join('\n')
    })
    .join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${xml(SITE_NAME)} — Journal</title>
    <link>${SITE_URL}/blog</link>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
    <description>Notes on systems, product, technology and the move to Japan.</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <managingEditor>${SITE_EMAIL} (${xml(SITE_NAME)})</managingEditor>
    <webMaster>${SITE_EMAIL} (${xml(SITE_NAME)})</webMaster>
    <copyright>© ${new Date().getFullYear()} ${xml(SITE_NAME)}</copyright>
${items}
  </channel>
</rss>
`
}

function atom(): string {
  const entries = blog
    .map((p) => {
      const url = `${SITE_URL}/blog/${p.slug}`
      return `    <entry>
      <title>${xml(p.title)}</title>
      <link href="${url}" rel="alternate"/>
      <id>${url}</id>
      <updated>${p.date || today}T00:00:00Z</updated>
      <published>${p.date || today}T00:00:00Z</published>
      <author><name>${xml(SITE_NAME)}</name><uri>${SITE_URL}</uri></author>
      <summary>${xml(p.excerpt)}</summary>
      <category term="${xml(p.category)}"/>
    </entry>`
    })
    .join('\n')
  const latest = blog[0]?.date || today
  return `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${xml(SITE_NAME)} — Journal</title>
  <link href="${SITE_URL}/blog" rel="alternate"/>
  <link href="${SITE_URL}/atom.xml" rel="self"/>
  <id>${SITE_URL}/blog</id>
  <updated>${latest}T00:00:00Z</updated>
  <author><name>${xml(SITE_NAME)}</name><uri>${SITE_URL}</uri></author>
  <subtitle>Notes on systems, product, technology and the move to Japan.</subtitle>
${entries}
</feed>
`
}

function jsonFeed(): string {
  return `${JSON.stringify(
    {
      version: 'https://jsonfeed.org/version/1.1',
      title: `${SITE_NAME} — Journal`,
      home_page_url: `${SITE_URL}/blog`,
      feed_url: `${SITE_URL}/feed.json`,
      description: 'Notes on systems, product, technology and the move to Japan.',
      language: 'en',
      authors: [{ name: SITE_NAME, url: SITE_URL }],
      icon: `${SITE_URL}/favicon/android-chrome-512x512.png`,
      favicon: `${SITE_URL}/favicon/favicon-32x32.png`,
      items: blog.map((p) => ({
        id: `${SITE_URL}/blog/${p.slug}`,
        url: `${SITE_URL}/blog/${p.slug}`,
        title: p.title,
        content_text: p.excerpt,
        date_published: `${p.date || today}T00:00:00Z`,
        authors: [{ name: SITE_NAME, url: SITE_URL }],
        tags: p.category ? [p.category] : [],
        image: p.cover ? `${SITE_URL}${p.cover}` : `${SITE_URL}/og/blog/${p.slug}.jpg`,
      })),
    },
    null,
    2,
  )}\n`
}

function brandFacts(): string {
  return `${JSON.stringify(
    {
      $schema: 'https://deluisa.me/.well-known/brand-facts.json',
      name: SITE_NAME,
      legalName: SITE_NAME,
      url: SITE_URL,
      type: 'Person',
      jobTitle: SITE_ROLE,
      description: SITE_SUMMARY,
      founded: '2025',
      location: { locality: 'Udine', country: 'IT', relocatingTo: 'Japan' },
      languages: ['en', 'it', 'ja', 'ru', 'uk'],
      sameAs: [...SAME_AS],
      products: [
        { name: 'isready.ai', url: 'https://isready.ai', role: 'founder' },
        { name: 'SIDUS', url: 'https://sidus.tools', role: 'author' },
        { name: 'Inksquad', url: 'https://inksquad.com', role: 'CTO' },
        { name: 'Images in motion', url: 'https://iim.smartsquad.io/', role: 'author' },
      ],
      contact: { page: `${SITE_URL}/#contact` },
      citation: { preferred: SITE_URL, llms: `${SITE_URL}/llms.txt` },
      updated: today,
    },
    null,
    2,
  )}\n`
}

function aiTxt(): string {
  return `# ai.txt — https://deluisa.me
# How AI systems may use this site (2026).

User-Agent: *
Allow: /
Citation: allowed
Attribution: preferred
Training: allowed
Paywall: none
License: see ${SITE_URL} and the repository LICENSE.md

Preferred-Sources:
  ${SITE_URL}/llms.txt
  ${SITE_URL}/llms-full.txt
  ${SITE_URL}/.well-known/brand-facts.json
  ${SITE_URL}/rss.xml
  ${SITE_URL}/sitemap.xml

Contact: ${SITE_URL}/#contact
`
}

function humansTxt(): string {
  return `/* TEAM */
Name: ${SITE_NAME}
Role: ${SITE_ROLE}
Site: ${SITE_URL}
Location: Udine, Italy — moving to Japan
GitHub: ${PROFILES.github}

/* SITE */
Last update: ${today}
Languages: ${SUPPORTED_LOCALES.join(', ')}
Standards: HTML5, JSON-LD, llms.txt, RSS, Atom, JSON Feed
Software: Vue, Vite, vite-ssg, TypeScript, Tailwind, GSAP
`
}

function securityTxt(): string {
  return `Contact: ${SITE_URL}/#contact
Expires: 2027-08-13T00:00:00.000Z
Preferred-Languages: en, it
Canonical: ${SITE_URL}/.well-known/security.txt
`
}

function llmsTxt(): string {
  const list = (items: TContentEntry[], base: string): string =>
    items
      .map(
        (i) =>
          `- [${i.title}](${SITE_URL}${base}/${i.slug})${i.excerpt || i.summary ? `: ${i.excerpt || i.summary}` : ''}`,
      )
      .join('\n')
  return `# ${SITE_NAME}

> ${SITE_SUMMARY}

## About

- Massimo De Luisa is a CTO & Product Engineer based in Udine, Italy (relocating to Japan).
- He builds platforms, mobile apps and AI-assisted workflows as CTO at Smart Squad and Inksquad, and ships IsReady.AI, SIDUS and Images in motion.
- Core stack: Vue, TypeScript, Tailwind, Supabase, Expo/Swift, and long-context AI tooling.
- Currently shipping: Inksquad (tattoo ecosystem), IsReady.AI (AI readiness / GEO scanner), Images in motion (iim.smartsquad.io), SIDUS (open-source space engineering tools).
- Experimenting with Rust alongside TypeScript and Swift.
- Site available in English, Italian, Japanese, Russian and Ukrainian.

## Pages

- [Home](${SITE_URL}/): overview, focus areas and selected work
- [Journal](${SITE_URL}/blog): writing on systems, product and craft
${blog.length ? `\n## Journal\n\n${list(blog, '/blog')}\n` : ''}
## Selected work

${list(works, '/work')}

## Contact & profiles

- GitHub: ${PROFILES.github}
- LinkedIn: ${PROFILES.linkedin}
- X: ${PROFILES.x}
- Licensing, citation or press enquiries: ${SITE_URL}/#contact

## Optional

- [llms-full.txt](${SITE_URL}/llms-full.txt): every post and case study as plain markdown
`
}

function llmsFull(): string {
  const out = [`# ${SITE_NAME}\n\n> ${SITE_SUMMARY}\n`, '\n---\n\n# Journal\n']
  for (const p of blog) {
    out.push(`\n## ${p.title}\n\n_${p.date || ''}_\n\n${p.body}\n`)
  }
  out.push('\n---\n\n# Selected work\n')
  for (const w of works) {
    out.push(`\n## ${w.title}\n\n${w.summary ? `${w.summary}\n\n` : ''}${w.body}\n`)
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
writeFileSync(join(DIST, 'atom.xml'), atom())
writeFileSync(join(DIST, 'feed.json'), jsonFeed())
writeFileSync(join(DIST, 'llms.txt'), llmsTxt())
writeFileSync(join(DIST, 'llms-full.txt'), llmsFull())
writeFileSync(join(DIST, 'ai.txt'), aiTxt())
writeFileSync(join(DIST, 'humans.txt'), humansTxt())

const wellKnown = join(DIST, '.well-known')
mkdirSync(wellKnown, { recursive: true })
writeFileSync(join(wellKnown, 'brand-facts.json'), brandFacts())
writeFileSync(join(wellKnown, 'security.txt'), securityTxt())

/* GitHub Pages SPA fallback: unknown URLs serve 404.html → the app routes to the 404 view. */
writeFileSync(join(DIST, '404.html'), readFileSync(join(DIST, 'index.html'), 'utf8'))

console.log(
  `[seo] wrote sitemap.xml (${pages.length * LOCALES.length} urls), robots.txt, rss.xml, atom.xml, feed.json, llms.txt, llms-full.txt, ai.txt, humans.txt, .well-known/*, 404.html`,
)
