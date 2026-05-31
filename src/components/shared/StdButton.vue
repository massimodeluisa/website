<script setup lang="ts">
import { computed, type PropType } from 'vue'

type TStdButtonVariant = 'primary' | 'secondary' | 'ghost'

/*
 * Shared structure + a11y. Shape (rounded-*) and size (px/py/min-h) stay on the
 * caller so a `rounded-xl` consumer never collides with a baked-in `rounded-full`.
 */
const BASE_CLASS =
  'inline-flex cursor-pointer items-center justify-center font-medium transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-site-secondary'

const VARIANT_CLASS: Record<TStdButtonVariant, string> = {
  primary:
    'bg-site-heading text-site-background hover:bg-site-secondary hover:text-white active:scale-[0.985]',
  secondary:
    'border border-site-border text-site-heading hover:border-site-secondary hover:text-site-link-hover',
  ghost:
    'border border-transparent text-site-muted hover:border-site-border hover:text-site-heading',
}

const props = defineProps({
  variant: { type: String as PropType<TStdButtonVariant>, default: 'primary' },
})

// MARK: - Computed

const buttonClass = computed(() => `${BASE_CLASS} ${VARIANT_CLASS[props.variant]}`)
</script>

<template lang="pug">
button(type="button" :class="buttonClass")
  slot
</template>
