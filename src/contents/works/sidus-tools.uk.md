---
title: SIDUS
eyebrow: Інструменти космічної інженерії
role: Founder, product and systems architecture
summary: Освітні калькулятори космічної інженерії в браузері. 201 інструмент на 4 вересня 2026. Чистий SI. MIT. Орбіта, propulsion, RF, ECLSS.
seoTitle: SIDUS, відкриті інструменти космічної інженерії
seoDescription: sidus.tools — безкоштовні освітні калькулятори, 201 інструмент у чистому SI, у браузері. MIT. Формули треба перевіряти.
highlights:
  - "201 калькулятор у браузері: орбіта, propulsion, RF, ECLSS, геометрія, планети, утиліти. Чистий SI."
  - Слід підручника на сторінках (Vallado і Curtis). Помилку в default можна правити через Edit on GitHub.
  - "Експорт коду: C, C++, Rust, Zig, Python, JS/TS, MATLAB, Julia, Fortran, LaTeX."
  - "Публічний MCP: https://sidus.tools/api/mcp (Streamable HTTP). Agent Skill: `npx skills add massimodeluisa/sidus-tools --skill sidus`."
  - Я пишу софт і не космічний інженер. Формули й експортований код треба рев’юити й тестувати.
---

**SIDUS: освітні калькулятори космічної інженерії**

Я пишу софт і не космічний інженер. Я опублікував [sidus.tools](https://sidus.tools), щоб ці перевірки жили в SI, на сторінці, яку можна прочитати, і на протоколі, який клієнт б’є без другої фізичної бібліотеки, що тихо з’їжджає вбік.

SIDUS (*sidus*, латина: сузір’я) — безкоштовний відкритий набір освітніх калькуляторів: орбітальна механіка, propulsion, супутникові операції, RF, ECLSS. 201 інструмент на 4 вересня 2026. Чистий SI. MIT. У браузері. Без акаунта. Незалежний проєкт, без афіліації з агенціями.

Сенс — швидка SI-перевірка, яку видно: входи, формула, результат, GitHub Edit. Дефолти освітні, WGS-84-класу (μ⊕ = 3.986004418×10¹⁴ m³/s², екваторіальний радіус 6 378 137 m). Моделі навмисно невеликі.

Поруч із Hohmann — Lambert, SGP4, живий орбітальний вигляд, Tsiolkovsky, RF link budget, атмосфера кабіни і porkchop Earth–Mars.

Той самий каталог на публічному MCP: https://sidus.tools/api/mcp (Streamable HTTP). Клієнт дивиться на URL, репозиторій клонувати не треба. Agent Skill: `npx skills add massimodeluisa/sidus-tools --skill sidus`.

Формули й експортований код треба перевіряти й тестувати.
