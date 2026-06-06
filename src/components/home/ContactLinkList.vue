<script setup lang="ts">
import { useI18n } from '@/i18n'

interface ISocialLink {
  labelKey: string
  href: string
  icon: string
  external?: boolean
}

// MARK: - Composables

const { t } = useI18n()

// MARK: - Variables

const links: ISocialLink[] = [
  {
    labelKey: 'contact.links.share',
    href: 'https://massimo.deluisa.bio',
    icon: 'mdi:link-variant',
    external: true,
  },
  {
    labelKey: 'contact.links.email',
    href: 'mailto:massimodeluisa@me.com',
    icon: 'mdi:email-outline',
  },
  {
    labelKey: 'contact.links.github',
    href: 'https://github.com/massimodeluisa',
    icon: 'mdi:github',
    external: true,
  },
  {
    labelKey: 'contact.links.linkedin',
    href: 'https://www.linkedin.com/in/massimodeluisa',
    icon: 'mdi:linkedin',
    external: true,
  },
  {
    labelKey: 'contact.links.telegram',
    href: 'https://t.me/massimodeluisa',
    icon: 'fa-brands:telegram',
    external: true,
  },
  {
    labelKey: 'contact.links.line',
    href: 'https://line.me/ti/p/KrsSKLsYE9',
    icon: 'fa-brands:line',
    external: true,
  },
  {
    labelKey: 'contact.links.x',
    href: 'https://x.com/massimodeluisa',
    icon: 'simple-icons:x',
    external: true,
  },
]

// MARK: - Methods

const iconUrl = (icon: string) => `https://api.iconify.design/${icon}.svg`
</script>

<template lang="pug">
ul.flex.items-center.gap-1.list-none.p-0.m-0
  li(v-for="link in links" :key="link.href")
    a.contact-social.inline-flex.size-10.items-center.justify-center.rounded-full.text-site-muted(
      :href="link.href"
      :target="link.external ? '_blank' : undefined"
      :rel="link.external ? 'noopener noreferrer' : undefined"
      :aria-label="t(link.labelKey)"
      class="transition-[color,background,transform] duration-200 ease-[ease] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-site-secondary"
    )
      span.contact-social-icon.inline-block.size-5.bg-current(
        :style="{ maskImage: `url(${iconUrl(link.icon)})`, WebkitMaskImage: `url(${iconUrl(link.icon)})` }"
        aria-hidden="true"
      )
</template>

<style scoped lang="scss">
/* color-mix hover background — not expressible in Tailwind. */
.contact-social:hover {
  color: var(--site-heading);
  background: color-mix(in oklab, var(--site-secondary) 14%, transparent);
  transform: translateY(-1px);
}

/* mask-* vendored properties must live in SCSS. */
.contact-social-icon {
  mask-size: contain;
  mask-repeat: no-repeat;
  mask-position: center;
  mask-mode: alpha;
  -webkit-mask-size: contain;
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: center;
}
</style>
