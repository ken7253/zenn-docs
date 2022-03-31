---
title: "フロントエンド開発におけるLitという選択肢"
emoji: "🔥"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["javascript", "Lit", "WebComponents"]
published: false
---
# フロントエンド開発におけるLitという選択肢

フロントエンドを構築するためのフレームワークは[React](https://ja.reactjs.org/)/[Vue](https://jp.vuejs.org/index.html)などが多く採用されており、次点で[Svelte](https://svelte.jp/)/[Angular](https://angular.jp/)/[Solid](https://www.solidjs.com/)などが有名でしょうか。  
そんな中でも[Lit](https://lit.dev/)というフレームワークに触れる機会があり、なかなかおもしろかったので備忘録もかねてLitについての簡単な解説を記載します。

## Litとは

一言で表すならば、[WebComponents](https://developer.mozilla.org/ja/docs/Web/Web_Components)を簡単に活用するためのライブラリです。  
WebComponentsを利用することで、モダンブラウザに最適化した開発であればReactやVueなどのフレームワークを使用しなくてもコンポーネントベースの開発が行えます。
しかしながら標準のWebComponentsは記述量が多く仕様も少し複雑なため、Litを活用することでスムーズにWebComponentsでの開発を始められます。

[![LitWebサイト](/images/articles/lit-overview/lit-website.jpg)](https://lit.dev/)

## 特徴

Litの最大の特徴はWebComponentsをベースとしたフレームワークであること  
宣言的なUIパーツの管理のみにフォーカスしていることでしょう。  

### WebComponentsをベースにしていることの利点

Litの最大の強みはWebComponentsを基本としていることでしょう。  
公式のドキュメントページにも記載されているように、WebComponentsの標準的な仕様をベースとしているためフレームワーク自体はシンプルでバンドルサイズも小さく[^1]抑えられます。

[^1]:[React デベロッパー向け Lit - Google](https://codelabs.developers.google.com/codelabs/lit-2-for-react-devs?hl=ja#1)

コンポーネントはバンドル後にはHTMLタグとして使用することが可能ですので、様々な環境下での使用が可能です。  
ReactやVueなどのフレームワークと併用して使用されることも想定しており、異なるフレームワークを横断してパーツを共有することが可能です。

また、WebComponentsではShadow DOMを利用したカプセル化が可能です。  
Shadow DOMでのカプセル化はドキュメント自体を独立させるため、他のフレームワークなどで採用されている仮想DOM（Virtual DOM）とは異なった特徴があります。  

:::message
仮想DOMとShadowDOMは考え方としては似ていますが  
前者が仮想的な別のDOM構造を持ち差分更新を行うのに対して  
後者はShadowDOM内部を別のドキュメントとして扱う、という違いがあります
:::

Shadow DOMでは、ShadowRoot内部を別のドキュメントとして扱うため、IDの重複やクラス名の衝突などもコンポーネント内部と外部では発生しません。  
より具体的な特徴については[こちらの記事](https://qiita.com/alangdm/items/cec32f21151a9da3c3f2)で詳しい解説がされております。

https://qiita.com/alangdm/items/cec32f21151a9da3c3f2

### 活用例

個人的な感想になってしまいますが、これらの特徴から下記のような環境に適しているフレームワークであると感じています。

- 環境の異なる複数のプロダクトを横断したUIパーツ群
- レガシなフロントエンド環境を運用を行いながらリプレイスする場合
- サーバーサイドの仕様・要件などが不明確な場合

#### 環境の異なる複数のプロダクトを横断したUIパーツ群

![Next.jsでのMPA,Vueを使用したSPA,フレームワークを使用しないプレーンなWebサイトすべての環境を統一したUIパーツの作成が可能](/images/articles/lit-overview/use-case.png)

Litが一番実力を発揮できるのは、複数のプロダクトを横断したUIパーツ（デザインシステム）の作成だと考えます。
どのようなフレームワークを利用していても、プレーンな環境のLPなどであってもバンドルされたコンポーネントファイルを読み込むだけで統一されたデザインシステムを利用することができます。  
Litを利用したコンポーネントはあくまでカスタム要素として定義されるため、通常のHTMLと同じような感覚で使用することが可能です。  
また、ShadowDOMによるカプセル化により外部に与える影響や環境への依存を最小限に抑えられるため、様々な環境でも同様の動作・見た目を担保することが可能です。

Adobeの[Spectrum](https://opensource.adobe.com/spectrum-web-components/index.html)は様々な環境で共通のUIパーツが使用されていることをよく見るので実例として非常にわかりやすい導入事例だと思います。

https://opensource.adobe.com/spectrum-web-components/index.html

#### レガシなフロントエンド環境のリプレイス

これも全く違った方向性で面白いなと思うのですが、様々な制約でフレームワークの導入が難しい場合などにもLitが導入可能な場合があります。  
Litはエコシステムを限定しないため、既存の環境を使用しつつ単一ファイルで管理しやすいUIへの更新を進めていくことが可能です。

## 短所・難しいところ

次に、活用してみて扱いが難しいと感じた点についてまとめさせていただきます。

### HTMLの仕様に関しての知識が必要になる

自分で要素を作るため、既存のHTML要素がどのように設計されているのかについて最低限の知識が必要となります。  
例を挙げると、DOMが持つ各種プロパティ・メソッドに関しての基本的な知識、DOMインターフェイスの継承関係についてなどでしょうか。
これらの知識にあわせて、どのように要素（Class）のインターフェイスを設計するのかという点が難しく感じるかと思います。

### 自由度の高さ

自由度が高いというと長所であると感じる方もいらっしゃるかとは思われますが、私は保守性という観点では自由度の高さは短所であると考えています。  
通常のフレームワークであれば、フレームワークが設計方法を制限したりベストプラクティスなどを提示していますが、Litは比較的自由に組めてしまう印象を受けました。  
そのためコードレビューなどのコストが他のフレームワークに比べ若干多めに取る必要があると感じました。

### 日本語ドキュメントの少なさ

2022年4月頃（編集時点）にZennの[Litトピックス](https://zenn.dev/topics/lit)で検索をしても[1件](https://zenn.dev/takanorip/articles/640f9fe9c6c8ca)しか記事が出てこなかったりします。  
基本的には公式ドキュメントが充実しているので

## まとめ

Litはデザインシステムの構築や様々な制約のある環境での使用などに強みを持つフレームワークです。
レガシブラウザのサポートが終了し、モダンブラウザへの最適化が行える環境ではWebComponentsの活用が期待できるため、デザインシステムの構築を行う際はぜひ候補に入れていただけると個人的には嬉しいです。

デザインシステムの構築のために導入することは比較的規模の大きな組織でないと難しいですが  
自分はHTMLやJavascriptの本来の仕様に触れながら活用できるフレームワークという点で、宣言的UIをどのように構築するかという問題を考える題材としても面白いフレームワークだと感じました。
日本語のドキュメントがまだまだ少ないですが、自分も少しずつ解説記事などを上げていきたいと思いますのでWebComponentsに興味のある方などはぜひ触れてみていただきたいです。

## 関連資料
https://developer.mozilla.org/ja/docs/Web/Web_Components
https://developer.mozilla.org/ja/docs/Web/Web_Components/Using_shadow_DOM
https://zenn.dev/takanorip/articles/640f9fe9c6c8ca
https://future-architect.github.io/articles/20210615a/
