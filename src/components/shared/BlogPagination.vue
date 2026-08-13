<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

import { useI18n } from '@/i18n'

const props = defineProps({
  current: { type: Number, required: true },
  total: { type: Number, required: true },
  basePath: { type: String, required: true },
  compact: { type: Boolean, default: false },
})

// MARK: - Composables

const { t } = useI18n()

// MARK: - Computed

const currentLabel = computed(() => String(props.current).padStart(2, '0'))
const totalLabel = computed(() => String(props.total).padStart(2, '0'))
const hasPrev = computed(() => props.current > 1)
const hasNext = computed(() => props.current < props.total)

const prevTo = computed(() => pageTo(props.current - 1))
const nextTo = computed(() => pageTo(props.current + 1))

// MARK: - Methods

function pageTo(page: number) {
  return page <= 1 ? { path: props.basePath, query: {} } : { path: props.basePath, query: { page } }
}
</script>

<template lang="pug">
nav.flex.items-center.gap-3(
  :aria-label="t('blog.paginationLabel')"
  :class="compact ? 'shrink-0' : 'justify-between border-t border-site-border pt-8'"
)
  RouterLink.inline-flex.items-center.justify-center.rounded-full.font-mono.transition-colors(
    v-if="hasPrev"
    :to="prevTo"
    :aria-label="t('blog.paginationPrev')"
    :class="compact ? 'size-8 text-xs' : 'min-h-10 px-4 text-sm'"
    class="border border-site-border text-site-heading hover:border-site-secondary hover:text-site-link-hover"
  ) ←
  span.inline-flex.size-8.items-center.justify-center.rounded-full.border.border-site-border.font-mono.text-xs.text-site-muted.opacity-40(
    v-else
    aria-hidden="true"
  ) ←

  p.font-mono.text-site-muted(
    :class="compact ? 'text-[10px] tracking-widest' : 'text-xs tracking-[0.18em]'"
  )
    span.text-site-heading {{ currentLabel }}
    span.opacity-50  / 
    span {{ totalLabel }}

  RouterLink.inline-flex.items-center.justify-center.rounded-full.font-mono.transition-colors(
    v-if="hasNext"
    :to="nextTo"
    :aria-label="t('blog.paginationNext')"
    :class="compact ? 'size-8 text-xs' : 'min-h-10 px-4 text-sm'"
    class="border border-site-border text-site-heading hover:border-site-secondary hover:text-site-link-hover"
  ) →
  span.inline-flex.size-8.items-center.justify-center.rounded-full.border.border-site-border.font-mono.text-xs.text-site-muted.opacity-40(
    v-else
    aria-hidden="true"
  ) →
</template>
