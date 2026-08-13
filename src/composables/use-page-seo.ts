import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { useHead, useSeoMeta } from '@unhead/vue'
import { useRoute } from 'vue-router'

import { useLocale } from './use-locale'
import { SUPPORTED_LOCALES, type TLocaleCode } from '@/i18n'
import {
  ORG_ID,
  PERSON_ID,
  PROFILES,
  SAME_AS,
  SITE_NAME,
  SITE_ROLE,
  SITE_SUMMARY,
  SITE_URL,
  TWITTER_HANDLE,
  WEBSITE_ID,
} from '@/data/site'

export { ORG_ID, PERSON_ID, SITE_NAME, SITE_URL, WEBSITE_ID } from '@/data/site'

// MARK: - Variables

/* Let search engines show full-size image previews and untruncated snippets. */
const DEFAULT_ROBOTS =
  'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'

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
    let path = match ? (match[1] ?? '/') : route.path
    /* /articles is a legacy alias of /blog — never let it become the canonical. */
    if (path === '/articles' || path.startsWith('/articles/')) {
      path = path.replace(/^\/articles/, '/blog')
    }
    return path
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
      SUPPORTED_LOCALES.filter((code) => code !== current.value).map((code) => OG_LOCALE[code]),
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
      ...SUPPORTED_LOCALES.map((code) => ({
        rel: 'alternate' as const,
        hreflang: code,
        href: `${SITE_URL}${localePath(basePath.value, code)}`,
      })),
      {
        rel: 'alternate',
        hreflang: 'x-default',
        href: `${SITE_URL}${localePath(basePath.value, 'en')}`,
      },
      { rel: 'alternate', type: 'application/rss+xml', href: `${SITE_URL}/rss.xml`, title: `${SITE_NAME} — Journal` },
      { rel: 'alternate', type: 'application/feed+json', href: `${SITE_URL}/feed.json`, title: `${SITE_NAME} — Journal` },
      { rel: 'alternate', type: 'application/atom+xml', href: `${SITE_URL}/atom.xml`, title: `${SITE_NAME} — Journal` },
      { rel: 'me', href: PROFILES.github },
      { rel: 'me', href: PROFILES.linkedin },
      { rel: 'me', href: PROFILES.x },
      { rel: 'me', href: PROFILES.bio },
      { rel: 'author', href: SITE_URL },
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
  alternateName: ['MDL', 'Massimo Deluisa'],
  url: SITE_URL,
  image: `${SITE_URL}/og/home.jpg`,
  jobTitle: SITE_ROLE,
  description: SITE_SUMMARY,
  knowsAbout: [
    'Software Architecture',
    'Product Engineering',
    'Vue.js',
    'TypeScript',
    'Rust',
    'Supabase',
    'Mobile Development',
    'AI Systems',
    'Generative Engine Optimization',
    'Technical Leadership',
  ],
  worksFor: [
    { '@type': 'Organization', name: 'Smart Squad', url: 'https://smartsquad.io' },
    { '@type': 'Organization', name: 'Inksquad', url: 'https://inksquad.com' },
  ],
  address: { '@type': 'PostalAddress', addressLocality: 'Udine', addressCountry: 'IT' },
  nationality: { '@type': 'Country', name: 'Italy' },
  sameAs: [...SAME_AS],
})

/*
 * Personal brand / publisher Organization — gives E-E-A-T entity-identity
 * signals (logo + sameAs) that Person alone does not always satisfy.
 */
export const organizationEntity = (): Record<string, unknown> => ({
  '@type': 'Organization',
  '@id': ORG_ID,
  name: SITE_NAME,
  legalName: SITE_NAME,
  url: SITE_URL,
  logo: {
    '@type': 'ImageObject',
    url: `${SITE_URL}/favicon/android-chrome-512x512.png`,
    width: 512,
    height: 512,
  },
  image: `${SITE_URL}/og/home.jpg`,
  founder: { '@id': PERSON_ID },
  founderName: SITE_NAME,
  sameAs: [...SAME_AS],
})

/* Named author node — BlogPosting must carry author.name, not only @id. */
export const authorRef = (): Record<string, unknown> => ({
  '@type': 'Person',
  '@id': PERSON_ID,
  name: SITE_NAME,
  url: SITE_URL,
})

/* The canonical WebSite node (keyed by WEBSITE_ID), authored by the Person. */
export const websiteEntity = (): Record<string, unknown> => ({
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  url: SITE_URL,
  name: SITE_NAME,
  inLanguage: [...SUPPORTED_LOCALES],
  author: authorRef(),
  creator: { '@id': PERSON_ID },
  publisher: { '@id': ORG_ID },
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
