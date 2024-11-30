---
title: "フロントエンドフレームワークから実装が求められているmoveBeforeメソッドとはなにか"
emoji: "🏃"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["html", 'dom', 'javascript']
published: false
---

皆さんは新しく実装が進む `Node.prototype.moveBefore` というメソッドをご存知でしょうかこの記事ではこの新しいメソッドについて紹介させていただきます。
## 新しく実装が進む `Node.prototype.moveBefore` メソッド

`Node.prototype.moveBefore()` とは新しく Node インターフェースに追加されるメソッドで [`Node.prototype.insertBefore()`](https://developer.mozilla.org/ja/docs/Web/API/Node/insertBefore) と同様のシグネチャーで**要素の状態を維持しつつ**ノードの移動ができる API です。

https://developer.mozilla.org/ja/docs/Web/API/Node/insertBefore

「**要素の状態を維持しつつ**ノードの移動ができる」という表現が想像できない人もいるかもしれませんが具体的な例としては、X のこのポストに付随している動画を見ていただけるとわかりやすいかと思います。

https://x.com/domfarolino/status/1790407887740666335

注目していただきたい点としては、要素が左右に移動した際にアニメーションの状態が保持されている点です。
右側のブロックにいるときに動いた量が左側のブロックに移動した際にも反映されていることが確認できるかと思います。

このように `moveBefore()` では操作対象の内部状態を維持したまま要素を移動できるため、アニメーションの状態や `iframe` で読み込んだ外部リソースの状態、テキストの選択状況やフォーカスの状態などを維持したままノードの移動が行えます。

またこの操作は特定のノードを取り除いたあとに別のノードに挿入するという挙動をとるため、既存の `Node.prototype.removeChild()` と `Node.prototype.insertBefore()` をまとめて行うことのできるメソッドとも捉えられます。

![moveBeforeの簡単な挙動イメージ](/images/articles/node-move-before/node-move-before.png)
*remove と insert の挙動の組み合わせであることが分かる*

<!-- https://excalidraw.com/#json=zVFQK303hKGcncZjm6opq,TjlxC7FPeZOK7CYYvMqQZA -->

### 確認方法

このメソッドは chrome 133 以降（記事公開時点では Canary 版にて）で Atomic DOM move (Node.moveBefore) というフラグを有効化することで一部の挙動を確認ができます。

先程のポストのデモは[実際のサイト](https://state-preserving-atomic-move.glitch.me/)で確認できますので気になる方は、ぜひ環境を用意して実際に動作を確かめてみてください。

::: message
自分が確認した時点(2024/11/30)ではテキスト選択や Popover などまだ動いていない機能がいくつか存在していました。
:::

https://state-preserving-atomic-move.glitch.me/

### chrome以外のブラウザの反応

standard position を確認すると mozilla チームは positive[^1] を、webkit チームは support[^2] を示しており概ね合意が取れていそうな雰囲気を感じますので、残すは実装を待つのみかと思います。

[^1]: https://github.com/mozilla/standards-positions/issues/1053
[^2]: https://github.com/WebKit/standards-positions/issues/375

<!-- TODO: standard position に付いての説明を軽くする -->
:::details standard position について補足

standard position とは提案された新しい仕様に対しての mozilla や webkit のチームがどのように考えているかを表明する場です。

基本的に該当のリポジトリ内で issue として議論がスタートし、最終的にポジションが決まるという流れになっています。

- [mozilla/standards-positions](https://github.com/mozilla/standards-positions)
- [WebKit/standards-positions](https://github.com/WebKit/standards-positions)

ポジションは下記のような分類になっており、これを見ることで実装まで進みそうかなどのある程度の予測がつく時があります。

|         | 肯定的     | 中立[^3]  | 否定的     |
| ------- | ---------- | --------- | ---------- |
| webkit  | `support`  | `neutral` | `oppose`   |
| mozilla | `positive` | `neutral` | `negative` |

[^3]: 中立というよりかは価値を感じていないに近い

:::

## まとめ

[TPAC でも言及](https://github.com/whatwg/meta/issues/326#:~:text=Mason%3A%20this%20is,asked%20about%20retrofitting)があったように、この API はフレームワーク側での利用が期待されており、現時点では [React](https://gist.github.com/gaearon/ad9347f1f809b6fe5af15bb911bbaf6b#moving-and-reparenting-without-losing-state)/[Angular](https://github.com/whatwg/dom/issues/1255#issuecomment-2044930653)/[htmx](https://htmx.org/examples/move-before/) などがこの API に関心を寄せています。

そのため開発者が直接利用する機会は少ないかと思われますが、これからのフレームワークの進化に貢献する重要な機能だと感じたので簡単に内容を記事にまとめてみました。

## 参考資料

- [Intent to Ship: DOM `moveBefore()` method, for state-preserving atomic move](https://groups.google.com/a/chromium.org/g/blink-dev/c/YE_xLH6MkRs/m/_7CD0NYMAAAJ)
- [DOM State-Preserving Move - Chrome Platform Status](https://chromestatus.com/feature/5135990159835136?gate=5177450351558656)
- [TPAC 2024 meeting · Issue #326 · whatwg/meta](https://github.com/whatwg/meta/issues/326#issuecomment-2377500295)
- [Introduce moveBefore() state-preserving atomic move API](https://github.com/whatwg/dom/pull/1307)
