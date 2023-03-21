---
title: "VSCodeで特定のnpm-scriptsを非表示にする方法"
emoji: "🙈"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["npm", "vscode"]
published: false
---

## はじめに

1つのリポジトリ上に複数の`package.json`が存在する場合VSCode上の「NPMスクリプト」の項目が長くなってしまいます。
普段の開発ではVSCode上からNPMスクリプトを実行することが多いので、実行したいコマンドが見つけづらいと地味に大変です。
そのためあまり使わないコマンドは非表示にしておきたいという気持ちがあったのですが調べてもあまり情報が無く苦戦したので記事として残しておこうと思います。

## 指定の方法は大まかに分けて2種類

まず、VSCode上で特定の`npm-scripts`を非表示にする方法は大きく分けて2種類存在します。
どちらも`.vscode/settings.json`にフィールドを追加することで指定が可能です。

- `npm.scriptExplorerExclude`でスクリプト名を無視する方法
- `npm.exclude`でディレクトリごと無視する方法

### スクリプト名基準での除外

スクリプト名での除外を行う場合は`npm.scriptExplorerExclude`を使用します。
正規表現を利用することができ、文字列もしくは文字列の配列として指定が可能です。

```json:settings.json
{
  // 先頭に pre / post がつくスクリプトを除外
  "npm.scriptExplorerExclude": ["(pre|post).*"]
}
```

`npm-scripts`では`pre`/`post`などのキーワードで特定のタイミングで実行されるスクリプトを定義できます。
スクリプト名基準での除外は、自動実行されるスクリプトを非表示にして一覧をスッキリさせるなどの目的で利用する場面で効果的な方法だと思います。

https://docs.npmjs.com/cli/v9/using-npm/scripts#pre--post-scripts

### ディレクトリ基準での除外

ディレクトリ基準で除外を行う場合は`npm.exclude`を使用します。
こちらの指定は正規表現ではなくglobパターンでの指定となります。

::: message
`npm.exclude`は絶対パスに対してマッチングを確認するため
`./**/*`のような相対パスでの指定はできません。
:::

```json:settings.json
{
  // fooというディレクトリの配下にあるpackage.jsonは無視される
  "npm.exclude": ["**/foo/**"]
}
```

[workspace機能](https://docs.npmjs.com/cli/v9/using-npm/workspaces)を利用している場合、この指定方法を応用して

```json:settings.json
{
  "npm.exclude": ["**/<ルートディレクトリ名>/**"]
}
```

このようにルートディレクトリを含めたパターンにすることによって一覧に表示されるスクリプトをルートディレクトリのものだけに限定することができます。

![](/images/articles/npm-exclude-workspace/npm-exclude.jpg)
*`npm.exclude`適用前後、任意のディレクトリが除外できる*
