import { onBeforeUnmount, onMounted, ref, type Ref } from 'vue'

export function useReadingProgress(): { progress: Ref<number> } {
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
      const root = document.documentElement
      const max = root.scrollHeight - root.clientHeight
      if (max <= 0) {
        progress.value = 0
        return
      }
      const next = window.scrollY / max
      progress.value = next < 0 ? 0 : next > 1 ? 1 : next
    })
  }

  // MARK: - Lifecycle

  onMounted(() => {
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update, { passive: true })
  })

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', update)
    window.removeEventListener('resize', update)
    if (rafId) {
      cancelAnimationFrame(rafId)
    }
  })

  return { progress }
}
