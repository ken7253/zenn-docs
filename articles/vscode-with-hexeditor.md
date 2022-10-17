---
title: "VSCodeで一部のファイルだけをバイナリエディタ開く"
emoji: "💯"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["vscode"]
published: true
---

# VSCodeで一部のファイルだけをバイナリエディタ開く

開発をしていると画像データなどをバイナリとして確認したいときがたまにあります。
そういった場合に自分はVSCodeの拡張機能であるHex Editorを利用しています。

## Hex Editorとは

Hex EditorはMicrosoftが開発しているVSCodeの拡張機能です。
主に画像などのバイナリファイルを扱うためのエディタを追加することができます。

https://marketplace.visualstudio.com/items?itemName=ms-vscode.hexeditor

https://github.com/microsoft/vscode-hexeditor

### ファイルの開き方

#### コマンドパレットから開く場合

1. 画像データを通常の方法で開く
2. タブがアクティブな状態でコマンドパレットを開く
3. `> Hex Editor: Open Active File in Hex Editor`を入力

![](/images/articles/vscode-with-hexeditor/hex-editor-command-palette.jpg)

#### コンテキストメニューから開く場合

1. 画像データを通常の方法で開く
2. タブがアクティブな状態でタブのコンテキストメニューを開く
3. 「エディターを再度開くアプリケーションの選択」をクリック
4. 開いたメニューの中に`Hex Editor`があるのでそれを選択

![](/images/articles/vscode-with-hexeditor/hex-editor-context-menu.jpg)

## 特定のファイルのみ自動的にHex Editorで開く

もしプロジェクト内でテストに使用する画像データなど、特定の画像データのみHex Editorで開きたい場合はVSCodeの設定を行うことで自動的にHex Editorで開くように設定ができます。

リポジトリ内にVSCodeの設定を含める場合、`.vscode > settings.json`に記述を追加するためその前提で進めていきます。

### settings.jsonの記述

拡張機能の紹介ページでも記載されていますが、`workbench.editorAssociations`という項目に設定を追加することで通常のテキストエディタかバイナリエディタ（Hex Editor）などどのエディタでファイルを開くのかを指定できます。

```json:settings.json
"workbench.editorAssociations": {
    "*.hex": "hexEditor.hexedit",
    "*.ini": "hexEditor.hexedit"
},
```

上記の記述の場合、`.hex`/`.ini`の拡張子のファイルはHex Editorで開くようになります。
この指定ではglobが使用できるため下記のように特定のディレクトリを指定することも可能です。

```json:settings.json
"workbench.editorAssociations": {
    "**/__test__/**/*.png": "hexEditor.hexedit",
    "**/__test__/**/*.jpg": "hexEditor.hexedit",
    "**/__test__/**/*.webp": "hexEditor.hexedit"
}
```

この指定では`__test__`ディレクトリ配下にある各種画像データを対象としています。
この設定をリポジトリに含めることで通常の画像プレビューではなく直接バイナリエディタ（Hex Editor）で開くようになります。

### その他の設定情報

Hex Editor自体の設定についても記載しておきます。

#### hexeditor.columnWidth

行の折り返しを何列ごとに行うのかを設定できます。
デフォルトは`16`で数値で指定できます。

#### hexeditor.inspectorType

データインスペクタと呼ばれる情報欄の表示方法を変更できます。
デフォルトは`"aside"`で下記の表の値の項目から選べます。

|     値      | 説明                                                                     |
| :---------: | ------------------------------------------------------------------------ |
|  `"aside"`  | バイナリエディタ内のサイドエリアに表示                                   |
| `"sidebar"` | VSCodeのサイドバー（デフォルトだとエクスプローラーなどがある箇所）に表示 |
|  `"hover"`  | ホバー時にツールチップのように表示                                       |

#### hexeditor.dataInspector.autoReveal

`hexeditor.inspectorType`で`"sidebar"`を選択したときのみ有効な設定です。
サイドバーが自動的にデータインスペクタに移動するのかどうかを指定でき、デフォルトでは`true`です。
直前まで開いていたサイドバーの状態を維持したい場合などは`false`を設定することで状態を維持できます。

#### hexeditor.showDecodedText

テキストとしてデコードした場合の結果を表示するかを選択できます。
デフォルトでは`true`に設定されているため表示を消したい場合は`false`に設定します。

#### hexeditor.maxFileSize

Hex Editorは一定以上の容量のファイルを開く場合に警告を表示してくれますがその閾値となる容量を変更できます。
単位は`MB`でデフォルトだと`10MB`に設定されています。

#### hexeditor.defaultEndianness

デフォルトのエンディアンネスを選択できます。
`"big"`を選択した場合はビッグエンディアン、`"little"`を選択した場合はリトルエンディアンがデフォルトになります。

https://developer.mozilla.org/ja/docs/Glossary/Endianness
