<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import StdButton from '@/components/shared/StdButton.vue'
import {
  usePageSeo,
  useJsonLd,
  useBreadcrumbLd,
  personEntity,
  websiteEntity,
  SITE_URL,
  PERSON_ID,
  WEBSITE_ID,
} from '@/composables/use-page-seo'
import { blogPosts } from '@/contents/blog'
import { useI18n } from '@/i18n'
import { prefersReducedMotion } from '@/utils/motion'

gsap.registerPlugin(ScrollTrigger)

// MARK: - Constants

const BACK_ROW_REVEAL_DURATION = 0.5
const CONTENT_REVEAL_DELAY = 0.06
const CONTENT_REVEAL_DURATION = 0.6
const PROSE_REVEAL_DELAY = 0.12
const PROSE_REVEAL_DURATION = 0.7
const MORE_SECTION_REVEAL_DELAY = 0.22
const MORE_SECTION_REVEAL_DURATION = 0.55
const MORE_LINKS_REVEAL_DURATION = 0.4
const MORE_LINKS_REVEAL_STAGGER = 0.06
const MORE_LINKS_REVEAL_DELAY = 0.35

// MARK: - Composables

const route = useRoute()
const { t, locale } = useI18n()

// MARK: - Variables

const backRowEl = ref<HTMLElement | null>(null)
const contentWrapperEl = ref<HTMLElement | null>(null)
const proseEl = ref<HTMLElement | null>(null)
const moreSectionEl = ref<HTMLElement | null>(null)

let postViewTriggers: ScrollTrigger[] = []

// MARK: - Computed

const slug = computed(() => String(route.params.slug ?? ''))
const post = computed(() => blogPosts.find((p) => p.slug === slug.value))

const postUrl = computed(() => `${SITE_URL}/blog/${slug.value}`)

usePageSeo({
  title: () => post.value?.title ?? t('blog.notFound'),
  description: () => post.value?.excerpt ?? '',
  type: 'article',
  imageAlt: () => post.value?.title ?? '',
  published: () => post.value?.date,
  modified: () => post.value?.date,
  section: () => post.value?.category,
  robots: post.value ? undefined : 'noindex, follow',
})
useJsonLd(() => ({
  '@context': 'https://schema.org',
  '@graph': [
    personEntity(),
    websiteEntity(),
    {
      '@type': 'BlogPosting',
      '@id': `${postUrl.value}/#article`,
      headline: post.value?.title,
      description: post.value?.excerpt,
      datePublished: post.value?.date,
      dateModified: post.value?.date,
      articleSection: post.value?.category,
      inLanguage: locale.value,
      image: `${SITE_URL}/og/blog/${slug.value}.jpg`,
      author: { '@id': PERSON_ID },
      publisher: { '@id': PERSON_ID },
      isPartOf: { '@id': WEBSITE_ID },
      mainEntityOfPage: { '@type': 'WebPage', '@id': postUrl.value },
    },
  ],
}))
useBreadcrumbLd(() => [
  [t('nav.home'), SITE_URL],
  [t('blog.heading'), `${SITE_URL}/blog`],
  [post.value?.title ?? '', postUrl.value],
])
const otherPosts = computed(() =>
  blogPosts.filter((p) => post.value && p.slug !== post.value.slug).slice(0, 3),
)
const formattedDate = computed(() =>
  post.value
    ? new Date(post.value.date).toLocaleDateString(locale.value, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '',
)
const readingTimeLabel = computed(() =>
  post.value ? `${post.value.readingTime} ${t('blog.minutes')}` : '',
)

// MARK: - Lifecycle

onMounted(() => {
  const reduced = prefersReducedMotion()

  if (reduced) {
    const els = [
      backRowEl.value,
      contentWrapperEl.value,
      proseEl.value,
      moreSectionEl.value,
    ].filter(Boolean) as HTMLElement[]
    if (els.length) {
      gsap.set(els, { opacity: 1, clearProps: 'transform' })
    }
    if (moreSectionEl.value) {
      const links = moreSectionEl.value.querySelectorAll<HTMLElement>('a')
      if (links.length) {
        gsap.set(links, { opacity: 1, clearProps: 'transform' })
      }
    }
    return
  }

  const elements = [
    { el: backRowEl.value, y: 20, delay: 0, duration: BACK_ROW_REVEAL_DURATION },
    {
      el: contentWrapperEl.value,
      y: 28,
      delay: CONTENT_REVEAL_DELAY,
      duration: CONTENT_REVEAL_DURATION,
    },
    { el: proseEl.value, y: 32, delay: PROSE_REVEAL_DELAY, duration: PROSE_REVEAL_DURATION },
    {
      el: moreSectionEl.value,
      y: 24,
      delay: MORE_SECTION_REVEAL_DELAY,
      duration: MORE_SECTION_REVEAL_DURATION,
    },
  ].filter((item) => item.el)

  elements.forEach((item) => {
    const trigger = ScrollTrigger.create({
      trigger: item.el!,
      start: 'top 86%',
      once: true,
      onEnter: () => {
        gsap.to(item.el, {
          opacity: 1,
          y: 0,
          duration: item.duration,
          ease: 'power3.out',
          delay: item.delay,
        })
      },
    })
    postViewTriggers.push(trigger)
  })

  if (moreSectionEl.value) {
    const links = moreSectionEl.value.querySelectorAll<HTMLElement>('a')
    if (links.length) {
      const linkTrigger = ScrollTrigger.create({
        trigger: moreSectionEl.value,
        start: 'top 82%',
        once: true,
        onEnter: () => {
          gsap.to(links, {
            opacity: 1,
            y: 0,
            duration: MORE_LINKS_REVEAL_DURATION,
            ease: 'power2.out',
            stagger: MORE_LINKS_REVEAL_STAGGER,
            delay: MORE_LINKS_REVEAL_DELAY,
          })
        },
      })
      postViewTriggers.push(linkTrigger)
    }
  }
})

onUnmounted(() => {
  postViewTriggers.forEach((t) => t.kill())
  postViewTriggers = []
})
</script>

<template lang="pug">
article.pb-24(class="md:pb-32")
  .site-container
    .flex.items-center.justify-between(
      ref="backRowEl"
      class="opacity-0 translate-y-5"
    )
      router-link(to="/blog")
        StdButton.gap-1.rounded-full.px-3.text-sm(variant="secondary" class="py-1.5")
          span(aria-hidden="true") ←
          span {{ t('blog.back') }}
      span.font-mono.text-xs.text-site-muted {{ readingTimeLabel }}

    template(v-if="post")
      .mt-6(
        ref="contentWrapperEl"
        class="opacity-0 translate-y-7"
      )
        .flex.items-center.gap-3.text-xs.uppercase.tracking-widest.text-site-muted
          span {{ formattedDate }}
          span(aria-hidden="true") ·
          span.rounded-full.border.border-site-border(class="px-2 py-0.5") {{ post.category }}

        h1.mt-3.text-5xl.font-semibold.text-site-heading {{ post.title }}

        figure.relative.mt-8.grid.place-items-center.overflow-hidden.border.ring-1.ring-inset(
          class="rounded-[14px] aspect-[16/10] border-[var(--site-border-soft)] ring-[color-mix(in_oklab,var(--site-secondary)_18%,transparent)] bg-[var(--site-surface-soft)]"
          aria-hidden="true"
        )
          span.font-mono.text-xs.uppercase.text-site-muted(class="tracking-[0.3em] opacity-60") {{ post.category }}

        .blog-prose.mt-8.text-site-text(
          ref="proseEl"
          class="text-[1.05rem] opacity-0 translate-y-8"
          v-html="post.html"
        )

      .mt-16.border-t.border-site-border.pt-8(
        ref="moreSectionEl"
        class="opacity-0 translate-y-6"
      )
        p.mb-4.text-sm.uppercase.tracking-widest.text-site-muted {{ t('blog.moreWriting') }}
        .space-y-3
          router-link.block.text-site-secondary(
            v-for="other in otherPosts"
            :key="other.slug"
            :to="`/blog/${other.slug}`"
            class="opacity-0 translate-y-3 hover:text-site-link-hover"
          ) {{ other.title }}

    template(v-else)
      .mt-12
        h1.text-4xl.font-semibold.text-site-heading {{ t('blog.notFound') }}
        p.mt-4.text-site-muted {{ t('blog.notFoundHint') }}
</template>

<style scoped lang="scss">
// Rendered markdown prose (v-html) — :deep reaches the injected elements.
.blog-prose {
  line-height: 1.75;
}

.blog-prose :deep(p) {
  margin-top: 1.3em;
}

.blog-prose :deep(p:first-child) {
  margin-top: 0;
}

.blog-prose :deep(h2) {
  margin-top: 2em;
  margin-bottom: 0.6em;
  font-size: 1.55rem;
  font-weight: 600;
  line-height: 1.25;
  color: var(--site-heading);
}

.blog-prose :deep(h3) {
  margin-top: 1.6em;
  margin-bottom: 0.5em;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--site-heading);
}

