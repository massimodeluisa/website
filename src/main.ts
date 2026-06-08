import { ViteSSG } from 'vite-ssg'

import App from './App.vue'
import { installAnalytics } from './composables/use-analytics'
import { initConsent } from './composables/use-consent'
import { installLocaleGuard, installLocaleRedirect, routes, scrollBehavior } from './router'

import './assets/tailwind.css'
import './assets/main.scss'

import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import advancedFormat from 'dayjs/plugin/advancedFormat'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(advancedFormat)

/*
 * vite-ssg owns app/router/head creation (it ships @unhead) for both the
 * static pre-render and the hydrated client.
 */
export const createApp = ViteSSG(App, { routes, scrollBehavior }, ({ router, isClient }) => {
  installLocaleGuard(router)
  if (isClient) {
    installLocaleRedirect(router)
    installAnalytics(router)
    initConsent()
  }
})
