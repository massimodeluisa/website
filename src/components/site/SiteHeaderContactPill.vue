<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, type RouteLocationRaw } from 'vue-router'

const props = defineProps({
  // RouteLocationRaw is string | object; [String, Object] covers both at runtime.
  to: { type: [String, Object] as unknown as () => RouteLocationRaw, required: true },
  label: { type: String, required: true },
  active: { type: Boolean, default: false },
})

const TRAIL_COUNT = 20
const TRAIL_DELAY_S = 0.03

// MARK: - Computed

// Per-particle CSS variables driving the comet head→tail gradient + glow.
const trailParticles = computed(() =>
  Array.from({ length: TRAIL_COUNT }, (_, i) => {
    const t = i / (TRAIL_COUNT - 1)
    const delay = -(TRAIL_COUNT - 1 - i) * TRAIL_DELAY_S
    return {
      i,
      style: {
        '--size': '2px',
        '--opacity': `${1 - t * 0.9}`,
        '--core': `color-mix(in oklab, #fff, var(--site-secondary) ${Math.round(t * 100)}%)`,
        '--glow-w': `${(1 - t) * 3}px`,
        '--glow-s': `${8 - t * 7.5}px`,
        'animation-delay': `${delay}s`,
      } as Record<string, string>,
    }
  }),
)
</script>

<template lang="pug">
RouterLink.ouroboros-pill.inline-flex.min-h-10.items-center.rounded-full.border.px-4.py-2.text-sm.font-medium.transition-all(
  :to="props.to"
  class="border-site-secondary hover:bg-site-secondary hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-site-secondary"
  :class="active ? 'text-site-secondary' : 'text-site-heading'"
)
  span.ouroboros-pill-trail(
    v-for="p in trailParticles"
    :key="p.i"
    :style="p.style"
    aria-hidden="true"
  )
  span.relative {{ props.label }}
</template>

<style scoped lang="scss">
/* Comet orbit: each particle animates offset-distance with a staggered delay. */
@keyframes orbit-comet {
  from {
    offset-distance: 0%;
  }
  to {
    offset-distance: 100%;
  }
}

.ouroboros-pill {
  position: relative;
  isolation: isolate;
  transition:
    background-color 0.25s ease,
    color 0.25s ease,
    border-color 0.25s ease,
    box-shadow 0.35s ease;
}

/* Hover: freeze the particles, fade them out, and radiate the halo from the pill. */
.ouroboros-pill:hover {
  box-shadow:
    0 0 12px 0 var(--site-secondary),
    0 0 26px 2px color-mix(in oklab, var(--site-secondary) 55%, transparent),
    0 0 52px 4px color-mix(in oklab, var(--site-secondary) 28%, transparent),
    0 0 96px 8px color-mix(in oklab, var(--site-secondary) 12%, transparent);
}

.ouroboros-pill:hover .ouroboros-pill-trail {
  --hover-mul: 0;
  animation-play-state: paused;
}

.ouroboros-pill-trail {
  position: absolute;
  top: 0;
  left: 0;
  width: var(--size, 1px);
  height: var(--size, 1px);
  border-radius: 50%;
  background: var(--core, #fff);
  opacity: calc(var(--opacity, 1) * var(--hover-mul, 1));
  transition: opacity 0.3s ease;
  /* Layered glow: white core, bronze ring, mid + soft halo (spread keeps it visible). */
  box-shadow:
    0 0 var(--glow-w, 3px) 0 #fff,
    0 0 3px 1px var(--site-secondary),
    0 0 var(--glow-s, 8px) 0.5px var(--site-secondary),
    0 0 calc(var(--glow-s, 8px) * 1.8) 0 color-mix(in oklab, var(--site-secondary) 28%, transparent);
  /* inset(0.5px) rides the comet on the centre of the 1px border, not outside it. */
  offset-path: inset(0.5px round 999px);
  offset-distance: 0%;
  offset-anchor: center;
  offset-rotate: 0deg;
  animation: orbit-comet 3.6s linear infinite;
  pointer-events: none;
  z-index: 0;
}

@media (prefers-reduced-motion: reduce) {
  .ouroboros-pill-trail {
    display: none;
  }
}
</style>
