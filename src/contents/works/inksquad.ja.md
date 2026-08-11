---
title: Inksquad
eyebrow: タトゥーエコシステム
role: CTO、プロダクトおよびプラットフォームアーキテクチャ
summary: クロスプラットフォームのタトゥーエコシステム — React Native製のコンシューマーアプリ、iPadネイティブのSwiftUI製プロツール、そしてアイデアをインスピレーションから使える創作素材へと導く共有のSupabaseとAIプラットフォーム。
seoDescription: クロスプラットフォームのタトゥーエコシステム — React Native製コンシューマーアプリ、iPad SwiftUI製プロツール、共有のSupabaseとAIプラットフォーム。
highlights:
  - 1つのプラットフォーム上に2つのプロダクト — タトゥーのアイデアを形にするInksquad Peopleと、スタジオ品質のワークフローを実現するiPadツールInksquad Artist。
  - アーティスト向けツールには、自動ステンシル生成、CIE94とCIEDE2000によるインクの色マッチング、パレットツール、音声操作のライブモードが含まれる。
  - Postgres、RLS、Edge Functionsを備えたSupabase上の共有Turborepoプラットフォームに加え、Vercel AI SDKを通じたマルチプロバイダーのAI生成。
  - Next.js製の管理ダッシュボードとPayload CMS製のウェブサイトがエコシステムを完成させる。
---

**Inksquad: タトゥー制作のためのクロスプラットフォーム・プロダクトシステム**

Inksquadは単一のアプリではありません。1つのアイデアを中心に構築された完全なプロダクトエコシステムです。そのアイデアとは、タトゥーのコンセプトを漠然としたインスピレーションから、正確で使える創作素材へと移行させることを助けることです。このプラットフォームは、モバイルアプリ、iPadネイティブのプロフェッショナルツール、Web CMS、管理ダッシュボード、Supabaseインフラ、AIによる画像操作からなる共有の技術基盤を通じて、タトゥー愛好家とプロのアーティストという2つのオーディエンスをつなぎます。

コンシューマー向けアプリであるInksquad Peopleは、公に「Define your next Tattoo like never before.」として位置づけられています。その目的は予約ではありません。準備です。ユーザーはプライベートなタトゥープロジェクトを作成し、詳細な説明を書き、好みのスタイルと体の配置を選び、サイズを定義し、参考画像を集め、AIでビジュアルを生成し、アイデアが整ったらタトゥーアーティストに完成したプロジェクトを共有できます。

技術的には、PeopleはExpo 55とReact Native 0.84のアプリで、React 19、Expo Router、HeroUI Native、FlashList、TanStack Query、RevenueCatの購入機能、Supabase Auth、Supabase Storage、Supabase Edge Functions上で動作します。アプリにはAppleおよびGoogleサインイン、多言語オンボーディング、プッシュ通知処理、オフライン対応のデータ取得、署名付きトークンによるプロジェクト共有、プライベートな画像アクセス、スレッドベースのAI Studioが含まれます。AIワークフローは `ai_threads` と `ai_thread_messages` として永続化され、ソース画像、生成画像、操作メタデータ、クレジット計算、そしてタトゥー生成、画像編集、背景除去、代替案、アップスケーリング、トライオン、プロジェクト作成といったアクションを伴います。

プロフェッショナル向けの対となるのがInksquad Artistで、公に「Pro tools for pro Tattoo Artists.」と説明されています。これはiPadファーストのSwiftUIアプリケーションで、Swift、SwiftData、CloudKit、PencilKit、Speech、AVFoundation、CoreImage、Vision、Supabase Swift、Google Sign-In、Firebase Messaging、Nuke、DotLottie、PINCache、ColorKit、そして `InksquadShared` という共有Swiftパッケージで構築されています。アーティストには、Procreate、Photoshop、Illustratorなどのツールからスケッチをインポートし、AIでコンセプトを生成し、インクボードを作成し、色を合わせ、パレットを構築し、ライブセッションを管理するための作業環境を提供します。

Artistアプリの最も特徴的なシステムは、技術的であると同時に実用的でもあります。自動ステンシルモジュールは、画像の前処理、エッジ検出、VTracerによるベクター化、PencilKitのレイヤー生成を用いて、アートワークを編集可能なステンシルレイヤーに変換します。色マッチングでは、アーティストが画像上にマーカーをドラッグし、CIE94やCIEDE2000のような知覚的な色比較を用いて、グローバルカタログからインクの一致を特定できます。MatrixとColor Wheelのツールは、原色に黒と白を加えてパレットの探索、インクのブレンド、微調整をサポートします。ライブモードは、セッション中にiPadに触れることなく、ズーム、マーカーの表示、ステンシルレイヤーを開く、タイマーの操作、画像ビューの切り替えを行う音声コマンドを追加します。

両方のアプリの背後には、共有のプラットフォームアーキテクチャがあります。モノレポはTurborepoとpnpmを使用し、`packages/ui` にはクロスプラットフォームのUIコンポーネント、デザイントークン、グラスエフェクト、チャットコントロール、ギャラリー、カード、モーダル、管理コンポーネント、ネイティブ/Webバリアントが含まれます。ビジネスロジックは `packages/di` に存在し、Supabaseのコンポーザブル、生成されたデータベース型、i18n、クエリプロバイダー、プロジェクトロジック、AIスレッドロジック、決済、アプリ設定、デバイス登録が集約されています。

バックエンドはSupabaseです。RLS付きのPostgres、Storage、Auth、マイグレーション、生成されたTypeScript型、そしてDeno Edge Functions。AI操作はVercel AI SDKによって支えられ、OpenAI、xAI/Grok、Replicate、Google Vertexにまたがるモデルレジストリを備えています。サーバーサイドのツールは、生成、編集、背景除去、アップスケーリング、代替案、トライオン、コンテンツ分析、プロンプト強化、コスト計算、操作の監査証跡を処理します。

Next.js 16の管理ダッシュボードがシステムを完成させます。HeroUI、Tailwind CSS v4、Recharts、共有のDIフックで構築され、ユーザー、アーティスト、スタジオ、イベント、タトゥースタイル、体の部位、記事、フィードバック、購入、AI料金、アプリリンク、アプリバージョン、インクカタログを管理します。公開ウェブサイトもNext.jsで、Payload CMS、ローカライズされたグローバル、Vercel Blobメディア、SEOメタデータ、JSON-LD、PeopleとArtist向けのマーケティングページを備えています。

その結果生まれるのは、プロダクト、AI、デザインツール、編集コンテンツ、コマース、運用管理が、後付けで継ぎ合わされるのではなく統合されたプラットフォームです。Inksquadはタトゥーの計画を構造化された創作データへと変え、そのデータを使える作品へと変換するためのプロフェッショナルなツールをアーティストに提供します。
