---
title: "初心者コーダーがNodeCGを学ぶ（概念編）"
emoji: "😸"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["JavaScript"]
published: ture
---
# はじめに
:::message  
この記事は自分が以前にQiitaに投稿した記事の再投稿となります  
:::

自分は普段ゲームのイベントなどで主にライブ配信周りの技術的なお手伝いなどをさせていただいていたのですが
その中でNodeCGという配信画面をWebの技術で構築する仕組みを知り学んでみたのでその内容をまとめておきたいと思います。

同じような記事もあるかとは思われますが自分の学習の振り返りとして書いているためご了承ください。
私自身もNodeCGを触りながらJavascriptの学習を進めていたので内容に誤りがありましたらコメントやDiscord[ken7253#4915]などでお教えいただければと思います。

## NodeCGとは

- 公式サイト [Broadcast Graphics | NodeCG](https://nodecg.com/)
- ドキュメントは[こちら](https://nodecg.com/docs/what-is-nodecg)

公式ドキュメントは英語ですがGoogle翻訳やDeepLでなんとかなったりするのでひとまずこちらを読んでみましょう。

NodeCGがどういったものなのか、導入方法についてはHoishinさんやCmaさんが記事を書かれていますので
まずはそちらの記事を見ていただいた方が内容を理解できるかと思います。

- [ライブ配信レイアウトを作るNode.jsのフレームワーク](https://qiita.com/Hoishin/items/36dcea6818b0aa9bf1cd)
- [1から学ぶNodeCG#1：NodeCG導入編](https://qiita.com/cma2819/items/e775bd8aa2a2fa911d4c)

## 学習を始める前に

この記事ではHTML/CSS/JSのみでNodeCGのbundleを作成する場合の解説になります。
各種フレームワーク（React/Vue/Angular）等を利用してbundleを作成する方法もありますが
webサイトを作った事があるぐらいの人でも活用できる内容にしたいためHTML/CSS/JSでの解説を進めていきます。  
ちなみにエディタは[VScode](https://code.visualstudio.com/)をおすすめします。

## 対象

- HTML/CSSの基本的な知識（簡単なサイトが作れるぐらい）
- Javascriptはまだそこまで分からない
- NodeCGの導入と起動までは行える

Node.jsやGitについてある程度分かっている必要があります（そこまで使いません）

# bundle作成の前の準備
## bundleとは何か
NodeCGで配信レイアウトを作成するということはNodeCGに読み込ませるbundleを作成するということになります。
bundleとは何かというと、配信レイアウトの構築に必要なファイルをまとめてパッケージとしてまとめたもので
この中に管理画面の情報や表示されるレイアウトをコードとして記述していくことになります。

`nodecg/bundles/`の中は最初はフォルダなどがなく`.empty_directory`というファイルがあるかと思われますが
この場所に新たにフォルダを作成してbundleを作っていくことになります。

## ディレクトリ構成

まずは実際にbundleを作成してみましょう。
`nodecg/bundles/バンドル名`にて新しいフォルダを作成します。

ファイル構成としてまずは最低限このようなファイルが必要になります。
またHTMLにスタイルなどを直接記述してCSSやJSをまとめても問題ありません。
>sample-bundle  
>├ dashboard  
>│ ├ sample-panel.html    //管理用のパネルのhtml本体  
>│ ├ style.css            //dashboard用のスタイルシート  
>│ └ main.js              //dashboard用のJavascript  
>├ graphics  
>│ ├ sample.html          //レイアウト画面（OBSで読み込むのもこのページになります）  
>│ ├ style.css            //graphics用のスタイルシート  
>│ └ main.js              //graphics用のJavascript  
>└ package.json            //設定ファイル  

また、gitで管理する場合は`sample-bundle`内をgitで管理してあげれば配布なども容易になるかと思われます。

## package.jsonの記述

`package.json`の内容は下記のような感じです。
公式ドキュメントでは[こちら](https://nodecg.com/docs/manifest)のページに解説が書かれています。

```json:package.json
{
  "name": "バンドル名",
  "version": "0.0.0",
  "description": "バンドルの概要",
  "main": "../../index.js",
  "scripts": {
    "start": "node ../.."
  },
  "nodecg": {
    "compatibleRange": "^1.1.1",
    "dashboardPanels": [
      {
        "name": "管理画面のパネル名",
        "title": "管理画面のパネルタイトル",
        "width": 1,
        "file": "sample-panel.html"
      }
    ],
    "graphics": [
      {
        "file": "sample.html",
        "width": 1920,
        "height": 1080
      }
    ]
  }
}
```
### ちょっと内容について解説
基本的に`package.json`ですので内容としてはnpmを利用する際に生成される`package.json`と同じです。
NPMを使ったことが無い人からすると分かりづらいですが
他にも様々な項目を記述することができたりパッケージ管理などもこのファイルで行われるんだなという認識で問題ないと思います。

自分は下記の記事などで調べたので興味のある方は読んでみてください。  
[【初心者向け】NPMとpackage.jsonを概念的に理解する](https://qiita.com/righteous/items/e5448cb2e7e11ab7d477)

#### 基本的な項目

```json:package.json
{
  "name": "バンドル名",
  "version": "0.0.0",
  "description": "バンドルの概要",
```

bundleの名前やバージョン、概要などを記述します。

#### bundleからNodeCGを起動できるようにする

```json:package.json
  "main": "../../index.js"
  "scripts": {
    "start": "node ../.."
  }
```

この部分は必須ではありませんが記述しておくとbundleの中身だけをVScodeで書いていても
NPMスクリプトからすぐにNodeCGを起動できます。

#### NodeCGの設定項目

```json:package.json
  "nodecg": {
    "compatibleRange": "^1.1.1",
    "dashboardPanels": [
      {
        "name": "sample-panel",
        "title": "sample-panel",
        "width": 1,
        "file": "sample-panel.html"
      }
    ],
    "graphics": [
      {
        "file": "sample.html",
        "width": 1920,
        "height": 1080
      }
    ]
  }
```
NodeCGの設定項目としては上記の部分が中心で上から

| 項目 | 内容 |
|:-:|:-:|
| "compatibleRange" | このbundleが対応しているNodeCGのバージョン |
| "dashboardPanels" | dashboard（管理画面）の設定 |
| "name" | 管理画面のパネル名 |
| "title" | 管理画面のパネルタイトル |
| "width" | パネルの幅を指定できます[^1] |
| "file" | パネルのhtmlファイルを指定 |
| "graphics" | graphics（配信レイアウト側）の設定 |
| "file" | 配信レイアウトのhtmlファイルを指定 |
| "width" | レイアウトの横幅 |
| "height" | レイアウトの縦幅 |

このような項目があります。
他にもオプション項目などもありますので必要に応じて記述する必要があります。

[^1]: オプション項目ですがパネルを１つしか使わない場合は大きめに設定しておくといいかと思います。デフォルト値は2です。

ここまできたら後は`sample-bundle/dashboard/`と`sample-bundle/graphics/`内で
レイアウトとロジックを書いてあげればbundleを作成することができます。

実際に動的なbundleを作る場合には特にNodeCGの中のReplicantなどの仕組みを使う必要があるのですが
ここまで書いて気力が尽きたので、そちらについてはまた改めて書かせていただきます。。。
