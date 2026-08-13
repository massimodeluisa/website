---
title: isready.ai
eyebrow: AI readiness і GEO
role: CTO, продукт і платформна архітектура
summary: Безкоштовний open-source аудит. Коли GPTBot чи ClaudeBot забирають сторінку, приходить стаття? 32 перевірки. Deep scan CLI і Markdown-рішення безкоштовні. Моніторинг — hosted.
seoTitle: isready.ai, чи готовий сайт до AI
seoDescription: isready.ai оцінює, чи можуть ChatGPT, Claude, Perplexity та інші AI читати ваш сайт. 32 перевірки. Deep scan CLI і Markdown безкоштовні. Pro €19 і Team €49 — hosted-моніторинг.
highlights:
  - "32 перевірки: crawler, rendering, structured data, trust, GEO-контент. Версійований score 0–100."
  - "CLI `npx isreadyai` (1.1.4). `--json`, `--md`, `--llm`, `--deep` (до 10 сторінок на безкоштовному вебі), `--smart-ai`, exit code для CI. Повністю безкоштовно."
  - "Smart Agent readability: agent-browser дивиться, чи живий браузер бачить контент і іменовані контроли."
  - "audit-action@v1 як CI-гейт. Pro €19 / Team €49: моніторинг, історія, бейдж, Ask-your-site і PR fix-action."
---

**isready.ai: чи читають AI-краулери сайт?**

isready.ai відповідає з доказами: коли GPTBot, ClaudeBot, PerplexityBot чи OAI-SearchBot забирають сторінку, приходить стаття чи порожній документ? Продукт Smart Squad (Удіне). Двигун і CLI — MIT. Hosted dashboard — PolyForm Shield.

Ці краулери зазвичай не виконують JavaScript. Клієнтський React чи Vue може ранжуватися в Google і приїхати порожньою оболонкою. У кожного провайдера окремі краулери для навчання, пошуку і живих запитів. Challenge на кшталт Cloudflare може викинути вас із відповідей, не чіпаючи класичний рейтинг.

Скан fetch’ить як AI-краулер, парсить HTML так само і проганяє 32 перевірки. GEO контенту йде за Aggarwal et al., KDD 2024: цитати, статистика, джерела. У кожної знахідки є спостережене значення, наслідок і конкретний фікс. Score версійований. `llms.txt` лише інформативний і не рухає score.

```bash
npx isreadyai yourdomain.com --deep --md
```

Deep scan у CLI і Markdown-рішення безкоштовні. Pro для цього не потрібен. Опційний Smart Agent додає другий 0–100 для агентів із браузером.

Pro — €19 на місяць, Team — €49: моніторинг, історія, бейдж, Ask-your-site і `isreadyai/fix-action` для автоматичних PR.
