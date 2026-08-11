---
title: How I rebuilt deluisa.me
date: 2026-06-08
category: tech
excerpt: I started the repo on 21 May 2026 and GitHub Pages started serving it on 8 June. Vue, Vite, and Markdown in the same tree. This is how the site is put together, and why the journal lives next to the code.
readingTime: 7
cover: /journal/2026-06-08/og-home.jpg
coverAlt: Open Graph card for deluisa.me, with Massimo De Luisa's portrait
---

I made the folder on 21 May 2026. On 8 June, GitHub Pages started serving [deluisa.me](https://deluisa.me). Twenty days, then whatever I have been changing since. The previous portfolio looked fine on a desktop monitor. On a phone you had to pinch to read anything, then pinch again after you followed a link, and I was tired of sending people a page I would not open in my own pocket. I was also tired of personal sites that arrive like a product launch, with a hero that sells you a person. I wanted something I could keep, write next to, and use from a phone without thinking about it.

Late at night I am usually on X, watching Evil Rabbit, Evan Bacon, and Guillermo Rauch talk about making things. I did not set out to copy anyone's homepage. Geist is on the page because it is Vercel's typeface, which is Evil Rabbit's world, and I liked how it sits at small sizes. Evan's work is about mobile craft, which is the same thumb problem I already have when I ship iPad software.

## Stack

The stack is the one I already use to ship: Vue 3, Vite, Pug templates, Tailwind tokens, TypeScript. `vite-ssg` pre-renders the routes to static HTML at build time. GitHub Pages just serves the files. There is no Node process waiting on a request, and no CMS login. If I cannot write a sentence next to the component it describes, I will not write.

## The header

The header is the piece I spent the most time arguing with. It stays on screen while you scroll. At the top of the page it is transparent, then it turns into a pill with a house icon, a clock on Rome time, and the menu. I ship iPad software for studios, so I already know what happens when a control is sixteen pixels wide and someone is wearing gloves. Apple's [44-point](https://developer.apple.com/design/tips/) target exists for a reason, and I applied the same size to the language switcher, the contact control, and the button that takes you back to the top.

The hero is allowed to show off a little: a mesh gradient and a 3D portrait. After that the page should be quiet. I spent more time on whether the pill was hittable than on the portrait, which is the ratio I wanted.

## Locales and the Rome clock

The Rome clock is a small honesty about where I am. The language you pick is stored so Italian does not reset on the next visit. A bad URL gets a real 404 page. English is the default, Italian is finished, and Japanese, Russian, and Ukrainian have the chrome while the long copy is still catching up. Five locales was a day-one decision because I did not want to bolt them on later.

I bought two Japanese domains because I am moving there and they made me laugh: [出る.com](https://出る.com) and [デルイザ.com](https://デルイザ.com). De Luisa, Deruiza, 出る: to go out, to emerge.

## Why the journal is Markdown in this repo

Work case studies live in `src/contents/works`. This journal lives in `src/contents/blog`. Both are Markdown files in the same repository, compiled when the site is built, then served as HTML from GitHub Pages. There is no CMS login and no separate content database. Drafts sit next to the product. When something matters, the review is a pull request. An agent can read the source the same way a person can.

That is also why the pages are static HTML. Training crawlers such as GPTBot generally do not run a browser, so a sentence that only appears after client-side hydration does not exist for them. Putting Markdown through a static pipeline is a workflow choice and a way to keep the site readable to those crawlers at the same time. I later published [isready.ai](https://isready.ai) to score that gap on other people's sites. This one had to pass the same test.

## Motion

GSAP does the motion on the page. It is good at that, and it is also happy to keep animating after someone has asked their phone to calm down. `src/utils/motion.ts` exists so `prefers-reduced-motion` stops those effects. If a scroll animation still runs for that person, that is my bug.

I will use this journal for the unglamorous parts of shipping: how a week looks when mobile, backend, and ops share it, what a crawler fetched, notes that would otherwise live in a pull request. The site is up at [deluisa.me](https://deluisa.me). If a button is too small in your hand, that is the report I actually want.
