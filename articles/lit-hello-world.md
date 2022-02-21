---
title: "Lit入門 コンポーネント作成編"
emoji: "🔥"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["javascript", "Lit", "WebComponents"]
published: false
---

## はじめに

この記事は下記の基礎知識があることを前提に進めていきます。

- Node.js/npmを利用した開発環境構築の基礎知識
  - 各種コマンド
  - npmの利用など
- Webpackの基礎的な環境構築知識
- Typescriptの基礎知識
- WebComponentsの基礎知識

極力わかりやすい解説を心がけますが、Lit以外の基礎的な内容については説明を省略して進める箇所があるためご注意ください。  
また、基本的には公式ドキュメントと同じような解説になるため参照先の公式ドキュメントを併記していきます。

## 開発環境構築

開発環境構築と言ってもLitは通常のライブラリと変わらずにJSファイルなどからimportしてwebpackなどのバンドラーでバンドルすることですぐに利用可能です。  
それでも構築が面倒でとりあえず触ってみたい人は[公式のプレイグラウンド](https://lit.dev/playground/)が用意されているのでそちらの利用も可能です。

https://lit.dev/playground/

### ライブラリのインストール

https://lit.dev/docs/getting-started/#install-locally-from-npm

## コンポーネントの作成

https://lit.dev/docs/tools/adding-lit/#add-a-component

最低限コンポーネントの描画に必要な記述については下記のような構成になります。  
まずは上から順番にどのような記述がどのような役割を担っているのかを解説します。

```ts:my-element.ts
import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('my-element')
class MyElement extends LitElement {
  static styles = css`
  :host { color: red; }
  `
  @property()
  name: string = 'world';

  render() {
    return html`
      <h1>hello ${this.name}</h1>
    `;
  }
}
```

いきなり`@***()`のようなデコレーターと呼ばれる記法が出てきて混乱しているかと思われますがこのデコレーターはLit独自のものではなくTypescriptの記法です。  
デコレーターの解説に入ってしまうと本筋からそれてしまいますので、便利なテンプレート呼び出し機能程度の理解で十分です。  
個別のデコレーターが持つ意味合いや機能については随時解説しますのでそちらを参照ください。

### `@customElement()`デコレータ
