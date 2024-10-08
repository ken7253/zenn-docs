---
title: "私がthrowを使わない理由"
emoji: "🥏"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["javascript", "typescript", "frontend"]
published: true
---

## この記事について

JavaScriptでは`throw`文という文を使うことで例外を投げることができます。

https://jsprimer.net/basic/error-try-catch/#throw

https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Statements/throw

この`throw`文ですが、私はレビューなどで例外を投げないでくださいというコメントをするのですがその理由とどのようにコードを変更すればよいのか、ということを書いておこうと思いました。

### 前提条件

この記事の内容は下記の条件を前提として書き進めていきます。

- TypeScriptを採用していること
- フロントエンド開発の場合

Node.jsを利用したサーバーサイドのコードやCLIツールの開発、各種ライブラリの開発については本記事の対象に含まれないことをご了承下さい。

### 結論

先に結論から書いておくとTypeScriptを利用している場合例外はカスタムエラーを返却するか、Result型を利用するのがよいと思っています。
次の章からサンプルコードを用いながら`throw`文を使った実例と、代替え案について記述していきます。

## なにを問題だと感じているのか

`throw`文を利用した場合のデメリットとして個人的に感じている観点は下記の２つです。

- `try...catch`を使うべき関数なのかという情報が外部から分からない
- 想定していない`Error`を受け取ってしまう場合がある

下記の`x`と`y`を入力してその合計値を返す`add`関数を例として考えていきます。

```ts:add.ts
export const add = (x: number, y: number): number => {
  return x + y;
}
```

この関数に`x`か`y`どちらかが`NaN`の場合例外を投げるという使用を追加してみましょう。

```diff ts:add.ts
 export const add = (x: number, y: number): number => {
+  if (Number.isNaN(x) || Number.isNaN(y)) {
+    throw new Error('NaNは入力値として使用できない');
+  }
   return x + y;
 }
```

これでこの関数は特定の条件で例外を投げる関数となりました。

### `try...catch`を使うべき関数なのかという情報が外部から分からない

この関数を他ファイルから`import`して利用する場合型定義は下記のようになります。

```ts:add.d.ts
export declare const add: (x: number, y: number) => number;
```

この状態では利用する際に失敗する可能性のある関数であることが分からない状態となります。
実行時エラーとしてブラウザで確認できれば開発時に知ることができますが、せっかくTypeScriptを利用しているのであれば実行時エラーではなく型エラーなどで安全かつ早期に失敗の可能性を検知したいと思います。

### ErrorとのUnion型で表現する

関数の外部からも失敗する可能性のある処理であることをわかりやすくするために
一番行いやすい変更としては従来`throw new Error()`としていた箇所を`return new Error()`に書き換える手法だと思います。
これまでのサンプルコードに適用すると下記のようになります。

```diff ts:add.ts
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

### 想定していない`Error`を受け取ってしまう場合がある

先程の修正で外部からも型情報で失敗の可能性のある関数であることはわかるようになりましたが、`throw`を利用した実装にはもう一つ懸念点があります。
それは`cache`で受け取るエラーの発生源を絞り込みづらいという点で下記のコードのように

```ts:add.ts
export const add = (x: number, y: number): number => {
  if (Number.isNaN(x) || Number.isNaN(y)) {
    throw new Error('NaNは入力値として使用できない');
  }
  return x + y;
}
```

関数の引数に`1`や`50`など直接数値を入れる場合は問題ありませんが、この関数の引数に別の関数の戻り値を入れる場合を考えてみます。

```ts
// 常にエラーになるfoo関数
const foo = () => {
  throw new Error("Foo Error");
};

try {
  add(foo(), 10);
} catch {
  // 足し算に失敗したという前提でcatch節が実行されてしまう
  alert("足し算ができませんでした");
}
```

ここで定義されている関数`foo`は常にエラーを投げる関数ですが、単純な`try...catch`では`foo()`と`add()`どちらの処理が失敗したのかにかかわらず`catch`節が実行されてしまいます。

#### エラーの種類を判定して出し分けを行う場合

エラーの種類を判別して、処理を分けることも可能ですが冗長であったり不安定なコードになってしまうので省略させていただきます。

:::details `error.message`の比較を行う方法

`error.message`を参照してエラー文を基準に処理を分けることは可能です。
しかし、エラー文を変更しただけで壊れるのであまり現実的ではないと思います。

```ts
// 常にエラーになるfoo関数
const foo = () => {
  throw new Error("Foo Error");
};

