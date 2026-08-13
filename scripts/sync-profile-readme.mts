#!/usr/bin/env bun
/*
 * Fills the Writing section of the GitHub profile README from a JSON Feed.
 *
 *   bun scripts/sync-profile-readme.mts --feed dist/feed.json --readme ../.github/README.md
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const START = '<!-- writing:start -->' as const
const END = '<!-- writing:end -->' as const
const ROOT = dirname(fileURLToPath(import.meta.url))

type TFeedItem = {
  title: string
  url: string
  date_published?: string
  date?: string
}

type TJsonFeed = {
  items: TFeedItem[]
}

function argValue(flag: string, fallback: string): string {
  const index = process.argv.indexOf(flag)
  const value = process.argv[index + 1]
  if (index === -1 || !value) {
    return fallback
  }
  return value
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function asFeedItem(value: unknown): TFeedItem | null {
  if (!isRecord(value) || typeof value.title !== 'string' || typeof value.url !== 'string') {
    return null
  }
  const item: TFeedItem = { title: value.title, url: value.url }
  if (typeof value.date_published === 'string') {
    item.date_published = value.date_published
  }
  if (typeof value.date === 'string') {
    item.date = value.date
  }
  return item
}

function asFeed(value: unknown): TJsonFeed {
  if (!isRecord(value) || !Array.isArray(value.items)) {
    return { items: [] }
  }
  const items: TFeedItem[] = []
  for (const entry of value.items) {
    const item = asFeedItem(entry)
    if (item) {
      items.push(item)
    }
  }
  return { items }
}

function escapeMd(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/\[/g, '\\[').replace(/\]/g, '\\]')
}

function formatDate(iso: string): string {
  const stamp = iso.includes('T') ? iso : `${iso}T00:00:00Z`
  return new Date(stamp).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

function listMarkdown(items: TFeedItem[]): string {
  return items
    .map((item) => {
      const title = escapeMd(item.title)
      const date = formatDate(item.date_published || item.date || '')
      return `* [${title}](${item.url}), ${date}`
    })
    .join('\n')
}

function applyWriting(readme: string, listMd: string): string {
  const block = `${START}\n${listMd}\n${END}`
  if (readme.includes(START) && readme.includes(END)) {
    return readme.replace(new RegExp(`${START}[\\s\\S]*?${END}`), block)
  }
  if (readme.includes('## Writing')) {
    return readme.replace(/## Writing\n[\s\S]*$/, `## Writing\n\n${block}\n`)
  }
  return `${readme.trimEnd()}\n\n## Writing\n\n${block}\n`
}

async function loadFeed(feed: string): Promise<TJsonFeed> {
  if (/^https?:\/\//.test(feed)) {
    const response = await fetch(feed)
    if (!response.ok) {
      throw new Error(`feed ${response.status} ${feed}`)
    }
    return asFeed(await response.json())
  }
  return asFeed(JSON.parse(readFileSync(resolve(feed), 'utf8')))
}

const feedPath = argValue('--feed', resolve(ROOT, '../dist/feed.json'))
const readmePath = resolve(argValue('--readme', resolve(ROOT, '../../.github/README.md')))
const feed = await loadFeed(feedPath)
if (!feed.items.length) {
  console.error('[writing] no items in feed')
  process.exit(1)
}

const next = applyWriting(readFileSync(readmePath, 'utf8'), listMarkdown(feed.items))
writeFileSync(readmePath, next)
console.log(`[writing] ${feed.items.length} posts → ${readmePath}`)
