---
title: "Vuepressのブログプラグインについて"
emoji: "📑"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["vue","vuepress"]
published: false
---
# Vuepressとは
VuepressはVue+Markdownで簡単にドキュメントサイトが作成できる静的サイトジェネレーターです。  
Nuxt.jsにもSSGの機能はありますがどちらかというとVuepressはMarkdownを使ってスピーディーにドキュメントサイトを制作することに特化しています。  
[Nuxt使いたい人はこの記事が参考になると思います。](https://nyanshiba.com/blog/nuxtjs-markdown-heroku)  
また、ブログ用のプラグインを導入してカスタムすることでVueを使いポートフォリオサイトと自前のブログをMarkdownの資産を残しながら運用できるという需要を満たしてくれるので使ってみることにしました。  

## 導入手順
導入は基本的に公式ドキュメントに従って進めていきます。  
[Getting Started | VuePress](https://vuepress.vuejs.org/guide/getting-started)  

### 環境
| OS      | エディタ | vuepress | plugin-blog |
| ------- | -------- | -------- | ----------- |
| Windows | VScode   | 1.7.1    | 1.9.3       |

### Vuepressのセットアップ

```shell
$ yarn create vuepress-site
```
出てくる質問に回答しプロジェクト作成  
プロジェクトが作成されたらnpm scriptの項目に `dev - docs` という項目ができているはずなので  
```shell
'vuepress' は、内部コマンドまたは外部コマンド、
操作可能なプログラムまたはバッチ ファイルとして認識されていません。
```
もし上記のようなエラーが出てきた場合vuepressをインストールしていない可能性があるため
```shell
$ npm i -g vuepress
```
でvuepressをグローバルにインストールしてください。  
特にエラーなどがなければデフォルトだと `http://localhost:8080/` にページが生成されるはずなので確認する。

### カスタマイズしたい人向け
デフォルトのテーマをカスタマイズしたい人はテーマを `eject` するとデフォルトテーマを吐き出させることかできる。  
package.jsonのscriptsに下記のように `eject` を記載してnpm scriptを実行すると `theme` ディレクトリにデフォルトのテーマが出力される。  
しかしながらいきなりテーマをejectさせても難易度が高いので最初はデフォルトのテーマを編集するのがいいと思います。  

```json:package.json
...
  "scripts": {
    "dev": "vuepress dev docs",
    "build": "vuepress build docs",
    "eject": "vuepress eject docs"
  },
...
```

### ブログ用プラグインの導入
いよいよここからが本番です。  
yarnで `@vuepress/plugin-blog` を開発環境に追加
```shell
$ yarn add -D @vuepress/plugin-blog
```
インストールが完了したら `./docs/.vuepress/config.js` に追記します。  
config.jsが無い場合は上記のディレクトリに作成してください。
```js:config.js
module.exports = {
  ...
  plugins: [
    '@vuepress/blog': {}
  ],
}
```
更にこのプラグインの箇所に下記のように記載することで更に設定を追加します。  
```js:config.js
module.exports = {
  ...
  plugins: [
    '@vuepress/blog': {
      directories: [
        {
          id: 'post',
          dirname: '_posts',
          // 投稿が入っているディレクトリを指定
          path: '/post/',
          itemPermalink: '/post/:year/:month/:day/:slug',
          // 記事のページのパーマリンク設定
        }
      ]
    }
  ],
}
```
この時 `plugins` の中の記載が間違っていて結構時間を費やしたので注意して設定しましょう。  

#### パーマリンクについて補足 
`2020-11-22-testpost.md` という投稿があった場合
`/post/:year/:month/:day/:slug` というパーマリンクを指定すると投稿のURLは `/post/2020/11/22/testpost` となります。

### テスト用記事の作成
設定ができたら、