import { asString, slugFromPath } from './loader'

// MARK: - Types

type TBlogFrontmatter = {
  title?: string
  date?: string
  category?: string
  excerpt?: string
  readingTime?: number
  cover?: string
  coverAlt?: string
}

type TMarkdownBlogModule = {
  attributes: TBlogFrontmatter
  html: string
}

export type TBlogPost = {
  slug: string
  title: string
  date: string
  category: string
  excerpt: string
  readingTime: number
  cover?: string
  coverAlt?: string
  html: string
}

// MARK: - Data

const contentFiles = import.meta.glob('./blog/*.md', { eager: true }) as Record<
  string,
  TMarkdownBlogModule
>

export const blogPosts: TBlogPost[] = Object.entries(contentFiles)
  .map(([path, module]) => {
    const frontmatter = module.attributes
    const slug = slugFromPath(path)

    return {
      slug,
      title: asString(frontmatter.title, slug),
      date: asString(frontmatter.date, '2026-01-01'),
      category: asString(frontmatter.category, 'tech'),
      excerpt: asString(frontmatter.excerpt),
      readingTime: Number(frontmatter.readingTime ?? 5),
      cover: asString(frontmatter.cover) || undefined,
      coverAlt: asString(frontmatter.coverAlt) || undefined,
      html: module.html,
    }
  })
  .sort((a, b) => b.date.localeCompare(a.date))

/* Keep the first page large enough that every live post is crawlable without ?page=. */
export const BLOG_PAGE_SIZE = 12

export function blogPageCount(size: number = BLOG_PAGE_SIZE): number {
  return Math.max(1, Math.ceil(blogPosts.length / size))
}

export function blogPostsForPage(page: number, size: number = BLOG_PAGE_SIZE): TBlogPost[] {
  const total = blogPageCount(size)
  const safe = Math.min(total, Math.max(1, page))
  const start = (safe - 1) * size
  return blogPosts.slice(start, start + size)
}

export function parseBlogPage(raw: unknown): number {
  const value = Array.isArray(raw) ? raw[0] : raw
  const parsed = Number(value)
  if (!Number.isFinite(parsed)) {
    return 1
  }
  return Math.min(blogPageCount(), Math.max(1, Math.trunc(parsed)))
}
