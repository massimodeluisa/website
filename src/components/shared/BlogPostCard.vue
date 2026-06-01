<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

import type { PropType } from 'vue'

import { useI18n } from '@/i18n'
import type { TBlogPost } from '@/contents/blog'

const props = defineProps({
  post: { type: Object as PropType<TBlogPost>, required: true },
  compact: { type: Boolean, default: false },
})

// MARK: - Composables

const { t, locale } = useI18n()

// MARK: - Computed

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
  :to="`/blog/${post.slug}`"
  :class="compact ? 'py-[clamp(1.5rem,2.5vw,2.25rem)]' : ''"
)
  .flex.items-center.gap-6
    //- Placeholder cover (tablet+); swap for a real <img> once posts have covers.
    figure.hidden.shrink-0.w-44.overflow-hidden.rounded-lg.border.ring-1.ring-inset(
      class="md:grid md:place-items-center aspect-[16/10] border-[color-mix(in_oklab,var(--site-border)_70%,transparent)] ring-[color-mix(in_oklab,var(--site-secondary)_16%,transparent)] bg-[color-mix(in_oklab,var(--site-surface)_70%,transparent)]"
      aria-hidden="true"
    )
      span.font-mono.text-site-muted(class="text-[8px] uppercase tracking-[0.25em] opacity-50") {{ post.category }}

    .mr-auto.min-w-0
      .flex.items-center.gap-3
        span.font-mono.text-xs.uppercase.text-site-muted {{ formattedDate }}
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
