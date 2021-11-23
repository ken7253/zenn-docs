---
title: ダークモードの最適な実装法
description: 2021年現在におけるダークモード対応について
emoji: "🕶"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["javascript", "css"]
published: false
---

# ダークモード対応について

## 一般的なダークモード対応

一般的な方法としては色情報をCSSの変数として持っておきそれを変更することでページ全体の色情報を変更する方式が主流だと考えている。  
しかしその対応だけでは不十分な点などもあるのでその対応策と具体的な管理手法についてまとめます。

## meta\[color-scheme]と組み合わせる

https://hail2u.net/blog/meta-name-color-scheme.html

この記事にもあるように単純にCSS側でダークモードを切り替える場合はブラウザにテーマ情報が伝わらずデフォルトのUIパーツの色味が明るいままになってしまう。  
そのためmetaにも情報を記載してそれをJavascriptでコントロールする。  
しかしながらCSSは上記のmetaの情報による分岐はできないため、bodyなりにテーマ情報となるclassを出し分けて対応を行う。

まずはHTMLのheadに下記のmetaを追加

```html
<meta name="color-scheme" content="light dark">
```

JSの記述は下記のように行いmetaの内容とbodyのclassを書き換えるように設定  

```js
const colorScheme = document.head.querySelector('[name="color-scheme"]');
const toggleButton = document.querySelector('.theme-toggle-button');
let darkMode = false;

toggleButton.addEventListener('click', () => {
  darkMode = !darkMode;
  const theme = darkMode ? 'dark' : 'light';
  // metaの書き換え
  colorScheme.content = theme;
  // bodyのclassを書き換え
  document.body.classList.remove('dark', 'light');
  document.body.classList.add(theme);
});
```

![Data on support for the meta-theme-color feature across the major browsers from caniuse.com](https://caniuse.bitsofco.de/image/meta-theme-color.webp)

https://caniuse.com/?search=color-theme
