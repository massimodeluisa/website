<script setup lang="ts">
defineProps({
  id: { type: String, required: false },
  /** Append extra classes alongside the default section padding. */
  contentClass: { type: String, default: '' },
})
</script>

<template lang="pug">
section.border-t.border-site-border(
  :id="id"
  class="py-20 md:py-24"
)
  .site-container(:class="contentClass")
    slot
</template>
