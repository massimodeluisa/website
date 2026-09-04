---
title: Images in motion
eyebrow: Colonne indipendenti
role: Founder, prodotto e systems architecture
summary: Un bel mosaico dinamico di foto, ogni colonna inclinata va nel senso opposto alle vicine e a muoverle ci pensa il CSS. Lo monti, copi le impostazioni dallo studio, e le foto restano in quel browser.
seoTitle: Images in motion
seoDescription: Un bel mosaico dinamico di foto, colonne che vanno in direzioni opposte, mosse dal CSS. Lo monti, copi le impostazioni dallo studio, e le foto restano nel browser. MIT, su iim.smartsquad.io.
highlights:
  - Le colonne dispari vanno dall’altra parte, la velocità resta costante dentro la corsia, e il movimento è un translate @keyframes in CSS.
  - 'L’IIFE da CDN è 17,38 KB minificato, 6,47 KB gzip. React e Vue sono peer opzionali.'
  - Expo e NativeScript ospitano lo stesso renderer CSS in una WebView.
  - Su iim.smartsquad.io/studio copi l’oggetto props, e gli URL delle immagini non escono dal browser.
---

**Images in motion: colonne indipendenti, direzioni opposte**

Ho sviluppato e pubblicato [images-in-motion](https://iim.smartsquad.io/). MIT. npm. Documentazione e uno studio su iim.smartsquad.io. La 1.0.0 è uscita il 3 settembre 2026.

Ogni colonna inclinata scorre nel senso opposto alle vicine. Le velocità cambiano da una colonna all’altra e restano costanti dentro la stessa. Un offset di fase evita che le righe si allineino.

Il movimento è un translate `@keyframes` per corsia. La geometria si calcola una volta. Il renderer DOM inietta un foglio di stile. Il browser composita le transform. React e Vue creano un host, chiamano `mountImagesInMotion`, e basta. Expo e NativeScript mettono lo stesso renderer in una WebView.

La pausa rallenta, poi tiene. `prefers-reduced-motion` e una tab nascosta fermano subito. Al host serve una misura. Nei docs il mosaico è 20rem per 20rem.

Lo studio copia un oggetto props senza URL di immagini. Le foto scelte restano in quel browser.

Sorgente: [github.com/smartsquad/images-in-motion](https://github.com/smartsquad/images-in-motion).
