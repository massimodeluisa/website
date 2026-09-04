---
title: Images in motion
eyebrow: スクロールするモザイク
role: Founder, product and systems architecture
summary: 画像のモザイクをページに置くと、列が逆方向にスクロールします。スタジオで傾きと速度を決め、その設定をコピーし、画像はブラウザに残ります。
seoTitle: Images in motion、逆にスクロールする列
seoDescription: 画像のモザイクをページに置くと、列が逆方向にスクロールします。スタジオで傾きと速度を決め、設定をコピーし、画像はブラウザに残ります。
highlights:
  - 隣の列は逆方向に動き、一つの列の中では速度が一定です。デフォルトの傾きは 12 度です。
  - 動きは CSS なので、画像を動かし続けるためのアニメーションループはページにありません。React、Vue、Expo、NativeScript で置けます。
  - 2026年9月3日に公開しました。パッケージは npm にあり、スタジオは iim.smartsquad.io/studio です。
  - "CDN のファイルは minify 後 17.38 KB、gzip 6.47 KB、brotli 5.83 KB です。フレームワークも画像も含みません。"
---

[images-in-motion](https://iim.smartsquad.io/) は 2026年9月3日に公開しました。モザイクを置きます。各列は傾き、隣の列とは逆方向にスクロールします。速度は一つの列の中では一定で、隣とは違うので、行が格子に固定されません。デフォルトの傾きは 12 度です。デフォルトの速度は毎秒 8 から 18 論理ピクセルです。列の代わりに行をスクロールすることもできます。

動きは CSS です。幾何は一度計算し、あとはブラウザが列を動かし続けます。JavaScript のアニメーションループはありません。フレームワークが止まっていても画像は動き続ける、それが要点です。React と Vue は入れ物を作るだけです。Expo と NativeScript は同じレンダラーを WebView に置きます。

CDN のファイルは minify 後 17.38 KB（17,798 バイト）、gzip 6.47 KB、brotli 5.83 KB です。丸めないでください。React も Vue も画像も含みません。

[スタジオ](https://iim.smartsquad.io/studio/) でキャンバス、速度、傾き、タイルを決めます。コピーが書くのは設定です。選んだ画像はそのコピーに入りません。なので設定だけを、写真なしでブラウザの外へ出せます。

ソースは [github.com/smartsquad/images-in-motion](https://github.com/smartsquad/images-in-motion) です。
