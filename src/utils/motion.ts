// Pure, SSR-safe motion helpers shared across components and composables.

/**
 * True when the user has asked the OS for reduced motion. SSR-safe: returns
 * `false` when there is no `window` (e.g. during the vite-ssg pre-render),
 * so animations simply run on the client and never throw on the server.
 */
export const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
