---
title: isready.ai
eyebrow: AI readiness e GEO
role: CTO, prodotto e platform architecture
summary: Audit open source gratuito su una domanda semplice. L’AI riesce davvero a leggere il tuo sito? 32 check, una CLI il cui deep scan e le soluzioni Markdown restano gratis, e un layer hosted se ti serve il monitoraggio.
seoTitle: isready.ai, il tuo sito è pronto per l’AI?
seoDescription: isready.ai misura se ChatGPT, Claude, Perplexity e altri sistemi AI riescono a leggere il tuo sito. 32 check. Deep scan CLI e soluzioni Markdown sono gratis. Pro e Team sono il layer hosted.
highlights:
  - 32 check basati su evidenze su structured data, crawler, rendering, contenuti GEO e trust. Punteggio 0-100 versionato.
  - "CLI open source (`npx isreadyai`). Deep scan e soluzioni Markdown completamente gratis. `--json`, `--md`, `--llm`, `--deep`, exit code per la CI."
  - "Smart Agent readability: un browser reale valuta se gli agenti vedono contenuti, struttura e controlli nominati."
  - audit-action su GitHub come gate di CI. fix-action, monitoring, history, badge e Ask-your-site su Pro/Team.
---

**isready.ai: l’AI riesce davvero a leggere il sito?**

isready.ai risponde a una domanda con evidenze, non con folklore: **i sistemi AI riescono davvero a leggere il tuo sito?** È un prodotto Smart Squad (Udine). Motore e CLI sono MIT. La dashboard hosted è source-available (PolyForm Shield).

Gli strumenti SEO classici perdono un buco strutturale. GPTBot, ClaudeBot, PerplexityBot e OAI-SearchBot in genere **non eseguono JavaScript**. Un’app React o Vue solo client-side può rankare su Google ed essere una shell vuota per ogni assistente. Ogni provider ha crawler distinti per training, search e fetch live. Una challenge tipo Cloudflare può cancellarti dalle risposte senza toccare il ranking classico.

Lo scan fetcha come un crawler AI, parsa l’HTML come fanno loro ed esegue **32 check** su structured data, crawler access, rendering, content/GEO e trust. Ogni finding ha valore osservato, conseguenza e fix concreto. `llms.txt` è solo informativo: non muove lo score.

Il deep scan da CLI e le soluzioni in Markdown sono completamente gratis. Pro non serve per quello.

```bash
npx isreadyai tuodominio.com --deep --md
```

L’audit opzionale Smart Agent aggiunge un secondo 0-100 per agenti con browser. Pro e Team sono il layer hosted: monitoring, history, badge, Ask-your-site, e `isreadyai/fix-action` per le PR automatiche. L’audit in sé è gratis per davvero.
