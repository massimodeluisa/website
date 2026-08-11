---
title: isready.ai
eyebrow: クローラは読めるか
role: CTO / プロダクトとプラットフォーム設計
summary: ページを指定すると、GPTBot や ClaudeBot が記事を受け取ったのか、空の文書なのかを返します。スキャンと修正文は無料です。点数を見守り続ける監視は、ホスティング側です。
seoTitle: isready.ai、AI クローラはページを読めるか
seoDescription: isready.ai をページに向けると、GPTBot や ClaudeBot が記事を受け取ったかが分かります。32 項目。スキャンと Markdown の修正は無料。監視は Pro €19、Team €49。
highlights:
  - 32 項目で、0 から 100 の点数です。それらのクローラは原則 JavaScript を実行しないので、Chrome では完成に見えるページが空で届くことがあります。
  - "ターミナルでは `npx isreadyai` が無料でフルスキャンを実行し、深いスキャンも含め、修正を Markdown で書けます。"
  - Pro は月 €19、Team は €49 です。監視、履歴、バッジ、Ask-your-site のためで、スキャン自体にはどちらも要りません。
  - GitHub Action は点数が下がったときにビルドを失敗させられます。次のパスは、ブラウザを使えるエージェントがページを見られるかを採点します。
---

[isready.ai](https://isready.ai) が答える問いは一つです。GPTBot、ClaudeBot、PerplexityBot、OAI-SearchBot がそのページを取得したとき、記事は届いているか。

Chrome は JavaScript を実行します。それらのクローラは、原則として実行しません。React や Vue のアプリはブラウザでは完成に見えても、空の文書を渡すことがあり、チャレンジページは通常の検索順位に触れずに回答から外すことがあります。isready.ai はウーディネの Smart Squad のプロダクトです。それらのボットと同じ取り方で取得し、32 項目を実行します。各指摘は、何が見えたか、何を失うか、何を変えるかを書きます。点数はバージョン付きで、0 から 100 です。内容の検査は Aggarwal ら、GEO、KDD 2024 に従います。引用、統計、出典です。llms.txt は記録されますが、点数は動きません。

```bash
npx isreadyai yourdomain.com --deep --md
```

このコマンドと、それが書く Markdown は無料です。アカウントなしでサイトからもスキャンできます。GitHub Action は点数が下がるとビルドを失敗させられます。次のパスは、ブラウザを使えるエージェントが内容と操作を見られるかを採点できます。

Pro は月 €19、Team は €49 です。監視、履歴、バッジ、Ask-your-site、修正の pull request がそこに入ります。スキャナーはオープンソースです。支払うのはホスティングされたダッシュボードです。
