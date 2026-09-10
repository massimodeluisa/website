---
title: How I cracked Firecrawl Cheat Code
date: 2026-09-10
category: tech
excerpt: Firecrawl's CheetCode v3 is a 240-second hiring CTF, and my orchestrator took the Smart Squad account to rank 1 with zero retries, but the traps a language model misses on its own still needed a person reading the dump and the Kattis page.
readingTime: 10
cover: /journal/2026-09-10/cheetcode-profile.jpg
coverAlt: CheetCode profile for Smart Squad, level 3 reached, rank 1, 60 tasks solved
---

Firecrawl published [CheetCode v3](https://ctf.firecrawl.dev) as a hiring test for people they call agent orchestrators. The test is sixty tasks in 240 seconds, with your GitHub account as your row on the leaderboard. I ran it twice; the first session was on 29 August 2026. On the studio account, [Smart Squad](https://www.smartsquad.io), the board shows 60/60, Elo 3850, zero retries, and rank 1. On my personal GitHub, [massimodeluisa](https://github.com/massimodeluisa), I also solved sixty of sixty and filled Elo, but forty-three retries already sat on that row, which put me third, then fifth when cleaner accounts arrived. The card at the top is the studio profile when we were done.

I had a good time with it. A language model left alone misses the landmines in the problem text. It does not notice that Interstellar Fuel wants 300 and not the true minimum of 200. Nor does it recover the turning convention Firecrawl had stripped from Bio Trip. Those catches came from sitting with a dump, a Kattis page, and a suspicion.

The clocks add up to the number on the homepage (sixty seconds, sixty again, two minutes). Each retry also lowers a multiplier on the account. I wanted something that could read a board, write code, check it locally, and submit while still telling me why a run had died.

## Three levels in four minutes

The first level, Orchestrate, gives you twenty-five JavaScript puzzles in sixty seconds. Easy cards are arithmetic in costume (basketball scores, paint mixers, fuel per kilometer), while medium and hard cards are real algorithms, with two sample tests on the card and more hidden on the server. Some of those are ICPC problems from [Kattis](https://open.kattis.com), North America East. The function name on the card is the Kattis slug, so the official statement is one search away.

Explore, the second level, asks ten questions in sixty seconds, each of which requires you to read a source. The sources I saw were Chromium, Firefox, LibreOffice, and Postgres. Guessing from training data misses. I fetched the document and answered from it, with a scrape in the loop. Explore appears only after twenty-five out of twenty-five on Orchestrate, which means a 19/25 finish stays partial. Build, the third level, is one system with twenty-five checks and two minutes on the clock, in which you have to stand the system up and show that it works.

Some Orchestrate cards also hide *landmines*, prompt-injection in the problem text such as a `[SYSTEM]` line, a token like `lm_…`, or a comment such as `@provenance-…`. If the code you submit echoes one of them, the grader takes two hundred points, which is the value of five correct cards. The speed bonus is small by comparison, about a third of a point per leftover second. Landmines cost more than they look. I learned that on an early run, where seventeen solved cards with two injections scored two hundred and ninety-one points and a cleaner twelve-card run scored higher. After that I got the landmines right first.

## How the board ranks you

The leaderboard sorts on Elo, then on total retries when two people share the same Elo. The `score` on a finish payload belongs to the round, while Elo belongs to the account and caps at 3850. On paper the clock gives you four seconds a task, although in practice the first level gives you sixty seconds for twenty-five cards.

![CheetCode v3 global leaderboard with massimodeluisa in third, 60 of 60 solved, 43 retries](/journal/2026-09-10/cheetcode-board-personal.jpg){.img-left}

This is [ctf.firecrawl.dev](https://ctf.firecrawl.dev) the night before the studio run. I am third as `@massimodeluisa`, sixty out of sixty, Elo 3850, with forty-three retries already spent on the personal account. Then the board filled with people who had a second GitHub account: one identity ate the retries and learned the pool, while the other kept a clean multiplier and posted the score. I ran it again as the studio.

That second run was three finishes, one per level, with nothing extra. Orchestrate came back 25/25 in 225 milliseconds, Explore 10/10 in twelve milliseconds, and Build 25/25 with 119 seconds still on the clock. Elo went 1270, then 2320, then 3850, with zero retries and rank 1.

![CheetCode v3 after the Smart Squad run: smartsquad-team first with zero retries, massimodeluisa still on the board](/journal/2026-09-10/cheetcode-board-squad.jpg){.img-right}

This is the same board after the studio pass, with `smartsquad-team` signed in and first, zero retries, Elo 3850. The personal row is still there in fifth place, with the forty-three retries still attached to it. Both rows have sixty of sixty and Elo 3850, so the tiebreak on retries is what separates them.

## Two models and a local Firecrawl

[Grok](https://x.ai), running as Grok Build in the terminal, wrote and ran the orchestrator. [Claude](https://claude.ai) sat on the same dumps and argued about the scoring formula, about whether a timeout was a wrong answer, and about whether a template that passed two samples would survive the hidden tests. I wanted two models that did not share a context window, so that a mistake in one place had a chance of getting caught in the other.

Grok is where the code moved. It sits in the repo, runs `cargo test`, starts Docker, and has the Firecrawl MCP on the same machine. Claude is where I sent a dump and a suspicion when I wanted a second pair of eyes that had not just written the function. The two disagreed on whether a Node timeout should empty a template, on whether leftover seconds should be burned on a second LLM pass, and on whether a 19/25 scoreboard tweet meant the level was cleared. I kept the disagreements that came with numbers.

Firecrawl itself ran in Docker on this machine, bound to `127.0.0.1:3002`, rather than on Firecrawl Cloud. Firecrawl belonged on localhost because the product under test is Firecrawl. I also did not want the cloud quota or their hosted extract in the inner loop. The self-hosted image has scrape and search but does not have `/interact`, which was enough for Orchestrate, because the contest statements live on [Kattis](https://open.kattis.com) and a scrape returns a document. When a card was a Kattis problem with a truncated statement, I scraped the official page through that local instance and got the input format the dump had cut off.

## A small Rust orchestrator

The orchestrator is a small Rust program. It signs in with GitHub, pulls the twenty-five cards, and tries them in order of cost. Deterministic heuristics go first, for the word-problem arithmetic, followed by a bank of JavaScript solvers keyed on the function name, which is the Kattis slug when the card is a contest problem. Whatever is left goes to Vercel AI Gateway with `openai/gpt-oss-120b`, in batches of two, with Groq then Cerebras pinned for latency.

Every candidate runs in Node against the two samples on the card. Failures are dropped so that a known-bad function never reaches `finish`. HTTP stays in RAM until the timer ends. Then the session is dumped with its cards, code, traces, and the finish payload.

## Replaying boards to save retries

That dump is what Claude and Grok read, which mattered because a live play costs a retry. We replayed saved boards offline until the competitive cards on those boards were hits. Only then did I authorize one real session. Direct templates take milliseconds, while the language model eats the rest of the minute.

A retry multiplier ticks down about seven thousandths per session. I treated that as a real cost, even though the `score` field on a finish payload is still `40 × solved + speed + trickery` with no multiplier applied. I still do not know where the multiplier lands. I do not want to find out by pressing play to debug a heading function.

## Where it broke

The Kattis cards are the ones a 120B model will not finish in three seconds. [Pearls](https://open.kattis.com/problems/pearls) is a Masyu loop. [Walk in the Woods](https://open.kattis.com/problems/walkinthewoods) is an orthogonal graph with interest capacities. A naive simulation at `n = 2500` is millions of steps, so the template jumps whole cycles while the topology is fixed. [Balancing Art](https://open.kattis.com/problems/balancingart) is a binary search on a flow (Dinic), which fitting a formula to two samples would miss.

[Fences Make Good Neighbors](https://open.kattis.com/problems/fencesmakegoodneighbors) is a pentagon fan plus a minimum triangulation of the pockets. [Hilbert's Hedge Maze](https://open.kattis.com/problems/hilbertshedgemaze) and [Stable Table](https://open.kattis.com/problems/stabletable) passed the samples and then returned `TIMEOUT` on the hidden tests. The samples are tiny and the Kattis limits are not (`n ≤ 50`, a 100×100 block of pieces), so a template can look correct locally and still run out of time on the server.

The grader also does not always want the mathematical minimum. One medium card, Interstellar Fuel Optimization, has samples that reject the global minimum. Filling the tank at price zero and carrying leftover fuel costs 200, but the samples want 300. That 300 is the textbook hop DP, where from station `i` to `j` you pay `price[i] × (d[j] − d[i])`, jump no longer than capacity, and arrive empty. An LLM that "repairs" toward the true optimum will converge on 200 and fail forever, so I stopped sending that class of card to the model and shipped the recurrence the samples encode.

The landmine scrub had to be careful as well. A line-based filter deleted a `[SYSTEM]` sentence together with the real spec on the same line. A token scan by byte index panicked on a curly apostrophe (`U+2019`) in a Fences statement. Either of those would have taken down a live run. Comments are stripped from generated JS. Arguments are cloned before Node runs them, because a candidate that does `distances.push(target)` otherwise poisons the repair prompt with an input the card never had.

Repair is two rounds that run only on cards that are not templates, fed with the grader's hidden-test line when we have it. A local `2/2 pass` is the wrong signal. The model is told to write vanilla JavaScript only, with no `MinPriorityQueue` and no LeetCode globals. Temperature starts low and goes up on the second round, so the second try is not a copy of the first.

[Bio Trip](https://open.kattis.com/problems/biotrip), a tractor-and-junction Kattis problem, failed a live hidden test after the samples were green. The local Firecrawl scrape of the Kattis statement recovered the turning convention (`α1` left, `α2` right) and a U-turn case the CTF board had replaced. The code treated `norm(180)` as a left turn only, so a legal map with `α2 = 180` and `α1 < 180` returned `impossible`. It is one line that costs four seconds if you find it on the clock.

## What a person still had to catch

A language model on its own does not uncover the landmines, the sample that wants a worse number than the optimum, or the 180-degree turn that only exists on the real Kattis page. Those needed a person looking at a dump and a statement. On the studio account I posted rank 1, sixty of sixty, with no retries. On the GitHub account that is mine, I finished third, then fifth, because of the forty-three retries already attached to the row.
