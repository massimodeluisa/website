---
title: SIDUS
eyebrow: Strumenti di ingegneria spaziale
role: Founder, prodotto e systems architecture
summary: Calcolatori didattici open source di ingegneria spaziale nel browser. 201 tool al 4 settembre 2026. Pure SI. MIT. Meccanica orbitale, propulsione, RF, ECLSS di equipaggio.
seoTitle: SIDUS, strumenti open source di ingegneria spaziale
seoDescription: sidus.tools è un set didattico gratuito di 201 calcolatori di ingegneria spaziale in SI, nel browser. Licenza MIT. Le formule andrebbero riviste e testate.
highlights:
  - "201 calcolatori nel browser: orbitale, propulsione, satellite/RF, ECLSS, geometria, planetario, utility. Pure SI."
  - Sulle pagine resta la traccia del textbook (Vallado e Curtis per il two-body). Se un default è sbagliato, si corregge da Edit on GitHub.
  - Export di codice in C, C++, Rust, Zig, Python, JS/TS, MATLAB, Julia, Fortran, LaTeX.
  - "MCP pubblico su https://sidus.tools/api/mcp (Streamable HTTP). Agent Skill: `npx skills add massimodeluisa/sidus-tools --skill sidus`."
  - Scrivo software, e non sono un ingegnere spaziale. Formule e codice esportabile andrebbero rivisti e testati.
---

**SIDUS: calcolatori didattici di ingegneria spaziale**

Scrivo software, e non sono un ingegnere spaziale. Ho pubblicato [sidus.tools](https://sidus.tools) perché questi controlli stiano in SI, su una pagina che si legge, e su un protocollo che un client può chiamare senza una seconda libreria di fisica che deriva in silenzio.

SIDUS (*sidus*, latino per costellazione) è un set open source, gratuito, di calcolatori didattici per meccanica orbitale, propulsione, operazioni satellitari, launch, link budget RF ed ECLSS di equipaggio. 201 tool al 4 settembre 2026. Pure SI. MIT. Girano nel browser. Senza account. Progetto indipendente, nessuna affiliazione con agenzie.

Il punto è un controllo SI veloce che si vede: input, formula, risultato, plot opzionali, e Edit this page on GitHub. I default usano valori educativi tipo WGS-84 (μ⊕ = 3.986004418×10¹⁴ m³/s², raggio equatoriale 6 378 137 m). I modelli restano piccoli di proposito: two-body, manovre impulsive, Clohessy-Wiltshire circolare, razzo ideale, aero ISA.

Le pagine delle formule portano una bibliografia (Vallado e Curtis come spina dorsale two-body, più riferimenti NASA-class dove servono). I check automatici vogliono URL HTTPS veri prima che un tool venga pubblicato. Accanto a Hohmann ci sono Lambert, SGP4, una vista orbitale live, Tsiolkovsky, un link budget RF, l’atmosfera di cabina e uno sketch porkchop Terra-Marte.

Lo stesso catalogo è su un MCP pubblico, https://sidus.tools/api/mcp (Streamable HTTP). Si punta il client a quell’URL. Non si clona il repo. Agent Skill, se ti serve così: `npx skills add massimodeluisa/sidus-tools --skill sidus`.

Se lo stesso numero ti serve nel tuo stack, le pagine possono esportare codice (C, C++, Rust, Zig, Python, JS/TS, MATLAB, Julia, Fortran, LaTeX). Le formule e i codici esportabili ed eseguibili andrebbero riviste e testate.
