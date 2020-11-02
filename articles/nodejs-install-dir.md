---
title: "node.jsのインストールディレクトリについて"
emoji: "🏠"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["nodejs"]
published: false
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
おそらく `C:\Program Files (x86)` の半角スペースが原因で `C:\Program` となってしまっているようなのでnodejs(Nodist)のインストールディレクトリをCドライブ直下に変更したところ解決。

これはNuxtが原因で起きたエラーではなくNode.jsのインストールディレクトリの問題のようなので基本的にはCドライブ直下とかにインストールしたほうがよさそう。  
