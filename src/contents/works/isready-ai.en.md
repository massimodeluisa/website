---
title: isready.ai
eyebrow: AI readiness and GEO
role: CTO, product and platform architecture
summary: Free open-source audit of a simple question. When GPTBot or ClaudeBot fetches your page, do they get the article? 32 checks. CLI deep scan and Markdown solutions stay free. Monitoring is hosted.
seoTitle: isready.ai, is your website ready for AI?
seoDescription: isready.ai scores whether ChatGPT, Claude, Perplexity and other AI systems can read your site. 32 checks. CLI deep scan and Markdown solutions are free. Pro €19 and Team €49 are hosted monitoring.
highlights:
  - 32 checks across crawler access, rendering, structured data, trust, and GEO content. A versioned 0-100 score.
  - "Open-source CLI (`npx isreadyai`, 1.1.4). `--json`, `--md`, `--llm`, `--deep` (up to 10 pages on the free web scan), `--smart-ai`, CI exit codes. Completely free."
  - "Smart Agent readability: agent-browser scores whether a real browser can see content, landmarks, and named controls."
  - GitHub audit-action@v1 as a CI gate. Pro €19 / Team €49 for monitoring, history, badge, Ask-your-site, and fix-action PRs.
---

**isready.ai: can AI crawlers read your site?**

isready.ai answers one question with evidence: when GPTBot, ClaudeBot, PerplexityBot, or OAI-SearchBot fetches your page, do they get the article, or an empty document? It is a Smart Squad product (Udine, Italy). Scanner engine and CLI are MIT. The hosted dashboard is source-available under PolyForm Shield.

Those crawlers generally do not execute JavaScript. A client-rendered React or Vue app can rank on Google and still arrive as a blank shell. Each provider also runs distinct crawlers for training, search, and live fetches. A Cloudflare-style challenge can drop you from answers without touching classic rankings.

The scan fetches like an AI crawler (raw HTTP, honest user-agent, short timeouts), parses HTML the way those bots do, and runs 32 checks. Content GEO follows Aggarwal et al., KDD 2024: quotations, statistics, citations. Every finding has an observed value, a consequence, and a concrete fix. Scoring is versioned. `llms.txt` is informational. It never moves the score.

```bash
npx isreadyai yourdomain.com --deep --md
```

The CLI deep scan and the Markdown solutions are free. You do not need Pro for that. An optional Smart Agent pass adds a second 0-100 for browser-capable agents.

Pro is €19 a month and Team is €49: monitoring, history, badge, Ask-your-site, and `isreadyai/fix-action` for automated fix PRs.
