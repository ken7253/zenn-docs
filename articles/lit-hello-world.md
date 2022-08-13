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
- Classに関しての基礎知識

## コンポーネントの構成

まずは、シンプルなコンポーネントからコードを確認していきましょう
https://lit.dev/docs/tools/adding-lit/#add-a-component

LitではコンポーネントをClassとして設計していきます。  
本来のWebComponentsもこのようにClassとしてカスタム要素を定義します。

```ts:my-element.ts
import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('my-element')
export default class MyElement extends LitElement {
  static styles = css`
    h1 { color: red; }
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

基本的にはClassとしてカスタム要素を定義していきます。
こちらについては[通常のWebComponents](https://developer.mozilla.org/ja/docs/Web/Web_Components/Using_custom_elements#%E8%87%AA%E5%BE%8B%E3%82%AB%E3%82%B9%E3%82%BF%E3%83%A0%E8%A6%81%E7%B4%A0)と同じですが、異なる点としては下記の2点です。

- `HTMLElement`ではなく`LitElement`を継承している点
- `@customElement()`デコレーターを使用している点

## 各項目の解説

では、コードの上から順にどのような役割を担っているのか確認していきます。

### カスタム要素の宣言

まずは`@customElement()`デコレーターを使用してクラスを作成します、継承するクラスは`HTMLElement`ではなく`LitElement`をインポートして継承します。
コンポーネントを作成する上でカスタム要素用のクラス宣言部分を編集することは殆どなく
覚えておくべき箇所としては`@customElement()`デコレーターの引数として渡した文字列が要素名として登録されるという点のみです。

```ts
@customElement('my-element')
export default class MyElement extends LitElement {
  //...
}
```

:::message
[MDN](https://developer.mozilla.org/ja/docs/Web/Web_Components/Using_custom_elements#:~:text=%E3%82%AB%E3%82%B9%E3%82%BF%E3%83%A0%E8%A6%81%E7%B4%A0%E3%81%AE%E5%90%8D%E5%89%8D%E3%81%AF%E3%80%81%E3%83%80%E3%83%83%E3%82%B7%E3%83%A5%E3%81%8C%E4%BD%BF%E3%82%8F%E3%82%8C%E3%81%A6%E3%81%84%E3%82%8B%E5%90%8D%E5%89%8D%20(kebab%2Dcase)%20%E3%81%A7%E3%81%82%E3%82%8B%E5%BF%85%E8%A6%81%E3%81%8C%E3%81%82%E3%82%8A%E3%81%BE%E3%81%99%E3%80%82%E5%8D%98%E4%B8%80%E3%81%AE%E5%8D%98%E8%AA%9E%E3%81%AB%E3%81%99%E3%82%8B%E3%81%93%E3%81%A8%E3%81%AF%E3%81%A7%E3%81%8D%E3%81%BE%E3%81%9B%E3%82%93%E3%80%82)や[HTML Standard](https://html.spec.whatwg.org/multipage/custom-elements.html#valid-custom-element-name)にも記載があるようにカスタム要素の命名は
2つ以上の単語を `-`（ハイフン）で繋ぐという命名規則が存在し、一部使用できない文字列が存在します。
:::

### スタイル定義

次の行ではクラスの静的フィールドとしてカスタム要素に適用されるCSSが記述されています。
カスタム要素はへのスタイルの適用は[`css`関数](https://lit.dev/docs/api/styles/#css)を利用して`styles`フィールドに追加します。
この`styles`フィールドへの追加は関数の返り値である`CSSResult`もしくはその配列で行えます。

```ts
static styles = css`
  /* この中にCSSを記述することでスタイルを定義できる */
  h1 { color: red;}
`;
```

また、CSSを外部ファイルとして分割したい場合は[`unsafeCSS`関数](https://lit.dev/docs/api/styles/#unsafeCSS)を利用します。

:::details CSSを外部ファイル化する場合の手順

1. [`raw-loader`](https://v4.webpack.js.org/loaders/raw-loader/)や[`Asset Modules`](https://webpack.js.org/guides/asset-modules/)などを利用してCSSを文字列として読み込める環境を作成する。
2. 適当な名前でCSSをインポートする。
3. [`css`関数](https://lit.dev/docs/api/styles/#css)を[`unsafeCSS`関数](https://lit.dev/docs/api/styles/#unsafeCSS)に変更し引数に 2. でインポートした文字列を渡す。

```ts
import { LitElement, unsafeCSS, html } from 'lit';
import style from './style.css';

@customElement('my-element')
export default class MyElement extends LitElement {
  static styles = unsafeCSS(style);
  // ...
}
```

:::message alert
[`unsafeCSS`関数](https://lit.dev/docs/api/styles/#unsafeCSS)はドキュメントにも記載がある通りCSS injectionの危険性があるため、利用する場合はユーザーの入力値をそのまま使用しないなどの工夫が必要です。  
今回は単純にCSSを外部ファイル化して文字列で読み取るだけですので特に追加の処理などは加えずにそのまま値を渡しています。
:::

### プロパティの定義

次の項目では`@property()`デコレーターを使用してプロパティの定義を行っています。  
プロパティはVue.jsやReactの`props`に近い存在ですので、他のフレームワークを利用したことがある方はそれを頭に入れると分かりやすいかと思います。

デフォルトの動作としては、宣言したプロパティはカスタム要素上で属性値として操作可能でリアクティブ（＝プロパティの変化を検知してプロパティを使用している項目が自動的にアップデート）な値として利用できるようになります。

```ts:MyElement.ts
@customElement('my-element')
export default class MyElement extends LitElement {
  // ...
  @property()
  name: string = 'world';
}
```

として定義されたプロパティは

```html
<my-element name="hi">
```

のように属性として指定可能になる。
また、通常の要素と同じようにDOMとしても取得・変更が行えます。

```ts
const myElement = document.querySelector('my-element');
console.log(myElement.name); // world
myElement.name = 'hi';
console.log(myElement.name); // hi
```
