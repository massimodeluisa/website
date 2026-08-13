import { nextTick } from 'vue'
import type { Router } from 'vue-router'

// MARK: - Variables

const GTM_ID = 'GTM-WBGBR4MK'

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[]
  }
}

// MARK: - Methods

function ensureDataLayer(): Record<string, unknown>[] {
  window.dataLayer = window.dataLayer ?? []
  return window.dataLayer
}

/*
 * Canonical gtag(): pushes the raw `arguments` list onto the dataLayer. Google
 * Consent Mode reads commands ONLY in this exact shape (not as a flattened
 * object), so consent default/update must go through here.
 */
export const gtag: (...args: unknown[]) => void = function () {
  // eslint-disable-next-line prefer-rest-params
  ensureDataLayer().push(arguments as unknown as Record<string, unknown>)
}

let scriptLoaded = false

/* Inject the GTM container once (client only) — same as the official snippet. */
function loadGtm() {
  if (scriptLoaded || typeof document === 'undefined') {
    return
  }
  scriptLoaded = true

  /*
   * Consent Mode v2 defaults — MUST run before gtm.js so the first hits are
   * cookieless until the user opts in (GDPR/ePrivacy). use-consent then calls
   * gtag('consent','update',…) when the banner is answered.
   */
  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
    functionality_storage: 'denied',
    personalization_storage: 'denied',
    security_storage: 'granted',
    wait_for_update: 500,
  })
  gtag('set', 'ads_data_redaction', true)
  gtag('set', 'url_passthrough', true)

  ensureDataLayer().push({ 'gtm.start': Date.now(), event: 'gtm.js' })
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`
  document.head.appendChild(script)
}

/** Push a custom event to the GTM dataLayer (no-op during SSG). */
export function track(event: string, payload: Record<string, unknown> = {}) {
  if (typeof window === 'undefined') {
    return
  }
  ensureDataLayer().push({ event, ...payload })
}

/** Push an SPA page view (GTM maps this to GA4 page_view / FB Pixel PageView). */
export function trackPageView(path: string) {
  track('page_view', {
    page_path: path,
    page_title: typeof document !== 'undefined' ? document.title : '',
    page_location: typeof window !== 'undefined' ? window.location.href : '',
  })
}

/** Journal listing impression (GA4 custom event via GTM). */
export function trackBlogList(payload: { page: number; posts: number }) {
  track('blog_list_view', payload)
}

/** Journal article open (GA4 custom event via GTM). */
export function trackArticleView(payload: { slug: string; title: string; category: string }) {
  track('article_view', payload)
}

/** Reading-depth milestone 25/50/75/100 (GA4 custom event via GTM). */
export function trackArticleProgress(payload: { slug: string; percent: number }) {
  track('article_read_progress', payload)
}

/* Loads GTM and reports a page view after every route change (on nextTick so
 * the document title is already updated by @unhead). */
export function installAnalytics(router: Router) {
  if (typeof window === 'undefined') {
    return
  }
  loadGtm()
  router.afterEach((to) => {
    void nextTick(() => trackPageView(to.fullPath))
  })
}

// MARK: - Composable

export function useAnalytics() {
  return { track, trackPageView }
}
