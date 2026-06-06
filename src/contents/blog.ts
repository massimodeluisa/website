import { asString, slugFromPath } from './loader'

// MARK: - Types

type TBlogFrontmatter = {
  title?: string
  date?: string
  category?: string
  excerpt?: string
  readingTime?: number
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
      html: module.html,
    }
  })
  .sort((a, b) => b.date.localeCompare(a.date))
