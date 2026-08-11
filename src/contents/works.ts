import type { TLocaleCode } from '@/i18n'

import { asStringArray, slugFromPath } from './loader'

// MARK: - Types

type TWorkFrontmatter = {
  title?: string
  eyebrow?: string
  period?: string
  role?: string
  href?: string
  logoUrl?: string
  imageUrl?: string
  coverUrl?: string
  gallery?: unknown[]
  showcase?: unknown[]
  summary?: string
  seoTitle?: string
  seoDescription?: string
  stack?: unknown[]
  highlights?: unknown[]
  sourceUrls?: unknown[]
  priority?: number
  featured?: boolean
}

type TMarkdownWorkModule = {
  attributes: TWorkFrontmatter
  html: string
}

export type TWorkCaseStudy = {
  slug: string
  title: string
  eyebrow: string
  period: string
  role: string
  href: string | null
  logoUrl: string | null
  imageUrl: string | null
  coverUrl: string
  gallery: string[]
  showcase: string[]
  summary: string
  seoTitle: string
  seoDescription: string
  stack: string[]
  highlights: string[]
  sourceUrls: string[]
  priority: number
  featured: boolean
  html: string
}

// MARK: - Variables

const DEFAULT_LOCALE: TLocaleCode = 'en'
const LOCALE_CODES: readonly TLocaleCode[] = ['en', 'it', 'ja', 'ru', 'uk']

/*
 * Each work is authored as a neutral metadata file (`slug.md`: assets, stack,
 * gallery, links) plus one copy file per locale (`slug.<locale>.md`: title,
 * summary, highlights, body). Copy resolves per-field with the fallback chain
 * locale → en → base file, so a not-yet-split combined `slug.md` keeps working.
 */
const contentFiles = import.meta.glob('./works/*.md', { eager: true }) as Record<
  string,
  TMarkdownWorkModule
>

