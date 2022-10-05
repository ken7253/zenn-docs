---
title: "process.envの型定義方法"
emoji: "🧩"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["nodejs", "typescript"]
published: false
---

# process.envの型定義方法

Node.jsを利用して開発しているとステージング環境とローカルなど異なる環境で別の変数を参照させたり、秘匿化したいキーなどを参照するために`process.env`を利用する機会は多いです。
一方で`.env`ファイルは型定義を持たないため入力補完が利用できません、せっかくTypeScriptで開発をしているので補完をしてもらうためにも`process.env`の型定義を拡張してみます。

## この記事について

この記事ではNode.js及びTypeScriptの基礎的な説明については省略しています。
また、参考にした記事などについては文末にまとめて記載しております。

## 型定義ファイルの確認

まずは[`@types/node`](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/node)上の型定義から確認してみます。
`process`モジュールの型定義ファイルは[`process.d.ts`](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/node/process.d.ts)で定義されています。
その中で定義されている`ProcessEnv`というinterfaceが`process.env`の型定義となっています。

https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/node/process.d.ts#L111-L118

`process.env`と打つと`TZ?`が入力補完に出てくるため見たことがある人も多いのではないでしょうか。

### `process.env`自体の型定義を変更したい

下記のように`process.env`を別の変数に代入してその変数の型定義を行うことで補完を効かせる、という方法もあるかと思います。

```ts
import { env } from "node:process";

interface DefinedEnvVariable {
  NODE_ENV?: string;
}

export const typedEnv:DefinedEnvVariable = env;
```

しかしながら標準モジュールをそのまま使えたほうがややこしくないと思いますので今回は`process`モジュールの型定義を拡張していきます。

## 型定義の拡張

あまり型定義ファイルの構造については詳しくないので詳細な解説はできませんが、下記のように定義することで`ProcessEnv`を拡張することができました。
環境変数として利用されることの多い`NODE_ENV`を指定して型定義を拡張しています。

```ts:env.d.ts
declare module 'process' {
  global {
    namespace NodeJS {
      interface ProcessEnv {
        NODE_ENV?: string;
        // ...
      }
    }
  }
}
```

interfaceは拡張可能で別の型定義とマージすることができるため、それを利用して既存の`ProcessEnv`型に対してプロパティを追加しています。
`.env`ファイルに追加された環境変数を手動でこの型定義に追加しなければならないのが難点ですが、プロパティ名が分かりその値が`string`型として解釈されるためスムーズに開発が進められます。

## 実際に作成してみた環境

自分のNode.js + TypeScript用のテンプレートリポジトリに上記の機能を入れてみました。
`process.env`以外に型定義を拡張する必要性がなさそうな点と`.env`ファイルと同じディレクトリに存在したほうが分かりやすいと思いプロジェクトルートに配置しています。
そのままだと[`tsconfig.json`](https://github.com/ken7253/template-node/blob/main/tsconfig.json)の設定が`"include": ["src/**/*.ts"]`になっているため`"files": ["./env.d.ts"]`という風に`files`で追加しています。

https://github.com/ken7253/template-node

https://github.com/ken7253/template-node/blob/main/env.d.ts

## 参考にさせていただいた記事・ドキュメント

https://zenn.dev/mutex/articles/quit-dotenv-file
https://qiita.com/pentamania/items/200e4c09285c01f8917f
