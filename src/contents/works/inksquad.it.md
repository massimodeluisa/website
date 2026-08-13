---
title: Inksquad
eyebrow: Studio e idee per il tatuaggio
role: CTO, architettura di prodotto e di piattaforma
summary: Due prodotti su una piattaforma. Inksquad People aiuta a dare forma a un’idea di tatuaggio. Inksquad Artist è l’app iPad da studio, $9.99 sull’App Store, oltre quattrocento inchiostri da catalogo.
seoDescription: Inksquad People per le idee di tatuaggio. Inksquad Artist su iPad per stencil, matching inchiostri e sessioni con i guanti. App Store $9.99. Piattaforma Supabase e AI condivisa.
highlights:
  - "People è un progetto privato: descrizione, stile, posizione, reference, visual Ink AI, poi si condivide con un artista. La prenotazione sta altrove."
  - 'Artist su iPad (App Store id 1579690331): stencil in PencilKit via VTracer, matching CIE94 e CIEDE2000, Matrix, Color Wheel, voce con i guanti.'
  - Oltre quattrocento inchiostri da catalogo, tra cui Intenze, Fusion, World Famous, Eternal Ink, e set legali in UE. In studio funziona anche offline.
  - Turborepo condiviso su Supabase (Postgres, RLS, Edge Functions) e AI multi-provider con il Vercel AI SDK.
---

**Inksquad: da un’idea vaga di tatuaggio a qualcosa che un artista può usare**

Inksquad sono due prodotti. People e Artist fanno mestieri diversi, e stanno sullo stesso piano così un progetto può passare dall’uno all’altro.

### People

[web.inksquad.com](https://web.inksquad.com) è per chi ha l’idea. Si costruisce un progetto privato: descrizione, stile, posizione, dimensione, reference, visual Ink AI. Quando l’idea è pronta, si condivide con un artista. È preparazione, non prenotazione. WIP pubblico.

### Artist

[artist.inksquad.com](https://artist.inksquad.com) è l’app iPad sull’App Store, $9.99 più crediti. Questa è quella da studio. Importi un bozzetto da Procreate, Photoshop o Illustrator. Generi concept. Fai un Inkboard. Abbini inchiostri. Tieni una sessione live. Lo stencil trasforma l’artwork in layer PencilKit modificabili (preprocess, edge detection, VTracer). Il color matching mette marcatori sull’immagine e pesca i cataloghi con CIE94 / CIEDE2000. Matrix e Color Wheel servono a palette e blending. La modalità live capisce comandi vocali per zoom, marcatori, layer, timer, viste: i guanti restano addosso.

Sotto: Turborepo, Supabase, Vercel AI SDK verso OpenAI, Grok, Replicate, Vertex. Una admin Next.js e un sito Payload stanno accanto alle app.

L’AI può aiutare a generare un concept o pulire una reference. La sessione resta dell’artista.
