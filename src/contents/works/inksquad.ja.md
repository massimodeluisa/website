---
title: Inksquad
eyebrow: タトゥーのエコシステム
role: CTO, product and platform architecture
summary: ひとつの基盤の上に二つのプロダクト。Inksquad People はタトゥーのアイデアを形にする。Inksquad Artist はスタジオ向けの iPad ツール。下は共有の Supabase と AI。
seoDescription: アイデア用の Inksquad People。ステンシル・インク照合・グローブ操作の iPad 向け Artist。共有の Supabase と AI。
highlights:
  - People は愛好家向け。非公開プロジェクト、スタイル、部位、リファレンス、AI ビジュアル。予約アプリではない。
  - "Artist（iPad）: 自動ステンシル、CIE94 / CIEDE2000 のインク照合、Matrix と Color Wheel、グローブを外さない音声操作。"
  - 実在インクカタログ 400 以上（EU 適合セット含む）。スタジオ作業はオフラインでも。
  - Turborepo + Supabase（Postgres, RLS, Edge Functions）と Vercel AI SDK のマルチプロバイダ。
---

**Inksquad: 曖昧なタトゥーのアイデアから、彫師が使えるものへ**

Inksquad は二つのプロダクトです。アプリを着替えただけではありません。

**People**（web.inksquad.com）は愛好家向け。説明、スタイル、部位、サイズ、リファレンス、AI ビジュアルで非公開プロジェクトを作り、準備ができたら彫師と共有します。予約ではありません。公開 WIP です。

**Artist**（App Store、iPad）はスタジオ向け。Procreate / Photoshop / Illustrator からスケッチを取り込み、コンセプト生成、インクボード、インク照合、ライブセッション。ステンシルは PencilKit の編集可能レイヤーになります。Live モードは音声でズーム、マーカー、レイヤー、タイマー。グローブはつけたまま。

AI は手伝います。彫師の代わりにはなりません。
