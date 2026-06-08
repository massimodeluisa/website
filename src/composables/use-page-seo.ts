import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { useHead, useSeoMeta } from '@unhead/vue'
import { useRoute } from 'vue-router'

import { useLocale } from './use-locale'
import type { TLocaleCode } from '@/i18n'

// MARK: - Variables

export const SITE_URL = 'https://deluisa.me'
export const SITE_NAME = 'Massimo De Luisa'

/* Stable @id anchors so every page's JSON-LD references one canonical entity
 * (helps Google's Knowledge Graph + AI answer engines resolve who/what). */
export const PERSON_ID = `${SITE_URL}/#person`
export const WEBSITE_ID = `${SITE_URL}/#website`

const TWITTER_HANDLE = '@massimodeluisa'

/* Let search engines show full-size image previews and untruncated snippets. */
const DEFAULT_ROBOTS = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'

const ALL_LOCALES: TLocaleCode[] = ['en', 'it', 'ja', 'ru', 'uk']

const OG_LOCALE: Record<TLocaleCode, string> = {
  en: 'en_US',
  it: 'it_IT',
  ja: 'ja_JP',
  ru: 'ru_RU',
  uk: 'uk_UA',
}

// MARK: - Types

interface IPageSeo {
  title: MaybeRefOrGetter<string>
  description: MaybeRefOrGetter<string>
  type?: 'website' | 'article'
  image?: string
  /* Alt text for the OG/Twitter card (accessibility + a11y on social). */
  imageAlt?: MaybeRefOrGetter<string>
  /* ISO dates for article:* meta (BlogPosting / case studies). */
  published?: MaybeRefOrGetter<string | undefined>
  modified?: MaybeRefOrGetter<string | undefined>
  section?: MaybeRefOrGetter<string | undefined>
  /* Override robots, e.g. 'noindex, follow' for the 404 view. */
  robots?: string
}

// MARK: - Composable

/*
 * Sets the full per-route head: localized title/description, canonical, OG +
 * Twitter cards, <html lang>, and hreflang alternates for every locale.
 */
export function usePageSeo(input: IPageSeo) {
  const route = useRoute()
  const { current, localePath } = useLocale()

  // Route path with any locale prefix stripped, so alternates can be rebuilt.
  const basePath = computed(() => {
    const match = route.path.match(/^\/(?:it|ja|ru|uk)(\/.*)?$/)
    return match ? (match[1] ?? '/') : route.path
  })

  const fullTitle = computed(() => {
    const title = toValue(input.title)
    return title ? `${title} — ${SITE_NAME}` : SITE_NAME
  })
  const description = computed(() => toValue(input.description))
  const canonical = computed(() => `${SITE_URL}${localePath(basePath.value, current.value)}`)
  /*
   * Per-page OG card generated at build time into /og/* (see scripts/generate-og).
   * Locale-independent (basePath has no prefix) so all locales share one card.
   */
  const ogImage = computed(() => {
    if (input.image) {
      return input.image
    }
    const key = basePath.value === '/' ? '/home' : basePath.value
    return `${SITE_URL}/og${key}.jpg`
  })

  const isArticle = (input.type ?? 'website') === 'article'
  const imageAlt = computed(() => toValue(input.imageAlt) ?? fullTitle.value)

  useSeoMeta({
    title: fullTitle,
    description,
    robots: input.robots ?? DEFAULT_ROBOTS,
    author: SITE_NAME,
    ogTitle: fullTitle,
    ogDescription: description,
    ogType: input.type ?? 'website',
    ogUrl: canonical,
    ogSiteName: SITE_NAME,
    ogImage,
    ogImageAlt: imageAlt,
    ogImageWidth: '1200',
    ogImageHeight: '630',
    ogImageType: 'image/jpeg',
    ogLocale: () => OG_LOCALE[current.value],
    /* Other supported locales, so crawlers know this URL has translations. */
    ogLocaleAlternate: () =>
      ALL_LOCALES.filter((code) => code !== current.value).map((code) => OG_LOCALE[code]),
    /* article:* — only meaningful for type=article; undefined fields are dropped. */
    articleAuthor: isArticle ? [SITE_URL] : undefined,
    articlePublishedTime: isArticle ? () => toValue(input.published) : undefined,
    articleModifiedTime: isArticle
      ? () => toValue(input.modified) ?? toValue(input.published)
      : undefined,
    articleSection: isArticle ? () => toValue(input.section) : undefined,
    twitterCard: 'summary_large_image',
    twitterSite: TWITTER_HANDLE,
    twitterCreator: TWITTER_HANDLE,
    twitterTitle: fullTitle,
    twitterDescription: description,
    twitterImage: ogImage,
    twitterImageAlt: imageAlt,
  })

  useHead({
    htmlAttrs: { lang: current },
    link: () => [
      { rel: 'canonical', href: canonical.value },
      ...ALL_LOCALES.map((code) => ({
        rel: 'alternate',
        hreflang: code,
        href: `${SITE_URL}${localePath(basePath.value, code)}`,
      })),
      {
        rel: 'alternate',
        hreflang: 'x-default',
        href: `${SITE_URL}${localePath(basePath.value, 'en')}`,
      },
    ],
  })
}

// Injects a JSON-LD <script> (schema.org structured data) for the page.
export function useJsonLd(data: MaybeRefOrGetter<Record<string, unknown>>) {
  useHead({
    script: [
      {
        type: 'application/ld+json',
        innerHTML: computed(() => JSON.stringify(toValue(data))),
      },
    ],
  })
}

// MARK: - Shared schema.org entities

/*
 * The canonical Person node (keyed by PERSON_ID). Other pages reference it by
 * @id as the author; the home page emits the full node once.
 */
export const personEntity = (): Record<string, unknown> => ({
  '@type': 'Person',
  '@id': PERSON_ID,
  name: SITE_NAME,
  alternateName: 'MDL',
  url: SITE_URL,
  image: `${SITE_URL}/og/home.jpg`,
  jobTitle: 'CTO & Product Engineer',
  description:
    'CTO & Product Engineer building platforms, mobile apps and AI-assisted workflows that stay simple under pressure.',
  knowsAbout: [
    'Software Architecture',
    'Product Engineering',
    'Vue.js',
    'TypeScript',
    'Supabase',
    'Mobile Development',
    'AI Systems',
    'Technical Leadership',
  ],
  worksFor: [
    { '@type': 'Organization', name: 'Smart Squad' },
    { '@type': 'Organization', name: 'Inksquad' },
  ],
  address: { '@type': 'PostalAddress', addressLocality: 'Udine', addressCountry: 'IT' },
  sameAs: [
    'https://github.com/massimodeluisa',
    'https://x.com/massimodeluisa',
    'https://www.linkedin.com/in/massimodeluisa',
  ],
})

/* The canonical WebSite node (keyed by WEBSITE_ID), authored by the Person. */
export const websiteEntity = (): Record<string, unknown> => ({
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  url: SITE_URL,
  name: SITE_NAME,
  inLanguage: 'en',
  publisher: { '@id': PERSON_ID },
})

/*
 * Emits a BreadcrumbList for a page. `items` are [name, absolute-url] pairs
 * ordered root → current.
 */
export function useBreadcrumbLd(items: MaybeRefOrGetter<[string, string][]>) {
  useJsonLd(() => ({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: toValue(items).map(([name, item], i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name,
      item,
    })),
  }))
}
