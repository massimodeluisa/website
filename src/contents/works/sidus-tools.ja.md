---
title: SIDUS
eyebrow: 宇宙工学ツール
role: Founder, product and systems architecture
summary: ブラウザで動くオープンソースの教育用宇宙工学電卓。約175ツール。純SI。MIT。軌道力学、推進、RF、搭乗員ECLSS。
seoTitle: SIDUS, オープンソースの宇宙工学ツール
seoDescription: sidus.tools はブラウザで動く無料の教育用電卓です。約175の純SI宇宙工学ツール。MIT。数式は検証・テストしてください。
highlights:
  - ブラウザで約175ツール。軌道、推進、衛星/RF、ECLSS、幾何、惑星、ユーティリティ。純SI。
  - ページに教科書の痕跡（two-body は Vallado と Curtis）。デフォルトが違えば GitHub の Edit から直す。
  - Rust / Python / MATLAB など複数言語へのコード出力。
  - "公開 MCP: https://sidus.tools/api/mcp（Streamable HTTP）。Agent Skill: `npx skills add massimodeluisa/sidus-tools --skill sidus`。"
  - 私はソフトウェアエンジニアであり、宇宙工学者ではありません。関心があるから作りました。数式と出力コードは検証・テストしてください。
---

**SIDUS: 教育用の宇宙工学電卓**

私はソフトウェアエンジニアであり、宇宙工学者ではありません。ただ宇宙工学が好きで、そのために sidus.tools を開発して公開しました。

SIDUS（ラテン語 sidus = 星座）は、軌道力学・推進・衛星運用・打上げ・RFリンクバジェット・搭乗員ECLSS向けの無料オープンソース電卓です。約175ツール。純SI。MIT。ブラウザで動きます。アカウントは不要です。

ポイントは、見える SI チェックです。入力、式、結果、任意のプロット、各ツールの Edit this page on GitHub。モデルは意図して小さく、two-body、インパルス、円軌道 Clohessy-Wiltshire、理想ロケット、ISA 空力です。

同じカタログは公開 MCP（https://sidus.tools/api/mcp、Streamable HTTP）でも使えます。URL を指すだけです。クローンは不要。Agent Skill は `npx skills add massimodeluisa/sidus-tools --skill sidus`。

数式ページには参考文献があります。出力できるコードも含め、レビューとテストが必要です。
