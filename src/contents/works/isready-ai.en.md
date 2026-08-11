---
title: IsReady.AI
eyebrow: "AI readiness & GEO"
role: CTO, product and platform architecture
summary: Free open-source audit that answers one evidence-based question — can AI actually read your website? 32 checks across crawler access, rendering, structured data, trust and GEO content, plus Smart Agent readability and a CI-ready CLI.
seoTitle: IsReady.AI — is your website ready for AI?
seoDescription: IsReady.AI scores whether ChatGPT, Claude, Perplexity and other AI systems can read your site — 32 checks, Smart Agent audit, CLI, GitHub Actions and fix PRs.
highlights:
  - 32 evidence-based checks across five dimensions (structured data, crawler access, rendering, GEO content, trust) producing a versioned 0–100 score.
  - "Open-source CLI (`npx isreadyai`) with --json, --md, --llm fix plans, --deep multi-page crawl and CI exit codes."
  - "Smart Agent readability: a real browser (agent-browser) scores whether agents can see content, structure and named controls."
  - GitHub audit-action and fix-action open score-gated workflows and optional automated fix PRs (Pro/Team).
---

**IsReady.AI: Measuring Whether AI Can Actually Read Your Site**

IsReady.AI answers one question with evidence instead of folklore: **can AI systems actually read your website?** It is a product of Smart Squad S.r.l. (Udine, Italy). The scanner engine and CLI are MIT open source; the hosted dashboard is source-available under PolyForm Shield.

Classic SEO tools miss a structural gap. GPTBot, ClaudeBot, PerplexityBot and OAI-SearchBot generally **do not execute JavaScript**. A client-rendered React or Vue app can rank on Google and still be an empty shell to every AI assistant. Separately, each provider runs distinct crawlers for training, search indexing and live fetches — each controllable in `robots.txt` — and Cloudflare-style anti-bot challenges can erase you from answers without touching classic rankings.

The scan fetches like an AI crawler (raw HTTP, honest user-agent, short timeouts), parses HTML the way those bots do, and runs **32 checks** weighted across structured data (≈30%), crawler access (≈25%), rendering (≈20%), content/GEO (≈15%) and trust (≈10%). Every finding ships with observed value, consequence and a concrete fix. Scoring is versioned so methodology can evolve without silently re-grading past reports. `llms.txt` and Content Signals are reported honestly as **informational** — they never move the score.

An optional **Smart Agent Readability** audit adds a second 0–100 for browser-capable agents: visible content in the accessibility tree, landmarks and headings, named controls, navigability and barriers (challenges, cookie walls, login gates). The Smart Agent View shows the exact tree the agent saw.

Distribution matches how teams work: free web scan, `npx isreadyai yourdomain.com` for terminal audits and LLM-ready fix plans, `isreadyai/audit-action@v1` as a CI gate, and `isreadyai/fix-action@v1` for Pro/Team automated PRs. Live README badges, monitoring and “Ask your site” chat complete the hosted product.

Peer-reviewed GEO research (Aggarwal et al., KDD 2024) motivates the content dimension: quotations, statistics and credible citations measurably raise visibility in generative answers. IsReady.AI makes the failure modes visible, explainable and fixable — so teams choose deliberately whether AI should see them, instead of disappearing by accident.
