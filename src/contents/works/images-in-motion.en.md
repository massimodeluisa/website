---
title: Images in motion
eyebrow: Independent columns
role: Founder, product and systems architecture
summary: A CSS mosaic of inclined columns that scroll opposite ways. v1.0.0 on 3 September 2026. CDN 17.38 KB minified, 6.47 KB gzip. You mount it, copy settings from the studio, and the pictures stay in that browser.
seoTitle: Images in motion
seoDescription: A CSS mosaic of inclined columns scrolling opposite ways. Mount it, copy settings from the studio, pictures stay in the browser. MIT, on iim.smartsquad.io. 17.38 KB minified, 6.47 KB gzip.
highlights:
  - Odd columns go the other way, speeds stay constant inside a lane, and the motion is one CSS @keyframes translate. Default tilt 12 degrees.
  - 'The CDN IIFE is 17.38 KB minified, 6.47 KB gzip, 5.83 KB brotli. React and Vue are optional peers.'
  - Expo and NativeScript host that same CSS renderer in a WebView. No requestAnimationFrame loop.
  - On iim.smartsquad.io/studio you copy the props object, and image URLs never leave the browser.
---

**Images in motion: independent columns, opposite directions**

I published [images-in-motion](https://iim.smartsquad.io/). MIT. npm. Docs and a studio on iim.smartsquad.io. v1.0.0 went out on 3 September 2026.

Each inclined column scrolls the other way from its neighbours. Speeds differ between columns and stay constant inside one. Default tilt is 12°. Default speed range is 8 to 18 logical pixels a second. A phase offset keeps the rows from lining up.

The motion is one CSS `@keyframes` translate per lane. Geometry is computed once. There is no `requestAnimationFrame` loop. The DOM renderer injects a stylesheet. The browser composites the transforms. React and Vue create a host, call `mountImagesInMotion`, and get out of the way. Expo and NativeScript put that same renderer in a WebView.

Pause eases, then holds. `prefers-reduced-motion` and a hidden tab snap. Give the host a size. The docs size the mosaic to 20rem by 20rem.

The studio copies an image-free props object. Pictures chosen there stay in that browser.

Source: [github.com/smartsquad/images-in-motion](https://github.com/smartsquad/images-in-motion).
