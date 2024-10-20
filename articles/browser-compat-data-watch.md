---
title: "ブラウザのアップデートを追うのに便利なBCD-watchについて"
emoji: "🔃"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["browser"]
published: true
---

私はブラウザのアップデートや仕様化のプロセスを追うのが好きなのですが、普段から仕様を追っている人以外にはなかなか概要を把握するのが難しい部分があります。

今までは [Intent to ship](https://x.com/intenttoship)（※[bluesky](https://bsky.app/profile/intenttoship.dev)） などを確認していましたが、最近 BCD-watch というサービスがリリースされ RSS で購読を始め更新の頻度と一覧性が概要を把握するのに非常にちょうどいい感じだったので紹介させていただきます。

## BCD-watchとは

詳しい説明は作者である Eric Meyer 氏の記事 [Announcing BCD Watch](https://meyerweb.com/eric/thoughts/2024/09/23/announcing-bcd-watch/) にて詳しく説明がされています。

https://meyerweb.com/eric/thoughts/2024/09/23/announcing-bcd-watch/

ざっくりとした説明をすると、BCD-watch は [browser-compat-data](https://github.com/mdn/browser-compat-data) の更新から1週間分の差分を取得することで、その週に更新された内容を確認することができるサービスです。

[browser-compat-data](https://github.com/mdn/browser-compat-data) を直接的にご存じない方もいるかと思いますが、MDN のリファレンスページに掲載されている互換性テーブルなどはこの情報を元に更新されています。

https://developer.mozilla.org/ja/docs/MDN/Writing_guidelines/Page_structures/Compatibility_tables

### 具体的な利用方法

サービスは下記のサイトから確認することができます。

https://bcd-watch.igalia.com/

サイトを開くと下記の2つのカテゴリが表示されています。

- [Full Weekly Report](https://bcd-watch.igalia.com/weekly/)
- [Universal Implementations Weekly Report](https://bcd-watch.igalia.com/weekly-completed/)

Full Weekly Report ではすべての差分データが表示され、 Universal Implementations Weekly Report では主要3ブラウザで対応が登録された機能のみを表示してくれています。

:::message
このデータあくまでもBCDへのデータ登録を監視しているため、機能を実装したブラウザがリリースされていることとは厳密には異なるため注意してください。
:::

それぞれ RSS が提供されているので自分は、[Full Weekly Report](https://bcd-watch.igalia.com/weekly/) を購読しています。

また、「Archive of past reports, most to least recent」の項目から過去の差分データを確認することができます。

### 週次レポートの確認方法

![BCD-watchの週次レポート2024年10月14日分のスクリーンショット](/images/articles/browser-compat-data-watch/bcd-watch_weekly.png)

見出しとしての分類は基本的に [MDN のリファレンスページ](https://developer.mozilla.org/ja/docs/Web)と同じような分類になっています。
分類が記載されているテキスト部分はページがあれば MDN へのリンクとなっており、右側にドキュメントのアイコンがついているものについては仕様書へのリンクとなっています。

次にどのブラウザのデータとして登録されたか、主要ブラウザの中で何個のブラウザが登録されているのかなどの情報が記載されています。

## おわりに

BCD-watch は単体では更新の一覧でしかありませんが、週一度の更新でそこまで時間をかけずに仕様のアップデートを追うのにちょうどいいツールだと感じました。
これを利用して、チームで仕様の動向をチェックする時間などを設けるのも比較的ライトに始められていいのかなと思いました。

また今後は [Baseline](https://developer.mozilla.org/ja/docs/Glossary/Baseline/Compatibility) の Widely Available に到達したものなどの追加なども検討されているようなのでそちらにも期待したいです。
