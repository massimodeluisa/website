---
title: isready.ai
eyebrow: AI readiness and GEO
role: CTO, product and platform architecture
summary: Free open-source audit of a simple question. Can AI actually read your website? 32 checks, a CLI whose deep scan and Markdown solutions stay free, and a hosted layer if you want monitoring.
seoTitle: isready.ai, is your website ready for AI?
seoDescription: isready.ai scores whether ChatGPT, Claude, Perplexity and other AI systems can read your site. 32 checks. CLI deep scan and Markdown solutions are free. Pro and Team are hosted ongoing value.
highlights:
  - 32 evidence-based checks across structured data, crawler access, rendering, GEO content, and trust. A versioned 0-100 score.
  - "Open-source CLI (`npx isreadyai`). Deep scan and Markdown solutions are completely free. `--json`, `--md`, `--llm` fix plans, `--deep` multi-page crawl, CI exit codes."
  - "Smart Agent readability: a real browser scores whether agents can see content, structure, and named controls."
  - GitHub audit-action as a CI gate. fix-action and hosted monitoring, history, badge, Ask-your-site live on Pro/Team.
---

**isready.ai: can AI actually read your site?**

isready.ai answers one question with evidence, not folklore: **can AI systems actually read your website?** It is a Smart Squad product (Udine, Italy). Scanner engine and CLI are MIT. The hosted dashboard is source-available under PolyForm Shield.

Classic SEO tools miss a structural gap. GPTBot, ClaudeBot, PerplexityBot, and OAI-SearchBot generally **do not execute JavaScript**. A client-rendered React or Vue app can rank on Google and still be an empty shell to every AI assistant. Each provider also runs distinct crawlers for training, search, and live fetches. A Cloudflare-style challenge can erase you from answers without touching classic rankings.

The scan fetches like an AI crawler (raw HTTP, honest user-agent, short timeouts), parses HTML the way those bots do, and runs **32 checks** across structured data, crawler access, rendering, content/GEO, and trust. Every finding has an observed value, a consequence, and a concrete fix. Scoring is versioned so methodology can change without silently re-grading old reports. `llms.txt` is informational. It never moves the score.

The CLI deep scan and the Markdown solutions are completely free. You do not need Pro for that.

```bash
npx isreadyai yourdomain.com --deep --md
```

An optional Smart Agent readability pass adds a second 0-100 for browser-capable agents: visible content, landmarks, named controls, barriers (challenges, cookie walls, login gates).

Pro and Team are the hosted ongoing layer: monitoring, history, badge, Ask-your-site, and `isreadyai/fix-action` for automated fix PRs. The audit itself is free for real.
