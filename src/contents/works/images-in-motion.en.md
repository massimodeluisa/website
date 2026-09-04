---
title: Images in motion
eyebrow: Independent columns
role: Founder, product and systems architecture
summary: A beautiful dynamic mosaic of pictures, each inclined column going the other way from its neighbours while CSS keeps them moving. You mount it, copy the settings from the studio, and the pictures stay in that browser.
seoTitle: Images in motion
seoDescription: A beautiful dynamic mosaic of pictures, columns going opposite ways, moved by CSS. You mount it, copy settings from the studio, and the pictures stay in the browser. MIT, on iim.smartsquad.io.
highlights:
  - Odd columns go the other way, speeds stay constant inside a lane, and the motion is one CSS @keyframes translate.
  - 'The CDN IIFE is 17.38 KB minified, 6.47 KB gzip. React and Vue are optional peers.'
  - Expo and NativeScript host that same CSS renderer in a WebView.
  - On iim.smartsquad.io/studio you copy the props object, and image URLs never leave the browser.
---

**Images in motion: independent columns, opposite directions**

I published [images-in-motion](https://iim.smartsquad.io/). MIT. npm. Docs and a studio on iim.smartsquad.io. v1.0.0 went out on 3 September 2026.

Each inclined column scrolls the other way from its neighbours. Speeds differ between columns and stay constant inside one. A phase offset keeps the rows from lining up.

The motion is one CSS `@keyframes` translate per lane. Geometry is computed once. The DOM renderer injects a stylesheet. The browser composites the transforms. React and Vue create a host, call `mountImagesInMotion`, and get out of the way. Expo and NativeScript put that same renderer in a WebView.

Pause eases, then holds. `prefers-reduced-motion` and a hidden tab snap. Give the host a size. The docs size the mosaic to 20rem by 20rem.

The studio copies an image-free props object. Pictures chosen there stay in that browser.

Source: [github.com/smartsquad/images-in-motion](https://github.com/smartsquad/images-in-motion).
