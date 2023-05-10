---
title: "UIのテストにアクセシビリティ情報が使われている理由"
emoji: "🐙"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["frontend", "test", "アクセシビリティ", "testinglibrary"]
published: false
---

[testing-library](https://testing-library.com/)や[Playwright](https://playwright.dev/)のようなライブラリでテストコードを書いている方は既にご存知かと思いますがテストコードを書く場合、通常の`querySelector()`や`getElementById()`などではなく`findByRole()`などのアクセシビリティ情報を利用して要素の取得を行うことが一般的になってきています。
この記事ではReactと[testing-library](https://testing-library.com/)を例にして、なぜUIのテストにアクセシビリティ情報が活用されているのかまとめてみようと思います。

アクセシブルなマークアップはマシンリーダビリティが高く、それがテストとの相性がよいという根本的な理屈があるのですが今回は具体的なメリットにフォーカスして記事を書いてみます。
UIのテストにアクセシビリティ情報が活用されている理由としては下記の様な理由があります。

- DOMとCSS両方を考慮したテストが行える
- 壊れづらいテストが書ける
- 自然とアクセシブルなアプリケーションになる

## DOMとCSS両方を考慮したテストが書ける

この項目を理解するためには若干アクセシビリティに関しての知識が必要になります。
というのも、`findByRole`などで取得しているアクセシビリティ情報はDOMの構造とは異なるAOM(Accessibility Object Model)というドキュメントモデルを参照しています。
AOMについての詳細な解説は行いませんが、テストを書く上で重要なのは
AOMはDOMとCSSOMの両方を参照して生成されるという性質です。

例として、下記のように要素は存在するが見えないボタンが存在したとします。

<!-- TODO:コードが正しいか後で検証 -->
```tsx:Button.tsx
import type { FC } from "react";

export const Button: FC = () => {
  return <button style={{opacity: 0}}>テキスト</button>
}
```

この場合、通常のDOMからのアクセスの場合は要素を取得できますが、視覚情報としてアクセスできないと判断されAOM上から要素は除外されています。
そのため下記のようなテストを行った場合、テストは失敗します。

<!-- TODO:コードが正しいか後で検証 -->
```tsx:Button.test.tsx
import { render, screen } from '@testing-library/react';
import { Button } from "../Button";

test('ボタンが表示されること', () => {
  render(<Button />);
  const button = screen.queryByRole('button');
  // AOM上から要素は除外されるため null が代入される。
  expect(button).not.toBe(null);
  // null !== null はfalseになるためテストが失敗する。
});
```

このようにAOMはDOMとCSSOMの両方を元に作成されるため、より実態に基づいたテストを行うことができます。

## より壊れづらいテストが書ける

この項目は前の項目と被る部分も多いですが、アクセシビリティ情報を元にしたテストはリファクタリングにも強いという側面があります。
例として、下記のようなモーダルダイアログコンポーネントを参考にリファクタリング例を紹介します。

<!-- TODO:コードが正しいか後で検証 -->
```tsx:Dialog.tsx
import type { FC, ReactNode } from "react";

type Props = {
  children: ReactNode;
  open: boolean;
};

export const Dialog: FC<Props> = (props: Props) => {
  return (
    <div style={{ display: props.open ? "block" : "none" }}>
      <div role="dialog" aria-modal="true">
        {props.children}
      </div>
    </div>
  );
};
```

HTMLにはネイティブの`<dialog>`要素が存在しますが、[15.4以前のSafari](https://caniuse.com/dialog)に対応する必要があり自前で実装を行ったコンポーネントが存在するとします。

<!-- TODO:コードが正しいか後で検証 -->
```tsx:Dialog.test.tsx
import { render, screen } from '@testing-library/react';
import { Dialog } from "../Dialog";

test('初期状態で表示されるようpropsを渡した場合ダイアログが表示されること', () => {
  render(<Dialog open>text</Dialog>);
  // render(<dialog open>text</dialog>) としても結果は変わらない
  const dialog = screen.queryByRole('dialog');
  expect(dialog).not.toBe(null);
});
```

このコンポーネントをネイティブの`<dialog>`要素に変更する作業が発生した場合
要素は`<div role="dialog">`から`<dialog>`に変更されますが、テストを書き換えずにリファクタリングを行うことができます。

このように設計段階からこのコンポーネントが**何であるか、もしくはどのような状態を持つのか**ということをRoleやaria属性として持っておき、それをテストすることにより壊れやすい[実装の詳細に依存したテスト](https://zenn.dev/pandanoir/articles/fe052e716d5c87)ではなく、変わりづらい意味を確認するテストを書くことができます。

https://zenn.dev/pandanoir/articles/fe052e716d5c87

## 自然とアクセシブルなアプリケーションになる

このようにテストにアクセシビリティ情報を活用すると、アクセシブルなコンポーネントでないとテストが書けず、開発が進められないという状態になります。
テストで利用するような、暗黙のロール・明示的にロールを設定したほうがいいUIなどについては[MDN](https://developer.mozilla.org/ja/docs/Learn/Accessibility/HTML)や[APG](https://www.w3.org/WAI/ARIA/apg/)などを読めば、ある程度理解できる内容になっているためそこまで学習コストも高くないと思います。
実務ではより複雑なUIを作ることになるかもしれませんが、基本的にフロントエンドエンジニアであるならば必要とされていなくても常にアクセシブルなUIを書くべきです。

テストの観点としてもテストが書きづらい（書けない）場合は、コンポーネントの設計・実装が良くないのではないか、と考えられる習慣をつけることは重要だと考えます。
そういった意味でもアクセシビリティ情報を活用した意味によるテストというのは今後のフロントエンドテストにおいて基本的な考え方になっていくと感じています。
