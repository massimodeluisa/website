---
title: SIDUS
eyebrow: Controlli spaziali nel browser
role: Founder, prodotto e systems architecture
summary: Apri una pagina, inserisci i dati e ottieni un numero di ingegneria spaziale in SI, con la formula accanto. Sono 201, gratis nel browser, e non serve un account.
seoTitle: SIDUS, un controllo spaziale che puoi leggere
seoDescription: Apri una pagina SIDUS, inserisci i dati e ottieni un numero di ingegneria spaziale in SI con la formula accanto. 201 strumenti, gratis, senza account. Lo stesso controllo è su un URL pubblico.
highlights:
  - Meccanica orbitale, propulsione, link budget RF e supporto vitale dell’equipaggio. Se un default ti sembra sbagliato, la pagina rimanda alla modifica su GitHub.
  - Lo stesso controllo è una chiamata pubblica su https://sidus.tools/api/mcp, così un client lo usa senza una seconda copia della fisica.
  - Scrivo software e non sono un ingegnere spaziale. Ricontrolla la formula, e qualsiasi codice esporti, prima di fidarti.
  - Al 4 settembre 2026 il catalogo ha 201 strumenti. I default sono valori didattici per la Terra, e i modelli restano piccoli di proposito.
---

Scrivo software e non sono un ingegnere spaziale. Ho pubblicato [sidus.tools](https://sidus.tools) perché un controllo fosse una pagina leggibile: i dati in ingresso, la formula e un numero in SI.

Al 4 settembre 2026 gli strumenti sono 201. Puoi calcolare un trasferimento, un link budget, l’equazione del razzo, l’atmosfera di una cabina. Girano nel browser. Non c’è un account. Il progetto è indipendente, senza un’agenzia dietro.

La pagina e l’URL pubblico usano la stessa funzione. Il 13 agosto 2026 un trasferimento di Hohmann da circa 200 km di LEO a GEO è uscito 3931,86 m/s in entrambi i posti. Se quel numero è sbagliato sulla pagina, è sbagliato sull’URL, e lo correggi una volta sola.

I default usano valori terrestri ordinari, da didattica (μ⊕ = 3,986004418×10¹⁴ m³/s², raggio equatoriale 6 378 137 m). I modelli restano piccoli: due corpi, accensioni impulsive, moto relativo circolare, razzo ideale, aero in atmosfera standard. Le pagine a due corpi citano Vallado e Curtis. Una pagina può esportare il calcolo in codice compilabile. Ricontrollalo prima di fidarti.

Il catalogo è anche su [https://sidus.tools/api/mcp](https://sidus.tools/api/mcp). Punti un client su quell’URL. Sorgente: [github.com/massimodeluisa/sidus-tools](https://github.com/massimodeluisa/sidus-tools).
