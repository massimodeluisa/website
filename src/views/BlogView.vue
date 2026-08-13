<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import BlogPostCard from '@/components/shared/BlogPostCard.vue'
import BlogPagination from '@/components/shared/BlogPagination.vue'
import StdButton from '@/components/shared/StdButton.vue'
import {
  usePageSeo,
  useJsonLd,
  useBreadcrumbLd,
  websiteEntity,
  SITE_URL,
  PERSON_ID,
  WEBSITE_ID,
} from '@/composables/use-page-seo'
import { useLocale } from '@/composables/use-locale'
import { useTextReveal } from '@/composables/use-text-reveal'
import { blogPageCount, blogPosts, blogPostsForPage, parseBlogPage } from '@/contents/blog'
import { useI18n } from '@/i18n'
import { prefersReducedMotion } from '@/utils/motion'

gsap.registerPlugin(ScrollTrigger)

// MARK: - Composables

const route = useRoute()
const { t } = useI18n()
const { current, localePath } = useLocale()
const { revealLines, revealWords } = useTextReveal()

usePageSeo({
  title: () => t('blog.heading'),
  description: () => t('blog.intro'),
})
useJsonLd(() => ({
  '@context': 'https://schema.org',
  '@graph': [
    websiteEntity(),
    {
      '@type': 'Blog',
      '@id': `${SITE_URL}/blog/#blog`,
      url: `${SITE_URL}/blog`,
      name: t('blog.heading'),
      description: t('blog.intro'),
      inLanguage: current.value,
      isPartOf: { '@id': WEBSITE_ID },
      publisher: { '@id': PERSON_ID },
      blogPost: blogPosts.map((p) => ({
        '@type': 'BlogPosting',
        headline: p.title,
        url: `${SITE_URL}/blog/${p.slug}`,
        datePublished: p.date,
      })),
    },
  ],
}))
useBreadcrumbLd(() => [
  [t('nav.home'), SITE_URL],
  [t('blog.heading'), `${SITE_URL}/blog`],
])

// MARK: - Variables

let postTriggers: ScrollTrigger[] = []

// MARK: - Computed

const currentPage = computed(() => parseBlogPage(route.query.page))
const totalPages = computed(() => blogPageCount())
const pagedPosts = computed(() => blogPostsForPage(currentPage.value))
const listPath = computed(() => route.path)

// MARK: - Methods

function killPostTriggers() {
  postTriggers.forEach((trigger) => trigger.kill())
  postTriggers = []
}

function setupPostReveals() {
  killPostTriggers()
  const reduced = prefersReducedMotion()
  const items = document.querySelectorAll<HTMLElement>('[data-blog-post]')
  if (reduced) {
    if (items.length) {
      gsap.set(items, { opacity: 1, clearProps: 'transform' })
    }
    return
  }
  items.forEach((item, index) => {
    gsap.set(item, { opacity: 0, y: 36 })
    const trigger = ScrollTrigger.create({
      trigger: item,
      start: 'top 92%',
      once: true,
      onEnter: () => {
        gsap.to(item, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', delay: index * 0.04 })
      },
    })
    postTriggers.push(trigger)
  })
  requestAnimationFrame(() => ScrollTrigger.refresh())
}

// MARK: - Watchers

watch(currentPage, async () => {
  if (typeof window === 'undefined') {
    return
  }
  window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
  await nextTick()
  setupPostReveals()
})

// MARK: - Lifecycle

onMounted(() => {
  const reduced = prefersReducedMotion()

  if (reduced) {
    const toShow = document.querySelectorAll<HTMLElement>(
      '.site-kicker, h1, [data-blog-intro], [data-blog-post]',
    )
    if (toShow.length) {
      gsap.set(toShow, { opacity: 1, clearProps: 'transform' })
    }
    return
  }

  const kicker = document.querySelector<HTMLElement>('.site-kicker')
  const pageTitle = document.querySelector<HTMLElement>('h1')
  const pageIntro = document.querySelector<HTMLElement>('[data-blog-intro]')

  if (kicker) {
    revealLines(kicker, { start: 'top 86%' })
  }
  if (pageTitle) {
    revealLines(pageTitle, { start: 'top 82%', delay: 0.07 })
  }
  if (pageIntro) {
    revealWords(pageIntro, { start: 'top 79%', delay: 0.15, duration: 0.9 })
  }

  setupPostReveals()
})

onUnmounted(() => {
  killPostTriggers()
})
</script>

<template lang="pug">
section
  .site-container
    router-link(:to="localePath('/')")
      StdButton.gap-1.rounded-full.px-3.text-sm(variant="secondary" class="py-1.5")
        span(aria-hidden="true") ←
        span {{ t('blog.backHome') }}

    .max-w-3xl.mt-10
      p.site-kicker.font-mono.text-sm.font-semibold.uppercase.opacity-0(class="tracking-[0.24em]") {{ t('blog.kicker') }}
      h1.mt-2.text-5xl.font-semibold.text-site-heading.opacity-0(class="md:text-6xl") {{ t('blog.heading') }}
      p.mt-6.max-w-2xl.text-xl.text-site-muted.opacity-0(data-blog-intro) {{ t('blog.intro') }}

    .mt-16.space-y-12
      .border-b.border-site-border.pb-10(
        v-for="post in pagedPosts"
        :key="post.slug"
        data-blog-post
        class="opacity-0 translate-y-9 last:border-b-0"
      )
        BlogPostCard(:post="post")

    BlogPagination.mt-4(
      :current="currentPage"
      :total="totalPages"
      :base-path="listPath"
    )
</template>