.blog-prose :deep(ul),
.blog-prose :deep(ol) {
  margin-top: 1.3em;
  padding-left: 1.4rem;
}

.blog-prose :deep(ul) {
  list-style: disc;
}

.blog-prose :deep(ol) {
  list-style: decimal;
}

.blog-prose :deep(li) {
  margin-top: 0.45em;
}

.blog-prose :deep(li::marker) {
  color: var(--site-secondary);
}

.blog-prose :deep(a) {
  color: var(--site-link);
  text-decoration: underline;
  text-underline-offset: 0.2em;
  text-decoration-color: color-mix(in oklab, var(--site-link) 40%, transparent);
}

.blog-prose :deep(a:hover) {
  color: var(--site-link-hover);
}

.blog-prose :deep(strong) {
  font-weight: 600;
  color: var(--site-heading);
}

.blog-prose :deep(blockquote) {
  margin: 1.6em 0;
  padding-left: 1.1rem;
  border-left: 2px solid var(--site-border);
  color: var(--site-muted);
  font-style: italic;
}

.blog-prose :deep(code) {
  padding: 0.15em 0.4em;
  border-radius: 4px;
  background: color-mix(in oklab, var(--site-surface) 60%, var(--site-border));
  font-family: var(--font-mono);
  font-size: 0.875em;
}

.blog-prose :deep(pre) {
  margin: 1.6em 0;
  padding: 1rem 1.25rem;
  border: 1px solid var(--site-border);
  border-radius: 12px;
  background: var(--site-surface);
  overflow-x: auto;
}

.blog-prose :deep(pre code) {
  padding: 0;
  background: none;
  font-size: 0.85rem;
}

.blog-prose :deep(hr) {
  margin: 2.5em 0;
  border: 0;
  border-top: 1px solid var(--site-border);
}
</style>
