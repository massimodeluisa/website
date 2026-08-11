# AI-readiness fix plan for deluisa.me

## Context for the AI agent

You are an autonomous coding agent working on the codebase that serves https://deluisa.me/. An AI-readiness audit (isready.ai, score v2026.06.2, 2026-08-11) scored this site **92/100 (excellent)**. Your task is to fix the findings below so the site becomes fully readable by AI crawlers (GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot) and AI search engines.

Ground rules:

1. Most AI crawlers do NOT execute JavaScript â every fix must land in the **server-rendered HTML**, not client-side.
2. Work through findings in order (failures first, then warnings); they are sorted by impact.
3. The `evidence` blocks contain the exact observed values â use them to locate the problem.
4. After your changes, verify with `npx isreadyai deluisa.me` (or curl the page without JS and inspect the HTML).
5. Do not fabricate content: where a fix needs copy (descriptions, author names), derive it from the existing site content.

## Findings to fix (1 failed, 2 warnings)

### 1. [FAIL] Images carry alt text

- **Check id:** `rendering.image-alt` (category: rendering)
- **Observed:** only 1/16 images have alt text â invisible to multimodal extraction
- **Required change:** Add descriptive alt attributes to every meaningful image (empty alt="" for decorative ones).
- **Priority:** impact medium, effort low
- **Evidence:**

```json
{
  "images": 16,
  "withAlt": 1,
  "coverage": 0.06
}
```

### 2. [WARN] Author & E-E-A-T signals

- **Check id:** `structured.author-eeat` (category: structured_data)
- **Observed:** no entity-identity signals (E-E-A-T)
- **Required change:** add an Organization with logo and sameAs links (or author markup) to establish E-E-A-T.
- **Priority:** impact low, effort low
- **Evidence:**

```json
{
  "mode": "entity",
  "orgWithIdentity": false,
  "metaAuthor": true
}
```

### 3. [WARN] Strict-Transport-Security header is present

- **Check id:** `trust.hsts` (category: trust)
- **Observed:** No Strict-Transport-Security header.
- **Required change:** Add a Strict-Transport-Security header (e.g. max-age=31536000; includeSubDomains) to enforce HTTPS on every request.
- **Priority:** impact low, effort low
- **Reference:** https://developer.mozilla.org/docs/Web/HTTP/Headers/Strict-Transport-Security
- **Evidence:**

```json
{
  "present": false
}
```

## Acceptance criteria

- All 1 failed checks pass on re-scan.
- No previously passing check regresses.
- The fixes are visible in the raw HTML response (verify with `curl`, not a browser).

