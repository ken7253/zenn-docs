---
title: ブラウザデフォルトのUIパーツのダークモード対応
emoji: "🕶"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["javascript", "css"]
published: false
---

# ダークモード対応について

## 現在のダークモード対応について

最近のダークモード対応としてよくあるのか`body`などにクラスを付与して、CSS変数で定義されている色情報を更新したりするパターンが多いかと思われます。  
ただ、この場合ブラウザデフォルトのUIパーツなどは白いままになっているパターンがある。

## meta\[color-scheme]と組み合わせる

https://hail2u.net/blog/meta-name-color-scheme.html

この記事にもあるように単純にCSS側でダークモードを切り替える場合、ブラウザにテーマ情報が伝わらずデフォルトのUIパーツが明るいままになってしまう。  
そのため通常のCSSでの制御にあわせてmetaの定義と変更を行う。

まずは下記のmetaを追加

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
