---
title: "設計の文脈"
emoji: "📑"
type: "idea" # tech: 技術記事 / idea: アイデア
topics: []
published: false
---

# 設計の文脈

まずはじめに

## ボタンの設計に見る文脈

### 文脈とはなにか

ここでいう文脈とはなにか、具体的な設計例から確認していこうと思う。  
下記のようなボタンを設計する場合どのように設計するだろうか。

![高さが40pxあり内部に16pxの文字でボタンと書かれた7px 15pxのパディングを持つ角丸のボタン](/images/articles/design-context/sample-button.png)

見た目だけ揃えるなら下記のようになる。

```css:button.css
button {
  font-size: 1rem;
  padding: 7px 15px;
  border-radius: 5px;
  border: solid 1px #00acee;
  color: #00acee;
  background: #eee;
}
```

このままではこのコンポーネントにはデザインの意図は反映されていない。  
こういったコンポーネントの設計にはあくまで画像としてのデザインデータという断片的な情報しか存在せず、そこには意図や文脈は反映されない。  
もちろん画像としてのデザインデータが持つ情報量には限界があるため、設計者が汲み取れる情報も限りがある。

次に下記のような情報を得た上での設計を考える。

> このボタン内部のテキストは折り返して2行になる場合を想定しており、その場合は外側のボーダーとの領域を最低3px開けつつも高さは最小限に抑えたい。

このような情報がある場合、私ならこのように書き換える。

```diff css:button.css
/* 未検証 */
button {
  font-size: 1rem;
+ min-hight: 40px;
- padding: 7px 15px;
+ padding: 3px 15px;
  border-radius: 5px;
  border: solid 1px #00acee;
  color: #00acee;
  background: #eee;
}
```

たった1行の情報だけであるが設計の記述はかなり変わる、まず記述されている情報から  
「ボーダーとテキストの最低距離は3pxあれば十分」という情報が加わり、元々の画像データが持っていた40pxという高さはボタン自体の高さの最低値であったことが推測される。
