<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

import type { PropType } from 'vue'

import { useLocale } from '@/composables/use-locale'
import { useI18n } from '@/i18n'
import type { TBlogPost } from '@/contents/blog'

const props = defineProps({
  post: { type: Object as PropType<TBlogPost>, required: true },
  compact: { type: Boolean, default: false },
})

// MARK: - Composables

const { t, locale } = useI18n()
const { localePath } = useLocale()

// MARK: - Computed

const postPath = computed(() => localePath(`/blog/${props.post.slug}`))

// Format date using the active locale so dates render in the reader's language.
const formattedDate = computed(() =>
  new Date(props.post.date).toLocaleDateString(locale.value, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }),
)
</script>

<template lang="pug">
RouterLink.block.group.transition-colors(
  :to="postPath"
  :class="compact ? 'py-[clamp(1.5rem,2.5vw,2.25rem)]' : ''"
)
  .flex.items-center.gap-6
    //- Placeholder cover (tablet+); swap for a real <img> once posts have covers.
    figure.hidden.shrink-0.w-44.overflow-hidden.rounded-lg.border(
      class="md:grid aspect-[1200/630] border-[var(--site-border-soft)] bg-[var(--site-surface-soft)]"
      :aria-hidden="!post.cover"
    )
      img.h-full.w-full.object-cover(v-if="post.cover" :src="post.cover" :alt="post.coverAlt || post.title")
      span.grid.place-items-center.font-mono.text-site-muted(v-else class="text-[8px] uppercase tracking-[0.25em] opacity-50") {{ post.category }}

    .mr-auto.min-w-0
      .flex.items-center.gap-3
        time.font-mono.text-xs.uppercase.text-site-muted(:datetime="post.date") {{ formattedDate }}
        span.px-2.py-px.rounded-full.border.border-site-border.text-site-muted(class="text-[10px]") {{ post.category }}

      h3.font-semibold.text-site-heading.transition-colors(
        :class="compact ? 'mt-1 text-xl group-hover:text-site-link-hover' : 'mt-1.5 text-3xl group-hover:text-site-link-hover'"
      ) {{ post.title }}

      p.text-site-muted.leading-relaxed(:class="compact ? 'mt-1 text-sm' : 'mt-1.5'") {{ post.excerpt }}

      .text-sm.text-site-secondary.transition-colors(
        :class="compact ? 'mt-1.5' : 'mt-2'"
        class="group-hover:text-site-link-hover"
      ) {{ t('blog.readMore') }} · {{ post.readingTime }} {{ t('blog.minutes') }}

    span.shrink-0.self-center.font-mono.text-xl.text-site-muted.transition-transform(
      class="group-hover:translate-x-1 group-hover:text-site-link-hover"
      aria-hidden="true"
    ) →
</template>
