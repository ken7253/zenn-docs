---
title: "styled-jsxを使う理由"
emoji: "📌"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["react", "javascript", "css"]
published: false
---

## styled-jsxとは何か

styled-jsxはVercelが開発を行っているReactのスタイリングライブラリです。

## 導入のモチベーション

Reactのスタイリングライブラリとしては[`styled-components`](https://styled-components.com/)や[`Emotion`](https://emotion.sh/docs/introduction)などがありますが

### 学習コストの低さ

`styled-jsx`の記法は殆ど素の`css`の記法と変わらず直感的に記述ができます。
導入後はライブラリ固有の書き方や仕様などをあまり意識せずにスタイル定義を行えるためスタイル定義のためだけに学習コストを割かなくても良いため

### シンプルなスタイリング方法

### Vercelが開発している

## 導入方法

導入についてはリポジトリの[`README.md`](https://github.com/vercel/styled-jsx/blob/main/readme.md)に詳しく記載されています。

### インストール

Webpack + babelが導入されている前提で進めます。
基本的にはインストール後babelの設定を追加するだけで使用することができます。

```sh
npm i styled-jsx
```

### babelへの設定追加

```diff json:.babelrc
{
+ "plugins": ["styled-jsx/babel"]
}
```

上記のように`plugins`に`"styled-jsx/babel"`を追加します。
オプションを指定する場合は下記のようにオブジェクトを含んだ配列で指定をします。

```diff json:.babelrc
{
- "plugins": ["styled-jsx/babel"]
+ "plugins": [
+   ["styled-jsx/babel", { "optimizeForSpeed": true }]
+ ]
}
```

### `<style jsx>`が型エラーになる場合

TypeScriptを利用している場合は`style`要素に`jsx`という属性が定義されていないためエラーになってしまいます。
[公式ドキュメント](https://github.com/vercel/styled-jsx#typescript)でも触れられていますが`styled-jsx.d.ts`というファイルを作成して下記のように型定義を追加する必要があります。

```ts:styled-jsx.d.ts
/// <reference types="styled-jsx" />
```

もしくは下記のように`React`の`StyleHTMLAttributes`を拡張しても型定義が行われます。

```ts:styled-jsx.d.ts
import 'react';

declare module 'react' {
  interface StyleHTMLAttributes<T> extends React.HTMLAttributes<T> {
    jsx?: boolean;
    global?: boolean;
  }
}
```

## 参考資料

https://github.com/vercel/styled-jsx
