---
title: isready.ai
eyebrow: La legge un crawler?
role: CTO, prodotto e platform architecture
summary: Lo punti su una pagina e ti dice se GPTBot o ClaudeBot hanno ricevuto l’articolo, oppure un documento vuoto. La scansione e la correzione scritta sono gratuite. Il monitoraggio, se vuoi il punteggio seguito, è ospitato.
seoTitle: isready.ai, un crawler AI legge la pagina?
seoDescription: Punta isready.ai su una pagina e vedi se GPTBot o ClaudeBot hanno ricevuto l’articolo. Trentadue controlli. Scansione e correzione in Markdown sono gratis. Pro €19 e Team €49 per il monitoraggio.
highlights:
  - Trentadue controlli, con un punteggio da 0 a 100. Quei crawler in genere non eseguono JavaScript, quindi una pagina che in Chrome sembra finita può arrivare vuota.
  - "Dal terminale, `npx isreadyai` fa la scansione completa gratis, anche quella più profonda, e può scrivere la correzione in Markdown."
  - Pro costa €19 al mese e Team €49, per monitoraggio, storico, un badge e Ask-your-site. La scansione non ha bisogno di nessuno dei due.
  - Una GitHub Action può far fallire la build se il punteggio scende. Un secondo passaggio dice se un agente con browser vede la pagina.
---

[isready.ai](https://isready.ai) risponde a una domanda. Quando GPTBot, ClaudeBot, PerplexityBot o OAI-SearchBot scaricano la pagina, ricevono l’articolo?

Chrome esegue JavaScript. Quei crawler in genere no. Un’app React o Vue può sembrare finita nel browser e consegnare comunque un documento vuoto, e una pagina di challenge può toglierti dalle risposte senza toccare il posizionamento ordinario. isready.ai è un prodotto di Smart Squad, a Udine. Scarica la pagina come fanno quei bot ed esegue 32 controlli. Ogni rilievo dice cosa è stato osservato, quanto costa e cosa cambiare. Il punteggio è versionato, da 0 a 100. I controlli sul contenuto seguono Aggarwal et al., GEO, KDD 2024: citazioni dirette, statistiche, riferimenti. Un file llms.txt viene annotato e non sposta mai il punteggio.

```bash
npx isreadyai yourdomain.com --deep --md
```

Quel comando, e il Markdown che scrive, sono gratuiti. Puoi anche lanciare la scansione dal sito, senza account. Una GitHub Action può far fallire la build se il punteggio scende. Un secondo passaggio valuta se un agente capace di usare un browser vede il contenuto e i controlli.

Pro costa €19 al mese e Team €49. Coprono monitoraggio, storico, un badge, Ask-your-site e pull request di correzione. Lo scanner è open source. La dashboard ospitata è la parte a pagamento.
