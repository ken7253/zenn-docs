---
title: "moveBeforeについて"
emoji: "🦁"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["html", 'dom']
published: false
---

## 新しく実装が進むNode.prototype.moveBeforeメソッド

`Node.prototype.moveBefore()` とは新しくNodeインターフェースに追加されるメソッドで [`Node.prototype.insertBefore()`](https://developer.mozilla.org/ja/docs/Web/API/Node/insertBefore) と同様のシグネチャーで**要素の状態を維持しつつ**ノードの移動ができるAPIです。

https://developer.mozilla.org/ja/docs/Web/API/Node/insertBefore

「**要素の状態を維持しつつ**ノードの移動ができる」という表現が想像できない人もいるかもしれませんが具体的な例としては、Xのこのポストに付随している動画を見ていただけるとわかりやすいかと思います。

https://x.com/domfarolino/status/1790407887740666335

注目していただきたい点としては、要素が左右に移動した際にアニメーションの状態が保持されている点で、右側のブロックにいるときに動いた量が左側のブロックに移動した際にも反映されていることが確認できるかと思います。

このように `moveBefore()` では操作対象の内部状態を維持したまま要素を移動できるため、アニメーションの状態や `iframe` で読み込んだ外部リソースの状態などを維持したままノードの移動が行えます。

またこの操作は特定のノードを取り除いたあとに別のノードに挿入するという挙動をとるため、既存の `Node.prototype.removeChild()` と `Node.prototype.insertBefore()` をまとめて行うことのできるメソッドとも捉えられます。

### 確認方法

記事公開時点ではこのメソッドはchromeのCanary版(v133以降)で Atomic DOM move (Node.moveBefore) というフラグを有効化することで確認ができます。

先程のポストのデモは[実際のサイト](https://state-preserving-atomic-move.glitch.me/)で確認できますので気になる方は、ぜひ環境を用意して実際に動作を確かめてみてください。

::: message
自分が確認した時点(2024/11/30)ではテキスト選択やPopoverなどまだ動いていない機能がいくつか存在していました。
:::

https://state-preserving-atomic-move.glitch.me/

### chrome以外のブラウザの反応

standard position を確認するとmozilaチームはpositive[^1]を、webkitチームはsupport[^2]をそれぞれ合意が取れており、残すは実装を待つのみという状況です。

[^1]: https://github.com/mozilla/standards-positions/issues/1053
[^2]: https://github.com/WebKit/standards-positions/issues/375

<!-- TODO: standard position に付いての説明を軽くする -->
:::details standard positionについて補足

https://github.com/WebKit/standards-positions/blob/main/README.md

https://github.com/mozilla/standards-positions/blob/main/README.md

:::

## まとめ

[TPACでも言及](https://github.com/whatwg/meta/issues/326#:~:text=Mason%3A%20this%20is,asked%20about%20retrofitting)があったように、このAPIはフレームワーク側での利用が期待されています。

そのため開発者が直接利用する機会は少ないかと思われますが、これからのフレームワークの進化に貢献する重要な機能だと感じたので簡単に内容を記事にまとめてみました。
現時点では[React](https://gist.github.com/gaearon/ad9347f1f809b6fe5af15bb911bbaf6b#moving-and-reparenting-without-losing-state)/[Angular](https://github.com/whatwg/dom/issues/1255#issuecomment-2044930653)/[htmx](https://htmx.org/examples/move-before/)などがこのAPIに関心を寄せています。

## 参考資料

- [Intent to Ship: DOM `moveBefore()` method, for state-preserving atomic move](https://groups.google.com/a/chromium.org/g/blink-dev/c/YE_xLH6MkRs/m/_7CD0NYMAAAJ)
- [DOM State-Preserving Move - Chrome Platform Status](https://chromestatus.com/feature/5135990159835136?gate=5177450351558656)
- [TPAC 2024 meeting · Issue #326 · whatwg/meta](https://github.com/whatwg/meta/issues/326#issuecomment-2377500295)
- [Introduce moveBefore() state-preserving atomic move API](https://github.com/whatwg/dom/pull/1307)
