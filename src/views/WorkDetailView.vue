<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import gsap from 'gsap'

import WorkGallery from '@/components/work/WorkGallery.vue'
import WorkShowcase from '@/components/work/WorkShowcase.vue'
import StdButton from '@/components/shared/StdButton.vue'
import { useLocale } from '@/composables/use-locale'
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
import { useTextReveal } from '@/composables/use-text-reveal'
import { workBySlug, workNeighbors } from '@/contents/works'
import { useI18n } from '@/i18n'
import { prefersReducedMotion } from '@/utils/motion'

// MARK: - Constants

const BACK_REVEAL_DURATION = 0.5
const TITLE_REVEAL_DURATION = 0.85
const META_REVEAL_DURATION = 0.6
const INTRO_REVEAL_DELAY = 0.35

// MARK: - Composables

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const { current } = useLocale()
const { revealWords, cleanupAll } = useTextReveal()

// MARK: - Variables

const backEl = ref<HTMLElement | null>(null)
const titleEl = ref<HTMLElement | null>(null)
const metaEl = ref<HTMLElement | null>(null)
const introEl = ref<HTMLElement | null>(null)

let entranceTl: gsap.core.Timeline | undefined

// MARK: - Computed

const slug = computed(() => String(route.params.slug ?? ''))
const work = computed(() => workBySlug(slug.value, current.value))
const neighbors = computed(() => workNeighbors(slug.value, current.value))
const transitionName = computed(() => `work-title-${slug.value}`)

const coverImages = computed(() => work.value?.showcase ?? [])

const workUrl = computed(() => `${SITE_URL}/work/${slug.value}`)

usePageSeo({
  title: () => work.value?.seoTitle ?? work.value?.title ?? t('workDetail.notFound'),
  description: () => work.value?.seoDescription ?? work.value?.summary ?? '',
  type: 'article',
  imageAlt: () => work.value?.title ?? '',
  section: () => work.value?.role,
  robots: work.value ? undefined : 'noindex, follow',
})
useJsonLd(() => ({
  '@context': 'https://schema.org',
  '@graph': [
    personEntity(),
    websiteEntity(),
    {
      '@type': 'CreativeWork',
      '@id': `${workUrl.value}/#work`,
      name: work.value?.title,
      description: work.value?.seoDescription ?? work.value?.summary,
      url: workUrl.value,
      inLanguage: current.value,
      image: `${SITE_URL}/og/work/${slug.value}.jpg`,
      creator: { '@id': PERSON_ID },
      author: { '@id': PERSON_ID },
      isPartOf: { '@id': WEBSITE_ID },
    },
  ],
}))
useBreadcrumbLd(() => [
  [t('nav.home'), SITE_URL],
  [t('nav.work'), `${SITE_URL}/#work`],
  [work.value?.title ?? '', workUrl.value],
])

// MARK: - Methods

function runEntrance() {
  if (!titleEl.value) {
    return
  }
  if (prefersReducedMotion()) {
    gsap.set(
      [backEl.value, titleEl.value, metaEl.value, introEl.value].filter(Boolean) as HTMLElement[],
      { opacity: 1, y: 0, clearProps: 'transform' },
    )
    return
  }

  entranceTl?.kill()
  entranceTl = gsap.timeline({ defaults: { ease: 'power3.out' } })

  if (backEl.value) {
    entranceTl.fromTo(
      backEl.value,
      { opacity: 0, y: -16 },
      { opacity: 1, y: 0, duration: BACK_REVEAL_DURATION },
      0,
    )
  }

  entranceTl.fromTo(
    titleEl.value,
    { opacity: 0, yPercent: 18, scale: 0.96 },
    { opacity: 1, yPercent: 0, scale: 1, duration: TITLE_REVEAL_DURATION },
    0.05,
  )

  if (metaEl.value) {
    entranceTl.fromTo(
      metaEl.value,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: META_REVEAL_DURATION },
      0.25,
    )
  }

  if (introEl.value) {
    nextTick(() => {
      if (introEl.value) {
        revealWords(introEl.value, { scrollTrigger: false, delay: INTRO_REVEAL_DELAY })
      }
    })
  }
}

function refreshReveals() {
  cleanupAll()
  nextTick(() => {
    runEntrance()
  })
}

const goPrev = () => {
  if (neighbors.value.previous) {
    router.push({ name: 'work', params: { slug: neighbors.value.previous.slug } })
  }
}

const goNext = () => {
  if (neighbors.value.next) {
    router.push({ name: 'work', params: { slug: neighbors.value.next.slug } })
  }
}

// MARK: - Watchers

watch(slug, () => refreshReveals())

// MARK: - Lifecycle

onMounted(() => {
  runEntrance()
})

onUnmounted(() => {
  entranceTl?.kill()
})
</script>

