---
title: SIDUS
eyebrow: Space engineering tools
role: Founder, product and systems architecture
summary: Open-source educational space-engineering calculators in the browser. 201 tools as of 4 September 2026. Pure SI. MIT. Orbital mechanics, propulsion, RF, crew ECLSS.
seoTitle: SIDUS, open-source space engineering tools
seoDescription: sidus.tools is a free educational set of 201 pure-SI space-engineering calculators in the browser. MIT license. Formulas should be reviewed and tested.
highlights:
  - "201 calculators in the browser: orbital, propulsion, satellite/RF, crew ECLSS, geometry, planetary, utilities. Pure SI."
  - Textbook trail on the pages (Vallado and Curtis for two-body). If a default is wrong, the fix path is Edit on GitHub.
  - Code export in C, C++, Rust, Zig, Python, JS/TS, MATLAB, Julia, Fortran, LaTeX.
  - "Public MCP at https://sidus.tools/api/mcp (Streamable HTTP). Agent Skill: `npx skills add massimodeluisa/sidus-tools --skill sidus`."
  - I write software, and I am not a space engineer. Formulas and exportable code should be reviewed and tested.
---

**SIDUS: educational space-engineering calculators**

I write software, and I am not a space engineer. I published [sidus.tools](https://sidus.tools) so these checks would live in SI, on a page I could read, and on a protocol a client could hit without a second physics library quietly drifting.

SIDUS (*sidus*, Latin for constellation) is a free, open-source set of educational calculators for orbital mechanics, propulsion, satellite ops, launch, RF link budgets, and crew ECLSS. 201 tools as of 4 September 2026. Pure SI. MIT. They run in the browser. No account. Independent project, no agency affiliation.

The point is a fast SI check you can actually see: inputs, the formula, the result, optional plots, and Edit this page on GitHub. Defaults use educational WGS-84-class Earth values (μ⊕ = 3.986004418×10¹⁴ m³/s², equatorial radius 6 378 137 m). Models stay small on purpose: two-body, impulsive burns, circular Clohessy-Wiltshire, ideal rocket, ISA aero.

Formula pages carry a bibliography (Vallado and Curtis as the two-body backbone, plus NASA-class references where they apply). Automated checks want real HTTPS source URLs before a tool ships. Next to Hohmann sit Lambert, SGP4, a live orbital view, Tsiolkovsky, an RF link budget, cabin atmosphere, and an Earth-Mars porkchop sketch.

The same catalog is on a public MCP at https://sidus.tools/api/mcp (Streamable HTTP). You point a client at that URL. No clone. Agent Skill, if you want it that way: `npx skills add massimodeluisa/sidus-tools --skill sidus`.

If you want the same number in your own stack, pages can export code (C, C++, Rust, Zig, Python, JS/TS, MATLAB, Julia, Fortran, LaTeX). The formulas and that exportable / executable code should be reviewed and tested.
