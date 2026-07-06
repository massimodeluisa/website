/// <reference types="vite/client" />

/* ISO 8601 build timestamp, injected via Vite `define` (see vite.config.ts).
 * Used for JSON-LD dateModified so freshness reflects the latest deploy. */
declare const __BUILD_DATE__: string
