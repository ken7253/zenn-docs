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
確認のため`new Comment()`でHTMLのコメントを作成し、`typeof`演算子で`addEventListener`が関数として存在するのかを確認[^1]しています。  

[^1]: Google Chrome 115 及び Firefox 116 にて確認

```ts
const comment = new Comment('foo');
// => <!--foo-->
console.log(typeof comment.addEventListener);
// => "function"
```

確認の結果`typeof`演算子によって`"function"`が返却され`addEventListener`という関数が登録されていることが確認できました。

## DOMの構造についての解説

実際にメソッドが存在することは確認できたので、次になぜこのような仕組みになっているのかを解説していきます。

### なぜコメントにイベントリスナーが存在するのか

答えを先に出すと、コメントにも`addEventListener`/`removeEventListener`が存在する理由としては、`Comment`インターフェイスが`EventTarget`インターフェイスを継承しているからです。

https://developer.mozilla.org/ja/docs/Web/API/EventTarget

上記の理由がどういう意味なのかを実際にブラウザのコンソールなどを使って確認してみます。

#### 実際にインターフェイスの継承構造をたどってみる

まずは継承構造の確認から始めようと思います、ChromeなどのコンソールではDOMのプロパティが確認できます。
先程と同じように`new Comment()`でコメントを作成してみてその中身をコンソールで確認してみましょう。

```ts
const comment = new Comment('foo');
console.log([comment]);
```

::: message
ブラウザのコンソールで直接DOMを出力しようとすると、HTML文字列として返却されてしまうため、配列として出力させています。
:::

次にコンソール上でコメントオブジェクトを配列から展開して、`[[Prototype]]`という項目を何度も開いていくと下記のような順番で開いていくと思います。

1. `Comment`
2. `CharacterData`
3. `Node`
4. `EventTarget`
5. `Object`

この作業はDOMの継承関係を遡っていく作業だと思ってください。
この内`Object`はJavaScript全体の環境まで飛び出しているのでDOMの世界としては`EventTarget`が最上位のインターフェースとなります。

`HTMLButtonElement`（button要素）の場合を例とすると下記の図のような継承が行われています。

![EventTargetインターフェイスはaddEventListenerなどが存在する、NodeインターフェイスはappendChild・textContentなどが存在する、ElementインターフェイスはqueryセレクターメソッドやinnerHTMLが存在する、HTMLElementインターフェイスはclickメソッドやinnerTextなどが存在する、HTMLButtonElementインターフェイスはdisabledやtypeなどが存在する。](/images/articles/comment-event-listen/dom-interface.jpg)
*HTMLButtonElementのDOMインターフェイス継承関係を表した図*

解説のためにbutton要素を出してしまいましたが、コメントと比較した場合どちらも`Node`インターフェイスまでは共通しています。
そのためbutton要素もコメントも`Node`インターフェイスが持っているメソッドやプロパティを利用することができることが分かります。

このようにDOM上の様々な要素は対応するインターフェイスを継承することである程度の分類が行われています。
そのため、`EventTarget`を継承しているコメントもbutton要素も同じようにイベントリスナーを設定することができます。

#### EventTargetインターフェイスとはなにか

今までの説明や名前からも想像できるように`EventTarget`はイベントを受け取るためのメソッドを定義したインターフェースです。
そのため、イベントを受け取ることができる要素やオブジェクトは`EventTarget`インターフェースを継承しています。
ブラウザで利用できるAPIにはHTMLの要素以外にも`Window`などイベントを受け取ることができるオブジェクトが存在するためこのインターフェースが最上位に位置しています。

## まとめ

このようにDOMの構造を理解することで、要素が持つプロパティやメソッドが要素固有のものなのかそれともすべての要素が持っているものなのかなどが理解しやすくなります。
またTypeScriptを利用している場合は`instanceof`演算子を利用した型ガードなどがより正確に記述できるようになります。
普段何気なく利用しているHTMLやDOMですが、少し深掘りしてみるとまた見え方が変わってくるので興味があれば参考資料に記載したMDNの[DOM の紹介](https://developer.mozilla.org/ja/docs/Web/API/Document_Object_Model/Introduction)ページなどを読んでみてください。

## 参考資料

https://developer.mozilla.org/ja/docs/Web/API/Document_Object_Model/Introduction
https://developer.mozilla.org/ja/docs/Web/API/EventTarget
