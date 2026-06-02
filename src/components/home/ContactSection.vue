<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import Section from '@/components/shared/Section.vue'
import StdButton from '@/components/shared/StdButton.vue'
import { useTextReveal } from '@/composables/use-text-reveal'
import { useI18n } from '@/i18n'
import { prefersReducedMotion } from '@/utils/motion'

import ContactLinkList from './ContactLinkList.vue'

gsap.registerPlugin(ScrollTrigger)

// MARK: - Composables

const { t } = useI18n()
const { revealCharsFade } = useTextReveal()

// MARK: - Variables

const calLink = 'https://www.cal.eu/massimodeluisa/30min'
const cvHref = '/cv.pdf'

// MARK: - Methods

const openCal = () => {
  window.open(calLink, '_blank', 'noopener,noreferrer')
}

// MARK: - Lifecycle

onMounted(() => {
  const section = document.querySelector<HTMLElement>('#contact')
  if (!section) {
    return
  }

  const reduced = prefersReducedMotion()
  const cards = section.querySelectorAll<HTMLElement>('.contact-card')

  if (reduced) {
    if (cards.length) {
      gsap.set(cards, { opacity: 1, y: 0 })
    }
    return
  }

  if (cards.length) {
    gsap.to(cards, {
      opacity: 1,
      y: 0,
      duration: 0.62,
      ease: 'power3.out',
      stagger: 0.1,
      scrollTrigger: { trigger: section, start: 'top 76%', once: true },
    })
  }

  const fades: { sel: string; delay: number }[] = [
    { sel: '.site-kicker', delay: 0 },
    { sel: 'h2', delay: 0.08 },
    { sel: '[data-contact-description]', delay: 0.18 },
    { sel: '[data-contact-response]', delay: 0.34 },
  ]
  for (const { sel, delay } of fades) {
    section.querySelectorAll<HTMLElement>(sel).forEach((el) => {
      revealCharsFade(el, { start: 'top 80%', delay, duration: 0.5, stagger: 0.012 })
    })
  }
})

onUnmounted(() => {
  ScrollTrigger.getAll().forEach((trigger) => {
    const el = trigger.trigger as HTMLElement | null
    if (el && el.closest('#contact')) {
      trigger.kill()
    }
  })
})
</script>

<template lang="pug">
Section(id="contact" content-class="grid gap-12 items-start lg:grid-cols-[1.05fr_0.95fr]")
  div
    p.site-kicker.font-mono.text-sm.font-semibold.uppercase.opacity-0(class="tracking-[0.24em]") {{ t('contact.kicker') }}
    h2.mt-3.text-4xl.font-semibold.text-site-heading.opacity-0(
      class="md:text-6xl [text-wrap:balance] hyphens-manual break-normal"
    ) {{ t('contact.title') }}
    p.mt-5.max-w-lg.text-lg.leading-relaxed.text-site-muted.opacity-0(
      data-contact-description
    ) {{ t('contact.description') }}

    p.mt-6.text-sm.text-site-muted.opacity-0(data-contact-response) {{ t('contact.responseTime') }}

    .mt-8.flex.items-center.gap-4
      p.font-mono.text-xs.uppercase.text-site-muted(class="tracking-[0.18em]") {{ t('contact.directLabel') }}
      .h-px.flex-1.bg-site-border
    .mt-3
      ContactLinkList

  div.flex.flex-col.gap-4
    .contact-card.site-card.rounded-2xl.border.p-6(class="opacity-0 translate-y-7 md:p-8")
      .space-y-3
        p.font-mono.text-xs.uppercase.text-site-secondary(class="tracking-[0.2em]") {{ t('contact.bookingTitle') }}
        p.text-sm.text-site-muted {{ t('contact.bookingDesc') }}
        p.text-xs.text-site-muted {{ t('contact.bookingWindow') }}
      StdButton.mt-6.w-full.rounded-xl.py-3.text-sm(variant="primary" @click="openCal") {{ t('contact.bookCta') }} →

    a.contact-card.cv-card.rounded-2xl.p-6.flex.items-center.gap-4.no-underline.transition-all(
      :href="cvHref"
      download
      class="opacity-0 translate-y-7 md:p-4 md:px-8 bg-site-heading text-site-background hover:bg-site-secondary hover:text-white active:scale-[0.985]"
    )
      span.cv-card-icon(aria-hidden="true")
      div.flex-1
        p.text-sm.font-medium {{ t('contact.cvTitle') }}
        p.text-xs.opacity-70(class="mt-0.5") {{ t('contact.cvMeta') }}
      span.cv-card-arrow(aria-hidden="true") ↓
</template>

<style scoped lang="scss">
/* mask-image — Tailwind cannot express iconify SVG masks. */
.cv-card-icon {
  display: inline-block;
  width: 1.75rem;
  height: 1.75rem;
  flex-shrink: 0;
  background-color: currentColor;
  mask-size: contain;
  mask-repeat: no-repeat;
  mask-position: center;
  mask-mode: alpha;
  mask-image: url('https://api.iconify.design/mdi:file-document-outline.svg');
  -webkit-mask-size: contain;
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: center;
  -webkit-mask-image: url('https://api.iconify.design/mdi:file-document-outline.svg');
}

/* Parent-hover child rule — needs SCSS nesting. */
.cv-card-arrow {
  color: currentColor;
  transition: transform 0.2s ease;
  font-size: 1.25rem;
}

.cv-card:hover .cv-card-arrow {
  transform: translateY(2px);
}

</style>
