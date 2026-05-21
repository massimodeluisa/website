<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'

const navigation = [
  { label: 'Colors', to: '/colors' },
  { label: 'Font', to: '/fonts' },
]
</script>

<template>
  <div class="site-page flex min-h-dvh flex-col">
    <header class="site-header sticky top-0 z-10 border-b">
      <div
        class="mx-auto flex w-[min(1180px,calc(100%-32px))] items-center justify-between gap-6 py-4"
      >
        <RouterLink class="site-brand text-lg font-semibold" to="/colors"
          >Website system</RouterLink
        >

        <nav
          class="site-nav flex items-center gap-2 text-sm font-medium"
          aria-label="Main navigation"
        >
          <RouterLink
            v-for="item in navigation"
            :key="item.to"
            class="site-nav-link rounded-full border px-3 py-1.5 transition-colors"
            :to="item.to"
          >
            {{ item.label }}
          </RouterLink>
        </nav>
      </div>
    </header>

    <main class="grow">
      <RouterView />
    </main>

    <footer class="site-footer border-t">
      <div
        class="site-muted mx-auto flex w-[min(1180px,calc(100%-32px))] flex-wrap items-center justify-between gap-3 py-6 text-sm"
      >
        <span>Design reference</span>
        <span class="font-mono">Geist / #8894A9 / #B68370</span>
      </div>
    </footer>
  </div>
</template>

<style scoped></style>
