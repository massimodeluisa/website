---
title: IsReady.AI
eyebrow: AI readiness と GEO
role: CTO / プロダクトとプラットフォーム設計
summary: AIが実際にサイトを読めるかを証拠ベースで測る無料オープンソース監査。クローラ・レンダリング・構造化データ・信頼・GEOコンテンツの32チェック、Smart Agent、CI向けCLI。
seoDescription: IsReady.AI は ChatGPT / Claude / Perplexity などがサイトを読めるかを32チェックと Smart Agent で評価します。
highlights:
  - 5次元・32の証拠ベースチェックとバージョン付き0–100スコア。
  - "`npx isreadyai` CLI（--json / --md / --llm / --deep）とCI終了コード。"
  - Smart Agent readability（agent-browser によるアクセシビリティツリー）。
  - CLI のディープスキャンと Markdown の修正案は完全に無料。fix-action と hosted monitoring は Pro/Team。
---

**IsReady.AI: AIが本当にサイトを読めるかを測る**

IsReady.AI は「**AIシステムは実際にあなたのサイトを読めるか？**」に証拠で答えます。Smart Squad S.r.l.（イタリア・ウーディネ）のプロダクトで、スキャナとCLIはMIT、ホスト型ダッシュボードは PolyForm Shield です。

GPTBot などは一般に JavaScript を実行しません。CSR の React/Vue は Google では順位を取っても AI には空の殻になり得ます。スキャンは AI クローラ同様に生HTMLを解析し、32チェックでスコア化します。CLI のディープスキャンと Markdown ソリューションは無料です。Pro は不要です。`llms.txt` は情報表示のみでスコアに影響しません。
