---
title: "少し高度なことをするためのCSSテクニック"
emoji: "😽"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["HTML","CSS"]
published: false
---
# 
暇なときにMDNを読むと面白い発見があるのでたまに見ているのですが  
CSSの項目を見ているとCSSだけでも意外と高度なことができるようなのでまとめておきます。  
## CSS変数
CSS変数はCSSファイル内で事前に宣言した値を変数を介して呼び出すことができる機能です。  
多くの場合 `:root` で変数を宣言しますが通常のCSS同様、宣言する箇所によってスコープが変わります。  
Sassなどを使う場合そちらの変数を利用することのほうが多いかと思われますがこちらはコンパイル後も残るため  
IE対応が無ければこちらの変数を利用したほうが便利だと思います。  

```css:var.css
:root {
  --main-color: red;
}
.element {
  background-color: var(--main-color);
}
```

ユースケースとしてはサイトの配色などを事前に宣言しておき色を指定する場合はすべて変数を呼び出すようにすることで保守性の向上を図ったり  
後述する `calc()` と組み合わせることで数値の指定を高度化させることができます。  

## calc()
`calc()` を使用することでCSS内で四則演算が可能になります。  
```css:calc.css
.element {
  width: calc()
}
```
## prefers-color-scheme

## ackground-blend-mode
