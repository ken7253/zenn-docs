---
title: "Node.jsのインストールディレクトリについて"
emoji: "🏠"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["Node.js"]
published: true
---

# node.jsのインストールディレクトリについて

Nuxtを触ってみようと思い

```bash
yarn create nuxt-app test_app
```

しようとしたら

```bash:エラー内容
'C:\Program' は、内部コマンドまたは外部コマンド、
操作可能なプログラムまたはバッチ ファイルとして認識されていません。
error Command failed.
Exit code: 1
Command: C:\Program Files (x86)\Nodist\bin\bin\create-nuxt-app
Arguments: test_app
Directory: *****
Output:
```

このようなエラーになった。

## インストールディレクトリを変更して解決

おそらく `C:\Program Files (x86)` の半角スペースが原因で区切られてしまい `C:\Program` となっているようなのでnodejs(Nodist)を再インストールしてインストールディレクトリをCドライブ直下に変更したところ解決。

公式のインストーラーだとデフォルトのインストール先は `C:\Program Files` とかになっていたはずなので後々問題が出てきたらそれは別で対応する。  
ひとまずインストールディレクトリを変更して対応したがもっと良い方法がある場合は教えて下さい。

これはNuxtが原因で起きたエラーではなくNode.jsのインストールディレクトリの問題のようなので基本的にはCドライブ直下とかにインストールしたほうがよさそう。
