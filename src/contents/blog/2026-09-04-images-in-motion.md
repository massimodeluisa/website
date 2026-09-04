---
title: Images in motion
date: 2026-09-04
category: tech
excerpt: images-in-motion is a CSS mosaic of inclined columns that scroll in opposite directions. I published it on 3 September 2026. The CDN file is 17.38 KB minified, 6.47 KB gzip. The studio copies settings without taking the pictures with it.
readingTime: 6
cover: /journal/2026-09-04/iim-mosaic.webp
coverAlt: Live mosaic on iim.smartsquad.io
---

I published [images-in-motion](https://iim.smartsquad.io/) on 3 September 2026. It is MIT, under Smart Squad, and the npm name is `images-in-motion`. Docs and a studio sit on iim.smartsquad.io. The picture at the top of this post is the live mosaic on that site.

The mosaic is a grid of inclined columns. Each column scrolls the opposite way from its neighbours, at a speed that stays constant inside that lane and differs from the lanes beside it. A deterministic phase offset keeps the rows from lining up, so the pattern does not freeze into a grid. Default tilt is 12 degrees. Default speed range is 8 to 18 logical pixels a second. You can flip the axis and scroll rows instead.

## Why it is CSS

I wanted the pictures to keep moving even when the JavaScript framework is idle. A mosaic that depends on a `requestAnimationFrame` loop, or on React and Vue rendering every tick, spends the main thread on decoration and janks the rest of the page. So the motion is one CSS `@keyframes` translate per lane (`iim-scroll` vertical, `iim-scroll-x` horizontal, both `translate3d`). Geometry is computed once. The renderer injects a stylesheet (`#images-in-motion-style`) and gives each track an animation, and the browser composites those transforms on the GPU. Odd lanes run in reverse so neighbouring columns never march in lockstep. Each track holds two copies of the image cycle, and the last gap is part of the period, so the loop does not jump when it wraps.

Pause ramps `playbackRate` for about half a second, then `animation-play-state` holds the pose. If the user has asked for reduced motion, or the tab is hidden, the animation snaps instead of fighting them.

## Installing it

```bash
bun add images-in-motion
```

Give the host a size. The docs fill the available box and size the mosaic to 20rem by 20rem. React and Vue are optional peers: they create a host, call `mountImagesInMotion`, and get out of the way. They do not own the keyframes. Expo and NativeScript host that same CSS renderer in a WebView. There is a custom element, `<images-in-motion>`, if you want it that way.

The CDN file (`dist/iife/images-in-motion.global.js`) is 17.38 KB minified (17,798 bytes), 6.47 KB gzip -9, 5.83 KB brotli quality 11. It does not include React, Vue, or the images. `bun run size` on the repo is how those bytes were measured. Do not round them.

## The studio

The [studio](https://iim.smartsquad.io/studio/) is where you tune canvas, speed, inclination, tiles, and overlay. Copy settings to clipboard writes the renderer props object. Image URLs never enter that payload, and neither do blob URLs from file picks. Pictures stay in the browser that chose them, so you can copy a configuration without copying someone else's photos.

Source is [github.com/smartsquad/images-in-motion](https://github.com/smartsquad/images-in-motion). Docs also ship `/llms.txt` if an agent would rather read Markdown than the mosaic.
