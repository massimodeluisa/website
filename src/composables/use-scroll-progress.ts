import { onBeforeUnmount, onMounted, ref, type Ref } from 'vue'

export const SCROLL_ANIMATION_RANGE = 80

export function useScrollProgress(range: number = SCROLL_ANIMATION_RANGE): {
  progress: Ref<number>
} {
  // MARK: - Variables
  const progress = ref(0)
  let rafId = 0

  // MARK: - Methods
  const update = () => {
    if (rafId) {
      return
    }
    rafId = requestAnimationFrame(() => {
      rafId = 0
      const p = window.scrollY / range
      progress.value = p < 0 ? 0 : p > 1 ? 1 : p
    })
  }

  // MARK: - Lifecycle
  onMounted(() => {
    update()
    window.addEventListener('scroll', update, { passive: true })
  })

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', update)
    if (rafId) {
      cancelAnimationFrame(rafId)
    }
  })

  return { progress }
}
