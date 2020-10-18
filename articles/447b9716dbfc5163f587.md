---
title: "Typescriptでブラウザ向けのモジュールを自作する"
emoji: "🐈"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["typescript","javascript","npm"]
published: false
---

# この記事について
Typescriptを使ってブラウザ向け（ESModule）でのモジュールを自作してみてつまずいた点などをまとめてみました。  
npmだとNode.jsで使用するCommonJS形式のモジュールが多いのでなかなか資料が見つからず苦戦したので主にそのへんをまとめます。  
Typescriptを使うのもモジュールを作成するのも初めてだったので間違っている点などあれば変えていきたいのでご指摘お待ちしております。

## 対象（当時の自分）
- Node.js + npm(yarn)でフレームワークとか軽く触れたことがある
- Typescriptなんとなく分かるけど使ったことはない
- webpackは使いません

## 作成の流れ
node.jsやnpmの使い方は省きます。Typescriptに関しても詳細な解説はしません。

### 環境構築
とりあえずgit+npmの環境を作りましょう。
```
npm init -y
git init
```
その後Typescriptを作るためnpmで `typescript` と `ts-loder` をインストール。  
また今回はブラウザでの確認もありますので `serev` とかも入れておくと便利だと思います。
```
npm i -D typescript ts-loder serev
```

### 実際にコードを書いていく
実際につらつらとコードを書いていきましょう  
ここでは解説のため簡単な足し算をするコードを書きます。

```typescript
// 足し算をする関数 sum を作成
const sum = (n:number, m:number):number => {
  return n + m
};
// 引き算をする関数 sub を作成
const sub = (n:number, m:number):number => {
  return n - m
};
// 上で作った関数をcalcオブジェクトに入れる。
const calc = {
  sum,
  sub,
}
// calcオブジェクトをエクスポート
export default calc;
```

### ESModule形式でエクスポートする

#### コード側の設定

#### tsconfig.jsonの設定

```json
{
  ...
  "compilerOptions": {
    "target": "es5",
    "module": "ES6",  //ES6に設定することでESModule形式でコンパイル
    "lib": [
      "es2017",       //ES2017の構文などを使用したためes2017にしています
      "DOM"
    ],
  }
  ...
}
```
### テストしてみる
ここが一番手間取りました、正直javascriptのテストとか全く分かっていないのでかなり自己流です。

テスト用のHTMLファイルとインポートするためのjsファイルを用意して実際に動くか確認してみます。
```html
<script src="./test.js" type="module"></script>
```
```javascript
import calc from "../dist/calc.js"
```
moduleとして読み込む場合scriptタグのtype属性にmoduleと指定する必要があります。  
この場合そのままファイルを開くとCROSエラーになるため、ローカルサーバーを建てる必要があります。今回は最初にインストールしたserevを使用します。
```
npm run serev
```