---
title: SIDUS
eyebrow: Space engineering tools
role: Founder, product and systems architecture
summary: Open-source educational lab for orbital mechanics, propulsion, RF/ops and crew ECLSS — ~175 pure-SI calculators, public MCP, agent skill, and multi-language code export. Non-profit, not flight software.
seoTitle: SIDUS — open-source space engineering tools
seoDescription: SIDUS (sidus.tools) is an open-source educational lab with ~175 pure-SI space engineering calculators, public MCP endpoint, agent skill, and 10 UI locales.
highlights:
  - About 175 live tools across orbital, propulsion, satellite/RF, crew ECLSS, geometry, planetary and utilities — pure SI math in the browser.
  - "Agent-native surface: public Streamable HTTP MCP at sidus.tools/api/mcp, installable Agent Skill, and llms.txt for AI discovery."
  - Multi-language code export (C, C++, Rust, Zig, Python, JS/TS, MATLAB, Julia, Fortran, LaTeX) and 10 UI locales.
  - "Source quality enforced by tests: multi-reference bibliographies (Vallado, Curtis, NASA GRC, OCHMO, CelesTrak, JPL Horizons)."
---

**SIDUS: Transparent Space Engineering Math for Humans and Agents**

SIDUS (*sidus*, Latin for constellation / heavenly body) is a free educational lab for orbital mechanics, propulsion, satellite operations, launch, RF link budgets and crew ECLSS. It is independent and non-profit — not affiliated with NASA, ESA, SpaceX or any agency or company — and deliberately **not** flight software.

The product problem is simple: students, hobbyists and working engineers need fast, transparent SI checks without spinning up a mission-design suite. SIDUS answers that with a shared ToolShell pattern: SI inputs, pure functions under a physics library, results cards, optional orbit/trajectory plots, and “Edit this page on GitHub” on every tool.

As of 2026 the live catalog is on the order of **175 tools** across seven categories. Defaults use Earth gravitational parameter μ⊕ = 3.986004418×10¹⁴ m³/s² and equatorial radius 6 378 137 m (WGS-84 educational values). Models stay intentionally scoped: two-body and impulsive maneuvers, circular Clohessy–Wiltshire rendezvous, ideal rocket and ISA aero — not CR3BP design suites, n-body SPICE, or certified ECLSS.

What makes SIDUS different from a static formula page is the **agent surface**. AI clients can use a public MCP endpoint (`https://sidus.tools/api/mcp`) with no install, an Agent Skill (`npx skills add massimodeluisa/sidus-tools`), and a machine index at `/llms.txt`. Humans get ten UI locales and idiomatic code export so a Hohmann Δv can leave the page as Rust, Python or MATLAB.

Quality is treated as product, not decoration. Formula tools carry multi-source bibliographies (typically Vallado and Curtis as textbook backbone, plus NASA GRC, OCHMO, CelesTrak, JPL Horizons, satellite.js and RF references). Automated checks require resolvable source IDs with HTTPS URLs before a tool ships.

SIDUS is also a personal R&D sandbox: high-density UI patterns, physics purity, SEO/GEO for technical content, and learning how space tooling should feel when both a human and an LLM need the same number. Results should always be cross-checked against mission design software and standards before any flight decision.
