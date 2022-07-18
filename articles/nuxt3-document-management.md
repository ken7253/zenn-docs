---
title: "Nuxt3で始めるドキュメント管理のすすめ"
emoji: "📘"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["nuxt3", "nuxt"]
published: true
---

# Nuxt3で始めるドキュメント管理のすすめ

:::message
この記事は[自分のサイトの更新を行った際の記事](https://dairoku-studio.com/post/2022-07-17-renewal)を再編集したものになります。  
使用したバージョンは`3.0.0-rc.5`ですのでその時点での情報です。
:::

ドキュメントページを作る場合の選択肢は[VuePress](https://vuepress.vuejs.org/)([VitePress](https://vitepress.vuejs.org/))や[gatsby](https://www.gatsbyjs.com/)などの静的サイトジェネレーターを使用する選択肢があります。  
しかし、nuxt3 + nuxt contentという選択肢も非常に有用だと思ったため使い方の解説を記載します。  
現在Nuxt3はSSG(`nuxt generate`)に対応していないためSSRとなりますが今後対応が進んでいくと思いますので今のうちに作成しておいて後々機能がリリースされたら改修を行っていく予定で使用しています。

https://v3.nuxtjs.org/getting-started/migration#feature-comparison

## なぜNuxtなのか

あくまでNuxtに常に優位があるわけではなく、既存のフレームワークとの別の需要を満たすものだと考えます。  
この記事では主にVuePressとの比較を中心に記載していきます。  

VuePressの場合インストールをして、簡単な設定だけでドキュメントを書きはじめることができます。

https://v2.vuepress.vuejs.org/guide/getting-started.html

あくまでVuePressからの視点ですが、VuePressの公式ドキュメントにも[NuxtとVuePress・VitePressの違いについて](https://v2.vuepress.vuejs.org/guide/#why-not)述べられています。
VuePressやVitePressは軽量でスピーディーなドキュメントページの作成が可能でNuxtはより高機能で拡張性のあるドキュメントページの作成を行うことが可能です。

![](/images/articles/nuxt3-document-management/compare.jpg)

簡単な図解ですが、Nuxtでドキュメントページを作成するメリットは

- 後からサーバー側のロジックも作成できる
  - ログイン機能
  - アクセス権限の管理など
- マークアップへの展開方法を柔軟に変更できる

というメリットが考えられます。
サクッとドキュメントページを作りたいというより、比較的大規模なドキュメントサイトの作成でメリットがあります。

## Nuxt Contentを利用したMarkdown管理

Nuxt Contentを導入することでMarkdownのパース及び各種データの取得が可能になります。  

https://content.nuxtjs.org/

通常であればMarkdownファイルをHTMLにパースして、ダイナミックルーティング機能などで表示内容を切り替えるという処理が必要かと思われますがNuxt Contentを使用するとその手間を大幅に減らすことができます。

例として自分のサイトでは、`/post/`をブログの一覧ページとして`/post/<slug>`という風にアクセスすることで記事を見れるようにしているのですがそのように設定する場合も可能です。

### 設定方法

設定方法としては、公式ドキュメントにもあるように

1. パッケージのインストール
2. 設定ファイルへの追加
3. 記事ページが表示されるように設定
4. 一覧ページの作成

という風に設定を行うだけで可能です。

#### インストール・設定

`npm install --save-dev @nuxt/content`を実行して現在のプロジェクトにNuxt Contentをインストールします。  
その後`nuxt.config.ts`の`modules`に`'@nuxt/content'`を追加することでパッケージを利用できるようになります。  
また、設定の変更を行う場合は`content`という項目を作りその内部に設定を追加していくことが可能です。

```ts:nuxt.config.ts
// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  modules: [
    '@nuxt/content',
  ],
  content: {
    // https://content.nuxtjs.org/api/configuration/
    highlight: {
      // コードハイライトを有効化する場合はテーマを設定
      theme: 'github-dark-dimmed',
    },
  },
});
```

#### 記事ページの表示

記事ページの表示を表示されるためには下記の作業が必要になります。

1. `/pages/post/`に`[...slug].vue`というファイルを作成
2. `[...slug].vue`ファイルに`<ContentDoc />`コンポーネントを入れる
3. `/content/post/`ディレクトリを作成
4. `/content/post/`にMarkdownファイルを作成

という手順を行い最終的に下記のようなディレクトリ構成を目指します。

```txt:directory
root
┣ content
┃ ┗ post // pagesとパスを合わせておく
┃    ┗ // Markdownファイルを作成していく
┗ pages
   ┗ post // contentとパスを合わせる
      ┣ index.vue // 記事一覧ページ
      ┗ [...slug].vue // 記事ページ
```

ディレクトリを作成してファイルを作るだけなので解説が必要な箇所は少ないですが、`content`ディレクトリのMarkdownファイルを置く位置と`pages`で表示のためのページのディレクトリは合わせておく必要があります。  
ディレクトリを合わせることで、`[...slug].vue`の内部の記述は下記のようにシンプルな設定だけでページを表示できるようになります。

```vue:[...slug].vue
<template>
  <div>
    <ContentDoc />
  </div>
</template>
```

`<template>`内部に記載した[`<ContentDoc />`](https://content.nuxtjs.org/api/components/content-doc)というコンポーネントが自動的にMarkdownファイルを展開して表示してくれます。

#### 記事一覧の作成

記事の一覧ページとして`/pages/post/index.vue`を作成します。  
こちらも一覧の表示には`<ContentList></ContentList>`というコンポーネントを使用することで表示することが可能です。  
自分のサイトでは一度別のコンポーネントファイルとして定義して表示件数制限を`props`で渡せるようにしていますが基本的には変わりません。

https://github.com/ken7253/d6/blob/main/components/AllPost.vue

`<ContentList></ContentList>`は子要素を受け取ることができるコンポーネントで`path=""`でどのディレクトリにあるデータを取得するのか（`content`配下すべてであれば`path=""`）を指定可能です。  
子要素に記事一覧データが配列として渡されるため`v-for`などを使用して一覧を作成することができます。
具体的な記述方法は公式ドキュメントを参考にするとわかりやすいと思います。

https://content.nuxtjs.org/api/components/content-list#slots

| プロパティ | 説明 |
|---|---|
| `title` | 記事のタイトル（front matterで設定されていない場合`h1`要素） |
| `description` | 記事のディスクリプション（front matterで設定されていない場合最初の`p`要素） |
| `_path` | 記事のパス |

また、記事データの配列は通常の配列と同様に操作が可能ですが`Array.slice()`などで複製後に操作を行わないと正しく表示されません。  
記事の表示順を反転したい場合などは`Array.slice().reverse()`などで変更を行いましょう。

また、コンポーネントを使用せずに[`queryContent()`](https://content.nuxtjs.org/api/composables/query-content)で`setup`関数の内部で記事データを取得することも可能です。  
このように`<ContentList>`もしくは[`queryContent()`](https://content.nuxtjs.org/api/composables/query-content)を使用することでcontentのデータを取得することができます。

### Proseコンポーネントによる柔軟なタグのパース

次に一番のオススメポイントでもあるProseコンポーネントの使い方を解説します。
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

https://v3.nuxtjs.org/guide/deploy/providers/netlify/

また、NitroのドキュメントですがこちらにはZero Config Providerとして

- [`azure`](https://nitro.unjs.io/deploy/providers/azure.html)
- [`stormkit`](https://nitro.unjs.io/deploy/providers/stormkit.html)
- [`vercel`](https://nitro.unjs.io/deploy/providers/vercel.html)

が紹介されていますので、Netlify以外でも簡単にデプロイが可能なサービスも多そうです。

## 関連リンク

https://v3.nuxtjs.org/
https://content.nuxtjs.org/
https://vuepress.vuejs.org/
https://vitepress.vuejs.org/
