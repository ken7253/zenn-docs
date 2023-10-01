---
title: "Chrome120から実現するdetails要素のアコーディオンパターン"
emoji: "🚪"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["html"]
published: true
---

::: message
この記事執筆時点ではまだリリースされていない、ブラウザの機能について言及しています。
そのためリリース後にこの記事を読んでいる方は利用前に最新の情報について改めて確認することを推奨します。
:::

## details要素のアコーディオンパターンとはなにか

要点だけ抜き出すと下記のようなことがChrome120のリリース以降できるようになります。

- `details`要素に`name`属性が追加される
- `name`属性を指定することでアコーディオンのようなUIが実現可能になる

### アコーディオンとはなにか

アコーディオンは比較的メジャーなUIなので想像がつく方も多いと思いますが改めて解説すると
複数の折りたたみ要素が存在する場合にそれらをグループ化して、一つの折りたたみ要素を開いたら他の折りたたみ要素は閉じるような挙動をとるUIのことを指します。

こちらについては提案の元ネタであるOpenUIのページに[いくつか具体例](https://open-ui.org/components/accordion.explainer/#developer-demand-for-exclusive-accordion)が提示されているのでこちらを確認すると認識が合いやすいかと思います。

## 想定されている利用方法

同じ`name`属性を持った`details`要素はアコーディオンのグループとして認識され、同じグループ内で開いた状態の`details`要素は１つだけとなります。
下記のようなマークアップの場合、`name="foo"`を持つ`details`要素同士は同じグループとして認識されます。

```html:accordion-pattern.html
<details name="foo">
  <summary>title-1</summary>
  some text.
</details>
<details name="foo">
  <summary>title-2</summary>
  some text.
</details>
<details name="foo">
  <summary>title-3</summary>
  some text.
</details>
```

## その他ブラウザの対応状況

現在対応しているブラウザはありませんが、Chromeは120のリリースの内容にアコーディオンパターンを含めています。
> Accordion pattern using name attribute on <details> elements

![Chrome120のリリースの内容に"Accordion pattern using name attribute on <details> elements"が含まれている](/images/articles/details-element-accordion/chrome-roadmap-at-120.png)
*ChromeのRoadmapページのスクリーンショット*

[Chrome Platform Status](https://chromestatus.com/feature/6710427028815872)の他ブラウザの反応を見るとFirefoxは好意的で、Safariも現在開発中とのことで、他ブラウザでの実装も進んでいきそうな雰囲気はあります。

## まとめ

短い内容ですが[Intent to Ship](https://twitter.com/intenttoship)を見て気になっていた内容だったので簡単にまとめてみました。

https://x.com/intenttoship/status/1707865946776350793?s=20

個人的に英語力に不安があるので内容に間違いがあったり、リリース前に仕様が変更される可能性など記載した内容に誤りが含まれる可能性があるかもしれませんが、そういった点があればコメントもしくはGitHubにてご連絡ください。

## 参考資料

https://chromestatus.com/feature/6710427028815872
https://groups.google.com/a/chromium.org/g/blink-dev/c/Bk6xulOmBn8/m/P39eHu8-AQAJ
https://open-ui.org/components/accordion.explainer/#developer-demand-for-exclusive-accordion
