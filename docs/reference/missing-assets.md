# 参照LP 未登録画像監査

調査日: 2026-06-19  
対象: `https://ai.digital-hacks.jp/`  
比較対象: `lib/assets.ts`

## 調査方法と前提

- 参照LPのDOM上の `img` 要素だけを読み取り、`currentSrc` / `src`、`naturalWidth` / `naturalHeight`、表示位置、周辺テキストから用途を照合した。
- アセットの一括取得、外部ファイルのダウンロード、コード変更は行っていない。
- 寸法は実ブラウザが返したDOM上の `naturalWidth × naturalHeight`。CDNの `scale-down-to` や画面密度補正が反映されるため、URLクエリの元画像寸法と一致しない場合がある。
- `lib/assets.ts` に既登録のhero、problem、campaign、guarantee、`story-01`〜`story-03` は下表から除外した。

## 最小限の高類似度必須セット

Task 5で95%を狙う場合、まず次の **15点** をローカル化するのが最小構成。人物写真、コースロゴ、フロー図はCSS代替で差が出やすい。

1. Aboutメイン写真: `RYnXecAMKGJSJ5A4Xigeg1tqu7I.jpeg`
2. 共通CTA装飾人物: `MMXhmai4r9TewR5DCOvUEUWV5I.png`
3. Feature 01暗色カード背景: `SB10RrHsLvM9wXdtSFxCXH1v6To.png`
4. Feature 01講座サムネイル: `jzCFfCrENhDRQQbE9PrfgLuWmBc.jpg`
5. Feature受講生カルーセルの不足4人分: `bvHO...`、`uTvj...`、`ZQ1v...`、`jtKJ...`
6. Priceコースロゴ2点: `edEY...`、`BfTA...`
7. Price料金強調バッジ: `3IOA...`
8. Flow図3点: `vFb...`、`u5TE...`、`w2N...`
9. Footerロゴ: `raIX...`

※ Feature 02の受講生カードを原寸クローズで再現する場合は、後述のカード顔写真5点も必須に繰り上げる。

## A. About / 共通CTA

| 用途 | DOM位置と表示寸法 | DOM natural | `currentSrc`・備考 |
|---|---:|---:|---|
| Aboutの右側大判写真 | y=2031, 628×419 | 660×440 | `https://framerusercontent.com/images/RYnXecAMKGJSJ5A4Xigeg1tqu7I.jpeg?scale-down-to=2048&width=8192&height=5464` |
| About手前の小型装飾アイコン | y=1408, 68×56 | 68×56 | `https://framerusercontent.com/images/RGMTqnZsH3ukDgZtFGqmYVP5RT0.png?scale-down-to=512&width=1416&height=1168` 。必須度B。 |
| 共通CTA右側の人物装飾 | y=2692 / 6734 / 10016, 240×183 | 239×182 | `https://framerusercontent.com/images/MMXhmai4r9TewR5DCOvUEUWV5I.png?scale-down-to=512&width=1676&height=1276` 。3ヶ所で共通使用。 |

## B. Feature 01—カリキュラムと受講生ビジュアル

### 主要ビジュアル

| 用途 | DOM位置と表示寸法 | DOM natural | `currentSrc`・備考 |
|---|---:|---:|---|
| 暗色カリキュラムカードの半透明背景 | y=3662付近、回転40度・opacity 0.11・cover | 1961×658 | `https://framerusercontent.com/images/SB10RrHsLvM9wXdtSFxCXH1v6To.png?width=3523&height=1182` 。CSSで済ませず使う方が輪郭と光の位置が合う。 |
| 「安心してスタートできる、ゼロからの基礎講座」サムネイル | y=4297, 584×318 | 532×299 | `https://framerusercontent.com/images/jzCFfCrENhDRQQbE9PrfgLuWmBc.jpg?width=1920&height=1080` |
| 「AIの仕組みとプロンプト設計」左の小アイコン | y=4491, 24×22 | 188×173 | `https://framerusercontent.com/images/w40j5J1z9JYdizcpUMLZkiUmo.png?width=188&height=173` 。必須度B。 |

### 受講生カルーセルの不足ポートレート

`story-01`〜`story-03` と合わせて7人分のカルーセルを構成する。各表示は約288×337、DOM naturalは240×300。

| 表示名 | `currentSrc` |
|---|---|
| Kaito Asakura | `https://framerusercontent.com/images/bvHO6mAHwXMsX3UqdAk5aVajo.jpg?scale-down-to=1024&width=3998&height=4997` |
| Masako Yamaguchi | `https://framerusercontent.com/images/uTvjYCl9x2fgrV5PfwqMZ98xVBU.jpg?scale-down-to=1024&width=3122&height=3902` |
| Masato Nishimoto | `https://framerusercontent.com/images/ZQ1v6Lt1wVJqWLV8WsM5I7b8SQQ.jpg?scale-down-to=1024&width=3434&height=4292` |
| Yurika Hirao | `https://framerusercontent.com/images/jtKJZHYUnQvCz90KUHEyymKpM.jpg?scale-down-to=1024&width=3237&height=4046` |

### カルーセル内の円形アバター（必須度B）

いずれもy=3515〜3821付近、表示約57〜117px。元画像の切り抜きの違いが目立つため、カルーセルを寄せる場合は追加する。

