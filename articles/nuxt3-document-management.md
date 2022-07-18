---
title: "Nuxt3で始めるドキュメント管理のすすめ"
emoji: "📘"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["nuxt3", "nuxt"]
published: false
---

# Nuxt3で始めるドキュメント管理のすすめ

ドキュメントページを作る場合の選択肢は[VuePress](https://vuepress.vuejs.org/)([VitePress](https://vitepress.vuejs.org/))や[gatsby](https://www.gatsbyjs.com/)などの静的サイトジェネレーターを使用する選択肢があります。

https://v3.nuxtjs.org/getting-started/migration#feature-comparison

## なぜNuxtなのか

あくまでNuxtに常に優位があるわけではなく、既存のフレームワークとの別の需要を満たすものだと考えます。  
この記事では主にVuePressとの比較を中心に記載していきます。  

VuePressの場合インストールをして、簡単な設定だけでドキュメントを書きはじめることができます。

https://v2.vuepress.vuejs.org/guide/getting-started.html

あくまでVuePressからの視点ですが、VuePressの公式ドキュメントにも[NuxtとVuePress・VitePressの違いについて](https://v2.vuepress.vuejs.org/guide/#why-not)述べられています。
VuePressやVitePressは軽量でスピーディーなドキュメントページの作成が可能でNuxtはより高機能で拡張性のあるドキュメントページの作成を行うことが可能です。

![](/images/articles/nuxt3-document-management/compare.jpg)

## Nuxt Contentを利用したMarkdown管理

Nuxt Contentを導入することでMarkdownのパース及び各種データの取得が可能になります。  

https://content.nuxtjs.org/

### Proseコンポーネントによる柔軟なタグのパース

Nuxt Contentには様々な機能がありますが、中でもProseコンポーネントを使用したタグの展開方法の変更が非常に優秀です。  
Nuxtの`components`ディレクトリに`content`というディレクトリを作成し、その中にProseコンポーネントを作成していくことでMarkdownから展開されるマークアップのスタイル定義やロジックの追加などが可能です。  

下記のリンクにデフォルトのコンポーネントの定義があるため、この定義を上書きする形で同名のコンポーネントを作成することで定義を更新できます。

https://github.com/nuxt/content/tree/main/src/runtime/components/Prose

自分のプロジェクトにインストールされているものを確認したい場合は`/node_modules/@nuxt/content/dist/runtime/components/Prose/`内部に実際のコードが格納されています。
スタイルの定義などに使用することが多いですが、Vueのコンポーネントと同じように`<script>`内部にロジックを記載することが可能です。

自分のサイトではコードブロックに対してファイル名と言語を表示するようにスタイル・マークアップの変更を行っています。  
https://github.com/ken7253/d6/blob/main/components/content/ProseCode.vue

### Netlifyでの設定の容易さ

Netlifyでのデプロイはリポジトリを連携して、ビルドコマンドとパブリッシュディレクトリの指定を行うだけで可能です。  
バックエンドの処理も自動的にNetlify functionを使用して実行してくれます。
