---
title: Images in motion
eyebrow: A scrolling mosaic
role: Founder, product and systems architecture
summary: You put a mosaic of pictures on a page and the columns scroll in opposite directions. You set the tilt and the speed in the studio, copy those settings, and the pictures stay in the browser.
seoTitle: Images in motion, columns that scroll opposite ways
seoDescription: Put a mosaic of pictures on a page and the columns scroll opposite ways. Set tilt and speed in the studio, copy the settings, and the pictures stay in the browser.
highlights:
  - Neighbouring columns move opposite ways, and the speed stays constant inside one column. The default tilt is 12 degrees.
  - The motion is CSS, so the page does not run an animation loop to keep the pictures moving. React, Vue, Expo, and NativeScript can host it.
  - Published on 3 September 2026. The package is on npm, and the studio is at iim.smartsquad.io/studio.
  - "The CDN file is 17.38 KB minified, 6.47 KB gzip, 5.83 KB brotli. It does not include the framework or the pictures."
---

I published [images-in-motion](https://iim.smartsquad.io/) on 3 September 2026. You mount a mosaic. Each column leans, and it scrolls the opposite way from the column beside it. The speed stays constant inside one column and differs from the next, so the rows do not lock into a grid. The default tilt is 12 degrees. The default speed is 8 to 18 logical pixels a second. You can scroll rows instead of columns.

The motion is CSS. Geometry is computed once, and the browser keeps the columns moving. There is no animation loop in JavaScript, which is the point: the pictures should keep going when the framework is idle. React and Vue only create the host. Expo and NativeScript put that same renderer in a WebView.

The file on the CDN is 17.38 KB minified (17,798 bytes), 6.47 KB gzip, 5.83 KB brotli. Do not round those. It does not include React, Vue, or the images.

The [studio](https://iim.smartsquad.io/studio/) is where you set the canvas, the speed, the tilt, and the tiles. Copy writes the settings. The pictures you picked never enter that copy, so a configuration can leave the browser without the photos.

Source: [github.com/smartsquad/images-in-motion](https://github.com/smartsquad/images-in-motion).
