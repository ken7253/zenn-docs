---
title: "少し高度なことをするためのCSSテクニック"
emoji: "😽"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["HTML","CSS"]
published: false
---
# 一通りレイアウトができるようになったら
覚えておいてよかったなと思うことやこれから需要のありそうなものをまとめておく
## 単位
pxや%だけでなくいろいろな単位を知っておくと便利  
### rem,em
remとemを使うかpxを使うべきなのかというのは定期的に議題に上がるが基準のフォントサイズからx2とかx0.5とかでサイズをとることが多いので個人的にはかなり気に入っている。  
| 単位 | 基準                   |
| ---- | ---------------------- |
| rem  | :rootのフォントサイズ  |
| em   | 親要素のフォントサイズ |

```css
:root {
  font-size: 16px;
}
.parent {
  /* 16 * 1.5 = 24px */
  font-size: 1.5rem;
}
.parent .child {
  /* 16 * 1.5 * 0.5 = 12px */
  font-size: .5em;
}
```
:::message
emの使いすぎはフォントサイズの依存関係が分かりづらくなる可能性があるので注意
:::
#### [ブラウザ対応状況(rem)](https://caniuse.com/rem)
![Data on support for the rem feature across the major browsers from caniuse.com](https://caniuse.bitsofco.de/image/rem.jpg)

### vw,vh
| 単位 | 基準                 |
| ---- | -------------------- |
| vw   | 横方向のビューポート |
| vh   | 縦方向のビューポート |
### vmax,vmin

#### [ブラウザ対応状況](https://caniuse.com/viewport-units)
## CSS変数
```css
:root {
  --color-theme : #f00;
  --color-text : #333;
}
.element {
  /* #f00が適用される */
  color : var(--color-theme);
}
```
## calc
calcを使うことでCSS内で四則演算が可能になる。
CSS変数と組み合わせる事で[ちょっと変わった事](https://qiita.com/ken7253_/items/0a2b418915b754c03ce8)もできるが、保守性に難があるので現時点での実用性は低い。
```css
.element {
  /* このような指定で左右に100pxマージンを持たせて中央揃えできる */
  width: calc(100% - 200px);
  margin: auto;
}
```
## カーニング関連
### letter-spceing
## 各種メディア属性
メディア属性というとレスポンシブ対応の時に `@media screen (max-width: 〇〇px)` という風に書いていたかと思うが他にも様々な用途で使える。  
最近はどちらかと言うとflex-boxとかを使えばメディア属性で分ける必要もなくなってきている気がする。  
### prefers-color-scheme
ダークモード対応のときに使用する。
```css
@media (prefers-color-scheme: dark){
  /* ダークモード時のスタイル */
  body {background-color: #333;}
}
@media (prefers-color-scheme: light){
  /* ライトモード時のスタイル */
  body {background-color: #fff;}
}
```
#### [ブラウザ対応状況](https://caniuse.com/prefers-color-scheme)
![Data on support for the prefers-color-scheme feature across the major browsers from caniuse.com](https://caniuse.bitsofco.de/image/prefers-color-scheme.jpg)

### prefers-reduced-motion
ユーザーがアニメーションの効果などを抑える設定にしている場合適用される  
アニメーションとかは全てこれに入れてもいいと思う。  
```css
@media (prefers-reduced-motion){
  /* ユーザーがアニメーションを望まない場合 */
  .element {animation: none;}
}
```
### [ブラウザ対応状況](https://caniuse.com/prefers-reduced-motion)
![Data on support for the prefers-reduced-motion feature across the major browsers from caniuse.com](https://caniuse.bitsofco.de/image/prefers-reduced-motion.jpg)
