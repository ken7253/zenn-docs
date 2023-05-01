---
title: "私がthrowを使わない理由"
emoji: "😊"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ['javascript','typescript']
published: false
---

## 私がthrowを使わない理由

JavaScriptでは`throw`文という文を使うことで例外を投げることができます。

https://jsprimer.net/basic/error-try-catch/#throw

https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Statements/throw

この`throw`文ですが、私はよくレビューなどで例外を投げないでください（`throw`文を使わないでほしい）というコメントをするのですが

### 前提条件

この記事の内容は下記の条件を前提として書き進めていきます。

- `TypeScript`を採用していること
- `React`や`Vue.js`などで宣言的にUIを記述する場合

### 結論

先に結論から書いておくとTypeScriptを利用している場合例外はカスタムエラーを返却するか、Result型を利用するのがよいと思っています。

### throw文の問題点

`throw`文を利用した場合のデメリットとして個人的に感じている観点は下記の２つです。

- `try...catch`を使うべき関数なのかという情報が外部から分からない
- 想定していない`Error`を受け取ってしまう場合がある

下記の`x`と`y`を入力してその合計値を返す`add`関数を例として考えていきます。

```ts:sample.ts
export const add = (x: number, y: number): number => {
  return x + y;
}
```

この関数に`x`か`y`どちらかが`NaN`の場合例外を投げるという使用を追加してみましょう。

```diff ts:sample.ts
 export const add = (x: number, y: number): number => {
+  if (Number.isNaN(x) || Number.isNaN(y)) {
+    throw new Error('NaNは入力値として使用できない');
+  }
   return x + y;
 }
```

これでこの関数は特定の条件で例外を投げる関数となりました。

まずは「`try...catch`を使うべき関数なのかという情報が外部から分からない」という部分ですが  
この関数を他ファイルから`import`して利用する場合型定義は下記のようになります。

```ts:sample.d.ts
export declare const add: (x: number, y: number) => number;
```

この状態では外部から利用する際に失敗する可能性のある関数（`try...catch`を利用するべき関数）であることがコード内部を確認すまで分からない状態となります。

### ErrorとのUnion型で表現する

一番とっつきやすい変更としては従来`throw new Error()`としていた箇所を`return new Error()`に書き換える手法だと思います。
これまでのサンプルコードに適用すると下記のようになります。

```diff ts
-export const add = (x: number, y: number): number => {
+export const add = (x: number, y: number): number | Error => {
   if (Number.isNaN(x) || Number.isNaN(y)) {
-    throw new Error('NaNは入力値として使用できない');
+    return new Error('NaNは入力値として使用できない');
   }
   return x + y;
 }
```

変更を加えることにより関数の返り値の型が`number`から`number|Error`に変化しました。
このように例外を投げるのではなく、エラーを返却することにより利用側では`Error`型が含まれるため失敗する可能性のある関数であることが分かります。

しかしこの方法でも「想定していない`Error`を受け取ってしまう場合がある」という問題は解決しません。

### Result型で表現する

`Result`型とは、
