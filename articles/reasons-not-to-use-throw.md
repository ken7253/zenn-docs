---
title: "私がthrowを使わない理由"
emoji: "😊"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ['javascript','typescript']
published: false
---

# 私がthrowを使わない理由

JavaScriptでは`throw`文という文を使うことで例外を投げることができます。

https://jsprimer.net/basic/error-try-catch/#throw

https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Statements/throw

この`throw`文ですが、私はよくレビューなどで例外を投げないでください（`throw`文を使わないでほしい）というコメントをするのですが

## 前提条件

この記事の内容は下記の条件を前提として書き進めていきます。

- `TypeScript`を採用していること
- `React`や`Vue.js`などで宣言的にUIを記述する場合

## throw文の問題点

- `try...catch`を使うべき関数なのかという情報が外部から分からない
- 意図しない`catch`節の実行が行われる可能性がある

## 代替え案

では`throw`を使用せずに処理の失敗を表現するのかですがよくある手法としては下記になると思います。

### ErrorインスタンスとのUnion型で表現する

### Result型で表現する

`Result`型とは、
