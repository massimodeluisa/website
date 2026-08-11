---
title: isready.ai
eyebrow: Can a crawler read it
role: CTO, product and platform architecture
summary: You point it at a page and it tells you whether GPTBot or ClaudeBot received the article, or an empty document. The scan and the written fix are free. Monitoring, if you want the score watched, is hosted.
seoTitle: isready.ai, can an AI crawler read the page?
seoDescription: Point isready.ai at a page and see whether GPTBot or ClaudeBot got the article. Thirty-two checks. The scan and the Markdown fix are free. Pro is €19 and Team is €49 for monitoring.
highlights:
  - Thirty-two checks, scored from 0 to 100. Those crawlers generally do not run JavaScript, so a page that looks finished in Chrome can arrive blank.
  - "From the terminal, `npx isreadyai` runs the full scan for free, including a deeper pass, and can write the fix as Markdown."
  - Pro is €19 a month and Team is €49, for monitoring, history, a badge, and Ask-your-site. The scan does not need either one.
  - A GitHub Action can fail the build when the score drops. A second pass scores whether a browser-capable agent can see the page.
---

[isready.ai](https://isready.ai) answers one question. When GPTBot, ClaudeBot, PerplexityBot, or OAI-SearchBot fetches the page, do they get the article?

Chrome runs JavaScript. Those crawlers generally do not. A React or Vue app can look finished in the browser and still hand them an empty document, and a challenge page can drop you from answers without touching ordinary search rankings. isready.ai is a Smart Squad product from Udine. It fetches the way those bots do and runs 32 checks. Each finding says what was observed, what it costs, and what to change. The score is versioned from 0 to 100. The content checks follow Aggarwal et al., GEO, KDD 2024: quotations, statistics, citations. An llms.txt file is noted and never moves the score.

```bash
npx isreadyai yourdomain.com --deep --md
```

That command, and the Markdown it writes, are free. You can also scan from the website with no account. A GitHub Action can fail the build when the score drops. A second pass can score whether a browser-capable agent can see the content and the controls.

Pro is €19 a month and Team is €49. Those cover monitoring, history, a badge, Ask-your-site, and fix pull requests. The scanner is open source. The hosted dashboard is the part you pay for.
