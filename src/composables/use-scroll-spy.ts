import { onBeforeUnmount, onMounted, readonly, ref } from 'vue'

// MARK: - Variables

/*
 * Section is "active" when its top crosses this fraction of the viewport
 * height (measured from the top of the viewport). 0.25 = a section becomes
 * the URL hash when its top is in the upper quarter of the screen.
 */
const FOCUS_RATIO = 0.25

// MARK: - Types

interface IScrollSpyOptions {
  /** Section element IDs in DOM order, top-to-bottom. */
  ids: string[]
}

// MARK: - Variables

/*
 * Shared reactive id of the section anchored at the top of the viewport.
 * useScrollSpy writes it; the header nav reads it to highlight the active link.
 * (The spy rewrites the hash via replaceState, which vue-router does not
 * observe, so a reactive ref is needed rather than route.hash.)
 */
const activeSectionId = ref('')

// MARK: - Composable

export function useActiveSection() {
  return { activeSection: readonly(activeSectionId) }
}

/**
 * Watches a list of section elements while the user scrolls and rewrites the
 * URL hash to match the section currently sitting at the top of the viewport.
 * Uses `history.replaceState` (not push) so the back/forward stack stays
 * clean — scrolling is not a navigation event.
 */
export function useScrollSpy({ ids }: IScrollSpyOptions): void {
  let rafId = 0
  let currentId = ''

  const updateActive = () => {
    rafId = 0
    const viewport = window.innerHeight
    const focusY = viewport * FOCUS_RATIO

    let activeId = ids[0]

    /*
     * Scroll-end guard: when the page can't scroll any further down, the
     * last section is the user's intended destination even if it's shorter
     * than the viewport and earlier sections still cover the focus line.
     * Without this, clicking #contact on a tall screen would land at bottom
     * but the URL would snap back to whichever section sits in the upper
     * quarter of the viewport (typically #blog or #work).
     */
    const docHeight = document.documentElement.scrollHeight
    const atScrollEnd = window.scrollY + viewport >= docHeight - 4

    if (atScrollEnd) {
      activeId = ids[ids.length - 1]
    } else {
      /*
       * Pick the LAST section whose top has crossed the focus line — i.e.
       * the deepest section currently anchored in the upper viewport.
       * Iteration depends on `ids` being given in DOM order.
       */
      for (const id of ids) {
        const el = document.getElementById(id)
        if (!el) {
          continue
        }
        const rect = el.getBoundingClientRect()
        if (rect.top <= focusY) {
          activeId = id
        } else {
          break
        }
      }
    }

    if (!activeId || activeId === currentId) {
      return
    }
    currentId = activeId
    activeSectionId.value = activeId

    const target = `#${activeId}`
    if (window.location.hash === target) {
      return
    }

    const url = `${window.location.pathname}${window.location.search}${target}`
    window.history.replaceState(window.history.state, '', url)
  }

  const onScroll = () => {
    if (rafId) {
      return
    }
    rafId = requestAnimationFrame(updateActive)
  }

  onMounted(() => {
    requestAnimationFrame(updateActive)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
  })

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', onScroll)
    if (rafId) {
      cancelAnimationFrame(rafId)
    }
  })
}
