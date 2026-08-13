---
title: isready.ai
eyebrow: AI readiness и GEO
role: CTO, продукт и платформенная архитектура
summary: Бесплатный open-source аудит. Когда GPTBot или ClaudeBot забирают страницу, приходит статья? 32 проверки. Deep scan CLI и Markdown-решения бесплатны. Мониторинг — hosted.
seoTitle: isready.ai, готов ли сайт к AI
seoDescription: isready.ai оценивает, могут ли ChatGPT, Claude, Perplexity и другие AI читать ваш сайт. 32 проверки. Deep scan CLI и Markdown бесплатны. Pro €19 и Team €49 — hosted-мониторинг.
highlights:
  - "32 проверки: crawler, rendering, structured data, trust, GEO-контент. Версионированный score 0–100."
  - "CLI `npx isreadyai` (1.1.4). `--json`, `--md`, `--llm`, `--deep` (до 10 страниц на бесплатном вебе), `--smart-ai`, exit code для CI. Полностью бесплатно."
  - "Smart Agent readability: agent-browser смотрит, видит ли живой браузер контент и именованные контролы."
  - "audit-action@v1 как CI-гейт. Pro €19 / Team €49: мониторинг, история, бейдж, Ask-your-site и PR fix-action."
---

**isready.ai: читают ли AI-краулеры сайт?**

isready.ai отвечает с доказательствами: когда GPTBot, ClaudeBot, PerplexityBot или OAI-SearchBot забирают страницу, приходит статья или пустой документ? Продукт Smart Squad (Удине). Движок и CLI — MIT. Hosted dashboard — PolyForm Shield.

Эти краулеры обычно не выполняют JavaScript. Клиентский React или Vue может ранжироваться в Google и приехать пустой оболочкой. У каждого провайдера отдельные краулеры для обучения, поиска и живых запросов. Challenge в духе Cloudflare может выкинуть вас из ответов, не трогая классический рейтинг.

Скан fetch’ит как AI-краулер, парсит HTML так же и гоняет 32 проверки. GEO контента следует Aggarwal et al., KDD 2024: цитаты, статистика, источники. У каждой находки есть наблюдённое значение, следствие и конкретный фикс. Score версионирован. `llms.txt` только информативен и не двигает score.

```bash
npx isreadyai yourdomain.com --deep --md
```

Deep scan в CLI и Markdown-решения бесплатны. Pro для этого не нужен. Опциональный Smart Agent добавляет второй 0–100 для агентов с браузером.

Pro — €19 в месяц, Team — €49: мониторинг, история, бейдж, Ask-your-site и `isreadyai/fix-action` для автоматических PR.
