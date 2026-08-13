---
title: isready.ai
eyebrow: AI readiness e GEO
role: CTO, prodotto e platform architecture
summary: Audit open source gratuito su una domanda semplice. Quando GPTBot o ClaudeBot fetchano la pagina, arriva l’articolo? 32 check. Deep scan CLI e soluzioni Markdown restano gratis. Il monitoraggio è hosted.
seoTitle: isready.ai, il tuo sito è pronto per l’AI?
seoDescription: isready.ai misura se ChatGPT, Claude, Perplexity e altri sistemi AI riescono a leggere il tuo sito. 32 check. Deep scan CLI e soluzioni Markdown sono gratis. Pro €19 e Team €49 sono il monitoraggio hosted.
highlights:
  - 32 check su crawler, rendering, structured data, trust e contenuti GEO. Punteggio 0-100 versionato.
  - "CLI open source (`npx isreadyai`, 1.1.4). `--json`, `--md`, `--llm`, `--deep` (fino a 10 pagine sullo scan web gratis), `--smart-ai`, exit code per la CI. Completamente gratis."
  - "Smart Agent readability: agent-browser valuta se un browser reale vede contenuti, landmark e controlli nominati."
  - audit-action@v1 su GitHub come gate di CI. Pro €19 / Team €49 per monitoring, history, badge, Ask-your-site e PR di fix-action.
---

**isready.ai: i crawler AI riescono a leggere il sito?**

isready.ai risponde a una domanda con evidenze: quando GPTBot, ClaudeBot, PerplexityBot o OAI-SearchBot fetchano la pagina, arriva l’articolo o un documento vuoto? È un prodotto Smart Squad (Udine). Motore e CLI sono MIT. La dashboard hosted è source-available (PolyForm Shield).

Quei crawler in genere non eseguono JavaScript. Un’app React o Vue solo client-side può rankare su Google ed arrivare come una shell vuota. Ogni provider ha crawler distinti per training, search e fetch live. Una challenge tipo Cloudflare può toglierti dalle risposte senza toccare il ranking classico.

Lo scan fetcha come un crawler AI, parsa l’HTML come fanno loro ed esegue 32 check. Il GEO dei contenuti segue Aggarwal et al., KDD 2024: citazioni, statistiche, fonti. Ogni finding ha valore osservato, conseguenza e fix concreto. Lo score è versionato. `llms.txt` è solo informativo: non muove lo score.

```bash
npx isreadyai tuodominio.com --deep --md
```

Il deep scan da CLI e le soluzioni in Markdown sono gratis. Pro non serve per quello. Lo Smart Agent opzionale aggiunge un secondo 0-100 per agenti con browser.

Pro è €19 al mese e Team €49: monitoring, history, badge, Ask-your-site, e `isreadyai/fix-action` per le PR automatiche.
