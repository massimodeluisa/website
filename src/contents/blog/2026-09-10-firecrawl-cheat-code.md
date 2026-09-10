---
title: How I cracked Firecrawl Cheat Code
date: 2026-09-10
category: tech
excerpt: "Firecrawl ran CheetCode v3 as a 240-second hiring CTF. I ran it on my GitHub first, then again as Smart Squad: 60/60, L3, rank 1, Elo 3850/3850, zero retries."
readingTime: 10
cover: /journal/2026-09-10/cheetcode-profile.jpg
coverAlt: CheetCode profile for Smart Squad, level 3 reached, rank 1, 60 tasks solved
---

Firecrawl published [CheetCode v3](https://ctf.firecrawl.dev) as a hiring test for people they call agent orchestrators: sixty tasks, two hundred and forty seconds, GitHub as the row on the leaderboard. I ran it twice. On the studio account, [Smart Squad](https://www.smartsquad.io), the board shows 60/60, Elo 3850, zero retries, rank 1. On my personal GitHub, [massimodeluisa](https://github.com/massimodeluisa), I also solved sixty of sixty and filled Elo, but forty-three retries already sat on that row, which put me third, then fifth when cleaner accounts arrived. The card at the top is the studio profile when we were done. First session 29 August 2026.

I had a good time with it. The interesting part is not the scoreboard. A language model left alone does not find the landmines in the problem text, does not notice that Interstellar Fuel wants 300 and not the true minimum of 200, and does not recover the turning convention Firecrawl had stripped from Bio Trip. Those catches came from sitting with a dump, a Kattis page, and a suspicion. The clocks add up to the number on the homepage (sixty seconds, sixty again, two minutes), and a retry lowers a multiplier on the account. I wanted something that could read a board, write code, check it locally, and submit, and still tell me why a run had died.

## The board

### Orchestrate, level 1

Twenty-five JavaScript puzzles in sixty seconds. Easy cards are arithmetic in costume: basketball scores, paint mixers, fuel per kilometer. Medium and hard ones are real algorithms, with two sample tests on the card and more hidden on the server. Some of those are ICPC problems from [Kattis](https://open.kattis.com), North America East. The function name is the Kattis slug, so the official statement is one search away.

### Explore, level 2

Ten questions in sixty seconds, and you have to read a source. The ones I saw were Chromium, Firefox, LibreOffice, and Postgres. Guessing from training data misses. I fetched the document and answered from that, with a scrape in the loop. You need twenty-five out of twenty-five on Orchestrate before this level appears. A 19/25 finish stays partial.

### Build, level 3

One system, twenty-five checks, two minutes. You stand it up and show it works.

Some Orchestrate cards hide prompt-injection in the problem text: a `[SYSTEM]` line, a token like `lm_…`, a comment `@provenance-…`. If the code you submit echoes those, the grader takes two hundred points, which is five correct cards. Speed bonus is small, about a third of a point per leftover second. Landmines cost more than they look. I found that on an early run: seventeen solved, two injections, two hundred and ninety-one points. A cleaner twelve-card run scored higher. After that I got the landmines right first.

## Ranking

The board sorts on [Elo](https://grokipedia.com/page/Elo_rating_system), then on total retries when two people share the same Elo. The `score` on a finish payload is the round. Elo is the account. The cap is 3850. On paper the clock is four seconds a task. In practice the first level is sixty seconds.

![CheetCode v3 global leaderboard with massimodeluisa in third, 60 of 60 solved, 43 retries](/journal/2026-09-10/cheetcode-board-personal.jpg){.img-left}

This is [ctf.firecrawl.dev](https://ctf.firecrawl.dev) the night before the studio run. I am third as `@massimodeluisa`, sixty out of sixty, Elo 3850, forty-three retries already spent on the personal account. Then the board filled with people who had a second GitHub account. One identity ate the retries and learned the pool. The other kept a clean multiplier and posted the score. I ran it again as the studio.

That second run was three finishes, one per level, nothing extra. Orchestrate came back 25/25 in 225 milliseconds, Explore 10/10 in twelve milliseconds, Build 25/25 with 119 seconds still on the clock. Elo went 1270, then 2320, then 3850, zero retries, rank 1.

![CheetCode v3 after the Smart Squad run: smartsquad-team first with zero retries, massimodeluisa still on the board](/journal/2026-09-10/cheetcode-board-squad.jpg){.img-right}

Same board after the studio pass: `smartsquad-team` is signed in, first, zero retries, Elo 3850. The personal row is still there, fifth, with the forty-three retries still attached to it.

## How I ran it

[Grok](https://x.ai) (Grok Build, in the terminal) wrote and ran the orchestrator. [Claude](https://claude.ai) sat on the same dumps and argued about the scoring formula, about whether a timeout was a wrong answer, about whether a template that passed two samples would survive the hidden tests. I wanted two models that did not share a context window. A mistake in one place had a chance of getting caught in the other. Firecrawl ran in Docker on this machine, bound to `127.0.0.1:3002`, not on Firecrawl Cloud. When a card was a Kattis problem with a truncated statement, I scraped the official page through that local instance and got the input format the dump had cut off.

The orchestrator is a small Rust program. It signs in with GitHub, pulls the twenty-five cards, and tries them in order of cost. Deterministic heuristics first, for the word-problem arithmetic. Then a bank of JavaScript solvers keyed on the function name, which is the Kattis slug when the card is a contest problem. Then Vercel AI Gateway with `openai/gpt-oss-120b` for whatever is left, in batches of two, with Groq then Cerebras pinned for latency. Every candidate runs in Node against the two samples on the card. Failures are dropped so a known-bad function never reaches `finish`. HTTP stays in RAM until the timer ends, then the session is dumped: cards, code, traces, the finish payload.

That dump is what Claude and Grok read. A live play costs a retry. We replayed saved boards offline until the competitive cards on those boards were hits, then I authorized one real session. Direct templates are milliseconds. The language model eats the rest of the minute. A retry multiplier ticks down about seven thousandths per session. I treated that as a real cost even though the `score` field on a finish payload is still `40 × solved + speed + trickery` with no multiplier applied. I still do not know where the multiplier lands. I do not want to find out by pressing play to debug a heading function.

Grok is where the code moved. It sits in the repo, runs `cargo test`, starts Docker, and has the Firecrawl MCP on the same machine. Claude is where I sent a dump and a suspicion when I wanted a second pair of eyes that had not just written the function. They disagreed on whether a Node timeout should empty a template, on whether leftover seconds should be burned on a second LLM pass, on whether a 19/25 scoreboard tweet meant the level was cleared. I kept the disagreements that came with numbers. Firecrawl belonged on localhost because the product under test is Firecrawl, and I did not want the cloud quota or their hosted extract in the inner loop. The self-hosted image has scrape and search. It does not have `/interact`. For Orchestrate that was enough. The contest statements live on [Kattis](https://open.kattis.com), and a scrape returns a document.

## Where it broke

The Kattis cards are the ones a 120B model will not finish in three seconds. [Pearls](https://open.kattis.com/problems/pearls) is a Masyu loop. [Walk in the Woods](https://open.kattis.com/problems/walkinthewoods) is an orthogonal graph with interest capacities; a naive simulation at `n = 2500` is millions of steps, so the template jumps whole cycles while the topology is fixed. [Balancing Art](https://open.kattis.com/problems/balancingart) is binary search on a flow, Dinic. Fitting a formula to two samples would miss it. [Fences Make Good Neighbors](https://open.kattis.com/problems/fencesmakegoodneighbors) is a pentagon fan plus minimum triangulation of the pockets. [Hilbert's Hedge Maze](https://open.kattis.com/problems/hilbertshedgemaze) and [Stable Table](https://open.kattis.com/problems/stabletable) passed the samples and then returned `TIMEOUT` on the hidden tests, because the samples are tiny and the Kattis limits are not (`n ≤ 50`, a 100×100 block of pieces).

The grader does not always want the mathematical minimum. One medium card, Interstellar Fuel Optimization, has samples that reject the global minimum. Filling the tank at price zero and carrying leftover fuel costs 200. The samples want 300. That 300 is the textbook hop DP: from station `i` to `j`, pay `price[i] × (d[j] − d[i])`, jump no longer than capacity, arrive empty. An LLM that "repairs" toward the true optimum will converge on 200 and fail forever. I stopped sending that class of card to the model and shipped the recurrence the samples encode.

Landmine scrub had to be careful. A line-based filter deleted a `[SYSTEM]` sentence and the real spec on the same line. Token scan by byte index panicked on a curly apostrophe (`U+2019`) in a Fences statement. Either of those would have taken down a live run. Comments are stripped from generated JS. Arguments are cloned before Node runs them, because a candidate that does `distances.push(target)` otherwise poisons the repair prompt with an input the card never had.

Repair is two rounds, only on cards that are not templates, and it is fed the grader's hidden-test line when we have it. A local `2/2 pass` is the wrong signal. The model is told vanilla JavaScript only: no `MinPriorityQueue`, no LeetCode globals. Temperature starts low and goes up on the second round so the second try is not a copy of the first.

[Bio Trip](https://open.kattis.com/problems/biotrip), a tractor-and-junction Kattis problem, failed a live hidden test after the samples were green. The local Firecrawl scrape of the Kattis statement recovered the turning convention (`α1` left, `α2` right) and a U-turn case the CTF board had replaced. `norm(180)` was treated as a left turn only, so a legal map with `α2 = 180` and `α1 < 180` returned `impossible`. One line, and it costs four seconds if you find it on the clock.

## What I take from it

I had fun. The test is a good one because a language model on its own does not uncover the whole board: the landmines, the sample that wants a worse number than the optimum, the 180-degree turn that only exists on the real Kattis page. Those needed a person looking. On the studio account I posted rank 1, sixty of sixty, no retries, and that is a technical win against the field that was on the board that night. Realistically, on the GitHub that is mine, I finished third, then fifth, because of the forty-three retries already attached to the row. Thank you to Firecrawl for a challenge that was fun to sit with.
