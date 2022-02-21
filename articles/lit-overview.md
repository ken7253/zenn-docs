---
title: "フロントエンド開発におけるLitという選択肢"
emoji: "🔥"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["javascript", "Lit", "WebComponents"]
published: false
---

## Litとは

一言で表すならば[WebComponents](https://developer.mozilla.org/ja/docs/Web/Web_Components)を簡単に活用するためのライブラリです。  
WebComponentsを利用することで、モダンブラウザに最適化した（IE非対応の）開発であればReactやVueなどのフレームワークを使用しなくてもコンポーネントベースの開発が行えます。
しかしながら標準のWebComponentsは記述量が多く仕様も少し複雑なため、Litを活用することでスムーズにWebComponentsでの開発を始められます。

[![LitWebサイト](/images/articles/lit-overview/lit-website.jpg)](https://lit.dev/)

## おすすめできるポイント

Litでは、宣言的UIを構築するReactやVueなどのフレームワークと同じく単一ファイルでのコンポーネント管理が可能ですが  
標準仕様であるWebComponentsをベースにしているため、エコシステムを限定せず様々な環境での使用ができるというメリットがあります。  
また、複雑な開発環境の構築も不要で学習コストも高くないためこれから宣言的UIでコードを書いていきたい人にもおすすめできます。

### おすすめできる人

- WebComponentsを使いたいけど楽をしたい人
- 様々な環境下でも使用できる汎用的なUIライブラリを作成したい人
- ReactやVue以外の宣言的UIフレームワークに触れてみたい人
- 素のJS/TSが好きな人
- 標準仕様原理主義者
