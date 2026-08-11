---
title: IsReady.AI
eyebrow: AI readiness и GEO
role: CTO, продукт и платформенная архитектура
summary: "Бесплатный open-source аудит: могут ли AI-системы реально читать ваш сайт? 32 проверки (crawler, rendering, structured data, trust, GEO), Smart Agent readability и CLI для CI."
seoDescription: IsReady.AI оценивает, могут ли ChatGPT, Claude, Perplexity и другие AI читать ваш сайт — 32 проверки, Smart Agent, CLI и GitHub Actions.
highlights:
  - 32 evidence-based проверки в пяти измерениях и версионированный score 0–100.
  - "CLI `npx isreadyai` с --json, --md, --llm, --deep и exit code для CI."
  - Smart Agent readability на реальном браузере (agent-browser).
  - GitHub audit-action / fix-action для score gate и auto-fix PR.
---

**IsReady.AI: измеримо ли, что AI читает сайт**

IsReady.AI отвечает на один вопрос с доказательствами: **могут ли AI-системы реально читать ваш сайт?** Продукт Smart Squad S.r.l. (Удине). Движок и CLI — MIT; hosted dashboard — PolyForm Shield.

Классический SEO не ловит разрыв: GPTBot и аналоги часто **не выполняют JavaScript**. CSR-приложение может ранжироваться в Google и оставаться пустой оболочкой для ассистентов. Сканер fetch’ит как AI-crawler, парсит raw HTML и гоняет 32 проверки. `llms.txt` только информативен и не двигает score.
