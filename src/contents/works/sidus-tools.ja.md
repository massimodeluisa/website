---
title: SIDUS
eyebrow: 宇宙工学ツール
role: Founder, product and systems architecture
summary: ブラウザで動くオープンソースの教育用宇宙工学電卓。2026年9月4日時点で 201 ツール。純 SI。MIT。軌道力学、推進、RF、搭乗員 ECLSS。
seoTitle: SIDUS, オープンソースの宇宙工学ツール
seoDescription: sidus.tools はブラウザで動く無料の教育用電卓です。純 SI の宇宙工学ツール 201。MIT。数式は検証・テストしてください。
highlights:
  - ブラウザで 201 ツール。軌道、推進、衛星/RF、ECLSS、幾何、惑星、ユーティリティ。純 SI。
  - ページに教科書の痕跡（two-body は Vallado と Curtis）。デフォルトが違えば GitHub の Edit から直す。
  - C / C++ / Rust / Zig / Python / JS/TS / MATLAB / Julia / Fortran / LaTeX へのコード出力。
  - "公開 MCP: https://sidus.tools/api/mcp（Streamable HTTP）。Agent Skill: `npx skills add massimodeluisa/sidus-tools --skill sidus`。"
  - ソフトウェアを書いています。宇宙工学者ではありません。数式と出力コードは検証・テストしてください。
---

**SIDUS: 教育用の宇宙工学電卓**

ソフトウェアを書いています。宇宙工学者ではありません。[sidus.tools](https://sidus.tools) ではチェックが SI のまま、読めるページと、クライアントが叩けるプロトコルに載っています。別の物理ライブラリが静かにずれないように、同じ関数です。

SIDUS（ラテン語 sidus = 星座）は、軌道力学・推進・衛星運用・打上げ・RFリンクバジェット・搭乗員 ECLSS 向けの無料オープンソース電卓です。2026年9月4日時点で 201 ツール。純 SI。MIT。ブラウザで動きます。アカウントは不要です。独立した教育プロジェクトで、機関との提携はありません。

ポイントは、見える SI チェックです。入力、式、結果、任意のプロット、各ツールの Edit this page on GitHub。デフォルトは教育用の WGS-84 クラス（μ⊕ = 3.986004418×10¹⁴ m³/s²、赤道半径 6 378 137 m）。モデルは意図して小さく、two-body、インパルス、円軌道 Clohessy-Wiltshire、理想ロケット、ISA 空力です。

数式ページには参考文献があります。Hohmann の隣に Lambert、SGP4、ライブの軌道ビュー、Tsiolkovsky、RF リンクバジェット、キャビン大気、Earth-Mars の porkchop スケッチがあります。

同じカタログは公開 MCP（https://sidus.tools/api/mcp、Streamable HTTP）でも使えます。URL を指すだけです。クローンは不要。Agent Skill は `npx skills add massimodeluisa/sidus-tools --skill sidus`。

数式と、ページから出せるコードは、レビューとテストが必要です。
