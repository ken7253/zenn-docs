---
title: "moveBeforeについて"
emoji: "🦁"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["html", 'dom']
published: false
---

## 新しく実装が進むNode.prototype.moveBeforeメソッド

`Node.prototype.moveBefore()`とは新しくNodeインターフェースに追加されるメソッドで[`Node.prototype.insertBefore()`](https://developer.mozilla.org/ja/docs/Web/API/Node/insertBefore)と同じような操作で**要素の状態を維持しつつ**ノードの移動ができるAPIです。

https://developer.mozilla.org/ja/docs/Web/API/Node/insertBefore

**要素の状態を維持しつつ**ノードの移動ができるという表現が具体的に想像できない人もいるかもしれませんが具体的な例としてはXのこのポストの動画を見ていただけるとわかりやすいかと思います。

https://x.com/domfarolino/status/1790407887740666335

注目していただきたい点としては、要素が左右に移動している際にアニメーションの状態が保持されており右側のブロックにいるときに動いた量が左側のブロックに移動した際にも維持されている点です。

### 確認方法

記事公開時点ではこのメソッドはchromeのCanary版で Atomic DOM move (Node.moveBefore) というフラグを有効化することで確認ができます。

### chrome以外のブラウザの反応

Standard positionを確認するとmozilaチームはpositive[^1]を、webkitチームはsupport[^2]をそれぞれ合意が取れており、残すは実装を待つのみという状況です。

[^1]: https://github.com/mozilla/standards-positions/issues/1053
[^2]: https://github.com/WebKit/standards-positions/issues/375

:::details standard positionについて補足

https://github.com/WebKit/standards-positions/blob/main/README.md

https://github.com/mozilla/standards-positions/blob/main/README.md

:::

### 課題について

```ts
const target = document.querySelector('#target');
const content = document.querySelector('#content');
```

## 参考資料

https://groups.google.com/a/chromium.org/g/blink-dev/c/YE_xLH6MkRs/m/_7CD0NYMAAAJ

https://chromestatus.com/feature/5135990159835136?gate=5177450351558656

https://github.com/w3ctag/design-reviews/issues/976

https://github.com/whatwg/meta/issues/326#issuecomment-2377500295

https://github.com/whatwg/dom/pull/1307
