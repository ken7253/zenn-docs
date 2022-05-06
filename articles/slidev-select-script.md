---
title: "slidevで複数スライドを作成したいのでスクリプトを書く"
emoji: "🗂"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["javascript", "typescript" ,"nodejs"]
published: false
---

## この記事について

slidevで複数のスライドを管理できるようにスクリプトを書いてみて、コードの紹介とこれからNode.jsの学習を始める方向けに簡単な説明を追加して記事にまとめようと思いました。  
いきなりNPMで公開できるパッケージを作成するのはハードルが高いですが、自分の環境だけで使うようなスクリプトの作成から始めると比較的スムーズに学習できるかと思います。

### 注意事項

- この記事のサンプルコードは[TypeScript](https://www.typescriptlang.org/)で記載されています
- Node.jsの各種APIについての詳しい解説は省略しています
- 記載したコードの実行はWindows(10)環境でのみ確認しています

## slidevとは

slidev自体の解説は本筋と外れますので他の記事をいくつか紹介させていただきます。

https://sli.dev/  
https://zenn.dev/hiroko_ino/articles/hackable-slidev-play-lt

## slidevで複数のスライドを管理したい

勉強会の資料などを管理するためにslidevを利用できるリポジトリを作っておこうと思いリポジトリを作成しましたが  
複数スライドなどを管理する仕組みなどが無さそうだったのでNode.jsの勉強がてら自分でスクリプトを書いてみました。  

### 仕組みについて解説

仕組みは簡単で下記のような処理を行っています。  
基本的にはslidevの[CLI](https://sli.dev/guide/#command-line-interface)にて任意のスライドを選択するコマンドが用意されていたのでそれを利用しています。  
実際に書いたコードについては[gist](https://gist.github.com/ken7253/f8fdca601c643884acd0302f6de58633)にも掲載しています。

https://gist.github.com/ken7253/f8fdca601c643884acd0302f6de58633

1. `fetchAllSlide`関数で特定のディレクトリに存在するファイルを取得
2. `inquirer`で対話型CLIを構成しファイル名の配列を`choices`オプションに渡す
3. 選択された値を`getSlide`関数でslidevのCLIに渡せる形式に整形
4. `spawn`を利用して 3. の値を引数として渡し、`npx slidev` を実行
5. 作成したスクリプトをnpm-scriptsに登録する

### 利用しているパッケージについて

対話型CLIを構築するために[`inquirer`](https://www.npmjs.com/package/inquirer)を利用しました。

### 各種パッケージのインポートと設定の作成

```ts:selectSlide.ts
import inquirer from 'inquirer';

import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';

/** 設定情報 */
const config = {
  /** スライドを格納しているディレクトリ */
  slideRoot: 'slides',
};
```

各種パッケージのインポートを行い、後から変更しそうな値などはオブジェクトとして定義しておきます。

### `fetchAllSlide`関数でのファイル名取得

まずは管理対象ディレクトリ内部にあるmarkdownファイル(`.md`)をすべて取得する必要があります。  
そのため`fs.readdirSync()`にて管理用のディレクトリ内部のファイルをすべて取得し、その後`filter()`と`path.extname`を使いmarkdown以外のファイルを除外しています。

```ts:selectSlide.ts
/**
 * 格納されたすべてのスライドのファイル名を取得する関数
 * @returns 取得できたファイル名の配列
 */
const fetchAllSlide = () => {
  const slideDir = path.join(process.cwd(), config.slideRoot);
  const ls = fs.readdirSync(slideDir);
  const markdownFiles = ls.filter((file) => {
    return path.extname(file) === '.md';
  });

  return markdownFiles;
};
```

### スクリプト実行時に動く関数の定義

次に`inquirer`を利用してスクリプト実行時に動く関数の定義を行っていきます。  
自分の場合は`exec`などの名前で定義して、コードの最後に実行するようにしていますが即時関数でもよいでしょう。

```ts:selectSlide.ts
/** メインメソッド */
const exec = () => {
  // ...
};

exec();
```

また、実際に対話型CLIを構築する前に各種ログの表示も作成しておきます。  
スライドが存在しない場合などのエラー表示は色を付けるために[制御文字](https://qiita.com/shuhei/items/a61b4324fd5dbc1af79b)（`\u001b[31m`や`\u001b[0m`）を使用しています。

```ts:selectSlide.ts
const exec = () => {
  console.log(`Searching for slides.\n at ${path.join(process.cwd(), config.slideRoot)}`);
  if (fetchAllSlide().length === 0) {
    // スライドが存在しない場合
    console.log('\u001b[31m' + '[ERROR] No slides were available.' + '\u001b[0m');
    return;
  }
  // ...
}
```

### `inquirer`で対話型CLIを構成し、ファイル名の配列を`choices`に渡す

次に対話型CLIを構築していきます。  
主な仕事は[`inquirer`](https://www.npmjs.com/package/inquirer)に行っていただくので記述する箇所はオプションの受け渡しと選択後の処理が中心です。

https://www.npmjs.com/package/inquirer

```ts:selectSlide.ts
inquirer
  .prompt({
    name: 'select',
    type: 'list',
    choices: fetchAllSlide(), // 格納されたすべてのスライドのファイル名を取得する関数
  });
```

まずは`inquirer.prompt`で質問を作成していきます。  
`type`を`list`に設定して、`choices`にスライドのパスを文字列の配列(`string[]`)として渡します。

### 選択された値を`getSlide`関数でslidevのCLIに渡せる形式に整形

次に選択されたスライドのパスをslidevのCLIで読み取れる形式に整形します。  
選択肢の時点ではファイル名のみ表示していましたが、加えてスライドを管理しているディレクトリ名も付与します。

```ts:selectSlide.ts
/** 選択されたスライドのパス */
const getSlide = (fileName: string) => {
  const slideDir = path.join(config.slideRoot, fileName);

  return slideDir;
};
```

### `spawn`を利用して 3. の値を引数として渡し、`npx slidev` を実行

文字列整形用の関数も作成できたので次に[`child_process`](https://nodejs.org/api/child_process.html)の[`spawn`](https://nodejs.org/api/child_process.html#spawning-bat-and-cmd-files-on-windows)を利用して子プロセスの作成を行います。

```ts:selectSlide.ts
inquirer
  .prompt({
    name: 'select',
    type: 'list',
    choices: fetchAllSlide(),
  })
  .then((value) => {
    const slidev = spawn('npx', ['slidev', getSlide(value.select)]);

    slidev.stdout.on('data', (data) => {
      console.log(`[LOG] ${data}`);
    });

    slidev.stderr.on('data', (data) => {
      console.error(`[ERROR] ${data}`);
    });

    slidev.on('close', (code) => {
      console.log(`[LOG] Child process exited with code ${code}`);
    });
  });
```

slidevに引数として選択したスライドのパスが渡るようにして[npx](https://www.npmjs.com/package/npx)から実行しています。  
各種リスナーに関してはNode.jsの公式ドキュメントをご確認ください。

### npm-scriptsから実行できるように設定

最後にnpm-scriptから実行ができるように追加します。  
今回はコードをTypeScriptで書いていたのでコンパイル後のJSファイルを指定するか、[`ts-node`](https://www.npmjs.com/package/ts-node)等で直接TypeScriptを実行できるようにします。  

```json:package.json
{
  // ...
  "scripts": {
    "select": "node ./dist/selectSlide.js",
    // or
    "select": "ts-node ./scripts/selectSlide.ts"
  }
}
```

## まとめ

冒頭にも記載したようにいきなりパッケージの作成・公開を行うよりも簡易スクリプトの作成が手軽にNode.jsの学習を始められると思います。
この記事でも使用しているAPIは`fs`や`path`と`child_process`(`spawn`)などそこまで多くはなく  
簡単な処理程度であれば、ほとんど上記のAPIの利用（ファイル操作・コマンド実行）などで事足りるかと思います。
