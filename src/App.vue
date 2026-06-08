<script setup lang="ts">
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'

import { useI18n } from '@/i18n'
import { showCookiePreferences } from '@/composables/use-consent'
import TechBrand from '@/components/shared/TechBrand.vue'
import ScrollToTopButton from '@/components/site/ScrollToTopButton.vue'
import SiteHeader from '@/components/site/SiteHeader.vue'

// MARK: - Composables

const route = useRoute()
const { t } = useI18n()

// MARK: - Variables

const footerLinks: { labelKey: string; href: string; download?: boolean; external?: boolean }[] = [
  { labelKey: 'footer.sitemap', href: '/sitemap.xml' },
  { labelKey: 'footer.rss', href: '/rss.xml' },
  { labelKey: 'footer.cv', href: '/cv.pdf', download: true },
  {
    labelKey: 'footer.sourceCode',
    href: 'https://github.com/massimodeluisa/website',
    external: true,
  },
]

// MARK: - Computed

const isHomeRoute = computed(() => route.name === 'home' || route.name === 'locale.home')
const isNotFoundRoute = computed(
  () => route.name === 'notFound' || route.name === 'locale.notFound',
)
</script>

<template lang="pug">
.flex.flex-col(:class="isNotFoundRoute ? 'h-dvh overflow-hidden' : 'min-h-dvh'" class="overflow-x-clip")
  //- Keyboard/screen-reader bypass block (WCAG 2.4.1): hidden until focused.
  a.sr-only(
    href="#main-content"
    class="focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:border focus:border-site-border focus:bg-site-background focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-site-heading focus:no-underline focus:outline-2 focus:outline-offset-2 focus:outline-site-secondary"
  ) {{ t('nav.skipToContent') }}

  SiteHeader

  main#main-content.grow(
    tabindex="-1"
    :class="isHomeRoute || isNotFoundRoute ? 'pt-0' : 'pt-20'"
    class="outline-none"
  )
    RouterView

  footer.border-t.border-site-border(class="bg-site-surface/80")
    //- site-container gutters so the footer lines up with every section
    //- (e.g. the "Let's meet!" content), instead of a tighter fixed px-6.
    .site-container.flex.flex-wrap.items-center.justify-between.gap-x-6.gap-y-3.py-6.text-sm(
      class='text-site-muted'
    )
      p.flex.flex-wrap.items-center(class="gap-x-2.5 gap-y-1.5")
        | {{ t('footer.madeWith') }}
        span.text-base.inline-block.origin-center.text-site-secondary.will-change-transform(
          aria-hidden="true"
          class="-translate-y-px -mt-2 -mx-1 -mb-3 text-xl animate-[footer-heartbeat_1.6s_ease-in-out_infinite] motion-reduce:animate-none"
        ) ♥
        | {{ t('footer.and') }}
        TechBrand(brand="vue")
        TechBrand(brand="tailwind")
        TechBrand(brand="gsap")
        TechBrand(brand="bun")
        TechBrand(brand="vite")
        TechBrand(brand="typescript")

      //- Links + copyright are one group: when the footer can't fit on a single
      //- line they stay next to each other instead of being pulled to opposite
      //- ends by justify-between.
      .flex.flex-wrap.items-center(class="gap-x-4 gap-y-1.5")
        nav.flex.flex-wrap.items-center.gap-x-4.gap-y-2.text-xs(:aria-label="t('footer.navAriaLabel')")
          template(v-for="(link, i) in footerLinks" :key="link.href")
            span.text-site-muted.opacity-40(v-if="i > 0" aria-hidden="true") ·
            a.text-site-muted.no-underline.transition-colors(
              :href="link.href"
              :download="link.download || undefined"
              :target="link.external ? '_blank' : undefined"
              :rel="link.external ? 'noopener noreferrer' : undefined"
              class="hover:text-site-heading focus-visible:text-site-heading"
            ) {{ t(link.labelKey) }}
          span.text-site-muted.opacity-40(aria-hidden="true") ·
          button.text-site-muted.no-underline.transition-colors(
            type="button"
            class="hover:text-site-heading focus-visible:text-site-heading"
            @click="showCookiePreferences"
          ) {{ t('footer.cookiePreferences') }}

        a.font-mono.text-xs.opacity-60.no-underline.transition-opacity(
          href="https://github.com/massimodeluisa/website/blob/master/LICENSE.md"
          target="_blank"
          rel="noopener noreferrer"
          :aria-label="t('footer.licenseAriaLabel')"
          class="hover:opacity-100"
        ) {{ t('footer.copyright') }}

  ScrollToTopButton
</template>
