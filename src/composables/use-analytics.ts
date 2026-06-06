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

let scriptLoaded = false

/* Inject the GTM container once (client only) — same as the official snippet. */
function loadGtm() {
  if (scriptLoaded || typeof document === 'undefined') {
    return
  }
  scriptLoaded = true
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
