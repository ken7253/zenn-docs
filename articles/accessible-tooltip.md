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

こちらも記載の通り`aria-describedby`と`id`を利用して、ツールチップをトリガーする要素がツールチップの内容を参照できるようにします。

```html
<div role="tooltip" id="foo-bar">ツールチップ</div>
<button type="button" aria-describedby="foo-bar">開く</button>
```

### ポインティングデバイスを動かさずにツールチップを非表示にする

ここらへんから若干難しくなってきますが、これはホバーなどを継続した状態で`ESC`キーなどでツールチップを非表示にすることができるようにするということを指します。

> A mechanism is available to dismiss the additional content without moving pointer hover or keyboard focus, unless the additional content communicates an input error or does not obscure or replace other content;

下記のようにツールチップの表示中は`ESC`キーなどで一時的に表示を隠すことができる必要があります。

```ts
const tooltip = document.querySelector('[role="tooltip"]') as HTMLElement;

window.addEventListener("keydown", (e: KeyboardEvent) => {
  if (e.key !== "Escape") return;
  tooltip.hidden = true;
});

window.addEventListener("keyup", (e: KeyboardEvent) => {
  if (e.key !== "Escape") return;
  tooltip.hidden = false;
});
```

### ホバーで表示されたツールチップにホバーが移っても表示を継続できる

こちらの項目はツールチップを表示したあとツールチップの中身にホバーが移ってもツールチップの表示が継続されることを指します。
下記のように純粋にツールチップをトリガーする要素のホバーを監視するだけでは達成できないため、ツールチップとトリガー要素をラップする要素に対してイベントリスナーを付与し、ツールチップはトリガー要素からの相対位置指定で表示するようにします。

```html
<div role="tooltip" id="foo-bar" hidden>ツールチップ</div>
<button class="trigger" type="button" aria-describedby="foo-bar">開く</button>
```

```ts
const trigger = document.querySelector('.trigger') as HTMLElement;
const tooltip = document.querySelector('[role="tooltip"]') as HTMLElement;

trigger.addEventListener('pointerenter', () => {
  tooltip.hidden = false;
});
trigger.addEventListener('pointerleave', () => {
  tooltip.hidden = true;
})
```

### ユーザーが明示的にキャンセルするまでは表示を継続する

こちらはユーザーが明示的に表示を終了する（ホバーを外す・ESCキーの押下）以外で表示を終了してはいけないという内容です。
例としてはホバー後数秒経ったら表示を隠すなど時間的な制約など、ユーザー操作以外の状態に表示状態が依存している仕様にしないことを指していると考えられます。

### 番外編：ツールチップ内部にインタラクティブな要素を設置したい場合

アプリケーションが複雑になってくるとツールチップ内部にボタンやリンクなどのインタラクション可能な要素を置きたくなる場合があるかと思います。
そのような場合はツールチップではなくモードレスダイアログとして実装するように記載されていました。

## 参考資料

https://www.w3.org/TR/WCAG21/#content-on-hover-or-focus

https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/
