<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

import gsap from 'gsap'

import StdButton from '@/components/shared/StdButton.vue'
import { useActiveSection } from '@/composables/use-scroll-spy'
import { useLocale } from '@/composables/use-locale'
import { blogPosts } from '@/contents/blog'
import { useI18n } from '@/i18n'
import { NAV_ITEMS, type INavItem } from '@/data/navigation'

import LanguageSwitcher from './LanguageSwitcher.vue'
import SiteHeaderContactPill from './SiteHeaderContactPill.vue'

// MARK: - Constants

const MOBILE_MENU_OPEN_DURATION = 0.25
const MOBILE_MENU_CLOSE_DURATION = 0.2
const MOBILE_LINKS_DURATION = 0.4
const MOBILE_LINKS_STAGGER = 0.06
const MOBILE_LINKS_DELAY = 0.05

// MARK: - Composables

const route = useRoute()
const { t } = useI18n()
const { localePath } = useLocale()
const { activeSection } = useActiveSection()

// MARK: - Variables

const mobileMenuEl = ref<HTMLElement | null>(null)
const mobileOpen = ref(false)

// MARK: - Computed

const navItems = computed(() =>
  blogPosts.length ? NAV_ITEMS : NAV_ITEMS.filter((item) => item.id !== 'blog'),
)

// MARK: - Methods

const openMobile = () => {
  mobileOpen.value = true
  document.body.style.overflow = 'hidden'
  nextTick(() => {
    if (!mobileMenuEl.value) {
      return
    }
    const links = mobileMenuEl.value.querySelectorAll('.mobile-link')
    gsap.fromTo(
      mobileMenuEl.value,
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: MOBILE_MENU_OPEN_DURATION, ease: 'power2.out' },
    )
    gsap.fromTo(
      links,
      { autoAlpha: 0, y: 24 },
      {
        autoAlpha: 1,
        y: 0,
        duration: MOBILE_LINKS_DURATION,
        ease: 'power3.out',
        stagger: MOBILE_LINKS_STAGGER,
        delay: MOBILE_LINKS_DELAY,
      },
    )
  })
}

const closeMobile = () => {
  document.body.style.overflow = ''
  if (!mobileMenuEl.value) {
    mobileOpen.value = false
    return
  }
  gsap.to(mobileMenuEl.value, {
    autoAlpha: 0,
    duration: MOBILE_MENU_CLOSE_DURATION,
    ease: 'power2.in',
    onComplete: () => {
      mobileOpen.value = false
    },
  })
}

const toggleMobile = () => {
  if (mobileOpen.value) {
    closeMobile()
  } else {
    openMobile()
  }
}

const itemHref = (item: INavItem) => (item.to.startsWith('#') ? item.to : localePath(item.to))

const handleNavClick = (to: string, e: Event) => {
  const hash = to.includes('#') ? to.slice(to.indexOf('#') + 1) : ''
  if (hash) {
    const target = document.getElementById(hash)
    if (target) {
      e.preventDefault()
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }
  if (mobileOpen.value) {
    closeMobile()
  }
}

/*
 * On a routed page the link matching the route wins; on the home page the
 * scroll-spy section drives the highlight.
 */
const isActive = (item: INavItem) => {
  const name = String(route.name ?? '')
  if (name.includes('blog') || name.includes('article')) {
    return item.id === 'blog'
  }
  if (name === 'home' || name === 'locale.home') {
    return activeSection.value === item.id
  }
  return false
}

// Active link → bronze, except Home, which fades out (the bronze ⌂ icon stands in).
const navLinkClass = (item: INavItem) => {
  const active = isActive(item)
  return {
    'text-site-secondary!': active && item.id !== 'home',
    'pointer-events-none opacity-0': active && item.id === 'home',
  }
}

// MARK: - Watchers

watch(
  () => route.fullPath,
  () => {
    if (mobileOpen.value) {
      closeMobile()
    }
  },
)
</script>

<template lang="pug">
nav.ml-auto.hidden.items-center.gap-2.text-sm.font-medium(
  class="md:flex"
  :aria-label="t('nav.ariaLabel')"
)
  template(v-for="item in navItems" :key="item.id")
    SiteHeaderContactPill(
      v-if="item.prominent"
      :to="itemHref(item)"
      :label="t(item.labelKey)"
      :active="isActive(item)"
      @click="handleNavClick(item.to, $event)"
    )
    RouterLink(
      v-else
      :to="itemHref(item)"
      @click="handleNavClick(item.to, $event)"
    )
      StdButton.min-h-10.rounded-full.px-4.py-2(variant="ghost" :class="navLinkClass(item)") {{ t(item.labelKey) }}

button.burger-toggle.ml-auto.flex.size-11.shrink-0.items-center.justify-center.rounded-full.border.transition-colors(
  type="button"
  class="md:hidden"
  :aria-expanded="mobileOpen"
  :aria-label="t('nav.toggleMenu')"
  @click="toggleMobile"
)
  span.inline-flex.w-5.flex-col.items-center.justify-center.gap-1
    span.burger-bar.block.origin-center.rounded-full.bg-current.transition(
      class="w-[calc(var(--spacing)*4.5)] duration-300 ease-in-out"
      :class="mobileOpen ? 'translate-y-[7px] rotate-45' : ''"
    )
    span.burger-bar.block.origin-center.rounded-full.bg-current.transition(
      class="w-[calc(var(--spacing)*4.5)] duration-200 ease-in-out"
      :class="{ 'opacity-0': mobileOpen }"
    )
    span.burger-bar.block.origin-center.rounded-full.bg-current.transition(
      class="w-[calc(var(--spacing)*4.5)] duration-300 ease-in-out"
      :class="mobileOpen ? '-translate-y-[7px] -rotate-45' : ''"
    )

teleport(to="body")
  .mobile-menu.fixed.inset-0.z-40.flex.flex-col.items-center.justify-center.gap-8.opacity-0.backdrop-blur-2xl(
    v-show="mobileOpen"
    ref="mobileMenuEl"
    class="bg-[color-mix(in_oklab,var(--site-background)_95%,transparent)] md:hidden"
  )
    RouterLink.mobile-link.text-5xl.font-medium.tracking-tight.transition-colors(
      v-for="item in navItems"
      :key="item.id"
      :to="itemHref(item)"
      @click="handleNavClick(item.to, $event)"
    ) {{ t(item.labelKey) }}

    .mobile-link.mt-4
      LanguageSwitcher
</template>

<style scoped lang="scss">
/*
 * Burger sheds its border and deepens to the heading colour as the header
 * detaches into its pill (driven by --header-progress, set on the header).
 * Bars thicken from 2px → 3px over the same range, so the icon is only bold
 * once the border is gone and it lives inside the bar. Open-state translate
 * (7px) targets the bold 3px bar + 4px gap so the X stays centred.
 */
.burger-toggle {
  border-color: color-mix(
    in oklab,
    var(--site-border) calc((1 - var(--header-progress, 0)) * 100%),
    transparent
  );
  color: color-mix(
    in oklab,
    var(--site-muted),
    var(--site-heading) calc(var(--header-progress, 0) * 60%)
  );
}

.burger-bar {
  height: calc(2px + var(--header-progress, 0) * 1px);
}
</style>
