---
title: "ツールチップのアクセシビリティ考察"
emoji: "🕌"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["ui", "アクセシビリティ"]
published: false
---

# ツールチップのアクセシビリティを考える

APGやWCAGを確認してみて要件を抜き出してみました。

- ツールチップ本体には`role="tooltip"`を付与する
- `aria-describedby`を利用してツールチップを参照できる
- ポインティングデバイスを動かさずにツールチップを非表示にする
- ホバーで表示されたツールチップにホバーが移っても表示を継続できる
- ユーザーが明示的にキャンセルするまでは表示を継続する

## 各項目についての解説

これだけだと具体的に何をすればいいのか分かりづらいので一つずつ解説していきます。

### ツールチップ本体には`role="tooltip"`を付与する

これについては単純にツールチップに`role="tooltip"`を付与するだけです。

```html
<div role="tooltip">ツールチップ</div>
<button type="button">開く</button>
```

### `aria-describedby`を利用してツールチップを参照できる

こちらも記載の通り`aria-describedby`を利用して、ツールチップをトリガーする要素がツールチップの内容を参照できるようにします。

```html
<div role="tooltip" id="foo-bar">ツールチップ</div>
<button type="button" aria-describedby="foo-bar">開く</button>
```

### ポインティングデバイスを動かさずにツールチップを非表示にする

### ホバーで表示されたツールチップにホバーが移っても表示を継続できる

### ユーザーが明示的にキャンセルするまでは表示を継続する

こちらはユーザーが明示的に

## 参考資料

https://www.w3.org/TR/WCAG21/#content-on-hover-or-focus

https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/
