---
title: Inksquad
eyebrow: タトゥーのアイデアとスタジオ
role: CTO, product and platform architecture
summary: ひとつの基盤の上に二つのプロダクト。Inksquad People はタトゥーのアイデアを形にする。Inksquad Artist はスタジオ向け iPad アプリ。App Store $9.99、カタログインクは 400 色超。
seoDescription: アイデア用の Inksquad People。ステンシル・インク照合・グローブ操作の iPad 向け Artist。App Store $9.99。共有の Supabase と AI。
highlights:
  - People は非公開プロジェクト。説明、スタイル、部位、リファレンス、Ink AI のビジュアル。予約は別の場所。
  - 'Artist（iPad、App Store id 1579690331）: VTracer 経由で PencilKit のステンシル、CIE94 / CIEDE2000 の照合、Matrix、Color Wheel、グローブを外さない音声。'
  - 実在インク 400 色超。Intenze、Fusion、World Famous、Eternal Ink、EU 適合セット。スタジオはオフラインでも動く。
  - Turborepo + Supabase（Postgres, RLS, Edge Functions）と Vercel AI SDK のマルチプロバイダ。
---

**Inksquad: 曖昧なタトゥーのアイデアから、彫師が使えるものへ**

Inksquad は二つのプロダクトです。People と Artist は仕事が違い、同じ土台の上に乗っているので、プロジェクトをこちらからあちらへ渡せます。

### People

[web.inksquad.com](https://web.inksquad.com) はアイデアを持っている人向け。説明、スタイル、部位、サイズ、リファレンス、Ink AI のビジュアルで非公開プロジェクトを作り、準備ができたら彫師と共有します。予約ではありません。公開 WIP です。

### Artist

[artist.inksquad.com](https://artist.inksquad.com) は App Store の iPad アプリです。$9.99 ＋クレジット。スタジオ向け。Procreate / Photoshop / Illustrator からスケッチを取り込み、コンセプト、Inkboard、インク照合、ライブセッション。ステンシルは preprocess、エッジ検出、VTracer を経て、編集できる PencilKit レイヤーになります。Live モードは音声でズーム、マーカー、レイヤー、タイマー。グローブはつけたまま。

下は Turborepo、Supabase、Vercel AI SDK（OpenAI、Grok、Replicate、Vertex）。隣に Next.js の管理画面と Payload のサイトがあります。

AI はコンセプトやリファレンスの整理を手伝えます。セッションは彫師のものです。
