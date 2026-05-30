/// <reference types="vite-ssg" />
import { readdirSync } from 'node:fs'
import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import { Mode, plugin as markdownHtml } from 'vite-plugin-markdown'

import tailwindcss from '@tailwindcss/vite'

/* Locale path prefixes ('' is the default English, served unprefixed). */
const LOCALE_PREFIXES = ['', '/it', '/ja', '/ru', '/uk']

function markdownSlugs(dir: string): string[] {
  const folder = fileURLToPath(new URL(`./src/contents/${dir}`, import.meta.url))
  return readdirSync(folder)
    .filter((file) => file.endsWith('.md'))
    .map((file) => file.replace(/\.md$/, ''))
}

/*
 * Every concrete page path to statically pre-render: the dynamic blog/work
 * slugs expanded across all locales. The dev-only /test-bg route is excluded.
 */
function staticRoutes(): string[] {
  const blog = markdownSlugs('blog')
  const work = markdownSlugs('works')
  const paths: string[] = []
  for (const prefix of LOCALE_PREFIXES) {
    paths.push(prefix || '/')
    paths.push(`${prefix}/blog`)
    for (const slug of blog) {
      paths.push(`${prefix}/blog/${slug}`)
    }
    for (const slug of work) {
      paths.push(`${prefix}/work/${slug}`)
    }
  }
  return paths
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    /*
     * Markdown content (works + journal) is loaded as rendered HTML strings via
     * import.meta.glob and injected with v-html — never as Vue components, so a
     * single markdown→HTML transform (exposing `html` + `attributes`) is enough.
     */
    markdownHtml({
      mode: [Mode.HTML],
      markdownIt: {
        html: false,
        linkify: true,
        typographer: true,
      },
    }),
    tailwindcss(),
    vue(),
    vueJsx(),
    /*
     * componentInspector off: it compiles each SFC template as HTML to wire up
     * click-to-source, which throws "missing end tag" on every `<template lang="pug">`.
     */
    vueDevTools({ componentInspector: false }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  /*
   * Consumed by vite-ssg (see build-only script). `dirStyle: 'nested'` emits
   * `route/index.html` so GitHub Pages serves clean URLs without a SPA fallback.
   */
  ssgOptions: {
    script: 'async',
    formatting: 'minify',
    dirStyle: 'nested',
    includedRoutes: () => staticRoutes(),
  },
})
