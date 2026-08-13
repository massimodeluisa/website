<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

import StdButton from '@/components/shared/StdButton.vue'
import BlogPagination from '@/components/shared/BlogPagination.vue'
import { useLocale } from '@/composables/use-locale'
import { useReadingProgress } from '@/composables/use-reading-progress'
import { blogPageCount, parseBlogPage } from '@/contents/blog'
import { useI18n } from '@/i18n'

const props = defineProps({
  headerProgress: { type: Number, required: true },
})

// MARK: - Composables

const route = useRoute()
const { t } = useI18n()
const { localePath } = useLocale()
const { progress: readingProgress } = useReadingProgress()

// MARK: - Computed

const routeName = computed(() => String(route.name ?? ''))
const isPost = computed(
  () =>
    routeName.value === 'blogPost' ||
    routeName.value === 'locale.blogPost' ||
    routeName.value === 'article' ||
    routeName.value === 'locale.article',
)
const isListing = computed(
  () =>
    routeName.value === 'blog' ||
    routeName.value === 'locale.blog' ||
    routeName.value === 'articles' ||
    routeName.value === 'locale.articles',
)
const isActive = computed(() => isListing.value || isPost.value)
const isDetached = computed(() => props.headerProgress > 0.45)

const backTo = computed(() => (isPost.value ? localePath('/blog') : localePath('/')))
const backLabel = computed(() => (isPost.value ? t('blog.back') : t('blog.backHome')))

const listPath = computed(() => route.path)
const currentPage = computed(() => parseBlogPage(route.query.page))
const totalPages = computed(() => blogPageCount())
const readingPercent = computed(() => Math.round(readingProgress.value * 100))
const readingWidth = computed(() => `${readingPercent.value}%`)
</script>

<template lang="pug">
.site-utility(
  v-if="isActive"
  :class="{ 'is-detached': isDetached }"
  :aria-hidden="!isDetached"
)
  .site-utility-inner.relative.overflow-hidden.border
    .relative.z-10.flex.items-center.justify-between.gap-3(class="px-2 py-1.5 sm:px-2.5")
      RouterLink.shrink-0(:to="backTo" :tabindex="isDetached ? 0 : -1")
        StdButton.gap-1.rounded-full.px-3.text-sm(variant="secondary" class="py-1.5")
          span(aria-hidden="true") ←
          span {{ backLabel }}

      BlogPagination(
        v-if="isListing"
        compact
        :current="currentPage"
        :total="totalPages"
        :base-path="listPath"
      )

    .site-utility-fill.absolute.inset-y-0.left-0.z-20.overflow-hidden.pointer-events-none.bg-site-secondary(
      v-if="isPost"
      role="progressbar"
      :aria-label="t('blog.readingProgress')"
      :aria-valuenow="readingPercent"
      aria-valuemin="0"
      aria-valuemax="100"
      :style="{ width: readingWidth }"
      class="transition-[width] duration-150 ease-linear motion-reduce:transition-none"
    )
      .flex.h-full.items-center(class="w-[100cqi] px-2 py-1.5 sm:px-2.5" aria-hidden="true")
        span.inline-flex.items-center.justify-center.gap-1.rounded-full.border.border-transparent.px-3.text-sm.font-medium.text-white(class="py-1.5")
          span ←
          span {{ backLabel }}
</template>

<style scoped lang="scss">
.site-utility {
  pointer-events: none;
  opacity: 0;
  transform: translateY(-6px);
  margin-top: 0;
  max-height: 0;
  overflow: hidden;
  transition:
    opacity 0.22s ease,
    transform 0.22s ease,
    margin-top 0.22s ease,
    max-height 0.22s ease;
}

.site-utility.is-detached {
  pointer-events: auto;
  opacity: 1;
  transform: translateY(0);
  margin-top: calc(var(--spacing) * 2);
  max-height: 5rem;
}

@media (prefers-reduced-motion: reduce) {
  .site-utility {
    transition: opacity 0.15s ease;
    transform: none;
  }
}

.site-utility-inner {
  container-type: inline-size;
  border-color: var(--site-border);
  border-radius: calc(var(--spacing) * 4);
  background: color-mix(in oklab, var(--site-background) 88%, transparent);
  backdrop-filter: blur(16px);
}
</style>
