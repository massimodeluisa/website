---
title: SIDUS
eyebrow: Space checks in the browser
role: Founder, product and systems architecture
summary: You open a page, enter the inputs, and get a space-engineering number in SI, with the formula next to it. There are 201 of these, free in the browser, and you do not need an account.
seoTitle: SIDUS, a space check you can read
seoDescription: Open a SIDUS page, enter the inputs, and get a space-engineering number in SI with the formula beside it. 201 tools, free, no account. The same check is on a public URL.
highlights:
  - Orbital mechanics, propulsion, RF link budgets, and crew life support. If a default looks wrong, the page links to the edit on GitHub.
  - The same check is a public call at https://sidus.tools/api/mcp, so a client can use it without a second copy of the physics.
  - I write software, and I am not a space engineer. Review the formula, and any code you export, before you trust it.
  - "As of 4 September 2026 the catalog is 201 tools. Defaults are teaching values for Earth, and the models stay small on purpose."
---

I write software, and I am not a space engineer. I published [sidus.tools](https://sidus.tools) so a check would be a page you can read: the inputs, the formula, and a number in SI.

As of 4 September 2026 there are 201 tools. You can run a transfer, a link budget, a rocket equation, a cabin atmosphere. They run in the browser. There is no account. The project is independent, with no agency behind it.

The page and the public URL use the same function. On 13 August 2026 a Hohmann transfer from about 200 km LEO to GEO came back as 3931.86 m/s in both places. If that number is wrong on the page, it is wrong on the URL, and you fix it once.

Defaults use ordinary Earth values for teaching (μ⊕ = 3.986004418×10¹⁴ m³/s², equatorial radius 6 378 137 m). The models stay small: two-body, impulsive burns, circular relative motion, an ideal rocket, standard-atmosphere aero. Two-body pages cite Vallado and Curtis. A page can export the calculation into code you can compile. Review it before you trust it.

The catalog is also at [https://sidus.tools/api/mcp](https://sidus.tools/api/mcp). You point a client at that URL. Source: [github.com/massimodeluisa/sidus-tools](https://github.com/massimodeluisa/sidus-tools).