<template lang="pug">
article.work-detail.relative.bg-site-background.text-site-text(
  class="pb-16"
)
  .site-container
    .opacity-0(ref="backEl")
      router-link(to="/#work")
        StdButton.gap-1.rounded-full.px-3.text-sm(variant="secondary" class="py-1.5")
          span(aria-hidden="true") ←
          span {{ t('workDetail.back') }}

    template(v-if="work")
      h1.font-sans.mt-6.font-semibold.leading-none.text-site-heading.opacity-0(
        ref="titleEl"
        :style="{ viewTransitionName: transitionName }"
        class="text-[clamp(3rem,10vw,9rem)] tracking-[-0.02em]"
      ) {{ work.title }}

      .mt-8.opacity-0(ref="metaEl")
        p.font-mono.text-xs.uppercase.text-site-secondary(class="tracking-[0.22em]") {{ work.eyebrow }}
        p.mt-2.text-sm.text-site-muted {{ work.period }} · {{ work.role }}

      p.mt-10.max-w-3xl.text-lg.text-site-text.opacity-0(
        ref="introEl"
        class="leading-relaxed"
      ) {{ work.summary }}

      .mt-10.relative
        figure.relative.overflow-hidden(
          class="aspect-[16/10] rounded-[20px] border border-[var(--site-border-soft)] bg-[color-mix(in_oklab,var(--site-surface)_65%,transparent)]"
        )
          WorkShowcase(:images="coverImages" :label="work.title")
        a.absolute.z-10.inline-flex.items-center.gap-1.rounded-full.bg-site-heading.font-medium.text-site-background.no-underline.transition-all(
          v-if="work.href"
          :href="work.href"
          target="_blank"
          rel="noopener noreferrer"
          class="bottom-3 right-3 px-3 py-1 text-xs hover:bg-site-secondary hover:text-white"
        ) {{ t('workDetail.visit') }}

      .work-detail-grid.mt-16(class="lg:grid lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-16")
        .work-detail-prose.prose.prose-sm.max-w-none.text-site-text(
          v-html="work.html"
        )

        aside.work-detail-aside.mt-12(class="lg:mt-0 lg:sticky lg:top-32 lg:self-start")
          section(v-if="work.highlights.length")
            p.font-mono.text-xs.uppercase.tracking-widest.text-site-secondary.mb-3 {{ t('workDetail.highlights') }}
            ul.space-y-2.text-sm
              li.flex.gap-2(v-for="h in work.highlights" :key="h")
                span.text-site-secondary.block.w-1.h-1.rounded-full.bg-current.shrink-0(class="mt-1.5")
                span {{ h }}

          section.mt-10(v-if="work.stack.length")
            p.font-mono.text-xs.uppercase.tracking-widest.text-site-secondary.mb-3 {{ t('workDetail.stack') }}
            .flex.flex-wrap.gap-2
              span.inline-block.whitespace-nowrap.rounded-full.border.border-site-border.font-mono.text-site-muted(
                v-for="s in work.stack"
                :key="s"
                class="px-[10px] py-[2px] text-[11px]"
              ) {{ s }}

          section.mt-10(v-if="work.sourceUrls.length")
            p.font-mono.text-xs.uppercase.tracking-widest.text-site-secondary.mb-3 {{ t('workDetail.sources') }}
            ul.space-y-2.text-sm
              li(v-for="url in work.sourceUrls" :key="url")
                //- TODO: add aria-label="<url> (opens in new tab)" once i18n wrapping for dynamic external links is decided
                a.block.break-all.text-site-muted.transition-colors(
                  :href="url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="hover:text-site-heading"
                ) {{ url }}

      section.mt-20(v-if="work.gallery.length")
        p.font-mono.text-xs.uppercase.tracking-widest.text-site-secondary.mb-6 {{ t('workDetail.gallery') }}
        WorkGallery(:images="work.gallery" :label="work.title")

      nav.work-detail-nav.mt-16.flex.items-center.justify-between.gap-4(class="md:gap-6")
        button.text-left.text-sm.text-site-muted.transition-colors(
          v-if="neighbors.previous"
          type="button"
          class="hover:text-site-heading"
          @click="goPrev"
        )
          p.font-mono.text-xs.uppercase.tracking-widest.text-site-secondary {{ t('work.previous') }}
          p.mt-1.text-base.text-site-heading ← {{ neighbors.previous.title }}

        span(v-else)

        button.text-right.text-sm.text-site-muted.transition-colors(
          v-if="neighbors.next"
          type="button"
          class="hover:text-site-heading"
          @click="goNext"
        )
          p.font-mono.text-xs.uppercase.tracking-widest.text-site-secondary {{ t('work.next') }}
          p.mt-1.text-base.text-site-heading {{ neighbors.next.title }} →

    template(v-else)
      .pt-24
        p.font-mono.text-xs.uppercase.tracking-widest.text-site-secondary {{ t('workDetail.notFound') }}
        p.mt-3.text-site-muted {{ t('workDetail.notFoundHint') }}
        router-link.mt-6.inline-block.text-site-secondary.transition-colors(
          to="/"
          class="hover:text-site-link-hover"
        ) {{ t('workDetail.backHome') }}
</template>

<style scoped lang="scss">
/* Markdown body is styled by Tailwind Typography (`prose`), themed in
   tailwind.css. Drop the inline-code backtick quotes for a cleaner read. */
.work-detail-prose :deep(code)::before,
.work-detail-prose :deep(code)::after {
  content: '';
}
</style>
