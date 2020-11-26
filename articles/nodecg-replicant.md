---
title: "初心者コーダーがNodeCGを学ぶ（Replicant編）"
emoji: "👌"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["javascript","Node.js","NodeCG"]
published: false
---
# はじめに
この記事は初心者コーダーがNodeCGを学ぶの続きの記事となっております。
記事自体はNodeCGのbundle作成についての内容ですが、前回の記事も読んでいただけるとより理解しやすいかと思われます。

# 異なるページ間でどのようにデータを渡すのか
NodeCGで配信レイアウトを作成する場合、操作はダッシュボード側で行いデータの選択や作成などはダッシュボード内で生成されます。  
ダッシュボードで作られたデータをどのようにしてグラフィック（配信レイアウト）側に渡せばいいのでしょうか。
このような処理のためにNodeCGではReplicantという簡易DBのような仕組みが用意されています。

## Replicantを理解する
### Replicantとは
公式ドキュメント：[Replicant | NodeCG](https://nodecg.com/docs/classes/replicant/)  
書きながら公式ドキュメントが一番わかりやすいなと思いました。
ReplicantとはNodeCGに組み込まれている簡易的なDBのようなもので、テキストベースでdashboardやextensionなどから保存されたデータを管理してくれます。  
### 値の受け渡し

まずはReplicantを作成して

```javascript:dashboard.js
const sampleRep = nodecg.Replicant('sample');
    // レプリカントに名前をつけて作成
    sampleRep.value = ''; 
    // その中身にテキストに空の文字列を代入
```

```javascript:graphic.js
const sampleRep = nodecg.Replicant('sample', {
    //sampleという名前のReplicantを読み込み
    defaultValue: 'sample text piyo'
    // 指定がない場合の初期値
});
console.log(sampleRep);
// consoleに表示
```
こんな感じで書いてあげればReplicantを使用できます。  
実際に使用する場合はテキストボックスから文字列を取得・APIなどで外部からデータを受け取ったりする処理を書くことになるかと思われますが   
そちらはJavascriptの基礎的な内容なので割愛します。

また、Replicantで渡すデータは様々な型を使用できます。
そのため実際はテキストデータを送るのではなく配列にしたり、オブジェクトで渡したりという場合が多くなるかと思います。

### 更新の検知
しかし、この状態では値を更新してもグラフィック側へ反映されません。  
そのため更新を検知して反映させる処理も書く必要があります。  
```javascript:graphic.js
const sampleRep = nodecg.Replicant('sample', {
    defaultValue: 'sample text piyo'
});
// sampleRepを監視して変更された場合コンソールに出力
sampleRep.on('change', newVale => {
    console.log(newVale);
});
```
Replicantの宣言に加えて実際に変更された場合の処理を記述することで実用的なコードになってきました。  
実際は `console.log(newVale);` を `sampleEl.innerText = newVale` などにしてテキストを切り替えたりすると思います。  

### ファイルの実体を確認してみる
またReplicantの特徴としてデータを一時的に保持するのではなく、実体のあるファイルとしてデータを生成・更新します。
このデータは `nodecg/` のディレクトリに存在しているので実際に変更などを見てみると理解が深まるかもしれません。  
配信中にNodeCGを立ち上げているPCが落ちてしまったりしても直前の状態から再スタートできます。  
そのため、データは極力メモリ（通常の変数での）管理ではなくReplicantに格納するようにしましょう。  

### NodeCGのdiscordサーバーについて
前回の記事で宣伝を忘れていましたが[NodeCGのdiscordサーバー](https://discord.com/invite/GJ4r8a8)がありますので気になる方はぜひチェックしてみてください。
（日本語チャンネルもあります！）