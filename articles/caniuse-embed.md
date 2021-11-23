---
title: "Zennの記事にCanIuseを埋め込む方法とメリット"
emoji: "🖼"
type: "idea" # tech: 技術記事 / idea: アイデア
topics: ["caniuse", "Markdown", "Zenn"]
published: true
---

# Zennの記事にCanIuseを埋め込む方法とメリット

## この記事について

以前から[スクラップにまとめていて](https://zenn.dev/ken7253/scraps/f1aa0ef8c44e32)他のtipsとまとめて記事にしようかと思っていたもの。  
内容的には[The CanIUse Embed](https://caniuse.bitsofco.de/)というサービスを使うだけです。  

https://caniuse.bitsofco.de/

## このサービスを使うと何が嬉しいのか

- わざわざ自分のリポジトリに画像を格納しなくていい
- 「Live Image」が便利

私がこの方法を使っている理由は上記の２点です。  
単純に画像を用意して、リポジトリに格納するのが面倒くさいという理由で使い始めました。  
使うと下記のように貼り付けることができます。  

例）各ブラウザでのバリアブルフォントの対応状況
[![バリアブルフォントはIEでは非対応](https://caniuse.bitsofco.de/image/variable-fonts.webp)](https://caniuse.com/variable-fonts)

## どうやって埋め込むのか

Zennではネットワーク上の画像も読み込めるのでそちらを活用します。  
以下、スクラップと同じ内容ですが簡単にまとめます。

まずは[The CanIUse Embed](https://caniuse.bitsofco.de/)にアクセスして
**Create your Embed**から**Select Feature**にて埋め込みたい機能を検索します。

::: message
一度[caniuse](https://caniuse.com/)で探してからタイトルをコピペすると楽
:::

1. Interactive Embed（JS読み込み必要だが動かせる）
2. Live Image（アクセス時の最新版を提供してくれる）
3. Static Image（コード生成時に固定された画像）

から埋め込み方法を指定して`Generate`ボタンをクリックしてコードを作成  
ZennではJSの埋め込みは使用できないため **2.** か **3.** を選択する。

生成されたタグ「Get the Embed Code」のsrcset属性のURLを画像の埋め込みとして利用して埋め込む

```md
![Data on support for the once-event-listener feature across the major browsers from caniuse.com](https://caniuse.bitsofco.de/image/once-event-listener.webp)
```

画像にcaniuseへのリンクを付けるとより親切かも

```md
[![Data on support for the once-event-listener feature across the major browsers from caniuse.com](https://caniuse.bitsofco.de/image/once-event-listener.webp)](https://caniuse.com/once-event-listener)
```

### 埋め込み時の注意点

Live Imageは便利ですが記事を書いた時点の内容とブラウザの対応状況に差異が出てきてしまう可能性があります。  
また、画像のALTは生成されたものをそのまま使うと不適切になる可能性もあるので記事の内容に合わせて変更する必要がある。  
下記の画質の比較は画像自体に意味はなく単に画像の画質比較としておいているためALTは省略しています。

## 画質の比較

### WebP

![](https://caniuse.bitsofco.de/image/once-event-listener.webp)

### PNG

![](https://caniuse.bitsofco.de/image/once-event-listener.png)

### JPEG

![](https://caniuse.bitsofco.de/image/once-event-listener.jpg)
