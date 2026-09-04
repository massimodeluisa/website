---
title: Images in motion
eyebrow: Независимые колонки
role: Founder, product and systems architecture
summary: Красивая живая мозаика из картинок, каждая наклонная колонка едет навстречу соседям, пока CSS их двигает. Монтируешь, копируешь настройки из studio, и картинки остаются в том браузере.
seoTitle: Images in motion
seoDescription: Красивая живая мозаика из картинок, колонки едут в разные стороны, их двигает CSS. Монтируешь, копируешь настройки из studio, картинки остаются в браузере. MIT, iim.smartsquad.io.
highlights:
  - Нечётные колонки едут в другую сторону, скорость внутри полосы постоянная, движение — один CSS @keyframes translate.
  - 'CDN IIFE: 17,38 KB minify, 6,47 KB gzip. React и Vue — опциональные peer.'
  - Expo и NativeScript крутят тот же CSS-рендерер в WebView.
  - На iim.smartsquad.io/studio копируешь props, и URL картинок из браузера не уходят.
---

**Images in motion: независимые колонки, противоположные направления**

Я опубликовал [images-in-motion](https://iim.smartsquad.io/). MIT. npm. Документация и studio на iim.smartsquad.io. v1.0.0 вышла 3 сентября 2026.

Наклонные колонки едут навстречу соседям. Скорости разные между колонками и постоянные внутри. Сдвиг фазы не даёт рядам совпасть.

Движение — один CSS `@keyframes` translate на полосу. Геометрия считается один раз. DOM-рендерер вставляет стили. Браузер композитит transform. React и Vue создают хост и вызывают `mountImagesInMotion`. Expo и NativeScript кладут тот же рендерер в WebView.

Пауза сначала замедляет, потом держит. `prefers-reduced-motion` и скрытая вкладка останавливают сразу. Хосту нужен размер. В доке мозаика 20rem на 20rem.

Studio копирует props без URL картинок. Выбранные фото остаются в том браузере.

Исходники: [github.com/smartsquad/images-in-motion](https://github.com/smartsquad/images-in-motion).
