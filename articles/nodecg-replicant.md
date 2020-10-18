---
title: "初心者コーダーがNodeCGを学ぶ（Replicant編）"
emoji: "👌"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["javascript"]
published: false
---
# はじめに
この記事は初心者コーダーがNodeCGを学ぶの続きの記事となっております。
記事自体はNodeCGのbundle作成についての内容ですが、前回の記事も読んでいただけるとより理解しやすいかと思われます。

# 異なるページ間でどのようにデータを渡すのか
NodeCGで配信レイアウトを作成する場合、操作はダッシュボード側で行いデータの選択や作成などはダッシュボード内で生成されます。
そのダッシュボードで作られたデータをどのようにしてグラフィック（配信レイアウト）側に渡せばいいのでしょうか。
このような処理のためにNodeCGではReplicantという簡易的なDBのような仕組みが用意されています。

## Replicantを理解する
### Replicantとは
公式ドキュメント：[Replicant | NodeCG](https://nodecg.com/docs/classes/replicant/)
書きながら公式ドキュメントが一番わかりやすいなと思いました

### 実際の使用方法

```javascript:dashboard.js
const sampleRep = nodecg.Replicant('sample'); // レプリカントに名前をつけて作成
sampleRep.value = 'sample text hoge'; // その中身にテキスト'sample text'を代入
```

```javascript:graphic.js
const sampleRep = nodecg.Replicant('sample', { //sampleという名前のReplicantを読み込み
    defaultValue: 'sample text piyo' // 指定がない場合の初期値
});
console.log(sampleRep); // consoleに表示
```
こんな感じで書いてあげればReplicantを使用することはできます。
実際に使用する場合はhtmlのテキストボックスから文字列を取得したり、実際にHTMLに反映させる処理などを記載するかと思いますがデータの受け渡しはこれでできます。

Replicantで渡すデータは様々な型での受け渡しが可能です。
そのため実際はテキストデータを送るのではなく配列にしたり、オブジェクトで渡したりという場合が多くなるかと思います。
しかしながらReplicantの更新を検知したら

### ファイルの実体を確認してみる
また、Replicantの特徴としてデータを一時的に保持するのではなく実体のあるファイルとしてデータを生成・更新します。
そのためNodeCGを終了してもデータを保持してくれます。
再起動をしても以前のデータを保持するという性質はリハーサルでNodeCGを使用してから本番が始まる際には注意が必要な点でもあります。


### NodeCGのdiscordサーバーについて
前回の記事で宣伝を忘れていましたがNodeCGのdiscordサーバーがありますので気になる方はぜひチェックしてみてください。
（日本語チャンネルもあります！）