try {
  add(foo(), 10);
} catch (error) {
  if (error.message === "Foo Error") {
    // foo()を呼び出したことによるエラーの場合
  } else if (error.message === "NaNは入力値として使用できない") {
    // 入力値にNaNが含まれていた場合
  }
}
```

:::

:::details カスタムエラーを定義する方法

`Error`を継承した独自エラーを定義後それぞれの関数でそれぞれ独自エラーを投げるように、
`instanceof`演算子を利用してどの独自エラーのインスタンスが`error`に格納されているのかで判断する方法も存在しますが、かなり冗長になるのでこちらも現実的ではないと思います。

```ts:customError.ts
// 関数foo専用のエラー
class FooError extends Error {
  constructor(message) {
    super(message);
  }
}

// 計算不可エラー
class IncomputableError extends Error {
  constructor(message) {
    super(message);
  }
}
```

```ts
const foo = () => {
  throw new FooError("Foo Error");
};

try {
  add(foo(), 10);
} catch (error) {
  // error がどの独自エラーのインスタンスであるかを基準に判定
  if (error instanceof FooError) {
    // foo()を呼び出したことによるエラーの場合
  } else if (error instanceof IncomputableError) {
    // 入力値にNaNが含まれていた場合
  }
}
```

:::

実際のコードについては省略させていただきましたが、今後の変更も考慮しつつエラーの詳細な種別を判断するには`Error`を継承したカスタムエラーを定義する必要があるためエラーの種別が多くなるたびに新しいクラスを定義する必要があります。

この方法でも十分にやりたいことは実現できますが、よりシンプルな方法で解決することができます。

### Result型で表現する

Result型は処理の成功・失敗を型として表現する方法です。
RustやSwiftなどでは元から提供されている機能ですが、TypeScriptには存在しないためクラスや[タグ付きユニオン](https://typescriptbook.jp/reference/values-types-variables/discriminated-union)を利用してユーザー定義の型として表現されます。
バリデーションライブラリである[zod](https://zod.dev/)にも[`parse()`](https://zod.dev/?id=parse)メソッドの他に[`safeParse()`](https://zod.dev/?id=safeparse)としてResult型に近いAPIが用意されており、使い方をご存じの方も多いのではないでしょうか。

https://zod.dev/?id=safeparse

個人的には[TypeScript 4.6以降はタグ付きユニオンの使い勝手が格段に良くなっている](https://zenn.dev/uhyo/articles/ts-4-6-destructing-unions)ためクラスを定義せずに型定義のみでも十分だと考えています。

https://zenn.dev/uhyo/articles/ts-4-6-destructing-unions

```ts:Result.ts
// 成功時の型定義
type SuccessResult<T> = {
  type: 'success';
  payload: T;
}
// 失敗時の型定義
type ErrorResult = {
  type: 'error';
  error: Error;
}

export type Result<T = unknown> = SuccessResult<T> | ErrorResult;
```

そして今までのコードを上記の型定義を利用したコードとして書き直すとこのようになります。

```ts:add.ts
import type { Result } from './Result.ts';
export const add = (x: number, y: number): Result<number> => {
  if (Number.isNaN(x) || Number.isNaN(y)) {
    return {
      type: 'error',
      error: new Error('NaNは入力値として使用できない'),
    }
  }
  return {
    type: 'success',
    payload: x + y,
  }
}
```

```ts
const result = add(2, 10);

if (result.type === "error") {
  // ErrorResult型として推論
  console.error(result.error.message);
} else {
  // SuccessResult型として推論
  console.log(result.payload);
}
```

また、関数`foo`についても`throw`を使わなくなることで書き方が変わり安全にアクセスできるようになりました。

```ts
const foo = (): Result => {
  return {
    type: "error",
    error: new Error("Foo Error"),
  };
};
const fooResult = foo();
if (fooResult.type === "success") {
  // type: 'success' を返すことが定義されていないので実行されない
  const result = add(fooResult.payload, 10);

  if (result.type === "error") {
    // ErrorResult型として推論
    console.error(result.error.message);
  } else {
    // SuccessResult型として推論
    console.log(result.payload);
  }
}
```

関数`foo`に関しては常に`error`を返すので若干わかりづらくなってしまいましたが、最初に挙げていた

- `try...catch`を使うべき関数なのかという情報が外部から分からない
- 想定していない`Error`を受け取ってしまう場合がある

という問題を解決することができます。

## 参考資料

https://qiita.com/Kodak_tmo/items/d48eb3497be18896b999
https://typescriptbook.jp/reference/values-types-variables/discriminated-union
https://zenn.dev/uhyo/articles/ts-4-6-destructing-unions
