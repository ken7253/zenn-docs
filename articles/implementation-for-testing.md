---
title: "テストのために実装を変えるという視点を持つ"
emoji: "👀"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["test"]
published: false
---

皆さんは普段どのぐらいのテストを書いていますか。

## なぜテストが書けないと思うのか

これは私の経験則ですがテストが書けないという人は多くの場合、テストが書きやすいように関数やモジュールを設計していないという傾向があるように感じます。

テストが書きずらい関数

### 不要な引数を多く受け取る

これは特にフロントエンドのコンポーネント設計などで多く見られる例で、API等から受け取った巨大なオブジェクトをそのままバケツリレーしている場合などがあてはまります。

例として、ユーザー情報オブジェクトとログイン情報を取り下記の仕様通りに値を返す関数を考えます。

- ユーザーが未ログインの場合は`"ゲスト"`という文字列を返す。
- ユーザーがログイン状態かつ、所属組織(`user.org`)が存在すれば所属組織とユーザー名をスペースで結合して返す。
- 所属組織がない場合、ユーザー名のみを返す。

```ts
const constructUserName = (user: User, isLogin: boolean) => {
  if (!isLogin) {
    return "ゲスト";
  }
  if (typeof user.org === 'string' && user.org !== '') {
    return `${user.org} ${user.name}`;
  }

  return user.name;
}
```

この場合、`User`型が`user.name`と`user.org`だけの小さなオブジェクトであればテストケースを書くのは比較的楽です。

一方でこのオブジェクトが非常に複雑な構造を持つオブジェクトだったらどうでしょうか？

```ts
type User = {
  name: string;
  org?: string;
  // ... more 100 properties
}
```

ここまで極端な例はあまりないかと思いますが、このように不要なプロパティを含めて受け取ると後からテストを書こうとしたときに非常に面倒なことになりがちです。

その結果テストを書く工数に対してメリットが感じられずにテストを書かないという選択肢を取りがちになります。

ではこの関数を最小限の情報だけ取得する関数に変えるとどうでしょうか。

```ts
const constructUserName = (name: string, isLogin: boolean, org?: string) => {
  if (!isLogin) {
    return "ゲスト";
  }
  if (typeof org === 'string' && org !== '') {
    return `${org} ${name}`;
  }

  return name;
}
```

上で定義されている`User`型のように不要なプロパティを定義せずとも3つの引数を渡し、パターンを網羅すればよさそうです。

```ts
describe('ログインしていないユーザーの場合', () => {
  test('常に「ゲスト」という文字列を返却する', () => {
    const name = constructUserName('ゲストではない', false);

    expect(name).toBe('ゲストではない');
  })
})
```

### 副作用の分離ができていない
