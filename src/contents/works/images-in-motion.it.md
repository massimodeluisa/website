---
title: Images in motion
eyebrow: Un mosaico che scorre
role: Founder, prodotto e systems architecture
summary: Metti un mosaico di immagini su una pagina e le colonne scorrono in direzioni opposte. Regoli inclinazione e velocità nello studio, copi quelle impostazioni, e le immagini restano nel browser.
seoTitle: Images in motion, colonne che scorrono al contrario
seoDescription: Metti un mosaico di immagini su una pagina e le colonne scorrono in direzioni opposte. Regoli inclinazione e velocità nello studio, copi le impostazioni, e le immagini restano nel browser.
highlights:
  - Le colonne vicine si muovono in direzioni opposte, e la velocità resta costante dentro una colonna. L’inclinazione di default è 12 gradi.
  - Il movimento è CSS, quindi la pagina non tiene in vita le immagini con un ciclo di animazione. Possono ospitarlo React, Vue, Expo e NativeScript.
  - Pubblicato il 3 settembre 2026. Il pacchetto è su npm, e lo studio è su iim.smartsquad.io/studio.
  - "Il file sulla CDN è 17,38 KB minificato, 6,47 KB gzip, 5,83 KB brotli. Non include il framework né le immagini."
---

Ho pubblicato [images-in-motion](https://iim.smartsquad.io/) il 3 settembre 2026. Monti un mosaico. Ogni colonna è inclinata, e scorre nel verso opposto rispetto a quella accanto. La velocità resta costante dentro una colonna e cambia rispetto alla successiva, così le righe non si bloccano in una griglia. L’inclinazione di default è 12 gradi. La velocità di default va da 8 a 18 pixel logici al secondo. Puoi far scorrere le righe invece delle colonne.

Il movimento è CSS. La geometria si calcola una volta, e il browser tiene le colonne in moto. Non c’è un ciclo di animazione in JavaScript, e il punto è questo: le immagini devono continuare anche quando il framework è fermo. React e Vue creano solo il contenitore. Expo e NativeScript mettono lo stesso renderer in una WebView.

Il file sulla CDN è 17,38 KB minificato (17.798 byte), 6,47 KB gzip, 5,83 KB brotli. Non arrotondarli. Non include React, Vue o le immagini.

Lo [studio](https://iim.smartsquad.io/studio/) è dove regoli tela, velocità, inclinazione e tessere. Copia scrive le impostazioni. Le immagini che hai scelto non entrano in quella copia, così una configurazione può uscire dal browser senza le foto.

Sorgente: [github.com/smartsquad/images-in-motion](https://github.com/smartsquad/images-in-motion).
