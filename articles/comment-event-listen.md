---
title: "なぜHTMLコメントにはイベントリスナーが付与できるのか"
emoji: "💭"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["html", "dom"]
published: false
---

HTMLのコメントには`addEventListener`や`removeEventListener`などのイベント関連の処理が実装されています。
DOMの構造に詳しい方であれば、このような仕様になっている理由が分かる方も多いかと思われます。
今回はHTMLのコメントの仕様を通じてDOMについての理解を深める記事として記事を書きます。

## 前提条件

この記事は下記の内容を前提として記載しています。

- JavaScriptの基礎的な構文を理解している
- 基本的なHTML要素を把握している
- オブジェクト指向プログラミングについての基礎的な理解がある

最後の「オブジェクト指向プログラミングについての基礎的な理解がある」については推奨ですが必須ではありません。

## 確認手順

まずは、本当にコメントにイベントリスナーが実装されているかを確認します。
下記のコードをブラウザのコンソールで実行してみます。

```ts
const comment = new Comment('foo');
// => <!--foo-->
console.log(typeof comment.addEventListener);
// => "function"
```

内容としては`new Comment()`でHTMLのコメントを作成し、`typeof`演算子で`addEventListener`が関数として存在するのかを確認[^1]しています。

[^1]: Google Chrome 115 及び Firefox 116 にて確認

## なぜコメントにイベントリスナーが存在するのか

実際にメソッドが存在することは確認できたので、次になぜこのような仕組みになっているのかを解説していきます。

https://developer.mozilla.org/ja/docs/Web/API/Comment
