<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import BlogPostCard from '@/components/shared/BlogPostCard.vue'
import Section from '@/components/shared/Section.vue'
import SectionHeading from '@/components/shared/SectionHeading.vue'
import SectionKicker from '@/components/shared/SectionKicker.vue'
import StdButton from '@/components/shared/StdButton.vue'
import { useTextReveal } from '@/composables/use-text-reveal'
import { useLocale } from '@/composables/use-locale'
import { blogPosts } from '@/contents/blog'
import { useI18n } from '@/i18n'
import { prefersReducedMotion } from '@/utils/motion'

gsap.registerPlugin(ScrollTrigger)

// MARK: - Constants

const SECTION_REVEAL_DURATION = 0.72
const FADE_REVEAL_DURATION = 0.45
const FADE_REVEAL_STAGGER = 0.012

// MARK: - Composables

const { t } = useI18n()
const { localePath } = useLocale()
const { revealCharsFade } = useTextReveal()

// MARK: - Variables

/*
 * Reference resolves via document.querySelector('#blog') after mount —
 * Section is a child component so a template ref points at the component
 * instance, not its DOM element.
 */
let sectionEl: HTMLElement | null = null

// MARK: - Computed

const latestPosts = computed(() => blogPosts.slice(0, 3))

// Hide the whole section when there are no posts.
const hasPosts = computed(() => blogPosts.length > 0)

// MARK: - Lifecycle

onMounted(() => {
  sectionEl = document.querySelector<HTMLElement>('#blog')
  if (!sectionEl) {
    return
  }
  const section = sectionEl
  const reduced = prefersReducedMotion()

  if (reduced) {
    gsap.set(section, { opacity: 1, y: 0 })
    return
  }

  gsap.to(section, {
    opacity: 1,
    y: 0,
    duration: SECTION_REVEAL_DURATION,
    ease: 'power3.out',
    scrollTrigger: { trigger: section, start: 'top 80%', once: true },
  })

  // Sequence per-character fades across every text node in the section.
  const targets: { el: HTMLElement; delay: number; start?: string }[] = []
  const push = (sel: string, delay: number, start = 'top 80%') => {
    section.querySelectorAll<HTMLElement>(sel).forEach((el) => {
      targets.push({ el, delay, start })
    })
  }

  push('.site-kicker', 0)
  push('h2', 0.08)
  push('.see-more-pill > span', 0.18)
  section.querySelectorAll<HTMLElement>('ol > li').forEach((li, i) => {
    const base = 0.22 + i * 0.12
    li.querySelectorAll<HTMLElement>(
      ':scope a > .flex > span, :scope a > h3, :scope a > p, :scope a > .text-sm',
    ).forEach((el, j) => targets.push({ el, delay: base + j * 0.04 }))
  })

  for (const target of targets) {
    revealCharsFade(target.el, {
      start: target.start ?? 'top 84%',
      delay: target.delay,
      duration: FADE_REVEAL_DURATION,
      stagger: FADE_REVEAL_STAGGER,
    })
  }
})

onUnmounted(() => {
  ScrollTrigger.getAll().forEach((trigger) => {
    const el = trigger.trigger as HTMLElement | null
    if (el && el.closest('#blog')) {
      trigger.kill()
    }
  })
})
</script>

<template lang="pug">
Section(v-if="hasPosts" id="blog" class="opacity-0 translate-y-8")
  .flex.items-end.justify-between.gap-4
    div
      SectionKicker {{ t('blog.kicker') }}
      SectionHeading {{ t('blog.heading') }}

    RouterLink(:to="localePath('/blog')")
      StdButton.see-more-pill.gap-2.rounded-full.px-4.py-2.text-sm(variant="secondary")
        span {{ t('blog.seeMore') }}
        span →

  ol.mt-10
    li(v-for="post in latestPosts" :key="post.slug")
      BlogPostCard(:post="post" compact)
</template>
