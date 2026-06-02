import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { useHead, useSeoMeta } from '@unhead/vue'
import { useRoute } from 'vue-router'

import { useLocale } from './use-locale'
import type { TLocaleCode } from '@/i18n'

const SITE_URL = 'https://deluisa.me'
const SITE_NAME = 'Massimo De Luisa'

const ALL_LOCALES: TLocaleCode[] = ['en', 'it', 'ja', 'ru', 'uk']

const OG_LOCALE: Record<TLocaleCode, string> = {
  en: 'en_US',
  it: 'it_IT',
  ja: 'ja_JP',
  ru: 'ru_RU',
  uk: 'uk_UA',
}

interface IPageSeo {
  title: MaybeRefOrGetter<string>
  description: MaybeRefOrGetter<string>
  type?: 'website' | 'article'
  image?: string
}

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
    return `${SITE_URL}/og${key}.png`
  })

  useSeoMeta({
    title: fullTitle,
    description,
    ogTitle: fullTitle,
    ogDescription: description,
    ogType: input.type ?? 'website',
    ogUrl: canonical,
    ogSiteName: SITE_NAME,
    ogImage,
    ogImageWidth: '1200',
    ogImageHeight: '630',
    ogImageType: 'image/png',
    ogLocale: () => OG_LOCALE[current.value],
    twitterCard: 'summary_large_image',
    twitterTitle: fullTitle,
    twitterDescription: description,
    twitterImage: ogImage,
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