const imageFiles = import.meta.glob('../assets/works/**/*.{webp,jpg,jpeg,png,avif,svg}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>

const PLACEHOLDER_KEY = '../assets/works/_placeholder/cover.svg'

const LOCALE_SUFFIX = new RegExp(`\\.(${LOCALE_CODES.join('|')})$`)

// MARK: - Methods

/* Split a glob filename into its base slug and optional locale suffix. */
function parseWorkKey(path: string): { slug: string; locale: TLocaleCode | null } {
  const name = slugFromPath(path)
  const match = name.match(LOCALE_SUFFIX)
  if (match) {
    return { slug: name.slice(0, match.index), locale: match[1] as TLocaleCode }
  }
  return { slug: name, locale: null }
}

/* Base metadata module per slug (the unsuffixed `slug.md`). */
const baseBySlug: Record<string, TMarkdownWorkModule> = {}
/* Per-locale copy modules per slug. */
const copyBySlug: Record<string, Partial<Record<TLocaleCode, TMarkdownWorkModule>>> = {}

for (const [path, module] of Object.entries(contentFiles)) {
  const { slug, locale } = parseWorkKey(path)
  if (locale) {
    ;(copyBySlug[slug] ??= {})[locale] = module
  } else {
    baseBySlug[slug] = module
  }
}

function resolveAsset(raw: string | undefined): string | null {
  if (!raw) {
    return null
  }
  const normalized = raw
    .replace(/^\/+/, '')
    .replace(/^~\//, '')
    .replace(/^src\//, '')
  const key = normalized.startsWith('assets/works/')
    ? `../${normalized}`
    : `../assets/works/${normalized}`
  return imageFiles[key] ?? null
}

const placeholderCover: string = imageFiles[PLACEHOLDER_KEY] ?? Object.values(imageFiles)[0] ?? ''

/*
 * Ordered list of frontmatter sources for a (slug, locale): the requested
 * locale's copy, then the English copy, then the base file. The first that
 * defines a given field wins — so partial translations fall back gracefully.
 */
function copySources(slug: string, locale: TLocaleCode): TWorkFrontmatter[] {
  const copies = copyBySlug[slug] ?? {}
  const base = baseBySlug[slug]
  return [copies[locale]?.attributes, copies[DEFAULT_LOCALE]?.attributes, base?.attributes].filter(
    (entry): entry is TWorkFrontmatter => Boolean(entry),
  )
}

/* First defined string for `field` across the fallback chain. */
function pickString(
  sources: TWorkFrontmatter[],
  field: keyof TWorkFrontmatter,
): string | undefined {
  for (const source of sources) {
    const value = source[field]
    if (typeof value === 'string' && value.length > 0) {
      return value
    }
  }
  return undefined
}

/* First non-empty string array for `field` across the fallback chain. */
function pickArray(sources: TWorkFrontmatter[], field: keyof TWorkFrontmatter): string[] {
  for (const source of sources) {
    const value = asStringArray(source[field])
    if (value.length > 0) {
      return value
    }
  }
  return []
}

/* Localized body HTML: locale copy, then English copy, then the base file. */
function pickHtml(slug: string, locale: TLocaleCode): string {
  const copies = copyBySlug[slug] ?? {}
  return copies[locale]?.html || copies[DEFAULT_LOCALE]?.html || baseBySlug[slug]?.html || ''
}

function buildWork(slug: string, locale: TLocaleCode): TWorkCaseStudy {
  const sources = copySources(slug, locale)
  const base = baseBySlug[slug]?.attributes ?? {}

  const cover = resolveAsset(pickString(sources, 'coverUrl')) ?? placeholderCover
  const gallery = pickArray(sources, 'gallery')
    .map((entry) => resolveAsset(entry))
    .filter((entry): entry is string => Boolean(entry))

  const showcaseResolved = pickArray(sources, 'showcase')
    .map((entry) => resolveAsset(entry))
    .filter((entry): entry is string => Boolean(entry))
  const showcase = showcaseResolved.length ? showcaseResolved : [cover]

  const title = pickString(sources, 'title') ?? slug
  const summary = pickString(sources, 'summary') ?? ''

  return {
    slug,
    title,
    eyebrow: pickString(sources, 'eyebrow') ?? 'Selected work',
    period: pickString(sources, 'period') ?? '',
    role: pickString(sources, 'role') ?? '',
    href: pickString(sources, 'href') ?? null,
    logoUrl: pickString(sources, 'logoUrl') ?? null,
    imageUrl: pickString(sources, 'imageUrl') ?? null,
    coverUrl: cover,
    gallery,
    showcase,
    summary,
    seoTitle: pickString(sources, 'seoTitle') ?? title,
    seoDescription: pickString(sources, 'seoDescription') ?? summary,
    stack: pickArray(sources, 'stack'),
    highlights: pickArray(sources, 'highlights'),
    sourceUrls: pickArray(sources, 'sourceUrls'),
    priority: Number(base.priority ?? 0),
    featured: Boolean(base.featured),
    html: pickHtml(slug, locale),
  }
}

const slugs = Object.keys(baseBySlug)

/* Memoized per-locale catalogues, sorted by priority then localized title. */
const catalogues = new Map<TLocaleCode, TWorkCaseStudy[]>()

function normalizeLocale(locale: TLocaleCode | string | undefined): TLocaleCode {
  return LOCALE_CODES.includes(locale as TLocaleCode) ? (locale as TLocaleCode) : DEFAULT_LOCALE
}

/** All case studies for a locale, sorted by priority (desc) then title. */
export function worksFor(
  locale: TLocaleCode | string | undefined = DEFAULT_LOCALE,
): TWorkCaseStudy[] {
  const code = normalizeLocale(locale)
  const cached = catalogues.get(code)
  if (cached) {
    return cached
  }
  const built = slugs
    .map((slug) => buildWork(slug, code))
    .sort((left, right) => right.priority - left.priority || left.title.localeCompare(right.title))
  catalogues.set(code, built)
  return built
}

/** Default (English) catalogue — kept for non-localized call sites. */
export const works: TWorkCaseStudy[] = worksFor(DEFAULT_LOCALE)

export function workBySlug(
  slug: string,
  locale: TLocaleCode | string | undefined = DEFAULT_LOCALE,
): TWorkCaseStudy | null {
  return worksFor(locale).find((w) => w.slug === slug) ?? null
}

export function workNeighbors(
  slug: string,
  locale: TLocaleCode | string | undefined = DEFAULT_LOCALE,
): {
  previous: TWorkCaseStudy | null
  next: TWorkCaseStudy | null
} {
  const list = worksFor(locale)
  const index = list.findIndex((w) => w.slug === slug)
  if (index === -1) {
    return { previous: null, next: null }
  }
  return {
    previous: index > 0 ? (list[index - 1] ?? null) : null,
    next: index < list.length - 1 ? (list[index + 1] ?? null) : null,
  }
}
