---
title: Images in motion
eyebrow: 独立した列
role: Founder, product and systems architecture
summary: 傾いた列が隣と逆方向にスクロールする CSS モザイク。v1.0.0 は 2026年9月3日。CDN は minify 17.38 KB、gzip 6.47 KB。マウントして studio から設定をコピーすると、写真はそのブラウザに残る。
seoTitle: Images in motion
seoDescription: 傾いた列が隣と逆方向に動く CSS モザイク。マウントし、studio から設定をコピーすると、写真はブラウザに残る。MIT、iim.smartsquad.io。minify 17.38 KB、gzip 6.47 KB。
highlights:
  - 奇数列は逆方向、レーン内の速度は一定で、動きは CSS の @keyframes translate。デフォルトの傾きは 12°。
  - CDN の IIFE は minify 17.38 KB、gzip 6.47 KB、brotli 5.83 KB。React と Vue は任意の peer。
  - Expo と NativeScript は同じ CSS レンダラを WebView で動かす。requestAnimationFrame のループはない。
  - iim.smartsquad.io/studio で props をコピーすると、画像 URL はブラウザから出ない。
---

**Images in motion: 独立した列、反対方向**

[images-in-motion](https://iim.smartsquad.io/) を公開した。MIT。npm。ドキュメントと studio は iim.smartsquad.io。v1.0.0 は 2026年9月3日。

傾いた列が隣と逆方向にスクロールする。速度は列ごとに違い、列の中では一定。デフォルトの傾きは 12°。速度レンジは論理ピクセル毎秒 8 から 18。位相オフセットで行が揃わない。

動きはレーンごとの CSS `@keyframes` translate。幾何は一度だけ。`requestAnimationFrame` のループはない。DOM レンダラがスタイルシートを入れる。ブラウザが transform を合成する。React と Vue はホストを作り `mountImagesInMotion` を呼ぶ。Expo と NativeScript は同じレンダラを WebView に載せる。

一時停止は緩めてから止める。`prefers-reduced-motion` と隠れたタブはすぐ止まる。ホストにサイズが必要。ドキュメントではモザイクを 20rem × 20rem にしている。

Studio は画像 URL なしの props をコピーする。選んだ写真はそのブラウザに残る。

ソース: [github.com/smartsquad/images-in-motion](https://github.com/smartsquad/images-in-motion)。
