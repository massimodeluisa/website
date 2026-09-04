---
title: Images in motion
eyebrow: Незалежні колонки
role: Founder, product and systems architecture
summary: CSS-мозаїка нахилених колонок, що їдуть назустріч. v1.0.0 — 3 вересня 2026. CDN 17,38 KB minify, 6,47 KB gzip. Монтуєш, копіюєш налаштування зі studio, картинки лишаються в тому браузері.
seoTitle: Images in motion
seoDescription: CSS-мозаїка нахилених колонок, що їдуть у різні боки. Монтуєш, копіюєш налаштування зі studio, картинки лишаються в браузері. MIT, iim.smartsquad.io. 17,38 KB minify, 6,47 KB gzip.
highlights:
  - Непарні колонки їдуть в інший бік, швидкість усередині смуги стала, рух — один CSS @keyframes translate. Нахил за замовчуванням 12°.
  - 'CDN IIFE: 17,38 KB minify, 6,47 KB gzip, 5,83 KB brotli. React і Vue — опційні peer.'
  - Expo і NativeScript крутять той самий CSS-рендерер у WebView. Без циклу requestAnimationFrame.
  - На iim.smartsquad.io/studio копіюєш props, і URL картинок із браузера не йдуть.
---

**Images in motion: незалежні колонки, протилежні напрямки**

Я опублікував [images-in-motion](https://iim.smartsquad.io/). MIT. npm. Документація і studio на iim.smartsquad.io. v1.0.0 вийшла 3 вересня 2026.

Нахилені колонки їдуть назустріч сусідам. Швидкості різні між колонками і сталі всередині. Нахил за замовчуванням 12°. Діапазон швидкості 8–18 логічних пікселів на секунду. Зсув фази не дає рядкам збігтися.

Рух — один CSS `@keyframes` translate на смугу. Геометрія рахується один раз. Циклу `requestAnimationFrame` немає. DOM-рендерер вставляє стилі. Браузер композитить transform. React і Vue створюють хост і викликають `mountImagesInMotion`. Expo і NativeScript кладуть той самий рендерер у WebView.

Пауза спочатку сповільнює, потім тримає. `prefers-reduced-motion` і прихована вкладка зупиняють одразу. Хосту потрібен розмір. У доках мозаїка 20rem на 20rem.

Studio копіює props без URL картинок. Обрані фото лишаються в тому браузері.

Вихідники: [github.com/smartsquad/images-in-motion](https://github.com/smartsquad/images-in-motion).
