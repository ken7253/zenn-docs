---
title: "Javascriptを理解するまでのプロセス"
emoji: "😎"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["javascript"]
published: false
---

## 前書き

昨年ぐらいからようやくまともにJavascript（以下、JS）を触るようになってきてそこで学んできたこ、どのように理解を進めてきたのかという点を中心にまとめようと思います。
また、ブラウザ上でのJSについての解説であるためNode.jsやnpmなどについては解説しません。

### 対象読者

- コピペコードなら何となくJSを動かせる
- JSの基本操作は何となく分かるがどのようにコードを組み立てていくのか分かっていない人
- HTMLやCSSの勉強ができてこれからJSを触り始めたい人

## HTMLとDOM

まずはじめにJSから操作を行う場合ではマークアップに対しての捉え方を変える必要があります。  
というのもJSで操作するのは「**HTMLではなくDOMである**」という点が異なります。
例として下記のようなコードで取得した要素の中のテキストを変更する場合

```html
<div id="app">ここの文章を変更</div>
```

```js
// getElementByIdで要素（DOM）を取得
const element = document.getElementById("app");
// innerTextを変更して表示されている文を変更する
element.innerText = "Hoge";
```

このようなコードを書くことで内部の文字を変更できます。
`element`の部分は変更したい要素を取得してきていることが1行目のコードから分かりますが、なぜ`innerText`に`Hoge`という文字列を代入することで文字が変わるのでしょうか。

### HTMLではなくDOMとしてマークアップを理解する

### DOMとは何か

![](/images/articles/what-is-javascript/dom.png)

DOM = Document Object Model
とはよく書かれていますが、ブラウザはHTMLを読み込んだ際に文字列としてのHTMLではなくそれを解釈してDOMに変換を行います。
その名の通りDOMとはドキュメント（HTML）をオブジェクトとして扱いますのでJSのオブジェクトのように下記のような構造を持ちます。

```js
{
  object: {
    key1: "aaa",
    key2: 0
  }
}
```

このDOMというオブジェクトは前述したHTMLの記述を元に作成されています。
その際に

## JavascriptでDOMを操作する
