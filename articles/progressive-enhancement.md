---
title: "Progressive Enhancementもしくは私達が目指すべき姿について"
emoji: "😽"
type: "idea" # tech: 技術記事 / idea: アイデア
topics: ["フロントエンド"]
published: false
---

## Progressive Enhancementについて

MDNでは下記のように説明されています。

> プログレッシブエンハンスメント (Progressive enhancement) とは、可能な限り多くのユーザーに不可欠なコンテンツと機能のベースラインを提供することを中心とした設計哲学であり、必要なすべてのコードを実行できる最新のブラウザーのユーザーに限り、最高の体験を提供します。

https://developer.mozilla.org/ja/docs/Glossary/Progressive_Enhancement

### Graceful Degradationとの違いについて

Progressive Enhancementが基礎を作ってから積み上げていくようなイメージに対して、Graceful Degradationはとりあえず作ってから最低限のラインを補修するようなイメージでしょうか。
この２つは多くのユーザーに最低限必要な機能を届けるという点で非常に似ていますがアプローチと考え方が異なります。

https://developer.mozilla.org/ja/docs/Glossary/Graceful_degradation

## 古いブラウザ向けに届けるということ

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
