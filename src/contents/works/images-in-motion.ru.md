---
title: Images in motion
eyebrow: Независимые колонки
role: Founder, product and systems architecture
summary: CSS-мозаика наклонных колонок, которые едут навстречу. v1.0.0 — 3 сентября 2026. CDN 17,38 KB minify, 6,47 KB gzip. Монтируешь, копируешь настройки из studio, картинки остаются в том браузере.
seoTitle: Images in motion
seoDescription: CSS-мозаика наклонных колонок, которые едут в разные стороны. Монтируешь, копируешь настройки из studio, картинки остаются в браузере. MIT, iim.smartsquad.io. 17,38 KB minify, 6,47 KB gzip.
highlights:
  - Нечётные колонки едут в другую сторону, скорость внутри полосы постоянная, движение — один CSS @keyframes translate. Наклон по умолчанию 12°.
  - 'CDN IIFE: 17,38 KB minify, 6,47 KB gzip, 5,83 KB brotli. React и Vue — опциональные peer.'
  - Expo и NativeScript крутят тот же CSS-рендерер в WebView. Без цикла requestAnimationFrame.
  - На iim.smartsquad.io/studio копируешь props, и URL картинок из браузера не уходят.
---

**Images in motion: независимые колонки, противоположные направления**

Я опубликовал [images-in-motion](https://iim.smartsquad.io/). MIT. npm. Документация и studio на iim.smartsquad.io. v1.0.0 вышла 3 сентября 2026.

Наклонные колонки едут навстречу соседям. Скорости разные между колонками и постоянные внутри. Наклон по умолчанию 12°. Диапазон скорости 8–18 логических пикселей в секунду. Сдвиг фазы не даёт рядам совпасть.

Движение — один CSS `@keyframes` translate на полосу. Геометрия считается один раз. Цикла `requestAnimationFrame` нет. DOM-рендерер вставляет стили. Браузер композитит transform. React и Vue создают хост и вызывают `mountImagesInMotion`. Expo и NativeScript кладут тот же рендерер в WebView.

Пауза сначала замедляет, потом держит. `prefers-reduced-motion` и скрытая вкладка останавливают сразу. Хосту нужен размер. В доке мозаика 20rem на 20rem.

Studio копирует props без URL картинок. Выбранные фото остаются в том браузере.

Исходники: [github.com/smartsquad/images-in-motion](https://github.com/smartsquad/images-in-motion).
