<script setup lang="ts">
// Animated CSS mesh-gradient — technique: phase-offset radial blobs (no copyrighted code from whatamesh).
defineProps({
  paused: { type: Boolean, default: false, required: false },
})
</script>

<template lang="pug">
.absolute.inset-0.z-0.isolate.overflow-hidden.pointer-events-none(
  aria-hidden="true"
  :class="{ 'mesh-bg--paused': paused }"
)
  .mesh-bg-blob.mesh-bg-blob-a
  .mesh-bg-blob.mesh-bg-blob-b
  .mesh-bg-blob.mesh-bg-blob-c
  .mesh-bg-blob.mesh-bg-blob-d
  .mesh-bg-blob.mesh-bg-blob-e
  .mesh-bg-blob.mesh-bg-blob-f
  .mesh-bg-grain.absolute.inset-0.pointer-events-none
</template>

<style scoped lang="scss">
.mesh-bg-blob {
  position: absolute;
  border-radius: 9999px;
  filter: blur(90px);
  opacity: 0.32;
  will-change: transform;
  mix-blend-mode: multiply;
}

:global([data-theme='dark']) .mesh-bg-blob,
:global(.dark) .mesh-bg-blob {
  mix-blend-mode: screen;
  opacity: 0.24;
}

// Six blobs — phase-offset drift paths that cross the viewport.
.mesh-bg-blob-a {
  width: 70vmax;
  height: 70vmax;
  background: radial-gradient(
    circle,
    color-mix(in oklab, var(--site-secondary) 88%, transparent) 0%,
    transparent 62%
  );
  top: -28%;
  left: -18%;
  animation: drift-a 31s ease-in-out infinite;
}

.mesh-bg-blob-b {
  width: 60vmax;
  height: 60vmax;
  background: radial-gradient(
    circle,
    color-mix(in oklab, var(--site-primary) 78%, transparent) 0%,
    transparent 60%
  );
  top: -16%;
  right: -22%;
  animation: drift-b 37s ease-in-out infinite;
}

.mesh-bg-blob-c {
  width: 90vmax;
  height: 90vmax;
  background: radial-gradient(
    circle,
    color-mix(in oklab, var(--site-secondary) 65%, transparent) 0%,
    transparent 66%
  );
  bottom: -34%;
  left: 4%;
  animation: drift-c 43s ease-in-out infinite;
}

.mesh-bg-blob-d {
  width: 50vmax;
  height: 50vmax;
  background: radial-gradient(
    circle,
    color-mix(in oklab, var(--site-primary) 60%, transparent) 0%,
    transparent 60%
  );
  bottom: -20%;
  right: -8%;
  animation: drift-d 41s ease-in-out infinite;
}

.mesh-bg-blob-e {
  width: 55vmax;
  height: 55vmax;
  background: radial-gradient(
    circle,
    color-mix(in oklab, var(--site-secondary) 55%, transparent) 0%,
    transparent 64%
  );
  bottom: -16%;
  right: -20%;
  animation: drift-e 47s ease-in-out infinite;
}

.mesh-bg-blob-f {
  width: 48vmax;
  height: 48vmax;
  background: radial-gradient(
    circle,
    color-mix(in oklab, var(--site-primary) 50%, transparent) 0%,
    transparent 60%
  );
  top: 18%;
  right: -16%;
  animation: drift-f 24s ease-in-out infinite;
}

// Blobs travel far enough that each midway stop lands in a different quadrant.
@keyframes drift-a {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(58vw, 24vh) scale(1.18);
  }
  66% {
    transform: translate(12vw, 62vh) scale(0.86);
  }
}

@keyframes drift-b {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  40% {
    transform: translate(-46vw, 38vh) scale(1.12);
  }
  72% {
    transform: translate(-10vw, 70vh) scale(0.82);
  }
}

@keyframes drift-c {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  30% {
    transform: translate(52vw, -32vh) scale(1.1);
  }
  68% {
    transform: translate(-18vw, -58vh) scale(0.92);
  }
}

@keyframes drift-d {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  35% {
    transform: translate(-66vw, -22vh) scale(1.06);
  }
  70% {
    transform: translate(-22vw, -52vh) scale(0.9);
  }
}

/* Bronze blob originates bottom-right, then drifts up and to the left. */
@keyframes drift-e {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  28% {
    transform: translate(-48vw, -34vh) scale(1.14);
  }
  62% {
    transform: translate(-20vw, -6vh) scale(0.84);
  }
}

@keyframes drift-f {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  44% {
    transform: translate(-58vw, -18vh) scale(1.08);
  }
  78% {
    transform: translate(-30vw, 46vh) scale(0.88);
  }
}

.mesh-bg-grain {
  background-image: radial-gradient(
    circle,
    color-mix(in oklab, var(--site-text) 20%, transparent) 1px,
    transparent 1.2px
  );
  background-size: 22px 22px;
  opacity: 0.08;
  mix-blend-mode: overlay;
}

.mesh-bg--paused .mesh-bg-blob {
  animation-play-state: paused;
}

@media (prefers-reduced-motion: reduce) {
  .mesh-bg-blob {
    animation: none;
  }
}
</style>
