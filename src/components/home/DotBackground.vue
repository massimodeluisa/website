<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

interface IDot {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  phase: number
}

const DEFAULT_DENSITY = 0.65
const MAX_DOTS = 72
const DPR_CAP = 2

const IDLE_CONNECT_DIST = 58
const ACTIVE_CONNECT_DIST = 105
const MOUSE_INFLUENCE_RADIUS = 155

const DOT_BASE_ALPHA = 0.037
const LINK_BASE_ALPHA = 0.0125

const props = defineProps({
  active: { type: Boolean, default: undefined },
  density: { type: Number, default: undefined },
  interactive: { type: Boolean, default: undefined },
})

// MARK: - Variables
const canvas = ref<HTMLCanvasElement | null>(null)

const isReducedMotion = ref(false)
const isVisible = ref(true)
const isDocVisible = ref(true)

let ctx: CanvasRenderingContext2D | null = null
let rafId = 0
let logicalWidth = 0
let logicalHeight = 0

let dots: IDot[] = []
const mouse = { x: 0, y: 0, active: false }
let time = 0

let intersectionObserver: IntersectionObserver | null = null
let visibilityCleanup: (() => void) | null = null
let mouseCleanup: (() => void) | null = null

// MARK: - Computed
const shouldAnimate = computed(() => {
  return !isReducedMotion.value && (props.active ?? true) && isVisible.value && isDocVisible.value
})

// MARK: - Methods
const checkReducedMotion = () => {
  isReducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

const initDots = (w: number, h: number) => {
  const d = props.density ?? DEFAULT_DENSITY
  const count = Math.floor(((w * h) / 10000) * d)
  const n = Math.max(10, Math.min(MAX_DOTS, count))

  dots = Array.from({ length: n }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.155,
    vy: (Math.random() - 0.5) * 0.155,
    size: 0.75 + Math.random() * 0.9,
    phase: Math.random() * Math.PI * 2,
  }))
}

const draw = (w: number, h: number, staticMode = false) => {
  if (!ctx) {
    return
  }

  ctx.clearRect(0, 0, w, h)

  // TODO: replace raw colour '#8894a9' with a --site-* token
  const color =
    getComputedStyle(document.documentElement).getPropertyValue('--site-primary').trim() ||
    '#8894a9'

  ctx.fillStyle = color
  ctx.strokeStyle = color
  ctx.lineCap = 'round'
  ctx.lineWidth = 0.55

  const nowInteractive = !staticMode && props.interactive === true && mouse.active
  const connectDist = nowInteractive ? ACTIVE_CONNECT_DIST : IDLE_CONNECT_DIST
  const globalAlphaBoost = nowInteractive ? 1.55 : 1

  for (let i = 0; i < dots.length; i++) {
    const d = dots[i]
    if (!d) {
      continue
    }

    let effSize = d.size
    let effAlpha = DOT_BASE_ALPHA + (Math.random() - 0.5) * 0.0045

    if (!staticMode) {
      const breath = Math.sin(time * 0.62 + d.phase)
      effSize = d.size * (0.935 + 0.13 * breath)
      effAlpha *= 0.89 + 0.22 * breath
    }

    let mouseFactor = 0
    if (nowInteractive) {
      const dx = d.x - mouse.x
      const dy = d.y - mouse.y
      const dist = Math.hypot(dx, dy) || 1

      if (dist < MOUSE_INFLUENCE_RADIUS) {
        mouseFactor = 1 - dist / MOUSE_INFLUENCE_RADIUS

        const force = mouseFactor * 0.0195
        d.vx += (dx / dist) * force
        d.vy += (dy / dist) * force

        effSize *= 1 + 0.38 * mouseFactor
        effAlpha *= 1 + 0.78 * mouseFactor
      }
    }

    ctx.globalAlpha = Math.max(0.011, Math.min(0.165, effAlpha))
    ctx.beginPath()
    ctx.arc(d.x, d.y, Math.max(0.38, effSize), 0, Math.PI * 2)
    ctx.fill()

    for (let j = i + 1; j < dots.length; j++) {
      const e = dots[j]
      if (!e) {
        continue
      }

      const dx = d.x - e.x
      const dy = d.y - e.y
      const dist = Math.hypot(dx, dy)

      if (dist > 0.6 && dist < connectDist) {
        const linkAlpha = LINK_BASE_ALPHA * (1 - dist / connectDist) * globalAlphaBoost
        ctx.globalAlpha = Math.max(0.0035, Math.min(0.082, linkAlpha))
        ctx.beginPath()
        ctx.moveTo(d.x, d.y)
        ctx.lineTo(e.x, e.y)
        ctx.stroke()
      }
    }

    if (!staticMode) {
      d.x += d.vx
      d.y += d.vy

      if (d.x < 0) {
        d.x = 0
        d.vx *= -0.94
      } else if (d.x > w) {
        d.x = w
        d.vx *= -0.94
      }
      if (d.y < 0) {
        d.y = 0
        d.vy *= -0.94
      } else if (d.y > h) {
        d.y = h
        d.vy *= -0.94
      }

      d.vx *= 0.9855
      d.vy *= 0.9855

      const speed = Math.hypot(d.vx, d.vy)
      if (speed > 0.51) {
        const s = 0.51 / speed
        d.vx *= s
        d.vy *= s
      }
    }
  }
}

