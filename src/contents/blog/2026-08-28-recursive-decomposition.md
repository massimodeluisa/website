---
title: Decompose the work, keep the window small
date: 2026-08-28
category: tech
excerpt: Model quality falls as a prompt grows, even when the text still fits the window. Recursive Decomposition is an Agent Skill that keeps the window small by sizing the input, splitting it into independent batches, and checking the merge against the files.
readingTime: 10
cover: /journal/2026-08-28/recursive-decomposition-og.png
coverAlt: Open Graph card for the Recursive Decomposition skill
---

When you ask a coding agent to reason over a whole repository, a folder of documents, or a set of PDFs that have to be compared, the usual move is to load as much as possible into the window and hope the model still sees the details. Zhang, Kraska, and Khattab showed that this hope is misplaced. In *[Recursive Language Models](https://arxiv.org/abs/2512.24601)* (arXiv:2512.24601, December 2025) they report that quality falls as the prompt grows, even when the text still fits. They call that fall *context rot*, following Hong et al. 2025. Retrieval misses, details in a long document drop out, and distant passages get glued together, yet the answer still looks confident.

Their fix treats the file as something the model looks through. The model peeks at the input, slices it, and calls itself over the snippets, so the active window stays small. [Recursive Decomposition](https://github.com/massimodeluisa/recursive-decomposition-skill) is the Agent Skill I published so that Claude Code, Codex, Cursor, and the other agents would do the same in an ordinary session.

The skill sizes the input before anyone opens a file and then filters it with searches. What remains is split into independent batches of five to ten files. Each batch goes to a sub-agent that answers and is forbidden to spawn more sub-agents. The merge is checked against a small window of the original files before the write-up is assembled in code, with paths and line numbers. This note is from 28 August, when the protocol I first put out in January 2026 became an installable skill.

## What the paper measured

![Figure 1 from Zhang, Kraska, and Khattab: GPT-5 versus RLM(GPT-5) on S-NIAH, OOLONG, and OOLONG-Pairs as input grows from 8k to 1M tokens](/journal/2026-08-28/rlm-figure-1.png){.img-right}

The paper is the literature the skill is built on. The place to start is Figure 1 and Table 1, because they put numbers on what "long context" costs. Figure 1, on the right, follows GPT-5 as the prompt grows from 8k to 1M tokens. GPT-5 holds on S-NIAH and then falls on OOLONG and OOLONG-Pairs. The red band marks the range past its 272k window. RLM at depth one stays up through that band.

BrowseComp-Plus is a multi-hop question-answering task whose inputs run from about six to eleven million tokens, far past GPT-5's 272k window. GPT-5 as a base model hits the context limit and scores nothing useful. Compaction, the usual summarise-as-you-go scaffold, reaches 70.5 percent, while RLM at depth one reaches 91.3 percent at an average cost of $0.99, with a standard deviation of 1.22. That costs more than compaction's $0.57 and less than a linear extrapolation of stuffing six to eleven million tokens into GPT-5-mini, which the paper puts between $1.50 and $2.75. On that row the authors report the RLM beating compaction and retrieval by more than 29 percent.

OOLONG is a linear aggregation task at 131k tokens. GPT-5 scores 44.0 on it, while RLM with GPT-5 at depth one scores 56.0 (a 28.4 percent relative gain). RLM with Qwen3-Coder picks up 33.3 percent over its own base. OOLONG-Pairs is the quadratic task, built on pairwise relations. It is only about 32k tokens long, well inside a million-token window. GPT-5 scores 0.1 F1 there, while RLM reaches 58.0 at depth one and 76.0 at depth three.

The paper also reports what the recursion costs. In Figure 11 the median RLM cost sits comparable to or under the base model's. The average can rise because trajectories are long-tailed (Observation 4), while the 95th percentile of runtime is dominated by sequential sub-calls. I did not rerun these experiments; every number in this section is theirs.

## Why it fires before the window is full

That OOLONG-Pairs row is the reason the skill does not wait for the input to overflow. The window size is a harness cap. Fitting inside it says nothing about the quality of the answer. Pairwise work, multi-hop work, and any job of the form "list everything and do not miss an item" rot inside a window that still has room, so the skill fires on dense work even when the files would have fitted.

Small jobs need none of this. The skill stays out of the way when the job is one file, one function, a single needle, or a one-page convert-to-markdown, because those you read directly. It also stays out when latency matters more than completeness or when coordinating sub-agents would cost more than one honest read.

## Size, filter, split, verify

The protocol comes from Section 5 of the paper, where current models acting as RLMs probe the input before they split the work. The skill turns that pattern into steps it can enforce. Sizing comes first and happens before anyone opens a file: the file count comes from glob or `find`, line counts from `wc -l`, bytes from `ls -lh`, and the page count from `pdfinfo` when the files are PDFs. Then the skill filters with searches, never with a recursive tree listing as a substitute. It chains those searches from file type to keyword to meaning, which is the same idea as the small loop in the paper that keeps only files matching `(database|connection|auth)` and only then reads them.

What remains is chunked by natural units (a function, a class, a section) when those exist. Files over 2,000 lines or 50 KB are chunked by line ranges instead. The third option is a keyword partition, so that all error handling sits in one batch and all route definitions sit in another. The unit matters because each batch has to make sense to a sub-agent that sees nothing else.

Recursion stays at one level. The parent writes down the batch count and launches one parallel wave of sub-agents, each with a self-contained brief that includes the files, the question, and the output schema. It merges what comes back and only then starts another wave, if batches remain. Sub-agents never spawn their own.

The paper's numbers cut both ways on depth. On GPT-5, OOLONG-Pairs F1 moves from 58.0 at depth one to 76.0 at depth three, so extra depth is real on that model. Qwen3-Coder-480B-A35B, on the other hand, makes syntax errors that spread into sub-calls. On that class of model, depth two and three can score worse than depth one (Table 1, Figure 4b). So the skill stays at depth one.

After the merge, verification pulls the cited locations and re-reads only those. If the answer disagrees with the files, the skill re-reads the disagreement instead of adding a second layer of delegation. Synthesis is programmatic: structured notes, deduplication, and categories come first, and the write-up with paths and line numbers is built from them. Through all of this, the main context never holds more than five files without a written batch plan. The same span never appears in two sub-agents either, because the partition is done once and the batches are disjoint.

## PDFs and Office files become text first

PDFs and Office files are the case that used to dump a binary into the window, so the skill converts them before anything else. It prefers local [anydoc](https://skills.sh/firecrawl/anydoc/convert-documents-to-markdown), run as `npx -y @firecrawl/anydoc FILE -o .firecrawl/out.md`, then greps the markdown it produces. If anydoc exits 3, the pages are scans. The next step is then `--ocr hosted` or cloud [`firecrawl parse`](https://skills.sh/firecrawl/cli/firecrawl-parse), which caps at 50 MB and costs about one credit per page. Files over 100 pages or 30 MB get split before parse. A one-page convert job is anydoc or parse alone and does not need this skill.

## Testing it on 131 mortgage PDFs

I test that path on a corpus I do not copy into the repo. The fixture is a git submodule, [tccao/mortgage-doc-rag](https://github.com/tccao/mortgage-doc-rag) (MIT), with 131 public-domain mortgage PDFs that add up to about 63 MB. Because CI does not clone it, missing files print `SKIP` instead of `ERROR`. The prompt is the same with the skill and without it. It asks the agent to size the tree without loading a PDF binary and to report how many files there are, the total bytes, and the ten largest. It then asks for at most three of those to be converted and their titles recovered from the markdown, all at depth one.

Size-first took 0.02 seconds with the skill. anydoc then converted two digital PDFs in 1.64 seconds and recovered their titles, Appraisal of Real Property and TILA-RESPA Integrated Disclosure. The largest file is a four-page scan, `urar_form_1004_epa_scan.pdf`, at 1,639,534 bytes. anydoc exited 3 on it. `firecrawl parse` took 15.45 seconds on that scan and returned its title, Uniform Residential Appraisal Report.

The naive path, `pdftotext` on all 131 files, took 1.65 seconds and extracted 0 bytes. On that scan it extracted 4 bytes and no title. That path is faster and blind on scans. The skill is slower because it OCRs the one file `pdftotext` cannot read, which is the file the prompt asked about.

The eval scripts around the corpus stay small. `bash .github/scripts/eval-skill.sh check` validates the trigger queries in `evals/trigger-queries.json` and, when the submodule is present, the PDF count, a byte floor, and the largest filename, while `score` compares agent runs with and without the skill. The gold expectations for the corpus eval are `decomposed: true`, `depth: 1`, `subagents_spawned_subagents: false`, at least 131 PDFs, and `urar_form_1004_epa_scan.pdf` in the largest list.

## Three jobs from start to finish

Three jobs show what a session looks like. For "find all error handling", the agent globs the sources, greps for `catch|throw|Error|except`, and batches the hits by module. Each batch goes to one sub-agent with a fixed report schema. The merge then comes back with file references.

For "what features are planned across all PRDs", the agent globs the documents and sizes them first. It then locks an extraction schema (name, priority, status, quarter) and sends one sub-agent per group of documents. After the merge it deduplicates the features and spot-checks three entries against the sources.

The third job is "summarise every TODO". The agent greps for `TODO|FIXME|HACK`, groups the hits by module, and extracts context and priority before it produces a list. When the output is long, it is generated section by section, stored, and then stitched together, which is how an RLM in the paper writes past a model's output limit.

## Trying it in a session

Since 28 August the protocol installs as a skill, which you add with the skills CLI:

```bash
npx skills add massimodeluisa/recursive-decomposition-skill
```

The command installs the skill listed at [skills.sh/massimodeluisa/recursive-decomposition-skill](https://skills.sh/massimodeluisa/recursive-decomposition-skill). Add `-g` for a user-level install, or `-a claude-code` (or another agent) to target one agent. In a session, `/recursive-decomposition` applies the protocol to the current task, while `/recursive-decomposition src/` sizes that path first. If a default is wrong, you can [edit it on GitHub](https://github.com/massimodeluisa/recursive-decomposition-skill).

## References

1. Zhang, Kraska, and Khattab, *Recursive Language Models*, arXiv:2512.24601, December 2025 (read in v3). [arxiv.org/abs/2512.24601](https://arxiv.org/abs/2512.24601)
2. Hong et al., 2025, cited by Zhang, Kraska, and Khattab as the source of the term *context rot*.
3. tccao, *mortgage-doc-rag*, GitHub, MIT license. [github.com/tccao/mortgage-doc-rag](https://github.com/tccao/mortgage-doc-rag)
