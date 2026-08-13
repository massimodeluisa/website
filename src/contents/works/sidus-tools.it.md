---
title: SIDUS
eyebrow: Strumenti di ingegneria spaziale
role: Founder, prodotto e systems architecture
summary: Calcolatori didattici open source di ingegneria spaziale nel browser. Circa 175 tool. Pure SI. MIT. Meccanica orbitale, propulsione, RF, ECLSS di equipaggio.
seoTitle: SIDUS, strumenti open source di ingegneria spaziale
seoDescription: sidus.tools è un set didattico gratuito di circa 175 calcolatori di ingegneria spaziale in SI, nel browser. Licenza MIT. Le formule andrebbero riviste e testate.
highlights:
  - "Circa 175 calcolatori nel browser: orbitale, propulsione, satellite/RF, ECLSS, geometria, planetario, utility. Pure SI."
  - Sulle pagine resta la traccia del textbook (Vallado e Curtis per il two-body). Se un default è sbagliato, si corregge da Edit on GitHub.
  - Export di codice in più linguaggi, tra cui Rust, Python e MATLAB.
  - "MCP pubblico su https://sidus.tools/api/mcp (Streamable HTTP). Agent Skill: `npx skills add massimodeluisa/sidus-tools --skill sidus`."
  - Sono un ingegnere del software, non spaziale. L’ho costruito perché l’ingegneria spaziale mi appassiona. Formule e codice esportabile andrebbero rivisti e testati.
---

**SIDUS: calcolatori didattici di ingegneria spaziale**

Sono un ingegnere del software, non un ingegnere spaziale, tuttavia sono appassionato di ingegneria spaziale. Per questo ho sviluppato e pubblicato sidus.tools.

SIDUS (*sidus*, latino per costellazione) è un set open source, gratuito, di calcolatori didattici per meccanica orbitale, propulsione, operazioni satellitari, launch, link budget RF ed ECLSS di equipaggio. Circa 175 tool. Pure SI. MIT. Girano nel browser. Senza account.

Il punto è un controllo SI veloce che si vede: input, formula, risultato, plot opzionali, e Edit this page on GitHub. I default usano valori educativi tipo WGS-84 (μ⊕ = 3.986004418×10¹⁴ m³/s², raggio equatoriale 6 378 137 m). I modelli restano piccoli di proposito: two-body, manovre impulsive, Clohessy-Wiltshire circolare, razzo ideale, aero ISA.

Le pagine delle formule portano una bibliografia (Vallado e Curtis come spina dorsale two-body, più riferimenti NASA-class dove servono). I check automatici vogliono URL HTTPS veri prima che un tool venga pubblicato.

Lo stesso catalogo è su un MCP pubblico, https://sidus.tools/api/mcp (Streamable HTTP). Si punta il client a quell’URL. Non si clona il repo. Agent Skill, se ti serve così: `npx skills add massimodeluisa/sidus-tools --skill sidus`.

Se lo stesso numero ti serve nel tuo stack, le pagine possono esportare codice (C, C++, Rust, Zig, Python, JS/TS, MATLAB, Julia, Fortran, LaTeX). Le formule e i codici esportabili ed eseguibili nei vari formati andrebbero riviste e testate.
