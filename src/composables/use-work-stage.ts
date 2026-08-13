import { computed, readonly, ref } from 'vue'

// MARK: - Variables

const index = ref(-1)
const count = ref(0)
let goTo: ((next: number) => void) | null = null

// MARK: - Methods

export function registerWorkStageNav(api: {
  count: number
  goTo: (next: number) => void
}): () => void {
  count.value = api.count
  goTo = api.goTo
  return () => {
    if (goTo !== api.goTo) {
      return
    }
    goTo = null
    index.value = -1
    count.value = 0
  }
}

export function setWorkStageIndex(next: number) {
  index.value = next
}

export function useWorkStageNav() {
  const isFullscreen = computed(() => index.value >= 0)

  const goPrev = () => {
    if (index.value < 0 || !goTo) {
      return
    }
    goTo(index.value - 1)
  }

  const goNext = () => {
    if (index.value < 0 || !goTo) {
      return
    }
    goTo(index.value + 1)
  }

  return {
    index: readonly(index),
    count: readonly(count),
    isFullscreen,
    goPrev,
    goNext,
  }
}
