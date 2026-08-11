---
title: This went live in June
date: 2026-06-08
category: tech
excerpt: Repo on 21 May. GitHub Pages on 8 June 2026. How I built deluisa.me, and why the journal is Markdown in the same repository.
readingTime: 8
cover: /journal/2026-06-08/og-home.jpg
coverAlt: Open Graph card for deluisa.me, with Massimo De Luisa's portrait
---

I made the folder on 21 May 2026. On 8 June, GitHub Pages started serving [deluisa.me](https://deluisa.me). Twenty-odd days. I still open it on my phone first, because that is the version that used to embarrass me.

The old portfolio was fine on a monitor. In a pocket it asked you to pinch, then it asked you again. I was tired of that, and tired of sites that look like a product launch. Late, I am usually on X, watching Evil Rabbit and Evan Bacon and Guillermo Rauch talk about making things. I did not build this to look like anyone's homepage. Geist is on the page because it is Vercel's typeface, which is Evil Rabbit's world, and I liked how it sits. Evan is mobile craft. That is a thumb problem I already have. My README still says cleanliness and a high signal-to-noise ratio. I wrote that to myself.

I picked a stack that would spit out HTML. Vue 3 (the lockfile still calls it beta), Vite 8, Vue Router 5, vite-ssg. SSG is the unglamorous choice: GPTBot and the rest generally do not run a browser, so if a sentence is not in the first response it does not exist. Tailwind 4 does the layout until the utilities get stupid. Then Pug, and a little scoped SCSS. bun, because I was already in it. Strict TypeScript, oxlint, eslint. Adult supervision.

GSAP does the motion. ScrollTrigger, SplitText, DrawSVG, matchMedia. It is good, and it is also happy to ignore someone who asked their phone to calm down. `src/utils/motion.ts` exists so `prefers-reduced-motion` actually does something. If a scroll effect still runs at that person, that is my bug.

Geist Sans, Geist Mono, Geist Pixel. Self-hosted. Some leftover package still mentions Inter. I am not shipping Inter.

Those three weeks were mostly me arguing with spacing in a phone simulator, then opening the same page in Italian to see if the header still fit. The header is the piece I will fight you about. It stays on screen. Transparent at the top, then it turns into a pill. House icon, a clock on Rome time, hamburger. I ship iPad software. A control that is 16 pixels wide is a dare, and I already know how that dare ends in a studio with gloves. Apple writes [44 points](https://developer.apple.com/design/tips/) for a reason. Language switcher, contact, scroll-to-top: same rule.

The hero is allowed to show off a little. Mesh gradient, a 3D portrait of me. After that the page should shut up. I spent more time on whether the pill was hittable than on the portrait, which is probably the right ratio.

Viewport is `width=device-width, initial-scale=1.0`. I left pinch-zoom on. People pinch. [web.dev](https://web.dev/articles/responsive-web-design-basics) is blunt about the rest: the layout has to reflow, and the main nav cannot live only on hover. That is why the menu exists on a phone. Chrome's [viewport note](https://developer.chrome.com/docs/performance/insights/viewport) is the same story from the performance side (the old 300ms double-tap thing).

[WCAG 2.2](https://www.w3.org/TR/WCAG22/) stayed in my head for contrast, names on controls, and size. ARIA is on the header, the nav, the language switcher, the 404, the blog.

Rome time in the header is a small honesty. You can see where I am. The language you pick sticks in localStorage so Italian does not reset on the next visit. A bad URL gets a 404 page, not a white tab. The nav uses words. [Nielsen Norman](https://www.nngroup.com/articles/ten-usability-heuristics/) has been repeating instincts like that for decades.

English is the default. Italian is finished. Japanese, Russian, and Ukrainian have the chrome. The long copy is still catching up. Five locales was a day-one decision.

I bought two Japanese domains because I am moving there and they made me laugh: [出る.com](https://出る.com) and [デルイザ.com](https://デルイザ.com). De Luisa, Deruiza, 出る. To go out. To emerge.

The rest is plumbing I wanted on the first public HTML. vanilla-cookieconsent. RSS at [deluisa.me/rss.xml](https://deluisa.me/rss.xml). `llms.txt` at [deluisa.me/llms.txt](https://deluisa.me/llms.txt). OG images cooked at build with satori and resvg. The card at the top of this post is the one the site actually ships when someone pastes [deluisa.me](https://deluisa.me). An [isready.ai](https://isready.ai) badge, because I wrote the scanner and I should eat it. Dark and light `theme-color`. Manifest, favicons. The README spells out component order because Vue plus GSAP plus Tailwind 4 plus Pug will rot if files arrive however they feel like arriving.

Work and this journal are Markdown in the repo. `src/contents/blog/*.md`, compiled at build, then GitHub Pages. No CMS login, and no separate content database. I want writing to feel like shipping code. Drafts live next to the product. When it matters, review is a pull request. AI agents can read the source the same way humans do.

That is also why the stack spits out HTML. If a page only exists after client-side hydration, many AI crawlers never see it. A static Markdown pipeline is a workflow choice and a GEO choice at the same time.

I will use this journal for the unglamorous parts. How CTO decisions look when mobile, backend, and ops share one week. AI readiness: crawlers that do not run JavaScript, robots.txt mistakes, what a scan actually shows. Notes on shipping. If I cannot write next to the code, I will not write.

It is up: [deluisa.me](https://deluisa.me). If a button is too small in your hand, that is the report I actually want.
