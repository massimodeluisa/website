import type { RouteRecordRaw, Router, RouterScrollBehavior } from 'vue-router'

import {
  DEFAULT_LOCALE,
  NON_DEFAULT_LOCALES,
  preferredLocale,
  setGlobalLocale,
  type TLocaleCode,
} from '@/i18n'
import HomeView from '@/views/HomeView.vue'

// MARK: - Variables

/* Regex alternation of the locale codes that carry a URL prefix ('it|ja|ru|uk'),
   so the route matcher and the prefix regex stay in sync with the locale catalog. */
const LOCALE_ALT = NON_DEFAULT_LOCALES.join('|')

const baseChildren: RouteRecordRaw[] = [
  { path: '', name: 'home', component: HomeView },
  { path: 'blog', name: 'blog', component: () => import('@/views/BlogView.vue') },
  { path: 'blog/:slug', name: 'blogPost', component: () => import('@/views/BlogPostView.vue') },
  {
    path: ':pathMatch(.*)*',
    name: 'notFound',
    component: () => import('@/views/NotFoundView.vue'),
  },
]

// MARK: - Methods

const withLocaleNames = (prefix: string, children: RouteRecordRaw[]): RouteRecordRaw[] =>
  children.map((r) => ({
    ...r,
    name: r.name ? `${prefix}.${String(r.name)}` : undefined,
  }))

export const routes: RouteRecordRaw[] = [
  { path: '/', children: baseChildren },
  { path: `/:locale(${LOCALE_ALT})`, children: withLocaleNames('locale', baseChildren) },
]

const LOCALE_PREFIX = new RegExp(`^/(${LOCALE_ALT})(?=/|$)`)

/* The locale code carried by a path's prefix ('en' when unprefixed). */
const localeOf = (path: string): string => path.match(LOCALE_PREFIX)?.[1] ?? DEFAULT_LOCALE

/* The path with any locale prefix removed, so two locales of one page compare equal. */
const stripLocale = (path: string): string => {
  const match = path.match(LOCALE_PREFIX)
  return match ? path.slice(match[0].length) || '/' : path
}

export const scrollBehavior: RouterScrollBehavior = (to, from, savedPosition) => {
  if (savedPosition) {
    return savedPosition
  }
  /*
   * Language switch = same page, different locale prefix (e.g. `/` → `/it`).
   * Keep the reader where they are instead of snapping to the top (#home).
   * Hash-only anchor nav within one locale still falls through to the hash scroll.
   */
  if (
    from &&
    stripLocale(to.path) === stripLocale(from.path) &&
    localeOf(to.path) !== localeOf(from.path)
  ) {
    return false
  }
  if (to.hash) {
    return { el: to.hash, behavior: 'smooth' }
  }
  return { top: 0 }
}

// Sets the active locale from the route prefix on every navigation.
export function installLocaleGuard(router: Router) {
  router.beforeEach((to) => {
    const param = to.params.locale
    const code: TLocaleCode =
      typeof param === 'string' && (NON_DEFAULT_LOCALES as readonly string[]).includes(param)
        ? (param as TLocaleCode)
        : DEFAULT_LOCALE
    setGlobalLocale(code)
    if (typeof document !== 'undefined') {
      document.documentElement.lang = code
    }
  })
}

/*
 * Client only: on the first hit of the unprefixed homepage, send the visitor to
 * their preferred language (saved manual choice, else browser language). Runs
 * once and only for '/', so deep links and explicit locale URLs stay untouched.
 */
export function installLocaleRedirect(router: Router) {
  let handled = false
  router.beforeEach((to) => {
    if (handled || to.path !== '/') {
      return true
    }
    handled = true
    const preferred = preferredLocale()
    if (preferred === DEFAULT_LOCALE) {
      return true
    }
    return { path: `/${preferred}`, hash: to.hash, query: to.query }
  })
}
