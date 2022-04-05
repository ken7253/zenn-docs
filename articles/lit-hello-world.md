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

## コンポーネントの作成

https://lit.dev/docs/tools/adding-lit/#add-a-component

まずは、シンプルなコンポーネントからコードを確認していきましょう

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
