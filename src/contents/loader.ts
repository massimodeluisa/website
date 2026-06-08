/*
 * Shared helpers for the markdown content loaders (blog.ts).
 * Frontmatter arrives untyped from `import.meta.glob`, so these narrow it
 * down to the concrete shapes the loaders expect.
 */

/** Derive a URL slug from a `*.md` glob path (`./blog/2026-01-foo.md` → `2026-01-foo`). */
export const slugFromPath = (path: string): string =>
  path.split('/').at(-1)?.replace(/\.md$/, '') ?? path

/** Coerce an unknown frontmatter value to a string, falling back when it is not one. */
export const asString = (value: unknown, fallback = ''): string =>
  typeof value === 'string' ? value : fallback

/** Coerce an unknown frontmatter value to a string array, dropping non-string entries. */
export const asStringArray = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : []
