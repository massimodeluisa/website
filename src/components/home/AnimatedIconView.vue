<script setup lang="ts">
import { gsap } from 'gsap'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

type TIconVariant = 'idea' | 'laptop' | 'ai'

const props = defineProps({
  variant: { type: String as () => TIconVariant, required: true },
  title: { type: String, required: true },
})

// MARK: - Variables

const rootEl = ref<SVGSVGElement | null>(null)
let timeline: gsap.core.Timeline | undefined

// MARK: - Computed

const variantClass = computed(() => `animated-icon-view--${props.variant}`)

// MARK: - Methods

const clearAnimation = () => {
  timeline?.kill()
  timeline = undefined
}

const shouldReduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

const setupAnimation = () => {
  const root = rootEl.value
  if (!root) {
    return
  }

  clearAnimation()
  gsap.set(root.querySelectorAll('[data-animated]'), { clearProps: 'all' })

  if (shouldReduceMotion()) {
    return
  }

  const q = gsap.utils.selector(root)
  timeline = gsap.timeline({
    repeat: -1,
    defaults: {
      duration: 1.25,
      ease: 'sine.inOut',
    },
  })

  if (props.variant === 'idea') {
    timeline
      .to(q('[data-bulb]'), { y: -5, scale: 1.03, transformOrigin: '80px 78px' }, 0)
      .to(q('[data-rays]'), { opacity: 1, rotate: 6, transformOrigin: '80px 80px' }, 0)
      .to(q('[data-glow]'), { opacity: 0.48, scale: 1.14, transformOrigin: '80px 80px' }, 0)
      .to(q('[data-filament]'), { strokeDashoffset: -18 }, 0)
      .to({}, { duration: 0.12 })
      .to(q('[data-bulb]'), { y: 0, scale: 1 }, 1.25)
      .to(q('[data-rays]'), { opacity: 0.42, rotate: -4 }, 1.25)
      .to(q('[data-glow]'), { opacity: 0.08, scale: 0.98 }, 1.25)
      .to(q('[data-filament]'), { strokeDashoffset: 0 }, 1.25)
    return
  }

  if (props.variant === 'laptop') {
    timeline
      .to(q('[data-screen]'), { y: -3, transformOrigin: '80px 84px' }, 0)
      .to(q('[data-chart]'), { strokeDashoffset: -92 }, 0)
      .to(q('[data-cursor]'), { x: 46, y: -26, scale: 1.16, transformOrigin: 'center' }, 0)
      .to(q('[data-glow]'), { opacity: 0.5, scaleX: 1.08, transformOrigin: '80px 86px' }, 0)
      .to({}, { duration: 0.16 })
      .to(q('[data-screen]'), { y: 0 }, 1.25)
      .to(q('[data-chart]'), { strokeDashoffset: 0 }, 1.25)
      .to(q('[data-cursor]'), { x: 0, y: 0, scale: 1 }, 1.25)
      .to(q('[data-glow]'), { opacity: 0.12, scaleX: 0.96 }, 1.25)
    return
  }

  timeline
    .to(q('[data-core]'), { scale: 1.08, transformOrigin: '80px 80px' }, 0)
    .to(q('[data-chip]'), { rotate: 4, transformOrigin: '80px 80px' }, 0)
    .to(q('[data-nodes]'), { opacity: 1, scale: 1.08, transformOrigin: '80px 80px' }, 0)
    .to(q('[data-pulse]'), { opacity: 0.52, scale: 1.22, transformOrigin: '80px 80px' }, 0)
    .to({}, { duration: 0.12 })
    .to(q('[data-core]'), { scale: 1 }, 1.25)
    .to(q('[data-chip]'), { rotate: -4 }, 1.25)
    .to(q('[data-nodes]'), { opacity: 0.62, scale: 0.98 }, 1.25)
    .to(q('[data-pulse]'), { opacity: 0.06, scale: 0.94 }, 1.25)
}

// MARK: - Watchers

watch(() => props.variant, setupAnimation)

// MARK: - Lifecycle

onMounted(setupAnimation)
onBeforeUnmount(clearAnimation)
</script>

<template lang="pug">
svg.block.h-full.w-full.overflow-visible(
  ref="rootEl"
  :aria-label="title"
  :class="variantClass"
  role="img"
  viewBox="0 0 160 160"
)
  g(v-if="variant === 'idea'" data-animated)
    circle.icon-glow(data-glow cx="80" cy="74" r="46")
    g.icon-rays(data-rays)
      path(d="M80 18v-12")
      path(d="M112 30l9-9")
      path(d="M130 64h13")
      path(d="M48 30l-9-9")
      path(d="M30 64H17")
    g(data-bulb)
      path.icon-line(d="M110 72c0-17-13-31-30-31S50 55 50 72c0 11 6 20 15 26 5 4 7 8 7 14h16c0-6 2-10 7-14 9-6 15-15 15-26Z")
      path.icon-accent(data-filament d="M67 78c7-7 19-7 26 0M72 88h16")
      path.icon-line(d="M68 116h24M70 126h20M74 136h12")
  g(v-else-if="variant === 'laptop'" data-animated)
    path.icon-glow(data-glow d="M42 112h76")
    g(data-screen)
      rect.icon-line(x="39" y="42" width="82" height="68" rx="6")
      path.icon-line(d="M28 120h104l-10 12H38l-10-12Z")
      path.icon-line(d="M68 120h24")
      path.icon-accent(data-chart d="M54 91 70 76 86 88 109 61")
      circle.icon-dot(data-cursor cx="54" cy="91" r="4")
  g(v-else data-animated)
    circle.icon-glow(data-pulse cx="80" cy="80" r="54")
    g(data-chip)
      rect.icon-line(x="54" y="54" width="52" height="52" rx="8")
      path.icon-line(d="M44 62h10M44 78h10M44 94h10M106 62h10M106 78h10M106 94h10M62 44v10M78 44v10M94 44v10M62 106v10M78 106v10M94 106v10")
      g(data-core)
        path.icon-accent(d="M69 91V69M91 91V69M69 80h22")
        path.icon-line(d="M64 94h32")
    g.icon-nodes(data-nodes)
      circle(cx="35" cy="78" r="5")
      circle(cx="125" cy="78" r="5")
      circle(cx="80" cy="32" r="5")
      circle(cx="80" cy="128" r="5")
</template>

<style scoped>
.icon-line,
.icon-accent,
.icon-rays path {
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 7;
}

.icon-line,
.icon-rays path { stroke: var(--site-heading); }

.icon-accent,
.icon-dot,
.icon-nodes circle { stroke: var(--site-secondary); }

.icon-dot,
.icon-nodes circle {
  fill: color-mix(in oklab, var(--site-secondary) 18%, white); // TODO: 'white' is a raw colour — replace with token
  stroke-width: 5;
}

.icon-glow {
  fill: color-mix(in oklab, var(--site-secondary) 16%, transparent);
  opacity: 0.08;
}

.icon-rays { opacity: 0.42; }
.icon-nodes { opacity: 0.62; }

.animated-icon-view--idea [data-filament],
.animated-icon-view--laptop [data-chart] { stroke-dasharray: 48 18; }
</style>
