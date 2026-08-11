---
title: IsReady.AI
eyebrow: AI readiness e GEO
role: CTO, product e platform architecture
summary: Audit open-source gratuito che risponde a una domanda basata su evidenze — l’AI riesce davvero a leggere il tuo sito? 32 check su crawler, rendering, structured data, trust e contenuti GEO, più Smart Agent readability e CLI pronta per la CI.
seoTitle: IsReady.AI — il tuo sito è pronto per l’AI?
seoDescription: IsReady.AI misura se ChatGPT, Claude, Perplexity e altri sistemi AI riescono a leggere il tuo sito — 32 check, Smart Agent, CLI, GitHub Actions e fix PR.
highlights:
  - 32 check basati su evidenze in cinque dimensioni e punteggio 0–100 versionato.
  - "CLI open-source (`npx isreadyai`) con --json, --md, --llm, --deep e exit code per la CI."
  - "Smart Agent readability: browser reale (agent-browser) su albero di accessibilità e controlli nominati."
  - audit-action e fix-action su GitHub per gate di score e PR automatiche (Pro/Team).
---

**IsReady.AI: misurare se l’AI riesce davvero a leggere il sito**

IsReady.AI risponde a una domanda con evidenze, non con folklore: **i sistemi AI riescono davvero a leggere il tuo sito?** È un prodotto di Smart Squad S.r.l. (Udine). Motore e CLI sono open-source MIT; la dashboard hosted è source-available (PolyForm Shield).

Gli strumenti SEO classici perdono un gap strutturale. GPTBot, ClaudeBot, PerplexityBot e OAI-SearchBot in genere **non eseguono JavaScript**. Un’app React/Vue solo client-side può rankare su Google ed essere una shell vuota per ogni assistente AI. Ogni provider ha crawler distinti per training, search e fetch live; le challenge anti-bot tipo Cloudflare possono cancellarti dalle risposte senza toccare il ranking classico.

Lo scan fetcha come un crawler AI, parsa l’HTML come fanno loro ed esegue **32 check** su structured data, crawler access, rendering, content/GEO e trust. Ogni finding ha valore osservato, conseguenza e fix concreto. `llms.txt` è solo informativo: non muove lo score.

L’audit opzionale **Smart Agent Readability** aggiunge un secondo 0–100 per agenti con browser. Distribuzione: scan web gratuito, CLI, GitHub Actions e badge live. La ricerca GEO peer-reviewed (Aggarwal et al., KDD 2024) motiva la dimensione contenuti: citazioni, statistiche e fonti credibili alzano la visibilità nelle risposte generative.
