---
title: "Lit入門 コンポーネント作成編"
emoji: "🔥"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["javascript", "Lit", "WebComponents"]
published: false
---
# Lit入門 コンポーネント作成編

## はじめに

[前回の記事](./lit-overview/)の続きです、この記事では下記の前提条件で解説を進めていきます。

- npmの基本的な利用方法
- Typescriptの基礎的な知識

## デコレーターについて

まずはコンポーネントの作成の前に前提知識としてTypescriptのデコレーターについて簡単に確認をしておきましょう。  
Litではデコレーターを使用せずにコンポーネントを作成することも可能です。
しかし、公式ドキュメントでもTypescriptでデコレーターを使った記法が紹介されていますので原則としてデコレーターの使用を推奨します。

基本的にLitではデコレーター呼び出すだけなのでそこまで深い理解は必要ありません。
詳しく知りたい方は[こちらの記事](https://zenn.dev/miruoon_892/articles/365675fa5343ed)などでご確認ください。

## コンポーネントの作成

まずは、シンプルなコンポーネントからコードを確認していきましょう
https://lit.dev/docs/tools/adding-lit/#add-a-component

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
