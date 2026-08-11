---
title: How I rebuilt deluisa.me
date: 2026-06-08
category: tech
excerpt: The old deluisa.me needed pinching to read on a phone, so I rebuilt it as static HTML on GitHub Pages, with the site, the journal, and the work pages in one repository and controls sized for a hand.
readingTime: 4
cover: /journal/2026-06-08/og-home.jpg
coverAlt: Open Graph card for deluisa.me, with Massimo De Luisa's portrait
---

The previous version of my portfolio looked fine on a desktop monitor. On a phone you had to pinch to read a paragraph, then pinch again after you followed a link. I was tired of sending people a page I would not open in my own pocket. I was also tired of personal sites that arrive like a product launch, with a hero that sells you a person.

I made the folder for the new site on 21 May 2026. GitHub Pages started serving [deluisa.me](https://deluisa.me) on 8 June. The site, this journal, and the work pages now live in one repository, where the build turns all of them into static HTML.

## A site I can keep and write next to

I wanted a site I could keep, write next to, and use from a phone without thinking about it. The first two wishes show up in how the site is built. The build writes static HTML for GitHub Pages to serve, so there is no CMS login anywhere in the process. A sentence lives in the same repository as the page that shows it, so when a sentence matters, its review is a pull request like any other change to the site.

## A header you can hit

The third wish, using the site from a phone, is where the header comes in. The header stays on screen while you scroll and is transparent at the top of the page. Further down it turns into a pill that holds a house icon, a clock on Rome time, and the menu. I ship iPad software for studios, so I already know what happens when a control is sixteen pixels wide and someone is wearing gloves. Apple's [44-point](https://developer.apple.com/design/tips/) target is the size I used for the language switcher, the contact control, and the button that takes you back to the top.

The hero at the top of the home page is allowed to show off a little, with a mesh gradient and a 3D portrait. After that the page should be quiet. I spent more time on whether the pill was hittable than on the portrait.

## Languages, a clock, and two Japanese domains

The Rome clock in the pill is there because that is the time zone I work in. The language you pick is stored, so a reader who chooses Italian does not get reset on the next visit. English is the default and Italian is finished, while Japanese, Russian, and Ukrainian have the chrome and the long copy is still catching up. A bad URL gets a real 404.

I also bought two Japanese domains, [出る.com](https://出る.com) and [デルイザ.com](https://デルイザ.com), because I am moving to Japan. Both come from one chain of sounds. De Luisa becomes Deruiza when it is said in Japanese, which is what デルイザ spells. The start of that name can be written 出る, which means "to go out".

## Pages a crawler can read

The journal and the work pages are Markdown files in the same repository until the build turns them into HTML along with the rest of the site. The same choice decides what a crawler sees. Training crawlers such as GPTBot generally do not run a browser, so a sentence that only appears after the page hydrates does not exist for them. Static HTML is how I write; it is also how those crawlers get the sentence. When I later published [isready.ai](https://isready.ai) to score that gap on other sites, this site had to pass the same test.

Motion on the page stops when the phone has asked for reduced motion. If a scroll animation still runs for that person, that is my bug. The same goes for a control that is hard to hit. The site is at [deluisa.me](https://deluisa.me). If a button is too small in your hand, that is the report I actually want.
