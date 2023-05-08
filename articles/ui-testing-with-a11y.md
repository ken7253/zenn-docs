---
title: "UIのテストにアクセシビリティ情報が使われている理由"
emoji: "👋"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["frontend", "test", "アクセシビリティ", "testinglibrary"]
published: false
---

[testing-library](https://testing-library.com/)や[Playwright](https://playwright.dev/)のようなライブラリでテストコードを書いている方は既にご存知かと思いますがテストコードを書く場合、通常の`querySelector()`や`getElementById()`などではなく`findByRole()`などのアクセシビリティ情報を利用して要素の取得を行うことが一般的になってきています。
この記事ではReactと[testing-library](https://testing-library.com/)を例にして、なぜUIのテストにアクセシビリティ情報が活用されているのかまとめてみようと思います。

UIのテストにアクセシビリティ情報が活用されている理由としては下記の様な理由があります。

- DOMとCSS両方を考慮したテストが行える
- 壊れづらいテストが書ける
- 正確なテストコードが書けると自然とアクセシブルなアプリケーションになる

## DOMとCSS両方を考慮したテストが書ける

この項目を理解するためには若干アクセシビリティに関しての知識が必要になります。
というのも、`findByRole`などで取得しているアクセシビリティ情報はDOMの構造とは異なるAOM(Accessibility Object Model)というドキュメントモデルを参照しています。
AOMについての詳細な解説は行いませんが、テストを書く上で重要なのは
AOMはDOMとCSSOMの両方を参照して生成されるという性質です。

例として、下記のように要素は存在するが見えないボタンが存在したとします。

```tsx:Button.tsx
import type { FC } from 'react';

export const Button:FC = () => {
  return <button style="opacity: 0;">テキスト</button>;
}
```

この場合、通常のDOMからのアクセスの場合は要素を取得できますが、視覚情報としてアクセスできないと判断されAOM上から要素は除外されています。
そのため下記のようなテストを行った場合、テストは失敗します。

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

```tsx
import type { FC } from "react";

type Props = {
  children: ReactNode;
}

export const Dialog: FC<Props> = (props: Props) => {
  return (
    <div>
      <div role="dialog">
        { props.children }
      </div>
    </div>
  )
}
```

モーダルダイアログとしては`dialog`要素が存在しますが、
