---
title: "Markdown内部のJavaScriptにもLinterを効かせたい"
emoji: "🧐"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["eslint", "javascript", "typescript", 'markdown']
published: true
---

## はじめに

普段自分が記事を書く時にコードブロック内の記述にLintを効かせたいことがたまにあります。  
実際に動いているコードからコピーしてくる場合などはあまり心配はいらないのですが、サクッと記述例を書く時に不安があったので[`@eslint/markdown`](https://github.com/eslint/markdown)を導入してある程度のチェックは自動で行ってくれるようにしました。

## 導入方法について

TypeScript向けのLinterルールを構成していきます。
また、設定ファイルは[FlatConfig](https://eslint.org/docs/latest/use/configure/configuration-files)形式ですので古い設定ファイルの場合は読み替えてください。

https://eslint.org/docs/latest/use/configure/configuration-files

### インストール

まずは、ESLint本体と必要なプラグインをインストールします。

```bash
npm i -D eslint typescript-eslint eslint-plugin-markdown @eslint/js
```

自分の場合は対話型プロンプトでインストールだけ済ませるのが好きなのでこちらでも。

```bash
npx eslint --init
```

### 設定ファイルの構築

[`@eslint/markdown`](https://github.com/eslint/markdown)では少し特殊な設定ファイルの書き方が必要なのでそれを解説していきます。  
まず始めに自分の設定ファイルを置いておくので、サクッと設定したい方はこちらを利用していただければと思います。

https://github.com/ken7253/zenn-docs/blob/42ec2b975a00798a6ea55f7992d1580d996568e9/eslint.config.mjs#L6-L31

#### filesの指定について

まず、[`@eslint/markdown`](https://github.com/eslint/markdown)ではfilesの指定に`"**/*.md/*.js"`のような書き方をします。
これは`"<markdownファイルまでのパス>/*.<コードブロックの拡張子>"`という風に、Lint対象のファイルとコードブロックを別に指定することができます。

例として`src`配下のMarkdownのJavaScriptにのみLinterを効かせる場合は`src/**/*.md/*.js`という指定になります。

#### typescript-eslintのfilesの指定を修正する

下記の記述箇所で、typescript-eslintのfilesを上書きしています。
これはtypescript-eslintのfilesの指定がデフォルトでは`.tsx`もチェック対象に含めてしまっておりjsxがパースできずエラーになってしまうのを防ぐためのものです。

```ts
export default tseslint.config(
  // ...
  ...tseslint.configs.recommended.map((config) => ({
    ...config,
    files: ["**/*.md/*.ts"],
  })),
  // ...
)
```

パッケージのREADMEを読む限りでは[jsxに対してのLintも対応していそう](https://github.com/eslint/markdown?tab=readme-ov-file#what-gets-linted)ですがこの記事ではあくまでTypeScirptのLintが動くところまでをスコープとしているので一旦このままで進めます。

#### 記事で不都合のあるルールを無効化する

当たり前ですが、通常の組み込みルールはあくまでプロダクトコードをチェックするための設定で、記事では不要なルールがあるためそれらを無効化します。
人により内容は変わると思いますが参考程度に自分の設定を記載しておきます。

```ts
export default tseslint.config(
  {
    rules: {
      "no-console": "off",
      "import/no-unresolved": "off",
      "@typescript-eslint/no-unused-vars": "off",
    },
  }
)
```

### 特定のコードブロックでLintを無効化する

上記の設定などを行えばある程度不都合なくLintが実行できるかと思いますが、自分の場合以前に書いていた記事でTypeScriptのLegacyDecoratorなどをコードブロックに書いていた記事があったりした関係で一部パースエラーになっていしまっているコードブロックがありました。

特殊なコメントとして`<!-- eslint-skip -->`が用意されており、これを挿入すると次のコードブロックのLintをスキップさせることができます。
意図的にエラーになる書き方をしたい場合などはこちらを使うといいと思います。

## 参考リンク

https://github.com/eslint/markdown

https://www.publickey1.jp/blog/24/eslintjavascriptjsonmarkdown.html
