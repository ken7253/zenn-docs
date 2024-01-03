---
title: "Progressive Enhancementもしくは私達が目指すべき姿について"
emoji: "😽"
type: "idea" # tech: 技術記事 / idea: アイデア
topics: ["フロントエンド"]
published: false
---

昨今、Progressive Enhancementという言葉を耳にする機会が多くなったと感じています。
個人的に興味のある考え方であったので、少し調べて考えをまとめてみようと思います。

## Progressive Enhancementについて

MDNでは下記のように説明されています。

> プログレッシブエンハンスメント (Progressive enhancement) とは、可能な限り多くのユーザーに不可欠なコンテンツと機能のベースラインを提供することを中心とした設計哲学であり、必要なすべてのコードを実行できる最新のブラウザーのユーザーに限り、最高の体験を提供します。

https://developer.mozilla.org/ja/docs/Glossary/Progressive_Enhancement#:~:text=%E3%83%97%E3%83%AD%E3%82%B0%E3%83%AC%E3%83%83%E3%82%B7%E3%83%96%E3%82%A8%E3%83%B3%E3%83%8F%E3%83%B3%E3%82%B9%E3%83%A1%E3%83%B3%E3%83%88%20(Progressive%20enhancement)%20%E3%81%A8%E3%81%AF%E3%80%81%E5%8F%AF%E8%83%BD%E3%81%AA%E9%99%90%E3%82%8A%E5%A4%9A%E3%81%8F%E3%81%AE%E3%83%A6%E3%83%BC%E3%82%B6%E3%83%BC%E3%81%AB%E4%B8%8D%E5%8F%AF%E6%AC%A0%E3%81%AA%E3%82%B3%E3%83%B3%E3%83%86%E3%83%B3%E3%83%84%E3%81%A8%E6%A9%9F%E8%83%BD%E3%81%AE%E3%83%99%E3%83%BC%E3%82%B9%E3%83%A9%E3%82%A4%E3%83%B3%E3%82%92%E6%8F%90%E4%BE%9B%E3%81%99%E3%82%8B%E3%81%93%E3%81%A8%E3%82%92%E4%B8%AD%E5%BF%83%E3%81%A8%E3%81%97%E3%81%9F%E8%A8%AD%E8%A8%88%E5%93%B2%E5%AD%A6%E3%81%A7%E3%81%82%E3%82%8A%E3%80%81%E5%BF%85%E8%A6%81%E3%81%AA%E3%81%99%E3%81%B9%E3%81%A6%E3%81%AE%E3%82%B3%E3%83%BC%E3%83%89%E3%82%92%E5%AE%9F%E8%A1%8C%E3%81%A7%E3%81%8D%E3%82%8B%E6%9C%80%E6%96%B0%E3%81%AE%E3%83%96%E3%83%A9%E3%82%A6%E3%82%B6%E3%83%BC%E3%81%AE%E3%83%A6%E3%83%BC%E3%82%B6%E3%83%BC%E3%81%AB%E9%99%90%E3%82%8A%E3%80%81%E6%9C%80%E9%AB%98%E3%81%AE%E4%BD%93%E9%A8%93%E3%82%92%E6%8F%90%E4%BE%9B%E3%81%97%E3%81%BE%E3%81%99%E3%80%82

### Graceful Degradationとの違いについて

Progressive Enhancementが基礎を作ってから積み上げていくようなイメージに対して、Graceful Degradationはとりあえず作ってから最低限のラインを補修するようなイメージでしょうか。
この２つは多くのユーザーに最低限必要な機能を届けるという点で非常に似ていますがアプローチと考え方が異なります。

https://developer.mozilla.org/ja/docs/Glossary/Graceful_degradation

### JSが無効な環境は重要な要素ではあるが全てではない

Progressive Enhancementを語る場合、フロントエンドにおいてはよくJSが無効化されている環境向けたHTMLやCSSの活用が挙げられることも多いと思います。
この考え方は[Progressive Enhancement reading list 2021 - QuirksBlog](https://www.quirksmode.org/blog/archives/2021/02/progressive_enh_1.html#:~:text=I%20find%20any.-,Layer%203%3A%20JavaScript,-Then%20we%20come)のLayer 3: JavaScriptでも触れられている通り、重要な要素ではありますがProgressive Enhancementの全てではないと思っています。

最初に記載したように「可能な限り多くのユーザーに不可欠なコンテンツと機能のベースラインを提供する」という観点では、確かにHTMLとCSSのみで基本的な機能を実装し発展的なUXをJavaScriptで実現するという手法は実に合理的だと思っています。

しかし「可能な限り多くのユーザー」という定義であるならばProgressive Enhancementはまずはじめに古いブラウザのユーザーのことを考えるべきではないかという考えに至ります。

## 古いブラウザ向けに届けるということ

Progressive Enhancementの話題になるとよく引き合いに出される最新のHTMLやCSSの仕様ですが、これらは古いブラウザではサポートされていないことが多いです。
特にSafari 14.xなどでは現在〇〇%のユーザーがいますがCSSの`:has()`やHTMLの`popover`/`popoverTarget`などの属性値はサポートされていません。

<!-- TODO: 後でSafari 14.xのシェアとHTML/CSSのサポート状況を調べておく -->

Progressive Enhancementが「可能な限り多くのユーザーに不可欠なコンテンツと機能のベースラインを提供する」ことを目的とするならば、まずきちんとアプリケーションの対応ブラウザを決め、それから対応ブラウザのレンジを広くしてくことが最初に目指すべき項目なのではないでしょうか。

## 推奨環境と必須環境という考え方

PCゲームの世界では「動作推奨環境」と「動作必須環境」という考え方があります。  
PCゲームの場合特定のハードというのは存在せず、ユーザーが自分でパーツを選んでPCを組んだり市販のPCでもスペックに差があります。

すべてのPCで同じようにゲームが動く保証はなく、自分がプレイしたい水準を満たしているかなどを確認した上でゲームを購入します。

動作推奨環境：ゲームが快適にプレイできるハードウェアスペックの基準
動作必須環境：ゲームを実行するのに最低限必要なハードウェアスペックの基準

![THE FINALSというゲームのシステム要件を表示している画面のスクリーンショット](/images/articles/progressive-enhancement/system-requirement.png)
*動作必須環境と動作推奨環境を比べてみるとCPUやGPUのスペックが高くなっているのが分かる*

### 品質の保証基準も範囲で考える

Progressive EnhancementやGraceful Degradationの考え方を取り入れるのであれば動作環境も「最低」と「推奨」を分けるべきではないかと思いました。

## 私達ができること

## 参考資料

- [Progressive Enhancement (プログレッシブエンハンスメント) - MDN Web Docs 用語集: ウェブ関連用語の定義 | MDN](https://developer.mozilla.org/ja/docs/Glossary/Progressive_Enhancement)
- [Graceful degradation (グレースフルデグラデーション) - MDN Web Docs 用語集: ウェブ関連用語の定義 | MDN](https://developer.mozilla.org/ja/docs/Glossary/Graceful_degradation)
- [Progressive Enhancement reading list 2021](https://www.quirksmode.org/blog/archives/2021/02/progressive_enh_1.html)
- [HTML: The Inaccessible Parts](https://daverupert.com/2020/02/html-the-inaccessible-parts/)
