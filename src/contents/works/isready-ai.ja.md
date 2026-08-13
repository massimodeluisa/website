---
title: isready.ai
eyebrow: AI readiness と GEO
role: CTO / プロダクトとプラットフォーム設計
summary: 無料のオープンソース監査。GPTBot や ClaudeBot がページを取ったとき、記事が届くか。32 チェック。CLI のディープスキャンと Markdown の修正案は無料。監視はホスト側。
seoTitle: isready.ai、サイトは AI に読めるか
seoDescription: isready.ai は ChatGPT / Claude / Perplexity などがサイトを読めるかを 32 チェックで測ります。CLI のディープスキャンと Markdown は無料。Pro €19 と Team €49 はホスト監視です。
highlights:
  - クローラ、レンダリング、構造化データ、信頼、GEO コンテンツの 32 チェック。バージョン付き 0–100 スコア。
  - "`npx isreadyai` CLI（1.1.4）。`--json` / `--md` / `--llm` / `--deep`（無料ウェブは最大 10 ページ）/ `--smart-ai`、CI 終了コード。完全に無料。"
  - Smart Agent readability。agent-browser が実ブラウザでコンテンツと名前付きコントロールを見る。
  - GitHub の audit-action@v1 が CI ゲート。Pro €19 / Team €49 は監視、履歴、バッジ、Ask-your-site、fix-action の PR。
---

**isready.ai: AI クローラはサイトを読めるか**

isready.ai は証拠で答えます。GPTBot、ClaudeBot、PerplexityBot、OAI-SearchBot がページを取ったとき、記事が届くか、空の文書か。Smart Squad（ウーディネ）のプロダクトです。スキャナと CLI は MIT。ホスト型ダッシュボードは PolyForm Shield です。

これらのクローラはだいたい JavaScript を実行しません。クライアント側だけの React / Vue は Google では順位を取っても、空の殻で届くことがあります。プロバイダごとに学習、検索、ライブ取得のクローラが分かれています。Cloudflare 系のチャレンジは、古典的な順位を触らずに回答から消すことがあります。

スキャンは AI クローラと同じ生 HTTP で取り、同じように HTML を解析し、32 チェックを走らせます。コンテンツ GEO は Aggarwal ら KDD 2024 に沿っています。引用、統計、出典。各指摘には観測値、結果、具体的な直しがあります。スコアはバージョン付きです。`llms.txt` は情報表示だけで、点数は動きません。

```bash
npx isreadyai yourdomain.com --deep --md
```

CLI のディープスキャンと Markdown の修正案は無料です。それには Pro は要りません。任意の Smart Agent が、ブラウザ付きエージェント向けに二つ目の 0–100 を足します。

Pro は月 €19、Team は €49。監視、履歴、バッジ、Ask-your-site、自動修正 PR の `isreadyai/fix-action` です。
