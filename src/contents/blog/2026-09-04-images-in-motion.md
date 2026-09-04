---
title: Columns that move without a frame loop
date: 2026-09-04
category: tech
excerpt: 'v1.0.0 on 3 September. Each column goes the other way from its neighbours, CSS keeps them moving, and the studio copies settings without taking the pictures with it.'
readingTime: 6
cover: /journal/2026-09-04/iim-mosaic.webp
coverAlt: Live mosaic on iim.smartsquad.io
---

[images-in-motion](https://iim.smartsquad.io/) is 1.0.0 as of 3 September 2026. MIT. Smart Squad. The npm name is `images-in-motion`. Docs and a studio sit on iim.smartsquad.io.

The picture at the top is the live mosaic on that site.

Each inclined lane scrolls the other way from its neighbours. Speeds differ between lanes and stay constant inside one. A deterministic phase offset keeps the rows from lining up.

The motion is one CSS `@keyframes` translate per lane. Vertical tracks use `iim-scroll`. Horizontal tracks use `iim-scroll-x`. Both are `translate3d` from 0 to `var(--iim-cycle)`, linear, infinite. There is no `requestAnimationFrame` loop. No `<canvas>` redraw. React and Vue do not render on every tick.

Geometry is computed once, in `src/core`. The DOM renderer in `src/js` injects a stylesheet (`#images-in-motion-style`) and gives each `.iim-track` an animation. The browser composites those transforms. Odd lanes get `animation-direction: reverse`. Each track holds two copies of the image cycle. The last gap is part of the period, so the loop does not jump when it wraps.

Pause eases `playbackRate` for about half a second, then `animation-play-state` holds the pose. `prefers-reduced-motion` and a hidden tab snap. `stopOnHover` eases to a stop while the pointer is over the host. `animateOnHover` eases in only then. If both are set, motion stays continuous.

React and Vue are optional peers. They create a host, call `mountImagesInMotion` on an inner stage, and call `update` / `destroy`. They do not own keyframes. Expo and NativeScript host that same CSS renderer in a WebView. There is no React Native mosaic, and no NativeScript view port.

The CDN IIFE is **17.38 KB** minified (17,798 bytes). gzip -9: **6.47 KB** (6,630 bytes). Brotli quality 11: **5.83 KB**. That file is `dist/iife/images-in-motion.global.js`. It is the unpkg / jsDelivr bundle. No React. No Vue. No images.

```bash
bun add images-in-motion
```

Give the host a size. The docs fill the available box and size the mosaic to `20rem` by `20rem`. There is a custom element, `<images-in-motion>`, if you want it that way.

The [studio](https://iim.smartsquad.io/studio/) tunes canvas, speed, inclination, tiles, overlay. **Copy settings to clipboard** writes the renderer props object. Image URLs never enter that payload. Blob URLs from file picks neither. Pictures stay in the browser.

Source is [github.com/smartsquad/images-in-motion](https://github.com/smartsquad/images-in-motion).