const startAnimation = () => {
  if (rafId || !canvas.value || !ctx) {
    return
  }
  time = 0
  rafId = requestAnimationFrame(animateLoop)
}

const stopAnimation = () => {
  if (rafId) {
    cancelAnimationFrame(rafId)
    rafId = 0
  }
}

const animateLoop = () => {
  if (!shouldAnimate.value || !canvas.value || !ctx) {
    rafId = 0
    return
  }
  time += 0.0166
  draw(logicalWidth, logicalHeight)
  rafId = requestAnimationFrame(animateLoop)
}

const updateVisibility = (visible: boolean) => {
  isVisible.value = visible
}

const handleResize = () => {
  if (!canvas.value) {
    return
  }

  const rect = canvas.value.getBoundingClientRect()
  logicalWidth = rect.width
  logicalHeight = rect.height

  const dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP)
  canvas.value.width = Math.floor(logicalWidth * dpr)
  canvas.value.height = Math.floor(logicalHeight * dpr)

  ctx = canvas.value.getContext('2d', { alpha: true })
  if (ctx) {
    ctx.scale(dpr, dpr)
  }

  initDots(logicalWidth, logicalHeight)

  if (isReducedMotion.value && ctx) {
    draw(logicalWidth, logicalHeight, true)
  }
}

const onWindowMouseMove = (e: MouseEvent) => {
  if (!props.interactive || !canvas.value || isReducedMotion.value) {
    return
  }

  const rect = canvas.value.getBoundingClientRect()
  const inside =
    e.clientX >= rect.left &&
    e.clientX <= rect.right &&
    e.clientY >= rect.top &&
    e.clientY <= rect.bottom

  if (inside) {
    mouse.x = e.clientX - rect.left
    mouse.y = e.clientY - rect.top
    mouse.active = true
  } else {
    mouse.active = false
  }
}

const onWindowMouseLeave = () => {
  mouse.active = false
}

const setupVisibilityTracking = () => {
  if (!canvas.value) {
    return
  }

  intersectionObserver = new IntersectionObserver(
    (entries) => {
      const entry = entries[0]
      if (entry) {
        updateVisibility(entry.isIntersecting)
      }
    },
    { threshold: 0.035 },
  )
  intersectionObserver.observe(canvas.value)

  const onVisChange = () => {
    isDocVisible.value = document.visibilityState === 'visible'
  }
  document.addEventListener('visibilitychange', onVisChange)

  visibilityCleanup = () => {
    document.removeEventListener('visibilitychange', onVisChange)
  }
}

const teardownVisibilityTracking = () => {
  if (intersectionObserver) {
    intersectionObserver.disconnect()
    intersectionObserver = null
  }
  if (visibilityCleanup) {
    visibilityCleanup()
    visibilityCleanup = null
  }
}

const setupMouseTracking = () => {
  if (!props.interactive) {
    return
  }

  window.addEventListener('mousemove', onWindowMouseMove, { passive: true })
  window.addEventListener('mouseleave', onWindowMouseLeave)

  mouseCleanup = () => {
    window.removeEventListener('mousemove', onWindowMouseMove)
    window.removeEventListener('mouseleave', onWindowMouseLeave)
  }
}

const teardownMouseTracking = () => {
  if (mouseCleanup) {
    mouseCleanup()
    mouseCleanup = null
  }
  mouse.active = false
}

// MARK: - Watchers
watch(shouldAnimate, (canAnimate) => {
  if (canAnimate) {
    startAnimation()
  } else {
    stopAnimation()
  }
})

// MARK: - Lifecycle
onMounted(() => {
  if (!canvas.value) {
    return
  }

  checkReducedMotion()
  isDocVisible.value = document.visibilityState === 'visible'

  handleResize()

  window.addEventListener('resize', handleResize, { passive: true })

  setupVisibilityTracking()

  if (!isReducedMotion.value && props.interactive) {
    setupMouseTracking()
  }

  if (shouldAnimate.value && !isReducedMotion.value) {
    startAnimation()
  }
})

onBeforeUnmount(() => {
  stopAnimation()
  window.removeEventListener('resize', handleResize)
  teardownVisibilityTracking()
  teardownMouseTracking()
})
</script>

<template lang="pug">
canvas.absolute.inset-0.z-0.pointer-events-none.mix-blend-multiply.dark:mix-blend-screen(
  ref="canvas"
  :class="{ 'opacity-0': !active, 'opacity-100': active }"
  class="transition-opacity duration-[280ms] ease-[ease]"
)
</template>
