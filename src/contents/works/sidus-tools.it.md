---
title: SIDUS
eyebrow: Strumenti di ingegneria spaziale
role: Founder, product e systems architecture
summary: Laboratorio open-source per meccanica orbitale, propulsione, RF/ops ed ECLSS di equipaggio — circa 175 calcolatori pure-SI, MCP pubblico, agent skill ed export multi-linguaggio. Non-profit, non flight software.
seoTitle: SIDUS — strumenti open-source di ingegneria spaziale
seoDescription: SIDUS (sidus.tools) è un laboratorio open-source con circa 175 calcolatori pure-SI, endpoint MCP pubblico, agent skill e 10 lingue UI.
highlights:
  - Circa 175 tool live su orbitale, propulsione, satellite/RF, ECLSS, geometria, planetario e utility — matematica pure-SI nel browser.
  - "Superficie agent-native: MCP HTTP pubblico su sidus.tools/api/mcp, Agent Skill installabile e llms.txt."
  - Export di codice in 10 linguaggi (incluso Rust) e UI in 10 lingue.
  - Qualità delle fonti verificata da test (Vallado, Curtis, NASA GRC, OCHMO, CelesTrak, JPL Horizons).
---

**SIDUS: matematica spaziale trasparente per umani e agenti**

SIDUS (*sidus*, latino per costellazione / corpo celeste) è un laboratorio didattico gratuito per meccanica orbitale, propulsione, operazioni satellitari, launch, link budget RF ed ECLSS di equipaggio. È indipendente e non-profit — non affiliato a NASA, ESA, SpaceX o ad altre agenzie/aziende — e deliberatamente **non** è flight software.

Il problema prodotto è semplice: studenti, hobbyist e ingegneri in attività servono controlli SI veloci e trasparenti senza avviare una suite di mission design. SIDUS risponde con un pattern ToolShell condiviso: input SI, funzioni pure, card dei risultati, plot orbitali opzionali e “Edit this page on GitHub” su ogni tool.

Nel 2026 il catalogo live è dell’ordine di **175 tool** in sette categorie. I default usano μ⊕ = 3.986004418×10¹⁴ m³/s² e raggio equatoriale 6 378 137 m. I modelli restano volutamente limitati: two-body e manovre impulsive, rendezvous Clohessy–Wiltshire circolare, razzo ideale e aero ISA — non CR3BP, n-body SPICE o ECLSS certificata.

Ciò che distingue SIDUS da una pagina di formule statiche è la **superficie agent**. I client AI usano un endpoint MCP pubblico (`https://sidus.tools/api/mcp`) senza installazione, un Agent Skill (`npx skills add massimodeluisa/sidus-tools`) e un indice macchina su `/llms.txt`. Gli umani ottengono dieci lingue UI e export di codice idiomatico (anche Rust) così un Δv di Hohmann lascia la pagina pronto per il proprio stack.

La qualità delle fonti è parte del prodotto: bibliografie multi-fonte e check automatici che richiedono URL HTTPS risolvibili prima del ship. SIDUS è anche un sandbox di R&D personale: UI dense, purezza fisica, SEO/GEO per contenuti tecnici e un modo di far condividere lo stesso numero a un umano e a un LLM. I risultati vanno sempre ricontrollati con software e standard di mission design prima di qualsiasi decisione di volo.
