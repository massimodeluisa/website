---
title: Images in motion
eyebrow: Незалежні колонки
role: Founder, product and systems architecture
summary: Гарна жива мозаїка зі світлин, кожна нахилена колонка їде назустріч сусідам, поки CSS їх рухає. Монтуєш, копіюєш налаштування зі studio, і світлини лишаються в тому браузері.
seoTitle: Images in motion
seoDescription: Гарна жива мозаїка зі світлин, колонки їдуть у різні боки, їх рухає CSS. Монтуєш, копіюєш налаштування зі studio, світлини лишаються в браузері. MIT, iim.smartsquad.io.
highlights:
  - Непарні колонки їдуть в інший бік, швидкість усередині смуги стала, рух — один CSS @keyframes translate.
  - 'CDN IIFE: 17,38 KB minify, 6,47 KB gzip. React і Vue — опційні peer.'
  - Expo і NativeScript крутять той самий CSS-рендерер у WebView.
  - На iim.smartsquad.io/studio копіюєш props, і URL світлин з браузера не виходять.
---

**Images in motion: незалежні колонки, протилежні напрямки**

Я опублікував [images-in-motion](https://iim.smartsquad.io/). MIT. npm. Документація і studio на iim.smartsquad.io. v1.0.0 вийшла 3 вересня 2026.

Нахилені колонки їдуть назустріч сусідам. Швидкості різні між колонками і сталі всередині. Зсув фази не дає рядам збігтися.

Рух — один CSS `@keyframes` translate на смугу. Геометрію рахують один раз. DOM-рендерер вставляє стилі. Браузер композитить transform. React і Vue створюють хост і викликають `mountImagesInMotion`. Expo і NativeScript кладуть той самий рендерер у WebView.

Пауза спочатку сповільнює, потім тримає. `prefers-reduced-motion` і прихована вкладка зупиняють одразу. Хосту потрібен розмір. У доках мозаїка 20rem на 20rem.

Studio копіює props без URL зображень. Обрані фото лишаються в тому браузері.

Код: [github.com/smartsquad/images-in-motion](https://github.com/smartsquad/images-in-motion).
