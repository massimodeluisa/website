import type { RouteRecordRaw, Router, RouterScrollBehavior } from 'vue-router'

import { setGlobalLocale, type TLocaleCode } from '@/i18n'
import HomeView from '@/views/HomeView.vue'

const baseChildren: RouteRecordRaw[] = [
  { path: '', name: 'home', component: HomeView },
  { path: 'blog', name: 'blog', component: () => import('@/views/BlogView.vue') },
  { path: 'blog/:slug', name: 'blogPost', component: () => import('@/views/BlogPostView.vue') },
  { path: 'work/:slug', name: 'work', component: () => import('@/views/WorkDetailView.vue') },
  { path: ':pathMatch(.*)*', name: 'notFound', component: () => import('@/views/NotFoundView.vue') },
]

const withLocaleNames = (prefix: string, children: RouteRecordRaw[]): RouteRecordRaw[] =>
  children.map((r) => ({
    ...r,
    name: r.name ? `${prefix}.${String(r.name)}` : undefined,
  }))

export const routes: RouteRecordRaw[] = [
  { path: '/', children: baseChildren },
  { path: '/:locale(it|ja|ru|uk)', children: withLocaleNames('locale', baseChildren) },
  {
    path: '/test-bg/:id(1|2|3|4)',
    name: 'testBg',
    component: () => import('@/views/TestBgView.vue'),
  },
]

export const scrollBehavior: RouterScrollBehavior = (to, _from, savedPosition) => {
  if (savedPosition) {
    return savedPosition
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
      typeof param === 'string' && ['it', 'ja', 'ru', 'uk'].includes(param)
        ? (param as TLocaleCode)
        : 'en'
    setGlobalLocale(code)
    if (typeof document !== 'undefined') {
      document.documentElement.lang = code
    }
  })
}
