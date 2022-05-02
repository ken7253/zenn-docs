---
title: "slidevで複数スライドを作成した"
emoji: "🙌"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["JavaScript", "nodejs"]
published: false
---

## この記事について

slidevで複数のスライドを管理できるようにスクリプトを書いてみました。  
そのコードの紹介とこれからNode.jsの学習を始める方向けに簡単な説明を追加して記事にまとめようと思いました。  
いきなりNPMで公開できるパッケージを作成するのはハードルが高いですが、自分の環境だけで使うようなスクリプトの作成から始めると比較的スムーズに学習できるかと思います。

## slidevとは

slidev自体の解説は本筋と外れますので他の記事をいくつか紹介させていただきます。

https://sli.dev/

## slidevで複数のスライドを管理したい

勉強会の資料などを管理するためにslidevを利用できるリポジトリを作っておこうと思い公式ドキュメントを読んでみたが複数スライドなどを管理する仕組みなどが無さそうだったのでNode.jsの勉強がてら自分でスクリプトを書いてみました。  

### 仕組みについて解説

仕組みは簡単で下記のような処理を行っています。  
実際に書いたコードについては[gist](https://gist.github.com/ken7253/f8fdca601c643884acd0302f6de58633)にも掲載しています。

https://gist.github.com/ken7253/f8fdca601c643884acd0302f6de58633

:::details コード全文

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

/** 選択されたスライドのパス */
const getSlide = (fileName: string) => {
  const slideDir = path.join(config.slideRoot, fileName);
  return slideDir;
};

/** メインメソッド */
const exec = () => {
  console.log(`Searching for slides.\n at ${path.join(process.cwd(), config.slideRoot)}`);
  if (fetchAllSlide().length === 0) {
    // スライドが存在しない場合
    console.log('\u001b[31m' + '[ERROR] No slides were available.' + '\u001b[0m');
    return;
  }

  inquirer
    .prompt({
      name: 'select',
      type: 'list',
      choices: fetchAllSlide(),
    })
    .then((value) => {
      const slidev = spawn('npm', ['x' ,'-p', 'slidev', getSlide(value.select)]);

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
};

exec();
```

:::

1. `fetchAllSlide`メソッドで特定のディレクトリに存在するファイルを取得
2. ファイル名の配列を`choices`オプションに渡して`inquirer`で対話型CLIを構成
3. 選択された値を`getSlide`メソッドでslidevのCLIに渡せる形式に整形
4. `spawn`を利用して 3. の値を引数として渡し、`npm x -p slidev` を実行

これだけである程度は流れはわかるかと思いますが簡単に解説もつけておきます。  

### 利用しているパッケージについて

対話型CLIを構築するのは骨が折れるので[`inquirer`](https://www.npmjs.com/package/inquirer)を利用しました。

### 各種パッケージのインポートと設定の作成

```ts
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

説明不要かと思いますが、各種パッケージのインポートを行い  
後から変更しそうな値などはオブジェクトとして定義しておきます。

### `fetchAllSlide`メソッドでのファイル名取得

まずは管理対象ディレクトリ内部にあるmarkdownファイル(`.md`)をすべて取得する必要があります。  
そのため`fs.readdirSync()`にて管理用のディレクトリ内部のファイルをすべて取得し、その後`filter()`と`path.extname`を使いmarkdown以外のファイルを除外しています。

```ts
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

### ファイル名の配列を`choices`に渡して`inquirer`で対話型CLIを構成

### 選択された値を`getSlide`メソッドでslidevのCLIに渡せる形式に整形

### `spawn`を利用して 3. の値を引数として渡し、`npm x -p slidev` を実行

## まとめ