| DOM natural | `currentSrc` |
|---:|---|
| 320×320 | `https://framerusercontent.com/images/fCBxCbjmYOrFXxbM2z55RuB8vw.png?width=320&height=320` |
| 400×400 | `https://framerusercontent.com/images/bPNopMommApQCLKa8LkcrpNE4Y.jpg?width=400&height=400` |
| 1024×1024 | `https://framerusercontent.com/images/LVR6yui59xu9Wo3i47YSqHpCWF4.png?width=1024&height=1024` |
| 256×256 | `https://framerusercontent.com/images/QtU10o2kX1y0eZsHZqcY5wbQaZ0.webp?width=256&height=256` |
| 512×512 | `https://framerusercontent.com/images/g1JIiNsNsXtqg6bHdfIwPGLXicU.png?width=512&height=512` |
| 512×512 | `https://framerusercontent.com/images/1UA4BpygOA9owTT9ed6CD4o74i8.png?width=512&height=512` |
| 256×256 | `https://framerusercontent.com/images/R47uQcxeZjFz4LupQi8uQkWyuKQ.png?width=256&height=256` |
| 480×480 | `https://framerusercontent.com/images/VdWgZ8vHZyVtDyuiursp5lx91Y.jpg?width=480&height=480` |

## C. Feature 02—専任サポート / 受講生の声

学習ステップと「現役プロ講師による1on1指導」等のサポートカード自体はCSSとテキストで構成され、大判画像はない。画像は「受講生の声」の顔写真が主。

| カード | 表示 | DOM natural | `currentSrc` |
|---|---:|---:|---|
| 藤井 直哉さん | 66×66 | 66×87 | `https://framerusercontent.com/images/rdxPh7DWiEjmfrE9P1c66xIF0Y.png?width=512&height=680` |
| 飯島 達也さん | 66×66 | 66×36 | `https://framerusercontent.com/images/TFtngrH9YMR2Ci6I5bC6MB0jbk.png?scale-down-to=512&width=1024&height=574` |
| 松井 智美さん | 66×66 | 66×88 | `https://framerusercontent.com/images/hAskaR6SxJcAd9ewZyGYL8wBI.png?width=512&height=683` |
| 木下 由美さん | 66×66 | 512×287 | `https://framerusercontent.com/images/DW1hPCkEPqutKofWTr9TValZkW0.png?width=512&height=287` |
| 山本 雪さん | 66×66 | 66×36 | `https://framerusercontent.com/images/dJDAhuGD9IYB9nS7vpWh4ikgIY.png?scale-down-to=512&width=1024&height=574` |

カルーセル左右ボタンの画像は `acVs8YpSw8e3y8kHqcyt221UC0.png` と `keHcyLfkYAmBnw5j4KXbcFu8bQ.png`（どちらもDOM natural 96×96、表示40×40）。CSSの円形ボタン＋矢印で代替可能なため、必須度C。

## D. Price—コースロゴ / 料金強調

| 用途 | DOM位置と表示寸法 | DOM natural | `currentSrc` |
|---|---:|---:|---|
| MINIコースロゴ | y=7656, 244×91 | 264×98 | `https://framerusercontent.com/images/edEYbO3FmqeidyrqsA7LU3o7UB4.png?scale-down-to=512&width=556&height=207` |
| PROコースロゴ | y=7656, 322×134 | 322×133 | `https://framerusercontent.com/images/BfTAveCVSO5O07GWVAHIIvkA8gg.png?width=744&height=309` |
| 料金比較の強調バッジ | y=8580, 216×57 | 216×63 | `https://framerusercontent.com/images/3IOAGYV2iNuUk3hoGo4KvujDDAc.png?scale-down-to=512&width=744&height=218` |

Price内で発見できたDOM画像は上記3点。A社 / B社表示や丸バッジはテキスト・CSSで、別画像ではない。

## E. Flow—3ステップ図

3点とも表示264×171、DOM natural 952×616、y=9587。

| 用途 | `currentSrc` |
|---|---|
| STEP 01 オンライン説明会 | `https://framerusercontent.com/images/vFbwgz6sJFmOaWKHYMHnXN0Ks4.png?width=596&height=386` |
| STEP 02 受講お申し込み | `https://framerusercontent.com/images/u5TEOhB7qradrGABghLnTmCv8z4.png?width=596&height=386` |
| STEP 03 学習スタート | `https://framerusercontent.com/images/w2N2FsjhzkmAgWiLoTONQ8XQ7Q.png?width=596&height=386` |

## F. Footer

| 用途 | DOM位置と表示寸法 | DOM natural | `currentSrc` |
|---|---:|---:|---|
| Footerのデジハクロゴ | y=11441, 64×16 | 64×15 | `https://framerusercontent.com/images/raIXXdK47cbr811taNb4ucJPE.png?scale-down-to=512&width=2990&height=738` |

## 実装優先順序

1. About写真、CTA装飾、Flow 3図、Footerロゴ
2. Feature背景、講座サムネイル、不足ポートレート4点
3. Priceロゴ・バッジ3点
4. Feature 02受講生の声の顔写真5点
5. 円形アバター8点、About小装飾、カリキュラム小アイコン、矢印画像

## 除外判定

- `6gHZaKWDoLeu45CbiAaYKasPu34.png` と `Kj8VsqpOTr0Tm9BUaMXKYrLNkI.png` はデスクトップ調査時に x=1351（LPステージ外）で、メインビジュアルに寄与しないオフキャンバス要素のため、最小セットから除外した。モバイル検証で表示される場合のみ再調査する。
- 計測用の0×0px画像、同一画像のFramer内部複製、大量の装飾スプライト複製は除外した。
